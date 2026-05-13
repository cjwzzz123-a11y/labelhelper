export type PdfDiagnosticStatus = "pass" | "warn" | "fail";

export interface PdfDiagnosticMeasurement {
  key: "expected_size" | "scale" | "margins" | "quiet_zone";
  label: string;
  status: PdfDiagnosticStatus;
  detail: string;
}

export interface CommonPdfSize {
  key: string;
  label: string;
  zhLabel: string;
  width: number;
  height: number;
}

export interface PdfDiagnosticReport {
  name: string;
  source: "sample" | "upload";
  pages: number;
  fileSizeMb?: number;
  widthIn: number;
  heightIn: number;
  expectedLabel: string;
  expectedSource: "query" | "auto" | "sample";
  expectedWidthIn: number;
  expectedHeightIn: number;
  scalePercent: number;
  measurements: PdfDiagnosticMeasurement[];
  recommendations: string[];
}

export interface PdfDiagnosticCopy {
  vsExpected: string;
  expectedSize: string;
  scaleFactor: string;
  margins: string;
  quietZone: string;
  pdfShrinking: string;
  pdfGrowing: string;
  pdfExpected: string;
  manualMargins: string;
  manualBarcode: string;
  recPrint100: string;
  recFitOff: string;
  recBarcode: string;
  recCutOff: string;
}

export const PDF_SIZE_TOLERANCE_IN = 0.08;

export const COMMON_PDF_SIZES: CommonPdfSize[] = [
  { key: "4x6", label: "4 × 6 in thermal label", zhLabel: "4 × 6 英寸热敏标签", width: 4, height: 6 },
  { key: "6x4", label: "6 × 4 in landscape label", zhLabel: "6 × 4 英寸横向标签", width: 6, height: 4 },
  { key: "letter", label: "US Letter", zhLabel: "US Letter", width: 8.5, height: 11 },
  { key: "a4", label: "A4", zhLabel: "A4", width: 8.27, height: 11.69 },
];

export function formatInches(value: number) {
  return value.toFixed(2).replace(/\.00$/, "");
}

export function formatMm(valueIn: number) {
  return Math.round(valueIn * 25.4 * 10) / 10;
}

export function expectedSizeFromPaper(paper: string | null) {
  return COMMON_PDF_SIZES.find((size) => size.key === paper);
}

export function localizedSizeLabel(label: string, c: PdfDiagnosticCopy) {
  const size = COMMON_PDF_SIZES.find((item) => item.label === label);
  return c.vsExpected === "对比预期" && size ? size.zhLabel : label;
}

export function findExpectedSize(widthIn: number, heightIn: number) {
  return COMMON_PDF_SIZES.reduce((best, size) => {
    const delta = Math.abs(widthIn - size.width) + Math.abs(heightIn - size.height);
    const bestDelta = Math.abs(widthIn - best.width) + Math.abs(heightIn - best.height);
    return delta < bestDelta ? size : best;
  }, COMMON_PDF_SIZES[0]);
}

export function sizeStatus(widthIn: number, heightIn: number, expectedWidthIn: number, expectedHeightIn: number): PdfDiagnosticStatus {
  const withinSize = Math.abs(widthIn - expectedWidthIn) <= PDF_SIZE_TOLERANCE_IN && Math.abs(heightIn - expectedHeightIn) <= PDF_SIZE_TOLERANCE_IN;
  if (withinSize) return "pass";
  const close = Math.abs(widthIn - expectedWidthIn) <= 0.25 && Math.abs(heightIn - expectedHeightIn) <= 0.35;
  return close ? "warn" : "fail";
}

export function buildPdfDiagnosticReport(
  input: { name: string; pages: number; widthIn: number; heightIn: number; fileSizeMb?: number; source: "sample" | "upload" },
  c: PdfDiagnosticCopy,
  expectedFromQuery?: CommonPdfSize,
): PdfDiagnosticReport {
  const expected = expectedFromQuery ?? findExpectedSize(input.widthIn, input.heightIn);
  const widthScale = (input.widthIn / expected.width) * 100;
  const heightScale = (input.heightIn / expected.height) * 100;
  const scalePercent = Math.round(((widthScale + heightScale) / 2) * 10) / 10;
  const status = sizeStatus(input.widthIn, input.heightIn, expected.width, expected.height);
  const shrinkOrGrow = scalePercent < 99.5 ? c.pdfShrinking : scalePercent > 100.5 ? c.pdfGrowing : c.pdfExpected;
  const expectedLabel = localizedSizeLabel(expected.label, c);
  const isZh = c.vsExpected === "对比预期";

  const recommendations = status === "pass"
    ? [c.recPrint100, c.recFitOff, c.recBarcode]
    : [
        isZh ? `输出看起来${shrinkOrGrow}。请将缩放设置为 100% / Actual Size。` : `Your output appears to be ${shrinkOrGrow}. Set scaling to 100% / Actual Size.`,
        isZh ? `重新打印前，在平台导出和打印机驱动中选择 ${expectedLabel}。` : `Choose ${expectedLabel} in the marketplace export and printer driver before reprinting.`,
        c.recCutOff,
      ];

  return {
    ...input,
    expectedLabel,
    expectedSource: expectedFromQuery ? "query" : "auto",
    expectedWidthIn: expected.width,
    expectedHeightIn: expected.height,
    scalePercent,
    measurements: [
      {
        key: "expected_size",
        label: c.vsExpected,
        status,
        detail: isZh
          ? `${formatInches(input.widthIn)} × ${formatInches(input.heightIn)} 英寸，对比 ${formatInches(expected.width)} × ${formatInches(expected.height)} 英寸（${expectedLabel}）。`
          : `${formatInches(input.widthIn)} × ${formatInches(input.heightIn)} in vs ${formatInches(expected.width)} × ${formatInches(expected.height)} in (${expectedLabel}).`,
      },
      {
        key: "scale",
        label: c.scaleFactor,
        status: Math.abs(scalePercent - 100) <= 1 ? "pass" : Math.abs(scalePercent - 100) <= 4 ? "warn" : "fail",
        detail: isZh ? `${scalePercent}% — 你的打印机/PDF ${shrinkOrGrow}。` : `${scalePercent}% — your printer/PDF is ${shrinkOrGrow}.`,
      },
      { key: "margins", label: c.margins, status: "warn", detail: c.manualMargins },
      { key: "quiet_zone", label: c.quietZone, status: "warn", detail: c.manualBarcode },
    ],
    recommendations,
  };
}
