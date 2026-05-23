const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const pages = { 'services':'/services/', 'pain-management':'/pain-management/', 'microchipping':'/microchipping/' };
  for (const [name,p] of Object.entries(pages)) {
    const page = await browser.newPage({ viewport:{width:1280,height:900} });
    await page.goto('http://localhost:4321'+p,{waitUntil:'networkidle',timeout:30000});
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);});
    await page.waitForTimeout(400);
    await page.screenshot({path:`scripts/visual-reference/local-${name}.png`,fullPage:true});
    await page.close(); console.log('saved '+name);
  }
  await browser.close();
})().catch(e=>{console.error(String(e).slice(0,200));process.exit(1);});
