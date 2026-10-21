import type { AudioClip, Scene } from '@unysonplus/scene-player/types';
import { NumberField, Section, SelectField, TextField } from './fields';
import { removeAudio, setAudio, type AudioInfo } from '../lib/audio';
import { SFX_CATALOG, parseSfxSrc, sfxMeta, sfxSrc } from '@unysonplus/scene-player/sfx';
import { WordsSection } from './WordsSection';
import { useRef, useState } from 'react';
import { separateClip } from '../lib/separate';
import { analyseMusic, sceneBeats, snapToBeats, strongMoments } from '../lib/beats';

/** The Inspector for a selected audio clip: timing, trim, volume and fades. */
export function AudioInspector(props: {
  scene: Scene;
  clip: AudioClip;
  info: AudioInfo | undefined;
  onCommit: (scene: Scene) => void;
  onDeselect: () => void;
  /** Jump the playhead (clicking a word). */
  onSeek: (t: number) => void;
  onMakeScene?: (clipId: string) => void;
  /** Decodes the clip's file (for finding the beats). */
  decode?: (src: string) => Promise<AudioBuffer | null>;
}) {
  const { scene, clip, info } = props;
  const set = (patch: Partial<AudioClip>) => props.onCommit(setAudio(scene, clip.id, patch));
  const trimIn = clip.offset ?? 0;
  const fileLen = info?.duration;
  const len = clip.duration ?? (fileLen !== undefined ? fileLen - trimIn : undefined);
  const uploaded = clip.src.startsWith('data:');
  const builtIn = parseSfxSrc(clip.src);
  const kb = uploaded ? Math.round((clip.src.length * 3) / 4 / 1024) : 0;

  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">Audio</p>
        <input className="insp-title" aria-label="Audio name" defaultValue={clip.name ?? clip.id} key={clip.id + (clip.name ?? '')}
          onBlur={(e) => { if (e.target.value !== (clip.name ?? clip.id)) set({ name: e.target.value || undefined }); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
        <p className="insp-help">
          {fileLen !== undefined ? `${fileLen.toFixed(2)} s file` : 'Reading the file…'}
          {builtIn ? ' · built-in sound' : uploaded ? ` · uploaded (${kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`}, stored in the scene)` : ' · from an address'}
        </p>
      </div>

      <Section title="Timing">
        <NumberField label="Starts" value={clip.start} step={0.05} min={0} max={scene.duration} unit="s" onCommit={(v) => v !== undefined && set({ start: v })} />
        <NumberField label="Length" value={clip.duration} placeholder={len !== undefined ? len.toFixed(2) : ''} step={0.05} min={0.1} max={fileLen !== undefined ? fileLen - trimIn : undefined} unit="s" optional
          onCommit={(v) => set({ duration: v })} />
        <NumberField label="Trim start" value={trimIn} step={0.05} min={0} max={fileLen} unit="s" onCommit={(v) => set({ offset: v || undefined })} />
        <SelectField label="Kind" value={clip.role ?? 'sfx'} onChange={(v) => set({ role: v as AudioClip['role'] })}
          options={[{ value: 'voice', label: 'Voice-over' }, { value: 'music', label: 'Music' }, { value: 'sfx', label: 'Sound effect' }]} />
        <p className="field-hint wide">Drag the clip on the timeline to move it; drag an edge to trim. Length left empty plays to the end of the file.</p>
      </Section>

      {!builtIn && (clip.role === 'music') && <BeatsSection scene={scene} clip={clip} onCommit={props.onCommit} decode={props.decode} />}

      {!builtIn && <WordsSection scene={scene} clip={clip} onCommit={props.onCommit} onSeek={props.onSeek} onMakeScene={props.onMakeScene ? () => props.onMakeScene!(clip.id) : undefined} />}

      {!builtIn && clip.role !== 'sfx' && <SeparateSection scene={scene} clip={clip} onCommit={props.onCommit} />}

      <Section title="Level">
        <NumberField label="Volume" value={Math.round((clip.volume ?? 1) * 100)} step={5} min={0} max={200} unit="%" onCommit={(v) => set({ volume: v === undefined || v === 100 ? undefined : v / 100 })} />
        <span />
        <NumberField label="Fade in" value={clip.fadeIn ?? 0} step={0.05} min={0} unit="s" onCommit={(v) => set({ fadeIn: v || undefined })} />
        <NumberField label="Fade out" value={clip.fadeOut ?? 0} step={0.05} min={0} unit="s" onCommit={(v) => set({ fadeOut: v || undefined })} />
      </Section>

      {builtIn ? (
        <Section title="Built-in sound">
          <SelectField label="Sound" value={builtIn.id} onChange={(v) => set({ src: sfxSrc(v, builtIn.pitch), name: sfxMeta(v)?.label })}
            options={SFX_CATALOG.map((s) => ({ value: s.id, label: s.label }))} />
          <NumberField label="Pitch" value={Math.round(builtIn.pitch * 100)} step={5} min={50} max={200} unit="%" onCommit={(v) => set({ src: sfxSrc(builtIn.id, v === undefined ? 1 : v / 100) })} />
          <p className="field-hint wide">{sfxMeta(builtIn.id)?.description} Synthesised by the player: nothing to download. To have a sound follow an animation, give the clip a sound instead (select the clip, Sound).</p>
        </Section>
      ) : (
      <Section title="Source">
        <TextField label="Address" wide mono value={uploaded ? '(uploaded file)' : clip.src}
          onCommit={(v) => { const t = v.trim(); if (t && t !== '(uploaded file)') set({ src: t }); }} />
        <p className="field-hint wide">
          On websites, sound starts muted with a "Tap for sound" button (browsers block sound until the visitor interacts).
          Scenes that play as the page scrolls stay silent. Video exports include the sound.
          {uploaded && kb > 1024 ? ' A file this size makes share links and embeds heavy: an address (for example your WordPress media library) keeps them light.' : ''}
        </p>
      </Section>
      )}

      <div className="insp-actions">
        <button type="button" className="btn small danger" onClick={() => { props.onCommit(removeAudio(scene, clip.id)); props.onDeselect(); }}>Delete audio</button>
      </div>
    </div>
  );
}
/** Music: find the tempo and beats, and land reveals on them. */
function BeatsSection(props: { scene: Scene; clip: AudioClip; onCommit: (scene: Scene) => void; decode?: (src: string) => Promise<AudioBuffer | null> }) {
  const { scene, clip } = props;
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const beats = sceneBeats(clip);
  const strong = strongMoments(beats);
  const find = async () => {
    if (!props.decode) return;
    setBusy(true);
    setNote(null);
    try {
      const buf = await props.decode(clip.src);
      if (!buf) throw new Error('the file could not be read');
      const r = analyseMusic(buf);
      props.onCommit(setAudio(scene, clip.id, { beats: r.beats, envelope: r.envelope }));
      setNote(`${r.beats.bpm} beats a minute.`);
    } catch (e) {
      setNote(`Could not find the beats: ${(e as Error).message}.`);
    } finally {
      setBusy(false);
    }
  };
  const snap = () => {
    const r = snapToBeats(scene, clip);
    if (r.moved) props.onCommit(r.scene);
    setNote(r.moved ? `Moved ${r.moved} ${r.moved === 1 ? 'entrance' : 'entrances'} onto the beat (undo to put ${r.moved === 1 ? 'it' : 'them'} back).` : 'Nothing was close enough to a beat to snap (within 0.15 s for big reveals, 0.10 s for the rest).');
  };
  return (
    <Section title="Beats">
      {clip.beats
        ? <p className="field-hint wide">{clip.beats.bpm} beats a minute · {beats.length} beats · {strong.length} strong {strong.length === 1 ? 'moment' : 'moments'} (the taller marks on the timeline).</p>
        : <p className="field-hint wide">Find the music&apos;s tempo, beats and strongest moments, right here in the browser. They show on the timeline, AI assist times its reveals to them, and React to music can follow the music.</p>}
      <div className="insp-start">
        <button type="button" className="btn small" disabled={busy || !props.decode} onClick={find}>{busy ? 'Listening…' : clip.beats ? 'Find again' : 'Find the beats'}</button>
        {clip.beats && <button type="button" className="btn small" onClick={snap} title="Big reveals move up to 0.15 s onto a strong moment, smaller entrances up to 0.10 s onto a beat; at most 8 per scene">Snap reveals to the beat</button>}
      </div>
      {note && <p className="field-hint wide" role="status">{note}</p>}
    </Section>
  );
}

/** Splits the clip into its voice and its music (the AI Dev Kit, on this computer). */
function SeparateSection(props: { scene: Scene; clip: AudioClip; onCommit: (s: Scene) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const go = async () => {
    setNote(null);
    setBusy('Separating the voice from the music');
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      const r = await separateClip(props.scene, props.clip.id, (s) => setBusy(s), ctl.signal);
      props.onCommit(r.scene);
    } catch (e) {
      setNote((e as Error).name === 'AbortError' ? 'Stopped.' : (e as Error).message);
    } finally { setBusy(null); abort.current = null; }
  };
  return (
    <Section title="Voice and music">
      <div className="insp-start wide">
        <button type="button" className="btn small" disabled={!!busy} onClick={go} title="Replaces this clip with two in its place: the voice, and the music and effects">Separate voice and music</button>
        {busy && <button type="button" className="btn small ghost" onClick={() => abort.current?.abort()}>Stop</button>}
      </div>
      <p className="field-hint wide" role="status">
        {busy ? `${busy}…` : note ?? 'Splits this clip into a voice track and a music track: transcribe the voice alone, remove or replace the music, or keep both (music is lowered under the voice). Runs in the AI Dev Kit on your computer and takes about as long as the clip.'}
      </p>
    </Section>
  );
}
