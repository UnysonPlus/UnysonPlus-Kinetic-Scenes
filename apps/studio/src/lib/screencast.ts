import type { CameraKey, Clip, Layer, Scene } from '@unysonplus/scene-player/types';

/**
 * A screencast recorded with the AI Dev Kit (`studio-cli record`: video.mp4 + actions.json) as a scene: the camera
 * zooms to each action where it happened and pulls back between them, numbered step captions stay on screen. The
 * camera keys are ordinary keys, so the framing can be adjusted afterwards. Same rules as the kit's
 * studio-screencast.mjs.
 */

export interface RecordedAction { kind: string; label: string; t: number; end: number; rect?: { x: number; y: number; w: number; h: number } }
export interface Recording { width: number; height: number; seconds: number; actions: RecordedAction[] }

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

export function isRecording(j: unknown): j is Recording {
  const r = j as Recording;
  return !!r && typeof r.width === 'number' && typeof r.height === 'number' && typeof r.seconds === 'number' && Array.isArray(r.actions);
}

export function screencastScene(rec: Recording, src: string, opts: { vertical: boolean; title?: string; accent?: string }): Scene {
  const vertical = opts.vertical;
  const SW = vertical ? 1080 : 1920, SH = vertical ? 1920 : 1080;
  const DUR = r2(rec.seconds);
  const accent = opts.accent || '#6B4CF6', ink = '#0f0d1a';
  const vh = (rec.height / rec.width) * (SW / SH) * 100;
  const top = 50 - vh / 2;
  const zMin = vertical ? 2.2 : 1.2, zMax = vertical ? 4 : 2.6, overview = vertical ? 1.6 : 1;

  type Stop = { t: number; end: number; label: string; rect?: RecordedAction['rect']; wide?: boolean };
  const stops: Stop[] = [];
  for (const a of rec.actions) {
    if (!a.rect) { stops.push({ t: a.t, end: a.end, label: a.label, wide: true }); continue; }
    const last = stops[stops.length - 1];
    if (last && !last.wide && last.rect && Math.abs(last.rect.x - a.rect.x) < 40 && Math.abs(last.rect.y - a.rect.y) < 40) { last.end = a.end; continue; }
    stops.push({ t: a.t, end: a.end, label: a.label, rect: a.rect });
  }
  const wide = { x: 0, y: 0, zoom: overview };
  const view = (s: Stop) => {
    if (s.wide || !s.rect) return { x: 0, y: 0, zoom: 1 };
    const cx0 = ((s.rect.x + s.rect.w / 2) / rec.width) * 100, cy0 = top + ((s.rect.y + s.rect.h / 2) / rec.height) * vh;
    const wPct = (s.rect.w / rec.width) * 100, hPct = (s.rect.h / rec.height) * vh;
    const z = clamp(Math.min(88 / Math.max(wPct * 1.15, 1), 60 / Math.max(hPct * 1.3, 1)), zMin, zMax);
    const half = 50 / z;
    // A target wider than the view (a long text field): look at its left part, where the typing is.
    const left = (s.rect.x / rec.width) * 100;
    const fx = wPct > 2 * half * 0.9 ? left + half * 0.85 : cx0;
    const cx = clamp(fx, half, 100 - half);
    const cy = vh >= 2 * half ? clamp(cy0, top + half, top + vh - half) : 50;
    return { x: r2(cx - 50), y: r2(cy - 50), zoom: r2(z) };
  };
  const keys: CameraKey[] = [];
  let k = 0;
  const key = (t: number, v: { x: number; y: number; zoom: number }) => keys.push({ id: `sk${k++}`, t: r2(Math.max(0, t)), x: v.x, y: v.y, zoom: v.zoom, ease: 'inOut' });
  key(0, { x: 0, y: 0, zoom: 1 });
  let prevEnd = 0;
  stops.forEach((s, i) => {
    const v = view(s);
    const arrive = Math.max(prevEnd + 0.05, s.t - 0.35);
    const last = keys[keys.length - 1];
    key(Math.max(prevEnd + 0.05, arrive - 0.55), { x: last.x ?? 0, y: last.y ?? 0, zoom: last.zoom ?? 1 });
    key(arrive, v);
    const hold = s.end + 0.45;
    key(hold, v);
    const next = stops[i + 1];
    if (!next || next.t - hold > 2.2) { key(hold + 0.7, wide); prevEnd = hold + 0.7; } else prevEnd = hold;
  });
  keys.sort((a, b) => a.t - b.t);
  const camera = keys.filter((x, i) => i === 0 || x.t > keys[i - 1].t + 0.01);

  let n = 0;
  const c = (preset: string, start: number, duration: number, params?: Record<string, unknown>): Clip => ({ id: `sc${++n}`, preset, start: r2(start), duration, ...(params ? { params } : {}) });
  const layers: Layer[] = [
    // Not pinned (pinned layers sit above everything): big enough that the camera never reaches its edges.
    { id: 'bg', name: 'Background', type: 'shape', shape: 'rect', box: { x: 50, y: 50, w: 400, h: 400 }, radius: 0, start: 0, end: DUR,
      fill: `radial-gradient(circle at 50% 30%, #2a1f6b 0%, ${ink} 65%)`, clips: [] } as Layer,
    { id: 'screen', name: 'Screencast', type: 'video', src, offset: 0, fit: 'cover', box: { x: 50, y: 50, w: 100, h: r2(vh) }, sound: 0, start: 0, end: DUR, alt: 'A screen recording', clips: [] } as Layer,
  ];
  const skip = /^(Save|Saved|Open its settings|Content Elements|Components|Layout Elements|Media Elements|Interactive Elements)$/i;
  const seen = new Set<string>();
  const steps: Array<{ t: number; label: string }> = [];
  for (const s of stops) { if (!s.label || skip.test(s.label) || seen.has(s.label)) continue; seen.add(s.label); steps.push({ t: s.t, label: s.label }); }
  steps.forEach((s, i) => {
    const e = steps[i + 1]?.t ?? DUR;
    layers.push({ id: `step${i + 1}`, name: `Step ${i + 1}`, type: 'text', text: `${i + 1}  ·  ${s.label}`, pin: 'stage', box: { x: 50, y: vertical ? 16 : 10, w: vertical ? 70 : 86 }, start: r2(s.t), end: r2(e),
      style: { fontFamily: 'Inter', fontSize: vertical ? 5.4 : 2.6, fontWeight: 700, color: '#ffffff', align: 'center', lineHeight: 1.05 },
      pill: { fill: accent, padX: 1, padY: 0.5, radius: 99 },
      clips: [c('pop', s.t, 0.35), c('fade', e - 0.25, 0.25, { direction: 'out' })] } as Layer);
  });
  return {
    format: 'unysonplus-scene', version: 1, title: opts.title || 'Screencast', duration: DUR, mode: 'video',
    video: { formats: [vertical ? '9x16' : '16x9'], fps: 30, platform: vertical ? 'reels' : 'youtube' },
    stage: { breakpoints: [{ id: vertical ? '9x16' : '16x9', label: vertical ? '9:16' : '16:9', minWidth: 0, aspect: vertical ? [9, 16] : [16, 9] }], heightMode: 'fill', background: ink, safeArea: 0.05, fonts: [] },
    playback: { trigger: 'load', loop: false, posterTime: r2(DUR * 0.6) },
    layers, audio: [], markers: [], camera: { keys: camera },
  } as unknown as Scene;
}
