# Design Patterns: Learn to Detect Before Implementing

A pattern is not a recipe to insert simply because you recognize its name. It is a
known solution to a design pressure that you can already describe and demonstrate.

## Five diagnostic questions

1. What concrete change is becoming costly or risky?
2. What varies, and what should remain stable?
3. Would a function, module, or simple composition solve the problem?
4. Who needs to extend the behavior, and how often?
5. Is the cost of the abstraction lower than the current cost of change?

If you cannot answer the first question with a real example, you do not need a pattern
yet. Implementing one too early is like building a highway where there is no traffic.

## Families

- [Creational](creational.md): control how valid and compatible objects are created.
- [Structural](structural.md): organize collaboration between existing components.
- [Behavioral](behavioral.md): distribute decisions, state, and messages.

Each guide contains signals, a business case, the cost, and a simpler alternative.
Executable laboratories implement only the patterns justified by their problems.

## Industrial use-case map

The sector is a context for recognizing design pressure, not a reason to apply a
pattern automatically.

| Pattern                 | Category   | Industry context            | Specific use case                                                           | Use it when                                                      | Avoid it when                                                  |
| ----------------------- | ---------- | --------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Builder                 | Creational | Fintech                     | Build a payment, loan, or risk configuration with optional rules            | Construction has stages and invariants                           | The object has only a few independent fields                   |
| Factory Method          | Creational | Data platforms              | Select a CSV, JSON Lines, or Kafka reader                                   | Creation depends on a provider or format                         | There is only one stable implementation                        |
| Abstract Factory        | Creational | E-commerce                  | Create compatible tax, invoice, payment, and shipping services by region    | Several products must belong to one compatible family            | Products do not have compatibility constraints                 |
| Singleton               | Creational | Infrastructure              | Own one migration coordinator or process-local lock registry                | A second instance would violate a real identity guarantee        | The goal is only global access or shared mutable state         |
| Strategy                | Behavioral | Fintech and insurance       | Select fraud, pricing, credit-scoring, or claims policies                   | Algorithms vary by context and must be tested independently      | A small exhaustive `switch` is clearer                         |
| Chain of Responsibility | Behavioral | SRE and support operations  | Route incidents through automated runbooks, service teams, and escalation   | Ordered handlers may accept or escalate a request                | The sequence is short and fixed                                |
| Command                 | Behavioral | Operations and gaming       | Queue, audit, retry, undo, or replay an action                              | An action needs identity and a lifecycle                         | A direct function call is sufficient                           |
| Observer                | Behavioral | SaaS platforms              | Notify metrics, audit logs, timelines, and customer alerts                  | Multiple independent consumers react to an event                 | Consumers are few, synchronous, and mandatory                  |
| State                   | Behavioral | Gaming and order management | Enforce valid player, order, claim, or incident transitions                 | Behavior changes by lifecycle phase                              | There are only one or two simple statuses                      |
| Adapter                 | Structural | Real estate                 | Normalize property data from multiple listing providers                     | External APIs expose incompatible models                         | The external model already matches the domain                  |
| Decorator               | Structural | E-commerce                  | Layer discounts, taxes, promotions, or observability around pricing         | Capabilities combine dynamically per instance                    | A few functions compose the behavior more clearly              |
| Facade                  | Structural | Healthcare and e-commerce   | Expose one workflow over scheduling, inventory, payment, or billing systems | Clients should not coordinate many subsystem steps               | The facade would absorb business rules and become a God Object |
| Proxy                   | Structural | Payments and security       | Add authorization, idempotency, caching, or remote access control           | Access must be controlled without changing the consumer contract | Hiding latency or remote failure would mislead consumers       |

The detailed guides explain the trade-offs and simpler alternatives for each family.
