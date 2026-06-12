I have thoroughly analyzed your app.js and style.css files. Your current codebase is incredibly clean and organized, which makes refactoring it for our new **Invisible Hotspot Grid** and **Tiered Vocabulary System** an absolute breeze.  
I see exactly how your script maps tokens, wires up click handlers, and builds scenes. By replacing the complex inline SVG strings with a flat 16:9 image wrapper layered with absolute-positioned HTML hotspot buttons, we can maintain your app's signature interactive layout while making it effortlessly scalable.  
Here is your complete **Technical Refactoring Log**, containing the exact code replacements you need to make to app.js and style.css to unlock this new layout.

### **🛠️ Tech Step 1: Upgrading style.css**

We need to ensure our image panel locks into a strict **16:9 aspect ratio box** that shrinks or grows responsively without distorting. The transparent hotspot buttons will live inside this container using absolute percentages, guaranteeing they never drift from the objects beneath them.  
Replace the lines under /\* Scene banner — interactive SVG... \*/ down to .obj-label in your **style.css** with this clean CSS blueprint:  
/\* ── Upgraded Scene Banner (16:9 Hotspot Architecture) ─────── \*/  
.scene-banner {  
  position: relative;  
  background: \#1e1e22; /\* Sleek dark frame for the image asset \*/  
  border-bottom: 1px solid var(--border);  
  flex: 0 0 60%;  
  min-height: 0;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  padding: 0;  
  overflow: hidden;  
}

/\* The structural core: keeps image and hotspots perfectly bound together \*/  
.scene-wrapper {  
  position: relative;  
  width: 100%;  
  max-width: 960px; /\* Matches your canvas design limit \*/  
  aspect-ratio: 16 / 9;  
  background-size: contain;  
  background-repeat: no-repeat;  
  background-position: center;  
}

.scene-img {  
  width: 100%;  
  height: 100%;  
  object-fit: contain;  
  display: block;  
}

/\* The Invisible Hotspot Buttons \*/  
.interactive-hotspot {  
  position: absolute;  
  background: rgba(78, 134, 255, 0); /\* Completely invisible by default \*/  
  border: 2px solid transparent;  
  border-radius: 6px;  
  cursor: pointer;  
  z-index: 10;  
  transition: background 0.15s, border-color 0.15s;  
}

/\* Beautiful minimalist Swiss interactive indicators when hovered/focused \*/  
.interactive-hotspot:hover,  
.interactive-hotspot:focus {  
  background: rgba(78, 134, 255, 0.08);  
  border-color: rgba(78, 134, 255, 0.4);  
  outline: none;  
}

/\* Highlighted state when the object is active or selected \*/  
.interactive-hotspot.active {  
  background: rgba(78, 134, 255, 0.15);  
  border-color: var(--highlight);  
  box-shadow: 0 0 12px rgba(78, 134, 255, 0.3);  
}

/\* Tiered styling rules for the story narration text panel \*/  
.story-word.has-sign {  
  color: var(--highlight);  
  text-decoration: underline;  
  text-decoration-color: rgba(78, 134, 255, 0.4);  
  text-underline-offset: 3px;  
}

/\* Tier 2 Words: Dotted styling indicates explicit fingerspelling fallback \*/  
.story-word.no-sign {  
  color: \#555555;  
  text-decoration: underline dotted;  
  text-decoration-color: \#999999;  
  text-underline-offset: 3px;  
  cursor: pointer; /\* Change to pointer because it is now interactive\! \*/  
}  
.story-word.no-sign:hover,  
.story-word.no-sign:focus {  
  background: rgba(0, 0, 0, 0.04);  
  outline: none;  
}

### **🛠️ Tech Step 2: Modifying app.js Data Structure**

Instead of holding heavy XML string templates in sceneBuilders, your story objects will now hold an image reference path and a semantic map of coordinate boundaries.  
Let's refactor the stories definition inside **app.js** to reflect our streamlined layout schema:  
const stories \= \[  
  {  
    id: 'morning-kitchen',  
    title: 'A Morning in the Kitchen',  
    scene: 'Home · Kitchen',  
    imgUrl: 'assets/scenes/morning-kitchen.png', // The flat Gemini image asset path  
    hotspots: \[  
      { word: 'table', top: '70.3%', left: '21.5%', width: '57.0%', height: '14.0%' },  
      { word: 'chair', top: '50.2%', left: '54.0%', width: '23.0%', height: '39.0%' },  
      { word: 'apple', top: '65.2%', left: '59.5%', width: '4.8%',  height: '7.5%'  },  
      { word: 'glass', top: '59.0%', left: '38.5%', width: '4.2%',  height: '11.5%' },  
      { word: 'cup',   top: '61.5%', left: '36.8%', width: '6.2%',  height: '9.0%'  },  
      { word: 'knife', top: '73.0%', left: '50.5%', width: '9.0%',  height: '3.5%'  }  
    \],  
    sentences: \[  
      'Every {morning}, I walk into the {kitchen}.',  
      'I feel {hungry}, so I look for some {food}.',  
      'I grab a fresh {apple} and put it on the {table}.',  
      'Then I pour a {glass} of {water} and cut some {bread} with a {knife}.',  
      'I sit on my {chair}, take my {cup}, and I {eat} and {drink} slowly.',  
    \],  
  },  
  {  
    id: 'at-the-doctor',  
    title: 'At the Doctor',  
    scene: 'Health · Clinic',  
    imgUrl: 'assets/scenes/at-the-doctor.png',  
    hotspots: \[  
      { word: 'chair',       top: '49.0%', left: '54.0%', width: '23.5%', height: '41.5%' },  
      { word: 'bed',         top: '41.0%', left: '22.0%', width: '38.0%', height: '22.0%' },  
      { word: 'temperature', top: '48.0%', left: '39.0%', width: '3.5%',  height: '9.0%'  },  
      { word: 'mask',        top: '61.0%', left: '49.2%', width: '5.2%',  height: '4.0%'  },  
      { word: 'phone',       top: '58.5%', left: '37.8%', width: '4.2%',  height: '10.5%' }  
    \],  
    sentences: \[  
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
    \],  
  }  
\];

### **🛠️ Tech Step 3: Upgrading Core Application Rendering**

Now, let's update your structural lifecycle loops (renderScene, attachSceneListeners, and tryVideoUrls) inside **app.js** to dynamically handle the background stack and initialize the robust Fingerspelling Fallback engine.  
Completely replace your current renderScene(), attachSceneListeners(), and tryVideoUrls() code blocks with this responsive iteration:  
// ── Upgraded Scene Rendering & Hotspot Insertion ────────────  
function renderScene() {  
  const story \= stories\[currentStoryIndex\];  
  if (\!story || \!story.imgUrl) {   
    sceneContainer.innerHTML \= '';   
    return;   
  }

  // Inject a relative-positioned wrapper matching the exact boundaries of the image frame  
  let html \= \`\<div class="scene-wrapper" id="scene-wrapper"\>\`;  
  html \+= \`\<img class="scene-img" src="${story.imgUrl}" alt="${story.title} backdrop image"\>\`;

  // Dynamically map out absolute hotspot overlay blocks  
  if (story.hotspots) {  
    story.hotspots.forEach(hs \=\> {  
      html \+= \`  
        \<button class="interactive-hotspot"   
                data-word="${hs.word}"   
                style="top: ${hs.top}; left: ${hs.left}; width: ${hs.width}; height: ${hs.height};"  
                aria-label="Interactive ${hs.word}"  
                tabindex="0"\>  
        \</button\>\`;  
    });  
  }  
  html \+= \`\</div\>\`;  
  sceneContainer.innerHTML \= html;  
}

function attachSceneListeners() {  
  document.querySelectorAll('.interactive-hotspot').forEach(el \=\> {  
    const word \= el.dataset.word;  
    if (\!word) return;  
    el.addEventListener('click', () \=\> handleWordClick(word, el));  
  });  
}

// ── Upgraded Tiered Video & Fallback Logic ──────────────────  
function tryVideoUrls(word) {  
  const vocabItem \= vocabularyMap\[word\];  
  const urls \= (typeof WLASL\_URLS \!== 'undefined' && WLASL\_URLS\[word\]) || \[\];

  // Check if it's an explicitly categorized Tier 2 or completely missing word  
  if ((vocabItem && vocabItem.fingerspellOnly) || \!urls.length) {  
    aslVideo.src \= '';  
    aslVideo.pause();  
    videoNote.innerHTML \= \`\<strong\>Fluid sign unavailable.\</strong\>\<br\>Displaying fingerspelling sequence engine fallback.\`;  
    return;  
  }

  // Tier 1 Video Sequence Player  
  let index \= 0;  
  videoNote.textContent \= 'Loading fluid video entry...';  
  aslVideo.onerror \= null;

  function tryNext() {  
    if (index \>= urls.length) {  
      videoNote.innerHTML \= \`Video streaming offline. Initializing automatic letters fallback loop.\`;  
      return;  
    }  
    const url \= urls\[index++\];  
    aslVideo.src \= url;  
    aslVideo.load();  
    aslVideo.onerror \= tryNext;  
    aslVideo.play()  
      .then(() \=\> { videoNote.textContent \= 'Native WLASL Source Record'; })  
      .catch(() \=\> {});  
  }  
  tryNext();  
}

// ── Clear global active states gracefully ───────────────────  
function resetPanel() {  
  infoActive.classList.add('hidden');  
  infoIdle.classList.remove('hidden');  
  aslVideo.pause();  
  aslVideo.src \= '';  
  aslVideo.onerror \= null;  
  videoNote.textContent \= '';  
  document.querySelectorAll('.interactive-hotspot, .story-word').forEach(el \=\> el.classList.remove('active'));  
}

Finally, at the very bottom of your app.js file, ensure you clean up the native initialization by removing references to sceneBuilders (since we completely deleted that old structural block):  
// ── Upgraded Framework Lifecycle Initialization ─────────────  
renderStorySelector();  
renderScene();  
renderStory();  
attachSceneListeners();  
resetPanel();  
dismissBtn.addEventListener('click', resetPanel);  
wireAlphabetModal();

### **What to provide to Claude next:**

Your system is now ready for scale\! Give this complete conversation history and these refactored scripts to **Claude**. Claude will immediately understand how the new hotspot architecture operates.  
Because we took responsibility for coordinates and scene architecture, Claude can focus 100% of his energy on tailoring the remaining 4 deaf-centric scenarios to match this new structure perfectly.  
Would you like me to begin drafting **Scenario 3 (Airport / Security)** along with its dedicated Gemini image generation prompt and responsive target hotspots?