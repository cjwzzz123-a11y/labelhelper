import { NextResponse } from "next/server";
import { createBlankTemplatePdf, getTemplateSpec } from "@/lib/template-pdfs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const spec = getTemplateSpec(slug);
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const bytes = await createBlankTemplatePdf(spec);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="slh-${spec.slug}-shipping-label-template.pdf"`,
    },
  });
}
