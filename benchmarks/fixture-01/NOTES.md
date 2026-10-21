# Benchmark fixture-01

A 10-second, 9:16 side-by-side race explainer: two panels ("virtual machines" boot their operating systems
while "containers" are ready almost at once), with running timers, status pills that change their words,
dashed boxes that march while booting and close up when ready, progress bars, and app cards stacking in.
Rebuilt from measurements (positions in % of the frame, times in seconds) of a hand-made reference video,
which is not kept in this repository.

`node benchmarks/fixture-01/make.mjs` writes `scene.json`; open it in the Studio (Open) to play it.

## Round 1 (player 0.0.37)

Built entirely from Phase 9 pieces: Repeat from a list (the three boxes and the three apps, from one item
each), Count up as timers, Change text in pills, dashed outlines with Marching outline and Make solid,
Progress bar, Stack, and a fade out to the empty panels for the loop.

Matched the reference: layout and proportions of both panels and their stacked layer bars, the race timing
(containers ready at about 1.2 s, the virtual machines counting to 45 s and getting their apps at about
4.5 s), the timers, the boot progress, the boxes closing up when ready, the loop back to empty panels.

Gaps found, and fixed in the tools:
- Text could not carry a pill sized to its words. Text layers now take `pill` (outline, fill, padding, radius).
- Change text did not resize the box around the words; now a layer without a width glides from the old
  words' width to the new.
- The pill's width was only updated while a swap ran, so before the first swap it kept the width measured
  before the web font loaded, and a whole-pixel measurement could wrap the last word. Swaps now redraw after
  every update and measure fractional widths.
- A roll inside a pill spilled sideways out of it; a box sized to its words now clips the roll to itself.

Still to compare frame by frame against the reference (round 2, needs the reference video): exact easing of
the stacking cards, the reference's double outline on the app cards (two shapes today), and the title type.
