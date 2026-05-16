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

import updateTriggerById from '../services/updateTriggerById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('updateTriggerById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stamps updatedAt/updatedBy on the update, applies it, and marks the scenario as changed', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 't1', scenario: 's1' });

    const result = await updateTriggerById(
      { triggerId: 't1', update: { action: 'SHOW_FEEDBACK_FROM_PROMPTS' } },
      {},
      { models: { Trigger: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      { action: 'SHOW_FEEDBACK_FROM_PROMPTS', updatedAt: FIXED_NOW, updatedBy: 'u1' },
      { new: true }
    );
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual({ _id: 't1', scenario: 's1' });
  });

  it('throws 404 when the trigger does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      updateTriggerById(
        { triggerId: 't1', update: {} },
        {},
        { models: { Trigger: { findByIdAndUpdate } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(setHasChangesMock).not.toHaveBeenCalled();
  });
});
