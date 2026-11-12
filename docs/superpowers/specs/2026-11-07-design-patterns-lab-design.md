# TypeScript Design Patterns Lab Design

## Intent

Build a practical laboratory for learning TypeScript and design-pattern recognition together. Patterns must emerge from concrete business pressures; the repository must not become a catalog of context-free class diagrams.

## Goals

- Teach when a design problem warrants considering a pattern.
- Demonstrate advanced, readable TypeScript through executable domain scenarios.
- Cover the full Refactoring.Guru catalog in three guides while implementing a smaller, justified subset.
- Connect patterns to SRE, data processing, commerce, and game-development problems.
- Make trade-offs, failure modes, and simpler alternatives explicit.

## Non-goals

- Reproduce or translate Refactoring.Guru content.
- Implement every pattern merely for catalog completeness.
- Introduce a web framework or production infrastructure.
- Present patterns as mandatory or universally beneficial.

## Anti-goals

- Toy examples such as generic shapes, animals, or furniture factories without a business reason.
- Singleton as disguised mutable global state.
- Pattern names driving the design before the problem is understood.
- Libraries that hide the TypeScript and architectural concepts being taught.

## Constraints

- TypeScript runs in strict mode.
- Vitest exercises behavior through public interfaces.
- Domain terminology and code artifacts use professional English.
- Each implemented pattern must state the pressure that justifies its added indirection.

## Chosen approach

Use domain-separated laboratories. Each domain owns a coherent scenario, production code, tests, and a README that links the scenario to the family guides. The three guides form the conceptual catalog; runnable examples are selective and cross-linked rather than mechanically exhaustive.

## Alternatives considered

1. **One isolated example per pattern:** easy to browse but encourages memorizing shapes without learning diagnosis.
2. **One large application containing every pattern:** superficially realistic but entangles concepts and forces unjustified abstractions.
3. **Domain-separated laboratories:** selected because each pattern can answer a visible business pressure while remaining independently understandable.

## Domain map

- Incident response/SRE: Strategy, Chain of Responsibility, Command, Observer, and State.
- Data pipelines: Builder, Factory Method, Adapter, Iterator, and Template Method.
- Commerce: Abstract Factory, Decorator, Facade, and Proxy.
- Game engine: Prototype, Composite, Flyweight, Memento, and State.
- Singleton is analyzed across domains as a lifecycle and ownership decision, not automatically implemented as a mutable global.

## What remains to the builder

Choose the smallest TypeScript interfaces that expose each domain pressure, maintain RED-GREEN-REFACTOR evidence, and keep each work unit independently testable and reversible.
