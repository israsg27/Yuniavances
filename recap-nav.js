'use strict';

// Preserve bookmarks from the original month index and its combined archive.
function openLegacySection() {
  const hash = location.hash.slice(1);
  const archiveRoutes = {
    historias:'historias.html', laboratorio:'meses.html', galeria:'galeria.html',
    proximos:'planeacion.html', 'plan-pesca':'planeacion.html#plan-pesca'
  };
  const months = ['febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre'];
  let target;
  if (Object.hasOwn(archiveRoutes,hash)) target = archiveRoutes[hash];
  else if (document.body.hasAttribute('data-archivo')) target = 'arte.html';
  else if (hash === 'sistemas') target = 'sistemas.html';
  else if (hash === 'avances' || months.includes(hash)) target = 'meses.html#'+hash;
  else if (hash.startsWith('avance/') && months.includes(hash.slice(7))) target = hash.slice(7)+'.html';
  if (target) {
    const url = new URL(target,location.href);
    url.search = location.search;
    location.replace(url.href);
  }
}
openLegacySection();
window.addEventListener('hashchange',openLegacySection);
