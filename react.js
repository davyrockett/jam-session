// Cause & Effect: every hit on an instrument (heard by the iPad's microphone) or tap
// on the screen makes something happen in the picture. Louder hits make bigger things.

const WORLDS = {
  ocean: {
    name: 'Ocean',
    back: (t) => `${sky()}${sun(330, t + 50, 26)}${cloud(80, t + 50)}${cloud(220, t + 36, 0.8)}<rect x="0" y="170" width="400" height="130" fill="#2E86DE"/>`,
    front: () => `<g class="wv"><path d="${wavePath(222, 8, 70)}" fill="#1B6CB8"/></g>`,
    things: ['fish', 'whale', 'crab', 'gull', 'boat', 'starfish', 'fish'],
    move: { gull: 'fly', boat: 'sail' }, normal: 'jump', ground: 228,
  },
  animals: {
    name: 'Animals',
    back: (t) => `${sky()}${sun(60, t + 46, 24)}${cloud(220, t + 40)}
      <path d="M-20 200 Q 90 130 200 190 Q 300 140 420 190 L420 300 L-20 300 Z" fill="#7BC67E"/>
      <rect x="300" y="128" width="64" height="60" fill="#C0392B" stroke="${INK}" stroke-width="2"/><path d="M294 130 L332 98 L370 130 Z" fill="#922B21" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <rect x="320" y="156" width="24" height="32" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M320 156 L344 188 M344 156 L320 188" stroke="${INK}" stroke-width="2"/>`,
    front: () => {
      let posts = '';
      for (let x = 6; x < 400; x += 36) posts += `<path d="M${x} 300 L${x} 252 L${x + 7} 244 L${x + 14} 252 L${x + 14} 300 Z" fill="#F5E6C8" stroke="${INK}" stroke-width="2"/>`;
      return `<rect x="0" y="258" width="400" height="8" fill="#F5E6C8" stroke="${INK}" stroke-width="2"/><rect x="0" y="278" width="400" height="8" fill="#F5E6C8" stroke="${INK}" stroke-width="2"/>${posts}
        <rect x="0" y="290" width="400" height="10" fill="#5DAE5F"/>`;
    },
    things: ['cow', 'pig', 'duck', 'sheep', 'dog', 'cat'],
    move: {}, normal: 'pop', ground: 254,
  },
  vehicles: {
    name: 'Vehicles',
    back: (t) => `${sky()}${cloud(70, t + 34)}${cloud(260, t + 50, 0.9)}
      <path d="M0 180 L0 120 L40 120 L40 96 L80 96 L80 136 L120 136 L120 80 L170 80 L170 130 L210 130 L210 106 L260 106 L260 140 L300 140 L300 90 L350 90 L350 128 L400 128 L400 180 Z" fill="#AFC6DE"/>
      <rect x="0" y="178" width="400" height="122" fill="#7BC67E"/>
      <rect x="0" y="196" width="400" height="76" fill="#555"/><path d="M0 234 H400" stroke="#F1C40F" stroke-width="5" stroke-dasharray="26 18"/>`,
    front: () => '',
    things: ['car', 'bus', 'firetruck', 'train', 'plane', 'car'],
    move: { plane: 'fly' }, normal: 'drive', ground: 262,
  },
  party: {
    name: 'Party',
    back: (t) => {
      let flags = '';
      const cols = ['#E74C3C', '#F1C40F', '#27AE60', '#3498DB', '#E84393'];
      for (let i = 0; i < 12; i++) flags += `<path d="M${i * 36} ${t + 22 + Math.sin(i) * 3} l18 0 l-9 22 Z" fill="${cols[i % 5]}"/>`;
      return `<rect width="400" height="300" fill="#24305E"/>${star(40, t + 80, 4, '#fff')}${star(120, t + 60, 3, '#fff')}${star(300, t + 70, 4, '#fff')}${star(360, t + 120, 3, '#fff')}${star(210, t + 90, 3, '#fff')}
        <path d="M0 ${t + 20} Q 200 ${t + 40} 400 ${t + 20}" stroke="#fff" stroke-width="2" fill="none"/>${flags}
        <rect x="0" y="250" width="400" height="50" fill="#3B2F6B"/>`;
    },
    front: () => '',
    things: ['fireworks', 'cake', 'balloon', 'fireworks', 'pizza', 'icecream', 'fireworks', 'balloon', 'burger', 'apple'],
    move: { balloon: 'rise', fireworks: 'burst' }, normal: 'popin', ground: 250,
  },
  // Friendly Halloween night (the house is in the middle so tall screens still show it). Every third hit is a knock that opens the house's door
  // and a surprise jumps out (door: true, surprises). The dots on the door count the knocks.
  halloween: {
    name: 'Halloween',
    back: (t) => {
      const mini = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#F57C14" stroke="${INK}" stroke-width="2"/>
        <path d="M${x - 1} ${y - 7} L${x} ${y - 12} L${x + 3} ${y - 11} L${x + 2} ${y - 7} Z" fill="#4E8C3A"/>
        <path d="M${x - 6} ${y - 1} l2 -3 l2 3 Z M${x + 2} ${y - 1} l2 -3 l2 3 Z M${x - 5} ${y + 2} Q ${x} ${y + 6} ${x + 5} ${y + 2} Z" fill="#FFD34D"/>`;
      const win = (x) => `<rect x="${x}" y="164" width="28" height="26" fill="#FFD34D" stroke="${INK}" stroke-width="2.5"/>
        <path d="M${x + 14} 164 V190 M${x} 177 H${x + 28}" stroke="${INK}" stroke-width="2"/>`;
      const arch = 'M253 238 L253 200 Q 253 184 270 184 Q 287 184 287 200 L287 238 Z';
      return `<rect width="400" height="300" fill="#3A2D6B"/>
        ${star(150, t + 40, 3, '#fff')}${star(232, t + 26, 4, '#fff')}${star(330, t + 48, 3, '#fff')}${star(372, t + 18, 3, '#fff')}${star(46, t + 128, 3, '#fff')}${star(190, t + 82, 2.5, '#fff')}
        <circle cx="100" cy="${t + 60}" r="32" fill="#FFF3B0"/><circle cx="89" cy="${t + 50}" r="7" fill="#F2E39A"/><circle cx="113" cy="${t + 72}" r="8" fill="#F2E39A"/><circle cx="110" cy="${t + 46}" r="4" fill="#F2E39A"/>
        <path d="M-20 238 Q 70 196 160 228 Q 260 186 420 226 L420 300 L-20 300 Z" fill="#2A2052"/>
        <rect x="0" y="234" width="400" height="66" fill="#3F6B50"/>
        <g transform="translate(-70 0)">
        <path d="M300 140 L301 116 L315 114 L315 150 Z" fill="#5B4A86" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M210 152 L330 152 L332 238 L208 238 Z" fill="#7A68A6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M198 156 L270 114 L342 156 Z" fill="#3C2F66" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="270" cy="139" r="7.5" fill="#FFD34D" stroke="${INK}" stroke-width="2.5"/>
        ${win(220)}${win(292)}
        <path d="${arch}" fill="#FFE7A3" stroke="${INK}" stroke-width="2.5"/>
        <g class="door"><path d="${arch}" fill="#8E5A3C" stroke="${INK}" stroke-width="2.5"/>
          <path d="M264 186 V238 M276 186 V238" stroke="#6E4329" stroke-width="2"/>
          <circle class="kdot" cx="261" cy="204" r="3.5" fill="#5E3A26"/><circle class="kdot" cx="270" cy="204" r="3.5" fill="#5E3A26"/><circle class="kdot" cx="279" cy="204" r="3.5" fill="#5E3A26"/>
          <circle cx="281" cy="218" r="2.5" fill="#F1C40F"/></g>
        <rect x="246" y="236" width="48" height="6" fill="#5B4E80" stroke="${INK}" stroke-width="2"/>
        ${mini(228, 230)}${mini(314, 230)}</g>`;
    },
    front: () => {
      let posts = '';
      for (let x = 8; x < 400; x += 24) posts += `<path d="M${x} 300 L${x} 256 L${x + 3} 248 L${x + 6} 256 L${x + 6} 300 Z" fill="#1E1838"/>`;
      return `<rect x="0" y="262" width="400" height="5" fill="#1E1838"/><rect x="0" y="284" width="400" height="5" fill="#1E1838"/>${posts}
        <rect x="0" y="292" width="400" height="8" fill="#2F5540"/>`;
    },
    things: ['pumpkin', 'ghost', 'bat', 'spider', 'blackcat', 'candy'],
    move: { ghost: 'float', bat: 'fly', spider: 'dangle', candy: 'popin' }, normal: 'pop', ground: 258,
    door: true, surprises: ['monster', 'bucket', 'furball'],
    thingX: 14,   // Song Builder pictures: the chosen thing stands beside the house, not in front of it
  },
};

// ---------- Listening to the microphone ----------

// iPad notes: the audio is started inside the tap (before waiting for the mic), or Safari can leave it
// silent. The mic is asked for once per visit and kept (switched off, not closed, while not listening),
// because a home-screen app asks again every time the mic is opened and can get stuck saying no.
const Listener = (() => {
  let stream, ctx, analyser, buf, raf, floor = 0.003, last = 0, lastLevel = 0, ignoreUntil = 0, listening = false;
  let recent = [];   // levels over the last ~150 ms, so a hit is a jump above the quietest of them
  let onHit = () => {}, onLevel = () => {}, onEnd = () => {};
  let threshold = 0.02;

  function loop() {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    if (rms < floor * 3) floor = floor * 0.98 + rms * 0.02;  // slowly learn the room's background noise
    const base = recent.length ? Math.min(...recent) : rms;
    const now = performance.now();
    if (lastLevel && (rms < lastLevel * 0.4 || now - last > 600)) lastLevel = 0;  // the last hit has died down
    if (!lastLevel && rms > threshold && rms > floor * 1.6 && rms > base * 1.4 && now - last > 160 && now > ignoreUntil) {
      last = now; lastLevel = rms;
      onHit(Math.min(1, (rms - threshold) / (threshold * 6)));
    }
    recent.push(rms);
    if (recent.length > 9) recent.shift();
    onLevel(rms);
    raf = requestAnimationFrame(loop);
  }

  const live = () => stream && stream.getAudioTracks().some((t) => t.readyState === 'live');

  return {
    get on() { return listening; },
    // 1 = only loud hits, 10 = the lightest tap the room's noise allows (the iPad's mic is quiet with its own volume levelling off)
    set sensitivity(s) { threshold = 0.1 * Math.pow(0.58, s - 1); },
    get threshold() { return threshold; },
    ignore(ms) { ignoreUntil = performance.now() + ms; },
    async start(hit, level, ended) {
      onHit = hit; onLevel = level; onEnd = ended || (() => {});
      // Made and resumed right away, while the tap still counts (no waiting before this).
      if (!ctx || ctx.state === 'closed') ctx = new (window.AudioContext || window.webkitAudioContext)();
      const resumed = ctx.state === 'running' ? null : ctx.resume().catch(() => {});
      if (!live()) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        buf = new Float32Array(analyser.fftSize);
        ctx.createMediaStreamSource(stream).connect(analyser);
        // The iPad can cut the mic off (another app took it, or this one sat in the background).
        stream.getAudioTracks().forEach((t) => t.addEventListener('ended', () => { if (listening) { this.stop(); onEnd(); } }));
      }
      stream.getAudioTracks().forEach((t) => { t.enabled = true; });
      if (resumed) await Promise.race([resumed, new Promise((r) => setTimeout(r, 1500))]);
      if (ctx.state !== 'running') await ctx.resume().catch(() => {});
      recent = []; listening = true;
      cancelAnimationFrame(raf);
      loop();
    },
    stop() {
      cancelAnimationFrame(raf);
      listening = false;
      if (stream) stream.getAudioTracks().forEach((t) => { t.enabled = false; });
      if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    },
  };
})();

// ---------- The screen ----------

function reactScreen(worldId) {
  if (!WORLDS[worldId]) worldId = store.get('world', 'ocean');
  let world = WORLDS[worldId];
  let hits = 0, turn = 0, knocks = 0, surprise = 0, closeTimer;

  show(`<div class="screen react">
    <div class="topbar">${homeBtn()}<div class="title"><h2>Cause &amp; Effect</h2><p id="hits">Play a hit or tap the picture.</p></div>${settingsBtn}</div>
    <div class="worlds" role="group" aria-label="Picture">${Object.entries(WORLDS).map(([id, w]) =>
      `<button type="button" data-world="${id}" aria-pressed="${id === worldId}">${w.name}</button>`).join('')}</div>
    <div class="stage" id="stage"><div class="stage-back" id="back"></div><div class="fx" id="fx"></div><div class="stage-front" id="front"></div></div>
    <div class="listen">
      <button type="button" class="big-btn" id="mic" aria-pressed="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
        <span id="mic-lbl">Listen</span></button>
      <div class="meter-box" id="meter-box">
        <div class="meter"><div class="level" id="level"></div><div class="mark" id="mark"></div></div>
        <label class="sens">Sensitivity <input type="range" id="sens" min="1" max="10" step="1"></label>
      </div>
    </div>
    <p class="mic-note" id="mic-note"></p>
  </div>`, { awake: true, leave: () => Listener.stop() });

  const stage = $('stage'), fx = $('fx');
  const drawWorld = () => {
    // On a wide screen the top of the sky is cut off, so the sun and clouds move down to stay in view.
    const top = Math.max(0, 300 - (400 * stage.clientHeight) / stage.clientWidth);
    $('back').innerHTML = `<svg data-sketch viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${world.back(top)}</svg>`;
    $('front').innerHTML = `<svg data-sketch viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${world.front()}</svg>`;
    fx.innerHTML = '';
  };
  drawWorld();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (document.body.contains(stage)) drawWorld(); }, 200); });

  document.querySelector('.worlds').addEventListener('click', (e) => {
    const b = e.target.closest('[data-world]');
    if (!b) return;
    worldId = b.dataset.world; world = WORLDS[worldId]; turn = 0; knocks = 0;
    store.set('world', worldId);
    document.querySelectorAll('[data-world]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    drawWorld();
  });

  function trigger(power) {
    hits++;
    $('hits').textContent = `${hits} ${hits === 1 ? 'hit' : 'hits'}`;
    if (world.door) {
      knocks++;
      if (knocks % 3 === 0) return openDoor(power);
      knock();
    }
    const name = world.things[turn++ % world.things.length];
    const how = world.move[name] || world.normal;
    const W = stage.clientWidth, H = stage.clientHeight;
    const size = Math.min(W, H * 1.33) * (0.2 + 0.14 * power);
    // The pictures are pinned to the bottom of the stage, so work out where the ground is on screen.
    const k = Math.max(W / 400, H / 300);
    const groundY = H - (300 - world.ground) * k;
    const x = W * (0.1 + Math.random() * 0.65);
    if (how === 'burst') return firework(W, H, power);

    const el = document.createElement('div');
    el.className = 'thing';
    el.style.width = el.style.height = `${size}px`;
    el.innerHTML = objSvg(name);
    fx.appendChild(el);
    const sound = OBJECTS[name].sound;
    const at = (px, py, extra = '') => `translate(${px}px, ${py}px) ${extra}`;
    let frames, ms, opts = {};
    if (how === 'jump') {
      const dx = (Math.random() < 0.5 ? -1 : 1) * size * 0.8;
      frames = [{ transform: at(x, groundY, 'rotate(-30deg)') }, { transform: at(x + dx / 2, groundY - size * 1.6, 'rotate(0deg)') }, { transform: at(x + dx, groundY + size * 0.2, 'rotate(30deg)') }];
      ms = 1500; opts.easing = 'cubic-bezier(.3,.6,.5,1)';
      word(sound, x + dx / 2 + size / 2, groundY - size * 1.75);
    } else if (how === 'pop') {
      frames = [{ transform: at(x, groundY), offset: 0 }, { transform: at(x, groundY - size * 1.12), offset: 0.2 }, { transform: at(x, groundY - size), offset: 0.3 },
        { transform: at(x, groundY - size), offset: 0.8 }, { transform: at(x, groundY), offset: 1 }];
      ms = 1900;
      word(sound, x + size / 2, groundY - size * 1.2);
    } else if (how === 'drive' || how === 'sail') {
      const dir = turn % 2 ? 1 : -1;
      const y = how === 'sail' ? groundY - size * 0.95 : groundY - size * (0.75 + Math.random() * 0.2);
      const flip = dir < 0 ? 'scaleX(-1)' : '';
      frames = [{ transform: at(dir > 0 ? -size : W, y, flip) }, { transform: at(dir > 0 ? W : -size, y, flip) }];
      ms = 2600;
      word(sound, W / 2, y - size * 0.15);
    } else if (how === 'fly') {
      const y = H * (0.08 + Math.random() * 0.2);
      frames = [{ transform: at(-size, y + 20) }, { transform: at(W / 2, y - 10) }, { transform: at(W, y + 20) }];
      ms = 2600;
      word(sound, W / 2 + size / 2, y - 6);
    } else if (how === 'float') {
      const y0 = groundY - size;
      frames = [{ transform: at(x, y0 + size * 0.3), opacity: 0 }, { transform: at(x + size * 0.2, y0 - size * 0.3), opacity: 1, offset: 0.2 },
        { transform: at(x - size * 0.2, y0 - size * 0.9), opacity: 1, offset: 0.6 }, { transform: at(x + size * 0.2, y0 - size * 1.6), opacity: 0 }];
      ms = 2800; opts.easing = 'ease-in-out';
      word(sound, x + size / 2, y0 - size * 0.45);
    } else if (how === 'dangle') {
      el.insertAdjacentHTML('afterbegin', '<div class="thread"></div>');
      const y = H * (0.18 + Math.random() * 0.2);
      frames = [{ transform: at(x, -size * 1.2) }, { transform: at(x, y + size * 0.18), offset: 0.3 }, { transform: at(x, y - size * 0.05), offset: 0.42 },
        { transform: at(x, y), offset: 0.52 }, { transform: at(x, y), offset: 0.78 }, { transform: at(x, -size * 1.2) }];
      ms = 2800;
      word(sound, x + size * 1.5, y + size * 0.5);
    } else if (how === 'rise') {
      frames = [{ transform: at(x, H) }, { transform: at(x + 30, H * 0.5) }, { transform: at(x - 20, -size) }];
      ms = 3000;
      word(sound, x + size / 2, H * 0.35);
    } else {
      const y = H * (0.25 + Math.random() * 0.3);
      frames = [{ transform: at(x, y, 'scale(0)'), opacity: 1 }, { transform: at(x, y, 'scale(1.15)'), offset: 0.2 }, { transform: at(x, y, 'scale(1)'), offset: 0.3 },
        { transform: at(x, y, 'scale(1)'), opacity: 1, offset: 0.8 }, { transform: at(x, y - 30, 'scale(1)'), opacity: 0 }];
      ms = 1800;
      word(sound, x + size / 2, y - 8);
    }
    el.animate(frames, { duration: ms, fill: 'forwards', ...opts }).onfinish = () => el.remove();
  }

  // Halloween: a knock wiggles the door and lights one more dot on it.
  function knock() {
    const door = $('back').querySelector('.door');
    if (!door || door.classList.contains('open')) return;
    door.querySelectorAll('.kdot').forEach((d, i) => d.classList.toggle('on', i < knocks % 3));
    door.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-2.5deg)' }, { transform: 'rotate(2.5deg)' }, { transform: 'rotate(0deg)' }], { duration: 320 });
  }

  // Every third knock the door opens and a surprise jumps out, then goes back in.
  function openDoor(power) {
    const door = $('back').querySelector('.door');
    if (!door) return;
    door.querySelectorAll('.kdot').forEach((d) => d.classList.add('on'));
    door.classList.add('open');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      door.classList.remove('open');
      door.querySelectorAll('.kdot').forEach((d) => d.classList.remove('on'));
    }, 3000);

    const W = stage.clientWidth, H = stage.clientHeight;
    const k = Math.max(W / 400, H / 300), ox = (W - 400 * k) / 2;
    const dx = ox + 200 * k, dy = H - (300 - 212) * k;     // the middle of the doorway on screen
    const size = Math.min(W, H * 1.33) * (0.36 + 0.1 * power);
    const cx = Math.max(size * 0.55, Math.min(W * 0.45, dx - size * 0.65)), cy = Math.max(size * 0.55 + 50, H * 0.45);
    const name = world.surprises[surprise++ % world.surprises.length];
    const el = document.createElement('div');
    el.className = 'thing';
    el.style.width = el.style.height = `${size}px`;
    el.innerHTML = objSvg(name);
    fx.appendChild(el);
    const at = (px, py, s) => `translate(${px - size / 2}px, ${py - size / 2}px) scale(${s})`;
    el.animate([{ transform: at(dx, dy, 0.1), opacity: 0 }, { transform: at(dx, dy, 0.18), opacity: 1, offset: 0.1 },
      { transform: at(cx, cy, 1.1), offset: 0.3 }, { transform: at(cx, cy, 1), offset: 0.38 },
      { transform: at(cx, cy, 1), opacity: 1, offset: 0.82 }, { transform: at(dx, dy, 0.1), opacity: 0 }],
    { duration: 3200, easing: 'ease-out', fill: 'forwards' }).onfinish = () => el.remove();
    setTimeout(() => word(OBJECTS[name].sound, cx, cy - size * 0.6), 500);
  }

  function word(text, cx, cy) {
    const w = document.createElement('div');
    w.className = 'word';
    w.textContent = text;
    w.style.left = `${Math.max(60, Math.min(stage.clientWidth - 60, cx))}px`;
    w.style.top = `${Math.max(30, cy)}px`;
    fx.appendChild(w);
    w.animate([{ transform: 'translate(-50%, -50%) scale(.3)', opacity: 0 }, { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.2 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.75 }, { transform: 'translate(-50%, -60%) scale(1)', opacity: 0 }], { duration: 1500, fill: 'forwards' }).onfinish = () => w.remove();
  }

  function firework(W, H, power) {
    const cols = ['#E74C3C', '#F1C40F', '#2ECC71', '#3498DB', '#E84393', '#fff', '#FF9433'];
    const c1 = cols[Math.floor(Math.random() * cols.length)], c2 = cols[Math.floor(Math.random() * cols.length)];
    const size = Math.min(W, H) * (0.45 + 0.35 * power);
    let rays = '';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, c = i % 2 ? c1 : c2;
      rays += `<path d="M${50 + 14 * Math.cos(a)} ${50 + 14 * Math.sin(a)} L${50 + 44 * Math.cos(a)} ${50 + 44 * Math.sin(a)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`
        + `<circle cx="${50 + 48 * Math.cos(a)}" cy="${50 + 48 * Math.sin(a)}" r="3" fill="${c}"/>`;
    }
    const el = document.createElement('div');
    el.className = 'thing';
    el.style.width = el.style.height = `${size}px`;
    el.innerHTML = `<svg data-sketch viewBox="0 0 100 100">${rays}<circle cx="50" cy="50" r="6" fill="#fff"/></svg>`;
    const x = W * (0.1 + Math.random() * 0.8) - size / 2, y = H * (0.05 + Math.random() * 0.35);
    fx.appendChild(el);
    el.animate([{ transform: `translate(${x}px, ${y}px) scale(.1)`, opacity: 1 }, { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${x}px, ${y + 20}px) scale(1.1)`, opacity: 0 }], { duration: 1400, easing: 'ease-out', fill: 'forwards' }).onfinish = () => el.remove();
    word('BOOM!', x + size / 2, y + size / 2);
  }

  // Taps on the picture: a steel-drum note plus the effect.
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    Listener.ignore(350);          // so the iPad doesn't also "hear" its own tap sound
    Groove.ping(0.8);
    trigger(0.5);
  });

  // Microphone
  const sens = $('sens');
  sens.value = store.get('sens', 8);
  Listener.sensitivity = Number(sens.value);
  // The meter reads in steps of loudness (like decibels), so quiet sounds still move it.
  const scale = (v) => Math.max(0, Math.min(1, (Math.log10(Math.max(v, 1e-5)) + 3.6) / 3.2));
  const markThreshold = () => { $('mark').style.left = `${scale(Listener.threshold) * 100}%`; };
  markThreshold();
  sens.addEventListener('input', () => { Listener.sensitivity = Number(sens.value); store.set('sens', Number(sens.value)); markThreshold(); });

  const mic = $('mic');
  const markMic = () => {
    mic.setAttribute('aria-pressed', Listener.on);
    $('mic-lbl').textContent = Listener.on ? 'Listening' : 'Listen';
    $('meter-box').classList.toggle('off', !Listener.on);
    sens.disabled = !Listener.on;
    if (!Listener.on) $('level').style.width = '0';
  };
  mic.onclick = async () => {
    if (Listener.on) { Listener.stop(); store.set('listen', false); markMic(); return; }
    $('mic-note').textContent = '';
    try {
      await Listener.start((p) => trigger(p), (v) => { $('level').style.width = `${scale(v) * 100}%`; }, () => { if (document.body.contains(mic)) markMic(); });
      store.set('listen', true);
    } catch (err) {
      Listener.stop();
      $('mic-note').textContent = err && err.name === 'NotAllowedError'
        ? 'The iPad said no to the microphone. Close the app fully (swipe it away), open it again and tap Allow. Or just tap the picture.'
        : 'The microphone didn\'t start. Tap Listen again, or just tap the picture.';
    }
    markMic();
  };
  markMic();
}
