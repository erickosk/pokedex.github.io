// ============================================
// REGIONES DEL MUNDO POKÉMON (regiones.js)
// Para añadir los Pokémon de otra región: agrégalos en datos.js con  region: "johto"
// ============================================
var REGIONES = [
  { id: "kanto",   nombre: "Kanto",   gen: "I",    desde: 1,   hasta: 151,  total: 151, color: "#e53935",
    iniciales: ["Bulbasaur", "Charmander", "Squirtle"],
    texto: "Donde empieza todo. La aventura original de Pokémon Rojo y Azul se vive aquí: ocho gimnasios, el malvado Team Rocket y la Liga Pokémon en Meseta Añil.",
    texto_en: "Where it all begins. The original adventure of Pokémon Red and Blue happens here: eight Gyms, the villainous Team Rocket and the Pokémon League at Indigo Plateau." },
  { id: "johto",   nombre: "Johto",   gen: "II",   desde: 152, hasta: 251,  total: 100, color: "#f9a825",
    iniciales: ["Chikorita", "Cyndaquil", "Totodile"],
    texto: "Al oeste de Kanto, con ciudades históricas y torres antiguas. Oro, Plata y Cristal introdujeron la cría Pokémon, el ciclo de día y noche y los tipos Siniestro y Acero.",
    texto_en: "West of Kanto, with historic cities and ancient towers. Gold, Silver and Crystal introduced breeding, the day and night cycle and the Dark and Steel types." },
  { id: "hoenn",   nombre: "Hoenn",   gen: "III",  desde: 252, hasta: 386,  total: 135, color: "#00897b",
    iniciales: ["Treecko", "Torchic", "Mudkip"],
    texto: "Una región tropical con mucho mar y clima cambiante. Rubí, Zafiro y Esmeralda estrenaron las habilidades, las naturalezas y los combates dobles.",
    texto_en: "A tropical region with lots of sea and changing weather. Ruby, Sapphire and Emerald introduced Abilities, Natures and Double Battles." },
  { id: "sinnoh",  nombre: "Sinnoh",  gen: "IV",   desde: 387, hasta: 493,  total: 107, color: "#5c6bc0",
    iniciales: ["Turtwig", "Chimchar", "Piplup"],
    texto: "Tierra de montañas con el Monte Corona en el centro. Diamante, Perla y Platino separaron los movimientos en físicos y especiales y llevaron los intercambios online.",
    texto_en: "A land of mountains with Mt. Coronet at its center. Diamond, Pearl and Platinum split moves into physical and special and brought online trading." },
  { id: "teselia", nombre: "Teselia", gen: "V",    desde: 494, hasta: 649,  total: 156, color: "#455a64",
    iniciales: ["Snivy", "Tepig", "Oshawott"],
    texto: "Una región urbana inspirada en Nueva York. En Negro y Blanco solo aparecían Pokémon nuevos hasta terminar la historia, y estrenó las batallas triples.",
    texto_en: "An urban region inspired by New York City. In Black and White only new Pokémon appeared until the story ended, and Triple Battles debuted." },
  { id: "kalos",   nombre: "Kalos",   gen: "VI",   desde: 650, hasta: 721,  total: 72,  color: "#ec407a",
    iniciales: ["Chespin", "Fennekin", "Froakie"],
    texto: "Inspirada en Francia, con castillos, moda y arte. Pokémon X e Y dieron el salto al 3D y trajeron la Megaevolución y el tipo Hada.",
    texto_en: "Inspired by France, with castles, fashion and art. Pokémon X and Y made the jump to 3D and brought Mega Evolution and the Fairy type." },
  { id: "alola",   nombre: "Alola",   gen: "VII",  desde: 722, hasta: 809,  total: 88,  color: "#ff7043",
    iniciales: ["Rowlet", "Litten", "Popplio"],
    texto: "Un archipiélago tropical inspirado en Hawái. Sol y Luna cambiaron los gimnasios por el Gran Reto isleño y estrenaron las formas de Alola y los movimientos Z.",
    texto_en: "A tropical archipelago inspired by Hawaii. Sun and Moon replaced Gyms with the island challenge and introduced Alolan forms and Z-Moves." },
  { id: "galar",   nombre: "Galar",   gen: "VIII", desde: 810, hasta: 905,  total: 96,  color: "#8e24aa",
    iniciales: ["Grookey", "Scorbunny", "Sobble"],
    texto: "Inspirada en el Reino Unido, donde el fútbol Pokémon es un espectáculo. Espada y Escudo trajeron el Dynamax, la Zona Salvaje y los combates en estadios gigantes.",
    texto_en: "Inspired by the United Kingdom, where Pokémon battles are a stadium spectacle. Sword and Shield brought Dynamax, the Wild Area and giant stadiums." },
  { id: "paldea",  nombre: "Paldea",  gen: "IX",   desde: 906, hasta: 1025, total: 120, color: "#d81b60",
    iniciales: ["Sprigatito", "Fuecoco", "Quaxly"],
    texto: "Inspirada en la península ibérica, con un mundo abierto para explorar sin orden. Escarlata y Púrpura estrenaron la Teracristalización y la aventura libre.",
    texto_en: "Inspired by the Iberian Peninsula, with an open world to explore in any order. Scarlet and Violet introduced Terastallization and free-form adventure." }
];

// Región a la que pertenece un Pokémon (según su número de Pokédex)
function regionDe(p) {
  for (var i = 0; i < REGIONES.length; i++) {
    if (p.n >= REGIONES[i].desde && p.n <= REGIONES[i].hasta) return REGIONES[i];
  }
  return REGIONES[0];
}

// Descripción de la región en el idioma actual
function textoRegion(r) {
  return (typeof idioma !== "undefined" && idioma === "en" && r.texto_en) ? r.texto_en : r.texto;
}

function buscarRegion(id) {
  for (var i = 0; i < REGIONES.length; i++) if (REGIONES[i].id === id) return REGIONES[i];
  return null;
}
