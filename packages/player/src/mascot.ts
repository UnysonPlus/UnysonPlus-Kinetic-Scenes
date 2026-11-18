import type { AudioClip, Clip, MascotFaceBox, MascotLayer, MascotPose } from './types';

/**
 * Mascot layers: a character that talks on the voice-over.
 *
 * Built once as one figure per pose (its picture, plus the moving parts of its face cut from the same picture), then
 * drawn from the scene's time after every update, like captions: the pose a Pose clip picks (else the default), the
 * mouth opening on the sounds of the word being said, a blink now and then, and a slow breath. No canvas: the mouth
 * and eyelids are pieces of the pose picture itself (CSS background crops), so it works with pictures from any address
 * and the renderer waits for them like any other picture.
 *
 * The mouth: its lower half (the lower lip) moves down while a dark opening grows behind it. The eyelids: the skin just
 * above each eye slides down over it, with a lash line at its edge.
 */

/** A Pose clip: the mascot holds this pose for the clip's length (params.pose = a pose id). */
export const MASCOT_POSE_PRESET = 'mascot-pose';

/** How far the mouth opens on each letter (0 shut, 1 wide). Timed letter by letter across the word. */
const OPEN: Record<string, number> = {
  a: 1, o: 0.85, e: 0.68, i: 0.55, u: 0.6, y: 0.5,
  m: 0, b: 0, p: 0,
  f: 0.12, v: 0.12,
  w: 0.38, r: 0.38, l: 0.4, t: 0.35, d: 0.38, n: 0.35, h: 0.45, k: 0.42, g: 0.42, q: 0.42,
  s: 0.25, z: 0.25, c: 0.3, j: 0.3, x: 0.3,
};

interface SaidLetter { at: number; end: number; open: number }
const cache = new WeakMap<MascotLayer, { key: string; letters: SaidLetter[] }>();

/** The voice-over a mascot talks on: the one it names, else the first voice with words (and its other parts). */
function voiceClips(layer: MascotLayer, audio: AudioClip[] | undefined): AudioClip[] {
  const list = audio ?? [];
  const src = list.find((a) => a.id === layer.audio) ?? list.find((a) => a.role === 'voice' && a.words?.length) ?? list.find((a) => a.words?.length);
  if (!src) return [];
  return src.group ? list.filter((a) => a.group === src.group).sort((x, y) => x.start - y.start) : [src];
}

/** Every letter spoken, with when it is said and how open the mouth is on it. */
function lettersOf(layer: MascotLayer, clips: AudioClip[]): SaidLetter[] {
  const key = clips.map((c) => `${c.id}:${c.start}:${c.offset ?? 0}:${c.duration ?? ''}:${c.words?.length ?? 0}`).join('|');
  const hit = cache.get(layer);
  if (hit && hit.key === key) return hit.letters;
  const letters: SaidLetter[] = [];
  for (const clip of clips) {
    const off = clip.offset ?? 0, limit = clip.duration ?? Infinity;
    for (const w of clip.words ?? []) {
      if (w.t < off || w.t - off > limit) continue;
      const chars = w.w.toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '');
      const at = clip.start + (w.t - off), d = Math.max(0.06, w.d);
      if (!chars.length) continue;
      // Double letters and silent endings make no extra shape: "ll" is one L, a final "e" after a consonant is quiet.
      const sounds: number[] = [];
      for (let i = 0; i < chars.length; i++) {
        if (i > 0 && chars[i] === chars[i - 1]) continue;
        if (i === chars.length - 1 && chars[i] === 'e' && i > 1 && !'aeiouy'.includes(chars[i - 1])) continue;
        sounds.push(OPEN[chars[i]] ?? 0.3);
      }
      const step = d / sounds.length;
      sounds.forEach((open, i) => letters.push({ at: at + i * step, end: at + (i + 1) * step, open }));
    }
  }
  letters.sort((x, y) => x.at - y.at);
  cache.set(layer, { key, letters });
  return letters;
}

/** How open the mouth is at a moment (0-1): eased between the shapes of the letters, shut between words. */
export function mouthOpen(layer: MascotLayer, audio: AudioClip[] | undefined, time: number): number {
  const letters = lettersOf(layer, voiceClips(layer, audio));
  if (!letters.length) return 0;
  // The letter being said (binary search), and its neighbour, for a smooth move from one shape to the next.
  let lo = 0, hi = letters.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (letters[mid].at <= time) lo = mid; else hi = mid - 1; }
  const cur = letters[lo];
  if (time < cur.at - 0.06) return 0;
  // Before the first letter of a word / after the last: open from and close to shut over a few frames.
  if (time < cur.at) return cur.open * (1 - (cur.at - time) / 0.06);
  if (time >= cur.end) {
    const next = letters[lo + 1];
    const gap = next ? next.at - cur.end : Infinity;
    if (gap < 0.08) return cur.open + (next!.open - cur.open) * ((time - cur.end) / Math.max(0.001, gap));
    return Math.max(0, cur.open * (1 - (time - cur.end) / 0.07));
  }
  // Inside the letter: ease from its shape toward the next letter's in its last third.
  const u = (time - cur.at) / Math.max(0.001, cur.end - cur.at);
  const next = letters[lo + 1];
  if (u < 0.66 || !next || next.at - cur.end > 0.02) return cur.open;
  const k = (u - 0.66) / 0.34;
  return cur.open + (next.open - cur.open) * k * k * (3 - 2 * k);
}

/** A repeatable random number from a text and an index. */
function rand(seed: string, i: number) {
  let h = 2166136261 ^ i;
  for (let k = 0; k < seed.length; k++) h = Math.imul(h ^ seed.charCodeAt(k), 16777619);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
}

/** How shut the eyes are at a moment (0 open, 1 shut): a quick blink every 2.5-5.5 s, the same every time it plays. */
export function blinkAt(layer: MascotLayer, time: number): number {
  if (layer.blink === false || time < 0) return 0;
  let t = 1.1 + rand(layer.id, 0) * 1.6;
  for (let i = 1; t <= time + 0.2 && i < 2000; i++) {
    const d = 0.17;
    if (time >= t && time < t + d) { const u = (time - t) / d; return u < 0.45 ? u / 0.45 : 1 - (u - 0.45) / 0.55; }
    // Now and then a double blink.
    t += rand(layer.id, i) < 0.15 ? 0.32 : 2.5 + rand(layer.id, i + 7000) * 3;
  }
  return 0;
}

/** The pose at a moment: the latest Pose clip playing, else the layer's default, else the first. */
export function poseAt(layer: MascotLayer, time: number): { pose: MascotPose | undefined; since: number } {
  let best: Clip | undefined;
  for (const c of layer.clips) {
    if (c.preset !== MASCOT_POSE_PRESET || time < c.start || time >= c.start + c.duration) continue;
    if (!best || c.start >= best.start) best = c;
  }
  const want = best?.params?.pose ?? layer.pose;
  const pose = layer.poses.find((p) => p.id === want) ?? layer.poses[0];
  // When the pose last changed (for the small settle as it switches).
  let since = -Infinity;
  if (best) since = best.start;
  else for (const c of layer.clips) if (c.preset === MASCOT_POSE_PRESET && c.start + c.duration <= time) since = Math.max(since, c.start + c.duration);
  return { pose, since };
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;
const url = (src: string) => `url("${src.replace(/"/g, '%22')}")`;

/** A piece of the pose picture (the region `from`) shown at `at` (the same size). */
function crop(doc: Document, src: string, at: MascotFaceBox, from: MascotFaceBox = at) {
  const el = doc.createElement('div');
  const bx = from.w >= 1 ? 0 : from.x / (1 - from.w), by = from.h >= 1 ? 0 : from.y / (1 - from.h);
  Object.assign(el.style, {
    position: 'absolute', left: pct(at.x), top: pct(at.y), width: pct(at.w), height: pct(at.h),
    backgroundImage: url(src), backgroundRepeat: 'no-repeat',
    backgroundSize: `${pct(1 / from.w)} ${pct(1 / from.h)}`, backgroundPosition: `${pct(bx)} ${pct(by)}`,
    pointerEvents: 'none',
  });
  return el;
}

export function buildMascot(doc: Document, inner: HTMLElement, layer: MascotLayer) {
  inner.textContent = '';
  Object.assign(inner.style, { position: 'relative', overflow: 'visible' });
  for (const pose of layer.poses) {
    const fig = doc.createElement('div');
    fig.className = 'upw-mascot-pose';
    fig.dataset.pose = pose.id;
    Object.assign(fig.style, { position: 'absolute', left: '50%', top: '50%', display: 'none', transformOrigin: '50% 100%' });
    const img = doc.createElement('img');
    img.src = pose.src;
    img.alt = '';
    img.draggable = false;
    Object.assign(img.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block', pointerEvents: 'none', userSelect: 'none' });
    fig.appendChild(img);
    const m = pose.mouth;
    if (m) {
      // The opening (behind), then the lower lip, which moves down over the chin.
      const hole = doc.createElement('div');
      hole.className = 'upw-mascot-hole';
      Object.assign(hole.style, {
        position: 'absolute', left: pct(m.x + m.w * 0.16), width: pct(m.w * 0.68), top: pct(m.y + m.h * 0.42), height: '0',
        borderRadius: '0 0 50% 50% / 0 0 100% 100%', background: 'radial-gradient(ellipse at 50% 30%, #4a1f22 0%, #2a0f12 65%, #1a080a 100%)', pointerEvents: 'none',
      });
      fig.appendChild(hole);
      const jaw = crop(doc, pose.src, { x: m.x, y: m.y + m.h / 2, w: m.w, h: m.h / 2 });
      jaw.className = 'upw-mascot-jaw';
      fig.appendChild(jaw);
    }
    if (!pose.eyesClosed) for (const e of pose.eyes ?? []) {
      // The eyelid: the skin just above the eye, slid down over it.
      const above = { x: e.x, y: Math.max(0, e.y - e.h), w: e.w, h: e.h };
      const lid = doc.createElement('div');
      lid.className = 'upw-mascot-lid';
      Object.assign(lid.style, { position: 'absolute', left: pct(e.x), top: pct(e.y), width: pct(e.w), height: pct(e.h), overflow: 'hidden', pointerEvents: 'none', opacity: '0' });
      const skin = crop(doc, pose.src, { x: 0, y: 0, w: 1, h: 1 }, above);
      Object.assign(skin.style, { left: '0', top: '0', width: '100%', height: '100%', transformOrigin: '50% 0', borderRadius: '0 0 45% 45%' });
      lid.appendChild(skin);
      const lash = doc.createElement('div');
      Object.assign(lash.style, { position: 'absolute', left: '6%', width: '88%', height: '9%', minHeight: '1px', top: '0', borderRadius: '50%', background: 'rgba(28,18,20,.9)' });
      lid.appendChild(lash);
      fig.appendChild(lid);
    }
    inner.appendChild(fig);
  }
  if (layer.alt) { inner.setAttribute('role', 'img'); inner.setAttribute('aria-label', layer.alt); }
  else inner.setAttribute('aria-hidden', 'true');
}

export function drawMascot(inner: HTMLElement, layer: MascotLayer, audio: AudioClip[] | undefined, time: number) {
  const { pose, since } = poseAt(layer, time);
  const figs = inner.querySelectorAll<HTMLElement>(':scope > .upw-mascot-pose');
  const W = inner.clientWidth, H = inner.clientHeight;
  figs.forEach((fig) => {
    const on = !!pose && fig.dataset.pose === pose.id;
    fig.style.display = on ? 'block' : 'none';
    if (!on || !pose) return;
    // The picture fits inside the layer's box, keeping its shape.
    const r = pose.ratio > 0 ? pose.ratio : 1;
    const w = W / H > r ? H * r : W, h = w / r;
    fig.style.width = `${w}px`;
    fig.style.height = `${h}px`;
    const open = Math.max(0, Math.min(1.5, mouthOpen(layer, audio, time) * (layer.talk ?? 1)));
    // Breathing, a touch of movement while talking, and a small settle as a new pose arrives.
    const breathe = layer.breathe === false ? 0 : Math.sin(time * 2 * Math.PI / 3.6);
    const settle = time - since < 0.22 ? 1 - (time - since) / 0.22 : 0;
    const sy = 1 + 0.008 * breathe + (layer.breathe === false ? 0 : 0.012 * open) + 0.05 * settle * settle;
    const sx = 1 - 0.004 * breathe + 0.03 * settle * settle;
    fig.style.transform = `translate(-50%, -50%) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
    const m = pose.mouth;
    if (m) {
      const hole = fig.querySelector<HTMLElement>('.upw-mascot-hole');
      const jaw = fig.querySelector<HTMLElement>('.upw-mascot-jaw');
      const drop = open * 0.55; // in mouth heights
      if (hole) hole.style.height = pct(Math.max(0, m.h * (drop + (open > 0.02 ? 0.08 : 0))));
      if (jaw) jaw.style.transform = `translateY(${(drop * 200).toFixed(2)}%)`;
    }
    const shut = pose.eyesClosed ? 0 : blinkAt(layer, time);
    fig.querySelectorAll<HTMLElement>('.upw-mascot-lid').forEach((lid) => {
      lid.style.opacity = shut > 0.02 ? '1' : '0';
      const skin = lid.firstElementChild as HTMLElement | null, lash = lid.lastElementChild as HTMLElement | null;
      if (skin) skin.style.transform = `scaleY(${shut.toFixed(3)})`;
      if (lash) { lash.style.top = pct(Math.max(0, shut * 0.92 - 0.04)); lash.style.opacity = Math.min(1, Math.max(0, (shut - 0.15) * 2.5)).toFixed(3); }
    });
  });
}
