import type { Scene } from '@unysonplus/scene-player/types';
import { applyWordPins } from '@unysonplus/scene-player/words';
import { speak } from './voice';

/**
 * One scene, many videos: {{placeholders}} in a scene's words and media addresses, filled from each row of a
 * spreadsheet (CSV). The same rule as the AI Dev Kit's studio-batch.mjs: keep the two in step.
 */

export interface Sheet { columns: string[]; rows: Record<string, string>[] }

/** CSV text → columns and rows. Quotes, doubled quotes, commas and line breaks inside quotes; ";" when it is the separator. */
export function parseCsv(text: string): Sheet {
  const t = text.replace(/^﻿/, '');
  const first = t.split(/\r?\n/)[0];
  const sep = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const out: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); out.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); out.push(row); }
  const lines = out.filter((r) => r.some((c) => c.trim() !== ''));
  if (!lines.length) return { columns: [], rows: [] };
  const columns = lines[0].map((c) => c.trim());
  return { columns, rows: lines.slice(1).map((r) => Object.fromEntries(columns.map((c, i) => [c, (r[i] ?? '').trim()]))) };
}

const key = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_');
const PH = /\{\{\s*([^{}]+?)\s*\}\}/g;

function walk(v: unknown, fn: (s: string) => string): unknown {
  if (typeof v === 'string') return fn(v);
  if (Array.isArray(v)) return v.map((x) => walk(x, fn));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, fn)]));
  return v;
}

/** Every placeholder the scene uses (each once, ignoring case). */
export function placeholders(scene: Scene): string[] {
  const found = new Map<string, string>();
  walk(scene, (s) => { for (const m of s.matchAll(PH)) if (!found.has(key(m[1]))) found.set(key(m[1]), m[1].trim()); return s; });
  return [...found.values()];
}

/** Placeholders with no column of that name. */
export function missingColumns(scene: Scene, columns: string[]): string[] {
  const have = new Set(columns.map(key));
  return placeholders(scene).filter((p) => !have.has(key(p)));
}

/**
 * The scene with one row's values in place of its placeholders. files: pictures picked with the spreadsheet, by file
 * name, for a column that names a file ("mug.png") rather than giving an address.
 */
export function fillScene(scene: Scene, row: Record<string, string>, files?: Map<string, string>): Scene {
  const vals = new Map(Object.entries(row).map(([k, v]) => [key(k), v]));
  return walk(scene, (s) => {
    const out = s.replace(PH, (m, n: string) => (vals.has(key(n)) ? vals.get(key(n))! : m));
    if (out !== s && files?.size) { const f = files.get(out.trim().toLowerCase()); if (f) return f; }
    return out;
  }) as Scene;
}

/** Voice clips whose script a row changes ({{placeholders}} in a voice-over made from a script). */
export function voicesToSpeak(template: Scene, filled: Scene): string[] {
  return (filled.audio ?? []).filter((a) => a.role === 'voice' && a.script && (template.audio ?? []).find((t) => t.id === a.id)?.script !== a.script).map((a) => a.id);
}

/**
 * A row's voice-overs: each voice clip whose script the row changed is spoken again by the AI Dev Kit in the same voice
 * (only the lines whose words changed are made again: the kit keeps the others), and everything pinned to its words
 * follows (word pins). The same rule as the kit's studio-batch.mjs voiceRow: keep the two in step.
 */
export async function voiceRow(template: Scene, filled: Scene, opts: { signal?: AbortSignal; onStep?: (s: string) => void } = {}): Promise<Scene> {
  const ids = voicesToSpeak(template, filled);
  if (!ids.length) return filled;
  const audio = [];
  for (const a of filled.audio ?? []) {
    if (!ids.includes(a.id)) { audio.push(a); continue; }
    opts.onStep?.(`Speaking "${a.name || a.id}"`);
    const v = await speak(a.script!.split(String.fromCharCode(10)).map((l) => l.trim()).filter(Boolean), { voice: a.voiceId, language: a.lang, signal: opts.signal, onStep: opts.onStep });
    const { offset: _o, duration: _d, ...rest } = a;
    audio.push({ ...rest, src: v.src, words: v.words, speech: v.speech });
  }
  const pinned = applyWordPins({ ...filled, audio }).scene;
  const end = Math.max(0, ...audio.filter((a) => a.role === 'voice').map((a) => { const w = a.words?.[a.words.length - 1]; return w ? a.start + w.t + w.d - (a.offset ?? 0) : 0; }));
  return end + 0.4 > pinned.duration ? { ...pinned, duration: Math.round((end + 0.4) * 100) / 100 } : pinned;
}

/** A row's label: the first column's value (a product name, usually). */
export const rowLabel = (sheet: Sheet, i: number) => (sheet.rows[i] ? Object.values(sheet.rows[i])[0] : '') || `Row ${i + 1}`;

export const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
