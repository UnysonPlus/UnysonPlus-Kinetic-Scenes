// Photographs every style's preview for the start screen: public/styles/<id>.jpg.
// Run from apps/studio after changing lib/stylePreviews.ts or adding a style:
//   PLAYWRIGHT_DIR="<a folder with playwright>" node --import tsx scripts/style-posters.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { BUILT_IN_STYLES } from '../src/lib/styles.ts';
import { POSTER_TIME, stylePreview } from '../src/lib/stylePreviews.ts';

const { chromium } = createRequire(join(process.env.PLAYWRIGHT_DIR || process.cwd(), 'x.js'))('playwright');
const pub = join(process.cwd(), 'public');
const { version } = JSON.parse(readFileSync(join(pub, 'player/latest.json'), 'utf8'));
const player = readFileSync(join(pub, `player/${version}/scene-player.js`), 'utf8');
const out = join(pub, 'styles');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
let made = 0;
for (const style of BUILT_IN_STYLES) {
  const scene = stylePreview(style);
  if (!scene) { console.log(`no preview: ${style.id}`); continue; }
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}</style><div id="h"></div>`);
  await page.addScriptTag({ content: player });
  await page.evaluate(async ({ sc, t }) => {
    const api = (window as unknown as { UnysonPlusScene: { mount: (el: Element, s: unknown, o: unknown) => { seek: (t: number) => void; settle?: () => Promise<void>; whenReady?: (ms: number) => Promise<unknown> } } }).UnysonPlusScene;
    const p = api.mount(document.getElementById('h')!, sc, { editor: true, autoplay: false, allowCode: true, audio: false });
    await p.whenReady?.(15000);
    p.seek(t);
    await p.settle?.();
  }, { sc: scene, t: POSTER_TIME });
  await page.waitForTimeout(120);
  writeFileSync(join(out, `${style.id}.jpg`), await page.screenshot({ type: 'jpeg', quality: 82 }));
  made++;
}
await browser.close();
console.log(`${made} posters in public/styles`);
