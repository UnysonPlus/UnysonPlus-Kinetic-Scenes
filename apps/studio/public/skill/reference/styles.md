# Styles

The built-in looks. A request may name one; follow its colours, fonts and motion.

## Night

STYLE: "Night" (follow it unless the request says otherwise). Dark and confident: one bright green accent, tight heavy type, clean decisive motion.
- Stage background: radial-gradient(120% 90% at 50% 40%, #121a20 0%, #0a0d11 70%). Colours: text #f4f6f8, secondary text #9fb0bd, accent #2ad38b, second accent #8b7bff. Use the accent sparingly, on what matters most.
- Fonts: headlines "Archivo" weight 800; other text "Archivo" weight 500. Set stage.fonts to [{ "family": "Archivo", "href": "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&display=swap" }].
- Motion: headlines enter with text-rise {"by":"chars","stagger":0.03}, other text with text-rise {"by":"words","stagger":0.06}, shapes with grow {"axis":"x","origin":"start"}; exits use fade {"y":-20}. Entrances ease "softLand", exits "accelExit". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "whoosh", exits "whoosh-out", landings "impact", accents "chime".

## Clean

STYLE: "Clean" (follow it unless the request says otherwise). Light, corporate and calm: navy type on white, a blue accent, quiet fades and wipes.
- Stage background: #ffffff. Colours: text #0f1b2d, secondary text #5b6b80, accent #2563eb, second accent #14b8a6. Use the accent sparingly, on what matters most.
- Fonts: headlines "Inter" weight 700; other text "Inter" weight 400. Set stage.fonts to [{ "family": "Inter", "href": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" }].
- Motion: headlines enter with text-rise {"by":"words","stagger":0.08}, other text with fade {"y":16}, shapes with wipe {"from":"left"}; exits use fade {"y":-12}. Entrances ease "glide", exits "gentleIn". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swish", exits "whoosh-out", landings "soft-pop", accents "chime".

## Kinetic

STYLE: "Kinetic" (follow it unless the request says otherwise). Loud and fast: condensed capitals, yellow on black, slams and hard cuts.
- Stage background: #0b0b0b. Colours: text #ffffff, secondary text #a3a3a3, accent #ffe100, second accent #ff3d3d. Use the accent sparingly, on what matters most.
- Fonts: headlines "Anton" weight 400 in capitals; other text "Archivo" weight 600. Set stage.fonts to [{ "family": "Anton", "href": "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@500;600&display=swap" }].
- Motion: headlines enter with text-slam {"scale":2.4,"blur":1.2}, other text with slide {"from":"bottom","distance":60}, shapes with grow {"axis":"x","origin":"start"}; exits use wipe {"from":"left"}. Entrances ease "snapSettle", exits "crashOut". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "whoosh", exits "swish", landings "impact", accents "sub-hit".

## Pastel

STYLE: "Pastel" (follow it unless the request says otherwise). Soft and warm: a serif headline, peach and sage on cream, slow blurs and gentle floats.
- Stage background: linear-gradient(160deg, #fbf3ea 0%, #f3e6f0 100%). Colours: text #3b2a40, secondary text #8a7690, accent #e8836f, second accent #8fb8a8. Use the accent sparingly, on what matters most.
- Fonts: headlines "DM Serif Display" weight 400; other text "DM Sans" weight 500. Set stage.fonts to [{ "family": "DM Serif Display", "href": "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap" }].
- Motion: headlines enter with text-blur {"by":"words","stagger":0.12}, other text with text-rise {"by":"words","stagger":0.08}, shapes with pop {"from":0.7}; exits use fade {"y":0,"blur":0.6}. Entrances ease "glide", exits "gentleIn". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "soft-pop", accents "sparkle".

## Neon

STYLE: "Neon" (follow it unless the request says otherwise). Tech and code: cyan and magenta on deep navy, a mono supporting font, scrambles and typing.
- Stage background: radial-gradient(110% 90% at 30% 20%, #0b1026 0%, #05060f 75%). Colours: text #e6f1ff, secondary text #7d8bb0, accent #22d3ee, second accent #e879f9. Use the accent sparingly, on what matters most.
- Fonts: headlines "Space Grotesk" weight 700; other text "JetBrains Mono" weight 400. Set stage.fonts to [{ "family": "Space Grotesk", "href": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap" }].
- Motion: headlines enter with text-scramble, other text with text-typewriter, shapes with blinds {"from":"top","count":6,"stagger":0.5}; exits use fade {"y":0,"blur":0.8}. Entrances ease "whip", exits "accelExit". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "glitch", exits "whoosh-out", landings "thud", accents "beep".

## Editorial

STYLE: "Editorial" (follow it unless the request says otherwise). Magazine pages: a classic serif, one red accent on paper, measured wipes and tracking.
- Stage background: #f6f3ee. Colours: text #141414, secondary text #6b6560, accent #c8102e. Use the accent sparingly, on what matters most.
- Fonts: headlines "Playfair Display" weight 700; other text "Inter" weight 400. Set stage.fonts to [{ "family": "Playfair Display", "href": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap" }].
- Motion: headlines enter with text-tracking {"from":-0.4}, other text with soft-wipe {"from":"left","feather":25}, shapes with wipe {"from":"left"}; exits use soft-wipe {"from":"left","feather":25}. Entrances ease "softInOut", exits "gentleIn". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swish", exits "swish", landings "tap", accents "chime".

## Playful

STYLE: "Playful" (follow it unless the request says otherwise). Friendly and bouncy: rounded type, pink and mint on cream, pops and flips.
- Stage background: #fff7e0. Colours: text #1f2050, secondary text #6a6b9a, accent #ff5c8a, second accent #3ec7a6. Use the accent sparingly, on what matters most.
- Fonts: headlines "Fredoka" weight 700; other text "Nunito" weight 600. Set stage.fonts to [{ "family": "Fredoka", "href": "https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@500;600&display=swap" }].
- Motion: headlines enter with text-flip {"by":"chars","stagger":0.04}, other text with text-rise {"by":"words","stagger":0.07}, shapes with pop {"from":0.5}; exits use pop. Entrances ease "popOver", exits "accelExit". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "pop", exits "whoosh-out", landings "thud", accents "success".

## Luxe

STYLE: "Luxe" (follow it unless the request says otherwise). Quiet luxury: an elegant serif, gold on black, slow reveals and a single sheen.
- Stage background: radial-gradient(120% 90% at 50% 40%, #17130c 0%, #090806 75%). Colours: text #f5efe3, secondary text #b3a68c, accent #d4b26a. Use the accent sparingly, on what matters most.
- Fonts: headlines "Cormorant Garamond" weight 600; other text "Montserrat" weight 400. Set stage.fonts to [{ "family": "Cormorant Garamond", "href": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:wght@400;500&display=swap" }].
- Motion: headlines enter with text-blur {"by":"chars","stagger":0.04}, other text with fade {"y":10}, shapes with grow {"axis":"x","origin":"center"}; exits use fade {"y":0,"blur":0.5}. Entrances ease "glide", exits "gentleIn". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "sub-hit", accents "shimmer".

## Flat vector

STYLE: "Flat vector" (follow it unless the request says otherwise). Explainer-video flat: solid shapes, no shadows, a friendly rounded font and bouncy, overlapping moves.
- Stage background: #f6f1e7. Colours: text #1f2a44, secondary text #5b6782, accent #ff6b4a, second accent #2bb3a3. Use the accent sparingly, on what matters most.
- Fonts: headlines "Poppins" weight 800; other text "Poppins" weight 500. Set stage.fonts to [{ "family": "Poppins", "href": "https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap" }].
- Motion: headlines enter with pop {"from":0.4}, other text with slide {"from":"bottom","distance":40}, shapes with pop {"from":0.2}; exits use pop {"direction":"out"}. Entrances ease "back.out(1.7)", exits "back.in(1.4)". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "pop", exits "swish", landings "soft-pop", accents "chime".
- What makes it Flat vector: Solid fills, no gradients or shadows; simple geometric icons and people; 3-4 saturated colours on a light, warm background; everything overshoots slightly and settles. Someone should recognise the style from any single frame.
- How to build it here: Shapes (rect with radius, ellipse) with pop/stack-in entrances at back.out easing, 0.08-0.12 s staggers so moves overlap; a big rounded headline; icons as simple shapes; no grade, no blur. Its signature effect is the "pop" preset.

## Line art

STYLE: "Line art" (follow it unless the request says otherwise). Single-weight lines drawing themselves on a clean ground, with a little hand-drawn boil.
- Stage background: #fbfaf7. Colours: text #111111, secondary text #666666, accent #111111, second accent #ff5a36. Use the accent sparingly, on what matters most.
- Fonts: headlines "Space Grotesk" weight 600; other text "Space Grotesk" weight 400. Set stage.fonts to [{ "family": "Space Grotesk", "href": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap" }].
- Motion: headlines enter with text-typewriter, other text with fade {"y":8}, shapes with draw; exits use fade {"y":0}. Entrances ease "power2.inOut", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "tick", exits "swish", landings "click", accents "tap".
- What makes it Line art: Everything is an outline in one stroke weight, black (or one ink) on off-white; lines draw on from start to end; a single accent colour at most; a slight hand-drawn wobble. Someone should recognise the style from any single frame.
- How to build it here: Path and flow layers with the draw preset (power2.inOut, 1-1.6 s); shapes with a stroke and no fill; text-outline on big words; a long boil clip (amount 1.5-2.5, 8 fps) on the drawing group for the hand-drawn feel. Its signature effect is the "boil" preset.

## Isometric

STYLE: "Isometric" (follow it unless the request says otherwise). Tidy 30° worlds: blocks and platforms, soft pastel faces, things rising into place.
- Stage background: #eef1fb. Colours: text #1d2340, secondary text #6a7299, accent #5b6cff, second accent #ff9f6b. Use the accent sparingly, on what matters most.
- Fonts: headlines "Manrope" weight 800; other text "Manrope" weight 500. Set stage.fonts to [{ "family": "Manrope", "href": "https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&display=swap" }].
- Motion: headlines enter with text-rise {"by":"words"}, other text with fade {"y":12}, shapes with gravity-drop; exits use fade {"y":-12}. Entrances ease "power3.out", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "slide", exits "whoosh-out", landings "thud", accents "click".
- What makes it Isometric: Objects on a 30° grid with three shaded faces (light top, mid left, dark right); no perspective; small worlds on platforms; pieces drop or slide in along the grid axes. Someone should recognise the style from any single frame.
- How to build it here: Group three shapes per block (top/left/right faces) or use 3D models with an isometric camera; gravity-drop / stack-in entrances; keep motion along the grid diagonals; pastel faces from the palette with accent on one object. Its signature effect is the "gravity-drop" preset.

## Toy 3D

STYLE: "Toy 3D" (follow it unless the request says otherwise). Soft, glossy 3D objects like toys or clay: rounded shapes, bright colours, squash and bounce.
- Stage background: radial-gradient(120% 90% at 50% 30%, #fff4e8 0%, #ffd9c2 100%). Colours: text #2b1d3a, secondary text #7b6585, accent #ff5d8f, second accent #5ec8ff. Use the accent sparingly, on what matters most.
- Fonts: headlines "Fredoka" weight 700; other text "Nunito" weight 600. Set stage.fonts to [{ "family": "Fredoka", "href": "https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@500;700&display=swap" }].
- Motion: headlines enter with tumble-in, other text with pop {"from":0.6}, shapes with gravity-drop; exits use pop {"direction":"out"}. Entrances ease "back.out(2)", exits "back.in(1.6)". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "pop", exits "swish", landings "drop", accents "sparkle".
- What makes it Toy 3D: Rounded, glossy or matte "clay" objects with soft shadows and rim light; bright toy colours on a warm gradient; objects bounce, squash and land with weight. Someone should recognise the style from any single frame.
- How to build it here: 3D model layers (rounded primitives) with orbit-3d / spin-3d for hero turns; gravity-drop and tumble-in with back easing; a soft glow shape under each object as its shadow; chunky rounded type. Its signature effect is the "jiggle" preset.

## Bauhaus

STYLE: "Bauhaus" (follow it unless the request says otherwise). Primary colours, circles, squares and triangles on a strict grid; bold sans type and mechanical moves.
- Stage background: #f2ead9. Colours: text #141414, secondary text #4a4a4a, accent #e63323, second accent #1f4bb5. Use the accent sparingly, on what matters most.
- Fonts: headlines "Archivo Black" weight 400 in capitals; other text "Archivo" weight 500. Set stage.fonts to [{ "family": "Archivo Black", "href": "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500&display=swap" }].
- Motion: headlines enter with wipe {"from":"left"}, other text with slide {"from":"left","distance":40}, shapes with grow {"axis":"x","origin":"start"}; exits use wipe {"direction":"out","from":"right"}. Entrances ease "power4.inOut", exits "power4.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "click", exits "swish", landings "thud", accents "tick".
- What makes it Bauhaus: Red, blue, yellow and black on cream; perfect circles, squares, half-circles and bars arranged on a strict grid; heavy sans capitals; moves are straight, mechanical and precise. Someone should recognise the style from any single frame.
- How to build it here: Shapes only (rect, ellipse, half circles by clipping), placed on grid units; grow/wipe/slide along one axis with power4.inOut; one rotation (spin) as the hero; no blur, no glow, no gradients. Its signature effect is the "spin" preset.

## Swiss grid

STYLE: "Swiss grid" (follow it unless the request says otherwise). International typographic style: a strict grid, huge tight sans type, asymmetry and kinetic words.
- Stage background: #ffffff. Colours: text #0a0a0a, secondary text #5c5c5c, accent #ff2a1a. Use the accent sparingly, on what matters most.
- Fonts: headlines "Inter" weight 900; other text "Inter" weight 500. Set stage.fonts to [{ "family": "Inter", "href": "https://fonts.googleapis.com/css2?family=Inter:wght@500;900&display=swap" }].
- Motion: headlines enter with text-rise {"by":"chars","stagger":0.02}, other text with wipe {"from":"left"}, shapes with grow {"axis":"x","origin":"start"}; exits use text-rise {"direction":"out"}. Entrances ease "expo.out", exits "expo.in". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "tick", exits "swish", landings "click", accents "tap".
- What makes it Swiss grid: A visible or implied column grid; very large, tightly tracked sans headlines, often flush left and cropped by the frame; lots of white; one red accent; words move as the design (kinetic type). Someone should recognise the style from any single frame.
- How to build it here: Text layers aligned to 12-column positions (left anchors), headline 14-22 wide units with letterSpacing -0.04; text-rise by chars with expo.out; thin red rules that grow; numbers as kickers; no images or one photo in a strict box. Its signature effect is the "text-tracking" preset.

## Synthwave

STYLE: "Synthwave" (follow it unless the request says otherwise). Neon on night purple: a glowing grid horizon, a striped sun, chrome type and scanlines.
- Stage background: linear-gradient(180deg, #0d0221 0%, #261447 55%, #ff3864 100%). Colours: text #fef6ff, secondary text #c5a7ff, accent #ff3864, second accent #2de2e6. Use the accent sparingly, on what matters most.
- Fonts: headlines "Monoton" weight 400 in capitals; other text "Rajdhani" weight 600. Set stage.fonts to [{ "family": "Monoton", "href": "https://fonts.googleapis.com/css2?family=Monoton&family=Rajdhani:wght@500;700&display=swap" }].
- Motion: headlines enter with glow, other text with text-scramble, shapes with grow {"axis":"y","origin":"end"}; exits use tr-glitch. Entrances ease "power3.out", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "riser", exits "whoosh-out", landings "sub-hit", accents "shimmer".
- What makes it Synthwave: Dusk gradient (deep purple to hot pink), a perspective grid floor in magenta or cyan running to the horizon, a sun with horizontal stripes, neon glow on type, chrome or outlined lettering, VHS scanlines. Someone should recognise the style from any single frame.
- How to build it here: Stage background gradient; a grid floor from repeated thin shapes (repeat layer) with a slow slide toward the viewer; a striped sun (ellipse with a repeating-linear-gradient fill); glow on headlines, text-3d (accent2) or text-outline; a scanlines clip on the whole scene group. Its signature effect is the "scanlines" preset.

## Aurora glass

STYLE: "Aurora glass" (follow it unless the request says otherwise). Frosted glass cards floating over soft, drifting aurora colours; calm and premium.
- Stage background: radial-gradient(80% 70% at 20% 20%, #5b8cff 0%, transparent 60%), radial-gradient(70% 70% at 80% 70%, #b86bff 0%, transparent 60%), #0b1026. Colours: text #f5f7ff, secondary text #b8c2e8, accent #7cf2d4, second accent #ff9ad5. Use the accent sparingly, on what matters most.
- Fonts: headlines "Plus Jakarta Sans" weight 700; other text "Plus Jakarta Sans" weight 400. Set stage.fonts to [{ "family": "Plus Jakarta Sans", "href": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap" }].
- Motion: headlines enter with text-blur {"by":"words","stagger":0.1}, other text with fade {"y":10,"blur":0.4}, shapes with fade {"y":20,"scale":0.96}; exits use fade {"y":-10,"blur":0.5}. Entrances ease "power3.out", exits "power2.in". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "soft-pop", accents "shimmer".
- What makes it Aurora glass: Large blurred colour fields (aurora blobs) drifting slowly behind translucent, frosted cards with a thin light border; white type; slow, soft blurs and floats; never busy. Someone should recognise the style from any single frame.
- How to build it here: Background: two or three big ellipses with radial-gradient fills, a liquid or drift clip, opacity 0.6-0.8; cards: rect shapes with fill rgba(255,255,255,.08), a 1px light stroke and a glass clip for a passing highlight; text-blur headlines, 1.2-1.5 s moves. Its signature effect is the "liquid" preset.

## Collage

STYLE: "Collage" (follow it unless the request says otherwise). Cut-paper collage: torn photos, tape, halftone print and hand-placed type that jumps in frame by frame.
- Stage background: #efe6d6. Colours: text #1a1a1a, secondary text #5a4e42, accent #e8412b, second accent #2f6fd6. Use the accent sparingly, on what matters most.
- Fonts: headlines "Rubik Mono One" weight 400 in capitals; other text "Courier Prime" weight 700. Set stage.fonts to [{ "family": "Rubik Mono One", "href": "https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Courier+Prime:wght@400;700&display=swap" }].
- Motion: headlines enter with sticker, other text with stack-in, shapes with sticker; exits use fade {"y":0}. Entrances ease "steps(4)", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "tap", exits "swish", landings "thud", accents "click".
- What makes it Collage: Photos cut out with rough edges and slight rotations, paper texture, tape strips, halftone dots and mismatched type; pieces land in place on a few frames (stepped), not smoothly. Someone should recognise the style from any single frame.
- How to build it here: Image layers with small rotations (-6 to 6°) and the halftone clip; sticker / stack-in entrances with a steps(4) ease for stop-motion; tape as small semi-transparent rects; mix two fonts; the boil preset on the whole group at fps 6 for jitter. Its signature effect is the "halftone" preset.

## HUD and terminal

STYLE: "HUD and terminal" (follow it unless the request says otherwise). Sci-fi interface: thin cyan lines, brackets, readouts that count and type, scanning lines.
- Stage background: #030b10. Colours: text #d9fbff, secondary text #5fa6b3, accent #16e0ff, second accent #ffb020. Use the accent sparingly, on what matters most.
- Fonts: headlines "Orbitron" weight 800 in capitals; other text "JetBrains Mono" weight 400. Set stage.fonts to [{ "family": "Orbitron", "href": "https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=JetBrains+Mono:wght@400;600&display=swap" }].
- Motion: headlines enter with text-scramble, other text with text-typewriter, shapes with grow {"axis":"x","origin":"start"}; exits use tr-glitch. Entrances ease "power2.out", exits "power2.in". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "beep", exits "glitch", landings "click", accents "typing".
- What makes it HUD and terminal: Thin cyan or amber lines on near-black; corner brackets, crosshairs, tick rulers, circular gauges; monospace readouts that type and count; scanning bars; data appears in bursts. Someone should recognise the style from any single frame.
- How to build it here: Thin shapes (h 0.2-0.4) that grow, path layers that draw for brackets and gauges; text-scramble for headings, text-typewriter and text-count for readouts; a slow scanlines clip; beep/typing sounds on reveals; keep everything aligned to a fine grid. Its signature effect is the "scanlines" preset.

## Dark tech keynote

STYLE: "Dark tech keynote" (follow it unless the request says otherwise). Product-launch keynote: black stage, one huge line at a time, a hero product shot and slow, confident light.
- Stage background: #000000. Colours: text #f5f5f7, secondary text #86868b, accent #2997ff, second accent #bf5af2. Use the accent sparingly, on what matters most.
- Fonts: headlines "Inter" weight 800; other text "Inter" weight 400. Set stage.fonts to [{ "family": "Inter", "href": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" }].
- Motion: headlines enter with fade {"y":24,"blur":0.3}, other text with fade {"y":12}, shapes with fade {"scale":1.04}; exits use fade {"y":-12}. Entrances ease "power2.out", exits "power2.in". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "sub-hit", accents "shimmer".
- What makes it Dark tech keynote: Pure black, one short statement at a time, very large and centred; one hero image or product lit from the side; a gradient on the key word; long holds and slow crossfades; lots of empty space. Someone should recognise the style from any single frame.
- How to build it here: One headline per beat (text 8-12 units, weight 800) with a slow fade-up (1-1.4 s); a text-gradient clip on the hero word; a hero image with sheen or camera-push; spotlight for emphasis; no more than two elements on screen. Its signature effect is the "sheen" preset.

## Data story

STYLE: "Data story" (follow it unless the request says otherwise). Charts that tell one point: numbers that count, bars that grow, one highlighted series and plain labels.
- Stage background: #0f1720. Colours: text #eef3f8, secondary text #8a9bb0, accent #ffb547, second accent #4cc3ff. Use the accent sparingly, on what matters most.
- Fonts: headlines "IBM Plex Sans" weight 700; other text "IBM Plex Sans" weight 400. Set stage.fonts to [{ "family": "IBM Plex Sans", "href": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap" }].
- Motion: headlines enter with text-rise {"by":"words"}, other text with fade {"y":8}, shapes with grow {"axis":"y","origin":"end"}; exits use fade {"y":0}. Entrances ease "power3.out", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "tick", exits "swish", landings "click", accents "success".
- What makes it Data story: One clear claim per chart; bars or lines growing from the baseline, numbers counting up, one series in the accent and the rest grey; plain direct labels instead of legends; a takeaway headline. Someone should recognise the style from any single frame.
- How to build it here: Bars as rect shapes with grow (axis y, origin end) staggered 0.1 s; lines as path layers with draw; big numbers with text-count or odometer; muted grey for context, accent for the point; finish on the headline number held. Its signature effect is the "odometer" preset.

## Living UI

STYLE: "Living UI" (follow it unless the request says otherwise). A product screen that works by itself: a cursor clicks, cards update, numbers tick, a notification lands.
- Stage background: linear-gradient(160deg, #eef2ff 0%, #f8fafc 100%). Colours: text #111827, secondary text #6b7280, accent #4f46e5, second accent #10b981. Use the accent sparingly, on what matters most.
- Fonts: headlines "Inter" weight 800; other text "Inter" weight 500. Set stage.fonts to [{ "family": "Inter", "href": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" }].
- Motion: headlines enter with text-rise {"by":"words"}, other text with slide {"from":"bottom","distance":20}, shapes with stack-in; exits use fade {"y":-8}. Entrances ease "power3.out", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "tap", exits "swish", landings "click", accents "notify".
- What makes it Living UI: A real-looking interface (cards, lists, buttons) in a browser or phone frame; a cursor moves and clicks; values update in place; a notification slides in; camera pushes to the detail that matters. Someone should recognise the style from any single frame.
- How to build it here: A screenshot or built UI in an image layer with frame "browser"/"phone"; cursor layer with cursor-move and cursor-click; text-swap and text-count for changing values; select-box and spotlight for focus; digital-zoom or camera-push into the key area. Its signature effect is the "sheen" preset.

## Vertical social

STYLE: "Vertical social" (follow it unless the request says otherwise). Talking-head reels: huge words one to three at a time, karaoke highlight, emoji pops and quick punch-ins.
- Stage background: #111111. Colours: text #ffffff, secondary text #cfcfcf, accent #ffe14d, second accent #ff3d7f. Use the accent sparingly, on what matters most.
- Fonts: headlines "Montserrat" weight 900 in capitals; other text "Montserrat" weight 700. Set stage.fonts to [{ "family": "Montserrat", "href": "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" }].
- Motion: headlines enter with pop {"from":0.6}, other text with pop {"from":0.8}, shapes with pop {"from":0.5}; exits use fade {"y":0}. Entrances ease "back.out(2)", exits "power2.in". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "pop", exits "swish", landings "impact", accents "notify".
- What makes it Vertical social: 9:16 footage of a person; captions of one to three words in heavy capitals with a dark outline, the spoken word highlighted in yellow; emoji and stickers pop on key words; fast punch-ins (digital zoom) on jokes; cuts every 1-2 s. Someone should recognise the style from any single frame.
- How to build it here: A captions layer (karaoke, 5-7 units, 60-70% down) from the voice; text-3d or text-outline for readability; pop with back.out on emphasis words; digital-zoom 1.1-1.2 on beats; keep words clear of the app buttons. Its signature effect is the "text-3d" preset.

## Risograph

STYLE: "Risograph" (follow it unless the request says otherwise). Two-ink print: grainy halftone, pink and blue slightly out of register, chunky type on off-white paper.
- Stage background: #f4efe6. Colours: text #1d3fbb, secondary text #5a6bb0, accent #ff4f8b, second accent #ffd23f. Use the accent sparingly, on what matters most.
- Fonts: headlines "Bricolage Grotesque" weight 800 in capitals; other text "Space Mono" weight 700. Set stage.fonts to [{ "family": "Bricolage Grotesque", "href": "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Space+Mono:wght@400;700&display=swap" }].
- Motion: headlines enter with text-slam {"scale":1.6,"blur":0}, other text with wipe {"from":"left"}, shapes with halftone; exits use wipe {"direction":"out","from":"left"}. Entrances ease "steps(5)", exits "power2.in". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "tap", exits "swish", landings "thud", accents "click".
- What makes it Risograph: Two or three flat inks (fluorescent pink, blue, yellow) on off-white paper, visible halftone dots and grain, plates printed slightly out of register, chunky type; moves feel stepped, like flipping prints. Someone should recognise the style from any single frame.
- How to build it here: The halftone clip on photos and big shapes (ink = accent, offset 0.4-0.8); text in the blue ink with text-3d (color = accent, depth 2) for the misregistered plate; steps() easing; a boil clip at fps 6 for a printed jitter. Its signature effect is the "halftone" preset.

## VHS and CRT

STYLE: "VHS and CRT" (follow it unless the request says otherwise). An old tape: scanlines, colour bleed, a rolling tracking band, timestamp text and jumpy cuts.
- Stage background: #05060a. Colours: text #f2f2f2, secondary text #a0a0a0, accent #ff2a6d, second accent #05d9e8. Use the accent sparingly, on what matters most.
- Fonts: headlines "VT323" weight 400 in capitals; other text "VT323" weight 400. Set stage.fonts to [{ "family": "VT323", "href": "https://fonts.googleapis.com/css2?family=VT323&display=swap" }].
- Motion: headlines enter with text-typewriter, other text with fade {"y":0}, shapes with fade {"y":0}; exits use tr-glitch. Entrances ease "steps(6)", exits "steps(4)". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "click", exits "glitch", landings "thud", accents "beep".
- What makes it VHS and CRT: Scanlines, red/blue colour bleed at the edges, soft vignette, a tracking band rolling through, jittering frame; on-screen camcorder text (PLAY, REC, a date stamp) in a pixel font; cuts that glitch. Someone should recognise the style from any single frame.
- How to build it here: A scanlines clip across the whole scene (bleed 0.3-0.6, jitter 0.2); a REC dot that blinks (pulse); a VT323 timestamp in a corner; tr-glitch between parts; grade "faded" on footage; stepped eases. Its signature effect is the "scanlines" preset.

## Pixel art

STYLE: "Pixel art" (follow it unless the request says otherwise). Retro game screens: chunky pixels, a pixel font, stepped moves and bleeps.
- Stage background: #1b1b3a. Colours: text #ffffff, secondary text #a8a8d8, accent #ffcd3c, second accent #3cff9e. Use the accent sparingly, on what matters most.
- Fonts: headlines "Press Start 2P" weight 400 in capitals; other text "Press Start 2P" weight 400. Set stage.fonts to [{ "family": "Press Start 2P", "href": "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" }].
- Motion: headlines enter with pixelate {"size":28}, other text with text-typewriter, shapes with pixelate {"size":16}; exits use pixelate {"direction":"out","size":28}. Entrances ease "steps(6)", exits "steps(6)". Pace snappy: shorter moves and tighter gaps. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "beep", exits "glitch", landings "tap", accents "success".
- What makes it Pixel art: Everything on a coarse pixel grid; limited palette; a blocky pixel font; things move in whole steps (no smooth easing); sprites blink and bounce; 8-bit sounds. Someone should recognise the style from any single frame.
- How to build it here: Pixelate entrances and exits (steps easing, size 16-32); Press Start 2P for all text (small sizes read best: 3-5 units); jiggle for idle sprites; shapes with no radius; beep/tap sounds on every move. Its signature effect is the "pixelate" preset.

## Watercolour and ink

STYLE: "Watercolour and ink" (follow it unless the request says otherwise). Hand-painted: soft washes and ink lines brushed onto textured paper, slow and quiet.
- Stage background: #faf6ee. Colours: text #2c2a33, secondary text #6f6a78, accent #3f7cac, second accent #e07a5f. Use the accent sparingly, on what matters most.
- Fonts: headlines "Caveat" weight 700; other text "Lora" weight 400. Set stage.fonts to [{ "family": "Caveat", "href": "https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Lora:wght@400;500&display=swap" }].
- Motion: headlines enter with brush {"strokes":2}, other text with fade {"y":6,"blur":0.4}, shapes with brush {"strokes":4}; exits use fade {"y":0,"blur":0.6}. Entrances ease "power1.inOut", exits "power1.in". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "soft-pop", accents "chime".
- What makes it Watercolour and ink: Soft, uneven colour washes with darker edges, ink outlines, visible paper texture; handwritten titles; things paint on in strokes rather than sliding; long, quiet pacing. Someone should recognise the style from any single frame.
- How to build it here: Shapes or images with soft edges (blur 0.2-0.4) and the brush reveal (2-4 strokes, 1.2-1.8 s); line art with draw for ink; Caveat headlines; a faint paper texture image over everything at opacity 0.15; no hard cuts. Its signature effect is the "brush" preset.

## Hand-drawn cel

STYLE: "Hand-drawn cel" (follow it unless the request says otherwise). Traditional 2D animation: bold outlines that boil, flat colours, squash and stretch, on twos.
- Stage background: #fff8e7. Colours: text #1c1c1c, secondary text #5e5e5e, accent #ff5e3a, second accent #2a9df4. Use the accent sparingly, on what matters most.
- Fonts: headlines "Luckiest Guy" weight 400 in capitals; other text "Nunito" weight 700. Set stage.fonts to [{ "family": "Luckiest Guy", "href": "https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@700&display=swap" }].
- Motion: headlines enter with text-slam {"scale":1.8,"blur":0}, other text with pop {"from":0.5}, shapes with pop {"from":0.3}; exits use pop {"direction":"out"}. Entrances ease "steps(6)", exits "steps(4)". Pace steady. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: on the key moments: entrances "pop", exits "swish", landings "impact", accents "sparkle".
- What makes it Hand-drawn cel: Thick black outlines that wobble slightly on every drawing (line boil), flat fills, squash-and-stretch on impacts, animation "on twos" (12 drawings a second) rather than perfectly smooth. Someone should recognise the style from any single frame.
- How to build it here: A boil clip (amount 2.5-3.5, fps 12) on the whole drawing group; shapes with a dark 0.6-0.8 stroke and flat fills; pop/jiggle with steps(6) easing for "on twos"; text-3d (depth 2, dark) on the title for a cartoon drop shadow. Its signature effect is the "boil" preset.

## Liquid and morph

STYLE: "Liquid and morph" (follow it unless the request says otherwise). Fluid shapes that pour and merge, gradients that flow, everything morphing instead of cutting.
- Stage background: #0a0612. Colours: text #ffffff, secondary text #bba9d6, accent #ff4ecd, second accent #5c7cff. Use the accent sparingly, on what matters most.
- Fonts: headlines "Syne" weight 800; other text "Syne" weight 500. Set stage.fonts to [{ "family": "Syne", "href": "https://fonts.googleapis.com/css2?family=Syne:wght@500;800&display=swap" }].
- Motion: headlines enter with text-blur {"by":"chars","stagger":0.03}, other text with fade {"y":10,"blur":0.5}, shapes with liquid; exits use fade {"y":0,"blur":0.8}. Entrances ease "power3.inOut", exits "power3.in". Pace calm: longer moves and more breathing room. Vary supporting entrances a little where it helps, but keep this personality.
- Sounds: a few, only the key moments: entrances "swell", exits "whoosh-out", landings "soft-pop", accents "shimmer".
- What makes it Liquid and morph: Organic blobs that wobble and merge, flowing gradients, one shape morphing into the next scene instead of a cut; soft blur on type; slow, continuous motion. Someone should recognise the style from any single frame.
- How to build it here: Large ellipse or rect shapes with gradient fills and a long liquid clip (speed 0.4-0.8); gradient-flow on fills; morph from one layer into the next between parts (morph preset "to" the next scene’s main shape); text-blur by chars. Its signature effect is the "liquid" preset.
