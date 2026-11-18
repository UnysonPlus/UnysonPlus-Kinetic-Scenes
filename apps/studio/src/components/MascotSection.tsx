import type { Clip, MascotLayer, Scene } from '@unysonplus/scene-player/types';
import { CheckField, NumberField, Section, SelectField } from './fields';
import { findLayer, mapLayer } from '../lib/sceneOps';

/** The Inspector for a Mascot layer: its main pose, the voice it talks on, how much it talks, blinking and breathing, and pose changes. */
export function MascotSection(props: { scene: Scene; layer: MascotLayer; time: number; set: (patch: Partial<MascotLayer>) => void; onCommit: (scene: Scene) => void; onEdit: () => void; onSelectClip: (clipId: string) => void }) {
  const { scene, layer, set } = props;
  const voices = (scene.audio ?? []).filter((a) => a.words?.length);
  const poses = layer.poses.map((p) => ({ value: p.id, label: p.name }));
  const main = layer.pose ?? layer.poses[0]?.id;
  const changes = layer.clips.filter((c) => c.preset === 'mascot-pose');
  const noMouth = layer.poses.filter((p) => !p.mouth).map((p) => p.name);

  const addChange = () => {
    const other = layer.poses.find((p) => p.id !== main && !changes.some((c) => c.params?.pose === p.id)) ?? layer.poses.find((p) => p.id !== main) ?? layer.poses[0];
    let n = changes.length + 1, id = `${layer.id}-pose-${n}`;
    while (layer.clips.some((c) => c.id === id)) id = `${layer.id}-pose-${++n}`;
    const start = Math.max(0, Math.min(scene.duration - 0.2, +props.time.toFixed(2)));
    const clip: Clip = { id, preset: 'mascot-pose', start, duration: +Math.min(1.6, scene.duration - start).toFixed(2), params: { pose: other.id } };
    const cur = findLayer(scene, layer.id) as MascotLayer | null;
    if (!cur) return;
    props.onCommit(mapLayer(scene, layer.id, (l) => ({ ...l, clips: [...l.clips, clip] })));
    props.onSelectClip(id);
  };

  return (
    <Section title="Mascot">
      <p className="field-hint wide">
        {layer.poses.length} pose{layer.poses.length === 1 ? '' : 's'}: {layer.poses.map((p) => p.name).join(', ')}. It talks on the voice-over, blinks and breathes by itself.
      </p>
      {layer.poses.length > 1 && <SelectField label="Main pose" value={main ?? ''} options={poses} onChange={(v) => set({ pose: v === layer.poses[0].id ? undefined : v })} />}
      {voices.length
        ? <SelectField label="Talks on" value={layer.audio ?? ''} options={[{ value: '', label: 'The first voice-over' }, ...voices.map((a) => ({ value: a.id, label: a.name ?? a.id }))]} onChange={(v) => set({ audio: v || undefined })} />
        : <p className="field-hint wide">It talks on a voice-over with its words. Add one (Audio › Voice-over, or AI assist), and it starts talking.</p>}
      <NumberField label="Mouth opens" value={layer.talk ?? 1} step={0.1} min={0} max={1.5} onCommit={(v) => set({ talk: v === undefined || v === 1 ? undefined : v })} />
      <CheckField label="Blinks" checked={layer.blink !== false} onChange={(v) => set({ blink: v ? undefined : false })} />
      <CheckField label="Breathes" checked={layer.breathe !== false} onChange={(v) => set({ breathe: v ? undefined : false })} />
      {noMouth.length > 0 && <p className="field-hint wide">No mouth set on {noMouth.join(', ')}: {noMouth.length === 1 ? 'it does' : 'they do'} not talk. Set it in Edit the mascot.</p>}
      <div className="insp-start wide">
        {layer.poses.length > 1 && <button type="button" className="btn small" onClick={addChange} title="A Pose clip at the playhead: the mascot holds another pose for a moment">Add a pose change</button>}
        <button type="button" className="btn small ghost" onClick={props.onEdit}>Edit the mascot</button>
      </div>
      {layer.poses.length > 1 && <p className="field-hint wide">A pose change is a Pose clip on its row: pick the pose in it, drag it to its moment, or pin it to a word (Timing › On a word) so the pose arrives as the word is said.</p>}
    </Section>
  );
}
