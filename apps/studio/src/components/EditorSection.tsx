import { useState } from 'react';
import { kitBase } from '../lib/ai';
import { revealProject } from '../lib/workspace';

/**
 * Export › For another editor: the scene's cut as a project DaVinci Resolve, Final Cut Pro and Premiere Pro open
 * (FCPXML and XML), with its captions as SRT, written by the AI Dev Kit into the project's renders/edit folder.
 */
export function EditorSection(props: { project: string | null; onDone: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const go = async () => {
    if (!props.project) return;
    setBusy(true); setError('');
    try {
      const b = await kitBase();
      if (!b) throw new Error('This needs the AI Dev Kit running on this computer.');
      const r = await fetch(`${b}/studio/interchange`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ project: props.project }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404 && !j.error) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
      if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
      revealProject(props.project).catch(() => {});
      props.onDone(`Wrote ${j.files.join(', ')} into the project's renders/edit folder (${j.clips} clips).${j.graphics ? '' : ' The graphics are not in it yet: render a See-through MOV first, then do this again.'} The README there says how to open it in each editor.`);
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };
  return (
    <section className="export-opt">
      <h3>For another editor</h3>
      <p>
        The cut as a project for <strong>DaVinci Resolve</strong>, <strong>Final Cut Pro</strong> or <strong>Premiere Pro</strong>:
        every footage and sound clip on its own track with its in and out points, the captions as subtitles (SRT), and
        the graphics as one see-through clip on top once you have rendered a See-through MOV.
      </p>
      {props.project
        ? <button type="button" className="btn small" disabled={busy} onClick={go}>{busy ? 'Writing…' : 'Write the editor project'}</button>
        : <p className="export-note">Open a project first (File › Projects): the editor project refers to its media files where they are.</p>}
      {error && <p className="export-error" role="alert">{error}</p>}
    </section>
  );
}
