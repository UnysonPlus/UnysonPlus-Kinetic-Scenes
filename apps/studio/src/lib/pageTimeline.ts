import type { Clip, Layer, Scene, ShapeLayer } from '@unysonplus/scene-player/types';
import { SCENE_FORMAT } from '@unysonplus/scene-player/types';
import { easeFunction } from '@unysonplus/scene-player/eases';
import { clipEase, framesOf, isKeyframes, PROPS, type Keyframe } from './keyframes';

/**
 * Page timelines (Animation Creator, beta): motion for elements of a real Unyson+ page, made here and played on the
 * page by the Animation Engine's visitor runtime (upw-timeline.js).
 *
 * While one is being edited it is held as a scene: each track is a layer (a box where its element sits on the page)
 * with one Keyframes clip, so the timeline, the keyframe editor and the curve editor all work on it unchanged.
 * Every change is turned back into a timeline and sent to the page, with each curve baked into CSS linear(), so the
 * runtime needs no curve library and plays exactly what the Studio shows.
 */

export type TriggerType = 'load' | 'in-view' | 'hover' | 'click';

export interface PageTrigger {
  type: TriggerType;
  /** The element that starts it (hover, click, in view); empty = the first track's element. */
  target?: string;
  /** In view: play once (default) or every time it comes into view. */
  once?: boolean;
  /** Hover: on leaving, play back to the start (default) or stay. */
  leave?: 'reverse' | 'stay';
  /** Click: each click plays it forward, then back. */
  toggle?: boolean;
  /** In view: how much of the element must show (0–1, default 0.25). */
  threshold?: number;
  /** Load and in view: wait this many seconds first. */
  delay?: number;
}

export interface PageFrame extends Keyframe {
  /** The curve into this keyframe as CSS (baked from `ease`, or from the track's own ease). */
  e?: string;
}

export interface PageTrack {
  /** The element's builder key. */
  target: string;
  /** Its name in the editor, for people reading the data. */
  label?: string;
  frames: PageFrame[];
  /** The curve used by keyframes that set none (a Kinetic Scenes curve name). */
  ease?: string;
}

export interface PageTimeline {
  id: string;
  name: string;
  duration: number;
  trigger: PageTrigger;
  /** Extra plays; -1 = forever. */
  repeat?: number;
  /** Repeats go back and forth. */
  yoyo?: boolean;
  tracks: PageTrack[];
}

/** A page element with its box on the page (CSS pixels), as the Live Editor sends it. */
export interface BoxedElement { id: string; label: string; text: string; box?: [number, number, number, number] | null }

export const TRIGGERS: Array<{ value: TriggerType; label: string; hint: string }> = [
  { value: 'load', label: 'Page load', hint: 'Plays when the page opens' },
  { value: 'in-view', label: 'In view', hint: 'Plays when its element scrolls into view' },
  { value: 'hover', label: 'Hover', hint: 'Plays while the pointer is over its element, and back when it leaves' },
  { value: 'click', label: 'Click', hint: 'Plays when its element is clicked' },
];

const LAYER_PREFIX = 'el-';
export const layerIdFor = (target: string) => LAYER_PREFIX + target;
export const targetOf = (layerId: string | null | undefined) => (layerId && layerId.startsWith(LAYER_PREFIX) ? layerId.slice(LAYER_PREFIX.length) : '');

const r3 = (v: number) => Math.round(v * 1000) / 1000;
const BAKED = new Map<string, string>();

/** A curve as CSS linear(): 24 even steps, enough for springs and overshoots to read right. */
export function easeToCss(name: string | undefined): string {
  if (!name || name === 'none' || name === 'linear') return 'linear';
  const hit = BAKED.get(name);
  if (hit) return hit;
  const f = easeFunction(name);
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) pts.push(String(r3(f(i / 24))));
  const css = `linear(${pts.join(', ')})`;
  BAKED.set(name, css);
  return css;
}

export const newTimelineId = () => `tl-${Math.random().toString(36).slice(2, 8)}`;

export function newTimeline(name = 'Page timeline'): PageTimeline {
  return { id: newTimelineId(), name, duration: 2, trigger: { type: 'load' }, tracks: [] };
}

/** A first move for a new track, so it does something at once: rises 30% and fades in. */
export function starterFrames(): PageFrame[] {
  return [{ t: 0, y: 30, opacity: 0 }, { t: 0.6, y: 0, opacity: 1, ease: 'softLand' }];
}

/** Where on the stage (16:9) each box goes: the area round all the tracked elements, fitted with a margin. */
function stageBoxes(boxes: Array<[number, number, number, number]>): (b: [number, number, number, number]) => { x: number; y: number; w: number; h: number } {
  if (!boxes.length) return () => ({ x: 40, y: 40, w: 20, h: 20 });
  let x0 = Math.min(...boxes.map((b) => b[0]));
  let y0 = Math.min(...boxes.map((b) => b[1]));
  let x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
  let y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  // At least a screen's worth of the page (1280 x 720), so one small element isn't blown up to fill the stage.
  const grow = (a: number, b: number, min: number) => { const d = Math.max(0, min - (b - a)) / 2; return [a - d, b + d]; };
  [x0, x1] = grow(x0, x1, 1280);
  [y0, y1] = grow(y0, y1, 720);
  const W = 1600, H = 900, pad = 0.08;
  const s = Math.min((W * (1 - 2 * pad)) / Math.max(1, x1 - x0), (H * (1 - 2 * pad)) / Math.max(1, y1 - y0));
  const ox = (W - (x1 - x0) * s) / 2, oy = (H - (y1 - y0) * s) / 2;
  return (b) => ({
    x: r3(((ox + (b[0] - x0) * s) / W) * 100),
    y: r3(((oy + (b[1] - y0) * s) / H) * 100),
    w: Math.max(1, r3(((b[2] * s) / W) * 100)),
    h: Math.max(1, r3(((b[3] * s) / H) * 100)),
  });
}

const PALETTE = ['#2AD38B', '#5BB8FF', '#FFB547', '#FF7A9A', '#B58CFF', '#4FE0D6'];

/** The scene that holds a timeline while it is edited. */
export function sceneFromTimeline(tl: PageTimeline, elements: BoxedElement[]): Scene {
  const byId = new Map(elements.map((e) => [e.id, e]));
  const boxed = tl.tracks.map((tr) => byId.get(tr.target)?.box).filter((b): b is [number, number, number, number] => !!b);
  const place = stageBoxes(boxed);
  const layers: Layer[] = tl.tracks.map((tr, i) => {
    const el = byId.get(tr.target);
    const b = el?.box ? place(el.box) : { x: 10 + (i % 4) * 22, y: 15 + Math.floor(i / 4) * 25, w: 18, h: 18 };
    const color = PALETTE[i % PALETTE.length];
    const clip: Clip = {
      id: `${layerIdFor(tr.target)}-kf`, preset: 'keyframes', start: 0, duration: tl.duration,
      ...(tr.ease ? { ease: tr.ease } : {}),
      params: { frames: tr.frames.map(({ e: _e, ...f }) => f) },
    };
    const layer: ShapeLayer = {
      id: layerIdFor(tr.target), type: 'shape', shape: 'rect',
      name: (el?.label || tr.label || 'Element') + (el?.text ? ` · ${el.text}` : ''),
      box: { x: b.x, y: b.y, w: b.w, h: b.h, anchor: 'top-left' },
      fill: `${color}33`, stroke: color, strokeWidth: 0.25, radius: 0.6,
      clips: [clip],
    };
    return layer;
  });
  return {
    format: SCENE_FORMAT, version: 1, title: tl.name, duration: tl.duration,
    stage: {
      breakpoints: [{ id: 'desktop', label: 'Page', minWidth: 0, aspect: [16, 9] }],
      heightMode: 'ratio',
      background: 'linear-gradient(180deg, #14181d, #0e1115)',
    },
    playback: { trigger: 'manual', loop: false },
    layers,
  } as Scene;
}

/** The timeline a scene holds (keeps the timeline's own settings: name, trigger, repeat). */
export function timelineFromScene(scene: Scene, base: PageTimeline): PageTimeline {
  const tracks: PageTrack[] = [];
  for (const layer of scene.layers) {
    const target = targetOf(layer.id);
    if (!target) continue;
    const kfClips = layer.clips.filter(isKeyframes);
    const frames: PageFrame[] = [];
    let ease: string | undefined;
    for (const c of kfClips) {
      const fe = clipEase(c);
      if (!ease && c.ease) ease = c.ease;
      for (const f of framesOf(c)) {
        const out: PageFrame = { t: r3(f.t + c.start) };
        for (const p of PROPS) if (typeof f[p.key] === 'number') out[p.key] = f[p.key];
        if (f.ease) out.ease = f.ease;
        out.e = easeToCss(f.ease ?? fe);
        frames.push(out);
      }
    }
    frames.sort((a, b) => a.t - b.t);
    const old = base.tracks.find((t) => t.target === target);
    tracks.push({ target, label: old?.label || layer.name?.split(' · ')[0], frames, ...(ease ? { ease } : {}) });
  }
  return { ...base, duration: r3(scene.duration), tracks };
}

/** Adds a track for an element (a starter move), or returns the scene unchanged if it has one. */
export function addTrack(scene: Scene, tl: PageTimeline, el: BoxedElement, elements: BoxedElement[]): { scene: Scene; timeline: PageTimeline } {
  const cur = timelineFromScene(scene, tl);
  if (cur.tracks.some((t) => t.target === el.id)) return { scene, timeline: cur };
  const next: PageTimeline = { ...cur, tracks: [...cur.tracks, { target: el.id, label: el.label, frames: starterFrames() }] };
  if (next.duration < 0.6) next.duration = 1;
  return { scene: sceneFromTimeline(next, elements), timeline: next };
}

/** Only what the runtime and the page need: settings, and per keyframe its time, values and baked curve. */
export function forPage(tl: PageTimeline): PageTimeline {
  return {
    id: tl.id, name: tl.name, duration: tl.duration, trigger: tl.trigger,
    ...(tl.repeat ? { repeat: tl.repeat } : {}), ...(tl.yoyo ? { yoyo: true } : {}),
    tracks: tl.tracks.map((t) => ({ target: t.target, ...(t.label ? { label: t.label } : {}), ...(t.ease ? { ease: t.ease } : {}), frames: t.frames })),
  };
}

/** A timeline from the page, checked (untrusted data from another window). */
export function cleanTimeline(raw: unknown): PageTimeline | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max = 120) => (typeof v === 'string' ? v.slice(0, max) : '');
  const id = str(r.id, 40);
  if (!id) return null;
  const trig = (r.trigger && typeof r.trigger === 'object' ? r.trigger : {}) as Record<string, unknown>;
  const type = TRIGGERS.some((t) => t.value === trig.type) ? (trig.type as TriggerType) : 'load';
  const tracks = (Array.isArray(r.tracks) ? r.tracks : []).slice(0, 200).map((t): PageTrack | null => {
    if (!t || typeof t !== 'object') return null;
    const tt = t as Record<string, unknown>;
    const target = str(tt.target, 80);
    if (!target) return null;
    const frames = (Array.isArray(tt.frames) ? tt.frames : []).slice(0, 400).filter((f) => f && typeof f === 'object' && typeof (f as PageFrame).t === 'number').map((f) => {
      const ff = f as PageFrame;
      const out: PageFrame = { t: Math.max(0, Number(ff.t) || 0) };
      for (const p of PROPS) if (typeof ff[p.key] === 'number' && isFinite(ff[p.key] as number)) out[p.key] = ff[p.key];
      if (typeof ff.ease === 'string') out.ease = ff.ease.slice(0, 80);
      return out;
    });
    return { target, label: str(tt.label, 60) || undefined, frames, ...(typeof tt.ease === 'string' ? { ease: tt.ease.slice(0, 80) } : {}) };
  }).filter((t): t is PageTrack => !!t);
  return {
    id, name: str(r.name) || 'Page timeline',
    duration: Math.max(0.1, Math.min(120, Number(r.duration) || 2)),
    trigger: {
      type,
      ...(str(trig.target, 80) ? { target: str(trig.target, 80) } : {}),
      ...(trig.once === false ? { once: false } : {}),
      ...(trig.leave === 'stay' ? { leave: 'stay' as const } : {}),
      ...(trig.toggle ? { toggle: true } : {}),
      ...(typeof trig.threshold === 'number' ? { threshold: Math.max(0, Math.min(1, trig.threshold)) } : {}),
      ...(typeof trig.delay === 'number' && trig.delay > 0 ? { delay: Math.min(30, trig.delay) } : {}),
    },
    ...(Number(r.repeat) ? { repeat: Math.max(-1, Math.min(100, Math.round(Number(r.repeat)))) } : {}),
    ...(r.yoyo ? { yoyo: true } : {}),
    tracks,
  };
}
