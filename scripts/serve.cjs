'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.avif':'image/avif', '.xml':'application/xml', '.txt':'text/plain' };
function createServer(root) {
  const base = path.resolve(root);
  return http.createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(base, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
      if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
      const data = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404).end('Not found'); }
  });
}
module.exports = { createServer };
if (require.main === module) {
  const root = path.resolve(process.argv[2] || 'dist');
  const port = Number(process.env.PORT || 8080);
  createServer(root).listen(port, '127.0.0.1', () => console.log(`Servidor local ativo na porta ${port}; pasta ${root}`));
}
