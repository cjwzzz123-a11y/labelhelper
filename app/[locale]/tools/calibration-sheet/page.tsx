import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { CalibrationSheetGenerator } from "@/components/tools/CalibrationSheetGenerator";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Calibration Sheet Generator",
    description: "Generate a printable shipping-label calibration sheet with rulers, center marks and quiet-zone references.",
    tools: "Tools",
    name: "Calibration Sheet",
    badge: "Print a blank test first",
    h1: "Calibration Sheet Generator",
    intro: "Generate a Pro calibration PDF with corner guides, a 100 mm reference line, center crosshair and quiet-zone reference. Use it before printing real postage.",
    steps: [["Choose setup", "Pick paper and printer type."], ["Print at 100%", "Disable Fit to Page in the dialog."], ["Measure", "Check the 100 mm line and center marks."]],
    checkBadge: "What to check",
    checkTitle: "A good test print should match the ruler",
    checkText: "Measure the 100 mm reference line. If it is short or long, fix print scale before printing a carrier barcode. If the center crosshair is shifted, check paper size, margins and roll alignment.",
    boundaryBadge: "Paid tool boundary",
    boundaryTitle: "Calibration downloads require Pro",
    boundaryText: "The generator creates browser-local calibration PDFs after the license is unlocked. Guides and reference pages remain free.",
    paywallFeature: "watermark-free calibration sheets and saved printer profiles",
  },
  zh: {
    title: "校准页生成器",
    description: "生成带标尺、中心标记和条码空白区参考的可打印运单标签校准页。",
    tools: "工具",
    name: "校准页",
    badge: "先打印空白测试",
    h1: "校准页生成器",
    intro: "生成 Pro 校准 PDF，包含角落参考、100 mm 参考线、中心十字线和空白区参考。请在打印真实运费前使用。",
    steps: [["选择设置", "选择纸张和打印机类型。"], ["按 100% 打印", "在打印对话框关闭适合页面。"], ["测量", "检查 100 mm 线和中心标记。"]],
    checkBadge: "需要检查什么",
    checkTitle: "好的测试打印应与标尺一致",
    checkText: "测量 100 mm 参考线。如果变短或变长，请先修正打印比例，再打印承运商条码。如果中心十字线偏移，请检查纸张尺寸、边距和卷纸对齐。",
    boundaryBadge: "付费工具边界",
    boundaryTitle: "校准页下载需要 Pro",
    boundaryText: "许可证解锁后，生成器会在浏览器本地创建校准 PDF。指南和参考页面继续免费。",
    paywallFeature: "无水印校准页和保存打印机配置",
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
  checkBadge: string;
  checkTitle: string;
  checkText: string;
  boundaryBadge: string;
  boundaryTitle: string;
  boundaryText: string;
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools/calibration-sheet", locale });
}

export default async function LocaleCalibrationSheetPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools/calibration-sheet", locale })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: pageCopy.tools, href: safeLocalizedPath("/tools", locale) }, { name: pageCopy.name, href: safeLocalizedPath("/tools/calibration-sheet", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                {pageCopy.steps.map(([title, text], index) => <MiniStep key={title} number={`${index + 1}`} title={title} text={text} />)}
              </div>
            </div>
            <CalibrationSheetGenerator locale={locale} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.checkBadge}</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.checkTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.checkText}</p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.boundaryBadge}</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.boundaryTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.boundaryText}</p>
          </div>
        </div>
        <div className="mt-8"><Paywall feature={pageCopy.paywallFeature} locale={locale} /></div>
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
