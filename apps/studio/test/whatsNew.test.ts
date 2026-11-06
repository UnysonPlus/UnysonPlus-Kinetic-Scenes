// What's new, and the one-click Hand-drawn it points people to.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Scene } from '@unysonplus/scene-player/types';
import { NEWS_ID, WHATS_NEW, newsUnseen } from '../src/lib/whatsNew.ts';
import { handDrawn } from '../src/lib/sceneOps.ts';

const scene = {
  format: 'unysonplus-scene', duration: 12,
  stage: { breakpoints: [{ id: 'd', aspect: [16, 9] }] },
  layers: [
    { id: 'box', type: 'shape', shape: 'rect', box: { x: 50, y: 50, w: 20, h: 20 }, clips: [] },
    { id: 'words', type: 'text', text: 'Hi', box: { x: 50, y: 50 }, clips: [] },
  ],
} as unknown as Scene;

test('the New tags show until this round of news is opened', () => {
  assert.equal(newsUnseen(null), true);
  assert.equal(newsUnseen('2020-01-01'), true);
  assert.equal(newsUnseen(NEWS_ID), false);
});

test('every item has its own id and a page to read', () => {
  assert.equal(new Set(WHATS_NEW.map((n) => n.id)).size, WHATS_NEW.length);
  for (const n of WHATS_NEW) assert.match(n.doc, /^https:\/\/docs\.unysonplus\.com\//);
});

test('Hand-drawn runs for the whole scene, as the look needs', () => {
  const clip = handDrawn(scene, 'box').layers[0].clips[0];
  assert.equal(clip.preset, 'sketch');
  assert.equal(clip.start, 0);
  assert.equal(clip.duration, 12);
});

test('Hand-drawn leaves a layer it does not suit as it was', () => {
  assert.equal(handDrawn(scene, 'words'), scene);
});
