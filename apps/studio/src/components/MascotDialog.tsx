import { useEffect, useMemo, useRef, useState } from 'react';
import type { AudioClip, MascotFaceBox, MascotLayer } from '@unysonplus/scene-player/types';
import { buildMascot, drawMascot } from '@unysonplus/scene-player/mascot';
import { POSE_NAMES, POSE_SHEET_PROMPT, carryFace, cutSheet, fileToDataUrl, type CutPose, type DraftPose } from '../lib/mascotMaker';

/**
 * Insert › Mascot…: a step-by-step mascot creator.
 *   1. Your mascot: one picture, a picture for each pose, or six poses drawn by your own image AI (a prompt to copy).
 *   2. Poses: the poses found, named (idle, wave…), in order; remove the ones you do not want.
 *   3. Face: where the mouth and eyes are on each pose (guessed, then adjusted), with a live preview that talks and blinks.
 *   4. Add it: a name, and it goes into the scene as a Mascot layer that talks on the voice-over.
 * Everything runs in this browser: the pictures are only sent where you send them yourself (to your image AI).
 */

type Source = 'one' | 'many' | 'sheet';
type Part = 'mouth' | 'eye0' | 'eye1';
const PART_LABEL: Record<Part, string> = { mouth: 'Mouth', eye0: 'Eye', eye1: 'Other eye' };
const AI_LINKS = [{ label: 'Open ChatGPT', href: 'https://chatgpt.com/' }, { label: 'Open Gemini', href: 'https://gemini.google.com/' }];

/** A few words, timed, for the preview to say (no sound: only the mouth moves). */
const PREVIEW_WORDS = (() => {
  const words = 'Hello there I am your new mascot and I can talk on any voice over'.split(' ');
  let t = 0.4; const out: Array<{ w: string; t: number; d: number }> = [];
  for (const w of words) { const d = 0.12 + w.length * 0.055; out.push({ w, t, d }); t += d + (w === 'mascot' ? 0.45 : 0.05); }
  return out;
})();
const PREVIEW_LEN = PREVIEW_WORDS[PREVIEW_WORDS.length - 1].t + PREVIEW_WORDS[PREVIEW_WORDS.length - 1].d + 1.6;
const PREVIEW_AUDIO: AudioClip[] = [{ id: 'preview', src: '', start: 0, role: 'voice', words: PREVIEW_WORDS } as AudioClip];

function draftLayer(p: DraftPose): MascotLayer {
  return { id: 'preview', type: 'mascot', box: { x: 50, y: 50, w: 100, h: 100 }, clips: [], talk: 1.1,
    poses: [{ id: 'p', name: p.name, src: p.cut.src, ratio: p.cut.ratio, ...(p.mouth ? { mouth: p.mouth } : {}), eyes: p.eyes, ...(p.eyesClosed ? { eyesClosed: true } : {}) }] };
}

/** The pose talking and blinking, drawn with the player's own mascot code. */
function LivePreview(props: { pose: DraftPose }) {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useMemo(() => draftLayer(props.pose), [props.pose]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    buildMascot(document, el, layer);
    let raf = 0;
    const t0 = performance.now();
    const tick = () => { drawMascot(el, layer, PREVIEW_AUDIO, ((performance.now() - t0) / 1000) % PREVIEW_LEN); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [layer]);
  return <div ref={ref} className="mascot-live" aria-label="Preview: the pose talking and blinking" role="img" />;
}

/** The pose with its face boxes: pick a part, then drag on the picture to draw its box (or drag a box to move it). */
function FaceEditor(props: { pose: DraftPose; part: Part; onChange: (p: DraftPose) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: 'draw' | 'move'; part: Part; from: [number, number]; orig?: MascotFaceBox } | null>(null);
  const at = (e: React.PointerEvent): [number, number] => {
    const b = ref.current!.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), Math.min(1, Math.max(0, (e.clientY - b.top) / b.height))];
  };
  const boxOf = (part: Part) => (part === 'mouth' ? props.pose.mouth : props.pose.eyes[part === 'eye0' ? 0 : 1]);
  const set = (part: Part, box: MascotFaceBox) => {
    const r = (n: number) => +n.toFixed(4);
    const b = { x: r(box.x), y: r(box.y), w: r(box.w), h: r(box.h) };
    if (part === 'mouth') props.onChange({ ...props.pose, mouth: b });
    else { const eyes = [...props.pose.eyes]; eyes[part === 'eye0' ? 0 : 1] = b; props.onChange({ ...props.pose, eyes: eyes.filter(Boolean) }); }
  };
  const parts: Part[] = ['mouth', 'eye0', 'eye1'];
  return (
    <div className="mascot-face" style={{ aspectRatio: String(props.pose.cut.ratio), width: `min(100%, calc(52vh * ${props.pose.cut.ratio}))` }} ref={ref}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture(e.pointerId);
        const p = at(e);
        const hit = (e.target as HTMLElement).dataset.part as Part | undefined;
        if (hit) drag.current = { mode: 'move', part: hit, from: p, orig: boxOf(hit) };
        else drag.current = { mode: 'draw', part: props.part, from: p };
      }}
      onPointerMove={(e) => {
        const d = drag.current; if (!d) return;
        const p = at(e);
        if (d.mode === 'move' && d.orig) set(d.part, { ...d.orig, x: Math.min(1 - d.orig.w, Math.max(0, d.orig.x + p[0] - d.from[0])), y: Math.min(1 - d.orig.h, Math.max(0, d.orig.y + p[1] - d.from[1])) });
        else if (d.mode === 'draw') set(d.part, { x: Math.min(d.from[0], p[0]), y: Math.min(d.from[1], p[1]), w: Math.max(0.01, Math.abs(p[0] - d.from[0])), h: Math.max(0.01, Math.abs(p[1] - d.from[1])) });
      }}
      onPointerUp={() => { drag.current = null; }}>
      <img src={props.pose.cut.src} alt="" draggable={false} />
      {parts.map((part) => {
        const b = boxOf(part);
        if (!b || (part !== 'mouth' && props.pose.eyesClosed)) return null;
        return <span key={part} data-part={part} className={`mascot-box is-${part === 'mouth' ? 'mouth' : 'eye'}${props.part === part ? ' is-on' : ''}`} title={`${PART_LABEL[part]}: drag to move`}
          style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }} />;
      })}
    </div>
  );
}

export function MascotDialog(props: { open: boolean; hasVoice: boolean; onClose: () => void; onAdd: (name: string, poses: DraftPose[]) => void; initial?: { name: string; poses: DraftPose[] } }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<Source | null>(null);
  const [poses, setPoses] = useState<DraftPose[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cur, setCur] = useState(0);
  const [part, setPart] = useState<Part>('mouth');
  const [name, setName] = useState('Mascot');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
    if (props.open) {
      setNote(null); setError(null); setCur(0); setPart('mouth');
      // Editing a mascot: straight to its poses.
      if (props.initial) { setStep(2); setSource('many'); setPoses(props.initial.poses); setName(props.initial.name); }
      else { setStep(1); setSource(null); setPoses([]); setName('Mascot'); }
    }
  }, [props.open]);

  const take = (cuts: CutPose[], keep: DraftPose[] = []) => {
    const n0 = keep.length;
    const added: DraftPose[] = cuts.map((c, i) => ({ id: `new-${n0 + i}`, name: POSE_NAMES[n0 + i] ?? `Pose ${n0 + i + 1}`, cut: c, mouth: c.face.mouth, eyes: c.face.eyes, eyesClosed: false }));
    setPoses([...keep, ...added]);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length || !source) return;
    setBusy(true); setError(null); setNote(null);
    try {
      const keep = step === 2 ? poses : [];
      const cuts: CutPose[] = [];
      let lastNote: string | undefined;
      for (const f of Array.from(files).slice(0, 12)) {
        if (!/^image\//.test(f.type)) continue;
        const r = await cutSheet(await fileToDataUrl(f), { single: source !== 'sheet' });
        cuts.push(...r.poses); lastNote = r.note ?? lastNote;
      }
      if (!cuts.length) throw new Error('No picture was found in what you chose.');
      take(source === 'one' && !keep.length ? cuts.slice(0, 1) : cuts, keep);
      if (source === 'sheet' && cuts.length !== 6 && !keep.length) setNote(`Found ${cuts.length} poses (the prompt asks for 6). If poses touch or one is missing, ask your image AI to try again with more space between them, or keep these.`);
      else if (lastNote) setNote(lastNote);
      setStep(2);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const pose = poses[cur];
  const setPose = (p: DraftPose) => setPoses((all) => all.map((x, i) => (i === cur ? p : x)));
  const faceOnAll = () => {
    if (!pose) return;
    setPoses((all) => all.map((x, i) => {
      if (i === cur) return x;
      const moved = carryFace(pose.cut, x.cut, { mouth: pose.mouth, eyes: pose.eyes });
      return { ...x, mouth: moved.mouth, eyes: moved.eyes };
    }));
    setNote('The face was placed on the other poses. Check each one with Next pose.');
  };

  const pick = (s: Source) => { setSource(s); setError(null); if (s !== 'sheet') setTimeout(() => fileRef.current?.click(), 0); };

  return (
    <dialog ref={ref} className="export mascot-dialog" aria-labelledby="mascot-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="mascot-title">{props.initial ? `Edit ${props.initial.name}` : 'Make a mascot'}</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <ol className="mascot-steps" aria-label="Steps">
          {['Your mascot', 'Poses', 'Face', 'Add it'].map((s, i) => (
            <li key={s} className={step === i + 1 ? 'is-on' : step > i + 1 ? 'is-done' : ''}><i>{i + 1}</i>{s}</li>
          ))}
        </ol>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple={source === 'many'} hidden onChange={(e) => onFiles(e.target.files)} />

        {step === 1 && (
          <div className="mascot-body">
            <p className="field-hint wide">Pictures on a plain or see-through background work best: the Studio takes the background off by itself. Nothing is uploaded.</p>
            <div className="mascot-choices">
              <button type="button" className={`mascot-choice${source === 'one' ? ' is-on' : ''}`} onClick={() => pick('one')} disabled={busy}>
                <strong>One picture</strong><span>The quickest. It talks, blinks and breathes in one pose.</span>
              </button>
              <button type="button" className={`mascot-choice${source === 'many' ? ' is-on' : ''}`} onClick={() => pick('many')} disabled={busy}>
                <strong>A picture for each pose</strong><span>Your mascot art in a few poses (waving, pointing…). Choose them all at once.</span>
              </button>
              <button type="button" className={`mascot-choice${source === 'sheet' ? ' is-on' : ''}`} onClick={() => pick('sheet')} disabled={busy}>
                <strong>Six poses with your image AI</strong><span>Copy a prompt into ChatGPT, Gemini or another image AI with one picture of your mascot, then upload what it draws.</span>
              </button>
            </div>
            {source === 'sheet' && (
              <div className="mascot-prompt">
                <ol className="mascot-howto">
                  <li>Open your image AI and start a new chat.</li>
                  <li>Attach a clear picture of your mascot.</li>
                  <li>Copy the prompt below, paste it and send.</li>
                  <li>Save the picture it makes, then upload it here.</li>
                </ol>
                <textarea readOnly value={POSE_SHEET_PROMPT} rows={7} aria-label="The prompt for your image AI" />
                <div className="mascot-row">
                  <button type="button" className="btn small" onClick={() => { navigator.clipboard?.writeText(POSE_SHEET_PROMPT).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }); }}>{copied ? 'Copied' : 'Copy the prompt'}</button>
                  {AI_LINKS.map((l) => <a key={l.href} className="btn small ghost" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
                  <button type="button" className="btn small primary" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? 'Cutting out the poses…' : 'Upload the pose sheet'}</button>
                </div>
                <p className="field-hint wide">If a pose comes out different (another face, poses touching), ask it to "try again, keep the same character".</p>
              </div>
            )}
            {busy && source !== 'sheet' && <p className="field-hint wide">Taking the background off…</p>}
          </div>
        )}

        {step === 2 && (
          <div className="mascot-body">
            <p className="field-hint wide">{poses.length === 1 ? 'Your mascot, ready to give a face. ' : `${poses.length} poses. `}Check the names (a Pose clip picks one by name). The first is the one it shows the rest of the time.</p>
            <div className="mascot-poses">
              {poses.map((p, i) => (
                <figure key={p.id} className="mascot-pose">
                  <img src={p.cut.src} alt="" />
                  <input list="mascot-pose-names" value={p.name} aria-label={`Name of pose ${i + 1}`} onChange={(e) => setPoses((all) => all.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} />
                  <div className="mascot-pose-tools">
                    {i > 0 && <button type="button" className="link-btn" onClick={() => setPoses((all) => [all[i], ...all.filter((_, k) => k !== i)])} title="Show this pose the rest of the time">Make it the main pose</button>}
                    {poses.length > 1 && <button type="button" className="link-btn" onClick={() => setPoses((all) => all.filter((_, k) => k !== i))}>Remove</button>}
                  </div>
                </figure>
              ))}
            </div>
            <datalist id="mascot-pose-names">{POSE_NAMES.map((n) => <option key={n} value={n} />)}</datalist>
            {source !== 'one' && <button type="button" className="btn small ghost" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? 'Adding…' : 'Add more pictures'}</button>}
          </div>
        )}

        {step === 3 && pose && (
          <div className="mascot-body mascot-face-step">
            <div className="mascot-face-col">
              <div className="mascot-row" role="radiogroup" aria-label="Which part to draw">
                {(['mouth', 'eye0', 'eye1'] as Part[]).map((p) => (
                  <button key={p} type="button" role="radio" aria-checked={part === p} className={`btn small${part === p ? ' primary' : ' ghost'}`} onClick={() => setPart(p)} disabled={p !== 'mouth' && pose.eyesClosed}>{PART_LABEL[p]}</button>
                ))}
              </div>
              <FaceEditor pose={pose} part={part} onChange={setPose} />
              <p className="field-hint wide">Pick a part, then drag a box around it on the picture: the mouth (closed lips), then each eye. Drag a box to move it. We guessed where they are; fix what is off.</p>
            </div>
            <div className="mascot-preview-col">
              <LivePreview pose={pose} />
              <label className="assist-check"><input type="checkbox" checked={pose.eyesClosed} onChange={(e) => setPose({ ...pose, eyesClosed: e.target.checked })} /> The eyes are closed in this pose</label>
              <p className="field-hint wide">The mouth should open and close cleanly, and the eyes blink. Pose {cur + 1} of {poses.length}: <strong>{pose.name}</strong></p>
              <div className="mascot-row">
                <button type="button" className="btn small ghost" disabled={cur === 0} onClick={() => setCur(cur - 1)}>Previous pose</button>
                <button type="button" className="btn small ghost" disabled={cur >= poses.length - 1} onClick={() => setCur(cur + 1)}>Next pose</button>
                {poses.length > 1 && <button type="button" className="btn small ghost" onClick={faceOnAll}>Use this face on the other poses</button>}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mascot-body">
            <label className="field wide"><span>Its name</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} /></label>
            <p className="field-hint wide">
              It goes into the scene as a Mascot layer. It talks on the scene's voice-over{props.hasVoice ? '' : ' (there is none yet: add one with Audio › Voice-over, or ask AI assist)'}, blinks and breathes by itself.
              To change its pose, select it and use <strong>Add a pose change</strong> in the Inspector, or pin a Pose clip to a word.
            </p>
          </div>
        )}

        {note && <p className="field-hint wide mascot-note" role="status">{note}</p>}
        {error && <p className="field-hint wide" role="alert">{error}</p>}

        <footer className="mascot-foot">
          {step > 1 && <button type="button" className="btn small ghost" onClick={() => { setNote(null); setStep(step - 1); }}>Back</button>}
          <span className="mascot-spacer" />
          {step === 2 && <button type="button" className="btn small primary" disabled={!poses.length} onClick={() => { setCur(0); setNote(null); setStep(3); }}>Next: the face</button>}
          {step === 3 && <button type="button" className="btn small primary" onClick={() => { setNote(null); setStep(4); }}>The face looks right</button>}
          {step === 4 && <button type="button" className="btn small primary" disabled={!name.trim()} onClick={() => props.onAdd(name.trim(), poses)}>{props.initial ? 'Save the changes' : 'Add it to the scene'}</button>}
        </footer>
      </div>
    </dialog>
  );
}
