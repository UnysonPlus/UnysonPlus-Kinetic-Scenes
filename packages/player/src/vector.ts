import type { DiagramLayer, DiagramNode, FlowLayer, PathLayer } from './types';

/**
 * Lines, flow lines and diagrams. Their geometry depends on where things are on screen (a line's drawn
 * length, the two layers a flow joins, a diagram's nodes), so they are drawn AFTER every timeline update,
 * from the timeline's time and the state presets left (how far a line is drawn): every frame is still a
 * pure function of time, whether it was reached by playing or by seeking.
 */

const SVG = 'http://www.w3.org/2000/svg';
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const backOut = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; };
const cubicOut = (t: number) => 1 - (1 - t) ** 3;
const alpha = (c: string, a: number) => `color-mix(in srgb, ${c} ${(clamp01(a) * 100).toFixed(1)}%, transparent)`;
const svgEl = <K extends keyof SVGElementTagNameMap>(doc: Document, tag: K) => doc.createElementNS(SVG, tag) as SVGElementTagNameMap[K];

/** How far each line is drawn (0 to 1), as left by the Draw preset; a line with no Draw clip is whole. */
export const drawState = new WeakMap<HTMLElement, number>();
/** The layer each line or flow element draws (for Follow path, which only has the element). */
export const vectorLayer = new WeakMap<HTMLElement, PathLayer | FlowLayer>();

/** The canvas width in px: stage units (1 = 1% of it) are converted with it. */
const unitPx = (el: Element) => ((el.closest('.upw-canvas') as HTMLElement | null)?.clientWidth || 1000) / 100;

let uid = 0;
const uidOf = (el: HTMLElement) => (el.dataset.upwVid ??= String(++uid));

/* ------------------------------------------------------------------ geometry */

export interface Lut { pts: Array<[number, number]>; len: number[]; total: number }

/** Samples a path into points and running lengths, in whatever units `map` turns its points into. */
export function sampleLut(path: SVGGeometryElement, map: (x: number, y: number) => [number, number], n = 160): Lut {
  let total = 0;
  try { total = path.getTotalLength(); } catch { total = 0; }
  const pts: Array<[number, number]> = [];
  const len: number[] = [];
  let acc = 0;
  for (let i = 0; i <= n; i++) {
    let p = { x: 0, y: 0 };
    try { p = path.getPointAtLength((total * i) / n); } catch { /* not rendered */ }
    const q = map(p.x, p.y);
    if (i > 0) acc += Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]);
    pts.push(q);
    len.push(acc);
  }
  return { pts, len, total: acc };
}

/** The point and direction (degrees) at a fraction of a sampled path's length. */
export function lutAt(l: Lut, f: number): { x: number; y: number; angle: number } {
  const target = clamp01(f) * l.total;
  let i = 1;
  while (i < l.len.length - 1 && l.len[i] < target) i++;
  const a = l.pts[i - 1], b = l.pts[i];
  const seg = l.len[i] - l.len[i - 1] || 1;
  const k = clamp01((target - l.len[i - 1]) / seg);
  return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
}

/** The points of a sampled path between two fractions of its length, as an SVG polyline. */
export function lutSlice(l: Lut, f0: number, f1: number): string {
  const a = clamp01(Math.min(f0, f1)), b = clamp01(Math.max(f0, f1));
  const out: string[] = [];
  const p0 = lutAt(l, a);
  out.push(`${p0.x.toFixed(1)},${p0.y.toFixed(1)}`);
  for (let i = 0; i < l.pts.length; i++) {
    const f = l.total ? l.len[i] / l.total : 0;
    if (f > a && f < b) out.push(`${l.pts[i][0].toFixed(1)},${l.pts[i][1].toFixed(1)}`);
  }
  const p1 = lutAt(l, b);
  out.push(`${p1.x.toFixed(1)},${p1.y.toFixed(1)}`);
  return out.join(' ');
}

/** A dash pattern that draws a dashed (or solid) line up to `drawn` px of its `total` length. */
function dashTo(total: number, drawn: number, dash: number, gap: number): string {
  if (drawn >= total - 0.01 && !dash) return 'none';
  if (!dash) return `${drawn.toFixed(2)} ${(total + 1).toFixed(2)}`;
  const parts: number[] = [];
  let at = 0;
  while (at < drawn && parts.length < 4000) {
    const d = Math.min(dash, drawn - at);
    parts.push(d);
    at += d;
    if (at >= drawn) break;
    const g = Math.min(gap, drawn - at);
    parts.push(g);
    at += g;
  }
  if (parts.length % 2 === 0) parts.push(0);
  parts.push(total + 1);
  return parts.map((v) => v.toFixed(2)).join(' ');
}

/* ------------------------------------------------------------------ lines */

interface PathParts { svg: SVGSVGElement; glow?: SVGPathElement; main: SVGPathElement; over: SVGSVGElement; heads: SVGPathElement[]; lut?: Lut; key?: string }
const pathParts = new WeakMap<HTMLElement, PathParts>();

export function buildPath(doc: Document, inner: HTMLElement, layer: PathLayer) {
  inner.textContent = '';
  inner.style.position = 'relative';
  const svg = svgEl(doc, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('class', 'upw-vec');
  const stroke = layer.stroke ?? '#ffffff';
  const sw = layer.strokeWidth ?? 0.3;
  const style = (p: SVGPathElement, width: number) => {
    p.setAttribute('d', layer.d);
    p.setAttribute('vector-effect', 'non-scaling-stroke');
    Object.assign(p.style, { fill: 'none', stroke, strokeWidth: `${width}cqw`, strokeLinecap: 'round', strokeLinejoin: 'round' });
  };
  let glow: SVGPathElement | undefined;
  if (layer.glow && layer.glow > 0) {
    glow = svgEl(doc, 'path');
    style(glow, sw + layer.glow * 1.2);
    glow.style.opacity = '0.45';
    glow.style.filter = `blur(${(layer.glow * 0.45).toFixed(3)}cqw)`;
    svg.appendChild(glow);
  }
  const main = svgEl(doc, 'path');
  style(main, sw);
  if (layer.fill) main.style.fill = layer.fill;
  svg.appendChild(main);
  // A second drawing surface in plain pixels, for what must not stretch with the box (arrowheads, trails).
  const over = svgEl(doc, 'svg');
  over.setAttribute('class', 'upw-vec upw-vec-px');
  const heads: SVGPathElement[] = [];
  const n = layer.arrow === 'both' ? 2 : layer.arrow ? 1 : 0;
  for (let i = 0; i < n; i++) {
    const h = svgEl(doc, 'path');
    h.style.fill = stroke;
    over.appendChild(h);
    heads.push(h);
  }
  inner.append(svg, over);
  pathParts.set(inner, { svg, glow, main, over, heads });
  vectorLayer.set(inner, layer);
}

/** The line's points in the layer's own pixels (sampled once per size and shape). */
export function pathLut(inner: HTMLElement): Lut | null {
  const parts = pathParts.get(inner);
  if (!parts) return null;
  const W = inner.clientWidth, H = inner.clientHeight;
  const key = `${W}x${H}|${parts.main.getAttribute('d')}`;
  if (parts.lut && parts.key === key) return parts.lut;
  parts.lut = sampleLut(parts.main, (x, y) => [(x / 100) * W, (y / 100) * H]);
  parts.key = key;
  return parts.lut;
}

/** The surface trails and other px drawings go on, for a line layer. */
export const pathOverlay = (inner: HTMLElement) => pathParts.get(inner)?.over ?? null;

export function drawPath(inner: HTMLElement, layer: PathLayer) {
  const parts = pathParts.get(inner);
  if (!parts) return;
  const lut = pathLut(inner);
  if (!lut) return;
  const v = drawState.get(inner) ?? 1;
  const u = unitPx(inner);
  const dash = layer.dash ? layer.dash * u : 0;
  const gap = layer.dash ? (layer.dashGap ?? layer.dash * 0.8) * u : 0;
  // A stroke that doesn't scale with the box is dashed in screen pixels, which is what lut measures.
  const pattern = dashTo(lut.total, lut.total * v, dash, gap);
  for (const p of [parts.main, parts.glow]) {
    if (!p) continue;
    p.style.strokeDasharray = pattern;
    p.style.visibility = v <= 0 ? 'hidden' : '';
  }
  if (layer.fill) parts.main.style.fillOpacity = v >= 1 ? '1' : '0';
  const size = Math.max(6, (layer.strokeWidth ?? 0.3) * u * 4.2);
  parts.heads.forEach((h, i) => {
    const atStart = layer.arrow === 'start' || (layer.arrow === 'both' && i === 1);
    if (v <= 0.02 || (atStart && v <= 0)) { h.setAttribute('d', ''); return; }
    const p = atStart ? lutAt(lut, 0) : lutAt(lut, v);
    const ang = ((atStart ? lutAt(lut, 0.01).angle + 180 : p.angle) * Math.PI) / 180;
    const tip = [p.x, p.y];
    const back = [tip[0] - Math.cos(ang) * size, tip[1] - Math.sin(ang) * size];
    const nx = -Math.sin(ang) * size * 0.55, ny = Math.cos(ang) * size * 0.55;
    h.setAttribute('d', `M ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L ${(back[0] + nx).toFixed(1)} ${(back[1] + ny).toFixed(1)} L ${(back[0] - nx).toFixed(1)} ${(back[1] - ny).toFixed(1)} Z`);
  });
}

/* ------------------------------------------------------------------ flow lines */

interface FlowParts { svg: SVGSVGElement; grad: SVGLinearGradientElement; halos: SVGGElement; cores: SVGGElement; pulses: SVGGElement; id: string; scratch?: SVGPathElement; last?: string[] }
const flowParts = new WeakMap<HTMLElement, FlowParts>();

export function buildFlow(doc: Document, inner: HTMLElement, layer: FlowLayer) {
  inner.textContent = '';
  const svg = svgEl(doc, 'svg');
  svg.setAttribute('class', 'upw-vec upw-vec-px');
  const defs = svgEl(doc, 'defs');
  const grad = svgEl(doc, 'linearGradient');
  const id = `upw-fg-${uidOf(inner)}`;
  grad.setAttribute('id', id);
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  const colors = layer.colors?.length ? layer.colors : ['#3b82f6', '#a855f7', '#f97316'];
  colors.forEach((c, i) => {
    const s = svgEl(doc, 'stop');
    s.setAttribute('offset', `${colors.length > 1 ? (i / (colors.length - 1)) * 100 : 0}%`);
    s.setAttribute('stop-color', c);
    grad.appendChild(s);
  });
  defs.appendChild(grad);
  const halos = svgEl(doc, 'g');
  const cores = svgEl(doc, 'g');
  const pulses = svgEl(doc, 'g');
  svg.append(defs, halos, cores, pulses);
  inner.appendChild(svg);
  flowParts.set(inner, { svg, grad, halos, cores, pulses, id });
  vectorLayer.set(inner, layer);
}

/** The flow's svg (Follow path draws trails on it). */
export const flowSurface = (inner: HTMLElement) => flowParts.get(inner)?.svg ?? null;

/** One flow line, sampled, as drawn this frame (lines are counted from 0). */
export function flowLineLut(inner: HTMLElement, index: number): Lut | null {
  const parts = flowParts.get(inner);
  const d = parts?.last?.[Math.max(0, Math.min((parts.last?.length ?? 1) - 1, index))];
  if (!parts || !d) return null;
  if (!parts.scratch) {
    parts.scratch = svgEl(inner.ownerDocument, 'path');
    parts.scratch.style.visibility = 'hidden';
    parts.svg.appendChild(parts.scratch);
  }
  parts.scratch.setAttribute('d', d);
  return sampleLut(parts.scratch, (x, y) => [x, y], 120);
}

type Side = 'left' | 'right' | 'top' | 'bottom';

/** The curves of a flow layer, in the flow's own pixels (also used by Follow path to ride a line). */
export function flowCurves(inner: HTMLElement, layer: FlowLayer, time: number): Array<{ d: string; s: [number, number]; e: [number, number] }> | null {
  const parts = flowParts.get(inner);
  const stage = inner.closest('.upw-stage');
  if (!parts || !stage) return null;
  const find = (id: string) => stage.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(id)}"] > .upw-li`);
  const a = find(layer.from), b = find(layer.to);
  if (!a || !b) return null;
  const box = parts.svg.getBoundingClientRect();
  if (!box.width) return null;
  const k = parts.svg.clientWidth / box.width;
  const local = (r: DOMRect) => ({ l: (r.left - box.left) * k, t: (r.top - box.top) * k, w: r.width * k, h: r.height * k });
  const A = local(a.getBoundingClientRect()), B = local(b.getBoundingClientRect());
  const ca = [A.l + A.w / 2, A.t + A.h / 2], cb = [B.l + B.w / 2, B.t + B.h / 2];
  const horiz = Math.abs(cb[0] - ca[0]) >= Math.abs(cb[1] - ca[1]);
  const auto = (from: boolean): Side => horiz ? ((cb[0] > ca[0]) === from ? 'right' : 'left') : ((cb[1] > ca[1]) === from ? 'bottom' : 'top');
  const sa: Side = layer.fromSide && layer.fromSide !== 'auto' ? layer.fromSide : auto(true);
  const sb: Side = layer.toSide && layer.toSide !== 'auto' ? layer.toSide : auto(false);
  const anchor = (R: typeof A, s: Side): [number, number] => s === 'left' ? [R.l, R.t + R.h / 2] : s === 'right' ? [R.l + R.w, R.t + R.h / 2] : s === 'top' ? [R.l + R.w / 2, R.t] : [R.l + R.w / 2, R.t + R.h];
  const normal = (s: Side): [number, number] => s === 'left' ? [-1, 0] : s === 'right' ? [1, 0] : s === 'top' ? [0, -1] : [0, 1];
  const P = anchor(A, sa), Q = anchor(B, sb);
  const na = normal(sa), nb = normal(sb);
  const u = unitPx(inner);
  const n = Math.max(1, Math.min(40, Math.round(layer.count ?? 7)));
  const spread = (layer.spread ?? 8) * u;
  const pinch = clamp01(layer.pinch ?? 0.75);
  const wave = clamp01(layer.wave ?? 0.35);
  const dist = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  const reach = Math.max(dist * 0.42, 20);
  // Lines spread across each end (perpendicular to the side), squeeze together in the middle, and sway.
  const perpA: [number, number] = [-na[1], na[0]], perpB: [number, number] = [-nb[1], nb[0]];
  const out = [];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0 : i / (n - 1) - 0.5;
    const s: [number, number] = [P[0] + perpA[0] * f * spread, P[1] + perpA[1] * f * spread];
    // The end spreads the same way round as the start (dot of the two side tangents), so lines don't
    // all cross at the ends; the sway makes some cross in the middle, which the glow brightens.
    const sgn = perpA[0] * perpB[0] + perpA[1] * perpB[1] >= 0 ? 1 : -1;
    const e: [number, number] = [Q[0] + perpB[0] * f * spread * sgn, Q[1] + perpB[1] * f * spread * sgn];
    const sway = wave * spread * 1.2 * Math.sin(i * 1.7 + time * 0.9);
    const squeeze = 1 - pinch;
    const c1: [number, number] = [s[0] + na[0] * reach + perpA[0] * (f * spread * squeeze - f * spread + sway), s[1] + na[1] * reach + perpA[1] * (f * spread * squeeze - f * spread + sway)];
    const c2: [number, number] = [e[0] + nb[0] * reach + perpB[0] * sgn * (f * spread * squeeze - f * spread - sway), e[1] + nb[1] * reach + perpB[1] * sgn * (f * spread * squeeze - f * spread - sway)];
    out.push({ d: `M ${s[0].toFixed(1)} ${s[1].toFixed(1)} C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${e[0].toFixed(1)} ${e[1].toFixed(1)}`, s, e });
  }
  return out;
}

export function drawFlow(inner: HTMLElement, layer: FlowLayer, time: number) {
  const parts = flowParts.get(inner);
  if (!parts) return;
  const curves = flowCurves(inner, layer, time);
  parts.last = curves?.map((c) => c.d);
  const doc = inner.ownerDocument;
  if (!curves) { parts.cores.textContent = ''; parts.halos.textContent = ''; parts.pulses.textContent = ''; return; }
  const u = unitPx(inner);
  const width = (layer.width ?? 0.16) * u;
  const glow = Math.max(0, Math.min(3, layer.glow ?? 1));
  const v = drawState.get(inner) ?? 1;
  const npulse = Math.max(0, Math.min(6, Math.round(layer.pulses ?? 0)));
  const speed = layer.pulseSpeed ?? 0.5;
  const sync = (g: SVGGElement, count: number) => {
    while (g.children.length > count) g.lastChild!.remove();
    while (g.children.length < count) g.appendChild(svgEl(doc, 'path'));
    return Array.from(g.children) as SVGPathElement[];
  };
  const S = curves.reduce((m, c) => [m[0] + c.s[0] / curves.length, m[1] + c.s[1] / curves.length], [0, 0]);
  const E = curves.reduce((m, c) => [m[0] + c.e[0] / curves.length, m[1] + c.e[1] / curves.length], [0, 0]);
  parts.grad.setAttribute('x1', S[0].toFixed(1)); parts.grad.setAttribute('y1', S[1].toFixed(1));
  parts.grad.setAttribute('x2', E[0].toFixed(1)); parts.grad.setAttribute('y2', E[1].toFixed(1));
  const paint = `url(#${parts.id})`;
  const halos = sync(parts.halos, glow > 0 ? curves.length : 0);
  const cores = sync(parts.cores, curves.length);
  const pulses = sync(parts.pulses, curves.length * npulse);
  parts.halos.style.filter = glow > 0 ? `blur(${(width * 2.2 * glow).toFixed(1)}px)` : '';
  parts.halos.style.opacity = (0.5 + 0.15 * glow).toFixed(2);
  curves.forEach((c, i) => {
    const total = Math.hypot(c.e[0] - c.s[0], c.e[1] - c.s[1]) * 1.6 + 1;
    const dash = v >= 1 ? 'none' : `${(total * v).toFixed(1)} ${(total + 1).toFixed(1)}`;
    const set = (p: SVGPathElement, w: number) => {
      p.setAttribute('d', c.d);
      Object.assign(p.style, { fill: 'none', stroke: paint, strokeWidth: `${w.toFixed(2)}px`, strokeLinecap: 'round', strokeDasharray: dash, mixBlendMode: 'screen', visibility: v <= 0 ? 'hidden' : '' });
    };
    set(cores[i], width);
    if (halos[i]) set(halos[i], width * (3 + glow * 2));
    for (let k = 0; k < npulse; k++) {
      const p = pulses[i * npulse + k];
      const real = (p as SVGPathElement).getTotalLength ? (() => { p.setAttribute('d', c.d); try { return p.getTotalLength(); } catch { return total; } })() : total;
      const plen = Math.max(8, real * 0.06);
      const phase = ((time * speed + k / npulse + i * 0.137) % 1 + 1) % 1;
      Object.assign(p.style, {
        fill: 'none', stroke: '#ffffff', strokeWidth: `${(width * 1.6).toFixed(2)}px`, strokeLinecap: 'round',
        strokeDasharray: `${plen.toFixed(1)} ${(real + plen).toFixed(1)}`, strokeDashoffset: `${(-(phase * (real + plen)) + plen).toFixed(1)}`,
        filter: `drop-shadow(0 0 ${(width * 3).toFixed(1)}px ${alpha('#ffffff', 0.9)})`, visibility: v < 1 ? 'hidden' : '',
      });
    }
  });
}

/* ------------------------------------------------------------------ diagrams */

interface DiagramParts {
  edges: SVGSVGElement;
  edgePaths: SVGPathElement[];
  heads: SVGPathElement[];
  edgeLabels: HTMLElement[];
  nodes: Map<string, { el: HTMLElement; node: DiagramNode }>;
  tag?: HTMLElement;
}
const diagramParts = new WeakMap<HTMLElement, DiagramParts>();

export function buildDiagram(doc: Document, inner: HTMLElement, layer: DiagramLayer) {
  inner.textContent = '';
  inner.style.position = 'relative';
  const look = layer.look ?? {};
  const line = look.color ?? '#8b98a8';
  const fill = look.nodeFill ?? '#141a21';
  const text = look.textColor ?? '#e6edf3';
  const fs = look.fontSize ?? 1.4;
  inner.style.fontFamily = `${look.fontFamily ? `"${look.fontFamily.replace(/"/g, '')}", ` : ''}system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  const edges = svgEl(doc, 'svg');
  edges.setAttribute('class', 'upw-vec upw-vec-px');
  inner.appendChild(edges);
  const parts: DiagramParts = { edges, edgePaths: [], heads: [], edgeLabels: [], nodes: new Map() };
  for (const e of layer.edges ?? []) {
    const p = svgEl(doc, 'path');
    Object.assign(p.style, { fill: 'none', stroke: e.color ?? line, strokeWidth: `${look.lineWidth ?? 0.2}cqw`, strokeLinecap: 'round', strokeLinejoin: 'round' });
    edges.appendChild(p);
    parts.edgePaths.push(p);
    const h = svgEl(doc, 'path');
    h.style.fill = e.color ?? line;
    edges.appendChild(h);
    parts.heads.push(h);
    const lab = doc.createElement('div');
    lab.className = 'upw-dg-elabel';
    lab.textContent = e.label ?? '';
    Object.assign(lab.style, { position: 'absolute', fontSize: `${fs * 0.75}cqw`, color: text, opacity: '0', whiteSpace: 'nowrap', transform: 'translate(-50%, -50%)', padding: '0.1em 0.45em', borderRadius: '0.4em', background: fill });
    if (!e.label) lab.style.display = 'none';
    inner.appendChild(lab);
    parts.edgeLabels.push(lab);
  }
  for (const n of layer.nodes) {
    const el = doc.createElement('div');
    el.className = `upw-dg-node upw-dg-${n.shape ?? 'box'}`;
    const c = n.color ?? line;
    const shape = n.shape ?? 'box';
    const base: Partial<CSSStyleDeclaration> = { position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, color: text, fontSize: `${fs}cqw`, lineHeight: '1.15', boxSizing: 'border-box', whiteSpace: 'nowrap', opacity: '0' };
    Object.assign(el.style, base);
    if (shape === 'dot') {
      const dot = doc.createElement('i');
      Object.assign(dot.style, { display: 'block', width: '0.75em', height: '0.75em', borderRadius: '50%', border: `0.16em solid ${c}`, background: fill, boxSizing: 'border-box' });
      el.appendChild(dot);
      const lab = doc.createElement('span');
      Object.assign(lab.style, { position: 'absolute', left: '1.15em', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8em' });
      lab.textContent = n.label ?? '';
      if (n.sub) { const s = doc.createElement('small'); Object.assign(s.style, { display: 'block', opacity: '0.6', fontSize: '0.8em' }); s.textContent = n.sub; lab.appendChild(s); }
      el.appendChild(lab);
    } else if (shape === 'value') {
      const lab = doc.createElement('span');
      Object.assign(lab.style, { position: 'absolute', left: '0', bottom: '100%', marginBottom: '0.3em', fontSize: '0.75em', opacity: '0.75', letterSpacing: '0.04em' });
      lab.textContent = n.label ?? '';
      const val = doc.createElement('span');
      val.textContent = n.sub ?? '';
      Object.assign(el.style, { padding: '0.55em 1.1em', border: `0.12em solid ${c}`, borderRadius: '0.35em', background: alpha(c, 0.12), fontWeight: '700', textAlign: 'center' });
      el.append(lab, val);
    } else {
      Object.assign(el.style, {
        padding: shape === 'circle' ? '0' : '0.55em 1em', border: `0.1em solid ${c}`, background: fill, textAlign: 'center',
        borderRadius: shape === 'pill' ? '99em' : shape === 'circle' ? '50%' : '0.45em',
        ...(shape === 'circle' ? { width: '4.2em', height: '4.2em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } : {}),
      });
      const lab = doc.createElement('span');
      lab.style.fontWeight = '600';
      lab.textContent = n.label ?? '';
      el.appendChild(lab);
      if (n.sub) { const s = doc.createElement('small'); Object.assign(s.style, { display: 'block', opacity: '0.65', fontSize: '0.72em', marginTop: '0.15em' }); s.textContent = n.sub; el.appendChild(s); }
    }
    if (typeof n.w === 'number') { el.style.width = `${n.w}%`; el.style.whiteSpace = 'normal'; }
    inner.appendChild(el);
    parts.nodes.set(n.id, { el, node: n });
  }
  if (layer.tag) {
    const t = doc.createElement('div');
    t.className = 'upw-dg-tag';
    t.textContent = layer.tag.label;
    const c = layer.tag.color ?? '#ef4444';
    Object.assign(t.style, { position: 'absolute', fontSize: `${fs * 0.7}cqw`, fontWeight: '800', letterSpacing: '0.06em', color: '#fff', background: c, padding: '0.2em 0.5em', borderRadius: '0.3em', whiteSpace: 'nowrap', opacity: '0', transform: 'translate(-50%, -100%)' });
    inner.appendChild(t);
    parts.tag = t;
  }
  diagramParts.set(inner, parts);
}

/** Where a node is at a moment: its own place, then each move (a glide arriving at the move's time). */
function nodePos(n: DiagramNode, time: number): [number, number] {
  let x = n.x, y = n.y;
  for (const m of [...(n.moves ?? [])].sort((a, b) => a.t - b.t)) {
    const glide = 0.6;
    const k = easeInOut(clamp01((time - (m.t - glide)) / glide));
    x += (m.x - x) * k;
    y += (m.y - y) * k;
  }
  return [x, y];
}

export function drawDiagram(inner: HTMLElement, layer: DiagramLayer, time: number) {
  const parts = diagramParts.get(inner);
  if (!parts) return;
  const W = inner.clientWidth, H = inner.clientHeight;
  if (!W || !H) return;
  const u = unitPx(inner);
  const geo = new Map<string, { cx: number; cy: number; w: number; h: number; shown: number; dot: boolean }>();
  for (const [id, { el, node }] of parts.nodes) {
    const a = clamp01((time - (node.at ?? 0)) / 0.45);
    const shown = (node.at ?? 0) <= 0 ? 1 : a;
    const [x, y] = nodePos(node, time);
    el.style.left = `${x.toFixed(3)}%`;
    el.style.top = `${y.toFixed(3)}%`;
    el.style.opacity = clamp01(shown * 1.6).toFixed(3);
    el.style.transform = `translate(-50%, -50%) scale(${(0.6 + 0.4 * backOut(shown)).toFixed(4)})`;
    const dot = node.shape === 'dot';
    const first = el.firstElementChild as HTMLElement | null;
    const w = dot && first ? first.offsetWidth : el.offsetWidth;
    const h = dot && first ? first.offsetHeight : el.offsetHeight;
    // A dot's label sits beside it; the dot itself is what lines join.
    if (dot && first) el.style.transform = `translate(-${(first.offsetWidth / 2).toFixed(1)}px, -50%) scale(${(0.6 + 0.4 * backOut(shown)).toFixed(4)})`;
    geo.set(id, { cx: (x / 100) * W, cy: (y / 100) * H, w, h, shown, dot });
  }
  (layer.edges ?? []).forEach((e, i) => {
    const p = parts.edgePaths[i], head = parts.heads[i], lab = parts.edgeLabels[i];
    const A = geo.get(e.from), B = geo.get(e.to);
    if (!A || !B) { p.setAttribute('d', ''); head.setAttribute('d', ''); return; }
    const nA = layer.nodes.find((n) => n.id === e.from)!, nB = layer.nodes.find((n) => n.id === e.to)!;
    const at = e.at ?? Math.max(nA.at ?? 0, nB.at ?? 0) + ((nA.at ?? 0) > 0 || (nB.at ?? 0) > 0 ? 0.2 : 0);
    const prog = at <= 0 && (e.at ?? 0) <= 0 ? 1 : cubicOut(clamp01((time - at) / 0.5));
    const horiz = Math.abs(B.cx - A.cx) >= Math.abs(B.cy - A.cy);
    const edgeOf = (G: typeof A, toward: typeof A): [number, number] => {
      if (G.dot) {
        const ang = Math.atan2(toward.cy - G.cy, toward.cx - G.cx);
        return [G.cx + Math.cos(ang) * G.w / 2, G.cy + Math.sin(ang) * G.h / 2];
      }
      return horiz ? [G.cx + Math.sign(toward.cx - G.cx || 1) * G.w / 2, G.cy] : [G.cx, G.cy + Math.sign(toward.cy - G.cy || 1) * G.h / 2];
    };
    const s = edgeOf(A, B), t = edgeOf(B, A);
    const kind = e.kind ?? 'curve';
    let d: string;
    if (kind === 'straight') d = `M ${s[0]} ${s[1]} L ${t[0]} ${t[1]}`;
    else if (kind === 'step') {
      const m = horiz ? (s[0] + t[0]) / 2 : (s[1] + t[1]) / 2;
      d = horiz ? `M ${s[0]} ${s[1]} H ${m} V ${t[1]} H ${t[0]}` : `M ${s[0]} ${s[1]} V ${m} H ${t[0]} V ${t[1]}`;
    } else {
      const k = 0.5;
      d = horiz
        ? `M ${s[0]} ${s[1]} C ${s[0] + (t[0] - s[0]) * k} ${s[1]}, ${t[0] - (t[0] - s[0]) * k} ${t[1]}, ${t[0]} ${t[1]}`
        : `M ${s[0]} ${s[1]} C ${s[0]} ${s[1] + (t[1] - s[1]) * k}, ${t[0]} ${t[1] - (t[1] - s[1]) * k}, ${t[0]} ${t[1]}`;
    }
    p.setAttribute('d', d);
    let total = 0;
    try { total = p.getTotalLength(); } catch { total = 0; }
    const dash = e.dashed ? 0.8 * u : 0;
    p.style.strokeDasharray = dashTo(total, total * prog, dash, dash * 0.7);
    p.style.visibility = prog <= 0 ? 'hidden' : '';
    if (e.arrow !== false && prog > 0.05 && total > 0) {
      const tip = p.getPointAtLength(total * prog);
      const before = p.getPointAtLength(Math.max(0, total * prog - 2));
      const ang = Math.atan2(tip.y - before.y, tip.x - before.x);
      const size = Math.max(6, (layer.look?.lineWidth ?? 0.2) * u * 4.5);
      const bx = tip.x - Math.cos(ang) * size, by = tip.y - Math.sin(ang) * size;
      const nx = -Math.sin(ang) * size * 0.5, ny = Math.cos(ang) * size * 0.5;
      head.setAttribute('d', `M ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${(bx + nx).toFixed(1)} ${(by + ny).toFixed(1)} L ${(bx - nx).toFixed(1)} ${(by - ny).toFixed(1)} Z`);
    } else head.setAttribute('d', '');
    if (e.label && total > 0) {
      const mid = p.getPointAtLength(total / 2);
      lab.style.left = `${mid.x.toFixed(1)}px`;
      lab.style.top = `${mid.y.toFixed(1)}px`;
      lab.style.opacity = clamp01((prog - 0.5) * 2).toFixed(3);
    }
  });
  if (parts.tag && layer.tag?.stops.length) {
    const stops = [...layer.tag.stops].filter((s) => geo.has(s.node)).sort((a, b) => a.t - b.t);
    const tag = parts.tag;
    if (!stops.length || time < stops[0].t - 0.3) { tag.style.opacity = '0'; tag.style.left = ''; tag.style.top = ''; return; }
    const spot = (id: string) => { const g = geo.get(id)!; return [g.cx, g.cy - g.h / 2 - 0.6 * u] as [number, number]; };
    let pos = spot(stops[0].node);
    for (let k = 1; k < stops.length; k++) {
      const glide = Math.min(0.5, stops[k].t - stops[k - 1].t);
      const f = easeInOut(clamp01((time - (stops[k].t - glide)) / Math.max(0.01, glide)));
      if (f <= 0) break;
      const to = spot(stops[k].node);
      pos = [pos[0] + (to[0] - pos[0]) * f, pos[1] + (to[1] - pos[1]) * f];
    }
    tag.style.left = `${pos[0].toFixed(1)}px`;
    tag.style.top = `${pos[1].toFixed(1)}px`;
    tag.style.opacity = clamp01((time - (stops[0].t - 0.3)) / 0.3).toFixed(3);
  }
}
