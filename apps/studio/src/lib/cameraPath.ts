import type { Scene } from '@unysonplus/scene-player/types';

/**
 * The camera's path in a 3D layer, read from the preview (the player seeks the timeline and reads the layer's state at
 * each moment, so presets, keyframes and groups all count). Positions are in units of the camera's resting distance,
 * on the same sphere the 3D runtime puts it on: orbit turns it round the object, tilt raises it, dolly moves it nearer.
 */

export interface CamState { rx: number; ry: number; rz: number; s: number; px: number; py: number; orbit: number; tilt: number; dolly: number }
export interface CamPoint { t: number; x: number; y: number; z: number; orbit: number; tilt: number; dolly: number }

const DEG = Math.PI / 180;
/** The 3D runtime's vertical field of view, in degrees. */
export const FOV = 22;

export const camPoint = (t: number, s: CamState): CamPoint => {
  const o = s.orbit * DEG, k = s.tilt * DEG, d = Math.max(0.05, s.dolly);
  return { t, x: Math.sin(o) * Math.cos(k) * d, y: Math.sin(k) * d, z: Math.cos(o) * Math.cos(k) * d, orbit: s.orbit, tilt: s.tilt, dolly: s.dolly };
};

/** The times to sample: the layer's whole time on screen, about 10 a second (at most 300). */
export function sampleTimes(scene: Scene, start: number, end: number): number[] {
  const len = Math.max(0.1, end - start), n = Math.min(300, Math.max(20, Math.round(len * 10)));
  return Array.from({ length: n + 1 }, (_, i) => Math.min(scene.duration, start + (len * i) / n));
}

let seq = 0;
/** Asks the preview for the layer's states at the times; resolves with the path (empty if no answer in 3 s). */
export function askCameraPath(layer: string, times: number[]): Promise<CamPoint[]> {
  const id = `cp${++seq}`;
  return new Promise((resolve) => {
    const done = (e: Event) => {
      const m = (e as CustomEvent).detail as { id: string; times: number[]; states: CamState[] };
      if (m.id !== id) return;
      window.removeEventListener('upw:camera-path', done);
      clearTimeout(timer);
      resolve((m.states ?? []).map((s, i) => camPoint(m.times[i], s)));
    };
    const timer = setTimeout(() => { window.removeEventListener('upw:camera-path', done); resolve([]); }, 3000);
    window.addEventListener('upw:camera-path', done);
    window.dispatchEvent(new CustomEvent('upw:ask-camera-path', { detail: { id, layer, times } }));
  });
}

/** True when the camera moves at all over the path (else there is nothing to draw but where it sits). */
export const camMoves = (p: CamPoint[]) => p.some((q) => Math.abs(q.orbit - p[0].orbit) > 0.5 || Math.abs(q.tilt - p[0].tilt) > 0.5 || Math.abs(q.dolly - p[0].dolly) > 0.01);
