'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
function requireFile(relative) {
  const file = path.resolve(output, relative);
  if (!file.startsWith(output + path.sep)) throw new Error(`Referência fora da saída: ${relative}`);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) {
    throw new Error(`Arquivo de publicação ausente ou vazio: dist/${relative}`);
  }
}
function localReference(value) {
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) return;
  requireFile(decodeURIComponent(value.split(/[?#]/)[0]).replace(/^\//, ''));
}
try {
  const wrangler = JSON.parse(fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8'));
  if (path.resolve(root, wrangler.pages_build_output_dir) !== output) {
    throw new Error('pages_build_output_dir deve apontar para ./dist, a saída do gerador.');
  }
  for (const file of ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest', '_headers']) requireFile(file);
  const $ = cheerio.load(fs.readFileSync(path.join(output, 'index.html'), 'utf8'));
  if ($('h1').length !== 1) throw new Error('HTML de publicação sem um H1 único.');
  $('script[src],link[href],img[src],source[src]').each((_, node) => localReference($(node).attr('src') || $(node).attr('href')));
  $('[srcset]').each((_, node) => {
    for (const candidate of $(node).attr('srcset').split(',')) localReference(candidate.trim().split(/\s+/)[0]);
  });
  const css = fs.readFileSync(path.join(output, 'styles.css'), 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) localReference(match[1]);
  const manifest = JSON.parse(fs.readFileSync(path.join(output, 'manifest.webmanifest'), 'utf8'));
  for (const icon of manifest.icons || []) localReference(icon.src);
  console.log('Publicação validada: dist/index.html, CSS, JavaScript, SEO, manifest, ícones e recursos locais presentes. Saída consistente com wrangler.jsonc.');
} catch (error) {
  console.error(`Verificação de publicação falhou: ${error.message}`);
  process.exitCode = 1;
}
