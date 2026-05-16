import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getTriggerById from '../services/getTriggerById.js';

describe('getTriggerById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks trigger access then returns the trigger', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 't1' });

    const result = await getTriggerById(
      { triggerId: 't1' },
      {},
      { models: { Trigger: { findById } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith(
      { modelId: 't1', modelType: 'Trigger' },
      expect.any(Object)
    );
    expect(findById).toHaveBeenCalledWith('t1');
    expect(result).toEqual({ _id: 't1' });
  });

  it('throws 404 when the trigger does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      getTriggerById({ triggerId: 't1' }, {}, { models: { Trigger: { findById } } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
