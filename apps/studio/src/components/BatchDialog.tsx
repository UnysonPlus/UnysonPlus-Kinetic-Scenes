import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { VIDEO_FORMATS } from '@unysonplus/scene-player/video';
import { fillScene, missingColumns, parseCsv, placeholders, rowLabel, slug } from '../lib/batch';
import type { Sheet } from '../lib/batch';
import { canRender, renderVideo } from '../lib/video';

function save(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
}

const readAsDataUrl = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(f); });

/**
 * Tools › Videos from a spreadsheet: the scene's {{placeholders}} filled from each row of a CSV, previewed row by row on
 * the stage (the scene itself is not changed) and rendered as one video per row.
 */
export function BatchDialog(props: {
  open: boolean; onClose: () => void; scene: Scene;
  sheet: Sheet | null; files: Map<string, string>;
  onSheet: (sheet: Sheet | null, files: Map<string, string>) => void;
  onPreview: (row: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const used = placeholders(props.scene);
  const sheet = props.sheet;
  const missing = sheet ? missingColumns(props.scene, sheet.columns) : [];
  const format = props.scene.video?.formats?.[0];
  const size = format && VIDEO_FORMATS[format] ? VIDEO_FORMATS[format] : { width: 1080, height: 1920, label: 'Vertical 9:16' };

  const renderAll = async () => {
    if (!sheet) return;
    setError('');
    const check = await canRender();
    if (!check.ok) { setError(check.reason === 'ffmpeg' ? 'The AI Dev Kit needs ffmpeg to render video.' : 'Rendering needs the AI Dev Kit running on this computer (or a newer one).'); return; }
    const ctl = new AbortController();
    abort.current = ctl;
    const fps = props.scene.video?.fps ?? 30;
    const failed: string[] = [];
    try {
      for (let i = 0; i < sheet.rows.length; i++) {
        const label = rowLabel(sheet, i);
        setProgress(`Video ${i + 1} of ${sheet.rows.length}: ${label}`);
        try {
          const r = await renderVideo(fillScene(props.scene, sheet.rows[i], props.files), { width: size.width, height: size.height, fps, format: 'mp4' }, (d, t) => setProgress(`Video ${i + 1} of ${sheet.rows.length}: ${label} (${t ? Math.round((d / t) * 100) : 0}%)`), ctl.signal);
          save(r.blob, `${String(i + 1).padStart(2, '0')}-${slug(label) || 'video'}.mp4`);
        } catch (e) {
          if ((e as Error).name === 'AbortError') throw e;
          failed.push(`${label}: ${(e as Error).message}`);
        }
      }
      setProgress(null);
      setError(failed.length ? `Not rendered: ${failed.join('; ')}` : '');
      if (!failed.length) setProgress(`Saved ${sheet.rows.length} video(s) to your downloads.`);
    } catch {
      setProgress('Stopped.');
    } finally { abort.current = null; }
  };

  return (
    <dialog ref={ref} className="export addons batch-dialog" aria-labelledby="batch-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="batch-title">Videos from a spreadsheet</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          One design, a video per row: a reel for every product in a shop. Write placeholders in the scene's words and
          picture addresses, like <code>{'{{product}}'}</code> or <code>{'{{price}}'}</code>; a spreadsheet saved as CSV
          gives a column for each, one row per video.
        </p>
        {error && <p className="export-warn" role="alert">{error}</p>}
        <p className="addon-detail">
          {used.length ? <>This scene's placeholders: {used.map((p) => <code key={p}>{`{{${p}}}`}</code>).reduce<React.ReactNode[]>((a, c, i) => (i ? [...a, ', ', c] : [c]), [])}.</>
            : 'This scene has no placeholders yet: type one into a text layer, e.g. {{product}}.'}
        </p>
        <div className="export-row">
          <button type="button" className="btn small" onClick={() => csvRef.current?.click()}>{sheet ? 'Choose another spreadsheet…' : 'Choose a spreadsheet (CSV)…'}</button>
          <button type="button" className="btn small ghost" disabled={!sheet} onClick={() => picRef.current?.click()} title="When a column names picture files (mug.png), pick those files here">
            {props.files.size ? `${props.files.size} picture(s) added` : 'Add the pictures it names…'}
          </button>
          {sheet && <button type="button" className="btn small ghost" onClick={() => props.onSheet(null, new Map())}>Clear</button>}
        </div>
        <input ref={csvRef} type="file" accept=".csv,text/csv" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          const s = parseCsv(await f.text());
          if (!s.rows.length) { setError('That spreadsheet has no rows under its header.'); return; }
          setError('');
          props.onSheet(s, props.files);
        }} />
        <input ref={picRef} type="file" accept="image/*" multiple hidden onChange={async (e) => {
          const list = [...(e.target.files ?? [])];
          e.target.value = '';
          const m = new Map(props.files);
          for (const f of list) m.set(f.name.toLowerCase(), await readAsDataUrl(f));
          props.onSheet(sheet, m);
        }} />
        {sheet && (
          <>
            <p className="addon-detail">
              {sheet.rows.length} row(s); columns {sheet.columns.join(', ')}.{' '}
              {missing.length ? <strong>No column for {missing.map((m) => `{{${m}}}`).join(', ')}: those stay as they are.</strong> : 'Every placeholder has a column.'}
            </p>
            <div className="batch-table-wrap">
              <table className="batch-table">
                <thead><tr><th>#</th>{sheet.columns.map((c) => <th key={c}>{c}</th>)}<th /></tr></thead>
                <tbody>
                  {sheet.rows.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {sheet.columns.map((c) => <td key={c} title={r[c]}>{r[c]}</td>)}
                      <td><button type="button" className="btn small ghost" onClick={() => props.onPreview(i)}>Preview</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="export-row">
              <button type="button" className="btn small primary" disabled={!!abort.current || !used.length} onClick={renderAll}>
                Render {sheet.rows.length} video(s), {size.label}
              </button>
              {abort.current && <button type="button" className="btn small ghost" onClick={() => abort.current?.abort()}>Stop</button>}
            </div>
            <p className="addon-detail" role="status">{progress ?? 'The AI Dev Kit renders them one after another, into your downloads. It takes a few minutes per video.'}</p>
          </>
        )}
      </div>
    </dialog>
  );
}
