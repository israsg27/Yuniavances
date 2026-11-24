(() => {
  const trigger = document.querySelector('[data-choose-month]');
  if (!trigger || typeof HTMLDialogElement === 'undefined') return;
  const months = ['Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre'];
  const picker = document.createElement('dialog');
  picker.className = 'month-picker';
  picker.setAttribute('aria-labelledby', 'pick-title');
  picker.innerHTML = '<header><h2 id="pick-title">Reportes de 2026</h2><form method="dialog"><button aria-label="Cerrar">×</button></form></header><nav aria-label="Elegir reporte"></nav><a class="pick-index" href="meses.html">Ver todas las portadas →</a>';
  const nav = picker.querySelector('nav');
  for (const month of months) {
    const link = document.createElement('a');
    link.textContent = month;
    link.href = month.toLowerCase() + '.html';
    if (link.pathname === location.pathname) link.setAttribute('aria-current','page');
    nav.append(link);
  }
  document.body.append(picker);
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    picker.showModal();
    (nav.querySelector('[aria-current]') || nav.firstElementChild).focus();
  });
  picker.addEventListener('click', event => {
    if (event.target !== picker) return;
    const r = picker.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) picker.close();
  });
})();
