import { useEffect, useMemo, useRef, useState } from 'react';
import { CAPABILITIES, CAPABILITY_GROUPS, setTipsOff, type Capability, type CapabilityAction } from '../lib/capabilities';

const DOCS = 'https://docs.unysonplus.com/kinetic-scenes/';
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Copies the prompt and says so for a moment. */
function CopyPrompt(props: { prompt: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.prompt); setDone(true); setTimeout(() => setDone(false), 1600); } catch { /* blocked: the prompt is on screen */ }
  };
  return (
    <div className="cap-prompt">
      <span><em>Ask your AI:</em> {props.prompt}</span>
      <button type="button" className="btn small ghost" onClick={copy} aria-live="polite">{done ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

/** One capability: what it is, a way to try it, a prompt for the AI, the manual, and its short when there is one. */
function CapabilityCard(props: { c: Capability; onTry: (a: CapabilityAction) => void; onVideo: (c: Capability) => void; compact?: boolean }) {
  const { c } = props;
  return (
    <div className={`cap-card${props.compact ? ' is-compact' : ''}`}>
      {c.video && (
        <button type="button" className="cap-thumb" onClick={() => props.onVideo(c)} aria-label={`Watch: ${c.title}`}>
          <img src={thumb(c.video)} alt="" loading="lazy" width={96} height={170} /><span aria-hidden="true">▶</span>
        </button>
      )}
      <div className="cap-words">
        <strong>{c.title}{c.kit && <span className="cap-kit" title="Needs the free AI Dev Kit on this computer">AI Dev Kit</span>}</strong>
        <p>{c.text}</p>
        {c.prompt && <CopyPrompt prompt={c.prompt} />}
        <div className="cap-actions">
          {c.action && <button type="button" className="btn small" onClick={() => props.onTry(c.action!)}>Show me</button>}
          <a href={`${DOCS}${c.doc}`} target="_blank" rel="noopener noreferrer">How it works</a>
        </div>
      </div>
    </div>
  );
}

/** A capability's short, vertical, from YouTube (privacy-enhanced embed, loaded only while open). */
export function TipVideoDialog(props: { tip: Capability | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.tip && !d.open) d.showModal();
    if (!props.tip && d.open) d.close();
  }, [props.tip]);
  const id = props.tip?.video;
  return (
    <dialog ref={ref} className="export tip-video-dialog" aria-labelledby="tip-video-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="tip-video-title">{props.tip?.title ?? ''}</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <div className="tip-video">
          {id && <iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&iv_load_policy=3`} title={props.tip?.title ?? 'Video'} loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
        </div>
        {id && <a className="btn small ghost" href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>}
      </div>
    </dialog>
  );
}

/** Help › What Kinetic Scenes can do: everything, by group, searchable. */
export function CapabilitiesDialog(props: { open: boolean; onClose: () => void; onTry: (a: CapabilityAction) => void; onVideo: (c: Capability) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);
  const found = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return CAPABILITIES.filter((c) => words.every((w) => `${c.title} ${c.text} ${c.prompt ?? ''} ${c.group}`.toLowerCase().includes(w)));
  }, [q]);
  return (
    <dialog ref={ref} className="export addons cap-dialog" aria-labelledby="cap-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="cap-title">What Kinetic Scenes can do</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="field-hint">{CAPABILITIES.length} things you can make, by hand or by asking your AI. Copy a prompt and give it to Claude (through the AI Dev Kit) or to AI assist.</p>
        <label className="sr-only" htmlFor="cap-search">Search what it can do</label>
        <input id="cap-search" type="search" className="cap-search" placeholder="Search: voice, 3D, captions, website…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="cap-groups">
          {CAPABILITY_GROUPS.map((g) => {
            const list = found.filter((c) => c.group === g);
            if (!list.length) return null;
            return (
              <section key={g}>
                <h3>{g}</h3>
                {list.map((c) => <CapabilityCard key={c.id} c={c} onTry={props.onTry} onVideo={props.onVideo} />)}
              </section>
            );
          })}
          {!found.length && <p className="field-hint">Nothing matches "{q}". Try fewer words.</p>}
        </div>
      </div>
    </dialog>
  );
}

/** The start box's "Did you know?": one capability per visit for people who have been here before. */
export function TipCard(props: { tip: Capability; onTry: (a: CapabilityAction) => void; onVideo: (c: Capability) => void; onAll: () => void; onNext: () => void; onOff: () => void }) {
  const { tip } = props;
  return (
    <section className="start-tip" aria-label="Did you know?">
      <span className="start-tip__tag">Did you know?</span>
      <CapabilityCard c={tip} onTry={props.onTry} onVideo={props.onVideo} compact />
      <div className="start-tip__foot">
        <button type="button" className="link-btn" onClick={props.onNext}>Another tip</button>
        <button type="button" className="link-btn" onClick={props.onAll}>Everything it can do</button>
        <button type="button" className="link-btn start-tip__off" onClick={() => { setTipsOff(true); props.onOff(); }}>Hide tips</button>
      </div>
    </section>
  );
}
