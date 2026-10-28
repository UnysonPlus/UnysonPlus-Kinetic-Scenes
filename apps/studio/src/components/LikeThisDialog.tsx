import { useEffect, useRef, useState } from 'react';
import { kitBase } from '../lib/ai';

const asDataUrl = (b: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });

/**
 * AI › Make one like this: a video the person likes is worked out by the AI Dev Kit (structure, pacing, text style,
 * cuts, use of music); AI assist then makes the person's own scene to the same shape.
 */
export function LikeThisDialog(props: { open: boolean; onClose: () => void; onBrief: (r: { about: string; brief: string; context: string; summary: string }) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [about, setAbout] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const go = async () => {
    if (!file || !about.trim()) return;
    setError('');
    try {
      const b = await kitBase();
      if (!b) throw new Error('This needs the AI Dev Kit running on this computer.');
      setBusy('Working out how it is made (about half a minute)');
      const r = await fetch(`${b}/studio/like-this`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ src: await asDataUrl(file), seconds: seconds || undefined }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      props.onBrief({ about: about.trim(), brief: j.brief, context: j.context, summary: j.summary });
      setFile(null); setAbout('');
    } catch (e) { setError((e as Error).message); }
    setBusy('');
  };

  return (
    <dialog ref={ref} className="export addons" aria-labelledby="like-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="like-title">Make one like this</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          Give a video you like. The AI works out how it is made (its structure, pacing, text style, cuts and use of music)
          and makes your scene the same way, with your own words and pictures. Nothing from the video itself is copied.
        </p>
        {error && <p className="export-warn" role="alert">{error}</p>}
        <div className="export-row">
          <button type="button" className="btn small" disabled={!!busy} onClick={() => fileRef.current?.click()}>{file ? 'Choose another video…' : 'Choose the video you like…'}</button>
          {file && <span className="addon-detail">{file.name}</span>}
        </div>
        <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => { setFile(e.target.files?.[0] ?? null); e.target.value = ''; }} />
        <label className="addon-detail" htmlFor="like-about">What yours is about</label>
        <textarea id="like-about" className="notes-text" rows={4} value={about} disabled={!!busy} placeholder="A 20-second reel for our new booking feature: book in two taps, reminders, no fees. End on Book now."
          onChange={(e) => setAbout(e.target.value)} />
        <div className="export-row">
          <label className="addon-detail">Length{' '}
            <select value={seconds} disabled={!!busy} onChange={(e) => setSeconds(Number(e.target.value))}>
              <option value={0}>The same as the video</option>
              {[15, 20, 30, 45, 60].map((s) => <option key={s} value={s}>{s} s</option>)}
            </select>
          </label>
          <button type="button" className="btn small primary" disabled={!file || !about.trim() || !!busy} onClick={go}>{busy ? 'Working…' : 'Make mine'}</button>
        </div>
        <p className="addon-detail" role="status">{busy ? `${busy}…` : 'Then AI assist builds it (with three directions and the plan first, if they are on).'}</p>
      </div>
    </dialog>
  );
}
