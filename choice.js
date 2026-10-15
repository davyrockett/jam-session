// Choice Board: David picks 2 to 4 activities, then the client chooses one.
// Each song and each Cause & Effect picture is its own card.

function choiceCards() {
  const cards = allSongs().map((s) => ({ id: `song:${s.id}`, label: s.title, art: () => scene(s.cover), go: `#/song/${s.id}/0` }));
  Object.entries(WORLDS).forEach(([id, w]) => cards.push({
    id: `react:${id}`, label: w.name, go: `#/react/${id}`,
    art: () => `<svg data-sketch viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${w.back(0)}<g transform="translate(140 ${w.ground - 150}) scale(1.2)">${
      w.things[0] === 'fireworks' ? OBJECTS.cake.draw() : OBJECTS[w.things[0]].draw()}</g>${w.front()}</svg>`,
  }));
  cards.push({ id: 'builder', label: 'Song Builder', art: () => THUMBS.builder(), go: '#/builder' });
  return cards;
}

function choiceScreen(mode) {
  const cards = choiceCards();
  let picked = store.get('choices', []).filter((id) => cards.some((c) => c.id === id));

  if (mode === 'show' && picked.length >= 2) {
    const shown = picked.map((id) => cards.find((c) => c.id === id));
    show(`<div class="screen choose">
      <div class="topbar">${homeBtn('#/choice')}<div class="title"><h2>What should we do next?</h2></div>${settingsBtn}</div>
      <div class="board n${shown.length}">${shown.map((c) => `
        <button type="button" class="pick" data-pick="${c.go}"><div class="pick-art">${c.art()}</div><span>${esc(c.label)}</span></button>`).join('')}
      </div></div>`, { awake: true });
    document.querySelector('.board').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (!b || b.classList.contains('chosen')) return;
      b.classList.add('chosen');
      document.querySelector('.board').classList.add('decided');
      Groove.ping(1);
      setTimeout(() => { location.hash = b.dataset.pick; }, 1100);
    });
    return;
  }

  show(`<div class="screen">
    <div class="topbar">${homeBtn()}<div class="title"><h2>Choice Board</h2><p>Pick 2 to 4 choices to show.</p></div>${settingsBtn}</div>
    <div class="tiles small" id="cards">${cards.map((c) => `
      <button type="button" class="tile" data-card="${c.id}" aria-pressed="false">
        <div class="thumb">${c.art()}</div>
        <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>
        <div class="label"><h3>${esc(c.label)}</h3></div>
      </button>`).join('')}
    </div>
    <div class="choose-bar"><button type="button" class="big-btn primary" id="show-choices"></button></div>
  </div>`);

  const mark = () => {
    document.querySelectorAll('[data-card]').forEach((b) => {
      const on = picked.includes(b.dataset.card);
      b.setAttribute('aria-pressed', on);
      b.disabled = !on && picked.length >= 4;
    });
    const btn = $('show-choices');
    btn.disabled = picked.length < 2;
    btn.textContent = picked.length < 2 ? `Pick ${2 - picked.length} more` : `Show ${picked.length} choices`;
  };
  $('cards').addEventListener('click', (e) => {
    const b = e.target.closest('[data-card]');
    if (!b) return;
    const id = b.dataset.card;
    picked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id];
    store.set('choices', picked);
    mark();
  });
  $('show-choices').onclick = () => { location.hash = '#/choice/show'; };
  mark();
}
