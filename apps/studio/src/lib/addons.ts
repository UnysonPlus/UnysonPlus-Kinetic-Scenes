import { kitBase, kitHas, kitStatus } from './ai';

/**
 * Add-ons, through the AI Dev Kit: connectors to apps the person has installed (Voicebox; Blender coming), found
 * automatically or at a location they give once, and tools the kit downloads itself (speech recognition, voices,
 * voice and music separation). The kit does the work; the Studio shows what is there.
 */

export interface Addon {
  id: string;
  kind: 'connector' | 'download';
  name: string;
  state: 'connected' | 'ready' | 'no-api' | 'not-found' | 'installed' | 'not-installed' | 'soon';
  what: string;
  detail: string;
  location?: AddonField;
  app?: AddonField;
  profiles?: Array<{ id: string; name: string; language: string; engine: string | null }>;
  link?: string;
}

/** Where a connector is: an address on this computer, or a folder or program the kit may start. */
export interface AddonField { kind: 'url' | 'path'; value: string; default?: string; placeholder?: string; hint?: string }

export async function listAddons(): Promise<Addon[] | null> {
  const b = await kitBase();
  if (!b) return null;
  const r = await fetch(`${b}/studio/addons`);
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old for add-ons. Close it and start it again: it updates itself.');
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j.addons as Addon[];
}

/** Sets where a connector is ("" goes back to looking in the usual place). `field` "app" sets its program instead. */
export async function setAddonLocation(id: string, location: string, field: 'location' | 'app' = 'location'): Promise<void> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${b}/studio/addons/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ location, field }) });
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

/**
 * Background music from the ACE-Step add-on: an instrumental made on this computer in the style, tempo and length
 * asked for. The kit starts ACE-Step when it is not running (the first time takes a minute or so).
 */
export async function makeMusic(opts: { prompt: string; seconds: number; bpm?: number }, onStep?: (s: string) => void): Promise<{ src: string; bpm: number | null; seconds: number }> {
  const b = await kitBase();
  if (!b) throw new Error('Music runs through the AI Dev Kit. Start it on this computer first.');
  const r = await fetch(`${b}/studio/music`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(opts) });
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old for music. Close it and start it again: it updates itself.');
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  for (;;) {
    await new Promise((ok) => setTimeout(ok, 1500));
    const p = await (await fetch(`${b}/studio/music/${j.id}`)).json();
    if (p.state === 'failed') throw new Error(p.error || 'The music could not be made.');
    if (p.state === 'done') return p.result;
    onStep?.(p.step);
  }
}

async function addonAction(id: string, action: 'find' | 'browse', body: object = {}) {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  // An older kit takes these for "set the location" and would clear it, so ask only a kit that knows them.
  if (!kitHas('addon-browse')) await kitStatus();
  if (!kitHas('addon-browse')) throw new Error('Your AI Dev Kit is older than this button. Close it and start it again (start.bat or start.command): it updates itself.');
  const r = await fetch(`${b}/studio/addons/${id}/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 || (!r.ok && /set|nothing/i.test(j.error || ''))) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j;
}
/** Looks for a connector's app in the usual install places; saves it when found. */
export const findAddon = async (id: string): Promise<string | null> => (await addonAction(id, 'find')).found ?? null;
/** Opens this computer's own file or folder picker (through the kit); saves the choice. Null when cancelled. */
export const browseAddon = async (id: string, field: 'location' | 'app'): Promise<string | null> => (await addonAction(id, 'browse', { field })).chosen ?? null;
