# osteo-lifting.com — rebuild

Static Astro site for **Международная Академия OSTEO-LIFTING (M.A.O.)**. Replaces the Weblium
brochure site archived in [`../archive/`](../archive/).

```bash
npm install
npm run dev       # http://localhost:4321/ru/
npm run build     # -> dist/
npm run preview
npm run assets    # regenerates public/og-image.jpg + apple-touch-icon.png (rarely needed)
```

Node 22+ required (Astro 7).

---

## Deploying to Vercel

This app lives in the `site/` subdirectory of the repository, so when importing the repo:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| **Root Directory** | **`site`** |
| Build command | `npm run build` (default) |
| Output directory | `dist` (default) |
| Install command | `npm install` (default) |
| Node version | 22.x or newer |

`vercel.json` (inside `site/`) carries the redirect map and the response headers, so no dashboard
configuration is needed beyond the root directory.

**Do not attach the custom domain yet.** The DNS move is a separate step and is gated on the client's
approval — see [`../NEXT-STEPS.md`](../NEXT-STEPS.md).

### Environment variables

| Name | Purpose |
|---|---|
| `PUBLIC_GA4_ID` | GA4 measurement ID. Unset ⇒ no analytics script and no tracking code is emitted at all. |

---

## URL structure

| URL | Page |
|---|---|
| `/` | 301 → `/ru/` |
| `/{ru,ua,en}/` | Home |
| `/{lang}/method/` | The method |
| `/{lang}/history/` | History of the Academy |
| `/{lang}/courses/` | The five products |
| `/{lang}/courses/{slug}/` | `osteo-lifting`, `osteo-lifting-3d`, `osteo-body`, `osteo-dance`, `tai-chi-pro` |

27 indexable pages + a trilingual 404.

**`ua` is the URL segment; `uk` is the language tag.** `hreflang="ua"` is invalid and would make Google
discard the whole annotation cluster, so `LANG_TAG` in `src/i18n/index.ts` maps `ua → uk` for `<html lang>`,
`hreflang`, the sitemap and the JSON-LD. Do not "simplify" this.

All redirects from `../discovery/redirect-map.csv` are implemented in `vercel.json`. The legacy
`/ru/*`, `/ua/*`, `/en/*` catch-alls use a negative lookahead so they cannot swallow the real
`/ru/method/`-style pages. Vercel's own trailing-slash normalisation answers with `308`, which search
engines treat identically to the `301` the map asks for.

---

## Content rules

**Copy is frozen.** Every visible string comes verbatim from the archived pages. `src/i18n/{ru,ua,en}.json`
is the whole content layer; components hold no copy.

- Titles, meta descriptions and `alt` text are *derived* from words already on the page — no new claims.
- The medical / weight-loss claims in the body copy are carried forward exactly as written and are kept
  out of every title, heading and meta description. They are the client's decision, not ours.
- The `«до Нового года»` seasonal offer is still live in the copy because removing it is the client's call.

**Client revisions, 2026-08-21.** Ariel asked for every mention of Olena Hrinchuk to be removed in all
three languages, and for his own figures to read *16 countries* and *over 7000 students worldwide*. Both
are applied. Consequences worth knowing: the instructors section is now a single block; Тай-Чи PRO массаж
has no instructor line at all, pending replacement wording from him; the "API SPA by Olena Hrinchuk"
benefit line is gone; and three of the six Instagram screenshots on the history page were dropped because
her name is baked into the image. The "по всему миру" addition was translated into UK and EN
("по всьому світу" / "worldwide") — worth a native check.

Two mechanical cleanups were applied to the copy: stray `U+FFFC` object-replacement characters (artefacts
of the old builder's emoji handling) were dropped, and the leading `- ` / `⁃ ` dashes were removed from
list items now rendered as real `<li>`s.

---

## Layout

```
site/
├── public/            favicon, og-image, robots.txt, the five decorative SVG icons
├── scripts/           one-off brand-asset generator (output is committed)
├── src/
│   ├── assets/img/    38 photographs recovered from the Weblium bucket
│   ├── components/    header, hero, stat bar, instructors, courses, testimonials, FAQ, footer…
│   ├── data/images.ts image registry (JSON refers to images by key)
│   ├── i18n/          ru.json · ua.json · en.json + locale helpers
│   ├── layouts/       Base.astro (head, header, footer, mobile CTA bar, GA4 outbound tracking)
│   ├── lib/schema.ts  JSON-LD graph builders
│   ├── pages/         [lang]/…
│   └── styles/        global.css — design tokens
└── vercel.json        redirects + headers
```

## Design tokens

`src/styles/global.css` holds the whole system: warm-bone ground, espresso contrast, tan/rose accent,
Cormorant Garamond display over Inter body (both self-hosted with Cyrillic subsets), a fluid `clamp()`
type scale, and one shared image treatment that normalises photographs from very different sources.

## Hero video

The hero sculpture animates. The still photograph is what loads with the page — it is the hero's largest
paint and waits on nothing. The clip is fetched only after the `load` event, during idle time, and
cross-fades in on top once it is genuinely playing.

| | |
|---|---|
| Source | `../resources/osteo-vid.mp4` — 464x640, 24 fps, 6.0 s, 603 kB |
| Shipped | `public/media/hero-sculpture.av1.mp4` **66 kB** · `.h264.mp4` **79 kB** |
| Re-encode | `bash scripts/encode-hero-video.sh ../resources/osteo-vid.mp4` |

Exactly one file is downloaded — the browser picks AV1 where it can, H.264 otherwise (notably iPhones
older than the A17). Audio is stripped: it is decoration, and a silent track would also risk tripping
autoplay policies.

The clip does not end where it starts, so it is rebuilt as a seamless loop with a 0.5 s crossfade, ordered
so that frame 0 is the opening pose — the one matching the poster photograph — which is why the fade-in
shows no jump. See the comments in the encode script for the arithmetic.

It is skipped entirely under `prefers-reduced-motion`, on `saveData`, and on 2G. It pauses when scrolled
out of view. If anything fails, the photograph simply stays.

## Motion

Deliberately built on platform primitives rather than a library — **no JavaScript bundles**, only two
small inline scripts.

| Effect | How |
|---|---|
| Block reveals on scroll, staggered | IntersectionObserver adds `.is-in`; CSS transitions do the work |
| Accent rules drawing in | `scaleX` on `.rule`, tied to its heading block arriving |
| Images easing out of a slight zoom | `transform: scale(1.09)` released on reveal |
| Hero entrance on load | CSS keyframes; the headline moves with `transform` only, never `opacity`, so LCP is not delayed |
| Header lifting off the page | `animation-timeline: scroll(root)`, shadow only |
| Page-to-page transitions | `@view-transition { navigation: auto }` |
| FAQ open/close | `::details-content` + `interpolate-size: allow-keywords` |
| Stat counters | `[data-count-to]`, IntersectionObserver + rAF |

`.motion` is added to `<html>` by a two-line script in `<head>` — before first paint, so nothing flashes —
and only when the visitor has not asked for reduced motion and IntersectionObserver exists. **Every
hidden-until-revealed rule is scoped to `.motion`**, so without JavaScript the class never appears and the
page renders fully visible. It is never blank.

Reveals were originally built on `animation-timeline: view()`. That version depended on
`animation-duration` defaulting to `auto` and on per-engine range handling, and it did not fire
consistently in practice — so it was replaced with one observer-driven path that behaves identically
everywhere.

The counters reserve their final width (`min-width: calc(var(--digits) * 1ch)` with tabular figures) so
counting up cannot cause layout shift — measured CLS contribution is 0.
