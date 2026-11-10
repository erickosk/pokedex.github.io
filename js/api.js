// ============================================
// DATOS EN LÍNEA DE POKEAPI (api.js)
// La ficha de cada Pokémon pide aquí sus datos oficiales: estadísticas, habilidades,
// movimientos, evoluciones con condición, formas, grito, etc. Todo en tu idioma.
// ============================================

var URL_API = "https://pokeapi.co/api/v2/";
var _cacheAPI = {};   // evita pedir dos veces lo mismo en la misma visita

function pedirAPI(ruta) {
  if (!_cacheAPI[ruta]) {
    _cacheAPI[ruta] = fetch(URL_API + ruta + "/").then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).catch(function (e) { delete _cacheAPI[ruta]; throw e; });
  }
  return _cacheAPI[ruta];
}

function idDeURL(url) {
  var partes = String(url).replace(/\/$/, "").split("/");
  return parseInt(partes[partes.length - 1], 10);
}

// Busca en una lista de la API el texto en el idioma actual
function textoIdioma(lista, campo) {
  for (var i = 0; i < (lista || []).length; i++) {
    if (lista[i].language.name === idioma) return lista[i][campo || "name"];
  }
  return null;
}

function limpiarTexto(s) { return String(s).replace(/[\n\f\u00ad]/g, " ").replace(/\s+/g, " ").trim(); }
function bonito(slug) {
  return String(slug).split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
}

// ---------- Traducciones de datos sueltos ----------
var HABITATS = { cave: "Cueva", forest: "Bosque", grassland: "Pradera", mountain: "Montaña", rare: "Raro",
                 "rough-terrain": "Terreno accidentado", sea: "Mar", urban: "Ciudad", "waters-edge": "Orilla del agua" };
var GRUPOS_HUEVO = { monster: "Monstruo", water1: "Agua 1", water2: "Agua 2", water3: "Agua 3", bug: "Bicho",
                     flying: "Volador", ground: "Campo", fairy: "Hada", plant: "Planta", humanshape: "Humanoide",
                     mineral: "Mineral", indeterminate: "Amorfo", ditto: "Ditto", dragon: "Dragón", "no-eggs": "Sin huevos" };
var GRUPOS_HUEVO_EN = { water1: "Water 1", water2: "Water 2", water3: "Water 3", humanshape: "Human-Like",
                        ground: "Field", indeterminate: "Amorphous", "no-eggs": "Undiscovered" };
var OBJETOS = { "fire-stone": "Piedra Fuego", "water-stone": "Piedra Agua", "thunder-stone": "Piedra Trueno",
                "leaf-stone": "Piedra Hoja", "moon-stone": "Piedra Lunar", "sun-stone": "Piedra Solar",
                "shiny-stone": "Piedra Día", "dusk-stone": "Piedra Noche", "dawn-stone": "Piedra Alba",
                "ice-stone": "Piedra Hielo", "metal-coat": "Revestimiento Metálico", "kings-rock": "Roca del Rey",
                "dragon-scale": "Escama Dragón", "up-grade": "Mejora", "dubious-disc": "Disco Extraño",
                "protector": "Protector", "electirizer": "Electrizador", "magmarizer": "Magmatizador",
                "razor-claw": "Garra Afilada", "razor-fang": "Colmillo Agudo", "reaper-cloth": "Tela Terrible",
                "oval-stone": "Piedra Oval", "deep-sea-tooth": "Diente Marino", "deep-sea-scale": "Escama Marina",
                "prism-scale": "Escama Bella", "sachet": "Saquito Fragante", "whipped-dream": "Dulce de Nata",
                "blackglasses": "Gafas de Sol", "tart-apple": "Manzana Ácida", "sweet-apple": "Manzana Dulce",
                "cracked-pot": "Tetera Rota", "chipped-pot": "Tetera Desportillada", "galarica-cuff": "Brazal Galano",
                "galarica-wreath": "Corona Galana", "auspicious-armor": "Armadura Auspiciosa", "malicious-armor": "Armadura Maliciosa",
                "black-augurite": "Mineral Negro", "peat-block": "Bloque de Turba", "syrupy-apple": "Manzana Melosa",
                "linking-cord": "Cable Unión", "scroll-of-darkness": "Pergamino Oscuro", "scroll-of-waters": "Pergamino Agua",
                "leaders-crest": "Emblema del Líder" };
function nombreObjeto(slug) { return (idioma === "es" && OBJETOS[slug]) || bonito(slug); }
function nombreHabitat(slug) { return idioma === "es" ? (HABITATS[slug] || bonito(slug)) : bonito(slug); }
function nombreGrupoHuevo(slug) {
  return idioma === "es" ? (GRUPOS_HUEVO[slug] || bonito(slug)) : (GRUPOS_HUEVO_EN[slug] || bonito(slug));
}

// ---------- Datos básicos de una ficha ----------
// Devuelve una promesa con: { pk: datos del Pokémon, sp: datos de la especie }
function cargarBasico(n) {
  return Promise.all([pedirAPI("pokemon/" + n), pedirAPI("pokemon-species/" + n)]).then(function (r) {
    return { pk: r[0], sp: r[1] };
  });
}

// Texto de la Pokédex y categoría ("Pokémon Semilla") en el idioma actual
function descripcionAPI(sp) {
  var genero = textoIdioma(sp.genera, "genus");
  var entradas = (sp.flavor_text_entries || []).filter(function (e) { return e.language.name === idioma; });
  var frase = entradas.length ? limpiarTexto(entradas[entradas.length - 1].flavor_text) : "";
  if (genero && frase) return genero + ". " + frase;
  return frase || (genero || "");
}

function generoTexto(sp) {
  if (sp.gender_rate === -1) return t("sin_genero");
  var h = sp.gender_rate * 12.5;
  return t("g_macho") + " " + (100 - h) + "% · " + t("g_hembra") + " " + h + "%";
}

// Habilidades con su nombre traducido: [{nombre, oculta}]
function habilidadesAPI(pk) {
  var lista = pk.abilities.slice().sort(function (a, b) { return a.slot - b.slot; });
  return Promise.all(lista.map(function (a) {
    return pedirAPI("ability/" + a.ability.name).then(function (ab) {
      return { nombre: textoIdioma(ab.names) || bonito(a.ability.name), oculta: a.is_hidden };
    }).catch(function () { return { nombre: bonito(a.ability.name), oculta: a.is_hidden }; });
  }));
}

// Estadísticas base: [{clave, valor}] en el orden de siempre
var ORDEN_STATS = [["hp", "st_hp"], ["attack", "st_atk"], ["defense", "st_def"],
                   ["special-attack", "st_spa"], ["special-defense", "st_spd"], ["speed", "st_spe"]];
function statsAPI(pk) {
  var mapa = {};
  pk.stats.forEach(function (s) { mapa[s.stat.name] = s.base_stat; });
  return ORDEN_STATS.map(function (o) { return { clave: o[1], valor: mapa[o[0]] || 0 }; });
}

// ---------- Evolución con condiciones ----------
function unaCondicion(d) {
  var p = [];
  if (d.trigger && d.trigger.name === "trade") p.push(t("c_intercambio"));
  if (d.item) p.push(nombreObjeto(d.item.name));
  if (d.min_level) p.push(t("c_nivel", { n: d.min_level }));
  if (d.min_happiness) p.push(t("c_amistad"));
  if (d.min_affection) p.push(t("c_afecto"));
  if (d.min_beauty) p.push(t("c_belleza"));
  if (d.time_of_day) p.push(t(d.time_of_day === "night" ? "c_noche" : "c_dia"));
  if (d.known_move) p.push(t("c_mov", { m: bonito(d.known_move.name) }));
  if (d.known_move_type) p.push(t("c_mov", { m: bonito(d.known_move_type.name) }));
  if (d.held_item) p.push(t("c_con", { o: nombreObjeto(d.held_item.name) }));
  if (d.location) p.push(t("c_lugar"));
  if (d.gender === 1) p.push(t("c_hembra"));
  if (d.gender === 2) p.push(t("c_macho"));
  if (d.relative_physical_stats === 1) p.push(t("c_ataque_mayor"));
  if (d.relative_physical_stats === -1) p.push(t("c_defensa_mayor"));
  if (d.relative_physical_stats === 0) p.push(t("c_igual"));
  if (d.party_species) p.push(t("c_equipo", { p: bonito(d.party_species.name) }));
  if (d.needs_overworld_rain) p.push(t("c_lluvia"));
  if (d.turn_upside_down) p.push(t("c_boca_abajo"));
  if (!p.length) p.push(d.trigger ? bonito(d.trigger.name) : t("c_especial"));
  return p.join(" · ");
}

function condicionEvolucion(detalles) {
  if (!detalles || !detalles.length) return "";
  var textos = [];
  detalles.slice(0, 2).forEach(function (d) { var x = unaCondicion(d); if (textos.indexOf(x) === -1) textos.push(x); });
  return textos.join(" / ");
}

function construirArbol(nodo) {
  return { n: idDeURL(nodo.species.url), cond: condicionEvolucion(nodo.evolution_details),
           hijos: nodo.evolves_to.map(construirArbol) };
}

function arbolEvolucion(sp) {
  return pedirAPI("evolution-chain/" + idDeURL(sp.evolution_chain.url)).then(function (c) { return construirArbol(c.chain); });
}

// ---------- Formas (Mega, regionales, Gigamax...) ----------
var PALABRAS_FORMA = {
  es: { mega: "Mega", gmax: "Gigamax", alola: "Forma de Alola", galar: "Forma de Galar", hisui: "Forma de Hisui",
        paldea: "Forma de Paldea", x: "X", y: "Y", primal: "Primigenia", origin: "Origen", therian: "Tótem" },
  en: { mega: "Mega", gmax: "Gigantamax", alola: "Alolan Form", galar: "Galarian Form", hisui: "Hisuian Form",
        paldea: "Paldean Form", x: "X", y: "Y", primal: "Primal", origin: "Origin", therian: "Therian" }
};
function nombreForma(slugForma, slugBase) {
  var resto = slugForma.indexOf(slugBase + "-") === 0 ? slugForma.slice(slugBase.length + 1) : slugForma;
  var tabla = PALABRAS_FORMA[idioma] || PALABRAS_FORMA.es;
  return resto.split("-").map(function (w) { return tabla[w] || bonito(w); }).join(" ");
}
function formasAPI(sp) {
  return sp.varieties.filter(function (v) { return !v.is_default; }).map(function (v) {
    return { id: idDeURL(v.pokemon.url), nombre: nombreForma(v.pokemon.name, sp.name) };
  });
}

// ---------- Movimientos ----------
// Juegos de más nuevo a más antiguo: se usan los movimientos del más reciente en el que aparezca
var ORDEN_JUEGOS = ["scarlet-violet", "legends-arceus", "brilliant-diamond-and-shining-pearl", "sword-shield",
  "ultra-sun-ultra-moon", "sun-moon", "omega-ruby-alpha-sapphire", "x-y", "black-2-white-2", "black-white",
  "heartgold-soulsilver", "platinum", "diamond-pearl", "firered-leafgreen", "emerald", "ruby-sapphire",
  "lets-go-pikachu-lets-go-eevee", "crystal", "gold-silver", "yellow", "red-blue"];
var TIPO_API = { normal: "normal", fire: "fuego", water: "agua", grass: "planta", electric: "electrico", ice: "hielo",
  fighting: "lucha", poison: "veneno", ground: "tierra", flying: "volador", psychic: "psiquico", bug: "bicho",
  rock: "roca", ghost: "fantasma", dragon: "dragon", dark: "siniestro", steel: "acero", fairy: "hada" };

function movimientosAPI(pk, maximo) {
  var porJuego = {};
  pk.moves.forEach(function (m) {
    m.version_group_details.forEach(function (d) {
      if (d.move_learn_method.name !== "level-up") return;
      var v = d.version_group.name;
      (porJuego[v] = porJuego[v] || []).push({ slug: m.move.name, nivel: d.level_learned_at });
    });
  });
  var elegido = null;
  for (var i = 0; i < ORDEN_JUEGOS.length && !elegido; i++) if (porJuego[ORDEN_JUEGOS[i]]) elegido = porJuego[ORDEN_JUEGOS[i]];
  if (!elegido) { var claves = Object.keys(porJuego); if (claves.length) elegido = porJuego[claves[claves.length - 1]]; }
  elegido = (elegido || []).sort(function (a, b) { return a.nivel - b.nivel; }).slice(0, maximo || 14);
  return Promise.all(elegido.map(function (m) {
    return pedirAPI("move/" + m.slug).then(function (d) {
      return { nivel: m.nivel, nombre: textoIdioma(d.names) || bonito(m.slug), tipo: TIPO_API[d.type.name] || "normal",
               cat: d.damage_class ? d.damage_class.name : "status", pot: d.power };
    }).catch(function () { return { nivel: m.nivel, nombre: bonito(m.slug), tipo: "normal", cat: "status", pot: null }; });
  })).then(function (filas) { return { filas: filas, total: pk.moves.length }; });
}
