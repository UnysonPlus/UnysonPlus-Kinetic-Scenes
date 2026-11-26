---
name: kinetic-scenes
description: Make motion-graphics scenes for Unyson+ Kinetic Scenes (animated website heroes, banners, explainers, product tours and short videos) as scene files built from presets on a timeline. Use when asked to make, change, review or time a Kinetic Scene, a hero animation, an explainer video or a product tour for Kinetic Scenes or the Unyson+ Kinetic Scene element.
---

# Kinetic Scenes

Kinetic Scenes (https://kinetic-scenes.unysonplus.com/) plays **scene files**: JSON data with a stage, layers and
clips (presets placed on a timeline). You write data, never code, so whatever you make lands in the Studio as
ordinary layers and clips the person can keep editing. This skill is generated from the Studio's own code
(version 0.1.87), so the presets, settings and rules here are exactly what the player understands.

## Read first

- [The scene file](reference/scene-format.md): every field and layer type.
- [Presets](reference/presets.md): every preset, what it does, what it applies to and its settings.
- [Motion rules](reference/motion-rules.md): timing, layout, sound and craft rules the Studio's own AI follows.
- [Styles](reference/styles.md): the built-in looks (colours, fonts, motion) a scene can be made in, including about twenty
  named motion-design styles (synthwave, line art, Swiss grid, risograph, VHS, pixel art, newsreel, whiteboard, blueprint, woodcut, neon sign, rhythm game show, chalkboard, ink wash, stained glass, rubber-hose cartoon, CRT terminal, transit map, radar, thermal camera, X-ray, sketchnote, ukiyo-e, silent film, exploded view, ink silhouette, 90s low poly…) with what makes each recognisable
  and how to build it.
- [Sounds](reference/sounds.md): the built-in sound effects.

## Without the AI Dev Kit (a chat AI with no tools)

A chat AI that cannot run the kit's tools (ChatGPT, Gemini or Claude in a browser or phone app) can still make a
scene: write the **whole scene file as one JSON code block**, valid against [the scene file](reference/scene-format.md)
and using only the presets in [the preset library](reference/presets.md). Then tell the person:

1. Open https://kinetic-scenes.unysonplus.com/ **on a computer** (the Studio's editor is made for a mouse and a big
   screen; on a phone they can look around and play scenes, not edit comfortably).
2. Close the start box, open the **Scene file** tab on the right, select all of its text and paste yours over it.
   It applies by itself as soon as it is valid. If the tab lists problems, they paste them back to you: fix them and
   send the whole file again.
3. Or save your JSON as `scene.json` and open it with **File › Open**.

Keep it simple enough to be right the first time: a few acts, presets you can see in the library, no pictures or
footage they don't have yet (use shapes and text, or `https://` pictures that allow being shown). Pictures, a
voice-over, music, checks and stills of every frame need the free [AI Dev Kit](https://github.com/UnysonPlus/UnysonPlus-AI-Dev-Kit),
which connects Claude Code, Codex (ChatGPT's coding agent) or Cursor to the tools below.

## How to work

0. **In a workspace project, read its notes first** (`notes.md`: the plan, what was decided, what is left; MCP
   `project_notes`, or `kinetic-scenes notes "<project>"`), and add a line when something is decided or done, so the
   person and the next session can carry on.
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
   (which returns the frames as images), `scene_timeline` (one picture of a stretch: frames, the sound wave, every
   spoken word at its time with pauses inside a phrase marked, and the words on screen; use it wherever there is a
   voice-over), plus `scene_inspect`, `scene_render`, `audio_beats` (land reveals on the
   music), `audio_transcribe` (time the scene to a voice) and `audio_separate` (the voice and the music of a clip
   as two tracks: transcribe the voice alone, or drop or replace the music).
   **Review list, for each settled frame:**
   - Alignment: things that belong together share an edge or a centre; a list sits centred under its heading.
   - Spacing: equal gaps between the items of a list; ticks and bullets next to their words.
   - Panels: words have room inside a panel and never touch or cross its edge; captions sit clear of panels.
   - Balance: nothing crowds one side while the other is empty; the frame isn't cramped or cluttered.
   - Reading: nothing cut off; text big enough, up long enough and with enough contrast to read.
4. **Hand it over for preview, not as a video.** Put the scene where the person can play it in the Studio (with the
   AI Dev Kit: a workspace project, `project_save` / `kinetic-scenes project`, and give them its link), with a
   one-line summary of what you made and anything they should decide. **Do not render the video until they ask for
   it.** The Studio plays the scene exactly as the render will look; a render takes minutes and is wasted if the
   person wants changes. Stills for your own review are fine; the final video is made when they ask (or they export
   it themselves with Export › Video). When they ask, the render checks the finished video (every voice line heard,
   black frames, loudness, clipping; `video_check`): fix what it reports and render again before handing it over.
   To speak a script with the kit's voice engine use `voice_over`; for several takes of a line, `voice_best_take`; for
   recorded speech, `footage_cleanup`.
   When a scene is made from photos only (no footage), read `scene_guide` topic `cutouts` and cut the subject out of the
   photos with `image_cutout`, so they move as layers (lift, depth, a camera push) instead of reading as a slideshow.
5. **Time to the voice with word pins.** With a voice-over, pin what belongs to a spoken word (`at` / `until` on a
   layer, `at` on a clip: { `audio`, `text` }) instead of typing its seconds, and keep the voice clip's `script` and
   `voiceId`. Then a better take, a reworded line, a spreadsheet row's own narration ({{placeholders}} in the script)
   or a translation (`scene_translate` / `kinetic-scenes translate "<project>" --to es`) re-times the scene by itself.
   A translation is a new project: check it and look at its stills like any other (lines that got longer can run
   into the next voice-over; it says which).

## Checklist

- One big idea per act; a short, bold headline with a supporting line. Text fits its breakpoint and the safe area.
- Every text layer readable at every breakpoint (give narrower layouts overrides).
- Entrances under about 0.8 s; a held frame long enough to read (about 0.3 s per word, at least 0.8 s).
- No two acts in a row with the same entrance and layout; two or three transition styles per scene.
- A pause of 0.3 to 0.75 s before the biggest payoff; the biggest idea gets the biggest moment.
- Sound sparse and tied to what is seen (3 to 6 sounds per 10 s); landing sounds at "end".
- Real content only: never invent statistics, claims, names or addresses the request did not give.
- `posterTime` on a settled moment with every word in place.
- The film's shape: something happens in the first half-second, one hero moment about two-thirds through, and a composed
  end frame held about a second with gentle movement. Plan those key frames as stills first, then the motion.
- A named style shows in every frame (its palette, type, texture and way of moving), not only in the title.
- Review like a jury: score style, idea, motion, design, finish, sound and technical from frames across the whole scene, fix
  the weakest first with a moment and numbers, and never leave a problem Check scene measured.
