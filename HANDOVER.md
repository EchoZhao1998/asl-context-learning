# HANDOVER — ASL Context Learning

> Read this at the start of every new chat session before touching any code.
> Update this at the end of every session. It is the project's single source of truth.

---

## What this project is

An interactive web app for **late-deafened adult ESL learners** to learn ASL signs in real English context. Target user: post-lingually deaf adult whose first language is not English (e.g. Echo herself — native Chinese, completely deaf since 2025, learning ASL + English simultaneously).

**Two modes:**
- **Explore** — click objects in an illustrated scene to see their WLASL sign video + Datamuse context words
- **Read** — read short English story paragraphs; tap highlighted words to see their ASL sign

**Portfolio purpose:** Job-track outreach tool (LinkedIn, employer demos) at 70% priority. PhD backup at 30%. Keep it clean, fast, and demonstrable in under 30 seconds.

**What differentiates it from VL2 Storybook Apps (Gallaudet):** VL2 targets Deaf children's early literacy. This targets adult post-lingual ESL learners — an underserved profile no existing tool addresses directly.

---

## Current state (as of 2026-05-25, Session 3)

### What's built and working

| File | Purpose | Status |
|---|---|---|
| `index.html` | Unified single-screen layout (scene banner + story left, info/video right) — NO tabs | ✅ Done |
| `style.css` | Swiss-minimal, 2-column grid, scene banner, in-context highlight, responsive stack | ✅ Done |
| `app.js` | vocabularyMap, stories, sentenceIndex, shared click handler, video fallback chain | ✅ Done |
| `wlasl-urls.js` | Auto-generated URL lookup, 14 words, 8.9KB | ✅ Done |
| `scripts/build-lookup.js` | Regenerates wlasl-urls.js from WLASL_v0.3.json | ✅ Done |
| `scripts/lint-story.js` | NEW — author-first helper: checks draft text against WLASL coverage | ✅ Done |
| `WLASL_v0.3.json` | Full 2000-word dataset, local only, gitignored | ✅ Present |
| `.gitignore` | Excludes WLASL JSON and .DS_Store | ✅ Done |

### Session 3 changes (decisions made WITH Echo)
- **Layout merged.** Dropped the Explore/Read tabs. One screen: left column = clickable scene banner above the story narration; right column = shared info/video panel. Clicking a scene object OR a story word both drive the same panel. (Chosen over a 3-column layout because we don't yet have one scene illustration per story — revisit if/when we do.)
- **"Common phrases with" card removed.** The Datamuse `lc` lookup returned mostly empty. Replaced with an **"In context"** card: shows the source sentence containing the clicked word, with that word highlighted. Reinforces the context-learning thesis. Source sentence comes from `sentenceIndex` (built from the `stories` array at load).
- **Story strategy = author-first + linter.** Rejected mass auto-generation (most of the 2000 WLASL glosses are function/abstract words, and auto-stories read poorly for the target learner). Instead: write natural narrations by hand, then run `lint-story.js` to see which words ASL can cover.

---

## ▶ NEXT CHAT — Session 4 build brief (decided WITH Echo 2026-05-25, not yet built)

Start a fresh chat for this work (it's the Phase 2 fingerspelling engine + a new image direction — both are this file's stated triggers for a new chat). Paste this brief + `git log --oneline -10`.

**1. Layout: bigger scene as a Gemini-generated backdrop.**
- Generate ONE scene image per story (Gemini). It is a **backdrop for context only** — NOT clickable. A raster PNG has no object structure, so we deliberately do NOT try to make objects on the image clickable (avoids per-scene hotspot coordinate math).
- Clickable vocabulary stays in the **story prose** (blue underlined words = the clear affordance). This resolves Echo's "users won't find the trick" worry — there is no hidden trick.
- Give the image much more space; tighten the story (render as a flowing paragraph, not one line per sentence) to kill the excess whitespace. With per-story images now available, the 3-column layout (narration | image | video) Echo originally wanted is back on the table — consider it.
- **OPEN (decide in Session 4): how to source images** — (a) Echo generates in the Gemini app and drops PNGs into `assets/`, or (b) an automated image-gen connector/pipeline. Lean toward (a) for a static GitHub Pages site (no API keys in browser). Check the connector registry if (b) is wanted.

**2. Replace the "In context" card with a fingerspelling strip.**
- "In context" is redundant — it echoes the sentence already visible on screen. Remove it.
- New card: spell the clicked word in the **ASL manual alphabet** (A–Z handshape images). Additive, teaches fingerspelling, useful for no-sign words / proper nouns, and is the on-ramp to the Phase 2 fingerspelling engine.
- Cost: need 26 openly-licensed handshape images. **v1 fallback** if sourcing is slow: show/link a single ASL-alphabet reference chart in that card; do per-word spelling as v2.

**3. Fix the "← Back" button.**
- It's a leftover from the old tabbed design and is meaningless in the single-screen layout. Replace with a small **"×" to deselect** the current word (dismiss the panel back to idle).

### Vocabulary (14 words)
Scene: `apple`, `chair`, `table`, `glass`, `knife`
Story: `kitchen`, `hungry`, `water`, `morning`, `eat`, `drink`, `food`, `cup`, `bread`

### Current story
**"A Morning in the Kitchen"** — 5 sentences using all 14 words. Lives in `stories` array in `app.js`.

### How the video loading works
`tryVideoUrls(word)` walks through `WLASL_URLS[word]` array silently, skipping CORS/404 failures until one plays. Note shown only on total failure.

---

## Architecture decisions and why

| Decision | Reason |
|---|---|
| `<span data-word>` for story words, not SVG hotspots | Zero coordinate math, naturally responsive, easily extended by typing |
| Single info panel shared by both modes | Same UX flow regardless of mode — less to learn |
| Mode toggle in header (Explore / Read) | Clean, non-destructive — no code thrown away |
| Pre-built `wlasl-urls.js`, not runtime JSON parse | WLASL JSON is 12MB — too heavy for browser |
| `data-word` attribute on SVG groups | Unified with story-word data model; same `handleWordClick(word)` used everywhere |
| ASL (not Auslan/BIM) | Echo learning ASL personally; ASL/BIM structural overlap is a partial advantage |
| Target user locked to Option A | Late-deafened adult ESL learner — underserved, differentiable, Echo IS the user |

---

## Roadmap

### Phase 1 — Current (polished demo) ✅
- [x] Scene (Explore) mode with 5 clickable objects
- [x] Story (Read) mode with 1 kitchen story
- [x] Shared info panel: word title, ASL video, context words, collocations
- [x] Mode toggle in header
- [x] Video fallback chain across multiple WLASL sources

### Phase 1 remaining (do next session)
- [ ] Add 1-2 more stories (e.g. "At the Doctor", "Going to School"). NEW workflow: draft the narration as plain text → run `node scripts/lint-story.js draft.txt` → add coverable words to `vocabularyMap` + the `stories` array (wrap them in `{word}`) → add the same words to `VOCAB_WORDS` in build-lookup.js → run `node scripts/build-lookup.js`. (Linter already validated: "At the doctor…" draft → doctor/insurance/card/appointment coverable, "lobby" → fingerspell.)
- [ ] Per-story scene art: a 2nd story currently reuses the kitchen banner. Decide how scenes scale (one SVG/image per story) — this is the gate for moving to the 3-column layout.
- [ ] GitHub Pages deployment — one push, then add URL to LinkedIn / portfolio site
- [ ] Test video playback across all 14 words; note any persistent failures
- [ ] Add loading spinner while video tries sources (replace "Loading…" text)

### Phase 2 — Smart fallback for unknown words
If a clicked word is NOT in WLASL, trigger a fingerspelling engine (CSS cross-fade A→B→C letter images or Lottie). Makes app work for *any* English word, not just WLASL's 1999.

### Phase 3 — Scale (don't plan yet)
- More scenes (bedroom, classroom, street) — each scene = 1 background image + story JSON, no hand-coded SVG
- Word clustering by domain (food, body, school, work) for progressive disclosure
- Node/graph word visualization as a separate view (very different product — don't mix)

---

## Workflow for adding a new story

1. Add a new object to the `stories` array in `app.js`:
   ```js
   { id: 'at-the-doctor', title: 'At the Doctor', scene: 'Health · Clinic', sentences: [...] }
   ```
2. Wrap WLASL words in `{word}` inside sentences
3. Add new words to `vocabularyMap` in `app.js`
4. Run `node scripts/build-lookup.js` to update `wlasl-urls.js`
5. Commit: `app.js`, `wlasl-urls.js`, `scripts/build-lookup.js`

## Workflow for a new chat session

1. **Read this file first**
2. Run `git log --oneline -5` to see what changed since last session
3. Ask Echo what she wants to focus on
4. Update this file at end of session

---

## When to start a new chat

- This chat is now moderately loaded (two full build sessions, large files read)
- **Start a new chat when:** adding Phase 2 fingerspelling engine, deploying to GitHub Pages, or doing any session that requires reading large new files
- Hand the new chat: this HANDOVER.md + `git log --oneline -10`

---

## File map

```
asl-context-learning/
├── index.html              ← layout + mode toggle
├── style.css               ← all styling
├── app.js                  ← all logic (vocabularyMap, stories, modes, video)
├── wlasl-urls.js           ← AUTO-GENERATED — run build-lookup.js, do not edit
├── WLASL_v0.3.json         ← local only, gitignored, never push to GitHub
├── HANDOVER.md             ← this file — update every session
├── .gitignore
├── assets/
│   ├── videos/             ← local mp4 fallback (optional, empty for now)
│   └── svgs/               ← spare folder
└── scripts/
    ├── build-lookup.js     ← run after adding new words
    └── lint-story.js       ← run on a draft to see WLASL coverage (author-first)
```

---

## Open questions for Echo to decide

- **GitHub Pages deployment**: ready to go live whenever Echo wants — just needs `git push` and Pages enabled in repo settings. Add the URL to `ezhozhao.github.io`.
- **Second story topic**: "At the Doctor" would be strong for the accessibility/disability angle. "Going to School" is more neutral. Echo's call.
- **Phase 2 timing**: fingerspelling fallback is a significant feature — worth a dedicated session when Phase 1 is fully deployed.

## Echo's notes — RESOLVED in Session 3

- ~~Second story / process all WLASL words into stories~~ → **Decided: author-first.** Don't generate stories from the 2000 glosses (most are function/abstract words; auto-stories read poorly). Write the narration first, then `lint-story.js` reports coverage. Scene backgrounds still need a scaling decision (one per story) before going 3-column.
- ~~Combine Explore + Read into one 3-column layout~~ → **Decided: merged to one screen, but 2-column + scene banner** (narration left, video right, scene banner on top of the left column). 3-column deferred until every story has its own scene art.
- ~~"Common phrases with" shows nothing — delete or replace?~~ → **Decided: replaced with "In context"** — shows the source sentence with the clicked word highlighted. Better pedagogy than Datamuse phrases.

## Open question carried forward
- **Scene art scaling.** The unified layout reuses the kitchen banner for now. Before adding more stories with their own scenes, decide: hand-built SVG per scene (doesn't scale), one illustration image per scene (clickable hotspots), or keep narration-first with a lighter decorative banner. This decision unlocks the 3-column layout if Echo still wants it.
