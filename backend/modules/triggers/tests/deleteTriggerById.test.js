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

import deleteTriggerById from '../services/deleteTriggerById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('deleteTriggerById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the trigger does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      deleteTriggerById(
        { triggerId: 't1' },
        {},
        {
          models: { Trigger: { findByIdAndUpdate, find: vi.fn() } },
          user: { _id: 'u1' }
        }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the trigger, renumbers siblings within scenario+triggerType+elementRef, and marks the scenario changed', async () => {
    const deletedTrigger = { _id: 't1', scenario: 's1', triggerType: 'BLOCK', elementRef: 'b1' };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(deletedTrigger);

    const sib0 = { sortOrder: 5, save: vi.fn().mockResolvedValue() };
    const sib1 = { sortOrder: 8, save: vi.fn().mockResolvedValue() };

    const sort = vi.fn().mockResolvedValue([sib0, sib1]);
    const find = vi.fn(() => ({ sort }));

    const context = {
      models: { Trigger: { findByIdAndUpdate, find } },
      user: { _id: 'u1' }
    };

    const result = await deleteTriggerById({ triggerId: 't1' }, {}, context);

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      { isDeleted: true, deletedAt: FIXED_NOW, deletedBy: 'u1' },
      { new: true }
    );
    expect(find).toHaveBeenCalledWith({
      scenario: 's1',
      triggerType: 'BLOCK',
      elementRef: 'b1',
      isDeleted: false
    });
    expect(sort).toHaveBeenCalledWith('sortOrder');

    expect(sib0.sortOrder).toBe(0);
    expect(sib1.sortOrder).toBe(1);
    expect(sib0.save).toHaveBeenCalled();
    expect(sib1.save).toHaveBeenCalled();

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toBe(deletedTrigger);
  });
});
