import {defaultLocale, locales, type Locale} from "@/i18n/routing";
import { localizedSeoRoutePath, seoRouteIdFromPath } from "@/lib/seo-route-map";

export {defaultLocale, locales};
export type {Locale};

const localePrefixes = Object.fromEntries(
  locales.map((locale) => [locale, locale === defaultLocale ? "" : `/${locale}`]),
) as Record<Locale, string>;

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
};

export const htmlLangs: Record<Locale, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de-DE",
  ja: "ja",
  zh: "zh-CN",
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  ja: "ja_JP",
  zh: "zh_CN",
};

const localizedPaths = new Map<Locale, Set<string>>(
  locales.map((locale) => [locale, new Set<string>(["/", "/tools", "/tools/scale-calculator", "/tools/pdf-analyzer", "/tools/barcode-quiet-zone-checker", "/tools/calibration-sheet", "/tools/test-print-pack", "/test-print", "/guides", "/templates", "/pricing", "/thanks", "/unlock", "/privacy", "/terms", "/refunds"])]),
);

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function localeFromPath(path: string): Locale {
  const normalized = normalizePath(path);
  const firstSegment = normalized.split("/")[1];
  return isSupportedLocale(firstSegment) ? firstSegment : defaultLocale;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function splitHash(path: string) {
  const hashIndex = path.indexOf("#");
  if (hashIndex === -1) return { path, hash: "" };
  return { path: path.slice(0, hashIndex) || "/", hash: path.slice(hashIndex) };
}

export function unlocalizedPath(path: string) {
  const { path: pathWithoutHash, hash } = splitHash(path);
  const normalized = normalizePath(pathWithoutHash);

  for (const locale of locales) {
    const prefix = localePrefixes[locale];
    if (!prefix) continue;
    if (normalized === prefix) return `/${hash}`;
    if (normalized.startsWith(`${prefix}/`)) return `${normalized.slice(prefix.length) || "/"}${hash}`;
  }

  return `${normalized}${hash}`;
}

export function localizedPath(path: string, locale: Locale = defaultLocale) {
  const { path: pathWithoutHash, hash } = splitHash(path);
  const unprefixed = unlocalizedPath(pathWithoutHash);
  if (locale === defaultLocale) return `${unprefixed}${hash}`;

  const prefix = localePrefixes[locale];
  return unprefixed === "/" ? `${prefix}${hash}` : `${prefix}${unprefixed}${hash}`;
}

export function safeLocalizedPath(path: string, locale: Locale = defaultLocale) {
  const { path: unprefixed, hash } = splitHash(unlocalizedPath(path));
  return hasLocalizedPath(unprefixed, locale) ? localizedPath(`${unprefixed}${hash}`, locale) : localizedPath(`${unprefixed}${hash}`, defaultLocale);
}

export function registerLocalizedPaths(paths: string[], targetLocales: readonly Locale[] = locales) {
  for (const locale of targetLocales) {
    const localePaths = localizedPaths.get(locale);
    if (!localePaths) continue;
    for (const path of paths) {
      localePaths.add(unlocalizedPath(path));
    }
  }
}

export function hasLocalizedPath(path: string, locale: Locale) {
  if (seoRouteIdFromPath(path)) return true;

  const localePaths = localizedPaths.get(locale);
  const { path: unprefixed } = splitHash(unlocalizedPath(path));
  return locale === defaultLocale || Boolean(localePaths?.has(unprefixed));
}

export function availableLocalesForPath(path: string) {
  const unprefixed = unlocalizedPath(path);
  return locales.filter((locale) => hasLocalizedPath(unprefixed, locale));
}

export function localizedRoutesForPath(path: string) {
  const unprefixed = unlocalizedPath(path);
  return Object.fromEntries(
    availableLocalesForPath(unprefixed).map((locale) => [locale, localizedPath(unprefixed, locale)]),
  ) as Partial<Record<Locale, string>>;
}

export function switchLocalePath(path: string, locale: Locale) {
  const seoPath = localizedSeoRoutePath(path, locale);
  if (seoPath) return seoPath;

  const unprefixed = unlocalizedPath(path);
  if (hasLocalizedPath(unprefixed, locale)) return localizedPath(unprefixed, locale);
  return localizedPath(unprefixed, defaultLocale);
}

export function localeSwitcherPath(path: string, locale: Locale) {
  const seoPath = localizedSeoRoutePath(path, locale);
  if (seoPath) return seoPath;

  const { path: unprefixed, hash } = splitHash(unlocalizedPath(path));
  const targetLocale = hasLocalizedPath(unprefixed, locale) ? locale : defaultLocale;

  if (targetLocale === defaultLocale) {
    return unprefixed === "/" ? `/${defaultLocale}${hash}` : `/${defaultLocale}${unprefixed}${hash}`;
  }

  return localizedPath(`${unprefixed}${hash}`, targetLocale);
}

export function alternateLanguages(path: string) {
  const unprefixed = unlocalizedPath(path);
  const languages: Record<string, string> = {
    "x-default": localizedPath(unprefixed, defaultLocale),
  };

  for (const [locale, href] of Object.entries(localizedRoutesForPath(unprefixed))) {
    languages[locale] = href;
  }

  return languages;
}

export function openGraphLocale(locale: Locale = defaultLocale) {
  return openGraphLocales[locale];
}
