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

## Current state (as of 2026-05-27 — Session 7 vocab wiring done, all 6 stories fully clickable)

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
| `app.js` | Logic only after Session 6: DOM wiring, render, click handler, fingerspell, modal, video, dev-only validator. Reads VOCABULARY / STORIES / SCENE_BUILDERS as globals. | ✅ Done |
| `data/vocabulary.js` | VOCABULARY global — clickable-word registry (was inline `vocabularyMap` in app.js). | ✅ Done |
| `data/scenes.js` | SCENE_BUILDERS global — one inline-SVG builder per scene (kitchen + clinic). | ✅ Done |
| `data/stories.js` | STORIES global — all 6 narrations with extended schema (`category`, `difficulty`, `targetWords`). | ✅ Done |
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

## Session 5 — "At the Doctor" built (2026-05-26)

Second story shipped. Multi-story switcher added. Both stories live side-by-side, picked from a `<select>` at the top of the story column.

### What got built
- **`stories` array** now has two entries. The doctor story is 11 sentences; every coverable word from the lint run is wrapped in `{...}` so it's clickable, plus the three deaf-experience-specific words `mask`, `lips`, `sentences` (the differentiation moment). Sentence-initial words that would need capitalization (`Soon`, `Because`, `She`, `I`, `This`) are left un-bracketed.
- **`vocabularyMap`** extended with 43 new entries: 40 WLASL-covered + 3 fingerspell-only (`mask`, `lips`, `sentences`, all marked `fingerspellOnly: true`). All clickable in the prose; the three fingerspell-only ones still get the `.has-sign` blue underline and surface the fingerspell strip on click (video panel shows "not in WLASL dataset" — honest fallback).
- **`VOCAB_WORDS`** in `scripts/build-lookup.js` extended with the 40 coverable words; `wlasl-urls.js` regenerated (now ~36KB, all 40 resolved with 6–18 mp4 URLs each).
- **`sceneBuilders.clinic`** added. 6 interactive objects keyed to story words: `door`, `bed`, `chair`, `temperature` (thermometer), `mask`, `phone`. Same visual register as the kitchen — gradients (wall, floor, bed pad/sheet, door, mask, phone, thermometer mercury), soft window light, floor shadow, hover-glow, labels above each object. Decorative non-interactive elements: wall clock and a medical-cross poster.
- **Multi-story switcher (smallest viable):** `<select id="story-selector">` rendered by `renderStorySelector()` at the top of `.story-panel`. Changing it calls `setStory(i)` which updates `currentStoryIndex`, re-renders the scene and narration, re-wires listeners, and resets the info panel.
- **`renderScene()` and `renderStories()` → `renderStory()`** are now parameterized by `currentStoryIndex` instead of being hard-coded to `stories[0]`. Only one story renders at a time.

### Verification
`node scripts/test-doctor-story.js` — new jsdom test, all assertions pass:
- Selector populated with both stories
- Kitchen renders by default; switching to doctor re-renders scene + narration
- Clinic SVG exposes exactly the 6 expected interactive objects
- 28 prose words verified clickable (incl. `mask`, `lips`, `sentences`)
- Clicking a scene object surfaces `info-active` with the correct word title
- Clicking a fingerspell-only word (`mask`) sets word title + fingerspell tiles + "not in WLASL dataset" video note
- Switching back to kitchen restores the original SVG and title

### Decisions made (formerly "open" in the prior handover)
- **Multi-story navigation:** chose `<select>` dropdown over tabs/columns. Stays compact past 3+ stories. Lives at the top of `.story-panel`.
- **`mask`/`lips`/`sentences` clickability:** included as `fingerspellOnly: true` entries in `vocabularyMap`. They render as `.has-sign` (blue underline) and surface the fingerspell strip on click. The video note explains they're not in WLASL — this is honest and pedagogically correct.
- **26 handshape images:** still deferred. The fingerspell strip auto-upgrades the moment `a.png … z.png` land in `assets/fingerspell/`.

### Still open
- **Sentence-initial clickability** (`Soon`, `Because`): currently un-bracketed because the `{...}` parser is case-sensitive and `vocabularyMap` keys are lowercase. Acceptable for now — small loss. Fix later by lowercasing inside `parseStory` before the lookup, or by tagging the first letter separately.
- **Long-run scene art** still TBD past ~3–4 stories (per Session 4 note). The clinic is hand-built; adding a third scene by hand is fine, but a fourth pushes the limit.
- **`ASL.webp` copyright** still unresolved — same as before, swap before public deploy.

---

## Session 5 follow-up — Gemini collaboration plan (2026-05-27)

Echo brought a Gemini-authored refactor proposal (`Portofilo/Gemini5.md`). Proposal: replace hand-built SVG scenes with a flat 16:9 background image + absolutely-positioned invisible HTML hotspot buttons (the "Invisible Hotspot Grid"). The architecture is sound and is the standard scalable answer to the scene-art ceiling, BUT we did not apply it. Two reasons recorded:

1. **It silently reverts Session 4's deliberate choice** (commit `38192fb`). The Gemini-raster backdrop was rejected because it read VL2/Gallaudet-style and lost the hover-to-glow demo moment (the 30-second hook for hiring-manager outreach). Gemini hadn't read this HANDOVER, so its proposal re-introduces what we rejected. Decision must be made consciously, not by drift.
2. **Invisible hotspots = no visible affordance.** A first-time visitor who doesn't hover over the right pixels sees a static picture. The proposal's hover-border is not enough. If we adopt the architecture, it MUST come with visible affordances (numbered pins / pulsing dots / shimmer-on-load) — otherwise we trade away the demo moment.

Also flagged in the proposal:
- Hotspot coordinates are hallucinations (images don't exist yet — every coord will need hand-calibration after PNGs are generated).
- The "Tiered Fallback Engine" copy is marketing-ish, not honest (`"Fluid sign unavailable. Displaying fingerspelling sequence engine fallback."` — there is no engine, only the existing static letter strip). Strip and rewrite in Echo's voice if adopting.
- No new fallback behavior actually added — it's a relabel of what exists.
- Test (`scripts/test-doctor-story.js`) asserts `.interactive-object` and `<svg>` — will break and needs updating.

### Collaboration model — lanes, not mixed
- **Gemini:** scene art (image generation), scenario drafts, image-generation prompts. Multimodal generation is its actual strength.
- **Claude:** code refactors, tests, HANDOVER discipline, calling out when a proposal contradicts a past decision. Persistent project memory lives here, not in Gemini.
- **Echo:** author + arbiter. When the two AIs disagree, you decide.
- **Rule:** Gemini code/architecture proposals are *briefs*, not patches. They go to Claude, get checked against HANDOVER + tests + past decisions, then execute. Mixing Gemini into the code lane causes silent reversions like Session 4-redux.

### Scenario tone rules (locked from the doctor draft — give to Gemini before drafting)
- First-person ("I sit...", "I feel...", "I keep my eyes on the door...")
- Factual, matter-of-fact register. The friction moment is described without emphasis (e.g. "the kind doctor pulls down her mask so I can see her lips" — no italics, no exclamation, no narration about how kind that was).
- Ends in agency or neutrality. *NOT* in tragedy, gratitude-to-the-hearing-person, or moral lesson. The doctor story ends in "safe" — Echo's word, Echo's frame.
- No inspiration porn. If a hearing reader feels admiration or pity, the draft has slipped. The goal is the *window*, not the lesson.
- A vocabulary cluster per scenario — each scenario teaches a coherent semantic neighborhood (medical, transit, food-service, work, emergency, intimate-relational).

---

## Session 6 — Data refactor + six scenarios wired (2026-05-27)

ChatGPT (`Portofilo/chatGPT0527.md`) flagged the drift between `stories.md` (6 scenarios) and `app.js` (2). This session was the architecture-first response to that gap: split data from logic, add a validator, wire all six stories — defer the scene-art question to a later session.

### What got built
- **File split.** The three big literals (`vocabularyMap`, `stories`, `sceneBuilders`) moved out of `app.js` into a new `data/` folder. `app.js` is now logic only (~250 lines vs ~620 before) and reads each as a global. Script-tag loading order in `index.html`: `wlasl-urls.js` → `data/vocabulary.js` → `data/scenes.js` → `data/stories.js` → `app.js`. No frameworks, no ES modules, no bundler. File:// preview still works.
- **Extended story schema.** Each story now carries `category` (home / health / travel / food / education / communication), `difficulty` (all `beginner` for now — placeholder slot for a future learning-path UI), and `targetWords` (the "vocabulary cluster" per the HANDOVER tone rule). For Doctor and the four new scenarios, `targetWords` = the bold-marked words from `stories.md`. For Kitchen (no bold source), the scene-interactive vocab doubles as the cluster.
- **Four new stories wired data-only.** Airport / Restaurant / Classroom / Phone are now in `STORIES`. Their narrations come from `stories.md`; each bolded word is `{token}`-wrapped so it renders as a clickable span. **No scene builders yet** — `renderScene()` gracefully hides the banner when `story.sceneBuilder` is absent, so the narration occupies the full left column. Their vocab is intentionally NOT in VOCABULARY — see validator below.
- **Dev-only validator.** New `validateStoryWords()` runs at boot, scans every `{token}` in every story, and console-warns about words missing from VOCABULARY, grouped by story. Also lists orphan VOCABULARY entries that no story uses. Gated to `localhost` / `127.0.0.1` / `file:` so GitHub Pages visitors don't see it. Output on first load:
  ```
  At the Airport: airport, bag, passport, ticket, people, screen, look, gate, walk, write, seat, plane
  The Restaurant Dinner: restaurant, family, menu, rice, chicken, order
  The Classroom Group Project: class, students, teacher, group, project, computer, paper, books, write, question, help, read
  The Automated Phone Barrier: problem, bank, number, computer, time, questions, person
  1 VOCABULARY entry is unused by any story: soon
  ```
  The "soon" orphan is the Session 5 sentence-initial-clickability gap (`Soon, the {nurse}…` — capital S, lowercase vocab key) — validator surfaces it correctly. Carried as-is; not in scope for this session.

### What was preserved (explicit, per chatGPT0527.md constraints)
- Clickable words (story-word spans + interactive-object SVG groups, single shared `handleWordClick`)
- WLASL video fallback chain (`tryVideoUrls`)
- Fingerspell fallback (strip + alphabet modal)
- Story selector (`<select>` with all 6 options)
- Accessibility attributes (`role="button"`, `tabindex="0"`, `aria-label`, modal `aria-modal` + focus)
- UI: no redesign
- Styling: no `style.css` changes
- No frameworks, no bundler

### Verification
`node scripts/test-doctor-story.js` updated to cover the refactor — 50+ assertions, all pass:
- VOCABULARY / SCENE_BUILDERS / STORIES globals all present, STORIES has 6 entries
- Selector populated with all 6 stories in correct order
- Kitchen + clinic still render with their 6 interactive objects each
- Doctor differentiation words (`mask`, `lips`, `sentences`) still clickable + `.has-sign`
- Click flow (scene object + fingerspell-only story word) still wires correctly
- **New:** switching to Airport (no `sceneBuilder`) hides the scene banner and still renders clickable prose — confirms the graceful-fallback path
- **New:** the validator fires and warns about the four new scenarios' missing vocab — confirms the warning loop is wired

### Carried forward / still open
- **Vocab + WLASL coverage for the 4 new stories.** Currently the bolded words render as `.no-sign` (clickable spans without underline / sign video). To wire one up: (1) add an entry to `data/vocabulary.js`, (2) add the gloss to `VOCAB_WORDS` in `scripts/build-lookup.js`, (3) re-run it. Lint each new scenario first with `node scripts/lint-story.js stories.md` to find what WLASL actually covers vs what falls to fingerspell-only.
- **Scene art for the 4 new stories.** Open — same question as before (hand-built SVG, flat-image + hotspot grid per Gemini5, or hybrid). The data-only render is a deliberate "good enough for now" so the next session can focus on this one question without also fighting the data split.
- **Sentence-initial words** (`Soon`, `Because`, `She`, `I`, `This`): still not clickable for the same case-sensitivity reason as before. The validator now surfaces this as an orphan. Fix is one line in `parseStory` (lowercase before lookup); deferred.
- **`ASL.webp` copyright** still unresolved — swap before public deploy.

### Decisions made this session (so they don't get re-litigated)
- **Module style:** plain script tags + globals (not ES modules). Reasons: preserves file:// preview, the jsdom test already used `window.eval`, aligns with the "no frameworks" rule. ES modules would have required a local HTTP server for preview and a more invasive test rework.
- **Scope for the 4 new scenarios:** data-only this session. Their vocab and scenes are explicitly deferred so the architecture work landed cleanly without bundling in a vocab-expansion task that needs `WLASL_v0.3.json` and your judgment on each word.
- **`targetWords` source:** the bolded words in `stories.md` verbatim. Honest signal of authorial intent rather than my guess at a "lesson cluster."
- **Validator scope:** local-dev-only console warnings. Considered failing loudly in the UI but rejected — silent in production, loud in dev is the right loop. No new dependencies.

---

## Session 7 — Vocab + WLASL wiring for the 4 new stories (2026-05-27)

Echo picked the "wire vocab + WLASL" chunk from the carried-forward list. Pure data work, no architectural decisions touched — bridges the gap between Session 6's data refactor and the still-open scene-art question.

### What got built
- **35 new `VOCABULARY` entries** in `data/vocabulary.js`, grouped + commented by story (Airport / Restaurant / Classroom / Phone). Split: **22 WLASL-covered** + **13 `fingerspellOnly: true`**.
- **22 new `VOCAB_WORDS`** appended to `scripts/build-lookup.js`, sectioned per story.
- **`wlasl-urls.js` regenerated** — now 76 total words, ~51 KB (was 14 words / ~9 KB pre-Session-5, then ~36 KB after Doctor). Every new gloss resolved to 4–18 direct mp4 URLs.

### Per-story coverage (from `node scripts/lint-story.js`)

| Story | Coverable (WLASL video) | Fingerspell-only |
|---|---|---|
| Airport (13) | ticket, people, walk, write, phone | airport, bag, passport, screen, look, gate, seat, plane |
| Restaurant (12) | table, restaurant, family, hungry, food, chicken, water, order, phone, eat | menu, rice |
| Classroom (13) | class, teacher, group, project, table, computer, paper, write, question, help, read | students, books |
| Phone (9) | problem, bank, phone, number, computer, call, time, person | questions |

Some words appear in multiple coverage lists (e.g. `phone`, `table`, `write`) — they're already-defined entries from prior stories, reused. Net new words across the four stories: **35** (22 covered + 13 fingerspell-only).

### Decisions made (so they don't get re-litigated)
- **Plurals kept as fingerspell-only.** `questions` / `students` / `books` are plural; the singulars (`question` / `student` / `book`) are likely in WLASL. We left them as plural to match the authored narration rather than silently rewrite Echo's voice. Swap to singular forms later if you'd prefer video over fingerspell here — it's a one-line change in each narration.
- **Institutional travel vocab as fingerspell-only.** `airport`, `gate`, `passport`, `seat`, `plane`, `bag`, `screen`, `look` are all not in WLASL. Accepted as fingerspell-only — this is itself an honest signal of the deaf-traveler experience (institutional signage is largely fingerspelled in practice), and it stress-tests the strip on a scenario where it carries more of the load.
- **No story rewrites.** The narrations from Session 6 stand as-is. The only changes this session were under `data/vocabulary.js` and `scripts/build-lookup.js` + the regenerated `wlasl-urls.js`. `data/stories.js`, `app.js`, `style.css`, `index.html` untouched.

### Verification
`node scripts/test-doctor-story.js` — extended with **15 new assertions**, all 70+ pass:
- Airport: `airport` flipped from `.no-sign` → `.has-sign` (was the explicit "no vocab yet" test in S6). `walk` is `.has-sign`.
- Airport: click `walk` (covered) → word-title `WALK`, no "not in WLASL" fallback. Click `airport` (fingerspell-only) → 7 fingerspell tiles + "not in WLASL" note.
- Restaurant / Classroom / Phone: one covered word + one fingerspell-only word each verified `.has-sign`.
- **Validator assertions flipped**: previously asserted that warnings fired for the 4 new stories; now asserts the four warnings are **absent** (all `{token}` words have VOCABULARY entries).

### Carried forward / still open
- **Scene art for the 4 new stories.** Untouched this session — still the next session's question. See §"Next chat" below.
- **Sentence-initial words** (`Soon`, `Because`, `She`, `I`, `This`): still not clickable. `soon` continues to surface as an orphan VOCABULARY entry in the validator info line.
- **`ASL.webp` copyright** still unresolved — swap before public deploy.
- **Long-run scene-art approach** (3+ stories beyond kitchen + clinic) — still open, still wants peer/professor input.
- **Handshape images** `a.png … z.png` still absent.

---

## ▶ Next chat — Scenario series + flat-image refactor (Session 8)

Discrete chunk. Hand to a fresh chat with this HANDOVER + `git log --oneline -10` + the inputs below.

### Inputs needed before code starts
1. **4–6 scenario drafts** authored with Gemini, edited by Echo to match the tone rules above. Drop into `stories.md` (or new `scenarios.md`). Doctor is #1 done; suggested next set: airport / restaurant / job interview / phone call / ER. Stop at 6.
2. **One Gemini-generated PNG per scenario** in `assets/scenes/{id}.png`. 16:9 aspect ratio, ~1920×1080 or similar. Visual register: cleaner than the Session 4 attempt — flatter, more Swiss/illustrative, less "comic-book." Gemini prompt should specify "minimalist Swiss illustration, soft lighting, no human figures (or stylized silhouettes only), recognizable scene objects."
3. **Lint each draft:** `node scripts/lint-story.js scenarios.md` → captures coverable / fingerspell breakdown per story.

### Open decisions to nail down BEFORE the refactor
- **Demo affordance:** numbered pins on each hotspot? Pulsing dots? One-time shimmer animation on scene-load? Pick one. Without it, the architecture trades away the 30-second demo moment.
- **Architecture scope:**
  - *Option A — full flat-image refactor:* rebuild kitchen + clinic as PNGs too. Consistent, but throws away the polished SVGs.
  - *Option B — hybrid:* keep kitchen + clinic SVGs as "hero" demo scenes; flat-image for scenarios 3-6. Preserves Session 4 + unlocks scale. (Claude recommends this.)
- **Scenario authorship voice:** before Gemini drafts, paste the *Scenario tone rules* section above into the Gemini prompt verbatim. Edit every draft against those rules.

### Build steps (once inputs are in and decisions locked)
1. Decide demo affordance + which scenes get the flat-image treatment.
2. Add `imgUrl` + `hotspots` fields to story objects. If hybrid: keep `sceneBuilder` field for kitchen + clinic; new scenes use the new fields.
3. Refactor `renderScene()` to branch: if story has `sceneBuilder` → existing SVG path; if `imgUrl` + `hotspots` → new flat-image + hotspot-button path.
4. CSS: add `.scene-wrapper` (16:9, `aspect-ratio: 16/9`), `.scene-img`, `.interactive-hotspot` per Gemini's CSS — BUT add the visible affordance (pins/dots/shimmer) decided above. Strip marketing-ish copy.
5. Per-scenario: extend `vocabularyMap` + `VOCAB_WORDS`, regenerate `wlasl-urls.js`, calibrate hotspot percentage coords against the actual PNG (browser inspector → measure → paste in).
6. Update `scripts/test-doctor-story.js` to cover both rendering paths (SVG path + hotspot path).
7. Update HANDOVER: file map, vocabulary, roadmap, file map adds `assets/scenes/`.
8. Commit per scenario or in one batch — Echo's call.

### Goal for the MVP send-out
4–6 scenarios live, fingerspell strip handling the long-tail vocab, GitHub Pages deployed, link sent to professors with a one-paragraph framing of the differentiation (adult deaf ESL learner, real-life friction moments, why this isn't VL2). Professors get to suggest what's missing or wrong.

---

## Vocabulary & stories

**Vocabulary (92 entries across six stories — 76 WLASL-covered + 16 fingerspell-only).** Count by source story; words shared across stories aren't double-counted.

Kitchen story (14 words):
- Scene (clickable in the SVG): `apple`, `chair`, `cup`, `glass`, `knife`, `table`
- Story-only: `bread`, `drink`, `eat`, `food`, `hungry`, `kitchen`, `morning`, `water`

Doctor story (43 new words):
- Scene (clickable in the SVG): `bed`, `chair` (shared), `door`, `mask`*, `phone`, `temperature`
- Story-only (WLASL-covered): `doctor`, `sit`, `tall`, `quiet`, `hospital`, `room`, `feel`, `very`, `sick`, `tired`, `today`, `keep`, `eyes`, `because`, `cannot`, `hear`, `name`, `nurse`, `call`, `enter`, `deaf`, `down`, `see`, `explain`, `bad`, `winter`, `cold`, `go`, `home`, `warm`, `rest`, `comfortable`, `type`, `visit`, `safe`
- Story-only (fingerspell-only, `fingerspellOnly: true`): `lips`*, `sentences`*

\* The differentiation moment vs. VL2-style apps: *"the kind doctor pulls down her **mask** so I can see her **lips**. She writes **sentences** on a notepad."*

Airport story (12 new words — no `sceneBuilder` yet):
- WLASL-covered: `ticket`, `people`, `walk`, `write`
- Fingerspell-only: `airport`, `bag`, `passport`, `screen`, `look`, `gate`, `seat`, `plane`
- Reused: `phone`

Restaurant story (6 new words — no `sceneBuilder` yet):
- WLASL-covered: `restaurant`, `family`, `chicken`, `order`
- Fingerspell-only: `menu`, `rice`
- Reused: `table`, `hungry`, `food`, `water`, `phone`, `eat`

Classroom story (11 new words — no `sceneBuilder` yet):
- WLASL-covered: `class`, `teacher`, `group`, `project`, `computer`, `paper`, `question`, `help`, `read`
- Fingerspell-only: `students`, `books`
- Reused: `table`, `write`

Phone story (6 new words — no `sceneBuilder` yet):
- WLASL-covered: `problem`, `bank`, `number`, `time`, `person`
- Fingerspell-only: `questions`
- Reused: `phone`, `computer`, `call`

**Stories:**
1. "A Morning in the Kitchen" — 5 sentences. `sceneBuilder: 'kitchen'`.
2. "At the Doctor" — 11 sentences. `sceneBuilder: 'clinic'`.
3. "At the Airport" — 9 sentences. No `sceneBuilder` (narration full-width).
4. "The Restaurant Dinner" — 7 sentences. No `sceneBuilder`.
5. "The Classroom Group Project" — 7 sentences. No `sceneBuilder`.
6. "The Automated Phone Barrier" — 6 sentences. No `sceneBuilder`.

**How video loading works:** `tryVideoUrls(word)` walks through `WLASL_URLS[word]` silently, skipping CORS/404 failures until one plays. A note is shown only on total failure. For `fingerspellOnly: true` entries, `WLASL_URLS` has no key — the note shows "not in WLASL dataset" immediately and the fingerspell strip carries the lesson.

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
- [x] Second story: "At the Doctor" + clinic scene + story switcher (done 2026-05-26)
- [x] Session 6 — data refactor + 4 new story drafts wired data-only (done 2026-05-27)
- [x] Session 7 — vocab + WLASL wiring for Airport / Restaurant / Classroom / Phone (done 2026-05-27)
- [ ] Swap `ASL.webp` for a CC/public-domain chart (or render our own) — required before public deploy
- [ ] Add handshape images `a.png … z.png` to `assets/fingerspell/` — upgrades the per-letter strip to real handshapes
- [ ] Scene art for the 4 new stories — flat-image + hotspot grid (Gemini5 proposal) vs hand-built SVG vs hybrid. Open question, queued for Session 8.
- [ ] Long-run scene-art approach (3+ stories) — ask peers/professors
- [ ] Sentence-initial clickability (`Soon`, `Because`, …) — one-line fix in `parseStory` (lowercase before lookup)
- [ ] GitHub Pages deployment
- [ ] Test video playback across all 76 WLASL-covered words; note persistent failures
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
├── index.html              ← layout + alphabet modal + story-selector mount point.
│                              Loads wlasl-urls.js → data/*.js → app.js in that order.
├── style.css               ← all styling (incl. .story-selector)
├── app.js                  ← LOGIC ONLY (post Session 6): DOM wiring, render, click handler,
│                              fingerspell, modal, video, dev-only validator.
│                              Reads VOCABULARY / STORIES / SCENE_BUILDERS as globals.
├── data/
│   ├── vocabulary.js       ← VOCABULARY global — clickable-word registry.
│   ├── scenes.js           ← SCENE_BUILDERS global — inline-SVG builders (kitchen, clinic).
│   └── stories.js          ← STORIES global — 6 narrations + extended schema
│                              (category, difficulty, targetWords, sentences).
├── wlasl-urls.js           ← AUTO-GENERATED — run build-lookup.js, do not edit
├── WLASL_v0.3.json         ← local only, gitignored, never push to GitHub
├── stories.md              ← author-first draft scratchpad (lint with scripts/lint-story.js)
├── HANDOVER.md             ← this file — update every session
├── .gitignore
├── assets/
│   ├── image/              ← ASL.webp (alphabet chart, used by modal) + home-kitchen.png (unused after revert)
│   ├── fingerspell/        ← drop a.png … z.png here → tiles auto-upgrade to handshapes
│   ├── videos/             ← local mp4 fallback (optional, empty)
│   └── svgs/               ← spare folder (empty)
└── scripts/
    ├── build-lookup.js     ← run after adding new words
    ├── lint-story.js       ← run on a draft to see WLASL coverage (author-first)
    └── test-doctor-story.js ← jsdom verification (run `node scripts/test-doctor-story.js`).
                                Updated in Session 6: concatenates the data files before
                                eval'ing so cross-script `const` bindings resolve.
```

---

## Resolved in earlier sessions (kept for context)

- ~~Process all WLASL words into stories~~ → **author-first.** Most of the 2000 glosses are function/abstract words; auto-stories read poorly. Write narration first, then `lint-story.js` reports coverage.
- ~~Combine Explore + Read into one 3-column layout~~ → **kept 2-column + scene banner (Session 4).** Vertical 60/40 split inside the left column gives the scene most of the real estate.
- ~~"Common phrases with" shows nothing~~ → replaced with "In context" (Session 3) → **replaced with the Fingerspell strip (Session 4).**
- ~~Scene art scaling — Gemini backdrop~~ → tried (commit `3356d7f`) → **reverted (commit `38192fb`)** because the raster image read as VL2/Gallaudet-style and lost the hover-to-glow demo moment. We're back on hand-built SVG via a `sceneBuilders` map. Long-run scaling beyond ~3 stories is an open question (Echo to ask peers/professors).
- ~~"In context" card was redundant~~ → resolved (Session 4): the Fingerspell card replaces it; the alphabet chart modal answers "but what are these letters?"
