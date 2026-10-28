# Motion rules

The rules the Studio's own AI follows (Studio 0.1.2).

```text
TIMING
- A single move takes about 0.3-0.5 s. Opacity alone is a helper (0.15-0.3 s), not the move: things should arrive by moving, scaling or unmasking, with the fade underneath.
- Exits are new motion, faster than the entrance and accelerating out ("accelExit"), never the entrance played backwards. If you leave "ease" out on an exit, the Studio already uses accelExit.
- Things land by slowing down (softLand, snapSettle, glide, whip) and leave by speeding up (accelExit, gentleIn, crashOut).
- Nothing grows from nothing: a pop or zoom starts at about 0.5 or larger, or arrives from slightly bigger (1.1-1.4) and settles down.
- At most one visible spring or overshoot (popOver, crashIn, bounceHard, back.*) per scene, on the thing that matters most.

STAGGER AND RHYTHM
- Keep the text presets' rhythm "natural" (uneven gaps); even gaps read as mechanical.
- Stagger letters 0.02-0.04 s and words 0.07-0.15 s; a whole staggered line should land in about 0.4-0.9 s.
- Leave a little more time (1.5-2 times the gap) before the word or element that pays the message off.
- Not everything enters the same way: give the headline the strongest entrance, and supporting text and shapes quieter ones that start slightly after it.

READING AND HOLDS
- Once a text layer has fully landed it stays readable (no exit started) for at least 0.3 s per word, and never less than 0.8 s.
- A held frame should not sit completely still for more than about 1.5 s: a slow "float" (height 2-4, one cycle) keeps it alive.
- In a looping scene, the end is a calm resolved frame or a clean exit of everything, so the loop restarts without a jump.

TYPE
- Hierarchy by size, not by many weights: one family, the headline 2-4 times the size of the supporting text.
- Text must be at least about 12 px on screen at every breakpoint: a font size (in stage units) of at least 1.2 on desktop and 3.3 on a 360 px phone stage.
- Type letter by letter (text-typewriter) only for small text such as a search box or a prompt, never a headline.

KEYFRAMES (for a path or a combination no preset covers)
- A "keyframes" clip takes "params": { "frames": [ { "t": <s into the clip>, "x"?, "y"? (% of the layer's own size), "scale"?, "rotate"? (deg), "opacity"?, "blur"?, "ease"? } ] }.
- Each property moves only between the keyframes that set it and holds its first value before them. A keyframe's "ease" shapes the move into it: a named ease, or a custom curve "cubic(x1,y1,x2,y2)" (as CSS cubic-bezier; y outside 0-1 overshoots or pulls back).
- Prefer presets; use keyframes for multi-step moves (drift then settle, a small arc), with 2-5 keyframes.

3D LAYERS (only when the request asks for 3D)
- A layer { "type": "model", "model": { "kind": "text" | "shape", "text"?: "...", "shape"?: "box" | "sphere" | "torus" | "knot" | "cylinder" | "crystal", "depth"?: 0.35, "bevel"?: 0.45 }, "material": { "color": "#...", "finish": "matte" | "satin" | "glossy" | "metal" | "chrome" }, "pose": { "rx": 8, "ry": -20 }, "alt": "...", "box": { "x", "y", "w", "ratio" } }.
- Animate it with the 3D presets (tumble-in, spin-3d, orbit-3d, camera-push) plus any whole-layer preset (fade, slide, pop…). One 3D object per scene is plenty; keep 3D text short (one to three words).

SCROLL-LINKED SCENES
- Use "playback": { "trigger": "scroll", "loop": false, "scroll": { "pin": true, "length": 1.5, "smooth": 0.4 } } only when the request asks for the animation to follow the page scroll (scroll-driven, scrubbed, pinned, "as you scroll").
- Then the visitor's scrolling sets the pace: build one continuous sequence (things enter, transform, and the last state holds), not a loop. "length" is how many window heights of scrolling it takes while pinned (1-3); keep the scene 3-8 s long so each scroll step moves something.

CAMERA (the whole view)
- "camera": { "keys": [ { "id", "t" (scene seconds), "x"?, "y"? (pan: the view's centre moves this far right/down, % of the stage), "zoom"? (1 = as laid out), "tiltX"?, "tiltY"? (perspective tilt, degrees), "roll"? (degrees), "ease"? (the curve into this key) } ] }.
- Each property moves between the keys that set it and holds its first value from the start, so give the first key every property you later animate (e.g. "tiltX": 0 before a tilt).
- Use it for the big gestures only: a slow push in on a held headline (zoom 1 to 1.1 over 2-4 s), a tilt reveal (tiltX 20-30 to 0 with softLand), a pan between two areas laid out side by side. Return to zoom 1 before content near the edges appears (zooming crops the stage's edges).

SCENE TRANSITIONS (between groups: acts, slides, ideas)
- The "transition" presets (tr-slash, tr-flash, tr-whip, tr-zoom, tr-glitch, tr-dip) act on a whole group. Use them as a matched pair: an "out" clip on the group that leaves and an "in" clip on the next group, with the SAME start and duration (the next group's start), and the leaving group still on stage until it ends.
- When a group leaves through a transition, its own layers should not exit just before it: the transition carries them away.
- One or two transition styles per scene, used for the big changes of idea; plain exits and entrances for the small ones.

LINKS AND THE ENDING (calls to action)
- Any layer or group may carry "link": { "href", "newTab"?, "label"? }. href is https://..., a same-site path (/download), an anchor (#pricing), mailto: or tel:. Put the link on the GROUP that holds a button's shape and its label, so the whole button is clickable. Give "label" when the layer has no words of its own (a shape, an icon).
- A top-level layer or group may carry "pin": "stage": it is then placed against the stage itself (its box x / y are % of the stage, sizes stay in the usual units), so corner items (a badge, a logo, a corner call to action) sit in the real corner whatever the window's shape. Pinned layers sit above the rest and ignore the camera. Use it only for such corner or edge items.
- Add links only when the request gives the address (or clearly asks for a button to a known page); never invent addresses.
- "playback": { "loop": true, "loopFrom": <seconds> } plays the scene once, then repeats only from loopFrom to the end. Use it for an ending call to action: everything arrives, then only the closing part repeats. Set loopFrom after the closing entrances, and give the button a clip that starts and ends at rest within that span (pulse with "times": 1, float), so the repeat is seamless.

EMPHASIS AND CHANGING WORDS
- "select-box" frames one word of a text layer (or a few: "word" is the 1-based word number, "words" how many) in a coloured box with corner handles and tints it, like a selected object in a design tool. Use it on the one key word of a short headline ("The [goal]", "[Run] it"), after the headline has arrived; one per headline, and keep one colour per idea across the scene.
- A text layer may carry "pill": { "stroke"?, "fill"?, "padX"?, "padY"?, "radius"? } (em): a pill or tag sized to its words (status labels, badges, chips). Leave its box without a width so the pill fits the words.
- "text-swap" changes a text layer's words on cue ("to": the new words; "style": roll, slide, fade or blur). Use it for statuses, counters and labels that update ("booting" to "ready in 45 s", "1 / 10" to "2 / 10") instead of a second layer faded over the first. Several on one layer step through a sequence: each starts from what the one before left, so give them separate, non-overlapping times. Keep the new words about as long as the old ones, or give the layer a width.

MORE MOTION
- "text-carry" (Carry in): the first word arrives from far and each next travels less; a punchy alternative to rise for a short line. "text-typewriter" with "caret": true types with a cursor (a prompt box, a search field: put the text over a rounded shape).
- "glow" gives text or a shape a neon glow that stays on ("flicker": true for a neon sign catching). One or two glowing things per scene; it is emphasis, not decoration.
- "burst" (sparks, shards, dots or rings) punctuates ONE hit: a slam landing, a number arriving, a button press. Pair it with an impact sound on the same moment; at most two per 10 s.
- "slide" takes "motionBlur" (0-3) for fast moves; "tr-whip" is a velocity-matched cut (place the out and the in at the same time, as with every transition) and takes "streak": true to flash a light streak on the cut; "tr-streak" is a cut hidden by a flare of light.
- Interface pieces: "progress" fills a shape like a loading bar (the shape is the track); "text-count" on text like "0:45" counts as a clock; a shape with "stroke" and "dash" (dash length, stage units) has a dashed outline, "march" moves its dashes while something works and "dash-solid" closes it up when it is ready; "stack-in" drops cards onto a pile (stagger them).

LINES, FLOWS AND DIAGRAMS (layer types beyond text, shape, image, 3D and group)
- { "type": "path", "d": "<SVG path data>", "stroke"?, "strokeWidth"? (su, default 0.3), "glow"? (su), "dash"? (su), "arrow"? "end"|"start"|"both", "fill"?, "box": { x, y, w, h } }: a line. Its path coordinates run 0-100 across and down ITS box (so "M 0 50 L 100 50" crosses the box). Draw it on with the "draw" preset (an underline swoosh under a headline, a connector, an arrow pointing at something, a route on a map).
- "follow-path" moves ANY layer along a path layer ("path": the line's id) or along one line of a flow layer ("path": the flow's id, "line": 1-based), from "from" to "to" (% of its length); "rotate": true turns it along the line; "trail" (0-1) leaves a fading streak (a comet: a small bright dot on a line whose stroke is "transparent").
- { "type": "flow", "from": "<layer id>", "to": "<layer id>", "count"?: 7, "spread"?: 8 (su), "pinch"?: 0.75, "wave"?: 0.35, "colors"?: [3 colours], "glow"?: 1, "pulses"?: 1 }: glowing curves joining two layers, re-drawn every frame from where they are (no box). Use it to show data or work passing from one card or panel to another; draw it on with "draw"; send an icon along one line with follow-path. One flow per pair of layers; keep the two layers well apart (at least a fifth of the stage).
- { "type": "diagram", "box": { x, y, w, h }, "nodes": [{ "id", "x", "y" (% of the box), "label"?, "sub"?, "shape"?: "box"|"pill"|"circle"|"dot"|"value", "color"?, "at"?: seconds the node pops in, "moves"?: [{ "t", "x", "y" }] }], "edges"?: [{ "from", "to", "kind"?: "curve"|"straight"|"step", "label"?, "color"?, "dashed"?, "arrow"?, "at"? }], "tag"?: { "label", "color"?, "stops": [{ "node", "t" }] }, "look"?: { "color", "nodeFill", "textColor", "fontSize" (su), "lineWidth" } }: a flowchart, an architecture diagram or a branch graph (shape "dot" nodes in a row with curved edges for git branches; "value" nodes show a variable: label above, value inside). Build it up with "at" times, one idea at a time, in step with the voice-over; a connection draws itself once both its nodes are there. Times are on the diagram's own timeline (seconds from the layer's start).

CRAFT (what separates designed motion from a template)
- Structure follows the tone: energetic = more, shorter acts (2-3 s), hard cuts and whips, more sound; calm = fewer, longer acts (4-6 s), soft wipes and dips, little sound; corporate = clear steps, consistent transitions, restrained accents.
- One new thing at a time: each moment introduces one idea; the rest of the frame holds still while it lands.
- No two acts in a row with the same entrance AND the same layout; vary one of them.
- Before the biggest payoff (the headline reveal, the logo, the result), leave a pause of 0.3 to 0.75 s with nothing moving, then land it.
- Entrances under about 0.8 s (0.4-0.6 s for small things); holds long enough to read.
- Two or three transition styles per scene, used consistently; never a slow crossfade between two busy layouts (cut, whip or dip instead).

PRODUCT TOURS (show a product working, from screenshots)
- { "type": "cursor", "box": { "x": 104, "y": 70, "w": 3.5, "ratio": 0.7 } }: a pointer whose x / y is where its TIP starts; start it off the stage so it enters. Clips: "cursor-move" ("to": a layer id, "x" / "y": the point on it in % of it, 50/50 = centre; or "px" / "py": a point on the stage, beyond 100 to leave), 0.6-1.1 s, then "cursor-click" (0.3 s) with a "click" sound; start what the click causes on its last frame. Over a layer with a link it becomes a pointing hand. The cursor always draws on top.
- To make part of a screenshot pressable or movable, give it its own layer (an image or a shape over the screenshot). "image-swap" ("src": a second screenshot) shows the result of a click ("cut" on the click's last frame).
- "spotlight" dims everything but a layer; "callout" ("text", "side") points at it with a labelled pill. Out clips take them away. A layer may carry "hover": { "effect": "lift"|"grow"|"glow"|"brighten"|"shine"|"underline"|"color" } for visitors with a mouse.
- A link may carry "jump": a marker id (or seconds) to make a hotspot: clicking plays the scene from there, for an interactive demo with choices.
- A walkthrough can be written as "steps": [{ "id", "label", "hold"?: s, "do": [{ "layer", "preset", "params"?, "duration"?, "offset"? }] }] at the top level of the scene: each step starts when the one before has finished and held, its changes start together (offset to stagger), and the Studio turns them into clips and markers. Use steps for anything with a clear sequence (a tour, a setup, a step-by-step list); write the layers first, then the steps that change them.

DEPTH
- Any layer may carry "depth": -1 (far) to 1 (near). With a camera pan or zoom, near layers move and grow more than the rest and far ones less: parallax. Use it for a photo split into layers (background -0.15, subject 0.2 to 0.3) or for a few foreground and background elements around a headline, with a slow camera push or pan.

LISTS, CAPTIONS AND MORPHS
- { "type": "repeat", "item": <one layer, usually a group: a row or a card laid out for the FIRST entry>, "items": [{ "field": "value", ... }, ...], "step"?: { "x", "y" } (% of the stage between copies; default 12 down), "columns"?, "rowStep"?, "stagger"?: seconds (0.12) }: a list. Words in the item use {{field}} placeholders that each entry fills in. Each copy's clips start one stagger later, so give the item its entrance clips (stack-in for cards, fade or carry-in for words). Use it for any run of similar rows or cards (steps, features, commands, apps) instead of writing each one out.
- { "type": "captions", "style": { "fontSize": 3, "fontWeight": 800, "color": "#fff" }, "highlight"?: colour, "maxWords"?: 4, "mode"?: "word"|"karaoke"|"none", "background"?: colour, "box": { x, y } }: captions from the voice-over's words (needs a transcribed voice-over). Lower third or bottom centre for a video, never over the key visual; leave them out when big kinetic type already says the same words.
- "morph" ("to": another layer's id) glides a layer into the other's place, size, colour and corners and hands over to it, so a card, word or screenshot carries on into the next act instead of fading out and in. Give the other layer the same look at its new size; it stays hidden until the handover.

CODE (explainers and tutorials)
- { "type": "code", "code": "<the code>", "title"?: "main.py" (the language follows the file name), "frame"?: "window"|"terminal"|"plain", "run"?: true (a Run button), "theme"?: "dark"|"light", "fontSize"?: su (1.5), "box": { x, y, w, h } }: an editor window. It draws itself from its clips: "code-type" types lines in ("fromLine", "toLine"; lines are hidden until typed; split a file over several clips to follow a voice-over), "code-edit" turns it into a new version ("to": the WHOLE new code; it selects and deletes what changed and types the replacement, lines sliding to make room), "code-highlight" marks lines ("line", "toLine") or a word on a line ("token", "nth"), "code-note" puts a pill beside a line ("line", "text"), "code-run" presses Run and shows "output" lines. Highlights and notes stay until an "out" clip for the same line.
- Write real, correct code and real output; never pseudo-code. Keep files short enough to read (under about 18 lines on screen); a terminal is a code layer with "frame": "terminal" whose lines start with "$ ".
- Pace typing at about 12-18 characters a second for code being explained, faster (30+) for boilerplate. Highlight or note the line the voice-over is talking about, as it talks about it, and remove the mark when it moves on.

MUSIC
- When the request lists MUSIC cues (tempo and STRONG moments), land the big reveals (the headline, an act's arrival, the logo, the call to action) so they FINISH on a strong moment, and smaller entrances on beats; text that must be read at a fast tempo lands on every other beat. Do not lock everything to the grid: a few hits per scene.
- "react" makes one or two things breathe with the music ("source": "loud" or "bass", "effect": "glow", "scale", "brightness" or "opacity", "amount" 0-1) over a span; it needs a music clip whose beats were found. Never equaliser bars or strobing.

SOUND (built-in sound effects)
- A clip may carry "sound": { "name": <a sound id below>, "at"?: "start" | "end", "delay"?: s, "volume"?: 0-2, "pitch"?: 0.5-2 }. It plays with the clip and moves with it. "at": "end" lands it on the clip's last frame (a slam, a drop).
- Add sounds when the request asks for sound, music, a video, an ad or a presentation; otherwise leave them out unless the scene already has some.
- Sound the moments that matter: the headline's entrance, a key reveal, the logo or call to action, a hard landing. About 3-6 sounds per 10 s; never one on every letter, every staggered item, or an ambient loop (drift, float, particles, gradient-flow).
- Match the motion: fast arrivals whoosh or swish, pops pop, slams hit (impact, thud), counters tick, typewriters type, a glow chimes or sparkles. A riser leads into the biggest moment.
- Sounds that land together blur: keep about 0.15 s between them.

VIDEO MODE (a scene with "mode": "video": a Reel, TikTok, Short or YouTube video, or graphics to lay over footage)
- Keep "mode", "video" and the stage's breakpoints as they are: each format is a breakpoint with the same id (9x16,
  4x5, 1x1, 16x9). Lay each format out with overrides; vertical text sits higher and larger than on a website.
- The hook in the first two seconds: the first words on screen by 2 s, saying why to keep watching.
- Keep words out of the app's covered areas (video.platform). TikTok, Reels and Shorts cover the top 8-11%, the
  bottom 20-22% (caption, account) and a strip about 15% wide on the right from 30% to 82% down (the buttons).
  YouTube covers the bottom 12% (the controls). Main text between 12% and 75% down, at least 6% from the left.
- Captions: a voice-over always gets a captions layer (most people watch muted), about 60-70% down, big (5-7 on a
  9:16), karaoke or one to three words at a time.
- It plays once: "playback": { "trigger": "load", "loop": false }. Length to suit the platform (Reels about 30 s,
  TikTok and Shorts under a minute) and to the voice-over when there is one.
- Footage: a "video" layer (src, offset to trim its start, rate for speed, reference: true for footage only there to
  design against). Never invent footage sources; use the ones already in the scene. Graphics go above it.
- See-through (video.transparent): no full-frame background shapes, so the footage shows through in the editor.
- One camera move: how a shot leaves sets how the next arrives. A Whip pan or Slide out to one side is followed by the
  next shot arriving from the opposite side, moving the same way, at the same speed; cut mid-motion (the next act
  starts as the last one leaves, never an empty frame). Keep one main direction for the whole video; save the others
  for moments that mean something. Show a cause and its effect on the same frame.
- No idle floating to fill time: every second something tells the story. Cut to the next shot instead of holding.

SHORT-FORM VIDEO EFFECTS (asked for by name; build each from these presets and layers)
On the footage (a "video" layer): snap zoom = snap-zoom on it (x/y at the face); digital zoom = digital-zoom; dolly zoom =
  snap-zoom out on the footage while the cut-out person layer (below) zooms in, over 1 s; zoom through cut = tr-zoom out
  then in on the next shot; zoom portal = portal (out to a corner, in back); grade slider / eyedropper grade = grade-wipe
  across; mood curtain = grade-wipe with axis "y"; film look = film with sprockets false; projected film = film; liquid
  glass = glass; playing grid = copies mode grid; contact sheet = copies mode contact; picture dive / odometer recursion
  = copies mode dive; real feed = copies mode feed; frame break = shatter on the footage with the person cut out above it.
Needing the person cut out (a second "video" layer named "(person)" above the graphics, made in Footage tools): magazine
  cover = big masthead text between the footage and the person (the Magazine cover piece); words behind the head =
  any text between them; paper cut-out = a coloured shape between them, the footage hidden (end it at 0) and sticker on
  the person; green screen / studio reveal = a shape or picture between them, the footage hidden; frame escape = the
  footage in a frame (frame: card or phone) and the person on top, not framed, so they spill out of it.
Following the face (the footage's track): live markup = grade bw on the footage, an ellipse shape (stroke only) with draw
  and follow; orbit = small icon layers with follow (at face) plus orbit-flat; a label over the head = follow at above.
Text: kinetic hook = the Kinetic hook piece (text-slam, gravity-drop); gravity drop = gravity-drop; giant captions =
  captions motion slam; viral drop = captions motion drop; knockout captions = knockout; headline storm = several
  tilted pill texts with strip-in from alternating sides; receipt printer = receipt on a group; screenplay page =
  text-typewriter then select-box; intertitle / title card = the Intertitle / Title card pieces (timecode).
Emphasis: checklist pop / checklist = text lines with tick, a counter with odometer; icon strike = strike; jiggle delete =
  jiggle then strike; growth curve = the Growth chart piece (draw, odometer).
Interface pieces (build from layers like the Pieces library): comment CTA / comment drop = a comment box typing "EDIT"
  then a reply; prompt bar; chat takeover = a chat window; file drop = a dashed zone (march, dash-solid) and a file card;
  NLE timeline = coloured clips growing in tracks and a playhead; storyboard deck = cards with strip-in; phone mockup =
  the footage with frame phone; B-roll overlay = a picture or footage with frame browser over the speaker; video card =
  footage with frame card.

AVOID
- Two moving clips overlapping in time on the same layer (they fight over the same property).
- Endless motion everywhere: pulse, shake and float are accents, not wallpaper.
- Numbers, statistics or claims the request did not give.

SOUNDS (id: what it is)
- whoosh (0.55 s): Air rushing past: something flies in.
- whoosh-out (0.5 s): Air falling away: something leaves.
- swish (0.28 s): A quick, light swipe: wipes and slides.
- slide (0.3 s): A soft upward glide.
- spin (0.7 s): A turning flutter: spins and flips.
- pop (0.14 s): A bright pop: things that appear with a bounce.
- soft-pop (0.18 s): A rounder, quieter pop.
- click (0.05 s): A crisp interface click.
- tick (0.05 s): A tiny high tick: counters and small steps.
- tap (0.1 s): A wooden tap.
- typing (1.15 s): A run of key presses: typewriter text.
- beep (0.16 s): A short soft beep.
- impact (0.9 s): A deep, cinematic hit: slams and big reveals.
- thud (0.35 s): A soft, low landing.
- sub-hit (1.3 s): A long, felt-more-than-heard boom.
- drop (0.6 s): A falling tone: something drops away.
- glitch (0.32 s): Digital stutter: scrambles and glitches.
- chime (1.6 s): A clear bell: a reveal, a highlight.
- sparkle (0.9 s): Glittering high notes: shine and magic.
- success (0.5 s): Two rising notes: done, correct, unlocked.
- notify (0.6 s): A friendly two-note ding.
- riser (1.6 s): Tension building up to a moment.
- swell (2 s): A soft rise and fall: openings and transitions.
- shimmer (1.6 s): An airy, glowing hum: ambient and backgrounds.
- reveal (1.2 s): A whoosh that blooms into a bell.

NAMED EASES (use these names in a clip's "ease"; the seconds are typical lengths)
- softLand (0.4 s, entrances): Firm slow-down into place. The workhorse for text and panels.
- snapSettle (0.37 s, entrances): Most of the travel at once, then a gentle settle. A strong hero entrance.
- glide (0.33 s, entrances): A gentle slow-down for medium moves.
- whip (0.23 s, entrances): A fast, hard slow-down for big moves.
- popOver (0.5 s, entrances): Passes its mark late and settles back (peaks about 8% over). One per scene.
- crashIn (0.33 s, entrances): Hits its mark at once and overshoots (about 18%). For impact.
- bounceHard (0.73 s, entrances): A big springy overshoot (about 48%). Use sparingly.
- cruise (0.3 s, either): Steady speed. For drifts, counters and slow ambient moves.
- softInOut (0.3 s, either): A symmetric S-curve for opacity and blur changes.
- gentleIn (0.3 s, exits): A mild speed-up.
- accelExit (0.43 s, exits): The leaving curve: speeds up out of frame. The default for exits.
- crashOut (0.57 s, exits): A hard speed-up, into a cut or a big change.
```
