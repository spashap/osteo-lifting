# 01 — Current State

Everything below was verified on 2026-08-20 by direct inspection: public DNS/HTTP probes plus a
read-only pass through the authenticated Weblium and NIC.UA panels.

---

## 1. Stack at a glance

| Layer | Provider | Detail |
|---|---|---|
| Domain registrar | **NIC.UA** (NICNAMES, INC., registrar ID 4156) | Account "Ariel Pelevin" |
| DNS zone | **Weblium** | `ns1`–`ns4.weblium.com` |
| Web hosting | **Weblium** | Site builder, "Website Pro" plan |
| Web server | `openresty` (nginx/OpenResty), origin `35.187.82.108` (Google Cloud, europe-west1) | |
| Media / CDN | **`res2.weblium.site`** | Google Cloud Storage, multi-regional |
| TLS | Let's Encrypt | Auto-issued by Weblium |
| Email (MX) | **Third party, unknown vendor** | `mail.osteo-lifting.com` → `95.217.45.207` (Hetzner, Finland) |
| Web hosting at NIC.UA | **None** | Panel reads "You don't have web hosting yet" |

The client's description — *"hosting and domain at nic.ua"* — is only half right. **NIC.UA supplies the
domain registration only.** The actual site hosting, the DNS zone and all media are on Weblium.

---

## 2. Domain registration (NIC.UA)

Verified via the registrar panel and via Verisign RDAP.

| Field | Value |
|---|---|
| Domain | `osteo-lifting.com` |
| Registrar | NICNAMES, INC. (NIC.UA), IANA ID 4156 |
| Registered | **2018-12-11** |
| Expires | **2026-12-11** |
| Last changed | 2025-11-18 |
| EPP status | `clientTransferProhibited` |
| Nameservers (at registry) | `NS1.WEBLIUM.COM`, `NS2.WEBLIUM.COM` |
| Auto-renew | **ON** (confirmed in panel) |
| Order # | 2315199 |

Notes:

- The domain is **7½ years old** — a genuine trust asset. Keep it.
- Auto-renew is enabled, so 11 Dec 2026 is a *soft* deadline, contingent only on a valid card at NIC.UA.
- `clientTransferProhibited` means a registrar transfer requires unlocking first. **There is no reason to
  transfer.** See [05-migration-recommendation.md](05-migration-recommendation.md).
- The registry lists **2** nameservers while the zone itself advertises **4** (`ns1`–`ns4`). Harmless
  today, but it means only `ns1`/`ns2` are actually authoritative from the registry's point of view.

---

## 3. Weblium account and subscription

| Field | Value |
|---|---|
| Site name in panel | "Blank Website" (never renamed) |
| Site ID | `650085d7110e280017ea1194` |
| Weblium subdomain | `4jaz6.weblium.site` |
| Plan | **Website Pro (Annually), $99.00/yr** |
| Status | Active |
| Next charge | **1 October 2026** |
| Last payment | 1 October 2025, $99.00 |
| Auto-renew | On |
| **Payment status** | ⚠️ **FAILING** — panel shows a card/billing error |

The exact warning in the panel:

> **Проблема с оплатой**: проверьте платёжные данные или добавьте новую карту. В противном случае сайт
> перейдёт на Free подписку и потеряет свои Pro возможности.

Custom-domain support is a Pro feature. A downgrade to Free therefore disconnects `osteo-lifting.com`
from the site.

Weblium is also running a pricing change: the account is being prompted to lock in the old annual price
before **2 September 2026**. Relevant only if the decision is to stay on Weblium past October, which is
not the recommendation.

### What is configured in the Weblium panel

| Section | State |
|---|---|
| Domains | `osteo-lifting.com` connected, registrar shown as "Сторонний" (third-party), autorenew "не установлено" |
| Search visibility | Open to search engines (no `noindex`) — correct |
| Business info (name, phone, email, address, hours) | **Completely empty** — this is why the JSON-LD renders blank |
| Multilingual feature | **Not used.** The three languages are hand-built duplicate pages, not Weblium language versions |
| Analytics integrations (GA, GTM, Hotjar, FB Pixel) | **None connected** |
| Custom code (`<head>`, body, CSS) | **All empty** |
| Forms | **None** |
| Blog / e-commerce / CRM / chat | Not in use |
| Favicon | `photo_2023-09-12_18-20-02.jpg` — a raw photo, not a designed mark |

The "Multilingual not used" point matters: because the language versions are duplicate pages rather than
a managed language set, Weblium emits no `hreflang` and no per-page `lang` attribute. That is the root
cause of two separate SEO findings in [02](02-seo-technical-audit.md).

---

## 4. DNS zone (hosted at Weblium)

```
osteo-lifting.com.       A     35.187.82.108        TTL 3600
www.osteo-lifting.com.   CNAME osteo-lifting.com.
osteo-lifting.com.       MX    10 mail.osteo-lifting.com.
mail.osteo-lifting.com.  A     95.217.45.207
osteo-lifting.com.       NS    ns1..ns4.weblium.com  TTL 3600
SOA  ns1.weblium.com admin.weblium.com  serial 2023091610  refresh 7200  retry 1800  expire 1209600  min 3600
```

Absent records:

- **No `TXT` records at all** → no SPF, no DKIM, no DMARC. The domain has active mail service and *zero*
  email authentication. Anyone can spoof `@osteo-lifting.com`, and legitimate mail from it will land in
  spam more often than it should.
- **No `CAA`** record.
- No Google Search Console DNS verification token, and no verification `<meta>` tag on any page, and
  nothing in Weblium's custom-code slots. **Search Console has almost certainly never been set up.**
  (This cannot be proven negatively from outside — GSC could have been verified in the past by a file or
  a since-removed tag — but there is no evidence of it anywhere, and 0.0% search traffic is consistent
  with nobody watching.)

### The email dependency (important, easy to miss)

`mail.osteo-lifting.com` resolves to a Hetzner IP that has **nothing to do with Weblium** — it is a
separate mail host. Port 25 accepts connections, so it is a live mail server.

But the `MX` record and the `mail` A record **live inside Weblium's DNS zone**. If Weblium stops serving
the zone, the mail server keeps running and nobody can find it. Email breaks even though the mail host
is untouched.

**Nobody has documented which vendor runs that mail server.** Establishing this is a prerequisite for
the DNS move — see the open questions at the end of this document.

### TTLs (for cutover planning)

Records carry a **3600s (1 hour)** TTL; the NS delegation TTL from the registry is longer. Standard
practice applies: drop TTLs to 300s at least 24 hours before any cutover.

---

## 5. TLS

Two separate Let's Encrypt certificates, both auto-managed by Weblium:

| Host | Subject | Valid |
|---|---|---|
| `osteo-lifting.com` | `CN=osteo-lifting.com` (SAN: apex only) | 13 Jul 2026 → **11 Oct 2026** |
| `www.osteo-lifting.com` | `CN=www.osteo-lifting.com` (SAN: www only) | 15 Jul 2026 → **13 Oct 2026** |

Both expire **within two weeks of the 1 October billing date**. If the subscription lapses, renewal stops
and the site starts throwing certificate errors in browsers shortly after — a harder failure than a
simple outage, because browsers show a full-page security interstitial.

---

## 6. HTTP behaviour

Verified redirect handling — this part is actually done correctly:

| Request | Result |
|---|---|
| `http://osteo-lifting.com/` | `301` → `https://osteo-lifting.com/` |
| `https://www.osteo-lifting.com/` | `301` → `https://osteo-lifting.com/` |
| `https://osteo-lifting.com/method-ru/` (trailing slash) | `302` → `/method-ru` |
| `https://osteo-lifting.com/nonexistent` | `404` |
| `https://osteo-lifting.com/index.html` | **`200`** — byte-identical to `/`, but canonical points to `/` |

Response headers on every page:

```
Server: openresty
x-frame-options: DENY
content-security-policy: frame-ancestors 'none'
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
strict-transport-security: max-age=2592000
access-control-allow-origin: *
```

Reasonable defaults. Two gaps: HSTS `max-age` is only 30 days (Google's preload list wants ≥ 1 year),
and there is **no `Cache-Control`, `ETag` or `Last-Modified`** on the HTML responses.

---

## 7. Measured performance

Google's PageSpeed Insights API refused the request (shared-quota exhaustion, not a site problem), so
these are **direct browser measurements** of the homepage rather than Lighthouse scores:

| Metric | Value |
|---|---|
| HTML transferred (gzip) | 66.4 KB |
| HTML decompressed | **476.5 KB** |
| Total requests | 17 |
| DOMContentLoaded | 649 ms |
| Load event | 729 ms |
| Stylesheets | 11 (4 external + 7 inline `<style>` blocks) |
| CSS rules parsed | **5,104** |
| `@media` blocks | 914 |
| Images on homepage | 14 (3 served at more than 2× their display size) |

Honest read: **the live site is not slow.** Sub-second load, few requests, compression on, WebP in use
for newer images. The problem is not speed, it is that 476 KB of decompressed HTML and 5,104 CSS rules
are being spent on nine pages of brochure content — which is the platform's overhead, not the content's.
A modern static build will be a fraction of this, but "the site is slow" is not a fair argument for
migrating. The real arguments are control, cost of change, and the risks in
[06-risk-register.md](06-risk-register.md).

**Follow-up:** re-run PageSpeed Insights with a proper API key before and after migration to get
comparable Lighthouse and CrUX numbers. CrUX field data was not returned for this origin, which usually
means the site has too few real users to meet Google's reporting threshold — consistent with the traffic
findings.

---

## 8. Page inventory (9 pages, 3 languages)

| URL | Language | Purpose | HTML size |
|---|---|---|---|
| `/` | RU | Home | 460 KB |
| `/history-ru` | RU | Academy history timeline | 455 KB |
| `/method-ru` | RU | About the method | 302 KB |
| `/ua` | UK | Home | 473 KB |
| `/history-ua` | UK | Academy history | 454 KB |
| `/method-ua` | UK | About the method | 302 KB |
| `/en` | EN | Home | 470 KB |
| `/history-en` | EN | Academy history | 455 KB |
| `/method-en` | EN | About the method | 302 KB |

`robots.txt` and `sitemap.xml` both exist and are valid. The sitemap index points to
`sitemap_pages.xml`, which lists exactly these 9 URLs, all with an identical `lastmod` of
`2025-10-01T06:45:50+00:00` (i.e. the timestamp is a build artifact, not real modification dates).

---

## 9. Open questions to put to the client

These could not be resolved from the outside and are the only real unknowns left:

1. **Who runs the mail server at `95.217.45.207`?** Needed before moving DNS, so the MX and any DKIM
   selectors are recreated correctly. (Hetzner IP — likely a small hosting provider or a self-managed box.)
2. **Does a Google Search Console or Bing Webmaster Tools account already exist** for the domain, under
   any email? No evidence of it, but only the client can confirm.
3. **Does a Google Analytics property exist** from an earlier version of the site? Nothing is installed
   today, but historical data may be recoverable and would be valuable context.
4. **Who built and controls the previous `/ru/`-structured site**, and is any of that content archived?
   It is referenced by live external links and is worth recovering for the rebuild.
5. **Is there an existing Google Business Profile** for the practice in Israel / Ukraine / Serbia? Would
   change the local-SEO section of the plan considerably.
6. **Which card should be on file at Weblium**, and is the intent to keep the site alive there until the
   new one ships? This determines whether the 1 October date is a deadline or a non-event.

---

## 10. Reproducing this audit

Raw captured artifacts (HTML of all 9 pages, sitemap, robots, RDAP JSON, extracted metadata) are in the
session scratchpad and were not copied into the repo. To regenerate:

```bash
curl -s https://osteo-lifting.com/sitemap_pages.xml \
  | grep -oE '<loc>[^<]+</loc>' | sed -e 's/<loc>//' -e 's|</loc>||' > urls.txt
while read -r u; do curl -s "$u" -o "$(basename "$u").html"; done < urls.txt

nslookup -type=ANY osteo-lifting.com 8.8.8.8
curl -s https://rdap.verisign.com/com/v1/domain/OSTEO-LIFTING.COM | python -m json.tool
echo | openssl s_client -servername osteo-lifting.com -connect osteo-lifting.com:443 2>/dev/null \
  | openssl x509 -noout -subject -dates -ext subjectAltName
```

One thing that could **not** be retrieved: the Internet Archive CDX API returned `429 Too Many Requests`
on every attempt, from both the shell and the browser. A full list of legacy URLs from the pre-2023 site
is therefore still outstanding — see [02-seo-technical-audit.md](02-seo-technical-audit.md) §Legacy URLs
for the workaround (prefix-based catch-all redirects, which make the exhaustive list unnecessary).
