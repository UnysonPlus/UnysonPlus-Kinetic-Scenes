import type { Clip, CursorLayer, Layer, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';

/**
 * Build with cursors: a team of coloured, named cursors builds the scene's opening in front of you, as collaborators
 * do in a shared design file. Each cursor takes the next free layer, top to bottom: it moves to the layer's top-left
 * corner and drags out its box (Build: draw: an outline with a live W x H badge over a grey placeholder), the layer
 * sweeps in, and a text layer is typed into its box with an I-beam. When everything is built the cursors leave and the
 * rest of the scene plays on, later by the length of the build.
 *
 * Everything it writes is an ordinary layer or clip (cursor layers and clips whose ids start "swarm-"), so it plays,
 * scrubs and exports the same every time and can be edited by hand. The same scene and options always give the same
 * result. The kit's studio-swarm.mjs is generated from this file (esbuild) for agents; keep them in step.
 */

export interface SwarmOptions {
  /** How many cursors (1-8). 0 or unset: 3 to 6, by how much there is to build. */
  cursors?: number;
  /** When the build starts, in seconds. Layers and clips from here on move later by the build's length. */
  at?: number;
  /** 0.5 (slow) to 3 (fast). */
  speed?: number;
  /** Names for the name tags, in order. An empty list: no name tags. */
  names?: string[];
  /** Colours for the cursors, in order. */
  colors?: string[];
  /** Add soft clicks and typing sounds. */
  sound?: boolean;
  /** At most this many layers are built (the rest keep their own entrances). */
  maxLayers?: number;
}

export const SWARM_DEFAULTS = {
  cursors: 0, at: 0, speed: 1, sound: true, maxLayers: 30,
  names: ['Ana', 'Kai', 'Mia', 'Leo', 'Zoe', 'Sam', 'Ivy', 'Max'],
  colors: ['#00b295', '#ff4d5e', '#4c7dff', '#f5a623', '#a855f7', '#0ea5e9', '#f97316', '#ec4899'],
};

export interface SwarmResult { scene: Scene; layers: number; cursors: number; seconds: number }

const PREFIX = 'swarm-';
const r2 = (v: number) => Math.round(v * 100) / 100;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Layer types that can be drawn as a box. */
const BUILDABLE = new Set(['text', 'shape', 'image', 'video', 'model', 'group', 'path', 'diagram', 'code', 'repeat', 'lottie']);

function stageAspect(scene: Scene): number {
  const a = scene.stage.breakpoints[0]?.aspect ?? [16, 9];
  return a[0] / a[1];
}

/** The layer's top-left corner and size in % of the stage (width % across, height % down), as near as the box says. */
function rectOf(layer: Layer, aspect: number): { x: number; y: number; w: number; h: number } | null {
  const b = layer.box;
  if (!b) return null;
  let w = typeof b.w === 'number' ? b.w : 0;
  // Heights in % of the stage's height: a ratio is width / height in pixels.
  let h = typeof b.ratio === 'number' && b.ratio > 0 ? (w / b.ratio) * aspect : typeof b.h === 'number' ? b.h : 0;
  if (layer.type === 'text') {
    const size = layer.style?.fontSize ?? 4;
    const lines = layer.text.split('\n');
    const longest = Math.max(...lines.map((l) => l.replace(/\*/g, '').length));
    if (!w) w = Math.min(100, Math.max(size, longest * size * 0.55));
    if (!h) h = size * 1.25 * lines.length * aspect;
  }
  if (!w) w = 20;
  if (!h) h = 12;
  const a = b.anchor ?? 'center';
  const x = b.x - (/left/.test(a) ? 0 : /right/.test(a) ? w : w / 2);
  const y = b.y - (/top/.test(a) ? 0 : /bottom/.test(a) ? h : h / 2);
  return { x, y, w, h };
}

/** Whether a clip is an entrance (the build replaces those at the scene's opening). */
function isEntrance(c: Clip): boolean {
  const m = presetMeta[c.preset];
  if (!m) return false;
  const dir = (c.params?.direction ?? (m.defaults as Record<string, unknown> | undefined)?.direction) as string | undefined;
  if (dir === 'out') return false;
  if (dir === 'in') return true;
  return m.category === 'reveal' || m.category === 'transition';
}

/**
 * Moves what happens from `from` on later by `by`. A layer already on the stage at `from` keeps its start (it must be
 * there to be built). A group plays its children on its own clock, from its start: when the group itself stays, its
 * children's times move instead, by the same amount in its own time.
 */
function shiftLayer(layer: Layer, from: number, by: number): Layer {
  const out = { ...layer } as Layer;
  const startStays = !(typeof out.start === 'number' && out.start > from);
  if (!startStays) out.start = r2((out.start as number) + by);
  if (typeof out.end === 'number' && out.end > from) out.end = r2(out.end + by);
  out.clips = layer.clips.map((c) => (c.start >= from ? { ...c, start: r2(c.start + by) } : c));
  if (out.type === 'group' && startStays) {
    const local = Math.max(0, from - (out.start ?? 0));
    out.layers = out.layers.map((child) => shiftLayer(child, local, by));
    if (typeof out.duration === 'number') out.duration = r2(out.duration + by);
  }
  return out;
}

export function buildWithCursors(scene: Scene, options: SwarmOptions = {}): SwarmResult {
  if (scene.layers.some((l) => l.id.startsWith(PREFIX))) {
    throw new Error('This scene already has a cursor build. Undo it (or start from the scene before it) to build again.');
  }
  const o = { ...SWARM_DEFAULTS, ...options };
  const at = Math.max(0, o.at ?? 0);
  const speed = clamp(o.speed || 1, 0.5, 3);
  const aspect = stageAspect(scene);
  const portrait = aspect < 1;
  const k = 1 / speed;

  // What is on screen at the opening: top-level layers that are there from the start (or come in during the first
  // two seconds through an entrance), drawable, and not invisible.
  const opening = (l: Layer) => {
    if ((l.start ?? 0) > at + 0.05 || (l.end !== undefined && l.end <= at + 0.5)) return false;
    // A layer whose first clip is an entrance shows up when that entrance plays: only an early one is the opening.
    const first = [...l.clips].sort((x, y) => x.start - y.start)[0];
    return !first || !isEntrance(first) || first.start <= at + 2;
  };
  const targets = scene.layers
    .filter((l) => BUILDABLE.has(l.type) && opening(l) && (l.opacity ?? 1) > 0.02 && !l.pin)
    .map((l) => ({ layer: l, rect: rectOf(l, aspect) }))
    .filter((t): t is { layer: Layer; rect: NonNullable<ReturnType<typeof rectOf>> } => !!t.rect)
    // Big layers (backgrounds, panels) first, then top to bottom, left to right: a page is built from the outside in.
    .sort((a, b) => {
      const big = (t: typeof a) => (t.rect.w * t.rect.h >= 2500 ? 0 : 1);
      return big(a) - big(b) || a.rect.y - b.rect.y || a.rect.x - b.rect.x;
    })
    .slice(0, Math.max(1, o.maxLayers));
  if (!targets.length) throw new Error('Nothing to build: no layers are on the stage at that moment.');

  const count = o.cursors && o.cursors > 0 ? clamp(Math.round(o.cursors), 1, 8) : clamp(Math.round(targets.length / 3), 3, 6);
  const names = o.names ?? SWARM_DEFAULTS.names;
  const colors = o.colors?.length ? o.colors : SWARM_DEFAULTS.colors;
  const cw = portrait ? 5.4 : 2.6;

  // Each cursor: where it is, when it is free, and its clips.
  const cursors = Array.from({ length: count }, (_, i) => {
    // They come in from below and the sides, spread out.
    const px = count === 1 ? 50 : -6 + (112 * i) / (count - 1);
    const py = i % 2 ? 112 : 106;
    return { i, free: at + 0.08 * i, px, py, clips: [] as Clip[], first: true };
  });

  const built: Record<string, Clip[]> = {};
  let seq = 0;
  const id = () => `${PREFIX}${++seq}`;
  let end = at;

  for (const { layer, rect } of targets) {
    const cur = cursors.reduce((a, b) => (b.free < a.free ? b : a));
    const color = colors[cur.i % colors.length];
    const move = r2((cur.first ? 0.8 : 0.45) * k);
    const area = (rect.w * rect.h) / 10000;
    const drag = r2(clamp(0.38 + area * 0.9, 0.4, 1.05) * k);
    const s = r2(cur.free);
    cur.first = false;
    cur.clips.push({ id: id(), preset: 'cursor-move', start: s, duration: move, ease: 'power3.inOut', params: { to: layer.id, x: 0, y: 0 } });
    const d0 = r2(s + move);
    cur.clips.push({ id: id(), preset: 'cursor-drag', start: d0, duration: drag, ease: 'power2.inOut', params: { to: layer.id, x: 100, y: 100 },
      ...(o.sound ? { sound: { name: 'click', volume: 0.3 } } : {}) });
    const clips: Clip[] = [];
    if (layer.type === 'text') {
      const hold = r2(0.22 * k);
      clips.push({ id: id(), preset: 'build-draw', start: d0, duration: r2(drag + hold), ease: 'none',
        params: { color, draw: r2(drag / (drag + hold)), reveal: 'none', fill: 'none', badge: true } });
      const chars = layer.text.replace(/\*/g, '').length;
      const type = r2(clamp(chars * 0.045, 0.35, 2.4) * k);
      const t0 = r2(d0 + drag + 0.12 * k);
      // The I-beam waits at the start of the first line, where the typing begins.
      const firstLine = r2(50 / Math.max(1, layer.text.split('\n').length));
      cur.clips.push({ id: id(), preset: 'cursor-move', start: r2(d0 + drag), duration: r2(0.12 * k), ease: 'power2.out', params: { to: layer.id, x: 0, y: firstLine } });
      cur.clips.push({ id: id(), preset: 'cursor-type', start: t0, duration: type, ease: 'none',
        ...(o.sound ? { sound: { name: 'typing', volume: 0.35 } } : {}) });
      clips.push({ id: id(), preset: 'text-typewriter', start: t0, duration: type, ease: 'none', params: { direction: 'in', caret: false } });
      cur.free = r2(t0 + type + 0.05);
    } else {
      const reveal = r2(0.42 * k);
      clips.push({ id: id(), preset: 'build-draw', start: d0, duration: r2(drag + reveal), ease: 'none',
        params: { color, draw: r2(drag / (drag + reveal)), reveal: 'sweep', fill: 'grey', badge: true } });
      // The cursor lets go and moves on while the layer sweeps in.
      cur.free = r2(d0 + drag + 0.06);
    }
    built[layer.id] = clips;
    end = Math.max(end, cur.free, ...clips.map((c) => c.start + c.duration));
  }

  // The cursors leave together, each out the nearest side, a little apart.
  const leave = r2(end + 0.15);
  cursors.forEach((c, i) => {
    c.clips.push({ id: id(), preset: 'cursor-move', start: r2(leave + 0.06 * i), duration: r2(0.7 * k), ease: 'power2.in', params: { px: c.px < 50 ? -12 : 112, py: 30 + ((i * 37) % 60) } });
  });
  const length = r2(leave + 0.7 * k + 0.06 * count - at);

  // The rest of the scene moves later by the build's length; each built layer loses the entrance the build replaces.
  const shifted = scene.layers.map((l) => {
    const moved = shiftLayer(l, at, length);
    const mine = built[l.id];
    if (!mine) return moved;
    const keep = moved.clips.filter((c) => !(isEntrance(c) && c.start >= at + length - 0.01 && c.start <= at + length + 2.5));
    return { ...moved, clips: [...mine, ...keep].sort((a, b) => a.start - b.start) } as Layer;
  });
  const cursorLayers: CursorLayer[] = cursors.map((c) => ({
    id: `${PREFIX}cursor-${c.i + 1}`, type: 'cursor', name: `Cursor ${names[c.i] ?? c.i + 1}`,
    box: { x: r2(c.px), y: r2(c.py), w: cw, ratio: 0.7 },
    color: colors[c.i % colors.length], ...(names.length ? { label: names[c.i % names.length] } : {}),
    clips: c.clips,
  }));

  const next: Scene = {
    ...scene,
    duration: r2(scene.duration + length),
    layers: [...shifted, ...cursorLayers],
    ...(scene.markers ? { markers: scene.markers.map((m) => (m.t >= at ? { ...m, t: r2(m.t + length) } : m)) } : {}),
    ...(scene.audio ? { audio: scene.audio.map((a) => (a.start >= at ? { ...a, start: r2(a.start + length) } : a)) } : {}),
    ...(scene.camera ? { camera: { ...scene.camera, keys: scene.camera.keys.map((key) => (key.t > at ? { ...key, t: r2(key.t + length) } : key)) } } : {}),
    ...(typeof scene.playback?.posterTime === 'number' && scene.playback.posterTime >= at ? { playback: { ...scene.playback, posterTime: r2(scene.playback.posterTime + length) } } : {}),
    ...(scene.steps ? { steps: scene.steps.map((st) => (typeof st.at === 'number' && st.at >= at ? { ...st, at: r2(st.at + length) } : st)) } : {}),
  };
  return { scene: next, layers: targets.length, cursors: count, seconds: length };
}
