import { useRef, useState } from 'react';
import { BUILT_IN_STYLES, type SceneStyle } from '../lib/styles';
import { formFromStyle, readLogo, styleFromForm, type BrandForm } from '../lib/brand';

const BLANK: BrandForm = {
  name: '', background: '#0b0f14', text: '#f4f6f8', muted: '#9aa7b4', accent: '#2ad38b', heading: 'Archivo', body: 'Inter',
  headingWeight: 800, bodyWeight: 400, uppercase: false, personality: BUILT_IN_STYLES[0].id,
};

const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];

/** The brand kit editor: your logo, colours and fonts, moving like a style you pick. */
export function BrandEditor(props: { style?: SceneStyle; onSave: (style: SceneStyle) => void; onCancel: () => void }) {
  const [f, setF] = useState<BrandForm>(() => (props.style ? formFromStyle(props.style) : BLANK));
  const [error, setError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<BrandForm>) => setF((x) => ({ ...x, ...patch }));
  const colour = (key: 'background' | 'text' | 'muted' | 'accent' | 'accent2', label: string, optional = false) => (
    <label className="brand-field">
      <span>{label}</span>
      <span className="brand-colour">
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(f[key] ?? '') ? (f[key] as string) : '#000000'} onChange={(e) => set({ [key]: e.target.value })} aria-label={`${label} colour`} />
        <input type="text" value={f[key] ?? ''} placeholder={optional ? 'none' : ''} onChange={(e) => set({ [key]: e.target.value || (optional ? undefined : '') })} aria-label={label} />
      </span>
    </label>
  );
  return (
    <form className="brand-editor" onSubmit={(e) => { e.preventDefault(); props.onSave(styleFromForm(f, props.style?.id)); }}>
      <h4>{props.style ? `Edit ${props.style.name}` : 'Your brand kit'}</h4>
      <label className="brand-field wide"><span>Name</span><input value={f.name} maxLength={40} placeholder="My brand" onChange={(e) => set({ name: e.target.value })} required /></label>

      <div className="brand-logo">
        {f.logo ? <img src={f.logo} alt="Your logo" /> : <span className="brand-nologo">No logo</span>}
        <div>
          <button type="button" className="btn small" onClick={() => logoRef.current?.click()}>{f.logo ? 'Change logo' : 'Add your logo'}</button>
          {f.logo && <button type="button" className="btn small ghost" onClick={() => set({ logo: undefined })}>Remove</button>}
          <p className="field-hint">An SVG or a PNG with a see-through background, up to 1.5 MB.</p>
        </div>
        <input ref={logoRef} type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" hidden onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          try { set({ logo: await readLogo(file) }); setError(null); } catch (err) { setError((err as Error).message); }
        }} />
      </div>

      <div className="brand-grid">
        {colour('background', 'Background')}
        {colour('text', 'Text')}
        {colour('muted', 'Secondary text')}
        {colour('accent', 'Accent')}
        {colour('accent2', 'Second accent', true)}
      </div>

      <div className="brand-grid">
        <label className="brand-field"><span>Headline font</span><input value={f.heading} onChange={(e) => set({ heading: e.target.value })} placeholder="A Google Font" /></label>
        <label className="brand-field"><span>Weight</span><select value={f.headingWeight} onChange={(e) => set({ headingWeight: Number(e.target.value) })}>{WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}</select></label>
        <label className="brand-field"><span>Text font</span><input value={f.body} onChange={(e) => set({ body: e.target.value })} placeholder="A Google Font" /></label>
        <label className="brand-field"><span>Weight</span><select value={f.bodyWeight} onChange={(e) => set({ bodyWeight: Number(e.target.value) })}>{WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}</select></label>
      </div>
      <label className="check"><input type="checkbox" checked={f.uppercase} onChange={(e) => set({ uppercase: e.target.checked })} /> Headlines in capitals</label>

      <label className="brand-field wide">
        <span>Moves like</span>
        <select value={f.personality} onChange={(e) => set({ personality: e.target.value })}>
          {BUILT_IN_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}: {s.description}</option>)}
        </select>
      </label>
      <p className="field-hint">Fonts come from Google Fonts by name (as written there: "Space Grotesk", "DM Serif Display"). The motion and sounds are the chosen style's.</p>
      {error && <p className="export-error" role="alert">{error}</p>}
      <div className="style-btns">
        <button type="submit" className="btn small primary">Save brand kit</button>
        <button type="button" className="btn small ghost" onClick={props.onCancel}>Cancel</button>
      </div>
    </form>
  );
}
