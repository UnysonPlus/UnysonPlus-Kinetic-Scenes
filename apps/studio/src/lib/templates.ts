import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { BUILT_IN_STYLES, type SceneStyle, type StyleMove } from './styles';

/**
 * Templates: complete, ready-to-use scenes by goal (a website hero, a product reveal, pricing, an explainer…), not by
 * technique. Each is built in a style (its colours, fonts and moves), so the same template looks at home in any of
 * them. Every template follows the film's shape (a hook at once, a hero moment, a held end frame) and passes Check
 * scene; the words are placeholders written to be replaced.
 */

export interface TemplateInfo { id: string; name: string; goal: string; description: string; format: '16x9' | '9x16' }

export const TEMPLATES: TemplateInfo[] = [
  { id: 'hero', name: 'Website hero', goal: 'Introduce a product on a home page', description: 'A kicker, a big headline, a supporting line and a button, looping calmly behind a page.', format: '16x9' },
  { id: 'product', name: 'Product reveal', goal: 'Show off a product or app', description: 'The product slides in inside a browser frame while three short benefits land beside it.', format: '16x9' },
  { id: 'features', name: 'Feature list', goal: 'List what it does', description: 'A title and four features, each with a mark, arriving one by one and held to read.', format: '16x9' },
  { id: 'pricing', name: 'Pricing', goal: 'Compare plans', description: 'Three plan cards; the prices count up and the recommended plan lifts and gets a badge.', format: '16x9' },
  { id: 'cta', name: 'Call to action', goal: 'Ask people to act', description: 'One strong line, a button that invites the click, and a held end frame.', format: '16x9' },
  { id: 'logo', name: 'Logo intro', goal: 'Open or close with the brand', description: 'A mark draws attention, the name opens out beside it, a tagline settles under them.', format: '16x9' },
  { id: 'social', name: 'Social promo', goal: 'A Reel, Short or TikTok', description: 'A vertical promo: a hook in the first second, three quick beats, and a call to action kept clear of the app buttons.', format: '9x16' },
  { id: 'explainer', name: 'Explainer', goal: 'Explain something in chapters', description: 'For longer pieces: chapter cards, a chapter progress bar, a small heads-up label and subtitles. Replace the script, or ask AI assist to fill it from yours.', format: '16x9' },
  { id: 'code', name: 'Code demo', goal: 'Show how code works', description: 'A code window types a snippet, the key line is highlighted with a note, and it runs.', format: '16x9' },
];

/** A soft placeholder picture (a window with blocks), until the person drops in their own. */
const SHOT = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600"><rect width="960" height="600" fill="#eef1f6"/><rect x="40" y="40" width="200" height="520" rx="14" fill="#dfe4ec"/>'
  + '<rect x="270" y="40" width="650" height="90" rx="14" fill="#c9d3e1"/><rect x="270" y="160" width="310" height="180" rx="14" fill="#d7dee9"/><rect x="610" y="160" width="310" height="180" rx="14" fill="#d7dee9"/>'
  + '<rect x="270" y="370" width="650" height="190" rx="14" fill="#dfe4ec"/></svg>');

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Build a template in a style. */
export function templateScene(id: string, style: SceneStyle = BUILT_IN_STYLES[0]): Scene {
  const info = TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
  const pal = style.palette;
  const p = style.motion.pace;
  const t = (s: number) => r2(s * p);
  let n = 0;
  const cid = () => `c${++n}`;
  const mv = (m: StyleMove, dir: 'in' | 'out' = 'in') => ({ preset: m.preset, params: { ...(m.params ?? {}), ...(dir === 'out' ? { direction: 'out' } : {}) } });
  const clip = (m: { preset: string; params?: Record<string, unknown> }, start: number, duration: number, ease?: string): Clip => ({ id: cid(), preset: m.preset, start: r2(start), duration: r2(duration), ...(ease ? { ease } : {}), ...(m.params ? { params: m.params } : {}) });
  const heading = { fontFamily: style.fonts.heading, fontWeight: style.fonts.headingWeight, color: pal.text, ...(style.fonts.uppercase ? { uppercase: true } : {}) };
  const body = { fontFamily: style.fonts.body, fontWeight: style.fonts.bodyWeight, color: pal.muted };
  const layers: Layer[] = [];
  const add = (l: Omit<Layer, 'id'> & { id?: string }) => { const layer = { id: l.id ?? `l${layers.length + 1}`, ...l } as Layer; layers.push(layer); return layer; };
  const text = (name: string, value: string, box: Layer['box'], style2: Record<string, unknown>, clips: Clip[], extra: Record<string, unknown> = {}) =>
    add({ name, type: 'text', text: value, box, style: { align: 'center', ...style2 }, clips, ...extra } as never);
  const rect = (name: string, box: Layer['box'], fill: string, clips: Clip[], extra: Record<string, unknown> = {}) =>
    add({ name, type: 'shape', shape: 'rect', box, fill, clips, ...extra } as never);
  const head = (start: number) => clip(mv(style.motion.headline), start, t(0.9), style.motion.easeIn);
  const sub = (start: number) => clip(mv(style.motion.text), start, t(0.7), style.motion.easeIn);
  const shape = (start: number) => clip(mv(style.motion.shape), start, t(0.6), style.motion.easeIn);
  const drift = (start: number, end: number) => clip({ preset: 'drift', params: { x: 0, y: -2, scale: 1.04, rotate: 0 } }, start, Math.max(0.5, end - start));
  const exitAll = (at: number) => { for (const l of layers) if (l.clips.every((c) => c.start + c.duration <= at + 0.01)) l.clips.push(clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at, 0.4, 'power2.in')); };
  let duration = 6;
  // Everything but the website hero is a video (16:9 for YouTube and presentations; the social promo is 9:16).
  let format: Scene['video'] | undefined = info.id === 'hero' ? undefined : { formats: ['16x9'], fps: 30, platform: 'youtube' };
  // Videos and banners: one 16:9 layout (the social promo is 9:16). The website hero also gets a phone layout.
  let breakpoints: Scene['stage']['breakpoints'] = [{ id: '16x9', label: '16:9', minWidth: 0, aspect: [16, 9] }];
  const phone = (fontSize: number, y: number, w?: number) => ({ mobile: { style: { fontSize }, box: { y, ...(w ? { w } : {}) } } });

  switch (info.id) {
    case 'hero': {
      rect('Glow', { x: 70, y: 40, w: 50, ratio: 1 }, `radial-gradient(closest-side, ${pal.accent}55, transparent)`, [clip({ preset: 'fade', params: { scale: 0.85 } }, 0, 0.7), drift(0.7, 5.6)], { shape: 'ellipse' });
      text('Kicker', 'New this spring', { x: 50, y: 20 }, { ...body, fontSize: 1.9, letterSpacing: 0.25, uppercase: true, color: pal.accent }, [sub(0.1)], { overrides: phone(3.6, 18) });
      text('Headline', 'Make something people love.', { x: 50, y: 42, w: 80 }, { ...heading, fontSize: 7.5, lineHeight: 1.05 }, [head(0.35), drift(t(1.3), 5.6)], { overrides: phone(11, 40, 88) });
      text('Supporting line', 'Everything you need to launch, in one place.', { x: 50, y: 62, w: 64 }, { ...body, fontSize: 2.2 }, [sub(t(1.1))], { overrides: phone(4.4, 64, 84) });
      text('Button', 'Get started', { x: 50, y: 76 }, { ...heading, fontSize: 1.9, color: '#ffffff' }, [clip({ preset: 'pop', params: { from: 0.7 } }, t(1.6), 0.5, 'back.out(1.7)')], { pill: { fill: pal.accent, padX: 1, padY: 0.5, radius: 0.5 }, overrides: phone(4, 80) });
      breakpoints = [{ id: 'desktop', label: 'Desktop', minWidth: 640, aspect: [16, 9] }, { id: 'mobile', label: 'Mobile', minWidth: 0, aspect: [4, 5] }];
      duration = 6.2;
      break;
    }
    case 'product': {
      add({ name: 'Product', type: 'image', src: SHOT, alt: 'Your product', fit: 'cover', frame: 'browser', box: { x: 64, y: 52, w: 56, ratio: 1.6 }, clips: [clip({ preset: 'slide', params: { from: 'right', distance: 40 } }, 0.2, 0.8, 'power3.out'), drift(1, 7.4)] } as never);
      text('Headline', 'Meet Atlas.', { x: 6, y: 30, w: 32, anchor: 'left' } as Layer['box'], { ...heading, fontSize: 6, align: 'left' }, [head(0.5)]);
      ['Plans your week', 'Finds the gaps', 'Keeps everyone in sync'].forEach((b, i) => {
        rect(`Mark ${i + 1}`, { x: 6.5, y: 48 + i * 9, w: 1.2, ratio: 1 }, pal.accent, [shape(t(1.6) + i * 0.45)], { shape: 'ellipse' });
        text(`Benefit ${i + 1}`, b, { x: 9, y: 48 + i * 9, w: 28, anchor: 'left' } as Layer['box'], { ...body, fontSize: 2.2, color: pal.text, align: 'left' }, [sub(t(1.6) + i * 0.45)]);
      });
      duration = 8;
      exitAll(7.4);
      break;
    }
    case 'features': {
      text('Title', 'Why teams switch', { x: 50, y: 16, w: 80 }, { ...heading, fontSize: 5 }, [head(0.15)]);
      ['Set up in minutes', 'Works with your tools', 'Private by default', 'Help from real people'].forEach((f, i) => {
        const x = i % 2 ? 62 : 14, y = i < 2 ? 42 : 66;
        rect(`Icon ${i + 1}`, { x: x - 4, y, w: 5, ratio: 1, anchor: 'center' } as Layer['box'], pal.accent, [shape(t(1) + i * 0.4)], { radius: 1.2 });
        text(`Feature ${i + 1}`, f, { x, y, w: 30, anchor: 'left' } as Layer['box'], { ...heading, fontSize: 2.6, align: 'left' }, [sub(t(1) + i * 0.4 + 0.1)]);
      });
      duration = 7.5;
      exitAll(6.9);
      break;
    }
    case 'pricing': {
      text('Title', 'Simple pricing', { x: 50, y: 14, w: 80 }, { ...heading, fontSize: 4.6 }, [head(0.15)]);
      [['Starter', '9'], ['Team', '29'], ['Business', '79']].forEach(([name, price], i) => {
        const x = 22 + i * 28, best = i === 1, y = best ? 53 : 56;
        rect(`Card ${i + 1}`, { x, y, w: 24, h: best ? 62 : 56 }, best ? pal.accent : `${pal.text}12`, [clip({ preset: 'stack-in' }, t(0.8) + i * 0.25, 0.55), ...(best ? [drift(t(3.2), 6.9)] : [])], { radius: 1.5, ...(best ? {} : { stroke: `${pal.text}30`, strokeWidth: 0.15 }) });
        text(`Plan ${i + 1}`, name, { x, y: y - 16.5, w: 22 }, { ...heading, fontSize: 2.4, color: best ? '#ffffff' : pal.text }, [sub(t(1) + i * 0.25)]);
        text(`Price ${i + 1}`, `$${price}`, { x, y: y - 4, w: 22 }, { ...heading, fontSize: 6, color: best ? '#ffffff' : pal.text }, [clip({ preset: 'fade', params: { y: 8 } }, t(1.3) + i * 0.25, 0.3), clip({ preset: 'text-count' }, t(1.3) + i * 0.25 + 0.3, 0.9)]);
        text(`Per ${i + 1}`, 'per month', { x, y: y + 8, w: 22 }, { ...body, fontSize: 1.8, color: best ? '#ffffffcc' : pal.muted }, [sub(t(1.5) + i * 0.25)]);
        if (best) text('Badge', 'Most popular', { x, y: y - 26.5 }, { ...heading, fontSize: 1.9, color: pal.accent }, [clip({ preset: 'pop', params: { from: 0.6 } }, t(2.6), 0.45, 'back.out(1.8)')], { pill: { fill: '#ffffff', padX: 0.8, padY: 0.35, radius: 0.5 } });
      });
      duration = 7.5;
      exitAll(6.9);
      break;
    }
    case 'cta': {
      text('Line', 'Ready when you are.', { x: 50, y: 40, w: 84 }, { ...heading, fontSize: 8, lineHeight: 1.05 }, [head(0.2), drift(t(1.2), 5.4)]);
      text('Button', 'Start free', { x: 50, y: 62 }, { ...heading, fontSize: 2.2, color: '#ffffff' }, [clip({ preset: 'pop', params: { from: 0.7 } }, t(1.2), 0.5, 'back.out(1.7)'), clip({ preset: 'pulse', params: { times: 2, scale: 1.06 } }, t(2.4), 1)], { pill: { fill: pal.accent, padX: 1.2, padY: 0.55, radius: 0.5 } });
      text('Small print', 'No card needed', { x: 50, y: 74 }, { ...body, fontSize: 2.2 }, [sub(t(1.6))]);
      duration = 6;
      break;
    }
    case 'logo': {
      rect('Mark', { x: 38, y: 46, w: 9, ratio: 1 }, pal.accent, [clip({ preset: 'pop', params: { from: 0.5 } }, 0.15, 0.55, 'back.out(1.8)'), clip({ preset: 'spin' }, 0.7, 0.8)], { radius: 2.2 });
      text('Name', 'Northwind', { x: 45, y: 46, anchor: 'left' } as Layer['box'], { ...heading, fontSize: 6.5, align: 'left' }, [clip({ preset: 'wipe', params: { from: 'left' } }, 0.9, 0.6, 'power3.out')]);
      text('Tagline', 'Built for the long run', { x: 50, y: 62, w: 60 }, { ...body, fontSize: 2.1 }, [sub(1.6)]);
      duration = 4.2;
      break;
    }
    case 'social': {
      breakpoints = [{ id: '9x16', label: '9:16', minWidth: 0, aspect: [9, 16] }];
      format = { formats: ['9x16'], fps: 30, platform: 'shorts' };
      const beat = (i: number, words: string, at: number, len: number) =>
        text(`Beat ${i}`, words, { x: 46, y: 46, w: 72 }, { ...heading, fontSize: 11, lineHeight: 1.05 }, [clip(mv(i % 2 ? style.motion.headline : style.motion.text), at, 0.5, style.motion.easeIn), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at + len - 0.25, 0.25, 'power2.in')], { start: at, end: r2(at + len) });
      text('Hook', 'Stop scrolling.', { x: 46, y: 40, w: 72 }, { ...heading, fontSize: 13, lineHeight: 1 }, [clip({ preset: 'text-slam', params: { scale: 1.8, blur: 0.6 } }, 0.05, 0.5), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, 1.75, 0.25, 'power2.in')], { start: 0, end: 2 });
      beat(1, 'One app.', 2, 1.6);
      beat(2, 'Every task.', 3.6, 1.6);
      beat(3, 'Zero stress.', 5.2, 1.6);
      text('Call to action', 'Try it free', { x: 46, y: 50, w: 70 }, { ...heading, fontSize: 9 }, [head(6.9), drift(7.8, 9.5)], { start: 6.8, end: 9.5 });
      text('Link', 'link in bio', { x: 46, y: 62, w: 60 }, { ...body, fontSize: 4.6, color: pal.accent }, [sub(7.4)], { start: 6.8, end: 9.5 });
      duration = 9.5;
      break;
    }
    case 'explainer': {
      const chapters = ['What it is', 'How it works', 'Why it matters'];
      const len = 8;
      chapters.forEach((c, i) => {
        const at = i * len;
        text(`Chapter ${i + 1} number`, `0${i + 1}`, { x: 50, y: 32 }, { ...heading, fontSize: 3.2, color: pal.accent }, [clip({ preset: 'fade', params: { y: 10 } }, at + 0.1, 0.4), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at + 2.2, 0.3, 'power2.in')], { start: at, end: at + 2.5 });
        text(`Chapter ${i + 1} title`, c, { x: 50, y: 46, w: 80 }, { ...heading, fontSize: 7 }, [head(at + 0.3), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at + 2.2, 0.3, 'power2.in')], { start: at, end: at + 2.5 });
        text(`Chapter ${i + 1} point`, ['A short sentence saying what it is.', 'Three steps, one at a time.', 'The reason someone should care.'][i], { x: 50, y: 46, w: 70 }, { ...heading, fontSize: 4 }, [sub(at + 2.6), drift(at + 3.4, at + len - 0.4), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at + len - 0.4, 0.3, 'power2.in')], { start: at + 2.5, end: at + len });
        text(`Subtitle ${i + 1}`, ['This is where the voice-over line for chapter one appears.', 'Each chapter has its own line, timed to the narration.', 'Replace these with your script, or let AI assist write them.'][i], { x: 50, y: 82, w: 76 }, { ...body, fontSize: 2.6, color: pal.text }, [clip({ preset: 'fade', params: { y: 0 } }, at + 2.6, 0.25), clip({ preset: 'fade', params: { direction: 'out', y: 0 } }, at + len - 0.4, 0.25)], { pill: { fill: '#000000aa', padX: 0.6, padY: 0.3, radius: 0.3 }, start: at + 2.5, end: at + len });
      });
      duration = chapters.length * len;
      rect('Chapter track', { x: 50, y: 6, w: 90, h: 0.5 }, `${pal.text}22`, [clip({ preset: 'fade', params: { y: 0 } }, 0, 0.4)], { radius: 0.25 });
      rect('Chapter progress', { x: 50, y: 6, w: 90, h: 0.5 }, pal.accent, [clip({ preset: 'wipe', params: { from: 'left' } }, 0, duration, 'none')], { radius: 0.25 });
      text('Heads-up', 'Chapter 1 of 3', { x: 94, y: 11, anchor: 'right' } as Layer['box'], { ...body, fontSize: 2, color: pal.muted, align: 'right' }, [clip({ preset: 'fade', params: { y: 0 } }, 0.2, 0.4), clip({ preset: 'text-swap', params: { to: 'Chapter 2 of 3' } }, len, 0.4), clip({ preset: 'text-swap', params: { to: 'Chapter 3 of 3' } }, 2 * len, 0.4)]);
      break;
    }
    case 'code': {
      text('Title', 'Read a name, say hello', { x: 50, y: 12, w: 80 }, { ...heading, fontSize: 3.6 }, [head(0.1)]);
      add({ name: 'Code', type: 'code', title: 'hello.py', run: true, fontSize: 2.4, code: 'name = input("Name? ")\nprint(f"Hello, {name}!")', box: { x: 50, y: 56, w: 70, h: 62 },
        clips: [clip({ preset: 'fade', params: { y: 10 } }, 0.5, 0.4), clip({ preset: 'code-type' }, 0.9, 2.4), clip({ preset: 'code-highlight', params: { line: 2, token: 'print' } }, 3.6, 0.5), clip({ preset: 'code-note', params: { line: 2, text: 'f-string fills in the name' } }, 4.2, 0.5), clip({ preset: 'code-run', params: { output: 'Name? Ada\nHello, Ada!' } }, 5.6, 1.2)] } as never);
      duration = 8.5;
      break;
    }
  }

  return {
    format: 'unysonplus-scene', version: 1, title: info.name, duration: r2(duration),
    ...(format ? { mode: 'video' as const, video: format } : {}),
    stage: {
      breakpoints, heightMode: 'ratio-capped', background: pal.background, safeArea: 0.06,
      fonts: style.fonts.href ? [{ family: style.fonts.heading, href: style.fonts.href }, ...(style.fonts.body !== style.fonts.heading ? [{ family: style.fonts.body }] : [])] : undefined,
    },
    playback: info.id === 'hero' ? { trigger: 'view', loop: true, repeatDelay: 0.6, posterTime: 3 } : { trigger: 'load', loop: false, posterTime: Math.min(duration - 0.5, 3) },
    layers,
  } as Scene;
}
