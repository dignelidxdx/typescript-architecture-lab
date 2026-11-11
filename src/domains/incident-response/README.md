# Incident response: a payment outage

Start with `npm run demo:sre` from the repository root. The local walkthrough
routes a critical incident to the service desk, acknowledges it, starts mitigation,
simulates remediation, resolves it, and closes it. Its JSON output includes the
assignment path and a notification timeline. No real services are restarted.

## Read in this order

1. [Behavior specifications](incident-response.test.ts).
2. [Public domain types and implementations](incident-response.ts).
3. `runIncidentScenario` at the bottom of that module: the composition boundary.
4. [Demo entry point](demo.ts).

## Why these patterns exist

| Pressure                                             | Implementation                             | Simpler alternative                                   |
| ---------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| Priority rules differ between teams                  | Strategy: injected policy function         | A fixed severity lookup                               |
| Ownership depends on ordered acceptance rules        | Chain of Responsibility: ordered handlers  | A priority-to-team map                                |
| Remediation must be invoked and tracked uniformly    | Command: execute/undo contract and history | A direct function call                                |
| More than one consumer needs incident notices        | Observer: subscribers with unsubscribe     | Call one consumer directly                            |
| Lifecycle operations must reject invalid transitions | State: union and guarded transitions       | A single status field if there are no lifecycle rules |

State deliberately uses a small state machine rather than one class per state.
The chain accepts the first matching handler; an exhausted chain raises
`UnassignedIncidentError`. Support accepts P2/P3, while the service desk is the
fallback. This is a teaching policy, not a universal SRE escalation model.

## Boundaries and failures

- All state belongs to individual instances. Nothing persists between runs.
- Command history records only successful executions and removes an entry only
  after successful undo. It cannot make external side effects atomic.
- `RestartServiceCommand` is a string-producing simulation. Its undo text models
  cancellation only for the exercise: an actual completed restart is irreversible.
- Notifications are synchronous and fail fast: a subscriber exception propagates
  and prevents later callbacks. There are no retries or delivery guarantees.
- The scenario assumes recovery succeeds; production resolution would require
  health checks. It is a domain walkthrough, not an HTTP/browser end-to-end test.
- Types protect TypeScript callers, not untrusted HTTP payloads. Runtime input
  validation belongs at the future API boundary.

## Practice

Change the priority policy so high-severity incidents become P1. Keep the handlers
unchanged and write a test showing the new assignment. Then add a subscriber and
verify that unsubscribing stops its notifications.

Run `npm test -- src/domains/incident-response/incident-response.test.ts`.
Next: expose the domain through an API and a web interface without moving domain
rules into the framework.
