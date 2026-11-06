import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase, kitHas, kitStatus } from './ai';
import { withFootage } from './footage';

/**
 * The second listener, through the AI Dev Kit (studio-listen.mjs): Gemini hears the scene's sound on the person's own key
 * and answers with timed notes. The sound goes to Google, so every review carries the person's say-so; the key stays in
 * the kit and is never read back here.
 */

export interface ListenStatus { hasKey: boolean; model: string; consent: string }
export interface ListenNote { t: number; kind: string; level: 'fix' | 'consider'; note: string; fix: string }
export interface ListenResult { summary: string; notes: ListenNote[]; dropped: number; unread?: boolean; model: string; sent: string; warnings: string[] }

export const GEMINI_KEY_URL = 'https://aistudio.google.com/apikey';

async function kit<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  if (!kitHas('listen')) await kitStatus();
  if (!kitHas('listen')) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  const r = await fetch(`${b}/studio/listen${path}`, body === undefined ? { signal } : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j as T;
}

export const listenStatus = () => kit<ListenStatus>('');
export const setListenKey = (key: string) => kit<ListenStatus>('/key', { key });

/** Sends the scene's sound for a review; reports each step; resolves with the notes. */
export async function listenTo(scene: Scene, question: string, onStep: (s: string) => void, signal: AbortSignal): Promise<ListenResult> {
  const packed = await withFootage(scene);
  if (packed.missing) throw new Error('Some footage is not on this computer any more (it is kept in the browser where it was added). Add it again, then try.');
  const playerBase = new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href;
  const { id } = await kit<{ id: string }>('/review', { scene: packed.scene, playerBase, question: question.trim() || undefined, confirm: true }, signal);
  for (;;) {
    await new Promise((ok) => setTimeout(ok, 800));
    if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
    const j = await kit<{ state: string; step: string; error?: string; result?: ListenResult }>(`/job/${id}`, undefined, signal);
    if (j.state === 'error') throw new Error(j.error || 'The review stopped.');
    if (j.state === 'done' && j.result) return j.result;
    onStep(j.step);
  }
}
