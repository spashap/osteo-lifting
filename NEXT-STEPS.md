# Next Steps — start here

**Session 1 (2026-08-20):** discovery complete, full audit written, site archived.
**Session 2 (2026-08-21):** rebuild built, design iterated, two rounds of client revisions applied,
all pushed. Steps 1 and 7 done.
**Session 3 starts at Step 10 — the contact form.** DNS (Step 2) is owned by Pavel directly.

Goals, in order: **modern design** → **SEO/technical rebuild** → **operational control**.
Content is frozen (verbatim migration). Email is untouched. Hosting is Vercel free + GitHub. DNS to
Cloudflare. Registrar stays at NIC.UA in Ariel's name.

---

## Where things stand

| | Status |
|---|---|
| Discovery & audit | ✅ Done — [`discovery/`](discovery/), 8 documents |
| Site archived (pages + assets + font) | ✅ Done — [`archive/`](archive/), 9.5 MB, coverage verified |
| Git repo | ✅ Done — pushed to `github.com/spashap/osteo-lifting` |
| Rebuild | ✅ Done — [`site/`](site/), Astro, 27 pages, RU/UK/EN |
| Vercel project | ⏳ Repo ready to import — **Root Directory must be `site`** |
| DNS moved off Weblium | ⏳ Owned by Pavel directly — do not re-raise |
| Search Console / Analytics | ❌ Nothing exists |
| Domain attached to the new site | ❌ Deliberately not done — waiting on Ariel's approval |
| Contact form | ❌ **The next build task** — see Step 10 |

The domain has been extended by two years (confirmed 2026-08-21). The Weblium renewal and the DNS move
are being handled by Pavel directly and should not be raised again in reports.

---

## Step 1 — Git ✅ done

Repo initialised and pushed to `github.com/spashap/osteo-lifting`. `.env` is gitignored and was verified
absent from the first commit. The archive is now versioned off-machine, which was the point.

Domain renewal: extended by two years (confirmed 2026-08-21), so the 11 Dec 2026 expiry is no longer a
risk.

---

## Step 2 — DNS to Cloudflare (~30 min, then wait for propagation)

**The highest-value action available.** It severs the domain and Ariel's email from Weblium's billing.
After this, the October date stops being an emergency.

1. **Copy the current zone exactly.** Verify against live DNS first:
   ```bash
   nslookup -type=A    osteo-lifting.com      8.8.8.8
   nslookup -type=CNAME www.osteo-lifting.com 8.8.8.8
   nslookup -type=MX   osteo-lifting.com      8.8.8.8
   nslookup -type=A    mail.osteo-lifting.com 8.8.8.8
   ```
   Expected:
   ```
   osteo-lifting.com.        A      35.187.82.108
   www.osteo-lifting.com.    CNAME  osteo-lifting.com.
   osteo-lifting.com.        MX  10 mail.osteo-lifting.com.
   mail.osteo-lifting.com.   A      95.217.45.207     ← the one people forget
   ```
2. Add the zone in **your** Cloudflare account. Enter all four records. Set TTL 300 for now.
3. **Do not add SPF, DKIM or DMARC.** Email is out of scope; a wrong SPF record silently drops Ariel's mail.
4. In **Ariel's NIC.UA panel** → Domains → Change NS → point to the two Cloudflare nameservers.
   **This is the only change ever made to his registrar account.**
5. Wait for propagation, then verify **both**:
   - the website still loads (it will still be served by Weblium — that is fine and expected)
   - **Ariel's email still sends and receives** ← ask him to confirm explicitly

Once done, Weblium hosts only the old website, and nothing else depends on it.

---

## Step 3 — Measurement baseline (~30 min)

Do this *before* the rebuild so there is a real "before" to compare against.

- **Google Search Console** — verify by **DNS TXT** in Cloudflare (survives every later move). Add Ariel as a user.
- **Bing Webmaster Tools** — same.
- **GA4** — create the property, install via Weblium's Analytics panel (native, ~5 min). This gives a
  bot-filtered baseline; the only existing numbers come from Weblium's own script and look substantially
  non-human ([`discovery/03`](discovery/03-traffic-and-analytics.md) §3).

---

## Step 4 — Recover the dead backlinks (~20 min, big win for the effort)

The YouTube channel (470+ subscribers), a VK community, Facebook events and Instagram posts all link to
`osteo-lifting.com/ru` — which **404s today**. Fix it now, in front of the old site, via **Cloudflare Bulk
Redirects**:

```
/ru  and  /ru/*   → 301 → /
/en/*             → 301 → /en
/ua/*             → 301 → /ua
```

(Retarget to the new structure at cutover.) This is the only findable source of referral traffic and it is
currently being thrown away.

---

## Step 5 — Before cancelling Weblium: check the media library

Open the Weblium editor's media library and compare against [`archive/assets/`](archive/assets/) (48
images). The archive was built from what the **published pages reference** — uploads that no live page
uses would not have been found.

Specifically worth looking for: the missing slides from the **broken "Отзывы" carousel**
([`discovery/02`](discovery/02-seo-technical-audit.md) §18), which renders empty on all three
`/history-*` pages. Testimonial images may be sitting there unseen.

**While Weblium is alive, anything missing is one `curl` away. After 1 October it is gone.**

```bash
curl -sS -o out.jpg "https://res2.weblium.site/res/650085d7110e280017ea1194/<asset-id>"
```

---

## Step 6 — Design (the headline deliverable)

Brief, critique and direction: [`discovery/08-design-direction.md`](discovery/08-design-direction.md).

Suggested order:
1. Agree **type and palette** first — the Cyrillic constraint (RU/UK/EN) rules out most display faces, so
   this decision gates everything else
2. Design tokens → component set → key page mockups (home, course detail, method)
3. Only then start building

A **design canvas** with the key artboards side by side is the cheapest way to settle hierarchy visually
before code exists, and it is the artefact Ariel can react to.

---

## Step 7 — Build ✅ done

Astro static site in [`site/`](site/). Details in [`site/README.md`](site/README.md).

- 27 indexable pages: home, method, history, courses index and five course pages, in RU / UK / EN
- Copy ported verbatim from [`archive/pages/`](archive/pages/) into `site/src/i18n/{ru,ua,en}.json`
- URL structure `/ru/ /ua/ /en/` with `hreflang` `ru` / `uk` / `en` + `x-default`
- Every rule from [`discovery/redirect-map.csv`](discovery/redirect-map.csv) in `site/vercel.json`
- Full SEO layer: one `h1` per page, unique titles and descriptions, OG/Twitter, `alt` on every image,
  no `meta keywords`, populated JSON-LD (`EducationalOrganization`, `Person` ×2, `Course` ×5, `FAQPage`,
  `Review` ×7, `BreadcrumbList`), XML sitemap with alternates
- Images self-hosted from [`archive/assets/`](archive/assets/) as AVIF/WebP with `srcset`
- GA4 outbound-click tracking, dormant until `PUBLIC_GA4_ID` is set

### Step 7a — connect Vercel (the immediate next action)

Import the repo in Vercel and set **Root Directory = `site`**. Everything else is auto-detected.
**Do not attach the custom domain** — that waits for Ariel's approval and for Step 2.

## Step 8 — Cutover (~2 hours)

1. QA the preview deploy: all redirects, three languages, `hreflang` validation, Lighthouse, Rich Results Test
2. TTL already 300s from Step 2
3. Point the apex A / CNAME at Vercel
4. **Verify TLS issues for both apex *and* `www`** — the current site needs two separate certificates
5. Test all 9 old URLs + the legacy `/ru/` `/en/` `/ua/` prefixes
6. Submit the sitemap in GSC and Bing
7. Watch GSC coverage daily for two weeks

---

## Step 9 — Wind down

- Cancel Weblium **only after the new site has been live and verified for a week**
- Restore TTLs to 3600s
- Keep `archive/` in git permanently
- Registrar stays at NIC.UA — nothing to do there

---

## Step 10 — Contact form (the next build task)

Ariel has settled the scope: **a purely informational landing site plus a contact form. No calendar, no
published pricing, no booking system.** Do not re-propose those.

The site currently has zero forms; every CTA is an outbound Telegram or WhatsApp link.

Agreed design, blocked only on credentials:

- **Deliver submissions into Telegram via a bot** — his whole funnel already lives there, so enquiries
  arrive where he already works. It is a static site on Vercel with no backend; the alternatives are an
  email service (Resend/Postmark) or a third-party form service.
- **Needed from Ariel:** a bot token and chat ID, or an email address to deliver to.
- **Fields:** name, contact, message, which course. Anything more kills completion.
- **Spam:** honeypot plus rate limiting. No CAPTCHA.
- **EU visitors are real** (Spain, Netherlands, Latvia in the traffic data), so the form wants a consent
  checkbox and one line on what happens to the data. There is still no privacy policy of any kind.

---

## Step 11 — Client revisions already applied (2026-08-21)

Recorded here because they change what the site says, not just how it looks:

- Every mention of **Olena Hrinchuk** removed, all three languages. ⚠️ Consequence still open:
  **Тай-Чи PRO массаж now has no instructor line at all** — awaiting replacement wording from Ariel.
- Founder figures updated to **16 countries** and **over 7000 students worldwide**.
- The **«до Нового года»** gift-session offer removed outright.
- **All Instagram references removed except one** — the Osteo-lifting reel, which he asked to keep.
- New portrait of Ariel (clinic photograph) replacing the phone snapshot.
- 18 new academy photographs added; the history gallery now runs to 32.

**Market note that corrected an earlier assumption:** this site serves **Russia and the Balkans**, where
landing pages face far fewer content restrictions than Western defaults assume. CLAUDE.md's rule on the
health claims forbids putting them in a *title, heading or meta description* — it does not restrict which
page an image appears on. Do not extend it beyond its letter.

---

## Open questions for Ariel

Not blockers for Steps 1–4, but needed before the build finishes:

1. **Contact details** — business email, phone, address, opening hours. These appear **nowhere** on the
   current site, which is why its structured data is an empty shell. Without them, `LocalBusiness` schema
   gets omitted rather than shipped empty.
2. ~~**Is the NIC.UA card valid?**~~ Resolved 2026-08-21: the domain has been renewed for two more years.
3. **The health claims** — carried forward verbatim, and kept out of every title, heading and meta
   description. Ariel is aware; the Russia/Balkans market makes this far less fraught than the audit
   assumed ([`discovery/04`](discovery/04-content-inventory.md) §2a).
4. ~~**Stale offer** — the "до Нового года" promotion.~~ Resolved 2026-08-21: removed at his request.
5. Does a Google Business Profile exist?
6. Privacy policy / terms text, if those pages should be populated.

---

## Reading order for a fresh session

1. [`CLAUDE.md`](CLAUDE.md) — scope, constraints, conventions, hard rules
2. [`discovery/README.md`](discovery/README.md) — executive summary
3. [`discovery/07-scope-and-control.md`](discovery/07-scope-and-control.md) — what is in and out of scope
4. [`discovery/08-design-direction.md`](discovery/08-design-direction.md) — the design brief
5. This file — what to do next
