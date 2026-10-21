import type { ImageLayer, Layer, Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { findLayer } from './sceneOps';

/**
 * Split into layers: the AI Dev Kit turns a picture into stacked transparent layers (with the user's
 * fal.ai key, an AI decomposition into several layers; otherwise a local cut-out into background and
 * subject). The image layer becomes a group of image layers in exactly the same place, bottom to top,
 * each with a depth for camera parallax.
 */

export interface SplitStatus { engine: 'fal' | 'local'; fal: boolean; localModel: boolean }

export async function splitStatus(): Promise<SplitStatus | null> {
  const base = await kitBase();
  if (!base) return null;
  try {
    const r = await fetch(`${base}/studio/split`);
    if (!r.ok) return null;
    return (await r.json()) as SplitStatus;
  } catch {
    return null;
  }
}

/** How much of a layer is drawn (0 to 1): the fullest layer is the background. */
async function coverage(src: string): Promise<number> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d')!;
  g.drawImage(img, 0, 0, 64, 64);
  const d = g.getImageData(0, 0, 64, 64).data;
  let n = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] > 24) n++;
  return n / (64 * 64);
}

export async function splitPicture(src: string, layers: number): Promise<{ engine: string; layers: Array<{ name: string; src: string }> }> {
  const base = await kitBase();
  if (!base) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${base}/studio/split`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ src, layers }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  let list = j.layers as Array<{ name: string; src: string }>;
  if (j.engine === 'fal') {
    // fal.ai doesn't promise an order: the layer that covers most is the background, then the rest.
    const cov = await Promise.all(list.map((l) => coverage(l.src).catch(() => 0)));
    list = list.map((l, i) => ({ l, c: cov[i] })).sort((a, b) => b.c - a.c).map(({ l }, i) => ({ ...l, name: i === 0 ? 'Background' : `Layer ${i + 1}` }));
  }
  return { engine: j.engine, layers: list };
}

/** The image layer, as a group of its layers (same box, same fit), bottom to top with growing depth. */
export function splitImageLayer(scene: Scene, id: string, parts: Array<{ name: string; src: string }>): Scene {
  const layer = (findLayer(scene, id) ?? null) as ImageLayer | null;
  if (!layer || layer.type !== 'image' || !parts.length) return scene;
  const n = parts.length;
  const children: Layer[] = parts.map((p, i) => ({
    id: `${id}-l${i + 1}`, type: 'image', name: p.name, src: p.src, alt: i === n - 1 ? layer.alt ?? '' : '', fit: layer.fit ?? 'cover', radius: layer.radius,
    box: { ...layer.box }, overrides: layer.overrides, depth: n > 1 ? Math.round((-0.15 + (0.45 * i) / (n - 1)) * 100) / 100 : undefined, clips: [],
  } as Layer));
  const group: Layer = { id, type: 'group', name: `${layer.name ?? 'Image'} (layers)`, start: layer.start, end: layer.end, link: layer.link, pin: layer.pin, clips: layer.clips, layers: children };
  const replace = (list: Layer[]): Layer[] => list.map((l) => (l.id === id ? group : l.type === 'group' ? { ...l, layers: replace(l.layers) } : l));
  return { ...scene, layers: replace(scene.layers) };
}
