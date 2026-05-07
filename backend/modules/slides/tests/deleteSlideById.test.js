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

import deleteSlideById from '../services/deleteSlideById.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('deleteSlideById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the slide does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      deleteSlideById(
        { slideId: 'sl1' },
        {},
        { models: { Slide: { findByIdAndUpdate, find: vi.fn() }, Block: { updateMany: vi.fn() } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the slide, renumbers siblings from 0, soft-deletes the slide blocks, and marks the scenario changed', async () => {
    const deletedSlide = { _id: 'sl1', scenario: 's1', stemRef: 'st1', ref: 'slideRef1' };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(deletedSlide);

    const sibling0 = { sortOrder: 5, save: vi.fn().mockResolvedValue() };
    const sibling1 = { sortOrder: 7, save: vi.fn().mockResolvedValue() };
    const sibling2 = { sortOrder: 9, save: vi.fn().mockResolvedValue() };

    const sort = vi.fn().mockResolvedValue([sibling0, sibling1, sibling2]);
    const find = vi.fn(() => ({ sort }));

    const updateMany = vi.fn().mockResolvedValue({});

    const result = await deleteSlideById(
      { slideId: 'sl1' },
      {},
      {
        models: {
          Slide: { findByIdAndUpdate, find },
          Block: { updateMany }
        },
        user: { _id: 'u1' }
      }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'sl1',
      { isDeleted: true, deletedAt: FIXED_NOW, deletedBy: 'u1' },
      { new: true }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', stemRef: 'st1', isDeleted: false });
    expect(sort).toHaveBeenCalledWith('sortOrder');

    expect(sibling0.sortOrder).toBe(0);
    expect(sibling1.sortOrder).toBe(1);
    expect(sibling2.sortOrder).toBe(2);
    expect(sibling0.save).toHaveBeenCalled();
    expect(sibling1.save).toHaveBeenCalled();
    expect(sibling2.save).toHaveBeenCalled();

    expect(updateMany).toHaveBeenCalledWith(
      { slideRef: 'slideRef1' },
      { isDeleted: true, deletedAt: FIXED_NOW, deletedBy: 'u1' }
    );

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toBe(deletedSlide);
  });
});
