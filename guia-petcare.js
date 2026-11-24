'use strict';

const guiaPetcare = document.createElement('template');
const gestosPetcare = [
  { id: 'pelota', titulo: 'Lanzar la pelota', texto: 'Lanza la pelota por el cuarto para que tu Yunipet la recoja. El contador de la parte superior muestra el avance de la ronda.', alt: 'Una pelota roja a los pies del Yunipet y el contador de lanzamientos en la parte superior' },
  { id: 'salto', titulo: 'Saltar la cuerda', texto: 'Sigue el giro de la cuerda y toca «Salta» cuando pase bajo sus patas. El indicador bajo la mascota te ayuda a seguir el ritmo.', alt: 'Una cuerda verde pasa sobre el Yunipet y el botón Salta aparece debajo' },
  { id: 'aro-en-vuelo', titulo: 'Apuntar el aro', texto: 'Dirige el aro hacia la marca que aparece en el cuarto. La mascota se gira para seguir el lanzamiento.', alt: 'El Yunipet sigue el aro frente a una marca circular verde' },
  { id: 'burbujas', titulo: 'Jugar con burbujas', texto: 'La varita aparece delante del Yunipet. Al usarla salen burbujas y el medidor de la derecha permite seguir la ronda.', alt: 'La varita azul delante del Yunipet y el medidor al costado derecho' }
];

customElements.define('petcare-juguetes', class extends HTMLElement {
  connectedCallback() {
    if (this.childElementCount) return;
    this.innerHTML = `<figure><img loading="lazy" width="1440" height="708"><figcaption>
      <p class="edition-label">Capturas del prototipo · Arte no final</p>
      <label>Elige una interacción<select></select></label>
      <p aria-live="polite"></p></figcaption></figure>`;
    const select = this.querySelector('select');
    const image = this.querySelector('img');
    const description = this.querySelector('[aria-live]');
    for (const gesto of gestosPetcare) select.add(new Option(gesto.titulo, gesto.id));
    function mostrar() {
      const gesto = gestosPetcare[select.selectedIndex];
      image.src = 'recap-media/petcare/' + gesto.id + '.webp';
      image.alt = gesto.alt;
      description.textContent = gesto.texto;
    }
    select.addEventListener('change', mostrar);
    mostrar();
  }
});

guiaPetcare.innerHTML = `<nav class="care-nav" aria-label="Actividades de PetCare"><a href="#bano">Baño</a><a href="#comida">Comida</a><a href="#juego">Juego</a></nav>
<section id="bano" class="care-chapter">
  <p class="edition-label">Humedad, espuma y limpieza · Arte no final</p><h2>Cómo se baña al Yunipet</h2>
  <p>La manguera siempre está a mano. Para cambiar el jabón, el estropajo, la toalla o el cepillo, abre el inventario y elige la herramienta que quieres usar.</p>
  <ol class="care-bath-steps" aria-label="Orden del baño">
    <li><img src="recap-media/petcare/diseno/ducha.webp" alt="" loading="lazy"><div><strong>1. Mojar</strong><p>Pasa la manguera por el cuerpo hasta alcanzar el 100 % de humedad.</p></div></li>
    <li><img src="recap-media/petcare/jabon-2.webp" alt="" loading="lazy"><div><strong>2. Enjabonar</strong><p>Arrastra el jabón sobre el pelaje mojado para formar espuma.</p></div></li>
    <li><img src="recap-media/petcare/estropajo-2.webp" alt="" loading="lazy"><div><strong>3. Frotar</strong><p>Mueve el estropajo sobre cada mancha para quitar la suciedad.</p></div></li>
    <li><img src="recap-media/petcare/diseno/ducha.webp" alt="" loading="lazy"><div><strong>4. Enjuagar</strong><p>Vuelve a la manguera y retira el jabón hasta que la espuma llegue a cero.</p></div></li>
    <li><img src="recap-media/petcare/secado-0.webp" alt="" loading="lazy"><div><strong>5. Secar</strong><p>Arrastra la toalla al Yunipet. Tras usarla, espera a que vuelva a estar disponible.</p></div></li>
    <li><img src="recap-media/petcare/cepillo-0.webp" alt="" loading="lazy"><div><strong>6. Cepillar</strong><p>Pasa el cepillo por el pelo seco para dejarlo brillante.</p></div></li>
  </ol>
  <figure class="bath-scene"><img src="recap-media/petcare/enjuague.webp" loading="lazy" alt="La manguera enjuaga la espuma del pelaje del Yunipet"><figcaption>Enjuague en el prototipo. La manguera pasa sobre el pelaje para retirar la espuma. · Arte no final</figcaption></figure>
  <petcare-bano></petcare-bano>
</section>
<section class="care-mode" id="comida">
  <header class="care-inventory-heading"><p class="edition-label">Alimentación · Arte no final</p><h2>Del inventario al plato</h2></header>
  <petcare-inventario actividad="comida"></petcare-inventario>
  <figure class="care-shot"><img src="recap-media/petcare/servir.webp" loading="lazy" alt="Captura del prototipo con el medidor de llenado junto al plato de croquetas"><figcaption class="care-art-note">Arte no final</figcaption></figure>
  <div><h3>Cuándo ofrecerle comida</h3>
  <p>El botón de comida abre la bandeja. Las croquetas y el agua tienen platos distintos, pero ambas contribuyen a la misma barra de alimentación. Cuando el Yunipet está lleno, el alimento que le ofrezcas vuelve al inventario.</p>
  <p>Al ofrecerle un alimento, se descuenta una unidad cuando empieza a comer. Si es uno de sus favoritos, también gana un poco de diversión.</p></div>
</section>
<section class="care-mode" id="juego">
  <header class="care-inventory-heading"><p class="edition-label">Diversión · Arte no final</p><h2>El juguete define el gesto</h2></header>
  <petcare-inventario actividad="juego"></petcare-inventario>
  <figure class="care-shot"><img src="recap-media/petcare/inventario-juguetes.webp" loading="lazy" alt="Inventario del prototipo con las pelotas disponibles y las categorías de juguetes"><figcaption class="care-art-note">Arte no final</figcaption></figure>
  <div><h3>Qué pasa al jugar una ronda</h3>
  <p>Toca un juguete de la bandeja. La bandeja se recoge y queda espacio para jugar. En el diseño, completar una ronda sube la diversión y consume un uso. El juguete básico vuelve a estar disponible tras una espera. Si cambias de actividad antes de jugar, recuperas el objeto.</p></div>
  <petcare-juguetes></petcare-juguetes>
  <div class="care-observed"><p>En el prototipo, la barra de calma sube al jugar. El diseño también contempla tirar de una cuerda con toques repetidos, seguir un juguete escondido bajo tres cajas y tocar a tiempo para saltar una valla.</p></div>
</section>`;
