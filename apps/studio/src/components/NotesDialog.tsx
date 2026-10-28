import { useEffect, useRef, useState } from 'react';
import { readNotes, saveNotes } from '../lib/workspace';

/**
 * File › Project notes: the project's notes.md (the plan, what was decided, what is left), kept by the person and
 * their AI agent together. Saves as you type; what the agent adds shows up here while it is open.
 */
export function NotesDialog(props: { open: boolean; onClose: () => void; project: string | null; outsideChange: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState('');
  const [state, setState] = useState<'loading' | 'saved' | 'saving' | 'error'>('loading');
  const dirty = useRef(false);

  const load = async () => {
    if (!props.project) return;
    try { const r = await readNotes(props.project); setText(r.notes); dirty.current = false; setState('saved'); } catch { setState('error'); }
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setState('loading'); load(); }
    if (!props.open && d.open) d.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, props.project]);

  // The agent added something: take it, unless there is typing not yet saved here.
  useEffect(() => { if (props.open && props.outsideChange && !dirty.current) load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.outsideChange]);

  useEffect(() => {
    if (!dirty.current || !props.project) return;
    setState('saving');
    const t = setTimeout(() => {
      saveNotes(props.project!, text).then(() => { dirty.current = false; setState('saved'); }).catch(() => setState('error'));
    }, 700);
    return () => clearTimeout(t);
  }, [text, props.project]);

  return (
    <dialog ref={ref} className="export addons notes-dialog" aria-labelledby="notes-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="notes-title">Project notes</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          The plan, what was decided and what is left, in the project folder as notes.md. Your AI agent reads them before
          it works on the project and adds to them, so the next session carries on where this one stopped.
        </p>
        <textarea className="notes-text" value={text} spellCheck aria-label="Project notes" disabled={state === 'loading'}
          onChange={(e) => { dirty.current = true; setText(e.target.value); }} />
        <p className="addon-detail" role="status">
          {state === 'loading' ? 'Loading…' : state === 'saving' ? 'Saving…' : state === 'error' ? 'Not saved: is the AI Dev Kit running?' : 'Saved in the project folder.'}
        </p>
      </div>
    </dialog>
  );
}
