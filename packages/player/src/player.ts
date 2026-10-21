import { gsap } from 'gsap';
import type { Box, Breakpoint, Clip, ModelLayer, Scene, TextStyle } from './types';
import { validateScene } from './validate';
import { applyLayout, buildText, createLayer, createStage, flatRefs, layoutTree, measureGroup, resolveLayer, type LayerRefs } from './dom';
import { groupDuration } from './groups';
import { injectFonts, injectStyles } from './styles';
import { presets, presetRand, type Timeline } from './presets';
import { seedFrom } from './random';
import { NAMED_EASES, resolveEase } from './eases';
import { linkToScroll, type ScrollLink } from './scroll';
import { load3d } from './model3d';
import { SceneAudio } from './audio';
import { soundTrack } from './sfx';
import { TRANSCRIPT_CLASS, transcriptHtml } from './transcript';
import { buildCamera, cameraTransform, isRest, CAMERA_REST, type CameraState } from './camera';
import { defaultEaseFor } from './presets/catalog';
import { drawDiagram, drawFlow, drawPath } from './vector';
import { drawCode } from './code';
import { drawCaptions } from './captions';
import { drawCursor } from './cursor';
import { expandRepeats } from './repeat';
import { presetMeta } from './presets/catalog';

// The measured eases, usable by name in any clip (and in custom code clips).
NAMED_EASES.forEach((e) => gsap.registerEase(e.id, e.fn));

export interface MountOptions {
  /** Start playback according to the scene's trigger. Defaults to true. */
  autoplay?: boolean;
  /** Editor preview: ignore the reduced-motion setting so the author can still watch the animation. */
  editor?: boolean;
  /** Show the safe-area guide. */
  safeArea?: boolean;
  /** Force a breakpoint instead of choosing one from the stage width. */
  breakpoint?: string | null;
  /** Let custom code clips run. Off by default: only pages that trust the scene's author turn it on. */
  allowCode?: boolean;
  /**
   * Presenting: in a click-to-advance scene, clicks and keys move through the slides even in editor
   * mode, and the keys work page-wide (the Studio's full screen). Without it, the keys work while the
   * scene has focus, so they never take over the page's own scrolling.
   */
  present?: boolean;
  /** Play the scene's sound (default true). The Studio's preview passes false and plays it itself. */
  audio?: boolean;
  /** Start with sound on (only after a user gesture, such as the click that opened full screen). */
  soundOn?: boolean;
  /** Show the scene's camera moves (default true). An editor turns it off to edit the flat layout. */
  camera?: boolean;
  /**
   * Show reference footage (video layers marked reference). Defaults to on in an editor and off elsewhere,
   * so a graphics-only export leaves it out; a full composite turns it on.
   */
  reference?: boolean;
}

export type PlayerEvent = 'update' | 'play' | 'pause' | 'complete' | 'breakpoint' | 'rebuild';

export interface LayerLayout {
  box: Box;
  style?: TextStyle;
  text?: string;
  hidden: boolean;
}

export interface ScenePlayer {
  readonly scene: Scene;
  readonly root: HTMLElement;
  readonly duration: number;
  readonly time: number;
  readonly playing: boolean;
  readonly breakpoint: string | null;
  play(): void;
  pause(): void;
  /** Jump to a moment, in seconds. Pauses playback. */
  seek(seconds: number): void;
  /** Click-to-advance: plays on to the next marker (or the end). */
  next(): void;
  /** Click-to-advance: goes back to the previous marker. */
  prev(): void;
  /** Click-to-advance: stopped at a marker, waiting for the next click. */
  readonly waiting: boolean;
  /** Shows or hides the camera's moves (editors edit the flat layout with it off). */
  setCamera(on: boolean): void;
  /**
   * Resolves once everything the scene shows has arrived: fonts, images (decoded), images used as
   * backgrounds, and every 3D model. A renderer waits for this before its first frame, so no frame is
   * blank or in a fallback font. Never rejects; `missing` lists what was still not there at the time limit.
   */
  whenReady(limitMs?: number): Promise<{ missing: string[] }>;
  /**
   * Resolves once every footage frame for the current time is on screen (a seek moves video asynchronously).
   * A frame-by-frame renderer awaits it after each seek.
   */
  settle(limitMs?: number): Promise<void>;
  /** True when the camera is on and currently moves the view away from the flat layout. */
  readonly cameraActive: boolean;
  /** Swap in a changed scene, keeping the playhead (and playback) where it was. Throws if invalid. */
  update(scene: unknown): void;
  setSafeArea(show: boolean): void;
  setBreakpoint(id: string | null): void;
  /** The canvas element: layer positions are percentages of its size. */
  canvas(): HTMLElement;
  /** A layer's positioned box element. */
  layerElement(id: string): HTMLElement | null;
  /**
   * The element a layer's position is a percentage of: the canvas (the scene's frame), or, for a layer
   * pinned to the stage (or inside a pinned group), the pin space that covers the whole stage.
   */
  space(id: string): HTMLElement;
  /** A layer's layout at the current breakpoint, overrides included. */
  layout(id: string): LayerLayout | null;
  /** Shows a layer with a temporary box (while dragging), without changing the scene. Null restores it. */
  previewLayer(id: string, box: Partial<Box> | null): void;
  on(event: PlayerEvent, fn: () => void): () => void;
  destroy(): void;
}

const prefersReducedMotion = (win: Window) => win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function pickBreakpoint(bps: Breakpoint[], width: number, ratio = 0): Breakpoint {
  // Sorted widest first by the validator (a layout by shape before the plain one of the same width).
  return bps.find((bp) => width >= bp.minWidth && (bp.minRatio === undefined || ratio >= bp.minRatio))
    ?? bps.find((bp) => width >= bp.minWidth && bp.minRatio === undefined)
    ?? bps[bps.length - 1];
}

/**
 * Keeps a footage element at the timeline's moment: the file's time is the layer's offset plus the time since
 * the layer started, times its speed. Playing, the video plays along (corrected when it drifts); paused or
 * scrubbing, it is set to the exact frame.
 */
function syncFootage(v: HTMLVideoElement, layer: { start?: number; offset?: number; rate?: number }, localTime: number, playing: boolean) {
  const rate = layer.rate ?? 1;
  const want = (layer.offset ?? 0) + Math.max(0, localTime - (layer.start ?? 0)) * rate;
  const len = Number.isFinite(v.duration) ? v.duration : Infinity;
  const inRange = localTime >= (layer.start ?? 0) && want < len;
  if (playing && inRange) {
    if (v.playbackRate !== rate) v.playbackRate = rate;
    if (Math.abs(v.currentTime - want) > 0.2) v.currentTime = want;
    if (v.paused) v.play().catch(() => { /* not allowed yet: stays on the frame */ });
  } else {
    if (!v.paused) v.pause();
    const target = Math.min(want, Number.isFinite(len) ? Math.max(0, len - 0.04) : want);
    if (Math.abs(v.currentTime - target) > 0.004) v.currentTime = target;
  }
}

/** Numbers each mounted scene, so styles a scene adds stay inside it. */
let sceneCount = 0;

function validated(input: unknown): Scene {
  // Repeat layers play as the groups they expand into.
  let expanded = input;
  try { if (input && typeof input === 'object' && Array.isArray((input as Scene).layers)) expanded = expandRepeats(input as Scene); } catch { expanded = input; }
  const result = validateScene(expanded);
  if (!result.ok) throw new Error(`This scene can't be played:\n- ${result.errors.join('\n- ')}`);
  return result.scene;
}

/**
 * Mounts a scene into a host element and returns its player.
 * Throws if the scene is not valid; the message lists every problem.
 */
export function mount(host: HTMLElement, input: unknown, options: MountOptions = {}): ScenePlayer {
  let scene = validated(input);
  const doc = host.ownerDocument;
  const win = doc.defaultView ?? window;

  injectStyles(doc);

  // A transcript the page already has (written by the server, for search engines) is kept as it is.
  const served = Array.from(host.children).find((c) => c.classList.contains(TRANSCRIPT_CLASS)) as HTMLElement | undefined;

  const root = doc.createElement('div');
  root.className = 'upw-scene';
  const sid = String(++sceneCount);
  root.dataset.upwSid = sid;
  if (options.safeArea) root.dataset.safe = '';
  // Editing: links on the stage stay inert, so a click selects the layer instead of leaving the page.
  if (options.editor && !options.present) root.dataset.editor = '';
  if (!(options.reference ?? !!options.editor)) root.dataset.noref = '';
  host.textContent = '';
  host.appendChild(root);
  if (served) host.appendChild(served);

  /**
   * The scene's words for search engines and screen readers: the served transcript, or one written here.
   * The animated stage is hidden from screen readers, which read the transcript instead.
   */
  function syncTranscript() {
    const decorative = !!scene.transcript?.decorative;
    if (!served) {
      host.querySelector(`:scope > .${TRANSCRIPT_CLASS}[data-upw-generated]`)?.remove();
      const html = transcriptHtml(scene);
      if (html) {
        const box = doc.createElement('div');
        box.innerHTML = html;
        const el = box.firstElementChild as HTMLElement;
        el.dataset.upwGenerated = '';
        host.appendChild(el);
      }
    }
    if (decorative) { root.removeAttribute('role'); root.removeAttribute('aria-label'); }
    else { root.setAttribute('role', 'group'); root.setAttribute('aria-label', scene.title || 'Animation'); }
  }

  // A transcript link with keyboard focus rings its layer on the stage (the link itself is invisible).
  const linkTarget = (e: Event) => (e.target as HTMLElement | null)?.closest?.('a[data-upw-link]') as HTMLElement | null;
  const onFocusIn = (e: FocusEvent) => {
    const a = linkTarget(e);
    const el = a && root.querySelector<HTMLElement>(`.upw-layer[data-layer="${CSS.escape(a.dataset.upwLink ?? '')}"]`);
    if (el) el.dataset.focus = '';
  };
  const onFocusOut = (e: FocusEvent) => { if (linkTarget(e)) root.querySelectorAll<HTMLElement>('.upw-layer[data-focus]').forEach((el) => delete el.dataset.focus); };
  host.addEventListener('focusin', onFocusIn);
  host.addEventListener('focusout', onFocusOut);
  // Hotspots: a link with a jump plays the scene from that moment instead of leaving the page. Works for the
  // click area on the stage and for its copy in the transcript (keyboard and screen readers).
  const onJump = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.('a[data-upw-jump]') as HTMLElement | null;
    if (!a || !host.contains(a)) return;
    const j = a.dataset.upwJump ?? '';
    const marker = scene.markers?.find((m) => m.id === j);
    const t = marker ? marker.t : Number(j);
    if (!Number.isFinite(t)) return;
    e.preventDefault();
    player.seek(Math.max(0, Math.min(scene.duration, t)));
    player.play();
  };
  host.addEventListener('click', onJump);
  // A window of a new shape may want a layout by shape (an ultrawide one).
  const onWinResize = () => { if (scene.stage.breakpoints.some((b) => b.minRatio !== undefined)) setBreakpointFromWidth(root.getBoundingClientRect().width || win.innerWidth); };
  win.addEventListener('resize', onWinResize);

  // Events
  const listeners = new Map<PlayerEvent, Set<() => void>>();
  const emit = (e: PlayerEvent) => listeners.get(e)?.forEach((fn) => fn());

  let canvasEl!: HTMLElement;
  let pinsEl!: HTMLElement;
  /** Keeps the pin space over the whole stage (the canvas is centred in it, and may be smaller or larger). */
  function fitPins() {
    if (!pinsEl || !stageEl || !canvasEl) return;
    const sw = stageEl.clientWidth, sh = stageEl.clientHeight, cw = canvasEl.offsetWidth, ch = canvasEl.offsetHeight;
    Object.assign(pinsEl.style, { left: `${(cw - sw) / 2}px`, top: `${(ch - sh) / 2}px`, width: `${sw}px`, height: `${sh}px` });
  }
  // The pin space follows the stage and the canvas whatever changes their size (the window, a layout
  // switch, the height mode), so it is re-fitted whenever either is resized.
  const pinWatch = new ResizeObserver(() => relayoutPins());
  /** Re-fits the pin space, and re-measures pinned groups (their frames are % of the stage). */
  function relayoutPins() {
    fitPins();
    const pinned = layers.filter((r) => r.pinned);
    if (pinned.length) layoutTree(pinned, current?.id ?? null);
    runLate();
  }
  /** Drawn after every update, once every preset has drawn: lines, flow lines, diagrams, Follow path. */
  let lateDraw: Array<() => void> = [];
  let lateFns: Array<() => void> = [];
  function runLate() {
    // Lines and flows first, then whatever is placed by them (Follow path).
    for (const fn of [...lateDraw, ...lateFns]) {
      try { fn(); } catch (e) { console.warn('[Unyson+ scene]', e); }
    }
  }
  let camEl: HTMLElement | null = null;
  let cameraOn = options.camera !== false;
  let hasCamera = false;
  const cam: CameraState = { ...CAMERA_REST };
  /** Draws the camera's current state (or the flat layout when it is off). */
  function applyCamera() {
    if (!camEl) return;
    const on = cameraOn && hasCamera && !isRest(cam);
    camEl.style.transform = on ? cameraTransform(cam) : '';
    // Parallax: layers with a depth move (and grow) more or less than the scene as the camera pans and zooms.
    for (const r of flatRefs(layers)) {
      const d = r.layer.depth;
      if (!d || r.pinned) continue;
      if (!on) { r.outer.style.translate = ''; r.outer.style.scale = ''; continue; }
      r.outer.style.translate = `${(-cam.x * d).toFixed(3)}cqw ${(-cam.y * d).toFixed(3)}cqh`;
      r.outer.style.scale = (1 + (cam.zoom - 1) * d).toFixed(4);
    }
    if (on && (cam.tiltX || cam.tiltY)) canvasEl.style.perspective = `${Math.round((canvasEl.clientWidth || 1000) * 1.6)}px`;
    else canvasEl.style.perspective = '';
  }
  let stageEl!: HTMLElement;
  let scrollLink: ScrollLink | null = null;
  let layers: LayerRefs[] = [];
  let forced: string | null = options.breakpoint ?? null;
  let current: Breakpoint | null = null;
  let tl: Timeline | null = null;
  let wantPlaying = false;
  /** Set once fonts are ready; nothing plays on its own before that. */
  let armed = false;
  let destroyed = false;

  const reduced = !options.editor && prefersReducedMotion(win);

  // ---- sound ----
  const hasAudio = () => options.audio !== false && soundTrack(scene).length > 0 && scene.playback.trigger !== 'scroll';
  let sound: SceneAudio | null = null;
  let soundBtn: HTMLButtonElement | null = null;
  /** Keeps the sound in step with the timeline: playing from its time, or stopped. */
  function syncAudio() {
    if (!sound) return;
    if (tl && !tl.paused() && !reduced) sound.play(tl.time());
    else sound.stop();
  }
  function setupSound() {
    if (!hasAudio()) {
      sound?.dispose();
      sound = null;
      soundBtn?.remove();
      soundBtn = null;
      return;
    }
    if (!sound) sound = new SceneAudio(win);
    sound.setClips(soundTrack(scene));
    if (!soundBtn) {
      soundBtn = doc.createElement('button');
      soundBtn.type = 'button';
      soundBtn.className = 'upw-sound';
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!sound) return;
        if (sound.on) sound.disable();
        else sound.enable().then(syncAudio);
        paintSound();
      });
    }
    root.appendChild(soundBtn);
    paintSound();
  }
  function paintSound() {
    if (!soundBtn || !sound) return;
    const on = sound.on;
    soundBtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
    soundBtn.title = on ? 'Sound on' : 'Tap for sound';
    soundBtn.dataset.on = on ? '1' : '0';
    soundBtn.innerHTML = on
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Tap for sound</span>';
  }

  // ---- click-to-advance ----
  const clickMode = () => scene.playback.advance === 'click' && scene.playback.trigger !== 'scroll';
  const markerTimes = () => [...new Set((scene.markers ?? []).map((m) => m.t))].sort((a, b) => a - b);
  let waiting = false;
  function setWaiting(on: boolean) {
    waiting = on;
    if (on) {
      root.dataset.waiting = '';
      wantPlaying = false;
      sound?.stop();
      emit('pause');
    } else delete root.dataset.waiting;
  }
  /** Where the next slide ends: the next marker after now, or the end. */
  const nextStop = (now: number) => markerTimes().find((m) => m > now + 1e-3) ?? scene.duration;

  /** Draws every 3D layer in its current state. */
  function render3d() {
    for (const r of flatRefs(layers)) if (r.model?.runtime) r.model.runtime.render(r.model.state);
  }

  function dispose3d() {
    for (const r of flatRefs(layers)) {
      r.model?.runtime?.dispose();
      if (r.model) r.model.runtime = undefined;
    }
  }

  /** Starts the 3D runtime for this scene's 3D layers (loading scene-3d.js the first time). */
  function start3d() {
    const models = flatRefs(layers).filter((r) => r.model);
    if (!models.length) return;
    load3d(win).then((m) => {
      for (const r of models) {
        if (destroyed || !r.model || r.model.runtime || !r.outer.isConnected) continue;
        r.model.runtime = m.create(r.inner, r.layer as ModelLayer);
        r.model.runtime.render(r.model.state);
        r.model.runtime.ready.then(() => emit('update'));
      }
    }).catch((e) => console.warn('[Unyson+ scene] 3D is unavailable:', e));
  }

  /** Builds the stage and layer elements for the current scene. */
  function setupDom() {
    dispose3d();
    root.textContent = '';
    root.dataset.mode = scene.stage.heightMode;
    root.dataset.fit = scene.stage.fit ?? 'cover';
    root.style.setProperty('--upw-offset', `${scene.stage.heightOffset ?? 0}px`);
    syncTranscript();
    injectFonts(doc, scene.stage.fonts);

    const { stage, canvas, cam: camNode, pins } = createStage(doc, scene);
    pinsEl = pins;
    pinWatch.disconnect();
    pinWatch.observe(stage);
    pinWatch.observe(canvas);
    camEl = camNode;
    // The words are in the transcript; the animated copies would only be read twice (or mid-scramble).
    stage.setAttribute('aria-hidden', 'true');
    canvasEl = canvas;
    stageEl = stage;
    if (soundBtn) soundBtn = null; // the old button went with the old stage
    root.appendChild(stage);
    layers = scene.layers.map((layer, i) => {
      const refs = createLayer(doc, layer, i + 1);
      // Pinned layers go in the pin space: placed against the stage, not moved by the camera.
      (refs.pinned ? pins : camNode).appendChild(refs.outer);
      return refs;
    });
    start3d();
    setupSound();
    // A hover's custom CSS, only where the page allows custom code (its author is trusted), scoped to its layer.
    if (options.allowCode) {
      const rules: string[] = [];
      for (const r of flatRefs(layers)) {
        const css = r.layer.hover?.css;
        if (css && !/[<]|@import|url\(\s*['"]?javascript:/i.test(css)) rules.push(`[data-upw-sid="${sid}"] .upw-layer[data-layer="${CSS.escape(r.layer.id)}"]:hover{${css}}`);
      }
      if (rules.length) {
        const st = doc.createElement('style');
        st.textContent = `@media (hover:hover){${rules.join('')}}`;
        root.appendChild(st);
      }
    }
  }

  /** A clip's ease as a function (for layers that draw themselves from their clips). */
  const easeFnOf = (clip: Clip): ((t: number) => number) => {
    const meta = presetMeta[clip.preset];
    const e = resolveEase(clip.ease ?? (meta ? defaultEaseFor(meta, clip.params) : 'none'));
    if (typeof e === 'function') return e;
    const f = gsap.parseEase(e) as ((t: number) => number) | undefined;
    return typeof f === 'function' ? f : (t: number) => t;
  };

  /** Loop the last part: where the repeats start, or null to loop everything (or not at all). */
  const loopFrom = (): number | null => {
    const lf = scene.playback.loopFrom;
    if (!scene.playback.loop || clickMode() || scene.playback.trigger === 'scroll' || lf === undefined) return null;
    return lf > 1e-3 && lf < scene.duration - 0.05 ? lf : null;
  };
  let loopCall: gsap.core.Tween | null = null;
  const cancelLoop = () => { loopCall?.kill(); loopCall = null; };

  function buildTimeline(): Timeline {
    const t = gsap.timeline({
      paused: true,
      onUpdate: () => {
        render3d();
        applyCamera();
        runLate();
        emit('update');
      },
      onRepeat: () => syncAudio(),
      onComplete: () => {
        const lf = loopFrom();
        if (lf !== null && t === tl && wantPlaying) {
          // Back to the start of the last part, after the pause between loops.
          const again = () => { loopCall = null; if (destroyed || t !== tl || !wantPlaying) return; t.play(lf); syncAudio(); emit('update'); };
          const delay = scene.playback.repeatDelay ?? 0;
          if (delay > 0) { sound?.stop(); loopCall = gsap.delayedCall(delay, again); } else again();
          return;
        }
        sound?.stop();
        if (clickMode()) { tl?.pause(); setWaiting(true); }
        wantPlaying = false;
        emit('complete');
        emit('pause');
      },
    });
    // Make the timeline exactly as long as the scene, even if the last clip ends early.
    t.set({}, {}, scene.duration);
    lateFns = [];
    lateDraw = [];

    addLayers(t, layers, scene.duration);
    hasCamera = buildCamera(t, scene, cam);
    applyCamera();
    // A scroll-linked scene follows the page, so it never loops on its own.
    if (clickMode()) {
      // A presentation: stop at every marker and wait. It never repeats on its own; the click after the
      // last slide starts it over when the scene loops.
      for (const m of markerTimes()) if (m > 1e-3 && m < scene.duration - 1e-3) t.addPause(m, () => setWaiting(true));
    } else if (scene.playback.loop && scene.playback.trigger !== 'scroll' && loopFrom() === null) t.repeat(-1).repeatDelay(scene.playback.repeatDelay ?? 0);
    return t;
  }

  /**
   * Adds a list of layers to a timeline whose length is `length`. A group gets its own nested
   * timeline at its start time, so its contents run on the group's clock.
   */
  function addLayers(t: Timeline, list: LayerRefs[], length: number) {
    for (const refs of list) {
      const { layer, outer } = refs;
      const start = layer.start ?? 0;
      const end = layer.end ?? length;
      // Layer in/out points. The starting state is set outside the timeline: a zero-length step at
      // time 0 would be undone when scrubbing back to the very start.
      gsap.set(outer, { visibility: start > 0 ? 'hidden' : 'inherit' });
      if (start > 0) t.set(outer, { visibility: 'inherit' }, start);
      if (end < length) t.set(outer, { visibility: 'hidden' }, end);

      const clips = [...layer.clips].sort((a, b) => a.start - b.start);
      clips.forEach((clip, idx) => {
        const preset = presets[clip.preset];
        if (!preset.appliesTo.includes(layer.type)) return;
        preset.build({
          tl: t,
          layer,
          clip,
          el: refs.inner,
          words: refs.words,
          chars: refs.chars,
          at: clip.start,
          duration: clip.duration,
          ease: resolveEase(clip.ease ?? defaultEaseFor(preset, clip.params)),
          params: { ...preset.defaults, ...(clip.params ?? {}) },
          first: idx === 0,
          rand: presetRand(seedFrom(`${layer.id}/${clip.id}`)),
          gsap,
          allowCode: !!options.allowCode,
          model: refs.model?.state,
          late: (fn) => { lateFns.push(fn); },
          now: () => t.time(),
          sceneAudio: scene.audio ?? [],
          sceneNow: () => (tl ? tl.time() : t.time()),
        });
      });
      // Lines, flow lines and diagrams draw from where things are, after every preset has drawn.
      const inner = refs.inner;
      if (layer.type === 'path') lateDraw.push(() => drawPath(inner, layer));
      else if (layer.type === 'flow') lateDraw.push(() => drawFlow(inner, layer, t.time()));
      else if (layer.type === 'diagram') lateDraw.push(() => drawDiagram(inner, layer, t.time() - (layer.start ?? 0)));
      else if (layer.type === 'code') lateDraw.push(() => drawCode(inner, layer, t.time(), easeFnOf));
      else if (layer.type === 'video' && refs.media instanceof HTMLVideoElement) {
        const v = refs.media;
        lateFns.push(() => syncFootage(v, layer, t.time(), !!tl && !tl.paused()));
      }
      // The cursor goes last: it measures the layers it points at after they have drawn this frame.
      else if (layer.type === 'cursor') lateFns.push(() => drawCursor(inner, layer, t.time(), easeFnOf));
      // Captions follow the voice-over, which runs on the scene's own clock.
      else if (layer.type === 'captions') lateDraw.push(() => drawCaptions(inner, layer, scene.audio, tl ? tl.time() : 0));

      if (layer.type === 'group' && refs.children) {
        const dur = groupDuration(layer);
        const inner = gsap.timeline();
        inner.set({}, {}, dur);
        addLayers(inner, refs.children, dur);
        t.add(inner, start);
      }
    }
  }

  /** (Re)builds text and the timeline, then puts the playhead back where it was. */
  function rebuild(time: number, play: boolean) {
    cancelLoop();
    if (tl) {
      tl.kill();
      tl = null;
      // Clear what the old timeline wrote so the new one starts from clean elements.
      for (const r of flatRefs(layers)) {
        const holders = r.words.map((w) => w.parentElement).filter(Boolean);
        gsap.set([r.inner, ...r.words, ...r.chars, ...holders], { clearProps: 'all' });
      }
    }
    for (const r of flatRefs(layers)) {
      if (r.layer.type === 'text') {
        const { text } = resolveLayer(r.layer, current?.id ?? null);
        buildText(doc, r, text ?? '');
      }
    }
    fitPins();
    layoutTree(layers, current?.id ?? null);
    tl = buildTimeline();
    tl.time(Math.min(time, scene.duration), false);
    runLate();
    if (play) tl.play();
    syncAudio();
    emit('rebuild');
  }

  function chooseBreakpoint(width: number) {
    const bps = scene.stage.breakpoints;
    // The stage's shape, where it has a free one (filling the window, or capped to it).
    const mode = scene.stage.heightMode;
    const tall = (win.innerHeight || 0) - (scene.stage.heightOffset ?? 0);
    const ratio = mode !== 'ratio' && tall > 0 ? width / tall : 0;
    return forced ? bps.find((b) => b.id === forced) ?? pickBreakpoint(bps, width, ratio) : pickBreakpoint(bps, width, ratio);
  }

  function applyBreakpoint(next: Breakpoint) {
    current = next;
    root.dataset.bp = next.id;
    root.style.setProperty('--upw-ar', `${next.aspect[0]} / ${next.aspect[1]}`);
    root.style.setProperty('--upw-arn', String(next.aspect[0] / next.aspect[1]));
  }

  function setBreakpointFromWidth(width: number) {
    const next = chooseBreakpoint(width);
    if (current?.id === next.id) return;
    applyBreakpoint(next);
    // A breakpoint that changes a layer's words needs new character elements, so the timeline is
    // rebuilt. Anything else is layout only and the running timeline carries on untouched.
    const textChanged = flatRefs(layers).some((r) => r.layer.type === 'text' && resolveLayer(r.layer, next.id).text !== r.builtText);
    if (!tl || textChanged) rebuild(tl ? tl.time() : 0, tl ? !tl.paused() : false);
    else layoutTree(layers, next.id);
    emit('breakpoint');
  }

  setupDom();
  applyBreakpoint(chooseBreakpoint(root.getBoundingClientRect().width || win.innerWidth));
  rebuild(0, false);

  const resizeObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width;
    if (w) setBreakpointFromWidth(w);
    relayoutPins();
    scrollLink?.refresh();
  });
  resizeObserver.observe(root);

  // Pause looping scenes while they are off screen; play "view" scenes when they arrive.
  let inView = false;
  const io = new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting);
    if (!tl || reduced) return;
    if (inView && wantPlaying && armed && tl.paused()) { tl.play(); syncAudio(); } else if (!inView && !tl.paused() && scene.playback.loop) { tl.pause(); syncAudio(); }
  }, { threshold: 0.2 });
  io.observe(root);

  const refsOf = (id: string) => flatRefs(layers).find((r) => r.layer.id === id) ?? null;

  const player: ScenePlayer = {
    get scene() { return scene; },
    root,
    get duration() { return scene.duration; },
    get time() { return tl ? tl.time() : 0; },
    get playing() { return !!tl && !tl.paused(); },
    get waiting() { return waiting; },
    setCamera(on: boolean) { cameraOn = on; applyCamera(); },
    async whenReady(limitMs = 20000) {
      const missing: string[] = [];
      const until = <T,>(p: Promise<T>, ms: number, what: string) => new Promise<void>((done) => {
        const timer = setTimeout(() => { missing.push(what); done(); }, ms);
        // A failure is reported too (a broken address), not only a time-out.
        p.then(() => { clearTimeout(timer); done(); }, () => { clearTimeout(timer); missing.push(`${what} (failed to load)`); done(); });
      });
      // Fonts: capped, and the families still loading are reported.
      await until(doc.fonts.ready, Math.min(limitMs, 5000), 'fonts');
      if (missing.includes('fonts')) {
        const loading = new Set<string>();
        doc.fonts.forEach((f) => { if (f.status === 'loading') loading.add(f.family.replace(/["']/g, '')); });
        missing.splice(missing.indexOf('fonts'), 1, ...[...loading].map((f) => `font ${f}`));
      }
      // Images: loaded, then decoded (decoding one still loading can hang, so wait for the load first).
      const imgs = Array.from(root.querySelectorAll('img'));
      await Promise.all(imgs.map((img) => until(
        (img.complete ? Promise.resolve() : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }))
          .then(() => (img.naturalWidth ? img.decode() : Promise.reject(new Error('no image')))),
        limitMs, `image ${img.currentSrc || img.src}`.slice(0, 120))));
      // Images used as backgrounds (a shape filled with a picture).
      const urls = new Set<string>();
      root.querySelectorAll<HTMLElement>('[style*="url("]').forEach((el) => {
        for (const m of el.style.backgroundImage.matchAll(/url\((['"]?)(.*?)\)/g)) if (m[2]) urls.add(m[2]);
      });
      await Promise.all([...urls].map((u) => {
        const im = new Image();
        im.src = u;
        return until(im.decode(), limitMs, `background ${u}`.slice(0, 120));
      }));
      // Footage: enough of every video to show its first frame.
      const vids = Array.from(root.querySelectorAll('video'));
      await Promise.all(vids.map((v) => until(
        v.readyState >= 2 ? Promise.resolve() : new Promise((ok, bad) => { v.addEventListener('loadeddata', ok, { once: true }); v.addEventListener('error', bad, { once: true }); }),
        limitMs, `video ${v.currentSrc || v.src}`.slice(0, 120))));
      // 3D: the engine, then every model.
      const models = flatRefs(layers).filter((r) => r.model);
      if (models.length) {
        await until(load3d(win).then(() => undefined), limitMs, '3D engine');
        const runtimes = await new Promise<Array<{ ready: Promise<void> }>>((done) => {
          const started = Date.now();
          const check = () => {
            const rs = models.map((r) => r.model!.runtime).filter(Boolean) as Array<{ ready: Promise<void> }>;
            if (rs.length === models.length || Date.now() - started > limitMs) done(rs);
            else setTimeout(check, 50);
          };
          check();
        });
        if (runtimes.length < models.length) missing.push(`${models.length - runtimes.length} 3D layer(s)`);
        await Promise.all(runtimes.map((r) => until(r.ready, limitMs, '3D model')));
        render3d();
      }
      return { missing };
    },
    async settle(limitMs = 4000) {
      const vids = Array.from(root.querySelectorAll('video'));
      await Promise.all(vids.map((v) => new Promise<void>((done) => {
        if (!v.seeking && v.readyState >= 2) return done();
        const timer = setTimeout(done, limitMs);
        const ok = () => { if (!v.seeking && v.readyState >= 2) { clearTimeout(timer); v.removeEventListener('seeked', ok); v.removeEventListener('canplay', ok); done(); } };
        v.addEventListener('seeked', ok);
        v.addEventListener('canplay', ok);
      })));
      // Effects that draw the footage into a canvas (copies, shatter) draw again now the frame is there.
      if (vids.length) runLate();
      // One more frame so the decoded picture is painted.
      await new Promise((r) => win.requestAnimationFrame(() => r(undefined)));
    },
    get cameraActive() { return cameraOn && hasCamera && !isRest(cam); },
    next() {
      if (!tl || !clickMode()) return;
      const now = tl.time();
      const atEnd = now >= scene.duration - 1e-3;
      if (atEnd && !scene.playback.loop) return;
      setWaiting(false);
      if (atEnd) tl.time(0, false);
      if (reduced) {
        // No motion: jump straight to the next slide's finished state.
        const stop = atEnd ? (markerTimes().find((m) => m > 1e-3) ?? scene.duration) : nextStop(now);
        tl.time(stop, false);
        setWaiting(true);
        emit('update');
        return;
      }
      wantPlaying = true;
      tl.play();
      syncAudio();
      emit('play');
    },
    prev() {
      if (!tl || !clickMode()) return;
      const now = tl.time();
      const before = markerTimes().filter((m) => m < now - 0.05);
      // Back to the end of the slide before this one (the start, before the first marker).
      const target = before[before.length - 1] ?? 0;
      tl.pause();
      tl.time(target, false);
      sound?.stop();
      setWaiting(true);
      emit('update');
    },
    get breakpoint() { return current?.id ?? null; },
    play() {
      if (!tl) return;
      wantPlaying = true;
      // At the end (a scene that stops there, or one that loops its last part): start over.
      if (tl.time() >= scene.duration - 1e-3) tl.time(0);
      tl.play();
      syncAudio();
      emit('play');
    },
    pause() {
      if (!tl) return;
      cancelLoop();
      wantPlaying = false;
      tl.pause();
      sound?.stop();
      root.querySelectorAll('video').forEach((v) => v.pause());
      emit('pause');
    },
    seek(seconds) {
      if (!tl) return;
      cancelLoop();
      wantPlaying = false;
      tl.pause();
      tl.time(Math.max(0, Math.min(scene.duration, seconds)), false);
      sound?.stop();
      emit('pause');
      emit('update');
    },
    update(next) {
      const nextScene = validated(next);
      const time = tl ? tl.time() : 0;
      const play = tl ? !tl.paused() : false;
      cancelLoop();
      if (tl) {
        tl.kill();
        tl = null;
      }
      scene = nextScene;
      setupDom();
      applyBreakpoint(chooseBreakpoint(root.getBoundingClientRect().width || win.innerWidth));
      rebuild(time, play);
      scrollLink?.refresh();
      emit('breakpoint');
      emit('update');
    },
    setSafeArea(show) {
      if (show) root.dataset.safe = '';
      else delete root.dataset.safe;
    },
    setBreakpoint(id) {
      forced = id;
      current = null;
      setBreakpointFromWidth(root.getBoundingClientRect().width);
    },
    canvas: () => canvasEl,
    layerElement: (id) => refsOf(id)?.outer ?? null,
    space: (id) => (refsOf(id)?.pinned ? pinsEl : canvasEl),
    layout(id) {
      const r = refsOf(id);
      if (!r) return null;
      const resolved = resolveLayer(r.layer, current?.id ?? null);
      // A group's box is its measured frame.
      if (r.frame) return { ...resolved, box: { x: r.frame.l, y: r.frame.t, w: r.frame.w, h: r.frame.h, anchor: 'top-left' } };
      return resolved;
    },
    previewLayer(id, box) {
      const r = refsOf(id);
      if (!r) return;
      const bp = current?.id ?? null;
      if (r.children) {
        // A group moves as a whole: shift its frame (its contents ride along), or re-fit it.
        if (!box) measureGroup(r, bp);
        else {
          if (typeof box.x === 'number') r.outer.style.left = `${box.x}%`;
          if (typeof box.y === 'number') r.outer.style.top = `${box.y}%`;
        }
        return;
      }
      if (!box) {
        applyLayout(r, bp);
        return;
      }
      // Lay the layer out as if this breakpoint's override carried the temporary box.
      const key = bp ?? '__preview';
      const base = resolveLayer(r.layer, bp).box;
      const overrides = { ...(r.layer.overrides ?? {}), [key]: { ...(r.layer.overrides?.[key] ?? {}), box: { ...base, ...box } } };
      applyLayout({ ...r, layer: { ...r.layer, overrides } }, key);
    },
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(fn);
      return () => listeners.get(event)?.delete(fn);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelLoop();
      tl?.kill();
      host.removeEventListener('focusin', onFocusIn);
      host.removeEventListener('click', onJump);
      win.removeEventListener('resize', onWinResize);
      host.removeEventListener('focusout', onFocusOut);
      scrollLink?.destroy();
      dispose3d();
      sound?.dispose();
      root.removeEventListener('click', onClick);
      win.removeEventListener('keydown', onKey as EventListener);
      root.removeEventListener('keydown', onKey as EventListener);
      resizeObserver.disconnect();
      pinWatch.disconnect();
      io.disconnect();
      listeners.clear();
      root.remove();
    },
  };

  // Click-to-advance input: clicks and taps on the scene, and the keys (on the focused scene, or
  // page-wide when presenting). The scene element is focusable and says how to move on.
  const isNext = (k: string) => k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter';
  const isPrev = (k: string) => k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace';
  const onKey = (e: KeyboardEvent) => {
    if (!clickMode() || destroyed) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest?.('input, textarea, select, [contenteditable]')) return;
    if (isNext(e.key)) { e.preventDefault(); player.next(); } else if (isPrev(e.key)) { e.preventDefault(); player.prev(); }
  };
  const onClick = (e: MouseEvent) => {
    if (!clickMode() || (e.target as HTMLElement).closest?.('a, button')) return;
    player.next();
  };
  const interactive = !options.editor || !!options.present;
  if (interactive) {
    root.addEventListener('click', onClick);
    (options.present ? win : root).addEventListener('keydown', onKey as EventListener);
    const marks = () => {
      if (clickMode()) {
        root.tabIndex = 0;
        root.setAttribute('aria-roledescription', 'presentation');
        root.title = 'Click, or press the right arrow, to continue';
      } else {
        root.removeAttribute('tabindex');
        root.removeAttribute('aria-roledescription');
        root.removeAttribute('title');
      }
    };
    marks();
    listeners.set('rebuild', new Set([...(listeners.get('rebuild') ?? []), marks]));
  }

  // (setupSound ran inside setupDom; TypeScript cannot see that from here.)
  const startSound = sound as SceneAudio | null;
  if (options.soundOn && startSound) { startSound.enable().then(syncAudio); paintSound(); }

  // Start
  const ready = waitForFonts(doc, scene).then(() => {
    armed = true;
    // Text may have changed size now that its fonts are in, so groups re-fit their frames.
    if (flatRefs(layers).some((r) => r.children)) layoutTree(layers, current?.id ?? null);
  });
  if (reduced && clickMode()) {
    // A presentation without motion: show the first slide's finished state; clicks jump slide to slide.
    ready.then(() => { if (!tl) return; tl.time(markerTimes().find((m) => m > 1e-3) ?? scene.duration, false); setWaiting(true); });
  } else if (reduced) {
    ready.then(() => tl?.time(scene.playback.posterTime ?? scene.duration, false));
  } else if (options.autoplay !== false) {
    const trigger = scene.playback.trigger;
    if (trigger === 'load') {
      ready.then(() => !destroyed && player.play());
    } else if (trigger === 'scroll') {
      // The page's scroll position is the playhead.
      ready.then(() => {
        if (destroyed) return;
        scrollLink = linkToScroll({
          win, root, stage: () => stageEl, settings: scene.playback.scroll, offset: scene.stage.heightOffset ?? 0,
          setProgress: (p) => { if (tl) tl.progress(p, false); },
        });
      });
    } else if (trigger === 'view') {
      // Arm the observer: the first time it reports the scene on screen, play.
      wantPlaying = true;
      ready.then(() => {
        if (!destroyed && inView && tl?.paused()) player.play();
      });
    }
  }

  return player;
}

/**
 * Waits for the scene's fonts (at most 2.5 s), so text never animates in a fallback font. A font's
 * stylesheet has to arrive before the browser knows the face exists, so that is awaited first.
 */
function waitForFonts(doc: Document, scene: Scene): Promise<void> {
  const fonts = scene.stage.fonts ?? [];
  if (!fonts.length || !doc.fonts) return Promise.resolve();
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .filter((l) => fonts.some((f) => f.href && l.href === f.href));
  const sheets = links.map((l) => (l.sheet ? Promise.resolve() : new Promise<void>((r) => {
    l.addEventListener('load', () => r(), { once: true });
    l.addEventListener('error', () => r(), { once: true });
  })));
  const loaded = Promise.all(sheets)
    .then(() => Promise.all(fonts.map((f) => doc.fonts.load(`700 1em "${f.family}"`).catch(() => undefined))));
  const timeout = new Promise((r) => setTimeout(r, 2500));
  return Promise.race([loaded, timeout]).then(() => undefined);
}
