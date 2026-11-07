"""
Descarga las imágenes oficiales de los 151 Pokémon a la carpeta images/ en formato WebP.

Uso (desde la carpeta raíz del proyecto):
    pip install pillow
    python tools/descargar_imagenes.py

- Solo descarga las que faltan, así que puedes ejecutarlo varias veces.
- Si no tienes Pillow, guarda las imágenes en PNG (la web también las encuentra
  gracias al respaldo en internet, pero WebP pesa mucho menos).
"""
import io
import json
import os
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{}.png"

try:
    from PIL import Image
except ImportError:
    Image = None
    print("Aviso: Pillow no está instalado. Instálalo con 'pip install pillow' para convertir a WebP.")

with open(os.path.join(RAIZ, "data", "pokemon.json"), encoding="utf-8") as f:
    pokemon = json.load(f)

carpeta = os.path.join(RAIZ, "images")
os.makedirs(carpeta, exist_ok=True)

nuevas = 0
for p in pokemon:
    destino = os.path.join(carpeta, p["id"] + (".webp" if Image else ".png"))
    if os.path.exists(destino):
        continue
    try:
        datos = urllib.request.urlopen(URL.format(p["n"]), timeout=30).read()
        if Image:
            img = Image.open(io.BytesIO(datos)).convert("RGBA")
            img.thumbnail((475, 475))
            img.save(destino, "WEBP", quality=88, method=6)
        else:
            with open(destino, "wb") as out:
                out.write(datos)
        nuevas += 1
        print("OK  #{:03d} {}".format(p["n"], p["nombre"]))
    except Exception as e:
        print("ERROR #{:03d} {}: {}".format(p["n"], p["nombre"], e))

print("\nListo: {} imágenes nuevas.".format(nuevas))
