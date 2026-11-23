function normalizarTexto(texto) {
  return texto.trim().toLowerCase();
}

// una venta es valida si vendio al menos una unidad
function esVentaValida(venta) {
  return venta.cantidad > 0;
}

function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
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

// devuelve el registro completo de la venta mas grande
// si no hay ventas validas devuelve null
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

// total entre cantidad de ventas validas
// si no hay ninguna devuelvo 0 para no dividir entre cero
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

function totalVendidoM(ventas) {
  return ventas.reduce((total, venta) => total + valorVenta(venta), 0);
}

function unidadesVendidasM(ventas) {
  return ventas.reduce((total, venta) => total + venta.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const busca = normalizarTexto(ciudad);
  return ventas
    .filter((venta) => normalizarTexto(venta.ciudad) === busca)
    .map((venta) => valorVenta(venta))
    .reduce((total, valor) => total + valor, 0);
}

// objeto como diccionario, la clave es la ciudad y el valor es lo que se vendio ahi
function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const limpia = normalizarTexto(venta.ciudad);
    const ciudad = limpia.charAt(0).toUpperCase() + limpia.slice(1);
    grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
    return grupos;
  }, {});
}

function unidadesPorProducto(ventas) {
  return ventas.reduce((grupos, venta) => {
    grupos[venta.producto] = (grupos[venta.producto] || 0) + venta.cantidad;
    return grupos;
  }, {});
}

function topProductosPorValor(ventas, k) {
  const totales = ventas.reduce((grupos, venta) => {
    grupos[venta.producto] = (grupos[venta.producto] || 0) + valorVenta(venta);
    return grupos;
  }, {});
  // lo paso a arreglo y lo copio con ... para que el sort no toque el original
  const lista = [...Object.entries(totales)];
  return lista
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([producto, total]) => ({ producto, total }));
}

// devuelve solo las ventas de una fecha, si ese dia no hubo ventas devuelve un arreglo vacio, no falla
function ventasDelDia(ventas, fecha) {
  const buscada = fecha.trim();
  return ventas.filter((venta) => venta.fecha === buscada);
}

// version original del companero, con dos ciclos anidados
function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cliente === ventas[j].cliente && !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

// version con cadena de metodos
function totalCiudadCadena(ventas, ciudad) {
  const buscada = ciudad.trim().toLowerCase();
  return ventas
    .map((venta) => {
      return { ciudad: venta.ciudad.trim().toLowerCase(), cantidad: venta.cantidad, precio: venta.precio };
    })
    .filter((venta) => venta.ciudad === buscada)
    .map((venta) => venta.cantidad * venta.precio)
    .reduce((total, valor) => total + valor, 0);
}

// misma respuesta con un solo ciclo y sin arreglos nuevos
function totalCiudadUnaPasada(ventas, ciudad) {
  const buscada = ciudad.trim().toLowerCase();
  let total = 0;
  for (const venta of ventas) {
    if (venta.ciudad.trim().toLowerCase() === buscada) {
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
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes,
  totalCiudadCadena,
  totalCiudadUnaPasada,
};