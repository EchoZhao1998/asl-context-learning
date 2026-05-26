// ════════════════════════════════════════════════════════════
//  ASL Context Learning — app.js
//  Single-screen view: interactive SVG scene (top) + story narration
//  (bottom-left); shared info / video / fingerspell panel (right).
// ════════════════════════════════════════════════════════════

// ── Vocabulary map ───────────────────────────────────────────
// Keys are SVG data-word values (scene) or story data-word values.
// `word` must exist in WLASL_URLS (wlasl-urls.js).
const vocabularyMap = {
  // Scene objects
  'apple':   { word: 'apple'   },
  'chair':   { word: 'chair'   },
  'table':   { word: 'table'   },
  'glass':   { word: 'glass'   },
  'cup':     { word: 'cup'     },
  'knife':   { word: 'knife'   },
  // Story-only words
  'kitchen': { word: 'kitchen' },
  'hungry':  { word: 'hungry'  },
  'water':   { word: 'water'   },
  'morning': { word: 'morning' },
  'eat':     { word: 'eat'     },
  'drink':   { word: 'drink'   },
  'food':    { word: 'food'    },
  'bread':   { word: 'bread'   },
};

// ── Stories data ─────────────────────────────────────────────
// Each story: title, scene label, sentences, and a sceneBuilder key
// that picks the SVG builder from `sceneBuilders` below. Adding a story
// = add a row here + add an entry to `sceneBuilders`.
const stories = [
  {
    id: 'morning-kitchen',
    title: 'A Morning in the Kitchen',
    scene: 'Home · Kitchen',
    sceneBuilder: 'kitchen',
    sentences: [
      'Every {morning}, I walk into the {kitchen}.',
      'I feel {hungry}, so I look for some {food}.',
      'I grab a fresh {apple} and put it on the {table}.',
      'Then I pour a {glass} of {water} and cut some {bread} with a {knife}.',
      'I sit on my {chair}, take my {cup}, and I {eat} and {drink} slowly.',
    ],
  },
];

// ── DOM refs ─────────────────────────────────────────────────
const sceneContainer   = document.getElementById('scene-container');
const storyContainer   = document.getElementById('story-container');
const infoIdle         = document.getElementById('info-idle');
const infoActive       = document.getElementById('info-active');
const wordTitle        = document.getElementById('word-title');
const wordContext      = document.getElementById('word-context');
const fingerspellStrip = document.getElementById('fingerspell-strip');
const fingerspellNote  = document.getElementById('fingerspell-note');
const aslVideo         = document.getElementById('asl-video');
const videoNote        = document.getElementById('video-note');
const dismissBtn       = document.getElementById('dismiss-btn');
const alphabetBtn      = document.getElementById('alphabet-btn');
const alphabetModal    = document.getElementById('alphabet-modal');
const alphabetClose    = document.getElementById('alphabet-close');
const alphabetBackdrop = document.getElementById('alphabet-backdrop');

// (Init runs at the bottom of this file, after `sceneBuilders` is
// defined — avoids a temporal-dead-zone reference error.)

// ── Scene rendering ──────────────────────────────────────────
// Each story names a builder; the builder returns inline SVG markup.
function renderScene() {
  const story = stories[0];
  const build = story && sceneBuilders[story.sceneBuilder];
  if (!build) { sceneContainer.style.display = 'none'; return; }
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

// ── Render stories ───────────────────────────────────────────
function renderStories() {
  storyContainer.innerHTML = stories.map(story => `
    <article class="story" id="story-${story.id}">
      <div class="story-meta">
        <span class="story-scene">${story.scene}</span>
      </div>
      <h2 class="story-title">${story.title}</h2>
      <div class="story-body">
        <p class="story-sentence">${story.sentences.map(s => parseStory(s)).join(' ')}</p>
      </div>
    </article>
  `).join('');

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
    const known = !!vocabularyMap[word];
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
//  Scene builders — one function per story scene
//  Add a new entry here when adding a new story; reference by
//  `sceneBuilder` on the story object.
// ════════════════════════════════════════════════════════════
const sceneBuilders = {
  kitchen: () => `
  <svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive kitchen scene with clickable apple, chair, table, glass, cup and knife">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#faf6ed"/>
        <stop offset="1" stop-color="#f2e9d6"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e2d2b0"/>
        <stop offset="1" stop-color="#cdba94"/>
      </linearGradient>
      <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff5d6" stop-opacity="0.7"/>
        <stop offset="1" stop-color="#fff5d6" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="winGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d8ecf7"/>
        <stop offset="1" stop-color="#b5dcef"/>
      </linearGradient>
      <linearGradient id="tableTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c8a472"/>
        <stop offset="1" stop-color="#a8895c"/>
      </linearGradient>
      <radialGradient id="appleGrad" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#f08080"/>
        <stop offset="1" stop-color="#c64444"/>
      </radialGradient>
    </defs>

    <!-- Wall + floor -->
    <rect x="0" y="0"   width="960" height="380" fill="url(#wall)"/>
    <rect x="0" y="380" width="960" height="160" fill="url(#floor)"/>
    <line x1="0" y1="380" x2="960" y2="380" stroke="#b8a37a" stroke-width="1.5" opacity="0.45"/>

    <!-- Window with mullions + frame -->
    <g>
      <rect x="380" y="60"  width="200" height="170" rx="6" fill="url(#winGlass)" stroke="#9aa9b3" stroke-width="2"/>
      <line x1="480" y1="60"  x2="480" y2="230" stroke="#9aa9b3" stroke-width="2"/>
      <line x1="380" y1="145" x2="580" y2="145" stroke="#9aa9b3" stroke-width="2"/>
      <rect x="374" y="54"  width="212" height="182" rx="6" fill="none" stroke="#6b5a44" stroke-width="3"/>
    </g>

    <!-- Sunlight beam from window onto floor -->
    <polygon points="400,232 580,232 700,420 280,420" fill="url(#sun)" opacity="0.55"/>

    <!-- Back-left counter + cabinets above it -->
    <rect x="0"   y="316" width="320" height="6"  fill="#b8a37a"/>
    <rect x="0"   y="322" width="320" height="58" fill="#d9cbb5"/>
    <rect x="20"  y="240" width="120" height="76" rx="3" fill="#ece2d0" stroke="#bda886" stroke-width="1.2"/>
    <rect x="150" y="240" width="120" height="76" rx="3" fill="#ece2d0" stroke="#bda886" stroke-width="1.2"/>
    <line x1="80"  y1="240" x2="80"  y2="316" stroke="#bda886" stroke-width="1"/>
    <line x1="210" y1="240" x2="210" y2="316" stroke="#bda886" stroke-width="1"/>
    <circle cx="68"  cy="278" r="2.5" fill="#8c7654"/>
    <circle cx="93"  cy="278" r="2.5" fill="#8c7654"/>
    <circle cx="198" cy="278" r="2.5" fill="#8c7654"/>
    <circle cx="223" cy="278" r="2.5" fill="#8c7654"/>

    <!-- Right-side counter, sink + faucet -->
    <rect x="700" y="312" width="240" height="6"  fill="#b8a37a"/>
    <rect x="700" y="318" width="240" height="62" fill="#d9cbb5"/>
    <rect x="740" y="332" width="160" height="38" rx="6" fill="#a9bac3" stroke="#7d909c" stroke-width="1.4"/>
    <ellipse cx="820" cy="351" rx="55" ry="9" fill="#7d909c"/>
    <rect x="816" y="292" width="8" height="32" rx="3" fill="#7d909c"/>
    <path d="M816 292 q-14 -8 14 -16" fill="none" stroke="#7d909c" stroke-width="6" stroke-linecap="round"/>

    <!-- Shadow on floor under table + chair -->
    <ellipse cx="510" cy="506" rx="260" ry="10" fill="#000" opacity="0.06"/>

    <!-- TABLE (interactive) -->
    <g id="obj-table" class="interactive-object" data-word="table" role="button" tabindex="0" aria-label="table">
      <rect x="290" y="380" width="430" height="22" rx="5" fill="url(#tableTop)" stroke="#8a6d44" stroke-width="1"/>
      <rect x="290" y="402" width="430" height="6"  fill="#8a6d44" opacity="0.35"/>
      <rect x="306" y="408" width="14"  height="100" rx="2" fill="#a08054"/>
      <rect x="690" y="408" width="14"  height="100" rx="2" fill="#a08054"/>
      <rect x="345" y="408" width="10"  height="80"  rx="2" fill="#8a6d44" opacity="0.7"/>
      <rect x="655" y="408" width="10"  height="80"  rx="2" fill="#8a6d44" opacity="0.7"/>
    </g>
    <text class="obj-label" x="505" y="438" text-anchor="middle">table</text>

    <!-- CHAIR (interactive) -->
    <g id="obj-chair" class="interactive-object" data-word="chair" role="button" tabindex="0" aria-label="chair">
      <rect x="770" y="280" width="68" height="100" rx="3" fill="#9c7c50"/>
      <rect x="775" y="288" width="58" height="5" rx="2" fill="#7c5e36"/>
      <rect x="775" y="304" width="58" height="5" rx="2" fill="#7c5e36"/>
      <rect x="775" y="320" width="58" height="5" rx="2" fill="#7c5e36"/>
      <rect x="762" y="378" width="86" height="14" rx="3" fill="#a08054"/>
      <rect x="762" y="392" width="86" height="4"  fill="#7c5e36" opacity="0.4"/>
      <rect x="770" y="396" width="8"  height="100" rx="2" fill="#7c5e36"/>
      <rect x="834" y="396" width="8"  height="100" rx="2" fill="#7c5e36"/>
    </g>
    <text class="obj-label" x="804" y="276" text-anchor="middle">chair</text>

    <!-- APPLE (interactive) -->
    <g id="obj-apple" class="interactive-object" data-word="apple" role="button" tabindex="0" aria-label="apple">
      <ellipse cx="420" cy="358" rx="22" ry="24" fill="url(#appleGrad)"/>
      <ellipse cx="411" cy="348" rx="6"  ry="4"  fill="#fff" opacity="0.35"/>
      <rect    x="418" y="332"  width="3.5" height="10" rx="1.5" fill="#5a3a1a"/>
      <path    d="M422 334 q12 -4 14 4 q-6 4 -14 -4 z" fill="#69973c"/>
    </g>
    <text class="obj-label" x="420" y="326" text-anchor="middle">apple</text>

    <!-- GLASS (interactive) -->
    <g id="obj-glass" class="interactive-object" data-word="glass" role="button" tabindex="0" aria-label="glass">
      <path d="M482 322 L490 380 H520 L528 322 Z" fill="#d4eaf7" stroke="#8fb6ce" stroke-width="1.2"/>
      <path d="M487 350 L491 380 H519 L523 350 Z" fill="#a8d4f0" opacity="0.6"/>
      <ellipse cx="505" cy="322" rx="23" ry="3" fill="#bcd8e8" stroke="#8fb6ce" stroke-width="1"/>
      <line x1="497" y1="335" x2="495" y2="372" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
    </g>
    <text class="obj-label" x="505" y="316" text-anchor="middle">glass</text>

    <!-- CUP (interactive — surfaces previously unused vocab) -->
    <g id="obj-cup" class="interactive-object" data-word="cup" role="button" tabindex="0" aria-label="cup">
      <path d="M558 332 q0 -2 4 -2 h44 q4 0 4 2 v40 q0 6 -6 6 h-40 q-6 0 -6 -6 z" fill="#f4f0e6" stroke="#b8a37a" stroke-width="1.2"/>
      <path d="M610 340 q14 0 14 14 q0 14 -14 14" fill="none" stroke="#b8a37a" stroke-width="3"/>
      <ellipse cx="584" cy="332" rx="26" ry="3.5" fill="#ffffff" stroke="#b8a37a" stroke-width="1"/>
      <path d="M572 320 q4 -6 0 -12 M584 318 q4 -6 0 -12 M596 320 q4 -6 0 -12"
            fill="none" stroke="#cbbf9b" stroke-width="1.2" opacity="0.75"/>
    </g>
    <text class="obj-label" x="586" y="326" text-anchor="middle">cup</text>

    <!-- KNIFE (interactive) -->
    <g id="obj-knife" class="interactive-object" data-word="knife" role="button" tabindex="0" aria-label="knife">
      <path d="M640 362 L700 372 L640 378 Z" fill="#dcdee0" stroke="#9aa0a6" stroke-width="0.8"/>
      <path d="M640 362 L700 372 L640 378 Z" fill="#ffffff" opacity="0.25"/>
      <rect x="608" y="366" width="34" height="10" rx="4" fill="#6b4c2a"/>
      <line x1="616" y1="368" x2="616" y2="374" stroke="#3e2a14" stroke-width="0.8" opacity="0.5"/>
      <line x1="624" y1="368" x2="624" y2="374" stroke="#3e2a14" stroke-width="0.8" opacity="0.5"/>
    </g>
    <text class="obj-label" x="660" y="358" text-anchor="middle">knife</text>
  </svg>`,
};

// ── Init (runs last; sceneBuilders is now defined) ──────────
renderScene();
renderStories();
attachSceneListeners();
resetPanel();
dismissBtn.addEventListener('click', resetPanel);
wireAlphabetModal();
