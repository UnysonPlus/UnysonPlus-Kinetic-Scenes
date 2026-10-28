import type { Clip, Scene, VideoLayer } from '@unysonplus/scene-player/types';
import { findLayer, setLayerProps } from './sceneOps';
import { getFootage } from './footage';

/**
 * Landscape footage in a tall (or square) frame, following the face: the footage is made as tall as the frame (so
 * wider than it) and slid sideways by an ordinary Keyframes clip that keeps the face near the middle. The crop path
 * is those keyframes, so it can be edited like any other: move a key, delete one, add one.
 *
 * The path is calm on purpose, as a camera operator would frame it: the face path is smoothed over about a second, the
 * frame holds still while the face moves only a little, and the result is cut down to the few keys that matter.
 */

type Track = NonNullable<VideoLayer['track']>;
const r2 = (x: number) => Math.round(x * 100) / 100;

/** The frame's width-to-height: the video format the scene is made for, else its first layout. */
export function frameAspect(scene: Scene): number {
  const f = scene.video?.formats?.[0];
  const m = typeof f === 'string' ? /^(\d+)x(\d+)$/.exec(f) : null;
  if (m) return Number(m[1]) / Number(m[2]);
  const a = scene.stage?.breakpoints?.[0]?.aspect;
  return a ? a[0] / a[1] : 16 / 9;
}

/** The footage's width-to-height, read from the file. */
export async function footageAspect(src: string): Promise<number> {
  let url = src;
  let made = '';
  if (src.startsWith('local:')) {
    const blob = await getFootage(src);
    if (!blob) throw new Error('This footage is no longer in this browser.');
    url = made = URL.createObjectURL(blob);
  }
  try {
    return await new Promise<number>((res, rej) => {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.muted = true;
      v.onloadedmetadata = () => (v.videoWidth ? res(v.videoWidth / v.videoHeight) : rej(new Error('The footage has no picture.')));
      v.onerror = () => rej(new Error('The footage could not be read.'));
      v.src = url;
    });
  } finally { if (made) URL.revokeObjectURL(made); }
}

/** The face's x (0–1 of the frame) at a moment in the file, between the two nearest points of the path. */
function faceX(track: Track, t: number): number {
  let i = track.findIndex((q) => q.t > t);
  if (i < 0) i = track.length;
  const a = track[Math.max(0, i - 1)], b = track[Math.min(track.length - 1, i)];
  const f = b.t > a.t ? Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t))) : 0;
  return a.x + (b.x - a.x) * f;
}

/** Douglas–Peucker: the fewest points that keep the path within tol of where it was. */
function simplify(pts: { t: number; v: number }[], tol: number): { t: number; v: number }[] {
  if (pts.length < 3) return pts;
  const a = pts[0], b = pts[pts.length - 1];
  let worst = 0, at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const on = a.v + ((b.v - a.v) * (p.t - a.t)) / (b.t - a.t || 1);
    const d = Math.abs(p.v - on);
    if (d > worst) { worst = d; at = i; }
  }
  if (worst <= tol) return [a, b];
  return [...simplify(pts.slice(0, at + 1), tol).slice(0, -1), ...simplify(pts.slice(at), tol)];
}

export interface ReframeOptions {
  /** How far (fraction of the frame's width) the face may drift before the frame follows it. Default 0.06. */
  deadzone?: number;
  /** Seconds the face path is smoothed over. Default 1. */
  smooth?: number;
}

/**
 * The reframed scene: the footage sized to the frame's height and a "Follow the face" Keyframes clip over its whole
 * length, and the number of keys.
 */
export function reframe(scene: Scene, layerId: string, srcAspect: number, opt: ReframeOptions = {}): { scene: Scene; keys: number } {
  const layer = findLayer(scene, layerId) as VideoLayer | undefined;
  if (!layer || layer.type !== 'video') throw new Error('Select a footage layer.');
  const track = layer.track;
  if (!track?.length) throw new Error('Find the face first (Follow the face).');
  const stage = frameAspect(scene);
  if (srcAspect <= stage * 1.02) throw new Error('This footage is not wider than the frame: there is nothing to reframe. Make the scene tall (9:16) or square first.');

  // The box: as tall as the frame, W % of its width.
  const W = (100 * srcAspect) / stage;
  // The most the footage may slide (in % of its own width) before an edge shows.
  const limit = ((W - 100) / 2 / W) * 100;

  const start = layer.start ?? 0;
  const end = typeof layer.end === 'number' ? layer.end : scene.duration;
  const len = Math.max(0.1, end - start);
  const off = layer.offset ?? 0, rate = layer.rate ?? 1;
  const fileAt = (t: number) => off + t * rate;

  // Sample every 0.1 s, smooth over the window, hold inside the dead zone.
  const step = 0.1, win = Math.max(1, Math.round((opt.smooth ?? 1) / step / 2));
  const raw: number[] = [];
  for (let t = 0; t <= len + 1e-6; t += step) raw.push(faceX(track, fileAt(t)));
  const smooth = raw.map((_, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - win); j <= Math.min(raw.length - 1, i + win); j++) { s += raw[j]; n++; } return s / n; });
  const dead = opt.deadzone ?? 0.06;
  // The frame's own centre (fraction of the footage) as it follows: it moves only when the face leaves the dead zone.
  const frameFrac = 100 / W; // the frame's width as a fraction of the footage's
  let centre = smooth[0];
  const path = smooth.map((x, i) => {
    const d = x - centre, zone = dead * frameFrac; // the dead zone, in fractions of the footage
    if (Math.abs(d) > zone) centre = x - Math.sign(d) * zone;
    return { t: i * step, v: Math.max(-limit, Math.min(limit, 100 * (0.5 - centre))) };
  });
  const keys = simplify(path, 0.4).map((p) => ({ t: r2(Math.min(len, p.t)), x: Math.trunc(p.v * 100) / 100, ease: 'sine.inOut' })); // rounded toward the middle: never past an edge

  const clip: Clip = { id: `${layer.id}-reframe`, preset: 'keyframes', start, duration: r2(len), params: { frames: keys } } as Clip;
  const next = setLayerProps(scene, layer.id, {
    box: { ...layer.box, x: 50, y: 50, w: r2(W), h: undefined, ratio: r2(srcAspect * 1000) / 1000 },
    fit: 'cover',
    clips: [...layer.clips.filter((c) => c.id !== clip.id), clip],
  });
  return { scene: next, keys: keys.length };
}
