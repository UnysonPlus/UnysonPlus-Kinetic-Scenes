import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase } from '../lib/ai';
import { kitify } from './KitLink';

/** The languages the AI Dev Kit has a free voice for (a Voicebox voice speaks some of them too). */
export const TRANSLATE_LANGUAGES: Array<{ code: string; name: string; voicebox: boolean }> = [
  { code: 'es', name: 'Spanish', voicebox: true }, { code: 'fr', name: 'French', voicebox: true }, { code: 'de', name: 'German', voicebox: true },
  { code: 'it', name: 'Italian', voicebox: true }, { code: 'pt', name: 'Portuguese', voicebox: true }, { code: 'zh', name: 'Chinese (Mandarin)', voicebox: true },
  { code: 'ru', name: 'Russian', voicebox: true }, { code: 'nl', name: 'Dutch', voicebox: false }, { code: 'pl', name: 'Polish', voicebox: false },
  { code: 'sv', name: 'Swedish', voicebox: false }, { code: 'tr', name: 'Turkish', voicebox: false }, { code: 'uk', name: 'Ukrainian', voicebox: false },
  { code: 'vi', name: 'Vietnamese', voicebox: false }, { code: 'id', name: 'Indonesian', voicebox: false }, { code: 'hi', name: 'Hindi', voicebox: false },
  { code: 'ar', name: 'Arabic', voicebox: false },
];

interface Result { id: string; link: string; language: string; texts: number; voices: number; pins: number; warnings: string[] }

/**
 * Tools › Translate this video…: the AI Dev Kit makes a copy of the open project in another language. Every word on
 * screen is translated, every voice-over spoken again in a voice for that language, captions follow the new words, and
 * whatever is pinned to a word moves to its translation. The project stays as it is; the copy opens when it is ready.
 */
export function TranslateDialog(props: { open: boolean; onClose: () => void; project: string | null; scene: Scene; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [lang, setLang] = useState('es');
  const [keepVoice, setKeepVoice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); setResult(null); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const voices = (props.scene.audio ?? []).filter((a) => a.role === 'voice' && (a.script || a.words?.length));
  const voicebox = voices.map((a) => a.voiceId).find((v) => v?.startsWith('voicebox:'));
  const info = TRANSLATE_LANGUAGES.find((l) => l.code === lang)!;
  const canKeep = !!voicebox && info.voicebox;

  const go = async () => {
    if (!props.project) return;
    setBusy(true); setError(''); setResult(null); setStep('Starting');
    try {
      const b = await kitBase();
      if (!b) throw new Error('Translating needs the AI Dev Kit running on this computer.');
      const r = await fetch(`${b}/studio/translate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ project: props.project, to: lang, ...(canKeep && keepVoice ? { voice: voicebox } : {}) }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      for (;;) {
        await new Promise((ok) => setTimeout(ok, 1200));
        const p = await (await fetch(`${b}/studio/translate/${j.id}`)).json();
        if (p.state === 'error') throw new Error(p.error || 'The translation could not be made.');
        if (p.state === 'done') { setResult(p.result); break; }
        setStep(p.step || '');
      }
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  return (
    <dialog ref={ref} className="export addons translate-dialog" aria-labelledby="translate-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current && !busy) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="translate-title">Translate this video</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          A copy of this project in another language: every word on screen translated, every voice-over spoken again in a
          voice for that language, captions on the new words, and whatever is pinned to a word moved to its translation.
          This project stays as it is. Needs the AI Dev Kit and its AI.
        </p>
        {!props.project && <p className="export-note">Open the scene as a project first (File › Projects): the copy is made from its folder.</p>}
        {error && <p className="export-warn" role="alert">{kitify(error)}</p>}
        {props.project && !result && (
          <>
            <label className="field">
              <span>Into</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)} disabled={busy}>
                {TRANSLATE_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </label>
            <p className="export-note">
              {voices.length ? `${voices.length} voice-over${voices.length === 1 ? '' : 's'} will be spoken again in ${info.name}. ` : 'This scene has no voice-over: only its words are translated. '}
              The first time, the kit downloads a free {info.name} voice (about 60-110 MB).
            </p>
            {canKeep && (
              <label className="check">
                <input type="checkbox" checked={keepVoice} onChange={(e) => setKeepVoice(e.target.checked)} disabled={busy} />
                Keep the Voicebox voice (it speaks {info.name}) instead of the free voice
              </label>
            )}
            <div className="export-row">
              <button type="button" className="btn small primary" disabled={busy} onClick={go}>{busy ? 'Translating…' : `Make the ${info.name} copy`}</button>
              {busy && <span className="export-meta" aria-live="polite">{step}</span>}
            </div>
          </>
        )}
        {result && (
          <div className="translate-result">
            <p className="webx-total">
              Made <strong>{result.id}</strong>: {result.texts} texts, {result.voices} voice-over{result.voices === 1 ? '' : 's'} and {result.pins} word pin{result.pins === 1 ? '' : 's'} in {info.name}.
            </p>
            {result.warnings.length > 0 && (
              <>
                <p className="export-note">Look at these before you use it:</p>
                <ul className="translate-warnings">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </>
            )}
            <div className="export-row">
              <button type="button" className="btn small primary" onClick={() => { props.onOpen(result.id); props.onClose(); }}>Open the copy</button>
              <button type="button" className="btn small" onClick={() => setResult(null)}>Another language</button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
