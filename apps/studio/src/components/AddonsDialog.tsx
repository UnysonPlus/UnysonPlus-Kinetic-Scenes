import { useCallback, useEffect, useRef, useState } from 'react';
import { listAddons, setAddonLocation, type Addon } from '../lib/addons';

const STATE: Record<Addon['state'], string> = {
  connected: 'Connected', 'not-found': 'Not found', installed: 'Installed', 'not-installed': 'Not installed', soon: 'Coming soon',
};

/**
 * Add-ons: what the AI Dev Kit can use on this computer. Connectors (Voicebox) are found automatically; if one is
 * somewhere unusual, its location is set here once. Downloads install where they are used (the first time).
 */
export function AddonsDialog(props: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [addons, setAddons] = useState<Addon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const refresh = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const list = await listAddons();
      if (!list) { setAddons(null); setError('Start the AI Dev Kit on this computer to use add-ons.'); }
      else setAddons(list);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); void refresh(); }
    if (!props.open && d.open) d.close();
  }, [props.open, refresh]);

  const save = async (id: string, location: string) => {
    setBusy(true);
    setError(null);
    try { await setAddonLocation(id, location); setEditing(null); await refresh(); } catch (e) { setError((e as Error).message); setBusy(false); }
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
          Extra tools the AI Dev Kit can use on this computer. Apps you install yourself are found automatically;
          the others download the first time you use them. Nothing is uploaded anywhere.
        </p>
        {error && <p className="export-warn" role="alert">{error}</p>}
        <ul className="addons-list">
          {(addons ?? []).map((a) => (
            <li key={a.id} className={`addon is-${a.state}`}>
              <div className="addon-head">
                <strong>{a.name}</strong>
                <span className={`addon-state is-${a.state}`}>{STATE[a.state]}</span>
              </div>
              <p>{a.what}</p>
              <p className="addon-detail">{a.detail}</p>
              {a.id === 'voicebox' && a.state === 'connected' && a.profiles && a.profiles.length > 0 && (
                <p className="addon-detail">Voices: {a.profiles.map((p) => p.name).join(', ')}. Pick one under Voice-over from a script, or in AI assist.</p>
              )}
              {a.id === 'voicebox' && (
                <p className="addon-detail">Only use a voice you have the right to use: your own, or someone's with their permission.</p>
              )}
              {a.kind === 'connector' && a.state !== 'soon' && (
                <div className="export-row">
                  <button type="button" className="btn small" disabled={busy} onClick={refresh}>{a.state === 'connected' ? 'Check again' : 'Find it again'}</button>
                  {a.location && editing !== a.id && (
                    <button type="button" className="btn small ghost" disabled={busy} onClick={() => { setEditing(a.id); setValue(a.location!.value); }}>Set its address</button>
                  )}
                  {a.link && a.state !== 'connected' && <a className="addon-link" href={a.link} target="_blank" rel="noopener noreferrer">Get {a.name}</a>}
                </div>
              )}
              {editing === a.id && a.location && (
                <div className="export-row">
                  <input className="addon-input" aria-label={`${a.name} address`} value={value} onChange={(e) => setValue(e.target.value)} placeholder={a.location.default} />
                  <button type="button" className="btn small primary" disabled={busy} onClick={() => save(a.id, value)}>Save</button>
                  <button type="button" className="btn small ghost" disabled={busy} onClick={() => save(a.id, '')} title={`Back to ${a.location.default}`}>Reset</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {busy && !addons && <p className="addon-detail">Checking…</p>}
      </div>
    </dialog>
  );
}
