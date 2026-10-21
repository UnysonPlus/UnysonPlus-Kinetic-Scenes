// Builds the Kinetic Scenes skill from the Studio's own code, so it never goes out of date: the preset list
// (catalogue), the motion rules the Studio's AI follows, the built-in styles and sounds, plus the hand-kept
// scene-format reference and workflow (skill-src/). Written to apps/studio/public/skill/ (published at
// https://kinetic-scenes.unysonplus.com/skill/) and, when the AI Dev Kit sits beside this repository, copied
// into it (UnysonPlus-AI-Dev-Kit/skills/kinetic-scenes) for agents working on the user's computer.
//   node scripts/build-skill.mjs
import { build } from 'esbuild';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'apps/studio/public/skill');
const version = JSON.parse(readFileSync(join(root, 'apps/studio/package.json'), 'utf8')).version;

// Bundle the pieces of the Studio the skill describes into one module this script can import.
const entry = join(tmpdir(), `upw-skill-entry-${process.pid}.ts`);
writeFileSync(entry, `
export { PRESET_CATALOG, CATEGORY_LABELS } from ${JSON.stringify(join(root, 'packages/player/src/presets/catalog.ts'))};
export { SFX_CATALOG } from ${JSON.stringify(join(root, 'packages/player/src/sfx.ts'))};
export { MOTION_RULES } from ${JSON.stringify(join(root, 'apps/studio/src/lib/motionRules.ts'))};
export { BUILT_IN_STYLES, styleBrief } from ${JSON.stringify(join(root, 'apps/studio/src/lib/styles.ts'))};
`);
const bundled = join(tmpdir(), `upw-skill-${process.pid}.mjs`);
await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: bundled, logLevel: 'error', absWorkingDir: join(root, 'apps/studio') });
const m = await import(pathToFileURL(bundled).href);
rmSync(entry); rmSync(bundled);

const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fieldText = (f) => {
  if (f.type === 'select') return `\`${f.key}\`: ${f.options.map((o) => `\`${o.value}\``).join(' / ')}`;
  if (f.type === 'number') return `\`${f.key}\`: number${f.min !== undefined ? ` ${f.min} to ${f.max ?? '…'}` : ''}${f.unit ? ` ${f.unit}` : ''}`;
  if (f.type === 'layer') return `\`${f.key}\`: a layer id`;
  return `\`${f.key}\`: ${f.type === 'longtext' ? 'text' : f.type}`;
};

// presets.md
const byCat = {};
for (const p of m.PRESET_CATALOG) (byCat[p.category] ??= []).push(p);
let presets = `# Presets\n\nGenerated from the Studio ${version}. A clip names one of these in \`preset\` and may set the listed \`params\`; a preset\nonly works on the layer types it applies to. Presets marked *not for AI* are left out of what an AI should use.\n`;
for (const [cat, list] of Object.entries(byCat)) {
  presets += `\n## ${m.CATEGORY_LABELS[cat] ?? cat}\n\n| id | what it does | applies to | default length | settings |\n| --- | --- | --- | --- | --- |\n`;
  for (const p of list) {
    presets += `| \`${p.id}\`${p.aiExcluded ? ' *(not for AI)*' : ''} | **${esc(p.label)}.** ${esc(p.description)} | ${p.appliesTo.join(', ')} | ${p.defaultDuration} s | ${p.fields.map(fieldText).map(esc).join('; ') || '(none)'} |\n`;
  }
}

// sounds.md
let sounds = `# Built-in sounds\n\nUse them as a clip's \`sound\` ({ "name": "<id>", "at": "start" | "end" }) or as an audio clip (\`"src": "sfx:<id>"\`).\nThey are synthesised by the player: nothing to download.\n\n| id | length | what it is |\n| --- | --- | --- |\n`;
for (const s of m.SFX_CATALOG) sounds += `| \`${s.id}\` | ${s.length} s | ${esc(s.description)} |\n`;

// styles.md
let styles = `# Styles\n\nThe built-in looks. A request may name one; follow its colours, fonts and motion.\n`;
for (const st of m.BUILT_IN_STYLES) styles += `\n## ${st.name}\n\n${m.styleBrief(st)}\n`;

const rules = `# Motion rules\n\nThe rules the Studio's own AI follows (Studio ${version}).\n\n\`\`\`text\n${m.MOTION_RULES}\n\`\`\`\n`;

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'reference'), { recursive: true });
writeFileSync(join(out, 'SKILL.md'), readFileSync(join(root, 'skill-src/SKILL.md'), 'utf8').replace(/\{\{VERSION\}\}/g, version));
writeFileSync(join(out, 'reference/scene-format.md'), readFileSync(join(root, 'skill-src/scene-format.md'), 'utf8'));
writeFileSync(join(out, 'reference/presets.md'), presets);
writeFileSync(join(out, 'reference/motion-rules.md'), rules);
writeFileSync(join(out, 'reference/sounds.md'), sounds);
writeFileSync(join(out, 'reference/styles.md'), styles);
// A page for people, and plain links for AIs.
const files = ['SKILL.md', 'reference/scene-format.md', 'reference/presets.md', 'reference/motion-rules.md', 'reference/styles.md', 'reference/sounds.md'];
writeFileSync(join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kinetic Scenes skill</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:46rem;margin:3rem auto;padding:0 1rem;color:#1f2933}code{background:#f2f4f7;padding:.1em .3em;border-radius:4px}</style></head><body>
<h1>The Kinetic Scenes skill</h1>
<p>Everything an AI needs to make good scenes for Unyson+ Kinetic Scenes, generated from the Studio's own code (version ${version}). Point your AI at this page, or at <a href="SKILL.md">SKILL.md</a>.</p>
<ul>${files.map((f) => `<li><a href="${f}">${f}</a></li>`).join('')}</ul>
<p>In the AI Dev Kit, the same files are in <code>skills/kinetic-scenes</code>.</p></body></html>`);
writeFileSync(join(root, 'apps/studio/public/llms.txt'), `# Unyson+ Kinetic Scenes\n\n> Timeline motion graphics for the web, exported as plain HTML. Scenes are JSON data built from presets.\n\n## Skill\n\n${files.map((f) => `- [${f}](https://kinetic-scenes.unysonplus.com/skill/${f})`).join('\n')}\n`);

// The AI Dev Kit beside this repository gets a copy (Github Repository/<this> → ../../UnysonPlus-AI-Dev-Kit).
const kit = process.env.UPW_KIT_DIR || resolve(root, '../../UnysonPlus-AI-Dev-Kit');
if (existsSync(join(kit, 'kit-manifest.json'))) {
  const dest = join(kit, 'skills/kinetic-scenes');
  rmSync(dest, { recursive: true, force: true });
  cpSync(out, dest, { recursive: true, filter: (p) => !p.endsWith('index.html') });
  console.log(`skill: copied to ${dest}`);
}
console.log(`skill: ${m.PRESET_CATALOG.length} presets, ${m.SFX_CATALOG.length} sounds, ${m.BUILT_IN_STYLES.length} styles → ${out}`);
