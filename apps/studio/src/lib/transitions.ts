import type { Clip, GroupLayer, Layer, Scene } from '@unysonplus/scene-player/types';
import { groupDuration } from '@unysonplus/scene-player/groups';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { suggestedSound } from '@unysonplus/scene-player/sfx';
import { containerOf, layersIn, mapLayer } from './sceneOps';

/**
 * Transitions between groups: a matched exit on one group and entrance on the next, timed together,
 * built from ordinary presets (so they stay editable clips). A group's own clips run on its container's
 * clock, as does its start, so everything here is in that time.
 */

export type TransitionStyle = 'tear' | 'page' | 'tape' | 'crossfade' | 'push' | 'zoom' | 'wipe' | 'blinds' | 'iris' | 'turn' | 'slash' | 'flash' | 'dip' | 'whip' | 'glitch';
export type PushTo = 'left' | 'right' | 'up' | 'down';

export const TRANSITIONS: Array<{ id: TransitionStyle; label: string; hint: string }> = [
  { id: 'tear', label: 'Paper tear', hint: 'The sheet tears across the stage, revealing the next group behind the rip.' },
  { id: 'page', label: 'Page turn', hint: 'This group turns like a page from its left edge, uncovering the next.' },
  { id: 'tape', label: 'Tape pull', hint: 'A strip of tape is pulled across, taking this group with it.' },
  { id: 'slash', label: 'Slash', hint: 'A glowing diagonal line sweeps across the stage, cutting from this group to the next.' },
  { id: 'flash', label: 'Flash', hint: 'A burst of light: the cut happens at its brightest moment.' },
  { id: 'whip', label: 'Whip pan', hint: 'A fast slide with blur, as if the camera swung to the next group.' },
  { id: 'glitch', label: 'Glitch', hint: 'Slices jump and colours split for a few frames, then the cut.' },
  { id: 'dip', label: 'Dip to colour', hint: 'The screen fills with a colour, holds a beat and opens on the next group.' },
  { id: 'crossfade', label: 'Crossfade', hint: 'One fades out as the next fades in, with a slight scale.' },
  { id: 'push', label: 'Push', hint: 'Both move together: the next pushes this one off the stage.' },
  { id: 'zoom', label: 'Zoom through', hint: 'This one rushes past the camera with a blur as the next approaches from the distance.' },
  { id: 'wipe', label: 'Soft wipe', hint: 'A feathered seam sweeps across, swapping one for the other.' },
  { id: 'blinds', label: 'Blinds', hint: 'This one leaves in strips as the next arrives in strips.' },
  { id: 'iris', label: 'Iris', hint: 'The next opens in a circle over this one.' },
  { id: 'turn', label: '3D turn', hint: 'This one turns away to its edge; the next turns in from the other side.' },
];

const r2 = (v: number) => Math.round(v * 100) / 100;

/** The next group in time at the same level, if any. */
export function nextGroup(scene: Scene, groupId: string): GroupLayer | null {
  const list = layersIn(scene, containerOf(scene, groupId));
  const me = list.find((l) => l.id === groupId);
  if (!me) return null;
  const start = me.start ?? 0;
  const later = list.filter((l): l is GroupLayer => l.type === 'group' && l.id !== groupId && (l.start ?? 0) > start + 1e-6);
  later.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
  return later[0] ?? null;
}

/** When a group's own clock ends, in its container's time. */
export const groupEndTime = (g: GroupLayer) => (g.start ?? 0) + groupDuration(g);

/** How long before the transition starts the leaving group's layers' own exits are taken out. */
const EXIT_WINDOW = 1;

/** Transitions made as one matched pair of presets (same start and length on both groups). */
const PAIRED: Partial<Record<TransitionStyle, string>> = { tear: 'tr-tear', page: 'tr-page', tape: 'tr-tape', slash: 'tr-slash', flash: 'tr-flash', dip: 'tr-dip', whip: 'tr-whip', glitch: 'tr-glitch', zoom: 'tr-zoom' };

const isDir = (c: Clip, dir: 'in' | 'out') => {
  const meta = presetMeta[c.preset];
  if (!meta || !meta.fields.some((f) => f.key === 'direction')) return false;
  const d = c.params && 'direction' in c.params ? c.params.direction : meta.defaults.direction;
  return d === dir;
};

/**
 * Writes the transition from group A to group B: replaces A's exit clips and B's entrance clips at its
 * start, and moves B to start as the transition begins. Returns the new scene.
 */
export function applyTransition(scene: Scene, aId: string, bId: string, style: TransitionStyle, duration: number, pushTo: PushTo = 'left'): Scene {
  const all = layersIn(scene, containerOf(scene, aId));
  const a = all.find((l) => l.id === aId) as GroupLayer | undefined;
  const b = all.find((l) => l.id === bId) as GroupLayer | undefined;
  if (!a || !b) return scene;
  const d = Math.max(0.2, duration);
  const T = r2(Math.max(a.start ?? 0, groupEndTime(a) - d));
  const out = (preset: string, start: number, dur: number, params: Record<string, unknown>, ease?: string): Clip =>
    ({ id: `tr-out-${a.id}`, preset, start: r2(start), duration: r2(dur), params: { ...params, direction: 'out' }, ...(ease ? { ease } : {}) });
  const inn = (preset: string, start: number, dur: number, params: Record<string, unknown>, ease?: string): Clip =>
    ({ id: `tr-in-${b.id}`, preset, start: r2(start), duration: r2(dur), params: { ...params, direction: 'in' }, ...(ease ? { ease } : {}) });

  const opposite: Record<PushTo, string> = { left: 'right', right: 'left', up: 'bottom', down: 'top' };
  const toward: Record<PushTo, string> = { left: 'left', right: 'right', up: 'top', down: 'bottom' };
  let exit: Clip;
  let entry: Clip;
  const paired = PAIRED[style];
  if (paired) {
    const defaults = { ...(presetMeta[paired]?.defaults ?? {}) };
    delete defaults.direction;
    const side = style === 'whip' ? { from: opposite[pushTo] } : {};
    exit = out(paired, T, d, { ...defaults, ...side });
    entry = inn(paired, T, d, { ...defaults, ...side });
    // The cut's sound, once, on the arriving group.
    const sound = suggestedSound({ preset: paired, params: { direction: 'in' } });
    if (sound) entry.sound = { name: sound };
  } else switch (style) {
    case 'push':
      exit = out('slide', T, d, { from: toward[pushTo], distance: 140 }, 'power3.inOut');
      entry = inn('slide', T, d, { from: opposite[pushTo], distance: 140 }, 'power3.inOut');
      break;
    case 'zoom':
      exit = out('zoom', T, d * 0.8, { scale: 1.6 }, 'accelExit');
      entry = inn('zoom', T + d * 0.3, d * 0.7, { scale: 0.6 }, 'softLand');
      break;
    case 'wipe':
      exit = out('soft-wipe', T, d, { from: 'left', feather: 30 }, 'softInOut');
      entry = inn('soft-wipe', T, d, { from: 'left', feather: 30 }, 'softInOut');
      break;
    case 'blinds':
      exit = out('blinds', T, d * 0.7, { from: 'top', count: 8, stagger: 0.6 }, 'gentleIn');
      entry = inn('blinds', T + d * 0.4, d * 0.6, { from: 'top', count: 8, stagger: 0.6 }, 'softLand');
      break;
    case 'iris':
      exit = out('fade', T + d * 0.85, d * 0.15, { y: 0 }, 'none');
      entry = inn('iris', T, d, { x: 50, y: 50 }, 'softInOut');
      break;
    case 'turn':
      exit = out('turn', T, d / 2, { axis: 'y', angle: 90, perspective: 900 }, 'gentleIn');
      entry = inn('turn', T + d / 2, d / 2, { axis: 'y', angle: -90, perspective: 900 }, 'softLand');
      break;
    default:
      exit = out('fade', T, d, { y: 0, scale: 1.06 }, 'softInOut');
      entry = inn('fade', T, d, { y: 0, scale: 0.96 }, 'softInOut');
  }

  // B's start moves to where the transition begins; its own clips (container time) move with it.
  const shift = T - (b.start ?? 0);
  // The transition is how A leaves now: its layers' own exits in the last moments before it go too
  // (otherwise the transition would carry away an already empty group).
  const stripExits = (list: Layer[], offset: number): Layer[] => list.map((l) => {
    const clips = l.clips.filter((c) => !(isDir(c, 'out') && offset + c.start >= T - EXIT_WINDOW));
    return l.type === 'group' ? { ...l, clips, layers: stripExits(l.layers, offset + (l.start ?? 0)) } : { ...l, clips };
  });
  let next = mapLayer(scene, a.id, (l: Layer) => ({
    ...l,
    clips: [...l.clips.filter((c) => !c.id.startsWith('tr-out-') && !isDir(c, 'out')), exit],
    ...(l.type === 'group' ? { layers: stripExits(l.layers, l.start ?? 0) } : {}),
  }) as Layer);
  next = mapLayer(next, b.id, (l: Layer) => {
    const kept = l.clips
      .filter((c) => !c.id.startsWith('tr-in-') && !(isDir(c, 'in') && c.start <= (b.start ?? 0) + 0.05))
      .map((c) => ({ ...c, start: r2(Math.max(0, c.start + shift)) }));
    return { ...l, start: T || undefined, clips: [...kept, entry] } as Layer;
  });
  return next;
}
