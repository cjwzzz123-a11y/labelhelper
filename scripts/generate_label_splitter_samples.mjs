#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = process.cwd();
const outDir = path.join(root, "public/samples");
mkdirSync(outDir, { recursive: true });

const { LABEL_TEMPLATES } = await import(path.join(root, "data/label-templates.ts"));

const slate = rgb(0.02, 0.06, 0.14);
const muted = rgb(0.29, 0.35, 0.43);
const blue = rgb(0.05, 0.35, 0.75);
const orange = rgb(0.9, 0.38, 0.05);

function drawBarcode(page, x, y, width, height) {
  const widths = [3, 6, 2, 4, 8, 3, 5, 2, 7, 4, 3, 6, 2, 8, 4, 5, 3, 7, 4, 3, 6, 5];
  let cursor = x;
  widths.forEach((barWidth, index) => {
    if (index % 2 === 0) page.drawRectangle({ x: cursor, y, width: barWidth, height: height - (index % 3) * 5, color: slate });
    cursor += barWidth + width / 40;
  });
}

function regionBottomY(pageHeight, region) {
  return pageHeight - region.y - region.h;
}

function drawRegion(page, region, title, font, bold, color) {
  const { height } = page.getSize();
  const y = regionBottomY(height, region);
  page.drawRectangle({ x: region.x, y, width: region.w, height: region.h, borderColor: color, borderWidth: 2 });
  page.drawText(title, { x: region.x + 12, y: y + region.h - 24, size: 14, font: bold, color });
  page.drawText("Synthetic sample for Shipping Label Helper template verification", { x: region.x + 12, y: y + region.h - 42, size: 8, font, color: muted });
  drawBarcode(page, region.x + 34, y + Math.max(58, region.h * 0.28), Math.min(region.w - 68, 260), 58);
  page.drawText("TEST123456789", { x: region.x + 34, y: y + Math.max(36, region.h * 0.28 - 24), size: 10, font: bold, color: slate });
}

for (const template of LABEL_TEMPLATES) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(template.label);
  pdf.setSubject(template.signature.textPattern);
  const pageSize = template.pageSize === "Letter" ? [612, 792] : [595, 842];
  const page = pdf.addPage(pageSize);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  page.drawText(template.label, { x: 24, y: height - 24, size: 16, font: bold, color: slate });
  page.drawText(template.signature.textPattern, { x: 24, y: height - 42, size: 8, font, color: muted });
  page.drawRectangle({ x: 18, y: 18, width: width - 36, height: height - 36, borderColor: rgb(0.82, 0.87, 0.93), borderWidth: 1 });
  drawRegion(page, template.regions.postage, "POSTAGE LABEL", font, bold, blue);
  if (template.regions.customs) drawRegion(page, template.regions.customs, "CUSTOMS FORM CN22/CN23", font, bold, orange);
  page.drawText(`Template ID: ${template.id}`, { x: 24, y: 24, size: 8, font, color: muted });

  const bytes = await pdf.save();
  writeFileSync(path.join(outDir, template.sampleFilename), bytes);
}

console.log(`Generated ${LABEL_TEMPLATES.length} label splitter samples in ${path.relative(root, outDir)}`);
