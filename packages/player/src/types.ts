/**
 * The scene file, version 1.
 *
 * A scene is a stage (its shape per breakpoint and how tall it may grow), a list of layers drawn
 * bottom to top, and on each layer the clips that animate it. Every length on the stage is relative
 * to the stage itself, so a scene draws the same at any size:
 *   - box x / w are percentages of the stage width, y / h of the stage height;
 *   - font sizes, stroke widths and radii are in "stage units" (1 = 1% of the stage width).
 */

export const SCENE_FORMAT = 'unysonplus-scene';
export const SCENE_VERSION = 1;

export interface Scene {
  format: typeof SCENE_FORMAT;
  version: number;
  title?: string;
  /** Length of one play-through, in seconds. */
  duration: number;
  stage: Stage;
  playback: Playback;
  layers: Layer[];
  /**
   * Points on the timeline, in seconds. With playback.advance "click" the scene stops at each one and
   * waits for a click, a tap or the arrow keys: a presentation.
   */
  markers?: Marker[];
  /** Sound: voice-overs, music and effects on the timeline. Silent until the visitor turns sound on. */
  audio?: AudioClip[];
  /** The camera: keyframes that pan, zoom, roll and tilt the view over every layer (see camera.ts). */
  camera?: { keys: CameraKey[] };
  /** How the scene's words reach search engines and screen readers (see transcript.ts). */
  transcript?: TranscriptSettings;
}

export interface CameraKey {
  id: string;
  /** Seconds from the start of the scene. */
  t: number;
  /** Pan: the view's centre moves this far right / down, in % of the stage (-100 to 100). */
  x?: number;
  y?: number;
  /** 1 = as laid out; 2 = twice as close. */
  zoom?: number;
  /** Rotation of the view, in degrees. */
  roll?: number;
  /** Perspective tilt in degrees: tiltX leans the top away (positive) or towards you; tiltY turns left/right. */
  tiltX?: number;
  tiltY?: number;
  /** The curve of the move INTO this key (a named ease or cubic(...)). */
  ease?: string;
}

export interface TranscriptSettings {
  /** What the headline becomes: a heading of this level, or a paragraph. Defaults to h2. */
  headline?: 'h1' | 'h2' | 'h3' | 'p';
  /** Decoration only: no transcript, and the scene is hidden from screen readers. */
  decorative?: boolean;
}

export interface AudioClip {
  id: string;
  name?: string;
  /**
   * An audio file: a data: URL (uploaded) or an https address (must allow loading from other sites).
   * Or a built-in sound: "sfx:<name>", optionally with a pitch, "sfx:pop@1.2".
   */
  src: string;
  /** Seconds from the start of the scene. */
  start: number;
  /** Seconds into the file where the clip begins (trims the start). */
  offset?: number;
  /** How long the clip plays, in seconds; defaults to the rest of the file. */
  duration?: number;
  /** 0 to 2 (1 = as recorded). */
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  role?: 'voice' | 'music' | 'sfx';
  /**
   * The spoken words (from transcription), timed from the start of the FILE, so moving or trimming the
   * clip keeps them in place: a word plays at start + (t - offset).
   */
  words?: SpokenWord[];
  /** How the recording is delivered, from the same analysis. */
  speech?: SpeechInfo;
}

export interface SpokenWord {
  /** The word as heard. */
  w: string;
  /** Seconds from the start of the file. */
  t: number;
  /** Seconds the word lasts. */
  d: number;
  /** Emphasis, 0 to 1 (loudness, pitch and length against the speaker's own average). */
  s?: number;
  /** Pause before the word, in seconds (only when noticeable). */
  p?: number;
}

export interface SpeechInfo {
  /** Language code, e.g. "en". */
  language?: string;
  /** Words per minute of speaking. */
  wpm?: number;
  pace?: 'slow' | 'steady' | 'brisk' | 'fast' | 'silent';
  /** Loudness range in dB, and pitch range in semitones (10th to 90th percentile). */
  dynamics?: number;
  pitchRange?: number;
  /** e.g. ["energetic"], ["calm"], ["expressive"], ["conversational"]. */
  delivery?: string[];
  /** The speech model used ("base", "small"). */
  model?: string;
}

export interface Marker {
  id: string;
  /** Seconds from the start of the scene. */
  t: number;
  label?: string;
}

export interface Stage {
  /** Checked widest first: the first whose minWidth fits the stage's width is used. */
  breakpoints: Breakpoint[];
  heightMode: HeightMode;
  /** Pixels taken from the window height in the capped and fill modes (a site header, for example). */
  heightOffset?: number;
  /**
   * When the stage is shorter than the shape (a wide, short window in the capped or fill modes):
   * cover (the default) keeps the full width and trims the top and bottom; contain shows the whole
   * shape, centred, with the stage's background (or the page, when it has none) at the sides.
   */
  fit?: 'cover' | 'contain';
  /** Any CSS background: a colour, a gradient or an image. */
  background?: string;
  /** Inset of the safe area on each side, as a fraction of the stage (0.05 = 5%). */
  safeArea?: number;
  fonts?: FontAsset[];
}

export interface Breakpoint {
  id: string;
  label?: string;
  /** Smallest stage width, in CSS pixels, this breakpoint applies to. */
  minWidth: number;
  /** Width and height of the stage shape, e.g. [16, 9]. */
  aspect: [number, number];
}

/**
 * ratio         Keep the shape; the page scrolls if the stage is taller than the window.
 * ratio-capped  Keep the shape, but never grow taller than the window (minus heightOffset).
 * fill          Exactly the window height (minus heightOffset), whatever the shape.
 */
export type HeightMode = 'ratio' | 'ratio-capped' | 'fill';

export interface FontAsset {
  family: string;
  /** A stylesheet that declares the font (for example a hosted web-font CSS link). */
  href?: string;
}

export interface Playback {
  /**
   * load: play as soon as the scene is ready. view: play when it scrolls into view. manual: never on its own.
   * scroll: the page's scroll position plays the scene forwards and backwards (see `scroll`).
   */
  trigger: 'load' | 'view' | 'manual' | 'scroll';
  /** Ignored when the trigger is scroll. */
  loop: boolean;
  /** Scroll trigger settings. */
  scroll?: ScrollSettings;
  /** Pause between loops, in seconds. */
  repeatDelay?: number;
  /** The frame shown to visitors who ask for reduced motion, in seconds. Defaults to the end. */
  posterTime?: number;
  /**
   * Loop the last part: with loop on, the scene plays once from the start, then repeats only from this
   * moment (in seconds) to the end, so a closing call to action keeps moving while the rest holds.
   * Ignored with the scroll trigger and in click-to-advance scenes.
   */
  loopFrom?: number;
  /**
   * auto: plays straight through (the default). click: a presentation; the scene stops at each marker
   * (and at the end) until the visitor clicks, taps or presses an arrow key. Ignored with the scroll trigger.
   */
  advance?: 'auto' | 'click';
}

export interface ScrollSettings {
  /** Hold the stage in place while the page scrolls through the scene. Defaults to true. */
  pin?: boolean;
  /** Pinned: how far the page scrolls while the scene plays, in window heights. Defaults to 1.5. */
  length?: number;
  /** Seconds the playhead takes to catch up with the scroll position. Defaults to 0.4; 0 follows exactly. */
  smooth?: number;
}

export type Anchor =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

export interface Box {
  /** Horizontal position of the anchor point, % of stage width. */
  x: number;
  /** Vertical position of the anchor point, % of stage height. */
  y: number;
  /** Width, % of stage width. Text without a width sizes to its content. */
  w?: number;
  /** Height, % of stage height. */
  h?: number;
  /** Width-to-height ratio; used instead of h when set (keeps circles round). */
  ratio?: number;
  /** Which point of the layer sits at (x, y). Defaults to center. */
  anchor?: Anchor;
  /** Static rotation in degrees. */
  rotate?: number;
}

export interface TextStyle {
  fontFamily?: string;
  /** Stage units: 10 = 10% of the stage width. */
  fontSize: number;
  fontWeight?: number;
  lineHeight?: number;
  /** In em. */
  letterSpacing?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  uppercase?: boolean;
  italic?: boolean;
}

export interface LayerOverride {
  box?: Partial<Box>;
  style?: Partial<TextStyle>;
  text?: string;
  hidden?: boolean;
}

export interface LayerLink {
  /** A web address (https://…), a path on the same site (/download), an anchor (#pricing), mailto: or tel:. */
  href: string;
  /** Open in a new tab. */
  newTab?: boolean;
  /**
   * What the link says, for screen readers and search engines. Defaults to the layer's text (a group:
   * the text inside it, an image: its alt text). Give one for a shape, which has no words of its own.
   */
  label?: string;
}

/** Only these kinds of address are followed: never script or data addresses. */
export const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#|\?|\.\.?\/)/i;

interface LayerBase {
  id: string;
  name?: string;
  box: Box;
  /** When the layer appears, in seconds. Defaults to 0. */
  start?: number;
  /** When the layer disappears, in seconds. Defaults to the scene's end. */
  end?: number;
  opacity?: number;
  /** Editor only: a locked layer can't be selected or moved on the stage. Playback ignores it. */
  locked?: boolean;
  /** Makes the layer a link (a group: its whole frame). */
  link?: LayerLink;
  /**
   * Pin to the stage (top-level layers only). The layer is placed against the stage itself rather than
   * the scene's frame: its x / y are % of the stage, so a corner is the real corner of whatever box the
   * scene fills, whatever its shape. Sizes and text keep the frame's units, so it matches everything
   * else. Pinned layers sit above the others and stay still when the camera moves (like a channel logo).
   */
  pin?: 'stage';
  /** Per-breakpoint changes, keyed by breakpoint id. Layout only: clips are shared by every breakpoint. */
  overrides?: Record<string, LayerOverride>;
  clips: Clip[];
}

export interface TextLayer extends LayerBase {
  type: 'text';
  /** A line break in the text ("\n") starts a new line. */
  text: string;
  style: TextStyle;
}

export interface ShapeLayer extends LayerBase {
  type: 'shape';
  shape: 'rect' | 'ellipse';
  /** Any CSS background. */
  fill?: string;
  stroke?: string;
  /** Stage units. */
  strokeWidth?: number;
  /** Corner radius in stage units (rect only). */
  radius?: number;
  /** A dashed outline: the length of each dash, in stage units (needs a stroke). */
  dash?: number;
  /** The gap between dashes, in stage units. Defaults to 0.8 times the dash. */
  dashGap?: number;
}

export interface ImageLayer extends LayerBase {
  type: 'image';
  src: string;
  alt?: string;
  fit?: 'cover' | 'contain';
  /** Corner radius in stage units. */
  radius?: number;
}

/**
 * A group: layers kept together, with a timeline of their own.
 *
 * Children keep stage coordinates (grouping never moves anything); the group's frame is worked out
 * from them, so presets on the group itself (fade, slide, pop…) act on that frame. Children's clips
 * and in/out points are in the group's own time: 0 is the group's `start` in the parent's time, so
 * moving the group's start moves its whole animation. Its `box` is ignored (the frame is measured).
 */
export interface GroupLayer extends Omit<LayerBase, 'box'> {
  type: 'group';
  box?: Box;
  layers: Layer[];
  /** Length of the group's own timeline, in seconds. Defaults to the end of its last clip. */
  duration?: number;
}

/**
 * A 3D object, drawn by three.js inside the layer's box: extruded text, a shape, an extruded SVG logo,
 * or a glTF model. three.js loads only for scenes that have one. The box is the viewport; the object is
 * fitted inside it. Presets made for 3D turn the object and move the camera; every other preset moves
 * the layer as a whole, like any layer.
 */
export interface ModelLayer extends LayerBase {
  type: 'model';
  model: ModelSource;
  material?: ModelMaterial;
  /** The resting pose: rotation in degrees, and a scale (1 = fitted to the box). */
  pose?: { rx?: number; ry?: number; rz?: number; scale?: number };
  /** Light: 0 to 3 (1 = normal). */
  light?: number;
  /** Describes the object for screen readers ("" if it is decorative). */
  alt?: string;
}

export interface ModelSource {
  kind: 'text' | 'shape' | 'svg' | 'gltf';
  /** kind text: the words to extrude (a line break starts a new line). */
  text?: string;
  /** kind shape. */
  shape?: 'box' | 'sphere' | 'torus' | 'knot' | 'cylinder' | 'crystal';
  /** kind svg: the SVG markup, a data: URL or an https address. kind gltf: a .glb / .gltf address or data: URL. */
  src?: string;
  /** Text and SVG: extrusion depth, relative to the object's height (0.05 to 2). */
  depth?: number;
  /** Text and SVG: rounded edges, relative to the depth (0 to 1). */
  bevel?: number;
}

export interface ModelMaterial {
  color?: string;
  finish?: 'matte' | 'satin' | 'glossy' | 'metal' | 'chrome';
  /** gltf: keep the model's own materials (default true). */
  original?: boolean;
}

export type Layer = TextLayer | ShapeLayer | ImageLayer | ModelLayer | GroupLayer;

export interface Clip {
  id: string;
  /** A preset id from the catalogue, e.g. "text-rise". */
  preset: string;
  /** Seconds from the start of the scene. */
  start: number;
  /** Seconds. */
  duration: number;
  /** An easing name, e.g. "power3.out". Each preset has its own default. */
  ease?: string;
  params?: Record<string, unknown>;
  /** A built-in sound effect that plays with this clip and moves with it. */
  sound?: ClipSound;
}

export interface ClipSound {
  /** A built-in sound id, e.g. "whoosh" (see SFX_CATALOG). */
  name: string;
  /** Play when the clip starts (default) or when it ends (a landing). */
  at?: 'start' | 'end';
  /** Seconds after that moment (negative: before it). */
  delay?: number;
  /** 0 to 2 (1 = normal). */
  volume?: number;
  /** 0.5 to 2: higher is higher and shorter. */
  pitch?: number;
}
