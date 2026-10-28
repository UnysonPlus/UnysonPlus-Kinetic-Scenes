# The scene file

A Kinetic Scenes scene is one JSON object (format `unysonplus-scene`, version 1). It is data: a stage, layers drawn
bottom to top, and clips (presets on a timeline) that animate them. Every frame is a pure function of time, so a
scene plays, seeks and exports the same way.

```json
{
  "format": "unysonplus-scene", "version": 1, "title": "Short title", "duration": 8,
  "stage": {
    "breakpoints": [ { "id": "desktop", "label": "Desktop", "minWidth": 1024, "aspect": [16, 9] },
                     { "id": "mobile", "label": "Mobile", "minWidth": 0, "aspect": [4, 5] } ],
    "heightMode": "ratio", "background": "#0a0d11", "safeArea": 0.06,
    "fonts": [ { "family": "Inter", "href": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" } ]
  },
  "playback": { "trigger": "view", "loop": true, "repeatDelay": 0.4, "posterTime": 3 },
  "layers": [],
  "audio": [], "markers": [], "camera": { "keys": [] }
}
```

## Units

- `box.x`, `box.y`: where the layer's anchor point sits, in % of the stage width and height.
- `box.w`: % of the stage width; `box.h`: % of the stage height, or `box.ratio` (width / height) instead.
- Font sizes, stroke widths and radii are **stage units**: 1 = 1% of the stage width, so 10 is a tenth of it.
- Times are seconds. A group's children run on the group's own clock (0 = the group's `start`).

## Stage and playback

- `breakpoints`: layouts by width (widest first); a breakpoint with `minRatio` is a layout by shape, used only when
  the stage is at least that much wider than tall (an ultrawide hero). Layers change per breakpoint with
  `overrides: { "<breakpoint id>": { "box": {}, "style": {}, "text": "", "hidden": true } }`.
- `heightMode`: `ratio` (keep the shape), `ratio-capped` (never taller than the window), `fill` (exactly the window).
  `heightOffset` (px) subtracts a site header; `fit: "contain"` shows the whole shape on short windows.
- `playback.trigger`: `load`, `view`, `manual` or `scroll` (`scroll: { pin, length, smooth }`); `loop`,
  `repeatDelay`; `loopFrom` (loop only the last part); `posterTime` (the still frame); `advance: "click"` (a
  presentation that stops at each marker).

## Video mode

`"mode": "video"` and `"video": { "formats": ["9x16", "1x1"], "fps": 30, "platform": "tiktok", "transparent": false }`
make a fixed-format video (Reels, TikTok, Shorts, YouTube) or, with `transparent`, graphics to lay over footage.
Each format is a breakpoint with the same id, all with `minWidth: 0`, told apart by `minRatio` (the narrowest shape
has none); `heightMode` is `fill`, playback `{ "trigger": "load", "loop": false }`. `platform` is `tiktok`, `reels`,
`shorts`, `youtube` or `none`: keep words out of the area that app covers (Check scene reports it).

## Layers

Every layer: `id` (unique, letters/digits/-/_), `name`, `type`, `box` (not for flow, repeat, group), `clips`, and
optionally `start` / `end` (seconds it is there), `opacity`, `overrides`, `link`, `pin: "stage"`, `depth`, `hover`.

| type | what it is | its own fields |
| --- | --- | --- |
| `text` | words | `text` (`\n` for a line break), `style` { `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` (em), `color`, `align`, `uppercase`, `italic` }, `pill` { `stroke`, `fill`, `padX`, `padY`, `radius` } |
| `shape` | a rectangle or ellipse | `shape`, `fill` (colour or gradient), `stroke`, `strokeWidth`, `radius`, `dash`, `dashGap` |
| `image` | a picture | `src` (https or data URL), `alt`, `fit` (`cover`, `contain`), `radius`, `frame` (phone, browser, polaroid, film, card) |
| `video` | footage | `src` (a video data URL or https), `offset` (seconds into the file it starts), `rate` (0.25-4), `fit`, `radius`, `frame` (phone, browser, polaroid, film, card), `reference` (shown while designing, left out of a graphics-only export), `sound` (its volume in video exports, 0-2), `track` (the face path the kit finds, for the follow preset), `alt` |
| `model` | a 3D object | `model` { `kind`: text, shape, svg, gltf … }, `material`, `pose`, `light`, `alt`, `animation` { `clip` (a name or "all"), `speed`, `loop` } (a gltf model's own animation, played on the scene's clock) |
| `lottie` | a Lottie (After Effects) animation, played on the scene's clock | `src` (a .json address, data URL or the JSON), `speed`, `loop` (false: play once, hold the last frame), `from` (seconds into it), `colours` { "#from": "#to" }, `texts` { old: new }, `alt` |
| `group` | layers kept together | `layers`, `duration`; presets on the group move the whole group |
| `path` | a line | `d` (SVG path data, 0-100 across and down its box), `stroke`, `strokeWidth`, `glow`, `dash`, `arrow` (`end`, `start`, `both`), `fill` |
| `flow` | glowing curves joining two layers | `from`, `to` (layer ids), `count`, `spread`, `pinch`, `wave`, `colors`, `width`, `glow`, `pulses`, `pulseSpeed`, `fromSide`, `toSide` |
| `diagram` | nodes and connections | `nodes` [{ `id`, `x`, `y` (% of its box), `label`, `sub`, `shape` (box, pill, circle, dot, value), `color`, `at`, `moves` }], `edges` [{ `from`, `to`, `kind` (curve, straight, step), `label`, `dashed`, `arrow`, `at` }], `tag` { `label`, `stops` [{ `node`, `t` }] }, `look` |
| `code` | an editor or terminal | `code`, `title` (file name: sets the language), `language`, `frame` (window, terminal, plain), `run`, `theme`, `fontSize`, `lineNumbers` |
| `repeat` | a list | `item` (one layer, usually a group, with `{{field}}` placeholders), `items` [{ … }], `step` { `x`, `y` }, `columns`, `rowStep`, `stagger` |
| `captions` | the words of a voice-over | `style`, `audio` (clip id), `maxWords`, `mode` (word, karaoke, none), `motion` (pop, slam, drop), `highlight`, `background`, `effect` (none, outline, shadow, glow, chrome: the look on the letters), `effectColor` (the outline or glow colour) |
| `cursor` | a pointer for tours | `shape` (auto, arrow, hand), `theme`, `ringColor`; its box x / y is where the TIP starts |

Other layer fields:

- `link`: { `href`, `newTab`, `label`, `jump` (a marker id or seconds: a hotspot that plays the scene from there) }.
- `pin: "stage"`: a top-level layer placed against the stage itself (corner badges); ignores the camera.
- `depth`: -1 (far) to 1 (near): parallax with camera pans and zooms.
- `hover`: { `effect`: lift, grow, glow, brighten, shine, underline, color; `color` } for visitors with a mouse.

## Clips

`{ "id", "preset", "start", "duration", "ease"?, "params"?, "sound"? }`. `id` is unique in the scene; `preset` is an id
from the preset list; `params` only uses keys that preset lists. `sound`: { `name` (a built-in sound), `at` (start,
end), `delay`, `volume`, `pitch` }. Presets that enter and leave take `"direction": "in" | "out"`.

## Audio, markers, camera, steps

- `audio`: [{ `id`, `src` (a file, or `sfx:<name>`), `start`, `offset`, `duration`, `volume`, `fadeIn`, `fadeOut`,
  `role` (voice, music, sfx), `words` (transcribed: { `w`, `t`, `d`, `s` }), `beats`, `envelope`, `group` (parts cut
  from one recording share it: captions that follow one part follow them all) }].
- `markers`: [{ `id`, `t`, `label` }] for presentations and hotspots.
- `camera.keys`: [{ `id`, `t`, `x`, `y` (pan, % of the stage), `zoom`, `roll`, `tiltX`, `tiltY`, `ease` }].
- `steps`: [{ `id`, `label`, `hold`, `do`: [{ `layer`, `preset`, `params`, `duration`, `offset` }] }]: a walkthrough
  the Studio turns into clips and markers.
