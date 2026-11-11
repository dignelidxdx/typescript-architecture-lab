# TypeScript Architecture Lab

TypeScript architecture lab focused on real problems, design patterns, SOLID
principles, distributed systems, and reliability. The goal is not to memorize
diagrams, but to recognize when a design pressure justifies an abstraction.

## Learning path

1. Start with [`design-patterns/README.md`](design-patterns/README.md).
2. Study one pattern family.
3. Run the linked domain lab.
4. Change one business rule and observe which design absorbs the change better.

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

The examples use professional English code and naming. The guides are written in
Spanish to keep the cognitive effort focused on the concepts.
