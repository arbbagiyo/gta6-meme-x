// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (gta6-meme-x-01). Node 22, standard library only.
//
// The X post is the entry: the house reads the post (its first picture,
// the meme, plus its text) straight from X and hands it to the judge.
// This program does one small job — it reads the post's address out of
// POST.json in the repository root, makes sure it really points at an X
// post, and puts a copy in the output directory for the gate to read.
// Anything wrong fails here with a plain message instead of a refusal
// from the site later.
//
// Local run (env vars stand in for the grader's /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(reason: string): never {
  console.error(`POST.json rejected: ${reason}`);
  process.exit(1);
}

// Read the post address out of POST.json, checking it at every step.
function loadPostUrl(): string {
  const file = join(BOT_DIR, 'POST.json');
  let raw: string;
  try {
    raw = readFileSync(file, 'utf8');
  } catch (err) {
    fail(`could not read ${file} (${(err as Error).message})`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw!);
  } catch (err) {
    fail(`not valid JSON (${(err as Error).message})`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('must be a single JSON object, e.g. {"url": "https://x.com/<handle>/status/<id>"}');
  }

  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string' || url.length === 0) {
    fail('its "url" field has to be a non-empty string');
  }
  const onX =
    url.startsWith('https://x.com/') ||
    url.startsWith('https://www.x.com/') ||
    url.startsWith('https://twitter.com/') ||
    url.startsWith('https://www.twitter.com/');
  if (!onX) {
    fail(`its "url" has to live on x.com or twitter.com, got ${url}`);
  }
  if (url.includes('<') || url.includes('>')) {
    fail('its "url" is still the template — replace it with the real post address');
  }
  if (!url.includes('/status/')) {
    fail(`its "url" has to be a post address (with /status/ in it), got ${url}`);
  }
  const tail = url.slice(url.lastIndexOf('/') + 1).split('?')[0];
  if (!/^[0-9]+$/.test(tail!)) {
    fail(`its "url" has to end in the post's numeric id, got ${url}`);
  }
  if (tail!.length < 10) {
    fail(`its "url" ends in a suspiciously short id (${tail}) — check the post address`);
  }
  // The handle between the host and /status/ has to be a real X handle:
  // letters, digits and underscores only, nothing empty.
  const afterHost = url.split('/').slice(3).join('/');
  const handle = afterHost.split('/status/')[0];
  if (!/^[A-Za-z0-9_]+$/.test(handle!)) {
    fail(`its "url" has to name a real X handle before /status/, got ${url}`);
  }
  return url;
}

// Hand POST.json over to the output directory.
function handOff(): void {
  const url = loadPostUrl();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  console.log(`entry post handed to ${OUTPUT_DIR}: ${url}`);
}

handOff();
