const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
} = require("./analitica");

// repito la medicion y me quedo con la menor, para que otros procesos del computador no la afecten
function medirMs(funcion, datos, repeticiones) {
  funcion(datos);
  let menor = null;
  for (let vez = 0; vez < repeticiones; vez++) {
    const inicio = performance.now();
    funcion(datos);
    const ms = performance.now() - inicio;
    if (menor === null || ms < menor) {
      menor = ms;
    }
  }
  return menor;
}

function redondear(ms) {
  return Math.round(ms * 100) / 100;
}

console.log("tiempos de clientes recurrentes");
const tamanos = [1000, 10000, 100000];
const filas = [];
for (const n of tamanos) {
  const datos = generarVentas(n);

  // la original solo hasta 10.000, con 100.000 tarda casi dos minutos
  let original = null;
  if (n <= 10000) {
    original = redondear(medirMs(clientesRecurrentes, datos, 3));
  }
  const conSet = redondear(medirMs(clientesRecurrentesSet, datos, 5));
  const conMap = redondear(medirMs(clientesRecurrentesMap, datos, 5));
  filas.push({ n: n, original_ms: original, set_ms: conSet, map_ms: conMap });
}
console.table(filas);

// con 100.000 ventas tiene que tardar menos de un segundo
console.log("\n100.000 ventas, limite de un segundo");
const cien = generarVentas(100000);
console.time("Set con 100.000 ventas");
clientesRecurrentesSet(cien);
console.timeEnd("Set con 100.000 ventas");
console.time("Map con 100.000 ventas");
clientesRecurrentesMap(cien);
console.timeEnd("Map con 100.000 ventas");
console.log("Set menos de un segundo:", medirMs(clientesRecurrentesSet, cien, 3) < 1000 ? "OK" : "DIFERENTE");
console.log("Map menos de un segundo:", medirMs(clientesRecurrentesMap, cien, 3) < 1000 ? "OK" : "DIFERENTE");

// el tiempo dividido entre n: si es lineal casi no cambia al crecer n
function porVenta(ms, n) {
  return Math.round((ms * 1000 / n) * 1000) / 1000;
}

console.log("| n | original (ms) | Set (ms) | Map (ms) |");
console.log("|---|---------------|----------|----------|");
for (const fila of filas) {
  const original = fila.original_ms === null ? "no se ejecuta" : fila.original_ms;
  console.log(`| ${fila.n} | ${original} | ${fila.set_ms} | ${fila.map_ms} |`);
}
console.log("\ntiempo por venta, en microsegundos:");
console.log("| n | original | Set | Map |");
console.log("|---|----------|-----|-----|");
for (const fila of filas) {
  const original = fila.original_ms === null ? "no se ejecuta" : porVenta(fila.original_ms, fila.n);
  console.log(`| ${fila.n} | ${original} | ${porVenta(fila.set_ms, fila.n)} | ${porVenta(fila.map_ms, fila.n)} |`);
}