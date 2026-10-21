import type { AudioClip, CaptionsLayer } from './types';

/**
 * Captions from a transcribed voice-over: the words are grouped into short chunks (broken at pauses,
 * sentence ends and the word limit), one chunk is on screen at a time, and the word being said is lit.
 * Drawn from the scene's time after every update, so captions seek and export exactly.
 */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FALLBACK_FONTS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

interface Word { w: string; at: number; end: number }
interface Chunk { words: Word[]; start: number; end: number }

const chunkCache = new WeakMap<CaptionsLayer, { key: AudioClip | undefined; chunks: Chunk[] }>();

/** The voice-over a captions layer follows: the one it names, else the first voice (or any clip with words). */
export function captionSource(layer: CaptionsLayer, audio: AudioClip[] | undefined): AudioClip | undefined {
  const list = audio ?? [];
  return list.find((a) => a.id === layer.audio) ?? list.find((a) => a.role === 'voice' && a.words?.length) ?? list.find((a) => a.words?.length);
}

function chunksOf(layer: CaptionsLayer, clip: AudioClip | undefined): Chunk[] {
  const hit = chunkCache.get(layer);
  if (hit && hit.key === clip) return hit.chunks;
  const words: Word[] = [];
  if (clip?.words) {
    const off = clip.offset ?? 0;
    const limit = clip.duration ?? Infinity;
    for (const w of clip.words) {
      if (w.t < off || w.t - off > limit) continue;
      if (/^(uh+|um+|erm|hmm+)[,.!?]*$/i.test(w.w)) continue;
      const at = clip.start + (w.t - off);
      words.push({ w: w.w, at, end: at + w.d });
    }
  }
  const max = Math.max(1, Math.min(12, Math.round(layer.maxWords ?? 4)));
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const push = () => { if (cur.length) chunks.push({ words: cur, start: cur[0].at, end: cur[cur.length - 1].end }); cur = []; };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (cur.length >= max || (prev && w.at - prev.end >= 0.3) || /[.!?]["')]*$/.test(prev?.w ?? '') || (/[,;:]$/.test(prev?.w ?? '') && cur.length >= 2))) push();
    cur.push(w);
  });
  push();
  // Each chunk stays until the next starts (or a moment after its last word).
  chunks.forEach((c, i) => { c.end = Math.min(chunks[i + 1]?.start ?? Infinity, c.end + 0.6); });
  chunkCache.set(layer, { key: clip, chunks });
  return chunks;
}

export function buildCaptions(inner: HTMLElement, layer: CaptionsLayer) {
  inner.textContent = '';
  const s = layer.style;
  Object.assign(inner.style, {
    fontFamily: s.fontFamily ? `"${s.fontFamily.replace(/"/g, '')}", ${FALLBACK_FONTS}` : FALLBACK_FONTS,
    fontSize: `${s.fontSize}cqw`, fontWeight: String(s.fontWeight ?? 800), lineHeight: String(s.lineHeight ?? 1.15),
    color: s.color ?? '#ffffff', textAlign: s.align ?? 'center', textTransform: layer.uppercase || s.uppercase ? 'uppercase' : '',
    letterSpacing: typeof s.letterSpacing === 'number' ? `${s.letterSpacing}em` : '',
  });
  const line = inner.ownerDocument.createElement('div');
  line.className = 'upw-cap';
  Object.assign(line.style, { display: 'inline-block', padding: layer.background ? '0.18em 0.5em' : '0', borderRadius: '0.25em', background: layer.background ?? '', opacity: '0' });
  inner.appendChild(line);
}

export function drawCaptions(inner: HTMLElement, layer: CaptionsLayer, audio: AudioClip[] | undefined, time: number) {
  const line = inner.querySelector<HTMLElement>(':scope > .upw-cap');
  if (!line) return;
  const chunks = chunksOf(layer, captionSource(layer, audio));
  const k = chunks.findIndex((c) => time >= c.start - 0.05 && time < c.end);
  if (k < 0) {
    line.style.opacity = '0';
    line.style.transform = '';
    if (line.dataset.k !== '') { line.innerHTML = ''; line.dataset.k = ''; }
    return;
  }
  const c = chunks[k];
  if (line.dataset.k !== String(k)) {
    line.innerHTML = c.words.map((w) => `<span>${esc(w.w)}</span>`).join(' ');
    line.dataset.k = String(k);
  }
  const hl = layer.highlight ?? '#ffd166';
  const mode = layer.mode ?? 'word';
  const motion = layer.motion ?? 'pop';
  const spans = Array.from(line.children) as HTMLElement[];
  c.words.forEach((w, i) => {
    const said = time >= w.at;
    const now = said && (time < w.end || i === c.words.length - 1 || time < c.words[i + 1].at);
    const lit = mode === 'karaoke' ? said : mode === 'word' ? now : false;
    const sp = spans[i];
    sp.style.color = lit ? hl : '';
    if (motion === 'pop') return;
    // Word by word: each one arrives as it is said.
    sp.style.display = 'inline-block';
    const u = Math.max(0, Math.min(1, (time - w.at + 0.04) / (motion === 'slam' ? 0.14 : 0.32)));
    sp.style.opacity = time >= w.at - 0.04 ? '1' : '0';
    if (motion === 'slam') sp.style.transform = `scale(${(1 + 0.7 * (1 - u) ** 2).toFixed(4)})`;
    else {
      const n = 7.5625, d = 2.75;
      const b = u < 1 / d ? n * u * u : u < 2 / d ? n * (u - 1.5 / d) ** 2 + 0.75 : u < 2.5 / d ? n * (u - 2.25 / d) ** 2 + 0.9375 : n * (u - 2.625 / d) ** 2 + 0.984375;
      sp.style.transform = `translateY(${(-0.9 * (1 - b)).toFixed(4)}em)`;
    }
  });
  // Each chunk arrives with a small pop.
  const a = Math.max(0, Math.min(1, (time - (c.start - 0.05)) / 0.14));
  line.style.opacity = a.toFixed(3);
  line.style.transform = `scale(${(0.92 + 0.08 * a).toFixed(4)})`;
}
