/**
 * Prepares a batch of academy photographs for the site.
 *
 *   node scripts/optimize-photos.mjs <source-dir> <start-index> [order.json]
 *
 * What actually ships is the AVIF/WebP that Astro generates at build time, so
 * this script's only job is to produce good *masters*: correctly oriented, free
 * of metadata, and not absurdly large.
 *
 * It deliberately re-encodes only when that achieves something — an oversized
 * image, or embedded metadata (phone cameras routinely bury GPS coordinates in
 * EXIF). Re-encoding an already-compressed JPEG for its own sake just compounds
 * artefacts and hands Astro a worse source, so in every other case the file is
 * copied through byte-for-byte. WhatsApp exports, for instance, arrive already
 * stripped and already small.
 *
 * `order.json`, if given, lists source filenames in the order they should be
 * numbered; otherwise files are taken in sorted order. Duplicates are skipped
 * by content hash.
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'img');
const MAX_EDGE = 1600;
const QUALITY = 82;

const [, , srcDir, startArg, orderFile] = process.argv;
if (!srcDir || !startArg) {
  console.error('usage: node scripts/optimize-photos.mjs <source-dir> <start-index> [order.json]');
  process.exit(1);
}

const src = resolve(srcDir);
const names = orderFile
  ? JSON.parse(await readFile(resolve(orderFile), 'utf8'))
  : (await readdir(src)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

let index = Number(startArg);
const seen = new Set();
let totalIn = 0;
let totalOut = 0;

for (const name of names) {
  const buf = await readFile(join(src, name));
  const hash = createHash('md5').update(buf).digest('hex');
  if (seen.has(hash)) {
    console.log(`skip duplicate         ${name}`);
    continue;
  }
  seen.add(hash);

  const meta = await sharp(buf).metadata();
  const oversized = Math.max(meta.width, meta.height) > MAX_EDGE;
  const hasMetadata = Boolean(meta.exif || meta.xmp || meta.iptc || meta.icc);
  const needsRotate = meta.orientation !== undefined && meta.orientation > 1;
  const rework = oversized || hasMetadata || needsRotate;

  const target = join(OUT, `academy-${String(index).padStart(2, '0')}.jpg`);
  let size;
  let width = meta.width;
  let height = meta.height;

  if (rework) {
    const info = await sharp(buf)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toFile(target);
    size = info.size;
    width = info.width;
    height = info.height;
  } else {
    await writeFile(target, buf);
    size = buf.length;
  }

  const why = rework
    ? [oversized && 'resized', hasMetadata && 'metadata stripped', needsRotate && 'rotated']
        .filter(Boolean)
        .join(', ')
    : 'copied as-is';

  totalIn += buf.length;
  totalOut += size;
  console.log(
    `academy-${String(index).padStart(2, '0')}.jpg  ${String(width).padStart(4)}x${String(height).padEnd(4)}  ` +
      `${(size / 1024).toFixed(0).padStart(4)} kB  ${why}`,
  );
  index += 1;
}

console.log(
  `\n${seen.size} masters, ${(totalOut / 1024).toFixed(0)} kB total ` +
    `(sources were ${(totalIn / 1024).toFixed(0)} kB).\n` +
    'Delivered size is decided by the AVIF/WebP variants Astro builds from these.',
);
