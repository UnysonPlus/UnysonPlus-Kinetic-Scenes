import { useEffect, useRef, useState } from 'react';
import type { Scene, VideoFormat, VideoLayer, VideoSettings } from '@unysonplus/scene-player/types';
import { cutOutPerson, cutoutMethods, followFace, useFootageSound } from '../lib/footageKit';
import type { CutoutMethod, MethodInfo } from '../lib/footageKit';
import { PointPicker } from './PointPicker';
import type { PickedPoint } from './PointPicker';
import { separateFootage } from '../lib/separate';
import { footageAspect, frameAspect, reframe } from '../lib/reframe';
import { PLATFORM_LIMITS, VIDEO_FORMATS } from '@unysonplus/scene-player/video';
import { CheckField, NumberField, Section, SelectField, TextField } from './fields';
import { Segmented } from './Segmented';
import { FORMAT_ORDER, setVideo, toVideo, toWeb } from '../lib/videoMode';

const FORMATS = FORMAT_ORDER;

/** Frames round a picture or footage. */
export const FRAME_OPTIONS = [
  { value: 'none', label: 'None' }, { value: 'phone', label: 'Phone' }, { value: 'browser', label: 'Browser window' },
  { value: 'polaroid', label: 'Polaroid' }, { value: 'film', label: 'Film strip' }, { value: 'card', label: 'Card' },
];

/** What the scene is for: a responsive scene on a web page, or a fixed-format video. */
export function MadeForSection(props: { scene: Scene; onCommit: (s: Scene) => void }) {
  const { scene, onCommit } = props;
  const video = scene.mode === 'video' && scene.video;
  const v = scene.video;
  const set = (patch: Partial<VideoSettings>) => onCommit(setVideo(scene, patch));
  const toggleFormat = (f: VideoFormat, on: boolean) => {
    const formats = on ? [...(v?.formats ?? []), f] : (v?.formats ?? []).filter((x) => x !== f);
    if (formats.length) set({ formats: FORMATS.filter((x) => formats.includes(x)) });
  };
  return (
    <Section title="Made for">
      <div className="wide">
        <Segmented
          legend="Made for"
          value={video ? 'video' : 'web'}
          onChange={(m) => onCommit(m === 'video' ? toVideo(scene) : toWeb(scene))}
          options={[
            { value: 'web', label: 'Web', hint: 'A responsive scene on a page: layouts by screen size, scroll and click playback, search-engine text, the WordPress element' },
            { value: 'video', label: 'Video', hint: 'A fixed-format video that plays once at an exact length: Reels, TikTok, Shorts, YouTube, or graphics to lay over your footage' },
          ]}
        />
      </div>
      {video && v && (
        <>
          <div className="field wide">
            <span>Formats</span>
            <div className="format-checks">
              {FORMATS.map((f) => (
                <label key={f} className="check-pill">
                  <input type="checkbox" checked={v.formats.includes(f)} onChange={(e) => toggleFormat(f, e.target.checked)} />
                  {VIDEO_FORMATS[f].label}
                </label>
              ))}
            </div>
          </div>
          <SelectField label="Frame rate" value={String(v.fps ?? 30)} options={[24, 25, 30, 50, 60].map((n) => ({ value: String(n), label: `${n} fps` }))} onChange={(x) => set({ fps: Number(x) as VideoSettings['fps'] })} />
          <SelectField label="Posting to" value={v.platform ?? 'none'}
            options={[{ value: 'tiktok', label: 'TikTok' }, { value: 'reels', label: 'Instagram Reels' }, { value: 'shorts', label: 'YouTube Shorts' }, { value: 'youtube', label: 'YouTube' }, { value: 'none', label: 'Anywhere' }]}
            onChange={(x) => set({ platform: x as VideoSettings['platform'] })} />
          <CheckField wide label="See-through background (graphics to lay over footage)" checked={!!v.transparent} onChange={(x) => set({ transparent: x || undefined })} />
          <p className="field-hint wide">
            {v.formats.length > 1 ? 'Each format has its own layout: pick one above the stage to arrange it, and export them together. ' : ''}
            {v.platform && v.platform !== 'none' ? `Turn on App guides above the stage to see where ${PLATFORM_LIMITS[v.platform]?.label} covers the picture; Check scene keeps words out of those areas. ` : ''}
            {v.transparent ? 'Exports as WebM with transparency or ProRes 4444, ready to drop over footage in your video editor.' : ''}
          </p>
        </>
      )}
    </Section>
  );
}

/** A footage layer: trim, speed, how it fills its box, whether it is only a reference, and its sound. */
export function FootageSection(props: { layer: VideoLayer; set: (p: Partial<VideoLayer>) => void; duration?: number }) {
  const { layer, set } = props;
  return (
    <Section title="Footage">
      <NumberField label="Start the file at" value={layer.offset ?? 0} unit="s" step={0.1} min={0} onCommit={(x) => set({ offset: x || undefined })} />
      <NumberField label="Speed" value={layer.rate ?? 1} unit="×" step={0.05} min={0.25} max={4} onCommit={(x) => set({ rate: x && x !== 1 ? x : undefined })} />
      <SelectField label="Fit" value={layer.fit ?? 'cover'} options={[{ value: 'cover', label: 'Fill the box' }, { value: 'contain', label: 'Fit inside' }]} onChange={(x) => set({ fit: x as VideoLayer['fit'] })} />
      <NumberField label="Corner radius" value={layer.radius ?? 0} step={0.1} min={0} unit="su" onCommit={(x) => set({ radius: x || undefined })} />
      <SelectField label="Frame" value={layer.frame ?? 'none'} options={FRAME_OPTIONS} onChange={(x) => set({ frame: x === 'none' ? undefined : x as VideoLayer['frame'] })} />
      <CheckField wide label="Reference only (left out of a graphics-only export)" checked={!!layer.reference} onChange={(x) => set({ reference: x || undefined })} />
      {!layer.reference && <NumberField label="Its own sound" value={layer.sound ?? 0} unit="×" step={0.1} min={0} max={2} onCommit={(x) => set({ sound: x || undefined })} />}
      <TextField label="Description" value={layer.alt} wide placeholder="What happens in it, for screen readers (blank if decorative)" onCommit={(x) => set({ alt: x || undefined })} />
      <p className="field-hint wide">
        Design against it: line up words and effects with what happens on camera. The layer's in point on the timeline is where the
        file starts playing (from "Start the file at"); its out point trims the end. Its sound (0 = muted) goes into video exports.
        {props.duration ? ` The file is ${Math.round(props.duration * 10) / 10} s long.` : ''}
      </p>
    </Section>
  );
}

/** The AI Dev Kit's footage tools: cut the person out, follow the face, use the footage's sound. */
export function FootageKitSection(props: { scene: Scene; layer: VideoLayer; onCommit: (s: Scene) => void; onSelect?: (id: string) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [quality, setQuality] = useState<CutoutMethod>('fine');
  const [methods, setMethods] = useState<Record<string, MethodInfo> | null>(null);
  useEffect(() => { cutoutMethods().then(setMethods); }, []);
  const abort = useRef<AbortController | null>(null);
  const run = async (what: string, job: (signal: AbortSignal) => Promise<string>) => {
    setNote(null);
    setBusy(what);
    const ctl = new AbortController();
    abort.current = ctl;
    try { setNote(await job(ctl.signal)); } catch (e) { setNote((e as Error).name === 'AbortError' ? 'Stopped.' : (e as Error).message); } finally { setBusy(null); abort.current = null; }
  };
  const tracked = !!props.layer.track?.length;
  // Person and what they hold: the clicks come from the first frame (PointPicker) before the cut-out runs.
  const [picking, setPicking] = useState(false);
  const cutOut = (points?: PickedPoint[]) => run(points && points.length > 1 ? 'Cutting out the person and what they hold' : 'Cutting out the person', async (signal) => {
    const r = await cutOutPerson(props.scene, props.layer.id, quality, (s) => setBusy(s), signal, points);
    props.onCommit(r.scene);
    return 'Added the person, cut out, as the top layer: put words and graphics between it and the footage, swap the background, or give it a Sticker outline.';
  });
  // Reframing is for a frame narrower than wide footage: a tall or square scene.
  const wide = frameAspect(props.scene) < 1.3;
  return (
    <Section title="Footage tools">
      <PointPicker open={picking} src={props.layer.src} onCancel={() => setPicking(false)} onDone={(pts) => { setPicking(false); cutOut(pts); }} />
      <SelectField label="Cut-out method" value={quality} options={[
        { value: 'fine', label: 'Standard: fine edges (hair)' },
        { value: 'fast', label: 'Fast: the body only, for drafts' },
        { value: 'rvm', label: `Robust Video Matting: fast and steady${methods && !methods.rvm?.ready ? ' (not installed)' : ''}` },
        { value: 'hold', label: `Person and what they hold${methods && !methods.hold?.ready ? ' (not installed)' : ''}` },
      ]} onChange={(v) => setQuality(v as CutoutMethod)} />
      <p className="field-hint wide">
        {quality === 'hold' ? (methods?.hold?.note ?? 'Click the person and what they hold on the first frame; both are followed through the video. The slowest method; downloads 170 MB of models the first time.')
          : quality === 'rvm' ? (methods?.rvm?.note ?? 'Very fast and steady from frame to frame; downloads a 15 MB model (GPL-3.0) the first time.')
          : quality === 'fast' ? 'A quick outline of the body: good for trying a layout, rough at the hair.'
          : 'Fine edges, hair included: the best looking, about a second a frame without a graphics card.'}
      </p>
      <div className="insp-start wide">
        <button type="button" className="btn small" disabled={!!busy} onClick={() => (quality === 'hold' ? setPicking(true) : cutOut())} title="A see-through copy of the person, above the graphics: words behind them, a new background, paper cut-out, frame break">Cut out the person</button>
        <button type="button" className="btn small" disabled={!!busy} onClick={() => run('Finding the face', async (signal) => {
          props.onCommit(await followFace(props.scene, props.layer.id, (s) => setBusy(s), signal));
          return 'Found the face in every frame. Give any layer the Follow the face preset to keep it there (a circle round the face, a label above the head).';
        })} title="Finds the face in every frame, for the Follow the face preset">{tracked ? 'Find the face again' : 'Follow the face'}</button>
        {wide && <button type="button" className="btn small" disabled={!!busy} onClick={() => run('Reframing', async (signal) => {
          let scene = props.scene;
          if (!tracked) scene = await followFace(scene, props.layer.id, (s) => setBusy(s), signal);
          setBusy('Reframing');
          const r = reframe(scene, props.layer.id, await footageAspect(props.layer.src));
          props.onCommit(r.scene);
          return `Reframed: the footage fills the frame's height and follows the face with ${r.keys} keyframes (the Keyframes clip on this layer). Move or delete a key to change the framing.`;
        })} title="Wide footage in this tall or square frame: fill the frame and keep the face in it as they move (finds the face first if needed). The crop path is ordinary keyframes you can edit">Reframe to follow the face</button>}
        <button type="button" className="btn small" disabled={!!busy} onClick={() => run('Taking the sound out', async () => {
          const r = await useFootageSound(props.scene, props.layer.id);
          props.onCommit(r.scene);
          return 'Added the footage\'s sound as a voice track (select it, Words, to transcribe it for captions).';
        })} title="The footage's sound as a voice track: transcribe it for captions and for timing effects to the words">Use its sound</button>
        <button type="button" className="btn small" disabled={!!busy} onClick={() => run('Separating the voice from the music', async (signal) => {
          const r = await separateFootage(props.scene, props.layer.id, (s) => setBusy(s), signal);
          props.onCommit(r.scene);
          return 'Added the voice and the music as two tracks in step with the footage. Transcribe the voice (select it, Words) for cleaner word times, delete the music to remove it, or keep it: music is lowered under the voice automatically.';
        })} title="The footage's sound as two tracks: the voice, and the music and effects">Separate voice and music</button>
        {busy && <button type="button" className="btn small ghost" onClick={() => abort.current?.abort()}>Stop</button>}
      </div>
      {(busy || note) && <p className="field-hint wide" role="status">{busy ? `${busy}…` : note}</p>}
      {!busy && !note && <p className="field-hint wide">These run in the AI Dev Kit on your computer; nothing is uploaded. {tracked ? 'The face is already found.' : ''}</p>}
    </Section>
  );
}
