function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(venta){
    let total = 0;
    for (const venta of ventas){
        total += valorVenta(venta);
    }
        return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (!esVentaValida(venta)) {
      continue;
    }
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let validas = 0;
  for (const venta of ventas) {
    if (esVentaValida(venta)) {
      total += valorVenta(venta);
      validas++;
    }
  }
  if (validas === 0) {
    return 0;
  }
  return total / validas;
}

function ventasPorCiudad(ventas, ciudad) {
  const buscada = normalizarTexto(ciudad);
  let total = 0;
  for (const venta of ventas) {
    if (normalizarTexto(venta.ciudad) === buscada) {
      total += valorVenta(venta);
    }
  }
  return total;
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
};

function totalVendidoM(ventas){
    return ventas.reduce((total, venta) => total + valorVenta(venta), 0);
}

function unidadesVendidasM(ventas){
    return ventas.reduce((total,venta) => total + venta.cantidad, 0);
}

function ventasPorCiudad(ventas, ciudad){
    const busca = normalizarTexto(ciudad);
    return ventas
        .filter(venta => normalizarTexto(venta.ciudad === busca))
        .reduce((total, venta) => total + venta.cantidad * venta.precio, 0);
}

