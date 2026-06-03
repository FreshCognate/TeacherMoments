import { describe, it, expect, vi, beforeEach } from 'vitest';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

vi.mock('../../../backend/modules/scenarios/index.js', () => ({}));
vi.mock('../../../backend/modules/slides/index.js', () => ({}));
vi.mock('../../../backend/modules/stems/index.js', () => ({}));

import addStemsToScenarios from '../addStemsToScenarios.js';

const buildModels = ({ scenarios = [], publishedScenarios = [] } = {}) => {
  const stemFindOne = vi.fn();
  const stemFind = vi.fn().mockResolvedValue([]);
  const stemCreate = vi.fn();
  const slideUpdateMany = vi.fn().mockResolvedValue({ modifiedCount: 0 });

  const publishedStemFindOne = vi.fn();
  const publishedStemCreate = vi.fn();
  const publishedSlideUpdateMany = vi.fn().mockResolvedValue({ modifiedCount: 0 });

  return {
    models: {
      Scenario: { find: vi.fn().mockResolvedValue(scenarios) },
      Published_Scenario: { find: vi.fn().mockResolvedValue(publishedScenarios) },
      Stem: { findOne: stemFindOne, find: stemFind, create: stemCreate },
      Published_Stem: { findOne: publishedStemFindOne, create: publishedStemCreate },
      Slide: { updateMany: slideUpdateMany },
      Published_Slide: { updateMany: publishedSlideUpdateMany }
    },
    stemFindOne,
    stemFind,
    stemCreate,
    slideUpdateMany,
    publishedStemFindOne,
    publishedStemCreate,
    publishedSlideUpdateMany
  };
};

describe('addStemsToScenarios', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a root stem and fixes slides when a scenario has no root stem', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }]
    });
    setup.stemFindOne.mockResolvedValue(null);
    setup.stemCreate.mockResolvedValue({ _id: 'st1', ref: 'stRef1' });
    setup.stemFind.mockResolvedValue([{ ref: 'stRef1' }]);
    setup.slideUpdateMany.mockResolvedValue({ modifiedCount: 3 });

    connectDatabaseMock.mockResolvedValue({ models: setup.models });

    await addStemsToScenarios();

    expect(setup.stemFindOne).toHaveBeenCalledWith({ scenario: 's1', isRoot: true });
    expect(setup.stemCreate).toHaveBeenCalledWith({
      scenario: 's1',
      name: 'Stem 1',
      isRoot: true
    });
    expect(setup.slideUpdateMany).toHaveBeenCalledWith(
      { scenario: 's1', $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: ['stRef1'] } }] },
      { stemRef: 'stRef1' }
    );
  });

  it('reuses an existing root stem instead of creating a new one', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }]
    });
    setup.stemFindOne.mockResolvedValue({ _id: 'existing', ref: 'existingRef' });
    setup.stemFind.mockResolvedValue([{ ref: 'existingRef' }]);
    setup.slideUpdateMany.mockResolvedValue({ modifiedCount: 0 });

    connectDatabaseMock.mockResolvedValue({ models: setup.models });

    await addStemsToScenarios();

    expect(setup.stemCreate).not.toHaveBeenCalled();
    expect(setup.slideUpdateMany).toHaveBeenCalledWith(
      { scenario: 's1', $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: ['existingRef'] } }] },
      { stemRef: 'existingRef' }
    );
  });

  it('remaps slides pointing at stems outside the scenario onto the root stem', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }]
    });
    setup.stemFindOne.mockResolvedValue({ _id: 'root', ref: 'rootRef' });
    setup.stemFind.mockResolvedValue([{ ref: 'rootRef' }, { ref: 'childRef' }]);
    setup.slideUpdateMany.mockResolvedValue({ modifiedCount: 2 });

    connectDatabaseMock.mockResolvedValue({ models: setup.models });

    await addStemsToScenarios();

    expect(setup.stemFind).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(setup.slideUpdateMany).toHaveBeenCalledWith(
      { scenario: 's1', $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: ['rootRef', 'childRef'] } }] },
      { stemRef: 'rootRef' }
    );
  });

  it('processes published scenarios via the Published_ models', async () => {
    const setup = buildModels({
      publishedScenarios: [{ _id: 'ps1', name: 'Published' }]
    });
    setup.stemFindOne.mockResolvedValue(null);
    setup.publishedStemFindOne.mockResolvedValue(null);
    setup.publishedStemCreate.mockResolvedValue({ _id: 'pst1', ref: 'pstRef1' });
    setup.publishedSlideUpdateMany.mockResolvedValue({ modifiedCount: 5 });

    connectDatabaseMock.mockResolvedValue({ models: setup.models });

    await addStemsToScenarios();

    expect(setup.publishedStemFindOne).toHaveBeenCalledWith({ scenario: 'ps1', isRoot: true });
    expect(setup.publishedStemCreate).toHaveBeenCalledWith({
      scenario: 'ps1',
      name: 'Stem 1',
      isRoot: true
    });
    expect(setup.publishedSlideUpdateMany).toHaveBeenCalledWith(
      { scenario: 'ps1', stemRef: { $exists: false } },
      { stemRef: 'pstRef1' }
    );
  });

  it('processes multiple scenarios in sequence', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }, { _id: 's2', name: 'B' }]
    });
    setup.stemFindOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: 'existing', ref: 'existingRef' });
    setup.stemCreate.mockResolvedValue({ _id: 'st1', ref: 'stRef1' });
    setup.stemFind
      .mockResolvedValueOnce([{ ref: 'stRef1' }])
      .mockResolvedValueOnce([{ ref: 'existingRef' }]);

    connectDatabaseMock.mockResolvedValue({ models: setup.models });

    await addStemsToScenarios();

    expect(setup.stemCreate).toHaveBeenCalledTimes(1);
    expect(setup.slideUpdateMany).toHaveBeenNthCalledWith(
      1,
      { scenario: 's1', $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: ['stRef1'] } }] },
      { stemRef: 'stRef1' }
    );
    expect(setup.slideUpdateMany).toHaveBeenNthCalledWith(
      2,
      { scenario: 's2', $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: ['existingRef'] } }] },
      { stemRef: 'existingRef' }
    );
  });
});
