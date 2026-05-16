import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getStemById from '../services/getStemById.js';

describe('getStemById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks stem access then returns the stem', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'st1' });

    const result = await getStemById(
      { stemId: 'st1' },
      {},
      { models: { Stem: { findById } } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith(
      { modelId: 'st1', modelType: 'Stem' },
      { models: { Stem: { findById } } }
    );
    expect(findById).toHaveBeenCalledWith('st1');
    expect(result).toEqual({ _id: 'st1' });
  });

  it('throws 404 when the stem does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      getStemById({ stemId: 'st1' }, {}, { models: { Stem: { findById } } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
