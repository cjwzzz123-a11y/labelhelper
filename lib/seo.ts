import type { Metadata } from "next";
import { alternateLanguages, htmlLangs, localizedPath, openGraphLocale, type Locale } from "./i18n";

const siteName = "Shipping Label Helper";
export const siteUrl = "https://labelhelper.com";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  type?: "website" | "article";
  keywords?: string[];
  modifiedDate?: string;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function pageMetadata({ title, description, path, locale = "en", type = "website", keywords, modifiedDate }: PageMetadataInput): Metadata {
  const canonical = localizedPath(path, locale);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type,
      locale: openGraphLocale(locale),
      modifiedTime: modifiedDate,
    },
    twitter: {
      card: type === "article" ? "summary" : "summary_large_image",
      title,
      description,
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
    inLanguage: htmlLangs[locale],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
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
