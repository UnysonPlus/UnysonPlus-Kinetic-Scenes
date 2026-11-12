import type { Scene } from '@unysonplus/scene-player/types';
import { validateScene } from '@unysonplus/scene-player/validate';

/**
 * Share links with no server: the scene file, compressed, travels in the link itself
 * (#s=1.<base64url of deflate-raw JSON>). The part after # never reaches any server, GitHub Pages
 * included, so a shared scene stays between the people who have the link.
 */

const PREFIX = '#s=';

const toB64Url = (bytes: Uint8Array) => {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

/** The share link for a scene (on this Studio's address). */
export async function shareLink(scene: Scene): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(scene));
  const data = typeof CompressionStream === 'function'
    ? `1.${toB64Url(await pipe(json, new CompressionStream('deflate-raw')))}`
    : `0.${toB64Url(json)}`;
  return `${location.origin}${location.pathname}${PREFIX}${data}`;
}

/** True when the page was opened with a shared scene in its address. */
export const hasSharedScene = () => location.hash.startsWith(PREFIX);

export type SharedResult = { ok: true; scene: Scene; strippedCode: number } | { ok: false; error: string };

/**
 * Reads the shared scene from the address. Custom code clips are removed: a link can come from anyone,
 * and code is the one part of a scene that could act on the computer that opens it.
 */
export async function readSharedScene(): Promise<SharedResult> {
  try {
    const raw = location.hash.slice(PREFIX.length);
    const dot = raw.indexOf('.');
    const kind = raw.slice(0, dot);
    const bytes = fromB64Url(raw.slice(dot + 1));
    const json = kind === '1' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes;
    const r = validateScene(JSON.parse(new TextDecoder().decode(json)));
    if (!r.ok) return { ok: false, error: r.errors[0] ?? 'it is not a valid scene' };
    return { ok: true, scene: r.scene, strippedCode: stripCode(r.scene) };
  } catch {
    return { ok: false, error: 'the link is damaged or incomplete (it may have been cut short when it was copied)' };
  }
}

/**
 * Removes custom code clips (in place) and says how many: a scene from a link can come from anyone, and code is
 * the one part of a scene that could act on the computer that opens it.
 */
export function stripCode(scene: Scene): number {
  let stripped = 0;
  type L = { clips: Array<{ preset: string }>; layers?: L[] };
  const walk = (list: L[]) => list.forEach((l) => {
    const before = l.clips.length;
    l.clips = l.clips.filter((c) => c.preset !== 'code');
    stripped += before - l.clips.length;
    if (l.layers) walk(l.layers);
  });
  walk(scene.layers as unknown as L[]);
  return stripped;
}

/** Removes the shared scene from the address, so a reload doesn't load it again over later edits. */
export function clearShareHash() {
  history.replaceState(null, '', location.pathname + location.search);
}
