import { NextResponse } from "next/server";
import { getTemplateSpec } from "@/lib/template-pdfs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const spec = getTemplateSpec(slug);
  if (!spec) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  return NextResponse.redirect(new URL(`/api/templates/${spec.slug}`, request.url), 301);
}
