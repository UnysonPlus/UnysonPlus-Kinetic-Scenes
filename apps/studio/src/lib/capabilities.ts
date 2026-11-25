/**
 * What Kinetic Scenes can do, in people's words: the list behind the start box's "Did you know?" tips and
 * Help › What Kinetic Scenes can do. One entry per thing someone would want, not per preset (the preset library
 * already lists those). Each says what it is, offers a "Show me" (an action in the Studio) where there is one, a
 * prompt to give an AI agent, and its manual page. `video` is the YouTube id of its short once it is published:
 * the tip then shows the video; until then it shows the words.
 *
 * Add an entry when a feature ships (with its What's new item). Keep `title` short and `text` to one or two sentences.
 */

export type CapabilityAction =
  | 'start' | 'website' | 'highlights' | 'like' | 'sheet' | 'recording' | 'templates' | 'paper'
  | 'mascot' | 'device' | 'translate' | 'listen' | 'physics' | 'swarm' | 'export' | 'styles' | 'stock' | 'music';

export interface Capability {
  id: string;
  group: string;
  title: string;
  text: string;
  /** What to ask an AI agent (Claude through the AI Dev Kit, or AI assist). */
  prompt?: string;
  /** Opens the part of the Studio that does it. */
  action?: CapabilityAction;
  /** The manual page, relative to the Kinetic Scenes docs. */
  doc: string;
  /** Needs the free AI Dev Kit running on this computer. */
  kit?: boolean;
  /** The YouTube id of its short, once published. */
  video?: string;
}

export const CAPABILITY_GROUPS = [
  'Let the AI make it', 'Voice, music and sound', 'People on camera', 'Pictures, footage and 3D', 'Looks and styles',
  'Products and websites', 'Finish and share',
] as const;

export const CAPABILITIES: Capability[] = [
  // Let the AI make it
  { id: 'describe', group: 'Let the AI make it', title: 'Describe it, get a scene', text: 'Type an idea and your AI builds the whole scene on the timeline: layers, moves, timing and sound, ready to change by hand.', prompt: 'Make a 30-second vertical reel about why backups matter, in the Data story style.', action: 'start', doc: 'ai' },
  { id: 'website', group: 'Let the AI make it', title: 'Turn a website into a video', text: 'Give it an address: the video uses the site’s real words, colours, fonts and screenshots.', prompt: 'Make a 45-second product video from example.com, focused on the pricing.', action: 'website', doc: 'ai' },
  { id: 'highlights', group: 'Let the AI make it', title: 'Cut a long video into a reel', text: 'The AI Dev Kit watches a long video, finds the best moments and cuts them together to the length you ask.', prompt: 'Cut my 20-minute talk into a 45-second reel with captions.', action: 'highlights', doc: 'make-a-reel', kit: true },
  { id: 'like-this', group: 'Let the AI make it', title: 'Make one like a video you like', text: 'Show it a video: it studies the rhythm, the cuts and the look, and makes yours the same way with your own words.', prompt: 'Make a reel about my bakery with the same rhythm as this video.', action: 'like', doc: 'reference-rhythm', kit: true },
  { id: 'sheet', group: 'Let the AI make it', title: 'A video for every row of a spreadsheet', text: 'One design, filled from a spreadsheet: a video per product, per city or per customer, all made in one go.', action: 'sheet', doc: 'batch-videos' },
  { id: 'beats', group: 'Let the AI make it', title: 'A reel from a few lines', text: 'Write the shape of a reel as a short list (a headline, a photo, a split, a list, a closing frame) and the whole branded scene is built from it.', prompt: 'Make a reel for my café from these beats: a headline, three photos, the menu as a list and a closing frame.', doc: 'beats' },
  { id: 'templates', group: 'Let the AI make it', title: 'Start from a finished template', text: 'Heroes, promos, explainers, title cards and more: change the words and the colours and it is yours.', action: 'templates', doc: 'templates' },
  { id: 'agent', group: 'Let the AI make it', title: 'Let Claude build it while you watch', text: 'Connect Claude (or another agent) through the AI Dev Kit: it makes the project, checks every frame and gives you a link to preview it.', prompt: 'Make a 60-second explainer about how our app works, check it, and give me the preview link.', doc: 'ai-agents', kit: true },
  { id: 'paper', group: 'Let the AI make it', title: 'A paper cut-out explainer', text: 'Layered construction-paper scenes with torn edges and cuts that tear: one sentence in, a whole explainer out.', prompt: 'Make a paper cut-out explainer about how coffee gets from the farm to the cup.', action: 'paper', doc: 'paper-cut-out' },

  // Voice, music and sound
  { id: 'voice', group: 'Voice, music and sound', title: 'A voice-over, even in your own voice', text: 'The AI writes the script and records it in a built-in voice or a clone of yours; the scene times itself to the words.', prompt: 'Write and record a voice-over for this scene in my voice, and time everything to it.', doc: 'sound', kit: true },
  { id: 'captions', group: 'Voice, music and sound', title: 'Captions, word by word', text: 'Captions follow the voice-over exactly, a few words at a time with the spoken word lit, in any font and colour.', prompt: 'Add bold word-by-word captions to the voice-over, keywords in yellow.', doc: 'word-pins' },
  { id: 'word-pins', group: 'Voice, music and sound', title: 'Moves that land on a word', text: 'Pin any move to a word of the voice-over: the number pops on "forty", the logo lands on "free", even after the voice changes.', prompt: 'Make the price pop in exactly when I say "free".', doc: 'word-pins' },
  { id: 'music', group: 'Voice, music and sound', title: 'Music that moves with the scene', text: 'Use your own track or make one with the free music add-on: it drops under the voice by itself, and its beats are found so moves can land on them.', prompt: 'Add upbeat music at 25% and land the big moves on its beats.', action: 'music', doc: 'sound' },
  { id: 'sfx', group: 'Voice, music and sound', title: 'Sound effects that suit each move', text: '29 built-in sounds (whooshes, pops, stamps, typing) made in code, so there is nothing to license: Add suggested sounds puts the right one on every move.', doc: 'sound' },
  { id: 'listen', group: 'Voice, music and sound', title: 'A second listener for the voice', text: 'The voice-over is transcribed and checked against the script, so a slipped word is caught before you post.', action: 'listen', doc: 'second-listener', kit: true },
  { id: 'translate', group: 'Voice, music and sound', title: 'Translate a whole scene', text: 'Every word on screen translated into another language, with the layout kept, ready for a new voice-over.', prompt: 'Translate this scene into Spanish and record a Spanish voice-over.', action: 'translate', doc: 'translate' },

  // People on camera
  { id: 'cutout-person', group: 'People on camera', title: 'Cut the person out of your video', text: 'Your talking-head video with the background removed, frame by frame: put titles, graphics and effects behind you.', prompt: 'Cut me out of this video and put a giant word behind my head.', doc: 'video-effects#cut-out-the-person', kit: true },
  { id: 'follow-face', group: 'People on camera', title: 'Graphics that follow your face', text: 'Your face is found in the footage, and labels, doodles, circles or brackets stay on it as you move.', prompt: 'Put lock-on brackets on my face with the label "THE EXPERT".', doc: 'video-effects#follow-the-face', kit: true },
  { id: 'talking-head', group: 'People on camera', title: 'Reel effects for talking heads', text: 'Freeze frame with a drawn arrow, Split push, Stamp, Tape label, LED sign behind you, a room that tunnels away, and more.', prompt: 'Freeze on my face when I say "wait", with an arrow and the note "this part".', doc: 'video-effects#effects-on-a-person' },
  { id: 'pieces', group: 'People on camera', title: 'Ready-made reel pieces', text: 'Comment boxes, follow buttons, notifications, glass widgets, a profile grid, a card carousel, keyboard rain: 39 pieces to drop in.', prompt: 'Add the Notifications piece at 3 seconds with my own app’s messages.', doc: 'video-effects#ready-made-pieces' },
  { id: 'mascot', group: 'People on camera', title: 'A mascot that talks', text: 'Turn a picture into a character that talks on your voice-over, blinks and changes pose on the words you choose.', prompt: 'Make a mascot from my logo and have it present this scene.', action: 'mascot', doc: 'mascots' },

  // Pictures, footage and 3D
  { id: 'stock', group: 'Pictures, footage and 3D', title: 'Free photos and footage', text: 'Search free stock photos and video clips that allow commercial use, right from the Studio, with the licence noted for you.', prompt: 'Find free footage of a busy city at night for the opening shot.', action: 'stock', doc: 'stock-media' },
  { id: 'photo-cutout', group: 'Pictures, footage and 3D', title: 'Lift an object off its photo', text: 'Cut a dish, a product or a person out of a photo and float it, lift it or turn it into a sticker.', prompt: 'Cut the coffee cup out of this photo and make it float.', doc: 'photo-cutouts', kit: true },
  { id: 'devices', group: 'Pictures, footage and 3D', title: 'Your screen on a 3D phone or laptop', text: 'A generic 3D phone, tablet, laptop or monitor plays your screen recording, turning and tumbling with the scene.', prompt: 'Put my app recording on a 3D phone that tumbles in and turns.', action: 'device', doc: 'layers#3d-devices' },
  { id: 'blender', group: 'Pictures, footage and 3D', title: 'Real 3D models with Blender', text: 'Your AI builds a 3D model in Blender (a product, a prop, an icon), checks it and puts it in the scene, ready to spin.', prompt: 'Make a 3D model of a coffee mug in Blender and spin it in.', doc: 'blender', kit: true },
  { id: 'stills', group: 'Pictures, footage and 3D', title: 'Path-traced 3D stills', text: 'A 3D layer rendered for real (soft shadows, true reflections) for the cover image and for visitors who turn motion off.', doc: 'layers#path-traced-stills', kit: true },
  { id: 'physics', group: 'Pictures, footage and 3D', title: 'Things that fall and bounce', text: 'Drop letters, icons or products with real physics: they fall, bounce and pile up, and replay the same every time.', action: 'physics', doc: 'sketch-and-physics' },
  { id: 'swarm', group: 'Pictures, footage and 3D', title: 'A team of cursors builds it', text: 'Coloured, named cursors build the opening of your scene (boxes drawn with size badges, words typed in), then leave and the scene plays on.', action: 'swarm', doc: 'build-with-cursors' },

  // Looks and styles
  { id: 'styles', group: 'Looks and styles', title: '55 styles, from chalkboard to synthwave', text: 'Pick a look (Stick figure, Voxel build, Watercolour, Newsreel, Thermal camera…) and the colours, fonts, moves and sounds follow.', prompt: 'Remake this scene in the Chalkboard style.', action: 'styles', doc: 'motion-styles' },
  { id: 'restyle', group: 'Looks and styles', title: 'Restyle anything', text: 'Turn footage or a picture into a silhouette, pixel art, a line drawing, low poly, risograph print or engraving.', prompt: 'Turn my footage into a line drawing for the intro.', doc: 'restyle-effects' },
  { id: 'painted', group: 'Looks and styles', title: 'Painted and hand-drawn', text: 'Real brush strokes, watercolour washes, pencil scribbles and boiling lines, painted on as the scene plays.', doc: 'painted' },
  { id: 'brand', group: 'Looks and styles', title: 'Your brand on everything', text: 'Save your colours, fonts and logo once: every new scene and template uses them.', doc: 'style-library#on-the-start-screen' },

  // Products and websites
  { id: 'screencast', group: 'Products and websites', title: 'Product tours from a screen recording', text: 'A recording of your app becomes a tour: zooms into what matters, a cursor that clicks, callouts and a voice-over.', prompt: 'Make a 40-second tour of my app from this screen recording.', action: 'recording', doc: 'screencasts' },
  { id: 'cursor', group: 'Products and websites', title: 'A cursor that clicks and types', text: 'A cursor that moves to buttons, clicks, drags and types, for app demos built without a recording.', doc: 'tours' },
  { id: 'charts', group: 'Products and websites', title: 'Charts, counters and code', text: 'Numbers that count up, bars that grow, lines that draw, flip clocks, and code that types itself and runs.', prompt: 'Show our growth from 1,200 to 48,000 users as a line that draws, with a counter.', doc: 'presets' },
  { id: 'on-site', group: 'Products and websites', title: 'Animated heroes for your website', text: 'A scene plays on your site as light HTML, not a heavy video file: its words stay readable by search engines and it fits every screen.', doc: 'on-your-pages' },

  // Finish and share
  { id: 'check', group: 'Finish and share', title: 'Check the scene for you', text: 'Check scene finds overlaps, text off the edge, things too fast to read, heavy 3D and more, with one-click fixes.', doc: 'check-scene' },
  { id: 'export', group: 'Finish and share', title: 'Export a video or a web page', text: 'An MP4 (or WebM, ProRes) in every shape at once for YouTube, Reels and TikTok, with a cover image; or a web page or embed with the scene in it.', action: 'export', doc: 'export' },
  { id: 'long', group: 'Finish and share', title: 'Long videos in chapters', text: 'Scenes up to an hour, or a long video as chapters that join into one file, with the chapter list for YouTube.', doc: 'long-videos' },
  { id: 'video-check', group: 'Finish and share', title: 'A last look before posting', text: 'The finished video is checked before you get it: every voice line heard, no stray black frames, the loudness right for social video, no distorted peaks.', doc: 'video-checks#the-video-check-after-a-render', kit: true },
];

const SEEN = 'upw-tips-seen';
const OFF = 'upw-tips-off';

/** The tip for this visit: one not yet shown (those with a video first), then the cycle starts again. */
export function nextTip(): Capability {
  let seen: string[] = [];
  try { seen = JSON.parse(localStorage.getItem(SEEN) || '[]'); } catch { /* private window */ }
  let left = CAPABILITIES.filter((c) => !seen.includes(c.id));
  if (!left.length) { seen = []; left = CAPABILITIES; }
  const withVideo = left.filter((c) => c.video);
  const pool = withVideo.length ? withVideo : left;
  const tip = pool[Math.floor(Math.random() * pool.length)];
  try { localStorage.setItem(SEEN, JSON.stringify([...seen, tip.id])); } catch { /* private window */ }
  return tip;
}

export function tipsOff(): boolean { try { return localStorage.getItem(OFF) === '1'; } catch { return false; } }
export function setTipsOff(off: boolean) { try { if (off) localStorage.setItem(OFF, '1'); else localStorage.removeItem(OFF); } catch { /* private window */ } }
