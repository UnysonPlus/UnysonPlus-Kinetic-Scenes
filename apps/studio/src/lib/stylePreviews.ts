import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import type { SceneStyle, StyleMove } from './styles';

/**
 * What the start screen shows for each style: a few seconds that make the style recognisable, in its own colours, fonts
 * and motion. A title card only tells the fonts apart; a paper style needs paper, a data style needs a chart.
 * scripts/style-posters.ts photographs each one (public/styles/<id>.jpg); hovering plays the scene itself.
 * A new built-in style: add its preview below, then run that script. Styles with no preview here show a title card.
 */

export const PREVIEW_SECONDS = 4.2;
/** The moment the photo is taken: everything has landed. */
export const POSTER_TIME = 3.1;

/** The start screen's filters, in the order they are shown. Explainers come first: most people start there. */
export const STYLE_GROUPS: Array<{ id: string; label: string; styles: string[] }> = [
  { id: 'tech', label: 'Tech and product', styles: ['living-ui', 'data-story', 'keynote', 'night', 'hud', 'neon', 'aurora-glass', 'isometric', 'blueprint', 'crt-terminal', 'radar', 'transit-map', 'thermal', 'xray', 'exploded'] },
  { id: 'clean', label: 'Clean and bold', styles: ['clean', 'swiss', 'editorial', 'bauhaus', 'kinetic', 'social-captions', 'luxe'] },
  { id: 'drawn', label: 'Drawn and crafted', styles: ['sketchbook', 'line-art', 'flat-vector', 'cel', 'paper', 'collage', 'watercolour', 'whiteboard', 'woodcut', 'chalkboard', 'ink-wash', 'stained-glass', 'sketchnote', 'ukiyo-e', 'silhouette'] },
  { id: 'fun', label: 'Retro and playful', styles: ['synthwave', 'vhs', 'pixel', 'risograph', 'toy-3d', 'playful', 'pastel', 'liquid', 'newsreel', 'neon-sign', 'game-show', 'rubber-hose', 'silent-film', 'low-poly'] },
];

const svgUrl = (body: string, w: number, h: number) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`;

export function stylePreview(style: SceneStyle): Scene | null {
  const P = { ...style.palette, accent2: style.palette.accent2 ?? style.palette.accent };
  const F = style.fonts;
  let n = 0;
  const c = (preset: string, start: number, duration: number, params?: Record<string, unknown>): Clip => ({ id: `c${++n}`, preset, start, duration, ...(params ? { params } : {}) });
  const move = (m: StyleMove, start: number, duration: number): Clip => ({
    id: `c${++n}`, preset: m.preset, start, duration, ease: style.motion.easeIn,
    params: { ...(m.params ?? {}), ...(presetMeta[m.preset]?.fields.some((f) => f.key === 'direction') ? { direction: 'in' } : {}) },
  });
  const pop = (t: number, from = 0.5) => c('pop', t, 0.4, { direction: 'in', from });
  const up = (t: number) => c('stack-in', t, 0.4, { direction: 'in', lift: 30 });
  const text = (id: string, t: string, x: number, y: number, size: number, color: string, clips: Clip[], o: { body?: boolean; align?: 'left' | 'center' | 'right'; w?: number; weight?: number } = {}): Layer => ({
    id, type: 'text', text: t, box: { x, y, ...(o.w ? { w: o.w } : {}), ...(o.align === 'left' && !o.w ? { anchor: 'left' } : {}) },
    style: { fontFamily: o.body ? F.body : F.heading, fontWeight: o.weight ?? (o.body ? F.bodyWeight : F.headingWeight), fontSize: size, color, align: o.align ?? 'center', lineHeight: 1.04, ...(F.uppercase && !o.body ? { uppercase: true } : {}) },
    clips,
  } as Layer);
  const head = (x: number, y: number, size: number, o: { w?: number; align?: 'left' | 'center' | 'right'; t?: string; at?: number; color?: string } = {}) =>
    text('head', o.t ?? style.sample.headline, x, y, size, o.color ?? P.text, [move(style.motion.headline, o.at ?? 0.5, 0.8)], o);
  const rect = (id: string, x: number, y: number, w: number, h: number, fill: string, clips: Clip[], more: Record<string, unknown> = {}): Layer => ({ id, type: 'shape', shape: 'rect', box: { x, y, w, h }, fill, clips, ...more } as Layer);
  const dot = (id: string, x: number, y: number, w: number, fill: string, clips: Clip[], more: Record<string, unknown> = {}): Layer => ({ id, type: 'shape', shape: 'ellipse', box: { x, y, w, ratio: 1 }, fill, clips, ...more } as Layer);
  const art = (id: string, body: string, vw: number, vh: number, x: number, y: number, w: number, clips: Clip[]): Layer => ({ id, type: 'image', src: svgUrl(body, vw, vh), alt: '', fit: 'contain', box: { x, y, w, ratio: vw / vh }, clips } as Layer);
  const hold = (t: number) => c('drift', t, PREVIEW_SECONDS - t, { x: 0, y: 0, scale: 1.03, rotate: 0 });
  const range = (k: number) => Array.from({ length: k }, (_, i) => i);

  // A small working screen: the shape several tech styles share.
  const screen = (card: string, line: string, accent: string, cursor: boolean): Layer[] => [
    rect('win', 50, 50, 70, 74, card, [c('fade', 0, 0.3, { direction: 'in', y: 4 })], { radius: 1.4, stroke: line, strokeWidth: 0.1 }),
    rect('bar', 50, 19, 70, 12, accent, [c('fade', 0.05, 0.25, { direction: 'in' })], { radius: 1.4 }),
    ...range(3).map((i) => dot(`w${i}`, 19 + i * 3, 19, 1.5, card, [])),
    ...range(3).map((i) => rect(`k${i}`, 28 + i * 22, 41, 19, 22, line, [up(0.35 + i * 0.14)], { radius: 1 })),
    ...range(3).map((i) => text(`kn${i}`, ['128', '64%', '9.2'][i], 28 + i * 22, 41, 3.6, P.text, [pop(0.5 + i * 0.14, 0.7)])),
    rect('row1', 50, 65, 62, 5, line, [c('wipe', 1.1, 0.4, { direction: 'in', from: 'left' })], { radius: 0.6 }),
    rect('row2', 44, 74, 50, 5, line, [c('wipe', 1.25, 0.4, { direction: 'in', from: 'left' })], { radius: 0.6 }),
    rect('btn', 70, 74, 14, 7, accent, [pop(1.6)], { radius: 0.8 }),
    ...(cursor ? [{ id: 'cur', type: 'cursor', box: { x: 92, y: 90, w: 3, ratio: 0.7 }, clips: [c('cursor-move', 1.5, 0.8, { to: 'btn', x: 50, y: 50 }), c('cursor-click', 2.35, 0.3)] } as unknown as Layer] : []),
    ...(cursor ? [rect('toast', 78, 14, 34, 11, P.text, [c('slide', 2.65, 0.3, { direction: 'in', from: 'right' })], { radius: 0.8 }), text('toastt', 'Saved', 78, 14, 3, card, [c('fade', 2.8, 0.2, { direction: 'in' })], { body: true })] : []),
  ];

  const scenes: Record<string, () => Layer[]> = {
    night: () => screen('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.09)', P.accent, false),
    'living-ui': () => screen('#ffffff', 'rgba(60,70,120,0.1)', P.accent, true),
    clean: () => [
      ...range(5).map((i) => rect(`b${i}`, 42 + i * 9.5, 74 - (12 + i * 7) / 2 + 0, 7, 12 + i * 7, i === 4 ? P.accent : 'rgba(30,50,110,0.13)', [c('wipe', 0.5 + i * 0.1, 0.4, { direction: 'in', from: 'bottom' })], { radius: 0.4 })),
      rect('axis', 61, 75, 46, 0.4, P.muted, [c('fade', 0.3, 0.3, { direction: 'in' })]),
      head(21, 44, 5.6, { w: 32, align: 'left', t: 'Growth you can see.' }),
    ],
    'data-story': () => [
      text('big', '212%', 25, 42, 12, P.accent, [c('text-count', 0.3, 1.6, { from: 0 })]),
      text('lab', 'since January', 25, 58, 2.6, P.muted, [c('fade', 0.8, 0.4, { direction: 'in' })], { body: true }),
      ...range(6).map((i) => { const h = [16, 22, 20, 30, 38, 58][i]; return rect(`b${i}`, 52 + i * 7.6, 80 - h / 2, 5.6, h, i === 5 ? P.accent : 'rgba(255,255,255,0.14)', [c('wipe', 0.5 + i * 0.13, 0.45, { direction: 'in', from: 'bottom' })], { radius: 0.3 }); }),
      rect('axis', 71, 80.5, 46, 0.4, P.muted, [c('fade', 0.3, 0.3, { direction: 'in' })]),
    ],
    keynote: () => [
      dot('halo', 50, 62, 66, `radial-gradient(closest-side, ${P.accent}55, transparent)`, [c('fade', 0.2, 1, { direction: 'in' })]),
      rect('dev', 50, 66, 44, 46, 'linear-gradient(180deg,#2a2d33,#0d0e11)', [c('zoom', 0.3, 1.1, { direction: 'in', scale: 0.86 })], { radius: 1.6, stroke: 'rgba(255,255,255,0.28)', strokeWidth: 0.12 }),
      rect('devs', 50, 66, 40, 40, `linear-gradient(135deg, ${P.accent}, #06080c 70%)`, [c('fade', 0.8, 0.7, { direction: 'in' })], { radius: 1 }),
      head(50, 21, 7.6, { t: 'The fastest yet.', at: 0.9 }),
    ],
    hud: () => [
      ...[56, 40, 24].map((w, i) => dot(`r${i}`, 50, 50, w, 'transparent', [c('zoom', 0.1 + i * 0.15, 0.6, { direction: 'in', scale: 0.7 })], { stroke: P.accent, strokeWidth: i === 1 ? 0.3 : 0.12, opacity: 0.8 })),
      rect('h', 50, 50, 70, 0.2, P.accent, [c('wipe', 0.4, 0.5, { direction: 'in', from: 'left' })], { opacity: 0.6 }),
      rect('v', 50, 50, 0.12, 80, P.accent, [c('wipe', 0.5, 0.5, { direction: 'in', from: 'top' })], { opacity: 0.6 }),
      text('pc', '98.6%', 50, 50, 5.4, P.text, [c('text-count', 0.5, 1.4, { from: 0 })]),
      text('t1', 'TARGET', 15, 22, 2.1, P.accent, [c('fade', 1, 0.3, { direction: 'in' })], { body: true }),
      text('t2', 'LOCK 04', 85, 22, 2.1, P.accent, [c('fade', 1.2, 0.3, { direction: 'in' })], { body: true }),
      text('t3', 'SCAN', 15, 78, 2.1, P.accent, [c('fade', 1.4, 0.3, { direction: 'in' })], { body: true }),
      text('t4', 'ACQUIRED', 83, 78, 2.1, P.accent2, [c('pop', 2, 0.3, { direction: 'in', from: 0.7 })], { body: true }),
    ],
    neon: () => [
      { id: 'term', type: 'code', title: 'deploy.sh', frame: 'terminal', fontSize: 2.5, code: '$ npm run build\n✓ 214 modules\n$ npm run ship\n✓ live in 4.2 s', box: { x: 50, y: 50, w: 74, h: 62 }, clips: [c('fade', 0, 0.25, { direction: 'in' }), c('code-type', 0.2, 2.5)] } as unknown as Layer,
    ],
    'aurora-glass': () => [
      dot('a1', 26, 32, 56, `radial-gradient(closest-side, ${P.accent}, transparent)`, [c('float', 0, PREVIEW_SECONDS, { height: 14, cycles: 1 })]),
      dot('a2', 76, 66, 60, `radial-gradient(closest-side, ${P.accent2}, transparent)`, [c('float', 0, PREVIEW_SECONDS, { height: 12, cycles: 1 })]),
      rect('glass', 50, 50, 56, 56, 'rgba(255,255,255,0.11)', [c('fade', 0.3, 0.6, { direction: 'in', y: 6 })], { radius: 2, stroke: 'rgba(255,255,255,0.32)', strokeWidth: 0.12 }),
      head(50, 44, 6.2, { w: 50, t: 'Clarity, layered.', at: 0.7 }),
      rect('gl', 50, 60, 30, 3, 'rgba(255,255,255,0.28)', [c('wipe', 1.2, 0.4, { direction: 'in', from: 'left' })], { radius: 1 }),
    ],
    isometric: () => {
      const cube = (a: string, b: string, d: string) => `<path d="M60 0 120 30 60 60 0 30Z" fill="${a}"/><path d="M0 30 60 60V116L0 86Z" fill="${b}"/><path d="M120 30 60 60V116L120 86Z" fill="${d}"/>`;
      const at: Array<[number, number, number]> = [[50, 66, 15], [36, 54, 15], [64, 54, 15], [50, 42, 15], [50, 40, 15]];
      return [
        art('floor', '<path d="M200 0 400 100 200 200 0 100Z" fill="rgba(90,110,200,0.12)"/>', 400, 200, 50, 60, 76, [c('fade', 0, 0.3, { direction: 'in' })]),
        ...at.slice(0, 4).map(([x, y, w], i) => art(`q${i}`, cube(i === 3 ? P.accent : '#FFFFFF', i === 3 ? `${P.accent}cc` : '#C9D3F2', i === 3 ? `${P.accent}99` : '#AAB8E8'), 120, 116, x, y, w, [c('stack-in', 0.3 + i * 0.28, 0.45, { direction: 'in', lift: 90 })])),
        art('tall', cube(P.accent2, `${P.accent2}cc`, `${P.accent2}99`), 120, 116, 50, 25, 12, [c('stack-in', 1.5, 0.45, { direction: 'in', lift: 90 })]),
      ];
    },
    swiss: () => [
      rect('blk', 80, 50, 40, 100, P.accent, [c('wipe', 0.1, 0.5, { direction: 'in', from: 'right' })]),
      text('a', 'Less,', 6, 28, 15, P.text, [move(style.motion.headline, 0.4, 0.6)], { align: 'left' }),
      text('b', 'but', 6, 52, 15, P.text, [move(style.motion.headline, 0.6, 0.6)], { align: 'left' }),
      text('d', 'better.', 6, 76, 15, P.text, [move(style.motion.headline, 0.8, 0.6)], { align: 'left' }),
    ],
    editorial: () => [
      head(35, 42, 9.4, { w: 58, align: 'left', t: 'Slow is a style.' }),
      rect('rule', 19, 66, 26, 0.5, P.accent, [c('wipe', 1.1, 0.4, { direction: 'in', from: 'left' })]),
      ...range(9).map((i) => rect(`p${i}`, i % 3 === 2 ? 79 : 82, 26 + i * 6, i % 3 === 2 ? 24 : 30, 1.2, P.muted, [c('fade', 1 + i * 0.06, 0.25, { direction: 'in' })], { opacity: 0.45 })),
      text('n', 'No. 12', 82, 16, 2.4, P.accent, [c('fade', 0.9, 0.3, { direction: 'in' })], { body: true }),
    ],
    bauhaus: () => [
      dot('c1', 26, 38, 32, P.accent, [c('zoom', 0.2, 0.5, { direction: 'in', scale: 0.4 })]),
      rect('s1', 56, 40, 22, 40, P.text, [c('wipe', 0.5, 0.45, { direction: 'in', from: 'top' })]),
      art('t1', `<path d="M100 0 200 174H0Z" fill="${P.accent2}"/>`, 200, 174, 80, 62, 26, [c('slide', 0.8, 0.45, { direction: 'in', from: 'right' })]),
      head(36, 83, 6.4, { t: 'Make it plain.', at: 1.2 }),
    ],
    kinetic: () => [
      text('a', 'RUN', 50, 24, 19, P.text, [c('text-slam', 0.1, 0.3, { direction: 'in', scale: 2.4, blur: 1 })]),
      text('b', 'LOUDER', 50, 53, 19, P.accent, [c('text-slam', 0.55, 0.3, { direction: 'in', scale: 2.4, blur: 1 }), c('shake', 0.9, 0.4, { strength: 8 })]),
      rect('s', 50, 80, 84, 7, P.accent, [c('wipe', 1.1, 0.25, { direction: 'in', from: 'left' })]),
      text('c', 'OUT NOW', 50, 80, 3.6, '#000000', [c('fade', 1.3, 0.2, { direction: 'in' })]),
    ],
    'social-captions': () => [
      rect('ph', 50, 50, 28, 92, '#1e2024', [c('fade', 0, 0.3, { direction: 'in' })], { radius: 2.4, stroke: 'rgba(255,255,255,0.22)', strokeWidth: 0.15 }),
      dot('face', 50, 34, 13, P.muted, [c('fade', 0.1, 0.3, { direction: 'in' })]),
      rect('sh', 50, 56, 19, 22, P.muted, [c('fade', 0.1, 0.3, { direction: 'in' })], { radius: 2 }),
      text('w1', 'WATCH', 50, 62, 5.6, '#FFFFFF', [c('pop', 0.5, 0.25, { direction: 'in', from: 0.6 })]),
      text('w2', 'THIS', 50, 72, 6.6, P.accent, [c('pop', 1.1, 0.25, { direction: 'in', from: 0.6 })]),
    ],
    luxe: () => [
      rect('fr', 50, 50, 64, 74, 'transparent', [c('fade', 0.2, 0.8, { direction: 'in' })], { stroke: P.accent, strokeWidth: 0.12 }),
      head(50, 46, 8, { t: 'Made to last.', at: 0.7 }),
      rect('l', 50, 60, 10, 0.25, P.accent, [c('wipe', 1.4, 0.5, { direction: 'in', from: 'center' })]),
      text('s', 'Hand-finished', 50, 67, 2.3, P.muted, [c('fade', 1.6, 0.6, { direction: 'in' })], { body: true }),
    ],
    sketchbook: () => {
      const sk = (id: string, shape: 'rect' | 'ellipse', x: number, y: number, w: number, h: number, fill: string, at: number): Layer => ({ id, type: 'shape', shape, box: { x, y, w, h }, fill, stroke: P.text, strokeWidth: 0.25, clips: [c('sketch', at, PREVIEW_SECONDS - at, { style: 'hachure', roughness: 1.6, weight: 2.4, gap: 6, color: P.text, fill, fps: 5 }), c('pop', at, 0.25, { direction: 'in', from: 0.7 })], start: at } as Layer);
      return [sk('a', 'rect', 26, 58, 26, 34, P.accent, 0.2), sk('b', 'ellipse', 53, 56, 20, 36, P.accent2, 0.6), sk('c', 'rect', 77, 60, 22, 30, P.accent, 1), head(50, 18, 8.4, { at: 1.3, t: 'Draw it out.' })];
    },
    'line-art': () => [
      { id: 'l1', type: 'path', d: 'M4 92 C20 60 24 24 42 24 C60 24 54 74 70 74 C84 74 84 30 97 12', stroke: P.text, strokeWidth: 0.5, box: { x: 50, y: 52, w: 80, h: 64 }, clips: [c('draw', 0.1, 1.5, { direction: 'in' })] } as unknown as Layer,
      { id: 'l2', type: 'path', d: 'M0 50 C30 10 70 90 100 50', stroke: P.accent, strokeWidth: 0.5, box: { x: 50, y: 58, w: 72, h: 26 }, clips: [c('draw', 0.7, 1.3, { direction: 'in' })] } as unknown as Layer,
      dot('d', 83, 22, 5, 'transparent', [pop(1.8)], { stroke: P.text, strokeWidth: 0.4 }),
      text('w', 'One line at a time', 28, 84, 3.6, P.text, [c('fade', 1.8, 0.5, { direction: 'in' })]),
    ],
    'flat-vector': () => [
      dot('sun', 78, 28, 18, P.accent2, [pop(0.2)]),
      rect('lap', 42, 54, 44, 40, P.text, [up(0.3)], { radius: 1.2 }),
      rect('scr', 42, 52, 39, 31, '#FFFFFF', [c('fade', 0.5, 0.3, { direction: 'in' })], { radius: 0.5 }),
      rect('bs', 42, 76, 54, 3.2, P.text, [c('wipe', 0.5, 0.3, { direction: 'in', from: 'center' })], { radius: 1 }),
      rect('c1', 42, 46, 28, 4, P.accent, [c('wipe', 0.8, 0.3, { direction: 'in', from: 'left' })], { radius: 1 }),
      rect('c2', 38, 54, 20, 4, P.accent2, [c('wipe', 1, 0.3, { direction: 'in', from: 'left' })], { radius: 1 }),
      rect('pot', 82, 72, 10, 12, P.accent, [up(0.9)], { radius: 0.6 }),
      dot('leaf', 82, 55, 13, P.accent2, [pop(1.1)]),
      head(50, 90, 4.6, { t: 'Easy as 1-2-3.', at: 1.3 }),
    ],
    cel: () => [
      dot('body', 50, 54, 34, P.accent, [c('pop', 0.2, 0.5, { direction: 'in', from: 0.3 }), c('boil', 0.7, PREVIEW_SECONDS - 0.7, { amount: 3, fps: 12 })], { stroke: P.text, strokeWidth: 0.8 }),
      dot('e1', 44, 48, 6, '#FFFFFF', [pop(0.6)], { stroke: P.text, strokeWidth: 0.5 }),
      dot('e2', 56, 48, 6, '#FFFFFF', [pop(0.65)], { stroke: P.text, strokeWidth: 0.5 }),
      dot('p1', 45, 48, 2.2, P.text, [pop(0.7)]),
      dot('p2', 57, 48, 2.2, P.text, [pop(0.75)]),
      art('m', `<path d="M5 5C30 50 70 50 95 5" fill="none" stroke="${P.text}" stroke-width="8" stroke-linecap="round"/>`, 100, 50, 50, 62, 12, [pop(0.9)]),
      head(50, 15, 6.6, { t: 'Here we go!', at: 1 }),
    ],
    paper: () => {
      const cut = (a: number) => c('paper', a, PREVIEW_SECONDS - a, { rough: 2.6, grain: 0.3, lift: 1.4 });
      return [
        dot('sun', 80, 38, 16, '#f6c445', [cut(0), c('stack-in', 0.1, 0.4, { direction: 'in', lift: 20 })]),
        dot('h1', 18, 118, 90, '#3c9d86', [cut(0), c('stack-in', 0.25, 0.4, { direction: 'in', lift: 26 })]),
        dot('h2', 84, 128, 100, '#2a7f6b', [cut(0), c('stack-in', 0.4, 0.4, { direction: 'in', lift: 26 })]),
        rect('ho', 40, 60, 16, 20, '#f4e9d2', [cut(0.6), c('stack-in', 0.6, 0.4, { direction: 'in', lift: 26 })]),
        art('roof', '<path d="M50 0 100 44H0Z" fill="#c8553d"/>', 100, 44, 40, 42, 22, [cut(0.75), c('stack-in', 0.75, 0.4, { direction: 'in', lift: 26 })]),
        { ...text('tag', 'A small paper world', 50, 16, 4, '#10302a', [c('stack-in', 1.2, 0.35, { direction: 'in', lift: 20 }), c('paper', 1.2, PREVIEW_SECONDS - 1.2, { rough: 1.4, grain: 0.2, lift: 1 })]), pill: { fill: '#fff7d6', padX: 1.2, padY: 0.5, radius: 0.4 } } as Layer,
      ];
    },
    collage: () => [
      rect('p1', 32, 48, 34, 58, '#d9d2c3', [c('stack-in', 0.1, 0.25, { direction: 'in', lift: 30 })], { rotate: -6 } as never),
      rect('p2', 64, 54, 32, 46, P.accent, [c('stack-in', 0.35, 0.25, { direction: 'in', lift: 30 })]),
      rect('t1', 28, 20, 14, 4, 'rgba(240,220,150,0.8)', [pop(0.7)]),
      rect('t2', 72, 30, 14, 4, 'rgba(240,220,150,0.8)', [pop(0.8)]),
      head(50, 50, 10, { t: 'Cut it.', at: 0.9 }),
    ],
    watercolour: () => [
      art('wash', `<defs><filter id="b"><feGaussianBlur stdDeviation="14"/><feTurbulence baseFrequency="0.02" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="40"/></filter></defs><g filter="url(#b)"><ellipse cx="150" cy="150" rx="120" ry="90" fill="${P.accent}" opacity=".55"/><ellipse cx="300" cy="170" rx="130" ry="95" fill="${P.accent2}" opacity=".5"/><ellipse cx="230" cy="110" rx="90" ry="70" fill="${P.accent}" opacity=".35"/></g>`, 450, 300, 50, 50, 86, [c('fade', 0.1, 1.2, { direction: 'in', scale: 0.94 })]),
      head(50, 50, 8.4, { t: 'Slow is beautiful.', at: 1 }),
    ],
    synthwave: () => [
      art('sun', `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ff2e88"/></linearGradient></defs><circle cx="100" cy="100" r="100" fill="url(#g)"/>${[118, 138, 156, 172, 186].map((y, i) => `<rect x="0" y="${y}" width="200" height="${4 + i * 1.6}" fill="#1a0b3a"/>`).join('')}`, 200, 200, 50, 40, 34, [c('stack-in', 0.1, 0.8, { direction: 'in', lift: 40 })]),
      art('grid', range(11).map((i) => `<line x1="${i * 40}" y1="0" x2="${(i - 5) * 110 + 200}" y2="110" stroke="${P.accent}" stroke-width="1.2"/>`).join('') + [8, 22, 42, 70, 108].map((y) => `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${P.accent}" stroke-width="1.2"/>`).join(''), 400, 110, 50, 80, 100, [c('fade', 0.3, 0.6, { direction: 'in' })]),
      head(50, 62, 6.6, { t: 'Into the neon.', at: 1 }),
    ],
    vhs: () => [
      text('play', 'PLAY ▶', 14, 13, 3.4, P.text, [c('fade', 0.1, 0.2, { direction: 'in' })], { body: true }),
      text('time', '00:14:22', 86, 13, 3.4, P.text, [c('fade', 0.2, 0.2, { direction: 'in' })], { body: true }),
      head(50, 50, 8, { t: 'Rewind the summer.', at: 0.5, w: 84 }),
      text('date', 'JUL 14 1994', 18, 88, 2.8, P.accent, [c('fade', 0.9, 0.2, { direction: 'in' })], { body: true }),
      rect('tex', 50, 50, 100, 100, 'transparent', [c('scanlines', 0, PREVIEW_SECONDS, { bleed: 0.5, jitter: 0.25 })]),
    ],
    pixel: () => {
      const map = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'];
      const px = map.flatMap((r, y) => [...r].map((v, x) => (v === '1' ? `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="${P.accent}"/>` : ''))).join('');
      return [
        ...range(3).map((i) => art(`h${i}`, px, 70, 60, 34 + i * 16, 30, 12, [c('pop', 0.2 + i * 0.25, 0.1, { direction: 'in', from: 0.2 })])),
        head(50, 58, 8.4, { t: 'Press start', at: 0.9 }),
        rect('bar', 50, 78, 50, 4, P.accent2, [c('wipe', 1.4, 0.8, { direction: 'in', from: 'left' })]),
      ];
    },
    risograph: () => [
      dot('a', 40, 48, 46, P.accent, [c('zoom', 0.2, 0.5, { direction: 'in', scale: 0.7 }), c('halftone', 0.7, 0.6, { direction: 'in', dot: 1.1, ink: P.accent2, offset: 0.6 })]),
      dot('b', 62, 52, 40, P.accent2, [c('zoom', 0.5, 0.5, { direction: 'in', scale: 0.7 })], { opacity: 0.75 }),
      head(50, 50, 8.6, { t: 'Ink is louder.', at: 1 }),
    ],
    'toy-3d': () => [
      ...[[28, 56, 26, P.accent], [54, 46, 34, P.accent2], [78, 60, 20, P.accent]].map(([x, y, w, col], i) => dot(`s${i}`, x as number, y as number, w as number, `radial-gradient(circle at 34% 28%, #ffffff 0%, ${col} 34%, ${col} 62%, rgba(0,0,0,0.22) 100%)`, [c('pop', 0.2 + i * 0.22, 0.5, { direction: 'in', from: 0.2 }), c('float', 0.8, PREVIEW_SECONDS - 0.8, { height: 6, cycles: 2 })])),
      head(50, 87, 5.4, { t: 'Play is serious.', at: 1 }),
    ],
    newsreel: () => [
      rect('b1', 50, 50, 80, 76, 'transparent', [c('fade', 0.1, 0.4, { direction: 'in' })], { stroke: P.accent, strokeWidth: 0.3 }),
      rect('b2', 50, 50, 76, 70, 'transparent', [c('fade', 0.2, 0.4, { direction: 'in' })], { stroke: P.accent, strokeWidth: 0.12 }),
      text('k', 'The world this week', 50, 28, 2.8, P.muted, [c('fade', 0.4, 0.5, { direction: 'in', y: 0 })], { body: true }),
      head(50, 49, 7, { t: 'Progress marches on!', at: 0.5, w: 68 }),
      rect('rule', 50, 64, 14, 0.4, P.accent, [c('grow', 1.4, 0.5, { direction: 'in', axis: 'x', origin: 'center' })]),
      text('s', 'Scenes from the modern age.', 50, 72, 2.6, P.muted, [c('fade', 1.7, 0.5, { direction: 'in', y: 0 })], { body: true }),
      rect('film', 50, 50, 100, 100, 'transparent', [c('film', 0, PREVIEW_SECONDS, { sprockets: true, grain: 0.4, flicker: 0.15 })]),
    ],
    whiteboard: () => {
      const sk = (at: number, color = P.text) => c('sketch', at, PREVIEW_SECONDS - at, { style: 'none', roughness: 1.4, weight: 2.2, color, fps: 0 });
      return [
        head(50, 15, 6.2, { t: 'Draw what you mean.', at: 0.1 }),
        { id: 'under', type: 'path', d: 'M0 60 C30 40 70 70 100 45', stroke: P.accent2, strokeWidth: 0.45, box: { x: 50, y: 24, w: 44, h: 4 }, clips: [c('draw', 0.9, 0.5, { direction: 'in' })] } as unknown as Layer,
        rect('box', 26, 60, 24, 24, 'transparent', [sk(1.2), c('wipe', 1.2, 0.4, { direction: 'in', from: 'left' })], { stroke: P.text, strokeWidth: 0.35 }),
        text('t1', 'Idea', 26, 60, 4, P.accent, [c('wipe', 1.5, 0.4, { direction: 'in', from: 'left' })], { body: true, weight: 700 }),
        { id: 'arr', type: 'path', d: 'M0 60 C30 20 70 20 100 55 M84 40 L100 55 L80 62', stroke: P.accent2, strokeWidth: 0.45, box: { x: 51, y: 56, w: 18, h: 16 }, clips: [c('draw', 1.9, 0.6, { direction: 'in' })] } as unknown as Layer,
        dot('res', 76, 60, 20, 'transparent', [sk(2.4), c('wipe', 2.4, 0.4, { direction: 'in', from: 'left' })], { stroke: P.text, strokeWidth: 0.35 }),
        text('t2', 'Result', 76, 60, 3.4, P.accent2, [c('wipe', 2.7, 0.4, { direction: 'in', from: 'left' })], { body: true, weight: 700 }),
      ];
    },
    blueprint: () => [
      text('k', 'Fig. 1  ·  Scale 1:20', 8, 10, 2, P.muted, [c('fade', 0.1, 0.4, { direction: 'in', y: 0 })], { body: true, align: 'left' }),
      head(50, 16, 5.2, { t: 'How it fits together.', at: 0.2 }),
      { id: 'part', type: 'path', d: 'M5 20 H95 V80 H5 Z M33 50 A17 17 0 1 0 67 50 A17 17 0 1 0 33 50 M5 35 H20 M80 65 H95', stroke: P.text, strokeWidth: 0.25, box: { x: 42, y: 56, w: 40, h: 46 }, clips: [c('draw', 0.6, 1.4, { direction: 'in' })] } as unknown as Layer,
      { id: 'dim', type: 'path', d: 'M0 50 H100 M0 10 V90 M100 10 V90', stroke: P.muted, strokeWidth: 0.15, box: { x: 42, y: 85, w: 36, h: 4 }, clips: [c('draw', 1.9, 0.5, { direction: 'in' })] } as unknown as Layer,
      text('dimt', '320 mm', 42, 90.5, 2, P.muted, [c('fade', 2.3, 0.3, { direction: 'in', y: 0 })], { body: true }),
      { id: 'lead', type: 'path', d: 'M100 0 L0 100', stroke: P.accent2, strokeWidth: 0.2, box: { x: 64, y: 41, w: 12, h: 12 }, clips: [c('draw', 2.4, 0.4, { direction: 'in' })] } as unknown as Layer,
      dot('co', 72, 33, 5, 'transparent', [pop(2.2, 0.6)], { stroke: P.accent2, strokeWidth: 0.25 }),
      text('con', '1', 72, 33, 2.4, P.accent2, [pop(2.3, 0.6)], { body: true }),
      text('cot', 'Housing', 77, 33, 2, P.accent2, [c('fade', 2.6, 0.3, { direction: 'in', y: 0 })], { body: true, align: 'left' }),
    ],
    woodcut: () => [
      art('cut', '<rect width="160" height="100" fill="#efe6d2"/><circle cx="118" cy="30" r="16" fill="#8a8a8a"/><polygon points="0,100 0,70 38,28 70,64 96,40 160,92 160,100" fill="#222"/><polygon points="0,100 0,88 50,62 92,84 160,76 160,100" fill="#555"/>', 160, 100, 50, 52, 56, [c('fade', 0.1, 0.4, { direction: 'in' }), c('engrave', 0.1, PREVIEW_SECONDS - 0.1, { ink: P.text, paper: '', lines: 80, wave: 0.4 })]),
      { ...text('head2', 'Carved by hand.', 50, 17, 7.6, P.accent, [c('fade', 1.6, 0.2, { direction: 'in', y: 0 })]), box: { x: 50.5, y: 17.8 }, opacity: 0.9 } as Layer,
      head(50, 17, 7.6, { t: 'Carved by hand.', at: 0.9 }),
      rect('band', 50, 89, 56, 7, P.accent, [c('wipe', 1.9, 0.4, { direction: 'in', from: 'top' })]),
      text('sub', 'Black ink, red ink', 50, 89, 2.8, P.background, [c('fade', 2.2, 0.3, { direction: 'in', y: 0 })], { body: true, weight: 700 }),
    ],
    'neon-sign': () => {
      const glow = (t: number, color: string, flicker: boolean) => c('glow', t, PREVIEW_SECONDS - t, { direction: 'in', color, size: 1.6, strength: 1.2, flicker });
      const on = (t: number) => ({ ...c('fade', t, 0.35, { direction: 'in', y: 0 }), ease: 'steps(4)' });
      return [
        dot('halo', 50, 48, 76, `radial-gradient(closest-side, ${P.accent}55, transparent)`, [c('fade', 0.5, 0.6, { direction: 'in' })], { opacity: 0.55 }),
        text('open', 'Open late', 50, 25, 3.4, P.accent2, [on(1.5), glow(1.5, P.accent2, false)], { body: true, weight: 700 }),
        text('head', 'Light it up.', 50, 48, 9.5, '#ffe6f4', [on(0.3), glow(0.3, P.accent, true)]),
        { id: 'tube', type: 'path', d: 'M0 50 H100', stroke: P.accent2, strokeWidth: 0.5, box: { x: 50, y: 66, w: 40, h: 2 }, clips: [c('draw', 1.9, 0.5, { direction: 'in' }), glow(1.9, P.accent2, false)] } as unknown as Layer,
      ];
    },
    'game-show': () => [
      head(50, 16, 6.4, { t: 'Three tips. Go!', at: 0.1 }),
      ...range(3).flatMap((i) => [
        rect(`card${i}`, 24 + i * 26, 56, 22, 36, i === 1 ? P.accent2 : P.accent, [c('pop', 0.7 + i * 0.45, 0.35, { direction: 'in', from: 0.2 }), c('pulse', 2.2 + i * 0.15, 1.6, { scale: 1.05, times: 2 })], { radius: 2.4, stroke: '#ffffff', strokeWidth: 0.6 }),
        text(`n${i}`, String(i + 1), 24 + i * 26, 56, 11, i === 1 ? '#ffffff' : '#12063f', [c('pop', 0.85 + i * 0.45, 0.35, { direction: 'in', from: 0.3 })]),
      ]),
      rect('timer-bg', 50, 89, 62, 3, 'rgba(255,255,255,0.18)', [c('fade', 0.4, 0.3, { direction: 'in' })], { radius: 1.5 }),
      rect('timer', 50, 89, 62, 3, P.accent, [c('grow', 0.4, 3.4, { direction: 'in', axis: 'x', origin: 'start' })], { radius: 1.5 }),
    ],
    chalkboard: () => {
      return [
        head(50, 14, 6, { t: 'Show your working.', at: 0.1 }),
        text('eq', 'a² + b² = c²', 32, 54, 6.4, P.text, [c('wipe', 0.9, 0.9, { direction: 'in', from: 'left' })], { body: true }),
        { id: 'ring', type: 'path', d: 'M6 50 C6 8 94 8 94 50 C94 92 6 92 6 50', stroke: P.accent, strokeWidth: 0.35, box: { x: 32, y: 54, w: 40, h: 22 }, clips: [c('draw', 2.3, 0.6, { direction: 'in' })] } as unknown as Layer,
        { id: 'tri', type: 'path', d: 'M10 90 L90 90 L10 12 Z', stroke: P.text, strokeWidth: 0.35, box: { x: 74, y: 56, w: 26, h: 44 }, clips: [c('draw', 1.4, 0.8, { direction: 'in' }), c('boil', 2.2, PREVIEW_SECONDS - 2.2, { amount: 1, fps: 6 })] } as unknown as Layer,
        text('la', 'a', 61.5, 60, 3.4, P.accent2, [c('fade', 2, 0.3, { direction: 'in', y: 0 })], { body: true }),
        text('lb', 'b', 74, 84, 3.4, P.accent2, [c('fade', 2.1, 0.3, { direction: 'in', y: 0 })], { body: true }),
        text('lc', 'c', 78, 50, 3.4, P.accent2, [c('fade', 2.2, 0.3, { direction: 'in', y: 0 })], { body: true }),
        rect('smudge', 50, 50, 100, 100, 'radial-gradient(40% 30% at 30% 70%, rgba(255,255,255,0.05), transparent)', []),
      ];
    },
    'ink-wash': () => [
      art('hills', `<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a2a" stop-opacity=".85"/><stop offset="1" stop-color="#2a2a2a" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#777" stop-opacity=".55"/><stop offset="1" stop-color="#777" stop-opacity="0"/></linearGradient><filter id="s"><feGaussianBlur stdDeviation="1.2"/></filter><radialGradient id="f" cx=".5" cy=".45" r=".55"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="m"><rect width="160" height="100" fill="url(#f)"/></mask></defs><g mask="url(#m)"><path filter="url(#s)" fill="url(#b)" d="M0 70 C30 40 50 30 70 52 C90 30 120 20 160 55 L160 100 L0 100Z"/><path filter="url(#s)" fill="url(#a)" d="M20 100 C40 60 60 40 80 62 C95 48 110 50 130 100Z"/></g>`, 160, 100, 58, 56, 70, [c('brush', 0.2, 1.8, { direction: 'in', strokes: 3 })]),
      { id: 'enso', type: 'path', d: 'M50 6 C80 6 94 30 94 52 C94 80 70 94 48 94 C22 94 6 74 6 50 C6 26 24 10 44 8', stroke: P.text, strokeWidth: 1.1, box: { x: 26, y: 40, w: 22, h: 39 }, clips: [c('draw', 1.2, 1.3, { direction: 'in' })] } as unknown as Layer,
      text('t', 'Still water.', 26, 84, 4.6, P.text, [c('fade', 2.2, 0.8, { direction: 'in', y: 4, blur: 0.4 })]),
      rect('seal', 86, 82, 5.5, 9.8, P.accent, [pop(2.9, 0.6)], { radius: 0.4 }),
      rect('seal-in', 86, 82, 4, 7.2, 'transparent', [pop(2.95, 0.6)], { stroke: P.background, strokeWidth: 0.2, radius: 0.2 }),
    ],
    'stained-glass': () => {
      const panes = [
        ['M0 100 L0 40 L40 20 L40 100Z', '#9b1d2a'], ['M40 20 L80 0 L120 20 L80 50Z', '#e8b33c'], ['M40 20 L80 50 L80 100 L40 100Z', '#2f6fd1'],
        ['M80 50 L120 20 L120 100 L80 100Z', '#1f8a5a'], ['M120 20 L160 40 L160 100 L120 100Z', '#7a2fa8'],
      ];
      const body = `<defs><clipPath id="w"><path d="M0 100 L0 40 Q0 0 80 0 Q160 0 160 40 L160 100Z"/></clipPath></defs><g clip-path="url(#w)"><rect width="160" height="100" fill="#22356f"/><path d="M0 40 Q0 0 80 0 L40 20 L0 40Z M160 40 Q160 0 80 0 L120 20 L160 40Z" fill="#b5651d" stroke="#0c0a0e" stroke-width="3.5"/>${panes.map(([d, f]) => `<path d="${d}" fill="${f}" stroke="#0c0a0e" stroke-width="3.5" stroke-linejoin="round"/>`).join('')}<circle cx="80" cy="48" r="18" fill="#f1d27a" stroke="#0c0a0e" stroke-width="3.5"/></g><path d="M0 100 L0 40 Q0 0 80 0 Q160 0 160 40 L160 100Z" fill="none" stroke="#0c0a0e" stroke-width="5"/>`;
      return [
        dot('halo', 50, 44, 80, `radial-gradient(closest-side, ${P.accent}55, transparent)`, [c('fade', 0.4, 1, { direction: 'in' })]),
        art('win', body, 160, 100, 50, 44, 62, [c('iris', 0.1, 1.2, { direction: 'in', x: 50, y: 50 }), c('sheen', 1.6, 1.2, { angle: 120, width: 26, strength: 0.45, color: '#ffffff' })]),
        text('t', 'Let the light in.', 50, 88, 4.8, P.text, [c('fade', 1.8, 0.7, { direction: 'in', y: 0 }), c('glow', 2.2, PREVIEW_SECONDS - 2.2, { direction: 'in', color: P.accent, size: 0.9, strength: 0.8 })]),
      ];
    },
    'rubber-hose': () => [
      { id: 'armL', type: 'path', d: 'M100 20 C60 10 30 60 0 40', stroke: P.text, strokeWidth: 1.2, box: { x: 34, y: 54, w: 16, h: 16 }, clips: [c('pop', 0.6, 0.3, { direction: 'in', from: 0.3 }), c('jiggle', 0.9, PREVIEW_SECONDS - 0.9)] } as unknown as Layer,
      { id: 'armR', type: 'path', d: 'M0 20 C40 10 70 60 100 40', stroke: P.text, strokeWidth: 1.2, box: { x: 66, y: 54, w: 16, h: 16 }, clips: [c('pop', 0.6, 0.3, { direction: 'in', from: 0.3 }), c('jiggle', 0.9, PREVIEW_SECONDS - 0.9)] } as unknown as Layer,
      dot('gl', 26, 58, 7, '#ffffff', [pop(0.7, 0.3)], { stroke: P.text, strokeWidth: 0.4 }),
      dot('gr', 74, 58, 7, '#ffffff', [pop(0.7, 0.3)], { stroke: P.text, strokeWidth: 0.4 }),
      dot('body', 50, 54, 24, P.text, [c('pop', 0.2, 0.5, { direction: 'in', from: 0.2 }), c('pulse', 0.8, PREVIEW_SECONDS - 0.8, { scale: 1.05, times: 4 })]),
      dot('e1', 45.5, 47, 5, '#ffffff', [pop(0.5, 0.3)]),
      dot('e2', 54.5, 47, 5, '#ffffff', [pop(0.55, 0.3)]),
      { id: 'p1', type: 'shape', shape: 'ellipse', box: { x: 46, y: 48.5, w: 2.4, ratio: 0.55 }, fill: `conic-gradient(from 20deg, transparent 0 14%, ${P.text} 14% 100%)`, clips: [pop(0.6, 0.3)] } as unknown as Layer,
      { id: 'p2', type: 'shape', shape: 'ellipse', box: { x: 55, y: 48.5, w: 2.4, ratio: 0.55 }, fill: `conic-gradient(from 20deg, transparent 0 14%, ${P.text} 14% 100%)`, clips: [pop(0.65, 0.3)] } as unknown as Layer,
      dot('smile', 50, 60, 9, P.accent2, [pop(0.75, 0.3)]),
      head(50, 88, 5.6, { t: 'Swing time!', at: 1.1 }),
      rect('film', 50, 50, 100, 100, 'transparent', [c('film', 0, PREVIEW_SECONDS, { sprockets: false, grain: 0.3, flicker: 0.1 })]),
    ],
    'crt-terminal': () => {
      const line = (id: string, t: string, y: number, at: number, color = P.text) => text(id, t, 8, y, 3.6, color, [c('text-typewriter', at, 0.6, { direction: 'in' }), c('glow', at, PREVIEW_SECONDS - at, { direction: 'in', color: P.text, size: 0.6, strength: 0.7 })], { body: true, align: 'left' });
      return [
        line('l1', 'C:\\> RUN IDEA.EXE', 14, 0.1),
        line('l2', 'LOADING STORY ......... OK', 24, 0.8, P.muted),
        line('l3', 'CHECKING FRAMES ...... OK', 32, 1.4, P.muted),
        text('ready', 'READY.', 8, 56, 12, P.accent, [c('text-typewriter', 2, 0.5, { direction: 'in' }), c('glow', 2, PREVIEW_SECONDS - 2, { direction: 'in', color: P.text, size: 1, strength: 1 })], { align: 'left' }),
        rect('cur', 44, 58, 3, 9, P.text, [c('fade', 2.5, 0.1, { direction: 'in' }), c('pulse', 2.6, PREVIEW_SECONDS - 2.6, { scale: 1, times: 4 })]),
        rect('tex', 50, 50, 100, 100, 'transparent', [c('scanlines', 0, PREVIEW_SECONDS, { bleed: 0.08, jitter: 0.05 })]),
      ];
    },
    'transit-map': () => {
      const stop = (id: string, x: number, y: number, at: number) => dot(id, x, y, 2.6, '#ffffff', [pop(at, 0.3)], { stroke: P.text, strokeWidth: 0.35 });
      return [
        head(8, 12, 4.6, { t: 'Every stop, one map.', at: 0.1, align: 'left' }),
        { id: 'red', type: 'path', d: 'M0 60 H40 L60 25 H100', stroke: P.accent, strokeWidth: 1.6, box: { x: 50, y: 52, w: 84, h: 44 }, clips: [c('draw', 0.5, 1.6, { direction: 'in' })] } as unknown as Layer,
        { id: 'blue', type: 'path', d: 'M30 0 V45 L50 75 V100', stroke: P.accent2, strokeWidth: 1.6, box: { x: 50, y: 56, w: 84, h: 60 }, clips: [c('draw', 1, 1.6, { direction: 'in' })] } as unknown as Layer,
        stop('s1', 8, 58.4, 0.6), stop('s2', 25, 58.4, 1), stop('s3', 75, 41, 1.9), stop('s4', 92, 41, 2.1), stop('s5', 33.2, 35, 1.1), stop('s6', 50, 80, 2.4),
        { id: 'swap', type: 'shape', shape: 'rect', box: { x: 33.2, y: 50, w: 3.4, h: 9 }, fill: '#ffffff', stroke: P.text, strokeWidth: 0.35, radius: 1.7, clips: [pop(1.6, 0.4), c('pulse', 2.2, 1.6, { scale: 1.15, times: 2 })] } as unknown as Layer,
        text('n1', 'Start', 8, 64, 2.2, P.muted, [c('fade', 0.8, 0.3, { direction: 'in', y: 0 })], { body: true }),
        text('n2', 'Change here', 21, 47, 2.2, P.text, [c('fade', 1.8, 0.3, { direction: 'in', y: 0 })], { body: true, align: 'right', w: 18 }),
        text('n3', 'Done', 92, 35, 2.2, P.muted, [c('fade', 2.3, 0.3, { direction: 'in', y: 0 })], { body: true }),
      ];
    },
    radar: () => [
      ...[62, 42, 22].map((w, i) => dot(`ring${i}`, 50, 52, w, 'transparent', [c('fade', 0.1 + i * 0.1, 0.4, { direction: 'in' })], { stroke: P.muted, strokeWidth: 0.15 })),
      rect('h', 50, 52, 62, 0.15, P.muted, [c('fade', 0.2, 0.4, { direction: 'in' })]),
      rect('v', 50, 52, 0.12, 110, P.muted, [c('fade', 0.2, 0.4, { direction: 'in' })]),
      dot('sweep', 50, 52, 62, `conic-gradient(from 0deg, ${P.accent}aa 0deg, transparent 80deg, transparent 360deg)`, [c('fade', 0.3, 0.3, { direction: 'in' }), { ...c('drift', 0.3, PREVIEW_SECONDS - 0.3, { x: 0, y: 0, scale: 1, rotate: 380 }), ease: 'none' }]),
      dot('b1', 60, 40, 1.6, P.accent, [pop(0.9, 0.2), c('pulse', 1.1, 2.5, { scale: 1.4, times: 3 })]),
      dot('b2', 38, 66, 1.6, P.accent, [pop(1.9, 0.2), c('pulse', 2.1, 1.8, { scale: 1.4, times: 2 })]),
      dot('b3', 66, 70, 2, P.accent2, [pop(2.6, 0.2), c('pulse', 2.8, 1.3, { scale: 1.5, times: 2 })]),
      text('l3', '[ CONTACT 3 ]', 70, 76, 1.8, P.accent2, [c('text-typewriter', 2.4, 0.5, { direction: 'in' })], { body: true, align: 'left' }),
      text('k', 'Sector 7  ·  0400 hrs', 6, 10, 2, P.muted, [c('fade', 0.2, 0.4, { direction: 'in', y: 0 })], { body: true, align: 'left' }),
      head(6, 17, 4.4, { t: 'Three contacts.', at: 0.5, align: 'left' }),
    ],
    thermal: () => {
      const house = '<rect width="160" height="100" fill="#3a3f48"/><rect y="78" width="160" height="22" fill="#2c3037"/><path d="M40 78 V44 L80 18 L120 44 V78Z" fill="#70757d"/><rect x="52" y="50" width="16" height="14" fill="#e6e1d6"/><rect x="92" y="50" width="16" height="14" fill="#c9c3b6"/><rect x="72" y="58" width="16" height="20" fill="#b9b2a4"/><rect x="60" y="22" width="8" height="14" fill="#f7f3ea"/><ellipse cx="80" cy="76" rx="40" ry="3" fill="#8d8b86"/>';
      return [
        art('scene', house, 160, 100, 50, 50, 100, [c('false-colour', 0.4, 0.8, { direction: 'in', look: 'thermal' })]),
        rect('ch', 50, 50, 6, 0.25, '#ffffff', [c('fade', 1, 0.3, { direction: 'in' })]),
        rect('cv', 50, 50, 0.14, 10.6, '#ffffff', [c('fade', 1, 0.3, { direction: 'in' })]),
        text('temp', '41.2°C', 56, 44, 2.6, '#ffffff', [c('text-count', 1.2, 1, { direction: 'in' })], { body: true, align: 'left' }),
        rect('scale', 94, 50, 1.6, 60, 'linear-gradient(180deg, #ffe36a, #ff8a1f, #e0305a, #6a1c86, #07040f)', [c('wipe', 1, 0.5, { direction: 'in', from: 'top' })], { radius: 0.4 }),
        text('hi', '45°', 86, 21, 2, '#ffffff', [c('fade', 1.4, 0.3, { direction: 'in', y: 0 })], { body: true, align: 'right', w: 8 }),
        text('lo', '12°', 86, 79, 2, '#ffffff', [c('fade', 1.4, 0.3, { direction: 'in', y: 0 })], { body: true, align: 'right', w: 8 }),
        head(6, 10, 3.6, { t: 'Find the heat.', at: 1.6, align: 'left' }),
      ];
    },
    xray: () => {
      const hand = '<defs><radialGradient id="xf" cx=".5" cy=".5" r=".55"><stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="xm"><rect width="160" height="100" fill="url(#xf)"/></mask></defs><g mask="url(#xm)"><rect width="160" height="100" fill="#d9dde3"/><path d="M58 100 C56 80 50 70 46 52 C44 44 52 42 55 50 L60 62 L58 22 C58 14 67 14 67 22 L69 50 L72 16 C72 8 81 8 81 16 L80 50 L85 20 C86 12 95 13 94 21 L90 54 L98 32 C101 25 109 28 106 36 L96 70 C93 84 92 92 92 100Z" fill="#8a9099"/>'
        + [[63, 24, 60], [76, 18, 54], [89, 23, 56], [101, 34, 62]].map(([x, y1, y2]) => `<rect x="${x - 2.4}" y="${y1}" width="4.8" height="${y2 - y1}" rx="2.4" fill="#25282d"/>`).join('')
        + '<rect x="70" y="62" width="22" height="34" rx="6" fill="#30343a"/><path d="M50 50 L58 66" stroke="#25282d" stroke-width="5" stroke-linecap="round"/></g>';
      return [
        art('scan', hand, 160, 100, 44, 52, 70, [c('false-colour', 0, 0.1, { direction: 'in', look: 'xray' }), c('wipe', 0.2, 1.4, { direction: 'in', from: 'top' })]),
        rect('bar', 44, 14, 70, 0.5, P.accent, [c('slide', 0.2, 1.4, { direction: 'out', from: 'bottom', distance: 160 }), c('glow', 0.2, 1.4, { direction: 'in', color: P.accent, size: 1, strength: 1 })]),
        dot('pin', 49, 33, 1.8, P.accent2, [pop(1.9, 0.4)]),
        { id: 'lead', type: 'path', d: 'M0 100 L100 0', stroke: P.accent2, strokeWidth: 0.15, box: { x: 61, y: 27, w: 22, h: 10 }, clips: [c('draw', 2, 0.4, { direction: 'in' })] } as unknown as Layer,
        text('lab', 'Middle finger · intact', 74, 22, 2, P.accent2, [c('text-typewriter', 2.3, 0.6, { direction: 'in' })], { body: true, align: 'left' }),
        head(84, 70, 4.4, { t: 'Look inside.', at: 1.6, w: 26 }),
      ];
    },
    sketchnote: () => {
      const box = (id: string, x: number, at: number, hi: string, label: string, icon: string) => [
        dot(`${id}-hi`, x + 2, 58, 18, `${hi}55`, [pop(at, 0.6)]),
        { id: `${id}-box`, type: 'shape', shape: 'rect', box: { x, y: 56, w: 22, h: 30 }, fill: 'transparent', stroke: P.text, strokeWidth: 0.3, radius: 2, clips: [c('sketch', at, PREVIEW_SECONDS - at, { style: 'none', roughness: 1.2, weight: 2, color: P.text, fps: 0 }), pop(at, 0.7)] } as unknown as Layer,
        art(`${id}-ic`, icon, 40, 40, x, 52, 9, [pop(at + 0.15, 0.5)]),
        text(`${id}-t`, label, x, 66, 2.6, P.text, [c('fade', at + 0.3, 0.3, { direction: 'in', y: 4 })], { body: true, weight: 700 }),
      ];
      const ink = P.text;
      const bulb = `<path d="M20 4 C10 4 5 12 7 19 C8 23 12 26 13 30 H27 C28 26 32 23 33 19 C35 12 30 4 20 4Z" fill="#ffd54a" stroke="${ink}" stroke-width="2"/><path d="M14 33 H26 M15 37 H25" stroke="${ink}" stroke-width="2"/>`;
      const person = `<circle cx="20" cy="11" r="7" fill="none" stroke="${ink}" stroke-width="2"/><path d="M6 37 C6 26 12 21 20 21 C28 21 34 26 34 37" fill="none" stroke="${ink}" stroke-width="2"/>`;
      const talk = `<path d="M5 8 H35 V26 H18 L10 33 V26 H5Z" fill="#fff" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><path d="M11 15 H29 M11 20 H24" stroke="${ink}" stroke-width="2"/>`;
      return [
        rect('rib', 50, 17, 56, 10, P.accent, [c('wipe', 0.1, 0.5, { direction: 'in', from: 'left' })], { radius: 0.6 }),
        rect('rib-l', 20, 19, 6, 8, '#d9603f', [c('fade', 0.4, 0.2, { direction: 'in' })]),
        rect('rib-r', 80, 19, 6, 8, '#d9603f', [c('fade', 0.4, 0.2, { direction: 'in' })]),
        text('title', 'Big ideas, small doodles', 50, 17, 4.6, '#ffffff', [c('wipe', 0.4, 0.6, { direction: 'in', from: 'left' })]),
        ...box('a', 22, 1, P.accent2, 'Notice', bulb),
        ...box('b', 50, 1.5, P.accent, 'People', person),
        ...box('c', 78, 2, '#7bd389', 'Share it', talk),
        { id: 'ar1', type: 'path', d: 'M0 60 C30 20 70 20 100 50 M86 34 L100 50 L82 56', stroke: P.text, strokeWidth: 0.3, box: { x: 36, y: 40, w: 6, h: 8 }, clips: [c('draw', 1.4, 0.4, { direction: 'in' })] } as unknown as Layer,
        { id: 'ar2', type: 'path', d: 'M0 60 C30 20 70 20 100 50 M86 34 L100 50 L82 56', stroke: P.text, strokeWidth: 0.3, box: { x: 64, y: 40, w: 6, h: 8 }, clips: [c('draw', 1.9, 0.4, { direction: 'in' })] } as unknown as Layer,
      ];
    },
    'ukiyo-e': () => {
      const sea = '<path d="M0 64 C20 58 40 70 60 62 C80 54 100 66 120 60 C140 54 150 60 160 58 V100 H0Z" fill="#1f4f8a" stroke="#1b2440" stroke-width="1.2"/>'
        + '<path d="M20 100 C10 70 30 34 66 30 C92 28 104 44 98 58 C92 46 76 44 70 54 C64 66 76 80 92 84 L100 100Z" fill="#1b3a6b" stroke="#1b2440" stroke-width="1.2"/>'
        + '<path d="M66 30 C80 24 96 30 100 40 M100 40 C94 38 92 44 96 46 M98 58 C102 54 106 56 104 60" fill="none" stroke="#f7f1e2" stroke-width="2.4" stroke-linecap="round"/>'
        + [70, 78, 86, 94].map((x, i) => `<path d="M${x} ${32 + i * 2} q4 -6 8 0" fill="none" stroke="#f7f1e2" stroke-width="1.8" stroke-linecap="round"/>`).join('')
        + '<path d="M118 60 L130 44 L142 60Z" fill="#e9e2d0" stroke="#1b2440" stroke-width="1"/><rect x="0" y="12" width="160" height="5" fill="#d9c9a4" opacity=".7"/>';
      return [
        dot('sun', 78, 26, 9, P.accent, [c('fade', 0.2, 0.8, { direction: 'in', y: 0 }), c('drift', 0.2, PREVIEW_SECONDS - 0.2, { x: 0, y: -4, scale: 1, rotate: 0 })]),
        art('sea', sea, 160, 100, 50, 50, 100, [c('wipe', 0.1, 0.9, { direction: 'in', from: 'bottom' }), c('drift', 1, PREVIEW_SECONDS - 1, { x: 0, y: 1, scale: 1.02, rotate: -1 })]),
        rect('cart', 14, 12, 20, 7, '#efe2c4', [c('fade', 1.2, 0.5, { direction: 'in' })], { stroke: P.text, strokeWidth: 0.2 }),
        text('ct', 'The great wave', 14, 12, 2.4, P.text, [c('fade', 1.4, 0.5, { direction: 'in', y: 0 })], { body: true }),
      ];
    },
    'silent-film': () => [
      rect('o1', 50, 50, 78, 74, 'transparent', [c('fade', 0.1, 0.4, { direction: 'in' })], { stroke: P.text, strokeWidth: 0.35 }),
      rect('o2', 50, 50, 74, 68, 'transparent', [c('fade', 0.2, 0.4, { direction: 'in' })], { stroke: P.text, strokeWidth: 0.12 }),
      ...[[13, 18], [87, 18], [13, 82], [87, 82]].map(([x, y], i) => dot(`orn${i}`, x, y, 2.4, P.text, [pop(0.4 + i * 0.05, 0.4)])),
      text('t', '“Not today!”', 50, 46, 8, P.text, [{ ...c('fade', 0.6, 0.6, { direction: 'in', y: 0 }), ease: 'steps(8)' }]),
      text('s', 'said the baker, closing the door.', 50, 62, 2.8, P.muted, [{ ...c('fade', 1.4, 0.6, { direction: 'in', y: 0 }), ease: 'steps(8)' }], { body: true }),
      rect('film', 50, 50, 100, 100, 'transparent', [c('film', 0, PREVIEW_SECONDS, { sprockets: false, grain: 0.45, flicker: 0.2 })]),
    ],
    exploded: () => {
      // A slab drawn at an angle (top, left and right faces); its box height on a 16:9 stage, for moving it.
      const slab = (top: string, left: string, right: string) => `<polygon points="4,10 50,0 96,10 50,20" fill="${top}"/><polygon points="4,10 50,20 50,30 4,20" fill="${left}"/><polygon points="96,10 50,20 50,30 96,20" fill="${right}"/>`;
      const part = (id: string, w: number, faces: [string, string, string], dy: number, at: number): Layer[] => {
        const h = w * 0.32 * (16 / 9);
        return [art(id, slab(...faces), 100, 32, 42, 56, w, [c('fade', 0.1, 0.3, { direction: 'in' }), { ...c('drift', at, 1.1, { x: 0, y: Math.round((dy / h) * 1000) / 10, scale: 1, rotate: 0 }), ease: 'power3.inOut' }])];
      };
      return [
        { id: 'shadow', type: 'shape', shape: 'ellipse', box: { x: 42, y: 90, w: 30, h: 4 }, fill: 'radial-gradient(closest-side, rgba(20,30,50,0.22), transparent)', clips: [c('fade', 0.6, 1, { direction: 'in' })] } as unknown as Layer,
        ...part('base', 30, ['#a9b3c7', '#6f7a92', '#566078'], 22, 0.6),
        ...part('board', 26, ['#5fe09a', '#24a35f', '#1c844c'], 6, 0.7),
        ...part('cell', 18, ['#ffc77d', '#ff8a2a', '#e46d10'], -10, 0.8),
        ...part('lid', 30, ['#ffffff', '#d7deea', '#bcc6d8'], -28, 0.9),
        ...[[1, 28], [2, 46], [3, 62], [4, 78]].map(([n, y], i) => dot(`n${n}`, 74, y, 3.6, i === 1 ? P.accent2 : P.accent, [pop(1.9 + i * 0.15, 0.5)])),
        ...[[1, 28], [2, 46], [3, 62], [4, 78]].map(([n, y], i) => text(`nt${n}`, String(n), 74, y, 2, '#ffffff', [pop(1.95 + i * 0.15, 0.5)], { body: true, weight: 600 })),
        ...[[28, 'Lid'], [46, 'Battery cell'], [62, 'Circuit board'], [78, 'Base']].map(([y, t], i) => text(`pl${i}`, String(t), 78, Number(y), 2.2, P.text, [c('fade', 2 + i * 0.15, 0.3, { direction: 'in', y: 0 })], { body: true, align: 'left' })),
        head(6, 10, 4.6, { t: 'Every part, apart.', at: 0.2, align: 'left' }),
      ];
    },
    silhouette: () => {
      const ink = P.text;
      const land = `<path d="M0 62 Q24 52 48 60 T98 57 Q128 50 160 60 V90 H0Z" fill="${ink}"/>`
        + `<rect x="24" y="34" width="2.6" height="26" fill="${ink}"/><circle cx="25" cy="30" r="9" fill="${ink}"/><circle cx="18" cy="35" r="6" fill="${ink}"/><circle cx="32" cy="35" r="6.5" fill="${ink}"/>`
        + `<rect x="132" y="42" width="2" height="16" fill="${ink}"/><path d="M133 26 L141 46 H125Z" fill="${ink}"/>`;
      const figure = `<circle cx="30" cy="12" r="8.5" fill="${ink}"/><path d="M20 25 Q30 20 40 25 L42 50 H18Z" fill="${ink}"/><rect x="20" y="47" width="8" height="24" rx="3" fill="${ink}"/><rect x="32" y="47" width="8" height="24" rx="3" fill="${ink}"/>`
        + `<path d="M39 28 Q52 22 50 6" stroke="${ink}" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M21 28 Q12 37 14 48" stroke="${ink}" stroke-width="5.5" stroke-linecap="round" fill="none"/>`;
      return [
        dot('glow', 50, 60, 62, `radial-gradient(circle, ${P.accent2}99 0%, ${P.accent2}00 68%)`, [c('fade', 0, 0.9, { direction: 'in' })]),
        dot('sun', 50, 60, 30, P.accent2, [c('slide', 0, 1.6, { direction: 'in', from: 'bottom', distance: 18 }), c('drift', 1.6, PREVIEW_SECONDS - 1.6, { x: 0, y: -2, scale: 1.03, rotate: 0 })]),
        { id: 'b1', type: 'path', d: 'M0 60 Q25 0 50 50 Q75 0 100 60', stroke: ink, strokeWidth: 0.35, box: { x: 72, y: 24, w: 5, h: 3 }, clips: [c('fade', 1.2, 0.5, { direction: 'in' }), c('drift', 1.2, PREVIEW_SECONDS - 1.2, { x: 4, y: -2, scale: 1, rotate: 0 })] } as unknown as Layer,
        { id: 'b2', type: 'path', d: 'M0 60 Q25 0 50 50 Q75 0 100 60', stroke: ink, strokeWidth: 0.3, box: { x: 79, y: 30, w: 3.6, h: 2.2 }, clips: [c('fade', 1.4, 0.5, { direction: 'in' }), c('drift', 1.4, PREVIEW_SECONDS - 1.4, { x: 4, y: -1, scale: 1, rotate: 0 })] } as unknown as Layer,
        art('land', land, 160, 90, 50, 50, 100, [c('slide', 0.2, 0.9, { direction: 'in', from: 'bottom', distance: 24 })]),
        art('fig', figure, 60, 72, 50, 51, 15, [c('slide', 0.7, 0.7, { direction: 'in', from: 'bottom', distance: 30 })]),
        head(50, 15, 5.4, { at: 1.3 }),
      ];
    },
    'low-poly': () => {
      // Each object: a light side and a dark side, flat faces only.
      const world = '<path d="M20 62 L52 22 L70 62Z" fill="#7d93b8"/><path d="M52 22 L70 62 L86 62Z" fill="#5b7198"/><path d="M52 22 L45 31 L52 34 L58 30Z" fill="#f4f8ff"/>'
        + '<path d="M78 62 L108 30 L124 62Z" fill="#8ea3c6"/><path d="M108 30 L124 62 L140 62Z" fill="#647ba3"/>'
        + '<path d="M0 62 L42 56 L60 66 L0 74Z" fill="#4fc26d"/><path d="M42 56 L104 60 L60 66Z" fill="#3fae5d"/><path d="M104 60 L160 54 L160 70 L96 72Z" fill="#56c973"/>'
        + '<path d="M0 74 L60 66 L96 72 L70 90 L0 90Z" fill="#35a053"/><path d="M96 72 L160 70 L160 90 L70 90Z" fill="#2f9049"/><path d="M60 66 L104 60 L96 72Z" fill="#47b866"/>';
      const tree = '<path d="M20 4 L34 26 L6 26Z" fill="#2aa457"/><path d="M20 4 L34 26 L20 26Z" fill="#1f8746"/><path d="M20 16 L38 42 L2 42Z" fill="#259a50"/><path d="M20 16 L38 42 L20 42Z" fill="#1b7a3f"/><path d="M17 42 H23 V54 H17Z" fill="#8a5a33"/><path d="M20 42 H23 V54 H20Z" fill="#6f4627"/>';
      const sun = `<path d="M20 2 L32 8 L38 20 L32 32 L20 38 L8 32 L2 20 L8 8Z" fill="${P.accent}"/><path d="M20 2 L32 8 L20 20Z" fill="#ffb347"/><path d="M8 8 L20 2 L20 20Z" fill="#ffc567"/><path d="M2 20 L8 8 L20 20Z" fill="#ffab3a"/>`;
      const cloud = '<path d="M4 20 L14 8 L26 12 L34 4 L48 10 L56 20Z" fill="#ffffff"/><path d="M26 12 L34 4 L40 20 L20 20Z" fill="#e6f3ff"/>';
      return [
        art('sun', sun, 40, 40, 82, 24, 11, [c('pop', 0.3, 0.45, { direction: 'in', from: 0.3 }), c('float', 0.9, PREVIEW_SECONDS - 0.9, { height: 3, cycles: 2 })]),
        art('cl1', cloud, 60, 24, 20, 30, 15, [c('slide', 0.2, 0.7, { direction: 'in', from: 'left', distance: 20 }), c('drift', 0.9, PREVIEW_SECONDS - 0.9, { x: 3, y: 0, scale: 1, rotate: 0 })]),
        art('world', world, 160, 90, 50, 50, 100, [c('slide', 0, 0.7, { direction: 'in', from: 'bottom', distance: 30 })]),
        ...[[24, 66, 9], [38, 72, 12], [68, 70, 10], [86, 76, 13]].map(([x, y, w], i) => art(`t${i}`, tree, 40, 56, x, y, w, [{ ...c('slide', 0.6 + i * 0.14, 0.55, { direction: 'in', from: 'top', distance: 40 }), ease: 'back.out(1.6)' }])),
        head(50, 14, 5.4, { at: 1.2 }),
      ];
    },
    playful: () => [
      ...range(5).map((i) => dot(`d${i}`, 18 + i * 16, 30, 11, i % 2 ? P.accent2 : P.accent, [c('pop', 0.2 + i * 0.12, 0.35, { direction: 'in', from: 0.2 }), c('float', 0.9, PREVIEW_SECONDS - 0.9, { height: 12, cycles: 2 })])),
      head(50, 64, 11, { t: 'Say yum!', at: 0.8 }),
    ],
    pastel: () => [
      dot('a', 28, 40, 44, `${P.accent}55`, [c('fade', 0, 0.9, { direction: 'in' }), c('float', 0.9, 3.3, { height: 6, cycles: 1 })]),
      dot('b', 72, 62, 50, `${P.accent2}55`, [c('fade', 0.2, 0.9, { direction: 'in' }), c('float', 1.1, 3.1, { height: 6, cycles: 1 })]),
      head(50, 50, 9, { t: 'Breathe in.', at: 0.7 }),
    ],
    liquid: () => [
      dot('blob', 50, 50, 54, `linear-gradient(135deg, ${P.accent}, ${P.accent2})`, [c('liquid', 0, PREVIEW_SECONDS, { speed: 0.9 })]),
      head(50, 50, 5, { t: 'Go with it.', at: 0.7 }),
    ],
  };

  const build = scenes[style.id];
  if (!build) return null;
  const fonts = F.href ? [{ family: F.heading, href: F.href }, ...(F.body !== F.heading ? [{ family: F.body }] : [])] : [];
  return {
    format: 'unysonplus-scene', version: 1, title: `${style.name} preview`, duration: PREVIEW_SECONDS,
    stage: { breakpoints: [{ id: 'wide', label: 'Wide', minWidth: 0, aspect: [16, 9] }], heightMode: 'ratio', background: P.background, safeArea: 0, ...(fonts.length ? { fonts } : {}) },
    playback: { trigger: 'manual', loop: true, repeatDelay: 0.3, posterTime: POSTER_TIME },
    layers: [...build(), ...(style.id === 'paper' ? [] : [rect('hold', 50, 50, 1, 1, 'transparent', [hold(0)])])],
  } as unknown as Scene;
}
