import { describe, expect, it } from 'vitest';

import {
  CommandLog,
  IncidentCoordinator,
  IncidentNotifier,
  IncidentStateMachine,
  InvalidIncidentStateError,
  RestartServiceCommand,
  ServiceDeskHandler,
  SupportEngineerHandler,
  UnassignedIncidentError,
  runIncidentScenario,
} from './incident-response.js';

describe('incident-response SRE laboratory', () => {
  it('runs a payment outage from routing to closure with notifications', () => {
    const result = runIncidentScenario({
      id: 'INC-100',
      title: 'Payment outage',
      severity: 'critical',
      summary: 'Payments unavailable.',
    });
    expect(result.assignment.assignedTo).toBe('service-desk');
    expect(result.assignment.priority).toBe('P1');
    expect(result.state).toBe('closed');
    expect(result.remediation).toBe('Restarted payments-api');
    expect(result.notices).toEqual([
      'INC-100: acknowledged',
      'INC-100: mitigating',
      'INC-100: resolved',
      'INC-100: closed',
    ]);
  });

  it('assigns routine incidents to support and rejects exhausted chains', () => {
    const incident = {
      id: 'INC-2',
      title: 'Slow reports',
      severity: 'low',
      summary: 'Reports delayed.',
    } as const;
    const coordinator = new IncidentCoordinator(
      () => 'P3',
      [new SupportEngineerHandler(), new ServiceDeskHandler()],
    );
    expect(coordinator.escalate(incident)).toEqual({
      priority: 'P3',
      assignedTo: 'support-engineer',
      path: ['support-engineer:accept'],
    });
    expect(() => new IncidentCoordinator(() => 'P1').escalate(incident)).toThrow(
      UnassignedIncidentError,
    );
  });

  it('keeps command history unchanged when execution or undo fails', () => {
    const log = new CommandLog();
    expect(log.lastOutcome()).toBeUndefined();
    expect(() => log.undo()).toThrow('No command to undo');
    const command = {
      execute: () => 'started',
      undo: () => {
        throw new Error('Undo failed');
      },
    };
    log.execute(command);
    expect(() => log.undo()).toThrow('Undo failed');
    expect(log.lastOutcome()).toBe('started');
    expect(() => {
      log.execute({
        execute: () => {
          throw new Error('Execution failed');
        },
        undo: () => '',
      });
    }).toThrow('Execution failed');
    expect(log.lastOutcome()).toBe('started');
  });

  it('unsubscribes observers and isolates independent state machines', () => {
    const notifier = new IncidentNotifier();
    const notices: string[] = [];
    const unsubscribe = notifier.subscribe({
      name: 'operator',
      onNotice: (notice) => notices.push(notice),
    });
    unsubscribe();
    notifier.publish('ignored');
    expect(notices).toEqual([]);
    const state = new IncidentStateMachine();
    expect(() => {
      state.resolve();
    }).toThrow(InvalidIncidentStateError);
    expect(state.currentState).toBe('open');
    state.acknowledge();
    expect(new IncidentStateMachine().currentState).toBe('open');
  });
  it('routes incidents by severity strategy', () => {
    const coordinator = new IncidentCoordinator((incident) =>
      incident.severity === 'critical' ? 'P1' : incident.severity === 'high' ? 'P2' : 'P3',
    );

    expect(
      coordinator.routeIncident({
        id: 'INC-204',
        title: 'Database failover',
        severity: 'critical',
        summary: 'Primary database failed and latency spiked.',
      }),
    ).toBe('P1');

    expect(
      coordinator.routeIncident({
        id: 'INC-205',
        title: 'Checkout latency',
        severity: 'high',
        summary: 'Cart API p95 exceeds target.',
      }),
    ).toBe('P2');
  });

  it('escalates in the correct order and preserves the routing path', () => {
    const coordinator = new IncidentCoordinator(
      (incident) => (incident.severity === 'critical' ? 'P1' : 'P2'),
      [new SupportEngineerHandler(), new ServiceDeskHandler()],
    );

    const result = coordinator.escalate({
      id: 'INC-403',
      title: 'Payment gateway timeout',
      severity: 'critical',
      summary: 'Gateway timeout is impacting checkout revenue.',
    });

    expect(result.priority).toBe('P1');
    expect(result.assignedTo).toBe('service-desk');
    expect(result.path).toEqual(['support-engineer:escalate', 'service-desk:accept']);
  });

  it('executes and reverts remediation commands', () => {
    const commandLog = new CommandLog();
    const command = new RestartServiceCommand('payments-api');

    commandLog.execute(command);

    expect(commandLog.lastOutcome()).toBe('Restarted payments-api');
    expect(commandLog.undo()).toBe('Cancelled restart for payments-api');
  });

  it('publishes incident notices to subscribers', () => {
    const notifier = new IncidentNotifier();
    const messages: string[] = [];

    notifier.subscribe({
      name: 'on-call-engineer',
      onNotice: (notice) => messages.push(notice),
    });
    notifier.subscribe({
      name: 'incident-commander',
      onNotice: (notice) => messages.push(notice),
    });

    notifier.publish('Mitigation started for INC-100');

    expect(messages).toEqual(['Mitigation started for INC-100', 'Mitigation started for INC-100']);
  });

  it('allows valid transitions and rejects invalid ones', () => {
    const state = new IncidentStateMachine();

    state.acknowledge();
    state.mitigate();
    state.resolve();
    state.close();

    expect(state.currentState).toBe('closed');

    expect(() => {
      state.resolve();
    }).toThrow(InvalidIncidentStateError);
  });
});
