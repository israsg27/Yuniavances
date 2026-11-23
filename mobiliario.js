'use strict';

(() => {
  const root = 'recap-media/mobiliario/';
  const byId = id => document.getElementById(id);
  const groups = window.catalogoMuebles;
  const search = byId('f-search');
  const filter = byId('f-filter');
  const grid = byId('f-grid');
  const more = byId('f-more');
  const modal = byId('f-dialog');
  const preview = byId('f-image');
  const model = byId('f-model');
  const orbit = byId('f-orbit');
  const hint = byId('f-help');
  const turn = byId('f-turn');
  const perPage = 20;
  let results = [], shown = 0, current = -1, request = 0, opener, viewer;

  const clean = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const items = groups.flatMap(group => group.items.map(item => ({
    ...item, group, words:clean([item.name, item.code, group.name].join(' '))
  })));

  for (const section of new Set(groups.map(g => g.line))) {
    const group = document.createElement('optgroup');
    group.label = section;
    for (const row of groups.filter(g => g.line === section)) {
      group.append(new Option(row.name + ' (' + row.items.length + ')', row.key));
    }
    filter.append(group);
  }

  function addPage() {
    const start = shown;
    const fragment = document.createDocumentFragment();
    shown = Math.min(start + perPage, results.length);
    for (let i=start; i<shown; i++) {
      const item = results[i], button = document.createElement('button');
      button.type='button'; button.className='f-card'; button.dataset.index=i;
      const frame = document.createElement('span');
      frame.className='f-card-image';
      const thumb = new Image();
      thumb.src=root+'mini/'+item.file+'.webp'; thumb.alt=''; thumb.loading='lazy'; thumb.decoding='async';
      thumb.width=thumb.height=300; frame.append(thumb);
      const name=document.createElement('span'), group=document.createElement('span');
      name.className='f-name'; name.textContent=item.name;
      group.className='f-collection'; group.textContent=item.group.name;
      button.append(frame, name, group); fragment.append(button);
    }
    grid.append(fragment);
    more.hidden=shown>=results.length;
    more.textContent='Mostrar '+Math.min(perPage,results.length-shown)+' piezas más ↓';
    return start;
  }

  function applyFilters(updateURL = true) {
    const terms = clean(search.value).split(/\s+/).filter(Boolean);
    results = items.filter(item => (!filter.value || item.group.key === filter.value) && terms.every(t => item.words.includes(t)));
    shown=0; grid.replaceChildren(); addPage();
    byId('f-count').textContent=results.length+' '+(results.length===1?'pieza':'piezas');
    byId('f-empty').hidden=results.length!==0;
    if (updateURL) {
      const url = new URL(location.href);
      for (const [key,value] of [['coleccion',filter.value],['q',search.value.trim()]]) {
        if(value) url.searchParams.set(key,value); else url.searchParams.delete(key);
      }
      try { history.replaceState(null,'',url); } catch {}
    }
  }

  function stopModel() {
    request++; viewer?.clear();
    model.hidden=true; preview.hidden=false; turn.hidden=true;
    orbit.disabled=false; orbit.setAttribute('aria-pressed','false'); orbit.textContent='Girar en 3D'; hint.textContent='';
  }

  function show(index) {
    if(!results.length) return;
    stopModel();
    current=(index+results.length)%results.length;
    const item=results[current];
    byId('f-family').textContent=item.group.name+(item.code?' · '+item.code:'');
    byId('f-piece').textContent=item.name;
    preview.alt=item.name+' en material mate de estudio'; preview.src=root+item.file+'.webp';
    byId('f-position').textContent=(current+1)+' de '+results.length;
    byId('f-prev').disabled=byId('f-next').disabled=results.length===1;
  }

  const libraries = new Map();
  function script(src) {
    if(!libraries.has(src)) {
      libraries.set(src,new Promise((resolve,reject) => {
        const el=document.createElement('script'); el.src=src;
        el.onload=resolve; el.onerror=()=>{libraries.delete(src);el.remove();reject(new Error('Falta un recurso del visor'));};
        document.head.append(el);
      }));
    }
    return libraries.get(src);
  }

  const meshes=new Map();
  window.recibirMueble=(key,vertices,indices,base64)=>meshes.set(key,{vertices,indices,base64});

  async function enableModel() {
    if(!model.hidden) { stopModel(); return; }
    const id=++request, item=results[current];
    orbit.disabled=true; hint.textContent='Cargando el modelo…';
    try {
      await Promise.all([script('recap-media/creador/three.min.js'),script('mobiliario-visor.js'),script(root+'mallas/'+item.file+'.js')]);
      if(id!==request || !modal.open) return;
      viewer ??= new VisorDeMuebles(model);
      model.hidden=false; preview.hidden=true;
      viewer.show(meshes.get(item.file), item.view);
      orbit.disabled=false; orbit.textContent='Ver render'; orbit.setAttribute('aria-pressed','true');
      turn.hidden=false; hint.textContent='Arrastra para girar.';
    } catch {
      if(id!==request) return;
      stopModel(); hint.textContent='La vista 3D no está disponible aquí. Puedes explorar el render de estudio.';
    }
  }

  search.addEventListener('input',()=>applyFilters());
  filter.addEventListener('change',()=>applyFilters());
  byId('f-reset').addEventListener('click',()=>{filter.value='';search.value='';applyFilters();search.focus();});
  more.addEventListener('click',()=>{const start=addPage();grid.children[start]?.focus();});
  grid.addEventListener('click',event=>{
    const card=event.target.closest('[data-index]'); if(!card) return;
    opener=card; show(Number(card.dataset.index)); modal.showModal();
    modal.querySelector('.f-close').focus({preventScroll:true});
  });
  modal.querySelector('.f-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  modal.addEventListener('close',()=>{stopModel();opener?.focus({preventScroll:true});});
  orbit.addEventListener('click',enableModel);
  byId('f-left').addEventListener('click',()=>viewer?.turn(-1));
  byId('f-right').addEventListener('click',()=>viewer?.turn(1));
  byId('f-prev').addEventListener('click',()=>show(current-1));
  byId('f-next').addEventListener('click',()=>show(current+1));
  modal.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    const step=event.key==='ArrowRight'?1:-1;
    if(model.hidden) show(current+step); else viewer.turn(step);
  });
  const query=new URLSearchParams(location.search);
  if(groups.some(g=>g.key===query.get('coleccion')))filter.value=query.get('coleccion');
  search.value=query.get('q')||'';
  applyFilters(false);
})();
