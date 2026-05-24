"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    badge: "Paid tool",
    title: (name: string) => `${name} requires Pro Toolkit`,
    text: "Guides, SEO pages and reference material stay free. Interactive tools, diagnostics and generated downloads are available after checkout and license unlock.",
    pricing: "Unlock Pro Toolkit",
    license: "Enter license key",
  },
  zh: {
    badge: "付费工具",
    title: (name: string) => `${name} 需要 Pro Toolkit`,
    text: "指南、SEO 页面和参考资料继续免费。交互工具、诊断功能和生成下载需要完成付费并输入许可证后使用。",
    pricing: "解锁 Pro Toolkit",
    license: "输入许可证密钥",
  },
};

export function PaidToolGate({
  children,
  feature,
  locale = defaultLocale,
}: {
  children: ReactNode;
  feature: string;
  locale?: Locale;
}) {
  const license = useStoredLicense();
  const pageCopy = locale === "zh" ? copy.zh : copy.en;

  if (license.verified) return children;

  return (
    <section className="rounded-[2rem] border border-amber-200 bg-[#fffdf7] p-6 shadow-xl shadow-amber-900/10 ring-1 ring-amber-100 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">{pageCopy.badge}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.title(feature)}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">{pageCopy.text}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">
              {pageCopy.pricing}
            </Link>
            <Link href={safeLocalizedPath("/unlock", locale)} className="rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-amber-50">
              {pageCopy.license}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
