// ============================================
// COMPARADOR (comparar.js)
// comparar.html?a=pikachu&b=raichu muestra estadísticas y tipos lado a lado
// ============================================

var inA = document.getElementById("comp-a");
var inB = document.getElementById("comp-b");
var msg = document.getElementById("comp-msg");
var res = document.getElementById("comp-res");

// Lista de nombres para autocompletar
document.getElementById("lista-pokemon").innerHTML = POKEMON.map(function (p) {
  return '<option value="' + p.nombre.replace(/"/g, "&quot;") + '">#' + p.n + "</option>";
}).join("");

function tarjetaComp(p, api) {
  var d = document.createElement("div");
  d.className = "comp-poke " + p.tipos[0];
  var im = crearImagen(p, 160);
  im.removeAttribute("loading");
  d.appendChild(im);
  var h = document.createElement("h3");
  h.textContent = p.nombre + " " + numero(p.n);
  d.appendChild(h);
  var tp = document.createElement("div");
  tp.innerHTML = p.tipos.map(chipTipo).join(" ");
  d.appendChild(tp);
  return d;
}
function numero(n) { return "#" + String(n).padStart(3, "0"); }
function chipTipo(tp) { return '<span class="tipo t-' + tp + '">' + nombreTipo(tp) + "</span>"; }

function comparar() {
  var a = buscarPokemon(inA.value), b = buscarPokemon(inB.value);
  res.innerHTML = "";
  if (!inA.value && !inB.value) { msg.textContent = t("comp_vacio"); return; }
  if (!a) { msg.textContent = t("comp_noenc", { x: inA.value }); return; }
  if (!b) { msg.textContent = t("comp_noenc", { x: inB.value }); return; }
  msg.textContent = t("cargando");
  history.replaceState(null, "", "?a=" + a.id + "&b=" + b.id);
  Promise.all([pedirAPI("pokemon/" + a.n), pedirAPI("pokemon/" + b.n)]).then(function (r) {
    msg.textContent = "";
    var sa = statsAPI(r[0]), sb = statsAPI(r[1]);
    var ta = sa.reduce(function (s, x) { return s + x.valor; }, 0), tb = sb.reduce(function (s, x) { return s + x.valor; }, 0);
    res.appendChild(tarjetaComp(a));
    var centro = document.createElement("div");
    centro.className = "comp-centro";
    var html = "";
    function fila(nombre, va, vb) {
      var ca = va > vb ? "gana" : va < vb ? "pierde" : "", cb = vb > va ? "gana" : vb < va ? "pierde" : "";
      return '<div class="comp-fila"><b class="' + ca + '">' + va + '</b><div class="comp-barra izq"><i class="' + ca + '" data-w="' + Math.min(100, va / 2.55) + '"></i></div>' +
             '<span>' + nombre + '</span><div class="comp-barra"><i class="' + cb + '" data-w="' + Math.min(100, vb / 2.55) + '"></i></div><b class="' + cb + '">' + vb + "</b></div>";
    }
    sa.forEach(function (s, i) { html += fila(t(s.clave), s.valor, sb[i].valor); });
    html += fila(t("total"), ta, tb);
    centro.innerHTML = html;
    res.appendChild(centro);
    res.appendChild(tarjetaComp(b));
    setTimeout(function () { centro.querySelectorAll("i").forEach(function (i) { i.style.width = i.getAttribute("data-w") + "%"; }); }, 60);
  }).catch(function () { msg.textContent = t("error_api"); });
}

document.getElementById("comp-ir").addEventListener("click", comparar);
document.getElementById("comp-swap").addEventListener("click", function () { var x = inA.value; inA.value = inB.value; inB.value = x; comparar(); });
[inA, inB].forEach(function (i) { i.addEventListener("keydown", function (e) { if (e.key === "Enter") comparar(); }); });

var qa = paramsPagina.get("a"), qb = paramsPagina.get("b");
if (qa) { var pa = buscarPokemon(qa); if (pa) inA.value = pa.nombre; }
if (qb) { var pb = buscarPokemon(qb); if (pb) inB.value = pb.nombre; }
comparar();
