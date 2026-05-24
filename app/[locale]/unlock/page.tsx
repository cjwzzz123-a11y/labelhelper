import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LicenseStatusPanel } from "@/components/LicenseStatusPanel";
import { UnlockLicenseForm } from "@/components/UnlockLicenseForm";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Unlock Pro Tools",
    description: "Enter a Shipping Label Helper license key to unlock paid tools on this browser.",
    breadcrumb: "Unlock",
    badge: "License access",
    h1: "Unlock Pro Tools",
    intro: "Enter the key from your purchase email to unlock watermark-free reports and downloads on this browser.",
    beforeBadge: "Need a key?",
    beforeTitle: "Tools unlock after payment",
    beforeText: "Guides, SEO pages and reference material stay free. Interactive tools and generated downloads require Pro Toolkit.",
    freeCta: "Read free guides",
    pricingCta: "Compare access",
  },
  zh: {
    title: "解锁 Pro 工具",
    description: "输入 Shipping Label Helper 许可证密钥，在此浏览器解锁付费工具。",
    breadcrumb: "解锁",
    badge: "许可证访问",
    h1: "解锁 Pro 工具",
    intro: "输入购买邮件中的密钥，在此浏览器解锁无水印报告和下载。",
    beforeBadge: "需要密钥？",
    beforeTitle: "工具付款后解锁",
    beforeText: "指南、SEO 页面和参考资料继续免费。交互工具和生成下载需要 Pro Toolkit。",
    freeCta: "阅读免费指南",
    pricingCta: "比较访问权限",
  },
} satisfies Record<"en" | "zh", {
  title: string;
  description: string;
  breadcrumb: string;
  badge: string;
  h1: string;
  intro: string;
  beforeBadge: string;
  beforeTitle: string;
  beforeText: string;
  freeCta: string;
  pricingCta: string;
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/unlock", locale });
}

export default async function LocaleUnlockPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: safeLocalizedPath("/unlock", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">{pageCopy.badge}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{pageCopy.h1}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
            <UnlockLicenseForm locale={locale} />
          </div>

          <aside className="space-y-6">
            <LicenseStatusPanel locale={locale} />
            <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.beforeBadge}</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">{pageCopy.beforeTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.beforeText}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={safeLocalizedPath("/guides", locale)} className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">{pageCopy.freeCta}</Link>
                <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-white">{pageCopy.pricingCta}</Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
