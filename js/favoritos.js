// ============================================
// FAVORITOS (favoritos.js)
// Se guardan en el navegador (localStorage), así que no hace falta cuenta.
// ============================================

function leerFavoritos() {
  try { return JSON.parse(localStorage.getItem("pokedex_favs") || "[]"); } catch (e) { return []; }
}
function esFavorito(id) { return leerFavoritos().indexOf(id) !== -1; }
function alternarFavorito(id) {
  var f = leerFavoritos();
  var i = f.indexOf(id);
  if (i === -1) f.push(id); else f.splice(i, 1);
  try { localStorage.setItem("pokedex_favs", JSON.stringify(f)); } catch (e) {}
  return i === -1;   // true si ahora es favorito
}
