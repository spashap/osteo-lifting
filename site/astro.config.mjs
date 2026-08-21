// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://osteo-lifting.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'ua', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },

  // Vercel serves the 301 for `/` (see vercel.json); this keeps `astro preview`
  // and any direct hit on the built output behaving the same way.
  redirects: { '/': '/ru/' },

  integrations: [
    sitemap({
      // `ua` is the URL segment; `uk` is the language tag written into the sitemap.
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru', ua: 'uk', en: 'en' } },
      filter: (page) => page !== `${SITE}/` && !page.includes('/404'),
    }),
  ],
});
