// Publishes the player at a permanent, versioned address: apps/studio/public/player/<version>/.
//
// Embedded scenes load the player from that address, so a published version must never change.
// This script copies a new version in, leaves an unchanged one alone, and stops the build if the
// player's code changed without its version being bumped. Commit the folder it creates: the site is
// rebuilt from the repository on every deploy, so only committed versions stay online.
//
// A version is two files: scene-player.js, and scene-3d.js (the 3D runtime, which the player loads
// from next to itself only for scenes with a 3D layer).
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(root, 'packages/player/package.json'), 'utf8'));
const dir = join(root, 'apps/studio/public/player', version);
const normal = (s) => s.replace(/\r\n/g, '\n');
const asciiOnly = (s) => s.replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

const files = [
  { from: 'scene-player.iife.js', to: 'scene-player.js', banner: `/*! Unyson+ scene player ${version} | https://github.com/UnysonPlus/UnysonPlus-Kinetic-Scenes */\n` },
  {
    from: 'scene-3d.iife.js', to: 'scene-3d.js',
    banner: `/*! Unyson+ scene player ${version}, 3D runtime | three.js (MIT, © three.js authors) | 3D text font: Inter (SIL OFL 1.1, © The Inter Project Authors) */\n`,
  },
  {
    from: 'scene-lottie.iife.js', to: 'scene-lottie.js',
    banner: `/*! Unyson+ scene player ${version}, Lottie runtime | lottie-web (MIT, (c) Bodymovin / Airbnb) */
`,
  },
];

let published = 0;
for (const f of files) {
  const built = join(root, 'packages/player/dist', f.from);
  if (!existsSync(built)) continue;
  // ASCII only: a page that does not declare UTF-8 would misread raw accented characters (some are
  // property names in the 3D font) and the script would not parse. \u escapes work everywhere.
  const content = asciiOnly(f.banner + readFileSync(built, 'utf8'));
  const target = join(dir, f.to);
  if (existsSync(target)) {
    if (normal(readFileSync(target, 'utf8')) !== normal(content)) {
      console.error(
        `\nThe scene player changed (${f.to}), but version ${version} is already published at player/${version}/.\n` +
        `Published versions must never change (embedded scenes depend on them).\n` +
        `Bump packages/player/package.json, then build again.\n`,
      );
      process.exit(1);
    }
  } else {
    mkdirSync(dir, { recursive: true });
    writeFileSync(target, content);
    published++;
  }
}
console.log(published
  ? `player ${version}: published to apps/studio/public/player/${version}/ (commit this folder)`
  : `player ${version}: already published, unchanged`);

// The newest version's number, for tools that load the player without knowing it (the AI Dev Kit's
// scene commands). This one file is rewritten on every build; the versioned folders never are.
writeFileSync(join(root, 'apps/studio/public/player/latest.json'), JSON.stringify({ version, base: `player/${version}/` }) + '\n');
