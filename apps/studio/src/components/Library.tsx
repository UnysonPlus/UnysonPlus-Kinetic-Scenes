import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { mount, type ScenePlayer } from '@unysonplus/scene-player';
import { CATEGORY_LABELS, PRESET_CATALOG, type PresetCategory, type PresetMeta } from '@unysonplus/scene-player/catalog';
import type { Layer, Scene } from '@unysonplus/scene-player/types';

export const PRESET_MIME = 'application/x-upw-preset';

/** A one-layer scene that shows a preset on its own, for the hover preview. */
/** A tall "page" (a header, rows and blocks) for the Scroll preset's preview. */
const SCROLL_SAMPLE = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="900"><rect width="200" height="900" fill="#f4f6f8"/><rect width="200" height="34" fill="#1d2733"/>'
  + Array.from({ length: 12 }, (_, i) => `<rect x="16" y="${54 + i * 70}" width="${i % 3 === 0 ? 168 : 110}" height="${i % 3 === 0 ? 50 : 14}" rx="5" fill="${i % 3 === 0 ? '#2ad38b' : '#c6ced6'}"/>`).join('')
  + '</svg>');

/** A small code window showing one of the code presets. */
function codeSample(id: string, d: number): Layer {
  const code = 'name = input()\nprint(name)';
  const clip = (preset: string, start: number, duration: number, params?: Record<string, unknown>) => ({ id: preset + start, preset, start, duration, params });
  const clips = id === 'code-type' ? [clip('code-type', 0.15, d)]
    : id === 'code-edit' ? [clip('code-edit', 0.15, d, { to: 'def hi(n):\n    print(n)\n\nhi(input())' })]
    : id === 'code-run' ? [clip('code-run', 0.15, d, { output: 'John' })]
    : id === 'code-note' ? [clip('code-note', 0.15, 0.4, { line: 1, text: 'reads a line' })]
    : [clip('code-highlight', 0.15, 0.4, { line: 1, token: 'input' })];
  return { id: 's', type: 'code', title: 'main.py', run: true, fontSize: 5, code, box: { x: id === 'code-note' ? 38 : 50, y: 50, w: id === 'code-note' ? 60 : 92, h: 86 }, clips };
}

function sampleScene(p: PresetMeta): Scene {
  const textual = p.appliesTo.includes('text');
  const word = p.id === 'text-scramble' || p.id === 'text-typewriter' ? 'Motion' : p.id === 'text-count' ? '$1,280'
    : p.id === 'select-box' ? 'The goal' : p.id === 'text-swap' ? 'Before' : p.id === 'text-carry' ? 'Fast then slow' : 'Aa';
  const layer: Layer = textual
    ? { id: 's', type: 'text', text: word, style: { fontSize: word === 'Aa' ? 30 : 17, fontWeight: 800, color: '#f4f6f8' }, box: { x: 50, y: 52 }, clips: [] }
    : p.category === '3d'
      ? { id: 's', type: 'model', model: { kind: 'shape', shape: 'knot' }, material: { color: '#2ad38b', finish: 'glossy' }, box: { x: 50, y: 50, w: 70, h: 80 }, clips: [] }
    : p.id === 'particles'
      ? { id: 's', type: 'shape', shape: 'rect', fill: 'transparent', box: { x: 50, y: 50, w: 100, h: 100 }, clips: [] }
      : p.id === 'scroll'
        ? { id: 's', type: 'image', src: SCROLL_SAMPLE, radius: 2, box: { x: 50, y: 50, w: 34, h: 76 }, clips: [] }
      : p.id === 'march' || p.id === 'dash-solid'
        ? { id: 's', type: 'shape', shape: 'rect', fill: 'transparent', stroke: '#2ad38b', strokeWidth: 0.6, dash: 3, radius: 3, box: { x: 50, y: 50, w: 60, h: 50 }, clips: [] }
      : p.id === 'progress'
        ? { id: 's', type: 'shape', shape: 'rect', fill: '#26313d', radius: 3, box: { x: 50, y: 50, w: 70, h: 12 }, clips: [] }
      : p.id === 'gradient-flow'
        ? { id: 's', type: 'shape', shape: 'rect', fill: 'linear-gradient(90deg, #2ad38b, #3b82f6, #a855f7, #2ad38b)', radius: 3, box: { x: 50, y: 50, w: 70, h: 60 }, clips: [] }
        : { id: 's', type: 'shape', shape: 'rect', fill: '#2ad38b', radius: 3, box: { x: 50, y: 50, w: 26, ratio: 1 }, clips: [] };
  // Draw and Follow path need a line to show on.
  const line: Layer = { id: 'ln', type: 'path', d: 'M 0 80 C 35 80, 65 20, 100 20', stroke: '#2ad38b', strokeWidth: 0.9, arrow: p.id === 'draw' ? 'end' : undefined, box: { x: 50, y: 50, w: 70, h: 50 }, clips: [] };
  const d = Math.min(p.defaultDuration, 2.4);
  layer.clips = [{ id: 'c', preset: p.id, start: 0.15, duration: d, params: p.id === 'keyframes' ? { frames: [{ t: 0, scale: 0.8, rotate: -8 }, { t: d, scale: 1.1, rotate: 8 }] }
    : p.id === 'select-box' ? { word: 2 } : p.id === 'text-swap' ? { to: 'After' } : undefined }];
  return {
    format: 'unysonplus-scene', version: 1, duration: d + 0.75,
    stage: { breakpoints: [{ id: 'a', minWidth: 0, aspect: [16, 10] }], heightMode: 'ratio', safeArea: 0 },
    playback: { trigger: 'manual', loop: true, repeatDelay: 0.3 },
    layers: p.category === 'code' ? [codeSample(p.id, d)] : p.id === 'draw' ? [{ ...line, clips: layer.clips }] : p.id === 'follow-path' ? [{ ...line, stroke: 'rgba(255,255,255,.18)' }, { id: 's', type: 'shape', shape: 'ellipse', fill: '#2ad38b', box: { x: 0, y: 0, w: 8, ratio: 1 }, clips: [{ ...layer.clips[0], params: { path: 'ln', trail: 0.4, trailColor: '#2ad38b' } }] }] : [layer],
  };
}

function Thumb({ preset, active }: { preset: PresetMeta; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    let player: ScenePlayer | null = null;
    try {
      player = mount(ref.current, sampleScene(preset), { editor: true, autoplay: false });
      player.play();
    } catch {
      /* A preview that can't play just stays blank. */
    }
    return () => player?.destroy();
  }, [active, preset]);
  return (
    <div className="thumb" aria-hidden="true">
      {active ? <div ref={ref} className="thumb-live" /> : <span className={preset.appliesTo.includes('text') ? 'thumb-aa' : 'thumb-sq'}>{preset.appliesTo.includes('text') ? 'Aa' : ''}</span>}
    </div>
  );
}

export function Library(props: {
  /** The selected layer's type, if any: presets that don't fit it are shown as unavailable. */
  layerType: Layer['type'] | null;
  /** How many layers are selected; with several, a click adds the preset to each one it suits. */
  count: number;
  onApply: (presetId: string) => void;
  /** The Sounds tab's content. */
  sounds: ReactNode;
  /** The Styles tab's content. */
  styles: ReactNode;
}) {
  const [kind, setKind] = useState<'presets' | 'sounds' | 'styles'>('presets');
  const [query, setQuery] = useState('');
  const [hot, setHot] = useState<string | null>(null);
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRESET_CATALOG.filter((p) => !q || p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const order: PresetCategory[] = ['text', 'reveal', 'motion', 'emphasis', 'transition', 'ambient', 'code', '3d'];
    return order.map((c) => ({ c, items: list.filter((p) => p.category === c) })).filter((g) => g.items.length);
  }, [query]);

  return (
    <aside className="library" aria-label="Library">
      <div className="lib-tabs" role="tablist" aria-label="Library">
        {(['presets', 'sounds', 'styles'] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>
            {k === 'presets' ? 'Presets' : k === 'sounds' ? 'Sounds' : 'Styles'}
          </button>
        ))}
      </div>
      {kind === 'sounds' ? props.sounds : kind === 'styles' ? props.styles : <>
      <div className="lib-head">
        <input type="search" className="lib-search" placeholder="Search presets" aria-label="Search presets" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="lib-help">
          {props.count > 1
            ? `Click a preset to add it at the playhead to each of the ${props.count} selected layers it suits.`
            : props.layerType
              ? 'Drag a preset onto a timeline row, or click to add it to the selected layer at the playhead.'
              : 'Drag a preset onto a timeline row. Select a layer to add presets by clicking.'}
        </p>
      </div>
      <div className="lib-scroll">
        {groups.map((g) => (
          <section key={g.c} className="lib-group">
            <h3>{CATEGORY_LABELS[g.c]}</h3>
            <ul>
              {g.items.map((p) => {
                const fits = props.count > 1 || !props.layerType || p.appliesTo.includes(props.layerType);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`preset${fits ? '' : ' unfit'}`}
                      draggable
                      title={p.description}
                      aria-disabled={!props.layerType || !fits}
                      aria-describedby={`pd-${p.id}`}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(PRESET_MIME, p.id);
                        e.dataTransfer.setData('text/plain', p.label);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      onClick={() => props.layerType && fits && props.onApply(p.id)}
                      onPointerEnter={() => setHot(p.id)}
                      onPointerLeave={() => setHot((h) => (h === p.id ? null : h))}
                      onFocus={() => setHot(p.id)}
                      onBlur={() => setHot((h) => (h === p.id ? null : h))}
                    >
                      <Thumb preset={p} active={hot === p.id} />
                      <span className="preset-label">{p.label}</span>
                      <span className="sr-only" id={`pd-${p.id}`}>{p.description}{p.appliesTo.includes('text') && p.appliesTo.length === 1 ? ' Text layers only.' : ''}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="lib-empty">No preset matches “{query}”.</p>}
      </div>
      </>}
    </aside>
  );
}
