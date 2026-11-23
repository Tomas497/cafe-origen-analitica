# Informe de rendimiento del motor de analítica de Café Origen (v0.2)

## Resumen

El motor tiene 16 funciones. Quince de ellas se comportan bien: o no crecen (O(1)) o crecen en línea recta con el número de ventas (O(n)), y con 1.000.000 de ventas cada una tarda del orden de milisegundos a pocos cientos de milisegundos según la proyección de más abajo. Una sola, `clientesRecurrentes`, crece con el cuadrado de las ventas (O(n²)): con 10.000 ventas tarda más o menos medio segundo, con 100.000 tardó casi dos minutos (106,9 segundos medidos) y con 1.000.000 se estima en unas tres horas. Es el único problema serio de tiempo y es el que hay que corregir antes de conectar el motor al marketplace.

Además, tres funciones (`ventasPorCiudadM`, `ventasDelDia` y `totalCiudadCadena`) crean arreglos tan grandes como los datos. No son lentas, pero gastan memoria, que en el servidor del marketplace es limitada.

## Como se midió

- Los datos salen de `src/generador.js`: 10.000 ventas al azar con la misma estructura de las ventas reales.
- Cada función se ejecuta primero una vez, como calentamiento, y después se mide su tiempo con `performance.now()`: 15 veces las rápidas y 3 veces `clientesRecurrentes`. Se registra la medición menor, para que otros procesos del computador no la distorsionen.
- Todo lo hace el script `node src/rendimiento.js`, que imprime las dos tablas de este informe.
- Los tiempos son de mi computador. En otro equipo los números cambian, pero la forma en que crecen no. Con 10.000 ventas las funciones lineales tardan menos de un milisegundo y a esa escala las mediciones tienen ruido, así que lo que importa es el orden de magnitud y no el decimal.
- Notación: n es el número de ventas, c la cantidad de ciudades distintas, p la de productos distintos y r la de clientes recurrentes. En Big O se eliminan las constantes: O(2n) y O(4n) se escriben O(n).

## Clasificación de cada función

| Función | Qué hace | Tiempo | Espacio | Justificación | Tiempo medido con 10.000 ventas (ms) |
|---------|----------|--------|---------|---------------|--------------------------------------|
| valorVenta | multiplica cantidad por precio de una venta | O(1) | O(1) | es una sola multiplicacion, no recorre nada | menos de 0.001 |
| totalVendido | suma el valor de todas las ventas | O(n) | O(1) | un ciclo que pasa una vez por cada venta y guarda un solo numero | 0.015 |
| unidadesVendidas | suma las unidades de todas las ventas | O(n) | O(1) | un ciclo que pasa una vez por cada venta y guarda un solo numero | 0.014 |
| ventaMayor | devuelve la venta de mayor valor | O(n) | O(1) | un ciclo con una comparacion por venta, y guarda solo una referencia a una venta que ya existe | 0.046 |
| ticketPromedio | valor promedio de las ventas validas | O(n) | O(1) | un ciclo que guarda dos numeros, el total y el contador | 0.139 |
| ventasPorCiudad | total vendido en una ciudad | O(n) | O(1) | un ciclo que guarda un solo numero | 0.3 |
| totalVendidoM | lo mismo que totalVendido, con reduce | O(n) | O(1) | reduce recorre una vez y solo lleva un numero, no crea arreglos | 0.074 |
| unidadesVendidasM | lo mismo que unidadesVendidas, con reduce | O(n) | O(1) | reduce recorre una vez y solo lleva un numero | 0.069 |
| ventasPorCiudadM | lo mismo que ventasPorCiudad, con filter, map y reduce | O(n) | O(n) | tres recorridos, y filter y map crean dos arreglos de hasta n elementos | 0.332 |
| totalPorCiudad | total vendido por cada ciudad | O(n) | O(c) | un recorrido, y el objeto tiene una clave por ciudad, no una por venta | 1.699 |
| unidadesPorProducto | unidades vendidas de cada producto | O(n) | O(p) | un recorrido, y el objeto tiene una clave por producto | 0.306 |
| topProductosPorValor | los k productos que mas dinero generaron | O(n + p log p) | O(p) | agrupa en un recorrido y despues ordena solo los p productos, no las ventas | 0.328 |
| ventasDelDia | las ventas de una fecha | O(n) | O(n) | filter recorre todas las ventas y crea un arreglo con las del dia, que en el peor caso son todas | 0.119 |
| clientesRecurrentes | clientes que compraron mas de una vez | O(n²) | O(r) | dos ciclos anidados que comparan cada venta con las siguientes, n x (n - 1) / 2 comparaciones, y includes agrega trabajo | 421.878 |
| totalCiudadCadena | total de una ciudad con map, filter, map y reduce | O(n) | O(n) | cuatro recorridos que crean tres arreglos nuevos y n objetos nuevos | 0.503 |
| totalCiudadUnaPasada | total de una ciudad con un solo ciclo | O(n) | O(1) | un recorrido que guarda un solo numero | 0.303 |
Notas sobre la tabla:

- `totalPorCiudad`, `unidadesPorProducto` y `topProductosPorValor` usan memoria que depende del número de grupos (c o p), no del número de ventas. En Café Origen hay 4 o 5 ciudades y 5 productos, así que en la práctica son memoria constante. Solo serían O(n) si cada venta fuera de una ciudad o un producto distinto.
- `topProductosPorValor` ordena los p productos, no las n ventas, por eso el costo de ordenar es p log p y no n log n.
- `clientesRecurrentes` es O(n²) por los dos ciclos anidados: hace n x (n - 1) / 2 comparaciones. Además `includes` recorre la lista de recurrentes cada vez que dos ventas son del mismo cliente, lo que en el peor caso agrega otro factor de n.

## Proyección

El método es sencillo. Se parte del tiempo medido con 10.000 ventas. Con 1.000.000 hay 100 veces más ventas, así que:

- una función O(n) hace 100 veces más trabajo,
- una función O(n²) hace 100 x 100 = 10.000 veces más trabajo,
- una función O(1) hace el mismo trabajo.

| Función | Tiempo con 10.000 ventas | Veces más trabajo con 1.000.000 | Estimación con 1.000.000 |
|---------|--------------------------|---------------------------------|--------------------------|
| valorVenta | menos de 0.001 ms | 1 | menos de 0.001 ms |
| totalVendido | 0.015 ms | 100 | 1.5 ms |
| unidadesVendidas | 0.014 ms | 100 | 1.4 ms |
| ventaMayor | 0.046 ms | 100 | 4.6 ms |
| ticketPromedio | 0.139 ms | 100 | 13.9 ms |
| ventasPorCiudad | 0.3 ms | 100 | 30.0 ms |
| totalVendidoM | 0.074 ms | 100 | 7.4 ms |
| unidadesVendidasM | 0.069 ms | 100 | 6.9 ms |
| ventasPorCiudadM | 0.332 ms | 100 | 33.2 ms |
| totalPorCiudad | 1.7 ms | 100 | 169.9 ms |
| unidadesPorProducto | 0.306 ms | 100 | 30.6 ms |
| topProductosPorValor | 0.328 ms | 100 | 32.8 ms |
| ventasDelDia | 0.119 ms | 100 | 11.9 ms |
| clientesRecurrentes | 421.9 ms | 10000 | 70.3 minutos |
| totalCiudadCadena | 0.503 ms | 100 | 50.3 ms |
| totalCiudadUnaPasada | 0.303 ms | 100 | 30.3 ms |

Cómo leer la proyección:

- Las funciones lineales quedan en milisegundos o en pocas decenas o cientos de milisegundos. Son estimaciones y la realidad puede ser algo mayor, porque con arreglos muy grandes el computador gasta más tiempo en memoria. Lo vi con la cadena de métodos (MiniReto 7): cuando n se multiplica por 10, su tiempo se multiplica por 10 o un poco más.
- Para `clientesRecurrentes` la cifra de la tabla se queda corta. En el MiniReto 6, la fórmula del cuadrado desde 16.000 ventas dio 48,7 segundos para 100.000, y el tiempo real fue 106,9 segundos. Por eso, para esta función uso la medición real de 100.000: 106,9 segundos x 100 = 10.690 segundos, es decir unos 178 minutos (casi 3 horas) con 1.000.000 de ventas.

## Riesgos

El orden va de mayor a menor riesgo cuando los datos crezcan. Los criterios, en este orden:

1. Cómo crece el tiempo: lo cuadrático pesa mucho más que lo lineal, y lo lineal más que lo constante.
2. Memoria extra proporcional a los datos, porque el servidor del marketplace tiene memoria limitada.
3. Tiempo proyectado con 1.000.000 de ventas, para desempatar.

| Puesto | Función | Por qué |
|--------|---------|---------|
| 1 | clientesRecurrentes | O(n²): unas 3 horas con 1.000.000 de ventas. Es la única que se vuelve inusable por tiempo |
| 2 | totalCiudadCadena | O(n) en tiempo, pero O(n) en memoria: tres arreglos nuevos y n objetos nuevos solo para sumar un número |
| 3 | ventasPorCiudadM | O(n) en tiempo y O(n) en memoria: dos arreglos de hasta n elementos |
| 4 | ventasDelDia | O(n) en tiempo y O(n) en memoria en el peor caso, cuando todas las ventas son del mismo día |
| 5 | topProductosPorValor | O(n + p log p): es lineal mientras p sea pequeño, pero hace copias y ordena, y si el número de productos creciera mucho dejaría de ser barata |
| 6 | totalPorCiudad y unidadesPorProducto | O(n) con memoria que depende de los grupos: riesgo bajo mientras haya pocas ciudades y productos |
| 7 | totalVendido, unidadesVendidas, ventaMayor, ticketPromedio, ventasPorCiudad, totalVendidoM, unidadesVendidasM y totalCiudadUnaPasada | O(n) con memoria constante: un recorrido y un par de números |
| 8 | valorVenta | O(1): no depende de las ventas |

## Plan de optimización

La función de mayor riesgo es `clientesRecurrentes`. Esta es la idea de la mejora; todavía no está implementada.

**Qué trabajo se repite**

- Cada venta se compara con todas las que vienen después, buscando al mismo cliente. El mismo cliente se vuelve a comparar muchas veces con ventas de otros clientes que no sirven, y la pregunta "¿este cliente ya compró antes?" se contesta desde cero en cada pareja.
- `includes` vuelve a recorrer la lista de recurrentes cada vez que aparece un cliente que ya estaba en ella.

**Qué información se podría guardar para no buscarla de nuevo**

Un registro, un objeto que use el código de cliente como clave y cuente cuántas veces ha aparecido. Se recorrerían las ventas una sola vez: para cada venta se mira en el objeto, con una consulta directa, que no recorre nada, si el cliente ya está, y se le suma 1. Al terminar, los clientes recurrentes son los que tienen un 2 o más.

**Resultado esperado**

- Un solo recorrido, es decir O(n) en tiempo, en lugar de O(n²).
- Memoria extra: una clave por cliente distinto, O(k) con k clientes distintos. Se paga un poco de memoria para ganar mucho tiempo.
- Con 1.000.000 de ventas el reporte debería pasar de unas tres horas a una fracción de segundo o unos pocos segundos.