import { defineConfig } from 'vite';

// The Lottie runtime: dist/scene-lottie.iife.js (lottie-web's light SVG player). The player loads it from next to its
// own script only when a scene has a Lottie layer, so other scenes never download it.
export default defineConfig({
  build: {
    target: 'es2019',
    lib: { entry: 'src/lottie/entry.ts', name: 'UnysonPlusSceneLottieBundle', formats: ['iife'], fileName: () => 'scene-lottie.iife.js' },
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: false,
  },
});
