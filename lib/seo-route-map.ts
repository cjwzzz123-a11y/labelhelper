import { defaultLocale, type Locale } from "@/i18n/routing";

type SeoRouteId =
  | "etsy"
  | "shopify"
  | "ebay"
  | "amazon-fba"
  | "usps"
  | "ups"
  | "fedex"
  | "dhl"
  | "template-4x6"
  | "template-a4"
  | "template-letter"
  | "too-small"
  | "cut-off"
  | "barcode-not-scanning"
  | "not-centered"
  | "fit-vs-actual";

const seoRouteSlugs: Record<SeoRouteId, Record<Locale, string>> = {
  etsy: slug("etsy-shipping-label-size"),
  shopify: slug("shopify-shipping-label-size"),
  ebay: slug("ebay-shipping-label-size"),
  "amazon-fba": slug("amazon-fba-label-size"),
  usps: slug("usps-shipping-label-size"),
  ups: slug("ups-label-size"),
  fedex: slug("fedex-label-size"),
  dhl: slug("dhl-shipping-label-size"),
  "template-4x6": slug("4x6-shipping-label-template"),
  "template-a4": slug("a4-shipping-label-template"),
  "template-letter": slug("letter-shipping-label-template"),
  "too-small": slug("shipping-label-printing-too-small"),
  "cut-off": slug("shipping-label-cut-off-when-printing"),
  "barcode-not-scanning": slug("shipping-label-barcode-not-scanning"),
  "not-centered": slug("shipping-label-not-centered"),
  "fit-vs-actual": slug("fit-to-page-vs-actual-size-shipping-label"),
};

function slug(value: string): Record<Locale, string> {
  return {
    en: value,
    es: value,
    fr: value,
    de: value,
    ja: value,
    zh: value,
  };
}

function unprefixed(path: string) {
  const [withoutHash] = path.split("#");
  const normalized = withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;
  return normalized.replace(/^\/(en|es|fr|de|ja|zh)(?=\/|$)/, "") || "/";
}

export function seoRouteIdFromPath(path: string) {
  const normalized = unprefixed(path).replace(/^\//, "");
  return (Object.entries(seoRouteSlugs).find(([, slugs]) => Object.values(slugs).includes(normalized))?.[0] ?? null) as SeoRouteId | null;
}

export function localizedSeoRoutePath(path: string, locale: Locale) {
  const id = seoRouteIdFromPath(path);
  if (!id) return null;

  const targetSlug = seoRouteSlugs[id][locale] ?? seoRouteSlugs[id][defaultLocale];
  return locale === defaultLocale ? `/${targetSlug}` : `/${locale}/${targetSlug}`;
}

export function allSeoRoutePaths() {
  return Object.values(seoRouteSlugs).flatMap((slugs) => Object.values(slugs).map((value) => `/${value}`));
}
