---
name: kinetic-scenes
description: Make motion-graphics scenes for Unyson+ Kinetic Scenes (animated website heroes, banners, explainers, product tours and short videos) as scene files built from presets on a timeline. Use when asked to make, change, review or time a Kinetic Scene, a hero animation, an explainer video or a product tour for Kinetic Scenes or the Unyson+ Kinetic Scene element.
---

# Kinetic Scenes

Kinetic Scenes (https://kinetic-scenes.unysonplus.com/) plays **scene files**: JSON data with a stage, layers and
clips (presets placed on a timeline). You write data, never code, so whatever you make lands in the Studio as
ordinary layers and clips the person can keep editing. This skill is generated from the Studio's own code
(version 0.0.67), so the presets, settings and rules here are exactly what the player understands.

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
3. **Check it, then review every settled frame.** Validate the file (the Studio's Check scene, or the AI Dev Kit's
   `kinetic-scenes check scene.json`), then render the frames (`kinetic-scenes stills scene.json`): one frame of
   every part at the moment it has fully landed (everything in, nothing leaving yet), each measured for layout.
   Fix every layout problem it reports (words on words, a tick far from its words, uneven or off-centre lists, words
   crossing or touching a panel's edge, words off the stage). Then look at each frame yourself and write one line
   about it against the review list below; fix what fails and render again. Repeat at most a few times. With the
   kit's MCP server connected (`studio-mcp.mjs`), the same steps are the tools `scene_check` and `scene_stills`
   (which returns the frames as images), plus `scene_inspect`, `scene_render`, `audio_beats` (land reveals on the
   music), `audio_transcribe` (time the scene to a voice) and `audio_separate` (the voice and the music of a clip
   as two tracks: transcribe the voice alone, or drop or replace the music).
   **Review list, for each settled frame:**
   - Alignment: things that belong together share an edge or a centre; a list sits centred under its heading.
   - Spacing: equal gaps between the items of a list; ticks and bullets next to their words.
   - Panels: words have room inside a panel and never touch or cross its edge; captions sit clear of panels.
   - Balance: nothing crowds one side while the other is empty; the frame isn't cramped or cluttered.
   - Reading: nothing cut off; text big enough, up long enough and with enough contrast to read.
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
