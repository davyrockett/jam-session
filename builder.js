// Song Builder: the client picks pictures (what we saw, its colour, what it did,
// how it felt) and the app writes a 4-page story song. David can retype any line,
// then it's saved on this iPad as a picture book in the Songbook.

const PLACES = {
  ocean: { world: 'ocean', place: 'the ocean' },
  animals: { world: 'animals', place: 'the farm' },
  vehicles: { world: 'vehicles', place: 'the city' },
  food: { world: 'party', place: 'a party' },
};

const COLOURS = [
  ['red', '#E74C3C'], ['orange', '#F57C14'], ['yellow', '#F1C40F'], ['green', '#27AE60'],
  ['blue', '#3B82F6'], ['purple', '#9B59B6'], ['pink', '#F06292'],
];

const ACTIONS = {
  jump: { line: (t) => `The ${t} jumped up high,`, shout: 'JUMP, JUMP, JUMP!', move: 'bounce',
    icon: `<path d="M14 84 Q 50 -10 86 84" stroke="#2C3E50" stroke-width="6" fill="none" stroke-dasharray="10 9" stroke-linecap="round"/><path d="M74 72 L86 86 L92 68" stroke="#2C3E50" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  zoom: { line: (t) => `The ${t} went super fast,`, shout: 'ZOOM, ZOOM, ZOOM!', move: 'zoom',
    icon: `<path d="M8 30 H54 M2 50 H62 M14 70 H50" stroke="#2C3E50" stroke-width="7" stroke-linecap="round"/><path d="M62 22 L94 50 L62 78 Z" fill="#F57C14" stroke="#2C3E50" stroke-width="4" stroke-linejoin="round"/>` },
  splash: { line: (t) => `The ${t} jumped in the water,`, shout: 'SPLASH, SPLASH, SPLASH!', move: 'bob',
    icon: `<path d="M10 80 Q 30 66 50 80 Q 70 94 90 80 L90 96 L10 96 Z" fill="#3B82F6" stroke="#2C3E50" stroke-width="3.5"/>` +
      [[50, 30, 10], [24, 44, 7], [76, 44, 7], [38, 14, 5], [64, 14, 5]].map(([x, y, r]) => `<path d="M${x} ${y - r * 1.8} Q ${x + r} ${y} ${x} ${y + r} Q ${x - r} ${y} ${x} ${y - r * 1.8} Z" fill="#5DADE2" stroke="#2C3E50" stroke-width="3"/>`).join('') },
  dance: { line: (t) => `The ${t} danced all around,`, shout: 'DANCE, DANCE, DANCE!', move: 'wiggle',
    icon: `<g fill="#9B59B6"><ellipse cx="26" cy="74" rx="12" ry="9" transform="rotate(-20 26 74)"/><rect x="34" y="20" width="6" height="54"/><ellipse cx="66" cy="64" rx="12" ry="9" transform="rotate(-20 66 64)"/><rect x="74" y="10" width="6" height="54"/><path d="M34 20 L80 10 L80 22 L34 32 Z"/></g>` },
  sleep: { line: (t) => `The ${t} went to sleep,`, shout: 'SHH, SHH, SHH!', move: '',
    icon: `<circle cx="38" cy="58" r="30" fill="#F7F3D0" stroke="#2C3E50" stroke-width="4"/><circle cx="54" cy="48" r="26" fill="#fff"/>` +
      `<text x="70" y="38" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="30" fill="#2C3E50">Z</text><text x="84" y="18" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="22" fill="#2C3E50">z</text>` },
};
const ACTIONS_FOR = {
  ocean: ['splash', 'jump', 'dance', 'sleep'],
  animals: ['jump', 'dance', 'sleep', 'splash'],
  vehicles: ['zoom', 'jump', 'dance', 'sleep'],
  food: ['dance', 'jump', 'zoom', 'sleep'],
};

const FEELINGS = {
  happy: `<path d="M30 60 Q 50 80 70 60" stroke="#2C3E50" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="36" cy="40" r="5" fill="#2C3E50"/><circle cx="64" cy="40" r="5" fill="#2C3E50"/>`,
  silly: `<path d="M28 40 Q 36 32 44 40" stroke="#2C3E50" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="64" cy="40" r="5" fill="#2C3E50"/><path d="M30 58 Q 50 70 70 58" stroke="#2C3E50" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50 64 Q 50 80 58 80 Q 66 80 64 63" fill="#E84393" stroke="#2C3E50" stroke-width="3"/>`,
  excited: `${'<path d="M28 30 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="#F57C14"/>'}${'<path d="M68 30 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="#F57C14" transform="translate(0 0)"/>'}<path d="M28 60 Q 50 92 72 60 Z" fill="#7A1F1F" stroke="#2C3E50" stroke-width="4" stroke-linejoin="round"/>`,
  sleepy: `<path d="M28 42 Q 36 48 44 42 M56 42 Q 64 48 72 42" stroke="#2C3E50" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="66" rx="7" ry="5" fill="#2C3E50"/>`,
  surprised: `<circle cx="36" cy="38" r="7" fill="#fff" stroke="#2C3E50" stroke-width="3.5"/><circle cx="64" cy="38" r="7" fill="#fff" stroke="#2C3E50" stroke-width="3.5"/><circle cx="36" cy="38" r="3" fill="#2C3E50"/><circle cx="64" cy="38" r="3" fill="#2C3E50"/><ellipse cx="50" cy="66" rx="9" ry="12" fill="#2C3E50"/>`,
};
const faceSvg = (f) => `<svg viewBox="-4 -4 108 108"><circle cx="50" cy="50" r="46" fill="#FFD34D" stroke="#2C3E50" stroke-width="4"/>${FEELINGS[f]}</svg>`;

// A built song's picture: the topic's background with the chosen thing in it.
function builtScene(spec) {
  const w = WORLDS[spec.world];
  let mid = '';
  if (spec.thing) {
    const dance = spec.move ? ` class="${spec.move}"` : '';
    mid += `<g${dance}><g transform="translate(130 ${w.ground - 168}) scale(1.4)">${objDraw(spec.thing, spec.tint)}</g></g>`;
  }
  if (spec.action) mid += `<g transform="translate(286 ${Math.max(30, w.ground - 210)}) scale(.9)"><circle cx="50" cy="50" r="56" fill="#fff" opacity=".85"/>${ACTIONS[spec.action].icon}</g>`;
  if (spec.feeling) mid += `<g class="bounce"><g transform="translate(290 34) scale(.9)"><circle cx="50" cy="50" r="46" fill="#FFD34D" stroke="#2C3E50" stroke-width="4"/>${FEELINGS[spec.feeling]}</g></g>`;
  if (spec.question) mid += `<g class="bounce"><text x="200" y="${w.ground - 50}" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="120" fill="#fff" stroke="#2C3E50" stroke-width="5" paint-order="stroke">?</text></g>`;
  return w.back(0) + mid + w.front();
}

function writeSong(d) {
  const thing = OBJECTS[d.thing].word, colour = d.colour[0], tint = d.colour[1];
  const a = ACTIONS[d.action], art = (extra) => ({ world: PLACES[d.topic].world, thing: d.thing, tint, ...extra });
  return {
    title: `The ${colour[0].toUpperCase() + colour.slice(1)} ${thing.replace(/\b\w/g, (c) => c.toUpperCase())}`,
    by: 'Us',
    cover: art({}),
    pages: [
      { scene: { world: PLACES[d.topic].world, question: true }, part: 'verse', lines: [`Today we went to ${PLACES[d.topic].place},`, 'and guess what we saw?'] },
      { scene: art({}), part: 'verse', lines: [`We saw a ${colour} ${thing},`, `a great big ${colour} ${thing}!`] },
      { scene: art({ move: a.move, action: d.action }), part: 'verse', lines: [a.line(thing), a.shout] },
      { scene: art({ feeling: d.feeling }), part: 'verse', lines: [`That made me feel so ${d.feeling},`, 'what a day!'], end: true },
    ],
  };
}

let draft = null;   // the song being built

function builderScreen(mode, editId) {
  if (mode === 'edit') {
    const song = store.get('songs', []).find((s) => s.id === editId);
    if (!song) return go('#/songs', true);
    return reviewScreen(JSON.parse(JSON.stringify(song)));
  }
  if (mode !== 'go' || !draft) draft = { step: 0 };

  const steps = [
    { key: 'topic', ask: 'What should our song be about?',
      options: () => Object.entries(TOPICS).map(([id, t]) => ({ value: id, label: t.name,
        art: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${builtScene({ world: PLACES[id].world, thing: objectsIn(id)[0] })}</svg>` })) },
    { key: 'thing', ask: 'What did we see?',
      options: () => objectsIn(draft.topic).slice(0, 6).map((k) => ({ value: k, label: OBJECTS[k].word, art: objSvg(k) })) },
    { key: 'colour', ask: 'What colour was it?',
      options: () => COLOURS.map((c) => ({ value: c, label: c[0], art: objSvg(draft.thing, '', c[1]) })) },
    { key: 'action', ask: 'What did it do?',
      options: () => ACTIONS_FOR[draft.topic].map((k) => ({ value: k, label: k, art: `<svg viewBox="-4 -4 108 108">${ACTIONS[k].icon}</svg>` })) },
    { key: 'feeling', ask: 'How did it make you feel?',
      options: () => Object.keys(FEELINGS).map((k) => ({ value: k, label: k, art: faceSvg(k) })) },
  ];
  const step = steps[draft.step];
  const opts = step.options();

  show(`<div class="screen builder">
    <div class="topbar">${homeBtn()}<div class="title"><h2>Song Builder</h2><p>Question ${draft.step + 1} of ${steps.length}</p></div>${settingsBtn}</div>
    <h1 class="ask-big">${step.ask}</h1>
    <div class="options n${opts.length}" id="opts">${opts.map((op, i) => `
      <button type="button" class="pick" data-i="${i}"><div class="pick-art">${op.art}</div><span>${esc(op.label)}</span></button>`).join('')}
    </div>
    <div class="bottombar">
      <button type="button" class="big-btn prev" id="prev" ${draft.step === 0 ? 'disabled' : ''}>${ICON.back}<span class="lbl">Back</span></button>
      <span></span><span></span>
    </div></div>`, { awake: true });

  $('opts').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b || $('opts').classList.contains('decided')) return;
    b.classList.add('chosen');
    $('opts').classList.add('decided');
    Groove.ping(1);
    draft[step.key] = opts[Number(b.dataset.i)].value;
    setTimeout(() => {
      if (draft.step < steps.length - 1) { draft.step++; builderScreen('go'); }
      else reviewScreen(writeSong(draft));
    }, 700);
  });
  $('prev').onclick = () => { draft.step--; builderScreen('go'); };
}

// Check and retype the song before saving it.
function reviewScreen(song) {
  const isNew = !song.id;
  show(`<div class="screen review">
    <div class="topbar">${homeBtn(isNew ? '#/builder' : `#/song/${song.id}/0`)}<div class="title"><h2>${isNew ? 'Our new song' : 'Edit song'}</h2><p>Change any words you like.</p></div>${settingsBtn}</div>
    <div class="review-head">
      <div class="review-cover">${scene(song.cover)}</div>
      <div class="fields">
        <label>Title<input type="text" id="r-title" value="${esc(song.title)}"></label>
        <label>By<input type="text" id="r-by" value="${esc(song.by)}" placeholder="First names"></label>
      </div>
    </div>
    <ol class="review-pages">${song.pages.map((p, i) => `
      <li><div class="review-art">${scene(p.scene)}</div>
        <div class="fields">${p.lines.map((l, j) => `<input type="text" data-p="${i}" data-l="${j}" value="${esc(l)}" aria-label="Page ${i + 1}, line ${j + 1}">`).join('')}</div></li>`).join('')}
    </ol>
    <div class="choose-bar">
      ${isNew ? '<button type="button" class="big-btn" id="r-again">Start over</button>' : '<button type="button" class="big-btn" id="r-delete">Delete song</button>'}
      <button type="button" class="big-btn primary" id="r-save">${isNew ? 'Save to Songbook' : 'Save changes'}</button>
    </div>
  </div>`);

  $('r-save').onclick = () => {
    song.title = $('r-title').value.trim() || 'Our Song';
    song.by = $('r-by').value.trim() || 'Us';
    document.querySelectorAll('[data-p]').forEach((inp) => { song.pages[inp.dataset.p].lines[inp.dataset.l] = inp.value; });
    if (isNew) song.id = `my-${Date.now()}`;
    saveMySong(song);
    draft = null;
    go(`#/song/${song.id}/0`);
  };
  if (isNew) $('r-again').onclick = () => { draft = null; go('#/builder', true); };
  else $('r-delete').onclick = () => {
    if (!confirm(`Delete "${song.title}"? This can't be undone.`)) return;
    deleteMySong(song.id);
    go('#/songs');
  };
}
