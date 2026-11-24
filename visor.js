'use strict';

const el = id => document.getElementById(id);
const pieceById = new Map(recapPieces.map(p => [p.id, p]));
const monthById = new Map(recapMonths.map(m => [m.slug, m]));
const viewer = el('visor');
let viewerIds = [];
let viewerIndex = 0;
let viewerOpener = null;

function node(tag, className, content) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (content !== undefined) n.textContent = content;
  return n;
}

function picture(src, alt = '', className) {
  const img = node('img', className);
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  return img;
}

function button(label, className) {
  const b = node('button', className, label);
  b.type = 'button';
  return b;
}

function chapterLink(month, title, className) {
  const a = node('a', className, title);
  a.href = month.slug + '.html';
  return a;
}

function pieceButton(piece, className) {
  const b = button('', className);
  b.dataset.piece = piece.id;
  b.setAttribute('aria-label', 'Ampliar imagen: ' + piece.title);
  return b;
}

function origin(piece) {
  const dated = monthById.get(piece.month);
  if (dated) return dated.month + ' de 2026';
  const references = {atlas:'Biblioteca de ojos', 'cuidado-accion':'PetCare', 'flujo-habitacion':'Flujo de creación de cuarto', 'pesca-mapa':'Documentación de pesca','pesca-jurasico':'Documentación de pesca','texturas-ropa':'Muestrario de vestuario · agosto a octubre'};
  return references[piece.id] || 'Archivo de arte';
}

function labeledTile(piece) {
  const b = pieceButton(piece, 'gallery-tile');
  const frame = node('div', 'gallery-thumb');
  frame.append(picture(piece.src));
  const copy = node('div', 'tile-label');
  copy.append(node('small', '', piece.theme + ' · ' + piece.type), node('h3', '', piece.title));
  b.append(frame, copy);
  return b;
}


let availablePieces = () => Array.from(new Set(Array.from(document.querySelectorAll('[data-piece]'), item => item.dataset.piece)));
function renderViewer(){
  const p=pieceById.get(viewerIds[viewerIndex]);
  el('piece-image').src=p.src;
  el('piece-image').alt=p.title;
  const study = viewerOpener?.closest('.month-study');
  el('piece-type').textContent=study ? study.querySelector('summary strong').textContent : p.theme+' / '+p.type;
  el('piece-origin').textContent=origin(p);
  el('piece-title').textContent=p.title;
  el('piece-caption').textContent=study ? p.caption+' '+study.querySelector('.study-text p:last-of-type').textContent : p.caption;
  el('piece-counter').textContent=(viewerIndex+1)+' / '+viewerIds.length;
  el('prev-piece').disabled=el('next-piece').disabled=viewerIds.length<2;
  viewer.scrollTop=0;
}
function openViewer(id,trigger,ids){
  const p=pieceById.get(id);if(!p)return;
  viewerOpener=trigger;
  viewerIds = ids || availablePieces(trigger);
  viewerIndex=viewerIds.indexOf(id);
  if(viewerIndex<0){viewerIds=[id];viewerIndex=0;}
  document.dispatchEvent(new Event("visor:open"));renderViewer();viewer.showModal();
  viewer.querySelector('.close').focus({preventScroll:true});
}
function closeViewer(){
  if(!viewer.open)return;
  viewer.close();
  if(viewerOpener?.isConnected)viewerOpener.focus({preventScroll:true});
  viewerOpener=null;
}
function turnPiece(amount){
  viewerIndex=(viewerIndex+amount+viewerIds.length)%viewerIds.length;
  renderViewer();
}
el('next-piece').addEventListener('click',()=>turnPiece(1));
el('prev-piece').addEventListener('click',()=>turnPiece(-1));
viewer.querySelector('.close').addEventListener('click',closeViewer);
viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
viewer.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turnPiece(e.key==='ArrowRight'?1:-1);}
});


viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeViewer();
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('button[data-piece]');
  if (trigger) openViewer(trigger.dataset.piece, trigger);
});
