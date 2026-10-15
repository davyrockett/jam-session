// The character kit: everyone in the songbook is built from the same parts with fixed
// proportions, so they look the same on every page and never lose a leg.
//   walter()  – seated in his manual wheelchair, facing right
//   sister()  – Tish or Mariana, standing
//   marine()  – a US Marine in woodland camouflage
//   captain() – the boat's captain, steering
// (x, y) is the spot on the ground under the person (for Walter: under his big wheel).
// Arms bend at the elbow and reach for a target point, so a hand always lands where
// it's meant to (on the wheel, the bowl, the microphone…). Proportions and the
// wheelchair were checked against reference photos.

const KIT = {
  ink: '#2C3E50',
  metal: '#8E9AA0',
  fabric: '#3A3A3A',
  armUpper: 21,
  armLower: 20,
};

const limb = (x1, y1, x2, y2, w, color) =>
  `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;

// An arm from the shoulder (sx, sy) reaching for (tx, ty). bend: 'out' (elbow away
// from the body, side = -1 left / 1 right) or 'down'. Returns the drawing and the hand.
function armTo(sx, sy, tx, ty, { side = 1, bend = 'out', sleeve, skin, longSleeve = false, L1 = KIT.armUpper, L2 = KIT.armLower } = {}) {
  const dx = tx - sx, dy = ty - sy;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(L1 - L2) + 0.5), L1 + L2 - 0.5);
  const a = Math.atan2(dy, dx);
  const B = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const options = [a + B, a - B].map((t) => [sx + L1 * Math.cos(t), sy + L1 * Math.sin(t)]);
  const elbow = bend === 'down'
    ? (options[0][1] > options[1][1] ? options[0] : options[1])
    : (options[0][0] * side > options[1][0] * side ? options[0] : options[1]);
  const hand = [sx + d * Math.cos(a), sy + d * Math.sin(a)];
  const svg = limb(sx, sy, elbow[0], elbow[1], 8.5, sleeve)
    + limb(elbow[0], elbow[1], hand[0], hand[1], longSleeve ? 8 : 7, longSleeve ? sleeve : skin)
    + `<circle cx="${hand[0].toFixed(1)}" cy="${hand[1].toFixed(1)}" r="4.8" fill="${skin}"/>`;
  return { svg, hand };
}

function micAt([hx, hy]) {
  return `<rect x="${hx - 2.2}" y="${hy - 13}" width="4.4" height="14" rx="2" fill="#333"/><circle cx="${hx}" cy="${hy - 15}" r="5" fill="#9AA4A8" stroke="#333" stroke-width="1.5"/>`;
}

function recipeCardAt([hx, hy]) {
  return `<g transform="rotate(-8 ${hx + 10} ${hy - 6})"><rect x="${hx - 2}" y="${hy - 20}" width="28" height="22" rx="2" fill="#fff" stroke="${KIT.ink}" stroke-width="1.5"/>
    <path d="M${hx + 2} ${hy - 14} h18 M${hx + 2} ${hy - 9} h14 M${hx + 2} ${hy - 4} h16" stroke="#7F8C8D" stroke-width="1.5"/><circle cx="${hx + 21}" cy="${hy - 15}" r="2.6" fill="#27AE60"/></g>`;
}

function saladBowlAt(cx, cy) {
  return `<path d="M${cx - 25} ${cy - 4} L${cx + 25} ${cy - 4} Q ${cx + 23} ${cy + 17} ${cx} ${cy + 19} Q ${cx - 23} ${cy + 17} ${cx - 25} ${cy - 4} Z" fill="#16A085" stroke="${KIT.ink}" stroke-width="1.5"/>
    <circle cx="${cx - 14}" cy="${cy - 8}" r="6.5" fill="#6BCB77"/><circle cx="${cx - 3}" cy="${cy - 11}" r="7.5" fill="#4CAF50"/><circle cx="${cx + 10}" cy="${cy - 9}" r="7" fill="#6BCB77"/>
    <circle cx="${cx + 3}" cy="${cy - 7}" r="3.6" fill="#E74C3C"/><circle cx="${cx - 9}" cy="${cy - 6}" r="3.2" fill="#E74C3C"/><circle cx="${cx + 16}" cy="${cy - 6}" r="3.2" fill="#F39C12"/>`;
}

// ---------- Walter, in his wheelchair ----------

// arm: lap, wave, up, reach, mic, card — or [x, y] in the picture to reach for.
function walter({ x, y, s = 1, mood = 'smile', arm = 'lap', hat = false, shirt = PEOPLE.walter.shirt } = {}) {
  const { skin, hair } = PEOPLE.walter;
  const pants = '#34495E';
  const targets = { lap: [16, -62], wave: [32, -128], up: [26, -144], reach: [32, -86], mic: [16, -100], card: [32, -86] };
  const target = Array.isArray(arm) ? [(arm[0] - x) / s, (arm[1] - y) / s] : targets[arm] || targets.lap;
  const a = armTo(-6, -94, target[0], target[1], { side: 1, bend: arm === 'lap' ? 'down' : 'out', sleeve: shirt, skin });
  let held = '';
  if (arm === 'mic') held = micAt(a.hand);
  if (arm === 'card') held = recipeCardAt(a.hand);

  let spokes = '';
  for (let t = 0; t < 180; t += 30) {
    const r = (t * Math.PI) / 180, dx = 20 * Math.cos(r), dy = 20 * Math.sin(r);
    spokes += `<path d="M${(-dx).toFixed(1)} ${(-26 - dy).toFixed(1)} L${dx.toFixed(1)} ${(-26 + dy).toFixed(1)}" stroke="#AEB6BA" stroke-width="1.3"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-17 -52 L-22 -98 L-13 -98 L-9 -52 Z" fill="${KIT.fabric}"/>
    ${limb(-12, -46, -21, -100, 4, KIT.metal)}${limb(-21, -100, -32, -100, 4, KIT.metal)}${limb(-32, -100, -26, -100, 6, '#222')}
    <path d="M-21 -94 Q -21 -103 -12 -103 L-2 -103 Q 7 -103 7 -94 L 9 -54 L-21 -54 Z" fill="${shirt}"/>
    <rect x="-11" y="-111" width="9" height="10" fill="${skin}"/>
    <circle cx="-21" cy="-118" r="3.6" fill="${skin}"/><circle cx="9" cy="-118" r="3.6" fill="${skin}"/>
    <circle class="noshade" cx="-6" cy="-118" r="15" fill="${skin}"/>
    <path d="M-21 -118 C -22 -139, 10 -139, 9 -118 C 6 -129, -18 -129, -21 -118 Z" fill="${hair}"/>
    ${hat ? captainHat(-6, -144) : ''}
    ${face(-6, -117, mood, skin)}
    ${limb(-8, -56, 26, -57, 14, pants)}${limb(26, -57, 34, -22, 12, pants)}
    <ellipse cx="39" cy="-18" rx="9.5" ry="5" fill="#222"/>
    <rect x="-18" y="-53" width="42" height="6" rx="2" fill="${KIT.fabric}"/>
    ${limb(10, -70, 14, -50, 3, KIT.metal)}${limb(-14, -71, 14, -71, 6, KIT.fabric)}
    ${limb(20, -48, 28, -15, 3.5, KIT.metal)}${limb(21, -44, 34, -14, 3, KIT.metal)}${limb(29, -12, 47, -12, 3.5, '#333')}
    <circle cx="27" cy="-7" r="7" fill="#333"/><circle cx="27" cy="-7" r="2.2" fill="#999"/>
    <circle cx="0" cy="-26" r="26" fill="none" stroke="#2B2B2B" stroke-width="5"/>
    <circle cx="0" cy="-26" r="22.5" fill="none" stroke="${KIT.metal}" stroke-width="1.6"/>
    <circle cx="0" cy="-26" r="20" fill="none" stroke="#BDC3C7" stroke-width="1.8"/>${spokes}
    <circle cx="0" cy="-26" r="3.5" fill="#555"/>
    ${a.svg}${held}
  </g>`;
}

// ---------- Standing people ----------

// The shared standing body. arms: { left: [x, y] | null, right: [x, y] | null } targets
// relative to the person; hold: drawn after the arms (things in the hands).
function standing({ skin, shirt, pants, shoes = '#222', longSleeve = false, head, arms, extra = '', hold = () => '', shirtFill }) {
  const left = armTo(-12, -92, arms.left[0], arms.left[1], { side: -1, sleeve: shirt, skin, longSleeve });
  const right = armTo(12, -92, arms.right[0], arms.right[1], { side: 1, sleeve: shirt, skin, longSleeve });
  return `${limb(-6, -52, -7, -9, 9.5, pants)}${limb(6, -52, 7, -9, 9.5, pants)}
    <ellipse cx="-9" cy="-4.5" rx="8" ry="4.5" fill="${shoes}"/><ellipse cx="9" cy="-4.5" rx="8" ry="4.5" fill="${shoes}"/>
    <path d="M-15 -89 Q -15 -99 -6 -99 L6 -99 Q 15 -99 15 -89 L14 -50 L-14 -50 Z" fill="${shirtFill || shirt}"/>
    ${shirtFill ? `<path d="M-15 -89 Q -15 -99 -6 -99 L6 -99 Q 15 -99 15 -89 L14 -50 L-14 -50 Z" fill="none" stroke="${KIT.ink}" stroke-width="1.2"/>` : ''}
    ${extra}
    <rect x="-4" y="-107" width="8" height="10" fill="${skin}"/>
    ${head}
    ${left.svg}${right.svg}${hold(left.hand, right.hand)}`;
}

const STAND_ARMS = {
  down: { left: [-18, -56], right: [18, -56] },
  up: { left: [-26, -140], right: [26, -140] },
  wave: { left: [-18, -56], right: [30, -128] },
  bowl: { left: [-13, -66], right: [13, -66] },
  mic: { left: [-18, -56], right: [18, -102] },
};

function sister({ x, y, s = 1, who = 'tish', mood = 'smile', arm = 'down' } = {}) {
  const { skin, hair, shirt, style } = PEOPLE[who];
  const back = style === 'long'
    ? `<path d="M-17 -119 Q -21 -86 -13 -83 L 13 -83 Q 21 -86 17 -119 Z" fill="${hair}"/>`
    : `<ellipse cx="19" cy="-113" rx="6" ry="13" fill="${hair}" transform="rotate(-20 19 -113)"/><rect x="11" y="-126" width="6" height="7" rx="2" fill="#F1C40F"/>`;
  const head = `<circle cx="-15" cy="-116" r="3.4" fill="${skin}"/><circle cx="15" cy="-116" r="3.4" fill="${skin}"/>
    <circle class="noshade" cx="0" cy="-117" r="15" fill="${skin}"/>
    <path d="M-16 -114 C -17 -138, 17 -138, 16 -114 C 10 -125, -10 -125, -16 -114 Z" fill="${hair}"/>
    ${face(0, -116, mood, skin)}`;
  const hold = (l, r) => (arm === 'bowl' ? saladBowlAt(0, -72) : arm === 'mic' ? micAt(r) : '');
  return `<g transform="translate(${x} ${y}) scale(${s})">${back}
    ${standing({ skin, shirt, pants: '#2C3E50', head, arms: STAND_ARMS[arm] || STAND_ARMS.down, hold })}</g>`;
}

// Woodland "digital" camouflage, as on the Marines' utility uniform.
const MARPAT = `<defs><pattern id="marpat" width="12" height="12" patternUnits="userSpaceOnUse">
  <rect width="12" height="12" fill="#6E7B4E"/><rect x="0" y="0" width="4" height="2" fill="#4B5530"/><rect x="2" y="2" width="2" height="2" fill="#4B5530"/>
  <rect x="6" y="4" width="4" height="2" fill="#8C7B57"/><rect x="8" y="6" width="2" height="2" fill="#8C7B57"/><rect x="2" y="8" width="2" height="2" fill="#2F3424"/>
  <rect x="4" y="8" width="2" height="2" fill="#2F3424"/><rect x="9" y="10" width="3" height="2" fill="#4B5530"/></pattern></defs>`;

// arm: down, help (reaching out to help someone)
function marine({ x, y, s = 1, skin = '#8D5524', arm = 'down', flip = false } = {}) {
  const head = `<circle cx="-15" cy="-115" r="3.4" fill="${skin}"/><circle cx="15" cy="-115" r="3.4" fill="${skin}"/>
    <circle class="noshade" cx="0" cy="-117" r="15" fill="${skin}"/>
    <path d="M-15 -122 L-14 -137 L14 -137 L15 -122 Z" fill="url(#marpat)"/><path d="M-15 -122 L-14 -137 L14 -137 L15 -122 Z" fill="none" stroke="${KIT.ink}" stroke-width="1.2"/>
    <path d="M-16 -123 L17 -123 Q 22 -122 23 -118 L-16 -119 Z" fill="#3E4528"/>
    ${face(0, -112, 'smile', skin)}`;
  const arms = arm === 'help' ? { left: [-18, -56], right: [46, -74] } : STAND_ARMS.down;
  const extra = `<rect x="-14" y="-55" width="28" height="5" fill="#5C4A32"/><rect x="-3" y="-55" width="6" height="5" fill="#8C7B57"/>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${MARPAT}
    ${standing({ skin, shirt: '#6E7B4E', shirtFill: 'url(#marpat)', pants: '#5F6B43', shoes: '#8B6B47', head, arms, extra })}</g>`;
}

// The captain, with one hand on the wheel at (wheel[0], wheel[1]) in the picture.
function captain({ x, y, s = 1, skin = '#C68B5E', wheel } = {}) {
  const head = `<circle cx="-15" cy="-116" r="3.4" fill="${skin}"/><circle cx="15" cy="-116" r="3.4" fill="${skin}"/>
    <circle class="noshade" cx="0" cy="-117" r="15" fill="${skin}"/>
    <path d="M-10 -108 Q 0 -100 10 -108 Q 6 -102 0 -101 Q -6 -102 -10 -108 Z" fill="#7F8C8D"/>
    ${captainHat(0, -142)}
    ${face(0, -116, 'big', skin)}`;
  const right = wheel ? [(wheel[0] - x) / s, (wheel[1] - y) / s] : [18, -56];
  const extra = `<rect x="-17" y="-100" width="10" height="5" rx="1.5" fill="#1F2A44"/><rect x="7" y="-100" width="10" height="5" rx="1.5" fill="#1F2A44"/>
    <path d="M-15 -97.5 h6 M9 -97.5 h6" stroke="#F1C40F" stroke-width="1.4"/><path d="M0 -98 V-52" stroke="#D5DBDE" stroke-width="1.2"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${standing({ skin, shirt: '#FFFFFF', pants: '#1F2A44', head, arms: { left: [-18, -56], right }, extra })}</g>`;
}
