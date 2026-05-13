import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { LABEL_TEMPLATES } from "@/data/label-templates";
import { splitLabel } from "@/lib/label-splitter";

describe("international label splitter verified data", () => {
  it("keeps only real measured splitter templates", () => {
    expect(LABEL_TEMPLATES).toHaveLength(1);
    expect(LABEL_TEMPLATES[0]?.id).toBe("ebay-usps-intl-letter");
    expect(LABEL_TEMPLATES[0]?.verifiedWithRealPdf).toBe(true);
  });

  it("extracts the verified eBay USPS sample into a 4x6 PDF", async () => {
    const bytes = await readFile("public/samples/ebay-usps-intl-letter.pdf");
    const result = await splitLabel(bytes, {
      filename: "ebay-usps-intl-letter.pdf",
      templateId: "ebay-usps-intl-letter",
      outputSize: "4x6",
      watermark: false,
    });
    const pdf = await PDFDocument.load(result.combined.pdfBytes);
    const page = pdf.getPage(0);
    const { width, height } = page.getSize();

    expect(result.template).toBe("ebay-usps-intl-letter");
    expect(result.combined.description).toContain("PS Form 2976");
    expect(Math.round(width)).toBe(288);
    expect(Math.round(height)).toBe(432);
  });
});
