'use strict';

const collections = [
  {
    id:'petcare', title:'Componentes de PetCare', category:'Cuidado', artStatus:'Arte no final', cover:'oct-petcare',
    intro:'Baño, comida y juego comparten la habitación del Yunipet. Cada actividad cambia la bandeja de objetos, el gesto del jugador y la respuesta de la mascota.',
    tags:['Juego','Cuidado'], ids:['oct-petcare','cuidado-accion'],
    report:'octubre.html#cuidado', reportLabel:'Ver el avance de octubre'
  },
  {
    id:'personaje', title:'Construcción del Yunipet', category:'Personaje', cover:'feb-yunit',
    intro:'De las primeras siluetas a una base modular. El equipo probó cabezas, orejas y hocicos sobre el mismo cuerpo, y dividió el pelaje en zonas que se pueden colorear por separado.',
    tags:['Personaje'], report:'marzo.html?coleccion=cabeza#componentes', reportLabel:'Comparar las formas de cabeza'
  },
  {
    id:'cuarto', title:'El cuarto y sus muebles', category:'Espacios', cover:'oct-doc',
    intro:'Una cuadrícula organiza pisos, paredes y muebles. Los puntos de apoyo permiten colocar un objeto sobre otro. Una misma pieza admite distintos acabados.',
    tags:['Espacios'], report:'octubre.html', reportLabel:'Ver el avance de octubre'
  },
  {
    id:'pesca', title:'Las islas y el álbum de pesca', category:'Pesca', cover:'ago-pesca',
    intro:'El mapa distingue los destinos disponibles de los bloqueados. El álbum permite pasar de la silueta de un pez a su ilustración y su ficha. La asignación definitiva de especies por isla quedó pendiente de validación.',
    tags:['Pesca','Juego'], ids:['ago-pesca','ago-peces','ago-pez-panel','ago-camara','pesca-mapa','pesca-jurasico'],
    report:'agosto.html?coleccion=peces#componentes', reportLabel:'Recorrer el álbum de peces'
  },
  {
    id:'vestuario', title:'Del boceto a la prenda', category:'Vestuario', cover:'sep-boina',
    intro:'La ropa debe encajar en el cuerpo y acompañar el movimiento. Las láminas reúnen las primeras pruebas de prendas, los conjuntos modelados y los estudios de textura.',
    tags:['Vestuario'], report:'septiembre.html#componentes', reportLabel:'Ver los ocho conjuntos'
  },
  {
    id:'tienda', title:'La tienda y el arcade', category:'Tienda y arcade', cover:'jul-globos',
    intro:'El prototipo ensaya el recorrido del catálogo a un objeto. Las pruebas posteriores llevan la tienda a Unity y detallan cómo se entra a una partida de globos o escalada y cómo se presenta el resultado.',
    tags:['Tienda y arcade','Juego'], ids:['jul-globos','jun-tienda-prototipo','jun-objetos','jun-tienda','jun-tienda-modelo','jul-doc','jul-tienda-luz','jul-materiales','jul-arcade','jul-escalada','jul-globos-piezas','ago-arcade','jul-iconos','mar-yunicoin'],
    report:'julio.html?coleccion=arcade#componentes', reportLabel:'Explorar las pantallas de la demo'
  },
  {
    id:'movimiento', title:'Expresión y movimiento', category:'Personaje', cover:'jun-anim',
    intro:'El esqueleto permite que el Yunipet se siente o se acueste al usar un mueble. Los ojos le dan expresión a la cara mientras cambia de postura.',
    tags:['Personaje'], ids:['jun-anim','jun-mov','may-pesos','abr-ojos','feb-ojos','feb-expresiones','ago-ojos','atlas','jun-personalidad'],
    report:'junio.html', reportLabel:'Ver el avance de junio'
  }
];

const assigned = new Set(collections.flatMap(c => c.ids || []));
for (const collection of collections) {
  collection.pieces = collection.ids
    ? collection.ids.map(id => pieceById.get(id))
    : recapPieces.filter(p => !assigned.has(p.id) && (p.theme === collection.category || (collection.id === 'cuarto' && p.theme === 'Habitaciones')));
}
const params = new URLSearchParams(location.search);
const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const topics = ['Todas','Personaje','Espacios','Vestuario','Juego','Tienda y arcade','Pesca','Cuidado'];

function projectCard(collection) {
  const card = node('a','gallery-tile project-card');
  card.href = 'galeria.html?ficha='+collection.id;
  card.dataset.collection = collection.id;
  const frame = node('div','gallery-thumb');
  frame.append(picture(pieceById.get(collection.cover).src));
  const copy = node('div','tile-label');
  copy.append(node('small','',[collection.category,collection.artStatus].filter(Boolean).join(' · ')),node('h2','',collection.title),node('p','piece-description',collection.intro),node('span','collection-cta','Explorar componentes →'));
  card.append(frame,copy);
  return card;
}

function showIndex() {
  let theme = topics.includes(params.get('tema')) ? params.get('tema') : 'Todas';
  const search = el('buscar');
  search.value = params.get('q') || '';
  const filters = el('gallery-filters');
  for (const topic of topics) {
    const control = button(topic);
    control.dataset.theme = topic;
    filters.append(control);
  }
  function render() {
    const query = fold(search.value.trim());
    const results = collections.filter(c => {
      if (theme !== 'Todas' && !c.tags.includes(theme)) return false;
      const content = [c.title,c.intro,c.category,...c.pieces.flatMap(p => [p.title,p.caption,p.type,origin(p)])];
      if (c.id === 'petcare') {
        content.push(guiaPetcare.content.textContent);
        for (const tool of herramientasDeBano) content.push(tool.family, tool.use, ...tool.variants);
      }
      return !query || fold(content.join(' ')).includes(query);
    });
    for (const control of filters.children) control.setAttribute('aria-pressed',String(control.dataset.theme === theme));
    el('galeria-piezas').replaceChildren(...results.map(projectCard));
    el('gallery-count').textContent = results.length ? results.length+(results.length===1?' ficha de diseño':' fichas de diseño') : 'Sin coincidencias. Prueba otro tema o término.';
  }
  function update() {
    const url = new URL(location.href);
    theme === 'Todas' ? url.searchParams.delete('tema') : url.searchParams.set('tema',theme);
    search.value ? url.searchParams.set('q',search.value) : url.searchParams.delete('q');
    history.replaceState(null,'',url);
    render();
  }
  filters.addEventListener('click',event => {
    const control = event.target.closest('button[data-theme]');
    if (control) { theme = control.dataset.theme; update(); }
  });
  search.addEventListener('input',update);
  render();
}

function designSequence(collection) {
  const section = node('section','design-sequence');
  section.append(node('h2','','Recorrido de diseño'));
  const figure = node('figure');
  const image = node('img');
  const caption = node('figcaption');
  const step = node('small','edition-label');
  const title = node('h3');
  const description = node('p');
  const select = node('select');
  select.setAttribute('aria-label','Elegir un estudio de '+collection.title);
  const months = [...monthById.keys(),'archivo'];
  const ordered = [...collection.pieces].sort((a,b) => months.indexOf(a.month) - months.indexOf(b.month));
  for (const [index,piece] of ordered.entries()) select.add(new Option(piece.title,index));
  function show(index) {
    const piece = ordered[index];
    image.src = piece.src;
    image.alt = piece.title;
    step.textContent = origin(piece)+' · '+(index+1)+' de '+ordered.length;
    title.textContent = piece.title;
    description.textContent = piece.caption;
  }
  select.addEventListener('change',() => show(select.selectedIndex));
  caption.append(step,title,description,select);
  figure.append(image,caption);
  section.append(figure);
  show(0);
  return section;
}

function showCollection(collection) {
  el('galeria').hidden = true;
  el('galeria-ficha').hidden = false;
  document.title = collection.title+' · Yunipets!';
  el('dossier-category').textContent = [collection.category,'Diseño del sistema',collection.artStatus].filter(Boolean).join(' · ');
  el('dossier-title').textContent = collection.title;
  el('dossier-intro').textContent = collection.intro;
  const cover = pieceById.get(collection.cover);
  el('dossier-cover').src = cover.src;
  el('dossier-cover').alt = cover.title;
  const body = el('dossier-body');
  body.append(collection.id === 'petcare' ? guiaPetcare.content.cloneNode(true) : designSequence(collection));
  const proof = node('a','dossier-proof',collection.reportLabel+' →');
  proof.href = collection.report;
  body.append(proof);
  const target = document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView());
}
const selected = collections.find(c => c.id === params.get('ficha'));
if (selected) showCollection(selected);
else showIndex();
