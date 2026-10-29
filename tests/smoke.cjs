const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const base = process.env.SITE_URL || 'http://127.0.0.1:8080';
const configSource = fs.readFileSync(path.join(__dirname, '../config.js'), 'utf8');
const output = process.env.SCREENSHOT_DIR || '/tmp/barbearia-v1-1-screenshots';
const widths = [375, 390, 768, 1280];
async function configured(page, overrides) {
  await page.route('**/config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `${configSource}\nwindow.BARBEARIA_CONFIG = {...window.BARBEARIA_CONFIG, ...${JSON.stringify(overrides)}};`
  }));
}
async function noOverflow(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
}
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1);
      assert.match(await page.title(), /Barbearia Exemplo/);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
      assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
      assert.doesNotMatch(await page.locator('body').innerText(), /demonstra|ilustrativ|conceitual|fictíci/i);
      assert.equal(await page.locator('.demo-banner, .image-disclosure').count(), 0);
      await noOverflow(page);
      for (const target of await page.locator('a[href^="#"]').evaluateAll(es => es.map(e => e.getAttribute('href')))) {
        assert.equal(await page.locator(target).count(), 1, `missing target ${target}`);
      }
      assert.equal(await page.locator('a[href*="wa.me"]').count(), 0);
      assert.ok(await page.locator('.whatsapp').isDisabled());
      assert.ok(await page.locator('#avaliacoes').isHidden());
      assert.equal(await page.locator('.review-grid figure').count(), 0);
      if (width <= 900) {
        await page.locator('.menu-toggle').click();
        assert.ok(await page.locator('#navegacao').isVisible());
        await page.locator('#navegacao a[href="#servicos"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
        await page.locator('.menu-toggle').click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
        assert.ok(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement));
        await page.locator('.menu-toggle').click();
        await page.locator('.hero-note').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
      await page.locator('.header-cta').click();
      assert.equal(new URL(page.url()).hash, '#agendamento');
      await page.locator('.contact a[href="#agendamento"]').click();
      assert.equal(new URL(page.url()).hash, '#agendamento');
      await page.locator('.hero-actions .text-link').click();
      assert.equal(new URL(page.url()).hash, '#servicos');
      await page.locator('.gallery').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.gallery img')].every(i => i.complete && i.naturalWidth > 0));
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${width}.png`), fullPage: true });
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: SEO, warnings removed, safe contacts, reviews hidden, navigation, images, overflow, console`);
      await page.close();
    }

    // Fixtures only: values below are never saved in site config or used to contact any service.
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await configured(page, {
        name: 'Marca de Teste', description: 'Descrição de teste para validar a configuração centralizada.',
        whatsapp: '12345678901', address: 'Texto de endereço apenas para teste local', mapUrl: 'https://example.invalid/map',
        hours: [{ day: 'Dia de teste', time: '10h — 16h' }],
        services: [{ id: 'teste', name: 'Serviço de teste', description: 'Descrição local', price: 60.50, duration: '20 min' }],
        socialLinks: [{ label: 'Rede de teste', url: 'https://example.invalid/social' }, { label: 'Inválido', url: 'javascript:alert(1)' }],
        galleryAdditionalImages: [
          { src: 'assets/test-one.jpg', alt: 'Fixture local um', width: 1536, height: 1024 },
          { src: 'assets/test-two.jpg', alt: 'Fixture local dois', width: 1536, height: 1024 }
        ],
        reviews: { verified: true, average: 4.7, count: 12, source: 'Fonte de teste', url: 'https://example.invalid/reviews', testimonials: [
          { author: 'Autor de teste', text: 'Texto de teste <script>alert(1)</script>', verified: true },
          { author: 'Não verificado', text: 'Não deve aparecer', verified: false }
        ] }
      });
      await page.route('**/assets/test-*.jpg', route => route.fulfill({ contentType: 'image/jpeg', body: fs.readFileSync(path.join(__dirname, '../assets/barbearia.jpg')) }));
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.match(await page.title(), /Marca de Teste/);
      assert.equal(await page.locator('.service-card').count(), 1);
      assert.match(await page.locator('[data-price="teste"]').innerText(), /60,50/);
      assert.match(await page.locator('.hours').innerText(), /Dia de teste/);
      assert.match(await page.locator('#business-address').innerText(), /Texto de endereço/);
      assert.ok(await page.locator('#map-link').isVisible());
      assert.equal(await page.locator('.social-links a').count(), 1);
      assert.equal(await page.locator('.gallery img').count(), 4);
      const href = await page.locator('.whatsapp').getAttribute('href');
      assert.equal(new URL(href).searchParams.get('text'), 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.');
      assert.equal(await page.locator('.whatsapp').getAttribute('rel'), 'noopener noreferrer');
      assert.ok(await page.locator('#avaliacoes').isVisible());
      assert.equal(await page.locator('#review-average').innerText(), '4,7 / 5');
      assert.equal(await page.locator('.review-stars').getAttribute('aria-label'), 'Nota 4,7 de 5');
      assert.ok(Math.abs(Number(await page.locator('#stars-fill').getAttribute('width')) - 112.8) < 0.001);
      assert.equal(await page.locator('.review-grid figure').count(), 1);
      assert.equal(await page.locator('.review-grid script').count(), 0);
      assert.match(await page.locator('.review-grid blockquote').innerText(), /<script>/);
      for (const image of await page.locator('.gallery img').all()) await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.gallery img')].every(i => i.complete && i.naturalWidth > 0));
      await page.locator('#avaliacoes').scrollIntoViewIfNeeded();
      await noOverflow(page);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `reviews-${width}.png`), fullPage: true });
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: configured identity, contacts, services, gallery (4), verified reviews and partial stars`);
      await page.close();
    }
    for (const reviews of [
      { verified: false, average: 4.7, count: 10, source: 'Teste', url: 'https://example.invalid' },
      { verified: true, average: 6, count: 10, source: 'Teste', url: 'https://example.invalid' },
      { verified: true, average: 4.7, count: 0, source: 'Teste', url: 'https://example.invalid' },
      { verified: true, average: 4.7, count: 10, source: '', url: 'https://example.invalid' },
      { verified: true, average: 4.7, count: 10, source: 'Teste', url: 'javascript:alert(1)' }
    ]) {
      const page = await browser.newPage();
      await configured(page, { reviews, whatsapp: 'invalid', address: '', mapUrl: 'javascript:alert(1)' });
      await page.goto(base);
      assert.ok(await page.locator('#avaliacoes').isHidden());
      assert.ok(await page.locator('.whatsapp').isDisabled());
      assert.ok(await page.locator('#map-link').isHidden());
      await page.close();
    }
    console.log('PASS incomplete/unverified/invalid reviews and contacts remain inactive');
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(base);
    assert.ok(await page.locator('#avaliacoes').isHidden());
    assert.ok(await page.locator('.whatsapp').isDisabled());
    assert.equal(await page.locator('.service-card').count(), 3);
    await context.close();
    console.log('PASS no-JavaScript safe fallback');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
