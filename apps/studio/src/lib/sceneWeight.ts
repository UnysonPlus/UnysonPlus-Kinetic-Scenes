import type { Layer, Scene } from '@unysonplus/scene-player/types';
import type { LintIssue } from '@unysonplus/scene-player/lint';
import { getFootage, isWsFootage, wsFootageUrl } from './footage';

/**
 * The 3D weight of a scene: how many triangles its 3D layers draw, how much graphics memory their textures take and
 * how big their files are, measured from the glTF files themselves (without loading them in 3D). A web scene plays on
 * phones too, so Check scene warns when it goes past a budget a mid-range phone handles smoothly.
 */

export interface ModelWeight {
  /** Triangles drawn (a mesh placed twice counts twice). */
  tris: number;
  /** Textures, and the largest side among them in pixels. */
  textures: number;
  maxTex: number;
  /** Graphics memory the textures take, in bytes (width × height × 4, plus a third for mipmaps). */
  texBytes: number;
  /** The file's size in bytes. */
  bytes: number;
}

/** What a web scene should stay under (a mid-range phone; measured budgets for three.js pages). */
export const WEB_BUDGET = { tris: 300_000, modelTris: 150_000, texBytes: 96 * 1024 * 1024, bytes: 12 * 1024 * 1024, maxTex: 2048 };

const cache = new Map<string, Promise<ModelWeight | null>>();

async function bytesOf(src: string): Promise<Uint8Array | null> {
  try {
    if (isWsFootage(src)) { const u = await wsFootageUrl(src); if (!u) return null; return new Uint8Array(await (await fetch(u)).arrayBuffer()); }
    if (src.startsWith('local:')) { const b = await getFootage(src); return b ? new Uint8Array(await b.arrayBuffer()) : null; }
    const r = await fetch(src);
    return r.ok ? new Uint8Array(await r.arrayBuffer()) : null;
  } catch { return null; }
}

interface Gltf {
  accessors?: Array<{ count: number }>;
  meshes?: Array<{ primitives: Array<{ mode?: number; indices?: number; attributes: Record<string, number> }> }>;
  nodes?: Array<{ mesh?: number; children?: number[] }>;
  images?: Array<{ bufferView?: number; mimeType?: string; uri?: string }>;
  bufferViews?: Array<{ byteOffset?: number; byteLength: number }>;
}

async function imageSize(blob: Blob): Promise<[number, number] | null> {
  try { const b = await createImageBitmap(blob); const s: [number, number] = [b.width, b.height]; b.close(); return s; } catch { return null; }
}

async function measure(src: string): Promise<ModelWeight | null> {
  const buf = await bytesOf(src);
  if (!buf) return null;
  let json: Gltf;
  let bin: Uint8Array | null = null;
  if (buf[0] === 0x67 && buf[1] === 0x6c && buf[2] === 0x54 && buf[3] === 0x46) {
    // .glb: a 12-byte header, then chunks (JSON first, then the binary buffer).
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    const jsonLen = dv.getUint32(12, true);
    json = JSON.parse(new TextDecoder().decode(buf.subarray(20, 20 + jsonLen)));
    const binAt = 20 + jsonLen;
    if (binAt + 8 <= buf.length) bin = buf.subarray(binAt + 8, binAt + 8 + dv.getUint32(binAt, true));
  } else json = JSON.parse(new TextDecoder().decode(buf));

  const acc = json.accessors ?? [];
  const meshTris = (json.meshes ?? []).map((m) => m.primitives.reduce((n, p) => {
    if ((p.mode ?? 4) !== 4) return n; // lines and points are not triangles
    const count = p.indices !== undefined ? acc[p.indices]?.count ?? 0 : acc[p.attributes.POSITION]?.count ?? 0;
    return n + Math.floor(count / 3);
  }, 0));
  // Every node that places a mesh draws it once.
  const placed = (json.nodes ?? []).filter((n) => n.mesh !== undefined);
  const tris = placed.length ? placed.reduce((n, nd) => n + (meshTris[nd.mesh!] ?? 0), 0) : meshTris.reduce((a, b) => a + b, 0);

  let texBytes = 0, maxTex = 0, textures = 0;
  for (const img of json.images ?? []) {
    let blob: Blob | null = null;
    if (img.bufferView !== undefined && bin) {
      const v = json.bufferViews?.[img.bufferView];
      if (v) blob = new Blob([bin.slice(v.byteOffset ?? 0, (v.byteOffset ?? 0) + v.byteLength)], { type: img.mimeType || 'image/png' });
    } else if (img.uri?.startsWith('data:')) blob = await (await fetch(img.uri)).blob();
    const size = blob ? await imageSize(blob) : null;
    textures++;
    if (size) { texBytes += size[0] * size[1] * 4 * 1.33; maxTex = Math.max(maxTex, size[0], size[1]); }
  }
  return { tris, textures, maxTex, texBytes: Math.round(texBytes), bytes: buf.length };
}

/** A glTF / GLB model's weight (remembered per address), or null when it can't be read. */
export function modelWeight(src: string): Promise<ModelWeight | null> {
  let p = cache.get(src);
  if (!p) { p = measure(src).catch(() => null); cache.set(src, p); }
  return p;
}

const mb = (b: number) => `${(b / 1048576).toFixed(b < 10 * 1048576 ? 1 : 0)} MB`;
const k = (n: number) => n.toLocaleString('en-US');

/** "12,345 triangles, 2 textures (largest 2048 px), 1.2 MB" */
export function describeWeight(w: ModelWeight): string {
  return `${k(w.tris)} triangles${w.textures ? `, ${w.textures} texture${w.textures > 1 ? 's' : ''}${w.maxTex ? ` (largest ${w.maxTex} px)` : ''}` : ''}, ${mb(w.bytes)}`;
}

/** Every 3D model layer in the scene, groups included. */
function models(list: Layer[], out: Array<Extract<Layer, { type: 'model' }>> = []) {
  for (const l of list) { if (l.type === 'model') out.push(l); else if (l.type === 'group') models(l.layers, out); }
  return out;
}

/** The scene's 3D weight for Check scene: a one-line summary (a note, not an issue) and warnings past the web budget. */
export async function sceneWeight(scene: Scene): Promise<{ summary: string | null; issues: LintIssue[] }> {
  const list = models(scene.layers);
  if (!list.length) return { summary: null, issues: [] };
  const web = scene.mode !== 'video';
  const issues: LintIssue[] = [];
  let tris = 0, texBytes = 0, bytes = 0, unread = 0;
  for (const l of list) {
    const m = l.model;
    if (m.kind === 'gltf' && m.src) {
      const w = await modelWeight(m.src);
      if (!w) { unread++; continue; }
      tris += w.tris; texBytes += w.texBytes; bytes += w.bytes;
      if (web && w.tris > WEB_BUDGET.modelTris) issues.push({ id: `weight:model:${l.id}`, severity: 'warn', layerId: l.id, message: `${l.name || l.id} has ${k(w.tris)} triangles, heavy for one model on a web page (aim for under ${k(WEB_BUDGET.modelTris)}). Decimate it in Blender (or ask your AI agent to rebuild it lighter).` });
      if (web && w.maxTex > WEB_BUDGET.maxTex) issues.push({ id: `weight:tex:${l.id}`, severity: 'warn', layerId: l.id, message: `${l.name || l.id} has a ${w.maxTex} px texture: phones may not show it, and it takes a lot of graphics memory. Use 2048 px at most (1024 px is usually enough).` });
    } else if (m.kind === 'device') tris += 6000;
    else tris += 4000; // 3D text, shapes and logos: small, built by the player
  }
  const over = web && (tris > WEB_BUDGET.tris || texBytes > WEB_BUDGET.texBytes || bytes > WEB_BUDGET.bytes);
  const summary = `This scene's 3D: about ${k(tris)} triangles, ${mb(texBytes)} of textures in graphics memory and ${mb(bytes)} of model files${unread ? ` (${unread} model${unread > 1 ? 's' : ''} could not be read)` : ''}.`;
  if (over) {
    const parts = [
      tris > WEB_BUDGET.tris ? `triangles (keep under ${k(WEB_BUDGET.tris)})` : '',
      texBytes > WEB_BUDGET.texBytes ? `texture memory (keep under ${mb(WEB_BUDGET.texBytes)})` : '',
      bytes > WEB_BUDGET.bytes ? `file size (keep under ${mb(WEB_BUDGET.bytes)})` : '',
    ].filter(Boolean);
    issues.unshift({ id: 'weight:scene', severity: 'warn', message: `${summary} That is past a web page's budget for ${parts.join(', ')}: it may stutter or fail on phones. Lighter models (decimate), smaller textures (1024 px) or fewer 3D layers help.` });
  }
  const fine = issues.length ? ' In total, within a web page\'s budget (a model is heavy on its own: see below).' : ' Within a web page\'s budget.';
  return { summary: `${summary}${web && !over ? fine : ''}`, issues };
}
