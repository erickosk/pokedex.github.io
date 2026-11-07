// ============================================
// CABECERA COMPARTIDA (cabecera.js)
// El encabezado (logo, barra de tipos y música) es igual en todas las páginas.
// En vez de copiarlo en cada HTML, se escribe aquí una sola vez.
// Además guarda funciones comunes: nombres de tipos e imágenes con respaldo.
// ============================================

document.documentElement.classList.add("js");

// Tipos de la barra: [clase, texto]  (el enlace usa la misma clase como filtro)
var menuTipos = [
  ["normal", "Normal"], ["fuego", "Fuego"], ["agua", "Agua"], ["planta", "Planta"],
  ["electrico", "Eléctrico"], ["hielo", "Hielo"], ["lucha", "Lucha"], ["veneno", "Veneno"],
  ["tierra", "Tierra"], ["volador", "Volador"], ["psiquico", "Psíquico"], ["bicho", "Bicho"],
  ["roca", "Roca"], ["fantasma", "Fantasma"], ["dragon", "Dragón"]
];

// Devuelve el texto bonito de un tipo ("electrico" -> "Eléctrico")
function nombreTipo(clave) {
  for (var i = 0; i < menuTipos.length; i++) if (menuTipos[i][0] === clave) return menuTipos[i][1];
  return clave;
}

// La región elegida (si la hay) se conserva al cambiar de tipo
var paramsPagina = new URLSearchParams(window.location.search);
var regionPagina = paramsPagina.get("region");
var prefijo = regionPagina ? "?region=" + encodeURIComponent(regionPagina) : "";
var union = regionPagina ? "&" : "?";

// Primero el botón "Todos" y luego un enlace por cada tipo
var enlaces = '<a class="tipo t-todos" href="index.html' + prefijo + '">Todos</a>';
menuTipos.forEach(function (t) {
  enlaces += '<a class="tipo t-' + t[0] + '" href="index.html' + prefijo + union + 'tipo=' + t[0] + '">' + t[1] + '</a>';
});

// Pantalla de carga: solo la primera vez que se abre la Pokédex en la pestaña
var primeraVez = true;
try { primeraVez = !sessionStorage.getItem("pokedex_visto"); sessionStorage.setItem("pokedex_visto", "1"); } catch (e) {}
var cargador = primeraVez
  ? '<div class="cargador" id="cargador"><div class="bola-carga"></div><p>Cargando...</p></div>'
  : '';

// Bolas de fondo (decoración): [tamaño, posición, duración, retraso]
var bolas = [[50, 6, 34, 0], [80, 22, 46, -12], [40, 38, 30, -5], [64, 55, 40, -22], [90, 72, 52, -30], [46, 88, 36, -8]];
var fondo = '<div class="fondo-animado" aria-hidden="true">' + bolas.map(function (b) {
  return '<span style="--t:' + b[0] + 'px;left:' + b[1] + '%;--d:' + b[2] + 's;--r:' + b[3] + 's"></span>';
}).join("") + '</div>';

// Escribe el encabezado completo justo donde se carga este script
document.write(
  cargador + fondo +
  '<header>' +
    '<div class="fila-logo">' +
      '<div class="lente"></div>' +
      '<div class="punto p1"></div><div class="punto p2"></div><div class="punto p3"></div>' +
      '<h1>Pokédex</h1>' +
    '</div>' +
    '<nav class="menu-tipos" aria-label="Tipos de Pokémon">' + enlaces + '</nav>' +
    // Control de música: botón ▶/⏸ y volumen (lo usa musica.js)
    '<div class="musica">' +
      '<button id="btn-musica" title="Pausar o reproducir la música" aria-label="Música">▶</button>' +
      '<span class="ecualizador" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<input type="range" id="volumen" min="0" max="1" step="0.05" value="0.4" title="Volumen" aria-label="Volumen">' +
      '<audio id="musica" src="audio/musica-pokemon.mp3" loop preload="none"></audio>' +
    '</div>' +
  '</header>'
);

// ---------- Imágenes: primero la carpeta images/, luego internet, luego un icono ----------
var URL_OFICIAL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
var ICONO_VACIO = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#222" stroke-width="6"/>' +
  '<path d="M4 50a46 46 0 0 1 92 0z" fill="#ed1c24" stroke="#222" stroke-width="6"/><circle cx="50" cy="50" r="12" fill="#fff" stroke="#222" stroke-width="6"/></svg>');

function respaldo(img) {
  if (!img.dataset.remoto) {            // 1.er fallo: probar la imagen oficial de internet
    img.dataset.remoto = "1";
    img.src = URL_OFICIAL + img.dataset.num + ".png";
  } else {                               // 2.º fallo: icono de Poké Ball
    img.onerror = null;
    img.classList.add("sin-imagen");
    img.src = ICONO_VACIO;
  }
}

// Crea la etiqueta <img> de un Pokémon con carga diferida y respaldo
function crearImagen(p, tam) {
  var img = document.createElement("img");
  img.alt = p.nombre;
  img.width = tam;
  img.height = tam;
  img.loading = "lazy";
  img.decoding = "async";
  img.dataset.num = p.n;
  img.onerror = function () { respaldo(img); };
  img.src = "images/" + p.id + ".webp";
  return img;
}

// Busca un Pokémon por su nombre o por su id
function buscarPokemon(clave) {
  clave = String(clave).toLowerCase();
  for (var i = 0; i < POKEMON.length; i++) {
    if (POKEMON[i].id === clave || POKEMON[i].nombre.toLowerCase() === clave) return POKEMON[i];
  }
  return null;
}
