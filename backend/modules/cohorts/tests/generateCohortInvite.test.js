import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import find from 'lodash/find.js';
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

import generateCohortInvite from '../services/generateCohortInvite.js';

const db = setupMongo();

describe('generateCohortInvite (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    generateInviteTokenMock.mockReturnValue('new-token-abc');
  });

  it('deactivates existing active invites and pushes a new active invite', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({
      name: 'C',
      invites: [{ token: 'old-token', isActive: true, createdBy: userId, createdAt: new Date() }]
    });

    await generateCohortInvite({ cohortId: cohort._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Cohort.findById(cohort._id).lean();

    const oldInvite = find(stored.invites, { token: 'old-token' });
    expect(oldInvite.isActive).toBe(false);

    const newInvite = find(stored.invites, { token: 'new-token-abc' });
    expect(newInvite).toBeDefined();
    expect(newInvite.isActive).toBe(true);
    expect(String(newInvite.createdBy)).toBe(String(userId));
  });

  it('throws 404 when the cohort does not exist', async () => {
    await expect(
      generateCohortInvite({ cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
