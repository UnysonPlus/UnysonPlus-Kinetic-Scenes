import type { Clip, CursorLayer } from './types';

/**
 * The Cursor layer: a pointer that tours the scene. Its clips say where it goes and when it clicks:
 *   cursor-move   travels to another layer (a point on it) or to a point on the stage, along a gentle curve;
 *   cursor-click  presses: the cursor dips, a ring ripples out from the tip and the layer under it dips too;
 *   cursor-drag   holds the button down and drags to a point, as a crosshair (drawing a box: see Build: draw);
 *   cursor-type   stays put as a text I-beam while text types.
 * A colour and a name tag turn it into a collaborator's cursor, as in a shared design file.
 * The cursor's box (x, y) is where its tip starts: put it off the stage so it enters rather than appears.
 * Targets are measured on screen every frame, so the cursor finds a button even while that button moves.
 */

type Ease = (t: number) => number;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const ARROW = '<svg viewBox="0 0 24 34" width="100%" height="100%" style="display:block;overflow:visible"><path d="M2 2 L2 27 L8.6 21 L12.7 30.6 L17 28.8 L12.9 19.4 L21.6 19.2 Z" fill="FILL" stroke="LINE" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const HAND = '<svg viewBox="0 0 30 34" width="100%" height="100%" style="display:block;overflow:visible"><path d="M9 3.2c0-1.5 1-2.4 2.3-2.4s2.3.9 2.3 2.4v10.6c.5-.5 1.2-.8 2-.8 1.2 0 2.1.7 2.3 1.8.5-.4 1.1-.6 1.8-.6 1.2 0 2.1.8 2.3 1.9.4-.3 1-.5 1.6-.5 1.4 0 2.4 1 2.4 2.5v6.6c0 5.3-3.6 9.1-8.9 9.1h-2.2c-3.1 0-5.4-1.4-7.2-3.9L2.5 22.5c-.8-1.2-.6-2.6.5-3.4 1.1-.8 2.5-.6 3.4.5L9 22.4Z" fill="FILL" stroke="LINE" stroke-width="1.8" stroke-linejoin="round"/></svg>';

const CROSS = '<svg viewBox="0 0 24 24" width="100%" height="100%" style="display:block;overflow:visible"><path d="M12 1v8M12 15v8M1 12h8M15 12h8" stroke="LINE" stroke-width="4.2" stroke-linecap="round"/><path d="M12 1v8M12 15v8M1 12h8M15 12h8" stroke="FILL" stroke-width="2" stroke-linecap="round"/></svg>';
const IBEAM = '<svg viewBox="0 0 12 24" width="100%" height="100%" style="display:block;overflow:visible"><path d="M2 1.5h3l1 1 1-1h3M6 2.5v19M2 22.5h3l1-1 1 1h3" fill="none" stroke="LINE" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 1.5h3l1 1 1-1h3M6 2.5v19M2 22.5h3l1-1 1 1h3" fill="none" stroke="FILL" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

interface CursorParts { arrow: HTMLElement; hand: HTMLElement; ring: HTMLElement; cross: HTMLElement; ibeam: HTMLElement }
const parts = new WeakMap<HTMLElement, CursorParts>();

export function buildCursor(doc: Document, inner: HTMLElement, layer: CursorLayer) {
  inner.textContent = '';
  inner.style.position = 'relative';
  inner.style.overflow = 'visible';
  const dark = layer.theme === 'dark';
  const own = typeof layer.color === 'string' && layer.color.trim() ? layer.color.trim() : '';
  const fill = own || (dark ? '#111111' : '#ffffff');
  const line = own ? '#ffffff' : dark ? '#ffffff' : '#111111';
  const mk = (svg: string, cls: string) => {
    const d = doc.createElement('div');
    d.className = cls;
    d.innerHTML = svg.replace(/FILL/g, fill).replace(/LINE/g, line);
    Object.assign(d.style, { position: 'absolute', left: '0', top: '0', width: '100%', filter: 'drop-shadow(0 0.3cqw 0.5cqw rgba(0,0,0,.35))' });
    inner.appendChild(d);
    return d;
  };
  const ring = doc.createElement('div');
  Object.assign(ring.style, { position: 'absolute', left: '0', top: '0', width: '0', height: '0', borderRadius: '50%', border: `0.3cqw solid ${layer.ringColor ?? '#ffffff'}`, opacity: '0', translate: '-50% -50%', pointerEvents: 'none' });
  inner.appendChild(ring);
  const arrow = mk(ARROW, 'upw-cur-arrow');
  // The hand's fingertip is a little right of its box's corner: shift it so the tip stays on the point.
  const hand = mk(HAND, 'upw-cur-hand');
  hand.style.left = '-43%';
  hand.style.width = '115%';
  hand.style.opacity = '0';
  // The crosshair and the I-beam are centred on the tip (a drag draws from where it points, text types there).
  const cross = mk(CROSS, 'upw-cur-cross');
  Object.assign(cross.style, { width: '80%', translate: '-50% -50%', opacity: '0', filter: 'none' });
  const ibeam = mk(IBEAM, 'upw-cur-ibeam');
  Object.assign(ibeam.style, { width: '40%', translate: '-50% -50%', opacity: '0', filter: 'none' });
  if (typeof layer.label === 'string' && layer.label.trim()) {
    // The name tag rides just below and right of the tip, like a collaborator's cursor in a shared file.
    const w = layer.box.w ?? 3;
    const tag = doc.createElement('div');
    tag.className = 'upw-cur-tag';
    tag.textContent = layer.label.trim();
    Object.assign(tag.style, {
      position: 'absolute', left: `${(w * 0.78).toFixed(2)}cqw`, top: `${(w * 1.18).toFixed(2)}cqw`, whiteSpace: 'nowrap',
      font: `600 ${Math.max(0.8, w * 0.36).toFixed(2)}cqw/1.25 Inter, system-ui, sans-serif`, color: '#ffffff', background: own || (dark ? '#111111' : '#2b2b2b'),
      padding: '0.18em 0.55em', borderRadius: '0.35em', boxShadow: '0 0.2cqw 0.5cqw rgba(0,0,0,.25)', pointerEvents: 'none',
    });
    inner.appendChild(tag);
  }
  parts.set(inner, { arrow, hand, ring, cross, ibeam });
}

/** The screen rectangle of a layer by id, inside the same stage. */
function rectOf(stage: Element, id: string) {
  const el = stage.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(id)}"] > .upw-li`);
  return el ? { el, r: el.getBoundingClientRect(), outer: el.parentElement as HTMLElement } : null;
}

export function drawCursor(inner: HTMLElement, layer: CursorLayer, time: number, ease: (c: Clip) => Ease) {
  const p = parts.get(inner);
  const outer = inner.parentElement as HTMLElement | null;
  const stage = inner.closest('.upw-stage');
  if (!p || !outer || !stage) return;
  // Where the tip rests (the layer's own place), on screen, and the screen-to-layer scale (camera zoom).
  const home = outer.getBoundingClientRect();
  const k = outer.offsetWidth ? home.width / outer.offsetWidth : 1;
  const canvas = inner.closest('.upw-canvas') as HTMLElement | null;
  const cr = canvas?.getBoundingClientRect();
  const moves = layer.clips.filter((c) => c.preset === 'cursor-move' || c.preset === 'cursor-drag').sort((a, b) => a.start - b.start);
  const types = layer.clips.filter((c) => c.preset === 'cursor-type');
  const clicks = layer.clips.filter((c) => c.preset === 'cursor-click').sort((a, b) => a.start - b.start);
  // Each move's end point, on screen, measured now; and whether it ends on something clickable.
  const ends = moves.map((m) => {
    const prm = m.params ?? {};
    const fx = typeof prm.x === 'number' ? prm.x / 100 : 0.5;
    const fy = typeof prm.y === 'number' ? prm.y / 100 : 0.5;
    const to = typeof prm.to === 'string' ? prm.to : '';
    const hit = to ? rectOf(stage, to) : null;
    if (hit) {
      const link = !!hit.outer.dataset.link || hit.outer.querySelector('.upw-link') !== null;
      return { x: hit.r.left + hit.r.width * fx, y: hit.r.top + hit.r.height * fy, hand: prm.hand === 'yes' || (prm.hand !== 'no' && link), target: to };
    }
    // A point on the stage (% of it): for entering, leaving or pointing at a spot.
    const sx = cr ? cr.left + (cr.width * (typeof prm.px === 'number' ? prm.px : 50)) / 100 : home.left;
    const sy = cr ? cr.top + (cr.height * (typeof prm.py === 'number' ? prm.py : 50)) / 100 : home.top;
    return { x: sx, y: sy, hand: prm.hand === 'yes', target: '' };
  });
  // Where the tip is now: home, then each move in turn (a quadratic curve bowing to one side).
  let x = home.left, y = home.top, handOn = layer.shape === 'hand';
  let target = '';
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    if (time < m.start) break;
    const from = { x, y };
    const to = ends[i];
    const prog = ease(m)(clamp01((time - m.start) / Math.max(0.05, m.duration)));
    const arc = typeof m.params?.arc === 'number' ? (m.params.arc as number) : m.preset === 'cursor-drag' ? 0 : 0.18;
    const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
    const dx = to.x - from.x, dy = to.y - from.y;
    const cx = mx - dy * arc, cy = my + dx * arc;
    const u = 1 - prog;
    x = u * u * from.x + 2 * u * prog * cx + prog * prog * to.x;
    y = u * u * from.y + 2 * u * prog * cy + prog * prog * to.y;
    if (m.preset === 'cursor-drag') handOn = false;
    else if (layer.shape !== 'arrow' && layer.shape !== 'hand') handOn = to.hand ? prog > 0.65 : prog < 0.2 ? handOn : false;
    target = to.target;
  }
  // Drawn as a shift of the cursor from its home, in its own (unzoomed) pixels.
  inner.style.translate = `${((x - home.left) / k).toFixed(2)}px ${((y - home.top) / k).toFixed(2)}px`;
  // A drag shows the crosshair from a beat before it starts until it lets go; typing shows the I-beam.
  const dragging = moves.some((m) => m.preset === 'cursor-drag' && time >= m.start - 0.12 && time <= m.start + m.duration + 0.06);
  const typing = !dragging && types.some((c) => time >= c.start && time <= c.start + c.duration);
  const glyph = dragging ? 'cross' : typing ? 'ibeam' : handOn ? 'hand' : 'arrow';
  p.arrow.style.opacity = glyph === 'arrow' ? '1' : '0';
  p.hand.style.opacity = glyph === 'hand' ? '1' : '0';
  p.cross.style.opacity = glyph === 'cross' ? '1' : '0';
  p.ibeam.style.opacity = glyph === 'ibeam' ? '1' : '0';
  // Clicks: the cursor presses, a ring ripples from the tip, the layer under it dips.
  let press = 0, ringP = -1;
  const dips = new Map<string, number>();
  for (const c of clicks) {
    const v = (time - c.start) / Math.max(0.05, c.duration);
    // The target is whatever the last move before the click went to.
    const lastMove = moves.filter((m) => m.start <= c.start).pop();
    const under = lastMove ? ends[moves.indexOf(lastMove)].target : '';
    if (v < 0 || v > 1) { if (under && !dips.has(under)) dips.set(under, 0); continue; }
    press = Math.max(press, Math.sin(Math.PI * Math.min(1, v * 2)));
    ringP = v;
    if (under && c.params?.dip !== false) dips.set(under, Math.max(dips.get(under) ?? 0, Math.sin(Math.PI * Math.min(1, v * 1.6))));
  }
  for (const c of [p.arrow, p.hand]) c.style.scale = (1 - 0.16 * press).toFixed(4);
  if (ringP >= 0) {
    const d = 0.5 + ringP * (layer.box.w ?? 4) * 1.3;
    p.ring.style.width = p.ring.style.height = `${d.toFixed(2)}cqw`;
    p.ring.style.opacity = ((1 - ringP) * 0.85).toFixed(3);
  } else { p.ring.style.opacity = '0'; p.ring.style.width = p.ring.style.height = '0'; }
  for (const [id, v] of dips) {
    const t = rectOf(stage, id);
    if (t) t.outer.style.scale = v > 0 ? (1 - 0.045 * v).toFixed(4) : '';
  }
  void target;
}
