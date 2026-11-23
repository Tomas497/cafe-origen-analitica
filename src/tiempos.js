const { ventas } = require("./datos");
const { clientesRecurrentes } = require("./analitica");
const { generarVentas } = require("./generador");

// reviso que funcione con los 12 datos del dia 1
console.log("--- revision con los 12 datos del dia 1 ---");
console.log("clientes recurrentes:", clientesRecurrentes(ventas));

// mido cuanto tarda con n ventas, repito la medicion y me quedo con la menor, para que otros procesos del computador no la afecten
function medirTiempo(n, repeticiones) {
  const datos = generarVentas(n);
  let menor = null;
  for (let vez = 1; vez <= repeticiones; vez++) {
    const etiqueta = "n = " + n + " (vez " + vez + ")";
    console.time(etiqueta);
    const inicio = performance.now();
    clientesRecurrentes(datos);
    const fin = performance.now();
    console.timeEnd(etiqueta);
    if (menor === null || fin - inicio < menor) {
      menor = fin - inicio;
    }
  }
  return menor;
}

// si n se multiplica por un numero, el tiempo se multiplica por ese numero al cuadrado
function estimarMs(fila, nuevoN) {
  const veces = nuevoN / fila.n;
  return fila.ms * veces * veces;
}

function enTexto(ms) {
  const segundos = ms / 1000;
  const minutos = ms / 60000;
  return segundos.toFixed(1) + " segundos (" + minutos.toFixed(1) + " minutos)";
}

console.log("\n--- tiempos ---");

// una corrida de calentamiento, para que la primera medicion no salga inflada
clientesRecurrentes(generarVentas(3000));

const tamanos = [1000, 2000, 4000, 8000, 16000];
const filas = [];
for (const n of tamanos) {
  const ms = medirTiempo(n, 3);
  let veces = "";
  if (filas.length > 0) {
    veces = Math.round((ms / filas[filas.length - 1].ms) * 100) / 100;
  }
  filas.push({ n: n, ms: ms, veces: veces });
}

const tabla = [];
for (const fila of filas) {
  tabla.push({ n: fila.n, tiempo_ms: Math.round(fila.ms * 100) / 100, veces_mas_que_el_anterior: fila.veces });
}
console.log("");
console.table(tabla);

// estimo con las mediciones
const ultima = filas[filas.length - 1];
const estimado100mil = estimarMs(ultima, 100000);
console.log("\n--- estimaciones a partir de n = " + ultima.n + " ---");
console.log("100.000 ventas:", enTexto(estimado100mil));
console.log("1.000.000 ventas:", enTexto(estimarMs(ultima, 1000000)));

// solo ejecuto 100.000 si la estimacion es menor a dos minutos
let real100mil = null;
if (estimado100mil < 120000) {
  console.log("\nla estimacion es menor a dos minutos, ejecuto 100.000 de verdad (puede tardar)");
  real100mil = medirTiempo(100000, 1);
  console.log("tiempo real con 100.000 ventas:", enTexto(real100mil));
  console.log("estimacion para 1.000.000 usando esa medicion:", enTexto(estimarMs({ n: 100000, ms: real100mil }, 1000000)));
} else {
  console.log("\nla estimacion es de dos minutos o mas, no ejecuto 100.000");
}

console.log("\n--- para copiar a la bitacora ---");
console.log("| n | tiempo (ms) | veces mas que el anterior |");
console.log("|---|-------------|---------------------------|");
for (const fila of tabla) {
  console.log(`| ${fila.n} | ${fila.tiempo_ms} | ${fila.veces_mas_que_el_anterior} |`);
}