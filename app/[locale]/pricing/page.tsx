import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LicenseStatusPanel } from "@/components/LicenseStatusPanel";
import { getCheckoutPlan } from "@/lib/creem-client";
import { defaultLocale, hasLocalizedPath, htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const uiCopy = {
  en: {
    decisionEyebrow: "Choose by need",
    decisionTitle: "Start free, then unlock Pro tools when you need clean exports.",
    freeNeed: "One print fix",
    freePath: "Use the free checker first.",
    proNeed: "PDF, barcode or calibration previews",
    proPath: "Open preview tools before paying.",
    bestFor: "Best for",
    next: "What happens next",
    freeBest: "A seller checking one label setup before printing.",
    freeNext: "Run the checker, then print a blank template if anything looks risky.",
    proBest: "A seller who needs PDF page-size, calibration and barcode image review.",
    proNextConfigured: "Buy securely with Creem, then enter the license key from your receipt or customer portal.",
    proNextPreview: "Use the previews first. Checkout and license delivery are shown only when configured.",
    alreadyKey: "Already have a key?",
    templates: "Open templates",
    previewTools: "Open Pro previews",
    pdfPreview: "Open PDF Analyzer",
    useFree: "Use previews first",
  },
  zh: {
    decisionEyebrow: "按需求选择",
    decisionTitle: "先免费使用；需要干净导出时再解锁 Pro 工具。",
    freeNeed: "只修复一次打印问题",
    freePath: "先用免费检查器。",
    proNeed: "需要 PDF、条码或校准预览",
    proPath: "付款前先打开预览工具。",
    bestFor: "适合",
    next: "接下来会发生什么",
    freeBest: "打印前只想检查一次标签设置的卖家。",
    freeNext: "先运行检查器；如果有风险，再打印空白模板测试。",
    proBest: "需要 PDF 页面尺寸、校准页和条码图片复核的卖家。",
    proNextConfigured: "通过 Creem 安全支付后，输入收据或客户门户里的许可证密钥。",
    proNextPreview: "先使用预览。只有 checkout 和许可证发送配置好后，才显示真实解锁流程。",
    alreadyKey: "已有密钥？",
    templates: "打开模板",
    previewTools: "打开 Pro 预览",
    pdfPreview: "打开 PDF 分析器",
    useFree: "先使用预览",
  },
} satisfies Record<"en" | "zh", Record<string, string>>;

function getUiCopy(locale: Locale) {
  return locale === "zh" ? uiCopy.zh : uiCopy.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pricing" });
  return pageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path: "/pricing", locale });
}

export default async function LocalePricingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing" });
  const ui = getUiCopy(locale);
  const proCheckout = getCheckoutPlan("pro_lifetime", t("plans.pro.name"), "$9");
  const fallbackLabel = (path: string) => (locale !== defaultLocale && !hasLocalizedPath(path, locale) ? ` (${t("opensEnglish")})` : "");
  const localHref = (href: string) => href.startsWith("http") ? href : href.startsWith("/pricing#") ? `${safeLocalizedPath("/pricing", locale)}${href.slice("/pricing".length)}` : safeLocalizedPath(href, locale);

  const plans = [
    {
      name: t("plans.free.name"),
      price: "$0",
      note: t("plans.free.note"),
      cta: t("plans.free.cta"),
      href: "/#checker",
      status: t("status.available"),
      bestFor: ui.freeBest,
      next: ui.freeNext,
      secondary: [{ href: "/templates", label: ui.templates }],
      features: [t("plans.free.feature1"), t("plans.free.feature2"), t("plans.free.feature3"), t("plans.free.feature4")],
    },
    {
      name: proCheckout.name,
      price: proCheckout.price,
      note: proCheckout.configured ? t("checkoutReadyNote") : t("plans.pro.note"),
      cta: proCheckout.configured ? t("secureCheckout") : ui.previewTools,
      href: proCheckout.configured ? proCheckout.checkoutUrl : "/tools",
      status: proCheckout.configured ? t("status.checkoutReady") : t("status.preview"),
      bestFor: ui.proBest,
      next: proCheckout.configured ? ui.proNextConfigured : ui.proNextPreview,
      secondary: [
        { href: "/tools/pdf-analyzer", label: ui.pdfPreview },
        { href: "/unlock", label: ui.alreadyKey },
      ],
      features: [t("plans.pro.feature1"), t("plans.pro.feature2"), t("plans.pro.feature3"), t("plans.pro.feature4")],
    },
  ];

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: t("breadcrumb"), href: safeLocalizedPath("/pricing", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{t("eyebrow")}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{t("h1")}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{t("intro")}</p>
          </div>
          <div className="space-y-4">
            <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-6 text-emerald-900">
              <p className="font-bold">{t("honestyTitle")}</p>
              <p className="mt-2">{t("honestyText")}</p>
            </aside>
            <LicenseStatusPanel locale={locale} />
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{ui.decisionEyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">{ui.decisionTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              [ui.freeNeed, ui.freePath, "/#checker"],
              [ui.proNeed, ui.proPath, "/tools"],
            ].map(([title, text, href]) => (
              <Link key={title} href={localHref(href)} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                <p className="font-black">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <section key={plan.name} className={`rounded-3xl bg-white p-6 shadow-sm ring-1 ${index === 0 ? "ring-sky-200" : "ring-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-black tracking-tight">{plan.name}</h2>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-100">{plan.status}</span>
              </div>
              <p className="mt-3 text-4xl font-black">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.note}</p>
              <div className="mt-5 rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">{ui.bestFor}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{plan.bestFor}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{ui.next}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{plan.next}</p>
              </div>
              <ul className="mt-6 space-y-2 text-sm leading-6 text-slate-700">
                {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <Link href={localHref(plan.href)} className="mt-6 inline-block rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">{plan.cta}{fallbackLabel(plan.href)}</Link>
              <div className="mt-4 flex flex-wrap gap-3">
                {plan.secondary.map((link) => <Link key={link.href} href={localHref(link.href)} className="text-sm font-bold text-[#12324A] hover:underline">{link.label}{fallbackLabel(link.href)}</Link>)}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 id="pro-interest" className="text-2xl font-black tracking-tight">{t("nextTitle")}</h2>
          <p className="mt-3 leading-7 text-slate-600">{t("nextText")}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link href={safeLocalizedPath("/tools", locale)} className="text-sm font-bold text-[#12324A] hover:underline">{t("freeToolsLink")}</Link>
            <Link href={safeLocalizedPath("/tools/pdf-analyzer", locale)} className="text-sm font-bold text-[#12324A] hover:underline">{t("compareLink")}{fallbackLabel("/tools/pdf-analyzer")}</Link>
            <Link href={safeLocalizedPath("/unlock", locale)} className="text-sm font-bold text-[#12324A] hover:underline">{ui.alreadyKey}</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
