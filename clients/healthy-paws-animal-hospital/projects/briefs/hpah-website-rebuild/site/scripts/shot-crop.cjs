const { chromium } = require('playwright');
const BASE = 'http://localhost:4322';
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

  // Location page: service thumbnail grid (w-14 h-14 squares)
  await page.goto(BASE + '/veterinarian-algonquin-il/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(400);
  const loc = page.locator('div.not-prose').first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await loc.screenshot({ path: 'scripts/imgfix/crop-location-thumbs.png' });
  console.log('saved crop-location-thumbs');

  // Services page: "More Services" grid
  await page.goto(BASE + '/services/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(400);
  // find heading "More Services" then screenshot the following grid
  const moreGrid = page.locator('section', { hasText: 'More Services' }).last();
  await moreGrid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await moreGrid.screenshot({ path: 'scripts/imgfix/crop-more-services.png' });
  console.log('saved crop-more-services');

  await browser.close();
})().catch(e => { console.error(String(e).slice(0, 300)); process.exit(1); });
