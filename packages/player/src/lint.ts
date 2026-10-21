import { PLATFORM_LIMITS, isVideo, zonesFor } from './video';
import type { VideoFormat } from './types';
import { expandRepeats } from './repeat';
import type { Anchor, Box, Breakpoint, Clip, Layer, Scene, TextLayer } from './types';
import { groupDuration } from './groups';
import { presetMeta } from './presets/catalog';

/**
 * "Check scene": motion and layout problems a scene can have even though it is valid, found from the
 * scene file alone (no rendering). The editor lists them with one-click fixes; the AI gets them as
 * things to repair. The rules are the measurable ones from professional motion design: text has to
 * stay up long enough to be read, be big enough to read, stay on the stage and not sit on other text,
 * and two clips shouldn't fight over one layer.
 *
 * Text sizes are estimated (a letter is about 0.55 em wide), so the layout checks say "about".
 */

export interface LintIssue {
  /** Stable for a given problem, so the editor can keep its place in the list. */
  id: string;
  severity: 'warn' | 'info';
  message: string;
  layerId?: string;
  clipId?: string;
  breakpoint?: string;
  fix?: { label: string; apply: (scene: Scene) => Scene };
}

/** Seconds a line of text needs to be read once it has landed. */
export function readingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(0.8, 0.3 * words);
}

/** The smallest text worth showing, in CSS pixels. */
const MIN_TEXT_PX = 12;
/** Width assumed for the narrowest breakpoint (minWidth 0). */
const NARROW_PX = 360;
/** Longest stretch with nothing moving before a scene feels stalled. */
const MAX_STILL = 1.5;

interface Entry {
  layer: Layer;
  /** Scene time of the layer's own time 0 (its container's start). */
  offset: number;
  /** End of the layer's container in scene time. */
  containerEnd: number;
  topLevel: boolean;
  /** Scene time an enclosing group starts to leave (its first exit clip, or its out point), if any. */
  exitAt: number;
  /** Scene time an enclosing group has gone. */
  goneAt: number;
}

function entries(scene: Scene): Entry[] {
  const out: Entry[] = [];
  const walk = (list: Layer[], offset: number, end: number, top: boolean, exitAt: number, goneAt: number) => {
    for (const l of list) {
      out.push({ layer: l, offset, containerEnd: end, topLevel: top, exitAt, goneAt });
      if (l.type === 'group') {
        const s = offset + (l.start ?? 0);
        // When the group leaves (an exit clip on the group, or its out point), so does everything in it.
        const outs = l.clips.filter((c) => dirOf(c) === 'out');
        const gExit = Math.min(exitAt, ...outs.map((c) => offset + c.start), typeof l.end === 'number' ? offset + l.end : Infinity);
        const gGone = Math.min(goneAt, ...outs.map((c) => offset + c.start + c.duration), typeof l.end === 'number' ? offset + l.end : Infinity);
        walk(l.layers, s, Math.min(end, s + groupDuration(l)), false, gExit, gGone);
      }
    }
  };
  walk(scene.layers, 0, scene.duration, true, Infinity, Infinity);
  return out;
}

const dirOf = (c: Clip): 'in' | 'out' | null => {
  const meta = presetMeta[c.preset];
  if (!meta || !meta.fields.some((f) => f.key === 'direction')) return null;
  const d = c.params && 'direction' in c.params ? c.params.direction : meta.defaults.direction;
  return d === 'out' ? 'out' : 'in';
};
const isMover = (c: Clip) => {
  const cat = presetMeta[c.preset]?.category;
  return cat === 'text' || cat === 'reveal' || cat === 'motion';
};

/** When a layer is fully on screen and when it starts to leave, in scene time. */
function window(e: Entry, scene: Scene) {
  const l = e.layer;
  const ins = l.clips.filter((c) => dirOf(c) === 'in' || c.preset === 'text-scramble');
  const outs = l.clips.filter((c) => dirOf(c) === 'out').sort((a, b) => a.start - b.start);
  const start = e.offset + (l.start ?? 0);
  const landed = ins.length ? e.offset + Math.max(...ins.map((c) => c.start + c.duration)) : start;
  const lastOut = outs[outs.length - 1];
  const gone = lastOut ? e.offset + lastOut.start + lastOut.duration : e.offset + (l.end ?? Infinity);
  const leaving = outs.length ? e.offset + outs[0].start : e.offset + (l.end ?? Infinity);
  // A layer that never leaves stays up after the last frame unless the scene loops (then until it restarts),
  // or until an enclosing group leaves.
  const cap = scene.playback.loop ? scene.duration + (scene.playback.repeatDelay ?? 0) : Infinity;
  return { start, landed, leaving: Math.min(leaving, cap, e.exitAt), gone: Math.min(gone, cap, e.goneAt), firstOut: outs[0] };
}

const anchorFactors = (a: Anchor = 'center'): [number, number] => [
  a.endsWith('left') ? 0 : a.endsWith('right') ? 1 : 0.5,
  a.startsWith('top') ? 0 : a.startsWith('bottom') ? 1 : 0.5,
];

function resolved(l: Layer, bp: string) {
  const o = l.overrides?.[bp] ?? {};
  const box: Box = { ...(l.box ?? { x: 0, y: 0 }), ...(o.box ?? {}) };
  const style = l.type === 'text' ? { ...l.style, ...(o.style ?? {}) } : undefined;
  const text = l.type === 'text' ? (o.text ?? l.text) : undefined;
  return { box, style, text, hidden: !!o.hidden };
}

/** A text layer's estimated rectangle on a breakpoint, in % of the stage (left, top, width, height). */
function textRect(l: TextLayer, bp: Breakpoint) {
  const r = resolved(l, bp.id);
  const size = r.style!.fontSize;
  const lh = r.style!.lineHeight ?? 1.1;
  const lines = (r.text ?? '').split('\n');
  const charW = size * 0.55 * (1 + (r.style!.letterSpacing ?? 0));
  const natural = Math.max(...lines.map((s) => s.length)) * charW;
  const w = r.box.w ?? natural;
  const rows = lines.reduce((n, s) => n + Math.max(1, Math.ceil((s.length * charW) / Math.max(1, w))), 0);
  const h = rows * size * lh * (bp.aspect[0] / bp.aspect[1]);
  const [ax, ay] = anchorFactors(r.box.anchor);
  return { left: r.box.x - w * ax, top: r.box.y - h * ay, w, h, line: size * lh * (bp.aspect[0] / bp.aspect[1]), hidden: r.hidden };
}

/** The part of a text rectangle the letters fill: about the middle 70% of each line's height. */
// The leading above the first line and below the last (per line, not per block: a two-line headline has
// no more empty space at its top than a one-line one).
const inkRect = (r: ReturnType<typeof textRect>) => ({ ...r, top: r.top + r.line * 0.15, h: Math.max(0, r.h - r.line * 0.3) });

/** How wide each video format usually appears on screen (a phone held upright; a landscape video in a player). */
const VIDEO_SEEN_PX: Record<string, number> = { '9x16': 390, '4x5': 390, '1x1': 390, '16x9': 640 };

const widthOf = (bp: Breakpoint, all: Breakpoint[], video = false) => {
  if (video && VIDEO_SEEN_PX[bp.id]) return VIDEO_SEEN_PX[bp.id];
  if (bp.minWidth > 0) return bp.minWidth;
  const next = all.filter((b) => b.minWidth > 0).map((b) => b.minWidth).sort((a, b) => a - b)[0];
  return Math.min(next ?? NARROW_PX, NARROW_PX);
};

const clone = (s: Scene): Scene => JSON.parse(JSON.stringify(s));
function mapLayer(scene: Scene, id: string, fn: (l: Layer) => Layer): Scene {
  const walk = (list: Layer[]): Layer[] => list.map((l) => (l.id === id ? fn(l) : l.type === 'group' ? { ...l, layers: walk(l.layers) } : l));
  return { ...scene, layers: walk(scene.layers) };
}
const nameOf = (l: Layer) => l.name || (l.type === 'text' ? `"${l.text.split('\n')[0].slice(0, 28)}"` : l.id);
const secs = (n: number) => `${Math.round(n * 10) / 10} s`;

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');

/** Words a voice-over says, on the scene's clock (from transcribed audio tracks). */
function spokenWords(scene: Scene): Array<{ w: string; at: number }> {
  const out: Array<{ w: string; at: number }> = [];
  for (const a of scene.audio ?? []) {
    const from = a.offset ?? 0;
    const to = a.duration !== undefined ? from + a.duration : Infinity;
    for (const w of a.words ?? []) if (w.t >= from && w.t < to) out.push({ w: norm(w.w), at: a.start + (w.t - from) });
  }
  return out;
}

/**
 * Text the voice-over is saying while it is on screen: it is read by ear, so it only needs to stay up
 * while it is said (the silent reading-time rule doesn't apply).
 */
function isVoiced(text: string, from: number, to: number, spoken: Array<{ w: string; at: number }>): boolean {
  const mine = text.split(/\s+/).map(norm).filter(Boolean);
  if (!mine.length || !spoken.length) return false;
  const near = new Set(spoken.filter((s) => s.at >= from - 1 && s.at <= to + 1).map((s) => s.w));
  return mine.filter((w) => near.has(w)).length / mine.length >= 0.6;
}

export function lintScene(input: Scene): LintIssue[] {
  // A repeat is checked as the copies it plays as.
  const scene = expandRepeats(input);
  const lists: string[] = [];
  const findLists = (list: Layer[]) => list.forEach((l) => { if (l.type === 'repeat') lists.push(l.id); else if (l.type === 'group') findLists(l.layers); });
  findLists(input.layers);
  /** The list a generated copy belongs to (copies are named <list id>_<n>_<item layer id>), or null. */
  const copyOfList = (id: string) => lists.find((r) => id.startsWith(`${r}_`) && /^\d+_/.test(id.slice(r.length + 1))) ?? null;
  const issues: LintIssue[] = [];
  const video = isVideo(scene);
  const all = entries(scene);
  const spoken = spokenWords(scene);
  const bps = scene.stage.breakpoints;
  const safe = scene.stage.safeArea ?? 0.06;
  // Layers pinned to the stage (and everything in a pinned group) are placed against the stage, whose
  // shape varies, so the frame-based edge and overlap checks don't apply to them.
  const pinned = new Set<string>();
  const markPinned = (l: Layer) => { pinned.add(l.id); if (l.type === 'group') l.layers.forEach(markPinned); };
  scene.layers.forEach((l) => { if (l.pin === 'stage') markPinned(l); });

  for (const e of all) {
    const l = e.layer;

    // Two moving clips at once on one layer can fight over the same property.
    const movers = l.clips.filter(isMover).sort((a, b) => a.start - b.start);
    for (let i = 1; i < movers.length; i++) {
      const a = movers[i - 1];
      const b = movers[i];
      if (b.start < a.start + a.duration - 0.02) {
        const at = Math.round((a.start + a.duration) * 100) / 100;
        issues.push({
          id: `overlap:${l.id}:${b.id}`, severity: 'warn', layerId: l.id, clipId: b.id,
          message: `${nameOf(l)}: "${presetMeta[b.preset]?.label ?? b.preset}" starts before "${presetMeta[a.preset]?.label ?? a.preset}" ends, so they may fight over the same movement.`,
          fix: { label: `Start it at ${at} s`, apply: (s) => mapLayer(s, l.id, (x) => ({ ...x, clips: x.clips.map((c) => (c.id === b.id ? { ...c, start: at } : c)) })) },
        });
      }
    }

    if (l.type !== 'text') continue;

    // Long enough on screen to read.
    const w = window(e, scene);
    const need = readingTime(l.text);
    const up = w.leaving - w.landed;
    if (Number.isFinite(up) && up < need - 0.05 && !isVoiced(l.text, w.start, w.gone, spoken)) {
      const short = Math.round((need - up) * 100) / 100;
      const exit = w.firstOut;
      issues.push({
        id: `read:${l.id}`, severity: 'warn', layerId: l.id, clipId: exit?.id,
        message: `${nameOf(l)} is fully visible for ${secs(Math.max(0, up))}; reading it takes about ${secs(need)}.`,
        fix: e.topLevel ? {
          label: `Hold it ${secs(short)} longer`,
          apply: (s) => {
            let next = mapLayer(clone(s), l.id, (x) => ({
              ...x,
              end: typeof x.end === 'number' ? x.end + short : x.end,
              clips: x.clips.map((c) => (dirOf(c) === 'out' ? { ...c, start: c.start + short } : c)),
            }));
            const lastEnd = Math.max(0, ...next.layers.flatMap((x) => x.clips.map((c) => c.start + c.duration)));
            if (lastEnd > next.duration) next = { ...next, duration: Math.round(lastEnd * 100) / 100 };
            return next;
          },
        } : undefined,
      });
    }

    // A headline typed letter by letter reads slowly.
    for (const c of l.clips) {
      if (c.preset === 'text-typewriter' && l.style.fontSize >= 5 && dirOf(c) === 'in') {
        issues.push({
          id: `type:${l.id}:${c.id}`, severity: 'info', layerId: l.id, clipId: c.id,
          message: `${nameOf(l)}: typing a headline letter by letter reads slowly. Typing suits small text, like a search box or a prompt.`,
          fix: { label: 'Use Rise instead', apply: (s) => mapLayer(s, l.id, (x) => ({ ...x, clips: x.clips.map((k) => (k.id === c.id ? { ...k, preset: 'text-rise', ease: undefined, params: { ...presetMeta['text-rise'].defaults, by: 'words' } } : k)) })) },
        });
      }
    }

    for (const bp of bps) {
      const r = resolved(l, bp.id);
      if (r.hidden) continue;
      const bpName = bp.label ?? bp.id;

      // Big enough to read at the narrowest width this breakpoint covers.
      const seen = widthOf(bp, bps, video);
      const px = (r.style!.fontSize / 100) * seen;
      if (px < MIN_TEXT_PX - 0.5) {
        const target = Math.ceil((MIN_TEXT_PX * 100 / seen) * 10) / 10;
        issues.push({
          id: `size:${l.id}:${bp.id}`, severity: 'warn', layerId: l.id, breakpoint: bp.id,
          message: `${nameOf(l)} is about ${Math.round(px)} px tall on ${bpName} screens, hard to read.`,
          fix: {
            label: `Make it ${target} on ${bpName}`,
            apply: (s) => mapLayer(s, l.id, (x) => ({ ...x, overrides: { ...(x.overrides ?? {}), [bp.id]: { ...(x.overrides?.[bp.id] ?? {}), style: { ...(x.overrides?.[bp.id]?.style ?? {}), fontSize: target } } } })),
          },
        });
      }

      // On the stage and inside the safe area.
      if (pinned.has(l.id)) continue;
      const rect = textRect(l, bp);
      const inset = safe * 100;
      const out = rect.left < -0.5 || rect.left + rect.w > 100.5 || rect.top < -0.5 || rect.top + rect.h > 100.5;
      const unsafe = rect.left < inset - 0.5 || rect.left + rect.w > 100 - inset + 0.5 || rect.top < inset - 0.5 || rect.top + rect.h > 100 - inset + 0.5;
      if (out || unsafe) {
        issues.push({
          id: `edge:${l.id}:${bp.id}`, severity: out ? 'warn' : 'info', layerId: l.id, breakpoint: bp.id,
          message: out
            ? `${nameOf(l)} runs past the edge of the stage on ${bpName} screens (about), so part of it is cut off.`
            : `${nameOf(l)} reaches outside the safe area on ${bpName} screens (about), so it may be trimmed when the stage is shorter than its shape.`,
        });
      }
    }
  }

  // Text sitting on other text while both are on screen.
  const texts = all.filter((e) => e.layer.type === 'text');
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const A = texts[i];
      const B = texts[j];
      if (pinned.has(A.layer.id) !== pinned.has(B.layer.id)) continue;
      const wa = window(A, scene);
      const wb = window(B, scene);
      // A handoff (one leaving as the other arrives in the same place) is fine: they clash only while
      // neither has started to leave.
      if (Math.min(wa.leaving, wb.leaving) - Math.max(wa.start, wb.start) <= 0.05) continue;
      for (const bp of bps) {
        // Compare the letters' visible bodies, not their line boxes: tightly stacked lines share leading by design.
        const a = inkRect(textRect(A.layer as TextLayer, bp));
        const b = inkRect(textRect(B.layer as TextLayer, bp));
        if (a.hidden || b.hidden) continue;
        const ix = Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left);
        const iy = Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top);
        if (ix <= 0 || iy <= 0) continue;
        if ((ix * iy) / Math.min(a.w * a.h, b.w * b.h) < 0.2) continue;
        issues.push({
          id: `cover:${A.layer.id}:${B.layer.id}:${bp.id}`, severity: 'warn', layerId: B.layer.id, breakpoint: bp.id,
          message: `${nameOf(A.layer)} and ${nameOf(B.layer)} overlap on ${bp.label ?? bp.id} screens (about) while both are showing.`,
        });
        break;
      }
    }
  }

  // Long stretches where nothing moves (not for scroll-linked scenes: there the visitor sets the pace).
  const spans = all.flatMap((e) => e.layer.clips.map((c) => [e.offset + c.start, e.offset + c.start + c.duration] as [number, number])).sort((a, b) => a[0] - b[0]);
  let reach = spans.length ? spans[0][1] : 0;
  for (const [s0, s1] of spans) {
    if (scene.playback.trigger !== 'scroll' && s0 - reach > MAX_STILL) {
      const from = reach;
      const len = s0 - reach;
      const target = texts
        .filter((e) => e.topLevel && window(e, scene).landed <= from && window(e, scene).leaving >= s0)
        .sort((a, b) => (b.layer as TextLayer).style.fontSize - (a.layer as TextLayer).style.fontSize)[0];
      issues.push({
        id: `still:${Math.round(from * 10)}`, severity: 'info', layerId: target?.layer.id,
        message: `Nothing moves for ${secs(len)} (${secs(from)} to ${secs(s0)}). A slow drift keeps a held frame alive.`,
        fix: target ? {
          label: `Add a slow float to ${nameOf(target.layer)}`,
          apply: (s) => mapLayer(s, target.layer.id, (x) => ({
            ...x,
            clips: [...x.clips, { id: `drift${Math.round(from * 100)}`, preset: 'float', start: Math.round(from * 100) / 100, duration: Math.round(len * 100) / 100, params: { height: 3, cycles: 1 } }],
          })),
        } : undefined,
      });
    }
    reach = Math.max(reach, s1);
  }

  // Everything entering the same way reads as a template.
  // Craft: entrances that drag. A reveal over about 0.8 s reads as slow (counting, typing, drawing and
  // camera-like moves are meant to take time, so they are left out).
  const SLOW_OK = new Set(['text-typewriter', 'text-count', 'text-scramble', 'keyframes', 'scroll', 'progress', 'follow-path', 'draw', 'code', 'morph', 'march', 'react']);
  const slow = all.filter((e) => !copyOfList(e.layer.id)).flatMap((e) => e.layer.clips
    .filter((c) => dirOf(c) === 'in' && !SLOW_OK.has(c.preset) && ['text', 'reveal'].includes(presetMeta[c.preset]?.category ?? '') && c.duration > 1.1)
    .map((c) => ({ l: e.layer, c })));
  if (slow.length) {
    issues.push({
      id: 'craft:slow', severity: 'info', layerId: slow[0].l.id, clipId: slow[0].c.id,
      message: `${slow.length === 1 ? `${nameOf(slow[0].l)} enters` : `${slow.length} layers enter`} over more than a second. Entrances under about 0.8 s feel deliberate; long ones read as slow.`,
      fix: { label: 'Make them 0.8 s', apply: (s) => slow.reduce((acc, { l, c }) => mapLayer(acc, l.id, (x) => ({ ...x, clips: x.clips.map((k) => (k.id === c.id ? { ...k, duration: 0.8 } : k)) })), s) },
    });
  }
  // Craft: too many kinds of transition make a scene feel like a template sampler.
  const kinds = new Set(all.flatMap((e) => e.layer.clips.filter((c) => presetMeta[c.preset]?.category === 'transition').map((c) => c.preset)));
  if (kinds.size > 3) issues.push({ id: 'craft:transitions', severity: 'info', message: `${kinds.size} different transitions. Two or three styles, used consistently, make a scene feel designed.` });
  // Craft: two acts in a row that arrive the same way with the same layout read as a repeat.
  const acts = scene.layers.filter((l) => l.type === 'group').sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as Array<Extract<Layer, { type: 'group' }>>;
  const shape = (g: Extract<Layer, { type: 'group' }>) => {
    const entry = [...g.clips, ...g.layers.flatMap((c) => c.clips)].filter((c) => dirOf(c) === 'in').sort((a, b) => a.start - b.start)[0]?.preset ?? '';
    return `${entry}|${g.layers.map((c) => c.type).sort().join(',')}`;
  };
  for (let i = 1; i < acts.length; i++) {
    if (shape(acts[i]) === shape(acts[i - 1]) && acts[i].layers.length > 1) {
      issues.push({ id: `craft:same-act:${acts[i].id}`, severity: 'info', layerId: acts[i].id, message: `${nameOf(acts[i])} arrives the same way, with the same layout, as the act before it. Change its entrance or its layout so each act feels new.` });
    }
  }

  // A list's copies enter alike on purpose (staggered), so they are left out.
  const entrances = all.filter((e) => !copyOfList(e.layer.id)).map((e) => e.layer.clips.filter((c) => dirOf(c) === 'in').sort((a, b) => a.start - b.start)[0]).filter(Boolean) as Clip[];
  const counts = new Map<string, number>();
  for (const c of entrances) {
    const key = `${c.preset}|${c.duration}|${JSON.stringify(c.params ?? {})}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const [key, n] of counts) {
    if (n >= 3) {
      const preset = key.split('|')[0];
      issues.push({ id: `same:${preset}`, severity: 'info', message: `${n} layers enter with identical "${presetMeta[preset]?.label ?? preset}" clips. Varying the timing or the preset gives the scene a lead and a rhythm.` });
    }
  }

  if (video) issues.push(...videoChecks(scene, all));

  // Issues on a list's copies belong to the list: reported once (for its first copy), on the list itself,
  // with no fix (the copies are generated; the fix goes in the list's item).
  const out: LintIssue[] = [];
  const seen = new Set<string>();
  for (const issue of issues) {
    const list = issue.layerId ? copyOfList(issue.layerId) : null;
    if (!list) { out.push(issue); continue; }
    const key = `${list}|${issue.breakpoint ?? ''}|${issue.message.replace(/"[^"]*"/, '')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...issue, id: `${issue.id}:list`, layerId: list, clipId: undefined, fix: undefined, message: `In the list: ${issue.message}` });
  }
  return out;
}

/* ------------------------------------------------------------------ video mode */

/** The way a clip moves things across the frame: [x, y] (1 = right / down), or null when it has no side. */
function motionOf(c: Clip): [number, number] | null {
  const meta = presetMeta[c.preset];
  if (!meta || !meta.fields.some((f) => f.key === 'from' && f.type === 'select')) return null;
  const from = String(c.params?.from ?? meta.defaults.from ?? '');
  const v: Record<string, [number, number]> = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] };
  const side = v[from];
  if (!side) return null;
  const out = dirOf(c) === 'out';
  // Arriving from a side moves away from it. Leaving: a slide goes towards its side; a whip pan swings away
  // from the side the next shot arrives from (its pair keeps the same "from").
  if (!out || c.preset === 'tr-whip') return [-side[0], -side[1]];
  return side;
}
const dirName = (m: [number, number]) => (m[0] < 0 ? 'left' : m[0] > 0 ? 'right' : m[1] < 0 ? 'up' : 'down');

/** Video checks: the hook, the apps' covered areas, captions, length limits, looping and every cut. */
function videoChecks(scene: Scene, all: Entry[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const v = scene.video!;
  const texts = all.filter((e) => e.layer.type === 'text');

  // The hook: the first words have landed within two seconds (viewers decide that fast).
  const firstWords = Math.min(Infinity, ...texts.map((e) => window(e, scene).landed));
  if (texts.length && firstWords > 2) {
    issues.push({ id: 'video:hook', severity: 'warn', message: `The first words land at ${secs(firstWords)}. A video has about two seconds to say why to keep watching: put the hook on screen by then.` });
  }

  // Covered areas: nothing worth reading under the app's buttons and captions.
  if (v.platform && v.platform !== 'none') {
    for (const bp of scene.stage.breakpoints) {
      const zones = zonesFor(v.platform, bp.id as VideoFormat);
      if (!zones.length) continue;
      for (const e of all) {
        const l = e.layer;
        let rect: { left: number; top: number; w: number; h: number } | null = null;
        if (l.type === 'text') {
          const r = textRect(l, bp);
          if (r.hidden) continue;
          rect = inkRect(r);
        } else if (l.type === 'captions') {
          const r = resolved(l, bp.id);
          const w = r.box.w ?? 80;
          const h = (l.style.fontSize * 2.4) * (bp.aspect[0] / bp.aspect[1]);
          const [ax, ay] = anchorFactors(r.box.anchor);
          rect = { left: r.box.x - w * ax, top: r.box.y - h * ay, w, h };
        }
        if (!rect) continue;
        const box = rect;
        const hit = zones.find((z) => box.left < z.x + z.w && box.left + box.w > z.x && box.top < z.y + z.h && box.top + box.h > z.y);
        if (hit) {
          issues.push({
            id: `video:zone:${l.id}:${bp.id}`, severity: 'warn', layerId: l.id, breakpoint: bp.id,
            message: `${nameOf(l)} sits under ${PLATFORM_LIMITS[v.platform]?.label ?? v.platform}'s ${hit.label.toLowerCase()} on ${bp.label ?? bp.id}. Move it inside the clear area.`,
          });
        }
      }
    }
  }

  // Captions: most people watch with the sound off.
  const voice = (scene.audio ?? []).find((a) => a.role === 'voice');
  const hasCaptions = all.some((e) => e.layer.type === 'captions');
  if (voice && !hasCaptions) {
    issues.push({
      id: 'video:captions', severity: 'warn',
      message: 'There is a voice-over but no captions. Most people watch with the sound off: add captions so the words are seen.',
      fix: voice.words?.length ? {
        label: 'Add captions',
        apply: (s) => ({ ...s, layers: [...s.layers, { id: 'captions', type: 'captions', name: 'Captions', box: { x: 50, y: 70, w: 80, anchor: 'center' }, style: { fontSize: 6, fontWeight: 800, color: '#ffffff' }, mode: 'karaoke', clips: [] } as unknown as Layer] }),
      } : undefined,
    });
  }

  // Length: what the platform takes, and what works best there.
  const lim = v.platform ? PLATFORM_LIMITS[v.platform] : undefined;
  if (lim && scene.duration > lim.max) issues.push({ id: 'video:length', severity: 'warn', message: `${secs(scene.duration)} is longer than ${lim.label} takes (${secs(lim.max)}).` });
  else if (lim && scene.duration > lim.best * 1.5) issues.push({ id: 'video:length', severity: 'info', message: `${secs(scene.duration)} is long for ${lim.label}: pieces there do best under about ${secs(lim.best)}.` });

  // A video plays once.
  if (scene.playback.loop) {
    issues.push({ id: 'video:loop', severity: 'info', message: 'The scene loops. A video plays once (the app loops it): turn looping off so the export ends where the scene ends.', fix: { label: 'Play once', apply: (s) => ({ ...s, playback: { ...s.playback, loop: false, loopFrom: undefined } }) } });
  }

  // Idle floating does not tell the story: every second should.
  const floats = all.flatMap((e) => e.layer.clips.filter((c) => c.preset === 'float' && c.duration > 2).map((c) => ({ l: e.layer, c })));
  if (floats.length) {
    issues.push({ id: 'video:idle', severity: 'info', layerId: floats[0].l.id, clipId: floats[0].c.id, message: `${floats.length === 1 ? `${nameOf(floats[0].l)} floats` : `${floats.length} layers float`} for more than two seconds. In a video every second should move the story on: cut sooner, or show the next thing.` });
  }

  // Every cut between acts: no empty frame, and the next shot moving the way the last one left.
  const acts = scene.layers.filter((l) => l.type === 'group').sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as Array<Extract<Layer, { type: 'group' }>>;
  const dirs = new Map<string, number>();
  for (let i = 1; i < acts.length; i++) {
    const a = acts[i - 1], b = acts[i];
    const aStart = a.start ?? 0, bStart = b.start ?? 0;
    // Clips on the act and on its contents run on the act's own clock (0 = its start).
    const aOuts = [...a.clips, ...a.layers.flatMap((k) => k.clips)].filter((c) => dirOf(c) === 'out');
    const aGone = aOuts.length ? aStart + Math.max(...aOuts.map((c) => c.start + c.duration)) : (typeof a.end === 'number' ? a.end : aStart + groupDuration(a));
    const gap = bStart - aGone;
    if (gap > 0.15) {
      issues.push({
        id: `video:gap:${b.id}`, severity: 'warn', layerId: b.id,
        message: `The frame is empty for ${secs(gap)} before ${nameOf(b)}. Cut on the movement: start the next shot as the last one leaves.`,
        fix: { label: `Start it at ${secs(aGone)}`, apply: (s) => mapLayer(s, b.id, (x) => ({ ...x, start: Math.round(aGone * 100) / 100 })) },
      });
    }
    const exit = aOuts.map((c) => ({ c, m: motionOf(c) })).find((x) => x.m);
    const bIns = [...b.clips, ...b.layers.flatMap((k) => k.clips)].filter((c) => dirOf(c) === 'in').sort((x, y) => x.start - y.start);
    const entry = bIns.map((c) => ({ c, m: motionOf(c) })).find((x) => x.m);
    if (exit?.m) dirs.set(dirName(exit.m), (dirs.get(dirName(exit.m)) ?? 0) + 1);
    if (exit?.m && entry?.m && (exit.m[0] !== entry.m[0] || exit.m[1] !== entry.m[1])) {
      const em = exit.m;
      const want = em[0] < 0 ? 'right' : em[0] > 0 ? 'left' : em[1] < 0 ? 'bottom' : 'top';
      const owner = b.clips.includes(entry.c) ? b.id : b.layers.find((k) => k.clips.includes(entry.c))!.id;
      const clipId = entry.c.id;
      issues.push({
        id: `video:cut:${b.id}`, severity: 'warn', layerId: owner, clipId,
        message: `At the cut into ${nameOf(b)}, the last shot leaves moving ${dirName(em)} but the next arrives moving ${dirName(entry.m)}. Keep the movement going the same way so the cut feels like one camera move.`,
        fix: { label: `Arrive from the ${want}`, apply: (s) => mapLayer(s, owner, (x) => ({ ...x, clips: x.clips.map((c) => (c.id === clipId ? { ...c, params: { ...(c.params ?? {}), from: want } } : c)) })) },
      });
    }
  }
  if (dirs.size > 2) {
    issues.push({ id: 'video:directions', severity: 'info', message: `The cuts move ${[...dirs.keys()].join(', ')}. Keep one main direction for the whole video and save the others for moments that mean something (going back, a reveal).` });
  }
  return issues;
}
