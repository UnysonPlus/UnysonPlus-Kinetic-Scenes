import type { MascotFaceBox, MascotViseme } from '@unysonplus/scene-player/types';
import { MASCOT_FILE_FORMAT, type MascotFile } from './mascotStore';

/**
 * Pip, the sample mascot that comes with the Studio (an orange character drawn for Kinetic Scenes, free to use): six
 * poses with their faces set and nine drawn mouths, to try mascots before making your own, and for the Mascot presenter
 * template. Its pictures are served with the Studio, by full address, so a scene with Pip plays anywhere.
 */
const at = (path: string) => new URL(`mascots/pip/${path}`, document.baseURI).href;

const FACE: { mouth: MascotFaceBox; eyes: MascotFaceBox[] } = {
  mouth: { x: 0.43, y: 0.525, w: 0.14, h: 0.08 },
  eyes: [{ x: 0.35, y: 0.375, w: 0.12, h: 0.117 }, { x: 0.53, y: 0.375, w: 0.12, h: 0.117 }],
};
const POSES: Array<[string, string, string]> = [
  ['idle', 'Idle', 'idle'], ['explaining', 'Explaining', 'explain'], ['wave', 'Wave', 'wave'],
  ['thinking', 'Thinking', 'think'], ['thumbs-up', 'Thumbs up', 'thumbs'], ['cheer', 'Cheer', 'cheer'],
];
const SHAPES: MascotViseme[] = ['rest', 'a', 'e', 'o', 'u', 'mbp', 'fv', 'l', 'etc'];

export function pipFile(): MascotFile {
  return {
    format: MASCOT_FILE_FORMAT, version: 1, name: 'Pip',
    poses: POSES.map(([id, name, file]) => ({ id, name, src: at(`${file}.png`), ratio: 0.8333, ...FACE })),
    mouths: Object.fromEntries(SHAPES.map((s) => [s, at(`mouth-${s}.png`)])),
  };
}
