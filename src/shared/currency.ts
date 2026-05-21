/**
 * Formatea un número como pesos argentinos (ARS).
 * Ejemplo: 42850.20 → "$42.850,20"
 */
export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea un número sin símbolo de moneda, con separador de miles.
 * Ejemplo: 42850.20 → "42.850,20"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
