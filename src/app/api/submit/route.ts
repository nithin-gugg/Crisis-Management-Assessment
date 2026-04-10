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
  level: string;
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
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;line-height:1.6;">
        <div style="background:#021940;padding:30px;border-radius:8px 8px 0 0;text-align:center;">
          <img src="cid:logo" alt="Maple Learning Solutions" style="width:140px; margin-bottom:16px;" />
          <h1 style="color:#d7b55b;margin:0;font-size:22px;">Maple Crisis Readiness Assessment</h1>
          <p style="color:#cbd5e1;margin:8px 0 0;font-size:18px;">Maple Learning Solutions</p>
        </div>
        <div style="background:#f8fafc;padding:30px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="font-size:16px;margin-top:0;">Hi <strong>${params.name}</strong>,</p>
          <p>Thank you for completing the Maple Crisis Readiness Assessment — we hope it was a valuable exercise for your organisation.</p>
          
          <p>Based on your responses, your organisation's current readiness level is:</p>
          
          <div style="background:#021940;color:#d7b55b;padding:20px;border-radius:12px;text-align:center;margin:25px 0;border:2px solid #d7b55b;">
            <span style="font-size:24px;vertical-align:middle;">🏅</span>
            <span style="font-size:18px;font-weight:bold;letter-spacing:1px;margin-left:10px;text-transform:uppercase;">READINESS LEVEL — ${params.level}</span>
          </div>

          <p>This reflects a solid foundation, and there is a clear, structured path to strengthening your organisation's crisis preparedness across your teams.</p>
          
          <p>Based on this result, we recommend the following next steps:</p>
          
          <ol style="padding-left:20px;">
            <li style="margin-bottom:12px;"><strong>Schedule a 30-minute results walkthrough</strong> — we'll take you through your scores by category and highlight where focused training will have the most impact.</li>
            <li style="margin-bottom:12px;"><strong>Explore our GCC Crisis Management Training Suite</strong> — 28 off-the-shelf courses across Business Continuity, Safety & Security, Mental Health, Remote Operations, and Healthcare Emergency Services, available in Arabic and English.</li>
            <li style="margin-bottom:12px;"><strong>Start with a targeted pilot</strong> — we can deploy a curated selection of courses aligned to your readiness level at no cost for 30 days, so your team can experience the content before any commitment.</li>
          </ol>

          <p style="margin-top:25px;">We'd love to be your partner on this journey. Would you be available for a short call this week?</p>
          
          <a href="https://www.maplelearningsolutions.com/elearning-solutions-in-uae#cta-ae" 
             style="display:inline-block;background:#d7b55b;color:#021940;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:15px;margin-bottom:10px;">
            Book a Consultation
          </a>
          
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-weight:bold;color:#021940;">Warm regards,</p>
            <p style="margin:5px 0 0;font-weight:bold;color:#d7b55b;">Maple Learning Solutions</p>
            <p style="margin:5px 0 0;font-size:14px;color:#64748b;">+ 91 6303 646670 | <a href="https://www.maplelearningsolutions.com" style="color:#64748b;text-decoration:none;">www.maplelearningsolutions.com</a></p>
          </div>
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
        filename: `Workforce_Resilience_Report_${params.name.replace(/\s+/g, '_')}.pdf`,
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
  phone?: string;
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
    phone: data.phone || '',
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
      console.error(`[VALIDATION ERROR] Zod failed for IP: ${ip}`, validationResult.error.format());
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid formulation input parameters',
        details: validationResult.error.format()
      }, { status: 400 });
    }

    // 5. Deep payload sanitization ensuring XSS logic removal for PDF safety
    const safeData = sanitizeInput(validationResult.data);
    const { name, email, phone, score, level, weakAreas, recommendations } = safeData;

    console.log(`[SUBMIT] Successfully validated human-request submitting for: ${email}`);

    // 6. Generate Secured PDF
    const pdfBuffer = await generatePDFBuffer({ name, email, phone, score, level, weakAreas, recommendations });

    // 7. Fire Integrations in Parallel
    const results = await Promise.allSettled([
      sendEmail({ to: email, name, level, pdfBuffer }),
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
