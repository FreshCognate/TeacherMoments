import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreCohortById from '../services/restoreCohortById.js';

const db = setupMongo();

describe('restoreCohortById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('clears the deletion fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({
      name: 'C',
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: new mongoose.Types.ObjectId()
    });

    await restoreCohortById({ cohortId: cohort._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Cohort.findById(cohort._id).lean();
    expect(stored.isDeleted).toBe(false);
    expect(stored.deletedAt).toBeNull();
    expect(stored.deletedBy).toBeNull();
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when not found', async () => {
    await expect(
      restoreCohortById({ cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
