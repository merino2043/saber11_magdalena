// Inicializa el slider y los botones prev/next/reset.
// onChange(year) es la función que se llamará cada vez que cambie el año.

export function setupTimeControls(years, onChange) {
  // Asumimos que el HTML ya tiene #yearSlider, #yearLabel, #prevYear, #nextYear, #resetYear
  const yearSlider = document.getElementById("yearSlider");
  const yearLabel = document.getElementById("yearLabel");
  const prevBtn = document.getElementById("prevYear");
  const nextBtn = document.getElementById("nextYear");
  const resetBtn = document.getElementById("resetYear");

  // Guardamos estado local (índice)
  let currentIndex = 0;

  // Configurar slider
  yearSlider.min = 0;
  yearSlider.max = years.length - 1;
  yearSlider.step = 1;
  yearSlider.value = 0;
  yearLabel.textContent = years[0];

  // Función auxiliar local para sincronizar vista
  function goToIndex(idx) {
    currentIndex = idx;
    const selectedYear = years[currentIndex];
    yearSlider.value = currentIndex;
    yearLabel.textContent = selectedYear;
    onChange(selectedYear);
    // Desactivar botones prev/next en los extremos (mejora UX)
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === years.length - 1;
  }

  // Eventos
  yearSlider.addEventListener('input', function() {
    goToIndex(parseInt(this.value));
  });

  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function() {
    if (currentIndex < years.length - 1) goToIndex(currentIndex + 1);
  });

  resetBtn.addEventListener('click', function() {
    goToIndex(0);
  });

  // Inicializar estado
  goToIndex(0);

  // Exponer API si se necesita
  return {
    goToIndex
  };
}