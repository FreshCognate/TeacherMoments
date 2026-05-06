import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlockById from '../services/getBlockById.js';

const buildModelChain = (resolvedValue) => {
  const populate2 = vi.fn().mockResolvedValue(resolvedValue);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  return {
    findById: vi.fn(() => ({ populate: populate1 }))
  };
};

describe('getBlockById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks scenario access via the block id', async () => {
    const Block = buildModelChain({ _id: 'b1' });
    const ctx = { models: { Block } };

    await getBlockById({ blockId: 'b1' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'b1', modelType: 'Block' }, ctx);
  });

  it('returns the populated block when found', async () => {
    const block = { _id: 'b1', name: 'Block' };
    const Block = buildModelChain(block);

    const result = await getBlockById({ blockId: 'b1' }, {}, { models: { Block } });
    expect(result).toBe(block);
  });

  it('throws 404 when not found', async () => {
    const Block = buildModelChain(null);

    await expect(getBlockById({ blockId: 'missing' }, {}, { models: { Block } }))
      .rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });
});
