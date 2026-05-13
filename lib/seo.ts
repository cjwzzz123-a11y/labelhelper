import type { Metadata } from "next";
import { alternateLanguages, localizedPath, openGraphLocale, type Locale } from "./i18n";

const siteName = "Shipping Label Helper";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
};

export function pageMetadata({ title, description, path, locale = "en" }: PageMetadataInput): Metadata {
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
      type: "website",
      locale: openGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
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
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
