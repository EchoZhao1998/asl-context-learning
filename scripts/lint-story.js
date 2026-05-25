/**
 * lint-story.js
 *
 * Author-first workflow helper. You write a natural short story; this script
 * tells you which words ASL can cover, so you never hand-pick vocabulary again.
 *
 * For every content word it reports one of three buckets:
 *   ✅ coverable    — gloss exists in WLASL AND has a direct .mp4 → clickable now
 *   ⚠  gloss-only   — gloss exists in WLASL but no direct .mp4 → sign exists, no playable source
 *   ✋ fingerspell   — not in WLASL at all → Phase 2 fingerspelling fallback
 *
 * Usage:
 *   node scripts/lint-story.js path/to/story.txt     # lint a text file
 *   echo "I eat bread" | node scripts/lint-story.js   # lint from stdin
 *   node scripts/lint-story.js --tokens path/to.txt   # only lint {bracketed} words
 *
 * If the text contains {bracketed} words, only those are linted by default
 * (matches the app's {word} authoring convention). Otherwise every content
 * word is linted, minus common function words.
 */

const fs   = require('fs');
const path = require('path');

const ROOT      = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'WLASL_v0.3.json');

// Common function words we never expect (or need) signs for.
const STOPWORDS = new Set([
  'a','an','the','and','or','but','so','if','then','of','to','in','on','at','for',
  'with','from','into','onto','my','your','his','her','its','our','their','this',
  'that','these','those','i','you','he','she','it','we','they','me','him','them',
  'is','am','are','was','were','be','been','being','do','does','did','have','has',
  'had','will','would','can','could','shall','should','may','might','must','not',
  'no','yes','as','by','up','out','off','over','some','any','each','every','all',
]);

// ── Parse args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const tokensOnly = args.includes('--tokens');
const fileArg = args.find(a => a !== '--tokens');

function readInput() {
  if (fileArg) return fs.readFileSync(fileArg, 'utf8');
  // stdin
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

const text = readInput().trim();
if (!text) {
  console.error('No input. Pass a file path or pipe text via stdin.');
  console.error('Example: node scripts/lint-story.js story.txt');
  process.exit(1);
}

// ── Extract candidate words ──────────────────────────────────
const bracketed = [...text.matchAll(/\{([\w-]+)\}/g)].map(m => m[1].toLowerCase());
let words;
if (bracketed.length && !args.includes('--all')) {
  words = bracketed;                       // author already marked intended words
} else {
  words = (text.toLowerCase().match(/[a-z][a-z'-]*/g) || [])
    .filter(w => !STOPWORDS.has(w) && w.length > 1);
}
const unique = [...new Set(words)];

// ── Load WLASL ───────────────────────────────────────────────
console.log('Reading WLASL_v0.3.json …\n');
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const glossMap = new Map();
data.forEach(e => glossMap.set(e.gloss.toLowerCase(), e));

// ── Classify ─────────────────────────────────────────────────
const coverable = [];   // gloss + mp4
const glossOnly = [];   // gloss, no mp4
const fingerspell = []; // not in WLASL

unique.forEach(word => {
  const entry = glossMap.get(word);
  if (!entry) { fingerspell.push(word); return; }
  const mp4s = entry.instances.filter(i => i.url && i.url.toLowerCase().endsWith('.mp4'));
  if (mp4s.length) coverable.push({ word, n: mp4s.length });
  else glossOnly.push(word);
});

// ── Report ───────────────────────────────────────────────────
const pct = n => unique.length ? Math.round((100 * n) / unique.length) : 0;

console.log(`Linted ${unique.length} word(s)${tokensOnly || bracketed.length ? ' (from {bracketed} tokens)' : ' (all content words)'}\n`);

console.log(`✅ COVERABLE — clickable now (${coverable.length}, ${pct(coverable.length)}%)`);
coverable.forEach(c => console.log(`   ${c.word}  (${c.n} mp4)`));

console.log(`\n⚠  GLOSS-ONLY — sign exists in WLASL, no direct mp4 (${glossOnly.length}, ${pct(glossOnly.length)}%)`);
glossOnly.forEach(w => console.log(`   ${w}`));

console.log(`\n✋ FINGERSPELL — not in WLASL, Phase 2 fallback (${fingerspell.length}, ${pct(fingerspell.length)}%)`);
fingerspell.forEach(w => console.log(`   ${w}`));

// ── Paste-ready output for build-lookup.js ───────────────────
if (coverable.length) {
  const list = coverable.map(c => `'${c.word}'`).join(', ');
  console.log(`\n── Add these to VOCAB_WORDS in scripts/build-lookup.js, then re-run it ──`);
  console.log(`   ${list}`);
}

console.log('');
