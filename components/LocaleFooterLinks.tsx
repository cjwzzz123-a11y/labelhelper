"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {availableLocalesForPath, htmlLangs, localeNames, switchLocalePath} from "@/lib/i18n";

export function LocaleFooterLinks() {
  const pathname = usePathname() || "/";
  const availableLocales = availableLocalesForPath(pathname);

  if (availableLocales.length < 2) return null;

  return (
    <nav aria-label="Available languages" className="flex flex-wrap gap-x-3 gap-y-1 md:justify-end">
      {availableLocales.map((locale) => (
        <Link key={locale} href={switchLocalePath(pathname, locale)} hrefLang={htmlLangs[locale]} lang={htmlLangs[locale]} className="hover:underline">
          {localeNames[locale]}
        </Link>
      ))}
    </nav>
  );
}
