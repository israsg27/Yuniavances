const shopZoom = document.querySelector('.shop-zoom');
document.querySelector('.shop-walkthrough').addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const preview = shopZoom.querySelector('img');
  preview.src = link.href;
  preview.alt = link.querySelector('img').alt;
  shopZoom.querySelector('h2').textContent = link.closest('figure').querySelector('h3').textContent;
  shopZoom.showModal();
});
