import type { Metadata } from "next";
import { alternateLanguages, htmlLangs, localizedPath, openGraphLocale, type Locale } from "./i18n";

const siteName = "Shipping Label Helper";
const searchBrand = "LabelHelper";
export const siteUrl = "https://labelhelper.com";
export const socialImagePath = "/opengraph-image";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  type?: "website" | "article";
  keywords?: string[];
  modifiedDate?: string;
  robots?: Metadata["robots"];
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function normalizeSeoTitle(value: string) {
  const title = value
    .trim()
    .replace(/\s*\|\s*(?:Shipping Label Helper|LabelHelper)\s*$/iu, "")
    .replace(/\s*—\s*How to Fix Shipping Label Prints\s*$/iu, "")
    .replace(/\s*—\s*Cómo corregir la impresión de etiquetas\s*$/iu, "")
    .replace(/\s*—\s*运单标签打印修复方法\s*$/u, "");

  const branded = `${title} | ${searchBrand}`;
  if (branded.length <= 65) return branded;
  return title;
}

export function normalizeSeoDescription(value: string) {
  const description = value.replace(/\s+/gu, " ").trim();
  if (description.length <= 165) return description;

  const candidate = description.slice(0, 166);
  const sentenceEnd = Math.max(candidate.lastIndexOf(". "), candidate.lastIndexOf("? "), candidate.lastIndexOf("! "));
  if (sentenceEnd >= 55) return candidate.slice(0, sentenceEnd + 1).trim();

  return description;
}

export function pageMetadata({ title, description, path, locale = "en", type = "website", keywords, modifiedDate, robots }: PageMetadataInput): Metadata {
  const canonical = localizedPath(path, locale);
  const normalizedTitle = normalizeSeoTitle(title);
  const normalizedDescription = normalizeSeoDescription(description);
  const socialImage = {
    url: absoluteUrl(socialImagePath),
    width: 1200,
    height: 630,
    alt: "Shipping Label Helper — browser-local label size and print checks",
  };

  return {
    title: { absolute: normalizedTitle },
    description: normalizedDescription,
    keywords,
    robots,
    alternates: {
      canonical,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title: normalizedTitle,
      description: normalizedDescription,
      url: canonical,
      siteName,
      type,
      locale: openGraphLocale(locale),
      modifiedTime: modifiedDate,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description: normalizedDescription,
      images: [absoluteUrl(socialImagePath)],
    },
  };
}

export function softwareApplicationSchema({ title, description, path, locale = "en" }: PageMetadataInput) {
  const url = localizedPath(path, locale);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: absoluteUrl(url),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    image: absoluteUrl(socialImagePath),
    inLanguage: htmlLangs[locale],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
  };
}

export function websiteSchema(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: htmlLangs[locale],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function articleSchema({ title, description, path, locale = "en", modifiedDate }: PageMetadataInput) {
  const url = absoluteUrl(localizedPath(path, locale));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: htmlLangs[locale],
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(socialImagePath),
    dateModified: modifiedDate,
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function howToSchema({ title, description, path, locale = "en", steps }: PageMetadataInput & { steps: string[] }) {
  const url = absoluteUrl(localizedPath(path, locale));

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    inLanguage: htmlLangs[locale],
    url,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
    })),
  };
}

export function breadcrumbSchema({ items, locale = "en" }: { items: Array<{ name: string; path: string }>; locale?: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(item.path, locale)),
    })),
  };
}
