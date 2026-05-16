import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getStemsByScenarioId from '../services/getStemsByScenarioId.js';

describe('getStemsByScenarioId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access then queries non-deleted stems by default', async () => {
    const find = vi.fn().mockResolvedValue([{ _id: 'st1' }]);

    const result = await getStemsByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Stem: { find } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, expect.any(Object));
    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(result).toEqual({ stems: [{ _id: 'st1' }] });
  });

  it('honours an explicit isDeleted flag', async () => {
    const find = vi.fn().mockResolvedValue([]);

    await getStemsByScenarioId(
      { scenarioId: 's1' },
      { isDeleted: true },
      { models: { Stem: { find } } }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: true });
  });
});
