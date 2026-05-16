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

import moveSlideInScenario from '../services/moveSlideInScenario.js';

const buildContext = ({ existingSlide, slides }) => {
  const findById = vi.fn().mockResolvedValue(existingSlide);

  const exec = vi.fn().mockResolvedValue(slides);
  const session = vi.fn(() => ({ exec }));
  const sort = vi.fn(() => ({ session }));
  const find = vi.fn(() => ({ sort }));

  const transaction = vi.fn(async (cb) => {
    const ret = cb('SESSION_TOKEN');
    return ret;
  });
  transaction.mockImplementation(async (cb) => {
    await cb('SESSION_TOKEN');
    return { catch: () => {} };
  });

  const connection = {
    transaction: vi.fn().mockImplementation((cb) => {
      const promise = (async () => { await cb('SESSION_TOKEN'); })();
      promise.catch = (handler) => promise.then(undefined, handler);
      return promise;
    })
  };

  return {
    models: { Slide: { findById, find } },
    connection,
    findById,
    find,
    sort,
    session,
    exec
  };
};

describe('moveSlideInScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the slide does not exist', async () => {
    const ctx = buildContext({ existingSlide: null, slides: [] });

    await expect(
      moveSlideInScenario(
        { scenario: 's1', slideId: 'sl1', sourceIndex: 0, destinationIndex: 1 },
        ctx
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns the slide untouched when sourceIndex equals destinationIndex', async () => {
    const existingSlide = { _id: 'sl1', scenario: 's1', stemRef: 'st1' };
    const ctx = buildContext({ existingSlide, slides: [] });

    const result = await moveSlideInScenario(
      { scenario: 's1', slideId: 'sl1', sourceIndex: 2, destinationIndex: 2 },
      ctx
    );

    expect(result).toBe(existingSlide);
    expect(ctx.connection.transaction).not.toHaveBeenCalled();
    expect(setHasChangesMock).not.toHaveBeenCalled();
  });

  it('moves the slide within the stem-grouping and renumbers the resulting order', async () => {
    const existingSlide = { _id: 'sl1', scenario: 's1', stemRef: 'st1' };

    const slideA = { _id: 'a', sortOrder: 0, save: vi.fn().mockResolvedValue() };
    const slideB = { _id: 'b', sortOrder: 1, save: vi.fn().mockResolvedValue() };
    const slideC = { _id: 'c', sortOrder: 2, save: vi.fn().mockResolvedValue() };

    const ctx = buildContext({ existingSlide, slides: [slideA, slideB, slideC] });

    const result = await moveSlideInScenario(
      { scenario: 's1', slideId: 'sl1', sourceIndex: 0, destinationIndex: 2 },
      ctx
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'sl1', modelType: 'Slide' }, ctx);
    expect(ctx.find).toHaveBeenCalledWith({ scenario: 's1', stemRef: 'st1', isDeleted: false });
    expect(ctx.sort).toHaveBeenCalledWith('sortOrder');
    expect(ctx.session).toHaveBeenCalledWith('SESSION_TOKEN');

    // After splicing slideA out and inserting at index 2: [slideB, slideC, slideA]
    expect(slideB.sortOrder).toBe(0);
    expect(slideC.sortOrder).toBe(1);
    expect(slideA.sortOrder).toBe(2);
    expect(slideA.save).toHaveBeenCalled();
    expect(slideB.save).toHaveBeenCalled();
    expect(slideC.save).toHaveBeenCalled();

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toBe(existingSlide);
  });
});
