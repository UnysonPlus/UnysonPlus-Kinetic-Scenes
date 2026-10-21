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
