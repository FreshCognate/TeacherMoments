import { describe, it, expect, beforeEach } from 'vitest';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';
import getStemErrors from '../helpers/getStemErrors';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

const buildStem = (branchingOptions, defaultBranchingStemRef = null) => ({
  _id: 'st1',
  ref: 'stem-1',
  branchingOptions,
  defaultBranchingStemRef
});

const childStem = { ref: 'child-1', stemRef: 'stem-1', name: 'Child 1' };

const promptCondition = { _id: 'c1', prompts: [{ ref: 'block-1', text: 'yes' }] };

const noPromptConditionsError = {
  message: 'Stem has child stems but no prompt conditions set up',
  elementType: 'STEM',
  elementId: 'st1'
};

const buildUnreachableError = (name) => ({
  message: `Stem "${name}" cannot be navigated to`,
  elementType: 'STEM',
  elementId: 'st1'
});

describe('getStemErrors', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns no errors when the stem has no child stems', () => {
    seedStems([]);

    expect(getStemErrors(buildStem([]))).toEqual([]);
  });

  it('flags a stem with child stems and no branching options', () => {
    seedStems([childStem]);

    expect(getStemErrors(buildStem([]))).toEqual([
      noPromptConditionsError,
      buildUnreachableError('Child 1')
    ]);
  });

  it('flags a stem whose branching options have no conditions', () => {
    seedStems([childStem]);

    const stem = buildStem([{ elementRef: 'child-1', conditions: [] }]);

    expect(getStemErrors(stem)).toEqual([
      noPromptConditionsError,
      buildUnreachableError('Child 1')
    ]);
  });

  it('flags a stem whose conditions have no prompts', () => {
    seedStems([childStem]);

    const stem = buildStem([{ elementRef: 'child-1', conditions: [{ _id: 'c1', prompts: [] }] }]);

    expect(getStemErrors(stem)).toEqual([
      noPromptConditionsError,
      buildUnreachableError('Child 1')
    ]);
  });

  it('returns no errors when every child stem has a prompt condition', () => {
    seedStems([childStem, { ref: 'child-2', stemRef: 'stem-1', name: 'Child 2' }]);

    const stem = buildStem([
      { elementRef: 'child-1', conditions: [promptCondition] },
      { elementRef: 'child-2', conditions: [promptCondition] }
    ]);

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('returns no errors when child stems are reached by a condition or the default', () => {
    seedStems([childStem, { ref: 'child-2', stemRef: 'stem-1', name: 'Child 2' }]);

    const stem = buildStem([
      { elementRef: 'child-1', conditions: [promptCondition] }
    ], 'child-2');

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('flags a child stem that has no condition and is not the default', () => {
    seedStems([
      childStem,
      { ref: 'child-2', stemRef: 'stem-1', name: 'Child 2' },
      { ref: 'child-3', stemRef: 'stem-1', name: 'Child 3' }
    ]);

    const stem = buildStem([
      { elementRef: 'child-1', conditions: [promptCondition] },
      { elementRef: 'child-3', conditions: [] }
    ], 'child-2');

    expect(getStemErrors(stem)).toEqual([buildUnreachableError('Child 3')]);
  });

  it('flags each child stem that cannot be navigated to', () => {
    seedStems([
      childStem,
      { ref: 'child-2', stemRef: 'stem-1', name: 'Child 2' },
      { ref: 'child-3', stemRef: 'stem-1', name: 'Child 3' }
    ]);

    const stem = buildStem([{ elementRef: 'child-1', conditions: [promptCondition] }]);

    expect(getStemErrors(stem)).toEqual([
      buildUnreachableError('Child 2'),
      buildUnreachableError('Child 3')
    ]);
  });

  it('ignores stems that belong to another parent stem', () => {
    seedStems([{ ref: 'child-x', stemRef: 'other-stem', name: 'Child X' }]);

    expect(getStemErrors(buildStem([]))).toEqual([]);
  });
});
