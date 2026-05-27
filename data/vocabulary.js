// ════════════════════════════════════════════════════════════
//  VOCABULARY — what makes a word clickable + how it should render
// ════════════════════════════════════════════════════════════
//
//  Extracted from app.js in the Session 6 refactor. Loaded by
//  index.html as a global *before* stories.js, scenes.js, and app.js.
//
//  Keys are the lowercase string used in story {token} markup and SVG
//  data-word attributes.
//
//  Entry shape:
//    {
//      word:            string  — passed to WLASL_URLS lookup + the
//                                 fingerspell strip.
//      fingerspellOnly: boolean — optional. true means "no WLASL video
//                                 expected"; clicking surfaces the
//                                 fingerspell strip + a "not in WLASL
//                                 dataset" video note instead of a fail
//                                 chain. Use for words that are
//                                 deliberately fingerspelled in the
//                                 narrative (e.g. mask / lips / sentences
//                                 in "At the Doctor").
//    }
//
//  How to add a word:
//    1. Add an entry below.
//    2. Add the gloss to VOCAB_WORDS in scripts/build-lookup.js.
//    3. Run `node scripts/build-lookup.js` to regenerate wlasl-urls.js.
//
//  Words referenced in a story's {tokens} but missing here will render
//  as `.no-sign` (un-clickable, no underline) AND the dev-only validator
//  in app.js will console.warn the gap so you don't ship typos silently.
// ════════════════════════════════════════════════════════════
const VOCABULARY = {
  // ── Kitchen story ──
  // Scene-interactive
  'apple':       { word: 'apple'       },
  'chair':       { word: 'chair'       },
  'table':       { word: 'table'       },
  'glass':       { word: 'glass'       },
  'cup':         { word: 'cup'         },
  'knife':       { word: 'knife'       },
  // Story-only
  'kitchen':     { word: 'kitchen'     },
  'hungry':      { word: 'hungry'      },
  'water':       { word: 'water'       },
  'morning':     { word: 'morning'     },
  'eat':         { word: 'eat'         },
  'drink':       { word: 'drink'       },
  'food':        { word: 'food'        },
  'bread':       { word: 'bread'       },

  // ── Doctor story ──
  // WLASL-covered (have video)
  'doctor':      { word: 'doctor'      },
  'sit':         { word: 'sit'         },
  'tall':        { word: 'tall'        },
  'quiet':       { word: 'quiet'       },
  'hospital':    { word: 'hospital'    },
  'room':        { word: 'room'        },
  'feel':        { word: 'feel'        },
  'very':        { word: 'very'        },
  'sick':        { word: 'sick'        },
  'tired':       { word: 'tired'       },
  'today':       { word: 'today'       },
  'keep':        { word: 'keep'        },
  'eyes':        { word: 'eyes'        },
  'door':        { word: 'door'        },
  'because':     { word: 'because'     },
  'cannot':      { word: 'cannot'      },
  'hear':        { word: 'hear'        },
  'name':        { word: 'name'        },
  'soon':        { word: 'soon'        },
  'nurse':       { word: 'nurse'       },
  'call':        { word: 'call'        },
  'enter':       { word: 'enter'       },
  'deaf':        { word: 'deaf'        },
  'down':        { word: 'down'        },
  'see':         { word: 'see'         },
  'temperature': { word: 'temperature' },
  'explain':     { word: 'explain'     },
  'bad':         { word: 'bad'         },
  'winter':      { word: 'winter'      },
  'cold':        { word: 'cold'        },
  'go':          { word: 'go'          },
  'home':        { word: 'home'        },
  'warm':        { word: 'warm'        },
  'rest':        { word: 'rest'        },
  'comfortable': { word: 'comfortable' },
  'bed':         { word: 'bed'         },
  'type':        { word: 'type'        },
  'phone':       { word: 'phone'       },
  'visit':       { word: 'visit'       },
  'safe':        { word: 'safe'        },
  // Fingerspell-only — the deaf-experience hinge in the doctor story.
  'mask':        { word: 'mask',      fingerspellOnly: true },
  'lips':        { word: 'lips',      fingerspellOnly: true },
  'sentences':   { word: 'sentences', fingerspellOnly: true },

  // ── Airport story (Session 7) ──
  // WLASL-covered. (`phone` is already defined above under Doctor.)
  'ticket':      { word: 'ticket'      },
  'people':      { word: 'people'      },
  'walk':        { word: 'walk'        },
  'write':       { word: 'write'       },
  // Fingerspell-only. Institutional travel vocabulary is mostly outside
  // WLASL — fingerspelling is the honest answer, and the deaf-traveler
  // experience genuinely involves a lot of letter-by-letter signage.
  'airport':     { word: 'airport',  fingerspellOnly: true },
  'bag':         { word: 'bag',      fingerspellOnly: true },
  'passport':    { word: 'passport', fingerspellOnly: true },
  'screen':      { word: 'screen',   fingerspellOnly: true },
  'look':        { word: 'look',     fingerspellOnly: true },
  'gate':        { word: 'gate',     fingerspellOnly: true },
  'seat':        { word: 'seat',     fingerspellOnly: true },
  'plane':       { word: 'plane',    fingerspellOnly: true },

  // ── Restaurant story (Session 7) ──
  // WLASL-covered. (`table`, `hungry`, `food`, `water`, `phone`, `eat`
  // already defined above.)
  'restaurant':  { word: 'restaurant'  },
  'family':      { word: 'family'      },
  'chicken':     { word: 'chicken'     },
  'order':       { word: 'order'       },
  // Fingerspell-only.
  'menu':        { word: 'menu',     fingerspellOnly: true },
  'rice':        { word: 'rice',     fingerspellOnly: true },

  // ── Classroom story (Session 7) ──
  // WLASL-covered. (`table` from Kitchen and `write` from Airport reused.)
  'class':       { word: 'class'       },
  'teacher':     { word: 'teacher'     },
  'group':       { word: 'group'       },
  'project':     { word: 'project'     },
  'computer':    { word: 'computer'    },
  'paper':       { word: 'paper'       },
  'question':    { word: 'question'    },
  'help':        { word: 'help'        },
  'read':        { word: 'read'        },
  // Fingerspell-only. Plurals — singulars `student` / `book` are likely
  // in WLASL; left as plural to match the narration. Swap to singular
  // forms if you'd rather have video here.
  'students':    { word: 'students', fingerspellOnly: true },
  'books':       { word: 'books',    fingerspellOnly: true },

  // ── Phone story (Session 7) ──
  // WLASL-covered. (`phone`, `computer`, `call` already defined above.)
  'problem':     { word: 'problem'     },
  'bank':        { word: 'bank'        },
  'number':      { word: 'number'      },
  'time':        { word: 'time'        },
  'person':      { word: 'person'      },
  // Fingerspell-only. Plural; singular `question` is covered above.
  'questions':   { word: 'questions', fingerspellOnly: true },
};
