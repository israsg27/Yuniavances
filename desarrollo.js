'use strict';

// Keep links saved before the room received individual mechanic pages.
function openSavedMechanic() {
  const key = location.hash.slice(1);
  if (!key || key === 'cuarto') return;
  if (key === 'inventario' || key === 'materiales') {
    document.getElementById('info-materiales').showPopover({source: document.querySelector('.room-bag')});
    return;
  }
  if (['bano', 'comida', 'juego'].includes(key)) {
    location.replace('mecanica-petcare.html#' + key);
    return;
  }
  const link = [...document.querySelectorAll('.room-controls a, .room-menu-links a')].find(
    item => item.getAttribute('href') === 'mecanica-' + key + '.html'
  );
  if (link) location.replace(link.href);
}
const roomStage = document.querySelector('.room-stage');
const roomMotion = matchMedia('(prefers-reduced-motion: no-preference)');
// Touch browsers may defer :active while deciding whether a finger is scrolling.
// Show the press immediately and leave scrolling and activation to the browser.
let touchPress;
function endTouchPress(event) {
  if (!touchPress || event.pointerId !== touchPress.id) return;
  touchPress.control.removeAttribute('data-pressed');
  touchPress = null;
}
const roomPage = roomStage.closest('main');
roomPage.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || !event.isPrimary) return;
  const control = event.target.closest(':is(.room-stage,.room-info) :is(button,a,summary)');
  if (!control) return;
  touchPress = {control, id:event.pointerId, x:event.clientX, y:event.clientY};
  control.setAttribute('data-pressed', '');
}, {passive:true});
roomPage.addEventListener('pointermove', event => {
  if (touchPress?.id !== event.pointerId) return;
  if (Math.abs(event.clientX - touchPress.x) > 8 || Math.abs(event.clientY - touchPress.y) > 8) endTouchPress(event);
}, {passive:true});
roomPage.addEventListener('pointerup', endTouchPress, {passive:true});
roomPage.addEventListener('pointercancel', endTouchPress, {passive:true});
const stockPanel = document.getElementById('info-materiales');
const statusPanel = roomStage.querySelector('.pet-status-panel');
const bagButtons = roomStage.querySelectorAll('[popovertarget="info-materiales"]');
stockPanel.addEventListener('beforetoggle', event => {
  const opening = event.newState === 'open';
  const trigger = event.source || document.activeElement;
  for (const bag of bagButtons) bag.setAttribute('aria-expanded', String(opening && bag === trigger));
  if (opening) {
    statusPanel.open = false;
    stockPanel.classList.toggle('from-side', Boolean(trigger?.closest('.room-actions-right')));
  }
});
statusPanel.querySelector('summary').addEventListener('click', () => {
  if (stockPanel.matches(':popover-open')) stockPanel.hidePopover();
});
roomPage.addEventListener('keydown', event => {
  if (event.key === 'Escape' && statusPanel.open && !document.querySelector(':popover-open')) {
    statusPanel.open = false;
    statusPanel.querySelector('summary').focus();
  }
});
openSavedMechanic();
window.addEventListener('hashchange', openSavedMechanic);

const eyeButton = document.getElementById('room-eye');
eyeButton.addEventListener('click', () => {
  const hidden = roomStage.classList.toggle('hud-hidden');
  for (const group of roomStage.querySelectorAll('.room-switch,.room-wallet,.room-controls,.pet-status,.room-back,#room-zoom')) group.inert = hidden;
  eyeButton.setAttribute('aria-pressed', String(hidden));
  eyeButton.title = hidden ? 'Mostrar controles' : 'Ocultar controles';
  eyeButton.setAttribute('aria-label', eyeButton.title);
});
const zoomButton = document.getElementById('room-zoom');
zoomButton.addEventListener('click', () => {
  const enlarged = roomStage.classList.toggle('zoomed');
  zoomButton.setAttribute('aria-pressed', String(enlarged));
});

const picture = document.getElementById('room-picture');
const roomName = document.getElementById('room-name');
const rooms = [
  { name: roomName.textContent, src: picture.getAttribute('src'), srcset: picture.srcset, alt: picture.alt },
  { name: 'Big room', src: 'recap-media/cuarto-big-room.webp', srcset: 'recap-media/cuarto-big-room-800.webp 800w, recap-media/cuarto-big-room.webp 1600w', alt: 'Habitación Big room del prototipo con dos camas y sillones.' }
];
let currentRoom = 0;
let sceneChange;
for (const button of document.querySelectorAll('.room-switch [data-step]')) {
  button.addEventListener('click', () => {
    currentRoom = (currentRoom + Number(button.dataset.step) + rooms.length) % rooms.length;
    const room = rooms[currentRoom];
    roomName.textContent = room.name;
    picture.srcset = room.srcset;
    picture.src = room.src;
    picture.alt = room.alt;
    sceneChange?.cancel();
    if (roomMotion.matches) {
      const direction = Number(button.dataset.step);
      picture.decode().then(() => {
        if (rooms[currentRoom] !== room || !roomMotion.matches) return;
        sceneChange?.cancel();
        sceneChange = picture.animate([{opacity:.78,translate:(direction*4)+'px 0'},{opacity:1,translate:'0 0'}],
          {duration:185,easing:'cubic-bezier(.2,.75,.3,1)'});
      }).catch(() => {});
    }
  });
}

const pets = document.querySelectorAll('.room-pet-picker button');
const portrait = statusPanel.querySelector('.pet-portrait img');
const assignment = document.getElementById('habitacion-asignada');
const assignedRooms = new Map();
let selectedPet = 'Chai';
assignment.addEventListener('change', () => assignedRooms.set(selectedPet, assignment.value));
for (const button of pets) {
  button.addEventListener('click', () => {
    for (const option of pets) option.setAttribute('aria-pressed', String(option === button));
    portrait.src = button.querySelector('img').src;
    portrait.classList.toggle('pet-choice', button !== pets[0]);
    selectedPet = button.dataset.pet;
    const label = 'Indicadores de ' + selectedPet;
    const toggle = statusPanel.querySelector('summary');
    toggle.title = label;
    toggle.setAttribute('aria-label', label);
    statusPanel.querySelector('.pet-meters').setAttribute('aria-label', label);
    document.getElementById('etiqueta-habitacion').textContent = 'Habitación de ' + selectedPet;
    assignment.value = assignedRooms.get(selectedPet) || rooms[0].name;
  });
}
