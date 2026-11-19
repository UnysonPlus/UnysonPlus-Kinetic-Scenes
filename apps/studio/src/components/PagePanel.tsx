import { useEffect, useMemo, useRef, useState } from 'react';
import type { PageState } from '../lib/pageConnection';
import type { PageTimelines } from '../lib/usePageTimelines';
import { TRIGGERS, type TriggerType } from '../lib/pageTimeline';

/**
 * Page mode (Animation Creator, beta): the elements of the Unyson+ page that opened the Studio, with the motion they
 * already have, and the page's timelines. Picking an element here selects it on the page (and the other way round);
 * Add to timeline gives it a track, keyframed in the timeline below and played on the page as you edit.
 */
export function PagePanel({ state, onSelect, timelines: tl }: {
  state: PageState; onSelect: (id: string) => void; timelines: PageTimelines;
}) {
  const [query, setQuery] = useState('');
  const [onlyMoving, setOnlyMoving] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const elements = state.status === 'connected' || state.status === 'closed' ? state.elements : [];
  const selected = state.status === 'connected' ? state.selected : '';
  const active = tl.active;
  const tracked = useMemo(() => new Set(active ? active.tracks.map((t) => t.target) : []), [active]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return elements.filter((e) =>
      (!onlyMoving || e.motion.length > 0 || tracked.has(e.id)) &&
      (!q || e.label.toLowerCase().includes(q) || e.text.toLowerCase().includes(q) || e.motion.some((m) => m.toLowerCase().includes(q))));
  }, [elements, query, onlyMoving, tracked]);

  // Keep the element picked on the page in view in the list.
  useEffect(() => {
    if (!selected || !listRef.current) return;
    const row = listRef.current.querySelector(`[data-id="${CSS.escape(selected)}"]`);
    if (row) (row as HTMLElement).scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const moving = elements.filter((e) => e.motion.length).length;
  const pick = elements.find((e) => e.id === selected);
  const nameOf = (id: string) => { const e = elements.find((x) => x.id === id); return e ? e.label + (e.text ? ` · ${e.text.slice(0, 24)}` : '') : 'Element'; };

  const trig = active?.trigger;
  const connected = state.status === 'connected';

  return (
    <aside className="page-panel" aria-label="Page elements and timelines">
      <header className="page-panel__head">
        <strong>Page</strong>
        <span className="stage-tag">beta</span>
        {state.status === 'connected' && <span className="page-panel__site" title={state.url}>{state.title || state.site}</span>}
      </header>
      {state.status === 'waiting' && <p className="page-panel__note">Connecting to your Unyson+ page…</p>}
      {state.status === 'closed' && <p className="page-panel__note">The Live Editor was closed. Click Animate there again to reconnect.</p>}

      {connected && active && trig && (
        <section className="page-tl" aria-label="Timeline">
          <div className="page-tl__row">
            <select value={tl.activeId} onChange={(e) => tl.switchTo(e.target.value)} aria-label="Timeline">
              {tl.list.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.tracks.length})</option>)}
            </select>
            <button type="button" className="btn small" onClick={tl.create} title="A new timeline for this page">New</button>
            <button type="button" className="btn small" onClick={() => { if (confirm(`Delete “${active.name}”?`)) tl.remove(); }} title="Delete this timeline">Delete</button>
          </div>
          <label className="page-tl__field">Name
            <input type="text" value={active.name} maxLength={80} onChange={(e) => tl.update({ name: e.target.value })} />
          </label>
          <div className="page-tl__grid">
            <label className="page-tl__field">Plays on
              <select value={trig.type} onChange={(e) => tl.update({ trigger: { type: e.target.value as TriggerType } })} title={TRIGGERS.find((t) => t.value === trig.type)?.hint}>
                {TRIGGERS.map((t) => <option key={t.value} value={t.value} title={t.hint}>{t.label}</option>)}
              </select>
            </label>
            <label className="page-tl__field">Length (s)
              <input type="number" min={0.2} max={120} step={0.1} value={active.duration} onChange={(e) => tl.setDuration(Number(e.target.value) || 1)} />
            </label>
          </div>
          {trig.type !== 'load' && (
            <label className="page-tl__field">{trig.type === 'in-view' ? 'When this is in view' : trig.type === 'hover' ? 'When the pointer is over' : 'When this is clicked'}
              <select value={trig.target || ''} onChange={(e) => tl.update({ trigger: { target: e.target.value || undefined } })}>
                <option value="">Its first track’s element</option>
                {trig.target && !active.tracks.some((t) => t.target === trig.target) && <option value={trig.target}>{nameOf(trig.target)}</option>}
                {active.tracks.map((t) => <option key={t.target} value={t.target}>{nameOf(t.target)}</option>)}
                {pick && !active.tracks.some((t) => t.target === pick.id) && pick.id !== trig.target && <option value={pick.id}>The picked element: {nameOf(pick.id)}</option>}
              </select>
            </label>
          )}
          <div className="page-tl__checks">
            {trig.type === 'hover' && (
              <label><input type="checkbox" checked={trig.leave !== 'stay'} onChange={(e) => tl.update({ trigger: { leave: e.target.checked ? 'reverse' : 'stay' } })} /> Play back on leaving</label>
            )}
            {trig.type === 'click' && (
              <label><input type="checkbox" checked={!!trig.toggle} onChange={(e) => tl.update({ trigger: { toggle: e.target.checked } })} /> Clicks go forward, then back</label>
            )}
            {trig.type === 'in-view' && (
              <label><input type="checkbox" checked={trig.once === false} onChange={(e) => tl.update({ trigger: { once: !e.target.checked } })} /> Every time it comes into view</label>
            )}
            {(trig.type === 'load' || trig.type === 'click') && (
              <label><input type="checkbox" checked={active.repeat === -1} onChange={(e) => tl.update({ repeat: e.target.checked ? -1 : 0 })} /> Loop</label>
            )}
            {(trig.type === 'load' || trig.type === 'click') && active.repeat === -1 && (
              <label><input type="checkbox" checked={!!active.yoyo} onChange={(e) => tl.update({ yoyo: e.target.checked })} /> Back and forth</label>
            )}
          </div>
          <div className="page-tl__row">
            {tl.previewing
              ? <button type="button" className="btn small" onClick={tl.stopPreview}>Stop the preview</button>
              : <button type="button" className="btn small primary" onClick={tl.preview} disabled={!active.tracks.length}
                  title="Plays it on the page as a visitor gets it: it waits for its trigger (hover or click the element, scroll it into view)">Preview on the page</button>}
            {pick && !tracked.has(pick.id) && (
              <button type="button" className="btn small" onClick={() => tl.addElement(pick.id)} title="Give the picked element a track in this timeline, with a first move to change">Add {pick.label} to the timeline</button>
            )}
          </div>
          <p className="page-panel__note">
            {active.tracks.length
              ? 'Each track is an element: select its Keyframes clip to change its moves and curves. Play or scrub the timeline and the page follows.'
              : 'Pick an element (here or on the page), then Add it to the timeline: it gets a first move (rise and fade in) to change.'}
            {' '}Saving to the page comes next; for now a timeline lasts while both windows are open.
          </p>
        </section>
      )}

      {(state.status === 'connected' || state.status === 'closed') && (
        <>
          <p className="page-panel__note">{elements.length} elements, {moving} with motion.</p>
          <div className="page-panel__tools">
            <input type="search" placeholder="Find an element…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find an element" />
            <label><input type="checkbox" checked={onlyMoving} onChange={(e) => setOnlyMoving(e.target.checked)} /> With motion</label>
          </div>
          <div className="page-panel__list" ref={listRef} role="listbox" aria-label="Elements">
            {shown.map((e) => (
              <button type="button" key={e.id} data-id={e.id} role="option" aria-selected={e.id === selected}
                className={`page-el${e.id === selected ? ' is-selected' : ''}${tracked.has(e.id) ? ' is-tracked' : ''}`} style={{ paddingLeft: 10 + Math.min(e.depth, 6) * 12 }}
                onClick={() => onSelect(e.id)} onDoubleClick={() => { if (connected) tl.addElement(e.id); }} disabled={!connected}
                title={tracked.has(e.id) ? 'In this timeline' : 'Double-click to add it to the timeline'}>
                <span className="page-el__label">{tracked.has(e.id) && <b className="page-el__dot" aria-label="In this timeline">●</b>}{e.label}</span>
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
