import { kitBase } from './ai';

/** FFmpeg's own download page, for anyone who prefers to install it themselves. */
export const FFMPEG_LINK = 'https://ffmpeg.org/download.html';

export interface FfmpegInstall { state: 'running' | 'done' | 'error'; step: string; done: number; total: number; error: string }

export interface FfmpegStatus {
  ffmpeg: boolean;
  ffprobe: boolean;
  version: string | null;
  source: 'kit' | 'system' | null;
  /** Whether the kit can install it on this computer. */
  canInstall: boolean;
  /** How: a checksummed download into the kit's folder, or Homebrew on macOS. */
  by: 'download' | 'brew' | null;
  mb: number | null;
  link: string;
  install: FfmpegInstall | null;
}

/** What the kit says about FFmpeg; null with no kit, or one too old to install it. */
export async function ffmpegStatus(): Promise<FfmpegStatus | null> {
  const b = await kitBase();
  if (!b) return null;
  try {
    const r = await fetch(`${b}/studio/ffmpeg`, { signal: AbortSignal.timeout(15000) });
    return r.ok ? await r.json() as FfmpegStatus : null;
  } catch {
    return null;
  }
}

/** Asks the kit to install FFmpeg and follows it; resolves when it is ready, throws with the reason when it can't. */
export async function installFfmpeg(onProgress: (i: FfmpegInstall) => void, signal?: AbortSignal): Promise<void> {
  const b = await kitBase();
  if (!b) throw new Error('The AI Dev Kit isn\'t running.');
  const r = await fetch(`${b}/studio/ffmpeg/install`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || `The kit answered ${r.status}.`);
  for (;;) {
    await new Promise((ok) => setTimeout(ok, 700));
    if (signal?.aborted) return;
    const st = await ffmpegStatus();
    const i = st?.install;
    if (!i) throw new Error('The kit stopped answering.');
    onProgress(i);
    if (i.state === 'done') return;
    if (i.state === 'error') throw new Error(i.error);
  }
}
