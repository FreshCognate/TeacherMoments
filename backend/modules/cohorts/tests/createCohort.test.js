import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { generateInviteTokenMock } = vi.hoisted(() => ({
  generateInviteTokenMock: vi.fn()
}));

vi.mock('../helpers/generateInviteToken.js', () => ({
  default: () => generateInviteTokenMock()
}));

vi.mock('../../slides/services/createSlide.js', () => ({ default: vi.fn() }));

import createCohort from '../services/createCohort.js';

const db = setupMongo();

describe('createCohort (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateInviteTokenMock.mockReturnValue('invite-token-123');
  });

  it('throws 400 when no name is given', async () => {
    await expect(
      createCohort({}, {}, { user: { _id: new mongoose.Types.ObjectId() }, models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'A cohort must have a name' });
  });

  it('persists a cohort with the user as OWNER and an active invite', async () => {
    const userId = new mongoose.Types.ObjectId();

    const created = await createCohort(
      { name: 'Spring Cohort' },
      {},
      { user: { _id: userId }, models: db.models }
    );

    const stored = await db.models.Cohort.findById(created._id).lean();

    expect(stored.name).toBe('Spring Cohort');
    expect(String(stored.createdBy)).toBe(String(userId));

    expect(stored.collaborators).toHaveLength(1);
    expect(stored.collaborators[0]).toMatchObject({ role: 'OWNER' });
    expect(String(stored.collaborators[0].user)).toBe(String(userId));

    expect(stored.invites).toHaveLength(1);
    expect(stored.invites[0]).toMatchObject({ token: 'invite-token-123', isActive: true });
    expect(String(stored.invites[0].createdBy)).toBe(String(userId));
  });

  it('returns the created cohort', async () => {
    const result = await createCohort(
      { name: 'Cohort' },
      {},
      { user: { _id: new mongoose.Types.ObjectId() }, models: db.models }
    );

    expect(result._id).toBeDefined();
    expect(result.name).toBe('Cohort');
  });
});
