import type { PresetContext } from './index';
import { clamp01, drive, isOut, num, owned, pick } from './more';
import { filterPart } from './looks';

/**
 * Talking-head edit effects that redraw the picture itself, frame by frame, from the playing footage (or a picture):
 * the person as characters (Code body), as a banknote engraving, as manga ink with speed lines; the picture blown
 * away into grains; clones of it in a row; a rack focus; text on a ring around a head; a group's layers exploding
 * apart in depth. They work best on a person cut out of the footage (Footage tools: Cut out the person), whose
 * transparent background stays transparent. Every frame is a function of the clip's progress and the footage's
 * current frame, so seeking and exporting draw the same picture.
 */

type Vars = Record<string, unknown>;
type Media = HTMLVideoElement | HTMLImageElement;
const color = (p: Vars, k: string, d: string) => (typeof p[k] === 'string' ? (p[k] as string) : d);
const mediaOf = (el: HTMLElement) => el.querySelector<Media>(':scope > video, :scope > img');
const stageWidth = (el: HTMLElement) => el.closest<HTMLElement>('.upw-canvas')?.clientWidth || 640;

/** A canvas over the layer (or reaching past it by `spill` of its size on each side), behind or in front of it. */
function canvasOver(ctx: PresetContext, cls: string, spill = 0, behind = false) {
  const host = owned(ctx, cls);
  let canvas = host.firstElementChild as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = ctx.el.ownerDocument.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.appendChild(canvas);
  }
  const pct = `${-spill * 100}%`;
  Object.assign(host.style, { position: 'absolute', left: pct, top: pct, right: pct, bottom: pct, pointerEvents: 'none', zIndex: behind ? '-1' : '', overflow: 'visible' });
  const fit = () => {
    const r = Math.min(2, ctx.el.ownerDocument.defaultView?.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(ctx.el.clientWidth * (1 + 2 * spill) * r)), h = Math.max(1, Math.round(ctx.el.clientHeight * (1 + 2 * spill) * r));
    if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; }
    return { g: canvas!.getContext('2d'), w, h, r };
  };
  return { host, fit };
}

/** Where the picture lands inside a w × h box with the layer's fit (cover crops, contain shows all). */
function placement(m: Media, w: number, h: number, fit: string) {
  const iw = m instanceof HTMLVideoElement ? m.videoWidth : m.naturalWidth;
  const ih = m instanceof HTMLVideoElement ? m.videoHeight : m.naturalHeight;
  if (!iw || !ih) return null;
  const s = fit === 'contain' ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
  return { iw, ih, dw: iw * s, dh: ih * s, dx: (w - iw * s) / 2, dy: (h - ih * s) / 2 };
}
function drawFit(g: CanvasRenderingContext2D, m: Media, x: number, y: number, w: number, h: number, fit: string) {
  const q = placement(m, w, h, fit);
  if (!q) return false;
  try { g.drawImage(m, x + q.dx, y + q.dy, q.dw, q.dh); return true; } catch { return false; }
}

/**
 * Reading a frame's pixels needs footage from another address (the AI Dev Kit's local server, a CDN) to be loaded with
 * CORS. Only the effects that read pixels ask for it, once, before the first frame: if that server refuses, the
 * footage is loaded again as before and the effect shows the plain picture instead of nothing.
 */
const CORS = new WeakMap<Media, 'asked' | 'refused'>();
function readable(m: Media) {
  if (CORS.has(m) || m.crossOrigin) return;
  const src = m.getAttribute('src') || '';
  if (!/^https?:/i.test(src)) { CORS.set(m, 'asked'); return; }
  let foreign = true;
  try { foreign = new URL(src, m.ownerDocument.baseURI).origin !== m.ownerDocument.defaultView?.location.origin; } catch { /* keep */ }
  CORS.set(m, 'asked');
  if (!foreign) return;
  m.addEventListener('error', () => { CORS.set(m, 'refused'); m.removeAttribute('crossorigin'); m.setAttribute('src', src); }, { once: true });
  m.crossOrigin = 'anonymous';
  m.setAttribute('src', src);
}

/** The current frame at a small size, as pixels (null when it can't be read: not loaded yet, or from another site). */
const SAMPLERS = new WeakMap<HTMLElement, HTMLCanvasElement>();
function sample(ctx: PresetContext, m: Media, cols: number, rows: number, fit: string): Uint8ClampedArray | null {
  let c = SAMPLERS.get(ctx.el);
  if (!c) { c = ctx.el.ownerDocument.createElement('canvas'); SAMPLERS.set(ctx.el, c); }
  if (c.width !== cols || c.height !== rows) { c.width = cols; c.height = rows; }
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  g.clearRect(0, 0, cols, rows);
  if (!drawFit(g, m, 0, 0, cols, rows, fit)) return null;
  try { return g.getImageData(0, 0, cols, rows).data; } catch { return null; }
}
const lumOf = (d: Uint8ClampedArray, i: number) => (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
/**
 * Auto levels: the frame's brightness stretched between its 5th and 95th percentile (of the visible pixels), so dark
 * or flat footage still gives the full range of characters, lines and ink. Returns brightness 0-1 for a pixel index.
 */
function levels(d: Uint8ClampedArray): (i: number) => number {
  const hist = new Uint32Array(64);
  let n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 60) { hist[Math.min(63, Math.floor(lumOf(d, i) * 64))]++; n++; }
  if (!n) return (i) => lumOf(d, i);
  const at = (q: number) => { let c = 0; for (let b = 0; b < 64; b++) { c += hist[b]; if (c >= q * n) return b / 63; } return 1; };
  const lo = at(0.05), hi = Math.max(lo + 0.1, at(0.95));
  return (i) => clamp01((lumOf(d, i) - lo) / (hi - lo));
}
const isLight = (css: string) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(css.trim());
  if (!m) return false;
  const h = m[1].length === 3 ? m[1].split('').map((x) => x + x).join('') : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
};

/**
 * The common frame of a look that replaces the picture while its clip plays: the media is hidden and the look drawn
 * in its place; it blends in over the first quarter second (and out over the last, unless it holds). `paint(g, w, h,
 * k, t)` draws the look at strength k (0-1) at time t (seconds into the clip).
 */
function replaceLook(ctx: PresetContext, cls: string, paint: (g: CanvasRenderingContext2D, w: number, h: number, m: Media, t: number, r: number) => boolean) {
  const p = ctx.params;
  const m = mediaOf(ctx.el);
  if (!m) return;
  readable(m);
  const { host, fit: size } = canvasOver(ctx, cls);
  const hold = p.hold !== false;
  const blend = Math.min(0.25, ctx.duration / 4);
  let raw = 0;
  const render = () => {
    const t = raw * ctx.duration;
    const active = (raw > 0 && raw < 1) || (raw >= 1 && hold);
    let k = 1;
    if (raw > 0 && t < blend) k = t / blend;
    if (!hold && raw < 1 && ctx.duration - t < blend) k = Math.min(k, (ctx.duration - t) / blend);
    if (!active) { host.style.opacity = '0'; m.style.opacity = ''; return; }
    const { g, w, h, r } = size();
    if (!g) return;
    g.clearRect(0, 0, w, h);
    // The frame could not be read (not decoded yet, or refused): the plain picture stays.
    const ok = paint(g, w, h, m, t, r);
    host.style.opacity = ok ? k.toFixed(3) : '0';
    m.style.opacity = ok ? (1 - k).toFixed(3) : '';
  };
  ctx.late(render);
  drive(ctx, (e) => { raw = e; render(); }, { ease: false, always: true });
}

const CHARSETS: Record<string, string> = {
  density: ' .:-=+*#%@',
  code: ' .:;=+<>{}[]()/*#$&%@',
  binary: '01',
  blocks: ' ░▒▓█',
};

export const REDRAW_BUILDERS: Record<string, (ctx: PresetContext) => void> = {
  ascii(ctx) {
    // Code body: the picture redrawn in characters, a cell at a time, each character as bright as the picture under it
    // (in the picture's own colours, or one ink). Binary and code sets flicker a few times a second, like a readout.
    const p = ctx.params;
    const set = pick(p, 'chars', ['density', 'code', 'binary', 'blocks'] as const, 'code');
    const chars = (typeof p.charset === 'string' && p.charset.length > 1 ? p.charset : CHARSETS[set]).split('');
    const mode = pick(p, 'color', ['source', 'ink'] as const, 'source');
    const ink = color(p, 'ink', '#2ad38b');
    const bg = color(p, 'background', '');
    const fit = (ctx.layer as { fit?: string }).fit ?? 'cover';
    const flicker = set === 'binary' || set === 'code';
    replaceLook(ctx, 'upw-ascii', (g, w, h, m, t, r) => {
      const cell = Math.max(3, (num(p, 'cell', 1.4) / 100) * stageWidth(ctx.el) * r);
      const cw = cell, ch = cell * 1.55;
      const cols = Math.max(1, Math.ceil(w / cw)), rows = Math.max(1, Math.ceil(h / ch));
      const d = sample(ctx, m, cols, rows, fit);
      if (!d) return false;
      if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
      const light = bg ? isLight(bg) : false;
      const lv = levels(d);
      g.font = `700 ${(ch * 0.92).toFixed(1)}px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      const step = Math.floor(t * 10);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const a = d[i + 3] / 255;
          if (a < 0.2) continue;
          let v = lv(i);
          if (light) v = 1 - v;
          let c: string;
          if (flicker) {
            if (v < 0.12) continue;
            c = chars[Math.floor(ctx.rand(x, y, step) * chars.length)];
          } else c = chars[Math.min(chars.length - 1, Math.floor(v * chars.length))];
          if (c === ' ') continue;
          g.globalAlpha = a * (flicker ? 0.35 + 0.65 * v : 1);
          // The picture's own colour, brought up to the stretched brightness so dark footage still reads.
          const f = Math.min(4, (0.25 + 0.85 * v) / Math.max(0.04, lumOf(d, i)));
          g.fillStyle = mode === 'ink' ? ink : `rgb(${Math.min(255, Math.round(d[i] * f))},${Math.min(255, Math.round(d[i + 1] * f))},${Math.min(255, Math.round(d[i + 2] * f))})`;
          g.fillText(c, x * cw + cw / 2, y * ch + ch / 2);
        }
      }
      g.globalAlpha = 1;
      return true;
    });
  },

  engrave(ctx) {
    // Engraving: the picture as a banknote portrait, rows of fine lines that swell where it is dark and ripple with
    // the shapes under them, in one ink on paper. "Oval" frames it in an engraved double oval.
    const p = ctx.params;
    const ink = color(p, 'ink', '#1f3b2c');
    const paper = color(p, 'paper', '#ece6d2');
    const lines = Math.max(20, Math.min(220, Math.round(num(p, 'lines', 90))));
    const wave = clamp01(num(p, 'wave', 0.4));
    const oval = p.oval === true;
    const fit = (ctx.layer as { fit?: string }).fit ?? 'cover';
    replaceLook(ctx, 'upw-engrave', (g, w, h, m) => {
      const step = Math.max(2, Math.round(w / 260));
      const cols = Math.ceil(w / step) + 1;
      const d = sample(ctx, m, cols, lines, fit);
      if (!d) return false;
      if (oval) {
        g.save();
        g.beginPath();
        g.ellipse(w / 2, h / 2, w * 0.46, h * 0.47, 0, 0, Math.PI * 2);
        g.clip();
      }
      if (paper) { g.fillStyle = paper; g.fillRect(0, 0, w, h); }
      const lv = levels(d);
      const gap = h / lines;
      g.fillStyle = ink;
      for (let k = 0; k < lines; k++) {
        const y0 = (k + 0.5) * gap;
        // One filled ribbon per row: its top edge forwards, its bottom edge back.
        const top: number[] = [], bot: number[] = [];
        let any = false;
        for (let x = 0; x < cols; x++) {
          const i = (k * cols + x) * 4;
          const a = d[i + 3] / 255;
          const dark = a * (1 - lv(i));
          const t = Math.max(0, dark * dark * 0.95 + dark * 0.15) * gap * 0.92;
          if (t > 0.3) any = true;
          const wob = Math.sin(x * step * 0.045 + k * 0.7) * gap * wave * 0.35 + (lv(i) - 0.5) * gap * wave * 0.8;
          top.push(y0 + wob - t / 2); bot.push(y0 + wob + t / 2);
        }
        if (!any) continue;
        g.beginPath();
        g.moveTo(0, top[0]);
        for (let x = 1; x < cols; x++) g.lineTo(x * step, top[x]);
        for (let x = cols - 1; x >= 0; x--) g.lineTo(x * step, bot[x]);
        g.closePath();
        g.fill();
      }
      if (oval) {
        g.restore();
        g.strokeStyle = ink;
        for (const [rx, ry, lw] of [[0.46, 0.47, 0.006], [0.48, 0.49, 0.0025]] as const) {
          g.lineWidth = Math.max(1, w * lw);
          g.beginPath();
          g.ellipse(w / 2, h / 2, w * rx, h * ry, 0, 0, Math.PI * 2);
          g.stroke();
        }
      }
      return true;
    });
  },

  manga(ctx) {
    // Manga ink: the picture in black ink and white paper, mid-tones in screentone dots, outlines inked, and speed lines
    // bursting from behind it (they twitch a few times a second). On a person cut out of the footage the lines fill the
    // background; on full-frame footage they show through the white paper.
    const p = ctx.params;
    const ink = color(p, 'ink', '#111111');
    const paper = color(p, 'paper', '#f6f3ea');
    const threshold = Math.max(0.1, Math.min(0.9, num(p, 'threshold', 0.42)));
    const speed = p.lines !== false;
    const fit = (ctx.layer as { fit?: string }).fit ?? 'cover';
    let work: HTMLCanvasElement | null = null;
    replaceLook(ctx, 'upw-manga', (g, w, h, m, t) => {
      const sw = Math.max(1, Math.round(w / 2)), sh = Math.max(1, Math.round(h / 2));
      const d = sample(ctx, m, sw, sh, fit);
      if (!d) return false;
      if (paper) { g.fillStyle = paper; g.fillRect(0, 0, w, h); }
      if (speed) {
        // Rays from a point a little above the middle, out past the edges.
        const cx = w / 2, cy = h * 0.42, R = Math.hypot(w, h);
        const take = Math.floor(t * 12) % 4;
        g.fillStyle = ink;
        const n = Math.round(num(p, 'rays', 110));
        for (let i = 0; i < n; i++) {
          const a = ((i + ctx.rand(i, 1, take) * 0.8) / n) * Math.PI * 2;
          const inner = R * (0.18 + ctx.rand(i, 2, take) * 0.22);
          const wd = 0.004 + ctx.rand(i, 3, take) * 0.012;
          g.beginPath();
          g.moveTo(cx + Math.cos(a - wd) * R, cy + Math.sin(a - wd) * R);
          g.lineTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
          g.lineTo(cx + Math.cos(a + wd) * R, cy + Math.sin(a + wd) * R);
          g.closePath();
          g.fill();
        }
      }
      if (!work) work = ctx.el.ownerDocument.createElement('canvas');
      if (work.width !== sw || work.height !== sh) { work.width = sw; work.height = sh; }
      const wg = work.getContext('2d');
      if (!wg) return false;
      const out = wg.createImageData(sw, sh);
      const o = out.data;
      const inkRGB = /^#([0-9a-f]{6})$/i.test(ink) ? [1, 3, 5].map((i) => parseInt(ink.slice(i, i + 2), 16)) : [17, 17, 17];
      const papRGB = paper && /^#([0-9a-f]{6})$/i.test(paper) ? [1, 3, 5].map((i) => parseInt(paper.slice(i, i + 2), 16)) : [246, 243, 234];
      const lv = levels(d);
      const L = (x: number, y: number) => { const i = (Math.min(sh - 1, Math.max(0, y)) * sw + Math.min(sw - 1, Math.max(0, x))) * 4; return d[i + 3] < 60 ? 1 : lv(i); };
      const dot = Math.max(3, Math.round(sw / 160));
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          const a = d[i + 3];
          if (a < 60) continue; // transparent: the speed lines show
          const v = lv(i);
          // Edges (a Sobel step) are inked as outlines.
          const gx = L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1);
          const gy = L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1);
          const edge = Math.hypot(gx, gy) > 0.9;
          let inked = edge || v < threshold;
          let paperHere = !inked;
          if (!inked && v < threshold + 0.16) {
            // Screentone: a dot grid in the mid-tones.
            const cx = (x % dot) - dot / 2, cy = (y % dot) - dot / 2;
            if (cx * cx + cy * cy < (dot * dot) / 7) { inked = true; paperHere = false; }
          }
          const c = inked ? inkRGB : papRGB;
          o[i] = c[0]; o[i + 1] = c[1]; o[i + 2] = c[2];
          // Bright paper is see-through when the speed lines are on, so the lines show round the inked figure.
          o[i + 3] = paperHere && speed && v > 0.82 ? 0 : 255;
        }
      }
      wg.putImageData(out, 0, 0);
      g.imageSmoothingEnabled = true;
      g.drawImage(work, 0, 0, w, h);
      return true;
    });
  },

  'blow-away'(ctx) {
    // Blow away: the picture crumbles into grains that the wind carries off, sweeping across it (In: they blow back
    // together). On a person cut out of the footage, over a shot of the empty room, the person is blown away and the
    // room stays.
    const p = ctx.params;
    const m = mediaOf(ctx.el);
    if (!m) return;
    readable(m);
    const out = !(p.direction === 'in');
    const wind = pick(p, 'wind', ['right', 'left', 'up'] as const, 'right');
    const fit = (ctx.layer as { fit?: string }).fit ?? 'cover';
    const { host, fit: size } = canvasOver(ctx, 'upw-blow', 0.6);
    let raw = 0;
    const render = () => {
      // v: how far the blowing has gone (0 = whole, 1 = gone).
      const v = out ? raw : 1 - raw;
      const busy = v > 0 && v < 1;
      host.style.opacity = busy ? '1' : '0';
      m.style.opacity = v <= 0 ? '' : '0';
      if (!busy) return;
      const restore = () => { host.style.opacity = '0'; m.style.opacity = ''; };
      const { g, w, h, r } = size();
      if (!g) return;
      g.clearRect(0, 0, w, h);
      // The layer's own box inside the spilled canvas.
      const bx = w * (0.6 / 2.2), by = h * (0.6 / 2.2), bw = w / 2.2, bh = h / 2.2;
      const grain = Math.max(2, (num(p, 'grain', 0.6) / 100) * stageWidth(ctx.el) * r);
      const cols = Math.max(1, Math.ceil(bw / grain)), rows = Math.max(1, Math.ceil(bh / grain));
      const d = sample(ctx, m, cols, rows, fit);
      // Unreadable footage: a plain fade instead of grains.
      if (!d) { restore(); m.style.opacity = (1 - v).toFixed(3); return; }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const a = d[i + 3] / 255;
          if (a < 0.1) continue;
          // Grains leave in a sweep from the far side of the wind, a little ragged.
          const along = wind === 'right' ? 1 - x / cols : wind === 'left' ? x / cols : 1 - y / rows;
          const start = along * 0.55 + ctx.rand(x, y, 1) * 0.25;
          const lp = clamp01((v - start) / 0.4);
          let px = bx + x * grain, py = by + y * grain, s = grain, al = a;
          if (lp > 0) {
            const e = lp * lp;
            const spread = (ctx.rand(x, y, 2) - 0.5) * bh * 0.5 * e;
            const dist = e * bw * (0.5 + ctx.rand(x, y, 3) * 0.7);
            if (wind === 'up') { px += spread; py -= dist; } else { px += wind === 'right' ? dist : -dist; py += spread - e * bh * 0.15; }
            s = grain * (1 - 0.6 * lp);
            al = a * (1 - lp);
            if (al <= 0.02) continue;
          }
          g.globalAlpha = al;
          g.fillStyle = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`;
          g.fillRect(px, py, s + 0.6, s + 0.6);
        }
      }
      g.globalAlpha = 1;
    };
    ctx.late(render);
    drive(ctx, (e) => { raw = e; render(); }, { ease: false, always: true });
  },

  'clone-row'(ctx) {
    // Clone row: copies of the picture appear one by one on either side, a little smaller and darker each step, all
    // playing. On a person cut out of the footage: a row of clones of the speaker behind them.
    const p = ctx.params;
    const m = mediaOf(ctx.el);
    if (!m) return;
    const count = Math.max(1, Math.min(4, Math.round(num(p, 'count', 2))));
    const spread = Math.max(0.2, Math.min(1.2, num(p, 'spread', 0.55)));
    const shrink = Math.max(0.5, Math.min(1, num(p, 'shrink', 0.9)));
    const dim = clamp01(num(p, 'dim', 0.3));
    const out = isOut(p);
    const fit = (ctx.layer as { fit?: string }).fit ?? 'cover';
    const SP = spread * count + 0.1;
    const { host, fit: size } = canvasOver(ctx, 'upw-clones', SP, true);
    let raw = 0;
    const render = () => {
      const v = out ? 1 - raw : raw;
      host.style.opacity = v > 0 ? '1' : '0';
      if (v <= 0) return;
      const { g, w, h } = size();
      if (!g) return;
      g.clearRect(0, 0, w, h);
      const lw = w / (1 + 2 * SP), lh = h / (1 + 2 * SP);
      const ox = lw * SP, oy = lh * SP;
      // Furthest first, so the nearer clones overlap them.
      for (let k = count; k >= 1; k--) {
        const appear = clamp01((v * (count + 0.6) - (k - 1)) / 1.2);
        if (appear <= 0) continue;
        const s = shrink ** k * (0.85 + 0.15 * appear);
        const cw = lw * s, ch = lh * s;
        for (const side of [-1, 1]) {
          const cx = ox + lw / 2 + side * k * spread * lw;
          g.globalAlpha = appear;
          g.filter = dim ? `brightness(${(1 - dim * k * 0.6).toFixed(2)})` : 'none';
          drawFit(g, m, cx - cw / 2, oy + lh - ch, cw, ch, fit);
        }
      }
      g.filter = 'none';
      g.globalAlpha = 1;
    };
    ctx.late(render);
    drive(ctx, (e) => { raw = e; render(); }, { always: true });
  },

  'rack-focus'(ctx) {
    // Rack focus: the layer drifts out of focus (or into it), like a lens pulling focus to something else. On footage
    // behind a cut-out person, the background softens while the person stays sharp.
    const p = ctx.params;
    const from = Math.max(0, num(p, 'from', 0)), to = Math.max(0, num(p, 'to', 1.2));
    drive(ctx, (e) => {
      const b = from + (to - from) * e;
      const px = (b / 100) * stageWidth(ctx.el);
      filterPart(ctx.el, ctx.clip.id, px > 0.05 ? `blur(${px.toFixed(2)}px)` : null);
    }, { always: true });
  },

  'ring-text'(ctx) {
    // Text ring: the letters of a text layer travel round an ellipse (a ring round a head), nearer letters bigger and
    // brighter. Two copies of the layer, one behind a cut-out person showing the far half and one in front showing the
    // near half, make the ring pass behind the head.
    const p = ctx.params;
    const chars = ctx.chars;
    if (!chars.length) return;
    const half = pick(p, 'half', ['all', 'front', 'back'] as const, 'all');
    const tilt = Math.max(0, Math.min(1, num(p, 'tilt', 0.22)));
    const turns = num(p, 'speed', 0.15);
    const arc = Math.max(0.1, Math.min(1, num(p, 'arc', 1)));
    const size = Math.max(0.1, num(p, 'radius', 1));
    // Letters are measured by layout offsets inside the layer (never by their box on screen, which the scene camera's
    // zoom, tilt and roll change), so a frame is the same however the timeline reached it.
    if (ctx.el.ownerDocument.defaultView?.getComputedStyle(ctx.el).position === 'static') ctx.el.style.position = 'relative';
    const measure = () => {
      chars.forEach((c) => { c.style.display = 'inline-block'; });
      return chars.map((c) => {
        let x = c.offsetWidth / 2, y = c.offsetHeight / 2;
        let e: HTMLElement | null = c;
        while (e && e !== ctx.el) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null; }
        return { x, y };
      });
    };
    drive(ctx, (e) => {
      const W = ctx.el.clientWidth, H = ctx.el.clientHeight;
      if (!W) return;
      const home = measure();
      const rx = (W / 2) * size, ry = rx * tilt;
      const cx = W / 2, cy = H / 2;
      const turn = e * ctx.duration * turns * Math.PI * 2;
      const n = chars.length;
      chars.forEach((c, i) => {
        // Letters run left to right across the front of the ring.
        const phi = turn + (i / n - 0.5) * arc * Math.PI * 2;
        const x = cx + rx * Math.sin(phi), y = cy + ry * Math.cos(phi), z = Math.cos(phi);
        const show = half === 'all' || (half === 'front' ? z >= 0 : z < 0);
        const hpos = home[i];
        c.style.transform = `translate(${(x - hpos.x).toFixed(1)}px, ${(y - hpos.y).toFixed(1)}px) scale(${(0.72 + 0.28 * z).toFixed(3)}, ${(0.8 + 0.2 * z).toFixed(3)})`;
        c.style.opacity = show ? (0.45 + 0.55 * (z + 1) / 2).toFixed(3) : '0';
      });
    }, { ease: false, always: true });
  },

  'explode-3d'(ctx) {
    // Layer explode: the layers of a group come apart in depth while the view turns, showing how the frame is built
    // (footage, captions, sound, graphics). Out: they collapse back into one picture.
    const p = ctx.params;
    const out = isOut(p);
    const proxy = ctx.el.querySelector<HTMLElement>(':scope > .upw-gproxy');
    if (!proxy) return;
    const kids = Array.from(proxy.children).filter((c): c is HTMLElement => c instanceof HTMLElement && c.classList.contains('upw-layer'));
    const depth = num(p, 'depth', 8);
    const turn = num(p, 'turn', -32), tilt = num(p, 'tilt', 12);
    drive(ctx, (e) => {
      const v = clamp01(out ? 1 - e : e);
      const W = stageWidth(ctx.el);
      ctx.el.style.perspective = v > 0 ? `${(W * 1.6).toFixed(0)}px` : '';
      proxy.style.transformStyle = v > 0 ? 'preserve-3d' : '';
      proxy.style.transform = v > 0 ? `rotateX(${(tilt * v).toFixed(2)}deg) rotateY(${(turn * v).toFixed(2)}deg)` : '';
      const mid = (kids.length - 1) / 2;
      kids.forEach((k, i) => { k.style.translate = v > 0 ? `0 0 ${(((i - mid) * depth * v * W) / 100).toFixed(1)}px` : ''; });
    }, { always: true });
  },
};
