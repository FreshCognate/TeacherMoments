import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import unarchiveCohortById from '../services/unarchiveCohortById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModel = (cohort) => {
  const populate = vi.fn().mockResolvedValue(cohort);
  return { findByIdAndUpdate: vi.fn(() => ({ populate })) };
};

describe('unarchiveCohortById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears archive fields and stamps updatedAt/updatedBy', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    await unarchiveCohortById({ cohortId: 'c1' }, {}, { models: { Cohort }, user: { _id: 'u1' } });
    expect(Cohort.findByIdAndUpdate).toHaveBeenCalledWith('c1', {
      isArchived: false,
      archivedAt: null,
      archivedBy: null,
      updatedAt: FIXED_NOW,
      updatedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const Cohort = buildModel(null);
    await expect(unarchiveCohortById({ cohortId: 'missing' }, {}, { models: { Cohort }, user: { _id: 'u1' } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
