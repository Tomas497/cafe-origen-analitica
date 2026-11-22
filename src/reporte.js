const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

function pesos(valor) {
  return "$ " + valor.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

function titulo(texto) {
  console.log("\n" + texto);
  console.log("-".repeat(50));
}

function linea(nombre, valor) {
  console.log(nombre.padEnd(30) + String(valor).padStart(20));
}

// resumen de un dia, sirve tanto si hubo ventas como si no
function resumenDelDia(fecha) {
  const delDia = ventasDelDia(ventas, fecha);
  titulo("Resumen del dia " + fecha);
  if (delDia.length === 0) {
    console.log("No hubo ventas este dia.");
  }
  linea("registros de venta", delDia.length);
  linea("unidades vendidas", unidadesVendidas(delDia));
  linea("total vendido", pesos(totalVendido(delDia)));
  linea("ticket promedio", pesos(ticketPromedio(delDia)));
}

console.log("=".repeat(50));
console.log("Cafe Origen - reporte de ventas (v0.1)");
console.log("=".repeat(50));

titulo("1. Resumen general");
const mayor = ventaMayor(ventas);
linea("registros de venta", ventas.length);
linea("unidades vendidas", unidadesVendidas(ventas));
linea("total vendido", pesos(totalVendido(ventas)));
linea("ticket promedio", pesos(ticketPromedio(ventas)));
if (mayor !== null) {
  linea("venta mas grande", pesos(valorVenta(mayor)));
  console.log(`  (${mayor.producto}, ${mayor.ciudad}, cliente ${mayor.cliente})`);
} else {
  linea("venta mas grande", "ninguna");
}

titulo("2. Ventas por ciudad");
const ciudades = [...Object.entries(totalPorCiudad(ventas))].sort((a, b) => b[1] - a[1]);
for (const [ciudad, total] of ciudades) {
  linea(ciudad, pesos(total));
}

titulo("3. Unidades por producto");
const productos = [...Object.entries(unidadesPorProducto(ventas))].sort((a, b) => b[1] - a[1]);
for (const [producto, unidades] of productos) {
  linea(producto, unidades + " und");
}

titulo("4. Top 3 productos por valor");
const top = topProductosPorValor(ventas, 3);
for (let i = 0; i < top.length; i++) {
  linea(`${i + 1}. ${top[i].producto}`, pesos(top[i].total));
}

resumenDelDia("2026-09-02");
resumenDelDia("2026-09-07");

console.log("\n" + "=".repeat(50));