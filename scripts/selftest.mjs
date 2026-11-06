// Runs the scene player's determinism self-test (packages/player/test/selftest.html) in a headless
// browser and exits non-zero on a mismatch. Needs Playwright with Chromium, which is not a dependency of
// this repository: install it once anywhere and point PLAYWRIGHT_DIR at that folder, or run
// `npm i -D playwright && npx playwright install chromium` here.
//   node scripts/selftest.mjs        (build the player first: npm run build -w packages/player)
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const from = process.env.PLAYWRIGHT_DIR ? join(process.env.PLAYWRIGHT_DIR, 'package.json') : import.meta.url;
const { chromium } = createRequire(from)('playwright');

const page = pathToFileURL(join(here, '..', 'packages', 'player', 'test', 'selftest.html')).href;
const browser = await chromium.launch();
try {
  const tab = await browser.newPage();
  const errors = [];
  tab.on('pageerror', (e) => errors.push(e.message));
  await tab.goto(page, { waitUntil: 'commit' });
  await tab.waitForFunction(() => window.selfTestResult, null, { timeout: 170000 }).catch(() => {});
  const r = await tab.evaluate(() => window.selfTestResult);
  if (!r) throw new Error(`The self-test page did not finish: ${errors.join('; ') || 'no result'}`);
  console.log(`${r.ok ? 'PASS' : 'FAIL'}: ${r.frames} frames, ${r.presets} presets`);
  if (!r.ok) console.log(JSON.stringify(r.mismatches.slice(0, 5), null, 2));
  process.exitCode = r.ok ? 0 : 1;
} finally {
  await browser.close();
}
