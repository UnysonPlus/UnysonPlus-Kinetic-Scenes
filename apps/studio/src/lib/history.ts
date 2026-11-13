import { useCallback, useReducer } from 'react';

/**
 * Undo history for the scene. Ordinary edits are commits. A drag (moving a clip, resizing a layer)
 * is a gesture: it updates the scene many times while it runs but becomes one undo step when it ends.
 */

interface State<T> {
  past: T[];
  present: T;
  future: T[];
  /** The scene before the current gesture began, if one is running. */
  gestureBase: T | null;
}

type Action<T> =
  | { type: 'commit'; next: T }
  | { type: 'live'; next: T }
  | { type: 'begin' }
  | { type: 'end' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; next: T };

const LIMIT = 200;

function reducer<T>(s: State<T>, a: Action<T>): State<T> {
  switch (a.type) {
    case 'commit':
      if (a.next === s.present) return s;
      return { past: [...s.past, s.present].slice(-LIMIT), present: a.next, future: [], gestureBase: null };
    case 'begin':
      return s.gestureBase ? s : { ...s, gestureBase: s.present };
    case 'live':
      return { ...s, present: a.next };
    case 'end':
      if (!s.gestureBase) return s;
      if (s.gestureBase === s.present) return { ...s, gestureBase: null };
      return { past: [...s.past, s.gestureBase].slice(-LIMIT), present: s.present, future: [], gestureBase: null };
    case 'undo': {
      if (!s.past.length) return s;
      const prev = s.past[s.past.length - 1];
      return { past: s.past.slice(0, -1), present: prev, future: [s.present, ...s.future], gestureBase: null };
    }
    case 'redo': {
      if (!s.future.length) return s;
      const [next, ...rest] = s.future;
      return { past: [...s.past, s.present], present: next, future: rest, gestureBase: null };
    }
    case 'reset':
      return { past: [], present: a.next, future: [], gestureBase: null };
  }
}

/**
 * `settle` runs on every new scene before it is kept (word pins re-timing what is pinned to a changed voice), so the
 * editor always shows the times the scene plays at. It returns the same value when nothing changed.
 */
export function useHistory<T>(initial: () => T, settle: (next: T) => T = (x) => x) {
  const [state, dispatch] = useReducer(reducer as (s: State<T>, a: Action<T>) => State<T>, undefined, () => ({
    past: [], present: settle(initial()), future: [], gestureBase: null,
  }));
  return {
    present: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    commit: useCallback((next: T) => dispatch({ type: 'commit', next: settle(next) }), [settle]),
    begin: useCallback(() => dispatch({ type: 'begin' }), []),
    live: useCallback((next: T) => dispatch({ type: 'live', next: settle(next) }), [settle]),
    end: useCallback(() => dispatch({ type: 'end' }), []),
    undo: useCallback(() => dispatch({ type: 'undo' }), []),
    redo: useCallback(() => dispatch({ type: 'redo' }), []),
    reset: useCallback((next: T) => dispatch({ type: 'reset', next: settle(next) }), [settle]),
  };
}
