'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { createServer } = require('./serve.cjs');
const { normalize, phone } = require('./config.cjs');

function createPrivateServer(projectRoot) {
  const root = path.resolve(projectRoot);
  let settings;
  try { settings = JSON.parse(fs.readFileSync(path.join(root,'config.private.json'),'utf8')); }
  catch { throw new Error('Crie config.private.json localmente a partir do exemplo, usando JSON válido.'); }
  const number = phone(settings?.whatsapp);
  if (!number) throw new Error('Preencha um número válido somente no arquivo privado local.');
  if (!fs.existsSync(path.join(root,'dist/index.html'))) throw new Error('Execute npm run build antes da prévia privada.');
  const config = normalize(require(path.join(root,'config.js')),()=>{});
  const token = crypto.randomBytes(24).toString('hex');
  const endpoint = `/__private/${token}.js`;
  // Resposta criada em memória. Nunca escrita em dist, arquivo JS ou log.
  const client = `(()=>{'use strict';const settings=${JSON.stringify({number,message:config.whatsappMessage,serviceMessage:config.serviceMessage}).replace(/</g,'\\u003c')};
for(const button of document.querySelectorAll('.whatsapp,.service-cta,.whatsapp-float')){
 const link=document.createElement('a');
 for(const attribute of button.attributes) if(!['type','disabled','data-whatsapp-unavailable','aria-controls','aria-expanded','aria-describedby'].includes(attribute.name)) link.setAttribute(attribute.name,attribute.value);
 while(button.firstChild)link.append(button.firstChild);
 const service=button.classList.contains('service-cta')?button.closest('article')?.querySelector('h3')?.textContent:'';
 const message=service?settings.serviceMessage.split('{service}').join(service):settings.message;
 link.href='https://wa.me/'+settings.number+'?text='+encodeURIComponent(message);
 link.target='_blank';link.rel='noopener noreferrer';button.replaceWith(link);
}
document.querySelector('#whatsapp-notice')?.remove();
})();`;
  const files = createServer(path.join(root,'dist'));
  const server = http.createServer((req,res)=>{
    const address = server.address();
    const host = req.headers.host;
    const allowedHosts = [`127.0.0.1:${address.port}`,`localhost:${address.port}`];
    if (!allowedHosts.includes(host) || !['GET','HEAD'].includes(req.method)) { res.writeHead(403).end(); return; }
    const origin = req.headers.origin;
    const fetchSite = req.headers['sec-fetch-site'];
    if ((origin && !allowedHosts.some(value=>origin===`http://${value}`)) || (fetchSite && !['same-origin','none'].includes(fetchSite))) { res.writeHead(403).end(); return; }
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Robots-Tag','noindex, nofollow');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cross-Origin-Resource-Policy','same-origin');
    res.setHeader('Referrer-Policy','no-referrer');
    let pathname;
    try { pathname = new URL(req.url,'http://localhost').pathname; }
    catch { res.writeHead(400).end(); return; }
    if (pathname === endpoint) {
      res.writeHead(200,{'Content-Type':'application/javascript; charset=utf-8'});
      res.end(req.method==='HEAD'?'':client);return;
    }
    if (pathname === '/' || pathname === '/index.html') {
      const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8')
        .replace('</body>',`<script src="${endpoint}"></script></body>`);
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
      res.end(req.method==='HEAD'?'':html);return;
    }
    if (pathname.startsWith('/__private')) { res.writeHead(404).end(); return; }
    files.emit('request',req,res);
  });
  return server;
}
module.exports = { createPrivateServer };
if (require.main===module) {
  if (process.env.CF_PAGES) {
    console.error('Prévia privada permitida somente no computador local, não no Cloudflare Pages.');
    process.exitCode=1;
  } else {
    try {
      const server=createPrivateServer(path.resolve(__dirname,'..'));
      server.on('error',()=>{console.error('Não foi possível iniciar a prévia local. Feche outro servidor na porta 8788 e tente novamente.');process.exitCode=1;});
      server.listen(8788,'127.0.0.1',()=>console.log('Prévia privada local: abra http://127.0.0.1:8788 no próprio computador. Encerrar: Ctrl+C. Nenhum número é gravado em dist.'));
    } catch { console.error('Prévia não iniciada. Confira o build e o arquivo config.private.json local; o número não é registrado nos logs.'); process.exitCode=1; }
  }
}
