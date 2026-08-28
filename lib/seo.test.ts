import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getLocalizedSeoPage, getSeoPage, seoPages } from "@/data/seo-pages";
import { locales } from "@/i18n/routing";
import { localeFromRequestPath, localeRedirectPath } from "@/proxy";
import { alternateLanguages, availableLocalesForPath, hasLocalizedPath } from "./i18n";
import { articleSchema, normalizeSeoDescription, normalizeSeoTitle, pageMetadata, siteUrl } from "./seo";

describe("SEO metadata contracts", () => {
  it("normalizes repeated brands without truncating search intent", () => {
    expect(normalizeSeoTitle("Test Print Center | Shipping Label Helper")).toBe("Test Print Center | LabelHelper");
    expect(normalizeSeoTitle("Shipping Label Is Cut Off — How to Fix Shipping Label Prints")).toBe("Shipping Label Is Cut Off | LabelHelper");
    expect(normalizeSeoTitle("Will USPS, UPS or FedEx Accept a Small Shipping Label?")).toBe("Will USPS, UPS or FedEx Accept a Small Shipping Label?");
  });

  it("prefers a complete sentence when a description guard is needed", () => {
    const description = "Check the PDF page size before changing printer settings. This deliberately long follow-up explains several secondary print cases, paper choices, margins and barcode risks that do not need to appear in the search snippet.";
    expect(normalizeSeoDescription(description)).toBe("Check the PDF page size before changing printer settings.");
  });

  it("adds a shared social image to Open Graph and Twitter metadata", () => {
    const metadata = pageMetadata({ title: "Shipping Label Test", description: "Check label size and print settings before using paid postage.", path: "/test-print" });
    expect(metadata.openGraph?.images).toBeTruthy();
    expect(metadata.twitter?.images).toBeTruthy();
  });

  it("keeps high-risk shipping guidance tied to claim-level first-party sources", () => {
    const slugs = [
      "shipping-label-too-small-usps-ups-fedex-accept",
      "can-you-trim-fold-tape-shipping-label",
      "shipping-label-preflight-checklist",
      "mercari-shipping-label-4x6-vs-8x11",
      "mercari-label-prints-too-small",
      "shipstation-label-too-small-or-too-large",
      "dymo-4xl-label-prints-too-small",
      "pirate-ship-4x6-label-prints-on-letter-paper",
      "pirate-ship-label-too-small-thermal-printer",
      "ebay-4x6-label-sideways-thermal-printer",
      "ebay-shipping-label-cut-off-left-side",
      "ebay-shipping-label-trimmed-or-taped",
      "shopify-label-sideways-thermal-printer",
      "shopify-4x6-on-desktop-printer",
      "shopify-label-cut-off-parts-usps",
    ];

    for (const slug of slugs) {
      const page = getSeoPage(slug);
      expect(page?.sources?.length).toBeGreaterThanOrEqual(1);
      expect(page?.sources?.every((source) => source.url.startsWith("https://") && source.checkedAt === "2026-08-29")).toBe(true);
      expect(page?.quickAnswer.toLowerCase()).not.toContain("will be accepted");
    }

    expect(getSeoPage(slugs[0])?.sources?.length).toBeGreaterThanOrEqual(2);

    const citations = getSeoPage(slugs[0])?.sources?.map((source) => source.url) ?? [];
    const schema = articleSchema({ title: "Carrier acceptance", description: "Evidence-sensitive guidance.", path: `/${slugs[0]}`, citations });
    expect(schema.citation).toEqual(citations);
  });

  it("derives the request locale that the root html lang depends on", () => {
    expect(localeFromRequestPath("/")).toBe("en");
    expect(localeFromRequestPath("/etsy-shipping-label-size")).toBe("en");
    expect(localeFromRequestPath("/zh/etsy-shipping-label-size")).toBe("zh");
    expect(localeFromRequestPath("/es/tools/scale-calculator")).toBe("es");
  });

  it("consolidates default-locale and untranslated locale URLs", () => {
    expect(localeRedirectPath("/en/guides")).toBe("/guides");
    expect(localeRedirectPath("/fr/guides")).toBe("/guides");
    expect(localeRedirectPath("/es/guides")).toBeNull();
    expect(localeRedirectPath("/zh/tools/pdf-analyzer")).toBeNull();
    expect(localeRedirectPath("/es/tools/pdf-analyzer")).toBe("/tools/pdf-analyzer");
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
    const rules = robots().rules;
    const disallow = (Array.isArray(rules) ? rules[0] : rules)?.disallow;

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
    expect(entries.some((entry) => entry.url === `${siteUrl}/fr/guides`)).toBe(false);
    expect(entries.some((entry) => entry.url === `${siteUrl}/es/tools/pdf-analyzer`)).toBe(false);
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

  it("keeps cross-platform print tasks on distinct decision paths", () => {
    const slugs = [
      "label-wrong-paper-size-4x6-vs-letter-a4",
      "shipping-label-keeps-getting-cropped",
      "print-4x6-shipping-label-on-regular-printer",
      "convert-letter-shipping-label-to-4x6-thermal",
    ];
    const firstHeadings = slugs.map((slug) => getSeoPage(slug)?.sections[0]?.heading);

    expect(firstHeadings.every(Boolean)).toBe(true);
    expect(new Set(firstHeadings).size).toBe(slugs.length);
  });

  it("keeps 4x6, A4 and Letter template workflows distinct in every published locale", () => {
    const slugs = ["4x6-shipping-label-template", "a4-shipping-label-template", "letter-shipping-label-template"];
    const localizedSets = [
      { locale: "en", pages: slugs.map((slug) => getSeoPage(slug)), dimensions: ["4 × 6", "210 × 297", "8.5 × 11"] },
      { locale: "es", pages: slugs.map((slug) => getLocalizedSeoPage(slug, "es")), dimensions: ["4 × 6", "210 × 297", "8,5 × 11"] },
      { locale: "zh", pages: slugs.map((slug) => getLocalizedSeoPage(slug, "zh")), dimensions: ["4 × 6", "210 × 297", "8.5 × 11"] },
    ];

    for (const localized of localizedSets) {
      expect(localized.pages.every(Boolean)).toBe(true);
      for (const [index, page] of localized.pages.entries()) {
        expect(page?.updatedAt).toBe("2026-08-29");
        expect(page?.evidenceNote?.length).toBeGreaterThan(40);
        expect(page?.quickAnswer).toContain(localized.dimensions[index]);
        expect(page?.sections).toHaveLength(4);
        expect(page?.faq).toHaveLength(5);
        expect(page?.reviewChecklist).toHaveLength(3);
      }

      const headingFingerprints = localized.pages.map((page) => page?.sections.map((section) => section.heading).join(" | "));
      expect(new Set(headingFingerprints).size).toBe(slugs.length);
    }
  });

  it("keeps the nine reviewed long-tail pages evidence-scoped and independently actionable", () => {
    const symptomSlugs = [
      "shipping-label-printing-too-small",
      "shipping-label-cut-off-when-printing",
      "shipping-label-barcode-not-scanning",
      "shipping-label-not-centered",
      "fit-to-page-vs-actual-size-shipping-label",
    ];
    const amazonSlugs = [
      "amazon-shipping-label-too-small-blurry",
      "amazon-4x6-label-on-a4-or-letter",
      "amazon-fba-label-wrong-paper-size",
      "amazon-a4-label-to-4x6-thermal",
    ];
    const pages = [...symptomSlugs, ...amazonSlugs].map((slug) => getSeoPage(slug));

    expect(pages.every(Boolean)).toBe(true);
    for (const page of pages) {
      expect(page?.updatedAt).toBe("2026-08-29");
      expect(page?.evidenceNote?.length).toBeGreaterThan(80);
      expect(page?.sources?.length).toBeGreaterThanOrEqual(2);
      expect(page?.sources?.every((source) => source.url.startsWith("https://") && source.checkedAt === "2026-08-29")).toBe(true);
      expect(page?.decisionTree?.steps).toHaveLength(3);

      const actionableCopy = [
        page?.quickAnswer,
        ...(page?.sections.map((section) => `${section.heading} ${section.body}`) ?? []),
        ...(page?.reviewChecklist ?? []),
      ].join(" ");
      expect(actionableCopy).toMatch(/\b(stop|do not|don't)\b/i);
      expect(actionableCopy).toMatch(/\b(reprint|regenerate)\b/i);
    }

    for (const slug of symptomSlugs) {
      expect(getSeoPage(slug)?.evidenceNote).toContain("General troubleshooting framework");
    }
    for (const slug of amazonSlugs) {
      expect(getSeoPage(slug)?.evidenceNote).toContain("Amazon workflow evidence");
    }

    const sectionFingerprints = pages.map((page) => page?.sections.map((section) => section.heading).join(" | "));
    const treeFingerprints = pages.map((page) => page?.decisionTree?.steps.map((step) => step.title).join(" | "));
    expect(new Set(sectionFingerprints).size).toBe(pages.length);
    expect(new Set(treeFingerprints).size).toBe(pages.length);

    const localizedContracts = [
      { locale: "es" as const, evidencePrefix: "Marco general de diagnóstico", stopPattern: /\b(detente|no uses|no reduzcas|no amplíes)\b/i, reprintPattern: /\b(reimprime|reimprimir|regenera|regenerar)\b/i },
      { locale: "zh" as const, evidencePrefix: "通用排错框架", stopPattern: /(停止|不要)/, reprintPattern: /(重打|重新生成)/ },
    ];

    for (const contract of localizedContracts) {
      const localizedPages = symptomSlugs.map((slug) => getLocalizedSeoPage(slug, contract.locale));
      expect(localizedPages.every(Boolean)).toBe(true);

      for (const [index, page] of localizedPages.entries()) {
        expect(page?.updatedAt).toBe("2026-08-29");
        expect(page?.evidenceNote).toContain(contract.evidencePrefix);
        expect(page?.sources?.map((source) => source.url)).toEqual(pages[index]?.sources?.map((source) => source.url));
        expect(page?.sources?.every((source) => source.checkedAt === "2026-08-29")).toBe(true);
        expect(page?.decisionTree?.steps).toHaveLength(3);
        expect(page?.sections).toHaveLength(4);
        expect(page?.faq).toHaveLength(5);

        const actionableCopy = [
          page?.quickAnswer,
          page?.decisionTree?.firstAction,
          ...(page?.decisionTree?.steps.map((step) => `${step.symptom} ${step.action}`) ?? []),
          ...(page?.sections.map((section) => `${section.heading} ${section.body}`) ?? []),
          ...(page?.reviewChecklist ?? []),
        ].join(" ");
        expect(actionableCopy).toMatch(contract.stopPattern);
        expect(actionableCopy).toMatch(contract.reprintPattern);
      }

      const localizedSectionFingerprints = localizedPages.map((page) => page?.sections.map((section) => section.heading).join(" | "));
      const localizedTreeFingerprints = localizedPages.map((page) => page?.decisionTree?.steps.map((step) => step.title).join(" | "));
      expect(new Set(localizedSectionFingerprints).size).toBe(symptomSlugs.length);
      expect(new Set(localizedTreeFingerprints).size).toBe(symptomSlugs.length);
    }

    const fbaWrongPaperCopy = JSON.stringify(getSeoPage("amazon-fba-label-wrong-paper-size"));
    expect(fbaWrongPaperCopy).toMatch(/box ID/i);
    expect(fbaWrongPaperCopy).toMatch(/carrier label/i);
    expect(fbaWrongPaperCopy).toMatch(/product barcode/i);

    const amazonA4Copy = JSON.stringify(getSeoPage("amazon-a4-label-to-4x6-thermal"));
    expect(amazonA4Copy).toMatch(/AWD/);
    expect(amazonA4Copy).toMatch(/SSCC/);
    expect(amazonA4Copy).toMatch(/do not (convert|rescale|crop)/i);
  });
});
