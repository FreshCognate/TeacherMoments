import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../services/setScenarioHasChanges.js', () => ({ default: (...args) => setScenarioHasChangesMock(...args) }));

import updateScenarioById from '../services/updateScenarioById.js';

const db = setupMongo();

describe('updateScenarioById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    setScenarioHasChangesMock.mockResolvedValue();
  });

  it('applies the update', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Old' });

    await updateScenarioById(
      { scenarioId: scenario._id, update: { name: 'New' } },
      {},
      { models: db.models }
    );

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.name).toBe('New');
  });

  it('throws 404 when not found', async () => {
    await expect(
      updateScenarioById({ scenarioId: new mongoose.Types.ObjectId(), update: {} }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('marks the scenario as having changes after a successful update', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models };

    await updateScenarioById({ scenarioId: scenario._id, update: {} }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario._id }, {}, ctx);
  });
});
