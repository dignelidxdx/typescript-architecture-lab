# Patrones estructurales

Esta familia aparece cuando las piezas ya existen, pero su forma de colaborar genera
acoplamiento, incompatibilidad, duplicación o costos operativos.

## Mapa rápido

| Patrón    | Pregunta de diagnóstico                             | Dominio     | Costo y alternativa simple                                                                            |
| --------- | --------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| Adapter   | ¿La capacidad sirve, pero su interfaz no coincide?  | Datos       | Mantiene otra traducción; usá el SDK directamente con un consumidor estable                           |
| Bridge    | ¿Dos dimensiones cambian independientemente?        | Alertas     | Multiplica colaboraciones; Strategy basta cuando solo varía un eje                                    |
| Composite | ¿Necesito tratar hojas y grupos igual?              | Videojuegos | El contrato común puede ocultar operaciones inválidas; recorré una estructura simple sin polimorfismo |
| Decorator | ¿Necesito combinar capacidades por instancia?       | Precios     | El orden cambia resultados; componé funciones si no necesitás identidad                               |
| Facade    | ¿El cliente conoce demasiados pasos internos?       | Checkout    | Puede convertirse en God Object; una función de caso de uso basta para una orquestación pequeña       |
| Flyweight | ¿Miles de objetos repiten datos inmutables?         | Videojuegos | Compartir identidad complica mutaciones; no lo uses sin medir memoria                                 |
| Proxy     | ¿Necesito controlar acceso sin cambiar el contrato? | Pagos       | Puede ocultar latencia y fallos; hacé explícito el servicio remoto si domina el contrato              |

## Adapter: profundidad

**Problema.** Un componente externo ofrece la capacidad correcta con nombres, tipos o
semántica incompatibles con el dominio.

**Detectalo cuando:** el modelo de un proveedor invade casos de uso; cada consumidor
normaliza fechas o errores; cambiar de SDK obliga a editar el núcleo.

**Caso real.** Tres proveedores entregan clientes como CSV, JSON y objetos de SDK. Cada
adapter traduce al `CustomerRecord` canónico y convierte errores técnicos a fallos del
dominio. La traducción pertenece al borde, no al modelo central.

**TypeScript experto.** Usá `unknown` para la entrada externa y validá antes de adaptar.
Un `as CustomerRecord` no adapta: silencia al compilador. Librerías como Zod son útiles
si la validación de datos es parte central del ejercicio; no son necesarias para enseñar
la colaboración básica.

## Bridge

**Problema.** Dos ejes cambian de forma independiente y combinarlos mediante herencia
produce una clase por cada combinación.

**Caso real.** Alertas con severidad y formato propios deben enviarse por email, Slack o
PagerDuty. Separar `AlertMessage` de `DeliveryChannel` evita clases como
`CriticalSlackAlert` y `WarningEmailAlert`.

**No lo uses cuando:** una dimensión es fija o Strategy simple cubre la única variación.

## Composite

**Problema.** Hojas y grupos deben responder a la misma operación recursiva.

**Caso real.** Un motor de videojuegos actualiza y renderiza entidades individuales y
grupos de escena mediante el mismo contrato. También aparece en catálogos, permisos y
estructuras organizacionales.

**Costo.** El contrato común puede volverse demasiado genérico. No todas las operaciones
tienen sentido para hojas y contenedores.

## Decorator

**Problema.** Las capacidades se combinan dinámicamente y la herencia produciría una
subclase por combinación.

**Caso real.** El precio base de un carrito recibe descuento de membresía, impuesto y
promoción temporal. Cada decorador conserva el contrato de cálculo y envuelve al
anterior.

**Diferencia clave.** Decorator agrega comportamiento; Adapter cambia la interfaz; Proxy
controla el acceso. En TypeScript, funciones de orden superior suelen ser una versión
más simple del mismo principio.

## Facade

**Problema.** Un caso de uso obliga al cliente a conocer orden, dependencias y detalles
de varios subsistemas.

**Caso real.** `CheckoutFacade.placeOrder()` coordina inventario, impuestos, pago y
facturación. No contiene todas las reglas: ofrece un límite estable y explícito.

**Riesgo.** Una facade que absorbe toda la lógica se convierte en God Object. Debe
orquestar capacidades, no reemplazar sus modelos.

## Flyweight

**Problema.** Una enorme cantidad de objetos repite datos inmutables y consume memoria.

**Caso real.** Miles de entidades comparten textura, geometría y animación; cada instancia
conserva solo posición, velocidad y salud. Medí antes de aplicarlo: compartir estado hace
la mutabilidad mucho más peligrosa.

En análisis de datos aparece mediante diccionarios, interning y representaciones
categóricas. En Go puede reducir asignaciones; en JavaScript el garbage collector y los
objetos ocultos requieren profiling, no intuición.

## Proxy

**Problema.** El acceso a un objeto necesita autorización, carga diferida, caché,
telemetría o comunicación remota sin modificar el contrato del consumidor.

**Caso real.** Un `PaymentGatewayProxy` verifica permisos e idempotencia antes de delegar
al gateway real. Un ORM puede devolver proxies lazy; un service mesh funciona como proxy
de red, pero no es automáticamente el patrón orientado a objetos dentro del código.

**Riesgo.** Ocultar latencia o fallos de red detrás de una interfaz aparentemente local
engaña al consumidor. El contrato debe expresar asincronía y errores.

## Ejercicio de diagnóstico

Un sistema consume dos APIs meteorológicas, agrega caché y expone un resumen sencillo.
Separá qué parte es Adapter, cuál podría ser Proxy y cuál constituye Facade. Explicá por
qué una sola clase que haga las tres cosas dificulta probar y reemplazar responsabilidades.
