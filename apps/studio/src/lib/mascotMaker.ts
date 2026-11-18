import type { MascotFaceBox, MascotLayer, MascotPose, MascotViseme } from '@unysonplus/scene-player/types';

/**
 * The mascot creator's tools, all in the browser: cutting a pose sheet (several poses on one plain background) into
 * separate see-through poses, taking the background off a single picture, guessing where the face is, carrying the
 * face from one pose to the others, the prompt for an image AI, and the Mascot layer itself.
 */

export const POSE_NAMES = ['Idle', 'Explaining', 'Wave', 'Thinking', 'Thumbs up', 'Cheer'];

/** What to ask an image AI for: six poses of the same character on one plain green sheet, mouth closed. */
export const POSE_SHEET_PROMPT = `Draw the character in the attached picture in six poses, all on one image, in a grid of 3 columns and 2 rows:
1. standing relaxed, arms down
2. explaining, one hand held out to the side
3. waving with one hand
4. thinking, one hand on its chin
5. giving a thumbs up
6. cheering, both arms up

Keep it exactly the same character in every pose: the same face, colours, proportions and outfit, the same size, facing the viewer. Mouth closed and relaxed, eyes open, in every pose. Show the whole character in each pose, with plenty of empty space between the poses so they never touch. Use a plain, flat bright green background (#00FF00) with no shadows, no floor, no text and no frames.`;

/** What to ask an image AI for: the mascot's mouth in nine shapes, one per sound, on one plain green sheet. */
export const MOUTH_SHEET_PROMPT = `Draw only the mouth of the character in the attached picture, nine times, all on one image, in a grid of 3 columns and 3 rows, each shaped for a different sound, in this order:
1. closed and relaxed (silent)
2. wide open, as in "ah"
3. stretched wide showing the top teeth, as in "ee"
4. round and open, as in "oh"
5. small and round, as in "oo"
6. lips pressed together, as in "m"
7. top teeth resting on the lower lip, as in "f"
8. open with the tongue up behind the top teeth, as in "l"
9. slightly open showing the teeth, as in "s"

The same style, colours and line thickness as the character's own mouth, all the same size, seen from the front. Only the mouth and lips, nothing else of the face. Plenty of empty space between them so they never touch. A plain, flat bright green background (#00FF00), no text, no frames.`;

/** The shape each mouth on the sheet is, in the prompt's order. */
export const MOUTH_ORDER: MascotViseme[] = ['rest', 'a', 'e', 'o', 'u', 'mbp', 'fv', 'l', 'etc'];
export const MOUTH_LABEL: Record<MascotViseme, string> = { rest: 'Closed', a: 'Ah', e: 'Ee', o: 'Oh', u: 'Oo', mbp: 'M B P', fv: 'F V', l: 'L', etc: 'S T K' };

/** Cuts a sheet of nine drawn mouths into one picture per shape (in the prompt's order). */
export async function cutMouths(src: string): Promise<{ mouths: Partial<Record<MascotViseme, string>>; found: number }> {
  const r = await cutSheet(src, { min: 0.0012 });
  const mouths: Partial<Record<MascotViseme, string>> = {};
  r.poses.slice(0, 9).forEach((p, i) => { mouths[MOUTH_ORDER[i]] = p.src; });
  return { mouths, found: r.poses.length };
}

export interface CutPose { src: string; ratio: number; width: number; height: number; face: { mouth?: MascotFaceBox; eyes: MascotFaceBox[] } }

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, bad) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => ok(im);
    im.onerror = () => bad(new Error('That picture could not be opened.'));
    im.src = src;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((ok, bad) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = () => bad(new Error('That file could not be read.'));
    r.readAsDataURL(file);
  });
}

interface Bg { transparent: boolean; r: number; g: number; b: number; spread: number }

/** The background: see-through, or the colour of the corners (when they agree). Null when the corners differ (a photo). */
function backgroundOf(d: Uint8ClampedArray, w: number, h: number): Bg | null {
  const k = Math.max(4, Math.round(Math.min(w, h) * 0.02));
  const px: number[][] = [];
  for (const [cx, cy] of [[0, 0], [w - k, 0], [0, h - k], [w - k, h - k]]) {
    for (let y = cy; y < cy + k; y++) for (let x = cx; x < cx + k; x++) { const i = (y * w + x) * 4; px.push([d[i], d[i + 1], d[i + 2], d[i + 3]]); }
  }
  const clear = px.filter((p) => p[3] < 30).length / px.length;
  if (clear > 0.8) return { transparent: true, r: 0, g: 0, b: 0, spread: 0 };
  const avg = [0, 1, 2].map((c) => px.reduce((s, p) => s + p[c], 0) / px.length);
  const spread = Math.max(...px.map((p) => Math.hypot(p[0] - avg[0], p[1] - avg[1], p[2] - avg[2])));
  if (spread > 60) return null;
  return { transparent: false, r: avg[0], g: avg[1], b: avg[2], spread };
}

/** How far a pixel is from the background, 0 (background) to 1 (surely the character). */
function fgOf(d: Uint8ClampedArray, i: number, bg: Bg): number {
  if (d[i + 3] < 30) return 0;
  if (bg.transparent) return d[i + 3] / 255;
  const dist = Math.hypot(d[i] - bg.r, d[i + 1] - bg.g, d[i + 2] - bg.b);
  const lo = 38 + bg.spread * 0.6, hi = lo + 60;
  return Math.max(0, Math.min(1, (dist - lo) / (hi - lo)));
}

interface Blob { x0: number; y0: number; x1: number; y1: number; n: number }

/** The separate things on a sheet (connected areas of the character), in reading order: top row left to right, then the next. */
function blobsOf(mask: Uint8Array, w: number, h: number, min = 0.01): Blob[] {
  const seen = new Uint8Array(w * h);
  const blobs: Blob[] = [];
  const stack: number[] = [];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || seen[s]) continue;
    const b: Blob = { x0: w, y0: h, x1: 0, y1: 0, n: 0 };
    stack.push(s); seen[s] = 1;
    while (stack.length) {
      const p = stack.pop()!, x = p % w, y = (p - x) / w;
      b.n++; if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= w * h || seen[q] || !mask[q]) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === w - 1)) continue;
        seen[q] = 1; stack.push(q);
      }
    }
    blobs.push(b);
  }
  const total = w * h;
  let big = blobs.filter((b) => b.n > total * Math.min(0.004, min * 0.4));
  // Pieces of one pose that came apart (a hand, a tail): joined to the pose whose box they sit in or touch.
  const pad = Math.round(Math.min(w, h) * 0.015);
  big.sort((a, b) => b.n - a.n);
  const merged: Blob[] = [];
  for (const b of big) {
    const host = merged.find((m) => b.x0 <= m.x1 + pad && b.x1 >= m.x0 - pad && b.y0 <= m.y1 + pad && b.y1 >= m.y0 - pad && b.n < m.n * 0.35);
    if (host) { host.x0 = Math.min(host.x0, b.x0); host.y0 = Math.min(host.y0, b.y0); host.x1 = Math.max(host.x1, b.x1); host.y1 = Math.max(host.y1, b.y1); host.n += b.n; }
    else merged.push({ ...b });
  }
  big = merged.filter((b) => b.n > total * min);
  // Reading order: rows by where the poses sit vertically.
  big.sort((a, b) => (a.y0 + a.y1) / 2 - (b.y0 + b.y1) / 2);
  const rows: Blob[][] = [];
  for (const b of big) {
    const cy = (b.y0 + b.y1) / 2;
    const row = rows.find((r) => Math.abs((r[0].y0 + r[0].y1) / 2 - cy) < (r[0].y1 - r[0].y0) * 0.5);
    if (row) row.push(b); else rows.push([b]);
  }
  return rows.flatMap((r) => r.sort((a, b) => a.x0 - b.x0));
}

/** One pose cut out at full size: the background made see-through (soft edges, no green fringe), trimmed with a margin. */
function cutOne(im: HTMLImageElement, bg: Bg | null, box: { x: number; y: number; w: number; h: number }): CutPose {
  const m = Math.round(Math.max(box.w, box.h) * 0.04);
  const x = Math.max(0, box.x - m), y = Math.max(0, box.y - m);
  const w = Math.min(im.naturalWidth - x, box.w + 2 * m), h = Math.min(im.naturalHeight - y, box.h + 2 * m);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(im, x, y, w, h, 0, 0, w, h);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  if (bg && !bg.transparent) {
    const greenish = bg.g > bg.r + 40 && bg.g > bg.b + 40;
    for (let i = 0; i < d.length; i += 4) {
      const a = fgOf(d, i, bg);
      if (a < 1 && greenish && d[i + 1] > Math.max(d[i], d[i + 2])) d[i + 1] = Math.max(d[i], d[i + 2]); // no green fringe
      d[i + 3] = Math.round(d[i + 3] * a);
    }
  }
  // Only the character itself: anything not joined to the main shape (bits of a neighbouring pose) is cleared.
  const mask = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) mask[p] = d[i + 3] > 60 ? 1 : 0;
  const parts = blobsOf(mask, w, h);
  const main = parts.sort((a, b) => b.n - a.n)[0];
  if (main && parts.length > 1) {
    for (let p = 0; p < w * h; p++) {
      const px = p % w, py = (p - px) / w;
      if (px < main.x0 - 2 || px > main.x1 + 2 || py < main.y0 - 2 || py > main.y1 + 2) d[p * 4 + 3] = 0;
    }
  }
  g.putImageData(img, 0, 0);
  const pose: CutPose = { src: c.toDataURL('image/png'), ratio: w / h, width: w, height: h, face: { eyes: [] } };
  pose.face = guessFace(mask, w, h, d);
  return pose;
}

/** Every connected area of a mask, with its size and box (no size filter). */
function areasOf(mask: Uint8Array, w: number, h: number, min: number): Blob[] {
  const seen = new Uint8Array(w * h), out: Blob[] = [], stack: number[] = [];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || seen[s]) continue;
    const b: Blob = { x0: w, y0: h, x1: 0, y1: 0, n: 0 };
    stack.push(s); seen[s] = 1;
    while (stack.length) {
      const p = stack.pop()!, x = p % w, y = (p - x) / w;
      b.n++; if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack.push(p - w); }
      if (y < h - 1 && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack.push(p + w); }
    }
    if (b.n >= min) out.push(b);
  }
  return out;
}

/**
 * The eyes, found on the picture: a matching pair of compact spots side by side in the upper part of the character,
 * white ones (the whites of the eyes) first, else dark ones (pupils, or eyes drawn as dots). Null when there is no
 * convincing pair.
 */
function findEyes(d: Uint8ClampedArray, mask: Uint8Array, w: number, h: number, top: number, fh: number): Blob[] | null {
  const figArea = mask.reduce((s, v) => s + v, 0) || 1;
  for (const kind of ['light', 'dark'] as const) {
    const m = new Uint8Array(w * h);
    for (let p = 0; p < w * h; p++) {
      const y = (p - (p % w)) / w;
      if (!mask[p] || y < top || y > top + fh * 0.72) continue;
      const i = p * 4, r = d[i], g = d[i + 1], b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b, sat = Math.max(r, g, b) - Math.min(r, g, b);
      m[p] = kind === 'light' ? (L > 205 && sat < 60 ? 1 : 0) : (L < 70 ? 1 : 0);
    }
    const spots = areasOf(m, w, h, Math.max(4, figArea * 0.0008)).filter((s) => {
      const bw = s.x1 - s.x0 + 1, bh = s.y1 - s.y0 + 1, fill = s.n / (bw * bh), aspect = bw / bh;
      return s.n < figArea * 0.06 && fill > 0.42 && aspect > 0.35 && aspect < 2.8;
    });
    let best: { a: Blob; b: Blob; score: number } | null = null;
    for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++) {
      const [a, b] = spots[i].x0 < spots[j].x0 ? [spots[i], spots[j]] : [spots[j], spots[i]];
      const ah = a.y1 - a.y0 + 1, bh = b.y1 - b.y0 + 1, aw = a.x1 - a.x0 + 1, bw = b.x1 - b.x0 + 1;
      const size = a.n / b.n, dy = Math.abs((a.y0 + a.y1) / 2 - (b.y0 + b.y1) / 2), gap = b.x0 - a.x1;
      if (size < 0.55 || size > 1.8 || dy > Math.max(ah, bh) * 0.6 || gap < -1 || gap > (aw + bw) * 2.2) continue;
      // Alike in size, level, and high on the character.
      const score = Math.abs(Math.log(size)) + dy / Math.max(ah, bh) + (((a.y0 + b.y0) / 2 - top) / fh) * 0.8;
      if (!best || score < best.score) best = { a, b, score };
    }
    if (best) {
      if (kind === 'light') return [best.a, best.b];
      // Pupils or dot eyes: the eye around them is a little bigger.
      const grow = (s: Blob): Blob => { const bw = s.x1 - s.x0 + 1, bh = s.y1 - s.y0 + 1; return { x0: s.x0 - bw * 0.5, x1: s.x1 + bw * 0.5, y0: s.y0 - bh * 0.6, y1: s.y1 + bh * 0.5, n: s.n }; };
      return [grow(best.a), grow(best.b)];
    }
  }
  return null;
}

/**
 * Where the face probably is. With the picture's pixels: the eyes found on it (findEyes) and the mouth just below
 * them, between them. Otherwise from the outline: the head is the top part, the eyes a little above its middle.
 * A starting point to adjust.
 */
export function guessFace(mask: Uint8Array, w: number, h: number, d?: Uint8ClampedArray): { mouth: MascotFaceBox; eyes: MascotFaceBox[] } {
  if (d) {
    let t = 0, bt = h - 1;
    while (t < h && !mask.subarray(t * w, t * w + w).some(Boolean)) t++;
    while (bt > t && !mask.subarray(bt * w, bt * w + w).some(Boolean)) bt--;
    const eyes = findEyes(d, mask, w, h, t, Math.max(1, bt - t));
    if (eyes) {
      const [a, b] = eyes;
      const r4 = (n: number) => +n.toFixed(4);
      const fb = (s: Blob, pad = 0.08): MascotFaceBox => {
        const bw = s.x1 - s.x0 + 1, bh = s.y1 - s.y0 + 1;
        const x = Math.max(0, s.x0 - bw * pad), y = Math.max(0, s.y0 - bh * pad);
        return { x: r4(x / w), y: r4(y / h), w: r4(Math.min(w - x, bw * (1 + 2 * pad)) / w), h: r4(Math.min(h - y, bh * (1 + 2 * pad)) / h) };
      };
      const eh = Math.max(a.y1 - a.y0, b.y1 - b.y0) + 1, bottom = Math.max(a.y1, b.y1);
      const cx = (a.x1 + b.x0) / 2, span = b.x1 - a.x0;
      const mw = span * 0.42, mh = eh * 0.62, my = bottom + eh * 0.3;
      return { eyes: [fb(a), fb(b)], mouth: { x: r4((cx - mw / 2) / w), y: r4(Math.min(h - mh, my) / h), w: r4(mw / w), h: r4(mh / h) } };
    }
  }
  let top = 0, bottom = h - 1;
  while (top < h && !mask.subarray(top * w, top * w + w).some(Boolean)) top++;
  while (bottom > top && !mask.subarray(bottom * w, bottom * w + w).some(Boolean)) bottom--;
  const fh = Math.max(1, bottom - top);
  // The head's width: the median outline width over rows 15-30% down (arms raised above the head do not count).
  const widths: Array<{ l: number; r: number }> = [];
  for (let y = Math.round(top + fh * 0.15); y <= top + fh * 0.3; y++) {
    const row = mask.subarray(y * w, y * w + w);
    let l = row.indexOf(1), r = row.lastIndexOf(1);
    if (l >= 0) widths.push({ l, r });
  }
  widths.sort((a, b) => (a.r - a.l) - (b.r - b.l));
  const mid = widths[Math.floor(widths.length / 2)] ?? { l: 0, r: w - 1 };
  const hx = mid.l, hw = Math.max(1, mid.r - mid.l);
  const ew = hw * 0.2, eh = fh * 0.1, ey = top + fh * 0.24;
  const box = (x: number, y: number, bw: number, bh: number): MascotFaceBox => ({ x: +(x / w).toFixed(4), y: +(y / h).toFixed(4), w: +(bw / w).toFixed(4), h: +(bh / h).toFixed(4) });
  return {
    eyes: [box(hx + hw * 0.25, ey, ew, eh), box(hx + hw * 0.55, ey, ew, eh)],
    mouth: box(hx + hw * 0.38, top + fh * 0.37, hw * 0.24, fh * 0.07),
  };
}

/** Cuts a sheet of poses (or one picture) into separate see-through poses. */
export async function cutSheet(src: string, opts: { single?: boolean; min?: number } = {}): Promise<{ poses: CutPose[]; note?: string }> {
  const im = await loadImage(src);
  const W = im.naturalWidth, H = im.naturalHeight;
  // Look at a smaller copy to find the poses, then cut each one from the full picture.
  const s = Math.min(1, 700 / Math.max(W, H));
  const w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(im, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data;
  const bg = backgroundOf(d, w, h);
  if (!bg) {
    // A photo or a busy background: used whole (the AI Dev Kit's Cut out the object can lift it off its background).
    const mask = new Uint8Array(w * h).fill(1);
    const pose: CutPose = { src, ratio: W / H, width: W, height: H, face: guessFace(mask, w, h) };
    return { poses: [pose], note: 'The background is not plain, so the picture is used as it is. For a see-through mascot, use a picture on a plain or see-through background.' };
  }
  const mask = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) mask[p] = fgOf(d, i, bg) > 0.5 ? 1 : 0;
  let blobs = blobsOf(mask, w, h, opts.min);
  if (opts.single && blobs.length > 1) {
    const all = blobs.reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1), n: a.n + b.n }));
    blobs = [all];
  }
  if (!blobs.length) throw new Error('No character was found on that picture. Use a picture on a plain background.');
  const poses = blobs.slice(0, 12).map((b) => cutOne(im, bg, { x: Math.floor(b.x0 / s), y: Math.floor(b.y0 / s), w: Math.ceil((b.x1 - b.x0 + 1) / s), h: Math.ceil((b.y1 - b.y0 + 1) / s) }));
  return { poses, note: blobs.length > 12 ? 'More than 12 poses were found; the first 12 are kept.' : undefined };
}

/** A face box carried to another pose: placed against each pose's head (its top and middle), scaled by its width. */
export function carryFace(fromPose: CutPose, toPose: CutPose, face: { mouth?: MascotFaceBox; eyes: MascotFaceBox[] }) {
  const a = fromPose.face, b = toPose.face;
  // Each pose's guessed eyes give its head position and size, so a fixed face keeps its place on the head.
  const anchor = (f: { eyes: MascotFaceBox[] }, p: CutPose) => {
    const e = f.eyes;
    if (e.length < 2) return { x: 0.5 * p.width, y: 0.3 * p.height, s: p.width * 0.4 };
    return { x: ((e[0].x + e[1].x + e[1].w) / 2) * p.width, y: e[0].y * p.height, s: (e[1].x + e[1].w - e[0].x) * p.width };
  };
  const A = anchor(a, fromPose), B = anchor(b, toPose), k = B.s / Math.max(1, A.s);
  const move = (box: MascotFaceBox): MascotFaceBox => {
    const x = B.x + (box.x * fromPose.width - A.x) * k, y = B.y + (box.y * fromPose.height - A.y) * k;
    return { x: +(x / toPose.width).toFixed(4), y: +(y / toPose.height).toFixed(4), w: +((box.w * fromPose.width * k) / toPose.width).toFixed(4), h: +((box.h * fromPose.height * k) / toPose.height).toFixed(4) };
  };
  return { mouth: face.mouth ? move(face.mouth) : undefined, eyes: face.eyes.map(move) };
}

/** A Mascot layer's poses, back into the creator (to change them). */
export function draftsOf(layer: MascotLayer): DraftPose[] {
  return layer.poses.map((p) => ({ id: p.id, name: p.name, eyesClosed: !!p.eyesClosed, mouth: p.mouth, eyes: p.eyes ?? [],
    cut: { src: p.src, ratio: p.ratio, width: Math.round(1000 * p.ratio), height: 1000, face: { mouth: p.mouth, eyes: p.eyes ?? [] } } }));
}

export interface DraftPose { id: string; name: string; cut: CutPose; mouth?: MascotFaceBox; eyes: MascotFaceBox[]; eyesClosed: boolean }

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pose';

/** The Mascot layer for a finished set of poses, centred in the lower part of the stage. */
export function mascotLayer(id: string, name: string, poses: DraftPose[], stageAspect: number): MascotLayer {
  const first = poses[0];
  const used = new Set<string>();
  // A pose that already had an id (editing a mascot) keeps it, so its Pose clips still find it.
  for (const p of poses) if (!/^new-[0-9]+$/.test(p.id)) used.add(p.id);
  const out: MascotPose[] = poses.map((p) => {
    if (!/^new-[0-9]+$/.test(p.id)) return { id: p.id, name: p.name, src: p.cut.src, ratio: +p.cut.ratio.toFixed(4), ...(p.mouth ? { mouth: p.mouth } : {}), ...(p.eyes.length ? { eyes: p.eyes } : {}), ...(p.eyesClosed ? { eyesClosed: true } : {}) };
    let pid = slug(p.name), i = 2;
    while (used.has(pid)) pid = `${slug(p.name)}-${i++}`;
    used.add(pid);
    p.id = pid;
    return { id: pid, name: p.name, src: p.cut.src, ratio: +p.cut.ratio.toFixed(4), ...(p.mouth ? { mouth: p.mouth } : {}), ...(p.eyes.length ? { eyes: p.eyes } : {}), ...(p.eyesClosed ? { eyesClosed: true } : {}) };
  });
  // About 70% of the stage's height, keeping the picture's shape.
  const hPct = 70, wPct = +Math.min(90, (hPct * first.cut.ratio) / stageAspect).toFixed(2);
  return { id, name, type: 'mascot', poses: out, alt: name, box: { x: 50, y: 58, w: wPct, h: hPct }, clips: [] };
}
