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
};

// ---------- Listening to the microphone ----------

const Listener = (() => {
  let stream, ctx, analyser, buf, raf, floor = 0.01, last = 0, prev = 0, ignoreUntil = 0;
  let onHit = () => {}, onLevel = () => {};
  let threshold = 0.05;

  function loop() {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    if (rms < floor * 3) floor = floor * 0.99 + rms * 0.01;  // slowly learn the room's background noise
    const now = performance.now();
    if (rms > threshold && rms > floor * 2.5 && rms > prev * 1.25 && now - last > 180 && now > ignoreUntil) {
      last = now;
      onHit(Math.min(1, (rms - threshold) / (threshold * 4)));
    }
    prev = rms;
    onLevel(rms);
    raf = requestAnimationFrame(loop);
  }

  return {
    get on() { return Boolean(stream); },
    set sensitivity(s) { threshold = 0.3 * Math.pow(0.7, s - 1); },
    get threshold() { return threshold; },
    ignore(ms) { ignoreUntil = performance.now() + ms; },
    async start(hit, level) {
      onHit = hit; onLevel = level;
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state !== 'running') await ctx.resume();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      buf = new Float32Array(analyser.fftSize);
      ctx.createMediaStreamSource(stream).connect(analyser);
      loop();
    },
    stop() {
      cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (ctx) ctx.close();
      stream = null; ctx = null;
    },
  };
})();

// ---------- The screen ----------

function reactScreen(worldId) {
  if (!WORLDS[worldId]) worldId = store.get('world', 'ocean');
  let world = WORLDS[worldId];
  let hits = 0, turn = 0;

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
    $('back').innerHTML = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${world.back(top)}</svg>`;
    $('front').innerHTML = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${world.front()}</svg>`;
    fx.innerHTML = '';
  };
  drawWorld();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (document.body.contains(stage)) drawWorld(); }, 200); });

  document.querySelector('.worlds').addEventListener('click', (e) => {
    const b = e.target.closest('[data-world]');
    if (!b) return;
    worldId = b.dataset.world; world = WORLDS[worldId]; turn = 0;
    store.set('world', worldId);
    document.querySelectorAll('[data-world]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    drawWorld();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (document.body.contains(stage)) drawWorld(); }, 200); });
  });

  function trigger(power) {
    hits++;
    $('hits').textContent = `${hits} ${hits === 1 ? 'hit' : 'hits'}`;
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
    el.innerHTML = `<svg viewBox="0 0 100 100">${rays}<circle cx="50" cy="50" r="6" fill="#fff"/></svg>`;
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
  sens.value = store.get('sens', 6);
  Listener.sensitivity = Number(sens.value);
  const scale = (v) => Math.min(1, Math.sqrt(v / 0.4));
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
      await Listener.start((p) => trigger(p), (v) => { $('level').style.width = `${scale(v) * 100}%`; });
      store.set('listen', true);
    } catch {
      $('mic-note').textContent = 'The microphone is off for this app. Turn it on in the iPad\'s Settings, or just tap the picture.';
    }
    markMic();
  };
  markMic();
}
