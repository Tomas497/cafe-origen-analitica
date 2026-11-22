# cafe-origen-analitica

Motor de analitica de ventas para Cafe Origen, una tostadora de cafe de especialidad de Medellin. Lo estoy haciendo como parte del trabajo con Nodo Digital. Hoy la tienda lleva las ventas en hojas de calculo y nadie sabe responder con certeza cual fue el producto mas vendido o que ciudad compra mas. Este proyecto calcula esas respuestas desde el codigo.

## Que preguntas responde

- cuanto se vendio en total y cuantas unidades salieron
- cual fue la venta mas grande
- cuanto gasta en promedio un cliente por compra (ticket promedio)
- cuanto se vendio en cada ciudad
- que productos salen mas, por unidades
- cuales son los 3 productos que mas dinero generan
- como le fue a un dia en particular (tambien si ese dia no hubo ventas)

## Como ejecutarlo

Necesita Node.js (version LTS). Desde la carpeta del proyecto:

```bash
node src/reporte.js
```

Eso imprime el reporte completo. Tambien hay otros scripts:

```bash
node src/explorar.js     # muestra como son los datos
node src/pruebas.js      # pruebas de las funciones con ciclos
node src/verificar.js    # compara cada ciclo con su version con metodos
node src/depuracion.js   # reproduce los dos errores que reporto la gerente
```

## Que hay en el proyecto

- `src/datos.js`: las 12 ventas como un arreglo de objetos
- `src/analitica.js`: las funciones de analisis
- `src/reporte.js`: el reporte por consola
- `src/explorar.js`, `src/pruebas.js`, `src/verificar.js`, `src/depuracion.js`: scripts de apoyo
- `bitacora.md`: planes, pruebas, decisiones y registro de depuracion

## Estado

Version v0.1: reporte por consola funcionando.