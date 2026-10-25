import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { makeMusic } from '../lib/addons';
import { addAudio, setAudio } from '../lib/audio';
import { analyseMusic } from '../lib/beats';

const STYLES = [
  { label: 'Upbeat', prompt: 'upbeat feel-good pop instrumental, punchy drums, bright synths, motivational', bpm: 120 },
  { label: 'Corporate', prompt: 'clean modern corporate instrumental, light percussion, plucked synths, optimistic', bpm: 110 },
  { label: 'Cinematic', prompt: 'cinematic instrumental, rising strings, deep drums, epic build', bpm: 90 },
  { label: 'Chill', prompt: 'chill lo-fi instrumental, soft keys, mellow beat, warm', bpm: 85 },
  { label: 'Tech', prompt: 'energetic electronic instrumental, driving bass, crisp hi-hats, futuristic', bpm: 128 },
];

/**
 * Make music: an instrumental from the ACE-Step add-on, as long as the scene, added as a Music track. The player
 * lowers music under a voice-over on its own, and the beats are found straight away so reveals can snap to them.
 */
export function MusicDialog(props: { open: boolean; onClose: () => void; scene: Scene; onCommit: (s: Scene) => void;
  decode: (src: string) => Promise<AudioBuffer | null>; onAddons: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [prompt, setPrompt] = useState(STYLES[0].prompt);
  const [bpm, setBpm] = useState<number | ''>(STYLES[0].bpm);
  const [seconds, setSeconds] = useState(Math.round(props.scene.duration));
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) { d.showModal(); setSeconds(Math.max(10, Math.round(props.scene.duration))); setError(null); }
    if (!props.open && d.open) d.close();
  }, [props.open, props.scene.duration]);

  const go = async () => {
    setError(null);
    setStep('Asking the AI Dev Kit');
    try {
      const r = await makeMusic({ prompt, seconds, bpm: bpm || undefined }, setStep);
      setStep('Finding the beats');
      const name = `Music (${STYLES.find((s) => s.prompt === prompt)?.label ?? 'made'})`;
      const added = addAudio(props.scene, { name, src: r.src, role: 'music', start: 0, volume: 0.7, fadeOut: 1.5 });
      let next = added.scene;
      const buf = await props.decode(r.src).catch(() => null);
      if (buf) { const a = analyseMusic(buf); next = setAudio(next, added.id, { beats: a.beats, envelope: a.envelope }); }
      props.onCommit(next);
      setStep(null);
      props.onClose();
    } catch (e) { setError((e as Error).message); setStep(null); }
  };

  return (
    <dialog ref={ref} className="export addons" aria-labelledby="music-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current && !step) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="music-title">Make music</h2>
          <button type="button" className="icon-link" aria-label="Close" disabled={!!step} onClick={props.onClose}>×</button>
        </header>
        <p className="addons-intro">
          An instrumental made on this computer with the ACE-Step add-on, free to use. It goes in as a Music track: it
          drops under the voice-over by itself, and its beats are found so reveals can snap to them.
        </p>
        <div className="export-row">
          {STYLES.map((s) => (
            <button key={s.label} type="button" className={`btn small${prompt === s.prompt ? ' primary' : ' ghost'}`} disabled={!!step}
              onClick={() => { setPrompt(s.prompt); setBpm(s.bpm); }}>{s.label}</button>
          ))}
        </div>
        <label className="music-field">Style
          <textarea rows={2} value={prompt} disabled={!!step} onChange={(e) => setPrompt(e.target.value)} />
        </label>
        <div className="export-row">
          <label className="music-field">Length (s)
            <input type="number" min={10} max={240} value={seconds} disabled={!!step} onChange={(e) => setSeconds(Number(e.target.value) || 30)} />
          </label>
          <label className="music-field">Tempo (bpm)
            <input type="number" min={40} max={220} value={bpm} placeholder="any" disabled={!!step} onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : '')} />
          </label>
        </div>
        {error && (
          <p className="export-warn" role="alert">{error}{' '}
            <button type="button" className="btn small ghost" onClick={() => { props.onClose(); props.onAddons(); }}>Open Add-ons</button>
          </p>
        )}
        {step && <p className="addon-detail" role="status">{step}… The first one after ACE-Step starts takes a minute or so.</p>}
        <div className="export-row">
          <button type="button" className="btn primary" disabled={!!step || !prompt.trim()} onClick={go}>{step ? 'Making…' : 'Make music'}</button>
        </div>
      </div>
    </dialog>
  );
}
