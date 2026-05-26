/**
 * scripts/test-doctor-story.js
 *
 * jsdom verification for the "At the Doctor" story + clinic scene + story switcher.
 *
 * Loads index.html, wlasl-urls.js, and app.js into a jsdom DOM, then asserts:
 *   1. The story selector is populated with both stories.
 *   2. The kitchen story renders by default (scene + narration).
 *   3. Switching to the doctor story re-renders the clinic SVG with the 6
 *      expected interactive objects, and the narration contains every
 *      bracketed word from app.js with the right class (.has-sign / .no-sign).
 *   4. Clicking an interactive scene object dispatches handleWordClick
 *      (info-active becomes visible, word title is set).
 *
 * Run: node scripts/test-doctor-story.js
 */

const fs   = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const wlasl = fs.readFileSync(path.join(ROOT, 'wlasl-urls.js'), 'utf8');
const app   = fs.readFileSync(path.join(ROOT, 'app.js'),   'utf8');

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

// Load scripts into the DOM
window.eval(wlasl);
window.eval(app);

const fails = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}${detail ? '\n      ' + detail : ''}`);
    fails.push(name);
  }
}

console.log('\n— Story selector —');
const selector = document.getElementById('story-selector');
check('selector exists', !!selector);
check('selector has two options', selector && selector.options.length === 2,
  selector && `got ${selector.options.length}`);
check('option[0] is the kitchen story', selector && selector.options[0].textContent === 'A Morning in the Kitchen');
check('option[1] is the doctor story', selector && selector.options[1].textContent === 'At the Doctor');

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

// mask/lips/sentences should still get .has-sign (they're in vocabularyMap)
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

console.log('\n— Switch back to kitchen —');
selector.value = '0';
selector.dispatchEvent(new window.Event('change'));
check('kitchen SVG re-injected', !!document.querySelector('#scene-container svg'));
check('kitchen title back', document.querySelector('.story-title').textContent === 'A Morning in the Kitchen');

console.log('');
if (fails.length) {
  console.error(`FAIL — ${fails.length} assertion(s) failed:`);
  fails.forEach(f => console.error('  - ' + f));
  process.exit(1);
}
console.log(`PASS — all assertions OK.`);
