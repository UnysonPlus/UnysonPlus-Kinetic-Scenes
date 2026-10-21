import { useEffect, useRef, useState } from 'react';
import type { Layer, Scene, VideoFormat } from '@unysonplus/scene-player/types';
import { VIDEO_FORMATS } from '@unysonplus/scene-player/video';
import { VIDEO_SIZES, canRender, renderVideo, type RenderCheck, type VideoOptions } from '../lib/video';
import { DownloadIcon } from './icons';

const GUIDE = 'https://docs.unysonplus.com/guides/set-up-ai-for-unysonplus';
const KIT_REPO = 'https://github.com/UnysonPlus/UnysonPlus-AI-Dev-Kit';

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const hasReference = (list: Layer[]): boolean => list.some((l) => (l.type === 'video' && !!l.reference) || (l.type === 'group' && hasReference(l.layers)));

/**
 * Export → Video: an MP4, WebM or ProRes file rendered frame by frame by the AI Dev Kit on this computer.
 * A web scene picks a size (and so a layout); a video scene exports its own formats, one or all of them.
 */
export function VideoSection(props: { scene: Scene; open: boolean; onDone: (note: string) => void }) {
  const video = props.scene.mode === 'video' && props.scene.video ? props.scene.video : null;
  const formats = video?.formats ?? [];
  const [check, setCheck] = useState<RenderCheck | null>(null);
  const [size, setSize] = useState(video ? (formats.length > 1 ? 'all' : formats[0]) : '1080p');
  const [fps, setFps] = useState(video?.fps ?? 30);
  const [format, setFormat] = useState<VideoOptions['format']>(video?.transparent ? 'webm' : 'mp4');
  const [transparent, setTransparent] = useState(!!video?.transparent);
  const [composite, setComposite] = useState(false);
  const [cover, setCover] = useState(!!video);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const refs = hasReference(props.scene.layers);

  useEffect(() => {
    if (!props.open) return;
    setCheck(null);
    canRender().then(setCheck);
    // Each time it opens, start from the scene's own settings (its formats may have changed since).
    if (video) {
      setSize(formats.length > 1 ? 'all' : formats[0]);
      setFps(video.fps ?? 30);
      setTransparent(!!video.transparent);
      setCover(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);
  // MP4 has no transparency: a see-through export is WebM or ProRes.
  useEffect(() => { if (transparent && format === 'mp4') setFormat('webm'); }, [transparent, format]);

  /** The sizes to render: the chosen one, or every format of a video. */
  const jobs: Array<{ width: number; height: number; label: string }> = video
    ? (size === 'all' ? formats : [size as VideoFormat]).filter((f) => VIDEO_FORMATS[f]).map((f) => ({ width: VIDEO_FORMATS[f].width, height: VIDEO_FORMATS[f].height, label: VIDEO_FORMATS[f].label }))
    : [VIDEO_SIZES.find((v) => v.id === size) ?? VIDEO_SIZES[0]].map((s) => ({ width: s.width, height: s.height, label: s.label }));
  const frames = Math.round(props.scene.duration * fps);

  const start = async () => {
    setError(null);
    const ctl = new AbortController();
    abort.current = ctl;
    const notes: string[] = [];
    try {
      for (const [i, j] of jobs.entries()) {
        setProgress({ done: 0, total: frames, label: jobs.length > 1 ? `${j.label} (${i + 1} of ${jobs.length})` : '' });
        const r = await renderVideo(props.scene, { width: j.width, height: j.height, fps, format, transparent, composite, cover: cover && i === 0 },
          (done, total) => setProgress((p) => ({ done, total, label: p?.label ?? '' })), ctl.signal);
        save(r.blob, r.name);
        if (r.cover) save(r.cover.blob, r.cover.name);
        notes.push(`${r.name} (${(r.blob.size / 1048576).toFixed(1)} MB)`);
        if (r.warnings.length) notes.push(`rendered without ${r.warnings.slice(0, 3).join(', ')} (it did not load in time)`);
      }
      props.onDone(`Saved to your downloads: ${notes.join('; ')}${cover ? ', and the cover image' : ''}.`);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setProgress(null);
      abort.current = null;
    }
  };

  const busy = progress !== null;
  const pct = progress && progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <section className="export-opt">
      <h3>Video</h3>
      <p>
        {video
          ? 'The finished video, in each format it is made in. See-through exports are graphics only, ready to lay over your footage in a video editor. '
          : 'An MP4 or WebM for social posts, presentations or anywhere HTML can\'t go. The size picks the layout: a vertical video uses the scene\'s mobile layout. '}
        The AI Dev Kit on this computer renders it frame by frame, so every frame is exact.
      </p>
      {check && !check.ok && (
        <p className="export-warn">
          {check.reason === 'kit' && <>Video export runs through the <a href={KIT_REPO} target="_blank" rel="noopener noreferrer"><strong>AI Dev Kit</strong></a> on your computer. <a href={GUIDE} target="_blank" rel="noopener noreferrer">Set it up</a>, start it (start.bat or start.command), then open Export again.</>}
          {check.reason === 'outdated' && <>Your AI Dev Kit needs an update for video export. Close it and start it again: it updates itself.</>}
          {check.reason === 'ffmpeg' && <>The AI Dev Kit needs <strong>ffmpeg</strong> to make videos. Install it (Windows: <code>winget install Gyan.FFmpeg</code>; macOS: <code>brew install ffmpeg</code>), restart the kit, then open Export again.</>}
        </p>
      )}
      <div className="video-opts">
        <label className="field">
          <span>{video ? 'Format' : 'Size'}</span>
          <select value={size} onChange={(e) => setSize(e.target.value)} disabled={busy}>
            {video
              ? <>
                {formats.length > 1 && <option value="all">All {formats.length} formats</option>}
                {formats.map((f) => <option key={f} value={f}>{VIDEO_FORMATS[f].label}, {VIDEO_FORMATS[f].width} × {VIDEO_FORMATS[f].height}</option>)}
              </>
              : VIDEO_SIZES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Frame rate</span>
          <select value={fps} onChange={(e) => setFps(Number(e.target.value) as typeof fps)} disabled={busy}>
            {[24, 25, 30, 50, 60].map((f) => <option key={f} value={f}>{f} fps</option>)}
          </select>
        </label>
        <label className="field">
          <span>File</span>
          <select value={format} onChange={(e) => setFormat(e.target.value as VideoOptions['format'])} disabled={busy}>
            {!transparent && <option value="mp4" title="H.264: plays everywhere">MP4</option>}
            <option value="webm" title="VP9: smaller files; keeps transparency">WebM</option>
            <option value="mov" title="ProRes: for video editors (CapCut, Premiere, DaVinci Resolve); ProRes 4444 keeps transparency">ProRes (.mov)</option>
          </select>
        </label>
      </div>
      <div className="video-checks">
        {video && (
          <label className="check"><input type="checkbox" checked={transparent} disabled={busy} onChange={(e) => setTransparent(e.target.checked)} /> See-through background (graphics only)</label>
        )}
        {refs && (
          <label className="check"><input type="checkbox" checked={composite} disabled={busy} onChange={(e) => setComposite(e.target.checked)} /> Include the reference footage (the full composite)</label>
        )}
        <label className="check"><input type="checkbox" checked={cover} disabled={busy} onChange={(e) => setCover(e.target.checked)} /> Cover image too (the still frame, as a PNG)</label>
      </div>
      {busy ? (
        <div className="export-row">
          <div className="video-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div>
          <span className="export-meta">{progress!.label ? `${progress!.label}: ` : ''}{progress!.done} / {progress!.total} frames</span>
          <button type="button" className="btn small" onClick={() => abort.current?.abort()}>Stop</button>
        </div>
      ) : (
        <div className="export-row">
          <button type="button" className="btn primary" onClick={start} disabled={!check?.ok}>
            <DownloadIcon /> {jobs.length > 1 ? `Render ${jobs.length} videos` : 'Render video'}
          </button>
          <span className="export-meta">{frames} frames, {props.scene.duration} s{check === null ? ' · looking for the AI Dev Kit…' : ''}</span>
        </div>
      )}
      {error && <p className="export-error" role="alert">{error}</p>}
    </section>
  );
}
