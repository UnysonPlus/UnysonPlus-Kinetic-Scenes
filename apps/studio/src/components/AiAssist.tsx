import { applySteps } from '../lib/tour';
import { suggestPoster } from '../lib/poster';
import { musicCues } from '../lib/beats';
import { landOnWords } from '../lib/voiceScene';
import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { lintScene } from '@unysonplus/scene-player/lint';
import { askForScene, type KitStatus } from '../lib/ai';
import { applyStyle, styleBrief, type SceneStyle } from '../lib/styles';

const GUIDE = 'https://docs.unysonplus.com/guides/set-up-ai-for-unysonplus';
const KIT_REPO = 'https://github.com/UnysonPlus/UnysonPlus-AI-Dev-Kit';

const START_IDEAS = [
  'A bold launch hero for a new running shoe: dark background, neon green accent, the headline "Run lighter." and a short supporting line.',
  'A calm hero for a yoga studio: soft sand and sage colours, "Breathe in." arriving word by word, gentle floating circles.',
  'An event banner: "Doors open 8 PM" with the time scrambling in, and a pink line that grows underneath.',
];
const REFINE_IDEAS = [
  'Make the headline land harder',
  'Give everything a clean exit at the end',
  'Tighten the timing so it finishes sooner',
  'Add a soft background shape that drifts slowly',
];
const SELECTION_IDEAS = ['Make this enter more boldly', 'Make this calmer and slower', 'Stagger these one after another'];

export type Scope = 'new' | 'scene' | 'selection';

/** A request handed to AI assist from elsewhere in the Studio (Check scene, a voice-over). */
export type QueuedRequest = string | {
  text: string;
  /** Instructions added to the rules for this request. */
  brief?: string;
  /** Data for the request (a voice-over's timed words). */
  context?: string;
  /** The voice-over a scene was made from: reveals are then landed on their words. */
  voiceClip?: string;
  /** The scene the AI starts from (instead of the current one). */
  base?: Scene;
};

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai' | 'error';
  text: string;
  /** User turns: what the request applied to. */
  scope?: Scope;
  /** AI turns that changed the scene: the scene before, for "Go back". */
  before?: Scene;
  after?: Scene;
  /** AI turns: how many Check scene items the result has. */
  issues?: number;
  model?: string;
}

/** Who is answering, for the connection line (naming the AI at work is part of the product). */
export function aiName(s: KitStatus): string {
  if (s.state !== 'ready') return '';
  if (s.backend === 'claude-code') return 'Claude, your Claude subscription';
  if (s.backend === 'api') return 'Claude, through your API key';
  if (s.backend === 'ollama') return `${s.model || 'a local model'}, running on this computer`;
  return s.model || 'your AI';
}

/**
 * AI assist: a floating button over the stage that opens a chat with the AI Dev Kit. Each answer is
 * a change to the scene (one undo step, plus "Go back" on the message), checked by Check scene, so
 * the work continues by hand or with another request.
 */
export function AiAssist(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: KitStatus;
  onRecheck: () => void;
  scene: Scene;
  selection: string[];
  /** Check scene items on the current scene, for the badge. */
  problems: number;
  messages: ChatMessage[];
  onMessages: (update: (list: ChatMessage[]) => ChatMessage[]) => void;
  /** A request queued from elsewhere (Check scene's "Fix with AI", a voice-over). */
  queued: QueuedRequest | null;
  onQueuedTaken: () => void;
  onApply: (scene: Scene, mode: 'create' | 'edit') => void;
  onRestore: (scene: Scene, current: Scene) => void;
  onShowCheck: () => void;
  /** Styles to choose from, and the one the AI follows. */
  styles: SceneStyle[];
  styleId: string | null;
  onStyleChange: (id: string | null) => void;
}) {
  const { status, scene, messages } = props;
  const empty = scene.layers.length === 0;
  const sel = props.selection.length;
  const [scope, setScope] = useState<Scope>(empty ? 'new' : sel ? 'selection' : 'scene');
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const abort = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);

  // Follow the selection: picking layers aims the next request at them.
  useEffect(() => {
    if (busy) return;
    setScope((s) => (empty ? 'new' : sel ? 'selection' : s === 'selection' ? 'scene' : s === 'new' ? 'scene' : s));
  }, [sel, empty, busy]);

  useEffect(() => {
    if (!busy) return;
    const start = Date.now();
    const t = setInterval(() => setElapsed(Math.round((Date.now() - start) / 1000)), 500);
    return () => clearInterval(t);
  }, [busy]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }); }, [messages.length, busy]);
  useEffect(() => { if (props.open) setTimeout(() => inputRef.current?.focus(), 50); }, [props.open]);

  const push = (m: Omit<ChatMessage, 'id'>) => props.onMessages((list) => [...list, { ...m, id: nextId.current++ }].slice(-40));

  const send = async (text: string, useScope: Scope = scope, extra: Exclude<QueuedRequest, string> | null = null) => {
    const ask = text.trim();
    if (!ask || busy) return;
    if (status.state !== 'ready') { props.onRecheck(); return; }
    setPrompt('');
    push({ role: 'user', text: ask, scope: useScope });
    setBusy(true);
    setElapsed(0);
    const ctl = new AbortController();
    abort.current = ctl;
    const before = scene;
    try {
      const mode = useScope === 'new' ? 'create' : 'edit';
      const style = props.styles.find((s) => s.id === props.styleId) ?? null;
      const brief = [extra?.brief, style ? styleBrief(style) : '', musicCues(extra?.base ?? before)].filter(Boolean).join('\n\n') || undefined;
      const r = await askForScene({ mode, prompt: ask, scene: extra?.base ?? before, selection: useScope === 'selection' ? props.selection : [], signal: ctl.signal, brief, context: extra?.context });
      // A scene built from a base (a voice-over) gets the style's exact colours and fonts too.
      if (style && extra?.base) r.scene = applyStyle(r.scene, style, { look: true, motion: false, sound: false });
      // A new scene in a style gets exactly the style's colours and fonts.
      if (style && mode === 'create') r.scene = applyStyle(r.scene, style, { look: true, motion: false, sound: false });
      // A new scene gets the best still frame, whatever moment the AI guessed.
      if (mode === 'create') r.scene = { ...r.scene, playback: { ...r.scene.playback, posterTime: suggestPoster(r.scene) } };
      // A walkthrough the AI wrote as steps becomes clips and markers.
      if (r.scene.steps?.length) r.scene = applySteps(r.scene).scene;
      // A scene made from a voice-over: each reveal finishes on the word it shows.
      if (extra?.voiceClip) {
        const vc = r.scene.audio?.find((a) => a.id === extra.voiceClip);
        if (vc) r.scene = landOnWords(r.scene, vc);
      }
      props.onApply(r.scene, mode);
      const found = lintScene(r.scene).length;
      push({
        role: 'ai',
        text: `${r.explanation || (mode === 'create' ? 'Here is a new scene.' : 'Done.')}${r.repaired ? ' (The first answer needed fixing; this is the corrected one.)' : ''}`,
        before, after: r.scene, issues: found, model: r.model,
      });
    } catch (e) {
      if ((e as Error).name === 'AbortError') push({ role: 'error', text: 'Stopped. The scene was not changed.' });
      else push({ role: 'error', text: (e as Error).message });
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  // "Fix with AI" from Check scene.
  useEffect(() => {
    // Waits until the AI is connected, so a queued request is never dropped.
    if (!props.queued || busy || !props.open || status.state !== 'ready') return;
    const q = props.queued;
    props.onQueuedTaken();
    if (typeof q === 'string') send(q, 'scene');
    else send(q.text, 'scene', q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.queued, props.open, busy, status.state]);

  const ready = status.state === 'ready';
  const ideas = scope === 'new' ? START_IDEAS : scope === 'selection' ? SELECTION_IDEAS : REFINE_IDEAS;

  return (
    <div className="assist">
      {props.open && (
        <section className="assist-panel" role="dialog" aria-label="AI assist" onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); props.onOpenChange(false); } }}>
          <header className="assist-head">
            <strong><span className="assist-spark" aria-hidden="true">✦</span> AI assist</strong>
            <span className="assist-beta">Alpha</span>
            {messages.length > 0 && !busy && <button type="button" className="link-btn" onClick={() => props.onMessages(() => [])}>New chat</button>}
            <button type="button" className="assist-close" aria-label="Close AI assist" onClick={() => props.onOpenChange(false)}>×</button>
          </header>

          <div className={`assist-conn is-${status.state}`} role="status">
            {status.state === 'checking' && <span>Looking for the AI Dev Kit on this computer…</span>}
            {status.state === 'ready' && <span><strong>Connected:</strong> {aiName(status)}, through the AI Dev Kit {status.version}.</span>}
            {status.state === 'off' && <span>The AI Dev Kit is running, but no AI is set up in it. Open its dashboard (localhost:4600) and connect one in Settings.</span>}
            {status.state === 'outdated' && <span>Your AI Dev Kit needs an update for the Studio. Close it and start it again (start.bat or start.command): it updates itself.</span>}
            {status.state === 'missing' && (
              <span>
                AI assist runs through the <a href={KIT_REPO} target="_blank" rel="noopener noreferrer"><strong>AI Dev Kit</strong></a> on your computer, with your own AI.{' '}
                <a href={GUIDE} target="_blank" rel="noopener noreferrer">Set it up</a>, start it (start.bat or start.command), then
                check again. If the browser asks to let this site reach apps on your device, choose <strong>Allow</strong>.
              </span>
            )}
            {status.state === 'blocked' && (
              <span>
                Your browser is stopping this site from reaching the AI Dev Kit. Click the icon left of the address, allow
                <strong> apps on this device</strong> (local network access), then check again.
              </span>
            )}
            {status.state !== 'checking' && status.state !== 'ready' && <button type="button" className="btn small" onClick={props.onRecheck}>Check again</button>}
          </div>

          <div className="assist-log" ref={logRef} aria-live="polite">
            {messages.length === 0 && (
              <div className="assist-intro">
                <p>{scope === 'new'
                  ? 'Describe the animation you want. The AI builds it from the presets, so you can change every part afterwards.'
                  : 'Ask for a change. The AI edits the scene like you would, one undo step at a time. Select layers first to change only those.'}</p>
                <div className="assist-ideas">
                  {ideas.map((i) => <button key={i} type="button" className="assist-idea" disabled={!ready || busy} onClick={() => (scope === 'new' ? setPrompt(i) : send(i))}>{i}</button>)}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`assist-msg is-${m.role}`}>
                {m.role === 'user' && m.scope && <span className="assist-scope">{m.scope === 'new' ? 'New scene' : m.scope === 'selection' ? 'Selected layers' : 'This scene'}</span>}
                <p>{m.text}</p>
                {m.role === 'ai' && (
                  <div className="assist-msg-actions">
                    {!!m.issues && (
                      <>
                        <button type="button" className="link-btn" onClick={props.onShowCheck}>Check scene: {m.issues} to look at</button>
                        {m.after === scene && <button type="button" className="link-btn" disabled={busy || !ready} onClick={() => send('Fix the problems Check scene found, changing as little as possible.', 'scene')}>Fix with AI</button>}
                      </>
                    )}
                    {m.before && <button type="button" className="link-btn" disabled={busy} onClick={() => props.onRestore(m.before!, m.after!)}>Go back to before this</button>}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="assist-msg is-ai is-working">
                <p><span className="assist-pulse" aria-hidden="true" /> Working… {elapsed}s <span className="assist-faint">(usually one to three minutes)</span></p>
                <button type="button" className="link-btn" onClick={() => abort.current?.abort()}>Stop</button>
              </div>
            )}
          </div>

          <form className="assist-form" onSubmit={(e) => { e.preventDefault(); send(prompt); }}>
            <div className="assist-scopes" role="radiogroup" aria-label="What the request changes">
              {(['scene', 'selection', 'new'] as Scope[]).map((s) => {
                const disabled = (s === 'selection' && !sel) || (s === 'scene' && empty) || busy;
                return (
                  <button key={s} type="button" role="radio" aria-checked={scope === s} disabled={disabled}
                    className={`assist-chip${scope === s ? ' on' : ''}`} onClick={() => setScope(s)}>
                    {s === 'scene' ? 'This scene' : s === 'selection' ? (sel ? `Selected (${sel})` : 'Selected') : 'New scene'}
                  </button>
                );
              })}
            </div>
            <div className="assist-style">
              <label htmlFor="assist-style">Style</label>
              <select id="assist-style" value={props.styleId ?? ''} disabled={busy} onChange={(e) => props.onStyleChange(e.target.value || null)}>
                <option value="">None (the AI decides)</option>
                {props.styles.map((s) => <option key={s.id} value={s.id}>{s.name}{s.custom ? ' (yours)' : ''}</option>)}
              </select>
            </div>
            <label htmlFor="assist-input" className="sr-only">Your request</label>
            <textarea
              id="assist-input"
              ref={inputRef}
              rows={3}
              value={prompt}
              disabled={busy}
              placeholder={scope === 'new' ? 'A bold hero for a bakery, warm colours, "Fresh at dawn." rising word by word…' : scope === 'selection' ? 'Make these slam in, one after another…' : 'Slow the ending down and make the headline bigger…'}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(prompt); } }}
            />
            <div className="assist-send-row">
              <span className="assist-faint">{scope === 'new' ? 'Replaces the scene; Undo brings it back.' : 'Enter to send, Shift+Enter for a new line'}</span>
              <button type="submit" className="btn primary small" disabled={!ready || busy || !prompt.trim()}>Send</button>
            </div>
          </form>
        </section>
      )}

      <button type="button" className={`assist-launch${props.open ? ' on' : ''}`} aria-expanded={props.open} onClick={() => props.onOpenChange(!props.open)}
        title={ready ? `AI assist: ${aiName(status)}` : 'AI assist (needs the AI Dev Kit)'}>
        <span className="assist-spark" aria-hidden="true">✦</span> AI assist
        {busy && <span className="assist-pulse" aria-hidden="true" />}
        {!busy && props.problems > 0 && <span className="assist-badge" aria-label={`${props.problems} Check scene items`}>{props.problems}</span>}
      </button>
    </div>
  );
}
