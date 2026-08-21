/**
 * Site-wide constants.
 *
 * Every outbound destination here is taken verbatim from the archived
 * osteo-lifting.com pages (see ../../archive/pages). Nothing is invented:
 * the business has no published email address or postal address, so none
 * is asserted anywhere in the markup or the structured data.
 */

export const SITE_URL = 'https://osteo-lifting.com';

/** The only phone number that appears as text on the current site (history pages). */
export const PHONE = '+381638219020';

export const TELEGRAM = {
  ariel: 'https://t.me/osteolifting',
  olena: 'https://t.me/Olena_Hrinchuk',
} as const;

export const WHATSAPP = {
  ariel: 'https://api.whatsapp.com/send?phone=+381638219020',
  olena: 'https://api.whatsapp.com/send?phone=+380976332902',
} as const;

export const SOCIAL = {
  arielInstagram: 'https://www.instagram.com/ariel.pelevin/',
  arielFacebook: 'https://www.facebook.com/pelevin.ariel',
  olenaInstagram: 'https://www.instagram.com/dr_hrinchuk',
  spaInstagram: 'https://instagram.com/api.spa.od?igshid=MzRlODBiNWFlZA==',
} as const;

/** Populated once a GA4 property exists; empty means no analytics script is emitted. */
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID ?? '';

export const OG_IMAGE = '/og-image.jpg';
