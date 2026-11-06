import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { PHYSICS_DEFAULTS, dropWithPhysics } from '../lib/physics';

/**
 * Tools › Drop with physics: the selected layers fall, bounce and settle as real bodies. The motion is worked out once
 * and written as keyframes, so it scrubs and exports like any other animation, and Undo takes it all back.
 */
export function PhysicsDialog(props: { open: boolean; scene: Scene; ids: string[]; at: number; onClose: () => void; onScene: (scene: Scene, note: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [from, setFrom] = useState(PHYSICS_DEFAULTS.from);
  const [floor, setFloor] = useState(PHYSICS_DEFAULTS.floor);
  const [bounce, setBounce] = useState(PHYSICS_DEFAULTS.bounce);
  const [stagger, setStagger] = useState(PHYSICS_DEFAULTS.stagger);
  const [sound, setSound] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const go = async () => {
    setBusy(true);
    setError('');
    try {
      const r = await dropWithPhysics(props.scene, props.ids, { from, floor, bounce, stagger, sound, at: props.at });
      props.onScene(r.scene, `${r.count} ${r.count === 1 ? 'layer drops' : 'layers drop'} and settle in ${r.seconds} s. Their keyframes are ordinary clips: Undo takes them back.`);
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  const n = props.ids.length;
  return (
    <dialog ref={ref} className="export addons" aria-labelledby="phys-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="phys-title">Drop with physics</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          {n ? `${n} selected ${n === 1 ? 'layer falls' : 'layers fall'}, ${n === 1 ? 'bounces and settles' : 'knock into each other and settle'}, starting at the playhead.` : 'Select the layers to drop first (Shift or Ctrl click on the timeline).'}
        </p>
        <div className="start-pair">
          <label>Start from
            <select value={from} onChange={(e) => setFrom(e.target.value as typeof from)}>
              <option value="above">Above the stage</option>
              <option value="here">Where they are</option>
            </select>
          </label>
          <label>Floor ({floor}% down)
            <input type="range" min={40} max={100} step={1} value={floor} onChange={(e) => setFloor(Number(e.target.value))} />
          </label>
        </div>
        <div className="start-pair">
          <label>Bounce ({bounce})
            <input type="range" min={0} max={0.9} step={0.05} value={bounce} onChange={(e) => setBounce(Number(e.target.value))} />
          </label>
          <label>Time between drops ({stagger} s)
            <input type="range" min={0} max={0.6} step={0.02} value={stagger} onChange={(e) => setStagger(Number(e.target.value))} />
          </label>
        </div>
        <label className="start-again"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Add a thud on the hardest landings</label>
        {error && <p className="export-warn" role="alert">{error}</p>}
        <div className="export-row">
          <button type="button" className="btn small primary" disabled={!n || busy} onClick={go}>{busy ? 'Working…' : 'Drop them'}</button>
        </div>
      </div>
    </dialog>
  );
}
