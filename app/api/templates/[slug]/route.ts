import { NextResponse } from "next/server";
import { hasValidLicenseToken, paidToolRequiredResponse } from "@/lib/license-access";
import { createBlankTemplatePdf, getTemplateSpec } from "@/lib/template-pdfs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const spec = getTemplateSpec(slug);
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  if (!hasValidLicenseToken(request)) return paidToolRequiredResponse();

  const bytes = await createBlankTemplatePdf(spec, { watermark: false });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="slh-${spec.slug}-shipping-label-template.pdf"`,
    },
  });
}
