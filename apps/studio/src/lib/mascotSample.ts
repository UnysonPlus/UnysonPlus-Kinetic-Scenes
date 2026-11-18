import type { MascotFaceBox, MascotViseme } from '@unysonplus/scene-player/types';
import { MASCOT_FILE_FORMAT, type MascotFile } from './mascotStore';
import catalogue from '../../public/mascots/samples.json';

/**
 * The sample mascots that come with the Studio (drawn for Kinetic Scenes, free to use): Pip and nine more, people and
 * characters, each with six poses (idle, explaining, wave, thinking, thumbs up, cheer), its face set and nine drawn
 * mouths, to use straight away or to try mascots before making your own. The list is public/mascots/samples.json (the
 * AI Dev Kit reads the same file from the published Studio); the pictures are served with the Studio, by full address,
 * so a scene with a sample mascot plays anywhere.
 */
export interface SampleMascot {
  id: string;
  name: string;
  group: 'people' | 'characters';
  blurb: string;
  alt: string;
  ratio: number;
  face: { mouth: MascotFaceBox; eyes: MascotFaceBox[] };
  poses: Array<{ id: string; name: string; file: string }>;
  mouths: Partial<Record<MascotViseme, string>>;
}

export const SAMPLE_MASCOTS = (catalogue as { samples: SampleMascot[] }).samples;

const at = (path: string) => new URL(`mascots/${path}`, document.baseURI).href;

/** A sample as a mascot file (the same shape as a saved or imported mascot). */
export function sampleFile(id: string): MascotFile {
  const s = SAMPLE_MASCOTS.find((x) => x.id === id) ?? SAMPLE_MASCOTS[0];
  return {
    format: MASCOT_FILE_FORMAT, version: 1, name: s.name, alt: s.alt,
    poses: s.poses.map((p) => ({ id: p.id, name: p.name, src: at(p.file), ratio: s.ratio, mouth: s.face.mouth, eyes: s.face.eyes })),
    mouths: Object.fromEntries(Object.entries(s.mouths).map(([k, f]) => [k, at(f as string)])),
  };
}

/** The picture a gallery tile shows (the idle pose). */
export const sampleThumb = (s: SampleMascot) => at(s.poses[0].file);

/** Pip, the first sample (the Mascot presenter template uses it). */
export const pipFile = () => sampleFile('pip');
