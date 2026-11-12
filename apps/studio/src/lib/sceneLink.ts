import type { Scene } from '@unysonplus/scene-player/types';
import { validateScene } from '@unysonplus/scene-player/validate';
import { MEDIA, mapStrings } from './workspace';
import { stripCode } from './share';

/**
 * Scene links: `?scene=<address of a scene.json>` opens a copy of a scene published on the web, for example the
 * reel on a share page, so whoever received it can change the words or pictures and export their own video.
 *
 * The scene's media paths ("media/p02.jpg") are relative to the scene file, so they become addresses in the same
 * folder. Only addresses on unysonplus.com sites are opened: a link to the Studio must never show someone else's
 * content under its name. The folder must allow the Studio to read it (CORS).
 */
const ALLOWED = /(^|\.)unysonplus\.com$/i;

export function sceneLinkUrl(search: string): URL | null {
  const raw = new URLSearchParams(search).get('scene');
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && ALLOWED.test(u.hostname) ? u : null;
  } catch {
    return null;
  }
}

export async function readSceneLink(url: URL): Promise<{ scene: Scene; strippedCode: number }> {
  const r = await fetch(url.href, { mode: 'cors', credentials: 'omit' });
  if (!r.ok) throw new Error(r.status === 404 ? 'it is no longer online' : `the site answered ${r.status}`);
  const data = await r.json().catch(() => { throw new Error('it is not a scene file'); });
  const abs = mapStrings(data as Scene, (s) => (MEDIA.test(s) ? new URL(s.split('/').map(encodeURIComponent).join('/'), url).href : s));
  const v = validateScene(abs);
  if (!v.ok) throw new Error(v.errors[0]);
  return { scene: v.scene, strippedCode: stripCode(v.scene) };
}

/** Takes ?scene= out of the address once read, so a reload keeps the person's edits instead of the original. */
export function clearSceneLink() {
  const q = new URLSearchParams(location.search);
  q.delete('scene');
  const rest = q.toString();
  history.replaceState(null, '', location.pathname + (rest ? `?${rest}` : '') + location.hash);
}
