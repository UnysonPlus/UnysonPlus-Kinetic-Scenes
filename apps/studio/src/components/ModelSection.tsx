import { kitBase } from '../lib/ai';
import { useRef, useState } from 'react';
import type { ModelLayer } from '@unysonplus/scene-player/types';
import { CheckField, ColorField, NumberField, Section, SelectField, TextField } from './fields';

const KINDS = [
  { value: 'text', label: '3D text' },
  { value: 'shape', label: 'Shape' },
  { value: 'svg', label: 'Logo (SVG)' },
  { value: 'gltf', label: 'Model (glTF / GLB)' },
];
const SHAPES = [
  { value: 'box', label: 'Rounded box' }, { value: 'sphere', label: 'Sphere' }, { value: 'torus', label: 'Ring' },
  { value: 'knot', label: 'Knot' }, { value: 'cylinder', label: 'Cylinder' }, { value: 'crystal', label: 'Crystal' },
];
const FINISHES = [
  { value: 'matte', label: 'Matte' }, { value: 'satin', label: 'Satin' }, { value: 'glossy', label: 'Glossy' },
  { value: 'metal', label: 'Metal' }, { value: 'chrome', label: 'Chrome' },
];
/** Bigger files make the scene file (and anything it is embedded in) heavy. */
const MAX_UPLOAD = 4 * 1024 * 1024;

/** The Inspector section for a 3D layer: what the object is, its material, its resting pose and light. */
export function ModelSection(props: { layer: ModelLayer; set: (patch: Partial<ModelLayer>) => void }) {
  const { layer, set } = props;
  const m = layer.model;
  const mat = layer.material ?? {};
  const pose = layer.pose ?? {};
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);
  const setModel = (patch: Partial<ModelLayer['model']>) => set({ model: { ...m, ...patch } });
  const setMat = (patch: Partial<NonNullable<ModelLayer['material']>>) => set({ material: { ...mat, ...patch } });
  const setPose = (patch: Partial<NonNullable<ModelLayer['pose']>>) => set({ pose: { ...pose, ...patch } });

  // A 3D object from a description, built and checked by the AI Dev Kit.
  const [describe, setDescribe] = useState('');
  const [making, setMaking] = useState('');
  const makeIt = async () => {
    setNote(null); setMaking('Designing, measuring and looking at it');
    try {
      const b = await kitBase();
      if (!b) throw new Error('This needs the AI Dev Kit running on this computer.');
      const r = await fetch(`${b}/studio/object3d`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: describe, playerBase: new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      set({ model: { kind: 'gltf', src: j.src }, material: { ...mat, original: true }, alt: layer.alt || j.name });
      setNote(`Made "${j.name}" from ${j.parts} parts. ${j.problems?.length ? `Still not quite right: ${j.problems.join(' ')}` : 'Every part measured right.'} ${j.notes || ''} Turn it with the pose below, or describe it differently and make it again.`);
    } catch (e) { setNote((e as Error).message); }
    setMaking('');
  };

  const upload = (file: File) => {
    if (file.size > MAX_UPLOAD) {
      setNote(`That file is ${(file.size / 1048576).toFixed(1)} MB. Files over 4 MB make the scene heavy to embed: host it and use its address instead.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setModel({ src: String(reader.result) }); setNote(`Using ${file.name} (stored inside the scene).`); };
    if (m.kind === 'svg') reader.readAsText(file);
    else reader.readAsDataURL(file);
  };

  return (
    <>
      <Section title="3D object">
        <SelectField label="Object" value={m.kind} options={KINDS} onChange={(kind) => {
          setNote(null);
          set({ model: { kind: kind as ModelLayer['model']['kind'], text: m.text ?? '3D', shape: m.shape ?? 'knot', depth: m.depth, bevel: m.bevel, src: kind === m.kind ? m.src : undefined } });
        }} />
        {m.kind === 'text' && <TextField label="Text" value={m.text ?? ''} multiline wide onCommit={(v) => v.trim() && setModel({ text: v })} />}
        {m.kind === 'shape' && <SelectField label="Shape" value={m.shape ?? 'box'} options={SHAPES} onChange={(v) => setModel({ shape: v as ModelLayer['model']['shape'] })} />}
        {(m.kind === 'svg' || m.kind === 'gltf') && (
          <>
            <TextField label={m.kind === 'svg' ? 'SVG address or markup' : 'Model address (.glb / .gltf)'} wide mono
              value={m.src?.startsWith('data:') ? '(uploaded file)' : m.src ?? ''}
              onCommit={(v) => { if (v !== '(uploaded file)') setModel({ src: v.trim() }); }} />
            <button type="button" className="btn small wide-btn" onClick={() => fileRef.current?.click()}>
              Upload {m.kind === 'svg' ? 'an SVG' : 'a .glb file'}…
            </button>
            <input ref={fileRef} type="file" hidden accept={m.kind === 'svg' ? '.svg,image/svg+xml' : '.glb,.gltf,model/gltf-binary,model/gltf+json'}
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f); }} />
            <p className="field-hint wide">
              {m.kind === 'svg'
                ? 'Filled shapes become solid; each keeps its colour unless you set one below. An address must allow loading from other sites (CORS).'
                : 'A .glb file is easiest (one file). An address must allow loading from other sites (CORS).'}
            </p>
            {m.kind === 'gltf' && (
              <div className="wide describe-3d">
                <TextField label="Or make one from a description" wide value={describe} onCommit={setDescribe} />
                <button type="button" className="btn small wide-btn" disabled={!describe.trim() || !!making} onClick={makeIt}>{making ? `${making}…` : 'Make it (one to three minutes)'}</button>
              </div>
            )}
            {note && <p className="field-hint wide">{note}</p>}
          </>
        )}
        {(m.kind === 'text' || m.kind === 'svg') && (
          <>
            <NumberField label="Depth" value={m.depth ?? 0.3} step={0.05} min={0.01} max={4} onCommit={(v) => setModel({ depth: v })} />
            <NumberField label="Rounded edges" value={m.bevel ?? 0.4} step={0.05} min={0} max={1} onCommit={(v) => setModel({ bevel: v })} />
          </>
        )}
        <TextField label="Description" value={layer.alt} wide placeholder="What it shows, for screen readers (blank if decorative)" onCommit={(v) => set({ alt: v })} />
      </Section>

      <Section title="Material and light">
        {m.kind === 'gltf' && <CheckField label="Keep the model's own materials" checked={mat.original !== false} onChange={(v) => setMat({ original: v })} />}
        {(m.kind !== 'gltf' || mat.original === false) && (
          <>
            <ColorField label="Colour" value={mat.color} placeholder={m.kind === 'svg' ? "The SVG's own colours" : '#2ad38b'} onCommit={(v) => setMat({ color: v || undefined })} />
            <SelectField label="Finish" value={mat.finish ?? 'glossy'} options={FINISHES} onChange={(v) => setMat({ finish: v as NonNullable<ModelLayer['material']>['finish'] })} />
          </>
        )}
        <NumberField label="Light" value={layer.light ?? 1} step={0.1} min={0} max={3} onCommit={(v) => set({ light: v })} />
      </Section>

      <Section title="Resting pose">
        <NumberField label="Turn" value={pose.ry ?? 0} step={1} unit="°" onCommit={(v) => setPose({ ry: v ?? 0 })} />
        <NumberField label="Tilt" value={pose.rx ?? 0} step={1} unit="°" onCommit={(v) => setPose({ rx: v ?? 0 })} />
        <NumberField label="Roll" value={pose.rz ?? 0} step={1} unit="°" onCommit={(v) => setPose({ rz: v ?? 0 })} />
        <NumberField label="Size" value={pose.scale ?? 1} step={0.05} min={0.05} max={5} unit="×" onCommit={(v) => setPose({ scale: v ?? 1 })} />
        <p className="field-hint wide">How the object sits when nothing moves it. The 3D presets (Spin 3D, Tumble in, Orbit, Camera push) animate from this pose.</p>
      </Section>
    </>
  );
}
