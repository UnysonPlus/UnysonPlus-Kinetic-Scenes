import { useEffect, useMemo, useRef, useState } from 'react';
import type { Layer, Scene } from '@unysonplus/scene-player/types';
import { presetMeta } from '@unysonplus/scene-player/catalog';
import { addClip, layersIn, roundTime, scopePath, setClip } from '../lib/sceneOps';
import { groupDuration, groupOffset } from '@unysonplus/scene-player/groups';
import { PRESET_MIME } from './Library';
import { SAME_MOMENT, framesOf, isKeyframes, moveKey, writeFrames } from '../lib/keyframes';
import { addMarker, moveMarker, removeMarker } from '../lib/markers';
import { addCameraKey, cameraKeys, removeCameraKey, setCameraKey } from '../lib/cameraOps';
import { setAudio, type AudioInfo } from '../lib/audio';
import type { AudioClip } from '@unysonplus/scene-player/types';
import type { Clip } from '@unysonplus/scene-player/types';
import { selectedIds, selectLayers, type Selection } from './Inspector';
import { setLayerProps } from '../lib/sceneOps';

const NAME_W = 172;
const ROW_H = 30;

interface Props {
  scene: Scene;
  time: number;
  selection: Selection;
  onSelect: (sel: Selection) => void;
  onSeek: (t: number) => void;
  onCommit: (scene: Scene) => void;
  /** Gesture: live updates while dragging, one undo step when it ends. */
  onBegin: () => void;
  onLive: (scene: Scene) => void;
  onEnd: () => void;
  onAddLayer: (type: Exclude<Layer['type'], 'group'>) => void;
  /** The group being edited (null = the whole scene); its layers run on its own clock. */
  scope: string | null;
  onEnter: (groupId: string) => void;
  onLeaveTo: (groupId: string | null) => void;
  /** The layer whose name is being edited in place (F2, double-click or the row menu). */
  renaming: string | null;
  onRename: (id: string | null) => void;
  /** Runs a row-menu command on the current selection, the same way its keyboard shortcut does. */
  onCommand: (command: 'duplicate' | 'delete' | 'group' | 'ungroup') => void;
  /** Audio files' lengths and waveforms, by source. */
  audioInfo: Record<string, AudioInfo>;
  peaksPerSecond: number;
  onAddAudio: () => void;
}

/** A waveform as an SVG path for the part of the file a clip plays. */
function waveform(peaks: number[], perSecond: number, from: number, len: number, width: number, height: number) {
  const a = Math.floor(from * perSecond);
  const b = Math.min(peaks.length, Math.ceil((from + len) * perSecond));
  const n = Math.max(1, b - a);
  const cols = Math.max(1, Math.min(n, Math.floor(width / 2)));
  const mid = height / 2;
  let d = '';
  for (let c = 0; c < cols; c++) {
    const i0 = a + Math.floor((c / cols) * n);
    const i1 = a + Math.floor(((c + 1) / cols) * n);
    let m = 0;
    for (let i = i0; i < Math.max(i1, i0 + 1); i++) m = Math.max(m, peaks[i] ?? 0);
    const x = ((c + 0.5) / cols) * width;
    const h = Math.max(0.5, m * (height - 4) / 2);
    d += `M${x.toFixed(1)} ${(mid - h).toFixed(1)}V${(mid + h).toFixed(1)}`;
  }
  return d;
}

/** A tick spacing that keeps labels at least ~64px apart at this zoom. */
function tickStep(pps: number) {
  for (const s of [0.1, 0.25, 0.5, 1, 2, 5, 10, 30, 60]) if (s * pps >= 64) return s;
  return 120;
}

const LAYER_GLYPH: Record<Layer['type'], string> = { text: 'T', shape: '◼', image: '▣', model: '◆', group: '❏', path: '〜', flow: '≋', diagram: '⌘', code: '{}', repeat: '☰', captions: 'CC' };

export function Timeline(props: Props) {
  const { scene, selection, scope } = props;
  // Inside a group everything is on the group's clock: 0 is the group's start in the scene.
  const offset = scope ? groupOffset(scene, scope) : 0;
  const time = props.time - offset;
  const scrollRef = useRef<HTMLDivElement>(null);
  /** The row a Shift + click range starts from: the last row clicked without Shift. */
  const anchorRef = useRef<string | null>(null);
  const [laneW, setLaneW] = useState(600);
  const [zoom, setZoom] = useState(1);
  const [dropRow, setDropRow] = useState<string | null>(null);
  /** The row menu (right-click): where it opens and for which layer. */
  const [menu, setMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => { if (!(e.target as HTMLElement).closest?.('.ctx-menu')) setMenu(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setMenu(null); } };
    addEventListener('pointerdown', close, true);
    addEventListener('keydown', esc, true);
    addEventListener('blur', () => setMenu(null), { once: true });
    return () => { removeEventListener('pointerdown', close, true); removeEventListener('keydown', esc, true); };
  }, [menu]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLaneW(Math.max(200, el.clientWidth - NAME_W - 24)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The clock runs to the end of the scene; inside a group that is what is left of it after the
  // group starts (the group's own length is marked on the ruler).
  const D = Math.max(0.5, scene.duration - offset);
  const scopeGroup = scope ? scopePath(scene, scope).slice(-1)[0] : undefined;
  const groupLen = scopeGroup ? groupDuration(scopeGroup) : null;
  const pps = (laneW / D) * zoom;
  const width = D * pps;
  const step = tickStep(pps);
  const rows = useMemo(() => [...layersIn(scene, scope)].reverse(), [scene, scope]);

  // Keep the latest props for pointer handlers that outlive a render.
  const live = useRef(props);
  live.current = props;

  const xToTime = (clientX: number) => {
    const el = scrollRef.current!;
    const r = el.getBoundingClientRect();
    return (clientX - r.left - NAME_W + el.scrollLeft) / pps;
  };

  /* ---- scrubbing on the ruler ---- */
  const onRulerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const seekTo = (x: number) => live.current.onSeek(Math.max(0, Math.min(scene.duration, roundTime(xToTime(x) + offset))));
    seekTo(e.clientX);
    const move = (ev: PointerEvent) => seekTo(ev.clientX);
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };

  /* ---- moving and trimming clips ---- */
  const onClipDown = (e: React.PointerEvent, layer: Layer, clipId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const clip = layer.clips.find((c) => c.id === clipId)!;
    props.onSelect({ layerId: layer.id, clipId });
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const edge = Math.min(8, rect.width / 4);
    const mode: 'move' | 'start' | 'end' = e.clientX - rect.left < edge ? 'start' : rect.right - e.clientX < edge ? 'end' : 'move';
    const x0 = e.clientX;
    const s0 = clip.start;
    const d0 = clip.duration;
    // Edges worth snapping to: the scene's start and end, the playhead, and every other clip.
    const points = [0, D, live.current.time - offset];
    for (const l of layersIn(scene, scope)) for (const c of l.clips) if (c.id !== clipId) points.push(c.start, c.start + c.duration);
    const thr = 6 / pps;
    // Hold Alt to place freely.
    let free = false;
    const snap = (t: number) => {
      if (free) return t;
      let best = t;
      let dist = thr;
      for (const p of points) if (Math.abs(p - t) < dist) { dist = Math.abs(p - t); best = p; }
      return best;
    };
    let started = false;

    const move = (ev: PointerEvent) => {
      free = ev.altKey;
      const dt = (ev.clientX - x0) / pps;
      if (!started) {
        if (Math.abs(ev.clientX - x0) < 3) return;
        started = true;
        live.current.onBegin();
      }
      let start = s0;
      let duration = d0;
      if (mode === 'move') {
        start = Math.max(0, Math.min(D - d0, s0 + dt));
        const snappedStart = snap(start);
        const snappedEnd = snap(start + d0) - d0;
        start = snappedStart !== start ? snappedStart : snappedEnd !== start ? snappedEnd : start;
        start = Math.max(0, Math.min(D - d0, start));
      } else if (mode === 'start') {
        start = Math.max(0, Math.min(s0 + d0 - 0.05, snap(s0 + dt)));
        duration = s0 + d0 - start;
      } else {
        duration = Math.max(0.05, Math.min(D - s0, snap(s0 + d0 + dt) - s0));
      }
      live.current.onLive(setClip(live.current.scene, layer.id, clipId, { start: roundTime(start), duration: roundTime(duration) }));
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      if (started) live.current.onEnd();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };

  /* ---- keyframes: click a diamond to select it (and jump there), drag to move it in time ---- */
  const onKeyDown = (e: React.PointerEvent, layer: Layer, clip: Clip, index: number) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const frames0 = framesOf(clip);
    const f0 = frames0[index];
    props.onSelect({ layerId: layer.id, clipId: clip.id, key: index });
    props.onSeek(offset + clip.start + f0.t);
    const x0 = e.clientX;
    let started = false;
    let current = index;
    const move = (ev: PointerEvent) => {
      if (!started) {
        if (Math.abs(ev.clientX - x0) < 3) return;
        started = true;
        live.current.onBegin();
      }
      let t = Math.round((f0.t + (ev.clientX - x0) / pps) * 100) / 100;
      t = Math.max(0, Math.min(clip.duration, t));
      // Don't land on another keyframe's moment.
      if (frames0.some((f, j) => j !== index && Math.abs(f.t - t) < SAME_MOMENT)) return;
      const r = moveKey(frames0, index, t, clip.duration);
      current = r.index;
      live.current.onLive(writeFrames(live.current.scene, layer.id, clip.id, r.frames));
      live.current.onSeek(offset + clip.start + t);
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      if (started) {
        live.current.onEnd();
        live.current.onSelect({ layerId: layer.id, clipId: clip.id, key: current });
      }
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };

  /* ---- moving a group in time (its whole animation moves with it) ---- */
  const onGroupBarDown = (e: React.PointerEvent, layer: Layer) => {
    if (e.button !== 0 || layer.type !== 'group') return;
    e.stopPropagation();
    props.onSelect({ layerId: layer.id, clipId: null });
    const x0 = e.clientX;
    const s0 = layer.start ?? 0;
    let started = false;
    const move = (ev: PointerEvent) => {
      if (!started) {
        if (Math.abs(ev.clientX - x0) < 3) return;
        started = true;
        live.current.onBegin();
      }
      let start = Math.max(0, s0 + (ev.clientX - x0) / pps);
      if (!ev.altKey) {
        // Snap the start to the playhead and to whole tenths.
        const ph = live.current.time - offset;
        if (Math.abs(start - ph) < 6 / pps) start = ph;
        else start = Math.round(start * 10) / 10;
      }
      start = Math.min(start, Math.max(0, D - 0.1));
      live.current.onLive(setGroupStart(live.current.scene, layer.id, roundTime(start)));
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      if (started) live.current.onEnd();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };

  /* ---- dropping presets ---- */
  const canDrop = (e: React.DragEvent) => Array.from(e.dataTransfer.types).includes(PRESET_MIME);
  const onDrop = (e: React.DragEvent, layer: Layer) => {
    setDropRow(null);
    const id = e.dataTransfer.getData(PRESET_MIME);
    if (!id) return;
    e.preventDefault();
    const at = Math.max(0, xToTime(e.clientX));
    const r = addClip(scene, layer.id, id, at, D);
    if (r) {
      props.onCommit(r.scene);
      props.onSelect({ layerId: layer.id, clipId: r.id });
    }
  };

  // Ctrl/Cmd + wheel zooms around the pointer.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom((z) => Math.max(1, Math.min(16, z * (e.deltaY < 0 ? 1.15 : 1 / 1.15))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const ticks: number[] = [];
  for (let t = 0; t <= D + 1e-6; t += step) ticks.push(Math.round(t * 1000) / 1000);

  return (
    <section className="timeline" aria-label="Timeline">
      <div className="tl-bar">
        <h2>Timeline</h2>
        {scope && (
          <nav className="tl-crumbs" aria-label="Group path">
            <button type="button" className="crumb" onClick={() => props.onLeaveTo(null)}>Scene</button>
            {scopePath(scene, scope).map((g, i, all) => (
              <span key={g.id}>
                <span aria-hidden="true"> › </span>
                {i === all.length - 1
                  ? <strong>{g.name || g.id}</strong>
                  : <button type="button" className="crumb" onClick={() => props.onLeaveTo(g.id)}>{g.name || g.id}</button>}
              </span>
            ))}
          </nav>
        )}
        <div className="tl-add" role="group" aria-label="Add a layer">
          <button type="button" className="btn small" onClick={() => props.onAddLayer('text')}>+ Text</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('shape')}>+ Shape</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('image')}>+ Image</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('model')} title="A 3D object: text, a shape, an SVG logo or a glTF model">+ 3D</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('path')} title="A line or curve that can draw itself, with arrowheads and glow; other layers can travel along it">+ Line</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('code')} title="An editor or terminal showing code that can be typed, changed, highlighted and run">+ Code</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('diagram')} title="Nodes and connections: a flowchart, an architecture diagram or a branch graph">+ Diagram</button>
          <button type="button" className="btn small" onClick={() => props.onAddLayer('repeat')} title="A list: one designed row or card, copied for every entry and staggered">+ List</button>
          {!scope && <button type="button" className="btn small" onClick={() => props.onAddLayer('captions')} title="Captions from a transcribed voice-over, lighting up each word as it is said">+ Captions</button>}
          <button type="button" className="btn small" onClick={() => props.onAddLayer('flow')} title="A bundle of glowing curves joining two layers, which stays attached as they move">+ Flow</button>
          {!scope && <button type="button" className="btn small" onClick={props.onAddAudio} title="A voice-over, music or a sound effect (MP3, WAV, OGG…)">+ Audio</button>}
          {!scope && (
            <>
              <button type="button" className="btn small" onClick={() => {
                const r = addCameraKey(scene, props.time);
                props.onCommit(r.scene);
                props.onSelect({ layerId: null, clipId: null, camera: r.id });
              }} title="A camera key at the playhead: pan, zoom, tilt or roll the whole view. Two keys make a move.">+ Camera</button>
              <button type="button" className="btn small" onClick={() => props.onCommit(addMarker(scene, props.time))}
                title="A marker at the playhead (M). In a click-to-advance scene, the presentation stops there until a click.">+ Marker</button>
            </>
          )}
        </div>
        <label className="tl-zoom">
          <span>Zoom</span>
          <input type="range" min={1} max={16} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Timeline zoom" />
        </label>
      </div>

      <div className="tl-scroll" ref={scrollRef}>
        <div className="tl-inner" style={{ width: NAME_W + width + 24 }}>
          <div className="tl-ruler" onPointerDown={onRulerDown}>
            <div className="tl-corner">
              <span className="mono">{time.toFixed(2)}s{scope ? ' in group' : ''}</span>
            </div>
            <div className="tl-ticks" style={{ width }}>
              {ticks.map((t) => (
                <span key={t} className="tick" style={{ left: t * pps }}>
                  <span className="mono">{step < 1 ? t.toFixed(step < 0.5 ? 2 : 1) : t}s</span>
                </span>
              ))}
              {!scope && (scene.markers ?? []).map((m, i) => (
                <span
                  key={m.id}
                  role="button"
                  tabIndex={-1}
                  className="tl-marker"
                  style={{ left: m.t * pps }}
                  title={`Marker ${i + 1} at ${m.t.toFixed(2)} s${scene.playback.advance === 'click' ? ': the presentation waits here for a click' : ''}. Drag to move, double-click to delete.`}
                  onDoubleClick={(e) => { e.stopPropagation(); props.onCommit(removeMarker(scene, m.id)); }}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    props.onSeek(m.t);
                    const x0 = e.clientX;
                    let started = false;
                    const move = (ev: PointerEvent) => {
                      if (!started) {
                        if (Math.abs(ev.clientX - x0) < 3) return;
                        started = true;
                        live.current.onBegin();
                      }
                      const t = Math.round((m.t + (ev.clientX - x0) / pps) * 100) / 100;
                      live.current.onLive(moveMarker(live.current.scene, m.id, t));
                      live.current.onSeek(Math.max(0, Math.min(D, t)));
                    };
                    const up = () => {
                      removeEventListener('pointermove', move);
                      removeEventListener('pointerup', up);
                      if (started) live.current.onEnd();
                    };
                    addEventListener('pointermove', move);
                    addEventListener('pointerup', up);
                  }}
                >
                  <span className="tl-marker-num">{i + 1}</span>
                </span>
              ))}
            </div>
          </div>

          {!scope && scene.camera && scene.camera.keys.length > 0 && (() => {
            const keys = cameraKeys(scene);
            const camSel = !!selection.camera;
            return (
              <div className="tl-row tl-camera-row" style={{ height: ROW_H }}>
                <div className="tl-head">
                  <button type="button" className={`tl-name${camSel ? ' on' : ''}`} onClick={() => props.onSelect({ layerId: null, clipId: null, camera: keys[0].id })}>
                    <span className="tl-glyph" aria-hidden="true">◎</span>
                    <span className="tl-label">Camera</span>
                  </button>
                </div>
                <div className="tl-lane" style={{ width }}>
                  {keys.length > 1 && <div className="tl-cam-span" style={{ left: keys[0].t * pps, width: Math.max(2, (keys[keys.length - 1].t - keys[0].t) * pps) }} aria-hidden="true" />}
                  {keys.map((k, i) => (
                    <span key={k.id} role="button" tabIndex={-1}
                      className={`tl-cam-key${selection.camera === k.id ? ' on' : ''}`}
                      style={{ left: k.t * pps }}
                      title={`Camera key ${i + 1} at ${k.t.toFixed(2)} s. Drag to move, double-click to delete.`}
                      onDoubleClick={(e) => { e.stopPropagation(); props.onCommit(removeCameraKey(scene, k.id)); props.onSelect({ layerId: null, clipId: null }); }}
                      onPointerDown={(e) => {
                        if (e.button !== 0) return;
                        e.stopPropagation();
                        props.onSelect({ layerId: null, clipId: null, camera: k.id });
                        props.onSeek(k.t);
                        const x0 = e.clientX;
                        let started = false;
                        const move = (ev: PointerEvent) => {
                          if (!started) {
                            if (Math.abs(ev.clientX - x0) < 3) return;
                            started = true;
                            live.current.onBegin();
                          }
                          const t = Math.max(0, Math.min(D, Math.round((k.t + (ev.clientX - x0) / pps) * 100) / 100));
                          live.current.onLive(setCameraKey(live.current.scene, k.id, { t }));
                          live.current.onSeek(t);
                        };
                        const up = () => {
                          removeEventListener('pointermove', move);
                          removeEventListener('pointerup', up);
                          if (started) live.current.onEnd();
                        };
                        addEventListener('pointermove', move);
                        addEventListener('pointerup', up);
                      }} />
                  ))}
                </div>
              </div>
            );
          })()}

          {rows.length === 0 && (
            <div className="tl-empty">{scope ? 'This group is empty. Add a layer to it, or go back to the scene.' : 'No layers yet. Add a text, shape or image layer to start.'}</div>
          )}

          {rows.map((layer) => {
            const layerSel = selectedIds(selection).includes(layer.id);
            const start = layer.start ?? 0;
            const end = layer.end ?? D;
            return (
              <div key={layer.id} className={`tl-row${layerSel ? ' sel' : ''}${dropRow === layer.id ? ' drop' : ''}`} style={{ height: ROW_H }}>
                <div className="tl-head">
                <button
                  type="button"
                  className="tl-name"
                  title="Click to select. Shift + click selects every layer between, Ctrl + click adds or removes one."
                  onClick={(e) => {
                    const ids = selectedIds(selection);
                    const additive = e.ctrlKey || e.metaKey;
                    if (e.shiftKey) {
                      // A range, like a file list: from the last clicked row (or the first selected one) to this
                      // row. Locked layers in between are skipped, as on the stage.
                      const order = rows.map((r) => r.id);
                      const from = anchorRef.current && order.includes(anchorRef.current) && ids.includes(anchorRef.current)
                        ? anchorRef.current
                        : order.find((id) => ids.includes(id)) ?? layer.id;
                      const [a, b] = [order.indexOf(from), order.indexOf(layer.id)].sort((x, y) => x - y);
                      const range = rows.slice(a, b + 1).filter((r) => !r.locked || r.id === from || r.id === layer.id).map((r) => r.id);
                      props.onSelect(selectLayers(additive ? [...ids, ...range.filter((id) => !ids.includes(id))] : range));
                      return; // the anchor stays put, so a second Shift + click re-draws the range from it
                    }
                    anchorRef.current = layer.id;
                    if (additive) props.onSelect(selectLayers(ids.includes(layer.id) ? ids.filter((x) => x !== layer.id) : [...ids, layer.id]));
                    else props.onSelect({ layerId: layer.id, clipId: null });
                  }}
                  onDoubleClick={() => { if (layer.type === 'group') props.onEnter(layer.id); else props.onRename(layer.id); }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    // Right-clicking outside the selection selects that row; inside it keeps the selection.
                    if (!selectedIds(selection).includes(layer.id)) props.onSelect({ layerId: layer.id, clipId: null });
                    setMenu({ x: e.clientX, y: e.clientY, id: layer.id });
                  }}
                  aria-pressed={layerSel && !selection.clipId}
                  hidden={props.renaming === layer.id}
                >
                  <span className="tl-glyph" aria-hidden="true">{LAYER_GLYPH[layer.type]}</span>
                  <span className="tl-label">{layer.name || layer.id}</span>
                </button>
                {props.renaming === layer.id && (
                  <input
                    className="tl-rename"
                    aria-label="Layer name"
                    defaultValue={layer.name || layer.id}
                    autoFocus
                    onFocus={(e) => e.currentTarget.select()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      if (e.key === 'Escape') { e.currentTarget.dataset.cancel = '1'; e.currentTarget.blur(); }
                    }}
                    onBlur={(e) => {
                      const v = e.currentTarget.value.trim();
                      if (!e.currentTarget.dataset.cancel && v && v !== (layer.name || layer.id)) props.onCommit(setLayerProps(scene, layer.id, { name: v }));
                      props.onRename(null);
                    }}
                  />
                )}
                <button
                  type="button"
                  className={`tl-lock${layer.locked ? ' on' : ''}`}
                  aria-pressed={!!layer.locked}
                  aria-label={`${layer.locked ? 'Unlock' : 'Lock'} ${layer.name || layer.id}`}
                  title={layer.locked ? 'Locked: can’t be selected or moved on the stage. Click to unlock.' : 'Lock so it can’t be selected or moved on the stage'}
                  onClick={() => props.onCommit(setLayerProps(scene, layer.id, { locked: layer.locked ? undefined : true }))}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    {layer.locked ? <path d="M8 11V8a4 4 0 0 1 8 0v3" /> : <path d="M8 11V8a4 4 0 0 1 7.5-2" />}
                  </svg>
                </button>
                </div>
                <div
                  className="tl-lane"
                  style={{ width }}
                  onPointerDown={(e) => { if (e.target === e.currentTarget) props.onSelect({ layerId: layer.id, clipId: null }); }}
                  onDragOver={(e) => { if (canDrop(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setDropRow(layer.id); } }}
                  onDragLeave={() => setDropRow((r) => (r === layer.id ? null : r))}
                  onDrop={(e) => onDrop(e, layer)}
                >
                  <div className="tl-span" style={{ left: start * pps, width: Math.max(0, (end - start) * pps) }} aria-hidden="true" />
                  {layer.type === 'group' && (
                    <button
                      type="button"
                      className="tl-groupbar"
                      style={{ left: start * pps, width: Math.max(10, groupDuration(layer) * pps) }}
                      onPointerDown={(e) => onGroupBarDown(e, layer)}
                      onDoubleClick={() => props.onEnter(layer.id)}
                      title="Drag to move the whole group in time. Double-click to open it."
                      aria-label={`Group ${layer.name || layer.id}: ${layer.layers.length} layers, from ${start.toFixed(2)} s. Double-click to open.`}
                    >
                      <span className="clip-label">{layer.layers.length} layers · open ↘</span>
                    </button>
                  )}
                  {layer.clips.map((c) => {
                    const meta = presetMeta[c.preset];
                    const out = c.params?.direction === 'out';
                    const sel = layerSel && selection.clipId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`clip cat-${meta?.category ?? 'motion'}${sel ? ' sel' : ''}`}
                        style={{ left: c.start * pps, width: Math.max(6, c.duration * pps) }}
                        onPointerDown={(e) => onClipDown(e, layer, c.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-pressed={sel}
                        aria-label={`${meta?.label ?? c.preset}${out ? ' out' : ''}, ${c.start.toFixed(2)} to ${(c.start + c.duration).toFixed(2)} seconds${c.sound ? `, with the ${c.sound.name} sound` : ''}`}
                        title={`${meta?.label ?? c.preset}${out ? ' (out)' : ''} · ${c.start.toFixed(2)}–${(c.start + c.duration).toFixed(2)}s`}
                      >
                        <span className="clip-label">{meta?.label ?? c.preset}{out ? ' ↗' : ''}</span>
                        {c.sound && (
                          <span className={`clip-snd${c.sound.at === 'end' ? ' at-end' : ''}`} aria-hidden="true" title={`Sound: ${c.sound.name}`}>
                            <svg viewBox="0 0 24 24" width="10" height="10"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
                          </span>
                        )}
                        {isKeyframes(c) && framesOf(c).map((f, i) => (
                          <span
                            key={i}
                            role="button"
                            tabIndex={-1}
                            className={`kf-dot${sel && selection.key === i ? ' on' : ''}`}
                            style={{ left: f.t * pps }}
                            title={`Keyframe at ${f.t.toFixed(2)} s (drag to move it)`}
                            onPointerDown={(e) => onKeyDown(e, layer, c, i)}
                          />
                        ))}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!scope && (scene.audio ?? []).map((a: AudioClip) => {
            const inf = props.audioInfo[a.src];
            const trimIn = a.offset ?? 0;
            const len = a.duration ?? (inf ? Math.max(0.1, inf.duration - trimIn) : 1);
            const sel = selection.audio === a.id;
            const w = Math.max(6, len * pps);
            const onDown = (e: React.PointerEvent) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              props.onSelect({ layerId: null, clipId: null, audio: a.id });
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const edge = Math.min(8, rect.width / 4);
              const mode = e.clientX - rect.left < edge ? 'in' : rect.right - e.clientX < edge ? 'out' : 'move';
              const x0 = e.clientX;
              const fileLen = inf ? inf.duration : trimIn + len;
              let started = false;
              const move = (ev: PointerEvent) => {
                if (!started) { if (Math.abs(ev.clientX - x0) < 3) return; started = true; live.current.onBegin(); }
                const dt = (ev.clientX - x0) / pps;
                let patch: Partial<AudioClip>;
                if (mode === 'move') patch = { start: Math.max(0, a.start + dt) };
                else if (mode === 'in') {
                  // Trim the start: the clip's sound stays put on the timeline, only less of it plays.
                  const d = Math.max(-trimIn, Math.min(len - 0.1, dt));
                  patch = { start: Math.max(0, a.start + d), offset: trimIn + d, duration: len - d };
                } else patch = { duration: Math.max(0.1, Math.min(fileLen - trimIn, len + dt)) };
                live.current.onLive(setAudio(live.current.scene, a.id, patch));
              };
              const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (started) live.current.onEnd(); };
              addEventListener('pointermove', move);
              addEventListener('pointerup', up);
            };
            return (
              <div key={a.id} className={`tl-row tl-audio-row${sel ? ' sel' : ''}`} style={{ height: ROW_H }}>
                <div className="tl-head">
                  <button type="button" className="tl-name" onClick={() => props.onSelect({ layerId: null, clipId: null, audio: a.id })} aria-pressed={sel}>
                    <span className="tl-glyph" aria-hidden="true">♪</span>
                    <span className="tl-label">{a.name || a.id}</span>
                  </button>
                </div>
                <div className="tl-lane" style={{ width }}>
                  <button type="button" className={`clip clip-audio role-${a.role ?? 'sfx'}${sel ? ' sel' : ''}`} style={{ left: a.start * pps, width: w }}
                    onPointerDown={onDown} onClick={(e) => e.stopPropagation()}
                    title={`${a.name || a.id} · ${a.start.toFixed(2)}–${(a.start + len).toFixed(2)}s (drag to move, drag an edge to trim)`}>
                    {inf && (
                      <svg className="wave" viewBox={`0 0 ${w} ${ROW_H - 8}`} preserveAspectRatio="none" aria-hidden="true">
                        <path d={waveform(inf.peaks, props.peaksPerSecond, trimIn, len, w, ROW_H - 8)} />
                      </svg>
                    )}
                    <span className="clip-label">{a.name || a.id}</span>
                    {a.beats && (
                      <svg className="beats" viewBox={`0 0 ${w} ${ROW_H - 8}`} preserveAspectRatio="none" aria-hidden="true">
                        {a.beats.times.map((bt, k) => {
                          const x = (bt - trimIn) * pps;
                          if (bt < trimIn || x > w) return null;
                          const st = a.beats!.strengths[k] ?? 0.5;
                          const h = (ROW_H - 8) * (st >= 0.55 ? 0.9 : 0.35);
                          return <line key={k} x1={x} x2={x} y1={ROW_H - 8} y2={ROW_H - 8 - h} stroke={st >= 0.55 ? '#ffd166' : 'rgba(255,255,255,.35)'} strokeWidth={st >= 0.55 ? 1.5 : 1} />;
                        })}
                      </svg>
                    )}
                    {a.words && a.words.length > 0 && (() => {
                      // Words along the waveform: each where it is said; only those with room to show.
                      // (after the clip's name, which sits at its left edge)
                      let lastEnd = (a.name || a.id).length * 6.5 + 12;
                      return (
                        <span className="clip-words" aria-hidden="true">
                          {a.words.map((wd, k) => {
                            const x = (wd.t - trimIn) * pps;
                            if (wd.t < trimIn - 0.05 || x > w) return null;
                            const strong = (wd.s ?? 0) >= 0.75;
                            const need = wd.w.length * (strong ? 6.4 : 5.6) + 6;
                            if (x < lastEnd) return null;
                            lastEnd = x + need;
                            return <span key={k} className={strong ? 'strong' : ''} style={{ left: x }}>{wd.w}</span>;
                          })}
                        </span>
                      );
                    })()}
                  </button>
                </div>
              </div>
            );
          })}

          {groupLen !== null && <div className="tl-groupend" style={{ left: NAME_W + groupLen * pps }} title="End of the group's own timeline" aria-hidden="true" />}
          {time >= 0 && time <= D && <div className="tl-playhead" style={{ left: NAME_W + time * pps }} aria-hidden="true" />}
          <div className="tl-after" style={{ left: NAME_W + width }} aria-hidden="true" />
        </div>
      </div>
      {menu && (() => {
        const l = rows.find((r) => r.id === menu.id) ?? null;
        if (!l) return null;
        const many = selectedIds(selection).length > 1;
        const run = (fn: () => void) => () => { setMenu(null); fn(); };
        return (
          <div className="ctx-menu" role="menu" style={{ left: Math.min(menu.x, innerWidth - 220), top: Math.min(menu.y, innerHeight - 260) }}>
            {!many && <button type="button" role="menuitem" onClick={run(() => props.onRename(l.id))}>Rename<kbd>F2</kbd></button>}
            {!many && l.type === 'group' && <button type="button" role="menuitem" onClick={run(() => props.onEnter(l.id))}>Open group<kbd>Double-click</kbd></button>}
            <button type="button" role="menuitem" onClick={run(() => props.onCommand('duplicate'))}>Duplicate<kbd>Ctrl+D</kbd></button>
            <button type="button" role="menuitem" onClick={run(() => props.onCommand('group'))}>{many ? 'Group these' : 'Group'}<kbd>Ctrl+G</kbd></button>
            {!many && l.type === 'group' && <button type="button" role="menuitem" onClick={run(() => props.onCommand('ungroup'))}>Ungroup<kbd>Ctrl+Shift+G</kbd></button>}
            {!many && <button type="button" role="menuitem" onClick={run(() => props.onCommit(setLayerProps(scene, l.id, { locked: l.locked ? undefined : true })))}>{l.locked ? 'Unlock' : 'Lock'}</button>}
            <hr />
            <button type="button" role="menuitem" className="danger" onClick={run(() => props.onCommand('delete'))}>Delete<kbd>Del</kbd></button>
          </div>
        );
      })()}
    </section>
  );
}

/** Sets a group's start (in its parent's time), moving its whole animation. */
function setGroupStart(scene: Scene, id: string, start: number): Scene {
  const walk = (list: Layer[]): Layer[] => list.map((l) => {
    if (l.id === id) return { ...l, start: start || undefined } as Layer;
    return l.type === 'group' ? { ...l, layers: walk(l.layers) } : l;
  });
  return { ...scene, layers: walk(scene.layers) };
}
