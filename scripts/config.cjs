'use strict';
const string = value => typeof value === 'string' ? value.trim() : '';
const list = value => Array.isArray(value) ? value : [];
function https(value) {
  try {
    if (!/^https:\/\//i.test(string(value)) || /\s/.test(value)) return '';
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
function phone(value) {
  const raw = string(value);
  if (!raw || !/^[+\d\s().-]+$/.test(raw) || (raw.match(/\+/g) || []).length > 1 || (raw.includes('+') && !raw.startsWith('+'))) return '';
  let digits = raw.replace(/\D/g, '');
  const international = raw.startsWith('+') || digits.startsWith('00');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (!international && (digits.length === 10 || digits.length === 11)) digits = '55' + digits;
  else if (!international && !digits.startsWith('55')) return '';
  if (!/^[1-9]\d{9,14}$/.test(digits)) return '';
  if (digits.startsWith('55') && !/^55[1-9]\d\d{8,9}$/.test(digits)) return '';
  return digits;
}
function embed(value) {
  const safe = https(value);
  if (!safe) return '';
  const url = new URL(safe);
  if (url.port) return '';
  return (url.hostname === 'www.google.com' && /^\/maps\/embed(?:\/|$)/.test(url.pathname))
    || (url.hostname === 'www.openstreetmap.org' && url.pathname === '/export/embed.html') ? safe : '';
}
function image(value) {
  return value && /^assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp|avif)$/i.test(value.src)
    && string(value.alt) ? { src: value.src, alt: string(value.alt), caption: string(value.caption) } : null;
}
function normalize(raw = {}, warn = console.warn) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
  const warnings = [];
  const note = field => { warnings.push(field); warn(`[config] ${field}: ausente ou inválido; campo omitido ou padrão seguro aplicado.`); };
  const url = (value, field) => { const result = https(value); if (string(value) && !result) note(field); return result; };
  const name = string(raw.name) || 'Barbearia';
  if (!string(raw.name)) note('name');
  const number = phone(raw.whatsapp);
  if (string(raw.whatsapp) && !number) note('whatsapp');
  let siteUrl = url(raw.siteUrl, 'siteUrl');
  if (siteUrl) { const parsed = new URL(siteUrl); parsed.hash = ''; parsed.search = ''; parsed.pathname = parsed.pathname.replace(/\/*$/, '/'); siteUrl = parsed.href; }
  if (!siteUrl) note('siteUrl (canonical, imagem social e sitemap precisam de domínio confirmado)');
  const services = list(raw.services).flatMap((service, i) => {
    if (!service || !string(service.name)) { note(`services[${i}].name`); return []; }
    const validPrice = typeof service.price === 'number' && Number.isFinite(service.price) && service.price >= 0;
    if (service.price != null && !validPrice) note(`services[${i}].price`);
    if (!string(service.description)) note(`services[${i}].description`);
    return [{ id: string(service.id) || `servico-${i+1}`, name: string(service.name), description: string(service.description), duration: string(service.duration), price: validPrice ? service.price : null }];
  });
  const hours = list(raw.hours).filter(row => {
    const valid = row && string(row.day) && string(row.time);
    if (!valid) note('hours');
    return valid;
  });
  const reviews = raw.reviews || {};
  const verified = reviews.verified === true;
  const average = verified && typeof reviews.average === 'number' && Number.isFinite(reviews.average) && reviews.average >= 0 && reviews.average <= 5 ? reviews.average : null;
  if (reviews.average != null && (typeof reviews.average !== 'number' || !Number.isFinite(reviews.average) || reviews.average < 0 || reviews.average > 5)) note('reviews.average');
  const count = verified && Number.isSafeInteger(reviews.count) && reviews.count > 0 ? reviews.count : null;
  if (reviews.count != null && (!Number.isSafeInteger(reviews.count) || reviews.count <= 0)) note('reviews.count');
  const testimonials = verified ? list(reviews.testimonials).filter(item => item && item.verified === true && string(item.author) && string(item.text)) : [];
  const seenPhotos = new Set();
  const gallery = list(raw.images?.gallery).flatMap(item => {
    const result = image(item);
    if (!result) { note('images.gallery'); return []; }
    if (seenPhotos.has(result.src)) { note('images.gallery (arquivo repetido)'); return []; }
    seenPhotos.add(result.src);
    return [result];
  }).slice(0, 4);
  const hero = image(raw.images?.hero);
  if (!hero) note('images.hero');
  const mapa = raw.mapa || {};
  const mapEmbed = embed(mapa.embed);
  if (string(mapa.embed) && !mapEmbed) note('mapa.embed');
  return {
    name, slogan: string(raw.slogan), city: string(raw.city), state: string(raw.state), country: string(raw.country), address: string(raw.address), siteUrl,
    description: string(raw.description).split('{name}').join(name) || `Conheça ${name}${string(raw.city) ? ` em ${string(raw.city)}` : ''}. Consulte os serviços e as informações de atendimento.`,
    whatsapp: number,
    whatsappMessage: string(raw.whatsappMessage) || 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.',
    whatsappUnavailableMessage: string(raw.whatsappUnavailableMessage) || 'WhatsApp disponível em breve',
    serviceMessage: string(raw.serviceMessage) || 'Olá! Gostaria de agendar um {service}. Quais horários estão disponíveis?',
    floating: { enabled: raw.floatingWhatsapp?.enabled !== false, desktop: raw.floatingWhatsapp?.desktop === true, label: string(raw.floatingWhatsapp?.label) || 'Consultar disponibilidade pelo WhatsApp' },
    services, hours, images: { hero, gallery },
    mapa: { link: url(mapa.link, 'mapa.link'), embed: mapEmbed },
    socialLinks: list(raw.socialLinks).flatMap(item => { const href = url(item?.url, 'socialLinks.url'); return item && string(item.label) && href ? [{ label: string(item.label), url: href }] : []; }),
    reviews: { active: verified && (average !== null || testimonials.length > 0), average, count, source: verified ? string(reviews.source) : '', url: verified ? url(reviews.url, 'reviews.url') : '', testimonials },
    demo: { enabled: raw.demo?.enabled !== false, titulo: string(raw.demo?.titulo) || 'Quer um site assim para sua barbearia?', texto: string(raw.demo?.texto), contatoLabel: string(raw.demo?.contatoLabel) || 'Vamos conversar', contatoLink: url(raw.demo?.contatoLink, 'demo.contatoLink') },
    content: raw.content && typeof raw.content === 'object' ? raw.content : {}, warnings
  };
}
module.exports = { normalize, phone, https, embed, string };
