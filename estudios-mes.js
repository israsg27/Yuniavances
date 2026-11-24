'use strict';

for (const figure of document.querySelectorAll('.study-figure')) {
  const link = figure.querySelector('a');
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const ids = figure.dataset.studies.split(' ');
    openViewer(figure.querySelector('select')?.value || ids[0], link, ids);
  });
}

for (const select of document.querySelectorAll('.month-study select')) {
  select.addEventListener('change', () => {
    const piece = pieceById.get(select.value);
    const figure = select.closest('figure');
    const image = figure.querySelector('img');
    image.src = piece.src;
    image.alt = piece.title;
    figure.querySelector('[data-study-caption]').textContent = piece.caption;
    figure.querySelector('a').href = piece.src;
    figure.querySelector('a').setAttribute('aria-label', 'Ampliar ' + piece.title);
  });
}

function openLinkedStudy() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.matches('details.month-study')) target.open = true;
}

window.addEventListener('hashchange', openLinkedStudy);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    const study = document.getElementById(link.hash.slice(1));
    if (study?.matches('details.month-study')) study.open = true;
  }
});
openLinkedStudy();
