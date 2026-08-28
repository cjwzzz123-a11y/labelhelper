# STATUS

## Current state

- Project: Shipping Label Helper
- Repository path: `labelhelper`
- Branch: `main`
- SEO optimization round: first batch deployed; evidence-sensitive content batch validated locally and pending push
- Validation status: 38 tests, lint, Next.js 16.3.3 build, 143-URL SEO smoke, and production dependency audit passed

## Latest SEO work

- Added shared 1200×630 social artwork and complete OG/Twitter metadata.
- Reduced indexed URLs from 176 to 143 by redirecting incomplete translations to English canonicals.
- Cleared duplicate-title/description families in the local sitemap crawl.
- Replaced false universal size and carrier-compatibility claims with page-specific facts and evidence limitations.
- Added a repeatable full-site SEO smoke test and current quality log.
- Production-crawled 143/143 sitemap pages after `c36d603`; every page returned 200 and exposed an Open Graph image, with no duplicate title or description groups.
- Rewrote three high-risk carrier-handling pages around first-party evidence, explicit reprint conditions, and non-guarantee language.
- Rebuilt the four Amazon and five core-symptom long-tail pages with distinct device/workflow decisions, visible evidence scope, stop/reprint gates and current source citations.

- Expanded programmatic SEO coverage and internal guide hub coverage already present in working tree.
- Fixed high-priority technical SEO risks before deployment:
  - Added page-level `noindex` to utility/payment routes where needed.
  - Prevented untranslated SEO pages from being rendered as localized pages.
  - Reduced duplicate structured data risk on programmatic SEO pages.
  - Kept sitemap/robots/canonical/hreflang-oriented changes in the deploy set.
- Hardened localized SEO routing in the second round:
  - Added the next-intl locale request header in `proxy.ts` so localized routes can render the correct root document language.
  - Expanded robots disallow coverage for localized `/thanks` and `/unlock` utility routes.
  - Added regression tests for canonical, hreflang, sitemap, robots, locale routing, and print-dialog long-tail clustering.
  - Strengthened the PDF/Chrome/Mac Preview print-dialog content cluster with task-specific FAQs and checklists.

## Deployment state

- Vercel successfully deployed first-round commit `c36d603` on 2026-08-29 (Asia/Shanghai).
- Push the validated evidence-sensitive follow-up, then confirm its exact production SHA and recrawl production.
