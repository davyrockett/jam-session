// The picture library: single things drawn in a 100 × 100 box.
// Used by Cause & Effect (they pop up when you play) and the Song Builder (picture choices).
// Each one has a topic, a word for the song builder, and a written sound for Cause & Effect.
// Halloween things aren't in TOPICS (not offered in the Song Builder yet).

const OBJ_INK = '#2C3E50';
const o = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" stroke="${OBJ_INK}" stroke-width="2.5" stroke-linejoin="round" ${extra}/>`;
const dot = (x, y, r = 3, c = OBJ_INK) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const eye = (x, y, r = 4.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${OBJ_INK}" stroke-width="1.8"/>${dot(x + 0.8, y, r * 0.45)}`;
const wheel = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#333" stroke="${OBJ_INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="#BDC3C7"/>`;

const OBJECTS = {
  // ----- Ocean -----
  fish: { main: '#F39C12', topic: 'ocean', word: 'fish', sound: 'SPLASH!', draw: () =>
    o('M22 50 L4 34 L8 50 L4 66 Z', '#E67E22') +
    o('M18 50 Q 40 22 70 30 Q 92 38 94 50 Q 92 62 70 70 Q 40 78 18 50 Z', '#F39C12') +
    o('M44 32 Q 52 18 62 30', '#E67E22') +
    `<path d="M46 36 Q 40 50 46 64 M56 34 Q 50 50 56 66" stroke="#E67E22" stroke-width="4" fill="none"/>` + eye(76, 46) +
    `<path d="M86 56 Q 82 59 78 57" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>` },
  whale: { main: '#4A78B5', topic: 'ocean', word: 'whale', sound: 'WHOOSH!', draw: () =>
    `<path d="M62 26 Q 58 12 50 8 M62 26 Q 64 10 72 6 M62 26 Q 70 16 80 14" stroke="#5DADE2" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    o('M14 58 L2 42 L6 58 L2 74 Z', '#3D6FA8') +
    o('M10 60 Q 14 30 56 30 Q 92 32 94 60 Q 92 78 60 80 L30 80 Q 12 76 10 60 Z', '#4A78B5') +
    o('M30 80 Q 60 86 88 70 Q 80 66 60 70 Q 40 72 30 80 Z', '#BBD3EE') + eye(76, 54, 4) +
    `<path d="M82 64 Q 86 66 90 64" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>` },
  crab: { main: '#E74C3C', topic: 'ocean', word: 'crab', sound: 'SNAP!', draw: () =>
    `<path d="M24 64 L8 74 M26 70 L12 84 M76 64 L92 74 M74 70 L88 84" stroke="${OBJ_INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M40 44 L36 26 M60 44 L64 26" stroke="${OBJ_INK}" stroke-width="3"/>` + eye(36, 24, 5) + eye(64, 24, 5) +
    o('M20 52 Q 22 36 50 36 Q 78 36 80 52 Q 80 76 50 76 Q 20 76 20 52 Z', '#E74C3C') +
    o('M18 46 Q 4 40 8 26 Q 14 32 20 30 Q 14 22 20 16 Q 30 26 22 46 Z', '#E74C3C') +
    o('M82 46 Q 96 40 92 26 Q 86 32 80 30 Q 86 22 80 16 Q 70 26 78 46 Z', '#E74C3C') +
    `<path d="M42 58 Q 50 64 58 58" stroke="${OBJ_INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
  gull: { main: '#FEFEFE', topic: 'ocean', word: 'seagull', sound: 'SQUAWK!', draw: () =>
    o('M20 56 Q 30 40 56 44 Q 78 46 84 40 Q 88 56 70 64 Q 44 72 20 56 Z', '#FEFEFE') +
    o('M40 50 Q 50 18 74 10 Q 66 34 62 50 Z', '#BDC3C7') +
    o('M84 40 L98 44 L86 48 Z', '#F39C12') + dot(80, 38, 2.6) +
    o('M20 56 L6 52 L10 62 Z', '#BDC3C7') +
    `<path d="M50 66 L48 80 M58 66 L58 80" stroke="#F39C12" stroke-width="3"/>` },
  boat: { main: 'var(--boat, #E74C3C)', topic: 'ocean', word: 'boat', sound: 'TOOT TOOT!', draw: () =>
    `<path d="M50 14 L50 66" stroke="${OBJ_INK}" stroke-width="3"/>` +
    o('M52 16 L84 60 L52 60 Z', '#fff') + o('M48 24 L22 60 L48 60 Z', '#F7F3D0') +
    `<path d="M10 66 L90 66 L80 86 L20 86 Z" style="fill:var(--boat, #E74C3C)" stroke="${OBJ_INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M14 74 H86" stroke="#fff" stroke-width="4"/>` },
  starfish: { main: '#F39C12', topic: 'ocean', word: 'starfish', sound: 'TWINKLE!', draw: () => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 18 : 44;
      d += `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(54 + r * Math.sin(a)).toFixed(1)} `;
    }
    return o(d + 'Z', '#F39C12') + dot(50, 30, 2.5, '#fff') + dot(28, 50, 2.5, '#fff') + dot(72, 50, 2.5, '#fff') + dot(38, 74, 2.5, '#fff') + dot(62, 74, 2.5, '#fff') +
      dot(44, 50, 2.6) + dot(56, 50, 2.6) + `<path d="M44 58 Q 50 63 56 58" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>`;
  } },

  // ----- Animals -----
  dog: { main: '#C68642', topic: 'animals', word: 'dog', sound: 'WOOF!', draw: () =>
    `<path d="M18 52 Q 6 44 8 30" stroke="#A0522D" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    o('M16 50 Q 16 40 30 40 L58 40 Q 66 40 66 50 L66 70 L16 70 Z', '#C68642') +
    `<rect x="20" y="66" width="9" height="20" rx="4" fill="#C68642" stroke="${OBJ_INK}" stroke-width="2.5"/><rect x="50" y="66" width="9" height="20" rx="4" fill="#C68642" stroke="${OBJ_INK}" stroke-width="2.5"/>` +
    o('M56 30 Q 56 14 74 14 Q 92 14 92 32 Q 92 50 74 50 Q 56 50 56 30 Z', '#C68642') +
    o('M58 20 Q 48 22 50 42 Q 58 40 62 28 Z', '#7B4A1E') + o('M90 20 Q 98 26 96 40 Q 88 38 86 26 Z', '#7B4A1E') +
    dot(68, 28) + dot(80, 28) + `<ellipse cx="74" cy="38" rx="5" ry="3.5" fill="${OBJ_INK}"/>` +
    `<path d="M70 44 Q 74 48 78 44" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>` + o('M73 46 Q 74 54 78 52 Q 79 48 76 46 Z', '#E74C3C') },
  cat: { main: '#F39C12', topic: 'animals', word: 'cat', sound: 'MEOW!', draw: () =>
    `<path d="M74 78 Q 96 74 90 50" stroke="#E67E22" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    o('M28 88 Q 22 56 50 54 Q 78 56 72 88 Z', '#F39C12') +
    o('M24 22 L30 6 L42 18 Z', '#F39C12') + o('M76 22 L70 6 L58 18 Z', '#F39C12') +
    o('M22 36 Q 22 16 50 16 Q 78 16 78 36 Q 78 58 50 58 Q 22 58 22 36 Z', '#F39C12') +
    `<path d="M40 18 L42 26 M50 16 V26 M60 18 L58 26" stroke="#E67E22" stroke-width="3"/>` +
    eye(40, 36, 4.5) + eye(60, 36, 4.5) + o('M47 44 L53 44 L50 48 Z', '#E84393') +
    `<path d="M50 48 Q 46 53 42 50 M50 48 Q 54 53 58 50 M30 44 H14 M30 48 L16 52 M70 44 H86 M70 48 L84 52" stroke="${OBJ_INK}" stroke-width="1.8" fill="none"/>` },
  cow: { main: '#FEFEFE', topic: 'animals', word: 'cow', sound: 'MOO!', draw: () =>
    o('M26 20 Q 18 12 20 6 Q 26 12 32 16 Z', '#F7F3D0') + o('M74 20 Q 82 12 80 6 Q 74 12 68 16 Z', '#F7F3D0') +
    o('M14 30 Q 4 28 6 36 Q 14 40 22 36 Z', '#FEFEFE') + o('M86 30 Q 96 28 94 36 Q 86 40 78 36 Z', '#FEFEFE') +
    o('M22 34 Q 20 14 50 14 Q 80 14 78 34 L76 60 L24 60 Z', '#FEFEFE') +
    o('M28 22 Q 36 16 42 24 Q 38 34 28 30 Z', '#333') + o('M64 40 Q 74 36 76 46 Q 70 52 64 48 Z', '#333') +
    eye(38, 36) + eye(62, 36) +
    o('M24 62 Q 24 52 50 52 Q 76 52 76 62 Q 76 86 50 86 Q 24 86 24 62 Z', '#F5A3C7') +
    `<ellipse cx="40" cy="70" rx="4" ry="6" fill="#C0577F"/><ellipse cx="60" cy="70" rx="4" ry="6" fill="#C0577F"/>` },
  pig: { main: '#F8B9D4', topic: 'animals', word: 'pig', sound: 'OINK!', draw: () =>
    o('M22 24 L18 6 L36 16 Z', '#F5A3C7') + o('M78 24 L82 6 L64 16 Z', '#F5A3C7') +
    o('M12 50 Q 12 14 50 14 Q 88 14 88 50 Q 88 88 50 88 Q 12 88 12 50 Z', '#F8B9D4') +
    eye(36, 40) + eye(64, 40) +
    o('M34 60 Q 34 50 50 50 Q 66 50 66 60 Q 66 72 50 72 Q 34 72 34 60 Z', '#F5A3C7') +
    `<ellipse cx="44" cy="61" rx="3.5" ry="5" fill="#C0577F"/><ellipse cx="56" cy="61" rx="3.5" ry="5" fill="#C0577F"/>` +
    `<path d="M40 79 Q 50 84 60 79" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>` },
  duck: { main: '#F7D24A', topic: 'animals', word: 'duck', sound: 'QUACK!', draw: () =>
    o('M10 62 Q 10 44 30 44 L58 44 Q 52 30 56 22 Q 62 8 76 10 Q 92 14 88 32 Q 86 42 76 46 Q 90 52 88 66 Q 84 86 50 86 Q 14 86 10 62 Z', '#F7D24A') +
    o('M28 56 Q 44 50 58 62 Q 46 72 30 66 Z', '#E9B824') +
    o('M86 24 L100 28 L86 34 Z', '#F39C12') + eye(76, 22, 4) +
    `<path d="M40 86 L38 96 L46 96 M60 86 L60 96 L68 96" stroke="#F39C12" stroke-width="3.5" fill="none" stroke-linejoin="round"/>` },
  sheep: { main: '#FEFEFE', topic: 'animals', word: 'sheep', sound: 'BAA!', draw: () =>
    `<rect x="26" y="66" width="8" height="22" rx="3" fill="#333"/><rect x="62" y="66" width="8" height="22" rx="3" fill="#333"/>` +
    [[24, 46], [38, 34], [56, 34], [72, 44], [70, 62], [52, 70], [32, 66], [48, 52]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="15" fill="#FEFEFE" stroke="${OBJ_INK}" stroke-width="2.5"/>`).join('') +
    [[24, 46], [38, 34], [56, 34], [72, 44], [70, 62], [52, 70], [32, 66], [48, 52]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="13" fill="#FEFEFE"/>`).join('') +
    o('M74 30 Q 74 18 86 18 Q 98 18 96 34 Q 94 48 84 48 Q 74 46 74 30 Z', '#444') +
    `<circle cx="82" cy="30" r="2.5" fill="#fff"/><circle cx="92" cy="30" r="2.5" fill="#fff"/>` +
    o('M74 24 Q 64 22 66 30 Q 72 30 76 28 Z', '#444') },

  // ----- Vehicles -----
  car: { main: '#E74C3C', topic: 'vehicles', word: 'car', sound: 'BEEP BEEP!', draw: () =>
    o('M6 70 L6 56 Q 8 48 18 46 L28 30 Q 32 24 40 24 L64 24 Q 72 24 76 32 L84 46 Q 94 48 94 58 L94 70 Z', '#E74C3C') +
    o('M32 32 L40 28 L50 28 L50 46 L26 46 Z', '#D6EEFF') + o('M56 28 L64 28 Q 70 30 72 36 L76 46 L56 46 Z', '#D6EEFF') +
    `<rect x="86" y="52" width="8" height="6" rx="2" fill="#F7DC6F"/>` + wheel(26, 72, 11) + wheel(74, 72, 11) },
  bus: { main: '#F7C52B', topic: 'vehicles', word: 'bus', sound: 'HONK!', draw: () =>
    o('M4 20 Q 4 14 10 14 L90 14 Q 96 14 96 22 L96 74 L4 74 Z', '#F7C52B') +
    [10, 30, 50].map((x) => `<rect x="${x}" y="24" width="16" height="16" rx="2" fill="#D6EEFF" stroke="${OBJ_INK}" stroke-width="2"/>`).join('') +
    `<rect x="72" y="24" width="18" height="40" rx="2" fill="#D6EEFF" stroke="${OBJ_INK}" stroke-width="2"/><path d="M4 52 H70" stroke="${OBJ_INK}" stroke-width="2.5"/>` +
    wheel(22, 76, 10) + wheel(78, 76, 10) },
  firetruck: { main: '#D62B1F', topic: 'vehicles', word: 'fire truck', sound: 'WEE-OOO!', draw: () =>
    o('M4 34 L62 34 L62 72 L4 72 Z', '#D62B1F') + o('M62 40 L82 40 L94 56 L94 72 L62 72 Z', '#E74C3C') +
    o('M66 44 L80 44 L88 56 L66 56 Z', '#D6EEFF') +
    `<rect x="8" y="22" width="52" height="8" fill="#BDC3C7" stroke="${OBJ_INK}" stroke-width="2"/>` +
    [14, 24, 34, 44, 54].map((x) => `<path d="M${x} 22 V30" stroke="${OBJ_INK}" stroke-width="2"/>`).join('') +
    `<rect x="70" y="30" width="12" height="10" rx="3" fill="#3498DB" stroke="${OBJ_INK}" stroke-width="2"/>` +
    `<path d="M8 50 H58" stroke="#F7DC6F" stroke-width="4"/>` + wheel(20, 74, 10) + wheel(78, 74, 10) },
  train: { main: '#27AE60', topic: 'vehicles', word: 'train', sound: 'CHOO CHOO!', draw: () =>
    `<circle cx="30" cy="12" r="6" fill="#ECF0F1"/><circle cx="22" cy="4" r="5" fill="#ECF0F1"/>` +
    o('M24 20 L36 20 L34 40 L26 40 Z', '#333') +
    o('M10 40 L64 40 L64 74 L10 74 Z', '#27AE60') + o('M56 18 L92 18 L92 74 L56 74 Z', '#1E8449') +
    `<rect x="64" y="26" width="20" height="18" rx="2" fill="#D6EEFF" stroke="${OBJ_INK}" stroke-width="2"/>` +
    o('M2 74 L10 62 L10 74 Z', '#E74C3C') + `<rect x="54" y="12" width="42" height="8" rx="2" fill="#E74C3C" stroke="${OBJ_INK}" stroke-width="2"/>` +
    wheel(22, 78, 9) + wheel(46, 78, 9) + wheel(76, 76, 12) },
  plane: { main: '#2E86DE', topic: 'vehicles', word: 'airplane', sound: 'ZOOM!', draw: () =>
    o('M40 50 L58 22 L68 22 L60 50 Z', '#2E86DE') + o('M40 60 L58 86 L68 86 L60 60 Z', '#2E86DE') +
    o('M4 48 Q 4 40 14 40 L82 40 Q 98 42 98 54 Q 98 66 82 68 L14 68 Q 4 68 4 58 Z', '#fff') +
    o('M6 42 L2 24 L14 24 L22 42 Z', '#2E86DE') +
    [30, 42, 54, 66].map((x) => `<circle cx="${x}" cy="52" r="4" fill="#5DADE2" stroke="${OBJ_INK}" stroke-width="1.5"/>`).join('') +
    o('M84 46 Q 92 46 94 52 L84 52 Z', '#D6EEFF') },

  // ----- Food & parties -----
  pizza: { main: '#F7DC6F', topic: 'food', word: 'pizza', sound: 'YUM!', draw: () =>
    o('M50 92 L12 18 Q 50 4 88 18 Z', '#F7DC6F') + o('M12 18 Q 50 4 88 18 L84 28 Q 50 14 16 28 Z', '#D68910') +
    dot(44, 40, 7, '#C0392B') + dot(62, 38, 6, '#C0392B') + dot(52, 62, 6.5, '#C0392B') + dot(36, 34, 0) +
    `<path d="M40 54 l4 -4 M60 54 l3 3 M48 30 l4 2" stroke="#27AE60" stroke-width="3" stroke-linecap="round"/>` },
  cake: { main: '#F5A3C7', topic: 'food', word: 'cake', sound: 'HOORAY!', draw: () =>
    [30, 50, 70].map((x) => `<rect x="${x - 2.5}" y="10" width="5" height="18" rx="2" fill="#5DADE2" stroke="${OBJ_INK}" stroke-width="1.5"/>` +
      `<path d="M${x} 2 Q ${x + 5} 8 ${x} 11 Q ${x - 5} 8 ${x} 2 Z" fill="#F39C12"/>`).join('') +
    o('M12 28 L88 28 L88 56 L12 56 Z', '#F5A3C7') + o('M8 56 L92 56 L92 88 L8 88 Z', '#8E5A3C') +
    o('M12 28 L88 28 L88 36 Q 80 44 72 36 Q 64 44 56 36 Q 48 44 40 36 Q 32 44 24 36 Q 18 42 12 36 Z', '#fff') +
    `<path d="M8 72 H92" stroke="#F5A3C7" stroke-width="4"/>` },
  icecream: { main: '#F5A3C7', topic: 'food', word: 'ice cream', sound: 'YUM!', draw: () =>
    o('M30 52 L50 96 L70 52 Z', '#E0A458') +
    `<path d="M36 60 L60 60 M40 70 L58 70 M34 54 L56 84 M66 54 L46 86" stroke="#B9783A" stroke-width="2"/>` +
    o('M26 52 Q 22 34 40 32 Q 52 30 60 36 Q 78 32 76 52 Z', '#F5A3C7') +
    o('M34 34 Q 30 12 50 10 Q 70 12 66 34 Q 50 40 34 34 Z', '#FFF5D6') + dot(50, 6, 6, '#E74C3C') },
  apple: { main: '#E74C3C', topic: 'food', word: 'apple', sound: 'CRUNCH!', draw: () =>
    `<path d="M50 30 Q 50 16 56 8" stroke="#7B4A1E" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    o('M54 18 Q 70 6 80 16 Q 68 26 54 18 Z', '#27AE60') +
    o('M50 30 Q 70 18 84 34 Q 96 56 80 80 Q 66 98 50 88 Q 34 98 20 80 Q 4 56 16 34 Q 30 18 50 30 Z', '#E74C3C') +
    `<path d="M28 42 Q 24 52 26 60" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>` },
  burger: { main: '#E0A458', topic: 'food', word: 'burger', sound: 'YUM!', draw: () =>
    o('M10 44 Q 12 12 50 12 Q 88 12 90 44 Z', '#E0A458') +
    dot(36, 26, 2, '#fff') + dot(50, 20, 2, '#fff') + dot(64, 28, 2, '#fff') + dot(44, 34, 2, '#fff') +
    o('M8 46 Q 20 40 30 48 Q 40 40 50 48 Q 60 40 70 48 Q 80 40 92 46 L90 52 L10 52 Z', '#27AE60') +
    o('M10 52 L90 52 L86 60 L14 60 Z', '#F1C40F') +
    o('M8 60 L92 60 Q 92 70 84 70 L16 70 Q 8 70 8 60 Z', '#7B4A1E') +
    o('M10 72 L90 72 Q 88 88 50 88 Q 12 88 10 72 Z', '#E0A458') },
  balloon: { main: '#E84393', topic: 'food', word: 'balloon', sound: 'POP!', draw: () =>
    `<path d="M50 72 Q 44 82 52 90 Q 58 96 50 100" stroke="${OBJ_INK}" stroke-width="2" fill="none"/>` +
    o('M50 72 Q 18 62 20 34 Q 22 6 50 6 Q 78 6 80 34 Q 82 62 50 72 Z', '#E84393') +
    o('M46 72 L54 72 L52 78 L48 78 Z', '#E84393') +
    `<path d="M34 24 Q 36 16 44 14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>` },

  // ----- Halloween (friendly, never scary) -----
  pumpkin: { main: '#F57C14', topic: 'halloween', word: 'pumpkin', sound: 'HEE HEE!', draw: () =>
    o('M46 24 Q 46 12 54 6 L59 10 Q 53 15 54 24 Z', '#4E8C3A') +
    o('M50 24 Q 84 16 91 52 Q 93 88 50 89 Q 7 88 9 52 Q 16 16 50 24 Z', '#F57C14') +
    `<path d="M36 24 Q 22 56 36 87 M64 24 Q 78 56 64 87" stroke="#C85A0C" stroke-width="2.5" fill="none"/>` +
    o('M27 50 L35 36 L43 50 Z', '#FFD34D') + o('M57 50 L65 36 L73 50 Z', '#FFD34D') + o('M46 59 L50 53 L54 59 Z', '#FFD34D') +
    o('M24 63 Q 50 88 76 63 Q 68 68 62 66 L58 72 L54 67 L46 67 L42 72 L38 66 Q 32 68 24 63 Z', '#FFD34D') },
  ghost: { main: '#FDFDFD', topic: 'halloween', word: 'ghost', sound: 'BOO!', draw: () =>
    o('M24 54 Q 8 54 6 40 Q 15 45 24 44 Z', '#FDFDFD') + o('M76 54 Q 92 54 94 40 Q 85 45 76 44 Z', '#FDFDFD') +
    o('M22 90 L22 44 Q 22 8 50 8 Q 78 8 78 44 L78 90 Q 71 82 64 90 Q 57 82 50 90 Q 43 82 36 90 Q 29 82 22 90 Z', '#FDFDFD') +
    dot(40, 40, 5) + dot(60, 40, 5) + dot(41.5, 38.5, 1.6, '#fff') + dot(61.5, 38.5, 1.6, '#fff') +
    `<circle cx="32" cy="50" r="4" fill="#F8B9D4"/><circle cx="68" cy="50" r="4" fill="#F8B9D4"/>` +
    o('M42 53 Q 50 68 58 53 Z', OBJ_INK) + `<path d="M46 60 Q 50 66 54 60 Q 50 57 46 60 Z" fill="#E84393"/>` },
  // The wings sit in .flapL / .flapR so Cause & Effect can flap them (styles.css).
  bat: { main: '#8B5A44', topic: 'halloween', word: 'bat', sound: 'FLAP FLAP!', draw: () =>
    `<g class="flapL">${o('M40 46 Q 24 28 3 34 Q 10 43 7 54 Q 16 50 20 59 Q 26 52 32 61 Q 36 54 41 56 Z', '#6B4535')}</g>` +
    `<g class="flapR">${o('M60 46 Q 76 28 97 34 Q 90 43 93 54 Q 84 50 80 59 Q 74 52 68 61 Q 64 54 59 56 Z', '#6B4535')}</g>` +
    o('M40 40 L38 22 L48 33 Z', '#8B5A44') + o('M60 40 L62 22 L52 33 Z', '#8B5A44') +
    o('M37 50 Q 37 32 50 32 Q 63 32 63 50 Q 63 72 50 74 Q 37 72 37 50 Z', '#8B5A44') +
    eye(45, 45, 4) + eye(55, 45, 4) +
    `<path d="M45 52 Q 50 56 55 52" stroke="${OBJ_INK}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M47 53.5 L48 57 L49.5 54 M50.5 54 L52 57 L53 53.5" fill="#fff" stroke="${OBJ_INK}" stroke-width="1"/>` },
  // Hangs from its thread: Cause & Effect adds the thread above it.
  spider: { main: '#8E7CD6', topic: 'halloween', word: 'spider', sound: 'BOING!', draw: () =>
    `<path d="M37 50 Q 20 36 11 48 M35 57 Q 15 52 7 66 M37 64 Q 20 70 14 85 M41 70 Q 31 82 29 95
      M63 50 Q 80 36 89 48 M65 57 Q 85 52 93 66 M63 64 Q 80 70 86 85 M59 70 Q 69 82 71 95" stroke="#B9A8EE" stroke-width="4.5" fill="none" stroke-linecap="round"/>` +
    o('M50 18 Q 72 18 72 40 Q 72 58 50 58 Q 28 58 28 40 Q 28 18 50 18 Z', '#8E7CD6') +
    `<path d="M40 28 Q 44 24 50 24" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".6"/>` +
    o('M50 52 Q 65 52 65 67 Q 65 82 50 82 Q 35 82 35 67 Q 35 52 50 52 Z', '#A796E6') +
    eye(44, 64, 5) + eye(56, 64, 5) +
    `<path d="M44 73 Q 50 78 56 73" stroke="${OBJ_INK}" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  blackcat: { main: '#58516F', topic: 'halloween', word: 'black cat', sound: 'MEOW!', draw: () =>
    `<path d="M72 80 Q 96 78 92 54 Q 90 44 82 46" stroke="#58516F" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    o('M28 88 Q 22 56 50 54 Q 78 56 72 88 Z', '#58516F') +
    o('M24 22 L30 6 L42 18 Z', '#58516F') + o('M76 22 L70 6 L58 18 Z', '#58516F') +
    o('M28 18 L31 11 L36 17 Z', '#F8B9D4') + o('M72 18 L69 11 L64 17 Z', '#F8B9D4') +
    o('M22 36 Q 22 16 50 16 Q 78 16 78 36 Q 78 58 50 58 Q 22 58 22 36 Z', '#58516F') +
    `<ellipse cx="39" cy="35" rx="6" ry="6.5" fill="#C8E64A" stroke="${OBJ_INK}" stroke-width="1.8"/><ellipse cx="61" cy="35" rx="6" ry="6.5" fill="#C8E64A" stroke="${OBJ_INK}" stroke-width="1.8"/>` +
    `<ellipse cx="39" cy="35" rx="1.8" ry="5" fill="${OBJ_INK}"/><ellipse cx="61" cy="35" rx="1.8" ry="5" fill="${OBJ_INK}"/>` +
    o('M47 44 L53 44 L50 48 Z', '#F8B9D4') +
    `<path d="M50 48 Q 46 53 42 50 M50 48 Q 54 53 58 50" stroke="${OBJ_INK}" stroke-width="1.8" fill="none"/>` +
    `<path d="M30 44 H14 M30 48 L16 52 M70 44 H86 M70 48 L84 52" stroke="#D9D4EA" stroke-width="1.8" fill="none"/>` },
  candy: { main: '#F57C14', topic: 'halloween', word: 'candy', sound: 'TREAT!', draw: () =>
    o('M30 50 L8 34 Q 13 50 8 66 Z', '#8E44AD') + o('M70 50 L92 34 Q 87 50 92 66 Z', '#8E44AD') +
    o('M28 50 Q 28 32 50 32 Q 72 32 72 50 Q 72 68 50 68 Q 28 68 28 50 Z', '#F57C14') +
    `<path d="M39 35 Q 33 50 40 65 M51 33 Q 45 50 52 67 M63 36 Q 58 50 64 63" stroke="#FFD34D" stroke-width="5" fill="none" stroke-linecap="round"/>` },

  // Surprises behind the Halloween house's door (Cause & Effect, every third hit).
  monster: { main: '#5DBB63', topic: 'halloween', word: 'monster', sound: 'TRICK OR TREAT!', draw: () =>
    o('M30 26 Q 22 10 30 3 Q 34 16 41 21 Z', '#F7D24A') + o('M70 26 Q 78 10 70 3 Q 66 16 59 21 Z', '#F7D24A') +
    o('M22 58 Q 6 48 8 26 Q 14 22 17 29 Q 17 44 27 50 Z', '#5DBB63') + o('M78 58 Q 94 48 92 26 Q 86 22 83 29 Q 83 44 73 50 Z', '#5DBB63') +
    o('M24 92 Q 15 60 22 40 Q 30 17 50 17 Q 70 17 78 40 Q 85 60 76 92 Z', '#5DBB63') +
    o('M26 93 Q 26 84 36 84 Q 45 84 45 93 Z', '#3F8F45') + o('M55 93 Q 55 84 64 84 Q 74 84 74 93 Z', '#3F8F45') +
    `<ellipse cx="50" cy="72" rx="15" ry="11" fill="#A6E3A1"/>` +
    `<circle cx="50" cy="34" r="10" fill="#fff" stroke="${OBJ_INK}" stroke-width="2"/>${dot(51, 35, 4.5)}<circle cx="53" cy="32" r="1.6" fill="#fff"/>` +
    o('M34 48 Q 50 64 66 48 Z', OBJ_INK) + o('M40 49.5 L43 55 L46 51 Z', '#fff') + o('M54 51 L57 55 L60 49.5 Z', '#fff') },
  bucket: { main: '#F57C14', topic: 'halloween', word: 'candy bucket', sound: 'TRICK OR TREAT!', draw: () =>
    `<path d="M19 46 Q 50 -4 81 46" stroke="${OBJ_INK}" stroke-width="3" fill="none"/>` +
    o('M24 44 Q 22 30 34 32 Q 38 26 46 30 L44 46 Z', '#E84393') + o('M44 44 Q 46 26 58 30 Q 66 26 70 36 L66 46 Z', '#3498DB') +
    o('M62 44 Q 62 32 72 34 Q 80 34 78 46 Z', '#F1C40F') + o('M32 30 L36 22 L40 30 Z', '#8E44AD') +
    o('M16 42 L84 42 Q 88 90 50 91 Q 12 90 16 42 Z', '#F57C14') +
    o('M16 42 L84 42 L84 48 L16 48 Z', '#E06A0A') +
    o('M30 60 L37 52 L44 60 Z', OBJ_INK) + o('M56 60 L63 52 L70 60 Z', OBJ_INK) +
    o('M30 68 Q 50 86 70 68 Q 62 72 57 71 L54 76 L50 72 L46 76 L43 71 Q 38 72 30 68 Z', OBJ_INK) },
  furball: { main: '#9B59B6', topic: 'halloween', word: 'fuzzy monster', sound: 'TRICK OR TREAT!', draw: () => {
    let fur = '';
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2, r = i % 2 ? 33 : 38;
      fur += `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(52 + r * Math.sin(a) * 0.95).toFixed(1)} `;
    }
    return o('M18 58 Q 4 50 6 32 Q 12 28 15 34 Q 15 46 24 52 Z', '#9B59B6') + o('M82 58 Q 96 50 94 32 Q 88 28 85 34 Q 85 46 76 52 Z', '#9B59B6') +
      o('M30 86 Q 30 98 40 98 Q 46 98 46 88 Z', '#F57C14') + o('M70 86 Q 70 98 60 98 Q 54 98 54 88 Z', '#F57C14') +
      o(`${fur}Z`, '#9B59B6') + eye(39, 42, 8) + eye(61, 42, 8) +
      o('M34 58 Q 50 78 66 58 Z', OBJ_INK) + `<path d="M43 67 Q 50 75 57 67 Q 50 63 43 67 Z" fill="#E84393"/>`;
  } },
};

const TOPICS = {
  ocean: { name: 'Ocean' },
  animals: { name: 'Animals' },
  vehicles: { name: 'Vehicles' },
  food: { name: 'Food & parties' },
};

// The drawing, optionally recoloured: the thing's main colour is swapped for tint.
function objDraw(name, tint) {
  const ob = OBJECTS[name], svg = ob.draw();
  return tint ? svg.split(ob.main).join(tint) : svg;
}
function objSvg(name, attrs = '', tint) {
  return `<svg data-sketch viewBox="-4 -4 108 108" ${attrs}>${objDraw(name, tint)}</svg>`;
}
function objectsIn(topic) { return Object.keys(OBJECTS).filter((k) => OBJECTS[k].topic === topic); }
