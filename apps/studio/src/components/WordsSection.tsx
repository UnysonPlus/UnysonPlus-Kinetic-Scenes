import { useCallback, useEffect, useRef, useState } from 'react';
import { applyWordCuts, planWordCuts, suggestRemovals } from '../lib/wordEdit';
import type { AudioClip, Scene } from '@unysonplus/scene-player/types';
import { Section } from './fields';
import { setAudio } from '../lib/audio';
import { clipWords, installSpeech, isStrong, transcribe, transcribeStatus, type ModelKey, type TranscribeStatus } from '../lib/transcribe';

const GUIDE = 'https://docs.unysonplus.com/guides/set-up-ai-for-unysonplus';
const KIT_REPO = 'https://github.com/UnysonPlus/UnysonPlus-AI-Dev-Kit';
const PACE: Record<string, string> = { slow: 'unhurried', steady: 'steady', brisk: 'brisk', fast: 'fast', silent: 'no speech' };

/**
 * Words: the voice-over's transcript, made by the AI Dev Kit on this computer. Each word keeps its time,
 * so it shows on the timeline and a click jumps there; strongly said words are marked, and the delivery
 * (pace, energy) is summarised. Making a scene from the voice-over builds on all of it.
 */
export function WordsSection(props: {
  scene: Scene;
  clip: AudioClip;
  onCommit: (scene: Scene) => void;
  onSeek: (t: number) => void;
  /** Hands the voice-over to AI assist to build a scene on it. */
  onMakeScene?: () => void;
}) {
  const { clip } = props;
  const [status, setStatus] = useState<TranscribeStatus | null>(null);
  const [kitError, setKitError] = useState<string | null>(null);
  const [model, setModel] = useState<ModelKey>('base');
  const [busy, setBusy] = useState<string | null>(null);
  /** Edit by the words: struck words (indexes into clip.words) and whether long pauses go too. */
  const [editing, setEditing] = useState(false);
  const [struck, setStruck] = useState<Set<number>>(new Set());
  const [pauses, setPauses] = useState(true);
  const [editNote, setEditNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const picked = useRef(false);
  const latest = useRef(props);
  latest.current = props;

  const refresh = useCallback(async () => {
    try {
      const st = await transcribeStatus();
      setStatus(st);
      setKitError(null);
      // First look only: start on an installed model (later refreshes never override the user's choice).
      if (!picked.current) {
        picked.current = true;
        setModel(st.models.small.installed && !st.models.base.installed ? 'small' : 'base');
      }
      return st;
    } catch (e) {
      setKitError((e as Error).message);
      setStatus(null);
      return null;
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => () => abort.current?.abort(), []);

  // While an install runs, follow its progress.
  const installing = status?.install?.state === 'running';
  useEffect(() => {
    if (!installing) return;
    const t = setInterval(refresh, 1000);
    return () => clearInterval(t);
  }, [installing, refresh]);

  const install = async () => {
    setError(null);
    try { await installSpeech(model); await refresh(); } catch (e) { setError((e as Error).message); }
  };

  const run = async () => {
    setError(null);
    const ctl = new AbortController();
    abort.current = ctl;
    setBusy('Sending the audio');
    try {
      const r = await transcribe(clip.src, model, (step) => setBusy(step), ctl.signal);
      const { scene, clip: c } = latest.current;
      const { emphasis: _e, ...speech } = r.speech;
      props.onCommit(setAudio(scene, c.id, { words: r.words, speech: { ...speech, language: r.language }, role: c.role ?? 'voice' }));
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setBusy(null);
      abort.current = null;
    }
  };

  const words = clipWords(clip);
  const has = (clip.words?.length ?? 0) > 0;
  const ready = !!status && status.program && status.models[model]?.installed;
  const anyModel = !!status && (status.models.base.installed || status.models.small.installed);
  const mb = (n: number) => `${n} MB`;
  const pct = status?.install && status.install.total ? Math.round((status.install.done / status.install.total) * 100) : null;

  return (
    <Section title="Words">
      {has && (
        <div className="words wide">
          <p className="words-meta">
            {words.length} word{words.length === 1 ? '' : 's'}
            {clip.speech?.language ? ` · ${clip.speech.language}` : ''}
            {clip.speech?.wpm ? ` · ${clip.speech.wpm} words a minute (${PACE[clip.speech.pace ?? ''] ?? clip.speech.pace})` : ''}
            {clip.speech?.delivery?.length ? ` · ${clip.speech.delivery.join(', ')}` : ''}
          </p>
          <p className="words-text">
            {words.map((w) => (
              <span key={w.index}>
                {w.p && w.p >= 0.6 && w.index > 0 ? <span className="words-pause" aria-hidden="true"> ‖ </span> : ' '}
                <button type="button" className={`word${isStrong(w) ? ' strong' : ''}${editing && struck.has(w.index) ? ' struck' : ''}`}
                  onClick={() => {
                    if (!editing) { props.onSeek(Math.max(0, w.at)); return; }
                    setStruck((s) => { const n = new Set(s); if (n.has(w.index)) n.delete(w.index); else n.add(w.index); return n; });
                  }}
                  title={editing ? (struck.has(w.index) ? 'Struck out: click to keep it' : 'Click to cut this word') : `${w.at.toFixed(2)} s${w.s !== undefined ? ` · emphasis ${Math.round(w.s * 100)}%` : ''}`}>{w.w}</button>
              </span>
            ))}
          </p>
          <p className="field-hint">{editing ? 'Click words to strike them out; struck words are cut from the voice and from the footage it came from.' : 'Bold words are said with the most emphasis. Click a word to jump to it; ‖ marks a pause.'}</p>
          <div className="insp-actions wide">
            <button type="button" className={`btn small${editing ? ' primary' : ''}`} aria-pressed={editing} onClick={() => { setEditing(!editing); setEditNote(null); }}
              title="Cut words, ums, repeats and long pauses out of the voice-over and its footage">Edit by the words</button>
          </div>
          {editing && (() => {
            const all = clip.words ?? [];
            const cuts = planWordCuts(all, struck, pauses ? { max: 0.6, keep: 0.25 } : null);
            const secs = cuts.reduce((s, c) => s + c.to - c.from, 0);
            return (
              <div className="words-edit wide">
                <div className="insp-actions">
                  <button type="button" className="btn small ghost" onClick={() => setStruck(suggestRemovals(all))} title="Strikes um, uh and the first of a phrase said twice in a row (a false start)">Mark ums and repeats</button>
                  {struck.size > 0 && <button type="button" className="btn small ghost" onClick={() => setStruck(new Set())}>Keep all</button>}
                </div>
                <label className="assist-check"><input type="checkbox" checked={pauses} onChange={(e) => setPauses(e.target.checked)} /> Shorten pauses over 0.6 s (to 0.25 s)</label>
                <div className="insp-actions">
                  <button type="button" className="btn small primary" disabled={!cuts.length}
                    onClick={() => {
                      const r = applyWordCuts(props.scene, clip.id, cuts);
                      props.onCommit(r.scene);
                      setStruck(new Set());
                      setEditNote(`Cut ${r.removed.toFixed(1)} s: the voice-over${r.parts > 1 ? ` and its footage now play in ${r.parts} parts` : ''}, and what came after moved earlier. Undo puts it back.`);
                    }}>
                    {cuts.length ? `Cut ${struck.size ? `${struck.size} word${struck.size === 1 ? '' : 's'}` : 'pauses'}${struck.size && pauses ? ' and pauses' : ''}: −${secs.toFixed(1)} s` : 'Nothing to cut yet'}
                  </button>
                </div>
                {editNote && <p className="field-hint" role="status">{editNote}</p>}
              </div>
            );
          })()}
          {props.onMakeScene && (
            <button type="button" className="btn small primary words-make" onClick={props.onMakeScene}
              title="AI assist builds kinetic type timed to these words, with motion and sounds that match the delivery (in the style chosen in AI assist). Undo brings back the current scene.">
              <span aria-hidden="true">✦</span> Make a scene from this voice-over
            </button>
          )}
        </div>
      )}

      {kitError && (
        <p className="field-hint wide">
          Transcription runs in the <a href={KIT_REPO} target="_blank" rel="noopener noreferrer"><strong>AI Dev Kit</strong></a> on your computer (free; nothing is uploaded). {kitError}{' '}
          <a href={GUIDE} target="_blank" rel="noopener noreferrer">Set it up</a>, then <button type="button" className="link-btn" onClick={refresh}>check again</button>.
        </p>
      )}

      {status && !status.program && !status.canInstallProgram && (
        <p className="field-hint wide">Speech recognition isn't available for this computer yet. {status.installHint}</p>
      )}

      {status && (status.program || status.canInstallProgram) && (
        <div className="words-controls wide">
          <label className="words-model">
            <span>Speech model</span>
            <select value={model} disabled={!!busy || installing} onChange={(e) => setModel(e.target.value as ModelKey)}>
              {(['base', 'small'] as ModelKey[]).map((k) => (
                <option key={k} value={k}>{status.models[k].label} ({mb(status.models[k].mb)}){status.models[k].installed ? '' : ' · not installed'}</option>
              ))}
            </select>
          </label>
          {installing ? (
            <p className="words-progress" role="status">{status.install!.step}{pct !== null ? ` · ${pct}%` : '…'}</p>
          ) : ready ? (
            busy ? (
              <p className="words-progress" role="status">{busy}… <button type="button" className="link-btn" onClick={() => abort.current?.abort()}>Stop</button></p>
            ) : (
              <button type="button" className="btn small primary" onClick={run}>{has ? 'Transcribe again' : 'Transcribe'}</button>
            )
          ) : (
            <button type="button" className="btn small" onClick={install}>
              Install {status.program ? 'this model' : 'speech recognition'} ({mb(status.models[model].mb + (status.program ? 0 : 9))}, once)
            </button>
          )}
        </div>
      )}
      {status?.install?.state === 'error' && <p className="field-hint wide words-error" role="alert">{status.install.error}</p>}
      {error && <p className="field-hint wide words-error" role="alert">{error}</p>}
      {status && !has && !busy && (
        <p className="field-hint wide">
          {anyModel
            ? 'Turns the voice-over into words with their timing and how strongly each is said. Runs on your computer; about 10 seconds a minute of audio with the fast model.'
            : 'Turns the voice-over into words with their timing and how strongly each is said. The AI Dev Kit downloads speech recognition once; after that it works offline on your computer. Fast suits clear voice-overs; Accurate handles accents, noise and music better.'}
          {status && !status.ffmpeg ? ' It also needs ffmpeg (Windows: winget install Gyan.FFmpeg; macOS: brew install ffmpeg).' : ''}
        </p>
      )}
      {has && !busy && <div className="insp-actions wide"><button type="button" className="btn small ghost" onClick={() => props.onCommit(setAudio(props.scene, clip.id, { words: undefined, speech: undefined }))}>Remove words</button></div>}
    </Section>
  );
}
