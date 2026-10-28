import { useEffect, useRef, useState } from 'react';
import { getFootage } from '../lib/footage';

export interface PickedPoint { x: number; y: number }

/**
 * The footage's first frame, to click what is cut out: the first click is the person, any others are what they hold.
 * Points are fractions of the frame.
 */
export function PointPicker(props: { open: boolean; src: string; onCancel: () => void; onDone: (points: PickedPoint[]) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState('');
  const [points, setPoints] = useState<PickedPoint[]>([]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setPoints([]); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;
    let made = '';
    (async () => {
      if (props.src.startsWith('local:')) { const b = await getFootage(props.src); if (b) { made = URL.createObjectURL(b); setUrl(made); } }
      else setUrl(props.src);
    })();
    return () => { if (made) URL.revokeObjectURL(made); };
  }, [props.open, props.src]);

  // Where a point sits over the letterboxed picture.
  const frameRef = useRef<HTMLDivElement>(null);
  const dotAt = (p: PickedPoint) => {
    const v = frameRef.current?.querySelector('video');
    if (!v || !v.videoWidth) return { left: `${p.x * 100}%`, top: `${p.y * 100}%` };
    const W = v.clientWidth, H = v.clientHeight, s = Math.min(W / v.videoWidth, H / v.videoHeight);
    const w = v.videoWidth * s, h = v.videoHeight * s;
    return { left: `${(W - w) / 2 + p.x * w}px`, top: `${(H - h) / 2 + p.y * h}px` };
  };
  return (
    <dialog ref={ref} className="export addons picker-dialog" aria-labelledby="picker-title" onClose={props.onCancel}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="picker-title">Click the person, then what they hold</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onCancel}>×</button>
        </header>
        <p className="addons-intro">
          The video's first frame. Click the <strong>person</strong> first (their chest is a good spot), then each thing they
          hold that should stay in front (a product, a phone). Both are followed through the video. Everything you click must
          be in this frame.
        </p>
        <div ref={frameRef} className="picker-frame" onClick={(e) => {
          // The picture inside the video element (a tall video is letterboxed in it): clicks are fractions of the picture.
          const v = (e.currentTarget as HTMLElement).querySelector('video');
          if (!v || !v.videoWidth) return;
          const r = v.getBoundingClientRect(), s = Math.min(r.width / v.videoWidth, r.height / v.videoHeight);
          const w = v.videoWidth * s, h = v.videoHeight * s, ox = r.left + (r.width - w) / 2, oy = r.top + (r.height - h) / 2;
          const x = (e.clientX - ox) / w, y = (e.clientY - oy) / h;
          if (x < 0 || x > 1 || y < 0 || y > 1) return;
          setPoints((p) => [...p, { x, y }].slice(0, 6));
        }}>
          {url && <video src={url} muted playsInline preload="auto" onLoadedData={(e) => { e.currentTarget.currentTime = 0; }} />}
          {points.map((p, i) => (
            <span key={i} className={`picker-dot${i ? ' is-held' : ''}`} style={dotAt(p)}>{i ? i : 'P'}</span>
          ))}
        </div>
        <p className="addon-detail" role="status">
          {!points.length ? 'Click the person.' : points.length === 1 ? 'Person marked (P). Now click what they hold, or cut out the person alone.' : `Person and ${points.length - 1} thing${points.length > 2 ? 's' : ''} they hold.`}
        </p>
        <div className="export-row">
          <button type="button" className="btn small primary" disabled={!points.length} onClick={() => props.onDone(points)}>Cut out</button>
          <button type="button" className="btn small ghost" disabled={!points.length} onClick={() => setPoints((p) => p.slice(0, -1))}>Undo last click</button>
          <button type="button" className="btn small ghost" onClick={props.onCancel}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
}
