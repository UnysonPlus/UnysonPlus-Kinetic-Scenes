import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { BUILT_IN_STYLES, type SceneStyle } from './styles';

/**
 * Brand kits: a style of your own built from your logo, colours and fonts (the motion and sounds borrowed from a
 * built-in style you pick), and styles as files, to share with a team.
 */

export interface BrandForm {
  name: string;
  logo?: string;
  background: string;
  text: string;
  muted: string;
  accent: string;
  accent2?: string;
  heading: string;
  body: string;
  headingWeight: number;
  bodyWeight: number;
  uppercase: boolean;
  /** The built-in style whose motion and sounds this one takes. */
  personality: string;
}

/** A Google Fonts stylesheet for the two families (at the weights the style uses). */
export function fontsHref(heading: string, body: string, hw: number, bw: number): string {
  const fam = (f: string, ws: number[]) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@${[...new Set(ws)].sort((a, b) => a - b).join(';')}`;
  const q = heading === body ? fam(heading, [bw, hw, 700]) : `${fam(heading, [hw])}&${fam(body, [bw, 600])}`;
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

export function formFromStyle(s: SceneStyle): BrandForm {
  return {
    name: s.name, logo: s.logo, background: s.palette.background, text: s.palette.text, muted: s.palette.muted, accent: s.palette.accent,
    accent2: s.palette.accent2, heading: s.fonts.heading, body: s.fonts.body, headingWeight: s.fonts.headingWeight, bodyWeight: s.fonts.bodyWeight,
    uppercase: !!s.fonts.uppercase, personality: s.basedOn ?? BUILT_IN_STYLES[0].id,
  };
}

/** A brand style from the form: your look, with the motion and sounds of the personality you picked. */
export function styleFromForm(f: BrandForm, id?: string): SceneStyle {
  const base = BUILT_IN_STYLES.find((s) => s.id === f.personality) ?? BUILT_IN_STYLES[0];
  return {
    ...base,
    id: id ?? `brand-${Date.now().toString(36)}`,
    name: f.name.trim() || 'My brand',
    description: `Your brand kit, moving like ${base.name}.`,
    custom: true,
    brand: true,
    basedOn: base.id,
    logo: f.logo || undefined,
    palette: { background: f.background, text: f.text, muted: f.muted, accent: f.accent, ...(f.accent2 ? { accent2: f.accent2 } : {}) },
    fonts: { heading: f.heading, body: f.body, headingWeight: f.headingWeight, bodyWeight: f.bodyWeight, uppercase: f.uppercase || undefined, href: fontsHref(f.heading, f.body, f.headingWeight, f.bodyWeight) },
    sample: { ...base.sample, kicker: f.name.trim() || base.sample.kicker },
  };
}

/** A style as a file to share (downloaded as name.style.json). */
export function styleFile(s: SceneStyle): { name: string; text: string } {
  const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'style';
  const { custom: _c, ...rest } = s;
  return { name: `${slug}.style.json`, text: JSON.stringify({ format: 'unysonplus-style', version: 1, style: rest }, null, 2) };
}

const isColour = (v: unknown) => typeof v === 'string' && v.length < 400;

/** Reads a shared style file; throws a plain message when it is not one. */
export function readStyleFile(text: string): SceneStyle {
  let j: unknown;
  try { j = JSON.parse(text); } catch { throw new Error('That file is not a style (it is not JSON).'); }
  const s = (j as { format?: string; style?: SceneStyle }).format === 'unysonplus-style' ? (j as { style: SceneStyle }).style : (j as SceneStyle);
  const ok = s && typeof s.name === 'string' && s.palette && isColour(s.palette.background) && isColour(s.palette.text) && isColour(s.palette.accent)
    && s.fonts && typeof s.fonts.heading === 'string' && s.motion && s.motion.headline && s.sounds;
  if (!ok) throw new Error('That file is not a Kinetic Scenes style.');
  if (s.logo && !/^(data:image\/|https:\/\/)/.test(s.logo)) delete s.logo;
  return { ...s, id: `custom-${Date.now().toString(36)}`, custom: true, description: s.description || 'Imported.' };
}

/** The logo as a layer: a picture at the top centre (or where you put it), fading in. */
export function logoLayer(scene: Scene, logo: string, id = 'logo'): Layer {
  let n = 2;
  const taken = new Set<string>();
  const walk = (ls: Layer[]) => ls.forEach((l) => { taken.add(l.id); if (l.type === 'group') walk(l.layers); });
  walk(scene.layers);
  let lid = id;
  while (taken.has(lid)) lid = `${id}-${n++}`;
  return { id: lid, type: 'image', name: 'Logo', src: logo, alt: 'Logo', fit: 'contain', box: { x: 50, y: 12, w: 14, h: 8 }, clips: [{ id: `${lid}-in`, preset: 'fade', start: 0.1, duration: 0.6 }] } as Layer;
}

/** Reads a picture file as a data: URL (a logo). */
export function readLogo(file: File): Promise<string> {
  return new Promise((ok, bad) => {
    if (file.size > 1.5 * 1024 * 1024) return bad(new Error('A logo up to 1.5 MB, please (an SVG or a PNG is best).'));
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = () => bad(r.error);
    r.readAsDataURL(file);
  });
}
