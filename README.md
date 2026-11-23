# cafe-origen-analitica

Motor de analitica de ventas para Cafe Origen, una tostadora de cafe de especialidad de Medellin. Lo estoy haciendo como parte del trabajo con Nodo Digital. Hoy la tienda lleva las ventas en hojas de calculo y nadie sabe responder con certeza cual fue el producto mas vendido o que ciudad compra mas. Este proyecto calcula esas respuestas desde el codigo y mide que tan bien aguanta cuando los datos crecen.

## Que preguntas responde

- cuanto se vendio en total y cuantas unidades salieron
- cual fue la venta mas grande
- cuanto gasta en promedio un cliente por compra (ticket promedio)
- cuanto se vendio en cada ciudad
- que productos salen mas, por unidades
- cuales son los 3 productos que mas dinero generan
- como le fue a un dia en particular (tambien si ese dia no hubo ventas)
- que clientes compraron mas de una vez
- cuanto tarda el motor cuando pasa de 12 a 100.000 ventas
- cuanta memoria gasta una cadena de metodos frente a un solo recorrido
- que funciones se van a romper primero cuando los datos crezcan (ver `RENDIMIENTO.md`)

## Como ejecutarlo

Necesita Node.js (version LTS). Desde la carpeta del proyecto:

```bash
node src/reporte.js
```

Eso imprime el reporte completo. Tambien hay otros scripts:

```bash
node src/explorar.js      # muestra como son los datos
node src/pruebas.js       # pruebas de las funciones con ciclos
node src/verificar.js     # compara cada ciclo con su version con metodos
node src/depuracion.js    # reproduce los dos errores que reporto la gerente
node src/medir.js         # cuenta las operaciones de las funciones con distintos tamanos
node src/tiempos.js       # mide el tiempo de clientes recurrentes (tarda cerca de un minuto)
node src/peorcaso.js      # compara datos normales con el peor caso de includes
node src/comparar.js      # compara totalCiudad con cadena de metodos y con una sola pasada
node src/rendimiento.js   # mide todas las funciones con 10.000 ventas y arma las tablas del informe
```

## Que hay en el proyecto

- `src/datos.js`: las 12 ventas como un arreglo de objetos
- `src/analitica.js`: las funciones de analisis
- `src/reporte.js`: el reporte por consola
- `src/generador.js`: genera historiales de ventas de cualquier tamano
- `src/instrumentadas.js`: versiones de las funciones que cuentan sus operaciones
- `src/explorar.js`, `src/pruebas.js`, `src/verificar.js`, `src/depuracion.js`, `src/medir.js`, `src/tiempos.js`, `src/peorcaso.js`, `src/comparar.js`, `src/rendimiento.js`: scripts de apoyo
- `RENDIMIENTO.md`: informe de rendimiento con la complejidad de cada funcion, proyecciones, riesgos y plan de optimizacion
- `bitacora.md`: planes, pruebas, decisiones, registro de depuracion y analisis de rendimiento

## Estado

Version v0.2: el motor ya tiene reporte por consola (v0.1) y un informe de rendimiento. La funcion mas lenta, `clientesRecurrentes`, esta identificada y su mejora esta planeada en `RENDIMIENTO.md`, pero todavia no se implementa.