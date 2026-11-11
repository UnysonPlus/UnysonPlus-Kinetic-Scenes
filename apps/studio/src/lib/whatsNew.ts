/**
 * What's new: the list behind Help › What's new and the start screen. Add new features at the top and change NEWS_ID:
 * that brings the New tags back for everyone until they open the list.
 */
export type NewsAction = 'listen' | 'physics' | 'paper' | 'swarm';
export interface NewsItem { id: string; title: string; /** A few words for the start screen. */ short: string; text: string; doc: string; action?: NewsAction }

const DOCS = 'https://docs.unysonplus.com/kinetic-scenes/';

export const NEWS_ID = '2026-11-12';

export const WHATS_NEW: NewsItem[] = [
  { id: 'talking-head', title: 'Talking-head effects', short: 'Code body, manga ink, blow away and more', text: 'New effects for a person on camera: turn them into code, a banknote engraving or a manga impact frame, blow them away into grains, put clones of them in a row, run words round their head, rack the focus and explode a frame into its layers. Plus new pieces: a voice note, a phone keyboard that predicts the next word, a newspaper front page, a banknote and a day dial. Cut the person out of the footage first.', doc: `${DOCS}video-effects#effects-on-a-person` },
  { id: 'screencast-narration', title: 'Narrated screencasts', short: 'Voice-over and a written guide from one take', text: 'Record a product demo with the AI Dev Kit and it writes the voice-over for you, a line per step that fits before the next one, in English or another language. It speaks each line, checks it, and also writes a step-by-step guide with a picture of every step, ready for a help page or a blog post.', doc: `${DOCS}screencasts#the-voice-over-and-a-written-guide-from-the-same-take` },
  { id: 'long-videos', title: 'Long videos', short: 'Chapters, looping music, smoother playback', text: 'Make videos longer than a reel: tick Loop on a music clip and it repeats to the end of the scene, render each chapter, and the AI Dev Kit joins them into one video with the YouTube chapter list written for you. Long, busy scenes also play much more smoothly while you edit.', doc: `${DOCS}long-videos` },
  { id: 'painted', title: 'Painted', short: 'Real watercolour, pencil and ink', text: 'Paint shapes and lines with real brushes: a pencil, ink, marker, charcoal, crayon or pastel outline over a watercolour wash, a flat wash or hatching, with the grain of the paper and soft bleeding edges. Turn on Paint on and it is painted in front of the viewer. Select a shape or a line and click Paint it.', doc: `${DOCS}painted` },
  { id: 'swarm', title: 'Build with cursors', short: 'A team of cursors builds your scene', text: 'A team of coloured, named cursors builds the opening of your scene in front of the viewer, like collaborators in a shared design file: each box is dragged out with its size showing, each line of text is typed in. Then they leave and the scene plays on. Everything is ordinary layers and clips you can edit.', doc: `${DOCS}build-with-cursors`, action: 'swarm' },
  { id: 'ffmpeg', title: 'FFmpeg, installed for you', short: 'One click when a video needs it', text: 'Video export, footage and captions need the free tool FFmpeg. If it isn\'t on your computer, Kinetic Scenes now tells you at the moment it is needed, and the AI Dev Kit can install it with one click, or you can follow the direct link. Your AI agent can install it too.', doc: `${DOCS}ffmpeg` },
  { id: 'styles', title: 'All 30 styles, moving', short: 'Hover a style below to watch it', text: 'Every style is now on the start screen with a preview that plays when you hover over it. Pick one to start something in it.', doc: `${DOCS}start-screen#start-from-a-style` },
  { id: 'listener', title: 'Second listener', short: 'Notes on your voice-over before you render', text: 'Before you render, Gemini hears your scene and gives timed notes on how it comes across. Needs the AI Dev Kit and your own free key.', doc: `${DOCS}second-listener`, action: 'listen' },
  { id: 'physics', title: 'Drop with physics', short: 'Layers that fall and pile up', text: 'Select some layers and they fall, bounce and pile up like real objects.', doc: `${DOCS}sketch-and-physics`, action: 'physics' },
  { id: 'hand-drawn', title: 'Hand-drawn shapes', short: 'Pencil lines and scribbled fills', text: 'Select a shape and click Make it hand-drawn for wobbly pencil lines and scribbled fills.', doc: `${DOCS}sketch-and-physics` },
  { id: 'paper', title: 'Paper cut-out explainers', short: 'Ideas told in cut paper', text: 'Any idea acted out in a small world of cut paper.', doc: `${DOCS}paper-cut-out`, action: 'paper' },
];

const KEY = 'upw-news-seen';

/** Whether there is news this person hasn't opened. */
export const newsUnseen = (seen: string | null) => seen !== NEWS_ID;

export function readNewsSeen(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function markNewsSeen() {
  try { localStorage.setItem(KEY, NEWS_ID); } catch { /* private window */ }
}
