import { useEffect, useMemo, useRef, useState } from 'react';
import type { ApplyParts, SceneStyle } from '../lib/styles';
import { STYLE_GROUPS } from '../lib/stylePreviews';
import { readStyleFile, styleFile } from '../lib/brand';
import { searchStyles } from '../lib/styleRecent';
import { BrandEditor } from './BrandEditor';
import { Live, Tile } from './StyleGallery';
import { kitify } from './KitLink';

/**
 * The Style library: every style, filtered by group or searched, each playing on hover. Picking one shows it large
 * with what you can do with it: start something new in it, apply it to this scene, or give it to AI assist.
 * The same actions as the Styles panel, in one place big enough to choose a look by eye.
 */
export function StyleLibraryDialog(props: {
  open: boolean;
  onClose: () => void;
  styles: SceneStyle[];
  /** The style AI assist uses (null: none). */
  aiStyle: string | null;
  hasScene: boolean;
  /** Start something new in the style (the start screen's "Make it in …" step). */
  onStart: (style: SceneStyle) => void;
  onApply: (style: SceneStyle, parts: ApplyParts) => void;
  onUseForAi: (id: string | null) => void;
  onDelete: (id: string) => void;
  /** Adds a style, or replaces the one with the same id (a brand kit made or edited, a style imported). */
  onUpsert: (style: SceneStyle) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [parts, setParts] = useState<ApplyParts>({ look: true, motion: true, sound: true });
  const [editing, setEditing] = useState<SceneStyle | 'new' | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  /** Shows a style large; on a phone the large view is below the grid, so it scrolls into sight. */
  const pick = (id: string) => {
    setPicked(id);
    setEditing(null);
    setTimeout(() => detailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60);
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) {
      d.showModal();
      setEditing(null);
      setFileError(null);
      setTimeout(() => searchRef.current?.focus(), 30);
    }
    if (!props.open && d.open) d.close();
  }, [props.open]);

  const yours = props.styles.filter((s) => s.custom);
  const groups = [...STYLE_GROUPS.map((g) => ({ id: g.id, label: g.label })), ...(yours.length ? [{ id: 'yours', label: 'Yours' }] : [])];
  const list = useMemo(() => {
    const by = new Map(props.styles.map((s) => [s.id, s]));
    const pickIds = (ids: string[]) => ids.map((id) => by.get(id)).filter((s): s is SceneStyle => !!s);
    let l: SceneStyle[];
    if (group === 'yours') l = yours;
    else if (STYLE_GROUPS.some((g) => g.id === group)) l = pickIds(STYLE_GROUPS.find((g) => g.id === group)!.styles);
    else {
      const ordered = pickIds(STYLE_GROUPS.flatMap((x) => x.styles));
      l = [...yours, ...ordered, ...props.styles.filter((s) => !s.custom && !ordered.includes(s))];
    }
    return searchStyles(l, query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, query, props.styles]);
  const style = props.styles.find((s) => s.id === picked) ?? null;
  const forAi = !!style && props.aiStyle === style.id;

  const download = (s: SceneStyle) => {
    const f = styleFile(s);
    const url = URL.createObjectURL(new Blob([f.text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <dialog ref={ref} className="export style-lib-dialog" aria-labelledby="style-lib-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="style-lib-title">Style library</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <div className="style-lib-tools">
          <label className="sr-only" htmlFor="style-lib-search">Search the styles</label>
          <input id="style-lib-search" ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off"
            placeholder="Search: chalk, retro, film, data, hand-drawn…" />
          <div className="gallery-filters" role="group" aria-label="Show styles">
            {[{ id: 'all', label: `All ${props.styles.length}` }, ...groups].map((g) => (
              <button key={g.id} type="button" className={group === g.id ? 'on' : ''} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>
            ))}
          </div>
        </div>
        <div className="style-lib-body">
          <div className="style-lib-grid-wrap">
            {list.length ? (
              <ul className="gallery-grid style-lib-grid">
                {list.map((s) => <Tile key={s.id} style={s} selected={s.id === picked} onPick={(x) => pick(x.id)} />)}
              </ul>
            ) : (
              <p className="style-lib-empty">No style matches “{query}”. Try another word, or <button type="button" className="link-btn" onClick={() => { setQuery(''); setGroup('all'); }}>show them all</button>.</p>
            )}
          </div>
          <aside ref={detailRef} className="style-lib-detail" aria-label={style ? style.name : 'Your styles'}>
            {editing ? (
              <BrandEditor style={editing === 'new' ? undefined : editing} onCancel={() => setEditing(null)}
                onSave={(s) => { props.onUpsert(s); setEditing(null); setPicked(s.id); }} />
            ) : style ? (
              <>
                <div className="style-lib-big"><span className="gallery-frame" style={{ background: style.palette.background }}><Live key={style.id} style={style} /></span></div>
                <h3>{style.name}{style.brand ? <span className="style-tag">Brand</span> : style.custom ? <span className="style-tag">Yours</span> : null}{forAi ? <span className="style-tag ai">AI</span> : null}</h3>
                <p>{style.description}</p>
                {style.guide && <p className="style-lib-signs">{style.guide.signs}</p>}
                <p className="style-lib-fonts">
                  <span className="style-swatches" aria-hidden="true">{[style.palette.text, style.palette.muted, style.palette.accent, style.palette.accent2].filter(Boolean).map((c, i) => <i key={i} style={{ background: c }} />)}</span>
                  {style.fonts.heading}{style.fonts.body !== style.fonts.heading ? ` + ${style.fonts.body}` : ''}
                </p>
                <button type="button" className="btn primary" onClick={() => props.onStart(style)}>Start something new in it</button>
                {props.hasScene && (
                  <fieldset className="style-parts">
                    <legend>Apply to this scene</legend>
                    {([['look', 'Colours and fonts'], ['motion', 'Motion'], ['sound', 'Sounds']] as const).map(([k, label]) => (
                      <label key={k}><input type="checkbox" checked={parts[k]} onChange={(e) => setParts({ ...parts, [k]: e.target.checked })} /> {label}</label>
                    ))}
                    <button type="button" className="btn small" disabled={!parts.look && !parts.motion && !parts.sound} onClick={() => props.onApply(style, parts)}>Apply</button>
                  </fieldset>
                )}
                <div className="style-btns">
                  <button type="button" className={`btn small${forAi ? ' on' : ''}`} aria-pressed={forAi} onClick={() => props.onUseForAi(forAi ? null : style.id)}
                    title="AI assist follows this style when it makes or changes a scene">{forAi ? '✓ Used by AI assist' : 'Use with AI assist'}</button>
                  {style.custom && <button type="button" className="btn small" onClick={() => setEditing(style)}>Edit</button>}
                  <button type="button" className="btn small" onClick={() => download(style)} title="Download it as a file to share (Import a style reads it)">Export</button>
                  {style.custom && <button type="button" className="btn small ghost danger" onClick={() => { props.onDelete(style.id); setPicked(null); }}>Delete</button>}
                </div>
              </>
            ) : (
              <div className="style-lib-hint">
                <p>Pick a style to see it large, with what you can do with it. Hover any style to watch it move.</p>
                <p>Your own look:</p>
                <div className="style-btns">
                  <button type="button" className="btn small primary" onClick={() => setEditing('new')}>Create a brand kit</button>
                  <button type="button" className="btn small" onClick={() => importRef.current?.click()} title="A .style.json file someone shared">Import a style</button>
                </div>
                <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  try { const s = readStyleFile(await file.text()); props.onUpsert(s); setPicked(s.id); setFileError(null); } catch (err) { setFileError((err as Error).message); }
                }} />
                {fileError && <p className="export-error" role="alert">{kitify(fileError)}</p>}
                <p className="assist-faint">To keep the look of the scene you have, use Save this scene as a style in the Styles panel.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </dialog>
  );
}
