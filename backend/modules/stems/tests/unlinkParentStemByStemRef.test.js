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

import unlinkParentStemByStemRef from '../services/unlinkParentStemByStemRef.js';

describe('unlinkParentStemByStemRef', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('removes the stem from the parent branching options and clears it as the parent default', async () => {
    const stem = { _id: 'st1', ref: 'child', scenario: 's1' };
    const findById = vi.fn().mockResolvedValue(stem);
    const countDocuments = vi.fn().mockResolvedValue(2);
    const updateOne = vi.fn().mockResolvedValue({});

    const result = await unlinkParentStemByStemRef(
      { stemId: 'st1', parentStemRef: 'parent' },
      {},
      { models: { Stem: { findById, countDocuments, updateOne } } }
    );

    expect(countDocuments).toHaveBeenCalledWith({
      scenario: 's1',
      'branchingOptions.stemRef': 'child',
      isDeleted: false
    });
    expect(updateOne).toHaveBeenCalledWith(
      { scenario: 's1', ref: 'parent', isDeleted: false },
      { $pull: { branchingOptions: { stemRef: 'child' } } }
    );
    expect(updateOne).toHaveBeenCalledWith(
      { scenario: 's1', ref: 'parent', defaultBranchingStemRef: 'child' },
      { defaultBranchingStemRef: null }
    );
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, expect.any(Object));
    expect(result).toEqual(stem);
  });

  it('throws 400 and leaves the parent alone when the stem has only one parent', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'st1', ref: 'child', scenario: 's1' });
    const countDocuments = vi.fn().mockResolvedValue(1);
    const updateOne = vi.fn();

    await expect(
      unlinkParentStemByStemRef(
        { stemId: 'st1', parentStemRef: 'parent' },
        {},
        { models: { Stem: { findById, countDocuments, updateOne } } }
      )
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(updateOne).not.toHaveBeenCalled();
    expect(setHasChangesMock).not.toHaveBeenCalled();
  });

  it('throws 404 when the stem does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const updateOne = vi.fn();

    await expect(
      unlinkParentStemByStemRef(
        { stemId: 'st1', parentStemRef: 'parent' },
        {},
        { models: { Stem: { findById, updateOne } } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(updateOne).not.toHaveBeenCalled();
  });
});
