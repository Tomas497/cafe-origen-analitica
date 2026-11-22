const { generarVentas } = require("./generador");
const { totalVendido, ventaMayor, totalPorCiudad } = require("./analitica");
const {
  totalVendidoContando,
  ventaMayorContando,
  totalPorCiudadContando,
  primeraVentaContando,
} = require("./instrumentadas");

function revisarGenerador(n) {
  const ventas = generarVentas(n);
  let validas = 0;
  const clientes = {};
  for (const venta of ventas) {
    if (venta.cantidad >= 1 && venta.cantidad <= 5 && venta.precio > 0) {
      validas++;
    }
    clientes[venta.cliente] = true;
  }
  const distintos = Object.keys(clientes).length;
  console.log(`generador con n = ${n}: ${ventas.length} ventas, ${validas} validas, ${distintos} clientes distintos (maximo ${Math.max(1, Math.floor(n / 3))})`);
}

// reviso que las versiones que cuentan den lo mismo que las originales
function revisarResultados() {
  const ventas = generarVentas(1000);
  const contador = { operaciones: 0 };
  const mismoTotal = totalVendidoContando(ventas, contador) === totalVendido(ventas);
  const mismaMayor = ventaMayorContando(ventas, contador) === ventaMayor(ventas);
  const mismasCiudades = JSON.stringify(totalPorCiudadContando(ventas, contador)) === JSON.stringify(totalPorCiudad(ventas));
  console.log("totalVendido igual:", mismoTotal ? "OK" : "DIFERENTE");
  console.log("ventaMayor igual:", mismaMayor ? "OK" : "DIFERENTE");
  console.log("totalPorCiudad igual:", mismasCiudades ? "OK" : "DIFERENTE");
}

console.log("--- revision del generador ---");
revisarGenerador(1);
revisarGenerador(10);
revisarGenerador(100);
revisarGenerador(1000);

console.log("\n--- revision de las funciones que cuentan ---");
revisarResultados();

const tamanos = [100, 1000, 10000, 100000];
const filas = [];

for (const n of tamanos) {
  const ventas = generarVentas(n);

  const contadorTotal = { operaciones: 0 };
  const contadorMayor = { operaciones: 0 };
  const contadorCiudad = { operaciones: 0 };
  const contadorPrimera = { operaciones: 0 };

  totalVendidoContando(ventas, contadorTotal);
  ventaMayorContando(ventas, contadorMayor);
  totalPorCiudadContando(ventas, contadorCiudad);
  primeraVentaContando(ventas, contadorPrimera);

  filas.push({
    n: n,
    totalVendido: contadorTotal.operaciones,
    ventaMayor: contadorMayor.operaciones,
    totalPorCiudad: contadorCiudad.operaciones,
    primeraVenta: contadorPrimera.operaciones,
  });
}

console.log("\n--- operaciones por tamano ---");
console.table(filas);

// cuantas veces crecen las operaciones cada vez que n se multiplica por 10
const crecimiento = [];
for (let i = 1; i < filas.length; i++) {
  crecimiento.push({
    cambio: filas[i - 1].n + " a " + filas[i].n,
    totalVendido: filas[i].totalVendido / filas[i - 1].totalVendido,
    ventaMayor: filas[i].ventaMayor / filas[i - 1].ventaMayor,
    totalPorCiudad: filas[i].totalPorCiudad / filas[i - 1].totalPorCiudad,
    primeraVenta: filas[i].primeraVenta / filas[i - 1].primeraVenta,
  });
}

console.log("\n--- cuantas veces crecen las operaciones ---");
console.table(crecimiento);