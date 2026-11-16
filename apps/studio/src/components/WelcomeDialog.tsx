import { useEffect, useRef } from 'react';

/**
 * The welcome video: a 3-minute tour of Kinetic Scenes (why it saves your AI work, the workspace, HTML vs MP4, how to
 * start the AI Dev Kit and connect your AI). Shown once, in front of the start box, to a first-time visitor who did not
 * arrive through a project or scene link; Help › Watch the intro and the start box open it again.
 * The video is on YouTube (privacy-enhanced embed, loaded only while the dialog is open). It does not autoplay: a muted
 * autoplay makes YouTube force its automatic captions on top of the subtitles already in the picture, so the visitor
 * presses play and hears it with sound.
 */
export const WELCOME_VIDEO_ID = 'GyLvSuLcbuU';
export const WELCOME_VIDEO_URL = `https://www.youtube.com/watch?v=${WELCOME_VIDEO_ID}`;
const KEY = 'upw-welcome-seen';

export function welcomeSeen(): boolean {
  try { return !!localStorage.getItem(KEY); } catch { return true; }
}
export function markWelcomeSeen() {
  try { localStorage.setItem(KEY, '1'); } catch { /* private window */ }
}

export function WelcomeDialog(props: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
    if (props.open) markWelcomeSeen();
  }, [props.open]);

  const src = `https://www.youtube-nocookie.com/embed/${WELCOME_VIDEO_ID}?rel=0&playsinline=1&cc_load_policy=0&iv_load_policy=3`;
  return (
    <dialog ref={ref} className="export welcome-dialog" aria-labelledby="welcome-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="welcome-title">Welcome to Kinetic Scenes</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <p className="welcome-lead">A 3-minute tour: why it saves your AI work, the workspace, and how to connect the AI you already have.</p>
        <div className="welcome-video">
          {props.open && (
            <iframe src={src} title="Welcome to Kinetic Scenes: a quick tour and setup" loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          )}
        </div>
        <footer className="welcome-foot">
          <span className="field-hint">Press play to watch it with sound. Help › Watch the intro shows it again.</span>
          <div className="welcome-actions">
            <a className="btn small ghost" href={WELCOME_VIDEO_URL} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
            <button type="button" className="btn small" onClick={props.onClose}>Start making</button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
