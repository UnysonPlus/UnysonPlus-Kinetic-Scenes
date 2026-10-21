import type { LintIssue } from '@unysonplus/scene-player/lint';
import type { LayoutIssue } from '@unysonplus/scene-player/layout';

/**
 * Check scene: what could be better about the scene, with a one-click fix where there is a sure one.
 * The same checks run on everything the AI makes, so this list is also where refining an AI scene
 * starts. Check the layout measures the stage itself at the moment each part has landed.
 */
export function CheckPanel(props: {
  issues: LintIssue[];
  aiReady: boolean;
  onFix: (issue: LintIssue) => void;
  onFixAll: () => void;
  onShow: (issue: LintIssue) => void;
  onAskAi: () => void;
  layout: { running: boolean; issues: LayoutIssue[]; done: boolean };
  onCheckLayout: () => void;
  onShowLayout: (issue: LayoutIssue) => void;
}) {
  const { issues, layout } = props;
  const fixable = issues.filter((i) => i.fix).length;
  const total = issues.length + layout.issues.length;
  return (
    <div className="insp check">
      <div className="insp-head">
        <p className="insp-kicker">Check scene</p>
        <h2 className="insp-title-static">{total ? `${total} thing${total === 1 ? '' : 's'} to look at` : 'Nothing to fix'}</h2>
        <p className="insp-help">
          Timing, readability and layout rules from professional motion design: text stays up long enough to read, is big
          enough on every screen, stays on the stage, and clips don't fight. Checked as you work.
        </p>
      </div>

      {total > 0 && (
        <div className="check-actions">
          {fixable > 1 && <button type="button" className="btn small" onClick={props.onFixAll}>Apply all {fixable} fixes</button>}
          <button type="button" className="btn small ai-btn" onClick={props.onAskAi} title={props.aiReady ? 'Ask the AI to fix these' : 'Opens AI assist (needs the AI Dev Kit)'}>
            <span aria-hidden="true">✦</span> Fix with AI
          </button>
        </div>
      )}

      <div className="check-layout">
        <div className="check-layout-head">
          <p className="insp-help">
            <strong>Layout.</strong> Measures the stage at the moment each part has landed: words on words, ticks far from
            their words, uneven or off-centre lists, words crowding a panel's edge.
          </p>
          <button type="button" className="btn small" onClick={props.onCheckLayout} disabled={layout.running}>
            {layout.running ? 'Checking…' : layout.done ? 'Check again' : 'Check the layout'}
          </button>
        </div>
        {layout.done && !layout.issues.length && <p className="check-empty">The layout checks pass on this screen size.</p>}
        {layout.issues.length > 0 && (
          <ul className="check-list">
            {layout.issues.map((i) => (
              <li key={i.id} className={`check-item is-${i.severity}`}>
                <span className="check-dot" aria-label={i.severity === 'warn' ? 'Problem' : 'Suggestion'} />
                <div className="check-body">
                  <p>{i.message}</p>
                  <div className="check-row">
                    <button type="button" className="link-btn" onClick={() => props.onShowLayout(i)}>Show at {i.t} s</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="check-list">
        {issues.map((i) => (
          <li key={i.id} className={`check-item is-${i.severity}`}>
            <span className="check-dot" aria-label={i.severity === 'warn' ? 'Problem' : 'Suggestion'} />
            <div className="check-body">
              <p>{i.message}</p>
              <div className="check-row">
                {i.layerId && <button type="button" className="link-btn" onClick={() => props.onShow(i)}>Show</button>}
                {i.fix && <button type="button" className="btn small" onClick={() => props.onFix(i)}>{i.fix.label}</button>}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!total && !layout.done && <p className="check-empty">Every check passes. Run Check the layout, then play the scene once more on each screen size before you export.</p>}
    </div>
  );
}
