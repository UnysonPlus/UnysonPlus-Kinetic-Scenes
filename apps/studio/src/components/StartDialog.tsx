import { useEffect, useRef, useState, type ReactNode } from 'react';
import { kitStatus, type KitStatus } from '../lib/ai';
import { listProjects, workspaceAvailable, type ProjectInfo } from '../lib/workspace';
import { PAPER_BRIEF, START_FORMATS, START_LENGTHS, setStartHidden, startHidden, startRequest, startUrl, type StartFormat } from '../lib/start';
import type { SceneStyle } from '../lib/styles';
import { KIT_REPO } from './GetKit';
import { WHATS_NEW } from '../lib/whatsNew';
import { StyleGallery } from './StyleGallery';

/** The done-for-you video service, on the Unyson+ site. */
const DFY_URL = 'https://www.unysonplus.com/videos/?utm_source=kinetic-scenes&utm_medium=start-screen';

type Needs = 'ai' | 'kit';
export type StartAction = 'video' | 'like' | 'recording' | 'sheet' | 'templates' | 'blank' | 'file' | 'paper-template';
interface Option { id: string; title: string; text: string; icon: ReactNode; needs?: Needs; action: StartAction | 'website' }

const icon = (d: ReactNode) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;

const HAVE: Option[] = [
  { id: 'website', title: 'A website', text: 'Its real words, colours, fonts and screenshots.', needs: 'ai', action: 'website',
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>) },
  { id: 'video', title: 'A long video', text: 'The best moments, cut into a reel.', needs: 'kit', action: 'video',
    icon: icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9.5v5l4.5-2.5z" /></>) },
  { id: 'like', title: 'A video you like', text: 'Yours, made the same way with your own words.', needs: 'kit', action: 'like',
    icon: icon(<path d="M12 20s-7.5-4.6-9-9.2C2 7.6 4 5 6.8 5c2 0 3.7 1 5.2 3 1.5-2 3.2-3 5.2-3C20 5 22 7.6 21 10.8 19.5 15.4 12 20 12 20z" />) },
  { id: 'recording', title: 'A screen recording', text: 'A product tour from an AI Dev Kit recording.', action: 'recording',
    icon: icon(<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /><circle cx="12" cy="10.5" r="2.5" /></>) },
];

const DESIGN: Option[] = [
  { id: 'templates', title: 'A template', text: 'A finished scene to change: hero, promo, explainer and more.', action: 'templates',
    icon: icon(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></>) },
  { id: 'blank', title: 'An empty scene', text: 'Build it yourself on the timeline.', action: 'blank',
    icon: icon(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 8.5v7M8.5 12h7" /></>) },
  { id: 'sheet', title: 'A spreadsheet', text: 'One design, a video for every row.', action: 'sheet',
    icon: icon(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M4 15h16M10 4v16" /></>) },
  { id: 'file', title: 'A saved scene file', text: 'Open a scene you downloaded.', action: 'file',
    icon: icon(<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />) },
];

const ago = (t: number) => {
  const m = (Date.now() - t) / 60000;
  const days = Math.round(m / 1440);
  return m < 2 ? 'just now' : m < 60 ? `${Math.round(m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : days === 1 ? 'yesterday' : `${days} days ago`;
};

/** What a choice still needs, in words; nothing when it is ready to use. */
function missing(needs: Needs | undefined, status: KitStatus): string {
  if (!needs || status.state === 'checking' || status.state === 'ready') return '';
  if (status.state === 'off') return needs === 'ai' ? 'Turn on AI in the kit' : '';
  return 'Needs the AI Dev Kit';
}

/**
 * The start screen: what do you want to make? It opens with the Studio (and from File › Start something new), gathers
 * the ways to begin that otherwise sit in different menus, and shows where the person left off. Describing it or giving
 * a website goes through one more step (format, length, style); the rest open their own dialogs.
 */
export function StartDialog(props: {
  open: boolean;
  onClose: () => void;
  status: KitStatus;
  /** The scene in the Studio, to carry on with. Empty when it is only the demo or nothing. */
  currentTitle: string;
  projectOpen: boolean;
  /** The project agent can build it (Claude Code, through the AI Dev Kit): voice and music can be asked for too. */
  agent: boolean;
  styles: SceneStyle[];
  styleId: string | null;
  onAi: (request: ReturnType<typeof startRequest>, format: StartFormat, styleId: string | null) => void;
  onAction: (action: StartAction) => void;
  onProject: (id: string) => void;
  onAllProjects: () => void;
  onNews: () => void;
  /** A new scene in this style, with no AI. */
  onStyleNew: (style: SceneStyle) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<'pick' | 'describe' | 'website' | 'paper' | 'style'>('pick');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [formatId, setFormatId] = useState(START_FORMATS[0].id);
  const [seconds, setSeconds] = useState(30);
  const [styleId, setStyleId] = useState<string | null>(props.styleId);
  const [voice, setVoice] = useState(false);
  const [music, setMusic] = useState(false);
  const [projects, setProjects] = useState<ProjectInfo[] | null>(null);
  const [hidden, setHidden] = useState(startHidden);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) {
      d.showModal();
      setStep('pick');
      setHidden(startHidden());
      setStyleId(props.styleId);
      kitStatus().then(() => workspaceAvailable()).then((ok) => (ok ? listProjects() : null))
        .then((r) => setProjects(r ? [...r.projects].sort((a, b) => b.updated - a.updated).slice(0, 4) : null)).catch(() => setProjects(null));
    }
    if (!props.open && d.open) d.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  // Into the first field of each step (autoFocus would run before the dialog opens, and be lost).
  useEffect(() => {
    if (props.open) ref.current?.querySelector<HTMLElement>('input:not([type="checkbox"]):not([type="radio"]), textarea')?.focus();
  }, [props.open, step]);

  const format = START_FORMATS.find((f) => f.id === formatId) ?? START_FORMATS[0];
  const picked = props.styles.find((s) => s.id === styleId) ?? null;
  const goodUrl = startUrl(url);
  const canCreate = step === 'website' ? !!goodUrl : !!text.trim();
  const create = () => {
    if (!canCreate) return;
    props.onAi(startRequest({ text, url: step === 'website' ? goodUrl! : undefined, format, seconds: format.video ? seconds : 0, voice: props.agent && !!format.video && voice, music: props.agent && !!format.video && music, extra: step === 'paper' ? PAPER_BRIEF : undefined }), format, step === 'paper' ? 'paper' : styleId);
    setText('');
    setUrl('');
  };
  const choose = (o: Option) => { if (o.action === 'website') { setText(''); setStep('website'); } else props.onAction(o.action); };
  const aiNeed = missing('ai', props.status);

  const options = (title: string, list: Option[]) => (
    <section className="start-group" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {list.map((o) => {
          const need = missing(o.needs, props.status);
          return (
            <li key={o.id}>
              <button type="button" className="start-option" onClick={() => choose(o)}>
                <span className="start-icon">{o.icon}</span>
                <span className="start-words"><strong>{o.title}</strong><span>{o.text}</span>{need && <em>{need}</em>}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <dialog ref={ref} className={`export start-dialog${step === 'pick' ? '' : ' is-step'}`} aria-labelledby="start-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="start-title">{step === 'pick' ? 'What do you want to make today?' : step === 'style' ? `Make it in ${picked?.name ?? 'this style'}` : step === 'website' ? 'Make it from a website' : step === 'paper' ? 'A paper cut-out explainer' : 'Make it from your idea'}</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>

        {step === 'pick' ? (
          <div className="start-body">
            <div className="start-main">
              <form className="start-describe" onSubmit={(e) => { e.preventDefault(); if (text.trim()) setStep('describe'); }}>
                <label htmlFor="start-idea">Describe it</label>
                <div className="start-describe-row">
                  <input id="start-idea" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off"
                    placeholder="A reel showing how to book an appointment in two taps" />
                  <button type="submit" className="btn primary" disabled={!text.trim()}>Continue</button>
                </div>
                {aiNeed && <p className="start-need">{aiNeed}: the AI builds this one.</p>}
              </form>
              {options('Start from something you have', HAVE)}
              {options('Start from a design', DESIGN)}
              <StyleGallery styles={props.styles} onPick={(s) => { setText(''); if (s.id === 'paper') setStep('paper'); else { setStyleId(s.id); setStep('style'); } }} />
            </div>
            <aside className="start-side" aria-label="Pick up where you left off">
              {/* The done-for-you service: for people who would rather have the video made for them. */}
              <a className="start-dfy" href={DFY_URL} target="_blank" rel="noopener">
                <span className="start-dfy__tag"><span className="start-dfy__dot" aria-hidden="true" />Done for you</span>
                <strong>No time to make it? We make it for you.</strong>
                <span>Short videos and reels for your business, from the photos you already have. From US$5 a video.</span>
                <span className="start-dfy__go">See how it works <span className="start-dfy__arrow" aria-hidden="true">→</span></span>
              </a>
              <h3>Pick up where you left off</h3>
              {props.currentTitle && (
                <button type="button" className="start-recent" onClick={props.onClose}>
                  <strong>{props.currentTitle}</strong><span>{props.projectOpen ? 'Open now' : 'In this browser'}</span>
                </button>
              )}
              {projects?.filter((p) => p.title !== props.currentTitle).map((p) => (
                <button key={p.id} type="button" className="start-recent" onClick={() => props.onProject(p.id)}>
                  <strong>{p.title || p.id}</strong><span>{Math.round(p.duration)} s, {ago(p.updated)}</span>
                </button>
              ))}
              {projects ? <button type="button" className="link-btn" onClick={props.onAllProjects}>All projects</button> : (
                <p className="start-note">
                  Scenes stay in this browser. To keep projects in folders on this computer,{' '}
                  <a href={KIT_REPO} target="_blank" rel="noopener noreferrer">get the free AI Dev Kit</a>.
                </p>
              )}
              <h3 className="start-news-h">New</h3>
              {WHATS_NEW.slice(0, 3).map((n) => (
                <button key={n.id} type="button" className="start-recent" onClick={props.onNews}><strong>{n.title}</strong><span>{n.short}</span></button>
              ))}
              <button type="button" className="link-btn" onClick={props.onNews}>See what's new</button>
            </aside>
          </div>
        ) : (
          <form className="start-form" onSubmit={(e) => { e.preventDefault(); create(); }}>
            {step === 'website' ? (
              <>
                <label htmlFor="start-url">Website address</label>
                <input id="start-url" type="text" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="your-product.com" autoComplete="off" />
                {url.trim() && !goodUrl && <p className="export-warn">That does not look like a web address yet.</p>}
                <label htmlFor="start-focus">What should it focus on? (optional)</label>
                <textarea id="start-focus" className="notes-text" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="The pricing, and why it is free" />
              </>
            ) : (
              <>
                {picked && step === 'style' && (
                  <div className="start-picked">
                    {!picked.custom && <img src={`${import.meta.env.BASE_URL}styles/${picked.id}.jpg`} alt="" width={320} height={180} />}
                    <p>{picked.description}</p>
                  </div>
                )}
                <label htmlFor="start-about">{step === 'paper' ? 'What should it explain?' : 'What it is about'}</label>
                <textarea id="start-about" className="notes-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
              </>
            )}
            <fieldset className="start-formats">
              <legend>Format</legend>
              {START_FORMATS.map((f) => (
                <label key={f.id} className={f.id === formatId ? 'on' : ''}>
                  <input type="radio" name="start-format" className="sr-only" checked={f.id === formatId} onChange={() => setFormatId(f.id)} />
                  <strong>{f.label}</strong><span>{f.hint}</span>
                </label>
              ))}
            </fieldset>
            <div className="start-pair">
              {format.video && (
                <label>Length
                  <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
                    <option value={0}>Let the AI choose</option>
                    {START_LENGTHS.map((s) => <option key={s} value={s}>{s} seconds</option>)}
                  </select>
                </label>
              )}
              {step !== 'paper' && (
                <label>Style
                  <select value={styleId ?? ''} onChange={(e) => setStyleId(e.target.value || null)}>
                    <option value="">Let the AI choose</option>
                    {props.styles.map((s) => <option key={s.id} value={s.id}>{s.name}{s.custom ? ' (yours)' : ''}</option>)}
                  </select>
                </label>
              )}
            </div>
            {props.agent && format.video && (
              <div className="start-sound">
                <label><input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} /> Add a voice-over</label>
                <label><input type="checkbox" checked={music} onChange={(e) => setMusic(e.target.checked)} /> Add music</label>
              </div>
            )}
            {props.agent && <p className="start-note">Create makes a new project and your AI agent builds it there, step by step. You can stop it at any time, and it never renders a video.</p>}
            {aiNeed && <p className="start-need">{aiNeed}. AI assist shows how to connect it, and your request waits there.</p>}
            <div className="start-actions">
              <button type="button" className="btn" onClick={() => setStep('pick')}>Back</button>
              {step === 'paper' && <button type="button" className="btn start-alt" onClick={() => props.onAction('paper-template')}>Start from the template</button>}
              {step === 'style' && picked && <button type="button" className="btn start-alt" onClick={() => props.onStyleNew(picked)}>Start with a title card</button>}
              <button type="submit" className="btn primary" disabled={!canCreate}>Create</button>
            </div>
          </form>
        )}

        {step === 'pick' && (
          <label className="start-again">
            <input type="checkbox" checked={!hidden} onChange={(e) => { setHidden(!e.target.checked); setStartHidden(!e.target.checked); }} />
            Show this when the Studio opens
          </label>
        )}
      </div>
    </dialog>
  );
}
