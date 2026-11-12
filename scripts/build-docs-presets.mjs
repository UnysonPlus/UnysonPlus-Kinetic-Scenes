// Writes the preset tables of the public docs page (unysonplus-site/kinetic-scenes/presets.md) from the player's own
// catalogue, so the page lists every preset with its exact settings. Everything before the first "## Text" heading and
// from "## Custom code" on is kept as written by hand.
//   node scripts/build-docs-presets.mjs [path to presets.md]   (default: the docs repository beside this one)
import { build } from 'esbuild';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = resolve(process.argv[2] || join(root, '..', 'unysonplus-site', 'kinetic-scenes', 'presets.md'));
const bundled = join(tmpdir(), `upw-docs-presets-${Date.now()}.mjs`);
await build({
  stdin: { contents: `export { PRESET_CATALOG, CATEGORY_LABELS } from ${JSON.stringify(join(root, 'packages/player/src/presets/catalog.ts'))};`, resolveDir: root, loader: 'ts' },
  bundle: true, format: 'esm', platform: 'node', outfile: bundled, logLevel: 'silent',
});
const m = await import(pathToFileURL(bundled).href);
rmSync(bundled, { force: true });

// The order the library shows, and the custom-code preset (described in its own section below the tables) left out.
const ORDER = ['text', 'reveal', 'motion', 'emphasis', 'tour', 'transition', 'ambient', 'code', '3d'];
const NAMES = { text: 'text', shape: 'shape', image: 'image', video: 'footage', model: '3D', group: 'group', path: 'line', flow: 'flow lines', diagram: 'diagram', code: 'code', captions: 'captions', repeat: 'list', cursor: 'cursor', lottie: 'Lottie' };
const ALL = ['text', 'shape', 'image', 'video', 'model', 'group', 'path', 'flow', 'diagram', 'code', 'captions', 'repeat', 'cursor'];
const worksOn = (types) => (ALL.every((t) => types.includes(t)) ? 'any layer' : types.map((t) => NAMES[t] ?? t).join(', '));
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

const src = readFileSync(page, 'utf8');
// Hand-written notes that follow a section's table (a paragraph, a picture) are kept, after the new table.
const notes = {};
for (const part of src.replace(/\r\n/g, '\n').split(/^(?=## )/m)) {
  const head = /^## (.+)\n/.exec(part);
  if (!head) continue;
  const lines = part.split('\n').slice(1);
  let i = 0;
  while (i < lines.length && !lines[i].startsWith('|')) i++;
  while (i < lines.length && lines[i].startsWith('|')) i++;
  const rest = lines.slice(i).join('\n').trim();
  if (rest) notes[head[1].trim()] = rest;
}

const byCat = {};
for (const p of m.PRESET_CATALOG) (byCat[p.category] ??= []).push(p);
let tables = '';
for (const cat of ORDER) {
  const list = byCat[cat];
  if (!list?.length) continue;
  const label = m.CATEGORY_LABELS[cat];
  tables += `## ${label}\n\n| Preset | What it does | Works on | Settings |\n|---|---|---|---|\n`;
  for (const p of list) tables += `| **${cell(p.label)}** | ${cell(p.description)} | ${worksOn(p.appliesTo)} | ${cell(p.fields.map((f) => f.label).join(', ') || '–')} |\n`;
  tables += notes[label] ? `\n${notes[label]}\n\n` : '\n';
}

const eol = src.includes('\r\n') ? '\r\n' : '\n';
const a = src.search(/^## Text\r?$/m);
const b = src.search(/^## Custom code/m);
if (a < 0 || b < 0) throw new Error(`${page}: the "## Text" and "## Custom code" headings mark where the tables go.`);
const count = m.PRESET_CATALOG.length;
writeFileSync(page, src.slice(0, a) + tables.replace(/\n/g, eol) + src.slice(b));
console.log(`docs presets: ${count} presets → ${page}`);
