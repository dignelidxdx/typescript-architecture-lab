# Patrones de comportamiento

Estos patrones distribuyen decisiones, mensajes, algoritmos y transiciones. Consideralos
cuando los condicionales ya representan políticas independientes o cuando varios objetos
necesitan coordinarse sin conocerse en detalle.

## Mapa rápido

| Patrón                  | Señal dominante                                     | Dominio      | Costo y alternativa simple                                                                  |
| ----------------------- | --------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| Chain of Responsibility | Varios handlers pueden resolver o escalar           | SRE          | El flujo cuesta rastrearlo; usá condicionales para una secuencia corta                      |
| Command                 | Una acción necesita identidad, cola o reversión     | SRE          | Agrega objetos y ciclo de vida; llamá una función para acciones inmediatas                  |
| Iterator                | El recorrido debe ocultar almacenamiento            | Datos        | Puede esconder I/O; devolvé un array para conjuntos pequeños                                |
| Mediator                | Muchos componentes se conocen entre sí              | Operaciones  | Puede concentrar decisiones; conectá directamente a pocos colaboradores                     |
| Memento                 | Se necesita restaurar estado sin exponer internals  | Videojuegos  | Copiar y versionar snapshots cuesta memoria; usá valores inmutables pequeños cuando alcance |
| Observer                | Varios consumidores reaccionan a un evento          | SRE          | Orden y errores son implícitos; llamá directamente a colaboradores obligatorios             |
| State                   | La conducta depende de una fase válida              | SRE          | Agrega tipos por fase; una unión discriminada basta con poca conducta                       |
| Strategy                | Una política intercambiable decide cómo actuar      | SRE          | Fragmenta reglas simples; mantené un `switch` exhaustivo para variantes cerradas            |
| Template Method         | El algoritmo conserva etapas                        | ETL          | Acopla por herencia; componé funciones si el orden no necesita protección                   |
| Visitor                 | Se agregan operaciones sobre una estructura estable | Compiladores | Agregar nodos afecta todos los visitors; usá una unión discriminada en estructuras pequeñas |

## Chain of Responsibility

**Problema.** Una solicitud puede ser atendida, enriquecida o escalada por varios
handlers ordenados.

**Caso real.** Un incidente pasa por runbook automático, equipo de servicio y guardia de
plataforma hasta encontrar capacidad y autoridad suficientes.

**Riesgo.** Una cadena opaca dificulta saber quién manejó el caso. Devolvé un resultado
tipado y registrá la ruta. Middleware HTTP es una variante frecuente en TypeScript, Go y
Java.

## Command

**Problema.** Una acción necesita convertirse en un valor: encolarse, auditarse,
reintentarse o revertirse.

**Caso real.** `RestartService` conserva parámetros, ejecuta la remediación y registra lo
necesario para compensarla. En videojuegos, comandos representan input y habilitan replay.

**No lo uses cuando:** una llamada directa es suficiente y no existe necesidad de ciclo
de vida alrededor de la acción.

## Iterator

**Problema.** El consumidor necesita recorrer elementos sin conocer almacenamiento,
paginación o carga diferida.

**TypeScript experto.** Implementá `Iterable<T>` para datos síncronos y
`AsyncIterable<T>` para páginas o streams. Un async generator comunica backpressure mejor
que devolver todo en un array.

**Caso real.** Un pipeline consume páginas de registros sin cargar millones de filas en
memoria. Python usa iteradores extensamente; Go suele expresar el recorrido con canales o
funciones iteradoras.

## Mediator

**Problema.** Muchos componentes se llaman mutuamente y cada cambio altera varios pares.

**Caso real.** Una sala de operaciones coordina timeline, chat, asignaciones y alertas a
través de un mediador. Los participantes publican intenciones sin conocer a todos los
receptores.

**Riesgo.** El mediador puede convertirse en un controlador gigante. Si solo hay dos
colaboradores, una dependencia directa suele ser más honesta.

## Memento

**Problema.** Se debe capturar y restaurar estado sin permitir que el exterior manipule
la representación interna.

**Caso real.** Un juego guarda un snapshot versionado de la partida. Un editor implementa
undo mediante snapshots pequeños o eventos inversos.

**Costo.** Copiar estados grandes consume memoria; persistir mementos introduce versionado
y migraciones. Event sourcing no es simplemente Memento: conserva eventos del dominio,
no copias opacas.

## Observer

**Problema.** Varios consumidores reaccionan a un cambio y el emisor no debería conocer
sus implementaciones.

**Caso real.** Cuando cambia un incidente, métricas, timeline y notificaciones reaccionan
de manera independiente.

**Riesgos.** Orden implícito, fugas por suscripciones y fallos parciales. Dentro de un
proceso, callbacks tipados pueden bastar; entre servicios necesitás semánticas explícitas
de entrega, idempotencia y reintentos.

## State

**Problema.** El comportamiento cambia según la fase y grandes condicionales permiten
transiciones inválidas.

**Caso real.** Un incidente puede estar `detected`, `acknowledged`, `mitigating` o
`resolved`; resolver antes de reconocerlo puede violar la política operativa.

Usá una unión discriminada cuando los estados solo contienen datos y un conjunto pequeño
de funciones. Usá objetos State cuando cada fase acumula comportamiento propio y crece
independientemente.

## Strategy: profundidad

**Problema.** Una decisión posee algoritmos alternativos con el mismo propósito y debe
cambiar sin modificar al consumidor.

**Detectalo cuando:** un `switch` elige políticas; aparecen flags que alteran el algoritmo;
los clientes requieren reglas diferentes; querés probar políticas de forma aislada.

**Caso real.** La prioridad de incidentes puede calcularse por impacto, objetivos SLO o
regulación. El coordinador recibe una función o interfaz `PrioritizationStrategy`.

```ts
type PrioritizationStrategy = (incident: Incident) => Priority;

const coordinator = new IncidentCoordinator({
  prioritize: prioritizeBySloBurnRate,
});
```

TypeScript permite Strategy con funciones, objetos callable o clases. Elegí una clase
solo si la política necesita estado y ciclo de vida. En Python es natural usar callables;
en Go, interfaces pequeñas o funciones.

**No lo uses cuando:** las variantes son casos de dominio cerrados y una unión
discriminada con `switch` exhaustivo resulta más transparente.

## Template Method

**Problema.** Un algoritmo mantiene un orden invariable, pero algunas etapas cambian.

**Caso real.** Todo proceso ETL valida, extrae, transforma, persiste y emite métricas; las
fuentes personalizan pasos limitados.

**Trade-off.** Se basa tradicionalmente en herencia. En TypeScript, componer funciones
en un pipeline suele dar menor acoplamiento. Usalo cuando el esqueleto debe imponer el
orden y los hooks están deliberadamente restringidos.

## Visitor

**Problema.** La estructura de objetos es estable, pero se agregan muchas operaciones que
no pertenecen naturalmente a sus nodos.

**Caso real.** Un AST recibe validadores, generadores de código y analizadores. Un modelo
contable estable recibe exportadores y auditores.

**Costo.** Agregar una operación es fácil; agregar un nuevo tipo de nodo obliga a cambiar
todos los visitors. Las uniones discriminadas y pattern matching exhaustivo suelen ser
más idiomáticos en TypeScript para estructuras pequeñas.

## Ejercicio de diagnóstico

Diseñá una plataforma de incidentes que priorice por SLO, notifique a varios canales y
permita transiciones controladas. Justificá por separado Strategy, Observer y State. Si
una misma clase implementa los tres, identificá qué motivos de cambio quedaron mezclados.
