import {defineRouting} from "next-intl/routing";

export const locales = ["en", "es", "fr", "de", "ja", "zh"] as const;
export const defaultLocale = "en" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof locales)[number];
