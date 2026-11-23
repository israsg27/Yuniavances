'use strict';
const journalMenu = document.querySelector('.journal-menu');
document.addEventListener('click', event => {
  if (!journalMenu.contains(event.target) || event.target.closest('nav a')) journalMenu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && journalMenu.open) {
    journalMenu.open = false;
    journalMenu.querySelector('summary').focus();
  }
});
if (document.body.classList.contains('journal-home')) {
  function followArchiveLink() {
    const key = location.hash.slice(1);
    if (/^avance\/(febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre)$/.test(key)) location.replace(key.slice(7) + '.html');
    if (['historias', 'laboratorio', 'galeria', 'proximos'].includes(key)) location.replace('archivo.html#' + key);
  }
  followArchiveLink();
  window.addEventListener('hashchange', followArchiveLink);
}
