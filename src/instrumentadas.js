const { valorVenta } = require("./analitica");

function nombreDeCiudad(texto) {
  const limpia = texto.trim().toLowerCase();
  return limpia.charAt(0).toUpperCase() + limpia.slice(1);
}

function totalVendidoContando(ventas, contador) {
  let total = 0;
  for (const venta of ventas) {
    contador.operaciones++;
    total += valorVenta(venta);
  }
  return total;
}

// cuenta 1 por visitar la venta y 1 por compararla con la mayor
// las ventas generadas siempre son validas por eso aqui no reviso la cantidad 

function ventaMayorContando(ventas, contador) {
  let mayor = null;
  for (const venta of ventas) {
    contador.operaciones++;
    contador.operaciones++;
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

// cuenta 1 por visitar la venta y 1 por preguntar si la ciudad ya esta en el objeto
function totalPorCiudadContando(ventas, contador) {
  const grupos = {};
  for (const venta of ventas) {
    contador.operaciones++;
    const ciudad = nombreDeCiudad(venta.ciudad);
    contador.operaciones++;
    if (grupos[ciudad] === undefined) {
      grupos[ciudad] = 0;
    }
    grupos[ciudad] += valorVenta(venta);
  }
  return grupos;
}

function primeraVentaContando(ventas, contador) {
  contador.operaciones++;
  if (ventas.length === 0) {
    return null;
  }
  return ventas[0];
}

module.exports = {
  totalVendidoContando,
  ventaMayorContando,
  totalPorCiudadContando,
  primeraVentaContando,
};