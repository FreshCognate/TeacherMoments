import { describe, it, expect, vi } from 'vitest';
import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';

describe('checkHasAccessToEditCohort', () => {
  it('throws 401 when no cohortId is provided', async () => {
    await expect(checkHasAccessToEditCohort({}, { user: { _id: 'u1' }, models: {} }))
      .rejects.toMatchObject({ statusCode: 401, message: 'You do not have access to this cohort' });
  });

  it('returns the cohort via findById for SUPER_ADMIN without checking collaborators', async () => {
    const cohort = { _id: 'cohort-1', name: 'Cohort' };
    const findById = vi.fn().mockResolvedValue(cohort);
    const findOne = vi.fn();

    const result = await checkHasAccessToEditCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'SUPER_ADMIN' }, models: { Cohort: { findById, findOne } } }
    );

    expect(findById).toHaveBeenCalledWith('cohort-1');
    expect(findOne).not.toHaveBeenCalled();
    expect(result).toBe(cohort);
  });

  it('queries for a cohort where the user is OWNER or AUTHOR', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'cohort-1' });

    await checkHasAccessToEditCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1' }, models: { Cohort: { findOne } } }
    );

    expect(findOne).toHaveBeenCalledWith({
      _id: 'cohort-1',
      collaborators: {
        $elemMatch: {
          user: 'u1',
          role: { $in: ['OWNER', 'AUTHOR'] }
        }
      }
    });
  });

  it('returns the cohort when the user has edit access', async () => {
    const cohort = { _id: 'cohort-1', name: 'Cohort' };
    const findOne = vi.fn().mockResolvedValue(cohort);

    const result = await checkHasAccessToEditCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1' }, models: { Cohort: { findOne } } }
    );

    expect(result).toBe(cohort);
  });

  it('throws 401 when no matching cohort is found', async () => {
    const findOne = vi.fn().mockResolvedValue(null);

    await expect(checkHasAccessToEditCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1' }, models: { Cohort: { findOne } } }
    )).rejects.toMatchObject({ statusCode: 401, message: 'You do not have access to this cohort' });
  });
});
