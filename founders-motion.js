(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const cards = document.querySelectorAll('.art-deck a, .directory-list a');

  function addCardLight(card) {
    let frame = 0;
    let position;
    const light = document.createElement('span');
    light.className = 'card-light';
    light.setAttribute('aria-hidden', 'true');
    card.append(light);
    card.classList.add('card-reactive');

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      card.removeAttribute('data-lit');
    }
    card.addEventListener('pointermove', event => {
      if (!motion.matches || !finePointer.matches || event.pointerType === 'touch') return;
      position = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = card.getBoundingClientRect();
        const x = (position.x - bounds.left) / bounds.width;
        const y = (position.y - bounds.top) / bounds.height;
        card.style.setProperty('--spot-x', x * 100 + '%');
        card.style.setProperty('--spot-y', y * 100 + '%');
        card.style.setProperty('--rx', (0.5 - y) * 6 + 'deg');
        card.style.setProperty('--ry', (x - 0.5) * 6 + 'deg');
        card.setAttribute('data-lit', '');
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    motion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);
  }
  cards.forEach(addCardLight);

  const filmDialog = document.getElementById('avance-trimestral');
  if (filmDialog && typeof filmDialog.showModal === 'function') {
    const trigger = document.querySelector('.gate-play');
    const film = filmDialog.querySelector('video');
    trigger.setAttribute('aria-haspopup','dialog');
    trigger.setAttribute('aria-controls',filmDialog.id);
    trigger.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      filmDialog.showModal();
      film.src = trigger.href;
      film.play().catch(() => {});
    });
    filmDialog.addEventListener('close', () => {
      film.pause();
      film.removeAttribute('src');
      film.load();
    });
  }

  const scenePicker = document.querySelector('.gate-scenes');
  if (scenePicker) {
    let photo = document.querySelector('.gate-scene');
    const initialScene = photo.getAttribute('src');
    const initialSources = photo.srcset;
    const choices = [...scenePicker.querySelectorAll('[data-scene]')];
    let selected = choices.findIndex(choice => choice.dataset.scene === initialScene);
    let displayed = selected;
    let request = 0;
    let dissolve;

    function select(index) {
      scenePicker.dataset.direction = index < selected ? 'back' : 'forward';
      scenePicker.style.setProperty('--scene-index', index);
      choices[selected].setAttribute('aria-pressed', 'false');
      choices[index].setAttribute('aria-pressed', 'true');
      selected = index;
    }

    scenePicker.hidden = false;
    scenePicker.addEventListener('click', async event => {
      const button = event.target.closest('[data-scene]');
      const index = choices.indexOf(button);
      if (index < 0 || index === selected) return;
      const currentRequest = ++request;
      select(index);
      if (index === displayed) return;

      const src = button.dataset.scene;
      const next = new Image();
      next.alt = '';
      next.className = 'gate-scene';
      next.sizes = photo.sizes;
      next.srcset = src === initialScene ? initialSources : '';
      next.src = src;
      try { await next.decode(); }
      catch {
        if (currentRequest === request) select(displayed);
        return;
      }
      if (currentRequest !== request) return;
      dissolve?.finish();
      const outgoing = photo;
      outgoing.before(next);
      photo = next;
      displayed = index;
      if (motion.matches && outgoing.animate) {
        dissolve = outgoing.animate([{opacity:1}, {opacity:0}], {
          duration:380, easing:'cubic-bezier(.3,0,.2,1)', fill:'forwards'
        });
        const activeDissolve = dissolve;
        dissolve.finished.then(() => {
          outgoing.remove();
          if (dissolve === activeDissolve) dissolve = undefined;
        });
      } else {
        outgoing.remove();
      }
    });
  }

  const showcase = document.querySelector('.edition-showcase');
  if (showcase) {
    const prints = [...showcase.querySelectorAll('.edition-print')];
    const controls = showcase.querySelector('.print-switch');
    const buttons = [...controls.querySelectorAll('button')];
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      prints.forEach((print, position) => { print.hidden = position !== index; });
      buttons.forEach((item, position) => item.setAttribute('aria-pressed', String(position === index)));
    }));
    controls.hidden = false;
  }

  const chapterIndex = document.querySelector('.chapter-index');
  if (chapterIndex) {
    const links = [...chapterIndex.querySelectorAll('a')];
    const sections = links.map(link => document.getElementById(link.hash.slice(1)));
    let pending = false;
    function markChapter() {
      pending = false;
      let current = -1;
      const offset = Math.max(chapterIndex.offsetHeight, parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0) + 3;
      sections.forEach((section, index) => {
        const visibleSection = section.closest('details:not([open])') || section;
        if (visibleSection.getBoundingClientRect().top <= offset) current = index;
      });
      links.forEach((link, index) => {
        if (index === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function scheduleChapter() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(markChapter);
    }
    window.addEventListener('scroll', scheduleChapter, {passive:true});
    window.addEventListener('resize', scheduleChapter);
    window.addEventListener('pageshow', scheduleChapter);
    markChapter();
  }

  if (!motion.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    let delay = 0;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      const animation = target.animate([
        { opacity: .6, translate: '0 12px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 380, delay, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
      delay = Math.min(delay + 40, 120);
    }
  }, { threshold: .08 });
  document.querySelectorAll(
    '.gate-heading, .gate-choices, .brief-intro, .studio-intro, .report-figures, ' +
    '.art-deck a, .directory-list a, .month-tile, .issue-cover, .field-note, ' +
    '.section-intro, .system-story, .road-items article'
  ).forEach(target => observer.observe(target));
  motion.addEventListener('change', () => {
    if (motion.matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();
