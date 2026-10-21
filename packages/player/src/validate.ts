import { SAFE_HREF, SCENE_FORMAT, SCENE_VERSION } from './types';
import type { Anchor, Box, Breakpoint, Clip, HeightMode, Layer, RepeatLayer, Scene } from './types';
import { expandRepeat } from './repeat';
import { PRESET_IDS } from './presets/catalog';
import { SFX_IDS, parseSfxSrc } from './sfx';
import { CAMERA_LIMITS, CAMERA_PROPS } from './camera';

/**
 * Checks a parsed scene file and fills in defaults. Errors stop the scene from playing; warnings are
 * things worth fixing that still play. Kept free of the animation engine so the editor can use it
 * without pulling GSAP in.
 */

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  /** The scene with defaults filled in. Only meaningful when ok is true. */
  scene: Scene;
}

const HEIGHT_MODES: HeightMode[] = ['ratio', 'ratio-capped', 'fill'];
const ANCHORS: Anchor[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];
const TRIGGERS = ['load', 'view', 'manual', 'scroll'];
// A name, optionally with numbers in brackets: "power3.out", "back.out(1.6)", "cubic(0.3,-0.4,0.7,1.4)".
/** What a keyframe can set: x, y (% of the layer's own size), scale, rotate (degrees), opacity, blur (stage units). */
export const KEYFRAME_PROPS = ['x', 'y', 'scale', 'rotate', 'opacity', 'blur'] as const;
const EASE_RE = /^[a-zA-Z0-9.]+(\([0-9., -]*\))?$/;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
/** SVG path data: commands and numbers only. */
const PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,\s+-]*$/;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function validateScene(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fail = (path: string, msg: string) => errors.push(`${path}: ${msg}`);

  if (!isObj(input)) {
    return { ok: false, errors: ['The scene must be a JSON object.'], warnings, scene: input as Scene };
  }
  // Work on a copy so the caller's object is never changed.
  const scene = JSON.parse(JSON.stringify(input)) as Scene;

  if (scene.format !== SCENE_FORMAT) fail('format', `must be "${SCENE_FORMAT}"`);
  if (scene.version !== SCENE_VERSION) fail('version', `must be ${SCENE_VERSION}`);
  if (!isNum(scene.duration) || scene.duration <= 0 || scene.duration > 600) {
    fail('duration', 'must be a number of seconds between 0 and 600');
  }

  // Stage
  if (!isObj(scene.stage)) {
    fail('stage', 'is required');
  } else {
    const st = scene.stage;
    if (!Array.isArray(st.breakpoints) || st.breakpoints.length === 0) {
      fail('stage.breakpoints', 'needs at least one breakpoint');
    } else {
      const seen = new Set<string>();
      st.breakpoints.forEach((bp: Breakpoint, i: number) => {
        const p = `stage.breakpoints[${i}]`;
        if (!isObj(bp)) return fail(p, 'must be an object');
        if (typeof bp.id !== 'string' || !ID_RE.test(bp.id)) fail(`${p}.id`, 'must be a short id (letters, digits, - or _)');
        else if (seen.has(bp.id)) fail(`${p}.id`, `"${bp.id}" is used twice`);
        else seen.add(bp.id);
        if (!isNum(bp.minWidth) || bp.minWidth < 0) fail(`${p}.minWidth`, 'must be 0 or more');
        if (!Array.isArray(bp.aspect) || bp.aspect.length !== 2 || !bp.aspect.every((n) => isNum(n) && n > 0)) {
          fail(`${p}.aspect`, 'must be [width, height], e.g. [16, 9]');
        }
      });
      if (!st.breakpoints.some((bp) => isObj(bp) && bp.minWidth === 0)) {
        warnings.push('stage.breakpoints: none has minWidth 0, so the narrowest one is used below its minimum.');
      }
      st.breakpoints.sort((a, b) => b.minWidth - a.minWidth);
    }
    if (st.heightMode === undefined) st.heightMode = 'ratio-capped';
    if (!HEIGHT_MODES.includes(st.heightMode)) fail('stage.heightMode', `must be one of ${HEIGHT_MODES.join(', ')}`);
    if (st.heightOffset !== undefined && (!isNum(st.heightOffset) || st.heightOffset < 0)) fail('stage.heightOffset', 'must be 0 or more pixels');
    if (st.fit !== undefined && st.fit !== 'cover' && st.fit !== 'contain') fail('stage.fit', 'must be cover or contain');
    if (st.safeArea === undefined) st.safeArea = 0.06;
    if (!isNum(st.safeArea) || st.safeArea < 0 || st.safeArea >= 0.5) fail('stage.safeArea', 'must be between 0 and 0.5');
    if (st.background !== undefined && typeof st.background !== 'string') fail('stage.background', 'must be a CSS value');
    if (st.fonts !== undefined) {
      if (!Array.isArray(st.fonts)) fail('stage.fonts', 'must be a list');
      else st.fonts.forEach((f, i) => {
        if (!isObj(f) || typeof f.family !== 'string' || !f.family) fail(`stage.fonts[${i}].family`, 'is required');
        if (isObj(f) && f.href !== undefined && (typeof f.href !== 'string' || !/^https:\/\//.test(f.href))) {
          fail(`stage.fonts[${i}].href`, 'must be an https:// stylesheet address');
        }
      });
    }
  }

  // Playback
  if (scene.playback === undefined) scene.playback = { trigger: 'view', loop: false };
  if (!isObj(scene.playback)) {
    fail('playback', 'must be an object');
  } else {
    const pb = scene.playback;
    if (!TRIGGERS.includes(pb.trigger)) fail('playback.trigger', `must be one of ${TRIGGERS.join(', ')}`);
    if (typeof pb.loop !== 'boolean') pb.loop = false;
    if (pb.repeatDelay !== undefined && (!isNum(pb.repeatDelay) || pb.repeatDelay < 0)) fail('playback.repeatDelay', 'must be 0 or more seconds');
    if (pb.posterTime !== undefined && (!isNum(pb.posterTime) || pb.posterTime < 0 || pb.posterTime > scene.duration)) {
      fail('playback.posterTime', 'must be within the scene');
    }
    if (pb.advance !== undefined && pb.advance !== 'auto' && pb.advance !== 'click') fail('playback.advance', 'must be auto or click');
    if (pb.loopFrom !== undefined && (!isNum(pb.loopFrom) || pb.loopFrom < 0 || pb.loopFrom >= scene.duration)) fail('playback.loopFrom', 'must be a moment before the end of the scene');
    if (pb.scroll !== undefined) {
      const sc = pb.scroll;
      if (!isObj(sc)) fail('playback.scroll', 'must be an object');
      else {
        if (sc.pin !== undefined && typeof sc.pin !== 'boolean') fail('playback.scroll.pin', 'must be true or false');
        if (sc.length !== undefined && (!isNum(sc.length) || sc.length < 0.2 || sc.length > 10)) fail('playback.scroll.length', 'must be 0.2 to 10 window heights');
        if (sc.smooth !== undefined && (!isNum(sc.smooth) || sc.smooth < 0 || sc.smooth > 3)) fail('playback.scroll.smooth', 'must be 0 to 3 seconds');
      }
    }
  }

  // Audio
  if (scene.audio !== undefined) {
    if (!Array.isArray(scene.audio) || scene.audio.length > 100) fail('audio', 'must be a list of at most 100 clips');
    else {
      const seen = new Set<string>();
      scene.audio.forEach((a: unknown, i: number) => {
        const ap = `audio[${i}]`;
        if (!isObj(a)) return fail(ap, 'must be an object');
        if (typeof a.id !== 'string' || !ID_RE.test(a.id)) fail(`${ap}.id`, 'must be a short id');
        else if (seen.has(a.id)) fail(`${ap}.id`, `"${a.id}" is used twice`);
        else seen.add(a.id);
        if (typeof a.src !== 'string' || !(/^(data:audio\/|https?:\/\/)/.test(a.src) || parseSfxSrc(a.src))) fail(`${ap}.src`, `must be an audio data: URL, an http(s) address or a built-in sound "sfx:<name>" (${SFX_IDS.join(', ')})`);
        if (!isNum(a.start) || a.start < 0) fail(`${ap}.start`, 'must be 0 or more seconds');
        for (const k of ['offset', 'duration', 'fadeIn', 'fadeOut'] as const) if (a[k] !== undefined && (!isNum(a[k]) || (a[k] as number) < 0)) fail(`${ap}.${k}`, 'must be 0 or more seconds');
        if (a.volume !== undefined && (!isNum(a.volume) || a.volume < 0 || a.volume > 2)) fail(`${ap}.volume`, 'must be 0 to 2');
        if (a.role !== undefined && !['voice', 'music', 'sfx'].includes(a.role as string)) fail(`${ap}.role`, 'must be voice, music or sfx');
        if (a.words !== undefined) {
          if (!Array.isArray(a.words) || a.words.length > 20000) fail(`${ap}.words`, 'must be a list of at most 20,000 words');
          else {
            const bad = a.words.findIndex((w: unknown) => !isObj(w) || typeof w.w !== 'string' || w.w.length > 100 || !isNum(w.t) || w.t < 0 || !isNum(w.d) || w.d < 0
              || (w.s !== undefined && (!isNum(w.s) || w.s < 0 || w.s > 1)) || (w.p !== undefined && (!isNum(w.p) || w.p < 0)));
            if (bad >= 0) fail(`${ap}.words[${bad}]`, 'must be { w: text, t: seconds, d: seconds, s?: 0-1, p?: seconds }');
          }
        }
        if (a.speech !== undefined && !isObj(a.speech)) fail(`${ap}.speech`, 'must be an object');
      });
    }
  }

  // Camera
  if (scene.camera !== undefined) {
    const cam = scene.camera as unknown;
    if (!isObj(cam) || !Array.isArray(cam.keys) || cam.keys.length > 500) fail('camera', 'must be { keys: [...] } with at most 500 keys');
    else {
      const seenKeys = new Set<string>();
      cam.keys.forEach((k: unknown, i: number) => {
        const kp = `camera.keys[${i}]`;
        if (!isObj(k)) return fail(kp, 'must be an object');
        if (typeof k.id !== 'string' || !ID_RE.test(k.id)) fail(`${kp}.id`, 'must be a short id');
        else if (seenKeys.has(k.id)) fail(`${kp}.id`, `"${k.id}" is used twice`);
        else seenKeys.add(k.id);
        if (!isNum(k.t) || k.t < 0) fail(`${kp}.t`, 'must be 0 or more seconds');
        for (const p of CAMERA_PROPS) {
          if (k[p] === undefined) continue;
          const [lo, hi] = CAMERA_LIMITS[p];
          if (!isNum(k[p]) || (k[p] as number) < lo || (k[p] as number) > hi) fail(`${kp}.${p}`, `must be ${lo} to ${hi}`);
        }
        if (k.ease !== undefined && (typeof k.ease !== 'string' || !EASE_RE.test(k.ease))) fail(`${kp}.ease`, 'is not a valid easing name');
      });
    }
  }

  // Transcript (search engines and screen readers)
  if (scene.transcript !== undefined) {
    const t = scene.transcript as unknown;
    if (!isObj(t)) fail('transcript', 'must be an object');
    else {
      if (t.headline !== undefined && !['h1', 'h2', 'h3', 'p'].includes(t.headline as string)) fail('transcript.headline', 'must be h1, h2, h3 or p');
      if (t.decorative !== undefined && typeof t.decorative !== 'boolean') fail('transcript.decorative', 'must be true or false');
    }
  }

  // Markers (pause points for click-to-advance)
  if (scene.markers !== undefined) {
    if (!Array.isArray(scene.markers) || scene.markers.length > 200) fail('markers', 'must be a list of at most 200 markers');
    else {
      const seen = new Set<string>();
      scene.markers.forEach((m: unknown, i: number) => {
        const mp = `markers[${i}]`;
        if (!isObj(m)) return fail(mp, 'must be an object');
        if (typeof m.id !== 'string' || !ID_RE.test(m.id)) fail(`${mp}.id`, 'must be a short id');
        else if (seen.has(m.id)) fail(`${mp}.id`, `"${m.id}" is used twice`);
        else seen.add(m.id);
        if (!isNum(m.t) || m.t < 0 || (isNum(scene.duration) && m.t > scene.duration)) fail(`${mp}.t`, 'must be within the scene');
        if (m.label !== undefined && typeof m.label !== 'string') fail(`${mp}.label`, 'must be text');
      });
    }
  }

  // Layers (groups hold layers of their own; ids are unique across the whole scene)
  const bpIds = new Set((scene.stage?.breakpoints ?? []).map((b) => b?.id));
  const layerIds = new Set<string>();
  const clipIds = new Set<string>();
  const flowRefs: Array<{ p: string; from: string; to: string }> = [];
  const checkLayers = (list: unknown, base: string, depth: number) => {
    if (!Array.isArray(list)) return fail(base, 'must be a list');
    if (depth > 8) return fail(base, 'groups are nested too deeply (8 levels at most)');
    (list as Layer[]).forEach((layer: Layer, i: number) => {
      const p = `${base}[${i}]`;
      if (!isObj(layer)) return fail(p, 'must be an object');
      if (typeof layer.id !== 'string' || !ID_RE.test(layer.id)) fail(`${p}.id`, 'must be a short id (letters, digits, - or _)');
      else if (layerIds.has(layer.id)) fail(`${p}.id`, `"${layer.id}" is used twice`);
      else layerIds.add(layer.id);

      const lp = `${p} (${layer.id ?? '?'})`;
      if (layer.type === 'text') {
        if (typeof layer.text !== 'string') fail(`${lp}.text`, 'is required');
        if (!isObj(layer.style) || !isNum(layer.style.fontSize) || layer.style.fontSize <= 0) fail(`${lp}.style.fontSize`, 'is required (stage units)');
        if (layer.pill !== undefined && !isObj(layer.pill)) fail(`${lp}.pill`, 'must be { fill, stroke, radius, padX, padY }');
      } else if (layer.type === 'shape') {
        if (layer.shape !== 'rect' && layer.shape !== 'ellipse') fail(`${lp}.shape`, 'must be rect or ellipse');
        if (layer.dash !== undefined && (!isNum(layer.dash) || layer.dash < 0 || layer.dash > 50)) fail(`${lp}.dash`, 'must be 0 to 50 stage units');
        if (layer.dashGap !== undefined && (!isNum(layer.dashGap) || layer.dashGap < 0 || layer.dashGap > 50)) fail(`${lp}.dashGap`, 'must be 0 to 50 stage units');
      } else if (layer.type === 'image') {
        if (typeof layer.src !== 'string' || !layer.src) fail(`${lp}.src`, 'is required');
        if (!layer.alt) warnings.push(`${lp}.alt: add a description so screen readers can announce the image (or "" if it is decorative).`);
      } else if (layer.type === 'model') {
        const m = layer.model;
        if (!isObj(m) || !['text', 'shape', 'svg', 'gltf'].includes(m.kind)) fail(`${lp}.model.kind`, 'must be text, shape, svg or gltf');
        else {
          if (m.kind === 'text' && (typeof m.text !== 'string' || !m.text.trim())) fail(`${lp}.model.text`, 'is required for 3D text');
          if (m.kind === 'shape' && !['box', 'sphere', 'torus', 'knot', 'cylinder', 'crystal'].includes(m.shape as string)) fail(`${lp}.model.shape`, 'must be box, sphere, torus, knot, cylinder or crystal');
          if ((m.kind === 'svg' || m.kind === 'gltf') && (typeof m.src !== 'string' || !m.src)) fail(`${lp}.model.src`, 'is required');
          if (m.depth !== undefined && (!isNum(m.depth) || m.depth < 0.01 || m.depth > 4)) fail(`${lp}.model.depth`, 'must be 0.01 to 4');
          if (m.bevel !== undefined && (!isNum(m.bevel) || m.bevel < 0 || m.bevel > 1)) fail(`${lp}.model.bevel`, 'must be 0 to 1');
        }
        if (layer.material !== undefined && !isObj(layer.material)) fail(`${lp}.material`, 'must be an object');
        if (layer.pose !== undefined && !isObj(layer.pose)) fail(`${lp}.pose`, 'must be an object');
        if (layer.light !== undefined && (!isNum(layer.light) || layer.light < 0 || layer.light > 3)) fail(`${lp}.light`, 'must be 0 to 3');
      } else if (layer.type === 'group') {
        if (layer.duration !== undefined && (!isNum(layer.duration) || layer.duration <= 0)) fail(`${lp}.duration`, 'must be more than 0 seconds');
        checkLayers(layer.layers, `${lp}.layers`, depth + 1);
      } else if (layer.type === 'path') {
        if (typeof layer.d !== 'string' || !layer.d.trim() || layer.d.length > 20000 || !PATH_RE.test(layer.d)) fail(`${lp}.d`, 'must be SVG path data (M, L, C, Q, A, Z… with numbers)');
        if (layer.strokeWidth !== undefined && (!isNum(layer.strokeWidth) || layer.strokeWidth < 0 || layer.strokeWidth > 20)) fail(`${lp}.strokeWidth`, 'must be 0 to 20 stage units');
        if (layer.arrow !== undefined && !['end', 'start', 'both'].includes(layer.arrow)) fail(`${lp}.arrow`, 'must be end, start or both');
        if (layer.glow !== undefined && (!isNum(layer.glow) || layer.glow < 0 || layer.glow > 10)) fail(`${lp}.glow`, 'must be 0 to 10');
        if (layer.dash !== undefined && (!isNum(layer.dash) || layer.dash < 0 || layer.dash > 50)) fail(`${lp}.dash`, 'must be 0 to 50 stage units');
      } else if (layer.type === 'flow') {
        if (typeof layer.from !== 'string') fail(`${lp}.from`, 'must be the id of the layer the lines leave from');
        if (typeof layer.to !== 'string') fail(`${lp}.to`, 'must be the id of the layer the lines arrive at');
        if (!layer.from || !layer.to) warnings.push(`${lp}: pick the two layers the flow lines join.`);
        flowRefs.push({ p: lp, from: layer.from, to: layer.to });
        if (layer.count !== undefined && (!isNum(layer.count) || layer.count < 1 || layer.count > 40)) fail(`${lp}.count`, 'must be 1 to 40');
        if (layer.pinch !== undefined && (!isNum(layer.pinch) || layer.pinch < 0 || layer.pinch > 1)) fail(`${lp}.pinch`, 'must be 0 to 1');
        if (layer.wave !== undefined && (!isNum(layer.wave) || layer.wave < 0 || layer.wave > 1)) fail(`${lp}.wave`, 'must be 0 to 1');
        if (layer.glow !== undefined && (!isNum(layer.glow) || layer.glow < 0 || layer.glow > 3)) fail(`${lp}.glow`, 'must be 0 to 3');
        if (layer.pulses !== undefined && (!isNum(layer.pulses) || layer.pulses < 0 || layer.pulses > 6)) fail(`${lp}.pulses`, 'must be 0 to 6');
        if (layer.colors !== undefined && (!Array.isArray(layer.colors) || layer.colors.length > 8 || layer.colors.some((c) => typeof c !== 'string'))) fail(`${lp}.colors`, 'must be a list of up to 8 colours');
        for (const k of ['fromSide', 'toSide'] as const) if (layer[k] !== undefined && !['auto', 'left', 'right', 'top', 'bottom'].includes(layer[k] as string)) fail(`${lp}.${k}`, 'must be auto, left, right, top or bottom');
        if (!layer.box) (layer as { box?: Box }).box = { x: 0, y: 0, w: 100, h: 100, anchor: 'top-left' };
      } else if (layer.type === 'diagram') {
        const nodes = layer.nodes as unknown;
        const ids = new Set<string>();
        if (!Array.isArray(nodes) || !nodes.length || nodes.length > 200) fail(`${lp}.nodes`, 'must be a list of 1 to 200 nodes');
        else nodes.forEach((n: unknown, k: number) => {
          const np = `${lp}.nodes[${k}]`;
          if (!isObj(n)) return fail(np, 'must be an object');
          if (typeof n.id !== 'string' || !n.id) fail(`${np}.id`, 'is required');
          else if (ids.has(n.id)) fail(`${np}.id`, `"${n.id}" is used twice`);
          else ids.add(n.id);
          if (!isNum(n.x) || !isNum(n.y)) fail(np, 'needs x and y (% of the box)');
          if (n.shape !== undefined && !['box', 'pill', 'circle', 'dot', 'value'].includes(n.shape as string)) fail(`${np}.shape`, 'must be box, pill, circle, dot or value');
          if (n.at !== undefined && (!isNum(n.at) || n.at < 0)) fail(`${np}.at`, 'must be 0 or more seconds');
          if (n.moves !== undefined && (!Array.isArray(n.moves) || n.moves.some((m: unknown) => !isObj(m) || !isNum(m.t) || !isNum(m.x) || !isNum(m.y)))) fail(`${np}.moves`, 'must be a list of { t, x, y }');
        });
        const edges = layer.edges as unknown;
        if (edges !== undefined) {
          if (!Array.isArray(edges) || edges.length > 400) fail(`${lp}.edges`, 'must be a list of at most 400 connections');
          else edges.forEach((e: unknown, k: number) => {
            const ep = `${lp}.edges[${k}]`;
            if (!isObj(e)) return fail(ep, 'must be an object');
            if (!ids.has(e.from as string) || !ids.has(e.to as string)) fail(ep, 'from and to must be node ids');
            if (e.kind !== undefined && !['straight', 'curve', 'step'].includes(e.kind as string)) fail(`${ep}.kind`, 'must be straight, curve or step');
          });
        }
        if (layer.tag !== undefined) {
          const t = layer.tag as unknown;
          if (!isObj(t) || typeof t.label !== 'string' || !Array.isArray(t.stops) || t.stops.some((s: unknown) => !isObj(s) || !ids.has(s.node as string) || !isNum(s.t))) fail(`${lp}.tag`, 'must be { label, stops: [{ node, t }] } with node ids');
        }
      } else if (layer.type === 'captions') {
        if (!isObj(layer.style) || !isNum(layer.style.fontSize) || layer.style.fontSize <= 0) fail(`${lp}.style.fontSize`, 'is required (stage units)');
        if (layer.maxWords !== undefined && (!isNum(layer.maxWords) || layer.maxWords < 1 || layer.maxWords > 12)) fail(`${lp}.maxWords`, 'must be 1 to 12');
        if (layer.mode !== undefined && !['word', 'karaoke', 'none'].includes(layer.mode)) fail(`${lp}.mode`, 'must be word, karaoke or none');
        if (!(scene.audio ?? []).some((a) => Array.isArray(a?.words) && a.words.length)) warnings.push(`${lp}: captions need a voice-over with its words (transcribe it in the AI Dev Kit).`);
      } else if (layer.type === 'repeat') {
        // Played as the group it expands into; checked as that group.
        const r = layer as RepeatLayer;
        if (!isObj(r.item)) fail(`${lp}.item`, 'is required (the layer each entry copies)');
        else if (!Array.isArray(r.items) || r.items.length > 200 || r.items.some((e) => !isObj(e))) fail(`${lp}.items`, 'must be a list of at most 200 entries (objects)');
        else {
          const g = expandRepeat(r);
          checkLayers((g as { layers: Layer[] }).layers, `${lp}.copies`, depth + 1);
        }
      } else if (layer.type === 'code') {
        if (typeof layer.code !== 'string' || layer.code.length > 50000) fail(`${lp}.code`, 'must be text (50,000 characters at most)');
        if (layer.frame !== undefined && !['window', 'terminal', 'plain'].includes(layer.frame)) fail(`${lp}.frame`, 'must be window, terminal or plain');
        if (layer.theme !== undefined && !['dark', 'light'].includes(layer.theme)) fail(`${lp}.theme`, 'must be dark or light');
        if (layer.fontSize !== undefined && (!isNum(layer.fontSize) || layer.fontSize <= 0 || layer.fontSize > 20)) fail(`${lp}.fontSize`, 'must be more than 0 and at most 20 stage units');
      } else {
        fail(`${lp}.type`, 'must be text, shape, image, model, group, path, flow, diagram, code, captions or repeat');
      }

      if (layer.type !== 'group' && layer.type !== 'flow' && layer.type !== 'repeat') {
        if (!isObj(layer.box)) fail(`${lp}.box`, 'is required');
        else {
          if (!isNum(layer.box.x) || !isNum(layer.box.y)) fail(`${lp}.box`, 'needs x and y');
          if (layer.box.anchor !== undefined && !ANCHORS.includes(layer.box.anchor)) fail(`${lp}.box.anchor`, `must be one of ${ANCHORS.join(', ')}`);
          const sized = layer.type !== 'text' && layer.type !== 'captions';
          if (sized && !isNum(layer.box.w)) fail(`${lp}.box.w`, 'is required (all layers but text and captions)');
          if (sized && !isNum(layer.box.h) && !isNum(layer.box.ratio)) fail(`${lp}.box`, 'needs h or ratio (all layers but text and captions)');
        }
      }
      if (layer.depth !== undefined && (!isNum(layer.depth) || layer.depth < -1 || layer.depth > 1)) fail(`${lp}.depth`, 'must be -1 (far) to 1 (near)');
      if (layer.start !== undefined && (!isNum(layer.start) || layer.start < 0)) fail(`${lp}.start`, 'must be 0 or more seconds');
      if (layer.end !== undefined && (!isNum(layer.end) || layer.end <= (layer.start ?? 0))) fail(`${lp}.end`, 'must come after start');
      if (layer.pin !== undefined) {
        if (layer.pin !== 'stage') fail(`${lp}.pin`, 'must be "stage"');
        else if (depth > 0) {
          warnings.push(`${lp}.pin: only top-level layers can be pinned to the stage, so this one stays in its group.`);
          delete layer.pin;
        }
      }
      if (layer.link !== undefined) {
        const ln = layer.link;
        // A bad link is dropped (with a warning) rather than stopping the whole scene from playing.
        if (!isObj(ln) || typeof ln.href !== 'string' || !SAFE_HREF.test(ln.href.trim())) {
          warnings.push(`${lp}.link: only web, email, phone and same-site addresses work, so this link was left out.`);
          delete layer.link;
        } else {
          ln.href = ln.href.trim();
          if (ln.newTab !== undefined && typeof ln.newTab !== 'boolean') fail(`${lp}.link.newTab`, 'must be true or false');
          if (ln.label !== undefined && typeof ln.label !== 'string') fail(`${lp}.link.label`, 'must be text');
        }
      }

      if (layer.overrides !== undefined) {
        if (!isObj(layer.overrides)) fail(`${lp}.overrides`, 'must be an object keyed by breakpoint id');
        else for (const key of Object.keys(layer.overrides)) {
          if (!bpIds.has(key)) warnings.push(`${lp}.overrides.${key}: no breakpoint has this id, so it is never used.`);
        }
      }

      if (!Array.isArray(layer.clips)) layer.clips = [];
      layer.clips.forEach((clip: Clip, j: number) => {
        const cp = `${lp}.clips[${j}]`;
        if (!isObj(clip)) return fail(cp, 'must be an object');
        if (typeof clip.id !== 'string' || !ID_RE.test(clip.id)) fail(`${cp}.id`, 'must be a short id');
        else if (clipIds.has(clip.id)) fail(`${cp}.id`, `"${clip.id}" is used twice`);
        else clipIds.add(clip.id);
        if (!PRESET_IDS.includes(clip.preset)) fail(`${cp}.preset`, `"${String(clip.preset)}" is not a known preset (${PRESET_IDS.join(', ')})`);
        if (!isNum(clip.start) || clip.start < 0) fail(`${cp}.start`, 'must be 0 or more seconds');
        if (!isNum(clip.duration) || clip.duration <= 0) fail(`${cp}.duration`, 'must be more than 0 seconds');
        if (depth === 0 && isNum(clip.start) && isNum(clip.duration) && isNum(scene.duration) && clip.start + clip.duration > scene.duration + 1e-6) {
          warnings.push(`${cp}: ends at ${(clip.start + clip.duration).toFixed(2)}s, after the scene ends (${scene.duration}s).`);
        }
        if (clip.ease !== undefined && (typeof clip.ease !== 'string' || !EASE_RE.test(clip.ease))) fail(`${cp}.ease`, 'is not a valid easing name');
        if (clip.params !== undefined && !isObj(clip.params)) fail(`${cp}.params`, 'must be an object');
        if (clip.sound !== undefined) {
          const sd = clip.sound as unknown;
          const sp = `${cp}.sound`;
          if (!isObj(sd)) fail(sp, 'must be an object');
          else {
            if (typeof sd.name !== 'string' || !SFX_IDS.includes(sd.name)) fail(`${sp}.name`, `must be a built-in sound (${SFX_IDS.join(', ')})`);
            if (sd.at !== undefined && sd.at !== 'start' && sd.at !== 'end') fail(`${sp}.at`, 'must be start or end');
            if (sd.delay !== undefined && (!isNum(sd.delay) || Math.abs(sd.delay) > 5)) fail(`${sp}.delay`, 'must be -5 to 5 seconds');
            if (sd.volume !== undefined && (!isNum(sd.volume) || sd.volume < 0 || sd.volume > 2)) fail(`${sp}.volume`, 'must be 0 to 2');
            if (sd.pitch !== undefined && (!isNum(sd.pitch) || sd.pitch < 0.5 || sd.pitch > 2)) fail(`${sp}.pitch`, 'must be 0.5 to 2');
          }
        }
        if (clip.preset === 'keyframes' && isObj(clip.params) && clip.params.frames !== undefined) {
          const frames = clip.params.frames;
          if (!Array.isArray(frames) || frames.length > 200) fail(`${cp}.params.frames`, 'must be a list of at most 200 keyframes');
          else frames.forEach((f: unknown, k: number) => {
            const fp = `${cp}.params.frames[${k}]`;
            if (!isObj(f)) return fail(fp, 'must be an object');
            if (!isNum(f.t) || f.t < 0) fail(`${fp}.t`, 'must be 0 or more seconds into the clip');
            for (const key of KEYFRAME_PROPS) if (f[key] !== undefined && !isNum(f[key])) fail(`${fp}.${key}`, 'must be a number');
            if (f.ease !== undefined && (typeof f.ease !== 'string' || !EASE_RE.test(f.ease))) fail(`${fp}.ease`, 'is not a valid easing name');
          });
        }
        if (clip.preset === 'code' && isObj(clip.params) && clip.params.code !== undefined
          && (typeof clip.params.code !== 'string' || clip.params.code.length > 20000)) fail(`${cp}.params.code`, 'must be text (20,000 characters at most)');
      });
    });
  };
  checkLayers(scene.layers, 'layers', 0);
  for (const f of flowRefs) {
    for (const id of [f.from, f.to]) if (typeof id === 'string' && id && !layerIds.has(id)) warnings.push(`${f.p}: no layer has the id "${id}", so the flow lines are not drawn.`);
  }

  return { ok: errors.length === 0, errors, warnings, scene };
}
