import { PROPS } from './keyframes';
import { cleanTimeline, DEVICES, forPage, TRIGGERS, type Device, type PageFrame, type PageTimeline, type PageTrack, type TriggerType } from './pageTimeline';

/**
 * Page timelines as files (Animation Creator 5e, Import / Export):
 *
 * - **JSON** (every setting, to move timelines between pages and sites):
 *   `{ format: 'unysonplus-page-timelines', version: 1, page, timelines: [...] }`.
 * - **CSV** (a spreadsheet for people): one row per keyframe, the timeline's settings repeated on each row, so it can be
 *   read, sorted and edited in any spreadsheet. Importing it gives back the same timelines.
 *
 * Both import through cleanTimeline(), the same check the page's own data goes through.
 */

export const FILE_FORMAT = 'unysonplus-page-timelines';

export function timelinesToJson(list: PageTimeline[], page?: string): string {
  return JSON.stringify({ format: FILE_FORMAT, version: 1, ...(page ? { page } : {}), timelines: list.map(forPage) }, null, 2);
}

const COLS = [
  'timeline_id', 'timeline', 'plays_on', 'length', 'started_by', 'once', 'leave', 'toggle', 'threshold', 'delay',
  'repeat', 'yoyo', 'runs_on', 'element', 'element_name', 'track_curve', 't', ...PROPS.map((p) => p.key), 'curve',
] as const;

const cell = (v: unknown): string => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function timelinesToCsv(list: PageTimeline[]): string {
  const rows: string[] = [COLS.join(',')];
  for (const tl of list) {
    const g = tl.trigger;
    const base = [
      tl.id, tl.name, g.type, tl.duration, g.target ?? '', g.once === false ? 'no' : '', g.leave ?? '', g.toggle ? 'yes' : '',
      g.threshold ?? '', g.delay ?? '', tl.repeat ?? '', tl.yoyo ? 'yes' : '', (tl.runsOn && tl.runsOn.length < 3 ? tl.runsOn : []).join(' '),
    ];
    for (const tr of tl.tracks) {
      for (const f of tr.frames) {
        rows.push([...base, tr.target, tr.label ?? '', tr.ease ?? '', f.t, ...PROPS.map((p) => f[p.key]), f.ease ?? ''].map(cell).join(','));
      }
    }
  }
  return rows.join('\r\n') + '\r\n';
}

/** RFC 4180 rows (quoted cells, doubled quotes, line breaks inside quotes). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x !== '')) rows.push(row);
  return rows;
}

function csvToTimelines(text: string): PageTimeline[] {
  const rows = parseCsv(text.replace(/^﻿/, ''));
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const at = (r: string[], k: string) => { const i = head.indexOf(k); return i >= 0 ? (r[i] ?? '').trim() : ''; };
  const num = (v: string) => (v === '' ? undefined : Number(v));
  const byId = new Map<string, PageTimeline>();
  for (const r of rows.slice(1)) {
    const id = at(r, 'timeline_id') || at(r, 'timeline');
    const target = at(r, 'element');
    const t = num(at(r, 't'));
    if (!id) continue;
    let tl = byId.get(id);
    if (!tl) {
      const runs = at(r, 'runs_on').split(/[\s;|]+/).filter((d): d is Device => DEVICES.some((x) => x.value === d));
      const type = (TRIGGERS.some((x) => x.value === at(r, 'plays_on')) ? at(r, 'plays_on') : 'load') as TriggerType;
      tl = {
        id, name: at(r, 'timeline') || 'Page timeline', duration: num(at(r, 'length')) ?? 2,
        trigger: {
          type,
          ...(at(r, 'started_by') ? { target: at(r, 'started_by') } : {}),
          ...(at(r, 'once') === 'no' ? { once: false } : {}),
          ...(at(r, 'leave') === 'stay' ? { leave: 'stay' as const } : {}),
          ...(at(r, 'toggle') === 'yes' ? { toggle: true } : {}),
          ...(at(r, 'threshold') !== '' ? { threshold: Number(at(r, 'threshold')) } : {}),
          ...(at(r, 'delay') !== '' ? { delay: Number(at(r, 'delay')) } : {}),
        },
        ...(num(at(r, 'repeat')) ? { repeat: num(at(r, 'repeat')) } : {}),
        ...(at(r, 'yoyo') === 'yes' ? { yoyo: true } : {}),
        ...(runs.length ? { runsOn: runs } : {}),
        tracks: [],
      };
      byId.set(id, tl);
    }
    if (!target || t === undefined || !isFinite(t)) continue;
    let tr: PageTrack | undefined = tl.tracks.find((x) => x.target === target);
    if (!tr) {
      tr = { target, ...(at(r, 'element_name') ? { label: at(r, 'element_name') } : {}), ...(at(r, 'track_curve') ? { ease: at(r, 'track_curve') } : {}), frames: [] };
      tl.tracks.push(tr);
    }
    const f: PageFrame = { t };
    for (const p of PROPS) { const v = num(at(r, p.key)); if (v !== undefined && isFinite(v)) f[p.key] = v; }
    if (at(r, 'curve')) f.ease = at(r, 'curve');
    tr.frames.push(f);
  }
  return [...byId.values()];
}

/** Timelines from a file: our JSON (or a bare list / one timeline) or the CSV. Throws a readable message when it is neither. */
export function parseTimelinesFile(name: string, text: string): PageTimeline[] {
  const t = text.trim();
  let raw: unknown[] = [];
  if (/\.csv$/i.test(name) || (!t.startsWith('{') && !t.startsWith('['))) {
    raw = csvToTimelines(text);
  } else {
    let d: unknown;
    try { d = JSON.parse(t); } catch { throw new Error('This file is not valid JSON.'); }
    if (Array.isArray(d)) raw = d;
    else if (d && typeof d === 'object' && Array.isArray((d as { timelines?: unknown }).timelines)) raw = (d as { timelines: unknown[] }).timelines;
    else if (d && typeof d === 'object' && (d as { tracks?: unknown }).tracks) raw = [d];
  }
  const list = raw.slice(0, 50).map(cleanTimeline).filter((x): x is PageTimeline => !!x);
  if (!list.length) throw new Error('No page timelines found in this file.');
  return list;
}

export function downloadText(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
