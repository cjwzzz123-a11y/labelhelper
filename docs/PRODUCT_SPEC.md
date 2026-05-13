# Shipping Label Helper Product Spec

Last maintained: 2026-05-13

This document is the operating spec for the product, membership boundaries, user flows, and code-level logic. `shipping_label_helper_PRD.md` remains the original PRD; this file is the living implementation guide for people maintaining the current codebase.

## 1. Product Summary

Shipping Label Helper helps sellers verify label size, scale, orientation, blank templates, calibration sheets, PDF page size, and barcode quiet-zone risk before printing paid postage.

The product is static-first and local-first:

- SEO pages and guide hubs are rendered with Next.js App Router.
- Core tools run in the browser.
- User PDFs and barcode images are processed locally in browser memory.
- There is no user account system. Paid access is represented by a license key cached on the browser.

## 2. Free vs VIP

### Free Features

Free features must remain usable without signup, checkout, or a license key.

- Home page start check: `/` with `SizeChecker`.
- Basic ratio/scale calculation: `/tools/scale-calculator`.
- Blank 4x6/A4/Letter templates: `/templates` and `/api/templates/[slug]`.
- Basic guides and programmatic SEO pages: `/guides`, `/[slug]`, localized variants.
- Watermarked previews:
  - Calibration sheet preview.
  - Single test print preview PDFs.
  - Browser-local PDF analyzer preview content.
  - Browser-local barcode quiet-zone preview/check.

### VIP Features

VIP features are the conversion surface. They must be visually marked with a VIP badge at the top-right of the relevant container and must check the shared browser license state.

- Watermark-free calibration page download.
- Test print pack ZIP download.
- Full PDF analysis report download/save report.
- Barcode quiet-zone advanced checks/save report.
- Future batch checks and saved printer configuration.

Current implementation status:

- Watermark-free calibration sheets are implemented through `createCalibrationPdf(..., !license.verified)`.
- Test print pack ZIP is VIP-gated in `TestPrintPack`; free users keep single watermarked preview PDFs.
- PDF analyzer currently performs page-box checks. Full report/save report is the VIP action surface.
- Barcode quiet-zone checker currently performs browser-local image/manual checks. Saved reports and advanced checks are VIP action surfaces.
- Batch checks and saved printer configuration are not implemented yet and must stay described as planned/future unless code lands.

## 3. Membership Logic

### Client License State

Source: `lib/client-license.ts`

The browser stores:

- `localStorage.slh_license`
- `localStorage.slh_verified_until`

`useStoredLicense()` is the single client-side membership state hook. It returns:

- `key`: cached key.
- `verifiedUntil`: expiry ISO string.
- `verified`: true only when the key is 64 hex chars and `verifiedUntil` is in the future.

All VIP UI and VIP download behavior should use `useStoredLicense().verified`.

### Server Verification

Source: `lib/license.ts`, `app/api/verify-license/route.ts`

License keys are 64-character hex strings. The current service supports:

- Local test mode with `SLH_ENABLE_TEST_LICENSE=true` and the all-zero test key.
- Memory storage when `LICENSE_STORAGE_DRIVER=memory` or test mode is enabled.
- Placeholder behavior when checkout/storage/email are not configured.
- Creem webhook scaffolding, but not a complete production purchase lookup and email delivery flow.

`POST /api/verify-license` returns:

- `valid`: active license boolean.
- `configured`: whether license verification is connected.
- `reason`: human-readable status.
- `nextAction`: `continue`, `check_key`, or `use_free_tools`.
- `verifiedUntil`: expiry when available.
- `status`: license service readiness summary.

### Important Rule

Do not introduce another independent membership state. If a component temporarily verifies a key, it must call `saveVerifiedLicense()` so the shared browser state updates everywhere.

## 4. Visual Membership System

Source: `components/MembershipBadge.tsx`

Use these shared components:

- `VipBadge`: right/top VIP marker for paid surfaces.
- `FreeBadge`: marker for always-free surfaces.
- `MemberFeatureShell`: VIP-styled container with top-right badge.
- `MemberLockedCallout`: small upgrade prompt for locked actions.

Visual intent:

- Free surfaces use sky/white, plain utility wording, and no locked visual treatment.
- VIP surfaces use amber when locked and emerald when unlocked.
- VIP containers should have a badge in the upper-right corner.
- The primary CTA for a locked VIP action should route to `/pricing` or `/unlock`, not silently download the paid output.

## 5. Core User Flows

### Flow A: First-Time Seller Checks Setup

1. User lands on `/`.
2. User selects marketplace, carrier, paper, printer, and use case in `SizeChecker`.
3. Result recommends size, scale, orientation, mistakes, and next step.
4. User can use free blank templates or continue to calibration/PDF/barcode tools.

Code:

- `components/tools/SizeChecker.tsx`
- `lib/rules-engine.ts`
- `lib/size-checker-next-step.ts`

### Flow B: Free Blank Template

1. User opens `/templates` or `/test-print`.
2. User chooses 4x6, A4, or Letter.
3. User downloads a blank PDF through `/api/templates/[slug]`.
4. PDF has borders/scale guides only and no carrier barcode or postage.

Code:

- `app/templates/page.tsx`
- `app/api/templates/[slug]/route.ts`
- `lib/template-pdfs.ts`

### Flow C: VIP Calibration Sheet

1. User opens `/tools/calibration-sheet`.
2. Free user sees VIP-marked generator and can download a watermarked preview.
3. Verified VIP user downloads the same sheet without `FREE PREVIEW` watermark.
4. Future saved printer profiles belong to VIP, but are not implemented yet.

Code:

- `components/tools/CalibrationSheetGenerator.tsx`
- `lib/template-pdfs.ts:createCalibrationPdf`

### Flow D: VIP Test Print ZIP

1. User opens `/tools/test-print-pack`.
2. Free user can download single watermarked preview PDFs.
3. Bundled ZIP is a VIP action; locked users are sent to pricing/unlock.
4. Verified VIP user downloads `slh-test-print-pack.zip` without evaluation watermarks.

Code:

- `components/tools/TestPrintPack.tsx`
- `lib/template-pdfs.ts:createTestPrintPdf`

### Flow E: PDF Analyzer

1. User opens `/tools/pdf-analyzer`.
2. User runs a sample or uploads a PDF.
3. PDF is loaded in the browser with `pdf-lib`.
4. Tool detects page count and first page size, estimates scale, and shows warnings for manual margin/barcode review.
5. The downloadable artifact is a diagnostic summary, not a complete technical report. It contains file name, page count, detected page size, expected size, scale estimate, warnings, and recommendations.
6. Summary PDF/save summary is VIP. Current implementation must not claim rendered barcode detection.

Code:

- `components/tools/PdfAnalyzer.tsx`

### Flow F: Barcode Quiet-Zone Checker

1. User opens `/tools/barcode-quiet-zone-checker`.
2. User uploads/pastes a PNG/JPEG or uses manual measurements.
3. Tool uses local canvas logic to estimate region and quiet-zone measurements.
4. Basic check is free. Saved reports/advanced barcode checks are VIP.

Code:

- `components/tools/BarcodeQuietZoneChecker.tsx`

### Flow G: License Unlock

1. User opens `/unlock`.
2. User enters 64-character license key.
3. Client calls `/api/verify-license`.
4. If valid, `saveVerifiedLicense()` writes key and expiry to localStorage.
5. Any component using `useStoredLicense()` updates through `slh-license-change`.

Code:

- `components/UnlockLicenseForm.tsx`
- `app/api/verify-license/route.ts`

## 6. UI Text and Button Inventory

The generated UI inventory lives at:

- `docs/ui-copy-inventory.generated.md`

It is generated by:

- `scripts/maintain_product_docs.mjs`

Every visible text/button entry should include:

- Source file.
- Line number.
- Text or source expression.
- UI role inferred by the scanner.
- Membership classification when obvious.
- Maintainer note.

Manual policy:

- For any new button, add clear copy and make sure it appears in the generated inventory.
- For any new VIP button, route locked users to `/pricing` or `/unlock`, and use the shared VIP visual components.
- For any future feature, label it as planned until there is working code.

## 7. Page-Level Spec

### `/`

Purpose: primary free setup check.

Membership: free.

Main CTA behavior: start/check setup through `SizeChecker`.

### `/tools/scale-calculator`

Purpose: free correction percentage calculator.

Membership: free.

Main CTA behavior: calculate corrected print scale.

### `/templates`

Purpose: free blank template hub.

Membership: free.

Main CTA behavior: download blank PDF or open setup guide.

### `/guides` and SEO pages

Purpose: acquisition and education.

Membership: free.

Main CTA behavior: guide users into free checker, templates, or VIP tools when relevant.

### `/tools/calibration-sheet`

Purpose: calibration PDF generation.

Membership: mixed. Preview is free; watermark-free download is VIP.

### `/tools/test-print-pack`

Purpose: printer test artifacts.

Membership: mixed. Single preview PDFs are free; bundled ZIP is VIP.

### `/tools/pdf-analyzer`

Purpose: browser-local PDF page-size analysis.

Membership: mixed. Preview analysis is free; diagnostic summary download/save summary is VIP.

### `/tools/barcode-quiet-zone-checker`

Purpose: browser-local barcode whitespace risk check.

Membership: mixed. Basic check is free; saved report/advanced check is VIP.

### `/pricing`

Purpose: explain free/VIP split and checkout readiness.

Membership: public.

Must not overclaim production checkout when Creem/storage/email are not configured.

### `/unlock`

Purpose: cache a valid license key on this browser.

Membership: public unlock utility.

## 8. Product Copy Rules

- Prefer concrete action copy over marketing claims.
- Do not say "full barcode detection" until rendered barcode detection exists.
- Do not call the PDF artifact a "full report" unless it contains deeper rendered-ink and barcode checks. The current artifact is a "diagnostic summary".
- Do not say "saved report" is available unless the button/action exists and stores/downloads the report.
- Do not claim automatic email delivery until Resend and webhook flow are configured and tested.
- Do not claim batch checks or saved printer configuration until implemented.
- Privacy copy may say browser-local for the tool logic, but avoid implying no third-party scripts ever run on the page if ads/analytics are enabled later.

## 9. Maintenance Automation

The product documentation maintenance job is defined by:

- `scripts/maintain_product_docs.mjs`
- `.planning/product-docs/com.jiawei.shipping-label-helper.product-docs.plist`

It scans UI strings and writes:

- `docs/ui-copy-inventory.generated.md`
- `.planning/product-docs/latest.md`
- `.planning/product-docs/logs/*.log`

The job prints a short self-encouragement line at the end of every successful run, as requested. Keep that output in logs only; do not add encouragement text to the user-facing product UI.
