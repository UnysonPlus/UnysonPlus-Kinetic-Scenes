import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { SWARM_DEFAULTS, buildWithCursors } from '../lib/swarm';
import { kitify } from './KitLink';

/**
 * Tools › Build with cursors: a team of coloured, named cursors builds the scene's opening (boxes drawn with a size
 * badge, text typed in), then leaves and the scene plays on. Written as ordinary cursor layers and clips, so it
 * scrubs and exports like any other animation, and Undo takes it all back.
 */
export function SwarmDialog(props: { open: boolean; scene: Scene; at: number; onClose: () => void; onScene: (scene: Scene, note: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cursors, setCursors] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [names, setNames] = useState(true);
  const [sound, setSound] = useState(true);
  const [fromHere, setFromHere] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const go = () => {
    setError('');
    try {
      const r = buildWithCursors(props.scene, { cursors, speed, sound, names: names ? SWARM_DEFAULTS.names : [], at: fromHere ? props.at : 0 });
      props.onScene(r.scene, `${r.cursors} cursors build ${r.layers} ${r.layers === 1 ? 'layer' : 'layers'} in ${r.seconds} s; the rest of the scene plays on after. Undo takes it back.`);
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <dialog ref={ref} className="export addons" aria-labelledby="swarm-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="swarm-title">Build with cursors</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          A team of cursors builds the opening of your scene in front of the viewer, like collaborators in a shared design file:
          each box is dragged out with its size showing, each line of text is typed in. Then they leave and the scene plays on.
        </p>
        <div className="start-pair">
          <label>Cursors
            <select value={cursors} onChange={(e) => setCursors(Number(e.target.value))}>
              <option value={0}>As many as it needs (3 to 6)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>Speed ({speed}×)
            <input type="range" min={0.5} max={3} step={0.25} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
          </label>
        </div>
        <label className="start-again"><input type="checkbox" checked={names} onChange={(e) => setNames(e.target.checked)} /> Name tags on the cursors</label>
        <label className="start-again"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Soft clicks and typing sounds</label>
        <label className="start-again"><input type="checkbox" checked={fromHere} onChange={(e) => setFromHere(e.target.checked)} /> Start at the playhead ({props.at} s), not at the beginning</label>
        {error && <p className="export-warn" role="alert">{kitify(error)}</p>}
        <div className="export-row">
          <button type="button" className="btn small primary" onClick={go}>Build it</button>
        </div>
      </div>
    </dialog>
  );
}
