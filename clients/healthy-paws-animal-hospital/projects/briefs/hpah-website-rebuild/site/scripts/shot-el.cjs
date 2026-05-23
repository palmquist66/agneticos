const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const page = await browser.newPage({ viewport:{width:1100,height:850}, deviceScaleFactor:2 });
  await page.goto('http://localhost:4321/services/',{waitUntil:'networkidle',timeout:30000});
  // scroll to More Services and force-load all images in view
  await page.evaluate(() => { const h=[...document.querySelectorAll('h2')].find(e=>e.textContent.trim()==='More Services'); h && h.scrollIntoView(); document.querySelectorAll('img').forEach(i=>i.loading='eager'); });
  await page.waitForTimeout(400);
  await page.evaluate(async()=>{ await Promise.all([...document.images].filter(i=>!i.complete).map(i=>new Promise(r=>{i.onload=i.onerror=r;}))); });
  await page.waitForTimeout(600);
  await page.screenshot({ path:'scripts/visual-reference/more-services.png' });
  console.log('saved'); await browser.close();
})().catch(e=>{console.error(String(e).slice(0,200));process.exit(1);});
