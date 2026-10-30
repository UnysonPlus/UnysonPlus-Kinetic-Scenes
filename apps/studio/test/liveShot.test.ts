// Animated screenshot: rows found in a settings-like picture, and the clips that make them come alive.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRows, liveShotClips } from '../src/lib/liveShot.ts';

/** A white 400×300 picture with dark "text" bars: three option rows, the second with a label and a description line. */
function picture() {
  const W = 400, H = 300;
  const data = new Uint8ClampedArray(W * H * 4).fill(255);
  const bar = (x0: number, x1: number, y0: number, y1: number) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * W + x) * 4; data[i] = data[i + 1] = data[i + 2] = 40; }
  };
  bar(40, 200, 40, 52); bar(300, 360, 38, 54); // row 1: a label and a switch
  bar(40, 180, 110, 122); bar(40, 260, 125, 133); // row 2: a label and its description, close together
  bar(40, 220, 200, 212);
  return { width: W, height: H, data };
}

test('finds each option row, keeping a label and its description together', () => {
  const rows = findRows(picture());
  assert.equal(rows.length, 3);
  // Row 1 spans from the label to the switch.
  assert.ok(rows[0].x < 10 && rows[0].x + rows[0].w > 90, `row 1 sides ${JSON.stringify(rows[0])}`);
  // Row 2 holds both lines.
  assert.ok(rows[1].y < 110 / 3 && rows[1].y + rows[1].h > 133 / 3, `row 2 ${JSON.stringify(rows[1])}`);
});

test('looks only inside a part of the picture when asked', () => {
  const rows = findRows(picture(), { within: { x: 0, y: 0, w: 100, h: 50 } });
  assert.equal(rows.length, 2);
});

test('a plain picture has no rows', () => {
  const W = 50, H = 50;
  assert.deepEqual(findRows({ width: W, height: H, data: new Uint8ClampedArray(W * H * 4).fill(255) }), []);
});

test('pieces build in one after another, then the focused one lifts with a spotlight and a label, and lets go', () => {
  const { clips, end } = liveShotClips(['a', 'b', 'c'], { start: 1, entrance: 'stagger', gap: 0.2, focus: 1, focusEffect: 'both', label: 'Pick a font', hold: 1.5 });
  assert.deepEqual(clips.a.map((c) => [c.preset, c.start]), [['slide', 1]]);
  assert.deepEqual(clips.c.map((c) => [c.preset, c.start]), [['slide', 1.4]]);
  const b = clips.b.map((c) => `${c.preset}:${(c.params as { direction: string }).direction}`);
  assert.deepEqual(b, ['slide:in', 'spotlight:in', 'lift:in', 'callout:in', 'callout:out', 'lift:out', 'spotlight:out']);
  // The focus starts after the last piece has arrived.
  assert.ok(clips.b[1].start >= 1.9);
  // The Out keeps the size it lifted to, so it shrinks back from there.
  assert.equal((clips.b.find((c) => c.preset === 'lift' && (c.params as { direction: string }).direction === 'out')!.params as { scale: number }).scale, 1.15);
  assert.ok(end > clips.b[1].start + 1.5);
  // Every clip id is its own.
  const ids = Object.values(clips).flat().map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('no entrance: the focus starts at the start', () => {
  const { clips } = liveShotClips(['a', 'b'], { start: 2, entrance: 'none', focus: 0, focusEffect: 'magnify' });
  assert.deepEqual(clips.a.map((c) => [c.preset, c.start]), [['lift', 2]]);
  assert.deepEqual(clips.b, []);
});
