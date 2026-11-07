import { useEffect, useRef, useState } from 'react';
import { FFMPEG_LINK, ffmpegStatus, installFfmpeg, type FfmpegInstall, type FfmpegStatus } from '../lib/ffmpeg';

/**
 * FFmpeg isn't on this computer and something needs it: says so at that moment, with a button for the AI Dev Kit to
 * install it and a direct link for anyone who prefers to do it themselves. Used wherever FFmpeg is needed.
 */
export function FfmpegNotice(props: { what: string; onReady?: () => void }) {
  const [status, setStatus] = useState<FfmpegStatus | null>(null);
  const [install, setInstall] = useState<FfmpegInstall | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    let on = true;
    ffmpegStatus().then((s) => {
      if (!on) return;
      setStatus(s);
      if (s?.install?.state === 'running') setInstall(s.install);
    });
    return () => { on = false; abort.current?.abort(); };
  }, []);

  const start = async () => {
    setError('');
    setInstall({ state: 'running', step: 'Starting', done: 0, total: 0, error: '' });
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      await installFfmpeg(setInstall, ctl.signal);
      if (ctl.signal.aborted) return;
      setDone(true);
      props.onReady?.();
    } catch (e) {
      setInstall(null);
      setError((e as Error).message);
    }
  };

  if (done) return <p className="ffmpeg-notice" role="status">FFmpeg is installed.</p>;
  const running = install?.state === 'running';
  const percent = install?.total ? Math.round((install.done / install.total) * 100) : null;
  const link = status?.link ?? FFMPEG_LINK;
  return (
    <div className="ffmpeg-notice">
      <p>{props.what} needs <strong>FFmpeg</strong>, a free video tool that isn&apos;t on this computer yet.</p>
      {!status && <p className="addon-detail">Update the AI Dev Kit and it can install FFmpeg for you, or install it yourself and restart the kit.</p>}
      {status && !status.canInstall && <p className="addon-detail">Install it yourself, then restart the kit. On a Mac: <code>brew install ffmpeg</code>.</p>}
      {running && (
        <div className="ffmpeg-progress" role="status">
          <span>{install.step}{percent !== null ? ` ${percent}%` : '…'}</span>
          <progress value={percent ?? undefined} max={100} aria-label="Installing FFmpeg" />
        </div>
      )}
      {error && <p className="export-warn" role="alert">{error}</p>}
      {!running && (
        <div className="export-row">
          {status?.canInstall && (
            <button type="button" className="btn small primary" onClick={start}>
              Install FFmpeg{status.mb ? ` (about ${status.mb} MB)` : ''}
            </button>
          )}
          <a className="addon-link" href={link} target="_blank" rel="noopener noreferrer">Get it yourself</a>
        </div>
      )}
    </div>
  );
}
