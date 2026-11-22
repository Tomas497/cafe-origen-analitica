const { ventas } = require("./datos");
const { totalPorCiudad, ticketPromedio, ventasDelDia } = require("./analitica");

function totalPorCiudadMalo(lista) {
  const grupos = {};
  for (const venta of lista) {
    const ciudad = venta.ciudad;
    grupos[ciudad] = (grupos[ciudad] || 0) + venta.cantidad * venta.precio;
  }
  return grupos;
}

// divide entre el largo del arreglo sin revisar si esta vacio
function ticketPromedioMalo(lista) {
  let total = 0;
  for (const venta of lista) {
    total += venta.cantidad * venta.precio;
  }
  return total / lista.length;
}

console.log("=== error 1: bogota dos veces ===");
const conEspacio = [
  ...ventas,
  { id: 13, fecha: "2026-09-07", cliente: "C09", producto: "Molino manual", ciudad: "Bogotá ", cantidad: 1, precio: 120000 },
];

const clavesMalas = Object.keys(totalPorCiudadMalo(conEspacio));
console.log("version mala, claves:", clavesMalas.map((c) => JSON.stringify(c)));
console.log("version mala, cuantas ciudades:", clavesMalas.length);

const clavesBuenas = Object.keys(totalPorCiudad(conEspacio));
console.log("mi version, claves:", clavesBuenas.map((c) => JSON.stringify(c)));
console.log("mi version, cuantas ciudades:", clavesBuenas.length);
console.log("mi version, total bogota:", totalPorCiudad(conEspacio)["Bogotá"]);


console.log("\n=== error 2: ticket promedio NaN ===");
const diaSinVentas = ventasDelDia(ventas, "2026-09-07");
console.log("ventas de ese dia:", diaSinVentas.length);
let total = 0;
for (const venta of diaSinVentas) {
  total += venta.cantidad * venta.precio;
}
console.log("total:", total, "| largo del arreglo:", diaSinVentas.length, "| total / largo =", total / diaSinVentas.length);

console.log("version mala:", ticketPromedioMalo(diaSinVentas));
console.log("mi version:", ticketPromedio(diaSinVentas));

const diaConVentas = ventasDelDia(ventas, "2026-09-02");
console.log("dia con ventas (2026-09-02):", ticketPromedioMalo(diaConVentas), "(mala)", ticketPromedio(diaConVentas), "(mia)");