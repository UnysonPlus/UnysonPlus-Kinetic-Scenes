import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { getFootage, isWsFootage, wsFootageUrl } from './footage';

/** A file the Studio keeps (in this browser or a workspace project) as a data: URL the AI Dev Kit can read. */
async function asData(src: string): Promise<string> {
  let blob: Blob | null = null;
  if (isWsFootage(src)) { const u = await wsFootageUrl(src); if (u) blob = await (await fetch(u)).blob(); }
  else if (src.startsWith('local:')) blob = await getFootage(src);
  if (!blob) return src;
  return new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(blob!); });
}

/** The scene with every 3D model the kit couldn't read itself (browser and project files) as data, for the kit's player. */
async function withReadableModels(scene: Scene): Promise<Scene> {
  const copy: Scene = JSON.parse(JSON.stringify(scene));
  const walk = async (list: Layer[]) => {
    for (const l of list) {
      if (l.type === 'model' && l.model.src && l.model.src.startsWith('local:')) l.model.src = await asData(l.model.src);
      if (l.type === 'group') await walk(l.layers);
    }
  };
  await walk(copy.layers);
  return copy;
}

/**
 * Asks the AI Dev Kit for a path-traced still of a 3D layer (its model rendered in Blender's Cycles at the scene's
 * still frame, at the pose and camera the player shows it with). Resolves with the picture (a PNG data: URL) and the
 * moment it was made for.
 */
export async function renderStill(scene: Scene, layerId: string): Promise<{ still: string; at: number; seconds: number; device: string }> {
  const b = await kitBase();
  if (!b) throw new Error('This needs the AI Dev Kit running on this computer, with Blender installed.');
  const body = { scene: await withReadableModels(scene), layerId, playerBase: new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href };
  const r = await fetch(`${b}/studio/still`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return { still: j.still, at: j.at, seconds: j.seconds, device: j.device };
}
