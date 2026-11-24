const monthCards = document.querySelectorAll('.month-issue');

for (const card of monthCards) {
  const front = card.querySelector('.issue-front');
  const back = card.querySelector('.issue-back');
  const toggle = card.querySelector('.issue-flip');
  const month = card.id;
  let pinned = false;

  function turn(open) {
    card.toggleAttribute('data-open', open);
    front.inert = open;
    back.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', (open ? 'Volver a la portada de ' : 'Girar tarjeta de ') + month);
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    pinned = !card.hasAttribute('data-open');
    turn(pinned);
    if (pinned) back.querySelector('a').focus({preventScroll:true});
  });
  card.addEventListener('focusout', event => {
    if (!card.contains(event.relatedTarget)) { pinned = false; turn(false); }
  });
  card.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    pinned = false;
    toggle.focus({preventScroll:true});
    turn(false);
  });
}
