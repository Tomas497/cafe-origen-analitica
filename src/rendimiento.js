const { generarVentas } = require("./generador");
const analitica = require("./analitica");

const ventas = generarVentas(10000);

// factor es cuantas veces mas trabajo hace con 1.000.000 de ventas que con 10.000
const funciones = [
  {
    nombre: "valorVenta",
    hace: "multiplica cantidad por precio de una venta",
    tiempo: "O(1)",
    espacio: "O(1)",
    porque: "es una sola multiplicacion, no recorre nada",
    factor: 1,
    repeticiones: 15,
    ejecutar: () => analitica.valorVenta(ventas[0]),
  },
  {
    nombre: "totalVendido",
    hace: "suma el valor de todas las ventas",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un ciclo que pasa una vez por cada venta y guarda un solo numero",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.totalVendido(ventas),
  },
  {
    nombre: "unidadesVendidas",
    hace: "suma las unidades de todas las ventas",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un ciclo que pasa una vez por cada venta y guarda un solo numero",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.unidadesVendidas(ventas),
  },
  {
    nombre: "ventaMayor",
    hace: "devuelve la venta de mayor valor",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un ciclo con una comparacion por venta, y guarda solo una referencia a una venta que ya existe",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.ventaMayor(ventas),
  },
  {
    nombre: "ticketPromedio",
    hace: "valor promedio de las ventas validas",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un ciclo que guarda dos numeros, el total y el contador",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.ticketPromedio(ventas),
  },
  {
    nombre: "ventasPorCiudad",
    hace: "total vendido en una ciudad",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un ciclo que guarda un solo numero",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.ventasPorCiudad(ventas, "Medellín"),
  },
  {
    nombre: "totalVendidoM",
    hace: "lo mismo que totalVendido, con reduce",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "reduce recorre una vez y solo lleva un numero, no crea arreglos",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.totalVendidoM(ventas),
  },
  {
    nombre: "unidadesVendidasM",
    hace: "lo mismo que unidadesVendidas, con reduce",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "reduce recorre una vez y solo lleva un numero",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.unidadesVendidasM(ventas),
  },
  {
    nombre: "ventasPorCiudadM",
    hace: "lo mismo que ventasPorCiudad, con filter, map y reduce",
    tiempo: "O(n)",
    espacio: "O(n)",
    porque: "tres recorridos, y filter y map crean dos arreglos de hasta n elementos",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.ventasPorCiudadM(ventas, "Medellín"),
  },
  {
    nombre: "totalPorCiudad",
    hace: "total vendido por cada ciudad",
    tiempo: "O(n)",
    espacio: "O(c)",
    porque: "un recorrido, y el objeto tiene una clave por ciudad, no una por venta",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.totalPorCiudad(ventas),
  },
  {
    nombre: "unidadesPorProducto",
    hace: "unidades vendidas de cada producto",
    tiempo: "O(n)",
    espacio: "O(p)",
    porque: "un recorrido, y el objeto tiene una clave por producto",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.unidadesPorProducto(ventas),
  },
  {
    nombre: "topProductosPorValor",
    hace: "los k productos que mas dinero generaron",
    tiempo: "O(n + p log p)",
    espacio: "O(p)",
    porque: "agrupa en un recorrido y despues ordena solo los p productos, no las ventas",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.topProductosPorValor(ventas, 3),
  },
  {
    nombre: "ventasDelDia",
    hace: "las ventas de una fecha",
    tiempo: "O(n)",
    espacio: "O(n)",
    porque: "filter recorre todas las ventas y crea un arreglo con las del dia, que en el peor caso son todas",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.ventasDelDia(ventas, "2026-09-15"),
  },
  {
    nombre: "clientesRecurrentes",
    hace: "clientes que compraron mas de una vez",
    tiempo: "O(n²)",
    espacio: "O(r)",
    porque: "dos ciclos anidados que comparan cada venta con las siguientes, n x (n - 1) / 2 comparaciones, y includes agrega trabajo",
    factor: 10000,
    repeticiones: 3,
    ejecutar: () => analitica.clientesRecurrentes(ventas),
  },
  {
    nombre: "totalCiudadCadena",
    hace: "total de una ciudad con map, filter, map y reduce",
    tiempo: "O(n)",
    espacio: "O(n)",
    porque: "cuatro recorridos que crean tres arreglos nuevos y n objetos nuevos",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.totalCiudadCadena(ventas, "Medellín"),
  },
  {
    nombre: "totalCiudadUnaPasada",
    hace: "total de una ciudad con un solo ciclo",
    tiempo: "O(n)",
    espacio: "O(1)",
    porque: "un recorrido que guarda un solo numero",
    factor: 100,
    repeticiones: 15,
    ejecutar: () => analitica.totalCiudadUnaPasada(ventas, "Medellín"),
  },
];

// me quedo con la medicion menor, despues de una corrida de calentamiento
function medirMs(ejecutar, repeticiones) {
  ejecutar();
  let menor = null;
  for (let vez = 0; vez < repeticiones; vez++) {
    const inicio = performance.now();
    ejecutar();
    const ms = performance.now() - inicio;
    if (menor === null || ms < menor) {
      menor = ms;
    }
  }
  return menor;
}

function enMs(ms) {
  if (ms < 0.001) {
    return "menos de 0.001";
  }
  return String(Math.round(ms * 1000) / 1000);
}

function enTexto(ms) {
  if (ms < 0.001) {
    return "menos de 0.001 ms";
  }
  if (ms < 1) {
    return String(Math.round(ms * 1000) / 1000) + " ms";
  }
  if (ms < 1000) {
    return ms.toFixed(1) + " ms";
  }
  const segundos = ms / 1000;
  if (segundos < 120) {
    return segundos.toFixed(1) + " segundos";
  }
  return (segundos / 60).toFixed(1) + " minutos";
}

console.log("midiendo con 10.000 ventas, puede tardar unos segundos");
for (const funcion of funciones) {
  funcion.ms = medirMs(funcion.ejecutar, funcion.repeticiones);
}

console.log("\n tabla 1: clasificacion y tiempo medido");
console.log("| Función | Qué hace | Tiempo | Espacio | Justificación | Tiempo medido con 10.000 ventas (ms) |");
console.log("|---------|----------|--------|---------|---------------|--------------------------------------|");
for (const funcion of funciones) {
  console.log(`| ${funcion.nombre} | ${funcion.hace} | ${funcion.tiempo} | ${funcion.espacio} | ${funcion.porque} | ${enMs(funcion.ms)} |`);
}

console.log("\n tabla 2: proyeccion con 1.000.000 de ventas");
console.log("| Función | Tiempo con 10.000 ventas | Veces más trabajo con 1.000.000 | Estimación con 1.000.000 |");
console.log("|---------|--------------------------|---------------------------------|--------------------------|");
for (const funcion of funciones) {
  console.log(`| ${funcion.nombre} | ${enTexto(funcion.ms)} | ${funcion.factor} | ${enTexto(funcion.ms * funcion.factor)} |`);
}