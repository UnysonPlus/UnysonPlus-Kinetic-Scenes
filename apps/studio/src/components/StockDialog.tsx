import { useEffect, useRef, useState } from 'react';
import { SOURCE_INFO, setStockKey, setStockSources, stockGet, stockSearch, stockStatus } from '../lib/stock';
import type { SourceState, StockResult, StockSource } from '../lib/stock';

/**
 * Insert › Free stock…: the stock sources (switch one off and neither you nor your AI agent searches it; the keys
 * the sources that need one), and a search whose picks go into the project's media/ with their licence noted.
 */
export function StockDialog(props: {
  open: boolean; onClose: () => void; project: string | null;
  onAdd: (r: StockResult, path: string) => Promise<void> | void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [sources, setSources] = useState<Record<StockSource, SourceState> | null>(null);
  const [error, setError] = useState('');
  const [keyFor, setKeyFor] = useState<StockSource | null>(null);
  const [keyValue, setKeyValue] = useState('');
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<StockResult['kind']>('video');
  const [orient, setOrient] = useState('');
  const [results, setResults] = useState<StockResult[] | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [busy, setBusy] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setError(''); stockStatus().then((r) => setSources(r.sources)).catch((e) => setError(e.message)); }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const toggle = async (s: StockSource, on: boolean) => {
    if (!sources) return;
    const off = (Object.keys(sources) as StockSource[]).filter((k) => (k === s ? !on : !sources[k].on));
    try { setSources((await setStockSources(off)).sources); } catch (e) { setError((e as Error).message); }
  };
  const saveKey = async (s: StockSource, key: string) => {
    try { setSources((await setStockKey(s, key)).sources); setKeyFor(null); setKeyValue(''); } catch (e) { setError((e as Error).message); }
  };
  const search = async () => {
    if (!q.trim()) return;
    setBusy('search'); setError(''); setResults(null);
    try { const r = await stockSearch(q.trim(), kind, orient); setResults(r.results); setNotes(r.notes); } catch (e) { setError((e as Error).message); }
    setBusy('');
  };
  const add = async (r: StockResult) => {
    if (!props.project) return;
    setBusy(`${r.source}:${r.id}`); setError('');
    try { const g = await stockGet(props.project, r); await props.onAdd(r, g.path); } catch (e) { setError((e as Error).message); }
    setBusy('');
  };

  const list = sources ? (Object.keys(SOURCE_INFO) as StockSource[]) : [];
  return (
    <dialog ref={ref} className="export addons stock-dialog" aria-labelledby="stock-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="stock-title">Free stock</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          Footage, photos and sounds whose licences allow commercial use. Switch a source off and neither you nor your AI
          agent searches it. What you add goes into the project's media folder, with its source, licence and any credit it
          needs written into the project notes.
        </p>
        {error && <p className="export-warn" role="alert">{error}</p>}

        <h3 className="stock-h">Sources</h3>
        <ul className="addons-list">
          {list.map((s) => {
            const st = sources![s], info = SOURCE_INFO[s];
            return (
              <li key={s} className="addon stock-source">
                <div className="addon-head">
                  <label className="stock-check">
                    <input type="checkbox" checked={st.on} onChange={(e) => toggle(s, e.target.checked)} />
                    <strong>{info.name}</strong> <span className="stock-gives">{info.gives}</span>
                  </label>
                  {st.needsKey && <span className={`addon-state ${st.hasKey ? 'is-ready' : 'is-missing'}`}>{st.hasKey ? 'Key saved' : 'Needs a key'}</span>}
                </div>
                <p className="addon-detail">{info.licence}</p>
                {st.needsKey && (keyFor === s ? (
                  <div className="export-row">
                    <input className="addon-input" type="password" aria-label={`${info.name} API key`} value={keyValue} autoFocus placeholder="Paste the key"
                      onChange={(e) => setKeyValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && keyValue.trim()) saveKey(s, keyValue); }} />
                    <button type="button" className="btn small primary" disabled={!keyValue.trim()} onClick={() => saveKey(s, keyValue)}>Save</button>
                    {st.hasKey && <button type="button" className="btn small ghost" onClick={() => saveKey(s, '')}>Remove</button>}
                    <button type="button" className="btn small ghost" onClick={() => setKeyFor(null)}>Cancel</button>
                  </div>
                ) : (
                  <p className="addon-detail">
                    <button type="button" className="btn small ghost" onClick={() => { setKeyFor(s); setKeyValue(''); }}>{st.hasKey ? 'Change key' : 'Add key'}</button>{' '}
                    {info.keyUrl && <a href={info.keyUrl} target="_blank" rel="noopener noreferrer">Get a free key</a>}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>

        <h3 className="stock-h">Search</h3>
        {!props.project && <p className="addon-detail">To add what you find, open a project first (File › Projects): what you add is kept in its media folder.</p>}
        {(
          <>
            <div className="export-row">
              <input className="addon-input" aria-label="Search stock" placeholder="ocean waves, city at night…" value={q}
                onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search(); }} />
              <select aria-label="Kind" value={kind} onChange={(e) => setKind(e.target.value as StockResult['kind'])}>
                <option value="video">Video</option><option value="photo">Photos</option><option value="audio">Sounds</option>
              </select>
              <select aria-label="Shape" value={orient} onChange={(e) => setOrient(e.target.value)}>
                <option value="">Any shape</option><option value="portrait">Tall</option><option value="landscape">Wide</option>
              </select>
              <button type="button" className="btn small primary" disabled={!q.trim() || busy === 'search'} onClick={search}>{busy === 'search' ? 'Searching…' : 'Search'}</button>
            </div>
            {notes.map((n) => <p key={n} className="addon-detail">{n}</p>)}
            {results && !results.length && <p className="addon-detail">Nothing found.</p>}
            {results && results.length > 0 && (
              <ul className="stock-grid">
                {results.map((r) => (
                  <li key={`${r.source}:${r.id}`} className="stock-item">
                    {r.thumb ? <img src={r.thumb} alt="" loading="lazy" /> : <div className="stock-noimg">{r.kind}</div>}
                    <div className="stock-meta">
                      <span className="stock-title" title={r.title}>{r.title}</span>
                      <span className="addon-detail">
                        {/* Pexels and Pixabay ask that results link back to them and name who made them. */}
                        <a href={r.page} target="_blank" rel="noopener noreferrer">{SOURCE_INFO[r.source].name}</a>{r.by ? ` · ${r.by}` : ''}
                        {r.seconds ? ` · ${Math.round(r.seconds)} s` : ''}{r.credit ? ' · credit needed' : ''}
                      </span>
                      <button type="button" className="btn small ghost" disabled={!!busy || !props.project} title={props.project ? undefined : 'Open a project first'} onClick={() => add(r)}>
                        {busy === `${r.source}:${r.id}` ? 'Downloading…' : 'Add'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
