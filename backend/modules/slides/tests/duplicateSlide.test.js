import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, duplicateBlocksMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  duplicateBlocksMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../blocks/services/duplicateBlocks.js', () => ({
  default: (...args) => duplicateBlocksMock(...args)
}));

import duplicateSlide from '../services/duplicateSlide.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('duplicateSlide', () => {
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

  it('clones the slide under the new scenario, stamps origin refs, and triggers block duplication', async () => {
    const original = {
      _id: 'origId',
      ref: 'origRef',
      scenario: 'sOld',
      stemRef: 'st1',
      sortOrder: 2,
      name: 'Original'
    };

    const findById = vi.fn().mockResolvedValue(original);
    const create = vi.fn().mockResolvedValue([{ _id: 'newId', ref: 'newRef' }]);

    const context = {
      models: { Slide: { findById, create } },
      session: 'SESSION_TOKEN'
    };

    const result = await duplicateSlide({ slideId: 'origId', newScenarioId: 'sNew' }, context);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'origId', modelType: 'Slide' }, context);

    const [createArgs, createOptions] = create.mock.calls[0];
    expect(createArgs).toHaveLength(1);
    expect(createArgs[0]).toMatchObject({
      scenario: 'sNew',
      stemRef: 'st1',
      sortOrder: 2,
      name: 'Original',
      originalRef: 'origRef',
      originalScenario: 'sOld',
      createdAt: FIXED_NOW
    });
    expect(createArgs[0]._id).toBeUndefined();
    expect(createArgs[0].ref).toBeUndefined();
    expect(createOptions).toEqual({ session: 'SESSION_TOKEN' });

    expect(duplicateBlocksMock).toHaveBeenCalledWith(
      { scenarioId: 'sOld', slideRef: 'origRef', newScenarioId: 'sNew', newSlideRef: 'newRef' },
      context
    );
    expect(result).toEqual({ _id: 'newId', ref: 'newRef' });
  });
});
