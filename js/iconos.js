// ============================================
// ICONOS (iconos.js)
// Iconos SVG propios, dibujados con trazos simples. Toman el color del texto (currentColor),
// así que cambian solos con el tema. Uso:  icono("star")  devuelve el código <svg> del icono.
// ============================================

var ICONOS = {
  play:        '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  pause:       '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  star:        '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  sun:         '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  moon:        '<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10z"/>',
  shuffle:     '<path d="M16 3.5h4.5V8M3.5 20.5l17-17M20.5 16v4.5H16M14.5 14.5l6 6M3.5 3.5l5.5 5.5"/>',
  compare:     '<path d="M6.5 7h13M16 3.5L19.5 7 16 10.5M17.5 17h-13M8 13.5L4.5 17 8 20.5"/>',
  calendar:    '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  sound:       '<path d="M4 9.5v5h3.5l5 4V5.5l-5 4z" fill="currentColor"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.8 6.3a8 8 0 0 1 0 11.4"/>',
  sparkle:     '<path d="M12 2.5l2.3 6.9 6.7 2.1-6.7 2.1L12 20.5l-2.3-6.9L3 11.5l6.7-2.1z"/><path d="M19 3v3.5M17.2 4.7h3.6"/>',
  "arrow-left":  '<path d="M14.5 5l-7 7 7 7"/>',
  "arrow-right": '<path d="M9.5 5l7 7-7 7"/>',
  list:        '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  grid:        '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>'
};

function icono(nombre) {
  return '<svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" ' +
         'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
         (ICONOS[nombre] || "") + "</svg>";
}
