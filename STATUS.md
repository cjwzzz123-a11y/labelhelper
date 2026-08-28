# STATUS

## Current state

- Project: Shipping Label Helper
- Repository path: `labelhelper`
- Branch: `main`
- SEO optimization round: multi-round technical SEO, evidence, platform, symptom, and navigation work deployed; direct-link cleanup validated for deployment
- Validation status: 38 tests, lint, Next.js 16.3.3 build, 143-URL locale-aware SEO smoke, 149 direct internal paths, and production dependency audit passed

## Latest SEO work

- Added shared 1200×630 social artwork and complete OG/Twitter metadata.
- Reduced indexed URLs from 176 to 143 by redirecting incomplete translations to English canonicals.
- Cleared duplicate-title/description families in the local sitemap crawl.
- Replaced false universal size and carrier-compatibility claims with page-specific facts and evidence limitations.
- Added a repeatable full-site SEO smoke test and current quality log.
- Production-crawled 143/143 sitemap pages after `c36d603`; every page returned 200 and exposed an Open Graph image, with no duplicate title or description groups.
- Rewrote three high-risk carrier-handling pages around first-party evidence, explicit reprint conditions, and non-guarantee language.
- Rebuilt the four Amazon and five core-symptom long-tail pages with distinct device/workflow decisions, visible evidence scope, stop/reprint gates and current source citations.
- Replaced the retired FedEx label-help URL with the current official label-creation guide and verified the new destination returns HTTP 200.
- Removed 40 avoidable internal redirect hops: localized navigation now links directly to the available English fallback and marks it `EN`, while the size-checker call to action points directly to the homepage checker anchor.
- Tightened the SEO smoke test so a crawled internal link must return direct HTTP 200; redirects are accepted only in the six explicit legacy-route contracts.

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

- Vercel successfully deployed the evidence/content sequence through `956396d` on 2026-08-29 (Asia/Shanghai).
- Confirm the exact production SHA for the direct-link cleanup and recrawl the production site after deployment.
