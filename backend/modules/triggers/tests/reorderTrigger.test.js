import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import reorderTrigger from '../services/reorderTrigger.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('reorderTrigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when neither sourceIndex nor destinationIndex is set', async () => {
    const result = await reorderTrigger({ triggerId: 't1' }, {}, {});
    expect(result).toBeNull();
    expect(checkAccessMock).not.toHaveBeenCalled();
  });

  it('returns undefined and skips work when source === destination', async () => {
    const findById = vi.fn();

    const result = await reorderTrigger(
      { sourceIndex: 1, destinationIndex: 1, triggerId: 't1' },
      {},
      { models: { Trigger: { findById } }, user: { _id: 'u1' } }
    );

    expect(result).toBeNull();
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 't1', modelType: 'Trigger' }, expect.any(Object));
    expect(findById).not.toHaveBeenCalled();
  });

  it('throws 404 when the trigger does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      reorderTrigger(
        { sourceIndex: 0, destinationIndex: 1, triggerId: 't1' },
        {},
        { models: { Trigger: { findById, find: vi.fn() } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('splices the trigger to the destination index and renumbers, stamping updatedAt/updatedBy', async () => {
    const trigger = { _id: 't1', scenario: 's1', elementRef: 'b1' };
    const findById = vi.fn().mockResolvedValue(trigger);

    const triggerA = { _id: 'a', sortOrder: 0, save: vi.fn().mockResolvedValue() };
    const triggerB = { _id: 'b', sortOrder: 1, save: vi.fn().mockResolvedValue() };
    const triggerC = { _id: 'c', sortOrder: 2, save: vi.fn().mockResolvedValue() };

    const sort = vi.fn().mockResolvedValue([triggerA, triggerB, triggerC]);
    const find = vi.fn(() => ({ sort }));

    const context = {
      models: { Trigger: { findById, find } },
      user: { _id: 'u1' }
    };

    const result = await reorderTrigger(
      { sourceIndex: 0, destinationIndex: 2, triggerId: 't1' },
      {},
      context
    );

    expect(find).toHaveBeenCalledWith({
      scenario: 's1',
      isDeleted: false,
      elementRef: 'b1'
    });
    expect(sort).toHaveBeenCalledWith('sortOrder');

    // [A, B, C] → splice A out from 0, insert at 2 → [B, C, A]
    expect(triggerB.sortOrder).toBe(0);
    expect(triggerC.sortOrder).toBe(1);
    expect(triggerA.sortOrder).toBe(2);

    [triggerA, triggerB, triggerC].forEach(t => {
      expect(t.updatedAt).toEqual(FIXED_NOW);
      expect(t.updatedBy).toBe('u1');
      expect(t.save).toHaveBeenCalled();
    });

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toBe(triggerA);
  });
});
