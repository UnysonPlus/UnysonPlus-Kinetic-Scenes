import type { Breakpoint, VideoFormat, VideoSettings } from './types';

/** The video formats: their shape, full-HD pixel size and the layout (breakpoint) that serves each. */
export const VIDEO_FORMATS: Record<VideoFormat, { label: string; aspect: [number, number]; width: number; height: number; minRatio?: number }> = {
  '9x16': { label: 'Vertical 9:16', aspect: [9, 16], width: 1080, height: 1920 },
  '4x5': { label: 'Portrait 4:5', aspect: [4, 5], width: 1080, height: 1350, minRatio: 0.7 },
  '1x1': { label: 'Square 1:1', aspect: [1, 1], width: 1080, height: 1080, minRatio: 0.9 },
  '16x9': { label: 'Landscape 16:9', aspect: [16, 9], width: 1920, height: 1080, minRatio: 1.4 },
};

/** A format's layout: every one starts at width 0 and is told apart by its shape (the video's width / height). */
export function formatBreakpoint(f: VideoFormat, smallest: boolean): Breakpoint {
  const v = VIDEO_FORMATS[f];
  // The narrowest shape takes no minRatio, so it is the fallback the player always finds.
  return { id: f, label: v.label, minWidth: 0, aspect: v.aspect, ...(smallest || v.minRatio === undefined ? {} : { minRatio: v.minRatio }) };
}

/** The breakpoints for a set of formats (the narrowest shape is the fallback). */
export function formatBreakpoints(formats: VideoFormat[]): Breakpoint[] {
  const ratio = (f: VideoFormat) => VIDEO_FORMATS[f].aspect[0] / VIDEO_FORMATS[f].aspect[1];
  const narrowest = [...formats].sort((a, b) => ratio(a) - ratio(b))[0];
  return formats.map((f) => formatBreakpoint(f, f === narrowest));
}

export interface Zone { x: number; y: number; w: number; h: number; label: string }

/**
 * Where each app covers a vertical video with its own buttons, captions and bars, in % of the frame
 * (x, y, w, h). Approximate and generous: the apps change them from time to time, and keeping clear of
 * the outer edge of each is what matters.
 */
export const SAFE_ZONES: Record<NonNullable<VideoSettings['platform']>, { vertical: Zone[]; landscape: Zone[] }> = {
  tiktok: {
    vertical: [
      { x: 0, y: 0, w: 100, h: 8, label: 'Tabs' },
      { x: 86, y: 30, w: 14, h: 50, label: 'Buttons' },
      { x: 0, y: 80, w: 100, h: 20, label: 'Caption and sound' },
    ],
    landscape: [],
  },
  reels: {
    vertical: [
      { x: 0, y: 0, w: 100, h: 11, label: 'Header' },
      { x: 86, y: 45, w: 14, h: 37, label: 'Buttons' },
      { x: 0, y: 78, w: 100, h: 22, label: 'Caption and account' },
    ],
    landscape: [],
  },
  shorts: {
    vertical: [
      { x: 0, y: 0, w: 100, h: 8, label: 'Header' },
      { x: 85, y: 40, w: 15, h: 42, label: 'Buttons' },
      { x: 0, y: 80, w: 100, h: 20, label: 'Title and channel' },
    ],
    landscape: [],
  },
  youtube: {
    vertical: [{ x: 0, y: 88, w: 100, h: 12, label: 'Player controls' }],
    landscape: [{ x: 0, y: 88, w: 100, h: 12, label: 'Player controls' }],
  },
  none: { vertical: [], landscape: [] },
};

/** The zones that apply to one format on a platform (vertical apps place theirs over 9:16 and 4:5). */
export function zonesFor(platform: VideoSettings['platform'], format: VideoFormat): Zone[] {
  const z = SAFE_ZONES[platform ?? 'none'] ?? SAFE_ZONES.none;
  if (format === '16x9') return z.landscape;
  // Over 4:5 and 1:1 the apps show the same bars, scaled to the shorter frame: only the bottom caption matters.
  if (format === '9x16') return z.vertical;
  return z.vertical.filter((r) => r.y > 50);
}

/** The longest video each platform takes, in seconds. */
export const PLATFORM_LIMITS: Record<string, { label: string; max: number; best: number }> = {
  tiktok: { label: 'TikTok', max: 600, best: 60 },
  reels: { label: 'Reels', max: 180, best: 30 },
  shorts: { label: 'Shorts', max: 180, best: 45 },
  youtube: { label: 'YouTube', max: 43200, best: 600 },
};

/** Is this a video scene? */
export const isVideo = (scene: { mode?: string; video?: unknown }) => scene.mode === 'video' && !!scene.video;
