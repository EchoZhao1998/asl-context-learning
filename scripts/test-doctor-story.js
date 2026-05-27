/**
 * scripts/test-doctor-story.js
 *
 * jsdom verification for the Session 6 refactor:
 *   - Data lives in data/{vocabulary,scenes,stories}.js as globals.
 *   - app.js consumes them and renders all six stories.
 *
 * Asserts:
 *   1. The story selector is populated with all six stories.
 *   2. Kitchen renders by default (scene + narration).
 *   3. Switching to At-the-Doctor re-renders the clinic SVG with the 6
 *      expected interactive objects, and the narration contains every
 *      bracketed differentiation word.
 *   4. Clicking an interactive scene object dispatches handleWordClick
 *      (info-active becomes visible, word title is set).
 *   5. Clicking a fingerspell-only story word surfaces the strip + the
 *      "not in WLASL dataset" video note (architecture-preservation
 *      check carried from Session 5).
 *   6. Switching to a story without a sceneBuilder (Airport) hides the
 *      scene banner gracefully and still renders clickable prose.
 *   7. The dev-only validator fires and console-warns about the new
 *      scenarios' missing vocab (proves the warning loop is wired).
 *
 * Run: node scripts/test-doctor-story.js
 */

const fs   = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html       = fs.readFileSync(path.join(ROOT, 'index.html'),               'utf8');
const wlasl      = fs.readFileSync(path.join(ROOT, 'wlasl-urls.js'),            'utf8');
const vocabulary = fs.readFileSync(path.join(ROOT, 'data', 'vocabulary.js'),    'utf8');
const scenes     = fs.readFileSync(path.join(ROOT, 'data', 'scenes.js'),        'utf8');
const stories    = fs.readFileSync(path.join(ROOT, 'data', 'stories.js'),       'utf8');
const app        = fs.readFileSync(path.join(ROOT, 'app.js'),                   'utf8');

const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'http://localhost/',
});
const { window } = dom;
const { document } = window;

// Stub fetch so handleWordClick doesn't blow up on the Datamuse call
window.fetch = () => Promise.resolve({ json: () => Promise.resolve([]) });
// HTMLMediaElement.play isn't implemented in jsdom — stub it
window.HTMLMediaElement.prototype.play  = function () { return Promise.resolve(); };
window.HTMLMediaElement.prototype.pause = function () {};
window.HTMLMediaElement.prototype.load  = function () {};

// Capture validator warnings so we can assert they fired.
const warnings = [];
const origWarn = window.console.warn;
window.console.warn = (...args) => { warnings.push(args.join(' ')); origWarn(...args); };
// console.group/groupEnd aren't always defined on jsdom's console.
window.console.group    = window.console.group    || function () {};
window.console.groupEnd = window.console.groupEnd || function () {};

// Load scripts into the DOM in the same order as index.html does.
// IMPORTANT: jsdom's window.eval creates a fresh scope per call, so top-
// level `const`/`let` from one call isn't visible to the next. In a real
// browser the script-realm IS shared across <script> tags. To match that,
// concatenate before evaluating so all top-level bindings live together.
// Each piece also gets exported onto `window` afterward so we can assert
// against them.
window.eval(
  wlasl + '\n' +
  vocabulary + '\n' +
  scenes + '\n' +
  stories + '\n' +
  // Export the data globals so the test harness can inspect them.
  'window.WLASL_URLS = WLASL_URLS;\n' +
  'window.VOCABULARY = VOCABULARY;\n' +
  'window.SCENE_BUILDERS = SCENE_BUILDERS;\n' +
  'window.STORIES = STORIES;\n' +
  app
);

const fails = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}${detail ? '\n      ' + detail : ''}`);
    fails.push(name);
  }
}

console.log('\n— Data modules loaded as globals —');
check('VOCABULARY global present',     typeof window.VOCABULARY === 'object');
check('SCENE_BUILDERS global present', typeof window.SCENE_BUILDERS === 'object');
check('STORIES global present',        Array.isArray(window.STORIES));
check('STORIES has six entries',       window.STORIES && window.STORIES.length === 6,
  window.STORIES && `got ${window.STORIES.length}`);

console.log('\n— Story selector —');
const selector = document.getElementById('story-selector');
check('selector exists', !!selector);
check('selector has six options', selector && selector.options.length === 6,
  selector && `got ${selector.options.length}`);
check('option[0] is the kitchen story', selector && selector.options[0].textContent === 'A Morning in the Kitchen');
check('option[1] is the doctor story',  selector && selector.options[1].textContent === 'At the Doctor');
check('option[2] is the airport story', selector && selector.options[2].textContent === 'At the Airport');
check('option[5] is the phone story',   selector && selector.options[5].textContent === 'The Automated Phone Barrier');

console.log('\n— Kitchen story (default) —');
check('kitchen SVG injected', !!document.querySelector('#scene-container svg'));
check('kitchen has 6 interactive-objects', document.querySelectorAll('#scene-container .interactive-object').length === 6);
check('kitchen title shown', document.querySelector('.story-title').textContent === 'A Morning in the Kitchen');

console.log('\n— Switch to At the Doctor —');
selector.value = '1';
selector.dispatchEvent(new window.Event('change'));

const sceneSvg = document.querySelector('#scene-container svg');
check('clinic SVG injected', !!sceneSvg);
check('clinic title shown', document.querySelector('.story-title').textContent === 'At the Doctor');

const sceneWords = Array.from(document.querySelectorAll('#scene-container .interactive-object'))
  .map(el => el.dataset.word).sort();
const expectedSceneWords = ['bed', 'chair', 'door', 'mask', 'phone', 'temperature'].sort();
check('clinic exposes 6 interactive objects (bed, chair, door, mask, phone, temperature)',
  JSON.stringify(sceneWords) === JSON.stringify(expectedSceneWords),
  `got ${JSON.stringify(sceneWords)}`);

console.log('\n— Doctor story narration —');
// Words that must be clickable in the prose (subset, including the differentiation words)
const mustBeClickable = [
  'sit', 'tall', 'chair', 'quiet', 'hospital', 'room',
  'feel', 'very', 'sick', 'tired', 'today',
  'eyes', 'door', 'cannot', 'hear', 'name',
  'nurse', 'call', 'enter', 'deaf', 'doctor',
  'mask', 'lips', 'sentences',         // differentiation moment
  'temperature', 'phone', 'safe', 'bed',
];
const renderedWords = new Set(
  Array.from(document.querySelectorAll('.story-word')).map(el => el.dataset.word)
);
mustBeClickable.forEach(w => {
  check(`prose has clickable "${w}"`, renderedWords.has(w));
});

// mask/lips/sentences should still get .has-sign (they're in VOCABULARY)
const maskEl = document.querySelector('.story-word[data-word="mask"]');
check('"mask" rendered as .has-sign (clickable)', maskEl && maskEl.classList.contains('has-sign'));
const lipsEl = document.querySelector('.story-word[data-word="lips"]');
check('"lips" rendered as .has-sign (clickable)', lipsEl && lipsEl.classList.contains('has-sign'));

console.log('\n— Click an interactive scene object —');
const doorEl = document.querySelector('#scene-container [data-word="door"]');
doorEl.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
check('info-active became visible', !document.getElementById('info-active').classList.contains('hidden'));
check('word-title set to DOOR', document.getElementById('word-title').textContent === 'DOOR');
check('fingerspell strip populated', document.querySelectorAll('#fingerspell-strip .fs-tile').length === 'door'.length);

console.log('\n— Click a fingerspell-only story word (mask) —');
maskEl.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
check('word-title set to MASK', document.getElementById('word-title').textContent === 'MASK');
const vnText = document.getElementById('video-note').textContent;
check('video-note explains "mask" is not in WLASL dataset', /not in WLASL dataset/i.test(vnText),
  `got: "${vnText}"`);
check('fingerspell strip shows 4 tiles for M-A-S-K',
  document.querySelectorAll('#fingerspell-strip .fs-tile').length === 4);

console.log('\n— Switch to At the Airport (no sceneBuilder) —');
selector.value = '2';
selector.dispatchEvent(new window.Event('change'));
check('airport title shown', document.querySelector('.story-title').textContent === 'At the Airport');
const airportSceneSvg = document.querySelector('#scene-container svg');
check('scene banner is empty (no sceneBuilder)', !airportSceneSvg);
check('scene container hidden via inline style',
  document.getElementById('scene-container').style.display === 'none');
// At least one bracketed word should render as a clickable span.
const airportProseEls = document.querySelectorAll('.story-word');
check('airport prose has clickable words', airportProseEls.length > 0,
  `got ${airportProseEls.length}`);
const airportWords = Array.from(airportProseEls).map(el => el.dataset.word);
check('"airport" rendered as clickable word', airportWords.includes('airport'));
// "airport" is NOT in VOCABULARY yet — it should be .no-sign.
const airportEl = document.querySelector('.story-word[data-word="airport"]');
check('"airport" carries .no-sign (no vocab entry yet)',
  airportEl && airportEl.classList.contains('no-sign'));

console.log('\n— Switch back to kitchen —');
selector.value = '0';
selector.dispatchEvent(new window.Event('change'));
check('kitchen SVG re-injected', !!document.querySelector('#scene-container svg'));
check('kitchen title back', document.querySelector('.story-title').textContent === 'A Morning in the Kitchen');
check('scene container visible again',
  document.getElementById('scene-container').style.display !== 'none');

console.log('\n— Validator fired and warned about missing vocab —');
const airportWarn = warnings.find(w => /At the Airport/.test(w));
check('validator warned about At the Airport missing vocab', !!airportWarn,
  airportWarn ? `(${airportWarn})` : '(no matching warning captured)');
const restaurantWarn = warnings.find(w => /Restaurant Dinner/.test(w));
check('validator warned about The Restaurant Dinner missing vocab', !!restaurantWarn);

console.log('');
if (fails.length) {
  console.error(`FAIL — ${fails.length} assertion(s) failed:`);
  fails.forEach(f => console.error('  - ' + f));
  process.exit(1);
}
console.log(`PASS — all assertions OK.`);
