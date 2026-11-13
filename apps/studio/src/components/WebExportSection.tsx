import { useState } from 'react';
import { kitBase } from '../lib/ai';

const mb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const BASE_KEY = 'upw-web-export-base';

interface Row { src: string; out: string | null; before: number; after: number; did: string }
interface Result { out: string; scene: string; code: string; before: number; after: number; files: Row[]; measured: boolean; base: string | null }

/**
 * Export › For a web page: the project's media cut to what a page that plays the scene live needs (the Kinetic Scene
 * element, an embed), written by the AI Dev Kit into the project's web/ folder: every picture and video sized to the
 * largest it is drawn, videos and sounds trimmed to what the timeline plays. Shows each file before and after.
 */
export function WebExportSection(props: { project: string | null; onDone: (message: string) => void }) {
  const [base, setBase] = useState(() => { try { return localStorage.getItem(BASE_KEY) || ''; } catch { return ''; } });
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const baseOk = !base || /^https?:\/\/\S+$/i.test(base.trim());

  const go = async () => {
    if (!props.project || !baseOk) return;
    setBusy(true); setError(''); setResult(null); setStep('Starting');
    try { localStorage.setItem(BASE_KEY, base.trim()); } catch { /* private window */ }
    try {
      const b = await kitBase();
      if (!b) throw new Error('This needs the AI Dev Kit running on this computer.');
      const r = await fetch(`${b}/studio/web-export`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ project: props.project, base: base.trim() || undefined }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      for (;;) {
        await new Promise((ok) => setTimeout(ok, 1000));
        const p = await (await fetch(`${b}/studio/web-export/${j.id}`)).json();
        if (p.state === 'error') throw new Error(p.error || 'The web version could not be made.');
        if (p.state === 'done') { setResult(p.result); props.onDone(`Web version written: media ${mb(p.result.before)} → ${mb(p.result.after)}.`); break; }
        setStep(p.step || '');
      }
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  const reveal = async () => {
    const b = await kitBase();
    if (b && props.project) fetch(`${b}/studio/web-export/reveal`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ project: props.project }) }).catch(() => {});
  };
  const copy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError('Copying was blocked by the browser. Open scene.json in the web folder instead.'); }
  };

  return (
    <section className="export-opt">
      <h3>For a web page</h3>
      <p>
        Play the scene live on a site (the Unyson+ <strong>Kinetic Scene</strong> element) instead of as a video file. The
        kit makes a light copy: every picture and video sized to the largest it is shown, pictures as WebP, videos and
        sounds trimmed to the seconds the timeline plays. It goes in the project's <code>web</code> folder.
      </p>
      {props.project ? (
        <>
          <label className="field">
            <span className="webx-label">Where the folder will be on your site (optional)</span>
            <input type="text" inputMode="url" spellCheck={false} placeholder="https://example.com/wp-content/uploads/unysonplus/scenes/promo/" value={base}
              onChange={(e) => setBase(e.target.value)} aria-invalid={!baseOk} />
          </label>
          <p className="export-note">With an address, the scene's files point there: upload the <code>media</code> folder to it and paste the scene into the element. Without one, they stay relative (<code>media/…</code>).</p>
          <div className="export-row">
            <button type="button" className="btn small" disabled={busy || !baseOk} onClick={go}>{busy ? 'Making it…' : 'Make the web version'}</button>
            {busy && <span className="export-meta">{step}</span>}
          </div>
        </>
      ) : <p className="export-note">Open a project first (File › Projects): the web version is made from its media files.</p>}
      {result && (
        <div className="webx">
          <p className="webx-total">
            Media <strong>{mb(result.before)}</strong> → <strong>{mb(result.after)}</strong> ({Math.round((1 - result.after / Math.max(1, result.before)) * 100)}% smaller, {result.files.length} files)
            {!result.measured && ' · sized from the layer boxes (the scene could not be measured)'}
          </p>
          <div className="webx-table" role="region" aria-label="Files before and after" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">File</th><th scope="col">Before</th><th scope="col">After</th><th scope="col">What changed</th></tr></thead>
              <tbody>
                {result.files.map((f) => (
                  <tr key={f.src}><td className="mono">{f.src.replace(/^media\//, '')}</td><td>{mb(f.before)}</td><td>{mb(f.after)}</td><td>{f.did}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="export-row">
            <button type="button" className="btn small" onClick={reveal}>Show the folder</button>
            <button type="button" className="btn small" onClick={copy}>{copied ? 'Copied' : 'Copy the scene for the element'}</button>
          </div>
        </div>
      )}
      {error && <p className="export-error" role="alert">{error}</p>}
    </section>
  );
}
