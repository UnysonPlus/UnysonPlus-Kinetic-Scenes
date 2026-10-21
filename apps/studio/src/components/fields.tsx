import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * Inspector form controls. Text and number fields keep their own draft while you type and commit on
 * Enter or when focus leaves, so one edit is one undo step rather than one per keystroke.
 */

export function Field(props: { label: string; children: (id: string) => ReactNode; hint?: string; wide?: boolean }) {
  const id = useId();
  return (
    <div className={`field${props.wide ? ' wide' : ''}`}>
      <label htmlFor={id}>{props.label}</label>
      {props.children(id)}
      {props.hint && <p className="field-hint">{props.hint}</p>}
    </div>
  );
}

const fmt = (n: number | undefined) => (n === undefined || Number.isNaN(n) ? '' : String(Math.round(n * 1000) / 1000));

export function NumberField(props: {
  label: string;
  value: number | undefined;
  onCommit: (v: number | undefined) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  placeholder?: string;
  /** Allow clearing the field (commits undefined). */
  optional?: boolean;
}) {
  const [draft, setDraft] = useState(fmt(props.value));
  useEffect(() => setDraft(fmt(props.value)), [props.value]);
  const clamp = (n: number) => Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, n));
  const commit = (text: string) => {
    const t = text.trim();
    if (t === '') {
      if (props.optional) props.onCommit(undefined);
      else setDraft(fmt(props.value));
      return;
    }
    const n = Number(t);
    if (!Number.isFinite(n)) {
      setDraft(fmt(props.value));
      return;
    }
    const v = clamp(n);
    setDraft(fmt(v));
    if (v !== props.value) props.onCommit(v);
  };
  return (
    <Field label={props.label}>
      {(id) => (
        <div className="num">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={draft}
            placeholder={props.placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
              else if (e.key === 'Escape') setDraft(fmt(props.value));
              else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const step = (props.step ?? 1) * (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? 1 : -1);
                const base = Number(draft);
                commit(String(Math.round(((Number.isFinite(base) ? base : 0) + step) * 1000) / 1000));
              }
            }}
          />
          {props.unit && <span className="unit" aria-hidden="true">{props.unit}</span>}
        </div>
      )}
    </Field>
  );
}

export function TextField(props: { label: string; value: string | undefined; onCommit: (v: string) => void; placeholder?: string; multiline?: boolean; wide?: boolean; mono?: boolean }) {
  const [draft, setDraft] = useState(props.value ?? '');
  useEffect(() => setDraft(props.value ?? ''), [props.value]);
  const commit = () => { if (draft !== (props.value ?? '')) props.onCommit(draft); };
  return (
    <Field label={props.label} wide={props.wide ?? props.multiline}>
      {(id) => props.multiline ? (
        <textarea
          id={id}
          className={props.mono ? 'mono' : undefined}
          rows={3}
          value={draft}
          placeholder={props.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commit(); }}
        />
      ) : (
        <input
          id={id}
          type="text"
          className={props.mono ? 'mono' : undefined}
          value={draft}
          placeholder={props.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') setDraft(props.value ?? '');
          }}
        />
      )}
    </Field>
  );
}

export function SelectField<T extends string>(props: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <Field label={props.label}>
      {(id) => (
        <select id={id} value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
          {props.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
    </Field>
  );
}

export function CheckField(props: { label: string; checked: boolean; onChange: (v: boolean) => void; wide?: boolean }) {
  return (
    <label className={props.wide ? 'check wide' : 'check'}>
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span>{props.label}</span>
    </label>
  );
}

const HEX = /^#[0-9a-f]{6}$/i;
const toHex = (v: string | undefined) => {
  if (!v) return '#ffffff';
  if (HEX.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return null;
};

/** A colour: the picker for plain hex colours, plus a text box for anything CSS accepts (gradients too). */
export function ColorField(props: { label: string; value: string | undefined; onCommit: (v: string) => void; placeholder?: string }) {
  const [draft, setDraft] = useState(props.value ?? '');
  useEffect(() => setDraft(props.value ?? ''), [props.value]);
  const hex = toHex(props.value);
  const picker = useRef<HTMLInputElement>(null);
  const commitRef = useRef(props.onCommit);
  commitRef.current = props.onCommit;
  // The picker reports every colour while it is open ("input") and the final one once ("change");
  // only the final one is committed, so choosing a colour is a single undo step.
  useEffect(() => {
    const el = picker.current;
    if (!el) return;
    const onChange = () => commitRef.current(el.value);
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);
  return (
    <Field label={props.label} wide>
      {(id) => (
        <div className="color">
          <input
            ref={picker}
            type="color"
            aria-label={`${props.label} picker`}
            value={hex ?? '#000000'}
            disabled={hex === null}
            title={hex === null ? 'Not a plain colour: edit it as text' : undefined}
            onChange={(e) => setDraft(e.target.value)}
          />
          <input
            id={id}
            type="text"
            className="mono"
            value={draft}
            placeholder={props.placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => { if (draft !== (props.value ?? '')) props.onCommit(draft); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && draft !== (props.value ?? '')) props.onCommit(draft); }}
          />
        </div>
      )}
    </Field>
  );
}

export function Section(props: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="insp-section">
      <header>
        <h3>{props.title}</h3>
        {props.aside}
      </header>
      <div className="insp-grid">{props.children}</div>
    </section>
  );
}
