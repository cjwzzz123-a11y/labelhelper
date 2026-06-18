# DECISIONS

## 2026-06-19 SEO optimization deployment round

- Treat `/Users/jiawei/Desktop/刘小排` as the target SEO repository because it is the Shipping Label Helper Next.js app connected to `labelhelper.git`.
- Preserve existing uncommitted SEO work and make only focused risk-reduction changes before deployment.
- Use the existing programmatic SEO architecture instead of introducing a new routing/content system.
- Prefer page-level `noindex` for utility/payment routes instead of relying only on `robots.txt` disallow rules.
- Do not render English SEO content under untranslated locale routes because it creates international SEO quality risk.
- Avoid duplicate BreadcrumbList JSON-LD on generated SEO pages; one breadcrumb schema source is enough.
- Validate locally with tests, lint, and production build before pushing to GitHub/Vercel.
