# Patrones creacionales

Pensá en esta familia cuando construir un objeto válido requiere decisiones, etapas,
compatibilidad entre componentes o control explícito de identidad. Si `new` sigue
siendo claro y seguro, mantenelo: una fábrica innecesaria solo oculta el constructor.

## Mapa rápido

| Patrón           | Señal dominante                                         | Dominio     | Costo y alternativa simple                                                                        |
| ---------------- | ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Factory Method   | El formato decide qué implementación crear              | Ingesta     | Agrega indirección; usá una función o constructor si la selección es estable                      |
| Abstract Factory | Varias dependencias deben pertenecer a la misma familia | Checkout    | Agregar productos afecta todas las familias; ensamblá explícitamente si no hay incompatibilidades |
| Builder          | La construcción tiene etapas, opciones e invariantes    | Pipeline    | Duplica parte del modelo; preferí un objeto literal validado para configuraciones pequeñas        |
| Prototype        | Crear desde cero es caro y existe una plantilla válida  | Videojuegos | Copias profundas y compartidas son difíciles; construí desde datos si crear es barato             |
| Singleton        | Debe existir una identidad única y controlada           | Recursos    | Oculta dependencias; preferí crear e inyectar la instancia desde el composition root              |

## Factory Method

**Problema.** Un sistema sabe cuándo necesita un conector, pero el formato o proveedor
determina cuál clase concreta debe construir.

**Detectalo cuando:** aparecen `switch` repetidos sobre el tipo de fuente; cada nueva
fuente modifica el orquestador; la creación necesita validación propia.

**Caso real.** Una plataforma de datos selecciona lectores CSV, JSON Lines o eventos
Kafka a partir de una especificación. En Java es común mediante subclases; en Go y
TypeScript suele bastar una función fábrica tipada.

**No lo uses cuando:** solo existen dos constructores estables y una función explícita
es más clara. El patrón no exige herencia.

## Abstract Factory

**Problema.** Los objetos creados por separado pueden ser válidos individualmente pero
incompatibles como conjunto.

**Detectalo cuando:** aparecen pares prohibidos; una región o tenant selecciona toda una
familia; los tests repiten ensamblajes compatibles.

**Caso real.** Un checkout para Argentina necesita calculador impositivo, proveedor de
factura y medio de pago compatibles con esa jurisdicción. Crear cada dependencia con
un `switch` independiente permite combinaciones ilegales.

**Costo.** Agregar una familia es fácil; agregar un nuevo tipo de producto obliga a
actualizar todas las familias. Es una decisión importante en Java y C#; TypeScript puede
expresar la compatibilidad con interfaces y tipos discriminados.

## Builder: profundidad

**Problema.** Un objeto posee muchas opciones, pero no todas las secuencias producen un
estado válido. Un constructor largo no comunica etapas ni dependencias entre campos.

**Detectalo cuando:** hay parámetros booleanos, configuración parcial, validaciones
dispersas o necesidad de construir variantes legibles en tests.

**Caso real.** Un pipeline requiere fuente y destino; permite filtros y transformación;
el procesamiento incremental exige checkpoint storage. `build()` es el límite donde se
rechaza una configuración incompleta.

```ts
const pipeline = PipelineBuilder.from(source)
  .map(normalizeCustomer)
  .filter(isActive)
  .withCheckpoint(checkpointStore)
  .to(destination)
  .build();
```

**TypeScript experto.** Un builder puede usar tipos de estado genéricos para impedir
`build()` antes de configurar campos obligatorios. Usalo cuando el error merece
prevención en compilación; si el modelo dinámico proviene de JSON, igualmente necesitás
validación en runtime.

**No lo uses cuando:** el objeto tiene tres campos independientes o un objeto literal
con `satisfies` comunica mejor la intención.

## Prototype

**Problema.** La creación completa es costosa o compleja, pero existe una instancia base
segura para derivar variantes.

**Caso real.** Un juego clona la plantilla de un enemigo y reemplaza posición y salud.
Los datos inmutables de animación pueden compartirse; el inventario mutable debe
copiarse. Ese límite es el verdadero aprendizaje: una copia superficial puede compartir
estado accidentalmente.

**Otros usos.** Plantillas de documentos, configuraciones de simulación y escenarios de
prueba. JavaScript ofrece spread y `structuredClone`, pero copiar datos no equivale a
preservar invariantes de dominio.

## Singleton: profundidad

**Problema legítimo.** Un recurso posee una única identidad por proceso y crear una
segunda instancia rompería una garantía: coordinador de migraciones, lock registry o
acceso a un dispositivo exclusivo.

**No es justificación:** “quiero acceder desde cualquier parte”. Eso describe estado
global, no unicidad de negocio.

**Riesgos:** dependencias ocultas, orden de inicialización, tests acoplados, estado que
sobrevive entre casos y dificultad para ejecutar workers aislados.

En TypeScript preferí crear la instancia en el composition root e inyectarla. Un módulo
ES ya se evalúa una vez por loader, pero esa mecánica cambia con workers, procesos y
bundlers. Si la unicidad debe cruzar procesos, un Singleton no sirve: necesitás una
coordinación externa como base de datos, lease o lock distribuido.

## Ejercicio de diagnóstico

Diseñá la configuración de un exportador de datos con origen obligatorio, formatos
opcionales y credenciales por destino. Primero resolvelo con un objeto literal. Introducí
Builder únicamente cuando puedas señalar una combinación inválida que el diseño simple
no previene con claridad.
