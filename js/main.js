// main.js
// Este archivo orquesta la aplicación. Es el único archivo que se carga con <script type="module">.
// Aquí usamos import para traer módulos que separan responsabilidades.

import { createMap } from './map.js';
import { loadAllData } from './dataLoader.js';
import { getColor, getRadius } from './styles.js';
import { createMunicipiosLayer, createPuntosLayer, updatePuntosLayer } from './layers.js';
import { createLabelsLayer } from './labels.js';
import { setupTimeControls } from './timeControl.js';

let currentYear = null;

async function init() {
  // 1) Crear mapa
  const map = createMap();

  // 2) Cargar todos los datos (async)
  const {
    resultados,
    municipiosGeo,
    puntosGeo,
    ciudadesGeo,
    GLOBAL_MIN,
    GLOBAL_MAX,
    years
  } = await loadAllData();

  console.log("GLOBAL_MIN:", GLOBAL_MIN);
  console.log("GLOBAL_MAX:", GLOBAL_MAX);

  // 3) Crear capas
  const municipiosLayer = createMunicipiosLayer(map, municipiosGeo);
  // Guardamos la capa de puntos y la exponemos para actualizar
  let puntosLayer = createPuntosLayer(map, puntosGeo, resultados, years[0], getColor, getRadius, GLOBAL_MIN, GLOBAL_MAX);

  // 4) Labels (ciudades y departamentos)
  createLabelsLayer(map, ciudadesGeo);

  // 5) Setup controles temporales
  setupTimeControls(years, (selectedYear) => {
    // cuando el control llama aquí, actualizamos la capa de puntos con el nuevo año
    updatePuntosLayer(puntosLayer, resultados, selectedYear, getColor, getRadius, GLOBAL_MIN, GLOBAL_MAX);
    // (Los polígonos están neutros en este diseño)
  });

  // 6) Invocar primera actualización explícita con year inicial
  updatePuntosLayer(puntosLayer, resultados, years[0], getColor, getRadius, GLOBAL_MIN, GLOBAL_MAX);
}

// Iniciar la aplicación y capturar errores
init().catch(err => {
  console.error("Error inicializando la app:", err);
});