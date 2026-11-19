import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import type { LiveValue } from './liveValue';
import type { PageState } from './pageConnection';
import {
  addTrack, forPage, layerIdFor, newTimeline, newTimelineId, retarget as retargetTl, sceneFromTimeline, signature, targetOf, timelineFromScene,
  type PageTimeline, type PageTrigger,
} from './pageTimeline';
import { isKeyframes } from './keyframes';

interface Opts {
  state: PageState;
  select: (id: string, scroll?: boolean) => void;
  send: (msg: Record<string, unknown>) => void;
  scene: Scene;
  commit: (s: Scene) => void;
  reset: (s: Scene) => void;
  clock: LiveValue<number>;
  selectedLayer: string | null;
  setSelection: (s: { layerId: string | null; clipId: string | null }) => void;
}

/**
 * Page mode's timelines: the one being edited is the scene (see pageTimeline.ts); the others wait in a list. Every
 * edit goes to the page, and the playhead follows on the page's canvas.
 */
export function usePageTimelines(o: Opts) {
  const { state, send, scene } = o;
  const connected = state.status === 'connected';
  const elements = state.status === 'connected' || state.status === 'closed' ? state.elements : [];
  const [list, setList] = useState<PageTimeline[]>([]);
  const [activeId, setActiveId] = useState('');
  const started = useRef(false);
  const [previewing, setPreviewing] = useState(false);
  /** What is saved on the page (its signature), to show unsaved changes; '' until the first list is in. */
  const [savedSig, setSavedSig] = useState('');
  const baseline = useRef(false);
  const pendingSig = useRef('');
  const [saving, setSaving] = useState(false);

  // First connection: the page's own timelines, or a new one.
  useEffect(() => {
    if (state.status !== 'connected' || started.current) return;
    started.current = true;
    const first = state.timelines.length ? state.timelines : [newTimeline()];
    setList(first);
    setActiveId(first[0].id);
    baseline.current = !!state.timelines.length;
    o.reset(sceneFromTimeline(first[0], state.elements));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const meta = list.find((t) => t.id === activeId);
  const active = useMemo(() => (meta ? timelineFromScene(scene, meta) : null), [scene, meta]);
  const all = useMemo(() => list.map((t) => (active && t.id === active.id ? active : t)), [list, active]);
  const sig = useMemo(() => signature(all.filter((t) => t.tracks.length)), [all]);

  // The page's own timelines are the saved state (once they have been through the editor's scene).
  useEffect(() => {
    if (baseline.current && active) { baseline.current = false; setSavedSig(sig); }
  }, [sig, active]);
  const dirty = sig !== (savedSig || signature([]));

  // The result of Save to page.
  const savedN = state.status === 'connected' ? state.saved?.n ?? 0 : 0;
  useEffect(() => {
    if (!savedN || state.status !== 'connected' || !state.saved) return;
    setSaving(false);
    if (state.saved.ok) setSavedSig(pendingSig.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedN]);

  // Every change goes to the page (shown at the playhead).
  useEffect(() => {
    if (!connected || !started.current || !active) return;
    const h = setTimeout(() => {
      send({ type: 'upw-studio:page-timeline', timelines: all.map(forPage), active: active.id, t: o.clock.get() });
      setPreviewing(false);
    }, 60);
    return () => clearTimeout(h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, connected]);

  // The playhead: the page follows it, once a frame at most.
  useEffect(() => {
    if (!connected || !activeId) return;
    let raf = 0;
    const off = o.clock.subscribe(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        send({ type: 'upw-studio:page-seek', id: activeId, t: o.clock.get() });
      });
    });
    return () => { off(); if (raf) cancelAnimationFrame(raf); };
  }, [connected, activeId, o.clock, send]);

  // Selection both ways: a track picked here outlines its element on the page; an element picked there selects its track.
  const pageSelected = state.status === 'connected' ? state.selected : '';
  useEffect(() => {
    const t = targetOf(o.selectedLayer);
    if (t && t !== pageSelected) o.select(t, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.selectedLayer]);
  useEffect(() => {
    if (!pageSelected) return;
    const lid = layerIdFor(pageSelected);
    if (o.selectedLayer !== lid && scene.layers.some((l) => l.id === lid)) {
      const clip = scene.layers.find((l) => l.id === lid)?.clips.find(isKeyframes);
      o.setSelection({ layerId: lid, clipId: clip?.id ?? null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSelected]);

  /** Adds the element as a track (with a starter move) and selects it. */
  const addElement = useCallback((id: string) => {
    if (!active) return;
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const r = addTrack(scene, active, el, elements);
    if (r.scene !== scene) o.commit(r.scene);
    const lid = layerIdFor(id);
    o.setSelection({ layerId: lid, clipId: `${lid}-kf` });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, elements, scene]);

  const switchTo = useCallback((id: string) => {
    const next = all.find((t) => t.id === id);
    if (!next || id === activeId) return;
    setList(all);
    setActiveId(id);
    o.reset(sceneFromTimeline(next, elements));
    o.setSelection({ layerId: null, clipId: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, activeId, elements]);

  const create = useCallback(() => {
    const tl = newTimeline(`Timeline ${all.length + 1}`);
    setList([...all, tl]);
    setActiveId(tl.id);
    o.reset(sceneFromTimeline(tl, elements));
    o.setSelection({ layerId: null, clipId: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, elements]);

  const remove = useCallback(() => {
    const rest = all.filter((t) => t.id !== activeId);
    const next = rest.length ? rest : [newTimeline()];
    setList(next);
    setActiveId(next[0].id);
    o.reset(sceneFromTimeline(next[0], elements));
    o.setSelection({ layerId: null, clipId: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, activeId, elements]);

  /** Name, trigger, repeat and yoyo: the timeline's own settings (not part of the scene). */
  const update = useCallback((patch: Partial<Pick<PageTimeline, 'name' | 'repeat' | 'yoyo' | 'runsOn'>> & { trigger?: Partial<PageTrigger> }) => {
    setList((l) => l.map((t) => (t.id !== activeId ? t : {
      ...t, ...patch, trigger: patch.trigger ? { ...t.trigger, ...patch.trigger } : t.trigger,
    })));
  }, [activeId]);

  /** The length: the scene's, with each track's keyframes clip stretched or cut to match. */
  const setDuration = useCallback((d: number) => {
    const dur = Math.max(0.2, Math.min(120, Math.round(d * 100) / 100));
    o.commit({
      ...scene, duration: dur,
      layers: scene.layers.map((l) => ({ ...l, clips: l.clips.map((c) => (isKeyframes(c) ? { ...c, duration: Math.max(0.1, dur - c.start) } : c)) })),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  /** Plays it on the page as a visitor gets it: waits for its trigger (hover the element, click it…). */
  const preview = useCallback(() => {
    if (!active) return;
    send({ type: 'upw-studio:page-arm', id: active.id });
    setPreviewing(true);
  }, [active, send]);
  const stopPreview = useCallback(() => {
    if (!active) return;
    send({ type: 'upw-studio:page-seek', id: active.id, t: o.clock.get() });
    setPreviewing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, send]);

  // Closing Kinetic Scenes with unsaved timelines asks first.
  useEffect(() => {
    if (!dirty || !connected) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty, connected]);

  /** Save to page: every timeline that has a track (empty ones are left out). */
  const save = useCallback(() => {
    if (!connected || saving) return;
    pendingSig.current = sig;
    setSaving(true);
    send({ type: 'upw-studio:page-save', timelines: all.filter((t) => t.tracks.length).map(forPage) });
  }, [connected, saving, sig, all, send]);

  /** Adds timelines from a file (ids made unique); the first one opens. Returns how many tracks point at elements not on this page. */
  const importList = useCallback((incoming: PageTimeline[]) => {
    const taken = new Set(all.map((t) => t.id));
    const fresh = incoming.map((t) => (taken.has(t.id) ? { ...t, id: newTimelineId() } : t));
    // A new, still empty timeline is replaced rather than kept.
    const keep = all.filter((t) => t.tracks.length || t.id !== activeId);
    const next = [...keep, ...fresh];
    setList(next);
    setActiveId(fresh[0].id);
    o.reset(sceneFromTimeline(fresh[0], elements));
    o.setSelection({ layerId: null, clipId: null });
    const here = new Set(elements.map((e) => e.id));
    return fresh.reduce((n, t) => n + t.tracks.filter((tr) => !here.has(tr.target)).length, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, activeId, elements]);

  /** A track whose element is not on this page (from another page or site) moves to an element that is. */
  const retarget = useCallback((from: string, to: string) => {
    if (!active) return;
    const next = retargetTl(active, from, to);
    if (next === active) return;
    setList((l) => l.map((t) => (t.id === active.id ? next : t)));
    o.commit(sceneFromTimeline(next, elements));
    const lid = layerIdFor(to);
    o.setSelection({ layerId: lid, clipId: `${lid}-kf` });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, elements]);

  return {
    list: all, active, activeId, addElement, switchTo, create, remove, update, setDuration, preview, stopPreview, previewing,
    save, saving, dirty, importList, retarget,
  };
}

export type PageTimelines = ReturnType<typeof usePageTimelines>;
