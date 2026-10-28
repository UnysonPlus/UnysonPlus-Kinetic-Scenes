// Tested and published: a repeatable compatibility run for Kinetic Scenes. For each browser engine (Chromium for Chrome
// and Edge, Firefox, WebKit for Safari) and two phone profiles (an iPhone on WebKit; a mid-range Android on Chromium
// with its CPU slowed 4x), it checks that:
//   - the Studio opens with no errors;
//   - the published player plays the demo scene smoothly (frames per second while playing);
//   - a big scene (150 layers, every one animated) still plays smoothly;
//   - a scene using the Phase 19 looks (boil, scanlines, halftone, text looks) plays with no errors.
// Results go to results.json and print as a table. Run from a folder where `playwright` resolves:
//   PLAYWRIGHT=<node_modules/playwright folder> node benchmarks/compat/run.mjs [studio-url]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium, firefox, webkit, devices } = require(process.env.PLAYWRIGHT || 'playwright');
const STUDIO = process.argv[2] || 'https://kinetic-scenes.unysonplus.com/';
const root = new URL('../../', import.meta.url);
const latest = JSON.parse(readFileSync(new URL('apps/studio/public/player/latest.json', root), 'utf8'));
const PLAYER = new URL(latest.base, STUDIO).href;
const demo = JSON.parse(readFileSync(new URL('apps/studio/src/scenes/demo.json', root), 'utf8'));

/** 150 layers on a 10 x 15 grid, each with an entrance and a slow drift. */
function bigScene() {
  const layers = [];
  for (let i = 0; i < 150; i++) {
    const x = 5 + (i % 15) * 6.4, y = 8 + Math.floor(i / 15) * 9;
    layers.push({ id: `b${i}`, type: i % 3 ? 'shape' : 'text', ...(i % 3 ? { shape: i % 2 ? 'ellipse' : 'rect', fill: `hsl(${(i * 23) % 360} 70% 55%)` } : { text: `#${i}`, style: { fontSize: 1.4, color: '#fff' } }),
      box: { x, y, w: 4, h: 6 }, clips: [{ id: `e${i}`, preset: ['pop', 'slide', 'fade', 'wipe'][i % 4], start: (i % 20) * 0.05, duration: 0.5 }, { id: `d${i}`, preset: 'drift', start: 1.2, duration: 3.6 }] });
  }
  return { format: 'unysonplus-scene', version: 1, title: 'Big scene', duration: 5, stage: { breakpoints: [{ id: 'd', label: 'D', minWidth: 0, aspect: [16, 9] }], background: '#111' }, playback: { trigger: 'manual', loop: true }, layers };
}

/** The Phase 19 looks together. */
function looksScene() {
  const L = (id, preset, extra = {}) => ({ id, type: 'text', text: id, box: { x: 15 + Object.keys(L).length, y: 50 }, style: { fontSize: 5, color: '#fff' }, clips: [{ id: `${id}-c`, preset, start: 0.2, duration: 2.5 }], ...extra });
  const layers = [['boil', 'boil'], ['scan', 'scanlines'], ['half', 'halftone'], ['out', 'text-outline'], ['deep', 'text-3d'], ['grad', 'text-gradient'], ['skew', 'text-skew']].map(([id, p], i) => ({ ...L(id, p), box: { x: 8 + i * 13, y: 50, w: 12 } }));
  layers.push({ id: 'blob', type: 'shape', shape: 'ellipse', fill: '#2ad38b', box: { x: 50, y: 20, w: 12, ratio: 1 }, clips: [{ id: 'blob-c', preset: 'liquid', start: 0, duration: 3 }] });
  layers.push({ id: 'pix', type: 'shape', shape: 'rect', fill: '#8b7bff', box: { x: 50, y: 80, w: 20, h: 12 }, clips: [{ id: 'pix-c', preset: 'pixelate', start: 0, duration: 1 }, { id: 'br-c', preset: 'brush', start: 1, duration: 1 }] });
  return { format: 'unysonplus-scene', version: 1, title: 'Looks', duration: 3, stage: { breakpoints: [{ id: 'd', label: 'D', minWidth: 0, aspect: [16, 9] }], background: '#111' }, playback: { trigger: 'manual', loop: true }, layers };
}

/** Plays a scene for ~3 s in a page with the published player and measures the frames drawn per second. */
async function playScene(page, scene) {
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#000"><div id="h" style="width:960px;height:540px"></div><script src="${PLAYER}scene-player.js"></script></body></html>`);
  await page.waitForFunction(() => !!window.UnysonPlusScene, null, { timeout: 30000 });
  return page.evaluate(async (s) => {
    const p = window.UnysonPlusScene.mount(document.getElementById('h'), s, {});
    await p.whenReady(8000);
    let frames = 0, run = true;
    const tick = () => { frames++; if (run) requestAnimationFrame(tick); };
    p.play(); const t0 = performance.now(); requestAnimationFrame(tick);
    await new Promise((r) => setTimeout(r, 3000));
    run = false; const fps = frames / ((performance.now() - t0) / 1000);
    p.destroy();
    return Math.round(fps);
  }, scene);
}

const PROFILES = [
  { name: 'Chrome / Edge (Chromium)', engine: chromium, ctx: {} },
  { name: 'Firefox', engine: firefox, ctx: {} },
  { name: 'Safari (WebKit)', engine: webkit, ctx: {} },
  { name: 'iPhone 13 (WebKit)', engine: webkit, ctx: devices['iPhone 13'] },
  { name: 'Mid-range Android (Chromium, CPU 4x slower)', engine: chromium, ctx: devices['Pixel 7'], throttle: 4 },
];

const rows = [];
for (const prof of PROFILES) {
  const row = { profile: prof.name };
  const browser = await prof.engine.launch();
  try {
    const ctx = await browser.newContext(prof.ctx);
    const page = await ctx.newPage();
    if (prof.throttle) { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.throttle }); }
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    row.version = (await browser.version());
    await page.goto(STUDIO, { waitUntil: 'load', timeout: 60000 }).catch((e) => errors.push(String(e.message).split('\n')[0]));
    await page.waitForTimeout(3000);
    row.studio = errors.length ? `errors: ${errors[0].slice(0, 80)}` : 'ok';
    errors.length = 0;
    row.demoFps = await playScene(page, demo).catch((e) => `error: ${e.message.split('\n')[0].slice(0, 60)}`);
    row.bigFps = await playScene(page, bigScene()).catch((e) => `error: ${e.message.split('\n')[0].slice(0, 60)}`);
    row.looks = await playScene(page, looksScene()).then((fps) => (errors.length ? `errors: ${errors[0].slice(0, 60)}` : `ok (${fps} fps)`)).catch((e) => `error: ${e.message.split('\n')[0].slice(0, 60)}`);
  } finally { await browser.close(); }
  rows.push(row);
  console.log(JSON.stringify(row));
}
writeFileSync(join(fileURLToPath(new URL('.', import.meta.url)), 'results.json'), JSON.stringify({ date: new Date().toISOString().slice(0, 10), studio: STUDIO, player: latest.version, rows }, null, 2));
