# bitacora de cafe origen analitica

Aqui voy anotando lo que planeo, lo que pruebo y lo que decido.

---

## minireto 1: mirar los datos

### diccionario de datos

| propiedad | tipo | que significa |
|-----------|------|---------------|
| id | number | numero de la venta, del 1 al 12 |
| fecha | string | fecha de la venta (AAAA-MM-DD), esta guardada como texto |
| cliente | string | codigo del cliente (C01, C02...). un cliente se puede repetir |
| producto | string | lo que se vendio (cafes por origen, prensa francesa, molino) |
| ciudad | string | ciudad de la venta |
| cantidad | number | unidades que se vendieron |
| precio | number | precio de una sola unidad, en pesos. no es el total de la venta |

### casos borde que encontre

1. ciudad mal escrita (id 5). dice "medellín" en minuscula y las otras "Medellín". para javascript son textos distintos, asi que al agrupar por ciudad medellin se partiria en dos. no toco el dato original, pero cuando comparo ciudades uso trim() y toLowerCase().

2. cantidad 0 (id 8). una venta de cero unidades no tiene sentido, puede ser un pedido cancelado o un error al digitar. si la cuento sube el numero de ventas pero no la plata. decidi no contarla como venta valida (cantidad mayor a 0) en el ticket promedio ni en la venta mayor.

3. clientes repetidos. C01 sale 3 veces y C02 y C03 dos veces. no es un error, pero 12 registros no son 12 clientes. si algun dia hay que contar clientes toca contar codigos distintos, no registros.

4. el precio es por unidad. si sumo la columna precio sale cualquier cosa, entonces el valor de una venta siempre es cantidad por precio (por eso existe valorVenta).

### pruebas

corri `node src/explorar.js` y sale: 12 registros, el primero (id 1), el ultimo (id 12) y el producto de la posicion 4, que es "Origen Sierra 500 g" (es el id 5 porque el arreglo empieza en 0). la tabla completa sale con console.table.

---

## minireto 2: indicadores con ciclos

### plan en pseudocodigo

```
# valorVenta
devolver cantidad * precio
```

```
# totalVendido
# recorro todas las ventas, sin condicion, acumulo el valor de cada una, empiezo en 0
total = 0
para cada venta en ventas:
    total = total + valorVenta(venta)
devolver total
```

```
# unidadesVendidas
# recorro todas las ventas, sin condicion, acumulo las cantidades, empiezo en 0
unidades = 0
para cada venta en ventas:
    unidades = unidades + cantidad
devolver unidades
```

```
# ventaMayor
# recorro todas las ventas, solo las validas, guardo la mas grande, empiezo en null
mayor = null
para cada venta en ventas:
    si la venta no es valida, la salto
    si mayor es null o la venta vale mas que mayor:
        mayor = venta
devolver mayor
```
empiezo en null y no en 0 porque quiero devolver el registro completo, y si el arreglo esta vacio no hay ninguno.

```
# ticketPromedio
# recorro todas las ventas, solo las validas, acumulo el valor y cuento las ventas, empiezo en 0 y 0
total = 0
validas = 0
para cada venta en ventas:
    si la venta es valida:
        total = total + valorVenta(venta)
        validas = validas + 1
si validas es 0, devolver 0
devolver total / validas
```

```
# ventasPorCiudad
# recorro todas las ventas, solo las de la ciudad buscada (sin espacios y en minuscula), acumulo el valor, empiezo en 0
buscada = ciudad sin espacios y en minuscula
total = 0
para cada venta en ventas:
    si la ciudad de la venta (sin espacios y en minuscula) es igual a buscada:
        total = total + valorVenta(venta)
devolver total
```

### que devuelve cada funcion con el arreglo vacio

| funcion | con [] devuelve | por que |
|---------|-----------------|---------|
| totalVendido | 0 | el ciclo no da vueltas y se queda en el valor inicial |
| unidadesVendidas | 0 | igual que la anterior |
| ventaMayor | null | no hay ninguna venta que devolver |
| ticketPromedio | 0 | si no lo controlo seria 0 / 0 y da NaN |
| ventasPorCiudad | 0 | no hay ventas en esa ciudad |

otras decisiones:
- la venta del id 8 tiene cantidad 0, asi que no cuenta como valida en ventaMayor ni en ticketPromedio
- si dos ventas valen lo mismo en ventaMayor me quedo con la primera
- ventasPorCiudad ignora mayusculas y espacios pero no tildes, porque el reto solo pedia eso

### trazas a mano

traza 1: totalVendido con las 12 ventas

| vuelta | id | cantidad x precio | total queda en |
|--------|----|-------------------|----------------|
| inicio | | | 0 |
| 1 | 1 | 2 x 42.000 = 84.000 | 84.000 |
| 2 | 2 | 1 x 26.000 = 26.000 | 110.000 |
| 3 | 3 | 1 x 95.000 = 95.000 | 205.000 |
| 4 | 4 | 1 x 42.000 = 42.000 | 247.000 |
| 5 | 5 | 3 x 45.000 = 135.000 | 382.000 |
| 6 | 6 | 2 x 26.000 = 52.000 | 434.000 |
| 7 | 7 | 1 x 120.000 = 120.000 | 554.000 |
| 8 | 8 | 0 x 42.000 = 0 | 554.000 |
| 9 | 9 | 2 x 45.000 = 90.000 | 644.000 |
| 10 | 10 | 4 x 42.000 = 168.000 | 812.000 |
| 11 | 11 | 1 x 95.000 = 95.000 | 907.000 |
| 12 | 12 | 3 x 26.000 = 78.000 | 985.000 |

a mano me dio 985.000 y el programa tambien dio 985000. coincide.

traza 2: ventaMayor con las 12 ventas

| vuelta | id | valor | que pasa | mayor queda en |
|--------|----|-------|----------|----------------|
| inicio | | | | null |
| 1 | 1 | 84.000 | mayor era null, entra | id 1 |
| 2 | 2 | 26.000 | no supera | id 1 |
| 3 | 3 | 95.000 | supera a 84.000 | id 3 |
| 4 | 4 | 42.000 | no supera | id 3 |
| 5 | 5 | 135.000 | supera a 95.000 | id 5 |
| 6 | 6 | 52.000 | no supera | id 5 |
| 7 | 7 | 120.000 | no supera a 135.000 | id 5 |
| 8 | 8 | 0 | cantidad 0, la salto | id 5 |
| 9 | 9 | 90.000 | no supera | id 5 |
| 10 | 10 | 168.000 | supera a 135.000 | id 10 |
| 11 | 11 | 95.000 | no supera | id 10 |
| 12 | 12 | 78.000 | no supera | id 10 |

a mano me dio la venta id 10 (huila, pereira, 168.000) y el programa devolvio ese mismo registro. coincide.

### pruebas

estan en src/pruebas.js y se corren con `node src/pruebas.js`. probe cada funcion con el arreglo completo, con un solo elemento (el id 1) y con el arreglo vacio. tambien probe una venta escrita como "medellin " con un espacio al final.

resultados con el arreglo completo:
- totalVendido: 985000
- unidadesVendidas: 21
- ventaMayor: id 10
- ticketPromedio: unos 89.545 (985.000 entre 11 ventas validas)
- ventasPorCiudad medellin: 356000

con el arreglo vacio ninguna funcion falla ni da NaN.

---

## minireto 3: metodos de arreglo, agrupaciones y ranking

### de ciclo a metodo

- totalVendidoM y unidadesVendidasM: el total que empezaba en 0 ahora es el valor inicial del reduce
- ventasPorCiudadM: el if del ciclo pasa a ser filter, map saca el valor de cada venta y reduce los suma
- a todos los reduce les puse valor inicial (0 o {}), porque sin eso con el arreglo vacio da error

### las cinco preguntas de cada funcion

| funcion | que recorro | que filtro | que transformo | que acumulo | como agrupo |
|---------|-------------|------------|----------------|-------------|-------------|
| totalVendidoM | las ventas | nada | nada | el valor de cada venta | no agrupo |
| unidadesVendidasM | las ventas | nada | nada | las cantidades | no agrupo |
| ventasPorCiudadM | las ventas | las de la ciudad buscada | cada venta a su valor | los valores | no agrupo |
| totalPorCiudad | las ventas | nada | el nombre de la ciudad (limpio y con mayuscula) | el valor de cada venta | por ciudad, en un objeto |
| unidadesPorProducto | las ventas | nada | nada | las cantidades | por producto, en un objeto |
| topProductosPorValor | las ventas y despues las parejas producto-total | slice deja solo las k primeras | cada pareja a un objeto con producto y total | el valor de cada venta | por producto, en un objeto |

### decisiones

- en totalPorCiudad dejo la primera letra en mayuscula y el resto en minuscula, asi "medellin " y "Medellin" caen en el mismo grupo y salen exactamente 4 ciudades
- Object.entries pasa el objeto a un arreglo de parejas [producto, total], que es lo que se puede ordenar
- sort cambia el arreglo que ordena, por eso primero hago una copia con [...Object.entries(totales)]
- ordeno con (a, b) => b[1] - a[1] para que quede de mayor a menor
- si k es mas grande que la cantidad de productos, slice devuelve los que haya y no falla

### resultados de verificar.js

corri `node src/verificar.js` y los 12 pares ciclo/metodo salieron OK (arreglo completo, un elemento y vacio).

- totalPorCiudad: medellin 356000, bogota 276000, cali 185000, pereira 168000 (son 4 ciudades y suman 985000)
- unidadesPorProducto: huila 7, narino 6, sierra 5, prensa francesa 2, molino manual 1 (suman 21)
- top 3 por valor: huila 294000, sierra 225000, prensa francesa 190000
- el orden de ventas sigue del 1 al 12 despues de llamar a todo


## minireto 4: el primer reporte (v0.1)

### plan

```
# ventasDelDia(ventas, fecha)
# recorro las ventas, me quedo solo con las de esa fecha, no acumulo nada
buscada = fecha sin espacios
devolver las ventas cuya fecha sea igual a buscada
```
si ese dia no hubo ventas devuelve un arreglo vacio, no un error.

```
# reporte
mostrar titulo
seccion 1: registros, unidades, total, ticket promedio y venta mas grande
seccion 2: totalPorCiudad ordenado de mayor a menor
seccion 3: unidadesPorProducto ordenado de mayor a menor
seccion 4: topProductosPorValor con k = 3
resumen de un dia con ventas (2026-09-02)
resumen de un dia sin ventas (2026-09-07)
```

decisiones del reporte:
- los valores en pesos salen con toLocaleString("es-CO") y sin decimales, porque el ticket promedio tiene decimales (89.545,45) y se ve mejor redondeado
- las lineas se alinean con padEnd (nombre a la izquierda) y padStart (valor a la derecha)
- si no hay venta mayor se muestra "ninguna" para que no salga undefined
- si un dia no tuvo ventas se muestra el mensaje "No hubo ventas este dia." y los valores en cero

### registro de depuracion

los dos errores estan reproducidos en `src/depuracion.js`. como no tengo la version del companero, reconstrui las dos funciones como creo que estaban.

**error 1: bogota aparece dos veces**

- sintoma: en el total por ciudad, bogota sale en dos filas
- entrada que lo produce: ventas donde una ciudad viene escrita con un espacio al final, por ejemplo "Bogotá " (probe agregando una venta con ese texto)
- hipotesis: la funcion usa el nombre de la ciudad tal cual para armar el diccionario, y para javascript "Bogotá" y "Bogotá " son claves distintas
- prueba realizada: imprimi las claves del objeto entre comillas con JSON.stringify para ver los espacios escondidos. salieron "Bogotá" y "Bogotá " como dos claves, y de paso tambien "Medellín" y "medellín" separadas (la del id 5)
- causa: no se limpiaba ni se pasaba a un formato comun el nombre de la ciudad antes de usarlo como clave
- correccion: en totalPorCiudad uso normalizarTexto (trim y minuscula) y luego pongo la primera letra en mayuscula. con eso salen 4 ciudades y bogota suma 396000 (276000 de antes mas 120000 de la venta con espacio)

**error 2: el ticket promedio da NaN cuando filtro un dia sin ventas**

- sintoma: el ticket promedio sale NaN
- entrada que lo produce: un dia sin ventas, por ejemplo ventasDelDia(ventas, "2026-09-07"), que devuelve un arreglo vacio
- hipotesis: se divide el total entre la cantidad de ventas, y con cero ventas es 0 / 0
- prueba realizada: imprimi las dos partes de la division con el dia sin ventas: total 0, largo 0, y 0 / 0 dio NaN. tambien probe con un dia que si tiene ventas (2026-09-02) y ahi la version mala daba bien (68500)
- causa: la division se hacia sin revisar antes si habia ventas validas
- correccion: en ticketPromedio, si validas es 0 devuelvo 0 antes de dividir. ademas el contador solo cuenta ventas con cantidad mayor a 0

**mi version ya no tiene los errores.** `node src/depuracion.js` muestra 4 ciudades (la mala daba 6) y ticketPromedio de un dia sin ventas da 0 (la mala daba NaN). ademas el reporte muestra el dia sin ventas con ceros y no con NaN.

### prueba final

corri `node src/reporte.js` y salen las cuatro secciones y los dos resumenes de dia. revise la salida y no aparece NaN, undefined ni ciudades repetidas.

- total vendido: $ 985.000
- unidades vendidas: 21
- ticket promedio: $ 89.545
- venta mas grande: $ 168.000 (Origen Huila 500 g, Pereira)
- ciudades: Medellin $ 356.000, Bogota $ 276.000, Cali $ 185.000, Pereira $ 168.000
- top 3: Huila $ 294.000, Sierra $ 225.000, Prensa francesa $ 190.000
- dia con ventas (2026-09-02): 2 registros, 2 unidades, $ 137.000, ticket $ 68.500
- dia sin ventas (2026-09-07): "No hubo ventas este dia." y todo en cero

tambien volvi a correr `node src/verificar.js` y `node src/pruebas.js` para confirmar que lo de los minireto anteriores sigue bien.

## minireto 5: contar operaciones

### como cuento las operaciones

- totalVendido: 1 por cada venta que visito
- ventaMayor: 1 por visitar la venta y 1 por compararla con la mayor
- totalPorCiudad: 1 por visitar la venta y 1 por preguntar si la ciudad ya esta en el objeto
- primeraVenta: 1 en total, sin importar el tamano del arreglo

### prediccion antes de medir

si n se multiplica por 10:

- totalVendido: las operaciones se multiplican por 10, porque hace una operacion por cada venta
- ventaMayor: tambien por 10. hace el doble de operaciones que totalVendido, pero ese doble tambien se multiplica por 10
- totalPorCiudad: tambien por 10, por lo mismo que ventaMayor
- primeraVenta: no cambia, siempre hace una sola operacion

con n = 100 espero unas 100 operaciones en totalVendido, unas 200 en ventaMayor y totalPorCiudad, y 1 en primeraVenta.