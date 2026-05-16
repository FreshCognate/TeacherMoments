import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('deleteBlockById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks scenario access via the block id', async () => {
    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue({ _id: 'b1', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) }))
      }
    };
    const ctx = { user: { _id: 'u1' }, models };

    await deleteBlockById({ blockId: 'b1' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'b1', modelType: 'Block' }, ctx);
  });

  it('throws 404 when the block does not exist', async () => {
    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue(null),
        find: vi.fn()
      }
    };

    await expect(deleteBlockById(
      { blockId: 'missing' },
      {},
      { user: { _id: 'u1' }, models }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('soft-deletes with timestamps and actor', async () => {
    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue({ _id: 'b1', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) }))
      }
    };

    await deleteBlockById({ blockId: 'b1' }, {}, { user: { _id: 'u1' }, models });

    expect(models.Block.findByIdAndUpdate).toHaveBeenCalledWith('b1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'u1'
    }, { new: true });
  });

  it('renumbers the remaining slide blocks contiguously from 0', async () => {
    const remainingBlocks = [
      { _id: 'a', sortOrder: 99, save: vi.fn() },
      { _id: 'b', sortOrder: 99, save: vi.fn() },
      { _id: 'c', sortOrder: 99, save: vi.fn() }
    ];

    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue({ _id: 'b1', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(remainingBlocks) }))
      }
    };

    await deleteBlockById({ blockId: 'b1' }, {}, { user: { _id: 'u1' }, models });

    expect(remainingBlocks.map((b) => b.sortOrder)).toEqual([0, 1, 2]);
    remainingBlocks.forEach((b) => expect(b.save).toHaveBeenCalled());
  });

  it('marks the scenario as having changes', async () => {
    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue({ _id: 'b1', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) }))
      }
    };
    const ctx = { user: { _id: 'u1' }, models };

    await deleteBlockById({ blockId: 'b1' }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });

  it('returns the deleted block', async () => {
    const deletedBlock = { _id: 'b1', scenario: 's1', slideRef: 'slide-1', isDeleted: true };
    const models = {
      Block: {
        findByIdAndUpdate: vi.fn().mockResolvedValue(deletedBlock),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) }))
      }
    };

    const result = await deleteBlockById({ blockId: 'b1' }, {}, { user: { _id: 'u1' }, models });
    expect(result).toBe(deletedBlock);
  });
});
