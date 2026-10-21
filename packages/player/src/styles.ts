/**
 * The player's stylesheet, injected once per document.
 *
 * Structure:  [data-upw-scene] > .upw-scene > .upw-stage > .upw-canvas > .upw-cam > .upw-layer > .upw-li
 *   host    Whatever element holds the scene. Always as wide as its container, even inside a
 *           centring flex layout, which would otherwise shrink a box with no content width to 0.
 *   stage   The visible box. Its height follows the height mode; it clips whatever falls outside.
 *   canvas  The designed frame, always the breakpoint's exact shape and as wide as the stage,
 *           centred vertically. When the stage is shorter it is trimmed top and bottom (the safe area
 *           keeps key content clear of that); when taller, the stage background shows around it.
 *           It is the size container, so 1cqw = 1% of the stage width ("stage units").
 *           With fit "contain" the canvas instead shrinks to fit inside the stage, centred both ways.
 *           A logged-in WordPress page also leaves room for the admin bar (--upw-offset-extra).
 *   layer   Positioned and anchored. Never animated, so its own transform is free for anchoring.
 *   li      The animated element.
 *
 * On a page, layers let clicks through (a group's stage-sized proxy would otherwise cover everything
 * under it); only links take them. The editor handles pointers itself.
 */
export const PLAYER_CSS = `
[data-upw-scene]{display:block;width:100%;min-width:0;align-self:stretch;max-width:100%}
.upw-scene{position:relative;display:block;width:100%;--upw-ar:16/9;--upw-offset:0px}
.upw-stage{position:relative;display:block;width:100%;overflow:hidden;aspect-ratio:var(--upw-ar);isolation:isolate;contain:paint}
.upw-scene[data-mode="ratio-capped"] .upw-stage{max-height:calc(100vh - var(--upw-offset) - var(--upw-offset-extra,0px));max-height:calc(100svh - var(--upw-offset) - var(--upw-offset-extra,0px))}
.upw-scene[data-mode="fill"] .upw-stage{aspect-ratio:auto;height:calc(100vh - var(--upw-offset) - var(--upw-offset-extra,0px));height:calc(100svh - var(--upw-offset) - var(--upw-offset-extra,0px))}
body.admin-bar .upw-scene{--upw-offset-extra:32px}
@media screen and (max-width:782px){body.admin-bar .upw-scene{--upw-offset-extra:46px}}
.upw-canvas{position:absolute;left:0;top:50%;width:100%;aspect-ratio:var(--upw-ar);transform:translateY(-50%);container-type:size}
.upw-scene[data-fit="contain"] .upw-stage{container-type:size}
.upw-scene[data-fit="contain"] .upw-canvas{left:50%;width:min(100%,calc(100cqh * var(--upw-arn,1.7778)));transform:translate(-50%,-50%)}
.upw-cam{position:absolute;inset:0;transform-origin:50% 50%}
.upw-pins{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}
.upw-pins .upw-layer{pointer-events:auto}
.upw-layer{position:absolute;box-sizing:border-box}
.upw-layer[data-hidden]{display:none}
.upw-li{display:block;width:100%;height:100%;box-sizing:border-box}
.upw-text .upw-li{height:auto}
.upw-group>.upw-li{position:relative;overflow:visible}
.upw-gproxy{position:absolute;left:0;top:0;width:100%;height:100%}
.upw-text .upw-txt{display:block}
.upw-w{display:inline-block;white-space:nowrap;vertical-align:top}
.upw-wi,.upw-c{display:inline-block}
.upw-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.upw-li img{display:block;width:100%;height:100%;border-radius:inherit}
.upw-vec{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.upw-flow,.upw-scene[data-editor] .upw-flow{pointer-events:none}
.upw-3d{position:relative}
.upw-link{position:absolute;inset:0;z-index:2147482000;display:block;cursor:pointer;border-radius:inherit;-webkit-tap-highlight-color:transparent}
.upw-scene[data-editor] .upw-link{pointer-events:none}
.upw-scene:not([data-editor]) .upw-layer{pointer-events:none}
.upw-scene:not([data-editor]) .upw-link{pointer-events:auto}
.upw-layer[data-focus]{outline:3px solid #fff;outline-offset:6px;border-radius:4px}
.upw-scene[aria-roledescription="presentation"]{cursor:pointer}
.upw-scene[aria-roledescription="presentation"]:focus{outline:none}
.upw-scene[aria-roledescription="presentation"]:focus-visible{outline:2px solid rgba(255,255,255,.7);outline-offset:-4px}
.upw-scene[data-waiting]::after{content:"";position:absolute;right:max(14px,2cqw);bottom:max(14px,2cqw);width:12px;height:12px;border-right:2.5px solid rgba(255,255,255,.75);border-bottom:2.5px solid rgba(255,255,255,.75);transform:rotate(-45deg);animation:upw-nudge 1.4s ease-in-out infinite;pointer-events:none;z-index:2147483001}
@keyframes upw-nudge{0%,100%{opacity:.35;translate:0 0}50%{opacity:1;translate:4px 0}}
@media (prefers-reduced-motion:reduce){.upw-scene[data-waiting]::after{animation:none;opacity:.8}}
.upw-sound{position:absolute;left:max(10px,1.4cqw);bottom:max(10px,1.4cqw);z-index:2147483002;display:inline-flex;align-items:center;gap:6px;height:34px;min-width:34px;padding:0 9px;border:0;border-radius:17px;background:rgba(10,13,17,.62);color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.upw-sound svg{width:18px;height:18px;flex:none}
.upw-sound[data-on="1"]{padding:0;width:34px;justify-content:center;opacity:.75}
.upw-sound:hover,.upw-sound:focus-visible{opacity:1;background:rgba(10,13,17,.82)}
.upw-sound:focus-visible{outline:2px solid #fff;outline-offset:2px}
.upw-safe{position:absolute;pointer-events:none;border:1px dashed rgba(255,255,255,.6);box-shadow:0 0 0 1px rgba(0,0,0,.35);z-index:2147483000;display:none}
.upw-scene[data-safe] .upw-safe{display:block}
`;

export function injectStyles(doc: Document) {
  if (doc.getElementById('upw-scene-css')) return;
  const style = doc.createElement('style');
  style.id = 'upw-scene-css';
  style.textContent = PLAYER_CSS;
  doc.head.appendChild(style);
}

export function injectFonts(doc: Document, fonts: Array<{ family: string; href?: string }> = []) {
  for (const f of fonts) {
    if (!f.href) continue;
    const exists = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).some((l) => l.href === f.href);
    if (exists) continue;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = f.href;
    doc.head.appendChild(link);
  }
}
