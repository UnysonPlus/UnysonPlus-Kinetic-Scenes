import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { KIT_REPO } from './GetKit';
import { GEMINI_KEY_URL, listenStatus, listenTo, setListenKey, type ListenResult, type ListenStatus } from '../lib/listen';

const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/**
 * Tools › Second listener: Gemini hears the scene's sound, with no render, and gives timed notes; clicking a time moves the
 * playhead there. Nothing is sent until the person ticks the box, and the box is cleared for each review.
 */
export function ListenDialog(props: { open: boolean; scene: Scene; onClose: () => void; onSeek: (t: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const stop = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<ListenStatus | null>(null);
  const [changingKey, setChangingKey] = useState(false);
  const [key, setKey] = useState('');
  const [question, setQuestion] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState('');
  const [result, setResult] = useState<ListenResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) {
      d.showModal();
      setError('');
      setAgreed(false);
      listenStatus().then(setStatus).catch((e) => setError((e as Error).message));
    }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const close = () => { stop.current?.abort(); props.onClose(); };

  const saveKey = async (value: string) => {
    setError('');
    try { setStatus(await setListenKey(value)); setKey(''); setChangingKey(false); } catch (e) { setError((e as Error).message); }
  };

  const go = async () => {
    const c = new AbortController();
    stop.current = c;
    setError('');
    setResult(null);
    setStep('Starting');
    try {
      setResult(await listenTo(props.scene, question, setStep, c.signal));
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    }
    setStep('');
    setAgreed(false);
  };

  const hasSound = (props.scene.audio?.length ?? 0) > 0;
  const askKey = status && (!status.hasKey || changingKey);
  return (
    <dialog ref={ref} className="export addons listen-dialog" aria-labelledby="listen-title" onClose={close}
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="listen-title">Second listener</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={close}>×</button>
        </header>
        <p className="addons-intro">
          Gemini listens to this scene's sound, with no render, and tells you what a viewer might notice: a line that sounds read, a question that falls flat, a word that isn't clear, a slow start.
        </p>
        {askKey && (
          <div className="listen-key">
            <input className="addon-input" type="password" aria-label="Gemini API key" value={key} placeholder="Paste your Gemini key"
              onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && key.trim()) saveKey(key); }} />
            <button type="button" className="btn small primary" disabled={!key.trim()} onClick={() => saveKey(key)}>Save</button>
            {status.hasKey && <button type="button" className="btn small ghost" onClick={() => saveKey('')}>Remove</button>}
            <a href={GEMINI_KEY_URL} target="_blank" rel="noopener noreferrer">Get a free key</a>
          </div>
        )}
        {status?.hasKey && !changingKey && (
          <>
            <label className="listen-question">Anything to listen for? (optional)
              <input className="addon-input" value={question} maxLength={300} placeholder="Does the second line sound like a question?" onChange={(e) => setQuestion(e.target.value)} />
            </label>
            <label className="start-again listen-consent">
              <input type="checkbox" checked={agreed} disabled={!!step} onChange={(e) => setAgreed(e.target.checked)} />
              <span>{status.consent}</span>
            </label>
          </>
        )}
        {!hasSound && <p className="export-warn">This scene has no sound yet.</p>}
        {error && <p className="export-warn" role="alert">{error}</p>}
        {!status && error && <p><a href={KIT_REPO} target="_blank" rel="noopener noreferrer">Get the free AI Dev Kit</a></p>}
        <div className="export-row">
          {status?.hasKey && !changingKey && <button type="button" className="btn small primary" disabled={!agreed || !hasSound || !!step} onClick={go}>{step ? `${step}…` : 'Listen to it'}</button>}
          {step && <button type="button" className="btn small ghost" onClick={() => stop.current?.abort()}>Stop</button>}
          {status?.hasKey && !step && <button type="button" className="btn small ghost" onClick={() => setChangingKey(!changingKey)}>{changingKey ? 'Keep this key' : 'Change key'}</button>}
        </div>
        {result && (
          <section className="listen-result" aria-label="What Gemini heard">
            <p>{result.summary || 'No summary came back.'}</p>
            {result.unread && <p className="export-warn">The answer didn't come back as timed notes, so it is shown as it came.</p>}
            {result.notes.length > 0 ? (
              <ul className="listen-notes">
                {result.notes.map((n, i) => (
                  <li key={i} className={n.level}>
                    <button type="button" className="btn small ghost" title="Move the playhead here" onClick={() => props.onSeek(n.t)}>{clock(n.t)}</button>
                    <div>
                      <span className="listen-kind">{n.level === 'fix' ? 'Fix' : 'Consider'} · {n.kind}</span>
                      <p>{n.note}</p>
                      {n.fix && <p className="listen-fix">{n.fix}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : !result.unread && <p>No notes on this one.</p>}
            {result.dropped > 0 && <p className="listen-small">{result.dropped} {result.dropped === 1 ? 'note was' : 'notes were'} left out: timed past the end of the scene, or unreadable.</p>}
            {result.warnings.map((w) => <p key={w} className="export-warn">{w}</p>)}
            <p className="listen-small">An opinion from {result.model}, and it can mishear. Loudness and balance aren't judged here: the video check measures those.</p>
          </section>
        )}
      </div>
    </dialog>
  );
}
