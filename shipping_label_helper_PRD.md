# Shipping Label Helper — Product Requirements Document (PRD)

**Version:** 1.0
**Owner:** 陈嘉伟
**Target implementer:** Claude Code (Desktop)
**Last updated:** 2026-05-10

---

## 0. How to use this PRD

This document is the single source of truth. Implement strictly in the order of Section 11 (Build Order). Do NOT skip sections. When in doubt, prefer:

1. Static / pre-rendered HTML over client-side rendering (SEO is the moat).
2. Pure front-end logic over backend (privacy is a selling point).
3. Programmatic SEO pages over hand-written marketing pages.
4. Boring, well-tested libraries over clever code.

The user (project owner) only handles: domain purchase, Cloudflare DNS, Creem account setup, AdSense application, Amazon Associates application. Everything else is the implementer's job.

---

## 1. Product summary

**Product name:** Shipping Label Helper (working title — final brand TBD; codename `slh` in code)

**One-liner:** A free shipping-label size checker, troubleshooter and template generator for small e-commerce sellers, with a license-key path for removing watermarks from advanced preview tools once checkout is connected.

**What it is:**
- A static-first website with embedded interactive tools.
- Helps sellers figure out the correct label size, print scale, and orientation for any platform × carrier × paper × printer combination.
- Diagnoses common print problems (label too small, cut off, barcode not scanning, not centered).
- Generates downloadable PDF/PNG blank templates and calibration sheets.
- Analyzes user-uploaded label PDFs **entirely in the browser** (privacy moat).

**What it is NOT:**
- NOT a postage generator.
- NOT a USPS/UPS/FedEx API client.
- NOT an account-based SaaS (no signup required for free tier).
- NOT a label-design tool (no drag-and-drop editor).

**Primary users:** Etsy / Shopify / eBay / Amazon FBA sellers, cross-border sellers, anyone printing USPS/UPS/FedEx/DHL labels at home with a thermal or inkjet/laser printer.

---

## 2. Business model & monetization

Current revenue model:

### 2.1 Free tier (AdSense + Affiliate)
- All static pages and basic tools are free, ad-supported.
- AdSense slots: result-page below-the-fold, article in-content (after H2 #2 and #4). **No ads above the fold.**
- Amazon Associates banners on printer-setup pages and template pages.
- Disable ads for verified license-key users via the local license check.

### 2.2 Pro access — **$9 USD one-time** (planned Creem product)
Current implementation is a preview-first paid path, not a full membership system:

- Checkout URLs are controlled by environment variables and may be missing.
- License keys are 64-character hex strings verified by `/api/verify-license`.
- A verified key is cached in `localStorage.slh_license` and `localStorage.slh_verified_until`.
- Verified users should see fewer ads and can remove evaluation watermarks where the tool supports it.
- Until real checkout, storage and email are connected, paid access must be described as "preview" or "not connected yet."

### 2.4 Pricing display rules
- Default currency USD.
- Pricing copy must clearly show checkout/license connection status.
- Do not promise subscriptions, team seats, batch limits, API access, automatic refunds, currency localization or guarantees until those features are implemented.

---

## 3. Target users & jobs-to-be-done

| User segment | Job-to-be-done | Page they land on |
|---|---|---|
| First-time Etsy seller | "I bought a 4×6 thermal printer, what setting do I use?" | `/etsy-shipping-label-size` |
| Shopify store owner | "My label prints too small, how do I fix it?" | `/shipping-label-printing-too-small` |
| eBay reseller | "Should I pick Fit to Page or Actual Size?" | `/fit-to-page-vs-actual-size-shipping-label` |
| Amazon FBA seller | "What's the FBA barcode label size?" | `/amazon-fba-label-size` |
| Cross-border seller (CN→US) | (Chinese-language) "速卖通 / Temu 怎么打 4×6" | `/zh/4x6-shipping-label-template` |
| Power user | "I need to verify whether this label PDF is the right page size before printing" | `/tools/pdf-analyzer` (preview / license-gated watermark removal) |

---

## 4. Information architecture & URL structure

### 4.1 Primary nav
```
Home  |  Tools  |  Guides  |  Templates  |  Pricing  |  Blog
```

### 4.2 URL map (MVP — 30 pages)

**Hub pages (5):**
- `/` — homepage with size checker hero
- `/tools` — tool index
- `/guides` — guide index
- `/templates` — template downloads index
- `/pricing` — pricing page

**Tool pages (6):**
- `/tools/size-checker` (free, the hero tool)
- `/tools/calibration-sheet` (watermarked preview; license removes watermark when enabled)
- `/tools/pdf-analyzer` (browser-local preview; license-gated advanced access/copy)
- `/tools/test-print-pack` (watermarked preview ZIP; license removes watermark when enabled)
- `/tools/barcode-quiet-zone-checker` (browser-local image/manual check; license-gated saved/advanced reports later)
- `/tools/scale-calculator` (free helper)

**Programmatic SEO — Platform pages (4):**
- `/etsy-shipping-label-size`
- `/shopify-shipping-label-size`
- `/ebay-shipping-label-size`
- `/amazon-fba-label-size`

**Programmatic SEO — Carrier pages (4):**
- `/usps-shipping-label-size`
- `/ups-label-size`
- `/fedex-label-size`
- `/dhl-shipping-label-size`

**Programmatic SEO — Template pages (3):**
- `/4x6-shipping-label-template`
- `/a4-shipping-label-template`
- `/letter-shipping-label-template`

**Programmatic SEO — Troubleshooter pages (5) — these are the SEO sweet spot:**
- `/shipping-label-printing-too-small`
- `/shipping-label-cut-off-when-printing`
- `/shipping-label-barcode-not-scanning`
- `/shipping-label-not-centered`
- `/fit-to-page-vs-actual-size-shipping-label`

**Static pages (3):**
- `/about`
- `/privacy` — must clearly state PDFs are processed locally
- `/terms`

### 4.3 Phase 2 expansion (after MVP, scaffolded but not built)
- Per-printer setup guides: `/printers/{slug}` for ~30 models (Rollo, MUNBYN, Dymo, Brother, Zebra families)
- Carrier expansion: Royal Mail, Canada Post, Australia Post, Japan Post
- Locales: `/zh/...`, `/es/...`

---

## 5. Detailed feature specs

### 5.1 FEATURE: Size Checker (free, hero tool)

**Page:** `/tools/size-checker` and embedded on `/`

**Inputs (all dropdowns):**
1. Platform: Etsy / Shopify / eBay / Amazon FBA / USPS direct / UPS direct / FedEx direct / DHL direct / Other
2. Carrier: USPS / UPS / FedEx / DHL / Royal Mail / Canada Post / Australia Post
3. Paper size: 4×6 / A4 / Letter / 6×4 (auto-equivalent) / Other
4. Printer type: Thermal (direct) / Inkjet / Laser
5. Use case (radio): "Just starting" / "Troubleshooting bad print" / "Picking new printer"

**Output (single result card):**
- **Verdict badge:** ✅ Compatible / ⚠️ Not ideal / 🟥 Not recommended
- **Recommended size:** e.g. "4 × 6 inches (101.6 × 152.4 mm)"
- **Print scale:** "100% — do NOT select Fit to Page"
- **Orientation:** Portrait / Landscape
- **Common mistakes (3-bullet checklist):** dynamic per combo
- **Action buttons:**
  - "Download blank template (PDF)" → free
  - "Download calibration sheet" → watermarked preview
  - "My label still looks wrong → run Diagnose" → links to PDF Analyzer preview
- **Carrier docs link:** outbound link to official spec

**Data source:** see Section 6 (Rules engine).

**Behavior:**
- All logic client-side. No network call required after page load.
- Result updates live as inputs change (no submit button).
- Result section gets `id="result"` and the URL updates query params (`?platform=etsy&carrier=usps&...`) for shareable links.

**Acceptance criteria:**
- All 9 platforms × 7 carriers × 4 paper × 3 printer = 756 combos must produce a non-empty result. Implement with explicit rule entries; fallback only for genuinely impossible combos with explanation.
- Lighthouse Performance ≥ 90 on this page.
- Result HTML is server-rendered (or pre-rendered) for the default `?platform=etsy&carrier=usps&paper=4x6&printer=thermal` so Google indexes useful content.

---

### 5.2 FEATURE: Label PDF Analyzer (preview-first; license-gated advanced access)

**Page:** `/tools/pdf-analyzer`

**Current behavior:** Page loads with the browser-local analyzer, sample demos and upload flow. It reads PDF page count and first-page dimensions locally, compares expected size, estimates scale, and generates a preview report PDF.

**Boundary:** It does not yet detect rendered barcode pixels or ink margins inside PDF content. Those remain manual/image-review checks and should be described honestly in UI.

**License behavior:** A verified license may unlock deeper checks, saved reports or watermark-free output as those pieces are implemented. Do not block the current page-size preview behind payment.

**User flow:**
1. Drop a PDF file onto the page (or click to select).
2. **All processing happens in browser via pdf.js + custom measurement code. No upload to server.** This must be visibly stated above the dropzone: "🔒 Your file never leaves your browser."
3. Output report card:
   - **Detected page size:** e.g. "3.94 × 5.91 in (10.0 × 15.0 cm)"
   - **Vs. expected:** if user selected expected size in Size Checker first, compare; else auto-detect from common sizes
   - **Scale factor:** e.g. "98.5% — your printer is shrinking by 1.5%"
   - **Margins:** manual review warning until rendered ink-bound detection exists
   - **Barcode regions detected:** manual/image-review warning until PDF barcode detection exists
   - **Quiet zone check:** link to the dedicated barcode quiet-zone checker
   - **Recommendations:** specific fixes ("In your print dialog, change scaling from 'Fit' to '100%'")
4. "Download full report PDF" button (generates a printable diagnostic).

**Tech requirements:**
- Use `pdf-lib` or a reliable browser-local PDF parser for page-box parsing.
- Use `pdf-lib` for generating diagnostic report PDF.
- File size limit 20 MB, page count limit 5 (clear error otherwise).
- Must work on iOS Safari (test on iPhone — many sellers use phones).

**Paywall integration:** see Section 7 (Payment & licensing).

---

### 5.3 FEATURE: Calibration Sheet Generator (watermarked preview; license removes watermark)

**Page:** `/tools/calibration-sheet`

**Inputs:**
- Paper size (4×6 / A4 / Letter)
- Printer type
- Optional: printer model dropdown (for known offsets)

**Output:** A PDF that, when printed, contains:
- Crosshair markers at each corner with mm rulers
- A 100mm reference line (user measures with a ruler to verify scale)
- Center crosshair for centering check
- Test barcode (Code128 with "TEST123") to verify barcode rendering
- Quiet-zone reference rectangles
- Filename: `slh-calibration-{paper}-{printer}.pdf`

**Current behavior:** Browser-local generation supports Letter, 4×6 and A4 previews with an evaluation watermark.

**License behavior:** A verified license can remove the watermark. Do not mention custom branding until it is implemented.

**Tech:** `pdf-lib` client-side.

---

### 5.4 FEATURE: Test Print Pack (watermarked preview; license removes watermark)

**Page:** `/tools/test-print-pack`

**Output:** A locally generated ZIP download containing test PDFs:
- 4×6 test labels for Rollo, MUNBYN, Dymo 4XL, Brother QL-1110, Zebra GX420
- A4 test sheets (1-up, 2-up, 4-up)
- Letter test sheets (1-up, 2-up, 4-up)
- 2×7 Dymo small test labels
- Barcode-only test pages

PDFs are generated in the browser. Free downloads include an evaluation watermark. A verified license can generate the ZIP without the watermark.

---

### 5.5 FEATURE: Barcode Quiet Zone Checker (browser-local preview; license-gated saved reports later)

**Page:** `/tools/barcode-quiet-zone-checker`

**Inputs:** Upload or paste a PNG/JPEG barcode image. PDF barcode analysis belongs in the PDF Analyzer flow first.

**Output:**
- Detected barcode region/type (best-effort)
- Quiet zone measurement (mm on each side)
- Pass/fail vs. GS1 standard (≥ 2.5mm for Code128, ≥ 4× module width)
- Visual overlay showing measured quiet zone

**Tech:** Browser-only image analysis using canvas. Manual measurements are available when detection is uncertain.

---

### 5.6 FEATURE: Scale Calculator (free helper)

**Page:** `/tools/scale-calculator`

Simple form: "I have an X inch label and want it to print at Y inches → use Z% scale". Two-way calculator. Targets the long-tail keyword `print shipping label scale calculator`.

---

### 5.7 FEATURE: Programmatic platform / carrier / template pages

**Template structure** (each page generated from a single data file):

```
H1: {Carrier} Shipping Label Size — Complete 2026 Guide
↓
[Quick answer card]
- Recommended size: 4 × 6 in
- Print scale: 100%
- Orientation: Portrait
↓
[Size Checker embedded — pre-filled with this page's combo]
↓
H2: What size is a {Carrier} shipping label?
H2: Can I print {Carrier} labels on A4 / Letter?
H2: What printer should I use?
H2: Common printing problems with {Carrier} labels
   - links to 5 troubleshooter pages
H2: Download {Carrier} blank template
   - PDF + PNG download buttons
H2: FAQ (5 Q&As, JSON-LD FAQPage schema)
↓
[Affiliate banner: recommended printer + paper]
[AdSense in-content slot]
```

**Word count target:** 800-1200 words per page. Use real data, real Reddit citations (link out), real screenshots (placeholder during build, real later).

**Schema markup required:**
- `Article` schema on guide pages
- `FAQPage` schema on FAQ blocks
- `SoftwareApplication` schema on `/` and `/tools/*`
- `BreadcrumbList` schema on all non-home pages

---

### 5.8 FEATURE: Troubleshooter pages

**Template structure** (decision-tree style):

```
H1: My Shipping Label is Printing Too Small — How to Fix It
↓
[Symptom selector]
- Tiny on 4×6 thermal? → solution A
- Tiny on Letter paper? → solution B
- Barcode specifically tiny? → solution C
↓
[Step-by-step fix with screenshots]
↓
[Download calibration sheet to verify fix → free CTA]
↓
[If still broken → run PDF Analyzer preview]
↓
H2: Why does this happen? (technical explanation)
H2: Reddit users with the same problem
   - 3 real Reddit thread quotes with attribution & link
H2: Related problems
   - links to 4 sibling troubleshooter pages
H2: FAQ
```

These pages are the **SEO sweet spot** — KD < 20, high intent, and convert into PDF Analyzer purchases.

---

## 6. Rules engine (the data moat)

### 6.1 Storage

Single file: `src/data/rules.ts` (or `.json` if simpler) — committed to repo.

### 6.2 Schema

```typescript
type Platform = 'etsy' | 'shopify' | 'ebay' | 'amazon_fba' | 'usps_direct' | 'ups_direct' | 'fedex_direct' | 'dhl_direct' | 'other';
type Carrier = 'usps' | 'ups' | 'fedex' | 'dhl' | 'royal_mail' | 'canada_post' | 'australia_post';
type Paper = '4x6' | 'a4' | 'letter' | '6x4' | 'other';
type Printer = 'thermal' | 'inkjet' | 'laser';

interface Rule {
  platform: Platform;
  carrier: Carrier;
  paper: Paper;
  printer: Printer;
  verdict: 'compatible' | 'not_ideal' | 'not_recommended';
  recommended_size: { width_in: number; height_in: number; width_mm: number; height_mm: number };
  print_scale: string;              // e.g. "100% (do not Fit to Page)"
  orientation: 'portrait' | 'landscape';
  common_mistakes: string[];        // 3 bullets, max
  notes: string;                    // 1-2 sentences
  official_doc_url?: string;        // outbound to USPS/UPS/etc.
}

interface RulesDB {
  rules: Rule[];
  defaults: Rule;                   // fallback for impossible combos
  version: string;
}
```

### 6.3 Coverage requirement

Implementer MUST populate ALL combinations. Use this priority:

1. **Tier 1 (must be hand-crafted, 60 entries):** Etsy/Shopify/eBay/Amazon FBA × USPS/UPS/FedEx/DHL × 4×6/Letter × thermal/laser.
2. **Tier 2 (can use templated text, ~200 entries):** other carriers / inkjet variants.
3. **Tier 3 (auto-generated with disclaimer):** remaining ~500 entries, marked `verdict: 'not_ideal'` with note "Unusual combination — verify with carrier documentation."

Each Tier 1 entry must cite at least one official URL (USPS PostalPro, UPS, FedEx, Etsy Help, Shopify Help, Amazon Seller Central).

### 6.4 Lookup function

```typescript
function lookup(p: Platform, c: Carrier, paper: Paper, pr: Printer): Rule
```
Exact match first. Fall back to `defaults` only if no rule exists.

---

## 7. Payment & licensing (Creem + license keys)

### 7.1 Why Creem
- Supports one-time products
- No company entity required
- Built-in EU VAT handling
- Lower friction than Stripe for non-US developers

### 7.2 Products (set up in Creem dashboard)
| Product | Type | Price | SKU |
|---|---|---|---|
| Pro Toolkit | one-time | $9 USD | `pro_lifetime` |

Do not add or advertise Workspace subscription products until batch/team/API functionality exists in the product.

### 7.3 Current checkout and unlock flow

1. Pricing reads checkout URLs from env vars through `lib/creem-client.ts`.
2. If checkout is not configured, pricing and paywall copy must say paid access is in preview mode.
3. `/thanks` and `/unlock` exist, but must be treated as license scaffolding until real checkout, storage and email are connected.
4. `/api/verify-license` verifies a 64-character hex key through `lib/license.ts`.
5. On success, the frontend stores:
   - `localStorage.slh_license`
   - `localStorage.slh_verified_until`
6. Paid UI should check the cached verified state before hiding ads or removing watermarks.

### 7.4 Future checkout flow

Only after Creem credentials, persistent storage and email delivery are chosen:

1. User clicks "Unlock for $9" → opens Creem-hosted checkout.
2. Creem redirects to `/thanks`.
3. Backend verifies the purchase and issues or finds a license.
4. User receives or copies the license key.
5. User enters the key at `/unlock`.

Do not claim automatic email delivery until it is implemented and tested.

### 7.5 Webhook handling

Endpoint: `POST /api/creem-webhook`

Current implementation verifies the webhook signature when configured and can issue a license through the same license scaffolding. It does not yet implement a complete production purchase lookup, durable database persistence, email delivery, subscription renewals or refund revocation.

Webhook handlers must stay idempotent before production use.

### 7.6 License key format
- 64 hex chars
- No PII embedded
- Lookup should use durable indexed storage before real payments go live.

### 7.7 Anti-abuse
- Add rate limiting to `/api/verify-license` before real payments go live.
- Do not add workspace seats or claim flows until there is a real workspace feature.

### 7.8 Refunds
- Refunds are manual until webhook-backed revocation is implemented.
- Do not display a money-back guarantee or self-serve refund copy until policy and automation are ready.

---

## 8. AdSense integration

### 8.1 Application
Project owner applies after site has 20+ pages of real content and ~30 days live. Implementer leaves placeholder slots.

### 8.2 Slot placement
- **Article in-content** (after H2 #2 and after H2 #4): 728×90 desktop, 320×100 mobile responsive.
- **Below tool result**: responsive square.
- **NO sticky bottom bar.**
- **NO above-the-fold ads.**

### 8.3 Implementation

```html
<!-- AdSense slot component -->
<div class="ad-slot" data-slot="in-content-1" data-paid-hide="true"></div>
```

Component logic:
- If `localStorage.slh_license` is verified-paid → render nothing.
- Else → inject AdSense `<ins>` tag.

Feature flag `ENABLE_ADSENSE` (env var, default `false` until approved).

### 8.4 Privacy
- AdSense consent banner via Google's CMP (required in EU).
- "Reject all" button visible at same level as "Accept all".

---

## 9. Tech stack

### 9.1 Required
- **Framework:** Next.js 14+ (App Router) — for SSG + API routes.
- **Hosting:** Vercel (free tier OK for MVP).
- **Styling:** Tailwind CSS + shadcn/ui components.
- **Database:** Cloudflare D1 (SQLite) OR Supabase free tier — for license keys only.
- **Email:** Resend.com (free tier for MVP).
- **PDF parsing:** pdf.js (Mozilla).
- **PDF generation:** pdf-lib.
- **Barcode detection:** @zxing/browser.
- **Analytics:** Plausible (paid) OR Umami (self-hosted) — NOT Google Analytics initially (avoid consent banner complexity until AdSense forces it).
- **Search Console:** verify domain via DNS TXT record (project owner does this).
- **Sitemap:** generated at build time.

### 9.2 Forbidden
- ❌ No client-side rendering for SEO pages (must be SSG or SSR).
- ❌ No user accounts / passwords (license keys only).
- ❌ No image hosting on project domain that could be hotlinked — use Vercel image optimizer or Cloudflare Images.
- ❌ No uploading user PDFs to server (privacy moat).
- ❌ No Google Fonts via CDN in EU build (GDPR — self-host fonts).

### 9.3 Repo structure
```
/
├── app/                    # Next.js app router
│   ├── (marketing)/        # static-ish pages
│   ├── tools/              # tool pages
│   ├── api/                # webhook + license endpoints
│   └── [slug]/             # programmatic SEO routes
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── tools/              # SizeChecker, PDFAnalyzer, etc.
│   └── ads/                # AdSlot
├── lib/
│   ├── rules-engine.ts
│   ├── license.ts
│   ├── creem-client.ts
│   └── pdf-utils.ts
├── data/
│   ├── rules.ts            # the rules DB
│   ├── platforms.ts
│   ├── carriers.ts
│   └── printers.ts
├── public/
│   ├── templates/          # pre-built PDFs
│   └── samples/            # sample label PDFs for analyzer demo
└── content/
    └── pages/              # MDX content for guides
```

---

## 10. SEO requirements

### 10.1 Mandatory on every page
- Unique `<title>` (50-60 chars), `<meta description>` (140-160 chars).
- Canonical URL.
- Open Graph + Twitter Card tags.
- Schema markup per Section 5.7.
- Hreflang tags if multilingual.
- Internal links: every page links to at least 3 other pages (use a `RelatedLinks` component).

### 10.2 Performance budgets
- LCP < 2.0s on 4G mobile
- CLS < 0.05
- INP < 200ms
- Total page weight < 300KB (excluding ads)

### 10.3 Sitemap
- Auto-generated at build time → `/sitemap.xml`
- `/robots.txt` allows all, points to sitemap.

### 10.4 Content guidelines
- Every Tier 1 page must include at least one outbound citation to an official source.
- Every troubleshooter page must include at least one Reddit/Shopify-community thread quote with attribution and link.
- No AI-generated thin content. Each page must include at least one piece of unique data: a screenshot, a measurement, a comparison table, or original test result.

---

## 11. Build order (DO IN THIS ORDER)

### Phase 1 — Foundation (Day 1)
1. ✅ Init Next.js 14 + Tailwind + shadcn.
2. ✅ Set up Vercel project.
3. ✅ Implement `data/rules.ts` with Tier 1 entries (60 hand-crafted).
4. ✅ Build `lib/rules-engine.ts` with `lookup()` and unit tests.
5. ✅ Build `<SizeChecker>` component.
6. ✅ Ship `/` with embedded SizeChecker.

### Phase 2 — SEO surface (Days 2-3)
7. Build programmatic page generator: feed `data/rules.ts` → render 16 platform/carrier/template pages.
8. Build 5 troubleshooter pages (hand-written content + decision tree component).
9. Implement `<FAQ>`, `<RelatedLinks>`, `<Breadcrumb>` components.
10. Add all schema markup.
11. Generate `/sitemap.xml`, `/robots.txt`.
12. Implement `<AdSlot>` component (with feature flag off).

### Phase 3 — Free templates (Day 3)
13. Pre-build template PDFs (4×6, A4, Letter blank labels) using `pdf-lib` at build time.
14. Build `/templates` index + per-size landing pages.

### Phase 4 — Preview tools and license gating (Days 4-5)
15. Build `<CalibrationSheetGenerator>` (watermarked preview; license removes watermark).
16. Build `<PDFAnalyzer>` page-box preview and report export. Do not claim barcode/ink-bound detection until implemented.
17. Build `<TestPrintPack>` page (browser-generated watermarked ZIP; license removes watermark).
18. Build `<BarcodeQuietZoneChecker>`.
19. Build `<Paywall>` component that honestly reflects checkout/license status.

### Phase 5 — Payment and license scaffolding (Day 5)
20. Set up Creem account (project owner).
21. Configure the `pro_lifetime` product only when the product owner is ready to test checkout.
22. Implement `/api/issue-license`, `/api/verify-license`, `/api/creem-webhook`.
23. Choose durable license storage before real payments go live.
24. Choose email delivery only if automatic license email is required.
25. Build `/pricing`, `/thanks`, `/unlock` pages.
26. End-to-end test: Creem test checkout → license issue → `/unlock` → watermark/ad state.

### Phase 6 — Polish & launch prep (Days 6-7)
27. Real screenshots / illustrations for top 10 pages.
28. Privacy policy + Terms (use templates, customize for "PDFs processed locally").
29. Cookie/consent banner.
30. Submit `/sitemap.xml` to Google Search Console (project owner).
31. Apply for AdSense (project owner; flip env var when approved).
32. Apply for Amazon Associates (project owner).
33. Soft launch: post to r/Etsy, r/shopify, r/Flipping with genuine helpful comments linking to relevant troubleshooter pages.

---

## 12. Acceptance criteria (definition of done)

The MVP is complete when ALL of these are true:

- [ ] All 30 MVP URLs return 200 and pass Lighthouse SEO ≥ 95.
- [ ] Size Checker handles all 756 input combinations without throwing.
- [ ] PDF Analyzer correctly measures the 5 sample PDFs in `/public/samples/`.
- [ ] Calibration Sheet Generator produces a valid PDF for every (paper × printer) combo.
- [ ] Test Print Pack ZIP contains the expected generated PDFs and clearly marks evaluation watermarks when no license is verified.
- [ ] License key verification works in the configured environment and caches `slh_license` / `slh_verified_until` locally.
- [ ] Verified license state removes ads and removes watermarks in tools that support unwatermarked output.
- [ ] All pages have unique `<title>`, meta description, canonical, OG tags, schema markup.
- [ ] `/sitemap.xml` lists all 30 URLs.
- [ ] `/robots.txt` is correct.
- [ ] Privacy policy explicitly states PDFs are processed locally.
- [ ] AdSense slots are present (with feature flag off until approval).
- [ ] No label PDF/image content is sent to the server or third parties.

---

## 13. Out of scope for MVP

These are explicitly NOT in the MVP. Do not build them.

- Per-printer setup pages (Phase 2)
- Custom branding upload for calibration sheets (Phase 2)
- API access endpoint (Phase 2)
- Team workspace seat management UI (Phase 2)
- Batch PDF checks (Phase 2)
- Workspace subscription products (Phase 2, only after real team/batch features exist)
- Automatic refund revocation (Phase 2)
- Mobile app
- Browser extension
- AI-generated label-design
- Any postage / shipping API integration
- User accounts with passwords
- Real-time chat support

---

## 14. Open decisions for project owner (pre-launch)

The project owner must answer these BEFORE Day 5:

1. **Final brand name + domain.** Suggested checks: `labelsizer.com`, `labelfit.app`, `printlabelright.com`, `shippinglabelhelp.com`. (Implementer continues with codename `slh` until decided.)
2. **Creem account confirmed and `pro_lifetime` product created.**
3. **License storage choice** before real payments go live.
4. **Email delivery choice** only if license keys should be emailed automatically.
5. **Support/refund contact email** before paid checkout is public.

---

## 15. Reference data appendix

### 15.1 Standard label sizes
| Name | Inches | Millimeters |
|---|---|---|
| 4 × 6 | 4.00 × 6.00 | 101.6 × 152.4 |
| 6 × 4 | 6.00 × 4.00 | 152.4 × 101.6 |
| A4 | 8.27 × 11.69 | 210 × 297 |
| Letter | 8.50 × 11.00 | 215.9 × 279.4 |
| Legal | 8.50 × 14.00 | 215.9 × 355.6 |
| Dymo small | 2.31 × 4.00 | 58.7 × 101.6 |
| Dymo large | 2.13 × 4.00 | 54.0 × 101.6 |

### 15.2 Carrier official label-size docs (for citations)
- USPS: PostalPro Parcel Labeling Guide (postalpro.usps.com)
- UPS: ups.com/content/us/en/help-center/sri/printer-setup
- FedEx: fedex.com/en-us/shipping/online/label-printing.html
- DHL: dhl.com (search "shipping label specifications")
- Etsy: help.etsy.com (search "shipping label printer")
- Shopify: help.shopify.com/manual/orders/shipping-labels
- Amazon FBA: sellercentral.amazon.com (search "FBA label requirements")

### 15.3 Affiliate programs to integrate (post-launch)
- Amazon Associates (Rollo, MUNBYN, Dymo, Brother label printers + 4×6 paper)
- Shippo Partner Program (apply)
- ShipStation Partner Program (apply)
- Pirate Ship: NO affiliate (do not waste time looking)

---

## 16. Implementation notes for Claude

- **Be aggressive about static generation.** Every SEO page must be SSG. Use `generateStaticParams` in Next.js for programmatic routes.
- **Privacy is a marketing feature, not just compliance.** Every PDF tool's UI must visibly state "🔒 Processed locally in your browser."
- **The rules data file is the moat.** Spend real care on Tier 1 entries — citations, accurate sizes, real common-mistake bullets. Do NOT lazily fill with templated text.
- **Test on iOS Safari.** Many Etsy sellers print from a phone. PDF tools that break on iOS = lost revenue.
- **Ship the SEO surface FIRST.** Tools without traffic make $0. The first 5 days should prioritize indexable content over fancy tooling.
- **Commit and push after every phase.** The project owner reviews via GitHub.
