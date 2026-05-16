import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreTriggerById from '../services/restoreTriggerById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('restoreTriggerById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears the deletion fields and stamps the restoring user', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 't1', isDeleted: false });

    const result = await restoreTriggerById(
      { triggerId: 't1' },
      {},
      { models: { Trigger: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 't1', modelType: 'Trigger' }, expect.any(Object));
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: FIXED_NOW,
        updatedBy: 'u1'
      },
      { new: true }
    );
    expect(result).toEqual({ _id: 't1', isDeleted: false });
  });

  it('throws 404 when the trigger does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      restoreTriggerById({ triggerId: 't1' }, {}, { models: { Trigger: { findByIdAndUpdate } }, user: { _id: 'u1' } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
