import { defineConfig } from 'vite';

// The paint engine: dist/scene-paint.iife.js (p5.brush's standalone build). The player loads it from next to its own
// script only when a scene uses the Painted look, so other scenes never download it.
export default defineConfig({
  build: {
    target: 'es2019',
    lib: { entry: 'src/paint/entry.ts', name: 'UnysonPlusScenePaintBundle', formats: ['iife'], fileName: () => 'scene-paint.iife.js' },
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: false,
  },
});
