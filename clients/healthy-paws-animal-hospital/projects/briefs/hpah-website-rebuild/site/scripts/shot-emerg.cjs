const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://localhost:4322/emergency-urgent-care/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}window.scrollTo(0,0);});
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'scripts/imgfix/emergency-page.png', fullPage: true });
  await b.close(); console.log('saved');
})().catch(e=>{console.error(String(e).slice(0,200));process.exit(1);});
