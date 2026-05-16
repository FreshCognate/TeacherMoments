import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import removeUserFromCohort from '../services/removeUserFromCohort.js';

describe('removeUserFromCohort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks edit access before pulling the cohort', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'u-target' });
    const ctx = { models: { User: { findByIdAndUpdate } } };
    await removeUserFromCohort({ userId: 'u-target', cohortId: 'c1' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('pulls the cohort entry from the user', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'u-target' });
    await removeUserFromCohort(
      { userId: 'u-target', cohortId: 'c1' },
      {},
      { models: { User: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'u-target',
      { $pull: { cohorts: { cohort: 'c1' } } },
      { new: true }
    );
  });

  it('throws 404 when the user does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);
    await expect(removeUserFromCohort(
      { userId: 'missing', cohortId: 'c1' },
      {},
      { models: { User: { findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
