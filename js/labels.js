// labels.js
// Crea la capa de etiquetas a partir de ciudades.geojson.
// Usa bindTooltip con className para estilizar diferente departamentos/ciudades.

export function createLabelsLayer(map, ciudadesGeo) {
  const labelsLayer = L.geoJSON(ciudadesGeo, {
    pointToLayer: function(feature, latlng) {
      const tipo = feature.properties.tipo;
      return L.marker(latlng, {
        opacity: 0,
        interactive: false // no interfiere con eventos
      }).bindTooltip(feature.properties.nombre, {
        permanent: true,
        direction: "center",
        className: tipo === "departamento" ? "label-departamento" : "label-ciudad"
      });
    }
  }).addTo(map);

  return labelsLayer;
}