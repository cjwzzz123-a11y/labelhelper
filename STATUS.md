# STATUS

## Current state

- Project: Shipping Label Helper
- Repository path: `labelhelper`
- Branch: `main`
- SEO optimization round: 2026-08-29 quality round validated locally; push/deployment pending
- Validation status: 35 tests, lint, Next.js 16.3.3 build, 143-URL SEO smoke, and production dependency audit passed

## Latest SEO work

- Added shared 1200×630 social artwork and complete OG/Twitter metadata.
- Reduced indexed URLs from 176 to 143 by redirecting incomplete translations to English canonicals.
- Cleared duplicate-title/description families in the local sitemap crawl.
- Replaced false universal size and carrier-compatibility claims with page-specific facts and evidence limitations.
- Added a repeatable full-site SEO smoke test and current quality log.

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

- `origin/main` was at `e72b7e2` before this round.
- Push the validated local HEAD to trigger Vercel, then confirm the exact deployed SHA and recrawl production.
