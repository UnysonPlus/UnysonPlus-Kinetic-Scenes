import { useEffect, useState } from 'react';
import { fetchSound, makeSound, saveSoundsKey, searchSounds, soundsStatus, type FoundSound, type MadeSound } from '../lib/soundDesign';

/**
 * The Sounds tab's two extras, through the AI Dev Kit: make a sound from a description, and search public-domain
 * sounds on Freesound (with the person's own free key).
 */
export function MoreSounds(props: { onPreview: (src: string) => void; onAdd: (src: string, name: string, seconds: number) => void }) {
  const [prompt, setPrompt] = useState('');
  const [made, setMade] = useState<MadeSound | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [keyText, setKeyText] = useState('');
  const [q, setQ] = useState('');
  const [found, setFound] = useState<FoundSound[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => { soundsStatus().then((s) => setHasKey(s.key)).catch(() => setHasKey(null)); }, []);
  const run = async (what: string, job: () => Promise<void>) => {
    setBusy(what);
    setError(null);
    try { await job(); } catch (e) { setError((e as Error).message); } finally { setBusy(null); }
  };

  return (
    <div className="more-sounds">
      <section className="lib-group">
        <h3>Make a sound</h3>
        <form className="ms-row" onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) run('Making it', async () => { const m = await makeSound(prompt.trim()); setMade(m); props.onPreview(m.src); }); }}>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A soft paper swoosh, 0.6 s" aria-label="Describe a sound" />
          <button type="submit" className="btn small" disabled={!prompt.trim() || !!busy}>Make</button>
        </form>
        {made && (
          <div className="ms-result">
            <button type="button" className="btn small ghost" onClick={() => props.onPreview(made.src)}>▶ {made.name}</button>
            <button type="button" className="btn small" onClick={() => props.onAdd(made.src, made.name, made.seconds)}>Add</button>
          </div>
        )}
        <p className="field-hint">Your AI designs it and it is made right here, free; with your own ElevenLabs key in the AI Dev Kit, it is recorded by their sound-effects model instead.</p>
      </section>

      <section className="lib-group">
        <h3>Public-domain sounds (Freesound)</h3>
        {hasKey === false ? (
          <form className="ms-key" onSubmit={(e) => { e.preventDefault(); run('Checking the key', async () => { await saveSoundsKey(keyText.trim()); setHasKey(true); setKeyText(''); }); }}>
            <p className="field-hint">Search hundreds of thousands of free, public-domain (CC0) sounds: nothing to license or credit. Get a free key at <a href="https://freesound.org/apiv2/apply" target="_blank" rel="noopener noreferrer">freesound.org</a> and paste it here (it stays in the AI Dev Kit on your computer).</p>
            <div className="ms-row">
              <input value={keyText} onChange={(e) => setKeyText(e.target.value)} placeholder="Your Freesound API key" aria-label="Freesound API key" />
              <button type="submit" className="btn small" disabled={!keyText.trim() || !!busy}>Save</button>
            </div>
          </form>
        ) : hasKey ? (
          <>
            <form className="ms-row" onSubmit={(e) => { e.preventDefault(); if (q.trim()) run('Searching', async () => { const r = await searchSounds(q.trim()); setFound(r.results); setCount(r.count); }); }}>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="cash register, crowd cheer…" aria-label="Search public-domain sounds" />
              <button type="submit" className="btn small" disabled={!q.trim() || !!busy}>Search</button>
            </form>
            {found.length > 0 && <p className="field-hint">{count.toLocaleString()} public-domain sounds; the best {found.length}:</p>}
            <ul className="snd-list">
              {found.map((s) => (
                <li key={s.id} className="snd">
                  <button type="button" className="snd-play" onClick={() => props.onPreview(s.preview)} title={`${s.tags.join(', ')}${s.by ? ` · by ${s.by}` : ''}`}>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    <span className="snd-name">{s.name}</span>
                    <span className="snd-len mono">{s.seconds.toFixed(1)}s</span>
                  </button>
                  <button type="button" className="snd-add" disabled={!!busy} onClick={() => run('Fetching', async () => { const f = await fetchSound(s.id); props.onAdd(f.src, f.name, f.seconds); })}>Add</button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="field-hint">Start the AI Dev Kit on this computer to search free public-domain sounds.</p>
        )}
      </section>
      {(busy || error) && <p className={busy ? 'field-hint' : 'export-error'} role="status">{busy ? `${busy}…` : error}</p>}
    </div>
  );
}
