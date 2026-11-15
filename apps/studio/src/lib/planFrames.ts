import type { Layer, Scene } from '@unysonplus/scene-player/types';

/*
 * Key frames first: before a planned scene is animated, each part of the plan is drawn as one still frame in the real
 * style, so the person agrees what it looks like before anything moves (AI assist, Plan first: Show the key frames).
 */

/** Key frames first: one still frame per part of the approved plan, in the real style, before anything moves. */
export const KEYFRAMES_BRIEF = `KEY FRAMES ONLY (this request): do not animate yet. For each part of the approved plan in "context", in order, make the frame the viewer sees once that part has fully landed: its real layers, words, pictures, colours and layout, in the style. Put each part's layers in ONE group with id "kf-1", "kf-2", ... named after the part. Group n has "start" (n-1)*2 and "end" n*2, so each frame shows for two seconds; the scene's duration is 2 times the number of parts. No entrances, exits, transitions, sounds or camera moves. Clips only for looks a still frame must show (a glow, a colour grade, a sketch or paper look, the film look), starting at the group's start and running to its end. No voice-over or music.`;

/** The agreed key frames, for the build: each part ends looking like its frame. */
export const framesContext = (f: Scene) => `THE APPROVED KEY FRAMES (keep them): the scene below has one group per part ("kf-1", ...), each the frame that part must look like once it has landed. Build each part to end on exactly that frame: the same layers, ids, words, pictures, colours, sizes and positions. Then add what the plan says about motion: entrances, exits, timing, transitions, camera and sound. Do not keep the kf groups' two-second timing; time the parts as the plan says.
${JSON.stringify({ stage: { background: f.stage.background, fonts: f.stage.fonts }, layers: f.layers })}`;


/** A key-frame scene's frames: one group per part ("kf-1", "kf-2"…), each with the moment to show it. */
export function keyFrames(scene: Scene): Array<{ id: string; name: string; at: number }> {
  const groups = scene.layers.filter((l) => /^kf-\d+$/.test(l.id)) as Layer[];
  const list = groups.length ? groups : scene.layers.filter((l) => l.type === 'group');
  return list
    .map((l, i) => {
      const start = typeof l.start === 'number' ? l.start : i * 2;
      const end = typeof l.end === 'number' ? l.end : start + 2;
      return { id: l.id, name: l.name || `Part ${i + 1}`, at: Math.round((start + Math.max(0.1, (end - start) * 0.75)) * 100) / 100 };
    })
    .sort((a, b) => a.at - b.at);
}
