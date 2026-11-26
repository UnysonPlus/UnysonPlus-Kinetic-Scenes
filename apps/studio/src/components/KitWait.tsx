import { SECURE_KIT, type KitStatus } from '../lib/ai';
import { KIT_GUIDE, KIT_REPO } from './GetKit';

/**
 * Over the stage while a workspace project's files cannot be reached. A project made by an agent (or saved from the
 * Studio) keeps its pictures, footage and voice in a folder on this computer, and the AI Dev Kit plays them to the
 * Studio. Without the kit the words still show (they are in the scene) but nothing else does, which looked like a
 * broken scene to someone who had never heard of the kit. So this says why, what to do, and the page reloads by
 * itself once the kit answers (App.tsx watches for it).
 */
export function KitWait(props: {
  project: string;
  /** "open": the kit was not there when the project opened; "lost": it stopped while the project was open. */
  reason: 'open' | 'lost';
  status: KitStatus | null;
  /** Edits made since the kit went away: the page does not reload by itself over them. */
  unsaved: boolean;
  onCheck: () => void;
  onClose: () => void;
}) {
  const s = props.status?.state;
  return (
    <div className="kit-wait" role="alertdialog" aria-labelledby="kit-wait-title">
      <div className="kit-wait-card">
        <h2 id="kit-wait-title">
          {props.reason === 'lost' ? 'The AI Dev Kit stopped' : 'Start the AI Dev Kit to play this project'}
        </h2>
        <p>
          The pictures, footage and voice of <strong>“{props.project}”</strong> are kept in a folder on this computer, and
          the <strong>AI Dev Kit</strong> plays them here. {props.reason === 'lost'
            ? 'It has stopped, so they cannot load and your changes cannot be saved to the project.'
            : 'It is not running, so only the words of the scene can show.'}
        </p>
        {s === 'ready' || s === 'off' ? (
          <p className="kit-wait-step">
            <b>The kit is running again.</b> Refresh this page to load the project's pictures, footage and voice.
          </p>
        ) : s === 'blocked' ? (
          <p className="kit-wait-step">
            <b>Your browser is blocking this site from reaching the kit.</b> Click the icon at the left of the address
            bar, allow <strong>apps on this device</strong> (local network access), then refresh this page.
          </p>
        ) : s === 'trust' ? (
          <p className="kit-wait-step">
            <b>Safari needs one step the first time.</b> With the kit running, open{' '}
            <a href={`${SECURE_KIT}/health`} target="_blank" rel="noopener noreferrer">its secure address</a>, choose
            <strong> Show Details</strong>, then <strong>visit this website</strong> (it is your own computer), and come back.
          </p>
        ) : s === 'outdated' ? (
          <p className="kit-wait-step">
            <b>Your AI Dev Kit is too old to open projects.</b> Close it and start it again (start.bat or start.command):
            it updates itself.
          </p>
        ) : (
          <p className="kit-wait-step">
            <b>Start the kit:</b> in the AI Dev Kit folder, double-click <code>start.bat</code> (Windows) or
            <code> start.command</code> (Mac). If the browser asks to let this site reach apps on your device, choose
            <strong> Allow</strong>.
          </p>
        )}
        <p className="kit-wait-auto" role="status">
          <span className="kit-wait-dot" aria-hidden="true" />
          {props.unsaved
            ? 'Once the kit is running, refresh this page. (It does not refresh by itself, so the changes you made meanwhile are not lost without asking.)'
            : 'This page refreshes by itself as soon as the kit is running. If it does not, refresh it (F5).'}
        </p>
        <div className="export-row">
          <button type="button" className="btn small primary" onClick={props.onCheck}>I started it: check now</button>
          <a className="btn small ghost" href={KIT_REPO} target="_blank" rel="noopener noreferrer">Get the AI Dev Kit (free)</a>
          <a className="btn small ghost" href={KIT_GUIDE} target="_blank" rel="noopener noreferrer">How to set it up</a>
          <button type="button" className="btn small ghost" onClick={props.onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
