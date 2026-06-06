import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getScenarioById from '../services/getScenarioById.js';

const db = setupMongo();

describe('getScenarioById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks access', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models };
    await getScenarioById({ scenarioId: scenario._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: scenario._id, modelType: 'Scenario' }, ctx);
  });

  it('returns the scenario when found', async () => {
    const scenario = await db.models.Scenario.create({ name: 'My Scenario' });
    const result = await getScenarioById({ scenarioId: scenario._id }, {}, { models: db.models });
    expect(String(result._id)).toBe(String(scenario._id));
    expect(result.name).toBe('My Scenario');
  });

  it('throws 404 when not found', async () => {
    await expect(
      getScenarioById({ scenarioId: new mongoose.Types.ObjectId() }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
