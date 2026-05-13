import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { BarcodeQuietZoneChecker } from "@/components/tools/BarcodeQuietZoneChecker";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Barcode Quiet Zone Checker",
    description: "Check whether a shipping-label barcode has enough blank space on both sides for reliable scanning.",
    tools: "Tools",
    name: "Barcode Quiet Zone Checker",
    badge: "Prevent barcode scan failures",
    h1: "Barcode Quiet Zone Checker",
    intro: "Measure the whitespace around a printed barcode image to catch labels that may scan poorly after cropping, shrinking or Fit to Page printing.",
    steps: [["Crop", "Use a clear PNG/JPEG around the barcode."], ["Check", "The browser estimates blank space locally."], ["Fix", "Reprint at 100% with more quiet zone."]],
    inputBadge: "Best input",
    inputTitle: "Use a cropped image, not a full-page PDF",
    inputText: "This checker analyzes PNG/JPEG images with local canvas code. For full label PDFs, use the PDF Analyzer page first or export a screenshot of the barcode area.",
  },
  zh: {
    title: "条码空白区检查器",
    description: "检查运单标签条码两侧是否保留足够空白，降低扫描失败风险。",
    tools: "工具",
    name: "条码空白区检查器",
    badge: "预防条码扫描失败",
    h1: "条码空白区检查器",
    intro: "测量打印条码图片周围的空白区，发现因裁切、缩放或适合页面打印导致的扫描风险。",
    steps: [["裁切", "使用条码附近清晰的 PNG/JPEG。"], ["检查", "浏览器在本地估算空白区域。"], ["修复", "用 100% 比例重打并保留更多空白。"]],
    inputBadge: "最佳输入",
    inputTitle: "使用裁切图片，不要直接上传整页 PDF",
    inputText: "此工具用本地 canvas 分析 PNG/JPEG 图片。完整标签 PDF 请先使用 PDF 分析器，或导出条码区域截图。",
  },
} satisfies Record<"en" | "zh", {
  title: string;
  description: string;
  tools: string;
  name: string;
  badge: string;
  h1: string;
  intro: string;
  steps: string[][];
  inputBadge: string;
  inputTitle: string;
  inputText: string;
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools/barcode-quiet-zone-checker", locale });
}

export default async function LocaleBarcodeQuietZoneCheckerPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools/barcode-quiet-zone-checker", locale })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: pageCopy.tools, href: safeLocalizedPath("/tools", locale) }, { name: pageCopy.name, href: safeLocalizedPath("/tools/barcode-quiet-zone-checker", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                {pageCopy.steps.map(([title, text], index) => <MiniStep key={title} number={`${index + 1}`} title={title} text={text} />)}
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.inputBadge}</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.inputTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.inputText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <BarcodeQuietZoneChecker locale={locale} />
        <div className="mt-8"><Paywall feature={locale === "zh" ? "已保存的空白区报告和高级条码检查" : "saved quiet-zone reports and advanced barcode checks"} locale={locale} /></div>
      </section>
    </main>
  );
}

function MiniStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-800">{number}</div>
      <p className="mt-3 font-bold text-[#12324A]">{title}</p>
      <p className="mt-1 leading-5 text-slate-600">{text}</p>
    </div>
  );
}
