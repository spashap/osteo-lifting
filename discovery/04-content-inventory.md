# 04 — Content Inventory

What the site actually says, what is worth keeping, and what the rebuild has to carry over. Captured
from the live rendered DOM on 2026-08-20.

---

## 1. What the business is

**Международная Академия OSTEO-LIFTING (M.A.O.)** — "International Academy OSTEO-LIFTING." It sells
**paid professional training** in a manual, non-surgical face-and-body correction method invented by the
founder, plus private practice sessions.

**Audience**, stated explicitly on the site: cosmetologists, massage therapists, and people looking to
enter the beauty industry as a new profession.

**People:**

| Person | Role | Credentials as stated on site |
|---|---|---|
| **Dr. Ariel Pelevin** | Founder of the method and of M.A.O. | Osteopath PhD (USA), BSC (Spain), MT (Israel); international-level instructor; private practice in Israel, Europe and Serbia; **200+ seminars in 14 countries; 6,500+ students trained** |
| **Olena Hrinchuk** (Елена Гринчук) | Director and instructor, Ukraine | Physical rehabilitation specialist; massage-aesthetician, 15+ years; founder of the *Mellarius* cosmetics brand; founder of *API SPA by Olena Hrinchuk* |

Those quantified credentials (200+ / 14 / 6,500+) are the strongest trust signal on the site and are
currently buried in body copy with no markup and no visual emphasis. In the redesign they belong above
the fold.

---

## 2. Products — five distinct courses

All offline unless noted. This is the commercial core of the site and currently sits inside one
undifferentiated `<h2>` section on the homepage.

| # | Product | Instructor | Format | Content |
|---|---|---|---|---|
| 1 | **Остео-лифтинг** | Pelevin; Hrinchuk in Ukraine | 2 days, 100% practice, groups of 4–10 | Day 1 — Deep-tissue facial release: myofascial-internet theory, fascia's role, direct fascial work, ergonomics. Day 2 — Biodynamic face lifting: bodily architecture via volume and vectors, specialist–patient interaction, internal movement and self-regulation, neutrality, levers for bioenergetic channeling, release theory |
| 2 | **Остео-лифтинг 3D** | Pelevin | Advanced | Advanced biodynamic techniques, multi-vector approach, **intraoral** correction of bone/tissue/membrane, verbal accompaniment in psychosomatic therapy, 4-dimensional perception |
| 3 | **Остео-боди** | Pelevin | 1 day, 10:00–16:00 | Biodynamic correction of major tension crossings from feet to neck; weighing and locating tension through the feet; vector lesions; ligamentous-fascial unwinding; how body tension creates facial asymmetry |
| 4 | **Osteo-dance** | Pelevin | 3-hour masterclass | Original method — rhythmic authentic movement applied to the patient's body to trigger self-repair. Works clothed, standing/lying/side; suitable for complete beginners. Described as looking like passively performed contemporary dance |
| 5 | **Тай-Чи PRO массаж** | Hrinchuk (method by Pelevin) | — | Multi-joint volumetric ergonomics using the forearms; qigong-derived movement; rhythm changes for sedative or stimulating effect |

Also mentioned: an **online video course**, a **book**, a **certificate**, and lifetime access to
video materials via a Telegram channel.

### ⚠️ Two content items that need a decision before the redesign

**(a) Health claims.** Product 5 states *"Всего за 1 сеанс -4 кг"* ("minus 4 kg in a single session") and
lists cellulite removal, weight reduction and stress reduction. Product 1's section claims the ability to
"completely change the structure of the skull" in 2–5 sessions. Elsewhere the site claims migraine relief
and a "safe alternative to invasive rejuvenation surgery."

These are **medical and weight-loss efficacy claims**. They carry real exposure under EU/Israeli
advertising rules, they are exactly the category Google's "Your Money or Your Life" quality guidelines
scrutinise hardest, and they will make the site harder — not easier — to rank if kept as-is. Flagging as
a business decision for the client, not a technical one. The rebuild should at minimum soften absolute
outcome claims and separate *what the training teaches* from *what results a client will get*.

**(b) Stale seasonal offer.** *"В пакет по индивидуальному обучению (1-2 человека), **до Нового года**,
входит 1 сеанс остео-лифтинга в подарок"* — a New Year promotion, live in August 2026. Should be removed
from the live site now, not deferred to the rebuild.

---

## 3. Social proof — 7 named testimonials

Genuinely good material. Detailed, specific, from named practitioners across six countries.

| Name | Location | Substance |
|---|---|---|
| Александр Сметана | Warsaw | Physiotherapist; came for TMJ/skull/muscle work; reports patients feeling neck and facial release and migraine relief from the first sessions; took both Osteo-Lifting and Osteo-Body |
| Валерия | Spain (from Kharkiv) | First seminar experience; on quality of touch over force |
| Ирина | Alicante, Spain | Already experienced with facial work; reports reduced puffiness and tension in her own clients |
| Ольга | Netherlands | Cosmetologist-aesthetician; method integrated into existing practice and amplified results |
| Наталья | Bali, Indonesia | Values the absence of contraindications and side effects |
| Ксения | Ra'anana, Israel | 10+ years in natural facial rejuvenation; 4-year Chinese medicine training with a China internship |
| Светлана Дери | Israel | Cosmetologist, 22 years, owns a clinic; identifies as an Academy graduate |

**None of this is marked up as `Review` or `AggregateRating`.** Seven detailed reviews from named
professionals in six countries is a strong E-E-A-T asset being spent as plain paragraphs.

---

## 4. FAQ — 5 real questions

Present on all three homepages, unmarked:

1. Can an ordinary person without medical education learn osteo-lifting? — *Yes, anyone*
2. Does osteo-lifting remove facial asymmetry? — *Yes, very effectively*
3. Can it be used with children? — *Yes, especially combined with Osteo-Body for posture*
4. How often should it be done? — *Course of 4 sessions, weekly; then 1 session every 2–3 months for maintenance*
5. Are there supplementary materials? — *Yes, high-quality video from all angles, in a Telegram channel with lifetime access*

Prime `FAQPage` schema candidate, and directly useful for AI answer engines.

---

## 5. Navigation and structure

Identical anchor-based nav on all three homepages:

| Label | Target |
|---|---|
| Преподаватели / Instructors | `/#custom-1` |
| Для кого / For whom | `/#features` |
| Продукты Академии / Products | `/#custom-3` |
| FAQ | `/#custom-4` |
| EN / UA / RU | `/en`, `/ua`, `/` |

Note the anchor IDs — `#custom-1`, `#custom-3`, `#custom-4` — are Weblium's auto-generated block names,
never renamed. Meaningless to users and to search engines. In the rebuild these become real section
slugs (`#instructors`, `#courses`, `#faq`).

The language switcher is a plain three-link set with no `hreflang` and no `lang` attributes.

---

## 6. Conversion paths — all off-site

**Zero forms.** Every CTA is an outbound link:

| Channel | Destination |
|---|---|
| Telegram (Pelevin) | `t.me/osteolifting` |
| Telegram (Hrinchuk) | `t.me/Olena_Hrinchuk` |
| WhatsApp (Serbia) | `+381 63 821 9020` |
| WhatsApp (Ukraine) | `+380 97 633 2902` |
| Instagram (Pelevin) | `instagram.com/ariel.pelevin` |
| Instagram (Hrinchuk) | `instagram.com/dr_hrinchuk` |
| Instagram (API SPA) | `instagram.com/api.spa.od` |
| Facebook (Pelevin) | `facebook.com/pelevin.ariel` |
| Instagram Reels (embedded ×2) | two `/reel/` permalinks |

**No email address and no phone number appear as text anywhere on the site** — only as WhatsApp deep
links. No physical address. No opening hours. This is why the `LocalBusiness` JSON-LD is empty and why no
local SEO signal exists at all.

Also missing entirely: any **privacy policy, terms, or cookie notice**, despite the site serving EU
visitors (Spain, Netherlands, Latvia in the traffic data) and the business processing enquiries. Weblium
offers a cookie-banner feature; it is not enabled. Worth raising with the client as a compliance question
alongside the redesign.

---

## 7. Media

All images are served from **`res2.weblium.site`** (Weblium's Google Cloud Storage bucket), addressed by
opaque object IDs such as `.../res/650085d7110e280017ea1194/689dc038b25771bc82898208_optimized.webp`.
Newer assets are WebP; older ones are served without an extension via a `_optimized` variant.

| Page group | Images |
|---|---|
| Homepages (`/`, `/ua`, `/en`) | 14 each |
| History pages | **68 each** |
| Method pages | 7 each |

Two embedded Instagram Reels serve as video content. The favicon is a raw photo file
(`photo_2023-09-12_18-20-02.jpg`).

**Migration-critical:** these assets are on Weblium infrastructure and **there is no export feature**.
When the subscription lapses, the images become unavailable. Every asset must be downloaded before
1 October 2026. The history pages alone hold 68 images that appear to be an archive of the Academy's
history and may not exist anywhere else.

---

## 8. What to carry into the redesign

**Keep and elevate:**

- The five course products — as individual pages with `Course` schema, not one flat homepage section
- The seven testimonials — with `Review` markup and photo/attribution treatment
- The FAQ — with `FAQPage` markup, expanded
- Founder credentials (200+ seminars / 14 countries / 6,500+ students) — above the fold, not buried
- Full trilingual coverage (RU / UK / EN) — done properly this time
- Telegram-first conversion — it fits the audience; instrument it rather than replace it

**Rework:**

- The `/history-*` pages: 68 images and ~160 words each → a real narrative page, or fold into an About page
- The `/method-*` pages: ~200 words each → the cornerstone explainer the site currently lacks
- Anchor-based single-page structure → real pages that can rank individually

**Add:**

- Contact details as text (email, phone, address) — required for local SEO and for basic credibility
- Pricing, or at least a "request pricing" path — currently no price appears anywhere
- Course dates / schedule — a training business with no calendar
- Privacy policy, terms, cookie notice
- An on-site enquiry form alongside the Telegram CTAs

**Decide on:**

- The medical and weight-loss efficacy claims (§2a) — a business/legal call before any copy is written
