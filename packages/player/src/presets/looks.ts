import type { PresetContext } from './index';
import { clamp01, drive, isOut, num, owned, pick } from './more';

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
function filterPart(el: HTMLElement, key: string, value: string | null) {
  let m = FILTERS.get(el);
  if (!m) { m = new Map(); FILTERS.set(el, m); }
  if (value) m.set(key, value); else m.delete(key);
  el.style.filter = [...m.values()].join(' ');
}

/** The element whose own pixels a look applies to: the picture of an image or video layer, else the layer itself. */
const target = (el: HTMLElement) => el.querySelector<HTMLElement>(':scope > video, :scope > img') ?? el;
/** The visible letters of a text layer (its own transform stays free for the other presets). */
const letters = (el: HTMLElement) => el.querySelector<HTMLElement>('.upw-txt') ?? el;

export const LOOK_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
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
      if (!on) { filterPart(el, ctx.clip.id, null); el.style.translate = ''; return; }
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
      if (e <= 0) { el.style.backgroundImage = ''; el.style.setProperty('-webkit-background-clip', ''); el.style.setProperty('-webkit-text-fill-color', ''); return; }
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
