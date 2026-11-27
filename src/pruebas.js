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
    console.log("ok   ", nombre, "->", obtenido);
  } else {
    console.log("fallo", nombre, "-> obtuve", obtenido, "y esperaba", esperado);
  }
}

// con el arreglo completo
console.log("arreglo completo");
probar("valorVenta id 1", valorVenta(ventas[0]), 84000);
probar("totalVendido", totalVendido(ventas), 985000);
probar("unidadesVendidas", unidadesVendidas(ventas), 21);
probar("ventaMayor (id)", ventaMayor(ventas).id, 10);
probar("ticketPromedio", Math.round(ticketPromedio(ventas)), 89545);
probar("ventasPorCiudad Medellín", ventasPorCiudad(ventas, "Medellín"), 356000);
probar("ventasPorCiudad con espacios y mayusculas", ventasPorCiudad(ventas, "  MEDELLÍN "), 356000);

// una venta escrita como "medellín " con un espacio al final
const conEspacio = [
  { id: 99, fecha: "2026-09-07", cliente: "C09", producto: "Molino manual", ciudad: "medellín ", cantidad: 1, precio: 120000 },
];
probar("ventasPorCiudad 'medellín ' con espacio", ventasPorCiudad(conEspacio, "Medellín"), 120000);

// con un solo elemento
console.log("\nun solo elemento (id 1)");
const una = [ventas[0]];
probar("totalVendido", totalVendido(una), 84000);
probar("unidadesVendidas", unidadesVendidas(una), 2);
probar("ventaMayor (id)", ventaMayor(una).id, 1);
probar("ticketPromedio", ticketPromedio(una), 84000);
probar("ventasPorCiudad", ventasPorCiudad(una, "medellín"), 84000);

// con el arreglo vacio
console.log("\narreglo vacio");
probar("totalVendido", totalVendido([]), 0);
probar("unidadesVendidas", unidadesVendidas([]), 0);
probar("ventaMayor", ventaMayor([]), null);
probar("ticketPromedio", ticketPromedio([]), 0);
probar("ventasPorCiudad", ventasPorCiudad([], "Cali"), 0);

//minireto 10

const analitica = require("./analitica");
const { catalogo } = require("./catalogo");

function nombres(combo) {
  if (combo === null) {
    return null;
  }
  return combo[0].producto + " y " + combo[1].producto;
}

console.log("\nCombos de regalo");
probar("fuerza bruta 87.000", nombres(analitica.comboRegalo(catalogo, 87000)), "Origen Huila 500 g y Origen Sierra 500 g");
probar("con Map 87.000", nombres(analitica.comboRegaloMap(catalogo, 87000)), "Origen Huila 500 g y Origen Sierra 500 g");
probar("fuerza bruta 61.000", nombres(analitica.comboRegalo(catalogo, 61000)), "Origen Nariño 250 g y Taza de cerámica");
probar("con Map 61.000", nombres(analitica.comboRegaloMap(catalogo, 61000)), "Origen Nariño 250 g y Taza de cerámica");
probar("fuerza bruta 10.000, sin combo", nombres(analitica.comboRegalo(catalogo, 10000)), null);
probar("con Map 10.000, sin combo", nombres(analitica.comboRegaloMap(catalogo, 10000)), null);
probar("con Map catalogo vacio", nombres(analitica.comboRegaloMap([], 87000)), null);
probar("con Map un solo producto", nombres(analitica.comboRegaloMap([catalogo[0]], 52000)), null);

console.log("\nProducto estrella por ciudad");
const estrellas = analitica.productoEstrellaPorCiudad(ventas);
probar("cuantas ciudades", Object.keys(estrellas).length, 4);
probar("Medellín", estrellas["Medellín"].producto, "Origen Huila 500 g");
probar("Bogotá", estrellas["Bogotá"].producto, "Origen Nariño 250 g");
probar("Cali (empate, gana el primero)", estrellas["Cali"].producto, "Prensa francesa");
probar("Pereira", estrellas["Pereira"].producto, "Origen Huila 500 g");
probar("arreglo vacio", Object.keys(analitica.productoEstrellaPorCiudad([])).length, 0);

console.log("\nPrimer cliente que compro una sola vez");
probar("datos del dia 1", analitica.primerClienteUnico(ventas), "C04");
probar("arreglo vacio", analitica.primerClienteUnico([]), null);
probar("todos repiten", analitica.primerClienteUnico([ventas[0], ventas[3]]), null);