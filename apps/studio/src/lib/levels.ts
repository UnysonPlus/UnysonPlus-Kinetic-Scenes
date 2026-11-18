import type { AudioClip, Scene } from '@unysonplus/scene-player/types';
import { getFootage } from './footage';

/**
 * A voice-over's loudness, measured once in this browser and kept on its audio clip (`levels`): 50 values a second from
 * the start of the file, one character each (0-9, a-z). A talking mascot opens its mouth with it, so the mouth shuts in
 * the pauses and opens more on the stressed syllables, exactly in time with the sound.
 */
export async function measureLevels(src: string): Promise<string> {
  let buf: ArrayBuffer;
  if (src.startsWith('local:')) {
    const blob = await getFootage(src);
    if (!blob) throw new Error('The sound is not in this browser any more.');
    buf = await blob.arrayBuffer();
  } else {
    const r = await fetch(src);
    if (!r.ok) throw new Error(`The sound could not be loaded (${r.status}).`);
    buf = await r.arrayBuffer();
  }
  const Ctx = window.OfflineAudioContext ?? (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  const ctx = new Ctx(1, 2, 44100);
  const audio = await ctx.decodeAudioData(buf);
  const rate = audio.sampleRate, win = Math.max(1, Math.round(rate / 50));
  const chans = Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c));
  const n = Math.ceil(audio.length / win);
  const rms = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0, cnt = 0;
    for (let k = i * win; k < Math.min(audio.length, (i + 1) * win); k++) {
      let v = 0;
      for (const ch of chans) v += ch[k];
      v /= chans.length;
      sum += v * v; cnt++;
    }
    rms[i] = cnt ? Math.sqrt(sum / cnt) : 0;
  }
  // Scaled to the voice's own loud parts (the 95th percentile), so a quiet recording and a loud one open the mouth alike.
  const sorted = Array.from(rms).filter((v) => v > 1e-4).sort((a, b) => a - b);
  const top = sorted[Math.floor(sorted.length * 0.95)] || 1;
  let out = '';
  for (let i = 0; i < n; i++) {
    const v = Math.min(1, rms[i] / top);
    out += Math.round((v < 0.04 ? 0 : v) * 35).toString(36);
  }
  return out;
}

/** The voice-over a mascot talks on (the one it names, else the first with words) and the other parts of it. */
export function mascotVoices(scene: Scene, audioId?: string): AudioClip[] {
  const list = scene.audio ?? [];
  const src = list.find((a) => a.id === audioId) ?? list.find((a) => a.role === 'voice' && a.words?.length) ?? list.find((a) => a.words?.length);
  if (!src) return [];
  return src.group ? list.filter((a) => a.group === src.group) : [src];
}

/** Measures every voice clip a mascot talks on that has no levels yet: clip id → levels. */
export async function measureVoiceLevels(scene: Scene, audioId?: string): Promise<Map<string, string>> {
  const todo = mascotVoices(scene, audioId).filter((a) => !a.levels && a.src && !a.src.startsWith('sfx:'));
  const done = new Map<string, string>();
  const bySrc = new Map<string, string>();
  for (const a of todo) {
    if (!bySrc.has(a.src)) bySrc.set(a.src, await measureLevels(a.src));
    done.set(a.id, bySrc.get(a.src)!);
  }
  return done;
}

/** The scene with measured levels put on their clips (applied to the scene as it is now, after the measuring). */
export function withLevels(scene: Scene, levels: Map<string, string>): Scene {
  if (!levels.size) return scene;
  return { ...scene, audio: (scene.audio ?? []).map((a) => (levels.has(a.id) && !a.levels ? { ...a, levels: levels.get(a.id) } : a)) };
}
