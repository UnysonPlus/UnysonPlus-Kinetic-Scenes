import { useEffect, useRef } from 'react';

const MOD = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

/** Help › Keyboard shortcuts: every shortcut, in the Studio itself (the manual has the same list). */
const ROWS: Array<[string, string]> = [
  ['Space', 'Play or pause'],
  ['Home', 'Go to the start'],
  [', and .', 'Step one frame back or forward (Shift: one second)'],
  ['Arrow keys', 'Nudge the selected layer (Shift: further), move the selected clip in time, or step the playhead'],
  ['Delete', 'Delete the selected clip or layer'],
  [`${MOD}+Z, ${MOD}+Shift+Z`, 'Undo, redo'],
  [`${MOD}+D`, 'Duplicate the selected layer'],
  [`${MOD}+G, ${MOD}+Shift+G`, 'Group the selected layers, ungroup the selected group'],
  ['Double-click a group', 'Open it: its layers on its own clock (Escape steps back out)'],
  [`${MOD}+S`, 'Save the project'],
  [`Shift or ${MOD} + click (stage)`, 'Add a layer to (or remove it from) the selection'],
  ['Click, then Shift + click (timeline)', 'Select every layer between the two rows'],
  ['Drag on empty stage', 'Box-select the layers it touches'],
  [`${MOD}+A`, 'Select every unlocked layer'],
  ['F2, or double-click a layer name', 'Rename it'],
  ['Right-click a timeline row', 'Rename, open group, duplicate, group, lock, delete'],
  ['F', 'Play full screen (presenter mode for click-to-advance scenes)'],
  ['M', 'Add a marker at the playhead'],
  ['Escape', 'Clear the selection'],
  ['Alt while dragging', 'Turn snapping off'],
];

export function ShortcutsDialog(props: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);
  return (
    <dialog ref={ref} className="export addons shortcuts-dialog" aria-labelledby="keys-title" onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}>
      <div className="export-inner">
        <header className="export-head">
          <h2 id="keys-title">Keyboard shortcuts</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>
        <table className="shortcuts-table">
          <tbody>
            {ROWS.map(([k, d]) => <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{d}</td></tr>)}
          </tbody>
        </table>
      </div>
    </dialog>
  );
}
