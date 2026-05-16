import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export interface TemplateSpec {
  slug: "4x6" | "a4" | "letter";
  label: string;
  widthIn: number;
  heightIn: number;
  widthMm: number;
  heightMm: number;
}

export interface TestPrintPackItem {
  id: string;
  filename: string;
  printer: string;
  sheet: TemplateSpec;
  barcode: string;
}

export const templateSpecs: TemplateSpec[] = [
  { slug: "4x6", label: "4×6", widthIn: 4, heightIn: 6, widthMm: 101.6, heightMm: 152.4 },
  { slug: "a4", label: "A4", widthIn: 8.27, heightIn: 11.69, widthMm: 210, heightMm: 297 },
  { slug: "letter", label: "Letter", widthIn: 8.5, heightIn: 11, widthMm: 215.9, heightMm: 279.4 },
];

export function getTemplateSpec(slug: string) {
  return templateSpecs.find((spec) => spec.slug === slug);
}

const printerVariants = ["Rollo", "Zebra GK420d", "DYMO 4XL", "Munbyn", "Brother QL", "Laser printer"];
const barcodeVariants = ["Code 128", "QR return", "USPS IMpb", "FBA carton", "UPC-A"];

export const testPrintPackItems: TestPrintPackItem[] = templateSpecs.flatMap((sheet) =>
  printerVariants.flatMap((printer) =>
    barcodeVariants.map((barcode) => {
      const id = `${sheet.slug}-${printer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${barcode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

      return {
        id,
        filename: `slh-test-print-${id}.pdf`,
        printer,
        sheet,
        barcode,
      };
    }),
  ),
);

const slate = rgb(0.02, 0.06, 0.14);
const muted = rgb(0.29, 0.35, 0.43);
const light = rgb(0.74, 0.79, 0.86);
const red = rgb(0.86, 0.15, 0.15);
const sky = rgb(0.03, 0.41, 0.59);

function mm(value: number) {
  return (value / 25.4) * 72;
}

function drawCenteredText(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = slate) {
  const { width } = page.getSize();
  page.drawText(text, { x: (width - font.widthOfTextAtSize(text, size)) / 2, y, size, font, color });
}

function drawCornerMarker(page: PDFPage, x: number, y: number, inwardX: 1 | -1, inwardY: 1 | -1) {
  const length = 16;
  page.drawLine({ start: { x, y }, end: { x: x + inwardX * length, y }, thickness: 0.75, color: red });
  page.drawLine({ start: { x, y }, end: { x, y: y + inwardY * length }, thickness: 0.75, color: red });
  page.drawLine({ start: { x: x - inwardX * 4, y }, end: { x: x + inwardX * 4, y }, thickness: 0.5, color: red });
  page.drawLine({ start: { x, y: y - inwardY * 4 }, end: { x, y: y + inwardY * 4 }, thickness: 0.5, color: red });
}

function drawCenterCrosshair(page: PDFPage, centerX: number, centerY: number) {
  page.drawLine({ start: { x: centerX - 18, y: centerY }, end: { x: centerX + 18, y: centerY }, thickness: 1, color: red });
  page.drawLine({ start: { x: centerX, y: centerY - 18 }, end: { x: centerX, y: centerY + 18 }, thickness: 1, color: red });
}

function drawReferenceLine(page: PDFPage, x: number, y: number, font: PDFFont, label = "100 mm reference line") {
  const lineWidth = mm(100);
  const { width } = page.getSize();
  const endX = Math.min(width - x, x + lineWidth);
  page.drawLine({ start: { x, y }, end: { x: endX, y }, thickness: 2, color: slate });
  page.drawLine({ start: { x, y: y - 5 }, end: { x, y: y + 5 }, thickness: 1, color: slate });
  page.drawLine({ start: { x: endX, y: y - 5 }, end: { x: endX, y: y + 5 }, thickness: 1, color: slate });
  page.drawText(label, { x, y: y - 15, size: 8, font, color: muted });
}

function drawTenMmTicks(page: PDFPage, x: number, y: number, count: number, font: PDFFont) {
  for (let index = 0; index <= count; index += 1) {
    const tickX = x + mm(index * 10);
    const longTick = index % 5 === 0;
    page.drawLine({ start: { x: tickX, y }, end: { x: tickX, y: y + (longTick ? 12 : 7) }, thickness: 0.5, color: light });
    if (longTick) page.drawText(`${index * 10}`, { x: tickX - 4, y: y + 15, size: 6, font, color: muted });
  }
}

function drawQuietZoneGuide(page: PDFPage, x: number, y: number, width: number, height: number, font: PDFFont) {
  page.drawRectangle({ x, y, width, height, borderColor: light, borderWidth: 0.75 });
  page.drawRectangle({ x: x + 18, y: y + 12, width: width - 36, height: height - 24, borderColor: sky, borderWidth: 0.5 });
  page.drawText("Quiet-zone guide", { x: x + 4, y: y + height + 5, size: 7, font, color: muted });
}

function drawSyntheticBarcode(page: PDFPage, x: number, y: number, width: number, height: number) {
  for (let i = 0; i < 32; i += 1) {
    const barWidth = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
    const barX = x + i * (width / 34);
    page.drawRectangle({ x: barX, y, width: barWidth, height: height - (i % 4) * 4, color: slate });
  }
}

export async function createBlankTemplatePdf(spec: TemplateSpec, options: { watermark?: boolean } = {}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([spec.widthIn * 72, spec.heightIn * 72]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = Math.min(24, Math.max(16, width * 0.06));
  const centerX = width / 2;
  const centerY = height / 2;

  page.drawRectangle({ x: margin, y: margin, width: width - margin * 2, height: height - margin * 2, borderColor: slate, borderWidth: 0.9 });
  drawCornerMarker(page, margin, margin, 1, 1);
  drawCornerMarker(page, width - margin, margin, -1, 1);
  drawCornerMarker(page, margin, height - margin, 1, -1);
  drawCornerMarker(page, width - margin, height - margin, -1, -1);
  drawCenterCrosshair(page, centerX, centerY);
  drawReferenceLine(page, margin + 6, Math.max(margin + 46, centerY - 54), font);
  drawTenMmTicks(page, margin + 6, height - margin - 48, Math.min(10, Math.floor((width - margin * 2 - 12) / mm(10))), font);
  if (spec.slug === "4x6") drawQuietZoneGuide(page, margin + 24, centerY + 42, width - margin * 2 - 48, 54, font);

  page.drawText(`${spec.label} diagnostic shipping label template`, { x: margin, y: height - margin - 18, size: 12, font: boldFont, color: slate });
  page.drawText(`${spec.widthMm} × ${spec.heightMm} mm · ${spec.widthIn} × ${spec.heightIn} in`, { x: margin, y: height - margin - 32, size: 8, font, color: muted });
  page.drawText("Print at 100% / Actual Size. Do not use Fit to Page.", { x: margin, y: margin + 22, size: 8, font: boldFont, color: slate });
  page.drawText("After printing: measure the 100 mm line, confirm all corner marks are visible, then print real postage.", { x: margin, y: margin + 10, size: 6.5, font, color: muted });

  if (options.watermark) drawCenteredText(page, "FREE PREVIEW", centerY - 8, boldFont, 20, rgb(0.7, 0.74, 0.8));

  return pdf.save();
}

export async function createCalibrationPdf(spec: TemplateSpec, printer: string, watermark = true) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([spec.widthIn * 72, spec.heightIn * 72]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = Math.min(30, Math.max(18, width * 0.065));
  const centerX = width / 2;
  const centerY = height / 2;

  page.drawText("Shipping Label Helper Calibration Sheet", { x: margin, y: height - margin, size: 13, font: boldFont, color: slate });
  page.drawText(`${spec.label} sheet · ${printer} · watermarked preview`, { x: margin, y: height - margin - 18, size: 9, font, color: muted });
  page.drawRectangle({ x: margin, y: margin, width: width - margin * 2, height: height - margin * 2, borderColor: slate, borderWidth: 0.75 });
  drawCornerMarker(page, margin, margin, 1, 1);
  drawCornerMarker(page, width - margin, margin, -1, 1);
  drawCornerMarker(page, margin, height - margin, 1, -1);
  drawCornerMarker(page, width - margin, height - margin, -1, -1);
  drawCenterCrosshair(page, centerX, centerY);
  drawReferenceLine(page, margin, centerY - 42, font);
  drawTenMmTicks(page, margin, height - margin - 52, Math.min(12, Math.floor((width - margin * 2) / mm(10))), font);
  drawQuietZoneGuide(page, centerX - Math.min(140, width * 0.32) / 2, centerY + 34, Math.min(140, width * 0.32), 62, font);

  page.drawText("Measure after printing:", { x: margin, y: margin + 52, size: 9, font: boldFont, color: slate });
  page.drawText("1. 100 mm line measures 100 mm  2. Border is not clipped  3. Center mark is centered", { x: margin, y: margin + 38, size: 7, font, color: muted });
  page.drawText("Visual barcode guide is for density/quiet-zone layout only; it is not scanner certification.", { x: margin, y: margin + 24, size: 7, font, color: muted });

  if (watermark) drawCenteredText(page, "FREE PREVIEW", centerY - 8, boldFont, 20, rgb(0.7, 0.74, 0.8));

  return pdf.save();
}

export async function createTestPrintPdf(item: TestPrintPackItem, watermark = false) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([item.sheet.widthIn * 72, item.sheet.heightIn * 72]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = Math.min(28, Math.max(16, width * 0.06));
  const centerX = width / 2;
  const centerY = height / 2;
  const barcodeWidth = Math.min(width - margin * 2 - 24, 220);
  const quietZone = 18;
  const barStartX = centerX - barcodeWidth / 2;
  const barY = centerY + 22;

  page.drawText("Shipping Label Helper Test Print", { x: margin, y: height - margin, size: 13, font: boldFont, color: slate });
  page.drawText(`${item.sheet.label} sheet • ${item.printer} • ${item.barcode}`, { x: margin, y: height - margin - 18, size: 9, font, color: muted });
  page.drawText("Print at 100% / Actual Size. Disable Fit to Page.", { x: margin, y: margin + 10, size: 8, font, color: muted });

  page.drawRectangle({ x: margin, y: margin, width: width - margin * 2, height: height - margin * 2, borderColor: slate, borderWidth: 0.75 });
  drawCornerMarker(page, margin, margin, 1, 1);
  drawCornerMarker(page, width - margin, margin, -1, 1);
  drawCornerMarker(page, margin, height - margin, 1, -1);
  drawCornerMarker(page, width - margin, height - margin, -1, -1);
  drawCenterCrosshair(page, centerX, centerY);
  drawReferenceLine(page, margin, centerY - 42, font);

  page.drawRectangle({ x: barStartX - quietZone, y: barY - 12, width: barcodeWidth + quietZone * 2, height: 56, borderColor: light, borderWidth: 0.75 });
  page.drawText("Quiet zone", { x: barStartX - quietZone + 3, y: barY + 48, size: 6, font, color: muted });
  page.drawText("Quiet zone", { x: barStartX + barcodeWidth - 24, y: barY + 48, size: 6, font, color: muted });

  drawSyntheticBarcode(page, barStartX, barY, barcodeWidth, 42);

  page.drawText(`${item.barcode} visual guide — not a scannable carrier barcode`, { x: barStartX, y: barY - 26, size: 8, font: boldFont, color: slate });
  page.drawText(item.id.toUpperCase(), { x: barStartX, y: barY - 39, size: 7, font, color: muted });
  page.drawText("If this prints small, clipped, gray or off-center, fix scale/density/alignment before real postage.", { x: margin, y: margin + 24, size: 7, font, color: muted });

  if (watermark) {
    page.drawText("FREE PREVIEW", { x: centerX - 48, y: centerY - 6, size: 18, font: boldFont, color: rgb(0.7, 0.74, 0.8), opacity: 0.6 });
  }

  return pdf.save();
}
