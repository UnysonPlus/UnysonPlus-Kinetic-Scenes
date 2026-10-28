import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { findLayer } from './sceneOps';

/**
 * Point at the frame to change it: what the AI is told about the pointed element, and, after it answers, the values it
 * changed on that element as fields to adjust by hand.
 */

const r2 = (x: number) => Math.round(x * 100) / 100;

/** A line about the element and the moment, for the AI. */
export function pointContext(scene: Scene, layerId: string, time: number): string {
  const l = findLayer(scene, layerId);
  if (!l) return '';
  const what = l.type === 'text' ? `text "${(l as { text?: string }).text ?? ''}"` : l.type;
  const on = (l.start ?? 0) <= time && (typeof l.end !== 'number' || l.end > time);
  return `POINTED AT: layer "${l.id}" (${what}${l.name ? `, named "${l.name}"` : ''}) at ${r2(time)} s in the scene${on ? '' : ' (it is not on screen at that moment)'}.
Change ONLY this layer (its properties and its own clips). Every other layer, the sound and all timing outside this layer stay exactly as they are. Answer in one sentence.`;
}

export interface PointField { path: string; label: string; value: string | number; kind: 'text' | 'number' | 'color' }

const LABELS: Record<string, string> = {
  text: 'Text', 'style.color': 'Colour', 'style.fontSize': 'Size', 'style.fontWeight': 'Weight', 'style.letterSpacing': 'Letter spacing',
  fill: 'Fill', stroke: 'Outline', 'box.x': 'Across', 'box.y': 'Down', 'box.w': 'Width', start: 'Comes on at', end: 'Goes off at', radius: 'Corners',
};
const isColor = (v: unknown) => typeof v === 'string' && /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\()/i.test(v);

/** Leaf values of a layer by path: clips by id ("clips.pop1.duration"), objects by key. */
function leaves(v: unknown, path = '', out = new Map<string, unknown>()): Map<string, unknown> {
  if (v === null || typeof v !== 'object') { if (path) out.set(path, v); return out; }
  if (Array.isArray(v)) {
    v.forEach((x, i) => leaves(x, `${path}.${x && typeof x === 'object' && 'id' in x ? (x as { id: string }).id : i}`, out));
    return out;
  }
  for (const [k, x] of Object.entries(v)) if (k !== 'id' && k !== 'track' && k !== 'words') leaves(x, path ? `${path}.${k}` : k, out);
  return out;
}

/** What changed on the layer: up to eight text, number and colour values, as fields. */
export function changedFields(before: Scene, after: Scene, layerId: string): PointField[] {
  const a = findLayer(before, layerId), b = findLayer(after, layerId);
  if (!b) return [];
  const old = leaves(a ?? {}), now = leaves(b);
  const out: PointField[] = [];
  for (const [path, value] of now) {
    if (old.get(path) === value || (typeof value !== 'string' && typeof value !== 'number')) continue;
    if (typeof value === 'string' && value.length > 200) continue;
    const clip = /^clips\.([^.]+)\.(.+)$/.exec(path);
    const label = LABELS[path] ?? (clip ? `${clip[1]}: ${clip[2].replace(/^params\./, '')}` : path.replace(/\./g, ' '));
    out.push({ path, label, value, kind: typeof value === 'number' ? 'number' : isColor(value) ? 'color' : 'text' });
    if (out.length >= 8) break;
  }
  return out;
}

/** The scene with one value of the layer set (the path as changedFields gives it). */
export function setField(scene: Scene, layerId: string, path: string, value: string | number): Scene {
  const set = (obj: unknown, keys: string[]): unknown => {
    if (!keys.length) return value;
    const [k, ...rest] = keys;
    if (Array.isArray(obj)) return obj.map((x, i) => ((x && typeof x === 'object' && 'id' in x ? (x as { id: string }).id === k : String(i) === k) ? set(x, rest) : x));
    const o = (obj && typeof obj === 'object' ? obj : {}) as Record<string, unknown>;
    return { ...o, [k]: set(o[k], rest) };
  };
  const walk = (ls: Layer[]): Layer[] => ls.map((l) => (l.id === layerId ? (set(l, path.split('.')) as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l));
  return { ...scene, layers: walk(scene.layers) };
}
