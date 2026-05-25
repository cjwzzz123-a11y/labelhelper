import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { ShippingResponsibilityNotice } from "@/components/LegalNotice";
import { SizeChecker } from "@/components/tools/SizeChecker";
import { defaultLocale, hasLocalizedPath, isSupportedLocale, safeLocalizedPath, locales, type Locale } from "@/lib/i18n";
import { lookup } from "@/lib/rules-engine";
import { organizationSchema, pageMetadata, softwareApplicationSchema, websiteSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

type HomeCopy = {
  decisionEyebrow: string;
  decisionPaths: { title: string; text: string; href: string; cta: string }[];
  nextEyebrow: string;
  nextTitle: string;
  nextText: string;
  nextSteps: { href: string; title: string; text: string; kind: "tool" | "guide" }[];
};

const enHomeCopy: HomeCopy = {
  decisionEyebrow: "Choose your path",
  decisionPaths: [
    { title: "I’m setting up a label", text: "Unlock the Pro checker for marketplace, carrier, paper and printer setup.", href: "/pricing", cta: "Unlock setup check" },
    { title: "My print already failed", text: "Read the troubleshooting guide first, then unlock the matching tool.", href: "/shipping-label-printing-too-small", cta: "Read the guide" },
    { title: "I want a safe test", text: "Learn the test flow, then unlock template, calibration or test-pack downloads.", href: "/test-print", cta: "Open Test Print" },
  ],
  nextEyebrow: "Tool workflow",
  nextTitle: "Unlock only the workflow you need.",
  nextText: "Most print problems come from the same setup chain: paper size, print scale, orientation, margins, then barcode whitespace. Read the free guide first, then use the paid tool that matches the problem.",
  nextSteps: [
    { href: "/test-print", title: "Setup looks right", text: "Print a blank template before paid postage.", kind: "tool" },
    { href: "/tools/scale-calculator", title: "Printed size is wrong", text: "Calculate the corrected print percentage.", kind: "tool" },
    { href: "/tools/pdf-analyzer", title: "PDF size looks odd", text: "Read page boxes before changing printer settings.", kind: "tool" },
    { href: "/shipping-label-barcode-not-scanning", title: "Barcode still fails", text: "Review quiet zone, density, glare and damage.", kind: "guide" },
  ],
};

const zhHomeCopy: HomeCopy = {
  decisionEyebrow: "选择你的路径",
  decisionPaths: [
    { title: "我要设置标签", text: "解锁 Pro 检查器，检查平台、承运商、纸张和打印机设置。", href: "/pricing", cta: "解锁设置检查" },
    { title: "我已经打印失败", text: "先阅读排错指南，再解锁对应工具。", href: "/shipping-label-printing-too-small", cta: "阅读指南" },
    { title: "我想先安全测试", text: "先了解测试流程，再解锁模板、校准页或测试包下载。", href: "/test-print", cta: "打开测试打印" },
  ],
  nextEyebrow: "工具流程",
  nextTitle: "只解锁你需要的流程。",
  nextText: "多数打印问题都来自同一条设置链：纸张尺寸、打印比例、方向、边距，然后才是条码空白区。先阅读免费指南，再使用匹配问题的付费工具。",
  nextSteps: [
    { href: "/test-print", title: "设置看起来正确", text: "购买运费前先打印空白模板。", kind: "tool" },
    { href: "/tools/scale-calculator", title: "打印尺寸不对", text: "计算需要修正到的打印百分比。", kind: "tool" },
    { href: "/tools/pdf-analyzer", title: "PDF 尺寸异常", text: "改打印机设置前先读取页面尺寸。", kind: "tool" },
    { href: "/shipping-label-barcode-not-scanning", title: "条码仍无法扫描", text: "复核空白区、浓度、反光和损坏。", kind: "guide" },
  ],
};

function getHomeCopy(locale: Locale) {
  return locale === "zh" ? zhHomeCopy : enHomeCopy;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: requestedLocale } = await params;
  if (!isSupportedLocale(requestedLocale)) return {};

  const t = await getTranslations({ locale: requestedLocale, namespace: "home" });
  return pageMetadata({ title: t("heroTitle"), description: t("heroDescription"), path: "/", locale: requestedLocale });
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale: requestedLocale } = await params;
  if (!isSupportedLocale(requestedLocale)) notFound();

  setRequestLocale(requestedLocale);
  const t = await getTranslations({ locale: requestedLocale, namespace: "home" });
  const defaultRule = lookup("etsy", "usps", "4x6", "thermal");
  const title = t("heroTitle");
  const description = t("heroDescription");
  const problemStatement = t("problemStatement");
  const homeCopy = getHomeCopy(requestedLocale);
  const englishToolLabel = requestedLocale === "zh" ? "（打开英文工具）" : " (opens English tool)";
  const englishGuideLabel = requestedLocale === "zh" ? "（打开英文指南）" : " (opens English guide)";

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema(requestedLocale)} />
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/", locale: requestedLocale })} />
      <section id="checker" className="relative scroll-mt-28 overflow-hidden px-6 py-12 sm:py-16">
        <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="mx-auto max-w-6xl">
        <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{t("badge")}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-6xl">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{description}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{problemStatement}</p>
            <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{homeCopy.decisionEyebrow}</p>
              <div className="mt-4 grid gap-3">
                {homeCopy.decisionPaths.map((path) => {
                  const fallback = requestedLocale !== defaultLocale && !hasLocalizedPath(path.href, requestedLocale) ? (path.href.startsWith("/tools") ? englishToolLabel : englishGuideLabel) : "";
                  return (
                    <Link key={path.href} href={safeLocalizedPath(path.href, requestedLocale)} className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                      <p className="font-black text-[#12324A]">{path.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{path.text}</p>
                      <p className="mt-2 text-sm font-bold text-sky-800">{path.cta}{fallback}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">{t("trustNote")}</p>
          </div>
          <div className="rounded-[2rem] bg-white/80 p-3 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 backdrop-blur">
            <SizeChecker initialRule={defaultRule} locale={requestedLocale} variant="hero" />
          </div>
        </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{homeCopy.nextEyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#12324A]">{homeCopy.nextTitle}</h2>
            <p className="mt-3 leading-7 text-slate-600">{homeCopy.nextText}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {homeCopy.nextSteps.map((step) => {
              const fallback = requestedLocale !== defaultLocale && !hasLocalizedPath(step.href, requestedLocale) ? (step.kind === "tool" ? englishToolLabel : englishGuideLabel) : "";
              return <NextStep key={step.href} href={safeLocalizedPath(step.href, requestedLocale)} title={`${step.title}${fallback}`} text={step.text} />;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <ShippingResponsibilityNotice locale={requestedLocale} />
      </section>
    </main>
  );
}

function NextStep({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-[#f7fbff] p-5 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
      <span className="block font-black text-[#12324A]">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-slate-600">{text}</span>
    </Link>
  );
}
