import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getSlideById from '../services/getSlideById.js';

describe('getSlideById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks slide access then returns the slide', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'sl1' });

    const result = await getSlideById(
      { slideId: 'sl1' },
      {},
      { models: { Slide: { findById } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith(
      { modelId: 'sl1', modelType: 'Slide' },
      { models: { Slide: { findById } } }
    );
    expect(findById).toHaveBeenCalledWith('sl1');
    expect(result).toEqual({ _id: 'sl1' });
  });

  it('throws 404 when the slide does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      getSlideById({ slideId: 'sl1' }, {}, { models: { Slide: { findById } } })
    ).rejects.toMatchObject({ message: 'This slide does not exist', statusCode: 404 });
  });
});
