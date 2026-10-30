'use strict';
const { chromium } = require('playwright');
const axe = require('axe-core');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { createServer } = require('../scripts/serve.cjs');
const root = path.resolve(__dirname,'..');
const output = '/tmp/barbearia-v13-tests';
const screenshots = '/tmp/barbearia-v13-screenshots';
fs.mkdirSync(output,{recursive:true}); fs.mkdirSync(screenshots,{recursive:true});
const base = require('../config.js');

function build(label,config) {
  const file = path.join(output,`${label}.cjs`);
  fs.writeFileSync(file,`module.exports=${JSON.stringify(config)};`);
  const dir = path.join(output,label);
  execFileSync(process.execPath,['scripts/build.cjs','--config',file,'--out',dir],{cwd:root,stdio:'pipe'});
  return dir;
}
const fixtures = {
  model:base,
  full:{...base,name:'Marca de Teste',slogan:'Identidade de teste',description:'Descrição de teste para metadados estáticos e compartilhamento.',city:'Cidade de Teste',state:'UF',country:'BR',siteUrl:'https://example.test/',address:'Texto de endereço apenas para teste',whatsapp:'(11) 99999-9999',mapa:{link:'https://example.test/map',embed:'https://www.google.com/maps/embed?pb=test'},socialLinks:[{label:'Rede de teste',url:'https://example.test/social'}],demo:{enabled:false},reviews:{verified:true,average:4.5,count:12,source:'Fonte de Teste',url:'https://example.test/reviews',testimonials:[{author:'Autor de teste',text:'Texto autorizado de teste <script>alert(1)</script>',verified:true},{author:'Descartado',text:'Não verificado',verified:false}]},content:{...base.content,about:{...base.content.about,paragraphs:['A {name} é a marca cadastrada para este teste.']}}},
  demo:{...base,siteUrl:'https://example.test/',whatsapp:'5511999999999',demo:{enabled:true,titulo:'Quer um site assim para sua barbearia?',texto:'Texto comercial de teste',contatoLabel:'Contato de teste',contatoLink:'https://example.test/developer'}},
  minimal:{name:'Marca mínima',demo:{enabled:false}},
  invalid:{name:'Marca segura',whatsappUnavailableMessage:'Contato de teste em breve',whatsapp:'invalid',siteUrl:'http://example.test',services:[{}, {name:'Serviço sem preço',price:-1}],reviews:{verified:true,average:8,count:-2},mapa:{link:'javascript:alert(1)',embed:'https://evil.test/map'},socialLinks:[{label:'Inseguro',url:'javascript:alert(1)'}],demo:{enabled:true,contatoLink:''}}
};
// Dados exclusivamente locais: nenhum número ou fonte de teste é contatado.
fixtures.full.services = [
  {id:'auditado',name:'Serviço auditado',description:'Descrição comercial cadastrada para este teste.',price:72.50,duration:'35 min'},
  {id:'segundo',name:'Segundo serviço',description:'Outra descrição de teste.',price:91,duration:'50 min'}
];
fixtures.full.brand = {logo:{src:'assets/barbearia.jpg',alt:'Logo local de teste'},colors:{panel:'#20231e'}};
fixtures.full.neighborhood = 'Bairro de Teste';
fixtures.full.hours = [{day:'Dia auditado',time:'10h — 16h'}];
fixtures.full.whatsappMessage = 'Contato geral de teste';
fixtures.full.serviceMessage = 'Olá, quero consultar {service}.';
fixtures.full.content.hero = {...base.content.hero,first:'Estilo de teste.',lead:'Cuidado',accent:'sob medida.',description:'Apresentação comercial de teste.'};
fixtures['review-four'] = {...base,demo:{enabled:false},reviews:{verified:true,average:4,count:25,source:'Fonte auditada',url:'https://example.test/reviews',testimonials:[]}};

async function assertAccessibility(page,label) {
  await page.addScriptTag({content:axe.source});
  const audit=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],label);
}
async function safeFloatingPosition(page) {
  for(let y=0;y<=1800;y+=120) {
    await page.evaluate(y=>scrollTo(0,y),y);
    await page.waitForTimeout(50);
    if(await page.locator('.whatsapp-float').isVisible()) return true;
  }
  return false;
}

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
    const unlocated=build('unlocated',{...base,mapa:{link:'https://example.test/route',embed:'https://www.google.com/maps/embed?pb=test'}});
    const unlocatedHtml=require('cheerio').load(fs.readFileSync(path.join(unlocated,'index.html'),'utf8'));
    assert.equal(unlocatedHtml('#map-link,iframe').length,0,'mapa e rota não aparecem sem endereço ou localidade');
    for(const [label,config] of Object.entries(fixtures)) {
      const dir=build(label,config);
      const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
      assert.doesNotMatch(html,/src="config.js"/);
      if(label==='full') {
        assert.doesNotMatch(html,/Barbearia Exemplo|BARBEARIA|EXEMPLO/);
        assert.match(html,/canonical" href="https:\/\/example.test\//);
        for(const key of ['og:image','og:image:width','og:image:height','og:image:alt','og:url','og:locale','twitter:card']) assert.ok(html.includes(key),key);
        assert.match(fs.readFileSync(path.join(dir,'robots.txt'),'utf8'),/Allow: \/\nSitemap: https:\/\/example.test\/sitemap.xml/);
        assert.match(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8'),/<loc>https:\/\/example.test\/<\/loc>/);
        assert.doesNotMatch(html,/noindex/);
        assert.doesNotMatch(fs.readFileSync(path.join(dir,'_headers'),'utf8'),/noindex/);
      }
      if(['model','demo','invalid'].includes(label)) {
        assert.match(html,/noindex, nofollow/);
        assert.match(fs.readFileSync(path.join(dir,'robots.txt'),'utf8'),/Disallow: \//);
        assert.doesNotMatch(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8'),/<loc>/);
        assert.match(fs.readFileSync(path.join(dir,'_headers'),'utf8'),/X-Robots-Tag: noindex, nofollow/);
      }
      assert.equal(require('sharp') ? fs.existsSync(path.join(dir,'assets/icon-180.png')):false,true);
      // Os arquivos originais sempre permanecem idênticos na saída.
      for(const file of ['barbearia.jpg','favicon.svg']) assert.deepEqual(fs.readFileSync(path.join(dir,'assets',file)),fs.readFileSync(path.join(root,'assets',file)));
      const server=createServer(dir);
      await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
      const url=`http://127.0.0.1:${server.address().port}`;
      try {
        for(const width of [375,390,768,1024,1280,1440,1920]) {
          const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
          const errors=[];
          page.on('pageerror',error=>errors.push(error.message));
          page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
          await page.route('https://www.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<p>Mapa de teste local</p>'}));
          await page.emulateMedia({reducedMotion:'reduce'});
          await page.goto(url,{waitUntil:'networkidle'});
          assert.equal(await page.locator('h1').count(),1);
          if(label==='model') {
            const values=await page.locator('.values-strip > span').allTextContents();
            assert.deepEqual(values,base.content.values);
            for(const item of await page.locator('.values-strip > span').all()) {
              const rect=await item.boundingBox(); assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=width);
            }
            if(width>=1280) {
              const alignment=await page.evaluate(()=>{
                const section=document.querySelector('#servicos');
                const padding=parseFloat(getComputedStyle(section).paddingLeft);
                const grid=document.querySelector('.service-grid').getBoundingClientRect();
                const hero=document.querySelector('.hero-content').getBoundingClientRect();
                return {padding,left:grid.left,right:innerWidth-grid.right,hero:hero.left,width:grid.width};
              });
              assert.ok(Math.abs(alignment.left-alignment.right)<2,'contêiner centralizado');
              assert.ok(Math.abs(alignment.left-alignment.hero)<2,'hero e serviços alinhados');
              assert.ok(alignment.width<=1441&&alignment.width>=width*.7,'largura equilibrada');
            }
          }

          assert.equal(await page.locator('form,input,textarea').count(),0);
          assert.doesNotMatch(await page.locator('body').innerText(),/demonstrativ|ilustrativ|conteúdo fictício|foto conceitual/i);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} ${width} overflow`);
          const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
          assert.equal(schema['@type'],'HairSalon');
          assert.equal(schema.name,config.name);
          for(const target of await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))) assert.equal(await page.locator(target).count(),1,target);
          await page.keyboard.press('Tab');
          assert.ok(await page.locator('.skip-link').evaluate(node=>node===document.activeElement));
          const outline=await page.locator('.skip-link').evaluate(node=>getComputedStyle(node).outlineStyle);
          assert.notEqual(outline,'none');
          await page.keyboard.press('Enter');
          await page.waitForURL('**/#conteudo');
          assert.equal(new URL(page.url()).hash,'#conteudo');
          if(width<=900) {
            await page.locator('.menu-toggle').focus();
            await page.keyboard.press('ArrowDown');
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
            assert.ok(await page.locator('#navegacao a').first().evaluate(node=>node===document.activeElement));
            await page.keyboard.press('Escape');
            assert.ok(await page.locator('.menu-toggle').evaluate(node=>node===document.activeElement));
            await page.locator('.menu-toggle').click();
            await page.locator('#navegacao a[href="#servicos"]').click();
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
            await page.locator('.menu-toggle').click();
            await page.locator('#contato h2').click();
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
          }
          await page.locator('.header-cta').click();
          assert.equal(new URL(page.url()).hash,'#agendamento');
          const valid=['full','demo'].includes(label);
          assert.equal(await page.locator('.whatsapp-float').count(),1);
          assert.equal(await page.locator('.whatsapp svg.bi-whatsapp').count(),1);
          assert.equal(await page.locator('.whatsapp-float svg.bi-whatsapp').count(),1);
          assert.equal(await page.locator('.service-cta').count(),await page.locator('.service-card').count());
          const color=await page.locator('.whatsapp').evaluate(node=>getComputedStyle(node).backgroundColor);
          assert.equal(color,'rgb(21, 23, 20)');
          if(await page.locator('.service-cta').count()) assert.equal(await page.locator('.service-cta').first().evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(200, 170, 117)');
          if(valid) {
            const href=await page.locator('.whatsapp').getAttribute('href');
            assert.equal(new URL(href).pathname,'/5511999999999');
            assert.equal(new URL(href).searchParams.get('text'),config.whatsappMessage);
            for(const [i,service] of config.services.entries()) {
              const serviceHref=await page.locator('.service-cta').nth(i).getAttribute('href');
              assert.equal(new URL(serviceHref).searchParams.get('text'),config.serviceMessage.replace('{service}',service.name));
              assert.equal(await page.locator('.service-cta').nth(i).getAttribute('rel'),'noopener noreferrer');
            }
            for(const selector of ['.whatsapp','.whatsapp-float']) assert.equal(await page.locator(selector).getAttribute('rel'),'noopener noreferrer');
            assert.equal(await page.locator('#whatsapp-notice').count(),0);
            // Abre a nova aba de verdade, mas intercepta wa.me antes de qualquer contato externo.
            await page.context().route('https://wa.me/**',route=>route.fulfill({contentType:'text/html',body:'<title>WhatsApp interceptado localmente</title>'}));
            for(const selector of ['.whatsapp','.service-cta']) {
              const target=page.locator(selector).first();
              const expectedHref=await target.getAttribute('href');
              const [popup]=await Promise.all([page.waitForEvent('popup'),target.click()]);
              await popup.waitForURL(expectedHref,{waitUntil:'domcontentloaded'});
              assert.equal(popup.url(),expectedHref);
              assert.ok(await popup.evaluate(()=>window.opener===null));
              await popup.close();
            }

          } else {
            assert.equal(await page.locator('a[href*="wa.me"]').count(),0);
            assert.equal(await page.locator('.whatsapp').isEnabled(),true);
            assert.equal(await page.locator('.whatsapp').evaluate(node=>node.tagName),'BUTTON');
            const trigger=page.locator('.whatsapp');
            const notice=page.locator('#whatsapp-notice');
            const expected=config.whatsappUnavailableMessage || 'WhatsApp disponível em breve';
            await trigger.click();
            assert.ok(await notice.isVisible());
            assert.equal(await notice.locator('[role="status"]').innerText(),expected);
            assert.equal(await trigger.getAttribute('aria-expanded'),'true');
            await assertAccessibility(page,`${label} ${width} aviso aberto/contraste`);
            await page.screenshot({path:path.join(screenshots,`notice-${label}-${width}.png`)});
            await trigger.click();
            assert.ok(await notice.isHidden());
            await trigger.focus();
            await page.keyboard.press('Enter');
            assert.ok(await notice.isVisible());
            await notice.locator('.notice-close').click();
            assert.ok(await notice.isHidden());
            assert.ok(await trigger.evaluate(node=>node===document.activeElement));
            await trigger.click();
            await page.keyboard.press('Escape');
            assert.ok(await notice.isHidden());
            assert.equal(page.context().pages().length,1,'sem popup quando não existe número');
            if(await page.locator('.service-cta').count()) {
              await page.locator('.service-cta').first().click();
              assert.ok(await notice.isVisible());
              await page.locator('#contato h2').click();
              assert.ok(await notice.isHidden());
            }
          }
          if(width<=900 && ['model','full','demo'].includes(label)) {
            assert.ok(await safeFloatingPosition(page),'atalho deve aparecer em posição segura');
            const box=await page.locator('.whatsapp-float').boundingBox();
            assert.equal(box.width,54); assert.equal(box.height,54);
            if(!valid) {
              await page.locator('.whatsapp-float').click();
              assert.ok(await page.locator('#whatsapp-notice').isVisible());
              await page.keyboard.press('Escape');
            }
            await page.locator('footer').scrollIntoViewIfNeeded();
            await page.waitForFunction(()=>document.querySelector('.whatsapp-float').hidden);
          }
          assert.equal(await page.locator('#avaliacoes').count(),['full','review-four'].includes(label)?1:0);
          assert.equal(await page.locator('.commercial-demo').count(),label==='demo'?1:0);
          if(label==='review-four') {
            assert.equal(await page.locator('#review-average').innerText(),'4 / 5');
            assert.equal(Number(await page.locator('#stars-fill').getAttribute('width')),96);
            assert.equal(await page.locator('.review-grid figure').count(),0);
          }
          if(label==='full') {
            assert.equal(await page.locator('h1').innerText(),'Estilo de teste.\nCuidado sob medida.');
            assert.match(await page.locator('.hours').innerText(),/Dia auditado/);
            assert.doesNotMatch(await page.locator('.hours').innerText(),/Segunda|Sábado/);
            assert.match(await page.locator('.service-grid').innerText(),/72,50/);
            assert.doesNotMatch(await page.locator('.service-grid').innerText(),/Corte masculino|Barba & cuidado/);
            assert.equal(await page.locator('#business-address').innerText(),config.address);
            assert.equal(await page.locator('#map-link').getAttribute('href'),config.mapa.link);
            assert.equal(await page.locator('.social-links a').getAttribute('href'),config.socialLinks[0].url);
            assert.equal(await page.locator('#review-source').innerText(),'Fonte de Teste');
            assert.equal(await page.locator('#review-count').innerText(),'12 avaliações');
            assert.equal(await page.locator('#review-average').innerText(),'4,5 / 5');
            assert.equal(Number(await page.locator('#stars-fill').getAttribute('width')),108);
            assert.equal(await page.locator('.review-grid figure').count(),1);
            assert.equal(await page.locator('.review-grid script').count(),0);
            assert.match(await page.locator('.review-grid blockquote').innerText(),/<script>/);
            assert.equal(await page.locator('iframe').getAttribute('loading'),'lazy');
          }
          if(label==='minimal') assert.equal(await page.locator('.hours,.gallery,.service-card').count(),0);
          const located = Boolean(config.address);
          assert.equal(await page.locator('.location-card').getAttribute('data-location'),located?'configured':'pending');
          if(!located) {
            assert.equal(await page.locator('#map-link,iframe,#business-address').count(),0);
            assert.ok(await page.locator('.location-pending').isVisible());
            assert.equal(await page.locator('.location-preview-art').count(),1);
          }
          if(label==='full') {
            assert.equal(await page.locator('.location-preview-art').count(),0);
            assert.equal(await page.locator('.brand-logo').count(),2);
            assert.equal(await page.locator('html').evaluate(node=>getComputedStyle(node).getPropertyValue('--panel').trim()),'#20231e');
            assert.match(await page.locator('.business-city').innerText(),/Bairro de Teste/);
          }
          if(label==='model') {
            const filters=await page.locator('.gallery-grid img').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).filter));
            assert.deepEqual(filters,['none','none','none','brightness(0.9) contrast(1.02)']);
          }
          const heroCta=page.locator('.hero-cta');
          assert.equal(await heroCta.count(),1);
          if(valid) {
            assert.equal(await heroCta.getAttribute('href'),await page.locator('.whatsapp').getAttribute('href'));
          } else {
            assert.equal(await heroCta.evaluate(node=>node.tagName),'BUTTON');
            await heroCta.click();
            assert.ok(await page.locator('#whatsapp-notice').isVisible());
            await page.keyboard.press('Escape');
          }
          if(label==='invalid') assert.equal(await page.locator('[data-price]').innerText(),'Sob consulta');
          for(const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));
          if(await page.locator('.hero-image').count()) {
            assert.equal(await page.locator('.hero-image img').getAttribute('fetchpriority'),'high');
            assert.equal(await page.locator('.hero-image img').getAttribute('loading'),'eager');
            assert.ok((await page.locator('.hero-image img').evaluate(node=>node.currentSrc)).match(/\.(avif|webp)$/));
          }
          const gallerySources=await page.locator('.gallery img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));
          assert.equal(new Set(gallerySources).size,gallerySources.length,'sem fotos repetidas');
          if(label==='model') {
            assert.equal(gallerySources.length,4);
            assert.equal(await page.locator('.gallery-grid').getAttribute('data-count'),'4');
            for(const photo of base.images.gallery) assert.ok(gallerySources.includes(photo.src));
            for(const image of await page.locator('.gallery img').all()) {
              assert.equal(await image.getAttribute('loading'),'lazy');
              assert.ok(Number(await image.getAttribute('width'))>0 && Number(await image.getAttribute('height'))>0);
              assert.ok(await image.getAttribute('alt'));
              assert.ok(!(await image.getAttribute('src')).startsWith('http'));
            }
          }
          const reduced=await page.locator('html').evaluate(node=>getComputedStyle(node).scrollBehavior);
          assert.equal(reduced,'auto');
          await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
          await page.screenshot({path:path.join(screenshots,`${label}-${width}.png`),fullPage:true});
          await assertAccessibility(page,`${label} ${width} accessibility`);
          assert.deepEqual(errors,[],`${label} ${width} browser errors`);
          console.log(`PASS ${label} ${width}px: keyboard/menu, contacts, reviews, demo, images, SEO, axe/contrast, no overflow or browser/404 errors`);
          await page.close();
        }
        const context=await browser.newContext({javaScriptEnabled:false});
        const page=await context.newPage(); await page.goto(url);
        assert.equal(await page.title(),require('cheerio').load(html)('title').text());
        assert.equal(await page.locator('h1').count(),1);
        assert.equal(await page.locator('#avaliacoes').count(),['full','review-four'].includes(label)?1:0);
        await context.close();
      } finally {await new Promise(resolve=>server.close(resolve));}
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
