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
} from './incident-response.js';

describe('incident-response SRE laboratory', () => {
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
    expect(result.path).toEqual([
      'support-engineer:escalate',
      'service-desk:accept',
    ]);
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

    expect(messages).toEqual([
      'Mitigation started for INC-100',
      'Mitigation started for INC-100',
    ]);
  });

  it('allows valid transitions and rejects invalid ones', () => {
    const state = new IncidentStateMachine();

    state.acknowledge();
    state.mitigate();
    state.resolve();
    state.close();

    expect(state.currentState).toBe('closed');

    expect(() => state.resolve()).toThrow(InvalidIncidentStateError);
  });
});
