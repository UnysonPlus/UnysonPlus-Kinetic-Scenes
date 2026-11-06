import { useEffect, useRef } from 'react';
import { WHATS_NEW, type NewsAction } from '../lib/whatsNew';

/** Help › What's new: recent features, each with a way to try it and a way to read more. */
export function WhatsNewDialog(props: { open: boolean; onClose: () => void; onTry: (action: NewsAction) => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);

  return (
    <dialog ref={ref} className="export addons news-dialog" aria-labelledby="news-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="news-title">What's new</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <ul className="news-list">
          {WHATS_NEW.map((n) => (
            <li key={n.id}>
              <div>
                <strong>{n.title}</strong>
                <p>{n.text}</p>
              </div>
              <div className="news-actions">
                {n.action && <button type="button" className="btn small" onClick={() => props.onTry(n.action!)}>Try it</button>}
                <a href={n.doc} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
