import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import archiveCohortById from '../services/archiveCohortById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModel = (cohort) => {
  const populate = vi.fn().mockResolvedValue(cohort);
  return { findByIdAndUpdate: vi.fn(() => ({ populate })) };
};

describe('archiveCohortById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks edit access', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    const ctx = { models: { Cohort }, user: { _id: 'u1' } };
    await archiveCohortById({ cohortId: 'c1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('marks the cohort as archived with archivedAt and archivedBy', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    await archiveCohortById({ cohortId: 'c1' }, {}, { models: { Cohort }, user: { _id: 'u1' } });
    expect(Cohort.findByIdAndUpdate).toHaveBeenCalledWith('c1', {
      isArchived: true,
      archivedAt: FIXED_NOW,
      archivedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const Cohort = buildModel(null);
    await expect(archiveCohortById({ cohortId: 'missing' }, {}, { models: { Cohort }, user: { _id: 'u1' } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
