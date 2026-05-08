import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setHasChangesMock, createSlideMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn(),
  createSlideMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));
vi.mock('../../slides/services/createSlide.js', () => ({
  default: (...args) => createSlideMock(...args)
}));

import createStem from '../services/createStem.js';

describe('createStem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    createSlideMock.mockResolvedValue();
  });

  it('throws when the scenario does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const create = vi.fn();

    await expect(
      createStem(
        { scenario: 's1', stemRef: 'sr1', sortOrder: 0 },
        {},
        { models: { Scenario: { findById }, Stem: { create } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(create).not.toHaveBeenCalled();
    expect(createSlideMock).not.toHaveBeenCalled();
  });

  it('creates a non-root stem and seeds it with an initial slide', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const create = vi.fn().mockResolvedValue({ _id: 'st1', ref: 'stRef1' });

    const context = {
      models: { Scenario: { findById }, Stem: { create } },
      user: { _id: 'u1' }
    };

    const result = await createStem(
      { scenario: 's1', stemRef: 'parentRef', slideRef: 'slideRef', sortOrder: 2, name: 'Branch', isRoot: false },
      {},
      context
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, context);
    expect(create).toHaveBeenCalledWith({
      scenario: 's1',
      stemRef: 'parentRef',
      slideRef: 'slideRef',
      sortOrder: 2,
      name: 'Branch',
      isRoot: false,
      createdBy: 'u1'
    });
    expect(createSlideMock).toHaveBeenCalledWith(
      { scenario: 's1', sortOrder: 0, stemRef: 'stRef1' },
      {},
      context
    );
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toEqual({ _id: 'st1', ref: 'stRef1' });
  });

  it('does not seed a slide for a root stem', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const create = vi.fn().mockResolvedValue({ _id: 'st1', ref: 'stRef1' });

    await createStem(
      { scenario: 's1', stemRef: null, sortOrder: 0, isRoot: true },
      {},
      { models: { Scenario: { findById }, Stem: { create } }, user: { _id: 'u1' } }
    );

    expect(createSlideMock).not.toHaveBeenCalled();
    expect(setHasChangesMock).toHaveBeenCalled();
  });
});
