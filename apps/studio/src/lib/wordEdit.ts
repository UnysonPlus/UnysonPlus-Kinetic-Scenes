import type { AudioClip, Layer, Scene, SpokenWord } from '@unysonplus/scene-player/types';

/**
 * Edit by the words: words struck out of a transcribed voice-over are cut out of it, and out of the footage it came
 * from (and that footage's cut-out person), without making new files: each becomes several parts that play the kept
 * stretches back to back. What comes after moves earlier by the time removed, so titles and effects stay on their words.
 */

const FILLERS = /^(um+|uh+|er+|erm+|ah+|hmm+|mm+|mhm)[,.!?]*$/i;
const KEEP_DOUBLE = new Set(['that', 'had', 'very', 'really', 'so', 'no', 'yes']);
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}']+/gu, '');
const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** Words worth removing: fillers, and the first of a phrase said twice in a row (a false start). */
export function suggestRemovals(words: SpokenWord[]): Set<number> {
  const out = new Set<number>();
  const n = words.map((w) => norm(w.w));
  words.forEach((w, i) => { if (FILLERS.test(w.w.trim())) out.add(i); });
  for (let i = 0; i < n.length; i++) {
    for (let k = 4; k >= 1; k--) {
      if (i + 2 * k > n.length) continue;
      let same = true;
      for (let j = 0; j < k; j++) if (!n[i + j] || n[i + j] !== n[i + k + j]) { same = false; break; }
      if (same && !(k === 1 && KEEP_DOUBLE.has(n[i]))) { for (let j = 0; j < k; j++) out.add(i + j); i += k - 1; break; }
    }
  }
  return out;
}

export interface Cut { from: number; to: number }

/** The stretches to cut, in the recording's own seconds: struck words (to the next kept word), and long pauses. */
export function planWordCuts(words: SpokenWord[], remove: Set<number>, pauses: { max: number; keep: number } | null): Cut[] {
  const cuts: Cut[] = [];
  for (let i = 0; i < words.length; i++) {
    if (!remove.has(i)) continue;
    let j = i;
    while (j + 1 < words.length && remove.has(j + 1)) j++;
    const from = words[i].t;
    const to = j + 1 < words.length ? words[j + 1].t : words[j].t + (words[j].d || 0.2);
    cuts.push({ from, to });
    i = j;
  }
  if (pauses) {
    const kept = words.map((w, i) => ({ w, i })).filter((x) => !remove.has(x.i)).map((x) => x.w);
    for (let k = 0; k + 1 < kept.length; k++) {
      const end = kept[k].t + (kept[k].d || 0.2), next = kept[k + 1].t;
      if (next - end > pauses.max) cuts.push({ from: end + pauses.keep / 2, to: next - pauses.keep / 2 });
    }
  }
  cuts.sort((a, b) => a.from - b.from);
  const merged: Cut[] = [];
  for (const c of cuts) { const l = merged[merged.length - 1]; if (l && c.from <= l.to + 0.02) l.to = Math.max(l.to, c.to); else merged.push({ ...c }); }
  return merged.map((c) => ({ from: r3(c.from), to: r3(c.to) })).filter((c) => c.to - c.from > 0.04);
}

/** The kept stretches [a, b] of the recording between offset and offset + length, given the cuts. */
function keptParts(offset: number, length: number, cuts: Cut[]): [number, number][] {
  const out: [number, number][] = [];
  let a = offset;
  const end = offset + length;
  for (const c of cuts) {
    if (c.to <= a || c.from >= end) continue;
    if (c.from > a) out.push([a, Math.min(c.from, end)]);
    a = Math.max(a, c.to);
  }
  if (end > a + 0.02) out.push([a, end]);
  // A sliver (the instant before the first word) is not worth a part of its own.
  return out.filter(([x, y]) => y - x >= 0.1);
}

/**
 * Applies the cuts to the voice clip and to every footage layer playing in step with it (same start and offset):
 * the footage and its cut-out person. Everything after the start moves earlier by the time removed before it.
 * Returns the scene and the seconds removed.
 */
export function applyWordCuts(scene: Scene, clipId: string, cuts: Cut[]): { scene: Scene; removed: number; parts: number } {
  const clip = (scene.audio ?? []).find((a) => a.id === clipId);
  if (!clip || !cuts.length) return { scene, removed: 0, parts: 0 };
  const S = clip.start ?? 0, O = clip.offset ?? 0;
  const words = clip.words ?? [];
  const lastWord = words.length ? words[words.length - 1].t + (words[words.length - 1].d || 0.2) : O;
  const L = typeof clip.duration === 'number' ? clip.duration : Math.max(scene.duration - S, lastWord - O + 0.5);
  const parts = keptParts(O, L, cuts);
  const removed = r3(L - parts.reduce((s, [a, b]) => s + (b - a), 0));
  // Scene time t (after S) → its time after the cut.
  const removedBefore = (t: number) => {
    if (t <= S) return 0;
    const ft = O + (t - S);
    let r = 0;
    for (const c of cuts) { if (c.from >= ft) break; r += Math.min(c.to, ft) - c.from; }
    return r;
  };
  const map = (t: number) => r3(t - removedBefore(t));

  // In step with the voice: footage (and cut-out person) with the same start and offset, at normal speed.
  const linked = (l: Layer) => l.type === 'video' && Math.abs((l.start ?? 0) - S) < 0.06 && Math.abs((l.offset ?? 0) - O) < 0.06 && (l.rate ?? 1) === 1;
  const group = clip.group ?? `${clip.id}-parts`;

  const splitLayer = (l: Layer): Layer[] => {
    let at = S;
    return parts.map(([a, b], k) => {
      const len = b - a;
      const part = {
        ...l, id: k === 0 ? l.id : `${l.id}-part${k + 1}`, name: k === 0 ? l.name : `${l.name ?? l.id} (part ${k + 1})`,
        start: r3(at), end: r3(at + len), offset: r3(a),
        // Effects stay on the part they play in, moved with it.
        clips: l.clips.filter((c) => { const t = c.start; return t >= map(at) - 1e-6 && (k === parts.length - 1 || t < map(at + len)); }).map((c) => ({ ...c, start: map(c.start) })),
      } as Layer;
      at += len;
      return part;
    });
  };

  const shift = (l: Layer): Layer => {
    const s = l.start ?? 0;
    const e = typeof l.end === 'number' ? l.end : undefined;
    return { ...l, ...(l.start !== undefined ? { start: map(s) } : {}), ...(e !== undefined ? { end: Math.max(map(s) + 0.05, map(e)) } : {}), clips: l.clips.map((c) => ({ ...c, start: map(c.start) })) } as Layer;
  };
  const walk = (list: Layer[], top: boolean): Layer[] => list.flatMap((l) => (top && linked(l) ? splitLayer(l) : [l.type === 'group' && !top ? l : shift(l)]));

  let at = S;
  const voiceParts: AudioClip[] = parts.map(([a, b], k) => {
    const len = b - a;
    const part: AudioClip = { ...clip, id: k === 0 ? clip.id : `${clip.id}-part${k + 1}`, group, start: r3(at), offset: r3(a), duration: r3(len), words: words.filter((w) => w.t >= a - 0.01 && w.t < b) };
    at += len;
    return part;
  });
  const audio = (scene.audio ?? []).flatMap((a) => (a.id === clipId ? voiceParts : a.role === 'voice' || (a.start ?? 0) > S ? [{ ...a, start: map(a.start ?? 0) }] : [a]));

  const next: Scene = {
    ...scene,
    duration: r3(Math.max(1, scene.duration - (S + L <= scene.duration + 0.01 ? removed : removedBefore(scene.duration)))),
    layers: walk(scene.layers, true),
    audio,
    markers: scene.markers?.map((m) => ({ ...m, t: map(m.t) })),
    camera: scene.camera ? { ...scene.camera, keys: scene.camera.keys.map((k) => ({ ...k, t: map(k.t) })) } : scene.camera,
  };
  return { scene: next, removed, parts: parts.length };
}
