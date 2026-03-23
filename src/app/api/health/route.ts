import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Crisis Readiness Assessment API',
    version: '1.0.0',
    endpoints: [
      'POST /api/submit-assessment',
      'POST /api/generate-pdf',
      'GET  /api/health',
    ],
  });
}
