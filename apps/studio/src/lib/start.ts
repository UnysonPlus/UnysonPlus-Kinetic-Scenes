import type { VideoSettings } from '@unysonplus/scene-player/types';

/** The start screen: what it offers, when it opens, and how a choice becomes a request for AI assist. */
const HIDE_KEY = 'upw-start-hide';

export function startHidden(): boolean {
  try { return localStorage.getItem(HIDE_KEY) === '1'; } catch { return false; }
}

export function setStartHidden(hidden: boolean) {
  try { if (hidden) localStorage.setItem(HIDE_KEY, '1'); else localStorage.removeItem(HIDE_KEY); } catch { /* private window */ }
}

/** Opens with the Studio, unless the person turned it off or arrived with a job: an agent's project link, or a page editor. */
export function shouldShowStart(search: string, hidden = startHidden()): boolean {
  const q = new URLSearchParams(search);
  return !hidden && !q.has('project') && !q.has('connect');
}

export interface StartFormat { id: string; label: string; hint: string; video: VideoSettings | null }

export const START_FORMATS: StartFormat[] = [
  { id: 'reel', label: 'Reel', hint: '9:16 for Reels, Shorts and TikTok', video: { formats: ['9x16'], platform: 'reels' } },
  { id: 'wide', label: 'Video', hint: '16:9 for YouTube and websites', video: { formats: ['16x9'], platform: 'youtube' } },
  { id: 'square', label: 'Square', hint: '1:1 for feeds', video: { formats: ['1x1'], platform: 'none' } },
  { id: 'web', label: 'Web animation', hint: 'Plays on a page, on every screen size', video: null },
];

export const START_LENGTHS = [15, 20, 30, 45, 60];

/** A web address as typed, made complete; null when it cannot be one. */
export function startUrl(typed: string): string | null {
  const t = typed.trim();
  if (!t || /\s/.test(t)) return null;
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`);
    return /^https?:$/.test(u.protocol) && u.hostname.includes('.') ? u.href : null;
  } catch { return null; }
}

export interface StartChoice {
  /** What the person described; for a website, what it should focus on (may be empty). */
  text: string;
  /** Start from this website. */
  url?: string;
  format: StartFormat;
  /** Seconds; 0 leaves the length to the AI. */
  seconds: number;
}

/** The request AI assist takes from the start screen. */
export function startRequest(c: StartChoice) {
  const about = c.text.trim();
  const brief = [
    c.format.video ? `MAKE A VIDEO in ${c.format.video.formats[0].replace('x', ':')}: ${c.format.hint}.` : '',
    c.seconds ? `LENGTH: about ${c.seconds} seconds.` : '',
    c.url && about ? `FOCUS: ${about}` : '',
  ].filter(Boolean).join('\n');
  return { text: about || (c.url ?? ''), scope: 'new' as const, ...(c.url ? { url: c.url } : {}), ...(brief ? { brief } : {}) };
}
