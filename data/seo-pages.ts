import { defaultLocale, locales, registerLocalizedPaths, type Locale } from "@/lib/i18n";
import type { Carrier, Platform } from "./rules";
import type { FAQItem } from "@/components/FAQ";
import type { RelatedLink } from "@/components/RelatedLinks";
import { seoPagesEs } from "./seo-pages.es";
import { seoPagesZh } from "./seo-pages.zh";
import { allSeoRoutePaths } from "@/lib/seo-route-map";

export type SeoPageKind = "platform" | "carrier" | "template" | "troubleshooter";

export interface TroubleshooterStep {
  title: string;
  symptom: string;
  action: string;
  href: string;
  cta: string;
}

export interface SeoPage {
  slug: string;
  kind: SeoPageKind;
  title: string;
  description: string;
  h1: string;
  quickAnswer: string;
  defaultCombo?: {
    platform: Platform;
    carrier: Carrier;
  };
  decisionTree?: {
    headline: string;
    intro: string;
    firstAction: string;
    steps: TroubleshooterStep[];
  };
  sections: Array<{ heading: string; body: string }>;
  faq: FAQItem[];
  related: RelatedLink[];
}

const commonRelated: RelatedLink[] = [
  { href: "/#checker", title: "Shipping Label Size Checker", description: "Check paper, scale and orientation before printing." },
  { href: "/4x6-shipping-label-template", title: "4×6 Label Template", description: "Download a blank 4×6 shipping label template." },
  { href: "/shipping-label-printing-too-small", title: "Label Printing Too Small", description: "Fix tiny labels, scaling problems and bad print settings." },
];

function platformPage(slug: string, name: string, platform: Platform, carrier: Carrier = "usps"): SeoPage {
  return {
    slug,
    kind: "platform",
    title: `${name} Shipping Label Size — 2026 Guide`,
    description: `Find the right ${name} shipping label size, print scale, paper and printer setup for 4×6, Letter and A4 labels.`,
    h1: `${name} Shipping Label Size`,
    quickAnswer: `${name} sellers usually get the safest result with a 4 × 6 inch label printed at 100% scale on a thermal label printer. Letter and A4 can work for sheet printing if scaling is disabled and the barcode quiet zone is not cropped.`,
    defaultCombo: { platform, carrier },
    sections: [
      { heading: `What size is a ${name} shipping label?`, body: `For most ${name} sellers, the practical target is a 4 × 6 inch shipping label because it matches common thermal printers and carrier scan workflows. If you use a laser or inkjet printer, print the downloaded label PDF on Letter or A4 paper at 100% / Actual Size, then cut or fold only outside the barcode and address area.` },
      { heading: `Best print settings for ${name}`, body: `Start with 100% scale, portrait orientation and the paper size that matches the PDF or label roll. Avoid browser headers, footers, Fit to Page, Shrink Oversized Pages and driver defaults that silently resize PDFs. If the preview looks centered but the paper output is off, run a blank template first to separate printer alignment from label-file problems.` },
      { heading: `Common ${name} printing problems`, body: `Tiny labels usually mean the print dialog shrank the PDF. Cut-off labels usually mean the paper size, roll width or orientation is wrong. Blurry or unscannable barcodes usually come from low print density, tape glare, poor thermal paper or missing quiet-zone whitespace. Use the checker above before buying postage in volume.` },
      { heading: "What to verify before shipping", body: "Confirm the carrier name, tracking barcode, recipient address and return address are readable. Measure the printed 4 × 6 boundary with a ruler if this is a new printer, new label roll or a new computer. Reprint the same label PDF after fixing settings rather than buying duplicate postage when your platform allows reprints." },
    ],
    faq: [
      { question: `What is the best ${name} label size?`, answer: "A 4 × 6 inch label is the safest default for thermal printers and most carrier workflows." },
      { question: "Should I use Fit to Page?", answer: "No. Start with 100% or Actual Size so the barcode is not shrunk." },
      { question: "Can I use a regular printer?", answer: "Yes. Use Letter or A4 paper and confirm the printed barcode remains clear and uncut." },
      { question: `Why does my ${name} label print too small?`, answer: "The usual cause is browser or PDF scaling. Disable Fit to Page, choose Actual Size and match the paper size before reprinting." },
      { question: "Do I need to buy postage again after a bad print?", answer: "Usually no. Fix the print settings first, then reprint the original PDF if your platform or carrier account still allows it." },
    ],
    related: commonRelated,
  };
}

function carrierPage(slug: string, name: string, carrier: Carrier): SeoPage {
  return {
    slug,
    kind: "carrier",
    title: `${name} Shipping Label Size — Complete Guide`,
    description: `Check recommended ${name} shipping label size, scale and paper setup for thermal, inkjet and laser printers.`,
    h1: `${name} Shipping Label Size`,
    quickAnswer: `${name} labels are usually safest as 4 × 6 inch thermal labels printed at 100% scale. Sheet printing can work when the barcode is not resized or cropped and the label remains flat on the package.`,
    defaultCombo: { platform: carrier === "usps" ? "usps_direct" : carrier === "ups" ? "ups_direct" : carrier === "fedex" ? "fedex_direct" : "dhl_direct", carrier },
    sections: [
      { heading: `What size is a ${name} label?`, body: `Use 4 × 6 inches for thermal printers unless your ${name} workflow explicitly gives a different format. For sheet printers, print at 100% scale on Letter or A4 and keep the barcode quiet zone intact. Do not crop the barcode or fold it around a package edge.` },
      { heading: "Thermal vs sheet printing", body: "Thermal printers are faster and reduce scaling mistakes because the roll size usually matches the label. Inkjet and laser printers work best when you download the carrier PDF, open it in a PDF viewer and disable shrink-to-fit options before printing." },
      { heading: "Troubleshooting scan problems", body: "If the label is cut off, too small, not centered or not scanning, first confirm the print scale and paper size match the generated label. Then inspect print density, paper quality, tape glare and whether any barcode quiet-zone whitespace was cut away." },
      { heading: "Carrier acceptance checks", body: `Before dropping off a ${name} package, verify the tracking barcode is sharp, the service text is readable and the label is attached flat. If you changed printer, browser, PDF viewer or label stock, print a blank test sheet before printing production labels.` },
    ],
    faq: [
      { question: `Can ${name} labels be printed on 4×6?`, answer: "Yes, 4×6 is the common format for thermal shipping labels." },
      { question: "Why is my barcode not scanning?", answer: "The barcode may be shrunk, blurred, cut off or missing quiet-zone whitespace." },
      { question: "Is browser printing safe?", answer: "Downloading the carrier PDF and printing at Actual Size is usually safer than printing from a browser preview." },
      { question: `Can I tape over a ${name} barcode?`, answer: "Avoid glossy tape over the barcode because glare can make scanning less reliable. If you must use tape, keep it flat and wrinkle-free." },
      { question: "What should I check after changing printers?", answer: "Run a 100% scale test print, measure the output and confirm the barcode area is not clipped before printing live postage." },
    ],
    related: commonRelated,
  };
}

function templatePage(slug: string, label: string): SeoPage {
  return {
    slug,
    kind: "template",
    title: `${label} Shipping Label Template Download`,
    description: `Download a blank ${label} shipping label template and check print scale before printing carrier labels.`,
    h1: `${label} Shipping Label Template`,
    quickAnswer: `Download the ${label} blank template, print it at 100% scale, and confirm the edges and barcode area line up before printing real postage. The template is for calibration only and does not create postage.`,
    sections: [
      { heading: `When to use a ${label} template`, body: "Use a blank template to confirm your printer driver, paper, margins and orientation before printing an actual shipping label. It is especially useful after installing a new printer, changing browsers, switching PDF viewers or loading a new label roll." },
      { heading: "Print settings", body: "Use 100% / Actual Size. Disable Fit to Page, Shrink Oversized Pages and browser headers or footers. Match the paper size in the print dialog to the template size, then check that the border prints at the expected physical size." },
      { heading: "After printing", body: "Measure the output with a ruler. If it is smaller or larger than expected, use the scale calculator before printing real labels. If the border is clipped, check orientation, margins and whether the printer supports borderless output for that paper size." },
      { heading: "How this differs from postage", body: "This template is a blank test file. It does not include a carrier barcode, tracking number, recipient address or postage payment. Use it to validate hardware and print settings, then print the real label from your platform or carrier account." },
    ],
    faq: [
      { question: "Is this a postage label?", answer: "No. It is a blank test template for checking printer scale and alignment." },
      { question: "Can I use it with a thermal printer?", answer: "Yes for 4×6. A4 and Letter templates are intended for sheet printers." },
      { question: "Should I print at 100%?", answer: "Yes. Start with 100% / Actual Size for calibration." },
      { question: "What if the printed template is slightly smaller?", answer: "Use the scale calculator to estimate a corrected print percentage, then rerun the template before printing postage." },
      { question: "Why are the template edges clipped?", answer: "The paper size, orientation, driver margins or printable area probably do not match the template. Check those settings before blaming the label file." },
    ],
    related: commonRelated,
  };
}

function troubleshootingTree(slug: string): SeoPage["decisionTree"] {
  const shared = {
    headline: "Find the cause before reprinting",
    intro: "Follow the symptom that best matches your bad print. Each step points to the safest next tool before you buy postage again.",
    firstAction: "Print one test at 100% / Actual Size first.",
  };
  const trees: Record<string, TroubleshooterStep[]> = {
    "shipping-label-printing-too-small": [
      { title: "Whole label is smaller", symptom: "The 4×6 boundary measures around 3.7×5.6 or the barcode looks compressed.", action: "Disable Fit to Page, choose Actual Size, then calculate the correction if the ruler measurement is still off.", href: "/tools/scale-calculator", cta: "Calculate corrected scale" },
      { title: "Printed from browser preview", symptom: "The browser added margins or shrank the PDF to fit the sheet.", action: "Download the label PDF and print from a PDF viewer at 100% before changing marketplace settings.", href: "/tools/pdf-analyzer", cta: "Check PDF page size" },
      { title: "New printer or roll", symptom: "Every label from this printer is slightly small.", action: "Run a calibration sheet so you know whether the printer driver or the label file is causing the shrink.", href: "/tools/calibration-sheet", cta: "Print calibration sheet" },
    ],
    "shipping-label-cut-off-when-printing": [
      { title: "One edge is missing", symptom: "Address or barcode is clipped on the left, right, top or bottom.", action: "Match the paper size and orientation to the PDF before scaling anything.", href: "/#checker", cta: "Check paper setup" },
      { title: "Thermal roll drifts", symptom: "The first label is close, then later labels move sideways or upward.", action: "Use a blank template to isolate roll alignment and printable-area problems.", href: "/4x6-shipping-label-template", cta: "Download 4×6 template" },
      { title: "Sheet printer crops", symptom: "Letter or A4 output cuts the label near the unprintable margin.", action: "Run a calibration page and confirm the printer margins before using real postage.", href: "/tools/calibration-sheet", cta: "Print calibration sheet" },
    ],
    "shipping-label-barcode-not-scanning": [
      { title: "Barcode is too small", symptom: "The full label is scaled down or the bars are visibly compressed.", action: "Fix print scale first; barcode checks are unreliable if the whole label is the wrong size.", href: "/tools/scale-calculator", cta: "Fix print scale" },
      { title: "Whitespace was cropped", symptom: "The barcode touches text, a label edge, tape, or package folds.", action: "Use the image checker to estimate quiet-zone whitespace around the barcode.", href: "/tools/barcode-quiet-zone-checker", cta: "Check quiet zone" },
      { title: "Print looks gray or shiny", symptom: "The barcode is faded, streaky, wrinkled or covered with glossy tape.", action: "Reprint one test after increasing density or changing paper/tape placement.", href: "/tools/test-print-pack", cta: "Download test print pack" },
    ],
    "shipping-label-not-centered": [
      { title: "Consistent offset", symptom: "Every label starts too far left, right, high or low.", action: "Print a calibration sheet to separate driver offset from marketplace label layout.", href: "/tools/calibration-sheet", cta: "Print calibration sheet" },
      { title: "Wrong media size", symptom: "The preview is centered but the physical output is shifted or rotated.", action: "Check platform, carrier, paper and printer combination before editing margins.", href: "/#checker", cta: "Check label setup" },
      { title: "Template also off-center", symptom: "A blank 4×6 test has the same alignment problem.", action: "Fix printer guides, roll loading or driver offsets before reprinting postage.", href: "/4x6-shipping-label-template", cta: "Download 4×6 template" },
    ],
    "fit-to-page-vs-actual-size-shipping-label": [
      { title: "Choosing the print scale", symptom: "Fit to Page looks safer in preview but changes the barcode size.", action: "Use Actual Size first, then measure the output rather than trusting the screen preview.", href: "/tools/scale-calculator", cta: "Measure and calculate" },
      { title: "Unsure what the PDF size is", symptom: "The label file may be Letter, A4 or 4×6 and the print dialog is guessing.", action: "Read the PDF page box locally before choosing paper or scale settings.", href: "/tools/pdf-analyzer", cta: "Analyze PDF size" },
      { title: "Need a safe test", symptom: "You are about to print paid postage with a new setup.", action: "Print a watermarked test pack first so real labels are not wasted.", href: "/tools/test-print-pack", cta: "Download test pack" },
    ],
  };

  return { ...shared, steps: trees[slug] ?? trees["shipping-label-printing-too-small"] };
}

function troublePage(slug: string, symptom: string, fix: string): SeoPage {
  const tree = troubleshootingTree(slug);

  return {
    slug,
    kind: "troubleshooter",
    title: `${symptom} — How to Fix Shipping Label Prints`,
    description: `Fix shipping label printing problems: ${symptom.toLowerCase()}. Check scale, paper, margins, orientation and barcode quiet zones.`,
    h1: `${symptom} — How to Fix It`,
    quickAnswer: fix,
    decisionTree: tree,
    sections: [
      { heading: "Step 1: Check print scale", body: "Open the print dialog and choose 100% or Actual Size. Avoid Fit to Page because it can shrink the barcode and label boundaries. If you printed from a browser preview, download the PDF and retry from a PDF viewer." },
      { heading: "Step 2: Check paper and orientation", body: "Confirm the paper in your printer matches the label PDF. A 4×6 roll should not be printed as Letter, and Letter sheets should not crop the label area. If the output is rotated, switch portrait/landscape before changing scale." },
      { heading: "Step 3: Run a calibration print", body: "Print a blank template before buying new labels or reprinting postage. If the template is wrong, the carrier label will also be wrong. Measure the printed border and compare it to the target size." },
      { heading: "Step 4: Decide what to fix next", body: "If the whole label is the wrong size, fix scale. If only one edge is missing, fix paper size, margins or roll alignment. If the size is correct but scans fail, inspect print density, barcode quiet zone, tape glare and label damage." },
    ],
    faq: [
      { question: "Should I re-buy postage?", answer: "Usually no. First fix the print settings and reprint the original PDF if your platform allows it." },
      { question: "Why does Actual Size matter?", answer: "Barcode scanners expect the bars and quiet zone to remain within tolerance. Shrinking can make scans fail." },
      { question: "Can tape cause scanning problems?", answer: "Yes. Glossy tape over a barcode can reflect light and reduce scan reliability." },
      { question: "What should I try first if I am in a hurry?", answer: "Download the label PDF, print from a PDF viewer at 100% / Actual Size and make sure the selected paper size matches the paper in the printer." },
      { question: "How do I know whether the printer or the label file is the problem?", answer: "Print a blank template at 100%. If the template is also wrong, fix printer settings before changing the label file or buying new postage." },
    ],
    related: commonRelated,
  };
}

export const seoPages: SeoPage[] = [
  platformPage("etsy-shipping-label-size", "Etsy", "etsy"),
  platformPage("shopify-shipping-label-size", "Shopify", "shopify"),
  platformPage("ebay-shipping-label-size", "eBay", "ebay"),
  platformPage("amazon-fba-label-size", "Amazon FBA", "amazon_fba", "ups"),
  carrierPage("usps-shipping-label-size", "USPS", "usps"),
  carrierPage("ups-label-size", "UPS", "ups"),
  carrierPage("fedex-label-size", "FedEx", "fedex"),
  carrierPage("dhl-shipping-label-size", "DHL", "dhl"),
  templatePage("4x6-shipping-label-template", "4×6"),
  templatePage("a4-shipping-label-template", "A4"),
  templatePage("letter-shipping-label-template", "Letter"),
  troublePage("shipping-label-printing-too-small", "My Shipping Label is Printing Too Small", "Most tiny labels are caused by Fit to Page, wrong paper size or browser margin settings. Reprint at 100% / Actual Size, then measure a blank template if the problem continues."),
  troublePage("shipping-label-cut-off-when-printing", "My Shipping Label is Cut Off When Printing", "Cut-off labels usually mean the paper size, margins or orientation do not match the label PDF. Fix those before changing postage or buying a new label roll."),
  troublePage("shipping-label-barcode-not-scanning", "My Shipping Label Barcode is Not Scanning", "Barcode scan failures usually come from shrinking, blur, tape glare or missing quiet-zone whitespace. Confirm scale first, then inspect print quality and label placement."),
  troublePage("shipping-label-not-centered", "My Shipping Label is Not Centered", "Off-center labels are usually caused by printer driver offsets, roll alignment or page margin settings. Run a blank template to separate alignment problems from label-file problems."),
  troublePage("fit-to-page-vs-actual-size-shipping-label", "Fit to Page vs Actual Size for Shipping Labels", "Use Actual Size or 100% first. Fit to Page can shrink labels and make barcodes unreliable, even when the preview looks cleaner on the screen."),
];

const localizedSeoPages: Partial<Record<Locale, SeoPage[]>> = {
  es: seoPagesEs,
  zh: seoPagesZh,
};

for (const [locale, pages] of Object.entries(localizedSeoPages) as [Locale, SeoPage[]][]) {
  registerLocalizedPaths(pages.map((page) => `/${page.slug}`), [locale]);
}
registerLocalizedPaths(allSeoRoutePaths(), locales);

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function hasTranslatedSeoPages(locale: Locale) {
  return locale in localizedSeoPages;
}

export function getSeoPages(locale: Locale = defaultLocale): SeoPage[] {
  return localizedSeoPages[locale] ?? seoPages;
}

export function getImplementedSeoLocales() {
  return locales.filter(hasTranslatedSeoPages);
}

export function getLocalizedSeoPage(slug: string, locale: Locale = defaultLocale) {
  return getSeoPages(locale).find((page) => page.slug === slug);
}
