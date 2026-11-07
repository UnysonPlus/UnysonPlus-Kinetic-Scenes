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
  { id: 'tech', label: 'Tech and product', styles: ['living-ui', 'data-story', 'keynote', 'night', 'hud', 'neon', 'aurora-glass', 'isometric'] },
  { id: 'clean', label: 'Clean and bold', styles: ['clean', 'swiss', 'editorial', 'bauhaus', 'kinetic', 'social-captions', 'luxe'] },
  { id: 'drawn', label: 'Drawn and crafted', styles: ['sketchbook', 'line-art', 'flat-vector', 'cel', 'paper', 'collage', 'watercolour'] },
  { id: 'fun', label: 'Retro and playful', styles: ['synthwave', 'vhs', 'pixel', 'risograph', 'toy-3d', 'playful', 'pastel', 'liquid'] },
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
