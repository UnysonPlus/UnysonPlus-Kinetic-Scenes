import { useEffect, useRef, useState } from 'react';
import type { LottieLayer } from '@unysonplus/scene-player/types';
import { lottieInfo } from '@unysonplus/scene-player/lottieData';
import { CheckField, ColorField, NumberField, Section, TextField } from './fields';

const MAX = 4 * 1024 * 1024;
const readData = async (src: string): Promise<unknown> => {
  const s = src.trim();
  if (s.startsWith('{')) return JSON.parse(s);
  const r = await fetch(s);
  if (!r.ok) throw new Error(`The file answered ${r.status}.`);
  return r.json();
};

/**
 * A Lottie layer's settings: the animation (a file or an address), its speed and looping, and, read from the
 * animation itself, every colour and text it uses, each changeable in place.
 */
export function LottieSection(props: { layer: LottieLayer; set: (patch: Partial<LottieLayer>) => void }) {
  const { layer, set } = props;
  const fileRef = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<ReturnType<typeof lottieInfo> | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    readData(layer.src).then((d) => { if (live) { setInfo(lottieInfo(d)); setNote(null); } })
      .catch((e) => { if (live) { setInfo(null); setNote(`The animation could not be read: ${(e as Error).message}`); } });
    return () => { live = false; };
  }, [layer.src]);

  const upload = (file: File) => {
    if (file.size > MAX) { setNote(`That file is ${(file.size / 1048576).toFixed(1)} MB; over 4 MB makes the scene heavy. Host it and use its address instead.`); return; }
    if (/\.lottie$/i.test(file.name)) { setNote('That is a .lottie (zipped) file: download the Lottie JSON version of the animation instead.'); return; }
    const r = new FileReader();
    r.onload = () => { set({ src: String(r.result), colours: undefined, texts: undefined, name: file.name.replace(/\.json$/i, '') }); setNote(`Using ${file.name} (stored inside the scene).`); };
    r.readAsText(file);
  };

  const colours = layer.colours ?? {};
  const texts = layer.texts ?? {};
  return (
    <>
      <Section title="Lottie animation">
        <TextField label="Animation (.json address)" wide mono value={layer.src.trim().startsWith('{') ? '(stored in the scene)' : layer.src}
          onCommit={(v) => { if (v !== '(stored in the scene)' && v.trim()) set({ src: v.trim(), colours: undefined, texts: undefined }); }} />
        <button type="button" className="btn small wide-btn" onClick={() => fileRef.current?.click()}>Upload a Lottie (.json)…</button>
        <input ref={fileRef} type="file" hidden accept=".json,application/json" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f); }} />
        <p className="field-hint wide">
          Free animations: LottieFiles (download "Lottie JSON"). It plays on the scene's clock, so it scrubs, loops and renders to video exactly.
          {info ? ` ${info.seconds} s at ${info.fps} fps.` : ''}
        </p>
        {note && <p className="field-hint wide">{note}</p>}
        <NumberField label="Speed" value={layer.speed ?? 1} min={0.1} max={8} step={0.1} onCommit={(v) => set({ speed: v ?? 1 })} />
        <NumberField label="Start at (s)" value={layer.from ?? 0} min={0} step={0.1} onCommit={(v) => set({ from: v || undefined })} />
        <CheckField label="Loop (off: play once, then hold the last frame)" checked={layer.loop ?? true} onChange={(v) => set({ loop: v })} />
        <TextField label="Describe it (for screen readers; empty if decorative)" wide value={layer.alt ?? ''} onCommit={(v) => set({ alt: v })} />
      </Section>
      {!!info?.colours.length && (
        <Section title="Its colours">
          {info.colours.slice(0, 12).map((c) => (
            <ColorField key={c} label={c} value={colours[c] ?? c}
              onCommit={(v) => { const next = { ...colours }; if (v.toLowerCase() === c) delete next[c]; else next[c] = v; set({ colours: Object.keys(next).length ? next : undefined }); }} />
          ))}
          {info.colours.length > 12 && <p className="field-hint wide">The 12 colours used most are listed.</p>}
        </Section>
      )}
      {!!info?.texts.length && (
        <Section title="Its words">
          {info.texts.slice(0, 12).map((t) => (
            <TextField key={t} label={t.slice(0, 40)} wide value={texts[t] ?? t}
              onCommit={(v) => { const next = { ...texts }; if (v === t) delete next[t]; else next[t] = v; set({ texts: Object.keys(next).length ? next : undefined }); }} />
          ))}
        </Section>
      )}
    </>
  );
}
