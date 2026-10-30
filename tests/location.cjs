'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
const {createServer} = require('../scripts/serve.cjs');
const base = require('../config.js');
const root = path.resolve(__dirname,'..');
const output = '/tmp/barbearia-v131-location';
fs.mkdirSync(output,{recursive:true});
// Endereço sintético exclusivamente para teste; nunca publicado nem geocodificado.
const address = {address:'Rua de Teste, 123',neighborhood:'Bairro de Teste',city:'Cidade de Teste'};
const fixtures = {
  demonstration: {...base},
  withMap: {...base,...address,mapa:{link:'https://example.test/route',embed:'https://www.google.com/maps/embed?pb=test'}},
  addressOnly: {...base,...address,mapa:{link:'',embed:''}},
  routeOnly: {...base,...address,mapa:{link:'https://example.test/route',embed:''}},
  invalidUrls: {...base,...address,mapa:{link:'javascript:alert(1)',embed:'https://evil.test/map'}}
};
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  try {
    for(const [label,config] of Object.entries(fixtures)) {
      const file=path.join(output,label+'.cjs');
      const dir=path.join(output,label);
      fs.writeFileSync(file,'module.exports='+JSON.stringify(config));
      execFileSync(process.execPath,['scripts/build.cjs','--config',file,'--out',dir],{cwd:root,stdio:'pipe'});
      const server=createServer(dir);
      await new Promise(r=>server.listen(0,'127.0.0.1',r));
      try {
        for(const width of [375,390,768,1280,1440]) {
          const page=await browser.newPage({viewport:{width,height:900}});
          const errors=[];
          page.on('pageerror',e=>errors.push(e.message));
          await page.route('https://www.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<p>Mapa interceptado em teste local</p>'}));
          await page.emulateMedia({reducedMotion:'reduce'});
          await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});
          const pending=label==='demonstration';
          assert.equal(await page.locator('.location-preview-art').count(),pending?1:0);
          assert.equal(await page.locator('.location-pending').count(),pending?1:0);
          assert.equal(await page.locator('#map-link').count(),['withMap','routeOnly'].includes(label)?1:0);
          assert.equal(await page.locator('iframe').count(),label==='withMap'?1:0);
          if(pending) {
            assert.equal(await page.locator('.location-card h3').innerText(),'Sua barbearia aqui.');
            assert.equal(await page.locator('.location-pending').innerText(),base.content.contact.pendingDescription);
            assert.equal(await page.locator('.location-preview-art').getAttribute('aria-hidden'),'true');
            assert.equal(await page.locator('.location-preview-art').getAttribute('focusable'),'false');
            assert.equal(await page.locator('#business-address').count(),0);
            const marker=await page.locator('.location-art-marker').boundingBox();
            const bounds=await page.locator('.location-card').boundingBox();
            assert.ok(marker.x>=bounds.x&&marker.x+marker.width<=bounds.x+bounds.width,'marcador inteiro dentro do cartão');
          } else {
            assert.equal(await page.locator('#business-address').innerText(),address.address);
            assert.equal(await page.locator('.business-city').innerText(),`${address.neighborhood} · ${address.city}`);
            assert.doesNotMatch(await page.locator('.location-card').innerText(),/Sua barbearia aqui|Seu endereço, sua identidade/);
          }
          assert.equal(await page.locator('.hours dl > div').count(),base.hours.length);
          for(const [i,row] of base.hours.entries()) {
            assert.equal(await page.locator('.hours dt').nth(i).innerText(),row.day);
            assert.equal(await page.locator('.hours dd').nth(i).innerText(),row.time);
          }
          await page.locator('#contato').scrollIntoViewIfNeeded();
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          const text=await page.locator('.location-info').boundingBox();
          const card=await page.locator('.location-card').boundingBox();
          assert.ok(text.x>=card.x&&text.x+text.width<=card.x+card.width+1);
          assert.ok(text.y>=card.y&&text.y+text.height<=card.y+card.height+1);
          if(pending&&width<=390) assert.ok(card.height<=340,'cartão mobile compacto');
          if(width>=768) {
            const hours=await page.locator('.hours').boundingBox();
            assert.ok(Math.abs(hours.y-card.y)<1&&Math.abs(hours.height-card.height)<1,'cartões alinhados');
          }
          assert.deepEqual(errors,[]);
          // Captura de viewport evita artefatos de elementos fixos em screenshots de elemento longo.
          await page.screenshot({path:path.join(output,`${label}-${width}.jpg`),type:'jpeg',quality:65});
          await page.close();
          console.log(`PASS localização ${label} ${width}px`);
        }
      } finally {await new Promise(r=>server.close(r));}
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
