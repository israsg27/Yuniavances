'use strict';

// Recuentos de Pesca Documentación en Figma, en el orden de rarezas de la ficha.
const islasDePesca = {
  molino: ['La primera lección de pesca transcurre junto a un viejo molino. Entre los juncos y el agua tranquila de la tarde, es más fácil encontrar peces comunes.', [9, 4, 2, 0], '#c2e3d1'],
  alamos: ['Un río lento atraviesa los álamos en otoño. Las hojas cobrizas cubren la orilla y aquí ya aparece una especie legendaria.', [7, 4, 3, 1], '#f8d1ac'],
  garzas: ['Al amanecer, la niebla cubre un bosque inundado. La zona de pesca se abre entre los troncos y los nenúfares.', [7, 4, 3, 1], '#c4dddb'],
  muelle: ['Desde el muelle se pesca en las aguas oscuras de un pantano. Sobre la superficie flotan pequeñas luces.', [6, 5, 3, 1], '#c7cee4'],
  robledal: ['El estanque queda junto a un puente de jardín, entre arces rojos y faroles de papel.', [6, 5, 3, 1], '#f3c8b0'],
  bruma: ['La pesca se adentra en una fosa oceánica. En sus aguas profundas y oscuras hay cuatro especies míticas por descubrir.', [5, 5, 4, 1], '#b6c9e1'],
  grietas: ['El viento recorre la superficie helada. Las fracturas del hielo dejan al descubierto el agua donde lanzar la caña.', [5, 5, 4, 1], '#c8e4f2'],
  jurasico: ['Helechos gigantes y fumarolas rodean aguas habitadas por peces prehistóricos acorazados. Es la isla con más especies.', [5, 6, 5, 2], '#d0dcb3']
};

const destino = document.querySelector('#isla-elegida');
function mostrarIsla() {
  const [entorno, recuentos, color] = islasDePesca[destino.value];
  const imagen = document.querySelector('#isla-arte');
  imagen.src = 'recap-media/islas/' + destino.value + '.webp';
  imagen.alt = 'Isla de pesca · ' + destino.selectedOptions[0].textContent;
  imagen.parentElement.style.setProperty('--agua', color);
  document.querySelector('#isla-entorno').textContent = entorno;
  const total = recuentos.reduce((suma, cantidad) => suma + cantidad, 0);
  document.querySelector('#isla-total').textContent = total + ' especies previstas';
  document.querySelectorAll('.island-rarities dd').forEach((dato, i) => {
    dato.textContent = recuentos[i];
  });
}
destino.addEventListener('change', mostrarIsla);
mostrarIsla();

const peces = colecciones.peces;
const opciones = document.querySelector('#pez-opciones');
function mostrarPez(indice) {
  const nombre = peces.names[indice];
  const numero = String(indice + 1).padStart(2, '0');
  const imagen = document.querySelector('#pez-arte');
  imagen.src = 'recap-media/colecciones/peces/' + numero + '.webp';
  imagen.alt = 'Ilustración del álbum · ' + nombre;
  document.querySelector('#pez-nombre').textContent = nombre;
  document.querySelector('#pez-posicion').textContent = numero + ' / ' + peces.names.length;
  Array.from(opciones.children).forEach((boton, i) => {
    boton.setAttribute('aria-pressed', String(i === indice));
  });
}
peces.names.forEach((nombre, indice) => {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.title = nombre;
  boton.setAttribute('aria-label', nombre);
  // La hoja de miniaturas original contiene cinco columnas y seis filas.
  boton.style.backgroundPosition = (indice % 5 * 25) + '% ' + (Math.floor(indice / 5) * 20) + '%';
  boton.addEventListener('click', () => mostrarPez(indice));
  opciones.append(boton);
});
mostrarPez(peces.initialIndex);
