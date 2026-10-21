import type { Scene, VideoFormat, VideoLayer, VideoSettings } from '@unysonplus/scene-player/types';
import { PLATFORM_LIMITS, VIDEO_FORMATS } from '@unysonplus/scene-player/video';
import { CheckField, NumberField, Section, SelectField, TextField } from './fields';
import { Segmented } from './Segmented';
import { setVideo, toVideo, toWeb } from '../lib/videoMode';

const FORMATS = Object.keys(VIDEO_FORMATS) as VideoFormat[];

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
          <CheckField label="See-through background (graphics to lay over footage)" checked={!!v.transparent} onChange={(x) => set({ transparent: x || undefined })} />
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
      <CheckField label="Reference only (left out of a graphics-only export)" checked={!!layer.reference} onChange={(x) => set({ reference: x || undefined })} />
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
