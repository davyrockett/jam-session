// The pictures. Every scene is drawn in code (SVG), 400 × 300.
// Boats use the colour Walter picks on the cover (the --boat CSS variable).
// The people are drawn by walter(), sister(), marine() and captain() below.

const INK = '#2C3E50';
const BOAT = 'var(--boat, #E74C3C)';

const PEOPLE = {
  walter: { skin: '#5A3825', hair: '#111111', shirt: '#F57C14' },
  tish: { skin: '#D9A877', hair: '#6B4226', shirt: '#E84393', style: 'pony' },
  mariana: { skin: '#D9A877', hair: '#6B4226', shirt: '#8E44AD', style: 'long' },
};

// ---------- Backgrounds ----------

function sky(color = '#BFE6FF') { return `<rect width="400" height="300" fill="${color}"/>`; }

function sun(x, y, r = 24, color = '#FFD34D') { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`; }

function cloud(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff">
    <ellipse cx="0" cy="0" rx="30" ry="11"/><ellipse cx="-12" cy="-8" rx="15" ry="11"/><ellipse cx="10" cy="-10" rx="17" ry="13"/></g>`;
}

function gulls(list) {
  return list.map(([x, y, s = 1]) =>
    `<path d="M${x - 9 * s} ${y} q ${4.5 * s} ${-6 * s} ${9 * s} 0 q ${4.5 * s} ${-6 * s} ${9 * s} 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`
  ).join('');
}

function wavePath(y, amp, len) {
  let d = `M-60 ${y} q ${len / 4} ${-amp} ${len / 2} 0`;
  for (let x = -60 + len / 2; x < 470; x += len / 2) d += ` t ${len / 2} 0`;
  return d + ' L470 300 L-60 300 Z';
}

// Water from height y down to the bottom. The front wave drifts back and forth.
function sea(y, light = '#2E86DE', dark = '#1B6CB8') {
  return `<rect x="0" y="${y + 6}" width="400" height="${300 - y}" fill="${light}"/>
    <g class="wv"><path d="${wavePath(y, 7, 60)}" fill="${light}"/></g>
    <g class="wv2"><path d="${wavePath(y + 30, 6, 70)}" fill="${dark}"/></g>`;
}

// A ship deck: sea in the distance, a railing and wooden boards.
function deck(skyColor = '#BFE6FF', seaColor = '#2E86DE', horizon = 150, deckY = 212) {
  let posts = '';
  for (let x = 10; x <= 400; x += 46) posts += `<rect x="${x}" y="${deckY - 50}" width="5" height="50" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
  let boards = '';
  for (let y = deckY + 22; y < 300; y += 26) boards += `<path d="M0 ${y} H400" stroke="#B07B4A" stroke-width="2"/>`;
  return `${sky(skyColor)}<rect x="0" y="${horizon}" width="400" height="${deckY - horizon}" fill="${seaColor}"/>
    <path d="M30 ${horizon + 18} h22 M120 ${horizon + 30} h30 M260 ${horizon + 14} h24 M330 ${horizon + 34} h26" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <rect x="0" y="${deckY}" width="400" height="${300 - deckY}" fill="#C9935F"/>${boards}
    ${posts}<rect x="0" y="${deckY - 54}" width="400" height="7" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
    <rect x="0" y="${deckY - 28}" width="400" height="4" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
}

// Sun rays for the chorus pages.
function rays(cx, cy, colorA, colorB) {
  let out = `<rect width="400" height="300" fill="${colorA}"/>`;
  for (let i = 0; i < 16; i += 2) {
    const a1 = (i / 16) * Math.PI * 2, a2 = ((i + 1) / 16) * Math.PI * 2, R = 520;
    out += `<path d="M${cx} ${cy} L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} L${cx + R * Math.cos(a2)} ${cy + R * Math.sin(a2)} Z" fill="${colorB}"/>`;
  }
  return out;
}

// ---------- Faces ----------

// mood: smile, big (open smile), wow (surprised), sing
function face(cx, cy, mood = 'smile', skin) {
  const eyeY = cy - 1;
  if (mood === 'wow') {
    return `<circle cx="${cx - 5.5}" cy="${eyeY - 1}" r="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="${cx + 5.5}" cy="${eyeY - 1}" r="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="${cx - 5.5}" cy="${eyeY - 1}" r="1.8" fill="${INK}"/><circle cx="${cx + 5.5}" cy="${eyeY - 1}" r="1.8" fill="${INK}"/>
      <ellipse cx="${cx}" cy="${cy + 8}" rx="3.6" ry="4.6" fill="${INK}"/>`;
  }
  const eyes = `<circle cx="${cx - 5}" cy="${eyeY}" r="3.3" fill="#fff"/><circle cx="${cx + 5}" cy="${eyeY}" r="3.3" fill="#fff"/>
    <circle cx="${cx - 4.6}" cy="${eyeY + 0.3}" r="2" fill="${INK}"/><circle cx="${cx + 5.4}" cy="${eyeY + 0.3}" r="2" fill="${INK}"/>
    <circle cx="${cx - 9}" cy="${cy + 4}" r="2.4" fill="#E8735A" opacity=".35"/><circle cx="${cx + 9}" cy="${cy + 4}" r="2.4" fill="#E8735A" opacity=".35"/>`;
  if (mood === 'big') return eyes + `<path d="M${cx - 6} ${cy + 5} Q ${cx} ${cy + 14} ${cx + 6} ${cy + 5} Z" fill="#7A1F1F" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
  if (mood === 'sing') return eyes + `<ellipse cx="${cx}" cy="${cy + 8}" rx="3.2" ry="4" fill="#7A1F1F" stroke="${INK}" stroke-width="1.2"/>`;
  return eyes + `<path d="M${cx - 5} ${cy + 5} Q ${cx} ${cy + 10} ${cx + 5} ${cy + 5}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function mic(x, y) {
  return `<rect x="${x - 2}" y="${y}" width="4" height="13" rx="2" fill="#333"/><circle cx="${x}" cy="${y - 2}" r="4.5" fill="#888" stroke="#333" stroke-width="1.5"/>`;
}

function captainHat(cx, top) {
  return `<rect x="${cx - 15}" y="${top}" width="30" height="9" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
    <rect x="${cx - 17}" y="${top + 8}" width="34" height="4" rx="2" fill="${INK}"/><circle cx="${cx}" cy="${top + 4.5}" r="2.5" fill="#F1C40F"/>`;
}

// ---------- People ----------

// The people (walter, sister, marine, captain) are in characters.js.

// ---------- Things ----------

function blender(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-22" y="-22" width="44" height="22" rx="5" fill="#555" stroke="${INK}" stroke-width="2"/>
    <circle cx="-8" cy="-11" r="3.5" fill="#E74C3C"/><circle cx="4" cy="-11" r="3.5" fill="#2ECC71"/><circle cx="14" cy="-11" r="3.5" fill="#F1C40F"/>
    <path d="M-17 -22 L17 -22 L25 -78 L-25 -78 Z" fill="#DFF6FF" stroke="${INK}" stroke-width="2"/>
    <path d="M-16 -23 L16 -23 L22 -60 Q 0 -54 -22 -60 Z" fill="#7DDB8B"/>
    <circle cx="-6" cy="-40" r="3" fill="#B6F0BF"/><circle cx="7" cy="-48" r="2.5" fill="#B6F0BF"/><circle cx="2" cy="-32" r="2" fill="#B6F0BF"/>
    <path d="M25 -70 Q 38 -64 34 -40 Q 31 -32 21 -34" stroke="${INK}" stroke-width="4" fill="none"/>
    <rect x="-28" y="-87" width="56" height="10" rx="4" fill="#333"/><rect x="-6" y="-94" width="12" height="8" rx="3" fill="#333"/>
  </g>`;
}

function bottle(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-11" y="-40" width="22" height="40" rx="6" fill="#F7DC6F" stroke="${INK}" stroke-width="1.8"/>
    <rect x="-5" y="-54" width="10" height="15" fill="#F7DC6F" stroke="${INK}" stroke-width="1.8"/>
    <rect x="-6" y="-60" width="12" height="7" rx="2" fill="#E74C3C"/>
    <rect x="-9" y="-28" width="18" height="15" rx="2" fill="#fff"/><circle cx="0" cy="-20.5" r="4" fill="#4CAF50"/>
  </g>`;
}

function heart(x, y, s = 1, color = '#E84393') {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C -10 -2, -8 -12, 0 -6 C 8 -12, 10 -2, 0 6 Z" fill="${color}"/>`;
}

function note(x, y, color = '#8E44AD', s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}"><ellipse cx="0" cy="0" rx="6.5" ry="5" transform="rotate(-20)"/><rect x="4.5" y="-26" width="2.6" height="26"/><path d="M7 -26 q 9 4 7 14 q -2 -7 -7 -8 Z"/></g>`;
}

function star(x, y, r = 8, color = '#F1C40F') {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${color}"/>`;
}

function confetti(seed = 1) {
  const colors = ['#E74C3C', '#F1C40F', '#2ECC71', '#3498DB', '#E84393', '#fff'];
  let out = '', n = seed * 9301;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 400, y = rnd() * 150, c = colors[i % colors.length];
    out += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="6" height="10" rx="1" fill="${c}" transform="rotate(${(rnd() * 90 - 45).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }
  return `<g class="twinkle">${out}</g>`;
}

function ship(x, y, s = 1) {
  let windows = '';
  for (let wx = -112; wx <= 100; wx += 24) windows += `<circle cx="${wx}" cy="-58" r="5.5" fill="#5DADE2" stroke="${INK}" stroke-width="1.2"/>`;
  let upper = '';
  for (let wx = -84; wx <= 56; wx += 20) upper += `<rect x="${wx}" y="-96" width="12" height="9" rx="2" fill="#5DADE2"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="44" cy="-178" r="8" fill="#ECF0F1"/><circle cx="58" cy="-192" r="11" fill="#ECF0F1"/><circle cx="76" cy="-200" r="9" fill="#ECF0F1"/>
    <rect x="22" y="-170" width="30" height="62" style="fill:${BOAT}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="22" y="-170" width="30" height="9" fill="${INK}"/>
    <path d="M-70 -132 L-70 -150 M-70 -150 L-54 -145 L-70 -140" stroke="${INK}" stroke-width="2" style="fill:${BOAT}"/>
    <rect x="-72" y="-132" width="80" height="24" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-66 -124 h68" stroke="#5DADE2" stroke-width="7"/>
    <rect x="-100" y="-108" width="180" height="32" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${upper}
    <rect x="-132" y="-76" width="256" height="36" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${windows}
    <path d="M-176 -40 L176 -40 L146 4 L-152 4 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-171 -26 L166 -26 L159 -16 L-164 -16 Z" style="fill:${BOAT}"/>
  </g>`;
}

function speedboat(x, y, s = 1, { motor = true, windshield = false } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${motor ? `<path d="M-136 -52 h24 v16 h-7 v28 h-10 v-28 h-7 Z" fill="#555" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` : ''}
    ${windshield ? `<path d="M44 -40 L58 -62 L76 -62 L80 -40 Z" fill="#D6EEFF" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` : ''}
    <path d="M-104 -46 H86" stroke="${INK}" stroke-width="2"/>
    ${[-96, -60, -24, 12, 48, 82].map((px) => `<path d="M${px} -46 V-40" stroke="${INK}" stroke-width="2"/>`).join('')}
    <path d="M-120 -40 L92 -40 Q 126 -40 152 -54 Q 140 -22 104 3 L-98 3 Q -114 -14 -120 -40 Z" style="fill:${BOAT}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-117 -29 L124 -29 Q 136 -32 143 -38 Q 138 -28 128 -21 L-112 -21 Z" fill="#fff"/>
  </g>`;
}

function steeringWheel(x, y, r = 14) {
  let spokes = '';
  for (let a = 0; a < 180; a += 45) {
    const rad = (a * Math.PI) / 180;
    spokes += `<path d="M${x - (r + 5) * Math.cos(rad)} ${y - (r + 5) * Math.sin(rad)} L${x + (r + 5) * Math.cos(rad)} ${y + (r + 5) * Math.sin(rad)}" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>`;
  }
  return `${spokes}<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8B5A2B" stroke-width="4"/><circle cx="${x}" cy="${y}" r="3.5" fill="#8B5A2B"/>`;
}

function bubble(x, y, w, h, text, tailX, tailY) {
  return `<g><path d="M${x + w * 0.45} ${y + h / 2 - 3} L${tailX} ${tailY} L${x + w * 0.6} ${y + h / 2 - 3} Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <path d="M${x + w * 0.45 + 2} ${y + h / 2 - 3} L${x + w * 0.6 - 2} ${y + h / 2 - 3}" stroke="#fff" stroke-width="4"/>
    <text x="${x + w / 2}" y="${y + 9}" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="27" fill="${INK}">${text}</text></g>`;
}

function numberBall(x, y, n, bounce) {
  return `<g class="bounce" style="animation-delay:${bounce}s"><circle cx="${x}" cy="${y}" r="21" fill="#FFD34D" stroke="${INK}" stroke-width="2.5"/>
    <text x="${x}" y="${y + 10}" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="30" fill="${INK}">${n}</text></g>`;
}

// ---------- Scenes ----------

// Tappable parts of a picture. Tapping a magic word in the lyrics (or the thing itself)
// sets them off:
//   reveal(name, …)    hidden until its word is tapped, then pops in
//   play(name, anim, …) moves when its word is tapped (anim: hop, shake, board)
// A name can appear on several parts; they all go off together.
const reveal = (name, inner, cls = '') => `<g data-fx="${name}" class="reveal ${cls}">${inner}</g>`;
const play = (name, anim, inner) => `<g data-fx="${name}" data-anim="${anim}">${inner}</g>`;
const hop = (inner) => play('tap', 'hop', inner);

function shout(x, y, text, size = 34, fill = '#fff') {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="800" font-size="${size}" fill="${fill}" stroke="${INK}" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${text}</text>`;
}
function sparkles(list) { return list.map(([x, y, r, c]) => star(x, y, r, c || '#F1C40F')).join(''); }

function palmIsland(x, y) {
  return `<ellipse cx="${x}" cy="${y}" rx="46" ry="12" fill="#F5D99B"/>
    <path d="M${x + 4} ${y - 4} Q ${x + 10} ${y - 40} ${x + 2} ${y - 70}" stroke="#8B5A2B" stroke-width="7" fill="none" stroke-linecap="round"/>
    ${[[-34, -8], [-20, -26], [16, -28], [32, -6], [0, -36]].map(([dx, dy]) =>
      `<path d="M${x + 2} ${y - 70} Q ${x + 2 + dx * 0.6} ${y - 70 + dy - 12} ${x + 2 + dx} ${y - 70 + dy + 10}" stroke="#27AE60" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}`;
}

// The captain's speedboat with Walter and the captain aboard (cover and the "motor" page).
function speedboatCrew({ walterMood = 'big', walterArm = 'wave' } = {}) {
  return `<circle cx="44" cy="218" r="13" fill="#fff"/><circle cx="26" cy="204" r="10" fill="#fff"/><circle cx="44" cy="196" r="7" fill="#fff"/><circle cx="16" cy="222" r="8" fill="#fff"/>
    ${hop(walter({ x: 140, y: 228, s: 0.95, mood: walterMood, arm: walterArm }))}
    <rect x="263" y="174" width="16" height="40" rx="3" fill="#ECF0F1" stroke="${INK}" stroke-width="2"/>
    ${steeringWheel(271, 170, 11)}
    ${hop(captain({ x: 246, y: 226, s: 0.95, wheel: [268, 170] }))}
    ${speedboat(200, 248, 1.05, { windshield: false })}`;
}

function chorusScene(sunset) {
  const back = sunset
    ? `${rays(200, 210, '#FFB067', '#FFC48A')}${sun(200, 214, 60, '#FF7A45')}${gulls([[80, 70], [102, 82, 0.8], [300, 64]])}`
    : rays(200, 150, '#FFE08A', '#FFD34D');
  return `${back}
    ${reveal('stars', sparkles([[40, 44, 14], [360, 50, 16], [250, 30, 10, '#fff'], [140, 36, 11, '#fff'], [70, 120, 9, '#fff'], [330, 130, 10]]))}
    ${reveal('confetti', confetti(sunset ? 5 : 3), 'fall')}
    <rect x="0" y="236" width="400" height="64" style="fill:${BOAT}"/><rect x="0" y="236" width="400" height="8" fill="${INK}" opacity=".25"/>
    ${play('shake', 'shake', sister({ x: 92, y: 262, s: 1.05, who: 'tish', mood: 'big', arm: 'up' }))}
    ${play('shake', 'shake', sister({ x: 312, y: 262, s: 1.05, who: 'mariana', mood: 'big', arm: 'up' }))}
    ${play('pump', 'hop', `<g class="pump">${walter({ x: 196, y: 272, s: 1.2, mood: 'big', arm: 'up' })}</g>`)}`;
}

const SCENES = {
  // Cover: Walter and the captain out on the speedboat (the same boat as the "motor" page).
  cover: () => `${sky()}${sun(338, 52, 28)}${cloud(70, 56, 1.1)}${cloud(230, 36, 0.8)}${gulls([[150, 70], [172, 82, 0.8], [292, 96, 0.7]])}
    ${palmIsland(340, 236)}
    <g class="bob">${speedboatCrew({ walterArm: 'wave' })}</g>${sea(240)}`,

  // "…go on a cruise / bring his blender on the cruise. Oh yeah"
  blender: () => `${deck()}${sun(352, 44, 26)}${cloud(90, 50)}${gulls([[230, 60], [252, 72, 0.8]])}
    ${reveal('horn', `${shout(120, 112, 'TOOT TOOT!', 38)}`)}
    <circle cx="66" cy="182" r="20" fill="none" style="stroke:${BOAT}" stroke-width="9"/><circle cx="66" cy="182" r="20" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="10 21"/>
    ${reveal('yeah', sparkles([[110, 120, 12], [196, 112, 10], [86, 200, 8, '#fff'], [214, 176, 9, '#fff']]))}
    ${play('yeah', 'hop', walter({ x: 150, y: 286, s: 1.25, mood: 'big', arm: 'reach' }))}
    <rect x="232" y="206" width="120" height="12" rx="3" fill="#8B5A2B"/><rect x="246" y="218" width="9" height="70" fill="#7A4A22"/><rect x="330" y="218" width="9" height="70" fill="#7A4A22"/>
    ${play('blend', 'shake', blender(292, 206, 1.15))}
    ${reveal('blend', `${shout(300, 96, 'WHIRRR!', 34)}<circle cx="262" cy="118" r="5" fill="#7DDB8B"/><circle cx="334" cy="120" r="6" fill="#7DDB8B"/><circle cx="318" cy="96" r="4" fill="#7DDB8B"/>`)}`,

  // "Walter's sister loves salad … give her the recipe for salad. That's right"
  salad: () => `${deck('#CDEBFF')}${sun(60, 46, 22)}${cloud(300, 46)}
    ${reveal('love', `${heart(296, 74, 1.6)}${heart(322, 52, 1.1)}${heart(272, 50, 0.9)}${heart(340, 86, 0.8)}`)}
    <rect x="160" y="226" width="90" height="10" rx="3" fill="#8B5A2B"/><rect x="170" y="236" width="8" height="52" fill="#7A4A22"/><rect x="232" y="236" width="8" height="52" fill="#7A4A22"/>
    ${play('love', 'shake', bottle(205, 226, 0.95))}
    ${reveal('recipe', sparkles([[130, 160, 9], [160, 172, 7, '#fff'], [150, 140, 6]]) + shout(150, 128, 'RECIPE!', 26))}
    ${play('recipe', 'hop', walter({ x: 100, y: 286, s: 1.2, mood: 'big', arm: 'card' }))}
    ${play('right', 'hop', sister({ x: 300, y: 290, s: 1.2, who: 'mariana', mood: 'big', arm: 'bowl' }))}
    ${reveal('right', `${shout(300, 104, "THAT'S RIGHT!", 30)}`)}`,

  // Chorus: "That's what I do / They can't stop us / Not a chance / We were born for this"
  chorus: () => chorusScene(false),

  // "…he saw the water / The captain revved the motor and he was like WHAT!?"
  motor: () => `${sky()}${cloud(330, 56)}
    ${reveal('zoom', `<path d="M14 140 h46 M4 156 h52 M18 172 h34" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`)}
    ${reveal('bubble', bubble(30, 48, 130, 64, 'WHAT!?', 108, 112))}
    ${play('zoom', 'shake', `<g class="zoom">${speedboatCrew({ walterMood: 'wow', walterArm: 'lap' })}</g>`)}
    ${sea(240)}
    ${reveal('zoom', `<path d="M62 256 Q 34 264 6 256 M70 270 Q 42 278 14 272" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`)}
    ${reveal('splash', [[352, 214, 9], [370, 196, 7], [386, 214, 8], [336, 196, 6], [96, 232, 7], [76, 218, 6]].map(([x, y, r]) =>
      `<path d="M${x} ${y - r * 1.8} Q ${x + r} ${y} ${x} ${y + r} Q ${x - r} ${y} ${x} ${y - r * 1.8} Z" fill="#BFE6FF" stroke="#1B6CB8" stroke-width="2"/>`).join('') + shout(342, 136, 'SPLASH!', 32))}`,

  // "…a little bit scary … The Marines helped me onto the boat, I said 1, 2, 3"
  marines: () => `${sky()}${sun(360, 40, 20)}
    ${reveal('n1', numberBall(120, 50, 1, 0))}${reveal('n2', numberBall(200, 40, 2, 0.25))}${reveal('n3', numberBall(280, 50, 3, 0.5))}
    <rect x="0" y="210" width="400" height="90" fill="#2E86DE"/>
    <g class="bob">${speedboat(370, 252, 1.05, { motor: false, windshield: false })}</g>
    <rect x="0" y="206" width="104" height="14" fill="#A0522D" stroke="#5D2E0F" stroke-width="2"/>
    <rect x="12" y="220" width="12" height="80" fill="#8B4513"/><rect x="74" y="220" width="12" height="80" fill="#8B4513"/>
    <path d="M100 210 L 290 216" stroke="#8B4513" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 196 L 290 202" stroke="#8B4513" stroke-width="3"/>
    ${play('marines', 'hop', marine({ x: 104, y: 206, s: 1, skin: '#C68B5E', arm: 'help' }))}
    ${play('n3', 'stepaside', play('marines', 'hop', marine({ x: 270, y: 212, s: 1, skin: '#8D5524', arm: 'help', flip: true })))}
    ${play('n3', 'board', play('scary', 'shake', walter({ x: 186, y: 210, s: 1.0, mood: 'big', arm: 'lap' })))}
    ${sea(262)}`,

  // "We sang Boyz II Men on the cruise"
  sing: () => `<rect width="400" height="300" fill="#1F2A5A"/>
    ${star(40, 36, 4, '#fff')}${star(120, 22, 3, '#fff')}${star(300, 30, 4, '#fff')}${star(370, 70, 3, '#fff')}${star(220, 18, 3, '#fff')}
    <circle cx="340" cy="44" r="20" fill="#F7F3D0"/><circle cx="350" cy="38" r="17" fill="#1F2A5A"/>
    ${reveal('lights', `<path d="M70 0 L 20 250 L 150 250 Z" fill="#FFE08A" opacity=".25"/><path d="M330 0 L 250 250 L 380 250 Z" fill="#FFE08A" opacity=".25"/>
      <path d="M200 0 L 140 250 L 260 250 Z" fill="#FFE08A" opacity=".3"/>`)}
    <rect x="0" y="246" width="400" height="54" fill="#6D3B1A"/><rect x="0" y="246" width="400" height="8" fill="#8B5A2B"/>
    ${reveal('lights', `<g class="float">${note(60, 120, '#FFD34D')}${note(338, 128, '#E84393')}${note(150, 74, '#7DDB8B', 0.9)}${note(270, 82, '#5DADE2', 0.9)}</g>`)}
    ${hop(sister({ x: 84, y: 258, s: 1.05, who: 'tish', mood: 'sing', arm: 'mic' }))}
    ${hop(sister({ x: 316, y: 258, s: 1.05, who: 'mariana', mood: 'sing', arm: 'mic' }))}
    ${play('mic', 'hop', walter({ x: 192, y: 266, s: 1.15, mood: 'sing', arm: 'mic' }))}
    ${reveal('mic', shout(200, 60, 'YEAH!', 40))}`,

  // "My sister Tish was driving the boat and then my sister Mariana and then ME!"
  drive: () => `${sky('#C6EAFF')}${sun(56, 48, 24)}${cloud(250, 46)}${gulls([[320, 92], [342, 80, 0.8]])}
    <g class="bob">
      ${play('tish', 'hop', sister({ x: 92, y: 232, s: 0.95, who: 'tish', mood: 'big', arm: 'up' }))}
      ${play('mariana', 'hop', sister({ x: 140, y: 232, s: 0.95, who: 'mariana', mood: 'big', arm: 'wave' }))}
      <rect x="244" y="148" width="12" height="88" rx="3" fill="#ECF0F1" stroke="${INK}" stroke-width="2"/>
      ${steeringWheel(250, 142, 14)}
      ${play('me', 'hop', walter({ x: 214, y: 236, s: 1.05, mood: 'big', arm: [250, 142] }) +
        reveal('me', `<g transform="translate(214 236) scale(1.05)">${captainHat(-6, -144)}</g>`))}
      ${speedboat(200, 262, 1.15, { windshield: false })}
    </g>${sea(254)}
    ${reveal('tish', shout(66, 84, 'TISH!', 28))}${reveal('mariana', shout(158, 40, 'MARIANA!', 26))}${reveal('me', shout(296, 62, 'WALTER!', 34))}`,

  // Last chorus, at sunset.
  finale: () => chorusScene(true),
};

// A big open hand, waving (used on the hello and goodbye pages).
function waveHand(x, y, s = 1, r = -12, skin = '#D9A877', sleeve = '#F57C14') {
  return `<g class="wave-hand" style="transform-origin:${x}px ${y + 40 * s}px">
  <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${skin}" stroke="${INK}" stroke-width="4" stroke-linejoin="round">
      <rect x="-42" y="-60" width="84" height="80" rx="30"/>
      <rect x="-40" y="-130" width="18" height="84" rx="9"/><rect x="-18" y="-146" width="18" height="100" rx="9"/>
      <rect x="4" y="-140" width="18" height="94" rx="9"/><rect x="26" y="-120" width="17" height="76" rx="8.5"/>
      <rect x="-76" y="-46" width="44" height="18" rx="9" transform="rotate(35 -54 -37)"/>
      <rect x="-30" y="20" width="60" height="40" fill="${sleeve}"/></g></g>`;
}

function shaker(x, y, s = 1, c = '#E74C3C') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="0" width="8" height="34" rx="3" fill="#8B5A2B" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="0" cy="-14" rx="16" ry="20" fill="${c}" stroke="${INK}" stroke-width="2.5"/><path d="M-10 -20 Q 0 -26 10 -20 M-12 -10 Q 0 -4 12 -10" stroke="#fff" stroke-width="3" fill="none"/></g>`;
}

Object.assign(SCENES, {
  // Hello: the sun coming up and a big wave.
  helloSun: () => `<rect width="400" height="300" fill="#FFE9C7"/>${sun(200, 300, 130, '#FFC24D')}${sun(200, 300, 90, '#FFB02E')}
    ${cloud(70, 70)}${cloud(330, 56, 0.9)}${gulls([[110, 120], [132, 108, 0.8], [290, 120]])}
    ${waveHand(200, 252, 0.95, -12, '#C68B5E')}
    <path d="M100 120 q -14 30 0 60 M76 106 q -22 44 0 88 M300 120 q 14 30 0 60 M324 106 q 22 44 0 88" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,

  // "Time to pick up our stuff": instruments going into a basket.
  pack: () => `<rect width="400" height="300" fill="#D5F0DD"/><rect x="0" y="236" width="400" height="64" fill="#C9935F"/><path d="M0 262 H400 M0 286 H400" stroke="#B07B4A" stroke-width="2"/>
    <g class="float">${shaker(96, 70, 1.1, '#E74C3C')}</g>
    <g class="float" style="animation-delay:.5s"><g transform="translate(300 60) rotate(18)">
      <circle cx="0" cy="0" r="34" fill="#F5E6C8" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="0" r="24" fill="none" stroke="#C9935F" stroke-width="3"/>
      ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${34 * Math.cos(a * Math.PI / 180)}" cy="${34 * Math.sin(a * Math.PI / 180)}" r="6" fill="#F1C40F" stroke="${INK}" stroke-width="2"/>`).join('')}</g></g>
    <g transform="translate(206 126) rotate(-10)">
      <path d="M-34 0 L34 0 L28 50 L-28 50 Z" fill="#2563EB" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="0" cy="0" rx="34" ry="10" fill="#F5E6C8" stroke="${INK}" stroke-width="3.5"/></g>
    <path d="M150 140 Q 170 116 196 130 M262 110 Q 250 130 236 140" stroke="${INK}" stroke-width="3" fill="none" stroke-dasharray="6 6"/>
    <path d="M100 176 L300 176 L280 272 L120 272 Z" fill="#E0A458" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    ${[196, 216, 236, 256].map((y) => `<path d="M${104 + (y - 176) * 0.2} ${y} H${296 - (y - 176) * 0.2}" stroke="#B9783A" stroke-width="3"/>`).join('')}
    <path d="M130 176 Q 200 110 270 176" stroke="#B9783A" stroke-width="9" fill="none"/>`,

  // "I'll see you again, it won't be long": sunset and a wave goodbye.
  byeSunset: () => `<rect width="400" height="300" fill="#FFB067"/>${sun(200, 230, 80, '#FF7A45')}
    <rect x="0" y="226" width="400" height="74" fill="#2E6FB8"/><path d="M120 248 L280 248 M150 266 L250 266" stroke="#FF9F6B" stroke-width="4" stroke-linecap="round"/>
    ${gulls([[70, 70], [92, 82, 0.8], [320, 60]])}
    ${waveHand(316, 262, 0.75, 14, '#5A3825', '#2563EB')}`,

  // "I'll see you later my friend": two waving hands under the stars.
  byeFriends: () => `<rect width="400" height="300" fill="#2B3A6B"/>
    <circle cx="330" cy="60" r="28" fill="#F7F3D0"/><circle cx="344" cy="52" r="25" fill="#2B3A6B"/>
    ${star(60, 50, 6, '#fff')}${star(150, 30, 5, '#fff')}${star(240, 44, 4, '#fff')}${star(380, 150, 5, '#fff')}${star(30, 150, 4, '#fff')}
    ${heart(200, 80, 2.6, '#E84393')}
    ${waveHand(116, 250, 0.85, -14, '#D9A877', '#F57C14')}
    ${waveHand(284, 250, 0.85, 14, '#5A3825', '#27AE60')}`,
});

// name is a drawn scene above, or (for songs made in the Song Builder) a description
// of the background and thing to show — see builtScene() in builder.js.
function scene(name) {
  const inner = typeof name === 'object' ? builtScene(name) : SCENES[name]();
  return `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

// ---------- Menu pictures for the other activities ----------

const THUMBS = {
  // A hand drum with a burst of stars.
  react: () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice">${rays(200, 170, '#FFE08A', '#FFD34D')}
    ${star(90, 70, 18, '#E74C3C')}${star(310, 64, 22, '#2563EB')}${star(330, 170, 14, '#27AE60')}${star(70, 180, 14, '#E84393')}
    <path d="M140 150 L260 150 L240 262 L160 262 Z" fill="#C0392B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M150 190 L250 190 M156 226 L244 226" stroke="#F1C40F" stroke-width="6"/>
    <ellipse cx="200" cy="150" rx="62" ry="18" fill="#F5E6C8" stroke="${INK}" stroke-width="4"/>
    <path d="M200 80 L200 112 M160 92 L176 118 M240 92 L224 118" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></svg>`,
  // A notebook with a pencil and notes.
  builder: () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#D5F0DD"/>
    <rect x="100" y="50" width="200" height="210" rx="12" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M126 100 h148 M126 140 h148 M126 180 h148 M126 220 h100" stroke="#BDC3C7" stroke-width="4" stroke-linecap="round"/>
    ${note(150, 140, '#8E44AD', 1.6)}${note(230, 180, '#E84393', 1.4)}
    <g transform="rotate(35 300 190)"><rect x="286" y="110" width="28" height="140" rx="4" fill="#F1C40F" stroke="${INK}" stroke-width="4"/>
    <path d="M286 250 L300 280 L314 250 Z" fill="#F5CBA7" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="286" y="104" width="28" height="18" rx="3" fill="#E84393" stroke="${INK}" stroke-width="4"/></g></svg>`,
  // A big waving hand and a sun coming up.
  hello: () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#FFE9C7"/>${sun(200, 300, 110, '#FFC24D')}
    <g transform="translate(200 210) rotate(-12)" fill="#D9A877" stroke="${INK}" stroke-width="4" stroke-linejoin="round">
      <rect x="-42" y="-60" width="84" height="80" rx="30"/>
      <rect x="-40" y="-130" width="18" height="84" rx="9"/><rect x="-18" y="-146" width="18" height="100" rx="9"/>
      <rect x="4" y="-140" width="18" height="94" rx="9"/><rect x="26" y="-120" width="17" height="76" rx="8.5"/>
      <rect x="-76" y="-46" width="44" height="18" rx="9" transform="rotate(35 -54 -37)"/></g>
    <path d="M90 90 q -14 30 0 60 M66 76 q -22 44 0 88 M310 90 q 14 30 0 60 M334 76 q 22 44 0 88" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
  // Four picture choices.
  choice: () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E3E8FF"/>
    <rect x="70" y="40" width="120" height="100" rx="14" fill="#FFD34D" stroke="${INK}" stroke-width="4"/>
    <rect x="210" y="40" width="120" height="100" rx="14" fill="#7DDB8B" stroke="${INK}" stroke-width="4"/>
    <rect x="70" y="160" width="120" height="100" rx="14" fill="#5DADE2" stroke="${INK}" stroke-width="4"/>
    <rect x="210" y="160" width="120" height="100" rx="14" fill="#F5A3C7" stroke="${INK}" stroke-width="4"/>
    ${star(130, 90, 26, '#fff')}${note(262, 106, '#fff', 1.7)}
    <path d="M110 230 q 20 -40 40 0 q -20 20 -40 0 Z" fill="#fff"/><circle cx="270" cy="210" r="26" fill="#fff"/></svg>`,
  // A waving hand and the moon.
  goodbye: () => `<svg data-sketch viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#2B3A6B"/>
    <circle cx="310" cy="70" r="34" fill="#F7F3D0"/><circle cx="326" cy="60" r="30" fill="#2B3A6B"/>
    ${star(70, 50, 6, '#fff')}${star(150, 30, 5, '#fff')}${star(240, 44, 4, '#fff')}${star(360, 160, 5, '#fff')}${star(40, 150, 4, '#fff')}
    <g transform="translate(200 230) rotate(12)" fill="#D9A877" stroke="${INK}" stroke-width="4" stroke-linejoin="round">
      <rect x="-42" y="-60" width="84" height="80" rx="30"/>
      <rect x="-40" y="-120" width="18" height="74" rx="9"/><rect x="-18" y="-136" width="18" height="90" rx="9"/>
      <rect x="4" y="-130" width="18" height="84" rx="9"/><rect x="26" y="-110" width="17" height="66" rx="8.5"/>
      <rect x="32" y="-46" width="44" height="18" rx="9" transform="rotate(-35 54 -37)"/></g></svg>`,
};
