import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreSlideById from '../services/restoreSlideById.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('restoreSlideById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears the deletion fields and stamps the user/time of restore', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'sl1', isDeleted: false });

    const result = await restoreSlideById(
      { slideId: 'sl1' },
      {},
      { models: { Slide: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'sl1', modelType: 'Slide' }, expect.any(Object));
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'sl1',
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: FIXED_NOW,
        updatedBy: 'u1'
      },
      { new: true }
    );
    expect(result).toEqual({ _id: 'sl1', isDeleted: false });
  });

  it('throws 404 when the slide does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      restoreSlideById({ slideId: 'sl1' }, {}, { models: { Slide: { findByIdAndUpdate } }, user: { _id: 'u1' } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
