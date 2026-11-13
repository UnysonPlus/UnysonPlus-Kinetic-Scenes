import { useEffect, useRef, useState } from 'react';
import { validateScene } from '@unysonplus/scene-player/validate';
import type { Scene } from '@unysonplus/scene-player/types';
import { formatScene } from '../lib/format';
import { kitify } from './KitLink';

/**
 * The scene file as text. It follows the editor while you are not typing in it; a valid edit here
 * becomes an ordinary (undoable) change, and while the text is invalid the problems are listed and
 * the scene stays as it was.
 */
export function ScenePanel(props: { scene: Scene; onCommit: (scene: Scene) => void }) {
  const [text, setText] = useState(() => formatScene(props.scene));
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const focused = useRef(false);
  const lastCommitted = useRef(props.scene);

  // Follow the editor when the scene changes elsewhere.
  useEffect(() => {
    if (focused.current || props.scene === lastCommitted.current) return;
    lastCommitted.current = props.scene;
    setText(formatScene(props.scene));
    setErrors([]);
    setWarnings(validateScene(props.scene).warnings);
  }, [props.scene]);

  useEffect(() => {
    setWarnings(validateScene(props.scene).warnings);
    // Only on mount; later warnings come from edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate typing after a short pause; commit when valid and actually different.
  useEffect(() => {
    if (!focused.current) return;
    const t = setTimeout(() => {
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (err) {
        setErrors([`Not valid JSON: ${(err as Error).message}`]);
        return;
      }
      const r = validateScene(data);
      setErrors(r.errors);
      setWarnings(r.warnings);
      if (r.ok && JSON.stringify(r.scene) !== JSON.stringify(props.scene)) {
        lastCommitted.current = r.scene;
        props.onCommit(r.scene);
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const state = errors.length ? 'error' : warnings.length ? 'warn' : 'ok';
  const layers = props.scene.layers.length;
  const clips = props.scene.layers.reduce((n, l) => n + l.clips.length, 0);

  return (
    <div className="scenefile">
      <p className="panel-help">The whole scene as JSON. Edit it directly, or keep it open to see what the editor writes.</p>
      <div className={`status status-${state}`} role="status">
        <span className="status-dot" aria-hidden="true" />
        {errors.length
          ? `${errors.length} ${errors.length === 1 ? 'problem' : 'problems'}: the scene keeps its last valid version`
          : `Valid scene: ${layers} layers, ${clips} clips, ${props.scene.duration} s`}
      </div>
      {(errors.length > 0 || warnings.length > 0) && (
        <ul className="issues">
          {errors.map((e) => <li key={`e${e}`} className="issue-error">{kitify(e)}</li>)}
          {warnings.map((w) => <li key={`w${w}`} className="issue-warn">{kitify(w)}</li>)}
        </ul>
      )}
      <label htmlFor="scene-json" className="sr-only">Scene file (JSON)</label>
      <textarea
        id="scene-json"
        className="code"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => { focused.current = true; }}
        onBlur={() => {
          focused.current = false;
          if (!errors.length) setText(formatScene(props.scene));
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-invalid={errors.length > 0}
      />
    </div>
  );
}
