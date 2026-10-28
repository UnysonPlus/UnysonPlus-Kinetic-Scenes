/**
 * Lottie animation data, read and changed without the Lottie runtime: the colours and texts an animation uses, so the
 * Studio can list them, and the same animation with some recoloured or reworded (applied before it plays).
 * Colours in Lottie are [r, g, b, a] from 0 to 1, on fills ("fl") and strokes ("st"), still or keyframed.
 */

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => !!v && typeof v === 'object' && !Array.isArray(v);
const hex2 = (n: number) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0');
export const lottieHex = (c: number[]) => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}`;
const toRgb = (h: string): number[] | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
  return m ? [0, 2, 4].map((k) => parseInt(m[1].slice(k, k + 2), 16) / 255) : null;
};

/** Every colour array in a fill or stroke: a still value, or each keyframe's start and end. */
function colourSlots(data: unknown, visit: (arr: number[]) => void) {
  const walk = (v: unknown) => {
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (!isObj(v)) return;
    if ((v.ty === 'fl' || v.ty === 'st') && isObj(v.c)) {
      const k = (v.c as Json).k;
      if (Array.isArray(k) && typeof k[0] === 'number') visit(k as number[]);
      else if (Array.isArray(k)) for (const kf of k) if (isObj(kf)) for (const key of ['s', 'e']) if (Array.isArray(kf[key]) && typeof (kf[key] as unknown[])[0] === 'number') visit(kf[key] as number[]);
    }
    for (const x of Object.values(v)) walk(x);
  };
  walk(data);
}

/** Every text in the animation's text layers (each keyframe of a text). */
function textSlots(data: unknown, visit: (doc: Json) => void) {
  const walk = (v: unknown) => {
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (!isObj(v)) return;
    if (v.ty === 5 && isObj(v.t) && isObj((v.t as Json).d)) {
      const k = ((v.t as Json).d as Json).k;
      if (Array.isArray(k)) for (const kf of k) if (isObj(kf) && isObj(kf.s) && typeof (kf.s as Json).t === 'string') visit(kf.s as Json);
    }
    for (const x of Object.values(v)) walk(x);
  };
  walk(data);
}

/** The animation's colours (most used first) and texts, its length and frame rate. */
export function lottieInfo(data: unknown): { colours: string[]; texts: string[]; seconds: number; fps: number; width: number; height: number } {
  const count = new Map<string, number>();
  colourSlots(data, (c) => { const h = lottieHex(c); count.set(h, (count.get(h) ?? 0) + 1); });
  const texts: string[] = [];
  textSlots(data, (d) => { const t = String(d.t).replace(/\r/g, '\n'); if (!texts.includes(t)) texts.push(t); });
  const d = isObj(data) ? data : {};
  const fps = Number(d.fr) || 30, frames = (Number(d.op) || 0) - (Number(d.ip) || 0);
  return { colours: [...count.entries()].sort((a, b) => b[1] - a[1]).map(([h]) => h), texts, seconds: Math.round((frames / fps) * 100) / 100, fps, width: Number(d.w) || 0, height: Number(d.h) || 0 };
}

/** A copy of the animation with colours swapped ({ "#old": "#new" }) and texts reworded ({ old: new }). */
export function editLottie(data: unknown, colours?: Record<string, string>, texts?: Record<string, string>): unknown {
  const copy = JSON.parse(JSON.stringify(data));
  const map = new Map(Object.entries(colours ?? {}).map(([a, b]) => [a.toLowerCase(), toRgb(b)]));
  if (map.size) colourSlots(copy, (c) => { const to = map.get(lottieHex(c)); if (to) { c[0] = to[0]; c[1] = to[1]; c[2] = to[2]; } });
  const words = new Map(Object.entries(texts ?? {}));
  if (words.size) textSlots(copy, (d) => { const now = String(d.t).replace(/\r/g, '\n'); const to = words.get(now); if (to !== undefined) d.t = to.replace(/\n/g, '\r'); });
  return copy;
}
