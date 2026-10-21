import type { PresetContext } from './index';
import { clamp01, drive, isOut, num } from './more';
import { drawState, flowLineLut, flowSurface, lutAt, lutSlice, pathLut, pathOverlay, vectorLayer, type Lut } from '../vector';

/**
 * Draw (a line or flow lines drawing themselves) and Follow path (any layer travelling along a line or a
 * flow line, optionally leaving a fading trail). Follow path places the layer after every update, once
 * the line it rides has been drawn for that frame.
 */

type Vars = Record<string, unknown>;
const text = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' && p[k] ? (p[k] as string) : d);
const SVG = 'http://www.w3.org/2000/svg';

const ANCHOR_FRACTION: Record<string, [number, number]> = {
  'top-left': [0, 0], top: [0.5, 0], 'top-right': [1, 0], left: [0, 0.5], center: [0.5, 0.5], right: [1, 0.5],
  'bottom-left': [0, 1], bottom: [0.5, 1], 'bottom-right': [1, 1],
};

// The Code layer draws itself from its clips after every update (code.ts), so these add nothing here.
const codeClip = () => {};

export const PATH_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  'code-type': codeClip,
  'code-edit': codeClip,
  'code-highlight': codeClip,
  'code-run': codeClip,
  'code-note': codeClip,
  // The Cursor layer draws itself from these (cursor.ts).
  'cursor-move': codeClip,
  'cursor-click': codeClip,

  draw(ctx) {
    const out = isOut(ctx.params);
    drive(ctx, (e) => { drawState.set(ctx.el, clamp01(out ? 1 - e : e)); }, { always: !out });
  },

  morph(ctx) {
    // This layer glides into another layer's place and size (and, between shapes, its colour and corners),
    // then hands over to it in a short crossfade. The other layer stays hidden until the handover, so the
    // two read as one thing moving between acts.
    const p = ctx.params;
    const targetId = text(p, 'to', '');
    if (!targetId) return;
    const fade = Math.max(0.05, Math.min(1, num(p, 'fade', 0.3)));
    const state = { e: 0 };
    drive(ctx, (e) => { state.e = e; }, { always: true });
    const end = ctx.at + ctx.duration;
    ctx.late(() => {
      const stage = ctx.el.closest('.upw-stage');
      const bOuter = stage?.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(targetId)}"]`);
      const aOuter = ctx.el.parentElement as HTMLElement | null;
      if (!bOuter || !aOuter) return;
      const bInner = bOuter.querySelector<HTMLElement>(':scope > .upw-li');
      if (bOuter.dataset.upwBaseOpacity === undefined) bOuter.dataset.upwBaseOpacity = bOuter.style.opacity || '1';
      const baseB = Number(bOuter.dataset.upwBaseOpacity) || 1;
      const now = ctx.now();
      const el = ctx.el;
      if (now < ctx.at) {
        el.style.translate = ''; el.style.scale = ''; el.style.opacity = '';
        if (ctx.layer.type === 'shape') {
          // Back to the shape's own fill and corners (clearing them would wipe the fill set as a shorthand).
          if (ctx.layer.fill) el.style.background = ctx.layer.fill;
          el.style.borderRadius = ctx.layer.shape === 'ellipse' ? '50%' : `${ctx.layer.radius ?? 0}cqw`;
        }
        bOuter.style.opacity = '0';
        return;
      }
      const v = now >= end ? 1 : state.e;
      const ra = aOuter.getBoundingClientRect(), rb = bOuter.getBoundingClientRect();
      const k = aOuter.offsetWidth ? ra.width / aOuter.offsetWidth : 1;
      const dx = ((rb.left + rb.width / 2) - (ra.left + ra.width / 2)) / k;
      const dy = ((rb.top + rb.height / 2) - (ra.top + ra.height / 2)) / k;
      const uniform = ctx.layer.type !== 'shape';
      const kx = ra.width ? rb.width / ra.width : 1, ky = ra.height ? rb.height / ra.height : 1;
      const sx = uniform ? ky : kx, sy = ky;
      el.style.translate = `${(dx * v).toFixed(2)}px ${(dy * v).toFixed(2)}px`;
      el.style.scale = `${(1 + (sx - 1) * v).toFixed(4)} ${(1 + (sy - 1) * v).toFixed(4)}`;
      if (ctx.layer.type === 'shape' && bInner && ctx.layer.fill && !/gradient|url\(/i.test(ctx.layer.fill)) {
        const bFill = getComputedStyle(bInner).backgroundColor;
        el.style.backgroundColor = `color-mix(in oklch, ${bFill} ${(v * 100).toFixed(1)}%, ${ctx.layer.fill})`;
        const ar = parseFloat(getComputedStyle(aOuter.querySelector(':scope > .upw-li') ?? el).borderTopLeftRadius) || 0;
        const br = (parseFloat(getComputedStyle(bInner).borderTopLeftRadius) || 0) / ((1 + (sx - 1) * v) || 1);
        el.style.borderRadius = `${(ar + (br - ar) * v).toFixed(2)}px`;
      }
      // The handover: this layer fades as the other appears in exactly the same place.
      const f = clamp01((v - (1 - fade)) / fade);
      el.style.opacity = now >= end ? '0' : (1 - f).toFixed(3);
      bOuter.style.opacity = now >= end ? String(baseB) : (baseB * f).toFixed(3);
    });
  },

  'follow-path'(ctx) {
    const p = ctx.params;
    const targetId = text(p, 'path', '');
    if (!targetId) return;
    const from = clamp01(num(p, 'from', 0) / 100);
    const to = clamp01(num(p, 'to', 100) / 100);
    const line = Math.max(1, Math.round(num(p, 'line', 1))) - 1;
    const rotate = p.rotate === true;
    const trail = clamp01(num(p, 'trail', 0));
    const trailColor = text(p, 'trailColor', '#ffffff');
    const trailWidth = Math.max(0.05, num(p, 'trailWidth', 0.35));
    const end = ctx.at + ctx.duration;
    const state = { f: from };
    drive(ctx, (e) => { state.f = from + (to - from) * e; }, { always: true });

    const anchor = ANCHOR_FRACTION[ctx.layer.box?.anchor ?? 'center'] ?? [0.5, 0.5];
    let trailG: SVGGElement | null = null;

    ctx.late(() => {
      const stage = ctx.el.closest('.upw-stage');
      const target = stage?.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(targetId)}"] > .upw-li`);
      const data = target ? vectorLayer.get(target) : undefined;
      if (!target || !data) return;
      let lut: Lut | null;
      let surface: SVGSVGElement | null;
      let scale: number;
      const rect = target.getBoundingClientRect();
      if (data.type === 'path') {
        lut = pathLut(target);
        surface = pathOverlay(target);
        scale = target.clientWidth ? rect.width / target.clientWidth : 1;
      } else {
        lut = flowLineLut(target, line);
        surface = flowSurface(target);
        scale = surface && surface.clientWidth ? surface.getBoundingClientRect().width / surface.clientWidth : 1;
      }
      if (!lut || !lut.total) return;
      const pt = lutAt(lut, state.f);
      const base = data.type === 'path' ? rect : surface!.getBoundingClientRect();
      const sx = base.left + pt.x * scale;
      const sy = base.top + pt.y * scale;
      // Move this layer so its anchor point sits on the line (in its own, unzoomed pixels).
      const outer = ctx.el.parentElement as HTMLElement | null;
      if (!outer) return;
      const r = outer.getBoundingClientRect();
      const k = outer.offsetWidth ? r.width / outer.offsetWidth : 1;
      const ax = r.left + anchor[0] * r.width;
      const ay = r.top + anchor[1] * r.height;
      ctx.el.style.translate = `${((sx - ax) / k).toFixed(2)}px ${((sy - ay) / k).toFixed(2)}px`;
      ctx.el.style.rotate = rotate ? `${pt.angle.toFixed(2)}deg` : '';

      if (trail > 0 && surface) {
        if (!trailG || !trailG.isConnected) {
          const key = `upw-trail-${ctx.clip.id}`;
          trailG = surface.querySelector<SVGGElement>(`:scope > [data-upw-own="${key}"]`);
          if (!trailG) {
            trailG = surface.ownerDocument.createElementNS(SVG, 'g') as SVGGElement;
            trailG.dataset.upwOwn = key;
            for (let i = 0; i < 6; i++) trailG.appendChild(surface.ownerDocument.createElementNS(SVG, 'polyline'));
            surface.appendChild(trailG);
          }
        }
        // The trail fades away once the trip is over.
        const now = ctx.now();
        const fade = now <= end ? 1 : clamp01(1 - (now - end) / 0.5);
        const moving = now > ctx.at && fade > 0;
        const unit = ((ctx.el.closest('.upw-canvas') as HTMLElement | null)?.clientWidth ?? 1000) / 100;
        const segs = Array.from(trailG.children) as SVGPolylineElement[];
        const dir = to >= from ? 1 : -1;
        segs.forEach((seg, i) => {
          if (!moving) { seg.setAttribute('points', ''); seg.style.opacity = '0'; return; }
          const a = state.f - dir * trail * (i / segs.length);
          const b = state.f - dir * trail * ((i + 1) / segs.length);
          const lo = dir > 0 ? Math.max(from, b) : Math.min(from, b);
          seg.setAttribute('points', lutSlice(lut!, a, lo));
          Object.assign(seg.style, {
            fill: 'none', stroke: trailColor, strokeLinecap: 'round',
            strokeWidth: `${(trailWidth * unit * (1 - i / segs.length)).toFixed(2)}px`,
            opacity: ((1 - i / segs.length) * 0.85 * fade).toFixed(3),
          });
        });
      }
    });
  },
};
