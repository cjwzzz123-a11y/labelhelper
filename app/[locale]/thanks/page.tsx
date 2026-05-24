import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IssueLicenseLookup } from "@/components/IssueLicenseLookup";
import { htmlLangs, isSupportedLocale, locales, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  en: {
    title: "Thanks | Shipping Label Helper",
    description: "Shipping Label Helper payment return page for checking license delivery and unlocking paid tools.",
    breadcrumb: "Thanks",
    badge: "Payment return",
    h1: "Thanks for trying Shipping Label Helper",
    intro: "When checkout is connected, this page will confirm your order and send the license key to your email. Guides and reference pages remain available while paid tool access waits for a license.",
    unlock: "Enter license key",
    tools: "Back to tools",
    nextBadge: "What happens next",
    steps: ["Checkout sends you back here.", "The order is verified before a key is issued.", "You paste the key on the unlock page to remove watermarks."],
  },
  zh: {
    title: "谢谢 | Shipping Label Helper",
    description: "Shipping Label Helper 支付返回页，用于检查许可证发送并解锁付费工具。",
    breadcrumb: "谢谢",
    badge: "支付返回",
    h1: "感谢试用 Shipping Label Helper",
    intro: "结账接入后，此页面会确认订单并把许可证密钥发送到你的邮箱。指南和参考页面仍可访问，付费工具需要许可证。",
    unlock: "输入许可证密钥",
    tools: "返回工具",
    nextBadge: "接下来会发生什么",
    steps: ["结账会把你带回这里。", "系统会先验证订单，再发放密钥。", "你在解锁页面粘贴密钥，即可移除水印。"],
  },
} satisfies Record<"en" | "zh", {
  title: string;
  description: string;
  breadcrumb: string;
  badge: string;
  h1: string;
  intro: string;
  unlock: string;
  tools: string;
  nextBadge: string;
  steps: string[];
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
  return pageMetadata({ title: pageCopy.title, description: pageCopy.description, path: "/thanks", locale });
}

export default async function LocaleThanksPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  const pageCopy = getCopy(locale);

  return (
    <main lang={htmlLangs[locale]} className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Breadcrumb items={[{ name: pageCopy.breadcrumb, href: safeLocalizedPath("/thanks", locale) }]} homeHref={safeLocalizedPath("/", locale)} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
            <p className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-200">{pageCopy.badge}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{pageCopy.h1}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">{pageCopy.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={safeLocalizedPath("/unlock", locale)} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">{pageCopy.unlock}</Link>
              <Link href={safeLocalizedPath("/tools", locale)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold hover:bg-sky-50">{pageCopy.tools}</Link>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.nextBadge}</p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {pageCopy.steps.map((step, index) => <li key={step}><strong>{index + 1}.</strong> {step}</li>)}
              </ol>
            </section>
            <IssueLicenseLookup locale={locale} />
          </aside>
        </div>
      </section>
    </main>
  );
}
