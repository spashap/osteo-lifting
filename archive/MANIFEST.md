# Archive — osteo-lifting.com

Captured **2026-08-20**, before any migration work. This is the Phase 0 safety net: Weblium has no export
feature, so everything here would be unrecoverable once the subscription lapses (renewal 1 Oct 2026, card
currently failing).

**Commit this directory to git. Do not delete it after migration.**

```
archive/
├── pages/     9 HTML pages, exactly as served
├── assets/    48 media files recovered from res2.weblium.site
├── fonts/     Evolventa-Regular.woff — the site's self-hosted typeface
├── meta/      robots.txt, sitemaps, RDAP record, extracted SEO metadata, fetch logs
└── contact-sheet.html   visual index of all 48 images — open in a browser
```

---

## Assets — 49 files, 5.9 MB

| Type | Count | Size | Location |
|---|---|---|---|
| JPEG | 24 | 2.7 MB | `assets/` |
| PNG | 16 | 2.7 MB | `assets/` |
| SVG | 8 | 295 KB | `assets/` |
| WOFF font | 1 | 38 KB | `fonts/` |

### The font

`Evolventa-Regular.woff` — the geometric light sans used throughout the site, self-hosted on Weblium
rather than loaded from Google Fonts. It would have died with the subscription like everything else.

Evolventa is an open font (a Cyrillic extension of URW Gothic), so it is independently obtainable — but
it is archived here so the current design can be reproduced byte-for-byte if needed. Note that the
redesign proposes moving to a different type system entirely; see
[`../discovery/08-design-direction.md`](../discovery/08-design-direction.md) §2.1.

### Coverage verification

Every asset the live site actually requests was checked against this archive, on the homepage,
`/history-ru` and `/history-en` (the heaviest pages): **25 distinct runtime assets, 100% present.**

Method: extract every 24-hex asset ID from all 9 pages' embedded site model (146 candidates), fetch each
one, keep every HTTP 200 regardless of content type. 49 were real assets; the other 97 IDs are block and
section identifiers, not media.

### How these were found

The 68 `<img>` tags on each `/history-*` page are **not** 68 photos. 67 of them have **no `src` at all** —
they are empty Weblium template scaffolding that never loads anything. Counting `<img>` tags gave a wildly
wrong picture in both directions.

### What is actually in there

Spot-checked, and it is more valuable than the live site suggests:

- **Before/after client result photos** — black-and-white paired portraits with Russian annotations
  (*"уменьшилась асимметрия"*, *"сгармонизировались пропорции лица"*), exported at 9:16 with Instagram
  story styling. Original documentation of the method's results, not stock
- **Practitioner and instructor portraits** — genuine photos, several uploaded as recently as Aug 2025
- **The sculpture hero image**
- **8 SVGs** — decorative shapes, icons and UI graphics from the template. Low value, kept for completeness

⚠️ **Some of this content does not appear on the live site at all.** The `/history-*` pages contain an
"Отзывы" (Testimonials) carousel that renders **completely empty** — heading, six pagination dots, prev/next
arrows, and blank space where the slides should be. Assets exist in the bucket that the page never displays.
See the bug note below.

### Reviewing them

Open **`contact-sheet.html`** in a browser. All 48 images are laid out largest-first with dimensions and file
sizes. A checkerboard background means image transparency — usually a cut-out or a graphic rather than a
photograph.

Nothing has been deleted. Decide what to carry into the rebuild *after* looking, not before — the recovery
was cheap and irreversible losses are not.

---

## Pages — 9 HTML files

Exactly as served on 2026-08-20, including the empty JSON-LD blocks, the keyword-stuffed `<meta keywords>`,
and the missing `<h1>`s. Kept as the source of truth for the verbatim content migration, since copy is
being ported unchanged.

| File | URL |
|---|---|
| `home.html` | `/` (RU) |
| `history-ru.html` `method-ru.html` | `/history-ru` `/method-ru` |
| `ua.html` `history-ua.html` `method-ua.html` | `/ua` `/history-ua` `/method-ua` |
| `en.html` `history-en.html` `method-en.html` | `/en` `/history-en` `/method-en` |

Note: text is lazy-rendered in places, so for content extraction prefer the rendered DOM over raw HTML
parsing — the same trap that made the image count misleading.

---

## Live bug found during capture

The **"Отзывы" testimonial carousel on the `/history-*` pages is broken** — it renders as an empty region
with six pagination dots and no slides, in all three languages. Visitors see a titled, empty box.

It is not in the redesign backlog because it will not survive the rebuild, but it is worth knowing that the
current site has a visibly broken section, and that testimonial images may exist in the bucket that nobody
has seen since it broke.

---

## Not captured

- **Full legacy URL list** from the pre-2023 `/ru/`-structured site. The Internet Archive CDX API returned
  `429 Too Many Requests` on every attempt from both the shell and the browser. Not a blocker — the
  redirect plan uses prefix catch-alls rather than a per-URL map. Retry later if a precise list is wanted:
  ```
  curl "http://web.archive.org/cdx/search/cdx?url=osteo-lifting.com*&output=text&fl=original&collapse=urlkey"
  ```
- **Weblium's internal site model / editor state.** No export exists; the platform offers no access to it.
- **Weblium's own analytics history.** Panel-only, disappears with the subscription. The 12-month figures
  are transcribed in [`../discovery/03-traffic-and-analytics.md`](../discovery/03-traffic-and-analytics.md),
  which is now the only surviving record of them.

---

## Reproducing

```bash
# page list
curl -s https://osteo-lifting.com/sitemap_pages.xml \
  | grep -oE '<loc>[^<]+</loc>' | sed -e 's/<loc>//' -e 's|</loc>||'

# assets: extract 24-hex ids from page HTML, then
BASE=https://res2.weblium.site/res/650085d7110e280017ea1194
curl -sS -o out.tmp -w '%{content_type}' "$BASE/<id>"   # keep every HTTP 200, not just image/*
# (filtering on image/* alone silently drops the self-hosted font)
```
