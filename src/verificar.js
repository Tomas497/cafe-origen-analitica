const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
} = require("./analitica");

function comparar(nombre, conCiclo, conMetodo) {
  const estado = conCiclo === conMetodo ? "Ok" : "Diferente";
  console.log(estado.padEnd(10), nombre, "| ciclo:", conCiclo, "| metodo:", conMetodo);
}

const entradas = [
  ["completo", ventas],
  ["un elemento", [ventas[0]]],
  ["vacio", []],
];

for (const [nombre, datos] of entradas) {
  console.log("\n entrada:", nombre);
  comparar("total vendido", totalVendido(datos), totalVendidoM(datos));
  comparar("unidades vendidas", unidadesVendidas(datos), unidadesVendidasM(datos));
  comparar("ventas Medellin", ventasPorCiudad(datos, "Medellín"), ventasPorCiudadM(datos, "Medellín"));
  comparar("ventas Cali", ventasPorCiudad(datos, "Cali"), ventasPorCiudadM(datos, "Cali"));
}

// agrupaciones y ranking
console.log("\n agrupaciones y ranking");
const porCiudad = totalPorCiudad(ventas);
console.log("totalPorCiudad:", porCiudad);
console.log("cuantas ciudades:", Object.keys(porCiudad).length);
console.log("unidadesPorProducto:", unidadesPorProducto(ventas));
console.log("top 3 por valor:", topProductosPorValor(ventas, 3));

// despues de ordenar, ventas tiene que seguir igual
const ids = ventas.map((venta) => venta.id).join(",");
console.log("orden de ventas:", ids === "1,2,3,4,5,6,7,8,9,10,11,12" ? "Ok" : "Diferente", "(" + ids + ")");