import { defaultLocale, locales, type Locale } from "@/i18n/routing";

type SeoRouteId = string;

const translatedSeoRouteIds = [
  "etsy-shipping-label-size",
  "shopify-shipping-label-size",
  "ebay-shipping-label-size",
  "amazon-fba-label-size",
  "usps-shipping-label-size",
  "ups-label-size",
  "fedex-label-size",
  "dhl-shipping-label-size",
  "4x6-shipping-label-template",
  "a4-shipping-label-template",
  "letter-shipping-label-template",
  "shipping-label-printing-too-small",
  "shipping-label-cut-off-when-printing",
  "shipping-label-barcode-not-scanning",
  "shipping-label-not-centered",
  "fit-to-page-vs-actual-size-shipping-label",
] as const;

const translatedSeoLocales = ["es", "zh"] as const satisfies readonly Locale[];

const seoRouteIds = [
  "etsy-shipping-label-size",
  "shopify-shipping-label-size",
  "ebay-shipping-label-size",
  "amazon-fba-label-size",
  "usps-shipping-label-size",
  "ups-label-size",
  "fedex-label-size",
  "dhl-shipping-label-size",
  "4x6-shipping-label-template",
  "a4-shipping-label-template",
  "letter-shipping-label-template",
  "shipping-label-printing-too-small",
  "shipping-label-cut-off-when-printing",
  "shipping-label-barcode-not-scanning",
  "shipping-label-not-centered",
  "fit-to-page-vs-actual-size-shipping-label",
  "ebay-shipping-label-prints-too-small",
  "ebay-4x6-label-sideways-thermal-printer",
  "ebay-shipping-label-cut-off-left-side",
  "ebay-shipping-label-size-4x6-vs-letter",
  "ebay-shipping-label-trimmed-or-taped",
  "amazon-shipping-label-too-small-blurry",
  "amazon-4x6-label-on-a4-or-letter",
  "amazon-fba-label-wrong-paper-size",
  "amazon-a4-label-to-4x6-thermal",
  "amazon-label-dimensions-dont-match-package",
  "shopify-shipping-labels-printing-incorrectly",
  "shopify-label-sideways-thermal-printer",
  "shopify-4x6-on-desktop-printer",
  "shopify-label-size-vs-printer-size",
  "shopify-label-cut-off-parts-usps",
  "shipping-label-too-small-usps-ups-fedex-accept",
  "label-wrong-paper-size-4x6-vs-letter-a4",
  "shipping-label-keeps-getting-cropped",
  "can-you-trim-fold-tape-shipping-label",
  "shipping-label-preflight-checklist",
  "mercari-shipping-label-4x6-vs-8x11",
  "mercari-label-prints-too-small",
  "pirate-ship-4x6-label-prints-on-letter-paper",
  "pirate-ship-label-too-small-thermal-printer",
  "shipstation-label-too-small-or-too-large",
  "rollo-printer-label-too-small",
  "zebra-printer-4x6-label-cut-off-or-shrunk",
  "dymo-4xl-label-prints-too-small",
  "print-4x6-shipping-label-on-regular-printer",
  "convert-letter-shipping-label-to-4x6-thermal",
  "vinted-shipping-label-4x6-thermal-printer",
  "vinted-label-prints-too-small",
  "depop-shipping-label-too-small",
  "depop-label-4x6-thermal-printer",
  "poshmark-shipping-label-4x6-thermal-printer",
  "poshmark-label-prints-across-two-labels",
  "tiktok-shop-shipping-label-too-small",
  "royal-mail-label-prints-too-small",
  "return-shipping-label-prints-too-small",
  "shipping-label-qr-code-too-small",
  "etsy-shipping-label-prints-too-small",
  "etsy-4x6-label-on-regular-printer",
  "etsy-shipping-label-print-settings",
  "usps-click-n-ship-label-prints-too-small",
  "ups-thermal-label-cut-off",
  "fedex-shipping-label-prints-sideways",
  "canada-post-4x6-thermal-label",
  "australia-post-label-prints-too-small",
  "royal-mail-a4-label-to-4x6-thermal",
  "brother-ql-shipping-label-too-small",
  "munbyn-thermal-label-too-small",
  "mac-preview-shipping-label-too-small",
  "chrome-shipping-label-printing-too-small",
  "shipping-label-pdf-wrong-page-size",
  "thermal-printer-feeds-extra-blank-labels",
  "thermal-printer-calibration-shipping-label",
];

const seoRouteSlugs: Record<SeoRouteId, Partial<Record<Locale, string>>> = Object.fromEntries(
  seoRouteIds.map((id) => [id, slug(id)]),
);

function slug(value: string): Partial<Record<Locale, string>> {
  const translated = (translatedSeoRouteIds as readonly string[]).includes(value);
  const targetLocales = translated ? [defaultLocale, ...translatedSeoLocales] : [defaultLocale];
  return Object.fromEntries(targetLocales.map((locale) => [locale, value]));
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

  const targetSlug = seoRouteSlugs[id][locale];
  if (!targetSlug) return null;
  return locale === defaultLocale ? `/${targetSlug}` : `/${locale}/${targetSlug}`;
}

export function availableSeoRouteLocales(path: string) {
  const id = seoRouteIdFromPath(path);
  if (!id) return [];
  return locales.filter((locale) => Boolean(seoRouteSlugs[id][locale]));
}

export function allSeoRoutePaths() {
  return Object.values(seoRouteSlugs).flatMap((slugs) => Object.values(slugs).map((value) => `/${value}`));
}
