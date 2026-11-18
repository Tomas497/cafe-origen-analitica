// pruebas minireto 2
const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
} = require("./analitica");

function probar(nombre, obtenido, esperado) {
  if (obtenido === esperado) {
    console.log("OK   ", nombre, "->", obtenido);
  } else {
    console.log("FALLO", nombre, "-> obtuve", obtenido, "esperaba", esperado);
  }
}

// arreglo completo
console.log("--- arreglo completo ---");
probar("valorVenta id 1", valorVenta(ventas[0]), 84000);
probar("totalVendido", totalVendido(ventas), 985000);
probar("unidadesVendidas", unidadesVendidas(ventas), 21);
probar("ventaMayor (id)", ventaMayor(ventas).id, 10);
probar("ticketPromedio", Math.round(ticketPromedio(ventas)), 89545);
probar("ventasPorCiudad Medellín", ventasPorCiudad(ventas, "Medellín"), 356000);
probar("ventasPorCiudad con espacios y mayusculas", ventasPorCiudad(ventas, "  MEDELLÍN "), 356000);

// venta escrita como "medellín " con espacio al final
const conEspacio = [
  { id: 99, fecha: "2026-09-07", cliente: "C09", producto: "Molino manual", ciudad: "medellín ", cantidad: 1, precio: 120000 },
];
probar("ventasPorCiudad 'medellín ' con espacio", ventasPorCiudad(conEspacio, "Medellín"), 120000);

// un solo elemento
console.log("\n--- un solo elemento (id 1) ---");
const una = [ventas[0]];
probar("totalVendido", totalVendido(una), 84000);
probar("unidadesVendidas", unidadesVendidas(una), 2);
probar("ventaMayor (id)", ventaMayor(una).id, 1);
probar("ticketPromedio", ticketPromedio(una), 84000);
probar("ventasPorCiudad", ventasPorCiudad(una, "medellín"), 84000);

// arreglo vacio
console.log("\n--- arreglo vacio ---");
probar("totalVendido", totalVendido([]), 0);
probar("unidadesVendidas", unidadesVendidas([]), 0);
probar("ventaMayor", ventaMayor([]), null);
probar("ticketPromedio", ticketPromedio([]), 0);
probar("ventasPorCiudad", ventasPorCiudad([], "Cali"), 0);

//--------------------------------------------------------------------------------------

