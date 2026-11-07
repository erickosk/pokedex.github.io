/* ============================================
   MÚSICA DE FONDO (musica.js)
   Se usa en todas las páginas: sigue sonando al cambiar de página.
   ============================================ */

// 1. Elementos de la página: el audio, el botón ▶/⏸ y el control de volumen
var audio = document.getElementById("musica");
var boton = document.getElementById("btn-musica");
var volumen = document.getElementById("volumen");
var cajaMusica = document.querySelector(".musica");

// 2. Guardar y leer: al cambiar de página, la canción se reinicia.
//    Por eso guardamos en qué segundo iba, el volumen y si estaba sonando.
var quiere = true;   // true = el usuario quiere música (false = la pausó él)

function guardar() {
  var texto = JSON.stringify({
    tiempo: audio.currentTime,
    hora: Date.now(),
    volumen: audio.volume,
    quiere: quiere
  });
  try { localStorage.setItem("pokedex_musica", texto); } catch (e) {}
  window.name = "pokedex_musica:" + texto;   // respaldo para la misma pestaña
}

function leer() {
  try {
    var g = localStorage.getItem("pokedex_musica");
    if (g) return JSON.parse(g);
  } catch (e) {}
  if (window.name.indexOf("pokedex_musica:") === 0) {
    try { return JSON.parse(window.name.slice(15)); } catch (e) {}
  }
  return null;
}

// 3. Recuperar lo guardado (volumen, pausa y segundo de la canción)
var guardado = leer();
audio.volume = 0.4;
if (guardado) {
  quiere = guardado.quiere !== false;
  audio.volume = guardado.volumen;
}
volumen.value = audio.volume;

function continuarCancion() {
  if (!audio.duration) return;
  var extra = (Date.now() - guardado.hora) / 1000;   // lo que tardó en cargar la página
  if (!quiere || extra > 10) extra = 0;
  audio.currentTime = (guardado.tiempo + extra) % audio.duration;
}
if (guardado && guardado.tiempo) {
  if (audio.readyState >= 1) continuarCancion();
  else audio.addEventListener("loadedmetadata", continuarCancion, { once: true });
}

// 4. Reproducir. Los navegadores bloquean el sonido automático hasta que
//    la persona hace clic, así que si falla esperamos el primer clic.
function esperarClic() {
  function iniciar() {
    if (quiere) audio.play();
    document.removeEventListener("click", iniciar);
    document.removeEventListener("keydown", iniciar);
  }
  document.addEventListener("click", iniciar);
  document.addEventListener("keydown", iniciar);
}
if (quiere) {
  var intento = audio.play();
  if (intento) intento.catch(esperarClic);
}

// 5. Botón ▶ / ⏸ (y ecualizador animado mientras suena)
function dibujarBoton() {
  boton.textContent = audio.paused ? "▶" : "⏸";
  cajaMusica.classList.toggle("sonando", !audio.paused);
}
boton.addEventListener("click", function () {
  if (audio.paused) { quiere = true; audio.play(); }
  else { quiere = false; audio.pause(); }
  guardar();
});
audio.addEventListener("play", dibujarBoton);
audio.addEventListener("pause", dibujarBoton);
dibujarBoton();

// 6. Control de volumen
volumen.addEventListener("input", function () {
  audio.volume = volumen.value;
  guardar();
});

// 7. Guardar el avance cada medio segundo y al salir de la página
setInterval(guardar, 500);
window.addEventListener("pagehide", guardar);
