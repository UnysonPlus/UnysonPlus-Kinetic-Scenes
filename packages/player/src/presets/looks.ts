import type { PresetContext } from './index';
import { clamp01, drive, isOut, num, owned, pick } from './more';
import { RoughGenerator } from 'roughjs/bin/generator';
import { loadPaint, type PaintJob } from '../paintLayer';

/**
 * Looks for motion-design styles the other presets can't make: hand-drawn line boil, a liquid blob, pixel art,
 * paint-on brush strokes, risograph print (halftone dots and an offset colour plate), VHS / CRT, and four text looks
 * (outline, a 3D offset shadow, gradient letters, skew). Each is deterministic in time (same frame, same picture), so
 * the timeline can be scrubbed and exported frame by frame.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
let uid = 0;

/** A small hidden <svg> holding one filter, kept with the layer; returns the filter's id and its element. */
function svgFilter(ctx: PresetContext, cls: string, inner: string): { id: string; root: SVGSVGElement } {
  const host = owned(ctx, cls);
  let root = host.querySelector('svg') as SVGSVGElement | null;
  let id = host.dataset.fid;
  if (!root || !id) {
    id = `upw-${cls}-${++uid}`;
    host.dataset.fid = id;
    host.innerHTML = `<svg xmlns="${SVG_NS}" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">${inner}</filter></svg>`;
    root = host.querySelector('svg') as SVGSVGElement;
  }
  Object.assign(host.style, { position: 'absolute', width: '0', height: '0', overflow: 'hidden', pointerEvents: 'none' });
  return { id, root };
}

/** Adds or removes one named part of the layer's CSS filter, leaving the others (from other clips) in place. */
const FILTERS = new WeakMap<HTMLElement, Map<string, string>>();
export function filterPart(el: HTMLElement, key: string, value: string | null) {
  let m = FILTERS.get(el);
  if (!m) { m = new Map(); FILTERS.set(el, m); }
  if (value) m.set(key, value); else m.delete(key);
  // In a fixed order, so two looks on one layer draw the same however the timeline was reached.
  el.style.filter = [...m.keys()].sort().map((k) => m!.get(k)).join(' ');
}

/** The element whose own pixels a look applies to: the picture of an image or video layer, else the layer itself. */
const target = (el: HTMLElement) => el.querySelector<HTMLElement>(':scope > video, :scope > img') ?? el;
/** The visible letters of a text layer (its own transform stays free for the other presets). */
const letters = (el: HTMLElement) => el.querySelector<HTMLElement>('.upw-txt') ?? el;

/** A rounded rectangle as an SVG path, for the sketch look. */
const roundedRect = (x: number, y: number, w: number, h: number, r: number) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
/** The first plain colour in a CSS background (a gradient's first stop), or null. */
const firstColour = (fill: unknown) => (typeof fill === 'string' ? /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/i.exec(fill)?.[0] ?? (/^[a-z]+$/i.test(fill) ? fill : null) : null);
/** A steady number from a layer's id, so each shape has its own scribble and keeps it. */
const seedOf = (id: string) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 99991, 7) + 1;

export const LOOK_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  sketch(ctx) {
    // Hand-drawn: the shape is redrawn with wobbly pencil lines and a scribbled fill (Rough.js). The seed fixes every line,
    // so a frame is the same on every play and export; "fps" redraws it a few times a second, like a flip book. It holds
    // for the rest of the layer.
    const p = ctx.params;
    const layer = ctx.layer as unknown as { shape?: string; fill?: string; stroke?: string; radius?: number };
    const fps = Math.max(0, Math.min(12, num(p, 'fps', 0)));
    const fillStyle = pick(p, 'style', ['hachure', 'solid', 'zigzag', 'cross-hatch', 'dots', 'none'] as const, 'hachure');
    const color = typeof p.color === 'string' && p.color ? p.color : layer.stroke || '#1c1e22';
    const fill = fillStyle === 'none' ? undefined : (typeof p.fill === 'string' && p.fill ? p.fill : firstColour(layer.fill) ?? '#2ad38b');
    const seed = Math.max(1, Math.round(num(p, 'seed', 0)) || seedOf(ctx.layer.id));
    const host = owned(ctx, 'upw-sketch');
    Object.assign(host.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'visible' });
    const NS = SVG_NS;
    const doc = ctx.el.ownerDocument;
    const svg = (host.querySelector('svg') ?? host.appendChild(doc.createElementNS(NS, 'svg'))) as SVGSVGElement;
    Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' });
    let drawn = '';
    drive(ctx, (raw) => {
      const w = ctx.el.clientWidth, h = ctx.el.clientHeight;
      if (!w || !h) return;
      const take = fps ? Math.floor(raw * ctx.duration * fps) % 4 : 0;
      const key = `${w}x${h}:${take}`;
      ctx.el.style.background = 'transparent';
      ctx.el.style.border = '0';
      if (key === drawn) return;
      drawn = key;
      // Sizes follow the stage, so a preview and a 1080 px export draw the same picture.
      const k = (ctx.el.closest<HTMLElement>('.upw-canvas')?.clientWidth || 640) / 640;
      const g = new RoughGenerator({ options: { seed: seed + take } } as never);
      const o = {
        seed: seed + take, roughness: num(p, 'roughness', 1.4), bowing: num(p, 'bowing', 1), stroke: color, strokeWidth: num(p, 'weight', 1.6) * k,
        maxRandomnessOffset: 2 * k, ...(fill ? { fill, fillStyle, fillWeight: num(p, 'weight', 1.6) * k * 0.6, hachureGap: num(p, 'gap', 6) * k, hachureAngle: num(p, 'angle', -41) } : {}),
      };
      const inset = 2 * k;
      const r = layer.radius ? Math.min((layer.radius / 100) * (w / k / 640) * 640 * k, w / 2, h / 2) : 0;
      const d = layer.shape === 'ellipse' ? g.ellipse(w / 2, h / 2, w - inset * 2, h - inset * 2, o)
        : r > 0 ? g.path(roundedRect(inset, inset, w - inset * 2, h - inset * 2, r), o)
          : g.rectangle(inset, inset, w - inset * 2, h - inset * 2, o);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.replaceChildren(...g.toPaths(d).map((q) => {
        const path = doc.createElementNS(NS, 'path');
        path.setAttribute('d', q.d);
        path.setAttribute('stroke', q.stroke);
        path.setAttribute('stroke-width', String(q.strokeWidth));
        path.setAttribute('fill', q.fill || 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        return path;
      }));
    }, { ease: false, always: true });
  },

  painted(ctx) {
    // Painted: the shape (or line) is painted with real brushes (p5.brush): a pencil, ink, marker, charcoal, crayon or
    // pastel outline over a watercolour wash, a flat wash or hatching. Painting is seeded, so every frame is the same on
    // every play and export. With "paint" above 0 it paints on over that part of the clip: the outline is drawn round
    // the shape while the colour blooms in behind it. The paint engine (scene-paint.js) loads only for scenes using it.
    const p = ctx.params;
    const layer = ctx.layer as unknown as { type: string; shape?: string; fill?: string; stroke?: string; radius?: number; d?: string };
    const medium = pick(p, 'medium', ['pencil', 'ink', 'fineliner', 'marker', 'charcoal', 'crayon', 'pastel', 'coloured pencil'] as const, 'pencil');
    // Automatic: a line is only drawn, a shape (or a filled line) gets a watercolour wash.
    const chosen = pick(p, 'fill', ['auto', 'watercolour', 'wash', 'hatch', 'none'] as const, 'auto');
    const fillMode = chosen !== 'auto' ? chosen : layer.type === 'path' && !layer.fill ? 'none' : 'watercolour';
    const line = p.line !== false;
    const lineColor = typeof p.color === 'string' && p.color ? p.color : layer.stroke || '#1c1e22';
    const fillColor = (typeof p.fillColor === 'string' && p.fillColor) || firstColour(layer.fill) || '#2ad38b';
    const paintPart = Math.max(0, Math.min(0.95, num(p, 'paint', 0)));
    const seed = Math.max(1, Math.round(num(p, 'seed', 0)) || seedOf(ctx.layer.id));
    // Room round the shape for the watercolour to bleed into: more bleed, more room.
    const PAD = 0.08 + 0.3 * Math.max(0, Math.min(1, num(p, 'bleed', 0.25)));
    const doc = ctx.el.ownerDocument;
    const win = doc.defaultView as Window;
    const host = owned(ctx, 'upw-paint');
    Object.assign(host.style, { position: 'absolute', left: `${-PAD * 100}%`, top: `${-PAD * 100}%`, width: `${100 + 2 * PAD * 100}%`, height: `${100 + 2 * PAD * 100}%`, pointerEvents: 'none' });
    const mk = (cls: string) => {
      let c = host.querySelector<HTMLCanvasElement>(`canvas.${cls}`);
      if (!c) { c = doc.createElement('canvas'); c.className = cls; host.appendChild(c); }
      Object.assign(c.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
      return c;
    };
    const fillCanvas = mk('upw-paint-fill');
    const lineCanvas = mk('upw-paint-line');
    let fillKey = '', lineKey = '', last = -1, waiting = false;

    /** The outline in the canvas's pixels: the shape's own, or points along the line layer's path. */
    const outline = (w: number, h: number, dpr: number, stageW: number): { pts: Array<[number, number]>; closed: boolean; curve: number } | null => {
      const ox = PAD * w * dpr, oy = PAD * h * dpr;
      const P = (x: number, y: number): [number, number] => [ox + x * dpr, oy + y * dpr];
      if (layer.type === 'path') {
        const path = ctx.el.querySelector<SVGPathElement>('path');
        if (!path || !path.getTotalLength) return null;
        const len = path.getTotalLength();
        const m = path.getScreenCTM();
        const box = ctx.el.getBoundingClientRect();
        const zoom = ctx.el.offsetWidth ? box.width / ctx.el.offsetWidth : 1;
        if (!len || !m) return null;
        const n = Math.max(24, Math.min(160, Math.round(len / 4)));
        const pts: Array<[number, number]> = [];
        for (let i = 0; i <= n; i++) {
          const q = path.getPointAtLength((len * i) / n).matrixTransform(m);
          pts.push(P((q.x - box.left) / zoom, (q.y - box.top) / zoom));
        }
        return { pts, closed: /z\s*$/i.test(layer.d ?? ''), curve: 0.3 };
      }
      if (layer.shape === 'ellipse') {
        const n = 56;
        return { pts: Array.from({ length: n }, (_, i) => P(w / 2 + (w / 2) * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2), h / 2 + (h / 2) * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2))), closed: true, curve: 0.5 };
      }
      const r = Math.min(((layer.radius ?? 0) / 100) * stageW, w / 2, h / 2);
      if (r < 1) return { pts: [P(0, 0), P(w, 0), P(w, h), P(0, h)], closed: true, curve: 0 };
      const pts: Array<[number, number]> = [];
      const arc = (cx: number, cy: number, a0: number) => { for (let i = 0; i <= 6; i++) { const a = a0 + (i * Math.PI) / 12; pts.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a))); } };
      // From the top-left corner, clockwise, the way a hand would go round it.
      arc(r, r, Math.PI); arc(w - r, r, -Math.PI / 2); arc(w - r, h - r, 0); arc(r, h - r, Math.PI / 2);
      return { pts, closed: true, curve: 0 };
    };

    const render = (raw: number) => {
      last = raw;
      const w = ctx.el.clientWidth, h = ctx.el.clientHeight;
      // The layer's own look gives way to the painting (a path's own line too).
      if (layer.type === 'path') ctx.el.querySelectorAll<SVGElement>('svg path').forEach((el) => { el.style.opacity = '0'; });
      else { ctx.el.style.background = 'transparent'; ctx.el.style.border = '0'; }
      if (!w || !h) return;
      const engine = win.UnysonPlusScenePaint;
      if (!engine) {
        if (!waiting) { waiting = true; loadPaint(win).then(() => { waiting = false; render(last); }, () => { waiting = false; }); }
        return;
      }
      const stageW = ctx.el.closest<HTMLElement>('.upw-canvas')?.clientWidth || 640;
      const dpr = Math.min(2, win.devicePixelRatio || 1);
      const shape = outline(w, h, dpr, stageW);
      if (!shape) return;
      const W = Math.round(w * (1 + 2 * PAD) * dpr), H = Math.round(h * (1 + 2 * PAD) * dpr);
      const job: PaintJob = {
        width: W, height: H, points: shape.pts, closed: shape.closed, curve: shape.curve, medium, line, lineColor, fill: fillMode, fillColor,
        opacity: Math.max(0.05, Math.min(1, num(p, 'opacity', 1))), weight: num(p, 'weight', 1), bleed: Math.max(0, Math.min(1, num(p, 'bleed', 0.25))),
        texture: Math.max(0, Math.min(1, num(p, 'texture', 0.5))), gap: num(p, 'gap', 7), angle: num(p, 'angle', -35),
        scale: (stageW / 640) * dpr, seed, progress: 1, part: 'fill',
      };
      // Paint on: the outline goes round in the first 70%, the colour blooms in from a quarter of the way.
      const pr = paintPart > 0 ? clamp01(raw / paintPart) : 1;
      const lineP = Math.round(clamp01(pr / 0.7) * 60) / 60;
      const fillP = clamp01((pr - 0.25) / 0.75);
      const fk = `${W}x${H}:${fillMode}:${fillColor}`;
      if (fk !== fillKey) { fillKey = fk; engine.paint({ ...job, part: 'fill' }, fillCanvas); }
      const lk = `${W}x${H}:${lineP}`;
      if (lk !== lineKey) { lineKey = lk; engine.paint({ ...job, part: 'line', progress: lineP }, lineCanvas); }
      fillCanvas.style.opacity = fillP.toFixed(3);
      const edge = -30 + 130 * fillP;
      const mask = fillP >= 1 ? '' : `linear-gradient(100deg, #000 ${edge.toFixed(1)}%, transparent ${(edge + 30).toFixed(1)}%)`;
      fillCanvas.style.maskImage = mask;
      fillCanvas.style.setProperty('-webkit-mask-image', mask);
      lineCanvas.style.opacity = lineP > 0 ? '1' : '0';
    };
    drive(ctx, render, { ease: false, always: true });
  },

  paper(ctx) {
    // Construction paper: a hand-cut edge, a fine grain over the colour, and a shadow lifting it off what is below. On a
    // text layer with a pill it makes a torn paper tag. It holds for the rest of the layer; "fps" re-cuts the edge a few
    // times a second, like stop motion. Sizes follow the stage, so a preview and a 1080 px export look the same.
    const p = ctx.params;
    const rough = num(p, 'rough', 2.5);
    const grain = Math.max(0, Math.min(1, num(p, 'grain', 0.3)));
    const lift = num(p, 'lift', 1);
    const fps = Math.max(0, Math.min(12, num(p, 'fps', 0)));
    const { id, root } = svgFilter(ctx, 'upw-paper', `<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="e"/><feDisplacementMap in="SourceGraphic" in2="e" scale="3" xChannelSelector="R" yChannelSelector="G" result="cut"/><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${(-1.6 * grain).toFixed(2)} ${(0.95 * grain).toFixed(2)}" result="ga"/><feComposite in="ga" in2="cut" operator="in" result="gc"/><feMerge><feMergeNode in="cut"/><feMergeNode in="gc"/></feMerge>`);
    const [edge, fine] = [...root.querySelectorAll('feTurbulence')];
    const map = root.querySelector('feDisplacementMap')!;
    const el = target(ctx.el);
    drive(ctx, (raw) => {
      const k = (ctx.el.closest<HTMLElement>('.upw-canvas')?.clientWidth || 640) / 640;
      map.setAttribute('scale', (rough * k).toFixed(2));
      edge.setAttribute('baseFrequency', (0.03 / k).toFixed(4));
      fine.setAttribute('baseFrequency', (0.8 / k).toFixed(4));
      edge.setAttribute('seed', String(4 + (fps ? Math.floor(raw * ctx.duration * fps) % 5 : 0)));
      const y = (0.45 * lift).toFixed(2);
      filterPart(el, ctx.clip.id, `url(#${id}) drop-shadow(0 ${y}cqw ${(0.5 * lift).toFixed(2)}cqw rgba(20,16,10,.38))`);
    }, { ease: false, always: true });
  },

  boil(ctx) {
    // Hand-drawn cel animation: the outlines wobble a little on every drawing, redrawn a few times a second.
    const p = ctx.params;
    const amount = num(p, 'amount', 2.5);
    const fps = Math.max(2, Math.min(24, num(p, 'fps', 8)));
    const { id, root } = svgFilter(ctx, 'upw-boil', `<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${amount}" xChannelSelector="R" yChannelSelector="G"/>`);
    const turb = root.querySelector('feTurbulence')!;
    drive(ctx, (raw) => {
      const on = raw > 0 && raw < 1;
      if (!on) { filterPart(ctx.el, ctx.clip.id, null); return; }
      turb.setAttribute('seed', String(1 + (Math.floor(raw * ctx.duration * fps) % 6)));
      filterPart(ctx.el, ctx.clip.id, `url(#${id})`);
    }, { ease: false, always: true });
  },

  liquid(ctx) {
    // A blob of liquid: the corners flow from one organic shape into the next, as if the shape were poured.
    const p = ctx.params;
    const speed = num(p, 'speed', 1);
    const shapes = [[42, 58, 63, 37, 48, 41, 59, 52], [64, 36, 41, 59, 62, 44, 56, 38], [36, 64, 58, 42, 37, 63, 44, 56], [55, 45, 37, 63, 58, 42, 61, 39]];
    const css = (a: number[]) => `${a[0]}% ${a[1]}% ${a[2]}% ${a[3]}% / ${a[4]}% ${a[5]}% ${a[6]}% ${a[7]}%`;
    const el = target(ctx.el);
    drive(ctx, (raw) => {
      if (raw <= 0 || raw >= 1) { el.style.borderRadius = ''; return; }
      const t = raw * ctx.duration * speed * 0.6;
      const i = Math.floor(t) % shapes.length, f = t - Math.floor(t);
      const s = (1 - Math.cos(f * Math.PI)) / 2;
      const a = shapes[i], b = shapes[(i + 1) % shapes.length];
      el.style.borderRadius = css(a.map((v, k) => v + (b[k] - v) * s));
    }, { ease: false, always: true });
  },

  pixelate(ctx) {
    // Pixel art: the picture resolves out of big square pixels (or breaks up into them, out).
    const p = ctx.params;
    const out = isOut(p);
    const max = Math.max(2, num(p, 'size', 24));
    const { id, root } = svgFilter(ctx, 'upw-pix', '<feFlood x="0" y="0" width="1" height="1"/><feComposite width="8" height="8"/><feTile result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/><feMorphology operator="dilate" radius="4"/>');
    const [flood, comp, , , morph] = Array.from(root.querySelectorAll('filter > *'));
    drive(ctx, (e) => {
      const v = clamp01(out ? e : 1 - e); // 1 = fully pixelated
      const size = Math.round(1 + v * (max - 1));
      if (size <= 1) { filterPart(ctx.el, ctx.clip.id, null); return; }
      flood.setAttribute('x', String(Math.floor(size / 2)));
      flood.setAttribute('y', String(Math.floor(size / 2)));
      comp.setAttribute('width', String(size));
      comp.setAttribute('height', String(size));
      morph.setAttribute('radius', String(Math.floor(size / 2)));
      filterPart(ctx.el, ctx.clip.id, `url(#${id})`);
    });
  },

  brush(ctx) {
    // Watercolour and ink: the layer paints on in a few brush strokes, row after row, with ragged ends.
    const p = ctx.params;
    const out = isOut(p);
    const rows = Math.max(1, Math.min(8, Math.round(num(p, 'strokes', 4))));
    const from = pick(p, 'from', ['left', 'right'] as const, 'left');
    const el = ctx.el;
    drive(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      if (v >= 1) { el.style.maskImage = ''; el.style.setProperty('-webkit-mask-image', ''); return; }
      const h = 100 / rows;
      const layers: string[] = [], sizes: string[] = [], pos: string[] = [];
      for (let r = 0; r < rows; r++) {
        // Each stroke starts a little after the one above it and drags a soft, uneven tail.
        const local = clamp01((v * (rows + 1.2) - r) / 2.2);
        const ragged = 6 + ((r * 37) % 9);
        const dir = (from === 'left') !== (r % 2 === 1) ? 'to right' : 'to left';
        layers.push(`linear-gradient(${dir}, #000 calc(100% - ${ragged}%), transparent)`);
        sizes.push(`${(local * 112).toFixed(2)}% ${(h + 2).toFixed(2)}%`);
        pos.push(`${dir === 'to right' ? '0%' : '100%'} ${((r * h * 100) / (100 - h || 1)).toFixed(2)}%`);
      }
      const mask = layers.join(',');
      el.style.maskImage = mask;
      el.style.setProperty('-webkit-mask-image', mask);
      el.style.maskSize = sizes.join(',');
      el.style.setProperty('-webkit-mask-size', sizes.join(','));
      el.style.maskPosition = pos.join(',');
      el.style.setProperty('-webkit-mask-position', pos.join(','));
      el.style.maskRepeat = 'no-repeat';
      el.style.setProperty('-webkit-mask-repeat', 'no-repeat');
    });
  },

  halftone(ctx) {
    // Risograph print: halftone dots over the picture and a second ink printed slightly out of register.
    const p = ctx.params;
    const dot = num(p, 'dot', 1.2);
    const ink = typeof p.ink === 'string' ? p.ink : '#ff4f8b';
    const shift = num(p, 'offset', 0.5);
    const fx = owned(ctx, 'upw-halftone');
    Object.assign(fx.style, { position: 'absolute', inset: '0', pointerEvents: 'none', mixBlendMode: 'multiply',
      background: `radial-gradient(circle at center, rgba(0,0,0,.42) 0 32%, transparent 36%) 0 0 / ${dot}cqw ${dot}cqw` });
    drive(ctx, (e) => {
      const v = clamp01(isOut(p) ? 1 - e : e);
      fx.style.opacity = (v * 0.9).toFixed(3);
      filterPart(target(ctx.el), ctx.clip.id, v > 0 ? `drop-shadow(${(shift * v).toFixed(3)}cqw ${(shift * 0.6 * v).toFixed(3)}cqw 0 ${ink}) contrast(${(1 + 0.15 * v).toFixed(3)}) saturate(${(1 - 0.2 * v).toFixed(3)})` : null);
    }, { always: true });
  },

  scanlines(ctx) {
    // VHS and CRT: scanlines, colour bleeding into red and blue fringes, a soft tube vignette, a jittering frame and
    // a tracking band rolling down the picture, for as long as the clip lasts.
    const p = ctx.params;
    const bleed = num(p, 'bleed', 0.35);
    const jitter = num(p, 'jitter', 0.25);
    const tracking = p.tracking !== false;
    const fx = owned(ctx, 'upw-vhs');
    if (!fx.firstChild) {
      fx.innerHTML = '<i style="position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)"></i>'
        + '<i style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,.5) 100%)"></i>'
        + '<i class="t" style="position:absolute;left:0;right:0;height:7%;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.14),rgba(255,255,255,.05),transparent);mix-blend-mode:screen"></i>';
    }
    Object.assign(fx.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' });
    const band = fx.querySelector<HTMLElement>('.t')!;
    band.style.display = tracking ? '' : 'none';
    const el = target(ctx.el);
    drive(ctx, (raw) => {
      const on = raw > 0 && raw < 1;
      fx.style.opacity = on ? '1' : '0';
      if (!on) { filterPart(el, ctx.clip.id, null); el.style.translate = ''; band.style.top = ''; return; }
      const t = raw * ctx.duration, frame = Math.floor(t * 30);
      const b = (bleed * 0.6).toFixed(3);
      filterPart(el, ctx.clip.id, `drop-shadow(${b}cqw 0 0 rgba(255,0,60,.55)) drop-shadow(-${b}cqw 0 0 rgba(0,140,255,.55)) saturate(1.25) contrast(1.05)`);
      el.style.translate = ctx.rand(frame, 4) < 0.12 ? `${((ctx.rand(frame, 5) - 0.5) * jitter * 2).toFixed(3)}cqw 0` : '';
      band.style.top = `${(((t * 0.35) % 1.2) * 100 - 10).toFixed(2)}%`;
    }, { ease: false, always: true });
  },

  'text-outline'(ctx) {
    // Outlined letters: the fill drains away, leaving the letters' outline in the text's own colour (or a chosen one).
    const p = ctx.params;
    const width = num(p, 'width', 0.12);
    const stroke = typeof p.color === 'string' && p.color ? p.color : 'currentColor';
    const el = letters(ctx.el);
    drive(ctx, (e) => {
      const v = clamp01(isOut(p) ? 1 - e : e);
      el.style.setProperty('-webkit-text-stroke', v > 0 ? `${(width * v).toFixed(3)}cqw ${stroke}` : '');
      el.style.setProperty('-webkit-text-fill-color', v > 0 ? `color-mix(in srgb, currentColor ${((1 - v) * 100).toFixed(1)}%, transparent)` : '');
    });
  },

  'text-3d'(ctx) {
    // A 3D offset shadow: solid layers stacked under the letters, growing out diagonally as if extruded.
    const p = ctx.params;
    const depth = Math.max(1, Math.min(14, Math.round(num(p, 'depth', 6))));
    const shade = typeof p.color === 'string' && p.color ? p.color : 'rgba(0,0,0,.85)';
    const step = num(p, 'step', 0.12);
    drive(ctx, (e) => {
      const v = clamp01(isOut(p) ? 1 - e : e);
      const n = Math.round(depth * v);
      letters(ctx.el).style.textShadow = n ? Array.from({ length: n }, (_, i) => `${((i + 1) * step).toFixed(3)}cqw ${((i + 1) * step).toFixed(3)}cqw 0 ${shade}`).join(',') : '';
    });
  },

  'text-gradient'(ctx) {
    // Gradient letters: a gradient fills the letters and slowly travels through them.
    const p = ctx.params;
    const a = typeof p.from === 'string' ? p.from : '#ff5f6d';
    const b = typeof p.to === 'string' ? p.to : '#ffc371';
    const angle = num(p, 'angle', 90);
    const el = letters(ctx.el);
    drive(ctx, (e) => {
      if (e <= 0) { el.style.backgroundImage = ''; el.style.backgroundPosition = ''; el.style.backgroundSize = ''; el.style.setProperty('-webkit-background-clip', ''); el.style.setProperty('-webkit-text-fill-color', ''); return; }
      el.style.backgroundImage = `linear-gradient(${angle}deg, ${a}, ${b}, ${a})`;
      el.style.backgroundSize = '200% 200%';
      el.style.backgroundPosition = `${(e * 100).toFixed(2)}% 50%`;
      el.style.setProperty('-webkit-background-clip', 'text');
      el.style.backgroundClip = 'text';
      el.style.setProperty('-webkit-text-fill-color', 'transparent');
    }, { always: true });
  },

  'text-skew'(ctx) {
    // Skewed type: the letters lean into motion (or straighten up, out).
    const p = ctx.params;
    const angle = num(p, 'angle', -12);
    const el = letters(ctx.el);
    drive(ctx, (e) => {
      const v = clamp01(isOut(p) ? 1 - e : e);
      el.style.display = v ? 'inline-block' : '';
      el.style.transform = v ? `skewX(${(angle * v).toFixed(2)}deg)` : '';
    });
  },
};
