import type { Scene } from '@unysonplus/scene-player/types';
import { PRESET_CATALOG } from '@unysonplus/scene-player/catalog';
import { validateScene } from '@unysonplus/scene-player/validate';
import { MOTION_RULES } from './motionRules';
import { toVideo } from './videoMode';

/**
 * The Studio's link to the AI Dev Kit running on the user's own computer. The kit's local service
 * (port 8787) turns a request into a scene file with whatever AI the kit is set up with. Nothing goes
 * through our servers: the request travels from this page straight to the user's machine.
 */

// The secure address comes last: Safari doesn't let this https site reach a plain http address, even on this
// computer, so the kit also answers on https (with a certificate it made for this computer, trusted once in Safari).
export const SECURE_KIT = 'https://127.0.0.1:8789';
const BASES = ['http://localhost:8787', 'http://127.0.0.1:8787', SECURE_KIT];

/** Safari (and other WebKit browsers): the one that needs the secure address. */
export const isSafari = () => typeof navigator !== 'undefined' && /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR|Firefox|FxiOS|CriOS/.test(navigator.userAgent);
let base: string | null = null;
/** What the running kit can do beyond the basics (an older kit reports none). */
let features = new Set<string>();
/** Whether the running kit has a feature (found by kitStatus). */
export const kitHas = (f: string) => features.has(f);
/** The last AI agent that used the kit's Kinetic Scenes tools (found by kitStatus), if any. */
let agent: { name: string; at: number } | null = null;
export const kitAgent = () => agent;

export type KitStatus =
  | { state: 'checking' }
  | { state: 'missing' }
  /** The browser refuses to let this site reach apps on the user's computer (its local-network permission). */
  | { state: 'blocked' }
  /** Safari, nothing answered: either the kit isn't running, or Safari doesn't trust its secure address yet. */
  | { state: 'trust' }
  | { state: 'outdated' }
  | { state: 'off'; version: string }
  | { state: 'ready'; version: string; model: string; backend: string };

/** Finds the kit and asks whether its AI is ready. */
export async function kitStatus(): Promise<KitStatus> {
  for (const b of base ? [base, ...BASES.filter((x) => x !== base)] : BASES) {
    try {
      const r = await fetch(`${b}/studio/status`, { signal: AbortSignal.timeout(3000) });
      if (r.status === 404) {
        base = b;
        return { state: 'outdated' };
      }
      if (!r.ok) continue;
      const j = await r.json();
      base = b;
      features = new Set(Array.isArray(j.features) ? j.features : []);
      agent = j.agent && typeof j.agent.name === 'string' ? { name: j.agent.name, at: Number(j.agent.at) || 0 } : null;
      if (!j.ready) return { state: 'off', version: j.version };
      return { state: 'ready', version: j.version, model: String(j.model || ''), backend: String(j.backend || '') };
    } catch {
      // Not running at this address (or the browser blocked it): try the next.
    }
  }
  // Nothing answered. Browsers now ask before a website may reach apps on the user's own computer;
  // if that was refused, say so rather than claiming the kit isn't running.
  if ((await localNetworkPermission()) === 'denied') return { state: 'blocked' };
  return isSafari() ? { state: 'trust' } : { state: 'missing' };
}

/** The kit's address on this computer (found by kitStatus), or null when it is not running. */
export async function kitBase(): Promise<string | null> {
  if (!base) await kitStatus();
  return base;
}

/** The browser's "apps and services on this device" permission for this site, where it exists. */
async function localNetworkPermission(): Promise<PermissionState | 'unknown'> {
  try {
    const s = await navigator.permissions.query({ name: 'local-network-access' as PermissionName });
    return s.state;
  } catch {
    return 'unknown';
  }
}

/** The preset catalogue, trimmed to what the AI needs to use each preset well. */
function catalogForAi() {
  return PRESET_CATALOG.filter((p) => !p.aiExcluded).map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
    appliesTo: p.appliesTo,
    defaultDuration: p.defaultDuration,
    params: Object.fromEntries(p.fields.map((f) => [f.key, f.type === 'select' ? f.options.map((o) => o.value) : f.type === 'layer' ? 'layer id' : f.type === 'longtext' ? 'text' : f.type])),
  }));
}

export interface AiResult {
  scene: Scene;
  explanation: string;
  model: string;
  /** True when the first answer was invalid and a second, corrected one was used. */
  repaired: boolean;
}

async function call(body: Record<string, unknown>, signal: AbortSignal, brief?: string) {
  if (!base) await kitStatus();
  if (!base) throw new Error('The AI Dev Kit is not running on this computer.');
  const r = await fetch(`${base}/studio/ai`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    // The brief (a style, a voice-over's instructions) goes first: older kits cut the rules at 8,000 characters.
    body: JSON.stringify({ ...body, catalog: catalogForAi(), rules: brief ? `${brief}\n\n${MOTION_RULES}` : MOTION_RULES }),
    signal,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j as { scene: unknown; explanation: string; model: string; patch?: Patch };
}

/** An AI's additions to a scene: new layers (on top, or just under a named layer) and new clips on existing ones. */
interface Patch { add: Array<Record<string, unknown>>; clips: Array<{ layer: string; clip: Record<string, unknown> }> }

/** The scene with the AI's additions merged in (ids that clash are renamed, so nothing existing is replaced). */
function applyPatch(scene: Scene, patch: Patch): Scene {
  const taken = new Set<string>();
  const collect = (list: AnyLayer[]) => list.forEach((l) => { taken.add(l.id); l.clips.forEach((c) => taken.add(c.id)); if (l.layers) collect(l.layers); });
  collect(scene.layers as unknown as AnyLayer[]);
  const fresh = (id: unknown) => { let v = String(id || 'x').replace(/[^\w-]/g, '') || 'x'; const b = v; let k = 2; while (taken.has(v)) v = `${b}-${k++}`; taken.add(v); return v; };
  const renew = (l: Record<string, unknown>): Record<string, unknown> => ({
    ...l, id: fresh(l.id), clips: (Array.isArray(l.clips) ? l.clips : []).map((c: Record<string, unknown>) => ({ ...c, id: fresh(c.id) })),
    ...(Array.isArray(l.layers) ? { layers: (l.layers as Array<Record<string, unknown>>).map(renew) } : {}),
  });
  let layers = [...scene.layers] as unknown as Array<Record<string, unknown>>;
  for (const raw of patch.add ?? []) {
    if (!raw || typeof raw !== 'object') continue;
    const { below, ...rest } = raw as Record<string, unknown> & { below?: string };
    const l = renew(rest);
    const k = typeof below === 'string' ? layers.findIndex((x) => x.id === below) : -1;
    layers = k >= 0 ? [...layers.slice(0, k), l, ...layers.slice(k)] : [...layers, l];
  }
  // New clips on existing layers (anywhere in the tree).
  const add = new Map<string, Array<Record<string, unknown>>>();
  for (const c of patch.clips ?? []) if (c && typeof c.layer === 'string' && c.clip) add.set(c.layer, [...(add.get(c.layer) ?? []), { ...c.clip, id: fresh(c.clip.id) }]);
  const walk = (list: Array<Record<string, unknown>>): Array<Record<string, unknown>> => list.map((l) => {
    const more = add.get(l.id as string);
    const out = more ? { ...l, clips: [...(l.clips as unknown[]), ...more] } : l;
    return Array.isArray(out.layers) ? { ...out, layers: walk(out.layers as Array<Record<string, unknown>>) } : out;
  });
  return { ...scene, layers: walk(layers) as unknown as Scene['layers'] };
}

type AnyLayer = { id: string; clips: Array<{ id: string; preset: string; params?: Record<string, unknown> }>; layers?: AnyLayer[] };

/** The custom code clips already in a scene, by layer and clip id, with their code. */
function codeClips(scene: Scene): Map<string, unknown> {
  const out = new Map<string, unknown>();
  const walk = (list: AnyLayer[]) => list.forEach((l) => {
    l.clips.forEach((c) => { if (c.preset === 'code') out.set(`${l.id}/${c.id}`, c.params?.code); });
    if (l.layers) walk(l.layers);
  });
  walk(scene.layers as unknown as AnyLayer[]);
  return out;
}

/**
 * The AI writes scene data, never code: any code clip it added, or whose code it changed, is dropped.
 * Code clips the author wrote come back exactly as they were.
 */
function guardCode(scene: Scene, keep: Map<string, unknown>): Scene {
  const walk = (list: AnyLayer[]): AnyLayer[] => list.map((l) => ({
    ...l,
    clips: l.clips.filter((c) => c.preset !== 'code' || (keep.has(`${l.id}/${c.id}`) && keep.get(`${l.id}/${c.id}`) === c.params?.code)),
    ...(l.layers ? { layers: walk(l.layers) } : {}),
  }));
  return { ...scene, layers: walk(scene.layers as unknown as AnyLayer[]) as unknown as Scene['layers'] };
}

/**
 * The scene as the AI sees it: uploaded files (data: URLs, often megabytes) become short placeholders,
 * and audio tracks lose their transcripts (the request carries what it needs). restoreAssets() puts the
 * files back into the answer, and the audio tracks are always the author's own: the AI never edits them.
 */
function forAi(scene: Scene): { scene: Scene; assets: Map<string, string> } {
  const assets = new Map<string, string>();
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') {
      if (v.startsWith('data:') && v.length > 200) {
        const key = `asset:${assets.size + 1}`;
        assets.set(key, v);
        return key;
      }
      return v;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  const audio = scene.audio?.map(({ words: _w, speech: _s, ...a }) => a);
  return { scene: walk({ ...scene, ...(audio ? { audio } : {}) }) as Scene, assets };
}

function restoreAssets(answer: Scene, assets: Map<string, string>, original: Scene, keepAudio: boolean): Scene {
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return assets.get(v) ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  const out = walk(answer) as Scene;
  if (!keepAudio) return out;
  if (original.audio?.length) out.audio = original.audio;
  else delete out.audio;
  return out;
}

/** A video stays a video: an answer that dropped the mode (or its formats) gets them back. */
function keepMode(answer: Scene, original: Scene): Scene {
  if (original.mode !== 'video' || !original.video) return answer;
  const same = answer.mode === 'video' && answer.video && answer.stage.breakpoints.every((b) => original.stage.breakpoints.some((o) => o.id === b.id));
  return same ? answer : toVideo(answer, answer.video ?? original.video);
}

/**
 * Asks for a new scene ("create") or a change to the current one ("edit"). The answer is validated;
 * if it is invalid, the AI gets one chance to repair it with the validator's errors.
 */
export async function askForScene(opts: {
  mode: 'create' | 'edit';
  prompt: string;
  scene: Scene;
  selection: string[];
  signal: AbortSignal;
  /** Art direction added to the rules (a style, a voice-over's instructions). */
  brief?: string;
  /** Data for the request (a voice-over's timed words); the brief says how to use it. */
  context?: string;
  /** Files the AI may place by name (a website's screenshots as "shot:1"), filled in afterwards. */
  assets?: Map<string, string>;
  /** Only additions are wanted (Edit my video): the AI returns just what it adds, which is much quicker. */
  additions?: boolean;
}): Promise<AiResult> {
  const keep = codeClips(opts.scene);
  const { scene: sent, assets } = forAi(opts.scene);
  for (const [k, v] of opts.assets ?? []) assets.set(k, v);
  if (opts.additions && opts.mode === 'edit' && features.has('add')) {
    const r = await call({ mode: 'add', prompt: opts.prompt, scene: sent, selection: opts.selection, context: opts.context }, opts.signal, opts.brief);
    if (r.patch) {
      const merged = applyPatch(opts.scene, restoreAssets(r.patch as unknown as Scene, assets, opts.scene, false) as unknown as Patch);
      const v = validateScene(merged);
      if (v.ok) return { scene: keepMode(guardCode(v.scene, keep), opts.scene), explanation: r.explanation, model: r.model, repaired: false };
      // Additions that do not validate: one repair of the merged scene, as a whole.
      const second = await call({ mode: 'repair', prompt: opts.prompt, scene: forAi(merged).scene, errors: v.errors, context: opts.context }, opts.signal, opts.brief);
      const v2 = validateScene(restoreAssets(second.scene as Scene, assets, opts.scene, true));
      if (v2.ok) return { scene: keepMode(guardCode(v2.scene, keep), opts.scene), explanation: second.explanation || r.explanation, model: second.model, repaired: true };
      throw new Error(`The AI's additions still had problems after a second try:\n- ${v2.errors.slice(0, 6).join('\n- ')}`);
    }
  }
  const first = await call({ mode: opts.mode, prompt: opts.prompt, scene: sent, selection: opts.selection, context: opts.context }, opts.signal, opts.brief);
  // Validate with the real files back in (placeholders aren't valid addresses).
  let v = validateScene(restoreAssets(first.scene as Scene, assets, opts.scene, opts.mode !== 'create'));
  if (v.ok) return { scene: keepMode(guardCode(v.scene, keep), opts.scene), explanation: first.explanation, model: first.model, repaired: false };

  const second = await call({ mode: 'repair', prompt: opts.prompt, scene: first.scene, errors: v.errors, context: opts.context }, opts.signal, opts.brief);
  v = validateScene(restoreAssets(second.scene as Scene, assets, opts.scene, opts.mode !== 'create'));
  if (v.ok) return { scene: keepMode(guardCode(v.scene, keep), opts.scene), explanation: second.explanation || first.explanation, model: second.model, repaired: true };
  throw new Error(`The AI's scene still had problems after a second try:\n- ${v.errors.slice(0, 6).join('\n- ')}`);
}

/* ------------------------------------------------------------------ the AI director (the kit's studio-director.mjs) */

async function post<T>(path: string, body: Record<string, unknown>, signal: AbortSignal): Promise<T> {
  if (!base) await kitStatus();
  if (!base) throw new Error('The AI Dev Kit is not running on this computer.');
  const r = await fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404) throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j as T;
}

export interface Plan { title: string; plan: string; segments?: Array<{ narration: string; visual: string }> }

/** A storyboard (or an explainer's script) to agree before anything is built. */
export function askForPlan(opts: { prompt: string; kind: 'storyboard' | 'explainer' | 'tutorial'; scene: Scene; context?: string; brief?: string; signal: AbortSignal }): Promise<Plan> {
  return post<Plan>('/studio/plan', {
    prompt: opts.prompt, kind: opts.kind, context: opts.context, catalog: catalogForAi(),
    rules: opts.brief ? `${opts.brief}\n\n${MOTION_RULES}` : MOTION_RULES,
    stage: { breakpoints: opts.scene.stage.breakpoints, heightMode: opts.scene.stage.heightMode },
  }, opts.signal);
}

/** Look, criticise, fix: the kit renders key frames and the AI reviews them; a corrected scene comes back validated. */
export async function askForReview(opts: { scene: Scene; prompt: string; playerBase: string; signal: AbortSignal }): Promise<{ scene?: Scene; note: string; looked: boolean; frames: number }> {
  // The real scene goes to the kit (it renders the frames from it; it shortens the files for the AI itself).
  const r = await post<{ ok: boolean; notes?: string; scene?: Scene; explanation?: string; scores?: Record<string, number> | null; looked: boolean; frames: number[] }>('/studio/review', {
    scene: opts.scene, prompt: opts.prompt, playerBase: opts.playerBase, catalog: catalogForAi(), rules: MOTION_RULES,
    // Only the changed layers come back (the kit merges them); an older kit ignores this and returns the whole scene.
    patch: true,
  }, opts.signal);
  // The jury's scores (1-5 on seven points), when the kit gives them, follow the note.
  const jury = r.scores && typeof r.scores === 'object' ? ` Jury (1-5): ${Object.entries(r.scores).filter(([, n]) => typeof n === 'number').map(([k, n]) => `${k} ${n}`).join(' · ')}.` : '';
  if (r.ok || !r.scene) return { note: (r.notes || 'No changes needed.') + jury, looked: r.looked, frames: r.frames?.length ?? 0 };
  const v = validateScene(r.scene);
  if (!v.ok) return { note: 'The review suggested changes that did not validate, so the scene was kept as it was.', looked: r.looked, frames: r.frames?.length ?? 0 };
  return { scene: keepMode(guardCode(v.scene, codeClips(opts.scene)), opts.scene), note: (r.explanation || '') + jury, looked: r.looked, frames: r.frames?.length ?? 0 };
}

/** A website (or a project folder)'s real words, colours, fonts and screenshots, for a quick scene. */
export function askForQuick(opts: { url?: string; folder?: string; signal: AbortSignal }): Promise<{ brief: string; context: string; shots: string[] }> {
  return post('/studio/quick', { url: opts.url, folder: opts.folder }, opts.signal);
}
