import { useEffect, useMemo, useRef, useState } from 'react';
import type { PageState } from '../lib/pageConnection';
import type { PageTimelines } from '../lib/usePageTimelines';
import { DEVICES, TRIGGERS, type Device, type TriggerType } from '../lib/pageTimeline';
import { downloadText, parseTimelinesFile, timelinesToCsv, timelinesToJson } from '../lib/pageTimelineFiles';

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [ioNote, setIoNote] = useState('');
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
  const canSave = state.status === 'connected' && state.canSave;
  const saveError = state.status === 'connected' && state.saved && !state.saved.ok ? state.saved.message : '';
  const here = useMemo(() => new Set(elements.map((e) => e.id)), [elements]);
  const missing = active ? active.tracks.filter((t) => !here.has(t.target)) : [];
  const runsOn: Device[] = active?.runsOn ?? DEVICES.map((d) => d.value);
  const slugOf = (name: string, fallback: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || fallback;
  const pageSlug = slugOf(state.status === 'connected' ? state.title || state.site : '', 'page');
  const pageUrl = state.status === 'connected' ? state.url : '';
  const withTracks = tl.list.filter((t) => t.tracks.length);

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const got = parseTimelinesFile(file.name, await file.text());
      const away = tl.importList(got);
      setIoNote(`Imported ${got.length} timeline${got.length === 1 ? '' : 's'}.`
        + (away ? ` ${away} track${away === 1 ? '' : 's'} point at elements not on this page: pick an element and use it for each.` : '')
        + ' Save to page to keep them.');
    } catch (err) {
      setIoNote(err instanceof Error ? err.message : 'That file could not be read.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

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
          <fieldset className="page-tl__devices">
            <legend>Runs on</legend>
            {DEVICES.map((d) => (
              <label key={d.value} title={d.hint}>
                <input type="checkbox" checked={runsOn.includes(d.value)}
                  onChange={(e) => {
                    const next = DEVICES.map((x) => x.value).filter((v) => (v === d.value ? e.target.checked : runsOn.includes(v)));
                    tl.update({ runsOn: next.length === 3 ? undefined : next });
                  }} /> {d.label}
              </label>
            ))}
          </fieldset>
          {!runsOn.length && <p className="page-panel__note is-warn">It runs on no device: tick at least one.</p>}
          {missing.length > 0 && (
            <div className="page-tl__missing">
              <strong>Not on this page</strong>
              {missing.map((m) => (
                <div key={m.target} className="page-tl__missing-row">
                  <span>{m.label || 'Element'} <small>({m.target.slice(0, 8)})</small></span>
                  {pick && !tracked.has(pick.id)
                    ? <button type="button" className="btn small" onClick={() => tl.retarget(m.target, pick.id)} title="Its moves go to the picked element">Use {pick.label}</button>
                    : <small>Pick an element to use instead</small>}
                </div>
              ))}
            </div>
          )}
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
          </p>
          <div className="page-tl__save">
            <button type="button" className="btn small primary" onClick={tl.save} disabled={!canSave || tl.saving || !tl.dirty}
              title={canSave ? 'Stores every timeline on the page, for visitors' : 'Activate the Animation Engine on the site to save page timelines'}>
              {tl.saving ? 'Saving…' : 'Save to page'}
            </button>
            <span className={`page-tl__state${tl.dirty ? ' is-dirty' : ''}`}>{!canSave ? 'Saving needs the Animation Engine' : tl.dirty ? 'Unsaved changes' : 'Saved on the page'}</span>
          </div>
          {saveError && <p className="page-panel__note is-warn" role="alert">{saveError}</p>}
          <details className="page-tl__io">
            <summary>Import / Export</summary>
            <div className="page-tl__io-row">
              <button type="button" className="btn small" disabled={!active.tracks.length}
                onClick={() => downloadText(`${slugOf(active.name, 'timeline')}.timeline.json`, timelinesToJson([active], pageUrl), 'application/json')}>This timeline (JSON)</button>
              <button type="button" className="btn small" disabled={!withTracks.length}
                onClick={() => downloadText(`${pageSlug}-timelines.json`, timelinesToJson(withTracks, pageUrl), 'application/json')}>All (JSON)</button>
              <button type="button" className="btn small" disabled={!withTracks.length} title="A spreadsheet: one row per keyframe"
                onClick={() => downloadText(`${pageSlug}-timelines.csv`, timelinesToCsv(withTracks), 'text/csv')}>All (CSV)</button>
            </div>
            <div className="page-tl__io-row">
              <button type="button" className="btn small" onClick={() => fileRef.current?.click()}>Import a file…</button>
              <input ref={fileRef} type="file" accept=".json,.csv,application/json,text/csv" hidden onChange={(e) => onImport(e.target.files?.[0])} />
            </div>
            <p className="page-panel__note">JSON keeps every setting, to move timelines to another page or site. CSV is a spreadsheet (one row per keyframe) that imports back the same.</p>
            {ioNote && <p className="page-panel__note" role="status">{ioNote}</p>}
          </details>
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
