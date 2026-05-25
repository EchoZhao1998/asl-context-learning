// ════════════════════════════════════════════════════════════
//  ASL Context Learning — app.js
//  Unified view: scene banner + story narration on the left,
//  shared info / ASL video panel on the right.
// ════════════════════════════════════════════════════════════

// ── Vocabulary map ───────────────────────────────────────────
// Keys are SVG element data-word values (scene) or story data-word
// values. 'word' must exist in WLASL_URLS (wlasl-urls.js).
const vocabularyMap = {
  // Scene objects
  'apple':   { word: 'apple'   },
  'chair':   { word: 'chair'   },
  'table':   { word: 'table'   },
  'glass':   { word: 'glass'   },
  'knife':   { word: 'knife'   },
  // Story words
  'kitchen': { word: 'kitchen' },
  'hungry':  { word: 'hungry'  },
  'water':   { word: 'water'   },
  'morning': { word: 'morning' },
  'eat':     { word: 'eat'     },
  'drink':   { word: 'drink'   },
  'food':    { word: 'food'    },
  'cup':     { word: 'cup'     },
  'bread':   { word: 'bread'   },
};

// ── Stories data ─────────────────────────────────────────────
// Each story: a title, a scene label, and sentences.
// Wrap clickable words in {word} — they must exist in vocabularyMap.
const stories = [
  {
    id: 'morning-kitchen',
    title: 'A Morning in the Kitchen',
    scene: 'Home · Kitchen',
    sentences: [
      'Every {morning}, I walk into the {kitchen}.',
      'I feel {hungry}, so I look for some {food}.',
      'I grab a fresh {apple} and put it on the {table}.',
      'Then I pour a {glass} of {water} and cut some {bread} with a {knife}.',
      'I sit on my {chair}, and I {eat} and {drink} slowly.',
    ],
  },
];

// ── word → first source sentence index (for "In context") ────
// Maps a clickable word to the raw sentence string it first appears in.
const sentenceIndex = {};
stories.forEach(story => {
  story.sentences.forEach(raw => {
    const tokens = [...raw.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
    tokens.forEach(w => {
      if (!(w in sentenceIndex)) sentenceIndex[w] = raw;
    });
  });
});

// ── DOM refs ─────────────────────────────────────────────────
const sceneContainer = document.getElementById('scene-container');
const storyContainer = document.getElementById('story-container');
const infoIdle       = document.getElementById('info-idle');
const infoActive     = document.getElementById('info-active');
const wordTitle      = document.getElementById('word-title');
const wordContext    = document.getElementById('word-context');
const wordInContext  = document.getElementById('word-incontext');
const aslVideo       = document.getElementById('asl-video');
const videoNote      = document.getElementById('video-note');
const resetBtn       = document.getElementById('reset-btn');

// ── Init ──────────────────────────────────────────────────────
sceneContainer.innerHTML = buildKitchenSVG();
renderStories();
attachSceneListeners();
resetPanel();
resetBtn.addEventListener('click', resetPanel);

// ── Scene: SVG click listeners ───────────────────────────────
function attachSceneListeners() {
  document.querySelectorAll('.interactive-object').forEach(el => {
    const word = el.dataset.word;
    if (!word) return;
    el.addEventListener('click',   () => handleWordClick(word, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleWordClick(word, el);
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
        ${story.sentences.map(s => `<p class="story-sentence">${parseStory(s)}</p>`).join('\n')}
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.story-word').forEach(el => {
    const word = el.dataset.word;
    el.addEventListener('click',   () => handleWordClick(word, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleWordClick(word, el);
    });
  });
}

// Convert {word} tokens in a sentence to clickable spans
function parseStory(sentence) {
  return sentence.replace(/\{(\w+)\}/g, (_, word) => {
    const known = !!vocabularyMap[word];
    return `<span class="story-word ${known ? 'has-sign' : 'no-sign'}" data-word="${word}" tabindex="0" role="button" aria-label="${word}">${word}</span>`;
  });
}

// Render the source sentence for the info panel, highlighting `target`.
function renderInContext(target) {
  const raw = sentenceIndex[target];
  if (!raw) return '—';
  return raw.replace(/\{(\w+)\}/g, (_, word) =>
    word === target ? `<span class="ctx-word">${word}</span>` : word
  );
}

// ── Shared word click handler ─────────────────────────────────
function handleWordClick(word, triggerEl) {
  document.querySelectorAll('.interactive-object, .story-word').forEach(el => el.classList.remove('active'));
  if (triggerEl) triggerEl.classList.add('active');

  infoIdle.classList.add('hidden');
  infoActive.classList.remove('hidden');

  wordTitle.textContent      = word.toUpperCase();
  wordContext.textContent    = '…';
  wordInContext.innerHTML    = renderInContext(word);

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

// ── Kitchen SVG ───────────────────────────────────────────────
function buildKitchenSVG() {
  return `
  <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive kitchen scene">
    <rect width="640" height="480" fill="#fafafa"/>
    <rect x="0" y="340" width="640" height="140" fill="#ede8e0"/>
    <rect x="0" y="0"   width="640" height="340" fill="#f5f2ee"/>

    <!-- Window -->
    <rect x="240" y="40" width="160" height="120" rx="4" fill="#d4eaf7" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="320" y1="40"  x2="320" y2="160" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="240" y1="100" x2="400" y2="100" stroke="#c0c0c0" stroke-width="1.5"/>

    <!-- Counter -->
    <rect x="0" y="250" width="640" height="16" fill="#c9b99a"/>
    <rect x="0" y="266" width="640" height="70" fill="#d9cbb5"/>

    <!-- Cabinets -->
    <rect x="20"  y="180" width="80" height="68" rx="2" fill="#e8e0d5" stroke="#c9b99a" stroke-width="1"/>
    <rect x="110" y="180" width="80" height="68" rx="2" fill="#e8e0d5" stroke="#c9b99a" stroke-width="1"/>
    <circle cx="96"  cy="214" r="3" fill="#a89070"/>
    <circle cx="186" cy="214" r="3" fill="#a89070"/>

    <!-- Sink -->
    <rect x="420" y="220" width="120" height="28" rx="3" fill="#b0bec5" stroke="#90a4ae" stroke-width="1"/>
    <ellipse cx="480" cy="234" rx="40" ry="10" fill="#90a4ae"/>
    <rect x="476" y="200" width="8"   height="22" rx="3" fill="#90a4ae"/>

    <!-- TABLE -->
    <g id="obj-table" class="interactive-object" data-word="table" role="button" tabindex="0" aria-label="table">
      <rect x="170" y="340" width="300" height="14" rx="3" fill="#b5946a"/>
      <rect x="185" y="354" width="12" height="80" rx="2" fill="#a07850"/>
      <rect x="443" y="354" width="12" height="80" rx="2" fill="#a07850"/>
      <rect x="220" y="354" width="10" height="65" rx="2" fill="#a07850"/>
      <rect x="410" y="354" width="10" height="65" rx="2" fill="#a07850"/>
    </g>
    <text class="obj-label" x="320" y="338" text-anchor="middle">table</text>

    <!-- CHAIR -->
    <g id="obj-chair" class="interactive-object" data-word="chair" role="button" tabindex="0" aria-label="chair">
      <rect x="60"  y="345" width="90" height="10" rx="2" fill="#8b6f47"/>
      <rect x="62"  y="295" width="86" height="52" rx="3" fill="#9e7d54" opacity="0.9"/>
      <rect x="65"  y="355" width="8"  height="55" rx="2" fill="#7a5c35"/>
      <rect x="137" y="355" width="8"  height="55" rx="2" fill="#7a5c35"/>
    </g>
    <text class="obj-label" x="105" y="290" text-anchor="middle">chair</text>

    <!-- APPLE -->
    <g id="obj-apple" class="interactive-object" data-word="apple" role="button" tabindex="0" aria-label="apple">
      <ellipse cx="340" cy="328" rx="22" ry="24" fill="#e05555"/>
      <ellipse cx="330" cy="318" rx="7"  ry="5"  fill="#f08080" opacity="0.5"/>
      <rect    x="338"  y="303"  width="4" height="10" rx="2" fill="#5a3a1a"/>
      <ellipse cx="348" cy="307" rx="8"  ry="4"  fill="#5a9a3a" transform="rotate(-20 348 307)"/>
    </g>
    <text class="obj-label" x="340" y="298" text-anchor="middle">apple</text>

    <!-- GLASS -->
    <g id="obj-glass" class="interactive-object" data-word="glass" role="button" tabindex="0" aria-label="glass">
      <path d="M390 295 L398 340 H420 L428 295 Z" fill="#d4eaf7" stroke="#90c4e7" stroke-width="1.2"/>
      <path d="M393 320 L398 340 H420 L425 320 Z" fill="#a8d4f0" opacity="0.6"/>
    </g>
    <text class="obj-label" x="409" y="290" text-anchor="middle">glass</text>

    <!-- KNIFE -->
    <g id="obj-knife" class="interactive-object" data-word="knife" role="button" tabindex="0" aria-label="knife">
      <path d="M460 305 L510 318 L460 328 Z" fill="#c8c8c8" stroke="#a0a0a0" stroke-width="0.8"/>
      <rect x="430" y="310" width="32" height="10" rx="4" fill="#6b4c2a"/>
    </g>
    <text class="obj-label" x="476" y="300" text-anchor="middle">knife</text>
  </svg>`;
}
