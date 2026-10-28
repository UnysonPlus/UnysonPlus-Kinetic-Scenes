import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { kitBase } from '../lib/ai';
import { putFootage } from '../lib/footage';

const asDataUrl = (b: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });

export interface HighlightPart { from: number; to: number; score: number; why: string; title: string }

/**
 * Tools › Make a reel from a video: the AI Dev Kit watches a long video, finds the moments worth keeping and returns a
 * scene that plays them back to back; it replaces the current scene (Undo brings it back).
 */
export function HighlightsDialog(props: { open: boolean; onClose: () => void; onScene: (scene: Scene, note: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [length, setLength] = useState(30);
  const [format, setFormat] = useState('9x16');
  const [titles, setTitles] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const make = async () => {
    if (!file) return;
    setError('');
    try {
      const b = await kitBase();
      if (!b) throw new Error('This needs the AI Dev Kit running on this computer.');
      setBusy('Sending the video to the AI Dev Kit');
      const [src, data] = await Promise.all([putFootage(file), asDataUrl(file)]);
      setBusy('Watching the video (and listening to it, when speech recognition is installed)');
      const r = await fetch(`${b}/studio/highlights`, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ src: data, length, format, titles, title: file.name.replace(/\.[^.]+$/, '') }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      const scene = JSON.parse(JSON.stringify(j.scene).split('{{footage}}').join(src)) as Scene;
      const parts = j.parts as HighlightPart[];
      props.onScene(scene, `A ${scene.duration} s reel from ${Math.round(j.seconds)} s of video: ${parts.length} parts (${parts.map((p) => `${p.from}-${p.to} s`).join(', ')}).${j.spoken ? '' : ' Speech was not used: install speech recognition (select an audio clip, Words) for titles and to keep what is talked about.'} Undo brings back your scene.`);
      setFile(null);
    } catch (e) { setError((e as Error).message); }
    setBusy('');
  };

  return (
    <dialog ref={ref} className="export addons" aria-labelledby="hl-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="hl-title">Make a reel from a video</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          Give a long video (a talk, a product demo, a day's filming). The AI Dev Kit watches it and keeps the moments worth
          keeping: sharp, steady and well lit, and what is talked about when it can hear the words. It cuts them together to
          the length you ask, each part an ordinary footage clip you can swap, trim or move. This replaces the current scene;
          Undo brings it back.
        </p>
        {error && <p className="export-warn" role="alert">{error}</p>}
        <div className="export-row">
          <button type="button" className="btn small" disabled={!!busy} onClick={() => fileRef.current?.click()}>{file ? 'Choose another video…' : 'Choose a video…'}</button>
          {file && <span className="addon-detail">{file.name} ({(file.size / 1048576).toFixed(0)} MB)</span>}
        </div>
        <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => { setFile(e.target.files?.[0] ?? null); e.target.value = ''; }} />
        <div className="export-row">
          <label className="addon-detail">Length{' '}
            <select value={length} onChange={(e) => setLength(Number(e.target.value))} disabled={!!busy}>
              {[15, 30, 45, 60, 90].map((s) => <option key={s} value={s}>{s} s</option>)}
            </select>
          </label>
          <label className="addon-detail">Shape{' '}
            <select value={format} onChange={(e) => setFormat(e.target.value)} disabled={!!busy}>
              <option value="9x16">Vertical 9:16</option><option value="1x1">Square 1:1</option><option value="4x5">Portrait 4:5</option><option value="16x9">Landscape 16:9</option>
            </select>
          </label>
          <label className="addon-detail"><input type="checkbox" checked={titles} onChange={(e) => setTitles(e.target.checked)} disabled={!!busy} /> A title on each part (from what is said)</label>
        </div>
        <div className="export-row">
          <button type="button" className="btn small primary" disabled={!file || !!busy} onClick={make}>{busy ? 'Working…' : 'Make the reel'}</button>
        </div>
        <p className="addon-detail" role="status">{busy ? `${busy}…` : 'Then add music (Sounds) and use Reframe to follow the face on wide footage in a tall reel.'}</p>
      </div>
    </dialog>
  );
}
