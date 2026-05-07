import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import deleteCohortById from '../services/deleteCohortById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('deleteCohortById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('soft-deletes with deletedAt and deletedBy', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'c1', isDeleted: true });
    await deleteCohortById({ cohortId: 'c1' }, {}, { models: { Cohort: { findByIdAndUpdate } }, user: { _id: 'u1' } });

    expect(findByIdAndUpdate).toHaveBeenCalledWith('c1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);
    await expect(deleteCohortById({ cohortId: 'missing' }, {}, { models: { Cohort: { findByIdAndUpdate } }, user: { _id: 'u1' } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
