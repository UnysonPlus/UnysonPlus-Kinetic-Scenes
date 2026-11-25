import type { PresetContext } from './index';
import { clamp01, drive, easeOf, isOut, num, owned, pick } from './more';

/**
 * Effects from short-form video editing: text that drops, flies in, prints or rolls; emphasis (strike,
 * jiggle, ticks, orbits); and effects on footage and pictures (snap and digital zoom, colour grades and grade
 * wipes, projected film, a glass lens, a picture-in-picture portal, copies in grids and recursions, shattering
 * and a cut-out sticker outline). Every frame is a function of the clip's progress, so any moment can be
 * shown by seeking; footage copies are drawn from the playing video after every update.
 */

type Vars = Record<string, unknown>;
const color = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' && p[k] ? (p[k] as string) : d);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The picture or video inside a layer (footage and image layers). */
const mediaOf = (el: HTMLElement) => el.querySelector<HTMLVideoElement | HTMLImageElement>(':scope > video, :scope > img');

function bounceOut(t: number) {
  const n = 7.5625, d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}

/* ------------------------------------------------------------------ colour grades */

interface Grade { grayscale?: number; sepia?: number; saturate?: number; contrast?: number; brightness?: number; hue?: number; blur?: number }
/**
 * Where a mark beside or through words goes: on a text layer, the words' own box (shrunk to the words, keeping the
 * layer's alignment), so a tick sits next to a short centred line instead of at the far edge of a wide text box.
 */
function wordsHost(ctx: PresetContext): HTMLElement {
  if (ctx.layer.type !== 'text') return ctx.el;
  const words = ctx.el.querySelector<HTMLElement>('.upw-txt');
  if (!words) return ctx.el;
  const align = ctx.el.ownerDocument.defaultView?.getComputedStyle(words).textAlign ?? 'left';
  Object.assign(words.style, { width: 'fit-content', maxWidth: '100%', position: 'relative',
    marginLeft: align === 'center' || align === 'right' || align === 'end' ? 'auto' : '', marginRight: align === 'center' ? 'auto' : '' });
  return words;
}

export const LOOKS: Record<string, Grade> = {
  bw: { grayscale: 1, contrast: 1.12 },
  noir: { grayscale: 1, contrast: 1.5, brightness: 0.9 },
  warm: { sepia: 0.35, saturate: 1.3, hue: -10, brightness: 1.03 },
  cool: { saturate: 1.1, hue: 15, contrast: 1.05, brightness: 1.02 },
  film: { sepia: 0.25, contrast: 1.15, saturate: 0.85, brightness: 0.96 },
  vivid: { saturate: 1.6, contrast: 1.15 },
  faded: { contrast: 0.85, saturate: 0.7, brightness: 1.08 },
  teal: { saturate: 1.25, hue: -18, contrast: 1.1 },
};
const LOOK_IDS = Object.keys(LOOKS) as Array<keyof typeof LOOKS>;

/** False colour: each channel's value along the picture's brightness, dark to bright (an SVG table). */
const FALSE_COLOURS: Record<'thermal' | 'xray' | 'night-vision', [number[], number[], number[]]> = {
  // Cold black-purple, blue, magenta, red, orange, yellow, white hot.
  thermal: [[0.02, 0.18, 0.55, 0.9, 1, 1, 1], [0, 0.02, 0.05, 0.2, 0.55, 0.85, 1], [0.12, 0.45, 0.6, 0.25, 0.05, 0.2, 1]],
  // Inverted on blue: dense (dark) parts glow white-blue, empty parts fall to deep navy.
  xray: [[0.9, 0.62, 0.36, 0.16, 0.05, 0.01], [0.96, 0.78, 0.52, 0.27, 0.1, 0.03], [1, 0.92, 0.75, 0.5, 0.26, 0.1]],
  // Green phosphor: black to bright green, a little white in the highlights.
  'night-vision': [[0, 0.02, 0.08, 0.2, 0.55], [0.02, 0.25, 0.55, 0.85, 1], [0, 0.04, 0.12, 0.25, 0.55]],
};
let falseColourSeq = 0;
/** Numbers each stamp's ink filter (one per stamp, kept when the timeline is rebuilt). */
let stampSeq = 0;
/** A CSS filter for a look, part of the way there (0 = untouched, 1 = the full look). */
export function gradeFilter(look: string, k: number): string {
  const g = LOOKS[look] ?? LOOKS.bw;
  if (k <= 0.001) return '';
  const f: string[] = [];
  if (g.grayscale) f.push(`grayscale(${(g.grayscale * k).toFixed(3)})`);
  if (g.sepia) f.push(`sepia(${(g.sepia * k).toFixed(3)})`);
  if (g.saturate !== undefined) f.push(`saturate(${lerp(1, g.saturate, k).toFixed(3)})`);
  if (g.contrast !== undefined) f.push(`contrast(${lerp(1, g.contrast, k).toFixed(3)})`);
  if (g.brightness !== undefined) f.push(`brightness(${lerp(1, g.brightness, k).toFixed(3)})`);
  if (g.hue) f.push(`hue-rotate(${(g.hue * k).toFixed(2)}deg)`);
  return f.join(' ');
}

/* ------------------------------------------------------------------ drawing footage into a canvas */

/** Draws a picture or the current video frame into a rectangle, filled (cropped to cover it). */
function drawCover(g: CanvasRenderingContext2D, m: HTMLVideoElement | HTMLImageElement, x: number, y: number, w: number, h: number) {
  const iw = m instanceof HTMLVideoElement ? m.videoWidth : m.naturalWidth;
  const ih = m instanceof HTMLVideoElement ? m.videoHeight : m.naturalHeight;
  if (!iw || !ih || w <= 0 || h <= 0) return;
  const s = Math.max(w / iw, h / ih);
  const sw = w / s, sh = h / s;
  try { g.drawImage(m, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h); } catch { /* not decodable yet */ }
}

/** A canvas covering the layer, sized to it in device pixels; returns its 2D context, or null. */
function layerCanvas(ctx: PresetContext, cls: string, key = ctx.clip.id) {
  const c = owned(ctx, cls, key);
  let canvas = c.firstElementChild as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = ctx.el.ownerDocument.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    c.appendChild(canvas);
  }
  Object.assign(c.style, { position: 'absolute', inset: '0', pointerEvents: 'none', borderRadius: 'inherit', overflow: 'hidden' });
  const fit = () => {
    const r = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(ctx.el.clientWidth * r)), h = Math.max(1, Math.round(ctx.el.clientHeight * r));
    if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; }
    return { g: canvas!.getContext('2d'), w, h };
  };
  return { holder: c, fit };
}


/**
 * Several presets can grade or zoom the same picture at once (a grade under projected film, a snap zoom inside
 * a digital zoom): each sets its own part, and the parts are combined (filters in a row, zooms multiplied).
 */
const PARTS = new WeakMap<HTMLElement, { filter: Map<string, string>; scale: Map<string, number> }>();
function setPart(el: HTMLElement, kind: 'filter' | 'scale', id: string, value: string | number | null) {
  let p = PARTS.get(el);
  if (!p) { p = { filter: new Map(), scale: new Map() }; PARTS.set(el, p); }
  if (kind === 'filter') {
    if (value) p.filter.set(id, String(value)); else p.filter.delete(id);
    el.style.filter = [...p.filter.values()].join(' ');
  } else {
    if (typeof value === 'number' && Math.abs(value - 1) > 1e-4) p.scale.set(id, value); else p.scale.delete(id);
    const k = [...p.scale.values()].reduce((a, b) => a * b, 1);
    el.style.scale = Math.abs(k - 1) > 1e-4 ? k.toFixed(4) : '';
  }
}


/**
 * In and Out clips of one preset on one element take turns: at any moment the latest clip that has started
 * decides what is drawn (before the first one, the first one's start). Every clip's tween redraws from that
 * rule, so the result is the same whichever order the timeline renders them in (playing, or jumping about).
 */
interface Link { at: number; dur: number; ease: (t: number) => number; render: (p: number) => void }
const CHAINS = new WeakMap<HTMLElement, Map<string, Map<string, Link>>>();
function chain(ctx: PresetContext, render: (p: number) => void, opts: { ease?: boolean; el?: HTMLElement } = {}) {
  const el = opts.el ?? ctx.el;
  let byPreset = CHAINS.get(el);
  if (!byPreset) { byPreset = new Map(); CHAINS.set(el, byPreset); }
  let links = byPreset.get(ctx.clip.preset);
  if (!links) { links = new Map(); byPreset.set(ctx.clip.preset, links); }
  // Clips since removed from the layer drop out.
  const live = new Set(ctx.layer.clips.filter((c) => c.preset === ctx.clip.preset).map((c) => c.id));
  for (const id of [...links.keys()]) if (!live.has(id)) links.delete(id);
  const e = opts.ease === false ? (t: number) => t : easeOf(ctx);
  links.set(ctx.clip.id, { at: ctx.at, dur: Math.max(1e-4, ctx.duration), ease: e, render });
  const all = links;
  const apply = () => {
    const list = [...all.values()].sort((a, b) => a.at - b.at);
    if (!list.length) return;
    const now = ctx.now();
    let cur = list[0];
    for (const l of list) if (now >= l.at - 1e-6) cur = l;
    cur.render(cur.ease(clamp01((now - cur.at) / cur.dur)));
  };
  apply();
  const state = { p: 0 };
  ctx.tl.fromTo(state, { p: 0 }, { p: 1, duration: ctx.duration, ease: 'none', immediateRender: false, onUpdate: apply }, ctx.at);
}

/* ------------------------------------------------------------------ the presets */

export const VIDEO_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  'gravity-drop'(ctx) {
    // Letters (or words) fall from above one after another, bounce and settle; out, they drop away.
    const p = ctx.params;
    const units = (p.by === 'words' ? ctx.words : ctx.chars).length ? (p.by === 'words' ? ctx.words : ctx.chars) : [ctx.el];
    const out = isOut(p);
    const height = num(p, 'height', 3);
    const bouncy = p.bounce !== false;
    const n = units.length;
    const each = n > 1 ? Math.min(num(p, 'stagger', 0.05), (ctx.duration * 0.6) / (n - 1)) : 0;
    const itemDur = Math.max(0.05, ctx.duration - each * (n - 1));
    const tilt = units.map((_, i) => (ctx.rand(i) - 0.5) * 50);
    chain(ctx, (raw) => {
      const tt = raw * ctx.duration;
      units.forEach((u, i) => {
        const local = clamp01((tt - i * each) / itemDur);
        if (out) {
          const f = local * local;
          u.style.translate = `0 ${(f * height * 4).toFixed(3)}em`;
          u.style.rotate = `${(tilt[i] * 2 * f).toFixed(2)}deg`;
          u.style.opacity = (1 - clamp01((local - 0.6) / 0.4)).toFixed(3);
          return;
        }
        const e = bouncy ? bounceOut(local) : 1 - (1 - local) ** 3;
        u.style.translate = `0 ${(-height * (1 - e)).toFixed(3)}em`;
        u.style.rotate = `${(tilt[i] * (1 - Math.min(1, local * 1.6))).toFixed(2)}deg`;
        u.style.opacity = local > 0 ? '1' : '0';
      });
    }, { ease: false });
  },

  'strip-in'(ctx) {
    // A tilted strip (a headline, a sticker) flies in from the side and lands at its slant with a little
    // overshoot. Several, one after another, make a headline storm.
    const p = ctx.params;
    const out = isOut(p);
    const from = pick(p, 'from', ['left', 'right', 'top', 'bottom'] as const, 'right');
    const tilt = num(p, 'tilt', -6);
    const sx = from === 'left' ? -1 : from === 'right' ? 1 : 0;
    const sy = from === 'top' ? -1 : from === 'bottom' ? 1 : 0;
    const away = { xPercent: sx * 160, yPercent: sy * 260, rotation: tilt + (sx || sy) * 22, opacity: 1 };
    const home = { xPercent: 0, yPercent: 0, rotation: tilt, opacity: 1 };
    const [a, b] = out ? [home, { ...away, xPercent: -away.xPercent, yPercent: -away.yPercent }] : [away, home];
    ctx.tl.fromTo(ctx.el, a, { ...b, duration: ctx.duration, ease: ctx.ease, immediateRender: ctx.first }, ctx.at);
  },

  knockout(ctx) {
    // The words cut out of a solid block, so what is behind them (the footage) shows through the letters.
    if (ctx.layer.type !== 'text') return;
    const p = ctx.params;
    const out = isOut(p);
    const fill = color(p, 'fill', '#f4efe6');
    const pad = num(p, 'padding', 0.25);
    const layerEl = ctx.el.closest<HTMLElement>('.upw-layer') ?? ctx.el;
    const el = ctx.el;
    if (el.dataset.koColor === undefined) el.dataset.koColor = el.style.color;
    chain(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      if (v <= 0.001) {
        el.style.background = ''; el.style.padding = ''; el.style.clipPath = ''; el.style.color = el.dataset.koColor ?? '';
        layerEl.style.mixBlendMode = '';
        return;
      }
      // Screen: the block stays its colour, black letters let what is behind show.
      el.style.background = fill;
      el.style.color = '#000';
      el.style.padding = `${pad}em ${pad * 1.4}em`;
      el.style.clipPath = `inset(0 ${((1 - v) * 100).toFixed(2)}% 0 0)`;
      layerEl.style.mixBlendMode = 'screen';
    });
  },

  receipt(ctx) {
    // Prints out of a slot at the top of its box, in short jerky feeds, like a receipt.
    const p = ctx.params;
    const out = isOut(p);
    const steps = Math.max(2, Math.round(num(p, 'steps', 7)));
    chain(ctx, (raw) => {
      const r = out ? 1 - raw : raw;
      const k = r * steps;
      const whole = Math.floor(k);
      const frac = k - whole;
      // Each feed moves in its first 45% and rests for the rest.
      const q = clamp01((whole + Math.min(1, frac / 0.45)) / steps);
      if (q >= 0.999) { ctx.el.style.clipPath = ''; ctx.el.style.translate = ''; return; }
      ctx.el.style.clipPath = `inset(${((1 - q) * 100).toFixed(2)}% 0 0 0)`;
      ctx.el.style.translate = `0 ${(-(1 - q) * 100).toFixed(2)}%`;
      ctx.el.style.rotate = `${((1 - q) * (ctx.rand(whole) - 0.5) * 1.2).toFixed(2)}deg`;
    }, { ease: false });
  },

  odometer(ctx) {
    // The number rolls into place like a car's odometer: each digit turns, and a digit only moves on when the
    // one to its right passes 9.
    const chars = ctx.chars;
    if (!chars.length) return;
    const originals = chars.map((c) => c.dataset.ch ?? c.textContent ?? '');
    const slots = originals.map((ch, i) => (/\d/.test(ch) ? i : -1)).filter((i) => i >= 0);
    if (!slots.length) return;
    const target = Number(slots.map((i) => originals[i]).join(''));
    const from = num(ctx.params, 'from', 0);
    const reels = slots.map((i) => {
      const c = chars[i];
      if (!c.querySelector('.upw-reel')) {
        c.textContent = '';
        const reel = ctx.el.ownerDocument.createElement('span');
        reel.className = 'upw-reel';
        reel.style.cssText = 'display:block;line-height:1em';
        reel.innerHTML = '0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0';
        c.appendChild(reel);
        Object.assign(c.style, { display: 'inline-block', height: '1em', lineHeight: '1em', overflow: 'hidden', verticalAlign: 'top' });
      }
      return c.querySelector<HTMLElement>('.upw-reel')!;
    });
    drive(ctx, (e) => {
      const v = Math.max(0, lerp(from, target, e >= 1 ? 1 : e));
      reels.forEach((reel, k) => {
        const place = slots.length - 1 - k;
        const unit = 10 ** place;
        const below = v % unit;
        const roll = place === 0 ? v % 1 : clamp01(below - (unit - 1));
        const pos = (Math.floor(v / unit) % 10) + roll;
        reel.style.transform = `translateY(${(-pos).toFixed(4)}em)`;
      });
    }, { always: true });
  },

  timecode(ctx) {
    // A running timecode (00:00:00:00, hours to frames) in the text, counting while the clip plays.
    const chars = ctx.chars;
    const joined = chars.map((c) => c.dataset.ch ?? c.textContent ?? '').join('');
    const m = /\d\d:\d\d:\d\d(?::\d\d)?/.exec(joined);
    if (!m) return;
    const start = num(ctx.params, 'from', 0);
    const fps = Math.max(1, Math.round(num(ctx.params, 'fps', 24)));
    const withFrames = m[0].length > 8;
    drive(ctx, (raw) => {
      const s = start + raw * ctx.duration;
      const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
      const txt = `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}${withFrames ? `:${pad((s % 1) * fps)}` : ''}`;
      for (let k = 0; k < txt.length; k++) chars[m.index + k].textContent = txt[k];
    }, { ease: false, always: true });
  },

  strike(ctx) {
    // A line drawn through it; then (optionally) it falls away, crossed out.
    //
    // The line is LEVEL by default, and any tilt turns about its MIDDLE. Until 0.1.78 it defaulted to -8°
    // turned about its left end, which raised the far end by the line's whole width times tan(8°): on a
    // wide line that is most of a line-height above the words it is supposed to cross, and every strike
    // in every scene came out sloped whether or not anyone asked for one.
    //
    // Two elements, because the draw and the tilt want different origins: the outer carries the tilt from
    // the centre, the inner is scaled across from the left so the line still draws the way a pen would.
    const p = ctx.params;
    const out = isOut(p);
    const fall = p.fall !== false;
    const thick = num(p, 'thickness', 0.6);
    ctx.el.style.position = ctx.el.style.position || 'relative';
    const host = wordsHost(ctx);
    const bar = owned({ ...ctx, el: host }, 'upw-strike', 'shared');
    Object.assign(bar.style, {
      position: 'absolute', left: '-6%', width: '112%', top: '50%', height: `${thick}cqw`, marginTop: `-${thick / 2}cqw`,
      transformOrigin: '50% 50%', rotate: `${num(p, 'angle', 0)}deg`, pointerEvents: 'none', zIndex: '2',
      background: 'none',
    });
    let ink = bar.firstElementChild as HTMLElement | null;
    if (!ink) {
      ink = bar.ownerDocument.createElement('div');
      ink.setAttribute('aria-hidden', 'true');
      bar.appendChild(ink);
    }
    Object.assign(ink.style, {
      width: '100%', height: '100%', background: color(p, 'color', '#ff3b47'),
      borderRadius: '99px', transformOrigin: '0 50%',
    });
    chain(ctx, (raw) => {
      const r = out ? 1 - raw : raw;
      const draw = clamp01(r / (fall ? 0.4 : 1));
      ink.style.transform = `scaleX(${(1 - (1 - draw) ** 3).toFixed(4)})`;
      bar.style.opacity = r > 0 ? '1' : '0';
      if (!fall) return;
      const f = clamp01((r - 0.5) / 0.5);
      ctx.el.style.translate = f > 0 ? `0 ${(f * f * 40).toFixed(2)}%` : '';
      ctx.el.style.rotate = f > 0 ? `${(f * f * 14).toFixed(2)}deg` : '';
      ctx.el.style.opacity = f > 0 ? (1 - f).toFixed(3) : '';
    }, { ease: false });
  },

  stamp(ctx) {
    // A rubber stamp slams down on it ("APPROVED", "REJECTED", "SOLD OUT"): big and faint above, down hard with
    // a little squash, the layer jolts under it, and the ink spreads a touch. The impact comes early (a fifth of
    // the clip) so it lands on the Rubber stamp sound, which plays at the clip's start. Out lifts it off.
    // The stamp's rough edge and worn ink are an SVG filter (noise that bends the outline and eats a few
    // specks), seeded per clip so every stamp wears differently but the same on every frame.
    const p = ctx.params;
    const out = isOut(p);
    const ink = color(p, 'color', '#d92d3a');
    const size = num(p, 'size', 5);
    const angle = num(p, 'angle', -12);
    const text = String(p.text ?? 'APPROVED').trim().slice(0, 40) || 'APPROVED';
    const st = owned(ctx, 'upw-stamp', 'shared');
    Object.assign(st.style, { position: 'absolute', inset: '0', display: 'grid', placeItems: 'center', pointerEvents: 'none', zIndex: '3' });
    let mark = st.querySelector<HTMLElement>(':scope > span');
    if (!mark) {
      const id = `upw-stamp-ink-${++stampSeq}`;
      const s1 = Math.floor(ctx.rand(1) * 900) + 1, s2 = Math.floor(ctx.rand(2) * 900) + 1;
      st.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${id}" x="-15%" y="-25%" width="130%" height="150%">`
        + `<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="${s1}" result="edge"/>`
        + `<feDisplacementMap in="SourceGraphic" in2="edge" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="rough"/>`
        + `<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" seed="${s2}" result="wear"/>`
        + `<feColorMatrix in="wear" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 6.6" result="keep"/>`
        + `<feComposite in="rough" in2="keep" operator="in"/></filter></svg><span></span>`;
      mark = st.querySelector<HTMLElement>(':scope > span')!;
      mark.dataset.filter = id;
    }
    mark.textContent = text;
    Object.assign(mark.style, {
      display: 'inline-block', padding: '.22em .55em .16em', border: '.13em solid currentColor', borderRadius: '.14em',
      outline: '.045em solid currentColor', outlineOffset: '-.3em', color: ink,
      font: `900 ${size}cqw/1 "Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif`, letterSpacing: '.07em',
      textTransform: 'uppercase', whiteSpace: 'nowrap', filter: `url(#${mark.dataset.filter})`, willChange: 'transform, opacity',
    });
    const HIT = 0.22;
    chain(ctx, (raw) => {
      let scale = 1, alpha = 0.92, spread = 0, jolt = 0;
      if (out) {
        scale = 1 + 0.35 * raw;
        alpha = 0.92 * (1 - raw);
      } else if (raw < HIT) {
        const k = raw / HIT;
        scale = lerp(2.4, 1, k * k);
        alpha = raw > 0 ? 0.92 * Math.min(1, 0.25 + k) : 0;
      } else {
        const u = (raw - HIT) / (1 - HIT);
        // The squash on impact, then settled.
        scale = 1 - 0.07 * Math.sin(Math.min(1, u / 0.2) * Math.PI);
        spread = Math.min(1, u / 0.6);
        const s = u / 0.45;
        jolt = s < 1 ? (1 - s) * Math.sin(s * Math.PI * 5) : 0;
      }
      mark!.style.opacity = alpha.toFixed(3);
      mark!.style.transform = `rotate(${angle}deg) scale(${scale.toFixed(4)})`;
      mark!.style.textShadow = spread > 0 ? `0 0 ${(0.015 * spread).toFixed(3)}em ${ink}` : '';
      ctx.el.style.translate = jolt ? `${(jolt * 0.35).toFixed(3)}cqw ${(jolt * 0.5).toFixed(3)}cqw` : '';
    }, { ease: false });
  },

  'tape-label'(ctx) {
    // A strip of tape with a short line on it, slapped on at a slant, as on a moving box or a chest: it comes in
    // a little too big and lifted, presses flat with a small overshoot, and the out clip peels it off from one
    // end. The torn ends are a zigzag drawn from the clip's own random numbers, so every strip tears differently
    // and the same on every frame.
    const p = ctx.params;
    const out = isOut(p);
    const tape = color(p, 'color', '#efd88f');
    const ink = color(p, 'ink', '#1c1e22');
    const size = num(p, 'size', 3.2);
    const angle = num(p, 'angle', -6);
    const place = pick(p, 'place', ['center', 'top', 'bottom'] as const, 'center');
    const text = String(p.text ?? 'FRAGILE').trim().slice(0, 60) || 'FRAGILE';
    const host = owned(ctx, 'upw-tape', 'shared');
    Object.assign(host.style, {
      position: 'absolute', inset: '0', display: 'grid', placeItems: place === 'top' ? 'start center' : place === 'bottom' ? 'end center' : 'center',
      pointerEvents: 'none', zIndex: '3',
    });
    let strip = host.querySelector<HTMLElement>(':scope > span');
    if (!strip) {
      strip = ctx.el.ownerDocument.createElement('span');
      host.appendChild(strip);
      // Torn ends: a few teeth down each short side.
      const teeth = 7;
      const left: string[] = [], right: string[] = [];
      for (let i = 0; i <= teeth; i++) {
        const y = (i / teeth) * 100;
        left.push(`${(ctx.rand(10 + i) * 2.2).toFixed(2)}% ${y.toFixed(1)}%`);
        right.push(`${(100 - ctx.rand(40 + i) * 2.2).toFixed(2)}% ${(100 - y).toFixed(1)}%`);
      }
      strip.style.clipPath = `polygon(${left.join(',')},${right.join(',')})`;
    }
    strip.textContent = text;
    Object.assign(strip.style, {
      display: 'inline-block', padding: '.42em 1.3em .36em', margin: place === 'center' ? '0' : '.4em 0',
      background: `linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0) 35%, rgba(0,0,0,.06)), ${tape}`,
      color: ink, font: `700 ${size}cqw/1.05 "Marker Felt", "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive`,
      letterSpacing: '.03em', whiteSpace: 'nowrap', boxShadow: '0 .25cqw .6cqw rgba(0,0,0,.22)', opacity: '0.96',
      transformOrigin: out ? '0% 50%' : '50% 50%', willChange: 'transform, opacity',
    });
    chain(ctx, (raw) => {
      let scale = 1, alpha = 0.96, tilt = angle, lift = 0, peel = 0;
      if (out) {
        // Peeled off from the left end: it lifts, curls up a little and slides away.
        const e = raw * raw;
        peel = e;
        tilt = angle - 22 * e;
        lift = -6 * e;
        alpha = 0.96 * (1 - Math.max(0, (raw - 0.55) / 0.45));
      } else {
        const k = clamp01(raw / 0.3);
        const s = 1 - (1 - k) ** 3;
        scale = lerp(1.18, 1, s) - 0.035 * Math.sin(clamp01((raw - 0.3) / 0.25) * Math.PI);
        tilt = angle + (1 - s) * 5;
        lift = (1 - s) * -1.2;
        alpha = raw > 0 ? 0.96 * Math.min(1, 0.2 + k * 1.2) : 0;
      }
      strip!.style.opacity = alpha.toFixed(3);
      strip!.style.transform = `translate(${(peel * 3).toFixed(2)}cqw, ${lift.toFixed(3)}cqw) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      strip!.style.boxShadow = `0 ${(0.25 + (1 - scale) * -2 + peel * 1.2).toFixed(3)}cqw ${(0.6 + peel * 1.5).toFixed(2)}cqw rgba(0,0,0,${(0.22 + peel * 0.08).toFixed(3)})`;
    }, { ease: false });
  },

  'split-push'(ctx) {
    // A headline card, a screenshot or a B-roll clip slides down from the top and pushes the speaker into the
    // lower half of the frame; the out clip slides it back up and gives the frame back. Put this layer's box over
    // the top half. The speaker is the footage layer named in "Pushes", or else the biggest other footage layer
    // in the scene. Its picture (not its box, so its own presets and the camera are left alone) moves down a
    // quarter and is cut to its middle band, the part where a face usually is, so the face lands in the lower
    // half instead of being squashed.
    const p = ctx.params;
    const out = isOut(p);
    const want = typeof p.push === 'string' ? p.push.trim() : '';
    const share = clamp01(num(p, 'share', 50) / 100);
    const shift = share / 2;
    let speaker: HTMLElement | null = null;
    const findSpeaker = () => {
      if (speaker?.isConnected) return speaker;
      const stage = ctx.el.closest('.upw-stage') ?? ctx.el.ownerDocument;
      const own = ctx.el.closest<HTMLElement>('.upw-layer');
      let pickEl: HTMLElement | null = null;
      if (want) pickEl = stage.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(want)}"]`);
      if (!pickEl) {
        let best = 0;
        stage.querySelectorAll<HTMLElement>('.upw-layer.upw-video').forEach((l) => {
          if (l === own) return;
          const r = l.getBoundingClientRect(), a = r.width * r.height;
          if (a > best) { best = a; pickEl = l; }
        });
      }
      const media = pickEl ? (pickEl as HTMLElement).querySelector<HTMLElement>('.upw-li > video, .upw-li > img') : null;
      speaker = media;
      return media;
    };
    chain(ctx, (k0) => {
      const k = out ? 1 - k0 : k0;
      // Exactly its own height: its bottom edge then meets the speaker's top edge all the way (no gap opens).
      ctx.el.style.translate = k < 1 ? `0 ${(-(1 - k) * 100).toFixed(3)}%` : '';
      const m = findSpeaker();
      if (!m) return;
      if (k <= 0) { m.style.translate = ''; m.style.clipPath = ''; return; }
      const d = (k * shift * 100).toFixed(3);
      m.style.translate = `0 ${d}%`;
      m.style.clipPath = `inset(${d}% 0 ${d}% 0)`;
    });
  },

  'lock-on'(ctx) {
    // Corner brackets snap onto the speaker's face and track it while the clip runs, with a small label above,
    // and the picture pushes in gently towards the face (the camera following). It reads the footage's own face
    // path (Follow the face, found by the AI Dev Kit); without one it locks onto the middle of the frame.
    // Everything is measured from the video's laid-out size (offsetWidth), not its on-screen rectangle, so the
    // push-in it applies itself never feeds back into where the brackets go.
    const p = ctx.params;
    const ink = color(p, 'color', '#2ad38b');
    const label = typeof p.text === 'string' ? p.text.trim().slice(0, 40) : '';
    const zoom = clamp01(num(p, 'zoom', 12) / 100);
    const pad = num(p, 'pad', 0.25);
    const video = ctx.el.querySelector<HTMLVideoElement>(':scope > video');
    const host = ctx.el.closest<HTMLElement & { upwTrack?: Array<{ t: number; x: number; y: number; w: number; h: number }> }>('.upw-layer');
    const box = owned(ctx, 'upw-lock');
    if (!box.firstElementChild) {
      box.innerHTML = '<i data-c="tl"></i><i data-c="tr"></i><i data-c="bl"></i><i data-c="br"></i><b></b>';
    }
    Object.assign(box.style, { position: 'absolute', left: '0', top: '0', width: '0', height: '0', pointerEvents: 'none', zIndex: '4', opacity: '0' });
    box.querySelectorAll<HTMLElement>(':scope > i').forEach((c) => {
      const t = c.dataset.c!;
      Object.assign(c.style, {
        position: 'absolute', width: '24%', height: '24%', borderColor: ink, borderStyle: 'solid', borderWidth: '0',
        filter: `drop-shadow(0 0 .35cqw ${ink})`,
        [t[0] === 't' ? 'top' : 'bottom']: '0', [t[1] === 'l' ? 'left' : 'right']: '0',
        [t[0] === 't' ? 'borderTopWidth' : 'borderBottomWidth']: '.42cqw', [t[1] === 'l' ? 'borderLeftWidth' : 'borderRightWidth']: '.42cqw',
      });
    });
    const tag = box.querySelector<HTMLElement>(':scope > b')!;
    tag.textContent = label;
    Object.assign(tag.style, {
      display: label ? 'block' : 'none', position: 'absolute', left: '0', bottom: '100%', marginBottom: '.8cqw', padding: '.25em .6em',
      background: ink, color: '#0a0d11', font: '700 1.5cqw/1.1 ui-monospace, "SFMono-Regular", Consolas, monospace', letterSpacing: '.08em',
      textTransform: 'uppercase', whiteSpace: 'nowrap', borderRadius: '.2em',
    });
    // The push-in must not spill out of the layer's own frame (a picture-in-picture speaker).
    if (zoom > 0) ctx.el.style.overflow = 'hidden';
    let k = 0, snap = 0, fade = 1;
    const place = () => {
      if (k <= 0 || !video) {
        box.style.opacity = '0';
        if (video) { video.style.scale = ''; video.style.transformOrigin = ''; }
        return;
      }
      const W = video.offsetWidth, H = video.offsetHeight;
      if (!W || !H) return;
      // The face at the video's current moment, as fractions of the frame (or the middle when none was found).
      let fx = 0.5, fy = 0.42, fw = 0.3, fh = 0.36;
      const track = host?.upwTrack;
      if (track?.length) {
        // The file's moment from the timeline, as the player syncs footage (reading video.currentTime here would
        // give the previous frame: the footage is synced after the presets have drawn).
        const L = ctx.layer as { start?: number; offset?: number; rate?: number };
        const t = (L.offset ?? 0) + Math.max(0, ctx.now() - (L.start ?? 0)) * (L.rate ?? 1);
        let i = track.findIndex((q) => q.t > t);
        if (i < 0) i = track.length;
        const a = track[Math.max(0, i - 1)], b = track[Math.min(track.length - 1, i)];
        const f = b.t > a.t ? clamp01((t - a.t) / (b.t - a.t)) : 0;
        fx = lerp(a.x, b.x, f); fy = lerp(a.y, b.y, f); fw = lerp(a.w, b.w, f); fh = lerp(a.h, b.h, f);
      }
      // Where that is in the layer: the video fills (or fits) its box.
      const vw = video.videoWidth || W, vh = video.videoHeight || H;
      const cover = getComputedStyle(video).objectFit !== 'contain';
      const s = cover ? Math.max(W / vw, H / vh) : Math.min(W / vw, H / vh);
      const ox = video.offsetLeft + (W - vw * s) / 2, oy = video.offsetTop + (H - vh * s) / 2;
      const cx = ox + fx * vw * s, cy = oy + fy * vh * s;
      // The push-in, about the face: the face stays where it is and grows by Z.
      const Z = 1 + zoom * k;
      video.style.transformOrigin = `${(((cx - video.offsetLeft) / W) * 100).toFixed(2)}% ${(((cy - video.offsetTop) / H) * 100).toFixed(2)}%`;
      video.style.scale = Z.toFixed(4);
      // The brackets: the face plus a margin, larger while snapping in.
      const grow = 1 + 0.7 * (1 - snap);
      const bw = fw * vw * s * (1 + pad) * Z * grow, bh = fh * vh * s * (1 + pad) * Z * grow;
      Object.assign(box.style, {
        left: `${(cx - bw / 2).toFixed(1)}px`, top: `${(cy - bh / 2).toFixed(1)}px`, width: `${bw.toFixed(1)}px`, height: `${bh.toFixed(1)}px`,
        opacity: (Math.min(1, snap * 1.6) * fade).toFixed(3),
      });
    };
    ctx.late(place);
    drive(ctx, (raw) => {
      const t = raw * ctx.duration;
      const inside = raw > 0 && raw < 1;
      // Snap in over a third of a second with a small overshoot; the push-in eases in over the clip.
      const u = clamp01(t / 0.35);
      snap = inside ? 1 - (1 - u) ** 3 * Math.cos(u * Math.PI * 1.5) : 0;
      fade = inside ? clamp01((ctx.duration - t) / 0.25) : 0;
      k = inside ? (1 - (1 - clamp01(t / Math.max(0.5, ctx.duration * 0.6))) ** 2) * fade : 0;
      if (!inside) k = 0;
      place();
    }, { ease: false, always: true });
  },

  jiggle(ctx) {
    // The phone home-screen wobble: a quick, slight back-and-forth tilt (before a delete, or "edit me").
    const amp = num(ctx.params, 'angle', 2.5);
    const rate = num(ctx.params, 'speed', 7);
    const phase = ctx.rand(1) * Math.PI * 2;
    drive(ctx, (raw) => {
      const t = raw * ctx.duration;
      const env = Math.min(1, t / 0.12, (ctx.duration - t) / 0.12);
      ctx.el.style.rotate = raw > 0 && raw < 1 ? `${(Math.sin(t * rate * Math.PI * 2 + phase) * amp * Math.max(0, env)).toFixed(3)}deg` : '';
    }, { ease: false });
  },

  'orbit-flat'(ctx) {
    // Circles round its own place on a tilted ring, smaller and dimmer on the far side (icons round a head).
    const p = ctx.params;
    const r = num(p, 'radius', 12);
    const squash = num(p, 'tilt', 0.35);
    const turns = num(p, 'turns', 1);
    const start = (num(p, 'start', 0) / 360) * Math.PI * 2;
    drive(ctx, (e) => {
      const a = start + e * turns * Math.PI * 2;
      const depth = Math.sin(a);
      ctx.el.style.translate = `${(Math.cos(a) * r).toFixed(3)}cqw ${(depth * r * squash).toFixed(3)}cqw`;
      ctx.el.style.scale = (0.82 + 0.18 * (depth + 1) / 2).toFixed(4);
      ctx.el.style.opacity = (0.55 + 0.45 * (depth + 1) / 2).toFixed(3);
    }, { always: true });
  },

  tick(ctx) {
    // A tick drawn in a circle beside it: a checklist item done.
    const p = ctx.params;
    const out = isOut(p);
    const side = pick(p, 'side', ['left', 'right'] as const, 'left');
    const c = color(p, 'color', '#2ad38b');
    ctx.el.style.position = ctx.el.style.position || 'relative';
    const box = owned({ ...ctx, el: wordsHost(ctx) }, 'upw-tick', 'shared');
    if (!box.firstChild) {
      box.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;overflow:visible"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M6.5 12.5l3.6 3.6 7.4-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`;
    }
    Object.assign(box.style, { position: 'absolute', top: '50%', width: '1.1em', height: '1.1em', marginTop: '-0.55em', color: c, pointerEvents: 'none', [side === 'left' ? 'right' : 'left']: 'calc(100% + 0.35em)', [side === 'left' ? 'left' : 'right']: '' });
    const path = box.querySelector('path') as SVGPathElement;
    chain(ctx, (raw) => {
      const r = out ? 1 - raw : raw;
      const pop = clamp01(r / 0.4);
      box.style.transform = `scale(${(pop < 1 ? 1.2 * (1 - (1 - pop) ** 3) : 1).toFixed(4)})`;
      box.style.opacity = r > 0 ? '1' : '0';
      path.style.strokeDashoffset = (1 - clamp01((r - 0.3) / 0.7)).toFixed(4);
    }, { ease: false });
  },

  'snap-zoom'(ctx) {
    // A sharp punch-in on a point of the picture (a face, a word), then held; out, it snaps back.
    const p = ctx.params;
    const out = isOut(p);
    const z = num(p, 'zoom', 1.35);
    const target = mediaOf(ctx.el) ?? ctx.el;
    target.style.transformOrigin = `${num(p, 'x', 50)}% ${num(p, 'y', 40)}%`;
    const [a, b] = out ? [z, 1] : [1, z];
    chain(ctx, (e) => setPart(target, 'scale', ctx.clip.preset, lerp(a, b, e)));
  },

  'digital-zoom'(ctx) {
    // A camera's digital zoom: the picture blurs and steps in, inside a recording frame (corners, REC, the zoom).
    const p = ctx.params;
    const out = isOut(p);
    const z = num(p, 'zoom', 2);
    const media = mediaOf(ctx.el) ?? ctx.el;
    media.style.transformOrigin = `${num(p, 'x', 50)}% ${num(p, 'y', 40)}%`;
    const hud = owned(ctx, 'upw-hud', 'shared');
    if (!hud.firstChild) {
      const corner = (pos: string) => `<i style="position:absolute;${pos};width:9%;aspect-ratio:1;border:0.5cqw solid #fff;opacity:.9"></i>`;
      hud.innerHTML = corner('left:5%;top:5%;border-right:0;border-bottom:0') + corner('right:5%;top:5%;border-left:0;border-bottom:0')
        + corner('left:5%;bottom:5%;border-right:0;border-top:0') + corner('right:5%;bottom:5%;border-left:0;border-top:0')
        + '<b style="position:absolute;left:8%;top:7.5%;display:flex;gap:.4em;align-items:center;font:700 3.2cqw/1 system-ui,sans-serif;color:#fff"><span style="width:.7em;height:.7em;border-radius:50%;background:#ff3040"></span>REC</b>'
        + '<b class="upw-hud-z" style="position:absolute;left:50%;bottom:8%;transform:translateX(-50%);font:700 3.6cqw/1 ui-monospace,monospace;color:#fff;background:rgba(0,0,0,.35);padding:.25em .5em;border-radius:.3em"></b>';
    }
    Object.assign(hud.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
    const readout = hud.querySelector<HTMLElement>('.upw-hud-z')!;
    chain(ctx, (e) => {
      const v = out ? 1 - e : e;
      const k = lerp(1, z, v);
      setPart(media, 'scale', ctx.clip.preset, k);
      // The focus hunts: a blur that peaks early in the move.
      setPart(media, 'filter', ctx.clip.preset, v > 0 && v < 1 ? `blur(${(Math.sin(Math.min(1, v * 1.4) * Math.PI) * 0.9).toFixed(2)}cqw)` : null);
      hud.style.opacity = v > 0 ? '1' : '0';
      readout.textContent = `${k.toFixed(1)}×`;
    });
  },

  grade(ctx) {
    // A colour grade fading in (black and white, warm, cool, film…), on the picture only (not text over it).
    const p = ctx.params;
    const out = isOut(p);
    const look = pick(p, 'look', LOOK_IDS as readonly string[], 'bw');
    const target = mediaOf(ctx.el) ?? ctx.el;
    chain(ctx, (e) => setPart(target, 'filter', ctx.clip.preset, gradeFilter(look, out ? 1 - e : e)));
  },

  'false-colour'(ctx) {
    // Brightness mapped to a colour scale: a thermal camera (cold purple to white hot), an X-ray (bright where the
    // picture is dark, on blue) or night vision (green phosphor). An SVG filter whose tables are blended from "no
    // change" to the full look as the clip eases in, so it fades in like a grade.
    const p = ctx.params;
    const out = isOut(p);
    const look = pick(p, 'look', ['thermal', 'xray', 'night-vision'] as const, 'thermal');
    const target = mediaOf(ctx.el) ?? ctx.el;
    const T = FALSE_COLOURS[look];
    const holder = owned(ctx, 'upw-fcolour');
    const id = holder.dataset.fid || (holder.dataset.fid = `upw-fc-${++falseColourSeq}`);
    if (!holder.firstChild) {
      holder.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${id}" color-interpolation-filters="sRGB">`
        + '<feColorMatrix type="matrix"/><feComponentTransfer><feFuncR type="table"/><feFuncG type="table"/><feFuncB type="table"/></feComponentTransfer></filter></svg>';
    }
    Object.assign(holder.style, { position: 'absolute', width: '0', height: '0', overflow: 'hidden', pointerEvents: 'none' });
    const matrix = holder.querySelector('feColorMatrix')!;
    const funcs = Array.from(holder.querySelectorAll('feFuncR, feFuncG, feFuncB'));
    // Luminance into every channel (k = 1), or the picture as it is (k = 0).
    const LUM = [0.2126, 0.7152, 0.0722];
    let last = -1;
    chain(ctx, (e) => {
      const k = clamp01(out ? 1 - e : e);
      if (Math.abs(k - last) < 1e-4) return;
      last = k;
      if (k <= 0.001) { setPart(target, 'filter', ctx.clip.preset, null); return; }
      const rows: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) rows.push((r === c ? 1 - k : 0) + LUM[c] * k);
        rows.push(0, 0);
      }
      rows.push(0, 0, 0, 1, 0);
      matrix.setAttribute('values', rows.map((v) => v.toFixed(4)).join(' '));
      funcs.forEach((f, ch) => {
        const tab = T[ch];
        f.setAttribute('tableValues', tab.map((v, i) => ((i / (tab.length - 1)) * (1 - k) + v * k).toFixed(4)).join(' '));
      });
      setPart(target, 'filter', ctx.clip.preset, `url(#${id})`);
    });
  },

  'grade-wipe'(ctx) {
    // The grade sweeps across behind a line with a handle: before on one side, after on the other (a grade
    // slider, an eyedropper grade, a mood curtain coming down).
    const p = ctx.params;
    const look = pick(p, 'look', LOOK_IDS as readonly string[], 'warm');
    const axis = pick(p, 'axis', ['x', 'y'] as const, 'x');
    const labels = p.labels !== false;
    const out = isOut(p);
    const wipe = owned(ctx, 'upw-gwipe', 'shared');
    const filter = gradeFilter(look, 1);
    Object.assign(wipe.style, { position: 'absolute', left: '0', top: '0', pointerEvents: 'none', backdropFilter: filter, overflow: 'visible' });
    wipe.style.setProperty('-webkit-backdrop-filter', filter);
    const line = owned(ctx, 'upw-gline', 'shared');
    if (!line.firstChild) {
      line.innerHTML = '<span class="h" style="position:absolute;left:50%;top:50%;width:5cqw;height:5cqw;margin:-2.5cqw;border-radius:50%;background:#fff;color:#111;display:grid;place-items:center;font:700 2.6cqw/1 system-ui,sans-serif;box-shadow:0 .4cqw 1.2cqw rgba(0,0,0,.35)">‹›</span>'
        + (labels ? '<span class="b" style="position:absolute;top:50%;right:4cqw;transform:translateY(-50%);font:800 2.2cqw/1 system-ui,sans-serif;letter-spacing:.12em;color:#fff;background:rgba(0,0,0,.45);padding:.4em .6em;border-radius:.3em">AFTER</span><span class="a" style="position:absolute;top:50%;left:4cqw;transform:translateY(-50%);font:800 2.2cqw/1 system-ui,sans-serif;letter-spacing:.12em;color:#fff;background:rgba(0,0,0,.45);padding:.4em .6em;border-radius:.3em">BEFORE</span>' : '');
    }
    Object.assign(line.style, { position: 'absolute', background: '#fff', pointerEvents: 'none', boxShadow: '0 0 1cqw rgba(0,0,0,.35)' });
    chain(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      const pct = `${(v * 100).toFixed(2)}%`;
      if (axis === 'x') {
        Object.assign(wipe.style, { width: pct, height: '100%' });
        Object.assign(line.style, { left: pct, top: '0', width: '0.35cqw', height: '100%', marginLeft: '-0.17cqw', marginTop: '' });
      } else {
        Object.assign(wipe.style, { width: '100%', height: pct });
        Object.assign(line.style, { top: pct, left: '0', height: '0.35cqw', width: '100%', marginTop: '-0.17cqw', marginLeft: '' });
      }
      // The line is shown while it moves; at the end the grade stays on its own.
      line.style.opacity = v > 0 && v < 1 ? '1' : '0';
      wipe.style.opacity = v > 0 ? '1' : '0';
    });
  },

  film(ctx) {
    // Projected film: grain, flicker, a vignette and (optionally) the sprocket holes of the film strip running past.
    const p = ctx.params;
    const sprockets = p.sprockets !== false;
    const grain = num(p, 'grain', 0.35);
    const flicker = num(p, 'flicker', 0.12);
    const media = mediaOf(ctx.el) ?? ctx.el;
    const fx = owned(ctx, 'upw-film');
    if (!fx.firstChild) {
      const noise = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.4 -0.2"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>')}")`;
      const holes = 'repeating-linear-gradient(to bottom, transparent 0 1.2cqw, #f4efe6 1.2cqw 3.4cqw, transparent 3.4cqw 4.6cqw)';
      fx.innerHTML = `<i class="g" style="position:absolute;inset:-10%;background:${noise};mix-blend-mode:overlay"></i>`
        + '<i style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)"></i>'
        + (sprockets ? `<i class="s" style="position:absolute;top:0;bottom:0;left:0;width:7%;background:#0b0b0b"><i class="sh" style="position:absolute;inset:0 22%;background:${holes};border-radius:.3cqw"></i></i><i class="s" style="position:absolute;top:0;bottom:0;right:0;width:7%;background:#0b0b0b"><i class="sh" style="position:absolute;inset:0 22%;background:${holes};border-radius:.3cqw"></i></i>` : '');
    }
    Object.assign(fx.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' });
    const g = fx.querySelector<HTMLElement>('.g')!;
    const strips = Array.from(fx.querySelectorAll<HTMLElement>('.sh'));
    drive(ctx, (raw) => {
      const on = raw > 0 && raw < 1;
      fx.style.opacity = on ? '1' : '0';
      if (!on) { setPart(media, 'filter', ctx.clip.id, null); g.style.opacity = ''; g.style.transform = ''; strips.forEach((x) => { x.style.backgroundPosition = ''; }); return; }
      const t = raw * ctx.duration;
      const frame = Math.floor(t * 24);
      g.style.opacity = grain.toFixed(3);
      g.style.transform = `translate(${((ctx.rand(frame, 1) - 0.5) * 8).toFixed(2)}%, ${((ctx.rand(frame, 2) - 0.5) * 8).toFixed(2)}%)`;
      strips.forEach((s) => { s.style.backgroundPosition = `0 ${(t * 40).toFixed(2)}cqw`; });
      setPart(media, 'filter', ctx.clip.id, `sepia(.2) contrast(1.08) brightness(${(1 + (ctx.rand(frame, 3) - 0.5) * flicker * 2).toFixed(3)})`);
    }, { ease: false, always: true });
  },

  glass(ctx) {
    // A liquid-glass lens gliding across the picture: it blurs, brightens and saturates what is under it, with
    // a bright rim, like a drop of glass.
    const p = ctx.params;
    const size = num(p, 'size', 34);
    const lens = owned(ctx, 'upw-glass');
    const look = 'blur(0.35cqw) saturate(1.7) brightness(1.12) contrast(1.05)';
    Object.assign(lens.style, {
      position: 'absolute', width: `${size}%`, aspectRatio: '1', borderRadius: '50%', pointerEvents: 'none', backdropFilter: look,
      boxShadow: 'inset 0 0 0 0.35cqw rgba(255,255,255,.75), 0 0 0 0.15cqw rgba(255,255,255,.35), inset 0.8cqw 1.2cqw 2cqw rgba(255,255,255,.45), inset -1cqw -1.4cqw 2cqw rgba(0,0,0,.25), 0 1.5cqw 3cqw rgba(0,0,0,.25)',
    });
    lens.style.setProperty('-webkit-backdrop-filter', look);
    const [x0, y0, x1, y1] = [num(p, 'fromX', -20), num(p, 'fromY', 30), num(p, 'toX', 120), num(p, 'toY', 55)];
    drive(ctx, (e) => {
      lens.style.opacity = e > 0 && e < 1 ? '1' : '0';
      lens.style.left = `calc(${lerp(x0, x1, e).toFixed(2)}% - ${size / 2}%)`;
      lens.style.top = `calc(${lerp(y0, y1, e).toFixed(2)}% - ${size / 2}%)`;
      // It wobbles slightly as it moves, like liquid.
      const w = Math.sin(e * Math.PI * 4) * 0.05;
      lens.style.transform = `scale(${(1 + w).toFixed(4)}, ${(1 - w).toFixed(4)})`;
    }, { always: true });
  },

  portal(ctx) {
    // The picture shrinks into a ringed circle in a corner (picture in picture), or grows back out of one.
    const p = ctx.params;
    const out = isOut(p);
    const corner = pick(p, 'corner', ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const, 'top-left');
    const size = num(p, 'size', 30) / 100;
    const media = mediaOf(ctx.el) ?? ctx.el;
    const ring = owned(ctx, 'upw-portal', 'shared');
    Object.assign(ring.style, { position: 'absolute', borderRadius: '50%', border: `0.6cqw solid ${color(p, 'color', '#ff6a2b')}`, pointerEvents: 'none', boxSizing: 'border-box' });
    const W = () => ctx.el.clientWidth || 1, H = () => ctx.el.clientHeight || 1;
    chain(ctx, (e) => {
      const v = out ? e : 1 - e; // 0 = full picture, 1 = small circle in the corner
      if (v <= 0.001) { media.style.clipPath = ''; media.style.transform = ''; ring.style.opacity = '0'; return; }
      const w = W(), h = H();
      const full = Math.hypot(w, h) / 2;
      const small = (Math.min(w, h) * size) / 2;
      const r = lerp(full, small, v);
      // The circle's centre travels from the middle to the corner.
      const cx = lerp(w / 2, corner.endsWith('left') ? small * 1.25 : w - small * 1.25, v);
      const cy = lerp(h / 2, corner.startsWith('top') ? small * 1.25 : h - small * 1.25, v);
      // The picture scales with it, so the subject stays inside the circle.
      const s = lerp(1, (small * 2.4) / Math.min(w, h), v);
      media.style.transformOrigin = '0 0';
      media.style.transform = `translate(${(cx - (w / 2) * s).toFixed(2)}px, ${(cy - (h / 2) * s).toFixed(2)}px) scale(${s.toFixed(4)})`;
      media.style.clipPath = `circle(${(r / s).toFixed(2)}px at 50% 50%)`;
      Object.assign(ring.style, { opacity: v > 0.6 ? clamp01((v - 0.6) / 0.4).toFixed(3) : '0', left: `${(cx - r).toFixed(2)}px`, top: `${(cy - r).toFixed(2)}px`, width: `${(r * 2).toFixed(2)}px`, height: `${(r * 2).toFixed(2)}px` });
    });
  },

  copies(ctx) {
    // The picture in copies, drawn from the playing video every frame: a grid, a contact sheet filling up
    // frame by frame, a picture dive (the frame inside the frame inside the frame), or a feed scrolling past.
    const p = ctx.params;
    const mode = pick(p, 'mode', ['grid', 'contact', 'dive', 'feed'] as const, 'grid');
    const cols = Math.max(1, Math.round(num(p, 'columns', 3)));
    const rows = Math.max(1, Math.round(num(p, 'rows', 3)));
    const gap = num(p, 'gap', 1.5) / 100;
    const media = mediaOf(ctx.el);
    if (!media) return;
    const { holder, fit } = layerCanvas(ctx, 'upw-copies');
    let progress = 0;
    let active = false;
    const paint = () => {
      holder.style.opacity = active ? '1' : '0';
      media.style.visibility = active ? 'hidden' : '';
      if (!active) return;
      const { g, w, h } = fit();
      if (!g) return;
      g.clearRect(0, 0, w, h);
      g.fillStyle = color(p, 'background', '#0d0f12');
      g.fillRect(0, 0, w, h);
      const gp = gap * w;
      if (mode === 'grid' || mode === 'contact') {
        const tw = (w - gp * (cols + 1)) / cols, th = (h - gp * (rows + 1)) / rows;
        const n = cols * rows;
        const shown = mode === 'contact' ? Math.ceil(progress * n) : n;
        for (let i = 0; i < shown; i++) {
          const x = gp + (i % cols) * (tw + gp), y = gp + Math.floor(i / cols) * (th + gp);
          // A contact-sheet frame lands with a small drop.
          const age = mode === 'contact' ? clamp01((progress * n - i) * 2) : 1;
          const k = 0.7 + 0.3 * age;
          g.globalAlpha = age;
          drawCover(g, media, x + (tw * (1 - k)) / 2, y + (th * (1 - k)) / 2, tw * k, th * k);
        }
        g.globalAlpha = 1;
      } else if (mode === 'dive') {
        // Each level is the whole picture at 62% inside the one before; the camera dives through one level.
        const k = 0.62;
        const z = 1 / k ** progress;
        const cx = w * 0.5, cy = h * 0.46;
        for (let lvl = 0; lvl < 7; lvl++) {
          const s = z * k ** lvl;
          const fw = w * s, fh = h * s;
          if (fw < 4) break;
          const x = cx - fw / 2, y = cy - fh * 0.46;
          if (lvl > 0) { g.fillStyle = '#fff'; g.fillRect(x - fw * 0.02, y - fw * 0.02, fw * 1.04, fh + fw * 0.04); }
          drawCover(g, media, x, y, fw, fh);
        }
      } else {
        // A feed: tall cards scrolling up past the frame.
        const cw = w * 0.84, ch = cw * 1.5, step = ch + gp * 2;
        const off = progress * step * num(p, 'cards', 3);
        for (let i = -1; i < Math.ceil(h / step) + 2; i++) {
          const y = gp + i * step - (off % step);
          g.fillStyle = '#1b1f26';
          g.fillRect((w - cw) / 2 - 2, y - 2, cw + 4, ch + 4);
          drawCover(g, media, (w - cw) / 2, y, cw, ch);
        }
      }
    };
    ctx.late(paint);
    drive(ctx, (e) => { progress = e; active = e > 0 && e < 1 ? true : e >= 1 && p.hold !== false; paint(); }, { always: true });
  },

  shatter(ctx) {
    // The picture cracks and breaks into shards that fly apart (or fly together); what is behind shows through.
    const p = ctx.params;
    // Out (the default): it breaks apart. In: the shards fly together into the picture.
    const out = p.direction !== 'in';
    const media = mediaOf(ctx.el);
    if (!media) return;
    const { holder, fit } = layerCanvas(ctx, 'upw-shatter', 'shared');
    const ix = num(p, 'x', 50) / 100, iy = num(p, 'y', 45) / 100;
    const cols = 7, rows = 11;
    // A jittered grid split into triangles: each shard flies from the impact point with its own spin.
    const pts: Array<[number, number]> = [];
    for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      pts.push([(c + (edge ? 0 : (ctx.rand(r, c, 1) - 0.5) * 0.8)) / cols, (r + (edge ? 0 : (ctx.rand(r, c, 2) - 0.5) * 0.8)) / rows]);
    }
    const tris: Array<{ v: Array<[number, number]>; cx: number; cy: number; spin: number; speed: number }> = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = pts[r * (cols + 1) + c], b = pts[r * (cols + 1) + c + 1], d = pts[(r + 1) * (cols + 1) + c], e = pts[(r + 1) * (cols + 1) + c + 1];
      for (const v of (ctx.rand(r, c, 3) > 0.5 ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]]) as Array<Array<[number, number]>>) {
        const cx = (v[0][0] + v[1][0] + v[2][0]) / 3, cy = (v[0][1] + v[1][1] + v[2][1]) / 3;
        tris.push({ v, cx, cy, spin: (ctx.rand(r, c, tris.length) - 0.5) * 2, speed: 0.6 + ctx.rand(c, r, tris.length) * 0.8 });
      }
    }
    let k = 0;
    const paint = () => {
      const active = k > 0 && k < 1;
      holder.style.opacity = active ? '1' : '0';
      media.style.visibility = k > 0 ? 'hidden' : '';
      if (!active) return;
      const { g, w, h } = fit();
      if (!g) return;
      g.clearRect(0, 0, w, h);
      // The first 15%: cracks only; then the shards fly.
      const crack = clamp01(k / 0.15);
      const fly = clamp01((k - 0.15) / 0.85);
      for (const t of tris) {
        const dx = t.cx - ix, dy = t.cy - iy;
        const dist = Math.hypot(dx, dy) || 0.001;
        const push = fly * fly * t.speed * 1.6;
        const ox = (dx / dist) * push * w * 0.6, oy = ((dy / dist) * push * 0.6 + fly * fly * 0.9) * h;
        g.save();
        g.translate(t.cx * w + ox, t.cy * h + oy);
        g.rotate(t.spin * fly * 2.4);
        g.translate(-t.cx * w, -t.cy * h);
        g.beginPath();
        t.v.forEach(([x, y], i) => (i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)));
        g.closePath();
        g.save();
        g.clip();
        drawCover(g, media, 0, 0, w, h);
        g.restore();
        if (crack > 0) { g.strokeStyle = `rgba(255,255,255,${(0.75 * crack * (1 - fly)).toFixed(3)})`; g.lineWidth = Math.max(1, w / 500); g.stroke(); }
        g.restore();
      }
    };
    ctx.late(paint);
    chain(ctx, (raw) => { k = out ? raw : 1 - raw; paint(); }, { ease: false });
  },

  follow(ctx) {
    // Keeps the layer on the face in a piece of footage (found by the AI Dev Kit), or beside it, while the clip
    // runs: a circle drawn round the face, a label over the head, icons orbiting it, a callout that moves with them.
    const p = ctx.params;
    const id = typeof p.layer === 'string' ? p.layer : '';
    const where = pick(p, 'at', ['face', 'above', 'below', 'left', 'right'] as const, 'face');
    const gap = num(p, 'gap', 0.15);
    const grow = p.scale === true;
    const outer = ctx.el.closest<HTMLElement>('.upw-layer');
    const stage = ctx.el.closest<HTMLElement>('.upw-stage');
    if (!outer || !stage || !id) return;
    let on = false;
    let firstW = 0;
    const place = () => {
      if (!on) { ctx.el.style.translate = ''; if (grow) ctx.el.style.scale = ''; return; }
      const host = stage.querySelector<HTMLElement & { upwTrack?: Array<{ t: number; x: number; y: number; w: number; h: number }> }>(`.upw-layer[data-layer="${CSS.escape(id)}"]`);
      const video = host?.querySelector('video');
      const track = host?.upwTrack;
      if (!host || !video || !track?.length || !video.videoWidth) return;
      // The face at the video's current moment (between the two nearest frames of the path).
      const t = video.currentTime;
      let i = track.findIndex((q) => q.t > t);
      if (i < 0) i = track.length;
      const a = track[Math.max(0, i - 1)], b = track[Math.min(track.length - 1, i)];
      const f = b.t > a.t ? Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t))) : 0;
      const fx = lerp(a.x, b.x, f), fy = lerp(a.y, b.y, f), fw = lerp(a.w, b.w, f), fh = lerp(a.h, b.h, f);
      // Where that is on screen: the video fills (or fits) its box.
      const box = video.getBoundingClientRect();
      const vw = video.videoWidth, vh = video.videoHeight;
      const cover = getComputedStyle(video).objectFit !== 'contain';
      const s = cover ? Math.max(box.width / vw, box.height / vh) : Math.min(box.width / vw, box.height / vh);
      const ox = box.left + (box.width - vw * s) / 2, oy = box.top + (box.height - vh * s) / 2;
      let px = ox + fx * vw * s, py = oy + fy * vh * s;
      const faceW = fw * vw * s, faceH = fh * vh * s;
      if (where === 'above') py -= faceH * (0.5 + gap) + 0;
      if (where === 'below') py += faceH * (0.5 + gap);
      if (where === 'left') px -= faceW * (0.5 + gap);
      if (where === 'right') px += faceW * (0.5 + gap);
      // Move the layer's own box there (the outer box is where it is laid out; the screen may be zoomed).
      const r = outer.getBoundingClientRect();
      const k = outer.offsetWidth ? r.width / outer.offsetWidth : 1;
      ctx.el.style.translate = `${((px - (r.left + r.width / 2)) / k).toFixed(2)}px ${((py - (r.top + r.height / 2)) / k).toFixed(2)}px`;
      if (grow) { if (!firstW) firstW = faceW; ctx.el.style.scale = (faceW / firstW).toFixed(4); }
    };
    ctx.late(place);
    drive(ctx, (raw) => { on = raw > 0 && raw < 1; if (!on) firstW = 0; place(); }, { ease: false, always: true });
  },

  sticker(ctx) {
    // A cut-out sticker: a white outline grows round the shape (a person cut out of footage, a logo), with a
    // soft shadow, and it pops slightly. Paper cut-out on a coloured backdrop.
    const p = ctx.params;
    const out = isOut(p);
    const width = num(p, 'width', 0.8);
    const c = color(p, 'color', '#ffffff');
    // On the layer box (not the picture inside it), so the rounded box does not clip the outline.
    const target = ctx.el;
    chain(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      if (v <= 0.001) { target.style.filter = ''; ctx.el.style.scale = ''; return; }
      if (mediaOf(ctx.el)) ctx.el.style.overflow = 'visible';
      const r = (width * v).toFixed(3);
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];
      target.style.filter = `${dirs.map(([x, y]) => `drop-shadow(${(x * +r).toFixed(3)}cqw ${(y * +r).toFixed(3)}cqw 0 ${c})`).join(' ')} drop-shadow(0 0.8cqw 1.4cqw rgba(0,0,0,${(0.35 * v).toFixed(3)}))`;
      ctx.el.style.scale = (1 + 0.04 * Math.sin(Math.min(1, v) * Math.PI)).toFixed(4);
    });
  },
};
