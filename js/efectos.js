// ============================================
// EFECTOS VISUALES (efectos.js)
// Barra de progreso, botón de subir, pantalla de carga,
// transición entre páginas y aparición de tarjetas al hacer scroll.
// ============================================

(function () {
  // Barra de progreso de lectura (arriba del todo)
  var barra = document.createElement("div");
  barra.id = "progreso";
  document.body.appendChild(barra);

  // Botón flotante (Poké Ball) para volver arriba
  var subir = document.createElement("button");
  subir.id = "subir";
  subir.title = "Volver arriba";
  subir.setAttribute("aria-label", "Volver arriba");
  subir.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.body.appendChild(subir);

  var pendiente = false;
  function alHacerScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      subir.classList.toggle("mostrar", window.scrollY > 400);
      pendiente = false;
    });
  }
  window.addEventListener("scroll", alHacerScroll, { passive: true });
  alHacerScroll();

  // Quitar la pantalla de carga cuando todo está listo (mínimo 600 ms para que se vea)
  var inicio = Date.now();
  window.addEventListener("load", function () {
    var c = document.getElementById("cargador");
    if (!c) return;
    setTimeout(function () {
      c.classList.add("fuera");
      setTimeout(function () { c.remove(); }, 500);
    }, Math.max(0, 600 - (Date.now() - inicio)));
  });

  // Transición suave al abrir otra página de la Pokédex
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.origin !== window.location.origin) return;
    if (a.pathname === window.location.pathname && a.search === window.location.search) return;
    e.preventDefault();
    document.body.classList.add("saliendo");
    setTimeout(function () { window.location.href = a.href; }, 200);
  });
  window.addEventListener("pageshow", function () { document.body.classList.remove("saliendo"); });
})();

// Hace que las tarjetas aparezcan una a una al entrar en pantalla
function revelar(elementos) {
  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  var cola = 0;
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.style.setProperty("--d", (cola++ % 8) * 55 + "ms");   // escalonado por filas
      en.target.classList.add("visible");
      obs.unobserve(en.target);
      setTimeout(function () { cola = 0; }, 120);
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
  elementos.forEach(function (el) { el.classList.remove("visible"); obs.observe(el); });
}
