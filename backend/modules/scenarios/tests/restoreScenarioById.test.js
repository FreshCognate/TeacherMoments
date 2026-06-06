import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreScenarioById from '../services/restoreScenarioById.js';

const db = setupMongo();

describe('restoreScenarioById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('clears the deletion fields and stamps updatedBy', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({
      name: 'S',
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: new mongoose.Types.ObjectId()
    });

    await restoreScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.isDeleted).toBe(false);
    expect(stored.deletedAt).toBeNull();
    expect(stored.deletedBy).toBeNull();
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when not found', async () => {
    await expect(
      restoreScenarioById({ scenarioId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
