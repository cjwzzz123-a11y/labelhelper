import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { REFERENCE_DOWNLOADS } from "@/data/label-templates";
import { getSeoPages } from "@/data/seo-pages";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const copy = {
  en: {
    title: "Shipping Label Guides | Platforms, Carriers and Fixes",
    description: "Guides for Etsy, Shopify, eBay, Amazon FBA, USPS, UPS, FedEx and DHL label sizes, plus common shipping label print fixes.",
    breadcrumb: "Guides",
    eyebrow: "Guides hub",
    h1: "Start with the print problem",
    intro: "Find the right label size for your selling platform or carrier, then fix common print problems like shrinking, cut-off edges and barcode scan failures.",
    symptomTitle: "Start with your symptom",
    symptoms: [
      { title: "Label prints too small", text: "Fix Fit to Page, browser margins and PDF viewer scaling.", href: "/shipping-label-printing-too-small" },
      { title: "Label is cut off", text: "Check paper size, orientation, margins and roll alignment.", href: "/shipping-label-cut-off-when-printing" },
      { title: "Barcode won’t scan", text: "Review scale, blur, tape glare and barcode quiet-zone whitespace.", href: "/shipping-label-barcode-not-scanning" },
      { title: "Label is not centered", text: "Fix off-center thermal rolls, sheet margins and printer alignment.", href: "/shipping-label-not-centered" },
    ],
    groups: [
      { title: "Platform guides", text: "Choose the safest label setup for marketplaces like Etsy, Shopify, eBay and FBA.", kinds: ["platform"] },
      { title: "Carrier guides", text: "Match USPS, UPS, FedEx and DHL label formats before printing postage.", kinds: ["carrier"] },
      { title: "Troubleshooting guides", text: "Start from the print symptom and fix the most common setting mistakes first.", kinds: ["troubleshooter"] },
      { title: "Templates", text: "Download blank scale/alignment PDFs and print them at 100% before paid labels.", kinds: ["template"] },
    ],
    kindLabels: { platform: "platform", carrier: "carrier", template: "template", troubleshooter: "troubleshooter" },
    downloadsEyebrow: "International label and customs downloads",
    downloadsTitle: "Reference PDFs from the splitter data bundle",
    downloadsText: "These downloads are for reference, testing and template measurement. Only the eBay USPS sample is currently a verified splitter template; the others are not claimed as supported splitter layouts.",
    localDownload: "Download local PDF",
    sourceDownload: "Open source link",
  },
  es: {
    title: "Guías de etiquetas de envío | Plataformas, transportistas y soluciones",
    description: "Guías para tamaños de etiquetas de Etsy, Shopify, eBay, Amazon FBA, USPS, UPS, FedEx y DHL, además de soluciones para problemas comunes de impresión.",
    breadcrumb: "Guías",
    eyebrow: "Centro de guías",
    h1: "Empieza por el problema de impresión",
    intro: "Encuentra el tamaño de etiqueta correcto para tu plataforma o transportista y soluciona problemas comunes como etiquetas reducidas, bordes cortados y códigos de barras que no escanean.",
    symptomTitle: "Empieza con tu síntoma",
    symptoms: [
      { title: "La etiqueta sale demasiado pequeña", text: "Corrige Ajustar a página, márgenes del navegador y escala del visor PDF.", href: "/shipping-label-printing-too-small" },
      { title: "La etiqueta sale cortada", text: "Revisa tamaño de papel, orientación, márgenes y alineación del rollo.", href: "/shipping-label-cut-off-when-printing" },
      { title: "El código de barras no escanea", text: "Revisa escala, borrosidad, reflejo de cinta y margen libre del código de barras.", href: "/shipping-label-barcode-not-scanning" },
      { title: "La etiqueta no está centrada", text: "Corrige rollos térmicos desalineados, márgenes de hojas y alineación de impresora.", href: "/shipping-label-not-centered" },
    ],
    groups: [
      { title: "Guías de plataformas", text: "Elige una configuración de etiqueta segura para marketplaces como Etsy, Shopify, eBay y FBA.", kinds: ["platform"] },
      { title: "Guías de transportistas", text: "Ajusta formatos de USPS, UPS, FedEx y DHL antes de imprimir franqueo.", kinds: ["carrier"] },
      { title: "Guías de solución de problemas", text: "Empieza desde el síntoma de impresión y corrige primero los errores de configuración más comunes.", kinds: ["troubleshooter"] },
      { title: "Plantillas", text: "Descarga PDFs en blanco de escala/alineación e imprímelos al 100% antes de usar etiquetas pagadas.", kinds: ["template"] },
    ],
    kindLabels: { platform: "plataforma", carrier: "transportista", template: "plantilla", troubleshooter: "solución" },
    downloadsEyebrow: "Descargas de etiquetas internacionales y aduanas",
    downloadsTitle: "PDFs de referencia del paquete de datos del splitter",
    downloadsText: "Estas descargas sirven para referencia, pruebas y medición de plantillas. Solo la muestra eBay USPS está verificada como plantilla del splitter; las demás no se declaran compatibles todavía.",
    localDownload: "Descargar PDF local",
    sourceDownload: "Abrir enlace fuente",
  },
  zh: {
    title: "运单标签指南 | 平台、承运商和打印修复",
    description: "Etsy、Shopify、eBay、Amazon FBA、USPS、UPS、FedEx 和 DHL 标签尺寸指南，以及常见运单标签打印问题修复。",
    breadcrumb: "指南",
    eyebrow: "指南中心",
    h1: "先从打印问题开始",
    intro: "为你的销售平台或承运商找到正确标签尺寸，并修复缩小、裁切边缘和条码扫描失败等常见打印问题。",
    symptomTitle: "先选择你的症状",
    symptoms: [
      { title: "标签打印过小", text: "修复 Fit to Page、浏览器边距和 PDF 阅读器缩放。", href: "/shipping-label-printing-too-small" },
      { title: "标签被裁切", text: "检查纸张尺寸、方向、边距和卷纸对齐。", href: "/shipping-label-cut-off-when-printing" },
      { title: "条码无法扫描", text: "复核缩放、模糊、胶带反光和条码空白区。", href: "/shipping-label-barcode-not-scanning" },
      { title: "标签没有居中", text: "修复热敏卷纸偏移、纸张边距和打印机对齐。", href: "/shipping-label-not-centered" },
    ],
    groups: [
      { title: "平台指南", text: "为 Etsy、Shopify、eBay 和 FBA 等平台选择更安全的标签设置。", kinds: ["platform"] },
      { title: "承运商指南", text: "在打印运费前，匹配 USPS、UPS、FedEx 和 DHL 的标签格式。", kinds: ["carrier"] },
      { title: "故障排查指南", text: "从打印症状出发，先修复最常见的设置错误。", kinds: ["troubleshooter"] },
      { title: "模板", text: "下载空白比例/对齐 PDF，并在打印付费标签前按 100% 打印测试。", kinds: ["template"] },
    ],
    kindLabels: { platform: "平台", carrier: "承运商", template: "模板", troubleshooter: "排查" },
    downloadsEyebrow: "国际标签和海关表格下载",
    downloadsTitle: "来自 splitter 数据包的参考 PDF",
    downloadsText: "这些下载用于参考、测试和模板测量。当前只有 eBay USPS 样本是已验证 splitter 模板；其他文件不能宣称为已支持拆分布局。",
    localDownload: "下载本地 PDF",
    sourceDownload: "打开来源链接",
  },
} satisfies Record<"en" | "es" | "zh", {
  title: string;
  description: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  symptomTitle: string;
  symptoms: { title: string; text: string; href: string }[];
  groups: { title: string; text: string; kinds: string[] }[];
  kindLabels: Record<"platform" | "carrier" | "template" | "troubleshooter", string>;
  downloadsEyebrow: string;
  downloadsTitle: string;
  downloadsText: string;
  localDownload: string;
  sourceDownload: string;
}>;

interface PageProps {
  params: Promise<{ locale: string }>;
}

function getCopy(locale: Locale) {
  if (locale === "es") return copy.es;
  if (locale === "zh") return copy.zh;
  return copy.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const pageCopy = getCopy(locale);
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/guides", locale });
}

export default async function LocaleGuidesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: safeLocalizedPath("/guides", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 max-w-3xl">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{pageCopy.h1}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{pageCopy.symptomTitle}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pageCopy.symptoms.map((symptom) => (
              <Link key={symptom.href} href={safeLocalizedPath(symptom.href, locale)} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                <h2 className="font-black tracking-tight">{symptom.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{symptom.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{pageCopy.downloadsEyebrow}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{pageCopy.downloadsTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.downloadsText}</p>
          </div>
          <div className="mt-5">
            <DownloadResponsibilityNotice locale={locale} compact />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REFERENCE_DOWNLOADS.map((item) => {
              const href = item.localFilename ? `/samples/${item.localFilename}` : item.sourceUrl;
              return (
                <Link key={item.id} href={href} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{item.status.replace("-", " ")}</p>
                  <h3 className="mt-2 font-black text-[#12324A]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-3 text-sm font-bold text-sky-800">{item.localFilename ? pageCopy.localDownload : pageCopy.sourceDownload}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-10 space-y-10">
          {pageCopy.groups.map((group) => {
            const guides = getSeoPages(locale as Locale).filter((page) => group.kinds.includes(page.kind));

            return (
              <section key={group.title}>
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-black tracking-tight">{group.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{group.text}</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => (
                    <Link key={guide.slug} href={safeLocalizedPath(`/${guide.slug}`, locale)} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:ring-sky-200 hover:shadow-md">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{pageCopy.kindLabels[guide.kind]}</p>
                      <h3 className="mt-2 font-black text-[#12324A]">{guide.h1}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
