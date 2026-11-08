// ============================================
// SERVICE WORKER (sw.js)
// Hace que la Pokédex se pueda instalar como app y funcione sin conexión.
// IMPORTANTE: cuando publiques cambios, sube el número de VERSION para que se actualice la caché.
// ============================================
var VERSION = "pokedex-v4";
var BASICOS = ["./", "index.html", "pokemon.html", "comparar.html", "css/styles.css", "manifest.webmanifest",
  "js/datos.js", "js/regiones.js", "js/idioma.js", "js/favoritos.js", "js/iconos.js", "js/cabecera.js", "js/api.js", "js/tipos.js",
  "js/efectos.js", "js/index.js", "js/detalle.js", "js/comparar.js", "js/musica.js", "icons/icon.svg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(BASICOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (claves) {
    return Promise.all(claves.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Responde con lo guardado y actualiza en segundo plano
self.addEventListener("fetch", function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (req.method !== "GET" || req.headers.has("range") || /\.mp3$/.test(url.pathname)) return;   // la música no se guarda
  var propio = url.origin === self.location.origin;
  var api = url.hostname === "pokeapi.co";
  if (!propio && !api) return;                                  // fuentes e imágenes: las gestiona el navegador

  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(req, { ignoreSearch: propio && req.mode === "navigate" }).then(function (guardado) {
      var red = fetch(req).then(function (resp) {
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      }).catch(function () { return guardado; });
      return guardado || red;
    });
  }));
});
