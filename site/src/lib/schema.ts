import { SITE_URL, PHONE, SOCIAL, TELEGRAM } from '../config';
import { LANG_TAG, localePath, useTranslations, type Locale } from '../i18n';

const abs = (path: string) => new URL(path, SITE_URL).href;

const ORG_ID = `${SITE_URL}/#organization`;
const ARIEL_ID = `${SITE_URL}/#ariel-pelevin`;

/** ISO-8601 durations for the workloads the current copy actually states. */
const WORKLOAD: Record<string, string | undefined> = {
  'osteo-lifting': 'P2D', // "Двухдневное обучение" / "Two-day training"
  'osteo-body': 'PT6H', // "1 день с 10-16" / "1 day from 10-16"
  'osteo-dance': 'PT3H', // "3-часовой мастер-класс" / "3hr master class"
};

export function personAriel(locale: Locale) {
  const t = useTranslations(locale);
  return {
    '@type': 'Person',
    '@id': ARIEL_ID,
    name: t.founder.nameNatural,
    jobTitle: t.founder.eyebrow,
    description: t.founder.bullets.join('. '),
    image: abs('/og-image.jpg'),
    url: abs(localePath(locale)),
    worksFor: { '@id': ORG_ID },
    sameAs: [SOCIAL.arielFacebook, TELEGRAM.ariel],
    hasCredential: ['PhD (USA)', 'BSC (Spain)', 'MT (Israel)'].map((name) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name,
    })),
  };
}

export function organization(locale: Locale) {
  const t = useTranslations(locale);
  return {
    '@type': 'EducationalOrganization',
    '@id': ORG_ID,
    name: t.brand.name,
    alternateName: t.brand.mark,
    url: abs(localePath(locale)),
    logo: abs('/og-image.jpg'),
    image: abs('/og-image.jpg'),
    telephone: PHONE,
    founder: { '@id': ARIEL_ID },
    employee: [{ '@id': ARIEL_ID }],
    sameAs: [SOCIAL.arielFacebook, TELEGRAM.ariel],
    // Seven signed testimonials from named practitioners, carried over verbatim.
    // No rating is asserted: the source reviews carry no scores.
    review: t.testimonials.items.map((item) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: item.name },
      reviewBody: item.body.join('\n\n'),
      itemReviewed: { '@id': ORG_ID },
      inLanguage: LANG_TAG[locale],
    })),
  };
}

export function website(locale: Locale) {
  const t = useTranslations(locale);
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: abs(localePath(locale)),
    name: t.brand.name,
    inLanguage: LANG_TAG[locale],
    publisher: { '@id': ORG_ID },
  };
}

export function faqPage(locale: Locale) {
  const t = useTranslations(locale);
  return {
    '@type': 'FAQPage',
    '@id': `${abs(localePath(locale))}#faq`,
    inLanguage: LANG_TAG[locale],
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function course(locale: Locale, slug: string) {
  const t = useTranslations(locale);
  const c = t.courses.find((item) => item.slug === slug);
  if (!c) throw new Error(`Unknown course "${slug}"`);
  const url = abs(localePath(locale, `courses/${slug}`));
  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.title,
    description: c.metaDescription,
    url,
    inLanguage: LANG_TAG[locale],
    provider: { '@id': ORG_ID },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      inLanguage: LANG_TAG[locale],
      ...(WORKLOAD[slug] ? { courseWorkload: WORKLOAD[slug] } : {}),
      ...(c.teachers.length ? { instructor: { '@id': ARIEL_ID } } : {}),
    },
  };
}

export function courseList(locale: Locale) {
  const t = useTranslations(locale);
  return {
    '@type': 'ItemList',
    '@id': `${abs(localePath(locale, 'courses'))}#list`,
    itemListElement: t.courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(localePath(locale, `courses/${c.slug}`)),
      name: c.title,
    })),
  };
}

export function breadcrumbs(
  locale: Locale,
  trail: Array<{ name: string; path: string }>,
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export function graph(nodes: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
