import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getPublishedCohortById from '../services/getPublishedCohortById.js';

describe('getPublishedCohortById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks view access then returns the cohort', async () => {
    const cohort = { _id: 'c1' };
    const findById = vi.fn().mockResolvedValue(cohort);
    const ctx = { models: { Cohort: { findById } } };

    const result = await getPublishedCohortById({ cohortId: 'c1' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
    expect(findById).toHaveBeenCalledWith('c1');
    expect(result).toBe(cohort);
  });

  it('throws 404 when not found', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(getPublishedCohortById({ cohortId: 'missing' }, {}, { models: { Cohort: { findById } } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
