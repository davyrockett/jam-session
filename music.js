// The island groove: a laid-back backing band in G major, played live in the browser.
// Steel-drum chords on the off-beats, a round bass, soft kick, rim click and shaker.
// The chords follow the page: verse pages play G C G D, chorus pages C D G G.
// It's for when David isn't there; when he plays guitar, just leave it off.

const Groove = (() => {
  const PROGRESSIONS = {
    verse: ['G', 'C', 'G', 'D'],
    chorus: ['C', 'D', 'G', 'G'],
  };
  const CHORDS = {           // steel-drum voicing (MIDI notes) and bass root
    G: { pan: [67, 71, 74], bass: 43 },
    C: { pan: [67, 72, 76], bass: 48 },
    D: { pan: [66, 69, 74], bass: 50 },
    Em: { pan: [67, 71, 76], bass: 40 },
  };
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  let ctx, out, noise, timer;
  let playing = false, step = 0, bar = 0, nextTime = 0, chord = CHORDS.G;
  let bpm = 92;
  let partFn = () => 'verse';

  function setup() {
    if (ctx) return;
    // iPhone: play even when the ring/silent switch is on silent.
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    out = ctx.createGain();
    out.gain.value = 0.9;
    out.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function env(g, t, peak, attack, decay) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  function tone(type, f, t, peak, attack, decay, dest = out) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    env(g, t, peak, attack, decay);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + attack + decay + 0.05);
  }

  // Steel drum: a bright, quickly fading note with octave and twelfth overtones.
  function pan(m, t, level = 1) {
    const f = hz(m);
    tone('sine', f, t, 0.06 * level, 0.004, 0.55);
    tone('sine', f * 2, t, 0.025 * level, 0.004, 0.28);
    tone('sine', f * 3, t, 0.008 * level, 0.003, 0.14);
  }

  function bass(m, t, len) {
    const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = hz(m);
    lp.type = 'lowpass'; lp.frequency.value = 520;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32, t + 0.015);
    g.gain.setTargetAtTime(0.0001, t + len * 0.8, 0.06);
    o.connect(lp).connect(g).connect(out);
    o.start(t); o.stop(t + len + 0.4);
  }

  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(115, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    env(g, t, 0.55, 0.003, 0.28);
    o.connect(g).connect(out);
    o.start(t); o.stop(t + 0.35);
  }

  function hiss(t, freq, type, q, peak, decay) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = type; f.frequency.value = freq; f.Q.value = q;
    env(g, t, peak, 0.002, decay);
    s.connect(f).connect(g).connect(out);
    s.start(t, Math.random() * 0.5); s.stop(t + decay + 0.05);
  }

  function schedule(barStep, t) {
    const eighth = 60 / bpm / 2;
    const swing = barStep % 4 === 2 ? eighth * 0.16 : 0;   // a little lilt on the off-beats
    const tt = t + swing;
    if (barStep === 0) {
      const prog = PROGRESSIONS[partFn()] || PROGRESSIONS.verse;
      chord = CHORDS[prog[bar % prog.length]];
      bar++;
    }
    if (barStep === 0 || barStep === 8) kick(t);
    if (barStep === 4 || barStep === 12) hiss(t, 1900, 'bandpass', 4, 0.22, 0.05);       // rim click
    if (barStep % 2 === 0) hiss(tt, 7500, 'highpass', 0.7, barStep % 4 === 2 ? 0.07 : 0.035, 0.06); // shaker
    if (barStep % 4 === 2) chord.pan.forEach((m, i) => pan(m, tt + i * 0.008, barStep === 6 || barStep === 14 ? 1 : 0.8));
    const sixteenth = 60 / bpm / 4;
    if (barStep === 0) bass(chord.bass, t, sixteenth * 5);
    if (barStep === 6) bass(chord.bass, tt, sixteenth * 2);
    if (barStep === 8) bass(chord.bass + 7, t, sixteenth * 4);
    if (barStep === 14) bass(chord.bass + 12, tt, sixteenth * 2);
  }

  function tick() {
    const sixteenth = 60 / bpm / 4;
    while (nextTime < ctx.currentTime + 0.15) {
      schedule(step % 16, nextTime);
      nextTime += sixteenth;
      step++;
    }
  }

  return {
    get playing() { return playing; },
    set bpm(v) { bpm = v; },
    follow(fn) { partFn = fn; },
    async start() {
      setup();
      if (ctx.state !== 'running') await ctx.resume();
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(0.9, ctx.currentTime);
      step = 0; bar = 0; nextTime = ctx.currentTime + 0.08;
      playing = true;
      tick();
      clearInterval(timer);
      timer = setInterval(tick, 25);
    },
    // One steel-drum note from the G major pentatonic scale (for screen taps).
    async ping(level = 1) {
      setup();
      if (ctx.state !== 'running') await ctx.resume();
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(0.9, ctx.currentTime);
      const scale = [67, 69, 71, 74, 76, 79];
      pan(scale[Math.floor(Math.random() * scale.length)], ctx.currentTime + 0.01, 1.6 * level);
    },
    // Sound effects for the magic words (synth only, no voices).
    async fx(kind) {
      setup();
      if (ctx.state !== 'running') await ctx.resume();
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(0.9, ctx.currentTime);
      const t = ctx.currentTime + 0.01;
      const sweep = (type, f1, f2, dur, peak = 0.18, filter) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f1, t);
        o.frequency.exponentialRampToValueAtTime(f2, t + dur);
        env(g, t, peak, 0.01, dur);
        if (filter) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter; o.connect(f).connect(g); } else o.connect(g);
        g.connect(out); o.start(t); o.stop(t + dur + 0.1);
      };
      const arp = (notes, gap = 0.09, level = 1.4) => notes.forEach((m, i) => pan(m, t + i * gap, level));
      const NOTES = { n1: [67], n2: [71], n3: [74, 79] };
      if (NOTES[kind]) return arp(NOTES[kind], 0.12, 1.8);
      switch (kind) {
        case 'boing': sweep('sine', 180, 900, 0.35, 0.25); break;
        case 'motor': sweep('sawtooth', 55, 190, 0.9, 0.16, 700); break;
        case 'whirr': sweep('sawtooth', 140, 260, 0.8, 0.09, 1600); hiss(t, 1200, 'bandpass', 2, 0.12, 0.8); break;
        case 'splash': hiss(t, 2400, 'bandpass', 0.8, 0.35, 0.5); hiss(t + 0.08, 5000, 'highpass', 0.7, 0.15, 0.4); break;
        case 'horn': [0, 0.32].forEach((d) => { const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
          o.type = o2.type = 'square'; o.frequency.value = 196; o2.frequency.value = 247; f.type = 'lowpass'; f.frequency.value = 900;
          g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.08, t + d + 0.02); g.gain.setTargetAtTime(0.0001, t + d + 0.2, 0.03);
          o.connect(f); o2.connect(f); f.connect(g).connect(out); o.start(t + d); o2.start(t + d); o.stop(t + d + 0.4); o2.stop(t + d + 0.4); }); break;
        case 'cheer': arp([67, 71, 74, 79, 83], 0.07); for (let i = 0; i < 6; i++) hiss(t + i * 0.08, 7500, 'highpass', 0.7, 0.08, 0.06); break;
        case 'twinkle': arp([86, 91, 88, 93], 0.1, 0.9); break;
        case 'notes': arp([67, 71, 74, 71, 79], 0.14); break;
        case 'shake': sweep('sine', 330, 300, 0.12, 0.15); sweep('sine', 300, 330, 0.12, 0.12); break;
        default: pan([67, 69, 71, 74, 76, 79][Math.floor(Math.random() * 6)], t, 1.6);
      }
    },
    stop() {
      if (!ctx) return;
      playing = false;
      clearInterval(timer);
      out.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    },
  };
})();
