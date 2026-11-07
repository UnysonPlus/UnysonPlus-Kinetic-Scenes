// The start screen's style gallery: every built-in style has a preview, a photo and a place in a filter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { BUILT_IN_STYLES, type SceneStyle } from '../src/lib/styles.ts';
import { POSTER_TIME, PREVIEW_SECONDS, STYLE_GROUPS, stylePreview } from '../src/lib/stylePreviews.ts';

test('every built-in style has its own preview scene', () => {
  for (const s of BUILT_IN_STYLES) assert.ok(stylePreview(s), `no preview for ${s.id}`);
});

test('every built-in style has a photo (run scripts/style-posters.ts after adding one)', () => {
  for (const s of BUILT_IN_STYLES) assert.ok(existsSync(new URL(`../public/styles/${s.id}.jpg`, import.meta.url)), `no photo for ${s.id}`);
});

test('every style sits in exactly one filter, and every filter names real styles', () => {
  const all = STYLE_GROUPS.flatMap((g) => g.styles);
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual([...all].sort(), BUILT_IN_STYLES.map((s) => s.id).sort());
});

test('previews use the style\'s own look and have settled by the photo', () => {
  assert.ok(POSTER_TIME < PREVIEW_SECONDS);
  for (const s of BUILT_IN_STYLES) {
    const scene = stylePreview(s)!;
    assert.equal(scene.stage.background, s.palette.background);
    assert.equal(scene.duration, PREVIEW_SECONDS);
    assert.ok(scene.layers.length >= 2, s.id);
  }
});

test('a style of your own has no preview, so it falls back to its title card', () => {
  assert.equal(stylePreview({ ...BUILT_IN_STYLES[0], id: 'mine', custom: true } as SceneStyle), null);
});
