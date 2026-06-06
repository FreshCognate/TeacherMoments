import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import updateCohortById from '../services/updateCohortById.js';

const db = setupMongo();

describe('updateCohortById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('applies the update with updatedBy and updatedAt', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({ name: 'Old' });

    await updateCohortById(
      { cohortId: cohort._id, update: { name: 'New' } },
      {},
      { models: db.models, user: { _id: userId } }
    );

    const stored = await db.models.Cohort.findById(cohort._id).lean();
    expect(stored.name).toBe('New');
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when not found', async () => {
    await expect(
      updateCohortById(
        { cohortId: new mongoose.Types.ObjectId(), update: {} },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
