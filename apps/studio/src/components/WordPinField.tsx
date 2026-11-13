import { useState } from 'react';
import type { AudioClip, Scene, WordPin } from '@unysonplus/scene-player/types';
import { pinTime } from '@unysonplus/scene-player/words';
import { NumberField, SelectField } from './fields';

/** Voice clips with their words: the ones a layer or a clip can be pinned to. */
const voicesOf = (scene: Scene): AudioClip[] => (scene.audio ?? []).filter((a) => (a.words?.length ?? 0) > 0);
const clean = (w: string) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

/**
 * "On a word": pins a layer's start or end, or a clip's start, to a word of a voice-over (WordPin). Pick the voice,
 * click a word in it (shift-click a later word to take the phrase up to it); from then on the time follows that word
 * as the voice is re-recorded, reworded, trimmed or translated.
 */
export function WordPinField(props: { scene: Scene; label: string; value: WordPin | undefined; onChange: (pin: WordPin | undefined) => void; hint?: string }) {
  const { scene, value, onChange } = props;
  const voices = voicesOf(scene);
  const [open, setOpen] = useState(false);
  const [audioId, setAudioId] = useState<string>(value?.audio ?? voices[0]?.id ?? '');
  const match = value ? pinTime(scene, value) : null;

  if (!voices.length && !value) {
    return <p className="field-hint wide">{props.label}: pin it to a word of the voice-over. Add a voice-over with its words first (Audio › Voice-over from a script, or transcribe a recording).</p>;
  }

  const clip = voices.find((v) => v.id === audioId) ?? voices[0];
  const words = clip?.words ?? [];
  const pick = (i: number, extend: boolean) => {
    if (!clip) return;
    if (extend && value && value.audio === clip.id && typeof value.index === 'number' && i >= value.index) {
      const text = words.slice(value.index, i + 1).map((w) => clean(w.w)).filter(Boolean).join(' ');
      onChange({ ...value, text });
      return;
    }
    onChange({ audio: clip.id, text: clean(words[i].w) || words[i].w, index: i, ...(value?.edge ? { edge: value.edge } : {}), ...(value?.offset ? { offset: value.offset } : {}) });
  };
  const span = value && value.audio === clip?.id && typeof value.index === 'number' ? [value.index, value.index + value.text.split(/\s+/).length - 1] : null;

  return (
    <div className="wordpin wide">
      <div className="wordpin-head">
        <span className="wordpin-label">{props.label}</span>
        {value ? (
          <span className={`wordpin-state${match ? '' : ' is-lost'}`}>
            “{value.text}”{match ? ` · ${match.t.toFixed(2)} s` : ' · not said any more'}
          </span>
        ) : <span className="wordpin-state is-off">not pinned</span>}
        <button type="button" className="btn small" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Done' : value ? 'Change' : 'Pin to a word'}</button>
        {value && <button type="button" className="btn small ghost" onClick={() => onChange(undefined)}>Unpin</button>}
      </div>
      {open && clip && (
        <>
          {voices.length > 1 && (
            <SelectField label="Voice" value={clip.id} options={voices.map((v) => ({ value: v.id, label: v.name || v.id }))} onChange={(v) => setAudioId(v)} />
          )}
          <div className="wordpin-words" role="listbox" aria-label="Words of the voice-over: click one to pin to it, shift-click a later one for a phrase">
            {words.map((w, i) => {
              const on = !!span && i >= span[0] && i <= span[1];
              return (
                <button key={i} type="button" role="option" aria-selected={on} className={`wordpin-word${on ? ' is-on' : ''}`}
                  title={`${(clip.start + w.t - (clip.offset ?? 0)).toFixed(2)} s`} onClick={(e) => pick(i, e.shiftKey)}>{w.w}</button>
              );
            })}
          </div>
          {value && (
            <>
              <SelectField label="At" value={value.edge ?? 'start'} options={[{ value: 'start', label: 'When the word begins' }, { value: 'end', label: 'When it ends' }]}
                onChange={(v) => onChange({ ...value, edge: v === 'start' ? undefined : v as WordPin['edge'] })} />
              <NumberField label="Offset" value={value.offset ?? 0} step={0.05} min={-10} max={10} unit="s"
                onCommit={(v) => onChange({ ...value, offset: v ? v : undefined })} />
            </>
          )}
          <p className="field-hint wide">{props.hint ?? 'Click a word; shift-click a later word to pin to the whole phrase. The time then follows the word whenever the voice changes.'}</p>
        </>
      )}
    </div>
  );
}
