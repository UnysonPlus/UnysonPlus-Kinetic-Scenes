import { useMemo, useState } from 'react';
import { SFX_CATALOG, SFX_CATEGORY_LABELS, sfxSrc, type SfxCategory } from '@unysonplus/scene-player/sfx';

/**
 * The built-in sounds: click to hear one, then add it to the selected clip (it plays with the clip and
 * moves with it) or, with no clip selected, as a sound on its own at the playhead.
 */
import { MoreSounds } from './MoreSounds';
export function SoundLibrary(props: {
  /** A clip is selected: "Add" attaches the sound to it. */
  clipSelected: boolean;
  /** The selected clip's current sound. */
  current?: string;
  /** Clips that have no sound yet but a suggested one. */
  suggestible: number;
  /** Clips that have a sound. */
  withSound: number;
  onPreview: (src: string) => void;
  onAdd: (id: string) => void;
  onSuggest: () => void;
  onClearAll: () => void;
  /** Adds a sound file (made, or found on Freesound) at the playhead. */
  onAddFile?: (src: string, name: string, seconds: number) => void;
}) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SFX_CATALOG.filter((s) => !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    return (Object.keys(SFX_CATEGORY_LABELS) as SfxCategory[]).map((c) => ({ c, items: list.filter((s) => s.category === c) })).filter((g) => g.items.length);
  }, [query]);

  return (
    <>
      <div className="lib-head">
        <input type="search" className="lib-search" placeholder="Search sounds" aria-label="Search sounds" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="lib-help">
          {props.clipSelected
            ? 'Click a sound to hear it; "Add" puts it on the selected clip, so it moves with the clip.'
            : 'Click a sound to hear it; "Add" places it at the playhead. Select a clip to give it a sound instead.'}
        </p>
        <div className="snd-bulk">
          <button type="button" className="btn small" disabled={!props.suggestible} onClick={props.onSuggest}
            title="Gives the scene's key moments a sound that suits their preset, spaced so they never pile up (ambient loops stay quiet)">
            Add suggested sounds{props.suggestible ? ` (${props.suggestible})` : ''}
          </button>
          {props.withSound > 0 && (
            <button type="button" className="btn small ghost" onClick={props.onClearAll} title="Removes the sound from every clip (sound tracks stay)">
              Remove clip sounds
            </button>
          )}
        </div>
      </div>
      <div className="lib-scroll">
        {props.onAddFile && !query && <MoreSounds onPreview={props.onPreview} onAdd={props.onAddFile} />}
        {groups.map((g) => (
          <section key={g.c} className="lib-group">
            <h3>{SFX_CATEGORY_LABELS[g.c]}</h3>
            <ul className="snd-list">
              {g.items.map((s) => (
                <li key={s.id} className={`snd${props.current === s.id ? ' on' : ''}`}>
                  <button
                    type="button"
                    className="snd-play"
                    onClick={() => props.onPreview(sfxSrc(s.id))}
                    title={`${s.description} (${s.length.toFixed(2)} s). Click to hear it.`}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    <span className="snd-name">{s.label}</span>
                    <span className="snd-len mono">{s.length.toFixed(1)}s</span>
                  </button>
                  <button type="button" className="snd-add" onClick={() => props.onAdd(s.id)}
                    aria-label={`Add ${s.label}${props.clipSelected ? ' to the selected clip' : ' at the playhead'}`}
                    title={props.clipSelected ? 'Add to the selected clip' : 'Add at the playhead'}>
                    {props.current === s.id ? '✓' : 'Add'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="lib-empty">No sound matches “{query}”.</p>}
      </div>
    </>
  );
}
