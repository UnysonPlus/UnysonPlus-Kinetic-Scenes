import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const studio = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const player = JSON.parse(readFileSync(new URL('../../packages/player/package.json', import.meta.url), 'utf8'));

// One source of truth for the version and release stage: the build publishes them as /version.json, which the docs,
// the roadmap and the overview read instead of a number typed by hand.
const versionFile = {
  name: 'upw-version-json',
  generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: studio.version, stage: studio.releaseStage ?? 'Beta', player: player.version, built: new Date().toISOString().slice(0, 10) }) });
  },
};

// Served from the root of its own subdomain, so the base path is "/".
export default defineConfig({
  base: '/',
  plugins: [react(), versionFile],
  define: {
    __STUDIO_VERSION__: JSON.stringify(studio.version),
    __PLAYER_VERSION__: JSON.stringify(player.version),
  },
  build: { target: 'es2020', sourcemap: false },
});
