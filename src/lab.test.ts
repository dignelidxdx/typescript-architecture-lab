import { describe, expect, it } from 'vitest';

import { labDomains } from './lab.js';

describe('architecture lab manifest', () => {
  it('lists the business domains used to teach pattern selection', () => {
    expect(labDomains).toEqual(['incident-response', 'data-pipeline', 'commerce', 'game-engine']);
  });
});
