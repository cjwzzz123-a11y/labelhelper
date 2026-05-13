import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import type { LabelOutputSize, LabelTemplateRegion } from "@/data/label-templates";
import { OUTPUT_SIZES } from "@/data/label-templates";

export async function cropAndFitRegion(
  sourcePdfBytes: ArrayBuffer | Uint8Array,
  pageIndex: number,
  region: LabelTemplateRegion,
  outputSize: LabelOutputSize,
  watermark: boolean,
) {
  const src = await PDFDocument.load(sourcePdfBytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const sourcePage = src.getPage(pageIndex);
  const embedded = await out.embedPage(sourcePage, {
    left: region.x,
    bottom: region.y,
    right: region.x + region.w,
    top: region.y + region.h,
  });
  const output = OUTPUT_SIZES[outputSize];
  const finalPage = out.addPage([output.w, output.h]);
  const effectiveW = region.rotation === 90 || region.rotation === 270 ? region.h : region.w;
  const effectiveH = region.rotation === 90 || region.rotation === 270 ? region.w : region.h;
  const scale = Math.min(output.w / effectiveW, output.h / effectiveH);

  if (region.rotation === 90) {
    finalPage.drawPage(embedded, {
      x: (output.w + region.h * scale) / 2,
      y: (output.h - region.w * scale) / 2,
      xScale: scale,
      yScale: scale,
      rotate: degrees(90),
    });
  } else if (region.rotation === 270) {
    finalPage.drawPage(embedded, {
      x: (output.w - region.h * scale) / 2,
      y: (output.h + region.w * scale) / 2,
      xScale: scale,
      yScale: scale,
      rotate: degrees(270),
    });
  } else {
    finalPage.drawPage(embedded, {
      x: (output.w - region.w * scale) / 2,
      y: (output.h - region.h * scale) / 2,
      xScale: scale,
      yScale: scale,
      rotate: region.rotation === 180 ? degrees(180) : undefined,
    });
  }

  if (watermark) {
    const font = await out.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = finalPage.getSize();
    finalPage.drawText("SAMPLE - slh.app", {
      x: width * 0.13,
      y: height * 0.48,
      size: Math.max(14, Math.min(width, height) * 0.07),
      font,
      color: rgb(0.55, 0.6, 0.68),
      opacity: 0.12,
      rotate: degrees(32),
    });
  }
  return out.save();
}

export async function combinePdfs(parts: Uint8Array[], title = "Split International Label") {
  const out = await PDFDocument.create();
  out.setTitle(title);
  for (const bytes of parts) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((page) => out.addPage(page));
  }
  return out.save();
}
