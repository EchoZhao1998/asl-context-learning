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

  // ── Airport / Restaurant / Classroom / Phone stories ──
  // (Session 6 — placeholder coverage. None of these are in
  //  wlasl-urls.js yet. They are intentionally left OUT of VOCABULARY
  //  so the dev-only validator in app.js can list them as the next
  //  vocab-extension batch. To wire one up:
  //    1. Add an entry above with `{ word: '<gloss>' }`.
  //    2. Add the gloss to VOCAB_WORDS in scripts/build-lookup.js.
  //    3. Run `node scripts/build-lookup.js`.
  //  Until then, those words still appear in the prose — they just
  //  render as `.no-sign` and the validator warns once at boot.)
};
