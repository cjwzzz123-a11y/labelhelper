import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { PdfAnalyzer } from "@/components/tools/PdfAnalyzer";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Label PDF Analyzer",
    description: "Browser-local shipping label PDF analyzer preview for page size and scale estimates, with margin and barcode checks marked for manual review.",
    tools: "Tools",
    name: "PDF Analyzer",
    badge: "Local PDF preview",
    h1: "Label PDF Analyzer",
    intro: "Preview a local-first PDF diagnostic summary for page size and print setup. It reads the file in your browser, estimates scale, and clearly marks checks that still need manual review.",
    notes: [["Read page size", "Detect first-page dimensions locally."], ["Estimate scale", "Compare against common label sizes."], ["Review next", "Use image checker for barcode quiet zones."]],
    boundaryBadge: "Current boundary",
    boundaryTitle: "This is a page-size preview, not full barcode detection",
    boundaryText: "The analyzer reads PDF page boxes and creates a diagnostic summary. Rendered ink bounds, barcode detection and quiet-zone measurement still require manual review or the barcode image checker.",
    paywallFeature: "the full PDF analyzer",
    links: ["Back to size checker", "Check barcode quiet zone", "Privacy policy"],
  },
  zh: {
    title: "标签 PDF 分析器",
    description: "在浏览器本地预览运单标签 PDF 的页面尺寸和比例估算，并明确标记仍需人工复查的边距与条码检查。",
    tools: "工具",
    name: "PDF 分析器",
    badge: "本地 PDF 预览",
    h1: "标签 PDF 分析器",
    intro: "本地优先预览 PDF 诊断摘要，用于检查页面尺寸和打印设置。文件在浏览器中读取，工具会估算比例，并明确标出仍需人工复查的项目。",
    notes: [["读取页面尺寸", "在本地检测第一页尺寸。"], ["估算比例", "与常见标签尺寸对比。"], ["继续复查", "使用图片检查器查看条码空白区。"]],
    boundaryBadge: "当前边界",
    boundaryTitle: "这是页面尺寸预览，不是完整条码检测",
    boundaryText: "分析器会读取 PDF 页面框并生成诊断摘要。实际墨迹边界、条码检测和空白区测量仍需要人工复查，或使用条码图片检查器。",
    paywallFeature: "完整 PDF 分析器",
    links: ["返回尺寸检查器", "检查条码空白区", "隐私政策"],
  },
} satisfies Record<"en" | "zh", {
  title: string;
  description: string;
  tools: string;
  name: string;
  badge: string;
  h1: string;
  intro: string;
  notes: string[][];
  boundaryBadge: string;
  boundaryTitle: string;
  boundaryText: string;
  paywallFeature: string;
  links: string[];
}>;

function getCopy(locale: Locale) {
  return locale === "zh" ? copy.zh : copy.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const pageCopy = getCopy(locale);
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools/pdf-analyzer", locale });
}

export default async function LocalePdfAnalyzerPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools/pdf-analyzer", locale })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: pageCopy.tools, href: safeLocalizedPath("/tools", locale) }, { name: pageCopy.name, href: safeLocalizedPath("/tools/pdf-analyzer", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                {pageCopy.notes.map(([title, text]) => <TrustNote key={title} title={title} text={text} />)}
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.boundaryBadge}</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.boundaryTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.boundaryText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <PdfAnalyzer locale={locale} />
        <div className="mt-8"><Paywall feature={pageCopy.paywallFeature} locale={locale} /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={safeLocalizedPath("/#checker", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">{pageCopy.links[0]}</Link>
          <Link href={safeLocalizedPath("/tools/barcode-quiet-zone-checker", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">{pageCopy.links[1]}</Link>
          <Link href={safeLocalizedPath("/privacy", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">{pageCopy.links[2]}</Link>
        </div>
      </section>
    </main>
  );
}

function TrustNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
      <h2 className="text-sm font-bold text-[#12324A]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
