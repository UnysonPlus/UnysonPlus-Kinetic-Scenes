/**
 * The Studio's in-preview editor. Runs inside the preview iframe next to the player (which it uses
 * only through the public window.UnysonPlusScene API) and talks to the Studio with postMessage:
 *
 *   Studio → preview  play · pause · seek {time} · safe {show} · scene {scene} · select {ids}
 *                     ui {scale} · align {mode, to} · scope {id}
 *   preview → Studio  upw:ready · upw:state · upw:error · upw:select {ids} · upw:enter {id}
 *                     upw:layout {items: [{id, box, mode, size} | {id, move: {dx, dy}}]} · upw:text {id, text}
 *                     upw:key {key, code, mod, shift, alt}
 *
 * Scope: the group being edited (null = the whole scene). Clicks pick layers at that level only, so
 * at the top a click on a group's contents selects the group; double-clicking a group steps in.
 * A group moves as a whole ({move} items: the Studio shifts everything inside it).
 *
 * It draws the selection, hover and box-select outlines; selects with click, Shift/Ctrl+click and a
 * dragged box; moves one layer or a group (snapping to the centre and the safe area); resizes a single
 * layer; edits text in place; and measures layers for Align and Distribute, since only the preview
 * knows how big auto-sized text really is. Nothing here ships in exported scenes.
 */
import type { Anchor, Box, Scene } from './types';
import type { ScenePlayer } from './player';
import { allLayers } from './groups';

type Api = { mount: (host: HTMLElement, scene: unknown, opts: Record<string, unknown>) => ScenePlayer };

const ANCHOR: Record<Anchor, [number, number]> = {
  'top-left': [0, 0], top: [0.5, 0], 'top-right': [1, 0],
  left: [0, 0.5], center: [0.5, 0.5], right: [1, 0.5],
  'bottom-left': [0, 1], bottom: [0.5, 1], 'bottom-right': [1, 1],
};
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type Handle = (typeof HANDLES)[number];

export type AlignMode =
  | 'left' | 'hcenter' | 'right' | 'top' | 'vcenter' | 'bottom'
  | 'dist-left' | 'dist-hcenter' | 'dist-right' | 'dist-top' | 'dist-vcenter' | 'dist-bottom'
  | 'space-h' | 'space-v';
export type AlignTo = 'selection' | 'stage' | 'safe';

const round = (n: number) => Math.round(n * 100) / 100;
const send = (msg: Record<string, unknown>) => parent.postMessage(msg, '*');

const CSS = `
#upw-ed{position:fixed;inset:0;pointer-events:none;z-index:2147483600;--k:1}
#upw-ed .box{position:fixed;box-sizing:border-box;display:none}
#upw-ed .hover{outline:calc(1px*var(--k)) solid rgba(80,220,160,.55)}
#upw-ed .sel{outline:calc(1.5px*var(--k)) solid #2ad38b}
#upw-ed .member{outline:calc(1px*var(--k)) solid #2ad38b}
#upw-ed .group{outline:calc(1px*var(--k)) dashed #2ad38b;outline-offset:calc(3px*var(--k))}
#upw-ed .marquee{background:rgba(42,211,139,.1);outline:calc(1px*var(--k)) solid rgba(42,211,139,.8)}
#upw-ed .h{position:absolute;width:calc(9px*var(--k));height:calc(9px*var(--k));margin:calc(-4.5px*var(--k)) 0 0 calc(-4.5px*var(--k));
  background:#fff;border:calc(1.5px*var(--k)) solid #2ad38b;box-sizing:border-box;pointer-events:auto;border-radius:calc(2px*var(--k))}
#upw-ed .h[data-h=nw],#upw-ed .h[data-h=se]{cursor:nwse-resize}
#upw-ed .h[data-h=ne],#upw-ed .h[data-h=sw]{cursor:nesw-resize}
#upw-ed .h[data-h=n],#upw-ed .h[data-h=s]{cursor:ns-resize}
#upw-ed .h[data-h=e],#upw-ed .h[data-h=w]{cursor:ew-resize}
#upw-ed .tag{position:absolute;left:0;bottom:100%;margin-bottom:calc(4px*var(--k));padding:calc(1px*var(--k)) calc(6px*var(--k));
  font:600 calc(11px*var(--k))/1.5 system-ui,sans-serif;color:#0b1a12;background:#2ad38b;border-radius:calc(3px*var(--k));white-space:nowrap}
#upw-ed .group .tag{margin-bottom:calc(7px*var(--k))}
#upw-ed .guide{position:fixed;display:none;background:#ff4fa3}
#upw-ed .gx{width:calc(1px*var(--k))}
#upw-ed .gy{height:calc(1px*var(--k))}
.upw-stage{cursor:default}
.upw-layer{cursor:move}
.upw-layer[data-locked]{cursor:default}
.upw-scene[data-ed-scope] .upw-layer:not([data-ed-path]):not([data-ed-host]):not([data-ed-host] .upw-layer){filter:opacity(.22);pointer-events:none}
#upw-ed-text{position:fixed;z-index:2147483601;margin:0;padding:0;border:0;resize:none;overflow:hidden;
  background:rgba(10,13,17,.55);outline:calc(1.5px*var(--k,1)) solid #2ad38b;box-sizing:content-box;white-space:pre-wrap}
`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

/**
 * A layer's frame, in % of the space its position is measured in (the canvas, or the stage-wide pin
 * space for a pinned layer). ox / oy: that space's top-left on screen. kx / ky: the space's size over the
 * canvas's, to turn a size measured in the space into the frame units a pinned layer's size is stored in.
 */
interface Frame { l: number; t: number; w: number; h: number; W: number; H: number; box: Box; ax: number; ay: number; ox: number; oy: number; kx: number; ky: number }
type Rect = Pick<Frame, 'l' | 't' | 'w' | 'h' | 'W' | 'H'> & { ox?: number; oy?: number };

function start() {
  const api = (window as unknown as { UnysonPlusScene: Api }).UnysonPlusScene;
  const host = document.getElementById('scene')!;
  const initial = JSON.parse(document.getElementById('scene-json')!.textContent || '{}');
  const safeInitial = document.body.dataset.safe === 'true';

  let player: ScenePlayer;
  try {
    // audio: false: the Studio plays the scene's sound itself (a frame can't start sound from clicks outside it).
    player = api.mount(host, initial, { editor: true, autoplay: false, safeArea: safeInitial, allowCode: true, audio: false });
  } catch (e) {
    const box = el('div', 'err');
    box.textContent = (e as Error).message;
    host.appendChild(box);
    send({ type: 'upw:error', message: (e as Error).message });
    return;
  }

  const style = el('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const ov = el('div');
  ov.id = 'upw-ed';
  const hover = el('div', 'box hover');
  const sel = el('div', 'box sel');
  const tag = el('div', 'tag');
  sel.appendChild(tag);
  const handleEls = HANDLES.map((h) => {
    const d = el('div', 'h');
    d.dataset.h = h;
    sel.appendChild(d);
    return d;
  });
  const group = el('div', 'box group');
  const groupTag = el('div', 'tag');
  group.appendChild(groupTag);
  const marquee = el('div', 'box marquee');
  const gx = el('div', 'guide gx');
  const gy = el('div', 'guide gy');
  const members: HTMLElement[] = [];
  ov.append(hover, group, sel, marquee, gx, gy);
  document.body.appendChild(ov);

  /** Selected layer ids; the last one is the primary (the one the Studio's inspector shows). */
  let selection: string[] = [];
  /** The group being edited, or null for the whole scene. */
  let scope: string | null = null;
  let hovered: string | null = null;
  let k = 1;
  let editing: { id: string; ta: HTMLTextAreaElement; layer: HTMLElement } | null = null;

  const scene = () => player.scene as Scene;
  const layerOf = (id: string) => allLayers(scene().layers).find((l) => l.id === id);
  const isGroup = (id: string) => { const l = layerOf(id); return l?.type === 'group' && !l.fromRepeat; };
  /** The id of the group a layer sits in (null at the top of the scene), read from the page. */
  const parentOf = (id: string): string | null => {
    const node = player.layerElement(id);
    const up = node?.parentElement?.closest('.upw-layer') as HTMLElement | null;
    return up && player.root.contains(up) ? up.dataset.layer ?? null : null;
  };
  const isLocked = (id: string) => !!(layerOf(id) as { locked?: boolean } | undefined)?.locked;
  const safe = () => (scene().stage.safeArea ?? 0.06) * 100;

  /** Marks locked layers so the stage shows them as not draggable. */
  function markLocked() {
    for (const l of allLayers(scene().layers)) {
      const node = player.layerElement(l.id);
      if (!node) continue;
      if ((l as { locked?: boolean }).locked) node.dataset.locked = '';
      else delete node.dataset.locked;
    }
  }

  /** A layer's frame in canvas percentages (left, top, width, height), from its laid-out size. */
  function frame(id: string, box?: Box): Frame | null {
    const lay = player.layout(id);
    const node = player.layerElement(id);
    const cv = player.canvas();
    if (!lay || !node || lay.hidden) return null;
    const sp = player.space(id);
    const W = sp.clientWidth;
    const H = sp.clientHeight;
    const r = sp.getBoundingClientRect();
    const b = box ?? lay.box;
    const w = (node.offsetWidth / W) * 100;
    const h = (node.offsetHeight / H) * 100;
    const [ax, ay] = ANCHOR[b.anchor ?? 'center'];
    return { l: b.x - w * ax, t: b.y - h * ay, w, h, W, H, box: b, ax, ay, ox: r.left, oy: r.top, kx: W / (cv.clientWidth || W), ky: H / (cv.clientHeight || H) };
  }

  function bounds(frames: Rect[]): Rect | null {
    if (!frames.length) return null;
    const l = Math.min(...frames.map((f) => f.l));
    const t = Math.min(...frames.map((f) => f.t));
    const r = Math.max(...frames.map((f) => f.l + f.w));
    const b = Math.max(...frames.map((f) => f.t + f.h));
    return { l, t, w: r - l, h: b - t, W: frames[0].W, H: frames[0].H, ox: frames[0].ox, oy: frames[0].oy };
  }

  function place(div: HTMLElement, f: Rect) {
    const cr = player.canvas().getBoundingClientRect();
    const ox = f.ox ?? cr.left;
    const oy = f.oy ?? cr.top;
    Object.assign(div.style, {
      display: 'block',
      left: `${ox + (f.l / 100) * f.W}px`,
      top: `${oy + (f.t / 100) * f.H}px`,
      width: `${(f.w / 100) * f.W}px`,
      height: `${(f.h / 100) * f.H}px`,
    });
  }

  function handlesFor(id: string): Handle[] {
    const layer = layerOf(id);
    if (!layer || isLocked(id)) return [];
    if (layer.type === 'group') return [];
    if (layer.type === 'text') return ['e', 'w'];
    if (typeof player.layout(id)?.box.ratio === 'number') return ['nw', 'ne', 'se', 'sw'];
    // On a thin layer (a line, a bar) the corner handles would sit on top of the side ones, so keep
    // only the handles that stretch it along its length.
    const f = frame(id);
    const min = 27 * k;
    if (f && (f.h / 100) * f.H < min) return ['e', 'w'];
    if (f && (f.w / 100) * f.W < min) return ['n', 's'];
    return [...HANDLES];
  }

  let drawQueued = false;
  /** Draws outlines; `live` overrides frames for layers being dragged. */
  function draw(live?: Map<string, Rect>) {
    hover.style.display = 'none';
    sel.style.display = 'none';
    group.style.display = 'none';
    members.forEach((m) => { m.style.display = 'none'; });
    if (hovered && !selection.includes(hovered) && !drag && !marq) {
      const f = frame(hovered);
      if (f) place(hover, f);
    }
    if (editing || !selection.length) return;
    const frameOf = (id: string) => live?.get(id) ?? frame(id);

    if (selection.length === 1) {
      const id = selection[0];
      const f = frameOf(id);
      if (!f) return;
      place(sel, f);
      const layer = layerOf(id);
      tag.textContent = `${layer?.name || layer?.id || ''}${isLocked(id) ? ' (locked)' : ''}`;
      const shown = handlesFor(id);
      const pos: Record<Handle, [number, number]> = {
        nw: [0, 0], n: [50, 0], ne: [100, 0], e: [100, 50], se: [100, 100], s: [50, 100], sw: [0, 100], w: [0, 50],
      };
      handleEls.forEach((d) => {
        const h = d.dataset.h as Handle;
        d.style.display = shown.includes(h) ? 'block' : 'none';
        d.style.left = `${pos[h][0]}%`;
        d.style.top = `${pos[h][1]}%`;
      });
      return;
    }
    // Several layers: an outline on each, and a dashed box around the group.
    const frames: Rect[] = [];
    selection.forEach((id, i) => {
      const f = frameOf(id);
      if (!f) return;
      frames.push(f);
      if (!members[i]) {
        members[i] = el('div', 'box member');
        ov.insertBefore(members[i], sel);
      }
      place(members[i], f);
    });
    const g = bounds(frames);
    if (g) {
      place(group, g);
      groupTag.textContent = `${selection.length} layers`;
    }
  }
  const redraw = () => {
    // While the camera moves the view, the flat-layout handles would sit in the wrong place: hide them.
    ov.style.visibility = player.cameraActive ? 'hidden' : '';
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(() => {
      drawQueued = false;
      if (!drag) draw();
    });
  };

  // ---- state reporting ----
  let reportQueued = false;
  const report = () => {
    if (reportQueued) return;
    reportQueued = true;
    requestAnimationFrame(() => {
      reportQueued = false;
      ov.style.visibility = player.cameraActive ? 'hidden' : '';
      const stage = document.querySelector('.upw-stage');
      send({
        type: 'upw:state', time: player.time, duration: player.duration, playing: player.playing,
        breakpoint: player.breakpoint, stageHeight: stage ? Math.round(stage.getBoundingClientRect().height) : 0,
        camera: player.cameraActive,
      });
    });
  };
  (['update', 'play', 'pause', 'complete', 'breakpoint', 'rebuild'] as const).forEach((e) => player.on(e, report));
  (['breakpoint', 'rebuild'] as const).forEach((e) => player.on(e, redraw));
  player.on('rebuild', markLocked);
  markLocked();
  addEventListener('resize', () => { report(); redraw(); });
  addEventListener('scroll', redraw, { passive: true });

  // ---- selection ----
  function setSelection(ids: string[], notify: boolean) {
    selection = [...new Set(ids)].filter((id) => !!layerOf(id));
    if (notify) send({ type: 'upw:select', ids: selection });
    redraw();
  }

  /**
   * The topmost unlocked layer under a point, at the current scope: for a hit deep inside groups,
   * the ancestor that sits directly in the scope (so at the top, a group's contents pick the group).
   */
  function layerAt(x: number, y: number): string | null {
    for (const node of document.elementsFromPoint(x, y)) {
      const el = node as HTMLElement;
      const first = el.closest?.('.upw-layer') as HTMLElement | null;
      if (first && player.root.contains(first)) {
        // Walk out from the innermost layer to the one whose parent is the scope.
        let cur: HTMLElement | null = first;
        while (cur) {
          const id = cur.dataset.layer ?? null;
          const up = cur.parentElement?.closest('.upw-layer') as HTMLElement | null;
          const parentId = up && player.root.contains(up) ? up.dataset.layer ?? null : null;
          if (parentId === scope) {
            if (id && !isLocked(id)) return id;
            break;
          }
          cur = up && player.root.contains(up) ? up : null;
        }
        continue;
      }
      if (el.classList?.contains('upw-stage')) return null;
    }
    return null;
  }

  /** Marks the open group and its ancestors, so everything outside it is dimmed and inert. */
  function applyScope() {
    player.root.querySelectorAll('[data-ed-path],[data-ed-host]').forEach((n) => {
      delete (n as HTMLElement).dataset.edPath;
      delete (n as HTMLElement).dataset.edHost;
    });
    if (!scope || !layerOf(scope)) {
      scope = null;
      delete player.root.dataset.edScope;
      return;
    }
    player.root.dataset.edScope = scope;
    const host = player.layerElement(scope);
    if (host) host.dataset.edHost = '';
    let cur: string | null = scope;
    while (cur) {
      const node = player.layerElement(cur);
      if (node) node.dataset.edPath = '';
      cur = parentOf(cur);
    }
  }

  // ---- move, resize and box select ----
  interface Drag {
    ids: string[];
    mode: 'move' | Handle;
    x0: number;
    y0: number;
    f0: Map<string, Frame>;
    moved: boolean;
    patches: Map<string, Partial<Box>>;
  }
  let drag: Drag | null = null;
  let marq: { x0: number; y0: number; additive: boolean; base: string[]; moved: boolean } | null = null;

  function snapAxis(edges: number[], lines: number[], thr: number): { delta: number; line: number | null } {
    let best: { delta: number; line: number | null } = { delta: 0, line: null };
    let bestDist = thr;
    for (const e of edges) for (const line of lines) {
      const d = line - e;
      if (Math.abs(d) < bestDist) {
        bestDist = Math.abs(d);
        best = { delta: d, line };
      }
    }
    return best;
  }

  function showGuides(lineX: number | null, lineY: number | null, f: { W: number; H: number; ox?: number; oy?: number }) {
    const cr = player.canvas().getBoundingClientRect();
    const stageRect = document.querySelector('.upw-stage')!.getBoundingClientRect();
    const ox = f.ox ?? cr.left;
    const oy = f.oy ?? cr.top;
    if (lineX !== null) {
      Object.assign(gx.style, { display: 'block', left: `${ox + (lineX / 100) * f.W}px`, top: `${stageRect.top}px`, height: `${stageRect.height}px` });
    } else gx.style.display = 'none';
    if (lineY !== null) {
      Object.assign(gy.style, { display: 'block', top: `${oy + (lineY / 100) * f.H}px`, left: `${stageRect.left}px`, width: `${stageRect.width}px` });
    } else gy.style.display = 'none';
  }

  function onMove(e: PointerEvent) {
    if (!drag) return;
    const dxPx = e.clientX - drag.x0;
    const dyPx = e.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dxPx, dyPx) < 3) return;
    if (!drag.moved) {
      drag.moved = true;
      player.pause();
    }
    const first = drag.f0.values().next().value as Frame;
    const dx = (dxPx / first.W) * 100;
    const dy = (dyPx / first.H) * 100;
    const s = safe();
    const live = new Map<string, Rect>();
    let guideX: number | null = null;
    let guideY: number | null = null;

    if (drag.mode === 'move') {
      // Move the whole group by one offset, snapping the group's edges and centre.
      const g = bounds([...drag.f0.values()])!;
      let ddx = dx;
      let ddy = dy;
      if (!e.altKey) {
        const sx = snapAxis([g.l + dx, g.l + dx + g.w / 2, g.l + dx + g.w], [50, s, 100 - s], ((6 * k) / g.W) * 100);
        const sy = snapAxis([g.t + dy, g.t + dy + g.h / 2, g.t + dy + g.h], [50, s, 100 - s], ((6 * k) / g.H) * 100);
        ddx += sx.delta;
        ddy += sy.delta;
        guideX = sx.line;
        guideY = sy.line;
      }
      for (const [id, f] of drag.f0) {
        const l = f.l + ddx;
        const t = f.t + ddy;
        drag.patches.set(id, { x: round(l + f.w * f.ax), y: round(t + f.h * f.ay) });
        live.set(id, { l, t, w: f.w, h: f.h, W: f.W, H: f.H, ox: f.ox, oy: f.oy });
      }
    } else {
      const id = drag.ids[0];
      const f0 = drag.f0.get(id)!;
      const layer = layerOf(id)!;
      const hnd = drag.mode;
      let l = f0.l, t = f0.t, w = f0.w, h = f0.h;
      const ratioLocked = typeof f0.box.ratio === 'number';
      if (hnd.includes('e')) w = f0.w + dx;
      if (hnd.includes('w')) w = f0.w - dx;
      if (layer.type !== 'text') {
        if (hnd.includes('s')) h = f0.h + dy;
        if (hnd.includes('n')) h = f0.h - dy;
      }
      w = Math.max(0.5, w);
      h = Math.max(0.5, h);
      if (layer.type !== 'text' && (ratioLocked || (e.shiftKey && hnd.length === 2))) {
        // Keep the shape: height follows the width (in pixels).
        const r = ratioLocked ? f0.box.ratio! : (f0.w * f0.W) / (f0.h * f0.H);
        h = (w * f0.W) / r / f0.H;
      }
      // Anchored at the opposite edge or corner.
      if (hnd.includes('w')) l = f0.l + f0.w - w;
      if (hnd.includes('n')) t = f0.t + f0.h - h;
      // Only write what this handle changed, so an edge drag never nudges the other axis by rounding.
      const horizontal = hnd.includes('e') || hnd.includes('w');
      const vertical = layer.type !== 'text' && (hnd.includes('n') || hnd.includes('s') || ratioLocked || e.shiftKey);
      const patch: Partial<Box> = {};
      // Sizes are stored in frame units: a pinned layer measures in the stage-wide space, so convert.
      if (horizontal) {
        patch.w = round(w * f0.kx);
        patch.x = round(l + w * f0.ax);
      }
      if (vertical) {
        patch.y = round(t + h * f0.ay);
        if (!ratioLocked) patch.h = round(h * f0.ky);
      }
      drag.patches.set(id, patch);
      if (layer.type === 'text') {
        // Text height follows the wrap, so measure it after the preview lays it out.
        player.previewLayer(id, patch);
        const f = frame(id, { ...f0.box, ...patch });
        if (f) live.set(id, f);
      } else {
        live.set(id, { l, t, w, h, W: f0.W, H: f0.H, ox: f0.ox, oy: f0.oy });
      }
    }
    for (const [id, patch] of drag.patches) player.previewLayer(id, patch);
    showGuides(guideX, guideY, first);
    draw(live);
  }

  function onUp() {
    if (!drag) return;
    const d = drag;
    drag = null;
    removeEventListener('pointermove', onMove);
    gx.style.display = 'none';
    gy.style.display = 'none';
    const items = [...d.patches].filter(([, p]) => Object.keys(p).length).map(([id, box]) => {
      // The laid-out size (canvas %) and the kind of drag let the Studio turn a move into a keyframe.
      if (!isGroup(id)) { const f0 = d.f0.get(id)!; return { id, box, mode: d.mode === 'move' ? 'move' : 'resize', size: { w: round(f0.w), h: round(f0.h) } }; }
      // A group's frame is measured, not stored: send how far it moved.
      const f0 = d.f0.get(id)!;
      return { id, move: { dx: round((box.x ?? f0.l) - f0.l), dy: round((box.y ?? f0.t) - f0.t) } };
    });
    if (d.moved && items.length) {
      // The Studio writes the change into the scene and sends the new scene back.
      send({ type: 'upw:layout', items });
    } else {
      for (const id of d.ids) player.previewLayer(id, null);
    }
    redraw();
  }

  /** Layers whose frames overlap a screen rectangle. */
  function layersInRect(x0: number, y0: number, x1: number, y1: number): string[] {
    // Compared on screen, since layers may be measured in different spaces (the canvas, the pin space).
    const L = Math.min(x0, x1), R = Math.max(x0, x1), T = Math.min(y0, y1), B = Math.max(y0, y1);
    const hits: string[] = [];
    for (const layer of allLayers(scene().layers)) {
      if (isLocked(layer.id) || parentOf(layer.id) !== scope) continue;
      const node = player.layerElement(layer.id);
      if (!node || getComputedStyle(node).visibility === 'hidden') continue;
      const f = frame(layer.id);
      if (!f) continue;
      const fl = f.ox + (f.l / 100) * f.W, fr = fl + (f.w / 100) * f.W, ft = f.oy + (f.t / 100) * f.H, fb = ft + (f.h / 100) * f.H;
      if (fl < R && fr > L && ft < B && fb > T) hits.push(layer.id);
    }
    return hits;
  }

  function onMarqueeMove(e: PointerEvent) {
    if (!marq) return;
    if (!marq.moved && Math.hypot(e.clientX - marq.x0, e.clientY - marq.y0) < 4) return;
    marq.moved = true;
    Object.assign(marquee.style, {
      display: 'block',
      left: `${Math.min(marq.x0, e.clientX)}px`, top: `${Math.min(marq.y0, e.clientY)}px`,
      width: `${Math.abs(e.clientX - marq.x0)}px`, height: `${Math.abs(e.clientY - marq.y0)}px`,
    });
    const hits = layersInRect(marq.x0, marq.y0, e.clientX, e.clientY);
    selection = marq.additive ? [...new Set([...marq.base, ...hits])] : hits;
    draw();
  }

  function onMarqueeUp() {
    if (!marq) return;
    removeEventListener('pointermove', onMarqueeMove);
    marquee.style.display = 'none';
    const m = marq;
    marq = null;
    if (m.moved) setSelection(selection, true);
  }

  addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || editing) return;
    // Layers are edited in the flat layout: with the camera moving the view, say so instead.
    if (player.cameraActive) { send({ type: 'upw:camera-blocked' }); return; }
    const additive = e.shiftKey || e.ctrlKey || e.metaKey;
    const handle = (e.target as HTMLElement).closest?.('.h') as HTMLElement | null;

    if (handle && selection.length === 1) {
      const id = selection[0];
      const f0 = frame(id);
      if (!f0) return;
      e.preventDefault();
      drag = { ids: [id], mode: handle.dataset.h as Handle, x0: e.clientX, y0: e.clientY, f0: new Map([[id, f0]]), moved: false, patches: new Map() };
    } else {
      const id = layerAt(e.clientX, e.clientY);
      if (!id) {
        // Empty space: start a box selection (adding to the selection with Shift or Ctrl).
        if (!additive) setSelection([], true);
        e.preventDefault();
        marq = { x0: e.clientX, y0: e.clientY, additive, base: [...selection], moved: false };
        addEventListener('pointermove', onMarqueeMove);
        addEventListener('pointerup', onMarqueeUp, { once: true });
        addEventListener('pointercancel', onMarqueeUp, { once: true });
        return;
      }
      if (additive) {
        // Shift or Ctrl + click adds or removes one layer; no dragging.
        setSelection(selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id], true);
        return;
      }
      // Clicking a layer that is already part of the selection drags the whole selection.
      const ids = selection.includes(id) ? [...selection.filter((x) => x !== id), id] : [id];
      setSelection(ids, true);
      const f0 = new Map<string, Frame>();
      for (const x of ids) {
        const f = frame(x);
        if (f && !isLocked(x)) f0.set(x, f);
      }
      if (!f0.size) return;
      e.preventDefault();
      drag = { ids, mode: 'move', x0: e.clientX, y0: e.clientY, f0, moved: false, patches: new Map() };
    }
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp, { once: true });
    addEventListener('pointercancel', onUp, { once: true });
  });

  addEventListener('pointermove', (e) => {
    if (drag || editing || marq) return;
    const id = layerAt(e.clientX, e.clientY);
    if (id !== hovered) {
      hovered = id;
      redraw();
    }
  });
  document.addEventListener('pointerleave', () => { hovered = null; redraw(); });

  // ---- align and distribute ----
  function align(mode: AlignMode, to: AlignTo) {
    const items = selection.map((id) => ({ id, f: frame(id) })).filter((x): x is { id: string; f: Frame } => !!x.f && !isLocked(x.id));
    if (!items.length) return;
    const s = safe();
    const useSelection = to === 'selection' && items.length > 1;
    const T = useSelection
      ? bounds(items.map((i) => i.f))!
      : to === 'safe'
        ? { l: s, t: s, w: 100 - 2 * s, h: 100 - 2 * s }
        : { l: 0, t: 0, w: 100, h: 100 };
    const next = new Map(items.map((i) => [i.id, { l: i.f.l, t: i.f.t }]));
    const horizontal = ['left', 'hcenter', 'right', 'dist-left', 'dist-hcenter', 'dist-right', 'space-h'].includes(mode);

    if (mode === 'left' || mode === 'hcenter' || mode === 'right') {
      for (const { id, f } of items) {
        next.get(id)!.l = mode === 'left' ? T.l : mode === 'right' ? T.l + T.w - f.w : T.l + T.w / 2 - f.w / 2;
      }
    } else if (mode === 'top' || mode === 'vcenter' || mode === 'bottom') {
      for (const { id, f } of items) {
        next.get(id)!.t = mode === 'top' ? T.t : mode === 'bottom' ? T.t + T.h - f.h : T.t + T.h / 2 - f.h / 2;
      }
    } else if (mode.startsWith('dist-')) {
      // Equal spacing between the chosen edge (or centre) of each layer.
      if (items.length < (useSelection ? 3 : 2)) return;
      const axis = horizontal ? 'x' : 'y';
      const part = mode.endsWith('center') ? 0.5 : mode === 'dist-left' || mode === 'dist-top' ? 0 : 1;
      const pos = (f: Frame) => (axis === 'x' ? f.l : f.t);
      const size = (f: Frame) => (axis === 'x' ? f.w : f.h);
      const key = (f: Frame) => pos(f) + size(f) * part;
      const sorted = [...items].sort((a, b) => key(a.f) - key(b.f));
      const firstF = sorted[0].f;
      const lastF = sorted[sorted.length - 1].f;
      const lo = useSelection ? key(firstF) : (axis === 'x' ? T.l : T.t) + size(firstF) * part;
      const hi = useSelection ? key(lastF) : (axis === 'x' ? T.l + T.w : T.t + T.h) - size(lastF) * (1 - part);
      sorted.forEach(({ id, f }, i) => {
        const k2 = lo + ((hi - lo) * i) / (sorted.length - 1);
        if (axis === 'x') next.get(id)!.l = k2 - f.w * part;
        else next.get(id)!.t = k2 - f.h * part;
      });
    } else {
      // Equal gaps between neighbours.
      if (items.length < (useSelection ? 3 : 2)) return;
      const axis = mode === 'space-h' ? 'x' : 'y';
      const pos = (f: Frame) => (axis === 'x' ? f.l : f.t);
      const size = (f: Frame) => (axis === 'x' ? f.w : f.h);
      const sorted = [...items].sort((a, b) => pos(a.f) - pos(b.f));
      const start = useSelection ? pos(sorted[0].f) : axis === 'x' ? T.l : T.t;
      const end = useSelection ? Math.max(...sorted.map((i) => pos(i.f) + size(i.f))) : axis === 'x' ? T.l + T.w : T.t + T.h;
      const total = sorted.reduce((n, i) => n + size(i.f), 0);
      const gap = (end - start - total) / (sorted.length - 1);
      let cursor = start;
      for (const { id, f } of sorted) {
        if (axis === 'x') next.get(id)!.l = cursor;
        else next.get(id)!.t = cursor;
        cursor += size(f) + gap;
      }
    }

    const out: Array<{ id: string; box: Partial<Box> } | { id: string; move: { dx: number; dy: number } }> = [];
    for (const { id, f } of items) {
      const n = next.get(id)!;
      const box: Partial<Box> = {};
      const x = round(n.l + f.w * f.ax);
      const y = round(n.t + f.h * f.ay);
      if (horizontal && x !== round(f.box.x)) box.x = x;
      if (!horizontal && y !== round(f.box.y)) box.y = y;
      if (!Object.keys(box).length) continue;
      if (isGroup(id)) out.push({ id, move: { dx: horizontal ? round(n.l - f.l) : 0, dy: horizontal ? 0 : round(n.t - f.t) } });
      else out.push({ id, box });
    }
    if (out.length) send({ type: 'upw:layout', items: out });
  }

  // ---- text editing in place ----
  function finishEdit(commit: boolean) {
    if (!editing) return;
    const { id, ta, layer } = editing;
    editing = null;
    layer.style.opacity = '';
    if (commit && ta.value !== player.layout(id)?.text) send({ type: 'upw:text', id, text: ta.value });
    ta.remove();
    redraw();
  }

  addEventListener('dblclick', (e) => {
    const id = layerAt(e.clientX, e.clientY);
    const layer = id ? layerOf(id) : null;
    if (id && layer?.type === 'group') {
      // Step into the group (the Studio switches its timeline and sends the scope back).
      send({ type: 'upw:enter', id });
      return;
    }
    if (!id || !layer || layer.type !== 'text') return;
    const node = player.layerElement(id)!;
    const inner = node.querySelector('.upw-li') as HTMLElement;
    player.pause();
    setSelection([id], true);
    const rect = node.getBoundingClientRect();
    const cs = getComputedStyle(inner);
    const ta = el('textarea');
    ta.id = 'upw-ed-text';
    ta.value = player.layout(id)?.text ?? '';
    ta.setAttribute('aria-label', 'Edit text');
    ta.spellcheck = false;
    const hasWidth = typeof player.layout(id)?.box.w === 'number';
    Object.assign(ta.style, {
      left: `${rect.left}px`, top: `${rect.top}px`,
      width: hasWidth ? `${rect.width}px` : `${Math.max(rect.width, 40)}px`,
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color,
      textAlign: cs.textAlign, textTransform: cs.textTransform,
      // Text without a set width sits on its own lines, so the editor must not wrap it either.
      whiteSpace: hasWidth ? 'pre-wrap' : 'pre',
    });
    ta.style.setProperty('--k', String(k));
    const fit = () => {
      if (!hasWidth) {
        ta.style.width = '0px';
        ta.style.width = `${Math.max(ta.scrollWidth + 4, 40)}px`;
      }
      ta.style.height = '0px';
      ta.style.height = `${ta.scrollHeight}px`;
    };
    ta.addEventListener('input', fit);
    ta.addEventListener('keydown', (ev) => {
      ev.stopPropagation();
      if (ev.key === 'Escape') { ev.preventDefault(); finishEdit(false); }
      else if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); finishEdit(true); }
    });
    ta.addEventListener('blur', () => finishEdit(true));
    node.style.opacity = '0';
    document.body.appendChild(ta);
    editing = { id, ta, layer: node };
    fit();
    ta.focus();
    ta.select();
    draw();
  });

  // ---- keyboard: the Studio owns the shortcuts, so forward them while the preview has focus ----
  addEventListener('keydown', (e) => {
    if (editing) return;
    const mod = e.ctrlKey || e.metaKey;
    const forwarded = e.code === 'Space' || e.key === 'Home' || e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Escape'
      || e.key.startsWith('Arrow') || e.key === ',' || e.key === '.' || (mod && ['z', 'y', 'd', 's', 'a', 'g'].includes(e.key.toLowerCase()));
    if (!forwarded) return;
    e.preventDefault();
    send({ type: 'upw:key', key: e.key, code: e.code, mod, shift: e.shiftKey, alt: e.altKey });
  });

  // ---- messages from the Studio ----
  addEventListener('message', (e) => {
    if (e.source !== parent || !e.data || typeof e.data.type !== 'string') return;
    const m = e.data;
    if (m.type === 'play') player.play();
    else if (m.type === 'pause') player.pause();
    else if (m.type === 'seek') player.seek(Number(m.time) || 0);
    else if (m.type === 'safe') player.setSafeArea(!!m.show);
    else if (m.type === 'camera') { player.setCamera(!!m.on); redraw(); report(); }
    else if (m.type === 'select') setSelection(Array.isArray(m.ids) ? m.ids : m.id ? [m.id] : [], false);
    else if (m.type === 'align') align(m.mode as AlignMode, m.to as AlignTo);
    else if (m.type === 'scope') {
      scope = typeof m.id === 'string' ? m.id : null;
      selection = [];
      applyScope();
      redraw();
    }
    else if (m.type === 'ui') {
      k = Math.max(0.5, Math.min(8, 1 / (Number(m.scale) || 1)));
      ov.style.setProperty('--k', String(k));
      redraw();
    } else if (m.type === 'scene') {
      if (editing) finishEdit(false);
      try {
        player.update(m.scene);
        markLocked();
        applyScope();
        const kept = selection.filter((id) => layerOf(id));
        if (kept.length !== selection.length) setSelection(kept, true);
        send({ type: 'upw:error', message: null });
      } catch (err) {
        send({ type: 'upw:error', message: (err as Error).message });
      }
      redraw();
    }
  });

  send({ type: 'upw:ready' });
  report();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
