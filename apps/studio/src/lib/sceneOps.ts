import { SAMPLE_LOTTIE } from './lottieSample';
import type { Box, Clip, GroupLayer, Layer, LayerOverride, RepeatLayer, Scene, TextStyle } from '@unysonplus/scene-player/types';
import { expandRepeat } from '@unysonplus/scene-player/repeat';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { allLayers } from '@unysonplus/scene-player/groups';

/**
 * Pure, immutable edits to a scene. Every editor action goes through one of these, so undo is just
 * keeping the previous scene object.
 *
 * Layers form a tree (groups hold layers), so lookups and edits search the whole tree. A "scope" is
 * the group being edited, or null for the top of the scene.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

function allIds(scene: Scene): Set<string> {
  const ids = new Set<string>();
  for (const l of allLayers(scene.layers)) {
    ids.add(l.id);
    for (const c of l.clips) ids.add(c.id);
  }
  return ids;
}

/** A short id that no layer or clip in the scene uses yet: "text-2", "fade-3"… */
export function uniqueId(scene: Scene, base: string): string {
  const ids = allIds(scene);
  const stem = base.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'item';
  if (!ids.has(stem)) return stem;
  for (let i = 2; ; i++) if (!ids.has(`${stem}-${i}`)) return `${stem}-${i}`;
}

/** Applies fn to every list of layers in the tree (the top list and each group's). */
function mapLists(list: Layer[], fn: (list: Layer[]) => Layer[]): Layer[] {
  return fn(list).map((l) => (l.type === 'group' ? { ...l, layers: mapLists(l.layers, fn) } : l));
}

export function mapLayer(scene: Scene, id: string, fn: (l: Layer) => Layer): Scene {
  const walk = (list: Layer[]): Layer[] =>
    list.map((l) => {
      if (l.id === id) return fn(l);
      return l.type === 'group' ? { ...l, layers: walk(l.layers) } : l;
    });
  return { ...scene, layers: walk(scene.layers) };
}

export function mapClip(scene: Scene, layerId: string, clipId: string, fn: (c: Clip) => Clip): Scene {
  return mapLayer(scene, layerId, (l) => ({ ...l, clips: l.clips.map((c) => (c.id === clipId ? fn(c) : c)) }));
}

export function findLayer(scene: Scene, id: string | null): Layer | undefined {
  return id ? allLayers(scene.layers).find((l) => l.id === id) : undefined;
}

export function findClip(scene: Scene, layerId: string | null, clipId: string | null): Clip | undefined {
  return findLayer(scene, layerId)?.clips.find((c) => c.id === clipId);
}

/** The id of the group that holds a layer, or null when it sits at the top of the scene. */
export function containerOf(scene: Scene, id: string): string | null {
  for (const l of allLayers(scene.layers)) {
    if (l.type === 'group' && l.layers.some((c) => c.id === id)) return l.id;
  }
  return null;
}

/** The layers directly inside a scope (null = the top of the scene). */
export function layersIn(scene: Scene, scope: string | null): Layer[] {
  if (!scope) return scene.layers;
  const g = findLayer(scene, scope);
  return g && g.type === 'group' ? g.layers : [];
}

/** Replaces the layers directly inside a scope. */
function setLayersIn(scene: Scene, scope: string | null, layers: Layer[]): Scene {
  if (!scope) return { ...scene, layers };
  return mapLayer(scene, scope, (g) => ({ ...(g as GroupLayer), layers }));
}

/** The groups from the top of the scene down to a scope, outermost first. */
export function scopePath(scene: Scene, scope: string | null): GroupLayer[] {
  const out: GroupLayer[] = [];
  let cur = scope;
  while (cur) {
    const g = findLayer(scene, cur);
    if (!g || g.type !== 'group') break;
    out.unshift(g);
    cur = containerOf(scene, cur);
  }
  return out;
}

/** The widest breakpoint: editing while it is showing changes the base layout. */
export const primaryBreakpoint = (scene: Scene) => scene.stage.breakpoints[0]?.id ?? null;

/** True when edits made at this breakpoint go into an override rather than the base layout. */
export function editsOverride(scene: Scene, layer: Layer, bp: string | null): boolean {
  if (!bp) return false;
  return bp !== primaryBreakpoint(scene) || !!layer.overrides?.[bp];
}

export interface LayoutPatch {
  box?: Partial<Box>;
  style?: Partial<TextStyle>;
  text?: string;
}

/**
 * Writes position, size, type or text for the breakpoint being edited: into the base layout at the
 * widest breakpoint, into that breakpoint's override everywhere else. Groups have no layout of their
 * own (their frame is measured), so they are left alone; use moveBy to move one.
 */
export function writeLayout(scene: Scene, layerId: string, bp: string | null, patch: LayoutPatch): Scene {
  return mapLayer(scene, layerId, (layer) => {
    if (layer.type === 'group') return layer;
    if (!editsOverride(scene, layer, bp)) {
      const next = { ...layer, box: { ...layer.box, ...(patch.box ?? {}) } } as Layer;
      if (next.type === 'text') {
        if (patch.style) next.style = { ...next.style, ...patch.style };
        if (patch.text !== undefined) next.text = patch.text;
      }
      return next;
    }
    const prev: LayerOverride = layer.overrides?.[bp!] ?? {};
    const o: LayerOverride = { ...prev };
    if (patch.box) o.box = { ...(prev.box ?? {}), ...patch.box };
    if (patch.style && layer.type === 'text') o.style = { ...(prev.style ?? {}), ...patch.style };
    if (patch.text !== undefined && layer.type === 'text') o.text = patch.text;
    return { ...layer, overrides: { ...(layer.overrides ?? {}), [bp!]: o } };
  });
}

/** The layer's box at a breakpoint, overrides included. */
export function boxAt(layer: Layer, bp: string | null): Box {
  return { ...(layer.box ?? { x: 0, y: 0 }), ...((bp && layer.overrides?.[bp]?.box) || {}) };
}

/** Moves a layer, or everything inside a group, by an offset in stage percentages. */
export function moveBy(scene: Scene, id: string, dx: number, dy: number, bp: string | null): Scene {
  const layer = findLayer(scene, id);
  if (!layer || (!dx && !dy)) return scene;
  // A list moves its item (every copy follows it).
  if (layer.type === 'repeat') return mapLayer(scene, id, (l) => ({ ...l, item: shiftLayer((l as RepeatLayer).item, dx, dy) }) as Layer);
  if (layer.type !== 'group') {
    const b = boxAt(layer, bp);
    return writeLayout(scene, id, bp, { box: { x: r2(b.x + dx), y: r2(b.y + dy) } });
  }
  let next = scene;
  for (const child of layer.layers) next = moveBy(next, child.id, dx, dy, bp);
  return next;
}

/** A layer (and, for a group, everything in it) moved by dx, dy (% of the stage), in its base layout. */
function shiftLayer(l: Layer, dx: number, dy: number): Layer {
  if (l.type === 'group') return { ...l, layers: l.layers.map((c) => shiftLayer(c, dx, dy)) };
  if (!l.box) return l;
  return { ...l, box: { ...l.box, x: r2(l.box.x + dx), y: r2(l.box.y + dy) } } as Layer;
}

/** Turns a group into a list whose item is that group (one entry to start with). */
export function groupToRepeat(scene: Scene, id: string): Scene {
  return mapLayer(scene, id, (l) => {
    if (l.type !== 'group') return l;
    const { id: gid, name, start, end, link, pin, ...rest } = l;
    return { id: gid, name: name ? `${name} list` : 'List', type: 'repeat', start, end, link, pin, item: { ...rest, id: `${gid}-item`, clips: l.clips } as Layer, items: [{}], step: { y: 12 }, stagger: 0.12, clips: [] } as unknown as Layer;
  });
}

/** Turns a list into an ordinary group of its copies, each editable on its own. */
export function repeatToGroup(scene: Scene, id: string): Scene {
  return mapLayer(scene, id, (l) => {
    if (l.type !== 'repeat') return l;
    const { fromRepeat: _f, ...g } = expandRepeat(l) as GroupLayer;
    return g as Layer;
  });
}

export function clearOverride(scene: Scene, layerId: string, bp: string): Scene {
  return mapLayer(scene, layerId, (layer) => {
    if (!layer.overrides?.[bp]) return layer;
    const { [bp]: _gone, ...rest } = layer.overrides;
    return { ...layer, overrides: Object.keys(rest).length ? rest : undefined };
  });
}

/** Base properties that never vary by breakpoint (name, timing, fill, image source…). */
export function setLayerProps(scene: Scene, layerId: string, props: Record<string, unknown>): Scene {
  return mapLayer(scene, layerId, (l) => {
    const next = { ...l, ...props } as Record<string, unknown>;
    for (const [k, v] of Object.entries(props)) if (v === undefined) delete next[k];
    return next as unknown as Layer;
  });
}

/** Adds a new layer on top of the given scope (null = the top of the scene). */
export function addLayer(scene: Scene, type: Exclude<Layer['type'], 'group'>, extra: Partial<Layer> = {}, scope: string | null = null): { scene: Scene; id: string } {
  const id = uniqueId(scene, type);
  let layer: Layer;
  if (type === 'text') {
    layer = {
      id, type: 'text', name: 'Text', text: 'Your headline',
      style: { fontFamily: scene.stage.fonts?.[0]?.family, fontSize: 6, fontWeight: 800, color: '#f4f6f8' },
      box: { x: 50, y: 50 }, clips: [],
    };
  } else if (type === 'shape') {
    layer = { id, type: 'shape', name: 'Shape', shape: 'rect', fill: '#2ad38b', radius: 1, box: { x: 50, y: 50, w: 20, h: 20 }, clips: [] };
  } else if (type === 'model') {
    layer = {
      id, type: 'model', name: '3D', model: { kind: 'text', text: '3D', depth: 0.35, bevel: 0.45 },
      material: { color: '#2ad38b', finish: 'glossy' }, pose: { rx: 8, ry: -20 }, alt: '',
      box: { x: 50, y: 50, w: 36, ratio: 1.6 }, clips: [],
    };
  } else if (type === 'lottie') {
    layer = { id, type: 'lottie', name: 'Lottie', src: SAMPLE_LOTTIE, loop: true, alt: '', box: { x: 50, y: 50, w: 30, ratio: 1.25 }, clips: [] };
  } else if (type === 'path') {
    layer = { id, type: 'path', name: 'Line', d: 'M 0 80 C 35 80, 65 20, 100 20', stroke: '#2ad38b', strokeWidth: 0.3, arrow: 'end', box: { x: 50, y: 50, w: 30, h: 20 }, clips: [] };
  } else if (type === 'cursor') {
    // It starts just off the right edge, so it enters rather than appears.
    layer = { id, type: 'cursor', name: 'Cursor', box: { x: 104, y: 70, w: 3.2, ratio: 0.7 }, clips: [] };
  } else if (type === 'repeat') {
    layer = {
      id, type: 'repeat', name: 'List', stagger: 0.12, step: { y: 12 },
      items: [{ title: 'First', sub: 'What it does' }, { title: 'Second', sub: 'What it does' }, { title: 'Third', sub: 'What it does' }],
      item: {
        id: 'row', type: 'group', clips: [], layers: [
          { id: 'card', type: 'shape', shape: 'rect', fill: '#151b23', stroke: '#2b3644', strokeWidth: 0.1, radius: 0.8, box: { x: 50, y: 30, w: 36, h: 9 }, clips: [{ id: 'card-in', preset: 'stack-in', start: 0.2, duration: 0.5 }] },
          { id: 'title', type: 'text', text: '{{title}}', style: { fontSize: 2, fontWeight: 700, color: '#f4f6f8' }, box: { x: 34, y: 28.6, anchor: 'left' }, clips: [{ id: 'title-in', preset: 'fade', start: 0.35, duration: 0.4 }] },
          { id: 'sub', type: 'text', text: '{{sub}}', style: { fontSize: 1.2, color: '#2ad38b' }, box: { x: 34, y: 32, anchor: 'left' }, clips: [{ id: 'sub-in', preset: 'fade', start: 0.45, duration: 0.4 }] },
        ],
      },
      clips: [],
    } as Layer;
  } else if (type === 'captions') {
    layer = { id, type: 'captions', name: 'Captions', style: { fontSize: 3, fontWeight: 800, color: '#ffffff' }, highlight: '#ffd166', box: { x: 50, y: 86 }, clips: [] };
  } else if (type === 'code') {
    layer = {
      id, type: 'code', name: 'Code', title: 'main.py', run: true, box: { x: 50, y: 50, w: 46, h: 56 },
      code: 'name = input("Your name: ")\nprint("Hello, " + name)',
      clips: [{ id: `${id}-type`, preset: 'code-type', start: 0.3, duration: 2.4 }],
    };
  } else if (type === 'diagram') {
    layer = {
      id, type: 'diagram', name: 'Diagram', box: { x: 50, y: 50, w: 60, h: 30 },
      nodes: [
        { id: 'a', x: 12, y: 50, label: 'Input' }, { id: 'b', x: 50, y: 50, label: 'Process', at: 0.5 },
        { id: 'c', x: 88, y: 50, label: 'Output', at: 1, color: '#2ad38b' },
      ],
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }],
      clips: [],
    };
  } else if (type === 'flow') {
    // Joins the two layers on top, if there are two to join.
    const others = layersIn(scene, scope).filter((l) => l.type !== 'flow').slice(-2);
    layer = { id, type: 'flow', name: 'Flow lines', from: others[0]?.id ?? '', to: others[1]?.id ?? others[0]?.id ?? '', count: 7, pulses: 1, clips: [] };
  } else if (type === 'video') {
    // Footage fills the frame by default.
    layer = { id, type: 'video', name: 'Footage', src: '', fit: 'cover', box: { x: 50, y: 50, w: 100, h: 100 }, clips: [] };
  } else {
    layer = { id, type: 'image', name: 'Image', src: '', alt: '', fit: 'cover', radius: 1, box: { x: 50, y: 50, w: 30, ratio: 1.5 }, clips: [] };
  }
  layer = { ...layer, ...extra, id } as Layer;
  // Footage goes underneath everything (the graphics sit on top of it); everything else on top.
  const list = layersIn(scene, scope);
  return { scene: setLayersIn(scene, scope, type === 'video' ? [layer, ...list] : [...list, layer]), id };
}

/**
 * A clean slate: no layers, a short timeline, but the same stage set-up (screen sizes, height mode,
 * background, fonts) and playback, so the new scene drops into the same place on the page.
 */
/** The Studio's default stage colour (a new scene starts on it). */
export const DEFAULT_BACKGROUND = 'radial-gradient(120% 90% at 50% 40%, #121a20 0%, #0a0d11 70%)';

/**
 * A clean slate that keeps the set-up: screen sizes, height settings, safe area, fonts and playback.
 * Everything that belonged to the old scene goes (layers, sound, markers, camera, its background).
 */
export function blankScene(from: Scene): Scene {
  const { breakpoints, heightMode, heightOffset, safeArea, fonts } = from.stage;
  return {
    format: from.format,
    version: from.version,
    title: 'Untitled',
    duration: 6,
    stage: { breakpoints, heightMode, ...(heightOffset ? { heightOffset } : {}), ...(safeArea !== undefined ? { safeArea } : {}), ...(fonts?.length ? { fonts } : {}), background: DEFAULT_BACKGROUND },
    playback: { ...from.playback, posterTime: undefined },
    layers: [],
    // A blank video stays a video, in the same formats.
    ...(from.mode === 'video' && from.video ? { mode: 'video' as const, video: from.video } : {}),
  };
}

export function removeLayer(scene: Scene, id: string): Scene {
  return { ...scene, layers: mapLists(scene.layers, (list) => list.filter((l) => l.id !== id)) };
}

/** A deep copy with fresh ids for the layer, everything inside it and all their clips. */
function cloneFresh(src: Layer, taken: Set<string>): Layer {
  const fresh = (base: string) => {
    let n = 2;
    while (taken.has(`${base}-${n}`)) n++;
    const out = `${base}-${n}`;
    taken.add(out);
    return out;
  };
  const copy: Layer = JSON.parse(JSON.stringify(src));
  const walk = (l: Layer) => {
    l.id = fresh(l.id);
    l.clips = l.clips.map((c) => ({ ...c, id: fresh(c.id) }));
    if (l.type === 'group') l.layers.forEach(walk);
  };
  walk(copy);
  return copy;
}

export function duplicateLayer(scene: Scene, id: string, bp: string | null = null): { scene: Scene; id: string } {
  const scope = containerOf(scene, id);
  const list = layersIn(scene, scope);
  const idx = list.findIndex((l) => l.id === id);
  if (idx < 0) return { scene, id };
  const src = list[idx];
  const copy = cloneFresh(src, allIds(scene));
  copy.name = `${src.name || src.id} copy`;
  const layers = [...list];
  layers.splice(idx + 1, 0, copy);
  // Offset the copy a little so it doesn't sit exactly on top of the original.
  return { scene: moveBy(setLayersIn(scene, scope, layers), copy.id, 2, 2, bp), id: copy.id };
}

/** Moves a layer one step up (drawn later, on top) or down within its own group. */
export function moveLayer(scene: Scene, id: string, dir: 1 | -1): Scene {
  const scope = containerOf(scene, id);
  const layers = [...layersIn(scene, scope)];
  const i = layers.findIndex((l) => l.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= layers.length) return scene;
  [layers[i], layers[j]] = [layers[j], layers[i]];
  return setLayersIn(scene, scope, layers);
}

/**
 * Puts layers into a new group, in their current stacking order, where the topmost of them was.
 * Only layers in the same group as the first one are taken. Nothing moves on the stage, and since the
 * new group starts at 0 nothing moves in time either.
 */
export function groupLayers(scene: Scene, ids: string[]): { scene: Scene; id: string } | null {
  if (!ids.length) return null;
  const scope = containerOf(scene, ids[0]);
  const list = layersIn(scene, scope);
  const picked = list.filter((l) => ids.includes(l.id));
  if (!picked.length) return null;
  const top = Math.max(...picked.map((l) => list.indexOf(l)));
  const id = uniqueId(scene, 'group');
  const group: GroupLayer = { id, type: 'group', name: 'Group', layers: picked, clips: [] };
  const rest: Layer[] = [];
  list.forEach((l, i) => {
    if (i === top) rest.push(group);
    if (!ids.includes(l.id)) rest.push(l);
  });
  return { scene: setLayersIn(scene, scope, rest), id };
}

/** Shifts a layer (and, for a group, nothing inside it: its contents run on its clock) in time. */
function shiftTime(layer: Layer, by: number): Layer {
  if (!by) return layer;
  return {
    ...layer,
    start: r2((layer.start ?? 0) + by) || undefined,
    end: typeof layer.end === 'number' ? r2(layer.end + by) : undefined,
    clips: layer.clips.map((c) => ({ ...c, start: r2(c.start + by) })),
  } as Layer;
}

/**
 * Takes a group's layers back out into its parent, where the group was. Their timing is converted
 * from the group's clock to the parent's, so nothing moves in time. Clips on the group itself (it no
 * longer exists) are dropped; the count is returned so the editor can say so.
 */
export function ungroupLayer(scene: Scene, id: string): { scene: Scene; dropped: number } | null {
  const g = findLayer(scene, id);
  if (!g || g.type !== 'group') return null;
  const scope = containerOf(scene, id);
  const list = layersIn(scene, scope);
  const out: Layer[] = [];
  for (const l of list) {
    if (l.id === id) out.push(...g.layers.map((c) => shiftTime(c, g.start ?? 0)));
    else out.push(l);
  }
  return { scene: setLayersIn(scene, scope, out), dropped: g.clips.length };
}

/** Adds a preset clip at a time on the layer's own clock; `limit` is that clock's length. */
export function addClip(scene: Scene, layerId: string, presetId: string, at: number, limit = scene.duration): { scene: Scene; id: string } | null {
  const meta = presetMeta[presetId];
  const layer = findLayer(scene, layerId);
  if (!meta || !layer || !meta.appliesTo.includes(layer.type)) return null;
  const duration = Math.min(meta.defaultDuration, limit);
  const start = r2(Math.max(0, Math.min(at, limit - duration)));
  const id = uniqueId(scene, presetId.replace(/^text-/, ''));
  const clip: Clip = { id, preset: presetId, start, duration: r2(duration) };
  if (presetId === 'keyframes') clip.params = { frames: [{ t: 0, scale: 1 }, { t: r2(duration), scale: 1.1 }] };
  return { scene: mapLayer(scene, layerId, (l) => ({ ...l, clips: [...l.clips, clip] })), id };
}

export function removeClip(scene: Scene, layerId: string, clipId: string): Scene {
  return mapLayer(scene, layerId, (l) => ({ ...l, clips: l.clips.filter((c) => c.id !== clipId) }));
}

export function setClip(scene: Scene, layerId: string, clipId: string, props: Partial<Clip>): Scene {
  return mapClip(scene, layerId, clipId, (c) => {
    const next = { ...c, ...props } as Record<string, unknown>;
    for (const [k, v] of Object.entries(props)) if (v === undefined) delete next[k];
    return next as unknown as Clip;
  });
}

export function setClipParam(scene: Scene, layerId: string, clipId: string, key: string, value: unknown): Scene {
  return mapClip(scene, layerId, clipId, (c) => ({ ...c, params: { ...(c.params ?? {}), [key]: value } }));
}

export const roundTime = r2;
