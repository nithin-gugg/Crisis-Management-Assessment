import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface ReportData {
  name: string;
  email: string;
  phone: string;
  score: number;
  level: string;
  weakAreas: string[];
  recommendations?: { title: string; description: string }[];
}

/**
 * Single source of truth for PDF generation.
 * Used by both /api/generate-pdf (download) and /api/submit-assessment (email attachment).
 */
export async function generatePDFBuffer(data: ReportData): Promise<Buffer> {
  console.log('PDF GENERATED FROM SHARED FUNCTION');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // --- Logo (optional) ---
  let logoImg: Awaited<ReturnType<typeof pdfDoc.embedPng>> | null = null;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImg = await pdfDoc.embedPng(logoBytes);
    }
  } catch {
    // Logo is non-critical
  }

  const navyR = 2 / 255, navyG = 25 / 255, navyB = 64 / 255;
  const goldR = 215 / 255, goldG = 181 / 255, goldB = 91 / 255;

  // ---- HEADER ----
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(navyR, navyG, navyB) });

  if (logoImg) {
    const logoWidth  = 80;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    page.drawImage(logoImg, { x: 30, y: height - 40 - (logoHeight / 2), width: logoWidth, height: logoHeight });
  }

  page.drawText('Your Workforce Resilience Score Report', {
    x: logoImg ? 125 : 30,
    y: height - 44, // Baseline aligned
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Generated: ${new Date().toLocaleDateString('en-GB')}`, {
    x: width - 150,
    y: height - 44, // Same baseline as title
    size: 9,
    font: fontReg,
    color: rgb(goldR, goldG, goldB),
  });

  let y = height - 110;
  const leftMar = 40;

  // ---- ASSESSMENT DETAILS ----
  page.drawText('Assessment Details', { x: leftMar, y, size: 13, font: fontBold, color: rgb(navyR, navyG, navyB) });
  y -= 6;
  page.drawRectangle({ x: leftMar, y, width: width - 80, height: 1, color: rgb(goldR, goldG, goldB) });
  y -= 20;

  for (const [label, value] of [
    ['Name',  data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Date',  new Date().toLocaleDateString('en-GB')],
  ]) {
    page.drawText(`${label}:`, { x: leftMar,  y, size: 10, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(value,       { x: 120,       y, size: 10, font: fontReg,  color: rgb(0.1, 0.1, 0.1) });
    y -= 16;
  }
  y -= 10;

  // ---- READINESS SUMMARY ----
  page.drawText('Readiness Summary', { x: leftMar, y, size: 13, font: fontBold, color: rgb(navyR, navyG, navyB) });
  y -= 6;
  page.drawRectangle({ x: leftMar, y, width: width - 80, height: 1, color: rgb(goldR, goldG, goldB) });
  y -= 22;

  page.drawText(`Total Score: ${data.score} / 30`, { x: leftMar, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  y -= 16;

  const levelColor =
    data.level === 'High'     ? rgb(0.1, 0.6, 0.2) :
    data.level === 'Moderate' ? rgb(goldR, goldG, goldB) :
                                rgb(0.8, 0.1, 0.1);

  page.drawText('Readiness Level: ', { x: leftMar, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(data.level,          { x: 155,     y, size: 12, font: fontBold, color: levelColor });
  y -= 28;

  // ---- KEY AREAS FOR IMPROVEMENT ----
  if (data.weakAreas.length > 0) {
    page.drawText('Key Areas for Improvement', { x: leftMar, y, size: 13, font: fontBold, color: rgb(navyR, navyG, navyB) });
    y -= 6;
    page.drawRectangle({ x: leftMar, y, width: width - 80, height: 1, color: rgb(goldR, goldG, goldB) });
    y -= 20;
    for (const area of data.weakAreas) {
      page.drawText(`• ${area}`, { x: leftMar + 10, y, size: 11, font: fontReg, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
    }
    y -= 12;
  }

  // ---- RECOMMENDED TRAINING MODULES ----
  if (data.recommendations && data.recommendations.length > 0) {
    page.drawText('Recommended Training Modules', { x: leftMar, y, size: 13, font: fontBold, color: rgb(navyR, navyG, navyB) });
    y -= 6;
    page.drawRectangle({ x: leftMar, y, width: width - 80, height: 1, color: rgb(goldR, goldG, goldB) });
    y -= 20;

    for (let i = 0; i < data.recommendations.length; i++) {
      const rec = data.recommendations[i];
      page.drawText(`${i + 1}. ${rec.title}`, { x: leftMar + 10, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 14;

      // Word-wrap description
      const words = rec.description.split(' ');
      let line = '';
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (fontReg.widthOfTextAtSize(candidate, 9) > width - 110) {
          page.drawText(line, { x: leftMar + 20, y, size: 9, font: fontReg, color: rgb(0.4, 0.4, 0.4) });
          y -= 12;
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) {
        page.drawText(line, { x: leftMar + 20, y, size: 9, font: fontReg, color: rgb(0.4, 0.4, 0.4) });
        y -= 12;
      }
      y -= 8;
    }
  }

  // ---- FOOTER ----
  page.drawRectangle({ x: 0, y: 0, width, height: 40, color: rgb(navyR, navyG, navyB) });

  if (logoImg) {
    const logoWidth  = 50;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    page.drawImage(logoImg, { x: 20, y: 10, width: logoWidth, height: logoHeight });
  }

  page.drawText('© Maple Learning Solutions  |  www.maplelearningsolutions.com', {
    x: 90, y: 14, size: 8, font: fontReg, color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('Page 1', { x: width - 60, y: 14, size: 8, font: fontReg, color: rgb(0.6, 0.6, 0.6) });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
