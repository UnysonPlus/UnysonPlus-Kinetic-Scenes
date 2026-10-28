// Point at the frame: the AI is told about one element; its changes on that element come back as fields.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changedFields, pointContext, setField } from '../src/lib/pointEdit.ts';

const scene = (text: string, size: number, dur: number) => ({
  format: 'unysonplus-scene', version: 1, title: 't', duration: 5,
  stage: { breakpoints: [{ id: 'd', label: 'd', minWidth: 0, aspect: [16, 9] }], heightMode: 'fill', background: '#000', fonts: [] },
  playback: { trigger: 'load', loop: false },
  layers: [
    { id: 'title', type: 'text', text, box: { x: 50, y: 40, w: 80 }, start: 1, style: { fontSize: size, color: '#ffffff' }, clips: [{ id: 'in', preset: 'text-rise', start: 1, duration: dur }] },
    { id: 'other', type: 'shape', shape: 'rect', box: { x: 50, y: 80, w: 20 }, fill: '#00B295', clips: [] },
  ],
}) as never;

test('the AI is told which element, when, and to change only it', () => {
  const c = pointContext(scene('Hello', 6, 0.6), 'title', 2.345);
  assert.match(c, /layer "title" \(text "Hello"\) at 2\.35 s/);
  assert.match(c, /Change ONLY this layer/);
  assert.match(pointContext(scene('Hello', 6, 0.6), 'title', 0.5), /not on screen at that moment/);
});

test('what changed on the element comes back as fields, and nothing else', () => {
  const f = changedFields(scene('Hello', 6, 0.6), scene('Hi there', 8, 0.9), 'title');
  assert.deepEqual(f.map((x) => [x.label, x.value]), [['Text', 'Hi there'], ['Size', 8], ['in: duration', 0.9]]);
  assert.deepEqual(changedFields(scene('Hello', 6, 0.6), scene('Hello', 6, 0.6), 'title'), []);
});

test('a field set by hand changes only that value', () => {
  const s = setField(scene('Hello', 6, 0.6), 'title', 'clips.in.duration', 1.2) as never as { layers: Array<{ clips: Array<{ duration: number }>; style: { fontSize: number } }> };
  assert.equal(s.layers[0].clips[0].duration, 1.2);
  assert.equal(s.layers[0].style.fontSize, 6);
  const t = setField(scene('Hello', 6, 0.6), 'title', 'style.color', '#ff0000') as never as { layers: Array<{ style: { color: string; fontSize: number } }> };
  assert.deepEqual(t.layers[0].style, { fontSize: 6, color: '#ff0000' });
});
