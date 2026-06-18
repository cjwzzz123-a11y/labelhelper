import type { MetadataRoute } from "next";
import { getImplementedSeoLocales, seoPages } from "@/data/seo-pages";
import { alternateLanguages, availableLocalesForPath, localizedPath, locales, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

const staticRoutes = [
  "",
  "/tools",
  "/tools/scale-calculator",
  "/tools/calibration-sheet",
  "/tools/pdf-analyzer",
  "/tools/test-print-pack",
  "/tools/barcode-quiet-zone-checker",
  "/tools/international-label-splitter",
  "/test-print",
  "/guides",
  "/templates",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
  "/refunds",
  "/terms",
];

const localizedStaticRoutes = new Set([
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
]);
const seoRoutes = seoPages.map((page) => `/${page.slug}`);
const seoLastModifiedByRoute = new Map(seoPages.map((page) => [`/${page.slug}`, page.updatedAt ? new Date(page.updatedAt) : null]));
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
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: path === "" || path === "/" ? "weekly" : "monthly",
    priority: path === "" || path === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languages).map(([language, href]) => [language, `${siteUrl}${href}`]),
      ),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-15");

  return [
    ...staticRoutes.map((route) => sitemapEntry(route, "en", lastModified)),
    ...seoRoutes.map((route) => sitemapEntry(route, "en", seoLastModifiedByRoute.get(route) ?? lastModified)),
    ...locales
      .filter((locale) => locale !== "en")
      .flatMap((locale) => [
        ...Array.from(localizedStaticRoutes)
          .filter((route) => availableLocalesForPath(route).includes(locale))
          .map((route) => sitemapEntry(route, locale, lastModified)),
        ...(seoLocales.has(locale) ? seoRoutes.filter((route) => availableLocalesForPath(route).includes(locale)).map((route) => sitemapEntry(route, locale, seoLastModifiedByRoute.get(route) ?? lastModified)) : []),
      ]),
  ];
}
