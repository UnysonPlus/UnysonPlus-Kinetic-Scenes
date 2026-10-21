# Presets

Generated from the Studio 0.0.54. A clip names one of these in `preset` and may set the listed `params`; a preset
only works on the layer types it applies to. Presets marked *not for AI* are left out of what an AI should use.

## Text

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `text-rise` | **Rise.** Letters or words rise into place one after another, from behind an invisible mask. | text | 0.9 s | `direction`: `in` / `out`; `by`: `chars` / `words`; `stagger`: number 0 to 1 s; `rhythm`: `natural` / `even`; `distance`: number 0 to 400 %; `mask`: boolean |
| `text-slam` | **Slam.** Lands from a large, blurred scale, as if thrown at the screen. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.8 s | `direction`: `in` / `out`; `scale`: number 1 to 8; `blur`: number 0 to 5 |
| `text-stretch` | **Stretch.** Letters grow out of a line, squashed, then spring to full size. | text | 0.9 s | `direction`: `in` / `out`; `axis`: `y` / `x`; `stagger`: number 0 to 1 s; `rhythm`: `natural` / `even`; `squash`: number 1 to 4 |
| `text-scramble` | **Scramble.** Letters flicker through random characters and settle on the real text, left to right. | text | 1.1 s | `charset`: text; `fps`: number 1 to 60 /s |
| `text-typewriter` | **Typewriter.** Letters appear one at a time, as if being typed. Caret adds a typing cursor that blinks once the line is done (a prompt box, a search field). | text | 1.2 s | `direction`: `in` / `out`; `caret`: boolean |
| `text-blur` | **Blur in.** Letters or words sharpen out of a soft blur, one after another. | text | 1 s | `direction`: `in` / `out`; `by`: `chars` / `words`; `stagger`: number 0 to 1 s; `rhythm`: `natural` / `even`; `blur`: number 0 to 4 |
| `text-flip` | **Flip.** Letters or words flip up into place in 3D, like a departure board. | text | 0.9 s | `direction`: `in` / `out`; `by`: `chars` / `words`; `stagger`: number 0 to 1 s; `rhythm`: `natural` / `even` |
| `text-tracking` | **Tracking.** Letter spacing opens out (or closes in) as the text fades in. | text | 1.2 s | `direction`: `in` / `out`; `from`: number -1 to 2 em |
| `text-count` | **Count up.** The number in the text counts up to its value, keeping any prefix, separators and suffix ("$12,500+"). A clock ("0:45") counts in minutes and seconds. | text | 1.6 s | `from`: number |
| `text-swap` | **Change text.** Swaps the words for new ones on cue ("booting" to "ready in 45 s", "1 / 10" to "2 / 10"): the old text leaves as the new one arrives. Chain several on one layer to step through a sequence; each starts from the text the one before it left. | text | 0.5 s | `to`: text; `style`: `roll` / `slide` / `fade` / `blur` |
| `text-carry` | **Carry in.** The first word slides in big and fast and each following word travels less, so the line arrives with momentum instead of an even stagger. | text | 0.9 s | `from`: `right` / `left` / `bottom`; `distance`: number 0 to 100 su; `falloff`: number 0.05 to 1 ×; `stagger`: number 0 to 1 s |

## Emphasis

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `text-wave` | **Wave.** A ripple runs through the letters: each one hops and settles. | text | 1 s | `height`: number 0 to 200 %; `stagger`: number 0 to 1 s; `rhythm`: `natural` / `even` |
| `pulse` | **Pulse.** Swells and settles, a set number of times. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 1.2 s | `scale`: number 1 to 2; `times`: number 1 to 12 |
| `shake` | **Shake.** A quick, jittery side-to-side shake that dies away. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `strength`: number 0 to 40 % |
| `float` | **Float.** Drifts gently up and down, like it is floating. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 3 s | `height`: number 0 to 100 %; `cycles`: number 1 to 10 |
| `recolor` | **Recolour.** Changes the text colour, or a shape’s solid fill, to a new colour. | text, shape | 0.6 s | `to`: color |
| `glow` | **Glow.** A neon glow lights up around the letters (or the outline) and stays on. Flicker makes it catch like a neon tube. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `direction`: `in` / `out`; `color`: color; `size`: number 0.1 to 6 su; `strength`: number 0 to 2; `flicker`: boolean |
| `burst` | **Burst.** A one-off burst of sparks, shards, dots or rings from the layer on a hit. Land it with a sound and the word it punctuates. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.7 s | `kind`: `sparks` / `shards` / `dots` / `rings`; `count`: number 1 to 60; `reach`: number 1 to 60 su; `color`: color; `x`: number -50 to 150 %; `y`: number -50 to 150 % |
| `dash-solid` | **Make solid.** A dashed outline closes up into a solid one, for something becoming ready. | shape | 0.5 s | `direction`: `in` / `out` |
| `sheen` | **Sheen.** A band of light sweeps across once. Best after the layer has settled. | shape, image | 0.9 s | `angle`: number 0 to 360 °; `width`: number 5 to 60 %; `strength`: number 0 to 1; `color`: color |
| `select-box` | **Select box.** Draws a coloured box with square corner handles around one word (or a few) of the text, like a selected object in a design tool, and tints the word to match. The key word of a headline. | text | 0.6 s | `direction`: `in` / `out`; `word`: number 1 to 200; `words`: number 1 to 20; `color`: color; `tint`: boolean; `handles`: boolean; `padding`: number 0 to 1 em; `stroke`: number 0.05 to 1 |

## Reveal and exit

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `fade` | **Fade.** Fades in or out with a small drift, optionally scaling or blurring as it goes. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `x`: number -200 to 200 %; `y`: number -200 to 200 %; `scale`: number 0 to 4; `blur`: number 0 to 5 |
| `wipe` | **Wipe.** Reveals or hides behind a straight edge sweeping across. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.8 s | `direction`: `in` / `out`; `from`: `left` / `right` / `top` / `bottom` / `center` |
| `iris` | **Iris.** Opens (or closes) through a growing circle. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.9 s | `direction`: `in` / `out`; `x`: number 0 to 100 %; `y`: number 0 to 100 % |
| `slide` | **Slide.** Slides in from a side (or out to one) while fading. Motion blur smears it along the move while it is fast, so a quick move reads as speed. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `direction`: `in` / `out`; `from`: `left` / `right` / `top` / `bottom`; `distance`: number 0 to 400 %; `motionBlur`: number 0 to 3 |
| `grow` | **Grow.** Draws out from one edge or the centre. Made for lines and bars. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.9 s | `direction`: `in` / `out`; `axis`: `x` / `y`; `origin`: `start` / `center` / `end` |
| `stack-in` | **Stack.** Drops in from just above and settles, like a card landing on a pile. Stagger several to build a stacking list. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.55 s | `direction`: `in` / `out`; `lift`: number 0 to 200 % |
| `draw` | **Draw.** A line (or flow lines) draws itself from its start to its end; out erases it. Arrowheads ride the tip. | path, flow | 1.2 s | `direction`: `in` / `out` |
| `soft-wipe` | **Soft wipe.** A wipe with a feathered edge: the layer fades in (or out) along a moving soft line. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.7 s | `direction`: `in` / `out`; `from`: `left` / `right` / `top` / `bottom`; `feather`: number 1 to 80 % |
| `blinds` | **Blinds.** Revealed (or hidden) in strips, one after another, like a stair wipe. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.8 s | `direction`: `in` / `out`; `from`: `top` / `bottom` / `left` / `right`; `count`: number 2 to 24; `stagger`: number 0 to 0.9 |

## Move and scale

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `pop` | **Pop.** Scales up into place with a little overshoot (or down and away). | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `from`: number 0 to 1 |
| `zoom` | **Zoom.** Eases in from smaller (or larger) with a fade, no overshoot. A start scale above 1 lands it from close up. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `direction`: `in` / `out`; `scale`: number 0 to 4 |
| `spin` | **Spin.** Turns into place while scaling up. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.9 s | `direction`: `in` / `out`; `turns`: number -4 to 4 |
| `keyframes` | **Keyframes.** Hand-set values at moments within the clip: position, scale, rotation, opacity and blur. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 2 s | (none) |
| `progress` | **Progress bar.** A bar fills the shape from one value to another over the clip: the shape is the track. Use the None ease for a steady load. | shape | 2 s | `from`: number 0 to 100 %; `to`: number 0 to 100 %; `color`: color; `axis`: `x` / `y` |
| `morph` | **Morph into.** Glides into another layer: to its place and size (and, between two shapes, its colour and corners), then hands over to it in a short crossfade, so the same word, card or screenshot carries on into the next act instead of fading out and in again. The other layer stays hidden until the handover. | text, shape, image, model, group, diagram, code | 0.9 s | `to`: a layer id; `fade`: number 0.05 to 1 |
| `follow-path` | **Follow path.** Travels along a line layer (or one of the lines of a flow layer), from one point of it to another. Turn to follow makes it face along the line; Trail leaves a fading streak behind it (a comet). | text, shape, image, model, group, diagram, code, repeat | 1.6 s | `path`: a layer id; `line`: number 1 to 40; `from`: number 0 to 100 %; `to`: number 0 to 100 %; `rotate`: boolean; `trail`: number 0 to 1; `trailColor`: color; `trailWidth`: number 0.05 to 3 su |
| `turn` | **Turn.** Turns into place in 3D, around the vertical or horizontal axis, as if on a hinge through its middle. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.7 s | `direction`: `in` / `out`; `axis`: `y` / `x`; `angle`: number -180 to 180 °; `perspective`: number 200 to 3000 px |
| `scroll` | **Scroll.** Scrolls a tall screenshot inside its frame (or pans a wide one across), from one point to another. Make the frame shorter than the picture. Repeat makes it endless: the picture follows on from itself, and 0 to 100 is one full pass, so a looping ending joins up seamlessly (use the None ease for a steady speed). | image | 6 s | `from`: number 0 to 100 %; `to`: number 0 to 1000 %; `axis`: `y` / `x`; `repeat`: boolean |
| `code` *(not for AI)* | **Custom code.** Your own GSAP code, for an effect no preset covers. It only runs where the page allows custom code (the Studio, downloaded pages and embeds; in WordPress, pages by authors trusted with unfiltered HTML). | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 1 s | `code`: code |

## Ambient and backgrounds

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `react` | **React to music.** Breathes with the music: its loudness or its bass gently drives a glow, a slight scale or brightness. Find the music’s beats first (in the music clip’s settings). Use it on one or two things, never as equaliser bars. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 4 s | `source`: `loud` / `bass`; `effect`: `glow` / `scale` / `brightness` / `opacity`; `amount`: number 0 to 1; `color`: color |
| `march` | **Marching outline.** The dashes of a dashed outline travel round it while something is working. Give the shape an outline and a dash length. | shape | 3 s | `speed`: number 0.1 to 20 su/s |
| `drift` | **Drift.** A slow, steady move and scale creep that keeps a held frame alive. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 3 s | `x`: number -100 to 100 %; `y`: number -100 to 100 %; `scale`: number 0.5 to 2; `rotate`: number -45 to 45 ° |
| `gradient-flow` | **Gradient flow.** A shape’s gradient fill flows across it and back. Give the shape a gradient fill. | shape | 4 s | `axis`: `x` / `y` / `diagonal`; `cycles`: number 1 to 10 |
| `particles` | **Particles.** A field of small dots rising, falling or drifting inside the shape. Clear the shape’s fill to show the particles on their own. | shape | 4 s | `count`: number 1 to 150; `size`: number 0.2 to 10 %; `speed`: number 0 to 2 /s; `direction`: `up` / `down` / `drift`; `color`: color; `twinkle`: boolean |

## Cursor and tours

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `cursor-move` | **Move to.** The cursor travels to a layer (a point on it, in % of the layer: 50 / 50 is its centre) along a gentle curve with a pointer's easing, or to a point on the stage when no layer is given (beyond the edges to leave). Over a link or a button it turns into a pointing hand as it arrives. | cursor | 0.9 s | `to`: a layer id; `x`: number 0 to 100 %; `y`: number 0 to 100 %; `px`: number -50 to 150 %; `py`: number -50 to 150 %; `arc`: number -0.6 to 0.6; `hand`: `auto` / `yes` / `no` |
| `cursor-click` | **Click.** The cursor presses: it dips, a ring ripples out from the tip and the layer under it dips too, all on the same frame. Give it a click sound, and start what the click causes on its last frame. | cursor | 0.35 s | `dip`: boolean |
| `image-swap` | **Before and after.** A second picture of the same screen takes over (the menu opened, the setting saved): cut on the frame a click lands, or a quick fade or wipe. Several on one picture step through screens. | image | 0.25 s | `src`: text; `style`: `cut` / `fade` / `wipe` |
| `spotlight` | **Spotlight.** Everything but this layer dims, with a rounded window around it, and stays that way until an Out clip. Follows the layer through camera moves. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `pad`: number 0 to 20 su; `radius`: number 0 to 30 su; `dim`: number 0 to 1 |
| `callout` | **Callout.** A labelled pill beside this layer, joined to it by a short line, saying what it is ("Save your changes here"). Stays until an Out clip. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.45 s | `direction`: `in` / `out`; `text`: text; `side`: `top` / `right` / `bottom` / `left`; `gap`: number 0 to 30 su; `color`: color; `size`: number 0.5 to 6 su |

## Code

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `code-type` | **Type code.** Types lines of the code in, character by character with a caret, in a natural rhythm: quick within a word, a beat at punctuation and new lines, indentation arriving with the line. The lines are hidden until typed. Several clips can type a file part by part, in step with a voice-over. Suggest shows an autocomplete popup while longer words are typed. | code | 3 s | `fromLine`: number 1 to 2000; `toLine`: number 0 to 2000; `suggest`: boolean |
| `code-edit` | **Change code.** Turns the code into a new version the way a person would edit it: each changed part is selected and deleted, then the new text is typed in its place, and lines slide to make room or close up. Give the whole new version; only what differs is touched. | code | 3 s | `to`: text; `suggest`: boolean |
| `code-highlight` | **Highlight code.** Marks lines with a coloured band, or one word on a line with a box (give the word in Word). Stays until an Out clip for the same line. | code | 0.4 s | `direction`: `in` / `out`; `line`: number 1 to 2000; `toLine`: number 0 to 2000; `token`: text; `nth`: number 1 to 20; `color`: color |
| `code-run` | **Run code.** Presses the Run button and shows the output in a panel under the code, one line at a time over the clip. | code | 1.2 s | `output`: text; `rows`: number 0 to 40 |
| `code-note` | **Code note.** A pill beside a line of the code, joined to it by a short dashed connector, explaining it ("sc.nextLine() reads the text into name"). Stays until an Out clip for the same line. | code | 0.4 s | `direction`: `in` / `out`; `line`: number 1 to 2000; `text`: text; `side`: `right` / `left`; `color`: color |

## Scene transitions

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `tr-slash` | **Slash.** A glowing diagonal line sweeps across the stage; the scene appears (or disappears) behind it. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `direction`: `in` / `out`; `angle`: number -60 to 60 °; `color`: color; `glow`: boolean |
| `tr-flash` | **Flash.** A burst of light: the scene cuts at its brightest moment. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `color`: color; `strength`: number 10 to 100 % |
| `tr-dip` | **Dip to colour.** The screen fills with a colour, holds a beat, and opens on the next scene. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.8 s | `direction`: `in` / `out`; `color`: color |
| `tr-whip` | **Whip pan.** One fast camera swing: the scene speeds away with a blur along the move and the next arrives from the same side at the same speed, settling into place. Light streak flares across the screen on the cut to hide the join. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `from`: `left` / `right` / `top` / `bottom`; `distance`: number 10 to 150 %; `blur`: number 0 to 4; `streak`: boolean; `color`: color |
| `tr-zoom` | **Zoom through.** The scene rushes past the camera, or approaches from the distance. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.6 s | `direction`: `in` / `out`; `scale`: number 1.2 to 10 ×; `blur`: number 0 to 4 |
| `tr-streak` | **Light streak.** A horizontal flare of light races across the screen and the scenes swap at its brightest. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.5 s | `direction`: `in` / `out`; `color`: color; `from`: `left` / `right` |
| `tr-glitch` | **Glitch.** Slices jump and colours split for a few frames, then the cut, like a broken signal. | text, shape, image, model, group, path, flow, diagram, code, captions, repeat, cursor | 0.45 s | `direction`: `in` / `out`; `intensity`: number 10 to 100 % |

## 3D

| id | what it does | applies to | default length | settings |
| --- | --- | --- | --- | --- |
| `spin-3d` | **Spin 3D.** The object turns around one of its axes, a set number of times. | model | 2 s | `axis`: `y` / `x` / `z`; `turns`: number -10 to 10 |
| `tumble-in` | **Tumble in.** The object tumbles into its pose from a turned, smaller start (or tumbles away). | model | 1.1 s | `direction`: `in` / `out`; `turn`: number -720 to 720 °; `tilt`: number -180 to 180 °; `scale`: number 0 to 3 |
| `orbit-3d` | **Orbit.** The camera circles the object, rising or dipping as it goes. | model | 3 s | `angle`: number -360 to 360 °; `tilt`: number -60 to 60 ° |
| `camera-push` | **Camera push.** The camera moves in from further away (or pulls back out). | model | 1.4 s | `direction`: `in` / `out`; `distance`: number 0.3 to 8 × |
