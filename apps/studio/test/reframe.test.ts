// Reframe to follow the face: wide footage in a tall frame, slid by keyframes so the face stays in view.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reframe, frameAspect } from '../src/lib/reframe.ts';

/** A tall scene with one 16:9 footage layer whose face walks from x to x2 between 2 s and 8 s, with a little jitter. */
function scene(x: number, x2: number) {
  const track = [] as Array<{ t: number; x: number; y: number; w: number; h: number }>;
  for (let t = 0; t <= 12; t += 1 / 15) {
    const walk = t < 2 ? x : t < 8 ? x + ((x2 - x) * (t - 2)) / 6 : x2;
    track.push({ t, x: walk + 0.01 * Math.sin(t * 9), y: 0.4, w: 0.1, h: 0.18 });
  }
  return {
    format: 'unysonplus-scene', version: 1, title: 't', duration: 10, mode: 'video',
    video: { formats: ['9x16'], fps: 30, platform: 'shorts' },
    stage: { breakpoints: [{ id: '9x16', label: '9:16', minWidth: 0, aspect: [9, 16] }], heightMode: 'fill', background: '#000', fonts: [] },
    playback: { trigger: 'load', loop: false },
    layers: [{ id: 'f', type: 'video', src: 'x.mp4', box: { x: 50, y: 50, w: 100, h: 100 }, start: 0, end: 10, clips: [], track }],
  } as never;
}

const frames = (s: { layers: Array<{ clips: Array<{ params: { frames: Array<{ t: number; x: number }> } }> }> }) => s.layers[0].clips[0].params.frames;

test('the footage fills the frame height and the keys follow the face', () => {
  const r = reframe(scene(0.3, 0.7), 'f', 16 / 9);
  const layer = (r.scene as never as { layers: Array<{ box: { w: number; ratio: number } }> }).layers[0];
  assert.ok(Math.abs(layer.box.w - (100 * (16 / 9)) / (9 / 16)) < 0.1, 'as tall as the frame');
  const keys = frames(r.scene as never);
  assert.ok(keys.length >= 2 && keys.length <= 12, `a handful of keys, not one per frame (${keys.length})`);
  // The face moves right, so the footage slides left: the first key is to the right of the last.
  assert.ok(keys[0].x > keys[keys.length - 1].x);
});

test('the frame never slides past the edge of the footage', () => {
  const W = (100 * (16 / 9)) / (9 / 16), limit = (((W - 100) / 2) / W) * 100;
  for (const keys of [frames(reframe(scene(0.02, 0.98), 'f', 16 / 9).scene as never)]) {
    for (const k of keys) assert.ok(Math.abs(k.x) <= limit + 1e-6, `key at ${k.t} s within ±${limit.toFixed(1)} (got ${k.x})`);
  }
});

test('a face that only jitters gives a still frame', () => {
  const keys = frames(reframe(scene(0.5, 0.5), 'f', 16 / 9).scene as never);
  const xs = keys.map((k) => k.x);
  assert.ok(Math.max(...xs) - Math.min(...xs) < 1, 'within the dead zone, the frame holds');
});

test('footage no wider than the frame is refused', () => {
  assert.throws(() => reframe(scene(0.3, 0.7), 'f', 9 / 16), /not wider than the frame/);
});

test('the frame shape comes from the video format', () => {
  assert.equal(frameAspect(scene(0.5, 0.5)), 9 / 16);
});
