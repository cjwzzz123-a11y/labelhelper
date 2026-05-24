import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { TestPrintPack } from "@/components/tools/TestPrintPack";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Shipping Label Test Print Pack",
    description: "VIP tool: unlock a local ZIP with 30+ shipping-label test PDFs for printer alignment, barcode quiet zones and 100% scale checks.",
    tools: "Tools",
    name: "Test Print Pack",
    badge: "Paid preview",
    h1: "Shipping Label Test Print Pack",
    intro: "Unlock Pro Toolkit to generate single test PDFs or the bundled ZIP for the full printer test set.",
    steps: [["Pick baseline", "Start with a blank template or preview PDF."], ["Print at 100%", "Keep Fit to Page disabled."], ["Fix before postage", "Use scale and quiet-zone tools if the test fails."]],
    paywallFeature: "test print PDFs and bundled pack downloads",
  },
  zh: {
    title: "运单标签测试打印包",
    description: "VIP 工具：解锁本地 ZIP，包含多个运单标签测试 PDF，用于检查打印机对齐、条码空白区和 100% 打印比例。",
    tools: "工具",
    name: "测试打印包",
    badge: "付费预览",
    h1: "运单标签测试打印包",
    intro: "解锁 Pro Toolkit 后，可生成单个测试 PDF 或完整打包 ZIP。",
    steps: [["选择基准", "先下载空白模板或预览 PDF。"], ["按 100% 打印", "保持关闭适合页面。"], ["先修复再打运费", "测试失败时使用比例和空白区工具。"]],
    paywallFeature: "无水印测试打印 PDF 和完整打包下载",
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
  paywallFeature: string;
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools/test-print-pack", locale });
}

export default async function LocaleTestPrintPackPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools/test-print-pack", locale })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: pageCopy.tools, href: safeLocalizedPath("/tools", locale) }, { name: pageCopy.name, href: safeLocalizedPath("/tools/test-print-pack", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
          <p className="mt-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
          <div className="relative mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{pageCopy.intro}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{locale === "zh" ? "安全测试流程" : "Safe test flow"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{locale === "zh" ? "先预览，按实际大小打印，再在购买或重打运费前修复设置。" : "Preview first, print at actual size, then fix settings before buying or reprinting postage."}</p>
            </div>
          </div>
          <div className="relative mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {pageCopy.steps.map(([title, text], index) => <MiniStep key={title} number={`${index + 1}`} title={title} text={text} />)}
          </div>
          <div className="relative mt-8"><TestPrintPack locale={locale} /></div>
          <div className="relative mt-8"><Paywall feature={pageCopy.paywallFeature} locale={locale} /></div>
        </div>
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
