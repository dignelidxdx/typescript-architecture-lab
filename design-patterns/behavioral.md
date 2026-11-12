# Behavioral Patterns

These patterns distribute decisions, messages, algorithms, and transitions. Consider
them when conditionals already represent independent policies or when several objects
must coordinate without knowing each other's details.

## Quick map

| Pattern                 | Dominant signal                                   | Domain     | Cost and simple alternative                                                           |
| ----------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Chain of Responsibility | Several handlers can resolve or escalate          | SRE        | The flow is harder to trace; use conditionals for a short sequence                    |
| Command                 | An action needs identity, queuing, or reversal    | SRE        | Adds objects and lifecycle; call a function for immediate actions                     |
| Iterator                | Traversal must hide storage                       | Data       | May hide I/O; return an array for small collections                                   |
| Mediator                | Many components know about one another            | Operations | Can centralize too many decisions; connect a few collaborators directly               |
| Memento                 | State must be restored without exposing internals | Games      | Copying and versioning snapshots costs memory; use small immutable values when enough |
| Observer                | Several consumers react to an event               | SRE        | Ordering and errors are implicit; call required collaborators directly                |
| State                   | Behavior depends on a valid phase                 | SRE        | Adds types per phase; a discriminated union is enough for small behavior              |
| Strategy                | An interchangeable policy decides how to act      | SRE        | Fragments simple rules; keep an exhaustive `switch` for closed variants               |
| Template Method         | The algorithm preserves stages                    | ETL        | Couples through inheritance; compose functions when order needs no protection         |
| Visitor                 | Operations are added to a stable structure        | Compilers  | Adding nodes affects every visitor; use a discriminated union for small structures    |

## Chain of Responsibility

**Problem.** A request can be handled, enriched, or escalated by several ordered handlers.

**Real case.** An incident moves through an automated runbook, service team, and platform
on-call until sufficient capacity and authority are found.

**Risk.** An opaque chain makes it difficult to know who handled the case. Return a typed
result and record the path. HTTP middleware is a common variant in TypeScript, Go, and Java.

## Command

**Problem.** An action must become a value so it can be queued, audited, retried, or
reversed.

**Real case.** `RestartService` stores parameters, executes remediation, and records what
is needed to compensate it. In games, commands represent input and enable replay.

**Do not use it when:** a direct call is sufficient and the action has no lifecycle needs.

## Iterator

**Problem.** The consumer needs to traverse elements without knowing about storage,
pagination, or lazy loading.

**Advanced TypeScript.** Implement `Iterable<T>` for synchronous data and `AsyncIterable<T>`
for pages or streams. An async generator communicates backpressure better than returning
everything in an array.

**Real case.** A pipeline consumes record pages without loading millions of rows into
memory. Python uses iterators extensively; Go often expresses traversal with channels or
iterator functions.

## Mediator

**Problem.** Many components call one another, and each change affects several pairs.

**Real case.** An operations room coordinates a timeline, chat, assignments, and alerts
through a mediator. Participants publish intentions without knowing every receiver.

**Risk.** The mediator can become a giant controller. With only two collaborators, a direct
dependency is usually more honest.

## Memento

**Problem.** State must be captured and restored without allowing outside code to manipulate
the internal representation.

**Real case.** A game stores a versioned snapshot of a match. An editor implements undo with
small snapshots or inverse events.

**Cost.** Copying large states consumes memory; persisting mementos introduces versioning and
migrations. Event sourcing is not simply Memento: it preserves domain events rather than
opaque copies.

## Observer

**Problem.** Several consumers react to a change, and the emitter should not know their
implementations.

**Real case.** When an incident changes, metrics, the timeline, and notifications react
independently.

**Risks.** Implicit ordering, subscription leaks, and partial failures. Within one process,
typed callbacks may be enough; across services, delivery semantics, idempotency, and retries
must be explicit.

## State

**Problem.** Behavior changes by phase, and large conditionals allow invalid transitions.

**Real case.** An incident may be `detected`, `acknowledged`, `mitigating`, or `resolved`;
resolving it before acknowledgment may violate operational policy.

Use a discriminated union when states only contain data and a small set of functions. Use
State objects when each phase accumulates its own behavior and grows independently.

## Strategy: deeper dive

**Problem.** A decision has alternative algorithms with the same purpose and must change
without modifying its consumer.

**Recognize it when:** a `switch` selects policies; flags alter the algorithm; clients need
different rules; policies must be tested in isolation.

**Real case.** Incident priority may be calculated by impact, SLO objectives, or regulation.
The coordinator receives a function or `PrioritizationStrategy` interface.

```ts
type PrioritizationStrategy = (incident: Incident) => Priority;

const coordinator = new IncidentCoordinator({
  prioritize: prioritizeBySloBurnRate,
});
```

TypeScript supports Strategy through functions, callable objects, or classes. Choose a class
only when the policy needs state and a lifecycle. In Python, callables are natural; in Go,
small interfaces or functions are common.

**Do not use it when:** variants are closed domain cases and an exhaustive discriminated
union with `switch` is more transparent.

## Template Method

**Problem.** An algorithm preserves an invariant order while some stages vary.

**Real case.** Every ETL process validates, extracts, transforms, persists, and emits
metrics; sources customize limited steps.

**Trade-off.** It traditionally relies on inheritance. In TypeScript, composing functions
in a pipeline usually creates less coupling. Use it when the skeleton must enforce order
and hooks are deliberately restricted.

## Visitor

**Problem.** The object structure is stable, but many operations do not naturally belong to
its nodes.

**Real case.** An AST receives validators, code generators, and analyzers. A stable accounting
model receives exporters and auditors.

**Cost.** Adding an operation is easy; adding a new node type requires changing every
visitor. Discriminated unions and exhaustive pattern matching are often more idiomatic in
TypeScript for small structures.

## Diagnostic exercise

### Executable laboratory: incident response/SRE

Run `npm run demo:sre` to follow a payment outage from prioritization to closure. The
[module](../src/domains/incident-response/incident-response.ts) combines Strategy, Chain
of Responsibility, Command, Observer, and a small state machine. The
[tests](../src/domains/incident-response/incident-response.test.ts) verify the flow and
rejections; the [walkthrough](../src/domains/incident-response/README.md) explains the
costs and simpler alternatives.

This is a local simulation: it does not restart services or verify real recovery. A
completed restart cannot be undone; the simulated command must not be used as a production
operational contract.

Design an incident platform that prioritizes by SLO, notifies several channels, and allows
controlled transitions. Justify Strategy, Observer, and State separately. If one class
implements all three, identify which reasons for change have become mixed together.
