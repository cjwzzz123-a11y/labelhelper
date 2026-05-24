import { NextResponse } from "next/server";
import { hasValidLicenseToken, paidToolRequiredResponse } from "@/lib/license-access";
import { createCalibrationPdf, getTemplateSpec } from "@/lib/template-pdfs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spec = getTemplateSpec(searchParams.get("paper") ?? "letter");
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  if (!hasValidLicenseToken(request)) return paidToolRequiredResponse();

  const printer = searchParams.get("printer")?.trim() || "thermal";
  const bytes = await createCalibrationPdf(spec, printer, false);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="slh-calibration-${spec.slug}-${printer}.pdf"`,
    },
  });
}
