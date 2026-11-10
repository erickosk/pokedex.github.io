// ============================================
// IDIOMAS (idioma.js)
// Textos de la interfaz en español e inglés. Para añadir un texto nuevo:
// agrégalo en las dos listas con la misma clave y úsalo con t("clave").
// ============================================

var idioma = "es";
try { idioma = localStorage.getItem("pokedex_idioma") || ((navigator.language || "es").slice(0, 2) === "en" ? "en" : "es"); } catch (e) {}
document.documentElement.lang = idioma;

var TXT = {
  es: {
    todos: "Todos", todas: "Todas", buscar: "buscar", atajo: "Pulsa <kbd>/</kbd> para buscar",
    mostrando: "Mostrando <b>{a}</b> de <b>{b}</b> Pokémon",
    elemento: "Elemento / Tipo", elige_tipo: "Elige un tipo en la barra de arriba.", ejemplos: "Ejemplos:",
    regiones: "Regiones", herramientas: "Herramientas", orden: "Ordenar por",
    ord_num: "Número", ord_az: "Nombre (A-Z)", ord_za: "Nombre (Z-A)",
    tambien: "También de tipo", cualquiera: "Cualquiera", vista: "Vista", v_tarjetas: "Tarjetas", v_lista: "Lista",
    solo_fav: "Solo favoritos", aleatorio: "Aleatorio", comparar: "Comparar", del_dia: "Pokémon del día",
    sin_res: "Sin resultados", sin_res_txt: "No hay ningún Pokémon que coincida con tu búsqueda.",
    sin_fav: "Aún no tienes favoritos", sin_fav_txt: "Pulsa la estrella de una tarjeta para guardarlo aquí.",
    generacion: "Generación", pokedex_nac: "Pokédex nacional", pokemon_nuevos: "Pokémon nuevos", iniciales: "Iniciales",
    cargando_txt: "Cargando...", tema: "Cambiar tema", idioma_btn: "Cambiar idioma", subir: "Volver arriba",
    // Ficha
    volver: "Volver a la Pokédex", no_enc: "¿Y ese Pokémon?", no_enc_txt: "No encontramos ese Pokémon en la Pokédex.",
    numero: "Número", tipo: "Tipo", region: "Región", altura: "Altura", peso: "Peso",
    habilidades: "Habilidades", g_macho: "Macho", g_hembra: "Hembra", oculta: "oculta", genero: "Género", sin_genero: "Sin género",
    habitat: "Hábitat", huevo: "Grupo huevo", captura: "Ratio de captura", felicidad: "Felicidad base",
    stats: "Estadísticas base", total: "Total", debilidades: "Debilidades y resistencias",
    debil: "Débil contra", resiste: "Resiste", inmune: "Inmune a", sin_datos: "Ninguno",
    movimientos: "Movimientos por nivel", mov_nivel: "Nv.", mov_nombre: "Movimiento", mov_tipo: "Tipo", mov_cat: "Cat.", mov_pot: "Pot.",
    mov_total: "Aprende {n} movimientos en total (aquí, los de subida de nivel más recientes).",
    formas: "Otras formas", mas_formas: "y {n} más", evolucion: "Evolución", no_evoluciona: "Este Pokémon no evoluciona.",
    variocolor: "Variocolor", normal_btn: "Normal", grito: "Grito", fav_add: "Añadir a favoritos", fav_quitar: "Quitar de favoritos",
    error_api: "No se pudieron cargar estos datos en línea. Revisa tu conexión a internet.",
    cargando: "Cargando datos...",
    fisico: "Físico", especial: "Especial", estado: "Estado",
    st_hp: "PS", st_atk: "Ataque", st_def: "Defensa", st_spa: "At. Esp.", st_spd: "Def. Esp.", st_spe: "Velocidad",
    // Condiciones de evolución
    c_nivel: "Nv. {n}", c_amistad: "Amistad", c_afecto: "Cariño", c_belleza: "Belleza", c_dia: "de día", c_noche: "de noche",
    c_mov: "conociendo {m}", c_con: "con {o}", c_lugar: "en un lugar especial", c_hembra: "hembra", c_macho: "macho",
    c_intercambio: "Intercambio", c_especial: "Especial", c_lluvia: "con lluvia", c_boca_abajo: "consola boca abajo",
    c_equipo: "con {p} en el equipo", c_ataque_mayor: "Ataque > Defensa", c_defensa_mayor: "Defensa > Ataque", c_igual: "Ataque = Defensa",
    // Comparador
    comp_titulo: "Comparador", comp_a: "Pokémon 1", comp_b: "Pokémon 2", comp_ir: "Comparar", comp_cambiar: "Intercambiar",
    comp_vacio: "Elige dos Pokémon para compararlos.", comp_noenc: "No encontramos «{x}».",
    // Regiones
    gen_tabla: "Generación {g}"
  },
  en: {
    todos: "All", todas: "All", buscar: "search", atajo: "Press <kbd>/</kbd> to search",
    mostrando: "Showing <b>{a}</b> of <b>{b}</b> Pokémon",
    elemento: "Element / Type", elige_tipo: "Pick a type in the bar above.", ejemplos: "Examples:",
    regiones: "Regions", herramientas: "Tools", orden: "Sort by",
    ord_num: "Number", ord_az: "Name (A-Z)", ord_za: "Name (Z-A)",
    tambien: "Also type", cualquiera: "Any", vista: "View", v_tarjetas: "Cards", v_lista: "List",
    solo_fav: "Favorites only", aleatorio: "Random", comparar: "Compare", del_dia: "Pokémon of the day",
    sin_res: "No results", sin_res_txt: "No Pokémon matches your search.",
    sin_fav: "No favorites yet", sin_fav_txt: "Tap the star on a card to save it here.",
    generacion: "Generation", pokedex_nac: "National Pokédex", pokemon_nuevos: "New Pokémon", iniciales: "Starters",
    cargando_txt: "Loading...", tema: "Switch theme", idioma_btn: "Switch language", subir: "Back to top",
    volver: "Back to the Pokédex", no_enc: "Who's that Pokémon?", no_enc_txt: "We couldn't find that Pokémon in the Pokédex.",
    numero: "Number", tipo: "Type", region: "Region", altura: "Height", peso: "Weight",
    habilidades: "Abilities", g_macho: "Male", g_hembra: "Female", oculta: "hidden", genero: "Gender", sin_genero: "Genderless",
    habitat: "Habitat", huevo: "Egg group", captura: "Catch rate", felicidad: "Base happiness",
    stats: "Base stats", total: "Total", debilidades: "Weaknesses and resistances",
    debil: "Weak to", resiste: "Resists", inmune: "Immune to", sin_datos: "None",
    movimientos: "Moves by level", mov_nivel: "Lv.", mov_nombre: "Move", mov_tipo: "Type", mov_cat: "Cat.", mov_pot: "Pow.",
    mov_total: "Learns {n} moves in total (shown: most recent level-up moves).",
    formas: "Other forms", mas_formas: "and {n} more", evolucion: "Evolution", no_evoluciona: "This Pokémon does not evolve.",
    variocolor: "Shiny", normal_btn: "Normal", grito: "Cry", fav_add: "Add to favorites", fav_quitar: "Remove from favorites",
    error_api: "Couldn't load this data online. Check your internet connection.",
    cargando: "Loading data...",
    fisico: "Physical", especial: "Special", estado: "Status",
    st_hp: "HP", st_atk: "Attack", st_def: "Defense", st_spa: "Sp. Atk", st_spd: "Sp. Def", st_spe: "Speed",
    c_nivel: "Lv. {n}", c_amistad: "Friendship", c_afecto: "Affection", c_belleza: "Beauty", c_dia: "daytime", c_noche: "nighttime",
    c_mov: "knowing {m}", c_con: "holding {o}", c_lugar: "at a special place", c_hembra: "female", c_macho: "male",
    c_intercambio: "Trade", c_especial: "Special", c_lluvia: "in rain", c_boca_abajo: "console upside down",
    c_equipo: "with {p} in the party", c_ataque_mayor: "Attack > Defense", c_defensa_mayor: "Defense > Attack", c_igual: "Attack = Defense",
    comp_titulo: "Comparator", comp_a: "Pokémon 1", comp_b: "Pokémon 2", comp_ir: "Compare", comp_cambiar: "Swap",
    comp_vacio: "Pick two Pokémon to compare them.", comp_noenc: "We couldn't find “{x}”.",
    gen_tabla: "Generation {g}"
  }
};

// Nombres de los tipos en cada idioma
var TIPOS_NOMBRE = {
  es: { normal: "Normal", fuego: "Fuego", agua: "Agua", planta: "Planta", electrico: "Eléctrico", hielo: "Hielo",
        lucha: "Lucha", veneno: "Veneno", tierra: "Tierra", volador: "Volador", psiquico: "Psíquico", bicho: "Bicho",
        roca: "Roca", fantasma: "Fantasma", dragon: "Dragón", siniestro: "Siniestro", acero: "Acero", hada: "Hada" },
  en: { normal: "Normal", fuego: "Fire", agua: "Water", planta: "Grass", electrico: "Electric", hielo: "Ice",
        lucha: "Fighting", veneno: "Poison", tierra: "Ground", volador: "Flying", psiquico: "Psychic", bicho: "Bug",
        roca: "Rock", fantasma: "Ghost", dragon: "Dragon", siniestro: "Dark", acero: "Steel", hada: "Fairy" }
};

// Devuelve el texto de una clave en el idioma actual; {a} {b}... se sustituyen con 'vars'
function t(clave, vars) {
  var s = (TXT[idioma] && TXT[idioma][clave]) || TXT.es[clave] || clave;
  if (vars) for (var k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}

// Traduce los textos fijos del HTML (los que llevan data-i18n="clave")
function traducirPagina() {
  document.querySelectorAll("[data-i18n]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
  document.querySelectorAll("[data-i18n-title]").forEach(function (el) { el.title = t(el.getAttribute("data-i18n-title")); });
}

function cambiarIdioma() {
  try { localStorage.setItem("pokedex_idioma", idioma === "es" ? "en" : "es"); } catch (e) {}
  window.location.reload();
}
