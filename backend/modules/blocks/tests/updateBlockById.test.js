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

import updateBlockById from '../services/updateBlockById.js';

const db = setupMongo();

const createBlock = (scenario) => db.models.Block.create({
  scenario: scenario || new mongoose.Types.ObjectId(),
  slideRef: new mongoose.Types.ObjectId(),
  name: 'Old'
});

describe('updateBlockById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access via the block id', async () => {
    const block = await createBlock();
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    await updateBlockById({ blockId: block._id, update: { name: 'new' } }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: block._id, modelType: 'Block' }, ctx);
  });

  it('applies the update with updatedBy and updatedAt', async () => {
    const userId = new mongoose.Types.ObjectId();
    const block = await createBlock();

    await updateBlockById(
      { blockId: block._id, update: { name: 'new' } },
      {},
      { models: db.models, user: { _id: userId } }
    );

    const stored = await db.models.Block.findById(block._id).lean();
    expect(stored.name).toBe('new');
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });

  it('throws 404 when the block does not exist', async () => {
    await expect(
      updateBlockById({ blockId: new mongoose.Types.ObjectId(), update: {} }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('marks the scenario as having changes after a successful update', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const block = await createBlock(scenario);
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };

    await updateBlockById({ blockId: block._id, update: { name: 'new' } }, {}, ctx);
    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
  });
});
