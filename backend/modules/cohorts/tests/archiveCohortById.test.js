import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import archiveCohortById from '../services/archiveCohortById.js';

const db = setupMongo();

describe('archiveCohortById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks edit access', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    await archiveCohortById({ cohortId: cohort._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: cohort._id }, ctx);
  });

  it('marks the cohort as archived with archivedAt and archivedBy', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({ name: 'C' });

    await archiveCohortById({ cohortId: cohort._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Cohort.findById(cohort._id).lean();
    expect(stored.isArchived).toBe(true);
    expect(String(stored.archivedBy)).toBe(String(userId));
    expect(stored.archivedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when not found', async () => {
    await expect(
      archiveCohortById({ cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
