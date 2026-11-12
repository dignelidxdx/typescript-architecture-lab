# Structural Patterns

This family appears when the pieces already exist, but the way they collaborate creates
coupling, incompatibility, duplication, or operational cost.

## Quick map

| Pattern   | Diagnostic question                                         | Domain   | Cost and simple alternative                                                                     |
| --------- | ----------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Adapter   | Does the capability work, but its interface does not match? | Data     | Maintains another translation; use the SDK directly behind a stable consumer                    |
| Bridge    | Do two dimensions change independently?                     | Alerts   | Multiplies collaborations; Strategy is enough when only one axis varies                         |
| Composite | Do I need to treat leaves and groups alike?                 | Games    | A common contract can hide invalid operations; traverse a simple structure without polymorphism |
| Decorator | Do I need to combine capabilities per instance?             | Pricing  | Order changes results; compose functions when identity is unnecessary                           |
| Facade    | Does the client know too many internal steps?               | Checkout | Can become a God Object; a use-case function is enough for small orchestration                  |
| Flyweight | Do thousands of objects repeat immutable data?              | Games    | Shared identity complicates mutation; measure memory before using it                            |
| Proxy     | Do I need to control access without changing the contract?  | Payments | Can hide latency and failures; make a remote service explicit when it dominates the contract    |

## Adapter: deeper dive

**Problem.** An external component provides the right capability with names, types, or
semantics that do not match the domain.

**Recognize it when:** a provider model leaks into use cases; every consumer normalizes
dates or errors; changing the SDK requires editing the core.

**Real case.** Three providers deliver customers as CSV, JSON, and SDK objects. Each
adapter translates them into the canonical `CustomerRecord` and converts technical errors
into domain failures. Translation belongs at the boundary, not in the central model.

**Advanced TypeScript.** Use `unknown` for external input and validate before adapting.
`as CustomerRecord` does not adapt; it silences the compiler. Libraries such as Zod are
useful when data validation is central to the exercise, but are not required to teach the
basic collaboration.

## Bridge

**Problem.** Two axes change independently, and inheritance would produce one class for
each combination.

**Real case.** Alerts with their own severity and format must be sent by email, Slack, or
PagerDuty. Separating `AlertMessage` from `DeliveryChannel` avoids classes such as
`CriticalSlackAlert` and `WarningEmailAlert`.

**Do not use it when:** one dimension is fixed or simple Strategy covers the only variation.

## Composite

**Problem.** Leaves and groups must support the same recursive operation.

**Real case.** A game engine updates and renders individual entities and scene groups
through the same contract. The pattern also appears in catalogs, permissions, and
organizational structures.

**Cost.** The common contract can become too generic. Not every operation makes sense for
both leaves and containers.

## Decorator

**Problem.** Capabilities are combined dynamically, and inheritance would produce one
subclass per combination.

**Real case.** A cart's base price receives a membership discount, tax, and temporary
promotion. Each decorator preserves the calculation contract and wraps the previous one.

**Key distinction.** Decorator adds behavior; Adapter changes the interface; Proxy controls
access. In TypeScript, higher-order functions are often a simpler version of the same idea.

## Facade

**Problem.** A use case forces the client to know the order, dependencies, and details of
several subsystems.

**Real case.** `CheckoutFacade.placeOrder()` coordinates inventory, taxes, payment, and
invoicing. It does not contain every rule; it provides a stable, explicit boundary.

**Risk.** A facade that absorbs all logic becomes a God Object. It should orchestrate
capabilities, not replace their models.

## Flyweight

**Problem.** A very large number of objects repeats immutable data and consumes memory.

**Real case.** Thousands of entities share texture, geometry, and animation; each instance
keeps only position, velocity, and health. Measure before applying it: shared state makes
mutation much more dangerous.

In data analysis, this appears through dictionaries, interning, and categorical
representations. In Go it can reduce allocations; in JavaScript, the garbage collector
and hidden objects require profiling rather than intuition.

## Proxy

**Problem.** Access to an object needs authorization, lazy loading, caching, telemetry, or
remote communication without changing the consumer's contract.

**Real case.** A `PaymentGatewayProxy` checks permissions and idempotency before delegating
to the real gateway. An ORM may return lazy proxies; a service mesh acts as a network proxy,
but it is not automatically the object-oriented pattern in application code.

**Risk.** Hiding network latency or failures behind an apparently local interface misleads
the consumer. The contract must express asynchrony and errors.

## Diagnostic exercise

A system consumes two weather APIs, adds caching, and exposes a simple summary. Separate
which part is an Adapter, which could be a Proxy, and which constitutes a Facade. Explain
why one class performing all three responsibilities makes testing and replacement harder.
