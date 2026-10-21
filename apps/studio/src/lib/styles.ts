import type { Clip, ClipSound, Layer, Scene, TextLayer } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { SFX_IDS } from '@unysonplus/scene-player/sfx';
import { readingTime } from '@unysonplus/scene-player/lint';

/**
 * Styles: ready looks a scene can be built from. A style is a palette, a type pairing, a motion
 * personality (which presets carry the headline, the supporting text and the shapes, and how they
 * ease), a pace and a sound palette. The same style drives four things:
 *   - "Apply to this scene": restyles colours and fonts, motion and sounds (each can be left out);
 *   - "New scene in this style": a starter scene to build on;
 *   - AI assist: the style is sent as art direction, and its colours and fonts are applied to the result;
 *   - "Save as style": your own scene becomes a style you can reuse.
 */

export interface StyleMove { preset: string; params?: Record<string, unknown> }

export interface SceneStyle {
  id: string;
  name: string;
  description: string;
  /** Made by the user from a scene (kept in this browser). */
  custom?: boolean;
  palette: {
    /** Any CSS background for the stage. */
    background: string;
    text: string;
    muted: string;
    accent: string;
    accent2?: string;
  };
  fonts: {
    heading: string;
    body: string;
    /** A stylesheet that loads both (Google Fonts). */
    href?: string;
    headingWeight: number;
    bodyWeight: number;
    /** Headlines in capitals. */
    uppercase?: boolean;
  };
  motion: {
    /** Clip lengths are multiplied by this: below 1 is snappier, above 1 calmer. */
    pace: number;
    headline: StyleMove;
    text: StyleMove;
    shape: StyleMove;
    exit: StyleMove;
    /**
     * Alternatives that keep a restyled scene's variety: layers that entered differently before still
     * do (each different original entrance gets the next move in [text, ...textAlt]).
     */
    textAlt?: StyleMove[];
    shapeAlt?: StyleMove[];
    easeIn: string;
    easeOut: string;
  };
  sounds: { enter: string; exit: string; hit: string; accent: string; density: 'none' | 'light' | 'normal' };
  /** Words for the starter scene. */
  sample: { kicker: string; headline: string; sub: string };
}

const gf = (q: string) => `https://fonts.googleapis.com/css2?${q}&display=swap`;

export const BUILT_IN_STYLES: SceneStyle[] = [
  {
    id: 'night', name: 'Night', description: 'Dark and confident: one bright green accent, tight heavy type, clean decisive motion.',
    palette: { background: 'radial-gradient(120% 90% at 50% 40%, #121a20 0%, #0a0d11 70%)', text: '#f4f6f8', muted: '#9fb0bd', accent: '#2ad38b', accent2: '#8b7bff' },
    fonts: { heading: 'Archivo', body: 'Archivo', href: gf('family=Archivo:wght@400;500;600;800'), headingWeight: 800, bodyWeight: 500 },
    motion: {
      pace: 1, headline: { preset: 'text-rise', params: { by: 'chars', stagger: 0.03 } }, text: { preset: 'text-rise', params: { by: 'words', stagger: 0.06 } },
      shape: { preset: 'grow', params: { axis: 'x', origin: 'start' } }, exit: { preset: 'fade', params: { y: -20 } }, textAlt: [{ preset: 'fade', params: { y: 16 } }, { preset: 'text-blur', params: { by: 'words', stagger: 0.06 } }], shapeAlt: [{ preset: 'pop', params: { from: 0.6 } }, { preset: 'wipe', params: { from: 'left' } }],
      easeIn: 'softLand', easeOut: 'accelExit',
    },
    sounds: { enter: 'whoosh', exit: 'whoosh-out', hit: 'impact', accent: 'chime', density: 'normal' },
    sample: { kicker: 'Introducing', headline: 'Make it move.', sub: 'Motion that lands, holds and leaves on time.' },
  },
  {
    id: 'clean', name: 'Clean', description: 'Light, corporate and calm: navy type on white, a blue accent, quiet fades and wipes.',
    palette: { background: '#ffffff', text: '#0f1b2d', muted: '#5b6b80', accent: '#2563eb', accent2: '#14b8a6' },
    fonts: { heading: 'Inter', body: 'Inter', href: gf('family=Inter:wght@400;500;700'), headingWeight: 700, bodyWeight: 400 },
    motion: {
      pace: 1.1, headline: { preset: 'text-rise', params: { by: 'words', stagger: 0.08 } }, text: { preset: 'fade', params: { y: 16 } },
      shape: { preset: 'wipe', params: { from: 'left' } }, exit: { preset: 'fade', params: { y: -12 } }, textAlt: [{ preset: 'slide', params: { from: 'bottom', distance: 40 } }, { preset: 'text-rise', params: { by: 'words', stagger: 0.06 } }], shapeAlt: [{ preset: 'fade', params: { y: 16 } }, { preset: 'grow', params: { axis: 'x', origin: 'start' } }],
      easeIn: 'glide', easeOut: 'gentleIn',
    },
    sounds: { enter: 'swish', exit: 'whoosh-out', hit: 'soft-pop', accent: 'chime', density: 'light' },
    sample: { kicker: 'Quarterly update', headline: 'Growth you can see.', sub: 'Clear numbers, calmly told.' },
  },
  {
    id: 'kinetic', name: 'Kinetic', description: 'Loud and fast: condensed capitals, yellow on black, slams and hard cuts.',
    palette: { background: '#0b0b0b', text: '#ffffff', muted: '#a3a3a3', accent: '#ffe100', accent2: '#ff3d3d' },
    fonts: { heading: 'Anton', body: 'Archivo', href: gf('family=Anton&family=Archivo:wght@500;600'), headingWeight: 400, bodyWeight: 600, uppercase: true },
    motion: {
      pace: 0.8, headline: { preset: 'text-slam', params: { scale: 2.4, blur: 1.2 } }, text: { preset: 'slide', params: { from: 'bottom', distance: 60 } },
      shape: { preset: 'grow', params: { axis: 'x', origin: 'start' } }, exit: { preset: 'wipe', params: { from: 'left' } }, textAlt: [{ preset: 'text-stretch', params: { stagger: 0.04 } }, { preset: 'wipe', params: { from: 'left' } }], shapeAlt: [{ preset: 'slide', params: { from: 'left', distance: 80 } }, { preset: 'pop', params: { from: 0.4 } }],
      easeIn: 'snapSettle', easeOut: 'crashOut',
    },
    sounds: { enter: 'whoosh', exit: 'swish', hit: 'impact', accent: 'sub-hit', density: 'normal' },
    sample: { kicker: 'Drop 04', headline: 'Run louder.', sub: 'Out now. Limited run.' },
  },
  {
    id: 'pastel', name: 'Pastel', description: 'Soft and warm: a serif headline, peach and sage on cream, slow blurs and gentle floats.',
    palette: { background: 'linear-gradient(160deg, #fbf3ea 0%, #f3e6f0 100%)', text: '#3b2a40', muted: '#8a7690', accent: '#e8836f', accent2: '#8fb8a8' },
    fonts: { heading: 'DM Serif Display', body: 'DM Sans', href: gf('family=DM+Serif+Display&family=DM+Sans:wght@400;500'), headingWeight: 400, bodyWeight: 500 },
    motion: {
      pace: 1.3, headline: { preset: 'text-blur', params: { by: 'words', stagger: 0.12 } }, text: { preset: 'text-rise', params: { by: 'words', stagger: 0.08 } },
      shape: { preset: 'pop', params: { from: 0.7 } }, exit: { preset: 'fade', params: { y: 0, blur: 0.6 } }, textAlt: [{ preset: 'fade', params: { y: 14, blur: 0.4 } }, { preset: 'text-blur', params: { by: 'words', stagger: 0.1 } }], shapeAlt: [{ preset: 'fade', params: { y: 0, scale: 0.9 } }, { preset: 'grow', params: { axis: 'x', origin: 'center' } }],
      easeIn: 'glide', easeOut: 'gentleIn',
    },
    sounds: { enter: 'swell', exit: 'whoosh-out', hit: 'soft-pop', accent: 'sparkle', density: 'light' },
    sample: { kicker: 'Spring studio', headline: 'Breathe in.', sub: 'Slow mornings, soft light, open doors.' },
  },
  {
    id: 'neon', name: 'Neon', description: 'Tech and code: cyan and magenta on deep navy, a mono supporting font, scrambles and typing.',
    palette: { background: 'radial-gradient(110% 90% at 30% 20%, #0b1026 0%, #05060f 75%)', text: '#e6f1ff', muted: '#7d8bb0', accent: '#22d3ee', accent2: '#e879f9' },
    fonts: { heading: 'Space Grotesk', body: 'JetBrains Mono', href: gf('family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500'), headingWeight: 700, bodyWeight: 400 },
    motion: {
      pace: 0.9, headline: { preset: 'text-scramble' }, text: { preset: 'text-typewriter' },
      shape: { preset: 'blinds', params: { from: 'top', count: 6, stagger: 0.5 } }, exit: { preset: 'fade', params: { y: 0, blur: 0.8 } }, textAlt: [{ preset: 'text-scramble' }, { preset: 'fade', params: { y: 0, blur: 0.6 } }], shapeAlt: [{ preset: 'wipe', params: { from: 'left' } }, { preset: 'grow', params: { axis: 'x', origin: 'start' } }],
      easeIn: 'whip', easeOut: 'accelExit',
    },
    sounds: { enter: 'glitch', exit: 'whoosh-out', hit: 'thud', accent: 'beep', density: 'normal' },
    sample: { kicker: 'v2.0 is live', headline: 'Ship faster.', sub: '> npm install the-future' },
  },
  {
    id: 'editorial', name: 'Editorial', description: 'Magazine pages: a classic serif, one red accent on paper, measured wipes and tracking.',
    palette: { background: '#f6f3ee', text: '#141414', muted: '#6b6560', accent: '#c8102e' },
    fonts: { heading: 'Playfair Display', body: 'Inter', href: gf('family=Playfair+Display:wght@700&family=Inter:wght@400;500'), headingWeight: 700, bodyWeight: 400 },
    motion: {
      pace: 1.15, headline: { preset: 'text-tracking', params: { from: -0.4 } }, text: { preset: 'soft-wipe', params: { from: 'left', feather: 25 } },
      shape: { preset: 'wipe', params: { from: 'left' } }, exit: { preset: 'soft-wipe', params: { from: 'left', feather: 25 } }, textAlt: [{ preset: 'fade', params: { y: 10 } }, { preset: 'text-rise', params: { by: 'words', stagger: 0.07 } }], shapeAlt: [{ preset: 'grow', params: { axis: 'x', origin: 'start' } }, { preset: 'fade', params: { y: 10 } }],
      easeIn: 'softInOut', easeOut: 'gentleIn',
    },
    sounds: { enter: 'swish', exit: 'swish', hit: 'tap', accent: 'chime', density: 'light' },
    sample: { kicker: 'The long read', headline: 'Slow is a style.', sub: 'Notes on making less, better.' },
  },
  {
    id: 'playful', name: 'Playful', description: 'Friendly and bouncy: rounded type, pink and mint on cream, pops and flips.',
    palette: { background: '#fff7e0', text: '#1f2050', muted: '#6a6b9a', accent: '#ff5c8a', accent2: '#3ec7a6' },
    fonts: { heading: 'Fredoka', body: 'Nunito', href: gf('family=Fredoka:wght@600;700&family=Nunito:wght@500;600'), headingWeight: 700, bodyWeight: 600 },
    motion: {
      pace: 0.9, headline: { preset: 'text-flip', params: { by: 'chars', stagger: 0.04 } }, text: { preset: 'text-rise', params: { by: 'words', stagger: 0.07 } },
      shape: { preset: 'pop', params: { from: 0.5 } }, exit: { preset: 'pop', params: {} }, textAlt: [{ preset: 'pop', params: { from: 0.6 } }, { preset: 'slide', params: { from: 'bottom', distance: 50 } }], shapeAlt: [{ preset: 'spin', params: { turns: 0.25 } }, { preset: 'grow', params: { axis: 'x', origin: 'center' } }],
      easeIn: 'popOver', easeOut: 'accelExit',
    },
    sounds: { enter: 'pop', exit: 'whoosh-out', hit: 'thud', accent: 'success', density: 'normal' },
    sample: { kicker: 'New flavours', headline: 'Say yum!', sub: 'Three new scoops, all summer long.' },
  },
  {
    id: 'luxe', name: 'Luxe', description: 'Quiet luxury: an elegant serif, gold on black, slow reveals and a single sheen.',
    palette: { background: 'radial-gradient(120% 90% at 50% 40%, #17130c 0%, #090806 75%)', text: '#f5efe3', muted: '#b3a68c', accent: '#d4b26a' },
    fonts: { heading: 'Cormorant Garamond', body: 'Montserrat', href: gf('family=Cormorant+Garamond:wght@600&family=Montserrat:wght@400;500'), headingWeight: 600, bodyWeight: 400 },
    motion: {
      pace: 1.35, headline: { preset: 'text-blur', params: { by: 'chars', stagger: 0.04 } }, text: { preset: 'fade', params: { y: 10 } },
      shape: { preset: 'grow', params: { axis: 'x', origin: 'center' } }, exit: { preset: 'fade', params: { y: 0, blur: 0.5 } }, textAlt: [{ preset: 'soft-wipe', params: { from: 'left', feather: 35 } }, { preset: 'text-rise', params: { by: 'words', stagger: 0.1 } }], shapeAlt: [{ preset: 'fade', params: { y: 0, scale: 1.05 } }, { preset: 'soft-wipe', params: { from: 'left', feather: 35 } }],
      easeIn: 'glide', easeOut: 'gentleIn',
    },
    sounds: { enter: 'swell', exit: 'whoosh-out', hit: 'sub-hit', accent: 'shimmer', density: 'light' },
    sample: { kicker: 'Maison', headline: 'Made to last.', sub: 'Hand-finished, one at a time.' },
  },
];

/* ---------------------------------------------------------------- colours */

let probe: CanvasRenderingContext2D | null = null;
/** A CSS colour as [r, g, b, a] (0-255, alpha 0-1), or null if it isn't one. */
function rgba(css: string): [number, number, number, number] | null {
  if (typeof document === 'undefined') return null;
  probe ??= document.createElement('canvas').getContext('2d');
  if (!probe) return null;
  probe.fillStyle = '#010203';
  probe.fillStyle = css;
  const v = String(probe.fillStyle);
  if (v === '#010203' && css.trim().toLowerCase() !== '#010203') return null;
  if (v.startsWith('#')) return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
  const m = /rgba?\(([^)]+)\)/.exec(v);
  if (!m) return null;
  const p = m[1].split(',').map((x) => parseFloat(x));
  return [p[0], p[1], p[2], p[3] ?? 1];
}

function hsl([r, g, b]: [number, number, number, number]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  return { s, l };
}

type Role = 'text' | 'muted' | 'surface' | 'accent' | 'accent2' | 'keep';

/** Matches colour tokens inside any CSS value (a colour, a gradient, a background). */
const COLOR_TOKEN = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black)\b/g;

/**
 * Maps the colours of a scene to a style's palette. Saturated colours become the accent (the first
 * distinct one) and the second accent (the next); neutral colours become the text, the muted colour or a
 * surface (cards, panels) by how much they stood out from the scene's ORIGINAL background. Transparent
 * colours keep their transparency.
 */
class ColourMapper {
  private accents: string[] = [];
  private fromL: number;
  constructor(private style: SceneStyle, originalBackground: string | undefined) {
    const bg = rgba(firstColour(originalBackground ?? '') ?? '#0a0d11');
    this.fromL = bg ? hsl(bg).l : 0;
  }

  role(css: string): Role {
    const c = rgba(css);
    if (!c || c[3] === 0) return 'keep';
    const { s, l } = hsl(c);
    if (s > 0.35 && l > 0.15 && l < 0.88) {
      const key = `${Math.round(c[0] / 24)}-${Math.round(c[1] / 24)}-${Math.round(c[2] / 24)}`;
      if (!this.accents.includes(key)) this.accents.push(key);
      return this.accents.indexOf(key) % 2 === 1 && this.style.palette.accent2 ? 'accent2' : 'accent';
    }
    const diff = Math.abs(l - this.fromL);
    return diff > 0.45 ? 'text' : diff > 0.18 ? 'muted' : 'surface';
  }

  /** A panel colour for the style: its text colour faintly over its background. */
  private surface(): string {
    const bg = firstColour(this.style.palette.background) ?? '#000000';
    return `color-mix(in srgb, ${this.style.palette.text} 9%, ${bg})`;
  }

  colour(css: string): string {
    const role = this.role(css);
    if (role === 'keep') return css;
    const target = role === 'accent2' ? this.style.palette.accent2! : role === 'surface' ? this.surface() : this.style.palette[role];
    const c = rgba(css);
    if (c && c[3] < 1) {
      const t = rgba(target);
      if (t) return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${Math.round(c[3] * 100) / 100})`;
    }
    return target;
  }

  /** Every colour inside a CSS value (gradients included). */
  value(css: string | undefined): string | undefined {
    if (!css || css === 'transparent' || css === 'none') return css;
    return css.replace(COLOR_TOKEN, (tok) => this.colour(tok));
  }
}

const firstColour = (css: string) => (css.match(COLOR_TOKEN) ?? [])[0];

/* ---------------------------------------------------------------- applying */

const walkLayers = (list: Layer[], fn: (l: Layer, depth: number) => Layer, depth = 0): Layer[] =>
  list.map((l) => {
    const next = fn(l, depth);
    return next.type === 'group' ? { ...next, layers: walkLayers(next.layers, fn, depth + 1) } : next;
  });

function allText(list: Layer[]): TextLayer[] {
  return list.flatMap((l) => (l.type === 'text' ? [l] : l.type === 'group' ? allText(l.layers) : []));
}

/**
 * The headline layers: in each top-level group (an act, a slide), and among the loose top-level layers,
 * the text at least three quarters the size of the biggest text there.
 */
function headlineIds(scene: Scene): Set<string> {
  const out = new Set<string>();
  const mark = (texts: TextLayer[]) => {
    const top = Math.max(0, ...texts.map((t) => t.style.fontSize));
    texts.filter((t) => t.style.fontSize >= top * 0.75).forEach((t) => out.add(t.id));
  };
  for (const l of scene.layers) if (l.type === 'group') mark(allText(l.layers));
  mark(scene.layers.filter((l): l is TextLayer => l.type === 'text'));
  return out;
}

const dirOf = (c: Clip): 'in' | 'out' | null => {
  const meta = presetMeta[c.preset];
  if (!meta) return null;
  if (!meta.fields.some((f) => f.key === 'direction')) return meta.category === 'text' ? 'in' : null;
  const d = c.params && 'direction' in c.params ? c.params.direction : meta.defaults.direction;
  return d === 'out' ? 'out' : 'in';
};

/** Entrance and exit categories a style may restyle (emphasis, ambient, 3D, keyframes and code stay). */
const RESTYLE = new Set(['text', 'reveal', 'motion']);

const fits = (preset: string, layer: Layer) => !!presetMeta[preset]?.appliesTo.includes(layer.type);

/** Clip settings carried over from the original clip when the style's preset has them too. */
const KEEP_PARAMS = ['stagger', 'from', 'distance', 'axis', 'origin'];

type Chooser = (kind: 'text' | 'shape', original: Clip, layer: Layer) => StyleMove;

function restyleClip(c: Clip, layer: Layer, headline: boolean, style: SceneStyle, nextStart: number, choose: Chooser): Clip {
  const meta = presetMeta[c.preset];
  if (!meta || !RESTYLE.has(meta.category) || c.preset === 'keyframes' || c.preset === 'code' || c.preset === 'text-count' || c.preset === 'text-swap') return c;
  const dir = dirOf(c);
  if (!dir) return c;
  const move = dir === 'out' ? style.motion.exit : layer.type === 'text' && headline ? style.motion.headline : choose(layer.type === 'text' ? 'text' : 'shape', c, layer);
  if (!fits(move.preset, layer)) return c;
  const target = presetMeta[move.preset];
  const hasDir = target.fields.some((f) => f.key === 'direction');
  // An exit needs a preset that can play out.
  if (dir === 'out' && !hasDir) return c;
  const params: Record<string, unknown> = { ...(move.params ?? {}) };
  // Keep the author's rhythm and direction where the new preset has the same setting.
  for (const key of KEEP_PARAMS) {
    const v = c.params?.[key];
    const field = target.fields.find((f) => f.key === key);
    if (v === undefined || !field) continue;
    if (field.type === 'select' ? field.options.some((o) => o.value === v) : field.type === 'number' ? typeof v === 'number' : false) params[key] = v;
  }
  if (hasDir) params.direction = dir;
  // Pace stretches or tightens entrances; an exit never gets longer, because the next thing on the stage
  // is timed to its end.
  // Text keeps its entrance length too: a longer entrance would eat into the time it stays readable.
  const scale = dir === 'out' || layer.type === 'text' ? Math.min(1, style.motion.pace) : style.motion.pace;
  const duration = Math.max(0.15, Math.min(Math.round(c.duration * scale * 100) / 100, Math.max(0.15, nextStart - c.start)));
  const out: Clip = { ...c, preset: move.preset, params, duration, ease: dir === 'out' ? style.motion.easeOut : style.motion.easeIn };
  return out;
}

function restyleSound(c: Clip, style: SceneStyle, headline: boolean): Clip {
  if (!c.sound) return c;
  if (style.sounds.density === 'none') { const { sound: _s, ...rest } = c; return rest; }
  const meta = presetMeta[c.preset];
  const dir = dirOf(c);
  const name = dir === 'out' ? style.sounds.exit
    : meta?.category === 'emphasis' ? style.sounds.accent
      : c.sound.at === 'end' || headline ? style.sounds.hit : style.sounds.enter;
  const sound: ClipSound = { ...c.sound, name: SFX_IDS.includes(name) ? name : c.sound.name };
  return { ...c, sound };
}

export interface ApplyParts { look: boolean; motion: boolean; sound: boolean }

/** Restyles a scene: colours and fonts, motion, and sounds, each optional. Text and timing stay. */
export function applyStyle(scene: Scene, style: SceneStyle, parts: ApplyParts): Scene {
  const map = new ColourMapper(style, scene.stage.background);
  const heads = headlineIds(scene);
  let next: Scene = scene;

  if (parts.look) {
    const fonts = style.fonts.href
      ? [{ family: style.fonts.heading, href: style.fonts.href }, ...(style.fonts.body !== style.fonts.heading ? [{ family: style.fonts.body }] : [])]
      : [];
    next = {
      ...next,
      stage: { ...next.stage, background: style.palette.background, fonts: fonts.length ? fonts : next.stage.fonts },
      layers: walkLayers(next.layers, (l) => {
        if (l.type === 'text') {
          const head = heads.has(l.id);
          return {
            ...l,
            style: {
              ...l.style,
              fontFamily: head ? style.fonts.heading : style.fonts.body,
              fontWeight: head ? style.fonts.headingWeight : (l.style.fontWeight ?? 400) >= 600 && !head ? Math.max(style.fonts.bodyWeight, 500) : style.fonts.bodyWeight,
              uppercase: head ? !!style.fonts.uppercase || undefined : l.style.uppercase,
              color: map.value(l.style.color ?? '#ffffff'),
            },
          };
        }
        if (l.type === 'shape') return { ...l, fill: map.value(l.fill), stroke: map.value(l.stroke) };
        if (l.type === 'model') return { ...l, material: { ...(l.material ?? {}), color: style.palette.accent } };
        return l;
      }),
    };
    // Colours inside clip settings (Recolour's target, particle colours, gradients).
    next = {
      ...next,
      layers: walkLayers(next.layers, (l) => ({
        ...l,
        clips: l.clips.map((c) => {
          if (!c.params) return c;
          let changed = false;
          const params: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(c.params)) {
            if (typeof v === 'string' && k !== 'code' && k !== 'charset' && COLOR_TOKEN.test(v)) { params[k] = map.value(v); changed = true; } else params[k] = v;
            COLOR_TOKEN.lastIndex = 0;
          }
          return changed ? { ...c, params } : c;
        }),
      }) as Layer),
    };
  }

  // Each distinct original entrance (preset and settings) gets the next move in the style's list, so a
  // scene that varied its entrances still does after restyling.
  const assigned = { text: new Map<string, number>(), shape: new Map<string, number>() };
  const choose: Chooser = (kind, original, layer) => {
    const list = kind === 'text' ? [style.motion.text, ...(style.motion.textAlt ?? [])] : [style.motion.shape, ...(style.motion.shapeAlt ?? [])];
    const { direction: _d, ...rest } = original.params ?? {};
    const key = `${original.preset}|${JSON.stringify(rest)}`;
    const m = assigned[kind];
    if (!m.has(key)) m.set(key, m.size);
    for (let i = 0; i < list.length; i++) {
      const pick = list[(m.get(key)! + i) % list.length];
      if (fits(pick.preset, layer)) return pick;
    }
    return list[0];
  };

  if (parts.motion || parts.sound) {
    next = {
      ...next,
      layers: walkLayers(next.layers, (l) => {
        const sorted = [...l.clips].sort((a, b) => a.start - b.start);
        return {
          ...l,
          clips: l.clips.map((c) => {
            const after = sorted.find((x) => x.start > c.start + 1e-3);
            let out = c;
            if (parts.motion) out = restyleClip(out, l, heads.has(l.id), style, after ? after.start : Infinity, choose);
            if (parts.sound) out = restyleSound(out, style, heads.has(l.id));
            return out;
          }),
        } as Layer;
      }),
    };
  }
  return next;
}

/* ---------------------------------------------------------------- starter scene */

/** A title card in the style: kicker, headline, a line under it and a supporting line. */
export function starterScene(style: SceneStyle, base?: Scene): Scene {
  const p = style.motion.pace;
  const t = (s: number) => Math.round(s * p * 100) / 100;
  const snd = (name: string, extra: Partial<ClipSound> = {}): { sound?: ClipSound } =>
    style.sounds.density === 'none' ? {} : { sound: { name, ...extra } };
  const light = style.sounds.density === 'light';
  const move = (m: StyleMove, dir: 'in' | 'out') => {
    const meta = presetMeta[m.preset];
    const params = { ...(m.params ?? {}), ...(meta?.fields.some((f) => f.key === 'direction') ? { direction: dir } : {}) };
    return { preset: m.preset, params };
  };
  // Everything leaves once the supporting line (the last to land) has been up long enough to read.
  const subLands = t(1.8) + t(0.9);
  const exitAt = Math.round(Math.max(t(4.6), subLands + readingTime(style.sample.sub) + 0.4) * 100) / 100;
  const exit = (id: string, layerType: Layer['type']): Clip[] => {
    const m = move(style.motion.exit, 'out');
    if (!fits(m.preset, { type: layerType } as Layer)) return [];
    return [{ id, ...m, start: exitAt, duration: t(0.5), ease: style.motion.easeOut }];
  };
  const duration = Math.round((exitAt + t(0.5) + 0.3) * 10) / 10;
  const heading = { fontFamily: style.fonts.heading, fontWeight: style.fonts.headingWeight, uppercase: style.fonts.uppercase || undefined };
  const body = { fontFamily: style.fonts.body, fontWeight: style.fonts.bodyWeight };
  const bps = base?.stage.breakpoints ?? [
    { id: 'desktop', label: 'Desktop', minWidth: 1024, aspect: [16, 9] as [number, number] },
    { id: 'tablet', label: 'Tablet', minWidth: 640, aspect: [4, 3] as [number, number] },
    { id: 'mobile', label: 'Mobile', minWidth: 0, aspect: [4, 5] as [number, number] },
  ];
  const mobile = bps.find((b) => b.aspect[0] / b.aspect[1] < 1)?.id;
  const tablet = bps.find((b) => b.aspect[0] / b.aspect[1] >= 1 && b.aspect[0] / b.aspect[1] < 1.6)?.id;
  const ov = (m: { fontSize?: number; y?: number; w?: number }, tb?: { fontSize?: number; y?: number; w?: number }) => {
    const o: NonNullable<Layer['overrides']> = {};
    const one = (v: { fontSize?: number; y?: number; w?: number }) => ({
      ...(v.fontSize ? { style: { fontSize: v.fontSize } } : {}),
      ...(v.y !== undefined || v.w !== undefined ? { box: { ...(v.y !== undefined ? { y: v.y } : {}), ...(v.w !== undefined ? { w: v.w } : {}) } } : {}),
    });
    if (mobile) o[mobile] = one(m);
    if (tablet && tb) o[tablet] = one(tb);
    return o;
  };
  const head = move(style.motion.headline, 'in');
  const text = move(style.motion.text, 'in');
  const shape = move(style.motion.shape, 'in');

  return {
    format: 'unysonplus-scene', version: 1, title: `${style.name} title`, duration,
    stage: {
      breakpoints: bps, heightMode: base?.stage.heightMode ?? 'ratio-capped', background: style.palette.background, safeArea: 0.06,
      fonts: style.fonts.href ? [{ family: style.fonts.heading, href: style.fonts.href }, ...(style.fonts.body !== style.fonts.heading ? [{ family: style.fonts.body }] : [])] : undefined,
    },
    playback: { trigger: 'view', loop: true, repeatDelay: 0.5, posterTime: t(2.4) },
    layers: [
      {
        id: 'glow', name: 'Glow', type: 'shape', shape: 'ellipse', box: { x: 50, y: 50, w: 70, ratio: 1.6 }, opacity: 0.18,
        fill: `radial-gradient(closest-side, ${style.palette.accent} 0%, transparent 100%)`,
        clips: [{ id: 'glow-in', preset: 'fade', start: 0, duration: t(1.2), params: { y: 0, scale: 0.8 } }, { id: 'glow-drift', preset: 'drift', start: t(1.2), duration: Math.max(0.5, exitAt - t(1.2)), params: { x: 0, y: -2, scale: 1.08 } }],
        overrides: ov({ w: 120 }),
      },
      {
        id: 'kicker', name: 'Kicker', type: 'text', text: style.sample.kicker, box: { x: 50, y: 28 },
        style: { ...body, fontSize: 1.4, fontWeight: Math.max(style.fonts.bodyWeight, 500), letterSpacing: 0.3, uppercase: true, color: style.palette.accent, align: 'center' },
        clips: [{ id: 'kicker-in', ...text, preset: fits(text.preset, { type: 'text' } as Layer) ? text.preset : 'fade', start: 0.2, duration: t(0.7), ease: style.motion.easeIn }, ...exit('kicker-out', 'text')],
        overrides: ov({ fontSize: 3.6, y: 24 }, { fontSize: 2 }),
      },
      {
        id: 'headline', name: 'Headline', type: 'text', text: style.sample.headline, box: { x: 50, y: 46, w: 84 },
        style: { ...heading, fontSize: 9, lineHeight: 1.02, color: style.palette.text, align: 'center' },
        clips: [{ id: 'headline-in', ...head, start: t(0.5), duration: t(0.9), ease: style.motion.easeIn, ...snd(style.sounds.hit, { at: 'end', delay: -0.15 }) }, ...exit('headline-out', 'text')],
        overrides: ov({ fontSize: 12.5, y: 42, w: 86 }, { fontSize: 11 }),
      },
      {
        id: 'rule', name: 'Line', type: 'shape', shape: 'rect', box: { x: 50, y: 62, w: 10, h: 0.7 }, fill: style.palette.accent, radius: 0.3,
        clips: [{ id: 'rule-in', ...shape, start: t(1.4), duration: t(0.6), ease: style.motion.easeIn, ...(light ? {} : snd(style.sounds.enter)) }, ...exit('rule-out', 'shape')],
        overrides: ov({ y: 57, w: 22 }),
      },
      {
        id: 'sub', name: 'Supporting line', type: 'text', text: style.sample.sub, box: { x: 50, y: 72, w: 70 },
        style: { ...body, fontSize: 2.2, color: style.palette.muted, align: 'center' },
        clips: [{ id: 'sub-in', ...text, start: t(1.8), duration: t(0.9), ease: style.motion.easeIn, ...snd(style.sounds.accent) }, ...exit('sub-out', 'text')],
        overrides: ov({ fontSize: 5, y: 68, w: 86 }, { fontSize: 3 }),
      },
    ],
  };
}

/* ---------------------------------------------------------------- saving your own */

const STORE = 'upw-studio-styles-v1';

export function loadCustomStyles(): SceneStyle[] {
  try {
    const raw = localStorage.getItem(STORE);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => s && typeof s.id === 'string' && s.palette && s.fonts && s.motion && s.sounds) : [];
  } catch {
    return [];
  }
}

export function saveCustomStyles(list: SceneStyle[]): boolean {
  try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch { return false; }
}

const mostCommon = <T,>(xs: T[]): T | undefined => {
  const n = new Map<T, number>();
  xs.forEach((x) => n.set(x, (n.get(x) ?? 0) + 1));
  return [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

/** A style taken from a scene: its colours, fonts, the presets it uses for each role and its sounds. */
export function styleFromScene(scene: Scene, name: string): SceneStyle {
  const base = BUILT_IN_STYLES[0];
  const texts = allText(scene.layers);
  const heads = headlineIds(scene);
  const headTexts = texts.filter((t) => heads.has(t.id));
  const bodyTexts = texts.filter((t) => !heads.has(t.id));
  const saturated = (c?: string) => { const v = c && rgba(c); if (!v) return false; const { s, l } = hsl(v); return s > 0.35 && l > 0.15 && l < 0.88; };
  const colours = [...texts.map((t) => t.style.color), ...flat(scene.layers).flatMap((l) => (l.type === 'shape' ? [firstColour(l.fill ?? '')] : []))].filter(Boolean) as string[];
  const accents = [...new Set(colours.filter(saturated))];
  const clipsOf = (pred: (l: Layer) => boolean, dir: 'in' | 'out') => flat(scene.layers).filter(pred).flatMap((l) => l.clips.filter((c) => dirOf(c) === dir && RESTYLE.has(presetMeta[c.preset]?.category ?? '')));
  const pick = (cs: Clip[], fallback: StyleMove): StyleMove => {
    const id = mostCommon(cs.map((c) => c.preset));
    if (!id) return fallback;
    const c = cs.find((x) => x.preset === id)!;
    const { direction: _d, ...params } = c.params ?? {};
    return { preset: id, params };
  };
  const allClips = flat(scene.layers).flatMap((l) => l.clips);
  const sounds = allClips.filter((c) => c.sound);
  const fontHref = scene.stage.fonts?.find((f) => f.href)?.href;
  return {
    id: `custom-${Date.now().toString(36)}`, name, custom: true,
    description: `Saved from “${scene.title || 'a scene'}”.`,
    palette: {
      background: scene.stage.background ?? base.palette.background,
      text: mostCommon(headTexts.map((t) => t.style.color).filter((c): c is string => !!c && !saturated(c))) ?? base.palette.text,
      muted: mostCommon(bodyTexts.map((t) => t.style.color).filter((c): c is string => !!c && !saturated(c))) ?? base.palette.muted,
      accent: accents[0] ?? base.palette.accent,
      accent2: accents[1],
    },
    fonts: {
      heading: mostCommon(headTexts.map((t) => t.style.fontFamily).filter((f): f is string => !!f)) ?? base.fonts.heading,
      body: mostCommon(bodyTexts.map((t) => t.style.fontFamily).filter((f): f is string => !!f)) ?? base.fonts.body,
      href: fontHref,
      headingWeight: mostCommon(headTexts.map((t) => t.style.fontWeight ?? 700)) ?? 700,
      bodyWeight: mostCommon(bodyTexts.map((t) => t.style.fontWeight ?? 400)) ?? 400,
      uppercase: headTexts.some((t) => t.style.uppercase) || undefined,
    },
    motion: {
      pace: 1,
      headline: pick(clipsOf((l) => heads.has(l.id), 'in'), base.motion.headline),
      text: pick(clipsOf((l) => l.type === 'text' && !heads.has(l.id), 'in'), base.motion.text),
      shape: pick(clipsOf((l) => l.type !== 'text', 'in'), base.motion.shape),
      exit: pick(clipsOf(() => true, 'out'), base.motion.exit),
      easeIn: mostCommon(allClips.filter((c) => dirOf(c) === 'in' && c.ease).map((c) => c.ease!)) ?? base.motion.easeIn,
      easeOut: mostCommon(allClips.filter((c) => dirOf(c) === 'out' && c.ease).map((c) => c.ease!)) ?? base.motion.easeOut,
    },
    sounds: {
      enter: mostCommon(sounds.filter((c) => dirOf(c) === 'in' && c.sound!.at !== 'end').map((c) => c.sound!.name)) ?? base.sounds.enter,
      exit: mostCommon(sounds.filter((c) => dirOf(c) === 'out').map((c) => c.sound!.name)) ?? base.sounds.exit,
      hit: mostCommon(sounds.filter((c) => c.sound!.at === 'end').map((c) => c.sound!.name)) ?? base.sounds.hit,
      accent: mostCommon(sounds.filter((c) => presetMeta[c.preset]?.category === 'emphasis').map((c) => c.sound!.name)) ?? base.sounds.accent,
      density: sounds.length === 0 ? 'none' : sounds.length / Math.max(1, scene.duration) > 0.4 ? 'normal' : 'light',
    },
    sample: {
      kicker: bodyTexts.find((t) => t.style.uppercase)?.text.split('\n')[0].slice(0, 30) ?? 'Introducing',
      headline: headTexts[0]?.text.split('\n')[0].slice(0, 30) ?? 'Make it move.',
      sub: bodyTexts.find((t) => !t.style.uppercase)?.text.split('\n')[0].slice(0, 60) ?? 'A line that supports the headline.',
    },
  };
}

function flat(list: Layer[]): Layer[] {
  return list.flatMap((l) => (l.type === 'group' ? [l, ...flat(l.layers)] : [l]));
}

/* ---------------------------------------------------------------- AI */

/** The style as art direction for the AI (added to the motion rules). */
export function styleBrief(style: SceneStyle): string {
  const m = style.motion;
  const mv = (x: StyleMove) => `${x.preset}${x.params && Object.keys(x.params).length ? ` ${JSON.stringify(x.params)}` : ''}`;
  return `STYLE: "${style.name}" (follow it unless the request says otherwise). ${style.description}
- Stage background: ${style.palette.background}. Colours: text ${style.palette.text}, secondary text ${style.palette.muted}, accent ${style.palette.accent}${style.palette.accent2 ? `, second accent ${style.palette.accent2}` : ''}. Use the accent sparingly, on what matters most.
- Fonts: headlines "${style.fonts.heading}" weight ${style.fonts.headingWeight}${style.fonts.uppercase ? ' in capitals' : ''}; other text "${style.fonts.body}" weight ${style.fonts.bodyWeight}.${style.fonts.href ? ` Set stage.fonts to [{ "family": "${style.fonts.heading}", "href": "${style.fonts.href}" }].` : ''}
- Motion: headlines enter with ${mv(m.headline)}, other text with ${mv(m.text)}, shapes with ${mv(m.shape)}; exits use ${mv(m.exit)}. Entrances ease "${m.easeIn}", exits "${m.easeOut}". Pace ${m.pace < 0.95 ? 'snappy: shorter moves and tighter gaps' : m.pace > 1.15 ? 'calm: longer moves and more breathing room' : 'steady'}. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: ${style.sounds.density === 'none' ? 'none.' : `${style.sounds.density === 'light' ? 'a few, only the key moments' : 'on the key moments'}: entrances "${style.sounds.enter}", exits "${style.sounds.exit}", landings "${style.sounds.hit}", accents "${style.sounds.accent}".`}`;
}
