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

## Current state (as of 2026-05-25, Session 2)

### What's built and working

| File | Purpose | Status |
|---|---|---|
| `index.html` | Two-mode layout with Explore/Read toggle | ✅ Done |
| `style.css` | Swiss-minimal, mode toggle, story word highlights | ✅ Done |
| `app.js` | vocabularyMap, mode switch, story render, video fallback chain | ✅ Done |
| `wlasl-urls.js` | Auto-generated URL lookup, 14 words, 8.9KB | ✅ Done |
| `scripts/build-lookup.js` | Regenerates wlasl-urls.js from WLASL_v0.3.json | ✅ Done |
| `WLASL_v0.3.json` | Full 1999-word dataset, local only, gitignored | ✅ Present |
| `.gitignore` | Excludes WLASL JSON and .DS_Store | ✅ Done |

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
- [ ] Add 1-2 more stories (e.g. "At the Doctor", "Going to School") — just add to `stories` array in app.js + run build-lookup.js for new words
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
    └── build-lookup.js     ← run after adding new words
```

---

## Open questions for Echo to decide

- **GitHub Pages deployment**: ready to go live whenever Echo wants — just needs `git push` and Pages enabled in repo settings. Add the URL to `ezhozhao.github.io`.
- **Second story topic**: "At the Doctor" would be strong for the accessibility/disability angle. "Going to School" is more neutral. Echo's call.
- **Phase 2 timing**: fingerspelling fallback is a significant feature — worth a dedicated session when Phase 1 is fully deployed.
