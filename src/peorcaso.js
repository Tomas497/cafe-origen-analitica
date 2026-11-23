const { clientesRecurrentes } = require("./analitica");
const { generarVentas } = require("./generador");

function armarPeorCaso(n) {
  const lista = [];
  for (let i = 0; i < n / 2; i++) {
    lista.push({ cliente: "C" + Math.floor(i / 2) });
  }
  for (let i = 0; i < n / 2; i++) {
    lista.push({ cliente: "GRANDE" });
  }
  return lista;
}

function medir(datos) {
  const inicio = performance.now();
  clientesRecurrentes(datos);
  return performance.now() - inicio;
}

clientesRecurrentes(generarVentas(3000));

const filas = [];
for (const n of [1000, 2000, 4000]) {
  const normal = medir(generarVentas(n));
  const peor = medir(armarPeorCaso(n));
  filas.push({
    n: n,
    datos_normales_ms: Math.round(normal * 10) / 10,
    peor_caso_ms: Math.round(peor * 10) / 10,
  });
}
console.table(filas);