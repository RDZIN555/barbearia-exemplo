'use strict';
document.documentElement.classList.add('js');
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
toggle.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    nav.classList.add('is-open');
    nav.querySelector('a')?.focus();
  }
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.addEventListener('focusin', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
const floating = document.querySelector('.whatsapp-float');
if (floating) {
  const visible = new Set();
  let pending = false;
  const intersects = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  function updateFloating() {
    pending = false;
    floating.hidden = visible.size > 0;
    if (floating.hidden) return;
    const box = floating.getBoundingClientRect();
    if (!box.width) return;
    const important = document.querySelectorAll('h1,h2,h3,p,dt,dd,figcaption,.button,.text-link');
    let covered = false;
    for (const node of important) {
      if (!intersects(box,node.getBoundingClientRect())) continue;
      if (node.matches('a,button')) { covered = true; break; }
      const range = document.createRange();
      range.selectNodeContents(node);
      if ([...range.getClientRects()].some(rect => intersects(box,rect))) { covered = true; break; }
    }
    floating.classList.toggle('is-covered',covered);
  }
  function scheduleFloating() {
    if (!pending) { pending = true; requestAnimationFrame(updateFloating); }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
      }
      scheduleFloating();
    }, { rootMargin:'0px 0px 90px 0px' });
    for (const target of document.querySelectorAll('#agendamento, footer')) observer.observe(target);
  }
  // Mantém o atalho fora do caminho de texto e controles, inclusive durante a rolagem.
  window.addEventListener('scroll',scheduleFloating,{passive:true});
  window.addEventListener('resize',scheduleFloating);
  scheduleFloating();
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Aviso não modal: nenhum telefone fictício e nenhuma janela externa sem número.
const notice = document.querySelector('#whatsapp-notice');
if (notice) {
  const message = notice.querySelector('[role="status"]');
  let activeTrigger = null;
  function closeNotice(restoreFocus = false) {
    notice.hidden = true;
    message.textContent = '';
    activeTrigger?.setAttribute('aria-expanded','false');
    if (restoreFocus) activeTrigger?.focus();
    activeTrigger = null;
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-whatsapp-unavailable]');
    if (trigger) {
      if (!notice.hidden && activeTrigger === trigger) { closeNotice(); return; }
      closeNotice();
      activeTrigger = trigger;
      notice.hidden = false;
      message.textContent = notice.dataset.message;
      trigger.setAttribute('aria-expanded','true');
    } else if (event.target.closest('.notice-close')) closeNotice(true);
    else if (!notice.contains(event.target)) closeNotice();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !notice.hidden) { event.preventDefault(); closeNotice(true); }
  });
  document.addEventListener('focusin', event => {
    if (!notice.hidden && event.target !== activeTrigger && !notice.contains(event.target)) closeNotice();
  });
}
