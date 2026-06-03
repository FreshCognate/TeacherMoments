import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import duplicateStems from '../services/duplicateStems.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('duplicateStems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clones every non-deleted stem under the new scenario, stamping originalRef', async () => {
    const stems = [
      { _id: 'id1', ref: 'rootRef', scenario: 'sOld', name: 'Root', isRoot: true },
      { _id: 'id2', ref: 'childRef', scenario: 'sOld', name: 'Child', stemRef: 'rootRef', slideRef: 'slideRef' }
    ];

    const find = vi.fn().mockResolvedValue(stems);
    const create = vi.fn()
      .mockResolvedValueOnce([{ _id: 'newId1', ref: 'newRootRef', originalRef: 'rootRef' }])
      .mockResolvedValueOnce([{ _id: 'newId2', ref: 'newChildRef', originalRef: 'childRef' }]);

    const context = {
      models: { Stem: { find, create } },
      session: 'SESSION_TOKEN'
    };

    const result = await duplicateStems({ scenarioId: 'sOld', newScenarioId: 'sNew' }, context);

    expect(find).toHaveBeenCalledWith({ scenario: 'sOld', isDeleted: false });

    const [firstArgs, firstOptions] = create.mock.calls[0];
    expect(firstArgs[0]).toMatchObject({
      scenario: 'sNew',
      name: 'Root',
      isRoot: true,
      originalRef: 'rootRef',
      createdAt: FIXED_NOW
    });
    expect(firstArgs[0]._id).toBeUndefined();
    expect(firstArgs[0].ref).toBeUndefined();
    expect(firstOptions).toEqual({ session: 'SESSION_TOKEN' });

    const [secondArgs] = create.mock.calls[1];
    expect(secondArgs[0]).toMatchObject({
      scenario: 'sNew',
      name: 'Child',
      stemRef: 'rootRef',
      slideRef: 'slideRef',
      originalRef: 'childRef'
    });

    expect(result).toEqual([
      { _id: 'newId1', ref: 'newRootRef', originalRef: 'rootRef' },
      { _id: 'newId2', ref: 'newChildRef', originalRef: 'childRef' }
    ]);
  });
});
