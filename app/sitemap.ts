import type { MetadataRoute } from "next";
import { getImplementedSeoLocales, seoPages } from "@/data/seo-pages";
import { alternateLanguages, availableLocalesForPath, localizedPath, locales, type Locale } from "@/lib/i18n";

const baseUrl = "https://shippinglabelhelper.com";

const staticRoutes = [
  "",
  "/tools",
  "/tools/scale-calculator",
  "/tools/calibration-sheet",
  "/tools/pdf-analyzer",
  "/tools/test-print-pack",
  "/tools/barcode-quiet-zone-checker",
  "/test-print",
  "/guides",
  "/templates",
  "/pricing",
  "/thanks",
  "/unlock",
  "/about",
  "/privacy",
  "/terms",
];

const localizedStaticRoutes = new Set(["", "/", "/tools", "/test-print", "/guides", "/templates", "/pricing", "/thanks", "/unlock"]);
const seoRoutes = seoPages.map((page) => `/${page.slug}`);
const seoLocales = new Set<Locale>(getImplementedSeoLocales());

function sitemapEntry(path: string, locale: Locale, lastModified: Date): MetadataRoute.Sitemap[number] {
  const route = localizedPath(path, locale);
  const hasAlternates = localizedStaticRoutes.has(path || "/") || seoRoutes.includes(path);
  const languages = hasAlternates
    ? alternateLanguages(path || "/")
    : {
        en: localizedPath(path, "en"),
        "x-default": localizedPath(path, "en"),
      };

  return {
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: path === "" || path === "/" ? "weekly" : "monthly",
    priority: path === "" || path === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languages).map(([language, href]) => [language, `${baseUrl}${href}`]),
      ),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-10");

  return [
    ...staticRoutes.map((route) => sitemapEntry(route, "en", lastModified)),
    ...seoRoutes.map((route) => sitemapEntry(route, "en", lastModified)),
    ...locales
      .filter((locale) => locale !== "en")
      .flatMap((locale) => [
        ...Array.from(localizedStaticRoutes)
          .filter((route) => availableLocalesForPath(route).includes(locale))
          .map((route) => sitemapEntry(route, locale, lastModified)),
        ...(seoLocales.has(locale) ? seoRoutes.filter((route) => availableLocalesForPath(route).includes(locale)).map((route) => sitemapEntry(route, locale, lastModified)) : []),
      ]),
  ];
}
