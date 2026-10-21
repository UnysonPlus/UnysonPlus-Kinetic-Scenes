import { kitBase } from './ai';

/**
 * Add-ons, through the AI Dev Kit: connectors to apps the person has installed (Voicebox; Blender coming), found
 * automatically or at a location they give once, and tools the kit downloads itself (speech recognition, voices,
 * voice and music separation). The kit does the work; the Studio shows what is there.
 */

export interface Addon {
  id: string;
  kind: 'connector' | 'download';
  name: string;
  state: 'connected' | 'not-found' | 'installed' | 'not-installed' | 'soon';
  what: string;
  detail: string;
  location?: { kind: 'url' | 'path'; value: string; default: string };
  profiles?: Array<{ id: string; name: string; language: string; engine: string | null }>;
  link?: string;
}

export async function listAddons(): Promise<Addon[] | null> {
  const b = await kitBase();
  if (!b) return null;
  const r = await fetch(`${b}/studio/addons`);
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old for add-ons. Close it and start it again: it updates itself.');
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j.addons as Addon[];
}

/** Sets where a connector is ("" goes back to looking in the usual place). */
export async function setAddonLocation(id: string, location: string): Promise<void> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${b}/studio/addons/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ location }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
}

/** The voice the person last chose for voice-overs (a built-in voice id, or "voicebox:<profile id>"). */
export const VOICE_KEY = 'upw-studio-voice';
export function preferredVoice(): string | undefined {
  try { return localStorage.getItem(VOICE_KEY) || undefined; } catch { return undefined; }
}
export function rememberVoice(v: string) {
  try { localStorage.setItem(VOICE_KEY, v); } catch { /* private window: fine */ }
}
