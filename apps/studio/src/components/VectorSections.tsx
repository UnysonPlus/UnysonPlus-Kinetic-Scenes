import { useState, type ReactNode } from 'react';
import type { CaptionsLayer, CodeLayer, CursorLayer, DiagramLayer, FlowLayer, Layer, PathLayer, RepeatLayer, Scene } from '@unysonplus/scene-player/types';
import { applySteps, cutOut } from '../lib/tour';
import { installVoice, speak, voiceStatus, withVoice } from '../lib/voice';
import { CheckField, ColorField, NumberField, Section, SelectField, TextField } from './fields';
import { splitImageLayer, splitPicture, splitStatus, type SplitStatus } from '../lib/split';

/** Ready-made line shapes (coordinates are % of the layer's box). */
export const LINE_SHAPES: Array<{ value: string; label: string; d: string }> = [
  { value: 'curve', label: 'S-curve', d: 'M 0 80 C 35 80, 65 20, 100 20' },
  { value: 'straight', label: 'Straight', d: 'M 0 50 L 100 50' },
  { value: 'arc', label: 'Arc', d: 'M 0 100 Q 50 -60, 100 100' },
  { value: 'wave', label: 'Wave', d: 'M 0 50 C 12 0, 25 0, 37 50 S 62 100, 75 50 S 92 0, 100 30' },
  { value: 'zigzag', label: 'Zigzag', d: 'M 0 70 L 20 30 L 40 70 L 60 30 L 80 70 L 100 30' },
  { value: 'loop', label: 'Loop', d: 'M 0 80 C 40 80, 70 0, 50 10 S 30 70, 100 30' },
  { value: 'circle', label: 'Circle', d: 'M 50 0 A 50 50 0 1 1 49.9 0 Z' },
  { value: 'underline', label: 'Underline swoosh', d: 'M 0 60 Q 50 20, 100 50' },
];

/** Every layer id in the scene (groups and their contents), for picking what a flow joins. */
function allLayers(list: Layer[], out: Array<{ value: string; label: string }> = []) {
  for (const l of list) {
    out.push({ value: l.id, label: l.name ? `${l.name} (${l.id})` : l.id });
    if (l.type === 'group') allLayers(l.layers, out);
  }
  return out;
}

export function PathSection(props: { layer: PathLayer; set: (patch: Partial<PathLayer>) => void }) {
  const { layer, set } = props;
  const known = LINE_SHAPES.find((s) => s.d === layer.d)?.value ?? 'custom';
  return (
    <Section title="Line">
      <SelectField label="Shape" value={known} options={[...LINE_SHAPES.map(({ value, label }) => ({ value, label })), { value: 'custom', label: 'Custom (path data)' }]}
        onChange={(v) => { const s = LINE_SHAPES.find((x) => x.value === v); if (s) set({ d: s.d }); }} />
      <TextField label="Path data" value={layer.d} wide mono multiline onCommit={(v) => v.trim() && set({ d: v.trim() })} />
      <p className="field-hint wide">SVG path data. Coordinates run from 0 to 100 across and down the layer&apos;s box, so the line stretches with the box while its width stays the same.</p>
      <ColorField label="Colour" value={layer.stroke} onCommit={(v) => set({ stroke: v || undefined })} />
      <NumberField label="Width" value={layer.strokeWidth ?? 0.3} step={0.05} min={0} max={20} unit="su" onCommit={(v) => set({ strokeWidth: v })} />
      <NumberField label="Glow" value={layer.glow ?? 0} step={0.1} min={0} max={10} unit="su" onCommit={(v) => set({ glow: v || undefined })} />
      <NumberField label="Dashes" value={layer.dash} step={0.1} min={0} max={50} unit="su" optional placeholder="Solid" onCommit={(v) => set({ dash: v || undefined })} />
      <SelectField label="Arrowheads" value={layer.arrow ?? 'none'} options={[{ value: 'none', label: 'None' }, { value: 'end', label: 'At the end' }, { value: 'start', label: 'At the start' }, { value: 'both', label: 'Both ends' }]}
        onChange={(v) => set({ arrow: v === 'none' ? undefined : (v as PathLayer['arrow']) })} />
      <ColorField label="Fill" value={layer.fill} placeholder="None" onCommit={(v) => set({ fill: v || undefined })} />
      <p className="field-hint wide">Add the Draw preset to draw it on. Other layers can travel along it with Follow path (give it this layer&apos;s id: <code>{layer.id}</code>).</p>
    </Section>
  );
}

export function FlowSection(props: { scene: Scene; layer: FlowLayer; set: (patch: Partial<FlowLayer>) => void }) {
  const { scene, layer, set } = props;
  const options = allLayers(scene.layers).filter((o) => o.value !== layer.id);
  const sides = [{ value: 'auto', label: 'Facing the other' }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' }];
  return (
    <Section title="Flow lines">
      <SelectField label="From" value={layer.from} options={options} onChange={(v) => set({ from: v })} />
      <SelectField label="To" value={layer.to} options={options} onChange={(v) => set({ to: v })} />
      <NumberField label="Lines" value={layer.count ?? 7} step={1} min={1} max={40} onCommit={(v) => v && set({ count: Math.round(v) })} />
      <NumberField label="Spread at the ends" value={layer.spread ?? 8} step={0.5} min={0} max={60} unit="su" onCommit={(v) => set({ spread: v })} />
      <NumberField label="Squeeze in the middle" value={layer.pinch ?? 0.75} step={0.05} min={0} max={1} onCommit={(v) => set({ pinch: v })} />
      <NumberField label="Wave" value={layer.wave ?? 0.35} step={0.05} min={0} max={1} onCommit={(v) => set({ wave: v })} />
      <NumberField label="Line width" value={layer.width ?? 0.16} step={0.02} min={0.02} max={3} unit="su" onCommit={(v) => set({ width: v })} />
      <NumberField label="Glow" value={layer.glow ?? 1} step={0.1} min={0} max={3} onCommit={(v) => set({ glow: v })} />
      <NumberField label="Pulses per line" value={layer.pulses ?? 0} step={1} min={0} max={6} onCommit={(v) => set({ pulses: v ? Math.round(v) : undefined })} />
      {!!layer.pulses && <NumberField label="Pulse speed" value={layer.pulseSpeed ?? 0.5} step={0.05} min={0.05} max={5} unit="/s" onCommit={(v) => set({ pulseSpeed: v })} />}
      <TextField label="Colours" value={(layer.colors ?? ['#3b82f6', '#a855f7', '#f97316']).join(', ')} wide placeholder="#3b82f6, #a855f7, #f97316"
        onCommit={(v) => { const list = v.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 8); set({ colors: list.length ? list : undefined }); }} />
      <SelectField label="Leave from" value={layer.fromSide ?? 'auto'} options={sides} onChange={(v) => set({ fromSide: v === 'auto' ? undefined : (v as FlowLayer['fromSide']) })} />
      <SelectField label="Arrive at" value={layer.toSide ?? 'auto'} options={sides} onChange={(v) => set({ toSide: v === 'auto' ? undefined : (v as FlowLayer['toSide']) })} />
      <p className="field-hint wide">The lines are worked out every frame from where the two layers are, so they stay attached as either one moves. Draw draws them on; Follow path can send an icon along one (its id: <code>{layer.id}</code>).</p>
    </Section>
  );
}

export function DiagramSection(props: { layer: DiagramLayer; set: (patch: Partial<DiagramLayer>) => void }) {
  const { layer, set } = props;
  const [note, setNote] = useState<string | null>(null);
  const look = layer.look ?? {};
  const json = (v: unknown) => JSON.stringify(v, null, 1);
  const parse = (key: 'nodes' | 'edges' | 'tag', v: string) => {
    try {
      const data = v.trim() ? JSON.parse(v) : undefined;
      if (key === 'nodes' && (!Array.isArray(data) || !data.length)) throw new Error('nodes must be a list with at least one node');
      set({ [key]: data } as Partial<DiagramLayer>);
      setNote(null);
    } catch (e) {
      setNote(`That ${key} text isn't valid: ${(e as Error).message}`);
    }
  };
  return (
    <Section title="Diagram">
      <TextField label="Nodes" value={json(layer.nodes)} wide mono multiline onCommit={(v) => parse('nodes', v)} />
      <p className="field-hint wide">Each node: id, x and y (% of the box), label, sub, shape (box, pill, circle, dot or value), color, at (seconds it pops in), moves ([{'{'} t, x, y {'}'}]).</p>
      <TextField label="Connections" value={json(layer.edges ?? [])} wide mono multiline onCommit={(v) => parse('edges', v)} />
      <p className="field-hint wide">Each: from, to (node ids), kind (curve, straight or step), label, color, dashed, arrow, at.</p>
      <TextField label="Tag" value={layer.tag ? json(layer.tag) : ''} wide mono multiline placeholder={'{ "label": "HEAD", "stops": [{ "node": "a", "t": 1 }] }'} onCommit={(v) => parse('tag', v)} />
      {note && <p className="field-hint wide" role="alert">{note}</p>}
      <ColorField label="Lines" value={look.color} placeholder="#8b98a8" onCommit={(v) => set({ look: { ...look, color: v || undefined } })} />
      <ColorField label="Node fill" value={look.nodeFill} placeholder="#141a21" onCommit={(v) => set({ look: { ...look, nodeFill: v || undefined } })} />
      <ColorField label="Text" value={look.textColor} placeholder="#e6edf3" onCommit={(v) => set({ look: { ...look, textColor: v || undefined } })} />
      <NumberField label="Label size" value={look.fontSize ?? 1.4} step={0.1} min={0.4} max={10} unit="su" onCommit={(v) => set({ look: { ...look, fontSize: v } })} />
      <NumberField label="Line width" value={look.lineWidth ?? 0.2} step={0.05} min={0.05} max={3} unit="su" onCommit={(v) => set({ look: { ...look, lineWidth: v } })} />
      <TextField label="Font" value={look.fontFamily} placeholder="System" onCommit={(v) => set({ look: { ...look, fontFamily: v.trim() || undefined } })} />
    </Section>
  );
}

const LANGS = ['auto', 'js', 'ts', 'python', 'java', 'php', 'csharp', 'go', 'rust', 'c', 'cpp', 'sql', 'bash', 'html', 'css', 'json', 'text'] as const;

export function CodeSection(props: { layer: CodeLayer; set: (patch: Partial<CodeLayer>) => void }) {
  const { layer, set } = props;
  return (
    <Section title="Code">
      <TextField label="Code" value={layer.code} wide mono multiline onCommit={(v) => set({ code: v })} />
      <p className="field-hint wide">The code at the start. Type code clips hide the lines they type until they are typed; Change code turns it into a new version.</p>
      <TextField label="File name" value={layer.title} placeholder="main.py" onCommit={(v) => set({ title: v.trim() || undefined })} />
      <SelectField label="Language" value={layer.language ?? 'auto'} options={LANGS.map((l) => ({ value: l, label: l === 'auto' ? 'From the file name' : l }))} onChange={(v) => set({ language: v === 'auto' ? undefined : v })} />
      <SelectField label="Look" value={layer.frame ?? 'window'} options={[{ value: 'window', label: 'Editor window' }, { value: 'terminal', label: 'Terminal' }, { value: 'plain', label: 'Just the code' }]} onChange={(v) => set({ frame: v === 'window' ? undefined : v })} />
      <SelectField label="Theme" value={layer.theme ?? 'dark'} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} onChange={(v) => set({ theme: v === 'dark' ? undefined : v })} />
      <NumberField label="Text size" value={layer.fontSize ?? 1.5} step={0.1} min={0.4} max={20} unit="su" onCommit={(v) => set({ fontSize: v })} />
      <CheckField label="Line numbers" checked={layer.lineNumbers ?? (layer.frame ?? 'window') !== 'terminal'} onChange={(v) => set({ lineNumbers: v })} />
      <CheckField label="Run button" checked={!!layer.run} onChange={(v) => set({ run: v || undefined })} />
    </Section>
  );
}

/** The {{field}} names a list's item uses. */
function placeholders(item: unknown): string[] {
  const found = JSON.stringify(item).match(/\{\{\s*([\w.-]+)\s*\}\}/g) ?? [];
  return [...new Set(found.map((m) => m.replace(/[{}\s]/g, '')))];
}

export function RepeatSection(props: { layer: RepeatLayer; set: (patch: Partial<RepeatLayer>) => void; onUnpack: () => void }) {
  const { layer, set } = props;
  const [note, setNote] = useState<string | null>(null);
  const fields = placeholders(layer.item);
  const parse = (key: 'items' | 'item', v: string) => {
    try {
      const data = JSON.parse(v);
      if (key === 'items' && (!Array.isArray(data) || data.some((e) => !e || typeof e !== 'object'))) throw new Error('entries must be a list of objects');
      if (key === 'item' && (!data || typeof data !== 'object' || !data.type)) throw new Error('the item must be a layer');
      set({ [key]: data } as Partial<RepeatLayer>);
      setNote(null);
    } catch (e) {
      setNote(`That text is not valid: ${(e as Error).message}`);
    }
  };
  const fieldList: ReactNode[] = fields.flatMap((f, i) => [i ? ', ' : '', <code key={f}>{`{{${f}}}`}</code>]);
  return (
    <Section title="List">
      <TextField label="Entries" value={JSON.stringify(layer.items, null, 1)} wide mono multiline onCommit={(v) => parse('items', v)} />
      <p className="field-hint wide">
        One entry per copy. {fields.length
          ? <>The item uses {fieldList}: give each entry those fields.</>
          : <>Put placeholders like <code>{'{{title}}'}</code> in the item text and give each entry those fields.</>}
      </p>
      {note && <p className="field-hint wide" role="alert">{note}</p>}
      <NumberField label="Step across" value={layer.step?.x ?? 0} step={0.5} min={-100} max={100} unit="%" onCommit={(v) => set({ step: { ...layer.step, x: v } })} />
      <NumberField label="Step down" value={layer.step?.y ?? 12} step={0.5} min={-100} max={100} unit="%" onCommit={(v) => set({ step: { ...layer.step, y: v } })} />
      <NumberField label="Columns" value={layer.columns ?? 1} step={1} min={1} max={20} onCommit={(v) => set({ columns: v && v > 1 ? Math.round(v) : undefined })} />
      {(layer.columns ?? 1) > 1 && <NumberField label="Row step" value={layer.rowStep ?? 12} step={0.5} min={0} max={100} unit="%" onCommit={(v) => set({ rowStep: v })} />}
      <NumberField label="Stagger" value={layer.stagger ?? 0.12} step={0.01} min={0} max={5} unit="s" onCommit={(v) => set({ stagger: v })} />
      <TextField label="Item (advanced)" value={JSON.stringify(layer.item, null, 1)} wide mono multiline onCommit={(v) => parse('item', v)} />
      <p className="field-hint wide">To redesign the item on the stage, unpack the list into ordinary layers, change one copy, group it and turn it into a list again.</p>
      <div className="insp-start"><button type="button" className="btn small" onClick={props.onUnpack}>Unpack into layers</button></div>
    </Section>
  );
}

export function CaptionsSection(props: { scene: Scene; layer: CaptionsLayer; set: (patch: Partial<CaptionsLayer>) => void }) {
  const { scene, layer, set } = props;
  const voices = (scene.audio ?? []).filter((a) => a.words?.length);
  const style = layer.style;
  return (
    <Section title="Captions">
      {voices.length
        ? <SelectField label="Words from" value={layer.audio ?? ''} options={[{ value: '', label: 'The first voice-over' }, ...voices.map((a) => ({ value: a.id, label: a.name ?? a.id }))]} onChange={(v) => set({ audio: v || undefined })} />
        : <p className="field-hint wide">Captions need a voice-over with its words: add the audio, then transcribe it in its settings.</p>}
      <NumberField label="Words at a time" value={layer.maxWords ?? 4} step={1} min={1} max={12} onCommit={(v) => set({ maxWords: v ? Math.round(v) : undefined })} />
      <SelectField label="Words arrive" value={layer.motion ?? 'pop'} options={[{ value: 'pop', label: 'A few at a time (pop)' }, { value: 'slam', label: 'Each slams in (giant captions)' }, { value: 'drop', label: 'Each drops in (viral drop)' }]} onChange={(v) => set({ motion: v === 'pop' ? undefined : v as 'slam' | 'drop' })} />
      <SelectField label="Light up" value={layer.mode ?? 'word'} options={[{ value: 'word', label: 'The word being said' }, { value: 'karaoke', label: 'Every word said so far' }, { value: 'none', label: 'Nothing' }]} onChange={(v) => set({ mode: v === 'word' ? undefined : v })} />
      <ColorField label="Lit colour" value={layer.highlight} placeholder="#ffd166" onCommit={(v) => set({ highlight: v || undefined })} />
      <NumberField label="Size" value={style.fontSize} step={0.1} min={0.3} max={20} unit="su" onCommit={(v) => v && set({ style: { ...style, fontSize: v } })} />
      <ColorField label="Colour" value={style.color} placeholder="#ffffff" onCommit={(v) => set({ style: { ...style, color: v || undefined } })} />
      <TextField label="Font" value={style.fontFamily} placeholder="System" onCommit={(v) => set({ style: { ...style, fontFamily: v.trim() || undefined } })} />
      <NumberField label="Weight" value={style.fontWeight ?? 800} step={100} min={100} max={900} onCommit={(v) => set({ style: { ...style, fontWeight: v } })} />
      <ColorField label="Box behind" value={layer.background} placeholder="None" onCommit={(v) => set({ background: v || undefined })} />
      <CheckField label="Capitals" checked={!!layer.uppercase} onChange={(v) => set({ uppercase: v || undefined })} />
    </Section>
  );
}

/** Split into layers, for an image layer (through the AI Dev Kit). */
export function SplitImageSection(props: { scene: Scene; layer: Layer; onCommit: (scene: Scene) => void }) {
  const { scene, layer, onCommit } = props;
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [count, setCount] = useState(4);
  const [status, setStatus] = useState<SplitStatus | null | undefined>(undefined);
  if (layer.type !== 'image') return null;
  const check = () => { splitStatus().then(setStatus); };
  const run = async () => {
    setBusy(true);
    setNote(status?.engine === 'local' && !status.localModel ? 'Downloading the cut-out model (5 MB, once)…' : null);
    try {
      const r = await splitPicture(layer.src, count);
      onCommit(splitImageLayer(scene, layer.id, r.layers));
      setNote(null);
    } catch (e) {
      setNote(`Could not split it: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Section title="Split into layers">
      <p className="field-hint wide">
        Turns the picture into stacked transparent layers in exactly the same place (background, subject, objects), so it can be revealed piece by
        piece, and each layer gets a depth: with a camera move, a flat photo becomes a 2.5D shot.
      </p>
      {status === undefined && <div className="insp-start"><button type="button" className="btn small" onClick={check}>Check the AI Dev Kit</button></div>}
      {status === null && <p className="field-hint wide">The AI Dev Kit is not running on this computer (or is too old to split pictures).</p>}
      {status && (
        <>
          <p className="field-hint wide">
            {status.fal
              ? 'Using your fal.ai key: an AI splits it into several layers (fal.ai charges your account, about $0.05).'
              : 'On this computer: the subject is cut out and the background filled in behind it (two layers). Add a fal.ai key to the kit (FAL_KEY) for an AI split into more layers.'}
          </p>
          {status.fal && <NumberField label="Layers" value={count} step={1} min={2} max={10} onCommit={(v) => v && setCount(Math.round(v))} />}
          <div className="insp-start"><button type="button" className="btn small" disabled={busy || !layer.src} onClick={run}>{busy ? 'Splitting…' : 'Split into layers'}</button></div>
        </>
      )}
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}

export function CursorSection(props: { layer: CursorLayer; set: (patch: Partial<CursorLayer>) => void }) {
  const { layer, set } = props;
  return (
    <Section title="Cursor">
      <SelectField label="Shape" value={layer.shape ?? 'auto'} options={[{ value: 'auto', label: 'Arrow, a hand over links' }, { value: 'arrow', label: 'Always an arrow' }, { value: 'hand', label: 'Always a hand' }]} onChange={(v) => set({ shape: v === 'auto' ? undefined : v })} />
      <SelectField label="Look" value={layer.theme ?? 'light'} options={[{ value: 'light', label: 'White, dark outline' }, { value: 'dark', label: 'Dark, white outline' }]} onChange={(v) => set({ theme: v === 'light' ? undefined : v })} />
      <ColorField label="Click ring" value={layer.ringColor} placeholder="#ffffff" onCommit={(v) => set({ ringColor: v || undefined })} />
      <p className="field-hint wide">
        Its position is where the tip starts: keep it off the stage so it enters. Add <strong>Move to</strong> (pick the layer to
        point at) and <strong>Click</strong> from the Cursor and tours presets. Its width is its size: 3 to 7% reads well in a video.
      </p>
    </Section>
  );
}

const HOVERS = [
  { value: '', label: 'Nothing' }, { value: 'lift', label: 'Lift' }, { value: 'grow', label: 'Grow' }, { value: 'glow', label: 'Glow' },
  { value: 'brighten', label: 'Brighten' }, { value: 'shine', label: 'A shine sweeps across' }, { value: 'underline', label: 'Underline draws in' }, { value: 'color', label: 'Change colour' },
];

export function HoverSection(props: { layer: Layer; set: (hover: Layer['hover']) => void }) {
  const h = props.layer.hover;
  const set = (patch: Partial<NonNullable<Layer['hover']>>) => {
    const next = { ...(h ?? { effect: 'lift' }), ...patch } as NonNullable<Layer['hover']>;
    props.set(next.effect ? next : undefined);
  };
  return (
    <Section title="Hover">
      <SelectField label="When pointed at" value={h?.effect ?? ''} options={HOVERS} onChange={(v) => (v ? set({ effect: v as NonNullable<Layer['hover']>['effect'] }) : props.set(undefined))} />
      {h && ['glow', 'underline', 'color'].includes(h.effect) && <ColorField label="Colour" value={h.color} placeholder="#2ad38b" onCommit={(v) => set({ color: v || undefined })} />}
      {h && <TextField label="Custom CSS (trusted pages)" value={h.css} mono wide placeholder="e.g. rotate: -2deg;" onCommit={(v) => set({ css: v.trim() || undefined })} />}
      <p className="field-hint wide">On a page, with a mouse. Phones just follow the link on a tap. Custom CSS runs only where custom code is allowed (in WordPress, for authors who may post HTML).</p>
    </Section>
  );
}

export function CutOutSection(props: { scene: Scene; layer: Layer; onCommit: (scene: Scene) => void; onSelect: (id: string) => void }) {
  const { scene, layer } = props;
  const [r, setR] = useState({ x: 60, y: 70, w: 25, h: 15 });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  if (layer.type !== 'image') return null;
  const run = async () => {
    setBusy(true);
    setNote(null);
    try {
      const out = await cutOut(scene, layer.id, r);
      props.onCommit(out.scene);
      props.onSelect(out.id);
    } catch (e) {
      setNote(`Could not cut it out: ${(e as Error).message}.`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Section title="Cut a piece out">
      <p className="field-hint wide">A button, a panel or a row of the screenshot becomes its own layer in exactly the same place (ready to press, slide or glow), and the gap behind it is filled from its surroundings. The box is in % of this layer.</p>
      <NumberField label="Left" value={r.x} step={0.5} min={0} max={100} unit="%" onCommit={(v) => v !== undefined && setR({ ...r, x: v })} />
      <NumberField label="Top" value={r.y} step={0.5} min={0} max={100} unit="%" onCommit={(v) => v !== undefined && setR({ ...r, y: v })} />
      <NumberField label="Width" value={r.w} step={0.5} min={0.5} max={100} unit="%" onCommit={(v) => v && setR({ ...r, w: v })} />
      <NumberField label="Height" value={r.h} step={0.5} min={0.5} max={100} unit="%" onCommit={(v) => v && setR({ ...r, h: v })} />
      <div className="insp-start"><button type="button" className="btn small" disabled={busy || !layer.src} onClick={run}>{busy ? 'Cutting…' : 'Cut it out'}</button></div>
      {note && <p className="field-hint wide" role="alert">{note}</p>}
    </Section>
  );
}

export function StepsSection(props: { scene: Scene; onCommit: (scene: Scene) => void }) {
  const { scene } = props;
  const [note, setNote] = useState<string | null>(null);
  const steps = scene.steps ?? [];
  const save = (v: string) => {
    try {
      const data = v.trim() ? JSON.parse(v) : [];
      if (!Array.isArray(data) || data.some((s) => !s || typeof s.id !== 'string' || !Array.isArray(s.do))) throw new Error('each step needs an id and a "do" list');
      const r = applySteps({ ...scene, steps: data.length ? data : undefined });
      props.onCommit(r.scene);
      setNote(r.warnings.length ? r.warnings.join(' ') : `${data.length} ${data.length === 1 ? 'step' : 'steps'} applied.`);
    } catch (e) {
      setNote(`That text is not valid: ${(e as Error).message}.`);
    }
  };
  return (
    <Section title="Steps">
      <p className="field-hint wide">
        A walkthrough as a list of steps, each saying what changes ({'{'} "id": "save", "label": "Save", "do": [{'{'} "layer": "cursor", "preset": "cursor-click" {'}'}, {'{'} "layer": "status", "preset": "text-swap", "params": {'{'} "to": "Saved" {'}'} {'}'}] {'}'}).
        Each step starts when the one before has finished and held ("hold", seconds; or "at"); its changes start together ("offset" to stagger). Each step also gets a marker, for click-to-advance and hotspots.
      </p>
      <TextField label="Steps" value={steps.length ? JSON.stringify(steps, null, 1) : ''} wide mono multiline placeholder="[]" onCommit={save} />
      {steps.length > 0 && <div className="insp-start"><button type="button" className="btn small" onClick={() => save(JSON.stringify(steps))}>Apply the steps again</button></div>}
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}

/** Voice-over from a script: a free voice on this computer (through the AI Dev Kit) speaks it, every word timed. */
export function ScriptVoiceSection(props: { scene: Scene; onCommit: (scene: Scene) => void }) {
  const [script, setScript] = useState('');
  const [voice, setVoice] = useState('en_US-lessac-medium');
  const [pace, setPace] = useState(1.12);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const make = async () => {
    const lines = script.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    setBusy(true);
    try {
      const st = await voiceStatus();
      if (!st) throw new Error('Start the AI Dev Kit on this computer (an up-to-date one) first.');
      if (!st.transcription) throw new Error('Install speech recognition in the AI Dev Kit first (select an audio clip, Words): it times every word.');
      if (!st.program || !st.voices[voice]?.installed) await installVoice(voice, (s) => setNote(`Installing the voice: ${s}`));
      const v = await speak(lines, { voice, pace, onStep: (s) => setNote(s) });
      props.onCommit(withVoice(props.scene, v).scene);
      setNote(`Added a ${v.duration.toFixed(1)} s voice-over with ${v.words.length} timed words. Select it on the timeline to make a scene from it.`);
    } catch (e) {
      setNote(`Could not make it: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Section title="Voice-over from a script">
      <TextField label="Script (one line per sentence or beat)" value={script} wide multiline placeholder="Meet Jotter, the fastest way to save an idea." onCommit={setScript} />
      <SelectField label="Voice" value={voice} options={[{ value: 'en_US-lessac-medium', label: 'Clear (American English)' }, { value: 'en_US-ryan-medium', label: 'Warm (American English)' }, { value: 'en_GB-alba-medium', label: 'Bright (British English)' }]} onChange={setVoice} />
      <NumberField label="Pace (higher is slower)" value={pace} step={0.02} min={0.7} max={1.6} onCommit={(v) => v && setPace(v)} />
      <div className="insp-start"><button type="button" className="btn small" disabled={busy || !script.trim()} onClick={make}>{busy ? 'Speaking…' : 'Make the voice-over'}</button></div>
      <p className="field-hint wide">No microphone needed: a free voice runs on your computer through the AI Dev Kit (downloaded once, about 60 MB), and every word is timed, so scenes and captions follow it exactly. Changing one line remakes only that line.</p>
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}
