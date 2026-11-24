'use strict';

const screens = Array.from(document.querySelectorAll('.build-screen'));
const choices = document.querySelectorAll('.build-choices a');
function showRoomScreen(hash) {
  const selected = screens.find(screen => '#' + screen.id === hash) || screens[0];
  for (const screen of screens) screen.hidden = screen !== selected;
  for (const choice of choices) {
    if (choice.hash === '#' + selected.id) choice.setAttribute('aria-current', 'true');
    else choice.removeAttribute('aria-current');
  }
}
for (const choice of choices) {
  choice.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showRoomScreen(choice.hash);
    history.replaceState(null, '', choice.hash);
  });
}
showRoomScreen(location.hash);
window.addEventListener('hashchange', () => showRoomScreen(location.hash));
