// ════════════════════════════════════════════════════════════
//  ASL Context Learning — app.js
//  Single-screen view: interactive SVG scene (top) + story narration
//  (bottom-left); shared info / video / fingerspell panel (right).
//
//  Session 6 refactor split data out of this file. Data now lives in:
//    data/vocabulary.js  → VOCABULARY      (clickable-word registry)
//    data/scenes.js      → SCENE_BUILDERS  (inline-SVG builders)
//    data/stories.js     → STORIES         (narration + lesson metadata)
//  This file is logic only: DOM wiring, render, click handling, video
//  fallback chain, fingerspell strip, alphabet modal, and a dev-only
//  validator that warns about story words missing from VOCABULARY.
//
//  Load order in index.html (matters):
//    wlasl-urls.js  →  data/vocabulary.js  →  data/scenes.js
//                  →  data/stories.js     →  app.js
// ════════════════════════════════════════════════════════════

// ── DOM refs ─────────────────────────────────────────────────
const sceneContainer    = document.getElementById('scene-container');
const storyContainer    = document.getElementById('story-container');
const storySelectorWrap = document.getElementById('story-selector-wrap');
const infoIdle          = document.getElementById('info-idle');
const infoActive        = document.getElementById('info-active');
const wordTitle         = document.getElementById('word-title');
const wordContext       = document.getElementById('word-context');
const fingerspellStrip  = document.getElementById('fingerspell-strip');
const fingerspellNote   = document.getElementById('fingerspell-note');
const aslVideo          = document.getElementById('asl-video');
const videoNote         = document.getElementById('video-note');
const dismissBtn        = document.getElementById('dismiss-btn');
const alphabetBtn       = document.getElementById('alphabet-btn');
const alphabetModal     = document.getElementById('alphabet-modal');
const alphabetClose     = document.getElementById('alphabet-close');
const alphabetBackdrop  = document.getElementById('alphabet-backdrop');

// Current story index (drives both the scene and the narration).
let currentStoryIndex = 0;

// ── Story switcher ───────────────────────────────────────────
// Smallest viable multi-story nav: a <select> rendered above the
// story title. Stays compact even when the list grows past 10.
function renderStorySelector() {
  if (!storySelectorWrap) return;
  const options = STORIES.map((s, i) =>
    `<option value="${i}"${i === currentStoryIndex ? ' selected' : ''}>${s.title}</option>`
  ).join('');
  storySelectorWrap.innerHTML = `
    <label class="story-selector-label" for="story-selector">Story</label>
    <select class="story-selector" id="story-selector" aria-label="Choose a story">${options}</select>
  `;
  const sel = document.getElementById('story-selector');
  sel.addEventListener('change', e => setStory(parseInt(e.target.value, 10)));
}

function setStory(index) {
  if (index === currentStoryIndex) return;
  currentStoryIndex = index;
  renderScene();
  renderStory();
  attachSceneListeners();
  resetPanel();
}

// ── Scene rendering ──────────────────────────────────────────
// The current story names a builder; the builder returns inline SVG.
// Stories without a sceneBuilder (or with one not in SCENE_BUILDERS)
// hide the scene banner so the narration occupies the full column.
function renderScene() {
  const story = STORIES[currentStoryIndex];
  const build = story && SCENE_BUILDERS[story.sceneBuilder];
  if (!build) {
    sceneContainer.style.display = 'none';
    sceneContainer.innerHTML = '';
    return;
  }
  sceneContainer.style.display = '';
  sceneContainer.innerHTML = build();
}

function attachSceneListeners() {
  document.querySelectorAll('.interactive-object').forEach(el => {
    const word = el.dataset.word;
    if (!word) return;
    el.addEventListener('click',   () => handleWordClick(word, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleWordClick(word, el);
      }
    });
  });
}

// ── Render the current story ─────────────────────────────────
function renderStory() {
  const story = STORIES[currentStoryIndex];
  if (!story) { storyContainer.innerHTML = ''; return; }
  storyContainer.innerHTML = `
    <article class="story" id="story-${story.id}">
      <div class="story-meta">
        <span class="story-scene">${story.scene}</span>
      </div>
      <h2 class="story-title">${story.title}</h2>
      <div class="story-body">
        <p class="story-sentence">${story.sentences.map(s => parseStory(s)).join(' ')}</p>
      </div>
    </article>
  `;

  document.querySelectorAll('.story-word').forEach(el => {
    const word = el.dataset.word;
    el.addEventListener('click',   () => handleWordClick(word, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleWordClick(word, el);
      }
    });
  });
}

// Convert {word} tokens in a sentence to clickable spans.
function parseStory(sentence) {
  return sentence.replace(/\{(\w+)\}/g, (_, word) => {
    const known = !!VOCABULARY[word];
    return `<span class="story-word ${known ? 'has-sign' : 'no-sign'}" data-word="${word}" tabindex="0" role="button" aria-label="${word}">${word}</span>`;
  });
}

// ── Fingerspell strip ────────────────────────────────────────
// Tries to load per-letter handshape images from assets/fingerspell/;
// falls back to letter glyphs when images are absent (v1).
function renderFingerspell(word) {
  const letters = word.toUpperCase().split('');
  fingerspellStrip.innerHTML = letters.map(ch => {
    const lower = ch.toLowerCase();
    if (!/[a-z]/.test(lower)) return `<span class="fs-tile fs-space">${ch}</span>`;
    return `<span class="fs-tile">
      <img class="fs-img" alt="ASL handshape for the letter ${ch}"
           src="assets/fingerspell/${lower}.png"
           onload="this.parentNode.classList.add('has-img')"
           onerror="this.remove()">
      <span class="fs-letter">${ch}</span>
    </span>`;
  }).join('');
  fingerspellNote.textContent = "Don't know the handshapes yet? Open the chart below.";
}

// ── ASL alphabet modal ───────────────────────────────────────
function wireAlphabetModal() {
  if (!alphabetBtn || !alphabetModal) return;
  const open  = () => { alphabetModal.classList.remove('hidden'); alphabetClose.focus(); };
  const close = () => { alphabetModal.classList.add('hidden'); };
  alphabetBtn.addEventListener('click', open);
  alphabetClose.addEventListener('click', close);
  alphabetBackdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !alphabetModal.classList.contains('hidden')) close();
  });
}

// ── Shared word click handler ─────────────────────────────────
function handleWordClick(word, triggerEl) {
  document.querySelectorAll('.interactive-object, .story-word').forEach(el => el.classList.remove('active'));
  if (triggerEl) triggerEl.classList.add('active');

  infoIdle.classList.add('hidden');
  infoActive.classList.remove('hidden');

  wordTitle.textContent   = word.toUpperCase();
  wordContext.textContent = '…';
  renderFingerspell(word);

  tryVideoUrls(word);

  fetch(`https://api.datamuse.com/words?rel_jja=${word}&max=5`)
    .then(r => r.json())
    .then(data => {
      wordContext.textContent = data.length ? data.map(d => d.word).join(', ') : '—';
    })
    .catch(() => { wordContext.textContent = 'Could not load.'; });
}

// ── Video fallback chain ──────────────────────────────────────
function tryVideoUrls(word) {
  const urls = (typeof WLASL_URLS !== 'undefined' && WLASL_URLS[word]) || [];
  if (!urls.length) {
    videoNote.textContent = `"${word}" not in WLASL dataset — fingerspelling coming in Phase 2.`;
    aslVideo.src = '';
    return;
  }
  let index = 0;
  videoNote.textContent = 'Loading…';
  aslVideo.onerror = null;

  function tryNext() {
    if (index >= urls.length) {
      videoNote.textContent = `All ${urls.length} sources failed. Try again later.`;
      return;
    }
    const url = urls[index++];
    aslVideo.src = url;
    aslVideo.load();
    aslVideo.onerror = tryNext;
    aslVideo.play()
      .then(() => { videoNote.textContent = ''; })
      .catch(() => {});
  }
  tryNext();
}

// ── Reset panel ───────────────────────────────────────────────
function resetPanel() {
  infoActive.classList.add('hidden');
  infoIdle.classList.remove('hidden');
  aslVideo.pause();
  aslVideo.src     = '';
  aslVideo.onerror = null;
  videoNote.textContent = '';
  document.querySelectorAll('.interactive-object, .story-word').forEach(el => el.classList.remove('active'));
}

// ════════════════════════════════════════════════════════════
//  Dev-only validator — fail loud, not silent
// ════════════════════════════════════════════════════════════
//  Walks every STORIES sentence, extracts {word} tokens, and reports
//  any that are missing from VOCABULARY. Also lists orphan VOCABULARY
//  entries that no story uses (informational — handy when pruning).
//
//  Gated to local development only so production GitHub-Pages visitors
//  don't see warnings in their console.
function validateStoryWords() {
  const isDev =
    typeof location !== 'undefined' &&
    (location.protocol === 'file:' ||
     location.hostname === 'localhost' ||
     location.hostname === '127.0.0.1' ||
     location.hostname === '');
  if (!isDev) return;

  const usedWords = new Set();
  const missingByStory = {};

  STORIES.forEach(story => {
    const missing = new Set();
    story.sentences.forEach(sentence => {
      const tokens = [...sentence.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
      tokens.forEach(w => {
        usedWords.add(w);
        if (!VOCABULARY[w]) missing.add(w);
      });
    });
    if (missing.size) missingByStory[story.title] = [...missing];
  });

  const orphans = Object.keys(VOCABULARY).filter(w => !usedWords.has(w));

  if (Object.keys(missingByStory).length) {
    console.group('[VocabularyValidator] Story words missing from VOCABULARY');
    Object.entries(missingByStory).forEach(([title, words]) => {
      console.warn(`${title}: ${words.join(', ')}`);
    });
    console.info(
      'Fix: add an entry to data/vocabulary.js (and to VOCAB_WORDS in ' +
      'scripts/build-lookup.js, then re-run it).'
    );
    console.groupEnd();
  }

  if (orphans.length) {
    console.info(
      `[VocabularyValidator] ${orphans.length} VOCABULARY entr` +
      (orphans.length === 1 ? 'y is' : 'ies are') +
      ' unused by any story: ' + orphans.join(', ')
    );
  }
}

// ── Init ─────────────────────────────────────────────────────
// All data modules (VOCABULARY, STORIES, SCENE_BUILDERS) and the
// auto-generated WLASL_URLS are loaded before this file by index.html.
renderStorySelector();
renderScene();
renderStory();
attachSceneListeners();
resetPanel();
dismissBtn.addEventListener('click', resetPanel);
wireAlphabetModal();
validateStoryWords();
