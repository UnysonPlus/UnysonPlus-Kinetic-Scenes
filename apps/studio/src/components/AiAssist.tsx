import { applySteps } from '../lib/tour';
import { suggestPoster } from '../lib/poster';
import { musicCues } from '../lib/beats';
import { beatsText, landOnWords, voiceBase, voiceBeats, voiceBrief } from '../lib/voiceScene';
import { installVoice, narrationOf, speak, voiceStatus, withVoice } from '../lib/voice';
import { preferredVoice } from '../lib/addons';
import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { lintScene } from '@unysonplus/scene-player/lint';
import { askForPlan, askForQuick, askForReview, askForScene, type KitStatus, type Plan } from '../lib/ai';
import { applyStyle, styleBrief, type SceneStyle } from '../lib/styles';
import { allLayers } from '@unysonplus/scene-player/groups';
import { useFootageSound } from '../lib/footageKit';
import { transcribe, transcribeStatus } from '../lib/transcribe';

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
  /** Only additions are wanted (quicker; the kit returns just what it adds). */
  additions?: boolean;
  /** The scene the AI starts from (instead of the current one). */
  base?: Scene;
  /** A plan the person approved: build it without planning again. */
  approved?: boolean;
  /** Files the AI may place by name ("shot:1"), filled in afterwards. */
  assets?: Map<string, string>;
};

type Kind = 'storyboard' | 'explainer' | 'tutorial';

/** How an approved explainer or tutorial script becomes a scene when there is no voice-over yet. */
/** Editing someone's own footage: captions and effects placed on what is said, the footage untouched. */
const VIDEO_EDIT_BRIEF = `EDIT MY VIDEO (this request): the scene has the person's footage (a "video" layer) and its voice-over with every
word timed (in "context"). Edit it like a short-form video editor:
- Keep the footage layers, their timing and the audio exactly as they are; add layers and clips around them.
- Add a captions layer (if there is none) in the lower-middle, big, motion "slam" or "drop", out of the app's covered areas.
- Place 5 to 10 effects on the moments that suit them, each landing on its word (from "context"): a hook in the first
  two seconds (Kinetic hook piece or Gravity drop on the first key words), a Snap zoom on the footage at a punchline,
  a Colour grade or Grade wipe on a change of mood, Strike or Tick on a list, a Knockout or Fly-in strip for a key
  phrase, Odometer for a number, the Comment box piece (comment call to action) at the end if they ask for comments.
- Name effects only from PRESETS; build pieces from layers. Vary them: never the same effect twice in a row.
- Short clips: entrances 0.25-0.6 s, then hold while the word is said; nothing covers the face for long.`;

const EXPLAINER_BRIEF = `EXPLAINER (this request): the approved plan in "context" lists SEGMENTS, each with its narration and what the screen shows.
- Build one act per segment (a top-level group named after it), in order, with a marker at each segment's start ("id": "seg-1", "seg-2", ...).
- Time each segment by its narration at about 150 words a minute plus 0.4 s; the picture lands just BEFORE the words that describe it.
- Show only each segment's KEY phrase as kinetic type, never the whole narration; the visual does the explaining (a cursor clicking, a focus, a state change, code typed or changed).
- A hook in the first two seconds; the call to action last, looping its last part.`;

const TUTORIAL_BRIEF = `CODING TUTORIAL (this request): the approved plan in "context" lists SEGMENTS. Use a "code" layer for the code: "code-type" to type it, "code-edit" to change it to each next version (give the whole new version), "code-highlight" and "code-note" for what each segment explains, and "code-run" with the REAL output. The code must be correct. Time each segment by its narration at about 150 words a minute, with a marker per segment ("id": "seg-1", ...).`;

const planAsText = (p: Plan) => [p.plan, ...(p.segments?.length ? ['', '**Segments**', ...p.segments.map((s, i) => `${i + 1}. ${s.narration}\n   Screen: ${s.visual}`)] : [])].join('\n');

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
  /** AI turns that are a plan waiting to be built. */
  plan?: boolean;
  model?: string;
}

/** Who is answering, for the connection line (naming the AI at work is part of the product). */
export function aiName(s: KitStatus): string {
  if (s.state !== 'ready') return '';
  if (s.backend === 'claude-code') return 'Claude, your Claude subscription';
  if (s.backend === 'codex') return 'ChatGPT, your ChatGPT subscription';
  if (s.backend === 'cursor') return 'Cursor, your Cursor subscription';
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
  // The AI director: plan before building, and look at the result before showing it.
  const [planFirst, setPlanFirst] = useState(true);
  const [lookFix, setLookFix] = useState(true);
  const [kind, setKind] = useState<Kind>('storyboard');
  const [pending, setPending] = useState<{ prompt: string; extra: Exclude<QueuedRequest, string> | null } | null>(null);
  const [planText, setPlanText] = useState('');
  const [phase, setPhase] = useState('');
  const [quickUrl, setQuickUrl] = useState('');

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
      // Plan first: a new scene starts as a storyboard (or a script) the person agrees before it is built.
      if (mode === 'create' && planFirst && !extra?.approved && !extra?.base) {
        setPhase('Planning');
        const revising = pending !== null;
        const plan = await askForPlan({
          prompt: revising ? `${pending!.prompt}\n\nChanges to the plan: ${ask}` : ask, kind, scene: before, signal: ctl.signal,
          context: [extra?.context, revising ? `THE PLAN SO FAR\n${planText}` : ''].filter(Boolean).join('\n\n') || undefined,
          brief: style ? styleBrief(style) : undefined,
        });
        setPending({ prompt: revising ? pending!.prompt : ask, extra: revising ? pending!.extra : extra });
        setPlanText(planAsText(plan));
        push({ role: 'ai', text: `The plan${plan.title ? `: ${plan.title}` : ''}. Change it below, or tell me what to change, then build it.`, plan: true });
        return;
      }
      setPhase(mode === 'create' ? 'Building' : 'Working');
      const brief = [extra?.brief, style ? styleBrief(style) : '', musicCues(extra?.base ?? before)].filter(Boolean).join('\n\n') || undefined;
      // A brand kit's logo can be placed by name ("brand:logo"); the Studio fills it in.
      const assets = new Map(extra?.assets ?? []);
      if (style?.logo) assets.set('brand:logo', style.logo);
      const r = await askForScene({ mode, prompt: ask, scene: extra?.base ?? before, selection: useScope === 'selection' ? props.selection : [], signal: ctl.signal, brief, context: extra?.context, assets, additions: extra?.additions });
      // A scene built from a base (a voice-over) gets the style's exact colours and fonts too.
      if (style && extra?.base) r.scene = applyStyle(r.scene, style, { look: true, motion: false, sound: false });
      // A new scene in a style gets exactly the style's colours and fonts.
      if (style && mode === 'create') r.scene = applyStyle(r.scene, style, { look: true, motion: false, sound: false });
      // A new scene gets the best still frame, whatever moment the AI guessed.
      if (mode === 'create') r.scene = { ...r.scene, playback: { ...r.scene.playback, posterTime: suggestPoster(r.scene) } };
      // A scene built on a voice-over keeps the voice track exactly as it was (with its words).
      if (extra?.base?.audio?.length) r.scene = { ...r.scene, audio: extra.base.audio };
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
      // Look, criticise, fix: the kit renders the key frames and the AI reviews its own work.
      if (lookFix) {
        setPhase('Looking at the frames');
        try {
          const rv = await askForReview({ scene: r.scene, prompt: ask, playerBase: new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href, signal: ctl.signal });
          if (rv.scene) {
            props.onApply(rv.scene, 'edit');
            push({ role: 'ai', text: `${rv.looked ? `I looked at ${rv.frames} frames.` : 'I checked the report (this AI cannot look at pictures).'} ${rv.note}`, before: r.scene, after: rv.scene, issues: lintScene(rv.scene).length, model: r.model });
          } else push({ role: 'ai', text: `${rv.looked ? `I looked at ${rv.frames} frames: ` : ''}${rv.note}` });
        } catch (e) {
          if ((e as Error).name === 'AbortError') throw e;
          push({ role: 'error', text: `Looking at the frames did not work: ${(e as Error).message} The scene above is kept.` });
        }
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') push({ role: 'error', text: 'Stopped. The scene was not changed.' });
      else push({ role: 'error', text: (e as Error).message });
    } finally {
      setBusy(false);
      setPhase('');
      abort.current = null;
    }
  };

  /** Builds the agreed plan. */
  const buildPlan = () => {
    if (!pending) return;
    const p = pending;
    setPending(null);
    const extraBrief = kind === 'explainer' ? EXPLAINER_BRIEF : kind === 'tutorial' ? TUTORIAL_BRIEF : '';
    send(p.prompt, 'new', {
      ...(p.extra ?? {}), text: p.prompt, approved: true,
      brief: [p.extra?.brief, extraBrief].filter(Boolean).join('\n\n') || undefined,
      context: [p.extra?.context, `THE APPROVED PLAN (build exactly this)\n${planText}`].filter(Boolean).join('\n\n'),
    });
  };

  /** Builds an explainer's approved script on a voice-over made from it (the audio is the clock). */
  const buildWithVoice = async () => {
    if (!pending || busy) return;
    const lines = narrationOf(planText);
    if (!lines.length) { push({ role: 'error', text: 'The plan has no numbered segments to speak.' }); return; }
    const p = pending;
    setBusy(true);
    setPhase('Making the voice-over');
    const ctl = new AbortController();
    abort.current = ctl;
    let built: { base: Scene; clipId: string } | null = null;
    try {
      const st = await voiceStatus();
      if (!st) throw new Error('Your AI Dev Kit is too old for voice-overs. Close it and start it again: it updates itself.');
      if (!st.transcription) throw new Error('Install speech recognition in the AI Dev Kit first (select an audio clip, Words): it times every word.');
      // The voice chosen last under Voice-over from a script (a Voicebox voice when Voicebox is open).
      const pick = preferredVoice();
      const own = pick?.startsWith('voicebox:') && st.voicebox?.connected && st.voicebox.profiles.some((p) => `voicebox:${p.id}` === pick) ? pick : undefined;
      if (!own && (!st.program || !Object.values(st.voices).some((v) => v.installed))) await installVoice('en_US-lessac-medium', (step) => setPhase(`Installing the voice: ${step}`));
      const v = await speak(lines, { voice: own ?? (pick && !pick.startsWith('voicebox:') ? pick : undefined), signal: ctl.signal, onStep: (step) => setPhase(step) });
      const added = withVoice({ ...scene, layers: [] }, v);
      built = { base: added.scene, clipId: added.id };
      push({ role: 'ai', text: `Made a ${Math.round(v.duration)} second voice-over from the script (${v.words.length} words, each timed). Building the scene on it now.` });
    } catch (e) {
      push({ role: 'error', text: (e as Error).name === 'AbortError' ? 'Stopped.' : (e as Error).message });
    } finally {
      setBusy(false);
      setPhase('');
      abort.current = null;
    }
    if (!built) return;
    const clip = built.base.audio!.find((a) => a.id === built!.clipId)!;
    const beats = voiceBeats(clip);
    setPending(null);
    send(p.prompt, 'new', {
      ...(p.extra ?? {}), text: p.prompt, approved: true, voiceClip: clip.id, base: voiceBase(built.base, clip, beats),
      brief: [voiceBrief(clip, beats), kind === 'tutorial' ? TUTORIAL_BRIEF : EXPLAINER_BRIEF].join('\n\n'),
      context: `VOICE-OVER BEATS (scene seconds)\n${beatsText(beats)}\n\nTHE APPROVED PLAN (build exactly this, timed to the voice)\n${planText}`,
    });
  };

  /** Edit my video: the footage's sound transcribed (if it is not yet), then captions and effects placed on its words. */
  const editVideo = async () => {
    if (busy || status.state !== 'ready') return;
    const footage = allLayers(scene.layers).find((l) => l.type === 'video' && !l.reference);
    if (!footage) { push({ role: 'error', text: 'Add your footage first (+ Footage on the timeline).' }); return; }
    setBusy(true);
    const ctl = new AbortController();
    abort.current = ctl;
    let s: Scene | null = null;
    let clipId = '';
    try {
      s = scene;
      let voice = (s.audio ?? []).find((a) => a.role === 'voice' && a.words?.length);
      if (!voice) {
        setPhase('Taking the sound out of the footage');
        const r = await useFootageSound(s, footage.id);
        s = r.scene;
        const clip = s.audio!.find((a) => a.id === r.id)!;
        const st = await transcribeStatus();
        const model = (Object.keys(st.models) as Array<keyof typeof st.models>).find((k) => st.models[k].installed);
        if (!st.program || !model) throw new Error('Install speech recognition in the AI Dev Kit first (select an audio clip, Words): it times every word.');
        const t = await transcribe(clip.src, model, (step) => setPhase(`Transcribing: ${step}`), ctl.signal);
        s = { ...s, audio: s.audio!.map((a) => (a.id === clip.id ? { ...a, words: t.words, speech: t.speech } : a)) };
        voice = s.audio!.find((a) => a.id === clip.id)!;
        push({ role: 'ai', text: `Took the sound out of the footage and timed ${t.words.length} words. Now placing captions and effects on them.` });
      }
      clipId = voice.id;
    } catch (e) {
      push({ role: 'error', text: (e as Error).name === 'AbortError' ? 'Stopped.' : (e as Error).message });
      s = null;
    } finally {
      setBusy(false);
      setPhase('');
      abort.current = null;
    }
    if (!s) return;
    const clip = s.audio!.find((a) => a.id === clipId)!;
    const ask = prompt.trim() || 'Edit this video: captions, a hook, and effects that suit what is said.';
    send(ask, 'scene', { text: ask, base: s, voiceClip: clip.id, brief: VIDEO_EDIT_BRIEF, additions: true, context: `VOICE-OVER WORDS (scene seconds)\n${beatsText(voiceBeats(clip))}` });
  };

  /** A quick scene from a website: its real words, colours, fonts and screenshots. */
  const fromWebsite = async () => {
    const url = quickUrl.trim();
    if (!url || busy || status.state !== 'ready') return;
    setBusy(true);
    setPhase('Reading the website');
    const ctl = new AbortController();
    abort.current = ctl;
    let q: { brief: string; context: string; shots: string[] } | null = null;
    try {
      q = await askForQuick({ url, signal: ctl.signal });
    } catch (e) {
      push({ role: 'error', text: (e as Error).name === 'AbortError' ? 'Stopped.' : (e as Error).message });
    } finally {
      setBusy(false);
      setPhase('');
      abort.current = null;
    }
    if (!q) return;
    const assets = new Map(q.shots.map((src, i) => [`shot:${i + 1}`, src]));
    send(`A scene that shows ${url} in use, ending with its call to action.`, 'new', { text: url, brief: q.brief, context: q.context, assets });
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
            <span className="assist-beta">Beta</span>
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
                {scope !== 'new' && allLayers(scene.layers).some((l) => l.type === 'video' && !l.reference) && (
                  <div className="assist-quick">
                    <button type="button" className="btn small primary" disabled={!ready || busy} onClick={editVideo}>Edit my video</button>
                    <p className="assist-faint">Captions and effects placed on what is said in your footage (its sound is transcribed in the AI Dev Kit first). Type what you want above to steer it.</p>
                  </div>
                )}
                {scope === 'new' && (
                  <div className="assist-quick">
                    <label htmlFor="assist-url">Or start from a website</label>
                    <div className="assist-quick-row">
                      <input id="assist-url" type="url" placeholder="https://your-product.com" value={quickUrl} disabled={busy} onChange={(e) => setQuickUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); fromWebsite(); } }} />
                      <button type="button" className="btn small" disabled={!ready || busy || !/^https?:\/\//.test(quickUrl.trim())} onClick={fromWebsite}>Make a scene</button>
                    </div>
                    <p className="assist-faint">The AI Dev Kit reads its real words, colours, fonts and screenshots; nothing is invented.</p>
                  </div>
                )}
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
            {pending && !busy && (
              <div className="assist-msg is-ai assist-plan">
                <label htmlFor="assist-plan" className="sr-only">The plan</label>
                <textarea id="assist-plan" rows={12} value={planText} onChange={(e) => setPlanText(e.target.value)} />
                <div className="assist-msg-actions">
                  <button type="button" className="btn primary small" disabled={!ready} onClick={buildPlan}>Build it</button>
                  {kind !== 'storyboard' && <button type="button" className="btn small" disabled={!ready} onClick={buildWithVoice} title="A free voice on your computer speaks the script; the scene is timed to its words">Build with a voice-over</button>}
                  <button type="button" className="link-btn" onClick={() => setPending(null)}>Start over</button>
                  <span className="assist-faint">Or type what to change below.</span>
                </div>
              </div>
            )}
            {busy && (
              <div className="assist-msg is-ai is-working">
                <p><span className="assist-pulse" aria-hidden="true" /> {phase || 'Working'}… {elapsed}s <span className="assist-faint">(usually one to three minutes)</span></p>
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
            <div className="assist-director">
              {scope === 'new' && (
                <>
                  <label htmlFor="assist-kind">Make</label>
                  <select id="assist-kind" value={kind} disabled={busy} onChange={(e) => setKind(e.target.value as Kind)}>
                    <option value="storyboard">A scene</option>
                    <option value="explainer">An explainer (script first)</option>
                    <option value="tutorial">A coding tutorial</option>
                  </select>
                  <label className="assist-check"><input type="checkbox" checked={planFirst || kind !== 'storyboard'} disabled={busy || kind !== 'storyboard'} onChange={(e) => setPlanFirst(e.target.checked)} /> Plan first</label>
                </>
              )}
              <label className="assist-check" title="After building, the AI Dev Kit renders the key frames and the AI reviews and fixes what it sees"><input type="checkbox" checked={lookFix} disabled={busy} onChange={(e) => setLookFix(e.target.checked)} /> Look and fix</label>
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
