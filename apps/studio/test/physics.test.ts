// Drop with physics: the same layers always give the same motion, it lands on the floor, and the result is a valid scene.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateScene } from '@unysonplus/scene-player/validate';
import { dropWithPhysics, landings, stageHeight, trimFrames } from '../src/lib/physics.ts';

const box = (id: string, x: number) => ({ id, type: 'shape', shape: 'rect', fill: '#2AD38B', box: { x, y: 30, w: 24, h: 8 }, clips: [] });
const ball = { id: 'ball', type: 'shape', shape: 'ellipse', fill: '#fff', box: { x: 50, y: 20, w: 16, ratio: 1 }, clips: [] };
const scene = () => ({
  format: 'unysonplus-scene', version: 1, title: 't', duration: 3, mode: 'video', playback: { trigger: 'load', loop: false }, video: { formats: ['9x16'], fps: 30 },
  stage: { breakpoints: [{ id: '9x16', label: '9:16', minWidth: 0, aspect: [9, 16] }], heightMode: 'fill' },
  layers: [box('a', 30), box('b', 55), ball],
}) as never;

test('the same layers always give the same motion', async () => {
  const a = await dropWithPhysics(scene(), ['a', 'b', 'ball']);
  const b = await dropWithPhysics(scene(), ['a', 'b', 'ball']);
  assert.equal(JSON.stringify(a.scene), JSON.stringify(b.scene));
});

test('layers land at the floor, as keyframes in a valid scene', async () => {
  const { scene: s, count } = await dropWithPhysics(scene(), ['a', 'b', 'ball'], { floor: 80 });
  assert.equal(count, 3);
  assert.ok(validateScene(s).ok, validateScene(s).errors?.join('; '));
  const a = (s as never as { layers: Array<{ id: string; box: { y: number; h: number }; clips: Array<{ preset: string; params: { frames: Array<{ y: number }> } }> }> }).layers[0];
  const clip = a.clips[0];
  assert.equal(clip.preset, 'keyframes');
  // y is a percentage of the layer's own height: from y 30% of the stage, it ends resting on the floor at 80%.
  const landedAt = a.box.y + (clip.params.frames.at(-1)!.y / 100) * a.box.h;
  assert.ok(landedAt > 66 && landedAt < 80, `landed at ${landedAt}`);
});

test('running it again replaces the earlier physics', async () => {
  const one = await dropWithPhysics(scene(), ['a']);
  const two = await dropWithPhysics(one.scene, ['a'], { sound: false });
  const a = (two.scene as never as { layers: Array<{ clips: unknown[] }>; audio?: unknown[] });
  assert.equal(a.layers[0].clips.length, 1);
  assert.equal(a.audio, undefined);
});

test('a layer with no size is refused', async () => {
  const s = scene() as never as { layers: Array<{ box: Record<string, number> }> };
  s.layers[0].box = { x: 50, y: 50 };
  await assert.rejects(dropWithPhysics(s as never, ['a']), /no size/);
});

test('keys a straight line would draw are removed, and landings are spaced', () => {
  const f = [0, 1, 2, 3].map((t) => ({ t, x: t * 10, y: 0, rotate: 0 }));
  assert.equal(trimFrames(f).length, 2);
  const l = landings([{ t: 1, force: 20 }, { t: 1.05, force: 20 }, { t: 1.4, force: 8 }]);
  assert.deepEqual(l.map((x) => x.t), [1, 1.4]);
  assert.equal(stageHeight(scene()), (1000 * 16) / 9);
});
