'use strict';
const { chromium } = require('playwright');
const axe = require('axe-core');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { createServer } = require('../scripts/serve.cjs');
const root = path.resolve(__dirname,'..');
const output = '/tmp/barbearia-v12-tests';
const screenshots = '/tmp/barbearia-v12-screenshots';
fs.mkdirSync(output,{recursive:true}); fs.mkdirSync(screenshots,{recursive:true});
const base = require('../config.js');
const message = base.whatsappMessage;
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
  invalid:{name:'Marca segura',whatsapp:'invalid',siteUrl:'http://example.test',services:[{}, {name:'Serviço sem preço',price:-1}],reviews:{verified:true,average:8,count:-2},mapa:{link:'javascript:alert(1)',embed:'https://evil.test/map'},socialLinks:[{label:'Inseguro',url:'javascript:alert(1)'}],demo:{enabled:true,contatoLink:''}}
};
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
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
        for(const width of [375,390,768,1280]) {
          const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
          const errors=[];
          page.on('pageerror',error=>errors.push(error.message));
          page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
          await page.route('https://www.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<p>Mapa de teste local</p>'}));
          await page.emulateMedia({reducedMotion:'reduce'});
          await page.goto(url,{waitUntil:'networkidle'});
          assert.equal(await page.locator('h1').count(),1);
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
          assert.equal(await page.locator('.whatsapp-float').count(),valid?1:0);
          if(valid) {
            const href=await page.locator('.whatsapp').getAttribute('href');
            assert.equal(new URL(href).pathname,'/5511999999999');
            assert.equal(new URL(href).searchParams.get('text'),message);
            const serviceHref=await page.locator('.service-cta').first().getAttribute('href');
            assert.equal(new URL(serviceHref).searchParams.get('text'),'Olá! Gostaria de agendar um Corte masculino. Quais horários estão disponíveis?');
            for(const selector of ['.whatsapp','.service-cta','.whatsapp-float']) assert.equal(await page.locator(selector).first().getAttribute('rel'),'noopener noreferrer');
            if(width<=900) {
              await page.evaluate(()=>scrollTo(0,0));
              await page.waitForTimeout(150);
              const box=await page.locator('.whatsapp-float').evaluate(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height}));
              assert.ok(box && box.width>=44&&box.height>=44);
              await page.locator('footer').scrollIntoViewIfNeeded();
              await page.waitForFunction(()=>document.querySelector('.whatsapp-float').hidden);
            }
          } else {
            assert.equal(await page.locator('a[href*="wa.me"],.service-cta').count(),0);
            assert.equal(await page.locator('#whatsapp-status').innerText(),'Contato pelo WhatsApp indisponível no momento.');
          }
          assert.equal(await page.locator('#avaliacoes').count(),label==='full'?1:0);
          assert.equal(await page.locator('.commercial-demo').count(),label==='demo'?1:0);
          if(label==='full') {
            assert.equal(await page.locator('#review-average').innerText(),'4,5 / 5');
            assert.equal(Number(await page.locator('#stars-fill').getAttribute('width')),108);
            assert.equal(await page.locator('.review-grid figure').count(),1);
            assert.equal(await page.locator('.review-grid script').count(),0);
            assert.match(await page.locator('.review-grid blockquote').innerText(),/<script>/);
            assert.equal(await page.locator('iframe').getAttribute('loading'),'lazy');
          }
          if(label==='minimal') assert.equal(await page.locator('.hours,.location-card,.gallery,.service-card').count(),0);
          if(label==='invalid') assert.equal(await page.locator('[data-price]').innerText(),'Sob consulta');
          for(const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));
          if(await page.locator('.hero-image').count()) {
            assert.equal(await page.locator('.hero-image img').getAttribute('fetchpriority'),'high');
            assert.equal(await page.locator('.hero-image img').getAttribute('loading'),'eager');
            assert.ok((await page.locator('.hero-image img').evaluate(node=>node.currentSrc)).match(/\.(avif|webp)$/));
          }
          const reduced=await page.locator('html').evaluate(node=>getComputedStyle(node).scrollBehavior);
          assert.equal(reduced,'auto');
          await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
          await page.screenshot({path:path.join(screenshots,`${label}-${width}.png`),fullPage:true});
          // Auditoria automatizada de acessibilidade, incluindo contraste, em todos os cenários/larguras.
          await page.addScriptTag({content:axe.source});
          const audit=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
          assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${label} ${width} accessibility`);
          assert.deepEqual(errors,[],`${label} ${width} browser errors`);
          console.log(`PASS ${label} ${width}px: keyboard/menu, contacts, reviews, demo, images, SEO, axe/contrast, no overflow or browser/404 errors`);
          await page.close();
        }
        const context=await browser.newContext({javaScriptEnabled:false});
        const page=await context.newPage(); await page.goto(url);
        assert.equal(await page.title(),require('cheerio').load(html)('title').text());
        assert.equal(await page.locator('h1').count(),1);
        assert.equal(await page.locator('#avaliacoes').count(),label==='full'?1:0);
        await context.close();
      } finally {await new Promise(resolve=>server.close(resolve));}
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
