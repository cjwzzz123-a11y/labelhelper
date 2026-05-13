import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { Crown, LockKeyhole } from "lucide-react";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    vip: "VIP",
    free: "Free",
    unlocked: "Unlocked",
    locked: "Members only",
    unlock: "Unlock VIP",
  },
  zh: {
    vip: "VIP",
    free: "免费",
    unlocked: "已解锁",
    locked: "会员功能",
    unlock: "开通会员",
  },
};

export function VipBadge({ locale = defaultLocale, unlocked = false, label }: { locale?: Locale; unlocked?: boolean; label?: string }) {
  const c = locale === "zh" ? copy.zh : copy.en;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ring-1 ${unlocked ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-100 text-amber-900 ring-amber-200"}`}>
      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
      {label ?? (unlocked ? c.unlocked : c.vip)}
    </span>
  );
}

export function FreeBadge({ locale = defaultLocale }: { locale?: Locale }) {
  const c = locale === "zh" ? copy.zh : copy.en;

  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-sky-800 ring-1 ring-sky-100">
      {c.free}
    </span>
  );
}

export function MemberFeatureShell({
  children,
  locale = defaultLocale,
  unlocked = false,
  title,
  description,
  className = "",
  ...sectionProps
}: {
  children: ReactNode;
  locale?: Locale;
  unlocked?: boolean;
  title?: string;
  description?: string;
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  return (
    <section {...sectionProps} className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-xl sm:p-8 ${unlocked ? "border-emerald-200 bg-white shadow-emerald-900/10 ring-1 ring-emerald-100" : "border-amber-200 bg-[#fffdf7] shadow-amber-900/10 ring-1 ring-amber-100"} ${className}`}>
      <div className="absolute right-5 top-5 z-10">
        <VipBadge locale={locale} unlocked={unlocked} />
      </div>
      {(title || description) ? (
        <div className="mb-5 max-w-[calc(100%-5rem)]">
          {title ? <p className={`text-sm font-black uppercase tracking-[0.18em] ${unlocked ? "text-emerald-700" : "text-amber-700"}`}>{title}</p> : null}
          {description ? <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function MemberLockedCallout({ locale = defaultLocale, text }: { locale?: Locale; text: string }) {
  const c = locale === "zh" ? copy.zh : copy.en;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          <div>
            <p className="font-black">{c.locked}</p>
            <p className="mt-1 leading-6">{text}</p>
          </div>
        </div>
        <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full bg-[#12324A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1d4d70]">
          {c.unlock}
        </Link>
      </div>
    </div>
  );
}
