import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/img/*.{jpg,png}',
  { eager: true },
);

/** key ("ariel-pelevin") -> imported image, so JSON data can reference images by name. */
export const images: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.split('/').pop()!.replace(/\.(jpg|png)$/, ''),
    mod.default,
  ]),
);

export function img(key: string): ImageMetadata {
  const found = images[key];
  if (!found) throw new Error(`Unknown image "${key}"`);
  return found;
}

/** Every photograph on the history page. 14 recovered from the Weblium bucket,
    then 18 supplied by the client on 2026-08-21. */
export const galleryKeys = Array.from({ length: 32 }, (_, i) =>
  `academy-${String(i + 1).padStart(2, '0')}`,
);

/** Testimonial screenshots the old carousel failed to render. */
export const socialReviewKeys = Array.from({ length: 3 }, (_, i) =>
  `social-review-${String(i + 1).padStart(2, '0')}`,
);

/** Before/after images on the method page. */
export const resultKeys = ['result-01', 'result-02', 'result-03'];

/** Testimonial portrait for each of the seven reviews. */
export const reviewKeys = Array.from({ length: 7 }, (_, i) =>
  `review-${String(i + 1).padStart(2, '0')}`,
);
