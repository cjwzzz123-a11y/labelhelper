#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, ".planning/problem-finder-verification");
mkdirSync(outDir, { recursive: true });

const { buildPdfDiagnosticReport } = await import(path.join(root, "lib/pdf-diagnostics.ts"));

const copy = {
  vsExpected: "Vs. expected",
  expectedSize: "Expected size",
  scaleFactor: "Scale factor",
  margins: "Margins",
  quietZone: "Quiet zone",
  pdfShrinking: "shrinking",
  pdfGrowing: "enlarging",
  pdfExpected: "printing at expected scale",
  manualMargins: "Manual review required: this preview can read PDF page boxes, but it cannot measure rendered ink bounds yet.",
  manualBarcode: "Manual review required: use the quiet-zone checker for the >= 2.5mm white-space check.",
  recPrint100: "Print at 100% / Actual Size.",
  recFitOff: "Keep Fit to Page disabled.",
  recBarcode: "If scans still fail, verify barcode quiet zone on the printed label.",
  recCutOff: "If the label is cut off, confirm orientation and paper guides before buying postage again.",
};

function assertCase(condition, message) {
  if (!condition) throw new Error(message);
}

async function writePdf(filename, widthIn, heightIn) {
  const pdf = await PDFDocument.create();
  pdf.addPage([widthIn * 72, heightIn * 72]);
  const bytes = await pdf.save();
  const file = path.join(outDir, filename);
  writeFileSync(file, bytes);
  return file;
}

async function readFirstPageSize(file) {
  const pdf = await PDFDocument.load(readFileSync(file), { ignoreEncryption: true });
  const page = pdf.getPage(0);
  const { width, height } = page.getSize();
  return { pages: pdf.getPageCount(), widthIn: width / 72, heightIn: height / 72 };
}

function diagnosePdf(name, dimensions, expected) {
  return buildPdfDiagnosticReport({ name, source: "upload", pages: dimensions.pages, widthIn: dimensions.widthIn, heightIn: dimensions.heightIn }, copy, expected);
}

function scalePercent(current, target) {
  return Math.round((target / current) * 1000) / 10;
}

async function makeBarcode(filename, { left = 96, right = 96, dpi = 203 } = {}) {
  const width = left + 240 + right;
  const height = 180;
  const svg = [
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`,
    `<rect width="100%" height="100%" fill="white"/>`,
    `<g fill="#111827">`,
  ];
  let x = left;
  const widths = [4, 8, 3, 6, 10, 4, 7, 3, 9, 5, 4, 8, 3, 10, 5, 7, 4, 9, 6, 4, 8, 5];
  widths.forEach((barWidth, index) => {
    if (index % 2 === 0) svg.push(`<rect x="${x}" y="42" width="${barWidth}" height="96"/>`);
    x += barWidth + 8;
  });
  svg.push(`</g></svg>`);
  const file = path.join(outDir, filename);
  await sharp(Buffer.from(svg.join(""))).png().toFile(file);
  return { file, dpi, leftMm: left * 25.4 / dpi, rightMm: right * 25.4 / dpi };
}

function quietZoneVerdict({ leftMm, rightMm }) {
  const minimumMm = 2.5;
  const shortestMm = Math.min(leftMm, rightMm);
  return { minimumMm, shortestMm, pass: leftMm >= minimumMm && rightMm >= minimumMm };
}

const goodPdf = await writePdf("good-4x6.pdf", 4, 6);
const shrinkPdf = await writePdf("fit-to-page-shrunk-4x6.pdf", 3.72, 5.58);
const letterPdf = await writePdf("letter-label-sheet.pdf", 8.5, 11);

const goodReport = diagnosePdf("good-4x6.pdf", await readFirstPageSize(goodPdf), { key: "4x6", label: "4 × 6 in thermal label", zhLabel: "4 × 6 英寸热敏标签", width: 4, height: 6 });
const shrinkReport = diagnosePdf("fit-to-page-shrunk-4x6.pdf", await readFirstPageSize(shrinkPdf), { key: "4x6", label: "4 × 6 in thermal label", zhLabel: "4 × 6 英寸热敏标签", width: 4, height: 6 });
const letterReport = diagnosePdf("letter-label-sheet.pdf", await readFirstPageSize(letterPdf), { key: "4x6", label: "4 × 6 in thermal label", zhLabel: "4 × 6 英寸热敏标签", width: 4, height: 6 });

assertCase(goodReport.scalePercent === 100, "Good 4x6 PDF should report 100% scale.");
assertCase(goodReport.measurements[0].status === "pass", "Good 4x6 PDF should pass expected size.");
assertCase(shrinkReport.scalePercent === 93, "Shrunk PDF should report 93% scale.");
assertCase(shrinkReport.measurements[0].status === "fail", "Shrunk PDF should fail expected size.");
assertCase(letterReport.measurements[0].status === "fail", "Letter sheet should fail when expected is 4x6.");
assertCase(scalePercent(3.8, 4) === 105.3, "Scale calculator real case 3.8 -> 4 should be 105.3%.");

const goodBarcode = await makeBarcode("barcode-good-quiet-zone.png", { left: 96, right: 96 });
const tightBarcode = await makeBarcode("barcode-tight-quiet-zone.png", { left: 8, right: 8 });
const goodBarcodeVerdict = quietZoneVerdict(goodBarcode);
const tightBarcodeVerdict = quietZoneVerdict(tightBarcode);

assertCase(goodBarcodeVerdict.pass, "Good barcode sample should pass quiet zone threshold.");
assertCase(!tightBarcodeVerdict.pass, "Tight barcode sample should fail quiet zone threshold.");

const report = `# Problem Finder Real-Case Verification

Generated: ${new Date().toISOString()}

## Test Artifacts

- ${path.relative(root, goodPdf)}
- ${path.relative(root, shrinkPdf)}
- ${path.relative(root, letterPdf)}
- ${path.relative(root, goodBarcode.file)}
- ${path.relative(root, tightBarcode.file)}

## Real User Cases

| User problem | Input | Expected behavior | Actual result | Verdict |
|---|---|---|---|---|
| Seller has a correct 4x6 thermal label PDF | good-4x6.pdf | Pass size, 100% scale | ${goodReport.measurements[0].status}, ${goodReport.scalePercent}% | PASS |
| Seller printed with Fit to Page and label shrank | fit-to-page-shrunk-4x6.pdf | Fail size, recommend 100% / Actual Size | ${shrinkReport.measurements[0].status}, ${shrinkReport.scalePercent}% | PASS |
| Seller selected 4x6 but uploaded a Letter sheet PDF | letter-label-sheet.pdf | Fail expected 4x6 size | ${letterReport.measurements[0].status}, ${letterReport.scalePercent}% | PASS |
| Seller measured 4 inch edge as 3.8 inch | scale formula | Suggest 105.3% next test scale | ${scalePercent(3.8, 4)}% | PASS |
| Barcode image has enough whitespace | barcode-good-quiet-zone.png | Pass >= 2.5mm minimum | shortest ${goodBarcodeVerdict.shortestMm.toFixed(1)}mm | PASS |
| Barcode image is cropped too tight | barcode-tight-quiet-zone.png | Fail >= 2.5mm minimum | shortest ${tightBarcodeVerdict.shortestMm.toFixed(1)}mm | PASS |

## Report Assessment

The PDF "report" is useful only as a printable/downloadable diagnostic summary: file name, page count, detected page size, expected size, scale estimate, manual-review warnings, and recommendations.

It is not a full technical report because it does not inspect rendered ink bounds or barcode pixels inside PDFs. Product copy should call it a "diagnostic summary" unless those deeper checks are implemented.
`;

writeFileSync(path.join(outDir, "latest.md"), report);
console.log(report);
