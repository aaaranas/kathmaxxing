/**
 * Renders the app icons from one vector source.
 *
 * The mark is a nibble: four binary places drawn as a 2x2 grid, lit to 1011 -
 * decimal 11, hex B. The lit cells are solid, the dark cell is an outline, so
 * the icon states the app's subject rather than decorating it.
 *
 * Run with: node scripts/generate-icons.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PLATE = "#bfd4f2";
const INK = "#000000";
const SIZE = 512;
const CELL = 120;
const GAP = 20;
const BITS = [1, 0, 1, 1];

function markup() {
  const span = CELL * 2 + GAP;
  const origin = (SIZE - span) / 2;

  const cells = BITS.map((bit, index) => {
    const x = origin + (index % 2) * (CELL + GAP);
    const y = origin + Math.floor(index / 2) * (CELL + GAP);
    const shape = `x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="18"`;
    return bit === 1
      ? `<rect ${shape} fill="${INK}" />`
      : `<rect ${shape} fill="none" stroke="${INK}" stroke-width="14" />`;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <rect width="${SIZE}" height="${SIZE}" fill="${PLATE}" />
    ${cells}
  </svg>`;
}

const svg = Buffer.from(markup());

const targets = [
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "public/icon-maskable-512.png", size: 512 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "src/app/icon.png", size: 256 },
];

await mkdir(join(root, "public"), { recursive: true });
await writeFile(join(root, "public", "icon.svg"), svg);

for (const { file, size } of targets) {
  const out = join(root, file);
  await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${file} (${size}x${size})`);
}
