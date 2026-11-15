import { useRef, useState } from 'react';
import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { addCutoutLayer, cutOut, cutoutStatus, placeOnPhoto, type CutoutResult, type CutoutStatus, type Region } from '../lib/cutout';
import { CheckField, Section } from './fields';
import { KitLink, kitify } from './KitLink';

const DOC = 'https://docs.unysonplus.com/kinetic-scenes/photo-cutouts';
const VERDICT: Record<CutoutResult['verdict'], string> = { good: 'Clean cut', check: 'Look at the edges', poor: 'Not a clean subject' };

/** Drag a box on the picture to pick one thing among several. Returns fractions of the picture. */
function RegionPicker(props: { src: string; region: Region | null; onChange: (r: Region | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const from = useRef<[number, number] | null>(null);
  const at = (e: React.PointerEvent): [number, number] => {
    const b = ref.current!.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), Math.min(1, Math.max(0, (e.clientY - b.top) / b.height))];
  };
  const r = props.region;
  return (
    <div className="cutobj-pick">
      <div ref={ref} className="cutobj-pick-img" role="img" aria-label="The picture: drag a box around the thing to cut out"
        onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); from.current = at(e); }}
        onPointerMove={(e) => { if (!from.current) return; const p = at(e); const [a, b] = from.current; props.onChange([Math.min(a, p[0]), Math.min(b, p[1]), Math.max(a, p[0]), Math.max(b, p[1])]); }}
        onPointerUp={() => { from.current = null; if (r && (r[2] - r[0] < 0.05 || r[3] - r[1] < 0.05)) props.onChange(null); }}>
        <img src={props.src} alt="" draggable={false} />
        {r && <span className="cutobj-box" style={{ left: `${r[0] * 100}%`, top: `${r[1] * 100}%`, width: `${(r[2] - r[0]) * 100}%`, height: `${(r[3] - r[1]) * 100}%` }} />}
      </div>
      <p className="field-hint wide">{r ? <>Only inside the box. <button type="button" className="link-btn" onClick={() => props.onChange(null)}>Use the whole picture</button></> : 'Drag a box around one thing to cut out only that (a dish among several). Without a box, the main subject is cut out.'}</p>
    </div>
  );
}

/** Cut out the object, for a picture layer (through the AI Dev Kit, on this computer). */
export function CutObjectSection(props: { scene: Scene; layer: Layer; onCommit: (scene: Scene) => void; onSelect: (id: string) => void }) {
  const { scene, layer } = props;
  const [status, setStatus] = useState<CutoutStatus | null | undefined>(undefined);
  const [region, setRegion] = useState<Region | null>(null);
  const [fill, setFill] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [result, setResult] = useState<CutoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (layer.type !== 'image') return null;
  const run = async () => {
    setBusy(true); setError(null); setResult(null); setStep('Starting');
    try {
      const r = await cutOut(layer.src, { region, fill, onStep: setStep });
      setResult(r);
      if (r.verdict !== 'poor') {
        const placed = await placeOnPhoto(layer.src, r);
        const out = addCutoutLayer(scene, layer.id, placed, fill ? r.plateJpg : undefined);
        props.onCommit(out.scene);
        props.onSelect(out.id);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false); setStep('');
    }
  };
  const first = status && (!status.cutModel || (fill && !status.fillModel));
  return (
    <Section title="Cut out the object">
      <p className="field-hint wide">
        Cuts the subject (a dish, a product, a person, a pet) out of the picture along its outline and adds it as a new layer exactly over
        it, so a photo-only scene can lift it off, float it or put it on a sticker instead of showing a slideshow. <a href={DOC} target="_blank" rel="noopener">How to use cut-outs</a>
      </p>
      {status === undefined && <div className="insp-start"><button type="button" className="btn small" onClick={() => cutoutStatus().then(setStatus)}>Check the AI Dev Kit</button></div>}
      {status === null && <p className="field-hint wide">The <KitLink /> is not running on this computer (or is too old to cut out pictures).</p>}
      {status && !status.runtime && <p className="field-hint wide">The AI Dev Kit needs its separation runtime for this. Open its Add-ons and install it, then check again.</p>}
      {status?.runtime && (
        <>
          <RegionPicker src={layer.src} region={region} onChange={setRegion} />
          <CheckField label="Paint it out of the picture behind" checked={fill} onChange={setFill} />
          {fill && <p className="field-hint wide">The picture under the cut-out becomes the picture with the subject painted out, so lifting the cut-out leaves no copy behind. It is soft where the subject was: dim or blur it.</p>}
          {first && <p className="field-hint wide">The first use downloads the cut-out model ({status.downloads?.cutMB ?? 224} MB{fill && !status.fillModel ? `, and ${status.downloads?.fillMB ?? 208} MB to paint it out` : ''}), once.</p>}
          <div className="insp-start"><button type="button" className="btn small" disabled={busy || !layer.src} onClick={run}>{busy ? `${step || 'Cutting'}…` : 'Cut out the object'}</button></div>
        </>
      )}
      {result && (
        <div className={`cutobj-verdict is-${result.verdict}`} role="status">
          <strong>{VERDICT[result.verdict]}</strong>
          {result.verdict === 'poor' ? ' Nothing was added. Drag a box around the one thing to cut out, then try again.' : ' Added as a new layer over the picture (selected). Undo removes it.'}
          {!!result.notes?.length && <ul>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
        </div>
      )}
      {error && <p className="field-hint wide" role="alert">{kitify(`Could not cut it out: ${error}`)}</p>}
    </Section>
  );
}
