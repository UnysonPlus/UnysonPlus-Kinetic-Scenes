import type { AudioClip, Clip, Layer, Scene, SpokenWord, WordPin } from './types';

/**
 * Word pins: layers and clips timed by what a voice says rather than by seconds. A pin names a voice clip and the word
 * (or phrase) said; applyWordPins moves everything pinned onto those words, so a re-recorded, reworded, trimmed or
 * translated voice re-times the scene by itself. The player applies pins whenever it plays a scene, and the editor
 * applies them as the voice changes, so the timeline always shows the real times.
 *
 * Times: a voice clip's words are timed from the start of its FILE; a word plays at clip.start + (t - offset). Inside a
 * group, layers and clips are in the group's own time, so a pinned moment is turned into that time.
 */

const r3 = (x: number) => Math.round(x * 1000) / 1000;
/** A word as compared: lower case, letters and digits only ("Don't," → "dont"). */
export const normWord = (w: string) => w.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]+/gu, '');
const tokens = (text: string) => text.split(/\s+/).map(normWord).filter(Boolean);

export interface PinMatch {
  /** Seconds from the start of the scene. */
  t: number;
  /** The clip the words were found in (a part of a voice cut by its words may hold them instead of the named one). */
  audio: string;
  /** The first word's index in that clip. */
  index: number;
}

/** Where in a clip's words a phrase is said: every starting index. */
function occurrences(words: SpokenWord[], want: string[]): number[] {
  const out: number[] = [];
  if (!want.length) return out;
  const said = words.map((w) => normWord(w.w));
  for (let i = 0; i + want.length <= said.length; i++) {
    let ok = true;
    for (let k = 0; k < want.length; k++) if (said[i + k] !== want[k]) { ok = false; break; }
    if (ok) out.push(i);
  }
  return out;
}

/** How alike two strings are, 0 to 1 (1 - edit distance / longer length). */
function likeness(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return 1 - prev[b.length] / Math.max(a.length, b.length);
}

/** Close enough to count as the phrase said: speech recognition mishears ("exceso" for "acceso", "frango work" for "framework"). */
export const PIN_LIKENESS = 0.72;

/**
 * Where a phrase is said when it is not heard word for word: the stretch of words (one word more or fewer allowed) that
 * is spelled most like it, if alike enough. Returns { index, count } or null.
 */
function closest(words: SpokenWord[], want: string[], hint?: number): { index: number; count: number } | null {
  const said = words.map((w) => normWord(w.w));
  const target = want.join('');
  // Short words are too easily confused ("the" and "they"): they must be heard as written.
  if (target.length < 5) return null;
  let best: { index: number; count: number; score: number } | null = null;
  for (let count = Math.max(1, want.length - 1); count <= want.length + 1; count++) {
    for (let i = 0; i + count <= said.length; i++) {
      const score = likeness(said.slice(i, i + count).join(''), target);
      if (score < PIN_LIKENESS) continue;
      const better = !best || score > best.score + 1e-9
        || (Math.abs(score - best.score) <= 1e-9 && typeof hint === 'number' && Math.abs(i - hint) < Math.abs(best.index - hint));
      if (better) best = { index: i, count, score };
    }
  }
  return best ? { index: best.index, count: best.count } : null;
}

/** The moment a pin points at, or null when its voice or its words are not there. */
export function pinTime(scene: Pick<Scene, 'audio'>, pin: WordPin): PinMatch | null {
  const audio = scene.audio ?? [];
  const named = audio.find((a) => a.id === pin.audio);
  if (!named) return null;
  // The named clip first; then the other parts of the same recording (editing by the words splits a voice into parts).
  const pool: AudioClip[] = [named, ...(named.group ? audio.filter((a) => a !== named && a.group === named.group) : [])];
  const want = tokens(pin.text);
  // Heard word for word first (in every part of the recording), then the closest spelling.
  for (const pass of ['exact', 'close'] as const) for (const clip of pool) {
    const words = clip.words ?? [];
    const hint = clip === named ? pin.index : undefined;
    let near = -1, count = want.length;
    if (pass === 'exact') {
      const found = occurrences(words, want);
      if (!found.length) continue;
      // The occurrence nearest the remembered index (the same word, said more than once, keeps its place).
      near = typeof hint === 'number' ? found.reduce((b, i) => (Math.abs(i - hint) < Math.abs(b - hint) ? i : b), found[0]) : found[0];
    } else {
      const c = want.length ? closest(words, want, hint) : null;
      if (!c) continue;
      near = c.index; count = c.count;
    }
    const first = words[near], last = words[near + count - 1];
    const fileT = pin.edge === 'end' ? last.t + last.d : first.t;
    const t = clip.start + (fileT - (clip.offset ?? 0)) + (pin.offset ?? 0);
    return { t: r3(Math.max(0, t)), audio: clip.id, index: near };
  }
  return null;
}

export interface PinProblem { layerId: string; clipId?: string; pin: WordPin; reason: 'audio' | 'words' }

/**
 * The scene with every pinned layer and clip moved onto its word. A layer pinned with `at` moves as a whole (its end
 * and its clips with it); `until` sets its end; a clip's `at` sets its start. Pins whose words are not found leave
 * things where they are and are reported. Returns the same scene object when nothing moved.
 */
export function applyWordPins(scene: Scene): { scene: Scene; problems: PinProblem[]; moved: number } {
  const problems: PinProblem[] = [];
  let moved = 0;
  if (!(scene.audio ?? []).length && !hasPins(scene.layers)) return { scene, problems, moved };

  const at = (pin: WordPin, layerId: string, clipId?: string): PinMatch | null => {
    const m = pinTime(scene, pin);
    if (!m) problems.push({ layerId, clipId, pin, reason: (scene.audio ?? []).some((a) => a.id === pin.audio) ? 'words' : 'audio' });
    return m;
  };
  // The pin, its index brought up to date (so the same word is found again after more edits).
  const kept = (pin: WordPin, m: PinMatch): WordPin => (m.audio === pin.audio && m.index !== pin.index ? { ...pin, index: m.index } : pin);

  const walk = (list: Layer[], base: number): Layer[] => {
    let changed = false;
    const out = list.map((layer) => {
      let l = layer;
      if (l.at) {
        const m = at(l.at, l.id);
        if (m) {
          const delta = r3(m.t - base - (l.start ?? 0));
          if (Math.abs(delta) > 0.0005) {
            moved++;
            l = {
              ...l,
              start: r3((l.start ?? 0) + delta),
              ...(typeof l.end === 'number' ? { end: r3(l.end + delta) } : {}),
              clips: l.clips.map((c) => ({ ...c, start: r3(c.start + delta) })),
            } as Layer;
          }
          const pin = kept(l.at!, m);
          if (pin !== l.at) l = { ...l, at: pin } as Layer;
        }
      }
      if (l.until) {
        const m = at(l.until, l.id);
        if (m) {
          const end = r3(m.t - base);
          if (typeof l.end !== 'number' || Math.abs(l.end - end) > 0.0005) { moved++; l = { ...l, end } as Layer; }
          const pin = kept(l.until!, m);
          if (pin !== l.until) l = { ...l, until: pin } as Layer;
        }
      }
      if (l.clips.some((c) => c.at)) {
        let clipsChanged = false;
        const clips = l.clips.map((c): Clip => {
          if (!c.at) return c;
          const m = at(c.at, l.id, c.id);
          if (!m) return c;
          const start = r3(m.t - base);
          const pin = kept(c.at, m);
          const move = Math.abs(start - c.start) > 0.0005;
          if (!move && pin === c.at) return c;
          if (move) moved++;
          clipsChanged = true;
          return { ...c, start: move ? start : c.start, at: pin };
        });
        if (clipsChanged) l = { ...l, clips } as Layer;
      }
      if (l.type === 'group') {
        const layers = walk(l.layers, base + (l.start ?? 0));
        if (layers !== l.layers) l = { ...l, layers } as Layer;
      }
      if (l.type === 'repeat') {
        const [item] = walk([l.item], base);
        if (item !== l.item) l = { ...l, item } as Layer;
      }
      if (l !== layer) changed = true;
      return l;
    });
    return changed ? out : list;
  };

  const layers = walk(scene.layers, 0);
  return { scene: layers === scene.layers ? scene : { ...scene, layers }, problems, moved };
}

function hasPins(list: Layer[]): boolean {
  return list.some((l) => !!(l.at || l.until || l.clips.some((c) => c.at)
    || (l.type === 'group' && hasPins(l.layers)) || (l.type === 'repeat' && hasPins([l.item]))));
}

/** Every pin in the scene, with where it sits (for the editor's list and the AI Dev Kit). */
export function wordPins(scene: Scene): Array<{ layerId: string; clipId?: string; kind: 'at' | 'until'; pin: WordPin }> {
  const out: Array<{ layerId: string; clipId?: string; kind: 'at' | 'until'; pin: WordPin }> = [];
  const walk = (list: Layer[]) => list.forEach((l) => {
    if (l.at) out.push({ layerId: l.id, kind: 'at', pin: l.at });
    if (l.until) out.push({ layerId: l.id, kind: 'until', pin: l.until });
    l.clips.forEach((c) => { if (c.at) out.push({ layerId: l.id, clipId: c.id, kind: 'at', pin: c.at }); });
    if (l.type === 'group') walk(l.layers);
    if (l.type === 'repeat') walk([l.item]);
  });
  walk(scene.layers);
  return out;
}
