import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import { generatePDFBuffer } from '@/lib/pdfGenerator';

interface SubmitBody {
  name: string;
  email: string;
  phone: string;
  score: number;
  level: string;
  weakAreas: string[];
  recommendations?: { title: string; description: string }[];
  answers?: { questionId: number; score: number }[];
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
    subject: 'Your Crisis Readiness Assessment Report',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#021940;padding:30px;border-radius:8px 8px 0 0;text-align:center;">
          <img src="cid:logo" alt="Maple Learning Solutions" style="width:140px; margin-bottom:16px;" />
          <h1 style="color:#d7b55b;margin:0;font-size:22px;">Crisis Readiness Assessment</h1>
          <p style="color:#cbd5e1;margin:8px 0 0;font-size:20px;">Maple Learning Solutions</p>
        </div>
        <div style="background:#f8fafc;padding:30px;">
          <p style="font-size:16px;margin-top:0;">Hi <strong>${params.name}</strong>,</p>
          <p>Thank you for completing the Crisis Readiness Assessment.</p>
          <p>Please find your detailed report attached. It includes:</p>
          <ul>
            <li>Your overall readiness score</li>
            <li>Key areas for improvement</li>
            <li>Recommended training modules</li>
          </ul>
          <p>Our team of GCC crisis management experts is available to help you build a customized training roadmap.</p>
          <a href="https://www.maplelearningsolutions.com/ar/elearning-solutions-in-uae#cta-ae" 
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

// ---------- Route Handler ----------
export async function POST(req: NextRequest) {
  console.log('SUBMIT API HIT', new Date().toISOString());
  try {
    const body: SubmitBody = await req.json();
    const { name, email, phone, score, level, weakAreas, recommendations } = body;

    // Validate required fields
    if (!name || !email || !phone || score === undefined || !level) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Generate PDF (shared generator — identical to download PDF)
    console.log('Recommendations passed:', recommendations);
    const pdfBuffer = await generatePDFBuffer({ name, email, phone, score, level, weakAreas, recommendations });

    // 2. Run email + sheets in parallel (graceful failure)
    const results = await Promise.allSettled([
      sendEmail({ to: email, name, pdfBuffer }),
      sendToGoogleSheets({ name, email, phone, score, level, weakAreas }),
    ]);

    const emailResult = results[0];
    const sheetsResult = results[1];

    const warnings: string[] = [];
    if (emailResult.status === 'rejected') {
      console.error('[submit-assessment] Email failed:', emailResult.reason);
      warnings.push(`Email: ${(emailResult.reason as Error).message}`);
    }
    if (sheetsResult.status === 'rejected') {
      console.error('[submit-assessment] Sheets failed:', sheetsResult.reason);
      warnings.push(`Sheets: ${(sheetsResult.reason as Error).message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      ...(warnings.length > 0 && { warnings }),
    });
  } catch (err) {
    console.error('[submit-assessment] Unexpected error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
