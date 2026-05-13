import { PDFDocument } from "pdf-lib";
import type { LabelOutputSize, LabelTemplate, LabelTemplateRegion, Rectangle } from "@/data/label-templates";
import { LABEL_TEMPLATES, getLabelTemplate, templateFromSampleFilename } from "@/data/label-templates";
import { combinePdfs, cropAndFitRegion } from "./crop-region";

export interface SplitResultPart {
  pdfBytes: Uint8Array;
  detectedRegion: Rectangle;
  filename: string;
  description: string;
}

export interface SplitResult {
  template: string | null;
  confidence: "high" | "medium" | "low" | "manual";
  combined: SplitResultPart;
  warnings: string[];
  combinedPdfBytes: Uint8Array;
  pageCount: number;
  platform: string;
}

export interface SplitLabelOptions {
  outputSize?: LabelOutputSize;
  manualRegions?: { combined: LabelTemplateRegion };
  pageIndex?: number;
  templateId?: string;
  filename?: string;
  watermark?: boolean;
}

export const MAX_SPLITTER_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_SPLITTER_PAGES = 4;

function shortId(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  return Math.abs(hash).toString(16).slice(0, 4).padStart(4, "0");
}

export async function readPdfInfo(bytes: ArrayBuffer | Uint8Array) {
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const page = pdf.getPage(0);
  const { width, height } = page.getSize();
  return { pageCount: pdf.getPageCount(), width, height };
}

export function detectTemplate(input: { filename?: string; width: number; height: number; templateId?: string }) {
  if (input.templateId) return getLabelTemplate(input.templateId) ?? null;
  if (input.filename) {
    const sample = templateFromSampleFilename(input.filename);
    if (sample) return sample;
  }

  return LABEL_TEMPLATES.find((template) => {
    const size = template.signature.sizeMatch;
    return Math.abs(input.width - size.w) <= size.tolerance && Math.abs(input.height - size.h) <= size.tolerance;
  }) ?? null;
}

function filenameFor(template: LabelTemplate | null, type: "combined", id: string) {
  const platform = template?.platform ?? "manual";
  return `${platform}-${type}-${id}.pdf`;
}

export async function splitLabel(input: File | ArrayBuffer | Uint8Array, options: SplitLabelOptions = {}): Promise<SplitResult> {
  const outputSize = options.outputSize ?? "4x6";
  const pageIndex = options.pageIndex ?? 0;
  const filename = input instanceof File ? input.name : options.filename ?? "label.pdf";
  const bytes = input instanceof File ? await input.arrayBuffer() : input;
  const byteLength = bytes instanceof Uint8Array ? bytes.byteLength : bytes.byteLength;
  if (byteLength > MAX_SPLITTER_FILE_SIZE) throw new Error("This PDF is over 20 MB. Export a smaller label PDF and try again.");

  const info = await readPdfInfo(bytes);
  if (info.pageCount > MAX_SPLITTER_PAGES) throw new Error("This splitter supports PDFs up to 4 pages. Use the first label page or split the file first.");

  const template = options.manualRegions ? null : detectTemplate({ filename, width: info.width, height: info.height, templateId: options.templateId });
  const regions = options.manualRegions ?? template?.regions;
  if (!regions) throw new Error("We could not match this layout yet. Use manual crop values or try one of the supported samples.");

  const warnings: string[] = [];
  if (!template && options.manualRegions) warnings.push("Manual crop mode: verify the output preview before printing postage.");
  if (template?.verifiedWithRealPdf) warnings.push("Verified real sample: output is one combined PS Form 2976 block, not separate postage/customs pages.");

  const id = shortId(`${filename}-${byteLength}-${outputSize}`);
  const combinedRegion = regions.combined;
  const combinedPartBytes = await cropAndFitRegion(bytes, pageIndex, combinedRegion, outputSize, Boolean(options.watermark));
  const combinedPdfBytes = await combinePdfs([combinedPartBytes], "International Label Split");

  return {
    template: template?.id ?? null,
    confidence: template ? "high" : "manual",
    combined: { pdfBytes: combinedPartBytes, detectedRegion: combinedRegion, filename: filenameFor(template, "combined", id), description: combinedRegion.description },
    warnings,
    combinedPdfBytes,
    pageCount: info.pageCount,
    platform: template?.label ?? "Manual crop",
  };
}
