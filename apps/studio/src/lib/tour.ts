import type { Anchor, Clip, ImageLayer, Layer, Marker, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { CAMERA_PROPS, cameraAt } from '@unysonplus/scene-player/camera';
import { findLayer, primaryBreakpoint } from './sceneOps';

/**
 * Product-tour tools in the Studio: focus the camera on a layer, cut a piece out of a screenshot, and
 * steps (a walkthrough described as a list of steps, each saying what changes, turned into clips).
 */

const r2 = (v: number) => Math.round(v * 100) / 100;
const FRACTION: Record<Anchor, [number, number]> = {
  'top-left': [0, 0], top: [0.5, 0], 'top-right': [1, 0], left: [0, 0.5], center: [0.5, 0.5], right: [1, 0.5],
  'bottom-left': [0, 1], bottom: [0.5, 1], 'bottom-right': [1, 1],
};

/** A layer's rectangle in % of the stage (left, top, width, height), from its base layout. */
export function layerRect(scene: Scene, layer: Layer): { l: number; t: number; w: number; h: number } | null {
  if (!('box' in layer) || !layer.box) return null;
  const bp = scene.stage.breakpoints.find((b) => b.id === primaryBreakpoint(scene));
  const stageAspect = bp ? bp.aspect[0] / bp.aspect[1] : 16 / 9;
  const b = layer.box;
  let w = b.w ?? 0;
  let h = b.h ?? (b.ratio && w ? (w * stageAspect) / b.ratio : 0);
  if (layer.type === 'text') {
    // A text layer without a size: estimated from its words and type size.
    const lines = layer.text.split('\n');
    const longest = Math.max(...lines.map((l) => l.length));
    w = w || Math.min(96, longest * layer.style.fontSize * 0.55);
    h = lines.length * layer.style.fontSize * (layer.style.lineHeight ?? 1.1) * stageAspect;
  }
  const [fx, fy] = FRACTION[b.anchor ?? 'center'];
  return { l: b.x - w * fx, t: b.y - h * fy, w, h };
}

/** Focus the camera on a layer: glide in to frame it, hold, and glide back to the view before. */
export function focusCamera(scene: Scene, layerId: string, t: number, length = 0.8, hold = 1.6): Scene {
  const layer = findLayer(scene, layerId);
  const rect = layer ? layerRect(scene, layer) : null;
  if (!rect || rect.w <= 0) return scene;
  const keys = [...(scene.camera?.keys ?? [])].sort((a, b) => a.t - b.t);
  const t0 = r2(Math.max(0, Math.min(scene.duration - 0.3, t)));
  const t1 = r2(Math.min(scene.duration, t0 + length));
  const t2 = r2(Math.min(scene.duration, t1 + hold));
  const t3 = r2(Math.min(scene.duration, t2 + length));
  const from = cameraAt(keys, t0);
  const zoom = Math.max(1, Math.min(4, Math.min(62 / rect.w, 62 / Math.max(rect.h, 1))));
  const at = { ...from, x: r2(rect.l + rect.w / 2 - 50), y: r2(rect.t + rect.h / 2 - 50), zoom: Math.round(zoom * 1000) / 1000 };
  const kept = keys.filter((k) => k.t < t0 - 0.01 || k.t > t3 + 0.01);
  let n = kept.length;
  const id = () => { let s = `cam${++n}`; while (kept.some((k) => k.id === s)) s = `cam${++n}`; return s; };
  const pick = (v: typeof from) => Object.fromEntries(CAMERA_PROPS.map((p) => [p, v[p]]));
  const next = [...kept, { id: id(), t: t0, ...pick(from) }, { id: id(), t: t1, ...pick(at), ease: 'softInOut' }];
  if (t2 > t1 + 0.05) next.push({ id: id(), t: t2, ...pick(at) });
  if (t3 > t2 + 0.05) next.push({ id: id(), t: t3, ...pick(from), ease: 'softInOut' });
  return { ...scene, camera: { keys: next.sort((a, b) => a.t - b.t) } };
}

/* ------------------------------------------------------------------ cut a piece out of a screenshot */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, bad) => {
    const img = new Image();
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => ok(img);
    img.onerror = () => bad(new Error('the picture could not be read (an address on another site must allow it)'));
    img.src = src;
  });
}

/** Cuts one region (in % of the image layer's box) out into its own layer: see cutOutMany. */
export async function cutOut(scene: Scene, layerId: string, region: Region, name = 'Cut-out'): Promise<{ scene: Scene; id: string }> {
  const r = await cutOutMany(scene, layerId, [region], [name]);
  return { scene: r.scene, id: r.ids[0] };
}

/** A region of a picture, in % of the image layer's box. */
export interface Region { x: number; y: number; w: number; h: number }

/**
 * Cuts several regions (in % of the image layer's box) out into their own layers, each in exactly the same
 * place, and fills the gaps they leave from the regions' edges (interface screenshots are mostly flat, so
 * blending the border across a hole hides it). The pieces go above the picture in the order given.
 */
export async function cutOutMany(scene: Scene, layerId: string, regions: Region[], names: string[] = []): Promise<{ scene: Scene; ids: string[] }> {
  const layer = findLayer(scene, layerId) as ImageLayer | undefined;
  if (!layer || layer.type !== 'image') throw new Error('choose an image layer');
  const rect = layerRect(scene, layer);
  if (!rect) throw new Error('the layer has no size');
  if (!regions.length) throw new Error('mark at least one piece');
  const img = await loadImage(layer.src);
  const W = img.naturalWidth, H = img.naturalHeight;
  // Where the box's region falls on the picture (object-fit cover or contain).
  const bp = scene.stage.breakpoints.find((b) => b.id === primaryBreakpoint(scene));
  const stageAspect = bp ? bp.aspect[0] / bp.aspect[1] : 16 / 9;
  const boxAspect = (rect.w / rect.h) * stageAspect;
  const imgAspect = W / H;
  const cover = (layer.fit ?? 'cover') === 'cover';
  let sw: number, sh: number;
  if (cover === imgAspect > boxAspect) { sh = H; sw = H * boxAspect; } else { sw = W; sh = W / boxAspect; }
  const ox = (W - sw) / 2, oy = (H - sh) / 2;
  const full = document.createElement('canvas');
  full.width = W; full.height = H;
  const g = full.getContext('2d')!;
  g.drawImage(img, 0, 0);
  // Every piece is cut from the untouched picture first, then every hole is filled.
  const pixels = regions.map((region) => {
    const px = Math.max(0, Math.round(ox + (region.x / 100) * sw)), py = Math.max(0, Math.round(oy + (region.y / 100) * sh));
    const pw = Math.max(1, Math.min(W - px, Math.round((region.w / 100) * sw))), ph = Math.max(1, Math.min(H - py, Math.round((region.h / 100) * sh)));
    const piece = document.createElement('canvas');
    piece.width = pw; piece.height = ph;
    piece.getContext('2d')!.drawImage(full, px, py, pw, ph, 0, 0, pw, ph);
    return { px, py, pw, ph, src: piece.toDataURL('image/png') };
  });
  const data = g.getImageData(0, 0, W, H);
  const d = data.data;
  const at = (x: number, y: number) => (y * W + x) * 4;
  for (const { px, py, pw, ph } of pixels) {
    const x0 = Math.max(0, px - 1), y0 = Math.max(0, py - 1), x1 = Math.min(W - 1, px + pw), y1 = Math.min(H - 1, py + ph);
    // An interface's background is mostly one flat colour: when most of the border is one colour, the hole is
    // filled with it (blending would smear a selected card's coloured edge across the gap).
    const counts = new Map<number, number>();
    let total = 0;
    const tally = (x: number, y: number) => { const i = at(x, y); const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3); counts.set(k, (counts.get(k) ?? 0) + 1); total++; };
    for (let x = x0; x <= x1; x++) { tally(x, y0); tally(x, y1); }
    for (let y = y0 + 1; y < y1; y++) { tally(x0, y); tally(x1, y); }
    let top = 0, topN = 0;
    counts.forEach((n, k) => { if (n > topN) { topN = n; top = k; } });
    if (topN >= total * 0.6) {
      const rgb = [((top >> 10) & 31) * 8 + 4, ((top >> 5) & 31) * 8 + 4, (top & 31) * 8 + 4];
      // The exact colour: the first border pixel in that bucket.
      for (let x = x0; x <= x1; x++) { const i = at(x, y0); if ((((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3)) === top) { rgb[0] = d[i]; rgb[1] = d[i + 1]; rgb[2] = d[i + 2]; break; } }
      for (let y = py; y < py + ph && y < H; y++) for (let x = px; x < px + pw && x < W; x++) { const i = at(x, y); d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255; }
      continue;
    }
    // Otherwise each pixel blends the border pixels across from it (left/right and top/bottom), weighted by distance.
    for (let y = py; y < py + ph && y < H; y++) {
      for (let x = px; x < px + pw && x < W; x++) {
        const fx = (x - x0) / Math.max(1, x1 - x0), fy = (y - y0) / Math.max(1, y1 - y0);
        const l = at(x0, y), r = at(x1, y), t = at(x, y0), b = at(x, y1);
        const wx = 1 - Math.abs(fx - 0.5) * 2, wy = 1 - Math.abs(fy - 0.5) * 2;
        // Nearer edges count more: the direction across the shorter span wins.
        const kx = wy + 0.001, ky = wx + 0.001;
        for (let c = 0; c < 3; c++) {
          const hv = d[l + c] * (1 - fx) + d[r + c] * fx;
          const vv = d[t + c] * (1 - fy) + d[b + c] * fy;
          d[at(x, y) + c] = (hv * kx + vv * ky) / (kx + ky);
        }
        d[at(x, y) + 3] = 255;
      }
    }
  }
  g.putImageData(data, 0, 0);
  const filled = full.toDataURL('image/png');
  const taken = new Set<string>();
  const collect = (list: Layer[]) => list.forEach((l) => { taken.add(l.id); if (l.type === 'group') collect(l.layers); });
  collect(scene.layers);
  let n = 1;
  const pieces: Layer[] = regions.map((region, i) => {
    while (taken.has(`${layerId}-cut${n}`)) n++;
    const id = `${layerId}-cut${n}`;
    taken.add(id);
    // The piece's box on the stage: the same region of the layer's rectangle.
    const box = { x: r2(rect.l + (region.x / 100) * rect.w), y: r2(rect.t + (region.y / 100) * rect.h), w: r2((region.w / 100) * rect.w), h: r2((region.h / 100) * rect.h), anchor: 'top-left' as Anchor };
    return { id, type: 'image', name: names[i] || (regions.length > 1 ? `Piece ${i + 1}` : 'Cut-out'), src: pixels[i].src, alt: '', fit: 'cover', box, clips: [] } as Layer;
  });
  const place = (list: Layer[]): Layer[] => list.flatMap((l) => {
    if (l.id === layerId) return [{ ...l, src: filled } as Layer, ...pieces];
    return l.type === 'group' ? [{ ...l, layers: place(l.layers) }] : [l];
  });
  return { scene: { ...scene, layers: place(scene.layers) }, ids: pieces.map((p) => p.id) };
}

/* ------------------------------------------------------------------ steps */

export interface StepAction { layer: string; preset: string; params?: Record<string, unknown>; duration?: number; offset?: number; ease?: string }
export interface Step { id: string; label?: string; at?: number; hold?: number; do: StepAction[] }

/**
 * Steps → clips. Each step starts when the one before has finished and held (or at its own "at"), its
 * actions start together (or "offset" seconds into the step), and a marker is placed at every step so
 * click-to-advance and hotspots can use them. Clips made from steps carry the step's id, so applying the
 * steps again replaces them and leaves every other clip alone.
 */
export function applySteps(scene: Scene): { scene: Scene; warnings: string[] } {
  const steps = (scene as Scene & { steps?: Step[] }).steps ?? [];
  const warnings: string[] = [];
  // Each layer's offset on the scene's clock (children of a group run on the group's clock).
  const offsets = new Map<string, number>();
  const walk = (list: Layer[], off: number) => list.forEach((l) => { offsets.set(l.id, off); if (l.type === 'group') walk(l.layers, off + (l.start ?? 0)); });
  walk(scene.layers, 0);
  const add = new Map<string, Clip[]>();
  const markers: Marker[] = [];
  let cursor = 0.4;
  steps.forEach((st, si) => {
    const start = typeof st.at === 'number' ? st.at : cursor;
    let end = start;
    (st.do ?? []).forEach((a, ai) => {
      const meta = presetMeta[a.preset];
      if (!meta) { warnings.push(`Step ${si + 1}: "${a.preset}" is not a preset.`); return; }
      if (!offsets.has(a.layer)) { warnings.push(`Step ${si + 1}: no layer "${a.layer}".`); return; }
      const dur = a.duration ?? meta.defaultDuration;
      const at = start + (a.offset ?? 0);
      const clip: Clip & { step?: string } = { id: `st-${st.id}-${ai}`, preset: a.preset, start: r2(Math.max(0, at - (offsets.get(a.layer) ?? 0))), duration: r2(dur), ...(a.ease ? { ease: a.ease } : {}), ...(a.params ? { params: a.params } : {}), step: st.id };
      add.set(a.layer, [...(add.get(a.layer) ?? []), clip]);
      end = Math.max(end, at + dur);
    });
    markers.push({ id: `step-${st.id}`, t: r2(start), label: st.label ?? `Step ${si + 1}` });
    cursor = end + (st.hold ?? 1.2);
  });
  const rebuild = (list: Layer[]): Layer[] => list.map((l) => {
    const own = l.clips.filter((c) => !(c as Clip & { step?: string }).step);
    const next = { ...l, clips: [...own, ...(add.get(l.id) ?? [])] } as Layer;
    if (next.type === 'group') next.layers = rebuild(next.layers);
    return next;
  });
  const otherMarkers = (scene.markers ?? []).filter((m) => !m.id.startsWith('step-'));
  const allMarkers = [...otherMarkers, ...markers].sort((a, b) => a.t - b.t);
  const duration = Math.max(scene.duration, Math.ceil((cursor + 0.2) * 10) / 10);
  return { scene: { ...scene, duration, layers: rebuild(scene.layers), ...(allMarkers.length ? { markers: allMarkers } : {}) }, warnings };
}
