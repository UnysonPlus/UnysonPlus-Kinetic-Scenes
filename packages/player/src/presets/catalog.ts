import type { Layer } from '../types';
import { EXIT_EASE } from '../eases';

/**
 * The preset catalogue: everything about a preset except the animation code. Kept free of the
 * animation engine so the validator and the editor (library, inspector forms) can use it without
 * loading GSAP. presets/index.ts supplies the build function for every id listed here.
 */

export type PresetCategory = 'text' | 'reveal' | 'motion' | 'emphasis' | 'ambient' | '3d' | 'transition';

export const CATEGORY_LABELS: Record<PresetCategory, string> = {
  text: 'Text',
  reveal: 'Reveal and exit',
  motion: 'Move and scale',
  emphasis: 'Emphasis',
  ambient: 'Ambient and backgrounds',
  '3d': '3D',
  transition: 'Scene transitions',
};

export type PresetField =
  | { key: string; label: string; type: 'number'; min?: number; max?: number; step?: number; unit?: string }
  | { key: string; label: string; type: 'select'; options: Array<{ value: string; label: string }> }
  | { key: string; label: string; type: 'boolean' }
  | { key: string; label: string; type: 'text' }
  | { key: string; label: string; type: 'color' }
  | { key: string; label: string; type: 'code' };

export interface PresetMeta {
  id: string;
  label: string;
  description: string;
  category: PresetCategory;
  appliesTo: Array<Layer['type']>;
  defaultEase: string;
  /** Seconds, used when the preset is dropped on the timeline. */
  defaultDuration: number;
  defaults: Record<string, unknown>;
  fields: PresetField[];
  /** Left out of what the AI may use (the AI writes data, never code). */
  aiExcluded?: boolean;
}

const DIRECTION: PresetField = {
  key: 'direction', label: 'Direction', type: 'select',
  options: [{ value: 'in', label: 'In' }, { value: 'out', label: 'Out' }],
};
const STAGGER: PresetField = { key: 'stagger', label: 'Stagger', type: 'number', min: 0, max: 1, step: 0.005, unit: 's' };
const RHYTHM: PresetField = {
  key: 'rhythm', label: 'Rhythm', type: 'select',
  options: [{ value: 'natural', label: 'Natural (uneven gaps)' }, { value: 'even', label: 'Even' }],
};
const BY: PresetField = {
  key: 'by', label: 'Animate by', type: 'select',
  options: [{ value: 'chars', label: 'Letter' }, { value: 'words', label: 'Word' }],
};
const SIDE: PresetField = {
  key: 'from', label: 'From', type: 'select',
  options: [
    { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
    { value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' },
  ],
};
// Presets that animate the layer as a whole also work on a group (its frame).
const ALL: PresetMeta['appliesTo'] = ['text', 'shape', 'image', 'model', 'group'];

export const PRESET_CATALOG: PresetMeta[] = [
  // ---- Text ----
  {
    id: 'text-rise', label: 'Rise', category: 'text', appliesTo: ['text'],
    description: 'Letters or words rise into place one after another, from behind an invisible mask.',
    defaultEase: 'power4.out', defaultDuration: 0.9,
    defaults: { direction: 'in', by: 'chars', stagger: 0.03, rhythm: 'natural', distance: 130, mask: true },
    fields: [DIRECTION, BY, STAGGER, RHYTHM, { key: 'distance', label: 'Distance', type: 'number', min: 0, max: 400, step: 5, unit: '%' }, { key: 'mask', label: 'Mask', type: 'boolean' }],
  },
  {
    id: 'text-slam', label: 'Slam', category: 'text', appliesTo: ALL,
    description: 'Lands from a large, blurred scale, as if thrown at the screen.',
    defaultEase: 'expo.out', defaultDuration: 0.8,
    defaults: { direction: 'in', scale: 2.4, blur: 1.2 },
    fields: [DIRECTION, { key: 'scale', label: 'Start scale', type: 'number', min: 1, max: 8, step: 0.1 }, { key: 'blur', label: 'Blur', type: 'number', min: 0, max: 5, step: 0.1 }],
  },
  {
    id: 'text-stretch', label: 'Stretch', category: 'text', appliesTo: ['text'],
    description: 'Letters grow out of a line, squashed, then spring to full size.',
    defaultEase: 'expo.out', defaultDuration: 0.9,
    defaults: { direction: 'in', axis: 'y', stagger: 0.04, rhythm: 'natural', squash: 1.8 },
    fields: [DIRECTION, { key: 'axis', label: 'Axis', type: 'select', options: [{ value: 'y', label: 'Vertical' }, { value: 'x', label: 'Horizontal' }] }, STAGGER, RHYTHM, { key: 'squash', label: 'Squash', type: 'number', min: 1, max: 4, step: 0.1 }],
  },
  {
    id: 'text-scramble', label: 'Scramble', category: 'text', appliesTo: ['text'],
    description: 'Letters flicker through random characters and settle on the real text, left to right.',
    defaultEase: 'none', defaultDuration: 1.1,
    defaults: { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/', fps: 24 },
    fields: [{ key: 'charset', label: 'Characters', type: 'text' }, { key: 'fps', label: 'Flicker rate', type: 'number', min: 1, max: 60, step: 1, unit: '/s' }],
  },
  {
    id: 'text-typewriter', label: 'Typewriter', category: 'text', appliesTo: ['text'],
    description: 'Letters appear one at a time, as if being typed. Caret adds a typing cursor that blinks once the line is done (a prompt box, a search field).',
    defaultEase: 'none', defaultDuration: 1.2,
    defaults: { direction: 'in', caret: false },
    fields: [DIRECTION, { key: 'caret', label: 'Caret', type: 'boolean' }],
  },
  {
    id: 'text-blur', label: 'Blur in', category: 'text', appliesTo: ['text'],
    description: 'Letters or words sharpen out of a soft blur, one after another.',
    defaultEase: 'power2.out', defaultDuration: 1,
    defaults: { direction: 'in', by: 'chars', stagger: 0.03, rhythm: 'natural', blur: 0.8 },
    fields: [DIRECTION, BY, STAGGER, RHYTHM, { key: 'blur', label: 'Blur', type: 'number', min: 0, max: 4, step: 0.1 }],
  },
  {
    id: 'text-flip', label: 'Flip', category: 'text', appliesTo: ['text'],
    description: 'Letters or words flip up into place in 3D, like a departure board.',
    defaultEase: 'power3.out', defaultDuration: 0.9,
    defaults: { direction: 'in', by: 'chars', stagger: 0.04, rhythm: 'natural' },
    fields: [DIRECTION, BY, STAGGER, RHYTHM],
  },
  {
    id: 'text-tracking', label: 'Tracking', category: 'text', appliesTo: ['text'],
    description: 'Letter spacing opens out (or closes in) as the text fades in.',
    defaultEase: 'power3.out', defaultDuration: 1.2,
    defaults: { direction: 'in', from: -0.4 },
    fields: [DIRECTION, { key: 'from', label: 'Start spacing', type: 'number', min: -1, max: 2, step: 0.05, unit: 'em' }],
  },
  {
    id: 'text-wave', label: 'Wave', category: 'emphasis', appliesTo: ['text'],
    description: 'A ripple runs through the letters: each one hops and settles.',
    defaultEase: 'sine.inOut', defaultDuration: 1,
    defaults: { height: 30, stagger: 0.05, rhythm: 'natural' },
    fields: [{ key: 'height', label: 'Height', type: 'number', min: 0, max: 200, step: 5, unit: '%' }, STAGGER, RHYTHM],
  },
  // ---- Reveal and exit ----
  {
    id: 'fade', label: 'Fade', category: 'reveal', appliesTo: ALL,
    description: 'Fades in or out with a small drift, optionally scaling or blurring as it goes.',
    defaultEase: 'softLand', defaultDuration: 0.5,
    defaults: { direction: 'in', x: 0, y: 12, scale: 1, blur: 0 },
    fields: [DIRECTION, { key: 'x', label: 'Drift X', type: 'number', min: -200, max: 200, step: 5, unit: '%' }, { key: 'y', label: 'Drift Y', type: 'number', min: -200, max: 200, step: 5, unit: '%' }, { key: 'scale', label: 'Scale', type: 'number', min: 0, max: 4, step: 0.05 }, { key: 'blur', label: 'Blur', type: 'number', min: 0, max: 5, step: 0.1 }],
  },
  {
    id: 'wipe', label: 'Wipe', category: 'reveal', appliesTo: ALL,
    description: 'Reveals or hides behind a straight edge sweeping across.',
    defaultEase: 'power3.inOut', defaultDuration: 0.8,
    defaults: { direction: 'in', from: 'left' },
    fields: [DIRECTION, { ...SIDE, options: [...(SIDE as { options: Array<{ value: string; label: string }> }).options, { value: 'center', label: 'Centre' }] }],
  },
  {
    id: 'iris', label: 'Iris', category: 'reveal', appliesTo: ALL,
    description: 'Opens (or closes) through a growing circle.',
    defaultEase: 'power3.inOut', defaultDuration: 0.9,
    defaults: { direction: 'in', x: 50, y: 50 },
    fields: [DIRECTION, { key: 'x', label: 'Centre X', type: 'number', min: 0, max: 100, step: 1, unit: '%' }, { key: 'y', label: 'Centre Y', type: 'number', min: 0, max: 100, step: 1, unit: '%' }],
  },
  {
    id: 'slide', label: 'Slide', category: 'reveal', appliesTo: ALL,
    description: 'Slides in from a side (or out to one) while fading. Motion blur smears it along the move while it is fast, so a quick move reads as speed.',
    defaultEase: 'softLand', defaultDuration: 0.6,
    defaults: { direction: 'in', from: 'bottom', distance: 60, motionBlur: 0 },
    fields: [DIRECTION, SIDE, { key: 'distance', label: 'Distance', type: 'number', min: 0, max: 400, step: 5, unit: '%' }, { key: 'motionBlur', label: 'Motion blur', type: 'number', min: 0, max: 3, step: 0.1 }],
  },
  {
    id: 'grow', label: 'Grow', category: 'reveal', appliesTo: ALL,
    description: 'Draws out from one edge or the centre. Made for lines and bars.',
    defaultEase: 'expo.inOut', defaultDuration: 0.9,
    defaults: { direction: 'in', axis: 'x', origin: 'center' },
    fields: [DIRECTION, { key: 'axis', label: 'Axis', type: 'select', options: [{ value: 'x', label: 'Horizontal' }, { value: 'y', label: 'Vertical' }] }, { key: 'origin', label: 'From', type: 'select', options: [{ value: 'start', label: 'Start' }, { value: 'center', label: 'Centre' }, { value: 'end', label: 'End' }] }],
  },
  // ---- Move and scale ----
  {
    id: 'pop', label: 'Pop', category: 'motion', appliesTo: ALL,
    description: 'Scales up into place with a little overshoot (or down and away).',
    defaultEase: 'popOver', defaultDuration: 0.5,
    defaults: { direction: 'in', from: 0.5 },
    fields: [DIRECTION, { key: 'from', label: 'Start scale', type: 'number', min: 0, max: 1, step: 0.05 }],
  },
  {
    id: 'zoom', label: 'Zoom', category: 'motion', appliesTo: ALL,
    description: 'Eases in from smaller (or larger) with a fade, no overshoot. A start scale above 1 lands it from close up.',
    defaultEase: 'softLand', defaultDuration: 0.6,
    defaults: { direction: 'in', scale: 0.7 },
    fields: [DIRECTION, { key: 'scale', label: 'Start scale', type: 'number', min: 0, max: 4, step: 0.05 }],
  },
  {
    id: 'spin', label: 'Spin', category: 'motion', appliesTo: ALL,
    description: 'Turns into place while scaling up.',
    defaultEase: 'expo.out', defaultDuration: 0.9,
    defaults: { direction: 'in', turns: 0.5 },
    fields: [DIRECTION, { key: 'turns', label: 'Turns', type: 'number', min: -4, max: 4, step: 0.25 }],
  },
  {
    id: 'keyframes', label: 'Keyframes', category: 'motion', appliesTo: ALL,
    description: 'Hand-set values at moments within the clip: position, scale, rotation, opacity and blur.',
    defaultEase: 'power2.inOut', defaultDuration: 2,
    defaults: { frames: [{ t: 0, scale: 1 }, { t: 2, scale: 1.1 }] },
    fields: [],
  },
  // ---- Emphasis ----
  {
    id: 'pulse', label: 'Pulse', category: 'emphasis', appliesTo: ALL,
    description: 'Swells and settles, a set number of times.',
    defaultEase: 'sine.inOut', defaultDuration: 1.2,
    defaults: { scale: 1.12, times: 2 },
    fields: [{ key: 'scale', label: 'Scale', type: 'number', min: 1, max: 2, step: 0.01 }, { key: 'times', label: 'Times', type: 'number', min: 1, max: 12, step: 1 }],
  },
  {
    id: 'shake', label: 'Shake', category: 'emphasis', appliesTo: ALL,
    description: 'A quick, jittery side-to-side shake that dies away.',
    defaultEase: 'none', defaultDuration: 0.6,
    defaults: { strength: 6 },
    fields: [{ key: 'strength', label: 'Strength', type: 'number', min: 0, max: 40, step: 1, unit: '%' }],
  },
  {
    id: 'float', label: 'Float', category: 'emphasis', appliesTo: ALL,
    description: 'Drifts gently up and down, like it is floating.',
    defaultEase: 'sine.inOut', defaultDuration: 3,
    defaults: { height: 6, cycles: 1 },
    fields: [{ key: 'height', label: 'Height', type: 'number', min: 0, max: 100, step: 1, unit: '%' }, { key: 'cycles', label: 'Cycles', type: 'number', min: 1, max: 10, step: 1 }],
  },
  {
    id: 'recolor', label: 'Recolour', category: 'emphasis', appliesTo: ['text', 'shape'],
    description: 'Changes the text colour, or a shape’s solid fill, to a new colour.',
    defaultEase: 'power2.inOut', defaultDuration: 0.6,
    defaults: { to: '#ffffff' },
    fields: [{ key: 'to', label: 'Colour', type: 'color' }],
  },
  // ---- Second set ----
  {
    id: 'text-count', label: 'Count up', category: 'text', appliesTo: ['text'],
    description: 'The number in the text counts up to its value, keeping any prefix, separators and suffix ("$12,500+"). A clock ("0:45") counts in minutes and seconds.',
    defaultEase: 'expo.out', defaultDuration: 1.6,
    defaults: { from: 0 },
    fields: [{ key: 'from', label: 'Count from', type: 'number', step: 1 }],
  },
  {
    id: 'text-swap', label: 'Change text', category: 'text', appliesTo: ['text'],
    description: 'Swaps the words for new ones on cue ("booting" to "ready in 45 s", "1 / 10" to "2 / 10"): the old text leaves as the new one arrives. Chain several on one layer to step through a sequence; each starts from the text the one before it left.',
    defaultEase: 'power3.inOut', defaultDuration: 0.5,
    defaults: { to: 'New text', style: 'roll' },
    fields: [
      { key: 'to', label: 'New text', type: 'text' },
      { key: 'style', label: 'Style', type: 'select', options: [
        { value: 'roll', label: 'Roll up' }, { value: 'slide', label: 'Slide across' },
        { value: 'fade', label: 'Fade' }, { value: 'blur', label: 'Blur' },
      ] },
    ],
  },
  {
    id: 'text-carry', label: 'Carry in', category: 'text', appliesTo: ['text'],
    description: 'The first word slides in big and fast and each following word travels less, so the line arrives with momentum instead of an even stagger.',
    defaultEase: 'expo.out', defaultDuration: 0.9,
    defaults: { from: 'right', distance: 18, falloff: 0.35, stagger: 0.07 },
    fields: [
      { key: 'from', label: 'From', type: 'select', options: [{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }, { value: 'bottom', label: 'Below' }] },
      { key: 'distance', label: 'First word travels', type: 'number', min: 0, max: 100, step: 0.5, unit: 'su' },
      { key: 'falloff', label: 'Each next word', type: 'number', min: 0.05, max: 1, step: 0.05, unit: '×' },
      STAGGER,
    ],
  },
  {
    id: 'stack-in', label: 'Stack', category: 'reveal', appliesTo: ALL,
    description: 'Drops in from just above and settles, like a card landing on a pile. Stagger several to build a stacking list.',
    defaultEase: 'back.out(1.4)', defaultDuration: 0.55,
    defaults: { direction: 'in', lift: 35 },
    fields: [DIRECTION, { key: 'lift', label: 'Drop from', type: 'number', min: 0, max: 200, step: 5, unit: '%' }],
  },
  {
    id: 'glow', label: 'Glow', category: 'emphasis', appliesTo: ALL,
    description: 'A neon glow lights up around the letters (or the outline) and stays on. Flicker makes it catch like a neon tube.',
    defaultEase: 'power2.out', defaultDuration: 0.6,
    defaults: { direction: 'in', color: '#2ad38b', size: 1.2, strength: 1, flicker: false },
    fields: [DIRECTION, { key: 'color', label: 'Colour', type: 'color' }, { key: 'size', label: 'Size', type: 'number', min: 0.1, max: 6, step: 0.1, unit: 'su' }, { key: 'strength', label: 'Strength', type: 'number', min: 0, max: 2, step: 0.05 }, { key: 'flicker', label: 'Flicker', type: 'boolean' }],
  },
  {
    id: 'burst', label: 'Burst', category: 'emphasis', appliesTo: ALL,
    description: 'A one-off burst of sparks, shards, dots or rings from the layer on a hit. Land it with a sound and the word it punctuates.',
    defaultEase: 'none', defaultDuration: 0.7,
    defaults: { kind: 'sparks', count: 14, reach: 12, color: '#ffd166', x: 50, y: 50 },
    fields: [
      { key: 'kind', label: 'Kind', type: 'select', options: [{ value: 'sparks', label: 'Sparks' }, { value: 'shards', label: 'Shards' }, { value: 'dots', label: 'Dots' }, { value: 'rings', label: 'Rings' }] },
      { key: 'count', label: 'How many', type: 'number', min: 1, max: 60, step: 1 },
      { key: 'reach', label: 'Reach', type: 'number', min: 1, max: 60, step: 0.5, unit: 'su' },
      { key: 'color', label: 'Colour', type: 'color' },
      { key: 'x', label: 'From X', type: 'number', min: -50, max: 150, step: 1, unit: '%' },
      { key: 'y', label: 'From Y', type: 'number', min: -50, max: 150, step: 1, unit: '%' },
    ],
  },
  {
    id: 'progress', label: 'Progress bar', category: 'motion', appliesTo: ['shape'],
    description: 'A bar fills the shape from one value to another over the clip: the shape is the track. Use the None ease for a steady load.',
    defaultEase: 'power1.inOut', defaultDuration: 2,
    defaults: { from: 0, to: 100, color: '#2ad38b', axis: 'x' },
    fields: [
      { key: 'from', label: 'From', type: 'number', min: 0, max: 100, step: 1, unit: '%' },
      { key: 'to', label: 'To', type: 'number', min: 0, max: 100, step: 1, unit: '%' },
      { key: 'color', label: 'Bar colour', type: 'color' },
      { key: 'axis', label: 'Fills', type: 'select', options: [{ value: 'x', label: 'Across' }, { value: 'y', label: 'Upwards' }] },
    ],
  },
  {
    id: 'march', label: 'Marching outline', category: 'ambient', appliesTo: ['shape'],
    description: 'The dashes of a dashed outline travel round it while something is working. Give the shape an outline and a dash length.',
    defaultEase: 'none', defaultDuration: 3,
    defaults: { speed: 2 },
    fields: [{ key: 'speed', label: 'Speed', type: 'number', min: 0.1, max: 20, step: 0.1, unit: 'su/s' }],
  },
  {
    id: 'dash-solid', label: 'Make solid', category: 'emphasis', appliesTo: ['shape'],
    description: 'A dashed outline closes up into a solid one, for something becoming ready.',
    defaultEase: 'power2.inOut', defaultDuration: 0.5,
    defaults: { direction: 'in' },
    fields: [DIRECTION],
  },
  // ---- Scene transitions (for groups: an "out" on the scene leaving, an "in" on the next) ----
  {
    id: 'tr-slash', label: 'Slash', category: 'transition', appliesTo: ALL,
    description: 'A glowing diagonal line sweeps across the stage; the scene appears (or disappears) behind it.',
    defaultEase: 'softInOut', defaultDuration: 0.6,
    defaults: { direction: 'in', angle: 25, color: '#e9ff3b', glow: true },
    fields: [DIRECTION, { key: 'angle', label: 'Slant', type: 'number', min: -60, max: 60, step: 1, unit: '°' }, { key: 'color', label: 'Line colour', type: 'color' }, { key: 'glow', label: 'Glowing line', type: 'boolean' }],
  },
  {
    id: 'tr-flash', label: 'Flash', category: 'transition', appliesTo: ALL,
    description: 'A burst of light: the scene cuts at its brightest moment.',
    defaultEase: 'none', defaultDuration: 0.5,
    defaults: { direction: 'in', color: '#ffffff', strength: 100 },
    fields: [DIRECTION, { key: 'color', label: 'Colour', type: 'color' }, { key: 'strength', label: 'Strength', type: 'number', min: 10, max: 100, step: 5, unit: '%' }],
  },
  {
    id: 'tr-dip', label: 'Dip to colour', category: 'transition', appliesTo: ALL,
    description: 'The screen fills with a colour, holds a beat, and opens on the next scene.',
    defaultEase: 'none', defaultDuration: 0.8,
    defaults: { direction: 'in', color: '#000000' },
    fields: [DIRECTION, { key: 'color', label: 'Colour', type: 'color' }],
  },
  {
    id: 'tr-whip', label: 'Whip pan', category: 'transition', appliesTo: ALL,
    description: 'One fast camera swing: the scene speeds away with a blur along the move and the next arrives from the same side at the same speed, settling into place. Light streak flares across the screen on the cut to hide the join.',
    defaultEase: 'none', defaultDuration: 0.5,
    defaults: { direction: 'in', from: 'right', distance: 100, blur: 1.6, streak: false, color: '#ffffff' },
    fields: [DIRECTION, SIDE, { key: 'distance', label: 'Distance', type: 'number', min: 10, max: 150, step: 5, unit: '%' }, { key: 'blur', label: 'Blur', type: 'number', min: 0, max: 4, step: 0.1 }, { key: 'streak', label: 'Light streak', type: 'boolean' }, { key: 'color', label: 'Streak colour', type: 'color' }],
  },
  {
    id: 'tr-zoom', label: 'Zoom through', category: 'transition', appliesTo: ALL,
    description: 'The scene rushes past the camera, or approaches from the distance.',
    defaultEase: 'softInOut', defaultDuration: 0.6,
    defaults: { direction: 'in', scale: 4, blur: 0.8 },
    fields: [DIRECTION, { key: 'scale', label: 'Zoom', type: 'number', min: 1.2, max: 10, step: 0.1, unit: '×' }, { key: 'blur', label: 'Blur', type: 'number', min: 0, max: 4, step: 0.1 }],
  },
  {
    id: 'tr-streak', label: 'Light streak', category: 'transition', appliesTo: ALL,
    description: 'A horizontal flare of light races across the screen and the scenes swap at its brightest.',
    defaultEase: 'none', defaultDuration: 0.5,
    defaults: { direction: 'in', color: '#7cc4ff', from: 'left' },
    fields: [DIRECTION, { key: 'color', label: 'Colour', type: 'color' }, { key: 'from', label: 'Sweeps from', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] }],
  },
  {
    id: 'tr-glitch', label: 'Glitch', category: 'transition', appliesTo: ALL,
    description: 'Slices jump and colours split for a few frames, then the cut, like a broken signal.',
    defaultEase: 'none', defaultDuration: 0.45,
    defaults: { direction: 'in', intensity: 60 },
    fields: [DIRECTION, { key: 'intensity', label: 'Intensity', type: 'number', min: 10, max: 100, step: 5, unit: '%' }],
  },
  {
    id: 'soft-wipe', label: 'Soft wipe', category: 'reveal', appliesTo: ALL,
    description: 'A wipe with a feathered edge: the layer fades in (or out) along a moving soft line.',
    defaultEase: 'softInOut', defaultDuration: 0.7,
    defaults: { direction: 'in', from: 'left', feather: 25 },
    fields: [DIRECTION, SIDE, { key: 'feather', label: 'Feather', type: 'number', min: 1, max: 80, step: 1, unit: '%' }],
  },
  {
    id: 'blinds', label: 'Blinds', category: 'reveal', appliesTo: ALL,
    description: 'Revealed (or hidden) in strips, one after another, like a stair wipe.',
    defaultEase: 'softLand', defaultDuration: 0.8,
    defaults: { direction: 'in', from: 'top', count: 6, stagger: 0.5 },
    fields: [DIRECTION, { key: 'from', label: 'From', type: 'select', options: [{ value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] }, { key: 'count', label: 'Strips', type: 'number', min: 2, max: 24, step: 1 }, { key: 'stagger', label: 'Stagger', type: 'number', min: 0, max: 0.9, step: 0.05 }],
  },
  {
    id: 'turn', label: 'Turn', category: 'motion', appliesTo: ALL,
    description: 'Turns into place in 3D, around the vertical or horizontal axis, as if on a hinge through its middle.',
    defaultEase: 'softLand', defaultDuration: 0.7,
    defaults: { direction: 'in', axis: 'y', angle: 90, perspective: 900 },
    fields: [DIRECTION, { key: 'axis', label: 'Axis', type: 'select', options: [{ value: 'y', label: 'Vertical' }, { value: 'x', label: 'Horizontal' }] }, { key: 'angle', label: 'Angle', type: 'number', min: -180, max: 180, step: 5, unit: '°' }, { key: 'perspective', label: 'Depth', type: 'number', min: 200, max: 3000, step: 50, unit: 'px' }],
  },
  {
    id: 'sheen', label: 'Sheen', category: 'emphasis', appliesTo: ['shape', 'image'],
    description: 'A band of light sweeps across once. Best after the layer has settled.',
    defaultEase: 'softInOut', defaultDuration: 0.9,
    defaults: { angle: 110, width: 22, strength: 0.45, color: '#ffffff' },
    fields: [{ key: 'angle', label: 'Angle', type: 'number', min: 0, max: 360, step: 5, unit: '°' }, { key: 'width', label: 'Width', type: 'number', min: 5, max: 60, step: 1, unit: '%' }, { key: 'strength', label: 'Strength', type: 'number', min: 0, max: 1, step: 0.05 }, { key: 'color', label: 'Colour', type: 'color' }],
  },
  {
    id: 'select-box', label: 'Select box', category: 'emphasis', appliesTo: ['text'],
    description: 'Draws a coloured box with square corner handles around one word (or a few) of the text, like a selected object in a design tool, and tints the word to match. The key word of a headline.',
    defaultEase: 'back.out(1.6)', defaultDuration: 0.6,
    defaults: { direction: 'in', word: 1, words: 1, color: '#3b82f6', tint: true, handles: true, padding: 0.2, stroke: 0.18 },
    fields: [
      DIRECTION,
      { key: 'word', label: 'Word', type: 'number', min: 1, max: 200, step: 1 },
      { key: 'words', label: 'How many words', type: 'number', min: 1, max: 20, step: 1 },
      { key: 'color', label: 'Colour', type: 'color' },
      { key: 'tint', label: 'Tint the words', type: 'boolean' },
      { key: 'handles', label: 'Corner handles', type: 'boolean' },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 1, step: 0.01, unit: 'em' },
      { key: 'stroke', label: 'Line width', type: 'number', min: 0.05, max: 1, step: 0.01 },
    ],
  },
  {
    id: 'scroll', label: 'Scroll', category: 'motion', appliesTo: ['image'],
    description: 'Scrolls a tall screenshot inside its frame (or pans a wide one across), from one point to another. Make the frame shorter than the picture. Repeat makes it endless: the picture follows on from itself, and 0 to 100 is one full pass, so a looping ending joins up seamlessly (use the None ease for a steady speed).',
    defaultEase: 'power1.inOut', defaultDuration: 6,
    defaults: { from: 0, to: 100, axis: 'y', repeat: false },
    fields: [{ key: 'from', label: 'From', type: 'number', min: 0, max: 100, step: 1, unit: '%' }, { key: 'to', label: 'To', type: 'number', min: 0, max: 1000, step: 1, unit: '%' }, { key: 'axis', label: 'Direction', type: 'select', options: [{ value: 'y', label: 'Down' }, { value: 'x', label: 'Across' }] }, { key: 'repeat', label: 'Repeat (endless)', type: 'boolean' }],
  },
  {
    id: 'drift', label: 'Drift', category: 'ambient', appliesTo: ALL,
    description: 'A slow, steady move and scale creep that keeps a held frame alive.',
    defaultEase: 'cruise', defaultDuration: 3,
    defaults: { x: 4, y: -3, scale: 1.04, rotate: 0 },
    fields: [{ key: 'x', label: 'Move X', type: 'number', min: -100, max: 100, step: 1, unit: '%' }, { key: 'y', label: 'Move Y', type: 'number', min: -100, max: 100, step: 1, unit: '%' }, { key: 'scale', label: 'Scale to', type: 'number', min: 0.5, max: 2, step: 0.01 }, { key: 'rotate', label: 'Rotate', type: 'number', min: -45, max: 45, step: 1, unit: '°' }],
  },
  {
    id: 'gradient-flow', label: 'Gradient flow', category: 'ambient', appliesTo: ['shape'],
    description: 'A shape’s gradient fill flows across it and back. Give the shape a gradient fill.',
    defaultEase: 'none', defaultDuration: 4,
    defaults: { axis: 'x', cycles: 1 },
    fields: [{ key: 'axis', label: 'Direction', type: 'select', options: [{ value: 'x', label: 'Across' }, { value: 'y', label: 'Up and down' }, { value: 'diagonal', label: 'Diagonal' }] }, { key: 'cycles', label: 'Cycles', type: 'number', min: 1, max: 10, step: 1 }],
  },
  {
    id: 'particles', label: 'Particles', category: 'ambient', appliesTo: ['shape'],
    description: 'A field of small dots rising, falling or drifting inside the shape. Clear the shape’s fill to show the particles on their own.',
    defaultEase: 'none', defaultDuration: 4,
    defaults: { count: 28, size: 1.2, speed: 0.12, direction: 'up', color: '#ffffff', twinkle: true },
    fields: [{ key: 'count', label: 'Count', type: 'number', min: 1, max: 150, step: 1 }, { key: 'size', label: 'Size', type: 'number', min: 0.2, max: 10, step: 0.1, unit: '%' }, { key: 'speed', label: 'Speed', type: 'number', min: 0, max: 2, step: 0.01, unit: '/s' }, { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'up', label: 'Rise' }, { value: 'down', label: 'Fall' }, { value: 'drift', label: 'Drift' }] }, { key: 'color', label: 'Colour', type: 'color' }, { key: 'twinkle', label: 'Twinkle', type: 'boolean' }],
  },
  // ---- 3D (3D layers only: they turn the object and move the camera) ----
  {
    id: 'spin-3d', label: 'Spin 3D', category: '3d', appliesTo: ['model'],
    description: 'The object turns around one of its axes, a set number of times.',
    defaultEase: 'softInOut', defaultDuration: 2,
    defaults: { axis: 'y', turns: 1 },
    fields: [{ key: 'axis', label: 'Axis', type: 'select', options: [{ value: 'y', label: 'Upright (Y)' }, { value: 'x', label: 'Forward (X)' }, { value: 'z', label: 'Flat (Z)' }] }, { key: 'turns', label: 'Turns', type: 'number', min: -10, max: 10, step: 0.25 }],
  },
  {
    id: 'tumble-in', label: 'Tumble in', category: '3d', appliesTo: ['model'],
    description: 'The object tumbles into its pose from a turned, smaller start (or tumbles away).',
    defaultEase: 'snapSettle', defaultDuration: 1.1,
    defaults: { direction: 'in', turn: 140, tilt: -50, scale: 0.4 },
    fields: [DIRECTION, { key: 'turn', label: 'Turn', type: 'number', min: -720, max: 720, step: 5, unit: '°' }, { key: 'tilt', label: 'Tilt', type: 'number', min: -180, max: 180, step: 5, unit: '°' }, { key: 'scale', label: 'Start scale', type: 'number', min: 0, max: 3, step: 0.05 }],
  },
  {
    id: 'orbit-3d', label: 'Orbit', category: '3d', appliesTo: ['model'],
    description: 'The camera circles the object, rising or dipping as it goes.',
    defaultEase: 'softInOut', defaultDuration: 3,
    defaults: { angle: 50, tilt: 10 },
    fields: [{ key: 'angle', label: 'Around', type: 'number', min: -360, max: 360, step: 5, unit: '°' }, { key: 'tilt', label: 'Rise', type: 'number', min: -60, max: 60, step: 1, unit: '°' }],
  },
  {
    id: 'camera-push', label: 'Camera push', category: '3d', appliesTo: ['model'],
    description: 'The camera moves in from further away (or pulls back out).',
    defaultEase: 'softLand', defaultDuration: 1.4,
    defaults: { direction: 'in', distance: 2.2 },
    fields: [DIRECTION, { key: 'distance', label: 'Start distance', type: 'number', min: 0.3, max: 8, step: 0.1, unit: '×' }],
  },
  {
    id: 'code', label: 'Custom code', category: 'motion', appliesTo: ALL,
    description: 'Your own GSAP code, for an effect no preset covers. It only runs where the page allows custom code (the Studio, downloaded pages and embeds; in WordPress, pages by authors trusted with unfiltered HTML).',
    defaultEase: 'none', defaultDuration: 1,
    defaults: { code: "tl.fromTo(el, { rotation: 0 }, { rotation: 360, duration: duration, ease: 'power2.inOut' }, at);" },
    fields: [{ key: 'code', label: 'Code', type: 'code' }],
    aiExcluded: true,
  },
];

export const PRESET_IDS = PRESET_CATALOG.map((p) => p.id);

/**
 * The ease a clip uses when it doesn't set one. Exits default to the leaving curve, which speeds up
 * out of frame: an exit is new motion, not the entrance played backwards.
 */
export function defaultEaseFor(meta: PresetMeta, params?: Record<string, unknown>): string {
  // A transition's two halves share one curve, so an "out" and an "in" placed together stay in step.
  if (meta.category === 'transition') return meta.defaultEase;
  const dir = params && 'direction' in params ? params.direction : meta.defaults.direction;
  return dir === 'out' && meta.fields.some((f) => f.key === 'direction') ? EXIT_EASE : meta.defaultEase;
}
export const presetMeta: Record<string, PresetMeta> = Object.fromEntries(PRESET_CATALOG.map((p) => [p.id, p]));
