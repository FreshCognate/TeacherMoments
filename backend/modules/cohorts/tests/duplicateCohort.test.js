import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, generateInviteTokenMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  generateInviteTokenMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../helpers/generateInviteToken.js', () => ({
  default: () => generateInviteTokenMock()
}));

import duplicateCohort from '../services/duplicateCohort.js';

const db = setupMongo();

describe('duplicateCohort (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    generateInviteTokenMock.mockReturnValue('new-token');
  });

  it('throws 404 when the source cohort is not found', async () => {
    await expect(
      duplicateCohort({ cohortId: new mongoose.Types.ObjectId() }, {}, {
        models: db.models,
        user: { _id: new mongoose.Types.ObjectId() },
        connection: db.connection
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('creates a duplicate with " - Duplicate" appended to the name and a fresh invite', async () => {
    const userId = new mongoose.Types.ObjectId();
    const source = await db.models.Cohort.create({ name: 'Original' });

    const result = await duplicateCohort({ cohortId: source._id }, {}, {
      models: db.models,
      user: { _id: userId },
      connection: db.connection
    });

    expect(String(result._id)).not.toBe(String(source._id));

    const stored = await db.models.Cohort.findById(result._id).lean();
    expect(stored.name).toBe('Original - Duplicate');
    expect(String(stored.originalCohort)).toBe(String(source._id));
    expect(String(stored.createdBy)).toBe(String(userId));
    expect(stored.invites).toHaveLength(1);
    expect(stored.invites[0]).toMatchObject({ token: 'new-token', isActive: true });
    expect(String(stored.invites[0].createdBy)).toBe(String(userId));
  });
});
