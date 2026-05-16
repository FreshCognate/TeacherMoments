import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import updateStemById from '../services/updateStemById.js';

describe('updateStemById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('updates the stem and marks the scenario as changed', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'st1', scenario: 's1', name: 'Renamed' });

    const result = await updateStemById(
      { stemId: 'st1', update: { name: 'Renamed' } },
      {},
      { models: { Stem: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('st1', { name: 'Renamed' }, { new: true });
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual({ _id: 'st1', scenario: 's1', name: 'Renamed' });
  });

  it('throws 404 when the stem does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      updateStemById({ stemId: 'st1', update: {} }, {}, { models: { Stem: { findByIdAndUpdate } } })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(setHasChangesMock).not.toHaveBeenCalled();
  });
});
