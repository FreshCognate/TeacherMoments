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

import reorderBlock from '../services/reorderBlock.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const makeBlock = (id) => ({ _id: id, sortOrder: 99, save: vi.fn() });

describe('reorderBlock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when sourceIndex or destinationIndex is missing', async () => {
    const result = await reorderBlock({ blockId: 'b1', sourceIndex: 0 }, {}, { models: {}, user: {} });
    expect(result).toBeNull();
  });

  it('returns null when sourceIndex equals destinationIndex', async () => {
    const findById = vi.fn();
    const find = vi.fn();
    const result = await reorderBlock(
      { blockId: 'b1', sourceIndex: 1, destinationIndex: 1 },
      {},
      { models: { Block: { findById, find } }, user: {} }
    );
    expect(result).toBeNull();
    expect(findById).not.toHaveBeenCalled();
  });

  it('throws 404 when the block cannot be found', async () => {
    const models = {
      Block: {
        findById: vi.fn().mockResolvedValue(null),
        find: vi.fn()
      }
    };

    await expect(reorderBlock(
      { blockId: 'missing', sourceIndex: 0, destinationIndex: 1 },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('moves the block from source to destination and renumbers sortOrder contiguously', async () => {
    const a = makeBlock('a');
    const b = makeBlock('b');
    const c = makeBlock('c');
    const d = makeBlock('d');

    const models = {
      Block: {
        findById: vi.fn().mockResolvedValue({ _id: 'a', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([a, b, c, d]) }))
      }
    };

    const result = await reorderBlock(
      { blockId: 'a', sourceIndex: 0, destinationIndex: 2 },
      {},
      { models, user: { _id: 'u1' } }
    );

    expect(b.sortOrder).toBe(0);
    expect(c.sortOrder).toBe(1);
    expect(a.sortOrder).toBe(2);
    expect(d.sortOrder).toBe(3);

    [a, b, c, d].forEach((block) => {
      expect(block.save).toHaveBeenCalled();
      expect(block.updatedAt).toEqual(FIXED_NOW);
      expect(block.updatedBy).toBe('u1');
    });

    expect(result).toBe(a);
  });

  it('marks the scenario as having changes', async () => {
    const a = makeBlock('a');
    const b = makeBlock('b');

    const models = {
      Block: {
        findById: vi.fn().mockResolvedValue({ _id: 'a', scenario: 's1', slideRef: 'slide-1' }),
        find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([a, b]) }))
      }
    };
    const ctx = { models, user: { _id: 'u1' } };

    await reorderBlock({ blockId: 'a', sourceIndex: 0, destinationIndex: 1 }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });
});
