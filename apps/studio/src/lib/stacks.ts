import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { addClip, findLayer, setClip } from './sceneOps';

/**
 * Effect stacks: named combinations of presets that make a short-form moment together (a punch-in, a beat drop, a
 * glitch hit…), added to one layer at one moment in a single step. Every clip they add is an ordinary clip, to move,
 * trim or delete like any other.
 */

type Part = { preset: string; at: number; duration?: number; params?: Clip['params']; sound?: Clip['sound'] };
export interface Stack {
  id: string;
  name: string;
  hint: string;
  /** Layer types it suits. */
  for: Layer['type'][];
  /** The clips, from the moment t (and the next beat after it, when there is one). */
  parts: (t: number, next: number) => Part[];
}

const PICTURE: Layer['type'][] = ['video', 'image', 'shape', 'group'];
const ANY: Layer['type'][] = ['text', 'shape', 'image', 'video', 'group', 'captions', 'path', 'model', 'code', 'diagram', 'flow', 'repeat'];

export const STACKS: Stack[] = [
  { id: 'punch-in', name: 'Punch-in', hint: 'A sharp zoom in on the middle, held, then back out: the talking-head punch on a key word', for: PICTURE,
    parts: (t) => [
      { preset: 'snap-zoom', at: t, duration: 0.2, params: { direction: 'in', zoom: 1.35, x: 50, y: 42 }, sound: { name: 'whoosh', volume: 0.35 } },
      { preset: 'snap-zoom', at: t + 1, duration: 0.2, params: { direction: 'out', zoom: 1.35, x: 50, y: 42 } },
    ] },
  { id: 'beat-drop', name: 'Beat drop', hint: 'Zoom in and shake on the beat, back out on the next one, with an impact', for: PICTURE,
    parts: (t, next) => [
      { preset: 'snap-zoom', at: t, duration: 0.15, params: { direction: 'in', zoom: 1.25, x: 50, y: 50 }, sound: { name: 'impact', volume: 0.5 } },
      { preset: 'shake', at: t, duration: 0.45, params: { strength: 14 } },
      { preset: 'snap-zoom', at: Math.max(t + 0.4, next), duration: 0.15, params: { direction: 'out', zoom: 1.25, x: 50, y: 50 } },
    ] },
  { id: 'glitch-hit', name: 'Glitch hit', hint: 'A broken-signal moment: a hard shake and a flicker of noir, with a glitch sound', for: ANY,
    parts: (t) => [
      { preset: 'shake', at: t, duration: 0.3, params: { strength: 26 }, sound: { name: 'glitch', volume: 0.5 } },
      { preset: 'grade', at: t, duration: 0.05, params: { direction: 'in', look: 'noir' } },
      { preset: 'grade', at: t + 0.22, duration: 0.08, params: { direction: 'out', look: 'noir' } },
    ] },
  { id: 'impact', name: 'Impact', hint: 'Words hit: a swell, a burst of sparks and a small shake, with a pop', for: ['text', 'captions', 'shape', 'image', 'group'],
    parts: (t) => [
      { preset: 'pulse', at: t, duration: 0.45, params: { scale: 1.18, times: 1 }, sound: { name: 'pop', volume: 0.45 } },
      { preset: 'burst', at: t, duration: 0.7, params: { kind: 'sparks', count: 18 } },
      { preset: 'shake', at: t + 0.05, duration: 0.35, params: { strength: 8 } },
    ] },
  { id: 'whip-in', name: 'Whip in', hint: 'Arrives with a fast whip pan from the side, with a swish', for: ANY,
    parts: (t) => [
      { preset: 'tr-whip', at: t, duration: 0.5, params: { direction: 'in', from: 'right' }, sound: { name: 'swish', volume: 0.4 } },
    ] },
];

/** Beat times on the scene's clock, from music tracks that have their beats found. */
export function sceneBeats(scene: Scene): number[] {
  const out: number[] = [];
  for (const a of scene.audio ?? []) {
    if (!a.beats?.times?.length) continue;
    for (const bt of a.beats.times) {
      const t = (a.start ?? 0) + bt - (a.offset ?? 0);
      if (t >= 0 && t <= scene.duration && (a.duration == null || bt - (a.offset ?? 0) <= a.duration)) out.push(t);
    }
  }
  return out.sort((x, y) => x - y);
}

/** The moment to use: the nearest beat within 0.3 s of t (when there are beats), and the beat after it. */
export function onBeat(scene: Scene, t: number): { at: number; next: number; snapped: boolean } {
  const beats = sceneBeats(scene);
  if (!beats.length) return { at: t, next: t + 0.6, snapped: false };
  const near = beats.reduce((b, x) => (Math.abs(x - t) < Math.abs(b - t) ? x : b), beats[0]);
  const at = Math.abs(near - t) <= 0.3 ? near : t;
  const next = beats.find((x) => x > at + 0.2) ?? at + 0.6;
  return { at, next, snapped: at !== t };
}

/** Adds a stack to a layer at moment t: { scene, added: number of clips, at }. */
export function applyStack(scene: Scene, layerId: string, stack: Stack, t: number): { scene: Scene; added: number; at: number; snapped: boolean } {
  const layer = findLayer(scene, layerId);
  if (!layer || !stack.for.includes(layer.type)) return { scene, added: 0, at: t, snapped: false };
  const { at, next, snapped } = onBeat(scene, t);
  let s = scene;
  let added = 0;
  for (const p of stack.parts(at, next)) {
    const r = addClip(s, layerId, p.preset, Math.max(0, p.at));
    if (!r) continue;
    s = setClip(r.scene, layerId, r.id, { start: Math.round(Math.max(0, p.at) * 100) / 100, ...(p.duration ? { duration: p.duration } : {}), ...(p.params ? { params: p.params } : {}), ...(p.sound ? { sound: p.sound } : {}) });
    added++;
  }
  return { scene: s, added, at, snapped };
}
