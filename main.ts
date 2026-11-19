// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: this program only copies POST.json from
// the repository root to /output/POST.json, where the gate reads the post's
// address. The house reads the post from X (its first picture, the meme, and
// its text) and hands that to the judge. Nothing written here is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Validate POST.json before copying: the gate reads the post's address from
// it, so a missing, malformed, or wrong-shaped file must fail loudly here
// instead of being copied through and refused downstream.
function fail(message: string): never {
  console.error(`invalid POST.json in ${botDir}: ${message}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (error) {
  fail(`could not read or parse it: ${(error as Error).message}`);
}

if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('it must be a JSON object like {"url": "https://x.com/<handle>/status/<id>"}');
}

const url = (parsed as { url?: unknown }).url;
if (
  typeof url !== 'string' ||
  (!url.startsWith('https://x.com/') && !url.startsWith('https://twitter.com/'))
) {
  fail('its "url" must be a string starting with https://x.com/ or https://twitter.com/');
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (error) {
  console.error(`could not copy POST.json from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}
