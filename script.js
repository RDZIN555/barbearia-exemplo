'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navegacao');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
const config = window.BARBEARIA_CONFIG || {};
const text = value => typeof value === 'string' ? value.trim() : '';
function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
function externalLink(label, href) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

// Identidade e SEO: texto simples evita interpretar configuração como HTML.
const name = text(config.name) || 'Barbearia Exemplo';
const [firstWord, ...remainingWords] = name.split(/\s+/);
for (const node of document.querySelectorAll('[data-name-first]')) node.textContent = firstWord.toLocaleUpperCase('pt-BR');
for (const node of document.querySelectorAll('[data-name-rest]')) node.textContent = remainingWords.join(' ').toLocaleUpperCase('pt-BR');
for (const node of document.querySelectorAll('[data-business-name]')) node.textContent = name;
for (const node of document.querySelectorAll('.brand')) node.setAttribute('aria-label', `${name}, início`);
document.title = `${name} — Seu estilo. Nossa assinatura.`;
document.querySelector('[property="og:title"]').content = document.title;
if (text(config.description)) {
  document.querySelector('[name="description"]').content = config.description;
  document.querySelector('[property="og:description"]').content = config.description;
}

const whatsapp = document.querySelector('.whatsapp');
// Valida o formato; titularidade e atendimento devem ser confirmados pelo proprietário.
if (typeof config.whatsapp === 'string' && /^[1-9]\d{9,14}$/.test(config.whatsapp)) {
  const message = text(config.whatsappMessage) || 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.';
  const link = externalLink('Consultar pelo WhatsApp', `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`);
  link.className = whatsapp.className;
  link.setAttribute('aria-describedby', 'whatsapp-status');
  whatsapp.replaceWith(link);
  document.querySelector('#whatsapp-status').textContent = 'Abre o WhatsApp em uma nova aba. Atendimento sujeito à disponibilidade.';
}

// O HTML mantém os dados de exemplo para leitura sem JavaScript.
// Quando preenchida, a lista de configuração define a ordem e quantidade dos serviços.
if (Array.isArray(config.services)) {
  const grid = document.querySelector('.service-grid');
  const originals = [...grid.children];
  const fragment = document.createDocumentFragment();
  config.services.forEach((service, index) => {
    if (!service || !text(service.name)) return;
    const card = (originals[index] || originals[0]).cloneNode(true);
    card.querySelector('.service-number').textContent = String(index + 1).padStart(2, '0');
    card.querySelector('h3').textContent = service.name;
    card.querySelector('p').textContent = text(service.description);
    const priceNode = card.querySelector('[data-price]');
    priceNode.dataset.price = text(service.id) || String(index);
    const price = service.price;
    priceNode.textContent = typeof price === 'number' && Number.isFinite(price) && price >= 0
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(price) ? 0 : 2 }).format(price)
      : 'Sob consulta';
    card.querySelector('.service-price > span').textContent = text(service.duration);
    fragment.append(card);
  });
  grid.replaceChildren(fragment);
}

if (Array.isArray(config.hours)) {
  const list = document.querySelector('.hours dl');
  list.replaceChildren();
  for (const row of config.hours) {
    if (!row || !text(row.day) || !text(row.time)) continue;
    const wrapper = document.createElement('div');
    const day = document.createElement('dt');
    const time = document.createElement('dd');
    day.textContent = row.day;
    time.textContent = row.time;
    wrapper.append(day, time);
    list.append(wrapper);
  }
  if (!list.children.length) {
    const note = document.createElement('p');
    note.textContent = 'Consulte os horários de atendimento.';
    list.replaceWith(note);
  }
}
const address = text(config.address);
if (address) document.querySelector('#business-address').textContent = address;
const mapUrl = httpsUrl(config.mapUrl);
if (address && mapUrl) {
  const map = document.querySelector('#map-link');
  map.href = mapUrl;
  map.hidden = false;
}
const socials = document.querySelector('.social-links');
if (Array.isArray(config.socialLinks)) {
  for (const social of config.socialLinks) {
    if (!social || !text(social.label) || !httpsUrl(social.url)) continue;
    socials.append(externalLink(social.label, httpsUrl(social.url)));
  }
  socials.hidden = !socials.children.length;
}

// Preserve as duas imagens existentes; a grade se adapta a até quatro imagens.
const gallery = document.querySelector('.gallery-grid');
const existingSources = new Set([...gallery.querySelectorAll('img')].map(img => img.getAttribute('src')));
if (Array.isArray(config.galleryAdditionalImages)) {
  for (const photo of config.galleryAdditionalImages) {
    if (gallery.children.length >= 4) break;
    if (!photo || !text(photo.alt) || !/^assets\/[a-zA-Z0-9_/-]+\.(?:jpe?g|png|webp|avif)$/i.test(photo.src) || existingSources.has(photo.src)) continue;
    if (!Number.isInteger(photo.width) || photo.width <= 0 || !Number.isInteger(photo.height) || photo.height <= 0) continue;
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = photo.width;
    image.height = photo.height;
    figure.append(image);
    if (text(photo.caption)) {
      const caption = document.createElement('figcaption');
      caption.textContent = photo.caption;
      figure.append(caption);
    }
    gallery.append(figure);
    existingSources.add(photo.src);
  }
}
gallery.dataset.count = String(gallery.children.length);

// Avaliações ficam ausentes da apresentação até a confirmação da fonte real.
// Nunca inferir nota média ou quantidade com base nos depoimentos selecionados.
const reviews = config.reviews;
if (reviews && reviews.verified === true && typeof reviews.average === 'number'
    && Number.isFinite(reviews.average) && reviews.average >= 0 && reviews.average <= 5
    && Number.isSafeInteger(reviews.count) && reviews.count > 0
    && text(reviews.source) && httpsUrl(reviews.url)) {
  const formatted = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(reviews.average);
  document.querySelector('#review-average').textContent = `${formatted} / 5`;
  document.querySelector('.review-stars').setAttribute('aria-label', `Nota ${formatted} de 5`);
  // Cada estrela ocupa 24 unidades; a quinta pode ficar parcialmente preenchida.
  document.querySelector('#stars-fill').setAttribute('width', String(reviews.average / 5 * 120));
  document.querySelector('#review-count').textContent = `${new Intl.NumberFormat('pt-BR').format(reviews.count)} ${reviews.count === 1 ? 'avaliação' : 'avaliações'}`;
  const source = document.querySelector('#review-source');
  source.textContent = `Ver na fonte: ${reviews.source}`;
  source.href = httpsUrl(reviews.url);
  const grid = document.querySelector('.review-grid');
  if (Array.isArray(reviews.testimonials)) {
    for (const review of reviews.testimonials) {
      if (!review || review.verified !== true || !text(review.author) || !text(review.text)) continue;
      const card = document.createElement('figure');
      const quote = document.createElement('blockquote');
      const author = document.createElement('figcaption');
      quote.textContent = review.text;
      author.textContent = review.author;
      card.append(quote, author);
      grid.append(card);
    }
  }
  document.querySelector('#avaliacoes').hidden = false;
}
document.querySelector('#year').textContent = new Date().getFullYear();
