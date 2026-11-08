// ============================================
// PÁGINA DE DETALLE (detalle.js)
// Muestra un Pokémon según la dirección: pokemon.html?id=pikachu
// Primero pinta lo que ya se sabe (datos.js) y luego completa con PokeAPI:
// estadísticas, habilidades, evoluciones con condición, formas, movimientos, grito...
// ============================================

var raiz = document.getElementById("detalle");
var idPedido = paramsPagina.get("id");

function numero(n) { return "#" + String(n).padStart(3, "0"); }
function porNumero(n) { return POKEMON[n - 1] || null; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function chipTipo(tp) { return '<span class="tipo t-' + tp + '">' + nombreTipo(tp) + "</span>"; }

var pk = null;
if (idPedido === "aleatorio") {
  // Pokémon al azar
  window.location.replace("pokemon.html?id=" + POKEMON[Math.floor(Math.random() * POKEMON.length)].id);
} else if (!idPedido) {
  // Si se abre pokemon.html sin indicar un Pokémon, se vuelve a la Pokédex
  window.location.replace("index.html");
} else if (!(pk = buscarPokemon(idPedido))) {
  document.title = t("no_enc") + " - Pokédex";
  raiz.className = "detalle";
  raiz.innerHTML = '<div class="info"><h2>' + t("no_enc") + "</h2><p>" + t("no_enc_txt") + "</p>" +
                   '<div class="acciones"><a class="volver" href="index.html">' + t("volver") + "</a></div></div>";
} else {
  mostrarFicha(pk);
}

function mostrarFicha(pk) {
  document.title = pk.nombre + " - Pokédex";
  var region = regionDe(pk);
  raiz.className = "detalle " + pk.tipos[0];

  // ----- Columna de la imagen y sus botones -----
  var col = document.createElement("div");
  col.className = "col-foto";
  var foto = document.createElement("div");
  foto.className = "foto";
  var img = crearImagen(pk, 230);
  img.removeAttribute("loading");
  img.style.width = "100%";
  img.style.height = "auto";
  foto.appendChild(img);
  col.appendChild(foto);
  var botones = document.createElement("div");
  botones.className = "botones-foto";
  botones.innerHTML = '<button type="button" id="btn-shiny" class="mini" hidden>' + icono("sparkle") + " " + t("variocolor") + "</button>" +
                      '<button type="button" id="btn-grito" class="mini" hidden>' + icono("sound") + " " + t("grito") + "</button>";
  col.appendChild(botones);

  // ----- Información principal -----
  var info = document.createElement("div");
  info.className = "info";
  info.innerHTML =
    '<h2><span id="nombre-pk"></span> <span id="btn-estrella" class="estrella-grande" role="button" tabindex="0"></span></h2><p id="desc-pk"></p>' +
    "<table>" +
      "<tr><td>" + t("numero") + "</td><td>" + numero(pk.n) + "</td></tr>" +
      "<tr><td>" + t("tipo") + "</td><td>" + pk.tipos.map(chipTipo).join(" ") + "</td></tr>" +
      "<tr><td>" + t("region") + '</td><td><a href="index.html?region=' + region.id + '">' + region.nombre + "</a> · " + t("gen_tabla", { g: region.gen }) + "</td></tr>" +
      "<tr><td>" + t("altura") + '</td><td id="td-altura">' + (pk.altura || "…") + "</td></tr>" +
      "<tr><td>" + t("peso") + '</td><td id="td-peso">' + (pk.peso || "…") + "</td></tr>" +
      "<tr><td>" + t("habilidades") + '</td><td id="td-hab">' + (pk.habilidad || "…") + "</td></tr>" +
      "<tr><td>" + t("genero") + '</td><td id="td-gen">…</td></tr>' +
      "<tr><td>" + t("habitat") + '</td><td id="td-hab2">…</td></tr>' +
      "<tr><td>" + t("huevo") + '</td><td id="td-huevo">…</td></tr>' +
      "<tr><td>" + t("captura") + '</td><td id="td-cap">…</td></tr>' +
      "<tr><td>" + t("felicidad") + '</td><td id="td-fel">…</td></tr>' +
    "</table>";
  info.querySelector("#nombre-pk").textContent = pk.nombre;
  info.querySelector("#desc-pk").textContent = pk.desc || t("cargando");

  var acciones = document.createElement("div");
  acciones.className = "acciones";
  var ant = porNumero(pk.n - 1), sig = porNumero(pk.n + 1);
  acciones.innerHTML = '<a class="volver" href="index.html">' + t("volver") + "</a>" +
    (ant ? '<a class="volver sec" id="ant" href="pokemon.html?id=' + ant.id + '">' + icono("arrow-left") + " " + esc(ant.nombre) + "</a>" : "") +
    (sig ? '<a class="volver sec" id="sig" href="pokemon.html?id=' + sig.id + '">' + esc(sig.nombre) + " " + icono("arrow-right") + "</a>" : "");
  info.appendChild(acciones);

  // ----- Secciones de abajo -----
  var extra = document.createElement("div");
  extra.className = "extra";
  extra.innerHTML =
    '<section><h3>' + t("stats") + '</h3><div id="sec-stats" class="cargando-sec">' + t("cargando") + "</div></section>" +
    '<section><h3>' + t("debilidades") + '</h3><div id="sec-tipos"></div></section>' +
    '<section><h3>' + t("evolucion") + '</h3><div id="sec-evo"></div></section>' +
    '<section id="sec-formas-caja" hidden><h3>' + t("formas") + '</h3><div id="sec-formas" class="formas"></div></section>' +
    '<section><h3>' + t("movimientos") + '</h3><div id="sec-movs" class="cargando-sec">' + t("cargando") + "</div></section>";

  raiz.appendChild(col);
  raiz.appendChild(info);
  raiz.appendChild(extra);

  // ----- Favorito -----
  var estrella = document.getElementById("btn-estrella");
  function pintarEstrella() {
    var f = esFavorito(pk.id);
    estrella.innerHTML = icono("star");
    estrella.classList.toggle("activa", f);
    estrella.title = f ? t("fav_quitar") : t("fav_add");
  }
  estrella.addEventListener("click", function () { alternarFavorito(pk.id); pintarEstrella(); });
  estrella.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); estrella.click(); } });
  pintarEstrella();

  // ----- Teclas de flecha izquierda y derecha -----
  document.addEventListener("keydown", function (e) {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowLeft" && ant) document.getElementById("ant").click();
    if (e.key === "ArrowRight" && sig) document.getElementById("sig").click();
  });

  pintarEfectividad(pk);
  pintarEvolucionLocal(pk);
  cargarDatosEnLinea(pk, img);
}

// ---------- Debilidades y resistencias (se calculan sin internet) ----------
function pintarEfectividad(pk) {
  var g = efectividadContra(pk.tipos);
  var filas = [["4", "×4", t("debil")], ["2", "×2", t("debil")], ["0.5", "×½", t("resiste")], ["0.25", "×¼", t("resiste")], ["0", "×0", t("inmune")]];
  var html = "";
  filas.forEach(function (f) {
    if (!g[f[0]].length) return;
    html += '<div class="fila-efec"><span class="mult m' + f[0].replace(".", "") + '">' + f[1] + '</span><span class="etq">' + f[2] + "</span>" + g[f[0]].map(chipTipo).join(" ") + "</div>";
  });
  document.getElementById("sec-tipos").innerHTML = html || '<p class="sin-evo">' + t("sin_datos") + "</p>";
}

// ---------- Evolución: primero la versión local (sin condiciones) ----------
function tarjetaEvo(n, actual) {
  var p = porNumero(n);
  var a = document.createElement("a");
  a.className = "evo" + (n === actual ? " actual" : "");
  a.href = "pokemon.html?id=" + p.id;
  a.title = p.nombre;
  a.appendChild(crearImagen(p, 56));
  a.appendChild(document.createTextNode(p.nombre));
  var s = document.createElement("small");
  s.textContent = numero(p.n);
  a.appendChild(s);
  return a;
}

function pintarEvolucionLocal(pk) {
  var cont = document.getElementById("sec-evo");
  var cadena = EVOLUCIONES.filter(function (c) { return c.some(function (e) { return e.indexOf(pk.n) !== -1; }); })[0];
  if (!cadena) { cont.innerHTML = '<p class="sin-evo">' + t("no_evoluciona") + "</p>"; return; }
  var fila = document.createElement("div");
  fila.className = "cadena";
  cadena.forEach(function (etapa, i) {
    if (i > 0) { var f = document.createElement("span"); f.className = "flecha"; f.textContent = "›"; fila.appendChild(f); }
    var e = document.createElement("div");
    e.className = "etapa";
    etapa.forEach(function (n) { e.appendChild(tarjetaEvo(n, pk.n)); });
    fila.appendChild(e);
  });
  cont.innerHTML = "";
  cont.appendChild(fila);
}

// ---------- Evolución con condiciones (datos en línea) ----------
function dibujarNodo(nodo, actual) {
  var caja = document.createElement("div");
  caja.className = "arbol-evo";
  caja.appendChild(tarjetaEvo(nodo.n, actual));
  if (nodo.hijos.length) {
    var ramas = document.createElement("div");
    ramas.className = "ramas";
    nodo.hijos.forEach(function (h) {
      var rama = document.createElement("div");
      rama.className = "rama";
      var cond = document.createElement("div");
      cond.className = "cond";
      cond.innerHTML = '<span class="flecha">›</span><small>' + esc(h.cond) + "</small>";
      rama.appendChild(cond);
      rama.appendChild(dibujarNodo(h, actual));
      ramas.appendChild(rama);
    });
    caja.appendChild(ramas);
  }
  return caja;
}

// ---------- Estadísticas con barras animadas ----------
function pintarStats(stats) {
  var total = stats.reduce(function (s, x) { return s + x.valor; }, 0);
  var html = "";
  stats.forEach(function (s) {
    var clase = s.valor < 50 ? "s-bajo" : s.valor < 80 ? "s-medio" : s.valor < 110 ? "s-alto" : "s-top";
    html += '<div class="fila-stat"><span class="stat-nombre">' + t(s.clave) + '</span><b class="stat-valor">' + s.valor +
            '</b><div class="barra"><i class="' + clase + '" data-w="' + Math.min(100, s.valor / 2.55) + '"></i></div></div>';
  });
  html += '<div class="fila-stat total"><span class="stat-nombre">' + t("total") + '</span><b class="stat-valor">' + total + "</b></div>";
  var cont = document.getElementById("sec-stats");
  cont.className = "";
  cont.innerHTML = html;
  setTimeout(function () {
    cont.querySelectorAll(".barra i").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; });
  }, 60);
}

// ---------- Movimientos ----------
function pintarMovimientos(res) {
  var cont = document.getElementById("sec-movs");
  cont.className = "";
  if (!res.filas.length) { cont.innerHTML = '<p class="sin-evo">' + t("sin_datos") + "</p>"; return; }
  var cats = { physical: "fisico", special: "especial", status: "estado" };
  var html = '<div class="tabla-ancha"><table class="movs"><tr><th>' + t("mov_nivel") + "</th><th>" + t("mov_nombre") + "</th><th>" + t("mov_tipo") +
             "</th><th>" + t("mov_cat") + "</th><th>" + t("mov_pot") + "</th></tr>";
  res.filas.forEach(function (m) {
    html += "<tr><td>" + (m.nivel || "—") + "</td><td>" + esc(m.nombre) + "</td><td>" + chipTipo(m.tipo) + "</td><td>" + t(cats[m.cat] || "estado") + "</td><td>" + (m.pot || "—") + "</td></tr>";
  });
  html += "</table></div><p class='nota'>" + t("mov_total", { n: res.total }) + "</p>";
  cont.innerHTML = html;
}

// ---------- Todo lo que viene de PokeAPI ----------
function cargarDatosEnLinea(pk, img) {
  var falloGeneral = function (id) {
    return function () { var e = document.getElementById(id); if (e) { e.className = ""; e.innerHTML = '<p class="sin-evo">' + t("error_api") + "</p>"; } };
  };
  cargarBasico(pk.n).then(function (d) {
    var api = d.pk, sp = d.sp;

    // Altura, peso, descripción y datos de la especie
    document.getElementById("td-altura").textContent = (api.height / 10).toFixed(1) + " m";
    document.getElementById("td-peso").textContent = (api.weight / 10).toFixed(1) + " kg";
    var desc = descripcionAPI(sp);
    if (desc) document.getElementById("desc-pk").textContent = desc;
    else if (!pk.desc) document.getElementById("desc-pk").textContent = "";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = pk.nombre + " (" + numero(pk.n) + ")" + (desc ? ": " + desc : "");
    document.getElementById("td-gen").textContent = generoTexto(sp);
    document.getElementById("td-hab2").textContent = sp.habitat ? nombreHabitat(sp.habitat.name) : "—";
    document.getElementById("td-huevo").textContent = sp.egg_groups.map(function (g) { return nombreGrupoHuevo(g.name); }).join(", ") || "—";
    document.getElementById("td-cap").textContent = sp.capture_rate;
    document.getElementById("td-fel").textContent = sp.base_happiness === null ? "—" : sp.base_happiness;

    pintarStats(statsAPI(api));

    // Variocolor y grito
    var arte = (api.sprites && api.sprites.other && api.sprites.other["official-artwork"]) || {};
    if (arte.front_shiny) {
      var bs = document.getElementById("btn-shiny");
      bs.hidden = false;
      var shiny = false;
      bs.addEventListener("click", function () {
        shiny = !shiny;
        img.classList.remove("sin-imagen");
        img.src = shiny ? arte.front_shiny : URL_OFICIAL + pk.n + ".png";
        bs.classList.toggle("activo", shiny);
        bs.innerHTML = icono("sparkle") + " " + (shiny ? t("normal_btn") : t("variocolor"));
      });
    }
    var grito = api.cries && (api.cries.latest || api.cries.legacy);
    if (grito) {
      var bg = document.getElementById("btn-grito");
      bg.hidden = false;
      bg.addEventListener("click", function () { var a = new Audio(grito); a.volume = 0.5; a.play(); });
    }

    // Formas alternativas
    var formas = formasAPI(sp);
    if (formas.length) {
      document.getElementById("sec-formas-caja").hidden = false;
      var cont = document.getElementById("sec-formas");
      formas.slice(0, 12).forEach(function (f) {
        var d2 = document.createElement("div");
        d2.className = "forma";
        var im = crearImagen({ nombre: f.nombre, n: pk.n }, 72, f.id);
        im.loading = "lazy";
        d2.appendChild(im);
        d2.appendChild(document.createTextNode(f.nombre));
        cont.appendChild(d2);
      });
      if (formas.length > 12) { var mas = document.createElement("div"); mas.className = "forma mas"; mas.textContent = t("mas_formas", { n: formas.length - 12 }); cont.appendChild(mas); }
    }

    // Habilidades (con nombre traducido)
    habilidadesAPI(api).then(function (hs) {
      document.getElementById("td-hab").innerHTML = hs.map(function (h) {
        return esc(h.nombre) + (h.oculta ? ' <small class="oculta">(' + t("oculta") + ")</small>" : "");
      }).join("<br>");
    });

    // Evolución con condiciones
    arbolEvolucion(sp).then(function (arbol) {
      var cont = document.getElementById("sec-evo");
      if (!arbol.hijos.length) { cont.innerHTML = '<p class="sin-evo">' + t("no_evoluciona") + "</p>"; return; }
      cont.innerHTML = "";
      cont.appendChild(dibujarNodo(arbol, pk.n));
    }).catch(function () {});

    // Movimientos
    movimientosAPI(api, 14).then(pintarMovimientos).catch(falloGeneral("sec-movs"));
  }).catch(function () {
    falloGeneral("sec-stats")();
    falloGeneral("sec-movs")();
    ["td-gen", "td-hab2", "td-huevo", "td-cap", "td-fel"].forEach(function (id) { document.getElementById(id).textContent = "—"; });
    ["td-altura", "td-peso", "td-hab"].forEach(function (id) { var e = document.getElementById(id); if (e.textContent === "…") e.textContent = "—"; });
    var d = document.getElementById("desc-pk");
    if (!pk.desc) d.textContent = t("error_api"); else d.textContent = pk.desc;
  });
}
