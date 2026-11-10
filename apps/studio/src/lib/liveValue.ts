import { memo, useCallback, useRef, useSyncExternalStore, type ComponentType } from 'react';

/**
 * A value that changes every frame (the playhead), shared without re-rendering whole panels: only the small parts
 * that show it subscribe. A long scene's timeline has thousands of rows, and re-drawing them on every frame of
 * playback is what made long scenes stutter.
 */
export interface LiveValue<T> { get: () => T; set: (v: T) => void; subscribe: (fn: () => void) => () => void }

export function liveValue<T>(initial: T): LiveValue<T> {
  let v = initial;
  const subs = new Set<() => void>();
  return {
    get: () => v,
    set: (next) => { if (Object.is(next, v)) return; v = next; subs.forEach((f) => f()); },
    subscribe: (fn) => { subs.add(fn); return () => { subs.delete(fn); }; },
  };
}

export const useLive = <T,>(lv: LiveValue<T>): T => useSyncExternalStore(lv.subscribe, lv.get, lv.get);

/**
 * Wraps a set of callbacks in stable functions that always call the latest ones: a memoized panel can then be skipped
 * when only callback identities changed, without ever calling an old callback.
 */
export function useStableCallbacks<T extends Record<string, ((...a: never[]) => unknown) | undefined>>(fns: T): T {
  const latest = useRef(fns);
  latest.current = fns;
  const cache = useRef<Record<string, unknown>>({});
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(fns)) {
    if (!fns[k]) { out[k] = undefined; continue; }
    if (!cache.current[k]) cache.current[k] = (...a: unknown[]) => (latest.current[k] as ((...x: unknown[]) => unknown) | undefined)?.(...a);
    out[k] = cache.current[k];
  }
  return out as T;
}

/** A component that re-renders only when a non-function prop changes (its callbacks must be plain state setters). */
export function memoIgnoringCallbacks<P extends object>(C: ComponentType<P>) {
  return memo(C, (a, b) => {
    const ka = Object.keys(a) as Array<keyof P>;
    if (ka.length !== Object.keys(b).length) return false;
    return ka.every((k) => (typeof a[k] === 'function' && typeof b[k] === 'function') || Object.is(a[k], b[k]));
  });
}

export { useCallback };
