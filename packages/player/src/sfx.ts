import type { AudioClip, Clip, Layer, Scene } from './types';

/**
 * Built-in sound effects, synthesised from code: no files to host or download, the same sound on every
 * page, in the Studio and in video exports. Each sound is a small recipe of oscillators, filtered noise
 * and envelopes, rendered to samples. Noise uses a fixed seed, so a sound is identical every time.
 *
 * A clip asks for one with `sound: { name }` (it then follows the clip when the clip moves); an audio
 * track uses one with `src: "sfx:<name>"`.
 */

export type SfxCategory = 'motion' | 'interface' | 'impact' | 'tone' | 'texture';

export interface SfxMeta {
  id: string;
  label: string;
  category: SfxCategory;
  /** Seconds (at pitch 1). */
  length: number;
  description: string;
}

export const SFX_CATEGORY_LABELS: Record<SfxCategory, string> = {
  motion: 'Movement',
  interface: 'Clicks and taps',
  impact: 'Hits and drops',
  tone: 'Tones and chimes',
  texture: 'Textures and swells',
};

type Recipe = (t: number, k: Kit) => number;

interface Kit {
  /** Seeded white noise, -1..1. */
  noise(): number;
  /** Sine at a frequency that may change over time (phase-continuous). */
  sine(slot: number, freq: number): number;
  square(slot: number, freq: number): number;
  saw(slot: number, freq: number): number;
  /** State-variable filter on a signal: lowpass, bandpass or highpass at a cutoff that may change. */
  filter(slot: number, kind: 'lp' | 'bp' | 'hp', input: number, cutoff: number, q?: number): number;
}

const env = {
  /** Fast attack, exponential decay. */
  hit: (t: number, attack: number, decay: number) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay)),
  /** Rises then falls over `len`, peaking at `peak` (0..1 of the length). */
  arc: (t: number, len: number, peak = 0.5) => {
    const x = t / len;
    if (x <= 0 || x >= 1) return 0;
    return x < peak ? Math.sin((x / peak) * Math.PI / 2) ** 2 : Math.cos(((x - peak) / (1 - peak)) * Math.PI / 2) ** 2;
  },
  /** Exponential glide from a to b over `len`. */
  glide: (t: number, a: number, b: number, len: number) => a * Math.pow(b / a, Math.min(1, Math.max(0, t / len))),
};

/** Repeats an event at fixed (seeded) times: returns time since the latest event and its index. */
function events(t: number, times: number[]): { since: number; i: number } {
  let i = -1;
  for (let j = 0; j < times.length; j++) if (times[j] <= t) i = j;
  return { since: i < 0 ? -1 : t - times[i], i };
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const scatter = (seed: number, n: number, span: number, jitter: number) => {
  const r = seeded(seed);
  return Array.from({ length: n }, (_, i) => Math.max(0, (i / n) * span + (r() - 0.5) * jitter * (span / n)));
};
const TYPE_TIMES = scatter(7, 11, 1.05, 0.9);
const SPARKLE_TIMES = scatter(11, 14, 0.75, 1.2);
const SPARKLE_FREQ = (() => { const r = seeded(5); return SPARKLE_TIMES.map(() => 2400 + r() * 3600); })();
const GLITCH_FREQ = (() => { const r = seeded(9); return Array.from({ length: 12 }, () => 120 + r() * 1800); })();

const SOUNDS: Array<SfxMeta & { recipe: Recipe }> = [
  // ---- Movement ----
  {
    id: 'whoosh', label: 'Whoosh', category: 'motion', length: 0.55, description: 'Air rushing past: something flies in.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), env.glide(t, 380, 2600, 0.38), 1.6) * env.arc(t, 0.55, 0.6) * 1.6,
  },
  {
    id: 'whoosh-out', label: 'Whoosh out', category: 'motion', length: 0.5, description: 'Air falling away: something leaves.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), env.glide(t, 2400, 320, 0.5), 1.6) * env.arc(t, 0.5, 0.3) * 1.6,
  },
  {
    id: 'swish', label: 'Swish', category: 'motion', length: 0.28, description: 'A quick, light swipe: wipes and slides.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), env.glide(t, 1400, 6000, 0.25), 2.2) * env.arc(t, 0.28, 0.45) * 1.4,
  },
  {
    id: 'slide', label: 'Slide', category: 'motion', length: 0.3, description: 'A soft upward glide.',
    recipe: (t, k) => k.sine(0, env.glide(t, 320, 760, 0.26)) * env.arc(t, 0.3, 0.3) * 0.7
      + k.filter(1, 'bp', k.noise(), 1800, 3) * env.arc(t, 0.3, 0.3) * 0.25,
  },
  {
    id: 'spin', label: 'Spin', category: 'motion', length: 0.7, description: 'A turning flutter: spins and flips.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), env.glide(t, 700, 2200, 0.7), 4) * env.arc(t, 0.7, 0.5)
      * (0.55 + 0.45 * Math.sin(2 * Math.PI * env.glide(t, 9, 22, 0.7) * t)) * 2,
  },
  // ---- Clicks and taps ----
  {
    id: 'pop', label: 'Pop', category: 'interface', length: 0.14, description: 'A bright pop: things that appear with a bounce.',
    recipe: (t, k) => k.sine(0, env.glide(t, 950, 210, 0.09)) * env.hit(t, 0.003, 0.04)
      + k.filter(1, 'hp', k.noise(), 3000) * env.hit(t, 0.001, 0.006) * 0.4,
  },
  {
    id: 'soft-pop', label: 'Soft pop', category: 'interface', length: 0.18, description: 'A rounder, quieter pop.',
    recipe: (t, k) => k.sine(0, env.glide(t, 520, 150, 0.12)) * env.hit(t, 0.006, 0.055),
  },
  {
    id: 'click', label: 'Click', category: 'interface', length: 0.05, description: 'A crisp interface click.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), 3200, 2) * env.hit(t, 0.0005, 0.006) * 1.6
      + k.sine(1, 1900) * env.hit(t, 0.001, 0.012) * 0.4,
  },
  {
    id: 'tick', label: 'Tick', category: 'interface', length: 0.05, description: 'A tiny high tick: counters and small steps.',
    recipe: (t, k) => k.sine(0, 3100) * env.hit(t, 0.0008, 0.011),
  },
  {
    id: 'tap', label: 'Tap', category: 'interface', length: 0.1, description: 'A wooden tap.',
    recipe: (t, k) => k.sine(0, env.glide(t, 720, 560, 0.05)) * env.hit(t, 0.001, 0.025) * 0.8
      + k.filter(1, 'bp', k.noise(), 1300, 3) * env.hit(t, 0.0005, 0.012) * 0.9,
  },
  {
    id: 'typing', label: 'Typing', category: 'interface', length: 1.15, description: 'A run of key presses: typewriter text.',
    recipe: (t, k) => {
      const e = events(t, TYPE_TIMES);
      if (e.since < 0) return 0;
      const f = 2600 + (e.i % 3) * 420;
      return k.filter(0, 'bp', k.noise(), f, 2.5) * env.hit(e.since, 0.0005, 0.008) * 1.5
        + k.sine(1, 180) * env.hit(e.since, 0.001, 0.015) * 0.25;
    },
  },
  {
    id: 'beep', label: 'Beep', category: 'interface', length: 0.16, description: 'A short soft beep.',
    recipe: (t, k) => k.filter(0, 'lp', k.square(0, 880), 2400) * env.arc(t, 0.16, 0.08) * 0.5,
  },
  // ---- Hits and drops ----
  {
    id: 'impact', label: 'Impact', category: 'impact', length: 0.9, description: 'A deep, cinematic hit: slams and big reveals.',
    recipe: (t, k) => k.sine(0, env.glide(t, 110, 42, 0.35)) * env.hit(t, 0.004, 0.28)
      + k.filter(1, 'lp', k.noise(), env.glide(t, 4000, 300, 0.25)) * env.hit(t, 0.001, 0.07) * 0.9,
  },
  {
    id: 'thud', label: 'Thud', category: 'impact', length: 0.35, description: 'A soft, low landing.',
    recipe: (t, k) => k.sine(0, env.glide(t, 140, 70, 0.12)) * env.hit(t, 0.003, 0.09)
      + k.filter(1, 'lp', k.noise(), 600) * env.hit(t, 0.001, 0.03) * 0.5,
  },
  {
    id: 'sub-hit', label: 'Sub hit', category: 'impact', length: 1.3, description: 'A long, felt-more-than-heard boom.',
    recipe: (t, k) => k.sine(0, env.glide(t, 72, 38, 0.6)) * env.hit(t, 0.01, 0.45) * 1.1,
  },
  {
    id: 'drop', label: 'Drop', category: 'impact', length: 0.6, description: 'A falling tone: something drops away.',
    recipe: (t, k) => k.sine(0, env.glide(t, 1300, 90, 0.55)) * env.arc(t, 0.6, 0.1) * 0.8,
  },
  {
    id: 'glitch', label: 'Glitch', category: 'impact', length: 0.32, description: 'Digital stutter: scrambles and glitches.',
    recipe: (t, k) => {
      const seg = Math.min(GLITCH_FREQ.length - 1, Math.floor(t / 0.027));
      const crushed = Math.round(k.square(0, GLITCH_FREQ[seg]) * 3) / 3;
      return (crushed * 0.45 + (seg % 3 === 0 ? k.noise() * 0.3 : 0)) * env.arc(t, 0.32, 0.1);
    },
  },
  // ---- Tones and chimes ----
  {
    id: 'chime', label: 'Chime', category: 'tone', length: 1.6, description: 'A clear bell: a reveal, a highlight.',
    recipe: (t, k) => (k.sine(0, 1046.5) * 0.6 + k.sine(1, 1046.5 * 2.76) * 0.25 * Math.exp(-t / 0.25)
      + k.sine(2, 1046.5 * 5.4) * 0.12 * Math.exp(-t / 0.1)) * env.hit(t, 0.002, 0.5),
  },
  {
    id: 'sparkle', label: 'Sparkle', category: 'tone', length: 0.9, description: 'Glittering high notes: shine and magic.',
    recipe: (t, k) => {
      const e = events(t, SPARKLE_TIMES);
      if (e.since < 0) return 0;
      return k.sine(e.i % 4, SPARKLE_FREQ[e.i]) * env.hit(e.since, 0.002, 0.07) * 0.45 * (1 - t / 0.95);
    },
  },
  {
    id: 'success', label: 'Success', category: 'tone', length: 0.5, description: 'Two rising notes: done, correct, unlocked.',
    recipe: (t, k) => k.sine(0, 1046.5) * env.hit(t, 0.003, 0.09) * 0.5
      + (t > 0.11 ? k.sine(1, 1568) * env.hit(t - 0.11, 0.003, 0.16) * 0.5 : 0),
  },
  {
    id: 'notify', label: 'Notify', category: 'tone', length: 0.6, description: 'A friendly two-note ding.',
    recipe: (t, k) => k.sine(0, 1318.5) * env.hit(t, 0.003, 0.12) * 0.5
      + (t > 0.15 ? k.sine(1, 1046.5) * env.hit(t - 0.15, 0.003, 0.18) * 0.5 : 0),
  },
  // ---- Textures and swells ----
  {
    id: 'riser', label: 'Riser', category: 'texture', length: 1.6, description: 'Tension building up to a moment.',
    recipe: (t, k) => {
      const v = Math.min(1, t / 1.5) ** 2 * (t > 1.5 ? Math.max(0, 1 - (t - 1.5) / 0.1) : 1);
      return (k.filter(0, 'bp', k.noise(), env.glide(t, 400, 5000, 1.5), 3) * 1.2
        + k.filter(1, 'lp', k.saw(0, env.glide(t, 110, 440, 1.5)), 1800) * 0.25) * v;
    },
  },
  {
    id: 'swell', label: 'Swell', category: 'texture', length: 2, description: 'A soft rise and fall: openings and transitions.',
    recipe: (t, k) => (k.filter(0, 'lp', k.noise(), env.glide(t, 300, 1600, 1.2)) * 0.9
      + (k.sine(0, 220) + k.sine(1, 330) * 0.6 + k.sine(2, 440) * 0.3) * 0.18) * env.arc(t, 2, 0.6),
  },
  {
    id: 'shimmer', label: 'Shimmer', category: 'texture', length: 1.6, description: 'An airy, glowing hum: ambient and backgrounds.',
    recipe: (t, k) => (k.sine(0, 1760) + k.sine(1, 2217) * 0.7 + k.sine(2, 2637) * 0.5)
      * (0.6 + 0.4 * Math.sin(2 * Math.PI * 7 * t)) * env.arc(t, 1.6, 0.4) * 0.22,
  },
  {
    id: 'reveal', label: 'Reveal', category: 'texture', length: 1.2, description: 'A whoosh that blooms into a bell.',
    recipe: (t, k) => k.filter(0, 'bp', k.noise(), env.glide(t, 500, 3000, 0.4), 1.6) * env.arc(t, 0.45, 0.7) * 1.3
      + (t > 0.35 ? (k.sine(0, 1568) * 0.5 + k.sine(1, 1568 * 2.76) * 0.15) * env.hit(t - 0.35, 0.004, 0.32) : 0),
  },
];

export const SFX_CATALOG: SfxMeta[] = SOUNDS.map(({ recipe: _r, ...m }) => m);
export const SFX_IDS = SOUNDS.map((s) => s.id);
export const sfxMeta = (id: string) => SFX_CATALOG.find((s) => s.id === id);

/** The sound that suits each preset, used by "Add suggested sounds" and offered first in the picker. */
const SUGGESTED: Record<string, { in: string; out?: string }> = {
  'text-rise': { in: 'swish', out: 'whoosh-out' },
  'text-slam': { in: 'impact', out: 'whoosh-out' },
  'text-stretch': { in: 'slide', out: 'whoosh-out' },
  'text-scramble': { in: 'glitch', out: 'glitch' },
  'text-typewriter': { in: 'typing', out: 'typing' },
  'text-blur': { in: 'swell', out: 'whoosh-out' },
  'text-flip': { in: 'spin', out: 'spin' },
  'text-tracking': { in: 'whoosh', out: 'whoosh-out' },
  'text-wave': { in: 'shimmer' },
  'text-count': { in: 'typing' },
  fade: { in: 'swell', out: 'whoosh-out' },
  wipe: { in: 'swish', out: 'swish' },
  'soft-wipe': { in: 'swish', out: 'swish' },
  blinds: { in: 'swish', out: 'swish' },
  iris: { in: 'reveal', out: 'whoosh-out' },
  slide: { in: 'whoosh', out: 'whoosh-out' },
  grow: { in: 'slide', out: 'drop' },
  pop: { in: 'pop', out: 'soft-pop' },
  zoom: { in: 'whoosh', out: 'whoosh-out' },
  spin: { in: 'spin', out: 'spin' },
  turn: { in: 'spin', out: 'spin' },
  pulse: { in: 'soft-pop' },
  shake: { in: 'thud' },
  sheen: { in: 'sparkle' },
  recolor: { in: 'chime' },
  'spin-3d': { in: 'spin' },
  'tumble-in': { in: 'impact' },
  'camera-push': { in: 'riser' },
  'tr-slash': { in: 'swish', out: 'swish' },
  'tr-flash': { in: 'impact', out: 'impact' },
  'tr-dip': { in: 'swell', out: 'swell' },
  'tr-whip': { in: 'whoosh', out: 'whoosh-out' },
  'tr-zoom': { in: 'whoosh', out: 'riser' },
  'tr-glitch': { in: 'glitch', out: 'glitch' },
  'tr-streak': { in: 'whoosh', out: 'whoosh-out' },
  'text-carry': { in: 'swish' },
  'text-swap': { in: 'tick' },
  'select-box': { in: 'click' },
  'stack-in': { in: 'soft-pop', out: 'whoosh-out' },
  glow: { in: 'shimmer' },
  burst: { in: 'impact' },
  draw: { in: 'swish' },
  'follow-path': { in: 'whoosh' },
  morph: { in: 'whoosh' },
  'code-type': { in: 'typing' },
  'cursor-click': { in: 'click' },
  'code-edit': { in: 'typing' },
  'code-run': { in: 'click' },
  'code-note': { in: 'pop' },
  'code-highlight': { in: 'tick' },
  'dash-solid': { in: 'success' },
};

/** The suggested sound for a clip (null for presets that run quietly, such as ambient loops). */
export function suggestedSound(clip: Pick<Clip, 'preset' | 'params'>, defaults?: Record<string, unknown>): string | null {
  const s = SUGGESTED[clip.preset];
  if (!s) return null;
  const dir = clip.params && 'direction' in clip.params ? clip.params.direction : defaults?.direction;
  return dir === 'out' ? s.out ?? null : s.in;
}

/** Pitch is written into the source name: "sfx:pop" or "sfx:pop@1.2". */
export function parseSfxSrc(src: string): { id: string; pitch: number } | null {
  const m = /^sfx:([a-z0-9-]+)(?:@([0-9.]+))?$/.exec(src);
  if (!m || !SFX_IDS.includes(m[1])) return null;
  const pitch = m[2] ? Math.max(0.5, Math.min(2, parseFloat(m[2]) || 1)) : 1;
  return { id: m[1], pitch };
}
export const sfxSrc = (id: string, pitch = 1) => (Math.abs(pitch - 1) < 1e-3 ? `sfx:${id}` : `sfx:${id}@${Math.round(pitch * 100) / 100}`);

/** Renders a sound to mono samples. Pitch above 1 is higher and shorter (like speeding up a tape). */
export function synthSfx(id: string, sampleRate = 48000, pitch = 1): Float32Array {
  const s = SOUNDS.find((x) => x.id === id);
  if (!s) return new Float32Array(0);
  const rate = Math.max(0.5, Math.min(2, pitch));
  const n = Math.ceil((s.length / rate) * sampleRate);
  const out = new Float32Array(n);
  const dt = rate / sampleRate;
  const rnd = seeded(0x5eed + id.length * 131);
  const phase = new Float64Array(8);
  const lp = new Float64Array(8);
  const bp = new Float64Array(8);
  const osc = (slot: number, freq: number) => { phase[slot] = (phase[slot] + freq * dt) % 1; return phase[slot]; };
  const kit: Kit = {
    noise: () => rnd() * 2 - 1,
    sine: (slot, f) => Math.sin(2 * Math.PI * osc(slot, f)),
    square: (slot, f) => (osc(slot, f) < 0.5 ? 1 : -1),
    saw: (slot, f) => osc(slot, f) * 2 - 1,
    filter: (slot, kind, input, cutoff, q = 0.8) => {
      // Chamberlin state-variable filter; the cutoff is clamped where it stays stable.
      const f = 2 * Math.sin(Math.PI * Math.min(0.16, cutoff * dt));
      const damp = 1 / Math.max(0.5, q);
      const low = lp[slot] + f * bp[slot];
      const high = input - low - damp * bp[slot];
      const band = f * high + bp[slot];
      lp[slot] = low; bp[slot] = band;
      return kind === 'lp' ? low : kind === 'bp' ? band : high;
    },
  };
  let peak = 0;
  let energy = 0;
  for (let i = 0; i < n; i++) {
    const v = s.recipe(i * dt, kit);
    out[i] = Number.isFinite(v) ? v : 0;
    peak = Math.max(peak, Math.abs(out[i]));
    energy += out[i] * out[i];
  }
  // Every sound at a similar loudness (measured over its loud part), never past the peak limit, with a
  // short fade at the end so nothing clicks.
  const rms = Math.sqrt(energy / Math.max(1, n));
  const gain = peak > 0 ? Math.min(0.9 / peak, 0.17 / Math.max(rms, 1e-6)) : 0;
  const tail = Math.min(n, Math.round(0.01 * sampleRate));
  for (let i = 0; i < n; i++) out[i] *= gain * (i >= n - tail ? (n - i) / tail : 1);
  return out;
}

/** The sound as a 16-bit WAV file (for video export). */
export function sfxWav(src: string, sampleRate = 48000): Uint8Array | null {
  const p = parseSfxSrc(src);
  if (!p) return null;
  const pcm = synthSfx(p.id, sampleRate, p.pitch);
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 32767, true);
  return new Uint8Array(buf);
}

const peakCache = new Map<string, number>();
/**
 * Seconds from a sound's start to its loudest moment (its hit): a landing sound is started this much
 * early, so the hit falls on the frame rather than its attack.
 */
export function sfxPeak(id: string, pitch = 1): number {
  const key = `${id}@${pitch}`;
  const hit = peakCache.get(key);
  if (hit !== undefined) return hit;
  const sr = 12000;
  const pcm = synthSfx(id, sr, pitch);
  // The peak of a short smoothed envelope, so a single sharp sample doesn't decide it.
  const win = Math.max(1, Math.round(sr * 0.01));
  let best = 0, at = 0, acc = 0;
  for (let i = 0; i < pcm.length; i++) {
    acc += Math.abs(pcm[i]);
    if (i >= win) acc -= Math.abs(pcm[i - win]);
    if (acc > best) { best = acc; at = i - win / 2; }
  }
  const t = Math.max(0, at / sr);
  peakCache.set(key, t);
  return t;
}

/** Sounds whose loudest moment is the point of them: they are lined up by their peak. */
const PEAK_SOUNDS = new Set(['impact', 'thud', 'sub-hit', 'drop', 'riser', 'reveal', 'swell', 'chime', 'success']);

/**
 * Everything the scene plays: its audio tracks plus the sounds attached to clips, placed at each clip's
 * moment on the scene's clock (a group's children run on the group's clock, so they are offset by it).
 * Two touches make it sound designed: a landing ("at": "end") and any big hit or riser start early by
 * their attack, so the hit lands on the frame; and the same sound repeated within two seconds gets softer
 * each time, so a run of pops or ticks stays gentle.
 */
export function soundTrack(scene: Scene): AudioClip[] {
  const out: AudioClip[] = [...(scene.audio ?? [])];
  const placed: Array<{ name: string; at: number }> = [];
  const walk = (list: Layer[], offset: number) => {
    for (const l of list) {
      for (const c of l.clips) {
        const s = c.sound;
        if (!s || !SFX_IDS.includes(s.name)) continue;
        let at = offset + c.start + (s.at === 'end' ? c.duration : 0) + (s.delay ?? 0);
        if (s.at === 'end' || PEAK_SOUNDS.has(s.name)) at -= sfxPeak(s.name, s.pitch ?? 1);
        if (at < 0 || at >= scene.duration) continue;
        placed.push({ name: s.name, at });
        out.push({ id: `snd-${c.id}`, src: sfxSrc(s.name, s.pitch ?? 1), start: Math.round(at * 1000) / 1000, volume: s.volume, role: 'sfx' });
      }
      if (l.type === 'group') walk(l.layers, offset + (l.start ?? 0));
    }
  };
  walk(scene.layers, 0);
  // Repeats of one sound close together: each one 25% softer than the last (down to 40%).
  const sorted = out.map((c, i) => ({ c, i })).filter(({ c }) => c.id.startsWith('snd-')).sort((a, b) => a.c.start - b.c.start);
  const run = new Map<string, { at: number; n: number }>();
  for (const { c, i } of sorted) {
    const name = parseSfxSrc(c.src)?.id ?? c.src;
    const prev = run.get(name);
    const n = prev && c.start - prev.at <= 2 ? prev.n + 1 : 0;
    run.set(name, { at: c.start, n });
    if (n > 0) out[i] = { ...c, volume: Math.round((c.volume ?? 1) * Math.max(0.4, 0.75 ** n) * 100) / 100 };
  }
  return out;
}
