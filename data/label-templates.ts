export type LabelOutputSize = "4x6" | "6x4" | "A6" | "2x7";
export type LabelPlatform = "ebay-usps" | "reference";

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LabelTemplateRegion extends Rectangle {
  rotation: 0 | 90 | 180 | 270;
  description: string;
}

export interface LabelTemplate {
  id: string;
  platform: LabelPlatform;
  sampleFilename: string;
  label: string;
  sourceUrl: string;
  signature: {
    textPatterns: string[];
    sizeMatch: { w: number; h: number; tolerance: number };
  };
  pageSize: "Letter" | "A4" | "Custom";
  regions: {
    combined: LabelTemplateRegion;
  };
  skipRegions: Array<Rectangle & { reason: string }>;
  notes: string;
  lastVerified: string;
  verifiedWithRealPdf: boolean;
}

export interface ReferenceDownload {
  id: string;
  title: string;
  description: string;
  localFilename?: string;
  sourceUrl: string;
  status: "verified-local" | "external-verified" | "external-blocked" | "reference-only";
}

export const PAPER_SIZES = {
  A4: { w: 595, h: 842, mm: "210x297", in: "8.27x11.69" },
  LETTER: { w: 612, h: 792, mm: "216x279", in: "8.50x11.00" },
  LABEL_4X6: { w: 288, h: 432, mm: "102x152", in: "4.00x6.00" },
  LABEL_6X4: { w: 432, h: 288, mm: "152x102", in: "6.00x4.00" },
  A6: { w: 298, h: 420, mm: "105x148", in: "4.13x5.83" },
  LABEL_2X7: { w: 144, h: 504, mm: "51x178", in: "2.00x7.00" },
} as const;

export const OUTPUT_SIZES: Record<LabelOutputSize, { label: string; w: number; h: number }> = {
  "4x6": { label: "4x6 portrait", w: PAPER_SIZES.LABEL_4X6.w, h: PAPER_SIZES.LABEL_4X6.h },
  "6x4": { label: "6x4 landscape", w: PAPER_SIZES.LABEL_6X4.w, h: PAPER_SIZES.LABEL_6X4.h },
  A6: { label: "A6 portrait", w: PAPER_SIZES.A6.w, h: PAPER_SIZES.A6.h },
  "2x7": { label: "2x7 narrow", w: PAPER_SIZES.LABEL_2X7.w, h: PAPER_SIZES.LABEL_2X7.h },
};

export const LABEL_TEMPLATES: LabelTemplate[] = [
  {
    id: "ebay-usps-intl-letter",
    platform: "ebay-usps",
    sampleFilename: "ebay-usps-intl-letter.pdf",
    label: "eBay / USPS PS Form 2976 international label",
    sourceUrl: "https://www.thinkpenguin.com/files/shipping-label-printer/ebay-USPS-First-Class-Package-International-PDF-4x6-Format-Selected.pdf",
    signature: {
      textPatterns: ["CN22 - CUSTOMS DECLARATION", "PS Form 2976", "Online Label Record"],
      sizeMatch: { w: PAPER_SIZES.LETTER.w, h: PAPER_SIZES.LETTER.h, tolerance: 3 },
    },
    pageSize: "Letter",
    regions: {
      combined: {
        x: 50,
        y: 447,
        w: 500,
        h: 290,
        rotation: 90,
        description: "PS Form 2976 combined postage + CN22 block",
      },
    },
    skipRegions: [
      { x: 50, y: 200, w: 230, h: 240, reason: "Instructions" },
      { x: 290, y: 240, w: 245, h: 190, reason: "Online Label Record sender copy" },
    ],
    notes: "Measured from the real ThinkPenguin eBay USPS international sample. The output is one combined 4x6 PDF because postage and CN22 are one PS Form 2976 block.",
    lastVerified: "2026-05-13",
    verifiedWithRealPdf: true,
  },
];

export const REFERENCE_DOWNLOADS: ReferenceDownload[] = [
  {
    id: "ebay-usps-intl-letter",
    title: "Real eBay USPS international label sample",
    description: "Real shipped eBay / USPS First Class Package International PDF with CN22. This is the only currently verified splitter template.",
    localFilename: "ebay-usps-intl-letter.pdf",
    sourceUrl: "https://www.thinkpenguin.com/files/shipping-label-printer/ebay-USPS-First-Class-Package-International-PDF-4x6-Format-Selected.pdf",
    status: "verified-local",
  },
  {
    id: "phomemo-4x6-thermal",
    title: "Phomemo 4x6 thermal label sample",
    description: "Manufacturer sample for checking 4x6 thermal output. Useful as a reference, not an international splitter template.",
    localFilename: "phomemo-4x6-thermal.pdf",
    sourceUrl: "https://doc.phomemo.com/Labels-Sample.pdf",
    status: "verified-local",
  },
  {
    id: "usps-ps-form-2976r-blank",
    title: "USPS PS Form 2976-R blank form",
    description: "USPS customs declaration and dispatch note form reference.",
    localFilename: "usps-ps-form-2976r-blank.pdf",
    sourceUrl: "https://about.usps.com/forms/ps2976r.pdf",
    status: "verified-local",
  },
  {
    id: "cn22-blank-A4-2pp",
    title: "CN22 blank A4 2-up form",
    description: "A4 blank CN22 form reference. Not a marketplace label splitter template.",
    localFilename: "cn22-blank-A4-2pp.pdf",
    sourceUrl: "https://www.bristol.ac.uk/media-library/sites/print-services/documents/cn22-form-blank.pdf",
    status: "verified-local",
  },
  {
    id: "auspost-cn22-cn23-specification",
    title: "Australia Post CN22/CN23 specification",
    description: "Official Australia Post international labelling reference.",
    localFilename: "auspost-cn22-cn23-specification.pdf",
    sourceUrl: "https://auspost.com.au/content/dam/auspost_corp/media/documents/cn22-and-cn23-international-labelling.pdf",
    status: "verified-local",
  },
  {
    id: "canadapost-label-specifications",
    title: "Canada Post label specifications",
    description: "Canada Post technical label specification reference.",
    localFilename: "canadapost-label-specifications.pdf",
    sourceUrl: "https://www.canadapost-postescanada.ca/cpc/doc/en/support/label-specifications.pdf",
    status: "verified-local",
  },
  {
    id: "fedex-cn22",
    title: "FedEx fillable CN22 form",
    description: "FedEx official CN22 postal clearance declaration.",
    sourceUrl: "https://www.fedex.com/content/dam/fedex/us-united-states/services/CN_22_Postal_Clearance_Declaration_Fillable_Form.pdf",
    status: "external-verified",
  },
  {
    id: "usps-customs-forms",
    title: "USPS customs forms guide",
    description: "USPS official customs forms landing page.",
    sourceUrl: "https://www.usps.com/international/customs-forms.htm",
    status: "external-verified",
  },
  {
    id: "royalmail-cn22",
    title: "Royal Mail CN22 form",
    description: "Royal Mail CN22 PDF. The bundle reports this URL may return 403 without a referrer.",
    sourceUrl: "https://www.royalmail.com/sites/royalmail.com/files/2020-03/customs-declaration-cn22-march-2020.pdf",
    status: "external-blocked",
  },
  {
    id: "postoffice-cn22-guide",
    title: "Post Office CN22 guide",
    description: "UK Post Office guide to filling in a CN22 customs form.",
    sourceUrl: "https://www.postoffice.co.uk/mail/customs-forms/cn22-form-guide",
    status: "reference-only",
  },
];

export function getLabelTemplate(id: string) {
  return LABEL_TEMPLATES.find((template) => template.id === id);
}

export function templateFromSampleFilename(filename: string) {
  return LABEL_TEMPLATES.find((template) => template.sampleFilename === filename);
}
