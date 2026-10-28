import { useState } from 'react';
import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { STACKS, applyStack, sceneBeats } from '../lib/stacks';
import { Section } from './fields';

/** Effect stacks: one click adds a named combination of effects to this layer, at the playhead (on the nearest beat). */
export function StacksSection(props: { scene: Scene; layer: Layer; time: number; onCommit: (scene: Scene) => void; onSeek?: (t: number) => void }) {
  const { scene, layer, time, onCommit } = props;
  const [note, setNote] = useState<string | null>(null);
  const stacks = STACKS.filter((s) => s.for.includes(layer.type));
  if (!stacks.length) return null;
  const beats = sceneBeats(scene).length > 0;
  return (
    <Section title="Effect stacks">
      <p className="field-hint wide">
        One click adds a combination of effects here at the playhead ({time.toFixed(2)} s){beats ? ', moved onto the nearest beat of the music' : ''}.
        Each is ordinary clips on the timeline: move, trim or delete them like any other.
      </p>
      <div className="stack-list">
        {stacks.map((s) => (
          <button key={s.id} type="button" className="btn small" title={s.hint}
            onClick={() => {
              // Only while the layer is on: an effect after it has gone would never show.
              const from = layer.start ?? 0, to = typeof layer.end === 'number' ? layer.end : scene.duration;
              if (time < from || time > to - 0.3) { setNote(`Move the playhead to where this layer is on screen (${from.toFixed(1)}–${to.toFixed(1)} s), then click again.`); return; }
              const r = applyStack(scene, layer.id, s, time);
              if (!r.added) { setNote(`${s.name} does not suit this layer.`); return; }
              onCommit(r.scene);
              setNote(`${s.name}: ${r.added} clip${r.added === 1 ? '' : 's'} at ${r.at.toFixed(2)} s${r.snapped ? ' (on the beat)' : ''}. Undo removes them.`);
            }}>{s.name}</button>
        ))}
      </div>
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}
