import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { findLayer } from './sceneOps';

/**
 * A title behind the subject: text placed between the footage and the person cut out of it, so the person stands in
 * front of the words. Layers later in a list are drawn on top; the cut-out person ("<footage>-person") sits above its
 * footage, so the title goes just below the person.
 */

/** The cut-out person layers in the scene, with the footage each was cut from. */
export function people(scene: Scene): { person: string; footage: string }[] {
  const out: { person: string; footage: string }[] = [];
  const walk = (list: Layer[]) => list.forEach((l) => {
    if (l.type === 'group') walk(l.layers);
    const m = l.type === 'video' ? /^(.*)-person(-\d+)?$/.exec(l.id) : null;
    if (m && findLayer(scene, m[1])) out.push({ person: l.id, footage: m[1] });
  });
  walk(scene.layers);
  return out;
}

/** Footage layers (not cut-outs) the title could go behind a person of. */
export function footageLayers(scene: Scene): Layer[] {
  const out: Layer[] = [];
  const walk = (list: Layer[]) => list.forEach((l) => { if (l.type === 'group') walk(l.layers); else if (l.type === 'video' && !/-person(-\d+)?$/.test(l.id)) out.push(l); });
  walk(scene.layers);
  return out;
}

/** The list a layer is in, and that list's owner (null = the top level). */
function listOf(scene: Scene, id: string): { list: Layer[]; owner: string | null } | null {
  let found: { list: Layer[]; owner: string | null } | null = null;
  const walk = (list: Layer[], owner: string | null) => list.forEach((l) => { if (l.id === id) found = { list, owner }; if (l.type === 'group') walk(l.layers, l.id); });
  walk(scene.layers, null);
  return found;
}

/**
 * Moves the text layer to just below the person, in the person's list (out of its own group if it was in another). A
 * pinned title is unpinned: pinned layers are drawn above everything. Returns the scene and what was changed.
 */
export function putBehind(scene: Scene, textId: string, personId: string): { scene: Scene; unpinned: boolean } {
  const text = findLayer(scene, textId);
  const where = listOf(scene, personId);
  if (!text || !where) return { scene, unpinned: false };
  const unpinned = !!text.pin;
  const moved: Layer = unpinned ? ({ ...text, pin: undefined } as Layer) : text;
  // Take the text out wherever it is, then put it below the person.
  const without = (list: Layer[]): Layer[] => list.filter((l) => l.id !== textId).map((l) => (l.type === 'group' ? ({ ...l, layers: without(l.layers) } as Layer) : l));
  const insert = (list: Layer[]): Layer[] => {
    const i = list.findIndex((l) => l.id === personId);
    return i < 0 ? list : [...list.slice(0, i), moved, ...list.slice(i)];
  };
  const base = without(scene.layers);
  const layers = where.owner === null
    ? insert(base)
    : (function walk(list: Layer[]): Layer[] { return list.map((l) => (l.id === where.owner && l.type === 'group' ? ({ ...l, layers: insert(l.layers) } as Layer) : l.type === 'group' ? ({ ...l, layers: walk(l.layers) } as Layer) : l)); })(base);
  return { scene: { ...scene, layers }, unpinned };
}

/** Is this text already behind a person (directly below one, in the same list)? */
export function isBehind(scene: Scene, textId: string): boolean {
  const where = listOf(scene, textId);
  if (!where) return false;
  const i = where.list.findIndex((l) => l.id === textId);
  const above = where.list.slice(i + 1);
  return above.some((l) => l.type === 'video' && /-person(-\d+)?$/.test(l.id));
}
