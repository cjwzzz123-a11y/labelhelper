# TASKS

## Completed

- Audit all 176 production sitemap URLs and quantify metadata/i18n/content issues.
- Add default Open Graph/Twitter artwork and enforce metadata contracts.
- Consolidate incomplete locale variants and fix Spanish template copy.
- Correct page facts, carrier-support wording, structured-data price, and unimplemented saved-profile copy.
- Add a sitemap-driven SEO smoke test covering 143 URLs and 160 internal paths.
- Upgrade Next.js to 16.3.3 and clear production dependency advisories.
- Deploy and production-crawl the first SEO batch at `c36d603`.
- Rewrite the acceptance, trim/fold/tape, and preflight pages with claim-level USPS/UPS/FedEx sources and stop conditions.

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

- Push the second evidence-sensitive content commit and confirm the exact Vercel production SHA.
- Recrawl production after that second commit and compare all gates with the baseline.
- Connect Search Console data before deleting or merging any long-tail URL.

## Future SEO backlog

- Add claim-level first-party sources and recheck dates for carrier/platform assertions.
- Rewrite the remaining 25 generic fallback pages in priority order: Amazon FBA, Mercari, ShipStation, and printer-specific issues.
- Investigate the public `private, no-cache, no-store` response without breaking locale correctness.
- Upgrade development-only vulnerable dependencies in a separate verified cycle.
