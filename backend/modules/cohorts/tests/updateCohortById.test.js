import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import updateCohortById from '../services/updateCohortById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModel = (cohort) => {
  const populate = vi.fn().mockResolvedValue(cohort);
  return { findByIdAndUpdate: vi.fn(() => ({ populate })) };
};

describe('updateCohortById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies the update with updatedBy and updatedAt', async () => {
    const Cohort = buildModel({ _id: 'c1', name: 'New' });
    await updateCohortById(
      { cohortId: 'c1', update: { name: 'New' } },
      {},
      { models: { Cohort }, user: { _id: 'u1' } }
    );

    expect(Cohort.findByIdAndUpdate).toHaveBeenCalledWith('c1', expect.objectContaining({
      name: 'New',
      updatedBy: 'u1',
      updatedAt: FIXED_NOW
    }), { new: true });
  });

  it('throws 404 when not found', async () => {
    const Cohort = buildModel(null);
    await expect(updateCohortById(
      { cohortId: 'missing', update: {} },
      {},
      { models: { Cohort }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
