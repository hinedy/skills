// Renders icon.html to ../../.claude-plugin/icon.png (1024x1024).
// Run from the repo root:  npm install --no-save playwright@1 && npx playwright install chromium && node assets/icon/render.cjs
// Needs network access for the Space Mono font, and a Playwright Chromium
// (the install line above fetches one).
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.goto(pathToFileURL(path.join(__dirname, 'icon.html')).href);
  await page.waitForFunction(() => document.title === 'done', null, { timeout: 30000 });
  const out = path.join(__dirname, '..', '..', '.claude-plugin', 'icon.png');
  await page.screenshot({ path: out });
  await browser.close();
  console.log('wrote ' + out);
})().catch((e) => { console.error(e.message); process.exit(1); });
