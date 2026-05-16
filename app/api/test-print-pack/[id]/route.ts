import { NextResponse } from "next/server";
import { verifyLicenseToken } from "@/lib/license-token";
import { createBlankTemplatePdf, createTestPrintPdf, getTemplateSpec, testPrintPackItems } from "@/lib/template-pdfs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const token = getBearerToken(request);
  const isPro = Boolean(token && verifyLicenseToken(token));

  if (id.startsWith("blank-")) {
    const slug = id.slice("blank-".length);
    const spec = getTemplateSpec(slug);
    if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const bytes = await createBlankTemplatePdf(spec, { watermark: !isPro });
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
  const bytes = await createTestPrintPdf(item, preview ? true : !isPro);
  const filename = preview
    ? item.filename.replace(".pdf", "-preview.pdf")
    : isPro ? item.filename : item.filename.replace(".pdf", "-evaluation.pdf");

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
