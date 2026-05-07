import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortViewMock, objectIdFromHexMock } = vi.hoisted(() => ({
  checkCohortViewMock: vi.fn(),
  objectIdFromHexMock: vi.fn((id) => `oid:${id}`)
}));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkCohortViewMock(...args)
}));

vi.mock('mongoose', () => ({
  default: { Types: { ObjectId: { createFromHexString: (...args) => objectIdFromHexMock(...args) } } }
}));

import getPublishedScenariosByCohortId from '../services/getPublishedScenariosByCohortId.js';

describe('getPublishedScenariosByCohortId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks view access', async () => {
    const aggregate = vi.fn().mockResolvedValue([]);
    const ctx = { models: { Scenario: { aggregate } }, user: {} };

    await getPublishedScenariosByCohortId({ cohortId: 'c1' }, {}, ctx);

    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('returns scenarios wrapped under "scenarios"', async () => {
    const aggregate = vi.fn().mockResolvedValue([{ _id: 's1' }]);

    const result = await getPublishedScenariosByCohortId(
      { cohortId: 'c1' },
      {},
      { models: { Scenario: { aggregate } }, user: {} }
    );

    expect(result).toEqual({ scenarios: [{ _id: 's1' }] });
  });
});
