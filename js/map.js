// Este módulo crea el objeto mapa de Leaflet y añade la capa base.
// Exportamos una función createMap() para que el orquestador (main.js) la use.

export function createMap() {
  // Crear mapa centrado en Magdalena. Si cambias centro/zoom, hazlo aquí.
  const map = L.map('map', {
    center: [10.8, -74.2],
    zoom: 8,
    minZoom: 8,
    maxZoom: 9,
    zoomControl: false,
    scrollWheelZoom: true, 
    maxBoundsViscosity: 0.8,
    inertia: true
  });

  // Capa base minimalista
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CartoDB'
  }).addTo(map);

  const sliderContainer = document.querySelector(".slider-container");

  L.DomEvent.disableClickPropagation(sliderContainer);
  L.DomEvent.disableScrollPropagation(sliderContainer);
  return map;
}