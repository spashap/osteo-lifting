# osteo-lifting.com — Discovery Report

**Site:** https://osteo-lifting.com — Международная Академия OSTEO-LIFTING (M.A.O.)
**Client:** Dr. Ariel Pelevin (founder), Olena Hrinchuk (director / instructor in Ukraine)
**Business:** Paid offline and online training courses in a manual, non-surgical face and body correction method (osteo-lifting), plus private practice.
**Audit date:** 2026-08-20
**Method:** External crawl of all 9 live pages, DNS / RDAP / TLS inspection, authenticated read-only review of the Weblium panel and the NIC.UA registrar panel, live-DOM inspection, index checks on Google and Bing.

---

## Documents

| File | Contents |
|---|---|
| [01-current-state.md](01-current-state.md) | Platform, hosting, DNS, registrar, subscription, email |
| [02-seo-technical-audit.md](02-seo-technical-audit.md) | Every technical and on-page SEO finding, severity-ranked |
| [03-traffic-and-analytics.md](03-traffic-and-analytics.md) | 12 months of real traffic data, and what is not being measured |
| [04-content-inventory.md](04-content-inventory.md) | Page-by-page content, CTAs, conversion paths |
| [05-migration-recommendation.md](05-migration-recommendation.md) | **The recommendation** — stack, hosting, DNS, phased plan |
| [06-risk-register.md](06-risk-register.md) | Deadlines and failure modes, ranked |
| [07-scope-and-control.md](07-scope-and-control.md) | **Scope boundary + ownership runbook — read before acting on 05** |
| [08-design-direction.md](08-design-direction.md) | Design critique and modernisation brief |
| [redirect-map.csv](redirect-map.csv) | Complete 301 map for the rebuild |
| [../NEXT-STEPS.md](../NEXT-STEPS.md) | **Ordered action list for the next session** |
| [../archive/MANIFEST.md](../archive/MANIFEST.md) | What was captured from the live site, and how |

> **Scope, settled 2026-08-20 — the two main goals are DESIGN and SEO.**
> **Content is out of scope** — existing copy migrates verbatim (unless Ariel requests a change and
> supplies the text). **Email is out of scope** — records copied as-is, nothing added.
> Hosting: **Vercel free tier**. DNS: **Cloudflare** (ours). Registrar: **stays at NIC.UA**, client's
> account, no transfer. Control is **operational, not ownership**.
> Details in [07-scope-and-control.md](07-scope-and-control.md); it overrides any content, hosting or
> registrar deliberation left in [05](05-migration-recommendation.md).

---

## Executive summary

### The urgent part (act before 1 October 2026)

The site is **about six weeks away from going dark**, and this has nothing to do with the redesign.

The Weblium subscription (Website Pro, $99/yr) renews **1 October 2026**, and the panel is currently
showing a **payment failure warning**: *"Проблема с оплатой: проверьте платёжные данные или добавьте
новую карту. В противном случае сайт перейдёт на Free подписку и потеряет свои Pro возможности."*

A drop to the Free plan takes the custom domain with it. And because **the DNS zone for
osteo-lifting.com is hosted on Weblium's nameservers** (`ns1`–`ns4.weblium.com`), that same event puts
the domain's **MX record at risk too** — the client's mail server at `mail.osteo-lifting.com` runs on a
completely separate machine (Hetzner, `95.217.45.207`) but is only reachable *because Weblium's DNS
answers for it*.

On top of that, **every image on the site lives on `res2.weblium.site`**, Weblium's own CDN, and
**Weblium offers no code or content export at all** ([confirmed by Weblium themselves](https://appsumo.com/products/weblium/questions/hi-is-there-any-export-option-to-run-a-117969/)).
If the plan lapses before the assets are pulled down, the media is gone.

Three things should happen this week, independent of any migration decision:

1. **Archive the site** — all 9 pages of HTML plus every asset from `res2.weblium.site`.
2. **Move the DNS zone off Weblium** (to Cloudflare), replicating the current records exactly.
   This decouples the domain *and the client's email* from the Weblium billing problem.
3. **Fix, or consciously decide about, the Weblium card.** Do not let it lapse by accident.

The domain itself is in better shape: registered at NIC.UA (NICNAMES, INC.), expiring
**11 December 2026**, with **auto-renew switched ON**. No action needed beyond keeping a valid card there.

### The reassuring part

The migration carries **almost no SEO risk, because there is almost no SEO to lose.**

Weblium's own analytics for the last 12 months (1 Sep 2025 – 20 Aug 2026):

| Metric | Value |
|---|---|
| Sessions | 2,602 |
| Pageviews | 2,987 |
| Unique visitors | 2,554 |
| **Traffic from search engines** | **0.0%** |
| Traffic direct | 89.9% |
| Traffic from social / referral / ads | 0.0% |
| **Form submissions** | **0** |

Search engines sent **zero** measurable traffic in a year. Pages-per-session is 1.15, meaning
essentially every visit is one page and out. The country mix (USA 30.4%, Russia 26.3%, Ukraine 16.2%,
Israel 14.4%, Latvia 12.7%) combined with 90% "direct" and 0% search reads more like automated traffic
than an audience — so the real human number is likely well below 2,602. That is an inference from the
shape of the data, not a measured fact, but it matters for how much weight to put on "preserving
rankings."

So the usual migration anxiety — *will we lose our Google positions?* — does not really apply.
**There are no positions to protect.** That is liberating: the rebuild can adopt a proper URL
structure instead of being handcuffed to Weblium's odd `/method-ru`, `/history-ua` suffix scheme.

### What is actually indexed

Google has the current pages indexed (home RU / UA / EN, `/history-ru`, `/method-ru`, `/method-ua`).
Bing has at least `/en` and `/method-en`. So indexing *works* — the pages simply do not rank for
anything anyone searches, which is a content and on-page problem, not a crawling problem.

There is, however, **one concrete piece of equity currently being thrown away.** The site used to live
at a *different URL structure* — `osteo-lifting.com/ru/`, with slugs like `/ru/founder-and-creator/`.
Those old URLs are still linked from real external sources:

- the **YouTube channel** "ARIEL PELEVIN LIVE" (470+ subscribers) — channel link is `osteo-lifting.com/ru`
- a **VKontakte community** (`club6278059`) — site field is `www.osteo-lifting.com/ru`
- **Facebook** event and course pages
- **Instagram** posts by course participants

Every one of those links currently lands on a **404**. There is no redirect from `/ru/` to anything.
This is free, recoverable referral traffic, and fixing it is essentially a one-line rule.

### Hosting: Vercel + GitHub — decided

This is a 9-page, 3-language brochure site with no CMS, no store, no forms and no dynamic behaviour. A
statically generated site on **Vercel's free tier**, sourced from a GitHub repo, is a clean fit and a
large upgrade over Weblium in every dimension that matters — performance, control, redirects, schema,
i18n, version history, and the cost of iterating. Decided by the user, who already runs several
course-selling sites on this exact setup.

**DNS goes to Cloudflare**, kept separate from the host so a future hosting change never touches
nameservers — and so the legacy `/ru/*` redirects can go live before the rebuild ships.

**Registrar: stays at NIC.UA, in the client's account — no transfer.** Nameserver delegation gives full
DNS control, which is all that is needed here. "Control" in this engagement means being able to ship
front-end changes on request, not owning the client's assets — so the domain and the email stay exactly
where they are, and the only change made to the client's registrar account is a one-time nameserver
switch. Reasoning in [07-scope-and-control.md](07-scope-and-control.md) §4.

Full stack choice, DNS cutover sequence and phase plan:
**[05-migration-recommendation.md](05-migration-recommendation.md)**.

### The redesign brief writes itself

The audit found the on-page basics are not merely weak — several are simply absent:

- **Zero `<h1>` elements on all 9 pages.** Every heading is an `<h2>`.
- **Zero meta descriptions** on all 9 pages.
- **`<html lang="en">` on every page**, including the Russian and Ukrainian ones.
- **No `hreflang`** anywhere, despite three language versions.
- The RU and UA homepages share an **identical Russian `<title>`**.
- **Keyword-stuffed `<meta name="keywords">`** — up to 1,984 characters of repeated phrases. Ignored by
  Google, but a visible marker of low-quality prior SEO work.
- **JSON-LD present but completely empty** — `Organization` and `LocalBusiness` blocks with blank name,
  description, phone and address, plus a `via.placeholder.com/1` image.
- **61 of 68 images on each `/history-*` page have no `alt` text.**
- **No analytics of any kind** — no GA4, no GTM, no Meta Pixel, and no Search Console verification.
- **No contact form.** All CTAs link straight out to Telegram or WhatsApp, so conversions are invisible
  and unattributable. This is why "form submissions" reads 0 — there are no forms.

Meanwhile the site *has* genuinely strong raw material that is being wasted: 7 detailed named
testimonials from practitioners in 6 countries, a real 5-question FAQ, 5 distinct course products, and
a founder with quantified credentials (200+ seminars, 14 countries, 6,500+ students trained). None of
it is marked up as `Review`, `FAQPage`, `Course` or `Person` structured data. That is the single
largest quick win available in the rebuild.

Details and severity ranking: **[02-seo-technical-audit.md](02-seo-technical-audit.md)**.

All of the above is fixable without touching the copy — the missing pieces are markup slots, and the text
to fill them already exists on the page. That is the scope line: **derive, don't author**
([07](07-scope-and-control.md) §3).

### And the design is the headline

The current site is a stock Weblium template with the client's photos dropped into it. Its central failure
is hierarchy: the founder's strongest credential (*200+ seminars, 14 countries, 6,500+ students*) sits in
the same visual register as a bullet about ergonomics; five distinct commercial products are stacked in
one undifferentiated run; seven detailed testimonials from named professionals across six countries read
as an unbroken wall of text. The raw material is good — the design spends none of it.

Critique, direction, typography (with the Cyrillic constraint that rules out most display faces), palette,
component system and page structure: **[08-design-direction.md](08-design-direction.md)**.
