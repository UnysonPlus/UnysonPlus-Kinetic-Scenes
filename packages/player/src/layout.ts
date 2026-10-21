import type { Clip, Layer, Scene } from './types';
import { groupDuration } from './groups';

/**
 * "Check the layout": what Check scene can't see from the scene file alone. At the moments a part of the scene has
 * fully landed (everything in, nothing leaving yet), the rendered frame is measured: words sitting on other words,
 * words crossing or crowding the edge of a panel, a tick far from its words, a list with uneven gaps or off-centre
 * under its heading, words off the stage. The kit's AI review and the Studio's Check scene both use it.
 */

export interface LayoutIssue {
  id: string;
  severity: 'warn' | 'info';
  message: string;
  /** The moment it was measured at, in seconds. */
  t: number;
  layerId?: string;
}

const AMBIENT = new Set(['drift', 'float', 'particles', 'gradient-flow', 'react', 'march', 'scroll', 'timecode', 'orbit-flat', 'film', 'keyframes']);
const dirOf = (c: Clip) => (c.params as { direction?: string } | undefined)?.direction;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * The moments each part of the scene has fully landed: just before its layers start to leave, once all of their
 * entrances are done. Parts are groups, or top-level layers that leave together.
 */
export function settledMoments(scene: Scene): number[] {
  const dur = scene.duration;
  const span = (l: Layer, off: number) => {
    const ins = l.clips.filter((c) => dirOf(c) !== 'out' && !AMBIENT.has(c.preset));
    const outs = l.clips.filter((c) => dirOf(c) === 'out');
    const landed = off + Math.max(l.start ?? 0, ...ins.map((c) => c.start + c.duration));
    const leaving = outs.length ? off + Math.min(...outs.map((c) => c.start)) : off + (l.end ?? dur);
    return { landed, leaving };
  };
  const parts = new Map<number, number>();
  // Every layer's time on screen, to make sure nothing is still arriving at a chosen moment.
  const spans: Array<{ from: number; landed: number; leaving: number }> = [];
  const add = (leaving: number, landed: number, from = 0) => {
    const k = r2(Math.min(leaving, dur));
    parts.set(k, Math.max(parts.get(k) ?? 0, landed));
    spans.push({ from, landed, leaving });
  };
  for (const l of scene.layers) {
    if (l.type === 'group') {
      const a = l.start ?? 0;
      const kids = l.layers.map((k) => span(k, a));
      const own = span(l, 0);
      const leaving = Math.min(own.leaving, a + groupDuration(l), ...kids.map((k) => k.leaving));
      add(leaving, Math.max(own.landed, ...kids.filter((k) => k.leaving >= leaving - 0.05).map((k) => k.landed)), a);
    } else {
      const s = span(l, 0);
      add(s.leaving, s.landed, l.start ?? 0);
    }
  }
  const out: number[] = [];
  for (const [leaving, landed] of [...parts].sort((x, y) => x[0] - y[0])) {
    const t = r2(Math.min(leaving - 0.1, dur - 0.05));
    const arriving = spans.some((p) => p.from <= t && t < p.leaving && p.landed > t + 0.01);
    if (t >= landed - 0.01 && t >= 0 && !arriving && !out.some((o) => Math.abs(o - t) < 1)) out.push(t);
  }
  return out.slice(0, 16);
}

interface R { l: number; t: number; r: number; b: number }
const area = (r: R) => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);
const inter = (a: R, b: R): R => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
const union = (rs: R[]): R => ({ l: Math.min(...rs.map((r) => r.l)), t: Math.min(...rs.map((r) => r.t)), r: Math.max(...rs.map((r) => r.r)), b: Math.max(...rs.map((r) => r.b)) });

/** How visible an element really is: its own opacity times every ancestor's, up to the canvas. */
function seen(el: HTMLElement, stop: HTMLElement): number {
  let o = 1;
  for (let e: HTMLElement | null = el; e && e !== stop; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
    o *= Number(cs.opacity);
  }
  return o;
}

/**
 * The words' own ink on screen (their line boxes, as far as they can be seen), not the layer's box. Letters a preset
 * hides (the spare digits of a rolling number, words still masked) are left out: each run of text is clipped to the
 * boxes around it that hide what overflows, and runs that are see-through or hidden don't count. A pill counts as its
 * whole pill.
 */
function inkOf(el: HTMLElement, layer: Layer): R | null {
  const inner = el.querySelector<HTMLElement>('.upw-li') ?? el;
  if (layer.type === 'text' && layer.pill) {
    const b = inner.getBoundingClientRect();
    return b.width ? { l: b.left, t: b.top, r: b.right, b: b.bottom } : null;
  }
  const host = el.querySelector<HTMLElement>('.upw-txt') ?? inner;
  const doc = el.ownerDocument;
  const rects: R[] = [];
  const walker = doc.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim() || !n.parentElement) continue;
    let clip: R | null = null;
    let hidden = false;
    for (let e: HTMLElement | null = n.parentElement; e && e !== el.parentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.3) { hidden = true; break; }
      if (cs.overflow !== 'visible' || cs.clipPath !== 'none') {
        const b = e.getBoundingClientRect();
        const c = { l: b.left, t: b.top, r: b.right, b: b.bottom };
        clip = clip ? inter(clip, c) : c;
      }
    }
    if (hidden) continue;
    const range = doc.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      let x: R = { l: r.left, t: r.top, r: r.right, b: r.bottom };
      if (clip) x = inter(x, clip);
      if (x.r - x.l > 1 && x.b - x.t > 1) rects.push(x);
    }
  }
  return rects.length ? union(rects) : null;
}

/** Measures the frame on screen now. `stage` is the player's canvas; `scene` names the layers. */
export function layoutIssues(stage: HTMLElement, scene: Scene, t: number): LayoutIssue[] {
  const S = stage.getBoundingClientRect();
  if (!S.width || !S.height) return [];
  const W = S.width;
  const pct = (px: number) => (px / W) * 100;
  const byId = new Map<string, Layer>();
  const walk = (ls: Layer[]) => ls.forEach((l) => { byId.set(l.id, l); if (l.type === 'group') walk(l.layers); });
  walk(scene.layers);
  const name = (id: string) => {
    const l = byId.get(id);
    return l?.name && l.name !== l.id ? l.name : l?.type === 'text' ? `"${l.text.split('\n')[0].slice(0, 30)}"` : id;
  };

  type Item = { id: string; layer: Layer; el: HTMLElement; box: R; ink: R | null; size: number };
  const items: Item[] = [];
  for (const el of stage.querySelectorAll<HTMLElement>('[data-layer]')) {
    const id = el.dataset.layer!;
    const layer = byId.get(id);
    if (!layer || layer.type === 'group' || el.dataset.hidden !== undefined || el.dataset.ref !== undefined) continue;
    if (seen(el, stage) < 0.6) continue;
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    const ink = layer.type === 'text' ? inkOf(el, layer) : null;
    const inner = el.querySelector<HTMLElement>('.upw-li') ?? el;
    items.push({ id, layer, el, box: { l: b.left, t: b.top, r: b.right, b: b.bottom }, ink, size: parseFloat(getComputedStyle(inner).fontSize) || 0 });
  }
  const issues: LayoutIssue[] = [];
  const push = (key: string, severity: 'warn' | 'info', message: string, layerId?: string) =>
    issues.push({ id: `layout:${key}@${t}`, severity, message, t, layerId });
  const texts = items.filter((i) => i.ink);
  const stageR: R = { l: S.left, t: S.top, r: S.right, b: S.bottom };

  // Words off the stage.
  for (const i of texts) {
    const ink = i.ink!;
    const over = Math.max(stageR.l - ink.l, ink.r - stageR.r, stageR.t - ink.t, ink.b - stageR.b);
    if (pct(over) > 0.5) push(`off:${i.id}`, 'warn', `${name(i.id)} runs off the stage.`, i.id);
  }

  // Words on words.
  for (let a = 0; a < texts.length; a++) {
    for (let b = a + 1; b < texts.length; b++) {
      const A = texts[a], B = texts[b];
      const x = area(inter(A.ink!, B.ink!));
      if (x > 0.12 * Math.min(area(A.ink!), area(B.ink!))) push(`overlap:${A.id}:${B.id}`, 'warn', `${name(A.id)} overlaps ${name(B.id)}.`, B.id);
    }
  }

  // Words crossing or crowding the edge of a panel (a rectangle that isn't a backdrop).
  // A panel has an edge you can see: an outline, or a fill that doesn't fade away (a soft glow or a faint wash is
  // decoration, not a box).
  const hasEdge = (l: Layer) => {
    if (l.type !== 'shape') return false;
    if (l.stroke) return true;
    const fill = String(l.fill ?? '');
    if (!fill || /gradient/i.test(fill) && /transparent|rgba\([^)]*,\s*0(\.0+)?\s*\)|#[0-9a-f]{6}00/i.test(fill)) return false;
    const alpha = /rgba\([^)]*,\s*([\d.]+)\s*\)/i.exec(fill);
    return !(alpha && Number(alpha[1]) < 0.3);
  };
  const panels = items.filter((i) => i.layer.type === 'shape' && i.layer.shape !== 'ellipse' && hasEdge(i.layer) && area(i.box) < 0.6 * W * S.height && area(i.box) > 0.01 * W * S.height);
  for (const i of texts) {
    const ink = i.ink!;
    for (const p of panels) {
      const x = area(inter(ink, p.box));
      if (x <= 0) continue;
      if (x < area(ink) * 0.98) { push(`cross:${i.id}:${p.id}`, 'warn', `${name(i.id)} crosses the edge of ${name(p.id)}.`, i.id); continue; }
      const gap = Math.min(ink.l - p.box.l, p.box.r - ink.r, ink.t - p.box.t, p.box.b - ink.b);
      if (pct(gap) < 0.8) push(`tight:${i.id}:${p.id}`, 'info', `${name(i.id)} touches the edge of ${name(p.id)}: give it some room inside the panel.`, i.id);
    }
  }

  // A tick (or other mark beside words) far from the words.
  for (const i of texts) {
    for (const mark of i.el.querySelectorAll<HTMLElement>('.upw-tick')) {
      if (Number(getComputedStyle(mark).opacity) < 0.5) continue;
      const m = mark.getBoundingClientRect();
      const ink = i.ink!;
      const gap = m.right <= ink.l ? ink.l - m.right : m.left >= ink.r ? m.left - ink.r : 0;
      if (gap > m.width * 1.5) push(`tick:${i.id}`, 'warn', `The tick beside ${name(i.id)} sits ${Math.round(pct(gap))}% of the stage away from its words.`, i.id);
    }
  }

  // Lists: three or more lines of the same size, one under another.
  const used = new Set<string>();
  for (const seed of texts) {
    if (used.has(seed.id)) continue;
    const same = texts.filter((o) => !used.has(o.id) && Math.abs(o.size - seed.size) <= seed.size * 0.04 && Math.abs((o.ink!.t + o.ink!.b) / 2 - (seed.ink!.t + seed.ink!.b) / 2) < S.height * 0.6);
    const col = same.filter((o) => {
      const c = (o.ink!.l + o.ink!.r) / 2, sc = (seed.ink!.l + seed.ink!.r) / 2;
      return Math.abs(o.ink!.l - seed.ink!.l) < W * 0.01 || Math.abs(c - sc) < W * 0.01 || Math.abs(o.ink!.r - seed.ink!.r) < W * 0.01;
    }).sort((x, y) => x.ink!.t - y.ink!.t);
    if (col.length < 3) continue;
    col.forEach((o) => used.add(o.id));
    const gaps = col.slice(1).map((o, k) => o.ink!.t - col[k].ink!.t);
    const mean = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    if (gaps.some((g) => Math.abs(g - mean) > mean * 0.2)) push(`rhythm:${col[0].id}`, 'info', `The list starting ${name(col[0].id)} has uneven gaps between its lines.`, col[0].id);
    // Off-centre under a centred heading above it.
    const list = union(col.map((o) => o.ink!));
    // Off-centre under a heading only matters for a list in the open, not one inside a panel (a menu, a sidebar).
    const inPanel = panels.some((p) => area(inter(list, p.box)) >= area(list) * 0.9);
    const heading = inPanel ? undefined : texts.filter((h) => !col.includes(h) && h.ink!.b <= list.t && h.size > seed.size * 1.15).sort((x, y) => y.ink!.b - x.ink!.b)[0];
    if (heading) {
      const hc = (heading.ink!.l + heading.ink!.r) / 2, lc = (list.l + list.r) / 2;
      const stageC = (S.left + S.right) / 2;
      if (Math.abs(hc - stageC) < W * 0.02 && pct(Math.abs(lc - hc)) > 4) push(`centre:${col[0].id}`, 'info', `The list under ${name(heading.id)} sits ${Math.round(pct(Math.abs(lc - hc)))}% of the stage off its centre.`, col[0].id);
    }
  }
  return issues;
}
