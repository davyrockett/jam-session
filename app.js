// Jam Session: the menu, the songbook (picture books) and moving between screens.
// Screens are chosen by the address after # (e.g. #/song/walters-cruise/3), so the
// iPad's back gesture and a reload both keep your place.

const $ = (id) => document.getElementById(id);
const app = $('app');

const store = {
  get(key, fallback) { try { const v = localStorage.getItem('js.' + key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem('js.' + key, JSON.stringify(value)); } catch {} },
};

const ICON = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  again: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Boat colour (picked on a book's cover) ----------

const BOAT_COLOURS = [
  ['Red', '#E74C3C'], ['Orange', '#F57C14'], ['Yellow', '#F1C40F'],
  ['Green', '#27AE60'], ['Blue', '#2563EB'], ['Purple', '#8E44AD'],
];
function applyBoat(c) { document.documentElement.style.setProperty('--boat', c); }
applyBoat(store.get('boat', '#E74C3C'));

// ---------- Keep the iPad awake while an activity is open ----------

let wakeLock = null;
async function stayAwake(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && current.awake) stayAwake(true); });

// ---------- Screens ----------

const ACTIVITIES = [
  { id: 'songs', name: 'Songbook', about: 'Picture books of our songs.', thumb: () => scene('cover'), ready: true },
  { id: 'react', name: 'Cause & Effect', about: 'Play a hit, something happens.', thumb: () => THUMBS.react(), ready: true },
  { id: 'builder', name: 'Song Builder', about: 'Pick pictures, make a new song.', thumb: () => THUMBS.builder(), ready: true },
  { id: 'hello', name: 'Hello', about: 'The hello song.', thumb: () => scene('helloSun'), ready: true },
  { id: 'choice', name: 'Choice Board', about: 'What should we do next?', thumb: () => THUMBS.choice(), ready: true },
  { id: 'goodbye', name: 'Goodbye', about: 'The goodbye song.', thumb: () => scene('byeFriends'), ready: true },
];

let current = { leave() {}, awake: false };

function show(html, opts = {}) {
  current.leave();
  current = { leave: opts.leave || (() => {}), awake: Boolean(opts.awake) };
  stayAwake(current.awake);
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

const settingsBtn = `<button type="button" class="icon-btn" data-settings aria-label="Settings">${ICON.gear}</button>`;
const homeBtn = (to = '#/') => `<a class="icon-btn" href="${to}" aria-label="Back">${ICON.back}</a>`;

function menuScreen() {
  show(`<div class="screen">
    <div class="topbar"><div class="title"><h1>Jam Session</h1><p>Music activities for sessions.</p></div>${settingsBtn}</div>
    <div class="tiles menu">${ACTIVITIES.map((a) => `
      <a class="tile" ${a.ready ? `href="#/${a.id}"` : 'aria-disabled="true"'}>
        <div class="thumb">${a.thumb()}</div>
        ${a.ready ? '' : '<span class="soon">Coming soon</span>'}
        <div class="label"><h3>${a.name}</h3><p>${a.about}</p></div>
      </a>`).join('')}
    </div></div>`);
}

function allSongs() { return [...SONGS, ...store.get('songs', [])]; }

function shelfScreen() {
  show(`<div class="screen">
    <div class="topbar">${homeBtn()}<div class="title"><h2>Songbook</h2></div>${settingsBtn}</div>
    <div class="tiles">${allSongs().map((s) => `
      <a class="tile" href="#/song/${s.id}/0">
        <div class="thumb">${scene(s.cover)}</div>
        <div class="label"><h3>${esc(s.title)}</h3><p>By ${esc(s.by)}</p></div>
      </a>`).join('')}
    </div></div>`);
}

// ---------- A picture book ----------

// The name typed on the Hello / Goodbye first page. Only kept while the app is open.
let sessionName = '';
const withName = (line) => line.replace(/ ?\{name\}/, sessionName ? ` ${sessionName}` : '');

// Magic words: [word](name) in a lyric becomes a button that sets off the picture's
// parts called name (see reveal() / play() in art.js), with a sound effect.
const FX_SOUNDS = {
  bubble: 'boing', zoom: 'motor', splash: 'splash', blend: 'whirr', horn: 'horn',
  n1: 'n1', n2: 'n2', n3: 'n3', confetti: 'cheer', stars: 'twinkle', lights: 'notes', shake: 'shake',
};

function lyricLine(line) {
  const plain = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const big = plain === plain.toUpperCase() && /[A-Z]/.test(plain);   // a line in capitals, like "WHAT!?", is extra big
  const html = esc(line).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, word, name) => `<button type="button" class="magic" data-fx-word="${name}">${word}</button>`);
  return `<p class="line${big ? ' big' : ''}">${html}</p>`;
}

function fire(name) {
  const art = $('art');
  if (!art) return;
  art.querySelectorAll(`[data-fx="${name}"]`).forEach((el) => {
    if (el.classList.contains('reveal')) {
      if (el.classList.contains('shown')) { el.classList.remove('shown'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('shown'))); }
      else el.classList.add('shown');
    }
    if (el.dataset.anim) {
      if (['board', 'stepaside'].includes(el.dataset.anim) && el.classList.contains('go')) return;   // already moved
      el.classList.remove('go'); void el.getBoundingClientRect(); el.classList.add('go');
    }
  });
  Groove.fx(FX_SOUNDS[name] || 'pop');
}

// draft: a Song Builder song that isn't saved yet. It opens as a book first; Edit and the
// last page's Finish lead to the words screen.
function bookScreen(id, pageNum, draft) {
  const song = draft || [...allSongs(), ...ROUTINES].find((s) => s.id === id);
  if (!song) return go('#/songs', true);
  const backTo = draft ? '#/builder/go' : song.routine ? '#/' : '#/songs';
  const editLink = draft ? '#/builder/review' : song.id.startsWith('my-') ? `#/builder/edit/${song.id}` : '';
  const pages = [{ cover: true, scene: song.cover, part: 'verse' }, ...song.pages];
  let n = Math.max(0, Math.min(pages.length - 1, pageNum || 0));

  Groove.follow(() => pages[n].part);

  show(`<div class="screen book">
    <div class="topbar">${homeBtn(backTo)}<div class="title"><h2>${esc(song.title)}</h2><p id="page-count"></p></div>${editLink ? `<a class="icon-btn" href="${editLink}">Edit</a>` : ''}${settingsBtn}</div>
    <div class="page" id="page"><div class="art-wrap"><div class="art" id="art"></div></div><div class="words" id="words"></div></div>
    <div class="dots" id="dots">${pages.map(() => '<span></span>').join('')}</div>
    <div class="bottombar">
      <button type="button" class="big-btn prev" id="prev">${ICON.back}<span class="lbl">Back</span></button>
      <button type="button" class="big-btn music-btn" id="music" aria-pressed="false">${ICON.music}<span id="music-lbl">Music off</span></button>
      <button type="button" class="big-btn primary next" id="next"><span class="lbl" id="next-lbl">Next</span><span id="next-icon">${ICON.next}</span></button>
    </div></div>`, { awake: true, leave: () => Groove.stop() });

  function draw(dir = 0) {
    const p = pages[n];
    const page = $('page');
    $('art').innerHTML = scene(p.scene);
    if (p.cover && song.routine) {
      $('words').innerHTML = `<h1 class="cover-title">${esc(song.title)}</h1>
        <p class="ask">Who are we singing to?</p>
        <input class="name-field" id="name" type="text" autocomplete="off" autocapitalize="words" placeholder="First name" value="${esc(sessionName)}">
        <p class="by">Optional. It isn't saved.</p>`;
      $('name').addEventListener('input', (e) => { sessionName = e.target.value.trim(); });
      $('name').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.target.blur(); turn(1); } });
    } else if (p.cover) {
      const chosen = store.get('boat', '#E74C3C');
      const boatQuestion = !song.boats ? '' : `<p class="ask">What colour should the boat be?</p>
        <div class="swatches">${BOAT_COLOURS.map(([name, c]) =>
          `<button type="button" class="swatch" style="background:${c}" data-boat="${c}" aria-label="${name}" aria-pressed="${c === chosen}"></button>`).join('')}</div>`;
      $('words').innerHTML = `<h1 class="cover-title">${esc(song.title)}</h1><p class="by">By ${esc(song.by)}</p>${boatQuestion}`;
    } else {
      const label = !song.pages.some((pg) => pg.part === 'chorus') ? '' :
        `<span class="pill ${p.part}">${p.part === 'chorus' ? 'Chorus' : `Verse ${verseNumber(n)}`}</span>`;
      const lines = p.lines.map(withName).map(lyricLine).join('');
      const hint = p.lines.some((l) => l.includes('](')) ? '<p class="tip">Tap the orange words.</p>' : '';
      $('words').innerHTML = `<div class="lyrics ${p.part}">${label}${lines}${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}</div>${hint}`;
    }
    $('page-count').textContent = n === 0 ? (song.routine ? 'Start' : 'Cover') : `Page ${n} of ${pages.length - 1}`;
    [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i === n));
    $('prev').disabled = n === 0;
    const last = n === pages.length - 1;
    $('next-lbl').textContent = !last ? 'Next' : draft ? 'Finish' : 'Start over';
    $('next-icon').innerHTML = last && !draft ? ICON.again : ICON.next;
    if (dir) { page.classList.remove('enter'); void page.offsetWidth; page.style.setProperty('--from', dir > 0 ? '24px' : '-24px'); page.classList.add('enter'); }
    history.replaceState(null, '', draft ? `#/builder/preview/${n}` : `#/song/${song.id}/${n}`);
  }

  // Verse 1, 2, 3…: a new verse starts on a verse page right after the cover or a chorus.
  const verseNumber = (i) => {
    let v = 0;
    for (let k = 1; k <= i; k++) if (pages[k].part === 'verse' && (k === 1 || pages[k - 1].part === 'chorus')) v++;
    return v;
  };

  const turn = (dir) => {
    if (dir > 0 && n === pages.length - 1) { if (draft) return go('#/builder/review'); n = 0; }
    else n = Math.max(0, Math.min(pages.length - 1, n + dir));
    draw(dir);
  };
  $('prev').onclick = () => turn(-1);
  $('next').onclick = () => turn(1);
  $('words').addEventListener('click', (e) => {
    const word = e.target.closest('[data-fx-word]');
    if (word) { word.classList.add('done'); fire(word.dataset.fxWord); return; }
    // Tap a line to highlight it while you sing it.
    const line = e.target.closest('.line');
    if (line) {
      const on = !line.classList.contains('now');
      $('words').querySelectorAll('.line').forEach((l) => l.classList.remove('now'));
      line.classList.toggle('now', on);
      return;
    }
    const b = e.target.closest('[data-boat]');
    if (!b) return;
    store.set('boat', b.dataset.boat);
    applyBoat(b.dataset.boat);
    document.querySelectorAll('[data-boat]').forEach((s) => s.setAttribute('aria-pressed', s === b));
  });
  const musicBtn = $('music');
  const markMusic = () => { musicBtn.setAttribute('aria-pressed', Groove.playing); $('music-lbl').textContent = Groove.playing ? 'Music on' : 'Music off'; };
  musicBtn.onclick = async () => { if (Groove.playing) Groove.stop(); else await Groove.start(); markMusic(); };
  markMusic();

  // Swipe the picture to turn pages.
  let sx = null;
  $('art').addEventListener('pointerdown', (e) => { sx = e.clientX; });
  $('art').addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) return turn(dx < 0 ? 1 : -1);
    // A tap on someone in the picture: they hop (or do whatever their word does).
    const part = e.target.closest('[data-anim]');
    if (part) {
      const name = part.dataset.fx;
      if (name === 'tap') { part.classList.remove('go'); void part.getBoundingClientRect(); part.classList.add('go'); Groove.fx('pop'); }
      else { fire(name); $('words').querySelectorAll(`[data-fx-word="${name}"]`).forEach((w) => w.classList.add('done')); }
    }
  });
  current.keys = (e) => { if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); };

  draw();
}

// ---------- Router ----------

function go(hash, replace) {
  if (replace) history.replaceState(null, '', hash); else location.hash = hash;
  route();
}

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  current.keys = null;
  if (parts[0] === 'songs') return shelfScreen();
  if (parts[0] === 'react') return reactScreen(parts[1]);
  if (parts[0] === 'choice') return choiceScreen(parts[1]);
  if (parts[0] === 'builder') return builderScreen(parts[1], parts[2]);
  if (parts[0] === 'hello' || parts[0] === 'goodbye') return bookScreen(parts[0], 0);
  if (parts[0] === 'song') return bookScreen(parts[1], parseInt(parts[2], 10) || 0);
  menuScreen();
}

window.addEventListener('hashchange', route);
document.addEventListener('keydown', (e) => { if (current.keys && !e.target.closest('input, textarea')) current.keys(e); });
app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go]');
  if (t && !t.disabled) location.hash = t.dataset.go;
  if (e.target.closest('[data-settings]')) openSettings();
});

Groove.bpm = store.get('bpm', 92);

// Songs made on another device: fetch them when the app opens or comes back to the front,
// and redraw lists that show them.
window.addEventListener('DOMContentLoaded', () => {
  sync.onUpdated = () => {
    const where = location.hash.replace(/^#\/?/, '').split('/')[0];
    if (['', 'songs', 'choice'].includes(where)) route();
  };
  sync.run();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync.run(); });
});
// Wait until every activity's script has loaded.
window.addEventListener('DOMContentLoaded', () => { Sketch.start(); route(); });
