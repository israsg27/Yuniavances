const recapPieces = [
  {"id":"jun-mueble-rig","month":"junio","theme":"Espacios","type":"Animación","title":"La animación del mueble","caption":"La captura de junio documenta los ensayos de movimiento de mobiliario junto con las acciones del personaje.","src":"recap-media/meses/jun-mueble.webp"},
  {"id": "mar-yunicoin", "month": "marzo", "theme": "Personaje", "type": "Concepto", "title": "Yunicoin, la primera moneda", "caption": "La propuesta da a la moneda una silueta hexagonal y una cara reconocible a escala de icono.", "src": "recap-media/archivo/mar-yunicoin.webp"},
  {"id": "may-coleccion", "month": "mayo", "theme": "Habitaciones", "type": "Modelado", "title": "La primera colección de muebles", "caption": "La vista de Blender reúne los objetos por familias. El registro de mayo cuenta alrededor de 60 muebles básicos con coordenadas de textura y un origen para colocarlos.", "src": "recap-media/archivo/may-coleccion.webp"},
  {"id": "jun-personalidad", "month": "junio", "theme": "Personaje", "type": "Interfaz", "title": "Un icono para cada rasgo", "caption": "Energía, curiosidad, lealtad y otros rasgos se probaron con pequeñas siluetas que caben junto al nombre.", "src": "recap-media/archivo/jun-personalidad.webp"},
  {"id": "jun-tienda-prototipo", "month": "junio", "theme": "Tienda", "type": "Prototipo", "title": "Cómo se recorría la tienda", "caption": "Las pantallas del prototipo de tienda en HTML ensayan el paso del catálogo a la ficha de un objeto.", "src": "recap-media/archivo/jun-tienda-prototipo.webp"},
  {"id": "jul-escalada", "month": "julio", "theme": "Minijuegos", "type": "Interfaz", "title": "Una partida de escalada", "caption": "Las pantallas de la demo muestran la pared de agarres, la progresión y el resultado de la partida.", "src": "recap-media/archivo/jul-escalada.webp"},
  {"id": "jul-globos-piezas", "month": "julio", "theme": "Minijuegos", "type": "Interfaz", "title": "Las pantallas del juego de globos", "caption": "La exploración reúne el tablero, las instrucciones, el marcador y distintas versiones de la interfaz.", "src": "recap-media/archivo/jul-globos-piezas.webp"},
  {"id": "ago-herramienta", "month": "agosto", "theme": "Personaje", "type": "Prueba de material", "title": "Pruebas de color del personaje", "caption": "Varias mascotas comparten escena para comparar la lectura de sus marcas y colores. El registro del mes también describe el desarrollo de un complemento de Blender para armar personajes.", "src": "recap-media/archivo/ago-herramienta.webp"},
  {"id": "ago-camara", "month": "agosto", "theme": "Pesca", "type": "Interfaz", "title": "Las islas en el mapa de pesca", "caption": "La propuesta de navegación distingue los destinos que se pueden visitar de los que todavía están bloqueados.", "src": "recap-media/archivo/ago-camara.webp"},
{"id":"sep-dino","month":"septiembre","theme":"Vestuario","type":"Modelado","title":"El disfraz de dinosaurio","caption":"El tocado rodea la cabeza y continúa por la espalda. La prueba permite ver la silueta del conjunto sobre el modelo.","src":"recap-media/meses/sep-dinosaurio.webp"},
{"id":"sep-boina","month":"septiembre","theme":"Vestuario","type":"Modelado","title":"Vestido de flores y boina","caption":"La boina verde y el vestido estampado forman otra de las propuestas de vestuario de septiembre.","src":"recap-media/meses/sep-boina.webp"},
  {
    "id": "feb-doc",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Las primeras cabezas",
    "caption": "La misma cabeza se estudió desde varios ángulos para comparar perfiles, volúmenes y proporciones.",
    "src": "recap-media/feb-doc.webp"
  },
  {
    "id": "feb-cuerpo",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "El primer cuerpo",
    "caption": "Dos versiones de la base muestran la relación inicial entre cabeza, tronco y extremidades.",
    "src": "recap-media/archivo/feb-cuerpo.webp"
  },
  {
    "id": "feb-proporciones",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Estudio",
    "title": "Una escala para la familia",
    "caption": "Las guías superpuestas a las siluetas permiten comparar el tamaño de los personajes.",
    "src": "recap-media/archivo/feb-proporciones.webp"
  },
  {
    "id": "feb-yunit",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Yunit en febrero",
    "caption": "Una de las primeras versiones de Yunit conserva el cuerpo sencillo y la cabeza de bordes suaves.",
    "src": "recap-media/archivo/feb-yunit.webp"
  },
  {
    "id": "feb-ojos",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Arte 2D",
    "title": "Un rostro en pocas líneas",
    "caption": "Las pruebas dibujadas exploran qué cambia en la expresión al variar párpado, pupila y dirección de la mirada.",
    "src": "recap-media/archivo/feb-ojos.webp"
  },
  {
    "id": "feb-expresiones",
    "month": "febrero",
    "theme": "Personaje",
    "type": "Arte 2D",
    "title": "Marcas de expresión",
    "caption": "El vocabulario gráfico prueba bocas, cejas y acentos que funcionan como adhesivos sobre la cara.",
    "src": "recap-media/archivo/feb-expresiones.webp"
  },
  {
    "id": "mar-doc",
    "month": "marzo",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Variantes sobre la base",
    "caption": "Una vista de trabajo reúne los modelos y las piezas que dieron paso a la personalización modular.",
    "src": "recap-media/mar-doc.webp"
  },
  {
    "id": "mar-modular",
    "month": "marzo",
    "theme": "Personaje",
    "type": "Concepto",
    "title": "El personaje por piezas",
    "caption": "El dibujo estudia la base de la mascota y la posición de los elementos que podrían cambiarse.",
    "src": "recap-media/archivo/mar-modular.webp"
  },
  {
    "id": "mar-mapas",
    "month": "marzo",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "Color por regiones",
    "caption": "La máscara RGB marca zonas independientes de una textura para probar combinaciones sobre el mismo modelo.",
    "src": "recap-media/archivo/mar-mapas.webp"
  },
  {
    "id": "mar-ux",
    "month": "marzo",
    "theme": "Personaje",
    "type": "Interfaz",
    "title": "El primer personalizador",
    "caption": "Las opciones para elegir piezas y colores empezaron a ordenarse en un recorrido para el jugador.",
    "src": "recap-media/archivo/mar-ux.webp"
  },
  {
    "id": "mar-orejas",
    "month": "marzo",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "Una oreja articulada",
    "caption": "La cadena de huesos ayuda a estudiar qué partes de la oreja se deforman al moverla.",
    "src": "recap-media/archivo/mar-orejas.webp"
  },
  {
    "id": "mar-ropa",
    "month": "marzo",
    "theme": "Vestuario",
    "type": "Concepto",
    "title": "Una primera prenda",
    "caption": "El mismo conjunto se dibujó de frente y de espaldas para estudiar cómo envuelve la silueta.",
    "src": "recap-media/archivo/mar-ropa.webp"
  },
  {
    "id": "mar-escala",
    "month": "marzo",
    "theme": "Espacios",
    "type": "Concepto",
    "title": "La escala del cuarto",
    "caption": "El croquis isométrico compara el tamaño de un mueble, el personaje y las unidades de la habitación.",
    "src": "recap-media/archivo/mar-escala.webp"
  },
  {
    "id": "abr-orejas",
    "month": "abril",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Orejas intercambiables",
    "caption": "Variantes de oreja preparadas para combinarse con el cuerpo principal.",
    "src": "recap-media/abr-orejas.webp"
  },
  {
    "id": "abr-hocicos",
    "month": "abril",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Hocicos y narices",
    "caption": "La lámina compara perfiles y volúmenes de piezas faciales en la exploración de razas.",
    "src": "recap-media/abr-hocicos.webp"
  },
  {
    "id": "abr-colas",
    "month": "abril",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "Una cola para cada silueta",
    "caption": "La vista de espalda permite comparar cómo cambia el contorno del personaje con distintas colas.",
    "src": "recap-media/archivo/abr-colas.webp"
  },
  {
    "id": "abr-ojos",
    "month": "abril",
    "theme": "Personaje",
    "type": "Arte 2D",
    "title": "La biblioteca de ojos",
    "caption": "Una colección de diseños prueba formas, brillos y lecturas diferentes para la mirada.",
    "src": "recap-media/archivo/abr-ojos.webp"
  },
  {
    "id": "abr-razas",
    "month": "abril",
    "theme": "Personaje",
    "type": "Estudio",
    "title": "Rasgos de raza",
    "caption": "El equipo confrontó referencias y pruebas del personaje para estudiar rasgos difíciles de representar.",
    "src": "recap-media/archivo/abr-razas.webp"
  },
  {
    "id": "abr-forma",
    "month": "abril",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "La forma de la cabeza",
    "caption": "La base de trabajo se usó para explorar deformaciones que conservan los puntos de encaje.",
    "src": "recap-media/archivo/abr-forma.webp"
  },
  {
    "id": "abr-prendas",
    "month": "abril",
    "theme": "Vestuario",
    "type": "Concepto",
    "title": "Dos direcciones de vestuario",
    "caption": "La exploración compara cómo se leen una gorra y un vestido sobre las proporciones del Yunipet.",
    "src": "recap-media/archivo/abr-prendas.webp"
  },
  {
    "id": "may-doc",
    "month": "mayo",
    "theme": "Espacios",
    "type": "Escena 3D",
    "title": "El primer cuarto modular",
    "caption": "El primer montaje pone a prueba el piso, las paredes y la colocación de mobiliario sobre una cuadrícula.",
    "src": "recap-media/may-doc.webp"
  },
  {
    "id": "may-editor",
    "month": "mayo",
    "theme": "Espacios",
    "type": "Interfaz",
    "title": "Editar una habitación",
    "caption": "Las pantallas exploran cómo seleccionar una pieza, moverla y revisar opciones de edición.",
    "src": "recap-media/archivo/may-editor.webp"
  },
  {
    "id": "may-muebles",
    "month": "mayo",
    "theme": "Espacios",
    "type": "Concepto",
    "title": "Un mueble desde el boceto",
    "caption": "El dibujo de un mueble especial documenta la exploración previa al modelado.",
    "src": "recap-media/archivo/may-muebles.webp"
  },
  {
    "id": "may-cabeza",
    "month": "mayo",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "La base del cuerpo",
    "caption": "El volumen de cuerpo y cabeza sirve de base para la topología destinada al rig y las texturas.",
    "src": "recap-media/archivo/may-cabeza.webp"
  },
  {
    "id": "may-pesos",
    "month": "mayo",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "La malla del personaje",
    "caption": "Dos vistas hacen visible cómo se distribuye la geometría alrededor de las articulaciones.",
    "src": "recap-media/archivo/may-pesos.webp"
  },
  {
    "id": "may-texturas",
    "month": "mayo",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "Patrones RGB del pelaje",
    "caption": "Los canales de color delimitan regiones que pueden recibir distintas combinaciones sobre el mismo cuerpo.",
    "src": "recap-media/archivo/may-texturas.webp"
  },
  {
    "id": "may-patron",
    "month": "mayo",
    "theme": "Personaje",
    "type": "Estudio",
    "title": "Patrones en las orejas",
    "caption": "El esquema explora qué zonas de las orejas admiten una variación de color.",
    "src": "recap-media/archivo/may-patron.webp"
  },
  {
    "id": "jun-anim",
    "month": "junio",
    "theme": "Juego",
    "type": "Animación",
    "title": "Movimiento y mobiliario",
    "caption": "Fotograma de las pruebas de interacción del personaje con un mueble.",
    "src": "recap-media/jun-anim.webp"
  },
  {
    "id": "jun-mov",
    "month": "junio",
    "theme": "Personaje",
    "type": "Animación",
    "title": "Una pose en producción",
    "caption": "Vista de trabajo del modelo articulado durante el desarrollo de movimientos generales.",
    "src": "recap-media/archivo/jun-mov.webp"
  },
  {
    "id": "jun-objetos",
    "month": "junio",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "El recorrido de la tienda",
    "caption": "La secuencia organiza el paso de explorar el catálogo a ver un objeto antes de elegirlo.",
    "src": "recap-media/archivo/jun-objetos.webp"
  },
  {
    "id": "jun-tienda",
    "month": "junio",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Componer la tienda",
    "caption": "La vista de modelado estudia la construcción del local que después se integraría en Unity.",
    "src": "recap-media/archivo/jun-tienda.webp"
  },
  {
    "id": "jun-tienda-modelo",
    "month": "junio",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Distribución interior",
    "caption": "Una maqueta sin acabados permite revisar cómo se agrupan los objetos en el interior de la tienda.",
    "src": "recap-media/archivo/jun-tienda-modelo.webp"
  },
  {
    "id": "jun-creador",
    "month": "junio",
    "theme": "Personaje",
    "type": "Interfaz",
    "title": "Editor para la demo",
    "caption": "Una propuesta de interfaz sitúa las opciones de personalización junto a la vista del personaje.",
    "src": "recap-media/archivo/jun-creador.webp"
  },
  {
    "id": "jun-muebles",
    "month": "junio",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Piezas de una colección",
    "caption": "El conjunto agrupa objetos por familia para preparar su uso en distintos cuartos.",
    "src": "recap-media/archivo/jun-muebles.webp"
  },
  {
    "id": "jul-doc",
    "month": "julio",
    "theme": "Espacios",
    "type": "Escena 3D",
    "title": "La tienda ortográfica",
    "caption": "Vista del modelo que el registro de julio documenta como integrado en una escena de Unity.",
    "src": "recap-media/jul-doc.webp"
  },
  {
    "id": "jul-tienda-luz",
    "month": "julio",
    "theme": "Espacios",
    "type": "Prueba visual",
    "title": "Luz y materiales del local",
    "caption": "La prueba de iluminación muestra el efecto de los acabados sobre el volumen y la lectura del edificio.",
    "src": "recap-media/archivo/jul-tienda-luz.webp"
  },
  {
    "id": "jul-globos",
    "month": "julio",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "El minijuego de globos",
    "caption": "Propuesta visual con área de juego, globo y marcador para explorar cómo leer el objetivo en pantalla.",
    "src": "recap-media/archivo/jul-globos.webp"
  },
  {
    "id": "jul-arcade",
    "month": "julio",
    "theme": "Juego",
    "type": "Concepto",
    "title": "El menú del arcade",
    "caption": "La máquina recreativa se exploró como un objeto del mundo desde el que elegir una actividad.",
    "src": "recap-media/archivo/jul-arcade.webp"
  },
  {
    "id": "jul-materiales",
    "month": "julio",
    "theme": "Espacios",
    "type": "Prueba técnica",
    "title": "Muestras de materiales",
    "caption": "Una serie de esferas permite revisar y comparar los materiales preparados para vestir la demo.",
    "src": "recap-media/archivo/jul-materiales.webp"
  },
  {
    "id": "jul-iconos",
    "month": "julio",
    "theme": "Juego",
    "type": "Arte 2D",
    "title": "Objetos en formato icono",
    "caption": "La hoja muestra cómo se convierte el contenido del juego en piezas pequeñas que se distinguen en un menú.",
    "src": "recap-media/archivo/jul-iconos.webp"
  },
  {
    "id": "ago-pesca",
    "month": "agosto",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "El álbum de pesca",
    "caption": "La ficha de Costilla reúne ilustración, rareza y registro de colección en una doble página.",
    "src": "recap-media/ago-pesca.webp"
  },
  {
    "id": "ago-peces",
    "month": "agosto",
    "theme": "Juego",
    "type": "Arte 2D",
    "title": "El color de los peces",
    "caption": "Una exploración de siluetas y paletas busca que los peces pertenezcan al mismo universo que las mascotas.",
    "src": "recap-media/archivo/ago-peces.webp"
  },
  {
    "id": "ago-pez-panel",
    "month": "agosto",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "Colecciones por entorno",
    "caption": "Los paneles agrupan especies y variantes para estudiar cómo ordenar el contenido de pesca.",
    "src": "recap-media/archivo/ago-pez-panel.webp"
  },
  {
    "id": "ago-doc",
    "month": "agosto",
    "theme": "Vestuario",
    "type": "Modelado",
    "title": "Vestir la misma base",
    "caption": "Primeros modelos de prendas con geometría y pesos, mostrados sobre el personaje.",
    "src": "recap-media/ago-doc.webp"
  },
  {
    "id": "ago-arcade",
    "month": "agosto",
    "theme": "Juego",
    "type": "Escena 3D",
    "title": "La sala de arcade",
    "caption": "La escena se construyó a partir de los conceptos y aprovechó piezas que el equipo ya había producido.",
    "src": "recap-media/archivo/ago-arcade.webp"
  },
  {
    "id": "ago-plantas",
    "month": "agosto",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Primeras plantas",
    "caption": "La colección de modelos permite revisar siluetas y tamaños antes de poblar un escenario.",
    "src": "recap-media/archivo/ago-plantas.webp"
  },
  {
    "id": "ago-ojos",
    "month": "agosto",
    "theme": "Personaje",
    "type": "Prueba técnica",
    "title": "El atlas en producción",
    "caption": "La vista de trabajo documenta el sistema RGB y la organización de los ojos para el personaje.",
    "src": "recap-media/archivo/ago-ojos.webp"
  },
  {
    "id": "sep-ropa",
    "month": "septiembre",
    "theme": "Vestuario",
    "type": "Modelado",
    "title": "El conjunto de kimono",
    "caption": "Una de las propuestas de vestuario se presenta sobre el cuerpo para revisar ajuste y silueta.",
    "src": "recap-media/sep-ropa.webp"
  },
  {
    "id": "sep-cuartos",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Escena 3D",
    "title": "Variantes de habitación",
    "caption": "El equipo documentó tres habitaciones modulares y las primeras piezas finales de pared y piso.",
    "src": "recap-media/sep-cuartos.webp"
  },
  {
    "id": "sep-doc",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Prueba visual",
    "title": "La luz del interior",
    "caption": "Prueba del ambiente del cuarto con mobiliario, sombras y materiales de la habitación.",
    "src": "recap-media/sep-doc.webp"
  },
  {
    "id": "sep-cielo-dia",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Prueba visual",
    "title": "El cielo en contexto",
    "caption": "Vista del cuarto para revisar cómo se percibe el fondo detrás del escenario.",
    "src": "recap-media/archivo/sep-cielo-dia.webp"
  },
  {
    "id": "sep-cielo-noche",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Arte 2D",
    "title": "Panorama del cielo",
    "caption": "El fondo panorámico muestra el paisaje que el sistema puede mover en capas dentro de Unity.",
    "src": "recap-media/archivo/sep-cielo-noche.webp"
  },
  {
    "id": "sep-capas",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Prueba técnica",
    "title": "Una capa del fondo",
    "caption": "Esta franja del paisaje ejemplifica la separación que permite ajustar escala, dirección y velocidad.",
    "src": "recap-media/archivo/sep-capas.webp"
  },
  {
    "id": "sep-puertas",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Interfaz",
    "title": "La navegación por puertas",
    "caption": "Vistas del edificio exploran cómo elegir una puerta y reconocer los espacios disponibles.",
    "src": "recap-media/archivo/sep-puertas.webp"
  },
  {
    "id": "sep-suelo",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Piezas de piso y pared",
    "caption": "La tira de trabajo permite revisar módulos repetibles y sus uniones.",
    "src": "recap-media/archivo/sep-suelo.webp"
  },
  {
    "id": "sep-muebles",
    "month": "septiembre",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Ajustes a las colecciones",
    "caption": "Las imágenes documentan la revisión de objetos y sus animaciones dentro de las colecciones.",
    "src": "recap-media/archivo/sep-muebles.webp"
  },
  {
    "id": "oct-doc",
    "month": "octubre",
    "theme": "Espacios",
    "type": "Prueba visual",
    "title": "Un cuarto, varios acabados",
    "caption": "El montaje combina estilos de mobiliario, paredes y piso para revisar el resultado en una habitación.",
    "src": "recap-media/oct-doc.webp"
  },
  {
    "id": "oct-color",
    "month": "octubre",
    "theme": "Espacios",
    "type": "Prueba visual",
    "title": "La versión de tonos neutros",
    "caption": "Otra prueba del mismo conjunto facilita comparar el efecto de un cambio de material y color.",
    "src": "recap-media/archivo/oct-color.webp"
  },
  {
    "id": "oct-doc2",
    "month": "octubre",
    "theme": "Espacios",
    "type": "Escena 3D",
    "title": "La colección en escena",
    "caption": "Los muebles se desplegaron en una misma escena para revisar el catálogo de acabados.",
    "src": "recap-media/oct-doc2.webp"
  },
  {
    "id": "oct-shader",
    "month": "octubre",
    "theme": "Espacios",
    "type": "Prueba técnica",
    "title": "Controles del material maestro",
    "caption": "El material concentra los controles de estilo para modificar color, textura y acabado de los muebles.",
    "src": "recap-media/archivo/oct-shader.webp"
  },
  {
    "id": "oct-geometria",
    "month": "octubre",
    "theme": "Espacios",
    "type": "Modelado",
    "title": "Nuevo mobiliario en bloque",
    "caption": "El registro muestra piezas nuevas en geometría base, todavía pendientes de ajuste de tamaño.",
    "src": "recap-media/archivo/oct-geometria.webp"
  },
  {
    "id": "oct-pelaje",
    "month": "octubre",
    "theme": "Personaje",
    "type": "Prueba visual",
    "title": "Nuevas texturas del personaje",
    "caption": "El render permite observar cómo se leen las marcas y la textura sobre el rostro.",
    "src": "recap-media/archivo/oct-pelaje.webp"
  },
  {
    "id": "oct-hocico",
    "month": "octubre",
    "theme": "Personaje",
    "type": "Modelado",
    "title": "El hocico del gato",
    "caption": "Vista de prueba de las nuevas formas de hocico sobre una cabeza de personaje.",
    "src": "recap-media/archivo/oct-hocico.webp"
  },
  {
    "id": "oct-petcare",
    "month": "octubre",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "La pantalla de PetCare",
    "caption": "El diseño organiza baño, alimentación y juego alrededor de la mascota, con los objetos de cuidado al alcance.",
    "src": "recap-media/oct-petcare.webp"
  },
  {
    "id": "oct-cuidado",
    "month": "octubre",
    "theme": "Juego",
    "type": "Arte 2D",
    "title": "El icono de la toalla",
    "caption": "El objeto se reconoce por su silueta enrollada y por la banda con huella del universo Yunipets.",
    "src": "recap-media/archivo/oct-cuidado.webp"
  },
  {
    "id": "atlas",
    "month": "archivo",
    "theme": "Personaje",
    "type": "Atlas",
    "title": "25 expresiones del Yunipet",
    "caption": "La lámina de la biblioteca Ojos reúne 25 vistas del mismo personaje. Cada celda cambia la expresión.",
    "src": "recap-media/archivo/atlas.webp"
  },
  {
    "id": "cuidado-accion",
    "month": "archivo",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "Una acción de baño",
    "caption": "El diseño de PetCare muestra cómo se presenta una herramienta de cuidado junto a la mascota.",
    "src": "recap-media/archivo/cuidado-accion.webp"
  },
  {
    "id": "flujo-habitacion",
    "month": "archivo",
    "theme": "Espacios",
    "type": "Interfaz",
    "title": "El edificio de habitaciones",
    "caption": "El flujo de creación de cuarto usa puertas, colores e iconos para identificar cada espacio.",
    "src": "recap-media/archivo/flujo-habitacion.webp"
  },
  {
    "id": "pesca-mapa",
    "month": "archivo",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "El mapa de pesca",
    "caption": "La propuesta organiza los destinos en islas y distingue las zonas accesibles y las bloqueadas.",
    "src": "recap-media/archivo/pesca-mapa.webp"
  },
  {
    "id": "pesca-jurasico",
    "month": "archivo",
    "theme": "Juego",
    "type": "Interfaz",
    "title": "Costilla, de cerca",
    "caption": "La ficha de la colección El Jurásico reúne la ilustración del pez y su descripción.",
    "src": "recap-media/archivo/pesca-jurasico.webp"
  },
  {
    "id": "texturas-ropa",
    "month": "archivo",
    "theme": "Vestuario",
    "type": "Muestrario",
    "title": "El archivo de prendas",
    "caption": "La lámina de agosto a octubre reúne diseños de camisetas, vestidos, gorras y calzado. El conteo de exportaciones aún requería depurar variantes.",
    "src": "recap-media/archivo/texturas-ropa.webp"
  }
];

const recapStories = [
  {
    "key": "personaje",
    "name": "Personaje",
    "title": "De una cabeza de prueba a una mascota modular",
    "intro": "La personalización empezó con una decisión de forma. Después llegaron los puntos de encaje, las piezas intercambiables y la mirada.",
    "steps": [
      [
        "feb-doc",
        "Encontrar la silueta",
        "Las primeras cabezas se compararon de perfil y de frente. Ese estudio fijó una base reconocible antes de separar las piezas."
      ],
      [
        "abr-orejas",
        "Cambiar las piezas",
        "Orejas, hocicos y colas recibieron puntos de unión propios. Una misma base pudo sostener siluetas de razas distintas."
      ],
      [
        "may-pesos",
        "Preparar el movimiento",
        "La distribución de la malla se ajustó para deformar el cuerpo durante la animación y conservar sus proporciones."
      ],
      [
        "oct-hocico",
        "Refinar el rostro",
        "En octubre las pruebas se concentraron en nuevas texturas y hocicos de gato sobre el personaje construido durante el año."
      ]
    ]
  },
  {
    "key": "cuartos",
    "name": "Habitaciones",
    "title": "Cómo se construye un cuarto",
    "intro": "El espacio pasó de un esquema de escala a un sistema de módulos que admite muebles, luces y acabados distintos.",
    "steps": [
      [
        "mar-escala",
        "Escala y cuadrícula",
        "Un croquis puso al personaje, un mueble y las medidas del cuarto en la misma referencia."
      ],
      [
        "may-doc",
        "La primera habitación",
        "El primer cuarto probó piezas de piso y pared y puntos de origen para colocar mobiliario."
      ],
      [
        "sep-cuartos",
        "Tres habitaciones",
        "En septiembre se documentaron tres cuartos modulares y las primeras piezas finales para pisos y paredes."
      ],
      [
        "oct-doc",
        "Cambiar el acabado",
        "Un material maestro permitió variar la apariencia de los muebles. La mayoría de las piezas básicas recibió seis estilos."
      ]
    ]
  },
  {
    "key": "tienda",
    "name": "Tienda",
    "title": "Una tienda que pasó del diseño al motor",
    "intro": "La producción siguió dos recorridos a la vez: qué iba a hacer el jugador y cómo debía verse el lugar en el que lo haría.",
    "steps": [
      [
        "jun-objetos",
        "Recorrer el catálogo",
        "La primera secuencia UX conectó la navegación por objetos con una vista previa para la demo."
      ],
      [
        "jun-tienda",
        "Construir el local",
        "El equipo exploró distribuciones y llevó las elegidas al modelado, con UV, color base y animaciones."
      ],
      [
        "jul-tienda-luz",
        "Revisar luz y materiales",
        "Las pruebas del local evaluaron el cristal, los materiales y los elementos iluminados."
      ],
      [
        "jul-doc",
        "Integrar en Unity",
        "El recap de julio registra la integración de la tienda ortográfica en una escena de Unity. Los personajes finales seguían pendientes en ese montaje."
      ]
    ]
  },
  {
    "key": "pesca",
    "name": "Pesca",
    "title": "De una colección de peces a un álbum",
    "intro": "La identidad de cada pez se trabajó junto con la manera de descubrirlo y reconocerlo en una colección.",
    "steps": [
      [
        "ago-peces",
        "Definir las especies",
        "El equipo exploró siluetas y colores e incorporó el lenguaje de ojos del Yunipet para mantener la identidad del juego."
      ],
      [
        "ago-pez-panel",
        "Ordenar colecciones",
        "Los paneles de descubrimiento agruparon variantes por entorno para ensayar cómo se leería un catálogo más grande."
      ],
      [
        "ago-pesca",
        "Abrir el álbum",
        "Una doble página reúne los peces descubiertos y el detalle de la especie seleccionada. La propuesta documenta el diseño de la interfaz."
      ]
    ]
  },
  {
    "key": "ropa",
    "name": "Vestuario",
    "title": "Del dibujo al conjunto que viste la mascota",
    "intro": "Vestir al Yunipet exigió conservar su silueta y preparar cada prenda para acompañar el movimiento del cuerpo.",
    "steps": [
      [
        "mar-ropa",
        "Dibujar frente y espalda",
        "Los primeros bocetos comprobaron cómo se envolvería una prenda alrededor del cuerpo antes de modelarla."
      ],
      [
        "abr-prendas",
        "Comparar conjuntos",
        "Gorras, uniformes y vestidos se probaron como direcciones visuales sobre mascotas con proporciones conocidas."
      ],
      [
        "ago-doc",
        "Preparar los modelos",
        "Los primeros modelos de ropa incorporaron geometría y pesos para seguir la deformación del personaje."
      ],
      [
        "sep-ropa",
        "Completar ocho conjuntos",
        "El equipo documentó seis conjuntos principales y dos extra con modelado, UV y pesos, listos para texturizar y probar en Unity."
      ]
    ]
  }
];

const recapFeatures = {
  "febrero": [
    [
      "Forma",
      "Las cabezas se probaron desde varios ángulos antes de cerrar una silueta. El primer cuerpo sirvió para comparar el tamaño de la cabeza y las extremidades.",
      "feb-doc"
    ],
    [
      "Rostro",
      "El equipo dibujó ojos, bocas y marcas de expresión pensando en una mascota con el acabado de un juguete. Una misma base podía comunicar emociones distintas.",
      "feb-ojos"
    ],
    [
      "Proporciones",
      "Las guías de escala y las primeras versiones de Yunit pusieron una referencia común a las pruebas de volumen.",
      "feb-proporciones"
    ]
  ],
  "marzo": [
    [
      "Personalización",
      "El primer sistema modular combinaba cambios de forma con elementos dibujados. El recorrido de interfaz ya contemplaba elegir los rasgos de un Yunipet.",
      "mar-ux"
    ],
    [
      "Color",
      "Las pruebas RGB asignaron zonas de color dentro de una textura. Eso permitía ensayar variantes sobre la misma geometría.",
      "mar-mapas"
    ],
    [
      "Escala y accesorios",
      "Se hicieron primeras pruebas de orejas articuladas y bocetos de ropa. En paralelo, una cuadrícula ayudó a dimensionar el espacio que ocuparía la mascota en un cuarto.",
      "mar-escala"
    ]
  ],
  "abril": [
    [
      "Puntos de encaje",
      "Orejas, hocicos, narices y colas se produjeron como piezas con un origen y una unión definidos. El sistema de cabeza conservaba zonas seguras para combinarlas.",
      "abr-hocicos"
    ],
    [
      "Movimiento",
      "Se exploraron orejas erguidas, caídas y dobladas. La cola recibió pruebas de articulación y el equipo revisó cómo colorear las orejas junto con el cuerpo.",
      "abr-colas"
    ],
    [
      "Vestuario y rostro",
      "Las propuestas de ropa definieron tipos de prenda mientras las exploraciones de ojos ensayaban cambios de color y forma del brillo.",
      "abr-prendas"
    ]
  ],
  "mayo": [
    [
      "Construcción del cuarto",
      "El primer cuarto de prueba reunió módulos de piso, pared y muebles. Cada objeto necesitaba un origen consistente para colocarse en la cuadrícula.",
      "may-doc"
    ],
    [
      "Edición del espacio",
      "El flujo visual del editor contempló rotar, cambiar el estilo, eliminar y reparar un objeto. El equipo preparó alrededor de 60 muebles básicos con UV y origen definido.",
      "may-editor"
    ],
    [
      "Base del personaje",
      "Cuerpo y cabeza llegaron a su topología final para rig y texturas. Se ajustaron cortes para deformar las articulaciones y se prepararon unas diez texturas RGB.",
      "may-pesos"
    ]
  ],
  "junio": [
    [
      "Acciones reutilizables",
      "Dormir, sentarse y agarrar se produjeron como movimientos reutilizables. Para los muebles se definieron estructuras de animación y se trabajaron acciones al toque y en bucle.",
      "jun-anim"
    ],
    [
      "Tienda para la demo",
      "El flujo UX resolvió cómo explorar y previsualizar objetos. En modelado se exploraron cuatro distribuciones y se desarrollaron dos tiendas con sus colores base.",
      "jun-tienda-modelo"
    ],
    [
      "Más mobiliario",
      "El registro recoge otros 60 muebles con UV, geometría revisada y puntos de origen. Los puntos de apoyo permitían colocar objetos encima de otros.",
      "jun-muebles"
    ]
  ],
  "julio": [
    [
      "La tienda dentro del motor",
      "Se terminó el modelado de la tienda ortográfica con sus animaciones y se integró en una escena de Unity. El montaje de ese mes aún esperaba los Yunipets finales.",
      "jul-doc"
    ],
    [
      "Materiales para la demo",
      "La producción incluyó al menos diez shaders sin iluminación calculada y distintos materiales para paredes, pisos y objetos. En la tienda se probaron cristal y luces intermitentes.",
      "jul-materiales"
    ],
    [
      "Actividades del arcade",
      "Se exploraron interfaces y recursos para los minijuegos de globos y escalada. Una máquina recreativa llevó la selección de juegos al mundo del personaje.",
      "jul-arcade"
    ]
  ],
  "agosto": [
    [
      "Coleccionar peces",
      "Los ojos del Yunipet sirvieron de base para diseñar los peces. La exploración de pesca reunió propuestas de cámara y un álbum para consultar las especies.",
      "ago-pesca"
    ],
    [
      "Vestir al personaje",
      "Las colecciones empezaron a organizarse para producción. Las primeras prendas 3D incorporaron geometría y pesos adecuados al cuerpo de la mascota.",
      "ago-doc"
    ],
    [
      "Ojos y escenarios",
      "Se definió el sistema RGB de ojos y su atlas sobre la malla. El equipo también montó una escena de arcade con recursos existentes y modeló las primeras plantas.",
      "ago-arcade"
    ]
  ],
  "septiembre": [
    [
      "Ocho conjuntos",
      "Seis conjuntos principales y dos adicionales quedaron con modelado, UV y pesos. Su siguiente validación consistía en texturizarlos y probar su comportamiento en Unity.",
      "sep-ropa"
    ],
    [
      "Tres habitaciones",
      "Se construyeron tres habitaciones con módulos de piso y pared. El flujo de puertas exploró cómo identificar espacios por color e icono en un edificio de varios pisos.",
      "sep-puertas"
    ],
    [
      "Cuatro cielos",
      "Un shader de Unity permitió mover las capas del fondo de forma independiente. El equipo registró dos cielos diurnos y dos nocturnos y probó también luces y sombras interiores.",
      "sep-capas"
    ]
  ],
  "octubre": [
    [
      "Acabados de mobiliario",
      "Los grupos de vértices distinguen material, sombras y bordes. Un material maestro usa esas regiones para variar color y textura. La mayoría de las piezas básicas recibió seis estilos.",
      "oct-color"
    ],
    [
      "Pruebas de habitación",
      "El equipo combinó muebles y texturas de pisos y paredes para probar espacios completos. El nuevo lote de muebles básicos estaba en geometría y pendiente de ajustar tamaños.",
      "oct-doc2"
    ],
    [
      "Rostro y cuidados",
      "Las nuevas texturas y pruebas de hocicos de gato conviven en el recap con la interfaz PetCare. El diseño reúne comida, baño y juego alrededor del personaje.",
      "oct-petcare"
    ]
  ]
};

