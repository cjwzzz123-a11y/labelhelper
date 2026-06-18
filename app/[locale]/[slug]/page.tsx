import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { RelatedLinks } from "@/components/RelatedLinks";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";
import { SizeChecker } from "@/components/tools/SizeChecker";
import LocaleHome, { generateMetadata as generateHomeMetadata } from "../LocaleHome";
import { getStaticSeoPages, type SeoPage, type SeoPageKind } from "@/data/seo-pages";
import { esSeoPageKinds } from "@/data/seo-pages.es";
import { zhSeoPageKinds } from "@/data/seo-pages.zh";
import { defaultLocale, hasLocalizedPath, htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { lookup } from "@/lib/rules-engine";
import { articleSchema, howToSchema, pageMetadata } from "@/lib/seo";

const pageUi = {
  en: {
    quickAnswer: "Quick answer",
    recommendedSize: "Recommended size",
    printScale: "Print scale",
    orientation: "Orientation",
    portrait: "Portrait",
    fallbackTool: "English tool",
    fallbackGuide: "English guide",
    opens: "Opens",
    sourceNotes: "Source notes",
    faq: "FAQ",
    related: "Related guides",
    nextTitle: "Best next step",
    nextText: "Start with the tool or template that matches this guide before printing paid postage again.",
    templateNext: "Download and print a blank template at 100% first.",
    troubleshooterNext: "Follow the symptom-led steps before buying or reprinting postage.",
    checkerNext: "Use the checker below to confirm paper, carrier and printer setup.",
    guides: "Guides",
    templates: "Templates",
    templateDownloadTitle: "Download the blank scale/alignment template",
    templateDownloadText: "Use this blank scale/alignment PDF before printing paid postage. Print at 100% / Actual Size, measure the output, then move to the real carrier label only after the border and scale are correct. This template does not include a carrier barcode.",
    downloadPdf: "Download PDF template",
    fixScale: "Fix print scale",
    opensEnglishTool: " · Opens English tool",
    symptomLed: "Symptom-led fix",
    sourceText1: "This guide is based on recurring seller-support patterns: labels printed from browser previews, PDF viewers resizing files, thermal rolls loaded off-center, and barcodes losing quiet-zone whitespace.",
    sourceText2: "When a platform or carrier offers a specific label-format setting, follow that official setting first, then use the checker and templates here to confirm print scale, paper size, orientation, and barcode quiet zone before shipping.",
    troubleshooterSourceText: "For troubleshooting, prioritize fixes that include printer model, paper size, PDF viewer, and scale setting before reprinting paid postage.",
    lastReviewed: "Last reviewed",
    reviewChecklist: "Preflight checklist",
  },
  es: {
    quickAnswer: "Respuesta rápida",
    recommendedSize: "Tamaño recomendado",
    printScale: "Escala de impresión",
    orientation: "Orientación",
    portrait: "Vertical",
    fallbackTool: "herramienta en inglés",
    fallbackGuide: "guía en inglés",
    opens: "Abre",
    sourceNotes: "Notas sobre las fuentes",
    faq: "Preguntas frecuentes",
    related: "Guías relacionadas",
    nextTitle: "Mejor siguiente paso",
    nextText: "Antes de volver a imprimir franqueo pagado, empieza con la herramienta o plantilla que coincide con esta guía.",
    templateNext: "Descarga e imprime primero una plantilla en blanco al 100%.",
    troubleshooterNext: "Sigue los pasos según el síntoma antes de comprar o reimprimir franqueo.",
    checkerNext: "Usa el verificador de abajo para confirmar papel, transportista e impresora.",
    guides: "Guías",
    templates: "Plantillas",
    templateDownloadTitle: "Descarga la plantilla en blanco de escala/alineación",
    templateDownloadText: "Úsala antes de imprimir franqueo pagado. Imprime al 100% / Tamaño real, mide el resultado y pasa a la etiqueta real solo cuando el borde y la escala sean correctos. Esta plantilla no incluye código de barras del transportista.",
    downloadPdf: "Descargar plantilla PDF",
    fixScale: "Corregir escala de impresión",
    opensEnglishTool: " · Abre herramienta en inglés",
    symptomLed: "Solución según el síntoma",
    sourceText1: "Esta guía se basa en patrones recurrentes de soporte para vendedores: etiquetas impresas desde vistas previas del navegador, visores PDF que cambian el tamaño, rollos térmicos desalineados y códigos de barras que pierden margen libre.",
    sourceText2: "Si una plataforma o transportista ofrece una configuración oficial de formato de etiqueta, sigue primero esa configuración. Después usa estas herramientas y plantillas para confirmar escala, tamaño de papel, orientación y margen libre del código de barras antes de enviar.",
    troubleshooterSourceText: "Para solucionar problemas, prioriza correcciones que incluyan modelo de impresora, tamaño de papel, visor PDF y escala antes de reimprimir franqueo pagado.",
    lastReviewed: "Última revisión",
    reviewChecklist: "Lista de comprobación previa",
  },
  zh: {
    quickAnswer: "快速答案",
    recommendedSize: "推荐尺寸",
    printScale: "打印比例",
    orientation: "方向",
    portrait: "纵向",
    fallbackTool: "英文工具",
    fallbackGuide: "英文指南",
    opens: "打开",
    sourceNotes: "来源说明",
    faq: "常见问题",
    related: "相关指南",
    nextTitle: "最佳下一步",
    nextText: "重新打印已付运费前，先使用与本指南匹配的工具或模板。",
    templateNext: "先下载空白模板，并按 100% 打印测试。",
    troubleshooterNext: "购买或重打运费前，先按症状排查步骤处理。",
    checkerNext: "使用下方检查器确认纸张、承运商和打印机设置。",
    guides: "指南",
    templates: "模板",
    templateDownloadTitle: "下载空白比例/对齐模板",
    templateDownloadText: "在打印已付运费前，先使用这个空白比例/对齐 PDF。以 100% / 实际大小打印、测量输出，确认边框和比例正确后再打印真实承运商标签。此模板不包含承运商条码。",
    downloadPdf: "下载 PDF 模板",
    fixScale: "修复打印比例",
    opensEnglishTool: " · 打开 英文工具",
    symptomLed: "按症状排查",
    sourceText1: "本指南基于反复出现的卖家支持场景：从浏览器预览打印标签、PDF 阅读器调整文件大小、热敏卷纸偏移，以及条码失去空白区。",
    sourceText2: "如果平台或承运商提供特定标签格式设置，请先遵循官方设置，再用这里的检查器和模板确认打印比例、纸张尺寸、方向和条码空白区。",
    troubleshooterSourceText: "排查问题时，优先参考包含打印机型号、纸张尺寸、PDF 阅读器和比例设置的修复方法。",
    lastReviewed: "最后审查",
    reviewChecklist: "打印前检查清单",
  },
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function getPageUi(locale: Locale) {
  if (locale === "es") return pageUi.es;
  if (locale === "zh") return pageUi.zh;
  return pageUi.en;
}

function getKindLabel(kind: SeoPageKind, locale: Locale) {
  if (locale === "es") return `${esSeoPageKinds[kind]}${kind === "template" ? "" : " guía"}`;
  if (locale === "zh") return `${zhSeoPageKinds[kind]}${kind === "template" ? "" : "指南"}`;

  const labels: Record<SeoPageKind, string> = {
    platform: "platform guide",
    carrier: "carrier guide",
    template: "template",
    troubleshooter: "troubleshooting guide",
  };
  return labels[kind];
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales
    .flatMap((locale) => [{ locale, slug: "__home" }, ...getStaticSeoPages(locale).map((page) => ({ locale, slug: page.slug }))]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};
  if (slug === "__home") return generateHomeMetadata({ params: Promise.resolve({ locale }) });
  const page = getStaticSeoPages(locale).find((candidate) => candidate.slug === slug);
  if (!page) return {};

  return pageMetadata({ title: page.title, description: page.description, path: `/${page.slug}`, locale, type: "article", keywords: page.keywords, modifiedDate: page.updatedAt });
}

export default async function LocaleSeoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) notFound();

  if (slug === "__home") {
    return <LocaleHome params={Promise.resolve({ locale })} />;
  }

  setRequestLocale(locale);
  const page = getStaticSeoPages(locale).find((candidate) => candidate.slug === slug);
  if (!page) notFound();

  const ui = getPageUi(locale);
  const shouldShowChecker = page.kind === "platform" || page.kind === "carrier";
  const combo = page.defaultCombo;
  const rule = combo ? lookup(combo.platform, combo.carrier, "4x6", "thermal") : null;
  const isTemplate = page.kind === "template";
  const schema = articleSchema({ title: page.h1, description: page.description, path: `/${page.slug}`, locale, keywords: page.keywords, modifiedDate: page.updatedAt });
  const howToJsonLd = page.reviewChecklist?.length ? howToSchema({ title: `${page.h1} checklist`, description: page.quickAnswer, path: `/${page.slug}`, locale, steps: page.reviewChecklist }) : null;
  const fallbackLabel = (path: string, label: string) => (locale !== defaultLocale && !hasLocalizedPath(path, locale) ? label : null);
  const nextStepText = isTemplate ? ui.templateNext : page.kind === "troubleshooter" ? ui.troubleshooterNext : ui.checkerNext;

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={schema} />
      {howToJsonLd ? <JsonLd data={howToJsonLd} /> : null}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Breadcrumb items={[{ name: isTemplate ? ui.templates : ui.guides, href: safeLocalizedPath(isTemplate ? "/templates" : "/guides", locale) }, { name: page.h1, href: safeLocalizedPath(`/${page.slug}`, locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{getKindLabel(page.kind, locale)}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{page.description}</p>
          </div>
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{ui.nextTitle}</p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-[#12324A]">{nextStepText}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{ui.nextText}</p>
            {page.updatedAt ? <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{ui.lastReviewed}: {page.updatedAt}</p> : null}
          </section>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-[#12324A]">{ui.quickAnswer}</h2>
          <p className="mt-3 leading-7 text-slate-700">{page.quickAnswer}</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7fbff] p-4"><dt className="text-xs font-semibold uppercase text-slate-500">{ui.recommendedSize}</dt><dd className="mt-1 font-bold text-[#12324A]">4 × 6 in</dd></div>
            <div className="rounded-2xl bg-[#f7fbff] p-4"><dt className="text-xs font-semibold uppercase text-slate-500">{ui.printScale}</dt><dd className="mt-1 font-bold text-[#12324A]">100%</dd></div>
            <div className="rounded-2xl bg-[#f7fbff] p-4"><dt className="text-xs font-semibold uppercase text-slate-500">{ui.orientation}</dt><dd className="mt-1 font-bold text-[#12324A]">{ui.portrait}</dd></div>
          </dl>
        </section>

        {shouldShowChecker && combo && rule ? (
          <div className="mt-8">
            <SizeChecker initialRule={rule} initialPlatform={combo.platform} initialCarrier={combo.carrier} locale={locale} variant="inline" />
          </div>
        ) : null}

        {isTemplate ? <TemplateDownloads slug={page.slug} locale={locale} /> : null}
        {page.kind === "troubleshooter" && page.decisionTree ? <TroubleshootingDecisionTree locale={locale} tree={page.decisionTree} /> : null}
        {page.reviewChecklist?.length ? <ReviewChecklist locale={locale} items={page.reviewChecklist} /> : null}

        <article className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          {page.sections.map((section, index) => (
            <section key={section.heading} className="mt-8 first:mt-0">
              <h2 className="text-2xl font-black tracking-tight text-[#12324A]">{section.heading}</h2>
              <p className="mt-4 leading-7 text-slate-600">{section.body}</p>
              {index === 1 ? <AdSlot slot={locale === "zh" ? "zh-in-content-1" : `${locale}-in-content-1`} /> : null}
            </section>
          ))}
        </article>

        <CommunityCitationPlaceholder kind={page.kind} locale={locale} />
        <div className="mt-8">
          <FAQ heading={ui.faq} items={page.faq} />
        </div>
        <div className="mt-8">
          <RelatedLinks heading={ui.related} links={page.related.map((link) => {
            const fallback = fallbackLabel(link.href, link.href.startsWith("/tools/") ? ui.fallbackTool : ui.fallbackGuide);
            return { ...link, title: fallback ? `${link.title} · ${ui.opens} ${fallback}` : link.title, href: safeLocalizedPath(link.href, locale) };
          })} />
        </div>
      </section>
    </main>
  );
}

function ReviewChecklist({ locale, items }: { locale: Locale; items: string[] }) {
  const ui = getPageUi(locale);

  return (
    <section className="mt-8 rounded-3xl bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100 sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-emerald-950">{ui.reviewChecklist}</h2>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-emerald-950 ring-1 ring-emerald-100">{item}</li>
        ))}
      </ul>
    </section>
  );
}

function TemplateDownloads({ slug, locale }: { slug: string; locale: Locale }) {
  const ui = getPageUi(locale);
  const templateSlug = slug.replace("-shipping-label-template", "");
  const scaleCalculatorLabel = locale !== defaultLocale && !hasLocalizedPath("/tools/scale-calculator", locale) ? ui.opensEnglishTool : "";

  return (
    <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-white">{ui.templateDownloadTitle}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-300">{ui.templateDownloadText}</p>
      <div className="mt-5">
        <DownloadResponsibilityNotice locale={locale} compact />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <TemplateDownloadButton slug={templateSlug} locale={locale} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">
          {ui.downloadPdf}
        </TemplateDownloadButton>
        <Link href={safeLocalizedPath("/tools/scale-calculator", locale)} className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900">
          {ui.fixScale}{scaleCalculatorLabel}
        </Link>
      </div>
    </section>
  );
}

function TroubleshootingDecisionTree({ locale, tree }: { locale: Locale; tree: NonNullable<SeoPage["decisionTree"]> }) {
  const ui = getPageUi(locale);
  const fallbackLabel = (path: string) => (locale !== defaultLocale && !hasLocalizedPath(path, locale) ? ui.opensEnglishTool : "");

  return (
    <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{ui.symptomLed}</p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[#12324A]">{tree.headline}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{tree.intro}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-900 ring-1 ring-emerald-100">{tree.firstAction}</div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {tree.steps.map((step, index) => (
          <article key={step.title} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-800">{index + 1}</div>
            <h3 className="mt-4 text-lg font-black tracking-tight text-[#12324A]">{step.title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{step.symptom}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.action}</p>
            <Link href={safeLocalizedPath(step.href, locale)} className="mt-5 inline-block rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">
              {step.cta}{fallbackLabel(step.href)}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommunityCitationPlaceholder({ kind, locale }: { kind: string; locale: Locale }) {
  const ui = getPageUi(locale);

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-[#12324A]">{ui.sourceNotes}</h2>
      <p className="mt-3">{ui.sourceText1}</p>
      <p className="mt-3">{ui.sourceText2}</p>
      {kind === "troubleshooter" ? <p className="mt-3 font-medium text-slate-700">{ui.troubleshooterSourceText}</p> : null}
    </section>
  );
}
