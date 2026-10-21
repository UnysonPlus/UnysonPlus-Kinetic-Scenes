import type { AudioClip, Scene } from '@unysonplus/scene-player/types';
import { clipWords } from './transcribe';

/**
 * Making a scene from a voice-over. The transcription gives every word its time and emphasis; here the
 * words are grouped into beats (the phrases the voice says between pauses and sentence ends), and the AI
 * gets them with the delivery and a brief on how kinetic type follows a voice. The AI decides what to
 * show and how it moves; the timing comes from the voice.
 */

export interface Beat {
  start: number;
  end: number;
  text: string;
  /** Strongly said words in the beat. */
  strong: Array<{ w: string; at: number }>;
  /** Silence before the beat, in seconds. */
  pause: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;
const FILLER = /^(uh+|um+|erm|hmm+|ah+|ugh)[,.!?]*$/i;

/** The voice-over's beats on the scene's clock (fillers like "uh" dropped). */
export function voiceBeats(clip: AudioClip): Beat[] {
  const words = clipWords(clip).filter((w) => !FILLER.test(w.w));
  const beats: Beat[] = [];
  let cur: typeof words = [];
  const flush = (pause: number) => {
    if (!cur.length) return;
    const last = cur[cur.length - 1];
    beats.push({
      start: r2(cur[0].at),
      end: r2(last.at + last.d),
      text: cur.map((w) => w.w).join(' '),
      strong: cur.filter((w) => (w.s ?? 0) >= 0.75).map((w) => ({ w: w.w.replace(/[,.!?;:]+$/, ''), at: r2(w.at) })),
      pause: r2(pause),
    });
    cur = [];
  };
  let pauseBefore = words[0]?.at ?? 0;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const gap = prev ? w.at - (prev.at + prev.d) : 0;
    const span = cur.length ? w.at + w.d - cur[0].at : 0;
    const prevText = prev?.w ?? '';
    const breakHere = cur.length > 0 && (
      gap >= 0.35
      || /[.!?]["')\]]*$/.test(prevText)
      || (/[,;:]$/.test(prevText) && cur.length >= 4)
      || cur.length >= 7
      || span > 3.2
    );
    if (breakHere) { flush(pauseBefore); pauseBefore = Math.max(0, gap); }
    cur.push(w);
  });
  flush(pauseBefore);
  return beats;
}

/** The beats as compact text for the AI (one line each). */
export function beatsText(beats: Beat[]): string {
  return beats.map((b) => {
    const strong = b.strong.length ? `  STRONG: ${b.strong.map((s) => `${s.w}@${s.at}`).join(', ')}` : '';
    const pause = b.pause >= 0.6 ? `  (pause ${b.pause}s before)` : '';
    return `${b.start}-${b.end}: "${b.text}"${strong}${pause}`;
  }).join('\n');
}

const MOOD: Record<string, string> = {
  energetic: 'snappy and punchy: short entrances (0.25-0.45 s), hard cuts between beats, slams and pops on the strong words',
  expressive: 'dynamic: vary scale and weight with the voice, big type on the strong words, a few held moments',
  calm: 'gentle and spacious: fades, soft wipes and slow rises, longer holds, no slams',
  even: 'clean and steady: consistent entrances, clear hierarchy, few accents',
  conversational: 'friendly and clear: rises and slides, light accents on the strong words',
};

/** The brief: how to turn the beats into kinetic type that follows the voice. */
export function voiceBrief(clip: AudioClip, beats: Beat[]): string {
  const sp = clip.speech ?? {};
  const mood = (sp.delivery ?? []).map((d) => MOOD[d]).filter(Boolean)[0] ?? MOOD.conversational;
  const end = beats.length ? beats[beats.length - 1].end : clip.start;
  return `VOICE-OVER SCENE (this request): the scene is built ON a voice-over that is already on the timeline. The request's "context" lists the voice's BEATS: "start-end: "words"" in scene seconds, with the STRONG (most emphasised) words and their times, and pauses.
- Make kinetic typography that follows the voice. For each beat show its KEY words, usually 1-5 (the words that carry the meaning, not the whole sentence: this is not captions). Merge short beats that belong together; skip filler.
- TIMING IS THE VOICE, AND THE PICTURE LEADS: a reveal FINISHES on its word (the entrance starts its own length before the word, so the words have landed as they are heard: the viewer sees, then hears). On a punchline (a STRONG word) land it 0.05-0.1 s before the word. Never show a beat's words more than about half a second before they are said. Each beat's text leaves (or is replaced) as the next beat starts, so at most two text layers are on screen at once.
- STRONG words: give them the biggest type or the accent colour, and land a hit exactly on their time (a slam, pop, scale or recolour landing at the word's time, with a clip "sound" such as impact, pop or thud at "at": "end" or start so the sound falls on the word).
- A pause of 0.6 s or more is a change of idea: use a transition there (a wipe, a soft-wipe, a whoosh exit) or a held frame. The biggest idea gets the biggest moment; a riser can lead into it.
- Delivery: ${(sp.delivery ?? ['conversational']).join(', ')}, ${sp.wpm ? `${sp.wpm} words a minute` : 'unknown pace'}. Make the motion ${mood}.
- Keep the voice the star: sounds sparse (about one per 1.5-3 s, volume 0.5-0.8), on strong words and transitions only.
- Lay text out large and centred (or in a strong layout per beat), always inside the safe area, at least the minimum sizes. A background shape or slow ambient motion can run underneath the whole scene.
- The scene lasts until the voice ends plus about 0.6 s: duration ${Math.ceil((end + 0.6) * 10) / 10}. Do not loop ("loop": false). Do not add, remove or change "audio".
- Name layers after their words. Use "start"/"end" on layers (or exit clips) so each layer is only there for its beat.`;
}

/** The request the user sees in the chat. */
export function voiceRequest(clip: AudioClip): string {
  return `Make a scene from the voice-over "${clip.name ?? clip.id}": kinetic type timed to the words, with matching motion and sound.`;
}

/** The scene given to the AI: the stage and the voice-over, an empty timeline as long as the voice. */
export function voiceBase(scene: Scene, clip: AudioClip, beats: Beat[]): Scene {
  const end = beats.length ? beats[beats.length - 1].end : clip.start + 5;
  return {
    ...scene,
    duration: Math.max(scene.duration, Math.ceil((end + 0.6) * 10) / 10),
    layers: [],
    markers: undefined,
    playback: { ...scene.playback, loop: false },
  };
}

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/**
 * The picture leads the voice: each text layer's entrance is moved (at most 0.45 s) so it finishes on the
 * word it shows, or a touch before it when the word is said with emphasis. Applied to scenes made from a
 * voice-over, after the AI has built them, so the timing is exact whatever the AI estimated.
 */
export function landOnWords(scene: Scene, clip: AudioClip): Scene {
  const words = clipWords(clip).filter((w) => !FILLER.test(w.w));
  if (!words.length) return scene;
  const used = new Set<number>();
  const walk = (list: Scene['layers'], offset: number): Scene['layers'] => list.map((l) => {
    if (l.type === 'group') return { ...l, layers: walk(l.layers, offset + (l.start ?? 0)) };
    if (l.type !== 'text') return l;
    const first = norm(l.text.split(/\s+/)[0] ?? '');
    const entrance = [...l.clips].filter((c) => c.params?.direction !== 'out').sort((a, b) => a.start - b.start)[0];
    if (!first || !entrance) return l;
    const start = offset + entrance.start;
    const end = start + entrance.duration;
    // The spoken word this text begins with, nearest to where the AI put the entrance.
    let pick = -1;
    words.forEach((w, i) => {
      if (used.has(i) || norm(w.w) !== first || w.at < start - 0.8 || w.at > end + 1.2) return;
      if (pick < 0 || Math.abs(w.at - end) < Math.abs(words[pick].at - end)) pick = i;
    });
    if (pick < 0) return l;
    used.add(pick);
    const w = words[pick];
    const lead = (w.s ?? 0) >= 0.75 ? 0.07 : 0;
    const shift = (w.at - lead) - end;
    if (Math.abs(shift) < 0.02 || Math.abs(shift) > 0.45) return l;
    const nextStart = Math.max(0, Math.round((entrance.start + shift) * 1000) / 1000);
    // Keep the layer there for its own entrance.
    const layerStart = l.start !== undefined && offset + l.start > offset + nextStart ? nextStart : l.start;
    return { ...l, start: layerStart, clips: l.clips.map((c) => (c.id === entrance.id ? { ...c, start: nextStart } : c)) };
  });
  return { ...scene, layers: walk(scene.layers, 0) };
}
