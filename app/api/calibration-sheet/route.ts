import { NextResponse } from "next/server";
import { verifyLicenseToken } from "@/lib/license-token";
import { createCalibrationPdf, getTemplateSpec } from "@/lib/template-pdfs";

export const runtime = "nodejs";

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spec = getTemplateSpec(searchParams.get("paper") ?? "letter");
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const printer = searchParams.get("printer")?.trim() || "thermal";
  const token = getBearerToken(request);
  const isPro = Boolean(token && verifyLicenseToken(token));
  const bytes = await createCalibrationPdf(spec, printer, !isPro);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="slh-calibration-${spec.slug}-${printer}.pdf"`,
    },
  });
}
