// Scene links (?scene=<address>): which addresses open, and how a scene's media finds its files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readSceneLink, sceneLinkUrl } from '../src/lib/sceneLink.ts';
import { shouldShowStart } from '../src/lib/start.ts';

test('only https addresses on unysonplus.com sites are opened', () => {
  const ok = '?scene=' + encodeURIComponent('https://share.unysonplus.com/cafe/scene.json');
  assert.equal(sceneLinkUrl(ok)?.hostname, 'share.unysonplus.com');
  assert.equal(sceneLinkUrl('?scene=' + encodeURIComponent('https://unysonplus.com/a.json'))?.hostname, 'unysonplus.com');
  assert.equal(sceneLinkUrl('?scene=' + encodeURIComponent('http://share.unysonplus.com/cafe/scene.json')), null);
  assert.equal(sceneLinkUrl('?scene=' + encodeURIComponent('https://evil.example/scene.json')), null);
  assert.equal(sceneLinkUrl('?scene=' + encodeURIComponent('https://unysonplus.com.evil.example/s.json')), null);
  assert.equal(sceneLinkUrl('?scene=' + encodeURIComponent('https://notunysonplus.com/s.json')), null);
  assert.equal(sceneLinkUrl('?scene=not-a-url'), null);
  assert.equal(sceneLinkUrl(''), null);
});

test('a scene link skips the start screen', () => {
  assert.equal(shouldShowStart('?scene=x', false), false);
});

test('media paths become addresses next to the scene file, and code clips are removed', async () => {
  const scene = {
    format: 'unysonplus-scene', version: 1, title: 'Cafe', duration: 5,
    stage: { breakpoints: [{ id: 'd', minWidth: 0, aspect: [9, 16] }] },
    layers: [
      { id: 'pic', type: 'image', src: 'media/p02.jpg', box: { x: 50, y: 50, w: 100, h: 100 }, clips: [{ id: 'c', preset: 'code', start: 0, duration: 1 }] },
      { id: 'words', type: 'text', text: 'logo.png', box: { x: 50, y: 50 }, style: { fontSize: 4 }, clips: [] },
    ],
  };
  const real = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify(scene), { status: 200 })) as typeof fetch;
  try {
    const r = await readSceneLink(new URL('https://share.unysonplus.com/cafe/scene.json'));
    const [pic, words] = r.scene.layers as unknown as Array<{ src?: string; text?: string; clips: unknown[] }>;
    assert.equal(pic.src, 'https://share.unysonplus.com/cafe/media/p02.jpg');
    assert.equal(pic.clips.length, 0);
    assert.equal(r.strippedCode, 1);
    assert.equal(words.text, 'logo.png');
  } finally {
    globalThis.fetch = real;
  }
});

test('a missing scene says it is no longer online', async () => {
  const real = globalThis.fetch;
  globalThis.fetch = (async () => new Response('', { status: 404 })) as typeof fetch;
  try {
    await assert.rejects(readSceneLink(new URL('https://share.unysonplus.com/gone/scene.json')), /no longer online/);
  } finally {
    globalThis.fetch = real;
  }
});
