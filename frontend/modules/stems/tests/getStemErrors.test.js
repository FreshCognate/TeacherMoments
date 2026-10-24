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

const buildStem = (branchingOptions) => ({ _id: 'st1', ref: 'stem-1', branchingOptions });

const childStem = { ref: 'child-1', stemRef: 'stem-1' };

const promptCondition = { _id: 'c1', prompts: [{ ref: 'block-1', text: 'yes' }] };

const noPromptConditionsError = {
  message: 'Stem has child stems but no prompt conditions set up',
  elementType: 'STEM',
  elementId: 'st1'
};

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

    expect(getStemErrors(buildStem([]))).toEqual([noPromptConditionsError]);
  });

  it('flags a stem whose branching options have no conditions', () => {
    seedStems([childStem]);

    const stem = buildStem([{ elementRef: 'child-1', conditions: [] }]);

    expect(getStemErrors(stem)).toEqual([noPromptConditionsError]);
  });

  it('flags a stem whose conditions have no prompts', () => {
    seedStems([childStem]);

    const stem = buildStem([{ elementRef: 'child-1', conditions: [{ _id: 'c1', prompts: [] }] }]);

    expect(getStemErrors(stem)).toEqual([noPromptConditionsError]);
  });

  it('returns no errors when a branching option has a prompt condition', () => {
    seedStems([childStem, { ref: 'child-2', stemRef: 'stem-1' }]);

    const stem = buildStem([
      { elementRef: 'child-1', conditions: [] },
      { elementRef: 'child-2', conditions: [promptCondition] }
    ]);

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('ignores stems that belong to another parent stem', () => {
    seedStems([{ ref: 'child-x', stemRef: 'other-stem' }]);

    expect(getStemErrors(buildStem([]))).toEqual([]);
  });
});
