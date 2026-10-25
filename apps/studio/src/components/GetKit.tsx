export const KIT_REPO = 'https://github.com/UnysonPlus/UnysonPlus-AI-Dev-Kit';
export const KIT_GUIDE = 'https://docs.unysonplus.com/guides/set-up-ai-for-unysonplus';

/**
 * Shown wherever the Studio needs the AI Dev Kit and cannot find it: what the kit is, where to get it, how to set it
 * up, and a way to look again once it is running.
 */
export function GetKit(props: { lead?: string; onCheck?: () => void; busy?: boolean }) {
  return (
    <div className="get-kit" role="status">
      <p>
        {props.lead ?? 'Add-ons run through the AI Dev Kit'}, a free helper you install once on your computer. It adds
        voices, music, transcription and more, and nothing is uploaded.
      </p>
      <div className="export-row">
        <a className="btn small primary" href={KIT_REPO} target="_blank" rel="noopener noreferrer">Get the AI Dev Kit</a>
        <a className="btn small ghost" href={KIT_GUIDE} target="_blank" rel="noopener noreferrer">How to set it up</a>
        {props.onCheck && <button type="button" className="btn small ghost" disabled={props.busy} onClick={props.onCheck}>Check again</button>}
      </div>
      <p className="addon-detail">
        Already installed? Start it (start.bat or start.command). If the browser asks to let this site reach apps on
        your device, choose Allow.
      </p>
    </div>
  );
}
