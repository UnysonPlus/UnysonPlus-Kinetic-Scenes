import { useState } from 'react';
import type { CodeLayer, DiagramLayer, FlowLayer, Layer, PathLayer, Scene } from '@unysonplus/scene-player/types';
import { CheckField, ColorField, NumberField, Section, SelectField, TextField } from './fields';

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
