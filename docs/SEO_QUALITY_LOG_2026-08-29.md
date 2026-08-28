# SEO and content quality log — 2026-08-29

## Goal

Improve discoverability without publishing misleading carrier claims or untranslated duplicate pages. The primary audience is ecommerce sellers and home/thermal-printer users, not software developers.

## Baseline

Production crawl before this change covered 176/176 sitemap URLs successfully.

- 176 pages missing `og:image`
- 95 titles longer than 65 characters
- 17 titles with a duplicated brand
- 9 exact duplicate title groups and 9 exact duplicate description groups
- 34 non-English URLs using English metadata/content fallbacks
- 21 descriptions longer than 170 characters
- 28 apparent short-description warnings, almost entirely caused by applying a Latin character threshold to Chinese/Japanese

The baseline was technically crawlable: all sitemap pages returned 200, had a self-canonical, one H1, a language attribute, and parseable JSON-LD.

## Implemented

- Added a generated 1200×630 Open Graph image and shared Open Graph/Twitter image metadata.
- Centralized title de-branding, concise `LabelHelper` search branding, complete-sentence description guarding, and absolute page titles.
- Replaced verbose/date-sensitive metadata generators and added explicit intent-preserving titles for long-tail outliers.
- Added a route-language support matrix. Untranslated locale URLs now 308 to the English canonical; `/en/...` also consolidates to the unprefixed canonical.
- Fixed Spanish template copy selection and translated the custom home/pricing decision UI for indexed locales.
- Reduced the sitemap from 176 to 143 truthful, translated/canonical URLs.
- Removed an internal Search Console consolidation note from the public guides page.
- Removed the universal `4×6 / 100% / Portrait` fact box from troubleshooting pages and made A4/Letter template facts match the page.
- Reframed “compatible” output as a paper/printer fit check, explicitly not a platform/carrier acceptance result.
- Added visible official starting-point links on platform/carrier guides and replaced unsupported “recurring support patterns” language with a clear evidence limitation.
- Removed the false `price: 0` offer from paid-capable SoftwareApplication schema.
- Removed the unimplemented saved-printer-profile promise from the calibration paywall.
- Upgraded Next.js and its ESLint config from 16.2.6 to 16.3.3; the production dependency audit now reports zero known vulnerabilities.

## Verification

Passed locally:

- `npm test`: 35/35 tests
- `npm run lint`
- `npm run build`: 254 generated route variants
- `npm run smoke:seo`: 143 sitemap URLs, 160 internal paths, one 1200×630 PNG social route, and six 308 redirect contracts
- `npm audit --omit=dev`: zero production vulnerabilities

The first production deployment of this round succeeded at commit `c36d603`. A live follow-up crawl covered 143/143 sitemap URLs with HTTP 200, absolute social images on every page, zero duplicate title groups, zero duplicate description groups, and no missing canonical/H1/JSON-LD findings. The remaining generic crawler warnings were 28 CJK description-length flags plus three short-title flags; those are interpreted separately from missing or duplicate metadata because Latin character thresholds are not a valid CJK quality measure.

## Evidence-sensitive content pass

- Rewrote the carrier-acceptance page so it no longer treats label size or a phone scan as proof of USPS, UPS or FedEx acceptance.
- Rewrote the trim/fold/tape guide with explicit reprint conditions and first-party USPS/FedEx placement guidance.
- Rebuilt the preflight checklist around comparison with the original PDF, unchanged scan-critical content, flat placement, and a stop/escalate rule.
- Added claim-level first-party links, supported-claim notes, independent checked dates, and Schema.org `citation` URLs to those three pages.
- Replaced generic Mercari, ShipStation and DYMO fallbacks with product-specific setup paths backed by their current first-party help or manuals.
- Corrected two Pirate Ship guides against current first-party behavior, including template-specific scaling and the refund/replacement path for a label purchased at the wrong size.
- Rebuilt six eBay/Shopify print-failure pages around each platform's current format-selection and reprint flow, with USPS/FedEx handling evidence where a page discusses trimming or tape.
- Replaced four cross-platform fallback pages with decision-specific workflows for wrong paper, recurring crop, desktop 4×6 printing, and Letter-to-thermal extraction.
- Changed the About title from a generic one-word label to a task-descriptive search title.

The smoke test uses language-aware description thresholds so Chinese and Japanese are not padded merely to satisfy a Latin-text rule.

## Remaining evidence-backed work

1. The official-source registry was last fully checked on 2026-05-12. Each carrier/platform claim needs a precise first-party URL and claim-level review before changing that date.
2. Nine long-tail troubleshooting pages still share generic fallback sections: four Amazon variants plus five core symptom pages whose decision trees are already unique. Preserve URLs until real Search Console query/page data exists and prioritize the Amazon claims for first-party review.
3. Public HTML currently uses `private, no-cache, no-store`. Investigate the `next-intl` request-locale architecture before changing caching; do not trade correct locale output for a speculative performance win.
4. Search Console and Vercel Analytics were not available in the local audit. Index coverage, impressions, CTR, Core Web Vitals, and conversions must be evaluated after deployment with real data.
5. Development-only dependency advisories remain in the local toolchain; production dependencies are clean. Upgrade those packages separately with their own test cycle.

## Next acceptance gate

- No title/description duplicate groups among sitemap URLs.
- No incomplete-language page in sitemap or hreflang.
- Every sitemap page has an absolute social image, canonical, self hreflang, x-default, one H1, parseable JSON-LD, and working internal links.
- No template or troubleshooting page displays a fact that contradicts its own paper size or intent.
- No UI or schema claims a free feature, supported carrier combination, or implemented capability that the runtime does not provide.
- Any new carrier/platform assertion has a first-party source, a specific supported claim, and a checked date.
