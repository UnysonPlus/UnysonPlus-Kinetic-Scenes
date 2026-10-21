import type { PresetContext } from './index';
import { clamp01, drive, easeOf, isOut, num, owned, pick } from './more';

/**
 * Glow, motion blur, impact bursts, the word-reveal carrier and the interface pieces (progress bars,
 * marching outlines, stacking cards). Like the other drawn presets, each frame is a pure function of the
 * clip's progress, so any moment can be shown by seeking.
 */

type Vars = Record<string, unknown>;
const color = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' && p[k] ? (p[k] as string) : d);
const alpha = (c: string, a: number) => `color-mix(in srgb, ${c} ${(clamp01(a) * 100).toFixed(1)}%, transparent)`;
const SVG = 'http://www.w3.org/2000/svg';

let stageUid = 0;

/**
 * Blur along one direction (a gaussian blur can only blur every way at once): an SVG filter owned by the
 * clip, in a hidden defs block on the stage. Returns a setter taking the blur across and down in stage
 * units (1 = 1% of the stage width); 0 and 0 removes it.
 */
export function directionalBlur(ctx: PresetContext, el: HTMLElement = ctx.el): ((x: number, y: number) => void) | null {
  const stage = el.closest<HTMLElement>('.upw-stage');
  const canvas = el.closest<HTMLElement>('.upw-canvas');
  if (!stage || !canvas) return null;
  const doc = stage.ownerDocument;
  if (!stage.dataset.upwUid) stage.dataset.upwUid = String(++stageUid);
  let defs = stage.querySelector<SVGSVGElement>(':scope > svg.upw-defs');
  if (!defs) {
    defs = doc.createElementNS(SVG, 'svg');
    defs.setAttribute('class', 'upw-defs');
    defs.setAttribute('aria-hidden', 'true');
    defs.setAttribute('width', '0');
    defs.setAttribute('height', '0');
    defs.style.position = 'absolute';
    stage.appendChild(defs);
  }
  const id = `upw-mb-${stage.dataset.upwUid}-${ctx.clip.id}`;
  let blur = defs.querySelector<SVGElement>(`[id="${id}"] > feGaussianBlur`);
  if (!blur) {
    const f = doc.createElementNS(SVG, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('x', '-60%');
    f.setAttribute('y', '-60%');
    f.setAttribute('width', '220%');
    f.setAttribute('height', '220%');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    blur = doc.createElementNS(SVG, 'feGaussianBlur');
    f.appendChild(blur);
    defs.appendChild(f);
  }
  const node = blur;
  return (x, y) => {
    if (Math.abs(x) < 0.005 && Math.abs(y) < 0.005) { el.style.filter = ''; return; }
    const w = canvas.clientWidth || 1000;
    node.setAttribute('stdDeviation', `${((Math.abs(x) / 100) * w).toFixed(2)} ${((Math.abs(y) / 100) * w).toFixed(2)}`);
    el.style.filter = `url(#${id})`;
  };
}

/** How fast an ease is moving at t, relative to its average speed (1 = average). */
export function speedOf(e: (t: number) => number, t: number) {
  const h = 0.004;
  const a = Math.max(0, t - h);
  const b = Math.min(1, t + h);
  return b > a ? Math.abs(e(b) - e(a)) / (b - a) : 0;
}

/** Measures an element's laid-out box inside an ancestor (offsets, so transforms don't count). */
function offsetIn(node: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0;
  let n: HTMLElement | null = node;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y, w: node.offsetWidth, h: node.offsetHeight };
}

export const FX_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  glow(ctx) {
    // Neon: layered soft shadows in the colour, around the letters of text and the outline of anything else.
    const p = ctx.params;
    const c = color(p, 'color', '#2ad38b');
    const size = Math.max(0.1, num(p, 'size', 1.2));
    const strength = Math.max(0, Math.min(2, num(p, 'strength', 1)));
    const flicker = p.flicker === true;
    const out = isOut(p);
    const isText = ctx.layer.type === 'text';
    const render = (e: number) => {
      let v = clamp01(out ? 1 - e : e);
      // A neon tube catching: a few stepped stutters over the first part of an entrance.
      if (flicker && !out && v > 0 && v < 1) {
        const step = Math.floor(v * 14);
        v = v < 0.6 && ctx.rand(step) < 0.45 ? v * 0.25 : v;
      }
      if (v <= 0.001) {
        if (isText) ctx.el.style.textShadow = ''; else ctx.el.style.filter = '';
        return;
      }
      const a = Math.min(1, strength * v);
      const s = (k: number) => `${(size * k).toFixed(3)}cqw`;
      if (isText) ctx.el.style.textShadow = `0 0 ${s(0.25)} ${alpha(c, a)}, 0 0 ${s(0.8)} ${alpha(c, a * 0.8)}, 0 0 ${s(2)} ${alpha(c, a * 0.55)}`;
      else ctx.el.style.filter = `drop-shadow(0 0 ${s(0.3)} ${alpha(c, a)}) drop-shadow(0 0 ${s(1.4)} ${alpha(c, a * 0.6)})`;
    };
    drive(ctx, render, { always: !out });
  },

  burst(ctx) {
    // A one-off burst from the layer: it is invisible before and after, so it punctuates a single moment.
    const p = ctx.params;
    const kind = pick(p, 'kind', ['sparks', 'shards', 'rings', 'dots'] as const, 'sparks');
    const n = kind === 'rings' ? Math.max(1, Math.min(4, Math.round(num(p, 'count', 3)))) : Math.max(3, Math.min(60, Math.round(num(p, 'count', 14))));
    const reach = Math.max(1, num(p, 'reach', 12));
    const c = color(p, 'color', '#ffd166');
    const cx = num(p, 'x', 50);
    const cy = num(p, 'y', 50);
    // The burst sits on the layer's box (not its animated element), so it stays put if the layer scales.
    const host = (ctx.el.parentElement ?? ctx.el) as HTMLElement;
    const key = `upw-burst-${ctx.clip.id}`;
    let field = host.querySelector<HTMLElement>(`:scope > [data-upw-own="${key}"]`);
    if (!field) {
      field = host.ownerDocument.createElement('div');
      field.dataset.upwOwn = key;
      field.className = 'upw-burst';
      field.setAttribute('aria-hidden', 'true');
      host.appendChild(field);
    }
    Object.assign(field.style, { position: 'absolute', left: `${cx}%`, top: `${cy}%`, width: '0', height: '0', overflow: 'visible', pointerEvents: 'none', zIndex: '3' });
    while (field.children.length > n) field.lastChild!.remove();
    while (field.children.length < n) field.appendChild(field.ownerDocument.createElement('i'));
    const bits = Array.from(field.children) as HTMLElement[];
    const seeds = bits.map((_, i) => ({
      angle: ((i + ctx.rand(i, 1) * 0.6) / n) * 360,
      speed: 0.55 + 0.45 * ctx.rand(i, 2),
      size: 0.6 + 0.8 * ctx.rand(i, 3),
      spin: (ctx.rand(i, 4) - 0.5) * 540,
    }));
    bits.forEach((b, i) => {
      const s = seeds[i].size;
      const base: Partial<CSSStyleDeclaration> = { position: 'absolute', left: '0', top: '0', opacity: '0', willChange: 'transform, opacity' };
      if (kind === 'sparks') Object.assign(b.style, base, { width: `${(reach * 0.18 * s).toFixed(2)}cqw`, height: `${(0.22 * s).toFixed(2)}cqw`, borderRadius: '99px', background: `linear-gradient(90deg, transparent, ${c} 40%, #fff)`, boxShadow: `0 0 0.6cqw ${alpha(c, 0.8)}` });
      else if (kind === 'shards') Object.assign(b.style, base, { width: `${(1.2 * s).toFixed(2)}cqw`, height: `${(1.2 * s).toFixed(2)}cqw`, background: c, clipPath: 'polygon(50% 0, 100% 100%, 0 70%)' });
      else if (kind === 'dots') Object.assign(b.style, base, { width: `${(0.7 * s).toFixed(2)}cqw`, height: `${(0.7 * s).toFixed(2)}cqw`, borderRadius: '50%', background: c, boxShadow: `0 0 0.5cqw ${alpha(c, 0.7)}` });
      else Object.assign(b.style, base, { width: '1cqw', height: '1cqw', borderRadius: '50%', border: `0.3cqw solid ${c}`, boxSizing: 'border-box' });
    });
    const render = (u: number) => {
      const live = u > 0 && u < 1;
      const travel = 1 - (1 - u) ** 3;
      const fade = live ? Math.min(1, u / 0.06) * (1 - u) ** 1.4 : 0;
      bits.forEach((b, i) => {
        const sd = seeds[i];
        if (!live) {
          b.style.opacity = '0';
          b.style.transform = '';
          if (kind === 'rings') { b.style.width = b.style.height = '1cqw'; b.style.borderWidth = ''; }
          return;
        }
        b.style.opacity = fade.toFixed(3);
        if (kind === 'rings') {
          const d = reach * 2 * travel * (0.6 + 0.4 * ((i + 1) / n)) * (1 - i * 0.12);
          b.style.width = b.style.height = `${Math.max(0.5, d).toFixed(2)}cqw`;
          b.style.borderWidth = `${(0.35 * (1 - u) + 0.05).toFixed(3)}cqw`;
          b.style.transform = 'translate(-50%, -50%)';
          return;
        }
        const r = reach * sd.speed * travel;
        const stretch = kind === 'sparks' ? Math.max(0.15, 1 - u) : 1;
        const spin = kind === 'shards' ? ` rotate(${(sd.spin * travel).toFixed(1)}deg)` : '';
        b.style.transform = `rotate(${sd.angle.toFixed(1)}deg) translateX(${r.toFixed(2)}cqw) translate(-50%, -50%) scaleX(${stretch.toFixed(3)})${spin}`;
      });
    };
    drive(ctx, render, { ease: false, always: true });
  },

  'text-carry'(ctx) {
    // The first word arrives from far and fast, each following one travels less, so the line lands with
    // momentum instead of an even stagger.
    const words = ctx.words.length ? ctx.words : [ctx.el];
    const p = ctx.params;
    const from = pick(p, 'from', ['right', 'left', 'bottom'] as const, 'right');
    const first = Math.max(0, num(p, 'distance', 18));
    const falloff = Math.max(0.05, Math.min(1, num(p, 'falloff', 0.35)));
    const n = words.length;
    const each = n > 1 ? Math.min(Math.max(0, num(p, 'stagger', 0.07)), (ctx.duration * 0.6) / (n - 1)) : 0;
    const itemDur = Math.max(0.05, ctx.duration - each * (n - 1));
    const e = easeOf(ctx);
    const sign = from === 'left' ? -1 : 1;
    const dist = words.map((_, i) => Math.max(0.3, first * falloff ** i));
    drive(ctx, (raw) => {
      const tt = raw * ctx.duration;
      words.forEach((w, i) => {
        const local = clamp01((tt - i * each) / itemDur);
        const off = dist[i] * (1 - e(local));
        w.style.translate = from === 'bottom' ? `0 ${off.toFixed(3)}cqw` : `${(sign * off).toFixed(3)}cqw 0`;
        w.style.opacity = clamp01(local * 4).toFixed(3);
      });
    }, { ease: false, always: true });
  },

  'stack-in'(ctx) {
    // A card dropping onto a pile: from slightly above and larger, settling with a small bounce.
    const out = isOut(ctx.params);
    const lift = num(ctx.params, 'lift', 35);
    const hidden = { yPercent: -lift, scale: 1.08, opacity: 0 };
    const shown = { yPercent: 0, scale: 1, opacity: 1 };
    const [a, b] = out ? [shown, { yPercent: -lift, scale: 1.04, opacity: 0 }] : [hidden, shown];
    ctx.tl.fromTo(ctx.el, a, { ...b, duration: ctx.duration, ease: ctx.ease, immediateRender: ctx.first }, ctx.at);
  },

  progress(ctx) {
    // A bar filling the shape from one value to another (the shape is the track).
    const p = ctx.params;
    const from = Math.max(0, Math.min(100, num(p, 'from', 0)));
    const to = Math.max(0, Math.min(100, num(p, 'to', 100)));
    const vertical = p.axis === 'y';
    ctx.el.style.position = 'relative';
    ctx.el.style.overflow = 'hidden';
    const bar = owned(ctx, 'upw-progress');
    Object.assign(bar.style, { position: 'absolute', left: '0', bottom: '0', borderRadius: 'inherit', pointerEvents: 'none', background: color(p, 'color', '#2ad38b') });
    if (vertical) { bar.style.width = '100%'; bar.style.top = ''; } else { bar.style.height = '100%'; bar.style.top = '0'; }
    drive(ctx, (e) => {
      const v = `${(from + (to - from) * e).toFixed(3)}%`;
      if (vertical) bar.style.height = v; else bar.style.width = v;
    }, { always: true });
  },

  march(ctx) {
    // Marching ants: the dashed outline's dashes travel round it, steadily, while something is working.
    const svg = ctx.el.querySelector<SVGElement>(':scope > .upw-dash');
    const shape = svg?.firstElementChild as SVGElement | null;
    if (!shape) return;
    const speed = num(ctx.params, 'speed', 2);
    drive(ctx, (raw) => {
      shape.style.strokeDashoffset = `${(-speed * raw * ctx.duration).toFixed(3)}cqw`;
    }, { ease: false });
  },

  'dash-solid'(ctx) {
    // The dashes grow until the gaps close: a dashed outline becomes a solid one ("ready").
    if (ctx.layer.type !== 'shape') return;
    const svg = ctx.el.querySelector<SVGElement>(':scope > .upw-dash');
    const shape = svg?.firstElementChild as SVGElement | null;
    if (!shape) return;
    const dash = ctx.layer.dash ?? 1;
    const gap = ctx.layer.dashGap ?? dash * 0.8;
    const out = isOut(ctx.params);
    drive(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      shape.style.strokeDasharray = v >= 1 ? 'none' : `${(dash + gap * v).toFixed(3)}cqw ${(gap * (1 - v)).toFixed(3)}cqw`;
    });
  },
};

/** The caret for Typewriter: a bar after the last letter shown, blinking when typing pauses. */
export function typewriterCaret(ctx: PresetContext, chars: HTMLElement[]) {
  if (!chars.length) return;
  const out = isOut(ctx.params);
  const n = chars.length;
  const each = ctx.duration / Math.max(1, n);
  ctx.el.style.position = 'relative';
  const caret = owned(ctx, 'upw-caret');
  Object.assign(caret.style, {
    position: 'absolute', width: '0.07em', height: '1.05em', background: 'currentColor', pointerEvents: 'none', opacity: '0',
  });
  drive(ctx, (raw) => {
    if (raw <= 0 || raw >= 1) { caret.style.opacity = '0'; caret.style.left = ''; caret.style.top = ''; return; }
    const tt = raw * ctx.duration;
    const typed = Math.floor(tt / each) + 1;
    const shown = out ? Math.max(0, n - typed) : Math.min(n, typed);
    const ref = shown > 0 ? chars[shown - 1] : chars[0];
    const box = offsetIn(ref, ctx.el);
    const x = shown > 0 ? box.x + box.w : box.x;
    const em = parseFloat(getComputedStyle(ctx.el).fontSize) || 16;
    caret.style.left = `${x.toFixed(2)}px`;
    caret.style.top = `${(box.y + (box.h - em * 1.05) / 2).toFixed(2)}px`;
    // Solid while keys are being pressed; blinking (twice a second) once the end of the text is reached.
    const done = out ? shown === 0 : shown === n;
    const blink = done ? Math.floor((tt - n * each) * 2.2) % 2 === 0 : true;
    caret.style.opacity = blink ? '1' : '0';
  }, { ease: false });
}

/** Light streak (a transition): an anamorphic flare sweeps the screen and hides the cut at its brightest. */
export function streakOverlay(stageEl: HTMLElement | null, key: string, c: string) {
  if (!stageEl) return null;
  let node = stageEl.querySelector<HTMLElement>(`:scope > [data-upw-own="${key}"]`);
  if (!node) {
    node = stageEl.ownerDocument.createElement('div');
    node.dataset.upwOwn = key;
    node.className = 'upw-tr-streak';
    node.setAttribute('aria-hidden', 'true');
    Object.assign(node.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '9000', opacity: '0', overflow: 'hidden', mixBlendMode: 'screen' });
    const wash = node.ownerDocument.createElement('i');
    const bar = node.ownerDocument.createElement('i');
    node.append(wash, bar);
    stageEl.appendChild(node);
  }
  const [wash, bar] = Array.from(node.children) as HTMLElement[];
  Object.assign(wash.style, { position: 'absolute', inset: '0', background: `radial-gradient(70% 22% at 50% 50%, ${alpha(c, 0.55)}, transparent 70%)` });
  Object.assign(bar.style, {
    position: 'absolute', left: '-60%', width: '220%', top: '50%', height: '1.2%', marginTop: '-0.6%', borderRadius: '50%',
    background: `linear-gradient(90deg, transparent 0%, ${alpha(c, 0.6)} 30%, #ffffff 50%, ${alpha(c, 0.6)} 70%, transparent 100%)`,
    filter: 'blur(1px)', boxShadow: `0 0 18px 6px ${alpha(c, 0.7)}`,
  });
  /** v: 0 = off, 1 = at its brightest; travel: -1 to 1 across the screen. */
  return (v: number, travel: number) => {
    node!.style.opacity = clamp01(v).toFixed(3);
    bar.style.transform = v > 0 ? `translateX(${(travel * 30).toFixed(2)}%) scaleY(${(0.6 + v * 1.4).toFixed(3)})` : '';
  };
}

/** Music-reactive: a loudness or bass curve (precomputed in the Studio) gently drives a glow, scale or brightness. */
export const REACT_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  react(ctx) {
    const p = ctx.params;
    const source = p.source === 'bass' ? 'bass' : 'loud';
    const effect = pick(p, 'effect', ['glow', 'scale', 'brightness', 'opacity'] as const, 'glow');
    const amount = Math.max(0, Math.min(1, num(p, 'amount', 0.6)));
    const c = color(p, 'color', '#2ad38b');
    const clipId = typeof p.audio === 'string' ? p.audio : '';
    const music = ctx.sceneAudio.find((a) => a.id === clipId && a.envelope) ?? ctx.sceneAudio.find((a) => a.role === 'music' && a.envelope) ?? ctx.sceneAudio.find((a) => a.envelope);
    const end = ctx.at + ctx.duration;
    const isText = ctx.layer.type === 'text';
    const clear = () => {
      if (effect === 'glow') { if (isText) ctx.el.style.textShadow = ''; else ctx.el.style.filter = ''; }
      else if (effect === 'scale') ctx.el.style.scale = '';
      else if (effect === 'brightness') ctx.el.style.filter = '';
      else ctx.el.style.opacity = '';
    };
    ctx.late(() => {
      const now = ctx.now();
      if (!music?.envelope || now < ctx.at || now > end) { clear(); return; }
      const env = music.envelope;
      const curve = env[source];
      // The curve at a scene moment (file time), averaged over a short window so it breathes, never strobes.
      const at = (t: number) => {
        const f = (t - music.start + (music.offset ?? 0)) * env.fps;
        const i = Math.floor(f), k = f - i;
        const a = curve[Math.max(0, Math.min(curve.length - 1, i))] ?? 0, b = curve[Math.max(0, Math.min(curve.length - 1, i + 1))] ?? 0;
        return a + (b - a) * k;
      };
      const s = ctx.sceneNow();
      const v = (at(s - 0.08) + at(s) * 2 + at(s + 0.04)) / 4;
      // Eased in and out at the clip's edges, so it never switches on with a jump.
      const edge = Math.min(1, (now - ctx.at) / 0.3, (end - now) / 0.3);
      const k = Math.max(0, Math.min(1, v * amount * edge));
      if (effect === 'glow') {
        if (isText) ctx.el.style.textShadow = `0 0 ${(0.4 + k * 1.6).toFixed(2)}cqw ${alpha(c, k)}, 0 0 ${(1 + k * 3).toFixed(2)}cqw ${alpha(c, k * 0.6)}`;
        else ctx.el.style.filter = `drop-shadow(0 0 ${(0.4 + k * 2).toFixed(2)}cqw ${alpha(c, k)})`;
      } else if (effect === 'scale') ctx.el.style.scale = (1 + k * 0.06).toFixed(4);
      else if (effect === 'brightness') ctx.el.style.filter = `brightness(${(1 + k * 0.35).toFixed(3)})`;
      else ctx.el.style.opacity = (1 - amount * 0.6 * (1 - v) * edge).toFixed(3);
    });
  },
};
