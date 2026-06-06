import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlocksByScenarioId from '../services/getBlocksByScenarioId.js';

const db = setupMongo();

describe('getBlocksByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const ctx = { models: db.models };
    await getBlocksByScenarioId({ scenarioId }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: scenarioId, modelType: 'Scenario' }, ctx);
  });

  it('returns the scenario\'s non-deleted blocks sorted by sortOrder by default', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    await db.models.Block.create([
      { scenario, slideRef, sortOrder: 1, name: 'B' },
      { scenario, slideRef, sortOrder: 0, name: 'A' },
      { scenario, slideRef, sortOrder: 2, name: 'Deleted', isDeleted: true }
    ]);

    const { blocks } = await getBlocksByScenarioId({ scenarioId: scenario }, {}, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['A', 'B']);
  });

  it('honours an explicit isDeleted', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0, name: 'Active' },
      { scenario, slideRef, sortOrder: 1, name: 'Deleted', isDeleted: true }
    ]);

    const { blocks } = await getBlocksByScenarioId({ scenarioId: scenario }, { isDeleted: true }, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['Deleted']);
  });
});
