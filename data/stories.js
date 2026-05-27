// ════════════════════════════════════════════════════════════
//  STORIES — narration data + lesson metadata
// ════════════════════════════════════════════════════════════
//
//  Extracted from app.js in the Session 6 refactor. Loaded by
//  index.html as a global *before* app.js. Order in this array drives
//  the order shown in the story-selector dropdown.
//
//  Schema:
//    {
//      id:           string  — kebab-case slug, used in DOM IDs.
//      title:        string  — shown in the dropdown + story header.
//      scene:        string  — breadcrumb subtitle ("Domain · Place").
//      sceneBuilder: string? — optional key into SCENE_BUILDERS
//                              (data/scenes.js). When omitted, the scene
//                              banner is hidden — narration occupies the
//                              full left column.
//      category:     string  — semantic cluster (home / health / travel
//                              / food / education / communication).
//                              Used later for filtering / learning paths.
//      difficulty:   string  — placeholder slot for a future learning
//                              path. All six are currently "beginner"
//                              (first-person present-tense, simple
//                              grammar). Revisit when scenarios get
//                              harder.
//      targetWords:  string[] — the "vocabulary cluster" for this
//                              scenario, per the HANDOVER tone rule
//                              ("A vocabulary cluster per scenario").
//                              For Doctor/Airport/Restaurant/Classroom/
//                              Phone these are the **bolded** words from
//                              stories.md. For Kitchen there are no bold
//                              marks (it predates stories.md), so the
//                              scene-interactive words double as the
//                              cluster.
//      sentences:    string[] — each sentence; words in {curly braces}
//                              become clickable spans at render time
//                              (parseStory in app.js). Words in
//                              {braces} that are missing from VOCABULARY
//                              still render — they just lack the
//                              .has-sign underline and the dev
//                              validator console-warns the gap.
//    }
//
//  Authoring workflow (carried from HANDOVER):
//    1. Draft narration as plain text.
//    2. `node scripts/lint-story.js draft.txt` → see coverable / gloss-
//       only / fingerspell breakdown.
//    3. Add the story object here.
//    4. Add new words to VOCABULARY (data/vocabulary.js) AND to
//       VOCAB_WORDS in scripts/build-lookup.js.
//    5. Run `node scripts/build-lookup.js` to regenerate wlasl-urls.js.
//    6. (Optional) write a SCENE_BUILDERS entry — see data/scenes.js.
// ════════════════════════════════════════════════════════════
const STORIES = [
  // ── 1. Kitchen (Session 1 baseline) ─────────────────────────
  {
    id: 'morning-kitchen',
    title: 'A Morning in the Kitchen',
    scene: 'Home · Kitchen',
    sceneBuilder: 'kitchen',
    category: 'home',
    difficulty: 'beginner',
    // No bold-marked source for this story (predates stories.md). The
    // scene-interactive vocabulary doubles as the lesson cluster.
    targetWords: ['apple', 'table', 'chair', 'glass', 'cup', 'knife', 'food', 'water'],
    sentences: [
      'Every {morning}, I walk into the {kitchen}.',
      'I feel {hungry}, so I look for some {food}.',
      'I grab a fresh {apple} and put it on the {table}.',
      'Then I pour a {glass} of {water} and cut some {bread} with a {knife}.',
      'I sit on my {chair}, take my {cup}, and I {eat} and {drink} slowly.',
    ],
  },

  // ── 2. Doctor (Session 5) ───────────────────────────────────
  {
    id: 'at-the-doctor',
    title: 'At the Doctor',
    scene: 'Health · Clinic',
    sceneBuilder: 'clinic',
    category: 'health',
    difficulty: 'beginner',
    // Bold words from stories.md (the "thank you" phrase is omitted —
    // it's a phrase, not a single-word vocab item).
    targetWords: [
      'hospital', 'sick', 'tired', 'name', 'nurse', 'deaf', 'mask',
      'temperature', 'sentences', 'bad', 'winter', 'cold', 'home',
      'warm', 'safe',
    ],
    sentences: [
      'I {sit} on the {tall} {chair} in the {quiet} {hospital} {room}.',
      'I {feel} {very} {sick} and {tired} {today}.',
      'I {keep} my {eyes} on the {door} {because} I {cannot} {hear} my {name}.',
      'Soon, the {nurse} waves her hand to {call} me in.',
      'I {enter} the {room} and {sit} on the {tall} {chair}.',
      'Because I am {deaf}, the kind {doctor} pulls {down} her {mask} so I can {see} her {lips}.',
      'She checks my {temperature}.',
      'She writes {sentences} on a notepad to {explain} my {bad} {winter} {cold}.',
      'She tells me to {go} {home} immediately, {drink} {warm} {water}, and {rest} in a {comfortable} {bed}.',
      'I {type} "thank you" on my {phone}.',
      'This visual {visit} makes me {feel} {safe}.',
    ],
  },

  // ── 3. Airport (Session 6 — new, no scene yet) ──────────────
  {
    id: 'at-the-airport',
    title: 'At the Airport',
    scene: 'Travel · Airport',
    // sceneBuilder intentionally omitted — narration runs full-column.
    category: 'travel',
    difficulty: 'beginner',
    targetWords: [
      'airport', 'bag', 'passport', 'ticket', 'people', 'screen',
      'look', 'gate', 'walk', 'write', 'phone', 'seat', 'plane',
    ],
    sentences: [
      'I walk into the busy {airport} with my {bag} and {passport}.',
      'I show my {ticket} at the counter.',
      'Many {people} move around me.',
      'I keep my eyes on the large {screen} because I cannot hear announcements.',
      'I {look} for my {gate}, but people suddenly start to {walk} in another direction.',
      'I feel confused.',
      'I tap a traveler and {write} a question on my {phone}.',
      'He points to a new {gate}.',
      'I sit in my {seat} and wait for my {plane}.',
    ],
  },

  // ── 4. Restaurant (Session 6 — new, no scene yet) ───────────
  {
    id: 'restaurant-dinner',
    title: 'The Restaurant Dinner',
    scene: 'Food · Restaurant',
    category: 'food',
    difficulty: 'beginner',
    targetWords: [
      'table', 'restaurant', 'family', 'hungry', 'menu', 'food',
      'rice', 'chicken', 'water', 'order', 'phone', 'eat',
    ],
    sentences: [
      'I sit at a large {table} in a busy {restaurant} with my {family}.',
      'I feel {hungry} after a long day.',
      'I open the {menu} and look at the {food} pictures.',
      'I choose {rice}, {chicken}, and {water}.',
      'The waiter speaks while looking down, and I cannot understand him.',
      'I point to the menu and {order} with my {phone}.',
      'Soon the food arrives, and we {eat} together.',
    ],
  },

  // ── 5. Classroom (Session 6 — new, no scene yet) ────────────
  {
    id: 'classroom-project',
    title: 'The Classroom Group Project',
    scene: 'Education · Classroom',
    category: 'education',
    difficulty: 'beginner',
    targetWords: [
      'class', 'students', 'teacher', 'group', 'project', 'table',
      'computer', 'paper', 'books', 'write', 'question', 'help', 'read',
    ],
    sentences: [
      'I sit in my {class} with other {students}.',
      'Today our {teacher} gives us a {group} {project}.',
      'We gather around a {table} with a {computer}, {paper}, and {books}.',
      'Everyone starts talking quickly.',
      'I cannot follow every conversation.',
      'I {write} a {question} on my screen and ask for {help}.',
      'My classmates {read} it and show me their ideas.',
    ],
  },

  // ── 6. Phone (Session 6 — new, no scene yet) ────────────────
  {
    id: 'phone-barrier',
    title: 'The Automated Phone Barrier',
    scene: 'Communication · Phone Call',
    category: 'communication',
    difficulty: 'beginner',
    targetWords: [
      'problem', 'bank', 'phone', 'number', 'computer', 'call',
      'time', 'questions', 'person',
    ],
    sentences: [
      'I need to solve a {problem} with my {bank} account.',
      'The website only shows a {phone} {number}.',
      'I open my {computer} and try to make a {call}.',
      'I wait for a long {time}.',
      'The system asks many {questions}, but I cannot hear the instructions.',
      'Finally, a {person} joins the conversation and helps me fix the problem.',
    ],
  },
];
