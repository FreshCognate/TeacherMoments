import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getCohortById from '../services/getCohortById.js';

const db = setupMongo();

describe('getCohortById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks view access', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const ctx = { models: db.models };
    await getCohortById({ cohortId: cohort._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: cohort._id }, ctx);
  });

  it('returns the cohort when found', async () => {
    const cohort = await db.models.Cohort.create({ name: 'Spring' });
    const result = await getCohortById({ cohortId: cohort._id }, {}, { models: db.models });
    expect(String(result._id)).toBe(String(cohort._id));
    expect(result.name).toBe('Spring');
  });

  it('throws 404 when cohort is not found', async () => {
    await expect(
      getCohortById({ cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, message: 'This cohort does not exist' });
  });
});
