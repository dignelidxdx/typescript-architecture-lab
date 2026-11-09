import { runIncidentScenario } from './incident-response.js';

console.log(
  JSON.stringify(
    runIncidentScenario({
      id: 'INC-100',
      title: 'Payment gateway outage',
      severity: 'critical',
      summary: 'Customers cannot complete payments.',
    }),
    null,
    2,
  ),
);
