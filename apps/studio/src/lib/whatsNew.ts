/**
 * What's new: the list behind Help › What's new and the start screen. Add new features at the top and change NEWS_ID:
 * that brings the New tags back for everyone until they open the list.
 */
export type NewsAction = 'listen' | 'physics' | 'paper';
export interface NewsItem { id: string; title: string; /** A few words for the start screen. */ short: string; text: string; doc: string; action?: NewsAction }

const DOCS = 'https://docs.unysonplus.com/kinetic-scenes/';

export const NEWS_ID = '2026-11-06';

export const WHATS_NEW: NewsItem[] = [
  { id: 'listener', title: 'Second listener', short: 'Notes on your voice-over before you render', text: 'Before you render, Gemini hears your scene and gives timed notes on how it comes across. Needs the AI Dev Kit and your own free key.', doc: `${DOCS}second-listener`, action: 'listen' },
  { id: 'physics', title: 'Drop with physics', short: 'Layers that fall and pile up', text: 'Select some layers and they fall, bounce and pile up like real objects.', doc: `${DOCS}sketch-and-physics`, action: 'physics' },
  { id: 'hand-drawn', title: 'Hand-drawn shapes', short: 'Pencil lines and scribbled fills', text: 'Select a shape and click Make it hand-drawn for wobbly pencil lines and scribbled fills.', doc: `${DOCS}sketch-and-physics` },
  { id: 'paper', title: 'Paper cut-out explainers', short: 'Ideas told in cut paper', text: 'Any idea acted out in a small world of cut paper.', doc: `${DOCS}paper-cut-out`, action: 'paper' },
];

const KEY = 'upw-news-seen';

/** Whether there is news this person hasn't opened. */
export const newsUnseen = (seen: string | null) => seen !== NEWS_ID;

export function readNewsSeen(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function markNewsSeen() {
  try { localStorage.setItem(KEY, NEWS_ID); } catch { /* private window */ }
}
