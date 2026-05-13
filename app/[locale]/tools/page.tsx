import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { FixPrintIssueTool } from "@/components/tools/FixPrintIssueTool";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Problem Finder | Fix Shipping Label Printing Issues",
    description: "Choose the visible shipping label print problem and use the matching scale, PDF, calibration or barcode check in one page.",
    breadcrumb: "Problem finder",
    eyebrow: "Problem finder",
    h1: "Fix the print problem you can see.",
    intro: "This page is only for problems after a bad print: wrong scale, wrong PDF page size, cut-off output or barcode scan risk.",
  },
  zh: {
    title: "问题定位 | 修复运单标签打印问题",
    description: "选择你看到的运单标签打印问题，在同一页使用对应的比例、PDF、校准或条码检查工具。",
    breadcrumb: "问题定位",
    eyebrow: "问题定位",
    h1: "按你看到的问题来修复。",
    intro: "这个页面只处理已经打印出错的问题：比例不对、PDF 页面尺寸不对、被裁切/不居中，或条码扫描风险。",
  },
};

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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/tools", locale });
}

export default async function LocaleToolsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);
  const localePath = (path: string) => safeLocalizedPath(path, locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: pageCopy.h1, description: pageCopy.description }} />
      <JsonLd data={softwareApplicationSchema({ title: pageCopy.title, description: pageCopy.description, path: "/tools", locale })} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: localePath("/tools") }]} homeHref={localePath("/")} />
        <div className="mt-8 max-w-3xl">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{pageCopy.h1}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
        </div>

        <div className="mt-8">
          <FixPrintIssueTool locale={locale} />
        </div>
      </section>
    </main>
  );
}
