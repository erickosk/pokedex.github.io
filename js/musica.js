/* ============================================
   MÚSICA DE FONDO (musica.js)
   - Empieza APAGADA: solo suena cuando tú pulsas el botón de reproducir.
   - Si la enciendes, sigue sonando (desde el mismo segundo) al cambiar de página.
   - Si la pausas, se queda en pausa en todas las páginas.
   - Al cerrar la pestaña se olvida: la próxima vez vuelve a empezar apagada.
   ============================================ */

// 1. Elementos de la página: el audio, el botón de reproducir/pausa y el control de volumen
var audio = document.getElementById("musica");
var boton = document.getElementById("btn-musica");
var volumen = document.getElementById("volumen");
var cajaMusica = document.querySelector(".musica");

// 2. Estado entre páginas. Al abrir otra página la canción se reinicia, así que se guarda
//    si estaba sonando ("quiere") y en qué segundo iba. Es solo de esta visita (sessionStorage).
var quiere = false;        // true = la persona activó la música y no la ha pausado
var tiempoBase = 0;        // segundo guardado de la canción (mientras no está cargada)

function guardar() {
  var tiempo = audio.readyState >= 1 ? audio.currentTime : tiempoBase;
  var texto = JSON.stringify({ quiere: quiere, tiempo: tiempo, hora: Date.now() });
  try { sessionStorage.setItem("pokedex_musica", texto); } catch (e) {}
  window.name = "pokedex_musica:" + texto;   // respaldo si sessionStorage no está disponible
}

function leer() {
  try {
    var g = sessionStorage.getItem("pokedex_musica");
    if (g) return JSON.parse(g);
  } catch (e) {}
  if (window.name.indexOf("pokedex_musica:") === 0) {
    try { return JSON.parse(window.name.slice(15)); } catch (e) {}
  }
  return null;
}

// 3. Volumen: se recuerda para siempre (no activa nada, solo ajusta el nivel)
var vol = 0.4;
try { vol = parseFloat(localStorage.getItem("pokedex_volumen")); } catch (e) {}
if (isNaN(vol)) vol = 0.4;
audio.volume = vol;
volumen.value = vol;

// 4. Colocar la canción en el segundo guardado
function irAlSegundo(seg) {
  function colocar() { if (audio.duration) audio.currentTime = seg % audio.duration; }
  if (audio.readyState >= 1) colocar();
  else audio.addEventListener("loadedmetadata", colocar, { once: true });
}

// 5. Dibujar el botón (y animar el ecualizador solo mientras suena)
function dibujarBoton() {
  boton.innerHTML = icono(audio.paused ? "play" : "pause");
  cajaMusica.classList.toggle("sonando", !audio.paused);
}

// 6. Recuperar el estado: solo se reanuda si la persona la había activado en esta visita
var guardado = leer();
if (guardado) {
  tiempoBase = guardado.tiempo || 0;
  if (guardado.quiere === true) {
    quiere = true;
    var extra = Math.min(2, (Date.now() - guardado.hora) / 1000);   // lo que tardó en cargar la página
    irAlSegundo(tiempoBase + extra);
    var intento = audio.play();
    if (intento && intento.catch) {
      // Si el navegador bloquea el sonido, NO se activa sola: queda en pausa hasta que pulses el botón
      intento.catch(function () { quiere = false; dibujarBoton(); guardar(); });
    }
  }
}

// 7. Botón de reproducir / pausa
boton.addEventListener("click", function () {
  if (audio.paused) {
    quiere = true;
    if (audio.readyState < 1 && tiempoBase) irAlSegundo(tiempoBase);
    audio.play().catch(function () { quiere = false; dibujarBoton(); });
  } else {
    quiere = false;
    audio.pause();
  }
  guardar();
});
audio.addEventListener("play", dibujarBoton);
audio.addEventListener("pause", dibujarBoton);
dibujarBoton();

// 8. Control de volumen
volumen.addEventListener("input", function () {
  audio.volume = volumen.value;
  try { localStorage.setItem("pokedex_volumen", volumen.value); } catch (e) {}
});

// 9. Guardar el avance cada medio segundo y al salir de la página
setInterval(function () { if (quiere) guardar(); }, 500);
window.addEventListener("pagehide", guardar);
