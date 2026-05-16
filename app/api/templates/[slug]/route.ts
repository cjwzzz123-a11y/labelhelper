import { NextResponse } from "next/server";
import { verifyLicenseToken } from "@/lib/license-token";
import { createBlankTemplatePdf, getTemplateSpec } from "@/lib/template-pdfs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const spec = getTemplateSpec(slug);
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const license = getBearerToken(request);
  const isPro = Boolean(license && verifyLicenseToken(license));
  const bytes = await createBlankTemplatePdf(spec, { watermark: !isPro });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="slh-${spec.slug}-shipping-label-template.pdf"`,
    },
  });
}
