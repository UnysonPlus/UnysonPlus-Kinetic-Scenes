import type { Clip, Layer, Scene } from '@unysonplus/scene-player/types';
import { PRESET_CATALOG, presetMeta } from '@unysonplus/scene-player/catalog';
import { validateScene } from '@unysonplus/scene-player/validate';
import { lintScene } from '@unysonplus/scene-player/lint';
import { findLayer, mapLayer, setLayerProps, writeLayout } from './sceneOps';

/**
 * An AI inside the open Studio: where the browser offers WebMCP (navigator.modelContext), the Studio registers
 * its own tools, so an AI working in the browser can look at the scene in front of the person and change it.
 * Every change goes through the Studio's normal commit, so it lands in the undo history like any edit.
 */

interface Api {
  scene: () => Scene;
  commit: (scene: Scene) => void;
  seek: (t: number) => void;
  select: (layerId: string | null) => void;
}

type Text = { content: Array<{ type: 'text'; text: string }> };
const reply = (v: unknown): Text => ({ content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v, null, 1) }] });

/** The scene without heavy embedded files (uploaded pictures and sounds), for an AI to read. */
function slim(scene: Scene): unknown {
  return JSON.parse(JSON.stringify(scene, (_k, v) => (typeof v === 'string' && v.startsWith('data:') && v.length > 200 ? `${v.slice(0, 40)}… (embedded file)` : v)));
}

function summary(list: Layer[], depth = 0): unknown[] {
  return list.map((l) => ({
    id: l.id, type: l.type, name: l.name, ...(l.type === 'text' ? { text: l.text } : {}), box: 'box' in l ? l.box : undefined,
    start: l.start, end: l.end, clips: l.clips.map((c) => `${c.id}: ${c.preset} ${c.start}-${(c.start + c.duration).toFixed(2)}s`),
    ...(l.type === 'group' && depth < 4 ? { layers: summary(l.layers, depth + 1) } : {}),
  }));
}

function tools(api: Api) {
  const apply = (next: Scene, what: string): Text => {
    const v = validateScene(next);
    if (!v.ok) return reply(`Not applied: ${v.errors.slice(0, 6).join('; ')}`);
    api.commit(v.scene);
    return reply(`${what} (undo with Ctrl+Z).`);
  };
  return [
    { name: 'get_scene', description: 'The whole Kinetic Scenes scene file open in the Studio (embedded files shortened).', inputSchema: { type: 'object', properties: {} },
      execute: async () => reply(slim(api.scene())) },
    { name: 'list_layers', description: 'The layers (bottom to top) with their ids, types, text, boxes and clips.', inputSchema: { type: 'object', properties: {} },
      execute: async () => reply(summary(api.scene().layers)) },
    { name: 'list_presets', description: 'Every preset a clip can use, with what it does, what it applies to and its settings.', inputSchema: { type: 'object', properties: {} },
      execute: async () => reply(PRESET_CATALOG.filter((p) => !p.aiExcluded).map((p) => ({ id: p.id, label: p.label, description: p.description, appliesTo: p.appliesTo, defaultDuration: p.defaultDuration, params: p.fields.map((f) => f.key) }))) },
    { name: 'check_scene', description: 'The Studio\'s Check scene report: readability, timing and layout problems.', inputSchema: { type: 'object', properties: {} },
      execute: async () => reply(lintScene(api.scene()).map((i) => ({ severity: i.severity, layer: i.layerId, message: i.message }))) },
    { name: 'show_moment', description: 'Moves the Studio\'s playhead to a moment (seconds) so the person sees that frame, optionally selecting a layer.', inputSchema: { type: 'object', properties: { t: { type: 'number' }, layer: { type: 'string' } }, required: ['t'] },
      execute: async ({ t, layer }: { t: number; layer?: string }) => { api.seek(t); if (layer) api.select(layer); return reply(`Showing ${t} s.`); } },
    { name: 'set_text', description: 'Changes a text layer\'s words.', inputSchema: { type: 'object', properties: { layer: { type: 'string' }, text: { type: 'string' } }, required: ['layer', 'text'] },
      execute: async ({ layer, text }: { layer: string; text: string }) => {
        const l = findLayer(api.scene(), layer);
        if (!l || l.type !== 'text') return reply(`No text layer "${layer}".`);
        return apply(writeLayout(api.scene(), layer, null, { text }), `Changed the words of ${layer}`);
      } },
    { name: 'move_layer', description: 'Moves a layer (x and y in % of the stage; w and h optional sizes) in the base layout.', inputSchema: { type: 'object', properties: { layer: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, w: { type: 'number' }, h: { type: 'number' } }, required: ['layer'] },
      execute: async ({ layer, ...box }: { layer: string; x?: number; y?: number; w?: number; h?: number }) => {
        if (!findLayer(api.scene(), layer)) return reply(`No layer "${layer}".`);
        const patch = Object.fromEntries(Object.entries(box).filter(([, v]) => typeof v === 'number'));
        return apply(writeLayout(api.scene(), layer, null, { box: patch }), `Moved ${layer}`);
      } },
    { name: 'set_layer', description: 'Sets a layer\'s own properties (for example fill, stroke, style, src, code, start, end, link, hover). Give only what changes.', inputSchema: { type: 'object', properties: { layer: { type: 'string' }, props: { type: 'object' } }, required: ['layer', 'props'] },
      execute: async ({ layer, props }: { layer: string; props: Record<string, unknown> }) => {
        if (!findLayer(api.scene(), layer)) return reply(`No layer "${layer}".`);
        const { id: _id, type: _type, clips: _clips, ...safe } = props;
        return apply(setLayerProps(api.scene(), layer, safe), `Changed ${layer}`);
      } },
    { name: 'add_clip', description: 'Adds a preset clip to a layer: preset id, start and duration in seconds, optional params and ease.', inputSchema: { type: 'object', properties: { layer: { type: 'string' }, preset: { type: 'string' }, start: { type: 'number' }, duration: { type: 'number' }, params: { type: 'object' }, ease: { type: 'string' } }, required: ['layer', 'preset', 'start'] },
      execute: async ({ layer, preset, start, duration, params, ease }: { layer: string; preset: string; start: number; duration?: number; params?: Record<string, unknown>; ease?: string }) => {
        const meta = presetMeta[preset];
        if (!meta) return reply(`No preset "${preset}" (use list_presets).`);
        const s = api.scene();
        let n = 1;
        const ids = new Set<string>();
        const walk = (list: Layer[]) => list.forEach((l) => { l.clips.forEach((c) => ids.add(c.id)); if (l.type === 'group') walk(l.layers); });
        walk(s.layers);
        while (ids.has(`ai${n}`)) n++;
        const clip: Clip = { id: `ai${n}`, preset, start, duration: duration ?? meta.defaultDuration, ...(ease ? { ease } : {}), ...(params ? { params } : {}) };
        return apply(mapLayer(s, layer, (l) => ({ ...l, clips: [...l.clips, clip] })), `Added ${meta.label} to ${layer} as ${clip.id}`);
      } },
    { name: 'update_clip', description: 'Changes a clip (by its id): start, duration, ease or params (params are merged).', inputSchema: { type: 'object', properties: { clip: { type: 'string' }, start: { type: 'number' }, duration: { type: 'number' }, ease: { type: 'string' }, params: { type: 'object' } }, required: ['clip'] },
      execute: async ({ clip, params, ...rest }: { clip: string; start?: number; duration?: number; ease?: string; params?: Record<string, unknown> }) => {
        let found = false;
        const walk = (list: Layer[]): Layer[] => list.map((l) => {
          const clips = l.clips.map((c) => { if (c.id !== clip) return c; found = true; return { ...c, ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)), ...(params ? { params: { ...(c.params ?? {}), ...params } } : {}) }; });
          const next = { ...l, clips } as Layer;
          if (next.type === 'group') next.layers = walk(next.layers);
          return next;
        });
        const s = api.scene();
        const layers = walk(s.layers);
        return found ? apply({ ...s, layers }, `Changed ${clip}`) : reply(`No clip "${clip}".`);
      } },
    { name: 'remove_clip', description: 'Removes a clip by its id.', inputSchema: { type: 'object', properties: { clip: { type: 'string' } }, required: ['clip'] },
      execute: async ({ clip }: { clip: string }) => {
        const walk = (list: Layer[]): Layer[] => list.map((l) => { const next = { ...l, clips: l.clips.filter((c) => c.id !== clip) } as Layer; if (next.type === 'group') next.layers = walk(next.layers); return next; });
        return apply({ ...api.scene(), layers: walk(api.scene().layers) }, `Removed ${clip}`);
      } },
  ];
}

/** Registers the Studio's tools where the browser offers WebMCP; returns whether it did, and a cleanup. */
export function registerWebMcp(api: Api): { available: boolean; dispose: () => void } {
  const mc = (navigator as unknown as { modelContext?: { provideContext?: (c: unknown) => void; registerTool?: (t: unknown) => unknown; unregisterTool?: (n: string) => void } }).modelContext;
  if (!mc) return { available: false, dispose: () => {} };
  const list = tools(api);
  try {
    if (typeof mc.provideContext === 'function') mc.provideContext({ tools: list });
    else if (typeof mc.registerTool === 'function') list.forEach((t) => mc.registerTool!(t));
  } catch (e) {
    console.warn('[Kinetic Scenes] WebMCP registration failed:', e);
    return { available: false, dispose: () => {} };
  }
  return {
    available: true,
    dispose: () => {
      try {
        if (typeof mc.provideContext === 'function') mc.provideContext({ tools: [] });
        else if (typeof mc.unregisterTool === 'function') list.forEach((t) => mc.unregisterTool!(t.name));
      } catch { /* the page is going away */ }
    },
  };
}
