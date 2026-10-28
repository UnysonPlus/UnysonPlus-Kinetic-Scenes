// Benchmarked against real films: AI assist gets the same kinds of brief that people publish motion films for, in a
// matching style, then its own jury review. Each result is saved (scene, the jury's scores and notes, frames) so it can
// be compared side by side with published films of that kind. The films are only a reference: nothing is copied.
//
//   KIT=<kit design-capture folder> PLAYER=<player base url> node --import tsx benchmarks/films/run.mts [brief-id]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PRESET_CATALOG } from '@unysonplus/scene-player/catalog';
import { MOTION_RULES } from '../../apps/studio/src/lib/motionRules.ts';
import { BUILT_IN_STYLES, styleBrief } from '../../apps/studio/src/lib/styles.ts';

export const BRIEFS = [
  { id: 'app-launch', style: 'keynote', brief: 'A 15-second launch film for a note-taking app called Ledger: the problem (notes everywhere), the product appearing, three features, and the launch date "Available today".' },
  { id: 'logo-reveal', style: 'liquid', brief: 'A 6-second logo reveal for a studio called Flux: abstract shapes gather and morph into the wordmark "FLUX", which holds at the end.' },
  { id: 'poster-break-out', style: 'collage', brief: 'An 8-second piece where a concert poster for "Night Market, 12 June" comes alive and its elements break out of the poster frame before settling back into place.' },
  { id: 'history-30s', style: 'swiss', brief: 'The history of the bicycle in about 20 seconds: four dates (1817, 1885, 1970, 2020), one short line each, ending on "Still the best machine".' },
  { id: 'wordless-explainer', style: 'flat-vector', brief: 'A 12-second explainer with no words at all: a seed is planted, watered, grows into a tree, and the tree drops a new seed. Shapes and motion only.' },
];

const catalog = PRESET_CATALOG.filter((p) => !p.aiExcluded).map((p) => ({
  id: p.id, label: p.label, description: p.description, appliesTo: p.appliesTo, defaultDuration: p.defaultDuration,
  params: Object.fromEntries(p.fields.map((f) => [f.key, f.type === 'select' ? f.options.map((o) => o.value) : f.type === 'layer' ? 'layer id' : f.type === 'longtext' ? 'text' : f.type])),
}));

const blank = {
  format: 'unysonplus-scene', version: 1, title: 'Untitled', duration: 6,
  stage: { breakpoints: [{ id: 'desktop', label: 'Desktop', minWidth: 0, aspect: [16, 9] }], heightMode: 'ratio-capped', background: '#000000' },
  playback: { trigger: 'load', loop: false }, layers: [],
};

const kit = process.env.KIT!;
const playerBase = process.env.PLAYER!;
const only = process.argv[2];
const ai = await import(join(kit, 'studio-ai.mjs').replace(/\\/g, '/').replace(/^([A-Z]):/, 'file:///$1:'));
const director = await import(join(kit, 'studio-director.mjs').replace(/\\/g, '/').replace(/^([A-Z]):/, 'file:///$1:'));
const out = join(import.meta.dirname, 'results');
mkdirSync(out, { recursive: true });

for (const b of BRIEFS.filter((x) => !only || x.id === only)) {
  const style = BUILT_IN_STYLES.find((s) => s.id === b.style)!;
  const t0 = Date.now();
  process.stderr.write(`${b.id}: building in ${style.name}…\n`);
  const made = await ai.studioScene({ mode: 'create', prompt: b.brief, scene: blank, catalog, rules: `${styleBrief(style)}\n\n${MOTION_RULES}` });
  const scene = made.scene;
  process.stderr.write(`${b.id}: reviewing…\n`);
  const review = await director.studioReview({ scene, prompt: b.brief, playerBase, rules: MOTION_RULES, catalog, patch: true });
  const final = review.scene ?? scene;
  writeFileSync(join(out, `${b.id}.json`), JSON.stringify(final, null, 2));
  writeFileSync(join(out, `${b.id}.review.json`), JSON.stringify({ brief: b.brief, style: style.name, seconds: Math.round((Date.now() - t0) / 1000), scores: review.scores, notes: review.notes ?? review.explanation, frames: review.frames }, null, 2));
  process.stderr.write(`${b.id}: ${JSON.stringify(review.scores)}\n`);
}
