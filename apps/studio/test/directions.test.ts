// Three directions first: the AI's three blocks become cards; a picked one becomes the brief.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { directionBrief, parseDirections } from '../src/lib/directions.ts';

const answer = `Here are three.

DIRECTION 1: Quiet Confidence
Mood: calm, assured
Pace: calm, long holds
Look: big serif type, slow fades
Colours: #0B0F1A, #F5F1E8, #C8A15A
Font: Playfair Display
Opening: the brand name alone on a dark field.

DIRECTION 2 - "Punchy Launch"
Mood: loud, energetic
Pace: punchy, cuts on the beat
Look: heavy sans, slams and wipes
Colours: #00B295 #FFFFFF #1C1E22
Font: 'Inter'
Opening: a full-screen word slams in.

Direction 3: Paper Craft
Mood: warm, handmade
Pace: steady
Look: torn-paper shapes, sticker type
Colors: #F2E8D5, #2B2B2B, #E4572E, #4C9F70
Font: Caveat
Opening: a paper card slides onto a desk.`;

test('three blocks, whatever their punctuation, become three directions', () => {
  const d = parseDirections(answer);
  assert.equal(d.length, 3);
  assert.deepEqual(d.map((x) => x.name), ['Quiet Confidence', 'Punchy Launch', 'Paper Craft']);
  assert.deepEqual(d[1].colours, ['#00B295', '#FFFFFF', '#1C1E22']);
  assert.equal(d[1].font, 'Inter');
  assert.equal(d[2].colours.length, 4);
});

test('an answer that is not directions gives none (the request then carries on as before)', () => {
  assert.deepEqual(parseDirections('A plan: open on the logo, then three features.'), []);
});

test('the picked direction becomes a brief the build follows', () => {
  const b = directionBrief(parseDirections(answer)[0]);
  assert.match(b, /THE CHOSEN DIRECTION/);
  assert.match(b, /#0B0F1A, #F5F1E8, #C8A15A \(the first is the background\)/);
});
