'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('./serve.cjs');
(async () => {
  const { default: lighthouse } = await import('lighthouse');
  const { launch } = await import('chrome-launcher');
  const root = path.resolve(process.argv[2] || 'dist');
  const label = (process.argv[3] || 'after').replace(/[^a-z0-9-]/gi, '');
  const dir = '/tmp/barbearia-audits';
  fs.mkdirSync(dir, { recursive: true });
  const server = createServer(root);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let chrome;
  try {
    chrome = await launch({ chromePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
    const result = await lighthouse(`http://127.0.0.1:${server.address().port}`, { port: chrome.port, output: ['json','html'], logLevel: 'error', onlyCategories: ['performance','accessibility','best-practices','seo'] });
    fs.writeFileSync(`${dir}/${label}.json`, result.report[0]);
    fs.writeFileSync(`${dir}/${label}.html`, result.report[1]);
    console.log(JSON.stringify({ label, categories: Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value]) => [key,Math.round(value.score * 100)])), warnings: result.lhr.runWarnings }));
  } finally { if (chrome) await chrome.kill(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
