// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (competition gta6-meme-x-01). Node 22, standard library only.
//
// The post on X is the entry itself: the house reads the post (its first
// picture, the meme, plus its text) straight from X and hands it to the
// judge. This program does exactly one small job — it hands the gate the
// post's address by copying POST.json from the repository root into the
// output directory — and it checks the file first, so a bad address fails
// here with a plain message instead of being refused later.
//
// Local run (the grader's /bot and /output are replaced by env vars):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function die(reason: string): never {
  console.error(`POST.json rejected: ${reason}`);
  process.exit(1);
}

// Read POST.json and return its post address, or exit 1 naming the fault.
function loadPostAddress(): string {
  const path = join(BOT_DIR, 'POST.json');
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (err) {
    die(`cannot read ${path} (${(err as Error).message})`);
  }

  let data: unknown;
  try {
    data = JSON.parse(text!);
  } catch (err) {
    die(`not valid JSON (${(err as Error).message})`);
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    die('must be a JSON object, e.g. {"url": "https://x.com/<handle>/status/<id>"}');
  }

  const url = (data as { url?: unknown }).url;
  if (typeof url !== 'string') {
    die('its "url" field must be a string');
  }
  if (!url.startsWith('https://x.com/') && !url.startsWith('https://twitter.com/')) {
    die(`its "url" must start with https://x.com/ or https://twitter.com/, got ${url}`);
  }
  return url;
}

function main(): void {
  const url = loadPostAddress();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'POST.json'), readFileSync(join(BOT_DIR, 'POST.json')));
  console.log(`POST.json copied to ${OUTPUT_DIR}: entry post ${url}`);
}

main();
