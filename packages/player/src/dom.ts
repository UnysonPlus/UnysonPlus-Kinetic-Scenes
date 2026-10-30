import type { LottieInstance } from './lottieLayer';
import type { Anchor, Box, Layer, LayerLink, LayerOverride, Scene, TextStyle } from './types';
import { REST_3D, type Runtime3D, type State3D } from './model3d';
import { buildDiagram, buildFlow, buildPath } from './vector';
import { buildCode } from './code';
import { buildCaptions } from './captions';
import { buildCursor } from './cursor';

/** The elements created for one layer. */
export interface LayerRefs {
  layer: Layer;
  outer: HTMLElement;
  inner: HTMLElement;
  words: HTMLElement[];
  chars: HTMLElement[];
  /** The text the words and chars were built from, so a breakpoint text change can be detected. */
  builtText?: string;
  /** Groups: the layers inside, and the stage-sized element they are positioned in. */
  children?: LayerRefs[];
  proxy?: HTMLElement;
  /** Groups: the measured frame, in % of the stage (left, top, width, height). */
  frame?: { l: number; t: number; w: number; h: number };
  /** 3D layers: the state presets animate, and the runtime that draws it (once scene-3d.js has loaded). */
  model?: { state: State3D; runtime?: Runtime3D };
  /** Lottie layers: the animation (once scene-lottie.js has loaded) and its frame rate. */
  lottie?: { anim?: LottieInstance; fps: number; failed?: boolean };
  /** In the pin space (pinned to the stage, or inside a pinned group): positions are % of the stage, sizes frame units. */
  pinned?: boolean;
  /** Footage: the video element (or the picture, for a still used as footage). */
  media?: HTMLVideoElement | HTMLImageElement;
}

/** Every LayerRefs in a tree, groups and their contents included. */
export function flatRefs(list: LayerRefs[]): LayerRefs[] {
  const out: LayerRefs[] = [];
  const walk = (l: LayerRefs[]) => l.forEach((r) => { out.push(r); if (r.children) walk(r.children); });
  walk(list);
  return out;
}

const ANCHOR_SHIFT: Record<Anchor, [number, number]> = {
  'top-left': [0, 0], top: [-50, 0], 'top-right': [-100, 0],
  left: [0, -50], center: [-50, -50], right: [-100, -50],
  'bottom-left': [0, -100], bottom: [-50, -100], 'bottom-right': [-100, -100],
};

const FALLBACK_FONTS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export function createStage(doc: Document, scene: Scene) {
  const stage = doc.createElement('div');
  stage.className = 'upw-stage';
  // A see-through video (graphics to lay over footage) has no background of its own.
  if (scene.stage.background && !(scene.mode === 'video' && scene.video?.transparent)) stage.style.background = scene.stage.background;

  const canvas = doc.createElement('div');
  canvas.className = 'upw-canvas';
  stage.appendChild(canvas);

  // The camera: the layers live inside it, so moving it moves the view (overlays stay outside).
  const cam = doc.createElement('div');
  cam.className = 'upw-cam';
  canvas.appendChild(cam);

  // The pin space: covers the whole stage (fitPins keeps it there), above the camera and outside it.
  // It is inside the canvas so sizes in frame units (cqw / cqh) mean the same as everywhere else.
  const pins = doc.createElement('div');
  pins.className = 'upw-pins';
  canvas.appendChild(pins);

  const safe = doc.createElement('div');
  safe.className = 'upw-safe';
  const s = (scene.stage.safeArea ?? 0.06) * 100;
  Object.assign(safe.style, { left: `${s}%`, right: `${s}%`, top: `${s}%`, bottom: `${s}%` });
  canvas.appendChild(safe);

  return { stage, canvas, cam, pins, safe };
}

/**
 * A linked layer's click area: covers the layer (a group: its frame) and sits above its contents.
 * It is for pointers only. The stage is hidden from screen readers and kept out of the tab order;
 * the focusable, readable copy of the link is in the scene's transcript, and focusing it rings this layer.
 */
function addLink(doc: Document, outer: HTMLElement, link: LayerLink) {
  const a = doc.createElement('a');
  a.className = 'upw-link';
  a.href = link.href;
  if (link.jump !== undefined && link.jump !== '') a.dataset.upwJump = String(link.jump);
  a.tabIndex = -1;
  if (link.newTab) { a.target = '_blank'; a.rel = 'noopener'; }
  outer.dataset.link = '';
  outer.appendChild(a);
}

export function createLayer(doc: Document, layer: Layer, z: number, pinned = false): LayerRefs {
  const outer = doc.createElement('div');
  outer.className = `upw-layer upw-${layer.type}`;
  outer.dataset.layer = layer.id;
  // A cursor stays above everything else, spotlights and callouts included: it leads the eye.
  outer.style.zIndex = String(layer.type === 'cursor' ? 9500 + z : z);

  const inner = doc.createElement('div');
  inner.className = 'upw-li';
  outer.appendChild(inner);

  const refs: LayerRefs = { layer, outer, inner, words: [], chars: [], pinned: pinned || layer.pin === 'stage' };
  if (layer.link) addLink(doc, outer, layer.link);
  if (layer.hover?.effect) {
    outer.dataset.hover = layer.hover.effect;
    if (layer.hover.color) outer.style.setProperty('--upw-hover', layer.hover.color);
  }

  if (layer.type === 'group') {
    // The group's frame wraps its contents; inside it, a stage-sized "proxy" keeps the children's
    // stage coordinates valid. measureGroup() fits the frame once the children are laid out.
    const proxy = doc.createElement('div');
    proxy.className = 'upw-gproxy';
    inner.appendChild(proxy);
    refs.proxy = proxy;
    refs.children = layer.layers.map((child, i) => {
      const c = createLayer(doc, child, i + 1, refs.pinned);
      proxy.appendChild(c.outer);
      return c;
    });
    return refs;
  }

  if (layer.type === 'shape') {
    if (layer.fill) inner.style.background = smoothGradient(layer.fill);
    inner.style.borderRadius = layer.shape === 'ellipse' ? '50%' : `${layer.radius ?? 0}cqw`;
    if (layer.stroke && typeof layer.dash === 'number' && layer.dash > 0) {
      // A dashed outline is drawn as SVG (a CSS dashed border can't set its dash length or move it).
      const sw = layer.strokeWidth ?? 0.2;
      const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'upw-dash');
      Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' });
      const r = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('width', '100%');
      r.setAttribute('height', '100%');
      Object.assign(r.style, {
        fill: 'none', stroke: layer.stroke, strokeWidth: `${sw}cqw`,
        strokeDasharray: `${layer.dash}cqw ${layer.dashGap ?? layer.dash * 0.8}cqw`,
        rx: layer.shape === 'ellipse' ? '50%' : `${layer.radius ?? 0}cqw`, ry: layer.shape === 'ellipse' ? '50%' : `${layer.radius ?? 0}cqw`,
      });
      svg.appendChild(r);
      inner.style.position = 'relative';
      inner.appendChild(svg);
    } else if (layer.stroke) inner.style.border = `${layer.strokeWidth ?? 0.2}cqw solid ${layer.stroke}`;
    inner.setAttribute('aria-hidden', 'true');
  } else if (layer.type === 'lottie') {
    inner.classList.add('upw-lottie');
    if (layer.alt) { inner.setAttribute('role', 'img'); inner.setAttribute('aria-label', layer.alt); } else inner.setAttribute('aria-hidden', 'true');
    refs.lottie = { fps: 30 };
  } else if (layer.type === 'model') {
    inner.classList.add('upw-3d');
    if (layer.alt) {
      inner.setAttribute('role', 'img');
      inner.setAttribute('aria-label', layer.alt);
    } else inner.setAttribute('aria-hidden', 'true');
    refs.model = { state: { ...REST_3D } };
  } else if (layer.type === 'path') {
    inner.setAttribute('aria-hidden', 'true');
    buildPath(doc, inner, layer);
  } else if (layer.type === 'flow') {
    inner.setAttribute('aria-hidden', 'true');
    buildFlow(doc, inner, layer);
  } else if (layer.type === 'cursor') {
    inner.setAttribute('aria-hidden', 'true');
    buildCursor(doc, inner, layer);
  } else if (layer.type === 'captions') {
    // The spoken words are in the transcript.
    inner.setAttribute('aria-hidden', 'true');
    buildCaptions(inner, layer);
  } else if (layer.type === 'code') {
    // The code is in the transcript.
    inner.setAttribute('aria-hidden', 'true');
    buildCode(doc, inner, layer);
  } else if (layer.type === 'diagram') {
    // The words are in the transcript.
    inner.setAttribute('aria-hidden', 'true');
    buildDiagram(doc, inner, layer);
  } else if (layer.type === 'video') {
    // Footage. Its time is set by the player from the timeline (muted: a video export mixes its sound).
    if (layer.reference) outer.dataset.ref = '';
    // The face path, for layers that follow it.
    (outer as HTMLElement & { upwTrack?: unknown }).upwTrack = layer.track;
    const still = /^data:image\//.test(layer.src);
    const m = doc.createElement(still ? 'img' : 'video');
    if (m instanceof HTMLVideoElement) {
      m.muted = true;
      m.playsInline = true;
      m.preload = 'auto';
      m.disablePictureInPicture = true;
      m.setAttribute('aria-hidden', layer.alt ? 'false' : 'true');
    } else m.alt = layer.alt ?? '';
    if (layer.alt && m instanceof HTMLVideoElement) m.setAttribute('aria-label', layer.alt);
    m.src = layer.src;
    m.style.cssText = `width:100%;height:100%;display:block;object-fit:${layer.fit ?? 'cover'}`;
    inner.style.borderRadius = `${layer.radius ?? 0}cqw`;
    inner.style.overflow = 'hidden';
    inner.appendChild(m);
    refs.media = m;
    frameMedia(doc, inner, m, layer.frame, layer.radius);
  } else if (layer.type === 'image') {
    const img = doc.createElement('img');
    img.src = layer.src;
    img.alt = layer.alt ?? '';
    img.decoding = 'async';
    img.draggable = false;
    img.style.objectFit = layer.fit ?? 'cover';
    inner.style.borderRadius = `${layer.radius ?? 0}cqw`;
    inner.style.overflow = 'hidden';
    inner.appendChild(img);
    frameMedia(doc, inner, img, layer.frame, layer.radius);
  }
  return refs;
}

/**
 * Splits text into words and characters. Screen readers get the plain sentence from a visually hidden
 * copy; the split version is hidden from them, so it is never read out letter by letter.
 */
export function buildText(doc: Document, refs: LayerRefs, text: string, accent?: string) {
  const { inner } = refs;
  inner.textContent = '';
  refs.words = [];
  refs.chars = [];
  refs.builtText = text;
  // With an accent colour, *marked words* are drawn in it (a mark may span several words).
  let marked = false;

  const sr = doc.createElement('span');
  sr.className = 'upw-sr';
  sr.textContent = accent ? text.replace(/\*/g, '') : text;
  inner.appendChild(sr);

  const vis = doc.createElement('span');
  vis.className = 'upw-txt';
  vis.setAttribute('aria-hidden', 'true');
  inner.appendChild(vis);

  text.split('\n').forEach((line, li) => {
    if (li > 0) vis.appendChild(doc.createElement('br'));
    line.split(/ +/).filter(Boolean).forEach((raw, wi) => {
      let word = raw;
      let lit = marked;
      if (accent) {
        if (word.startsWith('*')) { lit = true; marked = true; }
        if (word.replace(/[.,!?;:'")]+$/, '').endsWith('*') && word.length > 1) marked = false;
        word = word.replace(/\*/g, '');
        if (!word) return;
      }
      if (wi > 0) vis.appendChild(doc.createTextNode(' '));
      const w = doc.createElement('span');
      w.className = 'upw-w';
      if (accent && lit) w.style.color = accent;
      const wInner = doc.createElement('span');
      wInner.className = 'upw-wi';
      for (const ch of Array.from(word)) {
        const c = doc.createElement('span');
        c.className = 'upw-c';
        c.textContent = ch;
        c.dataset.ch = ch;
        wInner.appendChild(c);
        refs.chars.push(c);
      }
      w.appendChild(wInner);
      vis.appendChild(w);
      refs.words.push(wInner);
    });
  });
}

/** The layer's box, style and text with a breakpoint's overrides merged in. */
export function resolveLayer(layer: Layer, bpId: string | null) {
  const o: LayerOverride = (bpId && layer.overrides?.[bpId]) || {};
  const box: Box = { ...(layer.box ?? { x: 0, y: 0 }), ...(o.box ?? {}) };
  const style: TextStyle | undefined = layer.type === 'text' ? { ...layer.style, ...(o.style ?? {}) } : undefined;
  const text = layer.type === 'text' ? (o.text ?? layer.text) : undefined;
  return { box, style, text, hidden: !!o.hidden };
}

/** Applies position, size and type to a layer. Layout only: never touches what the timeline animates. */
export function applyLayout(refs: LayerRefs, bpId: string | null) {
  const { box, style, hidden } = resolveLayer(refs.layer, bpId);
  const { outer, inner } = refs;
  const os = outer.style;

  if (hidden) outer.dataset.hidden = '';
  else delete outer.dataset.hidden;

  if (refs.layer.type === 'group') {
    if (typeof refs.layer.opacity === 'number') os.opacity = String(refs.layer.opacity);
    return;
  }

  if (refs.layer.type === 'flow') {
    Object.assign(os, { left: '0%', top: '0%', width: '100%', height: '100%', transform: 'none' });
    if (typeof refs.layer.opacity === 'number') os.opacity = String(refs.layer.opacity);
    return;
  }

  os.left = `${box.x}%`;
  os.top = `${box.y}%`;
  // In the pin space, sizes stay in the frame's units (the pin space is the stage's size, the frame is not).
  const wu = refs.pinned ? 'cqw' : '%';
  const hu = refs.pinned ? 'cqh' : '%';
  os.width = typeof box.w === 'number' ? `${box.w}${wu}` : 'max-content';
  if (typeof box.ratio === 'number' && box.ratio > 0) {
    os.height = '';
    os.aspectRatio = String(box.ratio);
  } else {
    os.aspectRatio = '';
    os.height = typeof box.h === 'number' ? `${box.h}${hu}` : '';
  }
  const [sx, sy] = refs.layer.type === 'cursor' ? [0, 0] : ANCHOR_SHIFT[box.anchor ?? 'center'];
  os.transform = `translate(${sx}%, ${sy}%)${box.rotate ? ` rotate(${box.rotate}deg)` : ''}`;
  if (typeof refs.layer.opacity === 'number') os.opacity = String(refs.layer.opacity);

  if (style) {
    const is = inner.style;
    is.fontFamily = style.fontFamily ? `"${style.fontFamily.replace(/"/g, '')}", ${FALLBACK_FONTS}` : FALLBACK_FONTS;
    is.fontSize = `${style.fontSize}cqw`;
    is.fontWeight = style.fontWeight ? String(style.fontWeight) : '';
    is.lineHeight = style.lineHeight ? String(style.lineHeight) : '1.05';
    is.letterSpacing = typeof style.letterSpacing === 'number' ? `${style.letterSpacing}em` : '';
    is.color = style.color ?? '';
    is.textAlign = style.align ?? (box.anchor?.endsWith('left') || box.anchor === 'left' ? 'left' : box.anchor?.endsWith('right') || box.anchor === 'right' ? 'right' : 'center');
    is.textTransform = style.uppercase ? 'uppercase' : '';
    is.fontStyle = style.italic ? 'italic' : '';
    const pill = refs.layer.type === 'text' ? refs.layer.pill : undefined;
    is.padding = pill ? `${pill.padY ?? 0.35}em ${pill.padX ?? 0.9}em` : '';
    is.background = pill?.fill ?? '';
    is.border = pill?.stroke ? `${pill.strokeWidth ?? 0.12}cqw solid ${pill.stroke}` : '';
    is.borderRadius = pill ? `${pill.radius ?? 99}em` : '';
  }
}

/** Lays out a tree of layers: children before their group, so each group can measure its contents. */
export function layoutTree(list: LayerRefs[], bpId: string | null) {
  for (const r of list) {
    if (r.children) layoutTree(r.children, bpId);
    applyLayout(r, bpId);
    if (r.children) measureGroup(r, bpId);
  }
}

/**
 * Fits a group's frame around its visible contents. The proxy is first set to the whole stage so the
 * children's positions read as stage percentages, then the frame is set to their bounds and the proxy
 * moved and scaled so the children stay exactly where they were.
 */
export function measureGroup(refs: LayerRefs, bpId: string | null) {
  const { outer, proxy, children } = refs;
  if (!proxy || !children) return;
  const os = outer.style;
  const ps = proxy.style;
  Object.assign(os, { left: '0%', top: '0%', width: '100%', height: '100%', transform: 'none' });
  Object.assign(ps, { left: '0%', top: '0%', width: '100%', height: '100%' });
  const W = proxy.clientWidth;
  const H = proxy.clientHeight;
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  if (W && H) {
    for (const c of children) {
      const el = c.outer;
      if (el.dataset.hidden !== undefined || !el.offsetWidth || c.layer.type === 'flow') continue;
      let x: number;
      let y: number;
      if (c.children) {
        x = el.offsetLeft;
        y = el.offsetTop;
      } else {
        const { box } = resolveLayer(c.layer, bpId);
        const [sx, sy] = ANCHOR_SHIFT[box.anchor ?? 'center'];
        x = el.offsetLeft + (sx / 100) * el.offsetWidth;
        y = el.offsetTop + (sy / 100) * el.offsetHeight;
      }
      l = Math.min(l, x);
      t = Math.min(t, y);
      r = Math.max(r, x + el.offsetWidth);
      b = Math.max(b, y + el.offsetHeight);
    }
  }
  if (!Number.isFinite(l) || r - l < 1 || b - t < 1) {
    refs.frame = { l: 0, t: 0, w: 100, h: 100 };
    return;
  }
  const f = { l: (l / W) * 100, t: (t / H) * 100, w: ((r - l) / W) * 100, h: ((b - t) / H) * 100 };
  refs.frame = f;
  Object.assign(os, { left: `${f.l}%`, top: `${f.t}%`, width: `${f.w}%`, height: `${f.h}%` });
  Object.assign(ps, {
    left: `${(-f.l / f.w) * 100}%`, top: `${(-f.t / f.h) * 100}%`,
    width: `${(100 / f.w) * 100}%`, height: `${(100 / f.h) * 100}%`,
  });
}

/**
 * A frame round a picture or footage: the frame is the layer's box, the picture sits inside it. The frame's
 * parts are drawn by the frame (not by the picture), so effects on the picture stay inside.
 */
function frameMedia(doc: Document, inner: HTMLElement, media: HTMLElement, frame: string | undefined, radius = 0) {
  if (!frame || frame === 'none') return;
  inner.dataset.frame = frame;
  inner.style.position = 'relative';
  const part = (css: string) => { const e = doc.createElement('i'); e.className = 'upw-frame'; e.setAttribute('aria-hidden', 'true'); e.style.cssText = `position:absolute;pointer-events:none;${css}`; inner.appendChild(e); return e; };
  const box = (css: string) => { media.style.position = 'absolute'; media.style.cssText += `;position:absolute;${css}`; };
  inner.style.overflow = 'visible';
  if (frame === 'phone') {
    Object.assign(inner.style, { background: '#0b0c0e', borderRadius: '13% / 6.5%', boxShadow: '0 0 0 0.25cqw #2b2e33, 0 2cqw 4cqw rgba(0,0,0,.45)' });
    box('left:3.5%;top:1.8%;width:93%;height:96.4%;border-radius:10% / 5%');
    part('left:50%;top:3%;width:30%;height:2.4%;transform:translateX(-50%);background:#0b0c0e;border-radius:99px');
  } else if (frame === 'browser') {
    Object.assign(inner.style, { background: '#f2f3f5', borderRadius: '1.2cqw', boxShadow: '0 1.5cqw 3.5cqw rgba(0,0,0,.35)', overflow: 'hidden' });
    box('left:0;top:3.4cqw;width:100%;height:calc(100% - 3.4cqw)');
    const bar = part('left:0;right:0;top:0;height:3.4cqw;display:flex;align-items:center;gap:0.7cqw;padding-left:1.4cqw;background:#e4e6ea');
    bar.innerHTML = ['#ff5f57', '#febc2e', '#28c840'].map((c) => `<b style="width:1cqw;height:1cqw;border-radius:50%;background:${c}"></b>`).join('') + '<b style="margin-left:2cqw;flex:0 1 45%;height:1.8cqw;border-radius:1cqw;background:#fff"></b>';
  } else if (frame === 'polaroid') {
    Object.assign(inner.style, { background: '#fbfaf6', boxShadow: '0 1.2cqw 3cqw rgba(0,0,0,.35)' });
    box('left:5%;top:4.5%;width:90%;height:77.5%');
  } else if (frame === 'film') {
    Object.assign(inner.style, { background: '#0b0b0b' });
    box('left:11%;top:1.5%;width:78%;height:97%');
    const holes = 'repeating-linear-gradient(to bottom, transparent 0 1.2cqw, #f4efe6 1.2cqw 3.2cqw, transparent 3.2cqw 4.4cqw)';
    part(`left:3%;width:5%;top:0;bottom:0;background:${holes};border-radius:.3cqw`);
    part(`right:3%;width:5%;top:0;bottom:0;background:${holes};border-radius:.3cqw`);
  } else if (frame === 'card') {
    Object.assign(inner.style, { borderRadius: `${Math.max(radius, 1.6)}cqw`, boxShadow: '0 0 0 0.15cqw rgba(255,255,255,.18), 0 1.6cqw 4cqw rgba(0,0,0,.45)', overflow: 'hidden' });
  }
}

/**
 * Gradients blend through OKLab, so colour changes stay clear instead of passing through grey (blue to yellow no
 * longer dips to a muddy grey in the middle). OKLab rather than OKLCH: OKLCH is more vivid but leaves hard seams where
 * its colours fall outside the screen's range (tested 2026-10-28). Only where the browser understands it, and only
 * when the gradient does not name its own colour space; elsewhere it is used exactly as written.
 */
export function smoothGradient(fill: string): string {
  const m = /^(\s*(?:repeating-)?(?:linear|radial|conic)-gradient\()([\s\S]*)\)\s*$/i.exec(fill);
  if (!m || /\bin\s+(srgb|oklch|oklab|lab|lch|hsl|hwb|display-p3|xyz)/i.test(m[2])) return fill;
  const first = m[2].split(',')[0].trim();
  const isSetup = /^(to\s|[-\d.]+(deg|turn|rad|grad)\b|circle|ellipse|closest|farthest|at\s|from\s)/i.test(first);
  const out = isSetup ? `${m[1]}${first} in oklab${m[2].slice(m[2].indexOf(',')) || ''})` : `${m[1]}in oklab, ${m[2]})`;
  try { return typeof CSS !== 'undefined' && CSS.supports('background-image', out) ? out : fill; } catch { return fill; }
}
