// Silly Songs (mad libs): pick silly words first, then sing the song and find out where they went.
// The songs come from Song Party's song list (the public song-party-data repo): any song whose lyrics mark
// words with curly brackets, like {burning|describe} or ring of {fire|things}. After the | is the kind of word
// that fits there (SILLY_KINDS; plain {thing} means one thing). Every {fire} in the song gets the same pick.
// Like real Mad Libs, the pick screen never shows the lyrics: just "Pick a describing word!" and a board of
// only the words that fit. Then the song opens as a book, with the picks highlighted beside their pictures.
// The kinds and boards are the same as Song Party's madlib.js; change both together.
// Pictures are Song Party's emoji pictures (pics.js, pics/).

const SILLY_KINDS = {
  // One thing (it fits after "a").
  thing: { ask: 'Pick a thing!', items: [
    ['pizza', 'pizza'], ['banana', 'banana'], ['cake', 'cake'], ['donut', 'donut'], ['cookie', 'cookie'], ['hamburger', 'hamburger'],
    ['carrot', 'carrot'], ['pickle', 'pickle'], ['duck', 'duck'], ['frog', 'frog'], ['cat', 'cat'], ['dog', 'dog'],
    ['pig', 'pig'], ['cow', 'cow'], ['monkey', 'monkey'], ['chicken', 'chicken'], ['dinosaur', 'dinosaur'], ['unicorn', 'unicorn'],
    ['shoe', 'shoe'], ['hat', 'hat'], ['teddy bear', 'teddy'], ['balloon', 'balloon'], ['robot', 'robot'], ['guitar', 'guitar'],
  ] },
  // Lots of something (it fits after "of" or "lots of").
  things: { ask: 'Pick lots of something!', items: [
    ['spaghetti', 'spaghetti'], ['popcorn', 'popcorn'], ['cheese', 'cheese'], ['pickles', 'pickle'], ['french fries', 'fries'], ['pancakes', 'pancakes'],
    ['cupcakes', 'cupcake'], ['grapes', 'grapes'], ['bananas', 'banana'], ['cookies', 'cookie'], ['donuts', 'donut'], ['ice cream', 'ice cream'],
    ['pudding', 'pudding'], ['chocolate', 'chocolate'], ['candy', 'candy'], ['bubbles', 'bubbles'], ['socks', 'socks'], ['frogs', 'frog'],
    ['ducks', 'duck'], ['bugs', 'bug'], ['worms', 'worm'], ['kittens', 'cat'], ['puppies', 'dog'], ['flowers', 'flower'],
  ] },
  // A describing word (none start with a vowel, so "a" never needs to change).
  describe: { ask: 'Pick a describing word!', items: [
    ['stinky', 'skunk'], ['sparkly', 'sparkles'], ['sticky', 'honey'], ['slimy', 'snail'], ['spooky', 'ghost'], ['sleepy', 'sleepy'],
    ['silly', 'silly'], ['happy', 'happy'], ['grumpy', 'angry'], ['freezing', 'freezing'], ['spicy', 'pepper'], ['wiggly', 'worm'],
    ['bouncy', 'basketball'], ['fluffy', 'sheep'], ['giant', 'elephant'], ['tiny', 'ant'], ['crunchy', 'carrot'], ['shiny', 'star'],
    ['jiggly', 'pudding'], ['soggy', 'droplets'], ['fuzzy', 'peach'], ['noisy', 'loudspeaker'], ['squeaky', 'mouse'], ['juicy', 'watermelon'],
  ] },
};

// ---------- The songs (from Song Party) ----------

const SILLY_URL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? 'https://www.davyrockett.com/song-party-data/data.json' : '/song-party-data/data.json';
let sillySongs = store.get('silly', []);   // the last copy, so they still open with no signal

function loadSilly() {
  return fetch(`${SILLY_URL}?t=${Date.now()}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
    .then((d) => {
      sillySongs = Object.entries(d.items || {})
        .filter(([, s]) => s.type === 'song' && !s.deleted && !s.activity && /\{[^{}]+\}/.test(s.lyrics || ''))
        // "Hound Dog (Silly Words)" is just "Hound Dog" here: every song in this list is a silly one.
        .map(([id, s]) => ({ id, title: s.title.replace(/\s*\(silly words\)$/i, ''), pic: s.pic, lyrics: s.lyrics }))
        .sort((a, b) => a.title.localeCompare(b.title));
      store.set('silly', sillySongs);
      return true;
    })
    .catch(() => false);
}

// "fire|things" → { word: 'fire', key: 'fire', kind: 'things' }
function parseSwap(raw) {
  const [word, kind = ''] = String(raw).split('|').map((x) => x.trim());
  return { word, key: word.toLowerCase(), kind: SILLY_KINDS[kind.toLowerCase()] ? kind.toLowerCase() : 'thing' };
}
function sillyItem(word) {
  for (const k of Object.values(SILLY_KINDS)) { const it = k.items.find((x) => x[0] === word); if (it) return { word, pic: it[1] }; }
  return { word, pic: word };
}
// The marked words in the order they first come up, and what kind each one is.
function songSwaps(song) {
  const out = { blanks: [], kinds: [] };
  for (const m of song.lyrics.matchAll(/\{([^{}]+)\}/g)) {
    const w = parseSwap(m[1]);
    if (w.key && !out.blanks.includes(w.key)) { out.blanks.push(w.key); out.kinds.push(w.kind); }
  }
  return out;
}
const picImg = (name, cls = '') => `<img class="${cls}" src="${picUrl(name) || picUrl('notes')}" alt="">`;

// ---------- Picking, then singing ----------

// The song being played: its marked words, their kinds, and the group's picks (the blank itself = kept the real word).
let silly = null;

function sillyScreen(id, mode, pageNum) {
  if (!id) return sillyListScreen();
  const song = sillySongs.find((s) => s.id === id);
  if (!song) return go('#/silly', true);
  if (!silly || silly.song.id !== id || mode === 'new') silly = { song, ...songSwaps(song), picks: [] };
  if (mode === 'new') return go(`#/silly/${id}`, true);
  const ready = silly.picks.length >= silly.blanks.length;
  if (mode === 'sing' && ready) return sillySing(pageNum || 0);
  if (mode === 'done' && ready) return sillyDone();
  if (mode) return go(`#/silly/${id}`, true);
  if (ready) silly.picks = [];
  sillyPick();
}

function sillyListScreen() {
  const draw = (loading) => show(`<div class="screen">
    <div class="topbar">${homeBtn()}<div class="title"><h2>Silly Songs</h2><p>Pick silly words, then sing the song.</p></div>${settingsBtn}</div>
    ${sillySongs.length ? `<div class="tiles">${sillySongs.map((s) => `
      <a class="tile" href="#/silly/${s.id}">
        <div class="thumb">${sillyThumb(s)}</div>
        <div class="label"><h3>${esc(s.title)}</h3><p>${songSwaps(s).blanks.length} silly words</p></div>
      </a>`).join('')}</div>`
      : `<p class="silly-empty">${loading ? 'Getting the songs…' : 'No silly songs yet. In Song Party’s song editor, put curly brackets around the words to swap, like ring of {fire|things}.'}</p>`}
  </div>`);
  draw(true);
  loadSilly().then(() => { if (location.hash.replace(/\/$/, '') === '#/silly') draw(false); });
}

function sillyPick() {
  const s = silly, i = s.picks.length, kind = SILLY_KINDS[s.kinds[i]];
  show(`<div class="screen silly-pick">
    <div class="topbar">${homeBtn('#/silly')}<div class="title"><h2>${esc(s.song.title)}</h2><p>Word ${i + 1} of ${s.blanks.length}</p></div>${settingsBtn}</div>
    <h1 class="ask-big">${kind.ask}</h1>
    <div class="silly-grid" id="sgrid">${kind.items.map(([word, pic]) => `
      <button type="button" class="sp-tile" data-word="${esc(word)}" ${s.picks.includes(word) ? 'disabled' : ''}>${picImg(pic)}<span>${esc(word)}</span></button>`).join('')}
    </div>
    <div class="bottombar">
      <button type="button" class="big-btn prev" id="prev">${ICON.back}<span class="lbl">Back</span></button>
      <button type="button" class="big-btn" id="real">Real word</button>
      <button type="button" class="big-btn primary next" id="spin">Surprise!</button>
    </div></div>`, { awake: true, leave: () => timers.forEach(clearTimeout) });

  const grid = $('sgrid'), timers = [];
  let busy = false;
  const choose = (word, tile) => {
    if (busy) return;
    busy = true;
    if (tile) { tile.classList.add('chosen'); grid.classList.add('decided'); }
    Groove.ping(1);
    timers.push(setTimeout(() => {
      s.picks.push(word);
      if (s.picks.length < s.blanks.length) sillyPick();
      else go(`#/silly/${s.song.id}/sing/0`);
    }, tile ? 800 : 300));
  };
  grid.addEventListener('click', (e) => { const b = e.target.closest('[data-word]'); if (b && !b.disabled) choose(b.dataset.word, b); });
  $('real').onclick = () => choose(s.blanks[i]);
  $('prev').onclick = () => { if (busy) return; if (!i) return go('#/silly'); s.picks.pop(); sillyPick(); };
  // Surprise! The board lights up one picture after another, slows down, and lands on one.
  $('spin').onclick = () => {
    if (busy) return;
    const tiles = [...grid.querySelectorAll('.sp-tile:not([disabled])')];
    const land = tiles[Math.floor(Math.random() * tiles.length)];
    const path = [];
    for (let k = 0; k < 15; k++) {
      let t;
      do t = tiles[Math.floor(Math.random() * tiles.length)]; while (tiles.length > 2 && (t === path[path.length - 1] || (k === 14 && t === land)));
      path.push(t);
    }
    path.push(land);
    busy = true;
    let at = 0, prev = null;
    path.forEach((tile, k) => {
      at += 50 + k * k * 1.2;
      timers.push(setTimeout(() => {
        if (prev) prev.classList.remove('lit');
        tile.classList.add('lit');
        prev = tile;
        if (k === path.length - 1) Groove.fx('twinkle'); else Groove.ping(0.35);
      }, at));
    });
    timers.push(setTimeout(() => { busy = false; land.classList.remove('lit'); choose(land.dataset.word, land); }, at + 900));
  };
  current.keys = (e) => { if (e.key === ' ') { e.preventDefault(); $('spin').click(); } };
}

// The song in pages (a blank line starts a new one; "[Chorus]" at the top marks a chorus), long ones split in two.
function sillyPages(song) {
  const pages = [];
  song.lyrics.replace(/\r/g, '').split(/\n\s*\n/).forEach((block) => {
    let lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const chorus = /^\[chorus\]$/i.test(lines[0] || '');
    if (chorus) lines = lines.slice(1);
    const half = lines.length > 6 ? Math.ceil(lines.length / 2) : lines.length;
    for (let k = 0; k < lines.length; k += half) pages.push({ part: chorus ? 'chorus' : 'verse', lines: lines.slice(k, k + half) });
  });
  return pages;
}
function swapFor(raw) {
  const w = parseSwap(raw), i = silly.blanks.indexOf(w.key), p = silly.picks[i];
  if (!p || p === silly.blanks[i]) return null;
  const it = sillyItem(p);
  return { word: /^[A-Z]/.test(w.word) ? it.word[0].toUpperCase() + it.word.slice(1) : it.word, pic: it.pic };
}
// "a" or "an" before a swapped word ("a unicorn", "an egg").
const fixArticle = (before, word) => before.replace(/\b(a|an)(\s+)$/i, (m, art, sp) => {
  const want = /^(?!uni|use|eu|one)[aeiou]/i.test(word) ? 'an' : 'a';
  return (art[0] === 'A' ? want[0].toUpperCase() + want.slice(1) : want) + sp;
});
function sillyLine(line) {
  const text = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');   // Song Party's magic words are just words here
  let out = '', last = 0;
  for (const m of text.matchAll(/\{([^{}]+)\}/g)) {
    const s = swapFor(m[1]);
    out += esc(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (!s) { out += esc(parseSwap(m[1]).word); continue; }
    // A comma or full stop right after the word stays with it, so it never starts the next line.
    const punct = (text.slice(last).match(/^[,.!?;:]+/) || [''])[0];
    last += punct.length;
    out = fixArticle(out, s.word) + `<span class="nw"><button type="button" class="swap" data-pic="${esc(s.pic)}">${picImg(s.pic, 'sw-pic')}${esc(s.word)}</button>${esc(punct)}</span>`;
  }
  return `<p class="line">${out}${esc(text.slice(last))}</p>`;
}
// A page's picture: the silly things sung on it, big (or the song's own picture).
function sillyArt(lines) {
  const pics = [];
  lines.forEach((l) => { for (const m of l.matchAll(/\{([^{}]+)\}/g)) { const s = swapFor(m[1]); if (s && !pics.includes(s.pic)) pics.push(s.pic); } });
  const list = pics.length ? pics : [silly.song.pic];
  return `<div class="silly-art n${Math.min(list.length, 4)}">${list.map((p, k) => `<span style="animation-delay:${-k * .7}s">${picImg(p)}</span>`).join('')}</div>`;
}

function sillySing(pageNum) {
  const s = silly, pages = sillyPages(s.song);
  let n = Math.max(0, Math.min(pages.length - 1, pageNum));
  show(`<div class="screen book silly-book">
    <div class="topbar">${homeBtn('#/silly')}<div class="title"><h2>${esc(s.song.title)}</h2><p id="page-count"></p></div>${settingsBtn}</div>
    <div class="page" id="page"><div class="art-wrap"><div class="art silly-stage" id="art"></div></div><div class="words" id="words"></div></div>
    <div class="dots" id="dots">${pages.map(() => '<span></span>').join('')}</div>
    <div class="bottombar">
      <button type="button" class="big-btn prev" id="prev">${ICON.back}<span class="lbl">Back</span></button>
      <span></span>
      <button type="button" class="big-btn primary next" id="next"><span class="lbl" id="next-lbl">Next</span>${ICON.next}</button>
    </div></div>`, { awake: true });

  const draw = (dir = 0) => {
    const p = pages[n], page = $('page');
    $('art').innerHTML = sillyArt(p.lines);
    const label = pages.some((pg) => pg.part === 'chorus') ? `<span class="pill ${p.part}">${p.part === 'chorus' ? 'Chorus' : 'Verse'}</span>` : '';
    $('words').innerHTML = `<div class="lyrics ${p.part}">${label}${p.lines.map(sillyLine).join('')}</div>`;
    $('page-count').textContent = `Page ${n + 1} of ${pages.length}`;
    [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i === n));
    $('prev').disabled = n === 0;
    $('next-lbl').textContent = n === pages.length - 1 ? 'Finish' : 'Next';
    if (dir) { page.classList.remove('enter'); void page.offsetWidth; page.style.setProperty('--from', dir > 0 ? '24px' : '-24px'); page.classList.add('enter'); }
    history.replaceState(null, '', `#/silly/${s.song.id}/sing/${n}`);
  };
  const turn = (dir) => {
    if (dir > 0 && n === pages.length - 1) return go(`#/silly/${s.song.id}/done`);
    n = Math.max(0, Math.min(pages.length - 1, n + dir));
    draw(dir);
  };
  $('prev').onclick = () => turn(-1);
  $('next').onclick = () => turn(1);
  // Tap a silly word: its picture wiggles. Tap a line to highlight it while you sing it.
  $('words').addEventListener('click', (e) => {
    const w = e.target.closest('.swap');
    if (w) { w.classList.remove('go'); void w.offsetWidth; w.classList.add('go'); Groove.fx('boing'); return; }
    const line = e.target.closest('.line');
    if (!line) return;
    const on = !line.classList.contains('now');
    $('words').querySelectorAll('.line').forEach((l) => l.classList.remove('now'));
    line.classList.toggle('now', on);
  });
  current.keys = (e) => { if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); };
  draw();
}

function sillyDone() {
  const s = silly;
  const shown = s.picks.filter((p, i) => p !== s.blanks[i]).map(sillyItem);
  show(`<div class="screen silly-done">
    <div class="topbar">${homeBtn('#/silly')}<div class="title"><h2>${esc(s.song.title)}</h2></div>${settingsBtn}</div>
    <h1 class="ask-big">Our silly words!</h1>
    <div class="silly-words">${shown.map((it, k) => `<div style="animation-delay:${-k * .5}s">${picImg(it.pic)}<span>${esc(it.word)}</span></div>`).join('') || picImg(s.song.pic)}</div>
    <div class="choose-bar">
      <a class="big-btn" href="#/silly/${s.song.id}/sing/0">${ICON.again}Sing it again</a>
      <a class="big-btn primary" href="#/silly/${s.song.id}/new">Pick new words</a>
    </div></div>`);
  Groove.fx('cheer');
}

// ---------- Pictures for the menu, song list and Choice Board ----------

// A song's tile: its picture on a bright background.
const sillyThumb = (s) => `<svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#EBDDFB"/>
  <image href="${picUrl(s.pic) || picUrl('notes')}" x="130" y="80" width="140" height="140"/></svg>`;
// The menu tile: three silly things and a big question mark.
const sillyMenuThumb = () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#EBDDFB"/>
  <g transform="translate(36 150) scale(1.05)">${OBJECTS.pizza.draw()}</g><g transform="translate(260 150) scale(1.05)">${OBJECTS.duck.draw()}</g>
  <g transform="translate(150 40) scale(.9)">${OBJECTS.balloon.draw()}</g>
  <text x="200" y="250" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="120" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke">?</text></svg>`;

// Keep the songs fresh for the Choice Board too.
window.addEventListener('DOMContentLoaded', () => { loadSilly(); });
