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
        { scenario: 's1', parentStemRef: 'parentStemRef' },
        {},
        { models: { Scenario: { findById }, Stem: { create } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(create).not.toHaveBeenCalled();
    expect(createSlideMock).not.toHaveBeenCalled();
  });

  it('throws when the parent stem does not exist', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const findOne = vi.fn().mockResolvedValue(null);
    const create = vi.fn();

    await expect(
      createStem(
        { scenario: 's1', parentStemRef: 'parentStemRef' },
        {},
        { models: { Scenario: { findById }, Stem: { create, findOne } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(findOne).toHaveBeenCalledWith({ scenario: 's1', ref: 'parentStemRef', isDeleted: false });
    expect(create).not.toHaveBeenCalled();
  });

  it('creates a child stem, seeds it with a slide and adds it to the parent branching options', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const findOne = vi.fn().mockResolvedValue({ _id: 'parent1', branchingOptions: [{ stemRef: 'existing1' }, { stemRef: 'existing2' }] });
    const create = vi.fn().mockResolvedValue({ _id: 'st1', ref: 'stRef1' });
    const updateOne = vi.fn().mockResolvedValue();

    const context = {
      models: { Scenario: { findById }, Stem: { create, findOne, updateOne } },
      user: { _id: 'u1' }
    };

    const result = await createStem(
      { scenario: 's1', parentStemRef: 'parentStemRef', isRoot: false },
      {},
      context
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, context);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      scenario: 's1',
      name: 'Stem 3',
      isRoot: false,
      createdBy: 'u1'
    });
    expect(createSlideMock).toHaveBeenCalledTimes(1);
    expect(createSlideMock).toHaveBeenCalledWith(
      { scenario: 's1', sortOrder: 0, stemRef: 'stRef1' },
      {},
      context
    );
    expect(updateOne).toHaveBeenCalledWith(
      { _id: 'parent1' },
      { $push: { branchingOptions: { $each: [{ stemRef: 'stRef1', conditions: [] }] } } }
    );
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toEqual({ _id: 'st1', ref: 'stRef1' });
  });

  it('seeds a second stem and slide for the first child of a parent stem and adds both in order', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const findOne = vi.fn().mockResolvedValue({ _id: 'parent1', branchingOptions: [] });
    const create = vi.fn()
      .mockResolvedValueOnce({ _id: 'st1', ref: 'stRef1' })
      .mockResolvedValueOnce({ _id: 'st2', ref: 'stRef2' });
    const updateOne = vi.fn().mockResolvedValue();

    const context = {
      models: { Scenario: { findById }, Stem: { create, findOne, updateOne } },
      user: { _id: 'u1' }
    };

    await createStem(
      { scenario: 's1', parentStemRef: 'parentStemRef', isRoot: false },
      {},
      context
    );

    expect(create).toHaveBeenCalledTimes(2);
    expect(create).toHaveBeenNthCalledWith(1, {
      scenario: 's1',
      name: 'Stem 1',
      isRoot: false,
      createdBy: 'u1'
    });
    expect(create).toHaveBeenNthCalledWith(2, {
      scenario: 's1',
      name: 'Stem 2',
      isRoot: false,
      createdBy: 'u1'
    });
    expect(createSlideMock).toHaveBeenCalledTimes(2);
    expect(createSlideMock).toHaveBeenNthCalledWith(1, { scenario: 's1', sortOrder: 0, stemRef: 'stRef1' }, {}, context);
    expect(createSlideMock).toHaveBeenNthCalledWith(2, { scenario: 's1', sortOrder: 0, stemRef: 'stRef2' }, {}, context);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: 'parent1' },
      {
        $push: {
          branchingOptions: {
            $each: [
              { stemRef: 'stRef1', conditions: [] },
              { stemRef: 'stRef2', conditions: [] }
            ]
          }
        }
      }
    );
  });

  it('does not seed a slide or touch a parent for a root stem', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 's1' });
    const findOne = vi.fn();
    const create = vi.fn().mockResolvedValue({ _id: 'st1', ref: 'stRef1' });
    const updateOne = vi.fn();

    await createStem(
      { scenario: 's1', name: 'Stem 1', isRoot: true },
      {},
      { models: { Scenario: { findById }, Stem: { create, findOne, updateOne } }, user: { _id: 'u1' } }
    );

    expect(findOne).not.toHaveBeenCalled();
    expect(createSlideMock).not.toHaveBeenCalled();
    expect(updateOne).not.toHaveBeenCalled();
    expect(setHasChangesMock).toHaveBeenCalled();
  });
});
