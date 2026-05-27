// ════════════════════════════════════════════════════════════
//  SCENE_BUILDERS — one inline-SVG builder per scene
// ════════════════════════════════════════════════════════════
//
//  Extracted from app.js in the Session 6 refactor. Loaded by
//  index.html as a global *before* app.js.
//
//  Each entry is a () → string function that returns the inline SVG for
//  one scene. Stories pick a builder via their `sceneBuilder` key
//  (data/stories.js). Stories without a `sceneBuilder` (or with one not
//  found here) render with a hidden scene banner — see renderScene() in
//  app.js for the fallback path.
//
//  Interactive object conventions:
//    - <g class="interactive-object" data-word="…" role="button" tabindex="0">
//    - `data-word` MUST exist in VOCABULARY (else click does nothing useful
//      and the dev validator warns).
//    - A <text class="obj-label"> nearby acts as the always-visible label.
//
//  Scaling note (carried from HANDOVER §"Session 4 follow-up"):
//    Hand-built SVGs don't scale beyond ~3–4 scenes. Long-run scene art
//    is an open question (peer/professor input). For Session 6, the four
//    new stories (Airport / Restaurant / Classroom / Phone) intentionally
//    have NO sceneBuilder — the architecture handles that gracefully and
//    the demo focuses on narration + clickable vocab for those.
// ════════════════════════════════════════════════════════════
const SCENE_BUILDERS = {
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

  clinic: () => `
  <svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive clinic scene with clickable door, bed, chair, mask, thermometer and phone">
    <defs>
      <linearGradient id="clinicWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4f8fb"/>
        <stop offset="1" stop-color="#e3edf3"/>
      </linearGradient>
      <linearGradient id="clinicFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d6dde2"/>
        <stop offset="1" stop-color="#bcc6cd"/>
      </linearGradient>
      <linearGradient id="clinicSun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bedPad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e9f0f6"/>
        <stop offset="1" stop-color="#c9d6e0"/>
      </linearGradient>
      <linearGradient id="bedSheet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#e8eef3"/>
      </linearGradient>
      <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8ddc8"/>
        <stop offset="1" stop-color="#cdb98f"/>
      </linearGradient>
      <linearGradient id="maskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#bfe2ff"/>
        <stop offset="1" stop-color="#7eb5e0"/>
      </linearGradient>
      <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2c2c30"/>
        <stop offset="1" stop-color="#101012"/>
      </linearGradient>
      <linearGradient id="thermoFill" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#d33a3a"/>
        <stop offset="1" stop-color="#f08585"/>
      </linearGradient>
    </defs>

    <!-- Wall + floor -->
    <rect x="0" y="0"   width="960" height="380" fill="url(#clinicWall)"/>
    <rect x="0" y="380" width="960" height="160" fill="url(#clinicFloor)"/>
    <line x1="0" y1="380" x2="960" y2="380" stroke="#9ba8b3" stroke-width="1.4" opacity="0.5"/>

    <!-- Soft window light from top-left -->
    <polygon points="0,80 220,80 380,420 0,420" fill="url(#clinicSun)" opacity="0.65"/>

    <!-- Wall-mounted clock (decorative, non-interactive) -->
    <g opacity="0.85">
      <circle cx="700" cy="120" r="34" fill="#ffffff" stroke="#9ba8b3" stroke-width="2"/>
      <circle cx="700" cy="120" r="2.5" fill="#1a1a1a"/>
      <line x1="700" y1="120" x2="700" y2="98"  stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="700" y1="120" x2="716" y2="120" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- Wall-mounted poster / medical cross (decorative) -->
    <g opacity="0.9">
      <rect x="60" y="80" width="90" height="120" rx="4" fill="#ffffff" stroke="#9ba8b3" stroke-width="1.5"/>
      <rect x="92" y="108" width="26" height="64" rx="3" fill="#e74c4c"/>
      <rect x="73" y="127" width="64" height="26" rx="3" fill="#e74c4c"/>
    </g>

    <!-- Floor shadow under bed + chair -->
    <ellipse cx="480" cy="510" rx="360" ry="10" fill="#000" opacity="0.07"/>

    <!-- DOOR (interactive) -->
    <g id="obj-door" class="interactive-object" data-word="door" role="button" tabindex="0" aria-label="door">
      <rect x="820" y="180" width="110" height="220" rx="3" fill="url(#doorGrad)" stroke="#8c7654" stroke-width="1.6"/>
      <rect x="830" y="194" width="42"  height="78"  rx="2" fill="#b89c70" opacity="0.45"/>
      <rect x="878" y="194" width="42"  height="78"  rx="2" fill="#b89c70" opacity="0.45"/>
      <rect x="830" y="282" width="42"  height="100" rx="2" fill="#b89c70" opacity="0.45"/>
      <rect x="878" y="282" width="42"  height="100" rx="2" fill="#b89c70" opacity="0.45"/>
      <circle cx="908" cy="296" r="3.5" fill="#3b2a14"/>
    </g>
    <text class="obj-label" x="875" y="174" text-anchor="middle">door</text>

    <!-- BED (interactive exam bed) -->
    <g id="obj-bed" class="interactive-object" data-word="bed" role="button" tabindex="0" aria-label="exam bed">
      <!-- frame -->
      <rect x="300" y="332" width="360" height="14" rx="3" fill="#7d8a93"/>
      <!-- pad -->
      <rect x="306" y="300" width="348" height="38" rx="6" fill="url(#bedPad)" stroke="#8da0ab" stroke-width="1"/>
      <!-- sheet draped over -->
      <rect x="316" y="296" width="328" height="14" rx="3" fill="url(#bedSheet)" stroke="#c5d2db" stroke-width="0.8"/>
      <!-- pillow at head (left side) -->
      <rect x="320" y="286" width="84" height="22" rx="6" fill="#ffffff" stroke="#c5d2db" stroke-width="1"/>
      <!-- legs -->
      <rect x="314" y="346" width="10" height="68" rx="2" fill="#5d6970"/>
      <rect x="636" y="346" width="10" height="68" rx="2" fill="#5d6970"/>
      <!-- rolled paper sheet hanging off the right end -->
      <path d="M644 312 q14 6 12 22 q-2 10 -10 14" fill="none" stroke="#c5d2db" stroke-width="1.2"/>
    </g>
    <text class="obj-label" x="480" y="282" text-anchor="middle">bed</text>

    <!-- CHAIR (waiting / exam chair — interactive) -->
    <g id="obj-chair" class="interactive-object" data-word="chair" role="button" tabindex="0" aria-label="chair">
      <!-- back -->
      <rect x="180" y="232" width="60" height="140" rx="6" fill="#5c7a96"/>
      <rect x="186" y="244" width="48" height="8"  rx="3" fill="#3f5a73" opacity="0.55"/>
      <!-- seat -->
      <rect x="166" y="372" width="88" height="18" rx="4" fill="#6a89a5"/>
      <rect x="166" y="386" width="88" height="4"  fill="#3f5a73" opacity="0.45"/>
      <!-- legs -->
      <rect x="174" y="390" width="8" height="60" rx="2" fill="#3f5a73"/>
      <rect x="238" y="390" width="8" height="60" rx="2" fill="#3f5a73"/>
    </g>
    <text class="obj-label" x="210" y="226" text-anchor="middle">chair</text>

    <!-- TEMPERATURE (thermometer — interactive) -->
    <g id="obj-temperature" class="interactive-object" data-word="temperature" role="button" tabindex="0" aria-label="thermometer">
      <!-- shaft -->
      <rect x="494" y="252" width="12" height="48" rx="5" fill="#ffffff" stroke="#9aa0a6" stroke-width="1.2"/>
      <!-- mercury fill -->
      <rect x="497" y="266" width="6" height="34" fill="url(#thermoFill)"/>
      <!-- bulb -->
      <circle cx="500" cy="306" r="10" fill="url(#thermoFill)" stroke="#9aa0a6" stroke-width="1"/>
      <!-- tick marks -->
      <line x1="510" y1="262" x2="516" y2="262" stroke="#5c6770" stroke-width="1"/>
      <line x1="510" y1="272" x2="516" y2="272" stroke="#5c6770" stroke-width="1"/>
      <line x1="510" y1="282" x2="516" y2="282" stroke="#5c6770" stroke-width="1"/>
      <line x1="510" y1="292" x2="516" y2="292" stroke="#5c6770" stroke-width="1"/>
    </g>
    <text class="obj-label" x="500" y="246" text-anchor="middle">temperature</text>

    <!-- MASK (surgical mask on bedside — interactive) --> <!-- Note: wrong sign of Mask. -->
    <g id="obj-mask" class="interactive-object" data-word="mask" role="button" tabindex="0" aria-label="surgical mask">
      <!-- ear loops -->
      <path d="M555 350 q-12 8 -2 24" fill="none" stroke="#7d909c" stroke-width="1.4"/>
      <path d="M615 350 q12 8 2 24"   fill="none" stroke="#7d909c" stroke-width="1.4"/>
      <!-- body -->
      <path d="M555 348 q30 -10 60 0 v22 q-30 10 -60 0 z" fill="url(#maskGrad)" stroke="#5d8aae" stroke-width="1.2"/>
      <!-- pleats -->
      <line x1="558" y1="355" x2="612" y2="357" stroke="#5d8aae" stroke-width="0.7" opacity="0.65"/>
      <line x1="558" y1="361" x2="612" y2="363" stroke="#5d8aae" stroke-width="0.7" opacity="0.65"/>
      <line x1="558" y1="367" x2="612" y2="369" stroke="#5d8aae" stroke-width="0.7" opacity="0.65"/>
    </g>
    <text class="obj-label" x="585" y="392" text-anchor="middle">mask</text>

    <!-- PHONE (on bedside table — interactive) -->
    <g id="obj-phone" class="interactive-object" data-word="phone" role="button" tabindex="0" aria-label="phone">
      <!-- bedside surface under it -->
      <rect x="690" y="368" width="86" height="6" rx="2" fill="#8a96a0" opacity="0.6"/>
      <!-- phone body -->
      <rect x="708" y="320" width="50" height="48" rx="6" fill="url(#phoneGrad)" stroke="#0a0a0c" stroke-width="1"/>
      <!-- screen -->
      <rect x="713" y="326" width="40" height="36" rx="3" fill="#3b4a73"/>
      <!-- typed text lines (callback to the story moment) -->
      <line x1="717" y1="334" x2="749" y2="334" stroke="#ffffff" stroke-width="1" opacity="0.55"/>
      <line x1="717" y1="340" x2="745" y2="340" stroke="#ffffff" stroke-width="1" opacity="0.45"/>
      <line x1="717" y1="346" x2="749" y2="346" stroke="#ffffff" stroke-width="1" opacity="0.35"/>
      <!-- speaker slit -->
      <rect x="725" y="323" width="16" height="1.6" rx="0.8" fill="#0a0a0c"/>
    </g>
    <text class="obj-label" x="733" y="314" text-anchor="middle">phone</text>
  </svg>`,
};
