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

const calibrationRelated: RelatedLink[] = [
  { href: "/tools/calibration-sheet", title: "Calibration Sheet", description: "Print a blank scale and alignment sheet before using paid postage." },
  { href: "/tools/scale-calculator", title: "Scale Calculator", description: "Calculate the corrected print percentage from a measured bad label." },
  { href: "/shipping-label-not-centered", title: "Label Not Centered", description: "Separate printer offset, roll alignment and page margin problems." },
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

function specificTroublePage(
  slug: string,
  symptom: string,
  fix: string,
  sections: SeoPage["sections"],
  faq: SeoPage["faq"] = [],
): SeoPage {
  const base = troublePage(slug, symptom, fix);

  return {
    ...base,
    description: `Fix ${symptom.toLowerCase()} without shrinking, cropping or blurring the barcode. Check paper size, scale, orientation and printer setup before shipping.`,
    sections,
    faq: faq.length ? faq : base.faq,
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
  troublePage("ebay-shipping-label-prints-too-small", "eBay Shipping Label Prints Too Small", "Most eBay tiny labels are caused by browser scaling or Fit to Page. Download the label PDF, print from a PDF viewer at 100% / Actual Size, then measure a blank template if it still prints small."),
  troublePage("ebay-4x6-label-sideways-thermal-printer", "eBay 4×6 Label Prints Sideways or Tiny on Thermal Printer", "A sideways or tiny 4×6 eBay label means the printer driver paper size or orientation does not match the label file. Set the driver to 4×6, disable auto-rotate, choose Actual Size and test one label before bulk printing."),
  troublePage("ebay-shipping-label-cut-off-left-side", "eBay Shipping Label Cuts Off the Left Side", "A consistently clipped left edge usually means the paper size or printable area does not match the label PDF. Print from a PDF viewer, set paper size manually and disable any border corrections."),
  {
    slug: "ebay-shipping-label-size-4x6-vs-letter",
    kind: "platform",
    title: "eBay Shipping Label Size: 4×6 vs Letter — Which to Use",
    description: "Compare eBay 4×6 thermal and Letter sheet shipping label formats, and find the safest print settings for each.",
    h1: "eBay Shipping Label: 4×6 vs Letter",
    quickAnswer: "eBay sellers should use 4×6 labels for thermal printers and Letter labels for regular desktop printers. The safest choice is the format that matches the PDF, paper size and printer driver without shrinking or cropping the barcode.",
    defaultCombo: { platform: "ebay", carrier: "usps" },
    sections: [
      { heading: "When to use 4×6 eBay labels", body: "Use 4×6 when printing on a thermal label printer or adhesive label roll. Confirm the driver paper size is 4×6, use 100% / Actual Size and avoid auto-fit settings that can shrink the barcode." },
      { heading: "When to use Letter eBay labels", body: "Use Letter when printing from a regular inkjet or laser printer. Download the eBay label PDF, open it in a PDF viewer and print at Actual Size so the barcode remains sharp and the label is not clipped by browser margins." },
      { heading: "What goes wrong during conversion", body: "Problems usually happen when a 4×6 file is forced onto Letter paper or a Letter layout is sent to a thermal printer without checking scale and orientation. The barcode may become tiny, sideways, clipped or blurry." },
      { heading: "Safest preflight check", body: "Before shipping, confirm the barcode is complete, the address is readable, the tracking number is visible and the label is not folded or taped across active barcode content." },
    ],
    faq: [
      { question: "Is 4×6 better than Letter for eBay labels?", answer: "4×6 is usually better for thermal printers and frequent shipping. Letter works for desktop printers when printed at Actual Size." },
      { question: "Can I print a 4×6 eBay label on Letter paper?", answer: "Yes, if the label remains actual size and the barcode is not cropped or resized." },
      { question: "Why does my eBay label print tiny on Letter?", answer: "The print dialog may be fitting a 4×6 label into a larger sheet or shrinking the PDF. Use Actual Size from a PDF viewer." },
      { question: "Should I use browser print for eBay labels?", answer: "Downloading the PDF and printing from a PDF viewer is usually safer because browser previews often add scaling or margins." },
      { question: "What should I check before dropping off the package?", answer: "Check barcode sharpness, full tracking number, readable addresses, correct orientation and that no important label content is cut off." },
    ],
    related: commonRelated,
  },
  troublePage("ebay-shipping-label-trimmed-or-taped", "Can I Trim or Tape an eBay Shipping Label That Printed Wrong", "Only trim outside the barcode, address and quiet-zone areas. Tape over a barcode can cause scan glare. If in doubt, reprint using correct settings instead of patching the label."),
  troublePage("amazon-shipping-label-too-small-blurry", "Amazon Shipping Label Printed Too Small or Blurry", "A blurry or too-small Amazon label usually means the PDF was resized by browser or viewer scaling. Print at 100% Actual Size from a PDF viewer and confirm the barcode is sharp before handing off to USPS or UPS."),
  troublePage("amazon-4x6-label-on-a4-or-letter", "How to Print Amazon 4×6 Labels on A4 or Letter Without Cutting Off the Barcode", "Open the label in a PDF viewer, select A4 or Letter as destination, and print at Actual Size. Do not allow auto-fit. Check the barcode and address block are not clipped before shipping."),
  troublePage("amazon-fba-label-wrong-paper-size", "Amazon FBA Label Printed on Wrong Paper Size — Can I Still Ship?", "Only use the label if the barcode and address are fully intact and unscaled. If the mismatch distorted or cropped the label, reprint before the shipment enters the fulfillment workflow."),
  troublePage("amazon-a4-label-to-4x6-thermal", "Easiest Way to Convert Amazon A4 Labels to True 4×6 Thermal Size", "Identify the source label format first. Use a layout-aware PDF viewer or print tool to convert to 4×6 without shrinking the barcode. Avoid trial-and-error in the print dialog for postage labels."),
  troublePage("amazon-label-dimensions-dont-match-package", "Amazon Shipping Label Doesn't Match Box Dimensions", "First check whether the mismatch is a formatting error (print settings) or a data error (wrong dimensions entered). Print-settings issues are fixed by correcting scale; data issues require regenerating the label."),
  troublePage("shopify-shipping-labels-printing-incorrectly", "Shopify Shipping Labels Printing Incorrectly or Cut Off", "Download the Shopify label PDF, open it in a PDF viewer, set paper size manually and use Actual Size. Test one label before printing multiple. Most Shopify cut-off issues are paper-size or scaling mismatches."),
  troublePage("shopify-label-sideways-thermal-printer", "Shopify Label Prints Sideways and Tiny on Thermal Printer", "Set the thermal printer driver to 4×6 stock, disable auto-rotate, confirm portrait orientation and use 100% scale. Save the working preset so the same settings load on the next print job."),
  troublePage("shopify-4x6-on-desktop-printer", "Printing Shopify 4×6 Labels on a Regular Desktop Printer", "Open the label PDF in a PDF viewer, select Letter or A4, and use Actual Size. The 4×6 label will sit on the larger sheet. Do not allow auto-fit. Confirm the barcode is sharp and unclipped before shipping."),
  {
    slug: "shopify-label-size-vs-printer-size",
    kind: "platform",
    title: "Shopify Label Size vs Printer Size — How to Match Them",
    description: "Match your Shopify shipping label format to your printer and paper so barcodes always scan correctly.",
    h1: "Shopify Label Size vs Printer Size",
    quickAnswer: "Shopify labels work best when the label format, printer driver paper size and physical paper all match. Use 4×6 for thermal printers, or print the downloaded PDF on Letter or A4 at Actual Size for desktop printers.",
    defaultCombo: { platform: "shopify", carrier: "usps" },
    sections: [
      { heading: "Match Shopify format to the printer", body: "Thermal printers should use 4×6 stock with the driver set to the same size. Desktop printers should use Letter or A4 paper and print the downloaded PDF at Actual Size." },
      { heading: "Avoid automatic resizing", body: "Auto-fit, shrink-to-page and browser print margins can resize the barcode even when the preview looks acceptable. Use a PDF viewer and check scale before printing multiple Shopify labels." },
      { heading: "Common mismatch symptoms", body: "A label that prints sideways, tiny or cut off usually means the printer driver size, page orientation or PDF paper size does not match the label format." },
      { heading: "Save a known-good preset", body: "After one Shopify label prints correctly, save the printer preset with the same paper size, orientation and 100% scale so future labels do not inherit bad defaults." },
    ],
    faq: [
      { question: "What size should Shopify shipping labels be?", answer: "4×6 is common for thermal printers. Letter and A4 can work for regular printers when printed at Actual Size." },
      { question: "Why is my Shopify label sideways?", answer: "The printer driver orientation or paper size likely does not match the label PDF." },
      { question: "Can I print Shopify 4×6 labels on Letter paper?", answer: "Yes, as long as the label is not auto-fit, clipped or blurred." },
      { question: "Should I print Shopify labels from the browser?", answer: "Downloading the PDF and printing from a PDF viewer gives more reliable scale and paper controls." },
      { question: "What should I test before bulk printing?", answer: "Print one label or a blank template, confirm 100% scale and make sure the barcode is sharp and complete." },
    ],
    related: commonRelated,
  },
  troublePage("shopify-label-cut-off-parts-usps", "Can I Cut Off Parts of a Shopify Shipping Label Without USPS Returning It", "Trimming only outside the barcode, routing marks and address block is usually safe. Cutting into active label content or folding through the barcode risks scan failure or return. Reprint if in doubt."),
  troublePage("shipping-label-too-small-usps-ups-fedex-accept", "Shipping Label Printed Too Small — Will USPS, UPS or FedEx Accept It?", "Carriers scan the barcode, not the paper. A label that is physically smaller but fully intact may still be accepted. A label where the barcode is compressed, clipped or blurry is more likely to fail. Confirm the barcode is sharp before drop-off."),
  troublePage("label-wrong-paper-size-4x6-vs-letter-a4", "Label Printed on Wrong Paper Size (4×6 vs Letter/A4) — What Is Actually Risky?", "The paper the label sits on matters less than whether the barcode and address survived the print unchanged. A correct label on a larger sheet can still work. A distorted label on the correct sheet can still fail."),
  troublePage("shipping-label-keeps-getting-cropped", "Every Time I Print a Shipping Label It Gets Cropped", "Recurring cropping is almost always a print dialog setting: paper size, scale, orientation or margin. Check paper size first, then confirm Actual Size is set, then confirm orientation. Print from a PDF viewer rather than a browser."),
  troublePage("can-you-trim-fold-tape-shipping-label", "Can You Trim, Fold or Tape Over a Shipping Label Without Causing Scan Problems?", "Trimming outside the barcode quiet zone is usually fine. Folding through the barcode or applying glossy tape over it can reduce scan reliability. If the label needs significant repair, reprint it."),
  troublePage("shipping-label-preflight-checklist", "Pre-Flight Checklist: 7 Things to Verify Before Dropping Off at USPS, UPS or FedEx", "Before any handoff: confirm barcode is sharp and complete, address is readable, tracking number is visible, label is not cropped, format matched the printer and paper used, orientation is correct, and shipment data matches the package."),
  troublePage("mercari-shipping-label-4x6-vs-8x11", "Mercari Shipping Label Size: 4×6 vs 8.5×11", "Mercari sellers should match the label format to the printer before printing. Use the 4×6 format for thermal printers and the 8.5×11 format for regular inkjet or laser printers. Do not force one format into the other with Fit to Page."),
  troublePage("mercari-label-prints-too-small", "Mercari Shipping Label Prints Too Small", "A tiny Mercari label is usually caused by printing the wrong label format, browser scaling, or Fit to Page. Choose the label size that matches your printer, download the PDF, then print at 100% / Actual Size."),
  troublePage("pirate-ship-4x6-label-prints-on-letter-paper", "Pirate Ship 4×6 Label Prints on Letter Paper", "A Pirate Ship 4×6 label can print on Letter paper if it stays actual size and the barcode is intact, but it should not be stretched to fill the sheet. Print at 100%, then cut or fold outside the barcode and address block."),
  troublePage("pirate-ship-label-too-small-thermal-printer", "Pirate Ship Label Prints Too Small on a Thermal Printer", "Pirate Ship thermal label problems usually come from a mismatched printer paper size, browser scaling, or a driver preset that is not set to 4×6. Set the printer media to 4×6 and print the downloaded PDF at Actual Size."),
  troublePage("shipstation-label-too-small-or-too-large", "ShipStation Label Prints Too Small or Too Large", "ShipStation label size issues usually mean the document option, printer workstation setting, DPI, or paper size does not match the physical printer. Confirm the label layout first, then test one 4×6 or Letter output at 100%."),
  troublePage("rollo-printer-label-too-small", "Rollo Printer Shipping Label Prints Too Small", "When a Rollo label prints too small, check that the source label is a 4×6 format, the printer driver media size is 4×6, and the print dialog is set to 100% / Actual Size instead of Fit to Page."),
  troublePage("zebra-printer-4x6-label-cut-off-or-shrunk", "Zebra Printer 4×6 Shipping Label Is Cut Off or Shrunk", "Zebra 4×6 label problems are usually caused by driver media size, calibration, orientation, or scaling settings. Calibrate the roll, set media to 4×6, and print one template before sending live postage."),
  troublePage("dymo-4xl-label-prints-too-small", "DYMO 4XL Label Prints Too Small", "A DYMO 4XL shipping label that prints small is usually receiving the wrong page size or a scaled PDF. Use a 4×6 label file, select the 4XL/4×6 paper size, and disable Fit to Page before reprinting."),
  troublePage("print-4x6-shipping-label-on-regular-printer", "How to Print a 4×6 Shipping Label on a Regular Printer", "You can print a 4×6 shipping label on a regular printer by keeping the label at Actual Size on Letter or A4 paper. Do not enlarge it to fill the page, and only cut or fold outside the barcode and address area."),
  troublePage("convert-letter-shipping-label-to-4x6-thermal", "Convert a Letter Shipping Label to 4×6 Thermal Size Safely", "Before converting a Letter label to 4×6 thermal size, confirm whether the PDF already contains a true 4×6 label area. Crop or extract the label without shrinking the barcode, then test-print before shipping."),
  specificTroublePage(
    "vinted-shipping-label-4x6-thermal-printer",
    "Vinted Shipping Label on a 4×6 Thermal Printer",
    "Vinted labels are often downloaded as sheet-style PDFs, so the safest first step is to identify the PDF page size before sending it to a 4×6 thermal printer. Extract or print the label area at Actual Size, then test one label before using paid postage.",
    [
      { heading: "Check the Vinted PDF before printing", body: "Open the downloaded Vinted label in a PDF viewer and confirm whether it is a full A4/Letter page, a half-page label, or a true 4×6 label. Do not assume the print dialog can safely shrink a sheet label into a 4×6 roll." },
      { heading: "Set the thermal printer to 4×6 stock", body: "In the printer driver, choose 4×6 inch media, portrait orientation and 100% scale. If the preview shows the whole A4 page squeezed onto one label, stop and crop or extract the actual label area first." },
      { heading: "Watch for barcode and QR-code shrink", body: "Marketplace and locker labels may include QR codes, barcodes and pickup instructions. If those codes are shrunk or clipped, the parcel may fail at drop-off even when the address still looks readable." },
      { heading: "Run a blank 4×6 test first", body: "Print a 4×6 template, then print the Vinted label. Measure the output and confirm the code area is sharp, flat, complete and not touching the label edge before attaching it." },
    ],
    [
      { question: "Can I print a Vinted label on a 4×6 thermal printer?", answer: "Yes if the label area fits 4×6 without shrinking or cropping required codes. Check the PDF page size first." },
      { question: "Why does my Vinted label print tiny?", answer: "The print dialog may be fitting a full sheet PDF onto a 4×6 label. Extract the label area or use the correct paper format." },
      { question: "Should I use Fit to Page?", answer: "No. Use 100% / Actual Size after the label area and printer media size match." },
      { question: "What should I check before drop-off?", answer: "Make sure every barcode or QR code is sharp, complete and not folded around an edge." },
    ],
  ),
  specificTroublePage(
    "vinted-label-prints-too-small",
    "Vinted Label Prints Too Small",
    "A tiny Vinted label usually means the full sheet PDF was fitted onto the wrong paper size. Check the PDF dimensions, choose the correct printer media, and avoid Fit to Page before reprinting.",
    [
      { heading: "Start with the page size", body: "Use the PDF analyzer or your PDF viewer properties to see whether the Vinted file is A4, Letter, half-sheet or 4×6. A sheet-sized label sent directly to a label roll often prints as a miniature page." },
      { heading: "Match paper before scale", body: "Choose A4/Letter for a regular printer or 4×6 for a thermal printer. Only after the correct paper size is selected should you print at 100% / Actual Size." },
      { heading: "Do not enlarge blindly", body: "If the output is small, changing scale to 120% or 150% can crop the barcode. Find the source layout first, then crop or extract the label area intentionally." },
      { heading: "Reprint the original label if allowed", body: "Do not buy another label just because the first print was small. Fix the print settings and reprint the original file if the marketplace still allows it." },
    ],
  ),
  specificTroublePage(
    "depop-shipping-label-too-small",
    "Depop Shipping Label Prints Too Small",
    "Depop label size problems usually come from browser preview scaling, wrong paper size, or sending a sheet label to a thermal printer. Download the label PDF, inspect the page size, then print at Actual Size.",
    [
      { heading: "Download instead of browser-printing", body: "If the label opened in a browser tab, download the PDF first. Browser previews can add margins, headers or auto-fit behavior that makes a label look centered but print smaller than expected." },
      { heading: "Check whether it is sheet or 4×6", body: "Depop shipments may be printed from a phone or desktop workflow. Before choosing a thermal printer, confirm whether the file itself is a 4×6 label or a larger page containing the label." },
      { heading: "Use Actual Size for the final print", body: "Once the page and printer media match, print at 100% / Actual Size. Avoid Fit to Page, Shrink Oversized Pages and driver presets inherited from previous print jobs." },
      { heading: "Check the barcode before mailing", body: "A label that is readable to a person can still be risky if the barcode was compressed. Confirm the code has white space around it and is not covered by tape glare." },
    ],
  ),
  specificTroublePage(
    "depop-label-4x6-thermal-printer",
    "Print a Depop Label on a 4×6 Thermal Printer",
    "To print a Depop label on a 4×6 thermal printer, first confirm the label area is actually 4×6 or can be extracted without resizing the barcode. Then set the driver to 4×6 and print at Actual Size.",
    [
      { heading: "Identify the source layout", body: "Open the Depop label PDF and check the visible page. If the label sits on a larger sheet, the printer may try to scale the entire sheet down to 4×6 unless you crop or extract the label area first." },
      { heading: "Use a 4×6 printer preset", body: "Set the thermal printer driver to 4×6 inch stock, portrait orientation and no automatic scaling. Save the preset only after one test label prints correctly." },
      { heading: "Avoid phone print shortcuts for first setup", body: "Mobile print sheets can hide scale and paper controls. For the first working setup, use a desktop PDF viewer so you can see paper size, orientation and scale explicitly." },
      { heading: "Measure the first label", body: "Measure the printed boundary and inspect the barcode quiet zone. If the label is slightly small, use the scale calculator before printing a live parcel label." },
    ],
  ),
  specificTroublePage(
    "poshmark-shipping-label-4x6-thermal-printer",
    "Poshmark Shipping Label on a 4×6 Thermal Printer",
    "Poshmark labels can be printed on a 4×6 thermal printer when the label format and printer driver match. Set the label size to 4×6, print at 100%, and test one label before shipping.",
    [
      { heading: "Choose the 4×6 label format first", body: "If your Poshmark account or label workflow lets you choose a 4×6 format, use that for a thermal printer. If the PDF is still Letter-sized, do not let the printer shrink the whole page onto one label." },
      { heading: "Set the driver and browser consistently", body: "Choose 4×6 inch media in the system printer settings and again in the print dialog if both controls appear. Conflicting paper sizes are a common cause of tiny or cut-off labels." },
      { heading: "Fix multi-label or split output", body: "If one Poshmark label prints across two labels or advances extra blank labels, recalibrate the printer, confirm 4×6 media size and disable any tiling or poster mode." },
      { heading: "Verify scan-critical areas", body: "Before shipping, check that the barcode is not clipped, compressed, folded, taped over with glare, or shifted outside the printable area." },
    ],
  ),
  specificTroublePage(
    "poshmark-label-prints-across-two-labels",
    "Poshmark Label Prints Across Two Labels",
    "When a Poshmark label prints across two labels, the printer usually sees the wrong media size, a tiled page, or an uncalibrated roll. Set media to 4×6, turn off tiling, recalibrate, and print one blank template.",
    [
      { heading: "Turn off tiling or poster print", body: "A label split across two stickers often means the print dialog is tiling a larger page. Look for settings like Poster, Tile, Multiple pages per sheet, or scaling modes that split output." },
      { heading: "Recalibrate the thermal printer", body: "Thermal printers need to detect label gaps. If calibration is off, the printer may start the next label too early or feed extra labels after each print." },
      { heading: "Match the PDF to 4×6 stock", body: "If the source PDF is Letter-sized, a 4×6 printer may split or shrink it. Use a true 4×6 label format or extract the 4×6 label area from the page." },
      { heading: "Test before using paid postage", body: "Print a blank 4×6 template and one test label. If the border does not fit one sticker, fix driver media size before reprinting the Poshmark label." },
    ],
  ),
  specificTroublePage(
    "tiktok-shop-shipping-label-too-small",
    "TikTok Shop Shipping Label Prints Too Small",
    "TikTok Shop shipping labels can print too small when a browser preview, PDF viewer, or printer driver scales the label to the wrong paper size. Download the label, match the media, and print at 100%.",
    [
      { heading: "Download the TikTok Shop label PDF", body: "Start from the downloaded PDF rather than a browser screenshot. Screenshots and browser previews can change the actual barcode size before the printer receives the job." },
      { heading: "Choose the right printer workflow", body: "Use 4×6 media for a thermal printer, or Letter/A4 for an inkjet or laser printer. Do not send a full sheet layout to a 4×6 printer unless the label area has been extracted." },
      { heading: "Avoid auto-fit settings", body: "Use 100% / Actual Size after the correct paper size is selected. Auto-fit settings can make the preview look neat while compressing the barcode." },
      { heading: "Check marketplace and carrier text", body: "Confirm the tracking barcode, buyer address, return address, service text and any marketplace routing marks remain sharp and complete." },
    ],
  ),
  specificTroublePage(
    "royal-mail-label-prints-too-small",
    "Royal Mail Label Prints Too Small",
    "A Royal Mail label that prints too small is usually being scaled from an A4 page or browser preview. Print the PDF at Actual Size on the correct paper, and do not crop into the barcode or QR-code area.",
    [
      { heading: "Know whether the label is A4 or 4×6", body: "Royal Mail workflows often produce labels intended for sheet printing, label rolls, or integrated labels. Check the PDF page size before choosing the printer media." },
      { heading: "Use A4 for sheet output", body: "For a regular printer, select A4 paper and 100% / Actual Size. Disable headers, footers, Fit to Printable Area and other settings that shrink the label block." },
      { heading: "Use 4×6 only when the label area fits", body: "For a 4×6 thermal printer, make sure the label area can fit without shrinking the barcode or QR code. If the file is A4, extract the label area rather than scaling the full page." },
      { heading: "Check codes and customs text", body: "International or tracked labels may include multiple codes and service marks. Do not fold, trim or tape through those areas." },
    ],
  ),
  specificTroublePage(
    "return-shipping-label-prints-too-small",
    "Return Shipping Label Prints Too Small",
    "Return labels print too small for the same reasons as outbound labels: wrong paper size, browser scaling, or Fit to Page. Reprint the original return label at Actual Size and check the barcode before mailing.",
    [
      { heading: "Do not request a new return label first", body: "A bad print usually does not mean the return label itself is invalid. Fix scale and paper settings, then reprint the same PDF if the retailer or carrier link still works." },
      { heading: "Check the paper the retailer expected", body: "Some return labels are designed for Letter or A4 sheets, while others are 4×6. Match the printer paper to the PDF instead of forcing every return label through a thermal printer." },
      { heading: "Keep the barcode unchanged", body: "Do not enlarge or shrink the return label just to fill the page. The barcode and quiet-zone whitespace matter more than whether the label looks visually centered." },
      { heading: "Attach it flat", body: "Trim outside the label content only, then attach the return label flat. Avoid folds, wrinkles and glossy tape over the barcode." },
    ],
  ),
  specificTroublePage(
    "shipping-label-qr-code-too-small",
    "Shipping Label QR Code Prints Too Small",
    "If a shipping label QR code prints too small, the whole label or source page was probably scaled. Fix the paper size and print at 100% before changing QR-code size manually.",
    [
      { heading: "Treat QR size as a scale problem first", body: "A tiny QR code is usually a symptom of the entire label being fitted to the wrong paper size. Check the PDF page size and print scale before editing the image or screenshot." },
      { heading: "Avoid screenshots", body: "Screenshots can lower resolution and remove the original PDF scale. Use the downloaded PDF whenever the marketplace, carrier or retailer provides one." },
      { heading: "Check quiet zone around the code", body: "QR codes need clean whitespace around them. Do not crop the code close to the edge or cover it with glossy tape." },
      { heading: "Test scan before shipping", body: "Use a phone or scanner to confirm the printed QR code reads clearly. If it fails, fix printer density, paper quality and scale before mailing." },
    ],
  ),
  {
    slug: "thermal-printer-calibration-shipping-label",
    kind: "troubleshooter",
    title: "Thermal Printer Calibration for 4×6 Shipping Labels",
    description: "Calibrate a thermal printer for 4×6 shipping labels before printing paid postage. Check scale, roll alignment, driver media size and barcode quiet zones.",
    h1: "Thermal Printer Calibration for 4×6 Shipping Labels",
    quickAnswer: "Print one blank 4×6 calibration sheet at 100% first. If the border is the wrong size, fix scale or media size; if it is shifted, fix roll guides, driver offsets or calibration before printing live postage.",
    decisionTree: {
      headline: "Calibrate before printing paid postage",
      intro: "Use the failed test print symptom to decide whether the problem is scale, media size, roll alignment or print density.",
      firstAction: "Run a blank 4×6 calibration sheet at 100% / Actual Size.",
      steps: [
        { title: "Border is too small or too large", symptom: "The printed 4×6 box does not measure 4×6 inches.", action: "Confirm the driver media size is 4×6, disable Fit to Page, then calculate a corrected scale only if the media size is already correct.", href: "/tools/scale-calculator", cta: "Calculate corrected scale" },
        { title: "Border is shifted or clipped", symptom: "The size is close, but one edge starts too far left, right, high or low.", action: "Reload the roll, center the guides and run the printer's calibration/feed routine before changing marketplace settings.", href: "/tools/calibration-sheet", cta: "Print calibration sheet" },
        { title: "Barcode looks faint or streaky", symptom: "Size and placement are correct, but dark bars are gray, broken or shiny under tape.", action: "Increase print density, clean the print head, try a fresh label roll and avoid glossy tape over the barcode.", href: "/shipping-label-barcode-not-scanning", cta: "Fix barcode scan risk" },
      ],
    },
    sections: [
      { heading: "Start with media size, not the marketplace", body: "Most thermal printer label failures come from the printer driver believing the roll is a different size. Set the system driver and the print dialog to 4×6 inch stock before changing Etsy, Shopify, eBay or carrier label settings." },
      { heading: "Print a blank calibration sheet", body: "Use a blank test sheet or template before printing paid postage. Print at 100% / Actual Size, measure the outer border with a ruler and confirm the label feeds exactly one sticker at a time." },
      { heading: "Fix scale and offset separately", body: "If every dimension is proportionally wrong, it is a scale problem. If the size is correct but the content is shifted, it is usually roll loading, printable area or driver offset. Do not solve offset by shrinking the whole label." },
      { heading: "Check scan-critical areas last", body: "After the border is correct, inspect barcode quiet zone, print density and tape placement. A perfectly sized label can still fail if the barcode is faint, clipped, wrinkled or covered by glare." },
    ],
    faq: [
      { question: "How often should I calibrate a thermal label printer?", answer: "Calibrate after installing a new printer, loading a new roll, changing label stock, updating drivers or seeing repeated drift/cropping." },
      { question: "Should I change scale to fix a shifted label?", answer: "No. Fix roll alignment, media size or driver offset first. Scaling a shifted label can make the barcode too small." },
      { question: "Why does my printer feed extra blank labels?", answer: "The printer may not be detecting label gaps correctly, or the driver media size may not match the roll. Run the printer calibration/feed routine and confirm 4×6 media." },
      { question: "Can I use a live shipping label as the test?", answer: "Use a blank calibration sheet first when possible. It avoids wasting paid postage and isolates printer setup from label-file problems." },
      { question: "What if calibration passes but the real label is tiny?", answer: "Then the source PDF or print dialog is likely being scaled. Analyze the PDF page size and print from a PDF viewer at Actual Size." },
    ],
    related: calibrationRelated,
  },
];

const localizedSeoPages: Partial<Record<Locale, SeoPage[]>> = {
  es: seoPagesEs,
  zh: seoPagesZh,
};

for (const [locale, pages] of Object.entries(localizedSeoPages) as [Locale, SeoPage[]][]) {
  registerLocalizedPaths(pages.map((page) => `/${page.slug}`), [locale]);
}
registerLocalizedPaths(allSeoRoutePaths(), locales);
registerLocalizedPaths(seoPages.map((page) => `/${page.slug}`), [defaultLocale]);

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function hasTranslatedSeoPages(locale: Locale) {
  return locale in localizedSeoPages;
}

export function getSeoPages(locale: Locale = defaultLocale): SeoPage[] {
  return localizedSeoPages[locale] ?? seoPages;
}

export function getStaticSeoPages(locale: Locale = defaultLocale): SeoPage[] {
  return locale === defaultLocale || hasTranslatedSeoPages(locale) ? getSeoPages(locale) : [];
}

export function getImplementedSeoLocales() {
  return locales.filter(hasTranslatedSeoPages);
}

export function getLocalizedSeoPage(slug: string, locale: Locale = defaultLocale) {
  return getSeoPages(locale).find((page) => page.slug === slug);
}
