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
git log --oneline -5
3356d7f Session 4 (Task 1): Gemini scene image as context backdrop
193be32 Session 4 (Tasks 2-3): x deselect button + fingerspelling strip; merge handover
548cf0b Session 3: unified single-screen layout, in-context card, story linter; Session 4 brief
9ab6cb9 commend on first stage handover. Discuss how to handle the data to assist narration, and the layout.
01ff35c build the MVP
```

### Built and working

| File | Purpose | Status |
|---|---|---|
| `index.html` | Single-screen layout: image banner + story (left), info/video/fingerspell panel (right) — NO tabs | ✅ Done |
| `style.css` | Swiss-minimal, 2-column grid, image banner, fingerspell tiles, × dismiss, responsive stack | ✅ Done |
| `app.js` | vocabularyMap, stories (with `image`), renderScene, shared click handler, fingerspell, video fallback chain | ✅ Done |
| `assets/image/home-kitchen.png` | Gemini-generated scene backdrop for the kitchen story (1376×768) | ✅ Present |
| `wlasl-urls.js` | Auto-generated URL lookup, 14 words, ~9KB | ✅ Done |
| `scripts/build-lookup.js` | Regenerates wlasl-urls.js from WLASL_v0.3.json | ✅ Done |
| `scripts/lint-story.js` | Author-first helper: checks draft text against WLASL coverage | ✅ Done |
| `WLASL_v0.3.json` | Full 2000-word dataset, local only, gitignored | ✅ Present |
| `.gitignore` | Excludes WLASL JSON and .DS_Store | ✅ Done |

**Asset state:** `assets/image/home-kitchen.png` is in place (the kitchen scene backdrop). `assets/fingerspell/` exists with a README but **no handshape images yet** — the Fingerspell card currently shows letter glyphs and auto-upgrades to handshapes the moment `a.png … z.png` are dropped in. `assets/svgs/` and `assets/videos/` are still empty (spare/optional).

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

### Carried forward / still open
- **Handshape images:** drop `a.png … z.png` into `assets/fingerspell/` to upgrade the strip. (Optional: a single ASL-alphabet reference chart as an even-lighter fallback — not built.)
- **`cup` is an unused vocab entry:** it's in `vocabularyMap` but appears in no story text (and wasn't surfaced in the old SVG scene either), so it's currently never clickable. Either add it to a story sentence or drop it from the map.
- **Second story topic:** "At the Doctor" (strong accessibility angle) vs. "Going to School". Linter already validated an "At the Doctor…" draft (doctor/insurance/card/appointment coverable, "lobby" → fingerspell). Each new story now also needs its own Gemini image in `assets/image/`.
- **GitHub Pages deployment:** ready when Echo wants — `git push` + enable Pages, then add the URL to `ezhozhao.github.io`.

---

## Vocabulary & current story

**Vocabulary (14 words):**
- Scene: `apple`, `chair`, `table`, `glass`, `knife`
- Story: `kitchen`, `hungry`, `water`, `morning`, `eat`, `drink`, `food`, `cup`, `bread`

**Current story:** "A Morning in the Kitchen" — 5 sentences using all 14 words. Lives in the `stories` array in `app.js`.

**How video loading works:** `tryVideoUrls(word)` walks through `WLASL_URLS[word]` silently, skipping CORS/404 failures until one plays. A note is shown only on total failure.

---

## Architecture decisions and why

| Decision | Reason |
|---|---|
| `<span data-word>` for story words, not SVG hotspots | Zero coordinate math, naturally responsive, easily extended by typing |
| Single info panel shared by all interactions | Same UX flow regardless of source — less to learn |
| Pre-built `wlasl-urls.js`, not runtime JSON parse | WLASL JSON is ~12MB — too heavy for the browser |
| `data-word` attribute as the unified click model | Same `handleWordClick(word)` used everywhere |
| Scene image is a non-clickable backdrop (v1) | A raster PNG has no object structure; avoids per-scene hotspot coordinate math (may revisit — see Task 1 note) |
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
- [x] Session 4 tasks 1–3 — scene image backdrop, fingerspell strip, × dismiss (done 2026-05-25)
- [ ] Add handshape images `a.png … z.png` to `assets/fingerspell/` (upgrades the strip to real ASL handshapes)
- [ ] Add 1–2 more stories (each now also needs its own Gemini image in `assets/image/`). Workflow: draft narration as plain text → `node scripts/lint-story.js draft.txt` → add coverable words to `vocabularyMap` + the `stories` array (wrap in `{word}`) → add the same words to `VOCAB_WORDS` in `build-lookup.js` → run `node scripts/build-lookup.js`.
- [ ] Decide on `cup` — unused vocab entry (not in any story text); add it to a sentence or remove from `vocabularyMap`.
- [ ] GitHub Pages deployment — one push, enable Pages, then add the URL to `ezhozhao.github.io`
- [ ] Test video playback across all 14 words; note persistent failures
- [ ] Add a loading spinner while video tries sources (replace "Loading…" text)

### Phase 2 — Smart fallback for unknown words
If a clicked word is NOT in WLASL, trigger a fingerspelling engine (CSS cross-fade A→B→C letter images, or Lottie). Makes the app work for *any* English word. Session 4's fingerspelling strip (Task 2) is the on-ramp to this.

### Phase 3 — Scale (don't plan yet)
- More scenes (bedroom, classroom, street) — each scene = 1 background image + story JSON, no hand-coded SVG
- Word clustering by domain (food, body, school, work) for progressive disclosure
- Node/graph word visualization as a separate view (very different product — don't mix)

---

## Workflows

**Add a new story:**
1. Add an object to the `stories` array in `app.js`: `{ id: 'at-the-doctor', title: 'At the Doctor', scene: 'Health · Clinic', sentences: [...] }`
2. Wrap WLASL words in `{word}` inside sentences.
3. Add new words to `vocabularyMap` in `app.js` **and** to `VOCAB_WORDS` in `scripts/build-lookup.js`.
4. Run `node scripts/build-lookup.js` to regenerate `wlasl-urls.js`.
5. Commit: `app.js`, `wlasl-urls.js`, `scripts/build-lookup.js`.

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
├── index.html              ← layout
├── style.css               ← all styling
├── app.js                  ← all logic (vocabularyMap, stories+image, renderScene, fingerspell, video)
├── wlasl-urls.js           ← AUTO-GENERATED — run build-lookup.js, do not edit
├── WLASL_v0.3.json         ← local only, gitignored, never push to GitHub
├── HANDOVER.md             ← this file — update every session
├── .gitignore
├── assets/
│   ├── image/              ← per-story scene backdrops (home-kitchen.png)
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
- ~~Combine Explore + Read into one 3-column layout~~ → **kept 2-column + scene banner (Session 4).** Landscape Gemini images suit a wide top banner; 3-column deferred unless future images are portrait/square.
- ~~"Common phrases with" shows nothing~~ → replaced with "In context" (Session 3) → **replaced with the Fingerspell strip (Session 4).**
- ~~Scene art scaling~~ → **resolved (Session 4):** one Gemini-generated image per story, non-clickable backdrop, sourced in the Gemini app and dropped into `assets/image/`. Hotspots remain a possible later test.
