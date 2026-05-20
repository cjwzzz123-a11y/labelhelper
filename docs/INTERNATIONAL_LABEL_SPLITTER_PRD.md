# International Label Splitter — Product Requirements Document

**Version:** 1.0  
**Owner:** 陈嘉伟  
**Target implementer:** Claude Code (Desktop)  
**Last updated:** 2026-05-20  
**Related files:**  
- `shipping_label_helper_PRD.md` — root PRD  
- `docs/PRODUCT_SPEC.md` — living implementation guide  

---

## 0. How to use this PRD

This document specifies the International Label Splitter feature as an addition to the existing Shipping Label Helper product. Implement strictly in Section 10 (Build Order). Do NOT modify existing tools, routes, or VIP logic unless explicitly stated here.

Priority rules (same as root PRD):
1. Pure front-end / browser-local over any server-side processing.
2. Privacy is a selling point — user PDFs must never leave the browser.
3. Reuse existing shared components (`MembershipBadge`, `useStoredLicense`, `VipBadge`, etc.).
4. Static/pre-rendered pages for all SEO landing pages.

---

## 1. Feature Summary

**Feature name:** International Label Splitter  
**Codename:** `ils` (used in code identifiers, filenames, localStorage keys)

**One-liner:**  
Drop an international shipping PDF from Etsy, eBay, Royal Mail, Australia Post, Canada Post, Shopify-DHL, USPS, or a generic layout — the tool automatically detects and splits the shipping label and customs form (CN22/CN23) into separate, correctly-sized 4×6 thermal-printable outputs. Everything runs locally in the browser.

**What it does:**
- Accepts multi-part international shipping label PDFs (A4/Letter pages containing both a shipping label and a customs form).
- Detects the shipping label region and the customs form region on each PDF page.
- Outputs separate PDF files: a 4×6-ready shipping label PDF and a customs form PDF.
- Runs 100% client-side using `pdf-lib` and `pdf.js`. No file is sent to any server.
- VIP users download watermark-free output. Free users get a watermarked preview.

**What it is NOT:**
- NOT a postage generator or carrier API client.
- NOT a label designer.
- NOT an OCR tool — detection is geometry-based (page crop/split), not text recognition.
- NOT a batch processor in V1 (single PDF per session in MVP).

**Primary users:** Etsy sellers, eBay sellers, Shopify-DHL cross-border sellers, and any seller using a 4×6 thermal printer who receives international shipping PDFs that mix the label and customs form on an A4 or Letter page.

---

## 2. Problem Statement

International shipping platforms commonly generate PDF labels in one of these layouts:

| Layout type | Example | Problem |
|---|---|---|
| A4 with label on top half, CN22 on bottom | eBay international, Etsy international | Cannot print 4×6 thermal directly — page too big |
| A4 two-up: label page 1, CN22 page 2 | Royal Mail, Canada Post | Need to print separately at different scales |
| Letter with label + packing slip/customs combined | USPS First Class International | Needs splitting before thermal print |
| Landscape A4 with label left, customs right | Australia Post | Unusual split axis |

Sellers currently solve this by:
- Manually cropping in Adobe Acrobat (paid).
- Printing full A4 and physically cutting.
- Trial-and-error scaling — often resulting in wasted labels.

The International Label Splitter eliminates all of these workarounds with a one-click browser-local split.

---

## 3. Supported Templates (MVP — 8 templates)

Each template defines:
- Source page size (A4 / Letter / custom)
- Split mode (vertical / horizontal / two-page)
- Label region (x, y, width, height in mm)
- Customs form region (x, y, width, height in mm)
- Output label size (always 4×6 / 101.6×152.4mm in V1)

| ID | Platform | Carrier | Source page | Split mode | Notes |
|---|---|---|---|---|---|
| `ebay-intl` | eBay | Various | A4 | Horizontal (top/bottom) | Label top half, CN22 bottom half |
| `etsy-intl` | Etsy | USPS/various | A4 | Horizontal (top/bottom) | Label top half, CN22 bottom half |
| `usps-intl` | USPS direct | USPS | Letter | Two-page | Page 1 = label, Page 2 = customs |
| `royal-mail` | Shopify / Royal Mail | Royal Mail | A4 | Two-page | Page 1 = label, Page 2 = CN22 |
| `australia-post` | Shopify / AusPost | Australia Post | A4 | Vertical (left/right) | Label left, customs right |
| `canada-post` | Shopify / Canada Post | Canada Post | A4 | Two-page | Page 1 = label, Page 2 = customs |
| `shopify-dhl` | Shopify | DHL | A4 | Horizontal (top/bottom) | Label top ~60%, DHL customs bottom |
| `generic-a4-h` | Any | Any | A4 | Horizontal (user-defined split line) | Fallback: user drags split line |

**V1 output always targets 4×6 inches (101.6 × 152.4 mm) for the shipping label.**  
Customs form output keeps original dimensions of the detected customs region, scaled to fit a 4×6 page (or A5 if it is too tall).

---

## 4. Information Architecture

### 4.1 New route

```
/tools/international-label-splitter
```

This is the only new tool route. Add it to:
- `/tools` index page (existing) — add a card for this tool.
- Primary nav `Tools` dropdown (if it exists as a dropdown).
- `sitemap.xml` (auto-generated, will pick up if added to the app router).

### 4.2 New SEO landing pages (5 pages)

All are static (SSG) and follow the same template as existing programmatic SEO pages.

| URL | Target keyword | Intent |
|---|---|---|
| `/etsy-international-label-to-4x6` | etsy international shipping label 4x6 thermal | Fix Etsy intl label for thermal printer |
| `/ebay-international-shipping-label-4x6` | ebay international shipping label 4x6 | Fix eBay intl label for thermal printer |
| `/split-cn22-from-shipping-label-pdf` | split cn22 from shipping label pdf | Generic customs form split |
| `/print-customs-form-on-thermal-printer` | print customs form thermal printer | Customs form thermal print guide |
| `/international-label-too-big-for-thermal` | international label too big for 4x6 printer | Troubleshooter entry |

Each page must:
- Have a Quick Answer card at the top (see Section 7).
- Embed the International Label Splitter tool (pre-filled with the relevant template where possible).
- Have FAQPage schema (5 Q&As).
- Link to at least 3 related pages.
- Follow existing programmatic page template structure from root PRD Section 5.7.

---

## 5. Detailed Feature Spec

### 5.1 Page: `/tools/international-label-splitter`

**Membership:** Mixed — free users get watermarked preview output; VIP users get watermark-free downloads.

#### User flow

1. User arrives at the page.
2. User selects their template from a dropdown (8 options + "Generic A4 — I'll set the split line").
3. User uploads their PDF (drag-and-drop or click-to-select).
   - Show: `🔒 Your PDF never leaves your browser. All processing is local.`
   - File size limit: 20 MB.
   - Page count limit: 10 pages.
4. Tool detects the split automatically based on template geometry.
   - For `generic-a4-h`: show a visual PDF preview with a draggable horizontal split line.
5. Preview panel shows:
   - Left/top region → "Shipping Label" with detected dimensions.
   - Right/bottom region → "Customs Form" with detected dimensions.
   - A side-by-side or stacked visual preview of the two output PDFs.
6. Download buttons:
   - **"Download Label PDF (4×6)"** — downloads the shipping label portion scaled to 4×6. VIP only (watermarked for free users).
   - **"Download Customs Form PDF"** — downloads the customs form portion. VIP only (watermarked for free users).
   - **"Download Both (ZIP)"** — downloads both PDFs as a ZIP. VIP only.
   - Free users see a `MemberLockedCallout` below each download button linking to `/pricing`.
7. A "Try another PDF" button resets the state.

#### VIP badge placement
- Use `MemberFeatureShell` wrapper on the download section.
- Use `VipBadge` in the top-right corner of the download card.
- Locked state shows amber; unlocked shows emerald (consistent with existing VIP visual system in `PRODUCT_SPEC.md` Section 4).

#### Privacy statement
Must appear visibly above the file dropzone:
```
🔒 Your PDF never leaves your browser. All splitting and processing happens locally using pdf-lib and pdf.js.
```

---

### 5.2 Template geometry data

Store in: `data/ils-templates.ts`

```typescript
export interface ILSTemplate {
  id: string;
  displayName: string;
  platform: string;
  carrier: string;
  sourcePageWidthMm: number;
  sourcePageHeightMm: number;
  splitMode: 'horizontal' | 'vertical' | 'two-page' | 'manual';
  // For horizontal/vertical splits:
  splitPositionMm?: number;        // distance from top (horizontal) or left (vertical)
  // For two-page:
  labelPageIndex?: number;         // 0-based
  customsPageIndex?: number;       // 0-based
  // Output
  labelOutputWidthMm: number;      // always 101.6 in V1
  labelOutputHeightMm: number;     // always 152.4 in V1
  notes?: string;
}
```

Populate all 8 templates from Section 3 with real measurements.

**Important:** Measurements must be verified against actual PDFs before shipping. Use sample PDFs in `/public/samples/` (add ILS samples there) to verify geometry.

---

### 5.3 Core split logic

Create: `lib/ils-splitter.ts`

```typescript
import { PDFDocument } from 'pdf-lib';

export interface SplitResult {
  labelPdfBytes: Uint8Array;
  customsPdfBytes: Uint8Array;
  detectedLabelSizeMm: { width: number; height: number };
  detectedCustomsSizeMm: { width: number; height: number };
  warnings: string[];
}

export async function splitInternationalLabel(
  sourcePdfBytes: Uint8Array,
  template: ILSTemplate,
  manualSplitMm?: number   // only for 'manual' mode
): Promise<SplitResult>
```

**Split mode implementations:**

- `horizontal`: Crop page at `splitPositionMm` from top. Label = top region. Customs = bottom region.
- `vertical`: Crop page at `splitPositionMm` from left. Label = left region. Customs = right region.
- `two-page`: Extract `labelPageIndex` page as label. Extract `customsPageIndex` page as customs.
- `manual`: Same as `horizontal` but using `manualSplitMm` parameter provided by user interaction.

**Output processing:**
- Label output: crop the label region, then scale to exactly 4×6 inches (101.6×152.4mm) using `pdf-lib`'s page transform.
- Customs output: crop the customs region, keep original proportions, scale to fit 4×6 page with margins.
- Add watermark text `"FREE PREVIEW — labelhelper.com"` diagonally across both outputs when `watermark === true`.

**Tech:** Use `pdf-lib` for all PDF manipulation. Do NOT use server-side PDF libraries.

---

### 5.4 Watermark logic

Reuse the existing watermark pattern from `lib/template-pdfs.ts` (used in calibration sheet and test print pack).

- Free users: `watermark = !license.verified`
- VIP users: `watermark = false`
- Watermark text: `"FREE PREVIEW — labelhelper.com"`
- Watermark must not obscure the barcode region of the label.

---

### 5.5 Sample PDFs for testing

Add at least 2 sample PDFs to `/public/samples/ils/`:

- `sample-ebay-intl-a4.pdf` — a real or synthetically generated eBay international A4 label layout.
- `sample-etsy-intl-a4.pdf` — a real or synthetically generated Etsy international A4 label layout.

These samples must be verifiable with the tool itself and must NOT contain any real PII (use placeholder addresses).

Generate samples using `pdf-lib` at build time or provide as static files.

---

## 6. SEO Page Template

Each of the 5 new SEO landing pages follows this structure:

```
H1: {keyword phrase — e.g. "How to Print Etsy International Shipping Labels on a 4×6 Thermal Printer"}
↓
[Quick Answer card]
- The problem: Etsy international labels are A4 PDFs with both the shipping label and CN22 customs form combined.
- The fix: Use a label splitter tool to extract the 4×6 shipping label before printing.
↓
[International Label Splitter tool embedded — pre-filled with relevant template]
↓
H2: Why does [platform] generate A4 labels instead of 4×6?
H2: What is a CN22 customs form and do I need to print it?
H2: Step-by-step: split and print the label on a thermal printer
H2: Common mistakes when printing international shipping labels
H2: FAQ (5 Q&As, JSON-LD FAQPage schema)
↓
[Related pages: link to other ILS SEO pages + relevant existing troubleshooter pages]
[Affiliate banner: recommended thermal printer]
[AdSense in-content slot]
```

**Quick Answer card** (must appear above the fold, max 60 words):  
Format example:
> **Why is your Etsy international label too big for your thermal printer?**  
> Etsy international PDFs are formatted as A4 pages containing both the shipping label and a CN22 customs declaration form. A 4×6 thermal printer cannot print the full A4 page. You need to split the PDF to extract just the 4×6 label before printing.

This format is optimised for AI search citation (Perplexity, ChatGPT, Google AI Overview).

---

## 7. Pricing Page Update

Add the International Label Splitter to the VIP features list on `/pricing`.

Add line:
```
✅ International Label Splitter — split Etsy/eBay/Royal Mail international PDFs into 4×6 thermal-ready output
```

Do not add a separate pricing tier. This feature is part of the existing Pro Toolkit ($9 one-time).

---

## 8. Navigation / Tools Index Update

### `/tools` page
Add a new tool card:

```
Title: International Label Splitter
Description: Split Etsy, eBay, and Royal Mail international shipping PDFs into 4×6 thermal-printable labels and customs forms.
Icon: scissors or split icon (from existing icon set)
Badge: VIP
Link: /tools/international-label-splitter
```

---

## 9. Acceptance Criteria

The feature is complete when ALL of these are true:

- [ ] `/tools/international-label-splitter` returns 200 and passes Lighthouse SEO ≥ 95.
- [ ] All 8 templates produce non-empty label and customs outputs without throwing.
- [ ] Generic manual mode lets user drag a split line and produces correct output.
- [ ] Sample eBay and Etsy PDFs in `/public/samples/ils/` split correctly.
- [ ] Free user sees watermarked preview; VIP user sees watermark-free output.
- [ ] VIP badge displays correctly using `MemberFeatureShell` / `VipBadge` components.
- [ ] Privacy statement `🔒 Your PDF never leaves your browser` is visible above the dropzone.
- [ ] No PDF bytes are sent to any server endpoint (verify in browser Network tab).
- [ ] All 5 SEO landing pages return 200 with unique title, meta description, canonical, OG, FAQPage schema.
- [ ] `/sitemap.xml` includes all 6 new URLs (1 tool + 5 SEO pages).
- [ ] Pricing page lists the International Label Splitter as a VIP feature.
- [ ] Tools index card added.
- [ ] File size limit (20 MB) and page count limit (10 pages) show a clear error message.

---

## 10. Build Order (DO IN THIS ORDER)

### Step 1 — Data layer
1. Create `data/ils-templates.ts` with all 8 template definitions and correct geometry.
2. Add `ILSTemplate` type to the shared types file if one exists, or define in `data/ils-templates.ts`.
3. Generate 2 sample PDFs in `/public/samples/ils/` using `pdf-lib` (placeholder addresses only).

### Step 2 — Core split logic
4. Create `lib/ils-splitter.ts` implementing `splitInternationalLabel()`.
5. Write unit tests for all 4 split modes using the sample PDFs.
6. Verify watermark logic reuse from `lib/template-pdfs.ts`.

### Step 3 — Tool page
7. Create `app/tools/international-label-splitter/page.tsx`.
8. Create `components/tools/InternationalLabelSplitter.tsx` with full UI (template select, dropzone, preview, download buttons, VIP gate).
9. Wire `useStoredLicense()` for VIP state.
10. Use `MemberFeatureShell`, `VipBadge`, `MemberLockedCallout` from `components/MembershipBadge.tsx`.

### Step 4 — SEO pages
11. Create the 5 SEO landing pages as static SSG routes.
12. Add FAQPage JSON-LD schema to each.
13. Embed `<InternationalLabelSplitter>` with `defaultTemplate` prop pre-filled.

### Step 5 — Integration
14. Add tool card to `/tools` index page.
15. Update `/pricing` page VIP features list.
16. Verify `/sitemap.xml` includes all 6 new URLs.
17. Run Lighthouse on `/tools/international-label-splitter` — must pass SEO ≥ 95.

### Step 6 — QA
18. Upload `sample-ebay-intl-a4.pdf` → verify split → download label PDF → measure dimensions (must be 101.6×152.4mm).
19. Upload `sample-etsy-intl-a4.pdf` → same check.
20. Verify free-user watermark is present and does not overlap barcode zone.
21. Enter test license key → verify watermark disappears.
22. Check Network tab: no PDF bytes sent to server.

---

## 11. Out of Scope for V1

Do NOT build these in V1.

- Batch processing (multiple PDFs per session).
- OCR-based region detection (geometry-only in V1).
- Customs form auto-fill or editing.
- Non-4×6 thermal output sizes.
- Mobile app or browser extension.
- Any server-side PDF processing.
- CN23 form support (CN22 only in V1).
- Saved split configurations per user.

---

## 12. Reference: Common International Label Layouts

### eBay / Etsy International (A4 Horizontal Split)
```
┌─────────────────────────┐
│                         │ ← Shipping label (approx top 152mm)
│   SHIPPING LABEL        │   Contains: address, barcode, postage
│   (4×6 equivalent)      │
│                         │
├─────────────────────────┤ ← Split line (~152mm from top)
│                         │ ← CN22 Customs Form (approx bottom 145mm)
│   CN22 CUSTOMS FORM     │   Contains: contents description, value
│                         │
└─────────────────────────┘
     A4: 210mm × 297mm
```

### Royal Mail / Canada Post (Two-Page)
```
Page 1:                    Page 2:
┌─────────────────────────┐  ┌─────────────────────────┐
│                         │  │                         │
│   SHIPPING LABEL        │  │   CN22/CUSTOMS FORM     │
│   Full A4 page          │  │   Full A4 page          │
│                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘
```

### Australia Post (A4 Vertical Split)
```
┌────────────┬────────────┐
│            │            │
│  SHIPPING  │   CUSTOMS  │
│  LABEL     │   FORM     │
│  (left)    │   (right)  │
│            │            │
└────────────┴────────────┘
     A4: 210mm × 297mm
```

---

## 13. GEO / AI Search Optimisation Notes

For each SEO landing page, place a **Quick Answer block** (max 60 words, direct answer) at the very top of the page content, before any H2. This format is optimised for citation by Perplexity, ChatGPT, and Google AI Overview.

Keyword targets with estimated low competition:
- `split cn22 from shipping label pdf`
- `print international shipping label on thermal printer`
- `etsy international label 4x6 thermal`
- `ebay international label too big thermal`
- `customs form 4x6 thermal printer`

Each page must cite at least one outbound official source (Etsy Help, eBay Help, USPS PostalPro, Royal Mail, Australia Post) to qualify for AI engine trust signals.
