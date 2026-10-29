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
const whatsapp = document.querySelector('.whatsapp');
// E.164 permite no máximo 15 dígitos. A existência do número deve ser confirmada pelo proprietário.
if (typeof config.whatsapp === 'string' && /^[1-9]\d{9,14}$/.test(config.whatsapp)) {
  const link = document.createElement('a');
  link.className = whatsapp.className;
  link.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.whatsappMessage || 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.')}`;
  link.textContent = 'Consultar pelo WhatsApp ↗';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  whatsapp.replaceWith(link);
  document.querySelector('#whatsapp-status').textContent = 'Abre o WhatsApp em uma nova aba. Atendimento sujeito à disponibilidade.';
}
for (const element of document.querySelectorAll('[data-price]')) {
  const price = config.prices?.[element.dataset.price];
  if (typeof price === 'number' && Number.isFinite(price) && price >= 0) element.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price);
}
document.querySelector('#year').textContent = new Date().getFullYear();
