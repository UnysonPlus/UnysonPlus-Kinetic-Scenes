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
  /**
   * A walkthrough as steps (the Studio turns them into clips and markers; the player ignores them): each
   * step says what changes, [{ id, label?, at?, hold?, do: [{ layer, preset, params?, duration?, offset? }] }].
   */
  steps?: Array<{ id: string; label?: string; at?: number; hold?: number; do: Array<{ layer: string; preset: string; params?: Record<string, unknown>; duration?: number; offset?: number; ease?: string }> }>;
  /**
   * What the scene is for. web (the default): a responsive scene on a page. video: a fixed-format piece that
   * plays once at an exact length, exported as a video (the Studio and Check scene follow `video`).
   */
  mode?: 'web' | 'video';
  video?: VideoSettings;
}

/** The video formats, by shape. Each one a video scene is made in is a breakpoint with the same id. */
export type VideoFormat = '9x16' | '1x1' | '4x5' | '16x9';

export interface VideoSettings {
  /** The formats it is made in, the main one first. */
  formats: VideoFormat[];
  /** Frames a second (default 30). */
  fps?: 24 | 25 | 30 | 50 | 60;
  /** Where it will be posted: the Studio shows (and Check scene keeps clear of) that app's buttons and captions. */
  platform?: 'tiktok' | 'reels' | 'shorts' | 'youtube' | 'none';
  /** Graphics only, on a see-through background, to lay over footage in a video editor. */
  transparent?: boolean;
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
   * Clips cut from one recording (editing by the words splits a voice-over into parts) share a group: captions that
   * follow one of them follow them all.
   */
  group?: string;
  /** The voice that spoke it, when it was made from a script ("Voicebox: Jon", "Clear (American English)"). Shown in the
   * editor; playback ignores it. */
  voice?: string;
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
  /** Music: its tempo and beats (times from the start of the FILE), each with a strength 0 to 1. */
  beats?: { bpm: number; times: number[]; strengths: number[] };
  /** Music: loudness and bass, 0 to 1, sampled `fps` times a second from the start of the FILE (for React to music). */
  envelope?: { fps: number; loud: number[]; bass: number[] };
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
  /**
   * A layout by shape: used only when the stage is at least this much wider than tall (width / height), so
   * an ultrawide hero can spread its content out. Only the fill and capped height modes have a free shape.
   */
  minRatio?: number;
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
  /**
   * A hotspot: instead of leaving the page, jump to a moment of this scene (a marker's id, or seconds) and
   * play from there, so a visitor chooses what to see next. href is then only the fallback.
   */
  jump?: string | number;
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
  /**
   * Depth for camera parallax, -1 (far) to 1 (near); 0 or unset moves with the scene. When the camera pans
   * or zooms, a near layer moves and grows more than the rest and a far one less, so a picture split into
   * layers (Split into layers) becomes a 2.5D shot.
   */
  depth?: number;
  /**
   * What happens when a visitor points at the layer (on devices with a mouse; on phones a tap just follows
   * its link). Applied around the layer, so it never fights the layer's own animation.
   */
  hover?: { effect: 'lift' | 'grow' | 'glow' | 'brighten' | 'shine' | 'underline' | 'color'; color?: string; css?: string };
  /** Per-breakpoint changes, keyed by breakpoint id. Layout only: clips are shared by every breakpoint. */
  overrides?: Record<string, LayerOverride>;
  clips: Clip[];
}

export interface TextLayer extends LayerBase {
  type: 'text';
  /** A line break in the text ("\n") starts a new line. */
  text: string;
  style: TextStyle;
  /**
   * A pill (or tag) around the words, sized to them: a status label, a badge, a button's label. Change text
   * resizes it smoothly to the new words. Radius and padding are in em (of the text size).
   */
  pill?: { fill?: string; stroke?: string; strokeWidth?: number; radius?: number; padX?: number; padY?: number };
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
  /** A frame round the picture: a phone, a browser window, a polaroid, a film strip or a card. */
  frame?: MediaFrame;
}

export type MediaFrame = 'none' | 'phone' | 'browser' | 'polaroid' | 'film' | 'card';

/**
 * Footage: a video (or a still photo used as one) on the timeline. It is muted in the player; with `sound`
 * a video export mixes its sound in. A `reference` layer is there to design against: the Studio shows it,
 * a graphics-only export leaves it out, a full composite keeps it.
 */
export interface VideoLayer extends LayerBase {
  type: 'video';
  src: string;
  /** Seconds into the file where the layer starts playing (trim the start). */
  offset?: number;
  /** Playing speed: 0.25 to 4 (1 = normal). */
  rate?: number;
  fit?: 'cover' | 'contain';
  radius?: number;
  frame?: MediaFrame;
  reference?: boolean;
  /** Mix the footage's own sound into a video export (0 to 2, its volume). */
  sound?: number;
  /** A description, for screen readers (footage that matters to the story). */
  alt?: string;
  /**
   * The face in the footage, frame by frame (the AI Dev Kit finds it): seconds into the file, and the face's
   * centre and size as fractions of the frame. The Follow preset keeps a layer on it.
   */
  track?: Array<{ t: number; x: number; y: number; w: number; h: number }>;
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
  /** Set on the group a repeat layer becomes when it plays (its copies are generated, not edited). */
  fromRepeat?: boolean;
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
  /**
   * gltf models with animations (from Blender and the like): they play on the scene's clock from the layer's start.
   * clip: one animation by name, or "all" (the default); speed (1 = as made); loop (default true; false: play once, hold).
   */
  animation?: { clip?: string; speed?: number; loop?: boolean };
}

/**
 * A Lottie animation (an After Effects animation exported as JSON, from LottieFiles and the like), played on the
 * scene's clock: it shows the exact frame for the scene's time, so it seeks, loops and renders to video. Its colours
 * and texts can be changed in place.
 */
export interface LottieLayer extends LayerBase {
  type: 'lottie';
  /** The animation: a .json address, a data: URL or the JSON itself. */
  src: string;
  /** Playing speed (1 = as made). */
  speed?: number;
  /** Loop for as long as the layer is on (default), or play once and hold the last frame. */
  loop?: boolean;
  /** Seconds into the animation where it starts. */
  from?: number;
  /** Colours to swap, "#from" → "#to" (the animation's own colours, as lottieInfo lists them). */
  colours?: Record<string, string>;
  /** Texts to change, the animation's text → the new text. */
  texts?: Record<string, string>;
  /** Describes the animation for screen readers ("" if it is decorative). */
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

/**
 * A line: an SVG path drawn in the layer's box. Its coordinates run from 0 to 100 across and down the box
 * (percent of the box), so the line stretches with the box while its width stays the same. Draw it on
 * with the Draw preset; other layers can travel along it (Follow path).
 */
export interface PathLayer extends LayerBase {
  type: 'path';
  /** SVG path data, e.g. "M 0 50 C 30 0, 70 100, 100 50". */
  d: string;
  /** Line colour. Defaults to white. */
  stroke?: string;
  /** Stage units. Defaults to 0.3. */
  strokeWidth?: number;
  /** Fills the closed shape the path makes. */
  fill?: string;
  /** A dashed line: dash length and gap in stage units. */
  dash?: number;
  dashGap?: number;
  /** Arrowheads at the end, the start or both. */
  arrow?: 'end' | 'start' | 'both';
  /** A soft glow around the line, in stage units (0 = none). */
  glow?: number;
}

/**
 * Flow lines: a bundle of glowing curves from one layer to another, worked out every frame from where
 * those two layers are, so they stay attached however either one moves. The layer covers the stage
 * (its box is ignored); it never takes clicks.
 */
export interface FlowLayer extends Omit<LayerBase, 'box'> {
  type: 'flow';
  box?: Box;
  /** The layer the lines leave from, and the one they arrive at (ids). */
  from: string;
  to: string;
  /** Number of lines, 1 to 40. Defaults to 7. */
  count?: number;
  /** How far apart the lines are where they leave and arrive, in stage units. Defaults to 8. */
  spread?: number;
  /** How tightly they squeeze together in the middle, 0 (not at all) to 1 (into one point). Defaults to 0.75. */
  pinch?: number;
  /** How much the curves sway (a wave) between the ends, 0 to 1. Defaults to 0.35. */
  wave?: number;
  /** Colours blended along the lines, from the start to the end. */
  colors?: string[];
  /** Line width in stage units. Defaults to 0.16. */
  width?: number;
  /** Glow strength, 0 to 3. Defaults to 1. */
  glow?: number;
  /** Light pulses travelling along each line, per line (0 = none). */
  pulses?: number;
  /** Pulse speed: how many times a pulse runs the length of its line per second. Defaults to 0.5. */
  pulseSpeed?: number;
  /** Which sides of the two layers the lines leave and arrive at. Defaults to facing each other. */
  fromSide?: 'auto' | 'left' | 'right' | 'top' | 'bottom';
  toSide?: 'auto' | 'left' | 'right' | 'top' | 'bottom';
}

/**
 * A diagram: nodes and the connections between them, as data. Node positions are percent of the layer's
 * box. Each node and connection can appear at its own moment (seconds from the layer's start): a node
 * pops in and its connections draw themselves. A tag can travel from node to node.
 */
export interface DiagramLayer extends LayerBase {
  type: 'diagram';
  nodes: DiagramNode[];
  edges?: DiagramEdge[];
  /** A label that moves between nodes (like a "HEAD" or "You are here" tag). */
  tag?: { label: string; color?: string; stops: Array<{ node: string; t: number }> };
  look?: DiagramLook;
}

export interface DiagramNode {
  id: string;
  /** Centre of the node, % of the box. */
  x: number;
  y: number;
  label?: string;
  /** A second, smaller line under the label. */
  sub?: string;
  /** box (rounded rectangle), pill, circle, dot (a small point with its label beside it) or value (a labelled box holding a value: label above, sub inside). */
  shape?: 'box' | 'pill' | 'circle' | 'dot' | 'value';
  /** Width in % of the box (box, pill, value). Defaults to a size that fits the label. */
  w?: number;
  color?: string;
  /** Seconds (on the layer's timeline) when the node pops in. Defaults to 0 (there from the start). */
  at?: number;
  /** Moves: the node glides to each new position, arriving at time t; its connections bend with it. */
  moves?: Array<{ t: number; x: number; y: number }>;
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** straight, curve (a smooth S) or step (right angles). Defaults to curve. */
  kind?: 'straight' | 'curve' | 'step';
  label?: string;
  color?: string;
  dashed?: boolean;
  arrow?: boolean;
  /** When the connection draws itself (seconds); defaults to when both its nodes are there. */
  at?: number;
}

export interface DiagramLook {
  /** Lines and outlines. */
  color?: string;
  nodeFill?: string;
  textColor?: string;
  /** Label size in stage units. Defaults to 1.4. */
  fontSize?: number;
  fontFamily?: string;
  /** Line width in stage units. Defaults to 0.2. */
  lineWidth?: number;
}

/**
 * Code: an editor window (or a terminal) showing real code with syntax colours and line numbers. What
 * happens to it is set by its clips: Type code types lines in, Change code turns it into a new version
 * (selecting and deleting, retyping, lines sliding to make room), Highlight code marks a line or a word,
 * Run code shows output, and Code note puts a pill beside a line.
 */
export interface CodeLayer extends LayerBase {
  type: 'code';
  /** The code at the start (lines typed in later are part of it: Type code hides them until typed). */
  code: string;
  /** auto picks from the file name in title (main.py → python). */
  language?: 'auto' | 'js' | 'ts' | 'python' | 'java' | 'php' | 'csharp' | 'go' | 'rust' | 'c' | 'cpp' | 'sql' | 'bash' | 'html' | 'css' | 'json' | 'text';
  /** The file name shown in the tab ("main.py"). */
  title?: string;
  /** window: a title bar with a tab; terminal: a title bar, no line numbers, $ prompts; plain: just the code. */
  frame?: 'window' | 'terminal' | 'plain';
  lineNumbers?: boolean;
  /** Shows a Run button in the title bar (Run code presses it). */
  run?: boolean;
  /** Stage units. Defaults to 1.5. */
  fontSize?: number;
  fontFamily?: string;
  theme?: 'dark' | 'light';
  /** Corner radius in stage units. Defaults to 1. */
  radius?: number;
  /** Seconds the caret keeps blinking after the last keystroke. Defaults to 1.2. */
  caretHold?: number;
}

/**
 * Repeat from a list: one designed item and a list of entries; it plays as one copy of the item per
 * entry. Words in the item (text, labels, alt text, a link) may hold {{field}} placeholders that each
 * entry fills in. Copies step along a row or a column (or fill a grid), and each copy's clips start one
 * stagger after the one before.
 */
export interface RepeatLayer extends Omit<LayerBase, 'box'> {
  type: 'repeat';
  box?: Box;
  /** The item, laid out for the first entry: usually a group (a card, a row). */
  item: Layer;
  /** One entry per copy, e.g. [{ "title": "git init", "sub": "Create a repository" }, …]. */
  items: Array<Record<string, string | number>>;
  /** Copies are named <repeat id>_<n>_<item layer id>. Where each next copy goes, in % of the stage. Defaults to 12 down (a column). */
  step?: { x?: number; y?: number };
  /** A grid: copies per row; rows are rowStep apart (% of the stage). */
  columns?: number;
  rowStep?: number;
  /** Seconds between one copy's clips and the next's. Defaults to 0.12. */
  stagger?: number;
}

/**
 * Captions from a voice-over: the spoken words, a few at a time, with the word being said lit up. Built
 * from the transcription of an audio clip, so they follow the voice exactly.
 */
export interface CaptionsLayer extends LayerBase {
  type: 'captions';
  /** The audio clip whose words are shown (its id). Defaults to the first voice-over. */
  audio?: string;
  style: TextStyle;
  /** Most words on screen at once. Defaults to 4. */
  maxWords?: number;
  /** The colour of the word being said. */
  highlight?: string;
  /** word: only the word being said is lit; karaoke: every word said so far is lit; none: plain captions. */
  mode?: 'word' | 'karaoke' | 'none';
  /** A box behind the words (any CSS background). */
  background?: string;
  /** Capitals. */
  uppercase?: boolean;
  /**
   * How the words arrive. pop (the default): each group of words appears with a small pop. slam: each word
   * slams in as it is said (giant captions). drop: each word drops in from above and bounces (viral drop).
   */
  motion?: 'pop' | 'slam' | 'drop';
  /**
   * A look on the letters. glow: a neon glow (in effectColor, else the lit colour); outline: a thick outline around each
   * letter (effectColor, else black), the short-form look; shadow: a soft drop shadow that keeps captions readable on
   * busy footage; chrome: polished metal letters (the word being said keeps its lit colour).
   */
  effect?: 'none' | 'glow' | 'outline' | 'shadow' | 'chrome';
  /** The colour of the glow or the outline. */
  effectColor?: string;
}

/**
 * A cursor for product tours. Its box's x / y is where the tip starts (put it off the stage so it enters)
 * and its width is its size: about 4-7% of the stage reads well in a video. Its clips move it to layers
 * (Move to) and press (Click).
 */
export interface CursorLayer extends LayerBase {
  type: 'cursor';
  /** auto: an arrow that turns into a pointing hand over links and buttons. */
  shape?: 'auto' | 'arrow' | 'hand';
  /** light: a white pointer with a dark outline (the usual); dark: the reverse. */
  theme?: 'light' | 'dark';
  /** The colour of the ring a click ripples. */
  ringColor?: string;
}

export type Layer = TextLayer | ShapeLayer | ImageLayer | VideoLayer | ModelLayer | GroupLayer | PathLayer | FlowLayer | DiagramLayer | CodeLayer | RepeatLayer | CaptionsLayer | CursorLayer | LottieLayer;

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
  /** Made from a step (the Studio's Steps): the step's id. Applying the steps again replaces these clips. */
  step?: string;
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
