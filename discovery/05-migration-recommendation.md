# 05 — Migration Recommendation

> **⚠️ Updated 2026-08-20 after scope clarification.** Decisions are now settled — see
> [07-scope-and-control.md](07-scope-and-control.md). Where this document deliberates, the answer below wins:
>
> - **Hosting: Vercel, free tier** — decided by the user, who runs other course-selling sites on it. §3's
>   plan-tier discussion is superseded and closed
> - **Email: out of scope.** Copy the DNS records exactly; add no SPF/DKIM/DMARC. §4's email-auth
>   recommendations are handed to the client as optional, not actioned here
> - **Content: out of scope.** Copy migrates verbatim. Phase 2 item 13 (expanding thin pages, resolving
>   health claims) is **removed from this engagement**
> - **Registrar: no transfer.** Stays at NIC.UA in the client's name; nameservers change only. §8's
>   "rejected" verdict stands
> - **Main goals: DESIGN and SEO.** "Control" means being able to ship front-end changes on request, not
>   owning the client's assets

---

## Decision summary

| Question | Decision |
|---|---|
| **Move off Weblium?** | **Yes** — and the timing is forced by billing, not by the redesign |
| **Where to host?** | **Vercel, free tier**, from a GitHub repo — decided |
| **What to build with?** | **Astro** (first choice) or **Next.js App Router**. Static output either way |
| **Where does DNS live?** | **Cloudflare** — move it *before* anything else, and before 1 Oct 2026 |
| **Transfer the domain registrar?** | **No.** Stays at NIC.UA in the client's name. Nameservers only |
| **Keep the current URLs?** | **No — restructure to `/ru/`, `/ua/`, `/en/`.** Explained in §5; a deliberate departure from the usual "preserve every URL" rule |
| **Rebuild or port?** | **Rebuild.** Weblium has no export; there is nothing to port |
| **Content?** | **Verbatim migration only.** No rewriting, no expansion |
| **Email?** | **Untouched.** Records copied as-is |

---

## 1. Why leave Weblium

The redesign is the stated reason, but it is the weakest of the four:

1. **Billing is failing and the deadline is 1 October 2026.** The Weblium panel shows a payment error.
   Downgrade to Free removes custom-domain support, and the TLS certificates expire 11 and 13 October.
   See [06-risk-register.md](06-risk-register.md).
2. **The DNS zone and the client's email are hostage to that billing problem.** The MX record for
   `osteo-lifting.com` lives in Weblium's DNS. The mail server itself is elsewhere (Hetzner) and is
   completely fine — but unreachable if Weblium stops answering DNS.
3. **Weblium has no export.** No HTML, no assets, no content. The platform has publicly acknowledged this
   and only says it is "considering" the feature. Everything on that platform is one lapsed payment from
   being unrecoverable.
4. **The platform ceiling blocks most of the SEO fixes.** Redirects, `hreflang`, per-page `lang`, `<h1>`
   control, custom JSON-LD, `301` vs `302`, cache headers — none of it is reachable from the Weblium
   panel. Roughly two thirds of the findings in [02](02-seo-technical-audit.md) are unfixable in place.

The redesign is a good reason to rebuild. The billing failure is why it has a date on it.

---

## 2. Framework: Astro first, Next.js if preferred

This is 9 pages of static brochure content in 3 languages. No CMS, no store, no auth, no dynamic data.

### Recommended: **Astro**

- Ships **zero JavaScript by default** — a genuinely large win over the current 476 KB of HTML plus
  5,104 CSS rules, and over what a typical Next.js build produces for the same content
- Native `i18n` routing for the `/ru/` `/ua/` `/en/` structure, with `hreflang` helpers
- Content Collections give you type-checked Markdown per language — the client (or you) edits `.md` files,
  not JSX, which matters if content is ever handed back
- Trivial static output; deploys to Vercel with no configuration
- Islands available if any single component later needs interactivity

### Also fine: **Next.js (App Router, static)**

Choose this if you already have Next.js muscle memory, expect the site to grow server-side features
(booking, payments, a course portal), or want the tightest Vercel integration. For *this* site today it is
more machinery than the job needs, but it is not a wrong answer — and if the plan is to add a booking
system or a members' area for course materials later, it becomes the right one.

**Do not use WordPress here.** It would reintroduce a hosting bill, a security surface, plugin
maintenance, and a database, in exchange for a CMS that 9 static pages do not need.

**Do not use another site builder** (Tilda, Wix, Squarespace). It would swap one lock-in and one export
problem for an identical pair.

---

## 3. Hosting — decided: Vercel, free tier

**Settled.** The user already hosts several course-selling sites on Vercel's free tier without issue,
knows the workflow, and wants the GitHub integration. Plan tiers were raised once and the user made the
call; this is closed and should not be re-opened.

Practical implications for the build:

- Static output deploys to Vercel with zero configuration from either Astro or Next.js
- Redirects go in `vercel.json` (`"redirects"` array), which covers the entire
  [redirect-map.csv](redirect-map.csv) including the locale-scoped legacy fallbacks
- Cache and security headers go in `vercel.json` (`"headers"`) — this is where the HSTS 1-year fix and
  real `Cache-Control` values land
- Preview deploys per branch/PR come free and are the QA surface before cutover
- Bandwidth and build limits are not a concern at this site's volume

### Historical note — the alternative that was considered

Retained only so the reasoning is on record; **not the plan.**

Cloudflare Pages was the other candidate — free, and hosting plus DNS in one dashboard. It was not chosen
because familiarity and an existing working GitHub → Vercel pipeline are worth more here than
consolidating two dashboards into one.

The build artifact is identical static output in both cases, so **the choice stays reversible in an
afternoon** if it ever needs revisiting. Nothing in the build should assume Vercel-specific behaviour
beyond `vercel.json`.

---

## 4. Registrar and DNS

### Registrar: stays at NIC.UA - no transfer

- The domain is 7½ years old and carries `clientTransferProhibited`
- A transfer requires unlocking, an auth code, and triggers a **60-day transfer lock** afterwards
- Auto-renew is already ON and the expiry (11 Dec 2026) is comfortably beyond the migration

**No transfer — decided.** The domain stays in the client's NIC.UA account. Nameserver delegation to
Cloudflare gives full DNS control, which is all that is needed; a transfer would move *ownership*, which
was never the goal. See [07-scope-and-control.md](07-scope-and-control.md) §4.2.

⚠️ Because the domain stays on the client's card, confirm a valid card is on file at NIC.UA. The Weblium
card is already failing - if it is the same card, the 11 Dec 2026 domain renewal is exposed too.

### DNS: move to Cloudflare — do this first, before any rebuild work

This is the single highest-value, lowest-risk action available, and it should happen **this week**.

Why Cloudflare:

- **Decouples the domain and the client's email from the Weblium subscription.** Right now a failed $99
  charge can take down mail. After the move it cannot.
- Free, fast, reliable anycast DNS
- **Bulk Redirects let you fix the legacy `/ru/` 404s immediately**, in front of the *existing* Weblium
  site, months before the rebuild ships (see §6)
- Independent of the host, so a future hosting change never touches nameservers
- (Email records stay exactly as they are — see the scope note above)

### Records to recreate exactly (copy before changing anything)

```
osteo-lifting.com.        A      35.187.82.108        ; Weblium origin — swap at cutover
www.osteo-lifting.com.    CNAME  osteo-lifting.com.
osteo-lifting.com.        MX  10 mail.osteo-lifting.com.
mail.osteo-lifting.com.   A      95.217.45.207        ; ⚠️ MUST be recreated or email breaks
```

⚠️ **The `mail` A record is the one that gets forgotten.** It is not obviously part of "the website," and
losing it silently breaks the client's email. Verify mail flow immediately after the NS change.

### Records to add — limited, because email is out of scope

```
osteo-lifting.com.        TXT   "google-site-verification=..."   ; GSC — survives every later move
osteo-lifting.com.        CAA   0 issue "letsencrypt.org"        ; optional, low risk
```

**Do not add SPF, DKIM or DMARC.** Email is explicitly out of scope — the client keeps their existing mail
service untouched. The domain does currently run live mail with **no email authentication at all**, which
is a genuine spoofing and deliverability gap, but fixing it requires knowing the sending infrastructure,
and a wrong SPF record silently drops legitimate mail. It is recorded as
[06-risk-register.md](06-risk-register.md) R5 and handed to the client as an optional future item.

Because of that, identifying the operator of `95.217.45.207` is **no longer a prerequisite** for the DNS
move. Copy the two existing records verbatim and change nothing else about mail.

---

## 5. URL structure — restructure, don't preserve

The default rule in any migration is *preserve every URL*. **This case is a justified exception**, for
three converging reasons:

1. **There is nothing to preserve.** 0.0% of traffic came from search in twelve months
   ([03](03-traffic-and-analytics.md)). There are no rankings to protect.
2. **The current structure is bad and unextendable.** `/method-ru`, `/history-ua` are language *suffixes*.
   Adding a fourth language or a fifth page compounds the mess, and it fights `hreflang` conventions.
3. **The old structure is what the backlinks point at.** YouTube, VK and Facebook all link to
   `osteo-lifting.com/ru`. Adopting `/ru/` again means **those links start resolving instead of 404ing** —
   the restructure actively *recovers* equity rather than risking it.

### Recommended structure

```
/                 → 301 → /ru/        (or a locale-detecting landing)
/ru/              RU home
/ru/method/       RU method
/ru/history/      RU history
/ru/courses/<slug>/   NEW — one page per course product
/ua/              UK home        (path stays "ua"; hreflang value must be "uk")
/ua/method/  /ua/history/  /ua/courses/<slug>/
/en/              EN home
/en/method/  /en/history/  /en/courses/<slug>/
```

Full mapping in **[redirect-map.csv](redirect-map.csv)**.

⚠️ **The `ua` vs `uk` trap:** keep `/ua/` in the path if you like the familiarity, but the `hreflang`
attribute and `<html lang>` **must** be `uk` (or `uk-UA`). `ua` is a country code, not a language code, and
`hreflang="ua"` is silently invalid — Google discards the entire annotation cluster.

### Rules that must exist on day one

- All 9 current URLs → `301` to their new equivalents
- `/index.html` → `301` → `/ru/`
- Prefix catch-alls: `/ru/*`, `/en/*`, `/ua/*` → the corresponding locale home (this covers every legacy
  slug without needing the full historical list, which the Internet Archive would not hand over)
- `301` for slash normalisation (currently `302`)
- Preserve `http→https` and `www→apex`, both `301`

---

## 6. Phased plan

Dated against the two fixed deadlines: **1 Oct 2026** (Weblium billing) and **11 Dec 2026** (domain).

### Phase 0 — Safety net · **this week** · ~half a day

Nothing here depends on any decision above. Do it regardless of stack, host, or timeline.

1. **Archive everything.** All 9 HTML pages, `robots.txt`, both sitemaps, and — critically — **every
   asset from `res2.weblium.site`**, including the 68 images on each history page. Commit the archive to
   the new GitHub repo. *This is irreversible if missed: no export exists, and the history images may not
   survive anywhere else.*
2. **Screenshot every page** at desktop and mobile, all three languages, as a design and content reference.
3. **Resolve the Weblium card** — either fix it, or make a conscious decision to let it lapse *after*
   cutover. Do not let 1 October arrive by accident.
4. **Confirm the mail vendor** behind `95.217.45.207`.

### Phase 1 — Decouple and instrument · **week of 24 Aug** · ~1 day

5. **Move DNS to Cloudflare**, replicating records exactly (§4) — **including the `mail` A record and MX**.
   Lower TTLs to 300s first. Verify web *and mail* afterwards.
6. ~~Add SPF, DKIM, DMARC~~ — **out of scope.** Optionally add `CAA`.
7. **Set up Google Search Console + Bing Webmaster Tools**, verified by **DNS TXT** so verification
   survives every later move.
8. **Install GA4** via the Weblium Analytics panel (~5 min) — starts a clean, bot-filtered "before"
   baseline on the old site.
9. **Add the legacy redirects via Cloudflare Bulk Redirects** — `/ru/*`, `/en/*`, `/ua/*` → the live
   Weblium pages. **This fixes the YouTube/VK/Facebook 404s immediately**, without waiting for the rebuild.
10. Flag the stale "до Нового года" offer to the client — it is their copy, so their call to remove it.

After Phase 1, the 1 October billing date stops being an existential threat: the domain, DNS, email,
analytics and content archive are all outside Weblium. The worst case becomes "the old site goes offline,"
not "we lose the domain, the email and the images."

### Phase 2 — Build · **Sept** · the bulk of the work

11. GitHub repo, Astro (or Next.js), Vercel preview deploys from day one
12. **Design system and full redesign** — the primary deliverable. See
    [08-design-direction.md](08-design-direction.md)
13. **Content ported verbatim.** Split the five courses onto their own pages — a *structural* change that
    re-uses the existing text unchanged, not a rewrite. No expansion of the thin pages; the health-claim
    question is flagged to the client and the copy carries forward as-is
14. SEO layer built in, not bolted on: `<h1>` per page, unique translated titles and descriptions, correct
    `lang` + `hreflang` + `x-default`, `EducationalOrganization` / `Person` / `Course` ×5 / `FAQPage` /
    `Review` JSON-LD, `alt` on every image, OG + Twitter cards on every page
15. Self-hosted, optimised images (AVIF/WebP, responsive `srcset`) — no external CDN dependency this time
16. GA4 with **outbound Telegram/WhatsApp CTA event tracking** + an on-site enquiry form alongside the
    messenger CTAs
17. All redirects from [redirect-map.csv](redirect-map.csv) in `vercel.json` / `_redirects`
18. Generated `sitemap.xml` with content-derived `lastmod`; `robots.txt`; `llms.txt` if you want AI-engine
    coverage

### Phase 3 — Cutover · **late Sept, before 1 Oct** · ~2 hours

19. Full QA on the preview URL: every redirect, all three languages, `hreflang` validation, Lighthouse,
    schema validation via Google's Rich Results Test
20. Lower DNS TTL to 300s, 24h ahead
21. Point the apex A / CNAME at the new host; verify TLS issues correctly for apex **and** `www`
22. Verify all 9 legacy URLs `301` correctly; verify `/ru/`, `/en/`, `/ua/` legacy catch-alls
23. Submit the new sitemap in GSC and Bing; ping IndexNow
24. Watch GSC coverage daily for two weeks

### Phase 4 — Wind down · **after cutover is verified**

25. Only once the new site has been live and verified for a week: cancel the Weblium subscription
26. Keep the archive in git permanently
27. Restore TTLs to 3600s
28. Registrar stays at NIC.UA - nothing further to do there beyond confirming the renewal card

---

## 7. Cost comparison

| Item | Today | After (chosen plan) |
|---|---|---|
| Hosting | Weblium $99/yr | **Vercel free — $0** |
| DNS | Weblium (bundled) | Cloudflare — $0 |
| Domain | NIC.UA (~$10–15/yr) | ~$10/yr (Cloudflare Registrar, at cost, after transfer) |
| Email | Third-party | unchanged, untouched |
| **Total** | **~$110/yr** | **~$10/yr** |

The migration removes the $99/yr Weblium line entirely. Running cost drops to essentially just the domain.

---

## 8. Alternatives considered and rejected

**Stay on Weblium, redesign inside it.** Cheapest in effort. Rejected: it leaves ~two thirds of the SEO
findings permanently unfixable (no redirects, no `hreflang`, no `<h1>` control, no custom JSON-LD), keeps
all assets and DNS hostage to a failing subscription, and keeps a platform with no export path.

**Migrate to WordPress.** Rejected: reintroduces hosting cost, a database, a security surface and plugin
maintenance, for a CMS that 9 static pages do not need. Managed WordPress would also cost more than
Weblium does now.

**Transfer the domain to Cloudflare Registrar.** Tempting for tidiness. Rejected for *now*: it needs the
`clientTransferProhibited` lock removed and imposes a 60-day post-transfer lock, adding risk during a
migration window that is already tight. Revisit calmly in 2027 if desired — it is a cost optimisation, not
a requirement.

**Preserve the existing URL structure.** Rejected for the reasons in §5 — with 0% search traffic there is
nothing to protect, and re-adopting `/ru/` actively recovers the existing backlinks.

---

## 9. What could go wrong

| Risk | Mitigation |
|---|---|
| **Email breaks during the DNS move** | Copy the full zone first; recreate the `mail` A record *and* MX; send/receive test immediately; keep TTLs at 300s so rollback is minutes |
| **Weblium lapses mid-project** | Phase 0 archives everything first — this is exactly why it is Phase 0 and not Phase 3 |
| **Assets lost** | Download every `res2.weblium.site` object before 1 Oct; commit to git |
| **Redirects missed → new 404s** | Automated check of all 9 old URLs plus legacy prefixes against the preview deploy before cutover |
| **`hreflang` rejected by Google** | Use `uk` not `ua`; validate reciprocity; check the GSC International Targeting report post-launch |
| **Rankings drop after migration** | There are effectively none to drop. Any GSC movement post-launch is upside |
| **Cert fails for `www` at cutover** | Both apex and `www` need certs today (two separate LE certs). Confirm the new host issues for both before flipping DNS |
| **Client wants to keep editing content themselves** | Astro Content Collections + Markdown is the low-friction answer; a headless CMS (Sanity/Decap) can be added later without changing hosting |

---

## 10. Immediate next actions

Ordered. The first four are independent of every decision still open:

1. ⬜ Archive all HTML and every `res2.weblium.site` asset → commit to a new GitHub repo
2. ⬜ Decide the Weblium card question (fix vs. deliberate lapse after cutover)
3. ⬜ Move DNS to Cloudflare, replicating records exactly — **including `mail` A + MX**, and verify mail flow
4. ⬜ Verify Google Search Console + Bing Webmaster via DNS TXT
5. ⬜ Install GA4 on the current site for a clean baseline
6. ⬜ Cloudflare Bulk Redirects for `/ru/*`, `/en/*`, `/ua/*` — recovers the YouTube/VK/Facebook links today
7. ⬜ Confirm framework: Astro vs Next.js
8. ⬜ Request contact details from the client (email, phone, address, hours) for schema
9. ⬜ Agree the design direction — [08-design-direction.md](08-design-direction.md)
10. ⬜ Start the rebuild

Settled, no longer open: hosting (Vercel free), DNS (Cloudflare), ownership (our accounts), content
(verbatim), email (untouched).
