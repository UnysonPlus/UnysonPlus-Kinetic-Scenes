import type { Layer, Scene, VideoLayer } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { getFootage, putFootage } from './footage';
import { addAudio } from './audio';
import { findLayer, layersIn } from './sceneOps';

/**
 * Footage tools in the AI Dev Kit: cut the person out (a see-through copy placed above the graphics), follow
 * the face (a path the Follow preset uses), and take the footage's sound out as a voice track (to transcribe for
 * captions). Everything runs on this computer.
 */

async function kit(): Promise<string> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  return b;
}

const asDataUrl = (b: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });

/** The footage file as a data: URL, wherever it is kept. */
async function footageData(src: string): Promise<string> {
  if (src.startsWith('data:')) return src;
  if (src.startsWith('local:')) {
    const b = await getFootage(src);
    if (!b) throw new Error('This footage is not on this computer any more. Add it again.');
    return asDataUrl(b);
  }
  const r = await fetch(src);
  if (!r.ok) throw new Error(`Could not download the footage (${r.status}).`);
  return asDataUrl(await r.blob());
}

async function post(path: string, body: unknown, signal?: AbortSignal) {
  const r = await fetch(`${await kit()}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j;
}

interface MatteResult { src?: string; track?: VideoLayer['track'] }

/** How the person is cut out: fast (a body outline), fine (fine edges, the default), rvm (Robust Video Matting), hold (the person and what they hold, clicked on the first frame). */
export type CutoutMethod = 'fine' | 'fast' | 'rvm' | 'hold';
export interface MethodInfo { ready: boolean; note: string; downloaded?: boolean }

/** Which cut-out methods the kit has, and a line on each (sam2 is listed but not available yet). */
export async function cutoutMethods(): Promise<Record<string, MethodInfo> | null> {
  try {
    const r = await fetch(`${await kit()}/studio/matte/methods`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    return (await r.json()).methods ?? null;
  } catch { return null; }
}

async function matte(layer: VideoLayer, opts: { cutout: boolean; faces: boolean; quality?: CutoutMethod; points?: { x: number; y: number }[]; onStep: (s: string) => void; signal?: AbortSignal }): Promise<MatteResult> {
  const src = await footageData(layer.src);
  const b = await kit();
  const { id } = await post('/studio/matte', { src, cutout: opts.cutout, faces: opts.faces, quality: opts.quality, points: opts.points }, opts.signal);
  for (;;) {
    await new Promise((r) => setTimeout(r, 1200));
    if (opts.signal?.aborted) throw Object.assign(new Error('Stopped.'), { name: 'AbortError' });
    const s = await (await fetch(`${b}/studio/matte/${id}`, { signal: opts.signal })).json();
    if (s.state === 'error') throw new Error(s.error);
    opts.onStep(s.total ? `${s.step} (${Math.round((s.done / s.total) * 100)}%)` : s.step);
    if (s.state === 'done') return s.result as MatteResult;
  }
}

function setLayer(scene: Scene, id: string, patch: Partial<VideoLayer>): Scene {
  const walk = (list: Layer[]): Layer[] => list.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l));
  return { ...scene, layers: walk(scene.layers) };
}

/** The group a layer is in (null = the top level). */
function containerOf(scene: Scene, id: string): string | null {
  let found: string | null = null;
  const walk = (list: Layer[], parent: string | null) => list.forEach((l) => { if (l.id === id) found = parent; if (l.type === 'group') walk(l.layers, l.id); });
  walk(scene.layers, null);
  return found;
}

/**
 * Cuts the person out: a see-through copy of the footage, in step with it (same timing, place and frame), at the
 * top of its group so the graphics go behind the person. Also keeps the face path on the footage.
 */
export async function cutOutPerson(scene: Scene, layerId: string, quality: CutoutMethod, onStep: (s: string) => void, signal?: AbortSignal, points?: { x: number; y: number }[]): Promise<{ scene: Scene; id: string }> {
  const layer = findLayer(scene, layerId) as VideoLayer | undefined;
  if (!layer || layer.type !== 'video') throw new Error('Select a footage layer.');
  const r = await matte(layer, { cutout: true, faces: true, quality, points, onStep, signal });
  if (!r.src) throw new Error('The cut-out came back empty.');
  const blob = await (await fetch(r.src)).blob();
  const local = await putFootage(blob);
  let id = `${layer.id}-person`;
  let n = 2;
  while (findLayer(scene, id)) id = `${layer.id}-person-${n++}`;
  const person: VideoLayer = {
    id, type: 'video', name: `${layer.name ?? layer.id} (person)`, src: local, box: layer.box, fit: layer.fit, radius: layer.radius, frame: layer.frame,
    start: layer.start, end: layer.end, offset: layer.offset, rate: layer.rate, overrides: layer.overrides, track: r.track, clips: [],
  };
  let next = setLayer(scene, layer.id, { track: r.track });
  const parent = containerOf(next, layer.id);
  const list = layersIn(next, parent);
  const place = (l: Layer[]): Layer[] => [...l, person];
  if (parent === null) next = { ...next, layers: place(list) };
  else {
    const walk = (ls: Layer[]): Layer[] => ls.map((l) => (l.id === parent && l.type === 'group' ? ({ ...l, layers: place(l.layers) } as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l));
    next = { ...next, layers: walk(next.layers) };
  }
  return { scene: next, id };
}

/** Finds the face in every frame and keeps the path on the footage (for the Follow preset). */
export async function followFace(scene: Scene, layerId: string, onStep: (s: string) => void, signal?: AbortSignal): Promise<Scene> {
  const layer = findLayer(scene, layerId) as VideoLayer | undefined;
  if (!layer || layer.type !== 'video') throw new Error('Select a footage layer.');
  const r = await matte(layer, { cutout: false, faces: true, onStep, signal });
  if (!r.track?.length) throw new Error('No face was found in this footage.');
  return setLayer(scene, layer.id, { track: r.track });
}

/** Takes the footage's sound out as a voice track in step with it (transcribe it for captions); the footage goes quiet. */
export async function useFootageSound(scene: Scene, layerId: string): Promise<{ scene: Scene; id: string }> {
  const layer = findLayer(scene, layerId) as VideoLayer | undefined;
  if (!layer || layer.type !== 'video') throw new Error('Select a footage layer.');
  const r = await post('/studio/footage-audio', { src: await footageData(layer.src) });
  const start = layer.start ?? 0;
  const end = typeof layer.end === 'number' ? layer.end : scene.duration;
  const a = addAudio(setLayer(scene, layer.id, { sound: undefined }), {
    name: `${layer.name ?? layer.id} (sound)`, src: r.src, start, role: 'voice', offset: layer.offset || undefined,
    duration: Math.round(Math.min(end - start, r.seconds - (layer.offset ?? 0)) * 100) / 100,
  });
  return a;
}
