import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getSeoPage, seoPages } from "@/data/seo-pages";
import { locales } from "@/i18n/routing";
import { localeFromRequestPath } from "@/proxy";
import { alternateLanguages, availableLocalesForPath, hasLocalizedPath } from "./i18n";
import { pageMetadata, siteUrl } from "./seo";

describe("SEO metadata contracts", () => {
  it("derives the request locale that the root html lang depends on", () => {
    expect(localeFromRequestPath("/")).toBe("en");
    expect(localeFromRequestPath("/etsy-shipping-label-size")).toBe("en");
    expect(localeFromRequestPath("/zh/etsy-shipping-label-size")).toBe("zh");
    expect(localeFromRequestPath("/es/tools/scale-calculator")).toBe("es");
  });

  it("advertises only implemented hreflang variants for localized SEO pages", () => {
    expect(alternateLanguages("/etsy-shipping-label-size")).toEqual({
      "x-default": "/etsy-shipping-label-size",
      en: "/etsy-shipping-label-size",
      es: "/es/etsy-shipping-label-size",
      zh: "/zh/etsy-shipping-label-size",
    });

    expect(availableLocalesForPath("/etsy-shipping-label-size")).toEqual(["en", "es", "zh"]);
    expect(hasLocalizedPath("/etsy-shipping-label-size", "fr")).toBe(false);
    expect(alternateLanguages("/rollo-printer-label-too-small")).toEqual({
      "x-default": "/rollo-printer-label-too-small",
      en: "/rollo-printer-label-too-small",
    });
  });

  it("keeps localized utility pages out of the index", () => {
    const metadata = pageMetadata({
      title: "Unlock Pro Tools",
      description: "Enter a Shipping Label Helper license key.",
      path: "/unlock",
      locale: "zh",
      robots: { index: false, follow: false },
    });

    expect(metadata.alternates?.canonical).toBe("/zh/unlock");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("disallows payment and utility routes in every routable locale", () => {
    const disallow = robots().rules[0]?.disallow;

    expect(disallow).toEqual(expect.arrayContaining(["/api/", "/template-downloads/", "/thanks", "/unlock"]));
    for (const locale of locales) {
      expect(disallow).toEqual(expect.arrayContaining([`/${locale}/thanks`, `/${locale}/unlock`]));
    }
  });

  it("keeps sitemap entries aligned with implemented alternates", () => {
    const entries = sitemap();
    const etsyEntry = entries.find((entry) => entry.url === `${siteUrl}/etsy-shipping-label-size`);
    const rolloEntry = entries.find((entry) => entry.url === `${siteUrl}/rollo-printer-label-too-small`);

    expect(etsyEntry?.alternates?.languages).toEqual({
      "x-default": `${siteUrl}/etsy-shipping-label-size`,
      en: `${siteUrl}/etsy-shipping-label-size`,
      es: `${siteUrl}/es/etsy-shipping-label-size`,
      zh: `${siteUrl}/zh/etsy-shipping-label-size`,
    });
    expect(rolloEntry?.alternates?.languages).toEqual({
      "x-default": `${siteUrl}/rollo-printer-label-too-small`,
      en: `${siteUrl}/rollo-printer-label-too-small`,
    });
    expect(entries.some((entry) => entry.url === `${siteUrl}/fr/rollo-printer-label-too-small`)).toBe(false);
  });

  it("keeps print-dialog long-tail pages connected to the right cluster", () => {
    const chromePage = getSeoPage("chrome-shipping-label-printing-too-small");
    const macPreviewPage = getSeoPage("mac-preview-shipping-label-too-small");
    const pdfPage = getSeoPage("shipping-label-pdf-wrong-page-size");

    expect(chromePage?.faq.some((item) => item.question.includes("Chrome"))).toBe(true);
    expect(macPreviewPage?.faq.some((item) => item.question.includes("Mac Preview"))).toBe(true);
    expect(pdfPage?.faq.some((item) => item.question.includes("PDF"))).toBe(true);

    expect(chromePage?.related.map((link) => link.href)).toEqual(
      expect.arrayContaining(["/shipping-label-pdf-wrong-page-size", "/mac-preview-shipping-label-too-small"]),
    );
    expect(macPreviewPage?.related.map((link) => link.href)).toEqual(
      expect.arrayContaining(["/shipping-label-pdf-wrong-page-size", "/chrome-shipping-label-printing-too-small"]),
    );
    expect(seoPages.every((page) => page.related.every((link) => link.href !== `/${page.slug}`))).toBe(true);
  });
});
