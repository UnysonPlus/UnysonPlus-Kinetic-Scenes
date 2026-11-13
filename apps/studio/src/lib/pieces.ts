import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { findLayer, layersIn } from './sceneOps';

/**
 * Ready-made pieces from short-form video: a comment box that types and gets a reply, a prompt bar, a chat, a
 * file drop, an editing timeline, a growth chart, cards, checklists, title cards… Each is an ordinary group of
 * layers and clips (times from the group's start), inserted at the playhead and edited like anything else.
 * Laid out for a vertical video; they work on any stage.
 */

export interface Piece { id: string; name: string; description: string; build: () => Layer }

let n = 0;
const C = (preset: string, start: number, duration: number, params?: Record<string, unknown>, ease?: string): Clip => ({ id: `${preset}-${n++}`, preset, start, duration, ...(params ? { params } : {}), ...(ease ? { ease } : {}) });
const text = (id: string, t: string, x: number, y: number, fontSize: number, extra: Record<string, unknown> = {}): Layer => {
  const { box, style, ...rest } = extra;
  return { id, type: 'text', text: t, box: { x, y, ...(box as object ?? {}) }, style: { fontSize, fontWeight: 700, color: '#ffffff', ...(style as object ?? {}) }, clips: [], ...rest } as Layer;
};
const rect = (id: string, x: number, y: number, w: number, h: number, extra: Record<string, unknown> = {}): Layer => ({ id, type: 'shape', shape: 'rect', fill: '#ffffff', box: { x, y, w, h }, clips: [], ...extra } as Layer);
const group = (id: string, name: string, layers: Layer[], clips: Clip[] = []): Layer => ({ id, type: 'group', name, layers, clips } as Layer);
const MONO = 'JetBrains Mono';
const SERIF = 'Playfair Display';

export const PIECES: Piece[] = [
  {
    id: 'comment', name: 'Comment box', description: 'A comment box types a word ("EDIT"), sends it with a heart, and a reply pops up: the comment call to action.',
    build: () => group('comment', 'Comment box', [
      rect('box', 50, 14, 84, 6.5, { radius: 3.5, clips: [C('pop', 0, 0.35)] }),
      text('ph', 'Add a comment…', 22, 14, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 500, color: '#8a8f98' }, clips: [C('fade', 0.5, 0.15, { direction: 'out' })] }),
      text('word', 'EDIT', 22, 14, 4, { box: { anchor: 'left' }, style: { fontSize: 4, fontWeight: 800, color: '#111111' }, clips: [C('text-typewriter', 0.55, 0.5)] }),
      { id: 'send', type: 'shape', shape: 'ellipse', fill: '#ff3b5c', box: { x: 85, y: 14, w: 5, ratio: 1 }, clips: [C('pop', 1.2, 0.3), C('burst', 1.3, 0.5, { color: '#ff3b5c' })] } as Layer,
      rect('reply', 46, 22, 70, 5.5, { fill: '#f1f2f4', radius: 2.8, clips: [C('stack-in', 1.7, 0.4)] }),
      text('replyt', 'Sent. Check your DMs.', 16, 22, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 600, color: '#111111' }, clips: [C('fade', 1.9, 0.3)] }),
    ]),
  },
  {
    id: 'prompt', name: 'Prompt bar', description: 'A prompt typed into an AI prompt bar, then the send button pressed.',
    build: () => group('prompt', 'Prompt bar', [
      rect('bar', 50, 80, 86, 7, { fill: '#ffffff', radius: 3.5, clips: [C('slide', 0, 0.45, { from: 'bottom' })] }),
      text('typed', 'Edit this in my style', 12, 80, 3.6, { box: { anchor: 'left' }, style: { fontSize: 3.6, fontWeight: 500, color: '#1b1d22' }, clips: [C('text-typewriter', 0.5, 1.1, { caret: true })] }),
      { id: 'go', type: 'shape', shape: 'ellipse', fill: '#ff6a2b', box: { x: 87, y: 80, w: 5.2, ratio: 1 }, clips: [C('pop', 0.3, 0.3), C('pulse', 1.8, 0.4)] } as Layer,
    ]),
  },
  {
    id: 'chat', name: 'Chat window', description: 'A chat: your message lands, then the reply is typed and ticks through its steps (an AI doing the work).',
    build: () => group('chat', 'Chat window', [
      rect('win', 50, 45, 86, 44, { fill: '#fbfaf7', radius: 2.5, clips: [C('pop', 0, 0.4)] }),
      text('title', 'Assistant', 12, 27, 3.6, { box: { anchor: 'left' }, style: { fontSize: 3.6, fontWeight: 800, color: '#d9572a' }, clips: [C('fade', 0.2, 0.3)] }),
      rect('me', 62, 34, 50, 6, { fill: '#e9e6df', radius: 2.5, clips: [C('stack-in', 0.5, 0.35)] }),
      text('met', 'Edit this video, caption every word', 62, 34, 3.2, { style: { fontSize: 3.2, fontWeight: 500, color: '#222222' }, clips: [C('fade', 0.6, 0.3)] }),
      text('ai', 'On it.', 12, 43, 3, { box: { anchor: 'left' }, style: { fontSize: 3, fontWeight: 600, color: '#222222' }, clips: [C('text-typewriter', 1.1, 0.4)] }),
      text('s1', 'Cut the pauses', 18, 49, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 500, color: '#333333' }, clips: [C('fade', 1.6, 0.25), C('tick', 1.7, 0.4, { color: '#d9572a' })] }),
      text('s2', 'Caption every word', 18, 55, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 500, color: '#333333' }, clips: [C('fade', 2.1, 0.25), C('tick', 2.2, 0.4, { color: '#d9572a' })] }),
      text('s3', 'Add the effects', 18, 61, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 500, color: '#333333' }, clips: [C('fade', 2.6, 0.25), C('tick', 2.7, 0.4, { color: '#d9572a' })] }),
    ]),
  },
  {
    id: 'filedrop', name: 'File drop', description: 'A dashed drop zone ("Drop your raw video here"), a file card drops into it, and the outline turns solid: received.',
    build: () => group('filedrop', 'File drop', [
      rect('zone', 50, 45, 76, 24, { fill: 'rgba(255,255,255,0.04)', stroke: '#9aa3ad', strokeWidth: 0.3, dash: 1.4, radius: 2, clips: [C('fade', 0, 0.3), C('march', 0.3, 1.2), C('dash-solid', 1.6, 0.4)] }),
      text('hint', 'Drop your raw video here', 50, 45, 3.2, { style: { fontSize: 3.2, fontWeight: 600, color: '#c9d1da' }, clips: [C('fade', 0.2, 0.3), C('fade', 1.0, 0.2, { direction: 'out' })] }),
      rect('file', 50, 45, 40, 7, { fill: '#ffffff', radius: 1.2, clips: [C('stack-in', 1.1, 0.4)] }),
      text('fname', 'raw-video.mov', 50, 45, 3.4, { style: { fontSize: 3.4, fontWeight: 700, color: '#1d2733', fontFamily: MONO }, clips: [C('fade', 1.25, 0.3)] }),
    ]),
  },
  {
    id: 'timeline', name: 'Editing timeline', description: 'A video editor\'s timeline: clips slide into three tracks and the playhead runs across.',
    build: () => group('timeline', 'Editing timeline', [
      rect('panel', 50, 72, 92, 18, { fill: '#15181d', radius: 1.5, clips: [C('slide', 0, 0.4, { from: 'bottom' })] }),
      rect('v1', 30, 67, 36, 3.6, { fill: '#3b82f6', radius: 0.6, clips: [C('grow', 0.4, 0.4)] }),
      rect('v2', 66, 67, 30, 3.6, { fill: '#6366f1', radius: 0.6, clips: [C('grow', 0.55, 0.4)] }),
      rect('t1', 40, 72, 56, 3.6, { fill: '#f59e0b', radius: 0.6, clips: [C('grow', 0.7, 0.4)] }),
      rect('a1', 50, 77, 80, 3.6, { fill: '#10b981', radius: 0.6, clips: [C('grow', 0.85, 0.4)] }),
      rect('head', 10, 72, 0.5, 15, { fill: '#ff3b47', clips: [C('fade', 1.2, 0.2), C('keyframes', 1.2, 2, { frames: [{ t: 0, x: 0 }, { t: 2, x: 400 }] }, 'none')] }),
    ]),
  },
  {
    id: 'growth', name: 'Growth chart', description: 'A line climbs up the chart while a counter rolls up to "10×": growth, results.',
    build: () => group('growth', 'Growth chart', [
      rect('card', 50, 50, 84, 34, { fill: '#10141a', radius: 2, stroke: '#2b3644', strokeWidth: 0.15, clips: [C('pop', 0, 0.4)] }),
      { id: 'line', type: 'path', d: 'M 0 95 C 30 92, 55 80, 70 55 S 90 8, 100 2', stroke: '#ff3b47', strokeWidth: 0.6, glow: 0.6, arrow: 'end', box: { x: 50, y: 54, w: 70, h: 24 }, clips: [C('draw', 0.3, 1.6)] } as Layer,
      text('count', '10×', 80, 38, 7, { style: { fontSize: 7, fontWeight: 900, color: '#ffffff' }, clips: [C('fade', 0.3, 0.2), C('odometer', 0.3, 1.6, { from: 1 })] }),
    ]),
  },
  {
    id: 'storyboard', name: 'Storyboard deck', description: 'Four storyboard cards fly in and fan out, one after another.',
    build: () => group('storyboard', 'Storyboard deck', ['Hook', 'Problem', 'Demo', 'Call to action'].map((label, i) =>
      group(`card${i}`, label, [
        rect(`c${i}`, 22 + i * 19, 50, 17, 26, { fill: '#fbfaf6', radius: 1, stroke: '#d8d2c4', strokeWidth: 0.15 }),
        text(`n${i}`, String(i + 1), 22 + i * 19, 42, 5, { style: { fontSize: 5, fontWeight: 900, color: '#d9572a', fontFamily: SERIF } }),
        text(`l${i}`, label, 22 + i * 19, 56, 3.2, { style: { fontSize: 3.2, fontWeight: 700, color: '#333333' } }),
      ], [C('strip-in', i * 0.18, 0.45, { from: i % 2 ? 'left' : 'right', tilt: (i - 1.5) * 5 })]))),
  },
  {
    id: 'icons', name: 'App icons, one struck off', description: 'A row of app icons wobbles, then one is struck through and falls away ("you won\'t need this one").',
    build: () => group('icons', 'App icons', ['#1d1d1f', '#7c3aed', '#ec4899', '#2563eb'].map((fill, i) => ({
      id: `icon${i}`, type: 'shape', shape: 'rect', fill, radius: 2.2, box: { x: 20 + i * 20, y: 30, w: 15, ratio: 1 },
      clips: [C('pop', i * 0.1, 0.35), C('jiggle', 0.6, 1.2), ...(i === 1 ? [C('strike', 1.4, 0.9)] : [])],
    } as Layer))),
  },
  {
    id: 'checklist', name: 'Checklist that counts', description: 'A counter rolls up while each line of a checklist ticks off: "20 effects, all done".',
    build: () => group('checklist', 'Checklist', [
      text('num', '20', 12, 20, 11, { box: { anchor: 'left' }, style: { fontSize: 11, fontWeight: 900, color: '#ff4a2b' }, clips: [C('odometer', 0, 2.2, { from: 0 })] }),
      text('of', '/ 20 effects', 36, 22, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 700, color: '#ffffff' }, clips: [C('fade', 0.1, 0.3)] }),
      ...['Orbit', 'Snap zoom', 'Gravity drop', 'Paper cut-out', 'Frame break'].map((t, i) =>
        text(`i${i}`, t, 20, 34 + i * 6, 3, { box: { anchor: 'left' }, style: { fontSize: 3, fontWeight: 600, color: '#dfe5ec' }, clips: [C('fade', 0.3 + i * 0.35, 0.2), C('tick', 0.35 + i * 0.35, 0.4, { color: '#ff4a2b' })] })),
    ]),
  },
  {
    id: 'storm', name: 'Headline storm', description: 'Tilted headline strips fly in from alternating sides and pile up.',
    build: () => group('storm', 'Headline storm', ['EDITING JUST GOT FAST', 'ONE PROMPT. TWENTY EFFECTS.', 'EVERY WORD CAPTIONED', 'MOTION ON EVERY CUT', 'READY TO POST'].map((t, i) =>
      text(`h${i}`, t, 50 + (i % 2 ? -6 : 6), 18 + i * 9, 3.4, {
        style: { fontSize: 3.4, fontWeight: 900, color: i % 3 === 1 ? '#ffffff' : '#111111' }, pill: { fill: i % 3 === 1 ? '#e8202a' : '#ffffff', padX: 0.5, padY: 0.25, radius: 0.1 },
        clips: [C('strip-in', i * 0.22, 0.4, { from: i % 2 ? 'left' : 'right', tilt: [-6, 4, -3, 7, -5][i] })],
      }))),
  },
  {
    id: 'hook', name: 'Kinetic hook', description: 'The hook in two big words, slammed in over a bar that wipes across: the first two seconds.',
    build: () => group('hook', 'Kinetic hook', [
      rect('bar', 50, 16, 100, 13, { fill: '#111111', clips: [C('wipe', 0, 0.3)] }),
      text('w1', 'KINETIC', 50, 13, 13, { style: { fontSize: 13, fontWeight: 900, color: '#ffffff' }, clips: [C('text-slam', 0.15, 0.45)] }),
      text('w2', 'HOOK', 50, 24, 13, { style: { fontSize: 13, fontWeight: 900, color: '#ffffff' }, pill: { fill: '#e8202a', padX: 0.2, padY: 0, radius: 0 }, clips: [C('gravity-drop', 0.45, 0.8)] }),
    ]),
  },
  {
    id: 'titlecard', name: 'Title card', description: 'A full-screen title card: a running timecode above a big serif title, rising in.',
    build: () => group('titlecard', 'Title card', [
      rect('bg', 50, 50, 100, 100, { fill: '#f1ede4', clips: [C('fade', 0, 0.2)] }),
      text('tc', '00:00:00:00', 50, 38, 3.2, { style: { fontSize: 3.2, fontWeight: 500, color: '#6b6457', fontFamily: MONO }, clips: [C('timecode', 0, 2.5, { from: 3725 })] }),
      text('title', 'TITLE\nCARD', 50, 50, 15, { style: { fontSize: 15, fontWeight: 400, color: '#1c2a24', fontFamily: SERIF, lineHeight: 0.95, align: 'center' }, clips: [C('text-rise', 0.2, 0.7)] }),
    ]),
  },
  {
    id: 'intertitle', name: 'Intertitle', description: 'A silent-film card: an ornate frame draws in round a line of italic serif text.',
    build: () => group('intertitle', 'Intertitle', [
      rect('bg', 50, 50, 100, 100, { fill: '#1d3b30', clips: [C('fade', 0, 0.3)] }),
      rect('outer', 50, 50, 70, 46, { fill: 'transparent', stroke: '#e9e1cc', strokeWidth: 0.25, radius: 0.3, clips: [C('grow', 0.2, 0.5)] }),
      rect('inner', 50, 50, 64, 40, { fill: 'transparent', stroke: '#e9e1cc', strokeWidth: 0.12, radius: 0.3, clips: [C('grow', 0.35, 0.5)] }),
      text('words', 'Intertitle.', 50, 50, 8, { style: { fontSize: 8, fontWeight: 400, color: '#e9e1cc', fontFamily: SERIF, italic: true }, clips: [C('fade', 0.6, 0.6)] }),
    ]),
  },
  {
    id: 'receipt', name: 'Receipt', description: 'A slip prints out of the top of the screen line by line: the effect\'s name, the total.',
    build: () => group('receipt', 'Receipt', [
      group('slip', 'Slip', [
        rect('paper', 40, 16, 70, 28, { fill: '#fbfaf3' }),
        text('l1', 'EFFECT NAME', 10, 7, 2.8, { box: { anchor: 'left' }, style: { fontSize: 2.8, fontWeight: 500, color: '#555555', fontFamily: MONO } }),
        text('l2', 'RECEIPT\nPRINTER', 10, 14, 5.2, { box: { anchor: 'left' }, style: { fontSize: 5.2, fontWeight: 700, color: '#111111', fontFamily: MONO, lineHeight: 1 } }),
        text('l3', 'TOTAL        2 WORDS', 10, 21.5, 2.8, { box: { anchor: 'left' }, style: { fontSize: 2.8, fontWeight: 500, color: '#555555', fontFamily: MONO } }),
      ], [C('receipt', 0, 1.2)]),
    ]),
  },
  {
    id: 'screenplay', name: 'Screenplay page', description: 'A screenplay page typed line by line, then a line highlighted.',
    build: () => group('screenplay', 'Screenplay page', [
      rect('page', 50, 50, 100, 100, { fill: '#f4f0e6', clips: [C('fade', 0, 0.2)] }),
      text('scene', 'INT. GREEN ROOM - DAY', 10, 30, 3.4, { box: { anchor: 'left' }, style: { fontSize: 3.4, fontWeight: 500, color: '#222222', fontFamily: MONO }, clips: [C('text-typewriter', 0.2, 0.6)] }),
      text('who', 'PRESENTER', 50, 38, 3.4, { style: { fontSize: 3.4, fontWeight: 500, color: '#222222', fontFamily: MONO }, clips: [C('text-typewriter', 0.9, 0.3)] }),
      text('line', 'Kinetic hook.\nTitle card dive.\nScreenplay page.', 50, 47, 3.4, { style: { fontSize: 3.4, fontWeight: 500, color: '#222222', fontFamily: MONO, align: 'center', lineHeight: 1.3 }, clips: [C('text-typewriter', 1.3, 1.2), C('select-box', 2.7, 0.4, { word: 5, words: 2, color: '#f5c542' })] }),
    ]),
  },
  {
    id: 'masthead', name: 'Magazine cover', description: 'A magazine masthead, cover lines and an issue badge. Put it under a person cut out of the footage so the title sits behind their head.',
    build: () => group('masthead', 'Magazine cover', [
      text('mast', 'TAKE', 50, 13, 30, { style: { fontSize: 30, fontWeight: 900, color: '#e8202a', letterSpacing: -0.04 }, clips: [C('fade', 0, 0.4)] }),
      text('issue', 'OCTOBER 2026 · ISSUE No. 1', 50, 4, 2.8, { style: { fontSize: 2.8, fontWeight: 700, color: '#ffffff', letterSpacing: 0.2 }, clips: [C('fade', 0.3, 0.4)] }),
      text('line1', 'MOTION\nMADE\nEASY', 86, 46, 4.2, { box: { anchor: 'right' }, style: { fontSize: 4.2, fontWeight: 900, color: '#ffffff', align: 'right', lineHeight: 0.95 }, clips: [C('strip-in', 0.5, 0.4, { from: 'right', tilt: 0 })] }),
      { id: 'badge', type: 'shape', shape: 'ellipse', fill: '#e8202a', box: { x: 84, y: 68, w: 14, ratio: 1 }, clips: [C('pop', 0.8, 0.4)] } as Layer,
      text('badget', '20\nEFFECTS', 84, 68, 2.6, { style: { fontSize: 2.6, fontWeight: 900, color: '#ffffff', align: 'center', lineHeight: 0.95 }, clips: [C('fade', 0.9, 0.3)] }),
    ]),
  },
  {
    id: 'loadout', name: 'Loadout', description: 'Five locked slots fill one by one while a counter steps 0/5 to 5/5 and a card names each item: a stack, a toolkit, the steps of a setup. Change the names, then stretch the group to your voice-over.',
    build: () => {
      const items = ['Project', 'Words', 'Sound', 'Stems', '3D'];
      const step = 1.6, first = 0.9, accent = '#e0603a', ink = '#1d1f24', dim = '#9aa0a8';
      const at = (i: number) => first + i * step;
      const slots = items.flatMap((name, i) => {
        const x = 18 + i * 16;
        return [
          rect(`slot${i + 1}`, x, 20, 12, 6.75, { fill: 'rgba(0,0,0,0)', stroke: dim, strokeWidth: 0.25, dash: 1, radius: 1.2,
            clips: [C('stack-in', 0.15 + i * 0.07, 0.4), C('dash-solid', at(i), 0.3), C('recolor', at(i), 0.3, { to: accent }), C('pop', at(i), 0.35, { from: 0.8 })] }),
          text(`mark${i + 1}`, '?', x, 20, 3.4, { style: { fontSize: 3.4, fontWeight: 700, color: dim, fontFamily: MONO },
            clips: [C('fade', 0.25 + i * 0.07, 0.3), C('text-swap', at(i), 0.3, { to: String(i + 1).padStart(2, '0'), style: 'roll' }), C('recolor', at(i), 0.3, { to: '#ffffff' })] }),
          text(`tag${i + 1}`, 'LOCKED', x, 26, 1.7, { style: { fontSize: 1.7, fontWeight: 600, color: dim, fontFamily: MONO, letterSpacing: 0.08 },
            clips: [C('fade', 0.3 + i * 0.07, 0.3), C('text-swap', at(i) + 0.1, 0.3, { to: name.toUpperCase(), style: 'roll' }), C('recolor', at(i) + 0.1, 0.3, { to: ink })] }),
        ];
      });
      // The card names the item that just unlocked, one after another on the same layer.
      const swaps = items.slice(1).map((name, i) => C('text-swap', at(i + 1), 0.4, { to: name, style: 'slide' }));
      const numbers = items.slice(1).map((_, i) => C('text-swap', at(i + 1), 0.4, { to: `ITEM ${String(i + 2).padStart(2, '0')}`, style: 'roll' }));
      const counts = items.map((_, i) => C('text-swap', at(i), 0.3, { to: `${i + 1}/5`, style: 'roll' }));
      return group('loadout', 'Loadout', [
        text('kicker', 'THE FULL STACK', 12, 10, 2, { box: { anchor: 'left' }, style: { fontSize: 2, fontWeight: 600, color: dim, fontFamily: MONO, letterSpacing: 0.12 }, clips: [C('fade', 0, 0.3)] }),
        text('count', '0/5', 88, 10, 3, { box: { anchor: 'right' }, style: { fontSize: 3, fontWeight: 800, color: accent, fontFamily: MONO }, clips: [C('fade', 0, 0.3), ...counts] }),
        ...slots,
        rect('card', 50, 38, 76, 10, { fill: '#ffffff', stroke: '#e3e0da', strokeWidth: 0.2, radius: 1.6, clips: [C('stack-in', at(0) - 0.1, 0.45)] }),
        text('num', 'ITEM 01', 18, 35.6, 1.8, { box: { anchor: 'left' }, style: { fontSize: 1.8, fontWeight: 600, color: accent, fontFamily: MONO, letterSpacing: 0.1 }, clips: [C('fade', at(0) + 0.1, 0.3), ...numbers] }),
        text('name', items[0], 18, 39.4, 6, { box: { anchor: 'left', w: 64 }, style: { fontSize: 6, fontWeight: 900, color: ink, align: 'left', uppercase: true }, clips: [C('text-rise', at(0) + 0.15, 0.5), ...swaps] }),
      ]);
    },
  },
  {
    id: 'voicenote', name: 'Voice note', description: 'A voice message bubble: it pops in, the play button presses, the waveform plays through and the time counts up.',
    build: () => {
      const bars = Array.from({ length: 28 }, (_, i) => {
        const hgt = 1.2 + 3.2 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
        return rect(`bar${i + 1}`, 30 + i * 1.55, 14, 0.75, hgt, { fill: '#c9ced6', radius: 0.4, clips: [C('fade', 0.2, 0.2), C('recolor', 0.9 + i * 0.06, 0.15, { to: '#2ad38b' })] });
      });
      return group('voicenote', 'Voice note', [
        rect('bubble', 50, 14, 84, 9, { fill: '#ffffff', radius: 4.5, clips: [C('stack-in', 0, 0.4)] }),
        { id: 'play', type: 'shape', shape: 'ellipse', fill: '#2ad38b', box: { x: 18, y: 14, w: 6.5, ratio: 1 }, clips: [C('pop', 0.15, 0.3), C('pulse', 0.7, 0.3, { scale: 0.88, times: 1 })] } as Layer,
        text('icon', '▶', 18.4, 14, 3, { style: { fontSize: 3, fontWeight: 900, color: '#ffffff' }, clips: [C('fade', 0.2, 0.2)] }),
        ...bars,
        text('time', '0:12', 82, 14, 2.8, { style: { fontSize: 2.8, fontWeight: 700, color: '#5f6266', fontFamily: MONO }, clips: [C('fade', 0.2, 0.2), C('text-count', 0.9, 1.8, { from: 0 })] }),
        text('label', 'Voice note', 50, 21, 2.4, { style: { fontSize: 2.4, fontWeight: 700, color: '#ffffff' }, pill: { fill: 'rgba(0,0,0,0.55)', padX: 0.9, padY: 0.35, radius: 2 }, clips: [C('fade', 0.4, 0.3)] } as Record<string, unknown>),
      ]);
    },
  },
  {
    id: 'predict', name: 'Predict keys', description: 'A phone keyboard slides up, a sentence is typed, and the suggestion bar offers the next word, which is tapped: "your words, predicted".',
    build: () => {
      const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
      const keys = rows.flatMap((row, r) => row.split('').map((ch, i) => {
        const x = 50 + (i - (row.length - 1) / 2) * 8.6, y = 80 + r * 5.6;
        return [
          rect(`k${r}${i}`, x, y, 7.6, 4.6, { fill: '#ffffff', radius: 0.9, clips: [] }),
          text(`kt${r}${i}`, ch, x, y, 3, { style: { fontSize: 3, fontWeight: 500, color: '#1c1e22' } }),
        ];
      }).flat());
      return group('predict', 'Predict keys', [
        rect('board', 50, 85, 100, 26, { fill: '#d4d7dd', clips: [C('slide', 0, 0.45, { from: 'bottom' })] }),
        rect('field', 50, 66, 88, 6.5, { fill: '#ffffff', radius: 3.2, clips: [C('fade', 0.2, 0.3)] }),
        text('typed', 'Make the edit feel', 10, 66, 3.2, { box: { anchor: 'left' }, style: { fontSize: 3.2, fontWeight: 500, color: '#1c1e22' }, clips: [C('text-typewriter', 0.5, 1, { caret: true }), C('text-swap', 2.2, 0.3, { to: 'Make the edit feel alive', style: 'fade' })] }),
        rect('sug', 50, 73.5, 100, 4.6, { fill: '#c7cbd2', clips: [C('fade', 0.3, 0.3)] }),
        text('s1', 'fast', 20, 73.5, 2.8, { style: { fontSize: 2.8, fontWeight: 600, color: '#3a3d42' }, clips: [C('fade', 1.4, 0.2)] }),
        text('s2', 'alive', 50, 73.5, 2.8, { style: { fontSize: 2.8, fontWeight: 800, color: '#1c1e22' }, clips: [C('fade', 1.45, 0.2), C('pulse', 1.9, 0.3, { scale: 1.25, times: 1 })] }),
        text('s3', 'real', 80, 73.5, 2.8, { style: { fontSize: 2.8, fontWeight: 600, color: '#3a3d42' }, clips: [C('fade', 1.5, 0.2)] }),
        ...keys,
      ]);
    },
  },
  {
    id: 'frontpage', name: 'Newspaper front page', description: 'A newspaper front page: the paper\'s name, a huge headline, columns of text and a photo slot. Put a person cut out of the footage with Risograph or Engraving in the photo slot for "made the front page".',
    build: () => group('frontpage', 'Newspaper front page', [
      rect('paper', 50, 50, 100, 100, { fill: '#efe8d8', clips: [C('fade', 0, 0.3)] }),
      text('name', 'The Daily Reel', 50, 9, 8.6, { style: { fontSize: 8.6, fontWeight: 700, color: '#1d1b17', fontFamily: SERIF }, clips: [C('fade', 0.15, 0.4)] }),
      rect('rule1', 50, 14.4, 92, 0.25, { fill: '#1d1b17', clips: [C('grow', 0.3, 0.4, { from: 'left' })] }),
      text('date', 'FRIDAY · ONE EDITION · ALL THE NEWS THAT FITS', 50, 16, 1.9, { style: { fontSize: 1.9, fontWeight: 600, color: '#1d1b17', letterSpacing: 0.12 }, clips: [C('fade', 0.4, 0.3)] }),
      rect('rule2', 50, 17.6, 92, 0.25, { fill: '#1d1b17', clips: [C('grow', 0.4, 0.4, { from: 'left' })] }),
      text('head', 'BIG NEWS', 50, 25, 12, { style: { fontSize: 12, fontWeight: 900, color: '#1d1b17', fontFamily: SERIF }, clips: [C('text-slam', 0.6, 0.45)] }),
      text('deck', 'in one line, under the headline', 50, 32.5, 4, { style: { fontSize: 4, fontWeight: 400, color: '#1d1b17', fontFamily: SERIF, fontStyle: 'italic' }, clips: [C('fade', 0.9, 0.4)] }),
      rect('photo', 50, 58, 50, 36, { fill: '#d8d0bd', stroke: '#1d1b17', strokeWidth: 0.25, clips: [C('fade', 1, 0.4)] }),
      text('colL', 'The lead. The story starts here and runs down the column in small serif type, the way a front page reads.', 5, 58, 1.7, { box: { anchor: 'left', w: 18 }, style: { fontSize: 1.7, fontWeight: 400, color: '#1d1b17', fontFamily: SERIF, align: 'left', lineHeight: 1.3 }, clips: [C('fade', 1.2, 0.4)] }),
      text('colR', 'The ask. A second column on the right, with the details and a quote.', 95, 58, 1.7, { box: { anchor: 'right', w: 18 }, style: { fontSize: 1.7, fontWeight: 400, color: '#1d1b17', fontFamily: SERIF, align: 'left', lineHeight: 1.3 }, clips: [C('fade', 1.3, 0.4)] }),
      text('caption', 'Pictured: you, on the front page.', 50, 78, 1.9, { style: { fontSize: 1.9, fontWeight: 400, color: '#1d1b17', fontFamily: SERIF, fontStyle: 'italic' }, clips: [C('fade', 1.4, 0.4)] }),
    ]),
  },
  {
    id: 'banknote', name: 'Banknote', description: 'A banknote: an engraved border, serial numbers, a big value that rolls up like an odometer and an oval for the portrait. Put a person cut out of the footage with the Engraving preset (Oval on) in the oval.',
    build: () => group('banknote', 'Banknote', [
      rect('note', 50, 50, 94, 74, { fill: '#e6e2cf', stroke: '#2f4a3a', strokeWidth: 0.8, radius: 1, clips: [C('zoom', 0, 0.45)] }),
      rect('inner', 50, 50, 88, 69, { fill: 'rgba(0,0,0,0)', stroke: '#2f4a3a', strokeWidth: 0.25, radius: 0.6, clips: [C('draw', 0.3, 0.6)] }),
      text('serialL', 'AI 0274 553 VE', 22, 19, 2.2, { style: { fontSize: 2.2, fontWeight: 700, color: '#2f4a3a', fontFamily: MONO, letterSpacing: 0.08 }, clips: [C('fade', 0.4, 0.3)] }),
      text('serialR', 'AI 0274 553 VE', 78, 19, 2.2, { style: { fontSize: 2.2, fontWeight: 700, color: '#2f4a3a', fontFamily: MONO, letterSpacing: 0.08 }, clips: [C('fade', 0.4, 0.3)] }),
      { id: 'oval', type: 'shape', shape: 'ellipse', fill: 'rgba(0,0,0,0)', stroke: '#2f4a3a', strokeWidth: 0.5, box: { x: 50, y: 45, w: 46, h: 40 }, clips: [C('fade', 0.5, 0.4)] } as Layer,
      text('value', '174,953', 50, 72, 11, { style: { fontSize: 11, fontWeight: 700, color: '#2f4a3a', fontFamily: SERIF }, clips: [C('odometer', 0.7, 1.8)] }),
      text('legend', 'ONE PROMISE TO PAY THE BEARER', 50, 80.5, 1.9, { style: { fontSize: 1.9, fontWeight: 700, color: '#2f4a3a', letterSpacing: 0.14 }, clips: [C('fade', 1, 0.4)] }),
    ]),
  },
  {
    id: 'daydial', name: 'Day dial', description: 'A big dial with the days around it turns behind the speaker, like a calendar wheel. Put it under a person cut out of the footage.',
    build: () => {
      const n = 12;
      const ticks = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return text(`d${i + 1}`, `day ${i + 1}`, 50 + Math.sin(a) * 36, 40 - Math.cos(a) * 20.3, 3, { box: { rotate: (i / n) * 360 }, style: { fontSize: 3, fontWeight: 600, color: '#1d1b17', fontFamily: SERIF, fontStyle: 'italic' } });
      });
      return group('daydial', 'Day dial', [
        { id: 'face', type: 'shape', shape: 'ellipse', fill: '#efe8d8', stroke: '#1d1b17', strokeWidth: 0.3, box: { x: 50, y: 40, w: 90, ratio: 1 }, clips: [] } as Layer,
        { id: 'ring', type: 'shape', shape: 'ellipse', fill: 'rgba(0,0,0,0)', stroke: '#1d1b17', strokeWidth: 0.2, box: { x: 50, y: 40, w: 64, ratio: 1 }, clips: [] } as Layer,
        ...ticks,
      ], [C('fade', 0, 0.4), C('keyframes', 0, 4, { frames: [{ t: 0, rotate: -50 }, { t: 4, rotate: 40 }] })]);
    },
  },
  {
    id: 'giantcaps', name: 'Giant captions', description: 'Big captions from the voice-over, each word slamming in as it is said (transcribe the voice first).',
    build: () => ({ id: 'giant', type: 'captions', name: 'Giant captions', box: { x: 50, y: 62, w: 86 }, style: { fontSize: 9, fontWeight: 900, color: '#ffffff' }, uppercase: true, maxWords: 2, motion: 'slam', mode: 'word', highlight: '#ffd166', clips: [] } as Layer),
  },
  {
    id: 'reply', name: 'Replying to a comment', description: 'A viewer’s comment as a sticker at the top of a reel ("Reply to @name’s comment" and the question), popping in with a tilt: open a reel by answering a question. Change the name and the words.',
    build: () => group('reply', 'Replying to a comment', [
      rect('card', 50, 17.5, 84, 14, { radius: 2.4, fill: '#ffffff', box: { x: 50, y: 17.5, w: 84, h: 14, rotate: -2 }, clips: [withSound(C('pop', 0, 0.4, { from: 0.6 }, 'back.out(1.8)'), 'pop'), C('jiggle', 0.5, 1.2, { angle: 1.2, speed: 3 })] }),
      { id: 'avatar', type: 'shape', shape: 'ellipse', fill: 'linear-gradient(135deg,#2ad38b,#0e7c66)', box: { x: 16, y: 14, w: 7, ratio: 1, rotate: -2 }, clips: [C('pop', 0.15, 0.3)] } as Layer,
      text('who', 'Reply to @your.viewer’s comment', 22.5, 13.6, 3.1, { box: { anchor: 'left', rotate: -2 }, style: { fontSize: 3.1, fontWeight: 600, color: '#6b7280' }, clips: [C('fade', 0.2, 0.25)] }),
      text('ask', 'Is there a free way to do this?', 12, 20, 4.6, { box: { anchor: 'left', w: 76, rotate: -2 }, style: { fontSize: 4.6, fontWeight: 800, color: '#111111', align: 'left', lineHeight: 1.15 }, clips: [C('text-typewriter', 0.35, 0.9)] }),
    ]),
  },
  {
    id: 'tierlist', name: 'Tier list', description: 'A tier list: S to D rows in their colours, and items that drop into their rows one by one with a sound. Change the items, the rows they land in and when.',
    build: () => {
      const tiers = [['S', '#ff7f7f'], ['A', '#ffbf7f'], ['B', '#ffdf7f'], ['C', '#bfff7f'], ['D', '#7fbfff']] as const;
      const items: Array<[string, number]> = [['Speed', 0], ['Price', 1], ['Design', 0], ['Support', 2], ['Updates', 3]];
      const rowY = (i: number) => 30 + i * 9.4;
      const slot = new Map<number, number>();
      return group('tierlist', 'Tier list', [
        text('title', 'RANKED', 50, 19, 6.5, { style: { fontSize: 6.5, fontWeight: 900, color: '#ffffff', letterSpacing: 0.04 }, clips: [C('text-slam', 0, 0.45)] }),
        ...tiers.flatMap(([t, color], i) => [
          rect(`row${t}`, 56, rowY(i), 74, 8.6, { fill: '#1b1f26', radius: 0.8, clips: [C('wipe', 0.15 + i * 0.07, 0.35, { from: 'left' })] }),
          rect(`tag${t}`, 13, rowY(i), 12, 8.6, { fill: color, radius: 0.8, clips: [C('pop', 0.2 + i * 0.07, 0.3)] }),
          text(`t${t}`, t, 13, rowY(i), 5, { style: { fontSize: 5, fontWeight: 900, color: '#111111' }, clips: [C('fade', 0.25 + i * 0.07, 0.2)] }),
        ]),
        ...items.map(([label, tier], k) => {
          const n = slot.get(tier) ?? 0; slot.set(tier, n + 1);
          const at = 1 + k * 0.7;
          return text(`it${k}`, label, 31 + n * 19, rowY(tier), 3.3, {
            style: { fontSize: 3.3, fontWeight: 800, color: '#111111' }, pill: { fill: '#ffffff', padX: 0.7, padY: 0.45, radius: 0.4 },
            clips: [withSound(C('stack-in', at, 0.45, { lift: 120 }, 'back.out(1.6)'), 'pop')],
          });
        }),
      ]);
    },
  },
  {
    id: 'reveal', name: 'Reveal board', description: 'A numbered board whose answers are covered, then uncovered one by one with a sound, like a game show: top 5 lists, "the answers you got wrong". Change the answers and the times.',
    build: () => {
      const answers = ['Your first answer', 'The second one', 'A surprising third', 'The fourth', 'And the top one'];
      const y = (i: number) => 26 + i * 11;
      return group('reveal', 'Reveal board', [
        text('title', 'TOP 5', 50, 15, 7, { style: { fontSize: 7, fontWeight: 900, color: '#ffffff' }, clips: [C('text-slam', 0, 0.45)] }),
        ...answers.flatMap((a, i) => {
          const at = 1.2 + i * 1.1;
          return [
            rect(`bar${i}`, 50, y(i), 86, 9, { fill: '#ffffff', radius: 1.2, clips: [C('slide', 0.15 + i * 0.08, 0.35, { from: 'right' })] }),
            { id: `n${i}`, type: 'shape', shape: 'ellipse', fill: '#ff4a2b', box: { x: 14, y: y(i), w: 7, ratio: 1 }, clips: [C('pop', 0.3 + i * 0.08, 0.3)] } as Layer,
            text(`d${i}`, String(i + 1), 14, y(i), 3.8, { style: { fontSize: 3.8, fontWeight: 900, color: '#ffffff' }, clips: [C('fade', 0.35 + i * 0.08, 0.2)] }),
            text(`a${i}`, a, 22, y(i), 3.6, { box: { anchor: 'left', w: 60 }, style: { fontSize: 3.6, fontWeight: 800, color: '#111111', align: 'left' }, clips: [C('text-rise', at + 0.1, 0.4)] }),
            rect(`cover${i}`, 55.5, y(i), 70, 6.4, { fill: '#2b3038', radius: 0.8, clips: [C('fade', 0.4 + i * 0.08, 0.2), withSound(C('wipe', at, 0.35, { direction: 'out', from: 'left' }), 'reveal')] }),
          ];
        }),
      ]);
    },
  },
];

/** A clip with a built-in sound that plays as it starts. */
function withSound(c: Clip, name: string): Clip { return { ...c, sound: { name } }; }

/** Inserts a piece at the playhead (in the group being edited), with ids made unique; returns its id. */
export function insertPiece(scene: Scene, piece: Piece, at: number, scope: string | null): { scene: Scene; id: string } {
  const taken = new Set<string>();
  const collect = (list: Layer[]) => list.forEach((l) => { taken.add(l.id); l.clips.forEach((c) => taken.add(c.id)); if (l.type === 'group') collect(l.layers); });
  collect(scene.layers);
  const fresh = (base: string) => { let id = base, k = 2; while (taken.has(id)) id = `${base}-${k++}`; taken.add(id); return id; };
  const renew = (l: Layer): Layer => {
    const out = { ...l, id: fresh(l.id), clips: l.clips.map((c) => ({ ...c, id: fresh(c.id.replace(/-\d+$/, '')) })) } as Layer;
    if (out.type === 'group') return { ...out, layers: out.layers.map(renew) } as Layer;
    return out;
  };
  const layer = renew(piece.build());
  // A group starts at the playhead; a lone layer (captions) follows the voice and starts at 0.
  if (layer.type === 'group' && at > 0) (layer as Layer & { start?: number }).start = Math.round(at * 100) / 100;
  // With the person cut out of the footage, a piece goes just under them (graphics behind the person); else on top.
  const add = (ls: Layer[]): Layer[] => {
    const k = ls.findIndex((l) => l.type === 'video' && /-person(-\d+)?$/.test(l.id));
    return k >= 0 ? [...ls.slice(0, k), layer, ...ls.slice(k)] : [...ls, layer];
  };
  const list = layersIn(scene, scope);
  const next = scope && findLayer(scene, scope)
    ? { ...scene, layers: (function walk(ls: Layer[]): Layer[] { return ls.map((l) => (l.id === scope && l.type === 'group' ? ({ ...l, layers: add(l.layers) } as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l)); })(scene.layers) }
    : { ...scene, layers: add(list) };
  return { scene: next, id: layer.id };
}
