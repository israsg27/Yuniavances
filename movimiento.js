'use strict';

(() => {
  const demo = document.querySelector('.action-demo');
  const frame = demo.querySelector('.motion-frame');
  const range = demo.querySelector('[data-action-range]');
  const output = demo.querySelector('[data-action-count]');
  const play = demo.querySelector('[data-action-play]');
  const actions = {
    sentarse: {label:'Tomar asiento', frames:28, cols:6, duration:89/60},
    acostarse: {label:'Acostarse', frames:55, cols:8, duration:179/60}
  };
  let key = 'sentarse', index = 0, raf = 0, version = 0, started = 0;
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
    play.setAttribute('aria-pressed','false');
    play.textContent = '▶ Reproducir';
  }
  function draw(value) {
    const {label, frames, cols} = actions[key];
    index = value;
    const rows = Math.ceil(frames / cols);
    frame.style.backgroundPosition = (value % cols / (cols - 1) * 100) + '% ' + (Math.floor(value / cols) / (rows - 1) * 100) + '%';
    range.value = value + 1;
    output.textContent = (value + 1) + ' / ' + frames;
    range.setAttribute('aria-valuetext', 'Fotograma ' + (value + 1) + ' de ' + frames);
    frame.setAttribute('aria-label', label + ', fotograma ' + (value + 1));
  }
  async function loadAction(id) {
    pause();
    const turn = ++version;
    key = id;
    const {frames, cols} = actions[id];
    play.disabled = range.disabled = true;
    for (const b of demo.querySelectorAll('[data-action]')) b.setAttribute('aria-pressed', String(b.dataset.action === id));
    const base = 'recap-media/colecciones/movimiento/' + id;
    frame.style.backgroundImage = 'url("' + base + '-inicio.webp")';
    frame.style.backgroundSize = 'cover';
    range.max = frames;
    draw(0);
    const image = new Image();
    image.src = base + '.webp';
    try { await image.decode(); } catch { if (turn === version) output.textContent = 'No se pudo cargar'; return; }
    if (turn !== version) return;
    frame.style.backgroundImage = 'url("' + image.src + '")';
    frame.style.backgroundSize = (cols * 100) + '% ' + (Math.ceil(frames / cols) * 100) + '%';
    play.disabled = range.disabled = false;
  }
  function tick(now) {
    const {frames, duration} = actions[key];
    const next = Math.min(frames - 1, Math.floor((now - started) / (1000 * duration) * (frames - 1)));
    if (next !== index) draw(next);
    if (next === frames - 1) { pause(); return; }
    raf = requestAnimationFrame(tick);
  }
  play.addEventListener('click', () => {
    if (raf) { pause(); return; }
    const {frames, duration} = actions[key];
    if (index === frames - 1) draw(0);
    started = performance.now() - index / (frames - 1) * duration * 1000;
    play.textContent = 'Ⅱ Pausar';
    play.setAttribute('aria-pressed','true');
    raf = requestAnimationFrame(tick);
  });
  range.addEventListener('input', () => { pause(); draw(Number(range.value) - 1); });
  demo.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => loadAction(b.dataset.action)));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  document.addEventListener('visor:open', pause);
  window.addEventListener('pagehide', pause);
  if ('IntersectionObserver' in window) {
    const load = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { load.disconnect(); if (!version) loadAction(key); } }, {rootMargin:'500px'});
    load.observe(demo);
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(demo);
  } else loadAction(key);
})();
