// Motion-design styles: every style is built only from parts the player has, its starter scene is a valid scene, and
// AI assist gets its guide. Set STYLE_STARTERS_OUT to a folder to also write each starter scene there (to look at).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { SFX_IDS } from '@unysonplus/scene-player/sfx';
import { validateScene } from '@unysonplus/scene-player/validate';
import { BUILT_IN_STYLES, starterScene, styleBrief } from '../src/lib/styles.ts';
import { MOTION_STYLES } from '../src/lib/motionStyles.ts';

test('there are about two dozen styles, each with a unique id', () => {
  assert.ok(BUILT_IN_STYLES.length >= 24, `${BUILT_IN_STYLES.length} styles`);
  assert.equal(new Set(BUILT_IN_STYLES.map((s) => s.id)).size, BUILT_IN_STYLES.length);
});

test('every motion style uses real presets and sounds, and has a guide', () => {
  for (const s of MOTION_STYLES) {
    const m = s.motion;
    for (const mv of [m.headline, m.text, m.shape, m.exit, ...(m.textAlt ?? []), ...(m.shapeAlt ?? []), ...(s.signature ? [s.signature] : [])]) {
      assert.ok(presetMeta[mv.preset], `${s.id}: unknown preset ${mv.preset}`);
    }
    for (const k of ['enter', 'exit', 'hit', 'accent'] as const) assert.ok(SFX_IDS.includes(s.sounds[k]), `${s.id}: unknown sound ${s.sounds[k]}`);
    assert.ok(s.guide && s.guide.signs.length > 40 && s.guide.build.length > 40, `${s.id}: guide`);
    assert.match(styleBrief(s), /What makes it/);
  }
});

test('every style\'s starter scene is a valid scene', () => {
  const out = process.env.STYLE_STARTERS_OUT;
  if (out) mkdirSync(out, { recursive: true });
  for (const s of BUILT_IN_STYLES) {
    const scene = starterScene(s);
    const r = validateScene(scene);
    assert.ok(r.ok, `${s.id}: ${JSON.stringify((r as { errors?: unknown }).errors)}`);
    if (out) writeFileSync(join(out, `${s.id}.json`), JSON.stringify(scene, null, 2));
  }
});
