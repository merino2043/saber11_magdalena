// Aquí van las funciones que calculan color y radio.
// Se separa la lógica visual para mantener el código modular y fácil de testear.

/**
 * getColor(puntaje, min, max)
 * - puntaje: número
 * - min/max: dominio global
 * Devuelve un color RGB interpolado entre rojo -> amarillo -> azul.
 *
 * Nota: normalizamos t entre 0 y 1 y luego interpolamos.
 */
export function getColor(puntaje, GLOBAL_MIN, GLOBAL_MAX) {
  // Evitar división por cero, y normalizar entre 0 y 1
  let t = (puntaje - GLOBAL_MIN) / (GLOBAL_MAX - GLOBAL_MIN);
  t = Math.max(0, Math.min(1, t));
  return interpolarColor(t);
}

/**
 * interpolarColor(t)
 * - t: número entre 0 y 1
 * Retorna un color en rgb usando un gradiente simple:
 * 0 -> rojo, 0.5 -> amarillo, 1 -> azul
 */
export function interpolarColor(t) {
  if (t <= 0.5) {
    const r = 255;
    const g = Math.round(255 * (t * 2)); // crece de 0 a 255
    const b = 0;
    return `rgb(${r},${g},${b})`;
  } else {
    const r = Math.round(255 * (1 - (t - 0.5) * 2)); // decae de 255 a 0
    const g = Math.round(255 * (1 - (t - 0.5) * 2));
    const b = 255;
    return `rgb(${r},${g},${b})`;
  }
}

/**
 * getRadius(estudiantes)
 * - usa log(estudiantes + 1) para mitigar asimetría
 * - devuelve un radio en píxeles
 */
export function getRadius(estudiantes) {
  // +1 evita log(0)
  return Math.max(2, Math.log(estudiantes + 1) * 2.5);
}