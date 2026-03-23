import { NextRequest, NextResponse } from 'next/server';
import { generatePDFBuffer } from '@/lib/pdfGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, score, level, weakAreas, recommendations } = body;

    if (!name || !email || score === undefined || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pdfBuffer = await generatePDFBuffer({
      name,
      email,
      phone: phone ?? '',
      score,
      level,
      weakAreas: weakAreas ?? [],
      recommendations,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Assessment_Report_${name.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[generate-pdf] Error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
