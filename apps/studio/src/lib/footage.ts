import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';

/**
 * Footage kept on this computer. Video files are far too big for the scene file the Studio saves as you
 * work, so a footage layer's src is a short "local:<id>" and the file lives in this browser's database.
 * The preview is sent the file itself; exports and video renders get it written into the scene.
 */

const DB = 'upw-studio-footage';
const STORE = 'files';

function open(): Promise<IDBDatabase> {
  return new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => bad(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((ok, bad) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => ok(req.result);
    req.onerror = () => bad(req.error);
  });
}

const cache = new Map<string, Blob>();

/**
 * A workspace project's file other than sound ("local:ws:<project>/<path>": footage, pictures, models): fetched from the AI Dev Kit by the Studio and handed
 * to the preview like browser footage. The preview's own video player may not reach the kit (a browser's
 * local-network permission covers the page's requests, not always a video player in the preview frame).
 */
const WS = 'local:ws:';
export const wsFootageId = (project: string, path: string) => `${WS}${encodeURIComponent(project)}/${path}`;
export const isWsFootage = (id: string) => id.startsWith(WS);
/** The kit address of a workspace video (127.0.0.1: Chrome rewrites http://localhost media on an https page). */
export async function wsFootageUrl(id: string): Promise<string | null> {
  const b = await kitBase();
  if (!b) return null;
  const [project, ...path] = id.slice(WS.length).split('/');
  return `${b.replace('//localhost:', '//127.0.0.1:')}/studio/workspace/${project}/file/${path.map(encodeURIComponent).join('/')}`;
}

/** Keeps a file; returns its "local:" address. */
export async function putFootage(file: Blob): Promise<string> {
  const id = `local:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  cache.set(id, file);
  try { await tx('readwrite', (s) => s.put(file, id)); } catch { /* private window: kept for this session only */ }
  return id;
}

export async function getFootage(id: string): Promise<Blob | null> {
  if (cache.has(id)) return cache.get(id)!;
  if (isWsFootage(id)) {
    try {
      const url = await wsFootageUrl(id);
      const r = url ? await fetch(url) : null;
      if (!r?.ok) return null;
      const b = await r.blob();
      cache.set(id, b);
      return b;
    } catch { return null; }
  }
  try {
    const b = await tx<Blob | undefined>('readonly', (s) => s.get(id));
    if (b) cache.set(id, b);
    return b ?? null;
  } catch {
    return null;
  }
}

/** Every "local:" address a scene uses. */
export function footageIds(scene: Scene): string[] {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') { if (v.startsWith('local:')) out.add(v); return; }
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(scene.layers);
  return [...out];
}

const asDataUrl = (b: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });

/** The scene with its footage written in (for exports and renders). Footage that is gone is reported. */
export async function withFootage(scene: Scene): Promise<{ scene: Scene; missing: number }> {
  const ids = footageIds(scene);
  if (!ids.length) return { scene, missing: 0 };
  const urls = new Map<string, string>();
  let missing = 0;
  for (const id of ids) {
    // A project's video goes to the kit's renderer as the kit's own address (no need to copy it into the scene).
    if (isWsFootage(id)) { const u = await wsFootageUrl(id); if (u) urls.set(id, u); else missing++; continue; }
    const b = await getFootage(id);
    if (b) urls.set(id, await asDataUrl(b)); else missing++;
  }
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return urls.get(v) ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return { scene: { ...scene, layers: walk(scene.layers) as Scene['layers'] }, missing };
}

/** A video file's length and shape. */
export function probeVideo(file: Blob): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((ok) => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    v.preload = 'metadata';
    v.onloadedmetadata = () => { ok({ duration: v.duration || 0, width: v.videoWidth || 16, height: v.videoHeight || 9 }); URL.revokeObjectURL(url); };
    v.onerror = () => { ok({ duration: 0, width: 16, height: 9 }); URL.revokeObjectURL(url); };
    v.src = url;
  });
}
