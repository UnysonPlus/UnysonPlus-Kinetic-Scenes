import type { MascotLayer, MascotPose, MascotViseme } from '@unysonplus/scene-player/types';

/**
 * Your mascots: saved in this browser (IndexedDB, since pose pictures are too big for local storage) to reuse in any
 * project, and moved as one file (Export / Import: `<name>.mascot.json`, every picture inside it).
 */

export const MASCOT_FILE_FORMAT = 'unysonplus-mascot';

export interface MascotFile {
  format: typeof MASCOT_FILE_FORMAT;
  version: 1;
  name: string;
  poses: MascotPose[];
  pose?: string;
  mouths?: Partial<Record<MascotViseme, string>>;
  talk?: number;
  blink?: boolean;
  breathe?: boolean;
}

export interface SavedMascot { id: string; name: string; saved: number; file: MascotFile }

const DB = 'upw-mascots', STORE = 'mascots';

function open(): Promise<IDBDatabase> {
  return new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE, { keyPath: 'id' }); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => bad(r.error ?? new Error('This browser cannot keep mascots.'));
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((ok, bad) => {
    const t = db.transaction(STORE, mode), r = fn(t.objectStore(STORE));
    r.onsuccess = () => ok(r.result);
    r.onerror = () => bad(r.error);
    t.oncomplete = () => db.close();
  });
}

export async function listMascots(): Promise<SavedMascot[]> {
  try { return (await tx<SavedMascot[]>('readonly', (s) => s.getAll())).sort((a, b) => b.saved - a.saved); } catch { return []; }
}
export const saveMascot = (m: SavedMascot) => tx('readwrite', (s) => s.put(m));
export const deleteMascot = (id: string) => tx('readwrite', (s) => s.delete(id));

/** A picture as a data: address (a project's pictures play from the AI Dev Kit; a saved mascot keeps its own copy). */
async function inline(src: string): Promise<string> {
  if (src.startsWith('data:')) return src;
  const blob = await (await fetch(src)).blob();
  return new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(blob); });
}

/** The mascot as one self-contained file: every picture inside it. */
export async function mascotFile(layer: MascotLayer): Promise<MascotFile> {
  const poses = await Promise.all(layer.poses.map(async (p) => ({ ...p, src: await inline(p.src) })));
  let mouths: MascotFile['mouths'];
  if (layer.mouths) {
    mouths = {};
    for (const [k, v] of Object.entries(layer.mouths)) if (v) mouths[k as MascotViseme] = await inline(v);
  }
  return {
    format: MASCOT_FILE_FORMAT, version: 1, name: layer.name ?? 'Mascot', poses,
    ...(layer.pose ? { pose: layer.pose } : {}), ...(mouths ? { mouths } : {}),
    ...(layer.talk !== undefined ? { talk: layer.talk } : {}), ...(layer.blink === false ? { blink: false } : {}), ...(layer.breathe === false ? { breathe: false } : {}),
  };
}

/** Reads a mascot file (what Export writes), checking it is one. */
export function readMascotFile(text: string): MascotFile {
  let j: unknown;
  try { j = JSON.parse(text); } catch { throw new Error('That is not a mascot file.'); }
  const f = j as MascotFile;
  if (!f || f.format !== MASCOT_FILE_FORMAT || !Array.isArray(f.poses) || !f.poses.length) throw new Error('That is not a mascot file (Export the mascot makes one).');
  if (f.poses.some((p) => typeof p.id !== 'string' || typeof p.src !== 'string' || !(p.ratio > 0))) throw new Error('That mascot file is damaged: a pose is missing its picture.');
  return f;
}

/** The fields a Mascot layer takes from a mascot file. */
export function layerFromFile(f: MascotFile): Partial<MascotLayer> {
  return {
    name: f.name, alt: f.name, poses: f.poses, ...(f.pose ? { pose: f.pose } : {}), ...(f.mouths ? { mouths: f.mouths } : {}),
    ...(f.talk !== undefined ? { talk: f.talk } : {}), ...(f.blink === false ? { blink: false } : {}), ...(f.breathe === false ? { breathe: false } : {}),
  };
}

export function downloadMascot(f: MascotFile) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(f)], { type: 'application/json' }));
  a.download = `${f.name.replace(/[^\w\- ]+/g, '').trim() || 'mascot'}.mascot.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
