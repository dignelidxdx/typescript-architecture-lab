# TypeScript Architecture Lab

TypeScript architecture lab focused on real problems, design patterns, SOLID
principles, distributed systems, and reliability. The goal is not to memorize
diagrams, but to recognize when a design pressure justifies an abstraction.

## Learning path

1. Start with [`design-patterns/README.md`](design-patterns/README.md).
2. Study one pattern family.
3. Run the linked domain lab.
4. Change one business rule and observe which design absorbs the change better.

## My favorite patterns

These are my favorite patterns because they represent three common software design
problems: how to create objects, how to build them step by step, and how to change a
rule without filling the code with conditionals.

| Pattern       | Type       | In simple terms                                                                                          | When I would choose it                                                                           |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Builder**   | Creational | Builds a complex object in stages, making its options explicit and validating the final result.          | When construction requires several steps, optional configuration, or validation rules.           |
| **Factory**   | Creational | Encapsulates the decision about which concrete object to create and returns an abstraction ready to use. | When client code should not know every concrete class or the selection may change.               |
| **Singleton** | Creational | Guarantees one shared instance of a resource during the application's lifetime.                          | Only when uniqueness is a real domain or infrastructure rule—not as a shortcut for shared state. |
| **Strategy**  | Behavioral | Represents a family of interchangeable algorithms behind a common interface.                             | When a rule varies by context and should be replaceable without changing the main flow.          |

### Why I am adding Strategy

Builder, Factory, and Singleton primarily address object-creation problems. Strategy
extends the curriculum into behavior: it helps model policies such as calculating
priority, choosing a notification channel, or applying a retry policy. It also
reinforces an important rule of this laboratory: a pattern is justified by a concrete
change pressure, not by the prestige of its name.

### A criterion for avoiding pattern overuse

Before introducing any of them, I first check whether a function, module, or simple
composition solves the problem. If I cannot explain which costly or risky change the
pattern absorbs, I do not need it yet.

## Design opportunity review

The external [design-pattern-skill](https://github.com/sirius-zuo/design-pattern-skill)
repository proposes an automated architecture and code review. Its approach can serve
as a checklist: detect duplicated creation logic, large conditionals, coupling, oversized
classes, and scattered data queries, then recommend patterns with their impact, location,
and trade-offs.

We are not incorporating it as a project dependency for now. It is a skill designed for
coding agents, and its value lies in the review process rather than in running application
code. Our project already contains a diagnostic guide and pattern reference sheets. The
reasonable decision is to reuse its ideas as a reference for future audits while keeping
the rule that recommendations do not mandate refactoring.

If the laboratory grows, we can adopt a two-pass review report:

1. review the design documents first;
2. review the code afterward, recording the file, design pressure, candidate pattern,
   simple alternative, and trade-offs.

## Commands

The first runnable domain is [incident response/SRE](src/domains/incident-response/README.md).
Run `npm run demo:sre` for an in-memory payment-outage walkthrough. The API and web
interface are not implemented yet.

```bash
npm install
npm test
npm run typecheck
npm run lint
npm run format:check
```

The examples and guides use professional English, with consistent terminology and
clear explanations for human readers.
