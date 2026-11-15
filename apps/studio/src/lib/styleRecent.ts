import type { SceneStyle } from './styles';
import { STYLE_GROUPS } from './stylePreviews';

/*
 * Which styles the start screen shows: your own first, then the ones you used last, then a fixed mix that covers the
 * main uses. The rest are one click away in the Style library. Remembered in this browser.
 */

const KEY = 'upw-style-recent';
const SHOWN = 7;
/** A spread of the main uses: product, plain, explainers, data, social, and two with character. */
export const FEATURED = ['living-ui', 'clean', 'whiteboard', 'paper', 'data-story', 'social-captions', 'newsreel', 'neon-sign'];

export function recentStyles(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Remembers that a style was used (picked, applied, given to AI assist), newest first. */
export function noteStyle(id: string | null | undefined): void {
  if (!id) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([id, ...recentStyles().filter((x) => x !== id)].slice(0, 12)));
  } catch { /* Private mode: the fixed mix is shown. */ }
}

/** The styles for the start screen: seven, so with the "See all" tile they fill two rows of four. */
export function featuredStyles(all: SceneStyle[], recent = recentStyles()): SceneStyle[] {
  const by = new Map(all.map((s) => [s.id, s]));
  const ids = [...all.filter((s) => s.custom).slice(0, 2).map((s) => s.id), ...recent, ...FEATURED];
  const out: SceneStyle[] = [];
  for (const id of ids) {
    const s = by.get(id);
    if (s && !out.includes(s)) out.push(s);
    if (out.length === SHOWN) break;
  }
  return out;
}

/** The words a search looks through for a style: its name, description, look, fonts and group. */
export function styleWords(s: SceneStyle): string {
  const group = STYLE_GROUPS.filter((g) => g.styles.includes(s.id)).map((g) => g.label).join(' ');
  return [s.name, s.description, s.guide?.signs ?? '', s.fonts.heading, s.fonts.body, group, s.custom ? 'yours mine brand' : ''].join(' ').toLowerCase();
}

/** Styles matching every word of a search ("retro film", "chalk"). */
export function searchStyles(list: SceneStyle[], q: string): SceneStyle[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter((s) => { const w = styleWords(s); return words.every((x) => w.includes(x)); });
}
