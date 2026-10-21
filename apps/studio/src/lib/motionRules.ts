import { NAMED_EASES } from '@unysonplus/scene-player/eases';
import { SFX_CATALOG } from '@unysonplus/scene-player/sfx';

/**
 * The motion rules the AI follows, sent with every request (they ship with the Studio, so the AI Dev
 * Kit never holds a stale copy). The numbers come from professional motion design measured frame by
 * frame, and the same rules drive Check scene, so what the AI is told and what the Studio checks agree.
 */
export const MOTION_RULES = `TIMING
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
- "text-swap" changes a text layer's words on cue ("to": the new words; "style": roll, slide, fade or blur). Use it for statuses, counters and labels that update ("booting" to "ready in 45 s", "1 / 10" to "2 / 10") instead of a second layer faded over the first. Several on one layer step through a sequence: each starts from what the one before left, so give them separate, non-overlapping times. Keep the new words about as long as the old ones, or give the layer a width.

SOUND (built-in sound effects)
- A clip may carry "sound": { "name": <a sound id below>, "at"?: "start" | "end", "delay"?: s, "volume"?: 0-2, "pitch"?: 0.5-2 }. It plays with the clip and moves with it. "at": "end" lands it on the clip's last frame (a slam, a drop).
- Add sounds when the request asks for sound, music, a video, an ad or a presentation; otherwise leave them out unless the scene already has some.
- Sound the moments that matter: the headline's entrance, a key reveal, the logo or call to action, a hard landing. About 3-6 sounds per 10 s; never one on every letter, every staggered item, or an ambient loop (drift, float, particles, gradient-flow).
- Match the motion: fast arrivals whoosh or swish, pops pop, slams hit (impact, thud), counters tick, typewriters type, a glow chimes or sparkles. A riser leads into the biggest moment.
- Sounds that land together blur: keep about 0.15 s between them.

AVOID
- Two moving clips overlapping in time on the same layer (they fight over the same property).
- Endless motion everywhere: pulse, shake and float are accents, not wallpaper.
- Numbers, statistics or claims the request did not give.

SOUNDS (id: what it is)
${SFX_CATALOG.map((s) => `- ${s.id} (${s.length} s): ${s.description}`).join('\n')}

NAMED EASES (use these names in a clip's "ease"; the seconds are typical lengths)
${NAMED_EASES.map((e) => `- ${e.id} (${e.seconds} s, ${e.role === 'enter' ? 'entrances' : e.role === 'exit' ? 'exits' : 'either'}): ${e.use}`).join('\n')}`;
