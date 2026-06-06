import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlockById from '../services/getBlockById.js';

const db = setupMongo();

const createBlock = () => db.models.Block.create({
  scenario: new mongoose.Types.ObjectId(),
  slideRef: new mongoose.Types.ObjectId(),
  name: 'Block'
});

describe('getBlockById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access via the block id', async () => {
    const block = await createBlock();
    const ctx = { models: db.models };
    await getBlockById({ blockId: block._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: block._id, modelType: 'Block' }, ctx);
  });

  it('returns the block when found', async () => {
    const block = await createBlock();
    const result = await getBlockById({ blockId: block._id }, {}, { models: db.models });
    expect(String(result._id)).toBe(String(block._id));
  });

  it('throws 404 when not found', async () => {
    await expect(
      getBlockById({ blockId: new mongoose.Types.ObjectId() }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });
});
