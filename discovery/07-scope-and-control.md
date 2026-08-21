# 07 — Engagement Scope & Taking Control

Added 2026-08-20 after scope was clarified. **This document overrides anything in
[05-migration-recommendation.md](05-migration-recommendation.md) that assumes content work.**

---

## 1. The goals

**The two main goals are DESIGN and SEO.**

1. **Modern design** — the current site is dull and template-shaped; this is the headline deliverable
2. **SEO / technical** — fix everything at the markup, structure, i18n, schema and performance layers
3. **Operational control** — be able to make front-end changes whenever the client asks, without
   depending on a builder platform or on anyone else's account

**Content is out of scope.** Existing copy migrates verbatim — unless the client (Ariel) specifically
requests a copy change, in which case he supplies the text.

---

## 2. Scope boundary

### In scope

| Area | What we do |
|---|---|
| **Design** | Full redesign — layout, type, colour, components, responsive behaviour |
| **Build** | Astro (or Next.js) static site, GitHub repo, push-to-deploy |
| **Content migration** | Extract all RU / UK / EN copy from the live site and port it **verbatim** into the new build |
| **Media** | Download every `res2.weblium.site` asset, self-host, convert to AVIF/WebP, responsive `srcset` |
| **URL / redirects** | New `/ru/` `/ua/` `/en/` structure + full 301 map incl. legacy backlink recovery |
| **i18n plumbing** | Correct `<html lang>`, full `hreflang` cluster + `x-default` (`uk`, never `ua`) |
| **Markup structure** | One `<h1>` per page, real `h2`/`h3` hierarchy, semantic sectioning, named anchors |
| **On-page text fields** | Titles, meta descriptions, alt text — **derived from copy already on the page**, per §3 |
| **Structured data** | `EducationalOrganization`, `Person`, `Course` ×5, `FAQPage`, `Review` — populated from existing content |
| **Social / previews** | OG + Twitter cards on every page (Telegram/WhatsApp previews are a primary channel here) |
| **Performance** | Static output, image pipeline, caching headers, HSTS 1 year, Core Web Vitals |
| **Analytics** | GA4 + outbound Telegram/WhatsApp CTA event tracking; GSC + Bing Webmaster |
| **DNS** | Move zone to Cloudflare; recreate every record **exactly**, including MX + `mail` A |
| **Operational control** | §4 below - DNS, repo, hosting under our accounts |

### Decisions already made (do not re-litigate)

| Decision | Choice | Note |
|---|---|---|
| **Hosting** | **Vercel, free tier** | The user runs other course-selling sites on Vercel without issue and prefers the familiar GitHub workflow. Settled |
| **DNS** | **Cloudflare** | Independent of host; enables pre-cutover redirect rules. Vercel DNS is an acceptable alternative |
| **On-page text** | **Derive from existing copy** | §3 |
| **Registrar** | **Stays at NIC.UA**, client's account, no transfer | §4.2 |
| **Control model** | Operational, not ownership - we run DNS, repo, hosting; client keeps domain + email | §4 |
| **Email** | **Do not touch** | See below |

### ⚠️ Email — out of scope, hands off

The client keeps their existing mail service. It is **not** part of this project.

The only email-adjacent work is **replicating the existing DNS records exactly** during the Cloudflare
move, because the zone currently lives on Weblium:

```
osteo-lifting.com.       MX  10 mail.osteo-lifting.com.
mail.osteo-lifting.com.  A      95.217.45.207
```

**Do not add SPF, DKIM, DMARC or any other email record without the client explicitly asking.** The
domain has none today; adding an SPF record without knowing the sending infrastructure is the single
fastest way to start silently dropping their legitimate mail. The absence of email authentication is
recorded as a finding in [06-risk-register.md](06-risk-register.md) R5 and handed to the client as an
optional future item — it is not ours to fix here.

The "who runs `95.217.45.207`" question is therefore **no longer a blocker.** It drops to informational.

### Out of scope

| Area | Why | Who owns it |
|---|---|---|
| Rewriting or expanding copy | Content work, explicitly excluded | Client / future phase |
| Expanding the 6 thin pages (150–210 words each) | Same | Client / future phase |
| Resolving the medical & weight-loss claims ("−4 kg in one session", migraine relief, "completely change the structure of the skull") | Business/legal decision, not technical | **Client — flagged once, then carried forward as-is** |
| Translation or translation QA | Content work | Client |
| Pricing, course schedules, new pages | Content that does not exist yet | Client |
| Privacy policy / terms text | Legal copy | Client (we wire up the pages and cookie consent) |
| SEO keyword strategy, content calendar, link building | Marketing, not technical | Future phase |

### Client inputs we still need (data, not copy)

These are **facts to be supplied**, not writing. Without them, some markup ships incomplete:

- Business email, phone, postal address, opening hours → required for `EducationalOrganization` /
  `LocalBusiness` schema and the contact section. Currently **absent from the entire site**
- Whether a Google Business Profile exists
- Privacy policy / terms text, if they want those pages populated

Not a blocker any more: the mail vendor behind `95.217.45.207`. Email is out of scope, so we only copy
the existing records verbatim.

If contact details are not supplied, we ship `EducationalOrganization` + `Person` + `Course` + `FAQPage`
+ `Review` and **omit `LocalBusiness`** rather than emit another empty block like the current site does.

---

## 3. On-page text policy — "derive, don't author"

Decision: **derive from existing copy.** The rule is that every string we produce must be traceable to
words already on the page. No new claims, no new benefits, no expansion.

| Field | Method | Example |
|---|---|---|
| `<h1>` | Promote the existing top `<h2>` verbatim | `Международная Академия OSTEO-LIFTING` becomes the `h1` instead of an `h2` |
| `<title>` | Existing page heading + an existing descriptor already used on the page | `О методе Остеолифтинг — Международная Академия OSTEO-LIFTING` |
| `<meta description>` | Truncate/assemble from sentences already in that page's body, 140–160 chars | Pulled from the existing method description paragraph |
| `alt` | Factual description of what the image depicts | `Ариэль Пелевин с книгой «Остео-лифтинг»` |
| `og:description` | Same string as the meta description | — |
| Anchor IDs | Replace Weblium's `#custom-1` / `#custom-3` with semantic slugs | `#instructors`, `#courses`, `#faq` |

**Hard constraint:** the health and efficacy claims are not to be repeated, amplified, or moved into
titles, descriptions or headings. They stay exactly where they currently sit in body copy. Promoting a
claim like "−4 kg in one session" into a `<title>` would be authoring a new claim in a far more prominent
slot — out of scope and a liability.

⚠️ **Alt-text scope — corrected 2026-08-20.** An earlier estimate here said ~183 alt strings, based on
counting 68 `<img>` tags per history page. Archiving proved that wrong: 67 of those 68 tags have no `src`
and load nothing. The site has **48 distinct image assets in total** (40 raster + 8 decorative SVG), shared
across all three languages.

Real effort: describe ~40 images once, translate into three languages, `alt=""` for the decorative SVGs.
Contained, not a slog.

---

## 4. Control — what it actually means here

**Clarified by the user:** "control" means being able to **make front-end changes to the website whenever
Ariel asks**, without a builder platform in the way. It does **not** mean taking ownership of the client's
assets.

That is a cleaner arrangement than full consolidation, and it removes an entire category of risk: the
client keeps what is his, we operate what we build.

### 4.1 Target end-state

| Asset | Today | Target | Whose account |
|---|---|---|---|
| **Domain registration** | NIC.UA, account "Ariel Pelevin" | **NIC.UA, unchanged — no transfer** | **Client's** |
| DNS zone | Weblium nameservers | **Cloudflare** | **Ours** |
| Hosting | Weblium (failing card) | **Vercel free tier** | **Ours** |
| Source code | Does not exist | **GitHub** (private) | **Ours** |
| Media assets | `res2.weblium.site` | **In the repo** | **Ours** |
| Google Search Console | Does not exist | New property, DNS-TXT verified | Ours, client added as user |
| Bing Webmaster | Does not exist | New property | Ours |
| GA4 | Does not exist | New property | Ours, client added as viewer |
| Email (MX) | Third-party | **Unchanged, untouched** | Client's |

**The only thing needed from the client's NIC.UA account is a one-time nameserver change.** After that,
everything we operate day-to-day lives in our own accounts, and Ariel keeps his domain and his email
exactly as they are.

### 4.2 Registrar — stays at NIC.UA, no transfer

This supersedes an earlier draft of this section that recommended transferring to Cloudflare Registrar.
**The user's call: keep it at NIC.UA and just point the nameservers at Cloudflare.** Correct, and simpler:

- No unlocking of `clientTransferProhibited`, no auth code, no **60-day transfer lock**
- No risk introduced during the migration window
- Auto-renew is already ON; expiry 11 Dec 2026 is comfortably clear of the work
- The domain stays with its owner, which is where it belongs
- Nameserver delegation gives full DNS control anyway — a registrar transfer would have added ownership,
  not capability, and ownership was never the goal

Net effect: **one nameserver change at NIC.UA, then we never need that account again** for normal
operation. Access is only needed for future NS changes or renewal issues.

Consequence worth noting: since the domain stays in the client's account, **keep a valid card on file
there**. The Weblium card is already failing — if it is the same card, the 11 Dec 2026 domain renewal is
exposed too. Worth confirming with Ariel directly.

### 4.3 What "make front-end changes on request" needs

To satisfy the actual goal, the setup must give:

- **Push-to-deploy** — a change is a commit; Vercel builds and ships it. No panel, no platform, no waiting
- **Preview deploys** — show Ariel a live preview URL before anything goes to production
- **Rollback** — every deploy is revertible instantly; git history is the audit trail
- **DNS control** — redirects, subdomains and record changes without touching the registrar
- **No per-change platform cost** — unlike Weblium, where the ability to edit is tied to a subscription

All four come free with the GitHub → Vercel + Cloudflare DNS setup. This is the part that fails today:
right now, any change requires the Weblium editor, which requires the Weblium subscription, which is
currently failing to bill.

### 4.4 Credential hygiene

- `.env` holds `NIC_UA_LOGIN` / `NIC_UA_PASSWORD` / `WEB_LOGIN` / `WEB_PASSWORD`. It is gitignored and
  must stay that way
- Those are the **client's** credentials on the client's accounts — needed only for the one-time
  nameserver change at NIC.UA and to wind Weblium down. After that, day-to-day work never touches them
- The NIC.UA account stays the client's. Do not change its password, its contact details, or its ownership
- Put everything in a password manager with 2FA. The registrar account especially — a domain is the one
  asset here that cannot be rebuilt

### 4.5 Control checklist

```
[ ] GitHub repo created (private, our account)
[ ] Site archived to repo — all HTML + every res2.weblium.site asset   ← before 1 Oct 2026
[ ] Cloudflare account created (ours), zone added
[ ] Zone records replicated exactly, incl. MX + mail A record
[ ] Nameservers changed at NIC.UA → Cloudflare  (the ONLY change made to the client's registrar account)
[ ] Mail send/receive verified after NS change
[ ] CAA added (optional) — NO SPF/DKIM/DMARC, email is out of scope
[ ] GSC verified by DNS TXT (our account, client added as user)
[ ] Bing Webmaster verified (our account)
[ ] GA4 property created (our account, client as viewer)
[ ] Hosting account set up, preview deploys running
[ ] --- cutover ---
[ ] Weblium subscription cancelled (only after new site verified live for 1 week)
[ ] Registrar NOT transferred - stays at NIC.UA in the client's name, by design
[ ] Client confirmed a valid card is on file at NIC.UA for the 11 Dec 2026 renewal
[ ] All credentials in password manager with 2FA
```

---

## 5. Expectation-setting: what "technical only" can and cannot deliver

Worth being straight about, so the outcome is not judged against the wrong yardstick.

**What the technical rebuild will deliver:**

- A site that is fast, owned, version-controlled, and free of the 1 October failure risk
- Correct crawling, indexing and language targeting for the first time
- Rich-result eligibility via `Course`, `FAQPage` and `Review` markup — genuinely valuable for a training
  business, and drawn entirely from content that already exists
- Recovered backlinks from YouTube / VK / Facebook, which currently hit 404s
- A measurable funnel — outbound Telegram/WhatsApp clicks tracked, replacing the current total blindness
- A design that no longer looks like a 2023 template

**What it will not deliver:**

Meaningful organic search traffic. That needs content, and content is out of scope. Six of the nine pages
are 150–210 words; no amount of technical correctness makes a 160-word page rank against real competition.
The current site earns **0.0% of its traffic from search** — after this work it will be *capable* of
ranking, correctly indexed and technically clean, but the pages still will not have enough substance to
compete.

That is a fine outcome for this engagement — it is exactly what "technical, not content" means. It just
means the honest success metric is **infrastructure control, site quality, page speed, rich-result
eligibility and recovered referral traffic** — not organic sessions. Organic growth is a separate,
later, content-led phase, and the rebuild is the prerequisite that makes it possible.
