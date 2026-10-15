// Sketch style: turns the app's drawings into hand-drawn ones with Rough.js
// (vendor/rough.js, MIT licence). Any <svg data-sketch> that appears on screen is
// redrawn: outlines get a wobbly double pen line, bigger coloured shapes get light
// pencil shading, big backgrounds stay flat. Tiny details (eyes, mouths)
// stay crisp so faces read clearly. A paper grain is added in styles.css.

const Sketch = (() => {
  const cache = new Map();   // original drawing → sketched drawing, so pages turn quickly
  const SVGNS = 'http://www.w3.org/2000/svg';

  const shade = (rgb, k) => {
    const m = rgb.match(/\d+(\.\d+)?/g);
    if (!m) return rgb;
    const [r, g, b] = m.map(Number);
    return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
  };
  const isNone = (c) => !c || c === 'none' || c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);

  // The outline of any shape as path data, so Rough.js can redraw it.
  function pathOf(el) {
    const n = (a) => parseFloat(el.getAttribute(a)) || 0;
    switch (el.tagName) {
      case 'path': return el.getAttribute('d');
      case 'circle': { const cx = n('cx'), cy = n('cy'), r = n('r');
        return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`; }
      case 'ellipse': { const cx = n('cx'), cy = n('cy'), rx = n('rx'), ry = n('ry');
        return `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`; }
      case 'rect': { const x = n('x'), y = n('y'), w = n('width'), h = n('height');
        const r = Math.min(n('rx') || n('ry'), w / 2, h / 2);
        if (!r) return `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
        return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h}`
          + ` H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`; }
    }
    return null;
  }

  function sketchify(svg) {
    if (svg.dataset.sketched || typeof rough === 'undefined') return;
    svg.dataset.sketched = '1';
    const key = svg.getAttribute('viewBox') + svg.innerHTML;
    if (cache.has(key)) { svg.innerHTML = cache.get(key); return; }

    const vb = svg.viewBox.baseVal;
    const VW = (vb && vb.width) || 400;
    const tiny = VW >= 300 ? 10 : 7;
    const rc = rough.svg(svg);
    svg.classList.add('sk-measure');          // measure without animations moving things
    const root = svg.getCTM();
    const rootK = root ? Math.hypot(root.a, root.b) : 1;
    const shapes = [...svg.querySelectorAll('path, rect, circle, ellipse')]
      .filter((el) => !el.closest('defs, pattern, clipPath, mask, text'));

    shapes.forEach((el, i) => {
      const cs = getComputedStyle(el);
      const fill = cs.fill, stroke = cs.stroke;
      if (/^url\(/.test(fill) || el.getAttribute('stroke-dasharray') || cs.strokeDasharray !== 'none') return;
      let box;
      try { box = el.getBBox(); } catch { return; }
      const ctm = el.getCTM();
      const k = ctm ? Math.hypot(ctm.a, ctm.b) / rootK : 1;
      const w = box.width * k, h = box.height * k, size = Math.max(w, h);
      if (size < tiny) return;
      const d = pathOf(el);
      if (!d) return;
      const hasFill = !isNone(fill), sw = parseFloat(cs.strokeWidth) || 0;
      // Boats use the colour picked on the cover (a CSS variable): keep it live, don't bake it in.
      const liveFill = (el.getAttribute('style') || '').match(/fill:\s*(var\([^;]+\))/);
      const liveStroke = (el.getAttribute('style') || '').match(/stroke:\s*(var\([^;]+\))/);
      const hasStroke = !isNone(stroke) && sw > 0;
      const opacity = el.getAttribute('opacity');
      const seed = i + 7;
      const add = (node) => {
        if (el.hasAttribute('transform')) node.setAttribute('transform', el.getAttribute('transform'));
        if (opacity) node.setAttribute('opacity', opacity);
        el.parentNode.insertBefore(node, el);
        return node;
      };

      // Big backgrounds (sky, sea, deck) stay flat and plain.
      if (w >= VW * 0.9) return;

      const thick = sw >= 5;
      const opts = {
        seed, roughness: size > VW * 0.25 ? 1.1 : 0.85, bowing: 0.9, preserveVertices: true,
        stroke: hasStroke ? stroke : 'none', strokeWidth: hasStroke ? Math.max(0.8, sw * (thick ? 0.95 : 0.85)) : 0,
        disableMultiStroke: thick, fill: hasFill ? fill : undefined, fillStyle: 'solid',
      };
      const g = add(rc.path(d, opts));
      g.querySelectorAll('path').forEach((p) => {
        p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
        if (liveFill && p.getAttribute('fill') && p.getAttribute('fill') !== 'none') p.style.fill = liveFill[1];
        if (liveStroke && p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none') p.style.stroke = liveStroke[1];
      });
      // Light pencil shading, only on the bigger coloured shapes (David: use it sparingly).
      if (hasFill && size >= VW * 0.12 && !el.classList.contains('noshade')) {
        const s = add(rc.path(d, { seed: seed + 1, stroke: 'none', fill: liveFill ? 'rgb(0,0,0)' : shade(fill, 0.8), fillStyle: 'hachure',
          hachureGap: Math.max(VW / 50, size / 5), fillWeight: VW / 450, hachureAngle: -41, roughness: 1 }));
        s.setAttribute('opacity', String((liveFill ? 0.1 : 0.22) * (parseFloat(opacity) || 1)));
      }
      el.remove();
    });

    svg.classList.remove('sk-measure');
    cache.set(key, svg.innerHTML);
    if (cache.size > 200) cache.delete(cache.keys().next().value);
  }

  function sweep(root = document) {
    root.querySelectorAll('svg[data-sketch]:not([data-sketched])').forEach(sketchify);
  }

  // Runs right after new drawings are added, before the screen repaints, so the plain
  // version never flashes up.
  const observer = new MutationObserver(() => { if (Sketch.on) sweep(); });

  return {
    on: true,
    sketchify,
    sweep,
    start() { observer.observe(document.body, { childList: true, subtree: true }); sweep(); },
  };
})();
