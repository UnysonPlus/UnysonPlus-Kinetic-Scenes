import type { Breakpoint, Layer, Scene } from '@unysonplus/scene-player/types';
import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { footageIds, getFootage } from './footage';

/**
 * Video export in the browser itself, with nothing installed, where the browser can draw part of a page into a
 * picture (HTML-in-Canvas: a canvas with "layoutsubtree" and drawElementImage). The scene plays inside such a
 * canvas; each frame is sought, drawn exactly and encoded by the browser (WebCodecs, H.264), its sound mixed
 * offline and encoded as AAC, and both are put into an MP4. Elsewhere the AI Dev Kit renders the video.
 */

/** WebCodecs' audio side (not in this TypeScript's DOM library yet). */
interface AudioEncoderLike { configure(c: Record<string, unknown>): void; encode(d: unknown): void; flush(): Promise<void>; close(): void }
type AudioChunk = Parameters<Muxer<ArrayBufferTarget>['addAudioChunk']>[0];
type AudioMeta = Parameters<Muxer<ArrayBufferTarget>['addAudioChunk']>[1];
const WC = globalThis as unknown as {
  AudioEncoder?: new (init: { output: (chunk: AudioChunk, meta?: AudioMeta) => void; error: (e: unknown) => void }) => AudioEncoderLike;
  AudioData?: new (init: Record<string, unknown>) => { close(): void };
};
type Api = {
  mount: (host: HTMLElement, scene: unknown, opts: Record<string, unknown>) => Player;
  soundTrack?: (scene: Scene) => Array<{ src: string; start: number; offset?: number; duration?: number; volume?: number; fadeIn?: number; fadeOut?: number; role?: string }>;
  sfxWav?: (src: string) => Uint8Array | null;
  voiceSpans?: (clips: unknown[]) => Array<[number, number]>;
};
type Player = { seek: (t: number) => void; settle?: () => Promise<void>; whenReady: (ms?: number) => Promise<{ missing: string[] }>; destroy?: () => void };

/** Whether this browser can render video on its own. */
export function browserCanRender(): boolean {
  return typeof window !== 'undefined'
    && typeof (CanvasRenderingContext2D.prototype as unknown as { drawElementImage?: unknown }).drawElementImage === 'function'
    && 'layoutSubtree' in HTMLCanvasElement.prototype
    && typeof VideoEncoder !== 'undefined' && typeof WC.AudioEncoder !== 'undefined';
}

let apiPromise: Promise<Api> | null = null;
/** The Studio's own player (the same version it previews with), loaded once into this page. */
function loadPlayer(): Promise<Api> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((ok, bad) => {
    const w = window as unknown as { UnysonPlusScene?: Api; UPW_SCENE_ASSET_BASE?: string };
    if (w.UnysonPlusScene) return ok(w.UnysonPlusScene);
    const base = new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href;
    w.UPW_SCENE_ASSET_BASE = base;
    const s = document.createElement('script');
    s.src = `${base}scene-player.js`;
    s.dataset.autoMount = 'false';
    s.onload = () => (w.UnysonPlusScene ? ok(w.UnysonPlusScene) : bad(new Error('The player did not load.')));
    s.onerror = () => bad(new Error('The player could not be loaded.'));
    document.head.appendChild(s);
  });
  return apiPromise;
}

/** The layout a video of this size uses (a video scene's format, else by width and shape, as a screen would). */
function pickBreakpoint(bps: Breakpoint[], w: number, h: number): Breakpoint {
  const sorted = [...bps].sort((a, b) => b.minWidth - a.minWidth || (b.minRatio ?? 0) - (a.minRatio ?? 0));
  const ratio = w / h;
  return sorted.find((b) => w >= b.minWidth && (b.minRatio === undefined || ratio >= b.minRatio))
    ?? sorted.find((b) => w >= b.minWidth && b.minRatio === undefined) ?? sorted[sorted.length - 1];
}

/** Footage kept in this browser, given addresses this page can play. */
async function withLocalFootage(scene: Scene): Promise<{ scene: Scene; urls: string[] }> {
  const urls: string[] = [];
  const map = new Map<string, string>();
  for (const id of footageIds(scene)) {
    const b = await getFootage(id);
    if (!b) throw new Error('Some footage is not on this computer any more. Add it again, then render.');
    const u = URL.createObjectURL(b);
    urls.push(u);
    map.set(id, u);
  }
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return map.get(v) ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return { scene: { ...scene, layers: walk(scene.layers) as Layer[] }, urls };
}

/** Footage layers whose own sound goes into the video, on the scene's clock. */
function footageSound(scene: Scene) {
  const out: Array<{ src: string; start: number; offset: number; volume: number; rate: number; duration?: number }> = [];
  const walk = (list: Layer[], offset: number) => list.forEach((l) => {
    if (l.type === 'group') return walk(l.layers, offset + (l.start ?? 0));
    if (l.type !== 'video' || !(l.sound && l.sound > 0) || l.reference) return;
    out.push({ src: l.src, start: offset + (l.start ?? 0), offset: l.offset ?? 0, volume: l.sound, rate: l.rate ?? 1, ...(typeof l.end === 'number' ? { duration: (l.end - (l.start ?? 0)) * (l.rate ?? 1) } : {}) });
  });
  walk(scene.layers, 0);
  return out;
}

/** The scene's sound, mixed offline: tracks, clip sounds and footage sound, music lowered under the voice. */
async function mixAudio(api: Api, scene: Scene, seconds: number): Promise<AudioBuffer | null> {
  const track = api.soundTrack ? api.soundTrack(scene) : (scene.audio ?? []);
  const clips = [...track, ...footageSound(scene)];
  if (!clips.length) return null;
  const rate = 48000;
  const ctx = new OfflineAudioContext(2, Math.max(1, Math.ceil(seconds * rate)), rate);
  const spans = api.voiceSpans ? api.voiceSpans(clips) : [];
  for (const c of clips) {
    let bytes: ArrayBuffer | null = null;
    try {
      if (c.src.startsWith('sfx:')) { const w = api.sfxWav?.(c.src); bytes = w ? w.slice().buffer : null; }
      else bytes = await (await fetch(c.src)).arrayBuffer();
    } catch { bytes = null; }
    if (!bytes) continue;
    let buf: AudioBuffer;
    try { buf = await ctx.decodeAudioData(bytes); } catch { continue; }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const speed = 'rate' in c ? (c as { rate: number }).rate : 1;
    src.playbackRate.value = speed;
    const g = ctx.createGain();
    const vol = Math.max(0, Math.min(2, c.volume ?? 1));
    const start = Math.max(0, c.start);
    const offset = Math.max(0, c.offset ?? 0);
    const len = Math.max(0.05, Math.min(c.duration ?? Infinity, (buf.duration - offset) / speed, seconds - start));
    g.gain.setValueAtTime(vol, 0);
    const fi = Math.max(0, (c as { fadeIn?: number }).fadeIn ?? 0), fo = Math.max(0, (c as { fadeOut?: number }).fadeOut ?? 0);
    if (fi > 0) { g.gain.setValueAtTime(0, start); g.gain.linearRampToValueAtTime(vol, start + fi); }
    if (fo > 0) { g.gain.setValueAtTime(vol, start + len - fo); g.gain.linearRampToValueAtTime(0, start + len); }
    // Music ducks to 35% while the voice speaks.
    if ((c as { role?: string }).role === 'music') for (const [a, b] of spans) { g.gain.setTargetAtTime(vol * 0.35, Math.max(0, a - 0.15), 0.05); g.gain.setTargetAtTime(vol, b + 0.25, 0.08); }
    src.connect(g).connect(ctx.destination);
    src.start(start, offset, len * speed);
  }
  return ctx.startRendering();
}

export interface BrowserRenderOptions { width: number; height: number; fps: number; composite?: boolean; cover?: boolean }

/** Renders the scene to an MP4 in this browser; reports progress; resolves with the file (and the cover). */
export async function renderInBrowser(input: Scene, opts: BrowserRenderOptions, onProgress: (done: number, total: number) => void, signal: AbortSignal): Promise<{ blob: Blob; name: string; cover?: Blob }> {
  if (!browserCanRender()) throw new Error('This browser cannot render video on its own.');
  const W = Math.round(opts.width / 2) * 2, H = Math.round(opts.height / 2) * 2;
  const api = await loadPlayer();
  const { scene: withFeet, urls } = await withLocalFootage(input);
  const bp = pickBreakpoint(withFeet.stage.breakpoints, W, H);
  // The stage keeps the layout's shape at the video's width; the scene's own trigger is ignored (frames are sought).
  const scene: Scene = { ...withFeet, stage: { ...withFeet.stage, heightMode: 'ratio' }, playback: { ...withFeet.playback, trigger: 'manual', loop: false } };

  // The canvas the scene is laid out in (and drawn from). It stays on screen, under a cover, so the browser paints it.
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;z-index:-1;pointer-events:none';
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  canvas.setAttribute('layoutsubtree', '');
  canvas.style.cssText = `width:${W}px;height:${H}px`;
  const host = document.createElement('div');
  host.style.cssText = `width:${W}px;height:${H}px;overflow:hidden;background:#000`;
  canvas.appendChild(host);
  wrap.appendChild(canvas);
  document.body.appendChild(wrap);
  const g = canvas.getContext('2d') as CanvasRenderingContext2D & { drawElementImage: (el: Element, x: number, y: number, w?: number, h?: number) => void };
  const c = canvas as HTMLCanvasElement & { requestPaint: () => void; onpaint: (() => void) | null };
  const paint = () => new Promise<void>((ok, bad) => {
    const t = setTimeout(() => bad(new Error('The browser stopped drawing the scene.')), 5000);
    c.onpaint = () => { clearTimeout(t); try { g.clearRect(0, 0, W, H); g.drawElementImage(host, 0, 0, W, H); ok(); } catch (e) { bad(e as Error); } };
    c.requestPaint();
  });

  let player: Player | null = null;
  try {
    player = api.mount(host, scene, { autoplay: false, editor: true, allowCode: true, audio: false, breakpoint: bp.id, reference: !!opts.composite });
    await player.whenReady(30000);
    const total = Math.max(1, Math.round(scene.duration * opts.fps));
    const target = new ArrayBufferTarget();
    const audio = await mixAudio(api, scene, total / opts.fps);
    const muxer = new Muxer({
      target, fastStart: 'in-memory',
      video: { codec: 'avc', width: W, height: H, frameRate: opts.fps },
      ...(audio ? { audio: { codec: 'aac', numberOfChannels: 2, sampleRate: audio.sampleRate } } : {}),
    });
    let failure: Error | null = null;
    const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { failure = e as Error; } });
    // High profile, level 5.1: up to 4K.
    venc.configure({ codec: 'avc1.640033', width: W, height: H, bitrate: Math.round(W * H * opts.fps * 0.15), framerate: opts.fps, avc: { format: 'avc' } });
    for (let f = 0; f < total; f++) {
      if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
      if (failure) throw failure;
      const t = Math.floor((f / opts.fps) * 10000 + 1e-6) / 10000;
      player.seek(t);
      if (player.settle) await player.settle();
      await paint();
      const frame = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / opts.fps), duration: Math.round(1e6 / opts.fps) });
      venc.encode(frame, { keyFrame: f % (opts.fps * 2) === 0 });
      frame.close();
      while (venc.encodeQueueSize > 4) await new Promise((r) => setTimeout(r, 4));
      onProgress(f + 1, total);
    }
    await venc.flush();
    venc.close();
    if (audio) {
      const aenc = new WC.AudioEncoder!({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: (e) => { failure = e as Error; } });
      aenc.configure({ codec: 'mp4a.40.2', numberOfChannels: 2, sampleRate: audio.sampleRate, bitrate: 192000 });
      const n = audio.length, step = 4800;
      for (let i = 0; i < n; i += step) {
        const len = Math.min(step, n - i);
        const data = new Float32Array(len * 2);
        data.set(audio.getChannelData(0).subarray(i, i + len), 0);
        data.set(audio.getChannelData(1).subarray(i, i + len), len);
        const ad = new WC.AudioData!({ format: 'f32-planar', sampleRate: audio.sampleRate, numberOfFrames: len, numberOfChannels: 2, timestamp: Math.round((i / audio.sampleRate) * 1e6), data });
        aenc.encode(ad);
        ad.close();
      }
      await aenc.flush();
      aenc.close();
    }
    if (failure) throw failure;
    muxer.finalize();
    let cover: Blob | undefined;
    if (opts.cover) {
      const pt = typeof scene.playback.posterTime === 'number' ? scene.playback.posterTime : scene.duration - 0.01;
      player.seek(pt);
      if (player.settle) await player.settle();
      await paint();
      cover = await new Promise<Blob | undefined>((ok) => canvas.toBlob((b) => ok(b ?? undefined), 'image/png'));
    }
    const slug = (scene.title || 'scene').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'scene';
    return { blob: new Blob([target.buffer], { type: 'video/mp4' }), name: `${slug}-${W}x${H}.mp4`, cover };
  } finally {
    try { player?.destroy?.(); } catch { /* gone */ }
    wrap.remove();
    urls.forEach((u) => URL.revokeObjectURL(u));
  }
}
