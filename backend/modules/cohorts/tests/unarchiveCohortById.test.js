import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import unarchiveCohortById from '../services/unarchiveCohortById.js';

const db = setupMongo();

describe('unarchiveCohortById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('clears archive fields and stamps updatedBy', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({
      name: 'C',
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: new mongoose.Types.ObjectId()
    });

    await unarchiveCohortById({ cohortId: cohort._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Cohort.findById(cohort._id).lean();
    expect(stored.isArchived).toBe(false);
    expect(stored.archivedAt).toBeNull();
    expect(stored.archivedBy).toBeNull();
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when not found', async () => {
    await expect(
      unarchiveCohortById({ cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
