# 06 — Risk Register

Ranked by *time pressure × consequence*, not by category. Verified 2026-08-20.

---

## Fixed dates

| Date | Event | Auto-handled? |
|---|---|---|
| **2026-09-02** | Weblium old-pricing lock-in offer expires | Irrelevant unless staying on Weblium |
| **2026-10-01** | **Weblium subscription renews — $99, card currently failing** | ❌ **No** |
| 2026-10-11 | TLS certificate for `osteo-lifting.com` expires | ✅ Auto-renewed by Weblium — *while the plan is active* |
| 2026-10-13 | TLS certificate for `www.osteo-lifting.com` expires | ✅ Same caveat |
| **2026-12-11** | Domain registration expires at NIC.UA | ✅ Auto-renew ON |

---

## R1 — Weblium payment failure takes the site down · **CRITICAL** · ~6 weeks

**What.** The Weblium panel shows an active billing error: *"Проблема с оплатой: проверьте платёжные
данные или добавьте новую карту. В противном случае сайт перейдёт на Free подписку и потеряет свои Pro
возможности."* The subscription renews 1 October 2026 at $99/yr.

**Consequence.** Custom-domain support is a Pro feature. On downgrade, `osteo-lifting.com` disconnects
from the site. Certificate renewal stops too, so within days browsers begin showing a **full-page security
interstitial** rather than a simple error — a harder failure than an outage, and one that damages trust
with anyone who does reach the domain.

**Mitigation.** Fix the card, or make a deliberate decision to let it lapse *after* cutover. Either way,
Phase 0 and Phase 1 of the [migration plan](05-migration-recommendation.md) remove the existential part of
this risk within a week.

---

## R2 — DNS is hosted on Weblium, and it carries the client's email · **CRITICAL** · ~6 weeks

**What.** The authoritative nameservers for `osteo-lifting.com` are `ns1`–`ns4.weblium.com`. The zone
contains not only the website records but:

```
osteo-lifting.com.       MX  10 mail.osteo-lifting.com.
mail.osteo-lifting.com.  A      95.217.45.207
```

That mail server is on **Hetzner infrastructure with no connection to Weblium**. It will keep running
perfectly. It simply becomes **unreachable** if Weblium stops answering DNS, because nothing else knows
where `mail.osteo-lifting.com` points.

**Consequence.** A failed $99 website charge can silently kill the client's email. This is the least
obvious risk in this document and probably the most damaging.

**Mitigation.** Move DNS to Cloudflare now (Phase 1). Copy the zone exactly — **including the `mail` A
record**, which is the one people forget. Test mail flow immediately after the NS change.

---

## R3 — All media lives on Weblium's CDN, with no export · **CRITICAL** · ~6 weeks

**What.** Every image is served from `res2.weblium.site` (Weblium's Google Cloud Storage). Weblium provides
**no export of code, content or assets** — the company has publicly acknowledged this and only says the
feature is "being considered."

**Consequence.** When the plan lapses, the images are gone. The `/history-*` pages carry **68 images each**
which appear to be a photographic archive of the Academy's history, and may not exist in full anywhere
else.

**Mitigation.** Phase 0, this week: download every `res2.weblium.site` object and commit it to the new
GitHub repo. This is irreversible if missed.

---

## R4 — No backups of anything · **HIGH** · already true

**What.** No export exists, no archive exists, no version history exists. The only copy of the site is the
live Weblium instance. Weblium's "История сайта" (site history) feature exists but is internal to the
platform and disappears with it.

**Mitigation.** Phase 0 archive → git. Permanent version history from that point on. This is one of the
structural benefits of moving to a GitHub-backed static site: the "no backup" category of risk stops
existing.

---

## R5 — No email authentication on a domain with live mail · **HIGH** · ongoing

**What.** No `SPF`, no `DKIM`, no `DMARC` — the domain has **zero TXT records** while running an active
mail server.

**Consequence.** Anyone can send mail that appears to come from `@osteo-lifting.com`. For a business that
takes course bookings and payments via direct conversation, that is a live impersonation vector. It also
means legitimate mail from the domain is more likely to be filtered as spam.

**Mitigation.** ⚠️ **Not actioned in this engagement — email is explicitly out of scope.** Recorded and
handed to the client as an optional future item. The fix is SPF, DKIM and DMARC (`p=none` first, tighten
after monitoring), which requires knowing the sending infrastructure behind `95.217.45.207`. Adding an SPF
record without that knowledge silently drops legitimate mail, so it must not be done blind.

---

## R6 — Legacy `/ru/` URLs 404 while still receiving links · **HIGH** · ongoing, quantifiable

**What.** The previous site used `/ru/`-prefixed URLs. Live external links from the **YouTube channel
(470+ subscribers)**, a **VKontakte community**, **Facebook** event pages and **Instagram** posts all point
there. Every one currently returns 404.

**Consequence.** Ongoing, invisible loss of the site's only real referral traffic. Anyone discovering the
academy through the founder's YouTube channel — plausibly the single most common discovery path for this
business — hits an error page.

**Mitigation.** Prefix catch-all `301`s. Fixable **immediately after the Cloudflare DNS move**, in front of
the existing Weblium site, without waiting for the rebuild.

---

## R7 — Zero analytics and zero Search Console · **HIGH** · ongoing

**What.** No GA4, no GTM, no pixel, no GSC, no Bing Webmaster. The only measurement is Weblium's own
script, which dies with the platform.

**Consequence.** No search-query history exists for this domain and none can be recovered. There is no
credible "before" number against which to demonstrate that the rebuild worked — and the one number that
does exist (2,602 sessions) appears substantially non-human
([03](03-traffic-and-analytics.md) §3).

**Mitigation.** Set up GSC + Bing (DNS TXT verification, so it survives the moves) and GA4 **this week**,
on the *current* site. Six weeks of clean baseline is worth far more than starting the clock at launch.

---

## R8 — Domain expiry · **MEDIUM** · 11 Dec 2026 · auto-handled

**What.** `osteo-lifting.com` expires 2026-12-11 at NIC.UA.

**Why only medium.** Auto-renew is confirmed ON in the registrar panel. The 7½-year-old domain is the
single most valuable asset in this project — losing it would be catastrophic and unrecoverable — but the
mechanism to keep it is already in place.

**Mitigation.** Confirm a valid card is on file at NIC.UA (note that the Weblium card is already failing;
if it is the same card, this becomes urgent). Set a calendar reminder for 1 Nov 2026 to verify renewal.

---

## R9 — Health and weight-loss efficacy claims · **MEDIUM** · business/legal

**What.** The site claims *"-4 kg in a single session"*, cellulite removal, migraine relief, the ability to
"completely change the structure of the skull" in 2–5 sessions, and positions the method as a "safe
alternative to invasive rejuvenation surgery."

**Consequence.** Advertising-standards exposure in the EU and Israel, and this is precisely the content
category Google's "Your Money or Your Life" guidelines scrutinise hardest — meaning the claims make the
site *harder* to rank, not easier.

**Mitigation.** Client decision before any copy is written for the rebuild. At minimum, separate *what the
training teaches* from *what results a client will get*, and drop absolute outcome numbers.

---

## R10 — No privacy policy, terms or cookie notice · **MEDIUM** · compliance

**What.** None of the three exists. The site serves EU visitors (Spain, Netherlands and Latvia all appear
in the traffic data) and handles enquiries. Weblium offers a cookie-banner feature; it is not enabled.

**Mitigation.** Add all three in the rebuild. Once GA4 is installed, a consent mechanism becomes a
requirement rather than a nicety.

---

## R11 — Single point of human control · **MEDIUM** · ongoing

**What.** Every credential — registrar, site platform, and by extension DNS — sits in one person's
accounts. The Weblium site is still named **"Blank Website"** and its business-info fields are entirely
empty, which suggests nobody has done a careful pass over this account in a long time.

**Mitigation.** Document access in a password manager; add a second contact where each platform supports
it; ensure the client (not only the contractor) can reach the registrar account. Worth resolving as part of
taking over the project.

---

## R12 — Migration execution risk · **LOW–MEDIUM** · during cutover

Covered in detail in [05-migration-recommendation.md](05-migration-recommendation.md) §9. The headline
points: keep TTLs at 300s through the cutover window so rollback is minutes rather than hours; verify
certificates issue for **both** apex and `www` before flipping DNS; and automate the check of all 9 old
URLs plus legacy prefixes against the preview deploy before going live.

Notably **absent** from this list: the usual "we might lose our rankings" risk. With 0.0% search traffic
over twelve months, there is nothing to lose — every GSC movement after launch is upside.

---

## Risk summary

| # | Risk | Severity | Deadline | Resolved by |
|---|---|---|---|---|
| R1 | Weblium payment failure | 🔴 Critical | 1 Oct 2026 | Fix card / Phase 0–1 |
| R2 | DNS + email hostage to Weblium | 🔴 Critical | 1 Oct 2026 | Phase 1 — move DNS |
| R3 | Media on Weblium CDN, no export | 🔴 Critical | 1 Oct 2026 | Phase 0 — archive |
| R4 | No backups | 🟠 High | now | Phase 0 — archive to git |
| R5 | No SPF/DKIM/DMARC | 🟠 High | now | Phase 1 — DNS records |
| R6 | Legacy `/ru/` 404s | 🟠 High | now | Phase 1 — Cloudflare redirects |
| R7 | No analytics / GSC | 🟠 High | now | Phase 1 — GSC + GA4 |
| R8 | Domain expiry | 🟡 Medium | 11 Dec 2026 | Auto-renew ON; verify card |
| R9 | Health claims | 🟡 Medium | before copywriting | Client decision |
| R10 | No privacy/terms/cookies | 🟡 Medium | at launch | Phase 2 |
| R11 | Single point of control | 🟡 Medium | ongoing | Access documentation |
| R12 | Cutover execution | 🟢 Low–Med | Phase 3 | Low TTLs + automated checks |
