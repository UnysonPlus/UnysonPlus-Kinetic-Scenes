import { useEffect, useRef, useState } from 'react';
import { TEMPLATES } from '../lib/templates';
import type { SceneStyle } from '../lib/styles';

/** File › New from template: complete scenes by goal, built in the style you pick. */
export function TemplatesDialog(props: { open: boolean; styles: SceneStyle[]; onClose: () => void; onPick: (templateId: string, style: SceneStyle) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [styleId, setStyleId] = useState(props.styles[0]?.id ?? '');
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);
  const style = props.styles.find((s) => s.id === styleId) ?? props.styles[0];
  return (
    <dialog ref={ref} className="export addons templates-dialog" aria-labelledby="tpl-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="tpl-title">Start from a template</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="tpl-intro">Pick what you want to make. Each template is a finished scene: change the words and pictures, or ask AI assist to build on it.</p>
        <label className="tpl-style">
          <span>Style</span>
          <select value={style?.id ?? ''} onChange={(e) => setStyleId(e.target.value)}>
            {props.styles.map((s) => <option key={s.id} value={s.id}>{s.name}{s.custom ? ' (yours)' : ''}</option>)}
          </select>
        </label>
        <ul className="tpl-list">
          {TEMPLATES.map((t) => (
            <li key={t.id}>
              <button type="button" className="tpl-card" onClick={() => style && props.onPick(t.id, style)}>
                <span className="tpl-goal">{t.goal}</span>
                <strong>{t.name}</strong>
                <span className="tpl-desc">{t.description}</span>
                <span className="tpl-format">{t.format === '9x16' ? 'Vertical 9:16' : 'Wide 16:9'}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
