'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const sharp = require('sharp');
const { normalize, string } = require('./config.cjs');
const { brandIcon } = require('./brand-icon.cjs');
const root = path.resolve(__dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? '' : process.argv[i + 1]; };
const output = path.resolve(arg('--out') || path.join(root, 'dist'));
// Somente diretórios de saída conhecidos podem ser apagados pelo build.
if (output !== path.join(root, 'dist') && !/^\/tmp\/barbearia-[a-zA-Z0-9_/-]+$/.test(output)) throw new Error('Diretório de saída não permitido.');
const configFile = path.resolve(arg('--config') || path.join(root, 'config.js'));
if (output === path.join(root, 'dist') && configFile !== path.join(root, 'config.js')) {
  throw new Error('O build de publicação aceita somente config.js; configuração privada não pode gerar dist.');
}
const raw = require(configFile);
const config = normalize(raw);
const cache = path.join(root, 'node_modules/.cache/barbearia');
fs.mkdirSync(cache, { recursive: true });
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const money = value => value === null ? 'Sob consulta' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);
const imageEngine = `sharp-${sharp.versions.sharp}-vips-${sharp.versions.vips}`;
const wa = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
sharp.concurrency(2);

(async () => {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true, filter: file => path.basename(file) !== 'config.private.json' });
  fs.cpSync(path.join(root, 'licenses'), path.join(output, 'licenses'), { recursive: true, filter: file => path.basename(file) !== 'config.private.json' });
  const $ = cheerio.load(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  const iconMarkup = fs.readFileSync(path.join(root, 'assets/icons/whatsapp.svg'), 'utf8');
  function whatsappAction(label, className, message, ariaLabel) {
    const node = $(config.whatsapp ? '<a>' : '<button type="button">').addClass(className + ' whatsapp-action');
    const icon = $(iconMarkup).attr({ 'aria-hidden':'true', focusable:'false' });
    node.append(icon).append($('<span>').text(label));
    if (ariaLabel) node.attr('aria-label',ariaLabel);
    if (config.whatsapp) link(node,wa(message));
    else node.attr({ 'data-whatsapp-unavailable':'', 'aria-controls':'whatsapp-notice', 'aria-expanded':'false' });
    return node;
  }
  const report = [];
  const photos = new Map();
  async function photo(info) {
    if (photos.has(info.src)) return photos.get(info.src);
    const file = path.resolve(root, info.src);
    if (!fs.realpathSync(file).startsWith(fs.realpathSync(path.join(root, 'assets')) + path.sep)) throw new Error('Imagem fora de assets.');
    const input = fs.readFileSync(file);
    const meta = await sharp(input).metadata();
    const widths = [...new Set([480,768,1200,1600,Math.min(meta.width,1600)].filter(width => width <= meta.width))].sort((a,b) => a-b);
    const variants = { webp: [], avif: [] };
    const id = hash(Buffer.concat([input, Buffer.from(`quality76-avif45-${imageEngine}`)]));
    for (const width of widths) {
      for (const format of ['webp','avif']) {
        const name = `assets/optimized/${id}-${width}.${format}`;
        const cached = path.join(cache, path.basename(name));
        if (!fs.existsSync(cached)) await sharp(input).resize({ width, withoutEnlargement:true })[format](format === 'webp' ? { quality:76, effort:5 } : { quality:45, effort:4 }).toFile(cached);
        fs.mkdirSync(path.dirname(path.join(output,name)), { recursive:true });
        fs.copyFileSync(cached, path.join(output,name));
        variants[format].push({ src:name, width, bytes:fs.statSync(cached).size });
      }
    }
    const result = { ...info, width:meta.width, height:meta.height, variants };
    photos.set(info.src,result);
    report.push({ original:info.src, originalBytes:input.length, width:meta.width, height:meta.height, variants });
    return result;
  }
  async function picture(info, hero = false, layout = 'standard') {
    const asset = await photo(info);
    const element = $('<picture>');
    const sizes = hero ? '100vw' : layout === 'logo' ? '(max-width: 600px) 40px, 58px' : layout === 'wide' ? '(min-width: 1600px) 1440px, 90vw' : layout === 'third' ? '(max-width: 600px) 88vw, (min-width: 1600px) 470px, 30vw' : '(max-width: 600px) 88vw, 55vw';
    for (const format of ['avif','webp']) element.append($('<source>').attr({ type:`image/${format}`, srcset:asset.variants[format].map(v => `${v.src} ${v.width}w`).join(', '), sizes }));
    const image = $('<img>').attr({ src:info.src, alt:info.alt, width:asset.width, height:asset.height, decoding:'async', loading:hero ? 'eager' : 'lazy' });
    if (hero) image.attr('fetchpriority', 'high');
    element.append(image);
    return element;
  }
  const content = config.content;
  const colorVars = { background:'bg', panel:'panel', accent:'gold', text:'white', muted:'muted', border:'line' };
  $('html').attr('style',Object.entries(config.brand.colors).map(([key,value]) => `--${colorVars[key]}:${value}`).join(';'));
  if (config.brand.colors.background) $('meta[name="theme-color"]').attr('content',config.brand.colors.background);
  function copy(value, fallback = '') { return string(value) || fallback; }
  function multiline(node, value) { node.empty(); String(value).split('\n').forEach((line,i) => { if(i) node.append('<br>'); node.append(escape(line)); }); }
  function heading(node, first, accent, lead = '') {
    node.empty().append(escape(first));
    if (accent || lead) node.append('<br>');
    if (lead) node.append(escape(lead) + ' ');
    if (accent) node.append($('<em>').text(accent));
  }
  function section(selector, data, fallback) {
    data = data || {};
    const section = $(selector);
    section.find('.eyebrow').first().text(copy(data.eyebrow, fallback));
    heading(section.find('h2').first(), copy(data.first,fallback), copy(data.accent));
    const description = section.find('.section-heading > p').first();
    if (copy(data.description)) multiline(description, data.description); else description.remove();
  }
  function link(node, href) { node.attr({ href, target:'_blank', rel:'noopener noreferrer' }); }
  const monogram = [...config.name][0].toLocaleUpperCase('pt-BR');
  const words = config.name.split(/\s+/);
  $('[data-name-first]').text(words[0].toLocaleUpperCase('pt-BR'));
  $('[data-name-rest]').text(words.slice(1).join(' ').toLocaleUpperCase('pt-BR'));
  $('.brand').attr('aria-label', `${config.name}, início`);
  $('.brand-mark').empty().append(escape(monogram)).append('<span>✦</span>');
  if (config.brand.logo) {
    const logo = await picture(config.brand.logo,false,'logo');
    logo.find('img').attr('loading','eager');
    logo.addClass('brand-logo');
    $('.brand-mark').each((i,node) => $(node).replaceWith(logo.clone()));
  }
  const navLabels = Array.isArray(content.nav) ? content.nav : ['Serviços','O espaço','Nossa essência','Contato'];
  $('#navegacao a').each((i,node) => $(node).text(copy(navLabels[i], ['Serviços','O espaço','Nossa essência','Contato'][i])));
  $('.header-cta').empty().text(copy(content.headerCta,'Agende seu horário')).append('<span class="arrow-up" aria-hidden="true"></span>');
  const hero = content.hero || {};
  $('.hero .eyebrow').empty().append('<span></span>').append(escape(copy(hero.eyebrow)));
  if (!copy(hero.eyebrow)) $('.hero .eyebrow').remove();
  heading($('h1'), copy(hero.first,config.slogan || config.name), copy(hero.accent), copy(hero.lead));
  if (copy(hero.description)) multiline($('.hero-description'), hero.description); else $('.hero-description').remove();
  $('.hero-actions .button').replaceWith(whatsappAction(copy(hero.primaryCta,'Agendar pelo WhatsApp'), 'button hero-cta', config.whatsappMessage));
  $('.hero-actions .text-link').empty().text(copy(hero.secondaryCta,'Conheça os serviços')).append('<span aria-hidden="true">↓</span>');
  if (copy(hero.note)) $('.hero-note').empty().append('<span aria-hidden="true">✦</span>').append(escape(hero.note)); else $('.hero-note').remove();
  if (copy(hero.caption)) $('.hero-caption').text(hero.caption); else $('.hero-caption').remove();
  if (config.images.hero) $('.hero-image').replaceWith((await picture(config.images.hero,true)).addClass('hero-image')); else $('.hero-image').remove();
  $('.values-strip').empty();
  (Array.isArray(content.values) ? content.values : []).filter(string).forEach((value,i) => { if(i) $('.values-strip').append('<i aria-hidden="true">✦</i>'); $('.values-strip').append($('<span>').text(value)); });
  if (!$('.values-strip').children().length) $('.values-strip').remove();

  section('#servicos',content.services,'Serviços');
  const cards = $('.service-card').toArray().map(node => $(node).clone());
  $('.service-grid').empty().attr('data-count',config.services.length);
  config.services.forEach((service,i) => {
    const card = (cards[i] || cards[0]).clone();
    card.find('h3').text(service.name);
    card.find('.service-number').text(String(i+1).padStart(2,'0'));
    if (service.description) card.find('p').text(service.description); else card.find('p').remove();
    card.find('[data-price]').attr('data-price',service.id).text(money(service.price));
    if (service.duration) card.find('.service-price > span').text(service.duration); else card.find('.service-price > span').remove();
    const button = whatsappAction(
      copy(content.services?.serviceCta,'Agendar este serviço'), 'button service-cta',
      config.serviceMessage.split('{service}').join(service.name),
      `Consultar horários para ${service.name} pelo WhatsApp`
    );
    card.append(button);
    $('.service-grid').append(card);
  });
  const footnote = $('.service-footnote').empty().append(escape(copy(content.services?.footnote)));
  footnote.append(' ').append($('<a href="#agendamento">').text(copy(content.services?.cta,'Consulte a disponibilidade')));
  if (!config.services.length) $('.service-grid').remove();

  section('#espaco',content.gallery,'O espaço');
  $('.gallery-grid').empty().attr('data-count',config.images.gallery.length);
  for (const [i,info] of config.images.gallery.entries()) {
    const figure = $('<figure>').addClass(i === 0 ? 'gallery-main' : '');
    figure.append(await picture(info,false,config.images.gallery.length === 4 ? (i === 0 ? 'wide' : 'third') : 'standard'));
    if (info.caption) figure.append($('<figcaption>').text(info.caption));
    $('.gallery-grid').append(figure);
  }
  if (!config.images.gallery.length) $('#espaco').remove();
  // Seções opcionais ausentes também saem da navegação, sem âncoras quebradas.
  if (!$('#espaco').length) $('#navegacao a[href="#espaco"]').remove();
  const about = content.about || {};
  section('#sobre',about,'Nosso cuidado');
  $('#sobre p:not(.eyebrow)').remove();
  const aboutCopy = $('#sobre > div').last();
  for (const paragraph of Array.isArray(about.paragraphs) ? about.paragraphs : []) if (string(paragraph)) aboutCopy.find('.about-signature').before($('<p>').text(paragraph.split('{name}').join(config.name)));
  if (copy(about.signature)) $('.about-signature').text(about.signature); else $('.about-signature').remove();
  $('.about-seal > span').first().text(copy(about.sealTop));
  $('.about-seal > span').last().text(copy(about.sealBottom));
  $('.about-seal strong').empty().append(escape(monogram)).append('<span>✦</span>');

  const reviews = config.reviews;
  if (reviews.active) {
    $('#avaliacoes').removeAttr('hidden');
    section('#avaliacoes',content.reviews,'Avaliações');
    if (reviews.average !== null) {
      const average = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(reviews.average);
      $('#review-average').text(`${average} / 5`);
      $('.review-stars').attr('aria-label',`Nota ${average} de 5`);
      $('#stars-fill').attr('width', (reviews.average / 5 * 120).toFixed(3));
    } else $('#review-average, .review-stars').remove();
    if (reviews.count) $('#review-count').text(`${new Intl.NumberFormat('pt-BR').format(reviews.count)} ${reviews.count === 1 ? 'avaliação' : 'avaliações'}`); else $('#review-count').remove();
    if (reviews.source) {
      $('#review-source').text(reviews.source);
      if (reviews.url) link($('#review-source'),reviews.url); else $('#review-source').replaceWith($('<span class="review-platform">').text(reviews.source));
    } else $('#review-source').remove();
    if (!$('.review-summary').children().length) $('.review-summary').remove();
    for (const item of reviews.testimonials) $('.review-grid').append($('<figure>').append($('<blockquote>').text(item.text)).append($('<figcaption>').text(item.author)));
  } else $('#avaliacoes').remove();

  const booking = content.booking || {};
  section('#agendamento',booking,'Vamos conversar');
  if (copy(booking.description)) $('#agendamento > div').first().children('p:not(.eyebrow)').text(booking.description); else $('#agendamento > div').first().children('p:not(.eyebrow)').remove();
  const bookingButton = whatsappAction(copy(booking.cta,'Consultar pelo WhatsApp'), 'button whatsapp', config.whatsappMessage);
  $('.whatsapp').replaceWith(bookingButton);
  if (config.whatsapp) {
    bookingButton.attr('aria-describedby','whatsapp-status');
    $('#whatsapp-status').text('Abre o WhatsApp em uma nova aba. Atendimento sujeito à disponibilidade.');
  } else $('#whatsapp-status').remove();
  const contact = content.contact || {};
  section('#contato',contact,'Contato');
  if (copy(contact.description)) multiline($('#contato > div').first().children('p:not(.eyebrow)'),contact.description); else $('#contato > div').first().children('p:not(.eyebrow)').remove();
  $('#contato > div').first().find('.text-link').empty().text(copy(contact.cta,'Informações de agendamento')).append('<span class="arrow-up" aria-hidden="true"></span>');
  $('.hours h3').text(copy(contact.hoursTitle,'Horário de funcionamento'));
  $('.hours dl').empty();
  for (const row of config.hours) $('.hours dl').append($('<div>').append($('<dt>').text(row.day)).append($('<dd>').text(row.time)));
  if (!config.hours.length) $('.hours').remove();
  const hasLocation = Boolean(config.address);
  $('.location-card').attr('data-location',hasLocation ? 'configured' : 'pending');
  $('.location-card h3').text(copy(hasLocation ? contact.locationTitle : contact.pendingTitle, hasLocation ? 'Nosso endereço' : 'Localização a definir'));
  if (config.address) $('#business-address').text(config.address); else $('#business-address').remove();
  const area = [config.neighborhood,config.city,config.state].filter(Boolean).join(' · ');
  if (area) $('.business-city').text(area); else $('.business-city').remove();
  if (!hasLocation) $('.location-pending').text(copy(contact.pendingDescription,'Endereço, bairro e cidade serão apresentados aqui.')); else $('.location-pending').remove();
  // A rota e o mapa só aparecem junto de uma localização cadastrada.
  if (hasLocation && config.mapa.link) { link($('#map-link'),config.mapa.link); $('#map-link').removeAttr('hidden'); } else $('#map-link').remove();
  if (copy(contact.locationLabel) && hasLocation) $('.location-label').text(contact.locationLabel); else $('.location-label').remove();
  if (hasLocation && config.mapa.embed) $('.location-card').append($('<div class="map-frame">').append($('<iframe>').attr({ src:config.mapa.embed, title:`Mapa de localização de ${config.name}`, loading:'lazy', width:'1100', height:'320', referrerpolicy:'no-referrer' })));
  if (copy(contact.hoursNote) && config.hours.length) $('.hours').append($('<p class="hours-note">').text(contact.hoursNote));
  // Uma seção compacta reúne localização e atendimento antes da chamada final.
  $('#contato').attr('data-columns',config.hours.length ? '2' : '1');
  $('#contato > div').first().find('.text-link').attr('href','#agendamento');
  $('#agendamento').insertAfter('#contato');
  $('.social-links').empty();
  for (const social of config.socialLinks) { const item = $('<a>').text(social.label); link(item,social.url); $('.social-links').append(item); }
  if (config.socialLinks.length) $('.social-links').removeAttr('hidden'); else $('.social-links').remove();
  $('footer > p').text(copy(content.footer?.signature,config.slogan));
  if (!copy(content.footer?.signature,config.slogan)) $('footer > p').remove();
  $('.footer-bottom > span').first().empty().append('© <span id="year">'+new Date().getUTCFullYear()+'</span> '+escape(config.name)+'.');
  $('.footer-bottom > span').last().text(copy(content.footer?.note));
  if (config.demo.enabled && config.demo.contatoLink) {
    const demo = $('<section class="commercial-demo" aria-labelledby="commercial-title">');
    demo.append($('<div>').append($('<h2 id="commercial-title">').text(config.demo.titulo)));
    if (config.demo.texto) demo.find('div').append($('<p>').text(config.demo.texto));
    const button = $('<a class="button">').text(config.demo.contatoLabel); link(button,config.demo.contatoLink);
    demo.append(button); $('footer').before(demo);
  }
  if (config.floating.enabled) {
    const floating = whatsappAction('', 'whatsapp-float', config.whatsappMessage, config.floating.label)
      .attr('data-desktop',String(config.floating.desktop));
    floating.find('span').remove();
    $('body').append(floating).addClass('has-floating-whatsapp');
  }
  if (!config.whatsapp) {
    const notice = $('<div id="whatsapp-notice" class="whatsapp-notice" hidden>')
      .attr({ 'data-message':config.whatsappUnavailableMessage, role:'region', 'aria-label':'Informação de contato' });
    notice.append('<p id="whatsapp-notice-text" role="status" aria-live="polite" aria-atomic="true"></p>');
    notice.append('<button type="button" class="notice-close" aria-label="Fechar mensagem"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M6 18 18 6"/></svg></button>');
    $('body').append(notice);
    // Alternativa de leitura para visitantes que desativaram JavaScript.
    $('.booking-action').append($('<noscript>').text(config.whatsappUnavailableMessage));
  }

  // Metadados efetivamente publicados no HTML, sem depender do navegador.
  $('meta[name="description"]').attr('content',config.description);
  const title = [config.name, [config.city,config.state].filter(Boolean).join(' · ')].filter(Boolean).join(' em ');
  $('title').text(`${title}${config.slogan ? ` — ${config.slogan}` : ''}`);
  const meta = (key,value,property=false) => { if (!value) return; const attribute = property ? 'property' : 'name'; const selector = `meta[${attribute}="${key}"]`; const node = $(selector).length ? $(selector) : $('<meta>').attr(attribute,key).appendTo('head'); node.attr('content',String(value)); };
  meta('og:title',$('title').text(),true); meta('og:description',config.description,true);
  meta('og:locale','pt_BR',true); meta('og:type','website',true); meta('og:site_name',config.name,true);
  meta('twitter:card','summary_large_image'); meta('twitter:title',$('title').text()); meta('twitter:description',config.description);
  if (config.demo.enabled) meta('robots','noindex, nofollow'); else $('meta[name="robots"]').remove();
  if (config.siteUrl) { $('head').append($('<link rel="canonical">').attr('href',config.siteUrl)); meta('og:url',config.siteUrl,true); }
  let socialImage = '';
  if (config.images.hero) {
    const input = fs.readFileSync(path.join(root,config.images.hero.src));
    const overlay = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade"><stop stop-color="#151714" stop-opacity=".9"/><stop offset="1" stop-color="#151714" stop-opacity=".15"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><path d="M70 370h70" stroke="#c8aa75" stroke-width="2"/><text x="70" y="440" font-family="Georgia,serif" font-size="${Math.min(64,1050/Math.max(config.name.length,1)*1.6)}" fill="#f4f0e7">${escape(config.name)}</text><text x="70" y="500" font-family="Georgia,serif" font-size="${Math.min(30,1050/Math.max(config.slogan.length,1)*1.6)}" fill="#c8aa75">${escape(config.slogan)}</text></svg>`;
    const key = hash(Buffer.concat([input,Buffer.from(overlay + imageEngine)]));
    const cached = path.join(cache,`og-${key}.jpg`);
    if (!fs.existsSync(cached)) await sharp(input).resize(1200,630,{fit:'cover'}).composite([{input:Buffer.from(overlay)}]).jpeg({quality:85,mozjpeg:true}).toFile(cached);
    fs.copyFileSync(cached,path.join(output,'assets/og-image.jpg'));
    if (config.siteUrl) {
      socialImage = new URL('assets/og-image.jpg',config.siteUrl).href;
      meta('og:image',socialImage,true); meta('og:image:width',1200,true); meta('og:image:height',630,true); meta('og:image:alt',`${config.name} — ${config.images.hero.alt}`,true);
      meta('twitter:image',socialImage); meta('twitter:image:alt',`${config.name} — ${config.images.hero.alt}`);
    }
  }
  const schema = { '@context':'https://schema.org', '@type':'HairSalon', name:config.name, description:config.description };
  if (config.siteUrl) { schema.url = config.siteUrl; schema['@id'] = config.siteUrl+'#barbearia'; }
  if (socialImage) schema.image = socialImage;
  if (config.whatsapp) schema.telephone = '+'+config.whatsapp;
  if (config.address || config.city || config.state || config.country) {
    schema.address = { '@type':'PostalAddress' };
    for (const [key,value] of Object.entries({streetAddress:config.address,addressLocality:config.city,addressRegion:config.state,addressCountry:config.country})) if(value) schema.address[key]=value;
  }
  if (config.socialLinks.length) schema.sameAs = config.socialLinks.map(item=>item.url);
  // Avaliações de negócio local não ganham marcação para rich snippets de autoavaliação.
  $('head').append($('<script type="application/ld+json">').text(JSON.stringify(schema).replace(/</g,'\\u003c')));
  $('script[src="config.js"]').remove();
  $('link[rel="stylesheet"]').before('<script>document.documentElement.classList.add("js")</script>');
  const icon = brandIcon(monogram);
  fs.writeFileSync(path.join(output,'assets/brand-icon.svg'),icon);
  for (const size of [16,32,48,180,192,512]) await sharp(Buffer.from(icon)).resize(size,size).png().toFile(path.join(output,`assets/icon-${size}.png`));
  const iconVersion = hash(icon);
  $('link[rel="icon"]').attr({href:`assets/brand-icon.svg?v=${iconVersion}`,sizes:'any'});
  for (const size of [16,32,48]) $('head').append($('<link rel="icon" type="image/png">').attr({href:`assets/icon-${size}.png?v=${iconVersion}`,sizes:`${size}x${size}`}));
  $('head').append(`<link rel="apple-touch-icon" sizes="180x180" href="assets/icon-180.png?v=${iconVersion}"><link rel="manifest" href="manifest.webmanifest">`);
  fs.writeFileSync(path.join(output,'manifest.webmanifest'),JSON.stringify({ name:config.name,short_name:config.name,lang:'pt-BR',start_url:'.',display:'standalone',background_color:config.brand.colors.background || '#151714',theme_color:config.brand.colors.background || '#151714',icons:[192,512].map(size=>({src:`assets/icon-${size}.png?v=${iconVersion}`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'})) },null,2));
  fs.writeFileSync(path.join(output,'robots.txt'),`User-agent: *\n${config.demo.enabled ? 'Disallow: /' : 'Allow: /'}\n${!config.demo.enabled && config.siteUrl ? `Sitemap: ${new URL('sitemap.xml',config.siteUrl).href}\n` : ''}`);
  fs.writeFileSync(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${!config.demo.enabled && config.siteUrl ? `<url><loc>${escape(config.siteUrl)}</loc></url>` : ''}</urlset>\n`);
  fs.writeFileSync(path.join(output,'_headers'),`/*\n${config.demo.enabled ? '  X-Robots-Tag: noindex, nofollow\n' : ''}  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
  for (const file of ['styles.css','script.js']) fs.copyFileSync(path.join(root,file),path.join(output,file));
  fs.writeFileSync(path.join(output,'index.html'),$.html());
  fs.writeFileSync(path.join(output,'image-report.json'),JSON.stringify(report,null,2));
  console.log(`Build concluído: ${output}. Modo ${config.demo.enabled ? 'demonstração (noindex)' : 'cliente'}.`);
  for(const item of report) console.log(`Imagem ${item.original}: original ${item.originalBytes} bytes; WebP ${item.variants.webp.at(-1).bytes}; AVIF ${item.variants.avif.at(-1).bytes} (derivados até ${item.variants.avif.at(-1).width}px; original ${item.width}x${item.height}).`);
})().catch(error => { console.error('Build não concluído:',error.message); process.exitCode=1; });
