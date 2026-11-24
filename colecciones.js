'use strict';

(() => {
  const section = document.querySelector('.collection');
  if (!section) return;
  const get = selector => section.querySelector(selector);
  const requested = new URLSearchParams(location.search).get('coleccion');
  const linked = Array.from(section.querySelectorAll('[data-family-link]')).find(a => a.dataset.familyLink === requested);
  if (linked) {
    location.replace(linked.href);
    return;
  }
  const families = section.dataset.families.split(' ');
  const grid = get('[data-thumbs]');
  const portrait = get('[data-portrait]');
  const cycle = get('[data-cycle]');
  const zoom = get('.collection-zoom');
  const zoomButton = get('[data-enlarge]');
  const paper = get('.collection-paper');
  const controls = get('.collection-controls');
  const controlsParent = controls.parentNode;
  const browse = document.createElement('button');
  browse.type = 'button';
  browse.className = 'collection-browse';
  grid.id = 'piezas-de-la-coleccion';
  browse.setAttribute('aria-controls', grid.id);
  controls.append(browse);
  const sideCards = [-1, 1].map(direction => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'collection-nearby';
    card.dataset.dir = direction;
    const image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    const label = document.createElement('span');
    card.append(image, label);
    paper.append(card);
    return {card, image, label, direction};
  });
  let zoomFromGrid = false;
  const headToggles = section.querySelectorAll('[data-head-toggle]');
  let headOnly = false;
  const coverIndex = Number(section.dataset.coverIndex);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let family, index = 0, timer, effect;
  const positions = new Map();
  function setBrowse(open) {
    section.classList.toggle('is-browsing', open);
    browse.setAttribute('aria-expanded', String(open));
    browse.textContent = open ? 'Ocultar miniaturas' : 'Ver todas';
  }
  browse.addEventListener('click', () => {
    pause();
    const opening = !section.classList.contains('is-browsing');
    setBrowse(opening);
    if (opening) grid.children[index].focus({preventScroll:true});
  });

  function pause() {
    clearInterval(timer);
    timer = undefined;
    get('[data-name]').setAttribute('aria-live', 'polite');
    cycle.textContent = '▶ Reproducir';
    cycle.setAttribute('aria-pressed', 'false');
  }

  function photoFolder() {
    return 'recap-media/colecciones/' + family + (family === 'cabeza' && headOnly ? '/sola/' : '/');
  }

  function syncView() {
    grid.style.setProperty('--sheet', 'url("' + photoFolder() + 'miniaturas.webp")');
    for (const toggle of headToggles) {
      toggle.hidden = family !== 'cabeza';
      toggle.setAttribute('aria-pressed', String(headOnly));
    }
  }

  function choose(next, animate = true) {
    const items = colecciones[family].names;
    index = (next % items.length + items.length) % items.length;
    positions.set(family, index);
    const name = items[index];
    const src = photoFolder() + String(index + 1).padStart(2, '0') + '.webp';
    const cover = family === 'cabeza' && index === coverIndex && !headOnly;
    if (section.dataset.cover) section.dataset.showCover = String(cover);
    // The card layers the Unity figure over the scenery. The enlarged photograph includes both.
    portrait.src = cover ? section.dataset.cover : family === 'cabeza' ? src.replace('/cabeza/', '/cabeza/figura/') : src;
    portrait.alt = cover ? 'Husky de la ficha Redonda' : name + ' · ' + (family === 'cabeza' && headOnly ? 'Solo cabeza' : colecciones[family].tab);
    const title = cover ? 'Redonda' : name;
    if (section.classList.contains('collection-deck')) {
      get('.collection-plate').dataset.tint = index % 4;
      for (const {card, image, label, direction} of sideCards) {
        const neighbour = (index + direction + items.length) % items.length;
        card.dataset.tint = neighbour % 4;
        card.setAttribute('aria-label', 'Ver ' + items[neighbour]);
        image.src = photoFolder() + String(neighbour + 1).padStart(2, '0') + '.webp';
        label.textContent = items[neighbour];
      }
    }
    zoomButton.setAttribute('aria-label', 'Ampliar ' + title);
    get('[data-name]').textContent = title;
    const group = colecciones[family];
    get('[data-credit]').textContent = group.archiveIndices?.includes(index + 1) ? group.archiveCredit : group.credit;
    if (cover) get('[data-credit]').textContent = 'Retrato de Figma · variantes de Unity';
    const count = String(index + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    get('[data-count]').textContent = count;
    Array.from(grid.children).forEach((b, i) => {
      b.setAttribute('aria-pressed', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    if (zoom.open) {
      zoom.querySelector('img').src = cover ? section.dataset.cover : src;
      zoom.querySelector('img').alt = portrait.alt;
      zoom.querySelector('[data-zoom-name]').textContent = title;
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
    section.dataset.activeFamily = id;
    const group = colecciones[id];
    const deck = id !== 'cabeza' && id !== 'peces';
    section.classList.toggle('collection-deck', deck);
    for (const {card} of sideCards) card.hidden = !deck;
    browse.hidden = !deck;
    (deck ? paper : controlsParent).append(controls);
    setBrowse(false);
    const rows = Math.ceil(group.names.length / 5);
    const tiles = group.names.map((name, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.title = name;
      tile.setAttribute('aria-label', name);
      tile.dataset.index = i;
      tile.style.backgroundPosition = (i % 5 * 25) + '% ' + (rows === 1 ? 0 : Math.floor(i / 5) * 100 / (rows - 1)) + '%';
      if (id === 'peces') tile.style.setProperty('--tile-position', tile.style.backgroundPosition);
      return tile;
    });
    syncView();
    grid.style.setProperty('--rows', rows);
    grid.replaceChildren(...tiles);
    get('[data-title]').textContent = group.title;
    get('[data-copy]').textContent = group.copy;
    const proof = get('[data-evidence]');
    proof.dataset.piece = group.proof;
    proof.textContent = 'Ver lámina · ' + pieceById.get(group.proof).title + ' ⤢';
    section.querySelectorAll('[data-family]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.family === id)));
    const initialIndex = id === 'cabeza' && section.dataset.cover ? coverIndex : (group.initialIndex ?? 0);
    choose(positions.get(id) ?? initialIndex, remember);
    if (remember) {
      const url = new URL(location.href);
      url.searchParams.set('coleccion', id);
      url.hash = section.id;
      try { history.replaceState(history.state, '', url); } catch {}
    }
  }

  section.addEventListener('click', event => {
    const b = event.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-head-toggle')) {
      pause();
      headOnly = !headOnly;
      syncView();
      choose(index, false);
      return;
    }
    if (b.dataset.family) selectFamily(b.dataset.family, true);
    if (b.dataset.index !== undefined) {
      pause();
      choose(Number(b.dataset.index));
      if (family === 'peces' && matchMedia('(max-width: 720px)').matches) {
        zoomFromGrid = true;
        zoomButton.click();
      }
    }
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
  get('[data-zoom-shortcut]')?.addEventListener('click', () => zoomButton.click());
  zoom.querySelector('[data-close]').addEventListener('click', () => zoom.close());
  zoom.addEventListener('click', event => { if (event.target === zoom) zoom.close(); });
  zoom.addEventListener('close', () => {
    const trigger = zoomFromGrid ? grid.children[index] : zoomButton;
    zoomFromGrid = false;
    trigger.focus({preventScroll:true});
  });
  document.addEventListener('visor:open', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  reduced.addEventListener('change', () => { pause(); effect?.cancel(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(section);
  }
  selectFamily(families.includes(requested) ? requested : families[0]);
  get('.collection-controls').hidden = false;
  zoomButton.disabled = false;
})();
