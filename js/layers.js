// Gestión de capas de municipios y puntos (centroides)
// Arquitectura:
// - Tooltip hover (bindTooltip normal)
// - Tooltip selección independiente (L.tooltip permanente)

/* ======================================================
   Variables de módulo (estado interno)
====================================================== */

let selectedTooltip = null;
let selectedMarker = null;
let currentYear = null;


/* ======================================================
   MUNICIPIOS
====================================================== */

export function createMunicipiosLayer(map, municipiosGeo) {
  const layer = L.geoJSON(municipiosGeo, {
    style: {
      color: "#82d2eb",
      weight: 1,
      fillColor: "#e0f6fd80",
      fillOpacity: 1
    }
  }).addTo(map);

  const bounds = layer.getBounds();
  map.fitBounds(bounds);

  const paddedBounds = bounds.pad(0.05);
  map.setMaxBounds(paddedBounds);

  map.options.bounceAtZoomLimits = true;
  map.options.inertia = true;
  map.options.inertiaDeceleration = 3000;

  return layer;
}


/* ======================================================
   PUNTOS (CREACIÓN)
====================================================== */

export function createPuntosLayer(
  map,
  puntosGeo,
  resultados,
  year,
  getColor,
  getRadius,
  GLOBAL_MIN,
  GLOBAL_MAX
) {

  currentYear = year;
  const layer = L.geoJSON(puntosGeo, {

    pointToLayer: function (feature, latlng) {

      const dane = feature.properties.municipio_dane;
      const datosMunicipio = resultados[dane]?.data[currentYear];

      let color = "#dddddd";
      let radius = 3;

      if (datosMunicipio) {
        const puntaje = Number(datosMunicipio.puntaje);
        const estudiantes = Number(datosMunicipio.estudiantes);

        color = getColor(puntaje, GLOBAL_MIN, GLOBAL_MAX);
        radius = getRadius(estudiantes);
      }

      const marker = L.circleMarker(latlng, {
        radius: radius,
        color: "#333",
        weight: 0.5,
        fillColor: color,
        fillOpacity: 0.8
      });

      // ============================
      // TOOLTIP HOVER (simple)
      // ============================

      if (datosMunicipio) {

        const puntaje = Number(datosMunicipio.puntaje);
        const estudiantes = Number(datosMunicipio.estudiantes);

        const htmlHover = `
          <div class="tooltip-content">
            <div class="tooltip-title">${feature.properties.nombre}</div>
            <div><strong>Año:</strong> ${year}</div>
            <div><strong>Puntaje:</strong> ${puntaje.toFixed(2)}</div>
            <div><strong>Estudiantes:</strong> ${estudiantes.toLocaleString("es-CO")}</div>
          </div>
        `;

        marker.bindTooltip(htmlHover, {
          direction: "top",
          offset: [0, -8],
          opacity: 0.9
        });

        // ============================
        // TOOLTIP SELECCIÓN (click)
        // ============================

        marker.on("click", function (e) {
          
          const datosMunicipio = resultados[dane]?.data[currentYear];
          L.DomEvent.stopPropagation(e);

          // Cerrar selección anterior
          if (selectedTooltip) {
            map.removeLayer(selectedTooltip);
            selectedTooltip = null;
            selectedMarker = null;
          }

          const htmlClick = `
            <div class="tooltip-content tooltip-selected">
              <div class="tooltip-title">${feature.properties.nombre}</div>
              <div><strong>Año:</strong> ${currentYear}</div>
              <div><strong>Estudiantes:</strong> ${datosMunicipio.estudiantes.toLocaleString("es-CO")}</div>
              <div><strong>Puntaje promedio:</strong> ${datosMunicipio.puntaje.toFixed(2)}</div>
              <hr>
              <div><strong>Mínimo:</strong> ${datosMunicipio.min}</div>
              <div><strong>Máximo:</strong> ${datosMunicipio.max}</div>
              <div><strong>Desv. estándar:</strong> ${datosMunicipio.std.toFixed(2)}</div>
            </div>
          `;

          selectedTooltip = L.tooltip({
            permanent: true,
            direction: "top",
            offset: [0, -8],
            className: "tooltip-selected-wrapper"
          })
            .setLatLng(marker.getLatLng())
            .setContent(htmlClick)
            .addTo(map);

          selectedMarker = marker;
        });
      }

      return marker;
    }

  }).addTo(map);

  // Cerrar selección al hacer click fuera
  map.on("click", function () {
    if (selectedTooltip) {
      map.removeLayer(selectedTooltip);
      selectedTooltip = null;
      selectedMarker = null;
    }
  });

  return layer;
}


/* ======================================================
   PUNTOS (ACTUALIZACIÓN POR AÑO)
====================================================== */

export function updatePuntosLayer(
  puntosLayer,
  resultados,
  year,
  getColor,
  getRadius,
  GLOBAL_MIN,
  GLOBAL_MAX
) {

  currentYear = year;
  if (!puntosLayer) return;

  puntosLayer.eachLayer(function (layer) {

    const dane = layer.feature.properties.municipio_dane;
    const datosMunicipio = resultados[dane]?.data[currentYear];

    if (datosMunicipio) {

      const puntaje = Number(datosMunicipio.puntaje);
      const estudiantes = Number(datosMunicipio.estudiantes);

      layer.setStyle({
        fillColor: getColor(puntaje, GLOBAL_MIN, GLOBAL_MAX),
        fillOpacity: 0.8
      });

      layer.setRadius(getRadius(estudiantes));

      // Actualizar contenido del hover
      if (layer.getTooltip()) {

        layer.setTooltipContent(`
          <div class="tooltip-content">
            <div class="tooltip-title">${layer.feature.properties.nombre}</div>
            <div><strong>Año:</strong> ${currentYear}</div>
            <div><strong>Puntaje:</strong> ${puntaje.toFixed(2)}</div>
            <div><strong>Estudiantes:</strong> ${estudiantes.toLocaleString("es-CO")}</div>
          </div>
        `);
      }

      // Si es el seleccionado, actualizar tooltip permanente
      if (selectedMarker && layer === selectedMarker && selectedTooltip) {

        selectedTooltip
          .setLatLng(layer.getLatLng())
          .setContent(`
            <div class="tooltip-content tooltip-selected">
              <div class="tooltip-title">${layer.feature.properties.nombre}</div>
              <div><strong>Año:</strong> ${currentYear}</div>
              <div><strong>Estudiantes:</strong> ${datosMunicipio.estudiantes.toLocaleString("es-CO")}</div>
              <div><strong>Puntaje promedio:</strong> ${datosMunicipio.puntaje.toFixed(2)}</div>
              <hr>
              <div><strong>Mínimo:</strong> ${datosMunicipio.min}</div>
              <div><strong>Máximo:</strong> ${datosMunicipio.max}</div>
              <div><strong>Desv. estándar:</strong> ${datosMunicipio.std.toFixed(2)}</div>
            </div>
          `);
      }

    } else {

      layer.setRadius(0);

      if (selectedMarker && layer === selectedMarker) {
        if (selectedTooltip) {
          map.removeLayer(selectedTooltip);
        }
        selectedTooltip = null;
        selectedMarker = null;
      }
    }

  });
}