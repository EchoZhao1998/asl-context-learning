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
    image: 'assets/image/home-kitchen.png',
    imageAlt: 'Illustrated kitchen: a wooden table holding a glass of water, sliced bread and a red apple, a chair beside it, and a sunlit window behind.',
    sentences: [
      'Every {morning}, I walk into the {kitchen}.',
      'I feel {hungry}, so I look for some {food}.',
      'I grab a fresh {apple} and put it on the {table}.',
      'Then I pour a {glass} of {water} and cut some {bread} with a {knife}.',
      'I sit on my {chair}, and I {eat} and {drink} slowly.',
    ],
  },
];

// ── DOM refs ─────────────────────────────────────────────────
const sceneContainer  = document.getElementById('scene-container');
const storyContainer  = document.getElementById('story-container');
const infoIdle        = document.getElementById('info-idle');
const infoActive      = document.getElementById('info-active');
const wordTitle       = document.getElementById('word-title');
const wordContext     = document.getElementById('word-context');
const fingerspellStrip = document.getElementById('fingerspell-strip');
const fingerspellNote  = document.getElementById('fingerspell-note');
const aslVideo        = document.getElementById('asl-video');
const videoNote       = document.getElementById('video-note');
const dismissBtn      = document.getElementById('dismiss-btn');

// ── Init ──────────────────────────────────────────────────────
renderScene();
renderStories();
resetPanel();
dismissBtn.addEventListener('click', resetPanel);

// ── Scene backdrop ───────────────────────────────────────────
// A per-story illustration shown as a context-only banner. It is NOT
// clickable by design — all vocabulary is clickable in the story prose
// below, so there is no hidden interaction to discover.
function renderScene() {
  const story = stories[0];
  if (!story || !story.image) { sceneContainer.style.display = 'none'; return; }
  sceneContainer.innerHTML =
    `<img class="scene-img" src="${story.image}" alt="${story.imageAlt || story.title}">`;
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

// Render the clicked word as ASL manual-alphabet tiles.
// Each tile tries to load a handshape image from assets/fingerspell/{letter}.png.
// If the image is absent (v1), the tile gracefully shows the letter glyph instead.
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
  fingerspellNote.textContent = 'Spell it letter by letter in the ASL manual alphabet.';
}

// ── Shared word click handler ─────────────────────────────────
function handleWordClick(word, triggerEl) {
  document.querySelectorAll('.story-word').forEach(el => el.classList.remove('active'));
  if (triggerEl) triggerEl.classList.add('active');

  infoIdle.classList.add('hidden');
  infoActive.classList.remove('hidden');

  wordTitle.textContent      = word.toUpperCase();
  wordContext.textContent    = '…';
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
  document.querySelectorAll('.story-word').forEach(el => el.classList.remove('active'));
}
