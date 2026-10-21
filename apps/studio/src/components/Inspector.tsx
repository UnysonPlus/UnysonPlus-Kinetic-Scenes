import type { Anchor, Breakpoint, Layer, Scene } from '@unysonplus/scene-player/types';
import { SAFE_HREF } from '@unysonplus/scene-player/types';
import { PRESET_CATALOG, defaultEaseFor, presetMeta, type PresetField } from '@unysonplus/scene-player/catalog';
import { NAMED_EASES, NAMED_EASE_IDS } from '@unysonplus/scene-player/eases';
import {
  clearOverride, containerOf, duplicateLayer, groupToRepeat, repeatToGroup, layersIn, editsOverride, findClip, findLayer, moveLayer, primaryBreakpoint,
  removeClip, removeLayer, setClip, setClipParam, setLayerProps, writeLayout, type LayoutPatch,
} from '../lib/sceneOps';
import { validateScene } from '@unysonplus/scene-player/validate';
import { SCROLL_DEFAULTS } from '@unysonplus/scene-player/scroll';
import { scrollTestHtml } from '../lib/documents';
import demo from '../scenes/demo.json';
import { CheckField, ColorField, Field, NumberField, Section, SelectField, TextField } from './fields';
import { groupDuration, groupOffset, groupPath } from '@unysonplus/scene-player/groups';
import { KeyframeEditor } from './KeyframeEditor';
import { blankScene } from '../lib/sceneOps';
import { ModelSection } from './ModelSection';
import { CaptionsSection, CodeSection, CursorSection, CutOutSection, DiagramSection, FlowSection, HoverSection, PathSection, RepeatSection, SplitImageSection, StepsSection } from './VectorSections';
import { focusCamera } from '../lib/tour';
import { suggestPoster } from '../lib/poster';
import { TransitionSection } from './TransitionSection';
import type { GroupLayer } from '@unysonplus/scene-player/types';
import { AlignPanel, type AlignMode, type AlignTo } from './AlignPanel';
import { SFX_CATALOG, SFX_CATEGORY_LABELS, sfxMeta, sfxSrc, suggestedSound, type SfxCategory } from '@unysonplus/scene-player/sfx';
import { cleanSound } from '../lib/audio';
import { sceneTranscript } from '@unysonplus/scene-player/transcript';
import type { ClipSound } from '@unysonplus/scene-player/types';


export interface Selection {
  /** The primary layer: the one the inspector shows. */
  layerId: string | null;
  clipId: string | null;
  /** In a Keyframes clip: the selected keyframe (its index in time order). */
  key?: number;
  /** A selected audio clip (by id). */
  audio?: string;
  /** A selected camera key (by id). */
  camera?: string;
  /** Every selected layer, primary last, when more than one is selected. */
  multi?: string[];
}

/** All selected layer ids (primary last). */
export const selectedIds = (sel: Selection): string[] => (sel.multi && sel.multi.length > 1 ? sel.multi : sel.layerId ? [sel.layerId] : []);

/** A selection of these layers, the last one primary. */
export const selectLayers = (ids: string[]): Selection => {
  const unique = [...new Set(ids)];
  return { layerId: unique[unique.length - 1] ?? null, clipId: null, multi: unique.length > 1 ? unique : undefined };
};

interface Props {
  scene: Scene;
  selection: Selection;
  /** The breakpoint showing in the preview; layout edits apply to it. */
  bp: string | null;
  onCommit: (scene: Scene) => void;
  onSelect: (sel: Selection) => void;
  alignTo: AlignTo;
  onAlignTo: (to: AlignTo) => void;
  onAlign: (mode: AlignMode) => void;
  onEnter: (groupId: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  /** The playhead, in scene time. */
  time: number;
  onSeek: (sceneTime: number) => void;
  /** Plays a sound right away (to hear it before choosing it). */
  onPreviewSound?: (src: string, volume?: number) => void;
}

const EASES = [
  'none', 'power1.out', 'power2.out', 'power3.out', 'power4.out', 'expo.out', 'circ.out', 'back.out(1.6)',
  'power2.in', 'power3.in', 'expo.in', 'power2.inOut', 'power3.inOut', 'expo.inOut', 'sine.inOut',
];

const WEIGHTS = ['300', '400', '500', '600', '700', '800', '900'].map((w) => ({ value: w, label: w }));
const ANCHORS: Anchor[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];

const bpLabel = (scene: Scene, id: string | null) => {
  const bp = scene.stage.breakpoints.find((b) => b.id === id);
  return bp?.label ?? bp?.id ?? 'this';
};

export function Inspector(props: Props) {
  const { scene, selection } = props;
  const layer = findLayer(scene, selection.layerId);
  const clip = findClip(scene, selection.layerId, selection.clipId);
  const ids = selectedIds(selection);
  if (ids.length > 1) return <MultiInspector {...props} ids={ids} />;
  if (layer && clip) return <ClipInspector {...props} layer={layer} clipId={clip.id} />;
  if (layer && layer.type === 'group') return <GroupInspector {...props} group={layer} />;
  if (layer) return <LayerInspector {...props} layer={layer} />;
  return <SceneInspector {...props} />;
}

/* ------------------------------------------------------------------ scene */

function SceneInspector({ scene, onCommit, time }: Props) {
  const set = (patch: Partial<Scene>) => onCommit({ ...scene, ...patch });
  const setStage = (patch: Partial<Scene['stage']>) => onCommit({ ...scene, stage: { ...scene.stage, ...patch } });
  const setPlayback = (patch: Partial<Scene['playback']>) => onCommit({ ...scene, playback: { ...scene.playback, ...patch } });
  const setScroll = (patch: NonNullable<Scene['playback']['scroll']>) => setPlayback({ scroll: { ...(scene.playback.scroll ?? {}), ...patch } });
  const setBp = (i: number, patch: Partial<Breakpoint>) =>
    setStage({ breakpoints: scene.stage.breakpoints.map((b, j) => (j === i ? { ...b, ...patch } : b)) });
  const fonts = scene.stage.fonts ?? [];

  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">Scene</p>
        <p className="insp-help">Select a layer on the stage or the timeline to edit it.</p>
        <div className="insp-start">
          <button type="button" className="btn small" onClick={() => onCommit(blankScene(scene))}>Start a blank scene</button>
          <button type="button" className="btn small" onClick={() => onCommit(validateScene(demo).scene)}>Load the demo</button>
        </div>
      </div>

      <Section title="Scene">
        <TextField label="Title" value={scene.title} onCommit={(v) => set({ title: v || undefined })} wide />
        <NumberField label="Length" value={scene.duration} unit="s" step={0.1} min={0.5} max={600} onCommit={(v) => v && set({ duration: v })} />
      </Section>

      <Section title="Playback">
        <SelectField
          label="Starts"
          value={scene.playback.trigger}
          options={[
            { value: 'view', label: 'When scrolled into view' }, { value: 'load', label: 'When the page loads' },
            { value: 'scroll', label: 'As the page scrolls' }, { value: 'manual', label: 'Only when told to' },
          ]}
          onChange={(v) => setPlayback({ trigger: v })}
        />
        {scene.playback.trigger !== 'scroll' && (
          <>
            <SelectField label="Advance" value={scene.playback.advance ?? 'auto'}
              options={[{ value: 'auto', label: 'Play straight through' }, { value: 'click', label: 'On click (a presentation)' }]}
              onChange={(v) => setPlayback({ advance: v === 'click' ? 'click' : undefined })} />
            {scene.playback.advance === 'click' && (
              <p className="field-hint wide">
                The scene stops at each of its {(scene.markers ?? []).length} marker{(scene.markers ?? []).length === 1 ? '' : 's'} and at the end, and
                waits for a click, a tap or the arrow keys. Add markers with <strong>+ Marker</strong> on the timeline (or M) at the
                playhead. Try it full screen (F).
              </p>
            )}
          </>
        )}
        {scene.playback.trigger === 'scroll' ? (
          <>
            <CheckField label="Pin while playing" checked={scene.playback.scroll?.pin ?? SCROLL_DEFAULTS.pin} onChange={(v) => setScroll({ pin: v })} />
            {(scene.playback.scroll?.pin ?? SCROLL_DEFAULTS.pin) && (
              <NumberField label="Scroll length" value={scene.playback.scroll?.length ?? SCROLL_DEFAULTS.length} unit="screens" step={0.1} min={0.2} max={10} onCommit={(v) => setScroll({ length: v ?? SCROLL_DEFAULTS.length })} />
            )}
            <NumberField label="Smoothing" value={scene.playback.scroll?.smooth ?? SCROLL_DEFAULTS.smooth} unit="s" step={0.05} min={0} max={3} onCommit={(v) => setScroll({ smooth: v ?? SCROLL_DEFAULTS.smooth })} />
            <p className="field-hint wide">
              Scrolling plays the scene forwards and back. Pinned, the stage holds still while the page scrolls the given
              number of screens. Scrub the timeline here to see any moment; try it on a real page:
            </p>
            <button type="button" className="btn small wide-btn" onClick={() => {
              const url = URL.createObjectURL(new Blob([scrollTestHtml(scene)], { type: 'text/html' }));
              window.open(url, '_blank', 'noopener');
              setTimeout(() => URL.revokeObjectURL(url), 60000);
            }}>Try scrolling in a test page</button>
          </>
        ) : (
          <EndBehaviour scene={scene} time={time} onPlayback={setPlayback} />
        )}
        {scene.playback.loop && scene.playback.trigger !== 'scroll' && (
          <NumberField label="Pause between loops" value={scene.playback.repeatDelay ?? 0} unit="s" step={0.1} min={0} onCommit={(v) => setPlayback({ repeatDelay: v ?? 0 })} />
        )}
        <NumberField
          label="Still frame"
          value={scene.playback.posterTime}
          placeholder={String(scene.duration)}
          unit="s" step={0.1} min={0} max={scene.duration} optional
          onCommit={(v) => setPlayback({ posterTime: v })}
        />
        <div className="insp-start">
          <button type="button" className="btn small" onClick={() => setPlayback({ posterTime: suggestPoster(scene) })} title="The most complete settled moment: every word in place, nothing mid-move">Suggest the best moment</button>
        </div>
        <p className="field-hint wide">The still frame is what visitors who turn off animation see, and a video's thumbnail.</p>
      </Section>

      <Section title="Stage">
        <SelectField
          label="Height"
          value={scene.stage.heightMode}
          options={[{ value: 'ratio', label: 'Keep the shape' }, { value: 'ratio-capped', label: 'Keep the shape, fit the window' }, { value: 'fill', label: 'Fill the window' }]}
          onChange={(v) => setStage({ heightMode: v })}
        />
        {scene.stage.heightMode !== 'ratio' && (
          <SelectField
            label="Window too short"
            value={scene.stage.fit ?? 'cover'}
            options={[{ value: 'cover', label: 'Trim top and bottom' }, { value: 'contain', label: 'Show it all' }]}
            onChange={(v) => setStage({ fit: v === 'cover' ? undefined : v })}
          />
        )}
        <NumberField label="Header offset" value={scene.stage.heightOffset ?? 0} unit="px" min={0} step={1} onCommit={(v) => setStage({ heightOffset: v || undefined })} />
        <NumberField label="Safe area" value={Math.round((scene.stage.safeArea ?? 0.06) * 1000) / 10} unit="%" min={0} max={45} step={0.5} onCommit={(v) => setStage({ safeArea: (v ?? 6) / 100 })} />
        <ColorField label="Background" value={scene.stage.background} placeholder="A colour or gradient" onCommit={(v) => setStage({ background: v || undefined })} />
      </Section>

      <Section title="Breakpoints">
        <div className="bp-table wide" role="table" aria-label="Breakpoints">
          <div className="bp-row bp-headrow" role="row">
            <span role="columnheader">Name</span><span role="columnheader">From width</span><span role="columnheader">Shape</span><span />
          </div>
          {scene.stage.breakpoints.map((b, i) => (
            <div className="bp-row" role="row" key={b.id}>
              <input aria-label="Breakpoint name" value={b.label ?? b.id} onChange={(e) => setBp(i, { label: e.target.value })} />
              <input aria-label="From width (px)" inputMode="numeric" defaultValue={b.minWidth} key={`mw${b.minWidth}`}
                onBlur={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= 0 && n !== b.minWidth) setBp(i, { minWidth: n }); }} />
              <span className="bp-ratio">
                <input aria-label="Shape width" inputMode="numeric" defaultValue={b.aspect[0]} key={`aw${b.aspect[0]}`}
                  onBlur={(e) => { const n = Number(e.target.value); if (n > 0 && n !== b.aspect[0]) setBp(i, { aspect: [n, b.aspect[1]] }); }} />
                <span aria-hidden="true">:</span>
                <input aria-label="Shape height" inputMode="numeric" defaultValue={b.aspect[1]} key={`ah${b.aspect[1]}`}
                  onBlur={(e) => { const n = Number(e.target.value); if (n > 0 && n !== b.aspect[1]) setBp(i, { aspect: [b.aspect[0], n] }); }} />
              </span>
              <button type="button" className="icon-link" aria-label={`Remove ${b.label ?? b.id}`} disabled={scene.stage.breakpoints.length < 2}
                onClick={() => setStage({ breakpoints: scene.stage.breakpoints.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button type="button" className="btn ghost small" onClick={() => {
            const n = scene.stage.breakpoints.length + 1;
            const id = `bp-${n}`;
            setStage({ breakpoints: [...scene.stage.breakpoints, { id, label: `Breakpoint ${n}`, minWidth: 0, aspect: [1, 1] }] });
          }}>Add breakpoint</button>
          {!scene.stage.breakpoints.some((b) => b.minRatio !== undefined) && (
            <button type="button" className="btn ghost small" title="A layout used only when the stage is much wider than tall (an ultrawide hero filling the window), so its content can spread out" onClick={() => {
              const widest = [...scene.stage.breakpoints].sort((a, b) => b.minWidth - a.minWidth)[0];
              setStage({ breakpoints: [{ id: 'ultrawide', label: 'Ultrawide', minWidth: widest?.minWidth ?? 1200, aspect: [21, 9], minRatio: 2.1 }, ...scene.stage.breakpoints] });
            }}>Add an ultrawide layout</button>
          )}
          {scene.stage.breakpoints.some((b) => b.minRatio !== undefined) && (
            <p className="field-hint wide">
              {scene.stage.breakpoints.filter((b) => b.minRatio !== undefined).map((b) => `${b.label ?? b.id} is used when the stage is at least ${b.minRatio}:1 wide`).join('; ')}
              {scene.stage.heightMode === 'ratio' ? ' (only with the Capped or Fill height, which give the stage a free shape).' : '.'}
            </p>
          )}
        </div>
      </Section>

      <Section title="Fonts">
        {fonts.map((f, i) => (
          <div className="font-row wide" key={i}>
            <TextField label="Family" value={f.family} onCommit={(v) => setStage({ fonts: fonts.map((x, j) => (j === i ? { ...x, family: v } : x)) })} />
            <TextField label="Stylesheet address" value={f.href} mono placeholder="https://…" onCommit={(v) => setStage({ fonts: fonts.map((x, j) => (j === i ? { ...x, href: v || undefined } : x)) })} />
            <button type="button" className="btn ghost small" onClick={() => setStage({ fonts: fonts.filter((_, j) => j !== i) })}>Remove font</button>
          </div>
        ))}
        <button type="button" className="btn ghost small wide-btn" onClick={() => setStage({ fonts: [...fonts, { family: 'Inter', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap' }] })}>Add font</button>
      </Section>

      <StepsSection scene={scene} onCommit={onCommit} />

      <TranscriptSection scene={scene} onCommit={onCommit} />
    </div>
  );
}

/**
 * Search engines and screen readers: the scene's words as plain text, in reading order. Shown here so the
 * author sees exactly what Google and a screen reader get.
 */
/** What happens at the end: stop, loop everything, or loop only the last part. */
function EndBehaviour({ scene, time, onPlayback }: { scene: Scene; time: number; onPlayback: (p: Partial<Scene['playback']>) => void }) {
  const pb = scene.playback;
  const mode = !pb.loop ? 'stop' : pb.loopFrom !== undefined ? 'last' : 'loop';
  // A first guess for "the last part": where the last act (top-level group) starts.
  const lastAct = () => {
    const starts = scene.layers.filter((l) => l.type === 'group' && (l.start ?? 0) > 0 && (l.start ?? 0) < scene.duration - 0.5).map((l) => l.start ?? 0);
    return starts.length ? Math.max(...starts) : Math.max(0, Math.round((scene.duration - 3) * 10) / 10);
  };
  const usable = time > 0.05 && time < scene.duration - 0.1;
  return (
    <>
      <SelectField
        label="At the end"
        value={mode}
        options={[{ value: 'stop', label: 'Stop on the last frame' }, { value: 'loop', label: 'Loop everything' }, { value: 'last', label: 'Loop the last part' }]}
        onChange={(v) => onPlayback(v === 'stop' ? { loop: false, loopFrom: undefined } : v === 'loop' ? { loop: true, loopFrom: undefined } : { loop: true, loopFrom: pb.loopFrom ?? lastAct() })}
      />
      {mode === 'last' && (
        <>
          <NumberField label="Loop from" value={pb.loopFrom} unit="s" step={0.1} min={0} max={Math.max(0, scene.duration - 0.1)}
            onCommit={(v) => onPlayback({ loopFrom: v === undefined ? lastAct() : Math.min(v, scene.duration - 0.1) })} />
          <button type="button" className="btn small wide-btn" disabled={!usable} onClick={() => onPlayback({ loopFrom: Math.round(time * 100) / 100 })}
            title={usable ? `Loop from ${time.toFixed(2)} s` : 'Move the playhead to where the loop should start'}>Use the playhead</button>
          <p className="field-hint wide">
            The scene plays once from the start, then repeats only from here to the end, so a closing button keeps moving
            while everything else holds. Start it after things have arrived, and give the button a clip that starts and
            ends at rest (Pulse, Float) so the repeat is seamless.
          </p>
        </>
      )}
    </>
  );
}

/**
 * Pin to the stage: the layer is placed against the stage (whatever box the scene fills) instead of
 * the scene's frame, so a corner is the real corner. Top-level layers only.
 */
function PinField({ scene, layer, onChange }: { scene: Scene; layer: Layer; onChange: (pin: Layer['pin']) => void }) {
  if (!scene.layers.some((l) => l.id === layer.id)) return null;
  return (
    <>
      <CheckField label="Pin to the stage" checked={layer.pin === 'stage'} onChange={(v) => onChange(v ? 'stage' : undefined)} />
      {layer.pin === 'stage' && (
        <p className="field-hint wide">
          X and Y are now % of the stage, so 100 / 100 with the bottom-right anchor is the stage's real corner, on any
          screen shape. It sits above the other layers and stays put when the camera moves. Try a wide window with the
          Fill or Capped height to see it hold the corner.
        </p>
      )}
    </>
  );
}

/** Makes a layer (or a whole group) a link. */
function LinkSection({ layer, scene, onChange }: { layer: Layer; scene: Scene; onChange: (link: Layer['link']) => void }) {
  const link = layer.link;
  const markers = scene.markers ?? [];
  const words = layer.type === 'text' ? layer.text : layer.type === 'image' ? layer.alt ?? '' : layer.type === 'group' ? groupWords(layer) : '';
  const set = (patch: Partial<NonNullable<Layer['link']>>) => {
    const next = { href: link?.href ?? '', ...link, ...patch };
    onChange(next.href.trim() ? { href: next.href.trim(), ...(next.newTab ? { newTab: true } : {}), ...(next.label?.trim() ? { label: next.label.trim() } : {}), ...(next.jump !== undefined && next.jump !== '' ? { jump: next.jump } : {}) } : undefined);
  };
  const bad = !!link?.href && !SAFE_HREF.test(link.href);
  return (
    <Section title="Link">
      <TextField label="Address" value={link?.href} placeholder="https://… or /page or #section" mono wide onCommit={(v) => set({ href: v })} />
      {link && (
        <>
          <CheckField label="Open in a new tab" checked={!!link.newTab} onChange={(v) => set({ newTab: v })} />
          <TextField label="Link text" value={link.label} placeholder={words.trim().slice(0, 60) || 'Needed for a shape'} wide onCommit={(v) => set({ label: v })} />
          <SelectField label="Hotspot: play from" value={link.jump === undefined ? '' : String(link.jump)}
            options={[{ value: '', label: 'No: follow the address' }, ...markers.map((m) => ({ value: m.id, label: `${m.label ?? m.id} (${m.t} s)` }))]}
            onChange={(v) => set({ jump: v || undefined })} />
          {markers.length === 0 && <p className="field-hint wide">Add markers (or Steps) to make hotspots that jump to a part of the scene.</p>}
        </>
      )}
      <p className={`field-hint wide${bad ? ' is-error' : ''}`}>
        {bad
          ? 'Only web addresses (https://…), pages on the same site (/…), anchors (#…), mailto: and tel: work. This link will be left out.'
          : link
            ? 'Visitors can click it on the page, and keyboard and screen reader users reach it through the scene’s text. Links do nothing while you edit; try them full screen (F).'
            : 'Give it an address to make it clickable on the page. On a group, the whole group is the link.'}
      </p>
    </Section>
  );
}

const groupWords = (l: Layer): string =>
  l.type === 'text' ? l.text : l.type === 'image' ? l.alt ?? '' : l.type === 'group' ? l.layers.map(groupWords).filter(Boolean).join(' ') : '';

function TranscriptSection({ scene, onCommit }: { scene: Scene; onCommit: (s: Scene) => void }) {
  const t = scene.transcript ?? {};
  const setT = (patch: Partial<NonNullable<Scene['transcript']>>) => {
    const next = { ...t, ...patch };
    if (next.headline === 'h2') delete next.headline;
    if (!next.decorative) delete next.decorative;
    const out: Scene = { ...scene, transcript: next };
    if (!Object.keys(next).length) delete out.transcript;
    onCommit(out);
  };
  const items = sceneTranscript(scene);
  return (
    <Section title="Search engines and screen readers">
      <SelectField label="Headline as" value={t.headline ?? 'h2'} onChange={(v) => setT({ headline: v as 'h1' | 'h2' | 'h3' | 'p' })}
        options={[{ value: 'h1', label: 'Heading 1 (the page’s main title)' }, { value: 'h2', label: 'Heading 2 (a section)' }, { value: 'h3', label: 'Heading 3' }, { value: 'p', label: 'Paragraph (no heading)' }]} />
      <CheckField label="Decorative (no text)" checked={!!t.decorative} onChange={(v) => setT({ decorative: v })} />
      <p className="field-hint wide">
        {t.decorative
          ? 'Search engines and screen readers skip this scene. Use it for animation that only decorates.'
          : 'An animation shows its words a few at a time, so the page also carries them once as plain text, in this order. Search engines index it and screen readers read it; visitors see the animation. Use Heading 1 only when the scene is the page’s main title.'}
      </p>
      {!t.decorative && (
        <ol className="transcript-preview wide" aria-label="What search engines and screen readers get">
          {items.length ? items.map((i, k) => (
            <li key={k} className={i.level ? 'is-heading' : ''}><span className="mono">{i.level ? `H${i.level}` : 'P'}</span>{i.text}</li>
          )) : <li className="is-empty">No text in this scene yet.</li>}
        </ol>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ group */

function GroupInspector({ scene, group, onCommit, onSelect, alignTo, onAlignTo, onAlign, onEnter, onUngroup }: Props & { group: GroupLayer }) {
  const props = (p: Record<string, unknown>) => onCommit(setLayerProps(scene, group.id, p));
  // What the length would be with nothing set: the end of the last clip inside.
  const auto = groupDuration({ ...group, duration: undefined });
  const siblings = layersIn(scene, containerOf(scene, group.id));
  const idx = siblings.findIndex((l) => l.id === group.id);
  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">Group</p>
        <input className="insp-title" aria-label="Group name" defaultValue={group.name ?? group.id} key={group.id + (group.name ?? '')}
          onBlur={(e) => { if (e.target.value !== (group.name ?? group.id)) props({ name: e.target.value || undefined }); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
        <p className="insp-help">
          {group.layers.length} {group.layers.length === 1 ? 'layer' : 'layers'} with a timeline of their own. Presets added here
          animate the group as a whole.
        </p>
        <div className="insp-start">
          <button type="button" className="btn small" onClick={() => onEnter(group.id)}>Open group</button>
          <button type="button" className="btn small" onClick={onUngroup} title="Ungroup (Ctrl+Shift+G)">Ungroup</button>
          <button type="button" className="btn small" onClick={() => onCommit(groupToRepeat(scene, group.id))} title="Use this group as the design for a list: one copy per entry, with placeholders in its text">Turn into a list</button>
        </div>
        <ul className="multi-list">
          {group.layers.map((l) => (
            <li key={l.id}><button type="button" className="crumb" onClick={() => { onEnter(group.id); onSelect({ layerId: l.id, clipId: null }); }}>{l.name || l.id}</button></li>
          ))}
        </ul>
      </div>

      <Section title="Timing">
        <NumberField label="Starts at" value={group.start ?? 0} step={0.1} min={0} max={scene.duration} unit="s"
          onCommit={(v) => props({ start: v || undefined })} />
        <NumberField label="Own length" value={group.duration} placeholder={String(Math.round(auto * 100) / 100)} step={0.1} min={0.1} unit="s" optional
          onCommit={(v) => props({ duration: v })} />
        <NumberField label="Disappears" value={group.end} placeholder={String(scene.duration)} step={0.1} min={0} max={scene.duration} unit="s" optional
          onCommit={(v) => props({ end: v === undefined || v >= scene.duration ? undefined : v })} />
        <NumberField label="Opacity" value={group.opacity ?? 1} step={0.05} min={0} max={1}
          onCommit={(v) => props({ opacity: v === undefined || v >= 1 ? undefined : v })} />
        <p className="field-hint wide">Moving the start moves everything inside. The own length is where the group's clock stops; left blank, it ends with its last clip.</p>
      </Section>

      <TransitionSection scene={scene} group={group} onCommit={onCommit} />

      {scene.layers.some((l) => l.id === group.id) && (
        <Section title="Pin">
          <PinField scene={scene} layer={group} onChange={(pin) => props({ pin })} />
        </Section>
      )}

      <LinkSection layer={group} scene={scene} onChange={(link) => props({ link })} />

      <section className="insp-section">
        <header><h3>Align</h3></header>
        <AlignPanel count={1} to={alignTo} onTo={onAlignTo} onAlign={onAlign} />
      </section>

      <div className="insp-actions">
        <button type="button" className="btn small" disabled={idx >= siblings.length - 1} onClick={() => onCommit(moveLayer(scene, group.id, 1))}>Bring forward</button>
        <button type="button" className="btn small" disabled={idx === 0} onClick={() => onCommit(moveLayer(scene, group.id, -1))}>Send backward</button>
        <button type="button" className="btn small danger" onClick={() => { onCommit(removeLayer(scene, group.id)); onSelect({ layerId: null, clipId: null }); }}>Delete group</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ layer */

/* ------------------------------------------------------------------ several layers */

function MultiInspector(props: Props & { ids: string[] }) {
  const { scene, ids, bp, onCommit, onSelect, alignTo, onAlignTo, onAlign } = props;
  const layers = ids.map((id) => findLayer(scene, id)).filter((l): l is Layer => !!l);
  const anyOverride = layers.some((l) => editsOverride(scene, l, bp));
  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">Selection</p>
        <h2 className="insp-title-static">{layers.length} layers</h2>
        <ul className="multi-list">
          {layers.map((l) => (
            <li key={l.id}>
              <button type="button" className="crumb" onClick={() => onSelect({ layerId: l.id, clipId: null })}>{l.name || l.id}</button>
            </li>
          ))}
        </ul>
        {anyOverride && (
          <div className="bp-note is-override">
            <p>Moves apply to the <strong>{bpLabel(scene, bp)}</strong> layout only.</p>
          </div>
        )}
      </div>

      <section className="insp-section">
        <header><h3>Align and distribute</h3></header>
        <AlignPanel count={layers.length} to={alignTo} onTo={onAlignTo} onAlign={onAlign} />
      </section>

      <p className="field-hint">Drag any of them on the stage to move them together. Click a preset to add it to each layer it suits.</p>

      <div className="insp-actions">
        <button type="button" className="btn small" onClick={props.onGroup} title="Group (Ctrl+G)">Group {layers.length} layers</button>
        <button type="button" className="btn small danger" onClick={() => {
          let next = scene;
          for (const l of layers) next = removeLayer(next, l.id);
          onCommit(next);
          onSelect({ layerId: null, clipId: null });
        }}>Delete {layers.length} layers</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ layer */

function LayerInspector({ scene, layer, bp, onCommit, onSelect, alignTo, onAlignTo, onAlign }: Props & { layer: Layer }) {
  const override = editsOverride(scene, layer, bp);
  const hasOverride = !!(bp && layer.overrides?.[bp]);
  const o = (bp && layer.overrides?.[bp]) || {};
  const box = { ...layer.box, ...(o.box ?? {}) };
  const style = layer.type === 'text' ? { ...layer.style, ...(o.style ?? {}) } : undefined;
  const text = layer.type === 'text' ? o.text ?? layer.text : undefined;

  const layout = (patch: LayoutPatch) => onCommit(writeLayout(scene, layer.id, bp, patch));
  const props = (p: Record<string, unknown>) => onCommit(setLayerProps(scene, layer.id, p));
  const idx = scene.layers.findIndex((l) => l.id === layer.id);
  const fonts = scene.stage.fonts ?? [];
  const primary = primaryBreakpoint(scene);

  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">{({ text: 'Text layer', shape: 'Shape layer', image: 'Image layer', model: '3D layer', group: 'Group', path: 'Line layer', flow: 'Flow lines', diagram: 'Diagram', code: 'Code', repeat: 'List', captions: 'Captions', cursor: 'Cursor' } as Record<Layer['type'], string>)[layer.type]}</p>
        <input className="insp-title" aria-label="Layer name" defaultValue={layer.name ?? layer.id} key={layer.id + (layer.name ?? '')}
          onBlur={(e) => { if (e.target.value !== (layer.name ?? layer.id)) props({ name: e.target.value || undefined }); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
        <div className={`bp-note${override ? ' is-override' : ''}`}>
          <p>
            {override
              ? <>Position, size and type changes apply to the <strong>{bpLabel(scene, bp)}</strong> layout only.</>
              : <>Editing the base layout. Switch to a smaller screen size to change that layout separately.</>}
          </p>
          {hasOverride && (
            <button type="button" className="btn ghost small" onClick={() => onCommit(clearOverride(scene, layer.id, bp!))}>
              Reset {bpLabel(scene, bp)} to {bpLabel(scene, primary)}
            </button>
          )}
        </div>
      </div>

      {layer.type === 'text' && style && (
        <Section title="Text">
          <TextField label="Text" value={text} multiline onCommit={(v) => layout({ text: v })} />
          <SelectField
            label="Font"
            value={style.fontFamily ?? ''}
            options={[{ value: '', label: 'System' }, ...fonts.map((f) => ({ value: f.family, label: f.family }))]}
            onChange={(v) => layout({ style: { fontFamily: v || undefined } })}
          />
          <NumberField label="Size" value={style.fontSize} step={0.1} min={0.2} max={60} unit="su" onCommit={(v) => v && layout({ style: { fontSize: v } })} />
          <SelectField label="Weight" value={String(style.fontWeight ?? 400)} options={WEIGHTS} onChange={(v) => layout({ style: { fontWeight: Number(v) } })} />
          <NumberField label="Line height" value={style.lineHeight ?? 1.05} step={0.05} min={0.5} max={3} onCommit={(v) => layout({ style: { lineHeight: v } })} />
          <NumberField label="Letter spacing" value={style.letterSpacing ?? 0} step={0.01} min={-0.5} max={2} unit="em" onCommit={(v) => layout({ style: { letterSpacing: v } })} />
          <SelectField
            label="Align"
            value={style.align ?? 'center'}
            options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Centre' }, { value: 'right', label: 'Right' }]}
            onChange={(v) => layout({ style: { align: v } })}
          />
          <ColorField label="Colour" value={style.color} onCommit={(v) => layout({ style: { color: v || undefined } })} />
          <CheckField label="Capitals" checked={!!style.uppercase} onChange={(v) => layout({ style: { uppercase: v || undefined } })} />
          <CheckField label="Italic" checked={!!style.italic} onChange={(v) => layout({ style: { italic: v || undefined } })} />
          <CheckField label="Pill around it" checked={!!layer.pill} onChange={(v) => props({ pill: v ? { stroke: style.color ?? '#ffffff' } : undefined })} />
          {layer.pill && <ColorField label="Pill outline" value={layer.pill.stroke} placeholder="None" onCommit={(v) => props({ pill: { ...layer.pill, stroke: v || undefined } })} />}
          {layer.pill && <ColorField label="Pill fill" value={layer.pill.fill} placeholder="None" onCommit={(v) => props({ pill: { ...layer.pill, fill: v || undefined } })} />}
          <p className="field-hint wide">Sizes are in stage units: 10 is a tenth of the stage width.{layer.pill ? ' The pill fits the words, and Change text resizes it smoothly to new ones.' : ''}</p>
        </Section>
      )}

      {layer.type === 'shape' && (
        <Section title="Shape">
          <SelectField label="Shape" value={layer.shape} options={[{ value: 'rect', label: 'Rectangle' }, { value: 'ellipse', label: 'Ellipse' }]} onChange={(v) => props({ shape: v })} />
          <NumberField label="Corner radius" value={layer.radius ?? 0} step={0.1} min={0} unit="su" onCommit={(v) => props({ radius: v })} />
          <ColorField label="Fill" value={layer.fill} placeholder="A colour or gradient" onCommit={(v) => props({ fill: v || undefined })} />
          <ColorField label="Outline" value={layer.stroke} onCommit={(v) => props({ stroke: v || undefined })} />
          <NumberField label="Outline width" value={layer.strokeWidth ?? 0.2} step={0.05} min={0} unit="su" onCommit={(v) => props({ strokeWidth: v })} />
          <NumberField label="Dashes" value={layer.dash} step={0.1} min={0} max={50} unit="su" optional placeholder="Solid" onCommit={(v) => props({ dash: v || undefined })} />
          {!!layer.dash && <NumberField label="Gap" value={layer.dashGap ?? Math.round(layer.dash * 80) / 100} step={0.1} min={0} max={50} unit="su" onCommit={(v) => props({ dashGap: v })} />}
          {!!layer.dash && <p className="field-hint wide">A dashed outline can march (Marching outline) and close up into a solid one (Make solid).</p>}
        </Section>
      )}

      {layer.type === 'model' && <ModelSection layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'path' && <PathSection layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'flow' && <FlowSection scene={scene} layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'cursor' && <CursorSection layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'repeat' && <RepeatSection layer={layer} set={(p) => props(p as Record<string, unknown>)} onUnpack={() => onCommit(repeatToGroup(scene, layer.id))} />}
      {layer.type === 'captions' && <CaptionsSection scene={scene} layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'code' && <CodeSection layer={layer} set={(p) => props(p as Record<string, unknown>)} />}
      {layer.type === 'diagram' && <DiagramSection layer={layer} set={(p) => props(p as Record<string, unknown>)} />}

      {layer.type === 'image' && (
        <Section title="Image">
          <ImageSource scene={scene} layer={layer} onCommit={onCommit} />
          <TextField label="Description" value={layer.alt} wide placeholder="What the image shows (blank if decorative)" onCommit={(v) => props({ alt: v })} />
          <SelectField label="Fit" value={layer.fit ?? 'cover'} options={[{ value: 'cover', label: 'Fill the box' }, { value: 'contain', label: 'Fit inside' }]} onChange={(v) => props({ fit: v })} />
          <NumberField label="Corner radius" value={layer.radius ?? 0} step={0.1} min={0} unit="su" onCommit={(v) => props({ radius: v })} />
        </Section>
      )}
      {layer.type === 'image' && (
        <SplitImageSection scene={scene} layer={layer} onCommit={onCommit} />
      )}
      {layer.type === 'image' && <CutOutSection scene={scene} layer={layer} onCommit={onCommit} onSelect={(id) => onSelect({ layerId: id, clipId: null })} />}

      {layer.type !== 'flow' && layer.type !== 'repeat' && <Section title="Position and size">
        <PinField scene={scene} layer={layer} onChange={(pin) => props({ pin })} />
        <NumberField label="X" value={box.x} step={0.5} unit="%" onCommit={(v) => v !== undefined && layout({ box: { x: v } })} />
        <NumberField label="Y" value={box.y} step={0.5} unit="%" onCommit={(v) => v !== undefined && layout({ box: { y: v } })} />
        <NumberField label="Width" value={box.w} step={0.5} min={0.1} unit="%" optional placeholder="Auto" onCommit={(v) => layout({ box: { w: v } })} />
        {layer.type !== 'text' && (
          box.ratio
            ? <NumberField label="Shape" value={box.ratio} step={0.05} min={0.05} unit=":1" onCommit={(v) => v && layout({ box: { ratio: v } })} />
            : <NumberField label="Height" value={box.h} step={0.5} min={0.1} unit="%" onCommit={(v) => v && layout({ box: { h: v } })} />
        )}
        <NumberField label="Rotate" value={box.rotate ?? 0} step={1} unit="°" onCommit={(v) => layout({ box: { rotate: v || undefined } })} />
        {layer.type !== 'text' && (
          <CheckField label="Keep shape" checked={!!box.ratio} onChange={(v) => {
            if (v) layout({ box: { ratio: Math.round(((box.w ?? 20) / (box.h ?? 20)) * 100) / 100 } });
            else layout({ box: { ratio: undefined, h: box.h ?? box.w ?? 20 } });
          }} />
        )}
        <Field label="Anchor" wide>
          {(id) => (
            <div className="anchor-grid" id={id} role="radiogroup" aria-label="Anchor point">
              {ANCHORS.map((a) => (
                <button key={a} type="button" role="radio" aria-checked={(box.anchor ?? 'center') === a} aria-label={a.replace('-', ' ')}
                  title={`Anchor: ${a.replace('-', ' ')}`}
                  className={(box.anchor ?? 'center') === a ? 'on' : undefined}
                  onClick={() => layout({ box: { anchor: a } })} />
              ))}
            </div>
          )}
        </Field>
      </Section>}

      {layer.type !== 'flow' && layer.type !== 'repeat' && <section className="insp-section">
        <header><h3>Align</h3></header>
        <AlignPanel count={1} to={alignTo} onTo={onAlignTo} onAlign={onAlign} />
      </section>}

      <Section title="Timing">
        <NumberField label="Appears" value={layer.start ?? 0} step={0.1} min={0} max={scene.duration} unit="s" onCommit={(v) => props({ start: v || undefined })} />
        <NumberField label="Disappears" value={layer.end} placeholder={String(scene.duration)} step={0.1} min={0} max={scene.duration} unit="s" optional onCommit={(v) => props({ end: v === undefined || v >= scene.duration ? undefined : v })} />
        <NumberField label="Opacity" value={layer.opacity ?? 1} step={0.05} min={0} max={1} onCommit={(v) => props({ opacity: v === undefined || v >= 1 ? undefined : v })} />
      </Section>

      <LinkSection layer={layer} scene={scene} onChange={(link) => props({ link })} />
      {layer.type !== 'cursor' && layer.type !== 'flow' && <HoverSection layer={layer} set={(hover) => props({ hover })} />}
      {layer.type !== 'cursor' && layer.type !== 'flow' && layer.type !== 'repeat' && (
        <Section title="Camera">
          <div className="insp-start">
            <button type="button" className="btn small" onClick={() => onCommit(focusCamera(scene, layer.id, playheadOf(scene)))} title="The camera glides in to frame this layer from the playhead, holds, and glides back">Focus the camera on it</button>
          </div>
          <p className="field-hint wide">Adds camera keys from the playhead: in to frame this layer, a hold, and back out. Add a Spotlight or a Callout to point it out.</p>
        </Section>
      )}

      <div className="insp-actions">
        <button type="button" className="btn small" disabled={idx >= scene.layers.length - 1} onClick={() => onCommit(moveLayer(scene, layer.id, 1))}>Bring forward</button>
        <button type="button" className="btn small" disabled={idx <= 0} onClick={() => onCommit(moveLayer(scene, layer.id, -1))}>Send backward</button>
        <button type="button" className="btn small" onClick={() => { const r = duplicateLayer(scene, layer.id); onCommit(r.scene); onSelect({ layerId: r.id, clipId: null }); }}>Duplicate</button>
        <button type="button" className="btn small danger" onClick={() => { onCommit(removeLayer(scene, layer.id)); onSelect({ layerId: null, clipId: null }); }}>Delete layer</button>
      </div>
    </div>
  );
}

function ImageSource({ scene, layer, onCommit }: { scene: Scene; layer: Extract<Layer, { type: 'image' }>; onCommit: (s: Scene) => void }) {
  const isData = layer.src.startsWith('data:');
  return (
    <div className="wide img-src">
      {isData ? (
        <p className="field-hint">Uploaded image, saved inside the scene ({Math.round((layer.src.length * 0.75) / 1024)} KB).</p>
      ) : (
        <TextField label="Image address" value={layer.src} mono placeholder="https://…" wide onCommit={(v) => onCommit(setLayerProps(scene, layer.id, { src: v }))} />
      )}
      <label className="btn small file-btn">
        {isData ? 'Replace image' : 'Upload an image'}
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = String(reader.result);
            const img = new Image();
            img.onload = () => {
              const ratio = Math.round((img.naturalWidth / img.naturalHeight) * 100) / 100;
              onCommit(writeLayout(setLayerProps(scene, layer.id, { src }), layer.id, null, { box: { ratio } }));
            };
            img.src = src;
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        }} />
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ clip */

function ClipInspector({ scene, layer, clipId, onCommit, onSelect, selection, time, onSeek, onPreviewSound }: Props & { layer: Layer; clipId: string }) {
  // Clip times are in the layer's container's time (a group's own clock inside a group).
  const parents = groupPath(scene, layer.id);
  const containerStart = parents.length ? groupOffset(scene, parents[parents.length - 1].id) : 0;
  const clip = layer.clips.find((c) => c.id === clipId)!;
  const meta = presetMeta[clip.preset];
  const params = { ...(meta?.defaults ?? {}), ...(clip.params ?? {}) };
  const set = (p: Record<string, unknown>) => onCommit(setClip(scene, layer.id, clip.id, p));
  const setParam = (key: string, value: unknown) => onCommit(setClipParam(scene, layer.id, clip.id, key, value));
  const fallbackEase = meta ? defaultEaseFor(meta, clip.params) : 'none';
  const ease = clip.ease ?? fallbackEase;
  const knownEase = EASES.includes(ease) || NAMED_EASE_IDS.includes(ease);
  const easeInfo = NAMED_EASES.find((e) => e.id === ease);

  return (
    <div className="insp">
      <div className="insp-head">
        <p className="insp-kicker">
          <button type="button" className="crumb" onClick={() => onSelect({ layerId: layer.id, clipId: null })}>{layer.name ?? layer.id}</button>
          <span aria-hidden="true"> › </span>Clip
        </p>
        <h2 className="insp-title-static">{meta?.label ?? clip.preset}</h2>
        {meta && <p className="insp-help">{meta.description}</p>}
      </div>

      <Section title="Clip">
        <SelectField
          label="Preset"
          value={clip.preset}
          options={PRESET_CATALOG.filter((p) => p.appliesTo.includes(layer.type)).map((p) => ({ value: p.id, label: p.label }))}
          onChange={(v) => set({ preset: v, params: undefined, ease: undefined })}
        />
        <NumberField label="Starts" value={clip.start} step={0.05} min={0} max={scene.duration} unit="s" onCommit={(v) => v !== undefined && set({ start: v })} />
        <NumberField label="Length" value={clip.duration} step={0.05} min={0.05} max={scene.duration} unit="s" onCommit={(v) => v && set({ duration: v })} />
        <Field label="Easing">
          {(id) => (
            <select id={id} value={knownEase ? ease : '__custom'} onChange={(e) => set({ ease: e.target.value === fallbackEase ? undefined : e.target.value })}>
              {!knownEase && <option value="__custom">{ease}</option>}
              <optgroup label="Measured (recommended)">
                {NAMED_EASES.map((e) => <option key={e.id} value={e.id}>{e.label} · {e.role === 'enter' ? 'in' : e.role === 'exit' ? 'out' : 'any'}{e.id === fallbackEase ? ' (default)' : ''}</option>)}
              </optgroup>
              <optgroup label="Classic">
                {EASES.map((e) => <option key={e} value={e}>{e}{e === fallbackEase ? ' (default)' : ''}</option>)}
              </optgroup>
            </select>
          )}
        </Field>
        {easeInfo && <p className="field-hint wide">{easeInfo.use} Typical length {easeInfo.seconds} s.</p>}
      </Section>

      {meta && meta.fields.length > 0 && (
        <Section title="Settings">
          {meta.fields.map((f) => <ParamField key={f.key} field={f} value={params[f.key]} onChange={(v) => setParam(f.key, v)} layers={f.type === 'layer' ? layerChoices(scene, layer.id) : undefined} />)}
        </Section>
      )}
      {clip.preset === 'keyframes' && (
        <section className="insp-section">
          <header><h3>Keyframes</h3></header>
          <KeyframeEditor
            scene={scene} layerId={layer.id} clip={clip}
            playhead={time - containerStart - clip.start}
            selectedKey={selection.key}
            onSelectKey={(key) => onSelect({ layerId: layer.id, clipId: clip.id, key })}
            onCommit={onCommit}
            onSeek={(t) => onSeek(containerStart + clip.start + t)}
          />
        </section>
      )}

      <SoundSection
        sound={clip.sound}
        suggested={suggestedSound(clip, meta?.defaults)}
        onChange={(s) => set({ sound: cleanSound(s) })}
        onPreview={onPreviewSound}
      />

      <div className="insp-actions">
        <button type="button" className="btn small danger" onClick={() => { onCommit(removeClip(scene, layer.id, clip.id)); onSelect({ layerId: layer.id, clipId: null }); }}>Delete clip</button>
      </div>
    </div>
  );
}

/** A built-in sound that plays with the clip (and moves with it). */
function SoundSection({ sound, suggested, onChange, onPreview }: {
  sound: ClipSound | undefined;
  suggested: string | null;
  onChange: (s: ClipSound | undefined) => void;
  onPreview?: (src: string, volume?: number) => void;
}) {
  const hear = (s: ClipSound | undefined) => s && onPreview?.(sfxSrc(s.name, s.pitch ?? 1), s.volume ?? 1);
  const cats = Object.keys(SFX_CATEGORY_LABELS) as SfxCategory[];
  return (
    <Section title="Sound">
      <Field label="Sound" wide>
        {(id) => (
          <div className="snd-pick">
            <select id={id} value={sound?.name ?? ''} onChange={(e) => {
              const next = e.target.value ? { ...(sound ?? {}), name: e.target.value } : undefined;
              onChange(next);
              hear(next);
            }}>
              <option value="">None</option>
              {suggested && <option value={suggested}>{sfxMeta(suggested)?.label} (suggested)</option>}
              {cats.map((c) => (
                <optgroup key={c} label={SFX_CATEGORY_LABELS[c]}>
                  {SFX_CATALOG.filter((s) => s.category === c).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </optgroup>
              ))}
            </select>
            <button type="button" className="icon-btn" disabled={!sound} onClick={() => hear(sound)} aria-label="Play the sound" title="Play the sound">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </button>
          </div>
        )}
      </Field>
      {sound ? (
        <>
          <SelectField label="Plays at" value={sound.at ?? 'start'} onChange={(v) => onChange({ ...sound, at: v as ClipSound['at'] })}
            options={[{ value: 'start', label: 'Clip start' }, { value: 'end', label: 'Clip end (landing)' }]} />
          <NumberField label="Offset" value={sound.delay ?? 0} step={0.02} min={-5} max={5} unit="s" onCommit={(v) => onChange({ ...sound, delay: v ?? 0 })} />
          <NumberField label="Volume" value={Math.round((sound.volume ?? 1) * 100)} step={5} min={0} max={200} unit="%" onCommit={(v) => onChange({ ...sound, volume: v === undefined ? 1 : v / 100 })} />
          <NumberField label="Pitch" value={Math.round((sound.pitch ?? 1) * 100)} step={5} min={50} max={200} unit="%" onCommit={(v) => { const n = { ...sound, pitch: v === undefined ? 1 : v / 100 }; onChange(n); hear(n); }} />
          <p className="field-hint wide">{sfxMeta(sound.name)?.description} The sound moves with the clip. Higher pitch is also shorter.</p>
        </>
      ) : (
        <p className="field-hint wide">{suggested ? `Suits this preset: ${sfxMeta(suggested)?.label}. ` : ''}Built-in sounds cost nothing to load. On websites, sound starts muted until the visitor taps the sound button.</p>
      )}
    </Section>
  );
}

/** Every other layer in the scene, for a preset that points at one. */
function layerChoices(scene: Scene, self: string): Array<{ value: string; label: string }> {
  const out: Array<{ value: string; label: string }> = [];
  const walk = (list: Layer[]) => list.forEach((l) => { if (l.id !== self) out.push({ value: l.id, label: l.name ? `${l.name} (${l.id})` : l.id }); if (l.type === 'group') walk(l.layers); });
  walk(scene.layers);
  return out;
}

/** The playhead, as the Studio last reported it (for actions that start "here"). */
function playheadOf(scene: Scene): number {
  const t = (window as unknown as { __upwPlayhead?: number }).__upwPlayhead;
  return typeof t === 'number' ? Math.min(scene.duration, Math.max(0, t)) : 0;
}

function ParamField({ field, value, onChange, layers }: { field: PresetField; value: unknown; onChange: (v: unknown) => void; layers?: Array<{ value: string; label: string }> }) {
  switch (field.type) {
    case 'longtext':
      return <TextField label={field.label} value={typeof value === 'string' ? value : ''} wide mono multiline onCommit={onChange} />;
    case 'layer':
      return <SelectField label={field.label} value={typeof value === 'string' ? value : ''} options={[{ value: '', label: 'None' }, ...(layers ?? [])]} onChange={onChange} />;
    case 'number':
      return <NumberField label={field.label} value={typeof value === 'number' ? value : undefined} step={field.step} min={field.min} max={field.max} unit={field.unit} onCommit={(v) => v !== undefined && onChange(v)} />;
    case 'select':
      return <SelectField label={field.label} value={String(value ?? field.options[0].value)} options={field.options} onChange={onChange} />;
    case 'boolean':
      return <CheckField label={field.label} checked={value !== false} onChange={onChange} />;
    case 'color':
      return <ColorField label={field.label} value={typeof value === 'string' ? value : ''} onCommit={onChange} />;
    case 'text':
      return <TextField label={field.label} value={typeof value === 'string' ? value : ''} wide mono onCommit={onChange} />;
    case 'code':
      return (
        <>
          <TextField label={field.label} value={typeof value === 'string' ? value : ''} wide mono multiline onCommit={onChange} />
          <p className="field-hint wide">
            JavaScript run once when the scene builds. You get <code>el</code> (the layer), <code>tl</code> (the scene timeline),
            {' '}<code>gsap</code>, <code>at</code> (this clip's start), <code>duration</code>, <code>ease</code> and <code>layer</code>.
            Add your tweens to <code>tl</code> at <code>at</code> so scrubbing and looping work. Embeds run custom code only when you allow it.
          </p>
        </>
      );
  }
}
