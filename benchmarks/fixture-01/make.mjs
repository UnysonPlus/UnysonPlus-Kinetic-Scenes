// Benchmark fixture-01: a 10-second, 9:16 side-by-side race explainer ("virtual machines boot, containers
// start"), rebuilt from measurements of a hand-made reference (positions in % of the frame, times in
// seconds). The reference itself is not kept here. Run: node benchmarks/fixture-01/make.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const Y = '#f7d117';
const LINE = '#e6e6e6';
const CARD = '#0b0b0b';
const font = 'Inter';
const cols = [{ x: 26.6 }, { x: 50 }, { x: 73.4 }];

const text = (id, t, x, y, size, extra = {}) => ({ id, type: 'text', text: t, style: { fontSize: size, fontWeight: 700, color: '#ffffff', fontFamily: font, ...(extra.style || {}) }, box: { x, y, anchor: extra.anchor || 'center' }, clips: extra.clips || [] });
const rect = (id, x, y, w, h, extra = {}) => ({ id, type: 'shape', shape: 'rect', fill: extra.fill ?? 'transparent', stroke: extra.stroke ?? LINE, strokeWidth: extra.sw ?? 0.28, radius: extra.r ?? 1.4, ...(extra.dash ? { dash: extra.dash } : {}), box: { x, y, w, h }, clips: extra.clips || [] });

const panel = (p, top, title, sub, timerTo, layers) => ({
  id: p, type: 'group', name: title, clips: [{ id: `${p}-in`, preset: 'fade', start: 0, duration: 0.4, params: { y: 4 } }], layers: [
    rect(`${p}-card`, 50, top + 16.3, 88.7, 32.6, { fill: CARD, stroke: '#1e1e1e', r: 2.4 }),
    text(`${p}-dot`, '○', 9.4, top + 2.5, 2.6, { style: { color: Y } }),
    text(`${p}-title`, title, 11.2, top + 2.5, 3.6, { anchor: 'left' }),
    text(`${p}-sub`, sub, 11.2, top + 4.7, 1.45, { anchor: 'left', style: { fontWeight: 600, letterSpacing: 0.18, uppercase: true, color: '#cfcfcf' } }),
    rect(`${p}-timer`, 77.3, top + 2.4, 29.4, 3, { r: 3, stroke: '#3a3a3a' }),
    text(`${p}-start`, 'START', 66.5, top + 2.4, 1.4, { style: { letterSpacing: 0.2, color: '#bbbbbb' } }),
    text(`${p}-secs`, `${timerTo} s`, 88.6, top + 2.4, 2.4, { anchor: 'right', style: { color: Y }, clips: [{ id: `${p}-count`, preset: 'text-count', start: 0.9, duration: timerTo === 45 ? 3.6 : 0.35, ease: 'none' }] }),
    ...layers,
  ],
});

const stackBars = (p, top, names) => names.map((n, i) => rect(`${p}-bar${i}`, 50, top + i * 3.4, 68.6, 2.7, { r: 1.2, clips: [] }))
  .flatMap((bar, i) => [bar, text(`${bar.id}-t`, names[i], 50, top + i * 3.4, 1.9, { style: { fontWeight: 600 } })]);

// Virtual machines: dashed boxes boot their guest OS (progress bars), then each gets an app.
const vm = panel('vm', 13.4, 'Virtual Machines', 'A full OS for every app', 45, [
  { ...text('vm-pill', 'start 3 apps', 50, 23.1, 1.7, { style: { color: '#ffffff', fontWeight: 700 }, clips: [
    { id: 'vm-pill-in', preset: 'pop', start: 0.35, duration: 0.3 },
    { id: 'vm-pill-boot', preset: 'text-swap', start: 0.9, duration: 0.35, params: { to: '◌ booting 3 operating systems', style: 'roll' } },
    { id: 'vm-pill-swap', preset: 'text-swap', start: 4.5, duration: 0.4, params: { to: '✓ ready in 45 s', style: 'roll' } },
  ] }), pill: { stroke: Y, strokeWidth: 0.25, padX: 0.8, padY: 0.3 } },
  { id: 'vm-boxes', type: 'repeat', items: [{ n: 1 }, { n: 2 }, { n: 3 }], step: { x: 23.4, y: 0 }, stagger: 0.12, item: { id: 'box', type: 'group', clips: [], layers: [
    rect('frame', cols[0].x, 32, 21.6, 11.3, { stroke: Y, sw: 0.22, dash: 0.9, clips: [{ id: 'march', preset: 'march', start: 0.9, duration: 3.5 }, { id: 'solid', preset: 'dash-solid', start: 4.4, duration: 0.4 }] }),
    rect('os', cols[0].x, 34.8, 19, 4.2, { stroke: Y, sw: 0.22, r: 1, clips: [{ id: 'os-in', preset: 'fade', start: 0.9, duration: 0.3 }] }),
    text('os-t', 'Guest OS', cols[0].x, 34.1, 1.7, { style: { color: Y, fontWeight: 600 }, clips: [{ id: 'os-t-in', preset: 'fade', start: 0.9, duration: 0.3 }] }),
    rect('bar', cols[0].x, 35.9, 14, 0.5, { fill: '#2b2b2b', stroke: 'transparent', r: 0.3, clips: [{ id: 'bar-in', preset: 'fade', start: 0.9, duration: 0.3, params: { y: 0 } }, { id: 'boot', preset: 'progress', start: 1, duration: 3.3, ease: 'none', params: { color: Y } }] }),
    rect('app', cols[0].x, 29.5, 18, 4, { stroke: '#ffffff', sw: 0.3, r: 1, fill: CARD, clips: [{ id: 'app-in', preset: 'stack-in', start: 4.5, duration: 0.45 }] }),
    text('app-t', 'App {{n}}', cols[0].x - 1.5, 29.5, 1.9, { clips: [{ id: 'app-t-in', preset: 'fade', start: 4.6, duration: 0.3 }] }),
  ] }, clips: [] },
  ...stackBars('vm', 39.9, ['Hypervisor', 'Hardware']),
]);

// Containers: apps are up almost at once on a shared engine.
const dk = panel('dk', 49, 'Docker Containers', 'Apps share the host OS', 1, [
  { ...text('dk-pill', 'start 3 apps', 50, 58.75, 1.7, { style: { color: '#ffffff', fontWeight: 700 }, clips: [
    { id: 'dk-pill-in', preset: 'pop', start: 0.35, duration: 0.3 },
    { id: 'dk-pill-swap', preset: 'text-swap', start: 1.15, duration: 0.3, params: { to: '✓ ready in 1 s', style: 'roll' } },
  ] }), pill: { stroke: '#2ad38b', strokeWidth: 0.25, padX: 0.8, padY: 0.3 } },
  { id: 'dk-apps', type: 'repeat', items: [{ n: 1 }, { n: 2 }, { n: 3 }], step: { x: 23.4, y: 0 }, stagger: 0.08, item: { id: 'c', type: 'group', clips: [], layers: [
    rect('app', cols[0].x, 67.5, 20, 4.9, { stroke: '#ffffff', sw: 0.3, r: 1.2, fill: CARD, clips: [{ id: 'app-in', preset: 'stack-in', start: 0.95, duration: 0.4 }] }),
    text('app-t', 'App {{n}}', cols[0].x - 1.5, 67.5, 2, { clips: [{ id: 'app-t-in', preset: 'fade', start: 1, duration: 0.3 }] }),
    { id: 'led', type: 'shape', shape: 'ellipse', fill: '#2ad38b', box: { x: cols[0].x + 6.5, y: 67.5, w: 1, ratio: 1 }, clips: [{ id: 'led-in', preset: 'pop', start: 1.2, duration: 0.25 }] },
  ] }, clips: [] },
  ...stackBars('dk', 72, ['Docker Engine', 'Host OS', 'Hardware']),
]);

const scene = {
  format: 'unysonplus-scene', version: 1, title: 'Benchmark fixture-01', duration: 10,
  stage: { breakpoints: [{ id: 'v', minWidth: 0, aspect: [9, 16] }], heightMode: 'ratio', background: '#000000', fonts: [{ family: 'Inter', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap' }] },
  playback: { trigger: 'load', loop: true, repeatDelay: 0 },
  layers: [
    text('title', 'VMs vs Docker', 50, 9, 7, { style: { color: Y, fontWeight: 800 }, clips: [{ id: 'title-in', preset: 'fade', start: 0, duration: 0.4 }] }),
    vm,
    { id: 'vs', type: 'shape', shape: 'ellipse', fill: '#000', stroke: '#ffffff', strokeWidth: 0.3, box: { x: 50, y: 47.4, w: 6.6, ratio: 1 }, clips: [] },
    text('vs-t', 'vs', 50, 47.4, 2.2),
    dk,
    // The loop: everything fades back to the empty panels before the restart.
    { id: 'reset', type: 'shape', shape: 'rect', fill: '#000', stroke: 'transparent', box: { x: 50, y: 50, w: 100, h: 100 }, opacity: 0, clips: [] },
  ],
};
// Hold, then clear for the loop: each panel group fades out at 9.2 s.
for (const g of [vm, dk]) g.clips.push({ id: `${g.id}-out`, preset: 'fade', start: 8.4, duration: 0.5, params: { direction: 'out', y: 0 } });

const out = join(dirname(fileURLToPath(import.meta.url)), 'scene.json');
writeFileSync(out, JSON.stringify(scene, null, 1));
console.log('wrote', out);
