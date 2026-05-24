const { chromium } = require('playwright');
const BASE = 'http://localhost:4322';
const pages = {
  'home': '/',
  'services': '/services/',
  'service-allergy': '/pet-allergy-treatment-lake-in-the-hills-il/',
  'service-dental': '/dental-care/',
  'location-algonquin': '/veterinarian-algonquin-il/',
  'about': '/about/',
  'meet-the-team': '/meet-the-team/',
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  for (const [name, p] of Object.entries(pages)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 30000 });
    // trigger lazy-load
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `scripts/imgfix/${name}.png`, fullPage: true });
    await page.close();
    console.log('saved ' + name);
  }
  await browser.close();
})().catch(e => { console.error(String(e).slice(0, 300)); process.exit(1); });
