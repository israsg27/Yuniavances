'use strict';

(() => {
  const film = document.querySelector('#gameplay video');
  const menu = document.querySelector('[data-gameplay-chapters]');
  if (!film || !menu) return;
  const source = film.querySelector('source').src;
  let sourceCheck;
  let requestId = 0;

  // A simple static preview server may ignore Range. Only that server needs a local copy.
  async function getSeekableSource() {
    const response = await fetch(source, {headers: {Range: 'bytes=0-0'}});
    if (response.status === 206) {
      await response.body?.cancel();
      return source;
    }
    if (response.status !== 200) throw new Error('Video no disponible');
    return URL.createObjectURL(await response.blob());
  }

  menu.addEventListener('click', async event => {
    const chapter = event.target.closest('[data-seconds]');
    if (!chapter || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const request = ++requestId;
    const seconds = Number(chapter.dataset.seconds);
    const ranges = film.seekable;
    const checkSource = seconds > 0 && location.protocol !== 'file:' &&
      !film.src.startsWith('blob:') && (!ranges.length || seconds > ranges.end(ranges.length - 1));
    film.focus();
    film.scrollIntoView({block:'center'});
    film.currentTime = seconds;
    // Start within the user's click, including on mobile browsers.
    film.play().catch(() => {});
    if (!checkSource) return;
    try {
      sourceCheck ??= getSeekableSource().catch(error => { sourceCheck = undefined; throw error; });
      const playable = await sourceCheck;
      if (request !== requestId || playable === source || film.src === playable) return;
      film.src = playable;
      film.currentTime = seconds;
      await film.play();
    } catch {
      if (request === requestId && film.error && chapter.href) location.assign(chapter.href);
    }
  });
  menu.hidden = false;
})();
