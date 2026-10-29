'use strict';
// B vetorial: não depende de fontes instaladas para continuar legível em 16px.
function brandIcon(monogram) {
  const escaped = String(monogram).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const letter = monogram === 'B'
    ? '<path fill-rule="evenodd" d="M12 9h17c11 0 18 5 18 13 0 5-3 9-7 11 6 2 10 6 10 12 0 9-7 15-20 15H12V9Zm11 10v10h6c5 0 7-2 7-5s-2-5-7-5h-6Zm0 20v11h7c6 0 9-2 9-5s-3-6-9-6h-7Z"/>'
    : `<text x="10" y="51" font-family="Georgia,serif" font-size="48" font-weight="bold">${escaped}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="11" fill="#151714"/><g fill="#c8aa75">${letter}<path d="m54 7 1.7 4.3L60 13l-4.3 1.7L54 19l-1.7-4.3L48 13l4.3-1.7Z"/></g></svg>`;
}
module.exports = { brandIcon };
