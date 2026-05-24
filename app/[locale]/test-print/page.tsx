import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { templateSpecs } from "@/lib/template-pdfs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Test Print Center | Shipping Label Helper",
    description: "Read the test-print flow, then unlock paid template, calibration and test-pack PDF generation before using shipping labels.",
    breadcrumb: "Test Print",
    eyebrow: "Test before postage",
    h1: "Print a safe test before the real carrier label.",
    intro: "Guides explain the test-print flow for free. Template downloads, calibration generation and test print packs unlock with Pro Toolkit.",
    orderTitle: "Use this order",
    steps: [
      ["1 · Match the paper", "Pick the size loaded in the printer: 4×6, A4 or Letter."],
      ["2 · Print at 100%", "Disable Fit to Page, browser headers and driver scaling."],
      ["3 · Measure the output", "Fix scale or alignment before printing live postage."],
    ],
    sections: [
      { title: "Blank templates", text: "Unlock a 4×6, A4 or Letter blank PDF and print at 100% / Actual Size to confirm paper size and scale.", href: "/templates", cta: "Unlock blank template" },
      { title: "Calibration sheet", text: "Generate a ruler and alignment sheet to check scale, margins and center position before paid postage.", href: "/tools/calibration-sheet", cta: "Generate calibration sheet" },
      { title: "Test print pack", text: "Generate paid test PDFs for thermal and sheet printers when one blank template is not enough.", href: "/tools/test-print-pack", cta: "Build test print pack" },
    ],
    downloadsTitle: "Blank PDF downloads",
    downloadsText: "These PDFs contain borders and measurement guides only. They do not include carrier barcodes or postage.",
    downloadSuffix: "blank PDF",
  },
  es: {
    title: "Centro de prueba de impresión | Shipping Label Helper",
    description: "Imprime plantillas en blanco, hojas de calibración y paquetes de prueba con marca de agua antes de usar etiquetas de envío.",
    breadcrumb: "Prueba de impresión",
    eyebrow: "Prueba antes del franqueo",
    h1: "Imprime una prueba segura antes de la etiqueta real del transportista.",
    intro: "Usa plantillas en blanco y hojas de calibración gratis. Usa el paquete de prueba con marca de agua de pago solo cuando necesites un conjunto de vista previa más amplio antes de comprar o reimprimir franqueo.",
    orderTitle: "Usa este orden",
    steps: [
      ["1 · Coincide el papel", "Elige el tamaño cargado en la impresora: 4×6, A4 o Letter."],
      ["2 · Imprime al 100%", "Desactiva Ajustar a página, encabezados del navegador y escalado del driver."],
      ["3 · Mide la salida", "Corrige escala o alineación antes de imprimir franqueo real."],
    ],
    sections: [
      { title: "Plantillas en blanco", text: "Descarga un PDF 4×6, A4 o Letter e imprime al 100% / Tamaño real para confirmar papel y escala.", href: "/templates", cta: "Elegir plantilla" },
      { title: "Hoja de calibración", text: "Imprime una regla y hoja de alineación para revisar escala, márgenes y centrado antes del franqueo pagado.", href: "/tools/calibration-sheet", cta: "Generar hoja de calibración" },
      { title: "Paquete de prueba", text: "Vista previa de pago: genera PDFs de prueba con marca de agua para impresoras térmicas y de hoja cuando una plantilla no basta.", href: "/tools/test-print-pack", cta: "Crear paquete de prueba" },
    ],
    downloadsTitle: "Descargas PDF en blanco",
    downloadsText: "Estos PDFs contienen solo bordes y guías de medición. No incluyen códigos de barras del transportista ni franqueo.",
    downloadSuffix: "PDF en blanco",
  },
  zh: {
    title: "测试打印中心 | Shipping Label Helper",
    description: "先阅读测试打印流程，再解锁付费模板、校准页和测试包 PDF 生成。",
    breadcrumb: "测试打印",
    eyebrow: "先测试再买运费",
    h1: "打印真实承运商标签前，先做一次安全测试。",
    intro: "指南免费解释测试打印流程。模板下载、校准页生成和测试打印包通过 Pro Toolkit 解锁。",
    orderTitle: "按这个顺序使用",
    steps: [
      ["1 · 匹配纸张", "选择打印机实际装入的尺寸：4×6、A4 或 Letter。"],
      ["2 · 按 100% 打印", "关闭适合页面、浏览器页眉页脚和驱动缩放。"],
      ["3 · 测量输出", "在打印真实运费前，先修正比例或对齐。"],
    ],
    sections: [
      { title: "空白模板", text: "解锁 4×6、A4 或 Letter 空白 PDF，按 100% / 实际大小打印，确认纸张和比例。", href: "/templates", cta: "解锁空白模板" },
      { title: "校准页", text: "打印尺规和对齐页，在购买运费前检查比例、边距和居中。", href: "/tools/calibration-sheet", cta: "生成校准页" },
      { title: "测试打印包", text: "当单个空白模板不够时，生成适合热敏和纸张打印机的付费测试 PDF。", href: "/tools/test-print-pack", cta: "生成测试包" },
    ],
    downloadsTitle: "空白 PDF 下载",
    downloadsText: "这些 PDF 只包含边框和测量参考，不包含承运商条码或真实运费。",
    downloadSuffix: "空白 PDF",
  },
} satisfies Record<"en" | "es" | "zh", {
  title: string;
  description: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  orderTitle: string;
  steps: string[][];
  sections: { title: string; text: string; href: string; cta: string }[];
  downloadsTitle: string;
  downloadsText: string;
  downloadSuffix: string;
}>;

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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/test-print", locale });
}

export default async function LocaleTestPrintPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);
  const localePath = (path: string) => safeLocalizedPath(path, locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: pageCopy.title, description: pageCopy.description }} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: localePath("/test-print") }]} homeHref={localePath("/")} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{pageCopy.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.orderTitle}</p>
            <div className="mt-4 grid gap-3">
              {pageCopy.steps.map(([title, text]) => <MiniStep key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pageCopy.sections.map((section) => (
            <Link key={section.href} href={localePath(section.href)} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:ring-sky-200 hover:shadow-md">
              <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
              <p className="mt-5 text-sm font-bold text-sky-800">{section.cta}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight">{pageCopy.downloadsTitle}</h2>
          <p className="mt-3 leading-7 text-slate-600">{pageCopy.downloadsText}</p>
          <div className="mt-4">
            <DownloadResponsibilityNotice locale={locale} compact />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {templateSpecs.map((template) => (
              <TemplateDownloadButton key={template.slug} slug={template.slug} locale={locale} className="rounded-2xl border border-sky-100 bg-[#f7fbff] p-4 text-left font-bold text-[#12324A] hover:bg-sky-50">
                {template.label} {pageCopy.downloadSuffix} · {template.widthMm} × {template.heightMm} mm
              </TemplateDownloadButton>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
      <p className="font-bold text-[#12324A]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
