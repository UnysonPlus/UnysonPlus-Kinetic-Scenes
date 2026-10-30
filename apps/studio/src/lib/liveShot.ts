import type { Clip, ImageLayer, Layer, Scene } from '@unysonplus/scene-player/types';
import { findLayer, primaryBreakpoint } from './sceneOps';
import { cutOutMany, layerRect, type Region } from './tour';

/**
 * Animated screenshot: a still screenshot of an interface comes alive. Its rows (the options of a settings
 * screen, the items of a list) are found in the picture, or given from where the kit measured them in the
 * real page, cut out into layers in exactly the same place, and animated: they build in one after another,
 * and the one being talked about lifts off the screen (Magnify), with the rest dimmed (Spotlight) and a label
 * (Callout).
 */

const r2 = (v: number) => Math.round(v * 100) / 100;

export interface Pixels { width: number; height: number; data: Uint8ClampedArray | number[] }

export interface FindOptions {
  /** Look only inside this part of the picture (% of the picture). */
  within?: Region;
  /** Rows closer than this (% of the picture's height) are one row: a label and its description stay together. */
  join?: number;
}

/**
 * Finds the rows of an interface screenshot: bands of content (text, fields, switches) separated by plain
 * background. Each row's sides are where its content starts and ends. Returned in % of the picture.
 */
export function findRows(px: Pixels, opts: FindOptions = {}): Region[] {
  const { width: W, height: H, data } = px;
  const w = opts.within;
  const X0 = w ? Math.max(0, Math.floor((w.x / 100) * W)) : 0;
  const Y0 = w ? Math.max(0, Math.floor((w.y / 100) * H)) : 0;
  const X1 = w ? Math.min(W, Math.ceil(((w.x + w.w) / 100) * W)) : W;
  const Y1 = w ? Math.min(H, Math.ceil(((w.y + w.h) / 100) * H)) : H;
  if (X1 - X0 < 4 || Y1 - Y0 < 4) return [];
  const lum = (x: number, y: number) => { const i = (y * W + x) * 4; return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; };
  // A row's background: its commonest brightness (in 16 steps). Content is what differs from it clearly.
  const background = (y: number) => {
    const hist = new Array(16).fill(0);
    for (let x = X0; x < X1; x++) hist[Math.min(15, Math.floor(lum(x, y) / 16))]++;
    let best = 0;
    for (let i = 1; i < 16; i++) if (hist[i] > hist[best]) best = i;
    return best * 16 + 8;
  };
  const bg: number[] = [];
  const busy: boolean[] = [];
  const need = Math.max(2, Math.round((X1 - X0) * 0.004));
  for (let y = Y0; y < Y1; y++) {
    const b = background(y);
    bg[y] = b;
    let n = 0;
    for (let x = X0; x < X1 && n < need; x++) if (Math.abs(lum(x, y) - b) > 28) n++;
    busy[y] = n >= need;
  }
  // Runs of busy rows, then runs closer than `join` merged.
  const join = Math.max(2, Math.round(((opts.join ?? 1.2) / 100) * H));
  const runs: Array<[number, number]> = [];
  for (let y = Y0; y < Y1; y++) {
    if (!busy[y]) continue;
    const last = runs[runs.length - 1];
    if (last && y - last[1] <= join) last[1] = y; else runs.push([y, y]);
  }
  const minH = Math.max(3, Math.round(H * 0.008));
  const out: Region[] = [];
  for (const [a, b] of runs) {
    if (b - a + 1 < minH) continue;
    // Sides: the first and last columns with content anywhere in the run.
    let l = X1, r = X0;
    for (let y = a; y <= b; y++) {
      for (let x = X0; x < l; x++) if (Math.abs(lum(x, y) - bg[y]) > 28) { l = x; break; }
      for (let x = X1 - 1; x > r; x--) if (Math.abs(lum(x, y) - bg[y]) > 28) { r = x; break; }
    }
    if (r <= l) continue;
    // A little room round the content, so a lifted row carries its own background.
    const pad = Math.round(Math.min(W, H) * 0.008);
    const x0 = Math.max(X0, l - pad), x1 = Math.min(X1, r + pad + 1), y0 = Math.max(Y0, a - pad), y1 = Math.min(Y1, b + pad + 1);
    out.push({ x: r2((x0 / W) * 100), y: r2((y0 / H) * 100), w: r2(((x1 - x0) / W) * 100), h: r2(((y1 - y0) / H) * 100) });
  }
  return out.slice(0, 30);
}

/** Reads a picture's pixels (made smaller for speed: rows are found at about 800 pixels wide). */
export async function picturePixels(src: string): Promise<Pixels> {
  const img = await new Promise<HTMLImageElement>((ok, bad) => {
    const i = new Image();
    if (!src.startsWith('data:')) i.crossOrigin = 'anonymous';
    i.onload = () => ok(i);
    i.onerror = () => bad(new Error('the picture could not be read (an address on another site must allow it)'));
    i.src = src;
  });
  const k = Math.min(1, 800 / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.naturalWidth * k));
  c.height = Math.max(1, Math.round(img.naturalHeight * k));
  const g = c.getContext('2d')!;
  g.drawImage(img, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height);
  return { width: d.width, height: d.height, data: d.data };
}

/**
 * Regions in % of the picture → % of the image layer's box (they differ when the box crops the picture).
 * `natural` is the picture's size in pixels.
 */
export function pictureToBox(scene: Scene, layer: ImageLayer, natural: { width: number; height: number }, regions: Region[]): Region[] {
  const rect = layerRect(scene, layer);
  if (!rect || !rect.h) return regions;
  const bp = scene.stage.breakpoints.find((b) => b.id === primaryBreakpoint(scene));
  const stageAspect = bp ? bp.aspect[0] / bp.aspect[1] : 16 / 9;
  const boxAspect = (rect.w / rect.h) * stageAspect;
  const W = natural.width, H = natural.height;
  const cover = (layer.fit ?? 'cover') === 'cover';
  let sw: number, sh: number;
  if (cover === W / H > boxAspect) { sh = H; sw = H * boxAspect; } else { sw = W; sh = W / boxAspect; }
  const ox = (W - sw) / 2, oy = (H - sh) / 2;
  return regions.map((r) => ({
    x: r2((((r.x / 100) * W - ox) / sw) * 100), y: r2((((r.y / 100) * H - oy) / sh) * 100),
    w: r2((((r.w / 100) * W) / sw) * 100), h: r2((((r.h / 100) * H) / sh) * 100),
  }));
}

export type Entrance = 'stagger' | 'stack' | 'none';
export type Focus = 'magnify' | 'spotlight' | 'both' | 'none';

export interface LiveShotOptions {
  /** When the first piece starts (seconds). */
  start: number;
  /** How the pieces arrive: sliding up one after another, landing like cards, or already there. */
  entrance: Entrance;
  /** Seconds between one piece and the next. */
  gap?: number;
  /** Which piece is talked about (index into the pieces), and what happens to it. */
  focus?: number;
  focusEffect?: Focus;
  /** When the focus starts; by default just after the last piece has arrived. */
  focusAt?: number;
  /** A label beside the focused piece (a Callout); empty for none. */
  label?: string;
  /** Seconds the focus holds before it lets go; 0 keeps it to the end. */
  hold?: number;
  /** The Magnify ring colour. */
  ring?: string;
}

/** The clips that make the pieces come alive, by piece id, and the time the last of them ends. */
export function liveShotClips(ids: string[], o: LiveShotOptions): { clips: Record<string, Clip[]>; end: number } {
  const gap = o.gap ?? 0.12;
  const clips: Record<string, Clip[]> = Object.fromEntries(ids.map((id) => [id, [] as Clip[]]));
  let end = o.start;
  const add = (id: string, c: Omit<Clip, 'id'>) => {
    const list = clips[id];
    list.push({ id: `${id}-c${list.length + 1}`, ...c, start: r2(c.start), duration: r2(c.duration) });
    end = Math.max(end, c.start + c.duration);
  };
  if (o.entrance !== 'none') {
    ids.forEach((id, i) => add(id, o.entrance === 'stack'
      ? { preset: 'stack-in', start: o.start + i * gap, duration: 0.55, params: { direction: 'in', lift: 30 } }
      : { preset: 'slide', start: o.start + i * gap, duration: 0.5, params: { direction: 'in', from: 'bottom', distance: 40 } }));
  }
  const fi = o.focus;
  const effect = o.focusEffect ?? 'none';
  if (fi !== undefined && fi >= 0 && fi < ids.length && (effect !== 'none' || o.label)) {
    const id = ids[fi];
    const at = o.focusAt ?? (o.entrance === 'none' ? o.start : end + 0.35);
    const magnify = effect === 'magnify' || effect === 'both';
    const spot = effect === 'spotlight' || effect === 'both';
    if (spot) add(id, { preset: 'spotlight', start: at, duration: 0.5, params: { direction: 'in', pad: 0.6, radius: 0.8, dim: 0.62 } });
    const lift = { scale: 1.15, shadow: true, ring: o.ring ?? '#2ad38b' };
    if (magnify) add(id, { preset: 'lift', start: at + (spot ? 0.15 : 0), duration: 0.45, params: { direction: 'in', ...lift } });
    if (o.label) add(id, { preset: 'callout', start: at + 0.35, duration: 0.45, params: { direction: 'in', text: o.label, side: 'top', gap: 2.5, size: 1.6 } });
    if (o.hold && o.hold > 0) {
      const off = at + 0.8 + o.hold;
      if (o.label) add(id, { preset: 'callout', start: off, duration: 0.3, params: { direction: 'out' } });
      if (magnify) add(id, { preset: 'lift', start: off, duration: 0.4, params: { direction: 'out', ...lift } });
      if (spot) add(id, { preset: 'spotlight', start: off, duration: 0.4, params: { direction: 'out' } });
    }
  }
  return { clips, end };
}

/**
 * Cuts the regions (in % of the picture) out of an image layer and animates them. The scene grows to fit
 * when the animation runs past its end. Returns the new scene and the pieces' ids.
 */
export async function animateScreenshot(scene: Scene, layerId: string, regions: Region[], natural: { width: number; height: number }, o: LiveShotOptions): Promise<{ scene: Scene; ids: string[] }> {
  const layer = findLayer(scene, layerId) as ImageLayer | undefined;
  if (!layer || layer.type !== 'image') throw new Error('choose an image layer');
  const boxRegions = pictureToBox(scene, layer, natural, regions);
  const cut = await cutOutMany(scene, layerId, boxRegions, regions.map((_, i) => `Row ${i + 1}`));
  const { clips, end } = liveShotClips(cut.ids, o);
  const put = (list: Layer[]): Layer[] => list.map((l) => (clips[l.id] ? ({ ...l, clips: [...l.clips, ...clips[l.id]] } as Layer) : l.type === 'group' ? ({ ...l, layers: put(l.layers) } as Layer) : l));
  const next: Scene = { ...cut.scene, layers: put(cut.scene.layers) };
  if (end + 0.5 > next.duration) next.duration = r2(end + 0.5);
  return { scene: next, ids: cut.ids };
}
