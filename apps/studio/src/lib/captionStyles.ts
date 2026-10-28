import type { CaptionsLayer, Scene } from '@unysonplus/scene-player/types';

/**
 * Caption style packs: ready-made caption looks, applied in one click. A pack sets the font (adding it to the scene's
 * fonts), the colours, how the words arrive and light up, the box and the look on the letters; it keeps the size, the
 * place and which voice-over the captions follow.
 */
export interface CaptionPack {
  id: string;
  name: string;
  hint: string;
  font: { family: string; weight: number; href: string };
  patch: Partial<Omit<CaptionsLayer, 'style'>>;
  color: string;
  uppercase?: boolean;
}

const gf = (family: string, weight: number) => `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=swap`;
const font = (family: string, weight: number) => ({ family, weight, href: gf(family, weight) });

export const CAPTION_PACKS: CaptionPack[] = [
  { id: 'bold', name: 'Bold', hint: 'Short-form classic: heavy capitals, a black outline, the word being said in yellow',
    font: font('Montserrat', 900), color: '#ffffff', uppercase: true,
    patch: { mode: 'word', highlight: '#ffe14d', motion: 'pop', effect: 'outline', effectColor: '#000000', background: undefined, maxWords: 3 } },
  { id: 'neon', name: 'Neon', hint: 'Glowing letters in cyan, the word being said in green',
    font: font('Righteous', 400), color: '#ffffff',
    patch: { mode: 'word', highlight: '#39ff14', motion: 'pop', effect: 'glow', effectColor: '#00e5ff', background: undefined, maxWords: 3 } },
  { id: 'chrome', name: 'Chrome', hint: 'Polished metal capitals that slam in, the word being said in gold',
    font: font('Anton', 400), color: '#ffffff', uppercase: true,
    patch: { mode: 'word', highlight: '#ffd166', motion: 'slam', effect: 'chrome', effectColor: undefined, background: undefined, maxWords: 2 } },
  { id: 'handwritten', name: 'Handwritten', hint: 'A friendly hand, soft shadow, words dropping in',
    font: font('Caveat', 700), color: '#ffffff',
    patch: { mode: 'word', highlight: '#ffb4a2', motion: 'drop', effect: 'shadow', effectColor: undefined, background: undefined, maxWords: 4 } },
  { id: 'karaoke', name: 'Karaoke', hint: 'Every word said so far lights up, on a dark box',
    font: font('Poppins', 800), color: 'rgba(255,255,255,.6)',
    patch: { mode: 'karaoke', highlight: '#00e0b0', motion: 'pop', effect: 'none', effectColor: undefined, background: 'rgba(0,0,0,.6)', maxWords: 5 } },
  { id: 'boxed', name: 'Boxed', hint: 'White on a solid black box, the word being said in red',
    font: font('Inter', 800), color: '#ffffff',
    patch: { mode: 'word', highlight: '#ff4d4d', motion: 'pop', effect: 'none', effectColor: undefined, background: '#000000', maxWords: 4 } },
  { id: 'giant', name: 'Giant', hint: 'One huge word at a time, slamming in',
    font: font('Anton', 400), color: '#ffffff', uppercase: true,
    patch: { mode: 'none', highlight: undefined, motion: 'slam', effect: 'shadow', effectColor: undefined, background: undefined, maxWords: 1 } },
];

/** The scene with the font in its stage fonts (once). */
function withFont(scene: Scene, f: CaptionPack['font']): Scene {
  const fonts = scene.stage.fonts ?? [];
  if (fonts.some((x) => x.family === f.family && (x.href ?? '').includes(`wght@${f.weight}`))) return scene;
  return { ...scene, stage: { ...scene.stage, fonts: [...fonts.filter((x) => x.family !== f.family), { family: f.family, href: f.href }] } };
}

const mapLayers = (scene: Scene, fn: (l: Scene['layers'][number]) => Scene['layers'][number]): Scene => {
  const walk = (list: Scene['layers']): Scene['layers'] => list.map((l) => {
    const n = fn(l);
    return n.type === 'group' ? { ...n, layers: walk(n.layers) } : n;
  });
  return { ...scene, layers: walk(scene.layers) };
};

/** Applies a pack to one captions layer. */
export function applyCaptionPack(scene: Scene, layerId: string, pack: CaptionPack): Scene {
  const next = mapLayers(scene, (l) => (l.id !== layerId || l.type !== 'captions' ? l : {
    ...l, ...pack.patch, uppercase: pack.uppercase || undefined,
    style: { ...l.style, fontFamily: pack.font.family, fontWeight: pack.font.weight, color: pack.color },
  }));
  return withFont(next, pack.font);
}

/** Copies one captions layer's look onto every other captions layer (their size, place and voice-over stay). */
export function copyCaptionStyle(scene: Scene, fromId: string): { scene: Scene; count: number } {
  let from: CaptionsLayer | null = null;
  mapLayers(scene, (l) => { if (l.id === fromId && l.type === 'captions') from = l; return l; });
  if (!from) return { scene, count: 0 };
  const src = from as CaptionsLayer;
  let count = 0;
  const next = mapLayers(scene, (l) => {
    if (l.type !== 'captions' || l.id === fromId) return l;
    count++;
    return {
      ...l, mode: src.mode, highlight: src.highlight, motion: src.motion, effect: src.effect, effectColor: src.effectColor,
      background: src.background, uppercase: src.uppercase, maxWords: src.maxWords,
      style: { ...l.style, fontFamily: src.style.fontFamily, fontWeight: src.style.fontWeight, color: src.style.color, letterSpacing: src.style.letterSpacing },
    };
  });
  return { scene: next, count };
}

export const countCaptions = (scene: Scene) => {
  let n = 0;
  mapLayers(scene, (l) => { if (l.type === 'captions') n++; return l; });
  return n;
};
