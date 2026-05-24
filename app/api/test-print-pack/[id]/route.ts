import { NextResponse } from "next/server";
import { hasValidLicenseToken, paidToolRequiredResponse } from "@/lib/license-access";
import { createBlankTemplatePdf, createTestPrintPdf, getTemplateSpec, testPrintPackItems } from "@/lib/template-pdfs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  if (!hasValidLicenseToken(request)) return paidToolRequiredResponse();

  if (id.startsWith("blank-")) {
    const slug = id.slice("blank-".length);
    const spec = getTemplateSpec(slug);
    if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const bytes = await createBlankTemplatePdf(spec, { watermark: false });
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="slh-test-print-${slug}-blank.pdf"`,
      },
    });
  }

  const item = testPrintPackItems.find((candidate) => candidate.id === id);
  if (!item) return NextResponse.json({ error: "Test print not found" }, { status: 404 });

  const preview = searchParams.get("preview") !== "false";
  const bytes = await createTestPrintPdf(item, false);
  const filename = preview ? item.filename.replace(".pdf", "-preview.pdf") : item.filename;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
