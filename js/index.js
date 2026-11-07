// ============================================
// PÁGINA PRINCIPAL (index.js)
// Dibuja las tarjetas desde datos.js y gestiona buscador, tipos y regiones.
// ============================================

// Ejemplos de cada tipo (nombre y pokémon de ejemplo)
var tipos = {
  normal:    ["Normal", "Tauros", "Snorlax"],
  fuego:     ["Fuego", "Charmander", "Rapidash"],
  agua:      ["Agua", "Squirtle", "Poliwrath"],
  planta:    ["Planta", "Bulbasaur", "Exeggutor"],
  electrico: ["Eléctrico", "Pikachu", "Jolteon"],
  hielo:     ["Hielo", "Articuno", "Lapras"],
  lucha:     ["Lucha", "Machop", "Hitmonlee"],
  veneno:    ["Veneno", "Ekans", "Gengar"],
  tierra:    ["Tierra", "Sandshrew", "Rhydon"],
  volador:   ["Volador", "Pidgey", "Zubat"],
  psiquico:  ["Psíquico", "Mewtwo", "Alakazam"],
  bicho:     ["Bicho", "Caterpie", "Scyther"],
  roca:      ["Roca", "Geodude", "Onix"],
  fantasma:  ["Fantasma", "Gastly", "Haunter"],
  dragon:    ["Dragón", "Dratini", "Dragonite"]
};

var caja = document.getElementById("buscar");
var contenedorTarjetas = document.getElementById("tarjetas");
var info = document.getElementById("info-tipo");
var contador = document.getElementById("contador");

// Tipo y región elegidos (vienen en la dirección: index.html?tipo=fuego&region=kanto)
var tipoElegido = paramsPagina.get("tipo");
if (!tipos[tipoElegido]) tipoElegido = null;
var regionElegida = buscarRegion(paramsPagina.get("region"));

// Convierte un nombre en enlace a su página
function enlace(nombre) {
  var p = buscarPokemon(nombre);
  return p ? '<a href="pokemon.html?id=' + p.id + '">' + p.nombre + '</a>' : nombre;
}

// ---------- 1. Banner de la región y estado vacío ----------
var pokemonVisibles = POKEMON;
if (regionElegida) {
  pokemonVisibles = POKEMON.filter(function (p) { return (p.region || "kanto") === regionElegida.id; });

  var banner = document.createElement("article");
  banner.className = "region-banner";
  banner.style.setProperty("--rc", regionElegida.color);
  banner.innerHTML =
    "<h2>" + regionElegida.nombre + "</h2>" +
    "<p>" + regionElegida.texto + "</p>" +
    '<div class="datos-region">' +
      '<div class="dato"><small>Generación</small><b>' + regionElegida.gen + "</b></div>" +
      '<div class="dato"><small>Pokédex nacional</small><b>#' + String(regionElegida.desde).padStart(3, "0") + " – #" + String(regionElegida.hasta).padStart(3, "0") + "</b></div>" +
      '<div class="dato"><small>Pokémon nuevos</small><b>' + regionElegida.total + "</b></div>" +
      '<div class="dato"><small>Iniciales</small>' + regionElegida.iniciales.map(function (n) {
        var p = buscarPokemon(n);
        return p ? '<a href="pokemon.html?id=' + p.id + '" style="color:#ffe600">' + n + "</a>" : n;
      }).join(" · ") + "</div>" +
    "</div>";
  contenedorTarjetas.appendChild(banner);
}

// ---------- 2. Tarjetas ----------
var fragmento = document.createDocumentFragment();
pokemonVisibles.forEach(function (p) {
  var a = document.createElement("a");
  a.className = "tarjeta " + p.tipos[0];
  a.href = "pokemon.html?id=" + p.id;
  a.dataset.tipos = p.tipos.join(" ");

  var h2 = document.createElement("h2");
  h2.textContent = p.nombre;
  var num = document.createElement("p");
  num.textContent = "#" + String(p.n).padStart(3, "0");

  a.appendChild(crearImagen(p, 140));
  a.appendChild(h2);
  a.appendChild(num);
  p.tipos.forEach(function (t) {
    var s = document.createElement("span");
    s.className = "tipo t-" + t;
    s.textContent = nombreTipo(t);
    a.appendChild(s);
  });
  fragmento.appendChild(a);
});
contenedorTarjetas.appendChild(fragmento);

// Mensajes cuando no hay nada que mostrar
var vacio = document.createElement("div");
vacio.className = "vacio";
vacio.hidden = true;
contenedorTarjetas.appendChild(vacio);

function mostrarVacio(titulo, texto) {
  vacio.innerHTML = '<div class="bola"></div><h3>' + titulo + "</h3><p>" + texto + "</p>";
  vacio.hidden = false;
}

var tarjetas = contenedorTarjetas.querySelectorAll(".tarjeta");

// ---------- 3. Filtrar por buscador y por tipo ----------
function filtrar() {
  var texto = caja.value.toLowerCase().trim();
  var visibles = 0;
  tarjetas.forEach(function (t) {
    var coincideTexto = t.textContent.toLowerCase().includes(texto);
    var coincideTipo = !tipoElegido || t.dataset.tipos.split(" ").indexOf(tipoElegido) !== -1;
    var mostrar = coincideTexto && coincideTipo;
    t.style.display = mostrar ? "" : "none";
    if (mostrar) visibles++;
  });

  contador.innerHTML = "Mostrando <b>" + visibles + "</b> de <b>" + POKEMON.length + "</b> Pokémon";
  vacio.hidden = true;
  if (tarjetas.length === 0 && regionElegida) {
    mostrarVacio(regionElegida.nombre + " llegará pronto", "Esta Pokédex incluye por ahora la Generación I (Kanto). Los " + regionElegida.total + " Pokémon de " + regionElegida.nombre + " aún no están añadidos.");
    contador.innerHTML = "<b>0</b> Pokémon cargados en " + regionElegida.nombre;
  } else if (visibles === 0) {
    mostrarVacio("Sin resultados", "No hay ningún Pokémon que coincida con tu búsqueda.");
  }
}

// ---------- 4. Panel derecho: tipo elegido ----------
if (tipoElegido) {
  var d = tipos[tipoElegido];
  info.innerHTML = '<span class="tipo t-' + tipoElegido + '">' + d[0] + "</span>" +
                   "<p>Ejemplos: " + enlace(d[1]) + ", " + enlace(d[2]) + "</p>";
  document.querySelector(".menu-tipos .t-" + tipoElegido).classList.add("activo");
} else {
  document.querySelector(".menu-tipos .t-todos").classList.add("activo");
}

// ---------- 5. Panel derecho: botones de regiones ----------
var listaRegiones = document.getElementById("lista-regiones");
var sufijoTipo = tipoElegido ? "tipo=" + tipoElegido : "";
function hrefRegion(id) {
  var partes = [];
  if (id) partes.push("region=" + id);
  if (sufijoTipo) partes.push(sufijoTipo);
  return "index.html" + (partes.length ? "?" + partes.join("&") : "");
}
var htmlRegiones = '<a class="reg' + (regionElegida ? "" : " activo") + '" href="' + hrefRegion("") + '">Todas</a>';
REGIONES.forEach(function (r) {
  htmlRegiones += '<a class="reg' + (regionElegida && regionElegida.id === r.id ? " activo" : "") +
                  '" style="--rc:' + r.color + '" href="' + hrefRegion(r.id) + '">' + r.nombre + "</a>";
});
listaRegiones.innerHTML = htmlRegiones;

// ---------- 6. Eventos ----------
caja.addEventListener("input", function () { filtrar(); revelar(Array.prototype.slice.call(tarjetas).filter(function (t) { return t.style.display !== "none"; })); });
document.addEventListener("keydown", function (e) {      // la tecla "/" enfoca el buscador
  if (e.key === "/" && document.activeElement !== caja) { e.preventDefault(); caja.focus(); }
  if (e.key === "Escape" && document.activeElement === caja) { caja.value = ""; filtrar(); caja.blur(); }
});

filtrar();
revelar(Array.prototype.slice.call(tarjetas).filter(function (t) { return t.style.display !== "none"; }));
