import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setScenarioHasChangesMock(...args)
}));

import createBlock from '../services/createBlock.js';

const db = setupMongo();

describe('createBlock (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access before creating', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const ctx = { user: { _id: new mongoose.Types.ObjectId() }, models: db.models };
    await createBlock({ scenario, slideRef: new mongoose.Types.ObjectId(), blockType: 'TEXT' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: scenario, modelType: 'Scenario' }, ctx);
  });

  it('uses the existing block count for the slide as the new sortOrder', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();

    await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0, name: 'A' },
      { scenario, slideRef, sortOrder: 1, name: 'B' }
    ]);

    const block = await createBlock(
      { scenario, slideRef, blockType: 'TEXT' },
      {},
      { user: { _id: userId }, models: db.models }
    );

    expect(block.sortOrder).toBe(2);
    expect(block.blockType).toBe('TEXT');
    expect(String(block.scenario)).toBe(String(scenario));
    expect(String(block.slideRef)).toBe(String(slideRef));
    expect(String(block.createdBy)).toBe(String(userId));
  });

  it('marks the scenario as having changes', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const ctx = { user: { _id: new mongoose.Types.ObjectId() }, models: db.models };
    await createBlock({ scenario, slideRef: new mongoose.Types.ObjectId(), blockType: 'TEXT' }, {}, ctx);
    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
  });
});
