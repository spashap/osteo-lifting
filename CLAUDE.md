# CLAUDE.md — osteo-lifting.com rebuild

Guidance for Claude Code working in this repository.

---

## What this project is

A takeover and full rebuild of **https://osteo-lifting.com** — the site of **Международная Академия
OSTEO-LIFTING (M.A.O.)**, a training academy selling paid courses in a manual, non-surgical face-and-body
correction method. Founder: **Dr. Ariel Pelevin**. Director/instructor in Ukraine: **Olena Hrinchuk**.

The site is currently a 9-page, 3-language (RU / UK / EN) brochure site built on **Weblium**.

**Status as of 2026-08-20: discovery complete, site archived, nothing built yet.**

➡️ **[`NEXT-STEPS.md`](NEXT-STEPS.md) is the action list — start there.**

Done: full audit ([`discovery/`](discovery/)) and a verified archive of the live site
([`archive/`](archive/) — 9 pages, 48 images, 1 font, 9.5 MB).
Not done: git repo, DNS move, analytics, rebuild.

## Scope — read before proposing anything

**The two main goals are DESIGN and SEO.**

1. **Modern design** — the current site is a dull, template-shaped Weblium build. This is the headline
   deliverable. See [`discovery/08-design-direction.md`](discovery/08-design-direction.md)
2. **SEO / technical** — markup, structure, i18n, schema, performance, redirects
3. **Operational control** — ship front-end changes on request, without a builder platform in the way

**Content authoring is out of scope. Existing copy migrates verbatim.**

- ❌ Do **not** rewrite, expand, translate, or "improve" any body copy
- ❌ Do **not** expand the six thin pages (150–210 words each) — they stay as they are
- ❌ Do **not** touch the medical / weight-loss claims in the copy. They are a client decision. Carry
  them forward exactly as written, and never promote them into a title, heading, or meta description
- ⚠️ Exception: if **Ariel (the client) specifically requests** a copy change, he supplies the text
- ✅ Titles, meta descriptions and `alt` text **are** in scope, but must be **derived from copy already on
  the page** — no new claims, no invention. See
  [`discovery/07-scope-and-control.md`](discovery/07-scope-and-control.md) §3 for the exact rule per field

**Control model: operational, not ownership.** "Control" means being able to ship front-end changes
whenever the client asks — push to GitHub, Vercel deploys. It does **not** mean taking over the client's
assets.

- **Ours:** DNS (Cloudflare), hosting (Vercel), repo (GitHub), GSC / GA properties
- **Client's, untouched:** the domain (stays at NIC.UA in Ariel Pelevin's account) and email
- **The only change ever made to the client's registrar account is a one-time nameserver switch.**
  Do not transfer the domain, change its password, or alter its contact details.

Details in [`discovery/07-scope-and-control.md`](discovery/07-scope-and-control.md) §4.

**Email is out of scope entirely.** The client keeps their existing mail service, untouched. DNS work
replicates the `MX` and `mail` A records **exactly as they are** and adds nothing email-related (no SPF,
DKIM or DMARC) unless the client asks. Getting this wrong breaks their mail — see the warning below.

Realistic outcome: this delivers control, speed, correct indexing, rich-result eligibility and recovered
backlinks. It will **not** deliver meaningful organic search traffic — that needs content, which is a
separate later phase. Do not set expectations otherwise.

---

## Read this first

The full audit lives in [`discovery/`](discovery/). Read it before proposing work — it answers most
questions about the current site and the migration approach:

| File | Read it when |
|---|---|
| [`discovery/README.md`](discovery/README.md) | **Start here.** Executive summary and all key findings |
| [`discovery/01-current-state.md`](discovery/01-current-state.md) | You need DNS, registrar, hosting, TLS, or panel facts |
| [`discovery/02-seo-technical-audit.md`](discovery/02-seo-technical-audit.md) | You are writing markup, meta tags, schema, or i18n |
| [`discovery/03-traffic-and-analytics.md`](discovery/03-traffic-and-analytics.md) | You need traffic reality or analytics plans |
| [`discovery/04-content-inventory.md`](discovery/04-content-inventory.md) | You are touching content, copy, or page structure |
| [`discovery/05-migration-recommendation.md`](discovery/05-migration-recommendation.md) | You are planning or executing migration steps |
| [`discovery/06-risk-register.md`](discovery/06-risk-register.md) | You need to know what breaks and when |
| [`discovery/07-scope-and-control.md`](discovery/07-scope-and-control.md) | **Scope questions or ownership/access questions — this overrides 05** |
| [`discovery/08-design-direction.md`](discovery/08-design-direction.md) | **You are doing design work — critique, palette, type, components** |
| [`discovery/redirect-map.csv`](discovery/redirect-map.csv) | You are implementing redirects |
| [`NEXT-STEPS.md`](NEXT-STEPS.md) | **Starting a session — the ordered action list** |
| [`archive/MANIFEST.md`](archive/MANIFEST.md) | You need the archived pages, images or font |

---

## Hard deadlines

| Date | Event |
|---|---|
| **2026-10-01** | Weblium subscription renews ($99/yr) — **the card on file is currently failing.** If it lapses: custom domain disconnects, TLS stops renewing, and the DNS zone (which carries the client's MX) is at risk |
| 2026-10-11 / 10-13 | TLS certs expire for apex / `www` — auto-renewed by Weblium only while the plan is active |
| 2026-12-11 | Domain expires at NIC.UA — auto-renew is ON |

**Weblium has no export feature of any kind.** ✅ The manual archive is **done** — see
[`archive/`](archive/). Content is now safe regardless of what happens on 1 October.

⚠️ Still exposed until the DNS move: **the domain's resolution and the client's email**, both of which
depend on Weblium's nameservers. That is now the highest-priority task —
[`NEXT-STEPS.md`](NEXT-STEPS.md) Step 2.

While Weblium is still live, any asset missed by the archive is re-fetchable:
```
curl -sS -o out.jpg "https://res2.weblium.site/res/650085d7110e280017ea1194/<asset-id>"
```
After 1 October, it is not.

---

## Current architecture (what we are migrating away from)

```
NIC.UA (registrar only, no hosting)
   └── NS delegated to ns1..ns4.weblium.com
          ├── A     osteo-lifting.com  → 35.187.82.108   (Weblium/openresty, GCP)
          ├── CNAME www                → apex
          ├── MX    10 mail.osteo-lifting.com
          └── A     mail               → 95.217.45.207   (Hetzner — third-party mail, vendor unknown)

Weblium site 650085d7110e280017ea1194 ("Blank Website", Pro plan)
   └── all media on res2.weblium.site (Google Cloud Storage)
```

⚠️ **The `mail` A record and MX live inside Weblium's DNS zone.** Any DNS work must recreate them or the
client's email silently breaks. This is the easiest thing to get wrong in this project.

---

## Target architecture

```
NIC.UA (registrar — STAYS HERE, in the client's account. Never transfer.)
   └── NS → Cloudflare DNS (our account)
          ├── web    → Vercel (our account, GitHub push-to-deploy)
          ├── mail   → UNCHANGED: MX 10 mail.osteo-lifting.com + mail A → 95.217.45.207
          └── + GSC verification TXT
                (no SPF/DKIM/DMARC — email is out of scope, do not add without the client asking)

GitHub repo (our account) → push-to-deploy → static build → Vercel
```

**Hosting: Vercel, free tier — decided.** The user hosts other course-selling sites on Vercel and is
familiar with the workflow. This is settled; do not re-open it or re-raise plan tiers.

**DNS: Cloudflare** — keeps DNS independent of the host, so a future hosting change never touches
nameservers, and it allows legacy `/ru/*` redirect rules to go live *before* the rebuild ships. Using
Vercel's own nameservers instead is acceptable if one dashboard is preferred; it just means the legacy
redirects wait until cutover and land in `vercel.json`.

**Framework:** Astro preferred (zero JS by default, native i18n, Markdown content collections).
Next.js App Router is an acceptable alternative if server-side features are planned later.

---

## The nine current URLs (and where they go)

| Current | New |
|---|---|
| `/` | `/ru/` |
| `/history-ru` | `/ru/history/` |
| `/method-ru` | `/ru/method/` |
| `/ua` | `/ua/` |
| `/history-ua` | `/ua/history/` |
| `/method-ua` | `/ua/method/` |
| `/en` | `/en/` |
| `/history-en` | `/en/history/` |
| `/method-en` | `/en/method/` |

We are **deliberately restructuring rather than preserving URLs.** Justification in
[`discovery/05-migration-recommendation.md`](discovery/05-migration-recommendation.md) §5: search traffic
is 0.0%, so there are no rankings to protect, and the *old* pre-2023 site used `/ru/`-prefixed URLs that
are still linked from YouTube, VK, Facebook and Instagram — re-adopting that prefix makes those existing
backlinks resolve instead of 404.

---

## Conventions and gotchas

### i18n

- **Ukrainian `hreflang` and `lang` must be `uk`, never `ua`.** The URL path may stay `/ua/` for
  familiarity, but `hreflang="ua"` is invalid and Google discards the whole annotation cluster.
- Every page needs a full reciprocal `hreflang` set plus `x-default`.
- Set `<html lang>` per page. The current site has `lang="en"` on all 9 pages including the Russian ones.

### SEO baseline — non-negotiable in every page template

The current site is missing all of these. Do not ship a template without them:

- Exactly one `<h1>` per page (current site has **zero** on all 9 pages)
- Unique, translated `<title>` and `<meta name="description">` per page per language
- Correct `<html lang>` + `hreflang` + `x-default`
- `alt` on every image (currently 61 of 68 missing on each history page)
- `og:title`, `og:description`, `og:image` and Twitter cards on **every** page — Telegram and WhatsApp
  link previews are a primary channel for this business, not an afterthought
- Do **not** emit `<meta name="keywords">` (the current site has up to 1,984 chars of stuffed keywords)

### Structured data

Real JSON-LD, populated — the current site emits `Organization` and `LocalBusiness` blocks with entirely
empty fields and a `via.placeholder.com/1` image. Required types:

`EducationalOrganization` · `Person` (Ariel Pelevin, with `hasCredential`) · `Course` ×5 (one per product)
· `FAQPage` (5 real questions already exist) · `Review` (7 real named testimonials already exist)

`Course` and `FAQPage` are the highest-leverage additions for a training business.

### Redirects

Implement everything in [`discovery/redirect-map.csv`](discovery/redirect-map.csv). Note the ordering
caveat: the `/ru/*`, `/en/*`, `/ua/*` legacy catch-alls must be evaluated **last**, as locale-scoped 404
fallbacks — a blanket prefix rule would swallow the real `/ru/method/` pages.

Use `301`, not `302`. The current site uses `302` for trailing-slash normalisation.

### Conversion tracking

Every CTA is an outbound link to Telegram (`t.me/osteolifting`, `t.me/Olena_Hrinchuk`) or WhatsApp. There
are **no forms on the site at all**, which is why the panel reports 0 conversions for 12 months. Keep the
Telegram-first funnel — it suits the audience — but instrument it: GA4 outbound-click events carrying page,
language and course, plus deep-link parameters on the Telegram URLs. Add an on-site form as a parallel
path, not a replacement.

---

## Content notes

- **Do not invent claims.** The existing copy contains medical and weight-loss efficacy claims ("-4 kg in
  a single session", migraine relief, "completely change the structure of the skull") that are a flagged
  business/legal question. See [`discovery/04-content-inventory.md`](discovery/04-content-inventory.md)
  §2a. Do not carry them forward without an explicit client decision, and do not add new ones.
- Content is RU / UK / EN. Do not machine-translate silently — flag anything needing translation.
- The six sub-pages are thin (150–210 words each) and need real expansion, not padding.
- Contact details (email, phone, address, hours) **do not exist anywhere on the current site** and must be
  obtained from the client — they are required for the schema and for basic credibility.

---

## Working practices

- **This is a live client site.** Nothing in the Weblium panel, the NIC.UA panel, or DNS gets changed
  without explicit confirmation from the user first.
- **Never publish, cancel a subscription, or change DNS/nameservers autonomously.** Propose, then wait.
- Credentials for NIC.UA and Weblium are in `.env` (`NIC_UA_LOGIN`, `NIC_UA_PASSWORD`, `WEB_LOGIN`,
  `WEB_PASSWORD`). **`.env` must never be committed.** Note that Claude cannot type passwords into login
  forms — ask the user to authenticate in the browser, then work in the authenticated tab.
- The discovery documents record findings as verified on 2026-08-20. If something contradicts them, verify
  live before assuming the document is right, and update it.

---

## Repository layout

```
/                     project root
├── .env              credentials — NEVER commit (gitignored)
├── CLAUDE.md         this file
├── NEXT-STEPS.md     ordered action list — start here
├── discovery/        audit reports (2026-08-20), 8 documents + redirect map
└── archive/          the live site, captured 2026-08-20
    ├── pages/        9 HTML pages as served
    ├── assets/       48 images (24 jpg, 16 png, 8 svg)
    ├── fonts/        Evolventa-Regular.woff (self-hosted typeface)
    ├── meta/         robots, sitemaps, RDAP, SEO metadata, fetch logs
    └── contact-sheet.html
```

⚠️ **`archive/` is irreplaceable after 1 Oct 2026** — Weblium has no export, and its CDN goes away with the
subscription. Commit it; never delete it.

The rebuild has not started. When it does, the site source goes in its own directory, with `discovery/` and
`archive/` retained as the reference record.
