'use strict';
let story = recapStories[0];
let storyStep = 0;
let storyTimer = null;

/* Las historias conectan una misma decisión de diseño a través de varios meses. */
function renderStoryTabs() {
  const tabs = recapStories.map(s => {
    const b = button(s.name);
    b.dataset.story = s.key;
    b.setAttribute('aria-pressed', String(s.key === story.key));
    return b;
  });
  el('story-tabs').replaceChildren(...tabs);
}

function renderStory() {
  const [pieceId, stepTitle, description] = story.steps[storyStep];
  const piece = pieceById.get(pieceId);
  const visual = node('div');
  const zoom = pieceButton(piece, 'story-image');
  const icon = node('span', 'expand-hint', '↗');
  icon.setAttribute('aria-hidden', 'true');
  zoom.append(picture(piece.src, piece.title, 'swap'), icon);
  const steps = node('div', 'story-steps');
  steps.setAttribute('role','group');
  steps.setAttribute('aria-label','Etapas de la historia');
  story.steps.forEach(([id,title],index) => {
    const step = button('');
    step.dataset.step = index;
    step.setAttribute('aria-pressed', String(index === storyStep));
    step.append(node('b','',monthById.get(pieceById.get(id).month).month),node('small','',title));
    steps.append(step);
  });
  visual.append(zoom,steps);
  const copy = node('div','story-text');
  copy.append(node('p','eyebrow',story.name + ' · ' + (storyStep+1) + ' de ' + story.steps.length),node('h3','',story.title),node('p','',story.intro));
  const note = node('div','story-note swap');
  note.setAttribute('aria-live','polite');
  note.append(node('strong','',stepTitle),node('p','',description));
  const m = monthById.get(piece.month);
  copy.append(note,chapterLink(m,'Ver el capítulo de '+m.month.toLowerCase()+' ↗','text-link'));
  el('story-stage').replaceChildren(visual,copy);
}

function selectStory(key) {
  const selected = recapStories.find(s => s.key === key);
  if (!selected) return;
  pauseStory();
  story = selected;
  storyStep = 0;
  for (const b of el('story-tabs').children) b.setAttribute('aria-pressed', String(b.dataset.story === key));
  renderStory();
}

function pauseStory() {
  clearInterval(storyTimer);
  storyTimer = null;
  el('play-story').textContent = '▶ Reproducir recorrido';
  el('play-story').setAttribute('aria-pressed', 'false');
  el('story-stage').classList.remove('playing');
}

el('play-story').addEventListener('click', () => {
  if (storyTimer !== null) { pauseStory(); return; }
  if (storyStep === story.steps.length - 1) storyStep = 0;
  renderStory();
  el('play-story').textContent = 'Ⅱ Pausar recorrido';
  el('play-story').setAttribute('aria-pressed', 'true');
  el('story-stage').classList.add('playing');
  storyTimer = setInterval(() => {
    storyStep++;
    renderStory();
    if (storyStep === story.steps.length - 1) pauseStory();
  }, 5500);
});

el('story-tabs').addEventListener('click',event => {
  const b = event.target.closest('[data-story]');
  if (b) selectStory(b.dataset.story);
});
el('story-stage').addEventListener('click',event => {
  const b = event.target.closest('[data-step]');
  if (!b) return;
  pauseStory();
  storyStep = Number(b.dataset.step);
  renderStory();
  el('story-stage').querySelector('[data-step="'+storyStep+'"]').focus({preventScroll:true});
});

/* El atlas original es una matriz de 5 por 5. La vista reproduce sus celdas. */
const frameCount = 25;
let face = 0;
let playTimer = null;
function positionOf(index) {
  return (index % 5)*25+'% '+Math.floor(index/5)*25+'%';
}

function selectFace(index) {
  face = (index + frameCount) % frameCount;
  el('eye-portrait').style.backgroundPosition = positionOf(face);
  el('eye-portrait').setAttribute('aria-label','Expresión '+(face+1)+' de 25');
  el('face-count').textContent = String(face+1).padStart(2,'0')+' / 25';
  for (const [i,b] of [...el('face-grid').children].entries()) {
    b.setAttribute('aria-pressed',String(i===face));
    b.tabIndex = i===face ? 0 : -1;
  }
}

function pauseEyes() {
  clearInterval(playTimer);
  playTimer = null;
  el('play-eyes').setAttribute('aria-pressed','false');
  el('play-eyes').textContent = '▶ Reproducir';
}

for (let i=0;i<frameCount;i++) {
  const b=button('');
  b.style.backgroundPosition=positionOf(i);
  b.setAttribute('aria-label','Expresión '+(i+1));
  b.dataset.face=i;
  el('face-grid').append(b);
}
el('face-grid').addEventListener('click',event=>{
  const b=event.target.closest('[data-face]');
  if(b){pauseEyes();selectFace(Number(b.dataset.face));}
});
el('face-grid').addEventListener('keydown',event=>{
  const delta={ArrowLeft:-1,ArrowRight:1,ArrowDown:5,ArrowUp:-5}[event.key];
  if(delta===undefined)return;
  event.preventDefault();pauseEyes();selectFace(face+delta);
  el('face-grid').children[face].focus({preventScroll:true});
});
document.querySelectorAll('[data-eye]').forEach(b=>b.addEventListener('click',()=>{pauseEyes();selectFace(face+Number(b.dataset.eye));}));
el('play-eyes').addEventListener('click',()=>{
  if(playTimer!==null){pauseEyes();return;}
  el('play-eyes').textContent='Ⅱ Pausar';
  el('play-eyes').setAttribute('aria-pressed','true');
  selectFace(face+1);
  playTimer=setInterval(()=>selectFace(face+1),720);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseEyes();pauseStory();}});
el('compare-range').addEventListener('input',event=>{
  const value=event.target.value;
  el('compare-images').style.setProperty('--split',value+'%');
  event.target.setAttribute('aria-valuetext',value+' por ciento de acabado neutro');
});


const curated=['oct-petcare','sep-ropa','ago-pesca','jul-doc','abr-prendas','may-doc','ago-plantas','feb-yunit','sep-puertas','oct-doc2','jun-creador','abr-colas','ago-peces','jul-globos','sep-capas'];
const galleryOrder=[...curated.map(id=>pieceById.get(id)),...recapPieces.filter(p=>!curated.includes(p.id))];
const topicPieces = {
  'Tienda y arcade': new Set(['jun-tienda-prototipo','jun-objetos','jun-tienda','jun-tienda-modelo','jul-doc','jul-tienda-luz','jul-materiales','jul-arcade','jul-globos','jul-escalada','jul-globos-piezas','ago-arcade']),
  'Pesca': new Set(['ago-pesca','ago-peces','ago-pez-panel','ago-camara','pesca-mapa','pesca-jurasico']),
  'Cuidado': new Set(['oct-petcare','oct-cuidado','cuidado-accion'])
};
const themes=['Todas','Personaje','Espacios','Vestuario','Juego',...Object.keys(topicPieces)];
function inTheme(piece, filter) {
  if (filter==='Todas' || piece.theme===filter) return true;
  if (filter==='Espacios') return piece.theme==='Habitaciones';
  if (filter==='Juego') return ['Tienda','Minijuegos','Pesca'].includes(piece.theme);
  return topicPieces[filter]?.has(piece.id) || false;
}
let theme='Todas';
let visibleCount=9;
let galleryResults=[];
function normalized(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function renderGallery(appendOnly=false) {
  const q=normalized(el('buscar').value.trim());
  galleryResults=galleryOrder.filter(p=>inTheme(p,theme)&&normalized([p.title,p.caption,p.type,p.theme,origin(p)].join(' ')).includes(q));
  const target=el('galeria-piezas');
  const start=appendOnly?target.children.length:0;
  if(!appendOnly)target.replaceChildren();
  const batch=galleryResults.slice(start,visibleCount).map(p=>{
    const tile=labeledTile(p);
    if(appendOnly)tile.classList.add('gallery-new');
    return tile;
  });
  target.append(...batch);
  const shown=Math.min(visibleCount,galleryResults.length);
  el('gallery-count').textContent=shown?'Mostrando '+shown+' de '+galleryResults.length+' piezas.':'Sin coincidencias. Prueba otro tema o término.';
  const remaining=galleryResults.length-shown;
  el('more-pieces').hidden=remaining<=0;
  el('more-pieces').textContent='Ver '+Math.min(9,remaining)+' piezas más ↓';
  return batch;
}
themes.forEach(name=>{
  const b=button(name);b.dataset.theme=name;b.setAttribute('aria-pressed',String(name===theme));el('gallery-filters').append(b);
});
el('gallery-filters').addEventListener('click',event=>{
  const b=event.target.closest('[data-theme]');if(!b)return;
  theme=b.dataset.theme;visibleCount=9;
  for(const other of el('gallery-filters').children)other.setAttribute('aria-pressed',String(other===b));
  renderGallery();
});
el('buscar').addEventListener('input',()=>{visibleCount=9;renderGallery();});
el('more-pieces').addEventListener('click',()=>{visibleCount+=9;const batch=renderGallery(true);if(batch[0])batch[0].focus({preventScroll:true});});


availablePieces = trigger => el('story-stage').contains(trigger) ? story.steps.map(step => step[0]) : galleryResults.map(item => item.id);
document.addEventListener('visor:open', () => { pauseStory(); pauseEyes(); });
if('IntersectionObserver' in window){
  const introObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('reveal-in');introObserver.unobserve(entry.target);}
  },{threshold:.15});
  document.querySelectorAll('.section-intro,.road-intro').forEach(n=>introObserver.observe(n));
  const labObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pauseEyes();});
  labObserver.observe(el('laboratorio'));
  const storyObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pauseStory();});
  storyObserver.observe(el('historias'));
}

renderStoryTabs();renderStory();selectFace(0);renderGallery();
