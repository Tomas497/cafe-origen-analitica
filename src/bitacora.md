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
