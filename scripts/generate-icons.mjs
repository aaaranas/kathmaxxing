/**
 * Renders the app icons from one vector source.
 *
 * The mark is a lowercase k with the highlighter bar from the wordmark struck
 * through its foot - the same device the site header uses behind "kathmaxxing",
 * so the icon and the page agree. It replaced a 2x2 binary nibble, which said
 * "number bases" back when that was the whole app and said nothing about the
 * algebra and calculus shelves that followed; the nibble also collapsed into a
 * dark block at favicon size, where its one idea - a single bit switched off -
 * fell below a pixel.
 *
 * The arm and leg are one polyline meeting at a single vertex on the stem's
 * edge. Drawn as two separate strokes they float free of the stem and the
 * letter reads as an arrow.
 *
 * Run with: node scripts/generate-icons.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PLATE = "#bfd4f2";
const PLATE_STRONG = "#97b9e6";
const INK = "#000000";
const SIZE = 512;
const WEIGHT = 52;

/**
 * `scale` shrinks the mark about the centre without touching the ground.
 * Android crops a maskable icon to a shape of its choosing and only guarantees
 * a circle 80% of the width, so the maskable cut draws the mark smaller and
 * lets the plate take the cropping.
 */
function markup(scale = 1) {
  const centre = SIZE / 2;
  const mark = `
    <rect x="118" y="340" width="278" height="54" fill="${PLATE_STRONG}" />
    <g stroke="${INK}" stroke-width="${WEIGHT}" stroke-linecap="butt" fill="none">
      <path d="M 170 110 L 170 402" />
      <path d="M 356 208 L 202 306 L 360 402" />
    </g>`;

  const body =
    scale === 1
      ? mark
      : `<g transform="translate(${centre} ${centre}) scale(${scale}) translate(${-centre} ${-centre})">${mark}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <rect width="${SIZE}" height="${SIZE}" fill="${PLATE}" />${body}
  </svg>`;
}

const standard = Buffer.from(markup());
const maskable = Buffer.from(markup(0.78));

const targets = [
  { file: "public/icon-192.png", size: 192, source: standard },
  { file: "public/icon-512.png", size: 512, source: standard },
  { file: "public/icon-maskable-512.png", size: 512, source: maskable },
  { file: "public/apple-touch-icon.png", size: 180, source: standard },
  { file: "src/app/icon.png", size: 256, source: standard },
];

await mkdir(join(root, "public"), { recursive: true });
await writeFile(join(root, "public", "icon.svg"), standard);

for (const { file, size, source } of targets) {
  const out = join(root, file);
  await sharp(source).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${file} (${size}x${size})`);
}
