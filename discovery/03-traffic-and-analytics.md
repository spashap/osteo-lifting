# 03 — Traffic & Analytics

Source: **Weblium's built-in site statistics panel** (`site-stat.js`), read on 2026-08-20 for the window
**1 Sep 2025 → 20 Aug 2026**. This is the only measurement that exists for this domain — there is no
Google Analytics, no Tag Manager, no pixel, and no Search Console. See
[02-seo-technical-audit.md](02-seo-technical-audit.md) §6.

---

## 1. Twelve-month totals

| Metric | Value |
|---|---|
| Sessions | **2,602** |
| Pageviews | **2,987** |
| Unique visitors | **2,554** |
| Form submissions | **0** |
| Pages per session | **1.15** |
| Sessions per unique visitor | **1.02** |

Rough daily average: **7 sessions/day**. The most recent 7 days (13–20 Aug 2026) ran 71 sessions / 93
pageviews — 10/day, slightly above the annual average, so traffic is flat-to-marginally-up rather than
decaying.

---

## 2. Traffic sources — the headline finding

| Source | Share |
|---|---|
| Direct | **89.9%** |
| **Search engines** | **0.0%** |
| Referral (links from other sites) | 0.0% |
| Social networks | 0.0% |
| Paid advertising | 0.0% |
| Email | 0.0% |
| Other | 10.1% |

**Search engines contributed 0.0% of traffic over twelve months.**

This is not a "low ranking" problem. The site *is* indexed — Google returns 6+ pages for
`site:osteo-lifting.com` and Bing has at least two. The pages simply do not surface for any query anyone
actually types, because (per the audit) they have no `<h1>`, no meta descriptions, brand-only titles, no
`hreflang`, and thin sub-pages. Nothing about the site tells a search engine what it is *for*.

The 0% referral figure is also notable given the confirmed backlinks from YouTube, VK and Facebook — those
links point at the **legacy `/ru/` URLs that now 404**, so any clicks they generate never register as a
session. See [02](02-seo-technical-audit.md) §1.

---

## 3. Geography

| Country | Share | Approx. sessions |
|---|---|---|
| United States | 30.4% | ~790 |
| Russian Federation | 26.3% | ~684 |
| Ukraine | 16.2% | ~421 |
| Israel | 14.4% | ~375 |
| Latvia | 12.7% | ~330 |

Ukraine, Israel and Russia are plausible — that is where the courses run and where the founder practises.

**The United States at 30.4% and Latvia at 12.7% are not plausible** for a Russian/Ukrainian-language
osteopathy training academy operating in Israel, Europe and Serbia, with a US share arriving through a
channel that is 90% "direct."

### A caveat worth stating clearly

Combining these signals — ~90% direct, 0% search, 0% referral, 1.15 pages/session, 1.02 sessions per
visitor, and a top-two country set that does not match the business — the profile looks substantially
like **automated traffic**: crawlers, uptime monitors, scrapers and bot noise, which Weblium's
lightweight script does not filter the way GA4 would.

**This is an inference from the shape of the data, not a measured fact.** It cannot be proven without
server logs or a real analytics property. But it should temper any planning that treats 2,602 sessions as
2,602 humans. The honest planning assumption is that **real human traffic is materially lower than 2,602
sessions/year, and possibly a small fraction of it.**

The practical consequence is the same either way: there is no meaningful traffic to lose in a migration.

---

## 4. Top pages

| Page | Pageviews (12 mo) | Note |
|---|---|---|
| `/index.html` | 1,540 | How Weblium logs the RU homepage `/` |
| `/en` | 993 | English homepage |
| `/method-en` | 162 | |
| `/method-ru` | 142 | |
| `/history-ru` | 66 | |

Combined, the two homepages take **85% of all pageviews**. The six sub-pages together account for under
500 views in a year — under 1.4/day across all of them.

The English homepage at 993 views (33% of total) against a Russian-speaking core business is another
signal pointing at the traffic-quality question above — but it may equally reflect that `/en` is the page
international colleagues are given. Worth resolving with real analytics rather than guessing.

---

## 5. Conversions

**Zero form submissions in twelve months.**

This number is technically accurate and completely uninformative, because **the site has no forms.**
Verified against the live DOM: `document.querySelectorAll('form').length === 0`.

Every call to action on the site is an outbound link:

| CTA | Destination |
|---|---|
| "Записаться к А. Пелевину" | `https://t.me/osteolifting` |
| "Записаться к Е. Гринчук" | `https://t.me/Olena_Hrinchuk` |
| "Консультация" (×5, per course) | `https://t.me/osteolifting` / `t.me/Olena_Hrinchuk` |
| "Записаться" (×5, per course) | `https://t.me/osteolifting` / `t.me/Olena_Hrinchuk` |
| WhatsApp icons | `+381638219020` (Serbia), `+380976332902` (Ukraine) |

So the entire funnel is: **land on page → click out to Telegram → conversation happens off-site.**

This is not necessarily the wrong funnel — for a high-touch, high-price training business in this region,
Telegram is where the audience already is, and forcing a form in front of it could reduce enquiries. But
as currently built it produces **zero attribution**: nobody can tell how many people clicked, from which
page, in which language, or from which source. The business is flying blind on its only conversion event.

### Recommended instrumentation (rebuild)

1. **Track outbound CTA clicks as GA4 events**, with page, language and course-product as parameters.
   This alone converts an unmeasurable funnel into a measurable one.
2. **Append UTM-style deep-link parameters** to Telegram links (`t.me/osteolifting?start=method_ru`), so
   the conversation on the Telegram side carries its origin.
3. **Add an on-site enquiry form as a parallel path**, not a replacement — some visitors will not use
   Telegram, and a form captures an email address that Telegram does not.
4. Consider a lightweight booking/lead capture for the paid courses specifically.

---

## 6. What is permanently lost

Because no analytics and no Search Console have ever been connected:

- **No search query data exists** for this domain, for any period. What people searched before clicking
  is unknown and unrecoverable.
- **No historical ranking data.** No way to know whether the site ever ranked for anything.
- **No conversion history.** No baseline for what a "good month" looks like.
- **Weblium's own stats disappear with the platform.** The 12-month numbers in this document were read
  from a panel that goes away when the subscription does. They are recorded here because this is the only
  place they will survive.

This raises the priority of one item: **set up Google Search Console and Bing Webmaster Tools now**,
before the migration, verified by **DNS TXT record** so the verification survives both the DNS move and
the hosting move. Even six weeks of pre-migration baseline is infinitely better than zero, and it is the
only way to measure whether the rebuild worked.

---

## 7. Measurement plan for the rebuild

| Tool | Purpose | When |
|---|---|---|
| Google Search Console | Index coverage, queries, CTR, Core Web Vitals field data | **Now** (DNS TXT verification) |
| Bing Webmaster Tools | Bing/Copilot index coverage; IndexNow submission | **Now** |
| GA4 | Sessions, geography, outbound CTA events, language paths | **Now** on Weblium, carry over to the rebuild |
| Vercel / Cloudflare Analytics | Server-side, bot-filtered baseline | At migration |
| PageSpeed Insights (with API key) | Before/after Lighthouse + CrUX comparison | Before and after cutover |

Installing GA4 *before* the migration matters more than it sounds: it produces a clean, bot-filtered
"before" number. Without it, there is no way to demonstrate that the rebuild improved anything — the only
"before" on record is a figure that probably is not measuring humans.
