import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScaleCalculator } from "@/components/tools/ScaleCalculator";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Print Shipping Label Scale Calculator",
    description: "Calculate the print scale percentage needed when a shipping label prints too small or too large.",
    tools: "Tools",
    name: "Scale Calculator",
    badge: "Fix tiny or oversized labels",
    h1: "Print Shipping Label Scale Calculator",
    intro: "Measure the same edge on the printed label and compare it with the target size. The calculator gives the print scale to try in your printer dialog.",
    steps: [["Measure", "Use the same edge, usually the 4-inch width."], ["Calculate", "Enter printed size and target size."], ["Reprint", "Set scale, then run a blank test."]],
    exampleTitle: "A 4-inch label printed as 3.8 inches",
    exampleText: "Enter 3.8 as the printed size and 4 as the target. Try about 105.3% scale, then confirm with a blank template before using paid postage.",
    templates: "Open blank templates",
    avoidTitle: "Do not measure different sides",
    avoidText: "If you measure the 4-inch width but target the 6-inch height, the percentage will be wrong. Use width-to-width or height-to-height.",
    avoidBadge: "Avoid this",
    related: ["Label printing too small", "Fit to Page vs Actual Size", "Size Checker"],
  },
  zh: {
    title: "运单标签打印比例计算器",
    description: "当运单标签打印过小或过大时，计算需要使用的打印比例百分比。",
    tools: "工具",
    name: "比例计算器",
    badge: "修复过小或过大的标签",
    h1: "运单标签打印比例计算器",
    intro: "测量打印标签上的同一条边，并与目标尺寸对比。计算器会给出打印对话框中可尝试的比例。",
    steps: [["测量", "使用同一条边，通常是 4 英寸宽边。"], ["计算", "输入当前打印尺寸和目标尺寸。"], ["重打", "设置比例，然后先运行空白测试。"]],
    exampleTitle: "4 英寸标签打印成了 3.8 英寸",
    exampleText: "当前尺寸输入 3.8，目标输入 4。尝试约 105.3% 比例，并先用空白模板确认，再打印已付运费。",
    templates: "打开空白模板",
    avoidTitle: "不要测量不同边",
    avoidText: "如果你测量的是 4 英寸宽边，却把目标设为 6 英寸高边，百分比会错误。请使用宽对宽或高对高。",
    avoidBadge: "避免这个错误",
    related: ["标签打印过小", "适合页面 vs 实际大小", "尺寸检查器"],
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
  exampleTitle: string;
  exampleText: string;
  templates: string;
  avoidTitle: string;
  avoidText: string;
  avoidBadge: string;
  related: string[];
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools/scale-calculator", locale });
}

export default async function LocaleScaleCalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools/scale-calculator", locale })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: pageCopy.tools, href: safeLocalizedPath("/tools", locale) }, { name: pageCopy.name, href: safeLocalizedPath("/tools/scale-calculator", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                {pageCopy.steps.map(([title, text], index) => <MiniStep key={title} number={`${index + 1}`} title={title} text={text} />)}
              </div>
            </div>
            <ScaleCalculator locale={locale} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Example</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.exampleTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.exampleText}</p>
            <Link href={safeLocalizedPath("/templates", locale)} className="mt-5 inline-block rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">{pageCopy.templates}</Link>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.avoidBadge}</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.avoidTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.avoidText}</p>
          </div>
        </div>
        <div className="mt-8"><RelatedLinks links={[{ href: safeLocalizedPath("/shipping-label-printing-too-small", locale), title: pageCopy.related[0] }, { href: safeLocalizedPath("/fit-to-page-vs-actual-size-shipping-label", locale), title: pageCopy.related[1] }, { href: safeLocalizedPath("/#checker", locale), title: pageCopy.related[2] }]} /></div>
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
