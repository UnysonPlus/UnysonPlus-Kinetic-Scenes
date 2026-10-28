// Templates: every template builds a valid scene in every style. Set TEMPLATES_OUT to a folder to write them (Night style).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateScene } from '@unysonplus/scene-player/validate';
import { BUILT_IN_STYLES } from '../src/lib/styles.ts';
import { TEMPLATES, templateScene } from '../src/lib/templates.ts';

test('every template is a valid scene in every style', () => {
  const out = process.env.TEMPLATES_OUT;
  if (out) mkdirSync(out, { recursive: true });
  for (const tpl of TEMPLATES) {
    for (const style of BUILT_IN_STYLES) {
      const r = validateScene(templateScene(tpl.id, style));
      assert.ok(r.ok, `${tpl.id} in ${style.id}: ${r.errors.join('; ')}`);
    }
    if (out) writeFileSync(join(out, `${tpl.id}.json`), JSON.stringify(templateScene(tpl.id), null, 2));
  }
});
