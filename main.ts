// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (gta6-meme-x-01). Node 22, standard library only.
//
// The post on X is the entry: the house reads the post (its first picture,
// the meme, plus its text) straight from X and gives it to the judge. This
// program has one small job — hand the gate the post's address. It reads
// POST.json from the repository root, makes sure it names a real X post,
// and writes it into the output directory. Anything wrong fails here with
// a clear message instead of being refused at submission time.
//
// Local check (env vars stand in for the grader's /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function abort(why: string): never {
  console.error(`cannot use POST.json: ${why}`);
  process.exit(1);
}

// Read POST.json and return the post address it holds, or exit 1.
function loadPost(): string {
  const file = join(BOT_DIR, 'POST.json');
  let body: string;
  try {
    body = readFileSync(file, 'utf8');
  } catch (err) {
    abort(`could not read ${file} (${(err as Error).message})`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body!);
  } catch (err) {
    abort(`not valid JSON (${(err as Error).message})`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    abort('must be a JSON object such as {"url": "https://x.com/<handle>/status/<id>"}');
  }

  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string' || url.length === 0) {
    abort('the "url" field must be a non-empty string');
  }
  if (!url.startsWith('https://x.com/') && !url.startsWith('https://twitter.com/')) {
    abort(`the "url" must be an x.com or twitter.com post address, got ${url}`);
  }
  if (!url.includes('/status/')) {
    abort(`the "url" must be a post address (it should contain /status/), got ${url}`);
  }
  if (url.includes('<') || url.includes('>')) {
    abort('the "url" still contains a placeholder; put the real post address in POST.json');
  }
  return url;
}

// Copy POST.json into the output directory and say what was published.
function publish(): void {
  const url = loadPost();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    join(OUTPUT_DIR, 'POST.json'),
    readFileSync(join(BOT_DIR, 'POST.json')),
  );
  console.log(`POST.json published to ${OUTPUT_DIR} for post ${url}`);
}

publish();
