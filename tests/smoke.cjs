const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const output = process.env.SCREENSHOT_DIR || '/tmp/barbearia-screenshots';
 fs.mkdirSync(output,{recursive:true});
 try {
  for (const width of [375,390,768,1280]) {
   const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
   await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8080',{waitUntil:'networkidle'});
   assert.equal(await page.locator('h1').count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
   for(const anchor of await page.locator('a[href^="#"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')))) assert.ok(await page.locator(anchor).count(),`missing target ${anchor}`);
   assert.equal(await page.locator('a[href*="wa.me"]').count(),0);
   assert.ok(await page.locator('.whatsapp').isDisabled());
   if(width<=900){
    await page.locator('.menu-toggle').click();
    await page.locator('#navegacao a[href="#servicos"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('.menu-toggle').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
   }
   await page.locator('.hero-actions .button').click();
   await page.waitForFunction(()=>location.hash==='#agendamento');
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(output,`${width}.png`),fullPage:true});
   assert.ok(await page.locator('.gallery img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
   assert.deepEqual(errors,[]);
   console.log(`PASS ${width}px: overflow, links, navigation, CTA, images, console`);
   await page.close();
  }
  const page=await browser.newPage();
  // Intercept only the configuration; do not contact or expose a real phone number.
  await page.route('**/config.js',route=>route.fulfill({contentType:'application/javascript',body:`window.BARBEARIA_CONFIG={whatsapp:'12345678901',whatsappMessage:'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.',prices:{corte:60}};`}));
  await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8080');
  const href=await page.locator('.whatsapp').getAttribute('href');
  assert.equal(new URL(href).searchParams.get('text'),'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.');
  assert.equal(await page.locator('.whatsapp').getAttribute('rel'),'noopener noreferrer');
  assert.match(await page.locator('[data-price="corte"]').textContent(),/60/);
  console.log('PASS configured WhatsApp message and price customization (local interception only)');
  await page.close();
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
