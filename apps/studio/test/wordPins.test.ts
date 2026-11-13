// Word pins: layers and clips follow the words a voice says, through re-recording, trimming, groups and missing words.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateScene } from '@unysonplus/scene-player/validate';
import { applyWordPins, pinTime } from '@unysonplus/scene-player/words';
import { lintScene } from '@unysonplus/scene-player/lint';

const words = (list: Array<[string, number, number]>) => list.map(([w, t, d]) => ({ w, t, d }));
const voice = (extra: Record<string, unknown> = {}) => ({
  id: 'vo', role: 'voice', src: 'https://example.com/vo.mp3', start: 1,
  words: words([['WordPress', 0.2, 0.5], ['gives', 0.8, 0.2], ['you', 1.0, 0.1], ['a', 1.1, 0.1], ['database.', 1.3, 0.6], ['A', 2.2, 0.1], ['database', 2.4, 0.5], ['again.', 3.0, 0.4]]),
  ...extra,
});
const scene = (audio: unknown[], layers: unknown[]) => ({
  format: 'unysonplus-scene', version: 1, title: 't', duration: 10, playback: { trigger: 'load', loop: false },
  stage: { breakpoints: [{ id: 'd', label: 'D', minWidth: 0, aspect: [16, 9] }] }, audio, layers,
}) as never;
const text = (id: string, extra: Record<string, unknown> = {}) => ({ id, type: 'text', text: id, box: { x: 50, y: 50 }, style: { fontSize: 4 }, clips: [{ id: `${id}-in`, preset: 'fade', start: 0, duration: 0.5 }], ...extra });

test('a pinned layer moves, with its clips, onto its word (clip start + word time - trim)', () => {
  const s = scene([voice({ offset: 0.1 })], [text('t', { at: { audio: 'vo', text: 'database' } })]);
  const { scene: out, moved } = applyWordPins(s);
  const l = (out as { layers: Array<{ start: number; clips: Array<{ start: number }>; at: { index: number } }> }).layers[0];
  assert.equal(moved, 1);
  assert.equal(l.start, 2.2); // 1 + 1.3 - 0.1
  assert.equal(l.clips[0].start, 2.2);
  assert.equal(l.at.index, 4);
});

test('the remembered index picks the right one of a word said twice, and edge/offset apply', () => {
  const s = scene([voice()], [text('t', { at: { audio: 'vo', text: 'Database!', index: 6, edge: 'end', offset: -0.2 } })]);
  const l = (applyWordPins(s).scene as { layers: Array<{ start: number }> }).layers[0];
  assert.equal(l.start, 3.7); // 1 + 2.4 + 0.5 - 0.2
});

test('a re-recorded voice re-times the pin (the index follows the word)', () => {
  const pinned = scene([voice()], [text('t', { at: { audio: 'vo', text: 'database', index: 4 } })]);
  const first = applyWordPins(pinned).scene as { layers: unknown[]; audio: unknown[] };
  const slower = { ...first, audio: [voice({ words: words([['So,', 0, 0.3], ['WordPress', 0.5, 0.5], ['gives', 1.1, 0.2], ['you', 1.4, 0.1], ['a', 1.5, 0.1], ['database.', 1.9, 0.6]]) })] } as never;
  const l = (applyWordPins(slower).scene as { layers: Array<{ start: number; at: { index: number } }> }).layers[0];
  assert.equal(l.start, 2.9);
  assert.equal(l.at.index, 5);
});

test('until sets the end; a clip pin sets only that clip; inside a group the time is the group\'s own', () => {
  const s = scene([voice()], [
    text('t', { until: { audio: 'vo', text: 'again' } }),
    { id: 'g', type: 'group', start: 1, layers: [text('c', { clips: [{ id: 'pop', preset: 'pop', start: 0, duration: 0.3, at: { audio: 'vo', text: 'gives you' } }] })], clips: [] },
  ]);
  const out = applyWordPins(s).scene as { layers: Array<{ end?: number; layers?: Array<{ clips: Array<{ start: number }> }> }> };
  assert.equal(out.layers[0].end, 4); // 1 + 3.0
  assert.equal(out.layers[1].layers![0].clips[0].start, 0.8); // 1 + 0.8 - group start 1
});

test('parts of a voice cut by its words are searched; a lost word is reported and left alone', () => {
  const partB = { id: 'vo2', role: 'voice', src: 'https://example.com/vo.mp3', start: 5, offset: 2, group: 'rec', words: words([['database', 2.4, 0.5]]) };
  const s = scene([voice({ group: 'rec', words: words([['WordPress', 0.2, 0.5]]) }), partB], [text('t', { start: 0.5, at: { audio: 'vo', text: 'database' } }), text('u', { start: 0.5, at: { audio: 'vo', text: 'Drupal' } })]);
  assert.deepEqual(pinTime(s as never, { audio: 'vo', text: 'database' }), { t: 5.4, audio: 'vo2', index: 0 });
  const { scene: out, problems } = applyWordPins(s);
  const ls = (out as { layers: Array<{ start: number }> }).layers;
  assert.equal(ls[0].start, 5.4);
  assert.equal(ls[1].start, 0.5);
  assert.equal(problems.length, 1);
  assert.ok(lintScene(s).some((i) => i.id.startsWith('pin:u')));
});

test('a malformed pin is dropped with a warning, a valid one passes validation', () => {
  const bad = validateScene(scene([voice()], [text('t', { at: { audio: 'vo' } })]));
  assert.ok(bad.ok);
  assert.ok(bad.warnings.some((w) => /word pin/.test(w)));
  assert.equal((bad.scene.layers[0] as { at?: unknown }).at, undefined);
  const good = validateScene(scene([voice({ script: 'WordPress gives you a database.' })], [text('t', { at: { audio: 'vo', text: 'database', edge: 'end' } })]));
  assert.ok(good.ok && !good.warnings.some((w) => /word pin|script/.test(w)));
});

test('a misheard word still finds its pin (closest spelling, one word more or fewer), a short word does not', () => {
  const heard = { id: 'vo', role: 'voice', src: 'https://example.com/vo.mp3', start: 0,
    words: words([['una', 0, 0.2], ['pantalla', 0.3, 0.4], ['de', 0.8, 0.1], ['exceso.', 1.0, 0.5], ['un', 2.0, 0.1], ['frango', 2.2, 0.3], ['work', 2.5, 0.3], ['gratuito.', 2.9, 0.5]]) };
  const s = scene([heard], []);
  assert.equal(pinTime(s as never, { audio: 'vo', text: 'pantalla de acceso.' })?.t, 0.3);
  assert.equal(pinTime(s as never, { audio: 'vo', text: 'framework gratuito', edge: 'end' })?.t, 3.4);
  assert.equal(pinTime(s as never, { audio: 'vo', text: 'unos' }), null);
});
