import { kitBase } from './ai';
import { wsFootageId } from './footage';

/**
 * Free stock search through the AI Dev Kit (studio-stock.mjs): Pexels and Pixabay with the person's own free keys,
 * NASA and Openverse with none. Sources switched off here are skipped by the person's searches and the agent's alike.
 */

export type StockSource = 'pexels' | 'pixabay' | 'nasa' | 'openverse';
export interface SourceState { on: boolean; needsKey: boolean; hasKey: boolean }
export interface StockResult {
  source: StockSource; id: string; kind: 'video' | 'photo' | 'audio'; title: string; thumb?: string; width?: number; height?: number;
  seconds?: number; by?: string; page: string; licence: string; credit: string | null; licenceUrl?: string; file?: string | null; asset?: string;
}

export const SOURCE_INFO: Record<StockSource, { name: string; gives: string; licence: string; keyUrl?: string }> = {
  pexels: { name: 'Pexels', gives: 'Video, photos', licence: 'Commercial use allowed, no credit needed', keyUrl: 'https://www.pexels.com/api/' },
  pixabay: { name: 'Pixabay', gives: 'Video, photos', licence: 'Commercial use allowed, no credit needed (no political use, no shown trademarks)', keyUrl: 'https://pixabay.com/api/docs/' },
  nasa: { name: 'NASA', gives: 'Video, photos', licence: 'Generally not copyrighted; credit NASA, no implied endorsement' },
  openverse: { name: 'Openverse', gives: 'Photos, sounds (Creative Commons)', licence: 'Only commercial-use, editable licences; most need credit' },
};

async function kit<T>(path: string, body?: unknown): Promise<T> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${b}/studio/stock${path}`, body === undefined ? undefined : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j as T;
}

export const stockStatus = () => kit<{ sources: Record<StockSource, SourceState> }>('');
export const setStockSources = (off: StockSource[]) => kit<{ sources: Record<StockSource, SourceState> }>('/sources', { off });
export const setStockKey = (source: StockSource, key: string) => kit<{ sources: Record<StockSource, SourceState> }>('/key', { source, key });
export const stockSearch = (q: string, kind: StockResult['kind'], orient: string) => kit<{ results: StockResult[]; notes: string[] }>('/search', { q, kind, orient });
export const stockGet = (project: string, result: StockResult) => kit<{ path: string; note: string; credit: string | null }>('/get', { project, result });

/** A project's media path as the Studio plays it: sound from the kit, everything else handed to the preview. */
export async function stockInStudio(project: string, path: string): Promise<string> {
  if (!/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(path)) return wsFootageId(project, path);
  const b = ((await kitBase()) ?? 'http://127.0.0.1:8787').replace('//localhost:', '//127.0.0.1:');
  return `${b}/studio/workspace/${encodeURIComponent(project)}/file/${path.split('/').map(encodeURIComponent).join('/')}`;
}
