import type { Clip, CodeLayer } from './types';
import { hash01 } from './random';

/**
 * The Code layer: an editor (or a terminal) whose content is a pure function of time. Every code clip on
 * the layer (Type code, Change code, Highlight code, Run code, Code note) is compiled once into events on
 * individual characters (when each appears, is selected, is deleted), and each frame is drawn from those
 * events at the current time. So typing in the middle of a file, lines sliding down to make room, a
 * selection being deleted and retyped, the view scrolling to follow the caret, all come out the same
 * whether the frame was reached by playing or by seeking.
 */

type Ease = (t: number) => number;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ------------------------------------------------------------------ syntax colours */

const KW: Record<string, string> = {
  js: 'break case catch class const continue default delete do else export extends finally for from function if import in instanceof let new of return static super switch this throw try typeof var void while yield async await true false null undefined',
  python: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield print self',
  java: 'abstract boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long new package private protected public return short static super switch this throw throws try void while true false null String var',
  php: 'abstract and array as break case catch class clone const continue declare default do echo else elseif empty endif extends final finally fn for foreach function global if implements include interface isset list namespace new null or print private protected public require return static switch throw trait try unset use var while true false',
  csharp: 'abstract as base bool break case catch char class const continue decimal default do double else enum false finally float for foreach if int interface internal is namespace new null object out override private protected public readonly ref return static string struct switch this throw true try using var virtual void while',
  go: 'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var true false nil',
  rust: 'as async await break const continue crate else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while',
  c: 'auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while include define std cout cin endl namespace using class public private true false nullptr',
  sql: 'select from where and or not insert into values update set delete create table drop alter join left right inner outer on group by order having limit as distinct null is in like between union SELECT FROM WHERE AND OR NOT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE JOIN ON GROUP BY ORDER LIMIT AS',
  bash: 'if then else elif fi for while do done case esac function in echo export cd ls git npm node python pip sudo cat grep return local',
};
KW.ts = `${KW.js} interface type enum implements private public readonly as keyof never unknown any number string boolean`;
KW.cpp = KW.c;

export type CodeTok = 'kw' | 'str' | 'com' | 'num' | 'fn' | 'type' | 'op' | 'tag' | 'attr' | 'prompt' | 'plain';

function langOf(layer: CodeLayer): string {
  const l = layer.language ?? 'auto';
  if (l !== 'auto') return l;
  const t = layer.title ?? '';
  const ext = /\.([a-z0-9]+)$/i.exec(t)?.[1]?.toLowerCase() ?? '';
  const byExt: Record<string, string> = { py: 'python', java: 'java', js: 'js', mjs: 'js', jsx: 'js', ts: 'ts', tsx: 'ts', php: 'php', cs: 'csharp', go: 'go', rs: 'rust', c: 'c', h: 'c', cpp: 'cpp', sql: 'sql', sh: 'bash', html: 'html', css: 'css', json: 'json' };
  if (byExt[ext]) return byExt[ext];
  return layer.frame === 'terminal' ? 'bash' : 'js';
}

/** One colour class per character of `text`. */
export function highlight(text: string, lang: string): CodeTok[] {
  const out: CodeTok[] = new Array(text.length).fill('plain');
  const mark = (a: number, b: number, k: CodeTok) => { for (let i = a; i < b && i < out.length; i++) out[i] = k; };
  if (lang === 'text') return out;
  if (lang === 'html') {
    for (const m of text.matchAll(/<!--[\s\S]*?-->/g)) mark(m.index!, m.index! + m[0].length, 'com');
    for (const m of text.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>/g)) {
      mark(m.index!, m.index! + m[0].length, 'tag');
      const attrsAt = m.index! + 1 + (m[0][1] === '/' ? 1 : 0) + m[1].length;
      for (const a of m[2].matchAll(/([\w-:]+)(=("[^"]*"|'[^']*'))?/g)) {
        mark(attrsAt + a.index!, attrsAt + a.index! + a[1].length, 'attr');
        if (a[3]) mark(attrsAt + a.index! + a[1].length + 1, attrsAt + a.index! + a[0].length, 'str');
      }
    }
    return out;
  }
  if (lang === 'css') {
    for (const m of text.matchAll(/\/\*[\s\S]*?\*\//g)) mark(m.index!, m.index! + m[0].length, 'com');
    for (const m of text.matchAll(/([\w-]+)\s*:/g)) mark(m.index!, m.index! + m[1].length, 'attr');
    for (const m of text.matchAll(/[.#]?[\w-]+(?=\s*\{)/g)) mark(m.index!, m.index! + m[0].length, 'tag');
    for (const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b|\b\d+(\.\d+)?(px|em|rem|%|s|vh|vw)?\b/g)) mark(m.index!, m.index! + m[0].length, 'num');
    return out;
  }
  const words = new Set((KW[lang] ?? KW.js).split(' '));
  const lineComment = lang === 'python' || lang === 'bash' ? '#' : lang === 'sql' ? '--' : '//';
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const rest = text.slice(i);
    if (lang === 'bash' && (i === 0 || text[i - 1] === '\n') && (c === '$' || c === '>') && text[i + 1] === ' ') { mark(i, i + 1, 'prompt'); i += 1; continue; }
    if (rest.startsWith(lineComment) || (lang === 'php' && c === '#')) {
      const e = text.indexOf('\n', i); const end = e < 0 ? text.length : e; mark(i, end, 'com'); i = end; continue;
    }
    if (rest.startsWith('/*') && lang !== 'python' && lang !== 'bash') {
      const e = text.indexOf('*/', i + 2); const end = e < 0 ? text.length : e + 2; mark(i, end, 'com'); i = end; continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < text.length && text[j] !== c && !(text[j] === '\n' && c !== '`')) j += text[j] === '\\' ? 2 : 1;
      mark(i, Math.min(text.length, j + 1), 'str'); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) && !/[\w$]/.test(text[i - 1] ?? '')) {
      const m = /^\d[\d_]*(\.\d+)?[a-zA-Z]*/.exec(rest)!; mark(i, i + m[0].length, 'num'); i += m[0].length; continue;
    }
    if (/[A-Za-z_$@]/.test(c)) {
      const m = /^[@$]?[A-Za-z_$][\w$]*/.exec(rest)!;
      const w = m[0];
      const after = text.slice(i + w.length).match(/^\s*\(/);
      mark(i, i + w.length, words.has(w) ? 'kw' : after ? 'fn' : /^[A-Z][a-z]/.test(w) ? 'type' : 'plain');
      i += w.length; continue;
    }
    if (/[=+\-*/%<>!&|^~?:]/.test(c)) mark(i, i + 1, 'op');
    i++;
  }
  return out;
}

const THEMES = {
  dark: { bg: '#0f141a', bar: '#161c24', border: '#262f3a', text: '#d6dde6', gutter: '#4b5868', kw: '#ff7b9c', str: '#a5e075', com: '#5f6f82', num: '#f6b26b', fn: '#7cc4ff', type: '#e5c07b', op: '#9aa7b6', tag: '#ff7b9c', attr: '#7cc4ff', prompt: '#2ad38b', sel: 'rgba(124,196,255,0.28)', line: 'rgba(255,255,255,0.05)', caret: '#ffffff', out: '#c9d4df' },
  light: { bg: '#ffffff', bar: '#f2f4f7', border: '#dde2e8', text: '#1f2933', gutter: '#a3adb8', kw: '#c2185b', str: '#2e7d32', com: '#8a96a3', num: '#c75b00', fn: '#1565c0', type: '#8d6e00', op: '#5b6875', tag: '#c2185b', attr: '#1565c0', prompt: '#16a34a', sel: 'rgba(21,101,192,0.18)', line: 'rgba(0,0,0,0.04)', caret: '#111111', out: '#33404d' },
};

/* ------------------------------------------------------------------ compiling the clips */

interface Glyph { ch: string; at: number; selAt: number; delAt: number; typedBy?: string }
interface CaretKey { t: number; glyph: number; typing: boolean }
interface Compiled { glyphs: Glyph[]; carets: CaretKey[]; popups: Array<{ from: number; to: number; glyph: number; word: string; others: string[] }> }

/** Typing rhythm: how long each character takes relative to an ordinary letter. */
function typeWeight(ch: string, prev: string, rand: number): number {
  if (ch === '\n') return 3.2;
  if (ch === ' ' && prev === '\n') return 0; // auto-indent arrives with the new line
  if (ch === ' ' && (prev === ' ' || prev === '\t')) return 0;
  const base = 0.7 + 0.6 * rand;
  if (/[.,;:)}\]]/.test(prev)) return base + 1.3;
  if (ch === ' ') return base * 1.25;
  return base;
}

function lineStarts(text: string) {
  const s = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') s.push(i + 1);
  return s;
}

/** The text of the live glyphs (existing, or due to exist) at a moment, with their glyph indices. */
function liveAt(glyphs: Glyph[], t: number, includeUntyped: boolean) {
  const idx: number[] = [];
  let text = '';
  glyphs.forEach((g, i) => {
    if (g.delAt <= t) return;
    if (!includeUntyped && g.at > t) return;
    idx.push(i);
    text += g.ch;
  });
  return { idx, text };
}

/**
 * A line-by-line diff (common lines kept), then a character diff inside each changed block. Every line is
 * treated as ending in a newline (the last one's is imaginary); hunks touching that imaginary newline are
 * moved onto the real text.
 */
function diffHunks(a: string, b: string): Array<{ at: number; del: number; ins: string }> {
  const A = a.split('\n'), B = b.split('\n');
  const n = A.length, m = B.length;
  const L: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const hunks: Array<{ at: number; del: number; ins: string }> = [];
  const block = (lines: string[]) => lines.map((l) => `${l}\n`).join('');
  let i = 0, j = 0, pos = 0;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { pos += A[i].length + 1; i++; j++; continue; }
    let i2 = i, j2 = j;
    while (i2 < n || j2 < m) {
      if (i2 < n && j2 < m && A[i2] === B[j2]) break;
      if (j2 < m && (i2 >= n || L[i2][j2 + 1] >= L[i2 + 1][j2])) j2++; else i2++;
    }
    const oldBlock = block(A.slice(i, i2));
    const newBlock = block(B.slice(j, j2));
    // Inside the block, keep the common start and end, so only what differs is retyped.
    let p = 0;
    while (p < oldBlock.length && p < newBlock.length && oldBlock[p] === newBlock[p]) p++;
    let s = 0;
    while (s < oldBlock.length - p && s < newBlock.length - p && oldBlock[oldBlock.length - 1 - s] === newBlock[newBlock.length - 1 - s]) s++;
    let at = pos + p, del = oldBlock.length - p - s, ins = newBlock.slice(p, newBlock.length - s);
    // The imaginary final newline: appending lines at the end becomes a newline and the lines, after the last character;
    // deleting the last lines takes the newline before them instead.
    if (at > a.length) { at = a.length; if (ins.endsWith('\n')) ins = `\n${ins.slice(0, -1)}`; }
    if (at + del > a.length) { at = Math.max(0, at - 1); }
    if (del || ins) hunks.push({ at, del, ins });
    pos += oldBlock.length;
    i = i2; j = j2;
  }
  return hunks;
}

const compiledCache = new WeakMap<CodeLayer, Compiled>();

export function compileCode(layer: CodeLayer, ease: (clip: Clip) => Ease): Compiled {
  const hit = compiledCache.get(layer);
  if (hit) return hit;
  const glyphs: Glyph[] = Array.from(layer.code, (ch) => ({ ch, at: -Infinity, selAt: Infinity, delAt: Infinity }));
  const carets: CaretKey[] = [];
  const popups: Compiled['popups'] = [];
  const clips = [...layer.clips].filter((c) => c.preset === 'code-type' || c.preset === 'code-edit').sort((a, b) => a.start - b.start);
  for (const clip of clips) {
    const p = clip.params ?? {};
    const t0 = clip.start, dur = Math.max(0.05, clip.duration);
    const e = ease(clip);
    if (clip.preset === 'code-type') {
      // Types a range of lines of the text as it stands when the clip starts (they are hidden until then).
      const live = liveAt(glyphs, t0 - 1e-6, true);
      const starts = lineStarts(live.text);
      const fromLine = Math.max(1, Math.round(typeof p.fromLine === 'number' ? p.fromLine : 1));
      const toLine = Math.round(typeof p.toLine === 'number' && p.toLine > 0 ? p.toLine : starts.length);
      const a = starts[Math.min(starts.length - 1, fromLine - 1)];
      const b = toLine >= starts.length ? live.text.length : starts[toLine];
      const order = live.idx.slice(a, b);
      if (!order.length) continue;
      const w = order.map((gi, k) => typeWeight(glyphs[gi].ch, k ? glyphs[order[k - 1]].ch : '\n', hash01(7, gi, Math.round(t0 * 1000))));
      const total = w.reduce((s, x) => s + x, 0) || 1;
      let acc = 0;
      order.forEach((gi, k) => {
        acc += w[k];
        const at = t0 + e(clamp01(acc / total)) * dur;
        glyphs[gi].at = Math.max(t0, at - (w[k] === 0 ? 0 : 1e-6));
        glyphs[gi].typedBy = clip.id;
        carets.push({ t: glyphs[gi].at, glyph: gi, typing: true });
      });
      if (p.suggest === true) addPopups(glyphs, order, popups, live.text);
      continue;
    }
    // Change code: from the text at the clip's start to the new text.
    const live = liveAt(glyphs, t0 - 1e-6, true);
    const target = typeof p.to === 'string' ? p.to : live.text;
    const hunks = diffHunks(live.text, target);
    if (!hunks.length) continue;
    // Each change gets a share of the clip by its size: a select-and-delete beat, then typing.
    const cost = hunks.map((h) => (h.del ? 0.6 + Math.min(h.del, 30) * 0.02 : 0) + h.ins.length * 0.06 + 0.25);
    const totalCost = cost.reduce((s, x) => s + x, 0);
    let clock = t0;
    let shift = 0; // how much earlier hunks have changed the live text's length
    const insertedOrder: number[] = [];
    hunks.forEach((h, k) => {
      const span = (cost[k] / totalCost) * dur;
      const at = h.at + shift;
      const delIdx = live.idx.slice(h.at, h.at + h.del);
      let tt = clock;
      // Park the caret at the change.
      const before = h.at > 0 ? live.idx[h.at - 1] : -1;
      carets.push({ t: tt, glyph: before, typing: false });
      if (delIdx.length) {
        const selFor = Math.min(span * 0.45, 0.6);
        delIdx.forEach((gi) => { glyphs[gi].selAt = tt + 0.08; glyphs[gi].delAt = tt + selFor; });
        tt += selFor;
      }
      // Insert the new characters right after the glyph before the change (in glyph order).
      const insertPos = before >= 0 ? before + 1 : 0;
      const fresh: Glyph[] = Array.from(h.ins, (ch) => ({ ch, at: Infinity, selAt: Infinity, delAt: Infinity, typedBy: clip.id }));
      // Glyphs deleted earlier stay in the array (hidden); insert after them so order holds.
      let ip = insertPos;
      while (ip < glyphs.length && delIdx.includes(ip)) ip++;
      glyphs.splice(ip, 0, ...fresh);
      // Indices after the splice moved: fix the live index list and the caret / popup keys.
      for (let q = 0; q < live.idx.length; q++) if (live.idx[q] >= ip) live.idx[q] += fresh.length;
      for (const c of carets) if (c.glyph >= ip) c.glyph += fresh.length;
      for (const pp of popups) if (pp.glyph >= ip) pp.glyph += fresh.length;
      for (let q = 0; q < insertedOrder.length; q++) if (insertedOrder[q] >= ip) insertedOrder[q] += fresh.length;
      const typeSpan = Math.max(0.05, clock + span - tt - 0.05);
      // Whole new lines inserted at the start of a line: press Enter first to open a line, then type into it.
      const atLineStart = h.at === 0 || live.text[h.at - 1] === '\n';
      const enterFirst = atLineStart && fresh.length > 1 && fresh[fresh.length - 1].ch === '\n';
      const order = enterFirst ? [fresh.length - 1, ...fresh.slice(0, -1).map((_, q) => q)] : fresh.map((_, q) => q);
      const w = order.map((q, r) => typeWeight(fresh[q].ch, r ? fresh[order[r - 1]].ch : '\n', hash01(11, ip + q, k)));
      const total = w.reduce((s, x) => s + x, 0) || 1;
      let acc = 0;
      order.forEach((q, r) => {
        acc += w[r];
        fresh[q].at = tt + e(clamp01(acc / total)) * typeSpan;
        // After the opening Enter the caret sits at the start of the new line (after the glyph before it).
        carets.push({ t: fresh[q].at, glyph: enterFirst && r === 0 ? before : ip + q, typing: true });
        insertedOrder.push(ip + q);
      });
      shift += h.ins.length - h.del;
      void at;
      clock += span;
    });
    if (p.suggest === true) addPopups(glyphs, insertedOrder, popups, target);
  }
  carets.sort((a, b) => a.t - b.t);
  const out = { glyphs, carets, popups };
  compiledCache.set(layer, out);
  return out;
}

/** Autocomplete: while a word of 3+ letters is being typed, a popup suggests it (and similar words). */
function addPopups(glyphs: Glyph[], order: number[], popups: Compiled['popups'], context: string) {
  const vocab = [...new Set(context.match(/[A-Za-z_][\w]{2,}/g) ?? [])];
  let k = 0;
  while (k < order.length) {
    if (!/[A-Za-z_]/.test(glyphs[order[k]].ch)) { k++; continue; }
    let e = k;
    while (e + 1 < order.length && /\w/.test(glyphs[order[e + 1]].ch) && order[e + 1] === order[e] + 1) e++;
    const word = order.slice(k, e + 1).map((gi) => glyphs[gi].ch).join('');
    if (word.length >= 4 && e - k >= 3) {
      const prefix = word.slice(0, 2);
      const others = vocab.filter((v) => v !== word && v.startsWith(prefix[0])).slice(0, 3);
      popups.push({ from: glyphs[order[k + 1]].at, to: glyphs[order[e]].at + 0.12, glyph: order[e], word, others });
    }
    k = e + 1;
  }
}

/* ------------------------------------------------------------------ drawing */

interface CodeParts { scroller: HTMLElement; body: HTMLElement; caret: HTMLElement; popup: HTMLElement; out: HTMLElement; notes: HTMLElement; runBtn?: HTMLElement; hl: HTMLElement }
const codeParts = new WeakMap<HTMLElement, CodeParts>();

export function buildCode(doc: Document, inner: HTMLElement, layer: CodeLayer) {
  inner.textContent = '';
  const th = THEMES[layer.theme ?? 'dark'];
  const frame = layer.frame ?? 'window';
  const fs = layer.fontSize ?? 1.5;
  const fontFamily = `${layer.fontFamily ? `"${layer.fontFamily.replace(/"/g, '')}", ` : ''}ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`;
  Object.assign(inner.style, { position: 'relative', display: 'flex', flexDirection: 'column', background: th.bg, borderRadius: `${layer.radius ?? 1}cqw`, border: `0.08cqw solid ${th.border}`, boxSizing: 'border-box', overflow: 'visible', color: th.text });
  if (frame !== 'plain') {
    const bar = doc.createElement('div');
    Object.assign(bar.style, { display: 'flex', alignItems: 'center', gap: '0.6em', padding: '0 0.9em', height: '2.4em', flex: 'none', background: th.bar, borderBottom: `0.08cqw solid ${th.border}`, borderRadius: 'inherit', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', fontFamily: 'system-ui, sans-serif', fontSize: `${fs * 0.8}cqw` });
    const dots = doc.createElement('span');
    dots.innerHTML = ['#ff5f57', '#febc2e', '#28c840'].map((c) => `<i style="display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${c};margin-right:.4em"></i>`).join('');
    bar.appendChild(dots);
    if (layer.title) {
      const tab = doc.createElement('span');
      tab.textContent = layer.title;
      Object.assign(tab.style, { padding: '0.25em 0.8em', borderRadius: '0.4em', background: th.bg, color: th.text, opacity: '0.9' });
      bar.appendChild(tab);
    }
    const spacer = doc.createElement('span');
    spacer.style.flex = '1';
    bar.appendChild(spacer);
    let runBtn: HTMLElement | undefined;
    if (layer.run) {
      runBtn = doc.createElement('span');
      runBtn.textContent = '▶ Run';
      Object.assign(runBtn.style, { padding: '0.25em 0.8em', borderRadius: '0.4em', background: '#16a34a', color: '#fff', fontWeight: '700', transformOrigin: '50% 50%' });
      bar.appendChild(runBtn);
    }
    inner.appendChild(bar);
    codeParts.set(inner, makeBody(doc, inner, th, fs, fontFamily, runBtn));
  } else codeParts.set(inner, makeBody(doc, inner, th, fs, fontFamily));
}

function makeBody(doc: Document, inner: HTMLElement, th: typeof THEMES.dark, fs: number, fontFamily: string, runBtn?: HTMLElement): CodeParts {
  const scroller = doc.createElement('div');
  Object.assign(scroller.style, { position: 'relative', flex: '1', overflow: 'hidden', fontFamily, fontSize: `${fs}cqw`, lineHeight: '1.6' });
  const hl = doc.createElement('div');
  Object.assign(hl.style, { position: 'absolute', left: '0', top: '0', right: '0', pointerEvents: 'none' });
  const body = doc.createElement('div');
  Object.assign(body.style, { position: 'relative', padding: '0.7em 0', whiteSpace: 'pre' });
  const caret = doc.createElement('i');
  Object.assign(caret.style, { position: 'absolute', width: '0.12em', height: '1.25em', background: th.caret, opacity: '0', pointerEvents: 'none' });
  const popup = doc.createElement('div');
  Object.assign(popup.style, { position: 'absolute', minWidth: '12em', background: th.bar, border: `0.08cqw solid ${th.border}`, borderRadius: '0.4em', boxShadow: '0 0.6em 1.6em rgba(0,0,0,.35)', padding: '0.3em 0', opacity: '0', pointerEvents: 'none', zIndex: '2', fontSize: '0.85em' });
  scroller.append(hl, body, caret, popup);
  const out = doc.createElement('div');
  Object.assign(out.style, { flex: 'none', overflow: 'hidden', height: '0', fontFamily, fontSize: `${fs * 0.92}cqw`, lineHeight: '1.55', background: th.bar, borderTop: `0.08cqw solid ${th.border}`, color: th.out, whiteSpace: 'pre', padding: '0 1em', borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' });
  inner.append(scroller, out);
  const notes = doc.createElement('div');
  Object.assign(notes.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'visible' });
  inner.appendChild(notes);
  return { scroller, body, caret, popup, out, notes, runBtn, hl };
}

/** Draws the Code layer at a moment of its timeline. */
export function drawCode(inner: HTMLElement, layer: CodeLayer, time: number, ease: (clip: Clip) => Ease) {
  const parts = codeParts.get(inner);
  if (!parts) return;
  const th = THEMES[layer.theme ?? 'dark'];
  const lang = langOf(layer);
  const { glyphs, carets, popups } = compileCode(layer, ease);
  const numbers = layer.lineNumbers ?? (layer.frame ?? 'window') !== 'terminal';

  // The characters on screen now, the ones selected, and new lines still opening (or closing) up.
  const shown: number[] = [];
  let text = '';
  glyphs.forEach((g, i) => {
    if (g.at <= time && g.delAt > time) { shown.push(i); text += g.ch; }
  });
  const toks = highlight(text, lang);
  const selected = shown.map((gi) => glyphs[gi].selAt <= time && glyphs[gi].delAt > time);
  // A line that is typed (or deleted) opens (or closes) over a moment, so the lines below slide.
  const OPEN = 0.16;
  const lines: Array<{ start: number; end: number; grow: number }> = [];
  let ls = 0;
  for (let k = 0; k <= text.length; k++) {
    if (k === text.length || text[k] === '\n') {
      const nl = k > 0 && ls > 0 ? glyphs[shown[ls - 1]] : null; // the newline that started this line
      const grow = nl && nl.at > -Infinity ? smooth(clamp01((time - nl.at) / OPEN)) : 1;
      lines.push({ start: ls, end: k, grow });
      ls = k + 1;
    }
  }
  // Lines whose characters were just deleted collapse rather than vanish.
  const closing: number[] = [];
  glyphs.forEach((g) => { if (g.ch === '\n' && g.delAt <= time && time < g.delAt + OPEN && g.at <= g.delAt) closing.push(1 - smooth(clamp01((time - g.delAt) / OPEN))); });

  // Which line is the caret on, and where in it.
  let caretGlyph = -1;
  let typing = false;
  let lastTyped = -Infinity;
  for (const c of carets) { if (c.t > time) break; caretGlyph = c.glyph; typing = c.typing; lastTyped = c.t; }
  const caretPos = caretGlyph < 0 ? 0 : (() => { let k = shown.indexOf(caretGlyph); if (k < 0) { k = shown.findIndex((gi) => gi > caretGlyph) - 1; if (k < -1) k = shown.length - 1; } return k + 1; })();

  // Sized for the most lines the file ever has, so the code doesn't shift when it passes 9 or 99 lines.
  const maxLines = glyphs.reduce((n, g) => n + (g.ch === '\n' ? 1 : 0), 1);
  const gutterW = numbers ? `${String(Math.max(maxLines, 9)).length + 1.6}em` : '1em';
  let html = '';
  let lineNo = 0;
  lines.forEach((ln) => {
    lineNo++;
    let row = '';
    let cur: CodeTok | null = null, curSel = false, buf = '';
    const flush = () => {
      if (!buf) return;
      const color = cur && cur !== 'plain' ? th[cur] : '';
      row += `<span style="${color ? `color:${color};` : ''}${curSel ? `background:${th.sel};` : ''}">${esc(buf)}</span>`;
      buf = '';
    };
    for (let k = ln.start; k < ln.end; k++) {
      if (k === caretPos) { flush(); row += '<b data-caret></b>'; }
      const tk = toks[k], sel = selected[k];
      if (tk !== cur || sel !== curSel) { flush(); cur = tk; curSel = sel; }
      buf += text[k];
    }
    flush();
    if (caretPos === ln.end && (ln.end === text.length || text[ln.end] === '\n')) row += '<b data-caret></b>';
    const h = `${(1.6 * ln.grow).toFixed(3)}em`;
    html += `<div data-line="${lineNo}" style="display:flex;height:${h};overflow:hidden;opacity:${ln.grow.toFixed(3)}">`
      + `<span style="flex:none;width:${gutterW};padding-right:1em;text-align:right;color:${th.gutter};user-select:none">${numbers ? lineNo : ''}</span>`
      + `<span style="flex:1">${row || ' '}</span></div>`;
  });
  for (const c of closing) html += `<div style="height:${(1.6 * c).toFixed(3)}em"></div>`;
  parts.body.innerHTML = html;

  // Run (before anything is measured: the output panel changes how tall the code view is). The button is pressed, then output lines appear in the panel below (or, in a terminal, under the text).
  const runs = layer.clips.filter((c) => c.preset === 'code-run' && time >= c.start).sort((a, b) => a.start - b.start);
  const run = runs[runs.length - 1];
  if (parts.runBtn) {
    const press = run ? clamp01(1 - Math.abs(time - run.start - 0.08) / 0.12) : 0;
    parts.runBtn.style.transform = `scale(${(1 - 0.12 * press).toFixed(3)})`;
    parts.runBtn.style.filter = press > 0 ? `brightness(${(1 + 0.4 * press).toFixed(2)})` : '';
  }
  if (run) {
    const p = run.params ?? {};
    const outLines = String(p.output ?? '').split('\n');
    const v = clamp01((time - run.start - 0.15) / Math.max(0.05, run.duration - 0.15));
    const count = Math.ceil(v * outLines.length - 1e-9);
    const shownOut = outLines.slice(0, Math.max(0, count));
    const open = smooth(clamp01((time - run.start) / 0.3));
    const rows = Math.min(outLines.length, Math.max(2, Number(p.rows ?? outLines.length)));
    parts.out.innerHTML = `<div style="padding:.6em 0">${shownOut.map((l) => `<div>${esc(l) || ' '}</div>`).join('')}</div>`;
    parts.out.style.height = `${(open * (rows * 1.55 + 1.2)).toFixed(3)}em`;
  } else { parts.out.innerHTML = ''; parts.out.style.height = '0'; }

  // The caret: solid while typing, blinking when idle; hidden before anything has been typed or after a long pause.
  const mark = parts.body.querySelector<HTMLElement>('b[data-caret]');
  const caretOn = carets.length > 0 && time >= carets[0].t - 0.4 && time <= (carets[carets.length - 1]?.t ?? 0) + (layer.caretHold ?? 1.2);
  let caretY = 0;
  if (mark && caretOn) {
    const idle = time - lastTyped > 0.45 || !typing;
    const blink = idle ? Math.floor((time - lastTyped) * 2.2) % 2 === 0 : true;
    caretY = mark.offsetTop;
    parts.caret.style.left = `${mark.offsetLeft}px`;
    parts.caret.style.top = `${mark.offsetTop + (mark.offsetHeight ? 0 : 0)}px`;
    parts.caret.style.marginTop = '0.18em';
    parts.caret.style.opacity = blink ? '1' : '0';
  } else {
    parts.caret.style.opacity = '0';
    parts.caret.style.left = '';
    parts.caret.style.top = '';
    if (mark) caretY = mark.offsetTop;
  }

  // Follow the caret: keep its line in view (worked out from where the caret was over the last moment,
  // so the scroll glides instead of jumping).
  const viewH = parts.scroller.clientHeight;
  const bodyH = parts.body.scrollHeight;
  let target = 0;
  if (bodyH > viewH && viewH > 0) target = Math.max(0, Math.min(bodyH - viewH, caretY - viewH * 0.55));
  const prev = Number(parts.scroller.dataset.scrollFor === String(time) ? parts.scroller.dataset.scroll : NaN);
  void prev;
  parts.body.style.transform = `translateY(${(-target).toFixed(1)}px)`;
  parts.caret.style.transform = `translateY(${(-target).toFixed(1)}px)`;

  // Autocomplete popup.
  const pop = popups.find((p) => time >= p.from && time < p.to);
  if (pop && mark) {
    const items = [pop.word, ...pop.others];
    parts.popup.innerHTML = items.map((w, k) => `<div style="padding:.15em .9em;${k === 0 ? `background:${th.sel};` : ''}"><span style="color:${th.fn}">ƒ</span> ${esc(w)}</div>`).join('');
    parts.popup.style.left = `${mark.offsetLeft}px`;
    parts.popup.style.top = `${mark.offsetTop - target}px`;
    parts.popup.style.marginTop = '1.7em';
    parts.popup.style.opacity = '1';
  } else { parts.popup.style.opacity = '0'; parts.popup.innerHTML = ''; parts.popup.style.left = ''; parts.popup.style.top = ''; }

  // Highlights: a band across lines, or a box around a word in a line.
  const lineEls = Array.from(parts.body.querySelectorAll<HTMLElement>('div[data-line]'));
  const hlClips = layer.clips.filter((c) => c.preset === 'code-highlight');
  const hlHtml: string[] = [];
  for (const c of hlClips) {
    const p = c.params ?? {};
    const out = p.direction === 'out';
    const v = clamp01((time - c.start) / Math.max(0.05, c.duration));
    const k = out ? 1 - v : v;
    // An "in" stays until an "out" for the same lines (later) takes it away.
    if (!out && hlClips.some((o) => o !== c && o.start > c.start && (o.params?.direction === 'out') && o.params?.line === p.line && o.params?.token === p.token && time >= o.start)) continue;
    if (k <= 0 || (out && time < c.start)) continue;
    const l1 = Math.max(1, Math.round(Number(p.line ?? 1)));
    const l2 = Math.max(l1, Math.round(Number(p.toLine ?? l1)));
    const color = typeof p.color === 'string' && p.color ? p.color : '#2ad38b';
    const a = lineEls[l1 - 1], b = lineEls[Math.min(lineEls.length, l2) - 1];
    if (!a || !b) continue;
    const top = a.offsetTop - target, bottom = b.offsetTop + b.offsetHeight - target;
    const token = typeof p.token === 'string' ? p.token : '';
    if (token) {
      // Box the nth occurrence of the word on the first line.
      const span = a.lastElementChild as HTMLElement;
      const txt = span.textContent ?? '';
      const nth = Math.max(1, Math.round(Number(p.nth ?? 1)));
      let at = -1;
      for (let q = 0; q < nth; q++) { at = txt.indexOf(token, at + 1); if (at < 0) break; }
      if (at < 0) continue;
      const range = inner.ownerDocument.createRange();
      const hit = locate(span, at, at + token.length, range);
      if (!hit) continue;
      const sr = parts.scroller.getBoundingClientRect();
      const kx = parts.scroller.clientWidth / (sr.width || 1);
      const rr = range.getBoundingClientRect();
      const x = (rr.left - sr.left) * kx, y = (rr.top - sr.top) * kx, w = rr.width * kx, h = rr.height * kx;
      const pad = 3;
      hlHtml.push(`<div style="position:absolute;left:${(x - pad).toFixed(1)}px;top:${(y - pad).toFixed(1)}px;width:${(w + 2 * pad).toFixed(1)}px;height:${(h + 2 * pad).toFixed(1)}px;border:2px solid ${color};border-radius:4px;background:color-mix(in srgb, ${color} 18%, transparent);opacity:${k.toFixed(3)};transform:scale(${(0.9 + 0.1 * k).toFixed(3)})"></div>`);
    } else {
      hlHtml.push(`<div style="position:absolute;left:0;right:0;top:${top.toFixed(1)}px;height:${(bottom - top).toFixed(1)}px;background:color-mix(in srgb, ${color} 16%, transparent);border-left:3px solid ${color};transform-origin:0 50%;transform:scaleX(${k.toFixed(3)})"></div>`);
    }
  }
  parts.hl.innerHTML = hlHtml.join('');

  // Notes: pills beside a line, with a short connector to it.
  const noteHtml: string[] = [];
  for (const c of layer.clips.filter((x) => x.preset === 'code-note')) {
    const p = c.params ?? {};
    const out = p.direction === 'out';
    if (!out && layer.clips.some((o) => o.preset === 'code-note' && o !== c && o.start > c.start && o.params?.direction === 'out' && o.params?.line === p.line && time >= o.start)) continue;
    const v = clamp01((time - c.start) / Math.max(0.05, c.duration));
    const k = out ? 1 - v : v;
    if (k <= 0 || (out && time < c.start)) continue;
    const ln = lineEls[Math.max(1, Math.round(Number(p.line ?? 1))) - 1];
    if (!ln) continue;
    const color = typeof p.color === 'string' && p.color ? p.color : '#2ad38b';
    const y = parts.scroller.offsetTop + ln.offsetTop - target + ln.offsetHeight / 2;
    const side = p.side === 'left' ? 'left' : 'right';
    const e = smooth(k);
    noteHtml.push(`<div style="position:absolute;top:${y.toFixed(1)}px;${side === 'right' ? 'left' : 'right'}:100%;display:flex;align-items:center;${side === 'left' ? 'flex-direction:row-reverse;' : ''}opacity:${e.toFixed(3)};transform:translate(${((1 - e) * (side === 'left' ? 12 : -12)).toFixed(1)}px,-50%)">`
      + `<i style="display:block;width:2.4cqw;height:0;border-top:0.15cqw dashed ${color}"></i>`
      + `<span style="white-space:nowrap;font:600 ${((layer.fontSize ?? 1.5) * 0.9).toFixed(2)}cqw/1.2 system-ui,sans-serif;color:${th.text};background:${th.bar};border:0.15cqw solid ${color};border-radius:99em;padding:.45em .9em">${esc(String(p.text ?? ''))}</span></div>`);
  }
  parts.notes.innerHTML = noteHtml.join('');
}

/** Finds the text range [a, b) inside an element (across its spans) and sets `range` to it. */
function locate(root: HTMLElement, a: number, b: number, range: Range): boolean {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0, startSet = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.textContent?.length ?? 0;
    if (!startSet && a < pos + len) { range.setStart(n, a - pos); startSet = true; }
    if (startSet && b <= pos + len) { range.setEnd(n, b - pos); return true; }
    pos += len;
  }
  return false;
}
