import { useCallback, useEffect, useRef, useState } from 'react';
import { validateScene } from '@unysonplus/scene-player/validate';
import type { Scene } from '@unysonplus/scene-player/types';

/**
 * The link to a Unyson+ page editor that opened the Studio ("Open in Kinetic Scenes").
 *
 *   Studio → editor  { type: 'upw-studio:hello' }          once loaded (no data)
 *   editor → Studio  { type: 'upw-studio:scene', scene }    the element's scene, or null for a new one
 *   Studio → editor  { type: 'upw-studio:save', scene }     "Save to page"
 *   editor → Studio  { type: 'upw-studio:saved' }
 *
 * Only messages from the window that opened us are accepted, and replies go only to that window's
 * address (learned from its first reply), so the scene never goes anywhere else.
 */

export type ConnectionState =
  | { status: 'none' }
  | { status: 'waiting' }
  | { status: 'connected'; site: string; saved: boolean }
  | { status: 'closed'; site: string };

export function useEditorConnection(onScene: (scene: Scene) => void) {
  // Decided once at start: once the editor closes, window.opener goes null, and we still need to notice.
  // (A link with mode=page came from the retired page mode: page timelines are made in the Live Editor's own Animate
  // workspace now, so it is ignored.)
  const [wanted] = useState(() => typeof window !== 'undefined' && new URLSearchParams(location.search).get('connect') === 'unysonplus' && new URLSearchParams(location.search).get('mode') !== 'page' && !!window.opener);
  const [state, setState] = useState<ConnectionState>(wanted ? { status: 'waiting' } : { status: 'none' });
  const partner = useRef<string | null>(null);
  const onSceneRef = useRef(onScene);
  onSceneRef.current = onScene;

  useEffect(() => {
    if (!wanted) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== window.opener || !e.data || typeof e.data.type !== 'string') return;
      if (e.data.type === 'upw-studio:scene') {
        partner.current = e.origin;
        const site = typeof e.data.site === 'string' ? e.data.site : new URL(e.origin).host;
        if (e.data.scene) {
          const r = validateScene(e.data.scene);
          if (r.ok) onSceneRef.current(r.scene);
        }
        setState({ status: 'connected', site, saved: false });
      } else if (e.data.type === 'upw-studio:saved') {
        setState((s) => (s.status === 'connected' ? { ...s, saved: true } : s));
      }
    };
    window.addEventListener('message', onMessage);
    // Say hello (carries nothing), and again shortly in case the editor's listener was still starting.
    const hello = () => window.opener?.postMessage({ type: 'upw-studio:hello' }, '*');
    hello();
    const retry = setTimeout(() => { if (!partner.current) hello(); }, 1200);
    // Notice when the page editor goes away.
    const watch = setInterval(() => {
      if (!window.opener || window.opener.closed) {
        setState((s) => (s.status === 'connected' ? { status: 'closed', site: s.site } : s.status === 'waiting' ? { status: 'none' } : s));
      }
    }, 1500);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(retry);
      clearInterval(watch);
    };
  }, [wanted]);

  const save = useCallback((scene: Scene) => {
    if (!partner.current || !window.opener || window.opener.closed) return false;
    window.opener.postMessage({ type: 'upw-studio:save', scene }, partner.current);
    return true;
  }, []);

  /** Marks the page copy as out of date after an edit. */
  const touched = useCallback(() => setState((s) => (s.status === 'connected' && s.saved ? { ...s, saved: false } : s)), []);

  return { state, save, touched };
}
