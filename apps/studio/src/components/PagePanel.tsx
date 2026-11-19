import { useEffect, useMemo, useRef, useState } from 'react';
import type { PageState } from '../lib/pageConnection';

/**
 * Page mode (Animation Creator, beta): the elements of the Unyson+ page that opened the Studio, with the motion they
 * already have. Picking one here selects it on the page; selecting one on the page highlights it here.
 */
export function PagePanel({ state, onSelect }: { state: PageState; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [onlyMoving, setOnlyMoving] = useState(false);
  // Folded to a small tab, so the Inspector underneath can be used (remembered for the session).
  const [folded, setFolded] = useState(() => { try { return sessionStorage.getItem('upw-page-panel-folded') === '1'; } catch { return false; } });
  const fold = (v: boolean) => { setFolded(v); try { sessionStorage.setItem('upw-page-panel-folded', v ? '1' : '0'); } catch { /* private window */ } };
  const listRef = useRef<HTMLDivElement>(null);
  const elements = state.status === 'connected' || state.status === 'closed' ? state.elements : [];
  const selected = state.status === 'connected' ? state.selected : '';

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return elements.filter((e) =>
      (!onlyMoving || e.motion.length > 0) &&
      (!q || e.label.toLowerCase().includes(q) || e.text.toLowerCase().includes(q) || e.motion.some((m) => m.toLowerCase().includes(q))));
  }, [elements, query, onlyMoving]);

  // Keep the element picked on the page in view in the list.
  useEffect(() => {
    if (!selected || !listRef.current) return;
    const row = listRef.current.querySelector(`[data-id="${CSS.escape(selected)}"]`);
    if (row) (row as HTMLElement).scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const moving = elements.filter((e) => e.motion.length).length;
  const pick = elements.find((e) => e.id === selected);

  if (folded) {
    return (
      <button type="button" className="page-panel-tab" onClick={() => fold(false)} title="Show the page's elements">
        Page{pick ? ` · ${pick.label}` : ''}
      </button>
    );
  }

  return (
    <aside className="page-panel" aria-label="Page elements">
      <header className="page-panel__head">
        <strong>Page</strong>
        <span className="stage-tag">beta</span>
        {state.status === 'connected' && <span className="page-panel__site" title={state.url}>{state.title || state.site}</span>}
        <button type="button" className="page-panel__fold" onClick={() => fold(true)} title="Fold the panel away" aria-label="Fold the panel away">–</button>
      </header>
      {state.status === 'waiting' && <p className="page-panel__note">Connecting to your Unyson+ page…</p>}
      {state.status === 'closed' && <p className="page-panel__note">The Live Editor was closed. Click Animate there again to reconnect.</p>}
      {(state.status === 'connected' || state.status === 'closed') && (
        <>
          <p className="page-panel__note">
            {elements.length} elements, {moving} with motion. Pick one to select it on the page, or click one there.
            Keyframing page elements here is coming next.
          </p>
          <div className="page-panel__tools">
            <input type="search" placeholder="Find an element…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find an element" />
            <label><input type="checkbox" checked={onlyMoving} onChange={(e) => setOnlyMoving(e.target.checked)} /> With motion</label>
          </div>
          <div className="page-panel__list" ref={listRef} role="listbox" aria-label="Elements">
            {shown.map((e) => (
              <button type="button" key={e.id} data-id={e.id} role="option" aria-selected={e.id === selected}
                className={`page-el${e.id === selected ? ' is-selected' : ''}`} style={{ paddingLeft: 10 + Math.min(e.depth, 6) * 12 }}
                onClick={() => onSelect(e.id)} disabled={state.status !== 'connected'}>
                <span className="page-el__label">{e.label}</span>
                {e.text && <span className="page-el__text">{e.text}</span>}
                {e.motion.length > 0 && <span className="page-el__motion" aria-label="Its motion">{e.motion.map((m) => <i key={m}>{m}</i>)}</span>}
              </button>
            ))}
            {!shown.length && <p className="page-panel__note">Nothing matches.</p>}
          </div>
          {pick && (
            <div className="page-panel__pick">
              <strong>{pick.label}</strong>{pick.text ? ` · ${pick.text}` : ''}
              <div>{pick.motion.length ? pick.motion.join(' · ') : 'No motion yet.'}</div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
