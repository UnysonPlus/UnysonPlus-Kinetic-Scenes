import type { AudioClip, Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';

/**
 * Music analysis, right in the browser: the tempo, the beat grid, how strong each beat is, and a loudness
 * and bass curve. Each beat is scored by its onset strength (how sharply the sound rises), its contrast
 * with the beats around it, its loudness and its bass, so a reveal can land on a moment that is actually
 * felt. Everything is stored in the scene file (file time), so analysis runs once.
 */

const FPS = 86; // analysis frames per second (hop of ~512 samples at 44.1 kHz)

export interface MusicAnalysis {
  beats: NonNullable<AudioClip['beats']>;
  envelope: NonNullable<AudioClip['envelope']>;
}

export function analyseMusic(buf: AudioBuffer): MusicAnalysis {
  const sr = buf.sampleRate;
  const n = buf.length;
  // Mono mix.
  const mono = new Float32Array(n);
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) mono[i] += d[i] / buf.numberOfChannels;
  }
  const hop = Math.max(1, Math.round(sr / FPS));
  const frames = Math.floor(n / hop);
  // Energy per frame, overall and in the bass (a one-pole low-pass around 150 Hz).
  const energy = new Float32Array(frames);
  const bass = new Float32Array(frames);
  const a = Math.exp((-2 * Math.PI * 150) / sr);
  let lp = 0;
  for (let f = 0; f < frames; f++) {
    let e = 0, b = 0;
    for (let i = f * hop; i < (f + 1) * hop; i++) {
      const x = mono[i];
      lp = a * lp + (1 - a) * x;
      e += x * x;
      b += lp * lp;
    }
    energy[f] = Math.sqrt(e / hop);
    bass[f] = Math.sqrt(b / hop);
  }
  // Onset strength: how sharply the (log) energy rises, bass weighted in.
  const onset = new Float32Array(frames);
  for (let f = 1; f < frames; f++) {
    const d = Math.log1p(energy[f] * 40) - Math.log1p(energy[f - 1] * 40);
    const db = Math.log1p(bass[f] * 60) - Math.log1p(bass[f - 1] * 60);
    onset[f] = Math.max(0, d) + 0.6 * Math.max(0, db);
  }
  // Tempo: the lag (60 to 180 beats a minute) where the onsets repeat best, with a gentle pull to ~120.
  let bestLag = 0, best = -Infinity;
  const minLag = Math.round((60 / 180) * FPS), maxLag = Math.round((60 / 60) * FPS);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let f = lag; f < frames; f++) s += onset[f] * onset[f - lag];
    const bpm = (60 * FPS) / lag;
    s *= Math.exp(-0.5 * (Math.log2(bpm / 120) / 1.2) ** 2);
    if (s > best) { best = s; bestLag = lag; }
  }
  const bpm = bestLag ? (60 * FPS) / bestLag : 120;
  // Phase: the offset whose grid collects the most onset.
  let bestPhase = 0, bestSum = -Infinity;
  for (let p = 0; p < bestLag; p++) {
    let s = 0;
    for (let f = p; f < frames; f += bestLag) s += onset[f];
    if (s > bestSum) { bestSum = s; bestPhase = p; }
  }
  // The grid, each beat nudged to the strongest onset within 40 ms.
  const win = Math.round(0.04 * FPS);
  const times: number[] = [];
  const raw: number[] = [];
  for (let f = bestPhase; f < frames; f += bestLag) {
    let at = f, m = onset[f];
    for (let k = Math.max(0, f - win); k <= Math.min(frames - 1, f + win); k++) if (onset[k] > m) { m = onset[k]; at = k; }
    times.push(at / FPS);
    raw.push(m);
  }
  // Strength: onset, contrast with the neighbouring beats, loudness and bass, each 0 to 1.
  const norm = (arr: number[]) => { const top = Math.max(1e-9, ...arr); return arr.map((v) => v / top); };
  const on = norm(raw);
  const loud = norm(times.map((t) => energy[Math.min(frames - 1, Math.round(t * FPS))]));
  const low = norm(times.map((t) => bass[Math.min(frames - 1, Math.round(t * FPS))]));
  const contrast = on.map((v, i) => { const around = [on[i - 2], on[i - 1], on[i + 1], on[i + 2]].filter((x) => x !== undefined) as number[]; const mean = around.length ? around.reduce((s, x) => s + x, 0) / around.length : v; return Math.max(0, v - mean); });
  const cn = norm(contrast);
  const strengths = on.map((v, i) => Math.round((0.4 * v + 0.25 * cn[i] + 0.2 * loud[i] + 0.15 * low[i]) * 100) / 100);
  // The envelope for reacting to the music, at 20 frames a second, 0 to 1.
  const EF = 20;
  const per = Math.max(1, Math.round(FPS / EF));
  const loudEnv: number[] = [], bassEnv: number[] = [];
  for (let f = 0; f < frames; f += per) {
    let e = 0, b = 0;
    for (let k = f; k < Math.min(frames, f + per); k++) { e = Math.max(e, energy[k]); b = Math.max(b, bass[k]); }
    loudEnv.push(e); bassEnv.push(b);
  }
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return {
    beats: { bpm: Math.round(bpm * 10) / 10, times: times.map((t) => Math.round(t * 1000) / 1000), strengths },
    envelope: { fps: EF, loud: norm(loudEnv).map(r2), bass: norm(bassEnv).map(r2) },
  };
}

/** A music clip's beats on the scene's clock: { t, s } with t in scene seconds. */
export function sceneBeats(clip: AudioClip): Array<{ t: number; s: number }> {
  if (!clip.beats) return [];
  const off = clip.offset ?? 0;
  const len = clip.duration ?? Infinity;
  return clip.beats.times
    .map((t, i) => ({ t: clip.start + (t - off), s: clip.beats!.strengths[i] ?? 0.5, f: t }))
    .filter((b) => b.f >= off && b.f - off <= len)
    .map(({ t, s }) => ({ t: Math.round(t * 1000) / 1000, s }));
}

/** The strongest moments: beats well above the others, at least `gap` seconds apart. */
export function strongMoments(beats: Array<{ t: number; s: number }>, gap = 1.6): Array<{ t: number; s: number }> {
  const out: Array<{ t: number; s: number }> = [];
  for (const b of [...beats].sort((x, y) => y.s - x.s)) {
    if (b.s < 0.55) break;
    if (out.every((o) => Math.abs(o.t - b.t) >= gap)) out.push(b);
  }
  return out.sort((x, y) => x.t - y.t);
}

/**
 * Snap to the beat: a big reveal (a group's entrance, or a headline's) may move up to 0.15 s to land on a
 * strong moment; a smaller entrance up to 0.10 s onto any beat. "Land" means the clip's end, where the
 * thing arrives. Only a few are locked per scene (big ones first), so the scene keeps its own rhythm.
 */
export function snapToBeats(scene: Scene, clip: AudioClip, maxLocks = 8): { scene: Scene; moved: number } {
  const beats = sceneBeats(clip);
  if (!beats.length) return { scene, moved: 0 };
  const strong = strongMoments(beats);
  const fastTempo = (clip.beats?.bpm ?? 0) >= 140;
  type Cand = { layerId: string; clipId: string; end: number; big: boolean; offset: number };
  const cands: Cand[] = [];
  const walk = (list: Layer[], offset: number, depth: number) => {
    for (const l of list) {
      const first = [...l.clips].filter((c) => {
        const m = presetMeta[c.preset];
        return m && m.category !== 'ambient' && m.category !== 'code' && c.params?.direction !== 'out';
      }).sort((a, b) => a.start - b.start)[0];
      if (first) {
        const big = l.type === 'group' ? depth === 0 : l.type === 'text' && (l.style.fontSize ?? 0) >= 5;
        cands.push({ layerId: l.id, clipId: first.id, end: offset + first.start + first.duration, big, offset });
      }
      if (l.type === 'group') walk(l.layers, offset + (l.start ?? 0), depth + 1);
    }
  };
  walk(scene.layers, 0, 0);
  cands.sort((a, b) => Number(b.big) - Number(a.big));
  const moves = new Map<string, number>();
  const used = new Set<number>();
  for (const c of cands) {
    if (moves.size >= maxLocks) break;
    // Readable text at a fast tempo lands on every other beat.
    const pool = c.big ? strong : (fastTempo ? beats.filter((_, i) => i % 2 === 0) : beats);
    const reach = c.big ? 0.15 : 0.1;
    let pick: { t: number } | null = null;
    for (const b of pool) if (Math.abs(b.t - c.end) <= reach && !used.has(b.t) && (!pick || Math.abs(b.t - c.end) < Math.abs(pick.t - c.end))) pick = b;
    if (!pick) continue;
    used.add(pick.t);
    if (Math.abs(pick.t - c.end) > 0.005) moves.set(c.clipId, pick.t - c.end);
  }
  if (!moves.size) return { scene, moved: 0 };
  const shift = (list: Layer[]): Layer[] => list.map((l) => {
    const clips = l.clips.map((c): Clip => (moves.has(c.id) ? { ...c, start: Math.max(0, Math.round((c.start + moves.get(c.id)!) * 1000) / 1000) } : c));
    const next = { ...l, clips } as Layer;
    if (next.type === 'group') next.layers = shift(next.layers);
    return next;
  });
  return { scene: { ...scene, layers: shift(scene.layers) }, moved: moves.size };
}

/** The music's cues for the AI: tempo, beats and strong moments, compactly. */
export function musicCues(scene: Scene): string {
  const lines: string[] = [];
  for (const a of scene.audio ?? []) {
    if (a.role !== 'music' || !a.beats) continue;
    const beats = sceneBeats(a);
    const strong = strongMoments(beats);
    lines.push(`MUSIC "${a.name ?? a.id}": ${a.beats.bpm} BPM, beat every ${(60 / a.beats.bpm).toFixed(3)} s, first beat at ${beats[0]?.t ?? a.start} s. STRONG moments (land the big reveals on these): ${strong.map((b) => b.t).join(', ') || 'none'}.`);
  }
  return lines.join('\n');
}
