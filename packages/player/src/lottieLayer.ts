import type { LottieLayer } from './types';

/**
 * The link between the player and the Lottie runtime (lottie-web), which lives in scene-lottie.js, loaded only when a
 * scene has a Lottie layer. The animation never plays by itself: on every timeline update the player shows the exact
 * frame for the layer's time, so a Lottie seeks, scrubs, loops and renders to video like everything else.
 */

export interface LottieInstance { ready: Promise<void>; frames(): number; show(frame: number): void; dispose(): void }
export interface LottieModule { create(host: HTMLElement, data: unknown, edits: { colours?: Record<string, string>; texts?: Record<string, string> }): LottieInstance }

declare global { interface Window { UnysonPlusSceneLottie?: LottieModule; UPW_SCENE_ASSET_BASE?: string } }

let assetBase = '';
export function setLottieBase(url: string) { assetBase = url && !url.endsWith('/') ? `${url}/` : url; }

const pending = new WeakMap<Window, Promise<LottieModule>>();
/** Loads the Lottie runtime once per window. */
export function loadLottie(win: Window): Promise<LottieModule> {
  if (win.UnysonPlusSceneLottie) return Promise.resolve(win.UnysonPlusSceneLottie);
  const existing = pending.get(win);
  if (existing) return existing;
  const base = win.UPW_SCENE_ASSET_BASE || assetBase;
  const p = new Promise<LottieModule>((resolve, reject) => {
    if (!base) return reject(new Error('The scene has a Lottie animation, but the player does not know where scene-lottie.js is (set window.UPW_SCENE_ASSET_BASE).'));
    const s = win.document.createElement('script');
    s.src = `${base}scene-lottie.js`;
    s.async = true;
    s.onload = () => (win.UnysonPlusSceneLottie ? resolve(win.UnysonPlusSceneLottie) : reject(new Error('scene-lottie.js loaded but did not start.')));
    s.onerror = () => reject(new Error(`Could not load ${s.src}.`));
    win.document.head.appendChild(s);
  });
  pending.set(win, p);
  p.catch(() => pending.delete(win));
  return p;
}

/** The animation's data: inline JSON, a data: URL or an address (fetched once per address). */
const fetched = new Map<string, Promise<unknown>>();
export function lottieData(src: string): Promise<unknown> {
  const s = src.trim();
  if (s.startsWith('{')) return Promise.resolve(JSON.parse(s));
  if (!fetched.has(s)) fetched.set(s, fetch(s).then((r) => { if (!r.ok) throw new Error(`Lottie file: ${r.status}`); return r.json(); }));
  return fetched.get(s)!;
}

/** The frame to show at the layer's local time: from its start, at its speed, looped or held on the last frame. */
export function lottieFrame(layer: LottieLayer, localTime: number, frames: number, fps: number): number {
  const t = Math.max(0, localTime - (layer.start ?? 0)) * (layer.speed ?? 1);
  const f = t * fps + (layer.from ?? 0) * fps;
  const last = Math.max(0, frames - 1);
  return (layer.loop ?? true) ? f % Math.max(1, frames) : Math.min(last, f);
}
