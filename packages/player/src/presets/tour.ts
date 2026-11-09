import type { PresetContext } from './index';
import { clamp01, drive, isOut, num, pick } from './more';

/**
 * Tour presets that point at a layer: Spotlight (everything else dims), Callout (a labelled pill beside
 * it) and Magnify (it comes forward, larger). The first two draw on an overlay above the stage, placed from where the layer is on screen after every
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

  'build-draw'(ctx) {
    // Build: draw. A box is drawn as if dragged out in a design tool: the outline grows from the layer's top-left
    // corner to its full size with corner handles and a live W x H badge, over a grey placeholder; then the layer
    // itself appears (swept in top to bottom, or faded in) as the placeholder melts away. With reveal "none" the
    // layer is left to a following clip (Typewriter types into the drawn text box). Pair it with a Cursor's Drag
    // over the same seconds (the drawing part) and the cursor looks like it is drawing the box.
    const p = ctx.params;
    const c = color(p, 'color', '#4c7dff');
    const drawPart = Math.max(0.1, Math.min(0.95, num(p, 'draw', 0.65)));
    const reveal = pick(p, 'reveal', ['sweep', 'fade', 'none'] as const, 'sweep');
    const fill = p.fill !== 'none' && reveal !== 'none';
    const badge = p.badge !== false;
    const node = stageOverlay(ctx, 'build');
    if (!node) return;
    const doc = node.ownerDocument;
    if (!node.firstElementChild) {
      const box = doc.createElement('div');
      Object.assign(box.style, { position: 'absolute', boxSizing: 'border-box' });
      node.appendChild(box);
      for (let i = 0; i < 4; i++) {
        const h = doc.createElement('i');
        Object.assign(h.style, { position: 'absolute', boxSizing: 'border-box', background: '#ffffff' });
        node.appendChild(h);
      }
      const tag = doc.createElement('span');
      Object.assign(tag.style, { position: 'absolute', whiteSpace: 'nowrap', color: '#ffffff', borderRadius: '0.3em', padding: '0.15em 0.45em', translate: '-50% 0' });
      node.appendChild(tag);
    }
    const el = ctx.el;
    const grow = (d: number) => (d < 0.5 ? 2 * d * d : 1 - (-2 * d + 2) ** 2 / 2);
    let g = 0, shown = false;
    drive(ctx, (t) => {
      if (t <= 0 || t >= 1) {
        node.style.opacity = '0';
        shown = false;
        if (reveal !== 'none') {
          el.style.clipPath = t <= 0 ? 'inset(0 0 100% 0)' : '';
          if (reveal === 'fade') el.style.filter = t <= 0 ? 'opacity(0)' : '';
        }
        return;
      }
      shown = true;
      g = grow(Math.min(1, t / drawPart));
      const r = t <= drawPart ? 0 : (t - drawPart) / (1 - drawPart);
      node.style.opacity = (1 - r).toFixed(3);
      if (reveal === 'sweep') el.style.clipPath = `inset(0 0 ${((1 - r) * 100).toFixed(2)}% 0)`;
      else if (reveal === 'fade') { el.style.clipPath = r > 0 ? '' : 'inset(0 0 100% 0)'; el.style.filter = `opacity(${r.toFixed(3)})`; }
    }, { ease: false, always: true });
    ctx.late(() => {
      if (!shown) return;
      const b = onStage(ctx);
      if (!b) return;
      const [box, h1, h2, h3, h4, tag] = Array.from(node.children) as HTMLElement[];
      const w = b.w * g, h = b.h * g;
      const line = Math.max(1, 0.14 * b.unit), hs = Math.max(4, 0.7 * b.unit);
      Object.assign(box.style, {
        left: `${b.x.toFixed(1)}px`, top: `${b.y.toFixed(1)}px`, width: `${w.toFixed(1)}px`, height: `${h.toFixed(1)}px`,
        border: `${line.toFixed(1)}px solid ${c}`, background: fill ? 'rgba(140,146,160,0.26)' : 'transparent',
      });
      const corners: [number, number][] = [[b.x, b.y], [b.x + w, b.y], [b.x, b.y + h], [b.x + w, b.y + h]];
      [h1, h2, h3, h4].forEach((k, i) => Object.assign(k.style, {
        left: `${(corners[i][0] - hs / 2).toFixed(1)}px`, top: `${(corners[i][1] - hs / 2).toFixed(1)}px`, width: `${hs.toFixed(1)}px`, height: `${hs.toFixed(1)}px`,
        border: `${line.toFixed(1)}px solid ${c}`,
      }));
      if (badge) {
        // The size in pixels of a 1920-wide frame, as a design tool would show it.
        const px = 1920 / (100 * b.unit);
        tag.textContent = `${Math.round(w * px)} × ${Math.round(h * px)}`;
        Object.assign(tag.style, {
          display: '', background: c, font: `600 ${(0.95 * b.unit).toFixed(1)}px/1.2 Inter, system-ui, sans-serif`,
          left: `${(b.x + w / 2).toFixed(1)}px`, top: `${(b.y + h + 0.7 * b.unit).toFixed(1)}px`,
        });
      } else tag.style.display = 'none';
    });
  },

  lift(ctx) {
    // Magnify: the layer comes forward, larger, on a soft shadow (and a ring when given a colour), and stays
    // until an Out clip. It uses the separate scale property, so it adds to whatever moves the layer.
    const p = ctx.params;
    const out = isOut(p);
    const k = Math.max(1, Math.min(3, num(p, 'scale', 1.25)));
    const shadow = p.shadow !== false;
    const ring = color(p, 'ring', '');
    const el = ctx.el;
    drive(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      if (v <= 0.001) { el.style.scale = ''; el.style.boxShadow = ''; el.style.outline = ''; el.style.zIndex = ''; return; }
      el.style.scale = (1 + (k - 1) * v).toFixed(4);
      el.style.zIndex = '7000';
      const parts: string[] = [];
      if (shadow) parts.push(`0 ${(1.2 * v).toFixed(2)}cqw ${(3.2 * v).toFixed(2)}cqw rgba(0,0,0,${(0.45 * v).toFixed(3)})`);
      if (ring) parts.push(`0 0 0 ${(0.3 * v).toFixed(3)}cqw ${ring}`);
      el.style.boxShadow = parts.join(', ');
    }, { always: !out });
  },
};
