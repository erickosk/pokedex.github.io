// ============================================
// PÁGINA DE DETALLE (detalle.js)
// Muestra un Pokémon según la dirección: pokemon.html?id=pikachu
// ============================================

var raiz = document.getElementById("detalle");
var idPedido = paramsPagina.get("id");
var pk = idPedido ? buscarPokemon(idPedido) : null;

function numero(n) { return "#" + String(n).padStart(3, "0"); }
function porNumero(n) { return POKEMON[n - 1] || null; }

if (!pk) {
  // Si el Pokémon no existe, se muestra un aviso con salida a la Pokédex
  document.title = "No encontrado - Pokédex";
  raiz.className = "detalle";
  raiz.innerHTML = '<div class="info"><h2>¿Y ese Pokémon?</h2><p>No encontramos ese Pokémon en la Pokédex.</p>' +
                   '<div class="acciones"><a class="volver" href="index.html">Volver a la Pokédex</a></div></div>';
} else {
  document.title = pk.nombre + " - Pokédex";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = pk.nombre + " (" + numero(pk.n) + "): " + pk.desc;

  var region = buscarRegion(pk.region || "kanto");
  raiz.className = "detalle " + pk.tipos[0];

  // ----- Imagen -----
  var foto = document.createElement("div");
  foto.className = "foto";
  foto.appendChild(crearImagen(pk, 230));
  foto.firstChild.removeAttribute("loading");   // la imagen principal se carga enseguida
  foto.firstChild.style.width = "100%";
  foto.firstChild.style.height = "auto";

  // ----- Cadena de evolución -----
  function tarjetaEvo(n) {
    var p = porNumero(n);
    var a = document.createElement("a");
    a.className = "evo" + (n === pk.n ? " actual" : "");
    a.href = "pokemon.html?id=" + p.id;
    a.title = p.nombre;
    a.appendChild(crearImagen(p, 56));
    a.appendChild(document.createTextNode(p.nombre));
    var s = document.createElement("small");
    s.textContent = numero(p.n);
    a.appendChild(s);
    return a;
  }
  var evolucion = document.createElement("div");
  evolucion.className = "evolucion";
  evolucion.innerHTML = "<h3>Evolución</h3>";
  var cadena = EVOLUCIONES.filter(function (c) {
    return c.some(function (etapa) { return etapa.indexOf(pk.n) !== -1; });
  })[0];
  if (cadena) {
    var fila = document.createElement("div");
    fila.className = "cadena";
    cadena.forEach(function (etapa, i) {
      if (i > 0) {
        var f = document.createElement("span");
        f.className = "flecha";
        f.textContent = "›";
        fila.appendChild(f);
      }
      var e = document.createElement("div");
      e.className = "etapa";
      etapa.forEach(function (n) { e.appendChild(tarjetaEvo(n)); });
      fila.appendChild(e);
    });
    evolucion.appendChild(fila);
  } else {
    evolucion.innerHTML += '<p class="sin-evo">Este Pokémon no evoluciona.</p>';
  }

  // ----- Tabla de datos -----
  var chips = pk.tipos.map(function (t) {
    return '<span class="tipo t-' + t + '">' + nombreTipo(t) + "</span>";
  }).join(" ");

  var info = document.createElement("div");
  info.className = "info";
  info.innerHTML =
    "<h2></h2><p></p>" +
    "<table>" +
      "<tr><td>Número</td><td>" + numero(pk.n) + "</td></tr>" +
      "<tr><td>Tipo</td><td>" + chips + "</td></tr>" +
      '<tr><td>Región</td><td><a href="index.html?region=' + region.id + '">' + region.nombre + "</a> · Generación " + region.gen + "</td></tr>" +
      "<tr><td>Altura</td><td>" + pk.altura + "</td></tr>" +
      "<tr><td>Peso</td><td>" + pk.peso + "</td></tr>" +
      "<tr><td>Habilidad</td><td>" + pk.habilidad + "</td></tr>" +
    "</table>";
  info.querySelector("h2").textContent = pk.nombre;
  info.querySelector("p").textContent = pk.desc;
  info.appendChild(evolucion);

  // ----- Botones: volver, anterior y siguiente -----
  var acciones = document.createElement("div");
  acciones.className = "acciones";
  var ant = porNumero(pk.n - 1), sig = porNumero(pk.n + 1);
  acciones.innerHTML = '<a class="volver" href="index.html">Volver a la Pokédex</a>' +
    (ant ? '<a class="volver sec" id="ant" href="pokemon.html?id=' + ant.id + '">◀ ' + ant.nombre + "</a>" : "") +
    (sig ? '<a class="volver sec" id="sig" href="pokemon.html?id=' + sig.id + '">' + sig.nombre + " ▶</a>" : "");
  info.appendChild(acciones);

  raiz.appendChild(foto);
  raiz.appendChild(info);

  // Flechas del teclado para pasar al anterior / siguiente
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && ant) document.getElementById("ant").click();
    if (e.key === "ArrowRight" && sig) document.getElementById("sig").click();
  });
}
