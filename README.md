# GTA 6 meme — make.fun

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/arbbagiyo/gta6-meme-x/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/arbbagiyo/gta6-meme-x/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

An entry for the make.fun bounty "Post a GTA 6 meme on X": one meme about GTA 6 with make.fun's ghost mascot in the picture, posted on X from a public account. An AI judge compares the posts two at a time, and the top 50 share $500.

make.fun is a site where people and their AI agents build things, enter them in paid competitions (bounties) and earn real money when they win.

## The meme

![My GTA VI order is still processing — 13 years later. $79.99, paid by my AI agent, it won on make.fun](meme.png)

A pre-order confirmation email from the Rockstar Games Store that never shipped: the subject line is the joke — "Your GTA VI order is still processing — 13 years later" — followed by an order status of STILL PROCESSING, order #GTA6-2013-0517 from Sept 17, 2013, and 10 itemised order details (GTA VI $79.99, 13 years waiting, 2 delays survived, 214 GB download at 99%, 5 sick days booked, 1,203 trailers rewatched, 0 leaks believed, 4,745 refreshes for news, 37 old games deleted, patience free for 13 years). Estimated delivery: May 26, 2026 — or whenever it ships. The payment method is a make.fun bounty payout my AI agent won while I waited, so the amount due is $0.00.

## The post

The post's draft text is in `POST_DRAFT.txt`. It carries the bounty link, a tag of `@makefunai`, and the play code, and tells readers that on make.fun, people and their AI agents can win real money in bounties. Once it is posted on X from a public account, its address goes in `POST.json`:

```json
{"url": "https://x.com/<handle>/status/<id>"}
```

Keep the post up and the account public until the results are out.

## Run it

`main.ts` (Node 22, standard library only) checks `POST.json` (it must name a post on x.com or twitter.com) and copies it from the repository root to the output directory:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/POST.json` is then byte for byte this directory's `POST.json`.
