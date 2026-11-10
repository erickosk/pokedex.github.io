"""
Completa los datos de los 1025 Pokémon con la información oficial de PokeAPI (en español):
descripción, altura, peso, habilidad y cadenas de evolución.

Uso (desde la carpeta raíz del proyecto, necesita internet):
    python tools/completar_datos.py            # solo rellena lo que falta
    python tools/completar_datos.py --todo     # reescribe también lo que ya hay

Genera:  data/pokemon.json, data/evoluciones.json y js/datos.js
Las respuestas se guardan en tools/.cache/, así que si se corta puedes volver a ejecutarlo.
No necesita instalar nada (solo Python 3.8 o superior).
"""
import concurrent.futures as cf
import json
import os
import sys
import time
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(RAIZ, "tools", ".cache")
API = "https://pokeapi.co/api/v2/"
TOTAL = 1025

TIPOS = {"normal": "normal", "fire": "fuego", "water": "agua", "grass": "planta", "electric": "electrico",
         "ice": "hielo", "fighting": "lucha", "poison": "veneno", "ground": "tierra", "flying": "volador",
         "psychic": "psiquico", "bug": "bicho", "rock": "roca", "ghost": "fantasma", "dragon": "dragon",
         "dark": "siniestro", "steel": "acero", "fairy": "hada"}


def pedir(ruta):
    """Descarga un JSON de PokeAPI (con caché en disco y reintentos)."""
    os.makedirs(CACHE, exist_ok=True)
    archivo = os.path.join(CACHE, ruta.strip("/").replace("/", "_") + ".json")
    if os.path.exists(archivo):
        with open(archivo, encoding="utf-8") as f:
            return json.load(f)
    for intento in range(5):
        try:
            with urllib.request.urlopen(API + ruta.strip("/") + "/", timeout=30) as r:
                datos = json.loads(r.read().decode("utf-8"))
            with open(archivo, "w", encoding="utf-8") as f:
                json.dump(datos, f)
            return datos
        except Exception:
            time.sleep(1 + intento * 2)
    raise RuntimeError("No se pudo descargar " + ruta)


def en_español(lista, clave="name"):
    for e in lista:
        if e["language"]["name"] == "es":
            return e[clave]
    return None


def limpiar(texto):
    return " ".join(texto.replace("\n", " ").replace("\f", " ").replace("\u00ad", "").split())


def construir(n, especie, pokemon, nombre_habilidad):
    """Convierte las respuestas de la API en los campos que usa la web (función pura, fácil de probar)."""
    campos = {}
    genero = en_español(especie.get("genera", []), "genus")
    textos = [e["flavor_text"] for e in especie.get("flavor_text_entries", []) if e["language"]["name"] == "es"]
    frase = limpiar(textos[-1]) if textos else ""
    if genero and frase:
        campos["desc"] = genero + ". " + frase
    elif frase:
        campos["desc"] = frase
    campos["altura"] = "{:.1f} m".format(pokemon["height"] / 10)
    campos["peso"] = "{:.1f} kg".format(pokemon["weight"] / 10)
    if nombre_habilidad:
        campos["habilidad"] = nombre_habilidad
    campos["tipos"] = [TIPOS[t["type"]["name"]] for t in sorted(pokemon["types"], key=lambda t: t["slot"])]
    return campos


def etapas(cadena):
    """Convierte el árbol de evolución de la API en etapas: [[1],[2],[3]] o [[133],[134,135,...]]."""
    niveles = []
    actual = [cadena["chain"]]
    while actual:
        niveles.append([int(c["species"]["url"].rstrip("/").split("/")[-1]) for c in actual])
        actual = [h for c in actual for h in c["evolves_to"]]
    return niveles


def traer(n):
    especie = pedir("pokemon-species/{}".format(n))
    pokemon = pedir("pokemon/{}".format(n))
    habilidades = sorted([a for a in pokemon["abilities"] if not a["is_hidden"]], key=lambda a: a["slot"])
    nombre = None
    if habilidades:
        ab = pedir("ability/" + habilidades[0]["ability"]["name"])
        nombre = en_español(ab.get("names", [])) or habilidades[0]["ability"]["name"].replace("-", " ").title()
    return n, especie, pokemon, nombre


def main():
    todo = "--todo" in sys.argv
    with open(os.path.join(RAIZ, "data", "pokemon.json"), encoding="utf-8") as f:
        datos = json.load(f)
    por_n = {d["n"]: d for d in datos}

    print("Descargando datos de {} Pokémon (puede tardar unos minutos)...".format(TOTAL))
    cadenas_vistas = {}
    hechos = 0
    with cf.ThreadPoolExecutor(max_workers=12) as pool:
        for n, especie, pokemon, habilidad in pool.map(traer, range(1, TOTAL + 1)):
            nuevo = construir(n, especie, pokemon, habilidad)
            destino = por_n[n]
            for k, v in nuevo.items():
                if k == "tipos":
                    destino["tipos"] = v            # los tipos siempre se actualizan
                elif todo or not destino.get(k):
                    destino[k] = v
            url = especie["evolution_chain"]["url"]
            cadenas_vistas[url] = None
            hechos += 1
            if hechos % 100 == 0:
                print("  {} / {}".format(hechos, TOTAL))

    print("Descargando cadenas de evolución...")
    cadenas = []
    usados = set()
    for url in cadenas_vistas:
        ident = url.rstrip("/").split("/")[-1]
        niveles = etapas(pedir("evolution-chain/" + ident))
        if len(niveles) > 1:
            plano = [x for e in niveles for x in e]
            if all(1 <= x <= TOTAL for x in plano) and not (set(plano) & usados):
                usados.update(plano)
                cadenas.append(niveles)
    cadenas.sort(key=lambda c: c[0][0])

    campos = ("n", "id", "nombre", "tipos", "desc", "altura", "peso", "habilidad")
    filas = ["  " + json.dumps({k: d[k] for k in campos if k in d}, ensure_ascii=False, separators=(", ", ": "))
             for d in datos]
    js = ("// Datos de la Pokédex: los 1025 Pokémon de las 9 generaciones.\n"
          "// Generado con tools/completar_datos.py a partir de PokeAPI.\n"
          "var POKEMON = [\n" + ",\n".join(filas) + "\n];\n\n"
          "// Cadenas de evolución: cada etapa es una lista de números de Pokédex\n"
          "var EVOLUCIONES = [\n" + ",\n".join("  " + json.dumps(c, separators=(",", ":")) for c in cadenas) + "\n];\n")
    with open(os.path.join(RAIZ, "js", "datos.js"), "w", encoding="utf-8") as f:
        f.write(js)
    with open(os.path.join(RAIZ, "data", "pokemon.json"), "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
    with open(os.path.join(RAIZ, "data", "evoluciones.json"), "w") as f:
        json.dump(cadenas, f, separators=(",", ":"))
    completos = sum(1 for d in datos if d.get("desc"))
    print("Listo: {} Pokémon con descripción, {} cadenas de evolución.".format(completos, len(cadenas)))


if __name__ == "__main__":
    main()
