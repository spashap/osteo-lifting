# 08 — Design Direction

The redesign is the headline deliverable. This is the critique of what exists and the direction for what
replaces it. **Constraint that shapes everything here: all copy is fixed.** Modernisation happens through
structure, typography, colour, imagery and components — not by rewriting a word.

---

## 1. What the current design actually is

A stock Weblium template with the client's photos dropped in. Observed on the live site:

| Element | Current state |
|---|---|
| Hero | Full-bleed flat mid-grey band (`#747374`), white light-weight type, sculpture photo in a rounded-arch mask — a recognisable builder-template shape |
| Wordmark | The text "М.А.О." in the body font. No mark, no logo |
| Type | One light geometric sans at essentially two sizes. Wide letter-spacing on labels |
| Palette | Mid-grey + warm off-white + a tan/rose accent (`~#B08D7A`) on names. `theme-color: #747374` |
| Headings | **Every heading is an `<h2>`.** No `h1`, no `h3` — visually flat as well as semantically flat |
| Photography | Mixed sources, crops, lighting and colour temperature. The founder appears in a casual phone snapshot holding a book; the director appears in a polished studio beauty shot. Side by side on the same page |
| Course sections | Theory syllabi dumped as long dash-prefixed paragraph runs |
| Testimonials | Raw walls of text with inline emoji, no cards, no photos, no visual attribution |
| FAQ | Plain stacked text, no accordion |
| CTAs | The same outlined pill repeated 10+ times — "Консультация" and "Записаться" identical in weight, no primary/secondary distinction |
| Language switcher | Three small low-contrast text links, `EN \| UA \| RU` |
| Favicon | `photo_2023-09-12_18-20-02.jpg` — an unprocessed camera file, illegible at 32×32 |
| Anchors | Weblium's auto-generated `#custom-1`, `#custom-3`, `#custom-4` |

### The core problem

It is not ugly. It is **undifferentiated and unhierarchical.** Nothing on the page tells you what matters
most. The founder's strongest credential — *200+ seminars, 14 countries, 6,500+ students trained* — sits
in the same visual register as a bullet about ergonomics. Five distinct commercial products are stacked in
one undifferentiated run. Seven detailed testimonials from named professionals across six countries read
as an unbroken text wall.

The raw material is genuinely good. The design spends none of it.

### Accessibility note

White text on the `#747374` hero measures roughly **4.7:1** — numerically an AA pass for normal text
(4.5:1), but only just, and the very light font weight makes it read worse than the number suggests. The
new palette should clear AA comfortably rather than scrape it.

---

## 2. Direction

**Positioning:** a professional academy for aesthetics and bodywork practitioners. The register should be
*clinical calm* — quiet, precise, premium, tactile — not spa-soft and not medical-cold. The audience is
cosmetologists and massage therapists deciding whether to spend money and days on training. They are
buying credibility.

The existing palette already gestures at this. The redesign should commit to it rather than drift.

### 2.1 Typography

The hard constraint is **full Cyrillic support** — RU, UK and EN all in one system. This eliminates most
fashionable display faces, so it has to be decided first, not last.

**Recommended pairing:**

| Role | Face | Why |
|---|---|---|
| Display / headings | **Cormorant Garamond** or **Playfair Display** | High-contrast serif, complete Cyrillic, reads as editorial and premium rather than clinical-corporate |
| Body / UI | **Inter**, **Manrope**, or **Onest** | Neutral grotesk, excellent Cyrillic, wide weight range, screen-optimised |

Both families are on Google Fonts, so they load under the artifact/CSP constraints and self-host cleanly.

- Fluid type scale with `clamp()` — the current site has effectively two sizes
- Establish a real `h1 → h2 → h3` hierarchy; the semantic fix and the visual fix are the same fix
- Stop using ultra-light weights for body copy at low contrast

### 2.2 Colour

Keep the warm-neutral family, make it deliberate:

| Token | Suggested | Use |
|---|---|---|
| `--bg` | Warm bone / ivory | Page ground |
| `--surface` | Slightly warmer off-white | Cards, panels |
| `--ink` | Deep warm charcoal-brown | Body text — replaces washed-out grey |
| `--accent` | The existing tan/rose (`~#B08D7A`) | Names, links, small emphasis |
| `--contrast` | A deep espresso or near-black | Hero, primary CTA, footer |

Replace the flat `#747374` hero band. Mid-grey at full bleed reads as *unfinished*, not restrained — it is
the single strongest "template" signal on the page. Either a deep contrast tone or a properly treated
image works.

Single light theme. The site declares `color-scheme: light only` today and there is no reason to build a
dark variant for this audience.

### 2.3 Photography — the biggest single visual win

The images cannot be reshot, so **normalisation is the tool**:

- One consistent treatment across every photo — a subtle unified warm tint or light duotone pulls
  mismatched sources into one family
- Fixed aspect ratios per context (portrait, card, hero) with defined crop rules
- Consistent rounding — pick one radius, not the template's arch mask
- The `/history-*` pages hold **68 images each**. That is not a gallery, it is an unmanaged dump. Restructure
  as a designed timeline or a proper lightbox grid with lazy loading
- A designed **M.A.O. wordmark and favicon** — the current favicon is a raw camera file

### 2.4 Component system

Build these as real components with tokens, rather than the current ad-hoc blocks:

- **Sticky header** — wordmark, nav, proper language switcher control, one primary CTA
- **Credibility bar** — 200+ / 14 / 6,500+ as designed stat tiles directly under the hero. Existing numbers, new prominence
- **Course card** ×5 — instructor, format, duration, syllabus as a structured list, one clear CTA. Currently five products in one flat run
- **Testimonial card** — quote, name, location, role. The geographic spread (Warsaw, Spain, Netherlands, Bali, Israel) is a credibility asset the current design hides
- **FAQ accordion** — five real questions, currently plain stacked text
- **Instructor block** — consistent treatment for both people, unlike today
- **Footer** — contact details, socials, legal links, language switcher

### 2.5 CTA hierarchy

Ten-plus identical pills is the same failure as ten identical `h2`s. Establish:

- **Primary** — solid, high contrast, one per viewport, the booking action
- **Secondary** — outlined, for "Консультация"
- **Tertiary** — inline text links
- **Mobile** — a persistent bottom bar; every conversion is a Telegram/WhatsApp tap and it should never be more than a thumb away

### 2.6 Motion

Minimal. Short fades and small translations on scroll entry, nothing parallax. Honour
`prefers-reduced-motion`. Astro's zero-JS default means motion should be CSS-first.

---

## 3. Page structure (structural change, verbatim copy)

Splitting content across pages re-uses existing text unchanged — it is layout, not authoring.

**Homepage** (`/ru/`, `/ua/`, `/en/`):

```
Hero  →  Credibility bar (200+ / 14 / 6500+)  →  Instructors  →  For whom  →
Course grid (5 cards → detail pages)  →  Testimonials  →  FAQ  →  Contact / CTA
```

**New pages, existing text:**

- `/{lang}/courses/{slug}/` ×5 — one per product, using that product's current copy verbatim.
  Enables `Course` schema per product and gives each one a rankable, linkable, shareable URL
- `/{lang}/method/` — existing copy, redesigned
- `/{lang}/history/` — existing copy, images restructured as a timeline

⚠️ The five course pages will each carry roughly 100–250 words, because that is how much copy exists. They
will be *well-built* thin pages. Splitting improves structure, schema and shareability — it does not make
them rank. That needs content, which is a later phase.

---

## 4. What to preserve

Not everything needs replacing:

- The **warm-neutral, restrained palette instinct** — right for the audience, just under-committed
- The **sculpture hero image** — genuinely striking and on-message for facial work
- **Trilingual parity** — all three languages get the same design, not a degraded EN afterthought
- **Telegram-first conversion** — correct for this audience; the redesign should make it more prominent, not replace it with a form-first funnel

---

## 5. Deliverables and sequence

1. **Design tokens** — type scale, colour, spacing, radii, shadows, breakpoints
2. **Component inventory** — the set in §2.4, designed at mobile and desktop
3. **Key page mockups** — homepage, a course detail page, method, history
4. **Image treatment spec** — crop ratios, tint, radius, export sizes
5. **Wordmark + favicon**
6. Build the design system in code first, then compose pages from it

Design happens **before** the build, and the tokens should be agreed before any component is written.

Worth doing early, because it is cheap: a **design canvas with the key artboards** side by side, to settle
type, colour and hierarchy visually before any code exists. Faster to iterate on than a coded prototype and
it is the artefact the client can react to.

---

## 6. Success criteria

The redesign works if:

- A first-time visitor can tell within five seconds what is sold and to whom
- The credibility numbers are the second thing seen, not the twentieth
- Each of the five products is distinguishable and individually linkable
- The testimonials read as evidence rather than as text
- Every page has one obvious next action
- It is unmistakably *not* a template
- It holds up in all three languages — Cyrillic is not an afterthought
- Lighthouse ≥ 95 across the board, and it looks deliberate at 390px as well as 1440px
