import { useCallback, useEffect, useRef, useState } from 'react';
import { cleanTimeline, type PageTimeline } from './pageTimeline';

/**
 * Page mode (Animation Creator, beta): the link to a Unyson+ Live Editor page that opened the Studio with
 * "Animate" (`?connect=unysonplus&mode=page`).
 *
 *   Studio → editor  { type: 'upw-studio:hello', mode: 'page' }   once loaded
 *   editor → Studio  { type: 'upw-studio:page', site, title, url, elements }   the page's elements (again after edits)
 *   editor → Studio  { type: 'upw-studio:page-select', id }       an element was selected on the page
 *   Studio → editor  { type: 'upw-studio:page-select', id }       an element was picked here
 *   Studio → editor  { type: 'upw-studio:page-timeline', timelines, active, t }   the page timelines, after every edit
 *   Studio → editor  { type: 'upw-studio:page-seek', id, t }      show a timeline at t on the page
 *   Studio → editor  { type: 'upw-studio:page-play' | 'upw-studio:page-arm' | 'upw-studio:page-stop', id }
 *   Studio → editor  { type: 'upw-studio:page-save', timelines }  Save to page
 *   editor → Studio  { type: 'upw-studio:page-saved', ok, timelines | message }   its result
 *
 * As in the scene connection, only messages from the window that opened us are accepted, and replies go only to the
 * address that window first answered from.
 */

export interface PageElement {
  id: string;
  /** The element's name in the Live Editor (Heading, Button, Section…). */
  label: string;
  /** How deep it sits in the page (0 = a section). */
  depth: number;
  /** The start of its text, when it has some. */
  text: string;
  /** Its motion from the Animations tab, by card name ("Interactions: hover"). */
  motion: string[];
  /** Where it sits on the page: [x, y, w, h] in CSS pixels from the top left. */
  box: [number, number, number, number] | null;
}

export type PageState =
  | { status: 'none' }
  | { status: 'waiting' }
  | { status: 'connected'; site: string; title: string; url: string; elements: PageElement[]; selected: string;
      /** The timelines the page already had when it connected (the first message only). */
      timelines: PageTimeline[];
      /** The page can store timelines (the Animation Engine is active). */
      canSave: boolean;
      /** The last Save to page: its result, numbered so each one is noticed. */
      saved: { n: number; ok: boolean; message: string } | null }
  | { status: 'closed'; site: string; title: string; elements: PageElement[] };

export const isPageMode = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(location.search).get('connect') === 'unysonplus' &&
  new URLSearchParams(location.search).get('mode') === 'page';

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');

function cleanElements(list: unknown): PageElement[] {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 2000).filter((e) => e && typeof e === 'object' && typeof (e as PageElement).id === 'string').map((e) => {
    const x = e as PageElement;
    return {
      id: str(x.id, 80),
      label: str(x.label, 60) || 'Element',
      depth: Math.max(0, Math.min(12, Number(x.depth) || 0)),
      text: str(x.text, 80),
      motion: Array.isArray(x.motion) ? x.motion.slice(0, 12).map((m) => str(m, 80)).filter(Boolean) : [],
      box: Array.isArray(x.box) && x.box.length === 4 && x.box.every((n) => typeof n === 'number' && isFinite(n))
        ? (x.box.map((n) => Math.round(n)) as [number, number, number, number]) : null,
    };
  });
}

export function usePageConnection() {
  const [wanted] = useState(() => isPageMode() && !!window.opener);
  const [state, setState] = useState<PageState>(wanted ? { status: 'waiting' } : { status: 'none' });
  const partner = useRef<string | null>(null);

  useEffect(() => {
    if (!wanted) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== window.opener || !e.data || typeof e.data.type !== 'string') return;
      if (partner.current && e.origin !== partner.current) return;
      if (e.data.type === 'upw-studio:page') {
        partner.current = e.origin;
        const site = str(e.data.site, 120) || new URL(e.origin).host;
        const elements = cleanElements(e.data.elements);
        const timelines = (Array.isArray(e.data.timelines) ? e.data.timelines : []).slice(0, 50).map(cleanTimeline).filter((t: PageTimeline | null): t is PageTimeline => !!t);
        setState((s) => ({
          status: 'connected', site, title: str(e.data.title, 120), url: str(e.data.url, 500), elements,
          selected: s.status === 'connected' ? s.selected : '',
          timelines: s.status === 'connected' ? s.timelines : timelines,
          canSave: e.data.canSave !== false,
          saved: s.status === 'connected' ? s.saved : null,
        }));
      } else if (e.data.type === 'upw-studio:page-saved') {
        const ok = e.data.ok === true;
        setState((s) => (s.status === 'connected' ? { ...s, saved: { n: (s.saved?.n ?? 0) + 1, ok, message: ok ? '' : str(e.data.message, 300) || 'Save failed' } } : s));
      } else if (e.data.type === 'upw-studio:page-select') {
        const id = str(e.data.id, 80);
        setState((s) => (s.status === 'connected' ? { ...s, selected: id } : s));
      }
    };
    window.addEventListener('message', onMessage);
    const hello = () => window.opener?.postMessage({ type: 'upw-studio:hello', mode: 'page' }, '*');
    hello();
    const retry = setTimeout(() => { if (!partner.current) hello(); }, 1200);
    const watch = setInterval(() => {
      if (!window.opener || window.opener.closed) {
        setState((s) => (s.status === 'connected' ? { status: 'closed', site: s.site, title: s.title, elements: s.elements } : s.status === 'waiting' ? { status: 'none' } : s));
      }
    }, 1500);
    return () => { window.removeEventListener('message', onMessage); clearTimeout(retry); clearInterval(watch); };
  }, [wanted]);

  /** Pick an element: it is selected (and scrolled into view) on the page. */
  const select = useCallback((id: string, scroll = true) => {
    setState((s) => (s.status === 'connected' ? { ...s, selected: id } : s));
    if (partner.current && window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'upw-studio:page-select', id, scroll }, partner.current);
    }
  }, []);

  /** Any other message to the page (timelines, playhead, play / arm / stop). */
  const send = useCallback((msg: Record<string, unknown>) => {
    if (partner.current && window.opener && !window.opener.closed) window.opener.postMessage(msg, partner.current);
  }, []);

  return { state, select, send };
}
