// ============================================
// TABLA DE TIPOS (tipos.js)
// Calcula debilidades, resistencias e inmunidades de cualquier combinación de tipos.
// Funciona sin internet.
// ============================================

// Para cada tipo atacante: contra qué es x2, x1/2 y x0
var EFECTIVIDAD = {
  normal:    { x2: [], x05: ["roca", "acero"], x0: ["fantasma"] },
  fuego:     { x2: ["planta", "hielo", "bicho", "acero"], x05: ["fuego", "agua", "roca", "dragon"], x0: [] },
  agua:      { x2: ["fuego", "tierra", "roca"], x05: ["agua", "planta", "dragon"], x0: [] },
  planta:    { x2: ["agua", "tierra", "roca"], x05: ["fuego", "planta", "veneno", "volador", "bicho", "dragon", "acero"], x0: [] },
  electrico: { x2: ["agua", "volador"], x05: ["electrico", "planta", "dragon"], x0: ["tierra"] },
  hielo:     { x2: ["planta", "tierra", "volador", "dragon"], x05: ["fuego", "agua", "hielo", "acero"], x0: [] },
  lucha:     { x2: ["normal", "hielo", "roca", "siniestro", "acero"], x05: ["veneno", "volador", "psiquico", "bicho", "hada"], x0: ["fantasma"] },
  veneno:    { x2: ["planta", "hada"], x05: ["veneno", "tierra", "roca", "fantasma"], x0: ["acero"] },
  tierra:    { x2: ["fuego", "electrico", "veneno", "roca", "acero"], x05: ["planta", "bicho"], x0: ["volador"] },
  volador:   { x2: ["planta", "lucha", "bicho"], x05: ["electrico", "roca", "acero"], x0: [] },
  psiquico:  { x2: ["lucha", "veneno"], x05: ["psiquico", "acero"], x0: ["siniestro"] },
  bicho:     { x2: ["planta", "psiquico", "siniestro"], x05: ["fuego", "lucha", "veneno", "volador", "fantasma", "acero", "hada"], x0: [] },
  roca:      { x2: ["fuego", "hielo", "volador", "bicho"], x05: ["lucha", "tierra", "acero"], x0: [] },
  fantasma:  { x2: ["psiquico", "fantasma"], x05: ["siniestro"], x0: ["normal"] },
  dragon:    { x2: ["dragon"], x05: ["acero"], x0: ["hada"] },
  siniestro: { x2: ["psiquico", "fantasma"], x05: ["lucha", "siniestro", "hada"], x0: [] },
  acero:     { x2: ["hielo", "roca", "hada"], x05: ["fuego", "agua", "electrico", "acero"], x0: [] },
  hada:      { x2: ["lucha", "dragon", "siniestro"], x05: ["fuego", "veneno", "acero"], x0: [] }
};

// Multiplicador de un tipo atacante contra un Pokémon con esos tipos
function multiplicador(atacante, tiposDefensa) {
  var m = 1;
  tiposDefensa.forEach(function (d) {
    var e = EFECTIVIDAD[atacante];
    if (e.x0.indexOf(d) !== -1) m *= 0;
    else if (e.x2.indexOf(d) !== -1) m *= 2;
    else if (e.x05.indexOf(d) !== -1) m *= 0.5;
  });
  return m;
}

// Agrupa los 18 tipos según cuánto daño le hacen: { "4": [...], "2": [...], "0.5": [...], "0.25": [...], "0": [...] }
function efectividadContra(tiposDefensa) {
  var grupos = { "4": [], "2": [], "0.5": [], "0.25": [], "0": [] };
  Object.keys(EFECTIVIDAD).forEach(function (a) {
    var m = multiplicador(a, tiposDefensa);
    if (grupos[String(m)]) grupos[String(m)].push(a);
  });
  return grupos;
}
