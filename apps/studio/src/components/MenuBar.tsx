import { useEffect, useRef, useState } from 'react';

/**
 * The Studio's menu bar (File, Edit, View, Insert, Scene, AI, Tools, Help), like a desktop editor's: click a menu to
 * open it, move along the bar while one is open, arrow keys and Enter inside, Escape to close. On a narrow window it
 * folds into one ☰ button that lists every menu.
 */

export type MenuItem =
  | { label: string; onSelect: () => void; shortcut?: string; disabled?: boolean; checked?: boolean; hint?: string }
  | 'sep';
export interface Menu { label: string; items: MenuItem[] }

export function MenuBar(props: { menus: Menu[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const bar = useRef<HTMLElement>(null);

  // Close on a click outside, or on Escape.
  useEffect(() => {
    if (open === null && !mobile) return;
    const down = (e: PointerEvent) => { if (!bar.current?.contains(e.target as Node)) { setOpen(null); setMobile(false); } };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    window.addEventListener('pointerdown', down, true);
    window.addEventListener('keydown', key, true);
    return () => { window.removeEventListener('pointerdown', down, true); window.removeEventListener('keydown', key, true); };
  }, [open, mobile]);

  // Focus the first item when a menu opens from the keyboard or a click.
  useEffect(() => {
    if (open === null) return;
    bar.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"] .menu-item:not(:disabled)`)?.focus();
  }, [open]);

  const run = (item: Exclude<MenuItem, 'sep'>) => {
    if (item.disabled) return;
    setOpen(null);
    setMobile(false);
    item.onSelect();
  };

  const itemKeys = (e: React.KeyboardEvent, i: number) => {
    const list = [...(e.currentTarget.closest('.menu-pop')?.querySelectorAll<HTMLButtonElement>('.menu-item:not(:disabled)') ?? [])];
    const at = list.indexOf(e.target as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(at + 1) % list.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(at - 1 + list.length) % list.length]?.focus(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setOpen((i + 1) % props.menus.length); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setOpen((i - 1 + props.menus.length) % props.menus.length); }
  };

  const items = (m: Menu, i: number) => (
    <div className="menu-pop" role="menu" aria-label={m.label} onKeyDown={(e) => itemKeys(e, i)}>
      {m.items.map((it, j) => it === 'sep'
        ? <div key={j} className="menu-sep" role="separator" />
        : (
          <button key={j} type="button" role={it.checked === undefined ? 'menuitem' : 'menuitemcheckbox'} aria-checked={it.checked}
            className="menu-item" disabled={it.disabled} title={it.hint} onClick={() => run(it)}>
            <span className="menu-check" aria-hidden="true">{it.checked ? '✓' : ''}</span>
            <span className="menu-label">{it.label}</span>
            {it.shortcut && <kbd className="menu-kbd">{it.shortcut}</kbd>}
          </button>
        ))}
    </div>
  );

  return (
    <nav ref={bar} className="menubar" aria-label="Menu">
      <div className="menubar-wide" role="menubar">
        {props.menus.map((m, i) => (
          <div key={m.label} className="menu" data-menu={i}>
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open === i}
              className={`menu-top${open === i ? ' on' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
              onPointerEnter={() => { if (open !== null && open !== i) setOpen(i); }}
              onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(i); } }}>
              {m.label}
            </button>
            {open === i && items(m, i)}
          </div>
        ))}
      </div>
      <div className="menubar-narrow">
        <button type="button" className={`menu-top menu-burger${mobile ? ' on' : ''}`} aria-expanded={mobile} aria-label="Menu" onClick={() => setMobile((o) => !o)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        {mobile && (
          <div className="menu-sheet" role="menu" aria-label="Menu">
            {props.menus.map((m) => (
              <section key={m.label} className="menu-sheet-group">
                <h4>{m.label}</h4>
                {m.items.filter((it): it is Exclude<MenuItem, 'sep'> => it !== 'sep').map((it, j) => (
                  <button key={j} type="button" role="menuitem" className="menu-item" disabled={it.disabled} onClick={() => run(it)}>
                    <span className="menu-check" aria-hidden="true">{it.checked ? '✓' : ''}</span>
                    <span className="menu-label">{it.label}</span>
                  </button>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
