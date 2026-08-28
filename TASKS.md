# TASKS

## Completed

- Audit all 176 production sitemap URLs and quantify metadata/i18n/content issues.
- Add default Open Graph/Twitter artwork and enforce metadata contracts.
- Consolidate incomplete locale variants and fix Spanish template copy.
- Correct page facts, carrier-support wording, structured-data price, and unimplemented saved-profile copy.
- Add a sitemap-driven SEO smoke test covering 143 URLs and 160 internal paths.
- Upgrade Next.js to 16.3.3 and clear production dependency advisories.

- Audit current SEO working tree.
- Fix high-priority technical SEO risks.
- Run `npm test`.
- Run `npm run lint`.
- Run `npm run build`.
- Pull latest `main` and verify the working tree before second-round SEO work.
- Harden localized canonical/hreflang/noindex/robots coverage.
- Add SEO regression tests for locale routing, sitemap alternates, robots, and content clustering.
- Push `main` to GitHub at commit `14a5345`.

## Next

- Push the validated local HEAD and confirm the exact Vercel production SHA.
- Recrawl production and compare all gates with the baseline.
- Connect Search Console data before deleting or merging any long-tail URL.

## Future SEO backlog

- Add claim-level first-party sources and recheck dates for carrier/platform assertions.
- Rewrite generic fallback pages in priority order: acceptance, trim/fold/tape, Amazon FBA, Mercari, ShipStation, and printer-specific issues.
- Investigate the public `private, no-cache, no-store` response without breaking locale correctness.
- Upgrade development-only vulnerable dependencies in a separate verified cycle.
