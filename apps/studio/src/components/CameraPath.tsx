import { useEffect, useState } from 'react';
import type { ModelLayer, Scene } from '@unysonplus/scene-player/types';
import { FOV, askCameraPath, camMoves, sampleTimes, type CamPoint } from '../lib/cameraPath';
import { Section } from './fields';

const W = 150, R = 58; // each view's size, and the resting distance in its pixels

/** One view of the path: from above (across and depth) or from the side (depth and height). */
function View({ pts, now, side, label }: { pts: CamPoint[]; now: CamPoint | null; side: boolean; label: string }) {
  const c = W / 2;
  // Fit the whole route in the view: the resting distance shrinks when the camera goes further out.
  const far = Math.max(1, ...pts.map((p) => (side ? Math.hypot(p.z, p.y) : Math.hypot(p.x, p.z))));
  const k = Math.min(R, (c - 10) / far);
  const at = (p: CamPoint) => (side ? [c + p.z * k, c - p.y * k] : [c + p.x * k, c + p.z * k]);
  const line = pts.map((p) => at(p).map((v) => v.toFixed(1)).join(',')).join(' ');
  // A dot every second along the path, to see where it speeds up (dots far apart) or slows (close together).
  const seconds = pts.filter((p, i) => i > 0 && Math.floor(p.t) !== Math.floor(pts[i - 1].t));
  const cone = (p: CamPoint) => {
    // The field of view: from the camera toward the object, FOV wide.
    const [x, y] = at(p), a = Math.atan2(c - y, c - x), h = (FOV / 2) * (Math.PI / 180), L = 34;
    return `${x},${y} ${x + Math.cos(a - h) * L},${y + Math.sin(a - h) * L} ${x + Math.cos(a + h) * L},${y + Math.sin(a + h) * L}`;
  };
  return (
    <figure className="campath-view">
      <svg viewBox={`0 0 ${W} ${W}`} width={W} height={W} role="img" aria-label={`The camera's path ${label}`}>
        <circle cx={c} cy={c} r={k} className="campath-rest" />
        <rect x={c - 7} y={c - 7} width={14} height={14} rx={2} className="campath-object" />
        {pts.length > 1 && <polyline points={line} className="campath-line" />}
        {seconds.map((p) => { const [x, y] = at(p); return <circle key={p.t} cx={x} cy={y} r={1.8} className="campath-tick" />; })}
        {pts[0] && (() => { const [x, y] = at(pts[0]); return <circle cx={x} cy={y} r={3.2} className="campath-start" />; })()}
        {pts.length > 1 && (() => { const [x, y] = at(pts[pts.length - 1]); return <rect x={x - 3} y={y - 3} width={6} height={6} className="campath-end" />; })()}
        {now && <polygon points={cone(now)} className="campath-fov" />}
        {now && (() => { const [x, y] = at(now); return <circle cx={x} cy={y} r={4.5} className="campath-now" />; })()}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/**
 * 3D layer › Camera path: where the camera goes over the layer's time, from above and from the side, with the camera
 * at the playhead and what it sees. Read from the timeline itself, so every preset and keyframe counts.
 */
export function CameraPath(props: { scene: Scene; layer: ModelLayer; time: number }) {
  const { scene, layer } = props;
  const [pts, setPts] = useState<CamPoint[]>([]);
  const start = layer.start ?? 0, end = typeof layer.end === 'number' ? layer.end : scene.duration;
  // Sampled again when the scene changes (a moment after, so typing in a field doesn't ask on every key).
  useEffect(() => {
    const t = setTimeout(() => { askCameraPath(layer.id, sampleTimes(scene, start, end)).then(setPts); }, 250);
    return () => clearTimeout(t);
  }, [scene, layer.id, start, end]);
  if (!pts.length) return null;
  const now = pts.reduce((a, b) => (Math.abs(b.t - props.time) < Math.abs(a.t - props.time) ? b : a), pts[0]);
  const moving = camMoves(pts);
  return (
    <Section title="Camera path">
      <div className="campath wide">
        <View pts={pts} now={now} side={false} label="From above" />
        <View pts={pts} now={now} side label="From the side" />
      </div>
      <p className="field-hint wide">
        {moving
          ? <>Round dot: the start, square: the end, small dots: each second (far apart = moving fast). The ring is the resting distance. At the playhead: orbit {Math.round(now.orbit)}°, tilt {Math.round(now.tilt)}°, distance {Math.round(now.dolly * 100)}%.</>
          : 'The camera stays where it is. Add Orbit or Camera push (or keyframe the 3D layer) to move it; its path shows here.'}
      </p>
    </Section>
  );
}
