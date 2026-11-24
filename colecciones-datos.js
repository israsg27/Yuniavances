'use strict';

const colecciones = {
  "primeras": {
    "tab": "Siluetas",
    "title": "La silueta antes del rostro",
    "copy": "Las primeras diez vistas de Yunit muestran cómo cambiaban el hocico, las mejillas y las orejas.",
    "proof": "feb-doc",
    "credit": "Lámina original · febrero",
    "names": [
      "Orejas cortas de perfil",
      "Orejas caídas de frente",
      "Hocico en tres cuartos",
      "Volumen sin orejas",
      "Perfil de punta corta",
      "Oreja larga de perfil",
      "Orejas altas en tres cuartos",
      "Orejas abiertas",
      "Mejillas estrechas",
      "Base ancha de frente"
    ]
  },
  "cabeza": {
    "tab": "Cabezas",
    "title": "Una base, once formas",
    "copy": "Compara la curva de las mejillas y el ancho de la mandíbula.",
    "proof": "mar-modular",
    "credit": "Unity · captura del componente",
    "names": [
      "Clásica",
      "Redonda I",
      "Redonda II",
      "Ancha I",
      "Ancha II",
      "Ancha III",
      "Hexagonal I",
      "Hexagonal II",
      "Hexagonal III",
      "Rectangular",
      "Corazón"
    ]
  },
  "orejas": {
    "tab": "Orejas",
    "title": "Veintiséis pares de orejas",
    "copy": "De las caídas a las erguidas, la unión se conserva y cambia la silueta. Compara los pares sobre la misma cabeza.",
    "proof": "abr-orejas",
    "credit": "Unity · captura del componente",
    "names": [
      "Caídas 01",
      "Caídas 02",
      "Caídas 03",
      "Caídas 04",
      "Dobladas 05",
      "Dobladas 06",
      "Dobladas 07",
      "Dobladas 08",
      "Erguidas 09",
      "Erguidas 10",
      "Erguidas 11",
      "Erguidas 12",
      "Erguidas 13",
      "Erguidas 14",
      "Erguidas 15",
      "Erguidas 16",
      "Erguidas 17",
      "Erguidas 18",
      "Erguidas 19",
      "Erguidas 20",
      "Erguidas 21",
      "Erguidas 22",
      "Erguidas 23",
      "Dobladas 24",
      "Erguidas 24",
      "Dobladas 25"
    ],
    "archiveIndices": [
      24,
      25,
      26
    ],
    "archiveCredit": "Blender · render para el recap"
  },
  "hocico": {
    "tab": "Hocicos",
    "title": "El rostro, visto de tres cuartos",
    "copy": "El perfil deja ver qué hocicos se proyectan hacia delante y cuáles se pegan a la cara.",
    "proof": "abr-hocicos",
    "credit": "Unity · captura del componente",
    "names": [
      "Felino 1",
      "Felino 2",
      "Felino 3",
      "Felino 4",
      "Clásico 01",
      "Clásico 02",
      "Clásico 03",
      "Clásico 04",
      "American bully",
      "Borzoi",
      "Bull terrier",
      "Teckel",
      "Dóberman",
      "Pequinés",
      "Shiba inu",
      "Chato",
      "Whippet"
    ],
    "archiveIndices": [
      4,
      7,
      8,
      12,
      16
    ],
    "archiveCredit": "Blender · render para el recap"
  },
  "nariz": {
    "tab": "Narices",
    "title": "El detalle de la trufa",
    "copy": "La cámara se acerca al extremo del hocico para comparar el ancho, la punta y el volumen de cada nariz.",
    "proof": "abr-hocicos",
    "credit": "Unity · captura del componente",
    "names": [
      "Trufa 01",
      "Trufa 02",
      "Trufa 03",
      "Trufa 04",
      "Trufa 05",
      "Trufa 06",
      "Trufa 07",
      "Trufa 08",
      "Trufa 09",
      "Trufa 10",
      "Trufa 11"
    ],
    "archiveIndices": [
      9,
      10,
      11
    ],
    "archiveCredit": "Blender · render para el recap"
  },
  "cola": {
    "tab": "Colas",
    "title": "Once formas de cola",
    "copy": "Compara la curva, el largo y el volumen de cada cola por separado.",
    "proof": "abr-colas",
    "credit": "Unity · captura del componente",
    "names": [
      "Rizada 01",
      "Rizada 02",
      "Larga 03",
      "Larga 04",
      "Larga 05",
      "Larga 06",
      "Larga 07",
      "Larga 08",
      "Larga 09",
      "Corta 10",
      "Corta 11"
    ]
  },
  "ensayo": {
    "tab": "En estudio",
    "title": "Orejas en exploración",
    "copy": "La colección de trabajo conserva pruebas de pliegue y proporción, entre ellas las variantes Basenji y Scottish Fold.",
    "proof": "abr-razas",
    "credit": "Blender · render para el recap",
    "names": [
      "Basenji",
      "Border Terrier",
      "Chihuahua",
      "Estudio 1",
      "Estudio 37",
      "Estudio 41",
      "Estudio 42",
      "Estudio 47",
      "Estudio 56",
      "Estudio 61",
      "Devon Rex",
      "Golden Retriever",
      "Russian Blue",
      "Scottish Fold",
      "Scottish Shorthair"
    ]
  },
  "muebles": {
    "tab": "Mobiliario",
    "title": "Objetos a escala del Yunipet",
    "copy": "La cama, la silla y el refrigerador proceden de la escena de Blender para probar interacciones. La colección de mayo fue más amplia y reunió unos 60 muebles básicos.",
    "proof": "may-coleccion",
    "credit": "Blender · render para el recap",
    "names": [
      "Cama",
      "Silla",
      "Refrigerador"
    ]
  },
  "posturas": {
    "tab": "Posturas",
    "title": "Del reposo al movimiento",
    "copy": "Cada vista congela un fotograma de una acción del esqueleto original. Compara dónde quedan las patas al tomar asiento, acostarse o alcanzar un objeto.",
    "proof": "jun-anim",
    "credit": "Blender · render para el recap",
    "names": [
      "De pie",
      "Al tomar asiento",
      "Sentado",
      "Al acostarse",
      "Dormido",
      "Al interactuar"
    ]
  },
  "arcade": {
    "tab": "Demo",
    "title": "De la tienda a la recreativa",
    "copy": "Recorre la escena que llegó a Unity y los diseños de las dos actividades de la demo.",
    "proof": "jul-doc",
    "credit": "Capturas y diseños · julio",
    "names": [
      "Luz y materiales del local",
      "La tienda ortográfica",
      "El menú del arcade",
      "Las pantallas del juego de globos",
      "Una partida de escalada",
      "Muestras de materiales"
    ]
  },
  "frente": {
    "tab": "Cejas y mechones",
    "title": "Rasgos que se leen a tamaño de icono",
    "copy": "En julio se prepararon renders para los iconos del juego. Aquí puedes comparar las piezas de la frente sobre el rostro antes de ver la plancha de producción.",
    "proof": "jul-iconos",
    "credit": "Unity · captura del componente",
    "names": [
      "Adorno 10",
      "Cejas 08",
      "Cejas 09",
      "Cejas 11",
      "Mechón 01",
      "Mechón 02",
      "Mechón 03",
      "Mechón 04",
      "Mechón 05",
      "Mechón 06",
      "Mechón 07"
    ],
    "archiveIndices": [
      4
    ],
    "archiveCredit": "Blender · render para el recap"
  },
  "ojos7": {
    "tab": "Atlas 7",
    "title": "Una cara, 25 miradas",
    "copy": "Cambia de celda para comparar la pupila, el párpado y el brillo sobre el mismo personaje.",
    "proof": "ago-ojos",
    "credit": "Unity · atlas 7",
    "names": [
      "De reojo",
      "Con picardía",
      "Pestañas",
      "Serena",
      "Ámbar",
      "Sorpresa",
      "Botón doble",
      "Alerta",
      "Medio sueño",
      "Felina",
      "Punto de luz",
      "Botón angular",
      "Astuta",
      "Curiosa",
      "Guiño",
      "Pupila ancha",
      "Brillo dorado",
      "Cuadrada",
      "Entornada",
      "Redonda",
      "Somnolienta",
      "Traviesa",
      "Rasgada",
      "Profunda",
      "Ojo de luna"
    ]
  },
  "ojos8": {
    "tab": "Atlas 8",
    "title": "Otras 25 expresiones",
    "copy": "Cambia de celda para comparar la pupila, el párpado y el brillo sobre el mismo personaje.",
    "proof": "ago-ojos",
    "credit": "Unity · atlas 8",
    "names": [
      "Párpado rosa",
      "Ámbar pequeña",
      "Doble destello",
      "Botón miel",
      "Luminosa",
      "Entrecerrada",
      "De lado",
      "Vertical",
      "Botón largo",
      "Destello estrella",
      "Atenta",
      "Calmada",
      "Ojo de sol",
      "Botón lateral",
      "Aro dorado",
      "Párpado bajo",
      "Óvalo dorado",
      "Dulce",
      "Brillo grande",
      "Ceja alzada",
      "Doble reflejo",
      "Párpado oblicuo",
      "Ojo de noche",
      "Sonriente",
      "Ovalada"
    ]
  },
  "entorno": {
    "tab": "Entorno",
    "title": "Plantas y piedras de la escena de prueba",
    "copy": "Tres plantas y cuatro rocas del archivo 3D permiten ver el volumen de las piezas. En agosto se estudiaron la escala de la vegetación y las primeras plantas.",
    "proof": "ago-plantas",
    "credit": "Blender · render para el recap",
    "names": [
      "Planta I",
      "Planta II",
      "Planta III",
      "Roca I",
      "Roca II",
      "Roca III",
      "Roca IV"
    ]
  },
  "conjuntos": {
    "tab": "Conjuntos",
    "title": "Ocho conjuntos sobre la misma mascota",
    "copy": "El registro de septiembre reúne seis conjuntos principales y dos extra. Estos renders muestran cómo se superponen las piezas sobre el cuerpo.",
    "proof": "sep-ropa",
    "credit": "Blender · render para el recap",
    "names": [
      "Diario",
      "Invierno",
      "Música",
      "Flores",
      "Kimono",
      "Guardia",
      "Dinosaurio",
      "Corona y capa"
    ]
  },
  "prenda": {
    "tab": "Prendas",
    "title": "Nueve prendas, corte por corte",
    "copy": "El cuello, las mangas y el bajo cambian con cada corte. El color de estudio ayuda a distinguir las piezas.",
    "proof": "sep-boina",
    "credit": "Blender · render para el recap",
    "names": [
      "Camiseta",
      "Sudadera",
      "Suéter",
      "Vestido básico",
      "Vestido con lazo",
      "Kimono",
      "Uniforme de guardia",
      "Suéter dinosaurio",
      "Capa"
    ]
  },
  "sombrero": {
    "tab": "Sombreros",
    "title": "De la gorra a la corona",
    "copy": "Algunas piezas dejan salir las orejas. Otras envuelven la cabeza y cambian todo el perfil.",
    "proof": "sep-dino",
    "credit": "Blender · render para el recap",
    "names": [
      "Gorra",
      "Gorro navideño",
      "Sombrero de verano",
      "Boina",
      "Diadema con lazo",
      "Tocado de guardia",
      "Capucha dinosaurio",
      "Corona"
    ]
  },
  "gafas": {
    "tab": "Gafas",
    "title": "Seis monturas y accesorios de rostro",
    "copy": "Compara el contorno de las lentes, la altura del puente y el parche sobre la misma cara.",
    "proof": "sep-ropa",
    "credit": "Blender · render para el recap",
    "names": [
      "Clásicas",
      "Montura II",
      "Parche",
      "Estrella",
      "Montura III",
      "Montura IV"
    ]
  },
  "espalda": {
    "tab": "Espalda",
    "title": "Lo que lleva a la espalda",
    "copy": "La cámara gira para mostrar mochilas, bolso e instrumento y cómo descansan sobre el cuerpo.",
    "proof": "sep-ropa",
    "credit": "Blender · render para el recap",
    "names": [
      "Mochila",
      "Bolso",
      "Guitarra",
      "Mochila de oso"
    ]
  },
  "manos": {
    "tab": "Muñecas",
    "title": "Guantes, pulseras y relojes",
    "copy": "Los pares se muestran puestos para ver cuánto cubre cada pieza alrededor de la pata.",
    "proof": "sep-ropa",
    "credit": "Blender · render para el recap",
    "names": [
      "Pulseras",
      "Guantes",
      "Relojes",
      "Guantes de cocina",
      "Pulseras con lazo",
      "Guantes de guardia"
    ]
  },
  "pies": {
    "tab": "Calzado",
    "title": "Siete formas de calzar al Yunipet",
    "copy": "Sandalias, botas y tobilleras se comparan desde un ángulo bajo que deja ver su contorno.",
    "proof": "sep-ropa",
    "credit": "Blender · render para el recap",
    "names": [
      "Tenis",
      "Botas",
      "Botas de invierno",
      "Tobilleras",
      "Sandalias",
      "Botas de guardia",
      "Zapato básico"
    ]
  },
  "acabados": {
    "tab": "Habitaciones",
    "title": "El mismo cuarto cambia de aspecto",
    "copy": "Las capturas de octubre enseñan cómo el material maestro cambia el ambiente y cómo se organizan sus controles.",
    "proof": "oct-shader",
    "credit": "Capturas de producción · octubre",
    "names": [
      "Un cuarto, varios acabados",
      "La versión de tonos neutros",
      "La colección en escena",
      "Nuevo mobiliario en bloque",
      "Controles del material maestro"
    ]
  },
  "pelaje": {
    "tab": "Pelajes",
    "title": "Veinticinco patrones, los mismos tres tonos",
    "copy": "Cada patrón usa el mapa de zonas del archivo de personaje. Mantenemos la paleta fija para que puedas seguir dónde cambian las rayas, las manchas o las rosetas.",
    "proof": "oct-pelaje",
    "credit": "Unity · captura del componente",
    "names": [
      "Manchas 01",
      "Rayas 02",
      "Rayas 03",
      "Rayas 04",
      "Rayas 05",
      "Rayas 06",
      "Atigrado 07",
      "Atigrado 08",
      "Mechones 09",
      "Mechones 10",
      "Mechones 11",
      "Rosetas 12",
      "Atigrado 13",
      "Manchas 14",
      "Atigrado 15",
      "Rayas 16",
      "Mechones 17",
      "Manchas 18",
      "Atigrado 19",
      "Manchas 20",
      "Manchas 21",
      "Manchas 22",
      "Manchas 23",
      "Atigrado 24",
      "Manchas 25"
    ]
  },
  "felinos": {
    "tab": "Hocicos felinos",
    "title": "Cuatro perfiles de gato",
    "copy": "El registro de octubre retoma el hocico felino. Esta selección de la biblioteca permite ver de cerca las cuatro formas.",
    "proof": "oct-hocico",
    "credit": "Unity · captura del componente",
    "names": [
      "Felino 1",
      "Felino 2",
      "Felino 3",
      "Felino 4"
    ],
    "archiveIndices": [
      4
    ],
    "archiveCredit": "Blender · render para el recap"
  },
  "dibujos": {
    "tab": "Yunit",
    "title": "El personaje del 22 de febrero",
    "copy": "Los dibujos de ojos y expresiones acompañan a dos referencias de la primera etapa: la escala del cuerpo y el primer Yunit fechado.",
    "credit": "Láminas originales · febrero",
    "proof": "feb-yunit",
    "names": [
      "Yunit en febrero",
      "El primer cuerpo",
      "Una escala para la familia",
      "Un rostro en pocas líneas",
      "Marcas de expresión"
    ]
  },
  "primeros": {
    "tab": "Primeros diseños",
    "title": "Del selector de rasgos a Yunicoin",
    "copy": "El primer recorrido de personalización convivió con el diseño de la moneda, las propuestas de ropa y las pruebas de escala para el cuarto.",
    "credit": "Láminas originales · marzo",
    "proof": "mar-ux",
    "names": [
      "El primer personalizador",
      "Yunicoin, la primera moneda",
      "Una primera prenda",
      "Color por regiones",
      "La escala del cuarto"
    ]
  },
  "kit": {
    "tab": "Kit modular",
    "title": "Del inventario al primer cuarto",
    "copy": "La vista de Blender muestra la amplitud de la colección. Las otras láminas documentan la cuadrícula, el diseño de un mueble y las acciones del editor.",
    "credit": "Láminas originales · mayo",
    "proof": "may-coleccion",
    "names": [
      "La primera colección de muebles",
      "El primer cuarto modular",
      "Un mueble desde el boceto",
      "Editar una habitación"
    ]
  },
  "tienda": {
    "tab": "Tienda",
    "title": "Antes de llegar a Unity",
    "copy": "El equipo comparó distribuciones en 3D y probó en HTML cómo se recorría el catálogo. Sigue el objeto desde la tienda hasta su ficha.",
    "credit": "Láminas originales · junio",
    "proof": "jun-tienda-prototipo",
    "names": [
      "Componer la tienda",
      "Distribución interior",
      "El recorrido de la tienda",
      "Cómo se recorría la tienda"
    ]
  },
  "peces": {
    "tab": "Peces",
    "initialIndex": 12,
    "title": "Los peces del álbum",
    "copy": "Elige una ilustración para ver sus colores y su expresión. Toca el pez para ampliarlo.",
    "credit": "Ilustraciones originales · Yunipets",
    "proof": "ago-pesca",
    "names": [
      "Verde de rayas", "Con cuernos", "Con armadura", "Concha en espiral", "Esqueleto",
      "Concha de náutilo", "Gris perlado", "De roca oscura", "Entre burbujas", "Con orejas",
      "Con bigotes", "Medusa verde", "De franjas naranjas", "En su concha", "Con corona de espinas",
      "Globo de lunares", "Azul plateado", "Dorado", "Verde de aletas largas",
      "De piedra", "Con corona", "De escamas azules", "En pareja", "Con pinzas",
      "De cola puntiaguda", "Con cuerno", "De tentáculos", "Medusa rosada", "Cangrejo rosa", "Camarón"
    ]
  },
  "pesca": {
    "tab": "Pesca",
    "title": "De la isla al álbum",
    "copy": "El mapa indica dónde se puede pescar. En el álbum, cada especie tiene un lugar en la colección. Los estudios de color muestran cómo se distinguieron las familias de peces.",
    "credit": "Láminas originales · agosto",
    "proof": "ago-pesca",
    "names": [
      "Las islas en el mapa de pesca",
      "El álbum de pesca",
      "El color de los peces",
      "Colecciones por entorno"
    ]
  }
};
