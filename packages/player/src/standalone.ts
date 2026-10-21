import { gsap } from 'gsap';
import type { Clip, Layer } from './types';
import { buildText, type LayerRefs } from './dom';
import { injectStyles } from './styles';
import { presets, presetRand } from './presets';
import { seedFrom } from './random';
import { resolveEase } from './eases';
import { defaultEaseFor } from './presets/catalog';

/**
 * A preset on an ordinary element of a page (no scene, no stage): the same animation the Studio uses, so an effect
 * is built once and used both in scenes and on a page's own headings, pictures and buttons (the Animation
 * Engine's "Kinetic Scenes preset" does this in WordPress).
 */

export interface PlayPresetOptions {
  /** Seconds (default: the preset's own length). */
  duration?: number;
  /** Seconds before it starts. */
  delay?: number;
  /** A named ease or a GSAP ease (default: the preset's own). */
  ease?: string;
  /** The preset's settings (direction, from, …). */
  params?: Record<string, unknown>;
  /** Treat the element as this kind of layer (default: text for plain words, else shape). */
  as?: Layer['type'];
  /** Start straight away (default true); otherwise call play(). */
  autoplay?: boolean;
}

export interface PresetPlayback {
  timeline: gsap.core.Timeline;
  play(): void;
  /** Back to the start, ready to play again. */
  reset(): void;
  /** Stops it and puts the element back as it was. */
  destroy(): void;
}

let count = 0;

/** Plain words only (no pictures, controls or block elements inside): the element can be split into words and letters. */
function isPlainText(el: HTMLElement) {
  if (!el.textContent?.trim()) return false;
  return !el.querySelector('img, video, svg, canvas, iframe, input, button, select, textarea, div, p, ul, ol, table, section, figure');
}

export function playPreset(el: HTMLElement, presetId: string, opts: PlayPresetOptions = {}): PresetPlayback {
  const preset = presets[presetId];
  if (!preset) throw new Error(`There is no preset "${presetId}".`);
  if (presetId === 'code') throw new Error('Custom code clips only run inside scenes.');
  const doc = el.ownerDocument;
  injectStyles(doc);
  const textual = opts.as ? opts.as === 'text' : preset.appliesTo.includes('text') && isPlainText(el);
  const type: Layer['type'] = opts.as ?? (textual ? 'text' : preset.appliesTo.includes('shape') ? 'shape' : preset.appliesTo[0]);
  if (!preset.appliesTo.includes(type)) throw new Error(`"${preset.label}" does not work on this kind of element.`);
  const original = el.innerHTML;
  const originalStyle = el.getAttribute('style');
  const id = `kp${++count}`;
  const params = { ...preset.defaults, ...(opts.params ?? {}) };
  const duration = Math.max(0.05, opts.duration ?? preset.defaultDuration);
  const clip: Clip = { id: `${id}c`, preset: presetId, start: 0, duration, params };
  const layer = { id, type, clips: [clip], box: { x: 50, y: 50 }, ...(type === 'text' ? { text: el.textContent ?? '', style: { fontSize: 1 } } : {}) } as unknown as Layer;
  const refs = { layer, outer: el, inner: el, words: [], chars: [] } as unknown as LayerRefs;
  // Text is animated on its words, not the whole block (a paragraph is as wide as the page): the presets work on
  // the visible words' own box.
  let target = el;
  if (type === 'text') {
    buildText(doc, refs, (el.textContent ?? '').replace(/\s+/g, ' ').trim());
    const words = el.querySelector<HTMLElement>(':scope > .upw-txt');
    if (words) { words.style.display = 'inline-block'; words.style.position = 'relative'; target = words; }
  }
  const late: Array<() => void> = [];
  const tl = gsap.timeline({ paused: true, delay: Math.max(0, opts.delay ?? 0), onUpdate: () => late.forEach((fn) => { try { fn(); } catch { /* keep going */ } }) });
  tl.set({}, {}, duration);
  preset.build({
    tl, layer, clip, el: target, words: refs.words, chars: refs.chars, at: 0, duration,
    ease: resolveEase(opts.ease ?? defaultEaseFor(preset, params)),
    params, first: true, rand: presetRand(seedFrom(`${presetId}/${id}`)), gsap, allowCode: false,
    late: (fn) => { late.push(fn); }, now: () => tl.time(), sceneAudio: [], sceneNow: () => tl.time(),
  });
  tl.progress(0);
  if (opts.autoplay !== false) tl.play();
  return {
    timeline: tl,
    play: () => { tl.restart(true); },
    reset: () => { tl.pause(); tl.progress(0); },
    destroy: () => {
      tl.kill();
      el.innerHTML = original;
      if (originalStyle === null) el.removeAttribute('style'); else el.setAttribute('style', originalStyle);
    },
  };
}
