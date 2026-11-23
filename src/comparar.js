const { ventas } = require("./datos");
const { totalCiudadCadena, totalCiudadUnaPasada } = require("./analitica");
const { generarVentas } = require("./generador");

function comparar(nombre, resultadoCadena, resultadoUnaPasada) {
  const estado = resultadoCadena === resultadoUnaPasada ? "OK" : "DIFERENTE";
  console.log(estado.padEnd(10), nombre.padEnd(18), "cadena:", resultadoCadena, "| una pasada:", resultadoUnaPasada);
}

console.log(" con los 12 datos del dia 1");
comparar("Medellín", totalCiudadCadena(ventas, "Medellín"), totalCiudadUnaPasada(ventas, "Medellín"));
comparar("  MEDELLÍN ", totalCiudadCadena(ventas, "  MEDELLÍN "), totalCiudadUnaPasada(ventas, "  MEDELLÍN "));
comparar("Quibdó (no existe)", totalCiudadCadena(ventas, "Quibdó"), totalCiudadUnaPasada(ventas, "Quibdó"));
comparar("arreglo vacio", totalCiudadCadena([], "Cali"), totalCiudadUnaPasada([], "Cali"));

console.log("\n con 10.000 ventas generadas");
const datos = generarVentas(10000);
const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira", "Barranquilla", "Quibdó"];
for (const ciudad of ciudades) {
  comparar(ciudad, totalCiudadCadena(datos, ciudad), totalCiudadUnaPasada(datos, ciudad));
}

function medirMs(funcion, lista, ciudad) {
  let menor = null;
  for (let vez = 0; vez < 5; vez++) {
    const inicio = performance.now();
    funcion(lista, ciudad);
    const ms = performance.now() - inicio;
    if (menor === null || ms < menor) {
      menor = ms;
    }
  }
  return menor;
}

totalCiudadCadena(datos, "Cali");
totalCiudadUnaPasada(datos, "Cali");

console.log("\n tiempos");
const tabla = [];
for (const n of [10000, 100000, 1000000]) {
  const lista = generarVentas(n);
  const cadena = medirMs(totalCiudadCadena, lista, "Medellín");
  const unaPasada = medirMs(totalCiudadUnaPasada, lista, "Medellín");
  tabla.push({
    n: n,
    cadena_ms: Math.round(cadena * 100) / 100,
    una_pasada_ms: Math.round(unaPasada * 100) / 100,
    veces_mas_lenta_la_cadena: Math.round((cadena / unaPasada) * 10) / 10,
  });
}
console.table(tabla);

console.log("| n | cadena (ms) | una pasada (ms) | veces mas lenta la cadena |");
console.log("|---|-------------|-----------------|---------------------------|");
for (const fila of tabla) {
  console.log(`| ${fila.n} | ${fila.cadena_ms} | ${fila.una_pasada_ms} | ${fila.veces_mas_lenta_la_cadena} |`);
}