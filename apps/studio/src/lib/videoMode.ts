import type { Breakpoint, Layer, Scene, VideoFormat, VideoSettings } from '@unysonplus/scene-player/types';
import { formatBreakpoints, VIDEO_FORMATS } from '@unysonplus/scene-player/video';

/**
 * Web and Video modes. A video is made in one or more fixed formats (each a breakpoint with the format's id,
 * told apart by shape), fills its frame, starts on its own and plays once. Switching keeps every layer:
 * each new layout takes the overrides of the old layout closest to it in shape.
 */

const ratio = (b: { aspect: [number, number] }) => b.aspect[0] / b.aspect[1];

/** Moves layer overrides onto new breakpoints: each one inherits the old layout nearest in shape. */
function remapOverrides(scene: Scene, next: Breakpoint[]): Scene['layers'] {
  const old = scene.stage.breakpoints;
  const nearest = (b: Breakpoint) => (old.find((o) => o.id === b.id) ?? [...old].sort((x, y) => Math.abs(Math.log(ratio(x) / ratio(b))) - Math.abs(Math.log(ratio(y) / ratio(b))))[0])?.id;
  const map = new Map(next.map((b) => [b.id, nearest(b)]));
  const walk = (list: Layer[]): Layer[] => list.map((l) => {
    const o = l.overrides;
    const overrides = o ? Object.fromEntries([...map].filter(([, from]) => from && o[from]).map(([to, from]) => [to, o[from!]])) : undefined;
    const out = { ...l, ...(overrides && Object.keys(overrides).length ? { overrides } : { overrides: undefined }) } as Layer;
    if (out.type === 'group') return { ...out, layers: walk(out.layers) } as Layer;
    return out;
  });
  return walk(scene.layers);
}

export const DEFAULT_VIDEO: VideoSettings = { formats: ['9x16'], fps: 30, platform: 'tiktok' };

export function toVideo(scene: Scene, settings: VideoSettings = scene.video ?? DEFAULT_VIDEO): Scene {
  const breakpoints = formatBreakpoints(settings.formats);
  return {
    ...scene,
    mode: 'video',
    video: settings,
    layers: remapOverrides(scene, breakpoints),
    stage: { ...scene.stage, breakpoints, heightMode: 'fill', heightOffset: undefined, fit: undefined },
    playback: { ...scene.playback, trigger: 'load', loop: false, loopFrom: undefined, advance: undefined, scroll: undefined },
  };
}

/** The web layouts a video goes back to: desktop and mobile. */
const WEB_BREAKPOINTS: Breakpoint[] = [
  { id: 'desktop', label: 'Desktop', minWidth: 1024, aspect: [16, 9] },
  { id: 'tablet', label: 'Tablet', minWidth: 640, aspect: [4, 3] },
  { id: 'mobile', label: 'Mobile', minWidth: 0, aspect: [9, 16] },
];

export function toWeb(scene: Scene): Scene {
  const { mode: _m, ...rest } = scene;
  return {
    ...rest,
    layers: remapOverrides(scene, WEB_BREAKPOINTS),
    stage: { ...scene.stage, breakpoints: WEB_BREAKPOINTS, heightMode: 'ratio-capped' },
    playback: { ...scene.playback, trigger: 'view' },
  };
}

/** Changes a video's settings; a change of formats rebuilds its layouts (keeping the ones still there). */
export function setVideo(scene: Scene, patch: Partial<VideoSettings>): Scene {
  const settings = { ...(scene.video ?? DEFAULT_VIDEO), ...patch };
  if (!settings.formats.length) return scene;
  return toVideo(scene, settings);
}

/** The pixel size of a format (full HD). */
export const formatSize = (f: VideoFormat) => ({ width: VIDEO_FORMATS[f].width, height: VIDEO_FORMATS[f].height });
