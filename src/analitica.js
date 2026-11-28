function normalizarTexto(texto) {
  return texto.trim().toLowerCase();
}

function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function ventaValida(venta) {
  return venta.cantidad > 0 && venta.precio > 0;
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

// devuelve el registro completo de la venta mas grande, si no hay ventas validas devuelve null
function ventaMayor(ventas) {
  let mayor = null;
  let montoMay = !!mayor ? valorVenta(mayor): 0;

  for (const venta of ventas) {
   const monto = valorVenta(venta);
    if (monto > montoMay) {
      mayor = venta;
      montoMay = monto;
    }
}
return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let validas = 0;
  for (const venta of ventas) {
    if (ventaValida(venta)) {
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

// version original del compañero, con dos ciclos anidados
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

// version con dos Set
function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();
  for (const venta of ventas) {
    if (vistos.has(venta.cliente)) {
      recurrentes.add(venta.cliente);
    } else {
      vistos.add(venta.cliente);
    }
  }
  return [...recurrentes];
}

// cuenta cuantas compras hizo cada cliente
function comprasPorCliente(ventas) {
  const compras = new Map();
  for (const venta of ventas) {
    if (compras.has(venta.cliente)) {
      compras.set(venta.cliente, compras.get(venta.cliente) + 1);
    } else {
      compras.set(venta.cliente, 1);
    }
  }
  return compras;
}

// los recurrentes son los clientes con dos compras o mas
function clientesRecurrentesMap(ventas) {
  const compras = comprasPorCliente(ventas);
  const recurrentes = [];
  for (const [cliente, cantidad] of compras) {
    if (cantidad >= 2) {
      recurrentes.push(cliente);
    }
  }
  return recurrentes;
}

// pruebo todos los pares con dos ciclos anidados, O(n^2)
function comboRegalo(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
}

// con un Map guardo los precios que ya vi
function comboRegaloMap(catalogo, valor) {
  const vistos = new Map();
  for (const producto of catalogo) {
    const complemento = valor - producto.precio;
    if (vistos.has(complemento)) {
      return [vistos.get(complemento), producto];
    }
    vistos.set(producto.precio, producto);
  }
  return null;
}

// primero cuento: un Map por ciudad, y dentro otro Map con las veces que aparece cada producto
// despues me quedo con el mayor de cada ciudad, si hay empate gana el que aparecio primero, porque solo cambio cuando otro lo supera
function productoEstrellaPorCiudad(ventas) {
  const porCiudad = new Map();
  for (const venta of ventas) {
    if (!ventaValida(venta)) {
      continue;
    }
    const limpia = normalizarTexto(venta.ciudad);
    const ciudad = limpia.charAt(0).toUpperCase() + limpia.slice(1);
    if (!porCiudad.has(ciudad)) {
      porCiudad.set(ciudad, new Map());
    }
    const productos = porCiudad.get(ciudad);
    if (productos.has(venta.producto)) {
      productos.set(venta.producto, productos.get(venta.producto) + 1);
    } else {
      productos.set(venta.producto, 1);
    }
  }

  const estrellas = {};
  for (const [ciudad, productos] of porCiudad) {
    let mejorProducto = null;
    let mejorVeces = 0;
    for (const [producto, veces] of productos) {
      if (veces > mejorVeces) {
        mejorProducto = producto;
        mejorVeces = veces;
      }
    }
    estrellas[ciudad] = { producto: mejorProducto, veces: mejorVeces };
  }
  return estrellas;
}

// primer recorrido, cuento las compras de cada cliente (comprasPorCliente usa un map)
// segundo recorrido, busco la primera venta cuyo cliente compró una sola vez
function primerClienteUnico(ventas) {
  const compras = comprasPorCliente(ventas);
  for (const venta of ventas) {
    if (compras.get(venta.cliente) === 1) {
      return venta.cliente;
    }
  }
  return null;
}

function mejorSemanaBruta(dias, k) {
  if (k < 1 || k > dias.length) {
    return null;
  }
  let mejorTotal = 0;
  let mejorInicio = 0;
  for (let i = 0; i <= dias.length - k; i++) {
    let suma = 0;
    for (let j = i; j < i + k; j++) {
      suma += dias[j];
    }
    if (i === 0 || suma > mejorTotal) {
      mejorTotal = suma;
      mejorInicio = i;
    }
  }
  return { total: mejorTotal, inicio: mejorInicio + 1 };
}

// ventana deslizante, sumo la primera semana y despues no vuelvo a sumar todo,
// al correr la ventana un dia le sumo el dia que entra y le resto el que sale
// el inicio se devuelve como dia del mes (empieza en 1)

function mejorSemana(dias, k) {
  if (k < 1 || k > dias.length) {
    return null;
  }
  let suma = 0;
  for (let i = 0; i < k; i++) {
    suma += dias[i];
  }
  let mejorTotal = suma;
  let mejorInicio = 0;
  for (let i = k; i < dias.length; i++) {
    suma = suma + dias[i] - dias[i - k];
    if (suma > mejorTotal) {
      mejorTotal = suma;
      mejorInicio = i - k + 1;
    }
  }
  return { total: mejorTotal, inicio: mejorInicio + 1 };
}

// dos punteros sobre los productos ordenados por precio
// izquierda empieza en el mas barato y derecha en el mas caro
// si la suma se pasa del presupuesto bajo la derecha, y si cabe la guardo y subo la izquierda

function parMasCercano(catalogo, presupuesto) {
  const ordenados = [...catalogo].sort((a, b) => a.precio - b.precio);
  let izquierda = 0;
  let derecha = ordenados.length - 1;
  let mejorPar = null;
  let mejorSuma = 0;
  while (izquierda < derecha) {
    const suma = ordenados[izquierda].precio + ordenados[derecha].precio;
    if (suma > presupuesto) {
      derecha--;
    } else {
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejorPar = [ordenados[izquierda], ordenados[derecha]];
      }
      izquierda++;
    }
  }
  return mejorPar;
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
  clientesRecurrentesSet,
  comprasPorCliente,
  clientesRecurrentesMap,
  comboRegalo,
  comboRegaloMap,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano,
};

