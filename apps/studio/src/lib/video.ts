import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';
import { withFootage } from './footage';

/**
 * Video export through the AI Dev Kit: the kit renders the scene in headless Chrome frame by frame
 * (exact, since every frame is a function of time) and encodes it with ffmpeg. The scene picks its
 * breakpoint layout from the video's width, as it would on a screen that size.
 */

export interface VideoOptions {
  width: number;
  height: number;
  fps: number;
  /** mov = ProRes (4444 when see-through), for video editors. */
  format: 'mp4' | 'webm' | 'mov';
  /** See-through background (WebM or ProRes only). */
  transparent?: boolean;
  /** Keep reference footage in the video (a full composite). */
  composite?: boolean;
  /** Also make the cover image (the still frame). */
  cover?: boolean;
}

export const VIDEO_SIZES: Array<{ id: string; label: string; width: number; height: number }> = [
  { id: '1080p', label: 'Full HD 1920 × 1080', width: 1920, height: 1080 },
  { id: '720p', label: 'HD 1280 × 720', width: 1280, height: 720 },
  { id: '4k', label: '4K 3840 × 2160', width: 3840, height: 2160 },
  { id: 'vertical', label: 'Vertical 1080 × 1920 (stories, reels)', width: 1080, height: 1920 },
  { id: 'square', label: 'Square 1080 × 1080', width: 1080, height: 1080 },
];

export type RenderCheck = { ok: true } | { ok: false; reason: 'kit' | 'outdated' | 'ffmpeg' };

/** Whether the kit can render video here. */
export async function canRender(): Promise<RenderCheck> {
  const b = await kitBase();
  if (!b) return { ok: false, reason: 'kit' };
  try {
    const r = await fetch(`${b}/studio/render`, { signal: AbortSignal.timeout(4000) });
    if (r.status === 404) return { ok: false, reason: 'outdated' };
    const j = await r.json();
    return j.ffmpeg ? { ok: true } : { ok: false, reason: 'ffmpeg' };
  } catch {
    return { ok: false, reason: 'kit' };
  }
}

/** Renders the scene; reports progress; resolves with the video file. */
export async function renderVideo(scene: Scene, opts: VideoOptions, onProgress: (done: number, total: number) => void, signal: AbortSignal): Promise<{ blob: Blob; name: string; warnings: string[]; cover?: { blob: Blob; name: string } }> {
  // Footage kept in this browser goes with the scene (the kit renders from the file itself).
  const packed = await withFootage(scene);
  if (packed.missing) throw new Error('Some footage is not on this computer any more (it is kept in the browser where it was added). Add it again, then render.');
  scene = packed.scene;
  const b = await kitBase();
  if (!b) throw new Error('The AI Dev Kit is not running on this computer.');
  // The kit's browser loads the player the Studio uses, from the Studio's own published copy.
  const playerBase = new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href;
  const start = await fetch(`${b}/studio/render`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, signal,
    body: JSON.stringify({ scene, playerBase, ...opts }),
  });
  const sj = await start.json().catch(() => ({}));
  if (!start.ok) throw new Error(sj.error || `The AI Dev Kit answered ${start.status}.`);
  const id: string = sj.id;
  const cancel = () => { fetch(`${b}/studio/render/${id}/cancel`, { method: 'POST' }).catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    for (;;) {
      await new Promise((r) => setTimeout(r, 700));
      if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
      const st = await (await fetch(`${b}/studio/render/${id}`, { signal })).json();
      if (st.state === 'error' || st.state === 'cancelled') throw new Error(st.error || 'The render stopped.');
      onProgress(st.done ?? 0, st.total ?? 0);
      if (st.state === 'done') {
        const file = await fetch(`${b}/studio/render/${id}/file`, { signal });
        if (!file.ok) throw new Error('The finished video could not be downloaded from the kit.');
        let cover: { blob: Blob; name: string } | undefined;
        if (st.cover) {
          const c = await fetch(`${b}/studio/render/${id}/cover`, { signal });
          if (c.ok) cover = { blob: await c.blob(), name: st.cover };
        }
        // What never arrived before the first frame (a font, an image, a 3D model), if anything.
        return { blob: await file.blob(), name: st.name, warnings: Array.isArray(st.warnings) ? st.warnings : [], cover };
      }
    }
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
