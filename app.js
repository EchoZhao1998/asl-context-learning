// ── Vocabulary map ──────────────────────────────────────────────────────────
// Add entries here as you download WLASL clips into assets/videos/
// Keys match the SVG element IDs in the kitchen scene below.
const vocabularyMap = {
  'obj-apple':  { word: 'apple',  video: 'apple.mp4'  },
  'obj-chair':  { word: 'chair',  video: 'chair.mp4'  },
  'obj-table':  { word: 'table',  video: 'table.mp4'  },
  'obj-glass':  { word: 'glass',  video: 'glass.mp4'  },
  'obj-knife':  { word: 'knife',  video: 'knife.mp4'  },
};

// ── DOM refs ────────────────────────────────────────────────────────────────
const sceneContainer = document.getElementById('scene-container');
const infoIdle       = document.getElementById('info-idle');
const infoActive     = document.getElementById('info-active');
const wordTitle      = document.getElementById('word-title');
const wordContext    = document.getElementById('word-context');
const wordPhrases    = document.getElementById('word-phrases');
const aslVideo       = document.getElementById('asl-video');
const videoNote      = document.getElementById('video-note');
const resetBtn       = document.getElementById('reset-btn');

// ── Inject the inline SVG kitchen scene ─────────────────────────────────────
sceneContainer.innerHTML = buildKitchenSVG();

// ── Attach click listeners to every interactive object ──────────────────────
Object.keys(vocabularyMap).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => handleObjectClick(id));
});

// ── Reset button ─────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', resetPanel);

// ── Handle click ─────────────────────────────────────────────────────────────
function handleObjectClick(id) {
  const item = vocabularyMap[id];
  if (!item) return;

  // Clear previous active state on all objects
  document.querySelectorAll('.interactive-object').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Show info panel
  infoIdle.classList.add('hidden');
  infoActive.classList.remove('hidden');

  wordTitle.textContent = item.word.toUpperCase();

  // Load video — show fallback note if file not yet present
  const videoSrc = `assets/videos/${item.video}`;
  aslVideo.src = videoSrc;
  aslVideo.load();
  aslVideo.play().catch(() => {
    // File not downloaded yet — show helpful note
    videoNote.textContent = `Place ${item.video} from the WLASL dataset into assets/videos/ to see the sign.`;
  });

  // Reset API fields while loading
  wordContext.textContent  = '…';
  wordPhrases.textContent  = '…';

  // Fetch descriptive adjectives (e.g. "red, sweet, crisp" for apple)
  fetch(`https://api.datamuse.com/words?rel_jja=${item.word}&max=5`)
    .then(r => r.json())
    .then(data => {
      wordContext.textContent = data.length
        ? data.map(d => d.word).join(', ')
        : 'No results found.';
    })
    .catch(() => { wordContext.textContent = 'Could not load (check connection).'; });

  // Fetch words that frequently follow this word (common collocations)
  fetch(`https://api.datamuse.com/words?lc=${item.word}&max=5`)
    .then(r => r.json())
    .then(data => {
      wordPhrases.textContent = data.length
        ? data.map(d => d.word).join(', ')
        : 'No results found.';
    })
    .catch(() => { wordPhrases.textContent = 'Could not load (check connection).'; });
}

// ── Reset panel ───────────────────────────────────────────────────────────────
function resetPanel() {
  infoActive.classList.add('hidden');
  infoIdle.classList.remove('hidden');
  aslVideo.pause();
  aslVideo.src = '';
  videoNote.textContent = '';
  document.querySelectorAll('.interactive-object').forEach(el => el.classList.remove('active'));
}

// ── Kitchen SVG scene ─────────────────────────────────────────────────────────
// A clean, minimal placeholder kitchen. Replace or augment with a real SVG from
// unDraw / Flaticon once you find one you like. All interactive elements carry
// class="interactive-object" and an id matching vocabularyMap above.
function buildKitchenSVG() {
  return `
  <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive kitchen scene">

    <!-- Room background -->
    <rect width="640" height="480" fill="#fafafa"/>

    <!-- Floor -->
    <rect x="0" y="340" width="640" height="140" fill="#ede8e0"/>

    <!-- Back wall -->
    <rect x="0" y="0" width="640" height="340" fill="#f5f2ee"/>

    <!-- Window -->
    <rect x="240" y="40" width="160" height="120" rx="4" fill="#d4eaf7" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="320" y1="40" x2="320" y2="160" stroke="#c0c0c0" stroke-width="1.5"/>
    <line x1="240" y1="100" x2="400" y2="100" stroke="#c0c0c0" stroke-width="1.5"/>

    <!-- Counter top -->
    <rect x="0" y="250" width="640" height="16" fill="#c9b99a"/>
    <rect x="0" y="266" width="640" height="70" fill="#d9cbb5"/>

    <!-- Cabinet doors (decorative) -->
    <rect x="20" y="180" width="80" height="68" rx="2" fill="#e8e0d5" stroke="#c9b99a" stroke-width="1"/>
    <rect x="110" y="180" width="80" height="68" rx="2" fill="#e8e0d5" stroke="#c9b99a" stroke-width="1"/>
    <circle cx="96" cy="214" r="3" fill="#a89070"/>
    <circle cx="186" cy="214" r="3" fill="#a89070"/>

    <!-- Sink -->
    <rect x="420" y="220" width="120" height="28" rx="3" fill="#b0bec5" stroke="#90a4ae" stroke-width="1"/>
    <ellipse cx="480" cy="234" rx="40" ry="10" fill="#90a4ae"/>
    <rect x="476" y="200" width="8" height="22" rx="3" fill="#90a4ae"/>

    <!-- ── TABLE (interactive) ─────────────────────── -->
    <g id="obj-table" class="interactive-object" role="button" tabindex="0" aria-label="table">
      <rect x="170" y="340" width="300" height="14" rx="3" fill="#b5946a"/>
      <!-- legs -->
      <rect x="185" y="354" width="12" height="80" rx="2" fill="#a07850"/>
      <rect x="443" y="354" width="12" height="80" rx="2" fill="#a07850"/>
      <rect x="220" y="354" width="10" height="65" rx="2" fill="#a07850"/>
      <rect x="410" y="354" width="10" height="65" rx="2" fill="#a07850"/>
    </g>
    <text class="obj-label" x="320" y="338" text-anchor="middle">table</text>

    <!-- ── CHAIR (interactive) ────────────────────── -->
    <g id="obj-chair" class="interactive-object" role="button" tabindex="0" aria-label="chair">
      <!-- seat -->
      <rect x="60" y="345" width="90" height="10" rx="2" fill="#8b6f47"/>
      <!-- back -->
      <rect x="62" y="295" width="86" height="52" rx="3" fill="#9e7d54" opacity="0.9"/>
      <!-- legs -->
      <rect x="65"  y="355" width="8" height="55" rx="2" fill="#7a5c35"/>
      <rect x="137" y="355" width="8" height="55" rx="2" fill="#7a5c35"/>
    </g>
    <text class="obj-label" x="105" y="290" text-anchor="middle">chair</text>

    <!-- ── APPLE (interactive) ────────────────────── -->
    <g id="obj-apple" class="interactive-object" role="button" tabindex="0" aria-label="apple">
      <!-- body -->
      <ellipse cx="340" cy="328" rx="22" ry="24" fill="#e05555"/>
      <!-- highlight -->
      <ellipse cx="330" cy="318" rx="7" ry="5" fill="#f08080" opacity="0.5"/>
      <!-- stem -->
      <rect x="338" y="303" width="4" height="10" rx="2" fill="#5a3a1a"/>
      <!-- leaf -->
      <ellipse cx="348" cy="307" rx="8" ry="4" fill="#5a9a3a" transform="rotate(-20 348 307)"/>
    </g>
    <text class="obj-label" x="340" y="298" text-anchor="middle">apple</text>

    <!-- ── GLASS (interactive) ────────────────────── -->
    <g id="obj-glass" class="interactive-object" role="button" tabindex="0" aria-label="glass">
      <path d="M390 295 L398 340 H420 L428 295 Z" fill="#d4eaf7" stroke="#90c4e7" stroke-width="1.2"/>
      <!-- water fill -->
      <path d="M393 320 L398 340 H420 L425 320 Z" fill="#a8d4f0" opacity="0.6"/>
    </g>
    <text class="obj-label" x="409" y="290" text-anchor="middle">glass</text>

    <!-- ── KNIFE (interactive) ────────────────────── -->
    <g id="obj-knife" class="interactive-object" role="button" tabindex="0" aria-label="knife">
      <!-- blade -->
      <path d="M460 305 L510 318 L460 328 Z" fill="#c8c8c8" stroke="#a0a0a0" stroke-width="0.8"/>
      <!-- handle -->
      <rect x="430" y="310" width="32" height="10" rx="4" fill="#6b4c2a"/>
    </g>
    <text class="obj-label" x="476" y="300" text-anchor="middle">knife</text>

  </svg>`;
}
