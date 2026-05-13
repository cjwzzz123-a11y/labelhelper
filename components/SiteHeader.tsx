"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { availableLocalesForPath, localeFromPath, localeNames, localizedPath, localeSwitcherPath, locales, type Locale } from "@/lib/i18n";

type NavItem = {
  href: string;
  key: string;
  namespace?: "common" | "nav";
};

const nav = [
  { href: "/#checker", key: "ctaSize", namespace: "common" },
  { href: "/tools", key: "tools" },
  { href: "/test-print", key: "testPrint" },
  { href: "/guides", key: "guides" },
  { href: "/pricing", key: "pricing" },
] satisfies NavItem[];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const intlLocale = useLocale();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = locales.includes(intlLocale as Locale) ? (intlLocale as Locale) : localeFromPath(pathname);
  const currentPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentUnlocalizedPath = currentPath === "/" ? "/" : currentPath.replace(/^\/(en|es|fr|de|ja|zh)(?=\/|$)/, "") || "/";
  const homeHref = localizedPath("/", locale);
  const availableLocaleOptions = availableLocalesForPath(pathname);
  const activeNavHref = getActiveNavHref(currentUnlocalizedPath);

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 shadow-sm shadow-sky-900/5 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-3 sm:px-6 xl:grid-cols-[minmax(0,auto)_minmax(0,1fr)] xl:items-center">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Link href={homeHref} className="min-w-0 shrink text-slate-950">
            <span className="block font-black leading-tight tracking-tight text-[#12324A]">{tCommon("siteName")}</span>
            <span className="block text-xs font-semibold text-sky-700">{tCommon("tagline")}</span>
          </Link>
          <div className="xl:hidden">
            <LanguageSelect locale={locale} pathname={pathname} availableLocaleOptions={availableLocaleOptions} label={tCommon("language")} comingSoon={tCommon("comingSoon")} />
          </div>
        </div>
        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <nav className="flex min-w-0 gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 text-sm font-semibold text-slate-600 xl:justify-end xl:overflow-visible" aria-label="Primary navigation">
            {nav.map((item) => {
              const active = item.href === activeNavHref;
              return (
                <Link
                  key={item.href}
                  href={localizedPath(item.href, locale)}
                  aria-current={active ? "page" : undefined}
                  className={`min-w-fit rounded-xl px-3 py-2 leading-tight transition ${active ? "bg-[#12324A] text-white shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-slate-950"}`}
                >
                  {item.namespace === "common" ? tCommon(item.key) : tNav(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
            <div className="hidden xl:block">
              <LanguageSelect locale={locale} pathname={pathname} availableLocaleOptions={availableLocaleOptions} label={tCommon("language")} comingSoon={tCommon("comingSoon")} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function getActiveNavHref(path: string) {
  if (path === "/") return "/#checker";
  if (path === "/test-print" || path === "/templates" || path === "/tools/calibration-sheet" || path === "/tools/test-print-pack") return "/test-print";
  if (path === "/guides" || (!path.startsWith("/tools") && !["/pricing", "/test-print", "/templates", "/unlock", "/thanks", "/about", "/privacy", "/terms"].includes(path))) return "/guides";
  if (path === "/pricing" || path === "/unlock" || path === "/thanks") return "/pricing";
  if (path.startsWith("/tools")) return "/tools";
  return "";
}

function LanguageSelect({
  locale,
  pathname,
  availableLocaleOptions,
  label,
  comingSoon,
}: {
  locale: Locale;
  pathname: string;
  availableLocaleOptions: Locale[];
  label: string;
  comingSoon: string;
}) {
  return (
    <>
      <label className="sr-only" htmlFor="site-language">
        {label}
      </label>
      <select
        id="site-language"
        value={locale}
        onChange={(event) => {
          window.location.href = localeSwitcherPath(pathname, event.target.value as Locale);
        }}
        className="max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-400 focus:bg-white sm:max-w-[10rem]"
        aria-label={label}
      >
        {availableLocaleOptions.map((item) => (
          <option key={item} value={item}>
            {localeNames[item]}
          </option>
        ))}
        {locales.filter((item) => !availableLocaleOptions.includes(item)).map((item) => (
          <option key={item} value={item} disabled>
            {localeNames[item]} · {comingSoon}
          </option>
        ))}
      </select>
    </>
  );
}
