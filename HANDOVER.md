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

## Current state (as of 2026-05-25 — Session 4 starting in this chat)

Repo is clean (`git status` empty), sitting on the Session 3 commit:

```
git log --oneline -5
548cf0b Session 3: unified single-screen layout, in-context card, story linter; Session 4 brief
9ab6cb9 commend on first stage handover. Discuss how to handle the data to assist narration, and the layout.
01ff35c build the MVP
d0c4f2e Claude first draft
1227c7a Initial commit
```

### Built and working

| File | Purpose | Status |
|---|---|---|
| `index.html` | Unified single-screen layout (scene banner + story left, info/video right) — NO tabs | ✅ Done |
| `style.css` | Swiss-minimal, 2-column grid, scene banner, in-context highlight, responsive stack | ✅ Done |
| `app.js` | vocabularyMap, stories, sentenceIndex, shared click handler, video fallback chain | ✅ Done |
| `wlasl-urls.js` | Auto-generated URL lookup, 14 words, ~9KB | ✅ Done |
| `scripts/build-lookup.js` | Regenerates wlasl-urls.js from WLASL_v0.3.json | ✅ Done |
| `scripts/lint-story.js` | Author-first helper: checks draft text against WLASL coverage | ✅ Done |
| `WLASL_v0.3.json` | Full 2000-word dataset, local only, gitignored | ✅ Present |
| `.gitignore` | Excludes WLASL JSON and .DS_Store | ✅ Done |

**Asset state (relevant to Session 4):** `assets/svgs/` and `assets/videos/` are both **empty**. There is no scene image and no fingerspelling handshape images yet — Session 4 tasks 1 and 2 both start from zero assets.

### Session 3 changes (decided WITH Echo)
- **Layout merged.** Dropped the Explore/Read tabs. One screen: left column = scene banner above the story narration; right column = shared info/video panel. Clicking a scene object OR a story word both drive the same panel. (Chosen over 3-column because we didn't yet have one scene illustration per story.)
- **"Common phrases with" card removed.** The Datamuse `lc` lookup returned mostly empty. Replaced with an **"In context"** card showing the source sentence containing the clicked word, that word highlighted. Source sentence comes from `sentenceIndex` (built from the `stories` array at load).
- **Story strategy = author-first + linter.** Rejected mass auto-generation (most of the 2000 WLASL glosses are function/abstract words and auto-stories read poorly). Instead: write narrations by hand, then run `lint-story.js` to see which words ASL can cover.

---

## ▶ Active work — Session 4 (building now in this chat)

Three build tasks, decided WITH Echo 2026-05-25.

### Task 1 — Bigger scene as a generated backdrop
- One scene image per story. **Echo generates it in the Gemini app and drops the PNG into `assets/`** (decided — keeps the static GitHub Pages site free of API keys).
- For v1 the image is a **context-only backdrop, NOT clickable** (a raster PNG has no object structure, so we avoid per-scene hotspot coordinate math). **Echo's note:** this is a plan to test — once we see how easy the generated image is to handle and how well it composes, we may revisit and add hotspots on the image in a later pass.
- Clickable vocabulary stays in the **story prose** (blue underlined words = the clear affordance). This resolves Echo's "users won't find the trick" worry — there is no hidden trick.
- Give the image much more space; tighten the story (render as a flowing paragraph, not one line per sentence) to kill excess whitespace.
- With a per-story image now available, the **3-column layout (narration | image | video)** Echo originally wanted is back on the table — decide during this session (see decisions below).

### Task 2 — Replace the "In context" card with a fingerspelling strip
- "In context" is redundant (it echoes the sentence already on screen). Remove it.
- New card: spell the clicked word in the **ASL manual alphabet** (A–Z handshape images). Additive — teaches fingerspelling, covers no-sign words / proper nouns, and is the on-ramp to the Phase 2 fingerspelling engine.
- Need 26 openly-licensed handshape images. **v1 fallback** if sourcing is slow: show/link a single ASL-alphabet reference chart in that card; do per-word spelling as v2.

### Task 3 — Fix the "← Back" button
- Leftover from the old tabbed design; meaningless in the single-screen layout.
- Replace with a small **"×" to deselect** the current word (dismiss the panel back to idle).

### Decisions to settle before / during coding
1. **Image sourcing — RESOLVED:** Echo generates the scene image in Gemini and drops the PNG into `assets/`. No connector/API pipeline. (Hotspot-on-image is a possible *later* enhancement to test — see Task 1 note.)
2. **3-column layout — open:** now that the story can have its own image, move to narration | image | video, or keep 2-column + banner?
3. **Handshape images — open:** v1 fallback (single reference chart) vs. sourcing all 26 letters now.
4. **Second story topic — open (carried over):** "At the Doctor" is strong for the accessibility/disability angle; "Going to School" is more neutral. Linter already validated an "At the Doctor…" draft (doctor/insurance/card/appointment coverable, "lobby" → fingerspell).

### Suggested build order
3 → 2 → 1 (smallest/safest first: the "×" button, then the fingerspelling card, then the larger layout + image change), committing after each. Task 1's layout/image work can land once Echo provides the first Gemini PNG.

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
- [ ] Session 4 tasks 1–3 (above)
- [ ] Add 1–2 more stories. Workflow: draft narration as plain text → `node scripts/lint-story.js draft.txt` → add coverable words to `vocabularyMap` + the `stories` array (wrap in `{word}`) → add the same words to `VOCAB_WORDS` in `build-lookup.js` → run `node scripts/build-lookup.js`.
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
├── app.js                  ← all logic (vocabularyMap, stories, video)
├── wlasl-urls.js           ← AUTO-GENERATED — run build-lookup.js, do not edit
├── WLASL_v0.3.json         ← local only, gitignored, never push to GitHub
├── HANDOVER.md             ← this file — update every session
├── .gitignore
├── assets/
│   ├── videos/             ← local mp4 fallback (optional, empty for now)
│   └── svgs/               ← spare folder (Gemini scene PNGs will land in assets/)
└── scripts/
    ├── build-lookup.js     ← run after adding new words
    └── lint-story.js       ← run on a draft to see WLASL coverage (author-first)
```

---

## Resolved in earlier sessions (kept for context)

- ~~Process all WLASL words into stories~~ → **author-first.** Most of the 2000 glosses are function/abstract words; auto-stories read poorly. Write narration first, then `lint-story.js` reports coverage.
- ~~Combine Explore + Read into one 3-column layout~~ → **merged to one screen, 2-column + scene banner.** 3-column deferred until every story has its own scene art — re-opened in Session 4 now that Gemini images are available.
- ~~"Common phrases with" shows nothing~~ → **replaced with "In context."** (Itself being replaced by the fingerspelling strip in Session 4.)
- ~~Scene art scaling~~ → **resolved into Session 4 Task 1:** one Gemini-generated image per story, non-clickable backdrop for v1, with hotspots as a possible later test.
