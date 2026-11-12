# Creational Patterns

Consider this family when building a valid object requires decisions, stages,
compatibility between components, or explicit identity control. If `new` remains clear
and safe, keep it: an unnecessary factory only hides the constructor.

## Quick map

| Pattern          | Dominant signal                                                | Domain    | Cost and simple alternative                                                                   |
| ---------------- | -------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| Factory Method   | The format determines which implementation to create           | Ingestion | Adds indirection; use a function or constructor when selection is stable                      |
| Abstract Factory | Several dependencies must belong to the same family            | Checkout  | Adding products affects every family; assemble explicitly when there are no incompatibilities |
| Builder          | Construction has stages, options, and invariants               | Pipeline  | Duplicates part of the model; prefer a validated object literal for small configurations      |
| Prototype        | Creating from scratch is expensive and a valid template exists | Games     | Deep and shared copies are difficult; build from data when creation is cheap                  |
| Singleton        | One controlled identity must exist                             | Resources | Hides dependencies; create and inject the instance from the composition root                  |

## Factory Method

**Problem.** A system knows when it needs a connector, but the format or provider
determines which concrete class to build.

**Recognize it when:** repeated `switch` statements select source types; every new source
modifies the orchestrator; creation requires its own validation.

**Real case.** A data platform selects CSV, JSON Lines, or Kafka event readers from a
specification. Java commonly uses subclasses; Go and TypeScript often only need a typed
factory function.

**Do not use it when:** only two stable constructors exist and an explicit function is
clearer. The pattern does not require inheritance.

## Abstract Factory

**Problem.** Objects created separately may be valid individually but incompatible as a
set.

**Recognize it when:** forbidden pairs appear; a region or tenant selects an entire
family; tests repeat compatible assemblies.

**Real case.** An Argentina checkout needs a tax calculator, invoice provider, and
payment method compatible with that jurisdiction. Creating each dependency with an
independent `switch` permits illegal combinations.

**Cost.** Adding a family is easy; adding a new product type requires updating every
family. This is an important decision in Java and C#; TypeScript can express compatibility
with interfaces and discriminated types.

## Builder: deeper dive

**Problem.** An object has many options, but not every sequence produces valid state. A
long constructor does not communicate stages or dependencies between fields.

**Recognize it when:** there are boolean parameters, partial configuration, scattered
validation, or a need to build readable variants in tests.

**Real case.** A pipeline requires a source and destination, allows filters and
transformation, and needs checkpoint storage for incremental processing. `build()` is the
boundary that rejects incomplete configuration.

```ts
const pipeline = PipelineBuilder.from(source)
  .map(normalizeCustomer)
  .filter(isActive)
  .withCheckpoint(checkpointStore)
  .to(destination)
  .build();
```

**Advanced TypeScript.** A builder can use generic state types to prevent calling `build()`
before required fields are configured. Use this when compile-time prevention is worth the
complexity; if the model comes dynamically from JSON, you still need runtime validation.

**Do not use it when:** the object has three independent fields or an object literal with
`satisfies` communicates intent better.

## Prototype

**Problem.** Complete creation is expensive or complex, but a safe base instance exists
from which variants can be derived.

**Real case.** A game clones an enemy template and replaces its position and health.
Immutable animation data can be shared; mutable inventory must be copied. That boundary is
the real lesson: a shallow copy can accidentally share state.

**Other uses.** Document templates, simulation configurations, and test scenarios.
JavaScript provides spread and `structuredClone`, but copying data is not the same as
preserving domain invariants.

## Singleton: deeper dive

**Legitimate problem.** A resource has one identity per process, and creating a second
instance would break a guarantee: a migration coordinator, lock registry, or exclusive
device access.

**Not a justification:** “I want to access it from anywhere.” That describes global state,
not business uniqueness.

**Risks:** hidden dependencies, initialization order, coupled tests, state that survives
between cases, and difficulty running isolated workers.

In TypeScript, prefer creating the instance in the composition root and injecting it. An
ES module is evaluated once per loader, but that behavior changes with workers, processes,
and bundlers. If uniqueness must cross processes, a Singleton is insufficient: you need
external coordination such as a database, lease, or distributed lock.

## Diagnostic exercise

Design the configuration of a data exporter with a required source, optional formats, and
destination-specific credentials. First solve it with an object literal. Introduce Builder
only when you can identify an invalid combination that the simple design does not prevent
clearly.
