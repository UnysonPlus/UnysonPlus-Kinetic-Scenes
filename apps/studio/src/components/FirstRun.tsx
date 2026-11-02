import { useEffect, useState } from 'react';

/**
 * Your first scene in two minutes: a guided first run for new visitors. A small card walks through four steps (pick a
 * starting point, change the words, watch it play, export) and outlines the part of the Studio a step is about (the
 * first needs none: its button opens the templates).
 * Shown until "Don’t show again" or Done; the × closes it for now (it comes back next visit). Help › "Your first scene"
 * opens it again.
 */
const KEY = 'upw-first-run-done';

const STEPS: Array<{ title: string; body: string; target?: string; action?: 'templates' }> = [
  { title: 'Pick a starting point', body: 'Start from a template: a website hero, a product reveal, pricing, a social promo or an explainer, in the style you like.', action: 'templates' },
  { title: 'Change the words', body: 'Click any text on the stage, then type your own words in the Inspector on the right. Pictures change the same way.', target: '.stagecol' },
  { title: 'Watch it play', body: 'Press play (or the Space bar). The timeline below shows when each part arrives; drag a clip to change its timing.', target: 'button.icon-btn.play' },
  { title: 'Export it', body: 'Export gives you plain HTML for a web page, or a video for Reels, TikTok, Shorts or YouTube. No account needed.', target: 'button.btn.primary' },
];

export function shouldShowFirstRun(): boolean {
  try { return !localStorage.getItem(KEY); } catch { return false; }
}

export function FirstRun(props: { open: boolean; onClose: () => void; onTemplates: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => { if (props.open) setI(0); }, [props.open]);
  // Outline the part of the Studio this step is about.
  useEffect(() => {
    if (!props.open) return;
    const t = STEPS[i].target;
    const el = t ? document.querySelector<HTMLElement>(t) : null;
    el?.classList.add('first-run-focus');
    // Clear every outline, not only this one: the element may have been replaced while the guide was open.
    return () => document.querySelectorAll('.first-run-focus').forEach((n) => n.classList.remove('first-run-focus'));
  }, [props.open, i]);
  if (!props.open) return null;
  const done = () => { try { localStorage.setItem(KEY, '1'); } catch { /* private window */ } props.onClose(); };
  const step = STEPS[i];
  return (
    <section className="first-run" role="dialog" aria-modal="false" aria-labelledby="first-run-title">
      <button type="button" className="first-run-x" aria-label="Close for now" title="Close for now" onClick={props.onClose}>×</button>
      <p className="first-run-count">Your first scene · step {i + 1} of {STEPS.length}</p>
      <h2 id="first-run-title">{step.title}</h2>
      <p>{step.body}</p>
      <div className="first-run-actions">
        {step.action === 'templates' && <button type="button" className="btn primary" onClick={() => { props.onTemplates(); setI(1); }}>Choose a template</button>}
        {i > 0 && <button type="button" className="btn" onClick={() => setI(i - 1)}>Back</button>}
        {i < STEPS.length - 1 ? <button type="button" className="btn" onClick={() => setI(i + 1)}>{step.action ? 'Skip' : 'Next'}</button>
          : <button type="button" className="btn primary" onClick={done}>Done</button>}
        <button type="button" className="first-run-close" onClick={done}>Don’t show again</button>
      </div>
    </section>
  );
}
