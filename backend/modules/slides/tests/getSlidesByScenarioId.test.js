import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getSlidesByScenarioId from '../services/getSlidesByScenarioId.js';

describe('getSlidesByScenarioId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access then queries by sortOrder, defaulting isDeleted to false', async () => {
    const sort = vi.fn().mockResolvedValue([{ _id: 'sl1' }]);
    const find = vi.fn(() => ({ sort }));

    const result = await getSlidesByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Slide: { find } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith(
      { modelId: 's1', modelType: 'Scenario' },
      expect.any(Object)
    );
    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(sort).toHaveBeenCalledWith('sortOrder');
    expect(result).toEqual({ slides: [{ _id: 'sl1' }] });
  });

  it('honours an explicit isDeleted flag', async () => {
    const sort = vi.fn().mockResolvedValue([]);
    const find = vi.fn(() => ({ sort }));

    await getSlidesByScenarioId(
      { scenarioId: 's1' },
      { isDeleted: true },
      { models: { Slide: { find } } }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: true });
  });
});
