'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const http=require('node:http');
const assert=require('node:assert/strict');
const {execFileSync,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const {createPrivateServer}=require('../scripts/private-preview.cjs');
const root=path.resolve(__dirname,'..');
let stage='preparação';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'barbearia-private-check-'));
// Contato sintético no intervalo NANP 555-01xx, somente em fixture temporária.
const number='1'+'202'+'555'+'01'+String(crypto.randomInt(100)).padStart(2,'0');
function snapshot() {
  const out=path.join(temp,'dist');
  return fs.readdirSync(out,{recursive:true}).filter(file=>fs.statSync(path.join(out,file)).isFile()).sort()
    .map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(out,file))).digest('hex')]);
}
function build() { return execFileSync(process.execPath,['scripts/build.cjs'],{cwd:temp,encoding:'utf8',stdio:'pipe'}); }
(async()=>{
 let browser,server;
 try {
  for(const file of ['scripts','assets','licenses','index.html','config.js','styles.css','script.js','wrangler.jsonc']) fs.cpSync(path.join(root,file),path.join(temp,file),{recursive:true});
  fs.symlinkSync(path.join(root,'node_modules'),path.join(temp,'node_modules'),'junction');
  stage='build inicial';build();const baseline=snapshot();
  fs.writeFileSync(path.join(temp,'config.private.json'),JSON.stringify({whatsapp:'+'+number}));
  fs.writeFileSync(path.join(temp,'assets/config.private.json'),JSON.stringify({whatsapp:'+'+number}));
  stage='build com arquivo privado';const log=build();
  assert.ok(!log.includes(number),'logs do build não devem incluir contato privado');
  assert.deepEqual(snapshot(),baseline,'arquivo privado não muda nenhum byte de dist');
  for(const [file] of snapshot()) assert.ok(!fs.readFileSync(path.join(temp,'dist',file)).includes(Buffer.from(number)),'contato privado ausente da saída');
  assert.ok(!fs.existsSync(path.join(temp,'dist/config.private.json')));
  stage='override de produção';const forbidden=spawnSync(process.execPath,['scripts/build.cjs','--config','config.private.json'],{cwd:temp,encoding:'utf8'});
  assert.equal(forbidden.status,1,'override privado proibido para publicação');
  assert.ok(!forbidden.stderr.includes(number));
  stage='Git ignore e exemplo';
  const gitFixture=path.join(temp,'git-ignore-check');fs.mkdirSync(gitFixture);
  fs.copyFileSync(path.join(root,'.gitignore'),path.join(gitFixture,'.gitignore'));
  execFileSync('git',['init','--quiet'],{cwd:gitFixture,stdio:'pipe'});
  execFileSync('git',['check-ignore','config.private.json'],{cwd:gitFixture,stdio:'pipe'});
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'config.private.example.json'),'utf8')).whatsapp,'');
  stage='servidor local';server=createPrivateServer(temp);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  assert.equal(server.address().address,'127.0.0.1');
  const url='http://127.0.0.1:'+server.address().port;
  stage='HTML e cache';const response=await fetch(url);const html=await response.text();
  assert.ok(!html.includes(number),'número não está no HTML servido');
  assert.equal(response.headers.get('cache-control'),'no-store');
  stage='controle de acesso';assert.equal((await fetch(url+'/config.private.json')).status,404);
  stage='bloqueio Origin';assert.equal((await fetch(url,{headers:{Origin:'https://example.test'}})).status,403);
  stage='bloqueio Host';
  const badHost=await new Promise((resolve,reject)=>{http.get(url,{headers:{Host:'example.test'}},response=>{response.resume();response.on('end',()=>resolve(response.statusCode));}).on('error',reject);});
  assert.equal(badHost,403);
  stage='bloqueio cross-site';assert.equal((await fetch(url,{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  const endpoint=html.match(/src="(\/__private\/[^\"]+\.js)"/)[1];
  assert.equal((await fetch(url+endpoint,{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  stage='navegador';browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  for(const width of [375,390,768,1024,1280,1440,1920]) {
    stage=`navegação ${width}px`;const page=await browser.newPage({viewport:{width,height:900}});const errors=[];
    page.on('pageerror',()=>errors.push('Erro JavaScript'));
    await page.context().route('https://wa.me/**',route=>route.fulfill({contentType:'text/html',body:'<title>Contato interceptado localmente</title>'}));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(url,{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-whatsapp-unavailable]').count(),0);
    for(const selector of width<=900?['.hero-cta','.whatsapp','.service-cta','.whatsapp-float']:['.hero-cta','.whatsapp','.service-cta']) {
      if(selector==='.whatsapp-float') {
        let visible=false;
        for(let y=0;y<=1800;y+=120){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(40);if(await page.locator(selector).isVisible()){visible=true;break;}}
        assert.ok(visible,'flutuante privado visível em área segura');
      }
      const item=page.locator(selector).first();const href=await item.getAttribute('href');
      assert.ok(new URL(href).pathname==='/'+number,'número local normalizado');
      const config=require(path.join(temp,'config.js'));
      const expected=selector==='.service-cta'?config.serviceMessage.replace('{service}',config.services[0].name):config.whatsappMessage;
      assert.ok(new URL(href).searchParams.get('text')===expected,'mensagem esperada');
      const [popup]=await Promise.all([page.waitForEvent('popup'),item.click()]);
      await popup.waitForURL(href,{waitUntil:'domcontentloaded'});
      assert.ok(await popup.evaluate(()=>opener===null));await popup.close();
    }
    assert.equal(await page.locator('#whatsapp-notice').count(),0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(errors,[]);await page.close();
    console.log(`PASS private ${width}px: links/mensagens locais, nova aba segura e dados ausentes de dist`);
  }
  assert.deepEqual(snapshot(),baseline,'navegação privada não grava arquivos publicados');
  console.log('PASS isolamento: Git ignore, exemplo vazio, logs seguros, produção idêntica, override negado, loopback/Host/Origin e requisições cross-site');
 } finally {
  if(browser)await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
  fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(()=>{console.error(`Teste privado falhou na etapa: ${stage}. Valores sensíveis omitidos.`);process.exitCode=1;});
