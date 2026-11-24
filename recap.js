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

availablePieces = () => story.steps.map(step => step[0]);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseStory();});
document.addEventListener('visor:open', pauseStory);
if ('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pauseStory();}).observe(el('historias'));
renderStoryTabs();
renderStory();
