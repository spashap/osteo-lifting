/**
 * Generates the two binary brand assets that are not derived from the archive:
 *   public/og-image.jpg      1200x630 social preview
 *   public/apple-touch-icon.png  180x180 home-screen icon
 *
 * Run with `npm run assets`. Both outputs are committed, so a normal build
 * never depends on this script.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const sculpture = join(root, 'src/assets/img/hero-sculpture.jpg');

const BG = '#211b18';
const BONE = '#f4efe9';
const ACCENT = '#b08d7a';

const W = 1200;
const H = 630;
const PANEL = 470;

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <g transform="translate(88, 176)">
    <path d="M0 96V44a24 24 0 0 1 48 0v52" fill="none" stroke="${ACCENT}" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M17 96V45a7 7 0 0 1 14 0v51" fill="none" stroke="${ACCENT}" stroke-width="3.6" stroke-linecap="round" opacity="0.5"/>
  </g>
  <text x="88" y="376" font-family="Georgia, 'Times New Roman', serif" font-size="68" fill="${BONE}" letter-spacing="1.5">OSTEO-LIFTING</text>
  <rect x="88" y="414" width="72" height="2" fill="${ACCENT}"/>
  <text x="88" y="462" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="${ACCENT}" letter-spacing="0.5">International Academy · M.A.O.</text>
</svg>`;

const panel = await sharp(sculpture)
  .resize(PANEL, H, { fit: 'cover', position: 'top' })
  .modulate({ saturation: 0.9 })
  .toBuffer();

await sharp(Buffer.from(overlay))
  .composite([{ input: panel, left: W - PANEL, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(root, 'public/og-image.jpg'));

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="180" height="180">
  <rect width="64" height="64" rx="13" fill="${BG}"/>
  <path d="M13 52V28.5a19 19 0 0 1 38 0V52" fill="none" stroke="${BONE}" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M26.5 52V29.5a5.5 5.5 0 0 1 11 0V52" fill="none" stroke="${ACCENT}" stroke-width="3.6" stroke-linecap="round"/>
</svg>`;

await sharp(Buffer.from(icon)).png().toFile(join(root, 'public/apple-touch-icon.png'));

console.log('wrote public/og-image.jpg and public/apple-touch-icon.png');
