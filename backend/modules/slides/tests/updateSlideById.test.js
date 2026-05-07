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

import updateSlideById from '../services/updateSlideById.js';

describe('updateSlideById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('updates the slide and marks the scenario as changed', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'sl1', scenario: 's1', name: 'Renamed' });

    const result = await updateSlideById(
      { slideId: 'sl1', update: { name: 'Renamed' } },
      {},
      { models: { Slide: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('sl1', { name: 'Renamed' }, { new: true });
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual({ _id: 'sl1', scenario: 's1', name: 'Renamed' });
  });

  it('throws 404 when the slide does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      updateSlideById({ slideId: 'sl1', update: {} }, {}, { models: { Slide: { findByIdAndUpdate } } })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(setHasChangesMock).not.toHaveBeenCalled();
  });
});
