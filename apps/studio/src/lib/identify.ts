import { kitBase } from './ai';
import { fileData } from './separate';

/**
 * Sound identification in the AI Dev Kit: names the sounds in a clip (speech, music, applause, a door slam, rain…) and
 * when each is heard, with CLAP on this computer. Times are in the clip's own file (add the clip's start, less its trim,
 * for scene time).
 */

export interface SoundStretch { start: number; end: number; label: string; score: number }
export interface SoundsFound { seconds: number; overall: { label: string; score: number }[]; segments: SoundStretch[] }

async function call(path: string, init?: RequestInit) {
  const b = await kitBase();
  if (!b) throw new Error('Start the AI Dev Kit on this computer first.');
  const r = await fetch(`${b}${path}`, init);
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && path === '/studio/clap') throw new Error('Your AI Dev Kit is too old for this. Close it and start it again: it updates itself.');
  if (!r.ok) throw new Error(j.error || `The AI Dev Kit answered ${r.status}.`);
  return j;
}

const stopped = () => Object.assign(new Error('Stopped.'), { name: 'AbortError' });

export async function identifySounds(src: string, onStep: (s: string) => void, signal?: AbortSignal): Promise<SoundsFound> {
  const st = await call('/studio/clap');
  if (!st.installed) {
    if (!window.confirm(`Sound identification downloads about ${st.mb ?? 560} MB to the AI Dev Kit, once. It then runs offline on this computer. Download it now?`)) throw stopped();
    await call('/studio/clap/install', { method: 'POST' });
    for (;;) {
      await new Promise((r) => setTimeout(r, 1500));
      if (signal?.aborted) throw stopped();
      const s = await call('/studio/clap');
      if (s.install?.state === 'error') throw new Error(s.install.error);
      onStep(s.install?.step ?? 'Installing');
      if (s.installed) break;
    }
  }
  onStep('Reading the sound');
  const { id } = await call('/studio/clap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ src: await fileData(src) }), signal });
  for (;;) {
    await new Promise((r) => setTimeout(r, 1000));
    if (signal?.aborted) throw stopped();
    const s = await call(`/studio/clap/${id}`, { signal });
    if (s.state === 'error') throw new Error(s.error);
    onStep(s.total ? `${s.step} (${Math.round((s.done / s.total) * 100)}%)` : s.step);
    if (s.state === 'done') return s.result;
  }
}
