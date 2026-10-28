import type { Scene } from '@unysonplus/scene-player/types';
import playerScript from '@unysonplus/scene-player/dist/scene-player.iife.js?raw';
import editorScript from '@unysonplus/scene-player/dist/scene-editor.iife.js?raw';
import { transcriptHtml } from '@unysonplus/scene-player/transcript';

/**
 * Builds the two HTML documents the Studio produces from a scene: the preview page shown in the
 * iframe, and the standalone file people download. Both carry the same player and the same scene
 * file, so what the preview shows is what the download plays.
 */

/** JSON that is safe inside a <script> element (no "</script>" or "<!--" can end it early). */
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

/** Whether any layer, at any depth, has a custom code clip. */
export function hasCodeClips(scene: Scene): boolean {
  type L = { clips: Array<{ preset: string }>; layers?: L[] };
  const walk = (list: L[]): boolean => list.some((l) => l.clips.some((c) => c.preset === 'code') || (!!l.layers && walk(l.layers)));
  return walk(scene.layers as unknown as L[]);
}

/** The scene host element. Code clips run only where the host says so, which the author's own exports do. */
const hostTag = (scene: Scene) => (hasCodeClips(scene) ? '<div data-upw-scene data-upw-allow-code>' : '<div data-upw-scene>');

/** The player inlined into a page. */
const inlinePlayer = (autoMount: boolean) =>
  `<script${autoMount ? '' : ' data-auto-mount="false"'}>/* Unyson+ scene player ${__PLAYER_VERSION__} */\n${playerScript.replace(/<\/script/gi, '<\\/script')}</script>`;

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** True when the scene (or a group in it) has a 3D layer. */
export function hasModel(scene: Scene): boolean {
  type L = { type: string; layers?: L[] };
  const walk = (list: L[]): boolean => list.some((l) => l.type === 'model' || (!!l.layers && walk(l.layers)));
  return walk(scene.layers as unknown as L[]);
}

/** True when the scene (or a group in it) has a Lottie layer. */
export function hasLottie(scene: Scene): boolean {
  type L = { type: string; layers?: L[] };
  const walk = (list: L[]): boolean => list.some((l) => l.type === 'lottie' || (!!l.layers && walk(l.layers)));
  return walk(scene.layers as unknown as L[]);
}

/** The Lottie runtime's source, put inside a downloaded page that has a Lottie layer. */
export async function lottieRuntime(): Promise<string> {
  return (await import('@unysonplus/scene-player/dist/scene-lottie.iife.js?raw')).default;
}

/** The 3D runtime's source, loaded only when a downloaded page needs it inside (it is large). */
export async function threeRuntime(): Promise<string> {
  return (await import('@unysonplus/scene-player/dist/scene-3d.iife.js?raw')).default;
}

/** Pages the Studio builds itself (the preview, the scroll test) load scene-3d.js from the Studio's own copy. */
const assetBaseScript = () =>
  `<script>window.UPW_SCENE_ASSET_BASE=${JSON.stringify(new URL(`/player/${__PLAYER_VERSION__}/`, location.href).href)}</script>`;

/** Where every published player version lives. A version, once published, never changes. */
export const PLAYER_BASE = 'https://kinetic-scenes.unysonplus.com/player/';
export const playerUrl = () => `${PLAYER_BASE}${__PLAYER_VERSION__}/scene-player.js`;

/**
 * A complete, standalone page that plays the scene, with its own copy of the player inside. Pass
 * fontCss (from embedFonts) to carry the fonts in the file too.
 */
export function exportHtml(scene: Scene, opts: { fontCss?: string; three?: string; lottie?: string } = {}): string {
  const title = escapeHtml(scene.title || 'Animation');
  const fontStyle = opts.fontCss ? `<style>\n${opts.fontCss.replace(/<\/style/gi, '<\\/style')}</style>\n` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Unyson+ Kinetic Scenes ${__STUDIO_VERSION__}">
<title>${title}</title>
<style>html,body{margin:0;background:#0a0d11}</style>
${fontStyle}</head>
<body>
${hostTag(scene)}
<script type="application/json">${safeJson(scene)}</script>
${transcriptHtml(scene)}
</div>
${opts.three ? `<script>${opts.three.replace(/<\/script/gi, '<\\/script')}</script>\n` : ''}${opts.lottie ? `<script>${opts.lottie.replace(/<\/script/gi, '<\\/script')}</script>\n` : ''}${inlinePlayer(true)}
</body>
</html>
`;
}

/**
 * A test page for a scroll-linked scene: the scene between blocks of stand-in page content, so scrolling
 * plays it exactly as on a real site (pinning included).
 */
export function scrollTestHtml(scene: Scene): string {
  const filler = (n: number) => Array.from({ length: n }, () => '<p class="bar"></p><p class="bar short"></p><p class="bar"></p>').join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scroll test: ${escapeHtml(scene.title || 'Animation')}</title>
<style>
html,body{margin:0;background:#0a0d11;color:#aeb6c0;font:15px/1.5 system-ui,sans-serif}
.note{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9;background:#1b2129;border:1px solid #2c3540;border-radius:999px;padding:6px 14px;font-size:13px}
.page{max-width:760px;margin:0 auto;padding:40px 20px}
.bar{height:12px;border-radius:6px;background:#1c232c;margin:14px 0}.bar.short{width:60%}
h2{color:#e6eaee;font-size:22px;margin:0 0 8px}
</style>
</head>
<body>
<p class="note">Scroll test: scroll down to play the scene, up to rewind</p>
<div class="page" style="min-height:90vh"><h2>Content above the scene</h2>${filler(8)}</div>
${hostTag(scene)}
<script type="application/json">${safeJson(scene)}</script>
</div>
<div class="page" style="min-height:120vh"><h2>Content below the scene</h2>${filler(12)}</div>
${assetBaseScript()}
${inlinePlayer(true)}
</body>
</html>
`;
}

/**
 * Code to paste into any page (a Custom HTML block, a page template…). The scene file travels inline;
 * the player loads from its permanent versioned address, so the scene keeps playing exactly as it was
 * made even after later Studio releases.
 */
export function embedCode(scene: Scene): string {
  const label = (scene.title || 'Animation').replace(/--/g, '-');
  return `<!-- Unyson+ Kinetic Scenes: ${label} -->
${hostTag(scene)}
<script type="application/json">${safeJson(scene)}</script>
${transcriptHtml(scene)}
</div>
<script src="${playerUrl()}" defer></script>
`;
}

/**
 * The preview page: the top of a website with the scene as its hero and page content below. The
 * editor script mounts the scene, draws selection handles and talks to the Studio (see editor.ts).
 */
export function previewHtml(scene: Scene, opts: { safeArea: boolean }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html,body{margin:0;background:#0a0d11;color:#c9d1da;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.page{padding:6vh 6vw 10vh;display:grid;gap:18px;max-width:1100px;margin:0 auto}
.page i{display:block;height:14px;border-radius:7px;background:#1b222b}
.page i:nth-child(1){width:38%;height:22px;background:#232b35}
.page i:nth-child(3){width:86%}
.page i:nth-child(4){width:72%}
.page p{margin:0;font-size:13px;color:#7d8794}
.err{margin:24px;padding:16px;border:1px solid #6b2a2a;border-radius:8px;background:#1c1214;color:#f2b8b5;font:13px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap}
</style>
</head>
<body data-safe="${opts.safeArea ? 'true' : 'false'}">
<div id="scene"></div>
<div class="page" aria-hidden="true"><i></i><p>The rest of the page continues below the scene.</p><i></i><i></i><i></i></div>
<script type="application/json" id="scene-json">${safeJson(scene)}</script>
${assetBaseScript()}
${inlinePlayer(false)}
<script>${editorScript.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>
`;
}
