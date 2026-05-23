const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('http://localhost:4321/transparency/', { waitUntil:'networkidle', timeout:30000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path:'scripts/visual-reference/local-transparency.png', fullPage:true });
  await browser.close(); console.log('saved');
})().catch(e=>{console.error(String(e).slice(0,200));process.exit(1);});
