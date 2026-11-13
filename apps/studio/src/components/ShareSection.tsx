import { useEffect, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { shareLink } from '../lib/share';
import { kitify } from './KitLink';

/** Links over this length may be cut short by chat apps and email (they still work when pasted whole). */
const LONG_LINK = 8000;

/** Export → Share link: the scene inside the link itself, no server or account. */
export function ShareSection(props: { scene: Scene; open: boolean }) {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!props.open) return;
    setCopied(false);
    shareLink(props.scene).then(setLink).catch(() => setLink(''));
  }, [props.open, props.scene]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); } catch { /* the field can still be copied by hand */ }
  };
  const kb = Math.max(1, Math.round(link.length / 1024));

  return (
    <section className="export-opt">
      <h3>Share link</h3>
      <p>
        Anyone who opens the link gets their own copy of this scene in the Studio, to watch or change. The scene travels inside
        the link itself, so nothing is uploaded anywhere and no account is needed. Later edits need a new link.
      </p>
      <label htmlFor="share-link" className="sr-only">Share link</label>
      <input id="share-link" className="share-link mono" readOnly value={link || 'Making the link…'} onFocus={(e) => e.currentTarget.select()} />
      <div className="export-row">
        <button type="button" className="btn" onClick={copy} disabled={!link}>{copied ? 'Copied' : 'Copy link'}</button>
        <span className="export-meta">{link ? `${kb} KB link` : ''}</span>
      </div>
      {link.length > LONG_LINK && (
        <p className="export-warn">
          This link is long ({kitify(kb)} KB), usually because uploaded images are inside the scene. Chat apps and email may cut it
          short; use image addresses (https://…) for a short link, or send the project file (Save) instead.
        </p>
      )}
    </section>
  );
}
