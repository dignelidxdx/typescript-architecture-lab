# AGENTS.md

## Project
TypeScript Architecture Lab for design-pattern learning and domain-driven examples.

## Required constraints
- Use strict TypeScript.
- Prefer English for code, identifiers, comments, and tests.
- Use Spanish for learning guides in `design-patterns/`.
- Keep each pattern justified by a real domain pressure; do not add patterns "just because".
- No global mutable state across tests.
- No unsafe casts or non-null assertions in public examples.
- Keep examples small, testable, and replaceable by simpler code when the pressure disappears.

## Repository structure
- `src/`: executable examples and tests
- `design-patterns/`: conceptual guides
- `docs/`: project and planning docs
- `README.md`: entry point

## Verification commands
- `npm install`
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`

## Quality bar
- Add dependencies only when they provide real compiler/test/format tooling.
- Prefer public interfaces and real behavior tests over internal implementation details.
- Ensure new examples compile under the current strict TypeScript config.