import { kitBase } from './ai';

/**
 * Sounds made from a description, and public-domain sounds searched on Freesound, both through the AI Dev Kit.
 * A made sound comes back as a recipe of oscillators, filtered noise and envelopes (the way the built-in sounds are
 * made), rendered here to a WAV file; with the person's own ElevenLabs key the kit returns a recorded file instead.
 */

export interface DesignLayer {
  source: 'sine' | 'square' | 'saw' | 'noise';
  freq?: [number, number];
  filter?: { kind: 'lp' | 'bp' | 'hp'; from: number; to: number; q?: number };
  env?: { kind: 'hit'; attack?: number; decay?: number } | { kind: 'arc'; peak?: number };
  start?: number;
  length?: number;
  gain?: number;
  wobble?: { rate: number; depth: number };
}
export interface SoundDesign { name?: string; length: number; layers: DesignLayer[] }

const clampN = (v: unknown, lo: number, hi: number, d: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d);
const glide = (t: number, a: number, b: number, len: number) => a * Math.pow(b / a, Math.min(1, Math.max(0, t / Math.max(1e-4, len))));

/** Renders a recipe to samples (mono), the same every time (noise has a fixed seed). */
export function renderDesign(d: SoundDesign, rate = 48000): Float32Array {
  const len = clampN(d.length, 0.05, 4, 1);
  const out = new Float32Array(Math.ceil(len * rate));
  for (const [li, raw] of (d.layers ?? []).slice(0, 6).entries()) {
    const L = raw ?? ({} as DesignLayer);
    const start = clampN(L.start, 0, len, 0);
    const llen = clampN(L.length, 0.01, len - start, len - start);
    const gain = clampN(L.gain, 0, 1.5, 0.6);
    const f0 = clampN(L.freq?.[0], 20, 16000, 440), f1 = clampN(L.freq?.[1], 20, 16000, f0);
    const flt = L.filter && ['lp', 'bp', 'hp'].includes(L.filter.kind) ? { kind: L.filter.kind, a: clampN(L.filter.from, 30, 18000, 1000), b: clampN(L.filter.to, 30, 18000, clampN(L.filter.from, 30, 18000, 1000)), q: clampN(L.filter.q, 0.3, 12, 1.2) } : null;
    let phase = 0;
    let seed = (li + 1) * 2654435761 >>> 0;
    let low = 0, band = 0;
    for (let i = Math.floor(start * rate); i < Math.min(out.length, Math.floor((start + llen) * rate)); i++) {
      const t = i / rate - start;
      let x: number;
      if (L.source === 'noise') { seed = (seed * 1664525 + 1013904223) >>> 0; x = seed / 2147483648 - 1; } else {
        phase += glide(t, f0, f1, llen) / rate;
        const p = phase % 1;
        x = L.source === 'square' ? (p < 0.5 ? 1 : -1) : L.source === 'saw' ? 2 * p - 1 : Math.sin(2 * Math.PI * p);
      }
      if (flt) {
        // A state-variable filter, its cutoff gliding over the layer.
        const f = 2 * Math.sin(Math.PI * Math.min(0.45, glide(t, flt.a, flt.b, llen) / rate));
        low += f * band;
        const high = x - low - band / flt.q;
        band += f * high;
        x = flt.kind === 'lp' ? low : flt.kind === 'hp' ? high : band;
      }
      let e: number;
      const env = L.env ?? { kind: 'arc', peak: 0.5 };
      if (env.kind === 'hit') {
        const a = clampN(env.attack, 0.0005, 2, 0.005), dcy = clampN(env.decay, 0.003, 4, 0.2);
        e = t < a ? t / a : Math.exp(-(t - a) / dcy);
      } else {
        const pk = clampN(env.peak, 0.02, 0.98, 0.5);
        const u = t / llen;
        e = u <= 0 || u >= 1 ? 0 : u < pk ? Math.sin((u / pk) * Math.PI / 2) ** 2 : Math.cos(((u - pk) / (1 - pk)) * Math.PI / 2) ** 2;
      }
      if (L.wobble) e *= 1 - clampN(L.wobble.depth, 0, 1, 0.5) * (0.5 - 0.5 * Math.cos(2 * Math.PI * clampN(L.wobble.rate, 0.1, 60, 8) * t));
      out[i] += x * e * gain;
    }
  }
  // Normalised to a safe peak, with a short fade out so it never clicks.
  let peak = 0;
  for (const v of out) peak = Math.max(peak, Math.abs(v));
  const k = peak > 0.89 ? 0.89 / peak : 1;
  const fade = Math.min(out.length, Math.round(0.01 * rate));
  for (let i = 0; i < out.length; i++) out[i] *= k * (i >= out.length - fade ? (out.length - i) / fade : 1);
  return out;
}

/** Samples as a 16-bit WAV data: URL. */
export function wavDataUrl(samples: Float32Array, rate = 48000): string {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 0x7fff, true);
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `data:audio/wav;base64,${btoa(bin)}`;
}

async function kit(path: string, body?: unknown) {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${b}${path}`, body === undefined ? undefined : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw Object.assign(new Error(j.error || `The AI Dev Kit answered ${r.status}.`), { status: r.status });
  return j;
}

export interface MadeSound { name: string; src: string; seconds: number; engine: string }

/** A sound from a description: rendered here from the AI's recipe, or a file from ElevenLabs. */
export async function makeSound(prompt: string, seconds?: number): Promise<MadeSound> {
  const r = await kit('/studio/sounds/design', { prompt, seconds });
  if (r.src) return { name: r.name || prompt.slice(0, 40), src: r.src, seconds: seconds ?? 2, engine: r.engine };
  const d = r.design as SoundDesign;
  const samples = renderDesign(d);
  return { name: d.name || prompt.slice(0, 40), src: wavDataUrl(samples), seconds: samples.length / 48000, engine: 'synth' };
}

export interface FoundSound { id: number; name: string; seconds: number; tags: string[]; by: string; preview: string }

export const soundsStatus = (): Promise<{ key: boolean }> => kit('/studio/sounds');
export const saveSoundsKey = (key: string) => kit('/studio/sounds/key', { key });
export const searchSounds = (q: string, page = 1): Promise<{ count: number; next: boolean; results: FoundSound[] }> => kit('/studio/sounds/search', { q, page });
export const fetchSound = (id: number): Promise<{ src: string; name: string; seconds: number }> => kit('/studio/sounds/fetch', { id });
