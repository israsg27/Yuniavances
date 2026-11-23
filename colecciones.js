'use strict';

(() => {
  const section = document.querySelector('.collection');
  if (!section) return;
  const get = selector => section.querySelector(selector);
  const families = section.dataset.families.split(' ');
  const grid = get('[data-thumbs]');
  const portrait = get('[data-portrait]');
  const cycle = get('[data-cycle]');
  const zoom = get('.collection-zoom');
  const zoomButton = get('[data-enlarge]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let family, index = 0, timer, effect;
  const positions = new Map();

  function pause() {
    clearInterval(timer);
    timer = undefined;
    get('[data-name]').setAttribute('aria-live', 'polite');
    cycle.textContent = '▶ Reproducir';
    cycle.setAttribute('aria-pressed', 'false');
  }

  function choose(next, animate = true) {
    const items = colecciones[family].names;
    index = (next % items.length + items.length) % items.length;
    positions.set(family, index);
    const name = items[index];
    const src = 'recap-media/colecciones/' + family + '/' + String(index + 1).padStart(2, '0') + '.webp';
    portrait.src = src;
    portrait.alt = name + ' · ' + colecciones[family].tab;
    zoomButton.setAttribute('aria-label', 'Ampliar ' + name);
    get('[data-name]').textContent = name;
    const count = String(index + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    get('[data-count]').textContent = count;
    Array.from(grid.children).forEach((b, i) => {
      b.setAttribute('aria-pressed', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    if (zoom.open) {
      zoom.querySelector('img').src = src;
      zoom.querySelector('img').alt = portrait.alt;
      zoom.querySelector('[data-zoom-name]').textContent = name;
      zoom.querySelector('[data-zoom-count]').textContent = count;
    }
    effect?.cancel();
    if (animate && !reduced.matches) {
      effect = portrait.animate([{opacity:.78},{opacity:1}], {duration:180,easing:'ease-out'});
    }
  }

  function selectFamily(id, remember = false) {
    pause();
    family = id;
    const group = colecciones[id];
    const rows = Math.ceil(group.names.length / 5);
    const tiles = group.names.map((name, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.title = name;
      tile.setAttribute('aria-label', name);
      tile.dataset.index = i;
      tile.style.backgroundPosition = (i % 5 * 25) + '% ' + (rows === 1 ? 0 : Math.floor(i / 5) * 100 / (rows - 1)) + '%';
      return tile;
    });
    grid.style.setProperty('--sheet', 'url("recap-media/colecciones/' + id + '/miniaturas.webp")');
    grid.style.setProperty('--rows', rows);
    grid.replaceChildren(...tiles);
    get('[data-title]').textContent = group.title;
    get('[data-copy]').textContent = group.copy;
    get('[data-credit]').textContent = group.credit;
    const proof = get('[data-evidence]');
    proof.dataset.piece = group.proof;
    proof.textContent = 'Ver lámina · ' + pieceById.get(group.proof).title + ' ⤢';
    section.querySelectorAll('[data-family]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.family === id)));
    choose(positions.get(id) || 0, remember);
    if (remember) {
      const url = new URL(location.href);
      url.searchParams.set('coleccion', id);
      url.hash = 'componentes';
      try { history.replaceState(history.state, '', url); } catch {}
    }
  }

  section.addEventListener('click', event => {
    const b = event.target.closest('button');
    if (!b) return;
    if (b.dataset.family) selectFamily(b.dataset.family, true);
    if (b.dataset.index !== undefined) { pause(); choose(Number(b.dataset.index)); }
    if (b.dataset.dir) { pause(); choose(index + Number(b.dataset.dir)); }
    if (b === cycle) {
      if (timer !== undefined) { pause(); return; }
      cycle.textContent = 'Ⅱ Pausar';
      cycle.setAttribute('aria-pressed','true');
      get('[data-name]').setAttribute('aria-live', 'off');
      choose(index + 1);
      timer = setInterval(() => choose(index + 1), 2100);
    }
  });
  function gridKey(event) {
    let step = {ArrowLeft:-1,ArrowRight:1,Home:-index,End:colecciones[family].names.length-1-index}[event.key];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      step = event.key === 'ArrowDown' ? columns : -columns;
    }
    if (step === undefined) return;
    event.preventDefault(); pause(); choose(index + step);
    if (!zoom.open) grid.children[index].focus({preventScroll:true});
  }
  grid.addEventListener('keydown', gridKey);
  zoom.addEventListener('keydown', gridKey);
  zoomButton.addEventListener('click', () => {
    pause(); zoom.showModal(); choose(index, false);
    zoom.querySelector('[data-close]').focus({preventScroll:true});
  });
  zoom.querySelector('[data-close]').addEventListener('click', () => zoom.close());
  zoom.addEventListener('click', event => { if (event.target === zoom) zoom.close(); });
  zoom.addEventListener('close', () => zoomButton.focus({preventScroll:true}));
  document.addEventListener('visor:open', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  reduced.addEventListener('change', () => { pause(); effect?.cancel(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(section);
  }
  const requested = new URLSearchParams(location.search).get('coleccion');
  selectFamily(families.includes(requested) ? requested : families[0]);
  get('.collection-controls').hidden = false;
  zoomButton.disabled = false;
})();
