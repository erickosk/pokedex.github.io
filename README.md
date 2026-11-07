# Pokédex

Pokédex web hecha con HTML, CSS y JavaScript puro (sin librerías ni instalación).

- **151 Pokémon** de la primera generación, con tipo, descripción, altura, peso, habilidad y cadena de evolución.
- **9 regiones**: Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar y Paldea, con su generación, rango de Pokédex e iniciales.
- Buscador (atajo: tecla `/`), filtro por los 15 tipos y filtro por región.
- Música de fondo que continúa al cambiar de página.
- Animaciones y diseño responsive (celular y escritorio); respeta la opción de "reducir movimiento" del sistema.

> Por ahora solo están cargados los Pokémon de **Kanto (Gen. I)**. Las demás regiones muestran su información y un aviso de "llegará pronto".

## Estructura

```
├── index.html            Página principal (tarjetas, buscador, tipos, regiones)
├── pokemon.html          Ficha de un Pokémon  (pokemon.html?id=pikachu)
├── css/styles.css        Estilos (diseño original + animaciones al final)
├── js/
│   ├── datos.js          Los 151 Pokémon y sus evoluciones
│   ├── regiones.js       Información de las regiones
│   ├── cabecera.js       Encabezado compartido e imágenes con respaldo
│   ├── index.js          Lógica de la página principal
│   ├── detalle.js        Lógica de la ficha
│   ├── efectos.js        Barra de progreso, botón de subir, transiciones
│   └── musica.js         Reproductor de música
├── images/               Imágenes de los Pokémon (WebP)
├── audio/                Música de fondo
├── data/pokemon.json     Mismos datos en JSON (los usa el script de imágenes)
└── tools/descargar_imagenes.py
```

## Usarlo en tu computadora

Abre `index.html` con doble clic, o mejor con un servidor local (así el navegador no bloquea nada):

```bash
python -m http.server 8000
# luego abre http://localhost:8000
```

## Descargar las imágenes que faltan

El repositorio incluye las imágenes de los Pokémon #1 al #20. Para los demás, la web carga automáticamente la imagen oficial desde internet, pero lo ideal es tenerlas en `images/`:

```bash
pip install pillow
python tools/descargar_imagenes.py
```

Descarga las 151 en WebP (solo las que falten). Después haz commit de la carpeta `images/`.

## Publicarlo en GitHub Pages

1. Crea el repositorio en GitHub y sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "Pokédex: 151 Pokémon y regiones"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/pokedex.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**.
3. Tu Pokédex quedará en `https://TU_USUARIO.github.io/pokedex/`.

## Añadir más Pokémon o regiones

Edita `js/datos.js` y agrega un objeto al final de la lista. Para una región nueva usa el campo `region`:

```js
{ n: 152, id: "chikorita", nombre: "Chikorita", tipos: ["planta"], region: "johto",
  desc: "Pokémon Hoja. ...", altura: "0.9 m", peso: "6.4 kg", habilidad: "Espesura" }
```

Los nuevos tipos de Generaciones posteriores (Siniestro, Acero, Hada) necesitan añadirse en `js/cabecera.js` y en `css/styles.css`.

## Créditos y aviso

Pokémon y sus nombres, imágenes y música son propiedad de Nintendo, Game Freak y The Pokémon Company. Este es un proyecto de fans sin fines de lucro. Las imágenes oficiales provienen de [PokeAPI/sprites](https://github.com/PokeAPI/sprites). Revisa que tengas derecho a distribuir la música antes de publicarla. El código se distribuye bajo licencia MIT (ver `LICENSE`).
