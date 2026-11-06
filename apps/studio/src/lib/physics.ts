import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';

/**
 * Drop with physics: the chosen layers fall, bounce and settle as real bodies. The simulation runs once, here, and its
 * motion is written into each layer as ordinary keyframes, so the scene plays, scrubs and exports the same every time,
 * needs no physics in the player, and every move can still be edited by hand. Fixed steps and a fixed seed: the same
 * layers and options always give the same result. The kit's studio-physics.mjs does the same for agents; keep them in step.
 */

export interface PhysicsOptions {
  /** 'above': they start off the top of the stage. 'here': they fall from where they are laid out. */
  from: 'above' | 'here';
  /** Seconds into the scene. */
  at: number;
  /** % of the stage height where they land. */
  floor: number;
  /** 0 (a dead stop) to 0.9 (very bouncy). */
  bounce: number;
  /** Seconds between each layer being let go. */
  stagger: number;
  /** Longest it may run, in seconds. */
  seconds: number;
  /** Adds a soft thud on the hardest landings. */
  sound: boolean;
}

export const PHYSICS_DEFAULTS: PhysicsOptions = { from: 'above', at: 0, floor: 88, bounce: 0.35, stagger: 0.12, seconds: 4, sound: true };

const STEP = 1000 / 60;
const KEY_EVERY = 3; // a key every 3 steps: 20 a second
const WORLD_W = 1000;
const r2 = (v: number) => Math.round(v * 100) / 100;
const CLIP_ID = 'physics-';

export interface Body { id: string; cx: number; cy: number; w: number; h: number; angle: number; round: boolean }

/** A layer's size and centre in the simulation's units, or null if it has no size to work from. */
export function bodyOf(layer: Layer, stageH: number): Body | null {
  const b = layer.box;
  if (!b) return null;
  let w = typeof b.w === 'number' ? (b.w / 100) * WORLD_W : 0;
  let h = typeof b.ratio === 'number' && b.ratio > 0 ? w / b.ratio : typeof b.h === 'number' ? (b.h / 100) * stageH : 0;
  if (layer.type === 'text') {
    const size = ((layer.style as { fontSize?: number } | undefined)?.fontSize ?? 4) / 100 * WORLD_W;
    if (!w) w = Math.max(size, layer.text.replace(/\*/g, '').length * size * 0.56);
    if (!h) h = size * 1.3;
  }
  if (!w || !h) return null;
  const a = b.anchor ?? 'center';
  const cx = (b.x / 100) * WORLD_W + (/left/.test(a) ? w / 2 : /right/.test(a) ? -w / 2 : 0);
  const cy = (b.y / 100) * stageH + (/top/.test(a) ? h / 2 : /bottom/.test(a) ? -h / 2 : 0);
  return { id: layer.id, cx, cy, w, h, angle: ((b.rotate ?? 0) * Math.PI) / 180, round: layer.type === 'shape' && layer.shape === 'ellipse' && Math.abs(w - h) < 2 };
}

/** The stage's height in simulation units, from the main layout's shape. */
export function stageHeight(scene: Scene): number {
  const a = scene.stage.breakpoints[0]?.aspect ?? [16, 9];
  return (WORLD_W * a[1]) / a[0];
}

type Frame = { t: number; x: number; y: number; rotate: number };

/** Removes keys a straight line through their neighbours would draw anyway. */
export function trimFrames(frames: Frame[], tolerance = 0.5): Frame[] {
  if (frames.length < 3) return frames;
  const kept = [frames[0]];
  for (let i = 1; i < frames.length - 1; i++) {
    const a = kept[kept.length - 1], m = frames[i], b = frames[i + 1];
    const u = (m.t - a.t) / (b.t - a.t);
    const off = (k: 'x' | 'y' | 'rotate') => Math.abs(a[k] + (b[k] - a[k]) * u - m[k]);
    if (off('x') > tolerance || off('y') > tolerance || off('rotate') > tolerance) kept.push(m);
  }
  kept.push(frames[frames.length - 1]);
  return kept;
}

type Matter = typeof import('matter-js');

/** Runs the simulation: each body's keys, the seconds it took to settle, and the hardest landings. */
export function simulate(M: Matter, bodies: Body[], stageH: number, o: PhysicsOptions) {
  (M.Common as unknown as { _seed: number })._seed = 1;
  const engine = M.Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.4;
  const floorY = (o.floor / 100) * stageH;
  const wall = { isStatic: true, friction: 0.6 };
  const live = bodies.map((b, i) => {
    // Let go together, they start stacked; let go in turn, each has the air to itself.
    const y = o.from === 'above' ? -b.h - 60 - (o.stagger < 0.1 ? i * b.h * 1.3 : 0) : b.cy;
    const opts = { restitution: o.bounce, friction: 0.5, frictionAir: 0.008, angle: b.angle + (o.from === 'above' ? (((i * 37) % 11) - 5) * 0.03 : 0), sleepThreshold: 45 };
    return b.round ? M.Bodies.circle(b.cx, y, b.w / 2, opts) : M.Bodies.rectangle(b.cx, y, b.w, b.h, opts);
  });
  M.Composite.add(engine.world, [
    M.Bodies.rectangle(WORLD_W / 2, floorY + 100, WORLD_W * 3, 200, wall),
    M.Bodies.rectangle(-100, stageH / 2, 200, stageH * 6, wall),
    M.Bodies.rectangle(WORLD_W + 100, stageH / 2, 200, stageH * 6, wall),
  ]);
  const hits: Array<{ t: number; force: number }> = [];
  let now = 0;
  M.Events.on(engine, 'collisionStart', (ev) => {
    for (const p of ev.pairs) {
      const a = p.bodyA, b = p.bodyB;
      const force = Math.max(a.speed, b.speed);
      if (force > 6) hits.push({ t: now, force });
    }
  });
  const frames: Frame[][] = bodies.map(() => []);
  // A body joins the world only when its turn comes, so one still waiting can't get in the way of one already falling.
  const held = live.map(() => true);
  const steps = Math.round((o.seconds * 1000) / STEP);
  let done = steps;
  for (let s = 0; s <= steps; s++) {
    now = (s * STEP) / 1000;
    live.forEach((x, i) => { if (held[i] && now >= i * o.stagger) { held[i] = false; M.Composite.add(engine.world, x); } });
    if (s % KEY_EVERY === 0) {
      live.forEach((x, i) => {
        const b = bodies[i];
        frames[i].push({ t: r2(now), x: r2(((x.position.x - b.cx) / b.w) * 100), y: r2(((x.position.y - b.cy) / b.h) * 100), rotate: r2(((x.angle - b.angle) * 180) / Math.PI) });
      });
    }
    M.Engine.update(engine, STEP);
    if (s % KEY_EVERY === 0 && !held.some(Boolean) && live.every((x) => x.isSleeping)) { done = s; break; }
  }
  return { frames: frames.map((f) => trimFrames(f)), seconds: r2((done * STEP) / 1000), hits };
}

/** The hardest landings, at least 0.14 s apart, at most eight. */
export function landings(hits: Array<{ t: number; force: number }>) {
  const out: Array<{ t: number; volume: number }> = [];
  for (const h of hits) {
    if (out.length >= 8 || (out.length && h.t - out[out.length - 1].t < 0.14)) continue;
    out.push({ t: h.t, volume: r2(Math.min(0.5, 0.12 + h.force / 60)) });
  }
  return out;
}

const walk = (list: Layer[], fn: (l: Layer) => Layer): Layer[] => list.map((l) => {
  const n = fn(l);
  return n.type === 'group' ? { ...n, layers: walk(n.layers, fn) } : n;
});

/** The scene with the layers dropped: earlier physics on them is replaced. */
export async function dropWithPhysics(scene: Scene, ids: string[], options: Partial<PhysicsOptions> = {}): Promise<{ scene: Scene; seconds: number; count: number }> {
  const o = { ...PHYSICS_DEFAULTS, ...options };
  const M = ((await import('matter-js')) as unknown as { default: Matter }).default;
  const H = stageHeight(scene);
  const found: Layer[] = [];
  walk(scene.layers, (l) => { if (ids.includes(l.id)) found.push(l); return l; });
  const bodies = found.map((l) => bodyOf(l, H)).filter((b): b is Body => !!b);
  if (!bodies.length) throw new Error('Those layers have no size to work from.');
  const r = simulate(M, bodies, H, o);
  const by = new Map(bodies.map((b, i) => [b.id, r.frames[i]]));
  const layers = walk(scene.layers, (l) => {
    const f = by.get(l.id);
    if (!f) return l;
    const clip: Clip = { id: `${CLIP_ID}${l.id}`, preset: 'keyframes', start: r2(o.at), duration: Math.max(0.2, r.seconds), ease: 'none', params: { frames: f } };
    return { ...l, ...(o.from === 'above' ? { start: r2(o.at) } : {}), clips: [...l.clips.filter((c) => !c.id.startsWith(CLIP_ID)), clip] };
  });
  const { audio: before, ...rest } = scene;
  const audio = (before ?? []).filter((a) => !a.id.startsWith(CLIP_ID));
  if (o.sound) landings(r.hits).forEach((h, i) => audio.push({ id: `${CLIP_ID}thud-${i + 1}`, name: 'Landing', src: 'sfx:thud', start: r2(o.at + h.t), volume: h.volume } as never));
  const duration = Math.max(scene.duration, r2(o.at + r.seconds));
  return { scene: { ...rest, duration, layers, ...(audio.length ? { audio } : {}) } as Scene, seconds: r.seconds, count: bodies.length };
}
