# 02 — SEO & Technical Audit

All 9 live pages were fetched and parsed. Findings are ordered by impact on the rebuild, not by
category. Each carries a note on whether it is fixable *now* on Weblium or only *after* migration.

---

## Severity summary

| # | Finding | Severity | Fixable now? |
|---|---|---|---|
| 1 | Legacy `/ru/` URLs 404 while still receiving external links | **High** | Yes — via Cloudflare, once DNS moves |
| 2 | Zero `<h1>` elements sitewide | **High** | No |
| 3 | Zero meta descriptions sitewide | **High** | No |
| 4 | No `hreflang`, wrong `lang` attribute on every page | **High** | No |
| 5 | Empty JSON-LD (`Organization`, `LocalBusiness` with blank fields) | **High** | Partly (fill business info in panel) |
| 6 | No analytics and no Search Console / Bing Webmaster | **High** | Yes |
| 7 | Duplicate `<title>` between `/` and `/ua` | Medium | No |
| 8 | Thin content on 6 of 9 pages (150–210 words) | Medium | Yes (editorial) |
| 9 | Missing `alt` text on real images (see §9 — figure corrected 2026-08-20) | Medium | Yes (editorial) |
| 10 | Keyword-stuffed `<meta name="keywords">` (up to 1,984 chars) | Medium | No |
| 11 | Missing `og:description`; `og:image` on only 3 of 9 pages; no Twitter cards | Medium | No |
| 12 | Structured-data opportunity unused (FAQ, Reviews, Courses, Person) | Medium | No |
| 13 | Stale seasonal offer ("до Нового года") live in August | Medium | Yes (editorial) |
| 14 | Trailing-slash normalisation uses `302` instead of `301` | Low | No |
| 15 | HSTS `max-age` only 30 days; no caching headers on HTML | Low | No |
| 16 | `sitemap.xml` `lastmod` identical on all 9 URLs | Low | No |
| 17 | Favicon is an unprocessed photo | Low | Yes |
| 18 | **Testimonial carousel renders empty on all 3 `/history-*` pages** | Medium | No |
| 19 | 67 of 68 `<img>` tags per history page are empty scaffolding | Low | No |

"No" in the last column mostly means: Weblium does not expose the control. It is not a Weblium bug —
it is the ceiling of the platform, and it is the strongest technical argument for the rebuild.

---

## 1. Legacy `/ru/` URLs are 404ing while still receiving links — **High**

The site previously ran on a **language-prefix URL structure** (`/ru/`, `/en/`, `/ua/` with slugs). The
current Weblium site uses **language suffixes** (`/method-ru`, `/history-ua`). Nothing bridges the two.

Confirmed live behaviour:

```
/ru/founder-and-creator/   302 → /ru/founder-and-creator   → 404
/ru/                       302 → /ru                       → 404
/ru/about/                 302 → /ru/about                 → 404
```

The old URLs are still referenced from live external sources found in search results:

| Source | Link target |
|---|---|
| YouTube channel "ARIEL PELEVIN LIVE" (470+ subscribers) | `osteo-lifting.com/ru` |
| VKontakte community `club6278059` | `www.osteo-lifting.com/ru` |
| Facebook course/event pages | `http://osteo-lifting.com/ru/` |
| Instagram posts by course participants | `osteo-lifting.com/ru/` |

Google no longer indexes anything under `/ru/` (`site:osteo-lifting.com/ru` returns nothing), so the
pages have been dropped — but **the backlinks persist**, and every click on them hits a 404. Anyone who
finds the academy through the YouTube channel — the most likely discovery path for this business —
lands on an error page.

**Fix:** prefix-based 301 catch-alls, not a per-URL list:

```
/ru        → /ru/  (or the RU home in the new structure)
/ru/*      → /ru/
/en/*      → /en/
/ua/*      → /ua/
```

This makes an exhaustive inventory of legacy slugs unnecessary — which is fortunate, because the
Internet Archive CDX API returned `429` on every attempt and the full historical URL list could not be
retrieved. If a precise map is wanted later, retry:

```bash
curl "http://web.archive.org/cdx/search/cdx?url=osteo-lifting.com*&output=text&fl=original&collapse=urlkey"
```

Weblium exposes no redirect controls, so this **cannot be fixed on the current platform**. It *can* be
fixed immediately once DNS moves to Cloudflare, using Cloudflare Bulk Redirects in front of the existing
Weblium site — no rebuild required. That makes it the fastest measurable win in this whole document.

---

## 2. Zero `<h1>` elements on all 9 pages — **High**

Every page opens with an `<h2>`. There is not one `<h1>` on the entire site.

| Page | `<h1>` | `<h2>` | `<h3>` |
|---|---|---|---|
| `/` | **0** | 3 | 0 |
| `/history-ru` | **0** | 2 | 0 |
| `/method-ru` | **0** | 2 | 0 |
| ...identical for all 9 | **0** | 2–3 | 0 |

There is also **no `<h3>` anywhere**, so there is no heading hierarchy at all — just a flat run of `<h2>`
blocks. On the homepage, three `<h2>`s carry ~1,720 words including five distinct course products, seven
testimonials and a five-question FAQ. None of that structure is expressed in markup.

**Fix in rebuild:** one `<h1>` per page carrying the primary term, `<h2>` per section, `<h3>` per course
and per FAQ question.

---

## 3. Zero meta descriptions on all 9 pages — **High**

Not one page has `<meta name="description">`. Google is therefore auto-generating every snippet, which
is why the `site:` results show fragments mid-sentence from the middle of the page.

**Fix in rebuild:** unique 140–160 character description per page per language, written as ad copy.

---

## 4. Language markup is wrong on every page — **High**

Two compounding problems:

**(a) `<html lang="en">` on all 9 pages**, including the Russian and Ukrainian ones. Google is being told
that Russian content is English. This also breaks screen readers and browser translation prompts.

**(b) No `hreflang` annotations at all.** Three complete language versions exist and nothing connects
them. Google has to guess that `/`, `/ua` and `/en` are translations of one another — and it has no
reason to.

**Fix in rebuild** — full reciprocal cluster on every page:

```html
<link rel="alternate" hreflang="ru" href="https://osteo-lifting.com/ru/" />
<link rel="alternate" hreflang="uk" href="https://osteo-lifting.com/ua/" />
<link rel="alternate" hreflang="en" href="https://osteo-lifting.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://osteo-lifting.com/en/" />
```

⚠️ **Detail that is easy to get wrong:** the ISO 639-1 code for Ukrainian is **`uk`**, not `ua`. `ua` is
the *country* code. The URL path may stay `/ua/` for familiarity, but the `hreflang` value must be `uk`
or `uk-UA`, and `<html lang>` must be `uk`. An `hreflang="ua"` is silently invalid and Google ignores the
whole annotation.

---

## 5. JSON-LD exists but is completely empty — **High**

The homepage (RU only — the other 8 pages have none) emits two structured-data blocks. Both are blank
templates:

```json
{ "@context": "https://schema.org", "@type": "Organization",
  "legalName": "", "description": "",
  "contactPoint": [{ "@type": "ContactPoint", "telephone": "", "email": "" }],
  "address": { "addressCountry": "", "addressRegion": "", "streetAddress": "", "postalCode": "" } }
```

```json
{ "@context": "http://schema.org", "@type": "LocalBusiness",
  "name": "", "description": "", "telephone": "", "openingHours": [],
  "address": { ... all empty ... },
  "image": "//via.placeholder.com/1" }
```

Root cause: the **"Информация о бизнесе" section in the Weblium panel is entirely blank**, so Weblium
renders the template with empty strings. An empty `LocalBusiness` with a placeholder image is worse than
no markup — it is an invalid entity claim.

This is **partly fixable today**: filling in business name, phone, email, address and hours in the
Weblium panel would populate these blocks. Whether that is worth doing depends on whether the site stays
on Weblium past October.

---

## 6. No analytics, no Search Console, no Bing Webmaster — **High**

Verified across all 9 pages: **no GA4, no Google Tag Manager, no Meta Pixel, no Hotjar, no Yandex
Metrica.** The Weblium Analytics panel shows all four available integrations unconnected, and all three
custom-code slots (`<head>`, after `<body>`, before `</body>`) are empty.

No Search Console verification exists in any detectable form: no `google-site-verification` meta tag, no
DNS TXT record, nothing in custom code. Same for Bing.

The only measurement in existence is Weblium's own `site-stat.js`, which produces the panel numbers
analysed in [03-traffic-and-analytics.md](03-traffic-and-analytics.md) and disappears with the platform.

Consequence: **there is no historical search data for this domain and no way to recover it.** Whatever
GSC would have shown for the last several years is permanently lost. This is the strongest argument for
setting up GSC *today*, before migration, rather than after — even a few weeks of baseline is better than
none, and DNS-TXT verification will survive the move.

---

## 7. Duplicate `<title>` between `/` and `/ua` — Medium

| Page | `<title>` |
|---|---|
| `/` (RU) | `Международная Академия OSTEO-LIFTING` |
| `/ua` (UK) | `Международная Академия OSTEO-LIFTING` ← **Russian title on the Ukrainian page** |
| `/en` | `International Academy OSTEO-LIFTING` |

The Ukrainian homepage's body content *is* correctly in Ukrainian (`Міжнародна Академія`), but the title
tag was never translated. Two of the site's three most important pages are competing on an identical
title.

All titles are also brand-only — none contain a service term. Nobody searches for "Международная
Академия OSTEO-LIFTING" unless they already know the brand, which fits the 0% search traffic exactly.

**Fix in rebuild:** unique, translated, intent-bearing titles, e.g.
`Остеолифтинг — обучение методу безоперационной коррекции лица | Академия M.A.O.`

---

## 8. Thin content on 6 of 9 pages — Medium

| Page | Word count |
|---|---|
| `/` | 1,720 |
| `/ua` | 1,748 |
| `/en` | 2,113 |
| `/history-ru` | **156** |
| `/history-ua` | **157** |
| `/history-en` | **176** |
| `/method-ru` | **196** |
| `/method-ua` | **194** |
| `/method-en` | **211** |

The three homepages carry all the substance. The six sub-pages are each under 220 words — below the
threshold where a page has enough signal to rank for anything. The `/history-*` pages are essentially a
photo wall (68 images, ~160 words) with a two-line intro.

**Out of scope for this engagement** — content authoring is excluded, so these pages stay at their current
length. Recorded here as the ceiling on what technical work can achieve: no amount of correct markup makes
a 160-word page rank. Expanding them to 600–900 words each is the obvious later content phase, and
"history/credibility" and "what the method is" are exactly the pages a prospective student reads before
paying for a course.

---

## 9. Missing image `alt` text — Medium

> **⚠️ Corrected 2026-08-20.** An earlier version of this section reported "61 of 68 images missing alt"
> on each `/history-*` page. That figure counted `<img>` **tags**, and it was wrong in a way that
> materially overstated the work. Asset archiving established that **67 of those 68 tags have no `src` at
> all** — they are empty Weblium template scaffolding that never loads an image. The real scope is far
> smaller.

| Page | `<img>` tags | Tags that actually load an image | Missing `alt` on real images |
|---|---|---|---|
| `/`, `/ua`, `/en` | 14 | 3–5 | 0 ✅ |
| `/history-ru`, `/history-ua`, `/history-en` | 68 | **~20** | most |
| `/method-ru`, `/method-ua`, `/method-en` | 7 | 2 | up to 2 |

Sitewide there are **48 distinct image assets** in total (40 raster + 8 decorative SVG), shared across the
three language versions — not 68 per page.

Realistic effort: describe roughly **40 images once**, then translate into three languages. The decorative
SVGs take `alt=""`. That is a contained task, not the ~183-string slog the original figure implied.

---

## 10. Keyword-stuffed `<meta name="keywords">` — Medium

Every page carries a large `keywords` meta tag:

| Page | Length |
|---|---|
| `/` | 1,979 chars |
| `/en` | **1,984 chars** |
| `/ua` | 1,902 chars |
| others | 742–950 chars |

The content is a repeated phrase list ("Osteo-lifting Israel Osteopathy Israel Israeli Osteopathy Center
Rejuvenation through osteopathy ... Osteo-lifting Israel Osteolifting training Ukraine ..." — with several
phrases repeating three or more times within the same tag).

Google has ignored this tag since 2009, so it causes **no direct ranking penalty**. Two real costs: it
adds ~2 KB to every page, and it is a strong signal that whoever did the previous SEO work was applying
2010-era tactics — worth knowing when judging any other advice inherited from that source.

**Fix in rebuild:** drop the tag entirely.

---

## 11. Social / Open Graph markup is incomplete — Medium

| Tag | Coverage |
|---|---|
| `og:type`, `og:url`, `og:title` | 9 of 9 ✅ |
| `og:image` | **3 of 9** (homepages only) |
| `og:description` | **0 of 9** |
| `twitter:card` and all Twitter tags | **0 of 9** |

Since every CTA on the site pushes people into Telegram and WhatsApp, **link previews in messengers are
a primary surface for this business** — and 6 of 9 pages will render as a bare title with no image and no
description when shared. This is a bigger deal here than on a typical site.

---

## 12. Unused structured-data opportunity — Medium

The site already contains, in plain HTML, everything needed for rich results — and marks up none of it:

| Content that exists | Schema type that should wrap it |
|---|---|
| 5-question FAQ block on all 3 homepages | `FAQPage` |
| 7 named testimonials (Warsaw, Spain ×2, Netherlands, Bali, Israel ×2) | `Review` / `AggregateRating` |
| 5 distinct course products with syllabi, formats and durations | `Course` + `CourseInstance` |
| Dr. Ariel Pelevin — PhD (USA), BSC (Spain), MT (Israel), 200+ seminars, 14 countries, 6,500+ students | `Person` with `hasCredential` |
| The academy itself | `EducationalOrganization` (better fit than the current blank `LocalBusiness`) |

`FAQPage` and `Course` markup are directly eligible for enhanced presentation in search and are heavily
used by AI answer engines when citing sources. For a business whose entire product is training, `Course`
markup is the highest-leverage single addition in the rebuild.

---

## 13. Stale seasonal content — Medium

The RU homepage currently offers, in August 2026:

> "В пакет по индивидуальному обучению (1-2 человека), **до Нового года**, входит 1 сеанс
> остео-лифтинга в подарок"

A New Year promotion running in August signals an unmaintained site to every visitor who notices. Cheap
to fix, and it should be fixed on the live site now rather than waiting for the rebuild.

---

## 18. Broken testimonial carousel on all `/history-*` pages — **found 2026-08-20**

The `/history-ru`, `/history-ua` and `/history-en` pages each contain an **"Отзывы" (Testimonials)
carousel that renders completely empty**: the heading displays, six pagination dots display, prev/next
arrows display — and the slide area is blank.

This is a live defect visible to every visitor on those pages, in all three languages. It is not a
rendering delay; the slides never populate.

Two implications:

1. The current site has a **visibly broken section**, which undercuts credibility on precisely the page a
   prospective student visits to assess the academy's history.
2. **Testimonial images may exist in the Weblium bucket that the page has not displayed since it broke.**
   The archive recovered before/after client-result photos that do not appear anywhere on the live site —
   these may be the carousel's missing content.

No fix is proposed for the current site: the component will not survive the rebuild. Recorded because it
explains an asset discrepancy, and because it is worth mentioning to the client.

---

## 19. Real image count is far lower than the markup suggests — **found 2026-08-20**

Archiving established that the site's markup badly misrepresents its own media:

| | Count |
|---|---|
| `<img>` tags on a `/history-*` page | 68 |
| Of those, tags with **no `src` at all** | **67** |
| Distinct image assets across the **entire site** | **48** (40 raster + 8 decorative SVG) |
| Self-hosted fonts | 1 (`Evolventa-Regular.woff`) |

67 empty `<img>` tags per page is template scaffolding Weblium emits regardless of whether content was
placed in it. It inflates the DOM, and it makes any tag-counting audit (including the first pass of this
one) produce wrong numbers.

The practical consequence is in §9: the alt-text task is roughly 40 descriptions, not 183.

---

## 14–17. Lower-priority items

**14. Trailing-slash redirects use `302`.** `/method-ru/` → `302` → `/method-ru`. Should be `301`.
Temporary redirects do not consolidate signals. Weblium controls this; not fixable in place.

**15. HSTS and caching.** `strict-transport-security: max-age=2592000` is 30 days; HSTS preload requires
≥ 31,536,000 (1 year) plus `includeSubDomains` and `preload`. Separately, HTML responses carry **no
`Cache-Control`, `ETag` or `Last-Modified`** at all.

**16. Sitemap `lastmod` is uniform.** All 9 URLs report `2025-10-01T06:45:50+00:00`. A build timestamp,
not a content timestamp — so it gives crawlers no useful recrawl signal. In the rebuild, derive `lastmod`
from actual content changes (git commit date works well).

**17. Favicon is a raw photo.** `photo_2023-09-12_18-20-02.jpg` — an unprocessed camera filename, scaled
down. At 32×32 it will be an unreadable smudge. Needs a designed mark as part of the redesign.

---

## What is actually correct today

Worth stating plainly, so the rebuild does not regress on it:

- ✅ `robots.txt` is valid and correctly references the sitemap
- ✅ `sitemap.xml` is a valid sitemap index → `sitemap_pages.xml` with all 9 URLs
- ✅ Every page has a correct self-referencing `<link rel="canonical">`
- ✅ `/index.html` returns 200 but canonicalises to `/` — duplicate handled correctly
- ✅ HTTP → HTTPS and www → apex both `301`
- ✅ `<meta name="robots" content="index, follow">` — nothing accidentally blocked
- ✅ `<meta name="viewport" content="width=device-width, initial-scale=1">` present
- ✅ Responsive CSS is real (914 `@media` blocks); no horizontal overflow detected
- ✅ Sensible security headers (`X-Frame-Options`, CSP `frame-ancestors`, `X-Content-Type-Options`)
- ✅ Gzip on; WebP used for newer images; sub-second load
- ✅ Site is open to indexing — no accidental `noindex`

The crawl/index plumbing is fine. Everything that is broken is at the semantic layer: headings,
descriptions, language signals, and structured data.

---

## Priority order for the rebuild

**Do before migrating** (these preserve or create value regardless of platform):

1. Set up Google Search Console + Bing Webmaster Tools, verified by **DNS TXT** so verification survives
   the move
2. Install GA4 (Weblium's Analytics panel supports it natively — ~5 minutes)
3. Fix the stale "до Нового года" offer
4. Once DNS is on Cloudflare: add the legacy `/ru/*`, `/en/*`, `/ua/*` 301 rules in front of the existing
   Weblium site

**Do in the rebuild:**

5. One `<h1>` per page; proper `h2`/`h3` hierarchy
6. Unique translated `<title>` and `<meta description>` per page per language
7. Correct `<html lang>` + full `hreflang` cluster with `x-default` (remember: `uk`, not `ua`)
8. Real JSON-LD: `EducationalOrganization`, `Person`, `Course` ×5, `FAQPage`, `Review`
9. `alt` text on all images
10. `og:description` + `og:image` on every page, plus Twitter cards — messengers are a primary channel
11. ~~Expand the six thin pages~~ — **out of scope**, content is migrated verbatim
12. Drop `<meta name="keywords">`
13. `301` (not `302`) for slash normalisation; HSTS to 1 year; real caching headers
14. Content-derived `lastmod` in the sitemap
15. Designed favicon
