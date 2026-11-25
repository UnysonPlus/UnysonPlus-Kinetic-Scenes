import type { ModelLayer } from './types';
import { setLottieBase } from './lottieLayer';
import { setPaintBase } from './paintLayer';

/**
 * The link between the player and the 3D runtime (three.js), which lives in a separate script,
 * scene-3d.js, loaded only when a scene has a 3D layer.
 *
 * Every frame of a 3D layer is a pure function of a small state object: presets tween the state on the
 * scene's timeline, and the player asks the runtime to draw it whenever the timeline updates. The
 * runtime never animates on its own, so 3D seeks, scrubs and loops exactly like everything else.
 */

/**
 * Rotations in degrees; px / py move the object by a fraction of its size; the camera orbits, tilts and dollies;
 * open: how far a laptop's lid is open, as a fraction of the layer's own lid angle (1 = as set, 0 = closed).
 */
export interface State3D {
  rx: number;
  ry: number;
  rz: number;
  s: number;
  px: number;
  py: number;
  orbit: number;
  tilt: number;
  dolly: number;
  open: number;
}

/** The 3D canvas reaches this far past the layer's box on each side (a fraction of the box), so a turning object isn't cut off. */
export const BLEED_3D = 0.35;

export const REST_3D: State3D = { rx: 0, ry: 0, rz: 0, s: 1, px: 0, py: 0, orbit: 0, tilt: 0, dolly: 1, open: 1 };

export interface Runtime3D {
  /** Draws the object in this state (remembered and redrawn once a model finishes loading). */
  render(state: State3D): void;
  dispose(): void;
  /** Resolves once the object is built (models and SVGs load asynchronously). */
  ready: Promise<void>;
  /**
   * Shows the layer at this many seconds of its own time (and redraws): animated models' animation, and a device's
   * screen video, which plays while the scene plays and is seeked exactly when it is paused, scrubbed or exported.
   */
  time?(seconds: number, playing?: boolean): void;
  /** Animated models: the longest animation clip, in seconds (0 when it has none). */
  animationLength?(): number;
}

export interface Module3D {
  create(host: HTMLElement, layer: ModelLayer): Runtime3D;
}

declare global {
  interface Window {
    UnysonPlusScene3D?: Module3D;
    /** Where scene-3d.js lives, when the page sets it (otherwise next to the player script). */
    UPW_SCENE_ASSET_BASE?: string;
  }
}

let assetBase = '';
/** Sets the folder the player's companion files (scene-3d.js) are loaded from. */
export function setAssetBase(url: string) {
  assetBase = url && !url.endsWith('/') ? `${url}/` : url;
  setLottieBase(url);
  setPaintBase(url);
}

const pending = new WeakMap<Window, Promise<Module3D>>();

/** Loads the 3D runtime once per window. */
export function load3d(win: Window): Promise<Module3D> {
  if (win.UnysonPlusScene3D) return Promise.resolve(win.UnysonPlusScene3D);
  const existing = pending.get(win);
  if (existing) return existing;
  const base = win.UPW_SCENE_ASSET_BASE || assetBase;
  const p = new Promise<Module3D>((resolve, reject) => {
    if (!base) return reject(new Error('The scene uses 3D, but the player does not know where scene-3d.js is (set window.UPW_SCENE_ASSET_BASE).'));
    const s = win.document.createElement('script');
    s.src = `${base}scene-3d.js`;
    s.async = true;
    s.onload = () => (win.UnysonPlusScene3D ? resolve(win.UnysonPlusScene3D) : reject(new Error('scene-3d.js loaded but did not start.')));
    s.onerror = () => reject(new Error(`Could not load ${s.src}.`));
    win.document.head.appendChild(s);
  });
  pending.set(win, p);
  p.catch(() => pending.delete(win));
  return p;
}
