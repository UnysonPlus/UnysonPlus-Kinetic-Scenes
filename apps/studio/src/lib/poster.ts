import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';

/**
 * The best still frame: what visitors who turn animation off see, and a video's thumbnail. The most complete
 * settled moment: nothing mid-move (looping ambient motion aside), as many words in place as possible, and,
 * among equals, the moment that has held longest (well inside a hold rather than at its edge).
 */
export function suggestPoster(scene: Scene): number {
  type Span = { a: number; b: number; text: boolean; exitsAt: number; settledAt: number; moving: Array<[number, number]> };
  const spans: Span[] = [];
  const AMBIENT = new Set(['ambient']);
  const walk = (list: Layer[], off: number, until: number) => list.forEach((l) => {
    const a = off + (l.start ?? 0);
    const b = Math.min(until, l.end !== undefined ? off + l.end : until);
    const clips = l.clips as Clip[];
    const moving: Array<[number, number]> = clips
      .filter((c) => !AMBIENT.has(presetMeta[c.preset]?.category ?? '') && c.preset !== 'keyframes')
      .map((c) => [off + c.start, off + c.start + c.duration]);
    const entrances = clips.filter((c) => c.params?.direction !== 'out' && presetMeta[c.preset]?.fields.some((f) => f.key === 'direction'));
    const exits = clips.filter((c) => c.params?.direction === 'out');
    const settledAt = entrances.length ? Math.max(...entrances.map((c) => off + c.start + c.duration)) : a;
    const exitsAt = exits.length ? Math.min(...exits.map((c) => off + c.start)) : b;
    spans.push({ a, b, text: l.type === 'text' || l.type === 'captions', exitsAt, settledAt, moving });
    if (l.type === 'group') walk(l.layers, a, b);
  });
  walk(scene.layers, 0, scene.duration);
  let best = Math.min(scene.duration, 2), bestScore = -Infinity;
  for (let t = 0.2; t <= scene.duration - 0.05; t += 0.05) {
    if (spans.some((s) => s.moving.some(([x, y]) => t > x + 0.02 && t < y - 0.02))) continue;
    let score = 0;
    for (const s of spans) {
      const shown = t >= s.a && t < s.b && t >= s.settledAt && t < s.exitsAt;
      if (shown) score += s.text ? 3 : 1;
    }
    // Prefer the middle of a hold: distance to the nearest move, up to a second.
    const quiet = Math.min(1, ...spans.flatMap((s) => s.moving.map(([x, y]) => Math.min(Math.abs(t - x), Math.abs(t - y)))));
    score += quiet * 0.5;
    if (score > bestScore + 1e-6) { bestScore = score; best = t; }
  }
  return Math.round(best * 100) / 100;
}
