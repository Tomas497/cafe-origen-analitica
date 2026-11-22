const productos = ["Origen Huila 500 g", "Origen Nariño 250 g", "Prensa francesa", "Origen Sierra 500 g", "Molino manual"];
const precios = [42000, 26000, 95000, 45000, 120000];
const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira", "Barranquilla"];

// numero entero al azar entre minimo y maximo, incluyendo los dos
function numeroAlAzar(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function generarVentas(n) {
  const ventas = [];

  let maxClientes = Math.floor(n / 3);
  if (maxClientes < 1) {
    maxClientes = 1;
  }

  for (let i = 1; i <= n; i++) {
    const posicionProducto = numeroAlAzar(0, productos.length - 1);
    const posicionCiudad = numeroAlAzar(0, ciudades.length - 1);

    const dia = numeroAlAzar(1, 28);
    let textoDia = String(dia);
    if (dia < 10) {
      textoDia = "0" + dia;
    }

    const venta = {
      id: i,
      fecha: "2026-09-" + textoDia,
      cliente: "C" + numeroAlAzar(1, maxClientes),
      producto: productos[posicionProducto],
      ciudad: ciudades[posicionCiudad],
      cantidad: numeroAlAzar(1, 5),
      precio: precios[posicionProducto],
    };
    ventas.push(venta);
  }

  return ventas;
}

module.exports = { generarVentas};