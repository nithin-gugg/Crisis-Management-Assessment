import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import { generatePDFBuffer } from '@/lib/pdfGenerator';
import { submitSchema } from '@/lib/validation';
import { verifyCaptcha } from '@/lib/captcha';
import { sanitizeInput } from '@/lib/sanitize';

// Simple in-memory rate limiting mechanism scoped via the API
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(ip);
  if (current && current.resetTime < now) {
    rateLimitMap.delete(ip);
  }

  const existing = rateLimitMap.get(ip);
  if (!existing) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (existing.count >= MAX_REQUESTS) {
    return false;
  }
  existing.count += 1;
  return true;
}

// ---------- Email Sending ----------
async function sendEmail(params: {
  to: string;
  name: string;
  pdfBuffer: Buffer;
}): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error('SMTP env vars not configured');

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: params.to,
    subject: 'Your Workforce Resilience Score',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#021940;padding:30px;border-radius:8px 8px 0 0;text-align:center;">
          <img src="cid:logo" alt="Maple Learning Solutions" style="width:140px; margin-bottom:16px;" />
          <h1 style="color:#d7b55b;margin:0;font-size:22px;">Workforce Resilience Assessment</h1>
          <p style="color:#cbd5e1;margin:8px 0 0;font-size:20px;">Maple Learning Solutions</p>
        </div>
        <div style="background:#f8fafc;padding:30px;">
          <p style="font-size:16px;margin-top:0;">Hi <strong>${params.name}</strong>,</p>
          <p>Thank you for completing the Workforce Resilience Assessment.</p>
          <p>Please find your detailed report attached. It includes:</p>
          <ul>
            <li>Your overall readiness score</li>
            <li>Key areas for improvement</li>
            <li>Recommended training modules</li>
          </ul>
          <p>Our team of GCC workforce resilience experts is available to help you build a customized training roadmap.</p>
          <a href="https://www.maplelearningsolutions.com/elearning-solutions-in-uae#cta-ae" 
             style="display:inline-block;background:#d7b55b;color:#021940;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">
            Book a Consultation
          </a>
        </div>
        <div style="background:#021940;padding:16px;border-radius:0 0 8px 8px;text-align:center;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">© Maple Learning Solutions | www.maplelearningsolutions.com</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(process.cwd(), 'public', 'logo.png'),
        cid: 'logo' // same cid value as in the html img src
      },
      {
        filename: `Assessment_Report_${params.name.replace(/\s+/g, '_')}.pdf`,
        content: params.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

// ---------- Sheets Webhook ----------
async function sendToGoogleSheets(data: {
  name: string;
  email: string;
  phone: string;
  score: number;
  level: string;
  weakAreas: string[];
}): Promise<void> {
  const { GOOGLE_WEBHOOK_URL } = process.env;
  if (!GOOGLE_WEBHOOK_URL) throw new Error('GOOGLE_WEBHOOK_URL not configured');

  const payload = {
    timestamp: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    score: data.score,
    level: data.level,
    weakAreas: data.weakAreas.join(', ')
  };

  const res = await fetch(GOOGLE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets webhook failed: ${res.status} - ${text}`);
  }
}

// ---------- Secured POST Route Handler ----------
export async function POST(req: NextRequest) {
  // 1. IP Based Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(ip)) {
    console.warn(`[RATE LIMIT] Exceeded maximum requests for IP: ${ip}`);
    return NextResponse.json({ success: false, error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
  }

  try {
    const rawBody = await req.json();

    // 2. Honeypot check
    // If the frontend honeypot field is filled, silently reject it acting like success 
    // to confuse automated forms without wasting server processing blocks
    if (rawBody.company_website && rawBody.company_website.length > 0) {
      console.warn(`[HONEYPOT] Failed validation hit from IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Assessment submitted successfully' }); 
    }

    // 3. Captcha Check
    if (!rawBody.captchaToken) {
      return NextResponse.json({ success: false, error: "Security verification failed. Please check the 'I am not a robot' box." }, { status: 400 });
    }
    const isHuman = await verifyCaptcha(rawBody.captchaToken);
    if (!isHuman) {
      console.warn(`[CAPTCHA] Failed validation hit from IP: ${ip}`);
      return NextResponse.json({ success: false, error: 'Failed security verification.' }, { status: 400 });
    }

    // 4. Zod Input Validation
    const validationResult = submitSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.warn(`[VALIDATION] Bad inputs from IP: ${ip}`, validationResult.error.flatten());
      return NextResponse.json({ success: false, error: 'Invalid formulation input parameters' }, { status: 400 });
    }

    // 5. Deep payload sanitization ensuring XSS logic removal for PDF safety
    const safeData = sanitizeInput(validationResult.data);
    const { name, email, phone, score, level, weakAreas, recommendations } = safeData;

    console.log(`[SUBMIT] Successfully validated human-request submitting for: ${email}`);

    // 6. Generate Secured PDF
    const pdfBuffer = await generatePDFBuffer({ name, email, phone, score, level, weakAreas, recommendations });

    // 7. Fire Integrations in Parallel
    const results = await Promise.allSettled([
      sendEmail({ to: email, name, pdfBuffer }),
      sendToGoogleSheets({ name, email, phone, score, level, weakAreas }),
    ]);

    const emailResult = results[0];
    const sheetsResult = results[1];

    if (emailResult.status === 'rejected') {
      console.error('[SUBMIT] Email failed deeply internally:', emailResult.reason);
    }
    if (sheetsResult.status === 'rejected') {
      console.error('[SUBMIT] Sheets failed deeply internally:', sheetsResult.reason);
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully'
    });
  } catch (error) {
    // 8. Safely Generic Server Errors
    console.error(`[SUBMIT] Unexpected internal route API error for IP ${ip}:`, error);
    return NextResponse.json({ success: false, error: 'Internal system error occurred.' }, { status: 500 });
  }
}
