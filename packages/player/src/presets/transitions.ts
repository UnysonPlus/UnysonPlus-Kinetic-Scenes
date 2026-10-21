import type { PresetContext } from './index';
import { directionalBlur, streakOverlay } from './fx';

/**
 * Scene transitions: moves made for a whole group (an act, a slide) handing over to the next. Each has an
 * "out" for the scene that leaves and an "in" for the scene that arrives; given the same start and length
 * (the Studio's "Transition to next" places both), the two read as one cut.
 *
 * Like the other drawn presets, each is a pure function of the clip's progress, run from one tween's
 * onUpdate, so any frame can be shown by seeking. Shapes are worked out in STAGE coordinates (a slash
 * crosses the whole stage, whatever the group's own frame), and a transition that lights up the screen
 * (a flash, the slash's glowing line) draws on an overlay above every layer. Overlays are invisible at
 * progress 0 and 1, so seeking past a transition never leaves one on screen.
 */

type Vars = Record<string, unknown>;
const num = (p: Vars, k: string, d: number) => (typeof p[k] === 'number' && Number.isFinite(p[k]) ? (p[k] as number) : d);
const pick = <T extends string>(p: Vars, k: string, allowed: readonly T[], d: T): T => (allowed.includes(p[k] as T) ? (p[k] as T) : d);
const str = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' && p[k] ? (p[k] as string) : d);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const isOut = (p: Vars) => p.direction === 'out';
const smooth = (t: number) => t * t * (3 - 2 * t);

function easeOf(ctx: PresetContext): (t: number) => number {
  if (typeof ctx.ease === 'function') return ctx.ease;
  const f = ctx.gsap.parseEase(ctx.ease) as ((t: number) => number) | undefined;
  return typeof f === 'function' ? f : (t) => t;
}

/** Runs render(progress, raw progress) across the clip, seek-safe. */
function drive(ctx: PresetContext, render: (p: number, raw: number) => void) {
  const e = easeOf(ctx);
  const state = { p: 0 };
  if (ctx.first) render(e(0), 0);
  ctx.tl.fromTo(state, { p: 0 }, { p: 1, duration: ctx.duration, ease: 'none', immediateRender: false, onUpdate: () => render(e(state.p), state.p) }, ctx.at);
}

/** The stage's canvas (transitions measure against it and draw their overlays on it). */
/**
 * Leaves the element exactly as it was before the transition touched it. An "out" at its start and an
 * "in" at its end must look untouched, or seeking backwards over the clip would leave traces behind.
 */
function untouched(el: HTMLElement) {
  el.style.clipPath = '';
  el.style.opacity = '';
  el.style.filter = '';
  el.style.translate = '';
  el.style.scale = '';
}

const canvasOf = (el: HTMLElement) => el.closest<HTMLElement>('.upw-canvas');

/**
 * An overlay above every layer, owned by this clip (reused when the timeline is rebuilt). A screen overlay
 * (a flash, a dip) covers the whole stage, so it also fills the sides when the scene is shown whole in a
 * wider stage (fit "contain"); a scene overlay (the slash's line) sits inside the camera, so it moves with
 * the picture it cuts.
 */
function overlay(ctx: PresetContext, cls: string, inScene = false): HTMLElement | null {
  const canvas = inScene
    ? ctx.el.closest<HTMLElement>('.upw-cam') ?? canvasOf(ctx.el)
    : canvasOf(ctx.el)?.closest<HTMLElement>('.upw-stage') ?? canvasOf(ctx.el);
  if (!canvas) return null;
  const key = `${cls}-${ctx.clip.id}`;
  let node = canvas.querySelector<HTMLElement>(`:scope > [data-upw-own="${key}"]`);
  if (!node) {
    node = canvas.ownerDocument.createElement('div');
    node.className = cls;
    node.dataset.upwOwn = key;
    node.setAttribute('aria-hidden', 'true');
    Object.assign(node.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '9000', opacity: '0', overflow: 'hidden' });
    canvas.appendChild(node);
  }
  return node;
}

/**
 * Maps stage coordinates (% of the stage) to pixels in the element's own box, so a clip-path drawn on
 * any layer or group lines up with the stage. Worked out from the layout (offsets), not from what is on
 * screen, so a moving camera or the element's own animation never changes it: every frame computes the
 * same shape whether it was reached by playing or by seeking.
 */
function stageToLocal(el: HTMLElement): ((x: number, y: number) => string) | null {
  const canvas = canvasOf(el);
  if (!canvas) return null;
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== canvas) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  if (node !== canvas) return null;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  return (x, y) => `${((x / 100) * w - left).toFixed(1)}px ${((y / 100) * h - top).toFixed(1)}px`;
}

/**
 * The part of the stage on one side of a slanted line through (pos% across, half way down), as polygon
 * points in stage %. `lean` is how far the line shifts across the stage's height, in % of its width.
 */
function slashPolygon(pos: number, lean: number, keep: 'before' | 'after'): Array<[number, number]> {
  const top = pos + lean / 2;
  const bottom = pos - lean / 2;
  const big = 400;
  return keep === 'before'
    ? [[-big, -big], [top, -big], [top, 0], [bottom, 100], [bottom, 100 + big], [-big, 100 + big]]
    : [[top, -big], [big, -big], [big, 100 + big], [bottom, 100 + big], [bottom, 100], [top, 0]];
}

export const TRANSITION_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  /** A glowing diagonal line sweeps across; the scene appears (or vanishes) behind it. */
  'tr-slash'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const angle = Math.max(-60, Math.min(60, num(p, 'angle', 25)));
    const color = str(p, 'color', '#e9ff3b');
    const glow = p.glow !== false;
    const line = glow ? overlay(ctx, 'upw-tr-slash', true) : null;
    const bar = line ? (line.firstElementChild as HTMLElement | null) ?? line.appendChild(line.ownerDocument.createElement('i')) : null;
    if (bar) {
      // A white-hot core with the colour as its glow (sized from the stage in render: px, not cq units,
      // since the overlay isn't a size container).
      Object.assign(bar.style, { position: 'absolute', left: '0', top: '-50%', height: '200%', borderRadius: '99px', background: '#ffffff', transformOrigin: '50% 50%' });
    }
    drive(ctx, (t, raw) => {
      // The slant in % of the stage width depends on the stage's shape (a 16:9 stage leans less).
      const canvas = canvasOf(ctx.el);
      const aspect = canvas && canvas.clientWidth ? canvas.clientHeight / canvas.clientWidth : 0.5625;
      const lean = Math.tan((angle * Math.PI) / 180) * aspect * 100;
      const pos = -Math.abs(lean) / 2 - 5 + t * (100 + Math.abs(lean) + 10);
      const map = stageToLocal(ctx.el);
      // In: the scene shows on the side the line has already crossed. Out: it is left behind it.
      const pts = slashPolygon(pos, lean, out ? 'after' : 'before');
      if ((out && raw <= 0) || (!out && raw >= 1)) untouched(ctx.el);
      else {
        if (map) ctx.el.style.clipPath = `polygon(${pts.map(([x, y]) => map(x, y)).join(', ')})`;
        ctx.el.style.opacity = out && raw >= 1 ? '0' : '';
      }
      if (line && bar && (raw <= 0 || raw >= 1)) {
        line.style.opacity = '0';
        bar.style.transform = '';
      } else if (line && bar) {
        const cw = line.clientWidth || 640;
        const core = Math.max(2, cw * 0.004);
        bar.style.width = `${core.toFixed(1)}px`;
        bar.style.marginLeft = `${(-core / 2).toFixed(1)}px`;
        bar.style.boxShadow = `0 0 ${(cw * 0.006).toFixed(1)}px ${(cw * 0.003).toFixed(1)}px ${color}, 0 0 ${(cw * 0.03).toFixed(1)}px ${(cw * 0.008).toFixed(1)}px ${color}`;
        line.style.opacity = Math.min(1, raw / 0.06, (1 - raw) / 0.06).toFixed(3);
        bar.style.transform = `translateX(${(pos / 100) * (line.clientWidth || 1)}px) rotate(${angle}deg)`;
      }
    });
  },

  /** A burst of light: the old scene blows out, the new one is there as it fades. */
  'tr-flash'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const color = str(p, 'color', '#ffffff');
    const strength = clamp01(num(p, 'strength', 100) / 100);
    const fl = overlay(ctx, 'upw-tr-flash');
    if (fl) fl.style.background = `radial-gradient(120% 120% at 50% 50%, ${color} 0%, ${color} 45%, transparent 100%)`;
    drive(ctx, (_t, raw) => {
      // Light up fast, hold briefly, fade slowly; the cut happens at the peak.
      const peak = 0.35;
      const v = raw <= 0 || raw >= 1 ? 0 : raw < peak ? smooth(raw / peak) : 1 - smooth((raw - peak) / (1 - peak));
      if (fl) fl.style.opacity = (v * strength).toFixed(3);
      const shown = out ? raw < peak : raw >= peak;
      ctx.el.style.opacity = shown ? '' : '0';
      ctx.el.style.filter = shown && v > 0.01 ? `brightness(${(1 + v * 1.5).toFixed(2)})` : '';
    });
  },

  /** Through a colour: the screen fills with it, holds a beat, and opens on the next scene. */
  'tr-dip'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const color = str(p, 'color', '#000000');
    const dip = overlay(ctx, 'upw-tr-dip');
    if (dip) dip.style.background = color;
    drive(ctx, (_t, raw) => {
      const v = raw <= 0 || raw >= 1 ? 0 : raw < 0.4 ? smooth(raw / 0.4) : raw < 0.6 ? 1 : 1 - smooth((raw - 0.6) / 0.4);
      if (dip) dip.style.opacity = v.toFixed(3);
      ctx.el.style.opacity = (out ? raw < 0.5 : raw >= 0.5) ? '' : '0';
    });
  },

  /**
   * A whip pan, velocity-matched: the old scene accelerates out over the first half and the new one
   * arrives from the same side at the same speed over the second, settling into place, so the cut in the
   * middle reads as one fast camera swing. The blur runs along the move and is heaviest at the cut, and
   * an optional light streak flares across the screen right on it to hide the join.
   */
  'tr-whip'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const from = pick(p, 'from', ['right', 'left', 'bottom', 'top'] as const, 'right');
    const dist = num(p, 'distance', 100);
    const blur = num(p, 'blur', 1.6);
    const sign = from === 'right' || from === 'bottom' ? 1 : -1;
    const horiz = from === 'right' || from === 'left';
    const mb = directionalBlur(ctx);
    const streak = p.streak === true ? streakOverlay(canvasOf(ctx.el)?.closest<HTMLElement>('.upw-stage') ?? null, `upw-tr-streak-${Math.round(ctx.at * 1000)}`, str(p, 'color', '#ffffff')) : null;
    drive(ctx, (t, raw) => {
      if ((out && raw <= 0) || (!out && raw >= 1)) { untouched(ctx.el); mb?.(0, 0); streak?.(0, 0); return; }
      // u: 0 to 1 over this scene's half; the move's speed is 2 at the cut and 0 at rest.
      const u = out ? clamp01(t * 2) : clamp01(t * 2 - 1);
      const k = out ? -sign * u * u : sign * (1 - u) * (1 - u);
      const speed = out ? 2 * u : 2 * (1 - u);
      const shown = out ? t < 0.5 : t >= 0.5;
      ctx.el.style.translate = horiz ? `${(k * dist).toFixed(2)}cqw 0` : `0 ${(k * dist).toFixed(2)}cqh`;
      ctx.el.style.opacity = shown ? '' : '0';
      const b = blur * speed * 0.5 * (dist / 100) * 2;
      if (mb) mb(horiz ? b : 0, horiz ? 0 : b);
      else ctx.el.style.filter = b > 0.01 ? `blur(${(b * 0.4).toFixed(2)}cqw)` : '';
      if (streak) {
        const near = 1 - Math.abs(t - 0.5) / 0.2;
        streak(near > 0 ? smooth(clamp01(near)) : 0, (t - 0.5) * 5 * sign);
      }
    });
  },

  /**
   * Light streak: an anamorphic flare races across the screen and the scenes swap at its brightest. The
   * flare belongs to the cut (keyed by its time), so the out and in halves of one transition share it.
   */
  'tr-streak'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const c = str(p, 'color', '#7cc4ff');
    const sweep = pick(p, 'from', ['left', 'right'] as const, 'left') === 'left' ? 1 : -1;
    const fl = streakOverlay(canvasOf(ctx.el)?.closest<HTMLElement>('.upw-stage') ?? null, `upw-tr-streak-${Math.round(ctx.at * 1000)}`, c);
    drive(ctx, (_t, raw) => {
      if (raw <= 0 || raw >= 1) {
        fl?.(0, 0);
        ctx.el.style.filter = '';
        ctx.el.style.opacity = out && raw >= 1 ? '0' : !out && raw <= 0 ? '0' : '';
        return;
      }
      const v = raw < 0.5 ? smooth(raw / 0.5) : 1 - smooth((raw - 0.5) / 0.5);
      fl?.(v, (raw * 2 - 1) * sweep * 2);
      const shown = out ? raw < 0.5 : raw >= 0.5;
      ctx.el.style.opacity = shown ? '' : '0';
      ctx.el.style.filter = shown && v > 0.02 ? `brightness(${(1 + v * 0.9).toFixed(2)})` : '';
    });
  },

  /** Zoom through: the old scene rushes past the camera, the new one approaches from the distance. */
  'tr-zoom'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const amount = Math.max(1.2, num(p, 'scale', 4));
    const blur = num(p, 'blur', 0.8);
    drive(ctx, (t, raw) => {
      if ((out && raw <= 0) || (!out && raw >= 1)) { untouched(ctx.el); return; }
      const s = out ? 1 + (amount - 1) * t * t : 1 / amount + (1 - 1 / amount) * t;
      ctx.el.style.scale = s.toFixed(4);
      ctx.el.style.opacity = out ? (1 - smooth(clamp01((t - 0.4) / 0.6))).toFixed(3) : smooth(clamp01(t / 0.5)).toFixed(3);
      const b = out ? t : 1 - t;
      ctx.el.style.filter = raw > 0 && raw < 1 && blur > 0 ? `blur(${(b * blur).toFixed(2)}cqw)` : '';
    });
  },

  /** A digital glitch: slices jump and colours split for a few frames, then the cut. */
  'tr-glitch'(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const amount = clamp01(num(p, 'intensity', 60) / 100);
    const fps = 18;
    drive(ctx, (_t, raw) => {
      if (raw <= 0 || raw >= 1) {
        ctx.el.style.clipPath = '';
        ctx.el.style.translate = '';
        ctx.el.style.filter = '';
        ctx.el.style.opacity = out && raw >= 1 ? '0' : !out && raw <= 0 ? '0' : '';
        return;
      }
      // Strongest at the cut (the middle), calm at the ends; stepped like a broken signal.
      const step = Math.floor(raw * ctx.duration * fps);
      const r = (n: number) => ctx.rand(step, n);
      const strength = amount * (1 - Math.abs(raw - 0.5) * 2) ** 0.6;
      const shown = out ? raw < 0.5 : raw >= 0.5;
      const band = 8 + r(1) * 40;
      const top = r(2) * (100 - band);
      const jumpy = r(3) < 0.55 * strength + 0.15;
      ctx.el.style.opacity = shown || r(4) < 0.25 * strength ? '' : '0';
      ctx.el.style.clipPath = jumpy ? `inset(${top.toFixed(1)}% 0 ${(100 - top - band).toFixed(1)}% 0)` : '';
      ctx.el.style.translate = `${((r(5) - 0.5) * 6 * strength).toFixed(2)}cqw 0`;
      const split = (1.2 * strength).toFixed(2);
      ctx.el.style.filter = strength > 0.05 ? `drop-shadow(${split}cqw 0 rgba(255,0,120,0.75)) drop-shadow(-${split}cqw 0 rgba(0,230,255,0.75))` : '';
    });
  },
};
