# TypeScript Design Patterns Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a strict TypeScript laboratory that teaches design-pattern diagnosis through realistic domain problems and executable tests.

**Architecture:** Keep each business domain independent under `src/domains`, with public interfaces and colocated Vitest specifications. Keep conceptual material under `design-patterns`, cross-linking each pattern to the domains where its trade-offs are visible.

**Tech Stack:** TypeScript, Node.js, Vitest, ESLint, Prettier.

**Spec:** `docs/superpowers/specs/2026-11-07-design-patterns-lab-design.md`

## Global Constraints

- Enable strict TypeScript compiler checks.
- Use professional English for code, identifiers, source comments, and tests.
- Use Spanish for the three requested learning guides.
- Add dependencies only when they provide test, compiler, or formatting infrastructure.
- Observe RED before production implementation for every runnable behavior.
- Implement only patterns justified by a documented domain pressure.

## Review Focus

- A pattern must remain replaceable by a simpler implementation when the pressure disappears.
- Domain failures must be represented explicitly rather than swallowed by pattern infrastructure.
- Examples must not share mutable global state across tests.
- Public examples must compile without unsafe casts or non-null assertions.
- Documentation links and runnable imports must remain valid after each work unit.

---

### Task 1: Toolchain and learning contract

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Modify: `README.md`
- Create: `design-patterns/README.md`
- Create: `design-patterns/creational.md`
- Create: `design-patterns/structural.md`
- Create: `design-patterns/behavioral.md`

**Interfaces:**

- Consumes: none.
- Produces: stable TypeScript/test commands and guide sections that later tasks cross-link.

- [ ] Define scripts for `typecheck`, `test`, `lint`, and `format:check`; install only their required development dependencies.
- [ ] Add strict compiler configuration and a smoke specification that first fails because no exported laboratory manifest exists.
- [ ] Implement the minimal manifest, observe GREEN, and remove the temporary smoke-only surface if later public domain APIs supersede it.
- [ ] Write the three catalog guides using the agreed diagnostic sequence and explicitly deepen Builder, Singleton, Adapter, and Strategy.
- [ ] Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run format:check`.
- [ ] Commit as `docs: establish design patterns learning lab` with toolchain files included because the guides depend on executable examples.

### Task 2: Incident-response/SRE laboratory

**Files:**

- Create: `src/domains/incident-response/*.ts`
- Create: `src/domains/incident-response/*.test.ts`
- Create: `src/domains/incident-response/README.md`
- Modify: `design-patterns/behavioral.md`

**Interfaces:**

- Consumes: repository test and compiler commands from Task 1.
- Produces: `IncidentCoordinator`, escalation policies, executable remediation commands, incident subscribers, and lifecycle states.

- [ ] Write failing public-interface tests for severity-based routing, ordered escalation, reversible remediation, notifications, and valid/invalid state transitions.
- [ ] Run focused tests and confirm each failure is caused by missing behavior.
- [ ] Implement Strategy, Chain of Responsibility, Command, Observer, and State with explicit domain errors.
- [ ] Refactor only after GREEN; document why each indirection exists and its simpler alternative.
- [ ] Run focused tests and the full suite.
- [ ] Commit as `feat(sre): model incident response patterns`.

### Task 3: Data-pipeline laboratory

**Files:**

- Create: `src/domains/data-pipeline/*.ts`
- Create: `src/domains/data-pipeline/*.test.ts`
- Create: `src/domains/data-pipeline/README.md`
- Modify: `design-patterns/creational.md`
- Modify: `design-patterns/structural.md`
- Modify: `design-patterns/behavioral.md`

**Interfaces:**

- Consumes: shared test/compiler conventions only; no business dependency on Task 2.
- Produces: validated `PipelineBuilder`, source factories, vendor-record adapters, lazy record iteration, and a processing skeleton.

- [ ] Write failing tests for validated construction, source selection, schema normalization, lazy iteration, and invariant pipeline stages.
- [ ] Observe RED for the missing public APIs.
- [ ] Implement Builder, Factory Method, Adapter, Iterator, and Template Method without external data libraries.
- [ ] Refactor after GREEN and document operational trade-offs such as backpressure and partial records.
- [ ] Run focused tests and the full suite.
- [ ] Commit as `feat(data): add composable pipeline patterns`.

### Task 4: Commerce laboratory

**Files:**

- Create: `src/domains/commerce/*.ts`
- Create: `src/domains/commerce/*.test.ts`
- Create: `src/domains/commerce/README.md`
- Modify: `design-patterns/creational.md`
- Modify: `design-patterns/structural.md`

**Interfaces:**

- Consumes: shared test/compiler conventions only.
- Produces: region-compatible checkout families, layered pricing, a checkout facade, and an authorization proxy.

- [ ] Write failing tests for compatible regional services, deterministic price layers, facade orchestration, and proxy authorization/caching boundaries.
- [ ] Observe RED for the missing behavior.
- [ ] Implement Abstract Factory, Decorator, Facade, and Proxy with typed failures.
- [ ] Refactor after GREEN and contrast Proxy with Adapter, Decorator, and an HTTP reverse proxy.
- [ ] Run focused tests and the full suite.
- [ ] Commit as `feat(commerce): model checkout collaboration patterns`.

### Task 5: Game-engine laboratory

**Files:**

- Create: `src/domains/game-engine/*.ts`
- Create: `src/domains/game-engine/*.test.ts`
- Create: `src/domains/game-engine/README.md`
- Modify: `design-patterns/creational.md`
- Modify: `design-patterns/structural.md`
- Modify: `design-patterns/behavioral.md`

**Interfaces:**

- Consumes: shared test/compiler conventions only.
- Produces: cloneable entity prototypes, scene composites, shared immutable sprite data, and bounded save-state snapshots.

- [ ] Write failing tests for independent clones, recursive scene operations, flyweight identity reuse, and snapshot restoration.
- [ ] Observe RED for missing behavior.
- [ ] Implement Prototype, Composite, Flyweight, and Memento; discuss State by comparison rather than duplicate the SRE implementation.
- [ ] Refactor after GREEN and document memory/identity trade-offs.
- [ ] Run focused tests and the full suite.
- [ ] Commit as `feat(game): demonstrate entity lifecycle patterns`.

### Task 6: Cross-domain learning path and verification

**Files:**

- Modify: `README.md`
- Modify: `design-patterns/README.md`
- Modify: `design-patterns/creational.md`
- Modify: `design-patterns/structural.md`
- Modify: `design-patterns/behavioral.md`
- Create: `exercises/README.md`

**Interfaces:**

- Consumes: every public domain example.
- Produces: a navigable curriculum and exercises whose solutions require diagnosing a pressure before naming a pattern.

- [ ] Add a cross-domain decision map and exercises with acceptance criteria but no bundled solutions.
- [ ] Verify every catalog pattern has signals, counter-indications, industry examples, and language notes.
- [ ] Verify every implemented pattern links to executable code and tests.
- [ ] Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run format:check` once each.
- [ ] Record exact results in the ODD log and commit as `docs: complete design patterns curriculum`.

## Self-review

- Spec coverage: S1-S6 map to Tasks 1-6; executable examples deliberately cover a justified subset.
- Step scan: each task has an observable RED/GREEN cycle and explicit verification.
- Type consistency: cross-domain dependencies are prohibited; only Task 1 infrastructure is shared.
- Review focus: each listed risk is owned by domain tests or final documentation checks.
- Proportion: signatures remain task-level decisions; implementation bodies are not prewritten.
