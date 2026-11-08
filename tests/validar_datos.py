"""
Pruebas automáticas de la Pokédex. Ejecútalas con:   python tests/validar_datos.py
(GitHub las ejecuta solas en cada subida gracias a .github/workflows/validar.yml)

Comprueban que los datos están completos y son coherentes, y que no falta ningún archivo.
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errores = []


def comprobar(condicion, mensaje):
    if not condicion:
        errores.append(mensaje)


def leer(ruta):
    with open(os.path.join(RAIZ, ruta), encoding="utf-8") as f:
        return f.read()


def extraer_json(texto, variable):
    inicio = texto.index("var " + variable + " = ") + len("var " + variable + " = ")
    fin = texto.index("\n];", inicio) + 3
    return json.loads(texto[inicio:fin - 1])


# ---------- Datos de los Pokémon ----------
datos = leer("js/datos.js")
pokemon = extraer_json(datos, "POKEMON")
evoluciones = extraer_json(datos, "EVOLUCIONES")
TIPOS = set("normal fuego agua planta electrico hielo lucha veneno tierra volador psiquico bicho roca fantasma "
            "dragon siniestro acero hada".split())

comprobar(len(pokemon) == 1025, "Debe haber 1025 Pokémon y hay {}".format(len(pokemon)))
comprobar([p["n"] for p in pokemon] == list(range(1, len(pokemon) + 1)), "Los números de Pokédex deben ser 1, 2, 3... sin saltos")
ids = [p["id"] for p in pokemon]
comprobar(len(set(ids)) == len(ids), "Hay ids repetidos")
for p in pokemon:
    comprobar(re.fullmatch(r"[a-z0-9-]+", p["id"]) is not None, "Id no válido: {}".format(p["id"]))
    comprobar(p.get("nombre"), "Falta el nombre del #{}".format(p["n"]))
    comprobar(1 <= len(p["tipos"]) <= 2 and set(p["tipos"]) <= TIPOS, "Tipos no válidos en #{} {}".format(p["n"], p["nombre"]))
    comprobar(len(set(p["tipos"])) == len(p["tipos"]), "Tipo repetido en #{}".format(p["n"]))

# ---------- Evoluciones ----------
vistos = set()
for cadena in evoluciones:
    comprobar(len(cadena) >= 2, "Cadena demasiado corta: {}".format(cadena))
    for etapa in cadena:
        for n in etapa:
            comprobar(1 <= n <= len(pokemon), "Número fuera de rango en una evolución: {}".format(n))
            comprobar(n not in vistos, "El #{} aparece en dos cadenas de evolución".format(n))
            vistos.add(n)

# ---------- Regiones ----------
regiones = leer("js/regiones.js")
rangos = re.findall(r'id: "(\w+)",\s*nombre: "(\w+)",\s*gen: "(\w+)",\s*desde: (\d+),\s*hasta: (\d+),\s*total: (\d+)', regiones)
comprobar(len(rangos) == 9, "Deben ser 9 regiones y hay {}".format(len(rangos)))
siguiente = 1
for _, nombre, _, desde, hasta, total in rangos:
    comprobar(int(desde) == siguiente, "La región {} debería empezar en #{}".format(nombre, siguiente))
    comprobar(int(hasta) - int(desde) + 1 == int(total), "El total de {} no coincide con su rango".format(nombre))
    siguiente = int(hasta) + 1
comprobar(siguiente - 1 == len(pokemon), "Las regiones deben cubrir hasta el #{}".format(len(pokemon)))

# ---------- Archivos necesarios ----------
necesarios = ["index.html", "pokemon.html", "comparar.html", "css/styles.css", "manifest.webmanifest", "sw.js",
              "icons/icon.svg", "iniciar.py", "audio/musica-pokemon.mp3", "README.md", "LICENSE"]
for ruta in necesarios:
    comprobar(os.path.exists(os.path.join(RAIZ, ruta)), "Falta el archivo " + ruta)

sw = leer("sw.js")
basicos = re.search(r"var BASICOS = \[(.*?)\];", sw, re.S).group(1)
for ruta in re.findall(r'"([^"]+)"', basicos):
    if ruta != "./":
        comprobar(os.path.exists(os.path.join(RAIZ, ruta)), "sw.js lista un archivo que no existe: " + ruta)

for pagina in ("index.html", "pokemon.html", "comparar.html"):
    for ruta in re.findall(r'(?:src|href)="((?:js|css|icons)/[^"]+)"', leer(pagina)):
        comprobar(os.path.exists(os.path.join(RAIZ, ruta)), "{} usa un archivo que no existe: {}".format(pagina, ruta))

try:
    json.loads(leer("manifest.webmanifest"))
except ValueError as e:
    errores.append("manifest.webmanifest no es un JSON válido: {}".format(e))

# ---------- Textos en los dos idiomas ----------
idioma = leer("js/idioma.js")
es = set(re.findall(r'\b(\w+): "', idioma[idioma.index("es: {"):idioma.index("en: {")]))
en = set(re.findall(r'\b(\w+): "', idioma[idioma.index("en: {"):idioma.index("var TIPOS_NOMBRE")]))
comprobar(es == en, "Faltan textos en un idioma: {}".format(sorted(es ^ en)))

completos = sum(1 for p in pokemon if p.get("desc"))
print("Pokémon: {} | con ficha local completa: {} | cadenas de evolución: {}".format(len(pokemon), completos, len(evoluciones)))
if errores:
    print("\nERRORES ({}):".format(len(errores)))
    for e in errores[:30]:
        print(" -", e)
    sys.exit(1)
print("Todo correcto.")
