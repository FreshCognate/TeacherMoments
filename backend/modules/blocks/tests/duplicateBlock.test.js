import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import duplicateBlock from '../services/duplicateBlock.js';

const db = setupMongo();

describe('duplicateBlock (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access via the source block id', async () => {
    const source = await db.models.Block.create({
      scenario: new mongoose.Types.ObjectId(),
      slideRef: new mongoose.Types.ObjectId(),
      blockType: 'TEXT'
    });
    const ctx = { models: db.models };

    await duplicateBlock({ blockId: source._id, newScenarioId: new mongoose.Types.ObjectId(), newSlideRef: new mongoose.Types.ObjectId() }, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: source._id, modelType: 'Block' }, ctx);
  });

  it('creates a new block with original-* pointers and the new scenario/slideRef', async () => {
    const sourceScenario = new mongoose.Types.ObjectId();
    const sourceSlide = new mongoose.Types.ObjectId();
    const newScenarioId = new mongoose.Types.ObjectId();
    const newSlideRef = new mongoose.Types.ObjectId();

    const source = await db.models.Block.create({
      scenario: sourceScenario,
      slideRef: sourceSlide,
      blockType: 'TEXT',
      name: 'Source'
    });

    await duplicateBlock(
      { blockId: source._id, newScenarioId, newSlideRef },
      { models: db.models }
    );

    const duplicated = await db.models.Block.findOne({ scenario: newScenarioId, originalRef: source.ref }).lean();
    expect(duplicated).toBeDefined();
    expect(String(duplicated.slideRef)).toBe(String(newSlideRef));
    expect(String(duplicated.originalSlideRef)).toBe(String(sourceSlide));
    expect(String(duplicated.originalScenario)).toBe(String(sourceScenario));
    expect(duplicated.blockType).toBe('TEXT');
    expect(duplicated.name).toBe('Source');
    expect(String(duplicated._id)).not.toBe(String(source._id));
  });
});
