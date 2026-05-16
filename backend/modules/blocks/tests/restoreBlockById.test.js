import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreBlockById from '../services/restoreBlockById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('restoreBlockById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks scenario access via the block id', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'b1' });
    const ctx = { models: { Block: { findByIdAndUpdate } }, user: { _id: 'u1' } };

    await restoreBlockById({ blockId: 'b1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'b1', modelType: 'Block' }, ctx);
  });

  it('clears the deletion fields and stamps updatedAt/updatedBy', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'b1' });

    await restoreBlockById(
      { blockId: 'b1' },
      {},
      { models: { Block: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('b1', {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedAt: FIXED_NOW,
      updatedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when the block does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(restoreBlockById(
      { blockId: 'missing' },
      {},
      { models: { Block: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });
});
