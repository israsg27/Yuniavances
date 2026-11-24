'use strict';

const film = document.querySelector('#kelly');
const chapters = document.querySelector('.mem-chapters');
const choices = Array.from(chapters.querySelectorAll('button'));

function markCurrentChapter() {
  const active = choices.filter(button => Number(button.dataset.seconds) <= film.currentTime).pop();
  choices.forEach(button => {
    if (button === active) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

film.addEventListener('timeupdate', markCurrentChapter);
markCurrentChapter();

const toolsMenu = document.querySelector('.mem-tools');
const toolChoices = [...toolsMenu.querySelectorAll('button')];
function showTool(selected) {
  for (const button of toolChoices) {
    const active = button === selected;
    button.setAttribute('aria-pressed', String(active));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
  }
}
for (const button of toolChoices) {
  button.addEventListener('click', () => showTool(button));
}
showTool(toolChoices[0]);
toolsMenu.hidden = false;

const zoom = document.querySelector('.mem-zoom');
for (const link of document.querySelectorAll('.mem-tool a, .mem-spreads a')) {
  link.addEventListener('click', event => {
    if (!zoom.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const preview = zoom.querySelector('img');
    preview.src = link.href;
    preview.alt = link.querySelector('img').alt;
    zoom.querySelector('h2').textContent = link.closest('figure, article').querySelector('h3').textContent;
    zoom.showModal();
  });
}
