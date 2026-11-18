# Bitácora: Café Origen Analítica

## MiniReto 1: Modelado y exploración

### Diccionario de datos

| Propiedad | Tipo | Significado |
|-----------|------|-------------|
| `id` | number | Identificador único de la venta (1 a 12). |
| `fecha` | string | Fecha de la venta en formato `AAAA-MM-DD`. Se guarda como texto. |
| `cliente` | string | Código del cliente (`C01`…`C08`). Un mismo cliente puede aparecer en varias ventas. |
| `producto` | string | Nombre del producto vendido (café por origen y presentación, o accesorio). |
| `ciudad` | string | Ciudad a la que se vendió o despachó el pedido. |
| `cantidad` | number | Unidades vendidas en esa venta. |
| `precio` | number | Precio **unitario** en pesos colombianos (COP). El valor de la venta es `cantidad * precio`. |

### Casos borde detectados

1. **Ciudad con distinta capitalización (id 5: `"medellín"`)**
   Es la misma ciudad que `"Medellín"`, pero para JavaScript son textos distintos y partiría la agrupación por ciudad.
   *Decisión:* normalizar la ciudad (primera letra en mayúscula, resto en minúscula) antes de agrupar, sin modificar el dato original en `datos.js`.

2. **Cantidad igual a cero (id 8: `cantidad: 0`)**
   Una venta de cero unidades no genera ingreso y podría ser un pedido cancelado o un error de digitación. Si se cuenta como venta, infla el número de transacciones.
   *Decisión:* excluir los registros con `cantidad <= 0` de los totales, rankings e ingresos, y dejar la exclusión documentada.

3. **Clientes repetidos (C01 aparece 3 veces; C02 y C03, 2 veces)**
   No es un error, pero "número de registros" no es lo mismo que "número de clientes". Contar registros como clientes daría un resultado equivocado.
   *Decisión:* para contar clientes distintos, usar un conjunto de códigos únicos.

4. **`precio` es unitario, no total**
   Sumar `precio` directamente daría ingresos incorrectos.
   *Decisión:* calcular siempre el ingreso como `cantidad * precio`.

5. **Empate/ambigüedad en "producto más vendido"**
   Puede medirse por unidades o por ingresos, y los resultados pueden diferir (p. ej. el Molino manual vende 1 unidad pero deja 120 000).
   *Decisión:* el ranking se calculará por unidades vendidas, y se reportará también por ingresos si se necesita.

### Pruebas realizadas
- `node src/explorar.js` muestra 12 registros, el primero (id 1), el último (id 12), el producto en la posición 4 (`Origen Sierra 500 g`) y la tabla completa.

## MiniReto 2: Indicadores básicos con ciclos

### Plan en pseudocódigo

**valorVenta(venta)**
```
devolver venta.cantidad * venta.precio
```

**totalVendido(ventas)**: patrón acumulador
```
total <- 0
PARA CADA venta EN ventas:
    total <- total + valorVenta(venta)
devolver total
```
Recorro todas las ventas. No necesito condición porque la venta con cantidad 0 suma 0. Inicio en 0 (neutro de la suma).

**unidadesVendidas(ventas)**: patrón acumulador
```
unidades <- 0
PARA CADA venta EN ventas:
    unidades <- unidades + venta.cantidad
devolver unidades
```

**ventaMayor(ventas)**: patrón máximo
```
mayor <- null
PARA CADA venta EN ventas:
    SI venta no es válida (cantidad <= 0): pasar a la siguiente
    SI mayor es null O valorVenta(venta) > valorVenta(mayor):
        mayor <- venta
devolver mayor
```
Inicio en `null` (y no en 0) para no inventar un registro con arreglo vacío. Devuelve el registro completo.

**ticketPromedio(ventas)**: acumulador + contador
```
total <- 0
validas <- 0
PARA CADA venta EN ventas:
    SI venta.cantidad > 0:
        total <- total + valorVenta(venta)
        validas <- validas + 1
SI validas = 0: devolver 0
devolver total / validas
```

**ventasPorCiudad(ventas, ciudad)**: acumulador con condición
```
buscada <- minúsculas(sin espacios sobrantes(ciudad))
total <- 0
PARA CADA venta EN ventas:
    SI minúsculas(sin espacios sobrantes(venta.ciudad)) = buscada:
        total <- total + valorVenta(venta)
devolver total
```

### Decisiones: ¿qué devuelve cada función con el arreglo vacío?

| Función | Resultado con `[]` | Justificación |
|---------|--------------------|---------------|
| `totalVendido` | `0` | Valor inicial del acumulador; "no se vendió nada" es 0. |
| `unidadesVendidas` | `0` | Igual que el anterior. |
| `ventaMayor` | `null` | No existe un registro que devolver; `null` indica "no hay venta mayor" sin inventar datos. |
| `ticketPromedio` | `0` | Dividir entre 0 daría `NaN`. Se controla con una guarda y se devuelve 0. |
| `ventasPorCiudad` | `0` | Sin ventas en la ciudad, el total es 0. |

Otras decisiones:
- `ventaMayor` y `ticketPromedio` ignoran ventas con `cantidad <= 0` (caso borde del id 8). Si solo hay ventas inválidas, se comportan como con el arreglo vacío.
- En un empate en `ventaMayor` gana la primera venta encontrada (se usa `>` estricto).
- `ventasPorCiudad` ignora mayúsculas y espacios, pero **no** tildes: `"Medellin"` no coincide con `"Medellín"`. El enunciado solo pide mayúsculas y espacios.

### Trazas manuales

**Traza 1: `totalVendido(ventas)`**

| Iteración | id | cantidad × precio | total después |
|-----------|----|-------------------|---------------|
| inicio | | | 0 |
| 1 | 1 | 2 × 42 000 = 84 000 | 84 000 |
| 2 | 2 | 1 × 26 000 = 26 000 | 110 000 |
| 3 | 3 | 1 × 95 000 = 95 000 | 205 000 |
| 4 | 4 | 1 × 42 000 = 42 000 | 247 000 |
| 5 | 5 | 3 × 45 000 = 135 000 | 382 000 |
| 6 | 6 | 2 × 26 000 = 52 000 | 434 000 |
| 7 | 7 | 1 × 120 000 = 120 000 | 554 000 |
| 8 | 8 | 0 × 42 000 = 0 | 554 000 |
| 9 | 9 | 2 × 45 000 = 90 000 | 644 000 |
| 10 | 10 | 4 × 42 000 = 168 000 | 812 000 |
| 11 | 11 | 1 × 95 000 = 95 000 | 907 000 |
| 12 | 12 | 3 × 26 000 = 78 000 | **985 000** |

Resultado a mano: 985 000. Resultado del programa: 985 000 ✅

**Traza 2: `ventaMayor(ventas)`**

| Iteración | id | valor | ¿Válida? | ¿Supera al mayor? | `mayor` después |
|-----------|----|-------|----------|-------------------|-----------------|
| inicio | | | | | null |
| 1 | 1 | 84 000 | sí | sí (era null) | id 1 |
| 2 | 2 | 26 000 | sí | no | id 1 |
| 3 | 3 | 95 000 | sí | sí | id 3 |
| 4 | 4 | 42 000 | sí | no | id 3 |
| 5 | 5 | 135 000 | sí | sí | id 5 |
| 6 | 6 | 52 000 | sí | no | id 5 |
| 7 | 7 | 120 000 | sí | no | id 5 |
| 8 | 8 | 0 | **no** (se salta) | n/a | id 5 |
| 9 | 9 | 90 000 | sí | no | id 5 |
| 10 | 10 | 168 000 | sí | sí | **id 10** |
| 11 | 11 | 95 000 | sí | no | id 10 |
| 12 | 12 | 78 000 | sí | no | id 10 |

Resultado a mano: venta id 10 (Origen Huila 500 g, Pereira, 168 000). Programa: id 10 

**Traza 3: `ticketPromedio(ventas)` y `ventasPorCiudad(ventas, "Medellín")`**

- Ticket: ventas válidas = 11 (todas menos el id 8); total = 985 000; 985 000 / 11 ≈ 89 545,45. Programa: 89545.4545… 
- Medellín: coinciden los ids 1 (84 000), 4 (42 000), 5 (`"medellín"`, 135 000) y 11 (95 000). Suma = 356 000. Programa: 356000 

### Pruebas ejecutadas
`node src/pruebas.js` con tres entradas por función (arreglo completo, un elemento, arreglo vacío) más un caso extra con solo ventas inválidas. Todas las verificaciones pasan.