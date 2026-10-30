import { presetMeta } from '@unysonplus/scene-player/catalog';

/**
 * Presets by what you want to do: a second way to browse them, beside the technique groups. Each goal is a plain
 * question someone new to animation would ask, with a hint and the presets that answer it, best first.
 */
export interface PresetGoal { id: string; label: string; hint: string; presets: string[] }

const GOALS: PresetGoal[] = [
  { id: 'headline', label: 'Make a headline land', hint: 'Big words arriving with weight: pick one per scene, the strongest for the most important line.',
    presets: ['text-rise', 'text-slam', 'text-stretch', 'text-blur', 'text-flip', 'text-tracking', 'text-wave', 'text-3d', 'pop'] },
  { id: 'reveal', label: 'Reveal a picture', hint: 'Bring in a photo, screenshot or footage: wipes and masks feel deliberate, fades feel soft.',
    presets: ['wipe', 'soft-wipe', 'iris', 'blinds', 'slide', 'zoom', 'strip-in', 'brush', 'pixelate', 'image-swap'] },
  { id: 'attention', label: 'Draw attention', hint: 'Point at one thing that matters, once. Too many of these and nothing stands out.',
    presets: ['spotlight', 'callout', 'lift', 'glow', 'pulse', 'sheen', 'select-box', 'strike', 'jiggle', 'shake'] },
  { id: 'change', label: 'Change scenes', hint: 'Move from one part to the next: put it on a beat or at the end of a sentence.',
    presets: ['tr-slash', 'tr-whip', 'tr-zoom', 'tr-streak', 'tr-dip', 'tr-flash', 'tr-glitch', 'morph', 'portal'] },
  { id: 'numbers', label: 'Show numbers and data', hint: 'Counts, progress and charts: a number counting up is more convincing than one appearing.',
    presets: ['text-count', 'odometer', 'progress', 'grow', 'draw', 'timecode'] },
  { id: 'alive', label: 'Keep a frame alive', hint: 'Slow movement for held frames, so nothing sits completely still.',
    presets: ['drift', 'float', 'gradient-flow', 'particles', 'orbit-flat', 'liquid'] },
  { id: 'product', label: 'Show a product or app', hint: 'Walk through an interface: a cursor that clicks, a zoom into the detail, a page that scrolls.',
    presets: ['cursor-move', 'cursor-click', 'digital-zoom', 'scroll', 'select-box', 'glass', 'copies'] },
  { id: 'texture', label: 'Give it a look', hint: 'A style for the whole piece: film, print, tape, hand-drawn, or a colour grade.',
    presets: ['grade', 'film', 'scanlines', 'halftone', 'boil', 'text-outline', 'text-gradient', 'text-skew', 'recolor'] },
  { id: 'code', label: 'Explain code', hint: 'Type it, change it, run it, and point at the line that matters.',
    presets: ['code-type', 'code-edit', 'code-highlight', 'code-note', 'code-run'] },
];

/** The goals, each with only the presets that exist in this player. */
export const PRESET_GOALS: PresetGoal[] = GOALS.map((g) => ({ ...g, presets: g.presets.filter((id) => presetMeta[id]) })).filter((g) => g.presets.length);
