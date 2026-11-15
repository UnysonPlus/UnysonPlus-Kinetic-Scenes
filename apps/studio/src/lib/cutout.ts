import type { ImageLayer, Layer, Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { findLayer } from './sceneOps';

/**
 * Cut out the object: the AI Dev Kit cuts the subject out of a picture (BiRefNet, on this computer) and reports how
 * clean the cut is. The cut-out arrives trimmed to its own box; here it is put back on a transparent canvas the size of
 * the photo, so the new layer copies the photo's box, fit and layouts and sits exactly over it, whatever the crop.
 */

export interface CutoutStatus { runtime: boolean; cutModel: boolean; fillModel: boolean; downloads?: { cutMB: number; fillMB: number } }
export interface CutoutResult {
  png: string;
  plateJpg?: string;
  /** Where the subject sat in the photo, as fractions. */
  box: { x: number; y: number; w: number; h: number };
  verdict: 'good' | 'check' | 'poor';
  notes: string[];
  sure?: number;
}
/** Part of the picture to look in, as fractions: left, top, right, bottom. */
export type Region = [number, number, number, number];

export async function cutoutStatus(): Promise<CutoutStatus | null> {
  const base = await kitBase();
  if (!base) return null;
  try {
    const r = await fetch(`${base}/studio/cutout/status`);
    if (!r.ok) return null;
    return (await r.json()) as CutoutStatus;
  } catch {
    return null;
  }
}

/** A picture's address as a data: URL (the kit only reads files it is sent). */
async function asDataUrl(src: string): Promise<string> {
  if (src.startsWith('data:')) return src;
  const blob = await (await fetch(src)).blob();
  return new Promise((ok, fail) => { const f = new FileReader(); f.onload = () => ok(String(f.result)); f.onerror = () => fail(new Error('The picture could not be read.')); f.readAsDataURL(blob); });
}

/** Cuts the subject out (or the one inside region). onStep reports progress. */
export async function cutOut(src: string, o: { region?: Region | null; fill?: boolean; onStep?: (s: string) => void; signal?: AbortSignal } = {}): Promise<CutoutResult> {
  const base = await kitBase();
  if (!base) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${base}/studio/cutout`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, signal: o.signal,
    body: JSON.stringify({ src: await asDataUrl(src), ...(o.region ? { region: o.region } : {}), ...(o.fill ? { fill: true } : {}) }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old to cut out pictures. Close it and start it again: it updates itself.');
  if (!r.ok || !j.id) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  for (;;) {
    await new Promise((f) => setTimeout(f, 1200));
    if (o.signal?.aborted) throw new DOMException('Stopped', 'AbortError');
    const s = await (await fetch(`${base}/studio/cutout/${j.id}`, { signal: o.signal })).json().catch(() => ({}));
    if (s.step) o.onStep?.(s.step);
    if (s.state === 'error' || s.error) throw new Error(s.error || 'The cut-out did not work.');
    if (s.state === 'done' && s.result) return s.result as CutoutResult;
  }
}

const load = async (src: string) => { const i = new Image(); i.src = src; await i.decode(); return i; };

/** The trimmed cut-out on a transparent canvas the size of the photo, in the place it came from. */
export async function placeOnPhoto(photoSrc: string, r: CutoutResult): Promise<string> {
  const [photo, cut] = await Promise.all([load(photoSrc), load(r.png)]);
  const W = photo.naturalWidth, H = photo.naturalHeight;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d')!.drawImage(cut, r.box.x * W, r.box.y * H, r.box.w * W, r.box.h * H);
  return c.toDataURL('image/png');
}

/**
 * Adds the cut-out as a new image layer just above the photo, in exactly its place (same box, fit, layouts and
 * timing). With a plate, the photo behind becomes the photo with the subject painted out.
 */
export function addCutoutLayer(scene: Scene, id: string, cutoutSrc: string, plate?: string): { scene: Scene; id: string } {
  const photo = (findLayer(scene, id) ?? null) as ImageLayer | null;
  if (!photo || photo.type !== 'image') return { scene, id };
  const taken = new Set<string>();
  const walk = (ls: Layer[]) => ls.forEach((l) => { taken.add(l.id); if (l.type === 'group') walk(l.layers); });
  walk(scene.layers);
  let newId = `${id}-cutout`;
  for (let k = 2; taken.has(newId); k++) newId = `${id}-cutout-${k}`;
  const cut: Layer = {
    id: newId, type: 'image', name: `${photo.name ?? 'Picture'} (cut-out)`, src: cutoutSrc, alt: photo.alt ?? '', fit: photo.fit, radius: photo.radius,
    box: { ...photo.box }, overrides: photo.overrides, start: photo.start, end: photo.end, depth: photo.depth, clips: [],
  } as Layer;
  const place = (list: Layer[]): Layer[] => list.flatMap((l) => {
    if (l.id === id) return [plate ? ({ ...l, src: plate } as Layer) : l, cut];
    return l.type === 'group' ? [{ ...l, layers: place(l.layers) }] : [l];
  });
  return { scene: { ...scene, layers: place(scene.layers) }, id: newId };
}
