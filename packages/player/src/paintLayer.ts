/**
 * The link between the player and the paint engine (p5.brush), which lives in scene-paint.js, loaded only when a scene
 * uses the Painted look. Painting is seeded, so a frame paints the same pixels on every play and export.
 */

export interface PaintJob {
  /** The canvas size in device pixels; points are in the same pixels. */
  width: number;
  height: number;
  /** The outline, in canvas pixels. */
  points: Array<[number, number]>;
  closed: boolean;
  /** 0 straight lines between points to 1 smooth curves through them. */
  curve: number;
  medium: string;
  /** Draw the outline. */
  line: boolean;
  lineColor: string;
  fill: 'watercolour' | 'wash' | 'hatch' | 'none';
  fillColor: string;
  opacity: number;
  weight: number;
  bleed: number;
  texture: number;
  gap: number;
  angle: number;
  /** Brush sizes follow the stage: 1 at a 640 px wide stage. */
  scale: number;
  seed: number;
  /** How much of the outline is drawn, 0 to 1. */
  progress: number;
  /** Paint only the fill, only the line, or both. */
  part: 'fill' | 'line' | 'both';
}

export interface PaintModule { paint(job: PaintJob, target: HTMLCanvasElement): void }

declare global { interface Window { UnysonPlusScenePaint?: PaintModule; UPW_SCENE_ASSET_BASE?: string } }

let assetBase = '';
export function setPaintBase(url: string) { assetBase = url && !url.endsWith('/') ? `${url}/` : url; }

const pending = new WeakMap<Window, Promise<PaintModule>>();
/** Loads the paint engine once per window. */
export function loadPaint(win: Window): Promise<PaintModule> {
  if (win.UnysonPlusScenePaint) return Promise.resolve(win.UnysonPlusScenePaint);
  const existing = pending.get(win);
  if (existing) return existing;
  const base = win.UPW_SCENE_ASSET_BASE || assetBase;
  const p = new Promise<PaintModule>((resolve, reject) => {
    if (!base) return reject(new Error('The scene uses the Painted look, but the player does not know where scene-paint.js is (set window.UPW_SCENE_ASSET_BASE).'));
    const s = win.document.createElement('script');
    s.src = `${base}scene-paint.js`;
    s.async = true;
    s.onload = () => (win.UnysonPlusScenePaint ? resolve(win.UnysonPlusScenePaint) : reject(new Error('scene-paint.js loaded but did not start.')));
    s.onerror = () => reject(new Error(`Could not load ${s.src}.`));
    win.document.head.appendChild(s);
  });
  pending.set(win, p);
  p.catch(() => pending.delete(win));
  return p;
}
