import { useEffect, useRef, useState } from 'react';
import { listProjects, revealProject, setWorkspaceRoot, workspaceAvailable, type ProjectInfo, type WorkspaceRoot } from '../lib/workspace';
import { kitStatus } from '../lib/ai';
import { GetKit, KIT_REPO } from './GetKit';

export const AGENTS_GUIDE = 'https://docs.unysonplus.com/kinetic-scenes/ai-agents';

/**
 * Connecting an AI agent (through the AI Dev Kit) is the way to the fullest result: the agent can record the screen,
 * narrate, make music, look at frames and fix what it sees, working in the same project folder as the Studio.
 * AI assist stays for quick ideas and small changes with nothing to set up.
 */
export function AgentCard(props: { compact?: boolean }) {
  return (
    <div className="agent-card" role="note">
      <strong>Get the full result: connect your AI agent</strong>
      <p>
        With the free AI Dev Kit, an AI agent on your computer, such as Claude, builds whole videos in your workspace:
        it records your screen, narrates with your own voice, adds music, checks every frame and fixes what it finds.
        You watch each step here and export when it is ready.
      </p>
      {!props.compact && <p className="addon-detail">AI assist is for quick ideas and small changes, with nothing to set up.</p>}
      <div className="export-row">
        <a className="btn small primary" href={KIT_REPO} target="_blank" rel="noopener noreferrer">Get the AI Dev Kit</a>
        <a className="btn small ghost" href={AGENTS_GUIDE} target="_blank" rel="noopener noreferrer">How it works</a>
      </div>
    </div>
  );
}

const ago = (t: number) => {
  const s = (Date.now() - t) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(t).toLocaleDateString();
};

/**
 * File › Projects: the workspace's projects (folders on this computer, kept by the AI Dev Kit). Open one, start a
 * new one from the scene in front of you, or show the folder.
 */
export function ProjectsDialog(props: { open: boolean; onClose: () => void; current: string | null; title: string;
  onOpen: (id: string) => void; onCreate: (name: string) => Promise<void>; onCloseProject: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<'checking' | 'missing' | 'ready'>('checking');
  const [root, setRoot] = useState<WorkspaceRoot | null>(null);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setState('checking');
    setError(null);
    await kitStatus();
    if (!(await workspaceAvailable())) { setState('missing'); return; }
    try { const r = await listProjects(); setRoot(r); setProjects(r.projects); setState('ready'); } catch (e) { setError((e as Error).message); setState('missing'); }
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setName(props.title || ''); load(); }
    if (!props.open && d.open) d.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  /** Picks another workspace folder (the computer's own folder window opens; it may be behind the browser). */
  const changeRoot = async (reset = false) => {
    setBusy(true);
    setError(null);
    try {
      const r = await setWorkspaceRoot(reset ? { reset: true } : { choose: true });
      if (r.chosen) await load();
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  const create = async () => {
    setBusy(true);
    setError(null);
    try { await props.onCreate(name.trim() || 'Untitled'); props.onClose(); } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  return (
    <dialog ref={ref} className="export addons projects" aria-labelledby="projects-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current && !busy) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="projects-title">Projects</h2>
          <button type="button" className="icon-link" aria-label="Close" disabled={busy} onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          A project is a folder on your computer: the scene, its media and its renders. You and your AI agent work on the
          same files, and changes the agent makes show up here straight away.
        </p>
        {state === 'checking' && <p className="addon-detail" role="status">Looking for the AI Dev Kit…</p>}
        {state === 'missing' && (
          <>
            <GetKit lead="Projects are kept by the AI Dev Kit" onCheck={load} />
            <p className="addon-detail">Until then, your scene is kept in this browser, and File › Save downloads a copy.</p>
          </>
        )}
        {state === 'ready' && (
          <>
            {projects.length ? (
              <ul className="project-list">
                {projects.map((p) => (
                  <li key={p.id} className={p.id === props.current ? 'is-current' : ''}>
                    <button type="button" className="project-open" disabled={busy || p.id === props.current} onClick={() => { props.onOpen(p.id); props.onClose(); }}>
                      <span className="project-name">{p.id}</span>
                      <span className="addon-detail">
                        {p.title && p.title !== p.id ? `${p.title} · ` : ''}{p.id === props.current ? 'open now' : `${Math.round(p.duration)} s · ${ago(p.updated)}`}
                      </span>
                    </button>
                    <button type="button" className="btn small ghost" title="Show this folder" onClick={() => revealProject(p.id).catch(() => {})}>Folder</button>
                  </li>
                ))}
              </ul>
            ) : <p className="addon-detail">No projects yet.</p>}
            <div className="export-row project-new-row">
              <label className="music-field project-new">New project from this scene (the name is its folder's name)
                <input className="lib-search" value={name} placeholder="Project name" disabled={busy} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') create(); }} />
              </label>
              <button type="button" className="btn primary" disabled={busy} onClick={create}>{busy ? 'Creating…' : 'Create'}</button>
            </div>
            <div className="export-row">
              <button type="button" className="btn small ghost" onClick={() => revealProject().catch(() => {})}>Open the workspace folder</button>
              {props.current && <button type="button" className="btn small ghost" onClick={() => { props.onCloseProject(); props.onClose(); }}>Close the project</button>}
            </div>
            <div className="project-root">
              <div>
                <span className="addon-detail">Projects are kept in</span>
                <code>{root?.root}</code>
              </div>
              {root?.byEnv
                ? <p className="addon-detail">Set by KINETIC_WORKSPACE when the AI Dev Kit starts.</p>
                : (
                  <div className="export-row">
                    <button type="button" className="btn small ghost" disabled={busy} onClick={() => changeRoot()}
                      title="Opens your computer's folder window (it may open behind the browser)">{busy ? 'Choosing…' : 'Change…'}</button>
                    {!root?.isDefault && <button type="button" className="btn small ghost" disabled={busy} onClick={() => changeRoot(true)}>Back to Documents</button>}
                  </div>
                )}
              <p className="addon-detail">Changing it does not move projects already made: move their folders if you want them there too.</p>
            </div>
          </>
        )}
        {error && <p className="export-warn" role="alert">{error}</p>}
        <AgentCard />
      </div>
    </dialog>
  );
}
