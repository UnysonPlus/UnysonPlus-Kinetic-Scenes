import { registerWebMcp } from './lib/webmcp';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { validateScene } from '@unysonplus/scene-player/validate';
import type { HeightMode, Layer, Scene } from '@unysonplus/scene-player/types';
import demo from './scenes/demo.json';
import { previewHtml } from './lib/documents';
import { ExportDialog } from './components/ExportDialog';
import { AddonsDialog } from './components/AddonsDialog';
import { MusicDialog } from './components/MusicDialog';
import { MenuBar, type Menu } from './components/MenuBar';
import { AiAssist, type ChatMessage } from './components/AiAssist';
import { CheckPanel } from './components/CheckPanel';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { kitStatus, type KitStatus } from './lib/ai';
import { lintScene, type LintIssue } from '@unysonplus/scene-player/lint';
import type { LayoutIssue } from '@unysonplus/scene-player/layout';
import { clipEase, framesOf, isKeyframes, setKey, valueAt, writeFrames } from './lib/keyframes';
import { addMarker } from './lib/markers';
import { clearShareHash, hasSharedScene, readSharedScene } from './lib/share';
import { addAudio, addSuggestedSounds, clearClipSounds, cleanSound, removeAudio, soundCounts, useSceneAudio } from './lib/audio';
import { SoundLibrary } from './components/SoundLibrary';
import { CameraInspector } from './components/CameraInspector';
import { removeCameraKey } from './lib/cameraOps';
import type { QueuedRequest } from './components/AiAssist';
import { beatsText, voiceBase, voiceBeats, voiceBrief, voiceRequest } from './lib/voiceScene';
import { StyleLibrary } from './components/StyleLibrary';
import { BUILT_IN_STYLES, applyStyle, loadCustomStyles, saveCustomStyles, starterScene, styleFromScene, type SceneStyle } from './lib/styles';
import { sfxMeta, sfxSrc, soundTrack } from '@unysonplus/scene-player/sfx';
import { AudioInspector } from './components/AudioInspector';
import { useEditorConnection } from './lib/connection';
import { formatScene } from './lib/format';
import { useHistory } from './lib/history';
import { createProject, readProject, saveProject as saveToFolder, watchProject, workspaceAvailable, type OpenProject } from './lib/workspace';
import { AGENTS_GUIDE, ProjectsDialog } from './components/ProjectsDialog';
import { NotesDialog } from './components/NotesDialog';
import { StockDialog } from './components/StockDialog';
import { BatchDialog } from './components/BatchDialog';
import { HighlightsDialog } from './components/HighlightsDialog';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { fillScene, rowLabel } from './lib/batch';
import type { Sheet } from './lib/batch';
import { stockInStudio } from './lib/stock';
import type { StockResult } from './lib/stock';
import {
  addClip, addLayer, blankScene, boxAt, containerOf, duplicateLayer, findClip, findLayer, groupLayers, layersIn, moveBy, removeClip,
  removeLayer, roundTime, setClip, ungroupLayer, writeLayout,
} from './lib/sceneOps';
import { groupDuration, groupOffset, groupPath } from '@unysonplus/scene-player/groups';
import { VIDEO_FORMATS, zonesFor } from '@unysonplus/scene-player/video';
import type { VideoFormat } from '@unysonplus/scene-player/types';
import { footageIds, getFootage, probeVideo, putFootage } from './lib/footage';
import { isRecording, screencastScene } from './lib/screencast';
import { insertPiece } from './lib/pieces';
import { logoLayer } from './lib/brand';
import { sortFormats } from './lib/videoMode';
import { PiecesLibrary } from './components/PiecesLibrary';
import { DEVICES, Preview, type Device } from './components/Preview';
import { Transport } from './components/Transport';
import { ScenePanel } from './components/ScenePanel';
import { Segmented } from './components/Segmented';
import { Inspector, selectedIds, selectLayers, type Selection } from './components/Inspector';
import type { AlignMode, AlignTo } from './components/AlignPanel';
import { Library } from './components/Library';
import { Timeline } from './components/Timeline';
import {
  DesktopIcon, DownloadIcon, FullscreenIcon, LaptopIcon, Logo, PhoneIcon, RedoIcon, TabletIcon, UndoIcon,
} from './components/icons';

const DRAFT_KEY = 'upw-studio-draft-v1';
const PROJECT_KEY = 'upw-studio-project';
const DEMO = validateScene(demo).scene;

function loadInitial(): Scene {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const r = validateScene(JSON.parse(raw));
      // The first, 7-second demo left untouched: show the current demo instead (edited drafts are kept).
      const ids = r.ok ? r.scene.layers.map((l) => l.id).join(',') : '';
      if (r.ok && r.scene.duration === 7 && ids === 'glow,kicker,line1,line2,rule,dot,sub') return DEMO;
      if (r.ok) return r.scene;
    }
  } catch {
    /* Blocked storage or an unreadable draft: start from the demo. */
  }
  return DEMO;
}

function saveDraft(scene: Scene) {
  try {
    localStorage.setItem(DRAFT_KEY, formatScene(scene));
  } catch {
    /* Private windows and blocked storage: the draft just isn't kept. */
  }
}

function slug(scene: Scene) {
  return (scene.title || 'animation').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'animation';
}

function download(name: string, type: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The checkerboard behind a see-through video. */
const CHECKER = 'repeating-conic-gradient(#2a2f36 0% 25%, #1c2026 0% 50%) 50% / 24px 24px';

const DEVICE_ICONS: Record<string, JSX.Element> = {
  desktop: <DesktopIcon />, laptop: <LaptopIcon />, tablet: <TabletIcon />, mobile: <PhoneIcon />,
};

const HEIGHT_MODES: Array<{ value: HeightMode; label: string; hint: string }> = [
  { value: 'ratio', label: 'Ratio', hint: 'Keeps its shape; the page scrolls if it is taller than the window' },
  { value: 'ratio-capped', label: 'Capped', hint: 'Keeps its shape but never grows taller than the window' },
  { value: 'fill', label: 'Fill', hint: 'Exactly one window tall, whatever its shape' },
];

interface PreviewState {
  time: number;
  duration: number;
  playing: boolean;
  breakpoint: string | null;
  stageHeight: number;
}

interface KeyInfo {
  key: string;
  code: string;
  mod: boolean;
  shift: boolean;
  alt: boolean;
}

export function App() {
  const history = useHistory<Scene>(loadInitial);
  const scene = history.present;
  const [selection, setSelection] = useState<Selection>({ layerId: null, clipId: null });
  // A phone starts on the Mobile layout: a 1920 px desktop window scaled to a phone's width is too small to work on.
  const [deviceId, setDeviceId] = useState<Device['id']>(() => (typeof matchMedia === 'function' && matchMedia('(max-width: 560px)').matches ? 'mobile' : 'desktop'));
  const [safe, setSafe] = useState(false);
  /** Camera view: see the camera's moves in the preview (off to edit the flat layout). */
  const [cameraView, setCameraView] = useState(true);
  const [tab, setTab] = useState<'inspect' | 'check' | 'json'>('inspect');
  // AI assist: the chat with the AI Dev Kit, and whether the kit is there.
  const [assistOpen, setAssistOpen] = useState(false);
  /** The layer being renamed in the timeline. */
  const [renaming, setRenaming] = useState<string | null>(null);
  /** Styles: the built-in ones plus the user's own (kept in this browser), and the one AI assist follows. */
  const [customStyles, setCustomStyles] = useState<SceneStyle[]>(() => loadCustomStyles());
  const allStyles = useMemo(() => [...BUILT_IN_STYLES, ...customStyles], [customStyles]);
  const [aiStyle, setAiStyleState] = useState<string | null>(() => { try { return localStorage.getItem('upw-studio-ai-style'); } catch { return null; } });
  const setAiStyle = useCallback((id: string | null) => {
    setAiStyleState(id);
    try { if (id) localStorage.setItem('upw-studio-ai-style', id); else localStorage.removeItem('upw-studio-ai-style'); } catch { /* private window */ }
  }, []);
  /** Playing full screen. */
  const [fullscreen, setFullscreen] = useState(false);
  const [kit, setKit] = useState<KitStatus>({ state: 'checking' });
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [queued, setQueued] = useState<QueuedRequest | null>(null);
  const [state, setState] = useState<PreviewState>({ time: 0, duration: scene.duration, playing: false, breakpoint: null, stageHeight: 0 });
  /** Sound in the Studio (the preview's audio, played here in step with it). */
  const [soundOn, setSoundOn] = useState(true);
  const { engine: audioEngine, info: audioInfo, peaksPerSecond, waiting: soundWaiting } = useSceneAudio(scene, state, soundOn);
  // The playhead, for inspector actions that start "here" (Focus the camera on it).
  (window as unknown as { __upwPlayhead?: number }).__upwPlayhead = state.time;
  const audioRef = useRef<HTMLInputElement>(null);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [alignTo, setAlignTo] = useState<AlignTo>('selection');
  /** The group being edited (double-click to enter, Escape to leave); null = the whole scene. */
  const [scope, setScope] = useState<string | null>(null);
  // Opened from a Unyson+ page editor ("Open in Kinetic Scenes"): load its scene, offer "Save to page".
  const conn = useEditorConnection((incoming) => {
    commit(incoming);
    setSelection({ layerId: null, clipId: null });
    setNotice('Loaded the scene from your page. Undo to go back to what you had here.');
  });
  const sceneAtLoad = useRef<Scene | null>(null);
  // The preview document is built once; after that, scene changes are sent to it as messages.
  const [srcDoc] = useState(() => previewHtml(scene, { safeArea: false }));

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const openRef = useRef<HTMLInputElement>(null);
  const screencastRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const sentScene = useRef<Scene>(scene);
  const firstReady = useRef(true);

  // Latest values for handlers that outlive a render (message and key listeners).
  const latest = useRef({ scene, selection, state, scope });
  latest.current = { scene, selection, state, scope };

  // A video is previewed at its exact pixel size, one format at a time.
  const video = scene.mode === 'video' && scene.video ? scene.video : null;
  const [formatId, setFormatId] = useState<VideoFormat | null>(null);
  const format: VideoFormat | null = video ? (formatId && video.formats.includes(formatId) ? formatId : video.formats[0]) : null;
  const device: Device = format
    ? { id: format, label: VIDEO_FORMATS[format].label, width: VIDEO_FORMATS[format].width, height: VIDEO_FORMATS[format].height }
    : DEVICES.find((d) => d.id === deviceId)!;
  const zones = video && format && safe ? zonesFor(video.platform, format) : undefined;
  const footageRef = useRef<HTMLInputElement>(null);
  const sentFootage = useRef(new Set<string>());
  const post = useCallback((msg: Record<string, unknown>) => iframeRef.current?.contentWindow?.postMessage(msg, '*'), []);
  const commit = history.commit;

  // ---- keep the preview in step with the scene, selection and settings ----
  // Videos from a spreadsheet: the rows, the pictures they name, and the row shown on the stage (the scene is not changed).
  const [batchOpen, setBatchOpen] = useState(false);
  const [sheet, setSheet] = useState<{ sheet: Sheet | null; files: Map<string, string> }>({ sheet: null, files: new Map() });
  const [rowView, setRowView] = useState<number | null>(null);
  const shown = useMemo(() => (rowView !== null && sheet.sheet?.rows[rowView] ? fillScene(scene, sheet.sheet.rows[rowView], sheet.files) : scene), [scene, rowView, sheet]);
  useEffect(() => {
    if (!ready || sentScene.current === shown) return;
    sentScene.current = shown;
    post({ type: 'scene', scene: shown });
  }, [shown, ready, post]);
  const selKey = selectedIds(selection).join('|');
  useEffect(() => { if (ready) post({ type: 'select', ids: selKey ? selKey.split('|') : [] }); }, [selKey, ready, post]);
  useEffect(() => { if (ready) post({ type: 'safe', show: safe }); }, [safe, ready, post]);
  // A see-through video shows a checkerboard behind it; anything else the page's own colour.
  const seeThrough = !!video?.transparent;
  useEffect(() => { if (ready) post({ type: 'backdrop', value: seeThrough ? CHECKER : '' }); }, [seeThrough, ready, post]);
  // Footage lives in this browser's database: the preview is sent each file once (it makes its own address).
  useEffect(() => {
    if (!ready) return;
    for (const id of footageIds(scene)) {
      if (sentFootage.current.has(id)) continue;
      sentFootage.current.add(id);
      getFootage(id).then((blob) => {
        if (blob) post({ type: 'footage', id, blob });
        else setNotice('Some footage is not on this computer any more (it is kept in the browser where it was added). Add it again.');
      });
    }
  }, [scene, ready, post]);
  useEffect(() => { if (ready) post({ type: 'camera', on: cameraView }); }, [cameraView, ready, post]);
  useEffect(() => { if (ready) post({ type: 'ui', scale }); }, [scale, ready, post]);

  useEffect(() => { if (ready) post({ type: 'scope', id: scope }); }, [scope, ready, post]);
  useEffect(() => {
    if (scope && findLayer(scene, scope)?.type !== 'group') setScope(null);
  }, [scene, scope]);

  // Drop a selection that no longer exists (after undo, delete or a file edit).
  useEffect(() => {
    const { layerId, clipId } = selection;
    const ids = selectedIds(selection);
    const alive = ids.filter((id) => findLayer(scene, id));
    if (alive.length !== ids.length) setSelection(selectLayers(alive));
    else if (layerId && clipId && !findClip(scene, layerId, clipId)) setSelection({ layerId, clipId: null });
  }, [scene, selection]);

  // Any edit after a save means the page's copy is out of date again.
  useEffect(() => {
    if (sceneAtLoad.current === null) { sceneAtLoad.current = scene; return; }
    conn.touched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Autosave the working scene in this browser.
  useEffect(() => {
    const t = setTimeout(() => saveDraft(scene), 400);
    return () => clearTimeout(t);
  }, [scene]);

  // ---- the workspace: the scene kept in a project folder on this computer (AI Dev Kit), shared with an AI agent ----
  const [project, setProject] = useState<OpenProject | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  /** Bumped when the project's notes change in the folder (the agent added something). */
  const [notesChanged, setNotesChanged] = useState(0);
  const [projectSave, setProjectSave] = useState<'saved' | 'saving' | 'error'>('saved');
  const projectRef = useRef(project);
  projectRef.current = project;
  /** The scene last read from or written to the folder (nothing to save while the scene is this one). */
  const synced = useRef<Scene | null>(null);
  /** Saves and outside changes are handled one after another, each from the file version the previous one left. */
  const saveChain = useRef<Promise<void>>(Promise.resolve());

  /** Takes the folder's version of the scene (opening, or an outside change). Undo goes back. */
  const takeFromFolder = useCallback((id: string, raw: Scene, mtime: number): boolean => {
    const v = validateScene(raw);
    if (!v.ok) { setNotice(`The project “${id}” can't be played: ${v.errors[0]}`); return false; }
    synced.current = v.scene;
    setProject({ id, mtime });
    commit(v.scene);
    return true;
  }, [commit]);

  const openFolderProject = useCallback(async (id: string, quiet = false) => {
    try {
      const r = await readProject(id);
      if (!takeFromFolder(id, r.scene, r.mtime)) return;
      setSelection({ layerId: null, clipId: null });
      try { localStorage.setItem(PROJECT_KEY, id); } catch { /* private window */ }
      setNotice(quiet ? `Project “${id}”.` : `Opened the project “${id}”. Undo brings back the scene you had.`);
    } catch (e) {
      setNotice(`The project “${id}” could not be opened: ${(e as Error).message}`);
    }
  }, [takeFromFolder]);

  // Reopen the project named in the address (?project=…, the link an agent gives) or the one from last time.
  useEffect(() => {
    let id: string | null = new URLSearchParams(location.search).get('project');
    if (!id) try { id = localStorage.getItem(PROJECT_KEY); } catch { /* private window */ }
    if (!id) return;
    const want = id;
    workspaceAvailable().then((ok) => {
      if (ok) openFolderProject(want, true);
      // Its media plays from the kit: without it, say so rather than show a copy with nothing playing.
      else setNotice(`The project “${want}” plays from the AI Dev Kit, which is not running. Start it (start.bat or start.command), then reload this page.`);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushProject = useCallback(() => {
    saveChain.current = saveChain.current.then(async () => {
      const p = projectRef.current;
      const sc = latest.current.scene;
      if (!p || sc === synced.current) return;
      try {
        const r = await saveToFolder(p.id, sc, p.mtime);
        synced.current = sc;
        projectRef.current = { id: p.id, mtime: r.mtime };
        setProject(projectRef.current);
        setProjectSave(latest.current.scene === sc ? 'saved' : 'saving');
      } catch (e) {
        const err = e as Error & { status?: number; current?: { scene: Scene; mtime: number } };
        if (err.status === 409 && err.current) {
          // Changed in the folder at the same moment (an agent): the folder wins, this edit is one Undo away.
          takeFromFolder(p.id, err.current.scene, err.current.mtime);
          projectRef.current = { id: p.id, mtime: err.current.mtime };
          setProjectSave('saved');
          setNotice('The project changed in its folder while you edited: showing that version. Undo brings back your edit.');
        } else {
          setProjectSave('error');
          setNotice(`Not saved to the project folder: ${err.message}`);
        }
      }
    });
    return saveChain.current;
  }, [takeFromFolder]);

  // Save into the folder as you work.
  useEffect(() => {
    if (!project || scene === synced.current) return;
    setProjectSave('saving');
    const t = setTimeout(flushProject, 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, project?.id]);

  // Changes made in the folder (by an AI agent, another window) show up here at once.
  useEffect(() => {
    if (!project) return;
    return watchProject(project.id, (ev) => {
      if (ev.kind === 'notes') { setNotesChanged((n) => n + 1); return; }
      if (ev.kind !== 'scene') return;
      saveChain.current = saveChain.current.then(async () => {
        const p = projectRef.current;
        if (!p || (ev.mtime != null && Math.abs(ev.mtime - p.mtime) <= 1)) return;
        try {
          const r = await readProject(p.id);
          if (takeFromFolder(p.id, r.scene, r.mtime)) {
            projectRef.current = { id: p.id, mtime: r.mtime };
            setNotice('Updated from the project folder. Undo goes back.');
          }
        } catch { /* mid-write: the next change event brings it */ }
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const newFolderProject = useCallback(async (name: string) => {
    const sc = { ...latest.current.scene, title: name };
    commit(sc);
    synced.current = sc;
    const p = await createProject(name, sc);
    projectRef.current = p;
    setProject(p);
    setProjectSave('saved');
    try { localStorage.setItem(PROJECT_KEY, p.id); } catch { /* private window */ }
    setNotice(`Created the project “${p.id}”: it saves into its folder as you work.`);
  }, [commit]);

  const closeFolderProject = useCallback(() => {
    setProject(null);
    synced.current = null;
    try { localStorage.removeItem(PROJECT_KEY); } catch { /* private window */ }
    setNotice('Closed the project. The scene stays here, kept in this browser.');
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), Math.max(3200, notice.length * 55)); // long notes stay long enough to read
    return () => clearTimeout(t);
  }, [notice]);

  const play = useCallback(() => post({ type: 'play' }), [post]);
  const pause = useCallback(() => post({ type: 'pause' }), [post]);
  // The playhead moves at once: the stage reports its time too, but a browser pauses a stage that is scrolled off screen
  // (a phone scrolled down to the timeline), and the playhead would otherwise wait for it.
  const seek = useCallback((t: number) => {
    post({ type: 'seek', time: t });
    setState((st) => ({ ...st, time: Math.max(0, Math.min(st.duration || t, t)), playing: false }));
  }, [post]);
  // An AI in the browser (WebMCP, where the browser offers it) can work on the scene in front of the person.
  useEffect(() => {
    const r = registerWebMcp({
      scene: () => latest.current.scene,
      commit: (next) => commit(next),
      seek: (t) => seek(t),
      select: (id) => setSelection(id ? { layerId: id, clipId: null } : { layerId: null, clipId: null }),
    });
    return r.dispose;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- actions ----
  type LeafType = Exclude<Layer['type'], 'group'>;
  const addLayerOfType = useCallback((type: LeafType, extra: Partial<Layer> = {}) => {
    const r = addLayer(latest.current.scene, type, extra, latest.current.scope);
    commit(r.scene);
    setSelection({ layerId: r.id, clipId: null });
  }, [commit]);

  const onAddLayer = (type: LeafType) => {
    if (type === 'image') imageRef.current?.click();
    else if (type === 'video') footageRef.current?.click();
    else addLayerOfType(type);
  };

  /** Steps into a group: the timeline shows its layers on its own clock, the stage dims the rest. */
  const enterGroup = useCallback((id: string) => {
    if (findLayer(latest.current.scene, id)?.type !== 'group') return;
    setScope(id);
    setSelection({ layerId: null, clipId: null });
  }, []);

  /** Leaves the current group (or jumps to an outer one), selecting the group just left. */
  const leaveTo = useCallback((target: string | null) => {
    const from = latest.current.scope;
    setScope(target);
    setSelection(from ? { layerId: from, clipId: null } : { layerId: null, clipId: null });
  }, []);

  const groupSelection = useCallback(() => {
    const { scene: s, selection: sel } = latest.current;
    const r = groupLayers(s, selectedIds(sel));
    if (!r) return;
    commit(r.scene);
    setSelection({ layerId: r.id, clipId: null });
    setNotice('Grouped. Double-click the group to edit what is inside.');
  }, [commit]);

  const ungroupSelection = useCallback(() => {
    const { scene: s, selection: sel } = latest.current;
    const g = findLayer(s, sel.layerId);
    if (!g || g.type !== 'group') return;
    const kids = g.layers.map((l) => l.id);
    const r = ungroupLayer(s, g.id);
    if (!r) return;
    commit(r.scene);
    setSelection(selectLayers(kids));
    if (r.dropped) setNotice(`Ungrouped. The group's own ${r.dropped === 1 ? 'clip was' : `${r.dropped} clips were`} removed with it (undo to bring ${r.dropped === 1 ? 'it' : 'them'} back).`);
  }, [commit]);

  /** Adds a preset at the playhead to every selected layer it suits (one undo step). */
  const applyPreset = (presetId: string) => {
    const ids = selectedIds(selection);
    let next = scene;
    let lastClip: string | null = null;
    for (const id of ids) {
      const parent = containerOf(next, id);
      const parentGroup = parent ? findLayer(next, parent) : null;
      const local = parent ? state.time - groupOffset(next, parent) : state.time;
      const limit = parentGroup && parentGroup.type === 'group' ? Math.max(groupDuration(parentGroup), scene.duration) : scene.duration;
      const r = addClip(next, id, presetId, Math.max(0, local), limit);
      if (r) {
        next = r.scene;
        lastClip = r.id;
      }
    }
    if (next === scene) return;
    commit(next);
    if (ids.length === 1 && lastClip) setSelection({ layerId: ids[0], clipId: lastClip });
  };

  const align = (mode: AlignMode) => {
    const count = selectedIds(selection).length;
    post({ type: 'align', mode, to: count > 1 ? alignTo : alignTo === 'selection' ? 'stage' : alignTo });
  };

  const downloadCopy = useCallback(() => {
    download(`${slug(latest.current.scene)}.scene.json`, 'application/json', formatScene(latest.current.scene));
    setNotice('A copy of the scene saved to your downloads.');
  }, []);
  const saveProject = useCallback(() => {
    if (!projectRef.current) { downloadCopy(); return; }
    flushProject().then(() => setNotice(`Saved in the project “${projectRef.current?.id ?? ''}”.`));
  }, [downloadCopy, flushProject]);

  const openProject = (file: File) => {
    file.text().then((text) => {
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        setNotice(`“${file.name}” isn't a scene file (not valid JSON).`);
        return;
      }
      const r = validateScene(data);
      if (!r.ok) {
        setNotice(`“${file.name}” can't be opened: ${r.errors[0]}`);
        return;
      }
      commit(r.scene);
      setSelection({ layerId: null, clipId: null });
      setNotice(`Opened “${file.name}”. Undo to go back to the previous scene.`);
    });
  };

  // ---- keyboard (from the Studio, or forwarded by the preview while it has focus) ----
  const handleKey = useCallback((k: KeyInfo): boolean => {
    const { scene: s, selection: sel, state: st, scope: sc } = latest.current;
    const key = k.key.length === 1 ? k.key.toLowerCase() : k.key;
    if (k.mod && key === 'g') { if (k.shift) ungroupSelection(); else groupSelection(); return true; }
    if (k.mod && key === 'z') { if (k.shift) history.redo(); else history.undo(); return true; }
    if (k.mod && key === 'y') { history.redo(); return true; }
    if (k.mod && key === 's') { saveProject(); return true; }
    if (k.mod && key === 'a') {
      setSelection(selectLayers(layersIn(s, sc).filter((l) => !l.locked).map((l) => l.id)));
      return true;
    }
    if (k.mod && key === 'd') {
      if (sel.layerId) {
        const r = duplicateLayer(s, sel.layerId, st.breakpoint);
        commit(r.scene);
        setSelection({ layerId: r.id, clipId: null });
      }
      return true;
    }
    if (k.mod) return false;
    if (k.code === 'Space') { if (st.playing) pause(); else play(); return true; }
    if (key === 'Home') { seek(0); return true; }
    if (key === 'F2' && latest.current.selection.layerId) { setRenaming(latest.current.selection.layerId); return true; }
    if (!k.mod && (key === 'm' || key === 'M') && !latest.current.scope) { commit(addMarker(latest.current.scene, latest.current.state.time)); setNotice('Marker added at the playhead.'); return true; }
    if (!k.mod && (key === 'f' || key === 'F')) { pause(); setFullscreen(true); return true; }
    if (key === ',' || key === '.') {
      const stepT = (k.shift ? 1 : 1 / 30) * (key === ',' ? -1 : 1);
      seek(Math.max(0, Math.min(s.duration, st.time + stepT)));
      return true;
    }
    if (key === 'Escape') {
      // First clear the selection; with nothing selected, step out of the group being edited.
      if (selectedIds(sel).length) setSelection({ layerId: null, clipId: null });
      else if (sc) leaveTo(containerOf(s, sc));
      return true;
    }
    if ((key === 'Delete' || key === 'Backspace') && sel.camera) {
      commit(removeCameraKey(s, sel.camera));
      setSelection({ layerId: null, clipId: null });
      return true;
    }
    if ((key === 'Delete' || key === 'Backspace') && sel.audio) {
      commit(removeAudio(s, sel.audio));
      setSelection({ layerId: null, clipId: null });
      return true;
    }
    if (key === 'Delete' || key === 'Backspace') {
      const ids = selectedIds(sel);
      if (sel.layerId && sel.clipId && ids.length === 1) { commit(removeClip(s, sel.layerId, sel.clipId)); setSelection({ layerId: sel.layerId, clipId: null }); }
      else if (ids.length) {
        let next = s;
        for (const id of ids) next = removeLayer(next, id);
        commit(next);
        setSelection({ layerId: null, clipId: null });
      }
      return true;
    }
    if (key.startsWith('Arrow')) {
      const dx = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0;
      const dy = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
      const clip = findClip(s, sel.layerId, sel.clipId);
      if (clip && sel.layerId && dx) {
        // Nudge the selected clip in time.
        const start = roundTime(Math.max(0, Math.min(s.duration - clip.duration, clip.start + dx * (k.shift ? 0.5 : 0.05))));
        commit(setClip(s, sel.layerId, clip.id, { start }));
      } else if (sel.layerId && !sel.clipId) {
        // Nudge the selected layers on the stage (one undo step).
        const step = k.shift ? 5 : 0.5;
        let next = s;
        for (const id of selectedIds(sel)) {
          const layer = findLayer(next, id);
          if (!layer || layer.locked) continue;
          next = moveBy(next, id, dx * step, dy * step, st.breakpoint);
        }
        commit(next);
      } else if (dx) {
        seek(Math.max(0, Math.min(s.duration, st.time + dx * (k.shift ? 1 : 0.1))));
      }
      return true;
    }
    return false;
  }, [commit, history, pause, play, saveProject, seek, groupSelection, ungroupSelection, leaveTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      // Keys typed into a field, or pressed inside an open window (Escape closes it), aren't shortcuts.
      if (el.closest('input, textarea, select, [contenteditable], dialog')) return;
      if (el.closest('button, a, [role="radio"]') && (e.code === 'Space' || e.key === 'Enter')) return;
      if (handleKey({ key: e.key, code: e.code, mod: e.ctrlKey || e.metaKey, shift: e.shiftKey, alt: e.altKey })) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKey]);

  // ---- messages from the preview ----
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow || !e.data || typeof e.data.type !== 'string') return;
      const m = e.data;
      const { scene: s, state: st } = latest.current;
      switch (m.type) {
        case 'upw:ready':
          setReady(true);
          setFrameError(null);
          if (firstReady.current) {
            firstReady.current = false;
            post({ type: 'play' });
          }
          break;
        case 'upw:state':
          setState({ time: m.time, duration: m.duration, playing: m.playing, breakpoint: m.breakpoint, stageHeight: m.stageHeight });
          break;
        case 'upw:layout-check':
          setLayoutCheck({ running: false, issues: Array.isArray(m.issues) ? m.issues : [], done: true });
          break;
        case 'upw:error':
          setFrameError(m.message ? String(m.message) : null);
          break;
        case 'upw:camera-blocked':
          setNotice('The camera is moving the view here. Turn Camera view off in the toolbar to select and move layers on the stage (or select them in the timeline).');
          break;
        case 'upw:select': {
          const ids: string[] = Array.isArray(m.ids) ? m.ids : m.id ? [m.id] : [];
          // Pressing the layer that is already selected keeps its selected clip and keyframe (so a drag
          // with a Keyframes clip selected can set a keyframe).
          const cur = latest.current.selection;
          if (ids.length === 1 && ids[0] === cur.layerId && !(cur.multi && cur.multi.length > 1)) break;
          setSelection(selectLayers(ids));
          break;
        }
        case 'upw:layout': {
          // One or more layers moved, resized or aligned: one undo step for all of them.
          const items: Array<{ id: string; box?: Record<string, number>; move?: { dx: number; dy: number }; mode?: string; size?: { w: number; h: number } }> =
            Array.isArray(m.items) ? m.items : m.id ? [{ id: m.id, box: m.box }] : [];
          // Animate by dragging: with a Keyframes clip selected and the playhead inside it, moving its
          // layer sets Move X/Y at the playhead instead of changing the layout.
          const one = items.length === 1 ? items[0] : null;
          const sel = latest.current.selection;
          const kfLayer = one && one.mode === 'move' && one.box && one.size && sel.layerId === one.id ? findLayer(s, one.id) : null;
          const kfClip = kfLayer && sel.clipId ? findClip(s, one!.id, sel.clipId) : null;
          if (kfLayer && kfClip && isKeyframes(kfClip)) {
            const parents = groupPath(s, kfLayer.id);
            const t = st.time - (parents.length ? groupOffset(s, parents[parents.length - 1].id) : 0) - kfClip.start;
            if (t >= -1e-6 && t <= kfClip.duration + 1e-6) {
              const b0 = boxAt(kfLayer, st.breakpoint);
              const dx = (one!.box!.x ?? b0.x) - b0.x;
              const dy = (one!.box!.y ?? b0.y) - b0.y;
              const frames = framesOf(kfClip);
              const fe = clipEase(kfClip);
              const vals: Record<string, number> = {};
              const r1 = (v: number) => Math.round(v * 10) / 10;
              if (Math.abs(dx) > 1e-3 && one!.size!.w > 0) vals.x = r1((valueAt(frames, 'x', t, fe) ?? 0) + (dx / one!.size!.w) * 100);
              if (Math.abs(dy) > 1e-3 && one!.size!.h > 0) vals.y = r1((valueAt(frames, 'y', t, fe) ?? 0) + (dy / one!.size!.h) * 100);
              const r = setKey(frames, Math.max(0, Math.min(kfClip.duration, t)), vals);
              commit(writeFrames(s, kfLayer.id, kfClip.id, r.frames));
              setSelection({ layerId: kfLayer.id, clipId: kfClip.id, key: r.index });
              break;
            }
          }
          let next = s;
          for (const it of items) {
            if (!findLayer(next, it.id)) continue;
            if (it.move) next = moveBy(next, it.id, it.move.dx, it.move.dy, st.breakpoint);
            else if (it.box) next = writeLayout(next, it.id, st.breakpoint, { box: it.box });
          }
          commit(next);
          break;
        }
        case 'upw:enter':
          enterGroup(String(m.id));
          break;
        case 'upw:text':
          if (findLayer(s, m.id)) commit(writeLayout(s, m.id, st.breakpoint, { text: String(m.text) }));
          break;
        case 'upw:key':
          handleKey(m as KeyInfo);
          break;
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [post, commit, handleKey, enterGroup]);

  // Once the preview is ready, make sure it has the current scene (edits may have happened while it loaded).
  useEffect(() => {
    if (ready && sentScene.current !== latest.current.scene) {
      sentScene.current = latest.current.scene;
      post({ type: 'scene', scene: latest.current.scene });
    }
  }, [ready, post]);

  const bp = scene.stage.breakpoints.find((b) => b.id === state.breakpoint);
  const selectedLayer = findLayer(scene, selection.layerId);

  // Opened from a share link: load the shared scene over the current one (Undo brings that back).
  useEffect(() => {
    const open = () => {
      if (!hasSharedScene()) return;
      // The scene is read from the address at once; clear it straight away so it loads only once.
      const reading = readSharedScene();
      clearShareHash();
      reading.then((r) => {
        if (!r.ok) { setNotice(`This share link can't be opened: ${r.error}.`); return; }
        commit(r.scene);
        setScope(null);
        setSelection({ layerId: null, clipId: null });
        post({ type: 'seek', time: 0 });
        setNotice(`Opened a shared scene${r.scene.title ? `, “${r.scene.title}”` : ''}. Undo brings back what you had.${r.strippedCode ? ` ${r.strippedCode} custom code clip${r.strippedCode === 1 ? ' was' : 's were'} removed, for safety.` : ''}`);
      });
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, [commit, post]);

  /** A clean slate. One undo step, so nothing is lost. */
  const startNew = useCallback(() => {
    commit(blankScene(latest.current.scene));
    setScope(null);
    setSelection({ layerId: null, clipId: null });
    post({ type: 'seek', time: 0 });
    setNotice('New scene. Undo (Ctrl+Z) brings back the one you had.');
  }, [commit, post]);

  // ---- Check scene + AI assist ----
  const issues = useMemo(() => lintScene(scene), [scene]);
  // Check the layout: measured on the stage at the moments each part has landed, on request (it moves the playhead).
  const [layoutCheck, setLayoutCheck] = useState<{ running: boolean; issues: LayoutIssue[]; done: boolean }>({ running: false, issues: [], done: false });
  useEffect(() => { setLayoutCheck((c) => (c.done || c.issues.length ? { running: false, issues: [], done: false } : c)); }, [scene]);
  const checkLayout = useCallback(() => { setLayoutCheck({ running: true, issues: [], done: false }); post({ type: 'check-layout' }); }, [post]);
  const showLayoutIssue = useCallback((i: LayoutIssue) => {
    post({ type: 'seek', time: i.t });
    if (i.layerId) {
      const path = groupPath(latest.current.scene, i.layerId);
      setScope(path.length ? path[path.length - 1].id : null);
      setSelection({ layerId: i.layerId, clipId: null });
    }
  }, [post]);
  const problems = issues.filter((i) => i.severity === 'warn').length;
  const recheckKit = useCallback(() => { setKit({ state: 'checking' }); kitStatus().then(setKit); }, []);
  useEffect(recheckKit, [recheckKit]);
  const openAssist = useCallback((open: boolean) => {
    setAssistOpen(open);
    if (open && kit.state !== 'ready' && kit.state !== 'checking') recheckKit();
  }, [kit.state, recheckKit]);

  const applyAi = useCallback((next: Scene, mode: 'create' | 'edit') => {
    commit(next);
    if (mode === 'create') {
      setScope(null);
      setSelection({ layerId: null, clipId: null });
    }
    post({ type: 'seek', time: 0 });
    post({ type: 'play' });
  }, [commit, post]);

  const restoreAi = useCallback((before: Scene, after: Scene) => {
    if (latest.current.scene !== after
      && !window.confirm('The scene has changed since this answer. Going back also undoes those later changes (Undo brings them back). Go back?')) return;
    commit(before);
    setNotice('Back to the scene from before that answer. Undo to return.');
  }, [commit]);

  const fixIssue = useCallback((issue: LintIssue) => {
    if (!issue.fix) return;
    commit(issue.fix.apply(latest.current.scene));
    setNotice(`Fixed: ${issue.fix.label.toLowerCase()}.`);
  }, [commit]);

  const fixAll = useCallback(() => {
    let next = latest.current.scene;
    let n = 0;
    for (const i of lintScene(next)) if (i.fix) { next = i.fix.apply(next); n++; }
    commit(next);
    setNotice(`Applied ${n} fixes. Undo to go back.`);
  }, [commit]);

  const showIssue = useCallback((issue: LintIssue) => {
    if (!issue.layerId) return;
    const path = groupPath(latest.current.scene, issue.layerId);
    setScope(path.length ? path[path.length - 1].id : null);
    setSelection({ layerId: issue.layerId, clipId: issue.clipId ?? null });
  }, []);

  const askAiToFix = useCallback(() => {
    const list = [...lintScene(latest.current.scene).map((i) => `- ${i.message}`), ...layoutCheck.issues.map((i) => `- At ${i.t} s: ${i.message}`)].join('\n');
    setQueued(`Fix these problems Check scene found, changing as little as possible and keeping everything else as it is:\n${list}`);
    openAssist(true);
  }, [openAssist, layoutCheck.issues]);

  // ---- the menu bar ----
  const [libraryAsk, setLibraryAsk] = useState<{ kind: 'presets' | 'pieces' | 'sounds' | 'styles'; n: number } | undefined>();
  const [aiSettingsAsk, setAiSettingsAsk] = useState(0);
  /** Shows the scene's settings (nothing selected, Inspector) and scrolls to one of its sections. */
  const showSceneSection = (title?: string) => {
    setSelection({ layerId: null, clipId: null });
    setScope(null);
    setTab('inspect');
    if (!title) return;
    setTimeout(() => {
      const h = [...document.querySelectorAll<HTMLElement>('.insp-section h3')].find((x) => x.textContent === title);
      h?.closest('.insp-section')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 80);
  };
  const showLayerSection = (title: string) => {
    setTab('inspect');
    setTimeout(() => {
      const h = [...document.querySelectorAll<HTMLElement>('.insp-section h3')].find((x) => x.textContent === title);
      h?.closest('.insp-section')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 80);
  };
  const key = (k: string, mod = false, shift = false) => handleKey({ key: k, code: k.length === 1 ? `Key${k.toUpperCase()}` : k, mod, shift, alt: false });
  const selLayer = selection.layerId ? findLayer(scene, selection.layerId) : undefined;
  const selAudio = selection.audio ? (scene.audio ?? []).find((a) => a.id === selection.audio) : undefined;
  const hasSel = selectedIds(selection).length > 0;
  const mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl+';
  const DOCS = 'https://docs.unysonplus.com/kinetic-scenes';
  const link = (u: string) => () => window.open(u, '_blank', 'noopener');
  // A free-stock pick, already in the project's media/: footage fills the frame, a photo sits in it, a sound starts at the playhead.
  const addStock = async (r: StockResult, path: string) => {
    if (!project) return;
    const src = await stockInStudio(project.id, path);
    const s = latest.current.scene;
    const name = r.title.slice(0, 40);
    if (r.kind === 'audio') {
      const start = Math.max(0, Math.min(s.duration - 0.1, Math.round(latest.current.state.time * 100) / 100));
      const a = addAudio(s, { name, src, start, role: 'sfx' });
      commit(a.scene);
      setSelection({ layerId: null, clipId: null, audio: a.id });
    } else if (r.kind === 'video') {
      const len = r.seconds ? Math.round(r.seconds * 100) / 100 : 0;
      const a = addLayer(s, 'video', { name, src, ...(len && len < s.duration ? { end: len } : {}) } as Partial<Layer>, latest.current.scope);
      commit(a.scene);
      setSelection({ layerId: a.id, clipId: null });
    } else {
      addLayerOfType('image', { name, src, alt: '', box: { x: 50, y: 50, w: 30, ...(r.width && r.height ? { ratio: Math.round((r.width / r.height) * 100) / 100 } : {}) } } as Partial<Layer>);
    }
    setNotice(`Added ${name} from ${r.source}${r.credit ? `. Credit needed: ${r.credit} (in the project notes)` : ''}.`);
  };
  const copySceneFile = () => {
    const text = JSON.stringify(latest.current.scene, null, 2);
    navigator.clipboard.writeText(text)
      .then(() => setNotice(`Copied the scene file (${Math.round(text.length / 1024)} KB).${text.length > 65536 ? ' It is long because of pictures or sound kept in it: attach the saved file instead (File › Save).' : ''}`))
      .catch(() => setNotice('The browser did not allow copying. Use File › Save and attach the file instead.'));
  };
  const menus: Menu[] = [
    { label: 'File', items: [
      { label: 'Projects…', onSelect: () => setProjectsOpen(true), hint: 'Project folders on this computer (AI Dev Kit), shared with your AI agent' },
      { label: 'Project notes…', onSelect: () => setNotesOpen(true), disabled: !project, hint: project ? 'The plan, what was decided and what is left, shared with your AI agent' : 'Open a project first (File › Projects)' },
      'sep',
      { label: 'New', onSelect: startNew, hint: 'An empty scene (same screen sizes and fonts). Undo brings back the current one.' },
      { label: 'Open…', onSelect: () => openRef.current?.click() },
      { label: 'New from a screencast…', onSelect: () => screencastRef.current?.click(), hint: 'Pick a recording\'s video.mp4 and actions.json (AI Dev Kit: studio-cli record): a scene that zooms to each step' },
      { label: 'Save', shortcut: `${mod}S`, onSelect: saveProject, hint: project ? 'Into the project folder (it also saves as you work)' : 'Downloads the scene file (open a project to keep it in a folder)' },
      { label: 'Copy scene file', onSelect: copySceneFile, hint: 'The scene as text, for pasting into a bug report or a message (pictures and sound kept in the scene make it long)' },
      { label: 'Download a copy', onSelect: downloadCopy },
      'sep',
      { label: 'Load the demo', onSelect: () => { commit(DEMO); setSelection({ layerId: null, clipId: null }); setNotice('Loaded the demo. Undo brings back your scene.'); } },
      'sep',
      { label: 'Export…', onSelect: () => setExporting(true) },
    ] },
    { label: 'Edit', items: [
      { label: 'Undo', shortcut: `${mod}Z`, onSelect: history.undo, disabled: !history.canUndo },
      { label: 'Redo', shortcut: `${mod}Shift+Z`, onSelect: history.redo, disabled: !history.canRedo },
      'sep',
      { label: 'Duplicate', shortcut: `${mod}D`, onSelect: () => key('d', true), disabled: !selection.layerId },
      { label: 'Delete', shortcut: 'Del', onSelect: () => key('Delete'), disabled: !hasSel && !selection.audio && !selection.camera },
      { label: 'Rename', shortcut: 'F2', onSelect: () => key('F2'), disabled: !selection.layerId },
      'sep',
      { label: 'Select all', shortcut: `${mod}A`, onSelect: () => key('a', true) },
      { label: 'Group', shortcut: `${mod}G`, onSelect: () => key('g', true), disabled: selectedIds(selection).length < 2 },
      { label: 'Ungroup', shortcut: `${mod}Shift+G`, onSelect: () => key('g', true, true), disabled: selLayer?.type !== 'group' },
    ] },
    { label: 'View', items: [
      ...(video ? [] : DEVICES.map((d) => ({ label: d.label, checked: deviceId === d.id, onSelect: () => setDeviceId(d.id) }))),
      ...(video ? [] : ['sep' as const, ...HEIGHT_MODES.map((h) => ({ label: `Height: ${h.label}`, hint: h.hint, checked: scene.stage.heightMode === h.value, onSelect: () => commit({ ...scene, stage: { ...scene.stage, heightMode: h.value } }) }))]),
      'sep',
      { label: video && video.platform && video.platform !== 'none' ? 'App guides' : 'Safe area', checked: safe, onSelect: () => setSafe(!safe) },
      ...(scene.camera?.keys.length ? [{ label: 'Camera view', checked: cameraView, onSelect: () => setCameraView(!cameraView) }] : []),
      'sep',
      { label: 'Full screen', shortcut: 'F', onSelect: () => { pause(); setFullscreen(true); } },
    ] },
    { label: 'Insert', items: [
      { label: 'Text', onSelect: () => onAddLayer('text') },
      { label: 'Shape', onSelect: () => onAddLayer('shape') },
      { label: 'Image', onSelect: () => onAddLayer('image') },
      { label: 'Footage', onSelect: () => onAddLayer('video') },
      { label: 'Free stock…', onSelect: () => setStockOpen(true), hint: 'Footage, photos and sounds free for commercial use (Pexels, Pixabay, NASA, Openverse); choose which sources you and your AI agent use' },
      { label: '3D object', onSelect: () => onAddLayer('model') },
      'sep',
      { label: 'Line', onSelect: () => onAddLayer('path') },
      { label: 'Code', onSelect: () => onAddLayer('code') },
      { label: 'Diagram', onSelect: () => onAddLayer('diagram') },
      { label: 'Cursor', onSelect: () => onAddLayer('cursor') },
      { label: 'List', onSelect: () => onAddLayer('repeat') },
      { label: 'Captions', onSelect: () => onAddLayer('captions'), disabled: !!scope },
      { label: 'Flow', onSelect: () => onAddLayer('flow') },
      'sep',
      { label: 'Audio…', onSelect: () => audioRef.current?.click() },
      { label: 'Music…', onSelect: () => setMusicOpen(true), hint: 'Make an instrumental with the ACE-Step add-on' },
      { label: 'Marker', shortcut: 'M', onSelect: () => key('m'), disabled: !!scope },
      { label: 'A piece…', onSelect: () => setLibraryAsk({ kind: 'pieces', n: Date.now() }), hint: 'Ready-made pieces: comment box, chat, checklist, loadout…' },
    ] },
    { label: 'Scene', items: [
      { label: 'Scene settings', onSelect: () => showSceneSection(), hint: 'Length, playback, stage, layouts and fonts' },
      { label: 'Styles and brand kit', onSelect: () => setLibraryAsk({ kind: 'styles', n: Date.now() }) },
      'sep',
      { label: 'Check scene', onSelect: () => setTab('check') },
      { label: 'Check the layout', onSelect: () => { setTab('check'); checkLayout(); } },
    ] },
    { label: 'AI', items: [
      { label: 'AI assist', onSelect: () => openAssist(true) },
      { label: 'AI settings (style, voice, look and fix)', onSelect: () => { openAssist(true); setAiSettingsAsk(Date.now()); } },
      'sep',
      { label: 'Voice-over from a script', onSelect: () => showSceneSection('Voice-over from a script') },
      { label: 'Make music…', onSelect: () => setMusicOpen(true) },
    ] },
    { label: 'Tools', items: [
      { label: 'Add-ons…', onSelect: () => setAddonsOpen(true), hint: 'Voicebox, ACE-Step music and other tools the AI Dev Kit can use on this computer' },
      { label: 'Make music…', onSelect: () => setMusicOpen(true) },
      { label: 'Videos from a spreadsheet…', onSelect: () => setBatchOpen(true), hint: 'One design, a video per row: fill the {{placeholders}} in the scene from a CSV, preview each row, render them all' },
      { label: 'Make a reel from a video…', onSelect: () => setHighlightsOpen(true), hint: 'The AI Dev Kit finds the best moments of a long video and cuts them together to the length you ask' },
      'sep',
      { label: 'Separate voice and music', disabled: !(selLayer?.type === 'video' || (selAudio && !selAudio.src.startsWith('sfx:'))),
        hint: 'Select footage or an audio clip first', onSelect: () => showLayerSection(selLayer?.type === 'video' ? 'Footage tools' : 'Voice and music') },
      { label: 'Transcribe a voice-over', disabled: !(selAudio && !selAudio.src.startsWith('sfx:')), hint: 'Select an audio clip first', onSelect: () => showLayerSection('Words') },
    ] },
    { label: 'Help', items: [
      { label: 'The manual', onSelect: link(DOCS) },
      { label: 'Connect your AI agent', onSelect: link(AGENTS_GUIDE) },
      { label: 'Keyboard shortcuts', onSelect: () => setKeysOpen(true) },
      { label: 'What is new', onSelect: link(`${DOCS}/roadmap`) },
    ] },
  ];

  return (
    <div className="app">
      <div className="head">
      <header className="topbar">
        <div className="brand">
          {/* New tabs: the Studio is itself at kinetic-scenes.unysonplus.com, so reloading it here would drop the undo history. */}
          <a className="brand-link" href="https://www.unysonplus.com/" target="_blank" rel="noopener" title="Unyson+ (opens in a new tab)" aria-label="Unyson+ (opens in a new tab)"><Logo /></a>
          <div>
            <h1>
              <a className="brand-link" href="https://kinetic-scenes.unysonplus.com/" target="_blank" rel="noopener" title="Kinetic Scenes (opens in a new tab)">Kinetic Scenes</a>
              <button type="button" className="stage-tag" {...{ popovertarget: 'stage-info' }} aria-describedby="stage-info">Beta</button>
            </h1>
            <p className="brand-sub">Unyson+ · {__STUDIO_VERSION__}{project && (
              <> · <button type="button" className="project-tag" onClick={() => setProjectsOpen(true)} title="Projects">
                {project.id}<span className={`project-state is-${projectSave}`}>{projectSave === 'saving' ? ' · saving' : projectSave === 'error' ? ' · not saved' : ' · saved'}</span>
              </button></>
            )}</p>
            <div id="stage-info" className="stage-info" {...{ popover: 'auto' }} role="note">
              <strong>Beta: feature-complete, still being polished</strong>
              <p>Everything on the roadmap is built. You may still meet rough edges, and the scene file format can still change between versions.</p>
              <p>Use <em>Save</em> to keep a project file of anything you want to hold on to. Pages you export or embed keep working whatever changes later.</p>
            </div>
          </div>
        </div>
        <MenuBar menus={menus} />
        <div className="top-actions">
          <div className="btn-group" role="group" aria-label="History">
            <button type="button" className="icon-btn" onClick={history.undo} disabled={!history.canUndo} aria-label="Undo" title="Undo (Ctrl+Z)"><UndoIcon /></button>
            <button type="button" className="icon-btn" onClick={history.redo} disabled={!history.canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><RedoIcon /></button>
          </div>
          <button type="button" className="btn primary" onClick={() => setExporting(true)}><DownloadIcon /> Export</button>
          <input ref={openRef} type="file" accept=".json,application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) openProject(f); e.target.value = ''; }} />
          <input ref={screencastRef} type="file" accept="video/*,.json,application/json" multiple hidden onChange={async (e) => {
            // A recording from the AI Dev Kit: its video and its actions.json, picked together.
            const files = [...(e.target.files ?? [])];
            e.target.value = '';
            const video = files.find((f) => f.type.startsWith('video/'));
            const json = files.find((f) => /\.json$/i.test(f.name));
            if (!video || !json) { setNotice('Pick both files of the recording: video.mp4 and actions.json.'); return; }
            let rec: unknown;
            try { rec = JSON.parse(await json.text()); } catch { setNotice(`${json.name} could not be read.`); return; }
            if (!isRecording(rec)) { setNotice(`${json.name} is not a recording's actions file.`); return; }
            const src = await putFootage(video);
            const vertical = !(latest.current.scene.video?.formats?.[0] === '16x9');
            commit(screencastScene(rec, src, { vertical, title: video.name.replace(/\.[^.]+$/, '') }));
            setSelection({ layerId: null, clipId: null });
            setNotice(`A ${vertical ? '9:16' : '16:9'} scene from the screencast: the camera zooms to each step (adjust its keys on the Camera row). Undo brings back your scene.`);
          }} />
          <input ref={audioRef} type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a" hidden onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            if (file.size > 15 * 1024 * 1024) { setNotice(`${file.name} is ${(file.size / 1048576).toFixed(1)} MB. Audio files up to 15 MB can be added; use an address for bigger ones.`); return; }
            const reader = new FileReader();
            reader.onload = async () => {
              const src = String(reader.result);
              const len = await audioEngine.durationOf(src);
              if (len === null) { setNotice(`${file.name} couldn't be read as audio.`); return; }
              const s = latest.current.scene;
              const start = Math.max(0, Math.min(s.duration - 0.1, Math.round(latest.current.state.time * 100) / 100));
              const r = addAudio(s, { name: file.name.replace(/\.[^.]+$/, ''), src, start, role: len > 8 ? 'voice' : 'sfx' });
              // A voice-over longer than the scene makes the scene as long as it.
              const end = start + len;
              commit(end > s.duration ? { ...r.scene, duration: Math.ceil(end * 10) / 10 } : r.scene);
              setSelection({ layerId: null, clipId: null, audio: r.id });
              setNotice(`Added ${file.name} (${len.toFixed(1)} s)${end > s.duration ? '; the scene now runs to its end' : ''}.`);
            };
            reader.readAsDataURL(file);
          }} />
          <input ref={footageRef} type="file" accept="video/*" hidden onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            const [src, meta] = await Promise.all([putFootage(file), probeVideo(file)]);
            // Footage is what the graphics sit on: it starts with the scene and is cut where the file ends. Footage
            // longer than the scene makes the scene as long as it (as a voice-over does), up to ten minutes.
            const s = latest.current.scene;
            const len = meta.duration ? Math.round(meta.duration * 100) / 100 : 0;
            const r = addLayer(s, 'video', {
              name: file.name.replace(/\.[^.]+$/, ''), src,
              ...(len && len < s.duration ? { end: len } : {}),
            } as Partial<Layer>, latest.current.scope);
            const grow = !latest.current.scope && len > s.duration;
            commit(grow ? { ...r.scene, duration: Math.min(600, Math.ceil(len * 10) / 10) } : r.scene);
            setSelection({ layerId: r.id, clipId: null });
            setNotice(`Added ${file.name} (${meta.duration.toFixed(1)} s)${grow ? '; the scene now runs to its end' : ''}. It stays in this browser; exports and videos carry it.`);
          }} />
          <input ref={imageRef} type="file" accept="image/*" hidden onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const src = String(reader.result);
              const img = new Image();
              img.onload = () => addLayerOfType('image', {
                name: file.name.replace(/\.[^.]+$/, ''), src, alt: '',
                box: { x: 50, y: 50, w: 30, ratio: Math.round((img.naturalWidth / img.naturalHeight) * 100) / 100 },
              } as Partial<Layer>);
              img.src = src;
            };
            reader.readAsDataURL(file);
          }} />
        </div>
      </header>
      {conn.state.status !== 'none' && (
        <div className={`connect-bar is-${conn.state.status}`} role="status">
          {conn.state.status === 'waiting' && <span>Connecting to your Unyson+ page…</span>}
          {conn.state.status === 'connected' && (
            <>
              <span>
                Editing a scene for a Studio Scene element on <strong>{conn.state.site}</strong>.
                {conn.state.saved ? ' Saved to the page. Update the page in WordPress to keep it.' : ' Save to send your changes back.'}
              </span>
              <button type="button" className="btn primary small" onClick={() => {
                if (!conn.save(scene)) setNotice('The page editor is no longer open. Use Export or Save instead.');
              }}>{conn.state.saved ? 'Saved' : 'Save to page'}</button>
            </>
          )}
          {conn.state.status === 'closed' && (
            <span>The page editor on <strong>{conn.state.site}</strong> was closed. Use Export (embed code) or Save to keep this scene.</span>
          )}
        </div>
      )}
      </div>

      <main className="workspace">
        <Library layerType={selectedLayer?.type ?? null} count={selectedIds(selection).length} onApply={applyPreset} show={libraryAsk}
          pieces={<PiecesLibrary onInsert={(piece) => {
            const r = insertPiece(latest.current.scene, piece, Math.round(latest.current.state.time * 100) / 100, latest.current.scope);
            commit(r.scene);
            setSelection({ layerId: r.id, clipId: null });
            setNotice(`Added ${piece.name}. Double-click it to change what is inside.`);
          }} />}
          styles={
            <StyleLibrary
              styles={allStyles}
              aiStyle={allStyles.some((s) => s.id === aiStyle) ? aiStyle : null}
              hasScene={scene.layers.length > 0}
              onApply={(style, parts) => {
                commit(applyStyle(latest.current.scene, style, parts));
                const what = [parts.look && 'colours and fonts', parts.motion && 'motion', parts.sound && 'sounds'].filter(Boolean).join(', ');
                setNotice(`Applied ${style.name} (${what}). Undo (Ctrl+Z) brings back the previous look.`);
              }}
              onNew={(style) => {
                commit(starterScene(style, latest.current.scene));
                setScope(null);
                setSelection({ layerId: null, clipId: null });
                post({ type: 'seek', time: 0 });
                setNotice(`New scene in the ${style.name} style. Edit the words, or ask AI assist to build on it. Undo brings back the one you had.`);
              }}
              onUseForAi={(id) => {
                setAiStyle(id);
                const s = allStyles.find((x) => x.id === id);
                setNotice(s ? `AI assist now follows the ${s.name} style.` : 'AI assist no longer follows a style.');
              }}
              onSave={(name) => {
                const style = styleFromScene(latest.current.scene, name);
                const next = [...customStyles, style];
                setCustomStyles(next);
                setNotice(saveCustomStyles(next) ? `Saved the style “${name}”.` : `Saved “${name}” for now; this browser won't keep it after closing.`);
              }}
              onDelete={(id) => {
                const next = customStyles.filter((s) => s.id !== id);
                setCustomStyles(next);
                saveCustomStyles(next);
                if (aiStyle === id) setAiStyle(null);
              }}
              onUpsert={(style) => {
                const exists = customStyles.some((s) => s.id === style.id);
                const next = exists ? customStyles.map((s) => (s.id === style.id ? style : s)) : [...customStyles, style];
                setCustomStyles(next);
                setNotice(saveCustomStyles(next) ? `${exists ? 'Updated' : 'Added'} the style “${style.name}”.` : `Added “${style.name}” for now; this browser won't keep it after closing.`);
              }}
              onAddLogo={(logo) => {
                const s = latest.current.scene;
                const layer = logoLayer(s, logo);
                commit({ ...s, layers: [...s.layers, layer] });
                setSelection({ layerId: layer.id, clipId: null });
                setNotice('Added your logo at the top. Drag it where it belongs.');
              }}
            />
          }
          sounds={(() => {
            const selClip = findClip(scene, selection.layerId, selection.clipId);
            const counts = soundCounts(scene);
            return (
              <SoundLibrary
                clipSelected={!!selClip}
                current={selClip?.sound?.name}
                suggestible={counts.suggestible}
                withSound={counts.withSound}
                onPreview={(src) => { audioEngine.preview(src); }}
                onAdd={(id) => {
                  const s = latest.current.scene;
                  const sel = latest.current.selection;
                  const c = findClip(s, sel.layerId, sel.clipId);
                  if (c && sel.layerId) {
                    commit(setClip(s, sel.layerId, c.id, { sound: cleanSound({ ...(c.sound ?? {}), name: id }) }));
                    setNotice(`${sfxMeta(id)?.label} now plays with this clip.`);
                    return;
                  }
                  const start = Math.max(0, Math.min(s.duration - 0.05, Math.round(latest.current.state.time * 100) / 100));
                  const r = addAudio(s, { name: sfxMeta(id)?.label ?? id, src: sfxSrc(id), start, role: 'sfx' });
                  commit(r.scene);
                  setSelection({ layerId: null, clipId: null, audio: r.id });
                }}
                onAddFile={(src, name, seconds) => {
                  const s = latest.current.scene;
                  const start = Math.max(0, Math.min(s.duration - 0.05, Math.round(latest.current.state.time * 100) / 100));
                  const r = addAudio(s, { name, src, start, role: 'sfx' });
                  const end = start + seconds;
                  commit(end > r.scene.duration ? { ...r.scene, duration: Math.ceil(end * 10) / 10 } : r.scene);
                  setSelection({ layerId: null, clipId: null, audio: r.id });
                  setNotice(`Added “${name}” at the playhead.`);
                }}
                onSuggest={() => {
                  const s = latest.current.scene;
                  const n = soundCounts(s).suggestible;
                  commit(addSuggestedSounds(s));
                  setNotice(`Added sounds to ${n} clip${n === 1 ? '' : 's'}. Each one moves with its clip; change or remove it in the clip's Sound section.`);
                }}
                onClearAll={() => commit(clearClipSounds(latest.current.scene))}
              />
            );
          })()}
        />

        <section className="stagecol" aria-label="Stage">
          <div className="toolbar">
            {video && format ? (
              <Segmented
                legend="Format"
                value={format}
                onChange={(f) => setFormatId(f as VideoFormat)}
                options={sortFormats(video.formats).map((f) => ({ value: f, label: VIDEO_FORMATS[f].label.split(' ')[1], hint: `${VIDEO_FORMATS[f].label}, ${VIDEO_FORMATS[f].width} × ${VIDEO_FORMATS[f].height}` }))}
              />
            ) : (
              <>
                <Segmented
                  legend="Screen size"
                  value={deviceId}
                  onChange={setDeviceId}
                  options={DEVICES.map((d) => ({ value: d.id, label: d.label, icon: DEVICE_ICONS[d.id], iconOnly: true, hint: `${d.label}, ${d.width} × ${d.height} window` }))}
                />
                <span className="tb-sep" aria-hidden="true" />
                <Segmented
                  legend="Height mode"
                  value={scene.stage.heightMode}
                  onChange={(mode) => commit({ ...scene, stage: { ...scene.stage, heightMode: mode } })}
                  options={HEIGHT_MODES}
                />
              </>
            )}
            <label className="toggle" title={video && video.platform && video.platform !== 'none' ? 'The safe area, and where the app covers the picture with its buttons and captions' : undefined}>
              <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} />
              <span className="toggle-track" aria-hidden="true" />
              {video && video.platform && video.platform !== 'none' ? 'App guides' : 'Safe area'}
            </label>
            {!!scene.camera?.keys.length && (
              <label className="toggle" title="Show the camera's moves on the stage. Turn it off to select and move layers in the flat layout.">
                <input type="checkbox" checked={cameraView} onChange={(e) => setCameraView(e.target.checked)} />
                <span className="toggle-track" aria-hidden="true" />
                Camera view
              </label>
            )}
            <button type="button" className="icon-btn fs-open" onClick={() => setFullscreen(true)} aria-label="Full screen" title="Full screen: play the scene at your screen's real size (F)">
              <FullscreenIcon />
            </button>
            <p className="bp-readout" aria-live="polite">
              {bp ? (
                <>
                  <strong>{bp.label ?? bp.id}</strong> layout · {bp.aspect[0]}:{bp.aspect[1]} · stage {state.stageHeight}px tall
                </>
              ) : 'Loading…'}
            </p>
          </div>

          <div className="preview-wrap">
            {rowView !== null && sheet.sheet && (
              <div className="row-bar" role="status">
                <span>Row {rowView + 1} of {sheet.sheet.rows.length}: <strong>{rowLabel(sheet.sheet, rowView)}</strong> (a preview; your scene is unchanged)</span>
                <button type="button" className="btn small ghost" disabled={rowView === 0} onClick={() => setRowView(rowView - 1)} aria-label="Previous row">‹</button>
                <button type="button" className="btn small ghost" disabled={rowView >= sheet.sheet.rows.length - 1} onClick={() => setRowView(rowView + 1)} aria-label="Next row">›</button>
                <button type="button" className="btn small" onClick={() => setRowView(null)}>Back to the design</button>
              </div>
            )}
            <Preview ref={iframeRef} device={device} srcDoc={srcDoc} label="Scene preview" onScale={setScale} zones={zones} checker={seeThrough} />
            <AiAssist
              project={project?.id ?? null}
              onMakeMusic={() => setMusicOpen(true)}
              open={assistOpen}
              onOpenChange={openAssist}
              status={kit}
              onRecheck={recheckKit}
              scene={scene}
              selection={selectedIds(selection)}
              problems={problems}
              messages={chat}
              onMessages={setChat}
              queued={queued}
              onQueuedTaken={() => setQueued(null)}
              onApply={applyAi}
              onRestore={restoreAi}
              onShowCheck={() => setTab('check')}
              styles={allStyles}
              styleId={allStyles.some((s) => s.id === aiStyle) ? aiStyle : null}
              onStyleChange={setAiStyle}
              settingsRequest={aiSettingsAsk}
            />
          </div>

          {frameError && <p className="frame-error" role="alert">{frameError}</p>}

          <Transport
            time={state.time}
            duration={state.duration}
            playing={state.playing}
            disabled={!ready}
            onPlay={play}
            onPause={pause}
            onSeek={seek}
            hasAudio={soundTrack(scene).length > 0}
            soundOn={soundOn}
            soundWaiting={soundWaiting}
            onSound={setSoundOn}
          />

          <Timeline
            scene={scene}
            time={state.time}
            selection={selection}
            onSelect={setSelection}
            onSeek={seek}
            onCommit={commit}
            onBegin={history.begin}
            onLive={history.live}
            onEnd={history.end}
            onAddLayer={onAddLayer}
            scope={scope}
            onEnter={enterGroup}
            onLeaveTo={leaveTo}
            renaming={renaming}
            onRename={setRenaming}
            audioInfo={audioInfo}
            peaksPerSecond={peaksPerSecond}
            onAddAudio={() => audioRef.current?.click()}
            onCommand={(c) => {
              // After a right-click the selection may only just have changed: let it land first.
              setTimeout(() => handleKey(c === 'duplicate' ? { key: 'd', code: 'KeyD', mod: true, shift: false, alt: false }
                : c === 'delete' ? { key: 'Delete', code: 'Delete', mod: false, shift: false, alt: false }
                  : { key: 'g', code: 'KeyG', mod: true, shift: c === 'ungroup', alt: false }), 0);
            }}
          />
        </section>

        <aside className="panel" aria-label="Properties">
          <div className="tabs" role="tablist" aria-label="Panel">
            <button type="button" role="tab" aria-selected={tab === 'inspect'} className={tab === 'inspect' ? 'on' : undefined} onClick={() => setTab('inspect')}>Inspector</button>
            <button type="button" role="tab" aria-selected={tab === 'check'} className={tab === 'check' ? 'on' : undefined} onClick={() => setTab('check')}>
              Check{issues.length > 0 && <span className={`tab-count${problems ? ' warn' : ''}`}>{issues.length}</span>}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'json'} className={tab === 'json' ? 'on' : undefined} onClick={() => setTab('json')}>Scene file</button>
          </div>
          <div className="panel-body" role="tabpanel">
            {tab === 'check' && (
              <CheckPanel issues={issues} aiReady={kit.state === 'ready'} onFix={fixIssue} onFixAll={fixAll} onShow={showIssue} onAskAi={askAiToFix}
                layout={layoutCheck} onCheckLayout={checkLayout} onShowLayout={showLayoutIssue} />
            )}
            {tab === 'inspect' && selection.camera && scene.camera?.keys.some((k) => k.id === selection.camera) ? (
              <CameraInspector scene={scene} keyId={selection.camera} time={state.time} cameraView={cameraView} onCommit={commit} onSeek={seek}
                onSelectKey={(id) => setSelection(id ? { layerId: null, clipId: null, camera: id } : { layerId: null, clipId: null })} />
            ) : tab === 'inspect' && selection.audio && scene.audio?.some((a) => a.id === selection.audio) ? (
              <AudioInspector scene={scene} clip={scene.audio!.find((a) => a.id === selection.audio)!} info={audioInfo[scene.audio!.find((a) => a.id === selection.audio)!.src]}
                onCommit={commit} onDeselect={() => setSelection({ layerId: null, clipId: null })} onSeek={seek}
                decode={(src) => audioEngine.buffer(src)}
                onMakeScene={(clipId) => {
                  const s = latest.current.scene;
                  const clip = s.audio?.find((a) => a.id === clipId);
                  if (!clip?.words?.length) return;
                  const beats = voiceBeats(clip);
                  setQueued({ text: voiceRequest(clip), brief: voiceBrief(clip, beats), context: `VOICE-OVER BEATS (scene seconds)\n${beatsText(beats)}`, base: voiceBase(s, clip, beats), voiceClip: clip.id });
                  openAssist(true);
                }} />
            ) : tab === 'check' ? null : tab === 'inspect'
              ? <Inspector onPreviewSound={(src, v) => { audioEngine.preview(src, v); }} time={state.time} onSeek={seek} scene={scene} selection={selection} bp={state.breakpoint} onCommit={commit} onSelect={setSelection} alignTo={alignTo} onAlignTo={setAlignTo} onAlign={align} onEnter={enterGroup} onGroup={groupSelection} onUngroup={ungroupSelection} />
              : <ScenePanel scene={scene} onCommit={commit} />}
          </div>
        </aside>
      </main>

      <ExportDialog open={exporting} scene={scene} fileName={slug(scene)} project={project?.id ?? null} onClose={() => setExporting(false)} onDone={setNotice} />
      <AddonsDialog open={addonsOpen} onClose={() => setAddonsOpen(false)} />
      <ShortcutsDialog open={keysOpen} onClose={() => setKeysOpen(false)} />
      <HighlightsDialog open={highlightsOpen} onClose={() => setHighlightsOpen(false)}
        onScene={(s, note) => { commit(s); setSelection({ layerId: null, clipId: null }); setHighlightsOpen(false); setNotice(note); }} />
      <BatchDialog open={batchOpen} onClose={() => setBatchOpen(false)} scene={scene} sheet={sheet.sheet} files={sheet.files}
        onSheet={(s, files) => { setSheet({ sheet: s, files }); if (!s) setRowView(null); }}
        onPreview={(i) => { setRowView(i); setBatchOpen(false); }} />
      <StockDialog open={stockOpen} onClose={() => setStockOpen(false)} project={project?.id ?? null} onAdd={addStock} />
      <NotesDialog open={notesOpen} onClose={() => setNotesOpen(false)} project={project?.id ?? null} outsideChange={notesChanged} />
      <ProjectsDialog open={projectsOpen} onClose={() => setProjectsOpen(false)} current={project?.id ?? null} title={scene.title || ''}
        onOpen={(id) => openFolderProject(id)} onCreate={newFolderProject} onCloseProject={closeFolderProject} />
      <MusicDialog open={musicOpen} onClose={() => setMusicOpen(false)} scene={scene} onCommit={commit}
        decode={(src) => audioEngine.buffer(src)} onAddons={() => setAddonsOpen(true)} />
      {notice && <div className="toast" role="status">{notice}</div>}
      {fullscreen && <FullscreenPlayer scene={scene} startAt={0} onClose={() => setFullscreen(false)} />}
    </div>
  );
}
