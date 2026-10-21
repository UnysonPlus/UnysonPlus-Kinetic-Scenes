import type { AudioClip } from './types';
import { parseSfxSrc, synthSfx } from './sfx';

/**
 * A scene's sound: voice-overs, music and effects, scheduled with the Web Audio API against the
 * timeline's clock. Playing from any moment starts each clip at the right point of its file, with its
 * volume and fades; pausing or seeking stops everything and the next play schedules afresh, so sound
 * follows the timeline exactly however it is moved.
 *
 * Browsers only let a page make sound after the visitor has interacted with it, so the engine starts
 * muted until enable() is called from a click or tap (the player's sound button, the Studio's controls).
 * Files are decoded without the playback context (so loading a scene never creates a context the browser
 * holds paused), and sound asked for while the browser still holds the context paused starts, in step,
 * the moment it runs.
 * Shared by the player and the Studio (which plays the editor preview's sound itself).
 */

type Ctx = AudioContext;

/** Decoded and synthesised sound is kept at this rate (the playback context resamples as needed). */
const SAMPLE_RATE = 48000;
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * When a voice is speaking, on the scene's clock: from its words (pauses over 0.6 s split it), or the whole
 * clip when it has no words. Music is lowered over these.
 */
export function voiceSpans(clips: AudioClip[]): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  for (const c of clips) {
    if (c.role !== 'voice') continue;
    const off = c.offset ?? 0;
    if (c.words?.length) {
      let cur: [number, number] | null = null;
      for (const w of c.words) {
        if (w.t < off || (c.duration !== undefined && w.t - off > c.duration)) continue;
        const a = c.start + (w.t - off), b = a + w.d;
        if (cur && a - cur[1] <= 0.6) cur[1] = b;
        else { if (cur) spans.push(cur); cur = [a, b]; }
      }
      if (cur) spans.push(cur);
    } else if (c.duration !== undefined) spans.push([c.start, c.start + c.duration]);
  }
  return spans;
}

export class SceneAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private live: Array<{ src: AudioBufferSourceNode; gain: GainNode }> = [];
  private clips: AudioClip[] = [];
  private playingFrom: { time: number; at: number } | null = null;
  private enabled = false;
  private volume = 1;
  /** A play() made while the context was not yet running: the timeline time and when it was asked. */
  private pending: { time: number; wall: number } | null = null;
  private decoder: BaseAudioContext | null = null;
  /** Called when the context starts or stops running (the Studio shows "click to hear"). */
  onstate: (() => void) | null = null;

  constructor(private win: Window) {}

  /** Whether sound is on (enable() has been called from a user gesture). */
  get on() { return this.enabled; }

  /** Whether the browser is actually letting the engine make sound now. */
  get running() { return this.ctx?.state === 'running'; }

  setClips(clips: AudioClip[] | undefined) {
    this.clips = (clips ?? []).filter((c) => c && typeof c.src === 'string' && c.src);
    if (this.ctx) for (const c of this.clips) this.load(c.src);
  }

  /** Turns sound on. Call from a click or tap handler. */
  enable(): Promise<void> {
    this.enabled = true;
    const ctx = this.context();
    if (!ctx) return Promise.resolve();
    for (const c of this.clips) this.load(c.src);
    this.master!.gain.value = this.volume;
    return ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
  }

  /** Turns sound off (the engine keeps its decoded files). */
  disable() {
    this.enabled = false;
    this.stop();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.volume;
  }

  /** Plays from a timeline moment (seconds). Clips not yet decoded join in as soon as they are. */
  play(time: number) {
    this.stop();
    if (!this.enabled) return;
    const ctx = this.context();
    if (!ctx) return;
    if (ctx.state !== 'running') {
      // Not allowed to sound yet (no click so far) or still waking up: start in step once it runs.
      this.pending = { time, wall: now() };
      ctx.resume().catch(() => { /* waits for a click */ });
      return;
    }
    this.playingFrom = { time, at: ctx.currentTime };
    for (const clip of this.clips) {
      this.load(clip.src).then((buf) => {
        if (!buf || !this.playingFrom || !this.ctx) return;
        // Where the timeline is now, if this file took a moment to decode.
        const now = this.playingFrom.time + (this.ctx.currentTime - this.playingFrom.at);
        this.schedule(clip, buf, now);
      });
    }
  }

  stop() {
    this.playingFrom = null;
    this.pending = null;
    for (const { src, gain } of this.live) {
      try { src.stop(); } catch { /* not started yet */ }
      src.disconnect();
      gain.disconnect();
    }
    this.live = [];
  }

  /** Plays one source right away, outside the timeline (previewing a sound in the Studio). */
  async preview(src: string, volume = 1) {
    const was = this.enabled;
    await this.enable();
    if (!was) this.enabled = was;
    const buf = await this.load(src);
    if (!buf || !this.ctx) return;
    const node = this.ctx.createBufferSource();
    node.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = Math.max(0, Math.min(2, volume));
    node.connect(gain).connect(this.master!);
    node.start();
    node.onended = () => { node.disconnect(); gain.disconnect(); };
  }

  /** Decoded length of a source file, in seconds (null if it can't be read). */
  async durationOf(src: string): Promise<number | null> {
    const b = await this.load(src);
    return b ? b.duration : null;
  }

  /** The decoded file, for drawing waveforms. */
  buffer(src: string) {
    return this.load(src);
  }

  dispose() {
    this.stop();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.onstate = null;
    this.buffers.clear();
  }

  private context(): Ctx | null {
    if (this.ctx) return this.ctx;
    const AC = (this.win as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      ?? (this.win as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    this.ctx = ctx;
    ctx.addEventListener('statechange', () => {
      if (ctx.state === 'running' && this.pending) {
        const p = this.pending;
        this.pending = null;
        this.play(p.time + (now() - p.wall) / 1000);
      }
      this.onstate?.();
    });
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  /**
   * A context only for decoding: an offline one never needs the visitor's permission, so loading files
   * (and drawing waveforms in the Studio) doesn't create the playback context before a click.
   */
  private decodeContext(): BaseAudioContext | null {
    if (this.decoder) return this.decoder;
    const w = this.win as unknown as { OfflineAudioContext?: typeof OfflineAudioContext; webkitOfflineAudioContext?: typeof OfflineAudioContext };
    const OAC = w.OfflineAudioContext ?? w.webkitOfflineAudioContext;
    this.decoder = OAC ? new OAC(1, 1, SAMPLE_RATE) : this.context();
    return this.decoder;
  }

  private load(src: string): Promise<AudioBuffer | null> {
    const hit = this.buffers.get(src);
    if (hit) return hit;
    const ctx = this.decodeContext();
    if (!ctx) return Promise.resolve(null);
    const sfx = parseSfxSrc(src);
    if (sfx) {
      // Built-in sounds are synthesised, not downloaded.
      const pcm = synthSfx(sfx.id, SAMPLE_RATE, sfx.pitch);
      const buf = ctx.createBuffer(1, Math.max(1, pcm.length), SAMPLE_RATE);
      buf.getChannelData(0).set(pcm);
      const done = Promise.resolve(buf);
      this.buffers.set(src, done);
      return done;
    }
    const p = fetch(src)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
      .then((data) => ctx.decodeAudioData(data))
      .catch((e) => { console.warn('[Unyson+ scene] could not load audio', src.slice(0, 80), e); return null; });
    this.buffers.set(src, p);
    return p;
  }

  private schedule(clip: AudioClip, buf: AudioBuffer, time: number) {
    const ctx = this.ctx!;
    const trimIn = Math.max(0, clip.offset ?? 0);
    const len = Math.max(0, Math.min(clip.duration ?? Infinity, buf.duration - trimIn));
    const start = clip.start;
    const end = start + len;
    if (!(len > 0) || time >= end) return;
    const ctxAt = (t: number) => ctx.currentTime + (t - time);
    const from = Math.max(time, start);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    src.connect(gain).connect(this.master!);
    // Volume with fades, as an envelope on the timeline.
    const vol = Math.max(0, Math.min(2, clip.volume ?? 1));
    const fi = Math.max(0, Math.min(len / 2, clip.fadeIn ?? 0));
    const fo = Math.max(0, Math.min(len / 2, clip.fadeOut ?? 0));
    const level = (t: number) => {
      let v = vol;
      if (fi > 0 && t < start + fi) v *= Math.max(0, (t - start) / fi);
      if (fo > 0 && t > end - fo) v *= Math.max(0, (end - t) / fo);
      return v;
    };
    const g = gain.gain;
    // Music sits under a voice-over: lowered to 35% while words are spoken (with short ramps).
    const duck = clip.role === 'music' ? voiceSpans(this.clips) : [];
    const duckAt = (t: number) => {
      let k = 1;
      for (const [a, b] of duck) {
        if (t >= a - 0.2 && t <= b + 0.3) {
          const inn = t < a ? (a - t) / 0.2 : 0;
          const out = t > b ? (t - b) / 0.3 : 0;
          k = Math.min(k, 0.35 + 0.65 * Math.max(inn, out));
        }
      }
      return k;
    };
    if (duck.length) {
      // Sampled every 50 ms: a smooth enough curve for a mix, and simple to keep in step with seeking.
      g.setValueAtTime(level(from) * duckAt(from), ctxAt(from));
      for (let t = from + 0.05; t < end; t += 0.05) g.linearRampToValueAtTime(level(t) * duckAt(t), ctxAt(t));
    } else {
      g.setValueAtTime(level(from), ctxAt(from));
      if (fi > 0 && from < start + fi) g.linearRampToValueAtTime(vol, ctxAt(start + fi));
      if (fo > 0) {
        const foStart = Math.max(from, end - fo);
        if (foStart > from) g.setValueAtTime(level(foStart), ctxAt(foStart));
        g.linearRampToValueAtTime(0, ctxAt(end));
      }
    }
    src.start(Math.max(ctx.currentTime, ctxAt(from)), trimIn + (from - start), end - from);
    this.live.push({ src, gain });
  }
}
