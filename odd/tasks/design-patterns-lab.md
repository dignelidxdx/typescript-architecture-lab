# Design Patterns TypeScript Lab

Objective: build an advanced TypeScript learning laboratory where design patterns arise from realistic domain problems rather than isolated toy examples.
Branch: `feat/design-patterns-lab`. Delivery: reviewable work-unit commits. Test runner: Vitest.

## Specs

S1. Create `design-patterns/creational.md`, `design-patterns/structural.md`, and `design-patterns/behavioral.md` explaining when to consider each pattern, warning signs, trade-offs, business contexts, language notes, and when not to use it.

S2. Use advanced but understandable TypeScript with strict compiler settings, tests, and libraries only when they add genuine value.

S3. Organize executable examples by realistic domains: incident response/SRE, data pipelines, commerce, and game engines.

S4. Apply only patterns justified by each domain problem; do not force every catalog pattern into executable code.

S5. Teach pattern recognition through the sequence: problem, detection signals, naive solution, patterned solution, costs, counter-indications, and practice exercise.

S6. Give deeper treatment to Builder, Singleton, Adapter, and Strategy while still covering the remaining catalog patterns in the guides.

## Tasks

- T1 (S1-S6) — inline — complete — toolchain, catalog guides, and learning conventions; commit: this work unit.
- T2 (S2-S6) — inline — complete locally, uncommitted — incident-response/SRE domain, payment-outage demo, tests, and linked guide material.
- T3 (S2-S6) — inline — pending — implement the data-pipeline laboratory with tests and its linked guide material.
- T4 (S2-S6) — inline — pending — implement the commerce laboratory with tests and its linked guide material.
- T5 (S2-S6) — inline — pending — implement the game-engine laboratory with tests and its linked guide material.
- T6 (S1-S6) — inline — pending — complete cross-domain documentation, exercises, and full verification.

## Log

L1 (2026-11-07): "Algo tenemos ese proyecto sin usar PDF. La idea es aplicarlos ejemplos con TypeScript así los voy practicando y puedes dejar un markdown o tres markdown explicando en vez del PDF, déjalos en Markdown. Como sea mejor, o una carpeta que se llame designs patterns y luego los markdown. Y bueno, la idea es que esto sirva como laboratorio, pero casos reales puede tener, o sea usa TypeScript de manera experta, no muy básico, sino que se pueda entender todas sus funcionalidades. Y si hay librerías también se podría agregar. Si ya tiene librerías se podría agregar. La idea es aprender TypeScript a la vez que se aprende patrones de diseño e ir su implementación. Podemos aprovechar Browser este servicio para agregar estos tres archivos y a la vez agregar un ejemplo simulando un caso real aplicando no todos los patrones de diseño. Puede quedar los modelos de negocio o los dominios pueden quedar separados para aplicar estos patrones de diseño"

L2 (2026-11-07): The user approved domain-separated laboratories for SRE, data pipelines, commerce, and game engines, with three pattern-family guides and intentionally selective executable implementations.

L3 (2026-11-07): Estimated delivery exceeds 400 authored lines. Default delivery strategy is `ask-on-risk`; chain strategy will be requested before the first commit that would cross the review budget.

L4 (2026-11-07): Delivery strategy selected by the user: `feature-branch-chain`. Each domain remains a reviewable work unit on the feature branch and can become a dependent PR slice.

L5 (2026-11-07): T1 verified with `npm test` (1 test passed), `npm run typecheck`, `npm run lint`, and `npm run format:check`. Dependency installation initially exposed an npm Arborist peer-resolution failure; exact development dependency versions produced a reproducible install.

L6 (2026-11-09): User requested incremental implementation starting with SRE.
Scope ruling: implement T2 and an in-memory domain walkthrough first; defer HTTP,
web UI, persistence, and T3-T6. No commits or remote operations authorized.
The existing focused suite failed to load because incident-response.js was missing;
after implementation, 9 SRE tests and 10 total tests passed. The demo printed P1,
service-desk assignment, four lifecycle notices, and closed state. Initial lint
identified four void-arrow expressions, corrected with block bodies. Whole-repository
format checking found unrelated existing issues in AGENTS.md and the untracked
.atl/skill-registry.md; those files were left untouched. Read-only independent
review found no correctness issues. Risk: none (isolated simulated domain, additive
demo command, no external effects or changes to shared runtime behavior).
