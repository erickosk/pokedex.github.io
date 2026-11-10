// ============================================
// PÁGINA PRINCIPAL (index.js)
// Dibuja las tarjetas desde datos.js y gestiona buscador, tipos, regiones,
// orden, vista de lista, favoritos y herramientas.
// ============================================

// Ejemplos de cada tipo (dos Pokémon)
var ejemplosTipo = {
  normal: ["Tauros", "Snorlax"], fuego: ["Charmander", "Rapidash"], agua: ["Squirtle", "Poliwrath"],
  planta: ["Bulbasaur", "Exeggutor"], electrico: ["Pikachu", "Jolteon"], hielo: ["Articuno", "Lapras"],
  lucha: ["Machop", "Hitmonlee"], veneno: ["Ekans", "Gengar"], tierra: ["Sandshrew", "Rhydon"],
  volador: ["Pidgey", "Zubat"], psiquico: ["Mewtwo", "Alakazam"], bicho: ["Caterpie", "Scyther"],
  roca: ["Geodude", "Onix"], fantasma: ["Gastly", "Haunter"], dragon: ["Dratini", "Dragonite"],
  siniestro: ["Umbreon", "Tyranitar"], acero: ["Steelix", "Metagross"], hada: ["Gardevoir", "Togekiss"]
};

var caja = document.getElementById("buscar");
var contenedorTarjetas = document.getElementById("tarjetas");
var info = document.getElementById("info-tipo");
var contador = document.getElementById("contador");

// Tipo y región elegidos (vienen en la dirección: index.html?tipo=fuego&region=kanto)
var tipoElegido = paramsPagina.get("tipo");
if (menuTipos.indexOf(tipoElegido) === -1) tipoElegido = null;
var regionElegida = buscarRegion(paramsPagina.get("region"));

// Preferencias que se recuerdan
function leerPref(clave, defecto) { try { return localStorage.getItem("pokedex_" + clave) || defecto; } catch (e) { return defecto; } }
function guardarPref(clave, valor) { try { localStorage.setItem("pokedex_" + clave, valor); } catch (e) {} }
var orden = leerPref("orden", "num");
var vista = leerPref("vista", "tarjetas");
var tipo2 = "";
var soloFav = false;

// Texto e icono del botón que cambia entre tarjetas y lista
function etiquetaVista() {
  return vista === "lista" ? icono("grid") + " " + t("v_tarjetas") : icono("list") + " " + t("v_lista");
}

function enlace(nombre) {
  var p = buscarPokemon(nombre);
  return p ? '<a href="pokemon.html?id=' + p.id + '">' + p.nombre + '</a>' : nombre;
}

// ---------- 1. Banner de la región ----------
var pokemonVisibles = POKEMON;
if (regionElegida) {
  pokemonVisibles = POKEMON.filter(function (p) { return regionDe(p).id === regionElegida.id; });

  var banner = document.createElement("article");
  banner.className = "region-banner";
  banner.style.setProperty("--rc", regionElegida.color);
  banner.innerHTML =
    "<h2>" + regionElegida.nombre + "</h2>" +
    "<p>" + textoRegion(regionElegida) + "</p>" +
    '<div class="datos-region">' +
      '<div class="dato"><small>' + t("generacion") + "</small><b>" + regionElegida.gen + "</b></div>" +
      '<div class="dato"><small>' + t("pokedex_nac") + '</small><b>#' + String(regionElegida.desde).padStart(3, "0") + " – #" + String(regionElegida.hasta).padStart(3, "0") + "</b></div>" +
      '<div class="dato"><small>' + t("pokemon_nuevos") + "</small><b>" + regionElegida.total + "</b></div>" +
      '<div class="dato"><small>' + t("iniciales") + "</small>" + regionElegida.iniciales.map(function (n) {
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
  a.dataset.id = p.id;
  a.dataset.n = p.n;
  a.dataset.nombre = p.nombre.toLowerCase();

  var estrella = document.createElement("span");
  estrella.className = "estrella";
  estrella.setAttribute("role", "button");
  estrella.setAttribute("aria-label", t("fav_add"));
  estrella.title = t("fav_add");
  estrella.innerHTML = icono("star");
  if (esFavorito(p.id)) estrella.classList.add("activa");
  a.appendChild(estrella);

  var h2 = document.createElement("h2");
  h2.textContent = p.nombre;
  var num = document.createElement("p");
  num.textContent = "#" + String(p.n).padStart(3, "0");

  a.appendChild(crearImagen(p, 140));
  a.appendChild(h2);
  a.appendChild(num);
  var fila = document.createElement("div");
  fila.className = "chips";
  p.tipos.forEach(function (tp) {
    var s = document.createElement("span");
    s.className = "tipo t-" + tp;
    s.textContent = nombreTipo(tp);
    fila.appendChild(s);
  });
  a.appendChild(fila);
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

var tarjetas = Array.prototype.slice.call(contenedorTarjetas.querySelectorAll(".tarjeta"));

// Favoritos: clic en la estrella (sin abrir la ficha)
contenedorTarjetas.addEventListener("click", function (e) {
  var est = e.target.closest(".estrella");
  if (!est) return;
  e.preventDefault();
  e.stopPropagation();
  var id = est.closest(".tarjeta").dataset.id;
  var ahora = alternarFavorito(id);
  est.classList.toggle("activa", ahora);
  if (soloFav) filtrar();
}, true);

// ---------- 3. Ordenar ----------
function ordenar() {
  var lista = tarjetas.slice();
  if (orden === "az") lista.sort(function (a, b) { return a.dataset.nombre.localeCompare(b.dataset.nombre); });
  else if (orden === "za") lista.sort(function (a, b) { return b.dataset.nombre.localeCompare(a.dataset.nombre); });
  else lista.sort(function (a, b) { return a.dataset.n - b.dataset.n; });
  lista.forEach(function (c) { contenedorTarjetas.insertBefore(c, vacio); });
}

// ---------- 4. Filtrar por buscador, tipo(s) y favoritos ----------
function visibles() { return tarjetas.filter(function (c) { return c.style.display !== "none"; }); }

function filtrar() {
  var texto = caja.value.toLowerCase().trim();
  var favs = leerFavoritos();
  var cuantos = 0;
  tarjetas.forEach(function (c) {
    var tipos = c.dataset.tipos.split(" ");
    var ok = c.textContent.toLowerCase().includes(texto) &&
             (!tipoElegido || tipos.indexOf(tipoElegido) !== -1) &&
             (!tipo2 || tipos.indexOf(tipo2) !== -1) &&
             (!soloFav || favs.indexOf(c.dataset.id) !== -1);
    c.style.display = ok ? "" : "none";
    if (ok) cuantos++;
  });
  contador.innerHTML = t("mostrando", { a: cuantos, b: POKEMON.length });
  vacio.hidden = true;
  if (cuantos === 0) {
    if (soloFav && !texto) mostrarVacio(t("sin_fav"), t("sin_fav_txt"));
    else mostrarVacio(t("sin_res"), t("sin_res_txt"));
  }
  revelar(visibles());
}

// ---------- 5. Panel derecho: tipo elegido ----------
if (tipoElegido) {
  var ej = ejemplosTipo[tipoElegido];
  info.innerHTML = '<span class="tipo t-' + tipoElegido + '">' + nombreTipo(tipoElegido) + "</span>" +
                   "<p>" + t("ejemplos") + " " + enlace(ej[0]) + ", " + enlace(ej[1]) + "</p>";
  document.querySelector(".menu-tipos .t-" + tipoElegido).classList.add("activo");
} else {
  document.querySelector(".menu-tipos .t-todos").classList.add("activo");
}

// ---------- 6. Panel derecho: regiones ----------
var listaRegiones = document.getElementById("lista-regiones");
function hrefRegion(id) {
  var partes = [];
  if (id) partes.push("region=" + id);
  if (tipoElegido) partes.push("tipo=" + tipoElegido);
  return "index.html" + (partes.length ? "?" + partes.join("&") : "");
}
var htmlRegiones = '<a class="reg' + (regionElegida ? "" : " activo") + '" href="' + hrefRegion("") + '">' + t("todas") + "</a>";
REGIONES.forEach(function (r) {
  htmlRegiones += '<a class="reg' + (regionElegida && regionElegida.id === r.id ? " activo" : "") +
                  '" style="--rc:' + r.color + '" href="' + hrefRegion(r.id) + '">' + r.nombre + "</a>";
});
listaRegiones.innerHTML = htmlRegiones;

// ---------- 7. Panel derecho: herramientas ----------
var diaN = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
var delDia = POKEMON[(diaN * 7919) % POKEMON.length];
var opcionesTipo2 = '<option value="">' + t("cualquiera") + "</option>" + menuTipos.map(function (c) {
  return '<option value="' + c + '">' + nombreTipo(c) + "</option>";
}).join("");

document.getElementById("herramientas").innerHTML =
  '<label>' + t("orden") + '<select id="sel-orden">' +
    '<option value="num">' + t("ord_num") + '</option><option value="az">' + t("ord_az") + '</option><option value="za">' + t("ord_za") + "</option></select></label>" +
  '<label>' + t("tambien") + '<select id="sel-tipo2">' + opcionesTipo2 + "</select></label>" +
  '<div class="fila-botones">' +
    '<button type="button" id="btn-vista" class="mini">' + etiquetaVista() + "</button>" +
    '<button type="button" id="btn-fav" class="mini">' + icono("star") + " " + t("solo_fav") + "</button>" +
  "</div>" +
  '<div class="fila-botones">' +
    '<a class="mini" href="pokemon.html?id=aleatorio">' + icono("shuffle") + " " + t("aleatorio") + "</a>" +
    '<a class="mini" href="comparar.html">' + icono("compare") + " " + t("comparar") + "</a>" +
  "</div>" +
  '<a class="mini ancho" href="pokemon.html?id=' + delDia.id + '">' + icono("calendar") + " " + t("del_dia") + ": <b>" + delDia.nombre + "</b></a>";

var selOrden = document.getElementById("sel-orden");
selOrden.value = orden;
selOrden.addEventListener("change", function () { orden = selOrden.value; guardarPref("orden", orden); ordenar(); revelar(visibles()); });
document.getElementById("sel-tipo2").addEventListener("change", function (e) { tipo2 = e.target.value; filtrar(); });

function aplicarVista() {
  contenedorTarjetas.classList.toggle("lista", vista === "lista");
  document.getElementById("btn-vista").innerHTML = etiquetaVista();
}
document.getElementById("btn-vista").addEventListener("click", function () {
  vista = vista === "lista" ? "tarjetas" : "lista";
  guardarPref("vista", vista);
  aplicarVista();
});
document.getElementById("btn-fav").addEventListener("click", function (e) {
  soloFav = !soloFav;
  e.currentTarget.classList.toggle("activo", soloFav);
  filtrar();
});

// ---------- 8. Eventos y arranque ----------
caja.addEventListener("input", filtrar);
document.addEventListener("keydown", function (e) {      // la tecla "/" enfoca el buscador
  if (e.key === "/" && document.activeElement !== caja && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); caja.focus(); }
  if (e.key === "Escape" && document.activeElement === caja) { caja.value = ""; filtrar(); caja.blur(); }
});

aplicarVista();
ordenar();
filtrar();
