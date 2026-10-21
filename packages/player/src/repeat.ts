import type { Clip, Layer, RepeatLayer, Scene } from './types';

/**
 * Repeat from a list: a repeat layer is one designed item plus a list of entries. Before playing, it
 * becomes a group holding one copy of the item per entry: each copy's words take the entry's values
 * ({{field}} placeholders), it sits one step further along (a row, a column or a grid), and its clips
 * start one stagger later. The group keeps the repeat's id, so selecting, moving and animating it as a
 * whole works like any group; the copies' ids are derived from it.
 */

const fill = (s: string, entry: Record<string, unknown>) =>
  s.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k: string) => (entry[k] === undefined || entry[k] === null ? '' : String(entry[k])));

function copyOf(layer: Layer, entry: Record<string, unknown>, index: number, prefix: string, dx: number, dy: number, delay: number): Layer {
  const id = `${prefix}${layer.id}`;
  const clips: Clip[] = layer.clips.map((c) => ({
    ...c,
    id: `${prefix}${c.id}`,
    start: c.start + delay,
    params: c.params ? JSON.parse(fill(JSON.stringify(c.params), entry)) : c.params,
  }));
  const base = { ...layer, id, clips } as Layer & Record<string, unknown>;
  if (layer.link) base.link = { ...layer.link, href: fill(layer.link.href, entry), label: layer.link.label ? fill(layer.link.label, entry) : undefined };
  if (layer.name) base.name = `${fill(layer.name, entry)} ${index + 1}`;
  if (layer.type === 'group') {
    // The contents run on the group's clock, which starts with the group, so they take the delay too.
    return { ...base, type: 'group', layers: layer.layers.map((c) => copyOf(c, entry, index, prefix, dx, dy, delay)) } as Layer;
  }
  const box = layer.box ? { ...layer.box, x: layer.box.x + dx, y: layer.box.y + dy } : layer.box;
  const out = { ...base, box } as Record<string, unknown>;
  if (layer.overrides) {
    out.overrides = Object.fromEntries(Object.entries(layer.overrides).map(([bp, o]) => [bp, {
      ...o,
      ...(o.box ? { box: { ...o.box, ...(typeof o.box.x === 'number' ? { x: o.box.x + dx } : {}), ...(typeof o.box.y === 'number' ? { y: o.box.y + dy } : {}) } } : {}),
      ...(typeof o.text === 'string' ? { text: fill(o.text, entry) } : {}),
    }]));
  }
  for (const k of ['text', 'alt', 'src', 'code', 'title', 'd'] as const) if (typeof out[k] === 'string') out[k] = fill(out[k] as string, entry);
  if (layer.type === 'model' && layer.model.text) out.model = { ...layer.model, text: fill(layer.model.text, entry) };
  if (layer.type === 'diagram') out.nodes = layer.nodes.map((n) => ({ ...n, label: n.label ? fill(n.label, entry) : n.label, sub: n.sub ? fill(n.sub, entry) : n.sub }));
  if (layer.type === 'flow') { out.from = `${prefix}${layer.from}`; out.to = `${prefix}${layer.to}`; }
  return out as unknown as Layer;
}

/** The repeat layer as the group it becomes. */
export function expandRepeat(r: RepeatLayer): Layer {
  const items = Array.isArray(r.items) ? r.items.slice(0, 200) : [];
  const cols = Math.max(1, Math.round(r.columns ?? 1));
  const sx = r.step?.x ?? (cols > 1 ? 20 : 0);
  const sy = r.step?.y ?? (cols > 1 ? 0 : 12);
  const rowStep = r.rowStep ?? (cols > 1 ? Math.max(8, Math.abs(sy) || 12) : 0);
  const stagger = r.stagger ?? 0.12;
  const layers = items.map((entry, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const dx = cols > 1 ? col * sx : i * sx;
    const dy = cols > 1 ? row * rowStep : i * sy;
    return copyOf(r.item, entry ?? {}, i, `${r.id}_${i}_`, dx, dy, i * stagger);
  });
  const { item: _item, items: _items, step: _step, columns: _c, stagger: _s, rowStep: _r, ...rest } = r;
  return { ...rest, type: 'group', fromRepeat: true, layers } as unknown as Layer;
}

/** The scene with every repeat layer (at any depth) turned into its group. */
export function expandRepeats(scene: Scene): Scene {
  let any = false;
  const walk = (list: Layer[]): Layer[] => list.map((l) => {
    if (l.type === 'repeat') { any = true; return expandRepeat(l); }
    if (l.type === 'group') { const inner = walk(l.layers); return inner === l.layers ? l : { ...l, layers: inner }; }
    return l;
  });
  const layers = walk(scene.layers);
  return any ? { ...scene, layers } : scene;
}
