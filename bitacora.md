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

---

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

---

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

### resultados de medir.js

antes de medir revise el generador: para n = 1, 10, 100 y 1000 devuelve exactamente n ventas, todas validas (cantidad entre 1 y 5), y nunca mas de n/3 clientes distintos. tambien revise que las versiones que cuentan dan el mismo resultado que las originales (los tres dieron OK).

operaciones por tamano:

| n | totalVendido | ventaMayor | totalPorCiudad | primeraVenta |
|---|--------------|------------|----------------|--------------|
| 100 | 100 | 200 | 200 | 1 |
| 1.000 | 1.000 | 2.000 | 2.000 | 1 |
| 10.000 | 10.000 | 20.000 | 20.000 | 1 |
| 100.000 | 100.000 | 200.000 | 200.000 | 1 |

cuantas veces crecen las operaciones cuando n se multiplica por 10:

| cambio | totalVendido | ventaMayor | totalPorCiudad | primeraVenta |
|--------|--------------|------------|----------------|--------------|
| 100 a 1.000 | 10 | 10 | 10 | 1 |
| 1.000 a 10.000 | 10 | 10 | 10 | 1 |
| 10.000 a 100.000 | 10 | 10 | 10 | 1 |

### comparacion con mi prediccion

acerte. las tres funciones con ciclo crecen exactamente 10 veces cuando n crece 10 veces, y primeraVenta se queda en 1. con n = 100 las cantidades fueron las que esperaba: 100, 200, 200 y 1. lo unico que cuenta es que ventaMayor y totalPorCiudad hacen el doble que totalVendido porque en cada venta cuento dos operaciones, pero eso no cambia como crecen.

### clasificacion big o

- totalVendido: O(n). el codigo tiene un solo ciclo que pasa una vez por cada venta. los numeros lo confirman: 100.000 operaciones con n = 100.000
- ventaMayor: O(n). tambien un solo ciclo. hace 2 operaciones por venta, o sea 2n, y en Big O las constantes se quitan, entonces queda O(n). los numeros: 200.000 con n = 100.000 y crece 10 veces cuando n crece 10 veces
- totalPorCiudad: O(n). un solo ciclo con 2n operaciones. buscar la ciudad dentro del objeto no recorre nada, es una consulta directa, por eso no agrega otro ciclo
- primeraVenta: O(1). siempre hace una operacion, con n = 100 o con n = 100.000 da 1

ninguna salio O(n al cuadrado) porque ninguna tiene un ciclo dentro de otro ciclo. la que si lo tiene viene en el siguiente minireto.

---

## minireto 6: el reporte que se volvio lento

### revision de la funcion

agregue clientesRecurrentes a analitica.js tal como la escribio el companero. con los 12 datos del dia 1 devuelve C01, C02 y C03. tiene sentido: C01 compro 3 veces, C02 y C03 dos veces, y los demas una sola vez.

### traza con 5 ventas

use las primeras 5 ventas del dia 1. los clientes, en las posiciones 0 a 4, son C01, C02, C03, C01 y C04.

| i | j | cliente de i | cliente de j | son iguales | que pasa |
|---|---|--------------|--------------|-------------|----------|
| 0 | 1 | C01 | C02 | no | nada |
| 0 | 2 | C01 | C03 | no | nada |
| 0 | 3 | C01 | C01 | si | recurrentes esta vacio, entonces agrego C01 |
| 0 | 4 | C01 | C04 | no | nada |
| 1 | 2 | C02 | C03 | no | nada |
| 1 | 3 | C02 | C01 | no | nada |
| 1 | 4 | C02 | C04 | no | nada |
| 2 | 3 | C03 | C01 | no | nada |
| 2 | 4 | C03 | C04 | no | nada |
| 3 | 4 | C01 | C04 | no | nada |

hace 10 comparaciones y el resultado es [C01].

generalizacion: la primera venta se compara con las n - 1 que le siguen, la segunda con n - 2, y asi hasta la ultima, que no se compara con ninguna. la suma es (n - 1) + (n - 2) + ... + 1 = n x (n - 1) / 2. con n = 5 son 10, con n = 12 son 66 y con n = 1000 son 499.500. como n x (n - 1) / 2 crece como n al cuadrado, la funcion es O(n²).

### tiempos

para medir uso console.time y console.timeEnd. antes de medir hago una corrida de calentamiento, y cada tamano lo mido 3 veces y me quedo con el menor tiempo, para que otros procesos del computador no distorsionen el resultado.

| n | tiempo (ms) | veces mas que el anterior |
|---|-------------|---------------------------|
| 1000 | 3.58 | |
| 2000 | 15.81 | 4.41 |
| 4000 | 66.83 | 4.23 |
| 8000 | 295.19 | 4.42 |
| 16000 | 1245.55 | 4.22 |

### analisis de la tabla

cuando n se duplica, el tiempo se multiplica aproximadamente por 4. en mi tabla la columna "veces mas que el anterior" va entre 4,22 y 4,42. no sale exacto porque el computador tiene otros procesos y porque los datos son al azar.

esto es lo que se espera de O(n²): si n pasa a 2n, las comparaciones pasan de n x n / 2 a (2n) x (2n) / 2, que es 4 veces mas. si la funcion fuera lineal, O(n), al duplicar n el tiempo solo se duplicaria. mi tabla se parece a lo cuadratico, no a lo lineal.

### estimaciones

si n se multiplica por k, el tiempo se multiplica por k al cuadrado.

- para 100.000: n pasa de 16.000 a 100.000, o sea 6,25 veces mas. el tiempo se multiplica por 6,25 x 6,25 = 39,06. estimacion = tiempo de n = 16.000 x 39,06
- para 1.000.000: n es 62,5 veces mas que 16.000. el tiempo se multiplica por 62,5 x 62,5 = 3.906,25. estimacion = tiempo de n = 16.000 x 3.906,25

resultados que imprimio tiempos.js, con la medicion de n = 16.000:

- estimacion para 100.000 ventas: 48,7 segundos (0,8 minutos)
- estimacion para 1.000.000 ventas: 4.865 segundos (81,1 minutos)

como la estimacion para 100.000 dio menos de dos minutos, la ejecute de verdad:

- tiempo real con 100.000 ventas: 106,9 segundos (1,8 minutos)
- estimacion para 1.000.000 usando esa medicion: 10.690 segundos (178,2 minutos, casi 3 horas)

la estimacion y lo real no coinciden exacto: estime 48,7 segundos y tardo 106,9, mas del doble. la formula del cuadrado da una idea del orden de magnitud, pero en la realidad el tiempo crece un poco mas rapido. creo que se debe a que con muchos mas datos el computador usa mas memoria, y a que includes tiene mas trabajo cuando hay mas clientes recurrentes. por eso la estimacion de 1.000.000 que sale del dato real de 100.000 es mas confiable que la que sale de 16.000.

### costo oculto: includes

`recurrentes.includes(...)` tambien recorre un arreglo: busca el cliente dentro de la lista de recurrentes. esa lista puede llegar a tener hasta n / 2 clientes, y includes se ejecuta cada vez que dos ventas son del mismo cliente.

en el peor caso esto agrega otro factor de n. por ejemplo: primero hay muchos clientes que compran dos veces, entonces la lista de recurrentes crece mucho. al final hay un cliente con muchisimas compras: cada pareja de sus ventas ejecuta includes, y includes tiene que recorrer la lista larga hasta encontrarlo. con eso el total se puede acercar a n al cubo, que es todavia peor que n al cuadrado.

con datos normales, donde cada cliente compra pocas veces, hay pocas parejas iguales y includes aporta bastante menos, asi que la funcion se queda cerca de n al cuadrado.

lo comprobe con peorcaso.js:

| n | datos normales (ms) | peor caso (ms) |
|---|---------------------|----------------|
| 1000 | 5.5 | 30 |
| 2000 | 18.9 | 277.2 |
| 4000 | 94 | 2294.9 |

con datos normales, al duplicar n el tiempo se multiplica por 3,44 y luego por 4,97, o sea cerca de 4, como en O(n²). con el peor caso se multiplica por 9,24 y luego por 8,28, o sea cerca de 8 o mas, que es lo que se espera de algo cercano a n al cubo. con n = 4000 el peor caso tardo unas 24 veces mas que los datos normales (2294,9 contra 94), aunque los dos tenian la misma cantidad de ventas.

### conclusion para la gerente

el reporte se pone lento porque, para saber que clientes compraron mas de una vez, el programa compara cada venta con todas las demas. con pocas ventas no se nota, pero cada vez que las ventas se duplican el trabajo se multiplica por cuatro. en mis pruebas, con 1.000 ventas el reporte sale en milisegundos, con 16.000 tarda poco mas de un segundo, con 100.000 ventas tarda casi dos minutos, y con 1.000.000 ventas puede tardar alrededor de tres horas. con las ventas que espera tener Cafe Origen en el marketplace, el reporte no se puede usar tal como esta. la solucion no es comprar un computador mas rapido, sino cambiar la forma en que el programa busca a los clientes repetidos, y eso se puede lograr con un trabajo corto.

---

## minireto 7: tiempo, memoria y cadenas de metodos

### las dos versiones

```
# totalCiudadCadena, cuatro pasos encadenados
1. map: normalizo la ciudad de cada venta
2. filter: dejo solo las de la ciudad buscada
3. map: calculo el valor de cada una
4. reduce: sumo los valores
```

```
# totalCiudadUnaPasada, un solo ciclo
buscada = ciudad sin espacios y en minuscula
total = 0
para cada venta en ventas:
    si la ciudad de la venta (sin espacios y en minuscula) es igual a buscada:
        total = total + valorVenta(venta)
devolver total
```

la de una pasada es igual a ventasPorCiudad del minireto 2, solo que la escribi de nuevo para compararla.

### comprobacion

corri `node src/comparar.js`. con los 12 datos del dia 1 las dos dieron 356000 para Medellin (incluyendo la venta escrita "medellín"), tambien con la ciudad escrita "  MEDELLÍN ", con una ciudad que no existe y con el arreglo vacio. con 10.000 ventas del generador las dos devolvieron exactamente el mismo valor en las 6 ciudades (cinco que existen y una que no). todo salio OK.

### recorridos y arreglos nuevos

| version | recorridos | arreglos nuevos | tiempo | espacio |
|---------|------------|-----------------|--------|---------|
| cadena | 4 | 3 | O(n) | O(n) |
| una pasada | 1 | 0 | O(n) | O(1) |

en la cadena:
- map 1: recorre las n ventas y crea un arreglo nuevo de n objetos (uno por venta, con la ciudad normalizada)
- filter: recorre esos n y crea un arreglo con las m ventas de la ciudad
- map 2: recorre las m y crea un arreglo de m numeros
- reduce: recorre las m y devuelve un solo numero, no crea arreglo

m puede ir de 0 hasta n. en el peor caso, cuando todas las ventas son de esa ciudad, m = n y los cuatro recorridos son de n elementos.

en la de una pasada hay un solo ciclo y solo se guardan dos cosas: la ciudad buscada y el total. no se crea ningun arreglo.

### por que las dos son O(n) en tiempo

la cadena hace n + n + m + m operaciones, y como m nunca es mas que n, son como maximo 4n. en Big O se eliminan las constantes, entonces O(4n) se simplifica a O(n). lo que importa es como crece: si n se multiplica por 10, 4n tambien se multiplica por 10, igual que n en la de una pasada. las dos crecen en linea recta, una con una pendiente mayor que la otra.

eso no quiere decir que tarden lo mismo. la cadena hace mas trabajo por cada venta y se demora mas. el 4 se ignora en la notacion, pero se nota en la tabla de tiempos.

### tiempos medidos

repeti cada medicion 5 veces y me quedo con la menor, con una corrida de calentamiento antes.

| n | cadena (ms) | una pasada (ms) | veces mas lenta la cadena |
|---|-------------|-----------------|---------------------------|
| 10000 | 0.6 | 0.22 | 2.7 |
| 100000 | 10.45 | 3.34 | 3.1 |
| 1000000 | 146.24 | 29.59 | 4.9 |

la cadena es mas lenta que la de una pasada en todos los tamanos. cuando n se multiplica por 10, el tiempo de la una pasada se multiplica por cerca de 10. el de la cadena se multiplica por 10 o un poco mas. creo que es porque crear arreglos tan grandes gasta memoria y despues el computador tiene que limpiarla, y eso agrega tiempo. aun asi las dos siguen siendo lineales.

### complejidad espacial y temporal de todas las funciones del motor

en las funciones que agrupan uso estas letras: c es la cantidad de ciudades distintas, p la de productos distintos y r la de clientes recurrentes.

| funcion | tiempo | espacio | por que |
|---------|--------|---------|---------|
| valorVenta | O(1) | O(1) | una multiplicacion |
| totalVendido | O(n) | O(1) | solo guarda un numero, el total |
| unidadesVendidas | O(n) | O(1) | solo guarda un numero |
| ventaMayor | O(n) | O(1) | guarda una referencia a una venta que ya existe, no la copia |
| ticketPromedio | O(n) | O(1) | guarda dos numeros, total y contador |
| ventasPorCiudad | O(n) | O(1) | guarda un numero |
| totalVendidoM | O(n) | O(1) | reduce solo lleva un numero, no crea arreglos |
| unidadesVendidasM | O(n) | O(1) | igual que la anterior |
| ventasPorCiudadM | O(n) | O(n) | filter y map crean dos arreglos que pueden tener hasta n elementos |
| totalPorCiudad | O(n) | O(c) | el objeto tiene una clave por ciudad, no una por venta |
| unidadesPorProducto | O(n) | O(p) | el objeto tiene una clave por producto |
| topProductosPorValor | O(n + p log p) | O(p) | agrupa por producto (objeto de p claves), y las copias, el sort y el slice trabajan sobre p parejas, no sobre las ventas |
| ventasDelDia | O(n) | O(n) | filter crea un arreglo con las ventas del dia, que en el peor caso son todas |
| clientesRecurrentes | O(n²) | O(r) | la lista de recurrentes puede llegar a n / 2 clientes |
| totalCiudadCadena | O(n) | O(n) | tres arreglos nuevos y n objetos nuevos |
| totalCiudadUnaPasada | O(n) | O(1) | guarda un numero |

sobre totalPorCiudad y topProductosPorValor: aunque usan reduce y crean objetos y arreglos, la memoria no depende del numero de ventas sino del numero de grupos. en Cafe Origen hay 4 o 5 ciudades y 5 productos, y eso no crece cuando las ventas pasan de 12 a 1.000.000, asi que en la practica se comportan como memoria constante. solo serian O(n) en el peor caso imaginable, si cada venta tuviera una ciudad o un producto distinto.

en topProductosPorValor tambien se ordena, pero se ordenan los p productos y no las n ventas, por eso el sort cuesta p log p y no n log n.

### decision

dejo totalCiudadUnaPasada en el motor y la cadena solo en el archivo para comparar.

- legibilidad: la cadena se lee como una receta de cuatro pasos (normalizo, filtro, calculo, sumo), y es facil de explicar a otra persona. la de una pasada tambien es corta, un ciclo con un if, y una vez entendido el ciclo no es mas dificil de leer.
- recursos: el servidor del marketplace tiene memoria limitada. la cadena crea tres arreglos y n objetos nuevos solo para sumar un numero. con 1.000.000 de ventas son millones de objetos. la de una pasada no crea nada y, segun mi tabla, tarda varias veces menos.
- conclusion: con pocos datos y el codigo que solo yo mantengo, la cadena estaria bien. pero aqui la memoria importa y no hay ninguna ganancia de legibilidad que justifique pagar tanto, asi que elijo la de una pasada.

---

## minireto 8: informe de rendimiento (v0.2)

### que hice

- cree `src/rendimiento.js`, que mide las 16 funciones del motor con 10.000 ventas e imprime dos tablas ya en formato markdown: la clasificacion con el tiempo medido, y la proyeccion con 1.000.000 de ventas
- copie esas dos tablas a `RENDIMIENTO.md` y escribi alrededor el resumen, como se midio, los riesgos y el plan de optimizacion

### decisiones

- incluí las 16 funciones: las del dia 1, clientesRecurrentes, las versiones con metodos y las dos versiones de totalCiudad
- con 10.000 ventas las funciones lineales tardan menos de un milisegundo y una sola medicion tiene mucho ruido. por eso hago una corrida de calentamiento, repito 15 veces y me quedo con la menor
- para la proyeccion uso este metodo: 1.000.000 es 100 veces mas que 10.000, entonces una funcion O(n) hace 100 veces mas trabajo, una O(n²) hace 10.000 veces mas y una O(1) hace lo mismo
- para clientesRecurrentes uso la medicion real de 100.000 ventas del minireto 6 (106,9 segundos x 100 = 178 minutos), porque la formula con 16.000 ventas se quedo corta: estimo 48,7 segundos y tardo 106,9
- ordene los riesgos primero por como crece el tiempo, despues por memoria extra proporcional a los datos (el servidor del marketplace tiene memoria limitada) y al final por el tiempo proyectado
- el plan de optimizacion es solo la idea: guardar en un objeto cuantas veces aparece cada cliente y recorrer las ventas una sola vez. lo implemento en el minireto 9

### revision de un companero

le pedi a un companero que leyera RENDIMIENTO.md.

- companero: escribe aqui su nombre
- observacion 1: escribe aqui lo que te dijo
- mi respuesta: escribe aqui que hiciste con esa observacion (lo cambie, lo explique mejor, o no lo cambie y por que)

### resumen del dia

- minireto 5: contar operaciones. predije que las funciones con un ciclo crecerian 10 veces cuando n creciera 10 veces y primeraVenta se quedaria en 1, y acerte
- minireto 6: clientesRecurrentes es O(n²). al duplicar n el tiempo se multiplica por 4. con 100.000 ventas tardo casi dos minutos y con 1.000.000 tardaria unas tres horas
- minireto 7: la cadena de metodos y la de una pasada son las dos O(n) en tiempo, pero la cadena gasta memoria O(n) y la otra O(1). dejo la de una pasada
- minireto 8: el unico problema serio de tiempo es clientesRecurrentes. el unico problema de memoria son las funciones que crean arreglos del tamaño de los datos (ventasPorCiudadM, ventasDelDia y totalCiudadCadena)
- siguiente paso: el minireto 9, que convierte clientesRecurrentes de O(n²) a O(n)

---

## minireto 9: clientes recurrentes en tiempo lineal

el marketplace exige que cualquier reporte responda en menos de un segundo con 100.000 ventas, y el de clientes recurrentes tardaba casi dos minutos. en el plan del minireto 8 ya identifique el trabajo repetido, ahora lo elimino.

### metodo de resolucion

**1. entender el problema**

- entrada: un arreglo de ventas, y de cada venta me importa el cliente
- salida: un arreglo con los codigos de los clientes que aparecen en dos o mas ventas, cada uno una sola vez
- restricciones: 100.000 ventas en menos de un segundo, sin modificar el arreglo de ventas, y el orden de la salida no importa
- lo que cuento como recurrente: un cliente que aparece en dos registros de venta o mas. cuento registros, incluso uno con cantidad 0, igual que la version original, para que las tres versiones den lo mismo

**2. ejemplos y casos borde**

| entrada | salida esperada |
|---------|-----------------|
| los 12 datos del dia 1 | C01 (3 compras), C02 (2) y C03 (2) |
| arreglo vacio | [] |
| una sola venta | [] |
| todos los clientes distintos | [] |
| cinco ventas del mismo cliente C01 | [C01], una sola vez y no cinco |
| un cliente con 3 compras | aparece una sola vez |
| un cliente cuya segunda compra es la ultima venta | tiene que aparecer |

**3. fuerza bruta y su complejidad**

es la funcion original del companero:

```
# clientesRecurrentes
recurrentes = []
para cada posicion i de las ventas:
    para cada posicion j despues de i:
        si el cliente de i es igual al de j y no esta ya en recurrentes:
            lo agrego a recurrentes
devolver recurrentes
```

hace n x (n - 1) / 2 comparaciones, o sea O(n²), y includes en el peor caso agrega otro factor de n. con 100.000 ventas tardo 106,9 segundos. memoria extra: la lista de recurrentes, O(r).

**4. idea de optimizacion**

el trabajo repetido es que cada venta vuelve a buscar a su cliente entre todas las ventas que siguen, y que includes vuelve a recorrer la lista de recurrentes. lo unico que necesito saber de cada venta es una pregunta: ¿este cliente ya habia aparecido antes? esa pregunta se contesta al instante si guardo los clientes ya vistos en una estructura de busqueda directa, como un Set (has y add tardan casi lo mismo sin importar cuantos elementos tenga). asi alcanza con recorrer las ventas una sola vez.

```
# clientesRecurrentesSet
vistos = conjunto vacio
recurrentes = conjunto vacio
para cada venta en ventas:
    si vistos tiene al cliente de la venta:
        agrego el cliente a recurrentes
    si no:
        agrego el cliente a vistos
devolver recurrentes como arreglo
```

```
# comprasPorCliente y clientesRecurrentesMap
compras = mapa vacio (clave: cliente, valor: numero de compras)
para cada venta en ventas:
    si compras tiene al cliente:
        compras[cliente] = compras[cliente] + 1
    si no:
        compras[cliente] = 1
recurrentes = []
para cada pareja (cliente, cantidad) en compras:
    si cantidad es 2 o mas: agrego el cliente a recurrentes
devolver recurrentes
```

traza de la version con Set con las 5 ventas del minireto 6 (C01, C02, C03, C01, C04):

| venta | cliente | ya estaba en vistos | vistos queda en | recurrentes queda en |
|-------|---------|---------------------|-----------------|----------------------|
| 1 | C01 | no | C01 | vacio |
| 2 | C02 | no | C01, C02 | vacio |
| 3 | C03 | no | C01, C02, C03 | vacio |
| 4 | C01 | si | igual | C01 |
| 5 | C04 | no | C01, C02, C03, C04 | C01 |

da [C01], igual que la original, pero con 5 pasos en lugar de 10 comparaciones.

**5. implementacion**

agregue a analitica.js las funciones clientesRecurrentesSet, comprasPorCliente y clientesRecurrentesMap. comprasPorCliente devuelve el Map completo (cliente y numero de compras) y clientesRecurrentesMap saca de ahi los que tienen 2 o mas.

**6. pruebas**

la comparacion esta al final de `src/verificar.js` y los tiempos en `src/tiempos.js`.

- con los 12 datos del dia 1 las tres versiones dieron C01, C02 y C03
- con 5.000 ventas generadas las tres dieron la misma cantidad de clientes y la misma lista (OK en Set y en Map)
- arreglo vacio y una sola venta: las dos versiones nuevas devuelven []
- comparo los resultados ordenados porque el orden cambia: la original y la del Map devuelven los clientes en el orden en que aparecieron por primera vez, y la del Set en el orden de su segunda aparicion. son los mismos clientes con distinto orden, y asi `sort()` los deja iguales

### tiempos medidos

repeti cada medicion y me quedo con la menor, con una corrida de calentamiento antes. la original solo la medi con 1.000 y 10.000 ventas, porque con 100.000 tarda casi dos minutos (106,9 segundos en el minireto 6).

pega aqui las dos tablas que imprimio `node src/tiempos.js` en "para copiar a la bitacora": la de tiempos y la de tiempo por venta

analisis:

- la original: al multiplicar n por 10 el tiempo se multiplica por cerca de 100, que es lo que se espera de O(n²). el tiempo por venta se multiplica por 10 cada vez que n se multiplica por 10, o sea que cada venta cuesta mas cuanto mas grande es el conjunto
- el Set y el Map: el tiempo por venta se queda en el mismo orden aunque n pase de 1.000 a 100.000, nunca se multiplica por 10. eso es lo que se espera de O(n): cada venta cuesta mas o menos lo mismo sin importar cuantas haya. el tiempo total crece aproximadamente con n, nunca cerca de 100 veces como la original. a veces sube algo mas de lo esperado porque con muchos datos hay mas memoria en juego
- con 100.000 ventas el Set y el Map tardan unas pocas decenas de milisegundos, muy por debajo del segundo que pide el marketplace. el script lo confirma con console.time y los dos salen OK
- comparado con la original, con 100.000 ventas pasamos de 106,9 segundos a unas decenas de milisegundos

### complejidad de las versiones nuevas

| funcion | tiempo | espacio | por que |
|---------|--------|---------|---------|
| clientesRecurrentesSet | O(n) | O(k) | un solo recorrido; has y add tardan casi lo mismo sin importar el tamano. guarda cada cliente distinto en vistos |
| comprasPorCliente | O(n) | O(k) | un solo recorrido, una clave por cliente distinto |
| clientesRecurrentesMap | O(n) | O(k) | comprasPorCliente mas un recorrido por los clientes (k es menor o igual que n) |

k es la cantidad de clientes distintos.

### el intercambio entre tiempo y memoria

- se gana tiempo: se pasa de O(n²) a O(n). la pregunta "¿este cliente ya aparecio?" ya no se contesta recorriendo todo, sino con una consulta directa
- se paga con memoria: la original solo guardaba la lista de recurrentes, O(r). las nuevas guardan a todos los clientes distintos, O(k). en el peor caso, cuando todos los clientes son distintos, k = n y la memoria es O(n)
- en mis datos generados hay hasta n / 3 clientes distintos. con 1.000.000 de ventas serian unos 333.000 codigos guardados. es bastante mas que la original, pero son textos cortos y el servidor puede con eso, y a cambio el reporte pasa de horas a una fraccion de segundo
- el Set usa dos colecciones (vistos y recurrentes), el Map usa una sola pero guarda un numero por cliente. como el Map tambien sirve para saber cuantas compras hizo cada cliente, me quedo con clientesRecurrentesMap para el reporte final
- en resumen: gasto memoria a cambio de no repetir trabajo, y en este problema el cambio vale mucho la pena

## minireto 10: combos de regalo y frecuencias

### catalogo

el catalogo esta en `src/catalogo.js` como arreglo de objetos con producto y precio (8 productos, de 18.000 a 120.000).

### comboRegalo por fuerza bruta

```
# comboRegalo(catalogo, valor)
para cada producto i:
    para cada producto j que viene despues de i:
        si precio de i + precio de j es igual al valor:
            devolver los dos productos
devolver null
```

complejidad: con n productos prueba n x (n - 1) / 2 pares, o sea O(n²) en tiempo. memoria O(1), no guarda nada.

### version optimizada con Map

la idea: si el valor es 87.000 y el producto cuesta 42.000, le falta 45.000 (el complemento = valor - precio). en vez de buscar ese 45.000 recorriendo otra vez, guardo en un Map los precios que ya vi y le pregunto al Map si ya esta. preguntarle a un Map no recorre nada.

```
# comboRegaloMap(catalogo, valor)
vistos = mapa vacio (precio -> producto)
para cada producto del catalogo:
    complemento = valor - precio del producto
    si vistos tiene el complemento:
        devolver el producto guardado y el actual
    guardo el precio del producto en vistos
devolver null
```

recorre el catalogo una sola vez, O(n) en tiempo, y guarda hasta n precios, O(n) en memoria. guardo el precio despues de preguntar para que un producto no se pueda combinar consigo mismo.

### traza de la version optimizada para 87.000

| paso | producto | precio | complemento (87.000 - precio) | esta en el Map | Map queda en |
|------|----------|--------|-------------------------------|----------------|--------------|
| 1 | Origen Nariño 250 g | 26.000 | 61.000 | no | 26.000 |
| 2 | Origen Huila 500 g | 42.000 | 45.000 | no | 26.000, 42.000 |
| 3 | Origen Sierra 500 g | 45.000 | 42.000 | si, es Origen Huila 500 g | termina |

devuelve Origen Huila 500 g y Origen Sierra 500 g, en 3 pasos y sin mirar el resto del catalogo.

### pruebas (src/pruebas.js)

- 87.000: Origen Huila 500 g y Origen Sierra 500 g, las dos versiones
- 61.000: Origen Nariño 250 g y Taza de cerámica, las dos versiones
- 10.000: null, porque el par mas barato ya suma 44.000
- casos borde: catalogo vacio da null, un solo producto da null (con 52.000 el Map no usa el mismo producto dos veces)

### productoEstrellaPorCiudad

```
# productoEstrellaPorCiudad(ventas)
porCiudad = mapa vacio (ciudad -> otro mapa producto -> veces)
para cada venta valida:
    ciudad = nombre de la ciudad normalizado (igual que totalPorCiudad)
    sumo 1 a las veces de ese producto dentro de esa ciudad
para cada ciudad:
    me quedo con el producto que tiene mas veces
devolver un objeto: ciudad -> producto y veces
```

regla de desempate: si dos productos aparecen las mismas veces en una ciudad, gana el que aparecio primero en las ventas de esa ciudad. lo logro cambiando de producto solo cuando otro tiene mas veces, no cuando tiene las mismas.

con los datos del dia 1: Medellin Origen Huila 500 g (2), Bogota Origen Nariño 250 g (3), Pereira Origen Huila 500 g (1) y Cali Prensa francesa (1). en Cali hay un empate (cada producto aparece una vez) y gana Prensa francesa porque fue el primero. no cuento la venta del id 8 porque tiene cantidad 0.

### primerClienteUnico

```
# primerClienteUnico(ventas)
compras = comprasPorCliente(ventas)       # primer recorrido
para cada venta en orden:                 # segundo recorrido
    si compras de ese cliente es 1:
        devolver ese cliente
devolver null
```

con los datos del dia 1 devuelve C04: C01, C02 y C03 repiten, y C04 es el primero que aparece una sola vez (venta id 5). con el arreglo vacio, o si todos repiten, devuelve null.

### complejidad

| funcion | tiempo | espacio | por que |
|---------|--------|---------|---------|
| comboRegalo | O(n²) | O(1) | dos ciclos anidados, prueba todos los pares |
| comboRegaloMap | O(n) | O(n) | un recorrido, consultar y guardar en el Map no recorre nada |
| productoEstrellaPorCiudad | O(n) | O(c x p) | un recorrido para contar y despues se revisan los conteos de c ciudades por p productos |
| primerClienteUnico | O(n) | O(k) | dos recorridos (2n, que es O(n)) y un Map con un cliente por clave, k clientes distintos |

las tres funciones optimizadas son O(n). las operaciones de un Map (has, get, set) tardan casi lo mismo sin importar cuantos elementos tenga, por eso cada una de las n vueltas cuesta lo mismo.

## minireto 11: la mejor racha y el presupuesto exacto

### mejorSemanaBruta

```
# mejorSemanaBruta(dias, k)
si k es menor que 1 o mayor que los dias, devolver null
para cada posicion de inicio de una semana:
    suma = 0
    para cada uno de los k dias de esa semana: suma = suma + dia
    si suma es la mayor hasta ahora, la guardo con su dia de inicio
devolver el total y el dia de inicio
```

complejidad: hay n - k + 1 semanas y cada una suma k dias, o sea O(n x k). con k = 7 se nota poco, pero si k crece (por ejemplo 1.000) cada semana cuesta 1.000 sumas.

### mejorSemana con ventana deslizante

la idea: dos semanas seguidas comparten k - 1 dias. en vez de sumar todo otra vez, a la suma anterior le sumo el dia que entra y le resto el dia que sale.

```
# mejorSemana(dias, k)
si k es menor que 1 o mayor que los dias, devolver null
suma = suma de los primeros k dias
mejor = suma
para cada dia i desde k hasta el final:
    suma = suma + dia que entra (i) - dia que sale (i - k)
    si suma es mayor que mejor, la guardo con su dia de inicio
devolver el total y el dia de inicio
```

complejidad: la primera suma cuesta k y despues se recorre cada dia una sola vez con una suma y una resta, sea cual sea k. es O(n). memoria O(1).

### las tres primeras posiciones de la ventana (k = 7)

| ventana | dias | como se calcula | total (miles) |
|---------|------|-----------------|---------------|
| 1 | 1 al 7 | 320 + 410 + 280 + 390 + 510 + 620 + 700 | 3.230 |
| 2 | 2 al 8 | 3.230 - 320 (sale el dia 1) + 300 (entra el dia 8) | 3.210 |
| 3 | 3 al 9 | 3.210 - 410 (sale el dia 2) + 290 (entra el dia 9) | 3.090 |

### resultado con los datos de septiembre

las dos versiones dan lo mismo: la mejor semana de septiembre empieza el dia 24 (del 24 al 30) y suma 3.670 miles de pesos, o sea $ 3.670.000. es la ultima ventana del mes: los totales de las semanas van subiendo casi todo el mes. casos borde: con k = 1 da el mejor dia (720, el dia 28), con k = 30 da todo el mes (14.460) y con k = 31 (mayor que los dias) o sin dias devuelve null. en empate me quedo con la primera semana.

### comparacion con 100.000 dias al azar

con 100.000 dias generados las dos versiones dieron la misma semana, con k = 7 y con k = 1000. tiempos (copiados de la consola):

| k | fuerza bruta (ms) | ventana deslizante (ms) |
|---|-------------------|-------------------------|
| 7 | [tu numero] | [tu numero] |
| 1000 | [tu numero] | [tu numero] |

con k = 7 las dos son muy rapidas, porque cada semana solo suma 7 dias. con k = 1000 la fuerza bruta se vuelve muchisimo mas lenta (hace unas k veces mas trabajo) y la ventana casi no cambia, porque su costo no depende de k. por eso la ventana es O(n) y la bruta O(n x k).

### parMasCercano con dos punteros

la idea: ordeno los productos por precio, pongo un puntero en el mas barato (izquierda) y otro en el mas caro (derecha).

```
# parMasCercano(catalogo, presupuesto)
ordenados = copia del catalogo ordenada por precio
izquierda = 0, derecha = ultimo
mejor = null
mientras izquierda sea menor que derecha:
    suma = precio de izquierda + precio de derecha
    si la suma se pasa del presupuesto: bajo la derecha
    si no:
        si la suma es mayor que la mejor, la guardo
        subo la izquierda
devolver mejor
```

por que se mueve asi: si con el mas barato de la izquierda la suma ya se pasa, con cualquier otro de la izquierda (que cuesta mas) tambien se pasaria, asi que el de la derecha ya no sirve y lo descarto. si la suma cabe, el de la izquierda todavia puede combinarse con uno mas caro, y para buscar una suma mayor subo la izquierda.

### traza de los punteros con presupuesto 100.000

precios ordenados: Filtros 18.000, Nariño 26.000, Taza 35.000, Huila 500 g 42.000, Sierra 45.000, Huila 1 kg 79.000, Prensa 95.000, Molino 120.000.

| paso | izquierda | derecha | suma | que hago |
|------|-----------|---------|------|----------|
| 1 | Filtros 18.000 | Molino 120.000 | 138.000 | se pasa, bajo la derecha |
| 2 | Filtros 18.000 | Prensa 95.000 | 113.000 | se pasa, bajo la derecha |
| 3 | Filtros 18.000 | Huila 1 kg 79.000 | 97.000 | cabe, es la mejor hasta ahora, la guardo y subo la izquierda |
| 4 | Nariño 26.000 | Huila 1 kg 79.000 | 105.000 | se pasa, bajo la derecha |
| 5 | Nariño 26.000 | Sierra 45.000 | 71.000 | cabe pero no mejora 97.000, subo la izquierda |
| 6 | Taza 35.000 | Sierra 45.000 | 80.000 | cabe, no mejora, subo la izquierda |
| 7 | Huila 500 g 42.000 | Sierra 45.000 | 87.000 | cabe, no mejora, subo la izquierda |
| 8 | Sierra 45.000 | Sierra 45.000 | | los punteros se juntan, termino |

resultado: Filtros de papel x100 y Origen Huila 1 kg, que suman 97.000.

### pruebas

- 100.000: Filtros de papel x100 y Origen Huila 1 kg (97.000)
- 140.000: Origen Sierra 500 g y Prensa francesa (140.000 exactos)
- 40.000: null, porque el par mas barato (18.000 y 26.000) ya suma 44.000
- catalogo vacio y un solo producto: null
- la suma nunca supera el presupuesto y el catalogo no cambia de orden, porque ordeno una copia

### complejidad

| funcion | tiempo | espacio | por que |
|---------|--------|---------|---------|
| mejorSemanaBruta | O(n x k) | O(1) | vuelve a sumar los k dias de cada semana |
| mejorSemana | O(n) | O(1) | una suma inicial y una suma y una resta por cada dia |
| parMasCercano | O(n log n) | O(n) | ordenar cuesta n log n y los punteros recorren una sola vez (O(n)). la copia ordenada ocupa n. sin el ordenamiento seria O(n) |

el ordenamiento domina: n log n es mayor que n, asi que parMasCercano es O(n log n). si los precios ya llegaran ordenados, los dos punteros solos serian O(n).