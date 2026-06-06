import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import sortBy from 'lodash/sortBy.js';
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

import reorderBlock from '../services/reorderBlock.js';

const db = setupMongo();

const orderedIdsFor = async (scenario, slideRef) => {
  const blocks = await db.models.Block.find({ scenario, slideRef, isDeleted: false }).lean();
  return sortBy(blocks, 'sortOrder').map((b) => String(b._id));
};

describe('reorderBlock (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('returns null when sourceIndex or destinationIndex is missing', async () => {
    const result = await reorderBlock({ blockId: 'b1', sourceIndex: 0 }, {}, { models: db.models, user: {} });
    expect(result).toBeNull();
  });

  it('returns null when sourceIndex equals destinationIndex', async () => {
    const result = await reorderBlock(
      { blockId: new mongoose.Types.ObjectId(), sourceIndex: 1, destinationIndex: 1 },
      {},
      { models: db.models, user: {} }
    );
    expect(result).toBeNull();
  });

  it('throws 404 when the block cannot be found', async () => {
    await expect(
      reorderBlock(
        { blockId: new mongoose.Types.ObjectId(), sourceIndex: 0, destinationIndex: 1 },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('moves the block from source to destination and renumbers sortOrder contiguously', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();

    const [a, b, c, d] = await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0 },
      { scenario, slideRef, sortOrder: 1 },
      { scenario, slideRef, sortOrder: 2 },
      { scenario, slideRef, sortOrder: 3 }
    ]);

    const result = await reorderBlock(
      { blockId: a._id, sourceIndex: 0, destinationIndex: 2 },
      {},
      { models: db.models, user: { _id: userId } }
    );

    expect(await orderedIdsFor(scenario, slideRef)).toEqual([
      String(b._id), String(c._id), String(a._id), String(d._id)
    ]);
    expect(String(result._id)).toBe(String(a._id));

    const movedStored = await db.models.Block.findById(a._id).lean();
    expect(String(movedStored.updatedBy)).toBe(String(userId));
  });

  it('marks the scenario as having changes', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const [a] = await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0 },
      { scenario, slideRef, sortOrder: 1 }
    ]);
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };

    await reorderBlock({ blockId: a._id, sourceIndex: 0, destinationIndex: 1 }, {}, ctx);
    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
  });
});
