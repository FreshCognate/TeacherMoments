import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getTriggersByScenarioId from '../services/getTriggersByScenarioId.js';

describe('getTriggersByScenarioId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access then queries by sortOrder, defaulting isDeleted to false', async () => {
    const sort = vi.fn().mockResolvedValue([{ _id: 't1' }]);
    const find = vi.fn(() => ({ sort }));

    const result = await getTriggersByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Trigger: { find } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith(
      { modelId: 's1', modelType: 'Scenario' },
      expect.any(Object)
    );
    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(sort).toHaveBeenCalledWith('sortOrder');
    expect(result).toEqual({ triggers: [{ _id: 't1' }] });
  });

  it('honours an explicit isDeleted flag', async () => {
    const sort = vi.fn().mockResolvedValue([]);
    const find = vi.fn(() => ({ sort }));

    await getTriggersByScenarioId(
      { scenarioId: 's1' },
      { isDeleted: true },
      { models: { Trigger: { find } } }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: true });
  });
});
