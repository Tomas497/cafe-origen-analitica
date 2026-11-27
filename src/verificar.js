const { ventas } = require("./datos");
const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
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
  const estado = conCiclo === conMetodo ? "OK" : "DIFERENTE";
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
console.log("orden de ventas:", ids === "1,2,3,4,5,6,7,8,9,10,11,12" ? "OK" : "DIFERENTE", "(" + ids + ")");

function ordenado(lista) {
  return [...lista].sort();
}

function iguales(a, b) {
  return JSON.stringify(ordenado(a)) === JSON.stringify(ordenado(b)); // comprueba si dos arreglos u objetos tienen los mismos datos, sin importar el orden

}

function compararRecurrentes(nombre, datos) {
  const original = clientesRecurrentes(datos);
  const conSet = clientesRecurrentesSet(datos);
  const conMap = clientesRecurrentesMap(datos);
  console.log("\n clientes recurrentes con", nombre);
  console.log((iguales(original, conSet) ? "OK" : "DIFERENTE").padEnd(10), "Set | original:", original.length, "| Set:", conSet.length); // rellena con cadenas
  console.log((iguales(original, conMap) ? "OK" : "DIFERENTE").padEnd(10), "Map | original:", original.length, "| Map:", conMap.length);
}

console.log("\n clientes recurrentes, datos del dia 1, ordenados");
console.log("original:", ordenado(clientesRecurrentes(ventas)));
console.log("Set:     ", ordenado(clientesRecurrentesSet(ventas)));
console.log("Map:     ", ordenado(clientesRecurrentesMap(ventas)));
compararRecurrentes("los 12 datos del dia 1", ventas);
compararRecurrentes("5.000 ventas generadas", generarVentas(5000));
console.log("\nCasos borde, arreglo vacio:", clientesRecurrentesSet([]), clientesRecurrentesMap([]), "| una sola venta:", clientesRecurrentesSet([ventas[0]]), clientesRecurrentesMap([ventas[0]]));