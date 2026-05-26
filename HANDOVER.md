# HANDOVER — ASL Context Learning

> Single source of truth for this project. Read this at the start of every chat session before touching any code, and update it at the end of every session.
> (Merged 2026-05-25: the standalone Session 4 brief was folded into §3 of this file.)

---

## What this project is

An interactive web app for **late-deafened adult ESL learners** to learn ASL signs in real English context. Target user: a post-lingually deaf adult whose first language is not English (e.g. Echo herself — native Chinese, completely deaf since 2025, learning ASL + English simultaneously).

**How it works now:** one single screen — left column = scene banner above the story narration; right column = shared info/video panel. Clicking a blue-underlined word in the story drives the panel (ASL sign video + context card). No tabs.

**Portfolio purpose:** Job-track outreach tool (LinkedIn, employer demos) at 70% priority; PhD backup at 30%. Keep it clean, fast, and demonstrable in under 30 seconds.

**What differentiates it from VL2 Storybook Apps (Gallaudet):** VL2 targets Deaf children's early literacy. This targets adult post-lingual ESL learners — an underserved profile no existing tool addresses directly.

---

## Current state (as of 2026-05-25 — end of Session 4)

Repo is clean. Session 4's three build tasks are done and committed:

```
git log --oneline -6
38192fb Revert to interactive SVG scene; 60/40 layout; ASL alphabet modal
ac4f7eb Docs: close out Session 4 in HANDOVER (tasks 1-3 done)
3356d7f Session 4 (Task 1): Gemini scene image as context backdrop  ← REVERTED in 38192fb
193be32 Session 4 (Tasks 2-3): x deselect + fingerspelling strip
548cf0b Session 3: unified single-screen layout
9ab6cb9 commend on first stage handover
```

### Built and working

| File | Purpose | Status |
|---|---|---|
| `index.html` | Single-screen layout: interactive SVG scene + story (left), info/video/fingerspell panel (right); alphabet modal | ✅ Done |
| `style.css` | Swiss-minimal, 2-column grid, scene 60% / story 40% vertical split, fingerspell tiles, × dismiss, modal | ✅ Done |
| `app.js` | vocabularyMap, stories (with `sceneBuilder` key), `sceneBuilders` map, click handler, fingerspell, modal, video | ✅ Done |
| `assets/image/ASL.png` | ASL manual alphabet chart for the modal (375×500, WebP-in-PNG). ⚠ Has visible copyright watermark — see deployment note. | ⚠ Present |
| `assets/image/home-kitchen.png` | Old Gemini backdrop. **Unused** after revert — kept in repo so we can re-evaluate later. Safe to delete. | ⚠ Unused |
| `wlasl-urls.js` | Auto-generated URL lookup, 14 words, ~9KB | ✅ Done |
| `scripts/build-lookup.js` | Regenerates wlasl-urls.js from WLASL_v0.3.json | ✅ Done |
| `scripts/lint-story.js` | Author-first helper: checks draft text against WLASL coverage | ✅ Done |
| `WLASL_v0.3.json` | Full 2000-word dataset, local only, gitignored | ✅ Present |
| `.gitignore` | Excludes WLASL JSON and .DS_Store | ✅ Done |

**Asset state:** `assets/image/ASL.png` (alphabet chart, used by the modal) and the unused `home-kitchen.png` (kept for reference) live in `assets/image/`. `assets/fingerspell/` exists with a README but **no handshape images yet** — the Fingerspell strip currently shows letter glyphs and auto-upgrades to handshapes the moment `a.png … z.png` are dropped in. `assets/svgs/` and `assets/videos/` are still empty.

### Session 3 changes (decided WITH Echo)
- **Layout merged.** Dropped the Explore/Read tabs. One screen: left column = scene banner above the story narration; right column = shared info/video panel. Clicking a scene object OR a story word both drive the same panel. (Chosen over 3-column because we didn't yet have one scene illustration per story.)
- **"Common phrases with" card removed.** The Datamuse `lc` lookup returned mostly empty. Replaced with an **"In context"** card showing the source sentence containing the clicked word, that word highlighted. Source sentence comes from `sentenceIndex` (built from the `stories` array at load).
- **Story strategy = author-first + linter.** Rejected mass auto-generation (most of the 2000 WLASL glosses are function/abstract words and auto-stories read poorly). Instead: write narrations by hand, then run `lint-story.js` to see which words ASL can cover.

---

## Session 4 — completed (2026-05-25)

All three tasks built, verified with a jsdom DOM test, and committed.

### ✅ Task 1 — Generated scene image as a context backdrop
- The hand-built kitchen SVG is gone. `renderScene()` injects the per-story illustration (`story.image` → `assets/image/home-kitchen.png`) as a large, **non-clickable** banner. All vocabulary stays clickable in the story prose (no hidden trick).
- Story now renders as **one flowing paragraph** (sentences joined), killing the per-sentence whitespace.
- **Layout decision — kept 2-column, did NOT go 3-column.** The Gemini image is landscape (1376×768, ~1.79:1); it reads well as a wide top banner but would look cramped as a narrow middle column. 3-column (narration | image | video) stays deferred unless future scene images are cropped portrait/square. *(Echo's note carried forward: adding hotspots on the image is still a possible later test.)*
- Image styling: `.scene-img` uses `object-fit: cover; height: clamp(220px, 40vh, 440px)` so the banner scales with the viewport without dominating.

### ✅ Task 2 — Fingerspelling strip replaces "In context"
- "In context" card, `renderInContext`, and `sentenceIndex` removed.
- New **Fingerspell** card: `renderFingerspell(word)` lays out one tile per letter. Each tile attempts `assets/fingerspell/{letter}.png`; on success (`onload`) the tile shows the handshape with the letter as a small caption, on failure (`onerror`) it falls back to the letter glyph. So it works now (v1, letters) and auto-upgrades to handshapes (v2) when 26 images are added — no code change needed.

### ✅ Task 3 — "×" deselect replaces "← Back"
- Dead bottom "← Back" button removed. A small round **×** sits top-right of the active panel (`#dismiss-btn`) and calls `resetPanel()` to return to idle.

---

## Session 4 — follow-up reversal (2026-05-26, commit `38192fb`)

Echo reviewed the Gemini-backdrop version and flagged two issues. We acted on both.

### Reversal: back to interactive SVG scene
- **Why we reverted Task 1's raster backdrop:** Echo noted the Gemini image looked comic-y and read as VL2/Gallaudet-style, which undercuts the differentiation pitch. The interactive SVG's hover-to-glow is also the actual demo moment that lands in 30 seconds.
- **What's in place now:** a new polished kitchen SVG via a `sceneBuilders` map keyed by `story.sceneBuilder`. Six interactive objects (apple, chair, **cup**, glass, knife, table) — adding `cup` resolves the previously dead vocab entry, and the story now uses `{cup}` too.
- **SVG polish:** gradients (wall, floor, table, apple), sunbeam from a mullioned window, soft floor shadow, hover-glow per object, labels visible by default. Distinctly more considered than the prior crude shapes; still Swiss-minimal.
- **Layout:** 60% scene / 40% story vertical split inside the left column (`flex: 0 0 60%` / `flex: 1 1 40%`). Story scrolls inside its area.
- **`sceneBuilders` pattern:** adding a story = add a row to `stories` + add a builder function under `sceneBuilders`. Documented in §"Workflows".
- **Scaling note (carried forward):** hand-built SVG per scene won't scale past 3–4 scenes. Echo plans to ask peers/professors for a long-run approach (component library? trace-over-Gemini? procedural?). Acceptable for now.

### New: "Show ASL alphabet" modal
- The Fingerspell card now has a "Show ASL alphabet" button. It opens a centered modal showing `assets/image/ASL.png` (the manual alphabet chart). Dismisses on the modal's own ×, backdrop click, or Escape. Accessible via `role="dialog" aria-modal="true"` + focus management on open.
- Strip note updated: "Don't know the handshapes yet? Open the chart below."

### Carried forward / still open
- **⚠ `ASL.webp` is copyright-watermarked ("Gérard Aflague Collection").** Echo renamed the extension from `.png` to `.webp` (it was always WebP bytes); `index.html` now references `assets/image/ASL.webp`. The IP issue is *unchanged* — fine for prototype/demo, but **before public GitHub Pages deployment** swap to a CC/public-domain ASL alphabet chart (Wikimedia Commons has several), link out instead of embedding, or render our own from the 26 handshape images.
- **Handshape images:** drop `a.png … z.png` into `assets/fingerspell/` to upgrade the per-letter strip from glyphs to handshapes (no code change needed).
- **Old `home-kitchen.png` is unused** post-revert. Keep for reference or `git rm`.
- **Scene scaling beyond ~3 stories:** decide a long-run approach (peer/professor input).
- **GitHub Pages deployment:** ready — `git push` + enable Pages, then add URL to `ezhozhao.github.io`. Do the ASL chart swap first.

---

## ▶ Next chat — "At the Doctor" story build (2026-05-26)

Echo drafted the second story in `stories.md` and ran the linter. Build is a discrete chunk; hand to a fresh chat.

### Source material
Echo's draft is at `stories.md`. It is personal, deaf-experience-specific — the line *"the kind doctor pulls down her **mask** so I can see her lips"* is the differentiation moment vs. VL2-style apps. Preserve that.

### Linter run (already done — `node scripts/lint-story.js stories.md`)
- **43 coverable** (74%): `doctor, sit, tall, chair, quiet, hospital, room, feel, very, sick, tired, today, keep, eyes, door, because, cannot, hear, name, soon, nurse, call, enter, deaf, down, see, temperature, explain, bad, winter, cold, go, home, drink, warm, water, rest, comfortable, bed, type, phone, visit, safe`
- **0 gloss-only**
- **15 fingerspell** (26%): `waves, hand, kind, pulls, mask, lips, checks, writes, sentences, notepad, tells, immediately, thank, visual, makes` — these will show as letter tiles (or handshapes once `assets/fingerspell/` is filled). **`mask` is fine as fingerspell** — it's a daily-life word deaf learners benefit from spelling.

### Build steps
1. Convert the draft prose in `stories.md` to a `{word}`-bracketed `sentences` array. Decide which words to make clickable in the prose (every coverable word + the fingerspell ones that carry the story — at minimum `mask`, `lips`, `sentences`).
2. Add an entry to `stories` in `app.js`:
   ```js
   {
     id: 'at-the-doctor',
     title: 'At the Doctor',
     scene: 'Health · Clinic',
     sceneBuilder: 'clinic',          // or 'doctorOffice'
     sentences: [ ... ]
   }
   ```
3. Add new words to `vocabularyMap` in `app.js` **and** to `VOCAB_WORDS` in `scripts/build-lookup.js` (paste the list above).
4. Run `node scripts/build-lookup.js` to regenerate `wlasl-urls.js`.
5. **Write the new scene builder** under `sceneBuilders` in `app.js`. Suggested 5–6 interactive objects to surface story words on the scene: `chair` (waiting/exam chair), `bed` (exam bed), `door`, `mask`, `phone`, maybe `temperature` (thermometer). Aim for the same visual register as the kitchen — gradients, soft shadow, hover-glow, labels above each object. Keep `viewBox="0 0 960 540"`.
6. Add a small UI affordance to switch between stories (currently `renderScene()` only uses `stories[0]`). Simplest: a dropdown or two buttons in the story header. This is a small but new piece.
7. Verify with jsdom (extend the test pattern from prior sessions).
8. Commit. Update `HANDOVER.md` Phase 1 / file map / vocabulary sections.

### Open decisions for the new chat
- **Multi-story navigation:** dropdown above the story, or tabs, or two visible columns? Smallest viable first.
- **`mask` and `lips` clickability:** include in the prose as fingerspell-only words (they'll show no video but the strip will spell them), or skip them? Recommend include — they're the differentiation moment.
- **Whether to add 26 handshape images now**, so `mask`/`lips`/etc. spell with actual handshapes from day one of the doctor story (otherwise they'll show letter glyphs).

### Hand to the new chat
Paste this section + `HANDOVER.md` + `git log --oneline -10`.

---

## Vocabulary & current story

**Vocabulary (14 words):**
- Scene (clickable in the SVG): `apple`, `chair`, `cup`, `glass`, `knife`, `table`
- Story-only (clickable as underlined words in the prose): `bread`, `drink`, `eat`, `food`, `hungry`, `kitchen`, `morning`, `water`

**Current story:** "A Morning in the Kitchen" — 5 sentences. Every vocab word now appears in the story prose (so each is clickable in at least one place; the six scene objects are clickable in both places).

**How video loading works:** `tryVideoUrls(word)` walks through `WLASL_URLS[word]` silently, skipping CORS/404 failures until one plays. A note is shown only on total failure.

---

## Architecture decisions and why

| Decision | Reason |
|---|---|
| `<span data-word>` for story words, not SVG hotspots | Zero coordinate math, naturally responsive, easily extended by typing |
| Single info panel shared by all interactions | Same UX flow regardless of source — less to learn |
| Pre-built `wlasl-urls.js`, not runtime JSON parse | WLASL JSON is ~12MB — too heavy for the browser |
| `data-word` attribute as the unified click model | Same `handleWordClick(word)` used everywhere |
| Interactive SVG scene (one builder per story) | Hover-to-glow is the demo moment + visual differentiation from VL2-style storybook apps. Hand-built; doesn't scale past ~3 stories without a new approach. |
| `sceneBuilders` map keyed by `story.sceneBuilder` | Adding a story = add a row + add a builder function. Mechanical, explicit. |
| ASL (not Auslan/BIM) | Echo learning ASL personally; ASL/BIM structural overlap is a partial advantage |
| Target user locked to Option A | Late-deafened adult ESL learner — underserved, differentiable, Echo IS the user |

---

## Roadmap

### Phase 1 — Current (polished demo) ✅
- [x] Scene mode with clickable objects
- [x] Story mode with the kitchen story
- [x] Shared info panel: word title, ASL video, context
- [x] Unified single-screen layout
- [x] Video fallback chain across multiple WLASL sources

### Phase 1 remaining
- [x] Session 4 tasks 1–3 — fingerspell strip, × dismiss, scene work (done 2026-05-25)
- [x] Session 4 follow-up — revert to SVG scene, 60/40 layout, alphabet modal (done 2026-05-26)
- [x] Surface `cup` in the scene + story (done in revert)
- [ ] Swap `ASL.png` for a CC/public-domain chart (or render our own) — required before public deploy
- [ ] Add handshape images `a.png … z.png` to `assets/fingerspell/` — upgrades the per-letter strip to real handshapes
- [ ] Add 1–2 more stories. Workflow now: draft narration → `node scripts/lint-story.js draft.txt` → add to `vocabularyMap` + `stories` array + `VOCAB_WORDS` → run `build-lookup.js` → **write a new SVG `sceneBuilders` entry** for the scene.
- [ ] Long-run scene-art approach (3+ stories) — ask peers/professors
- [ ] GitHub Pages deployment
- [ ] Test video playback across all 14 words; note persistent failures
- [ ] Add a loading spinner while video tries sources

### Phase 2 — Smart fallback for unknown words
If a clicked word is NOT in WLASL, trigger a fingerspelling engine (CSS cross-fade A→B→C letter images, or Lottie). Makes the app work for *any* English word. Session 4's fingerspelling strip (Task 2) is the on-ramp to this.

### Phase 3 — Scale (don't plan yet)
- More scenes (bedroom, classroom, street) — each scene = 1 background image + story JSON, no hand-coded SVG
- Word clustering by domain (food, body, school, work) for progressive disclosure
- Node/graph word visualization as a separate view (very different product — don't mix)

---

## Workflows

**Add a new story:**
1. Add an object to the `stories` array in `app.js`: `{ id: 'at-the-doctor', title: 'At the Doctor', scene: 'Health · Clinic', sceneBuilder: 'doctorOffice', sentences: [...] }`
2. Wrap WLASL words in `{word}` inside sentences.
3. Add new words to `vocabularyMap` in `app.js` **and** to `VOCAB_WORDS` in `scripts/build-lookup.js`.
4. Run `node scripts/build-lookup.js` to regenerate `wlasl-urls.js`.
5. **Add a new scene builder** under `sceneBuilders` in `app.js`: `doctorOffice: () => \`<svg viewBox="0 0 960 540" …>…</svg>\``. Make any scene objects clickable by giving each `<g>` `class="interactive-object" data-word="…"`.
6. Commit: `app.js`, `wlasl-urls.js`, `scripts/build-lookup.js`.

**Author-first drafting:** write the narration as plain text → `node scripts/lint-story.js draft.txt` to see WLASL coverage → add coverable words per the steps above; non-coverable words become fingerspelling candidates.

**New chat session:**
1. Read this file first.
2. Run `git log --oneline -5` to see what changed since last session.
3. Ask Echo what she wants to focus on.
4. Update this file at the end of the session.

---

## When to start a new chat

- **Start a new chat when:** beginning the Phase 2 fingerspelling *engine*, deploying to GitHub Pages, or any session that requires reading large new files.
- Hand the new chat: this `HANDOVER.md` + `git log --oneline -10`.

---

## File map

```
asl-context-learning/
├── index.html              ← layout + alphabet modal
├── style.css               ← all styling
├── app.js                  ← all logic (vocabularyMap, stories, sceneBuilders, fingerspell, modal, video)
├── wlasl-urls.js           ← AUTO-GENERATED — run build-lookup.js, do not edit
├── WLASL_v0.3.json         ← local only, gitignored, never push to GitHub
├── HANDOVER.md             ← this file — update every session
├── .gitignore
├── assets/
│   ├── image/              ← ASL.png (alphabet chart, used by modal) + home-kitchen.png (unused after revert)
│   ├── fingerspell/        ← drop a.png … z.png here → tiles auto-upgrade to handshapes
│   ├── videos/             ← local mp4 fallback (optional, empty)
│   └── svgs/               ← spare folder (empty)
└── scripts/
    ├── build-lookup.js     ← run after adding new words
    └── lint-story.js       ← run on a draft to see WLASL coverage (author-first)
```

---

## Resolved in earlier sessions (kept for context)

- ~~Process all WLASL words into stories~~ → **author-first.** Most of the 2000 glosses are function/abstract words; auto-stories read poorly. Write narration first, then `lint-story.js` reports coverage.
- ~~Combine Explore + Read into one 3-column layout~~ → **kept 2-column + scene banner (Session 4).** Vertical 60/40 split inside the left column gives the scene most of the real estate.
- ~~"Common phrases with" shows nothing~~ → replaced with "In context" (Session 3) → **replaced with the Fingerspell strip (Session 4).**
- ~~Scene art scaling — Gemini backdrop~~ → tried (commit `3356d7f`) → **reverted (commit `38192fb`)** because the raster image read as VL2/Gallaudet-style and lost the hover-to-glow demo moment. We're back on hand-built SVG via a `sceneBuilders` map. Long-run scaling beyond ~3 stories is an open question (Echo to ask peers/professors).
- ~~"In context" card was redundant~~ → resolved (Session 4): the Fingerspell card replaces it; the alphabet chart modal answers "but what are these letters?"
