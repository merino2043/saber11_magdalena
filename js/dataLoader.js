// Este módulo encapsula la carga de todos los archivos (resultados + geojsons).
// Devuelve un objeto con todo lo necesario para inicializar la app.
//
// Notas:
// - Usamos async/await para escribir código asíncrono de forma secuencial.
// - fetch() devuelve una Promise. await pausa la ejecución hasta la respuesta.

export async function loadAllData() {
  // Rutas relativas desde viz/
  const resultadosPath = 'data/resultados.json';
  const municipiosPath = 'data/municipios.geojson';
  const puntosPath = 'data/municipios_centroid.geojson';
  const ciudadesPath = 'data/ciudades.geojson';

  // Hacemos fetch de todos los archivos en paralelo (más rápido).
  const [resRes, munRes, ptsRes, ciuRes] = await Promise.all([
    fetch(resultadosPath),
    fetch(municipiosPath),
    fetch(puntosPath),
    fetch(ciudadesPath)
  ]);

  // Convertir respuestas a JSON
  const resultados = await resRes.json();
  const municipiosGeo = await munRes.json();
  const puntosGeo = await ptsRes.json();
  const ciudadesGeo = await ciuRes.json();

  // Calcular rango global de puntajes (todos los años, todos los municipios)
  const todosLosValores = Object.values(resultados)
    .flatMap(m => Object.values(m.data).map(d => d.puntaje))
    .filter(v => v !== undefined && !isNaN(v));

  const GLOBAL_MIN = Math.min(...todosLosValores);
  const GLOBAL_MAX = Math.max(...todosLosValores);

  // Obtener lista de años (ordenada)
  const firstMunicipio = Object.keys(resultados)[0];
  const years = Object.keys(resultados[firstMunicipio].data).sort((a,b) => a - b);

  // Devolvemos todo en un objeto
  return {
    resultados,
    municipiosGeo,
    puntosGeo,
    ciudadesGeo,
    GLOBAL_MIN,
    GLOBAL_MAX,
    years
  };
}