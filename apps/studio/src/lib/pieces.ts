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
    id: 'giantcaps', name: 'Giant captions', description: 'Big captions from the voice-over, each word slamming in as it is said (transcribe the voice first).',
    build: () => ({ id: 'giant', type: 'captions', name: 'Giant captions', box: { x: 50, y: 62, w: 86 }, style: { fontSize: 9, fontWeight: 900, color: '#ffffff' }, uppercase: true, maxWords: 2, motion: 'slam', mode: 'word', highlight: '#ffd166', clips: [] } as Layer),
  },
];

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
