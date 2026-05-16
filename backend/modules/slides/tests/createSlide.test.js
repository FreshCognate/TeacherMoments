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

import createSlide from '../services/createSlide.js';

describe('createSlide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws when the scenario does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const find = vi.fn().mockResolvedValue([]);
    const create = vi.fn();

    await expect(
      createSlide(
        { scenario: 's1', sortOrder: 0, stemRef: 'st1' },
        {},
        { models: { Scenario: { findById }, Slide: { find, create } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(create).not.toHaveBeenCalled();
  });

  it('shifts the sortOrder of slides at or above the insertion index, then creates the new slide', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });

    const slideAbove = { sortOrder: 2, save: vi.fn().mockResolvedValue() };
    const slideAtIndex = { sortOrder: 1, save: vi.fn().mockResolvedValue() };
    const slideBelow = { sortOrder: 0, save: vi.fn().mockResolvedValue() };

    const find = vi.fn().mockResolvedValue([slideAbove, slideAtIndex, slideBelow]);
    const create = vi.fn().mockResolvedValue({ _id: 'newSlide' });

    const result = await createSlide(
      { scenario: 's1', sortOrder: 1, stemRef: 'st1' },
      {},
      { models: { Scenario: { findById }, Slide: { find, create } }, user: { _id: 'u1' } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, expect.any(Object));
    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });

    expect(slideAbove.sortOrder).toBe(3);
    expect(slideAbove.save).toHaveBeenCalled();
    expect(slideAtIndex.sortOrder).toBe(2);
    expect(slideAtIndex.save).toHaveBeenCalled();
    expect(slideBelow.sortOrder).toBe(0);
    expect(slideBelow.save).not.toHaveBeenCalled();

    expect(create).toHaveBeenCalledWith({
      scenario: 's1',
      stemRef: 'st1',
      createdBy: 'u1',
      sortOrder: 1
    });

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual({ _id: 'newSlide' });
  });
});
