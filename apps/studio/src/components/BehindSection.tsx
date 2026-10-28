import { useState } from 'react';
import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { footageLayers, isBehind, people, putBehind } from '../lib/behind';
import { cutOutPerson } from '../lib/footageKit';
import { Section } from './fields';

/**
 * Behind the person: a text layer placed between the footage and the person cut out of it, so the title appears to
 * stand behind them. Cuts the person out first when the footage has no cut-out yet (through the AI Dev Kit).
 */
export function BehindSection(props: { scene: Scene; layer: Layer; onCommit: (scene: Scene) => void }) {
  const { scene, layer, onCommit } = props;
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const footage = footageLayers(scene);
  if (layer.type !== 'text' || !footage.length) return null;
  const cut = people(scene);
  const behind = isBehind(scene, layer.id);

  const go = async () => {
    setNote(null);
    try {
      let next = scene;
      let person = cut[0]?.person;
      if (!person) {
        setBusy('Cutting out the person');
        const c = await cutOutPerson(next, footage[0].id, 'fine', (s) => setBusy(`Cutting out the person: ${s}`));
        next = c.scene; person = c.id;
      }
      const r = putBehind(next, layer.id, person);
      onCommit(r.scene);
      setNote(`The title is behind the person now${r.unpinned ? ' (it was pinned to the stage, which draws it above everything, so it is unpinned)' : ''}. Undo goes back.`);
    } catch (e) {
      setNote(`Could not put it behind the person: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Section title="Behind the person">
      <p className="field-hint wide">
        Puts this text between the footage and the person in it, so they stand in front of the words.
        {cut.length ? ' The person is already cut out.' : ' The person is cut out first, on this computer (AI Dev Kit), which takes a minute or two.'}
        {' '}Place the words where the person will pass in front of part of them, not over their face.
      </p>
      <div className="insp-start">
        <button type="button" className="btn small" disabled={!!busy || behind} onClick={go}>
          {behind ? 'Behind the person' : busy ? 'Working…' : 'Put behind the person'}
        </button>
      </div>
      {busy && <p className="field-hint wide" role="status">{busy}…</p>}
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}
