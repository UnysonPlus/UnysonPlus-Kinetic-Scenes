import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase, kitHas, kitStatus } from './ai';
import { getFootage } from './footage';

/**
 * The workspace: projects as folders on the user's computer, kept by the AI Dev Kit
 * (<workspace>/<project>/scene.json + media/ + renders/). The Studio and an AI agent work on the same files:
 * the agent edits them directly, the Studio saves through the kit and hears about outside changes at once.
 *
 * In the folder, media is referred to by paths relative to the project ("media/voice.wav"). In the Studio the
 * same media plays from the kit (http://127.0.0.1:8787/studio/workspace/<id>/file/media/voice.wav), so a scene
 * is translated on the way in and back on the way out. Footage kept in this browser ("local:…") and large
 * embedded files (data: addresses: music, voice) are written into media/ when the project is saved.
 */

export interface ProjectInfo { id: string; title: string; duration: number; updated: number }
export interface OpenProject { id: string; mtime: number }

const MEDIA = /^(?![a-z][a-z0-9+.-]*:)(?!\/)[^\s?#]+\.(mp4|webm|mov|m4v|mp3|wav|m4a|ogg|aac|flac|png|jpe?g|webp|gif|avif|svg|glb|gltf|riv|lottie|json|vtt|srt)$/i;
/** Embedded files above this size are moved into media/ (small icons can stay in the scene). */
const INLINE_LIMIT = 48 * 1024;

export async function workspaceAvailable(): Promise<boolean> {
  if (!(await kitBase())) return false;
  if (!kitHas('workspace')) await kitStatus();
  return kitHas('workspace');
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const b = await kitBase();
  if (!b) throw new Error('The AI Dev Kit is not running on this computer.');
  const r = await fetch(`${b}/studio/workspace${path}`, init);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || `The kit answered ${r.status}.`), { status: r.status, current: j.current });
  return j as T;
}

const enc = (id: string) => encodeURIComponent(id);
const post = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

function mapStrings<T>(v: T, fn: (s: string) => string): T {
  if (typeof v === 'string') return fn(v) as T;
  if (Array.isArray(v)) return v.map((x) => mapStrings(x, fn)) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, fn)])) as T;
  return v;
}

async function fileBase(id: string) {
  return `${await kitBase()}/studio/workspace/${enc(id)}/file/`;
}

/** Relative project paths → addresses the Studio can play. */
export async function toStudio(id: string, scene: Scene): Promise<Scene> {
  const base = await fileBase(id);
  return mapStrings(scene, (s) => (MEDIA.test(s) ? base + s.split('/').map(encodeURIComponent).join('/') : s));
}

const uploaded = new Map<string, string>(); // "local:…" or a data: address → its media path, per project

async function upload(id: string, name: string, blob: Blob): Promise<string> {
  const r = await call<{ path: string }>(`/${enc(id)}/media?name=${encodeURIComponent(name)}`, { method: 'POST', body: blob });
  return r.path;
}

const EXT: Record<string, string> = { 'audio/mpeg': '.mp3', 'audio/wav': '.wav', 'audio/x-wav': '.wav', 'audio/mp4': '.m4a', 'audio/ogg': '.ogg', 'video/mp4': '.mp4',
  'video/webm': '.webm', 'video/quicktime': '.mov', 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' };

/** The scene as it is kept in the folder: relative paths, browser footage and big embedded files written to media/. */
export async function toFolder(id: string, scene: Scene): Promise<Scene> {
  const base = await fileBase(id);
  const todo = new Set<string>();
  mapStrings(scene, (s) => { if (s.startsWith('local:') || (s.startsWith('data:') && s.length > INLINE_LIMIT)) todo.add(s); return s; });
  for (const s of todo) {
    const key = `${id}\n${s}`;
    if (uploaded.has(key)) continue;
    let blob: Blob | null = null;
    if (s.startsWith('local:')) blob = await getFootage(s);
    else blob = await (await fetch(s)).blob();
    if (!blob) continue; // footage that is gone stays as it was (the Studio already says so)
    const type = blob.type || (s.startsWith('data:') ? s.slice(5, s.indexOf(';')) : '');
    const kind = type.startsWith('video') ? 'footage' : type.startsWith('audio') ? 'sound' : 'image';
    uploaded.set(key, await upload(id, `${kind}${EXT[type] ?? ''}`, blob));
  }
  return mapStrings(scene, (s) => {
    if (s.startsWith(base)) return s.slice(base.length).split('/').map(decodeURIComponent).join('/');
    return uploaded.get(`${id}\n${s}`) ?? s;
  });
}

export const listProjects = () => call<{ root: string; projects: ProjectInfo[] }>('');

export async function createProject(name: string, scene: Scene): Promise<OpenProject> {
  const created = await call<OpenProject>('', post({ name }));
  // The scene's footage and big embedded files go into the new folder too.
  const packed = await toFolder(created.id, { ...scene, title: name });
  return saveProject(created.id, packed, created.mtime, true);
}

export async function readProject(id: string): Promise<{ scene: Scene; mtime: number }> {
  const r = await call<{ scene: Scene; mtime: number }>(`/${enc(id)}`);
  return { scene: await toStudio(id, r.scene), mtime: r.mtime };
}

/**
 * Saves the scene into the project. When the file changed on disk since `base` (an agent edited it), throws an
 * error with status 409 and `current` (the version on disk, translated for the Studio).
 */
export async function saveProject(id: string, scene: Scene, base: number, packed = false): Promise<OpenProject> {
  const body = packed ? scene : await toFolder(id, scene);
  try {
    return await call<OpenProject>(`/${enc(id)}`, post({ scene: body, base }));
  } catch (e) {
    const err = e as Error & { status?: number; current?: { scene: Scene; mtime: number } };
    if (err.status === 409 && err.current) err.current = { scene: await toStudio(id, err.current.scene), mtime: err.current.mtime };
    throw err;
  }
}

/** Calls back when someone else changes the project (an agent, another window). Returns a stop function. */
export function watchProject(id: string, onChange: (ev: { kind: 'scene' | 'media'; mtime?: number }) => void): () => void {
  let es: EventSource | null = null;
  let stopped = false;
  kitBase().then((b) => {
    if (!b || stopped) return;
    es = new EventSource(`${b}/studio/workspace/${enc(id)}/events`);
    es.onmessage = (m) => { try { onChange(JSON.parse(m.data)); } catch { /* not ours */ } };
  });
  return () => { stopped = true; es?.close(); };
}

export const revealProject = (id?: string) => call<{ dir: string }>(id ? `/${enc(id)}/reveal` : '/reveal', { method: 'POST' });
