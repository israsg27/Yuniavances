'use strict';

const month = monthById.get(document.body.dataset.month);
availablePieces = () => recapPieces.filter(piece => piece.month === month.slug && !piece.dossier).map(piece => piece.id);

const demo = document.querySelector('[data-demo]');
const mode = demo.dataset.demo;
const play = demo.querySelector('[data-play]');
const playLabel = play.querySelector('[data-play-label]');
const startingLabel = playLabel.textContent;
const glyph = play.querySelector('[data-glyph]');
const range = demo.querySelector('[data-range]');
const output = demo.querySelector('[data-range-value]');
const frames = Array.from(demo.querySelectorAll('.film-frame'));
const tabs = Array.from(demo.querySelectorAll('[data-step]'));
const atlasWindows = Array.from(demo.querySelectorAll('[data-atlas]'));
let position = range ? Number(range.value) : 0;
let timer = null;
let animation = null;
let playing = false;

function display(value) {
  position = value;
  if (range) range.value = value;
  if (output) output.textContent = value + (['cielo', 'colas'].includes(mode) ? '%' : '');
  if (mode === 'secuencia') {
    frames.forEach((frame, index) => {
      frame.classList.toggle('is-current', index === value);
      frame.setAttribute('aria-hidden', String(index !== value));
      tabs[index].setAttribute('aria-pressed', String(index === value));
    });
  } else if (mode === 'atlas') {
    const photo = String(value).padStart(2, '0') + '.webp';
    for (const frame of atlasWindows) {
      frame.style.backgroundImage = 'url("recap-media/colecciones/ojos' + frame.dataset.atlas + '/' + photo + '")';
      frame.setAttribute('aria-label', 'Atlas ' + frame.dataset.atlas + ', expresión ' + value);
    }
  } else if (mode === 'cabezas') {
    const frame = demo.querySelector('[data-head]');
    const index = value - 1;
    frame.style.backgroundPosition = (index % 5 * 25) + '% ' + (Math.floor(index / 5) * 100) + '%';
    frame.setAttribute('aria-label', 'Vista ' + value + ' de diez');
  } else if (mode === 'colas') {
    demo.querySelector('[data-tails]').style.backgroundPosition = value + '% center';
  } else if (mode === 'comparacion') {
    demo.querySelector('[data-room]').style.setProperty('--wipe', value + '%');
    range.setAttribute('aria-valuetext', value + ' por ciento de acabado neutro');
  } else if (mode === 'cielo') {
    const panorama = demo.querySelector('[data-pano]');
    panorama.style.setProperty('--far', (value * 1.3) + 'px');
    panorama.style.setProperty('--near', (value * 3.8) + 'px');
  }
}

function setPlayback(active) {
  playing = active;
  play.setAttribute('aria-pressed', String(active));
  playLabel.textContent = active ? 'Pausar' : startingLabel;
  glyph.textContent = active ? 'Ⅱ' : '▶';
  if (mode === 'atlas') demo.classList.toggle('is-blinking', active);
}

function stopPlayback() {
  clearInterval(timer);
  cancelAnimationFrame(animation);
  timer = animation = null;
  if (playing) setPlayback(false);
}

function playPanorama() {
  let previous = null;
  let exact = position;
  let direction = exact >= 100 ? -1 : 1;
  function tick(now) {
    if (!playing) return;
    if (previous !== null) exact += direction * Math.min(now - previous, 90) / 72;
    previous = now;
    if (exact >= 100 || exact <= 0) {
      exact = Math.max(0, Math.min(100, exact));
      direction *= -1;
    }
    display(Math.round(exact));
    animation = requestAnimationFrame(tick);
  }
  animation = requestAnimationFrame(tick);
}

play.addEventListener('click', () => {
  if (playing) { stopPlayback(); return; }
  setPlayback(true);
  if (mode === 'atlas') return;
  if (['cielo', 'comparacion', 'colas'].includes(mode)) { playPanorama(); return; }
  const first = mode === 'cabezas' ? 1 : 0;
  const last = frames.length ? frames.length - 1 : 10;
  if (position === last) display(first);
  timer = setInterval(() => {
    display(position + 1);
    if (position === last) stopPlayback();
  }, mode === 'cabezas' ? 850 : 2400);
});

for (const tab of tabs) {
  tab.addEventListener('click', () => { stopPlayback(); display(Number(tab.dataset.step)); });
}
range?.addEventListener('input', () => {
  if (mode !== 'atlas') stopPlayback();
  display(Number(range.value));
});
document.addEventListener('visor:open', stopPlayback);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlayback(); });
window.addEventListener('pagehide', stopPlayback);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) stopPlayback();
  });
  observer.observe(demo);
}
display(position);
