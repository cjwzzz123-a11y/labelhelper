# LabelHelper

LabelHelper is a browser-local toolkit for ecommerce sellers who need to check shipping-label paper size, print scale, orientation, PDF page boxes, calibration, and barcode whitespace before using paid postage.

The product is built with Next.js, React, TypeScript, Tailwind CSS, and `next-intl`. It does not buy postage, connect to carrier accounts, certify carrier acceptance, or upload label files for server-side processing.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm test
npm run lint
npm run build
npm run smoke:seo
npm audit --omit=dev
```

`smoke:seo` starts the production build locally and validates every sitemap URL, canonical, hreflang, title, description, H1, JSON-LD, internal link, social image, and language-consolidation redirect.

## Search and localization model

- English is unprefixed and canonical.
- Spanish and Chinese have translated guide/template subsets.
- French, German, and Japanese currently expose only the translated home and pricing experiences.
- An untranslated localized URL redirects permanently to its English canonical instead of presenting English content under a different language URL.
- Search titles use the short brand `LabelHelper`; the product name remains `Shipping Label Helper` in page and organization data.

Add a localized route only after its metadata, H1, core instructions, calls to action, and safety notes are translated together. Update `lib/i18n.ts`, the route content, and the full-site smoke test in the same change.

## Content and product boundaries

- Treat 4×6, A4, Letter, print scale, and orientation as a test baseline, not a guarantee of carrier acceptance.
- Link to an official platform or carrier starting point for platform/carrier guides.
- Keep unsupported claims out of public copy. Saved printer profiles, broad automatic barcode detection, automatic email delivery, and carrier integrations are not implemented.
- Do not create thin search pages by changing only a title. A new guide needs a distinct user problem, diagnosis path, corrective steps, verification method, and stop condition.
- Keep label processing browser-local unless the product specification is intentionally revised.

Product behavior and scope live in `docs/PRODUCT_SPEC.md`. The latest SEO validation record is in `docs/SEO_QUALITY_LOG_2026-08-29.md`.
