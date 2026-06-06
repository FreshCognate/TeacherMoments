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

import deleteBlockById from '../services/deleteBlockById.js';

const db = setupMongo();

const sortOrdersFor = async (scenario, slideRef) => {
  const blocks = await db.models.Block.find({ scenario, slideRef, isDeleted: false }).lean();
  return sortBy(blocks, 'sortOrder').map((b) => b.sortOrder);
};

describe('deleteBlockById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access via the block id', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const [block] = await db.models.Block.create([{ scenario, slideRef, sortOrder: 0 }]);
    const ctx = { user: { _id: new mongoose.Types.ObjectId() }, models: db.models };

    await deleteBlockById({ blockId: block._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: block._id, modelType: 'Block' }, ctx);
  });

  it('throws 404 when the block does not exist', async () => {
    await expect(
      deleteBlockById({ blockId: new mongoose.Types.ObjectId() }, {}, { user: { _id: new mongoose.Types.ObjectId() }, models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('soft-deletes the block and renumbers the remaining slide blocks from 0', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();

    const [first, second, third] = await db.models.Block.create([
      { scenario, slideRef, sortOrder: 0 },
      { scenario, slideRef, sortOrder: 1 },
      { scenario, slideRef, sortOrder: 2 }
    ]);

    await deleteBlockById({ blockId: second._id }, {}, { user: { _id: userId }, models: db.models });

    const deleted = await db.models.Block.findById(second._id).lean();
    expect(deleted.isDeleted).toBe(true);
    expect(String(deleted.deletedBy)).toBe(String(userId));

    expect(await sortOrdersFor(scenario, slideRef)).toEqual([0, 1]);
    const survivors = sortBy(await db.models.Block.find({ scenario, slideRef, isDeleted: false }).lean(), 'sortOrder')
      .map((b) => String(b._id));
    expect(survivors).toEqual([String(first._id), String(third._id)]);
  });

  it('marks the scenario as having changes', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const [block] = await db.models.Block.create([{ scenario, slideRef, sortOrder: 0 }]);
    const ctx = { user: { _id: new mongoose.Types.ObjectId() }, models: db.models };

    await deleteBlockById({ blockId: block._id }, {}, ctx);
    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
  });
});
