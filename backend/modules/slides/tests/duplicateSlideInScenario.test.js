import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, duplicateBlocksMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  duplicateBlocksMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../blocks/services/duplicateBlocks.js', () => ({
  default: (...args) => duplicateBlocksMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import duplicateSlideInScenario from '../services/duplicateSlideInScenario.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

const buildConnection = () => ({
  transaction: vi.fn().mockImplementation((cb) => {
    const promise = (async () => { await cb('SESSION_TOKEN'); })();
    promise.catch = (handler) => promise.then(undefined, handler);
    return promise;
  })
});

describe('duplicateSlideInScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    duplicateBlocksMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the source slide does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const create = vi.fn();
    const find = vi.fn();

    await expect(
      duplicateSlideInScenario(
        { scenario: 's1', slideId: 'sl1' },
        { models: { Slide: { findById, create, find } }, connection: buildConnection() }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('clones the slide one position after the source, bumps later siblings, and duplicates blocks under the new ref', async () => {
    const sourceSlide = {
      _id: 'sl1',
      ref: 'srcRef',
      scenario: 's1',
      stemRef: 'st1',
      sortOrder: 2,
      name: 'Source'
    };

    const sibling0 = { sortOrder: 0, save: vi.fn().mockResolvedValue() };
    const sibling2 = { sortOrder: 2, save: vi.fn().mockResolvedValue() };
    const sibling3 = { sortOrder: 3, save: vi.fn().mockResolvedValue() };

    const findById = vi.fn().mockResolvedValue(sourceSlide);
    const find = vi.fn().mockResolvedValue([sibling0, sibling2, sibling3]);
    const create = vi.fn().mockResolvedValue([{ _id: 'newId', ref: 'newRef' }]);

    const connection = buildConnection();

    const result = await duplicateSlideInScenario(
      { scenario: 's1', slideId: 'sl1' },
      { models: { Slide: { findById, create, find } }, connection }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'sl1', modelType: 'Slide' }, expect.any(Object));

    const [createArgs, createOptions] = create.mock.calls[0];
    expect(createArgs[0]).toMatchObject({
      scenario: 's1',
      stemRef: 'st1',
      sortOrder: 3,
      name: 'Source',
      originalRef: 'srcRef',
      originalScenario: 's1',
      createdAt: FIXED_NOW
    });
    expect(createArgs[0]._id).toBeUndefined();
    expect(createArgs[0].ref).toBeUndefined();
    expect(createOptions).toEqual({ session: 'SESSION_TOKEN' });

    // Slides at or above the new sortOrder (3) get bumped: sibling3 → 4. sibling2 stays. sibling0 stays.
    expect(sibling0.sortOrder).toBe(0);
    expect(sibling0.save).not.toHaveBeenCalled();
    expect(sibling2.sortOrder).toBe(2);
    expect(sibling2.save).not.toHaveBeenCalled();
    expect(sibling3.sortOrder).toBe(4);
    expect(sibling3.save).toHaveBeenCalledWith({ session: 'SESSION_TOKEN' });

    expect(duplicateBlocksMock).toHaveBeenCalledWith(
      { scenarioId: 's1', slideRef: 'srcRef', newScenarioId: 's1', newSlideRef: 'newRef' },
      expect.objectContaining({ session: 'SESSION_TOKEN' })
    );

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual({ _id: 'newId', ref: 'newRef' });
  });
});
