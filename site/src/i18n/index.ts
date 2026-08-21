import ru from './ru.json';
import ua from './ua.json';
import en from './en.json';

export const LOCALES = ['ru', 'ua', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

/** Path segment -> BCP-47 language tag. Ukrainian is `uk`, never `ua`. */
export const LANG_TAG: Record<Locale, string> = { ru: 'ru', ua: 'uk', en: 'en' };

/** OpenGraph locale tags. */
export const OG_LOCALE: Record<Locale, string> = {
  ru: 'ru_RU',
  ua: 'uk_UA',
  en: 'en_US',
};

const dicts = { ru, ua, en } as const;

export type Dict = typeof ru;
export type Course = Dict['courses'][number];

export function useTranslations(locale: Locale): Dict {
  return dicts[locale] as unknown as Dict;
}

/** Build an absolute, trailing-slashed path inside a locale. */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
