# Film-brief benchmark (Phase 19)

AI assist gets the kinds of brief that people publish motion films for, each in a matching motion-design style, then
reviews its own work with the 7-point jury. Run with `run.mts` (see its header). The published films of each kind were
only a reference for judging; nothing was copied.

## First run, 2026-10-28 (player 0.0.47, Claude through the AI Dev Kit)

Jury scores (1-5) before the jury's own fixes:

| Brief | Style | style | idea | motion | design | finish | sound | technical | seconds |
|---|---|---|---|---|---|---|---|---|---|
| App launch | Dark tech keynote | 4 | 3 | 2 | 3 | 2 | 4 | 2 | 254 |
| Logo reveal | Liquid and morph | 4 | 4 | 3 | 3 | 2 | 3 | 3 | 219 |
| Poster breaking out | Collage | 4 | 4 | 3 | 2 | 2 | 3 | 2 | 444 |
| A history in 20 s | Swiss grid | 4 | 4 | 2 | 2 | 2 | 3 | 2 | 336 |
| Wordless explainer | Flat vector | 4 | 4 | 3 | 4 | 3 | 3 | 4 | 335 |
| **Average** | | **4.0** | **3.8** | **2.6** | **2.8** | **2.2** | **3.2** | **2.6** | 318 |

The style always lands. Finish, motion and technical are the gaps, and the same four mistakes caused most of them:

1. Supporting text too small (5-11 px: subtitles, dates, taglines), with too steep a jump from the headline.
2. Two clips on one layer at once (an entrance fade overlapping a drift or a gradient), so they fight.
3. Stacked words colliding (a huge year over its caption, a rule through the digits); words overflowing their panel.
4. One bouncy entrance on everything, more than one spring, and stretches of 2 s where nothing moves.

## Fixes made from it

- MOTION_RULES gained "MISTAKES TO AVOID" with concrete numbers for each (supporting text at least 2.6 on 16:9 with a
  2.5-4x jump, ambient clips only between entrance and exit, a gap of half the big line's size between stacked lines,
  panels 4 wider than their words, one spring, no still stretch over 1.5 s).
- The starter scenes' glow fade-in was shortened to 0.7 s after the jury flagged it as slow.

Next run: compare the averages after these rules, brief by brief.
