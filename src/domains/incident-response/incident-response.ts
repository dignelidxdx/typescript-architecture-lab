export interface Incident {
  readonly id: string;
  readonly title: string;
  readonly severity: 'low' | 'high' | 'critical';
  readonly summary: string;
}

export type Priority = 'P1' | 'P2' | 'P3';
export type EscalationPolicy = (incident: Incident) => Priority;

export interface EscalationHandler {
  readonly name: string;
  accepts(priority: Priority): boolean;
}

export class SupportEngineerHandler implements EscalationHandler {
  readonly name = 'support-engineer';
  accepts(priority: Priority): boolean {
    return priority !== 'P1';
  }
}

export class ServiceDeskHandler implements EscalationHandler {
  readonly name = 'service-desk';
  accepts(): boolean {
    return true;
  }
}

export class UnassignedIncidentError extends Error {
  constructor(id: string) {
    super(`No handler accepted incident ${id}`);
    this.name = 'UnassignedIncidentError';
  }
}

export class IncidentCoordinator {
  constructor(
    private readonly policy: EscalationPolicy,
    private readonly handlers: readonly EscalationHandler[] = [],
  ) {}

  routeIncident(incident: Incident): Priority {
    return this.policy(incident);
  }

  escalate(incident: Incident) {
    const priority = this.routeIncident(incident);
    const path: string[] = [];
    for (const handler of this.handlers) {
      const accepted = handler.accepts(priority);
      path.push(`${handler.name}:${accepted ? 'accept' : 'escalate'}`);
      if (accepted) return { priority, assignedTo: handler.name, path };
    }
    throw new UnassignedIncidentError(incident.id);
  }
}

export interface RemediationCommand {
  execute(): string;
  undo(): string;
}

// Local simulation only: a real service restart cannot be undone.
export class RestartServiceCommand implements RemediationCommand {
  constructor(private readonly service: string) {}
  execute(): string {
    return `Restarted ${this.service}`;
  }
  undo(): string {
    return `Cancelled restart for ${this.service}`;
  }
}

export class CommandLog {
  private readonly history: { command: RemediationCommand; outcome: string }[] = [];

  execute(command: RemediationCommand): void {
    const outcome = command.execute();
    this.history.push({ command, outcome });
  }

  lastOutcome(): string | undefined {
    return this.history.at(-1)?.outcome;
  }

  undo(): string {
    const entry = this.history.at(-1);
    if (!entry) throw new Error('No command to undo');
    const outcome = entry.command.undo();
    this.history.pop();
    return outcome;
  }
}

export interface IncidentSubscriber {
  readonly name: string;
  onNotice(notice: string): void;
}

export class IncidentNotifier {
  private readonly subscribers = new Set<IncidentSubscriber>();

  subscribe(subscriber: IncidentSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  publish(notice: string): void {
    for (const subscriber of [...this.subscribers]) subscriber.onNotice(notice);
  }
}

export type IncidentState = 'open' | 'acknowledged' | 'mitigating' | 'resolved' | 'closed';

export class InvalidIncidentStateError extends Error {
  constructor(from: IncidentState, to: IncidentState) {
    super(`Cannot transition incident from ${from} to ${to}`);
    this.name = 'InvalidIncidentStateError';
  }
}

export class IncidentStateMachine {
  private state: IncidentState = 'open';

  get currentState(): IncidentState {
    return this.state;
  }

  acknowledge(): void {
    this.transition('open', 'acknowledged');
  }
  mitigate(): void {
    this.transition('acknowledged', 'mitigating');
  }
  resolve(): void {
    this.transition('mitigating', 'resolved');
  }
  close(): void {
    this.transition('resolved', 'closed');
  }

  private transition(expected: IncidentState, next: IncidentState): void {
    if (this.state !== expected) throw new InvalidIncidentStateError(this.state, next);
    this.state = next;
  }
}

/** In-memory payment outage walkthrough; resolution is simulated, not verified externally. */
export function runIncidentScenario(incident: Incident) {
  const coordinator = new IncidentCoordinator(
    ({ severity }) => (severity === 'critical' ? 'P1' : severity === 'high' ? 'P2' : 'P3'),
    [new SupportEngineerHandler(), new ServiceDeskHandler()],
  );
  const assignment = coordinator.escalate(incident);
  const lifecycle = new IncidentStateMachine();
  const notifier = new IncidentNotifier();
  const commands = new CommandLog();
  const notices: string[] = [];
  const unsubscribe = notifier.subscribe({
    name: 'incident-timeline',
    onNotice: (notice) => notices.push(notice),
  });
  const publishState = () => {
    notifier.publish(`${incident.id}: ${lifecycle.currentState}`);
  };

  lifecycle.acknowledge();
  publishState();
  lifecycle.mitigate();
  publishState();
  commands.execute(new RestartServiceCommand('payments-api'));
  lifecycle.resolve();
  publishState();
  lifecycle.close();
  publishState();
  unsubscribe();

  return {
    assignment,
    state: lifecycle.currentState,
    remediation: commands.lastOutcome(),
    notices,
  };
}
