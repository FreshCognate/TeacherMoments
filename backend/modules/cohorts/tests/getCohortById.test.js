import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getCohortById from '../services/getCohortById.js';

const buildModel = (cohort) => {
  const populate = vi.fn().mockResolvedValue(cohort);
  return { findById: vi.fn(() => ({ populate })) };
};

describe('getCohortById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks view access', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    const ctx = { models: { Cohort } };
    await getCohortById({ cohortId: 'c1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('returns the cohort when found', async () => {
    const cohort = { _id: 'c1' };
    const Cohort = buildModel(cohort);
    const result = await getCohortById({ cohortId: 'c1' }, {}, { models: { Cohort } });
    expect(result).toBe(cohort);
  });

  it('throws 404 when cohort is not found', async () => {
    const Cohort = buildModel(null);
    await expect(getCohortById({ cohortId: 'missing' }, {}, { models: { Cohort } }))
      .rejects.toMatchObject({ statusCode: 404, message: 'This cohort does not exist' });
  });
});
