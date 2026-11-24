'use strict';

// Order follows the bathroom interaction, including the reuse state in the towel family.
const herramientasDeBano = [
  {
    id: 'jabon', title: 'Enjabonar', family: 'Jabones y champús',
    use: 'Después de mojar el pelaje, se arrastra el producto sobre el Yunipet. El tipo de jabón determina su durabilidad y la rapidez con que se retira la suciedad.',
    variants: ['Pastilla coral', 'Pastilla amarilla', 'Dispensador turquesa', 'Botella azul', 'Pastilla violeta', 'Botella coral']
  },
  {
    id: 'estropajo', title: 'Frotar', family: 'Estropajos',
    use: 'La esponja o el guante esparce el jabón sobre las manchas. La barra de uso indica el desgaste de la herramienta. Después se vuelve a la manguera hasta retirar toda la espuma.',
    variants: ['Esponja amarilla', 'Esponja turquesa', 'Guante violeta']
  },
  {
    id: 'secado', title: 'Secar', family: 'Toallas',
    use: 'Cada tipo define cuánto tarda en secar y cuánto hay que esperar para volver a usarlo. En la lámina, la azul seca en 5 segundos y la de estrellas en 2. El ejemplo gris muestra la espera restante de una toalla usada.',
    variants: ['Verde', 'En espera', 'Azul · 5 s', 'Estrellas · 2 s']
  },
  {
    id: 'cepillo', title: 'Cepillar', family: 'Cepillos y peine',
    use: 'Al terminar el secado, se pasa el cepillo por el pelaje. La elección cambia la duración de la herramienta y el tiempo de cepillado.',
    variants: ['Cepillo ovalado', 'Peine coral', 'Cepillo rectangular']
  }
];

const familiasDeComida = [
  {
    title: 'Servir croquetas', family: 'Bolsa y comedero',
    use: 'Lleva la bolsa al comedero y detén el medidor en la zona marcada para llenar el plato. Si te pasas, las croquetas se derraman. Cada bolsa rinde varios usos.',
    variants: ['Bolsa cerrada', 'Bolsa abierta', 'Comedero vacío', 'Croquetas servidas'],
    icons: ['diseno/croquetas', 'objetos/bolsa-abierta', 'objetos/plato-vacio', 'objetos/plato-lleno']
  },
  {
    title: 'Servir agua', family: 'Botella y bebedero',
    use: 'Arrastra la botella al bebedero azul. Detén el medidor antes de que el agua se desborde y repón la botella cuando se agoten sus usos.',
    variants: ['Botella de agua', 'Bebedero vacío', 'Agua servida'],
    icons: ['diseno/agua', 'objetos/bebedero-vacio', 'objetos/bebedero-lleno']
  },
  {
    title: 'Dar un premio', family: 'Apertura del sobre',
    use: 'Toca el sobre y desliza el dedo por la esquina marcada. Al abrirlo aparecen los bocados que puedes darle a tu Yunipet. El beneficio temporal del premio sigue en diseño.',
    variants: ['Esquina marcada', 'Esquina rasgada', 'Premios a la vista'],
    icons: ['objetos/sobre-cerrado', 'objetos/sobre-rasgado', 'objetos/sobre-abierto']
  }
];

const juguetesDePetcare = [
  {
    title: 'Lanzar y recoger', family: 'Pelotas y hueso',
    use: 'Desliza el juguete y suelta para lanzarlo por el cuarto. El Yunipet sigue su trayectoria, lo recoge y te lo devuelve.',
    variants: ['Pelota azul', 'Pelota naranja', 'Pelota verde', 'Hueso de cuerda'],
    icons: ['pelota-azul', 'pelota-naranja', 'pelota-verde', 'hueso']
  },
  {
    title: 'Apuntar y soltar', family: 'Discos y aros',
    use: 'Apunta hacia la marca y suelta el disco para que la mascota lo atrape en vuelo. La lámina explora dos formas para los juguetes voladores.',
    variants: ['Disco verde', 'Disco azul', 'Aro verde', 'Aro azul', 'Aro rojo', 'Aro violeta'],
    icons: ['disco-verde', 'disco-azul', 'aro-verde', 'aro-azul', 'aro-rojo', 'aro-violeta']
  },
  {
    title: 'Saltar a tiempo', family: 'Cuerdas de salto',
    use: 'Observa la cuerda mientras gira y toca «Salta» cuando va a pasar bajo las patas del Yunipet. En el prototipo, un indicador te ayuda a elegir el momento.',
    variants: ['Roja', 'Azul', 'Verde', 'Violeta'],
    icons: ['cuerda-roja', 'cuerda-azul', 'cuerda-verde', 'cuerda-violeta']
  },
  {
    title: 'Preparar las burbujas', family: 'Envases y varita',
    use: 'Elige el burbujero de la bandeja. La varita aparece frente a la mascota y da paso a la ronda de burbujas.',
    variants: ['Bote azul', 'Frasco rojo', 'Frasco turquesa', 'Bolsa de recarga', 'Tubo violeta', 'Tubo rojo', 'Varita'],
    icons: ['frasco-azul', 'frasco-rojo', 'frasco-turquesa', 'recarga', 'tubo-violeta', 'tubo-rojo', 'varita']
  },
  {
    title: 'Tocar antes de que escapen', family: 'Burbujas',
    use: 'Toca las burbujas que flotan alrededor de la mascota. El Yunipet reacciona cuando aciertas. Entre los diseños hay una burbuja dorada con una huella en el centro.',
    variants: ['Cian', 'Rosa', 'Lila', 'Dorada con huella'],
    icons: ['burbuja-0', 'burbuja-1', 'burbuja-2', 'burbuja-3']
  }
];

class InventarioPetcare extends HTMLElement {
  connectedCallback() {
    if (this.childElementCount) return;
    this.classList.add('care-kit');
    const actividad = this.getAttribute('actividad') || 'bano';
    const familias = { bano: herramientasDeBano, comida: familiasDeComida, juego: juguetesDePetcare };
    for (const item of familias[actividad]) {
      const row = document.createElement('section');
      const copy = document.createElement('div');
      const heading = document.createElement('h3');
      const use = document.createElement('p');
      heading.textContent = item.title + ' · ' + item.family;
      use.textContent = item.use;
      const status = document.createElement('small');
      status.className = 'care-art-note';
      status.textContent = 'Arte no final';
      copy.append(heading, use, status);
      const variants = document.createElement('ul');
      variants.setAttribute('aria-label', item.family);
      item.variants.forEach((name, index) => {
        const cell = document.createElement('li');
        const icon = document.createElement('img');
        const base = actividad === 'juego' ? 'objetos/' : '';
        const file = item.icons ? item.icons[index] : item.id + '-' + index;
        icon.src = 'recap-media/petcare/' + base + file + '.webp';
        icon.loading = 'lazy';
        icon.alt = '';
        const label = document.createElement('span');
        label.textContent = name;
        cell.append(icon, label);
        if (item.id === 'secado' && index === 1) {
          const clock = document.createElement('b');
          clock.textContent = '352 s';
          clock.setAttribute('aria-label', 'Ejemplo de espera restante, 352 segundos');
          cell.append(clock);
        }
        variants.append(cell);
      });
      row.append(copy, variants);
      this.append(row);
    }
  }
}
customElements.define('petcare-inventario', InventarioPetcare);
customElements.define('petcare-bano', class extends InventarioPetcare {});
