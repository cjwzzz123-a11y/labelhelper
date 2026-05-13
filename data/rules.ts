export type Platform =
  | "etsy"
  | "shopify"
  | "ebay"
  | "amazon_fba"
  | "usps_direct"
  | "ups_direct"
  | "fedex_direct"
  | "dhl_direct"
  | "other";

export type Carrier =
  | "usps"
  | "ups"
  | "fedex"
  | "dhl"
  | "royal_mail"
  | "canada_post"
  | "australia_post";

export type Paper = "4x6" | "a4" | "letter" | "6x4" | "other";
export type Printer = "thermal" | "inkjet" | "laser";

export interface Rule {
  platform: Platform;
  carrier: Carrier;
  paper: Paper;
  printer: Printer;
  verdict: "compatible" | "not_ideal" | "not_recommended";
  recommended_size: {
    width_in: number;
    height_in: number;
    width_mm: number;
    height_mm: number;
  };
  print_scale: string;
  orientation: "portrait" | "landscape";
  common_mistakes: string[];
  notes: string;
  official_doc_url?: string;
  official_doc_label?: string;
  official_doc_last_checked?: string;
  official_doc_note?: string;
}

export interface RulesDB {
  rules: Rule[];
  defaults: Rule;
  version: string;
}

export const platformOptions: Array<{ value: Platform; label: string }> = [
  { value: "etsy", label: "Etsy" },
  { value: "shopify", label: "Shopify" },
  { value: "ebay", label: "eBay" },
  { value: "amazon_fba", label: "Amazon FBA" },
  { value: "usps_direct", label: "USPS Direct" },
  { value: "ups_direct", label: "UPS Direct" },
  { value: "fedex_direct", label: "FedEx Direct" },
  { value: "dhl_direct", label: "DHL Direct" },
  { value: "other", label: "Other" },
];

export const carrierOptions: Array<{ value: Carrier; label: string }> = [
  { value: "usps", label: "USPS" },
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "dhl", label: "DHL" },
  { value: "royal_mail", label: "Royal Mail" },
  { value: "canada_post", label: "Canada Post" },
  { value: "australia_post", label: "Australia Post" },
];

export const paperOptions: Array<{ value: Paper; label: string }> = [
  { value: "4x6", label: "4 × 6 in" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "6x4", label: "6 × 4 in" },
  { value: "other", label: "Other" },
];

export const printerOptions: Array<{ value: Printer; label: string }> = [
  { value: "thermal", label: "Thermal (direct)" },
  { value: "inkjet", label: "Inkjet" },
  { value: "laser", label: "Laser" },
];

export const platforms = platformOptions.map((option) => option.value);
export const carriers = carrierOptions.map((option) => option.value);
export const papers = paperOptions.map((option) => option.value);
export const canonicalRulePapers: Paper[] = ["4x6", "a4", "letter", "other"];
export const printers = printerOptions.map((option) => option.value);

const officialDocs: Record<Carrier | Platform, { url: string; label: string }> = {
  usps: { url: "https://postalpro.usps.com/", label: "USPS official shipping guidance" },
  ups: { url: "https://www.ups.com/us/en/support/shipping-support/print-shipping-labels.page", label: "UPS label printing support" },
  fedex: { url: "https://www.fedex.com/en-us/shipping/online/label-printing.html", label: "FedEx label printing guidance" },
  dhl: { url: "https://www.dhl.com/", label: "DHL official shipping guidance" },
  royal_mail: { url: "https://www.royalmail.com/", label: "Royal Mail official shipping guidance" },
  canada_post: { url: "https://www.canadapost-postescanada.ca/", label: "Canada Post official shipping guidance" },
  australia_post: { url: "https://auspost.com.au/", label: "Australia Post official shipping guidance" },
  etsy: { url: "https://help.etsy.com/", label: "Etsy Help Center" },
  shopify: { url: "https://help.shopify.com/manual/orders/shipping-labels", label: "Shopify shipping label help" },
  ebay: { url: "https://www.ebay.com/help/selling/shipping-items/setting-shipping-options/printing-shipping-labels?id=4088", label: "eBay shipping label help" },
  amazon_fba: { url: "https://sellercentral.amazon.com/", label: "Amazon Seller Central" },
  usps_direct: { url: "https://postalpro.usps.com/", label: "USPS official shipping guidance" },
  ups_direct: { url: "https://www.ups.com/", label: "UPS official shipping guidance" },
  fedex_direct: { url: "https://www.fedex.com/", label: "FedEx official shipping guidance" },
  dhl_direct: { url: "https://www.dhl.com/", label: "DHL official shipping guidance" },
  other: { url: "https://postalpro.usps.com/", label: "General official shipping guidance" },
};

const officialDocLastChecked = "2026-05-12";
const officialDocNote = "Carrier and platform rules may change. Confirm the label file before buying postage or printing live labels.";

const recommendedSizes: Record<Paper, Rule["recommended_size"]> = {
  "4x6": { width_in: 4, height_in: 6, width_mm: 101.6, height_mm: 152.4 },
  "6x4": { width_in: 6, height_in: 4, width_mm: 152.4, height_mm: 101.6 },
  a4: { width_in: 8.27, height_in: 11.69, width_mm: 210, height_mm: 297 },
  letter: { width_in: 8.5, height_in: 11, width_mm: 215.9, height_mm: 279.4 },
  other: { width_in: 4, height_in: 6, width_mm: 101.6, height_mm: 152.4 },
};

const defaultRule: Rule = {
  platform: "other",
  carrier: "usps",
  paper: "4x6",
  printer: "thermal",
  verdict: "not_ideal",
  recommended_size: recommendedSizes["4x6"],
  print_scale: "100% — do not select Fit to Page",
  orientation: "portrait",
  common_mistakes: [
    "Using Fit to Page instead of Actual Size / 100%.",
    "Choosing a paper size that does not match the printer label roll.",
    "Rotating a 4 × 6 label without checking barcode quiet zones.",
  ],
  notes: "This is an unusual setup. Start with a 4 × 6 label at 100% scale and verify against the carrier documentation before shipping.",
  official_doc_url: officialDocs.usps.url,
  official_doc_label: officialDocs.usps.label,
  official_doc_last_checked: officialDocLastChecked,
  official_doc_note: officialDocNote,
};

function makeRule(
  platform: Platform,
  carrier: Carrier,
  paper: Paper,
  printer: Printer,
  tier: "tier1" | "generated" = "generated",
): Rule {
  const isThermal = printer === "thermal";
  const isFourBySix = paper === "4x6" || paper === "6x4";
  const isSheet = paper === "a4" || paper === "letter";
  const platformName = platformOptions.find((option) => option.value === platform)?.label ?? platform;
  const carrierName = carrierOptions.find((option) => option.value === carrier)?.label ?? carrier;
  const paperName = paperOptions.find((option) => option.value === paper)?.label ?? paper;

  let verdict: Rule["verdict"] = "not_ideal";
  if (isFourBySix && isThermal) verdict = "compatible";
  if (isSheet && (printer === "laser" || printer === "inkjet")) verdict = "compatible";
  if (paper === "other") verdict = "not_recommended";
  if (paper === "6x4" && isThermal) verdict = "not_ideal";

  const orientation: Rule["orientation"] = paper === "6x4" ? "landscape" : "portrait";
  const officialDoc = officialDocs[carrier] || officialDocs[platform] || officialDocs.usps;

  const commonMistakes = isThermal
    ? [
        "Selecting Fit to Page instead of printing at 100% scale.",
        "Loading the 4 × 6 label roll sideways or with the wrong orientation.",
        "Letting the platform crop the label instead of downloading the carrier PDF.",
      ]
    : [
        "Printing a 4 × 6 label stretched across the whole sheet.",
        "Forgetting to disable browser header/footer margins.",
        "Cutting into the barcode quiet zone after printing on sheet paper.",
      ];

  const notes =
    tier === "tier1"
      ? `${platformName} sellers using ${carrierName} should normally print at 100% scale. ${isFourBySix ? "A 4 × 6 thermal label is the safest setup for label printers." : `${paperName} works for inkjet/laser printers when the label is not scaled to fit.`}`
      : `${platformName} + ${carrierName} + ${paperName} is supported, but this is not a primary tested setup. Print one calibration sheet before buying postage in volume.`;

  return {
    platform,
    carrier,
    paper,
    printer,
    verdict,
    recommended_size: isFourBySix ? recommendedSizes["4x6"] : recommendedSizes[paper],
    print_scale: isFourBySix ? "100% — do not select Fit to Page" : "100% / Actual Size — do not shrink to printable area",
    orientation,
    common_mistakes: commonMistakes,
    notes,
    official_doc_url: officialDoc.url,
    official_doc_label: officialDoc.label,
    official_doc_last_checked: officialDocLastChecked,
    official_doc_note: officialDocNote,
  };
}

const tier1Platforms: Platform[] = ["etsy", "shopify", "ebay", "amazon_fba"];
const tier1Carriers: Carrier[] = ["usps", "ups", "fedex", "dhl"];
const tier1Papers: Paper[] = ["4x6", "letter"];
const tier1Printers: Printer[] = ["thermal", "laser"];

const tier1Keys = new Set(
  tier1Platforms.flatMap((platform) =>
    tier1Carriers.flatMap((carrier) =>
      tier1Papers.flatMap((paper) => tier1Printers.map((printer) => `${platform}:${carrier}:${paper}:${printer}`)),
    ),
  ),
);

export const rules: Rule[] = platforms.flatMap((platform) =>
  carriers.flatMap((carrier) =>
    canonicalRulePapers.flatMap((paper) =>
      printers.map((printer) => {
        const key = `${platform}:${carrier}:${paper}:${printer}`;
        return makeRule(platform, carrier, paper, printer, tier1Keys.has(key) ? "tier1" : "generated");
      }),
    ),
  ),
);

export const rulesDb: RulesDB = {
  rules,
  defaults: defaultRule,
  version: "1.0.0",
};
