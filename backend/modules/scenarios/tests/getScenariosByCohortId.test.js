import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortEditMock, objectIdFromHexMock } = vi.hoisted(() => ({
  checkCohortEditMock: vi.fn(),
  objectIdFromHexMock: vi.fn((id) => `oid:${id}`)
}));

vi.mock('../../cohorts/helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkCohortEditMock(...args)
}));

vi.mock('mongoose', () => ({
  default: { Types: { ObjectId: { createFromHexString: (...args) => objectIdFromHexMock(...args) } } }
}));

import getScenariosByCohortId from '../services/getScenariosByCohortId.js';

describe('getScenariosByCohortId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks edit access', async () => {
    const aggregate = vi.fn().mockResolvedValue([]);
    const ctx = { models: { Scenario: { aggregate } }, user: {} };

    await getScenariosByCohortId({ cohortId: 'c1' }, {}, ctx);

    expect(checkCohortEditMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('runs an aggregation that matches the cohort and sorts by per-cohort sortOrder', async () => {
    const aggregate = vi.fn().mockResolvedValue([]);

    await getScenariosByCohortId({ cohortId: 'c1' }, {}, { models: { Scenario: { aggregate } }, user: {} });

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[0].$match['cohorts.cohort']).toBe('oid:c1');
    expect(pipeline[0].$match.isDeleted).toBe(false);

    const sortStage = pipeline.find((stage) => stage.$sort);
    expect(sortStage).toEqual({ $sort: { cohortSortValue: 1 } });
  });

  it('returns scenarios wrapped under "scenarios"', async () => {
    const aggregate = vi.fn().mockResolvedValue([{ _id: 's1' }, { _id: 's2' }]);

    const result = await getScenariosByCohortId(
      { cohortId: 'c1' },
      {},
      { models: { Scenario: { aggregate } }, user: {} }
    );

    expect(result).toEqual({ scenarios: [{ _id: 's1' }, { _id: 's2' }] });
  });
});
