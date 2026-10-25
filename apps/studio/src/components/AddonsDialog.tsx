import { useCallback, useEffect, useRef, useState } from 'react';
import { browseAddon, findAddon, listAddons, setAddonLocation, type Addon, type AddonField } from '../lib/addons';
import { GetKit } from './GetKit';

const STATE: Record<Addon['state'], string> = {
  connected: 'Running', ready: 'Ready', 'no-api': 'Needs its API', 'not-found': 'Not found',
  installed: 'Installed', 'not-installed': 'Not installed', soon: 'Coming soon',
};

/**
 * Add-ons: what the AI Dev Kit can use on this computer. Connectors (Voicebox, ACE-Step) are found automatically or
 * at a location given once here: an address, or a folder or program the kit may start when it is needed. Downloads
 * install where they are used (the first time).
 */
export function AddonsDialog(props: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [addons, setAddons] = useState<Addon[] | null>(null);
  const [noKit, setNoKit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [note, setNote] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const list = await listAddons();
      setNoKit(!list);
      setAddons(list);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); void refresh(); }
    if (!props.open && d.open) d.close();
  }, [props.open, refresh]);

  const save = async (id: string, field: 'location' | 'app', v: string) => {
    setBusy(true);
    setError(null);
    try { await setAddonLocation(id, v, field); setEditing(null); await refresh(); } catch (e) { setError((e as Error).message); setBusy(false); }
  };

  const act = async (a: Addon, run: () => Promise<string | null>, found: (p: string) => string, missing: string | null) => {
    setBusy(true);
    setError(null);
    setNote((n) => ({ ...n, [a.id]: '' }));
    try {
      const p = await run();
      if (p) setNote((n) => ({ ...n, [a.id]: found(p) }));
      else if (missing) setNote((n) => ({ ...n, [a.id]: missing }));
      setEditing(null);
      await refresh();
    } catch (e) { setError((e as Error).message); setBusy(false); }
  };
  const find = (a: Addon) => act(a, () => findAddon(a.id), (p) => `Found it: ${p}`,
    `Not found in the usual places (the program folders and the top two levels of each drive). Use Browse to point to it${a.link ? ', or get it first' : ''}.`);
  const browse = (a: Addon, field: 'location' | 'app') => act(a, () => browseAddon(a.id, field), (p) => `Set to ${p}`, null);

  const fieldRow = (a: Addon, field: 'location' | 'app', f: AddonField) => {
    const key = `${a.id}:${field}`;
    const label = f.kind === 'url' ? 'Address' : field === 'app' ? 'Program' : 'Location';
    if (editing !== key) {
      return (
        <div className="addon-field" key={key}>
          <span className="addon-field-label">{label}</span>
          <code className="addon-field-value">{f.value || 'not set'}</code>
          {f.kind === 'path' && <button type="button" className="btn small ghost" disabled={busy} onClick={() => browse(a, field)} title="Opens your computer's file or folder picker">Browse…</button>}
          <button type="button" className="btn small ghost" disabled={busy} onClick={() => { setEditing(key); setValue(f.value); }}>{f.kind === 'path' ? 'Type it' : f.value ? 'Change' : 'Set'}</button>
        </div>
      );
    }
    return (
      <div className="addon-edit" key={key}>
        <div className="export-row">
          <input className="addon-input" aria-label={`${a.name} ${label.toLowerCase()}`} value={value} autoFocus
            onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void save(a.id, field, value); }}
            placeholder={f.placeholder || f.default || ''} />
          <button type="button" className="btn small primary" disabled={busy || !value.trim()} onClick={() => save(a.id, field, value)}>Save</button>
          {f.value && <button type="button" className="btn small ghost" disabled={busy} onClick={() => save(a.id, field, '')}>{f.default ? 'Reset' : 'Clear'}</button>}
          <button type="button" className="btn small ghost" disabled={busy} onClick={() => setEditing(null)}>Cancel</button>
        </div>
        {f.hint && <p className="addon-detail">{f.hint}</p>}
      </div>
    );
  };

  return (
    <dialog ref={ref} className="export addons" aria-labelledby="addons-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="addons-title">Add-ons</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          Extra tools the AI Dev Kit can use on this computer. Apps you install yourself are found automatically, or
          tell the kit where they are once and it starts them when needed; the others download the first time you use
          them. Nothing is uploaded anywhere.
        </p>
        {noKit && <GetKit onCheck={refresh} busy={busy} />}
        {error && <p className="export-warn" role="alert">{error}</p>}
        <ul className="addons-list">
          {(addons ?? []).map((a) => (
            <li key={a.id} className={`addon is-${a.state}`}>
              <div className="addon-head">
                <strong>{a.name}</strong>
                <span className={`addon-state is-${a.state}`}>{STATE[a.state] ?? a.state}</span>
              </div>
              <p>{a.what}</p>
              <p className="addon-detail">{a.detail}</p>
              {a.id === 'voicebox' && a.state === 'connected' && a.profiles && a.profiles.length > 0 && (
                <p className="addon-detail">Voices: {a.profiles.map((p) => p.name).join(', ')}. Pick one under Voice-over from a script, or in AI assist.</p>
              )}
              {a.id === 'voicebox' && (
                <p className="addon-detail">Only use a voice you have the right to use: your own, or someone's with their permission.</p>
              )}
              {a.id === 'ace-step' && (a.state === 'connected' || a.state === 'ready') && (
                <p className="addon-detail">Make music from Insert, Music, or ask AI assist for a soundtrack.</p>
              )}
              {a.kind === 'connector' && a.state !== 'soon' && (
                <>
                  {note[a.id] && <p className="addon-detail" role="status">{note[a.id]}</p>}
                  {a.location && fieldRow(a, 'location', a.location)}
                  {a.app && fieldRow(a, 'app', a.app)}
                  <div className="export-row">
                    {a.location?.kind === 'path' || a.app
                      ? <button type="button" className="btn small" disabled={busy} onClick={() => find(a)} title="Looks in the program folders and the top two levels of each drive">Find it</button>
                      : null}
                    <button type="button" className={`btn small${a.location?.kind === 'path' || a.app ? ' ghost' : ''}`} disabled={busy} onClick={refresh}>Check again</button>
                    {a.link && a.state !== 'connected' && <a className="addon-link" href={a.link} target="_blank" rel="noopener noreferrer">Get {a.name}</a>}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        {busy && !addons && !noKit && <p className="addon-detail">Checking…</p>}
      </div>
    </dialog>
  );
}
