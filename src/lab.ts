export const labDomains = [
  'incident-response',
  'data-pipeline',
  'commerce',
  'game-engine',
] as const;

export type LabDomain = (typeof labDomains)[number];
