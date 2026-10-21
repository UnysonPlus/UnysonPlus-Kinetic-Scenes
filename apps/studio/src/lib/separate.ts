import type { AudioClip, Layer, Scene, VideoLayer } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { getFootage } from './footage';
import { addAudio, removeAudio } from './audio';
import { findLayer } from './sceneOps';

/**
 * Voice and music separation in the AI Dev Kit: a clip's sound becomes two tracks in step with it, the voice and
 * everything else (the music and effects). Transcribe the voice alone for cleaner word times, mute or replace the
 * music, or leave both: a music track is ducked under the voice automatically. Runs on this computer.
 */

async function kit(): Promise<string> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  return b;
}

const asDataUrl = (b: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });

async function fileData(src: string): Promise<string> {
  if (src.startsWith('data:')) return src;
  if (src.startsWith('local:')) {
    const b = await getFootage(src);
    if (!b) throw new Error('This file is not on this computer any more. Add it again.');
    return asDataUrl(b);
  }
  const r = await fetch(src);
  if (!r.ok) throw new Error(`Could not download the file (${r.status}).`);
  return asDataUrl(await r.blob());
}

async function call(path: string, init?: RequestInit) {
  const r = await fetch(`${await kit()}${path}`, init);
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && !path.match(/\/studio\/separate\/s/)) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j;
}

/** Installs the separation (about 170 MB, once) when it is missing, asking first. */
async function ensureInstalled(onStep: (s: string) => void, signal?: AbortSignal) {
  const st = await call('/studio/separate');
  if (st.runtime && st.model) return;
  if (!window.confirm(`Voice and music separation downloads a model of about ${st.mb ?? 170} MB to the AI Dev Kit, once. It then runs offline on this computer. Download it now?`)) {
    throw Object.assign(new Error('Stopped.'), { name: 'AbortError' });
  }
  await call('/studio/separate/install', { method: 'POST' });
  for (;;) {
    await new Promise((r) => setTimeout(r, 1500));
    if (signal?.aborted) throw Object.assign(new Error('Stopped.'), { name: 'AbortError' });
    const s = await call('/studio/separate');
    const i = s.install;
    if (i?.state === 'error') throw new Error(i.error);
    onStep(i?.total ? `${i.step} (${Math.round((i.done / i.total) * 100)}%)` : i?.step ?? 'Installing');
    if (s.runtime && s.model) return;
  }
}

async function separate(src: string, onStep: (s: string) => void, signal?: AbortSignal): Promise<{ voice: string; music: string; seconds: number }> {
  await ensureInstalled(onStep, signal);
  onStep('Reading the sound');
  const { id } = await call('/studio/separate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ src: await fileData(src) }), signal });
  for (;;) {
    await new Promise((r) => setTimeout(r, 1200));
    if (signal?.aborted) throw Object.assign(new Error('Stopped.'), { name: 'AbortError' });
    const s = await call(`/studio/separate/${id}`, { signal });
    if (s.state === 'error') throw new Error(s.error);
    onStep(s.total ? `${s.step} (${Math.round((s.done / s.total) * 100)}%)` : s.step);
    if (s.state === 'done') return s.result;
  }
}

function setLayer(scene: Scene, id: string, patch: Partial<VideoLayer>): Scene {
  const walk = (list: Layer[]): Layer[] => list.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l));
  return { ...scene, layers: walk(scene.layers) };
}

function addPair(scene: Scene, name: string, r: { voice: string; music: string }, at: Pick<AudioClip, 'start' | 'offset' | 'duration'>) {
  const v = addAudio(scene, { name: `${name} (voice)`, src: r.voice, role: 'voice', ...at });
  const m = addAudio(v.scene, { name: `${name} (music)`, src: r.music, role: 'music', ...at });
  return { scene: m.scene, voice: v.id, music: m.id };
}

/** Footage: its sound as a voice track and a music track in step with it; the footage itself goes quiet. */
export async function separateFootage(scene: Scene, layerId: string, onStep: (s: string) => void, signal?: AbortSignal) {
  const layer = findLayer(scene, layerId) as VideoLayer | undefined;
  if (!layer || layer.type !== 'video') throw new Error('Select a footage layer.');
  const r = await separate(layer.src, onStep, signal);
  const start = layer.start ?? 0;
  const end = typeof layer.end === 'number' ? layer.end : scene.duration;
  const duration = Math.round(Math.min(end - start, r.seconds - (layer.offset ?? 0)) * 100) / 100;
  return addPair(setLayer(scene, layer.id, { sound: undefined }), layer.name ?? layer.id, r, { start, offset: layer.offset || undefined, duration });
}

/** An audio clip: replaced by its voice and its music, at the same place and trim. */
export async function separateClip(scene: Scene, clipId: string, onStep: (s: string) => void, signal?: AbortSignal) {
  const clip = (scene.audio ?? []).find((a) => a.id === clipId);
  if (!clip) throw new Error('Select an audio clip.');
  const r = await separate(clip.src, onStep, signal);
  const { volume, fadeIn, fadeOut } = clip;
  const out = addPair(removeAudio(scene, clip.id), clip.name ?? clip.id, r, { start: clip.start, offset: clip.offset, duration: clip.duration });
  // Keep the clip's own level and fades on both halves.
  out.scene = { ...out.scene, audio: (out.scene.audio ?? []).map((a) => (a.id === out.voice || a.id === out.music ? { ...a, ...(volume !== undefined ? { volume } : {}), ...(fadeIn ? { fadeIn } : {}), ...(fadeOut ? { fadeOut } : {}) } : a)) };
  return out;
}
