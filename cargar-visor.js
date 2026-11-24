'use strict';

(() => {
  const studio = document.getElementById('estudio');
  function loadViewer() {
    const status = document.getElementById('status');
    status.textContent = 'Cargando el modelo 3D…';
    const sources = ['recap-media/creador/three.min.js', 'recap-media/creador/piezas.js',
      'recap-media/creador/poses-base.js', 'visor-yunipet.js?v=3', 'creador.js?v=3'];
    for (const src of sources) {
      const script = document.createElement('script');
      script.async = false;
      script.src = src;
      script.onerror = () => { status.textContent = 'No se pudo cargar el modelo. Recarga la página para volver a intentarlo.'; };
      document.head.append(script);
    }
  }
  if (!('IntersectionObserver' in window) || location.hash === '#componentes') {
    loadViewer();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    loadViewer();
  }, {rootMargin: '120px'});
  observer.observe(studio);
})();
