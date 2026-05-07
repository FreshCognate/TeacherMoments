import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import addUserToCohort from '../services/addUserToCohort.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('addUserToCohort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('pushes the cohort onto the user with addedAt timestamp', async () => {
    const updated = { _id: 'u1', cohorts: [{ cohort: 'c1' }] };
    const findOneAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await addUserToCohort(
      { cohortId: 'c1' },
      {},
      { models: { User: { findOneAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'u1', 'cohorts.cohort': { $ne: 'c1' } },
      { $push: { cohorts: { cohort: 'c1', addedAt: FIXED_NOW } } },
      { new: true }
    );
    expect(result).toBe(updated);
  });

  it('returns the existing user when they already have the cohort', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue(null);
    const existing = { _id: 'u1', cohorts: [{ cohort: 'c1' }] };
    const findOne = vi.fn().mockResolvedValue(existing);

    const result = await addUserToCohort(
      { cohortId: 'c1' },
      {},
      { models: { User: { findOneAndUpdate, findOne } }, user: { _id: 'u1' } }
    );

    expect(findOne).toHaveBeenCalledWith({ _id: 'u1', 'cohorts.cohort': 'c1' });
    expect(result).toBe(existing);
  });

  it('throws 404 when neither push nor lookup finds the user', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue(null);
    const findOne = vi.fn().mockResolvedValue(null);

    await expect(addUserToCohort(
      { cohortId: 'c1' },
      {},
      { models: { User: { findOneAndUpdate, findOne } }, user: { _id: 'missing' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
