# Pokédex

Pokédex web hecha con HTML, CSS y JavaScript puro (sin librerías ni instalación). Funciona en celular y en escritorio, en español e inglés.

## Qué incluye

- **1025 Pokémon** de las 9 generaciones, con sus **18 tipos**, región y cadena de evolución.
- **9 regiones** (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar y Paldea) con sus Pokémon, iniciales y descripción.
- **Ficha completa** de cada Pokémon, con datos oficiales de [PokeAPI](https://pokeapi.co) cargados al abrirla:
  altura, peso, habilidades (con la oculta), género, hábitat, grupo huevo, ratio de captura, felicidad base,
  **estadísticas base** con barras animadas, **debilidades y resistencias**, **evoluciones con su condición**
  (nivel, piedra, intercambio, amistad...), **formas** (Mega, regionales, Gigamax), **movimientos por nivel**,
  **variocolor** y **grito**.
- **Buscador** (tecla `/`), filtros por tipo (se pueden combinar dos) y por región, **orden** por número o nombre,
  **vista de tarjetas o lista**.
- **Favoritos** guardados en tu navegador, **comparador** de dos Pokémon, **Pokémon aleatorio** y **Pokémon del día**.
- **Modo oscuro** y **español / inglés**.
- **Instalable como app** y con caché para funcionar sin conexión (PWA).
- Música de fondo que empieza apagada, solo suena si la activas y continúa (o sigue en pausa) al cambiar de página, animaciones y respeto a la opción "reducir movimiento" del sistema.
- **Pruebas automáticas** de los datos que GitHub ejecuta en cada subida.

## De dónde salen las imágenes y los datos

- Las **imágenes** de los Pokémon no están en este repositorio ni se descargan: se cargan siempre del repositorio oficial de GitHub
  [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (arte oficial). Si no hay conexión, se muestra una Poké Ball dibujada en SVG.
- Los **datos de la ficha** se piden a PokeAPI al abrirla. Si no hay conexión (o falla), la ficha muestra lo que ya
  está guardado en `js/datos.js` (nombre, tipos, región, evolución y, para los Pokémon #1–#493, descripción, altura,
  peso y habilidad escritos a mano) y las debilidades, que se calculan sin internet.

## Estructura

```
├── index.html            Página principal (tarjetas, buscador, tipos, regiones, herramientas)
├── pokemon.html          Ficha de un Pokémon  (pokemon.html?id=pikachu)
├── comparar.html         Comparador           (comparar.html?a=pikachu&b=raichu)
├── iniciar.py            Inicia la Pokédex en tu computadora con Python
├── manifest.webmanifest  Datos para instalarla como app
├── sw.js                 Service worker (caché y modo sin conexión)
├── css/styles.css        Estilos (diseño original + animaciones + modo oscuro)
├── js/
│   ├── datos.js          Los 1025 Pokémon y sus evoluciones
│   ├── regiones.js       Información de las regiones
│   ├── idioma.js         Textos en español e inglés
│   ├── api.js            Cliente de PokeAPI (stats, evoluciones, movimientos...)
│   ├── tipos.js          Tabla de tipos (debilidades y resistencias)
│   ├── favoritos.js      Favoritos
│   ├── cabecera.js       Encabezado compartido e imágenes
│   ├── index.js          Página principal
│   ├── detalle.js        Ficha
│   ├── comparar.js       Comparador
│   ├── efectos.js        Barra de progreso, tema, idioma, transiciones, service worker
│   └── musica.js         Reproductor de música
├── icons/icon.svg        Icono de la app (dibujado en SVG)
├── audio/                Música de fondo
├── data/                 Los mismos datos en JSON
├── tests/validar_datos.py   Pruebas automáticas
├── tools/completar_datos.py Guarda en datos.js los datos oficiales (opcional, ver abajo)
└── .github/workflows/validar.yml  Ejecuta las pruebas en GitHub
```

## Usarlo en tu computadora

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
python iniciar.py
```

Inicia un servidor local con Python y abre el navegador solo (en `http://localhost:8000`). Para detenerlo, pulsa
Ctrl+C. Necesitas internet para ver las imágenes y los datos completos. No hay que instalar nada.

Si prefieres hacerlo a mano: `python -m http.server 8000` y abre `http://localhost:8000/index.html`.

## Publicarlo en GitHub Pages

1. Crea el repositorio en GitHub y sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "Pokédex"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/pokedex.git
   git push -u origin main
   ```
2. En GitHub: **Settings > Pages > Build and deployment > Source: Deploy from a branch > `main` / `(root)`**.
3. Tu Pokédex quedará en `https://TU_USUARIO.github.io/pokedex/`.

Cada vez que publiques cambios, sube el número de `VERSION` en `sw.js` (por ejemplo, `pokedex-v3`) para que los
navegadores actualicen su caché.

## Pruebas

```bash
python tests/validar_datos.py
```

Comprueba que hay 1025 Pokémon sin saltos ni ids repetidos, que los tipos y las evoluciones son válidos, que las
regiones cubren todos los números, que no falta ningún archivo y que los textos existen en los dos idiomas.

## Opcional: guardar los datos oficiales dentro del proyecto

Para que la ficha de **todos** los Pokémon también funcione sin conexión, con internet puedes ejecutar una vez:

```bash
python tools/completar_datos.py
```

Descarga de PokeAPI la descripción, altura, peso y habilidad en español, y reescribe `js/datos.js` (solo rellena lo que
falta; con `--todo` sobrescribe también lo existente). Tarda unos minutos y no necesita instalar nada.

## Añadir más Pokémon o regiones

La región de cada Pokémon se calcula por su número de Pokédex (`js/regiones.js`). Para añadir uno nuevo, agrégalo al
final de `POKEMON` en `js/datos.js`, una región nueva en `js/regiones.js` y, si aparece un tipo nuevo, en
`js/idioma.js`, `js/tipos.js`, `js/cabecera.js` y `css/styles.css`:

```js
{"n": 1026, "id": "nuevo", "nombre": "Nuevo", "tipos": ["normal"]}
```

## Créditos y aviso

Pokémon y sus nombres, imágenes y música son propiedad de Nintendo, Game Freak y The Pokémon Company. Este es un
proyecto de fans sin fines de lucro. Los datos y las imágenes provienen de [PokeAPI](https://pokeapi.co) y de
[PokeAPI/sprites](https://github.com/PokeAPI/sprites). Revisa que tengas derecho a distribuir la música antes de
publicarla. El código se distribuye bajo licencia MIT (ver `LICENSE`); cambia el nombre en ese archivo por el tuyo.
