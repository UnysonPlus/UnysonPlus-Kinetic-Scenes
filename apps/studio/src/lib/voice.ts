import type { AudioClip, Scene } from '@unysonplus/scene-player/types';
import { kitBase } from './ai';

/**
 * Voice-over from a script, through the AI Dev Kit: a free voice on the person's computer speaks the lines,
 * and the kit times every word, so a scene can be built on the real narration.
 */

export interface VoiceStatus {
  program: boolean;
  canInstall: boolean;
  voices: Record<string, { label: string; mb: number; installed: boolean }>;
  transcription: boolean;
  ffmpeg: boolean;
  install: { state: string; step: string; done: number; total: number; error: string } | null;
  /** Voicebox (an add-on): the person's own voices, when the app is open. */
  voicebox?: { connected: boolean; profiles: Array<{ id: string; name: string }> };
}

async function kit(): Promise<string> {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  return b;
}

export async function voiceStatus(): Promise<VoiceStatus | null> {
  try {
    const r = await fetch(`${await kit()}/studio/voice`);
    return r.ok ? ((await r.json()) as VoiceStatus) : null;
  } catch {
    return null;
  }
}

/** Installs the voice program and a voice; resolves when done (reporting progress on the way). */
export async function installVoice(voice: string, onStep: (s: string) => void): Promise<void> {
  const b = await kit();
  await fetch(`${b}/studio/voice/install`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ voice }) });
  for (;;) {
    await new Promise((ok) => setTimeout(ok, 1000));
    const st = await voiceStatus();
    const i = st?.install;
    if (!i) continue;
    if (i.state === 'error') throw new Error(i.error);
    onStep(i.total ? `${i.step} (${Math.round((i.done / i.total) * 100)}%)` : i.step);
    if (i.state === 'done') return;
  }
}

export interface VoiceResult { src: string; duration: number; segments: Array<{ start: number; end: number; text: string }>; words: NonNullable<AudioClip['words']>; speech: AudioClip['speech']; voice: string }

/** Speaks a script (one entry per line or segment); resolves with the audio and every word's time. */
export async function speak(lines: string[], opts: { voice?: string; pace?: number; signal?: AbortSignal; onStep?: (s: string) => void } = {}): Promise<VoiceResult> {
  const b = await kit();
  const r = await fetch(`${b}/studio/voice`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lines, voice: opts.voice, pace: opts.pace }), signal: opts.signal });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  for (;;) {
    await new Promise((ok) => setTimeout(ok, 800));
    if (opts.signal?.aborted) throw Object.assign(new Error('Stopped.'), { name: 'AbortError' });
    const s = await (await fetch(`${b}/studio/voice/${j.id}`, { signal: opts.signal })).json();
    if (s.state === 'error') throw new Error(s.error);
    opts.onStep?.(s.step);
    if (s.state === 'done') return s.result as VoiceResult;
  }
}

/** The scene with the voice-over added as its voice track (from the start), its words and delivery included. */
export function withVoice(scene: Scene, v: VoiceResult, name = 'Voice-over'): { scene: Scene; id: string } {
  const list = scene.audio ?? [];
  let n = list.length + 1;
  while (list.some((a) => a.id === `a${n}`)) n++;
  const id = `a${n}`;
  const clip: AudioClip = { id, name, src: v.src, start: 0, role: 'voice', words: v.words, speech: v.speech };
  return { scene: { ...scene, duration: Math.max(scene.duration, Math.ceil((v.duration + 0.8) * 10) / 10), audio: [...list, clip] }, id };
}

/** The narration lines of a plan written as numbered segments ("1. What is said\n   Screen: …"). */
export function narrationOf(planText: string): string[] {
  const out: string[] = [];
  const lines = planText.split('\n');
  let inSegments = false;
  for (const l of lines) {
    if (/^\*\*Segments\*\*/.test(l.trim())) { inSegments = true; continue; }
    if (!inSegments) continue;
    const m = /^\s*\d+\.\s+(.*)$/.exec(l);
    if (m && m[1].trim()) out.push(m[1].trim());
  }
  return out;
}
