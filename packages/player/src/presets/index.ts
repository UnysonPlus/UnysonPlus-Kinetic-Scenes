import type { gsap as GSAP } from 'gsap';
import type { AudioClip, Clip, Layer } from '../types';
import { hash01 } from '../random';
import { PRESET_CATALOG, type PresetMeta } from './catalog';
import { resolveEase } from '../eases';
import type { State3D } from '../model3d';
import { MORE_BUILDERS } from './more';
import { TRANSITION_BUILDERS } from './transitions';
import { FX_BUILDERS, REACT_BUILDERS, directionalBlur, speedOf, typewriterCaret } from './fx';
import { easeOf, drive } from './more';
import { PATH_BUILDERS } from './paths';
import { TOUR_BUILDERS } from './tour';
import { VIDEO_BUILDERS } from './video';
import { LOOK_BUILDERS } from './looks';

/**
 * Preset animation code. Each builder adds its tweens to the scene timeline at the clip's start.
 *
 * Rules every preset follows, so scenes stay seekable and responsive:
 *   - Tweens are explicit fromTo pairs, so the same moment always renders the same frame, scrubbing
 *     forwards or backwards.
 *   - Only the first clip on a layer renders its starting state up front (immediateRender); later
 *     clips pick up from wherever the earlier ones left the layer.
 *   - Movement is in percentages of the layer's own size and blur is in stage units, so a breakpoint
 *     change never needs the timeline rebuilt.
 *   - No Math.random(): use ctx.rand(...).
 */

export type Timeline = ReturnType<typeof GSAP.timeline>;

export interface PresetContext {
  tl: Timeline;
  layer: Layer;
  clip: Clip;
  /** The element to animate (inside the positioned layer box). */
  el: HTMLElement;
  /** Text layers: one element per word (empty for other layers). */
  words: HTMLElement[];
  /** Text layers: one element per character, spaces excluded. */
  chars: HTMLElement[];
  at: number;
  duration: number;
  /** A name the engine knows, or a function for a custom curve. */
  ease: string | ((t: number) => number);
  params: Record<string, unknown>;
  /** True for the earliest clip on the layer. */
  first: boolean;
  /** A repeatable number in [0, 1) for this clip and the given integers. */
  rand: (...ints: number[]) => number;
  /** The animation engine, for custom code clips. */
  gsap: typeof GSAP;
  /** Whether this page allows custom code clips to run. */
  allowCode: boolean;
  /** 3D layers: the state 3D presets animate (rotations in degrees, scale, camera orbit, tilt and dolly). */
  model?: State3D;
  /**
   * Runs a function after every update of the whole scene (and after a resize), once every preset has
   * drawn its frame: for presets that place something by where other layers are (Follow path).
   */
  late: (fn: () => void) => void;
  /** The current time on this clip's timeline (a group's own clock inside a group). */
  now: () => number;
  /** The scene's audio clips, and the time on the scene's own clock (for presets that follow the music). */
  sceneAudio: AudioClip[];
  sceneNow: () => number;
}

export interface PresetDefinition extends PresetMeta {
  build(ctx: PresetContext): void;
}

type Vars = Record<string, unknown>;

const num = (p: Vars, k: string, d: number) => (typeof p[k] === 'number' && Number.isFinite(p[k]) ? (p[k] as number) : d);
const str = <T extends string>(p: Vars, k: string, allowed: readonly T[], d: T): T =>
  allowed.includes(p[k] as T) ? (p[k] as T) : d;
const isOut = (p: Vars) => p.direction === 'out';
const blurOf = (units: number) => `blur(${units}cqw)`;

/** Per-item duration for a staggered group, so the whole group still ends with the clip. */
function staggered(total: number, count: number, each: number) {
  const span = each * Math.max(0, count - 1);
  const fit = Math.min(span, total * 0.7);
  const eachFit = count > 1 ? fit / (count - 1) : 0;
  return { each: eachFit, itemDuration: Math.max(0.05, total - fit) };
}

/** Text presets that animate letters fall back to the whole element when a layer has none. */
function textTargets(ctx: PresetContext, by: 'chars' | 'words') {
  const list = by === 'words' ? ctx.words : ctx.chars;
  return list.length ? list : [ctx.el];
}

/** The common in/out shape: hidden → shown for "in", shown → hidden for "out". */
function inOut(ctx: PresetContext, targets: unknown, hidden: Vars, shown: Vars, extra: Vars = {}, hiddenOut?: Vars) {
  const [from, to] = isOut(ctx.params) ? [shown, hiddenOut ?? hidden] : [hidden, shown];
  ctx.tl.fromTo(targets as object, from, { ...to, duration: ctx.duration, ease: ctx.ease, immediateRender: ctx.first, ...extra }, ctx.at);
}

/**
 * Start times for a staggered group. "natural" rhythm varies each gap by up to ±40% (seeded, so every
 * play is the same) while keeping the overall span: even gaps read as mechanical, uneven ones as
 * hand-timed.
 */
function rhythm(ctx: PresetContext, count: number, each: number): number | ((i: number) => number) {
  if (ctx.params.rhythm !== 'natural' || count < 3 || each <= 0) return each;
  const gaps = Array.from({ length: count - 1 }, (_, i) => 1 + 0.4 * (ctx.rand(i, 7) * 2 - 1));
  const scale = (each * (count - 1)) / gaps.reduce((a, b) => a + b, 0);
  const starts = [0];
  gaps.forEach((g, i) => starts.push(starts[i] + g * scale));
  return (i: number) => starts[i] ?? 0;
}

/** Staggered in/out over letters or words. */
function inOutStaggered(ctx: PresetContext, targets: HTMLElement[], hidden: Vars, shown: Vars, each: number, hiddenOut?: Vars) {
  const s = staggered(ctx.duration, targets.length, each);
  const [from, to] = isOut(ctx.params) ? [shown, hiddenOut ?? hidden] : [hidden, shown];
  ctx.tl.fromTo(targets, from, { ...to, duration: s.itemDuration, ease: ctx.ease, stagger: rhythm(ctx, targets.length, s.each), immediateRender: ctx.first }, ctx.at);
}

const BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  fade(ctx) {
    const p = ctx.params;
    const hidden: Vars = { opacity: 0, xPercent: num(p, 'x', 0), yPercent: num(p, 'y', 0), scale: num(p, 'scale', 1) };
    const shown: Vars = { opacity: 1, xPercent: 0, yPercent: 0, scale: 1 };
    const blur = num(p, 'blur', 0);
    if (blur > 0) {
      hidden.filter = blurOf(blur);
      shown.filter = blurOf(0);
    }
    inOut(ctx, ctx.el, hidden, shown);
  },

  'text-slam'(ctx) {
    const p = ctx.params;
    const s = num(p, 'scale', 2.4);
    const blur = num(p, 'blur', 1.2);
    inOut(ctx, ctx.el,
      { opacity: 0, scale: s, filter: blurOf(blur) },
      { opacity: 1, scale: 1, filter: blurOf(0) },
      {},
      { opacity: 0, scale: 1 / s, filter: blurOf(blur) });
  },

  'text-rise'(ctx) {
    const p = ctx.params;
    const targets = textTargets(ctx, str(p, 'by', ['chars', 'words'] as const, 'chars'));
    const dist = num(p, 'distance', 130);
    const mask = p.mask !== false;
    // Each word is its own mask: flush on the side the letters travel through (below for an
    // entrance, above for an exit) and with room on the other sides for accents and descenders.
    // Set at this clip's start, so an entrance and an exit on one layer each get the right shape.
    const holders = ctx.words.map((w) => w.parentElement).filter((h): h is HTMLElement => !!h);
    if (holders.length) {
      const clip = !mask ? 'none' : isOut(p) ? 'inset(-0.04em -0.2em -0.6em -0.2em)' : 'inset(-0.6em -0.2em -0.14em -0.2em)';
      if (ctx.first) holders.forEach((h) => { h.style.clipPath = clip; });
      ctx.tl.set(holders, { clipPath: clip }, ctx.at);
    }
    const fadeIt = mask ? {} : { opacity: 0 };
    inOutStaggered(ctx, targets,
      { yPercent: dist, ...fadeIt },
      { yPercent: 0, ...(mask ? {} : { opacity: 1 }) },
      num(p, 'stagger', 0.03),
      { yPercent: -dist, ...fadeIt });
  },

  'text-stretch'(ctx) {
    const p = ctx.params;
    const axis = str(p, 'axis', ['x', 'y'] as const, 'y');
    const squash = num(p, 'squash', 1.8);
    const transformOrigin = axis === 'y' ? '50% 100%' : '0% 50%';
    const hidden = axis === 'y'
      ? { scaleY: 0, scaleX: squash, opacity: 0, transformOrigin }
      : { scaleX: 0, scaleY: squash, opacity: 0, transformOrigin };
    inOutStaggered(ctx, textTargets(ctx, 'chars'), hidden, { scaleX: 1, scaleY: 1, opacity: 1, transformOrigin }, num(p, 'stagger', 0.04));
  },

  'text-scramble'(ctx) {
    const chars = ctx.chars;
    if (!chars.length) return;
    const p = ctx.params;
    const charset = typeof p.charset === 'string' && p.charset.length ? Array.from(p.charset) : Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    const fps = Math.max(1, num(p, 'fps', 24));
    const originals = chars.map((c) => c.dataset.ch ?? c.textContent ?? '');
    const n = chars.length;
    const render = (progress: number) => {
      const frame = Math.floor(progress * ctx.duration * fps);
      for (let i = 0; i < n; i++) {
        const settleAt = 0.2 + 0.8 * ((i + 1) / n);
        chars[i].textContent = progress >= settleAt ? originals[i] : charset[Math.floor(ctx.rand(i, frame) * charset.length)];
      }
    };
    const state = { p: 0 };
    if (ctx.first) render(0);
    ctx.tl.fromTo(state, { p: 0 }, { p: 1, duration: ctx.duration, ease: ctx.ease, immediateRender: false, onUpdate: () => render(state.p) }, ctx.at);
  },

  'text-typewriter'(ctx) {
    const chars = textTargets(ctx, 'chars');
    const each = ctx.duration / Math.max(1, chars.length);
    const out = isOut(ctx.params);
    // Each letter switches instantly; the stagger spaces the switches across the clip.
    ctx.tl.fromTo(chars, { opacity: out ? 1 : 0 }, {
      opacity: out ? 0 : 1, duration: 0.001, ease: 'none', immediateRender: ctx.first,
      stagger: { each, from: out ? 'end' : 'start' },
    }, ctx.at);
    if (ctx.params.caret === true) typewriterCaret(ctx, chars);
  },

  'text-blur'(ctx) {
    const p = ctx.params;
    const b = num(p, 'blur', 0.8);
    inOutStaggered(ctx, textTargets(ctx, str(p, 'by', ['chars', 'words'] as const, 'chars')),
      { opacity: 0, filter: blurOf(b) }, { opacity: 1, filter: blurOf(0) }, num(p, 'stagger', 0.03));
  },

  'text-flip'(ctx) {
    const p = ctx.params;
    const base = { transformOrigin: '50% 100%', transformPerspective: 600 };
    inOutStaggered(ctx, textTargets(ctx, str(p, 'by', ['chars', 'words'] as const, 'chars')),
      { ...base, rotationX: -95, opacity: 0 }, { ...base, rotationX: 0, opacity: 1 }, num(p, 'stagger', 0.04),
      { ...base, rotationX: 95, opacity: 0 });
  },

  'text-tracking'(ctx) {
    const p = ctx.params;
    const baseSpacing = ctx.layer.type === 'text' ? ctx.layer.style.letterSpacing ?? 0 : 0;
    inOut(ctx, ctx.el,
      { letterSpacing: `${num(p, 'from', -0.4)}em`, opacity: 0 },
      { letterSpacing: `${baseSpacing}em`, opacity: 1 });
  },

  'text-wave'(ctx) {
    const p = ctx.params;
    const chars = textTargets(ctx, 'chars');
    const s = staggered(ctx.duration, chars.length, num(p, 'stagger', 0.05));
    ctx.tl.fromTo(chars, { yPercent: 0 }, {
      yPercent: -num(p, 'height', 30), duration: s.itemDuration / 2, ease: ctx.ease,
      yoyo: true, repeat: 1, stagger: rhythm(ctx, chars.length, s.each), immediateRender: false,
    }, ctx.at);
  },

  wipe(ctx) {
    const side = str(ctx.params, 'from', ['left', 'right', 'top', 'bottom', 'center'] as const, 'left');
    // A little room past each edge so glyph overhangs and shadows are not trimmed when fully shown.
    const full = 'inset(-15% -15% -15% -15%)';
    const hiddenBy: Record<typeof side, string> = {
      left: 'inset(-15% 115% -15% -15%)',
      right: 'inset(-15% -15% -15% 115%)',
      top: 'inset(-15% -15% 115% -15%)',
      bottom: 'inset(115% -15% -15% -15%)',
      center: 'inset(-15% 50% -15% 50%)',
    };
    // Hiding sweeps toward the far edge, so an "out from left" wipe exits to the right.
    const opposite: Record<typeof side, typeof side> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top', center: 'center' };
    inOut(ctx, ctx.el, { clipPath: hiddenBy[side] }, { clipPath: full }, {}, { clipPath: hiddenBy[opposite[side]] });
  },

  iris(ctx) {
    const at = `at ${num(ctx.params, 'x', 50)}% ${num(ctx.params, 'y', 50)}%`;
    inOut(ctx, ctx.el, { clipPath: `circle(0% ${at})` }, { clipPath: `circle(150% ${at})` });
  },

  slide(ctx) {
    const p = ctx.params;
    const side = str(p, 'from', ['left', 'right', 'top', 'bottom'] as const, 'bottom');
    const d = num(p, 'distance', 60);
    const offset = (s: typeof side): Vars => ({
      xPercent: s === 'left' ? -d : s === 'right' ? d : 0,
      yPercent: s === 'top' ? -d : s === 'bottom' ? d : 0,
      opacity: 0,
    });
    inOut(ctx, ctx.el, offset(side), { xPercent: 0, yPercent: 0, opacity: 1 });
    // Motion blur: blur along the move, strongest where the move is fastest.
    const mbAmount = num(p, 'motionBlur', 0);
    const mb = mbAmount > 0 ? directionalBlur(ctx) : null;
    if (mb) {
      const e = easeOf(ctx);
      const horiz = side === 'left' || side === 'right';
      drive(ctx, (raw) => {
        const b = raw <= 0 || raw >= 1 ? 0 : mbAmount * 0.35 * speedOf(e, raw) * (d / 60);
        mb(horiz ? b : 0, horiz ? 0 : b);
      }, { ease: false });
    }
  },

  grow(ctx) {
    const p = ctx.params;
    const axis = str(p, 'axis', ['x', 'y'] as const, 'x');
    const origin = str(p, 'origin', ['start', 'center', 'end'] as const, 'center');
    const pos = origin === 'start' ? '0%' : origin === 'end' ? '100%' : '50%';
    const transformOrigin = axis === 'x' ? `${pos} 50%` : `50% ${pos}`;
    const prop = axis === 'x' ? 'scaleX' : 'scaleY';
    inOut(ctx, ctx.el, { [prop]: 0, transformOrigin }, { [prop]: 1, transformOrigin });
  },

  pop(ctx) {
    inOut(ctx, ctx.el, { scale: num(ctx.params, 'from', 0), opacity: 0 }, { scale: 1, opacity: 1 });
  },

  zoom(ctx) {
    const s = num(ctx.params, 'scale', 0.7);
    inOut(ctx, ctx.el, { scale: s, opacity: 0 }, { scale: 1, opacity: 1 });
  },

  spin(ctx) {
    const turns = num(ctx.params, 'turns', 0.5);
    inOut(ctx, ctx.el, { rotation: -turns * 360, scale: 0, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1 }, {}, { rotation: turns * 360, scale: 0, opacity: 0 });
  },

  keyframes(ctx) {
    // Each property is its own track, as in a video editor: it animates between the keyframes that set
    // it and holds its first value before them. A keyframe's "ease" shapes the move INTO it (else the
    // clip's ease).
    const raw = Array.isArray(ctx.params.frames) ? (ctx.params.frames as Vars[]) : [];
    const frames = raw
      .filter((f) => f && typeof f.t === 'number' && f.t >= 0 && f.t <= ctx.duration + 1e-6)
      .sort((a, b) => (a.t as number) - (b.t as number));
    const prop = (k: string, v: number): Vars =>
      k === 'x' ? { xPercent: v } : k === 'y' ? { yPercent: v } : k === 'rotate' ? { rotation: v } : k === 'blur' ? { filter: blurOf(v) } : { [k]: v };
    for (const k of ['x', 'y', 'scale', 'rotate', 'opacity', 'blur']) {
      const keyed = frames.filter((f) => typeof f[k] === 'number');
      if (!keyed.length) continue;
      const v0 = keyed[0][k] as number;
      // Hold the first value from the clip's start (also sets the starting state for scrubbing). A key at
      // 0 needs no hold: the first move starts from it, and a hold overlapping that move would make the
      // frame depend on which of the two rendered last.
      const t0 = keyed[0].t as number;
      if (t0 > 1e-6) ctx.tl.fromTo(ctx.el, prop(k, v0), { ...prop(k, v0), duration: t0, ease: 'none', immediateRender: ctx.first }, ctx.at);
      else if (ctx.first && keyed.length > 1) ctx.gsap.set(ctx.el, prop(k, v0));
      else if (keyed.length === 1) ctx.tl.fromTo(ctx.el, prop(k, v0), { ...prop(k, v0), duration: 0.001, ease: 'none', immediateRender: ctx.first }, ctx.at);
      for (let i = 1; i < keyed.length; i++) {
        const a = keyed[i - 1];
        const b = keyed[i];
        const span = (b.t as number) - (a.t as number);
        if (span <= 0) continue;
        const ease = typeof b.ease === 'string' ? resolveEase(b.ease) : ctx.ease;
        ctx.tl.fromTo(ctx.el, prop(k, a[k] as number), { ...prop(k, b[k] as number), duration: span, ease, immediateRender: false }, ctx.at + (a.t as number));
      }
    }
  },

  pulse(ctx) {
    const times = Math.max(1, Math.round(num(ctx.params, 'times', 2)));
    ctx.tl.fromTo(ctx.el, { scale: 1 }, {
      scale: num(ctx.params, 'scale', 1.12), duration: ctx.duration / (times * 2), ease: ctx.ease,
      yoyo: true, repeat: times * 2 - 1, immediateRender: false,
    }, ctx.at);
  },

  shake(ctx) {
    const strength = num(ctx.params, 'strength', 6);
    const steps = Math.max(2, Math.round(ctx.duration * 24));
    const step = ctx.duration / steps;
    let x = 0;
    for (let i = 0; i < steps; i++) {
      const decay = 1 - (i + 1) / steps;
      const next = i === steps - 1 ? 0 : (ctx.rand(i) * 2 - 1) * strength * decay;
      ctx.tl.fromTo(ctx.el, { xPercent: x }, { xPercent: next, duration: step, ease: 'sine.inOut', immediateRender: false }, ctx.at + i * step);
      x = next;
    }
  },

  float(ctx) {
    const cycles = Math.max(1, Math.round(num(ctx.params, 'cycles', 1)));
    ctx.tl.fromTo(ctx.el, { yPercent: 0 }, {
      yPercent: -num(ctx.params, 'height', 6), duration: ctx.duration / (cycles * 2), ease: ctx.ease,
      yoyo: true, repeat: cycles * 2 - 1, immediateRender: false,
    }, ctx.at);
  },

  code(ctx) {
    // Runs only where the page opted in (data-upw-allow-code / allowCode): a scene file can travel, and
    // code in it is real JavaScript. A clip that throws is logged and skipped; the scene plays on.
    if (!ctx.allowCode) return;
    const src = typeof ctx.params.code === 'string' ? ctx.params.code : '';
    if (!src.trim()) return;
    try {
      // eslint-disable-next-line no-new-func
      const run = new Function('el', 'tl', 'gsap', 'at', 'duration', 'ease', 'layer', src);
      run(ctx.el, ctx.tl, ctx.gsap, ctx.at, ctx.duration, ctx.ease, ctx.layer);
    } catch (e) {
      console.warn('[Unyson+ scene] custom code clip "' + ctx.clip.id + '" failed:', e);
    }
  },

  recolor(ctx) {
    const to = typeof ctx.params.to === 'string' ? ctx.params.to : '#ffffff';
    const { layer } = ctx;
    if (layer.type === 'text') {
      ctx.tl.fromTo(ctx.el, { color: layer.style.color ?? '#ffffff' }, { color: to, duration: ctx.duration, ease: ctx.ease, immediateRender: false }, ctx.at);
    } else if (layer.type === 'shape' && layer.fill && !/gradient|url\(/i.test(layer.fill)) {
      // Gradients can't be blended into a colour, so only a solid fill takes part.
      ctx.tl.fromTo(ctx.el, { backgroundColor: layer.fill }, { backgroundColor: to, duration: ctx.duration, ease: ctx.ease, immediateRender: false }, ctx.at);
    }
  },
};

const ALL_BUILDERS: Record<string, (ctx: PresetContext) => void> = { ...BUILDERS, ...MORE_BUILDERS, ...TRANSITION_BUILDERS, ...FX_BUILDERS, ...PATH_BUILDERS, ...REACT_BUILDERS, ...TOUR_BUILDERS, ...VIDEO_BUILDERS, ...LOOK_BUILDERS };

export const presets: Record<string, PresetDefinition> = Object.fromEntries(
  PRESET_CATALOG.map((meta) => {
    const build = ALL_BUILDERS[meta.id];
    if (!build) throw new Error(`Preset "${meta.id}" has no animation code.`);
    return [meta.id, { ...meta, build }];
  }),
);

if (Object.keys(ALL_BUILDERS).length !== PRESET_CATALOG.length) {
  throw new Error('Preset animation code and the preset catalogue are out of sync.');
}

export function presetRand(seed: number) {
  return (...ints: number[]) => hash01(seed, ...ints);
}
