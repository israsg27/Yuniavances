'use strict';

const care = document.querySelector('.room-care');
care.replaceChildren(guiaPetcare.content.cloneNode(true));
care.querySelector('#comida').append(document.getElementById('comida-en-juego').content.cloneNode(true));
for (const label of care.querySelectorAll('.care-chapter > .edition-label, .care-inventory-heading > .edition-label')) {
  label.prepend('Diseño de PetCare · ');
}
const activities = [...care.querySelectorAll('section[id]')];
const links = [...care.querySelectorAll('.care-nav a')];
function showActivity() {
  const activity = activities.find(section => '#' + section.id === location.hash) || activities[0];
  for (const section of activities) section.hidden = section !== activity;
  for (const link of links) {
    if (link.hash === '#' + activity.id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
  if (location.hash === '#' + activity.id) care.scrollIntoView({block:'start'});
}
window.addEventListener('hashchange', showActivity);
showActivity();
