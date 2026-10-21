import type { PresetContext } from './index';
import { clamp01, drive, isOut, num, pick } from './more';

/**
 * Tour presets that point at a layer: Spotlight (everything else dims) and Callout (a labelled pill beside
 * it). Each draws on an overlay above the stage, placed from where the layer is on screen after every
 * update, so it follows the layer through camera moves. An In and an Out on the same layer share one
 * overlay: the In shows it, the Out takes it away.
 */

type Vars = Record<string, unknown>;
const color = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' && p[k] ? (p[k] as string) : d);

function stageOverlay(ctx: PresetContext, kind: string): HTMLElement | null {
  // Inside the camera's view, above every layer but a cursor (which must stay bright to lead the eye).
  const stage = ctx.el.closest<HTMLElement>('.upw-cam') ?? ctx.el.closest<HTMLElement>('.upw-stage');
  if (!stage) return null;
  const key = `${kind}-${ctx.layer.id}`;
  let node = stage.querySelector<HTMLElement>(`:scope > [data-upw-own="${key}"]`);
  if (!node) {
    node = stage.ownerDocument.createElement('div');
    node.dataset.upwOwn = key;
    node.setAttribute('aria-hidden', 'true');
    Object.assign(node.style, { position: 'absolute', left: '0', top: '0', width: '0', height: '0', pointerEvents: 'none', zIndex: '8000', opacity: '0' });
    stage.appendChild(node);
  }
  return node;
}

/** The layer's box in the camera's own (unzoomed) pixels, where the overlays are drawn. */
function onStage(ctx: PresetContext) {
  const view = ctx.el.closest<HTMLElement>('.upw-cam') ?? ctx.el.closest<HTMLElement>('.upw-stage');
  if (!view) return null;
  const sr = view.getBoundingClientRect();
  const r = ctx.el.getBoundingClientRect();
  const k = sr.width ? view.offsetWidth / sr.width : 1;
  return { x: (r.left - sr.left) * k, y: (r.top - sr.top) * k, w: r.width * k, h: r.height * k, unit: view.offsetWidth / 100 };
}

export const TOUR_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  spotlight(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const pad = num(p, 'pad', 1.2);
    const radius = num(p, 'radius', 1.2);
    const dim = Math.max(0, Math.min(1, num(p, 'dim', 0.62)));
    const node = stageOverlay(ctx, 'spot');
    if (!node) return;
    drive(ctx, (e) => { node.style.opacity = clamp01(out ? 1 - e : e).toFixed(3); }, { always: !out });
    ctx.late(() => {
      const b = onStage(ctx);
      if (!b) return;
      const pd = pad * b.unit;
      Object.assign(node.style, {
        left: `${(b.x - pd).toFixed(1)}px`, top: `${(b.y - pd).toFixed(1)}px`, width: `${(b.w + 2 * pd).toFixed(1)}px`, height: `${(b.h + 2 * pd).toFixed(1)}px`,
        borderRadius: `${(radius * b.unit).toFixed(1)}px`, boxShadow: `0 0 0 300vmax rgba(0,0,0,${dim})`,
      });
    });
  },

  callout(ctx) {
    const p = ctx.params;
    const out = isOut(p);
    const side = pick(p, 'side', ['top', 'right', 'bottom', 'left'] as const, 'top');
    const gap = num(p, 'gap', 3);
    const c = color(p, 'color', '#ffd166');
    const node = stageOverlay(ctx, 'callout');
    if (!node) return;
    if (!out) {
      node.textContent = '';
      const line = node.ownerDocument.createElement('i');
      const pill = node.ownerDocument.createElement('span');
      pill.textContent = typeof p.text === 'string' && p.text ? p.text : 'Look here';
      Object.assign(line.style, { position: 'absolute', background: c });
      Object.assign(pill.style, {
        position: 'absolute', whiteSpace: 'nowrap', font: `700 ${num(p, 'size', 1.5)}cqw/1.2 system-ui, sans-serif`, color: '#111111',
        background: c, borderRadius: '99em', padding: '0.4em 0.9em', boxShadow: '0 0.4cqw 1.2cqw rgba(0,0,0,.3)',
      });
      node.append(line, pill);
    }
    // It arrives from a little way off, on its side.
    const shift = (v: number) => {
      const d = (1 - v).toFixed(2);
      return side === 'top' ? `0 ${d}cqw` : side === 'bottom' ? `0 -${d}cqw` : side === 'left' ? `${d}cqw 0` : `-${d}cqw 0`;
    };
    drive(ctx, (e) => { const v = clamp01(out ? 1 - e : e); node.style.opacity = v.toFixed(3); node.style.translate = v >= 1 || v <= 0 ? '' : shift(v); }, { always: !out });
    ctx.late(() => {
      const b = onStage(ctx);
      const line = node.firstElementChild as HTMLElement | null;
      const pill = node.lastElementChild as HTMLElement | null;
      if (!b || !line || !pill) return;
      const g = gap * b.unit, lw = Math.max(1.5, 0.18 * b.unit);
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      const pw = pill.offsetWidth, ph = pill.offsetHeight;
      let px: number, py: number;
      if (side === 'top') { px = cx - pw / 2; py = b.y - g - ph; Object.assign(line.style, { left: `${cx - lw / 2}px`, top: `${b.y - g}px`, width: `${lw}px`, height: `${g}px` }); }
      else if (side === 'bottom') { px = cx - pw / 2; py = b.y + b.h + g; Object.assign(line.style, { left: `${cx - lw / 2}px`, top: `${b.y + b.h}px`, width: `${lw}px`, height: `${g}px` }); }
      else if (side === 'left') { px = b.x - g - pw; py = cy - ph / 2; Object.assign(line.style, { left: `${b.x - g}px`, top: `${cy - lw / 2}px`, width: `${g}px`, height: `${lw}px` }); }
      else { px = b.x + b.w + g; py = cy - ph / 2; Object.assign(line.style, { left: `${b.x + b.w}px`, top: `${cy - lw / 2}px`, width: `${g}px`, height: `${lw}px` }); }
      pill.style.left = `${px.toFixed(1)}px`;
      pill.style.top = `${py.toFixed(1)}px`;
    });
  },
};
