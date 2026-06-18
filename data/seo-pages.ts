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
  keywords?: string[];
  updatedAt?: string;
  reviewChecklist?: string[];
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

const seoContentUpdatedAt = "2026-06-15";

const reviewChecklists: Record<Locale, Record<SeoPageKind, string[]>> = {
  en: {
    platform: ["Match the marketplace label format to the printer paper size.", "Print the first label at 100% / Actual Size.", "Confirm barcode quiet zone and address readability before drop-off."],
    carrier: ["Use the carrier PDF format that matches the printer.", "Keep barcode, service text and tracking number sharp and uncut.", "Attach the label flat without folds or glossy tape over barcode areas."],
    template: ["Print the blank template at 100% before paid postage.", "Measure the border with a ruler and compare it to the target size.", "Fix scale or margins before printing a real carrier label."],
    troubleshooter: ["Identify whether the symptom is scale, paper size, offset or scan quality.", "Run a blank template before buying new postage.", "Reprint the original PDF after settings are corrected when the platform allows it."],
  },
  es: {
    platform: ["Haz coincidir el formato del marketplace con el tamaño de papel.", "Imprime la primera etiqueta al 100% / Tamaño real.", "Confirma margen libre del código y dirección legible antes de entregar."],
    carrier: ["Usa el formato PDF del transportista que coincide con la impresora.", "Mantén código, servicio y seguimiento nítidos y sin recortes.", "Pega la etiqueta plana, sin pliegues ni cinta brillante sobre códigos."],
    template: ["Imprime la plantilla en blanco al 100% antes del franqueo pagado.", "Mide el borde con regla y compáralo con el tamaño objetivo.", "Corrige escala o márgenes antes de imprimir una etiqueta real."],
    troubleshooter: ["Identifica si el síntoma es escala, papel, offset o calidad de escaneo.", "Ejecuta una plantilla en blanco antes de comprar nuevo franqueo.", "Reimprime el PDF original después de corregir ajustes cuando la plataforma lo permita."],
  },
  zh: {
    platform: ["让平台标签格式匹配打印机纸张尺寸。", "第一张标签按 100% / 实际大小打印。", "投递前确认条码空白区和地址可读。"],
    carrier: ["使用与打印机匹配的承运商 PDF 格式。", "确保条码、服务文字和追踪号清晰且未裁切。", "平整粘贴标签，不要在条码区域折叠或覆盖亮面胶带。"],
    template: ["打印真实运费前，先按 100% 打印空白模板。", "用尺子测量边框，并与目标尺寸对比。", "打印真实承运商标签前，先修复比例或边距。"],
    troubleshooter: ["先判断症状属于比例、纸张、偏移还是扫描质量。", "购买新运费前先运行空白模板。", "设置修复后，如平台允许，重打原始 PDF。"],
  },
  fr: {
    platform: ["Match the marketplace label format to the printer paper size.", "Print the first label at 100% / Actual Size.", "Confirm barcode quiet zone and address readability before drop-off."],
    carrier: ["Use the carrier PDF format that matches the printer.", "Keep barcode, service text and tracking number sharp and uncut.", "Attach the label flat without folds or glossy tape over barcode areas."],
    template: ["Print the blank template at 100% before paid postage.", "Measure the border with a ruler and compare it to the target size.", "Fix scale or margins before printing a real carrier label."],
    troubleshooter: ["Identify whether the symptom is scale, paper size, offset or scan quality.", "Run a blank template before buying new postage.", "Reprint the original PDF after settings are corrected when the platform allows it."],
  },
  de: {
    platform: ["Match the marketplace label format to the printer paper size.", "Print the first label at 100% / Actual Size.", "Confirm barcode quiet zone and address readability before drop-off."],
    carrier: ["Use the carrier PDF format that matches the printer.", "Keep barcode, service text and tracking number sharp and uncut.", "Attach the label flat without folds or glossy tape over barcode areas."],
    template: ["Print the blank template at 100% before paid postage.", "Measure the border with a ruler and compare it to the target size.", "Fix scale or margins before printing a real carrier label."],
    troubleshooter: ["Identify whether the symptom is scale, paper size, offset or scan quality.", "Run a blank template before buying new postage.", "Reprint the original PDF after settings are corrected when the platform allows it."],
  },
  ja: {
    platform: ["Match the marketplace label format to the printer paper size.", "Print the first label at 100% / Actual Size.", "Confirm barcode quiet zone and address readability before drop-off."],
    carrier: ["Use the carrier PDF format that matches the printer.", "Keep barcode, service text and tracking number sharp and uncut.", "Attach the label flat without folds or glossy tape over barcode areas."],
    template: ["Print the blank template at 100% before paid postage.", "Measure the border with a ruler and compare it to the target size.", "Fix scale or margins before printing a real carrier label."],
    troubleshooter: ["Identify whether the symptom is scale, paper size, offset or scan quality.", "Run a blank template before buying new postage.", "Reprint the original PDF after settings are corrected when the platform allows it."],
  },
};

const contextualRelated: Record<string, RelatedLink[]> = {
  etsy: [
    { href: "/etsy-shipping-label-print-settings", title: "Etsy print settings", description: "Choose 4×6, Letter or A4 settings before printing Etsy labels." },
    { href: "/etsy-shipping-label-prints-too-small", title: "Etsy label prints too small", description: "Fix Etsy scale, PDF viewer and thermal-printer mismatch problems." },
    { href: "/etsy-4x6-label-on-regular-printer", title: "Etsy 4×6 on a regular printer", description: "Print Etsy 4×6 labels on Letter or A4 without resizing the barcode." },
  ],
  ebay: [
    { href: "/ebay-shipping-label-prints-too-small", title: "eBay label prints too small", description: "Fix browser scaling and 4×6 thermal printer setup for eBay labels." },
    { href: "/ebay-4x6-label-sideways-thermal-printer", title: "eBay 4×6 label sideways", description: "Correct paper size and orientation before printing more labels." },
    { href: "/ebay-shipping-label-size-4x6-vs-letter", title: "eBay 4×6 vs Letter", description: "Choose the safer eBay label format for your printer." },
  ],
  shopify: [
    { href: "/shopify-shipping-labels-printing-incorrectly", title: "Shopify labels printing incorrectly", description: "Fix cut-off, sideways and scaled Shopify shipping labels." },
    { href: "/shopify-label-size-vs-printer-size", title: "Shopify label size vs printer size", description: "Match Shopify label format to printer media." },
    { href: "/shopify-4x6-on-desktop-printer", title: "Shopify 4×6 on a regular printer", description: "Print Shopify thermal-size labels on Letter or A4 safely." },
  ],
  amazon: [
    { href: "/amazon-shipping-label-too-small-blurry", title: "Amazon label too small or blurry", description: "Fix Amazon label scale before handoff." },
    { href: "/amazon-4x6-label-on-a4-or-letter", title: "Amazon 4×6 on A4 or Letter", description: "Avoid cropping Amazon barcodes on sheet printers." },
    { href: "/amazon-fba-label-wrong-paper-size", title: "Amazon FBA wrong paper size", description: "Decide when to reprint before FBA workflow handoff." },
  ],
  printer: [
    { href: "/thermal-printer-calibration-shipping-label", title: "Thermal printer calibration", description: "Calibrate 4×6 media, roll alignment and print density." },
    { href: "/rollo-printer-label-too-small", title: "Rollo label too small", description: "Fix Rollo media size and scaling settings." },
    { href: "/zebra-printer-4x6-label-cut-off-or-shrunk", title: "Zebra label cut off or shrunk", description: "Separate Zebra driver media size, calibration and scale problems." },
  ],
  printDialog: [
    { href: "/shipping-label-pdf-wrong-page-size", title: "PDF page size is wrong", description: "Read the PDF page box before choosing paper or scale settings." },
    { href: "/chrome-shipping-label-printing-too-small", title: "Chrome prints labels too small", description: "Fix browser margins, headers and hidden scaling controls." },
    { href: "/mac-preview-shipping-label-too-small", title: "Mac Preview prints labels too small", description: "Check Preview paper size, scale and saved printer presets." },
  ],
  acceptance: [
    { href: "/shipping-label-too-small-usps-ups-fedex-accept", title: "Will carriers accept a small label?", description: "Understand barcode risk before drop-off." },
    { href: "/shipping-label-preflight-checklist", title: "Shipping label preflight checklist", description: "Check seven scan-critical items before handoff." },
    { href: "/can-you-trim-fold-tape-shipping-label", title: "Can you trim, fold or tape a label?", description: "Avoid repairs that damage barcode scanning." },
  ],
};

function keywordsForPage(page: SeoPage) {
  const base = [page.h1, page.title, "shipping label size", "shipping label printing", "4x6 shipping label"];
  const slugTerms = page.slug.split("-").filter((term) => term.length > 2).join(" ");
  return Array.from(new Set([...base, slugTerms])).slice(0, 8);
}

function relatedClusterForPage(page: SeoPage) {
  const key = page.slug.includes("etsy")
    ? "etsy"
    : page.slug.includes("ebay")
      ? "ebay"
      : page.slug.includes("shopify")
        ? "shopify"
        : page.slug.includes("amazon") || page.slug.includes("fba")
          ? "amazon"
          : page.slug.includes("printer") || page.slug.includes("rollo") || page.slug.includes("zebra") || page.slug.includes("dymo") || page.slug.includes("thermal")
            ? "printer"
            : page.slug.includes("chrome") || page.slug.includes("mac-preview") || page.slug.includes("wrong-page-size")
              ? "printDialog"
              : page.slug.includes("accept") || page.slug.includes("preflight") || page.slug.includes("trim") || page.slug.includes("tape") || page.slug.includes("wrong-paper")
                ? "acceptance"
                : null;
  return key ? contextualRelated[key] : [];
}

function mergeRelated(page: SeoPage) {
  const seen = new Set<string>([`/${page.slug}`]);
  const links = [...relatedClusterForPage(page), ...page.related].filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
  return links.slice(0, 6);
}

const longTailEnhancements: Record<string, Partial<Pick<SeoPage, "sections" | "faq" | "reviewChecklist">>> = {
  "etsy-shipping-label-print-settings": {
    sections: [
      { heading: "Choose the Etsy format before opening the print dialog", body: "Decide whether this order should use a 4×6 thermal label or a Letter/A4 sheet workflow before changing printer scale. The safest setting is the Etsy label format that already matches the paper or roll loaded in the printer." },
      { heading: "Use the downloaded PDF as the source of truth", body: "Download the Etsy shipping label PDF and print from a viewer that exposes page size, paper size and scale. Browser previews and screenshots can inherit margins or resize the label before the printer driver sees it." },
      { heading: "Set paper size and scale in this order", body: "First choose the physical paper or roll size, then choose 100% / Actual Size, then confirm orientation. Avoid Fit to Page, Shrink Oversized Pages and old photo or document presets that can compress the barcode." },
      { heading: "Run one Etsy-specific preflight", body: "Before drop-off, verify the tracking barcode, address, return address and any marketplace or carrier service marks are sharp, complete and not touching a cut edge. Reprint the original PDF after fixing settings when Etsy still allows access." },
    ],
    faq: [
      { question: "What print settings should I use for Etsy shipping labels?", answer: "Match Etsy's label format to your printer paper, then print the downloaded PDF at 100% / Actual Size with Fit to Page disabled." },
      { question: "Should Etsy 4×6 labels fill Letter paper?", answer: "No. A 4×6 label can sit on Letter paper, but it should remain actual size so the barcode is not enlarged or compressed." },
      { question: "Why does Etsy print a small label on my thermal printer?", answer: "The common cause is sending a sheet-size PDF or browser-scaled preview to 4×6 media. Confirm the PDF page size and printer media before changing scale." },
      { question: "Can I use screenshots for Etsy labels?", answer: "Avoid screenshots because they can reduce resolution and hide the original PDF size. Use the downloaded label PDF when possible." },
      { question: "Does this create Etsy postage?", answer: "No. It only helps choose print settings and check labels you already purchased or downloaded from Etsy." },
    ],
    reviewChecklist: ["Match Etsy label format to printer paper.", "Print the downloaded PDF at 100% / Actual Size.", "Confirm barcode, address and service marks before drop-off."],
  },
  "ebay-shipping-label-prints-too-small": {
    sections: [
      { heading: "Download the eBay label PDF first", body: "A tiny eBay label often starts when the label is printed from a browser preview with hidden margins or Fit to Page enabled. Download the label PDF, open it in a PDF viewer and choose 100% / Actual Size before changing marketplace settings." },
      { heading: "Match eBay 4×6 or Letter to the printer", body: "Use the 4×6 format for a thermal printer and Letter for a desktop printer. Sending a Letter page to a 4×6 driver can shrink the whole sheet; sending a 4×6 label to Letter with auto-fit can also reduce the barcode." },
      { heading: "Measure one reprint before buying postage again", body: "If eBay still lets you reprint the original label, fix scale and media size first, then reprint the same file. Measure the 4×6 boundary and inspect the barcode quiet zone before mailing." },
      { heading: "Keep the barcode unchanged", body: "Do not enlarge a small print by guessing a high scale percentage. First identify whether the source PDF, paper size, browser preview or printer driver caused the shrink." },
    ],
    faq: [
      { question: "Why did my eBay shipping label print tiny?", answer: "The usual cause is browser scaling, Fit to Page, or a mismatch between the eBay label format and printer media size." },
      { question: "Should I print eBay labels from the browser?", answer: "Downloading the PDF and printing from a PDF viewer usually gives safer scale and paper controls." },
      { question: "Can I reprint the same eBay label after a bad print?", answer: "Usually you should fix print settings and reprint the original label if the eBay workflow still allows it." },
      { question: "Is a small eBay barcode safe to ship?", answer: "Treat a compressed, clipped or blurry barcode as risky. Reprint at the correct scale before drop-off." },
      { question: "What should I test first?", answer: "Print a blank 4×6 template at 100%, then print one eBay label and confirm the barcode is sharp and complete." },
    ],
    reviewChecklist: ["Download the eBay PDF instead of browser-printing.", "Match eBay label format to printer media.", "Inspect barcode quiet zone after reprint."],
  },
  "shopify-shipping-labels-printing-incorrectly": {
    sections: [
      { heading: "Start from the downloaded Shopify PDF", body: "Shopify label problems are easier to isolate from the PDF than from a browser print panel. Download the label, then confirm whether the file is 4×6, Letter or A4 before choosing a printer preset." },
      { heading: "Test one label before batch printing", body: "A bad Shopify printer preset can ruin multiple labels at once. Print one label or blank template first, then save a known-good preset only after paper size, orientation and scale are correct." },
      { heading: "Fix sideways and cut-off output separately", body: "Sideways output usually points to orientation or media-size mismatch. Cut-off output usually points to printable area, roll alignment or driver paper size. Do not solve either by shrinking the whole label." },
      { heading: "Check USPS or carrier marks before handoff", body: "If the label includes USPS or carrier routing marks, keep them readable and uncut. Trimming into routing text, barcode or address areas creates scan and return risk." },
    ],
    faq: [
      { question: "Why are my Shopify labels printing incorrectly?", answer: "Most failures come from paper size, orientation, scaling, or an inherited printer preset that does not match the Shopify PDF." },
      { question: "Can I print Shopify 4×6 labels on Letter paper?", answer: "Yes, if the 4×6 label remains Actual Size and the barcode is not enlarged, shrunk or clipped." },
      { question: "Why is my Shopify label sideways?", answer: "The printer driver orientation or selected media size likely does not match the label PDF." },
      { question: "Should I batch print immediately after changing settings?", answer: "No. Test one label first so a bad preset does not waste multiple paid labels." },
      { question: "Can I cut off unused white space?", answer: "Only trim outside barcode, address, routing and quiet-zone areas. Reprint if any active content is clipped." },
    ],
    reviewChecklist: ["Download the Shopify label PDF.", "Print one test before batch printing.", "Confirm carrier marks, barcode and address are complete."],
  },
  "amazon-fba-label-wrong-paper-size": {
    sections: [
      { heading: "Separate FBA workflow data from print layout", body: "A wrong paper-size print can be a layout mistake even when the shipment data is correct. If the barcode or label text was distorted, reprint the FBA label before the shipment enters the fulfillment workflow." },
      { heading: "Do not force a sheet label onto thermal stock", body: "If the Amazon FBA PDF is Letter or A4, sending the whole page to 4×6 stock can shrink or crop the barcode. Extract the actual label area only when it can fit without resizing scan-critical content." },
      { heading: "Use the paper expected by the PDF", body: "For sheet output, choose Letter or A4 and 100% / Actual Size. For thermal output, use a true 4×6 label format or a verified conversion workflow that preserves barcode size." },
      { heading: "Inspect every FBA handoff label", body: "Before boxing or handoff, confirm each barcode, shipment identifier and address/service text is sharp, complete and not folded or covered by tape." },
    ],
    faq: [
      { question: "Can I still ship an FBA label printed on the wrong paper?", answer: "Only if the barcode and required text remain intact, sharp and unscaled. Distorted or clipped labels should be reprinted." },
      { question: "Should I resize an Amazon FBA label to fill 4×6?", answer: "No. Preserve barcode scale and crop/extract only when the source layout supports it." },
      { question: "Is paper size more important than barcode quality?", answer: "Barcode integrity and readable shipment text matter most. Correct paper with distorted barcode is still risky." },
      { question: "What should I check before FBA handoff?", answer: "Check barcode sharpness, full label boundary, shipment text, address text and that labels are flat on the package or carton." },
      { question: "Does this tool generate Amazon postage?", answer: "No. It only helps troubleshoot print size and layout for labels you already have." },
    ],
    reviewChecklist: ["Confirm whether the problem is print layout or shipment data.", "Use the paper size expected by the Amazon PDF.", "Reprint before FBA handoff if barcode or required text is distorted."],
  },
  "rollo-printer-label-too-small": {
    sections: [
      { heading: "Confirm the source label is really 4×6", body: "A Rollo printer can only print the job it receives. If the source file is a full Letter or A4 page, the driver may shrink that entire page onto one 4×6 label unless the label area is extracted first." },
      { heading: "Set media size in both system and print dialogs", body: "Choose 4×6 inch stock in the operating-system printer settings and in the app print dialog when both appear. Conflicting media sizes are a common reason labels print tiny." },
      { heading: "Calibrate feed before changing scale", body: "If the border is shifted or the printer feeds extra labels, run the printer calibration/feed routine and reload the roll. Scaling down to fix offset can make the barcode too small." },
      { heading: "Check density after size is correct", body: "Once scale and placement are correct, inspect dark bars, streaks and tape glare. A correctly sized thermal label can still fail if the barcode is faint." },
    ],
    faq: [
      { question: "Why does my Rollo label print too small?", answer: "The PDF may be a sheet layout, the media size may not be 4×6, or the print dialog may be using Fit to Page." },
      { question: "Should I calibrate before changing scale?", answer: "Yes when feed, drift or offset is the symptom. Fix media and calibration before scaling." },
      { question: "Can I print a Letter label on Rollo?", answer: "Only after extracting a label area that fits 4×6 without shrinking the barcode." },
      { question: "What setting should I start with?", answer: "Use 4×6 media, portrait orientation and 100% / Actual Size." },
      { question: "Does this claim official Rollo support?", answer: "No. It is independent troubleshooting guidance for common 4×6 thermal-printer workflows." },
    ],
    reviewChecklist: ["Verify the source label is 4×6 or extractable.", "Set 4×6 media in every print control.", "Calibrate feed before using scale as a workaround."],
  },
  "zebra-printer-4x6-label-cut-off-or-shrunk": {
    sections: [
      { heading: "Start with Zebra media size", body: "Cut-off or shrunk 4×6 labels usually mean the driver, application or system print dialog is using the wrong media size. Set the stock to 4×6 before editing margins or scale." },
      { heading: "Calibrate gap sensing and roll feed", body: "If output drifts, starts too high, or feeds extra blank labels, run the printer calibration/feed routine and reload the roll guides before blaming the marketplace label." },
      { heading: "Do not fix offset by shrinking", body: "Scaling the whole label down may hide clipping but creates barcode and quiet-zone risk. Fix printable area, orientation, origin offset or roll alignment first." },
      { heading: "Check darkness and barcode edges", body: "After the 4×6 boundary prints correctly, confirm barcode bars are dark, sharp and not clipped by the label edge or covered with glossy tape." },
    ],
    faq: [
      { question: "Why is my Zebra 4×6 label cut off?", answer: "The common causes are wrong media size, orientation, printable area, origin offset or roll calibration." },
      { question: "Why is my Zebra label shrunk?", answer: "Fit to Page or a mismatched page size can scale the PDF down before it reaches the printer." },
      { question: "Should I change scale to fix clipping?", answer: "No. Fix media size, orientation, calibration and offset first so the barcode stays at the intended size." },
      { question: "What should I test before live postage?", answer: "Print a blank 4×6 template, measure it, then print one label and inspect barcode quiet zone." },
      { question: "Is this model-specific Zebra advice?", answer: "No. It is broad 4×6 thermal-printer troubleshooting and does not claim official Zebra support." },
    ],
    reviewChecklist: ["Set 4×6 media before editing scale.", "Calibrate roll feed and gap sensing.", "Keep barcode size and quiet zone intact."],
  },
  "shipping-label-pdf-wrong-page-size": {
    faq: [
      { question: "How do I tell what size my shipping label PDF is?", answer: "Open the PDF properties or use the local PDF analyzer before printing. Check whether the page box is 4×6, Letter, A4 or a larger sheet containing a smaller label area." },
      { question: "Should I match the printer paper to the PDF page size?", answer: "Start by matching the printer paper to the PDF page size. If you need a different output size, extract the label area intentionally instead of letting Fit to Page shrink the whole file." },
      { question: "Why does a Letter PDF print tiny on a thermal printer?", answer: "The driver may be fitting the entire Letter page onto one 4×6 label. That shrinks the barcode and address block. Extract the label area or choose the correct label format first." },
      { question: "Can I crop a shipping label PDF?", answer: "Only crop when every barcode, QR code, address, service mark and quiet-zone area stays complete and unscaled. Reprint on the source paper size if the required content will not fit." },
      { question: "What should I test before printing paid postage?", answer: "Print a blank 4×6, Letter or A4 template at 100%, measure it, then print one label and check barcode quiet-zone whitespace before mailing." },
    ],
    reviewChecklist: ["Identify the PDF page box before choosing printer media.", "Avoid fitting a full sheet onto one thermal label.", "Keep every barcode, QR code and quiet zone intact if cropping."],
  },
  "chrome-shipping-label-printing-too-small": {
    faq: [
      { question: "Why does Chrome make my shipping label small?", answer: "Chrome can apply margins, headers, footers or fit-to-page behavior in the browser preview. Expand print settings and confirm paper size, margins and scale before printing." },
      { question: "Should I print labels directly from Chrome?", answer: "Use Chrome only when paper size and scale controls are clear. Otherwise download the PDF and print from a PDF viewer with Actual Size selected." },
      { question: "What Chrome settings should I check first?", answer: "Check destination paper size, margins, scale, headers and footers. For label PDFs, start with 100% / Actual Size and no browser extras." },
      { question: "Why does the Chrome preview look fine but print wrong?", answer: "The preview can hide the printer driver's final paper-size or margin choice. Measure a blank template after changing settings." },
      { question: "Can I fix a Chrome-scaled label by increasing scale?", answer: "Only after paper size and margins are correct. Guessing a larger percentage can crop the barcode or remove quiet-zone whitespace." },
    ],
    reviewChecklist: ["Disable browser headers, footers and extra margins.", "Confirm paper size and 100% scale before printing.", "Download the PDF if Chrome controls are unclear."],
  },
  "mac-preview-shipping-label-too-small": {
    faq: [
      { question: "Why does Mac Preview print my label too small?", answer: "Preview may reuse Scale to Fit, a saved paper preset or the wrong destination paper size. Check paper size first, then set scale to 100%." },
      { question: "Should I use Scale to Fit in Preview?", answer: "No for most shipping labels. Scale to Fit can shrink the barcode. Use 100% after the PDF page size and printer media match." },
      { question: "What Mac print preset should I use for 4×6 labels?", answer: "Use a preset that explicitly sets 4×6 media, portrait orientation and 100% scale. Do not reuse photo, borderless or Letter presets for thermal labels." },
      { question: "How do I know if Preview or the printer caused the shrink?", answer: "Print a blank template from Preview at 100%. If the template is also small, the issue is Preview settings, driver media size or the saved preset." },
      { question: "Can I reprint the same shipping label after fixing Preview?", answer: "Usually yes if the marketplace or carrier still allows access to the PDF. Fix settings first, then reprint the original file." },
    ],
    reviewChecklist: ["Check Preview paper size before scale.", "Use 100% instead of Scale to Fit.", "Clear saved presets that came from photo or sheet printing."],
  },
};

function applyLongTailEnhancement(page: SeoPage): SeoPage {
  const enhancement = longTailEnhancements[page.slug];
  return enhancement ? { ...page, ...enhancement } : page;
}

function enrichSeoPage(page: SeoPage, locale: Locale = defaultLocale): SeoPage {
  const enhancedPage = locale === defaultLocale ? applyLongTailEnhancement(page) : page;

  return {
    ...enhancedPage,
    keywords: enhancedPage.keywords ?? keywordsForPage(enhancedPage),
    updatedAt: enhancedPage.updatedAt ?? seoContentUpdatedAt,
    reviewChecklist: enhancedPage.reviewChecklist ?? reviewChecklists[locale][enhancedPage.kind],
    related: locale === defaultLocale ? mergeRelated(enhancedPage) : enhancedPage.related,
  };
}

const seoPageDrafts: SeoPage[] = [
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
  specificTroublePage(
    "etsy-shipping-label-prints-too-small",
    "Etsy Shipping Label Prints Too Small",
    "An Etsy label usually prints too small when the browser or PDF viewer scales the file, or when a Letter/A4 label is sent to 4×6 stock without matching the page size first. Download the label PDF, choose the right paper, and print at 100% / Actual Size.",
    [
      { heading: "Download the Etsy label PDF first", body: "Avoid printing from a browser preview or screenshot during setup. Download the Etsy shipping label PDF so the print dialog sees the original page size instead of a resized web preview." },
      { heading: "Match the format to the printer", body: "Use 4×6 media for a thermal printer and Letter or A4 for a regular printer. If the file and printer paper do not match, fix that mismatch before trying custom scale percentages." },
      { heading: "Turn off shrinking options", body: "Choose 100% / Actual Size and disable Fit to Page, Shrink Oversized Pages, borderless correction and previous printer presets that can compress the label." },
      { heading: "Check the first print before handoff", body: "Confirm the barcode, tracking number, address block and return address are sharp, complete and not touching a cut edge before dropping off the package." },
    ],
    [
      { question: "Why is my Etsy shipping label tiny?", answer: "The most common causes are browser preview scaling, Fit to Page, wrong paper size, or sending a sheet layout to a 4×6 thermal printer." },
      { question: "Should I change Etsy label size or printer scale first?", answer: "Match the label format and paper size first, then print at Actual Size. Scale changes are only useful after the media size is correct." },
      { question: "Can I reprint the same Etsy label?", answer: "Usually you should fix the print settings and reprint the original PDF if Etsy still allows access to the label." },
      { question: "Is a smaller Etsy label still usable?", answer: "Only if barcode and address content remain sharp, complete and uncompressed. A tiny or cropped barcode should be reprinted." },
    ],
  ),
  specificTroublePage(
    "etsy-4x6-label-on-regular-printer",
    "Print an Etsy 4×6 Shipping Label on a Regular Printer",
    "You can print an Etsy 4×6 label on a regular inkjet or laser printer by keeping the label at Actual Size on Letter or A4 paper. Do not stretch it to fill the sheet, and cut or fold only outside the barcode and address area.",
    [
      { heading: "Keep the 4×6 label actual size", body: "A desktop printer can place a 4×6 label on larger paper. The safe setup is Letter or A4 paper with the Etsy label printed at 100%, not enlarged to fill the page." },
      { heading: "Use a PDF viewer instead of browser print", body: "Open the downloaded PDF in a viewer that exposes paper size and scale controls. Browser print shortcuts can add margins or shrink the label without making that obvious." },
      { heading: "Cut outside scan-critical content", body: "After printing, trim only the blank paper around the label. Do not cut into the barcode quiet zone, tracking number, recipient address, return address or service marks." },
      { heading: "Run one blank-template test", body: "If this is a new printer, print a blank 4×6 template first. If the template is not the right size, fix printer scale before using a paid Etsy label." },
    ],
    [
      { question: "Can I print an Etsy 4×6 label on Letter paper?", answer: "Yes, as long as the label stays actual size and the barcode is not cropped, enlarged, compressed or blurred." },
      { question: "Should the Etsy label fill the whole page?", answer: "No. A 4×6 label should remain 4×6 on the sheet; filling the page changes barcode scale." },
      { question: "Can I fold the extra paper?", answer: "Fold or cut only outside the active label content and never through a barcode, QR code or address block." },
      { question: "What should I test first?", answer: "Print a blank 4×6 template at 100%, measure it, then print the Etsy label with the same scale behavior." },
    ],
  ),
  specificTroublePage(
    "etsy-shipping-label-print-settings",
    "Etsy Shipping Label Print Settings for 4×6, Letter and A4",
    "Choose Etsy shipping label print settings by matching the label PDF, paper size and printer media before using scale controls. Use 100% / Actual Size and check the barcode before drop-off.",
    [],
    [],
  ),
  specificTroublePage(
    "usps-click-n-ship-label-prints-too-small",
    "USPS Click-N-Ship Label Prints Too Small",
    "A USPS Click-N-Ship label that prints too small is usually being fitted to the wrong paper size or scaled by the browser/PDF viewer. Print the downloaded PDF at Actual Size and confirm the tracking barcode remains complete.",
    [
      { heading: "Start from the downloaded USPS PDF", body: "Use the original Click-N-Ship PDF rather than a screenshot. Screenshots can lower resolution and hide the original page size before the file reaches the printer." },
      { heading: "Choose the paper USPS label was built for", body: "If the label is on a Letter sheet, print on Letter at 100%. If you are using 4×6 stock, confirm the label area fits 4×6 without shrinking the whole page." },
      { heading: "Do not scale to make it look centered", body: "A centered preview can still have a compressed barcode. Fix paper size and margins first; avoid Fit to Printable Area unless it preserves the actual label scale." },
      { heading: "Verify USPS scan-critical details", body: "Check the IMpb/tracking barcode, service text, recipient address and return address. Reprint if any code is clipped, blurred, folded or covered by glare." },
    ],
  ),
  specificTroublePage(
    "ups-thermal-label-cut-off",
    "UPS Thermal Label Is Cut Off",
    "A UPS thermal label is usually cut off when the printer media size, orientation, roll alignment or scale setting does not match the label file. Set 4×6 media, print at 100%, and run one blank calibration sheet before reprinting live postage.",
    [
      { heading: "Confirm the UPS file is 4×6", body: "Before blaming the printer, inspect the downloaded label PDF. If the file is a Letter sheet with a label area, sending the whole page to a 4×6 printer can crop or shrink the output." },
      { heading: "Set media size in both places", body: "Thermal printers often have a system driver setting and an app print-dialog setting. Set both to 4×6 inch stock so one layer does not override the other." },
      { heading: "Separate cropping from offset", body: "If one edge is missing but the size is correct, reload the roll, center the guides and recalibrate. Do not shrink the whole UPS label to hide an offset problem." },
      { heading: "Check service and tracking areas", body: "UPS labels include scan and service blocks that must remain readable and flat. Reprint if the barcode or routing text is clipped." },
    ],
  ),
  specificTroublePage(
    "fedex-shipping-label-prints-sideways",
    "FedEx Shipping Label Prints Sideways",
    "A FedEx shipping label prints sideways when orientation, auto-rotate, media size or source layout is mismatched. Keep the label at Actual Size, match the paper, and turn off automatic rotation that sends a portrait label across the roll.",
    [
      { heading: "Identify whether the source is sheet or 4×6", body: "Open the FedEx label PDF and confirm the page size. A Letter page sent to a thermal roll can rotate or shrink unless the 4×6 label area is extracted correctly." },
      { heading: "Control orientation explicitly", body: "Choose portrait for standard 4×6 label output and disable auto-rotate if it turns the label sideways. If the preview changes orientation after choosing the printer, recheck media size." },
      { heading: "Use Actual Size after matching paper", body: "Once the printer media and PDF layout match, use 100% / Actual Size. Do not use Fit to Page to compensate for a sideways preview." },
      { heading: "Print one test before drop-off", body: "Confirm tracking barcode, service text and address blocks are upright, sharp and complete before attaching the FedEx label." },
    ],
  ),
  specificTroublePage(
    "canada-post-4x6-thermal-label",
    "Canada Post 4×6 Thermal Label Setup",
    "For Canada Post 4×6 thermal labels, the safest setup is a true 4×6 label file, a 4×6 printer media setting, and 100% / Actual Size output. If the source is a full sheet, extract the label area instead of shrinking the entire page.",
    [
      { heading: "Check whether the label is already 4×6", body: "Before printing to a thermal roll, inspect the PDF page size. A full Letter page can make the label print tiny if the driver fits the whole sheet onto one sticker." },
      { heading: "Use a 4×6 media preset", body: "Set the printer driver to 4×6 inches, portrait orientation and no automatic scaling. Save the preset only after a measured test print is correct." },
      { heading: "Watch customs and barcode blocks", body: "Canada Post and cross-border labels may include several scan or customs areas. Do not crop, fold or tape over any active code or service text." },
      { heading: "Run a blank calibration first", body: "Use a blank template to confirm the printer feeds one label at the right size before sending the live label PDF." },
    ],
  ),
  specificTroublePage(
    "australia-post-label-prints-too-small",
    "Australia Post Label Prints Too Small",
    "An Australia Post label usually prints too small when a browser preview, PDF viewer, or printer driver fits the page to the wrong paper. Print the PDF at 100% / Actual Size on the paper format the label was created for.",
    [
      { heading: "Use the PDF, not a screenshot", body: "Screenshots and mobile share sheets can hide the original page dimensions. Download or open the original label PDF when possible so scale controls remain available." },
      { heading: "Match A4, Letter or 4×6 intentionally", body: "Use A4 or Letter for sheet output, or 4×6 only when the label area fits the roll without shrinking required codes. Do not send a full sheet page directly to a thermal roll." },
      { heading: "Disable automatic fit behavior", body: "Choose Actual Size or 100%. Auto-fit can make a label look tidy on the page while compressing barcode or QR-code areas." },
      { heading: "Check all code areas", body: "Before mailing, inspect barcodes, QR codes, address text and service marks. Reprint if the code is small, clipped, faded or too close to an edge." },
    ],
  ),
  specificTroublePage(
    "royal-mail-a4-label-to-4x6-thermal",
    "Royal Mail A4 Label to 4×6 Thermal Printer",
    "To print a Royal Mail A4 label on a 4×6 thermal printer, identify and extract the label area without shrinking the barcode or QR code. Do not fit the entire A4 sheet onto one 4×6 sticker.",
    [
      { heading: "Do not shrink the whole A4 page", body: "A full A4 page fitted to 4×6 stock makes the label and codes too small. The safe workflow is to isolate the actual label block while preserving its scale." },
      { heading: "Check whether the label area fits", body: "Some Royal Mail labels, QR codes or customs details may not fit cleanly on one 4×6 label. If extraction would crop required content, print the original A4 sheet instead." },
      { heading: "Set the thermal printer after extraction", body: "Once the label area is prepared, choose 4×6 media, portrait orientation and 100% scale. Run one blank template if the printer is new or recently recalibrated." },
      { heading: "Review QR and barcode whitespace", body: "Keep quiet-zone whitespace around every code. Cropping close to a QR code or barcode is risky even when the address still looks readable." },
    ],
  ),
  specificTroublePage(
    "brother-ql-shipping-label-too-small",
    "Brother QL Shipping Label Prints Too Small",
    "A Brother QL shipping label can print too small when the roll size, driver preset, source PDF, or auto-fit option does not match the label. Confirm the roll width and page size before changing scale.",
    [
      { heading: "Confirm the Brother QL roll and label area", body: "Brother QL models may use different roll widths. Make sure the source label area can fit the loaded roll and is not a full sheet being squeezed onto a narrow label." },
      { heading: "Select the exact media preset", body: "Choose the installed Brother QL media size in the system driver and print dialog. A generic label or previous preset can silently resize the PDF." },
      { heading: "Avoid enlarging a tiny output blindly", body: "If the output is too small, identify whether the driver is scaling a full page, using the wrong roll size, or inheriting Fit to Page before increasing percentages." },
      { heading: "Inspect barcode density and edges", body: "After size is correct, check barcode darkness, quiet zone and whether the label edge clips content on the narrow side." },
    ],
  ),
  specificTroublePage(
    "munbyn-thermal-label-too-small",
    "MUNBYN Thermal Label Prints Too Small",
    "A MUNBYN thermal label usually prints too small when the driver media size is not 4×6, the PDF is a sheet layout, or Fit to Page is enabled. Set 4×6 media, use Actual Size, and calibrate the roll before reprinting.",
    [
      { heading: "Set the driver to 4×6 stock", body: "Confirm the system printer settings and print dialog both use 4×6 inch media. If either layer uses Letter, A4 or a generic label, the output can shrink or crop." },
      { heading: "Check the source PDF page size", body: "A Letter/A4 PDF may contain the shipping label on a larger page. Do not fit that entire page onto one thermal label; extract the label area if needed." },
      { heading: "Run printer calibration", body: "If size is right but feeding or position is wrong, recalibrate the label gap and reload the roll before changing marketplace label settings." },
      { heading: "Measure before live batches", body: "Print a blank template and one live label, then measure the boundary and inspect the barcode before printing a batch." },
    ],
  ),
  specificTroublePage(
    "mac-preview-shipping-label-too-small",
    "Shipping Label Prints Too Small from Mac Preview",
    "When a shipping label prints too small from Mac Preview, the usual cause is Scale to Fit, wrong paper size, or a saved printer preset. Choose the correct paper and print at 100% scale before changing the label file.",
    [
      { heading: "Check paper size before scale", body: "In Preview, make sure the selected paper matches the label workflow: 4×6 for thermal stock, or Letter/A4 for sheet output. A mismatched paper choice can trigger automatic fitting." },
      { heading: "Use 100% instead of Scale to Fit", body: "Disable Scale to Fit and print at 100% after paper size is correct. Fit options can shrink barcodes even when the page preview looks centered." },
      { heading: "Clear bad presets", body: "Mac print dialogs can remember previous media and scaling choices. Check the preset dropdown so a photo, borderless or sheet-print preset is not being reused for labels." },
      { heading: "Use the ruler test", body: "Print a blank 4×6 template and measure it. If the template is wrong from Preview, fix the print dialog before reprinting postage." },
    ],
  ),
  specificTroublePage(
    "chrome-shipping-label-printing-too-small",
    "Shipping Label Printing Too Small from Chrome",
    "Chrome can print shipping labels too small when the browser preview applies Fit to Page, margins, headers/footers, or the wrong destination paper size. Download the PDF and print at Actual Size when the browser controls are unclear.",
    [
      { heading: "Watch Chrome's preview scaling", body: "Chrome preview may show a neat page while applying scale or margin changes. Expand the advanced settings and confirm paper size, margins and scale before printing." },
      { heading: "Turn off browser extras", body: "Disable headers, footers and default margins for label PDFs. These extras can reduce the printable area and force the label to shrink." },
      { heading: "Download and use a PDF viewer if needed", body: "If Chrome does not expose reliable paper controls for your printer, download the label PDF and print from a PDF viewer where Actual Size is explicit." },
      { heading: "Confirm barcode size after printing", body: "Measure the printed label and inspect the barcode quiet zone. Reprint if the label is smaller than intended or the barcode is compressed." },
    ],
  ),
  specificTroublePage(
    "shipping-label-pdf-wrong-page-size",
    "Shipping Label PDF Has the Wrong Page Size",
    "A shipping label PDF can appear to have the wrong page size when the marketplace, carrier, browser, or printer driver is mixing Letter, A4 and 4×6 formats. Identify the PDF page box first, then match paper and scale to that source layout.",
    [
      { heading: "Read the PDF page size first", body: "Use a PDF viewer properties panel or the local PDF analyzer to see whether the source page is Letter, A4, 4×6 or another size before choosing printer settings." },
      { heading: "Separate source layout from printer media", body: "The PDF page size describes the file; the printer media describes the paper or roll. Problems happen when a full-sheet file is sent to a 4×6 printer or a 4×6 file is auto-fit to a sheet." },
      { heading: "Do not crop required content", body: "If you extract a label area from a larger PDF, keep every barcode, QR code, service mark, address and quiet-zone whitespace intact." },
      { heading: "Validate with a blank template", body: "After choosing the output size, print a blank template at 100% and measure it before printing a paid label." },
    ],
  ),
  specificTroublePage(
    "thermal-printer-feeds-extra-blank-labels",
    "Thermal Printer Feeds Extra Blank Labels After Printing",
    "A thermal printer that feeds extra blank labels usually has a gap-sensor, calibration, media-size, or roll-loading problem. Recalibrate the printer and confirm 4×6 media before sending another live shipping label.",
    [
      { heading: "Recalibrate label gap detection", body: "Thermal printers need to detect the space between stickers. Run the printer's calibration or feed routine after loading a new roll, changing label stock or seeing repeated blank-label advance." },
      { heading: "Match media size to the roll", body: "Set the driver and print dialog to the actual loaded label size. If the printer expects a different length, it can advance into the next blank label after each job." },
      { heading: "Check roll loading and guides", body: "Center the roll, align the guides and make sure labels feed straight. A skewed roll can make the sensor miss gaps even when the PDF is correct." },
      { heading: "Use a blank template before postage", body: "Print a calibration or blank 4×6 template first. If the blank template feeds extra labels, fix printer hardware/settings before printing live postage." },
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

export const seoPages: SeoPage[] = seoPageDrafts.map((page) => enrichSeoPage(page));

const localizedSeoPages: Partial<Record<Locale, SeoPage[]>> = {
  es: seoPagesEs.map((page) => enrichSeoPage(page, "es")),
  zh: seoPagesZh.map((page) => enrichSeoPage(page, "zh")),
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
