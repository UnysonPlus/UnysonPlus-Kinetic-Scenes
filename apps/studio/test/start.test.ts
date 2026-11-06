// The start screen: when it opens, what counts as a web address, and the request a choice makes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { START_FORMATS, shouldShowStart, startProjectName, startRequest, startUrl } from '../src/lib/start.ts';

const reel = START_FORMATS[0], web = START_FORMATS.find((f) => f.id === 'web')!;

test('it opens with the Studio, but not over a job the person arrived with', () => {
  assert.equal(shouldShowStart('', false), true);
  assert.equal(shouldShowStart('', true), false);
  assert.equal(shouldShowStart('?project=My%20reel', false), false);
  assert.equal(shouldShowStart('?connect=unysonplus', false), false);
});

test('a typed address is completed, and what is not one is refused', () => {
  assert.equal(startUrl('example.com'), 'https://example.com/');
  assert.equal(startUrl(' http://example.com/a '), 'http://example.com/a');
  for (const bad of ['', 'not a site', 'localhost', 'ftp://example.com', 'javascript://example.com']) assert.equal(startUrl(bad), null, bad);
});

test('a described idea asks for a new scene in the chosen format and length', () => {
  const r = startRequest({ text: ' A reel about booking ', format: reel, seconds: 20 });
  assert.equal(r.text, 'A reel about booking');
  assert.equal(r.scope, 'new');
  assert.equal('url' in r, false);
  assert.match(r.brief!, /9:16/);
  assert.match(r.brief!, /about 20 seconds/);
});

test('a website carries its address and any focus; a web animation has no video brief', () => {
  const r = startRequest({ text: 'The pricing', url: 'https://example.com/', format: web, seconds: 0 });
  assert.equal(r.url, 'https://example.com/');
  assert.equal(r.brief, 'FOCUS: The pricing');
  const plain = startRequest({ text: '', url: 'https://example.com/', format: web, seconds: 0 });
  assert.equal(plain.text, 'https://example.com/');
  assert.equal('brief' in plain, false);
});

test('a project is named from the idea or the website', () => {
  assert.equal(startProjectName('A reel about booking an appointment in two taps.'), 'A reel about booking an appointment');
  assert.equal(startProjectName('', 'https://www.example.com/pricing'), 'example.com');
  assert.equal(startProjectName('   '), 'New video');
});

test('voice and music are asked for only when chosen', () => {
  const none = startRequest({ text: 'An idea', format: reel, seconds: 0 });
  assert.equal(none.voice, false);
  assert.equal(none.music, false);
  assert.equal(startRequest({ text: 'An idea', format: reel, seconds: 0, voice: true }).voice, true);
});

test('a paper explainer carries its story and picture rules', () => {
  const r = startRequest({ text: 'How email works', format: reel, seconds: 30, extra: 'PAPER CUT-OUT EXPLAINER: test' });
  assert.match(r.brief!, /9:16/);
  assert.match(r.brief!, /PAPER CUT-OUT EXPLAINER/);
});
