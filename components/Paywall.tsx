"use client";

import Link from "next/link";
import { RefundBoundaryNotice } from "@/components/LegalNotice";
import { clearStoredLicense, useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    unlocked: "Paid access unlocked",
    available: (feature: string) => `${feature} is available`,
    cached: (date: string) => `Your license is cached on this device until ${date}.`,
    clear: "Clear local license",
    preview: "Preview only",
    unlock: (feature: string) => `${feature} is a paid feature`,
    text: "Guides, SEO pages and reference material stay free. Paid access unlocks this tool, generated downloads, saved reports and deeper checks.",
    paidLabel: "Paid unlocks",
    paidDetail: "Watermark-free downloads, saved reports and license-based access",
    pricing: "Compare preview access",
    enter: "Enter license key",
  },
  zh: {
    unlocked: "付费访问已解锁",
    available: (feature: string) => `${feature} 已可使用`,
    cached: (date: string) => `此设备上的许可证缓存有效期至 ${date}。`,
    clear: "清除此设备许可证",
    preview: "仅供预览",
    unlock: (feature: string) => `${feature} 是付费功能`,
    text: "指南、SEO 页面和参考资料继续免费。付费访问会解锁此工具、生成下载、保存报告和更深入检查。",
    paidLabel: "付费解锁内容",
    paidDetail: "无水印下载、保存报告、基于许可证的访问",
    pricing: "比较预览访问权限",
    enter: "输入许可证密钥",
  },
};

export function Paywall({ feature, locale = defaultLocale }: { feature: string; locale?: Locale }) {
  const license = useStoredLicense();
  const pageCopy = locale === "zh" ? copy.zh : copy.en;

  if (license.verified) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{pageCopy.unlocked}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{pageCopy.available(feature)}</h2>
        <p className="mt-3 leading-7 text-slate-700">
          {pageCopy.cached(new Date(license.verifiedUntil).toLocaleString())}
        </p>
        <button type="button" onClick={clearStoredLicense} className="mt-6 rounded-full border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-white">
          {pageCopy.clear}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">{pageCopy.preview}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#12324A]">{pageCopy.unlock(feature)}</h2>
      <p className="mt-3 leading-7 text-slate-700">
        {pageCopy.text}
      </p>
      <div className="mt-5 rounded-2xl bg-white px-4 py-3 ring-1 ring-amber-100">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">{pageCopy.paidLabel}</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{pageCopy.paidDetail}</p>
      </div>
      <div className="mt-4">
        <RefundBoundaryNotice locale={locale} compact />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4d70]">
          {pageCopy.pricing}
        </Link>
        <Link href={safeLocalizedPath("/unlock", locale)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white">
          {pageCopy.enter}
        </Link>
      </div>
    </section>
  );
}
