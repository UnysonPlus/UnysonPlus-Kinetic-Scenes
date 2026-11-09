// Build with cursors: deterministic, a valid scene, every opening layer built, the rest of the scene moved later.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateScene } from '@unysonplus/scene-player/validate';
import { buildWithCursors } from '../src/lib/swarm.ts';

const rect = (id: string, x: number, y: number, clips: unknown[] = []) => ({ id, type: 'shape', shape: 'rect', fill: '#2AD38B', box: { x, y, w: 20, h: 10 }, clips });
const scene = () => ({
  format: 'unysonplus-scene', version: 1, title: 't', duration: 5, mode: 'video', playback: { trigger: 'load', loop: false }, video: { formats: ['16x9'], fps: 30 },
  stage: { breakpoints: [{ id: '16x9', label: '16:9', minWidth: 0, aspect: [16, 9] }], heightMode: 'fill' },
  layers: [
    rect('a', 30, 40, [{ id: 'in', preset: 'fade', start: 0.2, duration: 0.6 }, { id: 'pulse', preset: 'pulse', start: 3, duration: 1 }]),
    rect('b', 70, 40),
    { id: 'title', type: 'text', text: 'Hello\nthere', box: { x: 50, y: 15, w: 40 }, style: { fontSize: 4 }, clips: [] },
    rect('late', 50, 80, [{ id: 'in2', preset: 'fade', start: 4, duration: 0.5 }]),
  ],
  markers: [{ id: 'm', t: 4 }],
}) as never;

type L = { id: string; type: string; start?: number; clips: Array<{ id: string; preset: string; start: number; params?: Record<string, unknown> }> };
const layersOf = (s: unknown) => (s as { layers: L[] }).layers;

test('the same scene always gives the same build', () => {
  assert.equal(JSON.stringify(buildWithCursors(scene()).scene), JSON.stringify(buildWithCursors(scene()).scene));
});

test('the result is a valid scene with named, coloured cursors', () => {
  const r = buildWithCursors(scene(), { cursors: 2 });
  assert.ok(validateScene(r.scene).ok, validateScene(r.scene).errors?.join('; '));
  const cursors = layersOf(r.scene).filter((l) => l.type === 'cursor') as Array<L & { color?: string; label?: string }>;
  assert.equal(cursors.length, 2);
  assert.ok(cursors.every((c) => c.color && c.label));
});

test('every opening layer is drawn, text is typed, and its old entrance is gone', () => {
  const r = buildWithCursors(scene());
  const ls = layersOf(r.scene);
  for (const id of ['a', 'b', 'title']) assert.ok(ls.find((l) => l.id === id)!.clips.some((c) => c.preset === 'build-draw'), id);
  const title = ls.find((l) => l.id === 'title')!;
  assert.ok(title.clips.some((c) => c.preset === 'text-typewriter'));
  assert.equal(title.clips.find((c) => c.preset === 'build-draw')!.params!.reveal, 'none');
  const a = ls.find((l) => l.id === 'a')!;
  assert.ok(!a.clips.some((c) => c.id === 'in'), 'the fade-in the build replaces is removed');
  assert.ok(a.clips.some((c) => c.id === 'pulse'), 'later clips stay');
  // A layer that is not on the stage at the opening is not built.
  assert.ok(!ls.find((l) => l.id === 'late')!.clips.some((c) => c.preset === 'build-draw'));
});

test('the rest of the scene moves later by the build', () => {
  const r = buildWithCursors(scene());
  const ls = layersOf(r.scene);
  const pulse = ls.find((l) => l.id === 'a')!.clips.find((c) => c.id === 'pulse')!;
  assert.equal(pulse.start, Math.round((3 + r.seconds) * 100) / 100);
  assert.equal((r.scene as never as { duration: number }).duration, Math.round((5 + r.seconds) * 100) / 100);
  assert.equal((r.scene as never as { markers: Array<{ t: number }> }).markers[0].t, Math.round((4 + r.seconds) * 100) / 100);
});

test('building twice is refused', () => {
  const once = buildWithCursors(scene()).scene;
  assert.throws(() => buildWithCursors(once), /already has a cursor build/);
});
