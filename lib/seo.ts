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
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function pageMetadata({ title, description, path, locale = "en", type = "website" }: PageMetadataInput): Metadata {
  const canonical = localizedPath(path, locale);

  return {
    title,
    description,
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

export function articleSchema({ title, description, path, locale = "en" }: PageMetadataInput & { modifiedDate?: string }) {
  const url = absoluteUrl(localizedPath(path, locale));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: htmlLangs[locale],
    url,
    mainEntityOfPage: url,
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}
