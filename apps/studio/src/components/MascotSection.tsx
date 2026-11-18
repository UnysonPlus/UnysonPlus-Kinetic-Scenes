import { useRef, useState } from 'react';
import type { Clip, MascotLayer, Scene } from '@unysonplus/scene-player/types';
import { mascotVoices, measureVoiceLevels, withLevels } from '../lib/levels';
import { downloadMascot, layerFromFile, mascotFile, readMascotFile, saveMascot } from '../lib/mascotStore';
import { CheckField, NumberField, Section, SelectField } from './fields';
import { findLayer, mapLayer } from '../lib/sceneOps';

/** The Inspector for a Mascot layer: its main pose, the voice it talks on, how much it talks, blinking and breathing, and pose changes. */
export function MascotSection(props: { scene: Scene; layer: MascotLayer; time: number; set: (patch: Partial<MascotLayer>) => void; onCommit: (scene: Scene) => void; onEdit: () => void; onSelectClip: (clipId: string) => void; onAddMascot?: (fields: Partial<MascotLayer>) => void; latest?: () => Scene }) {
  const { scene, layer, set } = props;
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const talksOn = mascotVoices(scene, layer.audio);
  const timed = talksOn.length > 0 && talksOn.every((a) => a.levels);
  const run = async (what: string, fn: () => Promise<string | void>) => { setBusy(what); setMsg(null); try { const m = await fn(); if (m) setMsg(m); } catch (e) { setMsg((e as Error).message); } finally { setBusy(null); } };
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
      {talksOn.length > 0 && (timed
        ? <p className="field-hint wide">Lip sync: the mouth follows the voice's loudness as well as its words (shut in the pauses).</p>
        : <div className="insp-start wide"><button type="button" className="btn small ghost" disabled={!!busy} onClick={() => run('levels', async () => { const lv = await measureVoiceLevels(scene, layer.audio); if (lv.size) { props.onCommit(withLevels(props.latest?.() ?? scene, lv)); return 'The mouth now follows the loudness of the voice too.'; } return 'There is no sound to measure on that voice-over.'; })}>{busy === 'levels' ? 'Listening to the voice…' : 'Sharper lip sync'}</button><span className="field-hint">Times the mouth to the voice's loudness too, so it shuts in the pauses.</span></div>)}
      {noMouth.length > 0 && <p className="field-hint wide">No mouth set on {noMouth.join(', ')}: {noMouth.length === 1 ? 'it does' : 'they do'} not talk. Set it in Edit the mascot.</p>}
      <div className="insp-start wide">
        {layer.poses.length > 1 && <button type="button" className="btn small" onClick={addChange} title="A Pose clip at the playhead: the mascot holds another pose for a moment">Add a pose change</button>}
        <button type="button" className="btn small ghost" onClick={props.onEdit}>Edit the mascot</button>
      </div>
      <div className="field wide">
        <span className="field-label">Import / Export</span>
        <div className="insp-start wide">
          <button type="button" className="btn small ghost" disabled={!!busy} onClick={() => run('save', async () => { const f = await mascotFile(layer); await saveMascot({ id: `m${Date.now()}`, name: f.name, saved: Date.now(), file: f }); return `Saved to your mascots: Insert › Mascot… lists it in any project.`; })}>{busy === 'save' ? 'Saving…' : 'Save to my mascots'}</button>
          <button type="button" className="btn small ghost" disabled={!!busy} onClick={() => run('export', async () => { downloadMascot(await mascotFile(layer)); return 'Exported as one file (every picture inside it).'; })}>{busy === 'export' ? 'Packing…' : 'Export the mascot'}</button>
          {props.onAddMascot && <button type="button" className="btn small ghost" disabled={!!busy} onClick={() => fileRef.current?.click()}>Import a mascot…</button>}
        </div>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; run('import', async () => { props.onAddMascot?.(layerFromFile(readMascotFile(await file.text()))); return 'Imported: the mascot is added to the scene.'; }); }} />
        <p className="field-hint wide">A mascot file (.mascot.json) carries its poses, face and drawn mouths, to use on another computer or share with your team.</p>
      </div>
      {msg && <p className="field-hint wide" role="status">{msg}</p>}
      {layer.poses.length > 1 && <p className="field-hint wide">A pose change is a Pose clip on its row: pick the pose in it, drag it to its moment, or pin it to a word (Timing › On a word) so the pose arrives as the word is said.</p>}
    </Section>
  );
}
