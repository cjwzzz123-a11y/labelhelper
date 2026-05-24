import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";
import { defaultLocale, hasLocalizedPath, htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { templateSpecs } from "@/lib/template-pdfs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Shipping Label Templates | 4×6, A4 and Letter",
    description: "Open blank 4×6, A4 and Letter shipping label template pages and print at 100% scale to verify printer alignment.",
    breadcrumb: "Templates",
    eyebrow: "Template hub",
    h1: "Shipping Label Templates",
    intro: "Download a blank scale/alignment PDF, print it at 100%, then measure before printing paid postage. These templates do not include carrier barcodes.",
    cardCta: "Open setup guide",
    downloadCta: "Download blank PDF",
    contains: "Border + 100% scale check. No carrier barcode.",
    guideFallback: "English guide",
    toolFallback: "English tool",
    fallbackPrefix: "Opens",
    sectionTitle: "Print templates at Actual Size",
    sectionText: "Disable Fit to Page, browser headers and driver scaling. If the template measures wrong, fix the scale before printing carrier labels.",
    flowTitle: "Best flow",
    flow: [["1 · Download blank PDF", "Start with the paper size you actually load in the printer."], ["2 · Print at 100%", "Use Actual Size and turn off Fit to Page, headers and driver scaling."], ["3 · Measure then fix", "If the border or ruler is wrong, use scale or calibration tools before postage."]],
    helperLinks: ["Check the right label size", "Calculate print scale", "Generate a calibration sheet", "Fix off-center labels", "Compare Pro PDF tools"],
  },
  es: {
    title: "Plantillas de etiquetas de envío | 4×6, A4 y Letter",
    description: "Abre plantillas en blanco 4×6, A4 y Letter e imprímelas al 100% para verificar la alineación de la impresora.",
    breadcrumb: "Plantillas",
    eyebrow: "Centro de plantillas",
    h1: "Plantillas de etiquetas de envío",
    intro: "Descarga un PDF en blanco de escala/alineación, imprímelo al 100% y mídelo antes de imprimir franqueo pagado. Estas plantillas no incluyen códigos de barras del transportista.",
    cardCta: "Abrir guía de configuración",
    downloadCta: "Descargar PDF en blanco",
    contains: "Borde + comprobación de escala 100%. Sin código de barras del transportista.",
    guideFallback: "guía en inglés",
    toolFallback: "herramienta en inglés",
    fallbackPrefix: "Abre",
    sectionTitle: "Imprime las plantillas en Tamaño real",
    sectionText: "Desactiva Ajustar a página, encabezados del navegador y escalado del driver. Si la plantilla mide mal, corrige la escala antes de imprimir etiquetas del transportista.",
    flowTitle: "Mejor flujo",
    flow: [["1 · Descarga el PDF en blanco", "Empieza con el tamaño de papel que realmente cargas en la impresora."], ["2 · Imprime al 100%", "Usa Tamaño real y desactiva Ajustar a página, encabezados y escalado del driver."], ["3 · Mide y corrige", "Si el borde o la regla no coinciden, usa las herramientas de escala o calibración antes del franqueo."]],
    helperLinks: ["Comprobar el tamaño correcto", "Calcular escala de impresión", "Generar hoja de calibración", "Corregir etiquetas descentradas", "Comparar herramientas PDF Pro"],
  },
  zh: {
    title: "运单标签模板 | 4×6、A4 和 Letter",
    description: "打开空白 4×6、A4 和 Letter 运单标签模板页面，并以 100% 比例打印来确认打印机对齐。",
    breadcrumb: "模板",
    eyebrow: "模板中心",
    h1: "运单标签模板",
    intro: "下载空白比例/对齐 PDF，按 100% 打印并测量后，再打印已付运费。这些模板不包含承运商条码。",
    cardCta: "打开设置指南",
    downloadCta: "下载空白 PDF",
    contains: "边框 + 100% 比例检查。不含承运商条码。",
    guideFallback: "英文指南",
    toolFallback: "英文工具",
    fallbackPrefix: "打开",
    sectionTitle: "按实际大小打印模板",
    sectionText: "关闭适合页面、浏览器页眉页脚和驱动缩放。如果模板测量不正确，请先修正比例，再打印承运商标签。",
    flowTitle: "最佳流程",
    flow: [["1 · 下载空白 PDF", "从打印机实际装入的纸张尺寸开始。"], ["2 · 按 100% 打印", "使用实际大小，并关闭适合页面、页眉页脚和驱动缩放。"], ["3 · 测量后修复", "如果边框或标尺不正确，先使用比例或校准工具，再打印运费。"]],
    helperLinks: ["检查正确标签尺寸", "计算打印比例", "生成校准页", "修复标签未居中", "比较 Pro PDF 工具"],
  },
} satisfies Record<"en" | "es" | "zh", {
  title: string;
  description: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  cardCta: string;
  downloadCta: string;
  contains: string;
  guideFallback: string;
  toolFallback: string;
  fallbackPrefix: string;
  sectionTitle: string;
  sectionText: string;
  flowTitle: string;
  flow: string[][];
  helperLinks: string[];
}>;

const helperHrefs = ["/#checker", "/tools/scale-calculator", "/tools/calibration-sheet", "/shipping-label-not-centered", "/pricing"];

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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/templates", locale });
}

export default async function LocaleTemplatesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);
  const fallbackLabel = (path: string, label: string) => (locale !== defaultLocale && !hasLocalizedPath(path, locale) ? label : null);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: safeLocalizedPath("/templates", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{pageCopy.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.flowTitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {pageCopy.flow.map(([title, text]) => <MiniStep key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {templateSpecs.map((template) => {
            const href = `/${template.slug}-shipping-label-template`;
            const fallback = fallbackLabel(href, pageCopy.guideFallback);
            return (
              <article key={template.slug} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 transition hover:ring-sky-200 hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight text-[#12324A]">{template.label}</h2>
                  {fallback ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{pageCopy.fallbackPrefix} {fallback}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{template.widthIn} × {template.heightIn} in / {template.widthMm} × {template.heightMm} mm</p>
                <p className="mt-3 rounded-2xl bg-[#f7fbff] p-3 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">{pageCopy.contains}</p>
                <div className="mt-4">
                  <DownloadResponsibilityNotice locale={locale} compact />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <TemplateDownloadButton slug={template.slug} locale={locale} className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">{pageCopy.downloadCta}</TemplateDownloadButton>
                  <Link href={safeLocalizedPath(href, locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-sky-50">{pageCopy.cardCta}{fallback ? ` · ${fallback}` : ""}</Link>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.sectionTitle}</h2>
          <p className="mt-3 leading-7 text-slate-600">{pageCopy.sectionText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {helperHrefs.map((href, index) => {
              const fallback = fallbackLabel(href, href.startsWith("/tools/") ? pageCopy.toolFallback : pageCopy.guideFallback);
              return (
                <Link key={href} href={safeLocalizedPath(href, locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                  {pageCopy.helperLinks[index]}{fallback ? ` · ${pageCopy.fallbackPrefix} ${fallback}` : ""}
                </Link>
              );
            })}
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
