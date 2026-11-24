'use strict';
/* El atlas original es una matriz de 5 por 5. La vista reproduce sus celdas. */
const frameCount = 25;
let face = 0;
let playTimer = null;
function positionOf(index) {
  return (index % 5)*25+'% '+Math.floor(index/5)*25+'%';
}

function selectFace(index) {
  face = (index + frameCount) % frameCount;
  const file = String(face + 1).padStart(2, '0');
  el('eye-portrait').style.backgroundImage = 'url("recap-media/colecciones/ojos7/' + file + '.webp")';
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

el('compare-range').addEventListener('input',event=>{
  const value=event.target.value;
  el('compare-images').style.setProperty('--split',value+'%');
  event.target.setAttribute('aria-valuetext',value+' por ciento de acabado neutro');
});


document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseEyes();});
document.addEventListener('visor:open', pauseEyes);
if ('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pauseEyes();}).observe(el('laboratorio'));
selectFace(0);
