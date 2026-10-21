---
name: kinetic-scenes
description: Make motion-graphics scenes for Unyson+ Kinetic Scenes (animated website heroes, banners, explainers, product tours and short videos) as scene files built from presets on a timeline. Use when asked to make, change, review or time a Kinetic Scene, a hero animation, an explainer video or a product tour for Kinetic Scenes or the Unyson+ Kinetic Scene element.
---

# Kinetic Scenes

Kinetic Scenes (https://kinetic-scenes.unysonplus.com/) plays **scene files**: JSON data with a stage, layers and
clips (presets placed on a timeline). You write data, never code, so whatever you make lands in the Studio as
ordinary layers and clips the person can keep editing. This skill is generated from the Studio's own code
(version 0.0.58), so the presets, settings and rules here are exactly what the player understands.

## Read first

- [The scene file](reference/scene-format.md): every field and layer type.
- [Presets](reference/presets.md): every preset, what it does, what it applies to and its settings.
- [Motion rules](reference/motion-rules.md): timing, layout, sound and craft rules the Studio's own AI follows.
- [Styles](reference/styles.md): the built-in looks (colours, fonts, motion) a scene can be made in.
- [Sounds](reference/sounds.md): the built-in sound effects.

## How to work

1. **Plan before building.** Write a storyboard: the hook in the first two seconds, the highlights in order, the
   ending (a call to action), each act's length, what appears one by one, the transitions and the sound. For an
   explainer, write the narration first, split into segments that each name what the screen shows. Agree it
   with the person before building when you can.
2. **Build the layers, then the clips.** Lay out each act (a top-level group per act), then time the entrances,
   holds and exits. One new thing at a time; the picture lands just before the words that describe it.
3. **Check it.** Validate the file (the Studio's Check scene, or the AI Dev Kit's `kinetic-scenes check
   scene.json`), then look at rendered frames (`kinetic-scenes stills scene.json`): the settled frame of every act
   and the middle of every transition. Fix cramped layouts, low contrast, unreadable text and muddy transitions.
   Repeat at most a few times. With the kit's MCP server connected (`studio-mcp.mjs`), the same steps are the
   tools `scene_check` and `scene_stills` (which returns the frames as images), plus `scene_inspect`,
   `scene_render`, `audio_beats` (land reveals on the music) and `audio_transcribe` (time the scene to a voice).
4. **Hand it over** with a one-line summary of what you made and anything the person should decide.

## Checklist

- One big idea per act; a short, bold headline with a supporting line. Text fits its breakpoint and the safe area.
- Every text layer readable at every breakpoint (give narrower layouts overrides).
- Entrances under about 0.8 s; a held frame long enough to read (about 0.3 s per word, at least 0.8 s).
- No two acts in a row with the same entrance and layout; two or three transition styles per scene.
- A pause of 0.3 to 0.75 s before the biggest payoff; the biggest idea gets the biggest moment.
- Sound sparse and tied to what is seen (3 to 6 sounds per 10 s); landing sounds at "end".
- Real content only: never invent statistics, claims, names or addresses the request did not give.
- `posterTime` on a settled moment with every word in place.
