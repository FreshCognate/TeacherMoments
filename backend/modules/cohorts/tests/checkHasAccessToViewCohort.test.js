import { describe, it, expect, vi } from 'vitest';
import checkHasAccessToViewCohort from '../helpers/checkHasAccessToViewCohort.js';

describe('checkHasAccessToViewCohort', () => {
  it('throws 401 when no cohortId is provided', async () => {
    await expect(checkHasAccessToViewCohort({}, { user: { _id: 'u1' }, models: {} }))
      .rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns true when the user has the cohort in their cohorts array', async () => {
    const models = {
      User: { findOne: vi.fn().mockResolvedValue({ _id: 'u1' }) },
      Cohort: { findOne: vi.fn() }
    };

    const result = await checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'USER' }, models }
    );

    expect(models.User.findOne).toHaveBeenCalledWith({
      _id: 'u1',
      'cohorts.cohort': 'cohort-1'
    });
    expect(result).toBe(true);
  });

  it('grants access for SUPER_ADMIN without any membership or collaborator lookup', async () => {
    const models = {
      User: { findOne: vi.fn() },
      Cohort: { findOne: vi.fn() }
    };

    const result = await checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'SUPER_ADMIN' }, models }
    );

    expect(result).toBe(true);
    expect(models.User.findOne).not.toHaveBeenCalled();
    expect(models.Cohort.findOne).not.toHaveBeenCalled();
  });

  it('grants access via collaborator role for ADMIN', async () => {
    const models = {
      User: { findOne: vi.fn().mockResolvedValue(null) },
      Cohort: { findOne: vi.fn().mockResolvedValue({ _id: 'cohort-1' }) }
    };

    const result = await checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'ADMIN' }, models }
    );

    expect(result).toBe(true);
  });

  it('grants access via collaborator role for FACILITATOR', async () => {
    const models = {
      User: { findOne: vi.fn().mockResolvedValue(null) },
      Cohort: { findOne: vi.fn().mockResolvedValue({ _id: 'cohort-1' }) }
    };

    const result = await checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'FACILITATOR' }, models }
    );

    expect(result).toBe(true);
  });

  it('does not check collaborator membership for plain USERs', async () => {
    const models = {
      User: { findOne: vi.fn().mockResolvedValue(null) },
      Cohort: { findOne: vi.fn() }
    };

    await expect(checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'USER' }, models }
    )).rejects.toMatchObject({ statusCode: 401 });

    expect(models.Cohort.findOne).not.toHaveBeenCalled();
  });

  it('throws 401 when neither cohort membership nor collaborator role grants access', async () => {
    const models = {
      User: { findOne: vi.fn().mockResolvedValue(null) },
      Cohort: { findOne: vi.fn().mockResolvedValue(null) }
    };

    await expect(checkHasAccessToViewCohort(
      { cohortId: 'cohort-1' },
      { user: { _id: 'u1', role: 'ADMIN' }, models }
    )).rejects.toMatchObject({ statusCode: 401 });
  });
});
