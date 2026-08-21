# osteo-lifting.com

Takeover and rebuild of **https://osteo-lifting.com** — Международная Академия OSTEO-LIFTING (M.A.O.),
a training academy selling paid courses in a manual, non-surgical face-and-body correction method.
Founder: Dr. Ariel Pelevin.

| Directory | What it is |
|---|---|
| [`site/`](site/) | **The rebuild.** Astro static site, RU / UK / EN. Deploys to Vercel. |
| [`discovery/`](discovery/) | Audit of the old site, 2026-08-20 — 8 documents + the redirect map |
| [`archive/`](archive/) | The Weblium site as served on 2026-08-20: 9 pages, 48 images, 1 font |
| [`CLAUDE.md`](CLAUDE.md) | Scope, constraints and conventions |
| [`NEXT-STEPS.md`](NEXT-STEPS.md) | The ordered action list |

⚠️ **`archive/` is irreplaceable.** Weblium has no export feature and its CDN disappears with the
subscription (renewal 1 Oct 2026). Never delete it.

---

## Status

- ✅ Discovery and audit
- ✅ Full archive of the live site
- ✅ Rebuild — 27 pages across three languages, full SEO layer, redirect map implemented
- ✅ Client revision 2026-08-21 — all Olena Hrinchuk content removed; Ariel’s figures updated to 16 countries / 7000+ students
- ⏳ Vercel project — connect the repo with **Root Directory = `site`**
- ⏳ DNS move to Cloudflare — **not started, and gated on the client's approval**
- ⏳ Search Console / Bing / GA4

The new site is **not** attached to the domain. osteo-lifting.com still resolves to Weblium.

## What the rebuild fixes

Everything in the audit's severity table: zero `<h1>`s, zero meta descriptions, no `hreflang` and a wrong
`lang` on all nine pages, empty `Organization`/`LocalBusiness` JSON-LD, missing `og:`/Twitter tags,
1,984 characters of keyword stuffing, missing `alt` text, `302` redirects, and the legacy `/ru/*`
backlinks that 404 today.

Added: real `EducationalOrganization` · `Person` ×2 with `hasCredential` · `Course` ×5 · `FAQPage` ·
`Review` ×7 · `BreadcrumbList`, a reciprocal `hreflang` cluster with `x-default`, an XML sitemap with
`xhtml:link` alternates, AVIF/WebP responsive images, and GA4 outbound-click instrumentation that stays
dormant until a measurement ID is set.

Not fixed, because they need the client: contact details (no email, phone or address appears anywhere on
the current site), pricing, course dates, and a decision on the health claims in the copy.

See [`site/README.md`](site/README.md) for build and deploy instructions.
