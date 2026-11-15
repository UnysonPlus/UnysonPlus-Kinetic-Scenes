import { useEffect, useMemo, useRef } from 'react';
import { mount, type ScenePlayer } from '@unysonplus/scene-player';
import type { Scene } from '@unysonplus/scene-player/types';
import { keyFrames } from '../lib/planFrames';

/** One still frame of a scene, drawn by the player at a moment. */
function Still({ scene, at, label }: { scene: Scene; at: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let player: ScenePlayer | null = null;
    try {
      player = mount(ref.current, scene, { editor: true, autoplay: false, audio: false });
      player.seek(at);
    } catch { /* A frame the player cannot draw stays empty. */ }
    return () => { player?.destroy(); };
  }, [scene, at]);
  return (
    <figure className="keyframe">
      <div ref={ref} className="keyframe-stage" role="img" aria-label={label} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/** The key frames of a plan, side by side: what each part looks like once it has landed, in the real style. */
export function KeyFrames({ scene }: { scene: Scene }) {
  const frames = useMemo(() => keyFrames(scene), [scene]);
  // One breakpoint is enough for a thumbnail; the stage keeps the scene's own shape.
  const still = useMemo(() => ({ ...scene, stage: { ...scene.stage, breakpoints: [scene.stage.breakpoints[0]], heightMode: 'ratio' as const } }), [scene]);
  if (!frames.length) return null;
  return (
    <div className="keyframes" aria-label="Key frames">
      {frames.map((f, i) => <Still key={f.id} scene={still} at={f.at} label={`${i + 1}. ${f.name}`} />)}
    </div>
  );
}
