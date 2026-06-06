import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlocksByScenarioIdAndSlideRef from '../services/getBlocksByScenarioIdAndSlideRef.js';

const db = setupMongo();

describe('getBlocksByScenarioIdAndSlideRef (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const ctx = { models: db.models };
    await getBlocksByScenarioIdAndSlideRef({ scenarioId, slideRef: new mongoose.Types.ObjectId() }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: scenarioId, modelType: 'Scenario' }, ctx);
  });

  it('returns only the blocks for the given scenario and slideRef', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const otherSlide = new mongoose.Types.ObjectId();

    await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0, name: 'OnSlide' },
      { scenario, slideRef: otherSlide, sortOrder: 0, name: 'OtherSlide' }
    ]);

    const { blocks } = await getBlocksByScenarioIdAndSlideRef(
      { scenarioId: scenario, slideRef },
      { isDeleted: false },
      { models: db.models }
    );

    expect(blocks.map((b) => b.name)).toEqual(['OnSlide']);
  });
});
