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

export interface ContentSource {
  label: string;
  url: string;
  checkedAt: string;
  supports: string;
}

export interface SeoPage {
  slug: string;
  kind: SeoPageKind;
  title: string;
  seoTitle?: string;
  description: string;
  h1: string;
  quickAnswer: string;
  keywords?: string[];
  updatedAt?: string;
  evidenceNote?: string;
  reviewChecklist?: string[];
  sources?: ContentSource[];
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
    title: `${name} Shipping Label Size Guide`,
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
    title: `${name} Shipping Label Size Guide`,
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
  const content = label === "4×6" ? {
    quickAnswer: "Use this blank 4 × 6 inch file to test a thermal roll or matching 4×6 sheet before printing postage. Print at 100% / Actual Size, measure both edges, and stop if the PDF page, driver media and loaded stock do not all agree on 4×6.",
    sections: [
      { heading: "Use this test for a 4×6 media path", body: "This template isolates the path used by common thermal shipping-label printers and by sheet media cut to 4×6. Run it after changing a roll, printer, driver, computer or PDF viewer. It does not prove that a carrier barcode will be accepted; it only tests physical page size, feed and alignment." },
      { heading: "Make all three size settings agree", body: "Confirm that the source PDF page is 4 × 6 inches, the operating-system or printer driver is set to 4×6, and the loaded media is actually 4×6. Print at 100% / Actual Size with browser headers, footers and Fit disabled. Do not use a custom percentage to compensate for the wrong driver media." },
      { heading: "Read the shape of the failed test", body: "A uniformly small or large border points to scaling. The same missing edge on every label points to media width, guides or print origin. A boundary that moves between labels points to feed or sensing. Faint bars or streaks are print-quality symptoms, not page-size evidence." },
      { heading: "Pass before printing live postage", body: "Measure a complete 4 × 6 inch boundary and confirm that it repeats on a second blank test. If the edge is clipped or the feed changes, follow the exact printer model's media-loading and calibration instructions. The blank file has no address, tracking number or paid postage." },
    ],
    faq: [
      { question: "Is the blank 4×6 PDF a shipping label?", answer: "No. It contains no address, tracking barcode or postage; it is a physical calibration fixture." },
      { question: "What should match before I print?", answer: "The PDF page, driver media setting and loaded stock should all be 4 × 6 inches." },
      { question: "Why is every test uniformly too small?", answer: "A Fit or scale setting, or a driver/page-size mismatch, is more likely than roll alignment. Restore matching sizes and Actual Size first." },
      { question: "Why does the missing edge move between labels?", answer: "Variable placement points to roll guides, feed or media sensing. Use the exact printer model's loading and calibration procedure." },
      { question: "When can I reprint paid postage?", answer: "Only after a measured blank test repeats at the intended boundary without clipping. Then reprint the original label through the issuer's allowed workflow." },
    ],
    reviewChecklist: ["Confirm source PDF, driver and media all say 4×6.", "Measure both physical edges at Actual Size.", "Require a repeatable blank test before reprinting postage."],
  } : label === "A4" ? {
    quickAnswer: "Use this 210 × 297 mm blank page to test an A4 sheet-printing path. Select A4 paper and 100% / Actual Size, check orientation and the printer's non-printable margins, and do not convert a workflow-required A4 document into a 4×6 label just to fill different media.",
    sections: [
      { heading: "Use A4 only for an A4 source workflow", body: "This template checks a desktop inkjet or laser path that is supposed to output an A4 page. It is useful after changing paper trays, printer defaults or PDF viewers. A true 4×6 source may be placed unchanged on a larger sheet, but stretching it to fill A4 changes its geometry." },
      { heading: "Set the sheet contract", body: "Load A4 paper, choose A4 in the driver and print the A4 PDF at 100% / Actual Size in the intended orientation. Disable browser headers and footers. Do not choose Letter merely because it looks similar: Letter and A4 have different dimensions and printable areas." },
      { heading: "Separate printable margins from scale", body: "If the measured page is proportionally wrong, inspect scaling. If only an outer edge is absent while interior measurements remain correct, the printer's non-printable margin is the likely boundary. Prefer the issuer's A4 layout or a printer-supported margin path instead of shrinking scan-critical content without evidence." },
      { heading: "Protect multi-document pages", body: "An issued A4 file may contain more than one label, customs material or other required shipment content. Inspect every page before extracting anything. This blank template cannot decide document meaning and never authorizes cropping or discarding adjacent content." },
    ],
    faq: [
      { question: "What size is A4?", answer: "A4 is 210 × 297 mm. The PDF page, driver selection and loaded sheet should agree on that size." },
      { question: "Can I select Letter instead?", answer: "Not for a size test. Letter and A4 differ, so substituting one can create clipping or unexpected whitespace." },
      { question: "Should an A4 page be printed with Fit?", answer: "Start with 100% / Actual Size on matching A4 paper. Fit changes the page geometry and can hide a source-to-media mismatch." },
      { question: "Can I crop an A4 shipping document to 4×6?", answer: "Only when the issuing workflow identifies a complete standalone label and permits that path. Stop if the page contains required adjacent content or its meaning is uncertain." },
      { question: "What does a clipped outer border prove?", answer: "It can reveal the printer's non-printable area, but it does not by itself prove that the live label should be scaled. Check the source workflow and printer documentation." },
    ],
    reviewChecklist: ["Confirm the source, driver and loaded sheet are A4.", "Check every page for required adjacent content.", "Separate non-printable margins from true scale error."],
  } : {
    quickAnswer: "Use this 8.5 × 11 inch blank page to test a US Letter sheet-printing path. Select Letter paper and 100% / Actual Size, verify orientation and printable margins, and keep any smaller label area at its source dimensions instead of enlarging it to fill the sheet.",
    sections: [
      { heading: "Use Letter for a Letter source or sheet workflow", body: "This template tests an inkjet or laser printer loaded with 8.5 × 11 inch paper. Run it after a tray, driver or viewer change. A standalone 4×6 label can sit on Letter paper at its original size; it should not be enlarged simply to use more of the sheet." },
      { heading: "Match the PDF, driver and tray", body: "Choose Letter in the printer driver and print the Letter PDF at 100% / Actual Size in the intended orientation. Disable browser headers, footers and Fit. Do not silently substitute A4: the two sheet formats have different height, width and margin behavior." },
      { heading: "Diagnose clipping without shrinking the barcode", body: "A proportional size error points to scaling. A missing sheet edge with correct interior measurements points to the device's printable area or orientation. Use a workflow-native Letter layout or correct paper selection before shrinking a complete carrier label." },
      { heading: "Keep issued content intact", body: "Before cutting or extracting a label from a live Letter PDF, inspect every page and identify the document type. Packing slips, customs forms or multiple unique labels may be required. The blank test confirms the sheet path only; it cannot authorize removing issued content." },
    ],
    faq: [
      { question: "What size is US Letter?", answer: "US Letter is 8.5 × 11 inches. Match that size in the PDF, printer driver and loaded tray for this test." },
      { question: "Is Letter the same as A4?", answer: "No. Their dimensions differ, so swapping them can change margins or clip an edge." },
      { question: "Should a 4×6 label fill the Letter sheet?", answer: "No. Keep a true 4×6 label at 4 × 6 inches and use the extra sheet area as whitespace unless the issuer provides a different native layout." },
      { question: "Why is only the outside border clipped?", answer: "The selected orientation or the printer's non-printable area may be responsible. Confirm those before changing the scale of the label content." },
      { question: "When should I stop?", answer: "Stop if the source size is unclear, required adjacent documents would be removed, or the measured blank page still does not match the selected Letter path." },
    ],
    reviewChecklist: ["Confirm the PDF, driver and tray are Letter.", "Keep a true 4×6 label at its original size on the sheet.", "Inspect every live page before extracting or cutting content."],
  };

  return {
    slug,
    kind: "template",
    title: `${label} Shipping Label Template Download`,
    description: `Download a blank ${label} shipping label template and check print scale before printing carrier labels.`,
    h1: `${label} Shipping Label Template`,
    updatedAt: "2026-08-29",
    evidenceNote: "This blank-file workflow verifies physical page size, feed and printable boundaries. It does not verify a carrier barcode, authorize document conversion or guarantee carrier acceptance.",
    ...content,
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
      { title: "The PDF page is larger than the roll", symptom: "A full Letter or A4 page is being fitted onto one 4×6 thermal label.", action: "Inspect the PDF page box. Get the issuer's 4×6 format or extract only a complete label area; do not enlarge the miniature output.", href: "/tools/pdf-analyzer", cta: "Inspect the PDF page" },
      { title: "The whole boundary is uniformly small", symptom: "A true 4×6 source prints proportionally smaller on matching 4×6 media.", action: "Confirm 4×6 in the driver, disable Fit, print one blank template, then calculate a correction only if the media path already matches.", href: "/tools/scale-calculator", cta: "Measure the scale error" },
      { title: "Only the bars or text look weak", symptom: "The label boundary is correct, but fine lines are fuzzy, gray or broken.", action: "Treat this as print quality, not page scale. Test density, speed, media and printhead condition before another live label.", href: "/tools/test-print-pack", cta: "Run a print-quality test" },
    ],
    "shipping-label-cut-off-when-printing": [
      { title: "The edge is missing in the PDF", symptom: "The downloaded file is already incomplete before it reaches the print dialog.", action: "Stop. Return to the issuing order or shipment workflow and regenerate the document; printer scaling cannot restore missing source content.", href: "/tools/pdf-analyzer", cta: "Inspect the source PDF" },
      { title: "The same thermal edge is clipped", symptom: "The PDF is complete, but every roll label loses the same side.", action: "Match driver media, reload the guides and calibrate the printer. Do not shrink the whole barcode to hide an origin or feed error.", href: "/tools/calibration-sheet", cta: "Test thermal alignment" },
      { title: "A sheet edge is clipped", symptom: "Letter or A4 output reaches the printer's non-printable area.", action: "Use the source's matching sheet size and orientation. Print a blank page boundary before deciding whether a workflow-native sheet layout is required.", href: "/letter-shipping-label-template", cta: "Test the sheet boundary" },
    ],
    "shipping-label-barcode-not-scanning": [
      { title: "The label was resized or cropped", symptom: "The printed boundary differs from the source, or barcode whitespace disappeared.", action: "Fix page size and scale first. A scan test is not meaningful evidence while the whole symbol has been changed.", href: "/tools/scale-calculator", cta: "Verify physical scale" },
      { title: "Bars are faint, broken or spread", symptom: "The boundary is correct, but thermal streaks or ink bleed change the bars.", action: "Run a print-quality test. For thermal printers check media, density, speed and printhead condition; for inkjet or laser printers use clean, high-contrast output.", href: "/tools/test-print-pack", cta: "Test print quality" },
      { title: "The printed code looks clean", symptom: "The barcode still touches an edge, fold, tape or nearby print, or only a phone app says it scans.", action: "Check clear surrounding space and flat placement. Reprint damaged output and ask the issuer or carrier when acceptance remains uncertain.", href: "/tools/barcode-quiet-zone-checker", cta: "Review surrounding space" },
    ],
    "shipping-label-not-centered": [
      { title: "The PDF itself is off-center", symptom: "The page box or label artwork is already shifted in the downloaded file.", action: "Return to the issuer's matching format or extract a complete label intentionally. Do not add a printer offset to compensate for a bad source.", href: "/tools/pdf-analyzer", cta: "Inspect the PDF box" },
      { title: "Every thermal label has one offset", symptom: "A matching 4×6 template and live label start at the same wrong position.", action: "Reload the roll, center the guides, calibrate media sensing and only then use a documented horizontal or vertical offset for your model.", href: "/tools/calibration-sheet", cta: "Measure the offset" },
      { title: "Only sheet placement looks uneven", symptom: "The complete label is actual size on Letter or A4 but is not visually centered.", action: "Do not move or scale scan-critical content merely for symmetry. Verify that the whole label fits the printable area; reprint only if content is clipped or rotated.", href: "/letter-shipping-label-template", cta: "Check sheet fit" },
    ],
    "fit-to-page-vs-actual-size-shipping-label": [
      { title: "Source and media already match", symptom: "The PDF page and loaded paper are both 4×6, Letter or A4.", action: "Use Actual Size / 100% and verify one measured test. Adobe defines Actual Size as printing without scaling.", href: "/tools/scale-calculator", cta: "Measure the result" },
      { title: "The source is larger than the media", symptom: "A Letter or A4 page is being sent to one 4×6 roll label.", action: "Do not use Fit to miniaturize the full page. Get the correct format or extract one complete label area when the document structure permits it.", href: "/tools/pdf-analyzer", cta: "Inspect before converting" },
      { title: "Actual Size would clip the page", symptom: "The source page does not fit the selected sheet or the printer's printable area.", action: "Choose matching paper or regenerate the correct layout. Adobe notes that Actual Size can crop pages that do not fit; that is a stop signal, not a reason to guess.", href: "/tools/test-print-pack", cta: "Test the matched layout" },
    ],
    "amazon-shipping-label-too-small-blurry": [
      { title: "Identify the Amazon document", symptom: "The file may be an FBM Buy Shipping carrier label, an FBA box ID label, or an FBA product barcode.", action: "Return to the same Amazon workflow and confirm the document type before changing size. These labels are not interchangeable.", href: "/tools/pdf-analyzer", cta: "Inspect the PDF page" },
      { title: "Source is sharp; print is small", symptom: "The original PDF is complete, but the physical boundary is uniformly reduced.", action: "Match the source page to thermal or sheet media and use Actual Size. For FBA box labels, prefer the paper option offered in Send to Amazon.", href: "/tools/scale-calculator", cta: "Measure Amazon output" },
      { title: "Boundary is right; barcode is blurry", symptom: "The label fits, but bars or fine text are gray, streaked or broken.", action: "Run one printer-quality test. Reprint from the original Amazon PDF after correcting density, speed, media or printhead condition; never sharpen a screenshot.", href: "/tools/test-print-pack", cta: "Test print quality" },
    ],
    "amazon-4x6-label-on-a4-or-letter": [
      { title: "The source is one true 4×6 label", symptom: "PDF properties show a single 4×6 page with all required content inside it.", action: "Place that page unchanged on A4 or Letter at Actual Size. Extra sheet paper is acceptable for testing; filling the sheet is not the goal.", href: "/tools/pdf-analyzer", cta: "Confirm true 4×6" },
      { title: "Amazon offers a sheet format", symptom: "The Send to Amazon print step offers Letter or another workflow-native paper choice.", action: "Regenerate the label in that sheet format instead of converting a thermal file after download.", href: "/letter-shipping-label-template", cta: "Test Letter output" },
      { title: "The page contains required extras", symptom: "The A4/Letter file contains multiple unique labels, an SSCC label, customs material or other shipment documents.", action: "Stop. Keep the issued sheet workflow and every required page; do not crop the document down merely to make a 4×6 print.", href: "/tools/test-print-pack", cta: "Verify the sheet path" },
    ],
    "amazon-fba-label-wrong-paper-size": [
      { title: "It is an FBA box ID label", symptom: "The label identifies a specific inbound carton in Send to Amazon.", action: "Use the paper option offered in the same shipment workflow and reprint that box's unique label. Do not copy or reuse it on another box.", href: "/tools/pdf-analyzer", cta: "Check the box-label PDF" },
      { title: "It is the carrier label", symptom: "The label routes the carton with UPS, FedEx or another small-parcel carrier.", action: "Keep it paired with the correct FBA box ID label. Return to the partnered-carrier or carrier workflow if it was resized, cropped or damaged.", href: "/shipping-label-preflight-checklist", cta: "Run the handoff check" },
      { title: "It is a product barcode", symptom: "The small label belongs on an individual FBA unit and includes an Amazon barcode such as an FNSKU.", action: "Use Amazon's product-label workflow and requirements. A 4×6 carton-label fix does not apply to unit labels.", href: "/shipping-label-barcode-not-scanning", cta: "Review barcode quality" },
    ],
    "amazon-a4-label-to-4x6-thermal": [
      { title: "Send to Amazon offers 4×6", symptom: "The FBA box-label step provides both Letter and 4×6 thermal paper choices.", action: "Regenerate the unique box label with the 4×6 option in that workflow; do not rescale the downloaded A4/Letter PDF.", href: "/tools/pdf-analyzer", cta: "Confirm the regenerated page" },
      { title: "The file is an AWD A4 SSCC label", symptom: "The carton is going to Amazon Warehousing and Distribution and the workflow issued an A4 SSCC label.", action: "Stop. Amazon's AWD guidance identifies A4 SSCC box labels for this workflow; keep A4 and do not convert it to thermal 4×6.", href: "/a4-shipping-label-template", cta: "Test A4 printing" },
      { title: "No native 4×6 option appears", symptom: "The current marketplace, shipment type or carrier flow exposes only a sheet document.", action: "Use the offered sheet size or ask Amazon support. Do not discard adjacent documents or guess a crop boundary that Amazon has not identified.", href: "/tools/test-print-pack", cta: "Validate the sheet setup" },
    ],
  };
  const pageSpecificIntro: Partial<Record<string, Omit<NonNullable<SeoPage["decisionTree"]>, "steps">>> = {
    "shipping-label-printing-too-small": { headline: "Separate page-size shrink from print-quality blur", intro: "Measure the page boundary first, then follow the branch that matches the source PDF, physical media and printed symptom.", firstAction: "Do not enlarge the label until you know whether the source page is 4×6, Letter or A4." },
    "shipping-label-cut-off-when-printing": { headline: "Find where the edge disappeared", intro: "Compare the original PDF with the physical output before changing scale; a source crop and a printer crop require different fixes.", firstAction: "Stop using the print if any barcode, address, service or routing content is missing." },
    "shipping-label-barcode-not-scanning": { headline: "Check geometry before print quality", intro: "A barcode can fail because the whole page changed, the bars printed badly, or the surrounding space and placement were damaged.", firstAction: "A phone scan is a diagnostic clue, not carrier acceptance or standards verification." },
    "shipping-label-not-centered": { headline: "Decide whether centering is cosmetic or destructive", intro: "Trace the offset to the source PDF, a thermal feed path or a sheet printer's printable area before moving content.", firstAction: "Do not shrink a complete label merely to make its whitespace look symmetrical." },
    "fit-to-page-vs-actual-size-shipping-label": { headline: "Choose scale from the source-to-media relationship", intro: "Actual Size preserves dimensions; Fit changes them. Neither setting repairs a source page that does not belong on the selected media.", firstAction: "Read the PDF page size and confirm the loaded media before choosing either option." },
    "amazon-shipping-label-too-small-blurry": { headline: "Identify the Amazon workflow before fixing the print", intro: "Merchant-fulfilled carrier labels, FBA carton labels and unit barcodes have different source workflows and stop conditions.", firstAction: "Keep the original PDF and confirm which Amazon document you printed." },
    "amazon-4x6-label-on-a4-or-letter": { headline: "Prove the source is a standalone 4×6 label", intro: "A single 4×6 page can sit unchanged on a larger sheet; a multi-document or workflow-required sheet must stay intact.", firstAction: "Inspect the PDF page count, page size and required adjacent content before printing." },
    "amazon-fba-label-wrong-paper-size": { headline: "Classify the FBA label before deciding to reprint", intro: "A carton ID, carrier label and product barcode solve different handoff tasks and cannot share one paper-size rule.", firstAction: "Do not hand off or relabel units until you know which identifier the print contains." },
    "amazon-a4-label-to-4x6-thermal": { headline: "Regenerate when Amazon offers 4×6; stop when it does not", intro: "Workflow-native output preserves unique identifiers and required documents better than resizing an issued A4 page.", firstAction: "Check the shipment type—standard FBA, FBM Buy Shipping or AWD—before any conversion." },
  };

  return { ...shared, ...pageSpecificIntro[slug], steps: trees[slug] ?? trees["shipping-label-printing-too-small"] };
}

function troublePage(slug: string, symptom: string, fix: string): SeoPage {
  const tree = troubleshootingTree(slug);

  return {
    slug,
    kind: "troubleshooter",
    title: symptom,
    description: `Fix ${symptom.toLowerCase()}. Check scale, paper size, margins, orientation and barcode whitespace before reprinting.`,
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
    description: `Fix ${symptom.toLowerCase()}. Check paper size, print scale, orientation and printer setup before reprinting.`,
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

const longTailEnhancements: Record<string, Partial<Pick<SeoPage, "title" | "description" | "h1" | "quickAnswer" | "updatedAt" | "evidenceNote" | "decisionTree" | "sections" | "faq" | "reviewChecklist" | "sources">>> = {
  "shipping-label-printing-too-small": {
    description: "Diagnose a shipping label that prints too small by separating full-sheet shrink, true 4×6 scale errors and weak output on thermal or desktop printers.",
    quickAnswer: "First determine whether a full Letter/A4 page was squeezed onto 4 × 6 media, a true 4×6 page was uniformly scaled down, or only the print quality is weak. Match the source page, driver media and physical paper before using a custom scale, then reprint from the unchanged original PDF only after a blank test passes.",
    updatedAt: "2026-08-29",
    evidenceNote: "General troubleshooting framework: Adobe documents what Fit and Actual Size do, while Zebra documents thermal-media calibration. These sources support the diagnostic branches, not carrier acceptance or every printer model.",
    sections: [
      { heading: "1. Decide whether the page or only the label is small", body: "Read the PDF page box before touching scale. A Letter or A4 page fitted onto a 4×6 roll makes every element miniature; a true 4×6 page that prints at 3.8×5.7 inches points to a driver or scaling change. If the physical boundary is correct but thin bars look weak, move to print-quality checks instead of enlarging the page." },
      { heading: "2. Use the thermal-printer branch", body: "For a standalone 4×6 source, set the operating-system driver and print dialog to the loaded 4×6 media. Disable Fit and print a blank 4×6 template. If the template is also small, review the driver media and the printer's model-specific calibration procedure before applying a custom percentage." },
      { heading: "3. Use the inkjet or laser branch", body: "On Letter or A4 paper, keep a true 4×6 label at its intended dimensions rather than stretching it to fill the sheet. When the source is already a sheet layout, select that exact sheet size. Adobe defines Fit as resizing a page to the printable area and Actual Size as no scaling, so preview appearance alone is not proof of physical size." },
      { heading: "4. Stop before a live reprint", body: "Do not use the small output when the barcode, surrounding white space, address, tracking number or service text changed. Keep the original transaction and PDF, pass one measured blank test, then use the issuer's current reprint path if it remains available. Do not buy duplicate postage merely to diagnose printer settings." },
    ],
    faq: [
      { question: "Why did a Letter PDF become tiny on my thermal printer?", answer: "The print path likely fitted the entire Letter page onto one 4×6 label. Obtain the issuer's 4×6 format or extract one complete label area only when the document structure allows it." },
      { question: "Should I increase scale above 100%?", answer: "Only after the PDF page, driver media and physical paper match and a measured blank test still shows a uniform error. Guessing a larger value can crop another edge." },
      { question: "What is different on an inkjet or laser printer?", answer: "A 4×6 label may sit unchanged on Letter or A4 paper. Select the physical sheet size and preserve the label boundary instead of filling the page." },
      { question: "What is different on a thermal printer?", answer: "The source page and driver should match the roll, and the printer may need model-specific media calibration. A full sheet should not be fitted onto one roll label." },
      { question: "When should I stop and reprint?", answer: "Stop when any scan-critical content changed or the blank test is still wrong. Reprint the original label only after the corrected setup passes." },
    ],
    reviewChecklist: ["Identify the source PDF page size before changing scale.", "Use the thermal or sheet-printer branch that matches the loaded media.", "Require one measured blank test before reprinting a live label."],
    sources: [
      { label: "Adobe Acrobat page sizing for printing", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe defines Fit, Actual Size, Shrink Oversized Pages and custom scaling behavior." },
      { label: "Zebra SmartCal media calibration", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documents how a representative thermal printer measures label media and sensing parameters." },
    ],
  },
  "shipping-label-cut-off-when-printing": {
    description: "Find whether a shipping label was cropped in the source PDF, thermal feed path or Letter/A4 printable area, then set a safe reprint gate.",
    quickAnswer: "Compare the original PDF with the print. If the edge is already missing in the file, regenerate it in the issuing workflow. If only the paper output is clipped, follow the thermal roll or desktop sheet branch; never shrink the whole label merely to expose a missing barcode edge.",
    updatedAt: "2026-08-29",
    evidenceNote: "General troubleshooting framework: Adobe supports the PDF sizing behavior and Zebra supports the thermal calibration branch. Printer-specific buttons, offsets and printable areas still come from the exact model manual.",
    sections: [
      { heading: "1. Locate the first missing edge", body: "Open the untouched PDF and inspect every page before printing. If the barcode, address or service mark is absent there, stop and return to the issuer; no print setting can reconstruct source content. If the PDF is complete, record the selected paper, scale, orientation and which physical edge is clipped." },
      { heading: "2. Diagnose a thermal one-edge crop", body: "When every 4×6 label loses the same edge, confirm the driver media, reload and center the guides, and run the printer's documented media calibration. When the crop moves over successive labels, investigate feed sensing or loose media rather than changing PDF scale." },
      { heading: "3. Diagnose a Letter or A4 edge crop", body: "A desktop printer may have a non-printable margin. Adobe notes that Actual Size does not scale and can crop a page that does not fit the selected paper. Use the source's matching sheet size and orientation, or regenerate a workflow-native sheet layout; Fit can hide the margin problem by shrinking everything." },
      { heading: "4. Define the reprint gate", body: "A blank template using the same viewer, driver and media must print completely before another paid label. Reprint from the original PDF when any barcode, quiet-zone space, tracking number, address, service text or routing mark was clipped. Escalate to the issuer when the source remains incomplete." },
    ],
    faq: [
      { question: "How do I know whether the PDF or printer cropped the label?", answer: "If the original PDF is missing the edge, regenerate it. If the PDF is complete but a blank template and live label lose the same edge, the printer path is responsible." },
      { question: "Why is the same thermal edge always missing?", answer: "A fixed edge suggests media size, roll guides, printable origin or calibration. Follow the exact printer manual before using offsets." },
      { question: "Why does the cropped edge move between labels?", answer: "Changing edges point more strongly to feed sensing, roll drift or loose guides than to one static PDF crop." },
      { question: "Will Fit to Page solve a sheet-printer crop?", answer: "It can reveal the edge by resizing the whole page, but that also changes the barcode. Prefer matching paper or a correct source layout." },
      { question: "When must I stop?", answer: "Stop whenever active content is missing, a template still crops, or the source PDF is incomplete. Reprint only after the responsible path is corrected." },
    ],
    reviewChecklist: ["Verify the edge exists in the original PDF.", "Use fixed-versus-moving crop patterns to choose the printer branch.", "Pass a complete blank-template print before reprinting postage."],
    sources: [
      { label: "Adobe Acrobat page sizing for printing", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe states that Actual Size prints without scaling and crops pages or selections that do not fit." },
      { label: "Zebra SmartCal media calibration", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documents media sensing and calibration for representative gap, mark and continuous thermal media." },
    ],
  },
  "shipping-label-barcode-not-scanning": {
    description: "Troubleshoot a shipping label barcode that will not scan by checking scale, quiet zones, contrast, damage and printer output without claiming carrier approval.",
    quickAnswer: "Treat a failed phone or handheld scan as a symptom, not a carrier verdict. First restore the original page geometry, then inspect barcode whitespace, contrast, bar damage and flat placement. Reprint from the original file if the symbol was resized, cropped, streaked, wrinkled or covered.",
    updatedAt: "2026-08-29",
    evidenceNote: "General troubleshooting framework: GS1 identifies common barcode-quality factors, Zebra documents one thermal print-quality path, and carrier sources cover placement. This page is not barcode verification or a guarantee of carrier acceptance.",
    sections: [
      { heading: "1. Restore geometry before testing scans", body: "Compare the physical boundary and barcode with the original PDF. If Fit, a screenshot, a crop or the wrong media changed the symbol or its surrounding white space, fix page size and scale first. Repeated scanning of altered output does not validate it." },
      { heading: "2. Check quiet space, contrast and damage", body: "GS1 lists quiet-zone size, contrast, symbol size, bar height, packaging interference, deterioration and position among common quality checks. Use those as diagnostic categories, not universal numeric limits for a carrier-specific symbol." },
      { heading: "3. Split thermal and sheet print quality", body: "For direct-thermal output, test media, printhead condition, density and speed using the model's manual; Zebra documents that heat, speed and media work together. For inkjet or laser output, use clean black output on suitable white stock and reject bleed, dropout or low contrast." },
      { heading: "4. Stop on an obstructed or uncertain code", body: "Keep the barcode flat and away from folds, seams and glossy tape. Reprint if bars are broken, quiet space is missing or the label is damaged. A phone-camera success is only a quick check; ask the issuing platform or carrier when handoff remains uncertain." },
    ],
    faq: [
      { question: "Does a phone scan prove that a shipping label is acceptable?", answer: "No. It is a diagnostic clue, not standards verification or carrier approval." },
      { question: "What should I check before changing printer darkness?", answer: "Confirm the page boundary and barcode were not resized or cropped. Geometry errors come before density tuning." },
      { question: "What should thermal-printer users test?", answer: "Use the exact model's procedure to test media, printhead condition, density and speed after page size and calibration are correct." },
      { question: "What should inkjet or laser users test?", answer: "Look for black-to-white contrast, clean bar edges, ink bleed, dropout and damage, then keep tape and folds off the code." },
      { question: "When is a reprint safer than another scan test?", answer: "Reprint when the symbol is resized, cropped, streaked, blurred, wrinkled, wet or covered, or when required surrounding space is missing." },
    ],
    reviewChecklist: ["Restore the original label geometry before scan tests.", "Inspect quiet space, contrast, bar damage and placement separately.", "Reprint damaged output; do not treat a phone scan as approval."],
    sources: [
      { label: "GS1 barcode quality checks", url: "https://support.gs1.org/support/solutions/articles/43000734141-what-should-i-check-to-ensure-good-quality-barcodes-", checkedAt: "2026-08-29", supports: "GS1 lists quiet zones, contrast, symbol size, bar height, damage, packaging interference and position as quality factors." },
      { label: "Zebra adjusting thermal print quality", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/c-zd620-420-print-operations/t-zd421-zd621-ug-adjusting-the-print-quality.html", checkedAt: "2026-08-29", supports: "Zebra documents the interaction of heat or density, print speed and loaded media for representative thermal printers." },
      { label: "FedEx shipping-label placement", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx advises keeping barcodes flat, away from seams and edges, and free of clear tape." },
    ],
  },
  "shipping-label-not-centered": {
    description: "Decide whether an off-center shipping label is cosmetic or caused by PDF layout, thermal feed, driver origin or sheet-printer margins before reprinting.",
    quickAnswer: "A label does not need symmetrical blank margins to be usable. First confirm that the PDF is complete and at the intended scale. Fix a thermal feed or origin offset only when the same measured shift repeats; on A4 or Letter, leave complete actual-size content alone unless it is clipped or rotated.",
    updatedAt: "2026-08-29",
    evidenceNote: "General troubleshooting framework: the sources explain PDF sizing and representative thermal calibration. Visual centering is not presented as a carrier requirement, and model-specific offsets require the printer manual.",
    sections: [
      { heading: "1. Separate cosmetic whitespace from lost content", body: "Inspect the original PDF and measure the output. If the whole label is complete, actual size and within the paper, uneven outer whitespace on a desktop sheet may be cosmetic. If a barcode, quiet zone, address or service mark is clipped, treat the offset as a print failure." },
      { heading: "2. Trace a thermal offset", body: "A repeatable shift on both a blank 4×6 template and live label points to media guides, sensing, driver origin or a documented position setting. Reload and calibrate first. Do not shrink the whole label or use undocumented offsets to hide a feed problem." },
      { heading: "3. Trace a Letter or A4 placement", body: "Confirm the selected sheet and orientation match the PDF. Adobe's Actual Size keeps dimensions but may crop when the page does not fit; Fit changes dimensions. Choose a matching source layout instead of moving barcode artwork for visual symmetry." },
      { heading: "4. Stop when position changes active content", body: "Reprint after the blank template passes if the live output is clipped, rotated, folded or too close to an edge for flat placement. If only the source PDF is shifted or incomplete, return to the issuing workflow instead of compensating in the printer." },
    ],
    faq: [
      { question: "Does a shipping label have to be centered on Letter or A4 paper?", answer: "Not for visual symmetry alone. The important print checks are complete content, intended scale and a layout that can be attached flat without cutting active areas." },
      { question: "Why is every thermal label shifted the same amount?", answer: "A repeatable shift points to media guides, sensing, driver origin or a position setting. Test a blank template and follow the exact model manual." },
      { question: "Should I shrink the label to center it?", answer: "No. Shrinking changes barcode geometry. Correct media, orientation, calibration or source layout instead." },
      { question: "What if only the original PDF is off-center?", answer: "Return to the issuer's correct format or intentionally extract a complete label area when permitted. Do not stack a printer offset on top of a source-layout problem." },
      { question: "When should I reprint?", answer: "Reprint when the offset clips or rotates active content, prevents flat placement, or persists after the correct blank-template test." },
    ],
    reviewChecklist: ["Confirm whether the offset is cosmetic or clips active content.", "Calibrate a repeated thermal shift before applying offsets.", "Reprint only after the matching blank template fits completely."],
    sources: [
      { label: "Adobe Acrobat page sizing for printing", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe distinguishes no-scaling Actual Size from Fit and documents the crop risk when a page does not fit." },
      { label: "Zebra SmartCal media calibration", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documents media loading, sensing and calibration for representative thermal printers." },
    ],
  },
  "fit-to-page-vs-actual-size-shipping-label": {
    description: "Choose Fit or Actual Size from the PDF page and printer media. Learn when Actual Size preserves scale, when it crops, and when to regenerate the label.",
    quickAnswer: "Use Actual Size / 100% when the PDF page and loaded media already match. Adobe defines Fit as resizing to the selected paper's printable area and Actual Size as no scaling; Actual Size can still crop a page that does not fit. If source and media differ, get the correct format instead of assuming either button is safe.",
    updatedAt: "2026-08-29",
    evidenceNote: "General troubleshooting framework: Adobe and Apple document viewer behavior. The correct shipping-label format still comes from the issuing marketplace or carrier, not from this page.",
    sections: [
      { heading: "1. Start with source size and physical media", body: "Read whether the PDF page is 4×6, Letter, A4 or a larger sheet containing a smaller label. Then confirm the paper or roll loaded in the selected printer. A scale choice should be the last step after those two facts match." },
      { heading: "2. Use Actual Size for a matched path", body: "Adobe says Actual Size prints without scaling. Use it when a true 4×6 page goes to matching 4×6 media, or a Letter/A4 page goes to the same sheet size. Measure one blank test because the final driver can still apply its own media settings." },
      { heading: "3. Treat Fit as a transformation", body: "Adobe says Fit reduces or enlarges a page to the selected printable area. That is useful for ordinary documents but can change barcode geometry. On macOS, Apple likewise documents Scale to Fit and separate choices that preserve the whole page or fill and crop the paper." },
      { heading: "4. Stop when neither option preserves the document", body: "If Actual Size crops required content and Fit miniaturizes or enlarges it, the source layout does not belong on the selected media. Regenerate the issuer's correct format, use matching paper, or intentionally extract one complete label area when the document permits it; do not trial-and-error a live barcode." },
    ],
    faq: [
      { question: "Is Actual Size always safe for shipping labels?", answer: "No. It preserves scale, but Adobe notes that content can crop when the page does not fit the selected paper." },
      { question: "Is Fit to Page always wrong?", answer: "It is a documented resizing operation. Do not use it when preserving the issued barcode dimensions is the goal; obtain a matching source format instead." },
      { question: "What should I use for a true 4×6 PDF and 4×6 roll?", answer: "Start with 4×6 media and Actual Size / 100%, then measure one blank test before live postage." },
      { question: "What should I use for a Letter PDF on a thermal printer?", answer: "Neither Fit nor blind enlargement. Get a 4×6 format or extract one complete label area only when all required content fits." },
      { question: "When should I stop and regenerate?", answer: "Stop when Actual Size crops, Fit changes the barcode, the page contains required adjacent documents, or the issuer gives a format-specific instruction." },
    ],
    reviewChecklist: ["Read the PDF page size and confirm loaded media.", "Use Actual Size only for a source-to-media match.", "Regenerate the correct format when Actual Size crops and Fit resizes."],
    sources: [
      { label: "Adobe Acrobat page sizing for printing", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe defines Fit, Actual Size, Shrink Oversized Pages and custom scaling behavior." },
      { label: "Apple Preview print options", url: "https://support.apple.com/en-gb/guide/preview/prvw15175/mac", checkedAt: "2026-08-29", supports: "Apple documents Preview Scale, Scale to Fit, Print Entire Image and Fill Entire Paper behavior." },
    ],
  },
  "amazon-shipping-label-too-small-blurry": {
    description: "Fix a small or blurry Amazon label after identifying FBM Buy Shipping, an FBA box ID or a product barcode, with workflow-specific reprint limits.",
    quickAnswer: "Do not enlarge an Amazon label until you identify it as an FBM Buy Shipping carrier label, an FBA box ID label, or a product barcode. Compare the untouched PDF with the print, use the paper format offered by that same Amazon workflow, and stop for a clean reprint if any barcode, identifier or required text was resized, cropped or blurred.",
    updatedAt: "2026-08-29",
    evidenceNote: "Amazon workflow evidence: current sources distinguish Buy Shipping, FBA box IDs and FBA product barcodes. Options can vary by marketplace, shipment type and account, so the live Seller Central workflow remains authoritative.",
    sections: [
      { heading: "1. Name the Amazon document", body: "For a merchant-fulfilled customer order, Amazon directs sellers to Manage Orders and Buy Shipping. For inbound FBA, the carton uses a unique FBA box ID label and may also need a separate carrier label. An FNSKU or other Amazon product barcode belongs on the unit, not the shipping carton. Do not apply one page's size fix to all three." },
      { heading: "2. Compare the source PDF and physical print", body: "If the Amazon PDF is sharp and complete but the paper output is uniformly small, match the source page, driver media and physical paper before changing scale. If the boundary is correct but bars are gray or broken, test print quality. If the original PDF itself looks incomplete, return to the issuing workflow rather than editing an image." },
      { heading: "3. Follow the printer path Amazon issued", body: "Amazon staff currently describes Letter 8.5×11 and 4×6 thermal choices in the Send to Amazon box-label step. Use that workflow-native option for an FBA box ID label. Do not assume those FBA choices also control an FBM carrier label or a product barcode." },
      { heading: "4. Reprint without changing identity", body: "Keep each label with its exact order, unit or box. Amazon's FBA shipping guidance says box labels are unique and should not be photocopied, reused or modified for additional boxes. Reprint the same source after correcting settings, and use Seller Central support if the needed format is not offered." },
    ],
    faq: [
      { question: "Which Amazon label am I fixing?", answer: "Check whether it came from FBM Buy Shipping, Send to Amazon box-label printing, or the FBA product-barcode flow. The correct size and reprint route depend on that answer." },
      { question: "Can I sharpen an Amazon label screenshot?", answer: "No. Return to the original PDF or regenerate it in the same workflow so the barcode and identifiers are not resampled." },
      { question: "Does FBA offer a 4×6 box-label option?", answer: "Amazon staff currently documents 4×6 for thermal printers and 8.5×11 for Letter output in the Send to Amazon box-label step." },
      { question: "Can I copy one clear FBA box label to another carton?", answer: "No. Amazon says each FBA box ID label is unique and should not be photocopied, reused or modified for another box." },
      { question: "When should I stop before handoff?", answer: "Stop when the label type is uncertain, the original PDF is unavailable, required content changed, or the live Amazon workflow does not offer the format you are trying to create." },
    ],
    reviewChecklist: ["Classify Buy Shipping, FBA box ID or product barcode.", "Compare the untouched PDF with the physical output.", "Reprint the same unique label only after the matched setup passes."],
    sources: [
      { label: "Amazon Shipping for seller-fulfilled orders", url: "https://sell.amazon.com/programs/shipping", checkedAt: "2026-08-29", supports: "Amazon describes purchasing and printing labels through Manage Orders and Buy Shipping for seller-fulfilled orders." },
      { label: "Amazon staff: Send to Amazon box-label paper choices", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/bf5635af-4afc-4588-bb03-31da456950b7", checkedAt: "2026-08-29", supports: "An Amazon staff response describes unique FBA box ID PDFs with Letter 8.5×11 and 4×6 thermal choices in step 3." },
      { label: "Amazon FBA shipping label requirements", url: "https://sellercentral.amazon.com/help/hub/reference/200178470", checkedAt: "2026-08-29", supports: "Amazon's Seller Central help is the primary source for unique box-label use and placement; sign-in may be required." },
    ],
  },
  "amazon-4x6-label-on-a4-or-letter": {
    description: "Print a true Amazon 4×6 label on A4 or Letter without resizing it, and stop for FBA sheet, AWD SSCC or multi-document workflows.",
    quickAnswer: "Print a standalone Amazon 4 × 6 PDF on A4 or Letter only after confirming that the page contains one complete label. Select the physical sheet, use Actual Size so the 4×6 boundary stays unchanged, and trim only unused paper. Prefer Amazon's native Letter option for FBA box labels, and do not crop AWD SSCC or multi-document pages.",
    updatedAt: "2026-08-29",
    evidenceNote: "Amazon workflow evidence plus PDF-viewer behavior: the page distinguishes standard FBA box labels from AWD SSCC and generic desktop placement. It does not claim that every Amazon document can be moved between sizes.",
    sections: [
      { heading: "1. Prove the PDF is a standalone 4×6 label", body: "Check the PDF page size, page count and visible content. Continue only when one 4×6 page contains the complete barcode, identifiers, addresses and service text for one shipment. A sheet with multiple unique labels, customs material, packing content or instructions is not the same task." },
      { heading: "2. Prefer Amazon's native sheet output", body: "For standard FBA box labels, Amazon staff currently describes Letter 8.5×11 and 4×6 thermal choices in the Print Box Labels step. If you need a desktop printer, regenerate the unique box label using the offered Letter option instead of post-processing a thermal PDF." },
      { heading: "3. Place a true 4×6 page on A4 or Letter", body: "When the source really is one 4×6 page, select the loaded A4 or Letter sheet and use Actual Size. Adobe defines Actual Size as no scaling. The label can sit within extra paper; do not enlarge it to fill the sheet, and trim only outside all active content." },
      { heading: "4. Stop for workflow-required sheets", body: "Do not use this path for an AWD A4 SSCC carton label or any page whose required content extends beyond the 4×6 area. Keep the Amazon-issued sheet format and every unique label. If the print still clips at Actual Size, use matching paper or return to Seller Central rather than switching to Fit." },
    ],
    faq: [
      { question: "Can I print a true Amazon 4×6 label on Letter paper?", answer: "Yes as a desktop-printing layout when the complete 4×6 page remains Actual Size and all active content is intact. This does not convert a sheet document into 4×6." },
      { question: "Should the 4×6 label fill the Letter or A4 sheet?", answer: "No. Filling the sheet enlarges the label. Preserve the 4×6 boundary and leave extra paper around it." },
      { question: "Should I use Amazon's Letter option instead?", answer: "For FBA box labels, prefer the workflow-native Letter option when it is offered. It preserves the unique label without a second layout transformation." },
      { question: "Can I crop an Amazon page with multiple labels or customs content?", answer: "Not with this workflow. Keep every required document and unique identifier, or use the exact Amazon option for that shipment." },
      { question: "When should I stop?", answer: "Stop when the source is not a single 4×6 page, required content lies outside the label, Actual Size clips, or Amazon issues a specific sheet-only format." },
    ],
    reviewChecklist: ["Confirm one complete 4×6 source page.", "Prefer Amazon's native Letter output when offered.", "Stop on AWD SSCC, multi-document pages or any clipped active content."],
    sources: [
      { label: "Amazon staff: Send to Amazon box-label paper choices", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/bf5635af-4afc-4588-bb03-31da456950b7", checkedAt: "2026-08-29", supports: "An Amazon staff response documents Letter 8.5×11 and 4×6 thermal choices for FBA box labels." },
      { label: "Adobe Acrobat page sizing for printing", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe defines Actual Size as printing without scaling and explains Fit as a resizing operation." },
      { label: "Amazon staff: AWD uses A4 SSCC box labels", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/b8827237-c287-418f-8f76-2a6ac4866ea8", checkedAt: "2026-08-29", supports: "An Amazon staff response states that the AWD workflow provides A4 SSCC box labels and says not to reuse or modify them." },
    ],
  },
  "amazon-a4-label-to-4x6-thermal": {
    title: "Amazon A4 Label to 4×6 Thermal: Regenerate or Stop",
    description: "Decide whether an Amazon A4 label can be regenerated as 4×6 thermal. Separate standard FBA box labels, FBM Buy Shipping and AWD SSCC before resizing.",
    h1: "Amazon A4 Label to 4×6 Thermal — Regenerate or Stop?",
    quickAnswer: "Prefer regeneration, not conversion. If standard Send to Amazon offers a 4 × 6 thermal box-label option, generate that unique format there. Do not convert an AWD A4 SSCC carton label, shrink a full A4 page, or discard required adjacent documents. If no native 4×6 option appears, keep the issued sheet format or ask Amazon support.",
    updatedAt: "2026-08-29",
    evidenceNote: "Amazon workflow evidence: standard FBA box-label, seller-fulfilled Buy Shipping and AWD SSCC paths are deliberately separated. Available options can vary by marketplace and shipment type; the live workflow controls.",
    sections: [
      { heading: "1. Identify standard FBA, FBM or AWD", body: "Standard FBA inbound box labels come from Send to Amazon. Merchant-fulfilled customer labels come from Manage Orders and Buy Shipping. AWD cartons use a different SSCC workflow. Confirm that identity before using a thermal printer because a page size that is valid in one path is not permission to alter another." },
      { heading: "2. Regenerate standard FBA box labels", body: "Amazon staff currently documents Letter 8.5×11 and 4×6 thermal choices in the Send to Amazon Print Box Labels step. When that option is present for the same shipment, generate the 4×6 version there and keep each unique box label matched to its carton." },
      { heading: "3. Keep AWD A4 SSCC labels on A4", body: "Amazon staff states that the AWD workflow provides A4 SSCC box labels and that every carton needs its unique issued label. That is a hard stop for this generic conversion page: do not crop or rescale the AWD A4 SSCC label to 4×6." },
      { heading: "4. Use the issued format when 4×6 is absent", body: "For FBM Buy Shipping or any account and shipment type that exposes only a sheet document, use the current offered format or contact Amazon support. Do not squeeze the full page, remove customs or packing material, or infer a crop boundary merely because the barcode appears to fit." },
    ],
    faq: [
      { question: "What is the safest way to convert an Amazon A4 label to 4×6?", answer: "Regenerate it in the same Amazon workflow when a native 4×6 option exists. Do not rescale the issued A4 PDF." },
      { question: "Can standard FBA box labels be generated for thermal printers?", answer: "Amazon staff currently documents a 4×6 thermal option alongside Letter in the Send to Amazon box-label step." },
      { question: "Can an AWD A4 SSCC box label be converted to 4×6?", answer: "No according to the cited Amazon AWD guidance. Keep the issued A4 SSCC label and its unique carton assignment." },
      { question: "What if Buy Shipping only shows a sheet format?", answer: "Use the format offered for that order or ask Amazon support. FBA box-label options do not prove that the FBM carrier-label flow supports the same output." },
      { question: "When must conversion stop?", answer: "Stop when there is no native 4×6 option, the page is AWD SSCC, multiple unique labels or required documents share the sheet, or any content would be resized or removed." },
    ],
    reviewChecklist: ["Classify standard FBA, FBM Buy Shipping or AWD.", "Regenerate 4×6 only when the same workflow offers it.", "Keep AWD A4 SSCC and required multi-document sheets unchanged."],
    sources: [
      { label: "Amazon staff: Send to Amazon box-label paper choices", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/bf5635af-4afc-4588-bb03-31da456950b7", checkedAt: "2026-08-29", supports: "An Amazon staff response documents Letter 8.5×11 and 4×6 thermal choices for standard FBA box-label printing." },
      { label: "Amazon staff: AWD uses A4 SSCC box labels", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/b8827237-c287-418f-8f76-2a6ac4866ea8", checkedAt: "2026-08-29", supports: "An Amazon staff response says AWD step 3 provides A4 SSCC box labels and each carton needs its unique label." },
      { label: "Amazon Shipping for seller-fulfilled orders", url: "https://sell.amazon.com/programs/shipping", checkedAt: "2026-08-29", supports: "Amazon directs seller-fulfilled orders to Manage Orders and Buy Shipping, a separate workflow from FBA inbound box labels." },
    ],
  },
  "shipping-label-too-small-usps-ups-fedex-accept": {
    quickAnswer: "Do not treat physical size alone as proof that USPS, UPS or FedEx will accept a label. If the barcode, tracking number, address, service text or surrounding white space was compressed, cropped or blurred, stop and reprint the original label at the correct paper size and scale.",
    sections: [
      { heading: "There is no reliable yes-or-no answer from size alone", body: "A smaller-looking label may come from extra blank paper, or it may mean the entire barcode was resized. Those are different cases. This page cannot certify carrier acceptance; compare the print with the original PDF and treat any changed or damaged scan-critical content as a reprint condition." },
      { heading: "Check what the print process changed", body: "Confirm the full barcode and tracking number are present, the address and service text are readable, and no edge or quiet-zone whitespace was cut away. If Fit to Page, a screenshot, browser margins or the wrong paper size changed the label, return to the original PDF and print again at the matching media size." },
      { heading: "Use reprint instead of repair when possible", body: "UPS documents that account users can reprint an existing label. For other workflows, use the platform or carrier account's current reprint option when it remains available. Reprinting is safer than stretching a barcode, patching missing content or buying duplicate postage without first checking the original transaction." },
      { heading: "Escalate uncertainty before handoff", body: "If you cannot compare with the original PDF, or the package shape prevents the barcode from lying flat, ask the carrier counter or the platform that issued the label. A successful phone-camera scan is only a diagnostic check; it is not a promise that carrier equipment or policy will accept the shipment." },
    ],
    faq: [
      { question: "Will a carrier accept any label that scans on my phone?", answer: "Not necessarily. A phone scan does not verify every routing mark, service field, carrier rule or automated-sorter condition." },
      { question: "Is a label safe because the address is readable?", answer: "No. The tracking barcode, service text and other routing content also need to remain complete, sharp and correctly scaled." },
      { question: "Should I enlarge a small label in the print dialog?", answer: "Do not guess. Match the source PDF, paper and printer first, then print at 100% / Actual Size so you do not crop another edge." },
      { question: "Can I reprint instead of buying postage again?", answer: "Use the current reprint option in the carrier or marketplace account when available. Confirm the original transaction before purchasing a duplicate label." },
      { question: "When should I stop and ask the carrier?", answer: "Stop when required content is missing, the barcode cannot lie flat, the original PDF is unavailable, or the issuing workflow gives instructions that conflict with this general checklist." },
    ],
    reviewChecklist: ["Compare the print with the original PDF.", "Reprint if barcode, address, service text or white space changed.", "Ask the issuing platform or carrier when acceptance is uncertain."],
    sources: [
      { label: "USPS Click-N-Ship basics", url: "https://faq.usps.com/articles/Knowledge/Click-N-Ship-The-Basics", checkedAt: "2026-08-29", supports: "USPS instructions say not to tape over barcodes." },
      { label: "UPS create and print shipping labels", url: "https://www.ups.com/us/en/support/shipping-support/print-shipping-labels", checkedAt: "2026-08-29", supports: "UPS documents how account users can reprint a shipping label." },
      { label: "FedEx shipping-label guidance", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx explains barcode purpose, flat placement and tape-related scan risk." },
    ],
  },
  "can-you-trim-fold-tape-shipping-label": {
    quickAnswer: "Trim only unused outer paper when every barcode, quiet zone, address and service mark stays intact. Keep the barcode flat and off seams or edges, and do not cover it with tape. If the active label cannot fit without folding or repair, reprint in the correct format.",
    sections: [
      { heading: "Trim only outside active label content", body: "Removing blank sheet paper is different from cutting the label itself. Stop before any barcode whitespace, tracking number, address, service text, routing mark or border used by the issuing workflow. When you cannot identify those boundaries, reprint instead of trimming." },
      { heading: "Keep the barcode flat", body: "FedEx advises placing the label on the package's largest surface and avoiding seams or edges because wrinkles can cause scanning problems. If the package shape makes that impossible, follow the carrier's current placement instructions or use an appropriate pouch or tag." },
      { heading: "Do not tape over the barcode", body: "USPS and FedEx both publish warnings against tape over barcodes; FedEx specifically notes reflection from clear tape. Tape only the surrounding paper when the issuing instructions allow it, or use a label pouch that keeps the barcode unobstructed." },
      { heading: "Reprint when repair changes the label", body: "Do not stretch, compress, redraw, photograph or patch a barcode. Return to the original PDF, match its page size to the printer media, and print at 100% / Actual Size. Treat a clean reprint as the default when active content was cropped, folded, wet, blurred or covered." },
    ],
    faq: [
      { question: "Can I cut away blank Letter or A4 paper?", answer: "Yes only when it is clearly outside every active label element and required quiet zone. Do not cut into routing, address or barcode areas." },
      { question: "Can I fold a label around a box edge?", answer: "Keep the barcode flat. FedEx warns that seams and edges can wrinkle a barcode and cause scanning problems." },
      { question: "Can clear tape cover the barcode?", answer: "No. USPS and FedEx instructions warn against tape over barcodes, including clear tape that can reflect scanner light." },
      { question: "What if the label is larger than the package face?", answer: "Use the carrier's current placement guidance or reprint in a format that fits. Do not improvise across scan-critical content." },
      { question: "When is reprinting mandatory?", answer: "Reprint when a barcode, quiet zone, address, service mark or tracking number is cut, distorted, blurred, folded or covered." },
    ],
    reviewChecklist: ["Trim only unused outer paper.", "Keep barcodes flat, uncut and free of tape.", "Reprint when active label content needs repair."],
    sources: [
      { label: "USPS Click-N-Ship basics", url: "https://faq.usps.com/articles/Knowledge/Click-N-Ship-The-Basics", checkedAt: "2026-08-29", supports: "USPS instructions say not to tape over barcodes." },
      { label: "FedEx shipping-label guidance", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx advises flat placement away from seams and no tape over barcodes." },
    ],
  },
  "shipping-label-preflight-checklist": {
    quickAnswer: "Before handoff, compare the print with the original PDF: confirm the complete barcode and tracking number, readable addresses and service text, unchanged scale, matching paper/orientation, flat placement, and no tape, fold, seam, blur or crop across scan-critical content.",
    sections: [
      { heading: "1. Compare with the original PDF", body: "Use the downloaded carrier or marketplace PDF as the reference. Confirm that no address line, tracking number, service mark, routing mark, barcode or surrounding white space disappeared during printing." },
      { heading: "2. Verify paper, scale and orientation", body: "Match the selected paper or roll to the source label, use 100% / Actual Size, and disable Fit to Page. If the print dialog changed the page, fix the setup and reprint before evaluating the barcode." },
      { heading: "3. Inspect print and placement", body: "The barcode should be sharp, complete, flat and free of tape glare. Keep it away from a package seam or edge when possible. Remove or fully cover obsolete labels and barcodes so automated equipment does not see conflicting routing information." },
      { heading: "4. Stop on uncertainty", body: "Do not use this checklist as carrier approval. Stop and reprint when active content is cropped, distorted, wet, blurred, folded or covered. Ask the carrier or issuing platform when package shape, special service or current instructions create doubt." },
    ],
    faq: [
      { question: "Does passing this checklist guarantee acceptance?", answer: "No. It reduces preventable print and placement errors but does not replace current carrier or platform policy." },
      { question: "Is a phone scan enough?", answer: "No. It is a useful diagnostic only and does not verify all carrier routing fields or automated equipment." },
      { question: "Should I keep old barcodes visible on the box?", answer: "No. Remove or fully cover obsolete labels and barcodes so they cannot conflict with the current shipment." },
      { question: "What is the safest scale setting?", answer: "After matching source page and printer media, start with 100% / Actual Size rather than Fit to Page." },
      { question: "What should trigger a reprint?", answer: "Any crop, blur, distortion, fold, tape or missing content across the barcode, address, tracking number, service text or quiet zone." },
    ],
    reviewChecklist: ["Compare every active field with the original PDF.", "Keep the current barcode sharp, flat and unobstructed.", "Stop and reprint instead of guessing about acceptance."],
    sources: [
      { label: "USPS Click-N-Ship basics", url: "https://faq.usps.com/articles/Knowledge/Click-N-Ship-The-Basics", checkedAt: "2026-08-29", supports: "USPS instructions cover label attachment and keeping tape off barcodes." },
      { label: "FedEx shipping-label guidance", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx covers flat placement, seams, edges, barcode purpose and tape glare." },
    ],
  },
  "mercari-shipping-label-4x6-vs-8x11": {
    quickAnswer: "Mercari currently offers 4 × 6 inch labels for thermal printers and 8.5 × 11 inch labels for inkjet or laser printers. Set the preferred paper size from the order's Shipping Information area, then print the matching file without forcing one layout into the other.",
    sections: [
      { heading: "Choose the size in Mercari first", body: "Mercari's current help page says sellers can open the item's Order Status page, go to Shipping Information > Label, choose Set paper size, and save either 4 × 6 or 8.5 × 11. Make that product-level choice before changing printer scale." },
      { heading: "Use 4×6 for the thermal workflow", body: "Select 4 × 6 when the printer is loaded with matching thermal stock. Also choose 4 × 6 in the printer driver and print at 100% / Actual Size so a sheet layout is not compressed onto one label." },
      { heading: "Use 8.5×11 for desktop printers", body: "Select 8.5 × 11 for a Letter-size inkjet or laser workflow. Keep the generated label at its original scale and trim only unused paper after confirming the barcode, address and service text are complete." },
      { heading: "Reprint instead of recreating a good label", body: "Mercari documents a View Label reprint flow for in-progress sales. If the first output used the wrong paper setting, correct the setting and reprint the existing label before considering a new transaction." },
    ],
    faq: [
      { question: "Does Mercari support 4×6 labels?", answer: "Yes. Mercari's current help page lists 4 × 6 for thermal printers and 8.5 × 11 for inkjet and laser printers." },
      { question: "Where do I change Mercari paper size?", answer: "Open the sold item's Order Status page, find Shipping Information > Label, choose Set paper size, and save the matching option." },
      { question: "Should I use Fit to Page?", answer: "No. Generate the correct Mercari paper size first, then print with matching media at 100% / Actual Size." },
      { question: "Can I reprint a Mercari label?", answer: "Mercari says you can open Profile > Selling > In Progress, select the item, and tap View Label." },
      { question: "Do I need a printer for every Mercari label?", answer: "Mercari documents print-free QR codes for eligible USPS and UPS prepaid labels; follow the current order screen because eligibility varies." },
    ],
    reviewChecklist: ["Select paper size in the Mercari order first.", "Match printer media to 4×6 or 8.5×11.", "Use the existing View Label flow for a clean reprint."],
    sources: [
      { label: "Mercari shipping labels and carrier options", url: "https://www.mercari.com/us/help_center/article/6000/", checkedAt: "2026-08-29", supports: "Mercari documents 4×6 and 8.5×11 choices, where to set them, QR-code eligibility and label reprinting." },
    ],
  },
  "mercari-label-prints-too-small": {
    quickAnswer: "A tiny Mercari label usually means the saved paper size, source PDF, print dialog or printer media do not match. Set 4 × 6 for thermal stock or 8.5 × 11 for Letter printing in Mercari, then reprint the original label at 100% / Actual Size.",
    sections: [
      { heading: "Check the Mercari paper-size preference", body: "On the sold item's Order Status page, open Shipping Information > Label > Set paper size. Mercari currently identifies 4 × 6 as the thermal-printer option and 8.5 × 11 as the inkjet/laser option." },
      { heading: "Download the newly matched label", body: "After saving the paper size, reopen or download the label so the source file matches the intended workflow. Do not try to rescue a sheet PDF on 4×6 stock with a guessed enlargement percentage." },
      { heading: "Match the driver and print at actual size", body: "Choose the same physical media in the printer driver, turn off Fit to Page, and print at 100% / Actual Size. A browser or driver preset from a previous paper size can still shrink the correct Mercari file." },
      { heading: "Use Mercari's reprint path", body: "Mercari documents reprinting from Profile > Selling > In Progress > View Label. Correct the settings and reprint the existing label when the order still exposes it; do not reuse one label on multiple packages." },
    ],
    faq: [
      { question: "Why is my Mercari label tiny?", answer: "The most likely cause is a mismatch among Mercari's saved paper size, the downloaded file, printer media and Fit to Page settings." },
      { question: "Which Mercari size is for a thermal printer?", answer: "Mercari currently lists 4 × 6 for thermal printers." },
      { question: "Which Mercari size is for a regular printer?", answer: "Mercari currently lists 8.5 × 11 for inkjet and laser printers." },
      { question: "Can I reprint the same label?", answer: "Mercari documents a View Label reprint path for in-progress sales. Use the current order screen as the authority." },
      { question: "Can I reuse one label on another package?", answer: "No. Mercari's help page warns not to use the same label twice." },
    ],
    reviewChecklist: ["Confirm Mercari's saved paper size.", "Download the matching label and disable Fit to Page.", "Reprint the existing order label; never reuse it on another package."],
    sources: [
      { label: "Mercari shipping labels and carrier options", url: "https://www.mercari.com/us/help_center/article/6000/", checkedAt: "2026-08-29", supports: "Mercari documents paper-size selection, 4×6 and 8.5×11 use cases, reprinting and the prohibition on label reuse." },
    ],
  },
  "shipstation-label-too-small-or-too-large": {
    quickAnswer: "Start in ShipStation's Label Document Options, not with an arbitrary scale percentage. Choose the label layout that matches the physical printer—4 × 6 for a thermal workflow—then align the operating-system driver and print one test at 100% / Actual Size.",
    sections: [
      { heading: "Set the layout in ShipStation", body: "ShipStation's current help directs users to Settings > Printing > Printing Setup > Label Document Options. Choose the document format that matches the printer before troubleshooting browser or driver scale." },
      { heading: "Use the documented 4×6 thermal option", body: "ShipStation identifies 4 × 6 as the option for thermal label printers. If the source layout is a larger sheet, do not shrink the entire page onto one thermal label; switch the document option and regenerate or reopen the label." },
      { heading: "Match the operating-system printer media", body: "After ShipStation's layout is correct, set the printer driver to the same physical media and use 100% / Actual Size. Conflicting app and driver sizes can make output too small, too large, sideways or clipped." },
      { heading: "Test one job before batch printing", body: "Use a blank template or one non-production test to confirm size, alignment and barcode sharpness. Do not save a new default or print a batch until the page boundary fits one label without crop or automatic scaling." },
    ],
    faq: [
      { question: "Where are ShipStation label-size settings?", answer: "ShipStation documents them under Settings > Printing > Printing Setup > Label Document Options." },
      { question: "Which ShipStation layout is for thermal printers?", answer: "ShipStation currently identifies 4 × 6 as the thermal-label option." },
      { question: "Should I fix a wrong size by changing scale?", answer: "Choose the correct ShipStation document option and driver media first. Use 100% / Actual Size after they match." },
      { question: "Why is the label still wrong after changing ShipStation?", answer: "The operating-system driver, browser print dialog or saved printer preset may still use a different paper size." },
      { question: "When should I batch print?", answer: "Only after one test fits the physical label and the barcode is sharp, complete and unscaled." },
    ],
    reviewChecklist: ["Choose the ShipStation document option first.", "Match the printer driver to the same media.", "Pass one 100% test before batch printing."],
    sources: [
      { label: "ShipStation Print Labels", url: "https://help.shipstation.com/hc/en-us/articles/360026157671-Print-Labels", checkedAt: "2026-08-29", supports: "ShipStation documents Label Document Options and the 4×6 thermal-printer layout." },
    ],
  },
  "dymo-4xl-label-prints-too-small": {
    quickAnswer: "For a DYMO LabelWriter 4XL, first confirm the source file is a true 4 × 6 label and the driver is using matching large-format label stock. Print at 100% / Actual Size; if a full Letter or A4 page is being squeezed onto the roll, fix or extract the source layout instead of enlarging blindly.",
    sections: [
      { heading: "Confirm the source page before blaming the printer", body: "Open the label PDF properties or analyze its page box. A full sheet sent to 4×6 stock will look miniature because the printer is fitting the whole page, even when the DYMO hardware and roll are working correctly." },
      { heading: "Select matching large-format stock", body: "Use the 4XL driver or DYMO software setting that matches the loaded 4×6 shipping-label stock. Paper-size choices can exist in both the system driver and the print dialog, so confirm both when the output remains small." },
      { heading: "Keep scale at 100% after sizes match", body: "Disable Fit to Page and print at 100% / Actual Size only after the PDF and driver media agree. A guessed enlargement can crop the barcode or tracking number at the label edge." },
      { heading: "Run a hardware and feed check", body: "If a blank 4×6 template is also wrong, reload the roll and follow the current DYMO user guide for hardware, media and feed troubleshooting. If only the carrier PDF is wrong, fix the source layout instead." },
    ],
    faq: [
      { question: "Why does my DYMO 4XL print a tiny shipping label?", answer: "The source may be a full Letter/A4 page, or the driver media and print-dialog paper sizes may not match the 4×6 roll." },
      { question: "Should I increase scale above 100%?", answer: "Not until the source page and driver media match. Blind enlargement can crop scan-critical content." },
      { question: "How do I isolate a DYMO hardware problem?", answer: "Print a blank 4×6 template. If it is also undersized or misfed, use the official DYMO guide for media and hardware checks." },
      { question: "Can the 4XL print a full Letter page?", answer: "No. Extract a true 4×6 label area rather than shrinking the entire sheet onto one label." },
      { question: "Is this official DYMO support?", answer: "No. This is independent print-layout guidance linked to the official LabelWriter 4XL user guide for hardware instructions." },
    ],
    reviewChecklist: ["Verify the PDF is 4×6 or safely extractable.", "Match DYMO driver media to the loaded stock.", "Use the official guide when a blank template also fails."],
    sources: [
      { label: "DYMO LabelWriter 4XL user guide", url: "https://download.dymo.com/UserManuals/labelwriter%20user%20guides/LabelWriter4XL_UserGuide.pdf", checkedAt: "2026-08-29", supports: "DYMO's manual is the first-party reference for 4XL hardware, media loading and printer operation." },
    ],
  },
  "pirate-ship-4x6-label-prints-on-letter-paper": {
    quickAnswer: "For a regular desktop printer, use Pirate Ship's Letter/8.5 × 11 print template and select the same paper size in the system dialog. Do not rely on a standalone 4 × 6 thermal layout plus a universal scale rule; Pirate Ship's current print flow provides printer-specific templates and settings.",
    sections: [
      { heading: "Choose the desktop-printer template in Pirate Ship", body: "Pirate Ship currently offers Letter/8.5 × 11 choices for regular inkjet and laser printers, including one- or two-label sheet layouts. Open Print Label or Reprint Label and choose the template that matches the paper loaded in the printer." },
      { heading: "Match the computer print dialog", body: "Select Letter, US Letter or 8.5 × 11 in the operating-system or browser print dialog. Orientation depends on the Pirate Ship sheet template: its Windows guidance uses portrait for one label per page and landscape for two labels per page." },
      { heading: "Follow the generated preview, not a universal scale slogan", body: "Pirate Ship's current guidance may use Fit to Page / Scale to Fit or 100% depending on the selected template and printer workflow. Confirm that the generated preview stays inside the sheet and that the printed barcode remains sharp and complete." },
      { heading: "Know when the purchased label size must change", body: "Pirate Ship says the account label-size setting must be chosen before purchase and that changing the purchased size can require a refund and a new label. Use Duplicate Shipment to avoid re-entering shipment details, and never use both the refunded and replacement labels." },
    ],
    faq: [
      { question: "Can Pirate Ship labels print on Letter paper?", answer: "Yes. Pirate Ship offers desktop-printer templates for 8.5 × 11 / Letter paper." },
      { question: "Should I select the 4×6 thermal option on a desktop printer?", answer: "Pirate Ship's Windows guidance says the 4×6 option is for label printers. Choose a Letter template for a regular desktop printer." },
      { question: "Should I always use Actual Size?", answer: "No universal setting fits every Pirate Ship template. Follow the current template-specific preview and print guidance, then confirm the barcode is not cropped or distorted." },
      { question: "Can I change label size after purchase?", answer: "Pirate Ship says the purchased label size cannot be changed; request a refund, update Settings > General Settings, and create a replacement when necessary." },
      { question: "Can I reprint while adjusting settings?", answer: "Pirate Ship says reprinting the same label does not add a charge, but the label may be used for only one package." },
    ],
    reviewChecklist: ["Choose Pirate Ship's desktop template.", "Match Letter paper and template orientation.", "Refund and replace when the purchased label size itself is wrong."],
    sources: [
      { label: "Pirate Ship: How do I print a label?", url: "https://support.pirateship.com/en/articles/2350724-how-do-i-print-a-label", checkedAt: "2026-08-29", supports: "Pirate Ship documents desktop, 4×6 and 2×7 templates, matching paper sizes, testing and reprinting." },
      { label: "Pirate Ship: Windows desktop printing", url: "https://support.pirateship.com/en/articles/2677447-windows-how-to-print-with-a-desktop-printer", checkedAt: "2026-08-29", supports: "Pirate Ship documents Letter templates, paper size and orientation for one- and two-label sheets." },
    ],
  },
  "pirate-ship-label-too-small-thermal-printer": {
    quickAnswer: "Set Pirate Ship's label size to 4 × 6 before buying the label, select the 4 × 6 template at Print/Reprint, and choose matching 4 × 6 or 100 × 150 mm media in the computer print dialog. Use the scale behavior Pirate Ship shows for that template and test one label before shipping.",
    sections: [
      { heading: "Set 4×6 in Pirate Ship before purchase", body: "Pirate Ship's current settings guide says label size is selected under Settings > General Settings and applies to future purchases. A thermal workflow should start with the 4×6 account setting rather than shrinking a Letter layout after purchase." },
      { heading: "Choose the matching Print/Reprint template", body: "When you open Print Label or Reprint Label, choose the template for the printer and label size. A wrong template can make the label too small, too large or cut off even when the physical roll is correct." },
      { heading: "Match the computer paper size", body: "In the browser or system dialog, select 4 × 6, 100 × 150 mm or the equivalent driver code documented by Pirate Ship. If that media option is missing, reinstall the correct printer driver instead of compensating with scale." },
      { heading: "Handle a wrong purchased size explicitly", body: "Pirate Ship says a purchased label's size cannot be changed. Request a refund, switch the General Settings size, and create a replacement—using Duplicate Shipment to reuse the shipment details—when the source format itself is wrong." },
    ],
    faq: [
      { question: "Why is my Pirate Ship label tiny on 4×6 stock?", answer: "The account label size, Print/Reprint template or computer paper size probably does not match the thermal roll." },
      { question: "Where do I set Pirate Ship label size?", answer: "Pirate Ship documents Settings > General Settings, and says the choice applies to future label purchases." },
      { question: "What paper size should the driver use?", answer: "Choose 4 × 6, 100 × 150 mm or the equivalent option supplied by the installed printer driver." },
      { question: "Should I always force 100% scale?", answer: "Follow Pirate Ship's current template-specific guidance; it documents Fit to Page / Scale to Fit or 100% in different print workflows. Verify one physical test instead of relying on a universal rule." },
      { question: "What if I purchased the wrong label size?", answer: "Pirate Ship says to refund it, change the label-size setting, and create a replacement. Do not use the refunded label." },
    ],
    reviewChecklist: ["Set 4×6 in Pirate Ship before purchase.", "Match the Print/Reprint template and driver media.", "Refund and replace a source label bought at the wrong size."],
    sources: [
      { label: "Pirate Ship: Why doesn't my label print correctly?", url: "https://support.pirateship.com/en/articles/4416795-why-doesn-t-my-label-print-correctly", checkedAt: "2026-08-29", supports: "Pirate Ship documents scaling symptoms, print templates, media sizes and driver troubleshooting." },
      { label: "Pirate Ship: Change label size", url: "https://support.pirateship.com/en/articles/4140701-how-can-i-change-the-size-of-my-label", checkedAt: "2026-08-29", supports: "Pirate Ship documents pre-purchase size selection and refund/replacement when a purchased size is wrong." },
    ],
  },
  "ebay-4x6-label-sideways-thermal-printer": {
    quickAnswer: "Choose eBay's 4 × 6 print format before purchasing the label, then set the thermal printer to matching 4 × 6 media. A sideways or miniature print is a format, orientation or driver mismatch; correct those inputs instead of rotating or enlarging the barcode image.",
    sections: [
      { heading: "Choose the eBay print format first", body: "eBay currently offers 8 × 11, 4 × 6, and—for USPS only—2 × 7 print formats. Select 4 × 6 for the thermal workflow before purchasing, because eBay says the label-size format can only be adjusted before purchase." },
      { heading: "Match the thermal driver", body: "Set the printer's media size to 4 × 6 and use the orientation shown by the source PDF. If the preview contains a full 8 × 11 sheet or is rotated across the roll, stop before printing and return to the eBay format or driver setup." },
      { heading: "Do not solve rotation with arbitrary scaling", body: "Auto-rotate, Fit to Page and a saved desktop-printer preset can make a correct 4×6 label sideways or tiny. Clear the conflicting preset, keep the barcode unchanged, and print one test before a batch." },
      { heading: "Use eBay's current management flow", body: "eBay documents print, reprint and cancel actions in My eBay, Seller Hub and the app. Use the order's current Manage shipping options if a purchased label needs attention; do not print a second paid label without checking the first transaction." },
    ],
    faq: [
      { question: "Which eBay format is for a thermal printer?", answer: "eBay currently offers a 4 × 6 print format that matches common thermal label stock." },
      { question: "Why is my eBay label sideways?", answer: "The eBay print format, PDF orientation, driver media or auto-rotate setting does not match the 4×6 roll." },
      { question: "Can I change the eBay print size after purchase?", answer: "eBay says the label-size format can only be adjusted before purchase. Use the order's current manage/cancel flow if the purchased label is wrong." },
      { question: "Should I rotate a screenshot?", answer: "No. Use the original eBay label file and correct the format or printer orientation so the barcode is not resampled." },
      { question: "Can I reprint from the eBay app?", answer: "eBay documents reprint and label-management actions in the app; open Selling > Orders and Manage shipping for the current options." },
    ],
    reviewChecklist: ["Choose eBay 4×6 before purchase.", "Match driver media and source orientation.", "Use Manage shipping instead of editing the barcode image."],
    sources: [
      { label: "eBay printing and canceling shipping labels", url: "https://www.ebay.com/help/-/-/-/shipping-labels?id=4157", checkedAt: "2026-08-29", supports: "eBay documents available print formats, pre-purchase size selection, QR options, and print/reprint/cancel flows." },
    ],
  },
  "ebay-shipping-label-cut-off-left-side": {
    quickAnswer: "First verify that the eBay print format matches the physical paper: 4 × 6 for matching thermal stock or 8 × 11 for a desktop workflow. A left-edge crop is usually a media, orientation, margin or roll-alignment problem; do not shrink the whole label to hide it.",
    sections: [
      { heading: "Confirm the format selected in eBay", body: "eBay currently offers 8 × 11, 4 × 6, and USPS-only 2 × 7 print formats. The print-size setting must be chosen before purchase, so verify the order's label format before debugging printer margins." },
      { heading: "Separate source crop from printer crop", body: "Open the original label PDF and confirm the left edge is present. If it is missing in the file, return to the eBay order flow. If the PDF is complete but paper output is clipped, the printer media, printable area, roll guides or origin offset is responsible." },
      { heading: "Fix alignment without shrinking", body: "Set the driver to the same paper size, reload or calibrate the roll, clear borderless/photo presets, and print at the intended orientation. Shrinking can reveal the left edge while making the barcode and quiet zone too small." },
      { heading: "Stop when active content is missing", body: "Reprint or use eBay's current label-management flow if the barcode, tracking number, address, service text or routing mark is clipped. A partial label should not be repaired with a screenshot or pasted fragment." },
    ],
    faq: [
      { question: "Why does only the left side get cut off?", answer: "A consistent one-edge crop usually points to printable area, driver media, roll alignment or origin offset rather than global scale." },
      { question: "Should I shrink the eBay label?", answer: "No. Match format, media and alignment first so barcode scale is preserved." },
      { question: "Which formats does eBay currently offer?", answer: "eBay documents 8 × 11, 4 × 6, and 2 × 7 for USPS only." },
      { question: "Can eBay label size be changed after purchase?", answer: "eBay says label-size format is adjusted before purchase. Check the order's manage or cancel options if it is wrong." },
      { question: "What content makes a reprint necessary?", answer: "Reprint when barcode, tracking number, address, service or routing content is clipped or distorted." },
    ],
    reviewChecklist: ["Verify the eBay format and original PDF.", "Fix one-edge alignment without shrinking.", "Reprint when active content is missing."],
    sources: [
      { label: "eBay printing and canceling shipping labels", url: "https://www.ebay.com/help/-/-/-/shipping-labels?id=4157", checkedAt: "2026-08-29", supports: "eBay documents print formats, when format is selected, and label-management routes." },
    ],
  },
  "ebay-shipping-label-trimmed-or-taped": {
    quickAnswer: "Use eBay's matching print format so repair is unnecessary. Trim only unused outer paper, never active label content; keep every barcode flat and free of tape. If the print requires cutting, folding or taping across a barcode, tracking number, address or service mark, use eBay's reprint/manage flow.",
    sections: [
      { heading: "Start with the right eBay format", body: "eBay currently offers 8 × 11, 4 × 6, and USPS-only 2 × 7 formats. Select the option that matches the printer before purchase rather than cutting a mismatched sheet or thermal output after printing." },
      { heading: "Trim blank paper, not the label", body: "Only remove clearly unused sheet margins. Keep the barcode, surrounding white space, tracking number, address, service text and routing marks complete. If those boundaries are unclear, reprint instead of trimming." },
      { heading: "Keep tape off barcodes", body: "USPS and FedEx publish warnings against tape over barcodes; FedEx specifically notes reflection risk from clear tape. Attach the label around its outer paper or use a suitable pouch while leaving scan-critical areas flat and unobstructed." },
      { heading: "Use eBay's reprint or cancel controls", body: "eBay documents print, reprint and cancel actions in its order-management flows. When a label is damaged or the purchased format is wrong, inspect those current options before purchasing another label or attempting a patch." },
    ],
    faq: [
      { question: "Can I trim an eBay label?", answer: "Only trim unused outer paper while every barcode, quiet zone, tracking number, address and service mark remains untouched." },
      { question: "Can clear tape cover the barcode?", answer: "No. USPS and FedEx instructions warn against tape over barcodes because it can interfere with scanning." },
      { question: "Can I fold the barcode around an edge?", answer: "Keep the barcode flat. Use a better format, placement or reprint when the package surface is too small." },
      { question: "Which eBay print format should I choose?", answer: "Match 4 × 6 to thermal stock or 8 × 11 to a desktop printer; 2 × 7 is documented for USPS only." },
      { question: "Can I reprint a damaged eBay label?", answer: "eBay documents reprint and cancel controls. Use the current order's Manage shipping flow to see what is available." },
    ],
    reviewChecklist: ["Match eBay format before purchase.", "Trim only unused outer paper.", "Keep every barcode flat, complete and free of tape."],
    sources: [
      { label: "eBay printing and canceling shipping labels", url: "https://www.ebay.com/help/-/-/-/shipping-labels?id=4157", checkedAt: "2026-08-29", supports: "eBay documents print formats and label-management actions." },
      { label: "USPS Click-N-Ship basics", url: "https://faq.usps.com/articles/Knowledge/Click-N-Ship-The-Basics", checkedAt: "2026-08-29", supports: "USPS instructions say not to tape over barcodes." },
      { label: "FedEx shipping-label guidance", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx advises flat placement and no tape over barcodes." },
    ],
  },
  "shopify-label-sideways-thermal-printer": {
    quickAnswer: "Select Shopify's Thermal 4 × 6 / 100 × 150 mm / A6 paper format, then match the printer driver to the same media. Sideways output is an orientation or format mismatch; close the print popup, choose the correct label size, and reprint instead of rotating a screenshot.",
    sections: [
      { heading: "Use Shopify's thermal paper format", body: "Shopify currently lists Thermal 4 × 6 inch / 100 × 150 mm / A6 for label printers. Choose that format in Shopify before changing driver rotation or scale." },
      { heading: "Match the driver and preview", body: "Select the same physical media in the printer driver and check that the preview shows one portrait label on one sheet. Disable a saved Letter/A4 or photo preset that rotates the label across the roll." },
      { heading: "Correct the format from Shopify", body: "Shopify's troubleshooting guide says that while on the Print shipping label page you can close the initial popup, select the correct label size from the dropdown, and click Print shipping labels again." },
      { heading: "Verify one reprint before a batch", body: "Shopify supports reprinting shipping documents. Print one corrected label and confirm the barcode, tracking number, address and service marks are sharp and complete before printing up to the documented bulk limit." },
    ],
    faq: [
      { question: "Which Shopify format is for thermal printers?", answer: "Shopify currently lists Thermal 4 × 6 inch / 100 × 150 mm / A6." },
      { question: "Why is my Shopify label sideways?", answer: "The Shopify paper format, source orientation or printer-driver media likely does not match the thermal roll." },
      { question: "How do I correct label size in Shopify?", answer: "Close the initial print popup, select the correct label size from the dropdown, and click Print shipping labels again." },
      { question: "Should I rotate a screenshot?", answer: "No. Reprint the original Shopify label in the matching format so the barcode is not resampled." },
      { question: "Can Shopify labels be reprinted?", answer: "Yes. Shopify's help page says shipping labels and documents can be reprinted." },
    ],
    reviewChecklist: ["Select Shopify Thermal 4×6/A6.", "Match driver media and orientation.", "Reprint from Shopify rather than editing an image."],
    sources: [
      { label: "Shopify printing shipping documents", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/managing-labels/printing-shipping-documents", checkedAt: "2026-08-29", supports: "Shopify documents thermal, Letter and A4 formats plus reprinting." },
      { label: "Shopify troubleshooting shipping labels", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/buying-labels/troubleshooting-labels", checkedAt: "2026-08-29", supports: "Shopify documents correcting the label-size dropdown and reprinting from the print page." },
    ],
  },
  "shopify-4x6-on-desktop-printer": {
    quickAnswer: "For a regular inkjet or laser printer, choose Shopify's Letter or A4 paper format instead of forcing the thermal 4 × 6 layout onto a desktop page. Match the selected format to the loaded paper, then reprint the original shipping document and inspect the barcode before handoff.",
    sections: [
      { heading: "Use Shopify's desktop-printer format", body: "Shopify currently lists Letter 8.5 × 11 and A4 210 × 297 mm for desktop printers, while Thermal 4 × 6 / 100 × 150 mm / A6 is for label printers. Select the format that matches the actual printer." },
      { heading: "Correct the label size before reprinting", body: "If the first popup used the wrong format, Shopify says to close it, choose the correct label size from the dropdown, and click Print shipping labels again. This preserves the original document better than scaling a screenshot." },
      { heading: "Keep the generated layout intact", body: "Choose the same Letter or A4 paper in the system print dialog and inspect the preview. Do not stretch a 4×6 barcode to fill the whole sheet or crop active content simply to center it." },
      { heading: "Trim only unused sheet paper", body: "After printing, remove only blank outer paper. Keep barcode whitespace, tracking number, address, service text and any customs or packing-slip content required by the shipment complete and readable." },
    ],
    faq: [
      { question: "Which Shopify format is for a regular printer?", answer: "Shopify lists Letter for 8.5 × 11 paper and A4 for 210 × 297 mm paper." },
      { question: "Should I choose Thermal 4×6 on a desktop printer?", answer: "Use Shopify's Letter or A4 format for a desktop printer unless your physical setup specifically prints 4×6 media." },
      { question: "Can I reprint after choosing the wrong format?", answer: "Yes. Shopify documents choosing the correct label size and reprinting from the Print shipping label page." },
      { question: "Should the barcode fill the sheet?", answer: "No. Preserve the generated barcode scale and trim only unused outer paper." },
      { question: "Can shipping documents be combined?", answer: "Shopify documents combining labels with customs forms or packing slips and resizing them to the selected paper format." },
    ],
    reviewChecklist: ["Choose Shopify Letter or A4 for desktop printing.", "Match the physical paper in the print dialog.", "Trim only unused outer paper after a clean reprint."],
    sources: [
      { label: "Shopify printing shipping documents", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/managing-labels/printing-shipping-documents", checkedAt: "2026-08-29", supports: "Shopify documents Thermal, Letter and A4 formats, combined documents and reprinting." },
      { label: "Shopify troubleshooting shipping labels", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/buying-labels/troubleshooting-labels", checkedAt: "2026-08-29", supports: "Shopify documents correcting the label size and reprinting." },
    ],
  },
  "shopify-label-cut-off-parts-usps": {
    quickAnswer: "Do not cut away any USPS barcode, tracking number, address, service text or surrounding barcode space. First reprint from Shopify with the matching Thermal 4 × 6, Letter or A4 format; if active USPS content remains cropped, stop and resolve the source label rather than trimming it for handoff.",
    sections: [
      { heading: "Correct the Shopify format first", body: "Shopify documents Thermal 4 × 6/A6 for label printers and Letter or A4 for desktop printers. Its troubleshooting flow lets you close the print popup, select the correct label size and reprint the original document." },
      { heading: "Compare the reprint with the original", body: "Confirm that the full USPS barcode, tracking number, recipient and return addresses, service text and routing marks are present. A crop caused by the wrong media or orientation should disappear after a correctly formatted reprint." },
      { heading: "Trim only blank outer paper", body: "Do not trim into the barcode or its surrounding white space. USPS Click-N-Ship guidance also says not to tape over barcodes, so attach the corrected label without glossy tape across scan-critical content." },
      { heading: "Stop if required content is still missing", body: "This page cannot promise USPS acceptance. If the Shopify source file itself is incomplete, the package shape prevents flat placement, or any active content remains damaged, use Shopify or USPS support before drop-off." },
    ],
    faq: [
      { question: "Can I cut off blank parts of a Shopify USPS label?", answer: "Only remove unused outer paper. Do not cut barcode whitespace, tracking, address, service or routing content." },
      { question: "How do I fix the Shopify label size?", answer: "Close the print popup, choose the paper format that matches the printer, and click Print shipping labels again." },
      { question: "Can clear tape cover a USPS barcode?", answer: "No. USPS Click-N-Ship guidance says not to tape over barcodes." },
      { question: "Does a readable address make a cropped label acceptable?", answer: "No. Barcode, tracking and routing content must also remain complete; ask the issuing platform or carrier when uncertain." },
      { question: "Which Shopify format should I use?", answer: "Use Thermal 4×6/A6 for a matching label printer, Letter for 8.5×11 desktop paper, or A4 for 210×297 mm desktop paper." },
    ],
    reviewChecklist: ["Reprint using Shopify's matching format.", "Keep every USPS barcode and quiet zone intact.", "Stop when active content remains cropped or cannot lie flat."],
    sources: [
      { label: "Shopify printing shipping documents", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/managing-labels/printing-shipping-documents", checkedAt: "2026-08-29", supports: "Shopify documents paper formats and reprinting." },
      { label: "Shopify troubleshooting shipping labels", url: "https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/buying-labels/troubleshooting-labels", checkedAt: "2026-08-29", supports: "Shopify documents correcting label size from the print page." },
      { label: "USPS Click-N-Ship basics", url: "https://faq.usps.com/articles/Knowledge/Click-N-Ship-The-Basics", checkedAt: "2026-08-29", supports: "USPS instructions say not to tape over barcodes." },
    ],
  },
  "label-wrong-paper-size-4x6-vs-letter-a4": {
    quickAnswer: "Separate the source page size from the paper you accidentally used. If the label content stayed at its original scale and is complete, move it to the correct workflow; if the barcode or required text was resized or cropped, reprint from the original PDF with matching 4 × 6, Letter or A4 media.",
    sections: [
      { heading: "Identify the source PDF size", body: "Check whether the PDF page itself is 4×6, Letter or A4. Do not infer the source from the sheet that came out of the printer: a 4×6 label can appear on a larger sheet, and a full sheet can be squeezed onto a thermal roll." },
      { heading: "Classify the bad print", body: "If the complete label remained actual size on extra paper, the problem is mostly paper handling. If every element became smaller, an auto-fit setting changed scale. If one edge disappeared, paper size, orientation, margins or printable area caused a crop." },
      { heading: "Reprint with a matched path", body: "For a true 4×6 source, use matching thermal media or place it unchanged on a desktop sheet. For Letter/A4 sources, use the matching desktop paper or extract a verified 4×6 label area without shrinking active content." },
      { heading: "Do not certify a repaired label", body: "A readable address does not prove that barcode scale and routing marks survived. Reprint whenever active content changed, and check the issuing carrier or platform when the original format or acceptance requirement is uncertain." },
    ],
    faq: [
      { question: "Is the wrong sheet automatically invalid?", answer: "Not necessarily. The important question is whether every active label element stayed complete and at its intended scale; this page cannot certify carrier acceptance." },
      { question: "How do I know whether auto-fit changed the label?", answer: "Compare the printed boundary with the source page size or a ruler template. Uniform shrink usually points to Fit to Page or a media mismatch." },
      { question: "Can I put a 4×6 label on Letter or A4?", answer: "A 4×6 label can sit unchanged on a larger sheet. Do not enlarge it to fill the sheet or cut into active content." },
      { question: "Can a Letter/A4 label print on 4×6 stock?", answer: "Only when a true label area can be extracted without resizing barcode and routing content. Do not squeeze the entire sheet onto one roll label." },
      { question: "What should trigger a reprint?", answer: "Any resized, cropped, blurred, folded or missing barcode, address, service text, tracking number or quiet zone." },
    ],
    reviewChecklist: ["Identify the source PDF page size.", "Classify extra paper, uniform shrink or edge crop.", "Reprint when active content changed."],
  },
  "shipping-label-keeps-getting-cropped": {
    quickAnswer: "Repeated cropping is usually a reproducible mismatch, not bad luck. Check the source PDF page size, physical media, driver paper size, orientation and printable-area offset in that order; print a blank template after each change and never shrink the barcode merely to reveal a missing edge.",
    sections: [
      { heading: "Record one failing setup", body: "Write down the PDF page size, printer model, loaded paper or roll, driver media, orientation, scale and the exact edge that is missing. Changing several controls at once makes the crop difficult to reproduce and can hide the real cause." },
      { heading: "Match all three sizes", body: "The source PDF, print-dialog paper and physical media need a coherent path. A Letter page sent to 4×6 stock, or a 4×6 file sent through an old Letter preset, often clips even when the preview appears centered." },
      { heading: "Use the edge pattern as evidence", body: "One consistent missing edge points to roll alignment, printable area or origin offset. A rotated crop points to orientation. Different edges across successive labels point to media guides, feed calibration or roll drift." },
      { heading: "Verify with a blank template", body: "Print a matching blank template at the same settings. If the template crops too, fix printer setup. If only the shipping PDF crops, inspect its page box and regenerate or extract the label without changing barcode scale." },
    ],
    faq: [
      { question: "Why does the same edge always crop?", answer: "A fixed edge usually means printable-area, driver-origin, media-guide or roll-alignment error." },
      { question: "Why do different edges crop on later labels?", answer: "That pattern points to feed calibration, loose guides or roll drift rather than the source PDF." },
      { question: "Should I use Shrink to Fit?", answer: "No as the first fix. It can hide a margin problem by reducing the entire barcode and label." },
      { question: "How do I separate printer from PDF?", answer: "Print a blank template using the same paper and driver settings. If it also crops, the printer path is responsible." },
      { question: "When should I reprint the live label?", answer: "After the blank template passes, reprint the original label and confirm every active element is complete." },
    ],
    reviewChecklist: ["Record one exact failing configuration.", "Use the cropped edge pattern to isolate the cause.", "Require a clean blank-template test before live postage."],
  },
  "print-4x6-shipping-label-on-regular-printer": {
    quickAnswer: "Use the original 4 × 6 PDF on Letter or A4 paper without enlarging it to fill the sheet. Select the desktop paper size, keep the label at 100% / Actual Size when the viewer preserves the 4×6 boundary, print one test, then trim only blank outer paper.",
    sections: [
      { heading: "Confirm the PDF is truly 4×6", body: "Open the PDF page properties or use the local analyzer. If the page is Letter or A4 with a label inside it, follow that sheet layout instead of treating the full page as a standalone 4×6 file." },
      { heading: "Place 4×6 on the larger sheet", body: "Load Letter or A4 paper and select the same paper size in the print dialog. Keep the 4×6 label at its intended physical size; it does not need to fill the whole sheet or sit perfectly centered." },
      { heading: "Print a measurable test", body: "Use a blank 4×6 template with the same viewer and printer. Measure the border. If it is not 4 × 6 inches, correct the scale or driver path before printing paid postage." },
      { heading: "Trim and attach without touching active content", body: "Cut only unused paper outside barcode whitespace, addresses, tracking and service marks. Keep the final label flat and unobstructed; reprint if the active label is clipped or distorted." },
    ],
    faq: [
      { question: "Can a regular printer print a 4×6 shipping label?", answer: "Yes. It can place the unchanged 4×6 label on Letter or A4 paper, which you then trim outside active content." },
      { question: "Should the label fill the whole sheet?", answer: "No. Enlarging it to fill Letter/A4 changes barcode scale." },
      { question: "Which paper size goes in the print dialog?", answer: "Choose the physical desktop paper—Letter or A4—while preserving the 4×6 label boundary inside the page." },
      { question: "How do I verify actual size?", answer: "Print a blank 4×6 template with the same settings and measure it with a ruler." },
      { question: "Where can I trim?", answer: "Only remove blank outer sheet paper; do not cut barcode quiet zones or any label text or marks." },
    ],
    reviewChecklist: ["Verify the source PDF is 4×6.", "Keep the 4×6 boundary unchanged on Letter/A4.", "Measure a blank test before paid postage."],
  },
  "convert-letter-shipping-label-to-4x6-thermal": {
    quickAnswer: "Do not scale the entire Letter page down to 4 × 6. First determine whether the Letter PDF contains one self-contained 4×6 label area; crop or extract that area without resampling it, verify the output boundary and barcode, and keep using the original sheet workflow if the active content does not fit.",
    sections: [
      { heading: "Inspect the Letter layout", body: "A Letter PDF may contain one 4×6 label, two labels, instructions, a packing slip or customs documents. Identify every element required for the shipment before extracting anything." },
      { heading: "Extract; do not squeeze", body: "When a self-contained label area fits 4×6, crop or split the page boundary around that area without shrinking its barcode. If the required label is larger or depends on adjacent content, use the original Letter workflow." },
      { heading: "Set true 4×6 output media", body: "After extraction, set the thermal driver to 4 × 6 / 100 × 150 mm and print at 100% / Actual Size. A second Fit to Page step can undo the careful extraction." },
      { heading: "Validate before live use", body: "Print a blank or watermarked sample, measure the 4×6 boundary, and compare every barcode, tracking number, address and service mark with the original Letter PDF. Stop if any required content was left behind or resized." },
    ],
    faq: [
      { question: "Can every Letter label be converted to 4×6?", answer: "No. Conversion is safe only when a complete required label area fits 4×6 without shrinking or losing adjacent documents." },
      { question: "Why not scale the whole Letter page?", answer: "It miniaturizes the barcode and all page content onto one thermal label." },
      { question: "What if the page has two labels?", answer: "Split each complete label into its own page only when both boundaries and all required content are clear." },
      { question: "What if there is a customs form or packing slip?", answer: "Keep and print every required document separately; do not discard it merely to make a 4×6 label." },
      { question: "How do I verify the conversion?", answer: "Measure a test print and compare every active field with the original PDF before using live postage." },
    ],
    reviewChecklist: ["Inventory all required Letter-page content.", "Extract a complete label without resampling.", "Measure and compare one test before live printing."],
  },
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
    description: "Classify an FBA box ID, carrier label or product barcode before deciding whether a wrong-paper print must be regenerated in Seller Central.",
    quickAnswer: "Do not decide from paper alone. First identify an FBA box ID label, the separate carrier label, or an Amazon product barcode. Reprint the same unique box or unit label from its Amazon workflow when the output was resized, cropped or blurred; never copy one clear label onto another box or product.",
    updatedAt: "2026-08-29",
    evidenceNote: "Amazon workflow evidence: cited Amazon sources distinguish unique inbound box IDs, carrier labels and product barcodes. This checklist cannot approve an inbound shipment, and the current Seller Central workflow controls available formats.",
    sections: [
      { heading: "1. Identify the label's job", body: "An FBA box ID identifies one inbound carton. A partnered or non-partnered carrier label routes that carton. An Amazon product barcode such as an FNSKU identifies one unit. The print can contain more than one label type, and a 4×6 carton workflow is not a product-label sizing rule." },
      { heading: "2. Reprint a unique FBA box ID from Send to Amazon", body: "Amazon staff currently describes Letter 8.5×11 and 4×6 thermal options in the Print Box Labels step. If you selected the wrong one or the print changed scale, return to that same shipment and generate or reprint the format offered there. Amazon's shipping guidance says each box label is unique and must not be photocopied, reused or modified for another box." },
      { heading: "3. Keep the carrier and product paths separate", body: "Keep the carrier label paired with the correct box ID and correct a damaged carrier label in the partnered-carrier or carrier workflow. For a unit barcode, return to Amazon's product-barcode flow; Amazon's product-label guidance covers different stock, placement and obscuring of other product barcodes." },
      { heading: "4. Stop before FBA handoff", body: "Do not hand off a carton when a unique identifier, barcode, address or required text was resized, cropped, blurred, folded or covered. Reprint from the original workflow and keep every label matched to its box or unit. If Seller Central does not offer the expected format, use Amazon support rather than improvising a conversion." },
    ],
    faq: [
      { question: "Can I still ship an FBA label printed on the wrong paper?", answer: "This page cannot approve it from paper alone. Identify the label type and confirm it is the unmodified output of the current Amazon workflow; reprint whenever active content or scale changed." },
      { question: "How is an FBA box ID different from the carrier label?", answer: "The box ID identifies the inbound carton to Amazon; the carrier label routes it. Amazon guidance expects both for small-parcel workflows where a carrier label applies." },
      { question: "Is an FNSKU a 4×6 shipping label?", answer: "No. It is a product barcode for an individual unit and follows Amazon's product-label workflow, not the carton-label decision path." },
      { question: "Can I reuse a clear FBA box label on another carton?", answer: "No. Amazon says each FBA box ID label is unique and should not be photocopied, reused or modified for another box." },
      { question: "When must I reprint?", answer: "Reprint when any unique identifier, barcode, address or required text is resized, clipped, blurred, damaged or assigned to the wrong box or unit." },
    ],
    reviewChecklist: ["Identify box ID, carrier label or product barcode.", "Keep every unique label matched to its box or unit.", "Stop and reprint from the same Amazon workflow when content changed."],
    sources: [
      { label: "Amazon FBA shipping label requirements", url: "https://sellercentral.amazon.com/help/hub/reference/200178470", checkedAt: "2026-08-29", supports: "Amazon's Seller Central help is the primary source for unique FBA box labels and placement; sign-in may be required." },
      { label: "Amazon staff: Send to Amazon box-label paper choices", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/bf5635af-4afc-4588-bb03-31da456950b7", checkedAt: "2026-08-29", supports: "An Amazon staff response describes unique FBA box ID PDFs with Letter 8.5×11 and 4×6 thermal choices." },
      { label: "Amazon staff: FBA product barcode requirements", url: "https://sellercentral.amazon.com/seller-forums/discussions/t/84e2c23e-e36b-4cfd-b0cd-c104bd0ab35c", checkedAt: "2026-08-29", supports: "An Amazon staff guide distinguishes manufacturer, Amazon and Transparency product barcodes and gives unit-label quality and placement guidance." },
    ],
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

const seoTitleOverrides: Record<string, string> = {
  "shipping-label-preflight-checklist": "Shipping Label Preflight Checklist for USPS, UPS & FedEx",
  "can-you-trim-fold-tape-shipping-label": "Can You Trim, Fold or Tape a Shipping Label Safely?",
  "amazon-4x6-label-on-a4-or-letter": "Print Amazon 4×6 Labels on A4 or Letter Safely",
  "label-wrong-paper-size-4x6-vs-letter-a4": "Wrong Label Paper Size: 4×6 vs Letter/A4 Risks",
  "shopify-label-cut-off-parts-usps": "Can You Trim a Shopify Label? USPS Scan Risks",
  "shipping-label-too-small-usps-ups-fedex-accept": "Will USPS, UPS or FedEx Accept a Small Shipping Label?",
  "amazon-fba-label-wrong-paper-size": "Amazon FBA Label on the Wrong Paper Size",
  "amazon-a4-label-to-4x6-thermal": "Amazon A4 to 4×6: Regenerate, Don't Resize",
  "ebay-shipping-label-trimmed-or-taped": "Trim or Tape a Misprinted eBay Label?",
  "convert-letter-shipping-label-to-4x6-thermal": "Convert Letter Labels to 4×6 Thermal",
  "etsy-shipping-label-print-settings": "Etsy Label Print Settings: 4×6, Letter & A4",
  "shopify-label-sideways-thermal-printer": "Fix Sideways Shopify Thermal Labels",
  "ebay-4x6-label-sideways-thermal-printer": "Fix Sideways eBay 4×6 Thermal Labels",
  "shopify-4x6-on-desktop-printer": "Print Shopify 4×6 Labels on a Regular Printer",
  "shopify-shipping-labels-printing-incorrectly": "Fix Incorrect or Cut-Off Shopify Labels",
  "pirate-ship-label-too-small-thermal-printer": "Fix Small Pirate Ship Thermal Labels",
  "thermal-printer-feeds-extra-blank-labels": "Thermal Printer Feeds Extra Blank Labels",
  "print-4x6-shipping-label-on-regular-printer": "Print 4×6 Labels on a Regular Printer",
  "shopify-label-size-vs-printer-size": "Match Shopify Label and Printer Size",
  "ebay-shipping-label-size-4x6-vs-letter": "eBay Label Size: 4×6 vs Letter",
  "etsy-4x6-label-on-regular-printer": "Print Etsy 4×6 Labels on a Regular Printer",
  "zebra-printer-4x6-label-cut-off-or-shrunk": "Fix Cut-Off or Shrunk Zebra 4×6 Labels",
};

export const seoPages: SeoPage[] = seoPageDrafts.map((page) => ({
  ...enrichSeoPage(page),
  seoTitle: seoTitleOverrides[page.slug],
}));

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
