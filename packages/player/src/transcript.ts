import type { Layer, LayerLink, Scene } from './types';
import { SAFE_HREF } from './types';

/**
 * The scene's words as ordinary text, for search engines and screen readers.
 *
 * An animation shows its words a few at a time, scrambled, masked or duplicated for an effect, and a
 * crawler that renders the page sees whichever moment it catches. So every scene also carries its text
 * once, cleanly, in reading order: the headline as a heading, each act's headline one level below,
 * everything else as paragraphs. It is visually hidden (the animation is what people see) and the
 * animated stage is hidden from screen readers, so nothing is read twice.
 *
 * The WordPress element writes the same transcript into the page's HTML on the server (PHP port:
 * upw_studio_scene_transcript_items(), keep the two in step); the player keeps it, or writes one
 * itself where the page has none (an embed, the Studio's export).
 */

export const TRANSCRIPT_CLASS = 'upw-scene-text';

/** Visually hidden but read by screen readers and search engines (inline, so it holds before any CSS). */
export const VISUALLY_HIDDEN =
  'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap';

export interface TranscriptItem {
  /** 0 = a paragraph, 1-6 = a heading level. */
  level: number;
  text: string;
  /** A linked layer: the link, and the layer it belongs to (its focus ring shows on the stage). */
  link?: LayerLink;
  layer?: string;
}

interface Entry { text: string; size: number; at: number; y: number; x: number; container: number; model: boolean; link?: LayerLink; layer?: string }

/** Every text inside a layer, in order (a linked group reads as one link). */
function wordsIn(l: Layer): string {
  if (l.type === 'text') return clean(l.text);
  if (l.type === 'model' && l.model.kind === 'text') return clean(l.model.text ?? '');
  if (l.type === 'image' || l.type === 'video') return clean(l.alt ?? '');
  if (l.type === 'group') return clean(l.layers.map(wordsIn).filter(Boolean).join(' '));
  return '';
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** When a layer first shows: its start, or its first entrance clip if that comes later. */
function appearsAt(l: Layer, offset: number): number {
  // A group shows when its first layer does (its own clips may come later, an emphasis or a loop).
  if (l.type === 'group' && l.layers.length) return Math.min(...l.layers.map((c) => appearsAt(c, offset + (l.start ?? 0))));
  const ins = l.clips.filter((c) => !(c.params && c.params.direction === 'out')).map((c) => c.start);
  const own = l.start ?? 0;
  return offset + Math.max(own, ins.length ? Math.min(...ins) : own);
}

export function sceneTranscript(scene: Scene): TranscriptItem[] {
  const t = scene.transcript ?? {};
  if (t.decorative) return [];
  const headline = t.headline ?? 'h2';
  const top = headline === 'p' ? 0 : Number(headline.slice(1));

  // Every text layer (and 3D text), with when it appears and which top-level container (act) it is in.
  const entries: Entry[] = [];
  const walk = (list: Layer[], offset: number, container: number) => {
    list.forEach((l, i) => {
      const c = container < 0 ? (l.type === 'group' ? i : -1) : container;
      const at = appearsAt(l, offset);
      if (l.link && typeof l.link.href === 'string' && SAFE_HREF.test(l.link.href.trim())) {
        // A link reads as one item, never as part of a heading: its label, or the words it carries.
        const text = clean(l.link.label ?? '') || wordsIn(l) || l.link.href;
        entries.push({ text, size: 0, at, y: l.box?.y ?? 0, x: l.box?.x ?? 0, container: c, model: false, link: l.link, layer: l.id });
        return;
      }
      if (l.type === 'text' && clean(l.text)) entries.push({ text: clean(l.text), size: l.style.fontSize, at, y: l.box.y, x: l.box.x, container: c, model: false });
      if (l.type === 'model' && l.model.kind === 'text' && clean(l.model.text ?? '')) entries.push({ text: clean(l.model.text!), size: 0, at, y: l.box.y, x: l.box.x, container: c, model: true });
      if (l.type === 'group') walk(l.layers, offset + (l.start ?? 0), c);
    });
  };
  walk(scene.layers, 0, -1);
  if (!entries.length) return [];

  // Sizes: the median text size, and the biggest per container. 3D text is display-sized by nature, so
  // it counts as its container's headline (at least half again the median).
  const flat = entries.filter((e) => !e.model && !e.link).map((e) => e.size).sort((a, b) => a - b);
  const median = flat.length ? flat[Math.floor(flat.length / 2)] : 1;
  const maxIn = new Map<number, number>();
  for (const e of entries) if (!e.model && !e.link) maxIn.set(e.container, Math.max(maxIn.get(e.container) ?? 0, e.size));
  for (const e of entries) if (e.model) { e.size = Math.max(maxIn.get(e.container) ?? 0, median * 1.5); maxIn.set(e.container, e.size); }
  entries.sort((a, b) => a.at - b.at || a.y - b.y || a.x - b.x);
  const sceneMax = Math.max(0, ...maxIn.values());
  const sceneHead = entries.find((e) => !e.link && maxIn.get(e.container) === sceneMax)?.container ?? -2;

  // A container's headline: its biggest text, plus display-sized lines next to it ("Make it" + "MOVE.").
  const isBig = (e: Entry) => !e.link && e.size >= maxIn.get(e.container)! * 0.75 && (e.container === sceneHead || e.size >= median * 1.4);
  const isDisplay = (e: Entry) => !e.link && e.size >= maxIn.get(e.container)! * 0.3 && e.size >= median * 1.4;

  const items: TranscriptItem[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (isDisplay(e) || isBig(e)) {
      // A run of display lines in one container, read as one heading when it holds the headline.
      let j = i;
      while (j + 1 < entries.length && entries[j + 1].container === e.container && (isDisplay(entries[j + 1]) || isBig(entries[j + 1]))) j++;
      const run = entries.slice(i, j + 1);
      if (top && run.some(isBig)) {
        const text = run.map((r) => r.text).join(' ');
        if (!seen.has(text)) { seen.add(text); items.push({ level: e.container === sceneHead ? top : Math.min(6, top + 1), text }); }
        i = j;
        continue;
      }
    }
    if (e.link) {
      items.push({ level: 0, text: e.text, link: e.link, layer: e.layer });
      continue;
    }
    if (seen.has(e.text)) continue;
    seen.add(e.text);
    items.push({ level: 0, text: e.text });
  }
  return items;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The transcript as HTML (a visually hidden block), or '' for a decorative scene or one without text. */
export function transcriptHtml(scene: Scene): string {
  const items = sceneTranscript(scene);
  if (!items.length) return '';
  const body = items.map((i) => {
    if (i.link) {
      const tab = i.link.newTab ? ' target="_blank" rel="noopener"' : '';
      const jump = i.link.jump !== undefined && i.link.jump !== '' ? ` data-upw-jump="${esc(String(i.link.jump))}"` : '';
      return `<p><a href="${esc(i.link.href)}" data-upw-link="${esc(i.layer ?? '')}"${jump}${tab}>${esc(i.text)}</a></p>`;
    }
    return i.level ? `<h${i.level}>${esc(i.text)}</h${i.level}>` : `<p>${esc(i.text)}</p>`;
  }).join('');
  return `<div class="${TRANSCRIPT_CLASS}" style="${VISUALLY_HIDDEN}">${body}</div>`;
}
